function ee(r) {
  let i = !1;
  for (let _ = 0; _ < r.length; _++) {
    const y = r[_];
    if (!(y === "" || y == null) && (i = !0, !Number.isFinite(Number(y))))
      return "string";
  }
  return i ? "number" : "string";
}
function ne(r, i, _, y) {
  if (_ === "number") {
    const h = parseFloat(r), s = parseFloat(i);
    return (isNaN(h) ? 0 : h) - (isNaN(s) ? 0 : s);
  }
  const u = r != null ? String(r) : "", m = i != null ? String(i) : "";
  return y ? y.compare(u, m) : u < m ? -1 : u > m ? 1 : 0;
}
if (typeof window < "u") {
  const r = console.warn;
  console.warn = function(...i) {
    typeof i[0] == "string" && (i[0].startsWith("[ln-") || i[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || r.apply(console, i);
  };
}
const jt = {};
function Rt(r, i) {
  jt[r] || (jt[r] = document.querySelector('[data-ln-template="' + r + '"]'));
  const _ = jt[r];
  return _ ? _.content.cloneNode(!0) : (console.warn("[" + (i || "ln-core") + '] Template "' + r + '" not found'), null);
}
function C(r, i, _) {
  r.dispatchEvent(new CustomEvent(i, {
    bubbles: !0,
    detail: _ || {}
  }));
}
function W(r, i, _) {
  const y = new CustomEvent(i, {
    bubbles: !0,
    cancelable: !0,
    detail: _ || {}
  });
  return r.dispatchEvent(y), y;
}
function Le(r, i, _) {
  r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter();
  const y = {
    sort: r.currentSort,
    filters: r.currentFilters,
    search: r.currentSearch
  };
  y[_] = r.name, C(r.dom, i, y);
}
function nt(r, i) {
  if (!r || !i) return r;
  const _ = r.querySelectorAll("[data-ln-field]");
  for (let h = 0; h < _.length; h++) {
    const s = _[h], c = s.getAttribute("data-ln-field");
    i[c] != null && (s.textContent = i[c]);
  }
  const y = r.querySelectorAll("[data-ln-attr]");
  for (let h = 0; h < y.length; h++) {
    const s = y[h], c = s.getAttribute("data-ln-attr").split(",");
    for (let l = 0; l < c.length; l++) {
      const b = c[l].trim().split(":");
      if (b.length !== 2) continue;
      const d = b[0].trim(), g = b[1].trim();
      i[g] != null && s.setAttribute(d, i[g]);
    }
  }
  const u = r.querySelectorAll("[data-ln-show]");
  for (let h = 0; h < u.length; h++) {
    const s = u[h], c = s.getAttribute("data-ln-show");
    c in i && s.classList.toggle("hidden", !i[c]);
  }
  const m = r.querySelectorAll("[data-ln-class]");
  for (let h = 0; h < m.length; h++) {
    const s = m[h], c = s.getAttribute("data-ln-class").split(",");
    for (let l = 0; l < c.length; l++) {
      const b = c[l].trim().split(":");
      if (b.length !== 2) continue;
      const d = b[0].trim(), g = b[1].trim();
      g in i && s.classList.toggle(d, !!i[g]);
    }
  }
  return r;
}
function mn(r, i) {
  r.matches && r.matches("[data-ln-form], [data-ln-fillable]") && r.dispatchEvent(new CustomEvent("ln-fill", { detail: i ?? null, bubbles: !0 }));
  const _ = r.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let y = 0; y < _.length; y++)
    _[y].dispatchEvent(new CustomEvent("ln-fill", { detail: i ?? null, bubbles: !0 }));
  return r;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(r) {
  if (!(!r.target.matches || !r.target.matches("[data-ln-fillable]")))
    if (r.detail)
      nt(r.target, r.detail);
    else {
      const i = r.target.querySelectorAll("[data-ln-field]");
      for (let _ = 0; _ < i.length; _++)
        i[_].textContent = "";
    }
})));
function xt(r, i) {
  if (!r || !i) return r;
  const _ = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
  for (; _.nextNode(); ) {
    const m = _.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(h, s) {
        return i[s] !== void 0 ? i[s] : "";
      }
    ));
  }
  const y = function(m, h) {
    return i[h] !== void 0 ? i[h] : "";
  }, u = Array.from(r.querySelectorAll("*"));
  r.nodeType === 1 && u.push(r);
  for (let m = 0; m < u.length; m++) {
    const h = u[m], s = h.attributes;
    for (let c = 0; c < s.length; c++) {
      const l = s[c];
      l.value.indexOf("{{") !== -1 && h.setAttribute(l.name, l.value.replace(/\{\{\s*(\w+)\s*\}\}/g, y));
    }
  }
  return r;
}
function gn(r, i, _, y, u, m) {
  const h = {};
  for (let c = 0; c < r.children.length; c++) {
    const l = r.children[c], b = l.getAttribute("data-ln-render-key");
    b && (h[b] = l);
  }
  const s = document.createDocumentFragment();
  for (let c = 0; c < i.length; c++) {
    const l = i[c], b = String(y(l));
    let d = h[b];
    if (d)
      u(d, l, c);
    else {
      const g = Rt(_, m);
      if (!g || (xt(g, l), d = g.firstElementChild, !d)) continue;
      d.setAttribute("data-ln-render-key", b), u(d, l, c);
    }
    s.appendChild(d);
  }
  r.textContent = "", r.appendChild(s);
}
function lt(r, i) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      lt(r, i);
    }), console.warn("[" + i + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  r();
}
function ft(r, i, _) {
  if (r) {
    const y = r.querySelector('[data-ln-template="' + i + '"]');
    if (y) return y.content.cloneNode(!0);
  }
  return Rt(i, _);
}
function Nt(r, i) {
  const _ = {}, y = r.querySelectorAll("[" + i + "]");
  for (let u = 0; u < y.length; u++)
    _[y[u].getAttribute(i)] = y[u].textContent, y[u].remove();
  return _;
}
function Vt(r, i, _, y) {
  if (r.nodeType !== 1) return;
  const m = i.indexOf("[") !== -1 || i.indexOf(".") !== -1 || i.indexOf("#") !== -1 ? i : "[" + i + "]", h = Array.from(r.querySelectorAll(m));
  r.matches && r.matches(m) && h.push(r);
  for (const s of h)
    s[_] || (s[_] = new y(s));
}
function Lt(r) {
  return !!(r.offsetWidth || r.offsetHeight || r.getClientRects().length);
}
function Te(r) {
  return !!(!r || r.ctrlKey || r.metaKey || r.shiftKey || r.altKey || typeof r.button == "number" && r.button !== 0);
}
function _n(r) {
  if (!r) return !1;
  if (typeof r.closest == "function")
    return !!r.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const i = String(r.tagName || "").toLowerCase();
  return i === "input" || i === "textarea" || i === "select" || !!r.isContentEditable;
}
function qe(r) {
  return !!(!r || r.disabled || typeof r.getAttribute == "function" && r.getAttribute("aria-disabled") === "true" || typeof r.closest == "function" && r.closest("[inert]"));
}
function bn(r, i) {
  return !r || !document.contains(r) || qe(r) || i && typeof r[i] != "function" ? !1 : Lt(r);
}
function yn(r) {
  const i = r.querySelector('input[name="_method"]');
  return ((i && i.value !== "" ? i.value : r.method) || "").toUpperCase();
}
function xe(r, i) {
  const _ = !!(i && i.typed), y = i && i.exclude, u = {}, m = r.elements, h = {};
  if (_)
    for (let s = 0; s < m.length; s++) {
      const c = m[s];
      c.name && c.type === "checkbox" && !c.disabled && (h[c.name] = (h[c.name] || 0) + 1);
    }
  for (let s = 0; s < m.length; s++) {
    const c = m[s];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(y && c.matches && c.matches(y)))
      if (c.type === "checkbox")
        _ && h[c.name] === 1 ? u[c.name] = c.checked : (u[c.name] || (u[c.name] = []), c.checked && u[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (u[c.name] = c.value);
      else if (c.type === "select-multiple") {
        u[c.name] = [];
        for (let l = 0; l < c.options.length; l++)
          c.options[l].selected && u[c.name].push(c.options[l].value);
      } else if (_ && c.type === "hidden")
        u[c.name] = c.value;
      else if (_ && (c.type === "number" || c.type === "range")) {
        const l = Number(c.value);
        u[c.name] = c.value === "" || isNaN(l) ? null : l;
      } else
        u[c.name] = c.value;
  }
  return u;
}
function vn(r) {
  if (typeof r != "string") return !!r;
  const i = r.trim().toLowerCase();
  return i !== "false" && i !== "0" && i !== "" && i !== "off" && i !== "no";
}
function ke(r, i) {
  const _ = r.elements, y = [], u = {};
  for (let m = 0; m < _.length; m++) {
    const h = _[m];
    h.name && h.type === "checkbox" && (u[h.name] = (u[h.name] || 0) + 1);
  }
  for (let m = 0; m < _.length; m++) {
    const h = _[m];
    if (h.type === "file" || h.type === "submit" || h.type === "button") continue;
    const s = h.getAttribute("data-ln-fill-as") || h.name;
    if (!s || !(s in i)) continue;
    const c = i[s];
    if (h.type === "checkbox") {
      if (Array.isArray(c))
        h.checked = c.indexOf(h.value) !== -1;
      else if (u[h.name] > 1) {
        const l = String(c).split(",").map(function(b) {
          return b.trim();
        });
        h.checked = l.indexOf(h.value) !== -1;
      } else
        h.checked = vn(c);
      y.push(h);
    } else if (h.type === "radio")
      h.checked = h.value === String(c), y.push(h);
    else if (h.type === "select-multiple") {
      if (Array.isArray(c))
        for (let l = 0; l < h.options.length; l++)
          h.options[l].selected = c.indexOf(h.options[l].value) !== -1;
      y.push(h);
    } else
      h.value = c, y.push(h);
  }
  return y;
}
const he = {
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
function G(r) {
  const i = r ? r.closest("[lang]") : null, _ = (i ? i.getAttribute("lang") || i.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!_) return "en-US";
  const y = _.trim().toLowerCase();
  return y.indexOf("-") === -1 && he[y] ? he[y] : _;
}
function Pt() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, lt(function() {
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
function wt(r) {
  return r.hasAttribute("data-ln-value") ? r.getAttribute("data-ln-value") : r.textContent.trim();
}
function Ie(r, i, { get: _, set: y }) {
  Object.defineProperty(r, "value", {
    get: function() {
      return _ ? _.call(this) : i.get.call(this);
    },
    set: function(u) {
      y ? y.call(this, u, (m) => i.set.call(this, m)) : i.set.call(this, u);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function wn() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Wt() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const r = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let i = 0; i < r.length; i++)
      r[i]();
  }
}
function En() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function it(r) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(r) : setTimeout(r, 0)) : r();
}
function P(r, i, _, y, u = {}) {
  const m = u.extraAttributes || [], h = u.onAttributeChange || null, s = u.onSubtreeChange || null, c = u.onInit || null;
  function l(d) {
    const g = d || document.body;
    Vt(g, r, i, _), c && c(g);
  }
  lt(function() {
    const d = new MutationObserver(function(f) {
      for (let n = 0; n < f.length; n++) {
        const a = f[n];
        if (a.type === "childList") {
          if (s && a.target) {
            const t = r.indexOf("[") !== -1 || r.indexOf(".") !== -1 || r.indexOf("#") !== -1 ? r : "[" + r + "]", o = a.target.nodeType === 1 ? a.target.matches(t) ? a.target : a.target.closest(t) : a.target.parentElement ? a.target.parentElement.closest(t) : null;
            o && s(o, a);
          }
          for (let e = 0; e < a.addedNodes.length; e++) {
            const t = a.addedNodes[e];
            t.nodeType === 1 && (Vt(t, r, i, _), c && c(t));
          }
          for (let e = 0; e < a.removedNodes.length; e++) {
            const t = a.removedNodes[e];
            if (t.nodeType === 1) {
              const p = r.indexOf("[") !== -1 || r.indexOf(".") !== -1 || r.indexOf("#") !== -1 ? r : "[" + r + "]", v = Array.from(t.querySelectorAll(p));
              t.matches && t.matches(p) && v.push(t);
              for (let w = 0; w < v.length; w++) {
                const E = v[w];
                if (!document.contains(E)) {
                  const S = E[i];
                  S && typeof S.destroy == "function" && S.destroy();
                }
              }
            }
          }
        } else a.type === "attributes" && (h && a.target[i] ? h(a.target, a.attributeName) : (Vt(a.target, r, i, _), c && c(a.target)));
      }
    });
    let g = [];
    if (r.indexOf("[") !== -1) {
      const f = /\[([\w-]+)/g;
      let n;
      for (; (n = f.exec(r)) !== null; )
        g.push(n[1]);
    } else
      g.push(r);
    d.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: g.concat(m)
    });
  }, y || (r.indexOf("[") === -1 ? r.replace("data-", "") : "component")), window[i] = l;
  function b() {
    En() > 0 ? it(function() {
      l(document.body);
    }) : l(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b) : b(), l;
}
function De(r, i) {
  if (r.ctrlKey || r.metaKey || r.shiftKey || r.altKey || r.button !== 0 || !i) return !1;
  const _ = i.getAttribute("href");
  return !(!_ || i.getAttribute("target") === "_blank" || i.hasAttribute("download") || _.startsWith("mailto:") || _.startsWith("tel:") || _ === "#" || _.startsWith("#") || i.hostname && i.hostname !== window.location.hostname);
}
function ct(...r) {
  return r.filter((i) => i != null && i !== "").map((i, _) => _ === 0 ? i.replace(/\/+$/, "") : i.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function St(r, i) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, r, i ? { Authorization: i } : null);
}
function Re(r, i = "ln-core") {
  try {
    return r ? JSON.parse(r) : {};
  } catch (_) {
    return console.error(`[${i}] Invalid headers JSON:`, _), {};
  }
}
const Oe = {};
function An(r, i) {
  Oe[r] = i;
}
function Sn(r) {
  return Oe[r] || { ingress: (i) => i, egress: (i) => i };
}
const Me = {};
function ie(r, i) {
  if (!r || typeof i != "object") return;
  const _ = r.toLowerCase().split("-")[0];
  Me[_] = i;
}
function Tt(r) {
  if (!r) return null;
  const i = r.toLowerCase().split("-")[0];
  return Me[i] || null;
}
ie("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = An, window.lnCore.getDataMapper = Sn, window.lnCore.registerLocaleFallback = ie, window.lnCore.getLocaleFallback = Tt, window.lnCore.fillTemplate = xt, window.lnCore.fill = nt, window.lnCore.lnFill = mn, window.lnCore.renderList = gn, window.lnCore.ensureLocaleObserver = Pt);
function re(r, i) {
  let _ = !1;
  return function() {
    _ || (_ = !0, queueMicrotask(function() {
      _ = !1, r();
    }));
  };
}
function Fe(r) {
  r = r || {};
  let i = r.windowSize > 0 ? r.windowSize : 1e3, _ = r.pageSize > 0 ? r.pageSize : 200, y = r.threshold != null ? r.threshold : 25, u = r.fetchDebounce != null ? r.fetchDebounce : 120;
  const m = typeof r.requestPage == "function" ? r.requestPage : function() {
  }, h = typeof r.onChange == "function" ? r.onChange : function() {
  }, s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
  let b = 0, d = 0, g = 0, f = { sort: null, filters: {}, search: "" }, n = null, a = 0, e = 0, t = !1;
  function o(E) {
    c.set(E, ++a);
  }
  function p() {
    return !!(f && (f.search || f.filters && Object.keys(f.filters).length));
  }
  function v() {
    if (s.size <= i) return;
    const E = Array.from(s.keys()).sort(function(L, T) {
      return (c.get(L) || 0) - (c.get(T) || 0);
    });
    let S = 0;
    for (; s.size > i && S < E.length; )
      s.delete(E[S]), c.delete(E[S]), S++;
  }
  function w(E, S) {
    l.add(E), m(f, E, S);
  }
  return {
    get: function(E) {
      return s.get(E);
    },
    has: function(E) {
      return s.has(E);
    },
    peek: function() {
      return s.size ? s.values().next().value : void 0;
    },
    get logicalTotal() {
      return b;
    },
    get grandTotal() {
      return d;
    },
    get queryGen() {
      return g;
    },
    get size() {
      return s.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(E, S) {
      clearTimeout(n), e = E;
      for (let M = E; M < S; M++)
        s.has(M) && o(M);
      if (b <= 0) return;
      const L = Math.max(0, E - y), T = Math.min(b, S + y), x = Math.floor(L / _), k = Math.floor(Math.max(0, T - 1) / _);
      let O = -1;
      for (let M = x; M <= k; M++) {
        const N = M * _, K = Math.min(_, b - N);
        let U = !1;
        const B = Math.max(N, L), z = Math.min(N + K, T);
        for (let rt = B; rt < z; rt++)
          if (!s.has(rt)) {
            U = !0;
            break;
          }
        if (U && !l.has(N)) {
          O = N;
          break;
        }
      }
      O !== -1 && (n = setTimeout(function() {
        w(O, _);
      }, u));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(E) {
      if (E = E || {}, E.queryGen != null && E.queryGen !== g) return !1;
      const S = E.offset || 0, L = E.data || [];
      let T = 0;
      for (let x = 0; x < L.length; x++)
        L[x] != null && T++;
      if (T === 0 && (E.provisional || E.filtered > 0))
        return l.delete(S), !1;
      t && (s.clear(), c.clear(), t = !1), E.provisional || (d = E.total != null ? E.total : d, b = E.filtered != null ? E.filtered : E.data ? E.data.length : b);
      for (let x = 0; x < L.length; x++)
        L[x] != null && (s.set(S + x, L[x]), o(S + x));
      return l.delete(S), v(), h(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(E) {
      E && (f = E), w(0, _);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(E) {
      g++, l.clear(), clearTimeout(n), E && (f = E), t = !0, w(0, _);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      g++, l.clear(), clearTimeout(n), t = !0;
      const E = Math.max(0, Math.floor(e / _) * _);
      w(E, _);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(E) {
      l.delete(E);
    },
    destroy: function() {
      clearTimeout(n), s.clear(), c.clear(), l.clear();
    },
    configure: function(E) {
      E = E || {};
      let S = !1;
      if (E.windowSize != null && E.windowSize > 0 && E.windowSize !== i) {
        const L = E.windowSize < i;
        i = E.windowSize, L && v(), S = !0;
      }
      E.pageSize != null && E.pageSize > 0 && (_ = E.pageSize), E.threshold != null && E.threshold >= 0 && (y = E.threshold), E.fetchDebounce != null && E.fetchDebounce >= 0 && (u = E.fetchDebounce), S && h();
    },
    setGrandTotal: function(E) {
      E == null || isNaN(E) || E < 0 || (d = E, p() || (b = E), h());
    }
  };
}
const Cn = "ln:";
let bt = null;
function Ne() {
  if (bt !== null) return bt;
  try {
    if (typeof localStorage > "u")
      return bt = !1, !1;
    const r = "__ln_test__";
    localStorage.setItem(r, r), localStorage.removeItem(r), bt = !0;
  } catch {
    bt = !1;
  }
  return bt;
}
function Ln() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Pe(r, i) {
  const _ = i.getAttribute("data-ln-persist"), y = _ !== null && _ !== "" ? _ : i.id;
  return y ? Cn + r + ":" + Ln() + ":" + y : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', i), null);
}
function Ht(r, i) {
  if (!Ne()) return null;
  const _ = Pe(r, i);
  if (!_) return null;
  try {
    const y = localStorage.getItem(_);
    return y !== null ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
function gt(r, i, _) {
  if (!Ne()) return;
  const y = Pe(r, i);
  if (y)
    try {
      _ == null ? localStorage.removeItem(y) : localStorage.setItem(y, JSON.stringify(_));
    } catch {
    }
}
function He(r) {
  return (r || "").replace(/^#/, "");
}
function Bt(r) {
  const i = r === void 0 ? location.hash : r, _ = {}, y = He(i);
  if (!y) return _;
  const u = y.split("&");
  for (let m = 0; m < u.length; m++) {
    const h = u[m];
    if (!h) continue;
    const s = h.indexOf(":"), c = s > -1 ? h.slice(0, s) : h, l = s > -1 ? h.slice(s + 1) : "";
    if (c)
      try {
        _[c] = decodeURIComponent(l);
      } catch {
        _[c] = l;
      }
  }
  return _;
}
function Y(r) {
  if (!r) return null;
  const i = Bt();
  return r in i ? i[r] : null;
}
function Z(r, i) {
  if (!r) return;
  const _ = Bt();
  i == null ? delete _[r] : _[r] = String(i);
  const u = Object.keys(_).map(function(m) {
    const h = _[m];
    return h === "" ? m : m + ":" + encodeURIComponent(h);
  }).join("&");
  He(location.hash) !== u && (location.hash = u);
}
function oe(r) {
  return r.button === 1 || r.ctrlKey || r.metaKey || r.shiftKey ? !1 : (r.preventDefault(), !0);
}
function _t(r, i) {
  if (!r || !r.hasAttribute("data-ln-hash")) return null;
  const _ = r.getAttribute("data-ln-hash");
  if (_ && _.trim() !== "") return _.trim();
  const y = r.getAttribute("data-ln-sort") || r.getAttribute("data-ln-search-for") || r.getAttribute("data-ln-search") || r.getAttribute("data-ln-filter") || r.id;
  return y ? i ? y + "-" + i : y : i || null;
}
function Be(r, i) {
  return !i || i === "none" || r === null || r === void 0 ? null : String(r) + "." + i;
}
function Gt(r) {
  return !r || typeof r != "string" ? null : r.endsWith(".asc") ? { fieldOrColumn: r.slice(0, -4), direction: "asc" } : r.endsWith(".desc") ? { fieldOrColumn: r.slice(0, -5), direction: "desc" } : null;
}
function Ue(r, i) {
  return !r || !Array.isArray(i) || i.length === 0 ? null : r + ":" + i.map(encodeURIComponent).join(",");
}
function Qt(r) {
  if (!r || typeof r != "string") return null;
  const i = r.indexOf(":");
  if (i === -1) return null;
  const _ = r.slice(0, i), y = r.slice(i + 1), u = y ? y.split(",").map(function(m) {
    try {
      return decodeURIComponent(m);
    } catch {
      return m;
    }
  }).filter(Boolean) : [];
  return { key: _, values: u };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Bt, window.lnCore.hashGet = Y, window.lnCore.hashSet = Z, window.lnCore.hashLinkClick = oe, window.lnCore.resolveHashNamespace = _t, window.lnCore.hashSortEncode = Be, window.lnCore.hashSortDecode = Gt, window.lnCore.hashFilterEncode = Ue, window.lnCore.hashFilterDecode = Qt);
function Ot(r, i, _, y) {
  const u = typeof y == "number" ? y : 4, m = window.innerWidth, h = window.innerHeight, s = i.width, c = i.height, l = (_ || "bottom").split("-"), b = l[0], d = l[1] === "start" || l[1] === "end" ? l[1] : "center", g = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, f = g[b] || g.bottom;
  function n(p) {
    return p === "top" || p === "bottom" ? d === "start" ? r.left : d === "end" ? r.right - s : r.left + (r.width - s) / 2 : d === "start" ? r.top : d === "end" ? r.bottom - c : r.top + (r.height - c) / 2;
  }
  function a(p) {
    let v, w, E = !0;
    return p === "top" ? (v = r.top - u - c, w = n(p), v < 0 && (E = !1)) : p === "bottom" ? (v = r.bottom + u, w = n(p), v + c > h && (E = !1)) : p === "left" ? (v = n(p), w = r.left - u - s, w < 0 && (E = !1)) : (v = n(p), w = r.right + u, w + s > m && (E = !1)), { top: v, left: w, side: p, fits: E };
  }
  let e = null;
  for (let p = 0; p < f.length; p++) {
    const v = a(f[p]);
    if (v.fits) {
      e = v;
      break;
    }
  }
  e || (e = a(f[0]));
  let t = e.top, o = e.left;
  return s >= m ? o = 0 : (o < 0 && (o = 0), o + s > m && (o = m - s)), c >= h ? t = 0 : (t < 0 && (t = 0), t + c > h && (t = h - c)), { top: t, left: o, placement: e.side };
}
function $t(r) {
  if (!r) return { width: 0, height: 0 };
  const i = r.style, _ = i.visibility, y = i.display, u = i.position;
  i.visibility = "hidden", i.display = "block", i.position = "fixed";
  const m = r.offsetWidth, h = r.offsetHeight;
  return i.visibility = _, i.display = y, i.position = u, { width: m, height: h };
}
let ht = null;
async function fe(r) {
  if (!r) {
    ht = null;
    return;
  }
  try {
    const i = new TextEncoder(), _ = await crypto.subtle.digest("SHA-256", i.encode(r));
    ht = await crypto.subtle.importKey(
      "raw",
      _,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (i) {
    console.error("[ln-core/crypto] Key derivation failed:", i), ht = null;
  }
}
function dt() {
  return ht;
}
async function Tn(r, i = ht) {
  const _ = i || ht;
  if (!_ || r === void 0 || r === null) return r;
  try {
    const y = new TextEncoder(), u = crypto.getRandomValues(new Uint8Array(12)), m = typeof r == "string" ? r : JSON.stringify(r), h = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: u },
      _,
      y.encode(m)
    ), s = btoa(String.fromCharCode(...u)), c = btoa(String.fromCharCode(...new Uint8Array(h)));
    return {
      encrypted: !0,
      iv: s,
      data: c
    };
  } catch (y) {
    return console.error("[ln-core/crypto] Encryption failed:", y), r;
  }
}
async function qn(r, i = ht) {
  const _ = i || ht;
  if (!r || !r.encrypted || !_) return r;
  try {
    const y = new TextDecoder(), u = Uint8Array.from(atob(r.iv), (c) => c.charCodeAt(0)), m = Uint8Array.from(atob(r.data), (c) => c.charCodeAt(0)), h = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: u },
      _,
      m
    ), s = y.decode(h);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (y) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", y), { ...r, decryptionError: !0 };
  }
}
function xn(r) {
  if (typeof r == "string") return r;
  if (r && typeof r == "object") {
    if (typeof r.href == "string") return r.href;
    if (typeof r.url == "string") return r.url;
  }
  return String(r || "");
}
function kn(r, i) {
  return i && i.method ? String(i.method).toUpperCase() : r && typeof r == "object" && r.method ? String(r.method).toUpperCase() : "GET";
}
function In(r, i) {
  return (i || "GET") + " " + (r || "");
}
function Dn(r) {
  const i = (r || "").toUpperCase();
  return i === "GET" || i === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const r = window.fetch.bind(window), i = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
  function y(h, s) {
    s = s || {};
    const c = xn(h), l = kn(h, s), b = In(c, l);
    Dn(l) && i.has(b) && (i.get(b).abort(), i.delete(b));
    const d = new AbortController(), g = s.signal;
    let f = null;
    g && (g.aborted ? d.abort(g.reason) : (f = function() {
      d.abort(g.reason);
    }, g.addEventListener("abort", f, { once: !0 })));
    const n = Object.assign({}, s, { signal: d.signal });
    return i.set(b, d), r(h, n).finally(function() {
      g && f && g.removeEventListener("abort", f), i.get(b) === d && i.delete(b);
    });
  }
  y.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = y;
  function u(h) {
    if (!h.detail || !h.detail.url) return;
    const s = h.target, c = (h.detail.method || (h.detail.body ? "POST" : "GET")).toUpperCase(), l = h.detail.key;
    l && _.has(l) && (_.get(l).abort(), _.delete(l));
    const b = new AbortController(), d = h.detail.signal;
    let g = null;
    d && (d.aborted ? b.abort(d.reason) : (g = function() {
      b.abort(d.reason);
    }, d.addEventListener("abort", g, { once: !0 }))), l && _.set(l, b);
    const f = { method: c, signal: b.signal };
    h.detail.body !== void 0 && (f.body = h.detail.body), window.fetch(h.detail.url, f).then(function(n) {
      d && g && d.removeEventListener("abort", g), l && _.get(l) === b && _.delete(l), C(s, "ln-http:response", {
        ok: n.ok,
        status: n.status,
        response: n
      });
    }).catch(function(n) {
      d && g && d.removeEventListener("abort", g), l && _.get(l) === b && _.delete(l), !(n && n.name === "AbortError") && C(s, "ln-http:error", {
        ok: !1,
        status: 0,
        error: n
      });
    });
  }
  function m(h) {
    const s = h.detail || {};
    s.all ? window.lnHttp.cancelAll() : s.key ? window.lnHttp.cancelByKey(s.key) : s.url && window.lnHttp.cancel(s.url);
  }
  document.addEventListener("ln-http:request", u), document.addEventListener("ln-http:cancel", m), window.lnHttp = {
    cancel: function(h) {
      let s = !1;
      return i.forEach(function(c, l) {
        l.endsWith(" " + h) && (c.abort(), i.delete(l), s = !0);
      }), s;
    },
    cancelByKey: function(h) {
      return _.has(h) ? (_.get(h).abort(), _.delete(h), !0) : !1;
    },
    cancelAll: function() {
      i.forEach(function(h) {
        h.abort();
      }), i.clear(), _.forEach(function(h) {
        h.abort();
      }), _.clear();
    },
    get inflight() {
      const h = [];
      return i.forEach(function(s, c) {
        const l = c.indexOf(" ");
        h.push({ method: c.slice(0, l), url: c.slice(l + 1) });
      }), _.forEach(function(s, c) {
        h.push({ key: c });
      }), h;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", u), document.removeEventListener("ln-http:cancel", m), window.fetch = r, delete window.lnHttp;
    }
  };
})();
(function() {
  const r = "template[data-ln-include]", i = "lnInclude";
  if (window[i] !== void 0) return;
  const _ = /* @__PURE__ */ new Map();
  function y(u) {
    if (this.dom = u, this.url = u.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    wn(), this._held = !0;
    const m = this, h = this.url;
    let s = _.get(h);
    return s || (s = fetch(h).then(function(c) {
      if (!c.ok)
        throw new Error("HTTP error! status: " + c.status);
      return c.text();
    }).catch(function(c) {
      throw _.delete(h), c;
    }), _.set(h, s)), s.then(function(c) {
      if (m._destroyed) return;
      const l = document.createElement("template");
      l.innerHTML = c, m.dom.content.appendChild(l.content), C(m.dom, "ln-include:loaded", { target: m.dom, url: m.url }), m._held && (m._held = !1, Wt());
    }).catch(function(c) {
      m._destroyed || (console.error("[ln-include] Failed to fetch template from " + m.url + ":", c), C(m.dom, "ln-include:error", { target: m.dom, url: m.url, error: c }), m._held && (m._held = !1, Wt()));
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[i] && (this._destroyed = !0, this._held && (this._held = !1, Wt()), delete this.dom[i]);
  }, P(r, i, y, "ln-include");
})();
(function() {
  const r = "data-ln-form", i = "lnForm", _ = "data-ln-form-action-edit", y = "data-ln-form-action-method";
  if (window[i] !== void 0) return;
  function u(m) {
    this.dom = m, this._baseAction = m.getAttribute("action") || "";
    const h = this;
    return this._onLnFill = function(s) {
      s.target === h.dom && (s.detail ? (h.fill(s.detail), h._applyActionMode(s.detail)) : h.dom.reset());
    }, this._onReset = function() {
      h._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  u.prototype.fill = function(m) {
    const h = ke(this.dom, m);
    for (let s = 0; s < h.length; s++) {
      const c = h[s], l = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(l ? "change" : "input", { bubbles: !0 }));
    }
  }, u.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, u.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute(_)) return;
    const h = m && m.id != null && m.id !== "" ? m.id : null, s = this._ensureMethodInput();
    if (h !== null) {
      const c = this.dom.getAttribute(_);
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(h))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(h)), s.value = this.dom.getAttribute(y) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), s.value = "";
  }, u.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), C(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[i]);
  }, P(r, i, u, "ln-form");
})();
const pe = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function me(r, i = 0) {
  return r ? !!(r.valid && i === 0) : i === 0;
}
function Rn(r, i) {
  const _ = [];
  if (r) {
    const y = Object.keys(pe);
    for (let u = 0; u < y.length; u++) {
      const m = y[u], h = pe[m];
      r[h] && _.push(m);
    }
  }
  if (i) {
    const y = Array.from(i);
    for (let u = 0; u < y.length; u++)
      y[u] && _.indexOf(y[u]) === -1 && _.push(y[u]);
  }
  return _;
}
(function() {
  const r = "data-ln-validate", i = "lnValidate", _ = "data-ln-validate-errors", y = "data-ln-validate-error", u = "ln-validate-valid", m = "ln-validate-invalid";
  if (window[i] !== void 0) return;
  function h(s) {
    this.dom = s, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const c = this, l = s.tagName, b = s.type, d = l === "SELECT" || b === "checkbox" || b === "radio";
    this._onInput = function() {
      c._touched = !0, c.validate();
    }, this._onChange = function() {
      c._touched = !0, c.validate();
    }, this._onSetCustom = function(n) {
      const a = n.detail && n.detail.error;
      if (!a) return;
      c._customErrors.add(a), c._touched = !0;
      const e = s.closest(".form-element");
      if (e) {
        const t = e.querySelector("[" + y + '="' + a + '"]');
        t && t.classList.remove("hidden");
      }
      s.classList.remove(u), s.classList.add(m), s.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(n) {
      const a = n.detail && n.detail.error, e = s.closest(".form-element");
      if (a) {
        if (c._customErrors.delete(a), e) {
          const t = e.querySelector("[" + y + '="' + a + '"]');
          t && t.classList.add("hidden");
        }
      } else
        c._customErrors.forEach(function(t) {
          if (e) {
            const o = e.querySelector("[" + y + '="' + t + '"]');
            o && o.classList.add("hidden");
          }
        }), c._customErrors.clear();
      c._touched && c.validate();
    }, d || s.addEventListener("input", this._onInput), s.addEventListener("change", this._onChange), s.addEventListener("ln-validate:set-custom", this._onSetCustom), s.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const g = s.form;
    return g && (g.hasAttribute("novalidate") || g.setAttribute("novalidate", ""), this._onFormReset = function() {
      c.reset();
    }, this._onValidateRequest = function(n) {
      c._touched = !0, !c.validate() && n.detail && n.detail.invalidFields && n.detail.invalidFields.push(c.dom);
    }, g.addEventListener("reset", this._onFormReset), g.addEventListener("ln-validate:request-validate", this._onValidateRequest), g._lnValidateGateBound || (g._lnValidateGateBound = !0, g.addEventListener("submit", function(n) {
      const a = { invalidFields: [] };
      C(g, "ln-validate:request-validate", a), a.invalidFields.length > 0 && (n.preventDefault(), a.invalidFields.sort((e, t) => e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), a.invalidFields[0].focus());
    }))), (s.value && s.value.trim() !== "" || s.checked) && (this._touched = !0, this.validate()), this;
  }
  h.prototype.validate = function() {
    const s = this.dom, c = s.validity, l = me(c, this._customErrors.size), b = Rn(c, this._customErrors), d = s.closest(".form-element");
    if (d) {
      const f = d.querySelector("[" + _ + "]");
      if (f) {
        const n = f.querySelectorAll("[" + y + "]");
        for (let a = 0; a < n.length; a++) {
          const e = n[a].getAttribute(y);
          n[a].classList.toggle("hidden", !b.includes(e));
        }
      }
    }
    return s.classList.toggle(u, l), s.classList.toggle(m, !l), s.setAttribute("aria-invalid", l ? "false" : "true"), C(s, l ? "ln-validate:valid" : "ln-validate:invalid", { target: s, field: s.name, errors: b }), l;
  }, h.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(u, m), this.dom.removeAttribute("aria-invalid");
    const s = this.dom.closest(".form-element");
    if (s) {
      const c = s.querySelectorAll("[" + y + "]");
      for (let l = 0; l < c.length; l++)
        c[l].classList.add("hidden");
    }
  }, Object.defineProperty(h.prototype, "isValid", {
    get: function() {
      return me(this.dom.validity, this._customErrors.size);
    }
  }), h.prototype.destroy = function() {
    if (!this.dom[i]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const s = this.dom.form;
    s && (this._onFormReset && s.removeEventListener("reset", this._onFormReset), this._onValidateRequest && s.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(u, m), this.dom.removeAttribute("aria-invalid"), C(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[i];
  }, P(r, i, h, "ln-validate");
})();
(function() {
  const r = "data-ln-ajax", i = "lnAjax", _ = "data-ln-form-scope";
  if (window[i] !== void 0) return;
  function y(d) {
    if (!d.hasAttribute(r) || d[i]) return;
    d[i] = !0;
    const g = c(d);
    u(g.links), m(g.forms);
  }
  function u(d) {
    for (const g of d) {
      if (g[i + "Trigger"] || g.hostname && g.hostname !== window.location.hostname) continue;
      const f = g.getAttribute("href");
      if (f && f.includes("#")) continue;
      const n = function(a) {
        if (!De(a, g)) return;
        a.preventDefault();
        const e = g.getAttribute("href");
        e && s("GET", e, null, g);
      };
      g.addEventListener("click", n), g[i + "Trigger"] = n;
    }
  }
  function m(d) {
    for (const g of d) {
      if (g[i + "Trigger"]) continue;
      if (g.hasAttribute(_)) {
        g[i + "ScopeWarned"] || (g[i + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const f = function(n) {
        if (n.defaultPrevented) return;
        n.preventDefault();
        const a = g.method.toUpperCase(), e = g.action, t = new FormData(g);
        for (const o of g.querySelectorAll('button, input[type="submit"]'))
          o.disabled = !0;
        s(a, e, t, g, function() {
          for (const o of g.querySelectorAll('button, input[type="submit"]'))
            o.disabled = !1;
        });
      };
      g.addEventListener("submit", f), g[i + "Trigger"] = f;
    }
  }
  function h(d) {
    if (!d[i]) return;
    const g = c(d);
    for (const f of g.links)
      f[i + "Trigger"] && (f.removeEventListener("click", f[i + "Trigger"]), delete f[i + "Trigger"]);
    for (const f of g.forms)
      f[i + "Trigger"] && (f.removeEventListener("submit", f[i + "Trigger"]), delete f[i + "Trigger"]);
    delete d[i];
  }
  function s(d, g, f, n, a) {
    if (W(n, "ln-ajax:before-start", { method: d, url: g }).defaultPrevented) return;
    C(n, "ln-ajax:start", { method: d, url: g }), n.classList.add("ln-ajax--loading");
    const t = document.createElement("span");
    t.className = "ln-ajax-spinner", n.appendChild(t);
    function o() {
      n.classList.remove("ln-ajax--loading");
      const S = n.querySelector(".ln-ajax-spinner");
      S && S.remove(), a && a();
    }
    let p = g;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    f instanceof FormData && w && f.append("_token", w);
    const E = {
      method: d,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (E.headers["X-CSRF-TOKEN"] = w), d === "GET" && f) {
      const S = new URLSearchParams(f);
      p = g + (g.includes("?") ? "&" : "?") + S.toString();
    } else d !== "GET" && f && (E.body = f);
    fetch(p, E).then(function(S) {
      const L = S.ok, T = S.status;
      return S.text().then(function(x) {
        let k = null, O = null;
        if (x && x.trim())
          try {
            k = JSON.parse(x);
          } catch (M) {
            O = M;
          }
        return { ok: L, status: T, data: k, parseError: O };
      });
    }).then(function(S) {
      const L = S.status, T = S.data, x = S.parseError;
      if (S.ok && !x) {
        if (T && T.title && (document.title = T.title), T && T.content)
          for (const k in T.content) {
            const O = document.getElementById(k);
            O && (O.innerHTML = T.content[k]);
          }
        if (n.tagName === "A") {
          const k = n.getAttribute("href");
          k && window.history.pushState({ ajax: !0 }, "", k);
        } else n.tagName === "FORM" && n.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", p);
        C(n, "ln-ajax:success", { method: d, url: p, data: T });
      } else
        C(n, "ln-ajax:error", {
          method: d,
          url: p,
          status: L,
          data: T,
          error: x || null
        });
      C(n, "ln-ajax:complete", { method: d, url: p }), o();
    }).catch(function(S) {
      C(n, "ln-ajax:error", { method: d, url: p, status: 0, data: null, error: S }), C(n, "ln-ajax:complete", { method: d, url: p }), o();
    });
  }
  function c(d) {
    const g = { links: [], forms: [] };
    return d.tagName === "A" && d.getAttribute(r) !== "false" ? g.links.push(d) : d.tagName === "FORM" && d.getAttribute(r) !== "false" ? g.forms.push(d) : (g.links = Array.from(d.querySelectorAll('a:not([data-ln-ajax="false"])')), g.forms = Array.from(d.querySelectorAll('form:not([data-ln-ajax="false"])'))), g;
  }
  function l() {
    lt(function() {
      new MutationObserver(function(g) {
        for (const f of g)
          if (f.type === "childList") {
            for (const n of f.addedNodes)
              if (n.nodeType === 1 && (y(n), !n.hasAttribute(r))) {
                for (const e of n.querySelectorAll("[" + r + "]"))
                  y(e);
                const a = n.closest && n.closest("[" + r + "]");
                if (a && a.getAttribute(r) !== "false") {
                  const e = c(n);
                  u(e.links), m(e.forms);
                }
              }
          } else f.type === "attributes" && y(f.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [r]
      });
    }, "ln-ajax");
  }
  function b() {
    for (const d of document.querySelectorAll("[" + r + "]"))
      y(d);
  }
  window[i] = y, window[i].destroy = h, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b) : b();
})();
const ze = {
  navigate: function(r) {
    qt(r, { historyAction: "push" });
  },
  replace: function(r) {
    qt(r, { historyAction: "replace" });
  },
  current: function() {
    return Xt ? {
      path: Yt,
      params: Ve,
      query: We,
      route: Xt,
      regions: je
    } : null;
  }
}, se = "data-ln-route", Ke = "lnRoute";
typeof window < "u" && (window.lnRouter = ze);
const at = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new WeakMap();
let je = /* @__PURE__ */ new Map(), _e = !1, Yt = null, Ve = {}, We = {}, Xt = null, Jt = !1;
function be(r, i, _) {
  Jt ? queueMicrotask(function() {
    C(r, i, _);
  }) : C(r, i, _);
}
function Mt(r) {
  try {
    const m = new URL(r, window.location.origin);
    r = m.pathname + m.search + m.hash;
  } catch {
  }
  let [i] = r.split("#"), [_, y] = i.split("?");
  const u = {};
  if (y) {
    const m = new URLSearchParams(y);
    for (const [h, s] of m.entries())
      u[h] = s;
  }
  return _ = _.replace(/\/+$/, ""), _ === "" && (_ = "/"), { path: _, query: u };
}
function Ge(r, i) {
  if (r.pattern === "*") return 1;
  if (i.pattern === "*") return -1;
  const _ = r.segments, y = i.segments, u = Math.max(_.length, y.length);
  for (let m = 0; m < u; m++) {
    const h = _[m], s = y[m];
    if (h === void 0) return 1;
    if (s === void 0) return -1;
    if (h === "*") return 1;
    if (s === "*") return -1;
    const c = h.startsWith(":"), l = s.startsWith(":");
    if (c && !l) return 1;
    if (!c && l) return -1;
  }
  return 0;
}
function Qe(r, i) {
  const _ = r.split("/").filter(Boolean);
  for (const y of i) {
    if (y.pattern === "*")
      return {
        route: y,
        params: { wildcard: r }
      };
    const u = y.segments, m = {};
    let h = !0;
    if (!(_.length > u.length && u[u.length - 1] !== "*")) {
      for (let s = 0; s < u.length; s++) {
        const c = u[s], l = _[s];
        if (c === "*") {
          m.wildcard = _.slice(s).join("/");
          break;
        }
        if (l === void 0) {
          h = !1;
          break;
        }
        if (c.startsWith(":"))
          m[c.slice(1)] = decodeURIComponent(l);
        else if (c !== l) {
          h = !1;
          break;
        }
      }
      if (h && (u.indexOf("*") !== -1 || _.length <= u.length))
        return { route: y, params: m };
    }
  }
  return null;
}
function Zt(r, i) {
  if (r !== "__primary__") {
    const y = document.getElementById(i.target);
    return y || console.warn(`[ln-router] Explicit target element #${i.target} not found in DOM`), y;
  }
  const _ = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return _ || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), _;
}
function On(r) {
  if (!r) return;
  const i = Array.from(r.querySelectorAll("*")), _ = [r].concat(i);
  for (const u of _)
    for (const m of Object.keys(u))
      if (m.startsWith("ln") && u[m] && typeof u[m].destroy == "function")
        try {
          u[m].destroy();
        } catch (h) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, u, h);
        }
  const y = document.querySelectorAll('[data-ln-popover="open"]');
  for (const u of y) {
    const m = u.lnPopover;
    if (m && m.trigger && r.contains(m.trigger))
      try {
        m.destroy();
      } catch (h) {
        console.error("[ln-router] Error destroying open popover:", h);
      }
  }
}
function qt(r, i = {}) {
  const { path: _, query: y } = Mt(r), u = /* @__PURE__ */ new Map();
  for (const [b, d] of at)
    u.set(b, Qe(_, d.sorted));
  const m = at.has("__primary__"), h = u.get("__primary__");
  if (m && !h) {
    be(document.body, "ln-router:not-found", { path: _ });
    return;
  }
  let s = null;
  if (h && (s = Zt("__primary__", h.route), !s || W(s, "ln-router:before-navigate", {
    from: Yt,
    to: r,
    params: h.params,
    query: y
  }).defaultPrevented))
    return;
  const c = [];
  for (const [b, d] of u) {
    if (!d) continue;
    const g = Zt(b, d.route);
    g && (b !== "__primary__" && g.hasAttribute("data-ln-route-keep") && ge.get(g) === d.route.templateNode || c.push({ regionKey: b, match: d, targetEl: g }));
  }
  i.historyAction === "push" ? window.history.pushState(null, "", r) : i.historyAction === "replace" && window.history.replaceState(null, "", r);
  const l = function() {
    for (const { regionKey: b, match: d, targetEl: g } of c) {
      if (!(i.isHydration && g.hasAttribute("data-ln-router-hydrate") && g.children.length > 0)) {
        On(g);
        const n = d.route.templateNode.content.cloneNode(!0);
        g.replaceChildren(n);
      }
      if (ge.set(g, d.route.templateNode), b === "__primary__" && (d.route.title && (document.title = d.route.title), !i.isHydration)) {
        g.hasAttribute("tabindex") || g.setAttribute("tabindex", "-1");
        const n = g.querySelector("h1, h2, h3, h4, h5, h6");
        n ? (n.setAttribute("tabindex", "-1"), n.focus()) : g.focus(), g.scrollIntoView({ block: "start", behavior: "instant" });
      }
      be(g, "ln-router:navigated", {
        path: r,
        params: d.params,
        query: y,
        route: d.route,
        target: g,
        region: b
      });
    }
    h && (Yt = r, Ve = h.params, We = y, Xt = h.route), je = new Map(
      Array.from(u.entries()).map(([b, d]) => [b, d ? { route: d.route, params: d.params } : null])
    );
  };
  document.startViewTransition && !i.isHydration ? document.startViewTransition(l) : l();
}
function Mn(r) {
  const i = r.target.closest("a");
  if (!i || !De(r, i)) return;
  const _ = i.getAttribute("href"), { path: y } = Mt(_), u = at.get("__primary__");
  if (!u) return;
  Qe(y, u.sorted) && (r.preventDefault(), qt(_, { historyAction: "push" }));
}
function Fn(r, i) {
  const _ = Object.keys(r), y = Object.keys(i);
  if (_.length !== y.length) return !1;
  for (let u = 0; u < _.length; u++) {
    const m = _[u];
    if (r[m] !== i[m]) return !1;
  }
  return !0;
}
function Nn() {
  const r = window.location.pathname + window.location.search, i = ze.current();
  if (i && i.path != null) {
    const _ = Mt(r);
    if (Mt(i.path).path === _.path && Fn(i.query, _.query))
      return;
  }
  qt(r, { historyAction: "skip" });
}
function Pn() {
  _e || (_e = !0, lt(function() {
    document.addEventListener("click", Mn), window.addEventListener("popstate", Nn), Jt = !0;
    const r = window.location.pathname + window.location.search + window.location.hash;
    qt(r, { historyAction: "replace", isHydration: !0 }), Jt = !1;
  }, "ln-router"));
}
function Hn(r) {
  const i = r.getAttribute(se);
  if (!i) return;
  const _ = r.getAttribute("data-ln-route-target") || null;
  if (_ === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${i}" rejected.`);
    return;
  }
  const y = _ || "__primary__";
  at.has(y) || at.set(y, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const u = at.get(y);
  if (u.routes.has(i)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${i}" in region "${y}"`);
    return;
  }
  const m = r.getAttribute("data-ln-route-title"), h = i.split("/").filter(Boolean), s = {
    pattern: i,
    segments: h,
    target: _,
    title: m,
    templateNode: r
  }, c = Zt(y, s);
  c && c.contains(r) && console.warn(`[ln-router] Route template with pattern "${i}" is declared inside its own outlet element:`, r), u.routes.set(i, s), u.sorted = Array.from(u.routes.values()).sort(Ge);
}
function Bn(r) {
  const i = r.getAttribute(se);
  if (!i) return;
  const y = r.getAttribute("data-ln-route-target") || null || "__primary__", u = at.get(y);
  u && (u.routes.delete(i), u.sorted = Array.from(u.routes.values()).sort(Ge), u.routes.size === 0 && at.delete(y));
}
function $e(r) {
  return this.dom = r, Hn(r), this;
}
$e.prototype.destroy = function() {
  Bn(this.dom), delete this.dom[Ke];
};
P(se, Ke, $e, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    at.size > 0 && Pn();
  }
});
(function() {
  const r = "data-ln-modal", i = "lnModal";
  if (window[i] !== void 0) return;
  function _(u) {
    this.dom = u, this.isOpen = u.getAttribute(r) === "open";
    const m = this;
    return this._onRequestOpen = function() {
      m.dom.setAttribute(r, "open");
    }, this._onRequestClose = function() {
      m.dom.setAttribute(r, "close");
    }, this._onCancel = function(h) {
      h.preventDefault(), m.dom.setAttribute(r, "close");
    }, this._onClickClose = function(h) {
      const s = h.target.closest("[data-ln-modal-close]");
      s && m.dom.contains(s) && (h.preventDefault(), m.dom.setAttribute(r, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  _.prototype.open = function() {
    this.dom.setAttribute(r, "open");
  }, _.prototype.close = function() {
    this.dom.setAttribute(r, "close");
  }, _.prototype.toggle = function() {
    const u = this.dom.getAttribute(r);
    this.dom.setAttribute(r, u === "open" ? "close" : "open");
  }, _.prototype.destroy = function() {
    if (this.dom[i]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const u = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + r + '="open"]'),
          function(h) {
            return h !== u;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      C(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[i];
    }
  };
  function y(u) {
    const m = u[i];
    if (!m) return;
    const s = u.getAttribute(r) === "open";
    if (s !== m.isOpen)
      if (s) {
        if (W(u, "ln-modal:before-open", { modalId: u.id, target: u }).defaultPrevented) {
          u.setAttribute(r, "close");
          return;
        }
        m.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof u.showModal == "function" && u.showModal();
        const l = u.querySelector("[autofocus]");
        if (l && Lt(l))
          l.focus();
        else {
          const b = u.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), d = Array.prototype.find.call(b, Lt);
          if (d) d.focus();
          else {
            const g = u.querySelectorAll("a[href], button:not([disabled])"), f = Array.prototype.find.call(g, Lt);
            f && f.focus();
          }
        }
        C(u, "ln-modal:open", { modalId: u.id, target: u });
      } else {
        if (W(u, "ln-modal:before-close", { modalId: u.id, target: u }).defaultPrevented) {
          u.setAttribute(r, "open");
          return;
        }
        m.isOpen = !1, C(u, "ln-modal:close", { modalId: u.id, target: u }), typeof u.close == "function" && u.close(), document.querySelector("[" + r + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  P(r, i, _, "ln-modal", {
    onAttributeChange: y
  });
})();
(function() {
  const r = "data-ln-ui-coordinator", i = "lnUiCoordinator", _ = "data-ln-ui-coordinator-dict";
  if (window[i] !== void 0) return;
  function y(e) {
    const t = {};
    let o = e;
    const p = [];
    for (; o; ) {
      const v = o.closest("[" + r + "]");
      if (!v) break;
      v[i] && v[i].dict && p.unshift(v[i].dict), o = v.parentElement;
    }
    for (const v of p)
      Object.assign(t, v);
    return t;
  }
  function u(e, t) {
    if (t) {
      if (e) {
        const p = e.closest("[" + r + "]");
        if (p) {
          if (p.id === t && p.hasAttribute("data-ln-modal")) return p;
          const v = p.querySelector("#" + CSS.escape(t) + '[data-ln-modal], [data-ln-modal="' + t + '"]');
          if (v) return v;
        }
      }
      const o = document.getElementById(t) || document.querySelector('[data-ln-modal="' + t + '"]');
      if (o) return o;
    }
    if (e) {
      const o = e.closest("[" + r + "]");
      if (o) {
        if (o.hasAttribute("data-ln-modal")) return o;
        const v = o.querySelector("[data-ln-modal]");
        if (v) return v;
      }
      const p = e.closest("[data-ln-modal]");
      if (p) return p;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function m(e, t) {
    if (e !== "edit") return "";
    if (t) {
      const o = t.getAttribute("data-ln-fill-id");
      if (o) return o;
    }
    return "edit";
  }
  function h(e) {
    if (!e) return;
    const t = e.querySelectorAll("[data-ln-field]");
    for (let p = 0; p < t.length; p++)
      t[p].textContent = "";
    const o = e.querySelectorAll("form");
    for (let p = 0; p < o.length; p++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(o[p], null) : o[p].reset();
  }
  document.addEventListener("click", function(e) {
    if (e.ctrlKey || e.metaKey || e.button === 1) return;
    const t = e.target.closest("[data-ln-modal-for]");
    if (t) {
      const p = t.getAttribute("data-ln-modal-for"), v = u(t, p);
      if (v && v.lnModal) {
        e.preventDefault();
        const w = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, E = {}, S = t.dataset;
        for (const x in S) {
          if (!x.startsWith("lnModal") || w[x]) continue;
          const k = x.slice(7);
          k && (E[k.charAt(0).toLowerCase() + k.slice(1)] = S[x]);
        }
        const L = Object.keys(E).length > 0;
        t.hasAttribute("data-ln-modal-mode") ? v.dataset.lnModalMode = t.getAttribute("data-ln-modal-mode") : v.dataset.lnModalMode = L ? "edit" : "new", L && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(v, E) : v.dataset.lnModalMode === "new" && h(v), v.getAttribute("data-ln-modal") === "open" ? C(v, "ln-modal:request-close", {}) : (v.id && Z(v.id, m(v.dataset.lnModalMode, t)), C(v, "ln-modal:request-open", {}));
      }
      return;
    }
    const o = e.target.closest('a[href^="#"]');
    if (o) {
      const p = Bt(o.getAttribute("href"));
      for (const v in p) {
        const w = document.getElementById(v);
        if (w && w.lnModal) {
          if (!oe(e)) return;
          Z(v, p[v]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(e) {
    const t = e.target;
    if (!t || !t.lnModal) return;
    (t.dataset.lnModalMode || "new") === "new" && h(t);
  }), document.addEventListener("ln-modal:open", function(e) {
    const t = e.target;
    if (!t || !t.lnModal || !t.id) return;
    let o = Y(t.id);
    o === null && (o = m(t.dataset.lnModalMode, null), Z(t.id, o)), o ? (t.dataset.lnModalMode = "edit", t.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: o }
    }))) : (t.dataset.lnModalMode = "new", h(t));
  });
  let s = !1;
  function c() {
    if (!s) {
      s = !0;
      try {
        const e = document.querySelectorAll("[data-ln-modal][id]");
        for (let t = 0; t < e.length; t++) {
          const o = e[t];
          if (!o.lnModal) continue;
          const p = o.id, v = Y(p), w = v !== null, E = o.lnModal.isOpen;
          if (w) {
            const S = v ? "edit" : "new";
            o.dataset.lnModalMode = S, E ? v ? o.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: v }
            })) : h(o) : C(o, "ln-modal:request-open", {});
          } else E && C(o, "ln-modal:request-close", {});
        }
      } finally {
        s = !1;
      }
    }
  }
  function l() {
    const e = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let t = 0; t < e.length; t++) {
      const o = e[t];
      o.lnModal && Y(o.id) === null && Z(o.id, m(o.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", c);
  function b() {
    l(), c();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    it(b);
  }) : it(b);
  function d(e) {
    const o = (e.detail || {}).data;
    if (o && o.message) {
      const v = o.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: v.type || "success",
          title: v.title || "",
          message: v.body || ""
        }
      }));
    }
    const p = e.target.closest("[data-ln-modal]");
    p && p.lnModal && (p.id && Z(p.id, null), C(p, "ln-modal:request-close", {}), h(p));
  }
  function g(e) {
    const t = e.detail || {}, o = t.data, p = t.status || 0, v = y(e.target);
    if (o && o.message) {
      const w = o.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: w.type || "error",
          title: w.title || "",
          message: w.body || ""
        }
      }));
    } else p === 0 ? window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
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
  document.addEventListener("ln-ajax:success", d), document.addEventListener("ln-ajax:error", g);
  function f(e) {
    const t = e.detail || {}, o = y(e.target), p = t.message || (t.reason === "max-size" ? o["upload-max-size"] || "File is too large" : t.reason === "max-files" ? o["upload-max-files"] || "Maximum file count exceeded" : o["upload-invalid-type"] || "This file type is not allowed"), v = o["upload-invalid-title"] || "Invalid File";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: p
      }
    }));
  }
  function n(e) {
    const t = e.detail || {}, o = y(e.target), p = t.message || o["upload-failed"] || "Failed to upload file", v = o["upload-error-title"] || "Upload Error";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: v,
        message: p
      }
    }));
  }
  document.addEventListener("ln-upload:invalid", f), document.addEventListener("ln-upload:error", n), document.addEventListener("ln-modal:close", function(e) {
    const t = e.target;
    !t || !t.lnModal || (t.id && Y(t.id) !== null && Z(t.id, null), t.dataset.lnModalMode === "new" && h(t));
  });
  function a(e) {
    return this.dom = e, this.dict = Nt(e, _), this;
  }
  a.prototype.destroy = function() {
    this.dom[i] && (this.dict = {}, delete this.dom[i]);
  }, P(r, i, a, "ln-ui-coordinator");
})();
const st = {};
function Ft(r) {
  const i = r || "default";
  if (!st[i]) {
    const _ = new Intl.NumberFormat(r, { useGrouping: !0 }), y = _.formatToParts(1234.5);
    let u = "", m = ".";
    for (let h = 0; h < y.length; h++)
      y[h].type === "group" && (u = y[h].value), y[h].type === "decimal" && (m = y[h].value);
    st[i] = { groupSep: u, decimalSep: m, fmt: _ };
  }
  return st[i];
}
function Ye(r, i, _) {
  if (r == null || typeof r != "string") return "";
  let y = r.trim();
  return y === "" ? "" : (y = y.replace(/[$€£¥]/g, ""), i && (y = y.split(i).join("")), y = y.replace(/\s/g, ""), _ && _ !== "." && (y = y.replace(_, ".")), y = y.replace(/[^\d.-]/g, ""), y);
}
function kt(r, i) {
  if (typeof r == "number") return isNaN(r) ? NaN : r;
  if (r == null || typeof r != "string") return NaN;
  const _ = r.trim();
  if (_ === "" || _ === "-") return NaN;
  const { groupSep: y, decimalSep: u } = Ft(i), m = Ye(_, y, u);
  if (m === "" || m === "-" || m === ".") return NaN;
  const h = parseFloat(m);
  return isNaN(h) ? NaN : h;
}
function ot(r, i, _ = {}) {
  if (typeof r != "number" || isNaN(r)) return "";
  const y = i || "default", u = _.maxDecimals != null ? parseInt(_.maxDecimals, 10) : null, m = _.userDecimals != null ? _.userDecimals : null;
  if (u !== null) {
    const h = y + "|max:" + u;
    return st[h] || (st[h] = new Intl.NumberFormat(i, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: u
    })), st[h].format(r);
  }
  if (m !== null && m > 0) {
    const h = y + "|exact:" + m;
    return st[h] || (st[h] = new Intl.NumberFormat(i, {
      useGrouping: !0,
      minimumFractionDigits: m,
      maximumFractionDigits: m
    })), st[h].format(r);
  }
  return Ft(i).fmt.format(r);
}
function Un(r, i) {
  if (!r) return 0;
  if (i <= 0)
    return r.startsWith("-") ? 1 : 0;
  let _ = i, y = 0;
  for (let u = 0; u < r.length && _ > 0; u++)
    y = u + 1, /[0-9]/.test(r[u]) && _--;
  return _ > 0 && (y = r.length), y;
}
(function() {
  const r = "data-ln-number", i = "lnNumber";
  if (window[i] !== void 0) return;
  const _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function y(u) {
    if (u[i]) return u[i];
    u[i] = this, this.dom = u;
    const m = this;
    if (this._onLocaleChange = function() {
      m.isTextElement ? m._formatTextContent() : isNaN(m.value) || m._displayFormatted(m.value);
    }, Pt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), u.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const h = document.createElement("input");
    h.type = "hidden", h.name = u.name, u.removeAttribute("name"), u.hasAttribute("data-ln-fill-as") && h.setAttribute("data-ln-fill-as", u.getAttribute("data-ln-fill-as")), u.type = "text", u.setAttribute("inputmode", "decimal"), u.insertAdjacentElement("afterend", h), this._hidden = h, Object.defineProperty(h, "value", {
      get: function() {
        return _.get.call(h);
      },
      set: function(c) {
        if (_.set.call(h, c), c !== "" && !isNaN(parseFloat(c))) {
          const l = m.dom.getAttribute("data-ln-number-decimals");
          m._setDisplayRaw(ot(parseFloat(c), G(m.dom), { maxDecimals: l }));
        } else
          m._setDisplayRaw("");
        m.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Ie(u, _, {
      get: function() {
        return _.get.call(u);
      },
      set: function(c) {
        if (c === "") {
          m._setDisplayRaw(""), m._setHiddenRaw(""), u.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const l = typeof c == "number" ? c : kt(String(c), G(u));
        if (isNaN(l))
          m._setDisplayRaw(String(c)), m._setHiddenRaw("");
        else {
          m._setHiddenRaw(l);
          const b = u.getAttribute("data-ln-number-decimals");
          m._setDisplayRaw(ot(l, G(u), { maxDecimals: b }));
        }
        u.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      m._handleInput();
    }, u.addEventListener("input", this._onInput), this._onKeyDown = function(c) {
      if (c.key !== "Backspace") return;
      const l = u.selectionStart, b = u.selectionEnd;
      if (l !== b || l === 0) return;
      const d = Ft(G(u)), g = _.get.call(u), f = g[l - 1];
      if (f === d.groupSep || /\s/.test(f)) {
        c.preventDefault();
        const n = l - 2 >= 0 ? l - 2 : 0, a = g.slice(0, n) + g.slice(l);
        _.set.call(u, a), u.setSelectionRange(n, n), u.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, u.addEventListener("keydown", this._onKeyDown), this._onPaste = function(c) {
      c.preventDefault();
      const l = (c.clipboardData || window.clipboardData).getData("text"), b = kt(l, G(u));
      m.value = isNaN(b) ? NaN : b;
    }, u.addEventListener("paste", this._onPaste);
    const s = u.value;
    if (s !== "") {
      const c = kt(s, G(u));
      if (!isNaN(c)) {
        const l = u.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(c), this._setDisplayRaw(ot(c, G(u), { maxDecimals: l })), u.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  y.prototype._initTextElement = function() {
    const u = this.dom;
    let m = u.getAttribute("data-ln-value"), h = u.getAttribute("data-ln-number"), s = null;
    m !== null && m !== "" ? s = m : h !== null && h !== "" && h !== "true" ? s = h : s = u.textContent.trim();
    const c = kt(s, G(u));
    isNaN(c) ? this._rawValue = null : (this._rawValue = c, u.hasAttribute("data-ln-value") || u.setAttribute("data-ln-value", String(c)), this._formatTextContent());
  }, y.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const u = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ot(this._rawValue, G(this.dom), { maxDecimals: u });
    }
  }, y.prototype._handleInput = function() {
    const u = this.dom, m = _.get.call(u);
    if (m === "") {
      this._setHiddenRaw(""), C(u, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (m === "-") {
      this._setHiddenRaw(""), C(u, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const h = u.selectionStart;
    let s = 0;
    for (let p = 0; p < h; p++)
      /[0-9]/.test(m[p]) && s++;
    const c = G(u), l = Ft(c);
    let b = m, d = Ye(m, l.groupSep, l.decimalSep), g = parseFloat(d);
    if (isNaN(g)) {
      this._setHiddenRaw(""), C(u, "ln-number:input", { value: NaN, formatted: m });
      return;
    }
    const f = u.getAttribute("data-ln-number-decimals"), n = d.indexOf(".");
    if (f !== null && n !== -1) {
      const p = parseInt(f, 10), v = d.slice(n + 1);
      if (p === 0)
        d = d.slice(0, n), b = b.split(l.decimalSep)[0], g = parseFloat(d), this._setDisplayRaw(b);
      else if (v.length > p) {
        d = d.slice(0, n + 1 + p);
        const w = b.split(l.decimalSep);
        b = w[0] + l.decimalSep + w[1].slice(0, p), g = parseFloat(d), this._setDisplayRaw(b);
      }
    }
    const a = u.getAttribute("data-ln-number-max");
    if (a !== null && g > parseFloat(a)) {
      const p = parseFloat(a), v = ot(p, c, { maxDecimals: f });
      this._setDisplayRaw(v), this._setHiddenRaw(p), u.setSelectionRange(v.length, v.length), C(u, "ln-number:input", { value: p, formatted: v });
      return;
    }
    if (b.endsWith(l.decimalSep) || l.decimalSep !== "." && b.endsWith(".")) {
      this._setHiddenRaw(g), C(u, "ln-number:input", { value: g, formatted: b });
      return;
    }
    const e = d.indexOf(".");
    if (e !== -1 && d.slice(e + 1).endsWith("0")) {
      this._setHiddenRaw(g), C(u, "ln-number:input", { value: g, formatted: b });
      return;
    }
    let t;
    if (f !== null)
      t = ot(g, c, { maxDecimals: f });
    else {
      const p = e !== -1 ? d.slice(e + 1).length : 0;
      t = ot(g, c, { userDecimals: p });
    }
    this._setDisplayRaw(t);
    const o = Un(t, s);
    u.setSelectionRange(o, o), this._setHiddenRaw(g), C(u, "ln-number:input", { value: g, formatted: t });
  }, y.prototype._setHiddenRaw = function(u) {
    this._hidden && _.set.call(this._hidden, String(u));
  }, y.prototype._setDisplayRaw = function(u) {
    this.isTextElement ? this.dom.textContent = String(u) : _.set.call(this.dom, String(u));
  }, y.prototype._displayFormatted = function(u) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const m = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(u, G(this.dom), { maxDecimals: m }));
    }
  }, Object.defineProperty(y.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const u = _.get.call(this._hidden);
      return u === "" ? NaN : parseFloat(u);
    },
    set: function(u) {
      if (this.isTextElement) {
        typeof u != "number" || isNaN(u) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = u, this.dom.setAttribute("data-ln-value", String(u)), this._formatTextContent());
        return;
      }
      if (typeof u != "number" || isNaN(u)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(u);
      const m = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(u, G(this.dom), { maxDecimals: m })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(y.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : _.get.call(this.dom);
    }
  }), y.prototype.destroy = function() {
    this.dom[i] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), C(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[i]);
  }, P(r, i, y, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(u) {
      const m = u[i];
      m && (m.isTextElement ? m._initTextElement() : isNaN(m.value) || m._displayFormatted(m.value));
    }
  });
})();
(function() {
  const r = "data-ln-date", i = "lnDate";
  if (window[i] !== void 0) return;
  const _ = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function u(t, o) {
    const p = t + "|" + JSON.stringify(o);
    return _[p] || (_[p] = new Intl.DateTimeFormat(t, o)), _[p];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, h = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(t) {
    return !t || t === "" ? { dateStyle: "medium" } : t.match(m) ? h[t] : null;
  }
  function c(t, o, p) {
    const v = t.getDate(), w = t.getMonth(), E = t.getFullYear(), S = t.getHours(), L = t.getMinutes();
    let T, x;
    const k = Tt(p), O = (p || "").toLowerCase().split("-")[0], N = u(p, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], K = k && N !== O;
    K && k.monthsLong ? T = k.monthsLong[w] : T = u(p, { month: "long" }).format(t), K && k.monthsShort ? x = k.monthsShort[w] : x = u(p, { month: "short" }).format(t);
    const U = {
      yyyy: String(E),
      yy: String(E).slice(-2),
      MMMM: T,
      MMM: x,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(v).padStart(2, "0"),
      d: String(v),
      HH: String(S).padStart(2, "0"),
      mm: String(L).padStart(2, "0")
    };
    return o.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(B) {
      return U[B];
    });
  }
  function l(t, o, p) {
    const v = s(o);
    if (v) {
      const w = u(p, v), E = (p || "").toLowerCase().split("-")[0], S = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return Tt(p) && S !== E ? c(t, "dd.MM.yyyy", p) : w.format(t);
    }
    return c(t, o, p);
  }
  function b(t) {
    if (!t) return "";
    const o = t.getFullYear(), p = String(t.getMonth() + 1).padStart(2, "0"), v = String(t.getDate()).padStart(2, "0");
    return o + "-" + p + "-" + v;
  }
  function d(t, o, p) {
    C(t.dom, "ln-date:change", {
      value: o,
      formatted: t.dom.value,
      date: p
    }), t.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function g(t, o, p, v) {
    t._setHiddenRaw(o), y.set.call(t._picker, o), t._lastISO = o, v !== void 0 ? (t._isFormatting = !0, t.dom.value = v, t._isFormatting = !1) : p && t._displayFormatted(p), d(t, o, p);
  }
  function f(t) {
    t._setHiddenRaw(""), y.set.call(t._picker, ""), t._isFormatting = !0, t.dom.value = "", t._isFormatting = !1, t._lastISO = "", d(t, "", null);
  }
  n.prototype._initTextElement = function() {
    const t = this.dom;
    let o = t.getAttribute("data-ln-value"), p = t.getAttribute("data-ln-date"), v = t.getAttribute("datetime"), w = null;
    o !== null && o !== "" ? w = o : v !== null && v !== "" ? w = v : p !== null && p !== "" && p !== "true" && !m.test(p) ? w = p : w = t.textContent.trim();
    let E = a(w) || e(w);
    if (!E && w)
      if (isNaN(w))
        E = new Date(w);
      else {
        const S = Number(w);
        E = new Date(S > 1e11 ? S : S * 1e3);
      }
    if (E && !isNaN(E.getTime())) {
      const S = b(E);
      this._rawValue = S, t.hasAttribute("data-ln-value") || t.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, n.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const t = a(this._rawValue);
      if (t) {
        let p = this.dom.getAttribute("data-ln-date-format");
        if (!p) {
          const w = this.dom.getAttribute("data-ln-date");
          w && m.test(w) && (p = w);
        }
        const v = G(this.dom);
        this.dom.textContent = l(t, p || "medium", v);
      }
    }
  };
  function n(t) {
    if (t[i]) return t[i];
    t[i] = this, this.dom = t;
    const o = this;
    if (this._onLocaleChange = function() {
      if (o.isTextElement)
        o._formatTextContent();
      else if (o.value) {
        const k = a(o.value);
        k && o._displayFormatted(k);
      }
    }, Pt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), t.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const p = t.value, v = t.name, E = (t.closest(".form-element, form") || t.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let k = 0; k < E.length; k++) {
      const O = E[k].getAttribute("data-ln-date-dict");
      if (O) {
        const M = Nt(E[k], "data-ln-date-dict-key");
        M["months-long"] && (M.monthsLong = M["months-long"].split(",").map((N) => N.trim())), M["months-short"] && (M.monthsShort = M["months-short"].split(",").map((N) => N.trim())), ie(O, M);
      }
    }
    const S = document.createElement("span");
    S.setAttribute("data-ln-date-field", ""), t.parentNode.insertBefore(S, t), S.appendChild(t), this._wrapper = S;
    const L = document.createElement("input");
    L.type = "hidden", L.name = v, t.removeAttribute("name"), t.hasAttribute("data-ln-fill-as") && L.setAttribute("data-ln-fill-as", t.getAttribute("data-ln-fill-as")), t.insertAdjacentElement("afterend", L), this._hidden = L;
    const T = document.createElement("input");
    T.type = "date", T.tabIndex = -1, T.setAttribute("tabindex", "-1"), T.setAttribute("aria-hidden", "true"), T.setAttribute("aria-label", t.getAttribute("data-ln-date-label") || "Date picker"), T.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", L.insertAdjacentElement("afterend", T), this._picker = T, t.type = "text";
    const x = document.createElement("button");
    if (x.type = "button", x.setAttribute("aria-label", t.getAttribute("data-ln-date-label") || "Open date picker"), x.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', T.insertAdjacentElement("afterend", x), this._btn = x, this._lastISO = "", Object.defineProperty(L, "value", {
      get: function() {
        return y.get.call(L);
      },
      set: function(k) {
        if (y.set.call(L, k), k && k !== "") {
          const O = a(k);
          O && g(o, k, O);
        } else k === "" && f(o);
      }
    }), Ie(t, y, {
      get: function() {
        return y.get.call(t);
      },
      set: function(k, O) {
        if (o._isFormatting) {
          O(k);
          return;
        }
        if (!k || k === "") {
          O(""), f(o);
          return;
        }
        const M = a(k) || e(k);
        if (M) {
          const N = b(M), K = t.getAttribute(r) || "", U = G(t), B = l(M, K, U);
          O(B), g(o, N, M, B);
        } else
          O(String(k)), f(o);
      }
    }), this._onPickerChange = function() {
      const k = T.value;
      if (k) {
        const O = a(k);
        O && g(o, k, O);
      } else
        f(o);
    }, T.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const k = o.dom.value.trim();
      if (k === "") {
        o._lastISO !== "" && f(o);
        return;
      }
      if (o._lastISO) {
        const M = a(o._lastISO);
        if (M) {
          const N = o.dom.getAttribute(r) || "", K = G(o.dom);
          if (k === l(M, N, K)) return;
        }
      }
      const O = e(k);
      if (O) {
        const M = b(O);
        g(o, M, O);
      } else if (o._lastISO) {
        const M = a(o._lastISO);
        M && o._displayFormatted(M);
      } else
        o.dom.value = "";
    }, t.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      o._openPicker();
    }, x.addEventListener("click", this._onBtnClick), p && p !== "") {
      const k = a(p);
      k && g(o, p, k);
    }
    return this;
  }
  function a(t) {
    if (!t || typeof t != "string") return null;
    const o = t.split("T"), p = o[0].split("-");
    if (p.length < 3) return null;
    const v = parseInt(p[0], 10), w = parseInt(p[1], 10) - 1, E = parseInt(p[2], 10);
    if (isNaN(v) || isNaN(w) || isNaN(E)) return null;
    let S = 0, L = 0;
    if (o[1]) {
      const x = o[1].split(":");
      S = parseInt(x[0], 10) || 0, L = parseInt(x[1], 10) || 0;
    }
    const T = new Date(v, w, E, S, L);
    return T.getFullYear() !== v || T.getMonth() !== w || T.getDate() !== E ? null : T;
  }
  function e(t) {
    if (!t || typeof t != "string" || (t = t.trim(), t.length < 6)) return null;
    let o, p;
    if (t.indexOf(".") !== -1)
      o = ".", p = t.split(".");
    else if (t.indexOf("/") !== -1)
      o = "/", p = t.split("/");
    else if (t.indexOf("-") !== -1)
      o = "-", p = t.split("-");
    else
      return null;
    if (p.length !== 3) return null;
    const v = [];
    for (let T = 0; T < 3; T++) {
      const x = parseInt(p[T], 10);
      if (isNaN(x)) return null;
      v.push(x);
    }
    let w, E, S;
    o === "." ? (w = v[0], E = v[1], S = v[2]) : o === "/" ? (E = v[0], w = v[1], S = v[2]) : p[0].length === 4 ? (S = v[0], E = v[1], w = v[2]) : (w = v[0], E = v[1], S = v[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
    const L = new Date(S, E - 1, w);
    return L.getFullYear() !== S || L.getMonth() !== E - 1 || L.getDate() !== w ? null : L;
  }
  n.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, n.prototype._setHiddenRaw = function(t) {
    y.set.call(this._hidden, t);
  }, n.prototype._displayFormatted = function(t) {
    const o = this.dom.getAttribute(r) || "", p = G(this.dom);
    this._isFormatting = !0, this.dom.value = l(t, o, p), this._isFormatting = !1;
  }, Object.defineProperty(n.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : y.get.call(this._hidden);
    },
    set: function(t) {
      if (this.isTextElement) {
        if (!t || t === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const p = a(t) || e(t);
        if (!p) return;
        const v = b(p);
        this._rawValue = v, this.dom.setAttribute("data-ln-value", v), this._formatTextContent();
        return;
      }
      if (!t || t === "") {
        f(this);
        return;
      }
      const o = a(t);
      o && g(this, t, o);
    }
  }), Object.defineProperty(n.prototype, "date", {
    get: function() {
      const t = this.value;
      return t ? a(t) : null;
    },
    set: function(t) {
      if (!t || !(t instanceof Date) || isNaN(t.getTime())) {
        this.value = "";
        return;
      }
      this.value = b(t);
    }
  }), Object.defineProperty(n.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), n.prototype.destroy = function() {
    if (!this.dom[i]) return;
    if (this.isTextElement) {
      C(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[i];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const t = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", t && (this.dom.value = t), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), C(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[i];
  }, P(r, i, n, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(t) {
      const o = t[i];
      if (o) {
        if (o.isTextElement)
          o._initTextElement();
        else if (o.value) {
          const p = a(o.value);
          p && o._displayFormatted(p);
        }
      }
    }
  });
})();
(function() {
  const r = "data-ln-nav", i = "lnNav";
  if (window[i] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const m = history.pushState;
    history.pushState = function() {
      m.apply(history, arguments);
      for (const s of history._lnNavCallbacks)
        s();
    };
    const h = history.replaceState;
    history.replaceState = function() {
      h.apply(history, arguments);
      for (const s of history._lnNavCallbacks)
        s();
    }, history._lnNavPatched = !0;
  }
  function _(m) {
    return this.dom = m, this.activeClass = m.getAttribute(r) || "active", this.exact = m.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(m, { childList: !0, subtree: !0 }), this.update(), this;
  }
  _.prototype.update = function() {
    if (!this.activeClass || W(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const h = Array.from(this.dom.querySelectorAll("a")), s = window.location.pathname, c = y(s), l = [];
    for (const b of h) {
      const d = b.getAttribute("href");
      if (!d || d === "#" || d.startsWith("#") || d.startsWith("javascript:") || d.startsWith("mailto:") || d.startsWith("tel:")) {
        b.classList.remove(this.activeClass), b.removeAttribute("aria-current");
        continue;
      }
      if (b.hostname && b.hostname !== window.location.hostname) {
        b.classList.remove(this.activeClass), b.removeAttribute("aria-current");
        continue;
      }
      const g = y(d), f = g === c, n = !this.exact && g !== "/" && c.startsWith(g + "/");
      f || n ? (b.classList.add(this.activeClass), b.setAttribute("aria-current", "page"), l.push(b)) : (b.classList.remove(this.activeClass), b.removeAttribute("aria-current"));
    }
    C(this.dom, "ln-nav:update", { target: this.dom, activeLinks: l });
  }, _.prototype.destroy = function() {
    if (!this.dom[i]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const m = history._lnNavCallbacks.indexOf(this.updateHandler);
    m !== -1 && history._lnNavCallbacks.splice(m, 1), C(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[i];
  };
  function y(m) {
    try {
      return new URL(m, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return m.replace(/\/$/, "") || "/";
    }
  }
  function u(m, h) {
    const s = m[i];
    if (s) {
      if (h === r) {
        if (!m.hasAttribute(r)) {
          s.destroy();
          return;
        }
        const c = s.activeClass, l = m.getAttribute(r) || "active";
        if (c !== l) {
          const b = m.querySelectorAll("a");
          for (const d of b)
            c && d.classList.remove(c);
          s.activeClass = l;
        }
      } else h === "data-ln-nav-exact" && (s.exact = m.hasAttribute("data-ln-nav-exact"));
      s.update();
    }
  }
  P(r, i, _, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: u
  });
})();
(function() {
  const r = "data-ln-tabs", i = "lnTabs";
  if (window[i] !== void 0 && window[i] !== null) return;
  function _(m, h) {
    const s = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (s) return s;
    if (m.tagName !== "A") return "";
    const c = m.getAttribute("href") || "";
    if (!c.startsWith("#")) return "";
    const l = c.slice(1);
    if (!l) return "";
    const b = l.split("&");
    if (h)
      for (const f of b) {
        const n = f.indexOf(":");
        if (n > 0 && f.slice(0, n).toLowerCase().trim() === h)
          return f.slice(n + 1).toLowerCase().trim();
      }
    const d = b[b.length - 1] || "", g = d.indexOf(":");
    return (g > 0 ? d.slice(g + 1) : d).toLowerCase().trim();
  }
  function y(m) {
    return this.dom = m, this.activeKey = null, u.call(this), this;
  }
  function u() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((c) => c.tagName === "A" && (c.getAttribute("href") || "").startsWith("#")), h = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = h && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : h && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const c of this.tabs) {
      const l = _(c, this.nsKey);
      l ? this.mapTabs[l] = c : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', c);
    }
    for (const c of this.panels) {
      const l = (c.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      l && (this.mapPanels[l] = c);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const c of this.tabs) {
      if (c[i + "Trigger"]) continue;
      const l = function(b) {
        const d = c.tagName === "A";
        if (!d && (b.ctrlKey || b.metaKey || b.button === 1)) return;
        const g = _(c, s.nsKey);
        g && (d && !oe(b) || (s.hashEnabled ? Y(s.nsKey) === g ? s.dom.setAttribute("data-ln-tabs-active", g) : Z(s.nsKey, g) : s.dom.setAttribute("data-ln-tabs-active", g)));
      };
      c.addEventListener("click", l), c[i + "Trigger"] = l, s._clickHandlers.push({ el: c, handler: l });
    }
    if (this._onRequestSelect = function(c) {
      const l = c.detail && (c.detail.key || c.detail.tab);
      l && s.select(l);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const c = Y(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", c !== null ? c : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let c = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const l = Ht("tabs", this.dom);
        l !== null && l in this.mapPanels && (c = l);
      }
      this.dom.setAttribute("data-ln-tabs-active", c);
    }
  }
  y.prototype.select = function(m) {
    const h = (m + "").toLowerCase().trim();
    h && (this.hashEnabled ? Y(this.nsKey) === h ? this.dom.setAttribute("data-ln-tabs-active", h) : Z(this.nsKey, h) : this.dom.setAttribute("data-ln-tabs-active", h));
  }, y.prototype._applyActive = function(m) {
    var s;
    if ((!m || !(m in this.mapPanels)) && (m = this.defaultKey), m === this.activeKey) return;
    const h = this.activeKey;
    if (h !== null && W(this.dom, "ln-tabs:before-change", {
      key: m,
      previousKey: h,
      tab: this.mapTabs[m],
      panel: this.mapPanels[m],
      target: this.dom
    }).defaultPrevented) {
      h in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", h), this.hashEnabled && Y(this.nsKey) !== h && Z(this.nsKey, h));
      return;
    }
    this.activeKey = m;
    for (const c in this.mapTabs) {
      const l = this.mapTabs[c];
      c === m ? (l.setAttribute("data-active", ""), l.setAttribute("aria-selected", "true")) : (l.removeAttribute("data-active"), l.setAttribute("aria-selected", "false"));
    }
    for (const c in this.mapPanels) {
      const l = this.mapPanels[c], b = c === m;
      l.classList.toggle("hidden", !b), l.setAttribute("aria-hidden", b ? "false" : "true");
    }
    if (this.autoFocus) {
      const c = (s = this.mapPanels[m]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      c && setTimeout(() => c.focus({ preventScroll: !0 }), 0);
    }
    C(this.dom, "ln-tabs:change", {
      key: m,
      previousKey: h,
      tab: this.mapTabs[m],
      panel: this.mapPanels[m],
      target: this.dom
    }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && gt("tabs", this.dom, m);
  }, y.prototype.destroy = function() {
    if (this.dom[i]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: m, handler: h } of this._clickHandlers)
        m.removeEventListener("click", h), delete m[i + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), C(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[i];
    }
  }, P(r, i, y, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const h = m.getAttribute("data-ln-tabs-active");
      m[i]._applyActive(h);
    }
  });
})();
(function() {
  const r = "data-ln-toggle", i = "lnToggle", _ = "data-ln-toggle-for", y = "data-ln-toggle-action", u = "data-ln-persist";
  if (window[i] !== void 0) return;
  const m = /* @__PURE__ */ new Set();
  let h = null;
  function s(f, n) {
    return n === "open" ? "open" : n === "close" || f === "open" ? "close" : "open";
  }
  function c() {
    h || (h = function(f) {
      if (Te(f)) return;
      const n = f.target.closest("[" + _ + "]");
      if (!n || qe(n)) return;
      const a = n.getAttribute(_);
      if (!a) return;
      const e = document.getElementById(a);
      if (!e || !e[i]) return;
      f.preventDefault();
      const t = n.getAttribute(y) || "toggle", o = e.getAttribute(r);
      e.setAttribute(r, s(o, t));
    }, document.addEventListener("click", h));
  }
  function l() {
    m.size > 0 || !h || (document.removeEventListener("click", h), h = null);
  }
  function b(f, n) {
    if (!f || !f.id) return;
    const a = document.querySelectorAll(
      "[" + _ + '="' + f.id + '"]'
    );
    for (let e = 0; e < a.length; e++)
      a[e].setAttribute("aria-expanded", n ? "true" : "false");
  }
  function d(f) {
    this.dom = f;
    const n = this;
    if (this._onRequestOpen = function() {
      n.open();
    }, this._onRequestClose = function() {
      n.close();
    }, this._onRequestToggle = function() {
      n.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), f.hasAttribute(u)) {
      const a = Ht("toggle", f);
      a !== null && f.setAttribute(r, a === "open" ? "open" : "close");
    }
    return this.isOpen = f.getAttribute(r) === "open", this.isOpen && f.classList.add("open"), b(f, this.isOpen), m.add(this), c(), this;
  }
  d.prototype.open = function() {
    this.dom.setAttribute(r, "open");
  }, d.prototype.close = function() {
    this.dom.setAttribute(r, "close");
  }, d.prototype.toggle = function() {
    const f = this.dom.getAttribute(r);
    this.dom.setAttribute(r, s(f, "toggle"));
  }, d.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.delete(this), delete this.dom[i], l(), C(this.dom, "ln-toggle:destroyed", { target: this.dom }));
  };
  function g(f) {
    const n = f[i];
    if (!n) return;
    const e = f.getAttribute(r) === "open";
    if (e !== n.isOpen)
      if (e) {
        if (W(f, "ln-toggle:before-open", { target: f }).defaultPrevented) {
          f.setAttribute(r, "close");
          return;
        }
        n.isOpen = !0, f.classList.add("open"), b(f, !0), C(f, "ln-toggle:open", { target: f }), f.hasAttribute(u) && gt("toggle", f, "open");
      } else {
        if (W(f, "ln-toggle:before-close", { target: f }).defaultPrevented) {
          f.setAttribute(r, "open");
          return;
        }
        n.isOpen = !1, f.classList.remove("open"), b(f, !1), C(f, "ln-toggle:close", { target: f }), f.hasAttribute(u) && gt("toggle", f, "close");
      }
  }
  P(r, i, d, "ln-toggle", {
    onAttributeChange: g
  });
})();
(function() {
  const r = "data-ln-accordion", i = "lnAccordion";
  if (window[i] !== void 0) return;
  function _(y) {
    return this.dom = y, this._onToggleOpen = function(u) {
      if (u.detail.target.closest("[data-ln-accordion]") !== y) return;
      const m = y.querySelectorAll("[data-ln-toggle]");
      for (const h of m)
        h !== u.detail.target && h.closest("[data-ln-accordion]") === y && h.getAttribute("data-ln-toggle") === "open" && h.setAttribute("data-ln-toggle", "close");
      C(y, "ln-accordion:change", { target: u.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  _.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), C(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[i]);
  }, P(r, i, _, "ln-accordion");
})();
(function() {
  const r = "data-ln-dropdown", i = "lnDropdown", _ = "data-ln-dropdown-position", y = "data-ln-dropdown-placement", u = "bottom-end";
  if (window[i] !== void 0) return;
  function m(h) {
    this.dom = h, this.toggleEl = h.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = h.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
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
      const l = s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (c.key === "Escape") {
        l && (c.preventDefault(), c.stopPropagation(), s.toggleEl.setAttribute("data-ln-toggle", "close"), s.triggerBtn && s.triggerBtn.focus());
        return;
      }
      if (c.key === "Tab") {
        l && (s.triggerBtn && s.triggerBtn.focus(), s.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const b = s._getMenuItems();
      if (b.length === 0) return;
      if (!l && (c.key === "ArrowDown" || c.key === "ArrowUp")) {
        c.preventDefault(), s.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const g = s._getMenuItems();
          g.length > 0 && s._focusItem(g, c.key === "ArrowDown" ? 0 : g.length - 1);
        }, 0);
        return;
      }
      if (!l) return;
      const d = b.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const g = d < b.length - 1 ? d + 1 : 0;
        s._focusItem(b, g);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const g = d > 0 ? d - 1 : b.length - 1;
        s._focusItem(b, g);
      } else c.key === "Home" ? (c.preventDefault(), s._focusItem(b, 0)) : c.key === "End" && (c.preventDefault(), s._focusItem(b, b.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(c) {
      !c.detail || c.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "true"), typeof s.toggleEl.showPopover == "function" && s.toggleEl.showPopover(), s._initMenuAria(), s._reposition(), s._addOutsideClickListener(), s._addScrollRepositionListener(), s._addResizeCloseListener(), C(h, "ln-dropdown:open", { target: c.detail.target }));
    }, this._onToggleClose = function(c) {
      !c.detail || c.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "false"), s._removeOutsideClickListener(), s._removeScrollRepositionListener(), s._removeResizeCloseListener(), s.toggleEl.style.top = "", s.toggleEl.style.left = "", s.toggleEl.removeAttribute(y), typeof s.toggleEl.hidePopover == "function" && s.toggleEl.matches(":popover-open") && s.toggleEl.hidePopover(), C(h, "ln-dropdown:close", { target: c.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  m.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const h = this.toggleEl.querySelectorAll("li");
    for (const c of h)
      c.setAttribute("role", "none");
    const s = this._getMenuItems();
    for (let c = 0; c < s.length; c++)
      s[c].setAttribute("role", "menuitem"), s[c].setAttribute("tabindex", c === 0 ? "0" : "-1");
  }, m.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, m.prototype._focusItem = function(h, s) {
    for (let c = 0; c < h.length; c++)
      h[c].setAttribute("tabindex", c === s ? "0" : "-1");
    h[s] && h[s].focus();
  }, m.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const h = this.triggerBtn.getBoundingClientRect(), s = $t(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, l = this.dom.getAttribute(_) || u, b = Ot(h, s, l, c);
    this.toggleEl.style.top = b.top + "px", this.toggleEl.style.left = b.left + "px", this.toggleEl.setAttribute(y, b.placement);
  }, m.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const h = this;
    this._boundDocClick = function(s) {
      h.dom.contains(s.target) || h.toggleEl && h.toggleEl.contains(s.target) || h.toggleEl && h.toggleEl.getAttribute("data-ln-toggle") === "open" && h.toggleEl.setAttribute("data-ln-toggle", "close");
    }, h._docClickTimeout = setTimeout(function() {
      h._docClickTimeout = null, document.addEventListener("click", h._boundDocClick);
    }, 0);
  }, m.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, m.prototype._addScrollRepositionListener = function() {
    const h = this;
    this._boundScrollReposition = function() {
      h._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, m.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, m.prototype._addResizeCloseListener = function() {
    const h = this;
    this._boundResizeClose = function() {
      h.toggleEl && h.toggleEl.getAttribute("data-ln-toggle") === "open" && h.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, m.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, m.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(y), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), C(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[i]);
  }, P(r, i, m, "ln-dropdown");
})();
(function() {
  const r = "data-ln-popover", i = "lnPopover", _ = "data-ln-popover-for", y = "data-ln-popover-position";
  if (window[i] !== void 0) return;
  const u = [];
  let m = null;
  function h() {
    m || (m = function(b) {
      if (b.key !== "Escape" || u.length === 0) return;
      u[u.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function s() {
    u.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function c(b) {
    this.dom = b, this.isOpen = b.getAttribute(r) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const d = this;
    return this._onRequestOpen = function(g) {
      const f = g.detail && g.detail.trigger ? g.detail.trigger : null;
      d.open(f);
    }, this._onRequestClose = function() {
      d.close();
    }, this._onRequestToggle = function(g) {
      const f = g.detail && g.detail.trigger ? g.detail.trigger : null;
      d.toggle(f);
    }, b.addEventListener("ln-popover:request-open", this._onRequestOpen), b.addEventListener("ln-popover:request-close", this._onRequestClose), b.addEventListener("ln-popover:request-toggle", this._onRequestToggle), b.hasAttribute("tabindex") || b.setAttribute("tabindex", "-1"), b.hasAttribute("role") || b.setAttribute("role", "dialog"), b.hasAttribute("popover") || b.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  c.prototype.open = function(b) {
    this.isOpen || (this.trigger = b || null, this.dom.setAttribute(r, "open"));
  }, c.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(r, "closed");
  }, c.prototype.toggle = function(b) {
    this.isOpen ? this.close() : this.open(b);
  }, c.prototype._applyOpen = function(b) {
    this.isOpen = !0, b && (this.trigger = b), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const d = $t(this.dom);
    if (this.trigger) {
      const a = this.trigger.getBoundingClientRect(), e = this.dom.getAttribute(y) || "bottom", t = Ot(a, d, e, 8);
      this.dom.style.top = t.top + "px", this.dom.style.left = t.left + "px", this.dom.setAttribute("data-ln-popover-placement", t.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const g = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), f = Array.prototype.find.call(g, Lt);
    f ? f.focus() : this.dom.focus();
    const n = this;
    this._boundDocClick = function(a) {
      n.dom.contains(a.target) || n.trigger && n.trigger.contains(a.target) || n.close();
    }, n._docClickTimeout = setTimeout(function() {
      n._docClickTimeout = null, document.addEventListener("click", n._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!n.trigger) return;
      const a = n.trigger.getBoundingClientRect(), e = $t(n.dom), t = n.dom.getAttribute(y) || "bottom", o = Ot(a, e, t, 8);
      n.dom.style.top = o.top + "px", n.dom.style.left = o.left + "px", n.dom.setAttribute("data-ln-popover-placement", o.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), u.push(this), h(), C(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, c.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const b = u.indexOf(this);
    b !== -1 && u.splice(b, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, C(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, c.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[i], C(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function l(b) {
    this.dom = b;
    const d = b.getAttribute(_);
    return b.setAttribute("aria-haspopup", "dialog"), b.setAttribute("aria-expanded", "false"), b.setAttribute("aria-controls", d), this._onClick = function(g) {
      if (g.ctrlKey || g.metaKey || g.button === 1) return;
      g.preventDefault();
      const f = document.getElementById(d);
      if (!f) return;
      f[i] && (f[i].trigger = b);
      const n = f.getAttribute(r);
      f.setAttribute(r, n === "open" ? "closed" : "open");
    }, b.addEventListener("click", this._onClick), this;
  }
  l.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[i + "Trigger"];
  }, P(r, i, c, "ln-popover", {
    onAttributeChange: function(b) {
      const d = b[i];
      if (!d) return;
      const f = b.getAttribute(r) === "open";
      if (f !== d.isOpen)
        if (f) {
          if (W(b, "ln-popover:before-open", {
            popoverId: b.id,
            target: b,
            trigger: d.trigger
          }).defaultPrevented) {
            b.setAttribute(r, "closed");
            return;
          }
          d._applyOpen(d.trigger);
        } else {
          if (W(b, "ln-popover:before-close", {
            popoverId: b.id,
            target: b,
            trigger: d.trigger
          }).defaultPrevented) {
            b.setAttribute(r, "open");
            return;
          }
          d._applyClose();
        }
    }
  }), P(_, i + "Trigger", l, "ln-popover-trigger");
})();
(function() {
  const r = "data-ln-tooltip-enhance", i = "data-ln-tooltip", _ = "data-ln-tooltip-position", y = "lnTooltipEnhance", u = "ln-tooltip-portal";
  if (window[y] !== void 0) return;
  let m = 0, h = null, s = null, c = null, l = null, b = null, d = null;
  function g() {
    return h && h.parentNode || (h = document.getElementById(u), h || (h = document.createElement("div"), h.id = u, document.body.appendChild(h)), h.hasAttribute("popover") || h.setAttribute("popover", "manual")), h;
  }
  function f() {
    d || (d = function(o) {
      o.key === "Escape" && e();
    }, document.addEventListener("keydown", d));
  }
  function n() {
    d && (document.removeEventListener("keydown", d), d = null);
  }
  function a(o) {
    if (c === o) return;
    e();
    const p = o.getAttribute(i) || o.getAttribute("title");
    if (!p) return;
    g(), typeof h.showPopover == "function" && h.showPopover(), o.hasAttribute("title") && (l = o.getAttribute("title"), o.removeAttribute("title"));
    const v = o.getAttribute("aria-describedby");
    v ? b = v : b = null;
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = p, o[y + "Uid"] || (m += 1, o[y + "Uid"] = "ln-tooltip-" + m), w.id = o[y + "Uid"], h.appendChild(w);
    const E = w.offsetWidth, S = w.offsetHeight, L = o.getBoundingClientRect(), T = o.getAttribute(_) || "top", x = Ot(L, { width: E, height: S }, T, 6);
    w.style.top = x.top + "px", w.style.left = x.left + "px", w.setAttribute("data-ln-tooltip-placement", x.placement), b ? o.setAttribute("aria-describedby", b + " " + w.id) : o.setAttribute("aria-describedby", w.id), s = w, c = o, f();
  }
  function e() {
    if (!s) {
      n();
      return;
    }
    c && (b !== null ? c.setAttribute("aria-describedby", b) : c.removeAttribute("aria-describedby"), b = null, l !== null && c.setAttribute("title", l)), l = null, s.parentNode && s.parentNode.removeChild(s), s = null, c = null, h && typeof h.hidePopover == "function" && h.matches(":popover-open") && h.hidePopover(), n();
  }
  function t(o) {
    return this.dom = o, o.hasAttribute("data-ln-tooltip-enhanced") || (o.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      a(o);
    }, this._onLeave = function() {
      c === o && !o.contains(document.activeElement) && e();
    }, this._onFocus = function() {
      a(o);
    }, this._onBlur = function() {
      c === o && !o.matches(":hover") && e();
    }, o.addEventListener("mouseenter", this._onEnter), o.addEventListener("mouseleave", this._onLeave), o.addEventListener("focus", this._onFocus, !0), o.addEventListener("blur", this._onBlur, !0), this;
  }
  t.prototype.destroy = function() {
    const o = this.dom;
    o.removeEventListener("mouseenter", this._onEnter), o.removeEventListener("mouseleave", this._onLeave), o.removeEventListener("focus", this._onFocus, !0), o.removeEventListener("blur", this._onBlur, !0), c === o && e(), this._addedEnhancedAttr && o.removeAttribute("data-ln-tooltip-enhanced"), delete o[y], delete o[y + "Uid"], C(o, "ln-tooltip:destroyed", { trigger: o });
  }, P(
    "[" + r + "], [data-ln-tooltip-enhanced], [" + i + "][title]",
    y,
    t,
    "ln-tooltip"
  );
})();
(function() {
  const r = "data-ln-toast", i = "lnToast", _ = "ln-toast-item";
  if (window[i] !== void 0) return;
  function y(n) {
    if (!(!n || !(n instanceof HTMLElement)) && (n.hasAttribute("popover") || n.setAttribute("popover", "manual"), typeof n.showPopover == "function")) {
      if (n.matches(":popover-open"))
        try {
          n.hidePopover();
        } catch {
        }
      try {
        n.showPopover();
      } catch {
      }
    }
  }
  function u(n) {
    if (!n || !(n instanceof HTMLElement)) return;
    if (n.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof n.hidePopover == "function" && n.matches(":popover-open"))
      try {
        n.hidePopover();
      } catch {
      }
  }
  function m(n) {
    this.dom = n, this.timeoutDefault = +(n.getAttribute("data-ln-toast-timeout") ?? 6e3), this.max = +(n.getAttribute("data-ln-toast-max") ?? 5);
    const a = Array.from(n.querySelectorAll("[data-ln-toast-item]"));
    for (; a.length > this.max; ) n.removeChild(a.shift());
    for (const e of a) d(e, this);
    return a.length > 0 && y(n), this;
  }
  m.prototype.enqueue = function(n) {
    if (!n) return;
    const a = h(n, this.dom);
    if (!a) return;
    const e = Number.isFinite(n.timeout) ? n.timeout : this.timeoutDefault;
    c(this, a), e > 0 && (a._timer = setTimeout(() => l(a), e));
  }, m.prototype.clear = function() {
    for (const n of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      l(n);
  }, m.prototype.destroy = function() {
    if (this.dom[i]) {
      for (const n of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        l(n);
      u(this.dom), C(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[i];
    }
  };
  function h(n, a) {
    const e = ((n.type || "") + "").trim().toLowerCase(), t = ft(a, _, "ln-toast");
    if (!t)
      return console.warn('[ln-toast] Template "' + _ + '" not found'), null;
    nt(t, {
      type: e,
      title: n.title,
      message: typeof n.message == "string" ? n.message : void 0
    });
    const o = t.firstElementChild;
    if (!o) return null;
    o.hasAttribute("data-ln-toast-item") || o.setAttribute("data-ln-toast-item", ""), o.classList.add("ln-enter");
    const p = o.querySelector(".body");
    p && s(p, n);
    const v = o.querySelector("[data-ln-toast-close]");
    return v && v.addEventListener("click", function() {
      l(o);
    }), o;
  }
  function s(n, a) {
    if (Array.isArray(a.message)) {
      const e = document.createElement("ul");
      for (const t of a.message) {
        const o = document.createElement("li");
        o.textContent = t, e.appendChild(o);
      }
      n.appendChild(e);
    }
    if (a.data && a.data.errors) {
      const e = document.createElement("ul");
      for (const t of Object.values(a.data.errors).flat()) {
        const o = document.createElement("li");
        o.textContent = t, e.appendChild(o);
      }
      n.appendChild(e);
    }
  }
  function c(n, a) {
    const e = Array.from(n.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; e.length >= n.max && e.length > 0; ) n.dom.removeChild(e.shift());
    n.dom.appendChild(a), y(n.dom), requestAnimationFrame(() => a.classList.remove("ln-enter"));
  }
  function l(n) {
    if (!n || !n.parentNode) return;
    const a = n.parentNode;
    clearTimeout(n._timer), n.classList.remove("ln-enter"), n.classList.add("ln-out"), setTimeout(() => {
      n.parentNode && (n.parentNode.removeChild(n), u(a));
    }, 200);
  }
  function b(n) {
    let a = n && n.container;
    return typeof a == "string" && (a = document.querySelector(a)), a instanceof HTMLElement || (a = document.querySelector("[" + r + "]") || document.getElementById("ln-toast-container")), a || null;
  }
  function d(n, a) {
    if (n._lnToastHydrated) return;
    n._lnToastHydrated = !0;
    const e = n.querySelector("[data-ln-toast-close]");
    e && e.addEventListener("click", function() {
      l(n);
    });
    const t = +(n.getAttribute("data-ln-toast-timeout") ?? a.timeoutDefault);
    t > 0 && (n._timer = setTimeout(function() {
      l(n);
    }, t));
  }
  function g(n) {
    const a = n.detail || {}, e = b(a);
    if (!e) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (e[i] || (e[i] = new m(e))).enqueue(a);
  }
  function f(n) {
    const a = n && n.detail || {};
    if (a.container) {
      const e = b(a);
      e && (e[i] || (e[i] = new m(e))).clear();
    } else {
      const e = document.querySelectorAll("[" + r + "]");
      for (const t of Array.from(e))
        (t[i] || (t[i] = new m(t))).clear();
    }
  }
  lt(function() {
    window.addEventListener("ln-toast:enqueue", g), window.addEventListener("ln-toast:clear", f), window.addEventListener("ln-modal:open", function() {
      const n = document.querySelectorAll("[" + r + "]");
      for (const a of Array.from(n))
        a.querySelectorAll("[data-ln-toast-item]").length > 0 && y(a);
    });
  }, "ln-toast"), P(r, i, m, "ln-toast");
})();
function zn(r) {
  if (!r) return null;
  const i = String(r).split(",").map((_) => _.trim().toLowerCase()).filter(Boolean).map((_) => _.startsWith(".") ? _.slice(1) : _);
  return i.length ? i : null;
}
function Kn(r) {
  return !r || typeof r != "string" || !r.includes(".") ? "" : r.split(".").pop().toLowerCase();
}
function jn(r, i) {
  if (!i || i.length === 0) return !0;
  if (!r) return !1;
  const _ = Kn(r.name), y = String(r.type || "").toLowerCase();
  return i.some((u) => {
    if (u.includes("/")) {
      if (u.endsWith("/*")) {
        const m = u.slice(0, -1);
        return y.startsWith(m);
      }
      return y === u;
    }
    return _ === u;
  });
}
function Vn(r, i = "en", _ = {}) {
  if (typeof r != "number" || isNaN(r) || r === 0)
    return "0 " + (_["unit-b"] || "B");
  const y = 1024, u = [
    _["unit-b"] || "B",
    _["unit-kb"] || "KB",
    _["unit-mb"] || "MB",
    _["unit-gb"] || "GB"
  ], m = Math.floor(Math.log(r) / Math.log(y)), h = Math.min(m, u.length - 1), s = r / Math.pow(y, h);
  return new Intl.NumberFormat(i, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(s) + " " + u[h];
}
(function() {
  const r = "data-ln-upload", i = "lnUpload", _ = "data-ln-upload-dict", y = "data-ln-upload-accept", u = "data-ln-upload-delete", m = "data-ln-upload-max-size", h = "data-ln-upload-max-files", s = "data-ln-upload-file-field", c = "data-ln-upload-ids-field", l = "file", b = "file_ids[]";
  if (window[i] !== void 0) return;
  function d(n, a, e) {
    return Vn(n, a, e);
  }
  function g() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function f(n) {
    this.dom = n, this.dict = Nt(n, _), this.locale = G(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n), this.uploadUrl = n.getAttribute(r) || "", this.deleteUrlPattern = n.getAttribute(u) || "", this.fileFieldName = n.getAttribute(s) || l, this.idsFieldName = n.getAttribute(c) || b, this.maxSize = +n.getAttribute(m) || 0, this.maxFiles = +n.getAttribute(h) || 0;
    const a = n.getAttribute(y) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = zn(a), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  f.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const a = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let t = 0; t < a.length; t++) {
      const o = a[t], p = o.getAttribute("data-ln-upload-id"), v = "file-" + ++n.fileIdCounter;
      o.setAttribute("data-ln-upload-local-id", v);
      const w = o.querySelector('[data-ln-field="name"]'), E = o.querySelector('[data-ln-field="sizeText"]'), S = o.getAttribute("data-ln-upload-size"), L = S ? parseInt(S, 10) : null;
      n.uploadedFiles.set(v, {
        serverId: p || null,
        name: w ? w.textContent.trim() : "",
        size: L !== null && !isNaN(L) ? L : E ? E.textContent.trim() : ""
      });
    }
    const e = this.dom.querySelectorAll('input[type="hidden"]');
    for (let t = 0; t < e.length; t++) {
      const o = e[t];
      if (o.name === n.idsFieldName && o.value && !Array.from(n.uploadedFiles.values()).some(function(v) {
        return String(v.serverId) === String(o.value);
      })) {
        const v = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(v, {
          serverId: o.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, f.prototype._syncHiddenInputs = function() {
    const n = this, a = this.dom.querySelectorAll('input[type="hidden"]');
    for (let e = 0; e < a.length; e++)
      a[e].name === n.idsFieldName && a[e].remove();
    for (const [, e] of this.uploadedFiles)
      if (e.serverId) {
        const t = document.createElement("input");
        t.type = "hidden", t.name = n.idsFieldName, t.value = e.serverId, n.dom.appendChild(t);
      }
  }, f.prototype._bindEvents = function() {
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
      const e = a.target.closest('[data-ln-upload-action="remove"]');
      if (!e || !n.list || !n.list.contains(e) || e.disabled) return;
      const t = e.closest("[data-ln-upload-item]");
      if (t) {
        const o = t.getAttribute("data-ln-upload-local-id");
        o && n.remove(o);
      }
    }, this._onRequestUpload = function(a) {
      a.detail && a.detail.files && n.upload(a.detail.files);
    }, this._onRequestRemove = function(a) {
      if (a.detail) {
        const e = a.detail.localId !== void 0 ? a.detail.localId : a.detail.serverId;
        e !== void 0 && n.remove(e);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, f.prototype.upload = function(n) {
    const a = this, e = Array.from(n);
    for (let t = 0; t < e.length; t++) {
      const o = e[t];
      if (a.maxFiles > 0 && a.uploadedFiles.size >= a.maxFiles) {
        C(a.dom, "ln-upload:invalid", {
          file: o,
          reason: "max-files"
        });
        continue;
      }
      if (!jn(o, a.allowedExts)) {
        C(a.dom, "ln-upload:invalid", {
          file: o,
          reason: "accept"
        });
        continue;
      }
      if (a.maxSize > 0 && o.size > a.maxSize) {
        C(a.dom, "ln-upload:invalid", {
          file: o,
          reason: "max-size"
        });
        continue;
      }
      W(a.dom, "ln-upload:before-upload", { file: o }).defaultPrevented || a._uploadSingleFile(o);
    }
  }, f.prototype._uploadSingleFile = function(n) {
    const a = this, e = "file-" + ++a.fileIdCounter, t = _getExtension(n.name);
    let o = null;
    if (this.list) {
      const S = ft(this.dom, "ln-upload-item", "ln-upload");
      if (S && (o = S.firstElementChild, o)) {
        o.setAttribute("data-ln-upload-item", ""), o.setAttribute("data-ln-upload-local-id", e), o.setAttribute("data-ln-upload-ext", t), o.setAttribute("data-ln-upload-state", "uploading"), nt(o, {
          name: n.name,
          sizeText: "0%",
          removeLabel: a.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const L = o.querySelector('[data-ln-upload-action="remove"]');
        L && (L.disabled = !0);
        const T = o.querySelector("[data-ln-progress]");
        T && T.setAttribute("data-ln-progress", "0"), a.list.appendChild(o);
      }
    }
    const p = new FormData();
    p.append(a.fileFieldName, n);
    const v = this.dom.querySelectorAll("input, select, textarea");
    for (let S = 0; S < v.length; S++) {
      const L = v[S];
      !L.name || L.name === a.idsFieldName || L.type === "file" || (L.type === "checkbox" || L.type === "radio") && !L.checked || p.append(L.name, L.value);
    }
    const w = new XMLHttpRequest();
    a.uploadedFiles.set(e, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: w
    }), w.upload.addEventListener("progress", function(S) {
      if (S.lengthComputable) {
        const L = Math.round(S.loaded / S.total * 100);
        if (o) {
          const T = o.querySelector("[data-ln-progress]");
          T && T.setAttribute("data-ln-progress", String(L)), nt(o, { sizeText: L + "%" });
        }
        C(a.dom, "ln-upload:progress", {
          localId: e,
          file: n,
          percent: L,
          loaded: S.loaded,
          total: S.total
        });
      }
    }), w.addEventListener("load", function() {
      const S = a.uploadedFiles.get(e);
      if (S && delete S.xhr, w.status >= 200 && w.status < 300) {
        let L;
        try {
          L = JSON.parse(w.responseText);
        } catch (x) {
          E(a.dict.error || "Error", w.status, x);
          return;
        }
        const T = L.id || L.serverId;
        if (o) {
          o.removeAttribute("data-ln-upload-state"), T && o.setAttribute("data-ln-upload-id", String(T)), nt(o, {
            sizeText: d(L.size || n.size, a.locale, a.dict),
            uploading: !1
          });
          const x = o.querySelector('[data-ln-upload-action="remove"]');
          x && (x.disabled = !1);
        }
        S && (S.serverId = T, S.size = L.size || n.size, S.name = L.name || n.name), a._syncHiddenInputs(), C(a.dom, "ln-upload:uploaded", {
          localId: e,
          serverId: T,
          name: L.name || n.name,
          size: L.size || n.size,
          response: L
        });
      } else {
        let L = "";
        try {
          L = JSON.parse(w.responseText).message || "";
        } catch {
        }
        E(L, w.status, null);
      }
    }), w.addEventListener("error", function() {
      const S = a.uploadedFiles.get(e);
      S && delete S.xhr, E("", 0, null);
    });
    function E(S, L, T) {
      if (o) {
        o.setAttribute("data-ln-upload-state", "error"), nt(o, {
          sizeText: a.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const x = o.querySelector('[data-ln-upload-action="remove"]');
        x && (x.disabled = !1);
      }
      C(a.dom, "ln-upload:error", {
        file: n,
        message: S,
        status: L,
        error: T
      });
    }
    a.uploadUrl ? (w.open("POST", a.uploadUrl), w.setRequestHeader("X-CSRF-TOKEN", g()), w.setRequestHeader("X-Requested-With", "XMLHttpRequest"), w.setRequestHeader("Accept", "application/json"), w.send(p)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, f.prototype.remove = function(n) {
    const a = this;
    let e = null, t = null;
    if (a.uploadedFiles.has(n))
      e = n, t = a.uploadedFiles.get(n);
    else
      for (const [w, E] of a.uploadedFiles)
        if (String(E.serverId) === String(n)) {
          e = w, t = E;
          break;
        }
    if (!e || !t || W(a.dom, "ln-upload:before-remove", {
      localId: e,
      serverId: t.serverId
    }).defaultPrevented) return;
    const p = a.list ? a.list.querySelector('[data-ln-upload-local-id="' + e + '"]') : null;
    if (t.xhr && typeof t.xhr.abort == "function" && t.xhr.abort(), !t.serverId) {
      p && p.remove(), a.uploadedFiles.delete(e), a._syncHiddenInputs(), C(a.dom, "ln-upload:removed", { localId: e, serverId: null });
      return;
    }
    let v = null;
    if (a.deleteUrlPattern ? v = a.deleteUrlPattern.replace("{id}", encodeURIComponent(t.serverId)) : a.uploadUrl && a.uploadUrl.includes("{id}") && (v = a.uploadUrl.replace("{id}", encodeURIComponent(t.serverId))), !v) {
      p && p.remove(), a.uploadedFiles.delete(e), a._syncHiddenInputs(), C(a.dom, "ln-upload:removed", { localId: e, serverId: t.serverId });
      return;
    }
    p && (p.setAttribute("data-ln-upload-state", "deleting"), nt(p, { deleting: !0 })), fetch(v, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": g(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(w) {
      w.ok ? (p && p.remove(), a.uploadedFiles.delete(e), a._syncHiddenInputs(), C(a.dom, "ln-upload:removed", {
        localId: e,
        serverId: t.serverId
      })) : (p && (p.removeAttribute("data-ln-upload-state"), nt(p, { deleting: !1 })), C(a.dom, "ln-upload:error", {
        file: t,
        message: "",
        status: w.status
      }));
    }).catch(function(w) {
      p && (p.removeAttribute("data-ln-upload-state"), nt(p, { deleting: !1 })), C(a.dom, "ln-upload:error", {
        file: t,
        message: "",
        status: 0,
        error: w
      });
    });
  }, f.prototype.clear = function() {
    const n = this;
    if (!W(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, e] of this.uploadedFiles)
        if (e.xhr && typeof e.xhr.abort == "function" && e.xhr.abort(), e.serverId) {
          let t = null;
          n.deleteUrlPattern ? t = n.deleteUrlPattern.replace("{id}", encodeURIComponent(e.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (t = n.uploadUrl.replace("{id}", encodeURIComponent(e.serverId))), t && fetch(t, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": g(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      n.uploadedFiles.clear(), n.list && (n.list.innerHTML = ""), n._syncHiddenInputs(), C(n.dom, "ln-upload:cleared", {});
    }
  }, f.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return n.serverId;
    }).filter(Boolean);
  }, f.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return {
        serverId: n.serverId,
        name: n.name,
        size: n.size
      };
    });
  }, f.prototype.destroy = function() {
    if (this.dom[i]) {
      for (const [, n] of this.uploadedFiles)
        n.xhr && typeof n.xhr.abort == "function" && n.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, C(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[i];
    }
  }, P(r, i, f, "ln-upload");
})();
(function() {
  const r = "lnExternalLinks";
  if (window[r] !== void 0) return;
  function i(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function _(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !i(s)) return;
    s.target = "_blank";
    const c = (s.rel || "").split(/\s+/).filter(Boolean);
    c.includes("noopener") || c.push("noopener"), c.includes("noreferrer") || c.push("noreferrer"), s.rel = c.join(" ");
    const l = document.createElement("span");
    l.className = "sr-only", l.textContent = "(opens in new tab)", s.appendChild(l), s.setAttribute("data-ln-external-link", "processed"), C(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function y(s) {
    s = s || document.body;
    for (const c of s.querySelectorAll("a, area"))
      _(c);
  }
  function u() {
    lt(function() {
      document.body.addEventListener("click", function(s) {
        const c = s.target.closest("a, area");
        c && c.getAttribute("data-ln-external-link") === "processed" && C(c, "ln-external-links:clicked", {
          link: c,
          href: c.href,
          text: c.textContent || c.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    lt(function() {
      new MutationObserver(function(c) {
        for (const l of c) {
          if (l.type === "childList") {
            for (const b of l.addedNodes)
              if (b.nodeType === 1 && (b.matches && (b.matches("a") || b.matches("area")) && _(b), b.querySelectorAll))
                for (const d of b.querySelectorAll("a, area"))
                  _(d);
          }
          if (l.type === "attributes" && l.attributeName === "href") {
            const b = l.target;
            b.matches && (b.matches("a") || b.matches("area")) && _(b);
          }
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["href"]
      });
    }, "ln-external-links");
  }
  function h() {
    u(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[r] = {
    process: y
  }, h();
})();
(function() {
  const r = "data-ln-link", i = "lnLink";
  if (window[i] !== void 0) return;
  let _ = null;
  function y() {
    _ = document.createElement("div"), _.className = "ln-link-status", document.body.appendChild(_);
  }
  function u(t) {
    _ && (_.textContent = t, _.classList.add("ln-link-status--visible"));
  }
  function m() {
    _ && _.classList.remove("ln-link-status--visible");
  }
  function h(t, o) {
    if (o.target.closest("a, button, input, select, textarea")) return;
    const p = t.querySelector("a");
    if (!p) return;
    const v = p.getAttribute("href");
    if (!v) return;
    if (o.ctrlKey || o.metaKey || o.button === 1) {
      window.open(v, "_blank");
      return;
    }
    W(t, "ln-link:navigate", { target: t, href: v, link: p }).defaultPrevented || p.click();
  }
  function s(t) {
    const o = t.querySelector("a");
    if (!o) return;
    const p = o.getAttribute("href");
    p && u(p);
  }
  function c() {
    m();
  }
  function l(t) {
    t[i + "Row"] || !t.querySelector("a") || (t[i + "Row"] = !0, t._lnLinkClick = function(p) {
      h(t, p);
    }, t._lnLinkEnter = function() {
      s(t);
    }, t.addEventListener("click", t._lnLinkClick), t.addEventListener("mouseenter", t._lnLinkEnter), t.addEventListener("mouseleave", c));
  }
  function b(t) {
    t[i + "Row"] && (t._lnLinkClick && t.removeEventListener("click", t._lnLinkClick), t._lnLinkEnter && t.removeEventListener("mouseenter", t._lnLinkEnter), t.removeEventListener("mouseleave", c), delete t._lnLinkClick, delete t._lnLinkEnter, delete t[i + "Row"]);
  }
  function d(t) {
    if (!t[i + "Init"]) return;
    const o = t.tagName;
    if (o === "TABLE" || o === "TBODY") {
      const p = o === "TABLE" && t.querySelector("tbody") || t;
      for (const v of p.querySelectorAll("tr"))
        b(v);
    } else
      b(t);
    delete t[i + "Init"];
  }
  function g(t) {
    if (t[i + "Init"]) return;
    t[i + "Init"] = !0;
    const o = t.tagName;
    if (o === "TABLE" || o === "TBODY") {
      const p = o === "TABLE" && t.querySelector("tbody") || t;
      for (const v of p.querySelectorAll("tr"))
        l(v);
    } else
      l(t);
  }
  function f(t) {
    t.hasAttribute && t.hasAttribute(r) && g(t);
    const o = t.querySelectorAll ? t.querySelectorAll("[" + r + "]") : [];
    for (const p of o)
      g(p);
  }
  function n() {
    lt(function() {
      new MutationObserver(function(o) {
        for (const p of o)
          if (p.type === "childList") {
            for (const v of p.addedNodes)
              if (v.nodeType === 1) {
                f(v);
                const w = v.closest("[" + r + "]");
                if (w)
                  if (v.tagName === "TR")
                    l(v);
                  else {
                    const E = w.tagName;
                    if (E === "TABLE" || E === "TBODY") {
                      const S = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const L of S)
                        l(L);
                    }
                  }
              }
          } else p.type === "attributes" && (p.target.hasAttribute && p.target.hasAttribute(r) ? f(p.target) : d(p.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [r]
      });
    }, "ln-link");
  }
  function a(t) {
    f(t);
  }
  window[i] = { init: a, destroy: d };
  function e() {
    y(), n(), a(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
const Ct = ["Ctrl", "Alt", "Shift", "Meta"], Wn = {
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
function Xe(r) {
  if (r === " ") return "Space";
  const i = String(r || "").trim();
  if (!i) return "";
  const _ = Wn[i.toLowerCase()];
  return _ || (i.length === 1 || /^f\d{1,2}$/i.test(i) ? i.toUpperCase() : i.charAt(0).toUpperCase() + i.slice(1));
}
function Je(r) {
  const i = String(r || "").replace(/\s*\+\s*/g, "+").trim();
  if (!i) return "";
  const _ = i.split("+"), y = /* @__PURE__ */ new Set();
  let u = "";
  for (let h = 0; h < _.length; h++) {
    const s = Xe(_[h]);
    if (!s) return "";
    if (Ct.indexOf(s) !== -1) {
      y.add(s);
      continue;
    }
    if (u) return "";
    u = s;
  }
  if (!u) return "";
  const m = [];
  for (let h = 0; h < Ct.length; h++)
    y.has(Ct[h]) && m.push(Ct[h]);
  return m.push(u), m.join("+");
}
function Gn(r) {
  const i = String(r || "").replace(/\s*\+\s*/g, "+").trim();
  if (!i) return [];
  const _ = i.split(/[\s,]+/), y = [];
  for (let u = 0; u < _.length; u++) {
    const m = Je(_[u]);
    m && y.indexOf(m) === -1 && y.push(m);
  }
  return y;
}
function Qn(r, i) {
  const _ = String(i || "").trim();
  if (!_ || /[\s,]/.test(_)) return "";
  const y = String(r || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(y) ? "" : Je(y ? y + "+" + _ : _);
}
function $n(r) {
  if (!r) return "";
  const i = Xe(r.key);
  if (!i || Ct.indexOf(i) !== -1) return "";
  const _ = [];
  return r.ctrlKey && _.push("Ctrl"), r.altKey && _.push("Alt"), r.shiftKey && _.push("Shift"), r.metaKey && _.push("Meta"), _.push(i), _.join("+");
}
function Yn(r) {
  if (!r || !r.tagName) return null;
  const i = String(r.tagName).toLowerCase();
  if (i === "button" || i === "a" && r.hasAttribute && r.hasAttribute("href")) return "click";
  if (i === "input" || i === "textarea" || i === "select" || r.isContentEditable) return "focus";
  if (r.hasAttribute && r.hasAttribute("contenteditable")) {
    const _ = r.getAttribute("contenteditable");
    if (_ === "" || String(_).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Xn(r, i, _, y) {
  if (!r || !i || _ !== "click" || r.target !== i || r.ctrlKey || r.altKey || r.shiftKey || r.metaKey) return !1;
  const u = String(i.tagName || "").toLowerCase();
  return u === "button" ? y === "Enter" || y === "Space" : u === "a" && i.hasAttribute && i.hasAttribute("href") && y === "Enter";
}
(function() {
  const r = "data-ln-key", i = "lnKey", _ = "data-ln-key-target", y = "data-ln-key-allow-input", u = "data-ln-key-modifier", m = "data-ln-key-for", h = "lnKeyFor";
  if (window[i] !== void 0) return;
  const s = /* @__PURE__ */ new Set();
  let c = null;
  function l() {
    c || (c = function(n) {
      if (n.defaultPrevented || n.isComposing || n.repeat) return;
      const a = $n(n);
      if (!a) return;
      const e = _n(n.target), t = document.querySelectorAll("[" + r + "], [" + m + "]");
      let o = null, p = !1, v = !1;
      for (let S = 0; S < t.length; S++) {
        const L = t[S], T = L[i] || L[h];
        if (!T || !T.matches(a) || e && !T.allowsInput()) continue;
        const x = T.resolveTarget(), k = Yn(x);
        if (!(!k || !bn(x, k))) {
          if (Xn(n, x, k, a)) {
            v = !0;
            continue;
          }
          o ? p = !0 : o = { host: L, target: x, action: k };
        }
      }
      if (v || !o) return;
      p && console.warn('[ln-key] Duplicate active shortcut "' + a + '"; first DOM match wins.');
      const w = {
        source: o.host,
        target: o.target,
        action: o.action,
        key: a,
        event: n
      };
      W(o.host, "ln-key:before-trigger", w).defaultPrevented || (n.preventDefault(), o.target[o.action](), C(o.host, "ln-key:trigger", w));
    }, document.addEventListener("keydown", c));
  }
  function b() {
    s.size > 0 || !c || (document.removeEventListener("keydown", c), c = null);
  }
  function d(n) {
    return this.dom = n, this.shortcuts = [], s.add(this), this.sync(), l(), this;
  }
  d.prototype.sync = function() {
    this.shortcuts = Gn(this.dom.getAttribute(r));
  }, d.prototype.matches = function(n) {
    return this.shortcuts.indexOf(n) !== -1;
  }, d.prototype.allowsInput = function() {
    return this.dom.hasAttribute(y);
  }, d.prototype.resolveTarget = function() {
    const n = this.dom.getAttribute(_);
    return n ? f(n, _) : this.dom;
  }, d.prototype.destroy = function() {
    this.dom[i] && (s.delete(this), delete this.dom[i], b(), C(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function g(n) {
    return this.dom = n, s.add(this), l(), this;
  }
  g.prototype._modifierContext = function() {
    return this.dom.closest("[" + u + "]");
  }, g.prototype.shortcut = function() {
    const n = this._modifierContext(), a = n ? n.getAttribute(u) : "";
    return Qn(a, this.dom.textContent);
  }, g.prototype.matches = function(n) {
    return this.shortcut() === n;
  }, g.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(y)) return !0;
    const n = this._modifierContext();
    return !!(n && n.hasAttribute(y));
  }, g.prototype.resolveTarget = function() {
    return f(this.dom.getAttribute(m), m);
  }, g.prototype.destroy = function() {
    this.dom[h] && (s.delete(this), delete this.dom[h], b(), C(this.dom, "ln-key:destroyed", { target: this.dom }));
  };
  function f(n, a) {
    if (!n) return null;
    try {
      const e = document.querySelector(n);
      return e || console.warn("[ln-key] Target not found for " + a + ' selector "' + n + '".'), e;
    } catch {
      return console.warn("[ln-key] Invalid " + a + ' selector "' + n + '".'), null;
    }
  }
  P(r, i, d, "ln-key", {
    extraAttributes: [_, y],
    onAttributeChange: function(n) {
      const a = n[i];
      if (a) {
        if (!n.hasAttribute(r)) {
          a.destroy();
          return;
        }
        a.sync();
      }
    }
  }), P(m, h, g, "ln-key-for", {
    onAttributeChange: function(n) {
      const a = n[h];
      a && !n.hasAttribute(m) && a.destroy();
    }
  });
})();
(function() {
  const r = "[data-ln-progress]", i = "lnProgress";
  if (window[i] !== void 0) return;
  function _(m) {
    return this.dom = m, this._parentObserver = null, u.call(this), y.call(this), this;
  }
  _.prototype.destroy = function() {
    this.dom[i] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[i]);
  };
  function y() {
    const m = this, h = this.dom.parentElement;
    if (!h) return;
    const s = new MutationObserver(function(c) {
      for (const l of c)
        l.attributeName === "data-ln-progress-max" && u.call(m);
    });
    s.observe(h, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = s;
  }
  function u() {
    const m = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, h = this.dom.parentElement, c = (h && h.hasAttribute("data-ln-progress-max") ? parseFloat(h.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let l = c > 0 ? m / c * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100), this.dom.style.width = l + "%";
    const b = Math.max(0, Math.min(m, c));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(c)), this.dom.setAttribute("aria-valuenow", String(b)), C(this.dom, "ln-progress:change", { target: this.dom, value: m, max: c, percentage: l });
  }
  P(
    r,
    i,
    _,
    "ln-progress",
    {
      extraAttributes: ["data-ln-progress-max"],
      onAttributeChange: function(m) {
        const h = m[i];
        h && u.call(h);
      }
    }
  );
})();
function te(r) {
  return String(r || "").trim().toLowerCase();
}
function Ze(r) {
  const i = te(r);
  return i ? i.split(/\s+/).filter(Boolean) : [];
}
function Jn(r) {
  if (r == null) return null;
  const i = String(r).split(",").map((_) => _.trim()).filter(Boolean);
  return i.length ? i : null;
}
function tn(r, i) {
  if (!i || i.length === 0) return !0;
  if (!r) return !1;
  const _ = String(r).toLowerCase();
  for (let y = 0; y < i.length; y++)
    if (_.indexOf(i[y]) === -1) return !1;
  return !0;
}
function Zn(r) {
  return !r || r.length === 0 ? "" : r.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function ae(r, i) {
  if (!i || i.length === 0) return !0;
  if (r == null) return !1;
  const _ = String(r).trim().toLowerCase();
  for (let y = 0; y < i.length; y++)
    if (String(i[y]).trim().toLowerCase() === _)
      return !0;
  return !1;
}
function ti(r, i) {
  if (!Array.isArray(r) || !Array.isArray(i)) return r !== i;
  if (r.length !== i.length) return !0;
  for (let _ = 0; _ < r.length; _++)
    if (r[_] !== i[_]) return !0;
  return !1;
}
function ei(r, i) {
  if (!i || typeof i != "object") return !0;
  const _ = Object.keys(i);
  if (_.length === 0) return !0;
  for (let y = 0; y < _.length; y++) {
    const u = i[_[y]], m = r[u.col] || "";
    if (!ae(m, u.values))
      return !1;
  }
  return !0;
}
function ni(r) {
  if (!Array.isArray(r)) return { key: null, values: [] };
  let i = null;
  const _ = [];
  for (let y = 0; y < r.length; y++) {
    const u = r[y];
    !i && u.key && (i = u.key), u.checked && !u.isReset && u.value && _.push(u.value);
  }
  return { key: i, values: _ };
}
(function() {
  const r = "data-ln-filter", i = "lnFilter", _ = "data-ln-filter-key", y = "data-ln-filter-value", u = "data-ln-filter-hide", m = "data-ln-filter-reset", h = "data-ln-filter-col", s = "data-ln-hash", c = /* @__PURE__ */ new WeakMap();
  if (window[i] !== void 0) return;
  function l(n) {
    return n.hasAttribute(m) || !n.getAttribute(y);
  }
  function b(n) {
    const a = n.dom.querySelectorAll("[" + _ + "]"), e = [];
    for (let o = 0; o < a.length; o++) {
      const p = a[o];
      e.push({
        key: p.getAttribute(_),
        value: p.getAttribute(y) || "",
        checked: p.checked,
        isReset: l(p)
      });
    }
    const t = ni(e);
    return { key: t.key, values: t.values, targetId: n.targetId };
  }
  function d(n, a, e) {
    const t = n.querySelectorAll("[" + _ + "]"), o = Array.isArray(e) && e.length > 0;
    for (let p = 0; p < t.length; p++) {
      const v = t[p];
      l(v) ? v.checked = !o : o && v.getAttribute(_) === a && e.indexOf(v.getAttribute(y)) !== -1 ? v.checked = !0 : v.checked = !1;
    }
  }
  function g(n) {
    this.dom = n, this.targetId = n.getAttribute(r);
    const a = n.getAttribute(h);
    this.colIndex = a !== null ? parseInt(a, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = _t(n, "filter"), this.hashEnabled = !!this.nsKey;
    const e = this, t = re(function() {
      e._render();
    });
    this._queueRender = t, this._attachHandlers(), this._onHashChange = function() {
      if (e._destroyed || !e.hashEnabled) return;
      const p = Y(e.nsKey), v = Qt(p);
      v && v.key && v.values.length > 0 ? d(e.dom, v.key, v.values) : d(e.dom, null, []), e._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let o = !1;
    if (this.hashEnabled) {
      const p = Y(this.nsKey), v = Qt(p);
      v && v.key && v.values.length > 0 && (d(n, v.key, v.values), it(function() {
        e._destroyed || e._render();
      }), o = !0);
    }
    if (!o && n.hasAttribute("data-ln-persist")) {
      const p = Ht("filter", n);
      p && p.key && Array.isArray(p.values) && p.values.length > 0 && (d(n, p.key, p.values), it(function() {
        e._destroyed || e._render();
      }), o = !0);
    }
    if (!o) {
      const p = n.querySelectorAll("[" + _ + "]");
      for (let v = 0; v < p.length; v++)
        if (p[v].checked && !l(p[v])) {
          it(function() {
            e._destroyed || e._render();
          });
          break;
        }
    }
    return this;
  }
  g.prototype._attachHandlers = function() {
    const n = this;
    this._onDomChange = function(a) {
      const e = a.target;
      if (!e || !e.hasAttribute || !e.hasAttribute(_)) return;
      const t = Array.from(n.dom.querySelectorAll("[" + _ + "]"));
      if (l(e)) {
        for (let o = 0; o < t.length; o++)
          l(t[o]) || (t[o].checked = !1);
        e.checked = !0, n._queueRender();
        return;
      }
      if (e.checked) {
        for (let p = 0; p < t.length; p++)
          l(t[p]) && (t[p].checked = !1);
        let o = !1;
        for (let p = 0; p < t.length; p++)
          if (l(t[p])) {
            o = !0;
            break;
          }
        if (o) {
          let p = !0;
          for (let v = 0; v < t.length; v++)
            if (!l(t[v]) && !t[v].checked) {
              p = !1;
              break;
            }
          if (p)
            for (let v = 0; v < t.length; v++)
              l(t[v]) ? t[v].checked = !0 : t[v].checked = !1;
        }
      } else {
        let o = !1;
        for (let p = 0; p < t.length; p++)
          if (!l(t[p]) && t[p].checked) {
            o = !0;
            break;
          }
        if (!o)
          for (let p = 0; p < t.length; p++)
            l(t[p]) && (t[p].checked = !0);
      }
      n._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, g.prototype._render = function() {
    const n = this, a = b(this), e = this._lastSnapshot;
    if (!(!e || e.key !== a.key || ti(e.values, a.values))) return;
    const o = a.key === null || a.values.length === 0, p = document.getElementById(n.targetId), v = {
      key: a.key,
      values: a.values.slice(),
      targetId: n.targetId
    };
    C(n.dom, "ln-filter:change", v);
    let w = !1;
    p && p !== n.dom && W(p, "ln-filter:change", v).defaultPrevented && (w = !0);
    const E = e && e.values.length > 0, S = a.values.length === 0;
    if (E && S) {
      const L = { targetId: n.targetId };
      C(n.dom, "ln-filter:reset", L), p && p !== n.dom && C(p, "ln-filter:reset", L);
    }
    if (this._lastSnapshot = { key: a.key, values: a.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (a.key && a.values.length > 0 ? gt("filter", this.dom, { key: a.key, values: a.values.slice() }) : gt("filter", this.dom, null)), this.hashEnabled) {
      const L = Ue(a.key, a.values);
      Z(this.nsKey, L);
    }
    if (!w)
      if (n.colIndex !== null)
        n._filterTableRows(a);
      else {
        if (!p) return;
        const L = p.children;
        for (let T = 0; T < L.length; T++) {
          const x = L[T];
          if (x.removeAttribute(u), o) continue;
          const k = x.getAttribute("data-" + a.key);
          k !== null && (ae(k, a.values) || x.setAttribute(u, "true"));
        }
      }
  }, g.prototype._filterTableRows = function(n) {
    const a = document.getElementById(this.targetId);
    if (!a) return;
    const e = a.tagName === "TABLE" ? a : a.querySelector("table");
    if (!e) return;
    const t = n.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, o = n.values;
    c.has(e) || c.set(e, {});
    const p = c.get(e);
    t && o.length > 0 ? p[t] = { col: this.colIndex, values: o.slice() } : t && delete p[t];
    const v = e.tBodies;
    for (let w = 0; w < v.length; w++) {
      const E = v[w].rows;
      for (let S = 0; S < E.length; S++) {
        const L = E[S], T = {};
        for (let x = 0; x < L.cells.length; x++)
          T[x] = L.cells[x].textContent.trim();
        ei(T, p) ? L.removeAttribute(u) : L.setAttribute(u, "true");
      }
    }
  }, g.prototype.destroy = function() {
    if (this.dom[i]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const n = document.getElementById(this.targetId);
        if (n) {
          const a = n.tagName === "TABLE" ? n : n.querySelector("table");
          if (a && c.has(a)) {
            const e = c.get(a), t = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            t && e[t] && delete e[t], Object.keys(e).length === 0 && c.delete(a);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[i];
    }
  };
  function f(n, a) {
    const e = n[i];
    !e || e._destroyed || a === s && (e.hashEnabled && e._onHashChange && window.removeEventListener("hashchange", e._onHashChange), e.nsKey = _t(n, "filter"), e.hashEnabled = !!e.nsKey, e.hashEnabled && window.addEventListener("hashchange", e._onHashChange));
  }
  P(r, i, g, "ln-filter", {
    extraAttributes: [s],
    onAttributeChange: f
  });
})();
(function() {
  const r = "data-ln-search", i = "lnSearch", _ = "data-ln-search-for", y = "lnSearchControl", u = "data-ln-search-items", m = "data-ln-search-fields", h = "data-ln-search-exclude", s = "data-ln-search-hide", c = "data-ln-hash";
  if (window[i] !== void 0) return;
  function l(o) {
    const p = _t(o, "search");
    if (p) return p;
    if (o.id) {
      const v = document.querySelector("[" + _ + '="' + o.id + '"]');
      if (v) {
        const w = _t(v, "search");
        if (w) return w;
      }
    }
    return null;
  }
  function b(o) {
    return o.matches("input, textarea") ? o : o.querySelector("input, textarea");
  }
  function d(o, p) {
    const v = o.childNodes;
    for (let w = 0; w < v.length; w++) {
      const E = v[w];
      if (E.nodeType === 3) {
        p.push(E.nodeValue);
        continue;
      }
      E.nodeType === 1 && (E.hasAttribute(h) || d(E, p));
    }
  }
  function g(o) {
    if (o._lnSearchText !== void 0) return o._lnSearchText;
    const p = [];
    d(o, p);
    const v = Zn(p);
    return o._lnSearchText = v, v;
  }
  function f(o, p) {
    if (!o.id) return;
    const v = document.querySelectorAll("[" + _ + '="' + o.id + '"]');
    for (const w of v) {
      const E = b(w);
      E && E.value !== p && (E.value = p);
    }
  }
  function n(o) {
    this.dom = o, this.term = o.getAttribute(r) || "", this._destroyed = !1;
    const p = this;
    return this.nsKey = l(o), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (p._destroyed || !p.hashEnabled) return;
      const v = Y(p.nsKey), w = p.dom.getAttribute(r) || "";
      v !== null && v !== w ? p.dom.setAttribute(r, v) : v === null && w !== "" && p.dom.setAttribute(r, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), it(function() {
      if (!p._destroyed) {
        if (p.hashEnabled) {
          const v = Y(p.nsKey);
          if (v !== null && v !== p.term) {
            p.term = v, p.dom.setAttribute(r, v), f(p.dom, v), p._apply();
            return;
          }
        }
        te(p.term) && (f(p.dom, p.term), p._apply());
      }
    }), this;
  }
  n.prototype._apply = function() {
    const o = this.dom, p = te(this.term), v = Ze(p);
    this.hashEnabled && Z(this.nsKey, this.term ? this.term : null);
    const w = Jn(o.getAttribute(m));
    if (W(o, "ln-search:change", {
      term: p,
      tokens: v,
      targetId: o.id,
      fields: w
    }).defaultPrevented) return;
    const S = o.getAttribute(u), L = S ? o.querySelectorAll(S) : o.children;
    for (let T = 0; T < L.length; T++) {
      const x = L[T];
      if (x.removeAttribute(s), x.hasAttribute(h) || v.length === 0) continue;
      const k = g(x);
      tn(k, v) || x.setAttribute(s, "true");
    }
  }, n.prototype.destroy = function() {
    this.dom[i] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[i]);
  };
  function a(o) {
    if (this.dom = o, this.targetId = o.getAttribute(_), this.input = b(o), this._attachHandler(), this.input && this.input.value.trim()) {
      const p = this;
      it(function() {
        const v = document.getElementById(p.targetId);
        v && ((v.getAttribute(r) || "").trim() || p._write(p.input.value));
      });
    }
    return this;
  }
  a.prototype._write = function(o) {
    const p = document.getElementById(this.targetId);
    p && p.getAttribute(r) !== o && p.setAttribute(r, o);
  }, a.prototype._attachHandler = function() {
    if (!this.input) return;
    const o = this;
    this._onInput = function() {
      o._write(o.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, a.prototype.destroy = function() {
    this.dom[y] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[y]);
  };
  function e(o) {
    const p = o.getAttribute("data-ln-search-clear-for");
    if (p) {
      const L = document.getElementById(p), T = document.querySelector("[" + _ + '="' + p + '"]'), x = T ? b(T) : null;
      return { target: L, input: x };
    }
    const v = o.closest("[" + r + "]");
    if (v) {
      const L = v.id ? document.querySelector("[" + _ + '="' + v.id + '"]') : null, T = L ? b(L) : null;
      return { target: v, input: T };
    }
    const w = o.closest("[data-ln-table-source], [data-ln-list-source]");
    if (w) {
      const L = w.getAttribute("data-ln-table-source") || w.getAttribute("data-ln-list-source"), T = L ? document.getElementById(L) : null;
      if (T && T.hasAttribute(r)) {
        const x = document.querySelector("[" + _ + '="' + L + '"]'), k = x ? b(x) : null;
        return { target: T, input: k };
      }
    }
    const E = o.closest("[" + _ + "]");
    if (E) {
      const L = E.getAttribute(_), T = L ? document.getElementById(L) : null, x = b(E);
      return { target: T, input: x };
    }
    const S = o.parentElement;
    if (S) {
      const L = S.querySelector("[" + _ + "]");
      if (L) {
        const T = L.getAttribute(_), x = T ? document.getElementById(T) : null, k = b(L);
        return { target: x, input: k };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(o) {
    const p = o.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!p) return;
    const v = e(p);
    !v.target && !v.input || (o.preventDefault(), v.input && (v.input.value = "", v.input.focus()), v.target && v.target.setAttribute(r, ""));
  });
  function t(o, p) {
    const v = o[i];
    if (!v || v._destroyed) return;
    if (p === c) {
      v._onHashChange && window.removeEventListener("hashchange", v._onHashChange), v.nsKey = l(o), v.hashEnabled = !!v.nsKey, v.hashEnabled && window.addEventListener("hashchange", v._onHashChange);
      return;
    }
    const w = o.getAttribute(r) || "";
    w !== v.term && (v.term = w, f(o, w), v._apply());
  }
  P(r, i, n, "ln-search", {
    extraAttributes: [c],
    onAttributeChange: t,
    onSubtreeChange: function(o, p) {
      const v = p.target;
      v && v._lnSearchText !== void 0 && delete v._lnSearchText, v && v.parentElement && v.parentElement._lnSearchText !== void 0 && delete v.parentElement._lnSearchText;
    }
  }), P(_, y, a, "ln-search-control");
})();
function ut(r) {
  const i = String(r || "").trim().toLowerCase();
  return i === "asc" || i === "ascending" ? "asc" : i === "desc" || i === "descending" ? "desc" : "none";
}
function ii(r) {
  const i = ut(r);
  return i === "asc" ? "ascending" : i === "desc" ? "descending" : "none";
}
function ri(r, i) {
  return !r || !i ? !1 : r.field !== null && r.field !== void 0 && i.field !== null && i.field !== void 0 ? r.field === i.field : r.column !== null && r.column !== void 0 && i.column !== null && i.column !== void 0 ? String(r.column) === String(i.column) : !1;
}
function oi(r, i, _, y) {
  const u = ut(r);
  if (u === "none") return () => 0;
  const m = u === "desc" ? -1 : 1, h = typeof y == "function" ? y : (s) => s;
  return function(s, c) {
    const l = h(s), b = h(c);
    return ne(l, b, i, _) * m;
  };
}
(function() {
  const r = "data-ln-sort", i = "lnSort", _ = "data-ln-sort-field", y = "data-ln-sort-state", u = "data-ln-sort-dir", m = "data-ln-sort-items", h = "data-ln-hash";
  if (window[i] !== void 0) return;
  const s = /* @__PURE__ */ new WeakMap();
  function c(d, g) {
    if (g) {
      const f = d.querySelector('[data-ln-field="' + g + '"]');
      if (f) return wt(f);
    }
    return wt(d);
  }
  function l(d) {
    this.dom = d, this.targetId = d.getAttribute(r), this.field = d.getAttribute(_) || null;
    const g = d.closest("th");
    this.column = !this.field && g ? g.cellIndex : null, this.itemsSelector = d.getAttribute(m) || null, this._state = ut(d.getAttribute(y)), this._destroyed = !1, this.nsKey = _t(d, "sort"), this.hashEnabled = !!this.nsKey;
    const f = this;
    this._onClick = function(a) {
      const e = a.target.closest("[" + u + "]");
      if (!e) return;
      const t = ut(e.getAttribute(u));
      f._apply(t);
    }, d.addEventListener("click", this._onClick), this._onSortChange = function(a) {
      if (f._destroyed || !a.detail) return;
      const e = f._resolveTarget();
      if (!(e && (a.target === e || e.contains(a.target)) || a.detail.targetId && a.detail.targetId === f.targetId)) return;
      if (ri(
        { field: f.field, column: f.column },
        { field: a.detail.field, column: a.detail.column }
      )) {
        const p = ut(a.detail.direction);
        p && d.getAttribute(y) !== p && (f._state = p, d.setAttribute(y, p), f._updateAriaSort(p));
        return;
      }
      d.getAttribute(y) !== "none" && (f._state = "none", d.setAttribute(y, "none"), f._updateAriaSort("none")), d.hasAttribute("data-ln-persist") && gt("sort", d, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (f._destroyed || !f.hashEnabled) return;
      const a = Y(f.nsKey), e = Gt(a);
      if (e)
        f.field !== null && e.fieldOrColumn === f.field || f.column !== null && String(f.column) === e.fieldOrColumn ? f._state !== e.direction && f._apply(e.direction, !0) : f._state !== "none" && (f._state = "none", d.setAttribute(y, "none"), f._updateAriaSort("none"));
      else if (f._state !== "none") {
        f._state = "none", d.setAttribute(y, "none"), f._updateAriaSort("none");
        const t = f._resolveTarget();
        t && (W(t, "ln-sort:change", {
          field: f.field,
          column: f.column,
          direction: "none",
          targetId: f.targetId
        }).defaultPrevented || f._defaultSort(t, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let n = !1;
    if (this.hashEnabled) {
      const a = Y(this.nsKey), e = Gt(a);
      e && ((f.field !== null && e.fieldOrColumn === f.field || f.column !== null && String(f.column) === e.fieldOrColumn) && it(function() {
        f._destroyed || f._apply(e.direction, !0);
      }), n = !0);
    }
    if (!n && d.hasAttribute("data-ln-persist")) {
      const a = Ht("sort", d);
      a && a.direction && a.direction !== "none" && it(function() {
        f._destroyed || f._apply(a.direction, !0);
      }), n = !0;
    }
    if (!n) {
      const a = ut(d.getAttribute(y));
      a && a !== "none" && it(function() {
        f._destroyed || f._apply(a, !0);
      });
    }
    return this;
  }
  l.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, l.prototype._updateAriaSort = function(d) {
    const g = this.dom.closest("th");
    g && g.setAttribute("aria-sort", ii(d));
  }, l.prototype._apply = function(d, g) {
    if (this._destroyed) return;
    const f = ut(d);
    this._state = f, this.dom.getAttribute(y) !== f && this.dom.setAttribute(y, f), this._updateAriaSort(f);
    const n = this._resolveTarget();
    if (!n) return;
    const a = {
      field: this.field,
      column: this.column,
      direction: f,
      targetId: this.targetId
    };
    if (!g && (this.dom.hasAttribute("data-ln-persist") && gt("sort", this.dom, f === "none" ? null : a), this.hashEnabled)) {
      const t = Be(this.field !== null ? this.field : this.column, f);
      Z(this.nsKey, t);
    }
    W(n, "ln-sort:change", a).defaultPrevented || this._defaultSort(n, f);
  }, l.prototype._defaultSort = function(d, g) {
    const f = this.itemsSelector ? Array.from(d.querySelectorAll(this.itemsSelector)) : Array.from(d.children);
    if (!f.length) return;
    const n = f[0].parentNode;
    s.has(d) || s.set(d, f.slice());
    let a;
    if (g === "none")
      a = (s.get(d) || f).filter(function(o) {
        return o.parentNode === n;
      });
    else {
      const t = this.field, o = f.map(function(E) {
        return c(E, t);
      }), p = ee(o), v = typeof Intl < "u" ? new Intl.Collator(G(this.dom), { sensitivity: "base" }) : null, w = oi(g, p, v, function(E) {
        return c(E, t);
      });
      a = f.slice().sort(w);
    }
    const e = document.createDocumentFragment();
    for (let t = 0; t < a.length; t++) e.appendChild(a[t]);
    n.appendChild(e);
  }, l.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[i]);
  };
  function b(d, g) {
    const f = d[i];
    if (!(!f || f._destroyed))
      if (g === _) {
        f.field = d.getAttribute(_) || null;
        const n = d.closest("th");
        f.column = !f.field && n ? n.cellIndex : null;
      } else if (g === m)
        f.itemsSelector = d.getAttribute(m) || null;
      else if (g === y) {
        const n = ut(d.getAttribute(y));
        n !== f._state && f._apply(n);
      } else g === r ? f.targetId = d.getAttribute(r) : g === h && (f.hashEnabled && f._onHashChange && window.removeEventListener("hashchange", f._onHashChange), f.nsKey = _t(d, "sort"), f.hashEnabled = !!f.nsKey, f.hashEnabled && window.addEventListener("hashchange", f._onHashChange));
  }
  P(r, i, l, "ln-sort", {
    extraAttributes: [_, m, y, h],
    onAttributeChange: b
  });
})();
function ye(r, i, _, y, u = 15) {
  if (y <= 0 || _ <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const m = Math.max(0, r || 0), h = Math.max(0, i || 0), s = Math.floor(m / _), c = Math.ceil(h / _), l = Math.max(0, s - u), b = Math.min(y, s + c + u), d = l * _, g = Math.max(0, (y - b) * _);
  return { start: l, end: b, topPadding: d, bottomPadding: g };
}
function si(r, i) {
  const _ = Array.isArray(r) ? r.length : 0, y = i instanceof Set ? i : new Set(i || []);
  let u = 0;
  if (Array.isArray(r))
    for (let s = 0; s < r.length; s++)
      y.has(r[s]) && u++;
  else
    u = y.size;
  const m = _ > 0 && u === _, h = u > 0 && u < _;
  return { totalCount: _, selectedCount: u, isAllSelected: m, isIndeterminate: h };
}
function ve(r, i, _) {
  const y = new Set(r);
  return i == null || ((_ !== void 0 ? _ : !y.has(i)) ? y.add(i) : y.delete(i)), y;
}
function we(r, i, _) {
  const y = new Set(r);
  if (!Array.isArray(i)) return y;
  if (_)
    for (let u = 0; u < i.length; u++)
      i[u] != null && y.add(i[u]);
  else
    for (let u = 0; u < i.length; u++)
      y.delete(i[u]);
  return y;
}
(function() {
  const r = "data-ln-table", i = "lnTable", _ = "data-ln-table-empty";
  if (window[i] !== void 0) return;
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function c(d, g) {
    if (d == null || isNaN(d)) return "";
    try {
      return new Intl.NumberFormat(G(g)).format(d);
    } catch {
      return String(d);
    }
  }
  function l(d) {
    let g = d.parentElement;
    for (; g && g !== document.body && g !== document.documentElement; ) {
      const n = getComputedStyle(g).overflowY;
      if (n === "auto" || n === "scroll") return g;
      g = g.parentElement;
    }
    return null;
  }
  function b(d) {
    this.dom = d, this.table = d.querySelector("table"), this.tbody = d.querySelector("[data-ln-table-body]") || d.querySelector("tbody"), this.thead = d.querySelector("thead");
    const g = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = g ? Array.from(g.querySelectorAll("th")) : [], this._totalSpan = d.querySelector("[data-ln-table-total]"), this._filteredSpan = d.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== d ? this._filteredSpan.parentElement : null), this._selectedSpan = d.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== d ? this._selectedSpan.parentElement : null), this.isDataDriven = d.hasAttribute("data-ln-table-source"), this.name = d.getAttribute(r) || "", this.source = d.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const f = this;
    return this._onSetSearch = function(n) {
      const a = (n.detail && n.detail.query != null ? n.detail.query : n.detail && n.detail.term != null ? n.detail.term : "").trim();
      f.isDataDriven ? (f.currentSearch = a, C(d, "ln-table:search", {
        table: f.name,
        query: f.currentSearch
      }), f._requestData()) : (f._searchTerm = a.toLowerCase(), f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), C(d, "ln-table:filter", {
        term: f._searchTerm,
        matched: f._filteredData.length,
        total: f._data.length
      }));
    }, d.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(n) {
      n.preventDefault(), f._onSetSearch(n);
    }, d.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      f.isDataDriven ? (f.currentFilters = {}, f.currentSearch = "", C(d, "ln-table:clear-filters", { table: f.name }), f._requestData()) : (f._searchTerm = "", f._columnFilters = {}, f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), C(d, "ln-table:filter", {
        term: "",
        matched: f._filteredData.length,
        total: f._data.length
      }));
    }, d.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = d.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && d.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(n) {
      const a = n.detail || {}, e = a.data || [], t = a.total != null ? a.total : e.length;
      if (!(f._hasInitialSeed && !f.isLoaded && e.length === 0 && t === 0)) {
        if (f._windowed) {
          f._cache.ingest(a) && !a.provisional && d.classList.remove("ln-table--loading");
          return;
        }
        f._data = e, f._lastTotal = t, f._lastFiltered = a.filtered != null ? a.filtered : f._data.length, f.totalCount = f._lastTotal, f.visibleCount = f._lastFiltered, f.isLoaded = !0, f._hasInitialSeed = !1, d.classList.remove("ln-table--loading"), f._vStart = -1, f._vEnd = -1, f._applyFilterAndSort(), f._render(), f._updateFooter(), C(d, "ln-table:rendered", {
          table: f.name,
          total: f.totalCount,
          visible: f.visibleCount
        });
      }
    }, d.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(n) {
      const a = n.detail && n.detail.loading;
      d.classList.toggle("ln-table--loading", !!a), a && (f.isLoaded = !1);
    }, d.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(n) {
      !f._windowed || !f._cache || f._cache.release(n.detail && n.detail.offset);
    }, d.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !f._windowed || !f._cache || f._cache.revalidate();
    }, d.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !f._windowed || !f._cache || f._requestData();
    }, d.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(n) {
      n.preventDefault(), f.currentSort = n.detail.direction === "none" ? null : { field: n.detail.field, direction: n.detail.direction }, f._requestData();
    }, d.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(n) {
      if (n.target.closest("[data-ln-table-row-select]") || n.target.closest("[data-ln-table-row-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const a = n.target.closest("[data-ln-table-row]");
      if (!a) return;
      const e = a.getAttribute("data-ln-table-row-id"), t = a._lnRecord || {};
      C(d, "ln-table:row-click", {
        table: f.name,
        id: e,
        record: t
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(n) {
      const a = n.target.closest("[data-ln-table-row-action]");
      if (!a) return;
      n.stopPropagation();
      const e = a.closest("[data-ln-table-row]");
      if (!e) return;
      const t = a.getAttribute("data-ln-table-row-action"), o = e.getAttribute("data-ln-table-row-id"), p = e._lnRecord || {};
      C(d, "ln-table:row-action", {
        table: f.name,
        id: o,
        action: t,
        record: p
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : C(d, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      f.tbody.rows.length > 0 && (f._emptyTbodyObserver.disconnect(), f._emptyTbodyObserver = null, f._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(n) {
      n.preventDefault();
      const a = n.detail.direction === "none" ? null : n.detail.direction;
      f._sortCol = a === null ? -1 : n.detail.column, f._sortDir = a, f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), C(d, "ln-table:sorted", {
        column: n.detail.column,
        direction: n.detail.direction,
        matched: f._filteredData.length,
        total: f._data.length
      });
    }, d.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(n) {
      if (n.preventDefault(), !n.detail) return;
      const a = n.detail.key, e = n.detail.values || [];
      if (a) {
        if (e.length === 0)
          delete f._columnFilters[a];
        else {
          const t = [];
          for (let o = 0; o < e.length; o++)
            t.push(e[o].toLowerCase());
          f._columnFilters[a] = t;
        }
        f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), C(d, "ln-table:filter", {
          term: f._searchTerm,
          matched: f._filteredData.length,
          total: f._data.length
        });
      }
    }, d.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  b.prototype._parseRows = function() {
    const d = this.tbody.rows, g = this.ths;
    this._data = [], d.length > 0 && (this._rowHeight = d[0].offsetHeight || 40), this._lockColumnWidths();
    for (let f = 0; f < d.length; f++) {
      const n = d[f], a = [], e = [], t = [];
      for (let p = 0; p < n.cells.length; p++) {
        const v = n.cells[p], w = v.textContent.trim();
        a[p] = wt(v), e[p] = w.toLowerCase(), v.querySelector("[data-ln-table-row-action]") || t.push(w.toLowerCase());
      }
      let o = null;
      if (this.isDataDriven) {
        o = {};
        const p = n.getAttribute("data-ln-table-row-id");
        p != null && (o.id = p);
        for (let v = 0; v < g.length; v++) {
          const w = g[v].getAttribute("data-ln-table-col");
          if (w) {
            const E = v;
            if (E < n.cells.length) {
              const S = n.cells[E];
              o[w] = wt(S);
            }
          }
        }
      }
      this._data.push({
        values: a,
        rawTexts: e,
        html: n.outerHTML,
        searchText: t.join(" "),
        id: this.isDataDriven && o ? o.id : void 0,
        ...o
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), C(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, b.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, b.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const d = document.createElement("colgroup");
    this.ths.forEach(function(g) {
      const f = document.createElement("col");
      f.style.width = g.offsetWidth + "px", d.appendChild(f);
    }), this.table.insertBefore(d, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = d;
  }, b.prototype._render = function() {
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
  }, b.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const d = this._filteredData, g = document.createDocumentFragment();
      for (let f = 0; f < d.length; f++) {
        const n = this._buildRow(d[f]);
        if (!n) break;
        g.appendChild(n);
      }
      this.tbody.replaceChildren(g), this._selectable && this._updateSelectAll();
    } else {
      const d = [], g = this._filteredData;
      for (let f = 0; f < g.length; f++) d.push(g[f].html);
      this.tbody.innerHTML = d.join(""), this._selectable && this._restoreSelection();
    }
  }, b.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const d = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let f = null;
        if (this._windowed) {
          const n = this._cache ? this._cache.peek() : null;
          f = n ? this._buildRow(n) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (f = this._buildRow(this._data[0]));
        f && this.tbody && (this.tbody.appendChild(f), this._rowHeight = f.offsetHeight || 40, f.remove());
      }
    this.isDataDriven ? this._scrollContainer = l(this.dom) : this._scrollContainer = null;
    const g = this._scrollContainer || window;
    this._scrollHandler = function() {
      d._rafId || (d._rafId = requestAnimationFrame(function() {
        d._rafId = null, d._windowed ? d._renderWindowed() : d._renderVirtual();
      }));
    }, g.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, b.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, b.prototype._renderVirtual = function() {
    const d = this._filteredData, g = d.length, f = this._rowHeight;
    if (!f || !g) return;
    const n = this.thead ? this.thead.offsetHeight : 0, a = this._scrollContainer;
    let e, t;
    if (a) {
      const L = this.table.getBoundingClientRect(), T = a.getBoundingClientRect(), x = L.top - T.top + a.scrollTop + n;
      e = a.scrollTop - x, t = a.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + n;
      e = window.scrollY - x, t = window.innerHeight;
    }
    const o = ye(e, t, f, g, 15), p = o.start, v = o.end;
    if (p === this._vStart && v === this._vEnd) return;
    this._vStart = p, this._vEnd = v;
    const w = this.ths.length || 1, E = o.topPadding, S = o.bottomPadding;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (E > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", w), x.style.height = E + "px", T.appendChild(x), L.appendChild(T);
      }
      for (let T = p; T < v; T++) {
        const x = this._buildRow(d[T]);
        x && L.appendChild(x);
      }
      if (S > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", w), x.style.height = S + "px", T.appendChild(x), L.appendChild(T);
      }
      this.tbody.replaceChildren(L), this._selectable && this._updateSelectAll();
    } else {
      let L = "";
      E > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>');
      for (let T = p; T < v; T++) L += d[T].html;
      S > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L, this._selectable && this._restoreSelection();
    }
  }, b.prototype._buildPlaceholderRow = function() {
    const d = document.createElement("tr");
    d.className = "ln-table__placeholder", d.setAttribute("aria-hidden", "true");
    const g = document.createElement("td");
    return g.setAttribute("colspan", this.ths.length || 1), g.style.height = this._rowHeight + "px", d.appendChild(g), d;
  }, b.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const d = this._rowHeight;
    if (!d) return;
    const g = this._cache.logicalTotal, f = this.thead ? this.thead.offsetHeight : 0, n = this._scrollContainer;
    let a, e;
    if (n) {
      const L = this.table.getBoundingClientRect(), T = n.getBoundingClientRect(), x = L.top - T.top + n.scrollTop + f;
      a = n.scrollTop - x, e = n.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + f;
      a = window.scrollY - x, e = window.innerHeight;
    }
    const t = ye(a, e, d, g, 15), o = t.start, p = t.end, v = this.ths.length || 1, w = t.topPadding, E = t.bottomPadding, S = document.createDocumentFragment();
    if (w > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const T = document.createElement("td");
      T.setAttribute("colspan", v), T.style.height = w + "px", L.appendChild(T), S.appendChild(L);
    }
    for (let L = o; L < p; L++)
      if (this._cache.has(L)) {
        const T = this._buildRow(this._cache.get(L));
        T && S.appendChild(T);
      } else
        S.appendChild(this._buildPlaceholderRow());
    if (E > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const T = document.createElement("td");
      T.setAttribute("colspan", v), T.style.height = E + "px", L.appendChild(T), S.appendChild(L);
    }
    this.tbody.replaceChildren(S), this._vStart = o, this._vEnd = p, this._cache.ensure(o, p);
  }, b.prototype._showEmptyState = function() {
    const d = this.ths.length || 1;
    let g = null, f = null;
    if (this.isDataDriven) {
      const n = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount === 0 && n > 0, t = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (f = ft(this.dom, t, "ln-table"), !f) {
        const o = this.dom.querySelector("template[data-ln-table-empty]");
        if (o) {
          const p = e ? "search" : "initial", v = o.content.querySelector('[data-ln-table-empty-when="' + p + '"]') || o.content.firstElementChild;
          v && (f = document.importNode(v, !0));
        }
      }
      if (f)
        if (f.tagName === "TR")
          g = f;
        else {
          const o = document.createElement("td");
          o.setAttribute("colspan", String(d)), o.appendChild(f);
          const p = document.createElement("tr");
          p.className = "ln-table__empty", p.appendChild(o), g = p;
        }
    } else {
      const n = this.dom.querySelector("template[" + _ + "]"), a = document.createElement("td");
      a.setAttribute("colspan", String(d)), n && a.appendChild(document.importNode(n.content, !0));
      const e = document.createElement("tr");
      e.className = "ln-table__empty", e.appendChild(a), g = e;
    }
    g ? this.tbody.replaceChildren(g) : this.tbody.replaceChildren(), C(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, b.prototype._fillRow = function(d, g) {
    xt(d, g);
    const f = d.querySelectorAll("[data-ln-table-cell-attr]");
    for (let n = 0; n < f.length; n++) {
      const a = f[n], e = a.getAttribute("data-ln-table-cell-attr").split(",");
      for (let t = 0; t < e.length; t++) {
        const o = e[t].trim().split(":");
        if (o.length !== 2) continue;
        const p = o[0].trim(), v = o[1].trim();
        g[p] != null && a.setAttribute(v, g[p]);
      }
    }
  }, b.prototype._buildRow = function(d) {
    let g = ft(this.dom, this.name + "-row", "ln-table");
    if (!g) {
      const n = this.dom.querySelector("template[data-ln-table-row]");
      n && (g = document.importNode(n.content, !0));
    }
    let f = g ? g.querySelector("[data-ln-table-row]") || g.firstElementChild : null;
    if (f)
      this._fillRow(f, d);
    else if (d && d.html) {
      const n = document.createElement("tbody");
      n.innerHTML = d.html, f = n.firstElementChild;
    } else {
      f = document.createElement("tr"), f.setAttribute("data-ln-table-row", "");
      const n = this.ths;
      for (let a = 0; a < n.length; a++) {
        const e = n[a].hasAttribute("data-ln-table-col-select"), t = document.createElement("td");
        if (e) {
          const o = document.createElement("input");
          o.type = "checkbox", o.setAttribute("data-ln-table-row-select", ""), o.setAttribute("aria-label", "Select row"), t.appendChild(o);
        } else {
          const o = n[a].getAttribute("data-ln-table-col");
          o && d[o] != null && (t.textContent = String(d[o]));
        }
        f.appendChild(t);
      }
    }
    if (f._lnRecord = d, d.id != null && f.setAttribute("data-ln-table-row-id", d.id), this._selectable && d.id != null && this.selectedIds.has(String(d.id))) {
      f.classList.add("ln-row-selected");
      const n = f.querySelector("[data-ln-table-row-select]");
      n && (n.checked = !0);
    }
    return f;
  }, b.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Le(this, "ln-table:request-data", "table");
  }, b.prototype._enterWindowedMode = function() {
    const d = this, g = this.dom, f = parseInt(g.getAttribute("data-ln-table-window"), 10), n = parseInt(g.getAttribute("data-ln-table-window-page"), 10), a = parseInt(g.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !d._windowed || !d._cache || (d.totalCount = d._cache.grandTotal, d.visibleCount = d._cache.logicalTotal, d._lastTotal = d._cache.grandTotal, d.isLoaded = !0, d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), C(g, "ln-table:rendered", {
        table: d.name,
        total: d.totalCount,
        visible: d.visibleCount
      }));
    }, this._renderBatch = re(this._onCacheChange), this._cache = Fe({
      windowSize: f > 0 ? f : 1e3,
      pageSize: n > 0 ? n : 200,
      threshold: a >= 0 ? a : 25,
      fetchDebounce: 120,
      requestPage: function(e, t, o) {
        C(g, "ln-table:request-data", {
          table: d.name,
          sort: e.sort,
          filters: e.filters,
          search: e.search,
          offset: t,
          limit: o,
          queryGen: d._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, b.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let d = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(d) && this._totalSpan) {
        const f = this._totalSpan.textContent.replace(/[^\d]/g, "");
        f && (d = parseInt(f, 10));
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
  }, b.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, b.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const d = this.tbody.querySelectorAll("[data-ln-table-row]"), g = [];
    for (let n = 0; n < d.length; n++) {
      const a = d[n].getAttribute("data-ln-table-row-id");
      a != null && g.push(a);
    }
    const f = si(g, this.selectedIds);
    this._selectAllCheckbox.checked = f.isAllSelected, this._selectAllCheckbox.indeterminate = f.isIndeterminate;
  }, b.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const d = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let g = 0; g < d.length; g++) {
      const f = d[g].getAttribute("data-ln-table-row-id"), n = f != null && this.selectedIds.has(f);
      d[g].classList.toggle("ln-row-selected", n);
      const a = d[g].querySelector("[data-ln-table-row-select]");
      a && (a.checked = n);
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
    const d = this;
    if (this._onSelectionChange = function(g) {
      const f = g.target.closest("[data-ln-table-row-select]");
      if (!f) return;
      const n = f.closest("[data-ln-table-row]");
      if (!n) return;
      const a = n.getAttribute("data-ln-table-row-id");
      a != null && (d.selectedIds = ve(d.selectedIds, a, f.checked), n.classList.toggle("ln-row-selected", f.checked), d.selectedCount = d.selectedIds.size, d._updateSelectAll(), d._updateFooter(), C(d.dom, "ln-table:select", {
        table: d.name,
        selectedIds: d.selectedIds,
        count: d.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const g = document.createElement("input");
      g.type = "checkbox";
      const f = d.dom.querySelector('[data-ln-table-dict="select-all"]'), n = d.dom.getAttribute("data-ln-table-select-all-label") || (f ? f.textContent.trim() : null) || "Select all";
      g.setAttribute("aria-label", n), this._selectAllCheckbox.appendChild(g), this._selectAllCheckbox = g;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const g = d._selectAllCheckbox.checked, f = d.tbody ? d.tbody.querySelectorAll("[data-ln-table-row]") : [], n = [];
      for (let a = 0; a < f.length; a++) {
        const e = f[a].getAttribute("data-ln-table-row-id"), t = f[a].querySelector("[data-ln-table-row-select]");
        e != null && (n.push(e), f[a].classList.toggle("ln-row-selected", g), t && (t.checked = g));
      }
      d.selectedIds = we(d.selectedIds, n, g), d.selectedCount = d.selectedIds.size, C(d.dom, "ln-table:select-all", {
        table: d.name,
        selected: g
      }), C(d.dom, "ln-table:select", {
        table: d.name,
        selectedIds: d.selectedIds,
        count: d.selectedCount
      }), d._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let f = 0; f < g.length; f++) {
        const n = g[f].querySelector("[data-ln-table-row-select]"), a = g[f].getAttribute("data-ln-table-row-id");
        n && n.checked && a != null && (d.selectedIds = ve(d.selectedIds, a, !0), g[f].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, b.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const d = this.dom.querySelector("[data-ln-table-col-select]");
    if (d) {
      const g = d.querySelector('input[type="checkbox"]');
      g && g.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = we(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let f = 0; f < g.length; f++) {
        g[f].classList.remove("ln-row-selected");
        const n = g[f].querySelector("[data-ln-table-row-select]");
        n && (n.checked = !1);
      }
    }
    this._updateFooter();
  }, b.prototype._updateFooter = function() {
    let d = 0, g = 0;
    this.isDataDriven ? (d = this._lastTotal != null ? this._lastTotal : this._data.length, g = this.visibleCount) : (d = this._data.length, g = this._filteredData.length);
    const f = g < d;
    if (this._totalSpan && (this._totalSpan.textContent = c(d, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = f ? c(g, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !f), this._selectedSpan) {
      const n = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = n > 0 ? c(n, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", n === 0);
    }
  }, b.prototype.destroy = function() {
    this.dom[i] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[i]);
  }, P(r, i, b, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(d, g) {
      const f = d[i];
      if (!(!f || !f.isDataDriven)) {
        if (g === "data-ln-table-window") {
          const n = d.hasAttribute("data-ln-table-window");
          if (n && !f._windowed)
            f._enterWindowedMode(), f._kickWindowInitial();
          else if (!n && f._windowed)
            f._exitWindowedMode();
          else if (n && f._windowed) {
            const a = parseInt(d.getAttribute("data-ln-table-window"), 10);
            a > 0 && f._cache.configure({ windowSize: a });
          }
          return;
        }
        if (!(!f._windowed || !f._cache)) {
          if (g === "data-ln-table-window-page") {
            const n = parseInt(d.getAttribute("data-ln-table-window-page"), 10);
            n > 0 && f._cache.configure({ pageSize: n });
          } else if (g === "data-ln-table-window-threshold") {
            const n = parseInt(d.getAttribute("data-ln-table-window-threshold"), 10);
            n >= 0 && f._cache.configure({ threshold: n });
          } else if (g === "data-ln-table-count") {
            const n = parseInt(d.getAttribute("data-ln-table-count"), 10);
            n >= 0 && f._cache.setGrandTotal(n);
          }
        }
      }
    }
  });
})();
(function() {
  const r = "data-ln-table-coordinator", i = "lnTableCoordinator";
  if (window[i] !== void 0) return;
  document.addEventListener("keydown", function(h) {
    if (h.key !== "/" || h.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const s = document.querySelector("[" + r + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!s) return;
    const c = s.tagName === "INPUT" || s.tagName === "TEXTAREA" ? s : s.querySelector('input[type="search"], input[type="text"], input');
    c && (h.preventDefault(), c.focus());
  });
  function _(h) {
    return this.dom = h, m(this), this;
  }
  function y(h, s) {
    const c = s ? '[data-ln-search-for="' + s + '"]' : "[data-ln-search-for]", l = h.querySelector(c) || document.querySelector(c);
    return l ? l.tagName === "INPUT" || l.tagName === "TEXTAREA" ? l : l.querySelector("input, textarea") : null;
  }
  function u(h, s) {
    if (s) {
      const l = h.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (l.length > 0) return l;
      const b = document.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (b.length > 0) return b;
    }
    const c = h.querySelectorAll("[data-ln-filter]");
    return c.length > 0 ? c : document.querySelectorAll("[data-ln-filter]");
  }
  function m(h) {
    const s = h.dom;
    function c(l) {
      const b = l.target;
      if (b && b.hasAttribute && b.hasAttribute("data-ln-table")) return b;
      const d = l.detail && l.detail.targetId || b && b.id;
      return d ? s.querySelector('[data-ln-table-source="' + d + '"]') || s.querySelector('[data-ln-table="' + d + '"]') : null;
    }
    h._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(l) {
        if (!l.detail) return;
        const b = c(l);
        if (!b || !b.hasAttribute || !b.hasAttribute("data-ln-table")) return;
        const d = l.detail.key, g = l.detail.values || [], f = b.querySelectorAll("th");
        for (let n = 0; n < f.length; n++)
          if (f[n].getAttribute("data-ln-table-filter-col") === d) {
            const a = f[n].querySelector("[data-ln-table-col-filter]");
            a && a.classList.toggle("ln-filter-active", g.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(l) {
        const b = l.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!b) return;
        const d = b.closest("[data-ln-table]") || s.querySelector("[data-ln-table]");
        if (!d || !d.lnTable) return;
        const g = d.lnTable.name || d.id, f = d.querySelectorAll("th");
        for (let t = 0; t < f.length; t++) {
          const o = f[t].querySelector("[data-ln-table-col-filter]");
          o && o.classList.remove("ln-filter-active");
        }
        const n = d.getAttribute("data-ln-table-source") || d.id, a = n ? document.getElementById(n) : null;
        if (a && a.hasAttribute("data-ln-search"))
          a.setAttribute("data-ln-search", "");
        else {
          const t = y(s, n);
          t && t.value !== "" && (t.value = "", t.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const e = u(s, n);
        for (let t = 0; t < e.length; t++) {
          const o = e[t].querySelector("[data-ln-filter-reset]");
          if (!o) continue;
          const p = e[t].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!o.checked || p) && (o.checked = !0, o.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        d.hasAttribute("data-ln-table-source") || C(d, "ln-table:request-clear-filters", { table: g });
      }
    }, s.addEventListener("ln-filter:change", h._handlers.filter), s.addEventListener("click", h._handlers.clear);
  }
  _.prototype.destroy = function() {
    this.dom[i] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[i]);
  }, P(r, i, _, "ln-table-coordinator");
})();
(function() {
  const r = "data-ln-list", i = "lnList", _ = "data-ln-list-empty";
  if (window[i] !== void 0) return;
  function c(n, a) {
    if (n == null || isNaN(n)) return "";
    try {
      return new Intl.NumberFormat(G(a)).format(n);
    } catch {
      return String(n);
    }
  }
  function l(n) {
    let a = n;
    for (; a && a !== document.body && a !== document.documentElement; ) {
      const t = getComputedStyle(a).overflowY;
      if (t === "auto" || t === "scroll") return a;
      a = a.parentElement;
    }
    return null;
  }
  function b(n) {
    const a = n._scrollContainer || l(n.dom);
    return {
      container: a,
      top: a ? a.scrollTop : window.scrollY
    };
  }
  function d(n) {
    n.container ? n.container.scrollTop = n.top : window.scrollTo(window.scrollX, n.top);
  }
  function g(n) {
    if (!n) return 0;
    const a = getComputedStyle(n), e = parseFloat(a.marginTop) || 0, t = parseFloat(a.marginBottom) || 0;
    return n.offsetHeight + e + t;
  }
  function f(n) {
    this.dom = n, this.tbody = n.querySelector("[data-ln-list-body]") || n, this.isDataDriven = n.hasAttribute("data-ln-list-source"), this.name = n.getAttribute(r) || "", this.source = n.getAttribute("data-ln-list-source") || "", this._totalSpan = n.querySelector("[data-ln-list-total]"), this._filteredSpan = n.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.parentElement : null), this._selectedSpan = n.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const a = this;
    return this._onSetSearch = function(e) {
      const t = (e.detail && e.detail.query != null ? e.detail.query : e.detail && e.detail.term != null ? e.detail.term : "").trim();
      a.isDataDriven ? (a.currentSearch = t, C(n, "ln-list:search", {
        list: a.name,
        query: a.currentSearch
      }), a._requestData()) : (a._searchTerm = t.toLowerCase(), a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), C(n, "ln-list:filter", {
        term: a._searchTerm,
        matched: a._filteredData.length,
        total: a._data.length
      }));
    }, n.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(e) {
      e.preventDefault(), a._onSetSearch(e);
    }, n.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      a.isDataDriven ? (a.currentFilters = {}, a.currentSearch = "", C(n, "ln-list:clear-filters", { list: a.name }), a._requestData()) : (a._searchTerm = "", a._filters = {}, a._sortField = null, a._sortDir = null, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), C(n, "ln-list:filter", {
        term: "",
        matched: a._filteredData.length,
        total: a._data.length
      }));
    }, n.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = n.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, n.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(e) {
      const t = e.detail || {}, o = t.data || [], p = t.total != null ? t.total : o.length;
      if (!(a._hasInitialSeed && !a.isLoaded && o.length === 0 && p === 0)) {
        if (a._windowed) {
          a._cache.ingest(t) && !t.provisional && n.classList.remove("ln-list--loading");
          return;
        }
        a._data = o, a._lastTotal = p, a._lastFiltered = t.filtered != null ? t.filtered : a._data.length, a.totalCount = a._lastTotal, a.visibleCount = a._lastFiltered, a.isLoaded = !0, a._hasInitialSeed = !1, n.classList.remove("ln-list--loading"), a._vStart = -1, a._vEnd = -1, a._applyFilterAndSort(), a._render(), a._updateFooter(), C(n, "ln-list:rendered", {
          list: a.name,
          total: a.totalCount,
          visible: a.visibleCount
        });
      }
    }, n.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(e) {
      const t = e.detail && e.detail.loading;
      n.classList.toggle("ln-list--loading", !!t), t && (a.isLoaded = !1);
    }, n.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(e) {
      !a._windowed || !a._cache || a._cache.release(e.detail && e.detail.offset);
    }, n.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !a._windowed || !a._cache || a._cache.revalidate();
    }, n.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !a._windowed || !a._cache || a._requestData();
    }, n.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(e) {
      e.detail.field != null && (e.preventDefault(), a.currentSort = e.detail.direction === "none" ? null : { field: e.detail.field, direction: e.detail.direction }, a._requestData());
    }, n.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(e) {
      if (e.target.closest("[data-ln-item-select]") || e.target.closest("[data-ln-item-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const t = e.target.closest("[data-ln-item]");
      if (!t) return;
      const o = t.getAttribute("data-ln-item-id"), p = t._lnRecord || {};
      C(n, "ln-list:item-click", {
        list: a.name,
        id: o,
        record: p
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(e) {
      const t = e.target.closest("[data-ln-item-action]");
      if (!t) return;
      e.stopPropagation();
      const o = t.closest("[data-ln-item]");
      if (!o) return;
      const p = t.getAttribute("data-ln-item-action"), v = o.getAttribute("data-ln-item-id"), w = o._lnRecord || {};
      C(n, "ln-list:item-action", {
        list: a.name,
        id: v,
        action: p,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : C(n, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      a.tbody.children.length > 0 && (a._emptyObserver.disconnect(), a._emptyObserver = null, a._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(e) {
      if (e.preventDefault(), !e.detail) return;
      const t = e.detail.key, o = e.detail.values || [];
      if (t) {
        if (o.length === 0)
          delete a._filters[t];
        else {
          const p = [];
          for (let v = 0; v < o.length; v++)
            p.push(o[v].toLowerCase());
          a._filters[t] = p;
        }
        a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), C(n, "ln-list:filter", {
          term: a._searchTerm,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }
    }, n.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(e) {
      if (e.detail && e.detail.field == null) return;
      e.preventDefault();
      const t = e.detail && e.detail.direction === "none" ? null : e.detail && e.detail.direction;
      a._sortField = t === null ? null : e.detail && e.detail.field, a._sortDir = t, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), C(n, "ln-list:sorted", {
        field: a._sortField,
        direction: e.detail && e.detail.direction,
        matched: a._filteredData.length,
        total: a._data.length
      });
    }, n.addEventListener("ln-sort:change", this._onSort)), this;
  }
  f.prototype._parseChildren = function() {
    const n = Array.from(this.tbody.children).filter((a) => !a.classList.contains("ln-list__spacer"));
    this._data = [], n.length > 0 && (this._itemHeight = g(n[0]) || 50);
    for (let a = 0; a < n.length; a++) {
      const e = n[a], t = e.getAttribute("data-ln-item-id") || e.getAttribute("id"), o = e.textContent.trim().toLowerCase();
      let p = null;
      if (this.isDataDriven) {
        p = {}, t != null && (p.id = t);
        const E = e.querySelectorAll("[data-ln-list-field]");
        for (let S = 0; S < E.length; S++) {
          const L = E[S], T = L.getAttribute("data-ln-list-field");
          T && (p[T] = wt(L));
        }
      }
      const v = {}, w = e.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let E = 0; E < w.length; E++) {
        const S = w[E], L = S.getAttribute("data-ln-list-field") || S.getAttribute("data-ln-field");
        L && (v[L] = wt(S));
      }
      for (let E = 0; E < e.attributes.length; E++) {
        const S = e.attributes[E];
        if (S.name.startsWith("data-") && !S.name.startsWith("data-ln-")) {
          const L = S.name.slice(5);
          L && (v[L] = S.value);
        }
      }
      this._data.push({
        html: e.outerHTML,
        id: t,
        searchText: o,
        fields: v,
        ...p || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), C(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, f.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const n = this._searchTerm, a = n ? n.split(/\s+/).filter(Boolean) : [], e = this._filters || {}, t = Object.keys(e).length > 0;
      if (a.length === 0 && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(o) {
        if (a.length > 0 && !a.every(function(v) {
          return o.searchText && o.searchText.indexOf(v) !== -1;
        }))
          return !1;
        if (t)
          for (const p in e) {
            const v = e[p];
            if (v && v.length > 0) {
              const w = o.fields && o.fields[p] !== void 0 ? o.fields[p] : o[p] !== void 0 ? o[p] : null, E = w != null ? String(w).toLowerCase() : "";
              if (v.indexOf(E) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const o = this._sortField, p = this._sortDir === "desc" ? -1 : 1, v = typeof Intl < "u" ? new Intl.Collator(G(this.dom), { sensitivity: "base" }) : null, w = this._filteredData.map(function(S) {
          return S.fields && S.fields[o] !== void 0 ? S.fields[o] : S[o];
        }), E = ee(w);
        this._filteredData.sort(function(S, L) {
          const T = S.fields && S.fields[o] !== void 0 ? S.fields[o] : S[o], x = L.fields && L.fields[o] !== void 0 ? L.fields[o] : L[o];
          return ne(T, x, E, v) * p;
        });
      }
    }
  }, f.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const n = this._lastTotal, a = this.visibleCount;
        if (n === 0 || this._filteredData.length === 0 || a === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const n = this._filteredData.length;
        n === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : n > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, f.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const n = this._filteredData, a = document.createDocumentFragment();
      for (let t = 0; t < n.length; t++) {
        const o = this._buildItem(n[t]);
        o && a.appendChild(o);
      }
      const e = b(this);
      this.tbody.replaceChildren(a), d(e), this._selectable && this._updateSelectAll();
    } else {
      const n = [], a = this._filteredData;
      for (let t = 0; t < a.length; t++) n.push(a[t].html);
      const e = b(this);
      this.tbody.innerHTML = n.join(""), d(e), this._selectable && this._restoreSelection();
    }
  }, f.prototype._readGridLayout = function() {
    const n = getComputedStyle(this.tbody), a = n.gridTemplateColumns;
    let e = 1;
    if (a && a !== "none") {
      const o = a.trim().split(/\s+/).filter(Boolean);
      o.length > 0 && (e = o.length);
    }
    const t = parseFloat(n.rowGap);
    return { columns: e, rowGap: isNaN(t) ? 0 : t };
  }, f.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const n = this._cache.peek(), a = n ? this._buildItem(n) : this._buildPlaceholderItem();
      a && (this.tbody.textContent = "", this.tbody.appendChild(a), this._itemHeight = g(a) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const n = this._buildItem(this._data[0]);
        n && (this.tbody.textContent = "", this.tbody.appendChild(n), this._itemHeight = g(n) || 50, this.tbody.textContent = "");
      }
    } else {
      const n = this.tbody.children;
      n.length > 0 && (this._itemHeight = g(n[0]) || 50);
    }
  }, f.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = l(this.dom);
    const a = this._scrollContainer || window;
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._windowed ? n._renderWindowed() : n._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      n._itemHeight = 0, n._measureItemHeight(), n._vStart = -1, n._vEnd = -1, n._windowed ? n._renderWindowed() : n._renderVirtual();
    }, a.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, f.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, f.prototype._renderVirtual = function() {
    const n = this._filteredData, a = n.length, e = this._itemHeight;
    if (!e || !a) return;
    const t = this._scrollContainer;
    let o, p;
    if (t) {
      const U = this.tbody.getBoundingClientRect(), B = t.getBoundingClientRect(), z = t === this.tbody ? 0 : U.top - B.top + t.scrollTop;
      o = t.scrollTop - z, p = t.clientHeight;
    } else {
      const B = this.tbody.getBoundingClientRect().top + window.scrollY;
      o = window.scrollY - B, p = window.innerHeight;
    }
    const v = this._readGridLayout(), w = v.columns, E = v.rowGap, S = e + E, L = Math.ceil(a / w);
    let T = Math.max(0, Math.floor(o / S) - 15);
    T = Math.min(T, L);
    const x = Math.ceil(p / S) + 30, k = Math.min(T + x, L), O = Math.min(T * w, a), M = Math.min(k * w, a);
    if (O === this._vStart && M === this._vEnd) return;
    this._vStart = O, this._vEnd = M;
    const N = T * S, K = (L - k) * S;
    if (this.isDataDriven) {
      const U = document.createDocumentFragment();
      if (N > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = N + "px", U.appendChild(z);
      }
      for (let z = O; z < M; z++) {
        const rt = this._buildItem(n[z]);
        rt && U.appendChild(rt);
      }
      if (K > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.setAttribute("aria-hidden", "true"), z.style.height = K + "px", U.appendChild(z);
      }
      const B = b(this);
      this.tbody.replaceChildren(U), d(B), this._selectable && this._updateSelectAll();
    } else {
      let U = "";
      N > 0 && (U += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${N}px"></${this.isUl ? "li" : "div"}>`);
      for (let z = O; z < M; z++)
        U += n[z].html;
      K > 0 && (U += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${K}px"></${this.isUl ? "li" : "div"}>`);
      const B = b(this);
      this.tbody.innerHTML = U, d(B), this._selectable && this._restoreSelection();
    }
  }, f.prototype._buildPlaceholderItem = function() {
    const n = document.createElement(this.isUl ? "li" : "div");
    return n.className = "ln-list__placeholder", n.setAttribute("aria-hidden", "true"), n.style.height = this._itemHeight + "px", n;
  }, f.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const n = this._itemHeight;
    if (!n) return;
    const a = this._scrollContainer;
    let e, t;
    if (a) {
      const B = this.tbody.getBoundingClientRect(), z = a.getBoundingClientRect(), rt = a === this.tbody ? 0 : B.top - z.top + a.scrollTop;
      e = a.scrollTop - rt, t = a.clientHeight;
    } else {
      const z = this.tbody.getBoundingClientRect().top + window.scrollY;
      e = window.scrollY - z, t = window.innerHeight;
    }
    const o = this._readGridLayout(), p = o.columns, v = o.rowGap, w = n + v, E = this._cache.logicalTotal, S = Math.ceil(E / p);
    let L = Math.max(0, Math.floor(e / w) - 15);
    L = Math.min(L, S);
    const T = Math.ceil(t / w) + 30, x = Math.min(L + T, S), k = Math.min(L * p, E), O = Math.min(x * p, E), M = L * w, N = (S - x) * w, K = document.createDocumentFragment();
    if (M > 0) {
      const B = document.createElement(this.isUl ? "li" : "div");
      B.className = "ln-list__spacer", B.setAttribute("aria-hidden", "true"), B.style.height = M + "px", K.appendChild(B);
    }
    for (let B = k; B < O; B++)
      if (this._cache.has(B)) {
        const z = this._buildItem(this._cache.get(B));
        z && K.appendChild(z);
      } else
        K.appendChild(this._buildPlaceholderItem());
    if (N > 0) {
      const B = document.createElement(this.isUl ? "li" : "div");
      B.className = "ln-list__spacer", B.setAttribute("aria-hidden", "true"), B.style.height = N + "px", K.appendChild(B);
    }
    const U = b(this);
    this.tbody.replaceChildren(K), d(U), this._vStart = k, this._vEnd = O, this._cache.ensure(k, O);
  }, f.prototype._showEmptyState = function() {
    let n = null;
    if (this.isDataDriven) {
      const a = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount === 0 && a > 0, o = t ? this.name + "-empty-filtered" : this.name + "-empty";
      if (n = ft(this.dom, o, "ln-list"), !n) {
        const p = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (p) {
          const v = t ? "search" : "initial", w = p.content.querySelector(`[data-ln-empty-when="${v}"]`) || p.content.firstElementChild;
          w && (n = document.importNode(w, !0));
        }
      }
    } else {
      const a = this.dom.querySelector(`template[${_}]`);
      if (a) {
        const e = a.content.firstElementChild;
        e && (n = document.importNode(e, !0));
      }
    }
    if (n)
      if (n.tagName === "LI" || n.tagName === "TR")
        this.tbody.replaceChildren(n);
      else {
        const a = document.createElement(this.isUl ? "li" : "div");
        a.appendChild(n), this.tbody.replaceChildren(a);
      }
    else
      this.tbody.replaceChildren();
    C(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, f.prototype._buildItem = function(n) {
    let a = ft(this.dom, this.name + "-row", "ln-list");
    if (!a) {
      const t = this.dom.querySelector("template[data-ln-item]");
      t && (a = document.importNode(t.content, !0));
    }
    let e = a ? a.querySelector("[data-ln-item]") || a.firstElementChild : null;
    if (e)
      xt(e, n), nt(e, n);
    else if (n && n.html) {
      const t = document.createElement(this.isUl ? "ul" : "div");
      t.innerHTML = n.html, e = t.firstElementChild;
    } else if (e = document.createElement(this.isUl ? "li" : "div"), e.setAttribute("data-ln-item", ""), n && typeof n == "object") {
      for (const t in n)
        if (t !== "html" && n[t] != null) {
          const o = document.createElement("span");
          o.setAttribute("data-ln-field", t), o.textContent = String(n[t]), e.appendChild(o);
        }
    }
    if (e._lnRecord = n, n && n.id != null && (e.setAttribute("data-ln-item-id", n.id), this._selectable && this.selectedIds.has(String(n.id)))) {
      e.classList.add("ln-item-selected");
      const t = e.querySelector("[data-ln-item-select]");
      t && (t.checked = !0);
    }
    return e;
  }, f.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-item]");
    for (let a = 0; a < n.length; a++) {
      const e = n[a].getAttribute("data-ln-item-id"), t = e != null && this.selectedIds.has(String(e));
      n[a].classList.toggle("ln-item-selected", t);
      const o = n[a].querySelector("[data-ln-item-select]");
      o && (o.checked = t);
    }
    this._updateSelectAll();
  }, f.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const n = this;
    this._onSelectionChange = function(a) {
      const e = a.target.closest("[data-ln-item-select]");
      if (!e) return;
      const t = e.closest("[data-ln-item]");
      if (!t) return;
      const o = t.getAttribute("data-ln-item-id");
      o != null && (e.checked ? (n.selectedIds.add(String(o)), t.classList.add("ln-item-selected")) : (n.selectedIds.delete(String(o)), t.classList.remove("ln-item-selected")), n._updateSelectAll(), n._updateFooter(), C(n.dom, "ln-list:select", {
        list: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const a = n._selectAllCheckbox.checked, e = n.tbody.querySelectorAll("[data-ln-item]");
      for (let t = 0; t < e.length; t++) {
        const o = e[t], p = o.getAttribute("data-ln-item-id"), v = o.querySelector("[data-ln-item-select]");
        p != null && (a ? (n.selectedIds.add(String(p)), o.classList.add("ln-item-selected")) : (n.selectedIds.delete(String(p)), o.classList.remove("ln-item-selected")), v && (v.checked = a));
      }
      C(n.dom, "ln-list:select-all", { list: n.name, selected: a }), C(n.dom, "ln-list:select", {
        list: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedIds.size
      }), n._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, f.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const n = this.tbody.querySelectorAll("[data-ln-item]");
    let a = n.length > 0;
    for (let e = 0; e < n.length; e++) {
      const t = n[e].getAttribute("data-ln-item-id");
      if (t != null && !this.selectedIds.has(String(t))) {
        a = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = a;
  }, f.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Le(this, "ln-list:request-data", "list");
  }, f.prototype._enterWindowedMode = function() {
    const n = this, a = this.dom, e = parseInt(a.getAttribute("data-ln-list-window"), 10), t = parseInt(a.getAttribute("data-ln-list-window-page"), 10), o = parseInt(a.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !n._windowed || !n._cache || (n.totalCount = n._cache.grandTotal, n.visibleCount = n._cache.logicalTotal, n._lastTotal = n._cache.grandTotal, n.isLoaded = !0, n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), C(a, "ln-list:rendered", {
        list: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      }));
    }, this._renderBatch = re(this._onCacheChange), this._cache = Fe({
      windowSize: e > 0 ? e : 1e3,
      pageSize: t > 0 ? t : 200,
      threshold: o >= 0 ? o : 25,
      fetchDebounce: 120,
      requestPage: function(p, v, w) {
        C(a, "ln-list:request-data", {
          list: n.name,
          sort: p.sort,
          filters: p.filters,
          search: p.search,
          offset: v,
          limit: w,
          queryGen: n._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, f.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const n = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), a = n > 0 ? n : this._data.length;
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
  }, f.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, f.prototype._updateFooter = function() {
    let n = 0, a = 0;
    this.isDataDriven ? (n = this._lastTotal != null ? this._lastTotal : this._data.length, a = this.visibleCount) : (n = this._data.length, a = this._filteredData.length);
    const e = a < n;
    if (this._totalSpan && (this._totalSpan.textContent = c(n, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = e ? c(a, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const t = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = t > 0 ? c(t, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", t === 0);
    }
  }, f.prototype.destroy = function() {
    this.dom[i] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[i]);
  }, P(r, i, f, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(n, a) {
      const e = n[i];
      if (!(!e || !e.isDataDriven)) {
        if (a === "data-ln-list-window") {
          const t = n.hasAttribute("data-ln-list-window");
          if (t && !e._windowed)
            e._enterWindowedMode(), e._kickWindowInitial();
          else if (!t && e._windowed)
            e._exitWindowedMode();
          else if (t && e._windowed) {
            const o = parseInt(n.getAttribute("data-ln-list-window"), 10);
            o > 0 && e._cache.configure({ windowSize: o });
          }
          return;
        }
        if (!(!e._windowed || !e._cache)) {
          if (a === "data-ln-list-window-page") {
            const t = parseInt(n.getAttribute("data-ln-list-window-page"), 10);
            t > 0 && e._cache.configure({ pageSize: t });
          } else if (a === "data-ln-list-window-threshold") {
            const t = parseInt(n.getAttribute("data-ln-list-window-threshold"), 10);
            t >= 0 && e._cache.configure({ threshold: t });
          } else if (a === "data-ln-list-count") {
            const t = parseInt(n.getAttribute("data-ln-list-count"), 10);
            t >= 0 && e._cache.setGrandTotal(t);
          }
        }
      }
    }
  });
})();
(function() {
  const r = "data-ln-circular-progress", i = "lnCircularProgress";
  if (window[i] !== void 0) return;
  const _ = "http://www.w3.org/2000/svg", y = 36, u = 16, m = 2 * Math.PI * u;
  function h(b) {
    return this.dom = b, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, c.call(this), l.call(this), this;
  }
  h.prototype.destroy = function() {
    this.dom[i] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[i]);
  };
  function s(b, d) {
    const g = document.createElementNS(_, b);
    for (const f in d)
      g.setAttribute(f, d[f]);
    return g;
  }
  function c() {
    this.svg = s("svg", {
      viewBox: "0 0 " + y + " " + y,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: y / 2,
      cy: y / 2,
      r: u,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: y / 2,
      cy: y / 2,
      r: u,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + y / 2 + " " + y / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function l() {
    const b = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, d = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let g = d > 0 ? b / d * 100 : 0;
    g < 0 && (g = 0), g > 100 && (g = 100);
    const f = m - g / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", f);
    const n = this.dom.getAttribute("data-ln-circular-progress-label"), a = n !== null ? n : Math.round(g) + "%";
    this.labelEl.textContent = a, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(d));
    const e = Math.max(0, Math.min(b, d));
    this.dom.setAttribute("aria-valuenow", String(e)), this.dom.setAttribute("aria-valuetext", a), C(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: b,
      max: d,
      percentage: g
    });
  }
  P(r, i, h, "ln-circular-progress", {
    extraAttributes: ["data-ln-circular-progress-max", "data-ln-circular-progress-label"],
    onAttributeChange: function(b) {
      const d = b[i];
      d && l.call(d);
    }
  });
})();
(function() {
  const r = "data-ln-sortable", i = "lnSortable", _ = "data-ln-sortable-handle";
  if (window[i] !== void 0) return;
  function y(m) {
    this.dom = m, this.isEnabled = m.getAttribute(r) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const h = this;
    return this._onPointerDown = function(s) {
      h.isEnabled && h._handlePointerDown(s);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(r, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(r, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), C(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[i]);
  }, y.prototype._handlePointerDown = function(m) {
    let h = m.target.closest("[" + _ + "]"), s;
    if (h) {
      for (s = h; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + _ + "]")) return;
      for (s = m.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      h = s;
    }
    const l = Array.from(this.dom.children).indexOf(s);
    if (W(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: l
    }).defaultPrevented) return;
    m.preventDefault(), h.setPointerCapture(m.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), C(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: l
    });
    const d = this, g = function(n) {
      d._handlePointerMove(n);
    }, f = function(n) {
      d._handlePointerEnd(n), h.removeEventListener("pointermove", g), h.removeEventListener("pointerup", f), h.removeEventListener("pointercancel", f);
    };
    h.addEventListener("pointermove", g), h.addEventListener("pointerup", f), h.addEventListener("pointercancel", f);
  }, y.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const h = Array.from(this.dom.children), s = this._dragging;
    for (const c of h)
      c.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const c of h) {
      if (c === s) continue;
      const l = c.getBoundingClientRect(), b = l.top + l.height / 2;
      if (m.clientY >= l.top && m.clientY < b) {
        c.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= b && m.clientY <= l.bottom) {
        c.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const h = this._dragging, s = Array.from(this.dom.children), c = s.indexOf(h);
    let l = null, b = null;
    for (const d of s) {
      if (d.classList.contains("ln-sortable--drop-before")) {
        l = d, b = "before";
        break;
      }
      if (d.classList.contains("ln-sortable--drop-after")) {
        l = d, b = "after";
        break;
      }
    }
    for (const d of s)
      d.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (h.classList.remove("ln-sortable--dragging"), h.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), l && l !== h) {
      b === "before" ? this.dom.insertBefore(h, l) : this.dom.insertBefore(h, l.nextElementSibling);
      const g = Array.from(this.dom.children).indexOf(h);
      C(this.dom, "ln-sortable:reordered", {
        item: h,
        oldIndex: c,
        newIndex: g
      });
    }
    this._dragging = null;
  };
  function u(m) {
    const h = m[i];
    if (!h) return;
    const s = m.getAttribute(r) !== "disabled";
    s !== h.isEnabled && (h.isEnabled = s, C(m, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  P(r, i, y, "ln-sortable", {
    onAttributeChange: u
  });
})();
(function() {
  const r = "data-ln-confirm", i = "lnConfirm", _ = "data-ln-confirm-timeout";
  if (window[i] !== void 0) return;
  function u(h) {
    const s = parseFloat(h.getAttribute(_));
    return isNaN(s) || s <= 0 ? 3 : s;
  }
  function m(h) {
    this.dom = h, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = h.querySelector("[data-ln-confirm-idle]"), this.activeEl = h.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = h.textContent.trim(), this.confirmText = h.getAttribute(r) || "Confirm?");
    const s = this;
    return this._onClick = function(c) {
      if (!Te(c))
        if (!s.confirming)
          c.preventDefault(), c.stopImmediatePropagation(), s._enterConfirm();
        else {
          if (s._submitted) return;
          s._submitted = !0, c.stopPropagation(), s._reset();
        }
    }, h.addEventListener("click", this._onClick), this;
  }
  m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const h = this.activeEl ? this.activeEl.textContent.trim() : "";
      h && (this.dom.setAttribute("aria-label", h), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = h.getAttribute("href"), h.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), C(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const h = this, s = u(this.dom) * 1e3;
    this.revertTimer = setTimeout(function() {
      h._reset();
    }, s);
  }, m.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalIconHref && h.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    this.dom[i] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[i], C(this.dom, "ln-confirm:destroyed", { target: this.dom }));
  }, P(r, i, m, "ln-confirm");
})();
(function() {
  const r = "data-ln-translations", i = "lnTranslations";
  if (window[i] !== void 0) return;
  const _ = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function y(u) {
    this.dom = u, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = u.getAttribute(r + "-default") || "", this.placeholderLabel = u.getAttribute(r + "-placeholder") || "{lang} translation", this.removeLabel = u.getAttribute(r + "-remove-label") || "Remove {lang}", this.badgesEl = u.querySelector("[" + r + "-active]"), this.menuEl = u.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = u.getAttribute(r + "-locales");
    if (this.locales = _, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const h = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && h.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && h.removeLanguage(s.detail.lang);
    }, u.addEventListener("ln-translations:request-add", this._onRequestAdd), u.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  y.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const u = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of u) {
      const h = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of h)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, y.prototype._detectExisting = function() {
    const u = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of u) {
      const h = m.getAttribute("data-ln-translatable-lang");
      h && h !== this.defaultLang && this.activeLanguages.add(h);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, y.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const u = this;
    let m = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      m++;
      const c = Rt("ln-translations-menu-item", "ln-translations");
      if (!c) return;
      const l = c.querySelector("[data-ln-translations-lang]");
      l.setAttribute("data-ln-translations-lang", s), l.textContent = this.locales[s], l.addEventListener("click", function(b) {
        b.ctrlKey || b.metaKey || b.button === 1 || (b.preventDefault(), b.stopPropagation(), u.menuEl.getAttribute("data-ln-toggle") === "open" && u.menuEl.setAttribute("data-ln-toggle", "close"), u.addLanguage(s));
      }), this.menuEl.appendChild(c);
    }
    const h = this.dom.querySelector("[" + r + "-add]");
    h && (h.hidden = m === 0);
  }, y.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const u = this;
    this.activeLanguages.forEach(function(m) {
      const h = Rt("ln-translations-badge", "ln-translations");
      if (!h) return;
      const s = h.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", m);
      const c = s.querySelector("span");
      c.textContent = u.locales[m] || m.toUpperCase();
      const l = s.querySelector("button"), b = u.locales[m] || m.toUpperCase();
      l.setAttribute("aria-label", u.removeLabel.replace("{lang}", b)), l.addEventListener("click", function(d) {
        d.ctrlKey || d.metaKey || d.button === 1 || (d.preventDefault(), d.stopPropagation(), u.removeLanguage(m));
      }), u.badgesEl.appendChild(h);
    });
  }, y.prototype.addLanguage = function(u, m) {
    if (this.activeLanguages.has(u)) return;
    const h = this.locales[u] || u;
    if (W(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: u,
      langName: h
    }).defaultPrevented) return;
    this.activeLanguages.add(u), m = m || {};
    const c = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const l of c) {
      const b = l.getAttribute("data-ln-translatable"), d = l.getAttribute("data-ln-translations-prefix") || "", g = l.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!g) continue;
      const f = g.cloneNode(g.tagName === "SELECT");
      d ? f.name = d + "[trans][" + u + "][" + b + "]" : f.name = "trans[" + u + "][" + b + "]", f.value = m[b] !== void 0 ? m[b] : "", f.removeAttribute("id"), "placeholder" in f && (f.placeholder = this.placeholderLabel.replace("{lang}", h)), f.setAttribute("data-ln-translatable-lang", u);
      const n = l.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), a = n.length > 0 ? n[n.length - 1] : g;
      a.parentNode.insertBefore(f, a.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), C(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: u,
      langName: h
    });
  }, y.prototype.removeLanguage = function(u) {
    if (!this.activeLanguages.has(u) || W(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: u
    }).defaultPrevented) return;
    const h = this.dom.querySelectorAll('[data-ln-translatable-lang="' + u + '"]');
    for (const s of h)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(u), this._updateDropdown(), this._updateBadges(), C(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: u
    });
  }, y.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, y.prototype.hasLanguage = function(u) {
    return this.activeLanguages.has(u);
  }, y.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const u = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of m)
      h.getAttribute("data-ln-translatable-lang") !== u && h.parentNode.removeChild(h);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[i];
  }, P(r, i, y, "ln-translations");
})();
const ai = "ln-autosave:", li = 1e3;
function ci(r, i) {
  return i ? ai + (r || "") + ":" + i : null;
}
function di(r, i = li) {
  if (r == null) return 0;
  if (r === "") return i;
  const _ = parseInt(String(r), 10);
  return isNaN(_) || _ < 0 ? i : _;
}
(function() {
  const r = "data-ln-autosave", i = "lnAutosave", _ = "data-ln-autosave-clear", y = "data-ln-autosave-debounce-input", u = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[i] !== void 0) return;
  function m(s) {
    const c = s.tagName;
    return c === "INPUT" || c === "TEXTAREA" || c === "SELECT";
  }
  function h(s) {
    const l = s.getAttribute(r) || s.id, b = ci(window.location.pathname, l);
    if (!b) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", s);
      return;
    }
    this.dom = s, this.key = b;
    let d = null;
    function g() {
      const e = xe(s, { exclude: u });
      try {
        localStorage.setItem(b, JSON.stringify(e));
      } catch {
        return;
      }
      C(s, "ln-autosave:saved", { target: s, data: e });
    }
    function f() {
      let e;
      try {
        e = localStorage.getItem(b);
      } catch {
        return;
      }
      if (!e) return;
      let t;
      try {
        t = JSON.parse(e);
      } catch {
        return;
      }
      if (W(s, "ln-autosave:before-restore", { target: s, data: t }).defaultPrevented) return;
      const p = ke(s, t);
      for (let v = 0; v < p.length; v++)
        p[v].dispatchEvent(new Event("input", { bubbles: !0 })), p[v].dispatchEvent(new Event("change", { bubbles: !0 }));
      C(s, "ln-autosave:restored", { target: s, data: t });
    }
    function n() {
      try {
        localStorage.removeItem(b);
      } catch {
        return;
      }
      C(s, "ln-autosave:cleared", { target: s });
    }
    this._onFocusout = function(e) {
      const t = e.target;
      m(t) && t.name && !t.matches(u) && g();
    }, this._onChange = function(e) {
      const t = e.target;
      m(t) && t.name && !t.matches(u) && g();
    }, this._onSubmit = function() {
      n();
    }, this._onReset = function() {
      n();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + _ + "]") && n();
    }, s.addEventListener("focusout", this._onFocusout), s.addEventListener("change", this._onChange), s.addEventListener("submit", this._onSubmit), s.addEventListener("reset", this._onReset), s.addEventListener("click", this._onClearClick);
    const a = di(s.getAttribute(y));
    return a > 0 && (this._onInput = function(e) {
      const t = e.target;
      !m(t) || !t.name || t.matches(u) || (d !== null && clearTimeout(d), d = setTimeout(g, a));
    }, s.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return d;
    }, f(), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[i]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const s = this._getInputTimer();
        s !== null && clearTimeout(s);
      }
      C(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[i];
    }
  }, P(r, i, h, "ln-autosave");
})();
(function() {
  const r = "data-ln-autoresize", i = "lnAutoresize";
  if (window[i] !== void 0) return;
  function _(y) {
    if (y.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", y.tagName), this;
    this.dom = y;
    const u = this;
    return this._onInput = function() {
      u._resize();
    }, y.addEventListener("input", this._onInput), this._resize(), this;
  }
  _.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, _.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[i]);
  }, P(r, i, _, "ln-autoresize");
})();
(function() {
  const r = "data-ln-editor", i = "lnEditor";
  if (window[i] !== void 0) return;
  const _ = {
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
  }, u = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, m = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let h = 0;
  function s(e) {
    return !!(y[e] || u[e] || m[e] || e === "link");
  }
  function c(e) {
    this.dom = e;
    const t = this;
    if (this._textarea = e.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", e), this;
    const o = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), o && this._surface.setAttribute("data-placeholder", o);
    const p = this._textarea.id;
    if (p) {
      const S = e.querySelector('label[for="' + p + '"]');
      S && (S.id || (S.id = p + "-label"), this._surface.setAttribute("aria-labelledby", S.id));
    }
    this._surface.id = p ? p + "-surface" : "ln-editor-surface-" + ++h;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const w = e.querySelector('[role="toolbar"]');
    if (w && w.nextSibling ? e.insertBefore(this._surface, w.nextSibling) : e.appendChild(this._surface), w) {
      w.setAttribute("aria-controls", this._surface.id);
      const S = w.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < S.length; L++) {
        const T = S[L].getAttribute("data-ln-editor-action");
        s(T) && S[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      t._syncToTextarea(), C(t.dom, "ln-editor:changed", {
        html: t._textarea.value,
        target: t.dom
      });
    }, this._onMousedownToolbar = function(S) {
      S.target.closest("[data-ln-editor-action]") && S.preventDefault();
    }, this._onClickToolbar = function(S) {
      const L = S.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const T = L.getAttribute("data-ln-editor-action");
      t._execAction(T);
    }, this._onPaste = function(S) {
      d(t, S);
    }, this._onKeydown = function(S) {
      n(t, S);
    }, this._onSelectionChange = function() {
      document.contains(t._surface) && t._updateActiveStates();
    }, this._onFocus = function() {
      C(t.dom, "ln-editor:focus", { target: t.dom });
    }, this._onBlur = function() {
      t._syncToTextarea(), C(t.dom, "ln-editor:blur", { target: t.dom });
    }, this._onTextareaInput = function() {
      t._surface.innerHTML !== t._textarea.value && (t._surface.innerHTML = t._textarea.value, C(t.dom, "ln-editor:changed", {
        html: t._textarea.value,
        target: t.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), w && (w.addEventListener("mousedown", this._onMousedownToolbar), w.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(S) {
      const L = S.detail && S.detail.html;
      L !== void 0 && (t._surface.innerHTML = L, t._syncToTextarea(), C(t.dom, "ln-editor:changed", {
        html: t._textarea.value,
        target: t.dom
      }));
    }, e.addEventListener("ln-editor:set-content", this._onSetContent);
    const E = this._textarea.form;
    return E && (this._onFormReset = function() {
      setTimeout(function() {
        t._surface.innerHTML = t._textarea.value, C(e, "ln-editor:changed", {
          html: t._textarea.value,
          target: e
        });
      }, 0);
    }, E.addEventListener("reset", this._onFormReset)), this;
  }
  c.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, c.prototype._execAction = function(e) {
    if (!(!e || W(this.dom, "ln-editor:before-change", {
      action: e,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), y[e])
        document.execCommand(y[e], !1, null);
      else if (u[e]) {
        const o = u[e], p = l(this._surface);
        p && p.toLowerCase() === o ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + o + ">");
      } else m[e] ? document.execCommand(m[e], !1, null) : e === "link" ? a(this) : e === "unlink" ? document.execCommand("unlink", !1, null) : e === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, c.prototype._updateActiveStates = function() {
    const e = this.dom.querySelector('[role="toolbar"]');
    if (!e) return;
    const t = window.getSelection();
    if (!t || t.rangeCount === 0) return;
    const o = t.anchorNode;
    if (!o || !this._surface.contains(o)) return;
    const p = e.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < p.length; v++) {
      const w = p[v], E = w.getAttribute("data-ln-editor-action");
      let S = !1;
      if (y[E])
        try {
          S = document.queryCommandState(y[E]);
        } catch {
        }
      else if (u[E]) {
        const L = l(this._surface);
        S = L && L.toLowerCase() === u[E];
      } else if (m[E])
        try {
          S = document.queryCommandState(m[E]);
        } catch {
        }
      else E === "link" && (S = !!b(t.anchorNode, "A", this._surface));
      s(E) && w.setAttribute("aria-pressed", String(S)), S ? w.classList.add("ln-editor-active") : w.classList.remove("ln-editor-active");
    }
  }, c.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, c.prototype.setHTML = function(e) {
    this._surface && (this._surface.innerHTML = e, this._syncToTextarea(), C(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, c.prototype.destroy = function() {
    if (!this.dom[i]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const e = this.dom.querySelector('[role="toolbar"]');
    e && (e.removeEventListener("mousedown", this._onMousedownToolbar), e.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const t = this._textarea ? this._textarea.form : null;
    if (t && this._onFormReset && t.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const o = this.dom.querySelector(".ln-editor__link-popover");
      o && o.remove();
    }
    C(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[i];
  };
  function l(e) {
    const t = window.getSelection();
    if (!t || t.rangeCount === 0) return null;
    let o = t.anchorNode;
    if (!o) return null;
    for (; o && o !== e; ) {
      if (o.nodeType === 1) {
        const p = o.tagName;
        if (p === "H2" || p === "H3" || p === "H4" || p === "BLOCKQUOTE" || p === "PRE" || p === "P")
          return p;
      }
      o = o.parentNode;
    }
    return null;
  }
  function b(e, t, o) {
    for (; e && e !== o; ) {
      if (e.nodeType === 1 && e.tagName === t)
        return e;
      e = e.parentNode;
    }
    return null;
  }
  function d(e, t) {
    t.preventDefault();
    let o = "";
    if (t.clipboardData && (o = t.clipboardData.getData("text/html"), !o)) {
      const v = t.clipboardData.getData("text/plain");
      v && (o = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), o = "<p>" + o + "</p>");
    }
    if (!o) return;
    const p = g(o);
    p && document.execCommand("insertHTML", !1, p);
  }
  function g(e) {
    const t = document.createElement("div");
    return t.innerHTML = e, f(t), t.innerHTML;
  }
  function f(e) {
    const t = Array.from(e.childNodes);
    for (let o = 0; o < t.length; o++) {
      const p = t[o];
      if (p.nodeType !== 3) {
        if (p.nodeType !== 1) {
          e.removeChild(p);
          continue;
        }
        if (_[p.tagName]) {
          const v = Array.from(p.attributes);
          for (let w = 0; w < v.length; w++) {
            const E = v[w].name;
            if (p.tagName === "A" && E === "href") {
              const S = p.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(S) || p.removeAttribute("href");
            } else
              p.removeAttribute(E);
          }
          p.tagName === "A" && p.setAttribute("rel", "noopener noreferrer"), f(p);
        } else {
          for (; p.firstChild; )
            e.insertBefore(p.firstChild, p);
          e.removeChild(p);
        }
      }
    }
  }
  function n(e, t) {
    if (!(t.ctrlKey || t.metaKey)) return;
    let o = null;
    switch (t.key.toLowerCase()) {
      case "b":
        o = "bold";
        break;
      case "i":
        o = "italic";
        break;
      case "u":
        o = "underline";
        break;
      case "k":
        o = "link";
        break;
    }
    o && (t.preventDefault(), e._execAction(o));
  }
  function a(e) {
    const t = window.getSelection();
    if (!t || t.rangeCount === 0) return;
    const o = b(t.anchorNode, "A", e._surface), p = t.getRangeAt(0).cloneRange();
    e._closeLinkPopover && e._closeLinkPopover();
    const v = ft(e.dom, "ln-editor-link-popover", "ln-editor");
    if (!v) return;
    const w = v.firstElementChild;
    if (!w) return;
    const E = w.querySelector('input[type="url"]'), S = w.querySelector('[data-ln-editor-action="confirm-link"]'), L = w.querySelector('[data-ln-editor-action="cancel-link"]');
    o && (E.value = o.getAttribute("href") || "");
    const T = e.dom.querySelector('[role="toolbar"]');
    T ? T.after(w) : e.dom.insertBefore(w, e._surface), E.focus();
    function x() {
      const U = window.getSelection();
      U.removeAllRanges(), U.addRange(p);
    }
    function k() {
      document.removeEventListener("mousedown", K), e._closeLinkPopover = null, w.remove();
    }
    function O() {
      const U = E.value.trim();
      if (k(), x(), e._surface.focus(), U)
        if (o)
          o.setAttribute("href", U), o.setAttribute("rel", "noopener noreferrer"), e._syncToTextarea(), C(e.dom, "ln-editor:changed", {
            html: e._textarea.value,
            target: e.dom
          });
        else {
          document.execCommand("createLink", !1, U);
          const B = window.getSelection();
          if (B && B.anchorNode) {
            const z = b(B.anchorNode, "A", e._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), e._syncToTextarea());
          }
        }
      else o && document.execCommand("unlink", !1, null);
    }
    function M() {
      k(), x(), e._surface.focus();
    }
    function N() {
      k();
    }
    function K(U) {
      const B = e.dom.contains(U.target) && U.target.closest('[data-ln-editor-action="link"]');
      !w.contains(U.target) && !B && N();
    }
    e._closeLinkPopover = k, S.addEventListener("click", O), L.addEventListener("click", M), E.addEventListener("keydown", function(U) {
      U.key === "Enter" ? (U.preventDefault(), O()) : U.key === "Escape" && (U.preventDefault(), M());
    }), document.addEventListener("mousedown", K);
  }
  P(r, i, c, "ln-editor");
})();
(function() {
  const r = "lnFill";
  if (window[r] !== void 0) return;
  const i = { lnFillForm: !0, lnFillStore: !0 };
  function _(u) {
    const m = {}, h = u.dataset;
    for (const s in h) {
      if (!s.startsWith("lnFill") || i[s]) continue;
      const c = s.slice(6);
      c && (m[c.charAt(0).toLowerCase() + c.slice(1)] = h[s]);
    }
    return m;
  }
  function y(u, m) {
    const h = window.CSS && CSS.escape ? CSS.escape(m) : m, s = document.querySelectorAll('[data-ln-fill-id="' + h + '"]');
    if (s.length === 0) return null;
    for (let c = 0; c < s.length; c++) {
      const l = s[c].getAttribute("data-ln-fill-form");
      if (l) {
        const b = document.getElementById(l);
        if (b && u.contains(b)) return s[c];
      }
    }
    return s[0];
  }
  document.addEventListener("click", function(u) {
    if (u.ctrlKey || u.metaKey || u.button === 1) return;
    const m = u.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const h = m.getAttribute("href");
    if (h && h.indexOf("#") !== -1) return;
    const s = m.getAttribute("data-ln-fill-form"), c = document.getElementById(s);
    if (!c) return;
    const l = _(m), b = Object.keys(l).length > 0;
    window.lnCore.lnFill(c, b ? l : null);
  }), document.addEventListener("ln-fill:request", function(u) {
    const m = u.detail;
    if (!m) return;
    const h = u.target, s = m.id;
    if (s == null) {
      window.lnCore.lnFill(h, null);
      return;
    }
    const c = y(h, s);
    if (!c) return;
    const l = _(c);
    window.lnCore.lnFill(h, l);
  }), window[r] = !0;
})();
(function() {
  const r = "data-ln-slug-from", i = "lnSlug";
  if (window[i] !== void 0) return;
  function _(u) {
    return String(u).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function y(u) {
    if (u.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", u.tagName), this;
    const m = u.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", u), this;
    const h = u.getAttribute(r), s = m.elements[h];
    if (!s)
      return console.warn('[ln-slug] Source field "' + h + '" not found in form:', u), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + h + '" is a RadioNodeList (same-name group) — single source field required:', u), this;
    this.dom = u, this.source = s, this._pristine = u.value === "", this._mirroring = !1;
    const c = this;
    return this._onSource = function() {
      c._pristine && c._mirror();
    }, this._onSlug = function() {
      c._mirroring || (c._pristine = c.dom.value === "");
    }, s.addEventListener("input", this._onSource), u.addEventListener("input", this._onSlug), this._pristine && s.value && s.value.trim() !== "" && this._mirror(), this;
  }
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = _(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[i] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[i]);
  }, P(r, i, y, "ln-slug");
})();
(function() {
  const r = "data-ln-time", i = "lnTime";
  if (window[i] !== void 0) return;
  const _ = {}, y = {};
  function u(w) {
    return w.getAttribute("data-ln-time-locale") || G(w);
  }
  function m(w, E) {
    const S = (w || "") + "|" + JSON.stringify(E);
    return _[S] || (_[S] = new Intl.DateTimeFormat(w, E)), _[S];
  }
  function h(w) {
    const E = w || "";
    return y[E] || (y[E] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), y[E];
  }
  const s = /* @__PURE__ */ new Set();
  let c = null;
  function l() {
    c || (c = setInterval(d, 6e4));
  }
  function b() {
    c && (clearInterval(c), c = null);
  }
  function d() {
    for (const w of s) {
      if (!document.body.contains(w.dom)) {
        s.delete(w);
        continue;
      }
      t(w);
    }
    s.size === 0 && b();
  }
  function g(w, E) {
    const S = Tt(E), L = (E || "").toLowerCase().split("-")[0], T = m(E, { dateStyle: "long", timeStyle: "short" }), x = T.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && x !== L && S.monthsLong) {
      const k = S.monthsLong[w.getMonth()], O = w.getDate(), M = w.getFullYear(), N = String(w.getHours()).padStart(2, "0"), K = String(w.getMinutes()).padStart(2, "0");
      return `${O} ${k} ${M} во ${N}:${K}`;
    }
    return T.format(w);
  }
  function f(w, E) {
    const S = /* @__PURE__ */ new Date(), L = { month: "short", day: "numeric" };
    w.getFullYear() !== S.getFullYear() && (L.year = "numeric");
    const T = Tt(E), x = (E || "").toLowerCase().split("-")[0], k = m(E, L), O = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (T && O !== x && T.monthsShort) {
      const M = T.monthsShort[w.getMonth()], N = w.getDate(), K = w.getFullYear() !== S.getFullYear() ? " " + w.getFullYear() : "";
      return `${N} ${M}${K}`;
    }
    return k.format(w);
  }
  function n(w, E) {
    return m(E, { dateStyle: "medium" }).format(w);
  }
  function a(w, E) {
    return m(E, { timeStyle: "short" }).format(w);
  }
  function e(w, E) {
    const S = Math.floor(Date.now() / 1e3), T = Math.floor(w.getTime() / 1e3) - S, x = Math.abs(T);
    if (x < 10) return h(E).format(0, "second");
    let k, O;
    if (x < 60)
      k = "second", O = T;
    else if (x < 3600)
      k = "minute", O = Math.round(T / 60);
    else if (x < 86400)
      k = "hour", O = Math.round(T / 3600);
    else if (x < 604800)
      k = "day", O = Math.round(T / 86400);
    else if (x < 2592e3)
      k = "week", O = Math.round(T / 604800);
    else
      return f(w, E);
    return h(E).format(O, k);
  }
  function t(w) {
    const E = w.dom.getAttribute("datetime");
    if (!E) return;
    const S = Number(E);
    if (isNaN(S)) return;
    const L = new Date(S * 1e3), T = w.dom.getAttribute(r) || "short", x = u(w.dom);
    let k;
    switch (T) {
      case "relative":
        k = e(L, x);
        break;
      case "full":
        k = g(L, x);
        break;
      case "date":
        k = n(L, x);
        break;
      case "time":
        k = a(L, x);
        break;
      default:
        k = f(L, x);
        break;
    }
    w.dom.textContent = k, T !== "full" && (w.dom.title = g(L, x));
  }
  function o(w) {
    this.dom = w;
    const E = this;
    return this._onLocaleChange = function() {
      t(E);
    }, Pt(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), t(this), w.getAttribute(r) === "relative" && (s.add(this), l()), this;
  }
  o.prototype.render = function() {
    t(this);
  }, o.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), s.delete(this), s.size === 0 && b(), delete this.dom[i];
  };
  function p(w) {
    const E = w[i];
    if (!E) return;
    w.getAttribute(r) === "relative" ? (s.add(E), l()) : (s.delete(E), s.size === 0 && b()), t(E);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(r) && w[i] && t(w[i]);
  }
  P(r, i, o, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: p,
    onInit: v
  });
})();
function ui(r = {}) {
  let i = r.windowSize > 0 ? r.windowSize : 1e3, _ = r.pageSize > 0 ? r.pageSize : 200, y = r.fetchDebounce != null ? r.fetchDebounce : 120;
  const u = typeof r.requestPage == "function" ? r.requestPage : () => {
  }, m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let s = 0, c = 0, l = 0, b = !1, d = null;
  function g(a, e) {
    m.delete(a), m.set(a, e);
  }
  function f() {
    if (m.size <= i) return [];
    const a = [];
    for (; m.size > i; ) {
      const t = m.keys().next().value;
      a.push(m.get(t)), m.delete(t);
    }
    const e = new Set(m.values());
    return a.filter((t) => !e.has(t));
  }
  function n(a, e) {
    h.add(a), clearTimeout(d), d = setTimeout(() => u(a, _, e), y);
  }
  return {
    get logicalTotal() {
      return s;
    },
    set logicalTotal(a) {
      s = a;
    },
    get grandTotal() {
      return c;
    },
    set grandTotal(a) {
      c = a;
    },
    get queryGen() {
      return l;
    },
    set queryGen(a) {
      l = a;
    },
    get size() {
      return m.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return b;
    },
    getId: (a) => {
      if (!m.has(a)) return;
      const e = m.get(a);
      return g(a, e), e;
    },
    ensure: (a, e, t) => {
      if (!b && !h.has(0)) return n(0, t);
      if (s <= 0) return;
      const o = Math.max(0, a), p = Math.min(s, e);
      for (let v = o; v < p; v++)
        if (!m.has(v)) {
          const w = Math.floor(v / _) * _;
          if (!h.has(w)) return n(w, t);
        }
    },
    ingest: (a, e, t, o, p) => {
      if (p != null && p !== l) return [];
      b = !0, t != null && (c = t), o != null && (s = o);
      for (let v = 0; v < e.length; v++)
        g(a + v, e[v]);
      return h.delete(a), f();
    },
    reset: function() {
      l++, this.clear();
    },
    clear: () => {
      b = !1, m.clear(), h.clear(), clearTimeout(d);
    },
    configure: (a = {}) => {
      a.windowSize > 0 && a.windowSize !== i && (i = a.windowSize, f()), a.pageSize > 0 && (_ = a.pageSize), a.fetchDebounce >= 0 && (y = a.fetchDebounce);
    }
  };
}
function hi(r, i, _) {
  if (!Array.isArray(r) || !i || !i.field) return r;
  const { field: y, direction: u } = i, m = u === "desc", h = r.map((c) => c ? c[y] : void 0), s = ee(h);
  return [...r].sort((c, l) => {
    const b = c ? c[y] : void 0, d = l ? l[y] : void 0, g = ne(b, d, s, _);
    return m ? -g : g;
  });
}
function fi(r, i) {
  if (!Array.isArray(r) || !i || typeof i != "object") return r;
  const _ = Object.keys(i).filter((y) => Array.isArray(i[y]) && i[y].length > 0);
  return _.length ? r.filter((y) => y ? _.every((u) => ae(y[u], i[u])) : !1) : r;
}
function pi(r, i, _) {
  if (!Array.isArray(r) || !i || !_ || !_.length) return r;
  const y = Ze(i);
  return y.length ? r.filter((u) => u ? y.every(
    (m) => _.some((h) => {
      const s = u[h];
      return s != null && tn(String(s), [m]);
    })
  ) : !1) : r;
}
function mi(r, i, _) {
  if (!Array.isArray(r) || !r.length) return 0;
  if (_ === "count") return r.length;
  const y = r.map((m) => m && m[i] != null ? parseFloat(m[i]) : NaN).filter((m) => Number.isFinite(m)), u = y.reduce((m, h) => m + h, 0);
  return _ === "sum" ? u : _ === "avg" && y.length ? u / y.length : 0;
}
function gi(r, i = {}, _ = [], y) {
  if (!Array.isArray(r))
    return { records: [], total: 0, filtered: 0 };
  const u = r.length;
  let m = r;
  i.filters && (m = fi(m, i.filters)), i.search && (m = pi(m, i.search, _));
  const h = m.length;
  if (i.sort && (m = hi(m, i.sort, y)), i.offset || i.limit) {
    const s = i.offset || 0, c = i.limit || m.length;
    m = m.slice(s, s + c);
  }
  return { records: m, total: u, filtered: h };
}
function _i(r, i) {
  return !Array.isArray(r) || !i || typeof i != "object" ? r : r.map((_) => {
    if (!_) return null;
    const y = { ..._ };
    for (const [u, m] of Object.entries(i))
      if (typeof m == "function")
        try {
          y[u] = m(_);
        } catch {
          y[u] = void 0;
        }
    return y;
  });
}
(function() {
  const r = "data-ln-data-store", i = "lnDataStore", _ = "data-ln-data-store-no-local-query";
  if (window[i] !== void 0) return;
  const y = "ln_app_cache", u = "_meta", m = "1.0";
  let h = null, s = null;
  const c = {};
  function l(A) {
    A && A.name === "QuotaExceededError" && C(document, "ln-data-store:quota-exceeded", { error: A });
  }
  function b() {
    const A = {};
    for (const q of document.querySelectorAll(`[${r}]`)) {
      const I = q.id;
      if (I) {
        const D = q.getAttribute("data-ln-data-store-indexes") || "";
        A[I] = {
          indexes: D.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return A;
  }
  function d() {
    return s || (s = new Promise((A) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), A(null);
      const q = b(), I = Object.keys(q), D = indexedDB.open(y);
      D.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), A(null);
      }, D.onsuccess = (R) => {
        const F = R.target.result, H = Array.from(F.objectStoreNames);
        if (!(!H.includes(u) || I.some((et) => !H.includes(et))))
          return g(F), h = F, A(F);
        const V = F.version;
        F.close();
        const Q = indexedDB.open(y, V + 1);
        Q.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, Q.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), A(null);
        }, Q.onupgradeneeded = (et) => {
          const X = et.target.result;
          X.objectStoreNames.contains(u) || X.createObjectStore(u, { keyPath: "key" });
          for (const pt of I)
            if (!X.objectStoreNames.contains(pt)) {
              const At = X.createObjectStore(pt, { keyPath: "id" });
              for (const Kt of q[pt].indexes)
                At.createIndex(Kt, Kt, { unique: !1 });
            }
        }, Q.onsuccess = (et) => {
          const X = et.target.result;
          g(X), h = X, A(X);
        };
      };
    }), s);
  }
  function g(A) {
    A.onversionchange = () => {
      A.close(), h = null, s = null;
    };
  }
  function f() {
    return h ? Promise.resolve(h) : (s = null, d());
  }
  async function n(A) {
    if (!dt() || !A) return A;
    const q = { ...A }, I = q.id, D = await Tn(q);
    return !D || !D.encrypted ? A : {
      id: I,
      encrypted: !0,
      iv: D.iv,
      data: D.data
    };
  }
  async function a(A) {
    return !A || !A.encrypted || !dt() ? A : qn(A);
  }
  const e = (A, q) => f().then((I) => I ? I.transaction(A, q).objectStore(A) : null);
  function t(A) {
    return new Promise((q, I) => {
      A.onsuccess = () => q(A.result), A.onerror = () => {
        l(A.error), I(A.error);
      };
    });
  }
  const o = (A) => e(A, "readonly").then((q) => q ? t(q.getAll()) : []).then((q) => dt() ? Promise.all(q.map((I) => a(I))) : q), p = (A, q) => e(A, "readonly").then((I) => I ? t(I.get(q)) : null).then((I) => I ? a(I) : null), v = (A, q) => f().then((I) => {
    if (!I) return [];
    const R = I.transaction(A, "readonly").objectStore(A), F = q.map((H) => t(R.get(H)));
    return Promise.all(F).then((H) => dt() ? Promise.all(H.map((j) => a(j))) : H);
  }), w = (A, q) => (dt() ? n(q) : Promise.resolve(q)).then((D) => e(A, "readwrite").then((R) => R ? t(R.put(D)) : null)), E = (A, q) => e(A, "readwrite").then((I) => I ? t(I.delete(q)) : null), S = (A) => e(A, "readwrite").then((q) => q ? t(q.clear()) : null), L = (A) => e(A, "readonly").then((q) => q ? t(q.count()) : 0), T = (A) => e(u, "readonly").then((q) => q ? t(q.get(A)) : null), x = (A, q) => e(u, "readwrite").then((I) => {
    if (I)
      return q.key = A, t(I.put(q));
  });
  function k(A) {
    this.dom = A, this._name = A.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", A);
    const q = A.getAttribute("data-ln-data-store-stale"), I = parseInt(q, 10);
    this._staleThreshold = q === "never" || q === "-1" ? -1 : isNaN(I) ? 300 : I;
    const D = A.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = D.split(",").map((F) => F.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const R = A.getAttribute("data-ln-data-store-window");
    if (R !== null) {
      const F = parseInt(R, 10) || 1e3, H = parseInt(A.getAttribute("data-ln-data-store-window-page"), 10) || 200;
      this._windowIndex = ui({
        windowSize: F,
        pageSize: H,
        requestPage: (j, V, Q) => {
          C(this.dom, "ln-data-store:request-page", {
            store: this._name,
            offset: j,
            limit: V,
            query: Q,
            queryGen: this._windowIndex.queryGen
          });
        }
      });
    } else
      this._windowIndex = null;
    return this.windowed = this._windowIndex !== null, this.noLocalQuery = A.hasAttribute(_), this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), c[this._name] = this, O(this), this.ready = nn(this), this;
  }
  function O(A) {
    A._handlers = {
      create: (q) => M(A, "create", q.detail, () => K(A, q.detail)),
      update: (q) => M(A, "update", q.detail, () => U(A, q.detail)),
      delete: (q) => M(A, "delete", q.detail, () => B(A, q.detail)),
      "bulk-delete": (q) => M(A, "bulk-delete", q.detail, () => z(A, q.detail)),
      "sync-failed": (q) => {
        A.isSyncing = !1, C(A.dom, "ln-data-store:sync-error", {
          store: A._name,
          error: q.detail && q.detail.error,
          status: q.detail && q.detail.status
        });
      }
    };
    for (const [q, I] of Object.entries(A._handlers))
      A.dom.addEventListener(`ln-data-store:request-${q}`, I);
    A._queryHandlers = {
      "ln-search:change": (q) => {
        q.preventDefault();
        const I = q.detail && q.detail.term != null ? q.detail.term : "";
        I !== A.query.search && (A.query.search = I, zt(A));
      },
      "ln-filter:change": (q) => {
        q.preventDefault();
        const I = q.detail && q.detail.key;
        if (!I) return;
        const D = (q.detail.values || []).slice(), R = A.query.filters[I];
        (R ? R.length === D.length && R.every((H, j) => H === D[j]) : !D.length) || (D.length ? A.query.filters[I] = D : delete A.query.filters[I], zt(A));
      },
      "ln-sort:change": (q) => {
        q.preventDefault();
        const I = q.detail && q.detail.field, D = q.detail && q.detail.direction, R = D && D !== "none" ? { field: I, direction: D } : null, F = A.query.sort;
        !F && !R || F && R && F.field === R.field && F.direction === R.direction || (A.query.sort = R, zt(A));
      }
    };
    for (const [q, I] of Object.entries(A._queryHandlers))
      A.dom.addEventListener(q, I);
  }
  function M(A, q, I, D) {
    const R = I && I.requestId;
    return A._mutationChain = A._mutationChain.then(() => A.ready).then(() => {
      if (A.initializationError) throw A.initializationError;
      return D();
    }).catch((F) => rt(A, q, R, F)), A._mutationChain;
  }
  function N(A, q = 0) {
    return L(A._name).then((I) => {
      if (A._windowIndex || A.windowed) {
        const D = A.totalCount != null ? A.totalCount : I;
        A.totalCount = Math.max(0, D + q);
      } else
        A.totalCount = I;
      return A.hasCache = !0, A.isLoaded = !0, A.canServe = !0, x(A._name, {
        schema_version: m,
        last_synced_at: A.lastSyncedAt,
        has_cache: !0,
        record_count: A.totalCount
      });
    });
  }
  function K(A, { tempId: q, data: I = {}, requestId: D } = {}) {
    const R = { ...I, id: q };
    return w(A._name, R).then(() => N(A, 1)).then(() => {
      C(A.dom, "ln-data-store:created", { store: A._name, record: R, tempId: q, requestId: D });
    });
  }
  function U(A, { id: q, data: I = {}, requestId: D } = {}) {
    return p(A._name, q).then((R) => {
      if (!R) throw new Error(`Record not found: ${q}`);
      const F = { ...R, ...I }, H = I.id;
      return (H !== void 0 && H !== q ? rn(A._name, q, F) : w(A._name, F)).then(() => N(A, 0)).then(() => {
        C(A.dom, "ln-data-store:updated", { store: A._name, record: F, previous: R, requestId: D });
      });
    });
  }
  function B(A, { id: q, requestId: I } = {}) {
    return p(A._name, q).then((D) => {
      if (!D) {
        C(A.dom, "ln-data-store:deleted", { store: A._name, id: q, requestId: I, missing: !0 });
        return;
      }
      return E(A._name, q).then(() => N(A, -1)).then(() => {
        C(A.dom, "ln-data-store:deleted", { store: A._name, id: q, requestId: I });
      });
    });
  }
  function z(A, { ids: q = [], requestId: I } = {}) {
    return q.length ? Promise.all(q.map((D) => p(A._name, D))).then((D) => {
      const R = D.filter(Boolean).map((F) => F.id);
      return Ut(A._name, R).then(() => N(A, -R.length)).then(() => {
        C(A.dom, "ln-data-store:deleted", { store: A._name, ids: R, requestId: I });
      });
    }) : (C(A.dom, "ln-data-store:deleted", { store: A._name, ids: [], requestId: I }), Promise.resolve());
  }
  function rt(A, q, I, D) {
    console.error("[ln-data-store] " + q + " failed:", D), C(A.dom, "ln-data-store:mutation-error", {
      store: A._name,
      action: q,
      requestId: I,
      error: D
    });
  }
  function nn(A) {
    return d().then((q) => {
      if (!q) throw new Error("IndexedDB is unavailable");
      return T(A._name);
    }).then((q) => {
      if (A.initializationError = null, q && q.schema_version === m)
        A.lastSyncedAt = q.last_synced_at || null, A.totalCount = q.record_count || 0, A.hasCache = q.has_cache === !0 || A.totalCount > 0, A.hasCache && (A.isLoaded = !0, A.canServe = !0, C(A.dom, "ln-data-store:ready", { store: A._name, count: A.totalCount, source: "cache" })), A.isInitialized = !0, C(A.dom, "ln-data-store:initialized", { store: A._name, hasCache: A.hasCache, lastSyncedAt: A.lastSyncedAt, count: A.totalCount });
      else {
        if (q && q.schema_version !== m)
          return S(A._name).then(() => x(A._name, { schema_version: m, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            A.isInitialized = !0, A.hasCache = !1, C(A.dom, "ln-data-store:initialized", { store: A._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        A.isInitialized = !0, A.hasCache = !1, C(A.dom, "ln-data-store:initialized", { store: A._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((q) => (A.isInitialized = !0, A.isLoaded = !1, A.canServe = !1, A.hasCache = !1, A.isSyncing = !1, A.initializationError = q, C(A.dom, "ln-data-store:initialization-error", { store: A._name, error: q }), { ok: !1, error: q }));
  }
  function le(A) {
    A.isSyncing = !0, C(A.dom, "ln-data-store:request-remote-sync", { since: A.lastSyncedAt });
  }
  function ce(A, q) {
    return f().then((I) => I ? (dt() ? Promise.all(q.map((R) => n(R))) : Promise.resolve(q)).then((R) => new Promise((F, H) => {
      const j = I.transaction(A, "readwrite"), V = j.objectStore(A);
      R.forEach((Q) => V.put(Q)), j.oncomplete = () => F(), j.onerror = () => {
        l(j.error), H(j.error);
      };
    })) : void 0);
  }
  function Ut(A, q) {
    return f().then((I) => {
      if (I)
        return new Promise((D, R) => {
          const F = I.transaction(A, "readwrite"), H = F.objectStore(A);
          q.forEach((j) => H.delete(j)), F.oncomplete = () => D(), F.onerror = () => R(F.error);
        });
    });
  }
  function rn(A, q, I) {
    return (dt() ? n(I) : Promise.resolve(I)).then((R) => f().then((F) => {
      if (F)
        return new Promise((H, j) => {
          const V = F.transaction(A, "readwrite"), Q = V.objectStore(A);
          Q.put(R), Q.delete(q), V.oncomplete = () => H(), V.onerror = () => {
            l(V.error), j(V.error);
          };
        });
    }));
  }
  const on = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function sn(A) {
    return A ? Object.keys(A).filter((q) => Array.isArray(A[q]) && A[q].length > 0) : [];
  }
  function an(A, q, I) {
    return q.every((D) => I[D].map(String).includes(String(A[D])));
  }
  function ln(A) {
    return String(A || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function cn(A, q, I) {
    return q.every(
      (D) => I.some((R) => {
        const F = A[R];
        return F != null && String(F).toLowerCase().includes(D);
      })
    );
  }
  function dn(A, q, I) {
    return mi(A, q, I);
  }
  function Et(A, q) {
    return _i(q, A.presenters && A.presenters.computed);
  }
  function un(A) {
    return !A.sort && !dt();
  }
  function hn(A, q, I) {
    const D = sn(q.filters), R = q.search ? ln(q.search) : [], F = A._searchFields, H = R.length > 0 && F && F.length > 0;
    return e(A._name, "readonly").then((j) => j ? new Promise((V, Q) => {
      const et = [], X = j.openCursor();
      X.onsuccess = () => {
        const pt = X.result;
        if (!pt || et.length >= I) {
          V(et);
          return;
        }
        const At = pt.value;
        (!D.length || an(At, D, q.filters)) && (!H || cn(At, R, F)) && et.push(At), pt.continue();
      }, X.onerror = () => Q(X.error);
    }) : []);
  }
  function de(A, q, I) {
    return gi(q, I, A._searchFields, on);
  }
  function ue(A, q, I) {
    const D = [];
    for (let F = q; F < q + I; F++) {
      const H = A._windowIndex.getId(F);
      D.push(H);
    }
    const R = Array.from(new Set(D.filter((F) => F !== void 0)));
    return v(A._name, R).then((F) => {
      const H = /* @__PURE__ */ new Map();
      for (let V = 0; V < F.length; V++) {
        const Q = F[V];
        Q && H.set(String(Q.id), Q);
      }
      const j = [];
      for (let V = 0; V < D.length; V++) {
        const Q = D[V];
        if (Q === void 0)
          j.push(null);
        else {
          const et = H.get(String(Q));
          j.push(et || null);
        }
      }
      return {
        data: Et(A, j),
        total: A._windowIndex.grandTotal,
        filtered: A._windowIndex.logicalTotal,
        offset: q,
        queryGen: A._windowIndex.queryGen
      };
    });
  }
  k.prototype.getAll = function(A = {}) {
    const q = this;
    if (q._windowIndex) {
      const I = A.offset || 0, D = A.limit || 200;
      if (q._windowIndex.ensure(I, I + D, A), !q._windowIndex.hasLoaded && !q.noLocalQuery) {
        const R = I + D, F = (H) => H.length ? {
          data: Et(q, H),
          offset: I,
          queryGen: q._windowIndex.queryGen,
          provisional: !0
        } : ue(q, I, D);
        return un(A) ? hn(q, A, R).then((H) => F(H.slice(I, R))) : o(q._name).then((H) => F(de(q, H, A).records));
      }
      return ue(q, I, D);
    }
    return o(q._name).then((I) => {
      const D = de(q, I, A);
      return {
        data: Et(q, D.records),
        total: D.total,
        filtered: D.filtered
      };
    });
  }, k.prototype.getById = function(A) {
    return p(this._name, A).then((q) => q ? Et(this, [q])[0] : null);
  }, k.prototype.count = function(A) {
    return A && Object.keys(A).length > 0 ? o(this._name).then((I) => _filter(I, A).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, k.prototype.aggregate = function(A, q) {
    return o(this._name).then((I) => dn(I, A, q));
  }, k.prototype.setPresenters = function(A) {
    this.presenters = A;
  }, k.prototype.applySync = function(A, q, I, D) {
    D = D || {};
    const R = this;
    if (R._windowIndex && D.queryGen != null && D.queryGen !== R._windowIndex.queryGen)
      return Promise.resolve();
    A.length > 0 || q.length > 0;
    let F = Promise.resolve();
    return A.length > 0 && (F = F.then(() => ce(R._name, A))), q.length > 0 && (F = F.then(() => Ut(R._name, q))), F.then(() => {
      if (R._windowIndex && (D.offset != null || D.total != null)) {
        const H = D.offset != null ? D.offset : 0, j = A.map((Q) => Q.id), V = R._windowIndex.ingest(H, j, D.total, D.filtered, D.queryGen);
        if (V && V.length) return Ut(R._name, V);
      }
    }).then(() => L(R._name)).then((H) => (R.totalCount = D.total !== void 0 ? D.total : H, R.hasCache = !0, x(R._name, {
      schema_version: m,
      last_synced_at: I,
      has_cache: !0,
      record_count: R.totalCount
    }))).then(() => {
      const H = !R.isLoaded;
      R.isLoaded = !0, R.canServe = !0, R.isSyncing = !1, R.lastSyncedAt = I, H ? (C(R.dom, "ln-data-store:loaded", { store: R._name, count: R.totalCount, meta: D }), C(R.dom, "ln-data-store:ready", { store: R._name, count: R.totalCount, source: "server", meta: D })) : C(R.dom, "ln-data-store:synced", {
        store: R._name,
        added: A.length,
        deleted: q.length,
        changed: !0,
        meta: D
      });
    }).catch((H) => {
      R.isSyncing = !1, console.error("[ln-data-store] applySync failed:", H);
    });
  }, k.prototype.applyQuery = function(A, q) {
    q = q || {};
    const I = this;
    let D = Promise.resolve();
    return A.length > 0 && (D = D.then(() => ce(I._name, A))), D.then(() => L(I._name)).then((R) => (I.totalCount = q.total !== void 0 ? q.total : R, A.length > 0 && (I.canServe = !0), Et(I, A))).catch((R) => (console.error("[ln-data-store] applyQuery failed:", R), []));
  }, k.prototype.forceSync = function() {
    this.isSyncing || le(this);
  }, k.prototype.fullReload = function() {
    const A = this;
    return S(A._name).then(() => x(A._name, {
      schema_version: m,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      A.isLoaded = !1, A.hasCache = !1, A.lastSyncedAt = null, A.totalCount = 0, le(A);
    });
  }, k.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [A, q] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${A}`, q);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [A, q] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(A, q);
      this._queryHandlers = null;
    }
    delete c[this._name], delete this.dom[i], C(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function fn() {
    return f().then((A) => {
      if (!A) return;
      const q = Array.from(A.objectStoreNames);
      return new Promise((I, D) => {
        const R = A.transaction(q, "readwrite");
        q.forEach((F) => R.objectStore(F).clear()), R.oncomplete = () => I(), R.onerror = () => D(R.error);
      });
    }).then(() => {
      Object.values(c).forEach((A) => {
        A.isLoaded = !1, A.canServe = !1, A.isInitialized = !1, A.initializationError = null, A.hasCache = !1, A.isSyncing = !1, A.lastSyncedAt = null, A.totalCount = 0;
      });
    });
  }
  function zt(A) {
    A._windowIndex && A._windowIndex.reset(), C(A.dom, "ln-data-store:query-changed", {
      store: A._name,
      query: {
        filters: Object.assign({}, A.query.filters),
        search: A.query.search,
        sort: A.query.sort ? Object.assign({}, A.query.sort) : null
      }
    });
  }
  function pn(A, q) {
    const I = A[i];
    !I || q !== _ || (I.noLocalQuery = A.hasAttribute(_));
  }
  P(r, i, k, "ln-data-store", {
    extraAttributes: [_],
    onAttributeChange: pn
  }), window[i].clearAll = fn, window[i].init = window[i], window[i].setStorageKey = fe, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = fe);
})();
const bi = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function mt(...r) {
  return r.filter((i) => i != null && i !== "").map((i, _) => {
    const y = String(i);
    return _ === 0 ? y.replace(/\/+$/, "") : y.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function yi(r, i) {
  if (!r || typeof r != "object") return "";
  const _ = Object.assign({}, bi);
  if (i && typeof i == "object")
    for (const u in i)
      i[u] !== void 0 && i[u] !== null && i[u] !== "" && (_[u] = i[u]);
  const y = new URLSearchParams();
  return r.search && y.append(_.search, r.search), r.offset != null && y.append(_.offset, r.offset), r.limit != null && y.append(_.limit, r.limit), r.sort && r.sort.field && r.sort.direction && (y.append(_.sortField, r.sort.field), y.append(_.sortDir, r.sort.direction)), r.filters && typeof r.filters == "object" && Object.keys(r.filters).forEach((u) => {
    const m = r.filters[u];
    Array.isArray(m) && m.length > 0 && y.append(u, m.join(","));
  }), y.toString();
}
function vi(r, i, _) {
  let y = mt(r, i);
  return _ && (y += (y.indexOf("?") !== -1 ? "&" : "?") + _), y;
}
function Ee(r) {
  const i = r && r.content !== void 0 ? r.content : r, _ = r && r.message ? r.message : null;
  return { record: i, message: _ };
}
(function() {
  const r = "data-ln-api-connector", i = "lnApiConnector", _ = "lnConnector";
  if (window[i] !== void 0) return;
  function y(s) {
    return s.ok ? s.status === 204 ? null : s.json() : s.json().catch(() => null).then((c) => {
      const l = new Error("HTTP " + s.status + ": " + s.statusText);
      throw l.status = s.status, l.data = c, l;
    });
  }
  function u(s) {
    return this.dom = s, s[i] = this, s[_] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, m(this), this;
  }
  u.prototype.refreshConfig = function() {
    const s = this.dom;
    this.baseUrl = s.getAttribute("data-ln-api-base-url") || "", this.path = s.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.rawHeaders = s.getAttribute("data-ln-api-headers"), this.headers = Re(this.rawHeaders);
    const c = {}, l = s.getAttribute("data-ln-api-param-offset");
    l && (c.offset = l);
    const b = s.getAttribute("data-ln-api-param-limit");
    b && (c.limit = b);
    const d = s.getAttribute("data-ln-api-param-search");
    d && (c.search = d);
    const g = s.getAttribute("data-ln-api-param-sort-field");
    g && (c.sortField = g);
    const f = s.getAttribute("data-ln-api-param-sort-dir");
    f && (c.sortDir = f), this.paramKeys = c;
    const n = s.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = n !== null ? +n : 300, C(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, u.prototype._reqHeaders = function(s) {
    const c = Object.assign({}, this.headers);
    return !c.Accept && !c.accept && (c.Accept = "application/json"), !c["Content-Type"] && !c["content-type"] && (c["Content-Type"] = "application/json"), s && (c["X-Idempotency-Key"] = s), c;
  }, u.prototype.cancel = function(s) {
    return s && this._inflight.has(s) ? (this._inflight.get(s).abort(), this._inflight.delete(s), !0) : !1;
  }, u.prototype.fetchDelta = function(s, c) {
    const l = this;
    let b = mt(l.baseUrl, l.path);
    s != null && s !== "" && (b += (b.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(s));
    const d = c || "sync";
    l._inflight.has(d) && l._inflight.get(d).abort();
    const g = new AbortController();
    return l._inflight.set(d, g), window.fetch(b, {
      method: "GET",
      headers: l._reqHeaders(),
      credentials: l.credentials,
      signal: g.signal
    }).then(y).finally(function() {
      l._inflight.get(d) === g && l._inflight.delete(d);
    });
  }, u.prototype.query = function(s, c) {
    const l = this, b = yi(s, l.paramKeys), d = vi(l.baseUrl, l.path, b), g = c || "query";
    l._inflight.has(g) && l._inflight.get(g).abort();
    const f = new AbortController();
    return l._inflight.set(g, f), window.fetch(d, {
      method: "GET",
      headers: l._reqHeaders(),
      credentials: l.credentials,
      signal: f.signal
    }).then(y).finally(function() {
      l._inflight.get(g) === f && l._inflight.delete(g);
    });
  }, u.prototype.create = function(s, c, l) {
    const b = this;
    return window.fetch(mt(b.baseUrl, c || b.path), {
      method: "POST",
      headers: b._reqHeaders(l),
      credentials: b.credentials,
      body: JSON.stringify(s)
    }).then(y);
  }, u.prototype.update = function(s, c, l, b, d) {
    const g = this;
    l != null && (c = Object.assign({}, c, { expected_version: l }));
    const f = b ? mt(g.baseUrl, b) : mt(g.baseUrl, g.path, s);
    return window.fetch(f, {
      method: "PUT",
      headers: g._reqHeaders(d),
      credentials: g.credentials,
      body: JSON.stringify(c)
    }).then(y);
  }, u.prototype.delete = function(s, c, l) {
    const b = this;
    return window.fetch(mt(b.baseUrl, c || b.path, s), {
      method: "DELETE",
      headers: b._reqHeaders(l),
      credentials: b.credentials
    }).then(y);
  }, u.prototype.bulkDelete = function(s, c, l) {
    const b = this;
    return window.fetch(mt(b.baseUrl, c || b.path, "bulk-delete"), {
      method: "DELETE",
      headers: b._reqHeaders(l),
      credentials: b.credentials,
      body: JSON.stringify({ ids: s })
    }).then(y);
  };
  function m(s) {
    s._handlers = {
      sync: function(c) {
        const l = c.detail || {}, b = l.meta && l.meta.targetEl ? l.meta.targetEl : null;
        s.fetchDelta(l.since, b).then(function(d) {
          C(s.dom, "ln-api-connector:fetched", { data: d, since: l.since, meta: l.meta || null });
        }).catch(function(d) {
          d && d.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "sync",
            error: d.message,
            status: d.status || 0,
            data: d.data || null,
            since: l.since,
            meta: l.meta || null
          });
        });
      },
      query: function(c) {
        const l = c.detail || {}, b = l.query || l, d = l.meta && l.meta.targetEl ? l.meta.targetEl : null, g = d || "query", f = s.queryDebounce;
        function n(e, t, o) {
          s.query(t, o).then(function(p) {
            const v = p || {};
            C(s.dom, "ln-api-connector:fetched", {
              data: v.data || (Array.isArray(v) ? v : []),
              total: v.total,
              filtered: v.filtered,
              offset: t.offset,
              queryGen: t.queryGen,
              meta: e.meta || null
            });
          }).catch(function(p) {
            p && p.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
              action: "query",
              error: p.message,
              status: p.status || 0,
              data: p.data || null,
              meta: e.meta || null
            });
          });
        }
        if (f === 0) {
          n(l, b, d);
          return;
        }
        s._queryTimers.has(g) && clearTimeout(s._queryTimers.get(g));
        const a = setTimeout(function() {
          s._queryTimers.delete(g), n(l, b, d);
        }, f);
        s._queryTimers.set(g, a);
      },
      cancel: function(c) {
        const l = c.detail || {}, b = l.meta && l.meta.targetEl ? l.meta.targetEl : l.targetEl || l.key;
        b && s.cancel(b);
      },
      create: function(c) {
        const l = c.detail || {};
        s.create(l.data, l.url, l.idempotencyKey).then(function(b) {
          const d = Ee(b);
          C(s.dom, "ln-api-connector:created", {
            record: d.record,
            tempId: l.tempId,
            message: d.message,
            meta: l.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "create",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            tempId: l.tempId,
            meta: l.meta || null
          });
        });
      },
      update: function(c) {
        const l = c.detail || {};
        s.update(l.id, l.data, l.expected_version, l.url, l.idempotencyKey).then(function(b) {
          const d = Ee(b);
          C(s.dom, "ln-api-connector:updated", {
            record: d.record,
            id: l.id,
            message: d.message,
            meta: l.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "update",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            id: l.id,
            conflictData: b.status === 409 ? b.data : null,
            meta: l.meta || null
          });
        });
      },
      delete: function(c) {
        const l = c.detail || {};
        s.delete(l.id, l.url, l.idempotencyKey).then(function(b) {
          const d = b && b.message ? b.message : null;
          C(s.dom, "ln-api-connector:deleted", {
            response: b,
            id: l.id,
            message: d,
            meta: l.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "delete",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            id: l.id,
            meta: l.meta || null
          });
        });
      },
      bulkDelete: function(c) {
        const l = c.detail || {};
        s.bulkDelete(l.ids, l.url, l.idempotencyKey).then(function(b) {
          const d = b && b.message ? b.message : null;
          C(s.dom, "ln-api-connector:bulk-deleted", {
            response: b,
            ids: l.ids,
            message: d,
            meta: l.meta || null
          });
        }).catch(function(b) {
          b && b.name === "AbortError" || C(s.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: b.message,
            status: b.status || 0,
            data: b.data || null,
            ids: l.ids,
            meta: l.meta || null
          });
        });
      }
    }, s.dom.addEventListener("ln-api-connector:request-sync", s._handlers.sync), s.dom.addEventListener("ln-api-connector:request-query", s._handlers.query), s.dom.addEventListener("ln-api-connector:request-fetch", s._handlers.query), s.dom.addEventListener("ln-api-connector:request-cancel", s._handlers.cancel), s.dom.addEventListener("ln-api-connector:request-create", s._handlers.create), s.dom.addEventListener("ln-api-connector:request-update", s._handlers.update), s.dom.addEventListener("ln-api-connector:request-delete", s._handlers.delete), s.dom.addEventListener("ln-api-connector:request-bulk-delete", s._handlers.bulkDelete);
  }
  u.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const s = this;
    s._inflight && (s._inflight.forEach(function(c) {
      c.abort();
    }), s._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(c) {
      c && clearTimeout(c);
    }), this._queryTimers.clear()), this._handlers && (s.dom.removeEventListener("ln-api-connector:request-sync", s._handlers.sync), s.dom.removeEventListener("ln-api-connector:request-query", s._handlers.query), s.dom.removeEventListener("ln-api-connector:request-fetch", s._handlers.query), s.dom.removeEventListener("ln-api-connector:request-cancel", s._handlers.cancel), s.dom.removeEventListener("ln-api-connector:request-create", s._handlers.create), s.dom.removeEventListener("ln-api-connector:request-update", s._handlers.update), s.dom.removeEventListener("ln-api-connector:request-delete", s._handlers.delete), s.dom.removeEventListener("ln-api-connector:request-bulk-delete", s._handlers.bulkDelete), s._handlers = null), C(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[i], delete this.dom[_];
  };
  function h(s) {
    const c = s[i];
    c && c.refreshConfig();
  }
  P(r, i, u, "ln-api-connector", {
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
    onAttributeChange: h
  });
})();
(function() {
  const r = "data-ln-couchdb-connector", i = "lnCouchDbConnector", _ = "lnConnector";
  if (window[i] !== void 0) return;
  function y(g) {
    const f = g && g.content !== void 0 ? g.content : g, n = g && g.message ? g.message : null;
    return { content: f, message: n };
  }
  function u(g) {
    return this.dom = g, g[i] = this, g[_] = this, this.refreshConfig(), this._handlers = null, b(this), this;
  }
  u.prototype.refreshConfig = function() {
    const g = this.dom;
    this.url = g.getAttribute("data-ln-couchdb-url") || "", this.db = g.getAttribute("data-ln-couchdb-db") || "", this.auth = g.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const f = g.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Re(f, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), f.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), C(g, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function m(g, f, n) {
    const a = Object.assign({}, St(g.headers, g.auth), n || {});
    return f && (a["Idempotency-Key"] = f), a;
  }
  u.prototype.fetchDelta = function(g) {
    const f = this, n = ["include_docs=true", "feed=normal"];
    g && n.push("since=" + encodeURIComponent(g));
    const a = ct(f.url, f.db, "_changes") + "?" + n.join("&");
    return window.fetch(a, { method: "GET", headers: St(f.headers, f.auth), credentials: f.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const t = e.results || [];
      return {
        data: t.filter((o) => !o.deleted && o.doc).map((o) => Object.assign({}, o.doc, { id: o.doc._id })),
        deleted: t.filter((o) => o.deleted).map((o) => o.id),
        synced_at: e.last_seq || g || ""
      };
    });
  };
  function h(g, f, n) {
    const a = Object.assign({ _id: f.id }, f);
    return a._id || delete a._id, window.fetch(ct(g.url, g.db), {
      method: "POST",
      headers: m(g, n),
      credentials: g.credentials,
      body: JSON.stringify(a)
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const t = y(e), o = t.content;
      return { record: Object.assign({}, a, { id: o.id, _id: o.id, _rev: o.rev }), message: t.message };
    });
  }
  u.prototype.create = function(g, f) {
    return h(this, g, f).then((n) => n.record);
  };
  function s(g, f, n, a) {
    const e = Object.assign({ id: String(f), _id: String(f) }, n), t = e._rev || e.rev;
    return (t ? Promise.resolve(t) : window.fetch(ct(g.url, g.db, null, f), { method: "GET", headers: St(g.headers, g.auth), credentials: g.credentials }).then((p) => {
      if (!p.ok) throw new Error("Could not retrieve document for revision mapping");
      return p.json().then((v) => v._rev);
    })).then((p) => {
      const v = Object.assign({}, e, { _rev: p });
      delete v.rev;
      const w = m(g, a, { "If-Match": p });
      return window.fetch(ct(g.url, g.db, null, f), {
        method: "PUT",
        headers: w,
        credentials: g.credentials,
        body: JSON.stringify(v)
      }).then((E) => {
        if (E.ok) return E.json().then((S) => {
          const L = y(S);
          return { record: Object.assign({}, v, { _rev: L.content.rev }), message: L.message };
        });
        if (E.status === 409) return E.json().then((S) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = S, L;
        });
        throw new Error("HTTP " + E.status + ": " + E.statusText);
      });
    });
  }
  u.prototype.update = function(g, f, n) {
    return s(this, g, f, n).then((a) => a.record);
  };
  function c(g, f, n, a) {
    return (n ? Promise.resolve(n) : window.fetch(ct(g.url, g.db, null, f), { method: "GET", headers: St(g.headers, g.auth), credentials: g.credentials }).then((t) => {
      if (!t.ok) throw new Error("Could not retrieve document for revision delete");
      return t.json().then((o) => o._rev);
    })).then((t) => {
      const o = ct(g.url, g.db, null, f) + "?rev=" + encodeURIComponent(t);
      return window.fetch(o, { method: "DELETE", headers: m(g, a), credentials: g.credentials }).then((p) => {
        if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
        return p.json();
      }).then((p) => {
        const v = y(p);
        return { response: v.content, message: v.message };
      });
    });
  }
  u.prototype.delete = function(g, f, n) {
    return c(this, g, f, n).then((a) => a.response);
  };
  function l(g, f, n) {
    return !f || f.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(ct(g.url, g.db, "_all_docs"), {
      method: "POST",
      headers: St(g.headers, g.auth),
      credentials: g.credentials,
      body: JSON.stringify({ keys: f })
    }).then((a) => {
      if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
      return a.json();
    }).then((a) => {
      const t = (a.rows || []).filter((o) => !o.error && o.value && o.value.rev).map((o) => ({ _id: o.id, _rev: o.value.rev, _deleted: !0 }));
      return t.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(ct(g.url, g.db, "_bulk_docs"), {
        method: "POST",
        headers: m(g, n),
        credentials: g.credentials,
        body: JSON.stringify({ docs: t })
      }).then((o) => {
        if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
        return o.json();
      }).then((o) => {
        const p = y(o);
        return { response: { ok: !0, results: p.content, deletedCount: t.length }, message: p.message };
      });
    });
  }
  u.prototype.bulkDelete = function(g, f) {
    return l(this, g, f).then((n) => n.response);
  };
  function b(g) {
    g._handlers = {
      sync: function(n) {
        const a = n.detail || {};
        g.fetchDelta(a.since).then(function(e) {
          C(g.dom, "ln-couchdb-connector:fetched", { data: e, since: a.since, meta: a.meta || null });
        }).catch(function(e) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: a.since,
            meta: a.meta || null
          });
        });
      },
      create: function(n) {
        const a = n.detail || {};
        h(g, a.data, a.idempotencyKey).then(function(e) {
          C(g.dom, "ln-couchdb-connector:created", { record: e.record, tempId: a.tempId, message: e.message, meta: a.meta || null });
        }).catch(function(e) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: a.tempId,
            meta: a.meta || null
          });
        });
      },
      update: function(n) {
        const a = n.detail || {}, e = Object.assign({}, a.data);
        a.expected_version !== void 0 && (e._rev = a.expected_version), s(g, a.id, e, a.idempotencyKey).then(function(t) {
          C(g.dom, "ln-couchdb-connector:updated", { record: t.record, id: a.id, message: t.message, meta: a.meta || null });
        }).catch(function(t) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: t.message,
            status: t.status || 0,
            id: a.id,
            data: t.status === 409 ? t.data : null,
            conflictData: t.status === 409 ? t.data : null,
            meta: a.meta || null
          });
        });
      },
      delete: function(n) {
        const a = n.detail || {};
        c(g, a.id, a.rev, a.idempotencyKey).then(function(e) {
          C(g.dom, "ln-couchdb-connector:deleted", { response: e.response, id: a.id, message: e.message, meta: a.meta || null });
        }).catch(function(e) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: a.id,
            meta: a.meta || null
          });
        });
      },
      bulkDelete: function(n) {
        const a = n.detail || {};
        l(g, a.ids, a.idempotencyKey).then(function(e) {
          C(g.dom, "ln-couchdb-connector:bulk-deleted", { response: e.response, ids: a.ids, message: e.message, meta: a.meta || null });
        }).catch(function(e) {
          C(g.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: a.ids,
            meta: a.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector"].forEach(function(n) {
      g.dom.addEventListener(n + ":request-sync", g._handlers.sync), g.dom.addEventListener(n + ":request-fetch", g._handlers.sync), g.dom.addEventListener(n + ":request-create", g._handlers.create), g.dom.addEventListener(n + ":request-update", g._handlers.update), g.dom.addEventListener(n + ":request-delete", g._handlers.delete), g.dom.addEventListener(n + ":request-bulk-delete", g._handlers.bulkDelete);
    });
  }
  u.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const g = this;
    g._handlers && (["ln-couchdb-connector", "ln-api-connector"].forEach(function(n) {
      g.dom.removeEventListener(n + ":request-sync", g._handlers.sync), g.dom.removeEventListener(n + ":request-fetch", g._handlers.sync), g.dom.removeEventListener(n + ":request-create", g._handlers.create), g.dom.removeEventListener(n + ":request-update", g._handlers.update), g.dom.removeEventListener(n + ":request-delete", g._handlers.delete), g.dom.removeEventListener(n + ":request-bulk-delete", g._handlers.bulkDelete);
    }), g._handlers = null), C(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[i], delete this.dom[_];
  };
  function d(g) {
    const f = g[i];
    f && f.refreshConfig();
  }
  P(r, i, u, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: d
  });
})();
function wi(r) {
  return r = r || {}, {
    sort: r.sort,
    filters: r.filters,
    search: r.search,
    offset: r.offset,
    limit: r.limit,
    queryGen: r.queryGen
  };
}
function It(r, i) {
  const _ = !r || !!r.initializationError, y = !!(r && r.noLocalQuery && !r.windowed);
  return i && (_ || !r.canServe || y) ? "remote" : r && !r.initializationError ? "store" : "none";
}
function Ae(r, i) {
  const _ = Object.assign({}, r);
  return i && (_.filters = i.filters, _.search = i.search, _.sort = i.sort), _;
}
class Ei {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(i) {
    return new Promise((_, y) => {
      this._pending.set(i, { resolve: _, reject: y });
    });
  }
  resolve(i) {
    return this._settle(i, !1);
  }
  reject(i) {
    return this._settle(i, !0);
  }
  close(i) {
    const _ = i || new Error("Mutation receipt registry closed");
    for (const y of this._pending.values()) y.reject(_);
    this._pending.clear();
  }
  _settle(i, _) {
    const y = i && i.requestId;
    if (!y) return !1;
    const u = this._pending.get(y);
    return u ? (this._pending.delete(y), _ ? u.reject(i.error || new Error("Store mutation failed")) : u.resolve(i), !0) : !1;
  }
}
(function() {
  const r = "data-ln-data-coordinator", i = "lnDataCoordinator", _ = "lnCoordinator", y = "data-ln-form-scope";
  if (window[i] !== void 0) return;
  const u = /* @__PURE__ */ new Set();
  let m = !1, h = null, s = null, c = null;
  function l() {
    m || (m = !0, h = function() {
      C(document, "ln-data-store:online", {}), u.forEach(function(e) {
        e._maybeSync();
      });
    }, s = function() {
      C(document, "ln-data-store:offline", {});
    }, c = function() {
      document.visibilityState === "visible" && u.forEach(function(e) {
        const t = e.findChildren(), o = t.store;
        o && t.connector && o.isInitialized && !o.initializationError && !o.isSyncing && !e._noAutosync && (!o.hasCache || e._isStale()) && o.forceSync();
      });
    }, window.addEventListener("online", h), window.addEventListener("offline", s), document.addEventListener("visibilitychange", c));
  }
  function b() {
    m && (u.size > 0 || (window.removeEventListener("online", h), window.removeEventListener("offline", s), document.removeEventListener("visibilitychange", c), h = null, s = null, c = null, m = !1));
  }
  function d() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
        const o = Math.random() * 16 | 0;
        return (t === "x" ? o : o & 3 | 8).toString(16);
      });
    }
  }
  const g = ["ln-api-connector", "ln-couchdb-connector"];
  function f(e) {
    return this.dom = e, this._name = e.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", e), e[i] = this, e[_] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Ei(), this._dict = Nt(e, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), n(this), u.add(this), l(), this._checkInitialSync(), this;
  }
  f.prototype._parseStaleAttributes = function() {
    const t = this.findChildren().storeEl, o = this.dom.getAttribute("data-ln-data-coordinator-stale") || (t ? t.getAttribute("data-ln-data-store-stale") : null), p = parseInt(o, 10);
    this._staleThreshold = o === "never" || o === "-1" ? -1 : isNaN(p) ? 300 : p;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (t ? t.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, f.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const t = this.findChildren().store;
    return !t || !t.lastSyncedAt ? !0 : Date.now() / 1e3 - t.lastSyncedAt > this._staleThreshold;
  }, f.prototype._maybeSync = function() {
    const e = this.findChildren(), t = e.store;
    !t || t.initializationError || !e.connector || this._noAutosync || !t.isInitialized || t.isSyncing || (!t.hasCache || this._isStale()) && t.forceSync();
  }, f.prototype._checkInitialSync = function() {
    const e = this, o = this.findChildren().store;
    o && Promise.resolve(o.ready).then(function() {
      const p = e.findChildren(), v = p.store;
      if (v && v.initializationError) {
        e._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !p.connector || e._noAutosync || v.isSyncing || (!v.hasCache || e._isStale()) && v.forceSync();
    }).catch(function(p) {
      e._reportReconciliationError("store-initialize", p, null);
    });
  }, f.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const t = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    t && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(t)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(o) {
      return o;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(o) {
      return o;
    });
  }, f.prototype.findChildren = function() {
    const e = this.dom.querySelector("[data-ln-data-store]"), t = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]"), o = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: e,
      connectorEl: t,
      queueEl: o,
      store: e ? e.lnDataStore || e.lnStore : null,
      connector: t ? t.lnConnector || t.lnApiConnector || t.lnCouchDbConnector : null,
      queue: o ? o.lnApiQueue : null
    };
  }, f.prototype._handleSubmitRecord = function(e) {
    const t = this.findChildren();
    if (!t.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const o = e.data || {}, p = o.id, v = o.expected_version, w = Object.assign({}, o);
    delete w.id, delete w.expected_version;
    const E = e.method.toUpperCase();
    E === "POST" ? this._fanOutCreate(t, w, e.action) : (E === "PUT" || E === "PATCH") && this._fanOutUpdate(t, p, w, v, e.action);
  }, f.prototype._fanOutCreate = function(e, t, o) {
    this.refreshMapper();
    const p = "_temp_" + d();
    C(e.storeEl, "ln-data-store:request-create", { tempId: p, data: t }), e.queue ? C(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: p,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(t),
      expectedVersion: null,
      meta: { tempId: p, action: o }
    }) : e.connector && C(e.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(t),
      url: o,
      meta: { entryId: d(), queued: !1, op: "create", tempId: p }
    });
  }, f.prototype._fanOutUpdate = function(e, t, o, p, v) {
    this.refreshMapper(), C(e.storeEl, "ln-data-store:request-update", { id: t, data: o }), e.queue ? C(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: t,
      op: "update",
      targetId: t,
      payload: this.mapper.egress(o),
      expectedVersion: p,
      meta: { id: t, action: v }
    }) : e.connector && C(e.connectorEl, "ln-api-connector:request-update", {
      id: t,
      data: this.mapper.egress(o),
      expected_version: p,
      url: v,
      meta: { entryId: d(), queued: !1, op: "update", id: t }
    });
  }, f.prototype._fanOutDelete = function(e, t) {
    this.refreshMapper(), C(e.storeEl, "ln-data-store:request-delete", { id: t }), e.queue ? C(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: t,
      op: "delete",
      targetId: t,
      payload: null,
      expectedVersion: null,
      meta: { id: t }
    }) : e.connector && C(e.connectorEl, "ln-api-connector:request-delete", {
      id: t,
      meta: { entryId: d(), queued: !1, op: "delete", id: t }
    });
  }, f.prototype._fanOutBulkDelete = function(e, t) {
    this.refreshMapper();
    const o = t.join(",");
    C(e.storeEl, "ln-data-store:request-bulk-delete", { ids: t }), e.queue ? C(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: t },
      expectedVersion: null,
      meta: { bulkKey: o, ids: t }
    }) : e.connector && C(e.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: t,
      meta: { entryId: d(), queued: !1, op: "bulk-delete", bulkKey: o }
    });
  }, f.prototype._toastFromMessage = function(e) {
    e && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: e.type || "success",
        title: e.title || "",
        message: e.body || ""
      }
    }));
  }, f.prototype._toastFromDict = function(e) {
    const t = this._dict[e];
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: t }
    }));
  }, f.prototype._requestStoreMutation = function(e, t, o) {
    const p = e.storeEl;
    if (!p) return Promise.reject(new Error("Store element not found"));
    const v = d(), w = this._mutationReceipts.wait(v);
    return C(p, "ln-data-store:request-" + t, Object.assign({}, o, { requestId: v })), w;
  }, f.prototype._reportReconciliationError = function(e, t, o) {
    C(this.dom, "ln-data-coordinator:error", {
      operation: e,
      error: t,
      meta: o || null
    });
  };
  function n(e) {
    e._handlers = {
      sync: function(t) {
        e.refreshMapper();
        const o = e.findChildren();
        if (!o.store || !o.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        C(o.connectorEl, "ln-api-connector:request-sync", { since: t.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(t) {
        const o = e.findChildren();
        if (!o.connectorEl) return;
        const p = t.detail || {};
        C(o.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, p.query, {
            offset: p.offset,
            limit: p.limit,
            queryGen: p.queryGen
          })
        });
      },
      reqCreate: function(t) {
        const o = e.findChildren();
        o.storeEl && e._fanOutCreate(o, t.detail.data || {}, t.detail.action);
      },
      reqUpdate: function(t) {
        const o = e.findChildren();
        o.storeEl && e._fanOutUpdate(o, t.detail.id, t.detail.data || {}, t.detail.expected_version, t.detail.action);
      },
      reqDelete: function(t) {
        const o = e.findChildren();
        o.storeEl && e._fanOutDelete(o, t.detail.id);
      },
      reqBulkDelete: function(t) {
        const o = e.findChildren();
        o.storeEl && e._fanOutBulkDelete(o, t.detail.ids || []);
      },
      queueFailed: function() {
        e._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(t) {
        e.refreshMapper();
        const o = e.findChildren();
        if (!o.store || !o.connector || !o.queue) return;
        const p = t.detail || {}, v = p.entryId, w = p.op, E = p.targetId, S = p.payload, L = p.expectedVersion, T = p.meta || {}, x = T.action || null, k = p.idempotencyKey || v;
        w === "create" ? C(o.connectorEl, "ln-api-connector:request-create", {
          data: S,
          url: x,
          idempotencyKey: k,
          meta: { entryId: v, queued: !0, op: "create", tempId: T.tempId }
        }) : w === "update" ? C(o.connectorEl, "ln-api-connector:request-update", {
          id: E,
          data: S,
          expected_version: L,
          url: x,
          idempotencyKey: k,
          meta: { entryId: v, queued: !0, op: "update", id: E }
        }) : w === "delete" ? C(o.connectorEl, "ln-api-connector:request-delete", {
          id: E,
          idempotencyKey: k,
          meta: { entryId: v, queued: !0, op: "delete", id: E }
        }) : w === "bulk-delete" ? C(o.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: S && S.ids ? S.ids : [],
          idempotencyKey: k,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: T.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", w);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(t) {
        const o = t.target;
        if (t.defaultPrevented) return;
        const p = o.hasAttribute(y) ? o.getAttribute(y) : null;
        if (p === null) return;
        let v;
        if (p ? v = p === e._name : v = o.closest("[data-ln-data-coordinator]") === e.dom, !v) return;
        const w = yn(o);
        if (w !== "POST" && w !== "PUT" && w !== "PATCH") return;
        t.preventDefault();
        const E = xe(o);
        delete E._method, delete E._token, e._handleSubmitRecord({ data: E, method: w, action: o.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(t) {
        const o = t.detail.meta || {}, p = e.findChildren();
        e.refreshMapper();
        const v = t.detail.data;
        let w = [], E = [], S = null;
        Array.isArray(v) ? (w = v, S = Math.floor(Date.now() / 1e3)) : v && (w = Array.isArray(v.data) ? v.data : [], E = Array.isArray(v.deleted) ? v.deleted : [], S = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const L = w.map((T) => e.mapper.ingress(T));
        if (p.store && !p.store.initializationError)
          o.kind ? o.kind === "table" || o.kind === "list" || o.kind === "chart" ? p.store.applyQuery(L, { total: t.detail.total }).then(function(T) {
            C(o.targetEl, "ln-" + o.kind + ":set-loading", { loading: !1 }), C(o.targetEl, "ln-" + o.kind + ":set-data", {
              data: T,
              total: t.detail.total !== void 0 ? t.detail.total : T.length,
              filtered: t.detail.filtered !== void 0 ? t.detail.filtered : T.length,
              offset: t.detail.offset,
              queryGen: t.detail.queryGen
            }), e._boundDelivered.set(o.targetEl, !0);
          }) : o.kind === "options" ? p.store.applyQuery(L, { total: t.detail.total }).then(function() {
            return p.store.getAll({});
          }).then(function(T) {
            C(o.targetEl, "ln-options:set-data", { data: T.data });
          }) : o.kind === "stat" && p.store.applyQuery(L, { total: t.detail.total }).then(function() {
            const T = t.detail.filtered !== void 0 ? t.detail.filtered : t.detail.total !== void 0 ? t.detail.total : L.length;
            C(o.targetEl, "ln-stat:set-count", { count: T });
          }) : p.store.applySync(L, E, S || Math.floor(Date.now() / 1e3), {
            total: t.detail.total,
            filtered: t.detail.filtered,
            offset: t.detail.offset,
            queryGen: t.detail.queryGen,
            targetEl: o.targetEl
          });
        else if (o.targetEl && o.kind) {
          if (o.kind === "table" || o.kind === "list" || o.kind === "chart")
            C(o.targetEl, "ln-" + o.kind + ":set-loading", { loading: !1 }), C(o.targetEl, "ln-" + o.kind + ":set-data", {
              data: L,
              total: t.detail.total !== void 0 ? t.detail.total : L.length,
              filtered: t.detail.filtered !== void 0 ? t.detail.filtered : L.length,
              offset: t.detail.offset,
              queryGen: t.detail.queryGen
            }), e._boundDelivered.set(o.targetEl, !0);
          else if (o.kind === "options")
            C(o.targetEl, "ln-options:set-data", { data: L });
          else if (o.kind === "stat") {
            const T = t.detail.filtered !== void 0 ? t.detail.filtered : t.detail.total !== void 0 ? t.detail.total : L.length;
            C(o.targetEl, "ln-stat:set-count", { count: T });
          }
        }
      },
      connCreated: function(t) {
        const o = e.findChildren();
        if (!o.storeEl) return;
        const p = t.detail.meta || {}, v = e.mapper.ingress(t.detail.record);
        e._requestStoreMutation(o, "update", { id: p.tempId, data: v }).then(function() {
          e._toastFromMessage(t.detail.message), p.queued && o.queue && C(o.queueEl, "ln-api-queue:resolve-create", {
            entryId: p.entryId,
            oldKey: p.tempId,
            newId: v.id
          });
        }).catch(function(w) {
          e._reportReconciliationError("create-reconcile", w, p);
        });
      },
      connUpdated: function(t) {
        const o = e.findChildren();
        if (!o.storeEl) return;
        const p = t.detail.meta || {}, v = e.mapper.ingress(t.detail.record);
        e._requestStoreMutation(o, "update", { id: p.id, data: v }).then(function() {
          e._toastFromMessage(t.detail.message), p.queued && o.queue && C(o.queueEl, "ln-api-queue:ack", { entryId: p.entryId });
        }).catch(function(w) {
          e._reportReconciliationError("update-reconcile", w, p);
        });
      },
      connDeleted: function(t) {
        const o = e.findChildren();
        if (!o.storeEl) return;
        const p = t.detail.meta || {};
        e._toastFromMessage(t.detail.message), p.queued && o.queue && C(o.queueEl, "ln-api-queue:ack", { entryId: p.entryId });
      },
      connBulkDeleted: function(t) {
        const o = e.findChildren();
        if (!o.storeEl) return;
        const p = t.detail.meta || {};
        e._toastFromMessage(t.detail.message), p.queued && o.queue && C(o.queueEl, "ln-api-queue:ack", { entryId: p.entryId });
      },
      connError: function(t) {
        const o = t.detail || {}, p = o.meta || {}, v = p.op || o.action, w = o.status || 0, E = e.findChildren();
        if (v === "sync") {
          E.storeEl && C(E.storeEl, "ln-data-store:request-sync-failed", {
            error: o.error,
            status: w
          }), console.error("[ln-data-coordinator] Sync failed:", o.error);
          return;
        }
        if (v === "query") {
          p.targetEl && p.kind && (C(p.targetEl, "ln-" + p.kind + ":set-loading", { loading: !1 }), (p.kind === "table" || p.kind === "list") && C(p.targetEl, "ln-" + p.kind + ":page-failed", { offset: p.offset })), e._reportReconciliationError("query", o.error || o, p);
          return;
        }
        if (!E.storeEl) return;
        const S = w === 401 || w === 419, L = w === 0 || w >= 500, T = w === 409 || w === 412;
        if (S) {
          e._toastFromDict("auth"), p.queued && E.queue && C(E.queueEl, "ln-api-queue:nack", { entryId: p.entryId, reason: "auth" });
          return;
        }
        if (L) {
          p.queued && E.queue ? C(E.queueEl, "ln-api-queue:nack", { entryId: p.entryId, reason: "retry" }) : e._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (T && v === "update") {
          const k = o.data && o.data.remote ? e.mapper.ingress(o.data.remote) : null;
          k && (x = e._requestStoreMutation(E, "update", { id: p.id, data: k })), e._toastFromDict("conflict");
        } else v === "create" && (x = e._requestStoreMutation(E, "delete", { id: p.tempId })), e._toastFromDict("rejected");
        p.queued && E.queue ? x.then(function() {
          C(E.queueEl, "ln-api-queue:nack", { entryId: p.entryId, reason: "drop" });
        }).catch(function(k) {
          e._reportReconciliationError("deterministic-reconcile", k, p);
        }) : x.catch(function(k) {
          e._reportReconciliationError("deterministic-reconcile", k, p);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(t) {
        const o = e.findChildren(), p = o.store;
        if (!p || p.initializationError || !o.connector || e._noAutosync || p.isSyncing) return;
        (t.detail || {}).hasCache ? e._isStale() && p.forceSync() : p.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(t) {
        e._serveData(t, "table");
      },
      reqListData: function(t) {
        e._serveData(t, "list");
      },
      reqChartData: function(t) {
        e._serveData(t, "chart");
      },
      reqOptions: function(t) {
        e._serveOptions(t);
      },
      reqStat: function(t) {
        e._serveStat(t);
      },
      refreshQuery: function() {
        e._refreshAll(null, !0);
      },
      refresh: function(t) {
        e._mutationReceipts.resolve(t.detail), e._refreshAll(null, !1);
      },
      mutationError: function(t) {
        e._mutationReceipts.reject(t.detail);
      },
      refreshSynced: function(t) {
        t.detail && t.detail.changed && e._refreshAll(t.detail.meta, !1);
      }
    }, e.dom.addEventListener("ln-data-store:request-remote-sync", e._handlers.sync), e.dom.addEventListener("ln-data-store:request-page", e._handlers.requestPage), e.dom.addEventListener("ln-data-coordinator:request-create", e._handlers.reqCreate), e.dom.addEventListener("ln-data-coordinator:request-update", e._handlers.reqUpdate), e.dom.addEventListener("ln-data-coordinator:request-delete", e._handlers.reqDelete), e.dom.addEventListener("ln-data-coordinator:request-bulk-delete", e._handlers.reqBulkDelete), e.dom.addEventListener("ln-api-queue:send", e._handlers.queueSend), e.dom.addEventListener("ln-api-queue:failed", e._handlers.queueFailed), e.dom.addEventListener("ln-data-store:initialized", e._handlers.storeInitialized), document.addEventListener("submit", e._handlers.formSubmit), g.forEach(function(t) {
      e.dom.addEventListener(t + ":fetched", e._handlers.connFetched), e.dom.addEventListener(t + ":created", e._handlers.connCreated), e.dom.addEventListener(t + ":updated", e._handlers.connUpdated), e.dom.addEventListener(t + ":deleted", e._handlers.connDeleted), e.dom.addEventListener(t + ":bulk-deleted", e._handlers.connBulkDeleted), e.dom.addEventListener(t + ":error", e._handlers.connError);
    }), document.addEventListener("ln-table:request-data", e._handlers.reqTableData), document.addEventListener("ln-list:request-data", e._handlers.reqListData), document.addEventListener("ln-chart:request-data", e._handlers.reqChartData), document.addEventListener("ln-options:request-data", e._handlers.reqOptions), document.addEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.addEventListener("ln-data-store:ready", e._handlers.refresh), e.dom.addEventListener("ln-data-store:created", e._handlers.refresh), e.dom.addEventListener("ln-data-store:updated", e._handlers.refresh), e.dom.addEventListener("ln-data-store:deleted", e._handlers.refresh), e.dom.addEventListener("ln-data-store:mutation-error", e._handlers.mutationError), e.dom.addEventListener("ln-data-store:synced", e._handlers.refreshSynced), e.dom.addEventListener("ln-data-store:query-changed", e._handlers.refreshQuery);
  }
  f.prototype._ownsStore = function(e) {
    const t = this.findChildren();
    return !!(t.store && t.store._name === e && e);
  }, f.prototype._serveData = function(e, t) {
    const o = e.target, p = t === "table" ? "data-ln-table-source" : t === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = o.getAttribute(p);
    if (!v || !this._ownsStore(v)) return;
    const w = e.detail || {}, E = wi(w);
    this._boundQueries.set(o, E);
    const S = this.findChildren(), L = this, T = S.store;
    return (T && T.ready ? T.ready : Promise.resolve()).then(function() {
      const k = It(T, S.connector), O = Ae(E, T && T.query);
      if (k === "remote") {
        C(o, "ln-" + t + ":set-loading", { loading: !0 }), C(S.connectorEl, "ln-api-connector:request-query", {
          query: O,
          meta: { targetEl: o, kind: t, offset: O.offset, limit: O.limit }
        });
        return;
      }
      if (k !== "store") {
        C(o, "ln-" + t + ":set-loading", { loading: !1 });
        return;
      }
      return T.getAll(O).then(function(M) {
        const N = {
          data: M.data,
          total: M.total,
          filtered: M.filtered,
          offset: w.offset !== void 0 ? w.offset : M.offset,
          queryGen: w.queryGen !== void 0 ? w.queryGen : M.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: M.provisional === !0
        };
        C(o, "ln-" + t + ":set-data", N), L._boundDelivered.set(o, !0);
      });
    }).catch(function(k) {
      C(o, "ln-" + t + ":set-loading", { loading: !1 }), C(L.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: t,
        store: v,
        target: o,
        error: k
      });
    });
  }, f.prototype._serveOptions = function(e) {
    const t = e.target, o = t.getAttribute("data-ln-options");
    if (!this._ownsStore(o)) return;
    const p = this.findChildren(), v = p.store, w = v && v.ready ? v.ready : Promise.resolve(), E = this;
    return w.then(function() {
      const S = It(v, p.connector);
      if (S === "remote") {
        C(p.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: t, kind: "options" }
        });
        return;
      }
      if (S === "store")
        return v.getAll({}).then(function(L) {
          C(t, "ln-options:set-data", { data: L.data });
        });
    }).catch(function(S) {
      E._reportReconciliationError("options-query", S, { targetEl: t, kind: "options" });
    });
  }, f.prototype._serveStat = function(e) {
    const t = e.target, o = t.getAttribute("data-ln-stat");
    if (!this._ownsStore(o)) return;
    const p = e.detail && e.detail.filters ? e.detail.filters : null, v = this.findChildren(), w = v.store, E = w && w.ready ? w.ready : Promise.resolve(), S = this;
    return E.then(function() {
      const L = p && Object.keys(p).length > 0, x = !!(v.connector && w && ((w.windowed || w._windowIndex) && L || w.noLocalQuery)) ? "remote" : It(w, v.connector);
      if (x === "remote") {
        C(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: p },
          meta: { targetEl: t, kind: "stat" }
        });
        return;
      }
      if (x === "store")
        return w.count(p).then(function(k) {
          C(t, "ln-stat:set-count", { count: k });
        });
    }).catch(function(L) {
      S._reportReconciliationError("stat-query", L, { targetEl: t, kind: "stat" });
    });
  }, f.prototype._refreshAll = function(e, t) {
    const o = this, p = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let v = 0; v < p.length; v++) {
      const w = p[v];
      let E, S;
      if (w.hasAttribute("data-ln-table-source") ? (E = w.getAttribute("data-ln-table-source"), S = "table") : w.hasAttribute("data-ln-list-source") ? (E = w.getAttribute("data-ln-list-source"), S = "list") : w.hasAttribute("data-ln-chart-source") ? (E = w.getAttribute("data-ln-chart-source"), S = "chart") : w.hasAttribute("data-ln-options") ? (E = w.getAttribute("data-ln-options"), S = "options") : w.hasAttribute("data-ln-stat") && (E = w.getAttribute("data-ln-stat"), S = "stat"), !o._ownsStore(E)) continue;
      const L = o.findChildren(), T = L.store;
      if (S === "table" || S === "list") {
        const x = S === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (w.hasAttribute(x)) {
          C(w, "ln-" + S + (t ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (S === "table" || S === "list" || S === "chart") {
        const x = o._boundQueries.get(w) || { sort: null, filters: {}, search: "" }, k = Ae(x, T.query);
        if (It(T, L.connector) === "remote") {
          C(w, "ln-" + S + ":set-loading", { loading: !0 }), C(L.connectorEl, "ln-api-connector:request-query", {
            query: k,
            meta: { targetEl: w, kind: S, offset: k.offset, limit: k.limit }
          });
          continue;
        }
        (function(O, M) {
          T.getAll(k).then(function(N) {
            const K = {
              data: N.data,
              total: e && e.total !== void 0 ? e.total : N.total,
              filtered: e && e.filtered !== void 0 ? e.filtered : N.filtered,
              offset: N.offset !== void 0 ? N.offset : e && e.offset !== void 0 ? e.offset : x.offset,
              queryGen: N.queryGen !== void 0 ? N.queryGen : e && e.queryGen !== void 0 ? e.queryGen : x.queryGen
            };
            C(O, "ln-" + M + ":set-loading", { loading: !1 }), C(O, "ln-" + M + ":set-data", K), o._boundDelivered.set(O, !0);
          });
        })(w, S);
      } else if (S === "options")
        (function(x) {
          T.getAll({}).then(function(k) {
            C(x, "ln-options:set-data", { data: k.data });
          });
        })(w);
      else if (S === "stat") {
        const x = w.getAttribute("data-ln-stat-filter");
        let k = null;
        if (x) {
          const O = x.indexOf(":");
          if (O !== -1) {
            const M = x.slice(0, O), N = x.slice(O + 1);
            k = {}, k[M] = [N];
          }
        }
        (function(O, M) {
          T.count(M).then(function(N) {
            C(O, "ln-stat:set-count", { count: N });
          });
        })(w, k);
      }
    }
  }, f.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const e = this;
    e._handlers && (e.dom.removeEventListener("ln-data-store:request-remote-sync", e._handlers.sync), e.dom.removeEventListener("ln-data-store:request-page", e._handlers.requestPage), e.dom.removeEventListener("ln-data-coordinator:request-create", e._handlers.reqCreate), e.dom.removeEventListener("ln-data-coordinator:request-update", e._handlers.reqUpdate), e.dom.removeEventListener("ln-data-coordinator:request-delete", e._handlers.reqDelete), e.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", e._handlers.reqBulkDelete), e.dom.removeEventListener("ln-api-queue:send", e._handlers.queueSend), e.dom.removeEventListener("ln-api-queue:failed", e._handlers.queueFailed), e.dom.removeEventListener("ln-data-store:initialized", e._handlers.storeInitialized), document.removeEventListener("submit", e._handlers.formSubmit), g.forEach(function(t) {
      e.dom.removeEventListener(t + ":fetched", e._handlers.connFetched), e.dom.removeEventListener(t + ":created", e._handlers.connCreated), e.dom.removeEventListener(t + ":updated", e._handlers.connUpdated), e.dom.removeEventListener(t + ":deleted", e._handlers.connDeleted), e.dom.removeEventListener(t + ":bulk-deleted", e._handlers.connBulkDeleted), e.dom.removeEventListener(t + ":error", e._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", e._handlers.reqTableData), document.removeEventListener("ln-list:request-data", e._handlers.reqListData), document.removeEventListener("ln-chart:request-data", e._handlers.reqChartData), document.removeEventListener("ln-options:request-data", e._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.removeEventListener("ln-data-store:ready", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:created", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:updated", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:deleted", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:mutation-error", e._handlers.mutationError), e.dom.removeEventListener("ln-data-store:synced", e._handlers.refreshSynced), e.dom.removeEventListener("ln-data-store:query-changed", e._handlers.refreshQuery), e._handlers = null), e._boundQueries = null, e._boundDelivered = null, e._mutationReceipts.close(new Error("Data coordinator destroyed")), e._mutationReceipts = null, u.delete(this), b(), delete this.dom[i], delete this.dom[_];
  };
  function a(e, t) {
    const o = e[i];
    o && t === "data-ln-data-mapper" && o.refreshMapper();
  }
  P(r, i, f, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: a
  });
})();
const Ai = "ln_api_queue", Si = 2, $ = "outbox", J = "_queue_meta";
function tt(r, i) {
  return r.error || new Error(i);
}
function yt(r, i) {
  return r.bound([i, -1 / 0], [i, 1 / 0]);
}
function Se(r) {
  return "seq:" + r;
}
function Dt(r) {
  return "paused:" + r;
}
function Ce(r) {
  r.leaseOwner = null, r.leaseUntil = 0;
}
function Ci(r, i, _) {
  return typeof r != "string" || r.indexOf(i) === -1 ? r : r.split(i).join(_);
}
function Li(r, i, _, y) {
  const u = /* @__PURE__ */ new Map(), m = [], h = [];
  for (const s of r || [])
    u.has(s.chainKey) || u.set(s.chainKey, []), u.get(s.chainKey).push(s);
  return u.forEach((s, c) => {
    s.sort((b, d) => b.seq - d.seq);
    const l = s[0];
    if (!(!l || l.status === "failed")) {
      if (l.status === "inflight" && (l.leaseUntil || 0) > y) {
        h.push({ chainKey: c, at: l.leaseUntil });
        return;
      }
      if ((l.nextAttemptAt || 0) > y) {
        h.push({ chainKey: c, at: l.nextAttemptAt });
        return;
      }
      l.status = "inflight", l.leaseOwner = i, l.leaseUntil = y + _, l.updatedAt = y, m.push(l);
    }
  }), { entries: m, wakeups: h };
}
function Ti(r, i, _, y, u) {
  const m = [], h = [];
  for (const s of r || []) {
    if (s.entryId === i) {
      h.push(s.entryId);
      continue;
    }
    s.chainKey === _ && (s.chainKey = y, s.targetId === _ && (s.targetId = y), s.meta && s.meta.id === _ && (s.meta.id = y), s.meta && typeof s.meta.action == "string" && (s.meta.action = Ci(s.meta.action, _, y)), s.updatedAt = u, m.push(s));
  }
  return { changed: m, deleted: h };
}
class qi {
  constructor(i) {
    i = i || {}, this.indexedDB = i.indexedDB || globalThis.indexedDB, this.keyRange = i.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = i.dbName || Ai, this.now = i.now || (() => Date.now()), this.uuid = i.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((i, _) => {
      const y = this.indexedDB.open(this.dbName, Si);
      y.onupgradeneeded = (u) => {
        const m = u.target.result;
        let h;
        m.objectStoreNames.contains($) ? h = u.target.transaction.objectStore($) : h = m.createObjectStore($, { keyPath: "entryId" }), h.indexNames.contains("by_scope_chain") || h.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), h.indexNames.contains("by_scope_seq") || h.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(J) || m.createObjectStore(J, { keyPath: "key" });
      }, y.onerror = () => _(tt(y, "Queue database open failed")), y.onsuccess = (u) => {
        this._db = u.target.result, this._db.onversionchange = () => this.close(), i(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((i, _) => {
      const y = this.indexedDB.deleteDatabase(this.dbName);
      y.onsuccess = () => i(), y.onerror = () => _(tt(y, "Queue database delete failed")), y.onblocked = () => _(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(i) {
    return this.open().then((_) => _ ? new Promise((y, u) => {
      const h = _.transaction($, "readonly").objectStore($).index("by_scope_seq").getAll(yt(this.keyRange, i));
      h.onsuccess = () => y(h.result || []), h.onerror = () => u(tt(h, "Queue scope read failed"));
    }) : []);
  }
  enqueue(i, _) {
    return _ = _ || {}, this.open().then((y) => y ? new Promise((u, m) => {
      const h = y.transaction([J, $], "readwrite"), s = h.objectStore(J), c = h.objectStore($), l = Se(i);
      let b = null;
      const d = (f) => {
        const n = f + 1;
        b = {
          entryId: this.uuid(),
          scope: i,
          chainKey: _.chainKey,
          seq: n,
          op: _.op,
          targetId: _.targetId !== void 0 ? _.targetId : null,
          payload: _.payload,
          expectedVersion: _.expectedVersion !== void 0 ? _.expectedVersion : null,
          meta: _.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, s.put({ key: l, value: n }), c.put(b);
      }, g = s.get(l);
      g.onerror = () => m(tt(g, "Queue sequence read failed")), g.onsuccess = () => {
        const f = g.result;
        if (f && typeof f.value == "number") {
          d(f.value);
          return;
        }
        const n = c.index("by_scope_seq").getAll(yt(this.keyRange, i));
        n.onerror = () => m(tt(n, "Queue sequence migration failed")), n.onsuccess = () => {
          const a = (n.result || []).reduce((e, t) => Math.max(e, t.seq || 0), 0);
          d(a);
        };
      }, h.oncomplete = () => u(b), h.onerror = () => m(h.error || new Error("Queue enqueue transaction failed")), h.onabort = () => m(h.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(i, _, y) {
    return this.open().then((u) => u ? new Promise((m, h) => {
      const s = u.transaction($, "readwrite"), c = s.objectStore($), l = c.index("by_scope_seq").getAll(yt(this.keyRange, i)), b = this.now();
      let d = { entries: [], wakeups: [] };
      l.onerror = () => h(tt(l, "Queue claim read failed")), l.onsuccess = () => {
        d = Li(l.result || [], _, y, b);
        for (const g of d.entries) c.put(g);
      }, s.oncomplete = () => m(d), s.onerror = () => h(s.error || new Error("Queue claim transaction failed")), s.onabort = () => h(s.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(i, _) {
    return this._updateEntry(i, _, (y, u) => (u.delete(y.entryId), { status: "acked", entry: y }));
  }
  nack(i, _, y, u) {
    u = u || {};
    const m = u.maxAttempts || 8, h = u.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((s) => s ? new Promise((c, l) => {
      const b = s.transaction([$, J], "readwrite"), d = b.objectStore($), g = b.objectStore(J), f = d.get(_);
      let n = null;
      f.onerror = () => l(tt(f, "Queue nack read failed")), f.onsuccess = () => {
        const a = f.result;
        if (!(!a || a.scope !== i)) {
          if (y === "drop") {
            d.delete(a.entryId), n = { status: "dropped", entry: a };
            return;
          }
          if (Ce(a), a.updatedAt = this.now(), y === "auth") {
            a.status = "pending", d.put(a), g.put({ key: Dt(i), value: "auth" }), n = { status: "auth", entry: a };
            return;
          }
          if (y === "retry") {
            if (a.attempts = (a.attempts || 0) + 1, a.attempts >= m) {
              a.status = "failed", a.nextAttemptAt = 0, d.put(a), n = { status: "failed", entry: a };
              return;
            }
            const e = h[Math.min(a.attempts - 1, h.length - 1)];
            a.status = "pending", a.nextAttemptAt = this.now() + e, d.put(a), n = { status: "retry", entry: a, delay: e };
          }
        }
      }, b.oncomplete = () => c(n), b.onerror = () => l(b.error || new Error("Queue nack transaction failed")), b.onabort = () => l(b.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(i, _, y) {
    return this._remapTransaction(i, null, _, y);
  }
  resolveCreate(i, _, y, u) {
    return this._remapTransaction(i, _, y, u);
  }
  _remapTransaction(i, _, y, u) {
    return this.open().then((m) => m ? new Promise((h, s) => {
      const c = m.transaction($, "readwrite"), l = c.objectStore($), b = l.index("by_scope_seq").getAll(yt(this.keyRange, i));
      let d = { changed: [], deleted: [] };
      b.onerror = () => s(tt(b, "Queue remap read failed")), b.onsuccess = () => {
        d = Ti(b.result || [], _, y, u, this.now());
        for (const g of d.deleted) l.delete(g);
        for (const g of d.changed) l.put(g);
      }, c.oncomplete = () => h(d.changed), c.onerror = () => s(c.error || new Error("Queue remap transaction failed")), c.onabort = () => s(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(i) {
    return this.open().then((_) => _ ? new Promise((y, u) => {
      const m = _.transaction($, "readwrite"), h = m.objectStore($), s = h.index("by_scope_seq").getAll(yt(this.keyRange, i));
      let c = 0;
      s.onerror = () => u(tt(s, "Queue failed-entry read failed")), s.onsuccess = () => {
        for (const l of s.result || [])
          l.status === "failed" && (l.status = "pending", l.attempts = 0, l.nextAttemptAt = 0, l.updatedAt = this.now(), Ce(l), h.put(l), c++);
      }, m.oncomplete = () => y(c), m.onerror = () => u(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => u(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(i) {
    return this.open().then((_) => _ ? new Promise((y, u) => {
      const h = _.transaction(J, "readonly").objectStore(J).get(Dt(i));
      h.onsuccess = () => {
        const s = h.result ? h.result.value : !1;
        y(s || !1);
      }, h.onerror = () => u(tt(h, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(i, _) {
    return this.open().then((y) => {
      if (y)
        return new Promise((u, m) => {
          const h = y.transaction(J, "readwrite"), s = typeof _ == "string" ? _ : _ ? "manual" : !1;
          h.objectStore(J).put({ key: Dt(i), value: s }), h.oncomplete = () => u(), h.onerror = () => m(h.error || new Error("Queue pause-state write failed")), h.onabort = () => m(h.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(i) {
    return this.open().then((_) => {
      if (_)
        return new Promise((y, u) => {
          const m = _.transaction([$, J], "readwrite"), s = m.objectStore($).index("by_scope_seq").openCursor(yt(this.keyRange, i));
          s.onsuccess = (c) => {
            const l = c.target.result;
            l && (l.delete(), l.continue());
          }, s.onerror = () => u(tt(s, "Queue clear failed")), m.objectStore(J).delete(Se(i)), m.objectStore(J).delete(Dt(i)), m.oncomplete = () => y(), m.onerror = () => u(m.error || new Error("Queue clear transaction failed")), m.onabort = () => u(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(i, _, y) {
    return this.open().then((u) => u ? new Promise((m, h) => {
      const s = u.transaction($, "readwrite"), c = s.objectStore($), l = c.get(_);
      let b = null;
      l.onerror = () => h(tt(l, "Queue entry read failed")), l.onsuccess = () => {
        const d = l.result;
        !d || d.scope !== i || (b = y(d, c));
      }, s.oncomplete = () => m(b), s.onerror = () => h(s.error || new Error("Queue entry transaction failed")), s.onabort = () => h(s.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const r = "data-ln-api-queue", i = "lnApiQueue", _ = [2e3, 5e3, 15e3, 6e4, 3e5], y = 8, u = 6e4;
  if (window[i] !== void 0) return;
  function m() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (b) => {
        const d = Math.random() * 16 | 0;
        return (b === "x" ? d : d & 3 | 8).toString(16);
      });
    }
  }
  const h = new qi({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: m
  });
  function s(l) {
    this.dom = l, l[i] = this;
    const b = l.closest("[data-ln-data-coordinator]");
    this.scope = l.id || (b ? b.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = m(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const d = this;
    return h.open().then((g) => g ? h.getPaused(d.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((g) => {
      if (d._paused = !!g, d._paused) {
        const f = typeof g == "string" ? g : "auth";
        C(d.dom, "ln-api-queue:paused", { reason: f, restored: !0 });
      }
      return d._emitPendingCount();
    }).then(() => d._drain()).catch((g) => {
      console.error("[ln-api-queue] Initialization failed:", g), C(d.dom, "ln-api-queue:error", { operation: "initialize", error: g });
    }), this;
  }
  s.prototype._isOnline = function() {
    const l = this.dom.getAttribute("data-ln-api-queue-online");
    return l === "true" ? !0 : l === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const l = this;
    return h.allForScope(l.scope).then((b) => (C(l.dom, "ln-api-queue:pending-count", { count: b.length, scope: l.scope }), b.length === 0 && C(l.dom, "ln-api-queue:drained", { scope: l.scope }), b));
  }, s.prototype._clearTimer = function(l) {
    const b = this._timers.get(l);
    b && (clearTimeout(b), this._timers.delete(l));
  }, s.prototype._scheduleTimer = function(l, b) {
    const d = Math.max(0, b), g = this._timers.get(l);
    g && clearTimeout(g);
    const f = this, n = setTimeout(() => {
      f._timers.delete(l), f._drain();
    }, d);
    this._timers.set(l, n);
  }, s.prototype._drain = function() {
    const l = this;
    return l._paused || !l._isOnline() ? Promise.resolve() : (l._drainPromise || (l._drainPromise = h.claimReady(l.scope, l._workerId, u).then((b) => {
      for (const d of b.wakeups)
        l._scheduleTimer(d.chainKey, d.at - Date.now());
      for (const d of b.entries)
        l._clearTimer(d.chainKey), C(l.dom, "ln-api-queue:send", {
          entryId: d.entryId,
          chainKey: d.chainKey,
          op: d.op,
          targetId: d.targetId,
          payload: d.payload,
          expectedVersion: d.expectedVersion,
          idempotencyKey: d.entryId,
          meta: d.meta
        });
    }).catch((b) => {
      console.error("[ln-api-queue] Drain failed:", b), C(l.dom, "ln-api-queue:error", { operation: "drain", error: b });
    }).finally(() => {
      l._drainPromise = null;
    })), l._drainPromise);
  }, s.prototype._onEnqueue = function(l) {
    const b = this;
    return h.enqueue(b.scope, l.detail || {}).then((d) => {
      if (d)
        return b._emitPendingCount().then((g) => (C(b.dom, "ln-api-queue:enqueued", {
          entryId: d.entryId,
          chainKey: d.chainKey,
          count: g.length
        }), b._drain()));
    }).catch((d) => {
      C(b.dom, "ln-api-queue:error", { operation: "enqueue", error: d });
    });
  }, s.prototype._onAck = function(l) {
    const b = this, d = l.detail || {};
    return h.ack(b.scope, d.entryId).then(() => b._emitPendingCount()).then(() => b._drain()).catch((g) => {
      C(b.dom, "ln-api-queue:error", { operation: "ack", entryId: d.entryId, error: g });
    });
  }, s.prototype._onNack = function(l) {
    const b = this, d = l.detail || {};
    return h.nack(b.scope, d.entryId, d.reason, {
      maxAttempts: y,
      backoff: _
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
      C(b.dom, "ln-api-queue:error", { operation: "nack", entryId: d.entryId, error: g });
    });
  }, s.prototype._onRemap = function(l) {
    const b = this, d = l.detail || {};
    return h.remap(b.scope, d.oldKey, d.newId).catch((g) => {
      C(b.dom, "ln-api-queue:error", { operation: "remap", error: g });
    });
  }, s.prototype._onResolveCreate = function(l) {
    const b = this, d = l.detail || {};
    return h.resolveCreate(b.scope, d.entryId, d.oldKey, d.newId).then(() => b._emitPendingCount()).then(() => b._drain()).catch((g) => {
      C(b.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: d.entryId,
        error: g
      });
    });
  }, s.prototype._onResume = function() {
    const l = this;
    return h.setPaused(l.scope, !1).then(() => (l._paused = !1, C(l.dom, "ln-api-queue:resumed", {}), l._drain())).catch((b) => {
      C(l.dom, "ln-api-queue:error", { operation: "resume", error: b });
    });
  }, s.prototype._onPause = function() {
    const l = this;
    return h.setPaused(l.scope, "manual").then(() => {
      l._paused = !0, C(l.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((b) => {
      C(l.dom, "ln-api-queue:error", { operation: "pause", error: b });
    });
  }, s.prototype._onDrain = function() {
    const l = this;
    return h.resetFailed(l.scope).then(() => {
      const b = l._drainPromise;
      return b ? b.then(() => l._drain()) : l._drain();
    }).catch((b) => {
      C(l.dom, "ln-api-queue:error", { operation: "manual-drain", error: b });
    });
  }, s.prototype._onClear = function() {
    const l = this;
    return l._timers.forEach((b) => clearTimeout(b)), l._timers.clear(), h.clear(l.scope).then(() => {
      l._paused = !1, C(l.dom, "ln-api-queue:pending-count", { count: 0, scope: l.scope }), C(l.dom, "ln-api-queue:drained", { scope: l.scope });
    }).catch((b) => {
      C(l.dom, "ln-api-queue:error", { operation: "clear", error: b });
    });
  }, s.prototype._bindEvents = function() {
    const l = this;
    l._handlers = {
      enqueue: (b) => l._onEnqueue(b),
      ack: (b) => l._onAck(b),
      nack: (b) => l._onNack(b),
      remap: (b) => l._onRemap(b),
      resolveCreate: (b) => l._onResolveCreate(b),
      resume: () => l._onResume(),
      pause: () => l._onPause(),
      drain: () => l._onDrain(),
      clear: () => l._onClear()
    }, l.dom.addEventListener("ln-api-queue:request-enqueue", l._handlers.enqueue), l.dom.addEventListener("ln-api-queue:ack", l._handlers.ack), l.dom.addEventListener("ln-api-queue:nack", l._handlers.nack), l.dom.addEventListener("ln-api-queue:request-remap", l._handlers.remap), l.dom.addEventListener("ln-api-queue:resolve-create", l._handlers.resolveCreate), l.dom.addEventListener("ln-api-queue:request-resume", l._handlers.resume), l.dom.addEventListener("ln-api-queue:request-pause", l._handlers.pause), l.dom.addEventListener("ln-api-queue:request-drain", l._handlers.drain), l.dom.addEventListener("ln-api-queue:request-clear", l._handlers.clear);
  }, s.prototype.destroy = function() {
    if (!this.dom[i]) return;
    const l = this;
    l.dom.removeEventListener("ln-api-queue:request-enqueue", l._handlers.enqueue), l.dom.removeEventListener("ln-api-queue:ack", l._handlers.ack), l.dom.removeEventListener("ln-api-queue:nack", l._handlers.nack), l.dom.removeEventListener("ln-api-queue:request-remap", l._handlers.remap), l.dom.removeEventListener("ln-api-queue:resolve-create", l._handlers.resolveCreate), l.dom.removeEventListener("ln-api-queue:request-resume", l._handlers.resume), l.dom.removeEventListener("ln-api-queue:request-pause", l._handlers.pause), l.dom.removeEventListener("ln-api-queue:request-drain", l._handlers.drain), l.dom.removeEventListener("ln-api-queue:request-clear", l._handlers.clear), window.removeEventListener("online", l._onlineHandler), l._timers.forEach((b) => clearTimeout(b)), l._timers.clear(), C(l.dom, "ln-api-queue:destroyed", { scope: l.scope }), delete l.dom[i];
  };
  function c(l) {
    const b = l[i];
    b && b._drain();
  }
  P(r, i, s, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: c
  });
})();
function en(r) {
  if (r == null || r === "") return null;
  const i = Number(r);
  return Number.isFinite(i) ? i : null;
}
function vt(r) {
  return String(Math.round(r * 1e3) / 1e3);
}
function xi(r, i, _) {
  const y = en(r);
  return y === null || y < 0 ? 0 : Math.min(y, Math.min(i, _) / 2);
}
function ki(r) {
  if (typeof r != "string") return null;
  const i = r.trim().split(/[\s,]+/).map(Number);
  return i.length !== 4 || i.some((_) => !Number.isFinite(_)) || i[2] <= 0 || i[3] <= 0 ? null : { x: i[0], y: i[1], width: i[2], height: i[3] };
}
function Ii(r, i) {
  i = i || {};
  const _ = i.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, y = i.xField || "label", u = i.yField || "value", m = i.includeZero !== !1, h = xi(i.padding, _.width, _.height), s = Array.isArray(r) ? r : [], c = [];
  for (let x = 0; x < s.length; x++) {
    const k = s[x] || {}, O = en(k[u]);
    O !== null && c.push({
      record: k,
      sourceIndex: x,
      label: k[y] == null ? String(x + 1) : String(k[y]),
      value: O
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
      baselineY: _.y + _.height - h
    };
  const l = c.map((x) => x.value), b = Math.min(...l), d = Math.max(...l);
  let g = m ? Math.min(0, b) : b, f = m ? Math.max(0, d) : d;
  if (g === f)
    if (g === 0)
      f = 1;
    else {
      const x = Math.max(Math.abs(g) * 0.1, 1);
      g -= x, f += x;
    }
  const n = _.x + h, a = _.y + h, e = Math.max(0, _.width - h * 2), t = Math.max(0, _.height - h * 2), o = c.length > 1 ? e / (c.length - 1) : 0, p = f - g, v = (x) => a + (f - x) / p * t, w = c.map((x, k) => ({
    ...x,
    x: c.length === 1 ? n + e / 2 : n + k * o,
    y: v(x.value)
  })), E = g <= 0 && f >= 0 ? 0 : g, S = v(E), L = w.map((x) => vt(x.x) + "," + vt(x.y)).join(" "), T = [
    vt(w[0].x) + "," + vt(S),
    L,
    vt(w[w.length - 1].x) + "," + vt(S)
  ].join(" ");
  return {
    points: w,
    linePoints: L,
    areaPoints: T,
    count: w.length,
    min: b,
    max: d,
    domainMin: g,
    domainMax: f,
    baselineY: S
  };
}
(function() {
  const r = "data-ln-chart", i = "lnChart", _ = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[i] !== void 0) return;
  function y(s) {
    if (!s) return null;
    const c = s.split(":"), l = c[0].trim();
    return l ? {
      field: l,
      direction: c[1] && c[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function u(s, c) {
    if (s == null || !Number.isFinite(s)) return "";
    try {
      return new Intl.NumberFormat(G(c)).format(s);
    } catch {
      return String(s);
    }
  }
  function m(s, c) {
    s && (s.textContent = c);
  }
  function h(s) {
    this.dom = s, this.name = s.getAttribute(r) || "", this.source = s.getAttribute("data-ln-chart-source") || this.name, this.plot = s.querySelector("[data-ln-chart-plot]"), this.line = s.querySelector("[data-ln-chart-line]"), this.area = s.querySelector("[data-ln-chart-area]"), this.labels = s.querySelector("[data-ln-chart-labels]"), this.empty = s.querySelector("[data-ln-chart-empty]"), this.minimum = s.querySelector("[data-ln-chart-min]"), this.maximum = s.querySelector("[data-ln-chart-max]"), this.count = s.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const c = this;
    return this._onSetData = function(l) {
      const b = l.detail || {};
      c._data = Array.isArray(b.data) ? b.data : [], c.isLoaded = !0, c._setLoading(!1), c._render();
    }, this._onSetLoading = function(l) {
      c._setLoading(!!(l.detail && l.detail.loading));
    }, this._onRefresh = function() {
      c.requestData();
    }, s.addEventListener("ln-chart:set-data", this._onSetData), s.addEventListener("ln-chart:set-loading", this._onSetLoading), s.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  h.prototype._readOptions = function() {
    const s = this.dom.getAttribute("data-ln-chart-padding"), c = s === null ? NaN : Number(s), l = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(c) && c >= 0 ? c : 16,
      type: l === "area" || l === "polygon" ? "area" : "line",
      viewBox: this.plot && ki(this.plot.getAttribute("viewBox")) || _
    };
  }, h.prototype._setLoading = function(s) {
    this.dom.classList.toggle("ln-chart--loading", s), this.dom.setAttribute("aria-busy", s ? "true" : "false");
  }, h.prototype._renderLabels = function(s) {
    if (!this.labels || (this.labels.replaceChildren(), s.count === 0)) return;
    const c = this.name + "-label", l = '[data-ln-template="' + c + '"]';
    if (!this.dom.querySelector(l) && !document.querySelector(l)) return;
    const b = ft(this.dom, c, "ln-chart");
    if (b)
      for (const d of s.points) {
        const g = b.cloneNode(!0);
        xt(g, {
          label: d.label,
          value: u(d.value, this.dom)
        }), this.labels.appendChild(g);
      }
  }, h.prototype._render = function() {
    const s = this._readOptions(), c = Ii(this._data, s);
    this.model = c, this.line && (this.line.setAttribute("points", c.linePoints), this.line.toggleAttribute("hidden", c.count === 0)), this.area && (this.area.setAttribute("points", c.areaPoints), this.area.toggleAttribute("hidden", c.count === 0 || s.type !== "area"));
    const l = c.count === 0;
    this.dom.classList.toggle("ln-chart--empty", l), this.empty && this.empty.toggleAttribute("hidden", !l), m(this.minimum, u(c.min, this.dom)), m(this.maximum, u(c.max, this.dom)), m(this.count, u(c.count, this.dom)), this._renderLabels(c), C(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: c.count,
      min: c.min,
      max: c.max
    });
  }, h.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, C(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: y(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, h.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[i]);
  }, P(r, i, h, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(s, c) {
      const l = s[i];
      if (l) {
        if (c === "data-ln-chart-source" || c === "data-ln-chart-sort") {
          l.requestData();
          return;
        }
        l._render();
      }
    }
  });
})();
(function() {
  const r = "data-ln-options", i = "lnOptions";
  if (window[i] !== void 0) return;
  function _(y) {
    this.dom = y, this._storeName = y.getAttribute(r), this._valueField = y.getAttribute("data-ln-options-value") || "id", this._labelField = y.getAttribute("data-ln-options-label") || "name";
    const u = this;
    return this._onSetData = function(m) {
      u._rebuild(m.detail.data || []);
    }, y.addEventListener("ln-options:set-data", this._onSetData), C(y, "ln-options:request-data", { options: this._storeName }), this;
  }
  _.prototype._rebuild = function(y) {
    const u = this.dom, m = this._valueField, h = this._labelField, s = u.value, c = u.querySelectorAll("option");
    for (let b = c.length - 1; b >= 0; b--)
      c[b].value !== "" && u.removeChild(c[b]);
    for (let b = 0; b < y.length; b++) {
      const d = y[b], g = document.createElement("option");
      g.value = String(d[m]), g.textContent = d[h] != null ? d[h] : "", u.appendChild(g);
    }
    const l = u.options;
    for (let b = 0; b < l.length; b++)
      if (l[b].value === s) {
        u.value = s;
        break;
      }
  }, _.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[i]);
  }, P(r, i, _, "ln-options");
})();
(function() {
  const r = "data-ln-stat", i = "lnStat";
  if (window[i] !== void 0) return;
  function _(u) {
    if (!u) return null;
    const m = u.indexOf(":");
    if (m === -1) return null;
    const h = u.slice(0, m), s = u.slice(m + 1), c = {};
    return c[h] = [s], c;
  }
  function y(u) {
    return this.dom = u, this._storeName = u.getAttribute(r), this._filters = _(u.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      u.textContent = String(m.detail.count), u.classList.remove("is-loading");
    }, u.addEventListener("ln-stat:set-count", this._onSetCount), C(u, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[i] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[i]);
  }, P(r, i, y, "ln-stat");
})();
(function() {
  const r = "ln-icon-sprite", i = "#ln-icon-", _ = "#ln-icon-custom-", y = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set();
  let m = null;
  const h = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", l = "lni:v", b = "1";
  function d() {
    try {
      if (localStorage.getItem(l) !== b) {
        for (let o = localStorage.length - 1; o >= 0; o--) {
          const p = localStorage.key(o);
          p && p.indexOf(c) === 0 && localStorage.removeItem(p);
        }
        localStorage.setItem(l, b);
      }
    } catch {
    }
  }
  d();
  function g() {
    return m || (m = document.getElementById(r), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = r, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function f(o) {
    return o.indexOf(_) === 0 ? s + "/" + o.slice(_.length) + ".svg" : h + "/" + o.slice(i.length) + ".svg";
  }
  function n(o, p) {
    const v = p.match(/viewBox="([^"]+)"/), w = v ? v[1] : "0 0 24 24", E = p.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), S = E ? E[1].trim() : "", L = p.match(/<svg([^>]*)>/i), T = L ? L[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = o, x.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(k) {
      const O = T.match(new RegExp(k + '="([^"]*)"'));
      O && x.setAttribute(k, O[1]);
    }), x.innerHTML = S, g().querySelector("defs").appendChild(x);
  }
  function a(o) {
    if (y.has(o) || u.has(o)) return;
    if (o.indexOf(_) === 0 && !s) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", o);
      return;
    }
    const p = o.slice(1);
    try {
      const w = localStorage.getItem(c + p);
      if (w) {
        n(p, w), y.add(o);
        return;
      }
    } catch {
    }
    u.add(o);
    const v = f(o);
    fetch(v).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      n(p, w), y.add(o), u.delete(o);
      try {
        localStorage.setItem(c + p, w);
      } catch {
      }
    }).catch(function(w) {
      console.error("[ln-icon] Fetch failed for:", p, w), u.delete(o);
    });
  }
  function e(o) {
    const p = 'use[href^="' + i + '"], use[href^="' + _ + '"]', v = o.querySelectorAll ? o.querySelectorAll(p) : [];
    if (o.matches && o.matches(p)) {
      const w = o.getAttribute("href");
      w && a(w);
    }
    Array.prototype.forEach.call(v, function(w) {
      const E = w.getAttribute("href");
      E && a(E);
    });
  }
  function t() {
    e(document), new MutationObserver(function(o) {
      o.forEach(function(p) {
        if (p.type === "childList")
          p.addedNodes.forEach(function(v) {
            v.nodeType === 1 && e(v);
          });
        else if (p.type === "attributes" && p.attributeName === "href") {
          const v = p.target.getAttribute("href");
          v && (v.indexOf(i) === 0 || v.indexOf(_) === 0) && a(v);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const r = "data-ln-debug", i = "lnDebug";
  if (window[i] !== void 0) return;
  function _(y) {
    return this.dom = y, this;
  }
  _.prototype.destroy = function() {
    delete this.dom[i];
  }, P(r, i, _, "ln-debug");
})();
