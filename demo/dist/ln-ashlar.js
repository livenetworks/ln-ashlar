if (typeof window < "u") {
  const c = console.warn;
  console.warn = function(...a) {
    typeof a[0] == "string" && (a[0].startsWith("[ln-") || a[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || c.apply(console, a);
  };
}
const Ot = {};
function Lt(c, a) {
  Ot[c] || (Ot[c] = document.querySelector('[data-ln-template="' + c + '"]'));
  const y = Ot[c];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + c + '" not found'), null);
}
function L(c, a, y) {
  c.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: y || {}
  }));
}
function G(c, a, y) {
  const w = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return c.dispatchEvent(w), w;
}
function le(c, a, y) {
  c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), c._updateFooter();
  const w = {
    sort: c.currentSort,
    filters: c.currentFilters,
    search: c.currentSearch
  };
  w[y] = c.name, L(c.dom, a, w);
}
function nt(c, a) {
  if (!c || !a) return c;
  const y = c.querySelectorAll("[data-ln-field]");
  for (let h = 0; h < y.length; h++) {
    const s = y[h], l = s.getAttribute("data-ln-field");
    a[l] != null && (s.textContent = a[l]);
  }
  const w = c.querySelectorAll("[data-ln-attr]");
  for (let h = 0; h < w.length; h++) {
    const s = w[h], l = s.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < l.length; o++) {
      const u = l[o].trim().split(":");
      if (u.length !== 2) continue;
      const p = u[0].trim(), m = u[1].trim();
      a[m] != null && s.setAttribute(p, a[m]);
    }
  }
  const b = c.querySelectorAll("[data-ln-show]");
  for (let h = 0; h < b.length; h++) {
    const s = b[h], l = s.getAttribute("data-ln-show");
    l in a && s.classList.toggle("hidden", !a[l]);
  }
  const f = c.querySelectorAll("[data-ln-class]");
  for (let h = 0; h < f.length; h++) {
    const s = f[h], l = s.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < l.length; o++) {
      const u = l[o].trim().split(":");
      if (u.length !== 2) continue;
      const p = u[0].trim(), m = u[1].trim();
      m in a && s.classList.toggle(p, !!a[m]);
    }
  }
  return c;
}
function Pe(c, a) {
  c.matches && c.matches("[data-ln-form], [data-ln-fillable]") && c.dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  const y = c.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let w = 0; w < y.length; w++)
    y[w].dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  return c;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(c) {
  if (!(!c.target.matches || !c.target.matches("[data-ln-fillable]")))
    if (c.detail)
      nt(c.target, c.detail);
    else {
      const a = c.target.querySelectorAll("[data-ln-field]");
      for (let y = 0; y < a.length; y++)
        a[y].textContent = "";
    }
})));
function Et(c, a) {
  if (!c || !a) return c;
  const y = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const f = y.currentNode;
    f.textContent.indexOf("{{") !== -1 && (f.textContent = f.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(h, s) {
        return a[s] !== void 0 ? a[s] : "";
      }
    ));
  }
  const w = function(f, h) {
    return a[h] !== void 0 ? a[h] : "";
  }, b = Array.from(c.querySelectorAll("*"));
  c.nodeType === 1 && b.push(c);
  for (let f = 0; f < b.length; f++) {
    const h = b[f], s = h.attributes;
    for (let l = 0; l < s.length; l++) {
      const o = s[l];
      o.value.indexOf("{{") !== -1 && h.setAttribute(o.name, o.value.replace(/\{\{\s*(\w+)\s*\}\}/g, w));
    }
  }
  return c;
}
function He(c, a, y, w, b, f) {
  const h = {};
  for (let l = 0; l < c.children.length; l++) {
    const o = c.children[l], u = o.getAttribute("data-ln-key");
    u && (h[u] = o);
  }
  const s = document.createDocumentFragment();
  for (let l = 0; l < a.length; l++) {
    const o = a[l], u = String(w(o));
    let p = h[u];
    if (p)
      b(p, o, l);
    else {
      const m = Lt(y, f);
      if (!m || (Et(m, o), p = m.firstElementChild, !p)) continue;
      p.setAttribute("data-ln-key", u), b(p, o, l);
    }
    s.appendChild(p);
  }
  c.textContent = "", c.appendChild(s);
}
function lt(c, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      lt(c, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  c();
}
function ct(c, a, y) {
  if (c) {
    const w = c.querySelector('[data-ln-template="' + a + '"]');
    if (w) return w.content.cloneNode(!0);
  }
  return Lt(a, y);
}
function xt(c, a) {
  const y = {}, w = c.querySelectorAll("[" + a + "]");
  for (let b = 0; b < w.length; b++)
    y[w[b].getAttribute(a)] = w[b].textContent, w[b].remove();
  return y;
}
function Mt(c, a, y, w) {
  if (c.nodeType !== 1) return;
  const f = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", h = Array.from(c.querySelectorAll(f));
  c.matches && c.matches(f) && h.push(c);
  for (const s of h)
    s[y] || (s[y] = new w(s));
}
function Ct(c) {
  return !!(c.offsetWidth || c.offsetHeight || c.getClientRects().length);
}
function Be(c) {
  const a = c.querySelector('input[name="_method"]');
  return ((a && a.value !== "" ? a.value : c.method) || "").toUpperCase();
}
function ce(c, a) {
  const y = !!(a && a.typed), w = a && a.exclude, b = {}, f = c.elements, h = {};
  if (y)
    for (let s = 0; s < f.length; s++) {
      const l = f[s];
      l.name && l.type === "checkbox" && !l.disabled && (h[l.name] = (h[l.name] || 0) + 1);
    }
  for (let s = 0; s < f.length; s++) {
    const l = f[s];
    if (!(!l.name || l.disabled || l.type === "file" || l.type === "submit" || l.type === "button") && !(w && l.matches && l.matches(w)))
      if (l.type === "checkbox")
        y && h[l.name] === 1 ? b[l.name] = l.checked : (b[l.name] || (b[l.name] = []), l.checked && b[l.name].push(l.value));
      else if (l.type === "radio")
        l.checked && (b[l.name] = l.value);
      else if (l.type === "select-multiple") {
        b[l.name] = [];
        for (let o = 0; o < l.options.length; o++)
          l.options[o].selected && b[l.name].push(l.options[o].value);
      } else if (y && l.type === "hidden")
        b[l.name] = l.value;
      else if (y && (l.type === "number" || l.type === "range")) {
        const o = Number(l.value);
        b[l.name] = l.value === "" || isNaN(o) ? null : o;
      } else
        b[l.name] = l.value;
  }
  return b;
}
function Ue(c) {
  if (typeof c != "string") return !!c;
  const a = c.trim().toLowerCase();
  return a !== "false" && a !== "0" && a !== "" && a !== "off" && a !== "no";
}
function de(c, a) {
  const y = c.elements, w = [], b = {};
  for (let f = 0; f < y.length; f++) {
    const h = y[f];
    h.name && h.type === "checkbox" && (b[h.name] = (b[h.name] || 0) + 1);
  }
  for (let f = 0; f < y.length; f++) {
    const h = y[f];
    if (h.type === "file" || h.type === "submit" || h.type === "button") continue;
    const s = h.getAttribute("data-ln-fill-as") || h.name;
    if (!s || !(s in a)) continue;
    const l = a[s];
    if (h.type === "checkbox") {
      if (Array.isArray(l))
        h.checked = l.indexOf(h.value) !== -1;
      else if (b[h.name] > 1) {
        const o = String(l).split(",").map(function(u) {
          return u.trim();
        });
        h.checked = o.indexOf(h.value) !== -1;
      } else
        h.checked = Ue(l);
      w.push(h);
    } else if (h.type === "radio")
      h.checked = h.value === String(l), w.push(h);
    else if (h.type === "select-multiple") {
      if (Array.isArray(l))
        for (let o = 0; o < h.options.length; o++)
          h.options[o].selected = l.indexOf(h.options[o].value) !== -1;
      w.push(h);
    } else
      h.value = l, w.push(h);
  }
  return w;
}
const te = {
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
function W(c) {
  const a = c ? c.closest("[lang]") : null, y = (a ? a.getAttribute("lang") || a.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!y) return "en-US";
  const w = y.trim().toLowerCase();
  return w.indexOf("-") === -1 && te[w] ? te[w] : y;
}
function _t(c) {
  return c.hasAttribute("data-ln-value") ? c.getAttribute("data-ln-value") : c.textContent.trim();
}
function bt(c) {
  let a = !1;
  for (let y = 0; y < c.length; y++) {
    const w = c[y];
    if (!(w === "" || w == null) && (a = !0, !Number.isFinite(Number(w))))
      return "string";
  }
  return a ? "number" : "string";
}
function yt(c, a, y, w) {
  if (y === "number") {
    const h = parseFloat(c), s = parseFloat(a);
    return (isNaN(h) ? 0 : h) - (isNaN(s) ? 0 : s);
  }
  const b = c != null ? String(c) : "", f = a != null ? String(a) : "";
  return w ? w.compare(b, f) : b < f ? -1 : b > f ? 1 : 0;
}
function ue(c, a, { get: y, set: w }) {
  Object.defineProperty(c, "value", {
    get: function() {
      return y ? y.call(this) : a.get.call(this);
    },
    set: function(b) {
      w ? w.call(this, b, (f) => a.set.call(this, f)) : a.set.call(this, b);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function ze() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Ft() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const c = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let a = 0; a < c.length; a++)
      c[a]();
  }
}
function Ke() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function it(c) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(c) : setTimeout(c, 0)) : c();
}
function B(c, a, y, w, b = {}) {
  const f = b.extraAttributes || [], h = b.onAttributeChange || null, s = b.onInit || null;
  function l(u) {
    const p = u || document.body;
    Mt(p, c, a, y), s && s(p);
  }
  lt(function() {
    const u = new MutationObserver(function(m) {
      for (let _ = 0; _ < m.length; _++) {
        const i = m[_];
        if (i.type === "childList") {
          for (let r = 0; r < i.addedNodes.length; r++) {
            const t = i.addedNodes[r];
            t.nodeType === 1 && (Mt(t, c, a, y), s && s(t));
          }
          for (let r = 0; r < i.removedNodes.length; r++) {
            const t = i.removedNodes[r];
            if (t.nodeType === 1) {
              const n = c.indexOf("[") !== -1 || c.indexOf(".") !== -1 || c.indexOf("#") !== -1 ? c : "[" + c + "]", d = Array.from(t.querySelectorAll(n));
              t.matches && t.matches(n) && d.push(t);
              for (let g = 0; g < d.length; g++) {
                const E = d[g];
                if (!document.contains(E)) {
                  const v = E[a];
                  v && typeof v.destroy == "function" && v.destroy();
                }
              }
            }
          }
        } else i.type === "attributes" && (h && i.target[a] ? h(i.target, i.attributeName) : (Mt(i.target, c, a, y), s && s(i.target)));
      }
    });
    let p = [];
    if (c.indexOf("[") !== -1) {
      const m = /\[([\w-]+)/g;
      let _;
      for (; (_ = m.exec(c)) !== null; )
        p.push(_[1]);
    } else
      p.push(c);
    u.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: p.concat(f)
    });
  }, w || (c.indexOf("[") === -1 ? c.replace("data-", "") : "component")), window[a] = l;
  function o() {
    Ke() > 0 ? it(function() {
      l(document.body);
    }) : l(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o(), l;
}
function he(c, a) {
  if (c.ctrlKey || c.metaKey || c.shiftKey || c.altKey || c.button !== 0 || !a) return !1;
  const y = a.getAttribute("href");
  return !(!y || a.getAttribute("target") === "_blank" || a.hasAttribute("download") || y.startsWith("mailto:") || y.startsWith("tel:") || y === "#" || y.startsWith("#") || a.hostname && a.hostname !== window.location.hostname);
}
function X(...c) {
  return c.filter((a) => a != null && a !== "").map((a, y) => y === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function gt(c, a) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, c, a ? { Authorization: a } : null);
}
function fe(c, a = "ln-core") {
  try {
    return c ? JSON.parse(c) : {};
  } catch (y) {
    return console.error(`[${a}] Invalid headers JSON:`, y), {};
  }
}
const pe = {};
function je(c, a) {
  pe[c] = a;
}
function Ve(c) {
  return pe[c] || { ingress: (a) => a, egress: (a) => a };
}
const me = {};
function Vt(c, a) {
  if (!c || typeof a != "object") return;
  const y = c.toLowerCase().split("-")[0];
  me[y] = a;
}
function vt(c) {
  if (!c) return null;
  const a = c.toLowerCase().split("-")[0];
  return me[a] || null;
}
Vt("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = je, window.lnCore.getDataMapper = Ve, window.lnCore.registerLocaleFallback = Vt, window.lnCore.getLocaleFallback = vt, window.lnCore.fillTemplate = Et, window.lnCore.fill = nt, window.lnCore.lnFill = Pe, window.lnCore.renderList = He);
function Wt(c, a) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, c();
    }));
  };
}
function ge(c) {
  c = c || {};
  let a = c.windowSize > 0 ? c.windowSize : 1e3, y = c.pageSize > 0 ? c.pageSize : 200, w = c.threshold != null ? c.threshold : 25, b = c.fetchDebounce != null ? c.fetchDebounce : 120;
  const f = typeof c.requestPage == "function" ? c.requestPage : function() {
  }, h = typeof c.onChange == "function" ? c.onChange : function() {
  }, s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let u = 0, p = 0, m = 0, _ = { sort: null, filters: {}, search: "" }, i = null, r = 0, t = 0, e = !1;
  function n(v) {
    l.set(v, ++r);
  }
  function d() {
    return !!(_ && (_.search || _.filters && Object.keys(_.filters).length));
  }
  function g() {
    if (s.size <= a) return;
    const v = Array.from(s.keys()).sort(function(S, q) {
      return (l.get(S) || 0) - (l.get(q) || 0);
    });
    let A = 0;
    for (; s.size > a && A < v.length; )
      s.delete(v[A]), l.delete(v[A]), A++;
  }
  function E(v, A) {
    o.add(v), f(_, v, A);
  }
  return {
    get: function(v) {
      return s.get(v);
    },
    has: function(v) {
      return s.has(v);
    },
    peek: function() {
      return s.size ? s.values().next().value : void 0;
    },
    get logicalTotal() {
      return u;
    },
    get grandTotal() {
      return p;
    },
    get queryGen() {
      return m;
    },
    get size() {
      return s.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(v, A) {
      clearTimeout(i), t = v;
      for (let R = v; R < A; R++)
        s.has(R) && n(R);
      if (u <= 0) return;
      const S = Math.max(0, v - w), q = Math.min(u, A + w), T = Math.floor(S / y), x = Math.floor(Math.max(0, q - 1) / y);
      let k = -1;
      for (let R = T; R <= x; R++) {
        const N = R * y, z = Math.min(y, u - N);
        let H = !1;
        const U = Math.max(N, S), K = Math.min(N + z, q);
        for (let rt = U; rt < K; rt++)
          if (!s.has(rt)) {
            H = !0;
            break;
          }
        if (H && !o.has(N)) {
          k = N;
          break;
        }
      }
      k !== -1 && (i = setTimeout(function() {
        E(k, y);
      }, b));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(v) {
      if (v = v || {}, v.queryGen != null && v.queryGen !== m) return;
      e && (s.clear(), l.clear(), e = !1), p = v.total != null ? v.total : p, u = v.filtered != null ? v.filtered : v.data ? v.data.length : u;
      const A = v.offset || 0, S = v.data || [];
      for (let q = 0; q < S.length; q++)
        S[q] != null && (s.set(A + q, S[q]), n(A + q));
      o.delete(A), g(), h();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(v) {
      v && (_ = v), E(0, y);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(v) {
      m++, o.clear(), clearTimeout(i), v && (_ = v), e = !0, E(0, y);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      m++, o.clear(), clearTimeout(i), e = !0;
      const v = Math.max(0, Math.floor(t / y) * y);
      E(v, y);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(v) {
      o.delete(v);
    },
    destroy: function() {
      clearTimeout(i), s.clear(), l.clear(), o.clear();
    },
    configure: function(v) {
      v = v || {};
      let A = !1;
      if (v.windowSize != null && v.windowSize > 0 && v.windowSize !== a) {
        const S = v.windowSize < a;
        a = v.windowSize, S && g(), A = !0;
      }
      v.pageSize != null && v.pageSize > 0 && (y = v.pageSize), v.threshold != null && v.threshold >= 0 && (w = v.threshold), v.fetchDebounce != null && v.fetchDebounce >= 0 && (b = v.fetchDebounce), A && h();
    },
    setGrandTotal: function(v) {
      v == null || isNaN(v) || v < 0 || (p = v, d() || (u = v), h());
    }
  };
}
const We = "ln:";
let ft = null;
function _e() {
  if (ft !== null) return ft;
  try {
    if (typeof localStorage > "u")
      return ft = !1, !1;
    const c = "__ln_test__";
    localStorage.setItem(c, c), localStorage.removeItem(c), ft = !0;
  } catch {
    ft = !1;
  }
  return ft;
}
function Ge() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function be(c, a) {
  const y = a.getAttribute("data-ln-persist"), w = y !== null && y !== "" ? y : a.id;
  return w ? We + c + ":" + Ge() + ":" + w : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function kt(c, a) {
  if (!_e()) return null;
  const y = be(c, a);
  if (!y) return null;
  try {
    const w = localStorage.getItem(y);
    return w !== null ? JSON.parse(w) : null;
  } catch {
    return null;
  }
}
function ut(c, a, y) {
  if (!_e()) return;
  const w = be(c, a);
  if (w)
    try {
      y == null ? localStorage.removeItem(w) : localStorage.setItem(w, JSON.stringify(y));
    } catch {
    }
}
function ye(c) {
  return (c || "").replace(/^#/, "");
}
function It(c) {
  const a = c === void 0 ? location.hash : c, y = {}, w = ye(a);
  if (!w) return y;
  const b = w.split("&");
  for (let f = 0; f < b.length; f++) {
    const h = b[f];
    if (!h) continue;
    const s = h.indexOf(":"), l = s > -1 ? h.slice(0, s) : h, o = s > -1 ? h.slice(s + 1) : "";
    if (l)
      try {
        y[l] = decodeURIComponent(o);
      } catch {
        y[l] = o;
      }
  }
  return y;
}
function J(c) {
  if (!c) return null;
  const a = It();
  return c in a ? a[c] : null;
}
function Y(c, a) {
  if (!c) return;
  const y = It();
  a == null ? delete y[c] : y[c] = String(a);
  const b = Object.keys(y).map(function(f) {
    const h = y[f];
    return h === "" ? f : f + ":" + encodeURIComponent(h);
  }).join("&");
  ye(location.hash) !== b && (location.hash = b);
}
function Gt(c) {
  return c.button === 1 || c.ctrlKey || c.metaKey || c.shiftKey ? !1 : (c.preventDefault(), !0);
}
function ht(c, a) {
  if (!c || !c.hasAttribute("data-ln-hash")) return null;
  const y = c.getAttribute("data-ln-hash");
  if (y && y.trim() !== "") return y.trim();
  const w = c.getAttribute("data-ln-sort") || c.getAttribute("data-ln-search-for") || c.getAttribute("data-ln-search") || c.getAttribute("data-ln-filter") || c.id;
  return w ? a ? w + "-" + a : w : a || null;
}
function ve(c, a) {
  return !a || a === "none" || c === null || c === void 0 ? null : String(c) + "." + a;
}
function Pt(c) {
  return !c || typeof c != "string" ? null : c.endsWith(".asc") ? { fieldOrColumn: c.slice(0, -4), direction: "asc" } : c.endsWith(".desc") ? { fieldOrColumn: c.slice(0, -5), direction: "desc" } : null;
}
function we(c, a) {
  return !c || !Array.isArray(a) || a.length === 0 ? null : c + ":" + a.map(encodeURIComponent).join(",");
}
function Ht(c) {
  if (!c || typeof c != "string") return null;
  const a = c.indexOf(":");
  if (a === -1) return null;
  const y = c.slice(0, a), w = c.slice(a + 1), b = w ? w.split(",").map(function(f) {
    try {
      return decodeURIComponent(f);
    } catch {
      return f;
    }
  }).filter(Boolean) : [];
  return { key: y, values: b };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = It, window.lnCore.hashGet = J, window.lnCore.hashSet = Y, window.lnCore.hashLinkClick = Gt, window.lnCore.resolveHashNamespace = ht, window.lnCore.hashSortEncode = ve, window.lnCore.hashSortDecode = Pt, window.lnCore.hashFilterEncode = we, window.lnCore.hashFilterDecode = Ht);
function Tt(c, a, y, w) {
  const b = typeof w == "number" ? w : 4, f = window.innerWidth, h = window.innerHeight, s = a.width, l = a.height, o = (y || "bottom").split("-"), u = o[0], p = o[1] === "start" || o[1] === "end" ? o[1] : "center", m = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, _ = m[u] || m.bottom;
  function i(d) {
    return d === "top" || d === "bottom" ? p === "start" ? c.left : p === "end" ? c.right - s : c.left + (c.width - s) / 2 : p === "start" ? c.top : p === "end" ? c.bottom - l : c.top + (c.height - l) / 2;
  }
  function r(d) {
    let g, E, v = !0;
    return d === "top" ? (g = c.top - b - l, E = i(d), g < 0 && (v = !1)) : d === "bottom" ? (g = c.bottom + b, E = i(d), g + l > h && (v = !1)) : d === "left" ? (g = i(d), E = c.left - b - s, E < 0 && (v = !1)) : (g = i(d), E = c.right + b, E + s > f && (v = !1)), { top: g, left: E, side: d, fits: v };
  }
  let t = null;
  for (let d = 0; d < _.length; d++) {
    const g = r(_[d]);
    if (g.fits) {
      t = g;
      break;
    }
  }
  t || (t = r(_[0]));
  let e = t.top, n = t.left;
  return s >= f ? n = 0 : (n < 0 && (n = 0), n + s > f && (n = f - s)), l >= h ? e = 0 : (e < 0 && (e = 0), e + l > h && (e = h - l)), { top: e, left: n, placement: t.side };
}
function Bt(c) {
  if (!c) return { width: 0, height: 0 };
  const a = c.style, y = a.visibility, w = a.display, b = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const f = c.offsetWidth, h = c.offsetHeight;
  return a.visibility = y, a.display = w, a.position = b, { width: f, height: h };
}
let at = null;
async function ee(c) {
  if (!c) {
    at = null;
    return;
  }
  try {
    const a = new TextEncoder(), y = await crypto.subtle.digest("SHA-256", a.encode(c));
    at = await crypto.subtle.importKey(
      "raw",
      y,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (a) {
    console.error("[ln-core/crypto] Key derivation failed:", a), at = null;
  }
}
function dt() {
  return at;
}
async function Qe(c, a = at) {
  const y = a || at;
  if (!y || c === void 0 || c === null) return c;
  try {
    const w = new TextEncoder(), b = crypto.getRandomValues(new Uint8Array(12)), f = typeof c == "string" ? c : JSON.stringify(c), h = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: b },
      y,
      w.encode(f)
    ), s = btoa(String.fromCharCode(...b)), l = btoa(String.fromCharCode(...new Uint8Array(h)));
    return {
      encrypted: !0,
      iv: s,
      data: l
    };
  } catch (w) {
    return console.error("[ln-core/crypto] Encryption failed:", w), c;
  }
}
async function $e(c, a = at) {
  const y = a || at;
  if (!c || !c.encrypted || !y) return c;
  try {
    const w = new TextDecoder(), b = Uint8Array.from(atob(c.iv), (l) => l.charCodeAt(0)), f = Uint8Array.from(atob(c.data), (l) => l.charCodeAt(0)), h = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b },
      y,
      f
    ), s = w.decode(h);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (w) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", w), { ...c, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const c = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function w(o) {
    return typeof o == "string" ? o : o instanceof URL ? o.href : o instanceof Request ? o.url : String(o);
  }
  function b(o, u) {
    return u && u.method ? String(u.method).toUpperCase() : o instanceof Request ? o.method.toUpperCase() : "GET";
  }
  function f(o, u) {
    return u + " " + o;
  }
  function h(o) {
    return o === "GET" || o === "HEAD";
  }
  function s(o, u) {
    u = u || {};
    const p = w(o), m = b(o, u), _ = f(p, m);
    h(m) && a.has(_) && (a.get(_).abort(), a.delete(_));
    const i = new AbortController(), r = u.signal;
    let t = null;
    r && (r.aborted ? i.abort(r.reason) : (t = function() {
      i.abort(r.reason);
    }, r.addEventListener("abort", t, { once: !0 })));
    const e = Object.assign({}, u, { signal: i.signal });
    return a.set(_, i), c(o, e).finally(function() {
      r && t && r.removeEventListener("abort", t), a.get(_) === i && a.delete(_);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function l(o) {
    if (!o.detail || !o.detail.url) return;
    const u = o.target, p = (o.detail.method || (o.detail.body ? "POST" : "GET")).toUpperCase(), m = o.detail.key;
    m && y.has(m) && (y.get(m).abort(), y.delete(m));
    const _ = new AbortController(), i = o.detail.signal;
    let r = null;
    i && (i.aborted ? _.abort(i.reason) : (r = function() {
      _.abort(i.reason);
    }, i.addEventListener("abort", r, { once: !0 }))), m && y.set(m, _);
    const t = { method: p, signal: _.signal };
    o.detail.body !== void 0 && (t.body = o.detail.body), window.fetch(o.detail.url, t).then(function(e) {
      i && r && i.removeEventListener("abort", r), m && y.get(m) === _ && y.delete(m), L(u, "ln-http:response", {
        ok: e.ok,
        status: e.status,
        response: e
      });
    }).catch(function(e) {
      i && r && i.removeEventListener("abort", r), m && y.get(m) === _ && y.delete(m), !(e && e.name === "AbortError") && L(u, "ln-http:error", {
        ok: !1,
        status: 0,
        error: e
      });
    });
  }
  document.addEventListener("ln-http:request", l), window.lnHttp = {
    cancel: function(o) {
      let u = !1;
      return a.forEach(function(p, m) {
        m.endsWith(" " + o) && (p.abort(), a.delete(m), u = !0);
      }), u;
    },
    cancelByKey: function(o) {
      return y.has(o) ? (y.get(o).abort(), y.delete(o), !0) : !1;
    },
    cancelAll: function() {
      a.forEach(function(o) {
        o.abort();
      }), a.clear(), y.forEach(function(o) {
        o.abort();
      }), y.clear();
    },
    get inflight() {
      const o = [];
      return a.forEach(function(u, p) {
        const m = p.indexOf(" ");
        o.push({ method: p.slice(0, m), url: p.slice(m + 1) });
      }), y.forEach(function(u, p) {
        o.push({ key: p });
      }), o;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", l), window.fetch = c, delete window.lnHttp;
    }
  };
})();
(function() {
  const c = "template[data-ln-include]", a = "lnInclude";
  if (window[a] !== void 0) return;
  const y = /* @__PURE__ */ new Map();
  function w(b) {
    if (this.dom = b, this.url = b.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    ze(), this._held = !0;
    const f = this, h = this.url;
    let s = y.get(h);
    return s || (s = fetch(h).then(function(l) {
      if (!l.ok)
        throw new Error("HTTP error! status: " + l.status);
      return l.text();
    }).catch(function(l) {
      throw y.delete(h), l;
    }), y.set(h, s)), s.then(function(l) {
      if (f._destroyed) return;
      const o = document.createElement("template");
      o.innerHTML = l, f.dom.content.appendChild(o.content), L(f.dom, "ln-include:loaded", { target: f.dom, url: f.url }), f._held && (f._held = !1, Ft());
    }).catch(function(l) {
      f._destroyed || (console.error("[ln-include] Failed to fetch template from " + f.url + ":", l), L(f.dom, "ln-include:error", { target: f.dom, url: f.url, error: l }), f._held && (f._held = !1, Ft()));
    }), this;
  }
  w.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._held && (this._held = !1, Ft()), delete this.dom[a]);
  }, B(c, a, w, "ln-include");
})();
(function() {
  const c = "data-ln-form", a = "lnForm", y = "data-ln-form-action-edit", w = "data-ln-form-action-method";
  if (window[a] !== void 0) return;
  function b(f) {
    this.dom = f, this._baseAction = f.getAttribute("action") || "";
    const h = this;
    return this._onLnFill = function(s) {
      s.target === h.dom && (s.detail ? (h.fill(s.detail), h._applyActionMode(s.detail)) : h.dom.reset());
    }, this._onReset = function() {
      h._applyActionMode(null);
    }, f.addEventListener("ln-fill", this._onLnFill), f.addEventListener("reset", this._onReset), this;
  }
  b.prototype.fill = function(f) {
    const h = de(this.dom, f);
    for (let s = 0; s < h.length; s++) {
      const l = h[s], o = l.tagName === "SELECT" || l.type === "checkbox" || l.type === "radio";
      l.dispatchEvent(new Event(o ? "change" : "input", { bubbles: !0 }));
    }
  }, b.prototype._ensureMethodInput = function() {
    let f = this.dom.querySelector('input[name="_method"]');
    return f || (f = document.createElement("input"), f.type = "hidden", f.name = "_method", f.value = "", this.dom.appendChild(f)), f;
  }, b.prototype._applyActionMode = function(f) {
    if (!this.dom.hasAttribute(y)) return;
    const h = f && f.id != null && f.id !== "" ? f.id : null, s = this._ensureMethodInput();
    if (h !== null) {
      const l = this.dom.getAttribute(y);
      l ? this.dom.setAttribute("action", l.replace(":id", encodeURIComponent(h))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(h)), s.value = this.dom.getAttribute(w) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), s.value = "";
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(c, a, b, "ln-form");
})();
(function() {
  const c = "data-ln-validate", a = "lnValidate", y = "data-ln-validate-errors", w = "data-ln-validate-error", b = "ln-validate-valid", f = "ln-validate-invalid", h = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[a] !== void 0) return;
  function s(l) {
    this.dom = l, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, u = l.tagName, p = l.type, m = u === "SELECT" || p === "checkbox" || p === "radio";
    this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(i) {
      const r = i.detail && i.detail.error;
      if (!r) return;
      o._customErrors.add(r), o._touched = !0;
      const t = l.closest(".form-element");
      if (t) {
        const e = t.querySelector("[" + w + '="' + r + '"]');
        e && e.classList.remove("hidden");
      }
      l.classList.remove(b), l.classList.add(f), l.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const r = i.detail && i.detail.error, t = l.closest(".form-element");
      if (r) {
        if (o._customErrors.delete(r), t) {
          const e = t.querySelector("[" + w + '="' + r + '"]');
          e && e.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(e) {
          if (t) {
            const n = t.querySelector("[" + w + '="' + e + '"]');
            n && n.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, m || l.addEventListener("input", this._onInput), l.addEventListener("change", this._onChange), l.addEventListener("ln-validate:set-custom", this._onSetCustom), l.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const _ = l.form;
    return _ && (_.hasAttribute("novalidate") || _.setAttribute("novalidate", ""), this._onFormReset = function() {
      o.reset();
    }, this._onValidateRequest = function(i) {
      o._touched = !0, !o.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(o.dom);
    }, _.addEventListener("reset", this._onFormReset), _.addEventListener("ln-validate:request-validate", this._onValidateRequest), _._lnValidateGateBound || (_._lnValidateGateBound = !0, _.addEventListener("submit", function(i) {
      const r = { invalidFields: [] };
      L(_, "ln-validate:request-validate", r), r.invalidFields.length > 0 && (i.preventDefault(), r.invalidFields.sort((t, e) => t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), r.invalidFields[0].focus());
    }))), this;
  }
  s.prototype.validate = function() {
    const l = this.dom, o = l.validity, p = l.checkValidity() && this._customErrors.size === 0, m = l.closest(".form-element");
    if (m) {
      const i = m.querySelector("[" + y + "]");
      if (i) {
        const r = i.querySelectorAll("[" + w + "]");
        for (let t = 0; t < r.length; t++) {
          const e = r[t].getAttribute(w), n = h[e];
          n && (o[n] ? r[t].classList.remove("hidden") : r[t].classList.add("hidden"));
        }
      }
    }
    return l.classList.toggle(b, p), l.classList.toggle(f, !p), l.setAttribute("aria-invalid", p ? "false" : "true"), L(l, p ? "ln-validate:valid" : "ln-validate:invalid", { target: l, field: l.name }), p;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(b, f), this.dom.removeAttribute("aria-invalid");
    const l = this.dom.closest(".form-element");
    if (l) {
      const o = l.querySelectorAll("[" + w + "]");
      for (let u = 0; u < o.length; u++)
        o[u].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const l = this.dom.form;
    l && (this._onFormReset && l.removeEventListener("reset", this._onFormReset), this._onValidateRequest && l.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(b, f), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a];
  }, B(c, a, s, "ln-validate");
})();
(function() {
  const c = "data-ln-ajax", a = "lnAjax", y = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  function w(p) {
    if (!p.hasAttribute(c) || p[a]) return;
    p[a] = !0;
    const m = l(p);
    b(m.links), f(m.forms);
  }
  function b(p) {
    for (const m of p) {
      if (m[a + "Trigger"] || m.hostname && m.hostname !== window.location.hostname) continue;
      const _ = m.getAttribute("href");
      if (_ && _.includes("#")) continue;
      const i = function(r) {
        if (!he(r, m)) return;
        r.preventDefault();
        const t = m.getAttribute("href");
        t && s("GET", t, null, m);
      };
      m.addEventListener("click", i), m[a + "Trigger"] = i;
    }
  }
  function f(p) {
    for (const m of p) {
      if (m[a + "Trigger"]) continue;
      if (m.hasAttribute(y)) {
        m[a + "ScopeWarned"] || (m[a + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const _ = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const r = m.method.toUpperCase(), t = m.action, e = new FormData(m);
        for (const n of m.querySelectorAll('button, input[type="submit"]'))
          n.disabled = !0;
        s(r, t, e, m, function() {
          for (const n of m.querySelectorAll('button, input[type="submit"]'))
            n.disabled = !1;
        });
      };
      m.addEventListener("submit", _), m[a + "Trigger"] = _;
    }
  }
  function h(p) {
    if (!p[a]) return;
    const m = l(p);
    for (const _ of m.links)
      _[a + "Trigger"] && (_.removeEventListener("click", _[a + "Trigger"]), delete _[a + "Trigger"]);
    for (const _ of m.forms)
      _[a + "Trigger"] && (_.removeEventListener("submit", _[a + "Trigger"]), delete _[a + "Trigger"]);
    delete p[a];
  }
  function s(p, m, _, i, r) {
    if (G(i, "ln-ajax:before-start", { method: p, url: m }).defaultPrevented) return;
    L(i, "ln-ajax:start", { method: p, url: m }), i.classList.add("ln-ajax--loading");
    const e = document.createElement("span");
    e.className = "ln-ajax-spinner", i.appendChild(e);
    function n() {
      i.classList.remove("ln-ajax--loading");
      const A = i.querySelector(".ln-ajax-spinner");
      A && A.remove(), r && r();
    }
    let d = m;
    const g = document.querySelector('meta[name="csrf-token"]'), E = g ? g.getAttribute("content") : null;
    _ instanceof FormData && E && _.append("_token", E);
    const v = {
      method: p,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (v.headers["X-CSRF-TOKEN"] = E), p === "GET" && _) {
      const A = new URLSearchParams(_);
      d = m + (m.includes("?") ? "&" : "?") + A.toString();
    } else p !== "GET" && _ && (v.body = _);
    fetch(d, v).then(function(A) {
      const S = A.ok, q = A.status;
      return A.text().then(function(T) {
        let x = null, k = null;
        if (T && T.trim())
          try {
            x = JSON.parse(T);
          } catch (R) {
            k = R;
          }
        return { ok: S, status: q, data: x, parseError: k };
      });
    }).then(function(A) {
      const S = A.status, q = A.data, T = A.parseError;
      if (A.ok && !T) {
        if (q && q.title && (document.title = q.title), q && q.content)
          for (const x in q.content) {
            const k = document.getElementById(x);
            k && (k.innerHTML = q.content[x]);
          }
        if (i.tagName === "A") {
          const x = i.getAttribute("href");
          x && window.history.pushState({ ajax: !0 }, "", x);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", d);
        L(i, "ln-ajax:success", { method: p, url: d, data: q });
      } else
        L(i, "ln-ajax:error", {
          method: p,
          url: d,
          status: S,
          data: q,
          error: T || null
        });
      L(i, "ln-ajax:complete", { method: p, url: d }), n();
    }).catch(function(A) {
      L(i, "ln-ajax:error", { method: p, url: d, status: 0, data: null, error: A }), L(i, "ln-ajax:complete", { method: p, url: d }), n();
    });
  }
  function l(p) {
    const m = { links: [], forms: [] };
    return p.tagName === "A" && p.getAttribute(c) !== "false" ? m.links.push(p) : p.tagName === "FORM" && p.getAttribute(c) !== "false" ? m.forms.push(p) : (m.links = Array.from(p.querySelectorAll('a:not([data-ln-ajax="false"])')), m.forms = Array.from(p.querySelectorAll('form:not([data-ln-ajax="false"])'))), m;
  }
  function o() {
    lt(function() {
      new MutationObserver(function(m) {
        for (const _ of m)
          if (_.type === "childList") {
            for (const i of _.addedNodes)
              if (i.nodeType === 1 && (w(i), !i.hasAttribute(c))) {
                for (const t of i.querySelectorAll("[" + c + "]"))
                  w(t);
                const r = i.closest && i.closest("[" + c + "]");
                if (r && r.getAttribute(c) !== "false") {
                  const t = l(i);
                  b(t.links), f(t.forms);
                }
              }
          } else _.type === "attributes" && w(_.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [c]
      });
    }, "ln-ajax");
  }
  function u() {
    for (const p of document.querySelectorAll("[" + c + "]"))
      w(p);
  }
  window[a] = w, window[a].destroy = h, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
const Ee = {
  navigate: function(c) {
    wt(c, { historyAction: "push" });
  },
  replace: function(c) {
    wt(c, { historyAction: "replace" });
  },
  current: function() {
    return zt ? {
      path: Ut,
      params: Ce,
      query: Le,
      route: zt,
      regions: Se
    } : null;
  }
}, Qt = "data-ln-route", Ae = "lnRoute";
typeof window < "u" && (window.lnRouter = Ee);
const st = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new WeakMap();
let Se = /* @__PURE__ */ new Map(), ie = !1, Ut = null, Ce = {}, Le = {}, zt = null, Kt = !1;
function re(c, a, y) {
  Kt ? queueMicrotask(function() {
    L(c, a, y);
  }) : L(c, a, y);
}
function qt(c) {
  try {
    const f = new URL(c, window.location.origin);
    c = f.pathname + f.search + f.hash;
  } catch {
  }
  let [a] = c.split("#"), [y, w] = a.split("?");
  const b = {};
  if (w) {
    const f = new URLSearchParams(w);
    for (const [h, s] of f.entries())
      b[h] = s;
  }
  return y = y.replace(/\/+$/, ""), y === "" && (y = "/"), { path: y, query: b };
}
function Te(c, a) {
  if (c.pattern === "*") return 1;
  if (a.pattern === "*") return -1;
  const y = c.segments, w = a.segments, b = Math.max(y.length, w.length);
  for (let f = 0; f < b; f++) {
    const h = y[f], s = w[f];
    if (h === void 0) return 1;
    if (s === void 0) return -1;
    if (h === "*") return 1;
    if (s === "*") return -1;
    const l = h.startsWith(":"), o = s.startsWith(":");
    if (l && !o) return 1;
    if (!l && o) return -1;
  }
  return 0;
}
function qe(c, a) {
  const y = c.split("/").filter(Boolean);
  for (const w of a) {
    if (w.pattern === "*")
      return {
        route: w,
        params: { wildcard: c }
      };
    const b = w.segments, f = {};
    let h = !0;
    if (!(y.length > b.length && b[b.length - 1] !== "*")) {
      for (let s = 0; s < b.length; s++) {
        const l = b[s], o = y[s];
        if (l === "*") {
          f.wildcard = y.slice(s).join("/");
          break;
        }
        if (o === void 0) {
          h = !1;
          break;
        }
        if (l.startsWith(":"))
          f[l.slice(1)] = decodeURIComponent(o);
        else if (l !== o) {
          h = !1;
          break;
        }
      }
      if (h && (b.indexOf("*") !== -1 || y.length <= b.length))
        return { route: w, params: f };
    }
  }
  return null;
}
function jt(c, a) {
  if (c !== "__primary__") {
    const w = document.getElementById(a.target);
    return w || console.warn(`[ln-router] Explicit target element #${a.target} not found in DOM`), w;
  }
  const y = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return y || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), y;
}
function Xe(c) {
  if (!c) return;
  const a = Array.from(c.querySelectorAll("*")), y = [c].concat(a);
  for (const b of y)
    for (const f of Object.keys(b))
      if (f.startsWith("ln") && b[f] && typeof b[f].destroy == "function")
        try {
          b[f].destroy();
        } catch (h) {
          console.error(`[ln-router] Error destroying component ${f} on element:`, b, h);
        }
  const w = document.querySelectorAll('[data-ln-popover="open"]');
  for (const b of w) {
    const f = b.lnPopover;
    if (f && f.trigger && c.contains(f.trigger))
      try {
        f.destroy();
      } catch (h) {
        console.error("[ln-router] Error destroying open popover:", h);
      }
  }
}
function wt(c, a = {}) {
  const { path: y, query: w } = qt(c), b = /* @__PURE__ */ new Map();
  for (const [u, p] of st)
    b.set(u, qe(y, p.sorted));
  const f = st.has("__primary__"), h = b.get("__primary__");
  if (f && !h) {
    re(document.body, "ln-router:not-found", { path: y });
    return;
  }
  let s = null;
  if (h && (s = jt("__primary__", h.route), !s || G(s, "ln-router:before-navigate", {
    from: Ut,
    to: c,
    params: h.params,
    query: w
  }).defaultPrevented))
    return;
  const l = [];
  for (const [u, p] of b) {
    if (!p) continue;
    const m = jt(u, p.route);
    m && (u !== "__primary__" && m.hasAttribute("data-ln-route-keep") && ne.get(m) === p.route.templateNode || l.push({ regionKey: u, match: p, targetEl: m }));
  }
  a.historyAction === "push" ? window.history.pushState(null, "", c) : a.historyAction === "replace" && window.history.replaceState(null, "", c);
  const o = function() {
    for (const { regionKey: u, match: p, targetEl: m } of l) {
      if (!(a.isHydration && m.hasAttribute("data-ln-router-hydrate") && m.children.length > 0)) {
        Xe(m);
        const i = p.route.templateNode.content.cloneNode(!0);
        m.replaceChildren(i);
      }
      if (ne.set(m, p.route.templateNode), u === "__primary__" && (p.route.title && (document.title = p.route.title), !a.isHydration)) {
        m.hasAttribute("tabindex") || m.setAttribute("tabindex", "-1");
        const i = m.querySelector("h1, h2, h3, h4, h5, h6");
        i ? (i.setAttribute("tabindex", "-1"), i.focus()) : m.focus(), m.scrollIntoView({ block: "start", behavior: "instant" });
      }
      re(m, "ln-router:navigated", {
        path: c,
        params: p.params,
        query: w,
        route: p.route,
        target: m,
        region: u
      });
    }
    h && (Ut = c, Ce = h.params, Le = w, zt = h.route), Se = new Map(
      Array.from(b.entries()).map(([u, p]) => [u, p ? { route: p.route, params: p.params } : null])
    );
  };
  document.startViewTransition && !a.isHydration ? document.startViewTransition(o) : o();
}
function Ye(c) {
  const a = c.target.closest("a");
  if (!a || !he(c, a)) return;
  const y = a.getAttribute("href"), { path: w } = qt(y), b = st.get("__primary__");
  if (!b) return;
  qe(w, b.sorted) && (c.preventDefault(), wt(y, { historyAction: "push" }));
}
function Je(c, a) {
  const y = Object.keys(c), w = Object.keys(a);
  if (y.length !== w.length) return !1;
  for (let b = 0; b < y.length; b++) {
    const f = y[b];
    if (c[f] !== a[f]) return !1;
  }
  return !0;
}
function Ze() {
  const c = window.location.pathname + window.location.search, a = Ee.current();
  if (a && a.path != null) {
    const y = qt(c);
    if (qt(a.path).path === y.path && Je(a.query, y.query))
      return;
  }
  wt(c, { historyAction: "skip" });
}
function tn() {
  ie || (ie = !0, lt(function() {
    document.addEventListener("click", Ye), window.addEventListener("popstate", Ze), Kt = !0;
    const c = window.location.pathname + window.location.search + window.location.hash;
    wt(c, { historyAction: "replace", isHydration: !0 }), Kt = !1;
  }, "ln-router"));
}
function en(c) {
  const a = c.getAttribute(Qt);
  if (!a) return;
  const y = c.getAttribute("data-ln-route-target") || null;
  if (y === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${a}" rejected.`);
    return;
  }
  const w = y || "__primary__";
  st.has(w) || st.set(w, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const b = st.get(w);
  if (b.routes.has(a)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${a}" in region "${w}"`);
    return;
  }
  const f = c.getAttribute("data-ln-route-title"), h = a.split("/").filter(Boolean), s = {
    pattern: a,
    segments: h,
    target: y,
    title: f,
    templateNode: c
  }, l = jt(w, s);
  l && l.contains(c) && console.warn(`[ln-router] Route template with pattern "${a}" is declared inside its own outlet element:`, c), b.routes.set(a, s), b.sorted = Array.from(b.routes.values()).sort(Te);
}
function nn(c) {
  const a = c.getAttribute(Qt);
  if (!a) return;
  const w = c.getAttribute("data-ln-route-target") || null || "__primary__", b = st.get(w);
  b && (b.routes.delete(a), b.sorted = Array.from(b.routes.values()).sort(Te), b.routes.size === 0 && st.delete(w));
}
function xe(c) {
  return this.dom = c, en(c), this;
}
xe.prototype.destroy = function() {
  nn(this.dom), delete this.dom[Ae];
};
B(Qt, Ae, xe, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    st.size > 0 && tn();
  }
});
(function() {
  const c = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function y(b) {
    this.dom = b, this.isOpen = b.getAttribute(c) === "open";
    const f = this;
    return this._onRequestOpen = function() {
      f.dom.setAttribute(c, "open");
    }, this._onRequestClose = function() {
      f.dom.setAttribute(c, "close");
    }, this._onCancel = function(h) {
      h.preventDefault(), f.dom.setAttribute(c, "close");
    }, this._onClickClose = function(h) {
      const s = h.target.closest("[data-ln-modal-close]");
      s && f.dom.contains(s) && (h.preventDefault(), f.dom.setAttribute(c, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  y.prototype.open = function() {
    this.dom.setAttribute(c, "open");
  }, y.prototype.close = function() {
    this.dom.setAttribute(c, "close");
  }, y.prototype.toggle = function() {
    const b = this.dom.getAttribute(c);
    this.dom.setAttribute(c, b === "open" ? "close" : "open");
  }, y.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const b = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + c + '="open"]'),
          function(h) {
            return h !== b;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      L(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
    }
  };
  function w(b) {
    const f = b[a];
    if (!f) return;
    const s = b.getAttribute(c) === "open";
    if (s !== f.isOpen)
      if (s) {
        if (G(b, "ln-modal:before-open", { modalId: b.id, target: b }).defaultPrevented) {
          b.setAttribute(c, "close");
          return;
        }
        f.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof b.showModal == "function" && b.showModal();
        const o = b.querySelector("[autofocus]");
        if (o && Ct(o))
          o.focus();
        else {
          const u = b.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), p = Array.prototype.find.call(u, Ct);
          if (p) p.focus();
          else {
            const m = b.querySelectorAll("a[href], button:not([disabled])"), _ = Array.prototype.find.call(m, Ct);
            _ && _.focus();
          }
        }
        L(b, "ln-modal:open", { modalId: b.id, target: b });
      } else {
        if (G(b, "ln-modal:before-close", { modalId: b.id, target: b }).defaultPrevented) {
          b.setAttribute(c, "open");
          return;
        }
        f.isOpen = !1, L(b, "ln-modal:close", { modalId: b.id, target: b }), typeof b.close == "function" && b.close(), document.querySelector("[" + c + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  B(c, a, y, "ln-modal", {
    onAttributeChange: w
  });
})();
(function() {
  const c = "data-ln-ui-coordinator", a = "lnUiCoordinator", y = "data-ln-ui-coordinator-dict";
  if (window[a] !== void 0) return;
  function w(t) {
    const e = {};
    let n = t;
    const d = [];
    for (; n; ) {
      const g = n.closest("[" + c + "]");
      if (!g) break;
      g[a] && g[a].dict && d.unshift(g[a].dict), n = g.parentElement;
    }
    for (const g of d)
      Object.assign(e, g);
    return e;
  }
  function b(t, e) {
    if (e) {
      if (t) {
        const d = t.closest("[" + c + "]");
        if (d) {
          if (d.id === e && d.hasAttribute("data-ln-modal")) return d;
          const g = d.querySelector("#" + CSS.escape(e) + '[data-ln-modal], [data-ln-modal="' + e + '"]');
          if (g) return g;
        }
      }
      const n = document.getElementById(e) || document.querySelector('[data-ln-modal="' + e + '"]');
      if (n) return n;
    }
    if (t) {
      const n = t.closest("[" + c + "]");
      if (n) {
        if (n.hasAttribute("data-ln-modal")) return n;
        const g = n.querySelector("[data-ln-modal]");
        if (g) return g;
      }
      const d = t.closest("[data-ln-modal]");
      if (d) return d;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function f(t, e) {
    if (t !== "edit") return "";
    if (e) {
      const n = e.getAttribute("data-ln-fill-id");
      if (n) return n;
    }
    return "edit";
  }
  function h(t) {
    if (!t) return;
    const e = t.querySelectorAll("[data-ln-field]");
    for (let d = 0; d < e.length; d++)
      e[d].textContent = "";
    const n = t.querySelectorAll("form");
    for (let d = 0; d < n.length; d++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(n[d], null) : n[d].reset();
  }
  document.addEventListener("submit", function(t) {
    if (t.defaultPrevented) return;
    const n = t.target.closest("[data-ln-modal]");
    if (n && n.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + n.id, "true");
      } catch {
      }
      Y(n.id, null);
    }
  }), document.addEventListener("click", function(t) {
    if (t.ctrlKey || t.metaKey || t.button === 1) return;
    const e = t.target.closest("[data-ln-modal-for]");
    if (e) {
      const d = e.getAttribute("data-ln-modal-for"), g = b(e, d);
      if (g && g.lnModal) {
        t.preventDefault();
        const E = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, v = {}, A = e.dataset;
        for (const T in A) {
          if (!T.startsWith("lnModal") || E[T]) continue;
          const x = T.slice(7);
          x && (v[x.charAt(0).toLowerCase() + x.slice(1)] = A[T]);
        }
        const S = Object.keys(v).length > 0;
        e.hasAttribute("data-ln-modal-mode") ? g.dataset.lnModalMode = e.getAttribute("data-ln-modal-mode") : g.dataset.lnModalMode = S ? "edit" : "new", S && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(g, v) : g.dataset.lnModalMode === "new" && h(g), g.getAttribute("data-ln-modal") === "open" ? L(g, "ln-modal:request-close", {}) : (g.id && Y(g.id, f(g.dataset.lnModalMode, e)), L(g, "ln-modal:request-open", {}));
      }
      return;
    }
    const n = t.target.closest('a[href^="#"]');
    if (n) {
      const d = It(n.getAttribute("href"));
      for (const g in d) {
        const E = document.getElementById(g);
        if (E && E.lnModal) {
          if (!Gt(t)) return;
          Y(g, d[g]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(t) {
    const e = t.target;
    if (!e || !e.lnModal) return;
    (e.dataset.lnModalMode || "new") === "new" && h(e);
  }), document.addEventListener("ln-modal:open", function(t) {
    const e = t.target;
    if (!e || !e.lnModal || !e.id) return;
    let n = J(e.id);
    n === null && (n = f(e.dataset.lnModalMode, null), Y(e.id, n)), n ? (e.dataset.lnModalMode = "edit", e.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: n }
    }))) : (e.dataset.lnModalMode = "new", h(e));
  });
  let s = !1;
  function l() {
    if (!s) {
      s = !0;
      try {
        const t = document.querySelectorAll("[data-ln-modal][id]");
        for (let e = 0; e < t.length; e++) {
          const n = t[e];
          if (!n.lnModal) continue;
          const d = n.id, g = "ln-modal-pending:" + d;
          let E = !1;
          try {
            E = sessionStorage.getItem(g) === "true";
          } catch {
          }
          if (E) {
            try {
              sessionStorage.removeItem(g);
            } catch {
            }
            if (!!n.querySelector('[data-ln-validate-error], [aria-invalid="true"]')) {
              n.dataset.lnModalMode = "edit", L(n, "ln-modal:request-open", {});
              continue;
            } else {
              Y(d, null), L(n, "ln-modal:request-close", {}), h(n);
              continue;
            }
          }
          const v = J(d), A = v !== null, S = n.lnModal.isOpen;
          if (A) {
            const q = v ? "edit" : "new";
            n.dataset.lnModalMode = q, S ? v ? n.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: v }
            })) : h(n) : L(n, "ln-modal:request-open", {});
          } else S && L(n, "ln-modal:request-close", {});
        }
      } finally {
        s = !1;
      }
    }
  }
  function o() {
    const t = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let e = 0; e < t.length; e++) {
      const n = t[e];
      n.lnModal && J(n.id) === null && Y(n.id, f(n.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", l);
  function u() {
    o(), l();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    it(u);
  }) : it(u);
  function p(t) {
    const n = (t.detail || {}).data;
    if (n && n.message) {
      const g = n.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: g.type || "success",
          title: g.title || "",
          message: g.body || ""
        }
      }));
    }
    const d = t.target.closest("[data-ln-modal]");
    if (d && d.lnModal) {
      if (d.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + d.id);
        } catch {
        }
        Y(d.id, null);
      }
      L(d, "ln-modal:request-close", {}), h(d);
    }
  }
  function m(t) {
    const e = t.detail || {}, n = e.data, d = e.status || 0, g = w(t.target);
    if (n && n.message) {
      const E = n.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: E.type || "error",
          title: E.title || "",
          message: E.body || ""
        }
      }));
    } else d === 0 ? window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g["network-error-title"] || "",
        message: g["network-error"] || "Network error"
      }
    })) : window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g["server-error-title"] || "",
        message: g["server-error"] || "Server error"
      }
    }));
  }
  document.addEventListener("ln-ajax:success", p), document.addEventListener("ln-ajax:error", m);
  function _(t) {
    const e = t.detail || {}, n = w(t.target), d = e.message || (e.reason === "max-size" ? n["upload-max-size"] || "File is too large" : e.reason === "max-files" ? n["upload-max-files"] || "Maximum file count exceeded" : n["upload-invalid-type"] || "This file type is not allowed"), g = n["upload-invalid-title"] || "Invalid File";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g,
        message: d
      }
    }));
  }
  function i(t) {
    const e = t.detail || {}, n = w(t.target), d = e.message || n["upload-failed"] || "Failed to upload file", g = n["upload-error-title"] || "Upload Error";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g,
        message: d
      }
    }));
  }
  document.addEventListener("ln-upload:invalid", _), document.addEventListener("ln-upload:error", i), document.addEventListener("ln-modal:close", function(t) {
    const e = t.target;
    if (!(!e || !e.lnModal)) {
      if (e.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + e.id);
        } catch {
        }
        J(e.id) !== null && Y(e.id, null);
      }
      e.dataset.lnModalMode === "new" && h(e);
    }
  });
  function r(t) {
    return this.dom = t, this.dict = xt(t, y), this;
  }
  r.prototype.destroy = function() {
    this.dom[a] && (this.dict = {}, delete this.dom[a]);
  }, B(c, a, r, "ln-ui-coordinator");
})();
(function() {
  const c = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const y = {}, w = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function b(o) {
    if (!y[o]) {
      const u = new Intl.NumberFormat(o, { useGrouping: !0 }), p = u.formatToParts(1234.5);
      let m = "", _ = ".";
      for (let i = 0; i < p.length; i++)
        p[i].type === "group" && (m = p[i].value), p[i].type === "decimal" && (_ = p[i].value);
      y[o] = { fmt: u, groupSep: m, decimalSep: _ };
    }
    return y[o];
  }
  function f(o, u, p) {
    if (p !== null) {
      const m = parseInt(p, 10), _ = o + "|d" + m;
      return y[_] || (y[_] = new Intl.NumberFormat(o, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: m })), y[_].format(u);
    }
    return b(o).fmt.format(u);
  }
  function h(o) {
    if (o[a]) return o[a];
    if (o[a] = this, this.dom = o, o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const u = document.createElement("input");
    u.type = "hidden", u.name = o.name, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && u.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.type = "text", o.setAttribute("inputmode", "decimal"), o.insertAdjacentElement("afterend", u), this._hidden = u;
    const p = this;
    Object.defineProperty(u, "value", {
      get: function() {
        return w.get.call(u);
      },
      set: function(_) {
        w.set.call(u, _), _ !== "" && !isNaN(parseFloat(_)) ? p._setDisplayRaw(f(W(p.dom), parseFloat(_), p.dom.getAttribute("data-ln-number-decimals"))) : p._setDisplayRaw(""), p.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), ue(o, w, {
      get: function() {
        return w.get.call(o);
      },
      set: function(_) {
        if (_ === "") {
          p._setDisplayRaw(""), p._setHiddenRaw(""), o.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const i = typeof _ == "number" ? _ : parseFloat(String(_).replace(/[^\d.-]/g, ""));
        isNaN(i) ? (p._setDisplayRaw(String(_)), p._setHiddenRaw("")) : (p._setHiddenRaw(i), p._setDisplayRaw(f(W(o), i, o.getAttribute("data-ln-number-decimals")))), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      p._handleInput();
    }, o.addEventListener("input", this._onInput), this._onPaste = function(_) {
      _.preventDefault();
      const i = (_.clipboardData || window.clipboardData).getData("text"), r = b(W(o)), t = r.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let e = i.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      r.groupSep && (e = e.split(r.groupSep).join("")), r.decimalSep !== "." && (e = e.replace(r.decimalSep, "."));
      const n = parseFloat(e);
      p.value = isNaN(n) ? NaN : n;
    }, o.addEventListener("paste", this._onPaste);
    const m = o.value;
    if (m !== "") {
      const _ = parseFloat(m);
      isNaN(_) || (this._setHiddenRaw(_), this._setDisplayRaw(f(W(o), _, o.getAttribute("data-ln-number-decimals"))), o.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function s(o) {
    if (typeof o == "number") return isNaN(o) ? null : o;
    if (!o || typeof o != "string") return null;
    let u = o.trim();
    if (u === "") return null;
    u = u.replace(/[\s\u00A0$€£]/g, ""), u.indexOf(",") !== -1 && u.indexOf(".") !== -1 ? u.indexOf(".") < u.indexOf(",") ? u = u.replace(/\./g, "").replace(",", ".") : u = u.replace(/,/g, "") : u.indexOf(",") !== -1 && (u = u.replace(",", ".")), u = u.replace(/[^\d.-]/g, "");
    const p = parseFloat(u);
    return isNaN(p) ? null : p;
  }
  h.prototype._initTextElement = function() {
    const o = this.dom;
    let u = o.getAttribute("data-ln-value"), p = o.getAttribute("data-ln-number"), m = null;
    u !== null && u !== "" ? m = u : p !== null && p !== "" && p !== "true" ? m = p : m = o.textContent.trim();
    const _ = s(m);
    _ !== null ? (this._rawValue = _, o.hasAttribute("data-ln-value") || o.setAttribute("data-ln-value", String(_)), this._formatTextContent()) : this._rawValue = null;
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = f(W(this.dom), this._rawValue, o);
    }
  }, h.prototype._handleInput = function() {
    const o = this.dom, u = b(W(o)), p = w.get.call(o);
    if (p === "") {
      this._setHiddenRaw(""), L(o, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (p === "-") {
      this._setHiddenRaw("");
      return;
    }
    const m = o.selectionStart;
    let _ = 0;
    for (let A = 0; A < m; A++)
      /[0-9]/.test(p[A]) && _++;
    let i = p;
    if (u.groupSep && (i = i.split(u.groupSep).join("")), i = i.replace(u.decimalSep, "."), p.endsWith(u.decimalSep) || p.endsWith(".")) {
      const A = i.replace(/\.$/, ""), S = parseFloat(A);
      isNaN(S) || this._setHiddenRaw(S);
      return;
    }
    const r = i.indexOf(".");
    if (r !== -1 && i.slice(r + 1).endsWith("0")) {
      const S = parseFloat(i);
      isNaN(S) || this._setHiddenRaw(S);
      return;
    }
    const t = o.getAttribute("data-ln-number-decimals");
    if (t !== null && r !== -1) {
      const A = parseInt(t, 10);
      i.slice(r + 1).length > A && (i = i.slice(0, r + 1 + A));
    }
    const e = parseFloat(i);
    if (isNaN(e)) return;
    const n = o.getAttribute("data-ln-number-min"), d = o.getAttribute("data-ln-number-max");
    if (n !== null && e < parseFloat(n) || d !== null && e > parseFloat(d)) return;
    let g;
    if (t !== null)
      g = f(W(o), e, t);
    else {
      const A = r !== -1 ? i.slice(r + 1).length : 0;
      if (A > 0) {
        const S = W(o) + "|u" + A;
        y[S] || (y[S] = new Intl.NumberFormat(W(o), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), g = y[S].format(e);
      } else
        g = u.fmt.format(e);
    }
    this._setDisplayRaw(g);
    let E = _, v = 0;
    for (let A = 0; A < g.length && E > 0; A++)
      v = A + 1, /[0-9]/.test(g[A]) && E--;
    E > 0 && (v = g.length), o.setSelectionRange(v, v), this._setHiddenRaw(e), L(o, "ln-number:input", { value: e, formatted: g });
  }, h.prototype._setHiddenRaw = function(o) {
    this._hidden && w.set.call(this._hidden, String(o));
  }, h.prototype._setDisplayRaw = function(o) {
    this.isTextElement ? this.dom.textContent = String(o) : w.set.call(this.dom, String(o));
  }, h.prototype._displayFormatted = function(o) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(f(W(this.dom), o, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const o = w.get.call(this._hidden);
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
      this._setHiddenRaw(o), this._setDisplayRaw(f(W(this.dom), o, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : w.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[a] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function l() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + c + "]");
      for (let u = 0; u < o.length; u++) {
        const p = o[u][a];
        p && (p.isTextElement ? p._formatTextContent() : isNaN(p.value) || p._displayFormatted(p.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(c, a, h, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(o) {
      const u = o[a];
      u && (u.isTextElement ? u._initTextElement() : isNaN(u.value) || u._displayFormatted(u.value));
    }
  }), l();
})();
(function() {
  const c = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const y = {}, w = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function b(n, d) {
    const g = n + "|" + JSON.stringify(d);
    return y[g] || (y[g] = new Intl.DateTimeFormat(n, d)), y[g];
  }
  const f = /^(short|medium|long)(\s+datetime)?$/, h = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(n) {
    return !n || n === "" ? { dateStyle: "medium" } : n.match(f) ? h[n] : null;
  }
  function l(n, d, g) {
    const E = n.getDate(), v = n.getMonth(), A = n.getFullYear(), S = n.getHours(), q = n.getMinutes();
    let T, x;
    const k = vt(g), R = (g || "").toLowerCase().split("-")[0], z = b(g, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], H = k && z !== R;
    H && k.monthsLong ? T = k.monthsLong[v] : T = b(g, { month: "long" }).format(n), H && k.monthsShort ? x = k.monthsShort[v] : x = b(g, { month: "short" }).format(n);
    const U = {
      yyyy: String(A),
      yy: String(A).slice(-2),
      MMMM: T,
      MMM: x,
      MM: String(v + 1).padStart(2, "0"),
      M: String(v + 1),
      dd: String(E).padStart(2, "0"),
      d: String(E),
      HH: String(S).padStart(2, "0"),
      mm: String(q).padStart(2, "0")
    };
    return d.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(K) {
      return U[K];
    });
  }
  function o(n, d, g) {
    const E = s(d);
    if (E) {
      const v = b(g, E), A = (g || "").toLowerCase().split("-")[0], S = v.resolvedOptions().locale.toLowerCase().split("-")[0];
      return vt(g) && S !== A ? l(n, "dd.MM.yyyy", g) : v.format(n);
    }
    return l(n, d, g);
  }
  function u(n) {
    if (!n) return "";
    const d = n.getFullYear(), g = String(n.getMonth() + 1).padStart(2, "0"), E = String(n.getDate()).padStart(2, "0");
    return d + "-" + g + "-" + E;
  }
  function p(n, d, g) {
    L(n.dom, "ln-date:change", {
      value: d,
      formatted: n.dom.value,
      date: g
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function m(n, d, g, E) {
    n._setHiddenRaw(d), w.set.call(n._picker, d), n._lastISO = d, E !== void 0 ? (n._isFormatting = !0, n.dom.value = E, n._isFormatting = !1) : g && n._displayFormatted(g), p(n, d, g);
  }
  function _(n) {
    n._setHiddenRaw(""), w.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", p(n, "", null);
  }
  i.prototype._initTextElement = function() {
    const n = this.dom;
    let d = n.getAttribute("data-ln-value"), g = n.getAttribute("data-ln-date"), E = n.getAttribute("datetime"), v = null;
    d !== null && d !== "" ? v = d : E !== null && E !== "" ? v = E : g !== null && g !== "" && g !== "true" && !f.test(g) ? v = g : v = n.textContent.trim();
    let A = r(v) || t(v);
    if (!A && v)
      if (isNaN(v))
        A = new Date(v);
      else {
        const S = Number(v);
        A = new Date(S > 1e11 ? S : S * 1e3);
      }
    if (A && !isNaN(A.getTime())) {
      const S = u(A);
      this._rawValue = S, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", S), this._formatTextContent();
    } else
      this._rawValue = null;
  }, i.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = r(this._rawValue);
      if (n) {
        let g = this.dom.getAttribute("data-ln-date-format");
        if (!g) {
          const v = this.dom.getAttribute("data-ln-date");
          v && f.test(v) && (g = v);
        }
        const E = W(this.dom);
        this.dom.textContent = o(n, g || "medium", E);
      }
    }
  };
  function i(n) {
    if (n[a]) return n[a];
    if (n[a] = this, this.dom = n, n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const d = this, g = n.value, E = n.name, A = (n.closest(".form-element, form") || n.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let k = 0; k < A.length; k++) {
      const R = A[k].getAttribute("data-ln-date-dict");
      if (R) {
        const N = xt(A[k], "data-ln-date-dict-key");
        N["months-long"] && (N.monthsLong = N["months-long"].split(",").map((z) => z.trim())), N["months-short"] && (N.monthsShort = N["months-short"].split(",").map((z) => z.trim())), Vt(R, N);
      }
    }
    const S = document.createElement("span");
    S.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(S, n), S.appendChild(n), this._wrapper = S;
    const q = document.createElement("input");
    q.type = "hidden", q.name = E, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && q.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", q), this._hidden = q;
    const T = document.createElement("input");
    T.type = "date", T.tabIndex = -1, T.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", q.insertAdjacentElement("afterend", T), this._picker = T, n.type = "text";
    const x = document.createElement("button");
    if (x.type = "button", x.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), x.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', T.insertAdjacentElement("afterend", x), this._btn = x, this._lastISO = "", Object.defineProperty(q, "value", {
      get: function() {
        return w.get.call(q);
      },
      set: function(k) {
        if (w.set.call(q, k), k && k !== "") {
          const R = r(k);
          R && m(d, k, R);
        } else k === "" && _(d);
      }
    }), ue(n, w, {
      get: function() {
        return w.get.call(n);
      },
      set: function(k, R) {
        if (d._isFormatting) {
          R(k);
          return;
        }
        if (!k || k === "") {
          R(""), _(d);
          return;
        }
        const N = r(k) || t(k);
        if (N) {
          const z = u(N), H = n.getAttribute(c) || "", U = W(n), K = o(N, H, U);
          R(K), m(d, z, N, K);
        } else
          R(String(k)), _(d);
      }
    }), this._onPickerChange = function() {
      const k = T.value;
      if (k) {
        const R = r(k);
        R && m(d, k, R);
      } else
        _(d);
    }, T.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const k = d.dom.value.trim();
      if (k === "") {
        d._lastISO !== "" && _(d);
        return;
      }
      if (d._lastISO) {
        const N = r(d._lastISO);
        if (N) {
          const z = d.dom.getAttribute(c) || "", H = W(d.dom);
          if (k === o(N, z, H)) return;
        }
      }
      const R = t(k);
      if (R) {
        const N = u(R);
        m(d, N, R);
      } else if (d._lastISO) {
        const N = r(d._lastISO);
        N && d._displayFormatted(N);
      } else
        d.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, x.addEventListener("click", this._onBtnClick), g && g !== "") {
      const k = r(g);
      k && m(d, g, k);
    }
    return this;
  }
  function r(n) {
    if (!n || typeof n != "string") return null;
    const d = n.split("T"), g = d[0].split("-");
    if (g.length < 3) return null;
    const E = parseInt(g[0], 10), v = parseInt(g[1], 10) - 1, A = parseInt(g[2], 10);
    if (isNaN(E) || isNaN(v) || isNaN(A)) return null;
    let S = 0, q = 0;
    if (d[1]) {
      const x = d[1].split(":");
      S = parseInt(x[0], 10) || 0, q = parseInt(x[1], 10) || 0;
    }
    const T = new Date(E, v, A, S, q);
    return T.getFullYear() !== E || T.getMonth() !== v || T.getDate() !== A ? null : T;
  }
  function t(n) {
    if (!n || typeof n != "string" || (n = n.trim(), n.length < 6)) return null;
    let d, g;
    if (n.indexOf(".") !== -1)
      d = ".", g = n.split(".");
    else if (n.indexOf("/") !== -1)
      d = "/", g = n.split("/");
    else if (n.indexOf("-") !== -1)
      d = "-", g = n.split("-");
    else
      return null;
    if (g.length !== 3) return null;
    const E = [];
    for (let T = 0; T < 3; T++) {
      const x = parseInt(g[T], 10);
      if (isNaN(x)) return null;
      E.push(x);
    }
    let v, A, S;
    d === "." ? (v = E[0], A = E[1], S = E[2]) : d === "/" ? (A = E[0], v = E[1], S = E[2]) : g[0].length === 4 ? (S = E[0], A = E[1], v = E[2]) : (v = E[0], A = E[1], S = E[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
    const q = new Date(S, A - 1, v);
    return q.getFullYear() !== S || q.getMonth() !== A - 1 || q.getDate() !== v ? null : q;
  }
  i.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, i.prototype._setHiddenRaw = function(n) {
    w.set.call(this._hidden, n);
  }, i.prototype._displayFormatted = function(n) {
    const d = this.dom.getAttribute(c) || "", g = W(this.dom);
    this._isFormatting = !0, this.dom.value = o(n, d, g), this._isFormatting = !1;
  }, Object.defineProperty(i.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : w.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const g = r(n) || t(n);
        if (!g) return;
        const E = u(g);
        this._rawValue = E, this.dom.setAttribute("data-ln-value", E), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        _(this);
        return;
      }
      const d = r(n);
      d && m(this, n, d);
    }
  }), Object.defineProperty(i.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? r(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = u(n);
    }
  }), Object.defineProperty(i.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), i.prototype.destroy = function() {
    if (!this.dom[a]) return;
    if (this.isTextElement) {
      L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function e() {
    new MutationObserver(function() {
      const n = document.querySelectorAll("[" + c + "]");
      for (let d = 0; d < n.length; d++) {
        const g = n[d][a];
        if (g) {
          if (g.isTextElement)
            g._formatTextContent();
          else if (g.value) {
            const E = r(g.value);
            E && g._displayFormatted(E);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(c, a, i, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(n) {
      const d = n[a];
      if (d) {
        if (d.isTextElement)
          d._initTextElement();
        else if (d.value) {
          const g = r(d.value);
          g && d._displayFormatted(g);
        }
      }
    }
  }), e();
})();
(function() {
  const c = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const f = history.pushState;
    history.pushState = function() {
      f.apply(history, arguments);
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
  function y(f) {
    return this.dom = f, this.activeClass = f.getAttribute(c) || "active", this.exact = f.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(f, { childList: !0, subtree: !0 }), this.update(), this;
  }
  y.prototype.update = function() {
    if (!this.activeClass || G(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const h = Array.from(this.dom.querySelectorAll("a")), s = window.location.pathname, l = w(s), o = [];
    for (const u of h) {
      const p = u.getAttribute("href");
      if (!p || p === "#" || p.startsWith("#") || p.startsWith("javascript:") || p.startsWith("mailto:") || p.startsWith("tel:")) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      if (u.hostname && u.hostname !== window.location.hostname) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      const m = w(p), _ = m === l, i = !this.exact && m !== "/" && l.startsWith(m + "/");
      _ || i ? (u.classList.add(this.activeClass), u.setAttribute("aria-current", "page"), o.push(u)) : (u.classList.remove(this.activeClass), u.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: o });
  }, y.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const f = history._lnNavCallbacks.indexOf(this.updateHandler);
    f !== -1 && history._lnNavCallbacks.splice(f, 1), L(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function w(f) {
    try {
      return new URL(f, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return f.replace(/\/$/, "") || "/";
    }
  }
  function b(f, h) {
    const s = f[a];
    if (s) {
      if (h === c) {
        if (!f.hasAttribute(c)) {
          s.destroy();
          return;
        }
        const l = s.activeClass, o = f.getAttribute(c) || "active";
        if (l !== o) {
          const u = f.querySelectorAll("a");
          for (const p of u)
            l && p.classList.remove(l);
          s.activeClass = o;
        }
      } else h === "data-ln-nav-exact" && (s.exact = f.hasAttribute("data-ln-nav-exact"));
      s.update();
    }
  }
  B(c, a, y, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: b
  });
})();
(function() {
  const c = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function y(f, h) {
    const s = (f.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (s) return s;
    if (f.tagName !== "A") return "";
    const l = f.getAttribute("href") || "";
    if (!l.startsWith("#")) return "";
    const o = l.slice(1);
    if (!o) return "";
    const u = o.split("&");
    if (h)
      for (const _ of u) {
        const i = _.indexOf(":");
        if (i > 0 && _.slice(0, i).toLowerCase().trim() === h)
          return _.slice(i + 1).toLowerCase().trim();
      }
    const p = u[u.length - 1] || "", m = p.indexOf(":");
    return (m > 0 ? p.slice(m + 1) : p).toLowerCase().trim();
  }
  function w(f) {
    return this.dom = f, this.activeKey = null, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const f = this.tabs.filter((l) => l.tagName === "A" && (l.getAttribute("href") || "").startsWith("#")), h = f.length > 0 && f.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = h && !!this.nsKey, f.length > 0 && f.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : h && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const l of this.tabs) {
      const o = y(l, this.nsKey);
      o ? this.mapTabs[o] = l : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', l);
    }
    for (const l of this.panels) {
      const o = (l.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = l);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const l of this.tabs) {
      if (l[a + "Trigger"]) continue;
      const o = function(u) {
        const p = l.tagName === "A";
        if (!p && (u.ctrlKey || u.metaKey || u.button === 1)) return;
        const m = y(l, s.nsKey);
        m && (p && !Gt(u) || (s.hashEnabled ? J(s.nsKey) === m ? s.dom.setAttribute("data-ln-tabs-active", m) : Y(s.nsKey, m) : s.dom.setAttribute("data-ln-tabs-active", m)));
      };
      l.addEventListener("click", o), l[a + "Trigger"] = o, s._clickHandlers.push({ el: l, handler: o });
    }
    if (this._onRequestSelect = function(l) {
      const o = l.detail && (l.detail.key || l.detail.tab);
      o && s.select(o);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const l = J(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", l !== null ? l : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let l = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const o = kt("tabs", this.dom);
        o !== null && o in this.mapPanels && (l = o);
      }
      this.dom.setAttribute("data-ln-tabs-active", l);
    }
  }
  w.prototype.select = function(f) {
    const h = (f + "").toLowerCase().trim();
    h && (this.hashEnabled ? J(this.nsKey) === h ? this.dom.setAttribute("data-ln-tabs-active", h) : Y(this.nsKey, h) : this.dom.setAttribute("data-ln-tabs-active", h));
  }, w.prototype._applyActive = function(f) {
    var s;
    if ((!f || !(f in this.mapPanels)) && (f = this.defaultKey), f === this.activeKey) return;
    const h = this.activeKey;
    if (h !== null && G(this.dom, "ln-tabs:before-change", {
      key: f,
      previousKey: h,
      tab: this.mapTabs[f],
      panel: this.mapPanels[f],
      target: this.dom
    }).defaultPrevented) {
      h in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", h), this.hashEnabled && J(this.nsKey) !== h && Y(this.nsKey, h));
      return;
    }
    this.activeKey = f;
    for (const l in this.mapTabs) {
      const o = this.mapTabs[l];
      l === f ? (o.setAttribute("data-active", ""), o.setAttribute("aria-selected", "true")) : (o.removeAttribute("data-active"), o.setAttribute("aria-selected", "false"));
    }
    for (const l in this.mapPanels) {
      const o = this.mapPanels[l], u = l === f;
      o.classList.toggle("hidden", !u), o.setAttribute("aria-hidden", u ? "false" : "true");
    }
    if (this.autoFocus) {
      const l = (s = this.mapPanels[f]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      l && setTimeout(() => l.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", {
      key: f,
      previousKey: h,
      tab: this.mapTabs[f],
      panel: this.mapPanels[f],
      target: this.dom
    }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && ut("tabs", this.dom, f);
  }, w.prototype.destroy = function() {
    if (this.dom[a]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: f, handler: h } of this._clickHandlers)
        f.removeEventListener("click", h), delete f[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), L(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, B(c, a, w, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(f) {
      const h = f.getAttribute("data-ln-tabs-active");
      f[a]._applyActive(h);
    }
  });
})();
(function() {
  const c = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function y(f, h) {
    const s = document.querySelectorAll(
      '[data-ln-toggle-for="' + f.id + '"]'
    );
    for (const l of s)
      l.setAttribute("aria-expanded", h ? "true" : "false");
  }
  function w(f) {
    this.dom = f;
    const h = this;
    if (this._onRequestOpen = function() {
      h.open();
    }, this._onRequestClose = function() {
      h.close();
    }, this._onRequestToggle = function() {
      h.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), f.hasAttribute("data-ln-persist")) {
      const s = kt("toggle", f);
      s !== null && f.setAttribute(c, s);
    }
    return this.isOpen = f.getAttribute(c) === "open", this.isOpen && f.classList.add("open"), y(f, this.isOpen), this;
  }
  w.prototype.open = function() {
    this.dom.setAttribute(c, "open");
  }, w.prototype.close = function() {
    this.dom.setAttribute(c, "close");
  }, w.prototype.toggle = function() {
    const f = this.dom.getAttribute(c);
    this.dom.setAttribute(c, f === "open" ? "close" : "open");
  }, w.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), L(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function b(f) {
    const h = f[a];
    if (!h) return;
    const l = f.getAttribute(c) === "open";
    if (l !== h.isOpen)
      if (l) {
        if (G(f, "ln-toggle:before-open", { target: f }).defaultPrevented) {
          f.setAttribute(c, "close");
          return;
        }
        h.isOpen = !0, f.classList.add("open"), y(f, !0), L(f, "ln-toggle:open", { target: f }), f.hasAttribute("data-ln-persist") && ut("toggle", f, "open");
      } else {
        if (G(f, "ln-toggle:before-close", { target: f }).defaultPrevented) {
          f.setAttribute(c, "open");
          return;
        }
        h.isOpen = !1, f.classList.remove("open"), y(f, !1), L(f, "ln-toggle:close", { target: f }), f.hasAttribute("data-ln-persist") && ut("toggle", f, "close");
      }
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const h = f.target.closest("[data-ln-toggle-for]");
    if (h) {
      const s = h.getAttribute("data-ln-toggle-for"), l = document.getElementById(s);
      if (l && l[a]) {
        f.preventDefault();
        const o = h.getAttribute("data-ln-toggle-action") || "toggle";
        if (o === "open")
          l.setAttribute(c, "open");
        else if (o === "close")
          l.setAttribute(c, "close");
        else if (o === "toggle") {
          const u = l.getAttribute(c);
          l.setAttribute(c, u === "open" ? "close" : "open");
        }
      }
    }
  }), B(c, a, w, "ln-toggle", {
    onAttributeChange: b
  });
})();
(function() {
  const c = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function y(w) {
    return this.dom = w, this._onToggleOpen = function(b) {
      if (b.detail.target.closest("[data-ln-accordion]") !== w) return;
      const f = w.querySelectorAll("[data-ln-toggle]");
      for (const h of f)
        h !== b.detail.target && h.closest("[data-ln-accordion]") === w && h.getAttribute("data-ln-toggle") === "open" && h.setAttribute("data-ln-toggle", "close");
      L(w, "ln-accordion:change", { target: b.detail.target });
    }, w.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(c, a, y, "ln-accordion");
})();
(function() {
  const c = "data-ln-dropdown", a = "lnDropdown", y = "data-ln-dropdown-position", w = "data-ln-dropdown-placement", b = "bottom-end";
  if (window[a] !== void 0) return;
  function f(h) {
    this.dom = h, this.toggleEl = h.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = h.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const s = this;
    return this._onRequestOpen = function() {
      s.toggleEl && s.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      s.toggleEl && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (s.toggleEl) {
        const l = s.toggleEl.getAttribute("data-ln-toggle");
        s.toggleEl.setAttribute("data-ln-toggle", l === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(l) {
      const o = s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (l.key === "Escape") {
        o && (l.preventDefault(), l.stopPropagation(), s.toggleEl.setAttribute("data-ln-toggle", "close"), s.triggerBtn && s.triggerBtn.focus());
        return;
      }
      if (l.key === "Tab") {
        o && (s.triggerBtn && s.triggerBtn.focus(), s.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const u = s._getMenuItems();
      if (u.length === 0) return;
      if (!o && (l.key === "ArrowDown" || l.key === "ArrowUp")) {
        l.preventDefault(), s.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const m = s._getMenuItems();
          m.length > 0 && s._focusItem(m, l.key === "ArrowDown" ? 0 : m.length - 1);
        }, 0);
        return;
      }
      if (!o) return;
      const p = u.indexOf(document.activeElement);
      if (l.key === "ArrowDown") {
        l.preventDefault();
        const m = p < u.length - 1 ? p + 1 : 0;
        s._focusItem(u, m);
      } else if (l.key === "ArrowUp") {
        l.preventDefault();
        const m = p > 0 ? p - 1 : u.length - 1;
        s._focusItem(u, m);
      } else l.key === "Home" ? (l.preventDefault(), s._focusItem(u, 0)) : l.key === "End" && (l.preventDefault(), s._focusItem(u, u.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(l) {
      !l.detail || l.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "true"), typeof s.toggleEl.showPopover == "function" && s.toggleEl.showPopover(), s._initMenuAria(), s._reposition(), s._addOutsideClickListener(), s._addScrollRepositionListener(), s._addResizeCloseListener(), L(h, "ln-dropdown:open", { target: l.detail.target }));
    }, this._onToggleClose = function(l) {
      !l.detail || l.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "false"), s._removeOutsideClickListener(), s._removeScrollRepositionListener(), s._removeResizeCloseListener(), s.toggleEl.style.top = "", s.toggleEl.style.left = "", s.toggleEl.removeAttribute(w), typeof s.toggleEl.hidePopover == "function" && s.toggleEl.matches(":popover-open") && s.toggleEl.hidePopover(), L(h, "ln-dropdown:close", { target: l.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  f.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const h = this.toggleEl.querySelectorAll("li");
    for (const l of h)
      l.setAttribute("role", "none");
    const s = this._getMenuItems();
    for (let l = 0; l < s.length; l++)
      s[l].setAttribute("role", "menuitem"), s[l].setAttribute("tabindex", l === 0 ? "0" : "-1");
  }, f.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, f.prototype._focusItem = function(h, s) {
    for (let l = 0; l < h.length; l++)
      h[l].setAttribute("tabindex", l === s ? "0" : "-1");
    h[s] && h[s].focus();
  }, f.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const h = this.triggerBtn.getBoundingClientRect(), s = Bt(this.toggleEl), l = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, o = this.dom.getAttribute(y) || b, u = Tt(h, s, o, l);
    this.toggleEl.style.top = u.top + "px", this.toggleEl.style.left = u.left + "px", this.toggleEl.setAttribute(w, u.placement);
  }, f.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const h = this;
    this._boundDocClick = function(s) {
      h.dom.contains(s.target) || h.toggleEl && h.toggleEl.contains(s.target) || h.toggleEl && h.toggleEl.getAttribute("data-ln-toggle") === "open" && h.toggleEl.setAttribute("data-ln-toggle", "close");
    }, h._docClickTimeout = setTimeout(function() {
      h._docClickTimeout = null, document.addEventListener("click", h._boundDocClick);
    }, 0);
  }, f.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, f.prototype._addScrollRepositionListener = function() {
    const h = this;
    this._boundScrollReposition = function() {
      h._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, f.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, f.prototype._addResizeCloseListener = function() {
    const h = this;
    this._boundResizeClose = function() {
      h.toggleEl && h.toggleEl.getAttribute("data-ln-toggle") === "open" && h.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, f.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, f.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(w), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), L(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(c, a, f, "ln-dropdown");
})();
(function() {
  const c = "data-ln-popover", a = "lnPopover", y = "data-ln-popover-for", w = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const b = [];
  let f = null;
  function h() {
    f || (f = function(u) {
      if (u.key !== "Escape" || b.length === 0) return;
      b[b.length - 1].close();
    }, document.addEventListener("keydown", f));
  }
  function s() {
    b.length > 0 || f && (document.removeEventListener("keydown", f), f = null);
  }
  function l(u) {
    this.dom = u, this.isOpen = u.getAttribute(c) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const p = this;
    return this._onRequestOpen = function(m) {
      const _ = m.detail && m.detail.trigger ? m.detail.trigger : null;
      p.open(_);
    }, this._onRequestClose = function() {
      p.close();
    }, this._onRequestToggle = function(m) {
      const _ = m.detail && m.detail.trigger ? m.detail.trigger : null;
      p.toggle(_);
    }, u.addEventListener("ln-popover:request-open", this._onRequestOpen), u.addEventListener("ln-popover:request-close", this._onRequestClose), u.addEventListener("ln-popover:request-toggle", this._onRequestToggle), u.hasAttribute("tabindex") || u.setAttribute("tabindex", "-1"), u.hasAttribute("role") || u.setAttribute("role", "dialog"), u.hasAttribute("popover") || u.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  l.prototype.open = function(u) {
    this.isOpen || (this.trigger = u || null, this.dom.setAttribute(c, "open"));
  }, l.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(c, "closed");
  }, l.prototype.toggle = function(u) {
    this.isOpen ? this.close() : this.open(u);
  }, l.prototype._applyOpen = function(u) {
    this.isOpen = !0, u && (this.trigger = u), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const p = Bt(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(w) || "bottom", e = Tt(r, p, t, 8);
      this.dom.style.top = e.top + "px", this.dom.style.left = e.left + "px", this.dom.setAttribute("data-ln-popover-placement", e.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const m = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), _ = Array.prototype.find.call(m, Ct);
    _ ? _.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(r) {
      i.dom.contains(r.target) || i.trigger && i.trigger.contains(r.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const r = i.trigger.getBoundingClientRect(), t = Bt(i.dom), e = i.dom.getAttribute(w) || "bottom", n = Tt(r, t, e, 8);
      i.dom.style.top = n.top + "px", i.dom.style.left = n.left + "px", i.dom.setAttribute("data-ln-popover-placement", n.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), b.push(this), h(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, l.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const u = b.indexOf(this);
    u !== -1 && b.splice(u, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, l.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[a], L(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(u) {
    this.dom = u;
    const p = u.getAttribute(y);
    return u.setAttribute("aria-haspopup", "dialog"), u.setAttribute("aria-expanded", "false"), u.setAttribute("aria-controls", p), this._onClick = function(m) {
      if (m.ctrlKey || m.metaKey || m.button === 1) return;
      m.preventDefault();
      const _ = document.getElementById(p);
      if (!_) return;
      _[a] && (_[a].trigger = u);
      const i = _.getAttribute(c);
      _.setAttribute(c, i === "open" ? "closed" : "open");
    }, u.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, B(c, a, l, "ln-popover", {
    onAttributeChange: function(u) {
      const p = u[a];
      if (!p) return;
      const _ = u.getAttribute(c) === "open";
      if (_ !== p.isOpen)
        if (_) {
          if (G(u, "ln-popover:before-open", {
            popoverId: u.id,
            target: u,
            trigger: p.trigger
          }).defaultPrevented) {
            u.setAttribute(c, "closed");
            return;
          }
          p._applyOpen(p.trigger);
        } else {
          if (G(u, "ln-popover:before-close", {
            popoverId: u.id,
            target: u,
            trigger: p.trigger
          }).defaultPrevented) {
            u.setAttribute(c, "open");
            return;
          }
          p._applyClose();
        }
    }
  }), B(y, a + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const c = "data-ln-tooltip-enhance", a = "data-ln-tooltip", y = "data-ln-tooltip-position", w = "lnTooltipEnhance", b = "ln-tooltip-portal";
  if (window[w] !== void 0) return;
  let f = 0, h = null, s = null, l = null, o = null, u = null, p = null;
  function m() {
    return h && h.parentNode || (h = document.getElementById(b), h || (h = document.createElement("div"), h.id = b, document.body.appendChild(h)), h.hasAttribute("popover") || h.setAttribute("popover", "manual")), h;
  }
  function _() {
    p || (p = function(n) {
      n.key === "Escape" && t();
    }, document.addEventListener("keydown", p));
  }
  function i() {
    p && (document.removeEventListener("keydown", p), p = null);
  }
  function r(n) {
    if (l === n) return;
    t();
    const d = n.getAttribute(a) || n.getAttribute("title");
    if (!d) return;
    m(), typeof h.showPopover == "function" && h.showPopover(), n.hasAttribute("title") && (o = n.getAttribute("title"), n.removeAttribute("title"));
    const g = n.getAttribute("aria-describedby");
    g ? u = g : u = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = d, n[w + "Uid"] || (f += 1, n[w + "Uid"] = "ln-tooltip-" + f), E.id = n[w + "Uid"], h.appendChild(E);
    const v = E.offsetWidth, A = E.offsetHeight, S = n.getBoundingClientRect(), q = n.getAttribute(y) || "top", T = Tt(S, { width: v, height: A }, q, 6);
    E.style.top = T.top + "px", E.style.left = T.left + "px", E.setAttribute("data-ln-tooltip-placement", T.placement), u ? n.setAttribute("aria-describedby", u + " " + E.id) : n.setAttribute("aria-describedby", E.id), s = E, l = n, _();
  }
  function t() {
    if (!s) {
      i();
      return;
    }
    l && (u !== null ? l.setAttribute("aria-describedby", u) : l.removeAttribute("aria-describedby"), u = null, o !== null && l.setAttribute("title", o)), o = null, s.parentNode && s.parentNode.removeChild(s), s = null, l = null, h && typeof h.hidePopover == "function" && h.matches(":popover-open") && h.hidePopover(), i();
  }
  function e(n) {
    return this.dom = n, n.hasAttribute("data-ln-tooltip-enhanced") || (n.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(n);
    }, this._onLeave = function() {
      l === n && !n.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      r(n);
    }, this._onBlur = function() {
      l === n && !n.matches(":hover") && t();
    }, n.addEventListener("mouseenter", this._onEnter), n.addEventListener("mouseleave", this._onLeave), n.addEventListener("focus", this._onFocus, !0), n.addEventListener("blur", this._onBlur, !0), this;
  }
  e.prototype.destroy = function() {
    const n = this.dom;
    n.removeEventListener("mouseenter", this._onEnter), n.removeEventListener("mouseleave", this._onLeave), n.removeEventListener("focus", this._onFocus, !0), n.removeEventListener("blur", this._onBlur, !0), l === n && t(), this._addedEnhancedAttr && n.removeAttribute("data-ln-tooltip-enhanced"), delete n[w], delete n[w + "Uid"], L(n, "ln-tooltip:destroyed", { trigger: n });
  }, B(
    "[" + c + "], [data-ln-tooltip-enhanced], [" + a + "][title]",
    w,
    e,
    "ln-tooltip"
  );
})();
(function() {
  const c = "data-ln-toast", a = "lnToast", y = "ln-toast-item";
  if (window[a] !== void 0) return;
  function w(i) {
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
  function b(i) {
    if (!i || !(i instanceof HTMLElement)) return;
    if (i.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof i.hidePopover == "function" && i.matches(":popover-open"))
      try {
        i.hidePopover();
      } catch {
      }
  }
  function f(i) {
    this.dom = i, i[a] = this, this.timeoutDefault = parseInt(i.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(i.getAttribute("data-ln-toast-max") || "5", 10);
    const r = Array.from(i.querySelectorAll("[data-ln-toast-item]"));
    for (; r.length > this.max; ) i.removeChild(r.shift());
    for (const t of r) p(t, this);
    return r.length > 0 && w(i), this;
  }
  f.prototype.enqueue = function(i) {
    if (!i) return;
    const r = h(i, this.dom);
    if (!r) return;
    const t = Number.isFinite(i.timeout) ? i.timeout : this.timeoutDefault;
    l(this, r), t > 0 && (r._timer = setTimeout(() => o(r), t));
  }, f.prototype.clear = function() {
    for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      o(i);
  }, f.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        o(i);
      b(this.dom), L(this.dom, "ln-toast:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function h(i, r) {
    const t = ((i.type || "") + "").trim().toLowerCase(), e = ct(r, y, "ln-toast");
    if (!e)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    nt(e, {
      type: t,
      title: i.title,
      message: typeof i.message == "string" ? i.message : void 0
    });
    const n = e.firstElementChild;
    if (!n) return null;
    n.hasAttribute("data-ln-toast-item") || n.setAttribute("data-ln-toast-item", ""), n.classList.add("ln-enter");
    const d = n.querySelector(".body");
    d && s(d, i);
    const g = n.querySelector("[data-ln-toast-close]");
    return g && g.addEventListener("click", function() {
      o(n);
    }), n;
  }
  function s(i, r) {
    if (Array.isArray(r.message)) {
      const t = document.createElement("ul");
      for (const e of r.message) {
        const n = document.createElement("li");
        n.textContent = e, t.appendChild(n);
      }
      i.appendChild(t);
    }
    if (r.data && r.data.errors) {
      const t = document.createElement("ul");
      for (const e of Object.values(r.data.errors).flat()) {
        const n = document.createElement("li");
        n.textContent = e, t.appendChild(n);
      }
      i.appendChild(t);
    }
  }
  function l(i, r) {
    const t = Array.from(i.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length >= i.max && t.length > 0; ) i.dom.removeChild(t.shift());
    i.dom.appendChild(r), w(i.dom), requestAnimationFrame(() => r.classList.remove("ln-enter"));
  }
  function o(i) {
    if (!i || !i.parentNode) return;
    const r = i.parentNode;
    clearTimeout(i._timer), i.classList.remove("ln-enter"), i.classList.add("ln-out"), setTimeout(() => {
      i.parentNode && (i.parentNode.removeChild(i), b(r));
    }, 200);
  }
  function u(i) {
    let r = i && i.container;
    return typeof r == "string" && (r = document.querySelector(r)), r instanceof HTMLElement || (r = document.querySelector("[" + c + "]") || document.getElementById("ln-toast-container")), r || null;
  }
  function p(i, r) {
    if (i._lnToastHydrated) return;
    i._lnToastHydrated = !0;
    const t = i.querySelector("[data-ln-toast-close]");
    t && t.addEventListener("click", function() {
      o(i);
    });
    const e = i.getAttribute("data-ln-toast-timeout"), n = e !== null ? parseInt(e, 10) : NaN, d = Number.isFinite(n) ? n : r.timeoutDefault;
    d > 0 && (i._timer = setTimeout(function() {
      o(i);
    }, d));
  }
  function m(i) {
    const r = i.detail || {}, t = u(r);
    if (!t) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (t[a] || (t[a] = new f(t))).enqueue(r);
  }
  function _(i) {
    const r = i && i.detail || {};
    if (r.container) {
      const t = u(r);
      t && (t[a] || (t[a] = new f(t))).clear();
    } else {
      const t = document.querySelectorAll("[" + c + "]");
      for (const e of Array.from(t))
        (e[a] || (e[a] = new f(e))).clear();
    }
  }
  lt(function() {
    window.addEventListener("ln-toast:enqueue", m), window.addEventListener("ln-toast:clear", _), window.addEventListener("ln-modal:open", function() {
      const i = document.querySelectorAll("[" + c + "]");
      for (const r of Array.from(i))
        r.querySelectorAll("[data-ln-toast-item]").length > 0 && w(r);
    });
  }, "ln-toast"), B(c, a, f, "ln-toast");
})();
(function() {
  const c = "data-ln-upload", a = "lnUpload", y = "data-ln-upload-dict", w = "data-ln-upload-accept", b = "data-ln-upload-delete", f = "data-ln-upload-max-size", h = "data-ln-upload-max-files", s = "data-ln-upload-file-field", l = "data-ln-upload-ids-field", o = "file", u = "file_ids[]";
  if (window[a] !== void 0) return;
  function p(e) {
    return e ? e.split(",").map(function(n) {
      return n.trim().toLowerCase();
    }).filter(Boolean).map(function(n) {
      return n.startsWith(".") ? n.slice(1) : n;
    }) : null;
  }
  function m(e) {
    return !e || !e.includes(".") ? "" : e.split(".").pop().toLowerCase();
  }
  function _(e, n) {
    if (!n || n.length === 0) return !0;
    const d = m(e.name), g = (e.type || "").toLowerCase();
    return n.some(function(E) {
      if (E.includes("/")) {
        if (E.endsWith("/*")) {
          const v = E.slice(0, -1);
          return g.startsWith(v);
        }
        return g === E;
      }
      return d === E;
    });
  }
  function i(e, n, d) {
    if (typeof e != "number" || isNaN(e) || e === 0)
      return "0 " + (d["unit-b"] || "B");
    const g = 1024, E = [
      d["unit-b"] || "B",
      d["unit-kb"] || "KB",
      d["unit-mb"] || "MB",
      d["unit-gb"] || "GB"
    ], v = Math.floor(Math.log(e) / Math.log(g)), A = Math.min(v, E.length - 1), S = e / Math.pow(g, A);
    return new Intl.NumberFormat(n, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0
    }).format(S) + " " + E[A];
  }
  function r() {
    const e = document.querySelector('meta[name="csrf-token"]');
    return e ? e.getAttribute("content") : "";
  }
  function t(e) {
    this.dom = e, this.dict = xt(e, y), this.locale = W(e), this.zone = e.querySelector("[data-ln-upload-zone]") || e, this.list = e.querySelector("[data-ln-upload-list]"), this.input = e.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', e), this.uploadUrl = e.getAttribute(c) || "", this.deleteUrlPattern = e.getAttribute(b) || "", this.fileFieldName = e.getAttribute(s) || o, this.idsFieldName = e.getAttribute(l) || u, this.maxSize = parseInt(e.getAttribute(f), 10) || 0, this.maxFiles = parseInt(e.getAttribute(h), 10) || 0;
    const n = e.getAttribute(w) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = p(n), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  t.prototype._hydrate = function() {
    const e = this;
    if (!this.list) return;
    const n = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let g = 0; g < n.length; g++) {
      const E = n[g], v = E.getAttribute("data-ln-upload-id"), A = "file-" + ++e.fileIdCounter;
      E.setAttribute("data-ln-upload-local-id", A);
      const S = E.querySelector('[data-ln-field="name"]'), q = E.querySelector('[data-ln-field="sizeText"]'), T = E.getAttribute("data-ln-upload-size"), x = T ? parseInt(T, 10) : null;
      e.uploadedFiles.set(A, {
        serverId: v || null,
        name: S ? S.textContent.trim() : "",
        size: x !== null && !isNaN(x) ? x : q ? q.textContent.trim() : ""
      });
    }
    const d = this.dom.querySelectorAll('input[type="hidden"]');
    for (let g = 0; g < d.length; g++) {
      const E = d[g];
      if (E.name === e.idsFieldName && E.value && !Array.from(e.uploadedFiles.values()).some(function(A) {
        return String(A.serverId) === String(E.value);
      })) {
        const A = "file-" + ++e.fileIdCounter;
        e.uploadedFiles.set(A, {
          serverId: E.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, t.prototype._syncHiddenInputs = function() {
    const e = this, n = this.dom.querySelectorAll('input[type="hidden"]');
    for (let d = 0; d < n.length; d++)
      n[d].name === e.idsFieldName && n[d].remove();
    for (const [, d] of this.uploadedFiles)
      if (d.serverId) {
        const g = document.createElement("input");
        g.type = "hidden", g.name = e.idsFieldName, g.value = d.serverId, e.dom.appendChild(g);
      }
  }, t.prototype._bindEvents = function() {
    const e = this;
    this._onZoneClick = function(n) {
      e.zone === e.dom && n.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || e.input && n.target !== e.input && e.input.click();
    }, this._onInputChange = function() {
      e.input && e.input.files && (e.upload(e.input.files), e.input.value = "");
    }, this._onDragEnter = function(n) {
      n.preventDefault(), n.stopPropagation(), e._dragDepth++, e.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(n) {
      n.preventDefault(), n.stopPropagation(), e.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(n) {
      n.preventDefault(), n.stopPropagation(), e._dragDepth--, e._dragDepth <= 0 && (e._dragDepth = 0, e.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(n) {
      n.preventDefault(), n.stopPropagation(), e._dragDepth = 0, e.zone.removeAttribute("data-ln-upload-state"), n.dataTransfer && n.dataTransfer.files && e.upload(n.dataTransfer.files);
    }, this._onListClick = function(n) {
      const d = n.target.closest('[data-ln-upload-action="remove"]');
      if (!d || !e.list || !e.list.contains(d) || d.disabled) return;
      const g = d.closest("[data-ln-upload-item]");
      if (g) {
        const E = g.getAttribute("data-ln-upload-local-id");
        E && e.remove(E);
      }
    }, this._onRequestUpload = function(n) {
      n.detail && n.detail.files && e.upload(n.detail.files);
    }, this._onRequestRemove = function(n) {
      if (n.detail) {
        const d = n.detail.localId !== void 0 ? n.detail.localId : n.detail.serverId;
        d !== void 0 && e.remove(d);
      }
    }, this._onRequestClear = function() {
      e.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, t.prototype.upload = function(e) {
    const n = this, d = Array.from(e);
    for (let g = 0; g < d.length; g++) {
      const E = d[g];
      if (n.maxFiles > 0 && n.uploadedFiles.size >= n.maxFiles) {
        L(n.dom, "ln-upload:invalid", {
          file: E,
          reason: "max-files"
        });
        continue;
      }
      if (!_(E, n.allowedExts)) {
        L(n.dom, "ln-upload:invalid", {
          file: E,
          reason: "accept"
        });
        continue;
      }
      if (n.maxSize > 0 && E.size > n.maxSize) {
        L(n.dom, "ln-upload:invalid", {
          file: E,
          reason: "max-size"
        });
        continue;
      }
      G(n.dom, "ln-upload:before-upload", { file: E }).defaultPrevented || n._uploadSingleFile(E);
    }
  }, t.prototype._uploadSingleFile = function(e) {
    const n = this, d = "file-" + ++n.fileIdCounter, g = m(e.name);
    let E = null;
    if (this.list) {
      const T = ct(this.dom, "ln-upload-item", "ln-upload");
      if (T && (E = T.firstElementChild, E)) {
        E.setAttribute("data-ln-upload-item", ""), E.setAttribute("data-ln-upload-local-id", d), E.setAttribute("data-ln-upload-ext", g), E.setAttribute("data-ln-upload-state", "uploading"), nt(E, {
          name: e.name,
          sizeText: "0%",
          removeLabel: n.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const x = E.querySelector('[data-ln-upload-action="remove"]');
        x && (x.disabled = !0);
        const k = E.querySelector("[data-ln-progress]");
        k && k.setAttribute("data-ln-progress", "0"), n.list.appendChild(E);
      }
    }
    const v = new FormData();
    v.append(n.fileFieldName, e);
    const A = this.dom.querySelectorAll("input, select, textarea");
    for (let T = 0; T < A.length; T++) {
      const x = A[T];
      !x.name || x.name === n.idsFieldName || x.type === "file" || (x.type === "checkbox" || x.type === "radio") && !x.checked || v.append(x.name, x.value);
    }
    const S = new XMLHttpRequest();
    n.uploadedFiles.set(d, {
      serverId: null,
      name: e.name,
      size: e.size,
      xhr: S
    }), S.upload.addEventListener("progress", function(T) {
      if (T.lengthComputable) {
        const x = Math.round(T.loaded / T.total * 100);
        if (E) {
          const k = E.querySelector("[data-ln-progress]");
          k && k.setAttribute("data-ln-progress", String(x)), nt(E, { sizeText: x + "%" });
        }
        L(n.dom, "ln-upload:progress", {
          localId: d,
          file: e,
          percent: x,
          loaded: T.loaded,
          total: T.total
        });
      }
    }), S.addEventListener("load", function() {
      const T = n.uploadedFiles.get(d);
      if (T && delete T.xhr, S.status >= 200 && S.status < 300) {
        let x;
        try {
          x = JSON.parse(S.responseText);
        } catch (R) {
          q(n.dict.error || "Error", S.status, R);
          return;
        }
        const k = x.id || x.serverId;
        if (E) {
          E.removeAttribute("data-ln-upload-state"), k && E.setAttribute("data-ln-upload-id", String(k)), nt(E, {
            sizeText: i(x.size || e.size, n.locale, n.dict),
            uploading: !1
          });
          const R = E.querySelector('[data-ln-upload-action="remove"]');
          R && (R.disabled = !1);
        }
        T && (T.serverId = k, T.size = x.size || e.size, T.name = x.name || e.name), n._syncHiddenInputs(), L(n.dom, "ln-upload:uploaded", {
          localId: d,
          serverId: k,
          name: x.name || e.name,
          size: x.size || e.size,
          response: x
        });
      } else {
        let x = "";
        try {
          x = JSON.parse(S.responseText).message || "";
        } catch {
        }
        q(x, S.status, null);
      }
    }), S.addEventListener("error", function() {
      const T = n.uploadedFiles.get(d);
      T && delete T.xhr, q("", 0, null);
    });
    function q(T, x, k) {
      if (E) {
        E.setAttribute("data-ln-upload-state", "error"), nt(E, {
          sizeText: n.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const R = E.querySelector('[data-ln-upload-action="remove"]');
        R && (R.disabled = !1);
      }
      L(n.dom, "ln-upload:error", {
        file: e,
        message: T,
        status: x,
        error: k
      });
    }
    n.uploadUrl ? (S.open("POST", n.uploadUrl), S.setRequestHeader("X-CSRF-TOKEN", r()), S.setRequestHeader("X-Requested-With", "XMLHttpRequest"), S.setRequestHeader("Accept", "application/json"), S.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, t.prototype.remove = function(e) {
    const n = this;
    let d = null, g = null;
    if (n.uploadedFiles.has(e))
      d = e, g = n.uploadedFiles.get(e);
    else
      for (const [S, q] of n.uploadedFiles)
        if (String(q.serverId) === String(e)) {
          d = S, g = q;
          break;
        }
    if (!d || !g || G(n.dom, "ln-upload:before-remove", {
      localId: d,
      serverId: g.serverId
    }).defaultPrevented) return;
    const v = n.list ? n.list.querySelector('[data-ln-upload-local-id="' + d + '"]') : null;
    if (g.xhr && typeof g.xhr.abort == "function" && g.xhr.abort(), !g.serverId) {
      v && v.remove(), n.uploadedFiles.delete(d), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", { localId: d, serverId: null });
      return;
    }
    let A = null;
    if (n.deleteUrlPattern ? A = n.deleteUrlPattern.replace("{id}", encodeURIComponent(g.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (A = n.uploadUrl.replace("{id}", encodeURIComponent(g.serverId))), !A) {
      v && v.remove(), n.uploadedFiles.delete(d), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", { localId: d, serverId: g.serverId });
      return;
    }
    v && (v.setAttribute("data-ln-upload-state", "deleting"), nt(v, { deleting: !0 })), fetch(A, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": r(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(S) {
      S.ok ? (v && v.remove(), n.uploadedFiles.delete(d), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", {
        localId: d,
        serverId: g.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), nt(v, { deleting: !1 })), L(n.dom, "ln-upload:error", {
        file: g,
        message: "",
        status: S.status
      }));
    }).catch(function(S) {
      v && (v.removeAttribute("data-ln-upload-state"), nt(v, { deleting: !1 })), L(n.dom, "ln-upload:error", {
        file: g,
        message: "",
        status: 0,
        error: S
      });
    });
  }, t.prototype.clear = function() {
    const e = this;
    if (!G(e.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, d] of this.uploadedFiles)
        if (d.xhr && typeof d.xhr.abort == "function" && d.xhr.abort(), d.serverId) {
          let g = null;
          e.deleteUrlPattern ? g = e.deleteUrlPattern.replace("{id}", encodeURIComponent(d.serverId)) : e.uploadUrl && e.uploadUrl.includes("{id}") && (g = e.uploadUrl.replace("{id}", encodeURIComponent(d.serverId))), g && fetch(g, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": r(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      e.uploadedFiles.clear(), e.list && (e.list.innerHTML = ""), e._syncHiddenInputs(), L(e.dom, "ln-upload:cleared", {});
    }
  }, t.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(e) {
      return e.serverId;
    }).filter(Boolean);
  }, t.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(e) {
      return {
        serverId: e.serverId,
        name: e.name,
        size: e.size
      };
    });
  }, t.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const [, e] of this.uploadedFiles)
        e.xhr && typeof e.xhr.abort == "function" && e.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, L(this.dom, "ln-upload:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, B(c, a, t, "ln-upload");
})();
(function() {
  const c = "lnExternalLinks";
  if (window[c] !== void 0) return;
  function a(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function y(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !a(s)) return;
    s.target = "_blank";
    const l = (s.rel || "").split(/\s+/).filter(Boolean);
    l.includes("noopener") || l.push("noopener"), l.includes("noreferrer") || l.push("noreferrer"), s.rel = l.join(" ");
    const o = document.createElement("span");
    o.className = "sr-only", o.textContent = "(opens in new tab)", s.appendChild(o), s.setAttribute("data-ln-external-link", "processed"), L(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function w(s) {
    s = s || document.body;
    for (const l of s.querySelectorAll("a, area"))
      y(l);
  }
  function b() {
    lt(function() {
      document.body.addEventListener("click", function(s) {
        const l = s.target.closest("a, area");
        l && l.getAttribute("data-ln-external-link") === "processed" && L(l, "ln-external-links:clicked", {
          link: l,
          href: l.href,
          text: l.textContent || l.title || ""
        });
      });
    }, "ln-external-links");
  }
  function f() {
    lt(function() {
      new MutationObserver(function(l) {
        for (const o of l) {
          if (o.type === "childList") {
            for (const u of o.addedNodes)
              if (u.nodeType === 1 && (u.matches && (u.matches("a") || u.matches("area")) && y(u), u.querySelectorAll))
                for (const p of u.querySelectorAll("a, area"))
                  y(p);
          }
          if (o.type === "attributes" && o.attributeName === "href") {
            const u = o.target;
            u.matches && (u.matches("a") || u.matches("area")) && y(u);
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
    b(), f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      w();
    }) : w();
  }
  window[c] = {
    process: w
  }, h();
})();
(function() {
  const c = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let y = null;
  function w() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function b(e) {
    y && (y.textContent = e, y.classList.add("ln-link-status--visible"));
  }
  function f() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function h(e, n) {
    if (n.target.closest("a, button, input, select, textarea")) return;
    const d = e.querySelector("a");
    if (!d) return;
    const g = d.getAttribute("href");
    if (!g) return;
    if (n.ctrlKey || n.metaKey || n.button === 1) {
      window.open(g, "_blank");
      return;
    }
    G(e, "ln-link:navigate", { target: e, href: g, link: d }).defaultPrevented || d.click();
  }
  function s(e) {
    const n = e.querySelector("a");
    if (!n) return;
    const d = n.getAttribute("href");
    d && b(d);
  }
  function l() {
    f();
  }
  function o(e) {
    e[a + "Row"] || !e.querySelector("a") || (e[a + "Row"] = !0, e._lnLinkClick = function(d) {
      h(e, d);
    }, e._lnLinkEnter = function() {
      s(e);
    }, e.addEventListener("click", e._lnLinkClick), e.addEventListener("mouseenter", e._lnLinkEnter), e.addEventListener("mouseleave", l));
  }
  function u(e) {
    e[a + "Row"] && (e._lnLinkClick && e.removeEventListener("click", e._lnLinkClick), e._lnLinkEnter && e.removeEventListener("mouseenter", e._lnLinkEnter), e.removeEventListener("mouseleave", l), delete e._lnLinkClick, delete e._lnLinkEnter, delete e[a + "Row"]);
  }
  function p(e) {
    if (!e[a + "Init"]) return;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const d = n === "TABLE" && e.querySelector("tbody") || e;
      for (const g of d.querySelectorAll("tr"))
        u(g);
    } else
      u(e);
    delete e[a + "Init"];
  }
  function m(e) {
    if (e[a + "Init"]) return;
    e[a + "Init"] = !0;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const d = n === "TABLE" && e.querySelector("tbody") || e;
      for (const g of d.querySelectorAll("tr"))
        o(g);
    } else
      o(e);
  }
  function _(e) {
    e.hasAttribute && e.hasAttribute(c) && m(e);
    const n = e.querySelectorAll ? e.querySelectorAll("[" + c + "]") : [];
    for (const d of n)
      m(d);
  }
  function i() {
    lt(function() {
      new MutationObserver(function(n) {
        for (const d of n)
          if (d.type === "childList") {
            for (const g of d.addedNodes)
              if (g.nodeType === 1) {
                _(g);
                const E = g.closest("[" + c + "]");
                if (E)
                  if (g.tagName === "TR")
                    o(g);
                  else {
                    const v = E.tagName;
                    if (v === "TABLE" || v === "TBODY") {
                      const A = g.querySelectorAll ? g.querySelectorAll("tr") : [];
                      for (const S of A)
                        o(S);
                    }
                  }
              }
          } else d.type === "attributes" && (d.target.hasAttribute && d.target.hasAttribute(c) ? _(d.target) : p(d.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [c]
      });
    }, "ln-link");
  }
  function r(e) {
    _(e);
  }
  window[a] = { init: r, destroy: p };
  function t() {
    w(), i(), r(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const c = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function y(h) {
    return this.dom = h, this._attrObserver = null, this._parentObserver = null, f.call(this), w.call(this), b.call(this), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function w() {
    const h = this, s = new MutationObserver(function(l) {
      for (const o of l)
        (o.attributeName === "data-ln-progress" || o.attributeName === "data-ln-progress-max") && f.call(h);
    });
    s.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = s;
  }
  function b() {
    const h = this, s = this.dom.parentElement;
    if (!s) return;
    const l = new MutationObserver(function(o) {
      for (const u of o)
        u.attributeName === "data-ln-progress-max" && f.call(h);
    });
    l.observe(s, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = l;
  }
  function f() {
    const h = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, s = this.dom.parentElement, o = (s && s.hasAttribute("data-ln-progress-max") ? parseFloat(s.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let u = o > 0 ? h / o * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100), this.dom.style.width = u + "%";
    const p = Math.max(0, Math.min(h, o));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(o)), this.dom.setAttribute("aria-valuenow", String(p)), L(this.dom, "ln-progress:change", { target: this.dom, value: h, max: o, percentage: u });
  }
  B(
    c,
    a,
    y,
    "ln-progress"
  );
})();
(function() {
  const c = "data-ln-filter", a = "lnFilter", y = "data-ln-filter-key", w = "data-ln-filter-value", b = "data-ln-filter-hide", f = "data-ln-filter-reset", h = "data-ln-filter-col", s = "data-ln-hash", l = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function o(r) {
    return r.hasAttribute(f) || r.getAttribute(w) === "";
  }
  function u(r) {
    const t = r.dom.querySelectorAll("[" + y + "]");
    let e = null;
    const n = [];
    for (let d = 0; d < t.length; d++) {
      const g = t[d];
      if (e || (e = g.getAttribute(y)), g.checked && !o(g)) {
        const E = g.getAttribute(w);
        E && n.push(E);
      }
    }
    return { key: e, values: n, targetId: r.targetId };
  }
  function p(r, t, e) {
    const n = r.querySelectorAll("[" + y + "]"), d = Array.isArray(e) && e.length > 0;
    for (let g = 0; g < n.length; g++) {
      const E = n[g];
      o(E) ? E.checked = !d : d && E.getAttribute(y) === t && e.indexOf(E.getAttribute(w)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function m(r, t) {
    if (r.length !== t.length) return !0;
    for (let e = 0; e < r.length; e++) if (r[e] !== t[e]) return !0;
    return !1;
  }
  function _(r) {
    this.dom = r, this.targetId = r.getAttribute(c);
    const t = r.getAttribute(h);
    this.colIndex = t !== null ? parseInt(t, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = ht(r, "filter"), this.hashEnabled = !!this.nsKey;
    const e = this, n = Wt(
      function() {
        e._render();
      }
    );
    this._queueRender = n, this._attachHandlers(), this._onHashChange = function() {
      if (e._destroyed || !e.hashEnabled) return;
      const g = J(e.nsKey), E = Ht(g);
      E && E.key && E.values.length > 0 ? p(e.dom, E.key, E.values) : p(e.dom, null, []), e._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let d = !1;
    if (this.hashEnabled) {
      const g = J(this.nsKey), E = Ht(g);
      E && E.key && E.values.length > 0 && (p(r, E.key, E.values), it(function() {
        e._destroyed || e._render();
      }), d = !0);
    }
    if (!d && r.hasAttribute("data-ln-persist")) {
      const g = kt("filter", r);
      g && g.key && Array.isArray(g.values) && g.values.length > 0 && (p(r, g.key, g.values), it(function() {
        e._destroyed || e._render();
      }), d = !0);
    }
    if (!d) {
      const g = r.querySelectorAll("[" + y + "]");
      for (let E = 0; E < g.length; E++)
        if (g[E].checked && !o(g[E])) {
          it(function() {
            e._destroyed || e._render();
          });
          break;
        }
    }
    return this;
  }
  _.prototype._attachHandlers = function() {
    const r = this;
    this._onDomChange = function(t) {
      const e = t.target;
      if (!e || !e.hasAttribute || !e.hasAttribute(y)) return;
      const n = Array.from(r.dom.querySelectorAll("[" + y + "]"));
      if (o(e)) {
        for (let d = 0; d < n.length; d++)
          o(n[d]) || (n[d].checked = !1);
        e.checked = !0, r._queueRender();
        return;
      }
      if (e.checked) {
        for (let g = 0; g < n.length; g++)
          o(n[g]) && (n[g].checked = !1);
        let d = !1;
        for (let g = 0; g < n.length; g++)
          if (o(n[g])) {
            d = !0;
            break;
          }
        if (d) {
          let g = !0;
          for (let E = 0; E < n.length; E++)
            if (!o(n[E]) && !n[E].checked) {
              g = !1;
              break;
            }
          if (g)
            for (let E = 0; E < n.length; E++)
              o(n[E]) ? n[E].checked = !0 : n[E].checked = !1;
        }
      } else {
        let d = !1;
        for (let g = 0; g < n.length; g++)
          if (!o(n[g]) && n[g].checked) {
            d = !0;
            break;
          }
        if (!d)
          for (let g = 0; g < n.length; g++)
            o(n[g]) && (n[g].checked = !0);
      }
      r._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, _.prototype._render = function() {
    const r = this, t = u(this), e = this._lastSnapshot;
    if (!(!e || e.key !== t.key || m(e.values, t.values))) return;
    const d = t.key === null || t.values.length === 0, g = document.getElementById(r.targetId), E = {
      key: t.key,
      values: t.values.slice(),
      targetId: r.targetId
    };
    L(r.dom, "ln-filter:change", E);
    let v = !1;
    g && g !== r.dom && G(g, "ln-filter:change", E).defaultPrevented && (v = !0);
    const A = e && e.values.length > 0, S = t.values.length === 0;
    if (A && S) {
      const T = { targetId: r.targetId };
      L(r.dom, "ln-filter:reset", T), g && g !== r.dom && L(g, "ln-filter:reset", T);
    }
    if (this._lastSnapshot = { key: t.key, values: t.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (t.key && t.values.length > 0 ? ut("filter", this.dom, { key: t.key, values: t.values.slice() }) : ut("filter", this.dom, null)), this.hashEnabled) {
      const T = we(t.key, t.values);
      Y(this.nsKey, T);
    }
    if (v) return;
    const q = [];
    for (let T = 0; T < t.values.length; T++)
      q.push(t.values[T].toLowerCase());
    if (r.colIndex !== null)
      r._filterTableRows(t);
    else {
      if (!g) return;
      const T = g.children;
      for (let x = 0; x < T.length; x++) {
        const k = T[x];
        if (d) {
          k.removeAttribute(b);
          continue;
        }
        const R = k.getAttribute("data-" + t.key);
        k.removeAttribute(b), R !== null && q.indexOf(R.toLowerCase()) === -1 && k.setAttribute(b, "true");
      }
    }
  }, _.prototype._filterTableRows = function(r) {
    const t = document.getElementById(this.targetId);
    if (!t) return;
    const e = t.tagName === "TABLE" ? t : t.querySelector("table");
    if (!e) return;
    const n = r.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, d = r.values;
    l.has(e) || l.set(e, {});
    const g = l.get(e);
    if (n && d.length > 0) {
      const S = [];
      for (let q = 0; q < d.length; q++)
        S.push(d[q].toLowerCase());
      g[n] = { col: this.colIndex, values: S };
    } else n && delete g[n];
    const E = Object.keys(g), v = E.length > 0, A = e.tBodies;
    for (let S = 0; S < A.length; S++) {
      const q = A[S].rows;
      for (let T = 0; T < q.length; T++) {
        const x = q[T];
        if (!v) {
          x.removeAttribute(b);
          continue;
        }
        let k = !0;
        for (let R = 0; R < E.length; R++) {
          const N = g[E[R]], z = x.cells[N.col], H = z ? z.textContent.trim().toLowerCase() : "";
          if (N.values.indexOf(H) === -1) {
            k = !1;
            break;
          }
        }
        k ? x.removeAttribute(b) : x.setAttribute(b, "true");
      }
    }
  }, _.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this._destroyed = !0, this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const t = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (t && l.has(t)) {
            const e = l.get(t), n = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            n && e[n] && delete e[n], Object.keys(e).length === 0 && l.delete(t);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a];
    }
  };
  function i(r, t) {
    const e = r[a];
    !e || e._destroyed || t === s && (e.hashEnabled && e._onHashChange && window.removeEventListener("hashchange", e._onHashChange), e.nsKey = ht(r, "filter"), e.hashEnabled = !!e.nsKey, e.hashEnabled && window.addEventListener("hashchange", e._onHashChange));
  }
  B(c, a, _, "ln-filter", {
    extraAttributes: [s],
    onAttributeChange: i
  });
})();
(function() {
  const c = "data-ln-search", a = "lnSearch", y = "data-ln-search-for", w = "lnSearchControl", b = "data-ln-search-items", f = "data-ln-search-fields", h = "data-ln-search-exclude", s = "data-ln-search-hide", l = "data-ln-hash";
  if (window[a] !== void 0) return;
  function u(v) {
    const A = ht(v, "search");
    if (A) return A;
    if (v.id) {
      const S = document.querySelector("[" + y + '="' + v.id + '"]');
      if (S) {
        const q = ht(S, "search");
        if (q) return q;
      }
    }
    return null;
  }
  function p(v) {
    return (v || "").trim().toLowerCase();
  }
  function m(v) {
    return v ? v.split(/\s+/).filter(Boolean) : [];
  }
  function _(v) {
    const A = v.tagName;
    return A === "INPUT" || A === "TEXTAREA" ? v : v.querySelector('[name="search"]') || v.querySelector('input[type="search"]') || v.querySelector('input[type="text"]');
  }
  function i(v) {
    const A = v.getAttribute(f);
    if (A === null) return null;
    const S = A.split(",").map(function(q) {
      return q.trim();
    }).filter(Boolean);
    return S.length ? S : null;
  }
  function r(v, A) {
    const S = v.childNodes;
    for (let q = 0; q < S.length; q++) {
      const T = S[q];
      if (T.nodeType === 3) {
        A.push(T.nodeValue);
        continue;
      }
      T.nodeType === 1 && (T.hasAttribute(h) || r(T, A));
    }
  }
  function t(v) {
    if (v._lnSearchText !== void 0) return v._lnSearchText;
    const A = [];
    r(v, A);
    const S = A.join(" ").replace(/\s+/g, " ").toLowerCase();
    return v._lnSearchText = S, S;
  }
  function e(v, A) {
    if (!v.id) return;
    const S = document.querySelectorAll("[" + y + '="' + v.id + '"]');
    for (const q of S) {
      const T = q[w];
      T && clearTimeout(T._debounceTimer);
      const x = _(q);
      x && x.value !== A && (x.value = A);
    }
  }
  function n(v) {
    this.dom = v, this.term = v.getAttribute(c) || "", this._destroyed = !1;
    const A = this;
    return this.nsKey = u(v), this.hashEnabled = !!this.nsKey, this._observer = new MutationObserver(function(S) {
      for (let q = 0; q < S.length; q++) {
        const T = S[q];
        if (T.type === "childList" || T.type === "characterData") {
          const x = T.target;
          if (x && x._lnSearchText !== void 0 && delete x._lnSearchText, x && x.parentElement && x.parentElement._lnSearchText !== void 0 && delete x.parentElement._lnSearchText, T.addedNodes)
            for (let k = 0; k < T.addedNodes.length; k++) {
              const R = T.addedNodes[k];
              R._lnSearchText !== void 0 && delete R._lnSearchText;
            }
        }
      }
    }), this._observer.observe(v, { childList: !0, subtree: !0, characterData: !0 }), this._onHashChange = function() {
      if (A._destroyed || !A.hashEnabled) return;
      const S = J(A.nsKey), q = A.dom.getAttribute(c) || "";
      S !== null && S !== q ? A.dom.setAttribute(c, S) : S === null && q !== "" && A.dom.setAttribute(c, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), it(function() {
      if (!A._destroyed) {
        if (A.hashEnabled) {
          const S = J(A.nsKey);
          if (S !== null && S !== A.term) {
            A.term = S, A.dom.setAttribute(c, S), e(A.dom, S), A._apply();
            return;
          }
        }
        p(A.term) && (e(A.dom, A.term), A._apply());
      }
    }), this;
  }
  n.prototype._apply = function() {
    const v = this.dom, A = p(this.term), S = m(A);
    if (this.hashEnabled && Y(this.nsKey, this.term ? this.term : null), G(v, "ln-search:change", {
      term: A,
      tokens: S,
      targetId: v.id,
      fields: i(v)
    }).defaultPrevented) return;
    const T = v.getAttribute(b), x = T ? v.querySelectorAll(T) : v.children;
    for (let k = 0; k < x.length; k++) {
      const R = x[k];
      if (R.removeAttribute(s), R.hasAttribute(h) || S.length === 0) continue;
      const N = t(R);
      for (let z = 0; z < S.length; z++)
        if (N.indexOf(S[z]) === -1) {
          R.setAttribute(s, "true");
          break;
        }
    }
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._observer && (this._observer.disconnect(), this._observer = null), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a]);
  };
  function d(v) {
    this.dom = v, this.targetId = v.getAttribute(y), this.input = _(v);
    const A = v.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = A !== null ? parseInt(A, 10) : 500, isNaN(this.debounceTime) && (this.debounceTime = 500), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const S = this;
      it(function() {
        const q = document.getElementById(S.targetId);
        q && ((q.getAttribute(c) || "").trim() || S._write(S.input.value));
      });
    }
    return this;
  }
  d.prototype._write = function(v) {
    const A = document.getElementById(this.targetId);
    A && A.setAttribute(c, v);
  }, d.prototype._attachHandler = function() {
    if (!this.input) return;
    const v = this;
    this._onInput = function() {
      clearTimeout(v._debounceTimer), v._debounceTimer = setTimeout(function() {
        v._write(v.input.value);
      }, v.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, d.prototype.destroy = function() {
    this.dom[w] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[w]);
  };
  function g(v) {
    const A = v.getAttribute("data-ln-search-clear-for");
    if (A) {
      const x = document.getElementById(A), k = document.querySelector("[" + y + '="' + A + '"]'), R = k ? _(k) : null;
      return { target: x, input: R };
    }
    const S = v.closest("[" + c + "]");
    if (S) {
      const x = S.id ? document.querySelector("[" + y + '="' + S.id + '"]') : null, k = x ? _(x) : null;
      return { target: S, input: k };
    }
    const q = v.closest("[" + y + "]");
    if (q) {
      const x = q.getAttribute(y), k = x ? document.getElementById(x) : null, R = _(q);
      return { target: k, input: R };
    }
    const T = v.parentElement;
    if (T) {
      const x = T.querySelector("[" + y + "]");
      if (x) {
        const k = x.getAttribute(y), R = k ? document.getElementById(k) : null, N = _(x);
        return { target: R, input: N };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(v) {
    const A = v.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!A) return;
    const S = g(A);
    if (!(!S.target && !S.input)) {
      if (v.preventDefault(), S.input) {
        const T = (S.input.closest("[" + y + "]") || S.input)[w];
        T && clearTimeout(T._debounceTimer), S.input.value = "", S.input.focus();
      }
      S.target && S.target.setAttribute(c, "");
    }
  });
  function E(v, A) {
    const S = v[a];
    if (!S || S._destroyed) return;
    if (A === l) {
      S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = u(v), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange);
      return;
    }
    const q = v.getAttribute(c) || "";
    q !== S.term && (S.term = q, e(v, q), S._apply());
  }
  B(c, a, n, "ln-search", {
    extraAttributes: [l],
    onAttributeChange: E
  }), B(y, w, d, "ln-search-control");
})();
(function() {
  const c = "data-ln-sort", a = "lnSort", y = "data-ln-sort-field", w = "data-ln-sort-state", b = "data-ln-sort-dir", f = "data-ln-sort-items", h = "data-ln-hash";
  if (window[a] !== void 0) return;
  const s = /* @__PURE__ */ new WeakMap();
  function l(p, m) {
    if (m) {
      const _ = p.querySelector('[data-ln-field="' + m + '"]');
      if (_) return _t(_);
    }
    return _t(p);
  }
  function o(p) {
    this.dom = p, this.targetId = p.getAttribute(c), this.field = p.getAttribute(y) || null;
    const m = p.closest("th");
    this.column = !this.field && m ? m.cellIndex : null, this.itemsSelector = p.getAttribute(f) || null, this._state = p.getAttribute(w) || "none", this._destroyed = !1, this.nsKey = ht(p, "sort"), this.hashEnabled = !!this.nsKey;
    const _ = this;
    this._onClick = function(r) {
      const t = r.target.closest("[" + b + "]");
      if (!t) return;
      const e = t.getAttribute(b);
      _._apply(e);
    }, p.addEventListener("click", this._onClick), this._onSortChange = function(r) {
      if (_._destroyed || !r.detail) return;
      const t = _._resolveTarget();
      if (!(t && (r.target === t || t.contains(r.target)) || r.detail.targetId && r.detail.targetId === _.targetId)) return;
      if (_.field !== null && r.detail.field === _.field || _.column !== null && r.detail.column === _.column) {
        r.detail.direction && p.getAttribute(w) !== r.detail.direction && (_._state = r.detail.direction, p.setAttribute(w, r.detail.direction), _._updateAriaSort(r.detail.direction));
        return;
      }
      p.getAttribute(w) !== "none" && (_._state = "none", p.setAttribute(w, "none"), _._updateAriaSort("none")), p.hasAttribute("data-ln-persist") && ut("sort", p, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (_._destroyed || !_.hashEnabled) return;
      const r = J(_.nsKey), t = Pt(r);
      if (t)
        _.field !== null && t.fieldOrColumn === _.field || _.column !== null && String(_.column) === t.fieldOrColumn ? _._state !== t.direction && _._apply(t.direction, !0) : _._state !== "none" && (_._state = "none", p.setAttribute(w, "none"), _._updateAriaSort("none"));
      else if (_._state !== "none") {
        _._state = "none", p.setAttribute(w, "none"), _._updateAriaSort("none");
        const e = _._resolveTarget();
        e && (G(e, "ln-sort:change", {
          field: _.field,
          column: _.column,
          direction: "none",
          targetId: _.targetId
        }).defaultPrevented || _._defaultSort(e, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let i = !1;
    if (this.hashEnabled) {
      const r = J(this.nsKey), t = Pt(r);
      t && ((_.field !== null && t.fieldOrColumn === _.field || _.column !== null && String(_.column) === t.fieldOrColumn) && it(function() {
        _._destroyed || _._apply(t.direction, !0);
      }), i = !0);
    }
    if (!i && p.hasAttribute("data-ln-persist")) {
      const r = kt("sort", p);
      r && r.direction && r.direction !== "none" && it(function() {
        _._destroyed || _._apply(r.direction, !0);
      }), i = !0;
    }
    if (!i) {
      const r = p.getAttribute(w);
      r && (r === "asc" || r === "desc") && it(function() {
        _._destroyed || _._apply(r, !0);
      });
    }
    return this;
  }
  o.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, o.prototype._updateAriaSort = function(p) {
    const m = this.dom.closest("th");
    m && (p === "asc" ? m.setAttribute("aria-sort", "ascending") : p === "desc" ? m.setAttribute("aria-sort", "descending") : m.setAttribute("aria-sort", "none"));
  }, o.prototype._apply = function(p, m) {
    if (this._destroyed) return;
    this._state = p, this.dom.getAttribute(w) !== p && this.dom.setAttribute(w, p), this._updateAriaSort(p);
    const _ = this._resolveTarget();
    if (!_) return;
    const i = {
      field: this.field,
      column: this.column,
      direction: p,
      targetId: this.targetId
    };
    if (!m && (this.dom.hasAttribute("data-ln-persist") && ut("sort", this.dom, p === "none" ? null : i), this.hashEnabled)) {
      const t = ve(this.field !== null ? this.field : this.column, p);
      Y(this.nsKey, t);
    }
    G(_, "ln-sort:change", i).defaultPrevented || this._defaultSort(_, p);
  }, o.prototype._defaultSort = function(p, m) {
    const _ = this.itemsSelector ? Array.from(p.querySelectorAll(this.itemsSelector)) : Array.from(p.children);
    if (!_.length) return;
    const i = _[0].parentNode;
    s.has(p) || s.set(p, _.slice());
    let r;
    if (m === "none")
      r = (s.get(p) || _).filter(function(n) {
        return n.parentNode === i;
      });
    else {
      const e = this.field, n = _.map(function(v) {
        return l(v, e);
      }), d = bt(n), g = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null, E = m === "desc" ? -1 : 1;
      r = _.slice().sort(function(v, A) {
        return yt(l(v, e), l(A, e), d, g) * E;
      });
    }
    const t = document.createDocumentFragment();
    for (let e = 0; e < r.length; e++) t.appendChild(r[e]);
    i.appendChild(t);
  }, o.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a]);
  };
  function u(p, m) {
    const _ = p[a];
    if (!(!_ || _._destroyed))
      if (m === y) {
        _.field = p.getAttribute(y) || null;
        const i = p.closest("th");
        _.column = !_.field && i ? i.cellIndex : null;
      } else if (m === f)
        _.itemsSelector = p.getAttribute(f) || null;
      else if (m === w) {
        const i = p.getAttribute(w) || "none";
        i !== _._state && _._apply(i);
      } else m === c ? _.targetId = p.getAttribute(c) : m === h && (_.hashEnabled && _._onHashChange && window.removeEventListener("hashchange", _._onHashChange), _.nsKey = ht(p, "sort"), _.hashEnabled = !!_.nsKey, _.hashEnabled && window.addEventListener("hashchange", _._onHashChange));
  }
  B(c, a, o, "ln-sort", {
    extraAttributes: [y, f, w, h],
    onAttributeChange: u
  });
})();
(function() {
  const c = "data-ln-table", a = "lnTable", y = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const l = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function o(i, r) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(W(r)).format(i);
    } catch {
      return String(i);
    }
  }
  function u(i) {
    let r = i.parentElement;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const e = getComputedStyle(r).overflowY;
      if (e === "auto" || e === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function p(i) {
    const r = i._scrollContainer || u(i.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function m(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function _(i) {
    this.dom = i, this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead");
    const r = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = r ? Array.from(r.querySelectorAll("th")) : [], this._totalSpan = i.querySelector("[data-ln-table-total]"), this._filteredSpan = i.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this.isDataDriven = i.hasAttribute("data-ln-table-source"), this.name = i.getAttribute(c) || "", this.source = i.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const t = this;
    return this._onSetSearch = function(e) {
      const n = (e.detail && e.detail.query != null ? e.detail.query : e.detail && e.detail.term != null ? e.detail.term : "").trim();
      t.isDataDriven ? (t.currentSearch = n, L(i, "ln-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData()) : (t._searchTerm = n.toLowerCase(), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(i, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, i.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(e) {
      e.preventDefault(), t._onSetSearch(e);
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      t.isDataDriven ? (t.currentFilters = {}, t.currentSearch = "", L(i, "ln-table:clear-filters", { table: t.name }), t._requestData()) : (t._searchTerm = "", t._columnFilters = {}, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(i, "ln-table:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, i.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && i.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(e) {
      const n = e.detail || {};
      if (t._windowed) {
        i.classList.remove("ln-table--loading"), t._cache.ingest(n);
        return;
      }
      t._data = n.data || [], t._lastTotal = n.total != null ? n.total : t._data.length, t._lastFiltered = n.filtered != null ? n.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, i.classList.remove("ln-table--loading"), t._vStart = -1, t._vEnd = -1, t._applyFilterAndSort(), t._render(), t._updateFooter(), L(i, "ln-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, i.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(e) {
      const n = e.detail && e.detail.loading;
      i.classList.toggle("ln-table--loading", !!n), n && (t.isLoaded = !1);
    }, i.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(e) {
      !t._windowed || !t._cache || t._cache.release(e.detail && e.detail.offset);
    }, i.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !t._windowed || !t._cache || t._cache.revalidate();
    }, i.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !t._windowed || !t._cache || t._requestData();
    }, i.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(e) {
      e.preventDefault(), t.currentSort = e.detail.direction === "none" ? null : { field: e.detail.field, direction: e.detail.direction }, t._requestData();
    }, i.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(e) {
      if (e.target.closest("[data-ln-table-row-select]") || e.target.closest("[data-ln-table-row-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const n = e.target.closest("[data-ln-table-row]");
      if (!n) return;
      const d = n.getAttribute("data-ln-table-row-id"), g = n._lnRecord || {};
      L(i, "ln-table:row-click", {
        table: t.name,
        id: d,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
      const n = e.target.closest("[data-ln-table-row-action]");
      if (!n) return;
      e.stopPropagation();
      const d = n.closest("[data-ln-table-row]");
      if (!d) return;
      const g = n.getAttribute("data-ln-table-row-action"), E = d.getAttribute("data-ln-table-row-id"), v = d._lnRecord || {};
      L(i, "ln-table:row-action", {
        table: t.name,
        id: E,
        action: g,
        record: v
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(e) {
      if (!i.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      const n = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-table-row]")) : [];
      if (n.length)
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, n.length - 1), t._focusRow(n);
            break;
          case "ArrowUp":
            e.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(n);
            break;
          case "Home":
            e.preventDefault(), t._focusedRowIndex = 0, t._focusRow(n);
            break;
          case "End":
            e.preventDefault(), t._focusedRowIndex = n.length - 1, t._focusRow(n);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const d = n[t._focusedRowIndex];
              L(i, "ln-table:row-click", {
                table: t.name,
                id: d.getAttribute("data-ln-table-row-id"),
                record: d._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const d = n[t._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              d && (d.checked = !d.checked, d.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : L(i, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(e) {
      e.preventDefault();
      const n = e.detail.direction === "none" ? null : e.detail.direction;
      t._sortCol = n === null ? -1 : e.detail.column, t._sortDir = n, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), L(i, "ln-table:sorted", {
        column: e.detail.column,
        direction: e.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(e) {
      if (e.preventDefault(), !e.detail) return;
      const n = e.detail.key, d = e.detail.values || [];
      if (n) {
        if (d.length === 0)
          delete t._columnFilters[n];
        else {
          const g = [];
          for (let E = 0; E < d.length; E++)
            g.push(d[E].toLowerCase());
          t._columnFilters[n] = g;
        }
        t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(i, "ln-table:filter", {
          term: t._searchTerm,
          matched: t._filteredData.length,
          total: t._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  _.prototype._parseRows = function() {
    const i = this.tbody.rows, r = this.ths;
    this._data = [], i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < i.length; t++) {
      const e = i[t], n = [], d = [], g = [];
      for (let v = 0; v < e.cells.length; v++) {
        const A = e.cells[v], S = A.textContent.trim();
        n[v] = _t(A), d[v] = S.toLowerCase(), A.querySelector("[data-ln-table-row-action]") || g.push(S.toLowerCase());
      }
      let E = null;
      if (this.isDataDriven) {
        E = {};
        const v = e.getAttribute("data-ln-table-row-id");
        v != null && (E.id = v);
        for (let A = 0; A < r.length; A++) {
          const S = r[A].getAttribute("data-ln-table-col");
          if (S) {
            const q = A;
            if (q < e.cells.length) {
              const T = e.cells[q];
              E[S] = _t(T);
            }
          }
        }
      }
      this._data.push({
        values: n,
        rawTexts: d,
        html: e.outerHTML,
        searchText: g.join(" "),
        id: this.isDataDriven && E ? E.id : void 0,
        ...E
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, _.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const i = (this.currentSearch || "").trim().toLowerCase(), r = i ? i.split(/\s+/).filter(Boolean) : [], t = this.currentFilters || {}, e = Object.keys(t).length > 0;
      if (this._filteredData = this._data.filter(function(A) {
        if (r.length > 0 && !r.every(function(q) {
          for (const T in A)
            if (A.hasOwnProperty(T) && typeof A[T] == "string" && T !== "html" && T !== "searchText" && A[T].toLowerCase().indexOf(q) !== -1)
              return !0;
          return !1;
        }))
          return !1;
        if (e)
          for (const S in t) {
            const q = t[S];
            if (q && q.length > 0) {
              const T = A[S], x = T != null ? String(T) : "";
              if (q.indexOf(x) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, g = this.currentSort.direction === "desc" ? -1 : 1, E = this._filteredData.map(function(A) {
        return A[n];
      }), v = bt(E);
      this._filteredData.sort(function(A, S) {
        return yt(A[n], S[n], v, l) * g;
      });
    } else {
      const i = this._searchTerm, r = i ? i.split(/\s+/).filter(Boolean) : [], t = this._columnFilters, e = Object.keys(t).length > 0, n = this.ths, d = {};
      if (e)
        for (let S = 0; S < n.length; S++) {
          const q = n[S].getAttribute("data-ln-table-filter-col");
          q && (d[q] = S);
        }
      if (r.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (r.length > 0 && !r.every(function(T) {
          return S.searchText.indexOf(T) !== -1;
        }))
          return !1;
        if (e)
          for (const q in t) {
            const T = d[q];
            if (T !== void 0 && t[q].indexOf(S.rawTexts[T]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, E = this._sortDir === "desc" ? -1 : 1, v = this._filteredData.map(function(S) {
        return S.values[g];
      }), A = bt(v);
      this._filteredData.sort(function(S, q) {
        return yt(S.values[g], q.values[g], A, l) * E;
      });
    }
  }, _.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const i = document.createElement("colgroup");
    this.ths.forEach(function(r) {
      const t = document.createElement("col");
      t.style.width = r.offsetWidth + "px", i.appendChild(t);
    }), this.table.insertBefore(i, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = i;
  }, _.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const i = this._lastTotal, r = this.visibleCount;
        if (i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, _.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, r = document.createDocumentFragment();
      for (let e = 0; e < i.length; e++) {
        const n = this._buildRow(i[e]);
        if (!n) break;
        r.appendChild(n);
      }
      const t = p(this);
      this.tbody.textContent = "", this.tbody.appendChild(r), m(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let e = 0; e < r.length; e++) i.push(r[e].html);
      const t = p(this);
      this.tbody.innerHTML = i.join(""), m(t), this._selectable && this._restoreSelection();
    }
  }, _.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    if (!this._rowHeight)
      if (this._windowed) {
        let t = null;
        const e = this._cache.peek();
        e ? t = this._buildRow(e) : t = this._buildPlaceholderRow(), t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
      } else if (this.isDataDriven) {
        if (this._data.length > 0) {
          const t = this._buildRow(this._data[0]);
          t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const t = this.tbody ? this.tbody.rows : [];
        t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = u(this.dom) : this._scrollContainer = null;
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, _.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, _.prototype._renderVirtual = function() {
    const i = this._filteredData, r = i.length, t = this._rowHeight;
    if (!t || !r) return;
    const e = this.thead ? this.thead.offsetHeight : 0, n = this._scrollContainer;
    let d, g;
    if (n) {
      const T = this.table.getBoundingClientRect(), x = n.getBoundingClientRect(), k = T.top - x.top + n.scrollTop + e;
      d = n.scrollTop - k, g = n.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + e;
      d = window.scrollY - k, g = window.innerHeight;
    }
    let E = Math.max(0, Math.floor(d / t) - 15);
    E = Math.min(E, r);
    const v = Math.min(E + Math.ceil(g / t) + 30, r);
    if (E === this._vStart && v === this._vEnd) return;
    this._vStart = E, this._vEnd = v;
    const A = this.ths.length || 1, S = E * t, q = (r - v) * t;
    if (this.isDataDriven) {
      const T = document.createDocumentFragment();
      if (S > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = S + "px", k.appendChild(R), T.appendChild(k);
      }
      for (let k = E; k < v; k++) {
        const R = this._buildRow(i[k]);
        R && T.appendChild(R);
      }
      if (q > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = q + "px", k.appendChild(R), T.appendChild(k);
      }
      const x = p(this);
      this.tbody.textContent = "", this.tbody.appendChild(T), m(x), this._selectable && this._updateSelectAll();
    } else {
      let T = "";
      S > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
      for (let k = E; k < v; k++) T += i[k].html;
      q > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + q + 'px;padding:0;border:none"></td></tr>');
      const x = p(this);
      this.tbody.innerHTML = T, m(x), this._selectable && this._restoreSelection();
    }
  }, _.prototype._buildPlaceholderRow = function() {
    const i = document.createElement("tr");
    i.className = "ln-table__placeholder", i.setAttribute("aria-hidden", "true");
    const r = document.createElement("td");
    return r.setAttribute("colspan", this.ths.length || 1), r.style.height = this._rowHeight + "px", i.appendChild(r), i;
  }, _.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._rowHeight;
    if (!i) return;
    const r = this._cache.logicalTotal, t = this.thead ? this.thead.offsetHeight : 0, e = this._scrollContainer;
    let n, d;
    if (e) {
      const x = this.table.getBoundingClientRect(), k = e.getBoundingClientRect(), R = x.top - k.top + e.scrollTop + t;
      n = e.scrollTop - R, d = e.clientHeight;
    } else {
      const R = this.table.getBoundingClientRect().top + window.scrollY + t;
      n = window.scrollY - R, d = window.innerHeight;
    }
    let g = Math.max(0, Math.floor(n / i) - 15);
    g = Math.min(g, r);
    const E = Math.min(g + Math.ceil(d / i) + 30, r), v = this.ths.length || 1, A = g * i, S = (r - E) * i, q = document.createDocumentFragment();
    if (A > 0) {
      const x = document.createElement("tr");
      x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", v), k.style.height = A + "px", x.appendChild(k), q.appendChild(x);
    }
    for (let x = g; x < E; x++)
      if (this._cache.has(x)) {
        const k = this._buildRow(this._cache.get(x));
        k && q.appendChild(k);
      } else
        q.appendChild(this._buildPlaceholderRow());
    if (S > 0) {
      const x = document.createElement("tr");
      x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", v), k.style.height = S + "px", x.appendChild(k), q.appendChild(x);
    }
    const T = p(this);
    this.tbody.textContent = "", this.tbody.appendChild(q), m(T), this._vStart = g, this._vEnd = E, this._cache.ensure(g, E);
  }, _.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let r = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount === 0 && t > 0, d = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = ct(this.dom, d, "ln-table"), !r) {
        const g = this.dom.querySelector("template[data-ln-table-empty]");
        if (g) {
          const E = n ? "search" : "initial", v = g.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || g.content.firstElementChild;
          v && (r = document.importNode(v, !0));
        }
      }
      if (r)
        if (r.tagName === "TR")
          this.tbody.appendChild(r);
        else {
          const g = document.createElement("td");
          g.setAttribute("colspan", String(i)), g.appendChild(r);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(g), this.tbody.appendChild(E);
        }
    } else {
      const t = this.dom.querySelector("template[" + y + "]"), e = document.createElement("td");
      e.setAttribute("colspan", String(i)), t && e.appendChild(document.importNode(t.content, !0));
      const n = document.createElement("tr");
      n.className = "ln-table__empty", n.appendChild(e), this.tbody.appendChild(n);
    }
    L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, _.prototype._fillRow = function(i, r) {
    Et(i, r);
    const t = i.querySelectorAll("[data-ln-table-cell-attr]");
    for (let e = 0; e < t.length; e++) {
      const n = t[e], d = n.getAttribute("data-ln-table-cell-attr").split(",");
      for (let g = 0; g < d.length; g++) {
        const E = d[g].trim().split(":");
        if (E.length !== 2) continue;
        const v = E[0].trim(), A = E[1].trim();
        r[v] != null && n.setAttribute(A, r[v]);
      }
    }
  }, _.prototype._buildRow = function(i) {
    const r = ct(this.dom, this.name + "-row", "ln-table");
    if (!r) return null;
    const t = r.querySelector("[data-ln-table-row]") || r.firstElementChild;
    if (!t) return null;
    if (this._fillRow(t, i), t._lnRecord = i, i.id != null && t.setAttribute("data-ln-table-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      t.classList.add("ln-row-selected");
      const e = t.querySelector("[data-ln-table-row-select]");
      e && (e.checked = !0);
    }
    return t;
  }, _.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    le(this, "ln-table:request-data", "table");
  }, _.prototype._enterWindowedMode = function() {
    const i = this, r = this.dom, t = parseInt(r.getAttribute("data-ln-table-window"), 10), e = parseInt(r.getAttribute("data-ln-table-window-page"), 10), n = parseInt(r.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-table:rendered", {
        table: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = Wt(this._onCacheChange), this._cache = ge({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: n >= 0 ? n : 25,
      fetchDebounce: 120,
      requestPage: function(d, g, E) {
        L(r, "ln-table:request-data", {
          table: i.name,
          sort: d.sort,
          filters: d.filters,
          search: d.search,
          offset: g,
          limit: E,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, _.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let i = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(i) && this._totalSpan) {
        const t = this._totalSpan.textContent.replace(/[^\d]/g, "");
        t && (i = parseInt(t, 10));
      }
      const r = i > 0 ? i : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: r,
        filtered: r
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, _.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, _.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    let r = i.length > 0;
    for (let t = 0; t < i.length; t++) {
      const e = i[t].getAttribute("data-ln-table-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
  }, _.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let r = 0; r < i.length; r++) {
      const t = i[r].getAttribute("data-ln-table-row-id"), e = t != null && this.selectedIds.has(t);
      i[r].classList.toggle("ln-row-selected", e);
      const n = i[r].querySelector("[data-ln-table-row-select]");
      n && (n.checked = e);
    }
    this._updateSelectAll();
  }, Object.defineProperty(_.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), _.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    if (this._onSelectionChange = function(r) {
      const t = r.target.closest("[data-ln-table-row-select]");
      if (!t) return;
      const e = t.closest("[data-ln-table-row]");
      if (!e) return;
      const n = e.getAttribute("data-ln-table-row-id");
      n != null && (t.checked ? (i.selectedIds.add(n), e.classList.add("ln-row-selected")) : (i.selectedIds.delete(n), e.classList.remove("ln-row-selected")), i.selectedCount = i.selectedIds.size, i._updateSelectAll(), i._updateFooter(), L(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const r = document.createElement("input");
      r.type = "checkbox";
      const t = i.dom.querySelector('[data-ln-table-dict="select-all"]'), e = i.dom.getAttribute("data-ln-table-select-all-label") || (t ? t.textContent.trim() : null) || "Select all";
      r.setAttribute("aria-label", e), this._selectAllCheckbox.appendChild(r), this._selectAllCheckbox = r;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = i._selectAllCheckbox.checked, t = i.tbody ? i.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let e = 0; e < t.length; e++) {
        const n = t[e].getAttribute("data-ln-table-row-id"), d = t[e].querySelector("[data-ln-table-row-select]");
        n != null && (r ? (i.selectedIds.add(n), t[e].classList.add("ln-row-selected")) : (i.selectedIds.delete(n), t[e].classList.remove("ln-row-selected")), d && (d.checked = r));
      }
      i.selectedCount = i.selectedIds.size, L(i.dom, "ln-table:select-all", {
        table: i.name,
        selected: r
      }), L(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < r.length; t++) {
        const e = r[t].querySelector("[data-ln-table-row-select]"), n = r[t].getAttribute("data-ln-table-row-id");
        e && e.checked && n != null && (this.selectedIds.add(n), r[t].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, _.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const i = this.dom.querySelector("[data-ln-table-col-select]");
    if (i) {
      const r = i.querySelector('input[type="checkbox"]');
      r && r.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < r.length; t++) {
        r[t].classList.remove("ln-row-selected");
        const e = r[t].querySelector("[data-ln-table-row-select]");
        e && (e.checked = !1);
      }
    }
    this._updateFooter();
  }, _.prototype._updateFooter = function() {
    let i = 0, r = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (i = this._data.length, r = this._filteredData.length);
    const t = r < i;
    if (this._totalSpan && (this._totalSpan.textContent = o(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? o(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? o(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, _.prototype._focusRow = function(i) {
    for (let r = 0; r < i.length; r++)
      i[r].classList.remove("ln-row-focused"), i[r].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const r = i[this._focusedRowIndex];
      r.classList.add("ln-row-focused"), r.setAttribute("tabindex", "0"), r.focus(), r.scrollIntoView({ block: "nearest" });
    }
  }, _.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(c, a, _, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(i, r) {
      const t = i[a];
      if (!(!t || !t.isDataDriven)) {
        if (r === "data-ln-table-window") {
          const e = i.hasAttribute("data-ln-table-window");
          if (e && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!e && t._windowed)
            t._exitWindowedMode();
          else if (e && t._windowed) {
            const n = parseInt(i.getAttribute("data-ln-table-window"), 10);
            n > 0 && t._cache.configure({ windowSize: n });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (r === "data-ln-table-window-page") {
            const e = parseInt(i.getAttribute("data-ln-table-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (r === "data-ln-table-window-threshold") {
            const e = parseInt(i.getAttribute("data-ln-table-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (r === "data-ln-table-count") {
            const e = parseInt(i.getAttribute("data-ln-table-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const c = "data-ln-table-coordinator", a = "lnTableCoordinator";
  if (window[a] !== void 0) return;
  document.addEventListener("keydown", function(b) {
    if (b.key !== "/" || b.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const f = document.querySelector("[" + c + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!f) return;
    const h = f.tagName === "INPUT" || f.tagName === "TEXTAREA" ? f : f.querySelector('input[type="search"], input[type="text"], input');
    h && (b.preventDefault(), h.focus());
  });
  function y(b) {
    return this.dom = b, w(this), this;
  }
  function w(b) {
    const f = b.dom;
    function h(s) {
      const l = s.target;
      if (l && l.hasAttribute && l.hasAttribute("data-ln-table")) return l;
      const o = s.detail && s.detail.targetId || l && l.id;
      return o ? f.querySelector('[data-ln-table-source="' + o + '"]') || f.querySelector('[data-ln-table="' + o + '"]') : null;
    }
    b._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(s) {
        if (!s.detail) return;
        const l = h(s);
        if (!l || !l.hasAttribute || !l.hasAttribute("data-ln-table")) return;
        const o = s.detail.key, u = s.detail.values || [], p = l.querySelectorAll("th");
        for (let m = 0; m < p.length; m++)
          if (p[m].getAttribute("data-ln-table-filter-col") === o) {
            const _ = p[m].querySelector("[data-ln-table-col-filter]");
            _ && _.classList.toggle("ln-filter-active", u.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(s) {
        const l = s.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!l) return;
        const o = l.closest("[data-ln-table]") || f.querySelector("[data-ln-table]");
        if (!o || !o.lnTable) return;
        const u = o.lnTable.name || o.id, p = o.querySelectorAll("th");
        for (let t = 0; t < p.length; t++) {
          const e = p[t].querySelector("[data-ln-table-col-filter]");
          e && e.classList.remove("ln-filter-active");
        }
        const m = o.getAttribute("data-ln-table-source") || o.id, _ = m ? document.getElementById(m) : null;
        _ && _.hasAttribute("data-ln-search") && _.setAttribute("data-ln-search", "");
        const i = m && f.querySelector('[data-ln-search-for="' + m + '"]') || f.querySelector("[data-ln-search-for]");
        if (i) {
          const t = i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector("input");
          t && t.value !== "" && (t.value = "", t.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const r = m && f.querySelectorAll('[data-ln-filter="' + m + '"]') || f.querySelectorAll("[data-ln-filter]");
        for (let t = 0; t < r.length; t++) {
          const e = r[t].querySelector("[data-ln-filter-reset]");
          e && (e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        o.hasAttribute("data-ln-table-source") || L(o, "ln-table:request-clear-filters", { table: u });
      }
    }, f.addEventListener("ln-filter:change", b._handlers.filter), f.addEventListener("click", b._handlers.clear);
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[a]);
  }, B(c, a, y, "ln-table-coordinator");
})();
(function() {
  const c = "data-ln-list", a = "lnList", y = "data-ln-list-empty";
  if (window[a] !== void 0) return;
  function l(i, r) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(W(r)).format(i);
    } catch {
      return String(i);
    }
  }
  function o(i) {
    let r = i;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const e = getComputedStyle(r).overflowY;
      if (e === "auto" || e === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function u(i) {
    const r = i._scrollContainer || o(i.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function p(i) {
    i.container ? i.container.scrollTop = i.top : window.scrollTo(window.scrollX, i.top);
  }
  function m(i) {
    if (!i) return 0;
    const r = getComputedStyle(i), t = parseFloat(r.marginTop) || 0, e = parseFloat(r.marginBottom) || 0;
    return i.offsetHeight + t + e;
  }
  function _(i) {
    this.dom = i, this.tbody = i.querySelector("[data-ln-list-body]") || i, this.isDataDriven = i.hasAttribute("data-ln-list-source"), this.name = i.getAttribute(c) || "", this.source = i.getAttribute("data-ln-list-source") || "", this._totalSpan = i.querySelector("[data-ln-list-total]"), this._filteredSpan = i.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const r = this;
    return this._onRequestClearFilters = function() {
      r.isDataDriven ? (r.currentFilters = {}, r.currentSearch = "", L(i, "ln-list:clear-filters", { list: r.name }), r._requestData()) : (r._searchTerm = "", r._filters = {}, r._sortField = null, r._sortDir = null, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
        term: "",
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, i.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = i.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._windowed = !1, this._cache = null, i.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._onSetData = function(t) {
      const e = t.detail || {};
      if (r._windowed) {
        i.classList.remove("ln-list--loading"), r._cache.ingest(e);
        return;
      }
      r._data = e.data || [], r._lastTotal = e.total != null ? e.total : r._data.length, r._lastFiltered = e.filtered != null ? e.filtered : r._data.length, r.totalCount = r._lastTotal, r.visibleCount = r._lastFiltered, r.isLoaded = !0, i.classList.remove("ln-list--loading"), r._vStart = -1, r._vEnd = -1, r._applyFilterAndSort(), r._render(), r._updateFooter(), L(i, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      });
    }, i.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(t) {
      const e = t.detail && t.detail.loading;
      i.classList.toggle("ln-list--loading", !!e), e && (r.isLoaded = !1);
    }, i.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(t) {
      !r._windowed || !r._cache || r._cache.release(t.detail && t.detail.offset);
    }, i.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !r._windowed || !r._cache || r._cache.revalidate();
    }, i.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !r._windowed || !r._cache || r._requestData();
    }, i.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(t) {
      t.detail.field != null && (t.preventDefault(), r.currentSort = t.detail.direction === "none" ? null : { field: t.detail.field, direction: t.detail.direction }, r._windowed ? r._requestData() : (r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:sorted", {
        field: r.currentSort ? r.currentSort.field : null,
        direction: t.detail.direction,
        matched: r.visibleCount,
        total: r.totalCount
      })));
    }, i.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(t) {
      if (t.target.closest("[data-ln-item-select]") || t.target.closest("[data-ln-item-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const e = t.target.closest("[data-ln-item]");
      if (!e) return;
      const n = e.getAttribute("data-ln-item-id"), d = e._lnRecord || {};
      L(i, "ln-list:item-click", {
        list: r.name,
        id: n,
        record: d
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(t) {
      const e = t.target.closest("[data-ln-item-action]");
      if (!e) return;
      t.stopPropagation();
      const n = e.closest("[data-ln-item]");
      if (!n) return;
      const d = e.getAttribute("data-ln-item-action"), g = n.getAttribute("data-ln-item-id"), E = n._lnRecord || {};
      L(i, "ln-list:item-action", {
        list: r.name,
        id: g,
        action: d,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(i, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      r.tbody.children.length > 0 && (r._emptyObserver.disconnect(), r._emptyObserver = null, r._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearchChange = function(t) {
      t.preventDefault();
      const e = (t.detail && t.detail.term != null ? t.detail.term : "").trim();
      r._searchTerm = e.toLowerCase(), r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
        term: r._searchTerm,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._onFilterChange = function(t) {
      if (t.preventDefault(), !t.detail) return;
      const e = t.detail.key, n = t.detail.values || [];
      if (e) {
        if (n.length === 0)
          delete r._filters[e];
        else {
          const d = [];
          for (let g = 0; g < n.length; g++)
            d.push(n[g].toLowerCase());
          r._filters[e] = d;
        }
        r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:filter", {
          term: r._searchTerm,
          matched: r._filteredData.length,
          total: r._data.length
        });
      }
    }, i.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(t) {
      if (t.detail && t.detail.field == null) return;
      t.preventDefault();
      const e = t.detail && t.detail.direction === "none" ? null : t.detail && t.detail.direction;
      r._sortField = e === null ? null : t.detail && t.detail.field, r._sortDir = e, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:sorted", {
        field: r._sortField,
        direction: t.detail && t.detail.direction,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-sort:change", this._onSort)), this;
  }
  _.prototype._parseChildren = function() {
    const i = Array.from(this.tbody.children).filter((r) => !r.classList.contains("ln-list__spacer"));
    this._data = [], i.length > 0 && (this._itemHeight = m(i[0]) || 50);
    for (let r = 0; r < i.length; r++) {
      const t = i[r], e = t.getAttribute("data-ln-item-id") || t.getAttribute("id"), n = t.textContent.trim().toLowerCase();
      let d = null;
      if (this.isDataDriven) {
        d = {}, e != null && (d.id = e);
        const v = t.querySelectorAll("[data-ln-list-field]");
        for (let A = 0; A < v.length; A++) {
          const S = v[A], q = S.getAttribute("data-ln-list-field");
          q && (d[q] = _t(S));
        }
      }
      const g = {}, E = t.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let v = 0; v < E.length; v++) {
        const A = E[v], S = A.getAttribute("data-ln-list-field") || A.getAttribute("data-ln-field");
        S && (g[S] = _t(A));
      }
      for (let v = 0; v < t.attributes.length; v++) {
        const A = t.attributes[v];
        if (A.name.startsWith("data-") && !A.name.startsWith("data-ln-")) {
          const S = A.name.slice(5);
          S && (g[S] = A.value);
        }
      }
      this._data.push({
        html: t.outerHTML,
        id: e,
        searchText: n,
        fields: g,
        ...d || {}
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, _.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      if (this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, r = this.currentSort.direction === "desc" ? -1 : 1, t = this._filteredData.map(function(d) {
        return d[i];
      }), e = bt(t), n = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null;
      this._filteredData.sort(function(d, g) {
        return yt(d[i], g[i], e, n) * r;
      });
    } else {
      const i = this._searchTerm, r = i ? i.split(/\s+/).filter(Boolean) : [], t = this._filters || {}, e = Object.keys(t).length > 0;
      if (r.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(n) {
        if (r.length > 0 && !r.every(function(g) {
          return n.searchText && n.searchText.indexOf(g) !== -1;
        }))
          return !1;
        if (e)
          for (const d in t) {
            const g = t[d];
            if (g && g.length > 0) {
              const E = n.fields && n.fields[d] !== void 0 ? n.fields[d] : n[d] !== void 0 ? n[d] : null, v = E != null ? String(E).toLowerCase() : "";
              if (g.indexOf(v) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const n = this._sortField, d = this._sortDir === "desc" ? -1 : 1, g = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null, E = this._filteredData.map(function(A) {
          return A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n];
        }), v = bt(E);
        this._filteredData.sort(function(A, S) {
          const q = A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n], T = S.fields && S.fields[n] !== void 0 ? S.fields[n] : S[n];
          return yt(q, T, v, g) * d;
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
      for (let e = 0; e < i.length; e++) {
        const n = this._buildItem(i[e]);
        n && r.appendChild(n);
      }
      const t = u(this);
      this.tbody.textContent = "", this.tbody.appendChild(r), p(t), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let e = 0; e < r.length; e++) i.push(r[e].html);
      const t = u(this);
      this.tbody.innerHTML = i.join(""), p(t), this._selectable && this._restoreSelection();
    }
  }, _.prototype._readGridLayout = function() {
    const i = getComputedStyle(this.tbody), r = i.gridTemplateColumns;
    let t = 1;
    if (r && r !== "none") {
      const n = r.trim().split(/\s+/).filter(Boolean);
      n.length > 0 && (t = n.length);
    }
    const e = parseFloat(i.rowGap);
    return { columns: t, rowGap: isNaN(e) ? 0 : e };
  }, _.prototype._measureItemHeight = function() {
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
  }, _.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = o(this.dom);
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
    const i = this._filteredData, r = i.length, t = this._itemHeight;
    if (!t || !r) return;
    const e = this._scrollContainer;
    let n, d;
    if (e) {
      const H = this.tbody.getBoundingClientRect(), U = e.getBoundingClientRect(), K = e === this.tbody ? 0 : H.top - U.top + e.scrollTop;
      n = e.scrollTop - K, d = e.clientHeight;
    } else {
      const U = this.tbody.getBoundingClientRect().top + window.scrollY;
      n = window.scrollY - U, d = window.innerHeight;
    }
    const g = this._readGridLayout(), E = g.columns, v = g.rowGap, A = t + v, S = Math.ceil(r / E);
    let q = Math.max(0, Math.floor(n / A) - 15);
    q = Math.min(q, S);
    const T = Math.ceil(d / A) + 30, x = Math.min(q + T, S), k = Math.min(q * E, r), R = Math.min(x * E, r);
    if (k === this._vStart && R === this._vEnd) return;
    this._vStart = k, this._vEnd = R;
    const N = q * A, z = (S - x) * A;
    if (this.isDataDriven) {
      const H = document.createDocumentFragment();
      if (N > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = N + "px", H.appendChild(K);
      }
      for (let K = k; K < R; K++) {
        const rt = this._buildItem(i[K]);
        rt && H.appendChild(rt);
      }
      if (z > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = z + "px", H.appendChild(K);
      }
      const U = u(this);
      this.tbody.textContent = "", this.tbody.appendChild(H), p(U), this._selectable && this._updateSelectAll();
    } else {
      let H = "";
      N > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${N}px"></${this.isUl ? "li" : "div"}>`);
      for (let K = k; K < R; K++)
        H += i[K].html;
      z > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${z}px"></${this.isUl ? "li" : "div"}>`);
      const U = u(this);
      this.tbody.innerHTML = H, p(U), this._selectable && this._restoreSelection();
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
    let t, e;
    if (r) {
      const U = this.tbody.getBoundingClientRect(), K = r.getBoundingClientRect(), rt = r === this.tbody ? 0 : U.top - K.top + r.scrollTop;
      t = r.scrollTop - rt, e = r.clientHeight;
    } else {
      const K = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - K, e = window.innerHeight;
    }
    const n = this._readGridLayout(), d = n.columns, g = n.rowGap, E = i + g, v = this._cache.logicalTotal, A = Math.ceil(v / d);
    let S = Math.max(0, Math.floor(t / E) - 15);
    S = Math.min(S, A);
    const q = Math.ceil(e / E) + 30, T = Math.min(S + q, A), x = Math.min(S * d, v), k = Math.min(T * d, v), R = S * E, N = (A - T) * E, z = document.createDocumentFragment();
    if (R > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = R + "px", z.appendChild(U);
    }
    for (let U = x; U < k; U++)
      if (this._cache.has(U)) {
        const K = this._buildItem(this._cache.get(U));
        K && z.appendChild(K);
      } else
        z.appendChild(this._buildPlaceholderItem());
    if (N > 0) {
      const U = document.createElement(this.isUl ? "li" : "div");
      U.className = "ln-list__spacer", U.setAttribute("aria-hidden", "true"), U.style.height = N + "px", z.appendChild(U);
    }
    const H = u(this);
    this.tbody.textContent = "", this.tbody.appendChild(z), p(H), this._vStart = x, this._vEnd = k, this._cache.ensure(x, k);
  }, _.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let i = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount === 0 && r > 0, n = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = ct(this.dom, n, "ln-list"), !i) {
        const d = this.dom.querySelector("template[data-ln-empty]");
        if (d) {
          const g = e ? "search" : "initial", E = d.content.querySelector(`[data-ln-empty-when="${g}"]`) || d.content.firstElementChild;
          E && (i = document.importNode(E, !0));
        }
      }
    } else {
      const r = this.dom.querySelector(`template[${y}]`);
      if (r) {
        const t = r.content.firstElementChild;
        t && (i = document.importNode(t, !0));
      }
    }
    if (i)
      if (i.tagName === "LI" || i.tagName === "TR")
        this.tbody.appendChild(i);
      else {
        const r = document.createElement(this.isUl ? "li" : "div");
        r.appendChild(i), this.tbody.appendChild(r);
      }
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, _.prototype._buildItem = function(i) {
    const r = ct(this.dom, this.name + "-row", "ln-list");
    if (!r) return null;
    const t = r.querySelector("[data-ln-item]") || r.firstElementChild;
    if (!t) return null;
    if (Et(t, i), nt(t, i), t._lnRecord = i, i.id != null && (t.setAttribute("data-ln-item-id", i.id), this._selectable && this.selectedIds.has(String(i.id)))) {
      t.classList.add("ln-item-selected");
      const e = t.querySelector("[data-ln-item-select]");
      e && (e.checked = !0);
    }
    return t;
  }, _.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    for (let r = 0; r < i.length; r++) {
      const t = i[r].getAttribute("data-ln-item-id"), e = t != null && this.selectedIds.has(String(t));
      i[r].classList.toggle("ln-item-selected", e);
      const n = i[r].querySelector("[data-ln-item-select]");
      n && (n.checked = e);
    }
    this._updateSelectAll();
  }, _.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    this._onSelectionChange = function(r) {
      const t = r.target.closest("[data-ln-item-select]");
      if (!t) return;
      const e = t.closest("[data-ln-item]");
      if (!e) return;
      const n = e.getAttribute("data-ln-item-id");
      n != null && (t.checked ? (i.selectedIds.add(String(n)), e.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(n)), e.classList.remove("ln-item-selected")), i._updateSelectAll(), i._updateFooter(), L(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = i._selectAllCheckbox.checked, t = i.tbody.querySelectorAll("[data-ln-item]");
      for (let e = 0; e < t.length; e++) {
        const n = t[e], d = n.getAttribute("data-ln-item-id"), g = n.querySelector("[data-ln-item-select]");
        d != null && (r ? (i.selectedIds.add(String(d)), n.classList.add("ln-item-selected")) : (i.selectedIds.delete(String(d)), n.classList.remove("ln-item-selected")), g && (g.checked = r));
      }
      L(i.dom, "ln-list:select-all", { list: i.name, selected: r }), L(i.dom, "ln-list:select", {
        list: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedIds.size
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, _.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const i = this.tbody.querySelectorAll("[data-ln-item]");
    let r = i.length > 0;
    for (let t = 0; t < i.length; t++) {
      const e = i[t].getAttribute("data-ln-item-id");
      if (e != null && !this.selectedIds.has(String(e))) {
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
    le(this, "ln-list:request-data", "list");
  }, _.prototype._enterWindowedMode = function() {
    const i = this, r = this.dom, t = parseInt(r.getAttribute("data-ln-list-window"), 10), e = parseInt(r.getAttribute("data-ln-list-window-page"), 10), n = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = Wt(this._onCacheChange), this._cache = ge({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: n >= 0 ? n : 25,
      fetchDebounce: 120,
      requestPage: function(d, g, E) {
        L(r, "ln-list:request-data", {
          list: i.name,
          sort: d.sort,
          filters: d.filters,
          search: d.search,
          offset: g,
          limit: E,
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
    const t = r < i;
    if (this._totalSpan && (this._totalSpan.textContent = l(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? l(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? l(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, _.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(c, a, _, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(i, r) {
      const t = i[a];
      if (!(!t || !t.isDataDriven)) {
        if (r === "data-ln-list-window") {
          const e = i.hasAttribute("data-ln-list-window");
          if (e && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!e && t._windowed)
            t._exitWindowedMode();
          else if (e && t._windowed) {
            const n = parseInt(i.getAttribute("data-ln-list-window"), 10);
            n > 0 && t._cache.configure({ windowSize: n });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (r === "data-ln-list-window-page") {
            const e = parseInt(i.getAttribute("data-ln-list-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (r === "data-ln-list-window-threshold") {
            const e = parseInt(i.getAttribute("data-ln-list-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (r === "data-ln-list-count") {
            const e = parseInt(i.getAttribute("data-ln-list-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const c = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", w = 36, b = 16, f = 2 * Math.PI * b;
  function h(p) {
    return this.dom = p, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, l.call(this), u.call(this), o.call(this), this;
  }
  h.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[a]);
  };
  function s(p, m) {
    const _ = document.createElementNS(y, p);
    for (const i in m)
      _.setAttribute(i, m[i]);
    return _;
  }
  function l() {
    this.svg = s("svg", {
      viewBox: "0 0 " + w + " " + w,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: w / 2,
      cy: w / 2,
      r: b,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: w / 2,
      cy: w / 2,
      r: b,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": f,
      "stroke-dashoffset": f,
      transform: "rotate(-90 " + w / 2 + " " + w / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const p = this, m = new MutationObserver(function(_) {
      for (const i of _)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max" || i.attributeName === "data-ln-circular-progress-label") && u.call(p);
    });
    m.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = m;
  }
  function u() {
    const p = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, m = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let _ = m > 0 ? p / m * 100 : 0;
    _ < 0 && (_ = 0), _ > 100 && (_ = 100);
    const i = f - _ / 100 * f;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), t = r !== null ? r : Math.round(_) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(m));
    const e = Math.max(0, Math.min(p, m));
    this.dom.setAttribute("aria-valuenow", String(e)), this.dom.setAttribute("aria-valuetext", t), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: p,
      max: m,
      percentage: _
    });
  }
  B(c, a, h, "ln-circular-progress");
})();
(function() {
  const c = "data-ln-sortable", a = "lnSortable", y = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function w(f) {
    this.dom = f, this.isEnabled = f.getAttribute(c) !== "disabled", this._dragging = null, f.setAttribute("aria-roledescription", "sortable list");
    const h = this;
    return this._onPointerDown = function(s) {
      h.isEnabled && h._handlePointerDown(s);
    }, f.addEventListener("pointerdown", this._onPointerDown), this;
  }
  w.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(c, "");
  }, w.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(c, "disabled");
  }, w.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, w.prototype._handlePointerDown = function(f) {
    let h = f.target.closest("[" + y + "]"), s;
    if (h) {
      for (s = h; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (s = f.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      h = s;
    }
    const o = Array.from(this.dom.children).indexOf(s);
    if (G(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: o
    }).defaultPrevented) return;
    f.preventDefault(), h.setPointerCapture(f.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: o
    });
    const p = this, m = function(i) {
      p._handlePointerMove(i);
    }, _ = function(i) {
      p._handlePointerEnd(i), h.removeEventListener("pointermove", m), h.removeEventListener("pointerup", _), h.removeEventListener("pointercancel", _);
    };
    h.addEventListener("pointermove", m), h.addEventListener("pointerup", _), h.addEventListener("pointercancel", _);
  }, w.prototype._handlePointerMove = function(f) {
    if (!this._dragging) return;
    const h = Array.from(this.dom.children), s = this._dragging;
    for (const l of h)
      l.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const l of h) {
      if (l === s) continue;
      const o = l.getBoundingClientRect(), u = o.top + o.height / 2;
      if (f.clientY >= o.top && f.clientY < u) {
        l.classList.add("ln-sortable--drop-before");
        break;
      } else if (f.clientY >= u && f.clientY <= o.bottom) {
        l.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, w.prototype._handlePointerEnd = function(f) {
    if (!this._dragging) return;
    const h = this._dragging, s = Array.from(this.dom.children), l = s.indexOf(h);
    let o = null, u = null;
    for (const p of s) {
      if (p.classList.contains("ln-sortable--drop-before")) {
        o = p, u = "before";
        break;
      }
      if (p.classList.contains("ln-sortable--drop-after")) {
        o = p, u = "after";
        break;
      }
    }
    for (const p of s)
      p.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (h.classList.remove("ln-sortable--dragging"), h.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== h) {
      u === "before" ? this.dom.insertBefore(h, o) : this.dom.insertBefore(h, o.nextElementSibling);
      const m = Array.from(this.dom.children).indexOf(h);
      L(this.dom, "ln-sortable:reordered", {
        item: h,
        oldIndex: l,
        newIndex: m
      });
    }
    this._dragging = null;
  };
  function b(f) {
    const h = f[a];
    if (!h) return;
    const s = f.getAttribute(c) !== "disabled";
    s !== h.isEnabled && (h.isEnabled = s, L(f, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: f }));
  }
  B(c, a, w, "ln-sortable", {
    onAttributeChange: b
  });
})();
(function() {
  const c = "data-ln-confirm", a = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function b(...h) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...h);
  }
  function f(h) {
    b("constructor called on", h), this.dom = h, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = h.querySelector("[data-ln-confirm-idle]"), this.activeEl = h.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = h.textContent.trim(), this.confirmText = h.getAttribute(c) || "Confirm?");
    const s = this;
    return this._onClick = function(l) {
      if (b("click handler, confirming:", s.confirming, "submitted:", s._submitted, "target:", l.target), !s.confirming)
        l.preventDefault(), l.stopImmediatePropagation(), s._enterConfirm();
      else {
        if (s._submitted) return;
        s._submitted = !0, l.stopPropagation(), s._reset();
      }
    }, h.addEventListener("click", this._onClick), this;
  }
  f.prototype._getTimeout = function() {
    const h = parseFloat(this.dom.getAttribute(y));
    return isNaN(h) || h <= 0 ? 3 : h;
  }, f.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const s = this.activeEl ? this.activeEl.textContent.trim() : "";
      s && (this.dom.setAttribute("aria-label", s), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = h.getAttribute("href"), h.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, f.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const h = this, s = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      h._reset();
    }, s);
  }, f.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      var h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalIconHref && h.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, f.prototype.destroy = function() {
    b("destroy called on", this.dom), this.dom[a] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, B(c, a, f, "ln-confirm");
})();
(function() {
  const c = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function w(b) {
    this.dom = b, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = b.getAttribute(c + "-default") || "", this.placeholderLabel = b.getAttribute(c + "-placeholder") || "{lang} translation", this.removeLabel = b.getAttribute(c + "-remove-label") || "Remove {lang}", this.badgesEl = b.querySelector("[" + c + "-active]"), this.menuEl = b.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const f = b.getAttribute(c + "-locales");
    if (this.locales = y, f)
      try {
        this.locales = JSON.parse(f);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const h = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && h.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && h.removeLanguage(s.detail.lang);
    }, b.addEventListener("ln-translations:request-add", this._onRequestAdd), b.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  w.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const b = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of b) {
      const h = f.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of h)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, w.prototype._detectExisting = function() {
    const b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const f of b) {
      const h = f.getAttribute("data-ln-translatable-lang");
      h && h !== this.defaultLang && this.activeLanguages.add(h);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, w.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const b = this;
    let f = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      f++;
      const l = Lt("ln-translations-menu-item", "ln-translations");
      if (!l) return;
      const o = l.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", s), o.textContent = this.locales[s], o.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), b.menuEl.getAttribute("data-ln-toggle") === "open" && b.menuEl.setAttribute("data-ln-toggle", "close"), b.addLanguage(s));
      }), this.menuEl.appendChild(l);
    }
    const h = this.dom.querySelector("[" + c + "-add]");
    h && (h.hidden = f === 0);
  }, w.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const b = this;
    this.activeLanguages.forEach(function(f) {
      const h = Lt("ln-translations-badge", "ln-translations");
      if (!h) return;
      const s = h.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", f);
      const l = s.querySelector("span");
      l.textContent = b.locales[f] || f.toUpperCase();
      const o = s.querySelector("button"), u = b.locales[f] || f.toUpperCase();
      o.setAttribute("aria-label", b.removeLabel.replace("{lang}", u)), o.addEventListener("click", function(p) {
        p.ctrlKey || p.metaKey || p.button === 1 || (p.preventDefault(), p.stopPropagation(), b.removeLanguage(f));
      }), b.badgesEl.appendChild(h);
    });
  }, w.prototype.addLanguage = function(b, f) {
    if (this.activeLanguages.has(b)) return;
    const h = this.locales[b] || b;
    if (G(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: b,
      langName: h
    }).defaultPrevented) return;
    this.activeLanguages.add(b), f = f || {};
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of l) {
      const u = o.getAttribute("data-ln-translatable"), p = o.getAttribute("data-ln-translations-prefix") || "", m = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!m) continue;
      const _ = m.cloneNode(m.tagName === "SELECT");
      p ? _.name = p + "[trans][" + b + "][" + u + "]" : _.name = "trans[" + b + "][" + u + "]", _.value = f[u] !== void 0 ? f[u] : "", _.removeAttribute("id"), "placeholder" in _ && (_.placeholder = this.placeholderLabel.replace("{lang}", h)), _.setAttribute("data-ln-translatable-lang", b);
      const i = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = i.length > 0 ? i[i.length - 1] : m;
      r.parentNode.insertBefore(_, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: b,
      langName: h
    });
  }, w.prototype.removeLanguage = function(b) {
    if (!this.activeLanguages.has(b) || G(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: b
    }).defaultPrevented) return;
    const h = this.dom.querySelectorAll('[data-ln-translatable-lang="' + b + '"]');
    for (const s of h)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(b), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: b
    });
  }, w.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, w.prototype.hasLanguage = function(b) {
    return this.activeLanguages.has(b);
  }, w.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const b = this.defaultLang, f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of f)
      h.getAttribute("data-ln-translatable-lang") !== b && h.parentNode.removeChild(h);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, B(c, a, w, "ln-translations");
})();
(function() {
  const c = "data-ln-autosave", a = "lnAutosave", y = "data-ln-autosave-clear", w = "data-ln-autosave-debounce-input", b = "ln-autosave:";
  if (window[a] !== void 0) return;
  function h(u) {
    const p = s(u);
    if (!p) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", u);
      return;
    }
    this.dom = u, this.key = p;
    let m = null;
    function _() {
      const e = ce(u, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(p, JSON.stringify(e));
      } catch {
        return;
      }
      L(u, "ln-autosave:saved", { target: u, data: e });
    }
    function i() {
      let e;
      try {
        e = localStorage.getItem(p);
      } catch {
        return;
      }
      if (!e) return;
      let n;
      try {
        n = JSON.parse(e);
      } catch {
        return;
      }
      if (G(u, "ln-autosave:before-restore", { target: u, data: n }).defaultPrevented) return;
      const g = de(u, n);
      for (let E = 0; E < g.length; E++)
        g[E].dispatchEvent(new Event("input", { bubbles: !0 })), g[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(u, "ln-autosave:restored", { target: u, data: n });
    }
    function r() {
      try {
        localStorage.removeItem(p);
      } catch {
        return;
      }
      L(u, "ln-autosave:cleared", { target: u });
    }
    this._onFocusout = function(e) {
      const n = e.target;
      l(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && _();
    }, this._onChange = function(e) {
      const n = e.target;
      l(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && _();
    }, this._onSubmit = function() {
      r();
    }, this._onReset = function() {
      r();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + y + "]") && r();
    }, u.addEventListener("focusout", this._onFocusout), u.addEventListener("change", this._onChange), u.addEventListener("submit", this._onSubmit), u.addEventListener("reset", this._onReset), u.addEventListener("click", this._onClearClick);
    const t = o(u);
    return t > 0 && (this._onInput = function(e) {
      const n = e.target;
      !l(n) || !n.name || n.hasAttribute("data-ln-autosave-exclude") || (m !== null && clearTimeout(m), m = setTimeout(_, t));
    }, u.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return m;
    }, i(), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const u = this._getInputTimer();
        u !== null && clearTimeout(u);
      }
      L(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function s(u) {
    const m = u.getAttribute(c) || u.id;
    return m ? b + window.location.pathname + ":" + m : null;
  }
  function l(u) {
    const p = u.tagName;
    return p === "INPUT" || p === "TEXTAREA" || p === "SELECT";
  }
  function o(u) {
    if (!u.hasAttribute(w)) return 0;
    const p = u.getAttribute(w);
    if (p === "" || p === null) return 1e3;
    const m = parseInt(p, 10);
    return isNaN(m) || m < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", u), 1e3) : m;
  }
  B(c, a, h, "ln-autosave");
})();
(function() {
  const c = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
  function y(w) {
    if (w.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", w.tagName), this;
    this.dom = w;
    const b = this;
    return this._onInput = function() {
      b._resize();
    }, w.addEventListener("input", this._onInput), this._resize(), this;
  }
  y.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  }, B(c, a, y, "ln-autoresize");
})();
(function() {
  const c = "data-ln-editor", a = "lnEditor";
  if (window[a] !== void 0) return;
  const y = {
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
  }, w = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, b = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, f = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let h = 0;
  function s(t) {
    return !!(w[t] || b[t] || f[t] || t === "link");
  }
  function l(t) {
    this.dom = t;
    const e = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const n = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), n && this._surface.setAttribute("data-placeholder", n);
    const d = this._textarea.id;
    if (d) {
      const A = t.querySelector('label[for="' + d + '"]');
      A && (A.id || (A.id = d + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = d ? d + "-surface" : "ln-editor-surface-" + ++h;
    const g = this._textarea.value.trim();
    g && (this._surface.innerHTML = g);
    const E = t.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? t.insertBefore(this._surface, E.nextSibling) : t.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const A = E.querySelectorAll("[data-ln-editor-action]");
      for (let S = 0; S < A.length; S++) {
        const q = A[S].getAttribute("data-ln-editor-action");
        s(q) && A[S].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      e._syncToTextarea(), L(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      });
    }, this._onMousedownToolbar = function(A) {
      A.target.closest("[data-ln-editor-action]") && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      const S = A.target.closest("[data-ln-editor-action]");
      if (!S) return;
      const q = S.getAttribute("data-ln-editor-action");
      e._execAction(q);
    }, this._onPaste = function(A) {
      p(e, A);
    }, this._onKeydown = function(A) {
      i(e, A);
    }, this._onSelectionChange = function() {
      document.contains(e._surface) && e._updateActiveStates();
    }, this._onFocus = function() {
      L(e.dom, "ln-editor:focus", { target: e.dom });
    }, this._onBlur = function() {
      e._syncToTextarea(), L(e.dom, "ln-editor:blur", { target: e.dom });
    }, this._onTextareaInput = function() {
      e._surface.innerHTML !== e._textarea.value && (e._surface.innerHTML = e._textarea.value, L(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      const S = A.detail && A.detail.html;
      S !== void 0 && (e._surface.innerHTML = S, e._syncToTextarea(), L(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      }));
    }, t.addEventListener("ln-editor:set-content", this._onSetContent);
    const v = this._textarea.form;
    return v && (this._onFormReset = function() {
      setTimeout(function() {
        e._surface.innerHTML = e._textarea.value, L(t, "ln-editor:changed", {
          html: e._textarea.value,
          target: t
        });
      }, 0);
    }, v.addEventListener("reset", this._onFormReset)), this;
  }
  l.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, l.prototype._execAction = function(t) {
    if (!(!t || G(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), w[t])
        document.execCommand(w[t], !1, null);
      else if (b[t]) {
        const n = b[t], d = o(this._surface);
        d && d.toLowerCase() === n ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + n + ">");
      } else f[t] ? document.execCommand(f[t], !1, null) : t === "link" ? r(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, l.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = e.anchorNode;
    if (!n || !this._surface.contains(n)) return;
    const d = t.querySelectorAll("[data-ln-editor-action]");
    for (let g = 0; g < d.length; g++) {
      const E = d[g], v = E.getAttribute("data-ln-editor-action");
      let A = !1;
      if (w[v])
        try {
          A = document.queryCommandState(w[v]);
        } catch {
        }
      else if (b[v]) {
        const S = o(this._surface);
        A = S && S.toLowerCase() === b[v];
      } else if (f[v])
        try {
          A = document.queryCommandState(f[v]);
        } catch {
        }
      else v === "link" && (A = !!u(e.anchorNode, "A", this._surface));
      s(v) && E.setAttribute("aria-pressed", String(A)), A ? E.classList.add("ln-editor-active") : E.classList.remove("ln-editor-active");
    }
  }, l.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, l.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, l.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const t = this.dom.querySelector('[role="toolbar"]');
    t && (t.removeEventListener("mousedown", this._onMousedownToolbar), t.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const e = this._textarea ? this._textarea.form : null;
    if (e && this._onFormReset && e.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const n = this.dom.querySelector(".ln-editor__link-popover");
      n && n.remove();
    }
    L(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function o(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return null;
    let n = e.anchorNode;
    if (!n) return null;
    for (; n && n !== t; ) {
      if (n.nodeType === 1) {
        const d = n.tagName;
        if (d === "H2" || d === "H3" || d === "H4" || d === "BLOCKQUOTE" || d === "PRE" || d === "P")
          return d;
      }
      n = n.parentNode;
    }
    return null;
  }
  function u(t, e, n) {
    for (; t && t !== n; ) {
      if (t.nodeType === 1 && t.tagName === e)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function p(t, e) {
    e.preventDefault();
    let n = "";
    if (e.clipboardData && (n = e.clipboardData.getData("text/html"), !n)) {
      const g = e.clipboardData.getData("text/plain");
      g && (n = g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), n = "<p>" + n + "</p>");
    }
    if (!n) return;
    const d = m(n);
    d && document.execCommand("insertHTML", !1, d);
  }
  function m(t) {
    const e = document.createElement("div");
    return e.innerHTML = t, _(e), e.innerHTML;
  }
  function _(t) {
    const e = Array.from(t.childNodes);
    for (let n = 0; n < e.length; n++) {
      const d = e[n];
      if (d.nodeType !== 3) {
        if (d.nodeType !== 1) {
          t.removeChild(d);
          continue;
        }
        if (y[d.tagName]) {
          const g = Array.from(d.attributes);
          for (let E = 0; E < g.length; E++) {
            const v = g[E].name;
            if (d.tagName === "A" && v === "href") {
              const A = d.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || d.removeAttribute("href");
            } else
              d.removeAttribute(v);
          }
          d.tagName === "A" && d.setAttribute("rel", "noopener noreferrer"), _(d);
        } else {
          for (; d.firstChild; )
            t.insertBefore(d.firstChild, d);
          t.removeChild(d);
        }
      }
    }
  }
  function i(t, e) {
    if (!(e.ctrlKey || e.metaKey)) return;
    let n = null;
    switch (e.key.toLowerCase()) {
      case "b":
        n = "bold";
        break;
      case "i":
        n = "italic";
        break;
      case "u":
        n = "underline";
        break;
      case "k":
        n = "link";
        break;
    }
    n && (e.preventDefault(), t._execAction(n));
  }
  function r(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = u(e.anchorNode, "A", t._surface), d = e.getRangeAt(0).cloneRange();
    t._closeLinkPopover && t._closeLinkPopover();
    const g = ct(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!g) return;
    const E = g.firstElementChild;
    if (!E) return;
    const v = E.querySelector('input[type="url"]'), A = E.querySelector('[data-ln-editor-action="confirm-link"]'), S = E.querySelector('[data-ln-editor-action="cancel-link"]');
    n && (v.value = n.getAttribute("href") || "");
    const q = t.dom.querySelector('[role="toolbar"]');
    q ? q.after(E) : t.dom.insertBefore(E, t._surface), v.focus();
    function T() {
      const H = window.getSelection();
      H.removeAllRanges(), H.addRange(d);
    }
    function x() {
      document.removeEventListener("mousedown", z), t._closeLinkPopover = null, E.remove();
    }
    function k() {
      const H = v.value.trim();
      if (x(), T(), t._surface.focus(), H)
        if (n)
          n.setAttribute("href", H), n.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), L(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, H);
          const U = window.getSelection();
          if (U && U.anchorNode) {
            const K = u(U.anchorNode, "A", t._surface);
            K && (K.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else n && document.execCommand("unlink", !1, null);
    }
    function R() {
      x(), T(), t._surface.focus();
    }
    function N() {
      x();
    }
    function z(H) {
      const U = t.dom.contains(H.target) && H.target.closest('[data-ln-editor-action="link"]');
      !E.contains(H.target) && !U && N();
    }
    t._closeLinkPopover = x, A.addEventListener("click", k), S.addEventListener("click", R), v.addEventListener("keydown", function(H) {
      H.key === "Enter" ? (H.preventDefault(), k()) : H.key === "Escape" && (H.preventDefault(), R());
    }), document.addEventListener("mousedown", z);
  }
  B(c, a, l, "ln-editor");
})();
(function() {
  const c = "lnFill";
  if (window[c] !== void 0) return;
  const a = { lnFillForm: !0, lnFillStore: !0 };
  function y(b) {
    const f = {}, h = b.dataset;
    for (const s in h) {
      if (!s.startsWith("lnFill") || a[s]) continue;
      const l = s.slice(6);
      l && (f[l.charAt(0).toLowerCase() + l.slice(1)] = h[s]);
    }
    return f;
  }
  function w(b, f) {
    const h = window.CSS && CSS.escape ? CSS.escape(f) : f, s = document.querySelectorAll('[data-ln-fill-id="' + h + '"]');
    if (s.length === 0) return null;
    for (let l = 0; l < s.length; l++) {
      const o = s[l].getAttribute("data-ln-fill-form");
      if (o) {
        const u = document.getElementById(o);
        if (u && b.contains(u)) return s[l];
      }
    }
    return s[0];
  }
  document.addEventListener("click", function(b) {
    if (b.ctrlKey || b.metaKey || b.button === 1) return;
    const f = b.target.closest("[data-ln-fill-form]");
    if (!f) return;
    const h = f.getAttribute("href");
    if (h && h.indexOf("#") !== -1) return;
    const s = f.getAttribute("data-ln-fill-form"), l = document.getElementById(s);
    if (!l) return;
    const o = y(f), u = Object.keys(o).length > 0;
    window.lnCore.lnFill(l, u ? o : null);
  }), document.addEventListener("ln-fill:request", function(b) {
    const f = b.detail;
    if (!f) return;
    const h = b.target, s = f.id;
    if (s == null) {
      window.lnCore.lnFill(h, null);
      return;
    }
    const l = w(h, s);
    if (!l) return;
    const o = y(l);
    window.lnCore.lnFill(h, o);
  }), window[c] = !0;
})();
(function() {
  const c = "data-ln-slug-from", a = "lnSlug";
  if (window[a] !== void 0) return;
  function y(b) {
    return String(b).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function w(b) {
    if (b.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", b.tagName), this;
    const f = b.form;
    if (!f)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", b), this;
    const h = b.getAttribute(c), s = f.elements[h];
    if (!s)
      return console.warn('[ln-slug] Source field "' + h + '" not found in form:', b), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + h + '" is a RadioNodeList (same-name group) — single source field required:', b), this;
    this.dom = b, this.source = s, this._pristine = b.value === "", this._mirroring = !1;
    const l = this;
    return this._onSource = function() {
      l._pristine && l._mirror();
    }, this._onSlug = function() {
      l._mirroring || (l._pristine = l.dom.value === "");
    }, s.addEventListener("input", this._onSource), b.addEventListener("input", this._onSlug), this;
  }
  w.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = y(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, w.prototype.destroy = function() {
    this.dom[a] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[a]);
  }, B(c, a, w, "ln-slug");
})();
(function() {
  const c = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const y = {}, w = {};
  function b(v) {
    return v.getAttribute("data-ln-time-locale") || W(v);
  }
  function f(v, A) {
    const S = (v || "") + "|" + JSON.stringify(A);
    return y[S] || (y[S] = new Intl.DateTimeFormat(v, A)), y[S];
  }
  function h(v) {
    const A = v || "";
    return w[A] || (w[A] = new Intl.RelativeTimeFormat(v, { numeric: "auto", style: "narrow" })), w[A];
  }
  const s = /* @__PURE__ */ new Set();
  let l = null;
  function o() {
    l || (l = setInterval(p, 6e4));
  }
  function u() {
    l && (clearInterval(l), l = null);
  }
  function p() {
    for (const v of s) {
      if (!document.body.contains(v.dom)) {
        s.delete(v);
        continue;
      }
      e(v);
    }
    s.size === 0 && u();
  }
  function m(v, A) {
    const S = vt(A), q = (A || "").toLowerCase().split("-")[0], T = f(A, { dateStyle: "long", timeStyle: "short" }), x = T.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && x !== q && S.monthsLong) {
      const k = S.monthsLong[v.getMonth()], R = v.getDate(), N = v.getFullYear(), z = String(v.getHours()).padStart(2, "0"), H = String(v.getMinutes()).padStart(2, "0");
      return `${R} ${k} ${N} во ${z}:${H}`;
    }
    return T.format(v);
  }
  function _(v, A) {
    const S = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    v.getFullYear() !== S.getFullYear() && (q.year = "numeric");
    const T = vt(A), x = (A || "").toLowerCase().split("-")[0], k = f(A, q), R = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (T && R !== x && T.monthsShort) {
      const N = T.monthsShort[v.getMonth()], z = v.getDate(), H = v.getFullYear() !== S.getFullYear() ? " " + v.getFullYear() : "";
      return `${z} ${N}${H}`;
    }
    return k.format(v);
  }
  function i(v, A) {
    return f(A, { dateStyle: "medium" }).format(v);
  }
  function r(v, A) {
    return f(A, { timeStyle: "short" }).format(v);
  }
  function t(v, A) {
    const S = Math.floor(Date.now() / 1e3), T = Math.floor(v.getTime() / 1e3) - S, x = Math.abs(T);
    if (x < 10) return h(A).format(0, "second");
    let k, R;
    if (x < 60)
      k = "second", R = T;
    else if (x < 3600)
      k = "minute", R = Math.round(T / 60);
    else if (x < 86400)
      k = "hour", R = Math.round(T / 3600);
    else if (x < 604800)
      k = "day", R = Math.round(T / 86400);
    else if (x < 2592e3)
      k = "week", R = Math.round(T / 604800);
    else
      return _(v, A);
    return h(A).format(R, k);
  }
  function e(v) {
    const A = v.dom.getAttribute("datetime");
    if (!A) return;
    const S = Number(A);
    if (isNaN(S)) return;
    const q = new Date(S * 1e3), T = v.dom.getAttribute(c) || "short", x = b(v.dom);
    let k;
    switch (T) {
      case "relative":
        k = t(q, x);
        break;
      case "full":
        k = m(q, x);
        break;
      case "date":
        k = i(q, x);
        break;
      case "time":
        k = r(q, x);
        break;
      default:
        k = _(q, x);
        break;
    }
    v.dom.textContent = k, T !== "full" && (v.dom.title = m(q, x));
  }
  function n(v) {
    return this.dom = v, e(this), v.getAttribute(c) === "relative" && (s.add(this), o()), this;
  }
  n.prototype.render = function() {
    e(this);
  }, n.prototype.destroy = function() {
    s.delete(this), s.size === 0 && u(), delete this.dom[a];
  };
  function d(v) {
    const A = v[a];
    if (!A) return;
    v.getAttribute(c) === "relative" ? (s.add(A), o()) : (s.delete(A), s.size === 0 && u()), e(A);
  }
  function g(v) {
    v.nodeType === 1 && v.hasAttribute && v.hasAttribute(c) && v[a] && e(v[a]);
  }
  function E() {
    new MutationObserver(function() {
      const v = document.querySelectorAll("[" + c + "]");
      for (let A = 0; A < v.length; A++) {
        const S = v[A][a];
        S && e(S);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(c, a, n, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: d,
    onInit: g
  }), E();
})();
function rn(c) {
  c = c || {};
  let a = c.windowSize > 0 ? c.windowSize : 1e3, y = c.pageSize > 0 ? c.pageSize : 200, w = c.fetchDebounce != null ? c.fetchDebounce : 120;
  const b = typeof c.requestPage == "function" ? c.requestPage : function() {
  }, f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let l = 0, o = 0, u = 0, p = null, m = 0;
  function _(t) {
    h.set(t, ++m);
  }
  function i() {
    if (f.size <= a) return;
    const t = Array.from(f.keys()).sort(function(n, d) {
      return (h.get(n) || 0) - (h.get(d) || 0);
    });
    let e = 0;
    for (; f.size > a && e < t.length; )
      f.delete(t[e]), h.delete(t[e]), e++;
  }
  function r(t, e, n) {
    s.add(t), b(t, e, n);
  }
  return {
    get logicalTotal() {
      return l;
    },
    set logicalTotal(t) {
      l = t;
    },
    get grandTotal() {
      return o;
    },
    set grandTotal(t) {
      o = t;
    },
    get queryGen() {
      return u;
    },
    set queryGen(t) {
      u = t;
    },
    get size() {
      return f.size;
    },
    getId: function(t) {
      if (f.has(t))
        return _(t), f.get(t);
    },
    // The caller asks for an exact range it already decided it needs — the
    // index is an id resolver, not a scroll surface. Prefetch padding is the
    // view's job (it owns the viewport); padding here would fetch a page
    // nobody asked for on top of every page the view asks for.
    ensure: function(t, e, n) {
      if (l <= 0) {
        s.has(0) || (clearTimeout(p), p = setTimeout(function() {
          r(0, y, n);
        }, w));
        return;
      }
      const d = Math.max(0, t), g = Math.min(l, e), E = Math.floor(d / y), v = Math.floor(Math.max(0, g - 1) / y);
      let A = -1;
      for (let S = E; S <= v; S++) {
        const q = S * y, T = Math.min(y, l - q);
        let x = !1;
        const k = Math.max(q, d), R = Math.min(q + T, g);
        for (let N = k; N < R; N++)
          if (!f.has(N)) {
            x = !0;
            break;
          }
        if (x && !s.has(q)) {
          A = q;
          break;
        }
      }
      A !== -1 && (clearTimeout(p), p = setTimeout(function() {
        r(A, y, n);
      }, w));
    },
    ingest: function(t, e, n, d, g) {
      if (!(g != null && g !== u)) {
        o = n ?? o, l = d ?? l;
        for (let E = 0; E < e.length; E++)
          f.set(t + E, e[E]), _(t + E);
        s.delete(t), i();
      }
    },
    // Query change: new generation, positions dropped. The totals are kept
    // as the stale-while-revalidate carry-over the view renders against
    // until the new generation's first page lands in ingest() — same
    // contract as createWindowCache.invalidate().
    reset: function() {
      u++, f.clear(), h.clear(), s.clear(), clearTimeout(p);
    },
    clear: function() {
      f.clear(), h.clear(), s.clear(), clearTimeout(p);
    },
    configure: function(t) {
      if (t = t || {}, t.windowSize != null && t.windowSize > 0 && t.windowSize !== a) {
        const e = t.windowSize < a;
        a = t.windowSize, e && i();
      }
      t.pageSize != null && t.pageSize > 0 && (y = t.pageSize), t.fetchDebounce != null && t.fetchDebounce >= 0 && (w = t.fetchDebounce);
    }
  };
}
(function() {
  const c = "data-ln-data-store", a = "lnDataStore";
  if (window[a] !== void 0) return;
  const y = "ln_app_cache", w = "_meta", b = "1.0";
  let f = null, h = null;
  const s = {};
  function l(C) {
    C && C.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function o() {
    const C = {};
    for (const I of document.querySelectorAll(`[${c}]`)) {
      const D = I.id;
      if (D) {
        const M = I.getAttribute("data-ln-data-store-indexes") || "";
        C[D] = {
          indexes: M.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function u() {
    return h || (h = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), C(null);
      const I = o(), D = Object.keys(I), M = indexedDB.open(y);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, M.onsuccess = (O) => {
        const F = O.target.result, P = Array.from(F.objectStoreNames);
        if (!(!P.includes(w) || D.some((tt) => !P.includes(tt))))
          return p(F), f = F, C(F);
        const V = F.version;
        F.close();
        const Q = indexedDB.open(y, V + 1);
        Q.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, Q.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, Q.onupgradeneeded = (tt) => {
          const ot = tt.target.result;
          ot.objectStoreNames.contains(w) || ot.createObjectStore(w, { keyPath: "key" });
          for (const Rt of D)
            if (!ot.objectStoreNames.contains(Rt)) {
              const Ne = ot.createObjectStore(Rt, { keyPath: "id" });
              for (const Zt of I[Rt].indexes)
                Ne.createIndex(Zt, Zt, { unique: !1 });
            }
        }, Q.onsuccess = (tt) => {
          const ot = tt.target.result;
          p(ot), f = ot, C(ot);
        };
      };
    }), h);
  }
  function p(C) {
    C.onversionchange = () => {
      C.close(), f = null, h = null;
    };
  }
  function m() {
    return f ? Promise.resolve(f) : (h = null, u());
  }
  async function _(C) {
    if (!dt() || !C) return C;
    const I = { ...C }, D = I.id, M = await Qe(I);
    return !M || !M.encrypted ? C : {
      id: D,
      encrypted: !0,
      iv: M.iv,
      data: M.data
    };
  }
  async function i(C) {
    return !C || !C.encrypted || !dt() ? C : $e(C);
  }
  const r = (C, I) => m().then((D) => D ? D.transaction(C, I).objectStore(C) : null);
  function t(C) {
    return new Promise((I, D) => {
      C.onsuccess = () => I(C.result), C.onerror = () => {
        l(C.error), D(C.error);
      };
    });
  }
  const e = (C) => r(C, "readonly").then((I) => I ? t(I.getAll()) : []).then((I) => dt() ? Promise.all(I.map((D) => i(D))) : I), n = (C, I) => r(C, "readonly").then((D) => D ? t(D.get(I)) : null).then((D) => D ? i(D) : null), d = (C, I) => m().then((D) => {
    if (!D) return [];
    const O = D.transaction(C, "readonly").objectStore(C), F = I.map((P) => t(O.get(P)));
    return Promise.all(F).then((P) => dt() ? Promise.all(P.map((j) => i(j))) : P);
  }), g = (C, I) => (dt() ? _(I) : Promise.resolve(I)).then((M) => r(C, "readwrite").then((O) => O ? t(O.put(M)) : null)), E = (C, I) => r(C, "readwrite").then((D) => D ? t(D.delete(I)) : null), v = (C) => r(C, "readwrite").then((I) => I ? t(I.clear()) : null), A = (C) => r(C, "readonly").then((I) => I ? t(I.count()) : 0), S = (C) => r(w, "readonly").then((I) => I ? t(I.get(C)) : null), q = (C, I) => r(w, "readwrite").then((D) => {
    if (D)
      return I.key = C, t(D.put(I));
  });
  function T(C) {
    this.dom = C, this._name = C.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", C);
    const I = C.getAttribute("data-ln-data-store-stale"), D = parseInt(I, 10);
    this._staleThreshold = I === "never" || I === "-1" ? -1 : isNaN(D) ? 300 : D;
    const M = C.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = M.split(",").map((F) => F.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const O = C.getAttribute("data-ln-data-store-window");
    if (O !== null) {
      const F = parseInt(O, 10) || 1e3, P = parseInt(C.getAttribute("data-ln-data-store-window-page"), 10) || 200;
      this._windowIndex = rn({
        windowSize: F,
        pageSize: P,
        requestPage: (j, V, Q) => {
          L(this.dom, "ln-data-store:request-page", {
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
    return this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), s[this._name] = this, x(this), this.ready = rt(this), this;
  }
  function x(C) {
    C._handlers = {
      create: (I) => k(C, "create", I.detail, () => N(C, I.detail)),
      update: (I) => k(C, "update", I.detail, () => z(C, I.detail)),
      delete: (I) => k(C, "delete", I.detail, () => H(C, I.detail)),
      "bulk-delete": (I) => k(C, "bulk-delete", I.detail, () => U(C, I.detail)),
      "sync-failed": (I) => {
        C.isSyncing = !1, L(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: I.detail && I.detail.error,
          status: I.detail && I.detail.status
        });
      }
    };
    for (const [I, D] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${I}`, D);
    C._queryHandlers = {
      "ln-search:change": (I) => {
        I.preventDefault();
        const D = I.detail && I.detail.term != null ? I.detail.term : "";
        D !== C.query.search && (C.query.search = D, Dt(C));
      },
      "ln-filter:change": (I) => {
        I.preventDefault();
        const D = I.detail && I.detail.key;
        if (!D) return;
        const M = (I.detail.values || []).slice(), O = C.query.filters[D];
        (O ? O.length === M.length && O.every((P, j) => P === M[j]) : !M.length) || (M.length ? C.query.filters[D] = M : delete C.query.filters[D], Dt(C));
      },
      "ln-sort:change": (I) => {
        I.preventDefault();
        const D = I.detail && I.detail.field, M = I.detail && I.detail.direction, O = M && M !== "none" ? { field: D, direction: M } : null, F = C.query.sort;
        !F && !O || F && O && F.field === O.field && F.direction === O.direction || (C.query.sort = O, Dt(C));
      }
    };
    for (const [I, D] of Object.entries(C._queryHandlers))
      C.dom.addEventListener(I, D);
  }
  function k(C, I, D, M) {
    const O = D && D.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return M();
    }).catch((F) => K(C, I, O, F)), C._mutationChain;
  }
  function R(C) {
    return A(C._name).then((I) => (C.totalCount = I, C.hasCache = !0, C.isLoaded = !0, q(C._name, {
      schema_version: b,
      last_synced_at: C.lastSyncedAt,
      has_cache: !0,
      record_count: I
    })));
  }
  function N(C, { tempId: I, data: D = {}, requestId: M } = {}) {
    const O = { ...D, id: I };
    return g(C._name, O).then(() => R(C)).then(() => {
      L(C.dom, "ln-data-store:created", { store: C._name, record: O, tempId: I, requestId: M });
    });
  }
  function z(C, { id: I, data: D = {}, requestId: M } = {}) {
    return n(C._name, I).then((O) => {
      if (!O) throw new Error(`Record not found: ${I}`);
      const F = { ...O, ...D }, P = D.id;
      return (P !== void 0 && P !== I ? Ie(C._name, I, F) : g(C._name, F)).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:updated", { store: C._name, record: F, previous: O, requestId: M });
      });
    });
  }
  function H(C, { id: I, requestId: D } = {}) {
    return n(C._name, I).then((M) => {
      if (!M) {
        L(C.dom, "ln-data-store:deleted", { store: C._name, id: I, requestId: D, missing: !0 });
        return;
      }
      return E(C._name, I).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:deleted", { store: C._name, id: I, requestId: D });
      });
    });
  }
  function U(C, { ids: I = [], requestId: D } = {}) {
    return I.length ? Promise.all(I.map((M) => n(C._name, M))).then((M) => {
      const O = M.filter(Boolean).map((F) => F.id);
      return Yt(C._name, O).then(() => R(C)).then(() => {
        L(C.dom, "ln-data-store:deleted", { store: C._name, ids: O, requestId: D });
      });
    }) : (L(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: D }), Promise.resolve());
  }
  function K(C, I, D, M) {
    console.error("[ln-data-store] " + I + " failed:", M), L(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: I,
      requestId: D,
      error: M
    });
  }
  function rt(C) {
    return u().then((I) => {
      if (!I) throw new Error("IndexedDB is unavailable");
      return S(C._name);
    }).then((I) => {
      if (C.initializationError = null, I && I.schema_version === b)
        C.lastSyncedAt = I.last_synced_at || null, C.totalCount = I.record_count || 0, C.hasCache = I.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, L(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (I && I.schema_version !== b)
          return v(C._name).then(() => q(C._name, { schema_version: b, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, L(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((I) => (C.isInitialized = !0, C.isLoaded = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = I, L(C.dom, "ln-data-store:initialization-error", { store: C._name, error: I }), { ok: !1, error: I }));
  }
  function $t(C) {
    C.isSyncing = !0, L(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function Xt(C, I) {
    return m().then((D) => D ? (dt() ? Promise.all(I.map((O) => _(O))) : Promise.resolve(I)).then((O) => new Promise((F, P) => {
      const j = D.transaction(C, "readwrite"), V = j.objectStore(C);
      O.forEach((Q) => V.put(Q)), j.oncomplete = () => F(), j.onerror = () => {
        l(j.error), P(j.error);
      };
    })) : void 0);
  }
  function Yt(C, I) {
    return m().then((D) => {
      if (D)
        return new Promise((M, O) => {
          const F = D.transaction(C, "readwrite"), P = F.objectStore(C);
          I.forEach((j) => P.delete(j)), F.oncomplete = () => M(), F.onerror = () => O(F.error);
        });
    });
  }
  function Ie(C, I, D) {
    return (dt() ? _(D) : Promise.resolve(D)).then((O) => m().then((F) => {
      if (F)
        return new Promise((P, j) => {
          const V = F.transaction(C, "readwrite"), Q = V.objectStore(C);
          Q.put(O), Q.delete(I), V.oncomplete = () => P(), V.onerror = () => {
            l(V.error), j(V.error);
          };
        });
    }));
  }
  const De = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Re(C, I) {
    if (!I || !I.field) return C;
    const { field: D, direction: M } = I, O = M === "desc";
    return [...C].sort((F, P) => {
      const j = F[D], V = P[D];
      if (j == null && V == null) return 0;
      if (j == null) return O ? 1 : -1;
      if (V == null) return O ? -1 : 1;
      const Q = typeof j == "string" && typeof V == "string" ? De.compare(j, V) : j < V ? -1 : j > V ? 1 : 0;
      return O ? -Q : Q;
    });
  }
  function Jt(C, I) {
    if (!I) return C;
    const D = Object.keys(I).filter((M) => Array.isArray(I[M]) && I[M].length > 0);
    return D.length ? C.filter(
      (M) => D.every((O) => I[O].map(String).includes(String(M[O])))
    ) : C;
  }
  function Oe(C, I, D) {
    if (!I || !D || !D.length) return C;
    const M = I.toLowerCase();
    return C.filter(
      (O) => D.some((F) => {
        const P = O[F];
        return P != null && String(P).toLowerCase().includes(M);
      })
    );
  }
  function Me(C, I, D) {
    if (!C.length) return 0;
    if (D === "count") return C.length;
    const M = C.map((F) => parseFloat(F[I])).filter((F) => !isNaN(F)), O = M.reduce((F, P) => F + P, 0);
    return D === "sum" ? O : D === "avg" && M.length ? O / M.length : 0;
  }
  function At(C, I) {
    if (!C.presenters || !C.presenters.computed) return I;
    const D = C.presenters.computed;
    return I.map((M) => {
      if (!M) return null;
      const O = { ...M };
      for (const [F, P] of Object.entries(D))
        try {
          O[F] = P(M);
        } catch (j) {
          console.error(`[ln-data-store] Decorator computed field failed for ${F}`, j);
        }
      return O;
    });
  }
  T.prototype.getAll = function(C = {}) {
    const I = this;
    if (I._windowIndex) {
      const D = C.offset || 0, M = C.limit || 200;
      I._windowIndex.ensure(D, D + M, C);
      const O = [];
      for (let P = D; P < D + M; P++) {
        const j = I._windowIndex.getId(P);
        O.push(j);
      }
      const F = Array.from(new Set(O.filter((P) => P !== void 0)));
      return d(I._name, F).then((P) => {
        const j = /* @__PURE__ */ new Map();
        for (let Q = 0; Q < P.length; Q++) {
          const tt = P[Q];
          tt && j.set(String(tt.id), tt);
        }
        const V = [];
        for (let Q = 0; Q < O.length; Q++) {
          const tt = O[Q];
          if (tt === void 0)
            V.push(null);
          else {
            const ot = j.get(String(tt));
            V.push(ot || null);
          }
        }
        return {
          data: At(I, V),
          total: I._windowIndex.grandTotal,
          filtered: I._windowIndex.logicalTotal,
          offset: D,
          queryGen: I._windowIndex.queryGen
        };
      });
    }
    return e(I._name).then((D) => {
      const M = D.length;
      C.filters && (D = Jt(D, C.filters)), C.search && (D = Oe(D, C.search, I._searchFields));
      const O = D.length;
      if (C.sort && (D = Re(D, C.sort)), C.offset || C.limit) {
        const F = C.offset || 0, P = C.limit || D.length;
        D = D.slice(F, F + P);
      }
      return {
        data: At(I, D),
        total: M,
        filtered: O
      };
    });
  }, T.prototype.getById = function(C) {
    return n(this._name, C).then((I) => I ? At(this, [I])[0] : null);
  }, T.prototype.count = function(C) {
    return C ? e(this._name).then((I) => Jt(I, C).length) : A(this._name);
  }, T.prototype.aggregate = function(C, I) {
    return e(this._name).then((D) => Me(D, C, I));
  }, T.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, T.prototype.applySync = function(C, I, D, M) {
    M = M || {};
    const O = this;
    if (O._windowIndex && M.queryGen != null && M.queryGen !== O._windowIndex.queryGen)
      return Promise.resolve();
    C.length > 0 || I.length > 0;
    let F = Promise.resolve();
    return C.length > 0 && (F = F.then(() => Xt(O._name, C))), I.length > 0 && (F = F.then(() => Yt(O._name, I))), F.then(() => {
      if (O._windowIndex && (M.offset != null || M.total != null)) {
        const P = M.offset != null ? M.offset : 0, j = C.map((V) => V.id);
        O._windowIndex.ingest(P, j, M.total, M.filtered, M.queryGen);
      }
    }).then(() => A(O._name)).then((P) => (O.totalCount = M.total !== void 0 ? M.total : P, O.hasCache = !0, q(O._name, {
      schema_version: b,
      last_synced_at: D,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const P = !O.isLoaded;
      O.isLoaded = !0, O.isSyncing = !1, O.lastSyncedAt = D, P ? (L(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: M }), L(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: M })) : L(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: C.length,
        deleted: I.length,
        changed: !0,
        meta: M
      });
    }).catch((P) => {
      O.isSyncing = !1, console.error("[ln-data-store] applySync failed:", P);
    });
  }, T.prototype.applyQuery = function(C, I) {
    I = I || {};
    const D = this;
    let M = Promise.resolve();
    return C.length > 0 && (M = M.then(() => Xt(D._name, C))), M.then(() => A(D._name)).then((O) => (D.totalCount = I.total !== void 0 ? I.total : O, At(D, C))).catch((O) => (console.error("[ln-data-store] applyQuery failed:", O), []));
  }, T.prototype.forceSync = function() {
    this.isSyncing || $t(this);
  }, T.prototype.fullReload = function() {
    const C = this;
    return v(C._name).then(() => q(C._name, {
      schema_version: b,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, $t(C);
    });
  }, T.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null), this._handlers) {
      for (const [C, I] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, I);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [C, I] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(C, I);
      this._queryHandlers = null;
    }
    delete s[this._name], delete this.dom[a], L(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Fe() {
    return m().then((C) => {
      if (!C) return;
      const I = Array.from(C.objectStoreNames);
      return new Promise((D, M) => {
        const O = C.transaction(I, "readwrite");
        I.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => D(), O.onerror = () => M(O.error);
      });
    }).then(() => {
      Object.values(s).forEach((C) => {
        C.isLoaded = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  function Dt(C) {
    C._windowIndex && C._windowIndex.reset(), L(C.dom, "ln-data-store:query-changed", {
      store: C._name,
      query: {
        filters: Object.assign({}, C.query.filters),
        search: C.query.search,
        sort: C.query.sort ? Object.assign({}, C.query.sort) : null
      }
    });
  }
  B(c, a, T, "ln-data-store"), window[a].clearAll = Fe, window[a].init = window[a], window[a].setStorageKey = ee, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ee);
})();
(function() {
  const c = "data-ln-api-connector", a = "lnApiConnector", y = "lnConnector";
  if (window[a] !== void 0) return;
  function w(s) {
    return s.ok ? s.status === 204 ? null : s.json() : s.json().catch(() => null).then((l) => {
      const o = new Error("HTTP " + s.status + ": " + s.statusText);
      throw o.status = s.status, o.data = l, o;
    });
  }
  function b(s) {
    return this.dom = s, s[a] = this, s[y] = this, this._inflight = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, f(this), this;
  }
  b.prototype.refreshConfig = function() {
    const s = this.dom;
    this.baseUrl = s.getAttribute("data-ln-api-base-url") || "", this.path = s.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: s.getAttribute("data-ln-api-param-offset") || "offset",
      limit: s.getAttribute("data-ln-api-param-limit") || "limit",
      search: s.getAttribute("data-ln-api-param-search") || "search",
      sortField: s.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: s.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const l = s.getAttribute("data-ln-api-headers") || "";
    this.headers = fe(l, "ln-api-connector"), (l.toLowerCase().includes("authorization") || l.toLowerCase().includes("bearer") || l.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(s, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, b.prototype._reqHeaders = function(s) {
    const l = Object.assign({}, gt(this.headers), { "X-LN-Response": "data" });
    return s && (l["Idempotency-Key"] = s), l;
  }, b.prototype.fetchDelta = function(s, l) {
    const o = this;
    let u = X(o.baseUrl, o.path);
    s != null && s !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(s));
    const p = l || "sync";
    o._inflight.has(p) && o._inflight.get(p).abort();
    const m = new AbortController();
    return o._inflight.set(p, m), window.fetch(u, {
      method: "GET",
      headers: o._reqHeaders(),
      credentials: o.credentials,
      signal: m.signal
    }).then(w).finally(function() {
      o._inflight.get(p) === m && o._inflight.delete(p);
    });
  }, b.prototype.query = function(s, l) {
    const o = this;
    s = s || {};
    let u = X(o.baseUrl, o.path);
    const p = o.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, m = new URLSearchParams();
    s.search && m.append(p.search, s.search), s.offset != null && m.append(p.offset, s.offset), s.limit != null && m.append(p.limit, s.limit), s.sort && s.sort.field && s.sort.direction && (m.append(p.sortField, s.sort.field), m.append(p.sortDir, s.sort.direction)), s.filters && typeof s.filters == "object" && Object.keys(s.filters).forEach((e) => {
      const n = s.filters[e];
      Array.isArray(n) && n.length > 0 && m.append(e, n.join(","));
    });
    const _ = m.toString();
    _ && (u += (u.indexOf("?") !== -1 ? "&" : "?") + _);
    let i = null;
    l && (o._inflight.has(l) && o._inflight.get(l).abort(), i = new AbortController(), o._inflight.set(l, i));
    const r = {
      method: "GET",
      headers: o._reqHeaders(),
      credentials: o.credentials
    };
    i && (r.signal = i.signal);
    let t = window.fetch(u, r).then(w);
    return l && i && (t = t.finally(function() {
      o._inflight.get(l) === i && o._inflight.delete(l);
    })), t;
  }, b.prototype.create = function(s, l, o) {
    const u = this;
    return window.fetch(X(u.baseUrl, l || u.path), {
      method: "POST",
      headers: u._reqHeaders(o),
      credentials: u.credentials,
      body: JSON.stringify(s)
    }).then(w);
  }, b.prototype.update = function(s, l, o, u, p) {
    const m = this;
    o != null && (l = Object.assign({}, l, { expected_version: o }));
    const _ = u ? X(m.baseUrl, u) : X(m.baseUrl, m.path, s);
    return window.fetch(_, {
      method: "PUT",
      headers: m._reqHeaders(p),
      credentials: m.credentials,
      body: JSON.stringify(l)
    }).then(w);
  }, b.prototype.delete = function(s, l, o) {
    const u = this;
    return window.fetch(X(u.baseUrl, l || u.path, s), {
      method: "DELETE",
      headers: u._reqHeaders(o),
      credentials: u.credentials
    }).then(w);
  }, b.prototype.bulkDelete = function(s, l, o) {
    const u = this;
    return window.fetch(X(u.baseUrl, l || u.path) + "/bulk-delete", {
      method: "DELETE",
      headers: u._reqHeaders(o),
      credentials: u.credentials,
      body: JSON.stringify({ ids: s })
    }).then(w);
  };
  function f(s) {
    s._handlers = {
      sync: function(o) {
        const u = o.detail || {}, p = u.meta && u.meta.targetEl ? u.meta.targetEl : null;
        s.fetchDelta(u.since, p).then(function(m) {
          L(s.dom, "ln-api-connector:fetched", { data: m, since: u.since, meta: u.meta || null });
        }).catch(function(m) {
          m && m.name === "AbortError" || L(s.dom, "ln-api-connector:error", {
            action: "sync",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            since: u.since,
            meta: u.meta || null
          });
        });
      },
      query: function(o) {
        const u = o.detail || {}, p = u.query || u, m = u.meta && u.meta.targetEl ? u.meta.targetEl : null;
        s.query(p, m).then(function(_) {
          const i = _ || {};
          L(s.dom, "ln-api-connector:fetched", {
            data: i.data || (Array.isArray(i) ? i : []),
            total: i.total,
            filtered: i.filtered,
            offset: p.offset,
            queryGen: p.queryGen,
            meta: u.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || L(s.dom, "ln-api-connector:error", {
            action: "query",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            meta: u.meta || null
          });
        });
      },
      create: function(o) {
        const u = o.detail || {};
        s.create(u.data, u.url, u.idempotencyKey).then(function(p) {
          const m = p && p.content !== void 0 ? p.content : p, _ = p && p.message ? p.message : null;
          L(s.dom, "ln-api-connector:created", { record: m, tempId: u.tempId, message: _, meta: u.meta || null });
        }).catch(function(p) {
          L(s.dom, "ln-api-connector:error", {
            action: "create",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            tempId: u.tempId,
            meta: u.meta || null
          });
        });
      },
      update: function(o) {
        const u = o.detail || {};
        s.update(u.id, u.data, u.expected_version, u.url, u.idempotencyKey).then(function(p) {
          const m = p && p.content !== void 0 ? p.content : p, _ = p && p.message ? p.message : null;
          L(s.dom, "ln-api-connector:updated", { record: m, id: u.id, message: _, meta: u.meta || null });
        }).catch(function(p) {
          L(s.dom, "ln-api-connector:error", {
            action: "update",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            id: u.id,
            conflictData: p.status === 409 ? p.data : null,
            meta: u.meta || null
          });
        });
      },
      delete: function(o) {
        const u = o.detail || {};
        s.delete(u.id, u.url, u.idempotencyKey).then(function(p) {
          const m = p && p.message ? p.message : null;
          L(s.dom, "ln-api-connector:deleted", { response: p, id: u.id, message: m, meta: u.meta || null });
        }).catch(function(p) {
          L(s.dom, "ln-api-connector:error", {
            action: "delete",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            id: u.id,
            meta: u.meta || null
          });
        });
      },
      bulkDelete: function(o) {
        const u = o.detail || {};
        s.bulkDelete(u.ids, u.url, u.idempotencyKey).then(function(p) {
          const m = p && p.message ? p.message : null;
          L(s.dom, "ln-api-connector:bulk-deleted", { response: p, ids: u.ids, message: m, meta: u.meta || null });
        }).catch(function(p) {
          L(s.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            ids: u.ids,
            meta: u.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(o) {
      s.dom.addEventListener(o + ":request-sync", s._handlers.sync), s.dom.addEventListener(o + ":request-query", s._handlers.query), s.dom.addEventListener(o + ":request-fetch", s._handlers.query), s.dom.addEventListener(o + ":request-create", s._handlers.create), s.dom.addEventListener(o + ":request-update", s._handlers.update), s.dom.addEventListener(o + ":request-delete", s._handlers.delete), s.dom.addEventListener(o + ":request-bulk-delete", s._handlers.bulkDelete);
    });
  }
  b.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const s = this;
    s._inflight && (s._inflight.forEach(function(l) {
      l.abort();
    }), s._inflight.clear()), s._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(o) {
      s.dom.removeEventListener(o + ":request-sync", s._handlers.sync), s.dom.removeEventListener(o + ":request-query", s._handlers.query), s.dom.removeEventListener(o + ":request-fetch", s._handlers.query), s.dom.removeEventListener(o + ":request-create", s._handlers.create), s.dom.removeEventListener(o + ":request-update", s._handlers.update), s.dom.removeEventListener(o + ":request-delete", s._handlers.delete), s.dom.removeEventListener(o + ":request-bulk-delete", s._handlers.bulkDelete);
    }), s._handlers = null), L(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[y];
  };
  function h(s) {
    const l = s[a];
    l && l.refreshConfig();
  }
  B(c, a, b, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers",
      "data-ln-api-param-offset",
      "data-ln-api-param-limit",
      "data-ln-api-param-search",
      "data-ln-api-param-sort-field",
      "data-ln-api-param-sort-dir"
    ],
    onAttributeChange: h
  });
})();
(function() {
  const c = "data-ln-couchdb-connector", a = "lnCouchDbConnector", y = "lnConnector";
  if (window[a] !== void 0) return;
  function w(m) {
    const _ = m && m.content !== void 0 ? m.content : m, i = m && m.message ? m.message : null;
    return { content: _, message: i };
  }
  function b(m) {
    return this.dom = m, m[a] = this, m[y] = this, this.refreshConfig(), this._handlers = null, u(this), this;
  }
  b.prototype.refreshConfig = function() {
    const m = this.dom;
    this.url = m.getAttribute("data-ln-couchdb-url") || "", this.db = m.getAttribute("data-ln-couchdb-db") || "", this.auth = m.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const _ = m.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = fe(_, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), _.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(m, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function f(m, _, i) {
    const r = Object.assign({}, gt(m.headers, m.auth), i || {});
    return _ && (r["Idempotency-Key"] = _), r;
  }
  b.prototype.fetchDelta = function(m) {
    const _ = this, i = ["include_docs=true", "feed=normal"];
    m && i.push("since=" + encodeURIComponent(m));
    const r = X(_.url, _.db, "_changes") + "?" + i.join("&");
    return window.fetch(r, { method: "GET", headers: gt(_.headers, _.auth), credentials: _.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = t.results || [];
      return {
        data: e.filter((n) => !n.deleted && n.doc).map((n) => Object.assign({}, n.doc, { id: n.doc._id })),
        deleted: e.filter((n) => n.deleted).map((n) => n.id),
        synced_at: t.last_seq || m || ""
      };
    });
  };
  function h(m, _, i) {
    const r = Object.assign({ _id: _.id }, _);
    return r._id || delete r._id, window.fetch(X(m.url, m.db), {
      method: "POST",
      headers: f(m, i),
      credentials: m.credentials,
      body: JSON.stringify(r)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = w(t), n = e.content;
      return { record: Object.assign({}, r, { id: n.id, _id: n.id, _rev: n.rev }), message: e.message };
    });
  }
  b.prototype.create = function(m, _) {
    return h(this, m, _).then((i) => i.record);
  };
  function s(m, _, i, r) {
    const t = Object.assign({ id: String(_), _id: String(_) }, i), e = t._rev || t.rev;
    return (e ? Promise.resolve(e) : window.fetch(X(m.url, m.db, null, _), { method: "GET", headers: gt(m.headers, m.auth), credentials: m.credentials }).then((d) => {
      if (!d.ok) throw new Error("Could not retrieve document for revision mapping");
      return d.json().then((g) => g._rev);
    })).then((d) => {
      const g = Object.assign({}, t, { _rev: d });
      delete g.rev;
      const E = f(m, r, { "If-Match": d });
      return window.fetch(X(m.url, m.db, null, _), {
        method: "PUT",
        headers: E,
        credentials: m.credentials,
        body: JSON.stringify(g)
      }).then((v) => {
        if (v.ok) return v.json().then((A) => {
          const S = w(A);
          return { record: Object.assign({}, g, { _rev: S.content.rev }), message: S.message };
        });
        if (v.status === 409) return v.json().then((A) => {
          const S = new Error("Conflict");
          throw S.status = 409, S.data = A, S;
        });
        throw new Error("HTTP " + v.status + ": " + v.statusText);
      });
    });
  }
  b.prototype.update = function(m, _, i) {
    return s(this, m, _, i).then((r) => r.record);
  };
  function l(m, _, i, r) {
    return (i ? Promise.resolve(i) : window.fetch(X(m.url, m.db, null, _), { method: "GET", headers: gt(m.headers, m.auth), credentials: m.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((n) => n._rev);
    })).then((e) => {
      const n = X(m.url, m.db, null, _) + "?rev=" + encodeURIComponent(e);
      return window.fetch(n, { method: "DELETE", headers: f(m, r), credentials: m.credentials }).then((d) => {
        if (!d.ok) throw new Error("HTTP " + d.status + ": " + d.statusText);
        return d.json();
      }).then((d) => {
        const g = w(d);
        return { response: g.content, message: g.message };
      });
    });
  }
  b.prototype.delete = function(m, _, i) {
    return l(this, m, _, i).then((r) => r.response);
  };
  function o(m, _, i) {
    return !_ || _.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(X(m.url, m.db, "_all_docs"), {
      method: "POST",
      headers: gt(m.headers, m.auth),
      credentials: m.credentials,
      body: JSON.stringify({ keys: _ })
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const e = (r.rows || []).filter((n) => !n.error && n.value && n.value.rev).map((n) => ({ _id: n.id, _rev: n.value.rev, _deleted: !0 }));
      return e.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(X(m.url, m.db, "_bulk_docs"), {
        method: "POST",
        headers: f(m, i),
        credentials: m.credentials,
        body: JSON.stringify({ docs: e })
      }).then((n) => {
        if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
        return n.json();
      }).then((n) => {
        const d = w(n);
        return { response: { ok: !0, results: d.content, deletedCount: e.length }, message: d.message };
      });
    });
  }
  b.prototype.bulkDelete = function(m, _) {
    return o(this, m, _).then((i) => i.response);
  };
  function u(m) {
    m._handlers = {
      sync: function(i) {
        const r = i.detail || {};
        m.fetchDelta(r.since).then(function(t) {
          L(m.dom, "ln-couchdb-connector:fetched", { data: t, since: r.since, meta: r.meta || null });
        }).catch(function(t) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      create: function(i) {
        const r = i.detail || {};
        h(m, r.data, r.idempotencyKey).then(function(t) {
          L(m.dom, "ln-couchdb-connector:created", { record: t.record, tempId: r.tempId, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(i) {
        const r = i.detail || {}, t = Object.assign({}, r.data);
        r.expected_version !== void 0 && (t._rev = r.expected_version), s(m, r.id, t, r.idempotencyKey).then(function(e) {
          L(m.dom, "ln-couchdb-connector:updated", { record: e.record, id: r.id, message: e.message, meta: r.meta || null });
        }).catch(function(e) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: e.message,
            status: e.status || 0,
            id: r.id,
            data: e.status === 409 ? e.data : null,
            conflictData: e.status === 409 ? e.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(i) {
        const r = i.detail || {};
        l(m, r.id, r.rev, r.idempotencyKey).then(function(t) {
          L(m.dom, "ln-couchdb-connector:deleted", { response: t.response, id: r.id, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(i) {
        const r = i.detail || {};
        o(m, r.ids, r.idempotencyKey).then(function(t) {
          L(m.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: r.ids, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          L(m.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      m.dom.addEventListener(i + ":request-sync", m._handlers.sync), m.dom.addEventListener(i + ":request-fetch", m._handlers.sync), m.dom.addEventListener(i + ":request-create", m._handlers.create), m.dom.addEventListener(i + ":request-update", m._handlers.update), m.dom.addEventListener(i + ":request-delete", m._handlers.delete), m.dom.addEventListener(i + ":request-bulk-delete", m._handlers.bulkDelete);
    });
  }
  b.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const m = this;
    m._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      m.dom.removeEventListener(i + ":request-sync", m._handlers.sync), m.dom.removeEventListener(i + ":request-fetch", m._handlers.sync), m.dom.removeEventListener(i + ":request-create", m._handlers.create), m.dom.removeEventListener(i + ":request-update", m._handlers.update), m.dom.removeEventListener(i + ":request-delete", m._handlers.delete), m.dom.removeEventListener(i + ":request-bulk-delete", m._handlers.bulkDelete);
    }), m._handlers = null), L(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[y];
  };
  function p(m) {
    const _ = m[a];
    _ && _.refreshConfig();
  }
  B(c, a, b, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: p
  });
})();
function on(c) {
  return c = c || {}, {
    sort: c.sort,
    filters: c.filters,
    search: c.search,
    offset: c.offset,
    limit: c.limit,
    queryGen: c.queryGen
  };
}
function Nt(c, a) {
  const y = !c || !!c.initializationError;
  return a && (y || !c.isLoaded) ? "remote" : c && !c.initializationError ? "store" : "none";
}
function oe(c, a) {
  const y = Object.assign({}, c);
  return a && (y.filters = a.filters, y.search = a.search, y.sort = a.sort), y;
}
class sn {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(a) {
    return new Promise((y, w) => {
      this._pending.set(a, { resolve: y, reject: w });
    });
  }
  resolve(a) {
    return this._settle(a, !1);
  }
  reject(a) {
    return this._settle(a, !0);
  }
  close(a) {
    const y = a || new Error("Mutation receipt registry closed");
    for (const w of this._pending.values()) w.reject(y);
    this._pending.clear();
  }
  _settle(a, y) {
    const w = a && a.requestId;
    if (!w) return !1;
    const b = this._pending.get(w);
    return b ? (this._pending.delete(w), y ? b.reject(a.error || new Error("Store mutation failed")) : b.resolve(a), !0) : !1;
  }
}
(function() {
  const c = "data-ln-data-coordinator", a = "lnDataCoordinator", y = "lnCoordinator", w = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  const b = /* @__PURE__ */ new Set();
  let f = !1, h = null, s = null, l = null;
  function o() {
    f || (f = !0, h = function() {
      L(document, "ln-data-store:online", {}), b.forEach(function(t) {
        t._maybeSync();
      });
    }, s = function() {
      L(document, "ln-data-store:offline", {});
    }, l = function() {
      document.visibilityState === "visible" && b.forEach(function(t) {
        const e = t.findChildren(), n = e.store;
        n && e.connector && n.isInitialized && !n.initializationError && !n.isSyncing && !t._noAutosync && (!n.hasCache || t._isStale()) && n.forceSync();
      });
    }, window.addEventListener("online", h), window.addEventListener("offline", s), document.addEventListener("visibilitychange", l));
  }
  function u() {
    f && (b.size > 0 || (window.removeEventListener("online", h), window.removeEventListener("offline", s), document.removeEventListener("visibilitychange", l), h = null, s = null, l = null, f = !1));
  }
  function p() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
        const n = Math.random() * 16 | 0;
        return (e === "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
  const m = ["ln-api-connector", "ln-couchdb-connector"];
  function _(t) {
    return this.dom = t, this._name = t.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", t), t[a] = this, t[y] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new sn(), this._dict = xt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), i(this), b.add(this), o(), this._checkInitialSync(), this;
  }
  _.prototype._parseStaleAttributes = function() {
    const e = this.findChildren().storeEl, n = this.dom.getAttribute("data-ln-data-coordinator-stale") || (e ? e.getAttribute("data-ln-data-store-stale") : null), d = parseInt(n, 10);
    this._staleThreshold = n === "never" || n === "-1" ? -1 : isNaN(d) ? 300 : d;
    const g = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (e ? e.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!g;
  }, _.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const e = this.findChildren().store;
    return !e || !e.lastSyncedAt ? !0 : Date.now() / 1e3 - e.lastSyncedAt > this._staleThreshold;
  }, _.prototype._maybeSync = function() {
    const t = this.findChildren(), e = t.store;
    !e || e.initializationError || !t.connector || this._noAutosync || !e.isInitialized || e.isSyncing || (!e.hasCache || this._isStale()) && e.forceSync();
  }, _.prototype._checkInitialSync = function() {
    const t = this, n = this.findChildren().store;
    n && Promise.resolve(n.ready).then(function() {
      const d = t.findChildren(), g = d.store;
      if (g && g.initializationError) {
        t._reportReconciliationError("store-initialize", g.initializationError, null);
        return;
      }
      !g || !d.connector || t._noAutosync || g.isSyncing || (!g.hasCache || t._isStale()) && g.forceSync();
    }).catch(function(d) {
      t._reportReconciliationError("store-initialize", d, null);
    });
  }, _.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const e = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    e && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(e)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(n) {
      return n;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(n) {
      return n;
    });
  }, _.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), e = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), n = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: e,
      queueEl: n,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: e ? e.lnConnector || e.lnApiConnector || e.lnCouchDbConnector : null,
      queue: n ? n.lnApiQueue : null
    };
  }, _.prototype._handleSubmitRecord = function(t) {
    const e = this.findChildren();
    if (!e.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const n = t.data || {}, d = n.id, g = n.expected_version, E = Object.assign({}, n);
    delete E.id, delete E.expected_version;
    const v = t.method.toUpperCase();
    v === "POST" ? this._fanOutCreate(e, E, t.action) : (v === "PUT" || v === "PATCH") && this._fanOutUpdate(e, d, E, g, t.action);
  }, _.prototype._fanOutCreate = function(t, e, n) {
    this.refreshMapper();
    const d = "_temp_" + p();
    L(t.storeEl, "ln-data-store:request-create", { tempId: d, data: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: d,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(e),
      expectedVersion: null,
      meta: { tempId: d, action: n }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(e),
      url: n,
      meta: { entryId: p(), queued: !1, op: "create", tempId: d }
    });
  }, _.prototype._fanOutUpdate = function(t, e, n, d, g) {
    this.refreshMapper(), L(t.storeEl, "ln-data-store:request-update", { id: e, data: n }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "update",
      targetId: e,
      payload: this.mapper.egress(n),
      expectedVersion: d,
      meta: { id: e, action: g }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-update", {
      id: e,
      data: this.mapper.egress(n),
      expected_version: d,
      url: g,
      meta: { entryId: p(), queued: !1, op: "update", id: e }
    });
  }, _.prototype._fanOutDelete = function(t, e) {
    this.refreshMapper(), L(t.storeEl, "ln-data-store:request-delete", { id: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "delete",
      targetId: e,
      payload: null,
      expectedVersion: null,
      meta: { id: e }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-delete", {
      id: e,
      meta: { entryId: p(), queued: !1, op: "delete", id: e }
    });
  }, _.prototype._fanOutBulkDelete = function(t, e) {
    this.refreshMapper();
    const n = e.join(",");
    L(t.storeEl, "ln-data-store:request-bulk-delete", { ids: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: n,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: e },
      expectedVersion: null,
      meta: { bulkKey: n, ids: e }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: e,
      meta: { entryId: p(), queued: !1, op: "bulk-delete", bulkKey: n }
    });
  }, _.prototype._toastFromMessage = function(t) {
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: t.type || "success",
        title: t.title || "",
        message: t.body || ""
      }
    }));
  }, _.prototype._toastFromDict = function(t) {
    const e = this._dict[t];
    e && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: e }
    }));
  }, _.prototype._requestStoreMutation = function(t, e, n) {
    const d = t.storeEl;
    if (!d) return Promise.reject(new Error("Store element not found"));
    const g = p(), E = this._mutationReceipts.wait(g);
    return L(d, "ln-data-store:request-" + e, Object.assign({}, n, { requestId: g })), E;
  }, _.prototype._reportReconciliationError = function(t, e, n) {
    L(this.dom, "ln-data-coordinator:error", {
      operation: t,
      error: e,
      meta: n || null
    });
  };
  function i(t) {
    t._handlers = {
      sync: function(e) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        L(n.connectorEl, "ln-api-connector:request-sync", { since: e.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(e) {
        const n = t.findChildren();
        if (!n.connectorEl) return;
        const d = e.detail || {};
        L(n.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, d.query, {
            offset: d.offset,
            limit: d.limit,
            queryGen: d.queryGen
          })
        });
      },
      reqCreate: function(e) {
        const n = t.findChildren();
        n.storeEl && t._fanOutCreate(n, e.detail.data || {}, e.detail.action);
      },
      reqUpdate: function(e) {
        const n = t.findChildren();
        n.storeEl && t._fanOutUpdate(n, e.detail.id, e.detail.data || {}, e.detail.expected_version, e.detail.action);
      },
      reqDelete: function(e) {
        const n = t.findChildren();
        n.storeEl && t._fanOutDelete(n, e.detail.id);
      },
      reqBulkDelete: function(e) {
        const n = t.findChildren();
        n.storeEl && t._fanOutBulkDelete(n, e.detail.ids || []);
      },
      queueFailed: function() {
        t._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(e) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector || !n.queue) return;
        const d = e.detail || {}, g = d.entryId, E = d.op, v = d.targetId, A = d.payload, S = d.expectedVersion, q = d.meta || {}, T = q.action || null, x = d.idempotencyKey || g;
        E === "create" ? L(n.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: T,
          idempotencyKey: x,
          meta: { entryId: g, queued: !0, op: "create", tempId: q.tempId }
        }) : E === "update" ? L(n.connectorEl, "ln-api-connector:request-update", {
          id: v,
          data: A,
          expected_version: S,
          url: T,
          idempotencyKey: x,
          meta: { entryId: g, queued: !0, op: "update", id: v }
        }) : E === "delete" ? L(n.connectorEl, "ln-api-connector:request-delete", {
          id: v,
          idempotencyKey: x,
          meta: { entryId: g, queued: !0, op: "delete", id: v }
        }) : E === "bulk-delete" ? L(n.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          idempotencyKey: x,
          meta: { entryId: g, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", E);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(e) {
        const n = e.target;
        if (e.defaultPrevented) return;
        const d = n.hasAttribute(w) ? n.getAttribute(w) : null;
        if (d === null) return;
        let g;
        if (d ? g = d === t._name : g = n.closest("[data-ln-data-coordinator]") === t.dom, !g) return;
        const E = Be(n);
        if (E !== "POST" && E !== "PUT" && E !== "PATCH") return;
        e.preventDefault();
        const v = ce(n);
        delete v._method, delete v._token, t._handleSubmitRecord({ data: v, method: E, action: n.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(e) {
        const n = e.detail.meta || {}, d = t.findChildren();
        t.refreshMapper();
        const g = e.detail.data;
        let E = [], v = [], A = null;
        Array.isArray(g) ? (E = g, A = Math.floor(Date.now() / 1e3)) : g && (E = Array.isArray(g.data) ? g.data : [], v = Array.isArray(g.deleted) ? g.deleted : [], A = g.synced_at !== void 0 ? g.synced_at : g.since !== void 0 ? g.since : null);
        const S = E.map((q) => t.mapper.ingress(q));
        if (d.store && !d.store.initializationError)
          n.kind ? n.kind === "table" || n.kind === "list" || n.kind === "chart" ? d.store.applyQuery(S, { total: e.detail.total }).then(function(q) {
            L(n.targetEl, "ln-" + n.kind + ":set-loading", { loading: !1 }), L(n.targetEl, "ln-" + n.kind + ":set-data", {
              data: q,
              total: e.detail.total !== void 0 ? e.detail.total : q.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : q.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(n.targetEl, !0);
          }) : n.kind === "options" ? d.store.applyQuery(S, { total: e.detail.total }).then(function() {
            return d.store.getAll({});
          }).then(function(q) {
            L(n.targetEl, "ln-options:set-data", { data: q.data });
          }) : n.kind === "stat" && d.store.applyQuery(S, { total: e.detail.total }).then(function() {
            const q = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : S.length;
            L(n.targetEl, "ln-stat:set-count", { count: q });
          }) : d.store.applySync(S, v, A || Math.floor(Date.now() / 1e3), {
            total: e.detail.total,
            filtered: e.detail.filtered,
            offset: e.detail.offset,
            queryGen: e.detail.queryGen,
            targetEl: n.targetEl
          });
        else if (n.targetEl && n.kind) {
          if (n.kind === "table" || n.kind === "list" || n.kind === "chart")
            L(n.targetEl, "ln-" + n.kind + ":set-loading", { loading: !1 }), L(n.targetEl, "ln-" + n.kind + ":set-data", {
              data: S,
              total: e.detail.total !== void 0 ? e.detail.total : S.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : S.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(n.targetEl, !0);
          else if (n.kind === "options")
            L(n.targetEl, "ln-options:set-data", { data: S });
          else if (n.kind === "stat") {
            const q = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : S.length;
            L(n.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const d = e.detail.meta || {}, g = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: d.tempId, data: g }).then(function() {
          t._toastFromMessage(e.detail.message), d.queued && n.queue && L(n.queueEl, "ln-api-queue:resolve-create", {
            entryId: d.entryId,
            oldKey: d.tempId,
            newId: g.id
          });
        }).catch(function(E) {
          t._reportReconciliationError("create-reconcile", E, d);
        });
      },
      connUpdated: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const d = e.detail.meta || {}, g = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: d.id, data: g }).then(function() {
          t._toastFromMessage(e.detail.message), d.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: d.entryId });
        }).catch(function(E) {
          t._reportReconciliationError("update-reconcile", E, d);
        });
      },
      connDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const d = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), d.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: d.entryId });
      },
      connBulkDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const d = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), d.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: d.entryId });
      },
      connError: function(e) {
        const n = e.detail || {}, d = n.meta || {}, g = d.op || n.action, E = n.status || 0, v = t.findChildren();
        if (g === "sync") {
          v.storeEl && L(v.storeEl, "ln-data-store:request-sync-failed", {
            error: n.error,
            status: E
          }), console.error("[ln-data-coordinator] Sync failed:", n.error);
          return;
        }
        if (g === "query") {
          d.targetEl && d.kind && (L(d.targetEl, "ln-" + d.kind + ":set-loading", { loading: !1 }), (d.kind === "table" || d.kind === "list") && L(d.targetEl, "ln-" + d.kind + ":page-failed", { offset: d.offset })), t._reportReconciliationError("query", n.error || n, d);
          return;
        }
        if (!v.storeEl) return;
        const A = E === 401 || E === 419, S = E === 0 || E >= 500, q = E === 409 || E === 412;
        if (A) {
          t._toastFromDict("auth"), d.queued && v.queue && L(v.queueEl, "ln-api-queue:nack", { entryId: d.entryId, reason: "auth" });
          return;
        }
        if (S) {
          d.queued && v.queue ? L(v.queueEl, "ln-api-queue:nack", { entryId: d.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let T = Promise.resolve();
        if (q && g === "update") {
          const x = n.data && n.data.remote ? t.mapper.ingress(n.data.remote) : null;
          x && (T = t._requestStoreMutation(v, "update", { id: d.id, data: x })), t._toastFromDict("conflict");
        } else g === "create" && (T = t._requestStoreMutation(v, "delete", { id: d.tempId })), t._toastFromDict("rejected");
        d.queued && v.queue ? T.then(function() {
          L(v.queueEl, "ln-api-queue:nack", { entryId: d.entryId, reason: "drop" });
        }).catch(function(x) {
          t._reportReconciliationError("deterministic-reconcile", x, d);
        }) : T.catch(function(x) {
          t._reportReconciliationError("deterministic-reconcile", x, d);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(e) {
        const n = t.findChildren(), d = n.store;
        if (!d || d.initializationError || !n.connector || t._noAutosync || d.isSyncing) return;
        (e.detail || {}).hasCache ? t._isStale() && d.forceSync() : d.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(e) {
        t._serveData(e, "table");
      },
      reqListData: function(e) {
        t._serveData(e, "list");
      },
      reqChartData: function(e) {
        t._serveData(e, "chart");
      },
      reqOptions: function(e) {
        t._serveOptions(e);
      },
      reqStat: function(e) {
        t._serveStat(e);
      },
      refreshQuery: function() {
        t._refreshAll(null, !0);
      },
      refresh: function(e) {
        t._mutationReceipts.resolve(e.detail), t._refreshAll(null, !1);
      },
      mutationError: function(e) {
        t._mutationReceipts.reject(e.detail);
      },
      refreshSynced: function(e) {
        e.detail && e.detail.changed && t._refreshAll(e.detail.meta, !1);
      }
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), m.forEach(function(e) {
      t.dom.addEventListener(e + ":fetched", t._handlers.connFetched), t.dom.addEventListener(e + ":created", t._handlers.connCreated), t.dom.addEventListener(e + ":updated", t._handlers.connUpdated), t.dom.addEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(e + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-chart:request-data", t._handlers.reqChartData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.addEventListener("ln-data-store:query-changed", t._handlers.refreshQuery);
  }
  _.prototype._ownsStore = function(t) {
    const e = this.findChildren();
    return !!(e.store && e.store._name === t && t);
  }, _.prototype._serveData = function(t, e) {
    const n = t.target, d = e === "table" ? "data-ln-table-source" : e === "list" ? "data-ln-list-source" : "data-ln-chart-source", g = n.getAttribute(d);
    if (!g || !this._ownsStore(g)) return;
    const E = t.detail || {}, v = on(E);
    this._boundQueries.set(n, v);
    const A = this.findChildren(), S = this, q = A.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const x = Nt(q, A.connector), k = oe(v, q && q.query);
      if (x === "remote") {
        L(n, "ln-" + e + ":set-loading", { loading: !0 }), L(A.connectorEl, "ln-api-connector:request-query", {
          query: k,
          meta: { targetEl: n, kind: e, offset: k.offset, limit: k.limit }
        });
        return;
      }
      if (x !== "store") {
        L(n, "ln-" + e + ":set-loading", { loading: !1 });
        return;
      }
      return q.getAll(k).then(function(R) {
        const N = {
          data: R.data,
          total: R.total,
          filtered: R.filtered,
          offset: E.offset !== void 0 ? E.offset : R.offset,
          queryGen: E.queryGen !== void 0 ? E.queryGen : R.queryGen
        };
        L(n, "ln-" + e + ":set-data", N), S._boundDelivered.set(n, !0);
      });
    }).catch(function(x) {
      L(n, "ln-" + e + ":set-loading", { loading: !1 }), L(S.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: e,
        store: g,
        target: n,
        error: x
      });
    });
  }, _.prototype._serveOptions = function(t) {
    const e = t.target, n = e.getAttribute("data-ln-options");
    if (!this._ownsStore(n)) return;
    const d = this.findChildren(), g = d.store, E = g && g.ready ? g.ready : Promise.resolve(), v = this;
    return E.then(function() {
      const A = Nt(g, d.connector);
      if (A === "remote") {
        L(d.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: e, kind: "options" }
        });
        return;
      }
      if (A === "store")
        return g.getAll({}).then(function(S) {
          L(e, "ln-options:set-data", { data: S.data });
        });
    }).catch(function(A) {
      v._reportReconciliationError("options-query", A, { targetEl: e, kind: "options" });
    });
  }, _.prototype._serveStat = function(t) {
    const e = t.target, n = e.getAttribute("data-ln-stat");
    if (!this._ownsStore(n)) return;
    const d = t.detail && t.detail.filters ? t.detail.filters : null, g = this.findChildren(), E = g.store, v = E && E.ready ? E.ready : Promise.resolve(), A = this;
    return v.then(function() {
      const S = Nt(E, g.connector);
      if (S === "remote") {
        L(g.connectorEl, "ln-api-connector:request-query", {
          query: { filters: d },
          meta: { targetEl: e, kind: "stat" }
        });
        return;
      }
      if (S === "store")
        return E.count(d).then(function(q) {
          L(e, "ln-stat:set-count", { count: q });
        });
    }).catch(function(S) {
      A._reportReconciliationError("stat-query", S, { targetEl: e, kind: "stat" });
    });
  }, _.prototype._refreshAll = function(t, e) {
    const n = this, d = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let g = 0; g < d.length; g++) {
      const E = d[g];
      let v, A;
      if (E.hasAttribute("data-ln-table-source") ? (v = E.getAttribute("data-ln-table-source"), A = "table") : E.hasAttribute("data-ln-list-source") ? (v = E.getAttribute("data-ln-list-source"), A = "list") : E.hasAttribute("data-ln-chart-source") ? (v = E.getAttribute("data-ln-chart-source"), A = "chart") : E.hasAttribute("data-ln-options") ? (v = E.getAttribute("data-ln-options"), A = "options") : E.hasAttribute("data-ln-stat") && (v = E.getAttribute("data-ln-stat"), A = "stat"), !this._ownsStore(v)) continue;
      const S = this.findChildren().store;
      if (A === "table" || A === "list") {
        const q = A === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (E.hasAttribute(q)) {
          L(E, "ln-" + A + (e ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (A === "table" || A === "list" || A === "chart") {
        const q = n._boundQueries.get(E) || { sort: null, filters: {}, search: "" };
        (function(T, x) {
          S.getAll(oe(q, S.query)).then(function(k) {
            const R = {
              data: k.data,
              total: t && t.total !== void 0 ? t.total : k.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : k.filtered,
              offset: k.offset !== void 0 ? k.offset : t && t.offset !== void 0 ? t.offset : q.offset,
              queryGen: k.queryGen !== void 0 ? k.queryGen : t && t.queryGen !== void 0 ? t.queryGen : q.queryGen
            };
            L(T, "ln-" + x + ":set-loading", { loading: !1 }), L(T, "ln-" + x + ":set-data", R), n._boundDelivered.set(T, !0);
          });
        })(E, A);
      } else if (A === "options")
        (function(q) {
          S.getAll({}).then(function(T) {
            L(q, "ln-options:set-data", { data: T.data });
          });
        })(E);
      else if (A === "stat") {
        const q = E.getAttribute("data-ln-stat-filter");
        let T = null;
        if (q) {
          const x = q.indexOf(":");
          if (x !== -1) {
            const k = q.slice(0, x), R = q.slice(x + 1);
            T = {}, T[k] = [R];
          }
        }
        (function(x, k) {
          S.count(k).then(function(R) {
            L(x, "ln-stat:set-count", { count: R });
          });
        })(E, T);
      }
    }
  }, _.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), m.forEach(function(e) {
      t.dom.removeEventListener(e + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(e + ":created", t._handlers.connCreated), t.dom.removeEventListener(e + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(e + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-chart:request-data", t._handlers.reqChartData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.removeEventListener("ln-data-store:query-changed", t._handlers.refreshQuery), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, b.delete(this), u(), delete this.dom[a], delete this.dom[y];
  };
  function r(t, e) {
    const n = t[a];
    n && e === "data-ln-data-mapper" && n.refreshMapper();
  }
  B(c, a, _, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: r
  });
})();
const an = "ln_api_queue", ln = 2, $ = "outbox", Z = "_queue_meta";
function et(c, a) {
  return c.error || new Error(a);
}
function pt(c, a) {
  return c.bound([a, -1 / 0], [a, 1 / 0]);
}
function se(c) {
  return "seq:" + c;
}
function St(c) {
  return "paused:" + c;
}
function ae(c) {
  c.leaseOwner = null, c.leaseUntil = 0;
}
function cn(c, a, y) {
  return typeof c != "string" || c.indexOf(a) === -1 ? c : c.split(a).join(y);
}
function dn(c, a, y, w) {
  const b = /* @__PURE__ */ new Map(), f = [], h = [];
  for (const s of c || [])
    b.has(s.chainKey) || b.set(s.chainKey, []), b.get(s.chainKey).push(s);
  return b.forEach((s, l) => {
    s.sort((u, p) => u.seq - p.seq);
    const o = s[0];
    if (!(!o || o.status === "failed")) {
      if (o.status === "inflight" && (o.leaseUntil || 0) > w) {
        h.push({ chainKey: l, at: o.leaseUntil });
        return;
      }
      if ((o.nextAttemptAt || 0) > w) {
        h.push({ chainKey: l, at: o.nextAttemptAt });
        return;
      }
      o.status = "inflight", o.leaseOwner = a, o.leaseUntil = w + y, o.updatedAt = w, f.push(o);
    }
  }), { entries: f, wakeups: h };
}
function un(c, a, y, w, b) {
  const f = [], h = [];
  for (const s of c || []) {
    if (s.entryId === a) {
      h.push(s.entryId);
      continue;
    }
    s.chainKey === y && (s.chainKey = w, s.targetId === y && (s.targetId = w), s.meta && s.meta.id === y && (s.meta.id = w), s.meta && typeof s.meta.action == "string" && (s.meta.action = cn(s.meta.action, y, w)), s.updatedAt = b, f.push(s));
  }
  return { changed: f, deleted: h };
}
class hn {
  constructor(a) {
    a = a || {}, this.indexedDB = a.indexedDB || globalThis.indexedDB, this.keyRange = a.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = a.dbName || an, this.now = a.now || (() => Date.now()), this.uuid = a.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((a, y) => {
      const w = this.indexedDB.open(this.dbName, ln);
      w.onupgradeneeded = (b) => {
        const f = b.target.result;
        let h;
        f.objectStoreNames.contains($) ? h = b.target.transaction.objectStore($) : h = f.createObjectStore($, { keyPath: "entryId" }), h.indexNames.contains("by_scope_chain") || h.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), h.indexNames.contains("by_scope_seq") || h.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), f.objectStoreNames.contains(Z) || f.createObjectStore(Z, { keyPath: "key" });
      }, w.onerror = () => y(et(w, "Queue database open failed")), w.onsuccess = (b) => {
        this._db = b.target.result, this._db.onversionchange = () => this.close(), a(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((a, y) => {
      const w = this.indexedDB.deleteDatabase(this.dbName);
      w.onsuccess = () => a(), w.onerror = () => y(et(w, "Queue database delete failed")), w.onblocked = () => y(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(a) {
    return this.open().then((y) => y ? new Promise((w, b) => {
      const h = y.transaction($, "readonly").objectStore($).index("by_scope_seq").getAll(pt(this.keyRange, a));
      h.onsuccess = () => w(h.result || []), h.onerror = () => b(et(h, "Queue scope read failed"));
    }) : []);
  }
  enqueue(a, y) {
    return y = y || {}, this.open().then((w) => w ? new Promise((b, f) => {
      const h = w.transaction([Z, $], "readwrite"), s = h.objectStore(Z), l = h.objectStore($), o = se(a);
      let u = null;
      const p = (_) => {
        const i = _ + 1;
        u = {
          entryId: this.uuid(),
          scope: a,
          chainKey: y.chainKey,
          seq: i,
          op: y.op,
          targetId: y.targetId !== void 0 ? y.targetId : null,
          payload: y.payload,
          expectedVersion: y.expectedVersion !== void 0 ? y.expectedVersion : null,
          meta: y.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, s.put({ key: o, value: i }), l.put(u);
      }, m = s.get(o);
      m.onerror = () => f(et(m, "Queue sequence read failed")), m.onsuccess = () => {
        const _ = m.result;
        if (_ && typeof _.value == "number") {
          p(_.value);
          return;
        }
        const i = l.index("by_scope_seq").getAll(pt(this.keyRange, a));
        i.onerror = () => f(et(i, "Queue sequence migration failed")), i.onsuccess = () => {
          const r = (i.result || []).reduce((t, e) => Math.max(t, e.seq || 0), 0);
          p(r);
        };
      }, h.oncomplete = () => b(u), h.onerror = () => f(h.error || new Error("Queue enqueue transaction failed")), h.onabort = () => f(h.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(a, y, w) {
    return this.open().then((b) => b ? new Promise((f, h) => {
      const s = b.transaction($, "readwrite"), l = s.objectStore($), o = l.index("by_scope_seq").getAll(pt(this.keyRange, a)), u = this.now();
      let p = { entries: [], wakeups: [] };
      o.onerror = () => h(et(o, "Queue claim read failed")), o.onsuccess = () => {
        p = dn(o.result || [], y, w, u);
        for (const m of p.entries) l.put(m);
      }, s.oncomplete = () => f(p), s.onerror = () => h(s.error || new Error("Queue claim transaction failed")), s.onabort = () => h(s.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(a, y) {
    return this._updateEntry(a, y, (w, b) => (b.delete(w.entryId), { status: "acked", entry: w }));
  }
  nack(a, y, w, b) {
    b = b || {};
    const f = b.maxAttempts || 8, h = b.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((s) => s ? new Promise((l, o) => {
      const u = s.transaction([$, Z], "readwrite"), p = u.objectStore($), m = u.objectStore(Z), _ = p.get(y);
      let i = null;
      _.onerror = () => o(et(_, "Queue nack read failed")), _.onsuccess = () => {
        const r = _.result;
        if (!(!r || r.scope !== a)) {
          if (w === "drop") {
            p.delete(r.entryId), i = { status: "dropped", entry: r };
            return;
          }
          if (ae(r), r.updatedAt = this.now(), w === "auth") {
            r.status = "pending", p.put(r), m.put({ key: St(a), value: !0 }), i = { status: "auth", entry: r };
            return;
          }
          if (w === "retry") {
            if (r.attempts = (r.attempts || 0) + 1, r.attempts >= f) {
              r.status = "failed", r.nextAttemptAt = 0, p.put(r), i = { status: "failed", entry: r };
              return;
            }
            const t = h[Math.min(r.attempts - 1, h.length - 1)];
            r.status = "pending", r.nextAttemptAt = this.now() + t, p.put(r), i = { status: "retry", entry: r, delay: t };
          }
        }
      }, u.oncomplete = () => l(i), u.onerror = () => o(u.error || new Error("Queue nack transaction failed")), u.onabort = () => o(u.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(a, y, w) {
    return this._remapTransaction(a, null, y, w);
  }
  resolveCreate(a, y, w, b) {
    return this._remapTransaction(a, y, w, b);
  }
  _remapTransaction(a, y, w, b) {
    return this.open().then((f) => f ? new Promise((h, s) => {
      const l = f.transaction($, "readwrite"), o = l.objectStore($), u = o.index("by_scope_seq").getAll(pt(this.keyRange, a));
      let p = { changed: [], deleted: [] };
      u.onerror = () => s(et(u, "Queue remap read failed")), u.onsuccess = () => {
        p = un(u.result || [], y, w, b, this.now());
        for (const m of p.deleted) o.delete(m);
        for (const m of p.changed) o.put(m);
      }, l.oncomplete = () => h(p.changed), l.onerror = () => s(l.error || new Error("Queue remap transaction failed")), l.onabort = () => s(l.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(a) {
    return this.open().then((y) => y ? new Promise((w, b) => {
      const f = y.transaction($, "readwrite"), h = f.objectStore($), s = h.index("by_scope_seq").getAll(pt(this.keyRange, a));
      let l = 0;
      s.onerror = () => b(et(s, "Queue failed-entry read failed")), s.onsuccess = () => {
        for (const o of s.result || [])
          o.status === "failed" && (o.status = "pending", o.attempts = 0, o.nextAttemptAt = 0, o.updatedAt = this.now(), ae(o), h.put(o), l++);
      }, f.oncomplete = () => w(l), f.onerror = () => b(f.error || new Error("Queue failed-entry reset failed")), f.onabort = () => b(f.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(a) {
    return this.open().then((y) => y ? new Promise((w, b) => {
      const h = y.transaction(Z, "readonly").objectStore(Z).get(St(a));
      h.onsuccess = () => w(!!(h.result && h.result.value)), h.onerror = () => b(et(h, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(a, y) {
    return this.open().then((w) => {
      if (w)
        return new Promise((b, f) => {
          const h = w.transaction(Z, "readwrite");
          h.objectStore(Z).put({ key: St(a), value: !!y }), h.oncomplete = () => b(), h.onerror = () => f(h.error || new Error("Queue pause-state write failed")), h.onabort = () => f(h.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(a) {
    return this.open().then((y) => {
      if (y)
        return new Promise((w, b) => {
          const f = y.transaction([$, Z], "readwrite"), s = f.objectStore($).index("by_scope_seq").openCursor(pt(this.keyRange, a));
          s.onsuccess = (l) => {
            const o = l.target.result;
            o && (o.delete(), o.continue());
          }, s.onerror = () => b(et(s, "Queue clear failed")), f.objectStore(Z).delete(se(a)), f.objectStore(Z).delete(St(a)), f.oncomplete = () => w(), f.onerror = () => b(f.error || new Error("Queue clear transaction failed")), f.onabort = () => b(f.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(a, y, w) {
    return this.open().then((b) => b ? new Promise((f, h) => {
      const s = b.transaction($, "readwrite"), l = s.objectStore($), o = l.get(y);
      let u = null;
      o.onerror = () => h(et(o, "Queue entry read failed")), o.onsuccess = () => {
        const p = o.result;
        !p || p.scope !== a || (u = w(p, l));
      }, s.oncomplete = () => f(u), s.onerror = () => h(s.error || new Error("Queue entry transaction failed")), s.onabort = () => h(s.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const c = "data-ln-api-queue", a = "lnApiQueue", y = [2e3, 5e3, 15e3, 6e4, 3e5], w = 8, b = 6e4;
  if (window[a] !== void 0) return;
  function f() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (u) => {
        const p = Math.random() * 16 | 0;
        return (u === "x" ? p : p & 3 | 8).toString(16);
      });
    }
  }
  const h = new hn({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: f
  });
  function s(o) {
    this.dom = o, o[a] = this;
    const u = o.closest("[data-ln-data-coordinator]");
    this.scope = o.id || (u ? u.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = f(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const p = this;
    return h.open().then((m) => m ? h.getPaused(p.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((m) => (p._paused = !!m, p._paused && L(p.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), p._emitPendingCount())).then(() => p._drain()).catch((m) => {
      console.error("[ln-api-queue] Initialization failed:", m), L(p.dom, "ln-api-queue:error", { operation: "initialize", error: m });
    }), this;
  }
  s.prototype._isOnline = function() {
    const o = this.dom.getAttribute("data-ln-api-queue-online");
    return o === "true" ? !0 : o === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const o = this;
    return h.allForScope(o.scope).then((u) => (L(o.dom, "ln-api-queue:pending-count", { count: u.length, scope: o.scope }), u.length === 0 && L(o.dom, "ln-api-queue:drained", { scope: o.scope }), u));
  }, s.prototype._clearTimer = function(o) {
    const u = this._timers.get(o);
    u && (clearTimeout(u), this._timers.delete(o));
  }, s.prototype._scheduleTimer = function(o, u) {
    const p = Math.max(0, u), m = this._timers.get(o);
    m && clearTimeout(m);
    const _ = this, i = setTimeout(() => {
      _._timers.delete(o), _._drain();
    }, p);
    this._timers.set(o, i);
  }, s.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = h.claimReady(o.scope, o._workerId, b).then((u) => {
      for (const p of u.wakeups)
        o._scheduleTimer(p.chainKey, p.at - Date.now());
      for (const p of u.entries)
        o._clearTimer(p.chainKey), L(o.dom, "ln-api-queue:send", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          op: p.op,
          targetId: p.targetId,
          payload: p.payload,
          expectedVersion: p.expectedVersion,
          idempotencyKey: p.entryId,
          meta: p.meta
        });
    }).catch((u) => {
      console.error("[ln-api-queue] Drain failed:", u), L(o.dom, "ln-api-queue:error", { operation: "drain", error: u });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, s.prototype._onEnqueue = function(o) {
    const u = this;
    return h.enqueue(u.scope, o.detail || {}).then((p) => {
      if (p)
        return u._emitPendingCount().then((m) => (L(u.dom, "ln-api-queue:enqueued", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          count: m.length
        }), u._drain()));
    }).catch((p) => {
      L(u.dom, "ln-api-queue:error", { operation: "enqueue", error: p });
    });
  }, s.prototype._onAck = function(o) {
    const u = this, p = o.detail || {};
    return h.ack(u.scope, p.entryId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((m) => {
      L(u.dom, "ln-api-queue:error", { operation: "ack", entryId: p.entryId, error: m });
    });
  }, s.prototype._onNack = function(o) {
    const u = this, p = o.detail || {};
    return h.nack(u.scope, p.entryId, p.reason, {
      maxAttempts: w,
      backoff: y
    }).then((m) => {
      if (m)
        return m.status === "failed" ? L(u.dom, "ln-api-queue:failed", {
          entryId: m.entry.entryId,
          chainKey: m.entry.chainKey,
          attempts: m.entry.attempts
        }) : m.status === "retry" ? u._scheduleTimer(m.entry.chainKey, m.delay) : m.status === "auth" && (u._paused = !0, L(u.dom, "ln-api-queue:paused", { reason: "auth" }), L(u.dom, "ln-api-queue:auth-required", {
          entryId: m.entry.entryId,
          chainKey: m.entry.chainKey
        })), u._emitPendingCount().then(() => {
          if (m.status === "dropped") return u._drain();
        });
    }).catch((m) => {
      L(u.dom, "ln-api-queue:error", { operation: "nack", entryId: p.entryId, error: m });
    });
  }, s.prototype._onRemap = function(o) {
    const u = this, p = o.detail || {};
    return h.remap(u.scope, p.oldKey, p.newId).catch((m) => {
      L(u.dom, "ln-api-queue:error", { operation: "remap", error: m });
    });
  }, s.prototype._onResolveCreate = function(o) {
    const u = this, p = o.detail || {};
    return h.resolveCreate(u.scope, p.entryId, p.oldKey, p.newId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((m) => {
      L(u.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: p.entryId,
        error: m
      });
    });
  }, s.prototype._onResume = function() {
    const o = this;
    return h.setPaused(o.scope, !1).then(() => (o._paused = !1, L(o.dom, "ln-api-queue:resumed", {}), o._drain())).catch((u) => {
      L(o.dom, "ln-api-queue:error", { operation: "resume", error: u });
    });
  }, s.prototype._onDrain = function() {
    const o = this;
    return h.resetFailed(o.scope).then(() => {
      const u = o._drainPromise;
      return u ? u.then(() => o._drain()) : o._drain();
    }).catch((u) => {
      L(o.dom, "ln-api-queue:error", { operation: "manual-drain", error: u });
    });
  }, s.prototype._onClear = function() {
    const o = this;
    return o._timers.forEach((u) => clearTimeout(u)), o._timers.clear(), h.clear(o.scope).then(() => {
      o._paused = !1, L(o.dom, "ln-api-queue:pending-count", { count: 0, scope: o.scope }), L(o.dom, "ln-api-queue:drained", { scope: o.scope });
    }).catch((u) => {
      L(o.dom, "ln-api-queue:error", { operation: "clear", error: u });
    });
  }, s.prototype._bindEvents = function() {
    const o = this;
    o._handlers = {
      enqueue: (u) => o._onEnqueue(u),
      ack: (u) => o._onAck(u),
      nack: (u) => o._onNack(u),
      remap: (u) => o._onRemap(u),
      resolveCreate: (u) => o._onResolveCreate(u),
      resume: () => o._onResume(),
      drain: () => o._onDrain(),
      clear: () => o._onClear()
    }, o.dom.addEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.addEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.addEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.addEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.addEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.addEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.addEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.addEventListener("ln-api-queue:request-clear", o._handlers.clear);
  }, s.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const o = this;
    o.dom.removeEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.removeEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.removeEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.removeEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.removeEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.removeEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.removeEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.removeEventListener("ln-api-queue:request-clear", o._handlers.clear), window.removeEventListener("online", o._onlineHandler), o._timers.forEach((u) => clearTimeout(u)), o._timers.clear(), L(o.dom, "ln-api-queue:destroyed", { scope: o.scope }), delete o.dom[a];
  };
  function l(o) {
    const u = o[a];
    u && u._drain();
  }
  B(c, a, s, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: l
  });
})();
function ke(c) {
  if (c == null || c === "") return null;
  const a = Number(c);
  return Number.isFinite(a) ? a : null;
}
function mt(c) {
  return String(Math.round(c * 1e3) / 1e3);
}
function fn(c, a, y) {
  const w = ke(c);
  return w === null || w < 0 ? 0 : Math.min(w, Math.min(a, y) / 2);
}
function pn(c) {
  if (typeof c != "string") return null;
  const a = c.trim().split(/[\s,]+/).map(Number);
  return a.length !== 4 || a.some((y) => !Number.isFinite(y)) || a[2] <= 0 || a[3] <= 0 ? null : { x: a[0], y: a[1], width: a[2], height: a[3] };
}
function mn(c, a) {
  a = a || {};
  const y = a.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, w = a.xField || "label", b = a.yField || "value", f = a.includeZero !== !1, h = fn(a.padding, y.width, y.height), s = Array.isArray(c) ? c : [], l = [];
  for (let T = 0; T < s.length; T++) {
    const x = s[T] || {}, k = ke(x[b]);
    k !== null && l.push({
      record: x,
      sourceIndex: T,
      label: x[w] == null ? String(T + 1) : String(x[w]),
      value: k
    });
  }
  if (l.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: y.y + y.height - h
    };
  const o = l.map((T) => T.value), u = Math.min(...o), p = Math.max(...o);
  let m = f ? Math.min(0, u) : u, _ = f ? Math.max(0, p) : p;
  if (m === _)
    if (m === 0)
      _ = 1;
    else {
      const T = Math.max(Math.abs(m) * 0.1, 1);
      m -= T, _ += T;
    }
  const i = y.x + h, r = y.y + h, t = Math.max(0, y.width - h * 2), e = Math.max(0, y.height - h * 2), n = l.length > 1 ? t / (l.length - 1) : 0, d = _ - m, g = (T) => r + (_ - T) / d * e, E = l.map((T, x) => ({
    ...T,
    x: l.length === 1 ? i + t / 2 : i + x * n,
    y: g(T.value)
  })), v = m <= 0 && _ >= 0 ? 0 : m, A = g(v), S = E.map((T) => mt(T.x) + "," + mt(T.y)).join(" "), q = [
    mt(E[0].x) + "," + mt(A),
    S,
    mt(E[E.length - 1].x) + "," + mt(A)
  ].join(" ");
  return {
    points: E,
    linePoints: S,
    areaPoints: q,
    count: E.length,
    min: u,
    max: p,
    domainMin: m,
    domainMax: _,
    baselineY: A
  };
}
(function() {
  const c = "data-ln-chart", a = "lnChart", y = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[a] !== void 0) return;
  function w(s) {
    if (!s) return null;
    const l = s.split(":"), o = l[0].trim();
    return o ? {
      field: o,
      direction: l[1] && l[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function b(s, l) {
    if (s == null || !Number.isFinite(s)) return "";
    try {
      return new Intl.NumberFormat(W(l)).format(s);
    } catch {
      return String(s);
    }
  }
  function f(s, l) {
    s && (s.textContent = l);
  }
  function h(s) {
    this.dom = s, this.name = s.getAttribute(c) || "", this.source = s.getAttribute("data-ln-chart-source") || this.name, this.plot = s.querySelector("[data-ln-chart-plot]"), this.line = s.querySelector("[data-ln-chart-line]"), this.area = s.querySelector("[data-ln-chart-area]"), this.labels = s.querySelector("[data-ln-chart-labels]"), this.empty = s.querySelector("[data-ln-chart-empty]"), this.minimum = s.querySelector("[data-ln-chart-min]"), this.maximum = s.querySelector("[data-ln-chart-max]"), this.count = s.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const l = this;
    return this._onSetData = function(o) {
      const u = o.detail || {};
      l._data = Array.isArray(u.data) ? u.data : [], l.isLoaded = !0, l._setLoading(!1), l._render();
    }, this._onSetLoading = function(o) {
      l._setLoading(!!(o.detail && o.detail.loading));
    }, this._onRefresh = function() {
      l.requestData();
    }, s.addEventListener("ln-chart:set-data", this._onSetData), s.addEventListener("ln-chart:set-loading", this._onSetLoading), s.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  h.prototype._readOptions = function() {
    const s = this.dom.getAttribute("data-ln-chart-padding"), l = s === null ? NaN : Number(s), o = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(l) && l >= 0 ? l : 16,
      type: o === "area" || o === "polygon" ? "area" : "line",
      viewBox: this.plot && pn(this.plot.getAttribute("viewBox")) || y
    };
  }, h.prototype._setLoading = function(s) {
    this.dom.classList.toggle("ln-chart--loading", s), this.dom.setAttribute("aria-busy", s ? "true" : "false");
  }, h.prototype._renderLabels = function(s) {
    if (!this.labels || (this.labels.replaceChildren(), s.count === 0)) return;
    const l = this.name + "-label", o = '[data-ln-template="' + l + '"]';
    if (!this.dom.querySelector(o) && !document.querySelector(o)) return;
    const u = ct(this.dom, l, "ln-chart");
    if (u)
      for (const p of s.points) {
        const m = u.cloneNode(!0);
        Et(m, {
          label: p.label,
          value: b(p.value, this.dom)
        }), this.labels.appendChild(m);
      }
  }, h.prototype._render = function() {
    const s = this._readOptions(), l = mn(this._data, s);
    this.model = l, this.line && (this.line.setAttribute("points", l.linePoints), this.line.toggleAttribute("hidden", l.count === 0)), this.area && (this.area.setAttribute("points", l.areaPoints), this.area.toggleAttribute("hidden", l.count === 0 || s.type !== "area"));
    const o = l.count === 0;
    this.dom.classList.toggle("ln-chart--empty", o), this.empty && this.empty.toggleAttribute("hidden", !o), f(this.minimum, b(l.min, this.dom)), f(this.maximum, b(l.max, this.dom)), f(this.count, b(l.count, this.dom)), this._renderLabels(l), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: l.count,
      min: l.min,
      max: l.max
    });
  }, h.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: w(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, h.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[a]);
  }, B(c, a, h, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(s, l) {
      const o = s[a];
      if (o) {
        if (l === "data-ln-chart-source" || l === "data-ln-chart-sort") {
          o.requestData();
          return;
        }
        o._render();
      }
    }
  });
})();
(function() {
  const c = "data-ln-options", a = "lnOptions";
  if (window[a] !== void 0) return;
  function y(w) {
    this.dom = w, this._storeName = w.getAttribute(c), this._valueField = w.getAttribute("data-ln-options-value") || "id", this._labelField = w.getAttribute("data-ln-options-label") || "name";
    const b = this;
    return this._onSetData = function(f) {
      b._rebuild(f.detail.data || []);
    }, w.addEventListener("ln-options:set-data", this._onSetData), L(w, "ln-options:request-data", { options: this._storeName }), this;
  }
  y.prototype._rebuild = function(w) {
    const b = this.dom, f = this._valueField, h = this._labelField, s = b.value, l = b.querySelectorAll("option");
    for (let u = l.length - 1; u >= 0; u--)
      l[u].value !== "" && b.removeChild(l[u]);
    for (let u = 0; u < w.length; u++) {
      const p = w[u], m = document.createElement("option");
      m.value = String(p[f]), m.textContent = p[h] != null ? p[h] : "", b.appendChild(m);
    }
    const o = b.options;
    for (let u = 0; u < o.length; u++)
      if (o[u].value === s) {
        b.value = s;
        break;
      }
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[a]);
  }, B(c, a, y, "ln-options");
})();
(function() {
  const c = "data-ln-stat", a = "lnStat";
  if (window[a] !== void 0) return;
  function y(b) {
    if (!b) return null;
    const f = b.indexOf(":");
    if (f === -1) return null;
    const h = b.slice(0, f), s = b.slice(f + 1), l = {};
    return l[h] = [s], l;
  }
  function w(b) {
    return this.dom = b, this._storeName = b.getAttribute(c), this._filters = y(b.getAttribute("data-ln-stat-filter")), this._onSetCount = function(f) {
      b.textContent = String(f.detail.count), b.classList.remove("is-loading");
    }, b.addEventListener("ln-stat:set-count", this._onSetCount), L(b, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  w.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[a]);
  }, B(c, a, w, "ln-stat");
})();
(function() {
  const c = "ln-icon-sprite", a = "#ln-icon-", y = "#ln-icon-custom-", w = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set();
  let f = null;
  const h = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), l = "lni:", o = "lni:v", u = "1";
  function p() {
    try {
      if (localStorage.getItem(o) !== u) {
        for (let n = localStorage.length - 1; n >= 0; n--) {
          const d = localStorage.key(n);
          d && d.indexOf(l) === 0 && localStorage.removeItem(d);
        }
        localStorage.setItem(o, u);
      }
    } catch {
    }
  }
  p();
  function m() {
    return f || (f = document.getElementById(c), f || (f = document.createElementNS("http://www.w3.org/2000/svg", "svg"), f.id = c, f.setAttribute("hidden", ""), f.setAttribute("aria-hidden", "true"), f.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(f, document.body.firstChild))), f;
  }
  function _(n) {
    return n.indexOf(y) === 0 ? s + "/" + n.slice(y.length) + ".svg" : h + "/" + n.slice(a.length) + ".svg";
  }
  function i(n, d) {
    const g = d.match(/viewBox="([^"]+)"/), E = g ? g[1] : "0 0 24 24", v = d.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = v ? v[1].trim() : "", S = d.match(/<svg([^>]*)>/i), q = S ? S[1] : "", T = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    T.id = n, T.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(x) {
      const k = q.match(new RegExp(x + '="([^"]*)"'));
      k && T.setAttribute(x, k[1]);
    }), T.innerHTML = A, m().querySelector("defs").appendChild(T);
  }
  function r(n) {
    if (w.has(n) || b.has(n)) return;
    if (n.indexOf(y) === 0 && !s) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", n);
      return;
    }
    const d = n.slice(1);
    try {
      const E = localStorage.getItem(l + d);
      if (E) {
        i(d, E), w.add(n);
        return;
      }
    } catch {
    }
    b.add(n);
    const g = _(n);
    fetch(g).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      i(d, E), w.add(n), b.delete(n);
      try {
        localStorage.setItem(l + d, E);
      } catch {
      }
    }).catch(function(E) {
      console.error("[ln-icon] Fetch failed for:", d, E), b.delete(n);
    });
  }
  function t(n) {
    const d = 'use[href^="' + a + '"], use[href^="' + y + '"]', g = n.querySelectorAll ? n.querySelectorAll(d) : [];
    if (n.matches && n.matches(d)) {
      const E = n.getAttribute("href");
      E && r(E);
    }
    Array.prototype.forEach.call(g, function(E) {
      const v = E.getAttribute("href");
      v && r(v);
    });
  }
  function e() {
    t(document), new MutationObserver(function(n) {
      n.forEach(function(d) {
        if (d.type === "childList")
          d.addedNodes.forEach(function(g) {
            g.nodeType === 1 && t(g);
          });
        else if (d.type === "attributes" && d.attributeName === "href") {
          const g = d.target.getAttribute("href");
          g && (g.indexOf(a) === 0 || g.indexOf(y) === 0) && r(g);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
(function() {
  const c = "data-ln-debug", a = "lnDebug";
  if (window[a] !== void 0) return;
  function y(w) {
    return this.dom = w, this;
  }
  y.prototype.destroy = function() {
    delete this.dom[a];
  }, B(c, a, y, "ln-debug");
})();
