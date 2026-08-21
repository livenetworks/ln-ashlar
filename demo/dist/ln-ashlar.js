if (typeof window < "u") {
  const d = console.warn;
  console.warn = function(...a) {
    typeof a[0] == "string" && (a[0].startsWith("[ln-") || a[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || d.apply(console, a);
  };
}
const Ot = {};
function Lt(d, a) {
  Ot[d] || (Ot[d] = document.querySelector('[data-ln-template="' + d + '"]'));
  const y = Ot[d];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + d + '" not found'), null);
}
function L(d, a, y) {
  d.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: y || {}
  }));
}
function Q(d, a, y) {
  const w = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return d.dispatchEvent(w), w;
}
function le(d, a, y) {
  d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter();
  const w = {
    sort: d.currentSort,
    filters: d.currentFilters,
    search: d.currentSearch
  };
  w[y] = d.name, L(d.dom, a, w);
}
function nt(d, a) {
  if (!d || !a) return d;
  const y = d.querySelectorAll("[data-ln-field]");
  for (let h = 0; h < y.length; h++) {
    const o = y[h], c = o.getAttribute("data-ln-field");
    a[c] != null && (o.textContent = a[c]);
  }
  const w = d.querySelectorAll("[data-ln-attr]");
  for (let h = 0; h < w.length; h++) {
    const o = w[h], c = o.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < c.length; s++) {
      const u = c[s].trim().split(":");
      if (u.length !== 2) continue;
      const f = u[0].trim(), p = u[1].trim();
      a[p] != null && o.setAttribute(f, a[p]);
    }
  }
  const b = d.querySelectorAll("[data-ln-show]");
  for (let h = 0; h < b.length; h++) {
    const o = b[h], c = o.getAttribute("data-ln-show");
    c in a && o.classList.toggle("hidden", !a[c]);
  }
  const m = d.querySelectorAll("[data-ln-class]");
  for (let h = 0; h < m.length; h++) {
    const o = m[h], c = o.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < c.length; s++) {
      const u = c[s].trim().split(":");
      if (u.length !== 2) continue;
      const f = u[0].trim(), p = u[1].trim();
      p in a && o.classList.toggle(f, !!a[p]);
    }
  }
  return d;
}
function Pe(d, a) {
  d.matches && d.matches("[data-ln-form], [data-ln-fillable]") && d.dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  const y = d.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let w = 0; w < y.length; w++)
    y[w].dispatchEvent(new CustomEvent("ln-fill", { detail: a ?? null, bubbles: !0 }));
  return d;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(d) {
  if (!(!d.target.matches || !d.target.matches("[data-ln-fillable]")))
    if (d.detail)
      nt(d.target, d.detail);
    else {
      const a = d.target.querySelectorAll("[data-ln-field]");
      for (let y = 0; y < a.length; y++)
        a[y].textContent = "";
    }
})));
function Et(d, a) {
  if (!d || !a) return d;
  const y = document.createTreeWalker(d, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const m = y.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(h, o) {
        return a[o] !== void 0 ? a[o] : "";
      }
    ));
  }
  const w = function(m, h) {
    return a[h] !== void 0 ? a[h] : "";
  }, b = Array.from(d.querySelectorAll("*"));
  d.nodeType === 1 && b.push(d);
  for (let m = 0; m < b.length; m++) {
    const h = b[m], o = h.attributes;
    for (let c = 0; c < o.length; c++) {
      const s = o[c];
      s.value.indexOf("{{") !== -1 && h.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, w));
    }
  }
  return d;
}
function He(d, a, y, w, b, m) {
  const h = {};
  for (let c = 0; c < d.children.length; c++) {
    const s = d.children[c], u = s.getAttribute("data-ln-key");
    u && (h[u] = s);
  }
  const o = document.createDocumentFragment();
  for (let c = 0; c < a.length; c++) {
    const s = a[c], u = String(w(s));
    let f = h[u];
    if (f)
      b(f, s, c);
    else {
      const p = Lt(y, m);
      if (!p || (Et(p, s), f = p.firstElementChild, !f)) continue;
      f.setAttribute("data-ln-key", u), b(f, s, c);
    }
    o.appendChild(f);
  }
  d.textContent = "", d.appendChild(o);
}
function lt(d, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      lt(d, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  d();
}
function ct(d, a, y) {
  if (d) {
    const w = d.querySelector('[data-ln-template="' + a + '"]');
    if (w) return w.content.cloneNode(!0);
  }
  return Lt(a, y);
}
function xt(d, a) {
  const y = {}, w = d.querySelectorAll("[" + a + "]");
  for (let b = 0; b < w.length; b++)
    y[w[b].getAttribute(a)] = w[b].textContent, w[b].remove();
  return y;
}
function Mt(d, a, y, w) {
  if (d.nodeType !== 1) return;
  const m = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", h = Array.from(d.querySelectorAll(m));
  d.matches && d.matches(m) && h.push(d);
  for (const o of h)
    o[y] || (o[y] = new w(o));
}
function Ct(d) {
  return !!(d.offsetWidth || d.offsetHeight || d.getClientRects().length);
}
function Be(d) {
  const a = d.querySelector('input[name="_method"]');
  return ((a && a.value !== "" ? a.value : d.method) || "").toUpperCase();
}
function ce(d, a) {
  const y = !!(a && a.typed), w = a && a.exclude, b = {}, m = d.elements, h = {};
  if (y)
    for (let o = 0; o < m.length; o++) {
      const c = m[o];
      c.name && c.type === "checkbox" && !c.disabled && (h[c.name] = (h[c.name] || 0) + 1);
    }
  for (let o = 0; o < m.length; o++) {
    const c = m[o];
    if (!(!c.name || c.disabled || c.type === "file" || c.type === "submit" || c.type === "button") && !(w && c.matches && c.matches(w)))
      if (c.type === "checkbox")
        y && h[c.name] === 1 ? b[c.name] = c.checked : (b[c.name] || (b[c.name] = []), c.checked && b[c.name].push(c.value));
      else if (c.type === "radio")
        c.checked && (b[c.name] = c.value);
      else if (c.type === "select-multiple") {
        b[c.name] = [];
        for (let s = 0; s < c.options.length; s++)
          c.options[s].selected && b[c.name].push(c.options[s].value);
      } else if (y && c.type === "hidden")
        b[c.name] = c.value;
      else if (y && (c.type === "number" || c.type === "range")) {
        const s = Number(c.value);
        b[c.name] = c.value === "" || isNaN(s) ? null : s;
      } else
        b[c.name] = c.value;
  }
  return b;
}
function Ue(d) {
  if (typeof d != "string") return !!d;
  const a = d.trim().toLowerCase();
  return a !== "false" && a !== "0" && a !== "" && a !== "off" && a !== "no";
}
function de(d, a) {
  const y = d.elements, w = [], b = {};
  for (let m = 0; m < y.length; m++) {
    const h = y[m];
    h.name && h.type === "checkbox" && (b[h.name] = (b[h.name] || 0) + 1);
  }
  for (let m = 0; m < y.length; m++) {
    const h = y[m];
    if (h.type === "file" || h.type === "submit" || h.type === "button") continue;
    const o = h.getAttribute("data-ln-fill-as") || h.name;
    if (!o || !(o in a)) continue;
    const c = a[o];
    if (h.type === "checkbox") {
      if (Array.isArray(c))
        h.checked = c.indexOf(h.value) !== -1;
      else if (b[h.name] > 1) {
        const s = String(c).split(",").map(function(u) {
          return u.trim();
        });
        h.checked = s.indexOf(h.value) !== -1;
      } else
        h.checked = Ue(c);
      w.push(h);
    } else if (h.type === "radio")
      h.checked = h.value === String(c), w.push(h);
    else if (h.type === "select-multiple") {
      if (Array.isArray(c))
        for (let s = 0; s < h.options.length; s++)
          h.options[s].selected = c.indexOf(h.options[s].value) !== -1;
      w.push(h);
    } else
      h.value = c, w.push(h);
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
function W(d) {
  const a = d ? d.closest("[lang]") : null, y = (a ? a.getAttribute("lang") || a.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!y) return "en-US";
  const w = y.trim().toLowerCase();
  return w.indexOf("-") === -1 && te[w] ? te[w] : y;
}
function _t(d) {
  return d.hasAttribute("data-ln-value") ? d.getAttribute("data-ln-value") : d.textContent.trim();
}
function bt(d) {
  let a = !1;
  for (let y = 0; y < d.length; y++) {
    const w = d[y];
    if (!(w === "" || w == null) && (a = !0, !Number.isFinite(Number(w))))
      return "string";
  }
  return a ? "number" : "string";
}
function yt(d, a, y, w) {
  if (y === "number") {
    const h = parseFloat(d), o = parseFloat(a);
    return (isNaN(h) ? 0 : h) - (isNaN(o) ? 0 : o);
  }
  const b = d != null ? String(d) : "", m = a != null ? String(a) : "";
  return w ? w.compare(b, m) : b < m ? -1 : b > m ? 1 : 0;
}
function ue(d, a, { get: y, set: w }) {
  Object.defineProperty(d, "value", {
    get: function() {
      return y ? y.call(this) : a.get.call(this);
    },
    set: function(b) {
      w ? w.call(this, b, (m) => a.set.call(this, m)) : a.set.call(this, b);
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
    const d = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let a = 0; a < d.length; a++)
      d[a]();
  }
}
function Ke() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function it(d) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(d) : setTimeout(d, 0)) : d();
}
function B(d, a, y, w, b = {}) {
  const m = b.extraAttributes || [], h = b.onAttributeChange || null, o = b.onInit || null;
  function c(u) {
    const f = u || document.body;
    Mt(f, d, a, y), o && o(f);
  }
  lt(function() {
    const u = new MutationObserver(function(p) {
      for (let _ = 0; _ < p.length; _++) {
        const r = p[_];
        if (r.type === "childList") {
          for (let i = 0; i < r.addedNodes.length; i++) {
            const t = r.addedNodes[i];
            t.nodeType === 1 && (Mt(t, d, a, y), o && o(t));
          }
          for (let i = 0; i < r.removedNodes.length; i++) {
            const t = r.removedNodes[i];
            if (t.nodeType === 1) {
              const n = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", l = Array.from(t.querySelectorAll(n));
              t.matches && t.matches(n) && l.push(t);
              for (let g = 0; g < l.length; g++) {
                const E = l[g];
                if (!document.contains(E)) {
                  const v = E[a];
                  v && typeof v.destroy == "function" && v.destroy();
                }
              }
            }
          }
        } else r.type === "attributes" && (h && r.target[a] ? h(r.target, r.attributeName) : (Mt(r.target, d, a, y), o && o(r.target)));
      }
    });
    let f = [];
    if (d.indexOf("[") !== -1) {
      const p = /\[([\w-]+)/g;
      let _;
      for (; (_ = p.exec(d)) !== null; )
        f.push(_[1]);
    } else
      f.push(d);
    u.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: f.concat(m)
    });
  }, w || (d.indexOf("[") === -1 ? d.replace("data-", "") : "component")), window[a] = c;
  function s() {
    Ke() > 0 ? it(function() {
      c(document.body);
    }) : c(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s(), c;
}
function he(d, a) {
  if (d.ctrlKey || d.metaKey || d.shiftKey || d.altKey || d.button !== 0 || !a) return !1;
  const y = a.getAttribute("href");
  return !(!y || a.getAttribute("target") === "_blank" || a.hasAttribute("download") || y.startsWith("mailto:") || y.startsWith("tel:") || y === "#" || y.startsWith("#") || a.hostname && a.hostname !== window.location.hostname);
}
function X(...d) {
  return d.filter((a) => a != null && a !== "").map((a, y) => y === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function gt(d, a) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, d, a ? { Authorization: a } : null);
}
function fe(d, a = "ln-core") {
  try {
    return d ? JSON.parse(d) : {};
  } catch (y) {
    return console.error(`[${a}] Invalid headers JSON:`, y), {};
  }
}
const pe = {};
function je(d, a) {
  pe[d] = a;
}
function Ve(d) {
  return pe[d] || { ingress: (a) => a, egress: (a) => a };
}
const me = {};
function Vt(d, a) {
  if (!d || typeof a != "object") return;
  const y = d.toLowerCase().split("-")[0];
  me[y] = a;
}
function vt(d) {
  if (!d) return null;
  const a = d.toLowerCase().split("-")[0];
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
function Wt(d, a) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, d();
    }));
  };
}
function ge(d) {
  d = d || {};
  let a = d.windowSize > 0 ? d.windowSize : 1e3, y = d.pageSize > 0 ? d.pageSize : 200, w = d.threshold != null ? d.threshold : 25, b = d.fetchDebounce != null ? d.fetchDebounce : 120;
  const m = typeof d.requestPage == "function" ? d.requestPage : function() {
  }, h = typeof d.onChange == "function" ? d.onChange : function() {
  }, o = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let u = 0, f = 0, p = 0, _ = { sort: null, filters: {}, search: "" }, r = null, i = 0, t = 0, e = !1;
  function n(v) {
    c.set(v, ++i);
  }
  function l() {
    return !!(_ && (_.search || _.filters && Object.keys(_.filters).length));
  }
  function g() {
    if (o.size <= a) return;
    const v = Array.from(o.keys()).sort(function(S, q) {
      return (c.get(S) || 0) - (c.get(q) || 0);
    });
    let A = 0;
    for (; o.size > a && A < v.length; )
      o.delete(v[A]), c.delete(v[A]), A++;
  }
  function E(v, A) {
    s.add(v), m(_, v, A);
  }
  return {
    get: function(v) {
      return o.get(v);
    },
    has: function(v) {
      return o.has(v);
    },
    peek: function() {
      return o.size ? o.values().next().value : void 0;
    },
    get logicalTotal() {
      return u;
    },
    get grandTotal() {
      return f;
    },
    get queryGen() {
      return p;
    },
    get size() {
      return o.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(v, A) {
      clearTimeout(r), t = v;
      for (let R = v; R < A; R++)
        o.has(R) && n(R);
      if (u <= 0) return;
      const S = Math.max(0, v - w), q = Math.min(u, A + w), T = Math.floor(S / y), x = Math.floor(Math.max(0, q - 1) / y);
      let k = -1;
      for (let R = T; R <= x; R++) {
        const N = R * y, z = Math.min(y, u - N);
        let H = !1;
        const U = Math.max(N, S), K = Math.min(N + z, q);
        for (let rt = U; rt < K; rt++)
          if (!o.has(rt)) {
            H = !0;
            break;
          }
        if (H && !s.has(N)) {
          k = N;
          break;
        }
      }
      k !== -1 && (r = setTimeout(function() {
        E(k, y);
      }, b));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(v) {
      if (v = v || {}, v.queryGen != null && v.queryGen !== p) return;
      e && (o.clear(), c.clear(), e = !1), f = v.total != null ? v.total : f, u = v.filtered != null ? v.filtered : v.data ? v.data.length : u;
      const A = v.offset || 0, S = v.data || [];
      for (let q = 0; q < S.length; q++)
        S[q] != null && (o.set(A + q, S[q]), n(A + q));
      s.delete(A), g(), h();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(v) {
      v && (_ = v), E(0, y);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(v) {
      p++, s.clear(), clearTimeout(r), v && (_ = v), e = !0, E(0, y);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      p++, s.clear(), clearTimeout(r), e = !0;
      const v = Math.max(0, Math.floor(t / y) * y);
      E(v, y);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(v) {
      s.delete(v);
    },
    destroy: function() {
      clearTimeout(r), o.clear(), c.clear(), s.clear();
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
      v == null || isNaN(v) || v < 0 || (f = v, l() || (u = v), h());
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
    const d = "__ln_test__";
    localStorage.setItem(d, d), localStorage.removeItem(d), ft = !0;
  } catch {
    ft = !1;
  }
  return ft;
}
function Ge() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function be(d, a) {
  const y = a.getAttribute("data-ln-persist"), w = y !== null && y !== "" ? y : a.id;
  return w ? We + d + ":" + Ge() + ":" + w : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function kt(d, a) {
  if (!_e()) return null;
  const y = be(d, a);
  if (!y) return null;
  try {
    const w = localStorage.getItem(y);
    return w !== null ? JSON.parse(w) : null;
  } catch {
    return null;
  }
}
function ut(d, a, y) {
  if (!_e()) return;
  const w = be(d, a);
  if (w)
    try {
      y == null ? localStorage.removeItem(w) : localStorage.setItem(w, JSON.stringify(y));
    } catch {
    }
}
function ye(d) {
  return (d || "").replace(/^#/, "");
}
function It(d) {
  const a = d === void 0 ? location.hash : d, y = {}, w = ye(a);
  if (!w) return y;
  const b = w.split("&");
  for (let m = 0; m < b.length; m++) {
    const h = b[m];
    if (!h) continue;
    const o = h.indexOf(":"), c = o > -1 ? h.slice(0, o) : h, s = o > -1 ? h.slice(o + 1) : "";
    if (c)
      try {
        y[c] = decodeURIComponent(s);
      } catch {
        y[c] = s;
      }
  }
  return y;
}
function Z(d) {
  if (!d) return null;
  const a = It();
  return d in a ? a[d] : null;
}
function J(d, a) {
  if (!d) return;
  const y = It();
  a == null ? delete y[d] : y[d] = String(a);
  const b = Object.keys(y).map(function(m) {
    const h = y[m];
    return h === "" ? m : m + ":" + encodeURIComponent(h);
  }).join("&");
  ye(location.hash) !== b && (location.hash = b);
}
function Gt(d) {
  return d.button === 1 || d.ctrlKey || d.metaKey || d.shiftKey ? !1 : (d.preventDefault(), !0);
}
function ht(d, a) {
  if (!d || !d.hasAttribute("data-ln-hash")) return null;
  const y = d.getAttribute("data-ln-hash");
  if (y && y.trim() !== "") return y.trim();
  const w = d.getAttribute("data-ln-sort") || d.getAttribute("data-ln-search-for") || d.getAttribute("data-ln-search") || d.getAttribute("data-ln-filter") || d.id;
  return w ? a ? w + "-" + a : w : a || null;
}
function ve(d, a) {
  return !a || a === "none" || d === null || d === void 0 ? null : String(d) + "." + a;
}
function Pt(d) {
  return !d || typeof d != "string" ? null : d.endsWith(".asc") ? { fieldOrColumn: d.slice(0, -4), direction: "asc" } : d.endsWith(".desc") ? { fieldOrColumn: d.slice(0, -5), direction: "desc" } : null;
}
function we(d, a) {
  return !d || !Array.isArray(a) || a.length === 0 ? null : d + ":" + a.map(encodeURIComponent).join(",");
}
function Ht(d) {
  if (!d || typeof d != "string") return null;
  const a = d.indexOf(":");
  if (a === -1) return null;
  const y = d.slice(0, a), w = d.slice(a + 1), b = w ? w.split(",").map(function(m) {
    try {
      return decodeURIComponent(m);
    } catch {
      return m;
    }
  }).filter(Boolean) : [];
  return { key: y, values: b };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = It, window.lnCore.hashGet = Z, window.lnCore.hashSet = J, window.lnCore.hashLinkClick = Gt, window.lnCore.resolveHashNamespace = ht, window.lnCore.hashSortEncode = ve, window.lnCore.hashSortDecode = Pt, window.lnCore.hashFilterEncode = we, window.lnCore.hashFilterDecode = Ht);
function Tt(d, a, y, w) {
  const b = typeof w == "number" ? w : 4, m = window.innerWidth, h = window.innerHeight, o = a.width, c = a.height, s = (y || "bottom").split("-"), u = s[0], f = s[1] === "start" || s[1] === "end" ? s[1] : "center", p = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, _ = p[u] || p.bottom;
  function r(l) {
    return l === "top" || l === "bottom" ? f === "start" ? d.left : f === "end" ? d.right - o : d.left + (d.width - o) / 2 : f === "start" ? d.top : f === "end" ? d.bottom - c : d.top + (d.height - c) / 2;
  }
  function i(l) {
    let g, E, v = !0;
    return l === "top" ? (g = d.top - b - c, E = r(l), g < 0 && (v = !1)) : l === "bottom" ? (g = d.bottom + b, E = r(l), g + c > h && (v = !1)) : l === "left" ? (g = r(l), E = d.left - b - o, E < 0 && (v = !1)) : (g = r(l), E = d.right + b, E + o > m && (v = !1)), { top: g, left: E, side: l, fits: v };
  }
  let t = null;
  for (let l = 0; l < _.length; l++) {
    const g = i(_[l]);
    if (g.fits) {
      t = g;
      break;
    }
  }
  t || (t = i(_[0]));
  let e = t.top, n = t.left;
  return o >= m ? n = 0 : (n < 0 && (n = 0), n + o > m && (n = m - o)), c >= h ? e = 0 : (e < 0 && (e = 0), e + c > h && (e = h - c)), { top: e, left: n, placement: t.side };
}
function Bt(d) {
  if (!d) return { width: 0, height: 0 };
  const a = d.style, y = a.visibility, w = a.display, b = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const m = d.offsetWidth, h = d.offsetHeight;
  return a.visibility = y, a.display = w, a.position = b, { width: m, height: h };
}
let at = null;
async function ee(d) {
  if (!d) {
    at = null;
    return;
  }
  try {
    const a = new TextEncoder(), y = await crypto.subtle.digest("SHA-256", a.encode(d));
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
async function Qe(d, a = at) {
  const y = a || at;
  if (!y || d === void 0 || d === null) return d;
  try {
    const w = new TextEncoder(), b = crypto.getRandomValues(new Uint8Array(12)), m = typeof d == "string" ? d : JSON.stringify(d), h = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: b },
      y,
      w.encode(m)
    ), o = btoa(String.fromCharCode(...b)), c = btoa(String.fromCharCode(...new Uint8Array(h)));
    return {
      encrypted: !0,
      iv: o,
      data: c
    };
  } catch (w) {
    return console.error("[ln-core/crypto] Encryption failed:", w), d;
  }
}
async function $e(d, a = at) {
  const y = a || at;
  if (!d || !d.encrypted || !y) return d;
  try {
    const w = new TextDecoder(), b = Uint8Array.from(atob(d.iv), (c) => c.charCodeAt(0)), m = Uint8Array.from(atob(d.data), (c) => c.charCodeAt(0)), h = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b },
      y,
      m
    ), o = w.decode(h);
    try {
      return JSON.parse(o);
    } catch {
      return o;
    }
  } catch (w) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", w), { ...d, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const d = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function w(s) {
    return typeof s == "string" ? s : s instanceof URL ? s.href : s instanceof Request ? s.url : String(s);
  }
  function b(s, u) {
    return u && u.method ? String(u.method).toUpperCase() : s instanceof Request ? s.method.toUpperCase() : "GET";
  }
  function m(s, u) {
    return u + " " + s;
  }
  function h(s) {
    return s === "GET" || s === "HEAD";
  }
  function o(s, u) {
    u = u || {};
    const f = w(s), p = b(s, u), _ = m(f, p);
    h(p) && a.has(_) && (a.get(_).abort(), a.delete(_));
    const r = new AbortController(), i = u.signal;
    let t = null;
    i && (i.aborted ? r.abort(i.reason) : (t = function() {
      r.abort(i.reason);
    }, i.addEventListener("abort", t, { once: !0 })));
    const e = Object.assign({}, u, { signal: r.signal });
    return a.set(_, r), d(s, e).finally(function() {
      i && t && i.removeEventListener("abort", t), a.get(_) === r && a.delete(_);
    });
  }
  o.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = o;
  function c(s) {
    if (!s.detail || !s.detail.url) return;
    const u = s.target, f = (s.detail.method || (s.detail.body ? "POST" : "GET")).toUpperCase(), p = s.detail.key;
    p && y.has(p) && (y.get(p).abort(), y.delete(p));
    const _ = new AbortController(), r = s.detail.signal;
    let i = null;
    r && (r.aborted ? _.abort(r.reason) : (i = function() {
      _.abort(r.reason);
    }, r.addEventListener("abort", i, { once: !0 }))), p && y.set(p, _);
    const t = { method: f, signal: _.signal };
    s.detail.body !== void 0 && (t.body = s.detail.body), window.fetch(s.detail.url, t).then(function(e) {
      r && i && r.removeEventListener("abort", i), p && y.get(p) === _ && y.delete(p), L(u, "ln-http:response", {
        ok: e.ok,
        status: e.status,
        response: e
      });
    }).catch(function(e) {
      r && i && r.removeEventListener("abort", i), p && y.get(p) === _ && y.delete(p), !(e && e.name === "AbortError") && L(u, "ln-http:error", {
        ok: !1,
        status: 0,
        error: e
      });
    });
  }
  document.addEventListener("ln-http:request", c), window.lnHttp = {
    cancel: function(s) {
      let u = !1;
      return a.forEach(function(f, p) {
        p.endsWith(" " + s) && (f.abort(), a.delete(p), u = !0);
      }), u;
    },
    cancelByKey: function(s) {
      return y.has(s) ? (y.get(s).abort(), y.delete(s), !0) : !1;
    },
    cancelAll: function() {
      a.forEach(function(s) {
        s.abort();
      }), a.clear(), y.forEach(function(s) {
        s.abort();
      }), y.clear();
    },
    get inflight() {
      const s = [];
      return a.forEach(function(u, f) {
        const p = f.indexOf(" ");
        s.push({ method: f.slice(0, p), url: f.slice(p + 1) });
      }), y.forEach(function(u, f) {
        s.push({ key: f });
      }), s;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", c), window.fetch = d, delete window.lnHttp;
    }
  };
})();
(function() {
  const d = "template[data-ln-include]", a = "lnInclude";
  if (window[a] !== void 0) return;
  const y = /* @__PURE__ */ new Map();
  function w(b) {
    if (this.dom = b, this.url = b.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    ze(), this._held = !0;
    const m = this, h = this.url;
    let o = y.get(h);
    return o || (o = fetch(h).then(function(c) {
      if (!c.ok)
        throw new Error("HTTP error! status: " + c.status);
      return c.text();
    }).catch(function(c) {
      throw y.delete(h), c;
    }), y.set(h, o)), o.then(function(c) {
      if (m._destroyed) return;
      const s = document.createElement("template");
      s.innerHTML = c, m.dom.content.appendChild(s.content), L(m.dom, "ln-include:loaded", { target: m.dom, url: m.url }), m._held && (m._held = !1, Ft());
    }).catch(function(c) {
      m._destroyed || (console.error("[ln-include] Failed to fetch template from " + m.url + ":", c), L(m.dom, "ln-include:error", { target: m.dom, url: m.url, error: c }), m._held && (m._held = !1, Ft()));
    }), this;
  }
  w.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._held && (this._held = !1, Ft()), delete this.dom[a]);
  }, B(d, a, w, "ln-include");
})();
(function() {
  const d = "data-ln-form", a = "lnForm", y = "data-ln-form-action-edit", w = "data-ln-form-action-method";
  if (window[a] !== void 0) return;
  function b(m) {
    this.dom = m, this._baseAction = m.getAttribute("action") || "";
    const h = this;
    return this._onLnFill = function(o) {
      o.target === h.dom && (o.detail ? (h.fill(o.detail), h._applyActionMode(o.detail)) : h.dom.reset());
    }, this._onReset = function() {
      h._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  b.prototype.fill = function(m) {
    const h = de(this.dom, m);
    for (let o = 0; o < h.length; o++) {
      const c = h[o], s = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(s ? "change" : "input", { bubbles: !0 }));
    }
  }, b.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, b.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute(y)) return;
    const h = m && m.id != null && m.id !== "" ? m.id : null, o = this._ensureMethodInput();
    if (h !== null) {
      const c = this.dom.getAttribute(y);
      c ? this.dom.setAttribute("action", c.replace(":id", encodeURIComponent(h))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(h)), o.value = this.dom.getAttribute(w) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), o.value = "";
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(d, a, b, "ln-form");
})();
(function() {
  const d = "data-ln-validate", a = "lnValidate", y = "data-ln-validate-errors", w = "data-ln-validate-error", b = "ln-validate-valid", m = "ln-validate-invalid", h = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[a] !== void 0) return;
  function o(c) {
    this.dom = c, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const s = this, u = c.tagName, f = c.type, p = u === "SELECT" || f === "checkbox" || f === "radio";
    this._onInput = function() {
      s._touched = !0, s.validate();
    }, this._onChange = function() {
      s._touched = !0, s.validate();
    }, this._onSetCustom = function(r) {
      const i = r.detail && r.detail.error;
      if (!i) return;
      s._customErrors.add(i), s._touched = !0;
      const t = c.closest(".form-element");
      if (t) {
        const e = t.querySelector("[" + w + '="' + i + '"]');
        e && e.classList.remove("hidden");
      }
      c.classList.remove(b), c.classList.add(m), c.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(r) {
      const i = r.detail && r.detail.error, t = c.closest(".form-element");
      if (i) {
        if (s._customErrors.delete(i), t) {
          const e = t.querySelector("[" + w + '="' + i + '"]');
          e && e.classList.add("hidden");
        }
      } else
        s._customErrors.forEach(function(e) {
          if (t) {
            const n = t.querySelector("[" + w + '="' + e + '"]');
            n && n.classList.add("hidden");
          }
        }), s._customErrors.clear();
      s._touched && s.validate();
    }, p || c.addEventListener("input", this._onInput), c.addEventListener("change", this._onChange), c.addEventListener("ln-validate:set-custom", this._onSetCustom), c.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const _ = c.form;
    return _ && (_.hasAttribute("novalidate") || _.setAttribute("novalidate", ""), this._onFormReset = function() {
      s.reset();
    }, this._onValidateRequest = function(r) {
      s._touched = !0, !s.validate() && r.detail && r.detail.invalidFields && r.detail.invalidFields.push(s.dom);
    }, _.addEventListener("reset", this._onFormReset), _.addEventListener("ln-validate:request-validate", this._onValidateRequest), _._lnValidateGateBound || (_._lnValidateGateBound = !0, _.addEventListener("submit", function(r) {
      const i = { invalidFields: [] };
      L(_, "ln-validate:request-validate", i), i.invalidFields.length > 0 && (r.preventDefault(), i.invalidFields.sort((t, e) => t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), i.invalidFields[0].focus());
    }))), this;
  }
  o.prototype.validate = function() {
    const c = this.dom, s = c.validity, f = c.checkValidity() && this._customErrors.size === 0, p = c.closest(".form-element");
    if (p) {
      const r = p.querySelector("[" + y + "]");
      if (r) {
        const i = r.querySelectorAll("[" + w + "]");
        for (let t = 0; t < i.length; t++) {
          const e = i[t].getAttribute(w), n = h[e];
          n && (s[n] ? i[t].classList.remove("hidden") : i[t].classList.add("hidden"));
        }
      }
    }
    return c.classList.toggle(b, f), c.classList.toggle(m, !f), c.setAttribute("aria-invalid", f ? "false" : "true"), L(c, f ? "ln-validate:valid" : "ln-validate:invalid", { target: c, field: c.name }), f;
  }, o.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(b, m), this.dom.removeAttribute("aria-invalid");
    const c = this.dom.closest(".form-element");
    if (c) {
      const s = c.querySelectorAll("[" + w + "]");
      for (let u = 0; u < s.length; u++)
        s[u].classList.add("hidden");
    }
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), o.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const c = this.dom.form;
    c && (this._onFormReset && c.removeEventListener("reset", this._onFormReset), this._onValidateRequest && c.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(b, m), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a];
  }, B(d, a, o, "ln-validate");
})();
(function() {
  const d = "data-ln-ajax", a = "lnAjax", y = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  function w(f) {
    if (!f.hasAttribute(d) || f[a]) return;
    f[a] = !0;
    const p = c(f);
    b(p.links), m(p.forms);
  }
  function b(f) {
    for (const p of f) {
      if (p[a + "Trigger"] || p.hostname && p.hostname !== window.location.hostname) continue;
      const _ = p.getAttribute("href");
      if (_ && _.includes("#")) continue;
      const r = function(i) {
        if (!he(i, p)) return;
        i.preventDefault();
        const t = p.getAttribute("href");
        t && o("GET", t, null, p);
      };
      p.addEventListener("click", r), p[a + "Trigger"] = r;
    }
  }
  function m(f) {
    for (const p of f) {
      if (p[a + "Trigger"]) continue;
      if (p.hasAttribute(y)) {
        p[a + "ScopeWarned"] || (p[a + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const _ = function(r) {
        if (r.defaultPrevented) return;
        r.preventDefault();
        const i = p.method.toUpperCase(), t = p.action, e = new FormData(p);
        for (const n of p.querySelectorAll('button, input[type="submit"]'))
          n.disabled = !0;
        o(i, t, e, p, function() {
          for (const n of p.querySelectorAll('button, input[type="submit"]'))
            n.disabled = !1;
        });
      };
      p.addEventListener("submit", _), p[a + "Trigger"] = _;
    }
  }
  function h(f) {
    if (!f[a]) return;
    const p = c(f);
    for (const _ of p.links)
      _[a + "Trigger"] && (_.removeEventListener("click", _[a + "Trigger"]), delete _[a + "Trigger"]);
    for (const _ of p.forms)
      _[a + "Trigger"] && (_.removeEventListener("submit", _[a + "Trigger"]), delete _[a + "Trigger"]);
    delete f[a];
  }
  function o(f, p, _, r, i) {
    if (Q(r, "ln-ajax:before-start", { method: f, url: p }).defaultPrevented) return;
    L(r, "ln-ajax:start", { method: f, url: p }), r.classList.add("ln-ajax--loading");
    const e = document.createElement("span");
    e.className = "ln-ajax-spinner", r.appendChild(e);
    function n() {
      r.classList.remove("ln-ajax--loading");
      const A = r.querySelector(".ln-ajax-spinner");
      A && A.remove(), i && i();
    }
    let l = p;
    const g = document.querySelector('meta[name="csrf-token"]'), E = g ? g.getAttribute("content") : null;
    _ instanceof FormData && E && _.append("_token", E);
    const v = {
      method: f,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (v.headers["X-CSRF-TOKEN"] = E), f === "GET" && _) {
      const A = new URLSearchParams(_);
      l = p + (p.includes("?") ? "&" : "?") + A.toString();
    } else f !== "GET" && _ && (v.body = _);
    fetch(l, v).then(function(A) {
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
        if (r.tagName === "A") {
          const x = r.getAttribute("href");
          x && window.history.pushState({ ajax: !0 }, "", x);
        } else r.tagName === "FORM" && r.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", l);
        L(r, "ln-ajax:success", { method: f, url: l, data: q });
      } else
        L(r, "ln-ajax:error", {
          method: f,
          url: l,
          status: S,
          data: q,
          error: T || null
        });
      L(r, "ln-ajax:complete", { method: f, url: l }), n();
    }).catch(function(A) {
      L(r, "ln-ajax:error", { method: f, url: l, status: 0, data: null, error: A }), L(r, "ln-ajax:complete", { method: f, url: l }), n();
    });
  }
  function c(f) {
    const p = { links: [], forms: [] };
    return f.tagName === "A" && f.getAttribute(d) !== "false" ? p.links.push(f) : f.tagName === "FORM" && f.getAttribute(d) !== "false" ? p.forms.push(f) : (p.links = Array.from(f.querySelectorAll('a:not([data-ln-ajax="false"])')), p.forms = Array.from(f.querySelectorAll('form:not([data-ln-ajax="false"])'))), p;
  }
  function s() {
    lt(function() {
      new MutationObserver(function(p) {
        for (const _ of p)
          if (_.type === "childList") {
            for (const r of _.addedNodes)
              if (r.nodeType === 1 && (w(r), !r.hasAttribute(d))) {
                for (const t of r.querySelectorAll("[" + d + "]"))
                  w(t);
                const i = r.closest && r.closest("[" + d + "]");
                if (i && i.getAttribute(d) !== "false") {
                  const t = c(r);
                  b(t.links), m(t.forms);
                }
              }
          } else _.type === "attributes" && w(_.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-ajax");
  }
  function u() {
    for (const f of document.querySelectorAll("[" + d + "]"))
      w(f);
  }
  window[a] = w, window[a].destroy = h, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
const Ee = {
  navigate: function(d) {
    wt(d, { historyAction: "push" });
  },
  replace: function(d) {
    wt(d, { historyAction: "replace" });
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
function re(d, a, y) {
  Kt ? queueMicrotask(function() {
    L(d, a, y);
  }) : L(d, a, y);
}
function qt(d) {
  try {
    const m = new URL(d, window.location.origin);
    d = m.pathname + m.search + m.hash;
  } catch {
  }
  let [a] = d.split("#"), [y, w] = a.split("?");
  const b = {};
  if (w) {
    const m = new URLSearchParams(w);
    for (const [h, o] of m.entries())
      b[h] = o;
  }
  return y = y.replace(/\/+$/, ""), y === "" && (y = "/"), { path: y, query: b };
}
function Te(d, a) {
  if (d.pattern === "*") return 1;
  if (a.pattern === "*") return -1;
  const y = d.segments, w = a.segments, b = Math.max(y.length, w.length);
  for (let m = 0; m < b; m++) {
    const h = y[m], o = w[m];
    if (h === void 0) return 1;
    if (o === void 0) return -1;
    if (h === "*") return 1;
    if (o === "*") return -1;
    const c = h.startsWith(":"), s = o.startsWith(":");
    if (c && !s) return 1;
    if (!c && s) return -1;
  }
  return 0;
}
function qe(d, a) {
  const y = d.split("/").filter(Boolean);
  for (const w of a) {
    if (w.pattern === "*")
      return {
        route: w,
        params: { wildcard: d }
      };
    const b = w.segments, m = {};
    let h = !0;
    if (!(y.length > b.length && b[b.length - 1] !== "*")) {
      for (let o = 0; o < b.length; o++) {
        const c = b[o], s = y[o];
        if (c === "*") {
          m.wildcard = y.slice(o).join("/");
          break;
        }
        if (s === void 0) {
          h = !1;
          break;
        }
        if (c.startsWith(":"))
          m[c.slice(1)] = decodeURIComponent(s);
        else if (c !== s) {
          h = !1;
          break;
        }
      }
      if (h && (b.indexOf("*") !== -1 || y.length <= b.length))
        return { route: w, params: m };
    }
  }
  return null;
}
function jt(d, a) {
  if (d !== "__primary__") {
    const w = document.getElementById(a.target);
    return w || console.warn(`[ln-router] Explicit target element #${a.target} not found in DOM`), w;
  }
  const y = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return y || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), y;
}
function Xe(d) {
  if (!d) return;
  const a = Array.from(d.querySelectorAll("*")), y = [d].concat(a);
  for (const b of y)
    for (const m of Object.keys(b))
      if (m.startsWith("ln") && b[m] && typeof b[m].destroy == "function")
        try {
          b[m].destroy();
        } catch (h) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, b, h);
        }
  const w = document.querySelectorAll('[data-ln-popover="open"]');
  for (const b of w) {
    const m = b.lnPopover;
    if (m && m.trigger && d.contains(m.trigger))
      try {
        m.destroy();
      } catch (h) {
        console.error("[ln-router] Error destroying open popover:", h);
      }
  }
}
function wt(d, a = {}) {
  const { path: y, query: w } = qt(d), b = /* @__PURE__ */ new Map();
  for (const [u, f] of st)
    b.set(u, qe(y, f.sorted));
  const m = st.has("__primary__"), h = b.get("__primary__");
  if (m && !h) {
    re(document.body, "ln-router:not-found", { path: y });
    return;
  }
  let o = null;
  if (h && (o = jt("__primary__", h.route), !o || Q(o, "ln-router:before-navigate", {
    from: Ut,
    to: d,
    params: h.params,
    query: w
  }).defaultPrevented))
    return;
  const c = [];
  for (const [u, f] of b) {
    if (!f) continue;
    const p = jt(u, f.route);
    p && (u !== "__primary__" && p.hasAttribute("data-ln-route-keep") && ne.get(p) === f.route.templateNode || c.push({ regionKey: u, match: f, targetEl: p }));
  }
  a.historyAction === "push" ? window.history.pushState(null, "", d) : a.historyAction === "replace" && window.history.replaceState(null, "", d);
  const s = function() {
    for (const { regionKey: u, match: f, targetEl: p } of c) {
      if (!(a.isHydration && p.hasAttribute("data-ln-router-hydrate") && p.children.length > 0)) {
        Xe(p);
        const r = f.route.templateNode.content.cloneNode(!0);
        p.replaceChildren(r);
      }
      if (ne.set(p, f.route.templateNode), u === "__primary__" && (f.route.title && (document.title = f.route.title), !a.isHydration)) {
        p.hasAttribute("tabindex") || p.setAttribute("tabindex", "-1");
        const r = p.querySelector("h1, h2, h3, h4, h5, h6");
        r ? (r.setAttribute("tabindex", "-1"), r.focus()) : p.focus(), p.scrollIntoView({ block: "start", behavior: "instant" });
      }
      re(p, "ln-router:navigated", {
        path: d,
        params: f.params,
        query: w,
        route: f.route,
        target: p,
        region: u
      });
    }
    h && (Ut = d, Ce = h.params, Le = w, zt = h.route), Se = new Map(
      Array.from(b.entries()).map(([u, f]) => [u, f ? { route: f.route, params: f.params } : null])
    );
  };
  document.startViewTransition && !a.isHydration ? document.startViewTransition(s) : s();
}
function Ye(d) {
  const a = d.target.closest("a");
  if (!a || !he(d, a)) return;
  const y = a.getAttribute("href"), { path: w } = qt(y), b = st.get("__primary__");
  if (!b) return;
  qe(w, b.sorted) && (d.preventDefault(), wt(y, { historyAction: "push" }));
}
function Je(d, a) {
  const y = Object.keys(d), w = Object.keys(a);
  if (y.length !== w.length) return !1;
  for (let b = 0; b < y.length; b++) {
    const m = y[b];
    if (d[m] !== a[m]) return !1;
  }
  return !0;
}
function Ze() {
  const d = window.location.pathname + window.location.search, a = Ee.current();
  if (a && a.path != null) {
    const y = qt(d);
    if (qt(a.path).path === y.path && Je(a.query, y.query))
      return;
  }
  wt(d, { historyAction: "skip" });
}
function tn() {
  ie || (ie = !0, lt(function() {
    document.addEventListener("click", Ye), window.addEventListener("popstate", Ze), Kt = !0;
    const d = window.location.pathname + window.location.search + window.location.hash;
    wt(d, { historyAction: "replace", isHydration: !0 }), Kt = !1;
  }, "ln-router"));
}
function en(d) {
  const a = d.getAttribute(Qt);
  if (!a) return;
  const y = d.getAttribute("data-ln-route-target") || null;
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
  const m = d.getAttribute("data-ln-route-title"), h = a.split("/").filter(Boolean), o = {
    pattern: a,
    segments: h,
    target: y,
    title: m,
    templateNode: d
  }, c = jt(w, o);
  c && c.contains(d) && console.warn(`[ln-router] Route template with pattern "${a}" is declared inside its own outlet element:`, d), b.routes.set(a, o), b.sorted = Array.from(b.routes.values()).sort(Te);
}
function nn(d) {
  const a = d.getAttribute(Qt);
  if (!a) return;
  const w = d.getAttribute("data-ln-route-target") || null || "__primary__", b = st.get(w);
  b && (b.routes.delete(a), b.sorted = Array.from(b.routes.values()).sort(Te), b.routes.size === 0 && st.delete(w));
}
function xe(d) {
  return this.dom = d, en(d), this;
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
  const d = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function y(b) {
    this.dom = b, this.isOpen = b.getAttribute(d) === "open";
    const m = this;
    return this._onRequestOpen = function() {
      m.dom.setAttribute(d, "open");
    }, this._onRequestClose = function() {
      m.dom.setAttribute(d, "close");
    }, this._onCancel = function(h) {
      h.preventDefault(), m.dom.setAttribute(d, "close");
    }, this._onClickClose = function(h) {
      const o = h.target.closest("[data-ln-modal-close]");
      o && m.dom.contains(o) && (h.preventDefault(), m.dom.setAttribute(d, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  y.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const b = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + d + '="open"]'),
          function(h) {
            return h !== b;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      L(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
    }
  };
  function w(b) {
    const m = b[a];
    if (!m) return;
    const o = b.getAttribute(d) === "open";
    if (o !== m.isOpen)
      if (o) {
        if (Q(b, "ln-modal:before-open", { modalId: b.id, target: b }).defaultPrevented) {
          b.setAttribute(d, "close");
          return;
        }
        m.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof b.showModal == "function" && b.showModal();
        const s = b.querySelector("[autofocus]");
        if (s && Ct(s))
          s.focus();
        else {
          const u = b.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), f = Array.prototype.find.call(u, Ct);
          if (f) f.focus();
          else {
            const p = b.querySelectorAll("a[href], button:not([disabled])"), _ = Array.prototype.find.call(p, Ct);
            _ && _.focus();
          }
        }
        L(b, "ln-modal:open", { modalId: b.id, target: b });
      } else {
        if (Q(b, "ln-modal:before-close", { modalId: b.id, target: b }).defaultPrevented) {
          b.setAttribute(d, "open");
          return;
        }
        m.isOpen = !1, L(b, "ln-modal:close", { modalId: b.id, target: b }), typeof b.close == "function" && b.close(), document.querySelector("[" + d + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  B(d, a, y, "ln-modal", {
    onAttributeChange: w
  });
})();
(function() {
  const d = "data-ln-ui-coordinator", a = "lnUiCoordinator", y = "data-ln-ui-coordinator-dict";
  if (window[a] !== void 0) return;
  function w(t) {
    const e = {};
    let n = t;
    const l = [];
    for (; n; ) {
      const g = n.closest("[" + d + "]");
      if (!g) break;
      g[a] && g[a].dict && l.unshift(g[a].dict), n = g.parentElement;
    }
    for (const g of l)
      Object.assign(e, g);
    return e;
  }
  function b(t, e) {
    if (e) {
      if (t) {
        const l = t.closest("[" + d + "]");
        if (l) {
          if (l.id === e && l.hasAttribute("data-ln-modal")) return l;
          const g = l.querySelector("#" + CSS.escape(e) + '[data-ln-modal], [data-ln-modal="' + e + '"]');
          if (g) return g;
        }
      }
      const n = document.getElementById(e) || document.querySelector('[data-ln-modal="' + e + '"]');
      if (n) return n;
    }
    if (t) {
      const n = t.closest("[" + d + "]");
      if (n) {
        if (n.hasAttribute("data-ln-modal")) return n;
        const g = n.querySelector("[data-ln-modal]");
        if (g) return g;
      }
      const l = t.closest("[data-ln-modal]");
      if (l) return l;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function m(t, e) {
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
    for (let l = 0; l < e.length; l++)
      e[l].textContent = "";
    const n = t.querySelectorAll("form");
    for (let l = 0; l < n.length; l++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(n[l], null) : n[l].reset();
  }
  document.addEventListener("submit", function(t) {
    if (t.defaultPrevented) return;
    const n = t.target.closest("[data-ln-modal]");
    if (n && n.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + n.id, "true");
      } catch {
      }
      J(n.id, null);
    }
  }), document.addEventListener("click", function(t) {
    if (t.ctrlKey || t.metaKey || t.button === 1) return;
    const e = t.target.closest("[data-ln-modal-for]");
    if (e) {
      const l = e.getAttribute("data-ln-modal-for"), g = b(e, l);
      if (g && g.lnModal) {
        t.preventDefault();
        const E = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, v = {}, A = e.dataset;
        for (const T in A) {
          if (!T.startsWith("lnModal") || E[T]) continue;
          const x = T.slice(7);
          x && (v[x.charAt(0).toLowerCase() + x.slice(1)] = A[T]);
        }
        const S = Object.keys(v).length > 0;
        e.hasAttribute("data-ln-modal-mode") ? g.dataset.lnModalMode = e.getAttribute("data-ln-modal-mode") : g.dataset.lnModalMode = S ? "edit" : "new", S && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(g, v) : g.dataset.lnModalMode === "new" && h(g), g.getAttribute("data-ln-modal") === "open" ? L(g, "ln-modal:request-close", {}) : (g.id && J(g.id, m(g.dataset.lnModalMode, e)), L(g, "ln-modal:request-open", {}));
      }
      return;
    }
    const n = t.target.closest('a[href^="#"]');
    if (n) {
      const l = It(n.getAttribute("href"));
      for (const g in l) {
        const E = document.getElementById(g);
        if (E && E.lnModal) {
          if (!Gt(t)) return;
          J(g, l[g]);
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
    let n = Z(e.id);
    n === null && (n = m(e.dataset.lnModalMode, null), J(e.id, n)), n ? (e.dataset.lnModalMode = "edit", e.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: n }
    }))) : (e.dataset.lnModalMode = "new", h(e));
  });
  let o = !1;
  function c() {
    if (!o) {
      o = !0;
      try {
        const t = document.querySelectorAll("[data-ln-modal][id]");
        for (let e = 0; e < t.length; e++) {
          const n = t[e];
          if (!n.lnModal) continue;
          const l = n.id, g = "ln-modal-pending:" + l;
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
              J(l, null), L(n, "ln-modal:request-close", {}), h(n);
              continue;
            }
          }
          const v = Z(l), A = v !== null, S = n.lnModal.isOpen;
          if (A) {
            const q = v ? "edit" : "new";
            n.dataset.lnModalMode = q, S ? v ? n.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: v }
            })) : h(n) : L(n, "ln-modal:request-open", {});
          } else S && L(n, "ln-modal:request-close", {});
        }
      } finally {
        o = !1;
      }
    }
  }
  function s() {
    const t = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let e = 0; e < t.length; e++) {
      const n = t[e];
      n.lnModal && Z(n.id) === null && J(n.id, m(n.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", c);
  function u() {
    s(), c();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    it(u);
  }) : it(u);
  function f(t) {
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
    const l = t.target.closest("[data-ln-modal]");
    if (l && l.lnModal) {
      if (l.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + l.id);
        } catch {
        }
        J(l.id, null);
      }
      L(l, "ln-modal:request-close", {}), h(l);
    }
  }
  function p(t) {
    const e = t.detail || {}, n = e.data, l = e.status || 0, g = w(t.target);
    if (n && n.message) {
      const E = n.message;
      window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
        detail: {
          type: E.type || "error",
          title: E.title || "",
          message: E.body || ""
        }
      }));
    } else l === 0 ? window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
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
  document.addEventListener("ln-ajax:success", f), document.addEventListener("ln-ajax:error", p);
  function _(t) {
    const e = t.detail || {}, n = w(t.target), l = e.message || (e.reason === "max-size" ? n["upload-max-size"] || "File is too large" : e.reason === "max-files" ? n["upload-max-files"] || "Maximum file count exceeded" : n["upload-invalid-type"] || "This file type is not allowed"), g = n["upload-invalid-title"] || "Invalid File";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g,
        message: l
      }
    }));
  }
  function r(t) {
    const e = t.detail || {}, n = w(t.target), l = e.message || n["upload-failed"] || "Failed to upload file", g = n["upload-error-title"] || "Upload Error";
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: "error",
        title: g,
        message: l
      }
    }));
  }
  document.addEventListener("ln-upload:invalid", _), document.addEventListener("ln-upload:error", r), document.addEventListener("ln-modal:close", function(t) {
    const e = t.target;
    if (!(!e || !e.lnModal)) {
      if (e.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + e.id);
        } catch {
        }
        Z(e.id) !== null && J(e.id, null);
      }
      e.dataset.lnModalMode === "new" && h(e);
    }
  });
  function i(t) {
    return this.dom = t, this.dict = xt(t, y), this;
  }
  i.prototype.destroy = function() {
    this.dom[a] && (this.dict = {}, delete this.dom[a]);
  }, B(d, a, i, "ln-ui-coordinator");
})();
(function() {
  const d = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const y = {}, w = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function b(s) {
    if (!y[s]) {
      const u = new Intl.NumberFormat(s, { useGrouping: !0 }), f = u.formatToParts(1234.5);
      let p = "", _ = ".";
      for (let r = 0; r < f.length; r++)
        f[r].type === "group" && (p = f[r].value), f[r].type === "decimal" && (_ = f[r].value);
      y[s] = { fmt: u, groupSep: p, decimalSep: _ };
    }
    return y[s];
  }
  function m(s, u, f) {
    if (f !== null) {
      const p = parseInt(f, 10), _ = s + "|d" + p;
      return y[_] || (y[_] = new Intl.NumberFormat(s, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: p })), y[_].format(u);
    }
    return b(s).fmt.format(u);
  }
  function h(s) {
    if (s[a]) return s[a];
    if (s[a] = this, this.dom = s, s.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const u = document.createElement("input");
    u.type = "hidden", u.name = s.name, s.removeAttribute("name"), s.hasAttribute("data-ln-fill-as") && u.setAttribute("data-ln-fill-as", s.getAttribute("data-ln-fill-as")), s.type = "text", s.setAttribute("inputmode", "decimal"), s.insertAdjacentElement("afterend", u), this._hidden = u;
    const f = this;
    Object.defineProperty(u, "value", {
      get: function() {
        return w.get.call(u);
      },
      set: function(_) {
        w.set.call(u, _), _ !== "" && !isNaN(parseFloat(_)) ? f._setDisplayRaw(m(W(f.dom), parseFloat(_), f.dom.getAttribute("data-ln-number-decimals"))) : f._setDisplayRaw(""), f.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), ue(s, w, {
      get: function() {
        return w.get.call(s);
      },
      set: function(_) {
        if (_ === "") {
          f._setDisplayRaw(""), f._setHiddenRaw(""), s.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const r = typeof _ == "number" ? _ : parseFloat(String(_).replace(/[^\d.-]/g, ""));
        isNaN(r) ? (f._setDisplayRaw(String(_)), f._setHiddenRaw("")) : (f._setHiddenRaw(r), f._setDisplayRaw(m(W(s), r, s.getAttribute("data-ln-number-decimals")))), s.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      f._handleInput();
    }, s.addEventListener("input", this._onInput), this._onPaste = function(_) {
      _.preventDefault();
      const r = (_.clipboardData || window.clipboardData).getData("text"), i = b(W(s)), t = i.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let e = r.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      i.groupSep && (e = e.split(i.groupSep).join("")), i.decimalSep !== "." && (e = e.replace(i.decimalSep, "."));
      const n = parseFloat(e);
      f.value = isNaN(n) ? NaN : n;
    }, s.addEventListener("paste", this._onPaste);
    const p = s.value;
    if (p !== "") {
      const _ = parseFloat(p);
      isNaN(_) || (this._setHiddenRaw(_), this._setDisplayRaw(m(W(s), _, s.getAttribute("data-ln-number-decimals"))), s.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function o(s) {
    if (typeof s == "number") return isNaN(s) ? null : s;
    if (!s || typeof s != "string") return null;
    let u = s.trim();
    if (u === "") return null;
    u = u.replace(/[\s\u00A0$€£]/g, ""), u.indexOf(",") !== -1 && u.indexOf(".") !== -1 ? u.indexOf(".") < u.indexOf(",") ? u = u.replace(/\./g, "").replace(",", ".") : u = u.replace(/,/g, "") : u.indexOf(",") !== -1 && (u = u.replace(",", ".")), u = u.replace(/[^\d.-]/g, "");
    const f = parseFloat(u);
    return isNaN(f) ? null : f;
  }
  h.prototype._initTextElement = function() {
    const s = this.dom;
    let u = s.getAttribute("data-ln-value"), f = s.getAttribute("data-ln-number"), p = null;
    u !== null && u !== "" ? p = u : f !== null && f !== "" && f !== "true" ? p = f : p = s.textContent.trim();
    const _ = o(p);
    _ !== null ? (this._rawValue = _, s.hasAttribute("data-ln-value") || s.setAttribute("data-ln-value", String(_)), this._formatTextContent()) : this._rawValue = null;
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = m(W(this.dom), this._rawValue, s);
    }
  }, h.prototype._handleInput = function() {
    const s = this.dom, u = b(W(s)), f = w.get.call(s);
    if (f === "") {
      this._setHiddenRaw(""), L(s, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (f === "-") {
      this._setHiddenRaw("");
      return;
    }
    const p = s.selectionStart;
    let _ = 0;
    for (let A = 0; A < p; A++)
      /[0-9]/.test(f[A]) && _++;
    let r = f;
    if (u.groupSep && (r = r.split(u.groupSep).join("")), r = r.replace(u.decimalSep, "."), f.endsWith(u.decimalSep) || f.endsWith(".")) {
      const A = r.replace(/\.$/, ""), S = parseFloat(A);
      isNaN(S) || this._setHiddenRaw(S);
      return;
    }
    const i = r.indexOf(".");
    if (i !== -1 && r.slice(i + 1).endsWith("0")) {
      const S = parseFloat(r);
      isNaN(S) || this._setHiddenRaw(S);
      return;
    }
    const t = s.getAttribute("data-ln-number-decimals");
    if (t !== null && i !== -1) {
      const A = parseInt(t, 10);
      r.slice(i + 1).length > A && (r = r.slice(0, i + 1 + A));
    }
    const e = parseFloat(r);
    if (isNaN(e)) return;
    const n = s.getAttribute("data-ln-number-min"), l = s.getAttribute("data-ln-number-max");
    if (n !== null && e < parseFloat(n) || l !== null && e > parseFloat(l)) return;
    let g;
    if (t !== null)
      g = m(W(s), e, t);
    else {
      const A = i !== -1 ? r.slice(i + 1).length : 0;
      if (A > 0) {
        const S = W(s) + "|u" + A;
        y[S] || (y[S] = new Intl.NumberFormat(W(s), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), g = y[S].format(e);
      } else
        g = u.fmt.format(e);
    }
    this._setDisplayRaw(g);
    let E = _, v = 0;
    for (let A = 0; A < g.length && E > 0; A++)
      v = A + 1, /[0-9]/.test(g[A]) && E--;
    E > 0 && (v = g.length), s.setSelectionRange(v, v), this._setHiddenRaw(e), L(s, "ln-number:input", { value: e, formatted: g });
  }, h.prototype._setHiddenRaw = function(s) {
    this._hidden && w.set.call(this._hidden, String(s));
  }, h.prototype._setDisplayRaw = function(s) {
    this.isTextElement ? this.dom.textContent = String(s) : w.set.call(this.dom, String(s));
  }, h.prototype._displayFormatted = function(s) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(m(W(this.dom), s, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const s = w.get.call(this._hidden);
      return s === "" ? NaN : parseFloat(s);
    },
    set: function(s) {
      if (this.isTextElement) {
        typeof s != "number" || isNaN(s) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = s, this.dom.setAttribute("data-ln-value", String(s)), this._formatTextContent());
        return;
      }
      if (typeof s != "number" || isNaN(s)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(s), this._setDisplayRaw(m(W(this.dom), s, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : w.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[a] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function c() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + d + "]");
      for (let u = 0; u < s.length; u++) {
        const f = s[u][a];
        f && (f.isTextElement ? f._formatTextContent() : isNaN(f.value) || f._displayFormatted(f.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(d, a, h, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(s) {
      const u = s[a];
      u && (u.isTextElement ? u._initTextElement() : isNaN(u.value) || u._displayFormatted(u.value));
    }
  }), c();
})();
(function() {
  const d = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const y = {}, w = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function b(n, l) {
    const g = n + "|" + JSON.stringify(l);
    return y[g] || (y[g] = new Intl.DateTimeFormat(n, l)), y[g];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, h = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function o(n) {
    return !n || n === "" ? { dateStyle: "medium" } : n.match(m) ? h[n] : null;
  }
  function c(n, l, g) {
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
    return l.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(K) {
      return U[K];
    });
  }
  function s(n, l, g) {
    const E = o(l);
    if (E) {
      const v = b(g, E), A = (g || "").toLowerCase().split("-")[0], S = v.resolvedOptions().locale.toLowerCase().split("-")[0];
      return vt(g) && S !== A ? c(n, "dd.MM.yyyy", g) : v.format(n);
    }
    return c(n, l, g);
  }
  function u(n) {
    if (!n) return "";
    const l = n.getFullYear(), g = String(n.getMonth() + 1).padStart(2, "0"), E = String(n.getDate()).padStart(2, "0");
    return l + "-" + g + "-" + E;
  }
  function f(n, l, g) {
    L(n.dom, "ln-date:change", {
      value: l,
      formatted: n.dom.value,
      date: g
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function p(n, l, g, E) {
    n._setHiddenRaw(l), w.set.call(n._picker, l), n._lastISO = l, E !== void 0 ? (n._isFormatting = !0, n.dom.value = E, n._isFormatting = !1) : g && n._displayFormatted(g), f(n, l, g);
  }
  function _(n) {
    n._setHiddenRaw(""), w.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", f(n, "", null);
  }
  r.prototype._initTextElement = function() {
    const n = this.dom;
    let l = n.getAttribute("data-ln-value"), g = n.getAttribute("data-ln-date"), E = n.getAttribute("datetime"), v = null;
    l !== null && l !== "" ? v = l : E !== null && E !== "" ? v = E : g !== null && g !== "" && g !== "true" && !m.test(g) ? v = g : v = n.textContent.trim();
    let A = i(v) || t(v);
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
  }, r.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = i(this._rawValue);
      if (n) {
        let g = this.dom.getAttribute("data-ln-date-format");
        if (!g) {
          const v = this.dom.getAttribute("data-ln-date");
          v && m.test(v) && (g = v);
        }
        const E = W(this.dom);
        this.dom.textContent = s(n, g || "medium", E);
      }
    }
  };
  function r(n) {
    if (n[a]) return n[a];
    if (n[a] = this, this.dom = n, n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const l = this, g = n.value, E = n.name, A = (n.closest(".form-element, form") || n.parentNode).querySelectorAll("[data-ln-date-dict]");
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
          const R = i(k);
          R && p(l, k, R);
        } else k === "" && _(l);
      }
    }), ue(n, w, {
      get: function() {
        return w.get.call(n);
      },
      set: function(k, R) {
        if (l._isFormatting) {
          R(k);
          return;
        }
        if (!k || k === "") {
          R(""), _(l);
          return;
        }
        const N = i(k) || t(k);
        if (N) {
          const z = u(N), H = n.getAttribute(d) || "", U = W(n), K = s(N, H, U);
          R(K), p(l, z, N, K);
        } else
          R(String(k)), _(l);
      }
    }), this._onPickerChange = function() {
      const k = T.value;
      if (k) {
        const R = i(k);
        R && p(l, k, R);
      } else
        _(l);
    }, T.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const k = l.dom.value.trim();
      if (k === "") {
        l._lastISO !== "" && _(l);
        return;
      }
      if (l._lastISO) {
        const N = i(l._lastISO);
        if (N) {
          const z = l.dom.getAttribute(d) || "", H = W(l.dom);
          if (k === s(N, z, H)) return;
        }
      }
      const R = t(k);
      if (R) {
        const N = u(R);
        p(l, N, R);
      } else if (l._lastISO) {
        const N = i(l._lastISO);
        N && l._displayFormatted(N);
      } else
        l.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      l._openPicker();
    }, x.addEventListener("click", this._onBtnClick), g && g !== "") {
      const k = i(g);
      k && p(l, g, k);
    }
    return this;
  }
  function i(n) {
    if (!n || typeof n != "string") return null;
    const l = n.split("T"), g = l[0].split("-");
    if (g.length < 3) return null;
    const E = parseInt(g[0], 10), v = parseInt(g[1], 10) - 1, A = parseInt(g[2], 10);
    if (isNaN(E) || isNaN(v) || isNaN(A)) return null;
    let S = 0, q = 0;
    if (l[1]) {
      const x = l[1].split(":");
      S = parseInt(x[0], 10) || 0, q = parseInt(x[1], 10) || 0;
    }
    const T = new Date(E, v, A, S, q);
    return T.getFullYear() !== E || T.getMonth() !== v || T.getDate() !== A ? null : T;
  }
  function t(n) {
    if (!n || typeof n != "string" || (n = n.trim(), n.length < 6)) return null;
    let l, g;
    if (n.indexOf(".") !== -1)
      l = ".", g = n.split(".");
    else if (n.indexOf("/") !== -1)
      l = "/", g = n.split("/");
    else if (n.indexOf("-") !== -1)
      l = "-", g = n.split("-");
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
    l === "." ? (v = E[0], A = E[1], S = E[2]) : l === "/" ? (A = E[0], v = E[1], S = E[2]) : g[0].length === 4 ? (S = E[0], A = E[1], v = E[2]) : (v = E[0], A = E[1], S = E[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
    const q = new Date(S, A - 1, v);
    return q.getFullYear() !== S || q.getMonth() !== A - 1 || q.getDate() !== v ? null : q;
  }
  r.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, r.prototype._setHiddenRaw = function(n) {
    w.set.call(this._hidden, n);
  }, r.prototype._displayFormatted = function(n) {
    const l = this.dom.getAttribute(d) || "", g = W(this.dom);
    this._isFormatting = !0, this.dom.value = s(n, l, g), this._isFormatting = !1;
  }, Object.defineProperty(r.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : w.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const g = i(n) || t(n);
        if (!g) return;
        const E = u(g);
        this._rawValue = E, this.dom.setAttribute("data-ln-value", E), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        _(this);
        return;
      }
      const l = i(n);
      l && p(this, n, l);
    }
  }), Object.defineProperty(r.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? i(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = u(n);
    }
  }), Object.defineProperty(r.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), r.prototype.destroy = function() {
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
      const n = document.querySelectorAll("[" + d + "]");
      for (let l = 0; l < n.length; l++) {
        const g = n[l][a];
        if (g) {
          if (g.isTextElement)
            g._formatTextContent();
          else if (g.value) {
            const E = i(g.value);
            E && g._displayFormatted(E);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(d, a, r, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(n) {
      const l = n[a];
      if (l) {
        if (l.isTextElement)
          l._initTextElement();
        else if (l.value) {
          const g = i(l.value);
          g && l._displayFormatted(g);
        }
      }
    }
  }), e();
})();
(function() {
  const d = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const y = [];
  if (!history._lnNavPatched) {
    const h = history.pushState;
    history.pushState = function() {
      h.apply(history, arguments);
      for (const o of y)
        o();
    }, history._lnNavPatched = !0;
  }
  function w(h) {
    return this.dom = h, this.activeClass = h.getAttribute(d) || "active", this.exact = h.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), y.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(h, { childList: !0, subtree: !0 }), this.update(), this;
  }
  w.prototype.update = function() {
    if (!this.activeClass || Q(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const o = Array.from(this.dom.querySelectorAll("a")), c = window.location.pathname, s = b(c);
    for (const u of o) {
      const f = u.getAttribute("href");
      if (!f || f === "#" || f.startsWith("#") || f.startsWith("javascript:") || f.startsWith("mailto:") || f.startsWith("tel:")) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      if (u.hostname && u.hostname !== window.location.hostname) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      const p = b(f), _ = p === s, r = !this.exact && p !== "/" && s.startsWith(p + "/");
      _ || r ? (u.classList.add(this.activeClass), u.setAttribute("aria-current", "page")) : (u.classList.remove(this.activeClass), u.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom });
  }, w.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const h = y.indexOf(this.updateHandler);
    h !== -1 && y.splice(h, 1), L(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function b(h) {
    try {
      return new URL(h, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return h.replace(/\/$/, "") || "/";
    }
  }
  function m(h, o) {
    const c = h[a];
    if (c) {
      if (o === d) {
        if (!h.hasAttribute(d)) {
          c.destroy();
          return;
        }
        const s = c.activeClass, u = h.getAttribute(d) || "active";
        if (s !== u) {
          const f = h.querySelectorAll("a");
          for (const p of f)
            s && p.classList.remove(s);
          c.activeClass = u;
        }
      } else o === "data-ln-nav-exact" && (c.exact = h.hasAttribute("data-ln-nav-exact"));
      c.update();
    }
  }
  B(d, a, w, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: m
  });
})();
(function() {
  const d = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function y(m, h) {
    const o = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (o) return o;
    if (m.tagName !== "A") return "";
    const c = m.getAttribute("href") || "";
    if (!c.startsWith("#")) return "";
    const s = c.slice(1);
    if (!s) return "";
    const u = s.split("&");
    if (h)
      for (const _ of u) {
        const r = _.indexOf(":");
        if (r > 0 && _.slice(0, r).toLowerCase().trim() === h)
          return _.slice(r + 1).toLowerCase().trim();
      }
    const f = u[u.length - 1] || "", p = f.indexOf(":");
    return (p > 0 ? f.slice(p + 1) : f).toLowerCase().trim();
  }
  function w(m) {
    return this.dom = m, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((c) => c.tagName === "A" && (c.getAttribute("href") || "").startsWith("#")), h = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = h && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : h && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const c of this.tabs) {
      const s = y(c, this.nsKey);
      s ? this.mapTabs[s] = c : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', c);
    }
    for (const c of this.panels) {
      const s = (c.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      s && (this.mapPanels[s] = c);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const o = this;
    this._clickHandlers = [];
    for (const c of this.tabs) {
      if (c[a + "Trigger"]) continue;
      const s = function(u) {
        const f = c.tagName === "A";
        if (!f && (u.ctrlKey || u.metaKey || u.button === 1)) return;
        const p = y(c, o.nsKey);
        p && (f && !Gt(u) || (o.hashEnabled ? Z(o.nsKey) === p ? o.dom.setAttribute("data-ln-tabs-active", p) : J(o.nsKey, p) : o.dom.setAttribute("data-ln-tabs-active", p)));
      };
      c.addEventListener("click", s), c[a + "Trigger"] = s, o._clickHandlers.push({ el: c, handler: s });
    }
    if (this._onRequestSelect = function(c) {
      const s = c.detail && (c.detail.key || c.detail.tab);
      s && o.dom.setAttribute("data-ln-tabs-active", (s + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const c = Z(o.nsKey);
      o.dom.setAttribute("data-ln-tabs-active", c !== null ? c : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let c = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const s = kt("tabs", this.dom);
        s !== null && s in this.mapPanels && (c = s);
      }
      this.dom.setAttribute("data-ln-tabs-active", c);
    }
  }
  w.prototype._applyActive = function(m) {
    var h;
    (!m || !(m in this.mapPanels)) && (m = this.defaultKey);
    for (const o in this.mapTabs) {
      const c = this.mapTabs[o];
      o === m ? (c.setAttribute("data-active", ""), c.setAttribute("aria-selected", "true")) : (c.removeAttribute("data-active"), c.setAttribute("aria-selected", "false"));
    }
    for (const o in this.mapPanels) {
      const c = this.mapPanels[o], s = o === m;
      c.classList.toggle("hidden", !s), c.setAttribute("aria-hidden", s ? "false" : "true");
    }
    if (this.autoFocus) {
      const o = (h = this.mapPanels[m]) == null ? void 0 : h.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      o && setTimeout(() => o.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", { key: m, tab: this.mapTabs[m], panel: this.mapPanels[m] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && ut("tabs", this.dom, m);
  }, w.prototype.destroy = function() {
    if (this.dom[a]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: m, handler: h } of this._clickHandlers)
        m.removeEventListener("click", h), delete m[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), L(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, B(d, a, w, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const h = m.getAttribute("data-ln-tabs-active");
      m[a]._applyActive(h);
    }
  });
})();
(function() {
  const d = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function y(m, h) {
    const o = document.querySelectorAll(
      '[data-ln-toggle-for="' + m.id + '"]'
    );
    for (const c of o)
      c.setAttribute("aria-expanded", h ? "true" : "false");
  }
  function w(m) {
    this.dom = m;
    const h = this;
    if (this._onRequestOpen = function() {
      h.open();
    }, this._onRequestClose = function() {
      h.close();
    }, this._onRequestToggle = function() {
      h.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.hasAttribute("data-ln-persist")) {
      const o = kt("toggle", m);
      o !== null && m.setAttribute(d, o);
    }
    return this.isOpen = m.getAttribute(d) === "open", this.isOpen && m.classList.add("open"), y(m, this.isOpen), this;
  }
  w.prototype.open = function() {
    this.dom.setAttribute(d, "open");
  }, w.prototype.close = function() {
    this.dom.setAttribute(d, "close");
  }, w.prototype.toggle = function() {
    const m = this.dom.getAttribute(d);
    this.dom.setAttribute(d, m === "open" ? "close" : "open");
  }, w.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), L(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function b(m) {
    const h = m[a];
    if (!h) return;
    const c = m.getAttribute(d) === "open";
    if (c !== h.isOpen)
      if (c) {
        if (Q(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(d, "close");
          return;
        }
        h.isOpen = !0, m.classList.add("open"), y(m, !0), L(m, "ln-toggle:open", { target: m }), m.hasAttribute("data-ln-persist") && ut("toggle", m, "open");
      } else {
        if (Q(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(d, "open");
          return;
        }
        h.isOpen = !1, m.classList.remove("open"), y(m, !1), L(m, "ln-toggle:close", { target: m }), m.hasAttribute("data-ln-persist") && ut("toggle", m, "close");
      }
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const h = m.target.closest("[data-ln-toggle-for]");
    if (h) {
      const o = h.getAttribute("data-ln-toggle-for"), c = document.getElementById(o);
      if (c && c[a]) {
        m.preventDefault();
        const s = h.getAttribute("data-ln-toggle-action") || "toggle";
        if (s === "open")
          c.setAttribute(d, "open");
        else if (s === "close")
          c.setAttribute(d, "close");
        else if (s === "toggle") {
          const u = c.getAttribute(d);
          c.setAttribute(d, u === "open" ? "close" : "open");
        }
      }
    }
  }), B(d, a, w, "ln-toggle", {
    onAttributeChange: b
  });
})();
(function() {
  const d = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function y(w) {
    return this.dom = w, this._onToggleOpen = function(b) {
      if (b.detail.target.closest("[data-ln-accordion]") !== w) return;
      const m = w.querySelectorAll("[data-ln-toggle]");
      for (const h of m)
        h !== b.detail.target && h.closest("[data-ln-accordion]") === w && h.getAttribute("data-ln-toggle") === "open" && h.setAttribute("data-ln-toggle", "close");
      L(w, "ln-accordion:change", { target: b.detail.target });
    }, w.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(d, a, y, "ln-accordion");
})();
(function() {
  const d = "data-ln-dropdown", a = "lnDropdown", y = "data-ln-dropdown-position", w = "data-ln-dropdown-placement", b = "bottom-end";
  if (window[a] !== void 0) return;
  function m(h) {
    this.dom = h, this.toggleEl = h.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = h.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const o = this;
    return this._onRequestOpen = function() {
      o.toggleEl && o.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      o.toggleEl && o.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (o.toggleEl) {
        const c = o.toggleEl.getAttribute("data-ln-toggle");
        o.toggleEl.setAttribute("data-ln-toggle", c === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(c) {
      const s = o.toggleEl && o.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (c.key === "Escape") {
        s && (c.preventDefault(), c.stopPropagation(), o.toggleEl.setAttribute("data-ln-toggle", "close"), o.triggerBtn && o.triggerBtn.focus());
        return;
      }
      if (c.key === "Tab") {
        s && (o.triggerBtn && o.triggerBtn.focus(), o.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const u = o._getMenuItems();
      if (u.length === 0) return;
      if (!s && (c.key === "ArrowDown" || c.key === "ArrowUp")) {
        c.preventDefault(), o.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const p = o._getMenuItems();
          p.length > 0 && o._focusItem(p, c.key === "ArrowDown" ? 0 : p.length - 1);
        }, 0);
        return;
      }
      if (!s) return;
      const f = u.indexOf(document.activeElement);
      if (c.key === "ArrowDown") {
        c.preventDefault();
        const p = f < u.length - 1 ? f + 1 : 0;
        o._focusItem(u, p);
      } else if (c.key === "ArrowUp") {
        c.preventDefault();
        const p = f > 0 ? f - 1 : u.length - 1;
        o._focusItem(u, p);
      } else c.key === "Home" ? (c.preventDefault(), o._focusItem(u, 0)) : c.key === "End" && (c.preventDefault(), o._focusItem(u, u.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(c) {
      !c.detail || c.detail.target !== o.toggleEl || (o.triggerBtn && o.triggerBtn.setAttribute("aria-expanded", "true"), typeof o.toggleEl.showPopover == "function" && o.toggleEl.showPopover(), o._initMenuAria(), o._reposition(), o._addOutsideClickListener(), o._addScrollRepositionListener(), o._addResizeCloseListener(), L(h, "ln-dropdown:open", { target: c.detail.target }));
    }, this._onToggleClose = function(c) {
      !c.detail || c.detail.target !== o.toggleEl || (o.triggerBtn && o.triggerBtn.setAttribute("aria-expanded", "false"), o._removeOutsideClickListener(), o._removeScrollRepositionListener(), o._removeResizeCloseListener(), o.toggleEl.style.top = "", o.toggleEl.style.left = "", o.toggleEl.removeAttribute(w), typeof o.toggleEl.hidePopover == "function" && o.toggleEl.matches(":popover-open") && o.toggleEl.hidePopover(), L(h, "ln-dropdown:close", { target: c.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  m.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const h = this.toggleEl.querySelectorAll("li");
    for (const c of h)
      c.setAttribute("role", "none");
    const o = this._getMenuItems();
    for (let c = 0; c < o.length; c++)
      o[c].setAttribute("role", "menuitem"), o[c].setAttribute("tabindex", c === 0 ? "0" : "-1");
  }, m.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, m.prototype._focusItem = function(h, o) {
    for (let c = 0; c < h.length; c++)
      h[c].setAttribute("tabindex", c === o ? "0" : "-1");
    h[o] && h[o].focus();
  }, m.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const h = this.triggerBtn.getBoundingClientRect(), o = Bt(this.toggleEl), c = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, s = this.dom.getAttribute(y) || b, u = Tt(h, o, s, c);
    this.toggleEl.style.top = u.top + "px", this.toggleEl.style.left = u.left + "px", this.toggleEl.setAttribute(w, u.placement);
  }, m.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const h = this;
    this._boundDocClick = function(o) {
      h.dom.contains(o.target) || h.toggleEl && h.toggleEl.contains(o.target) || h.toggleEl && h.toggleEl.getAttribute("data-ln-toggle") === "open" && h.toggleEl.setAttribute("data-ln-toggle", "close");
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
    this.dom[a] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute(w), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), L(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(d, a, m, "ln-dropdown");
})();
(function() {
  const d = "data-ln-popover", a = "lnPopover", y = "data-ln-popover-for", w = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const b = [];
  let m = null;
  function h() {
    m || (m = function(u) {
      if (u.key !== "Escape" || b.length === 0) return;
      b[b.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function o() {
    b.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function c(u) {
    this.dom = u, this.isOpen = u.getAttribute(d) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const f = this;
    return this._onRequestOpen = function(p) {
      const _ = p.detail && p.detail.trigger ? p.detail.trigger : null;
      f.open(_);
    }, this._onRequestClose = function() {
      f.close();
    }, this._onRequestToggle = function(p) {
      const _ = p.detail && p.detail.trigger ? p.detail.trigger : null;
      f.toggle(_);
    }, u.addEventListener("ln-popover:request-open", this._onRequestOpen), u.addEventListener("ln-popover:request-close", this._onRequestClose), u.addEventListener("ln-popover:request-toggle", this._onRequestToggle), u.hasAttribute("tabindex") || u.setAttribute("tabindex", "-1"), u.hasAttribute("role") || u.setAttribute("role", "dialog"), u.hasAttribute("popover") || u.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  c.prototype.open = function(u) {
    this.isOpen || (this.trigger = u || null, this.dom.setAttribute(d, "open"));
  }, c.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(d, "closed");
  }, c.prototype.toggle = function(u) {
    this.isOpen ? this.close() : this.open(u);
  }, c.prototype._applyOpen = function(u) {
    this.isOpen = !0, u && (this.trigger = u), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const f = Bt(this.dom);
    if (this.trigger) {
      const i = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(w) || "bottom", e = Tt(i, f, t, 8);
      this.dom.style.top = e.top + "px", this.dom.style.left = e.left + "px", this.dom.setAttribute("data-ln-popover-placement", e.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const p = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), _ = Array.prototype.find.call(p, Ct);
    _ ? _.focus() : this.dom.focus();
    const r = this;
    this._boundDocClick = function(i) {
      r.dom.contains(i.target) || r.trigger && r.trigger.contains(i.target) || r.close();
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!r.trigger) return;
      const i = r.trigger.getBoundingClientRect(), t = Bt(r.dom), e = r.dom.getAttribute(w) || "bottom", n = Tt(i, t, e, 8);
      r.dom.style.top = n.top + "px", r.dom.style.left = n.left + "px", r.dom.setAttribute("data-ln-popover-placement", n.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), b.push(this), h(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, c.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const u = b.indexOf(this);
    u !== -1 && b.splice(u, 1), o(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, c.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[a], L(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function s(u) {
    this.dom = u;
    const f = u.getAttribute(y);
    return u.setAttribute("aria-haspopup", "dialog"), u.setAttribute("aria-expanded", "false"), u.setAttribute("aria-controls", f), this._onClick = function(p) {
      if (p.ctrlKey || p.metaKey || p.button === 1) return;
      p.preventDefault();
      const _ = document.getElementById(f);
      if (!_) return;
      _[a] && (_[a].trigger = u);
      const r = _.getAttribute(d);
      _.setAttribute(d, r === "open" ? "closed" : "open");
    }, u.addEventListener("click", this._onClick), this;
  }
  s.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, B(d, a, c, "ln-popover", {
    onAttributeChange: function(u) {
      const f = u[a];
      if (!f) return;
      const _ = u.getAttribute(d) === "open";
      if (_ !== f.isOpen)
        if (_) {
          if (Q(u, "ln-popover:before-open", {
            popoverId: u.id,
            target: u,
            trigger: f.trigger
          }).defaultPrevented) {
            u.setAttribute(d, "closed");
            return;
          }
          f._applyOpen(f.trigger);
        } else {
          if (Q(u, "ln-popover:before-close", {
            popoverId: u.id,
            target: u,
            trigger: f.trigger
          }).defaultPrevented) {
            u.setAttribute(d, "open");
            return;
          }
          f._applyClose();
        }
    }
  }), B(y, a + "Trigger", s, "ln-popover-trigger");
})();
(function() {
  const d = "data-ln-tooltip-enhance", a = "data-ln-tooltip", y = "data-ln-tooltip-position", w = "lnTooltipEnhance", b = "ln-tooltip-portal";
  if (window[w] !== void 0) return;
  let m = 0, h = null, o = null, c = null, s = null, u = null, f = null;
  function p() {
    return h && h.parentNode || (h = document.getElementById(b), h || (h = document.createElement("div"), h.id = b, document.body.appendChild(h)), h.hasAttribute("popover") || h.setAttribute("popover", "manual")), h;
  }
  function _() {
    f || (f = function(n) {
      n.key === "Escape" && t();
    }, document.addEventListener("keydown", f));
  }
  function r() {
    f && (document.removeEventListener("keydown", f), f = null);
  }
  function i(n) {
    if (c === n) return;
    t();
    const l = n.getAttribute(a) || n.getAttribute("title");
    if (!l) return;
    p(), typeof h.showPopover == "function" && h.showPopover(), n.hasAttribute("title") && (s = n.getAttribute("title"), n.removeAttribute("title"));
    const g = n.getAttribute("aria-describedby");
    g ? u = g : u = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = l, n[w + "Uid"] || (m += 1, n[w + "Uid"] = "ln-tooltip-" + m), E.id = n[w + "Uid"], h.appendChild(E);
    const v = E.offsetWidth, A = E.offsetHeight, S = n.getBoundingClientRect(), q = n.getAttribute(y) || "top", T = Tt(S, { width: v, height: A }, q, 6);
    E.style.top = T.top + "px", E.style.left = T.left + "px", E.setAttribute("data-ln-tooltip-placement", T.placement), u ? n.setAttribute("aria-describedby", u + " " + E.id) : n.setAttribute("aria-describedby", E.id), o = E, c = n, _();
  }
  function t() {
    if (!o) {
      r();
      return;
    }
    c && (u !== null ? c.setAttribute("aria-describedby", u) : c.removeAttribute("aria-describedby"), u = null, s !== null && c.setAttribute("title", s)), s = null, o.parentNode && o.parentNode.removeChild(o), o = null, c = null, h && typeof h.hidePopover == "function" && h.matches(":popover-open") && h.hidePopover(), r();
  }
  function e(n) {
    return this.dom = n, n.hasAttribute("data-ln-tooltip-enhanced") || (n.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      i(n);
    }, this._onLeave = function() {
      c === n && !n.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      i(n);
    }, this._onBlur = function() {
      c === n && !n.matches(":hover") && t();
    }, n.addEventListener("mouseenter", this._onEnter), n.addEventListener("mouseleave", this._onLeave), n.addEventListener("focus", this._onFocus, !0), n.addEventListener("blur", this._onBlur, !0), this;
  }
  e.prototype.destroy = function() {
    const n = this.dom;
    n.removeEventListener("mouseenter", this._onEnter), n.removeEventListener("mouseleave", this._onLeave), n.removeEventListener("focus", this._onFocus, !0), n.removeEventListener("blur", this._onBlur, !0), c === n && t(), this._addedEnhancedAttr && n.removeAttribute("data-ln-tooltip-enhanced"), delete n[w], delete n[w + "Uid"], L(n, "ln-tooltip:destroyed", { trigger: n });
  }, B(
    "[" + d + "], [data-ln-tooltip-enhanced], [" + a + "][title]",
    w,
    e,
    "ln-tooltip"
  );
})();
(function() {
  const d = "data-ln-toast", a = "lnToast", y = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
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
  function m(i) {
    if (!i || i.nodeType !== 1) return;
    const t = Array.from(i.querySelectorAll("[" + d + "]"));
    i.hasAttribute && i.hasAttribute(d) && t.push(i);
    for (const e of t)
      e[a] || new h(e);
  }
  function h(i) {
    this.dom = i, i[a] = this, this.timeoutDefault = parseInt(i.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(i.getAttribute("data-ln-toast-max") || "5", 10);
    const t = Array.from(i.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length > this.max; ) i.removeChild(t.shift());
    for (const e of t) p(e, this);
    return t.length > 0 && w(i), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        u(i);
      b(this.dom), delete this.dom[a];
    }
  };
  function o(i, t) {
    const e = ((i.type || "") + "").trim().toLowerCase(), n = ct(t, y, "ln-toast");
    if (!n)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    nt(n, {
      type: e,
      title: i.title,
      message: typeof i.message == "string" ? i.message : void 0
    });
    const l = n.firstElementChild;
    if (!l) return null;
    l.hasAttribute("data-ln-toast-item") || l.setAttribute("data-ln-toast-item", ""), l.classList.add("ln-enter");
    const g = l.querySelector(".body");
    g && c(g, i);
    const E = l.querySelector("[data-ln-toast-close]");
    return E && E.addEventListener("click", function() {
      u(l);
    }), l;
  }
  function c(i, t) {
    if (Array.isArray(t.message)) {
      const e = document.createElement("ul");
      for (const n of t.message) {
        const l = document.createElement("li");
        l.textContent = n, e.appendChild(l);
      }
      i.appendChild(e);
    }
    if (t.data && t.data.errors) {
      const e = document.createElement("ul");
      for (const n of Object.values(t.data.errors).flat()) {
        const l = document.createElement("li");
        l.textContent = n, e.appendChild(l);
      }
      i.appendChild(e);
    }
  }
  function s(i, t) {
    const e = Array.from(i.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; e.length >= i.max && e.length > 0; ) i.dom.removeChild(e.shift());
    i.dom.appendChild(t), w(i.dom), requestAnimationFrame(() => t.classList.remove("ln-enter"));
  }
  function u(i) {
    if (!i || !i.parentNode) return;
    const t = i.parentNode;
    clearTimeout(i._timer), i.classList.remove("ln-enter"), i.classList.add("ln-out"), setTimeout(() => {
      i.parentNode && (i.parentNode.removeChild(i), b(t));
    }, 200);
  }
  function f(i) {
    let t = i && i.container;
    return typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), t || null;
  }
  function p(i, t) {
    if (i._lnToastHydrated) return;
    i._lnToastHydrated = !0;
    const e = i.querySelector("[data-ln-toast-close]");
    e && e.addEventListener("click", function() {
      u(i);
    });
    const n = i.getAttribute("data-ln-toast-timeout"), l = n !== null ? parseInt(n, 10) : NaN, g = Number.isFinite(l) ? l : t.timeoutDefault;
    g > 0 && (i._timer = setTimeout(function() {
      u(i);
    }, g));
  }
  function _(i) {
    const t = i.detail || {}, e = f(t);
    if (!e) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const n = e[a] || new h(e), l = o(t, e);
    if (!l) return;
    const g = Number.isFinite(t.timeout) ? t.timeout : n.timeoutDefault;
    s(n, l), g > 0 && (l._timer = setTimeout(() => u(l), g));
  }
  function r(i) {
    const t = i && i.detail || {};
    if (t.container) {
      const e = f(t);
      if (e)
        for (const n of Array.from(e.querySelectorAll("[data-ln-toast-item]"))) u(n);
    } else {
      const e = document.querySelectorAll("[" + d + "]");
      for (const n of Array.from(e))
        for (const l of Array.from(n.querySelectorAll("[data-ln-toast-item]"))) u(l);
    }
  }
  lt(function() {
    window.addEventListener("ln-toast:enqueue", _), window.addEventListener("ln-toast:clear", r), window.addEventListener("ln-modal:open", function() {
      const t = document.querySelectorAll("[" + d + "]");
      for (const e of Array.from(t))
        e.querySelectorAll("[data-ln-toast-item]").length > 0 && w(e);
    }), new MutationObserver(function(t) {
      for (const e of t) {
        if (e.type === "attributes") {
          m(e.target);
          continue;
        }
        for (const n of e.addedNodes)
          m(n);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] }), m(document.body);
  }, "ln-toast");
})();
(function() {
  const d = "data-ln-upload", a = "lnUpload", y = "data-ln-upload-dict", w = "data-ln-upload-accept", b = "data-ln-upload-delete", m = "data-ln-upload-max-size", h = "data-ln-upload-max-files", o = "data-ln-upload-file-field", c = "data-ln-upload-ids-field", s = "file", u = "file_ids[]";
  if (window[a] !== void 0) return;
  function f(e) {
    return e ? e.split(",").map(function(n) {
      return n.trim().toLowerCase();
    }).filter(Boolean).map(function(n) {
      return n.startsWith(".") ? n.slice(1) : n;
    }) : null;
  }
  function p(e) {
    return !e || !e.includes(".") ? "" : e.split(".").pop().toLowerCase();
  }
  function _(e, n) {
    if (!n || n.length === 0) return !0;
    const l = p(e.name), g = (e.type || "").toLowerCase();
    return n.some(function(E) {
      if (E.includes("/")) {
        if (E.endsWith("/*")) {
          const v = E.slice(0, -1);
          return g.startsWith(v);
        }
        return g === E;
      }
      return l === E;
    });
  }
  function r(e, n, l) {
    if (typeof e != "number" || isNaN(e) || e === 0)
      return "0 " + (l["unit-b"] || "B");
    const g = 1024, E = [
      l["unit-b"] || "B",
      l["unit-kb"] || "KB",
      l["unit-mb"] || "MB",
      l["unit-gb"] || "GB"
    ], v = Math.floor(Math.log(e) / Math.log(g)), A = Math.min(v, E.length - 1), S = e / Math.pow(g, A);
    return new Intl.NumberFormat(n, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0
    }).format(S) + " " + E[A];
  }
  function i() {
    const e = document.querySelector('meta[name="csrf-token"]');
    return e ? e.getAttribute("content") : "";
  }
  function t(e) {
    this.dom = e, this.dict = xt(e, y), this.locale = W(e), this.zone = e.querySelector("[data-ln-upload-zone]") || e, this.list = e.querySelector("[data-ln-upload-list]"), this.input = e.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', e), this.uploadUrl = e.getAttribute(d) || "", this.deleteUrlPattern = e.getAttribute(b) || "", this.fileFieldName = e.getAttribute(o) || s, this.idsFieldName = e.getAttribute(c) || u, this.maxSize = parseInt(e.getAttribute(m), 10) || 0, this.maxFiles = parseInt(e.getAttribute(h), 10) || 0;
    const n = e.getAttribute(w) || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = f(n), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
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
    const l = this.dom.querySelectorAll('input[type="hidden"]');
    for (let g = 0; g < l.length; g++) {
      const E = l[g];
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
    for (let l = 0; l < n.length; l++)
      n[l].name === e.idsFieldName && n[l].remove();
    for (const [, l] of this.uploadedFiles)
      if (l.serverId) {
        const g = document.createElement("input");
        g.type = "hidden", g.name = e.idsFieldName, g.value = l.serverId, e.dom.appendChild(g);
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
      const l = n.target.closest('[data-ln-upload-action="remove"]');
      if (!l || !e.list || !e.list.contains(l) || l.disabled) return;
      const g = l.closest("[data-ln-upload-item]");
      if (g) {
        const E = g.getAttribute("data-ln-upload-local-id");
        E && e.remove(E);
      }
    }, this._onRequestUpload = function(n) {
      n.detail && n.detail.files && e.upload(n.detail.files);
    }, this._onRequestRemove = function(n) {
      if (n.detail) {
        const l = n.detail.localId !== void 0 ? n.detail.localId : n.detail.serverId;
        l !== void 0 && e.remove(l);
      }
    }, this._onRequestClear = function() {
      e.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, t.prototype.upload = function(e) {
    const n = this, l = Array.from(e);
    for (let g = 0; g < l.length; g++) {
      const E = l[g];
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
      Q(n.dom, "ln-upload:before-upload", { file: E }).defaultPrevented || n._uploadSingleFile(E);
    }
  }, t.prototype._uploadSingleFile = function(e) {
    const n = this, l = "file-" + ++n.fileIdCounter, g = p(e.name);
    let E = null;
    if (this.list) {
      const T = ct(this.dom, "ln-upload-item", "ln-upload");
      if (T && (E = T.firstElementChild, E)) {
        E.setAttribute("data-ln-upload-item", ""), E.setAttribute("data-ln-upload-local-id", l), E.setAttribute("data-ln-upload-ext", g), E.setAttribute("data-ln-upload-state", "uploading"), nt(E, {
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
    n.uploadedFiles.set(l, {
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
          localId: l,
          file: e,
          percent: x,
          loaded: T.loaded,
          total: T.total
        });
      }
    }), S.addEventListener("load", function() {
      const T = n.uploadedFiles.get(l);
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
            sizeText: r(x.size || e.size, n.locale, n.dict),
            uploading: !1
          });
          const R = E.querySelector('[data-ln-upload-action="remove"]');
          R && (R.disabled = !1);
        }
        T && (T.serverId = k, T.size = x.size || e.size, T.name = x.name || e.name), n._syncHiddenInputs(), L(n.dom, "ln-upload:uploaded", {
          localId: l,
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
      const T = n.uploadedFiles.get(l);
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
    n.uploadUrl ? (S.open("POST", n.uploadUrl), S.setRequestHeader("X-CSRF-TOKEN", i()), S.setRequestHeader("X-Requested-With", "XMLHttpRequest"), S.setRequestHeader("Accept", "application/json"), S.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, t.prototype.remove = function(e) {
    const n = this;
    let l = null, g = null;
    if (n.uploadedFiles.has(e))
      l = e, g = n.uploadedFiles.get(e);
    else
      for (const [S, q] of n.uploadedFiles)
        if (String(q.serverId) === String(e)) {
          l = S, g = q;
          break;
        }
    if (!l || !g || Q(n.dom, "ln-upload:before-remove", {
      localId: l,
      serverId: g.serverId
    }).defaultPrevented) return;
    const v = n.list ? n.list.querySelector('[data-ln-upload-local-id="' + l + '"]') : null;
    if (g.xhr && typeof g.xhr.abort == "function" && g.xhr.abort(), !g.serverId) {
      v && v.remove(), n.uploadedFiles.delete(l), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", { localId: l, serverId: null });
      return;
    }
    let A = null;
    if (n.deleteUrlPattern ? A = n.deleteUrlPattern.replace("{id}", encodeURIComponent(g.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (A = n.uploadUrl.replace("{id}", encodeURIComponent(g.serverId))), !A) {
      v && v.remove(), n.uploadedFiles.delete(l), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", { localId: l, serverId: g.serverId });
      return;
    }
    v && (v.setAttribute("data-ln-upload-state", "deleting"), nt(v, { deleting: !0 })), fetch(A, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": i(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(S) {
      S.ok ? (v && v.remove(), n.uploadedFiles.delete(l), n._syncHiddenInputs(), L(n.dom, "ln-upload:removed", {
        localId: l,
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
    if (!Q(e.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, l] of this.uploadedFiles)
        if (l.xhr && typeof l.xhr.abort == "function" && l.xhr.abort(), l.serverId) {
          let g = null;
          e.deleteUrlPattern ? g = e.deleteUrlPattern.replace("{id}", encodeURIComponent(l.serverId)) : e.uploadUrl && e.uploadUrl.includes("{id}") && (g = e.uploadUrl.replace("{id}", encodeURIComponent(l.serverId))), g && fetch(g, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": i(),
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
  }, B(d, a, t, "ln-upload");
})();
(function() {
  const d = "lnExternalLinks";
  if (window[d] !== void 0) return;
  function a(o) {
    return o.hostname && o.hostname !== window.location.hostname;
  }
  function y(o) {
    if (o.getAttribute("data-ln-external-link") === "processed" || !a(o)) return;
    o.target = "_blank";
    const c = (o.rel || "").split(/\s+/).filter(Boolean);
    c.includes("noopener") || c.push("noopener"), c.includes("noreferrer") || c.push("noreferrer"), o.rel = c.join(" ");
    const s = document.createElement("span");
    s.className = "sr-only", s.textContent = "(opens in new tab)", o.appendChild(s), o.setAttribute("data-ln-external-link", "processed"), L(o, "ln-external-links:processed", {
      link: o,
      href: o.href
    });
  }
  function w(o) {
    o = o || document.body;
    for (const c of o.querySelectorAll("a, area"))
      y(c);
  }
  function b() {
    lt(function() {
      document.body.addEventListener("click", function(o) {
        const c = o.target.closest("a, area");
        c && c.getAttribute("data-ln-external-link") === "processed" && L(c, "ln-external-links:clicked", {
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
        for (const s of c) {
          if (s.type === "childList") {
            for (const u of s.addedNodes)
              if (u.nodeType === 1 && (u.matches && (u.matches("a") || u.matches("area")) && y(u), u.querySelectorAll))
                for (const f of u.querySelectorAll("a, area"))
                  y(f);
          }
          if (s.type === "attributes" && s.attributeName === "href") {
            const u = s.target;
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
    b(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      w();
    }) : w();
  }
  window[d] = {
    process: w
  }, h();
})();
(function() {
  const d = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let y = null;
  function w() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function b(e) {
    y && (y.textContent = e, y.classList.add("ln-link-status--visible"));
  }
  function m() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function h(e, n) {
    if (n.target.closest("a, button, input, select, textarea")) return;
    const l = e.querySelector("a");
    if (!l) return;
    const g = l.getAttribute("href");
    if (!g) return;
    if (n.ctrlKey || n.metaKey || n.button === 1) {
      window.open(g, "_blank");
      return;
    }
    Q(e, "ln-link:navigate", { target: e, href: g, link: l }).defaultPrevented || l.click();
  }
  function o(e) {
    const n = e.querySelector("a");
    if (!n) return;
    const l = n.getAttribute("href");
    l && b(l);
  }
  function c() {
    m();
  }
  function s(e) {
    e[a + "Row"] || !e.querySelector("a") || (e[a + "Row"] = !0, e._lnLinkClick = function(l) {
      h(e, l);
    }, e._lnLinkEnter = function() {
      o(e);
    }, e.addEventListener("click", e._lnLinkClick), e.addEventListener("mouseenter", e._lnLinkEnter), e.addEventListener("mouseleave", c));
  }
  function u(e) {
    e[a + "Row"] && (e._lnLinkClick && e.removeEventListener("click", e._lnLinkClick), e._lnLinkEnter && e.removeEventListener("mouseenter", e._lnLinkEnter), e.removeEventListener("mouseleave", c), delete e._lnLinkClick, delete e._lnLinkEnter, delete e[a + "Row"]);
  }
  function f(e) {
    if (!e[a + "Init"]) return;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const l = n === "TABLE" && e.querySelector("tbody") || e;
      for (const g of l.querySelectorAll("tr"))
        u(g);
    } else
      u(e);
    delete e[a + "Init"];
  }
  function p(e) {
    if (e[a + "Init"]) return;
    e[a + "Init"] = !0;
    const n = e.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const l = n === "TABLE" && e.querySelector("tbody") || e;
      for (const g of l.querySelectorAll("tr"))
        s(g);
    } else
      s(e);
  }
  function _(e) {
    e.hasAttribute && e.hasAttribute(d) && p(e);
    const n = e.querySelectorAll ? e.querySelectorAll("[" + d + "]") : [];
    for (const l of n)
      p(l);
  }
  function r() {
    lt(function() {
      new MutationObserver(function(n) {
        for (const l of n)
          if (l.type === "childList") {
            for (const g of l.addedNodes)
              if (g.nodeType === 1) {
                _(g);
                const E = g.closest("[" + d + "]");
                if (E)
                  if (g.tagName === "TR")
                    s(g);
                  else {
                    const v = E.tagName;
                    if (v === "TABLE" || v === "TBODY") {
                      const A = g.querySelectorAll ? g.querySelectorAll("tr") : [];
                      for (const S of A)
                        s(S);
                    }
                  }
              }
          } else l.type === "attributes" && (l.target.hasAttribute && l.target.hasAttribute(d) ? _(l.target) : f(l.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-link");
  }
  function i(e) {
    _(e);
  }
  window[a] = { init: i, destroy: f };
  function t() {
    w(), r(), i(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const d = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function y(h) {
    return this.dom = h, this._attrObserver = null, this._parentObserver = null, m.call(this), w.call(this), b.call(this), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function w() {
    const h = this, o = new MutationObserver(function(c) {
      for (const s of c)
        (s.attributeName === "data-ln-progress" || s.attributeName === "data-ln-progress-max") && m.call(h);
    });
    o.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = o;
  }
  function b() {
    const h = this, o = this.dom.parentElement;
    if (!o) return;
    const c = new MutationObserver(function(s) {
      for (const u of s)
        u.attributeName === "data-ln-progress-max" && m.call(h);
    });
    c.observe(o, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = c;
  }
  function m() {
    const h = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, o = this.dom.parentElement, s = (o && o.hasAttribute("data-ln-progress-max") ? parseFloat(o.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let u = s > 0 ? h / s * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100), this.dom.style.width = u + "%";
    const f = Math.max(0, Math.min(h, s));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(s)), this.dom.setAttribute("aria-valuenow", String(f)), L(this.dom, "ln-progress:change", { target: this.dom, value: h, max: s, percentage: u });
  }
  B(
    d,
    a,
    y,
    "ln-progress"
  );
})();
(function() {
  const d = "data-ln-filter", a = "lnFilter", y = "data-ln-filter-key", w = "data-ln-filter-value", b = "data-ln-filter-hide", m = "data-ln-filter-reset", h = "data-ln-filter-col", o = "data-ln-hash", c = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function s(i) {
    return i.hasAttribute(m) || i.getAttribute(w) === "";
  }
  function u(i) {
    const t = i.dom.querySelectorAll("[" + y + "]");
    let e = null;
    const n = [];
    for (let l = 0; l < t.length; l++) {
      const g = t[l];
      if (e || (e = g.getAttribute(y)), g.checked && !s(g)) {
        const E = g.getAttribute(w);
        E && n.push(E);
      }
    }
    return { key: e, values: n, targetId: i.targetId };
  }
  function f(i, t, e) {
    const n = i.querySelectorAll("[" + y + "]"), l = Array.isArray(e) && e.length > 0;
    for (let g = 0; g < n.length; g++) {
      const E = n[g];
      s(E) ? E.checked = !l : l && E.getAttribute(y) === t && e.indexOf(E.getAttribute(w)) !== -1 ? E.checked = !0 : E.checked = !1;
    }
  }
  function p(i, t) {
    if (i.length !== t.length) return !0;
    for (let e = 0; e < i.length; e++) if (i[e] !== t[e]) return !0;
    return !1;
  }
  function _(i) {
    this.dom = i, this.targetId = i.getAttribute(d);
    const t = i.getAttribute(h);
    this.colIndex = t !== null ? parseInt(t, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = ht(i, "filter"), this.hashEnabled = !!this.nsKey;
    const e = this, n = Wt(
      function() {
        e._render();
      }
    );
    this._queueRender = n, this._attachHandlers(), this._onHashChange = function() {
      if (e._destroyed || !e.hashEnabled) return;
      const g = Z(e.nsKey), E = Ht(g);
      E && E.key && E.values.length > 0 ? f(e.dom, E.key, E.values) : f(e.dom, null, []), e._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let l = !1;
    if (this.hashEnabled) {
      const g = Z(this.nsKey), E = Ht(g);
      E && E.key && E.values.length > 0 && (f(i, E.key, E.values), it(function() {
        e._destroyed || e._render();
      }), l = !0);
    }
    if (!l && i.hasAttribute("data-ln-persist")) {
      const g = kt("filter", i);
      g && g.key && Array.isArray(g.values) && g.values.length > 0 && (f(i, g.key, g.values), it(function() {
        e._destroyed || e._render();
      }), l = !0);
    }
    if (!l) {
      const g = i.querySelectorAll("[" + y + "]");
      for (let E = 0; E < g.length; E++)
        if (g[E].checked && !s(g[E])) {
          it(function() {
            e._destroyed || e._render();
          });
          break;
        }
    }
    return this;
  }
  _.prototype._attachHandlers = function() {
    const i = this;
    this._onDomChange = function(t) {
      const e = t.target;
      if (!e || !e.hasAttribute || !e.hasAttribute(y)) return;
      const n = Array.from(i.dom.querySelectorAll("[" + y + "]"));
      if (s(e)) {
        for (let l = 0; l < n.length; l++)
          s(n[l]) || (n[l].checked = !1);
        e.checked = !0, i._queueRender();
        return;
      }
      if (e.checked) {
        for (let g = 0; g < n.length; g++)
          s(n[g]) && (n[g].checked = !1);
        let l = !1;
        for (let g = 0; g < n.length; g++)
          if (s(n[g])) {
            l = !0;
            break;
          }
        if (l) {
          let g = !0;
          for (let E = 0; E < n.length; E++)
            if (!s(n[E]) && !n[E].checked) {
              g = !1;
              break;
            }
          if (g)
            for (let E = 0; E < n.length; E++)
              s(n[E]) ? n[E].checked = !0 : n[E].checked = !1;
        }
      } else {
        let l = !1;
        for (let g = 0; g < n.length; g++)
          if (!s(n[g]) && n[g].checked) {
            l = !0;
            break;
          }
        if (!l)
          for (let g = 0; g < n.length; g++)
            s(n[g]) && (n[g].checked = !0);
      }
      i._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, _.prototype._render = function() {
    const i = this, t = u(this), e = this._lastSnapshot;
    if (!(!e || e.key !== t.key || p(e.values, t.values))) return;
    const l = t.key === null || t.values.length === 0, g = document.getElementById(i.targetId), E = {
      key: t.key,
      values: t.values.slice(),
      targetId: i.targetId
    };
    L(i.dom, "ln-filter:change", E);
    let v = !1;
    g && g !== i.dom && Q(g, "ln-filter:change", E).defaultPrevented && (v = !0);
    const A = e && e.values.length > 0, S = t.values.length === 0;
    if (A && S) {
      const T = { targetId: i.targetId };
      L(i.dom, "ln-filter:reset", T), g && g !== i.dom && L(g, "ln-filter:reset", T);
    }
    if (this._lastSnapshot = { key: t.key, values: t.values.slice() }, this.dom.hasAttribute("data-ln-persist") && (t.key && t.values.length > 0 ? ut("filter", this.dom, { key: t.key, values: t.values.slice() }) : ut("filter", this.dom, null)), this.hashEnabled) {
      const T = we(t.key, t.values);
      J(this.nsKey, T);
    }
    if (v) return;
    const q = [];
    for (let T = 0; T < t.values.length; T++)
      q.push(t.values[T].toLowerCase());
    if (i.colIndex !== null)
      i._filterTableRows(t);
    else {
      if (!g) return;
      const T = g.children;
      for (let x = 0; x < T.length; x++) {
        const k = T[x];
        if (l) {
          k.removeAttribute(b);
          continue;
        }
        const R = k.getAttribute("data-" + t.key);
        k.removeAttribute(b), R !== null && q.indexOf(R.toLowerCase()) === -1 && k.setAttribute(b, "true");
      }
    }
  }, _.prototype._filterTableRows = function(i) {
    const t = document.getElementById(this.targetId);
    if (!t) return;
    const e = t.tagName === "TABLE" ? t : t.querySelector("table");
    if (!e) return;
    const n = i.key || this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex, l = i.values;
    c.has(e) || c.set(e, {});
    const g = c.get(e);
    if (n && l.length > 0) {
      const S = [];
      for (let q = 0; q < l.length; q++)
        S.push(l[q].toLowerCase());
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
        const i = document.getElementById(this.targetId);
        if (i) {
          const t = i.tagName === "TABLE" ? i : i.querySelector("table");
          if (t && c.has(t)) {
            const e = c.get(t), n = this.dom.getAttribute("data-ln-filter-key") || "col" + this.colIndex;
            n && e[n] && delete e[n], Object.keys(e).length === 0 && c.delete(t);
          }
        }
      }
      this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a];
    }
  };
  function r(i, t) {
    const e = i[a];
    !e || e._destroyed || t === o && (e.hashEnabled && e._onHashChange && window.removeEventListener("hashchange", e._onHashChange), e.nsKey = ht(i, "filter"), e.hashEnabled = !!e.nsKey, e.hashEnabled && window.addEventListener("hashchange", e._onHashChange));
  }
  B(d, a, _, "ln-filter", {
    extraAttributes: [o],
    onAttributeChange: r
  });
})();
(function() {
  const d = "data-ln-search", a = "lnSearch", y = "data-ln-search-for", w = "lnSearchControl", b = "data-ln-search-items", m = "data-ln-search-fields", h = "data-ln-search-exclude", o = "data-ln-search-hide", c = "data-ln-hash";
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
  function f(v) {
    return (v || "").trim().toLowerCase();
  }
  function p(v) {
    return v ? v.split(/\s+/).filter(Boolean) : [];
  }
  function _(v) {
    const A = v.tagName;
    return A === "INPUT" || A === "TEXTAREA" ? v : v.querySelector('[name="search"]') || v.querySelector('input[type="search"]') || v.querySelector('input[type="text"]');
  }
  function r(v) {
    const A = v.getAttribute(m);
    if (A === null) return null;
    const S = A.split(",").map(function(q) {
      return q.trim();
    }).filter(Boolean);
    return S.length ? S : null;
  }
  function i(v, A) {
    const S = v.childNodes;
    for (let q = 0; q < S.length; q++) {
      const T = S[q];
      if (T.nodeType === 3) {
        A.push(T.nodeValue);
        continue;
      }
      T.nodeType === 1 && (T.hasAttribute(h) || i(T, A));
    }
  }
  function t(v) {
    if (v._lnSearchText !== void 0) return v._lnSearchText;
    const A = [];
    i(v, A);
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
    this.dom = v, this.term = v.getAttribute(d) || "", this._destroyed = !1;
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
      const S = Z(A.nsKey), q = A.dom.getAttribute(d) || "";
      S !== null && S !== q ? A.dom.setAttribute(d, S) : S === null && q !== "" && A.dom.setAttribute(d, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), it(function() {
      if (!A._destroyed) {
        if (A.hashEnabled) {
          const S = Z(A.nsKey);
          if (S !== null && S !== A.term) {
            A.term = S, A.dom.setAttribute(d, S), e(A.dom, S), A._apply();
            return;
          }
        }
        f(A.term) && (e(A.dom, A.term), A._apply());
      }
    }), this;
  }
  n.prototype._apply = function() {
    const v = this.dom, A = f(this.term), S = p(A);
    if (this.hashEnabled && J(this.nsKey, this.term ? this.term : null), Q(v, "ln-search:change", {
      term: A,
      tokens: S,
      targetId: v.id,
      fields: r(v)
    }).defaultPrevented) return;
    const T = v.getAttribute(b), x = T ? v.querySelectorAll(T) : v.children;
    for (let k = 0; k < x.length; k++) {
      const R = x[k];
      if (R.removeAttribute(o), R.hasAttribute(h) || S.length === 0) continue;
      const N = t(R);
      for (let z = 0; z < S.length; z++)
        if (N.indexOf(S[z]) === -1) {
          R.setAttribute(o, "true");
          break;
        }
    }
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._destroyed = !0, this._observer && (this._observer.disconnect(), this._observer = null), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a]);
  };
  function l(v) {
    this.dom = v, this.targetId = v.getAttribute(y), this.input = _(v);
    const A = v.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = A !== null ? parseInt(A, 10) : 500, isNaN(this.debounceTime) && (this.debounceTime = 500), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const S = this;
      it(function() {
        const q = document.getElementById(S.targetId);
        q && ((q.getAttribute(d) || "").trim() || S._write(S.input.value));
      });
    }
    return this;
  }
  l.prototype._write = function(v) {
    const A = document.getElementById(this.targetId);
    A && A.setAttribute(d, v);
  }, l.prototype._attachHandler = function() {
    if (!this.input) return;
    const v = this;
    this._onInput = function() {
      clearTimeout(v._debounceTimer), v._debounceTimer = setTimeout(function() {
        v._write(v.input.value);
      }, v.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, l.prototype.destroy = function() {
    this.dom[w] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[w]);
  };
  function g(v) {
    const A = v.getAttribute("data-ln-search-clear-for");
    if (A) {
      const x = document.getElementById(A), k = document.querySelector("[" + y + '="' + A + '"]'), R = k ? _(k) : null;
      return { target: x, input: R };
    }
    const S = v.closest("[" + d + "]");
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
      S.target && S.target.setAttribute(d, "");
    }
  });
  function E(v, A) {
    const S = v[a];
    if (!S || S._destroyed) return;
    if (A === c) {
      S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = u(v), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange);
      return;
    }
    const q = v.getAttribute(d) || "";
    q !== S.term && (S.term = q, e(v, q), S._apply());
  }
  B(d, a, n, "ln-search", {
    extraAttributes: [c],
    onAttributeChange: E
  }), B(y, w, l, "ln-search-control");
})();
(function() {
  const d = "data-ln-sort", a = "lnSort", y = "data-ln-sort-field", w = "data-ln-sort-state", b = "data-ln-sort-dir", m = "data-ln-sort-items", h = "data-ln-hash";
  if (window[a] !== void 0) return;
  const o = /* @__PURE__ */ new WeakMap();
  function c(f, p) {
    if (p) {
      const _ = f.querySelector('[data-ln-field="' + p + '"]');
      if (_) return _t(_);
    }
    return _t(f);
  }
  function s(f) {
    this.dom = f, this.targetId = f.getAttribute(d), this.field = f.getAttribute(y) || null;
    const p = f.closest("th");
    this.column = !this.field && p ? p.cellIndex : null, this.itemsSelector = f.getAttribute(m) || null, this._state = f.getAttribute(w) || "none", this._destroyed = !1, this.nsKey = ht(f, "sort"), this.hashEnabled = !!this.nsKey;
    const _ = this;
    this._onClick = function(i) {
      const t = i.target.closest("[" + b + "]");
      if (!t) return;
      const e = t.getAttribute(b);
      _._apply(e);
    }, f.addEventListener("click", this._onClick), this._onSortChange = function(i) {
      if (_._destroyed || !i.detail) return;
      const t = _._resolveTarget();
      if (!(t && (i.target === t || t.contains(i.target)) || i.detail.targetId && i.detail.targetId === _.targetId)) return;
      if (_.field !== null && i.detail.field === _.field || _.column !== null && i.detail.column === _.column) {
        i.detail.direction && f.getAttribute(w) !== i.detail.direction && (_._state = i.detail.direction, f.setAttribute(w, i.detail.direction), _._updateAriaSort(i.detail.direction));
        return;
      }
      f.getAttribute(w) !== "none" && (_._state = "none", f.setAttribute(w, "none"), _._updateAriaSort("none")), f.hasAttribute("data-ln-persist") && ut("sort", f, null);
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (_._destroyed || !_.hashEnabled) return;
      const i = Z(_.nsKey), t = Pt(i);
      if (t)
        _.field !== null && t.fieldOrColumn === _.field || _.column !== null && String(_.column) === t.fieldOrColumn ? _._state !== t.direction && _._apply(t.direction, !0) : _._state !== "none" && (_._state = "none", f.setAttribute(w, "none"), _._updateAriaSort("none"));
      else if (_._state !== "none") {
        _._state = "none", f.setAttribute(w, "none"), _._updateAriaSort("none");
        const e = _._resolveTarget();
        e && (Q(e, "ln-sort:change", {
          field: _.field,
          column: _.column,
          direction: "none",
          targetId: _.targetId
        }).defaultPrevented || _._defaultSort(e, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let r = !1;
    if (this.hashEnabled) {
      const i = Z(this.nsKey), t = Pt(i);
      t && ((_.field !== null && t.fieldOrColumn === _.field || _.column !== null && String(_.column) === t.fieldOrColumn) && it(function() {
        _._destroyed || _._apply(t.direction, !0);
      }), r = !0);
    }
    if (!r && f.hasAttribute("data-ln-persist")) {
      const i = kt("sort", f);
      i && i.direction && i.direction !== "none" && it(function() {
        _._destroyed || _._apply(i.direction, !0);
      }), r = !0;
    }
    if (!r) {
      const i = f.getAttribute(w);
      i && (i === "asc" || i === "desc") && it(function() {
        _._destroyed || _._apply(i, !0);
      });
    }
    return this;
  }
  s.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, s.prototype._updateAriaSort = function(f) {
    const p = this.dom.closest("th");
    p && (f === "asc" ? p.setAttribute("aria-sort", "ascending") : f === "desc" ? p.setAttribute("aria-sort", "descending") : p.setAttribute("aria-sort", "none"));
  }, s.prototype._apply = function(f, p) {
    if (this._destroyed) return;
    this._state = f, this.dom.getAttribute(w) !== f && this.dom.setAttribute(w, f), this._updateAriaSort(f);
    const _ = this._resolveTarget();
    if (!_) return;
    const r = {
      field: this.field,
      column: this.column,
      direction: f,
      targetId: this.targetId
    };
    if (!p && (this.dom.hasAttribute("data-ln-persist") && ut("sort", this.dom, f === "none" ? null : r), this.hashEnabled)) {
      const t = ve(this.field !== null ? this.field : this.column, f);
      J(this.nsKey, t);
    }
    Q(_, "ln-sort:change", r).defaultPrevented || this._defaultSort(_, f);
  }, s.prototype._defaultSort = function(f, p) {
    const _ = this.itemsSelector ? Array.from(f.querySelectorAll(this.itemsSelector)) : Array.from(f.children);
    if (!_.length) return;
    const r = _[0].parentNode;
    o.has(f) || o.set(f, _.slice());
    let i;
    if (p === "none")
      i = (o.get(f) || _).filter(function(n) {
        return n.parentNode === r;
      });
    else {
      const e = this.field, n = _.map(function(v) {
        return c(v, e);
      }), l = bt(n), g = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null, E = p === "desc" ? -1 : 1;
      i = _.slice().sort(function(v, A) {
        return yt(c(v, e), c(A, e), l, g) * E;
      });
    }
    const t = document.createDocumentFragment();
    for (let e = 0; e < i.length; e++) t.appendChild(i[e]);
    r.appendChild(t);
  }, s.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[a]);
  };
  function u(f, p) {
    const _ = f[a];
    if (!(!_ || _._destroyed))
      if (p === y) {
        _.field = f.getAttribute(y) || null;
        const r = f.closest("th");
        _.column = !_.field && r ? r.cellIndex : null;
      } else if (p === m)
        _.itemsSelector = f.getAttribute(m) || null;
      else if (p === w) {
        const r = f.getAttribute(w) || "none";
        r !== _._state && _._apply(r);
      } else p === d ? _.targetId = f.getAttribute(d) : p === h && (_.hashEnabled && _._onHashChange && window.removeEventListener("hashchange", _._onHashChange), _.nsKey = ht(f, "sort"), _.hashEnabled = !!_.nsKey, _.hashEnabled && window.addEventListener("hashchange", _._onHashChange));
  }
  B(d, a, s, "ln-sort", {
    extraAttributes: [y, m, w, h],
    onAttributeChange: u
  });
})();
(function() {
  const d = "data-ln-table", a = "lnTable", y = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const c = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function s(r, i) {
    if (r == null || isNaN(r)) return "";
    try {
      return new Intl.NumberFormat(W(i)).format(r);
    } catch {
      return String(r);
    }
  }
  function u(r) {
    let i = r.parentElement;
    for (; i && i !== document.body && i !== document.documentElement; ) {
      const e = getComputedStyle(i).overflowY;
      if (e === "auto" || e === "scroll") return i;
      i = i.parentElement;
    }
    return null;
  }
  function f(r) {
    const i = r._scrollContainer || u(r.dom);
    return {
      container: i,
      top: i ? i.scrollTop : window.scrollY
    };
  }
  function p(r) {
    r.container ? r.container.scrollTop = r.top : window.scrollTo(window.scrollX, r.top);
  }
  function _(r) {
    this.dom = r, this.table = r.querySelector("table"), this.tbody = r.querySelector("[data-ln-table-body]") || r.querySelector("tbody"), this.thead = r.querySelector("thead");
    const i = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = i ? Array.from(i.querySelectorAll("th")) : [], this._totalSpan = r.querySelector("[data-ln-table-total]"), this._filteredSpan = r.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this.isDataDriven = r.hasAttribute("data-ln-table-source"), this.name = r.getAttribute(d) || "", this.source = r.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const t = this;
    return this._onSetSearch = function(e) {
      const n = (e.detail && e.detail.query != null ? e.detail.query : e.detail && e.detail.term != null ? e.detail.term : "").trim();
      t.isDataDriven ? (t.currentSearch = n, L(r, "ln-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData()) : (t._searchTerm = n.toLowerCase(), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(r, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, r.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(e) {
      e.preventDefault(), t._onSetSearch(e);
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      t.isDataDriven ? (t.currentFilters = {}, t.currentSearch = "", L(r, "ln-table:clear-filters", { table: t.name }), t._requestData()) : (t._searchTerm = "", t._columnFilters = {}, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(r, "ln-table:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, r.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = r.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && r.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(e) {
      const n = e.detail || {};
      if (t._windowed) {
        r.classList.remove("ln-table--loading"), t._cache.ingest(n);
        return;
      }
      t._data = n.data || [], t._lastTotal = n.total != null ? n.total : t._data.length, t._lastFiltered = n.filtered != null ? n.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, r.classList.remove("ln-table--loading"), t._vStart = -1, t._vEnd = -1, t._applyFilterAndSort(), t._render(), t._updateFooter(), L(r, "ln-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, r.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(e) {
      const n = e.detail && e.detail.loading;
      r.classList.toggle("ln-table--loading", !!n), n && (t.isLoaded = !1);
    }, r.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(e) {
      !t._windowed || !t._cache || t._cache.release(e.detail && e.detail.offset);
    }, r.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !t._windowed || !t._cache || t._cache.revalidate();
    }, r.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !t._windowed || !t._cache || t._requestData();
    }, r.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(e) {
      e.preventDefault(), t.currentSort = e.detail.direction === "none" ? null : { field: e.detail.field, direction: e.detail.direction }, t._requestData();
    }, r.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(e) {
      if (e.target.closest("[data-ln-table-row-select]") || e.target.closest("[data-ln-table-row-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const n = e.target.closest("[data-ln-table-row]");
      if (!n) return;
      const l = n.getAttribute("data-ln-table-row-id"), g = n._lnRecord || {};
      L(r, "ln-table:row-click", {
        table: t.name,
        id: l,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
      const n = e.target.closest("[data-ln-table-row-action]");
      if (!n) return;
      e.stopPropagation();
      const l = n.closest("[data-ln-table-row]");
      if (!l) return;
      const g = n.getAttribute("data-ln-table-row-action"), E = l.getAttribute("data-ln-table-row-id"), v = l._lnRecord || {};
      L(r, "ln-table:row-action", {
        table: t.name,
        id: E,
        action: g,
        record: v
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(e) {
      if (!r.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
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
              const l = n[t._focusedRowIndex];
              L(r, "ln-table:row-click", {
                table: t.name,
                id: l.getAttribute("data-ln-table-row-id"),
                record: l._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const l = n[t._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              l && (l.checked = !l.checked, l.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : L(r, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(e) {
      e.preventDefault();
      const n = e.detail.direction === "none" ? null : e.detail.direction;
      t._sortCol = n === null ? -1 : e.detail.column, t._sortDir = n, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), L(r, "ln-table:sorted", {
        column: e.detail.column,
        direction: e.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(e) {
      if (e.preventDefault(), !e.detail) return;
      const n = e.detail.key, l = e.detail.values || [];
      if (n) {
        if (l.length === 0)
          delete t._columnFilters[n];
        else {
          const g = [];
          for (let E = 0; E < l.length; E++)
            g.push(l[E].toLowerCase());
          t._columnFilters[n] = g;
        }
        t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), L(r, "ln-table:filter", {
          term: t._searchTerm,
          matched: t._filteredData.length,
          total: t._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  _.prototype._parseRows = function() {
    const r = this.tbody.rows, i = this.ths;
    this._data = [], r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < r.length; t++) {
      const e = r[t], n = [], l = [], g = [];
      for (let v = 0; v < e.cells.length; v++) {
        const A = e.cells[v], S = A.textContent.trim();
        n[v] = _t(A), l[v] = S.toLowerCase(), A.querySelector("[data-ln-table-row-action]") || g.push(S.toLowerCase());
      }
      let E = null;
      if (this.isDataDriven) {
        E = {};
        const v = e.getAttribute("data-ln-table-row-id");
        v != null && (E.id = v);
        for (let A = 0; A < i.length; A++) {
          const S = i[A].getAttribute("data-ln-table-col");
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
        rawTexts: l,
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
      const r = (this.currentSearch || "").trim().toLowerCase(), i = r ? r.split(/\s+/).filter(Boolean) : [], t = this.currentFilters || {}, e = Object.keys(t).length > 0;
      if (this._filteredData = this._data.filter(function(A) {
        if (i.length > 0 && !i.every(function(q) {
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
        return yt(A[n], S[n], v, c) * g;
      });
    } else {
      const r = this._searchTerm, i = r ? r.split(/\s+/).filter(Boolean) : [], t = this._columnFilters, e = Object.keys(t).length > 0, n = this.ths, l = {};
      if (e)
        for (let S = 0; S < n.length; S++) {
          const q = n[S].getAttribute("data-ln-table-filter-col");
          q && (l[q] = S);
        }
      if (i.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (i.length > 0 && !i.every(function(T) {
          return S.searchText.indexOf(T) !== -1;
        }))
          return !1;
        if (e)
          for (const q in t) {
            const T = l[q];
            if (T !== void 0 && t[q].indexOf(S.rawTexts[T]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, E = this._sortDir === "desc" ? -1 : 1, v = this._filteredData.map(function(S) {
        return S.values[g];
      }), A = bt(v);
      this._filteredData.sort(function(S, q) {
        return yt(S.values[g], q.values[g], A, c) * E;
      });
    }
  }, _.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const r = document.createElement("colgroup");
    this.ths.forEach(function(i) {
      const t = document.createElement("col");
      t.style.width = i.offsetWidth + "px", r.appendChild(t);
    }), this.table.insertBefore(r, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = r;
  }, _.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const r = this._lastTotal, i = this.visibleCount;
        if (r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, _.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, i = document.createDocumentFragment();
      for (let e = 0; e < r.length; e++) {
        const n = this._buildRow(r[e]);
        if (!n) break;
        i.appendChild(n);
      }
      const t = f(this);
      this.tbody.textContent = "", this.tbody.appendChild(i), p(t), this._selectable && this._updateSelectAll();
    } else {
      const r = [], i = this._filteredData;
      for (let e = 0; e < i.length; e++) r.push(i[e].html);
      const t = f(this);
      this.tbody.innerHTML = r.join(""), p(t), this._selectable && this._restoreSelection();
    }
  }, _.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
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
    const i = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, i.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, _.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, _.prototype._renderVirtual = function() {
    const r = this._filteredData, i = r.length, t = this._rowHeight;
    if (!t || !i) return;
    const e = this.thead ? this.thead.offsetHeight : 0, n = this._scrollContainer;
    let l, g;
    if (n) {
      const T = this.table.getBoundingClientRect(), x = n.getBoundingClientRect(), k = T.top - x.top + n.scrollTop + e;
      l = n.scrollTop - k, g = n.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + e;
      l = window.scrollY - k, g = window.innerHeight;
    }
    let E = Math.max(0, Math.floor(l / t) - 15);
    E = Math.min(E, i);
    const v = Math.min(E + Math.ceil(g / t) + 30, i);
    if (E === this._vStart && v === this._vEnd) return;
    this._vStart = E, this._vEnd = v;
    const A = this.ths.length || 1, S = E * t, q = (i - v) * t;
    if (this.isDataDriven) {
      const T = document.createDocumentFragment();
      if (S > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = S + "px", k.appendChild(R), T.appendChild(k);
      }
      for (let k = E; k < v; k++) {
        const R = this._buildRow(r[k]);
        R && T.appendChild(R);
      }
      if (q > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", A), R.style.height = q + "px", k.appendChild(R), T.appendChild(k);
      }
      const x = f(this);
      this.tbody.textContent = "", this.tbody.appendChild(T), p(x), this._selectable && this._updateSelectAll();
    } else {
      let T = "";
      S > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
      for (let k = E; k < v; k++) T += r[k].html;
      q > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + q + 'px;padding:0;border:none"></td></tr>');
      const x = f(this);
      this.tbody.innerHTML = T, p(x), this._selectable && this._restoreSelection();
    }
  }, _.prototype._buildPlaceholderRow = function() {
    const r = document.createElement("tr");
    r.className = "ln-table__placeholder", r.setAttribute("aria-hidden", "true");
    const i = document.createElement("td");
    return i.setAttribute("colspan", this.ths.length || 1), i.style.height = this._rowHeight + "px", r.appendChild(i), r;
  }, _.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const r = this._rowHeight;
    if (!r) return;
    const i = this._cache.logicalTotal, t = this.thead ? this.thead.offsetHeight : 0, e = this._scrollContainer;
    let n, l;
    if (e) {
      const x = this.table.getBoundingClientRect(), k = e.getBoundingClientRect(), R = x.top - k.top + e.scrollTop + t;
      n = e.scrollTop - R, l = e.clientHeight;
    } else {
      const R = this.table.getBoundingClientRect().top + window.scrollY + t;
      n = window.scrollY - R, l = window.innerHeight;
    }
    let g = Math.max(0, Math.floor(n / r) - 15);
    g = Math.min(g, i);
    const E = Math.min(g + Math.ceil(l / r) + 30, i), v = this.ths.length || 1, A = g * r, S = (i - E) * r, q = document.createDocumentFragment();
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
    const T = f(this);
    this.tbody.textContent = "", this.tbody.appendChild(q), p(T), this._vStart = g, this._vEnd = E, this._cache.ensure(g, E);
  }, _.prototype._showEmptyState = function() {
    const r = this.ths.length || 1;
    this.tbody.textContent = "";
    let i = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount === 0 && t > 0, l = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = ct(this.dom, l, "ln-table"), !i) {
        const g = this.dom.querySelector("template[data-ln-table-empty]");
        if (g) {
          const E = n ? "search" : "initial", v = g.content.querySelector('[data-ln-table-empty-when="' + E + '"]') || g.content.firstElementChild;
          v && (i = document.importNode(v, !0));
        }
      }
      if (i)
        if (i.tagName === "TR")
          this.tbody.appendChild(i);
        else {
          const g = document.createElement("td");
          g.setAttribute("colspan", String(r)), g.appendChild(i);
          const E = document.createElement("tr");
          E.className = "ln-table__empty", E.appendChild(g), this.tbody.appendChild(E);
        }
    } else {
      const t = this.dom.querySelector("template[" + y + "]"), e = document.createElement("td");
      e.setAttribute("colspan", String(r)), t && e.appendChild(document.importNode(t.content, !0));
      const n = document.createElement("tr");
      n.className = "ln-table__empty", n.appendChild(e), this.tbody.appendChild(n);
    }
    L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, _.prototype._fillRow = function(r, i) {
    Et(r, i);
    const t = r.querySelectorAll("[data-ln-table-cell-attr]");
    for (let e = 0; e < t.length; e++) {
      const n = t[e], l = n.getAttribute("data-ln-table-cell-attr").split(",");
      for (let g = 0; g < l.length; g++) {
        const E = l[g].trim().split(":");
        if (E.length !== 2) continue;
        const v = E[0].trim(), A = E[1].trim();
        i[v] != null && n.setAttribute(A, i[v]);
      }
    }
  }, _.prototype._buildRow = function(r) {
    const i = ct(this.dom, this.name + "-row", "ln-table");
    if (!i) return null;
    const t = i.querySelector("[data-ln-table-row]") || i.firstElementChild;
    if (!t) return null;
    if (this._fillRow(t, r), t._lnRecord = r, r.id != null && t.setAttribute("data-ln-table-row-id", r.id), this._selectable && r.id != null && this.selectedIds.has(String(r.id))) {
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
    const r = this, i = this.dom, t = parseInt(i.getAttribute("data-ln-table-window"), 10), e = parseInt(i.getAttribute("data-ln-table-window-page"), 10), n = parseInt(i.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-table:rendered", {
        table: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = Wt(this._onCacheChange), this._cache = ge({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: n >= 0 ? n : 25,
      fetchDebounce: 120,
      requestPage: function(l, g, E) {
        L(i, "ln-table:request-data", {
          table: r.name,
          sort: l.sort,
          filters: l.filters,
          search: l.search,
          offset: g,
          limit: E,
          queryGen: r._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, _.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let r = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(r) && this._totalSpan) {
        const t = this._totalSpan.textContent.replace(/[^\d]/g, "");
        t && (r = parseInt(t, 10));
      }
      const i = r > 0 ? r : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: i,
        filtered: i
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
    const r = this.tbody.querySelectorAll("[data-ln-table-row]");
    let i = r.length > 0;
    for (let t = 0; t < r.length; t++) {
      const e = r[t].getAttribute("data-ln-table-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        i = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = i;
  }, _.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let i = 0; i < r.length; i++) {
      const t = r[i].getAttribute("data-ln-table-row-id"), e = t != null && this.selectedIds.has(t);
      r[i].classList.toggle("ln-row-selected", e);
      const n = r[i].querySelector("[data-ln-table-row-select]");
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
    const r = this;
    if (this._onSelectionChange = function(i) {
      const t = i.target.closest("[data-ln-table-row-select]");
      if (!t) return;
      const e = t.closest("[data-ln-table-row]");
      if (!e) return;
      const n = e.getAttribute("data-ln-table-row-id");
      n != null && (t.checked ? (r.selectedIds.add(n), e.classList.add("ln-row-selected")) : (r.selectedIds.delete(n), e.classList.remove("ln-row-selected")), r.selectedCount = r.selectedIds.size, r._updateSelectAll(), r._updateFooter(), L(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const i = document.createElement("input");
      i.type = "checkbox";
      const t = r.dom.querySelector('[data-ln-table-dict="select-all"]'), e = r.dom.getAttribute("data-ln-table-select-all-label") || (t ? t.textContent.trim() : null) || "Select all";
      i.setAttribute("aria-label", e), this._selectAllCheckbox.appendChild(i), this._selectAllCheckbox = i;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const i = r._selectAllCheckbox.checked, t = r.tbody ? r.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let e = 0; e < t.length; e++) {
        const n = t[e].getAttribute("data-ln-table-row-id"), l = t[e].querySelector("[data-ln-table-row-select]");
        n != null && (i ? (r.selectedIds.add(n), t[e].classList.add("ln-row-selected")) : (r.selectedIds.delete(n), t[e].classList.remove("ln-row-selected")), l && (l.checked = i));
      }
      r.selectedCount = r.selectedIds.size, L(r.dom, "ln-table:select-all", {
        table: r.name,
        selected: i
      }), L(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const i = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < i.length; t++) {
        const e = i[t].querySelector("[data-ln-table-row-select]"), n = i[t].getAttribute("data-ln-table-row-id");
        e && e.checked && n != null && (this.selectedIds.add(n), i[t].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, _.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const r = this.dom.querySelector("[data-ln-table-col-select]");
    if (r) {
      const i = r.querySelector('input[type="checkbox"]');
      i && i.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const i = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < i.length; t++) {
        i[t].classList.remove("ln-row-selected");
        const e = i[t].querySelector("[data-ln-table-row-select]");
        e && (e.checked = !1);
      }
    }
    this._updateFooter();
  }, _.prototype._updateFooter = function() {
    let r = 0, i = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount) : (r = this._data.length, i = this._filteredData.length);
    const t = i < r;
    if (this._totalSpan && (this._totalSpan.textContent = s(r, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? s(i, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? s(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, _.prototype._focusRow = function(r) {
    for (let i = 0; i < r.length; i++)
      r[i].classList.remove("ln-row-focused"), r[i].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < r.length) {
      const i = r[this._focusedRowIndex];
      i.classList.add("ln-row-focused"), i.setAttribute("tabindex", "0"), i.focus(), i.scrollIntoView({ block: "nearest" });
    }
  }, _.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(d, a, _, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(r, i) {
      const t = r[a];
      if (!(!t || !t.isDataDriven)) {
        if (i === "data-ln-table-window") {
          const e = r.hasAttribute("data-ln-table-window");
          if (e && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!e && t._windowed)
            t._exitWindowedMode();
          else if (e && t._windowed) {
            const n = parseInt(r.getAttribute("data-ln-table-window"), 10);
            n > 0 && t._cache.configure({ windowSize: n });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (i === "data-ln-table-window-page") {
            const e = parseInt(r.getAttribute("data-ln-table-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (i === "data-ln-table-window-threshold") {
            const e = parseInt(r.getAttribute("data-ln-table-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (i === "data-ln-table-count") {
            const e = parseInt(r.getAttribute("data-ln-table-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const d = "data-ln-table-coordinator", a = "lnTableCoordinator";
  if (window[a] !== void 0) return;
  document.addEventListener("keydown", function(b) {
    if (b.key !== "/" || b.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const m = document.querySelector("[" + d + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!m) return;
    const h = m.tagName === "INPUT" || m.tagName === "TEXTAREA" ? m : m.querySelector('input[type="search"], input[type="text"], input');
    h && (b.preventDefault(), h.focus());
  });
  function y(b) {
    return this.dom = b, w(this), this;
  }
  function w(b) {
    const m = b.dom;
    function h(o) {
      const c = o.target;
      if (c && c.hasAttribute && c.hasAttribute("data-ln-table")) return c;
      const s = o.detail && o.detail.targetId || c && c.id;
      return s ? m.querySelector('[data-ln-table-source="' + s + '"]') || m.querySelector('[data-ln-table="' + s + '"]') : null;
    }
    b._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(o) {
        if (!o.detail) return;
        const c = h(o);
        if (!c || !c.hasAttribute || !c.hasAttribute("data-ln-table")) return;
        const s = o.detail.key, u = o.detail.values || [], f = c.querySelectorAll("th");
        for (let p = 0; p < f.length; p++)
          if (f[p].getAttribute("data-ln-table-filter-col") === s) {
            const _ = f[p].querySelector("[data-ln-table-col-filter]");
            _ && _.classList.toggle("ln-filter-active", u.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(o) {
        const c = o.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!c) return;
        const s = c.closest("[data-ln-table]") || m.querySelector("[data-ln-table]");
        if (!s || !s.lnTable) return;
        const u = s.lnTable.name || s.id, f = s.querySelectorAll("th");
        for (let t = 0; t < f.length; t++) {
          const e = f[t].querySelector("[data-ln-table-col-filter]");
          e && e.classList.remove("ln-filter-active");
        }
        const p = s.getAttribute("data-ln-table-source") || s.id, _ = p ? document.getElementById(p) : null;
        _ && _.hasAttribute("data-ln-search") && _.setAttribute("data-ln-search", "");
        const r = p && m.querySelector('[data-ln-search-for="' + p + '"]') || m.querySelector("[data-ln-search-for]");
        if (r) {
          const t = r.tagName === "INPUT" || r.tagName === "TEXTAREA" ? r : r.querySelector("input");
          t && t.value !== "" && (t.value = "", t.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const i = p && m.querySelectorAll('[data-ln-filter="' + p + '"]') || m.querySelectorAll("[data-ln-filter]");
        for (let t = 0; t < i.length; t++) {
          const e = i[t].querySelector("[data-ln-filter-reset]");
          e && (e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        s.hasAttribute("data-ln-table-source") || L(s, "ln-table:request-clear-filters", { table: u });
      }
    }, m.addEventListener("ln-filter:change", b._handlers.filter), m.addEventListener("click", b._handlers.clear);
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[a]);
  }, B(d, a, y, "ln-table-coordinator");
})();
(function() {
  const d = "data-ln-list", a = "lnList", y = "data-ln-list-empty";
  if (window[a] !== void 0) return;
  function c(r, i) {
    if (r == null || isNaN(r)) return "";
    try {
      return new Intl.NumberFormat(W(i)).format(r);
    } catch {
      return String(r);
    }
  }
  function s(r) {
    let i = r;
    for (; i && i !== document.body && i !== document.documentElement; ) {
      const e = getComputedStyle(i).overflowY;
      if (e === "auto" || e === "scroll") return i;
      i = i.parentElement;
    }
    return null;
  }
  function u(r) {
    const i = r._scrollContainer || s(r.dom);
    return {
      container: i,
      top: i ? i.scrollTop : window.scrollY
    };
  }
  function f(r) {
    r.container ? r.container.scrollTop = r.top : window.scrollTo(window.scrollX, r.top);
  }
  function p(r) {
    if (!r) return 0;
    const i = getComputedStyle(r), t = parseFloat(i.marginTop) || 0, e = parseFloat(i.marginBottom) || 0;
    return r.offsetHeight + t + e;
  }
  function _(r) {
    this.dom = r, this.tbody = r.querySelector("[data-ln-list-body]") || r, this.isDataDriven = r.hasAttribute("data-ln-list-source"), this.name = r.getAttribute(d) || "", this.source = r.getAttribute("data-ln-list-source") || "", this._totalSpan = r.querySelector("[data-ln-list-total]"), this._filteredSpan = r.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const i = this;
    return this._onRequestClearFilters = function() {
      i.isDataDriven ? (i.currentFilters = {}, i.currentSearch = "", L(r, "ln-list:clear-filters", { list: i.name }), i._requestData()) : (i._searchTerm = "", i._filters = {}, i._sortField = null, i._sortDir = null, i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-list:filter", {
        term: "",
        matched: i._filteredData.length,
        total: i._data.length
      }));
    }, r.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectable = r.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._windowed = !1, this._cache = null, r.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._onSetData = function(t) {
      const e = t.detail || {};
      if (i._windowed) {
        r.classList.remove("ln-list--loading"), i._cache.ingest(e);
        return;
      }
      i._data = e.data || [], i._lastTotal = e.total != null ? e.total : i._data.length, i._lastFiltered = e.filtered != null ? e.filtered : i._data.length, i.totalCount = i._lastTotal, i.visibleCount = i._lastFiltered, i.isLoaded = !0, r.classList.remove("ln-list--loading"), i._vStart = -1, i._vEnd = -1, i._applyFilterAndSort(), i._render(), i._updateFooter(), L(r, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      });
    }, r.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(t) {
      const e = t.detail && t.detail.loading;
      r.classList.toggle("ln-list--loading", !!e), e && (i.isLoaded = !1);
    }, r.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(t) {
      !i._windowed || !i._cache || i._cache.release(t.detail && t.detail.offset);
    }, r.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !i._windowed || !i._cache || i._cache.revalidate();
    }, r.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !i._windowed || !i._cache || i._requestData();
    }, r.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(t) {
      t.detail.field != null && (t.preventDefault(), i.currentSort = t.detail.direction === "none" ? null : { field: t.detail.field, direction: t.detail.direction }, i._windowed ? i._requestData() : (i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-list:sorted", {
        field: i.currentSort ? i.currentSort.field : null,
        direction: t.detail.direction,
        matched: i.visibleCount,
        total: i.totalCount
      })));
    }, r.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(t) {
      if (t.target.closest("[data-ln-item-select]") || t.target.closest("[data-ln-item-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const e = t.target.closest("[data-ln-item]");
      if (!e) return;
      const n = e.getAttribute("data-ln-item-id"), l = e._lnRecord || {};
      L(r, "ln-list:item-click", {
        list: i.name,
        id: n,
        record: l
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(t) {
      const e = t.target.closest("[data-ln-item-action]");
      if (!e) return;
      t.stopPropagation();
      const n = e.closest("[data-ln-item]");
      if (!n) return;
      const l = e.getAttribute("data-ln-item-action"), g = n.getAttribute("data-ln-item-id"), E = n._lnRecord || {};
      L(r, "ln-list:item-action", {
        list: i.name,
        id: g,
        action: l,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(r, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      i.tbody.children.length > 0 && (i._emptyObserver.disconnect(), i._emptyObserver = null, i._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearchChange = function(t) {
      t.preventDefault();
      const e = (t.detail && t.detail.term != null ? t.detail.term : "").trim();
      i._searchTerm = e.toLowerCase(), i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-list:filter", {
        term: i._searchTerm,
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onFilterChange = function(t) {
      if (t.preventDefault(), !t.detail) return;
      const e = t.detail.key, n = t.detail.values || [];
      if (e) {
        if (n.length === 0)
          delete i._filters[e];
        else {
          const l = [];
          for (let g = 0; g < n.length; g++)
            l.push(n[g].toLowerCase());
          i._filters[e] = l;
        }
        i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-list:filter", {
          term: i._searchTerm,
          matched: i._filteredData.length,
          total: i._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(t) {
      if (t.detail && t.detail.field == null) return;
      t.preventDefault();
      const e = t.detail && t.detail.direction === "none" ? null : t.detail && t.detail.direction;
      i._sortField = e === null ? null : t.detail && t.detail.field, i._sortDir = e, i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), L(r, "ln-list:sorted", {
        field: i._sortField,
        direction: t.detail && t.detail.direction,
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort)), this;
  }
  _.prototype._parseChildren = function() {
    const r = Array.from(this.tbody.children).filter((i) => !i.classList.contains("ln-list__spacer"));
    this._data = [], r.length > 0 && (this._itemHeight = p(r[0]) || 50);
    for (let i = 0; i < r.length; i++) {
      const t = r[i], e = t.getAttribute("data-ln-item-id") || t.getAttribute("id"), n = t.textContent.trim().toLowerCase();
      let l = null;
      if (this.isDataDriven) {
        l = {}, e != null && (l.id = e);
        const v = t.querySelectorAll("[data-ln-list-field]");
        for (let A = 0; A < v.length; A++) {
          const S = v[A], q = S.getAttribute("data-ln-list-field");
          q && (l[q] = _t(S));
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
        ...l || {}
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, _.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      if (this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const r = this.currentSort.field, i = this.currentSort.direction === "desc" ? -1 : 1, t = this._filteredData.map(function(l) {
        return l[r];
      }), e = bt(t), n = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null;
      this._filteredData.sort(function(l, g) {
        return yt(l[r], g[r], e, n) * i;
      });
    } else {
      const r = this._searchTerm, i = r ? r.split(/\s+/).filter(Boolean) : [], t = this._filters || {}, e = Object.keys(t).length > 0;
      if (i.length === 0 && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(n) {
        if (i.length > 0 && !i.every(function(g) {
          return n.searchText && n.searchText.indexOf(g) !== -1;
        }))
          return !1;
        if (e)
          for (const l in t) {
            const g = t[l];
            if (g && g.length > 0) {
              const E = n.fields && n.fields[l] !== void 0 ? n.fields[l] : n[l] !== void 0 ? n[l] : null, v = E != null ? String(E).toLowerCase() : "";
              if (g.indexOf(v) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const n = this._sortField, l = this._sortDir === "desc" ? -1 : 1, g = typeof Intl < "u" ? new Intl.Collator(W(this.dom), { sensitivity: "base" }) : null, E = this._filteredData.map(function(A) {
          return A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n];
        }), v = bt(E);
        this._filteredData.sort(function(A, S) {
          const q = A.fields && A.fields[n] !== void 0 ? A.fields[n] : A[n], T = S.fields && S.fields[n] !== void 0 ? S.fields[n] : S[n];
          return yt(q, T, v, g) * l;
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
        const r = this._lastTotal, i = this.visibleCount;
        if (r === 0 || this._filteredData.length === 0 || i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, _.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, i = document.createDocumentFragment();
      for (let e = 0; e < r.length; e++) {
        const n = this._buildItem(r[e]);
        n && i.appendChild(n);
      }
      const t = u(this);
      this.tbody.textContent = "", this.tbody.appendChild(i), f(t), this._selectable && this._updateSelectAll();
    } else {
      const r = [], i = this._filteredData;
      for (let e = 0; e < i.length; e++) r.push(i[e].html);
      const t = u(this);
      this.tbody.innerHTML = r.join(""), f(t), this._selectable && this._restoreSelection();
    }
  }, _.prototype._readGridLayout = function() {
    const r = getComputedStyle(this.tbody), i = r.gridTemplateColumns;
    let t = 1;
    if (i && i !== "none") {
      const n = i.trim().split(/\s+/).filter(Boolean);
      n.length > 0 && (t = n.length);
    }
    const e = parseFloat(r.rowGap);
    return { columns: t, rowGap: isNaN(e) ? 0 : e };
  }, _.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const r = this._cache.peek(), i = r ? this._buildItem(r) : this._buildPlaceholderItem();
      i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = p(i) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const r = this._buildItem(this._data[0]);
        r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = p(r) || 50, this.tbody.textContent = "");
      }
    } else {
      const r = this.tbody.children;
      r.length > 0 && (this._itemHeight = p(r[0]) || 50);
    }
  }, _.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = s(this.dom);
    const i = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      r._itemHeight = 0, r._measureItemHeight(), r._vStart = -1, r._vEnd = -1, r._windowed ? r._renderWindowed() : r._renderVirtual();
    }, i.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, _.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, _.prototype._renderVirtual = function() {
    const r = this._filteredData, i = r.length, t = this._itemHeight;
    if (!t || !i) return;
    const e = this._scrollContainer;
    let n, l;
    if (e) {
      const H = this.tbody.getBoundingClientRect(), U = e.getBoundingClientRect(), K = e === this.tbody ? 0 : H.top - U.top + e.scrollTop;
      n = e.scrollTop - K, l = e.clientHeight;
    } else {
      const U = this.tbody.getBoundingClientRect().top + window.scrollY;
      n = window.scrollY - U, l = window.innerHeight;
    }
    const g = this._readGridLayout(), E = g.columns, v = g.rowGap, A = t + v, S = Math.ceil(i / E);
    let q = Math.max(0, Math.floor(n / A) - 15);
    q = Math.min(q, S);
    const T = Math.ceil(l / A) + 30, x = Math.min(q + T, S), k = Math.min(q * E, i), R = Math.min(x * E, i);
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
        const rt = this._buildItem(r[K]);
        rt && H.appendChild(rt);
      }
      if (z > 0) {
        const K = document.createElement(this.isUl ? "li" : "div");
        K.className = "ln-list__spacer", K.setAttribute("aria-hidden", "true"), K.style.height = z + "px", H.appendChild(K);
      }
      const U = u(this);
      this.tbody.textContent = "", this.tbody.appendChild(H), f(U), this._selectable && this._updateSelectAll();
    } else {
      let H = "";
      N > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${N}px"></${this.isUl ? "li" : "div"}>`);
      for (let K = k; K < R; K++)
        H += r[K].html;
      z > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${z}px"></${this.isUl ? "li" : "div"}>`);
      const U = u(this);
      this.tbody.innerHTML = H, f(U), this._selectable && this._restoreSelection();
    }
  }, _.prototype._buildPlaceholderItem = function() {
    const r = document.createElement(this.isUl ? "li" : "div");
    return r.className = "ln-list__placeholder", r.setAttribute("aria-hidden", "true"), r.style.height = this._itemHeight + "px", r;
  }, _.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const r = this._itemHeight;
    if (!r) return;
    const i = this._scrollContainer;
    let t, e;
    if (i) {
      const U = this.tbody.getBoundingClientRect(), K = i.getBoundingClientRect(), rt = i === this.tbody ? 0 : U.top - K.top + i.scrollTop;
      t = i.scrollTop - rt, e = i.clientHeight;
    } else {
      const K = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - K, e = window.innerHeight;
    }
    const n = this._readGridLayout(), l = n.columns, g = n.rowGap, E = r + g, v = this._cache.logicalTotal, A = Math.ceil(v / l);
    let S = Math.max(0, Math.floor(t / E) - 15);
    S = Math.min(S, A);
    const q = Math.ceil(e / E) + 30, T = Math.min(S + q, A), x = Math.min(S * l, v), k = Math.min(T * l, v), R = S * E, N = (A - T) * E, z = document.createDocumentFragment();
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
    this.tbody.textContent = "", this.tbody.appendChild(z), f(H), this._vStart = x, this._vEnd = k, this._cache.ensure(x, k);
  }, _.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let r = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount === 0 && i > 0, n = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = ct(this.dom, n, "ln-list"), !r) {
        const l = this.dom.querySelector("template[data-ln-empty]");
        if (l) {
          const g = e ? "search" : "initial", E = l.content.querySelector(`[data-ln-empty-when="${g}"]`) || l.content.firstElementChild;
          E && (r = document.importNode(E, !0));
        }
      }
    } else {
      const i = this.dom.querySelector(`template[${y}]`);
      if (i) {
        const t = i.content.firstElementChild;
        t && (r = document.importNode(t, !0));
      }
    }
    if (r)
      if (r.tagName === "LI" || r.tagName === "TR")
        this.tbody.appendChild(r);
      else {
        const i = document.createElement(this.isUl ? "li" : "div");
        i.appendChild(r), this.tbody.appendChild(i);
      }
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, _.prototype._buildItem = function(r) {
    const i = ct(this.dom, this.name + "-row", "ln-list");
    if (!i) return null;
    const t = i.querySelector("[data-ln-item]") || i.firstElementChild;
    if (!t) return null;
    if (Et(t, r), nt(t, r), t._lnRecord = r, r.id != null && (t.setAttribute("data-ln-item-id", r.id), this._selectable && this.selectedIds.has(String(r.id)))) {
      t.classList.add("ln-item-selected");
      const e = t.querySelector("[data-ln-item-select]");
      e && (e.checked = !0);
    }
    return t;
  }, _.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    for (let i = 0; i < r.length; i++) {
      const t = r[i].getAttribute("data-ln-item-id"), e = t != null && this.selectedIds.has(String(t));
      r[i].classList.toggle("ln-item-selected", e);
      const n = r[i].querySelector("[data-ln-item-select]");
      n && (n.checked = e);
    }
    this._updateSelectAll();
  }, _.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    this._onSelectionChange = function(i) {
      const t = i.target.closest("[data-ln-item-select]");
      if (!t) return;
      const e = t.closest("[data-ln-item]");
      if (!e) return;
      const n = e.getAttribute("data-ln-item-id");
      n != null && (t.checked ? (r.selectedIds.add(String(n)), e.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(n)), e.classList.remove("ln-item-selected")), r._updateSelectAll(), r._updateFooter(), L(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const i = r._selectAllCheckbox.checked, t = r.tbody.querySelectorAll("[data-ln-item]");
      for (let e = 0; e < t.length; e++) {
        const n = t[e], l = n.getAttribute("data-ln-item-id"), g = n.querySelector("[data-ln-item-select]");
        l != null && (i ? (r.selectedIds.add(String(l)), n.classList.add("ln-item-selected")) : (r.selectedIds.delete(String(l)), n.classList.remove("ln-item-selected")), g && (g.checked = i));
      }
      L(r.dom, "ln-list:select-all", { list: r.name, selected: i }), L(r.dom, "ln-list:select", {
        list: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedIds.size
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, _.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const r = this.tbody.querySelectorAll("[data-ln-item]");
    let i = r.length > 0;
    for (let t = 0; t < r.length; t++) {
      const e = r[t].getAttribute("data-ln-item-id");
      if (e != null && !this.selectedIds.has(String(e))) {
        i = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = i;
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
    const r = this, i = this.dom, t = parseInt(i.getAttribute("data-ln-list-window"), 10), e = parseInt(i.getAttribute("data-ln-list-window-page"), 10), n = parseInt(i.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), L(i, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = Wt(this._onCacheChange), this._cache = ge({
      windowSize: t > 0 ? t : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: n >= 0 ? n : 25,
      fetchDebounce: 120,
      requestPage: function(l, g, E) {
        L(i, "ln-list:request-data", {
          list: r.name,
          sort: l.sort,
          filters: l.filters,
          search: l.search,
          offset: g,
          limit: E,
          queryGen: r._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, _.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const r = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), i = r > 0 ? r : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: i,
        filtered: i
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
    let r = 0, i = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount) : (r = this._data.length, i = this._filteredData.length);
    const t = i < r;
    if (this._totalSpan && (this._totalSpan.textContent = c(r, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? c(i, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? c(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, _.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(d, a, _, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(r, i) {
      const t = r[a];
      if (!(!t || !t.isDataDriven)) {
        if (i === "data-ln-list-window") {
          const e = r.hasAttribute("data-ln-list-window");
          if (e && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!e && t._windowed)
            t._exitWindowedMode();
          else if (e && t._windowed) {
            const n = parseInt(r.getAttribute("data-ln-list-window"), 10);
            n > 0 && t._cache.configure({ windowSize: n });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (i === "data-ln-list-window-page") {
            const e = parseInt(r.getAttribute("data-ln-list-window-page"), 10);
            e > 0 && t._cache.configure({ pageSize: e });
          } else if (i === "data-ln-list-window-threshold") {
            const e = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
            e >= 0 && t._cache.configure({ threshold: e });
          } else if (i === "data-ln-list-count") {
            const e = parseInt(r.getAttribute("data-ln-list-count"), 10);
            e >= 0 && t._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const d = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", w = 36, b = 16, m = 2 * Math.PI * b;
  function h(f) {
    return this.dom = f, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, c.call(this), u.call(this), s.call(this), this;
  }
  h.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[a]);
  };
  function o(f, p) {
    const _ = document.createElementNS(y, f);
    for (const r in p)
      _.setAttribute(r, p[r]);
    return _;
  }
  function c() {
    this.svg = o("svg", {
      viewBox: "0 0 " + w + " " + w,
      "aria-hidden": "true"
    }), this.trackCircle = o("circle", {
      cx: w / 2,
      cy: w / 2,
      r: b,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = o("circle", {
      cx: w / 2,
      cy: w / 2,
      r: b,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + w / 2 + " " + w / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function s() {
    const f = this, p = new MutationObserver(function(_) {
      for (const r of _)
        (r.attributeName === "data-ln-circular-progress" || r.attributeName === "data-ln-circular-progress-max" || r.attributeName === "data-ln-circular-progress-label") && u.call(f);
    });
    p.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = p;
  }
  function u() {
    const f = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, p = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let _ = p > 0 ? f / p * 100 : 0;
    _ < 0 && (_ = 0), _ > 100 && (_ = 100);
    const r = m - _ / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", r);
    const i = this.dom.getAttribute("data-ln-circular-progress-label"), t = i !== null ? i : Math.round(_) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(p));
    const e = Math.max(0, Math.min(f, p));
    this.dom.setAttribute("aria-valuenow", String(e)), this.dom.setAttribute("aria-valuetext", t), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: f,
      max: p,
      percentage: _
    });
  }
  B(d, a, h, "ln-circular-progress");
})();
(function() {
  const d = "data-ln-sortable", a = "lnSortable", y = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function w(m) {
    this.dom = m, this.isEnabled = m.getAttribute(d) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const h = this;
    return this._onPointerDown = function(o) {
      h.isEnabled && h._handlePointerDown(o);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  w.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(d, "");
  }, w.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(d, "disabled");
  }, w.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, w.prototype._handlePointerDown = function(m) {
    let h = m.target.closest("[" + y + "]"), o;
    if (h) {
      for (o = h; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (o = m.target; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
      h = o;
    }
    const s = Array.from(this.dom.children).indexOf(o);
    if (Q(this.dom, "ln-sortable:before-drag", {
      item: o,
      index: s
    }).defaultPrevented) return;
    m.preventDefault(), h.setPointerCapture(m.pointerId), this._dragging = o, o.classList.add("ln-sortable--dragging"), o.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: o,
      index: s
    });
    const f = this, p = function(r) {
      f._handlePointerMove(r);
    }, _ = function(r) {
      f._handlePointerEnd(r), h.removeEventListener("pointermove", p), h.removeEventListener("pointerup", _), h.removeEventListener("pointercancel", _);
    };
    h.addEventListener("pointermove", p), h.addEventListener("pointerup", _), h.addEventListener("pointercancel", _);
  }, w.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const h = Array.from(this.dom.children), o = this._dragging;
    for (const c of h)
      c.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const c of h) {
      if (c === o) continue;
      const s = c.getBoundingClientRect(), u = s.top + s.height / 2;
      if (m.clientY >= s.top && m.clientY < u) {
        c.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= u && m.clientY <= s.bottom) {
        c.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, w.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const h = this._dragging, o = Array.from(this.dom.children), c = o.indexOf(h);
    let s = null, u = null;
    for (const f of o) {
      if (f.classList.contains("ln-sortable--drop-before")) {
        s = f, u = "before";
        break;
      }
      if (f.classList.contains("ln-sortable--drop-after")) {
        s = f, u = "after";
        break;
      }
    }
    for (const f of o)
      f.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (h.classList.remove("ln-sortable--dragging"), h.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), s && s !== h) {
      u === "before" ? this.dom.insertBefore(h, s) : this.dom.insertBefore(h, s.nextElementSibling);
      const p = Array.from(this.dom.children).indexOf(h);
      L(this.dom, "ln-sortable:reordered", {
        item: h,
        oldIndex: c,
        newIndex: p
      });
    }
    this._dragging = null;
  };
  function b(m) {
    const h = m[a];
    if (!h) return;
    const o = m.getAttribute(d) !== "disabled";
    o !== h.isEnabled && (h.isEnabled = o, L(m, o ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  B(d, a, w, "ln-sortable", {
    onAttributeChange: b
  });
})();
(function() {
  const d = "data-ln-confirm", a = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function b(...h) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...h);
  }
  function m(h) {
    b("constructor called on", h), this.dom = h, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = h.querySelector("[data-ln-confirm-idle]"), this.activeEl = h.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = h.textContent.trim(), this.confirmText = h.getAttribute(d) || "Confirm?");
    const o = this;
    return this._onClick = function(c) {
      if (b("click handler, confirming:", o.confirming, "submitted:", o._submitted, "target:", c.target), !o.confirming)
        c.preventDefault(), c.stopImmediatePropagation(), o._enterConfirm();
      else {
        if (o._submitted) return;
        o._submitted = !0, c.stopPropagation(), o._reset();
      }
    }, h.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const h = parseFloat(this.dom.getAttribute(y));
    return isNaN(h) || h <= 0 ? 3 : h;
  }, m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const o = this.activeEl ? this.activeEl.textContent.trim() : "";
      o && (this.dom.setAttribute("aria-label", o), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = h.getAttribute("href"), h.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const h = this, o = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      h._reset();
    }, o);
  }, m.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      var h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalIconHref && h.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    b("destroy called on", this.dom), this.dom[a] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, B(d, a, m, "ln-confirm");
})();
(function() {
  const d = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function w(b) {
    this.dom = b, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = b.getAttribute(d + "-default") || "", this.placeholderLabel = b.getAttribute(d + "-placeholder") || "{lang} translation", this.removeLabel = b.getAttribute(d + "-remove-label") || "Remove {lang}", this.badgesEl = b.querySelector("[" + d + "-active]"), this.menuEl = b.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = b.getAttribute(d + "-locales");
    if (this.locales = y, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const h = this;
    return this._onRequestAdd = function(o) {
      o.detail && o.detail.lang && h.addLanguage(o.detail.lang);
    }, this._onRequestRemove = function(o) {
      o.detail && o.detail.lang && h.removeLanguage(o.detail.lang);
    }, b.addEventListener("ln-translations:request-add", this._onRequestAdd), b.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  w.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const b = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of b) {
      const h = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const o of h)
        o.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, w.prototype._detectExisting = function() {
    const b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of b) {
      const h = m.getAttribute("data-ln-translatable-lang");
      h && h !== this.defaultLang && this.activeLanguages.add(h);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, w.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const b = this;
    let m = 0;
    for (const o in this.locales) {
      if (!this.locales.hasOwnProperty(o) || this.activeLanguages.has(o)) continue;
      m++;
      const c = Lt("ln-translations-menu-item", "ln-translations");
      if (!c) return;
      const s = c.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", o), s.textContent = this.locales[o], s.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), b.menuEl.getAttribute("data-ln-toggle") === "open" && b.menuEl.setAttribute("data-ln-toggle", "close"), b.addLanguage(o));
      }), this.menuEl.appendChild(c);
    }
    const h = this.dom.querySelector("[" + d + "-add]");
    h && (h.hidden = m === 0);
  }, w.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const b = this;
    this.activeLanguages.forEach(function(m) {
      const h = Lt("ln-translations-badge", "ln-translations");
      if (!h) return;
      const o = h.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", m);
      const c = o.querySelector("span");
      c.textContent = b.locales[m] || m.toUpperCase();
      const s = o.querySelector("button"), u = b.locales[m] || m.toUpperCase();
      s.setAttribute("aria-label", b.removeLabel.replace("{lang}", u)), s.addEventListener("click", function(f) {
        f.ctrlKey || f.metaKey || f.button === 1 || (f.preventDefault(), f.stopPropagation(), b.removeLanguage(m));
      }), b.badgesEl.appendChild(h);
    });
  }, w.prototype.addLanguage = function(b, m) {
    if (this.activeLanguages.has(b)) return;
    const h = this.locales[b] || b;
    if (Q(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: b,
      langName: h
    }).defaultPrevented) return;
    this.activeLanguages.add(b), m = m || {};
    const c = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const s of c) {
      const u = s.getAttribute("data-ln-translatable"), f = s.getAttribute("data-ln-translations-prefix") || "", p = s.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!p) continue;
      const _ = p.cloneNode(p.tagName === "SELECT");
      f ? _.name = f + "[trans][" + b + "][" + u + "]" : _.name = "trans[" + b + "][" + u + "]", _.value = m[u] !== void 0 ? m[u] : "", _.removeAttribute("id"), "placeholder" in _ && (_.placeholder = this.placeholderLabel.replace("{lang}", h)), _.setAttribute("data-ln-translatable-lang", b);
      const r = s.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), i = r.length > 0 ? r[r.length - 1] : p;
      i.parentNode.insertBefore(_, i.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: b,
      langName: h
    });
  }, w.prototype.removeLanguage = function(b) {
    if (!this.activeLanguages.has(b) || Q(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: b
    }).defaultPrevented) return;
    const h = this.dom.querySelectorAll('[data-ln-translatable-lang="' + b + '"]');
    for (const o of h)
      o.parentNode.removeChild(o);
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
    const b = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of m)
      h.getAttribute("data-ln-translatable-lang") !== b && h.parentNode.removeChild(h);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, B(d, a, w, "ln-translations");
})();
(function() {
  const d = "data-ln-autosave", a = "lnAutosave", y = "data-ln-autosave-clear", w = "data-ln-autosave-debounce-input", b = "ln-autosave:";
  if (window[a] !== void 0) return;
  function h(u) {
    const f = o(u);
    if (!f) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", u);
      return;
    }
    this.dom = u, this.key = f;
    let p = null;
    function _() {
      const e = ce(u, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(f, JSON.stringify(e));
      } catch {
        return;
      }
      L(u, "ln-autosave:saved", { target: u, data: e });
    }
    function r() {
      let e;
      try {
        e = localStorage.getItem(f);
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
      if (Q(u, "ln-autosave:before-restore", { target: u, data: n }).defaultPrevented) return;
      const g = de(u, n);
      for (let E = 0; E < g.length; E++)
        g[E].dispatchEvent(new Event("input", { bubbles: !0 })), g[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(u, "ln-autosave:restored", { target: u, data: n });
    }
    function i() {
      try {
        localStorage.removeItem(f);
      } catch {
        return;
      }
      L(u, "ln-autosave:cleared", { target: u });
    }
    this._onFocusout = function(e) {
      const n = e.target;
      c(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && _();
    }, this._onChange = function(e) {
      const n = e.target;
      c(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && _();
    }, this._onSubmit = function() {
      i();
    }, this._onReset = function() {
      i();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + y + "]") && i();
    }, u.addEventListener("focusout", this._onFocusout), u.addEventListener("change", this._onChange), u.addEventListener("submit", this._onSubmit), u.addEventListener("reset", this._onReset), u.addEventListener("click", this._onClearClick);
    const t = s(u);
    return t > 0 && (this._onInput = function(e) {
      const n = e.target;
      !c(n) || !n.name || n.hasAttribute("data-ln-autosave-exclude") || (p !== null && clearTimeout(p), p = setTimeout(_, t));
    }, u.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return p;
    }, r(), this;
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
  function o(u) {
    const p = u.getAttribute(d) || u.id;
    return p ? b + window.location.pathname + ":" + p : null;
  }
  function c(u) {
    const f = u.tagName;
    return f === "INPUT" || f === "TEXTAREA" || f === "SELECT";
  }
  function s(u) {
    if (!u.hasAttribute(w)) return 0;
    const f = u.getAttribute(w);
    if (f === "" || f === null) return 1e3;
    const p = parseInt(f, 10);
    return isNaN(p) || p < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", u), 1e3) : p;
  }
  B(d, a, h, "ln-autosave");
})();
(function() {
  const d = "data-ln-autoresize", a = "lnAutoresize";
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
  }, B(d, a, y, "ln-autoresize");
})();
(function() {
  const d = "data-ln-editor", a = "lnEditor";
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
  }, m = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let h = 0;
  function o(t) {
    return !!(w[t] || b[t] || m[t] || t === "link");
  }
  function c(t) {
    this.dom = t;
    const e = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const n = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), n && this._surface.setAttribute("data-placeholder", n);
    const l = this._textarea.id;
    if (l) {
      const A = t.querySelector('label[for="' + l + '"]');
      A && (A.id || (A.id = l + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = l ? l + "-surface" : "ln-editor-surface-" + ++h;
    const g = this._textarea.value.trim();
    g && (this._surface.innerHTML = g);
    const E = t.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? t.insertBefore(this._surface, E.nextSibling) : t.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const A = E.querySelectorAll("[data-ln-editor-action]");
      for (let S = 0; S < A.length; S++) {
        const q = A[S].getAttribute("data-ln-editor-action");
        o(q) && A[S].setAttribute("aria-pressed", "false");
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
      f(e, A);
    }, this._onKeydown = function(A) {
      r(e, A);
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
  c.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, c.prototype._execAction = function(t) {
    if (!(!t || Q(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), w[t])
        document.execCommand(w[t], !1, null);
      else if (b[t]) {
        const n = b[t], l = s(this._surface);
        l && l.toLowerCase() === n ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + n + ">");
      } else m[t] ? document.execCommand(m[t], !1, null) : t === "link" ? i(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, c.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = e.anchorNode;
    if (!n || !this._surface.contains(n)) return;
    const l = t.querySelectorAll("[data-ln-editor-action]");
    for (let g = 0; g < l.length; g++) {
      const E = l[g], v = E.getAttribute("data-ln-editor-action");
      let A = !1;
      if (w[v])
        try {
          A = document.queryCommandState(w[v]);
        } catch {
        }
      else if (b[v]) {
        const S = s(this._surface);
        A = S && S.toLowerCase() === b[v];
      } else if (m[v])
        try {
          A = document.queryCommandState(m[v]);
        } catch {
        }
      else v === "link" && (A = !!u(e.anchorNode, "A", this._surface));
      o(v) && E.setAttribute("aria-pressed", String(A)), A ? E.classList.add("ln-editor-active") : E.classList.remove("ln-editor-active");
    }
  }, c.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, c.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, c.prototype.destroy = function() {
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
  function s(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return null;
    let n = e.anchorNode;
    if (!n) return null;
    for (; n && n !== t; ) {
      if (n.nodeType === 1) {
        const l = n.tagName;
        if (l === "H2" || l === "H3" || l === "H4" || l === "BLOCKQUOTE" || l === "PRE" || l === "P")
          return l;
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
  function f(t, e) {
    e.preventDefault();
    let n = "";
    if (e.clipboardData && (n = e.clipboardData.getData("text/html"), !n)) {
      const g = e.clipboardData.getData("text/plain");
      g && (n = g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), n = "<p>" + n + "</p>");
    }
    if (!n) return;
    const l = p(n);
    l && document.execCommand("insertHTML", !1, l);
  }
  function p(t) {
    const e = document.createElement("div");
    return e.innerHTML = t, _(e), e.innerHTML;
  }
  function _(t) {
    const e = Array.from(t.childNodes);
    for (let n = 0; n < e.length; n++) {
      const l = e[n];
      if (l.nodeType !== 3) {
        if (l.nodeType !== 1) {
          t.removeChild(l);
          continue;
        }
        if (y[l.tagName]) {
          const g = Array.from(l.attributes);
          for (let E = 0; E < g.length; E++) {
            const v = g[E].name;
            if (l.tagName === "A" && v === "href") {
              const A = l.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || l.removeAttribute("href");
            } else
              l.removeAttribute(v);
          }
          l.tagName === "A" && l.setAttribute("rel", "noopener noreferrer"), _(l);
        } else {
          for (; l.firstChild; )
            t.insertBefore(l.firstChild, l);
          t.removeChild(l);
        }
      }
    }
  }
  function r(t, e) {
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
  function i(t) {
    const e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    const n = u(e.anchorNode, "A", t._surface), l = e.getRangeAt(0).cloneRange();
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
      H.removeAllRanges(), H.addRange(l);
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
  B(d, a, c, "ln-editor");
})();
(function() {
  const d = "lnFill";
  if (window[d] !== void 0) return;
  const a = { lnFillForm: !0, lnFillStore: !0 };
  function y(b) {
    const m = {}, h = b.dataset;
    for (const o in h) {
      if (!o.startsWith("lnFill") || a[o]) continue;
      const c = o.slice(6);
      c && (m[c.charAt(0).toLowerCase() + c.slice(1)] = h[o]);
    }
    return m;
  }
  function w(b, m) {
    const h = window.CSS && CSS.escape ? CSS.escape(m) : m, o = document.querySelectorAll('[data-ln-fill-id="' + h + '"]');
    if (o.length === 0) return null;
    for (let c = 0; c < o.length; c++) {
      const s = o[c].getAttribute("data-ln-fill-form");
      if (s) {
        const u = document.getElementById(s);
        if (u && b.contains(u)) return o[c];
      }
    }
    return o[0];
  }
  document.addEventListener("click", function(b) {
    if (b.ctrlKey || b.metaKey || b.button === 1) return;
    const m = b.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const h = m.getAttribute("href");
    if (h && h.indexOf("#") !== -1) return;
    const o = m.getAttribute("data-ln-fill-form"), c = document.getElementById(o);
    if (!c) return;
    const s = y(m), u = Object.keys(s).length > 0;
    window.lnCore.lnFill(c, u ? s : null);
  }), document.addEventListener("ln-fill:request", function(b) {
    const m = b.detail;
    if (!m) return;
    const h = b.target, o = m.id;
    if (o == null) {
      window.lnCore.lnFill(h, null);
      return;
    }
    const c = w(h, o);
    if (!c) return;
    const s = y(c);
    window.lnCore.lnFill(h, s);
  }), window[d] = !0;
})();
(function() {
  const d = "data-ln-slug-from", a = "lnSlug";
  if (window[a] !== void 0) return;
  function y(b) {
    return String(b).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function w(b) {
    if (b.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", b.tagName), this;
    const m = b.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", b), this;
    const h = b.getAttribute(d), o = m.elements[h];
    if (!o)
      return console.warn('[ln-slug] Source field "' + h + '" not found in form:', b), this;
    if (typeof o.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + h + '" is a RadioNodeList (same-name group) — single source field required:', b), this;
    this.dom = b, this.source = o, this._pristine = b.value === "", this._mirroring = !1;
    const c = this;
    return this._onSource = function() {
      c._pristine && c._mirror();
    }, this._onSlug = function() {
      c._mirroring || (c._pristine = c.dom.value === "");
    }, o.addEventListener("input", this._onSource), b.addEventListener("input", this._onSlug), this;
  }
  w.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = y(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, w.prototype.destroy = function() {
    this.dom[a] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[a]);
  }, B(d, a, w, "ln-slug");
})();
(function() {
  const d = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const y = {}, w = {};
  function b(v) {
    return v.getAttribute("data-ln-time-locale") || W(v);
  }
  function m(v, A) {
    const S = (v || "") + "|" + JSON.stringify(A);
    return y[S] || (y[S] = new Intl.DateTimeFormat(v, A)), y[S];
  }
  function h(v) {
    const A = v || "";
    return w[A] || (w[A] = new Intl.RelativeTimeFormat(v, { numeric: "auto", style: "narrow" })), w[A];
  }
  const o = /* @__PURE__ */ new Set();
  let c = null;
  function s() {
    c || (c = setInterval(f, 6e4));
  }
  function u() {
    c && (clearInterval(c), c = null);
  }
  function f() {
    for (const v of o) {
      if (!document.body.contains(v.dom)) {
        o.delete(v);
        continue;
      }
      e(v);
    }
    o.size === 0 && u();
  }
  function p(v, A) {
    const S = vt(A), q = (A || "").toLowerCase().split("-")[0], T = m(A, { dateStyle: "long", timeStyle: "short" }), x = T.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && x !== q && S.monthsLong) {
      const k = S.monthsLong[v.getMonth()], R = v.getDate(), N = v.getFullYear(), z = String(v.getHours()).padStart(2, "0"), H = String(v.getMinutes()).padStart(2, "0");
      return `${R} ${k} ${N} во ${z}:${H}`;
    }
    return T.format(v);
  }
  function _(v, A) {
    const S = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    v.getFullYear() !== S.getFullYear() && (q.year = "numeric");
    const T = vt(A), x = (A || "").toLowerCase().split("-")[0], k = m(A, q), R = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (T && R !== x && T.monthsShort) {
      const N = T.monthsShort[v.getMonth()], z = v.getDate(), H = v.getFullYear() !== S.getFullYear() ? " " + v.getFullYear() : "";
      return `${z} ${N}${H}`;
    }
    return k.format(v);
  }
  function r(v, A) {
    return m(A, { dateStyle: "medium" }).format(v);
  }
  function i(v, A) {
    return m(A, { timeStyle: "short" }).format(v);
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
    const q = new Date(S * 1e3), T = v.dom.getAttribute(d) || "short", x = b(v.dom);
    let k;
    switch (T) {
      case "relative":
        k = t(q, x);
        break;
      case "full":
        k = p(q, x);
        break;
      case "date":
        k = r(q, x);
        break;
      case "time":
        k = i(q, x);
        break;
      default:
        k = _(q, x);
        break;
    }
    v.dom.textContent = k, T !== "full" && (v.dom.title = p(q, x));
  }
  function n(v) {
    return this.dom = v, e(this), v.getAttribute(d) === "relative" && (o.add(this), s()), this;
  }
  n.prototype.render = function() {
    e(this);
  }, n.prototype.destroy = function() {
    o.delete(this), o.size === 0 && u(), delete this.dom[a];
  };
  function l(v) {
    const A = v[a];
    if (!A) return;
    v.getAttribute(d) === "relative" ? (o.add(A), s()) : (o.delete(A), o.size === 0 && u()), e(A);
  }
  function g(v) {
    v.nodeType === 1 && v.hasAttribute && v.hasAttribute(d) && v[a] && e(v[a]);
  }
  function E() {
    new MutationObserver(function() {
      const v = document.querySelectorAll("[" + d + "]");
      for (let A = 0; A < v.length; A++) {
        const S = v[A][a];
        S && e(S);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  B(d, a, n, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: l,
    onInit: g
  }), E();
})();
function rn(d) {
  d = d || {};
  let a = d.windowSize > 0 ? d.windowSize : 1e3, y = d.pageSize > 0 ? d.pageSize : 200, w = d.fetchDebounce != null ? d.fetchDebounce : 120;
  const b = typeof d.requestPage == "function" ? d.requestPage : function() {
  }, m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let c = 0, s = 0, u = 0, f = null, p = 0;
  function _(t) {
    h.set(t, ++p);
  }
  function r() {
    if (m.size <= a) return;
    const t = Array.from(m.keys()).sort(function(n, l) {
      return (h.get(n) || 0) - (h.get(l) || 0);
    });
    let e = 0;
    for (; m.size > a && e < t.length; )
      m.delete(t[e]), h.delete(t[e]), e++;
  }
  function i(t, e, n) {
    o.add(t), b(t, e, n);
  }
  return {
    get logicalTotal() {
      return c;
    },
    set logicalTotal(t) {
      c = t;
    },
    get grandTotal() {
      return s;
    },
    set grandTotal(t) {
      s = t;
    },
    get queryGen() {
      return u;
    },
    set queryGen(t) {
      u = t;
    },
    get size() {
      return m.size;
    },
    getId: function(t) {
      if (m.has(t))
        return _(t), m.get(t);
    },
    // The caller asks for an exact range it already decided it needs — the
    // index is an id resolver, not a scroll surface. Prefetch padding is the
    // view's job (it owns the viewport); padding here would fetch a page
    // nobody asked for on top of every page the view asks for.
    ensure: function(t, e, n) {
      if (c <= 0) {
        o.has(0) || (clearTimeout(f), f = setTimeout(function() {
          i(0, y, n);
        }, w));
        return;
      }
      const l = Math.max(0, t), g = Math.min(c, e), E = Math.floor(l / y), v = Math.floor(Math.max(0, g - 1) / y);
      let A = -1;
      for (let S = E; S <= v; S++) {
        const q = S * y, T = Math.min(y, c - q);
        let x = !1;
        const k = Math.max(q, l), R = Math.min(q + T, g);
        for (let N = k; N < R; N++)
          if (!m.has(N)) {
            x = !0;
            break;
          }
        if (x && !o.has(q)) {
          A = q;
          break;
        }
      }
      A !== -1 && (clearTimeout(f), f = setTimeout(function() {
        i(A, y, n);
      }, w));
    },
    ingest: function(t, e, n, l, g) {
      if (!(g != null && g !== u)) {
        s = n ?? s, c = l ?? c;
        for (let E = 0; E < e.length; E++)
          m.set(t + E, e[E]), _(t + E);
        o.delete(t), r();
      }
    },
    // Query change: new generation, positions dropped. The totals are kept
    // as the stale-while-revalidate carry-over the view renders against
    // until the new generation's first page lands in ingest() — same
    // contract as createWindowCache.invalidate().
    reset: function() {
      u++, m.clear(), h.clear(), o.clear(), clearTimeout(f);
    },
    clear: function() {
      m.clear(), h.clear(), o.clear(), clearTimeout(f);
    },
    configure: function(t) {
      if (t = t || {}, t.windowSize != null && t.windowSize > 0 && t.windowSize !== a) {
        const e = t.windowSize < a;
        a = t.windowSize, e && r();
      }
      t.pageSize != null && t.pageSize > 0 && (y = t.pageSize), t.fetchDebounce != null && t.fetchDebounce >= 0 && (w = t.fetchDebounce);
    }
  };
}
(function() {
  const d = "data-ln-data-store", a = "lnDataStore";
  if (window[a] !== void 0) return;
  const y = "ln_app_cache", w = "_meta", b = "1.0";
  let m = null, h = null;
  const o = {};
  function c(C) {
    C && C.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function s() {
    const C = {};
    for (const I of document.querySelectorAll(`[${d}]`)) {
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
      const I = s(), D = Object.keys(I), M = indexedDB.open(y);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, M.onsuccess = (O) => {
        const F = O.target.result, P = Array.from(F.objectStoreNames);
        if (!(!P.includes(w) || D.some((tt) => !P.includes(tt))))
          return f(F), m = F, C(F);
        const V = F.version;
        F.close();
        const G = indexedDB.open(y, V + 1);
        G.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, G.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, G.onupgradeneeded = (tt) => {
          const ot = tt.target.result;
          ot.objectStoreNames.contains(w) || ot.createObjectStore(w, { keyPath: "key" });
          for (const Rt of D)
            if (!ot.objectStoreNames.contains(Rt)) {
              const Ne = ot.createObjectStore(Rt, { keyPath: "id" });
              for (const Zt of I[Rt].indexes)
                Ne.createIndex(Zt, Zt, { unique: !1 });
            }
        }, G.onsuccess = (tt) => {
          const ot = tt.target.result;
          f(ot), m = ot, C(ot);
        };
      };
    }), h);
  }
  function f(C) {
    C.onversionchange = () => {
      C.close(), m = null, h = null;
    };
  }
  function p() {
    return m ? Promise.resolve(m) : (h = null, u());
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
  async function r(C) {
    return !C || !C.encrypted || !dt() ? C : $e(C);
  }
  const i = (C, I) => p().then((D) => D ? D.transaction(C, I).objectStore(C) : null);
  function t(C) {
    return new Promise((I, D) => {
      C.onsuccess = () => I(C.result), C.onerror = () => {
        c(C.error), D(C.error);
      };
    });
  }
  const e = (C) => i(C, "readonly").then((I) => I ? t(I.getAll()) : []).then((I) => dt() ? Promise.all(I.map((D) => r(D))) : I), n = (C, I) => i(C, "readonly").then((D) => D ? t(D.get(I)) : null).then((D) => D ? r(D) : null), l = (C, I) => p().then((D) => {
    if (!D) return [];
    const O = D.transaction(C, "readonly").objectStore(C), F = I.map((P) => t(O.get(P)));
    return Promise.all(F).then((P) => dt() ? Promise.all(P.map((j) => r(j))) : P);
  }), g = (C, I) => (dt() ? _(I) : Promise.resolve(I)).then((M) => i(C, "readwrite").then((O) => O ? t(O.put(M)) : null)), E = (C, I) => i(C, "readwrite").then((D) => D ? t(D.delete(I)) : null), v = (C) => i(C, "readwrite").then((I) => I ? t(I.clear()) : null), A = (C) => i(C, "readonly").then((I) => I ? t(I.count()) : 0), S = (C) => i(w, "readonly").then((I) => I ? t(I.get(C)) : null), q = (C, I) => i(w, "readwrite").then((D) => {
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
        requestPage: (j, V, G) => {
          L(this.dom, "ln-data-store:request-page", {
            store: this._name,
            offset: j,
            limit: V,
            query: G,
            queryGen: this._windowIndex.queryGen
          });
        }
      });
    } else
      this._windowIndex = null;
    return this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), o[this._name] = this, x(this), this.ready = rt(this), this;
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
    return p().then((D) => D ? (dt() ? Promise.all(I.map((O) => _(O))) : Promise.resolve(I)).then((O) => new Promise((F, P) => {
      const j = D.transaction(C, "readwrite"), V = j.objectStore(C);
      O.forEach((G) => V.put(G)), j.oncomplete = () => F(), j.onerror = () => {
        c(j.error), P(j.error);
      };
    })) : void 0);
  }
  function Yt(C, I) {
    return p().then((D) => {
      if (D)
        return new Promise((M, O) => {
          const F = D.transaction(C, "readwrite"), P = F.objectStore(C);
          I.forEach((j) => P.delete(j)), F.oncomplete = () => M(), F.onerror = () => O(F.error);
        });
    });
  }
  function Ie(C, I, D) {
    return (dt() ? _(D) : Promise.resolve(D)).then((O) => p().then((F) => {
      if (F)
        return new Promise((P, j) => {
          const V = F.transaction(C, "readwrite"), G = V.objectStore(C);
          G.put(O), G.delete(I), V.oncomplete = () => P(), V.onerror = () => {
            c(V.error), j(V.error);
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
      const G = typeof j == "string" && typeof V == "string" ? De.compare(j, V) : j < V ? -1 : j > V ? 1 : 0;
      return O ? -G : G;
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
      return l(I._name, F).then((P) => {
        const j = /* @__PURE__ */ new Map();
        for (let G = 0; G < P.length; G++) {
          const tt = P[G];
          tt && j.set(String(tt.id), tt);
        }
        const V = [];
        for (let G = 0; G < O.length; G++) {
          const tt = O[G];
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
    delete o[this._name], delete this.dom[a], L(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function Fe() {
    return p().then((C) => {
      if (!C) return;
      const I = Array.from(C.objectStoreNames);
      return new Promise((D, M) => {
        const O = C.transaction(I, "readwrite");
        I.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => D(), O.onerror = () => M(O.error);
      });
    }).then(() => {
      Object.values(o).forEach((C) => {
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
  B(d, a, T, "ln-data-store"), window[a].clearAll = Fe, window[a].init = window[a], window[a].setStorageKey = ee, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ee);
})();
(function() {
  const d = "data-ln-api-connector", a = "lnApiConnector", y = "lnConnector";
  if (window[a] !== void 0) return;
  function w(o) {
    return o.ok ? o.status === 204 ? null : o.json() : o.json().catch(() => null).then((c) => {
      const s = new Error("HTTP " + o.status + ": " + o.statusText);
      throw s.status = o.status, s.data = c, s;
    });
  }
  function b(o) {
    return this.dom = o, o[a] = this, o[y] = this, this._inflight = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, m(this), this;
  }
  b.prototype.refreshConfig = function() {
    const o = this.dom;
    this.baseUrl = o.getAttribute("data-ln-api-base-url") || "", this.path = o.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: o.getAttribute("data-ln-api-param-offset") || "offset",
      limit: o.getAttribute("data-ln-api-param-limit") || "limit",
      search: o.getAttribute("data-ln-api-param-search") || "search",
      sortField: o.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: o.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const c = o.getAttribute("data-ln-api-headers") || "";
    this.headers = fe(c, "ln-api-connector"), (c.toLowerCase().includes("authorization") || c.toLowerCase().includes("bearer") || c.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(o, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, b.prototype._reqHeaders = function(o) {
    const c = Object.assign({}, gt(this.headers), { "X-LN-Response": "data" });
    return o && (c["Idempotency-Key"] = o), c;
  }, b.prototype.fetchDelta = function(o, c) {
    const s = this;
    let u = X(s.baseUrl, s.path);
    o != null && o !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(o));
    const f = c || "sync";
    s._inflight.has(f) && s._inflight.get(f).abort();
    const p = new AbortController();
    return s._inflight.set(f, p), window.fetch(u, {
      method: "GET",
      headers: s._reqHeaders(),
      credentials: s.credentials,
      signal: p.signal
    }).then(w).finally(function() {
      s._inflight.get(f) === p && s._inflight.delete(f);
    });
  }, b.prototype.query = function(o, c) {
    const s = this;
    o = o || {};
    let u = X(s.baseUrl, s.path);
    const f = s.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, p = new URLSearchParams();
    o.search && p.append(f.search, o.search), o.offset != null && p.append(f.offset, o.offset), o.limit != null && p.append(f.limit, o.limit), o.sort && o.sort.field && o.sort.direction && (p.append(f.sortField, o.sort.field), p.append(f.sortDir, o.sort.direction)), o.filters && typeof o.filters == "object" && Object.keys(o.filters).forEach((e) => {
      const n = o.filters[e];
      Array.isArray(n) && n.length > 0 && p.append(e, n.join(","));
    });
    const _ = p.toString();
    _ && (u += (u.indexOf("?") !== -1 ? "&" : "?") + _);
    let r = null;
    c && (s._inflight.has(c) && s._inflight.get(c).abort(), r = new AbortController(), s._inflight.set(c, r));
    const i = {
      method: "GET",
      headers: s._reqHeaders(),
      credentials: s.credentials
    };
    r && (i.signal = r.signal);
    let t = window.fetch(u, i).then(w);
    return c && r && (t = t.finally(function() {
      s._inflight.get(c) === r && s._inflight.delete(c);
    })), t;
  }, b.prototype.create = function(o, c, s) {
    const u = this;
    return window.fetch(X(u.baseUrl, c || u.path), {
      method: "POST",
      headers: u._reqHeaders(s),
      credentials: u.credentials,
      body: JSON.stringify(o)
    }).then(w);
  }, b.prototype.update = function(o, c, s, u, f) {
    const p = this;
    s != null && (c = Object.assign({}, c, { expected_version: s }));
    const _ = u ? X(p.baseUrl, u) : X(p.baseUrl, p.path, o);
    return window.fetch(_, {
      method: "PUT",
      headers: p._reqHeaders(f),
      credentials: p.credentials,
      body: JSON.stringify(c)
    }).then(w);
  }, b.prototype.delete = function(o, c, s) {
    const u = this;
    return window.fetch(X(u.baseUrl, c || u.path, o), {
      method: "DELETE",
      headers: u._reqHeaders(s),
      credentials: u.credentials
    }).then(w);
  }, b.prototype.bulkDelete = function(o, c, s) {
    const u = this;
    return window.fetch(X(u.baseUrl, c || u.path) + "/bulk-delete", {
      method: "DELETE",
      headers: u._reqHeaders(s),
      credentials: u.credentials,
      body: JSON.stringify({ ids: o })
    }).then(w);
  };
  function m(o) {
    o._handlers = {
      sync: function(s) {
        const u = s.detail || {}, f = u.meta && u.meta.targetEl ? u.meta.targetEl : null;
        o.fetchDelta(u.since, f).then(function(p) {
          L(o.dom, "ln-api-connector:fetched", { data: p, since: u.since, meta: u.meta || null });
        }).catch(function(p) {
          p && p.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "sync",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            since: u.since,
            meta: u.meta || null
          });
        });
      },
      query: function(s) {
        const u = s.detail || {}, f = u.query || u, p = u.meta && u.meta.targetEl ? u.meta.targetEl : null;
        o.query(f, p).then(function(_) {
          const r = _ || {};
          L(o.dom, "ln-api-connector:fetched", {
            data: r.data || (Array.isArray(r) ? r : []),
            total: r.total,
            filtered: r.filtered,
            offset: f.offset,
            queryGen: f.queryGen,
            meta: u.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || L(o.dom, "ln-api-connector:error", {
            action: "query",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            meta: u.meta || null
          });
        });
      },
      create: function(s) {
        const u = s.detail || {};
        o.create(u.data, u.url, u.idempotencyKey).then(function(f) {
          const p = f && f.content !== void 0 ? f.content : f, _ = f && f.message ? f.message : null;
          L(o.dom, "ln-api-connector:created", { record: p, tempId: u.tempId, message: _, meta: u.meta || null });
        }).catch(function(f) {
          L(o.dom, "ln-api-connector:error", {
            action: "create",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            tempId: u.tempId,
            meta: u.meta || null
          });
        });
      },
      update: function(s) {
        const u = s.detail || {};
        o.update(u.id, u.data, u.expected_version, u.url, u.idempotencyKey).then(function(f) {
          const p = f && f.content !== void 0 ? f.content : f, _ = f && f.message ? f.message : null;
          L(o.dom, "ln-api-connector:updated", { record: p, id: u.id, message: _, meta: u.meta || null });
        }).catch(function(f) {
          L(o.dom, "ln-api-connector:error", {
            action: "update",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            id: u.id,
            conflictData: f.status === 409 ? f.data : null,
            meta: u.meta || null
          });
        });
      },
      delete: function(s) {
        const u = s.detail || {};
        o.delete(u.id, u.url, u.idempotencyKey).then(function(f) {
          const p = f && f.message ? f.message : null;
          L(o.dom, "ln-api-connector:deleted", { response: f, id: u.id, message: p, meta: u.meta || null });
        }).catch(function(f) {
          L(o.dom, "ln-api-connector:error", {
            action: "delete",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            id: u.id,
            meta: u.meta || null
          });
        });
      },
      bulkDelete: function(s) {
        const u = s.detail || {};
        o.bulkDelete(u.ids, u.url, u.idempotencyKey).then(function(f) {
          const p = f && f.message ? f.message : null;
          L(o.dom, "ln-api-connector:bulk-deleted", { response: f, ids: u.ids, message: p, meta: u.meta || null });
        }).catch(function(f) {
          L(o.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            ids: u.ids,
            meta: u.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(s) {
      o.dom.addEventListener(s + ":request-sync", o._handlers.sync), o.dom.addEventListener(s + ":request-query", o._handlers.query), o.dom.addEventListener(s + ":request-fetch", o._handlers.query), o.dom.addEventListener(s + ":request-create", o._handlers.create), o.dom.addEventListener(s + ":request-update", o._handlers.update), o.dom.addEventListener(s + ":request-delete", o._handlers.delete), o.dom.addEventListener(s + ":request-bulk-delete", o._handlers.bulkDelete);
    });
  }
  b.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const o = this;
    o._inflight && (o._inflight.forEach(function(c) {
      c.abort();
    }), o._inflight.clear()), o._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(s) {
      o.dom.removeEventListener(s + ":request-sync", o._handlers.sync), o.dom.removeEventListener(s + ":request-query", o._handlers.query), o.dom.removeEventListener(s + ":request-fetch", o._handlers.query), o.dom.removeEventListener(s + ":request-create", o._handlers.create), o.dom.removeEventListener(s + ":request-update", o._handlers.update), o.dom.removeEventListener(s + ":request-delete", o._handlers.delete), o.dom.removeEventListener(s + ":request-bulk-delete", o._handlers.bulkDelete);
    }), o._handlers = null), L(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[y];
  };
  function h(o) {
    const c = o[a];
    c && c.refreshConfig();
  }
  B(d, a, b, "ln-api-connector", {
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
  const d = "data-ln-couchdb-connector", a = "lnCouchDbConnector", y = "lnConnector";
  if (window[a] !== void 0) return;
  function w(p) {
    const _ = p && p.content !== void 0 ? p.content : p, r = p && p.message ? p.message : null;
    return { content: _, message: r };
  }
  function b(p) {
    return this.dom = p, p[a] = this, p[y] = this, this.refreshConfig(), this._handlers = null, u(this), this;
  }
  b.prototype.refreshConfig = function() {
    const p = this.dom;
    this.url = p.getAttribute("data-ln-couchdb-url") || "", this.db = p.getAttribute("data-ln-couchdb-db") || "", this.auth = p.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const _ = p.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = fe(_, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), _.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(p, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function m(p, _, r) {
    const i = Object.assign({}, gt(p.headers, p.auth), r || {});
    return _ && (i["Idempotency-Key"] = _), i;
  }
  b.prototype.fetchDelta = function(p) {
    const _ = this, r = ["include_docs=true", "feed=normal"];
    p && r.push("since=" + encodeURIComponent(p));
    const i = X(_.url, _.db, "_changes") + "?" + r.join("&");
    return window.fetch(i, { method: "GET", headers: gt(_.headers, _.auth), credentials: _.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = t.results || [];
      return {
        data: e.filter((n) => !n.deleted && n.doc).map((n) => Object.assign({}, n.doc, { id: n.doc._id })),
        deleted: e.filter((n) => n.deleted).map((n) => n.id),
        synced_at: t.last_seq || p || ""
      };
    });
  };
  function h(p, _, r) {
    const i = Object.assign({ _id: _.id }, _);
    return i._id || delete i._id, window.fetch(X(p.url, p.db), {
      method: "POST",
      headers: m(p, r),
      credentials: p.credentials,
      body: JSON.stringify(i)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = w(t), n = e.content;
      return { record: Object.assign({}, i, { id: n.id, _id: n.id, _rev: n.rev }), message: e.message };
    });
  }
  b.prototype.create = function(p, _) {
    return h(this, p, _).then((r) => r.record);
  };
  function o(p, _, r, i) {
    const t = Object.assign({ id: String(_), _id: String(_) }, r), e = t._rev || t.rev;
    return (e ? Promise.resolve(e) : window.fetch(X(p.url, p.db, null, _), { method: "GET", headers: gt(p.headers, p.auth), credentials: p.credentials }).then((l) => {
      if (!l.ok) throw new Error("Could not retrieve document for revision mapping");
      return l.json().then((g) => g._rev);
    })).then((l) => {
      const g = Object.assign({}, t, { _rev: l });
      delete g.rev;
      const E = m(p, i, { "If-Match": l });
      return window.fetch(X(p.url, p.db, null, _), {
        method: "PUT",
        headers: E,
        credentials: p.credentials,
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
  b.prototype.update = function(p, _, r) {
    return o(this, p, _, r).then((i) => i.record);
  };
  function c(p, _, r, i) {
    return (r ? Promise.resolve(r) : window.fetch(X(p.url, p.db, null, _), { method: "GET", headers: gt(p.headers, p.auth), credentials: p.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((n) => n._rev);
    })).then((e) => {
      const n = X(p.url, p.db, null, _) + "?rev=" + encodeURIComponent(e);
      return window.fetch(n, { method: "DELETE", headers: m(p, i), credentials: p.credentials }).then((l) => {
        if (!l.ok) throw new Error("HTTP " + l.status + ": " + l.statusText);
        return l.json();
      }).then((l) => {
        const g = w(l);
        return { response: g.content, message: g.message };
      });
    });
  }
  b.prototype.delete = function(p, _, r) {
    return c(this, p, _, r).then((i) => i.response);
  };
  function s(p, _, r) {
    return !_ || _.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(X(p.url, p.db, "_all_docs"), {
      method: "POST",
      headers: gt(p.headers, p.auth),
      credentials: p.credentials,
      body: JSON.stringify({ keys: _ })
    }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => {
      const e = (i.rows || []).filter((n) => !n.error && n.value && n.value.rev).map((n) => ({ _id: n.id, _rev: n.value.rev, _deleted: !0 }));
      return e.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(X(p.url, p.db, "_bulk_docs"), {
        method: "POST",
        headers: m(p, r),
        credentials: p.credentials,
        body: JSON.stringify({ docs: e })
      }).then((n) => {
        if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
        return n.json();
      }).then((n) => {
        const l = w(n);
        return { response: { ok: !0, results: l.content, deletedCount: e.length }, message: l.message };
      });
    });
  }
  b.prototype.bulkDelete = function(p, _) {
    return s(this, p, _).then((r) => r.response);
  };
  function u(p) {
    p._handlers = {
      sync: function(r) {
        const i = r.detail || {};
        p.fetchDelta(i.since).then(function(t) {
          L(p.dom, "ln-couchdb-connector:fetched", { data: t, since: i.since, meta: i.meta || null });
        }).catch(function(t) {
          L(p.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: i.since,
            meta: i.meta || null
          });
        });
      },
      create: function(r) {
        const i = r.detail || {};
        h(p, i.data, i.idempotencyKey).then(function(t) {
          L(p.dom, "ln-couchdb-connector:created", { record: t.record, tempId: i.tempId, message: t.message, meta: i.meta || null });
        }).catch(function(t) {
          L(p.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: i.tempId,
            meta: i.meta || null
          });
        });
      },
      update: function(r) {
        const i = r.detail || {}, t = Object.assign({}, i.data);
        i.expected_version !== void 0 && (t._rev = i.expected_version), o(p, i.id, t, i.idempotencyKey).then(function(e) {
          L(p.dom, "ln-couchdb-connector:updated", { record: e.record, id: i.id, message: e.message, meta: i.meta || null });
        }).catch(function(e) {
          L(p.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: e.message,
            status: e.status || 0,
            id: i.id,
            data: e.status === 409 ? e.data : null,
            conflictData: e.status === 409 ? e.data : null,
            meta: i.meta || null
          });
        });
      },
      delete: function(r) {
        const i = r.detail || {};
        c(p, i.id, i.rev, i.idempotencyKey).then(function(t) {
          L(p.dom, "ln-couchdb-connector:deleted", { response: t.response, id: i.id, message: t.message, meta: i.meta || null });
        }).catch(function(t) {
          L(p.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: i.id,
            meta: i.meta || null
          });
        });
      },
      bulkDelete: function(r) {
        const i = r.detail || {};
        s(p, i.ids, i.idempotencyKey).then(function(t) {
          L(p.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: i.ids, message: t.message, meta: i.meta || null });
        }).catch(function(t) {
          L(p.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: i.ids,
            meta: i.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(r) {
      p.dom.addEventListener(r + ":request-sync", p._handlers.sync), p.dom.addEventListener(r + ":request-fetch", p._handlers.sync), p.dom.addEventListener(r + ":request-create", p._handlers.create), p.dom.addEventListener(r + ":request-update", p._handlers.update), p.dom.addEventListener(r + ":request-delete", p._handlers.delete), p.dom.addEventListener(r + ":request-bulk-delete", p._handlers.bulkDelete);
    });
  }
  b.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const p = this;
    p._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(r) {
      p.dom.removeEventListener(r + ":request-sync", p._handlers.sync), p.dom.removeEventListener(r + ":request-fetch", p._handlers.sync), p.dom.removeEventListener(r + ":request-create", p._handlers.create), p.dom.removeEventListener(r + ":request-update", p._handlers.update), p.dom.removeEventListener(r + ":request-delete", p._handlers.delete), p.dom.removeEventListener(r + ":request-bulk-delete", p._handlers.bulkDelete);
    }), p._handlers = null), L(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[y];
  };
  function f(p) {
    const _ = p[a];
    _ && _.refreshConfig();
  }
  B(d, a, b, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: f
  });
})();
function on(d) {
  return d = d || {}, {
    sort: d.sort,
    filters: d.filters,
    search: d.search,
    offset: d.offset,
    limit: d.limit,
    queryGen: d.queryGen
  };
}
function Nt(d, a) {
  const y = !d || !!d.initializationError;
  return a && (y || !d.isLoaded) ? "remote" : d && !d.initializationError ? "store" : "none";
}
function oe(d, a) {
  const y = Object.assign({}, d);
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
  const d = "data-ln-data-coordinator", a = "lnDataCoordinator", y = "lnCoordinator", w = "data-ln-form-scope";
  if (window[a] !== void 0) return;
  const b = /* @__PURE__ */ new Set();
  let m = !1, h = null, o = null, c = null;
  function s() {
    m || (m = !0, h = function() {
      L(document, "ln-data-store:online", {}), b.forEach(function(t) {
        t._maybeSync();
      });
    }, o = function() {
      L(document, "ln-data-store:offline", {});
    }, c = function() {
      document.visibilityState === "visible" && b.forEach(function(t) {
        const e = t.findChildren(), n = e.store;
        n && e.connector && n.isInitialized && !n.initializationError && !n.isSyncing && !t._noAutosync && (!n.hasCache || t._isStale()) && n.forceSync();
      });
    }, window.addEventListener("online", h), window.addEventListener("offline", o), document.addEventListener("visibilitychange", c));
  }
  function u() {
    m && (b.size > 0 || (window.removeEventListener("online", h), window.removeEventListener("offline", o), document.removeEventListener("visibilitychange", c), h = null, o = null, c = null, m = !1));
  }
  function f() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
        const n = Math.random() * 16 | 0;
        return (e === "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
  const p = ["ln-api-connector", "ln-couchdb-connector"];
  function _(t) {
    return this.dom = t, this._name = t.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", t), t[a] = this, t[y] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new sn(), this._dict = xt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), r(this), b.add(this), s(), this._checkInitialSync(), this;
  }
  _.prototype._parseStaleAttributes = function() {
    const e = this.findChildren().storeEl, n = this.dom.getAttribute("data-ln-data-coordinator-stale") || (e ? e.getAttribute("data-ln-data-store-stale") : null), l = parseInt(n, 10);
    this._staleThreshold = n === "never" || n === "-1" ? -1 : isNaN(l) ? 300 : l;
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
      const l = t.findChildren(), g = l.store;
      if (g && g.initializationError) {
        t._reportReconciliationError("store-initialize", g.initializationError, null);
        return;
      }
      !g || !l.connector || t._noAutosync || g.isSyncing || (!g.hasCache || t._isStale()) && g.forceSync();
    }).catch(function(l) {
      t._reportReconciliationError("store-initialize", l, null);
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
    const n = t.data || {}, l = n.id, g = n.expected_version, E = Object.assign({}, n);
    delete E.id, delete E.expected_version;
    const v = t.method.toUpperCase();
    v === "POST" ? this._fanOutCreate(e, E, t.action) : (v === "PUT" || v === "PATCH") && this._fanOutUpdate(e, l, E, g, t.action);
  }, _.prototype._fanOutCreate = function(t, e, n) {
    this.refreshMapper();
    const l = "_temp_" + f();
    L(t.storeEl, "ln-data-store:request-create", { tempId: l, data: e }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: l,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(e),
      expectedVersion: null,
      meta: { tempId: l, action: n }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(e),
      url: n,
      meta: { entryId: f(), queued: !1, op: "create", tempId: l }
    });
  }, _.prototype._fanOutUpdate = function(t, e, n, l, g) {
    this.refreshMapper(), L(t.storeEl, "ln-data-store:request-update", { id: e, data: n }), t.queue ? L(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: e,
      op: "update",
      targetId: e,
      payload: this.mapper.egress(n),
      expectedVersion: l,
      meta: { id: e, action: g }
    }) : t.connector && L(t.connectorEl, "ln-api-connector:request-update", {
      id: e,
      data: this.mapper.egress(n),
      expected_version: l,
      url: g,
      meta: { entryId: f(), queued: !1, op: "update", id: e }
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
      meta: { entryId: f(), queued: !1, op: "delete", id: e }
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
      meta: { entryId: f(), queued: !1, op: "bulk-delete", bulkKey: n }
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
    const l = t.storeEl;
    if (!l) return Promise.reject(new Error("Store element not found"));
    const g = f(), E = this._mutationReceipts.wait(g);
    return L(l, "ln-data-store:request-" + e, Object.assign({}, n, { requestId: g })), E;
  }, _.prototype._reportReconciliationError = function(t, e, n) {
    L(this.dom, "ln-data-coordinator:error", {
      operation: t,
      error: e,
      meta: n || null
    });
  };
  function r(t) {
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
        const l = e.detail || {};
        L(n.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, l.query, {
            offset: l.offset,
            limit: l.limit,
            queryGen: l.queryGen
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
        const l = e.detail || {}, g = l.entryId, E = l.op, v = l.targetId, A = l.payload, S = l.expectedVersion, q = l.meta || {}, T = q.action || null, x = l.idempotencyKey || g;
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
        const l = n.hasAttribute(w) ? n.getAttribute(w) : null;
        if (l === null) return;
        let g;
        if (l ? g = l === t._name : g = n.closest("[data-ln-data-coordinator]") === t.dom, !g) return;
        const E = Be(n);
        if (E !== "POST" && E !== "PUT" && E !== "PATCH") return;
        e.preventDefault();
        const v = ce(n);
        delete v._method, delete v._token, t._handleSubmitRecord({ data: v, method: E, action: n.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(e) {
        const n = e.detail.meta || {}, l = t.findChildren();
        t.refreshMapper();
        const g = e.detail.data;
        let E = [], v = [], A = null;
        Array.isArray(g) ? (E = g, A = Math.floor(Date.now() / 1e3)) : g && (E = Array.isArray(g.data) ? g.data : [], v = Array.isArray(g.deleted) ? g.deleted : [], A = g.synced_at !== void 0 ? g.synced_at : g.since !== void 0 ? g.since : null);
        const S = E.map((q) => t.mapper.ingress(q));
        if (l.store && !l.store.initializationError)
          n.kind ? n.kind === "table" || n.kind === "list" || n.kind === "chart" ? l.store.applyQuery(S, { total: e.detail.total }).then(function(q) {
            L(n.targetEl, "ln-" + n.kind + ":set-loading", { loading: !1 }), L(n.targetEl, "ln-" + n.kind + ":set-data", {
              data: q,
              total: e.detail.total !== void 0 ? e.detail.total : q.length,
              filtered: e.detail.filtered !== void 0 ? e.detail.filtered : q.length,
              offset: e.detail.offset,
              queryGen: e.detail.queryGen
            }), t._boundDelivered.set(n.targetEl, !0);
          }) : n.kind === "options" ? l.store.applyQuery(S, { total: e.detail.total }).then(function() {
            return l.store.getAll({});
          }).then(function(q) {
            L(n.targetEl, "ln-options:set-data", { data: q.data });
          }) : n.kind === "stat" && l.store.applyQuery(S, { total: e.detail.total }).then(function() {
            const q = e.detail.filtered !== void 0 ? e.detail.filtered : e.detail.total !== void 0 ? e.detail.total : S.length;
            L(n.targetEl, "ln-stat:set-count", { count: q });
          }) : l.store.applySync(S, v, A || Math.floor(Date.now() / 1e3), {
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
        const l = e.detail.meta || {}, g = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: l.tempId, data: g }).then(function() {
          t._toastFromMessage(e.detail.message), l.queued && n.queue && L(n.queueEl, "ln-api-queue:resolve-create", {
            entryId: l.entryId,
            oldKey: l.tempId,
            newId: g.id
          });
        }).catch(function(E) {
          t._reportReconciliationError("create-reconcile", E, l);
        });
      },
      connUpdated: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const l = e.detail.meta || {}, g = t.mapper.ingress(e.detail.record);
        t._requestStoreMutation(n, "update", { id: l.id, data: g }).then(function() {
          t._toastFromMessage(e.detail.message), l.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: l.entryId });
        }).catch(function(E) {
          t._reportReconciliationError("update-reconcile", E, l);
        });
      },
      connDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const l = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), l.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: l.entryId });
      },
      connBulkDeleted: function(e) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const l = e.detail.meta || {};
        t._toastFromMessage(e.detail.message), l.queued && n.queue && L(n.queueEl, "ln-api-queue:ack", { entryId: l.entryId });
      },
      connError: function(e) {
        const n = e.detail || {}, l = n.meta || {}, g = l.op || n.action, E = n.status || 0, v = t.findChildren();
        if (g === "sync") {
          v.storeEl && L(v.storeEl, "ln-data-store:request-sync-failed", {
            error: n.error,
            status: E
          }), console.error("[ln-data-coordinator] Sync failed:", n.error);
          return;
        }
        if (g === "query") {
          l.targetEl && l.kind && (L(l.targetEl, "ln-" + l.kind + ":set-loading", { loading: !1 }), (l.kind === "table" || l.kind === "list") && L(l.targetEl, "ln-" + l.kind + ":page-failed", { offset: l.offset })), t._reportReconciliationError("query", n.error || n, l);
          return;
        }
        if (!v.storeEl) return;
        const A = E === 401 || E === 419, S = E === 0 || E >= 500, q = E === 409 || E === 412;
        if (A) {
          t._toastFromDict("auth"), l.queued && v.queue && L(v.queueEl, "ln-api-queue:nack", { entryId: l.entryId, reason: "auth" });
          return;
        }
        if (S) {
          l.queued && v.queue ? L(v.queueEl, "ln-api-queue:nack", { entryId: l.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let T = Promise.resolve();
        if (q && g === "update") {
          const x = n.data && n.data.remote ? t.mapper.ingress(n.data.remote) : null;
          x && (T = t._requestStoreMutation(v, "update", { id: l.id, data: x })), t._toastFromDict("conflict");
        } else g === "create" && (T = t._requestStoreMutation(v, "delete", { id: l.tempId })), t._toastFromDict("rejected");
        l.queued && v.queue ? T.then(function() {
          L(v.queueEl, "ln-api-queue:nack", { entryId: l.entryId, reason: "drop" });
        }).catch(function(x) {
          t._reportReconciliationError("deterministic-reconcile", x, l);
        }) : T.catch(function(x) {
          t._reportReconciliationError("deterministic-reconcile", x, l);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(e) {
        const n = t.findChildren(), l = n.store;
        if (!l || l.initializationError || !n.connector || t._noAutosync || l.isSyncing) return;
        (e.detail || {}).hasCache ? t._isStale() && l.forceSync() : l.forceSync();
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
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), p.forEach(function(e) {
      t.dom.addEventListener(e + ":fetched", t._handlers.connFetched), t.dom.addEventListener(e + ":created", t._handlers.connCreated), t.dom.addEventListener(e + ":updated", t._handlers.connUpdated), t.dom.addEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(e + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-chart:request-data", t._handlers.reqChartData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.addEventListener("ln-data-store:query-changed", t._handlers.refreshQuery);
  }
  _.prototype._ownsStore = function(t) {
    const e = this.findChildren();
    return !!(e.store && e.store._name === t && t);
  }, _.prototype._serveData = function(t, e) {
    const n = t.target, l = e === "table" ? "data-ln-table-source" : e === "list" ? "data-ln-list-source" : "data-ln-chart-source", g = n.getAttribute(l);
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
    const l = this.findChildren(), g = l.store, E = g && g.ready ? g.ready : Promise.resolve(), v = this;
    return E.then(function() {
      const A = Nt(g, l.connector);
      if (A === "remote") {
        L(l.connectorEl, "ln-api-connector:request-query", {
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
    const l = t.detail && t.detail.filters ? t.detail.filters : null, g = this.findChildren(), E = g.store, v = E && E.ready ? E.ready : Promise.resolve(), A = this;
    return v.then(function() {
      const S = Nt(E, g.connector);
      if (S === "remote") {
        L(g.connectorEl, "ln-api-connector:request-query", {
          query: { filters: l },
          meta: { targetEl: e, kind: "stat" }
        });
        return;
      }
      if (S === "store")
        return E.count(l).then(function(q) {
          L(e, "ln-stat:set-count", { count: q });
        });
    }).catch(function(S) {
      A._reportReconciliationError("stat-query", S, { targetEl: e, kind: "stat" });
    });
  }, _.prototype._refreshAll = function(t, e) {
    const n = this, l = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let g = 0; g < l.length; g++) {
      const E = l[g];
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
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-store:request-page", t._handlers.requestPage), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), p.forEach(function(e) {
      t.dom.removeEventListener(e + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(e + ":created", t._handlers.connCreated), t.dom.removeEventListener(e + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(e + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(e + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(e + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-chart:request-data", t._handlers.reqChartData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t.dom.removeEventListener("ln-data-store:query-changed", t._handlers.refreshQuery), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, b.delete(this), u(), delete this.dom[a], delete this.dom[y];
  };
  function i(t, e) {
    const n = t[a];
    n && e === "data-ln-data-mapper" && n.refreshMapper();
  }
  B(d, a, _, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: i
  });
})();
const an = "ln_api_queue", ln = 2, $ = "outbox", Y = "_queue_meta";
function et(d, a) {
  return d.error || new Error(a);
}
function pt(d, a) {
  return d.bound([a, -1 / 0], [a, 1 / 0]);
}
function se(d) {
  return "seq:" + d;
}
function St(d) {
  return "paused:" + d;
}
function ae(d) {
  d.leaseOwner = null, d.leaseUntil = 0;
}
function cn(d, a, y) {
  return typeof d != "string" || d.indexOf(a) === -1 ? d : d.split(a).join(y);
}
function dn(d, a, y, w) {
  const b = /* @__PURE__ */ new Map(), m = [], h = [];
  for (const o of d || [])
    b.has(o.chainKey) || b.set(o.chainKey, []), b.get(o.chainKey).push(o);
  return b.forEach((o, c) => {
    o.sort((u, f) => u.seq - f.seq);
    const s = o[0];
    if (!(!s || s.status === "failed")) {
      if (s.status === "inflight" && (s.leaseUntil || 0) > w) {
        h.push({ chainKey: c, at: s.leaseUntil });
        return;
      }
      if ((s.nextAttemptAt || 0) > w) {
        h.push({ chainKey: c, at: s.nextAttemptAt });
        return;
      }
      s.status = "inflight", s.leaseOwner = a, s.leaseUntil = w + y, s.updatedAt = w, m.push(s);
    }
  }), { entries: m, wakeups: h };
}
function un(d, a, y, w, b) {
  const m = [], h = [];
  for (const o of d || []) {
    if (o.entryId === a) {
      h.push(o.entryId);
      continue;
    }
    o.chainKey === y && (o.chainKey = w, o.targetId === y && (o.targetId = w), o.meta && o.meta.id === y && (o.meta.id = w), o.meta && typeof o.meta.action == "string" && (o.meta.action = cn(o.meta.action, y, w)), o.updatedAt = b, m.push(o));
  }
  return { changed: m, deleted: h };
}
class hn {
  constructor(a) {
    a = a || {}, this.indexedDB = a.indexedDB || globalThis.indexedDB, this.keyRange = a.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = a.dbName || an, this.now = a.now || (() => Date.now()), this.uuid = a.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((a, y) => {
      const w = this.indexedDB.open(this.dbName, ln);
      w.onupgradeneeded = (b) => {
        const m = b.target.result;
        let h;
        m.objectStoreNames.contains($) ? h = b.target.transaction.objectStore($) : h = m.createObjectStore($, { keyPath: "entryId" }), h.indexNames.contains("by_scope_chain") || h.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), h.indexNames.contains("by_scope_seq") || h.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(Y) || m.createObjectStore(Y, { keyPath: "key" });
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
    return y = y || {}, this.open().then((w) => w ? new Promise((b, m) => {
      const h = w.transaction([Y, $], "readwrite"), o = h.objectStore(Y), c = h.objectStore($), s = se(a);
      let u = null;
      const f = (_) => {
        const r = _ + 1;
        u = {
          entryId: this.uuid(),
          scope: a,
          chainKey: y.chainKey,
          seq: r,
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
        }, o.put({ key: s, value: r }), c.put(u);
      }, p = o.get(s);
      p.onerror = () => m(et(p, "Queue sequence read failed")), p.onsuccess = () => {
        const _ = p.result;
        if (_ && typeof _.value == "number") {
          f(_.value);
          return;
        }
        const r = c.index("by_scope_seq").getAll(pt(this.keyRange, a));
        r.onerror = () => m(et(r, "Queue sequence migration failed")), r.onsuccess = () => {
          const i = (r.result || []).reduce((t, e) => Math.max(t, e.seq || 0), 0);
          f(i);
        };
      }, h.oncomplete = () => b(u), h.onerror = () => m(h.error || new Error("Queue enqueue transaction failed")), h.onabort = () => m(h.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(a, y, w) {
    return this.open().then((b) => b ? new Promise((m, h) => {
      const o = b.transaction($, "readwrite"), c = o.objectStore($), s = c.index("by_scope_seq").getAll(pt(this.keyRange, a)), u = this.now();
      let f = { entries: [], wakeups: [] };
      s.onerror = () => h(et(s, "Queue claim read failed")), s.onsuccess = () => {
        f = dn(s.result || [], y, w, u);
        for (const p of f.entries) c.put(p);
      }, o.oncomplete = () => m(f), o.onerror = () => h(o.error || new Error("Queue claim transaction failed")), o.onabort = () => h(o.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(a, y) {
    return this._updateEntry(a, y, (w, b) => (b.delete(w.entryId), { status: "acked", entry: w }));
  }
  nack(a, y, w, b) {
    b = b || {};
    const m = b.maxAttempts || 8, h = b.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((o) => o ? new Promise((c, s) => {
      const u = o.transaction([$, Y], "readwrite"), f = u.objectStore($), p = u.objectStore(Y), _ = f.get(y);
      let r = null;
      _.onerror = () => s(et(_, "Queue nack read failed")), _.onsuccess = () => {
        const i = _.result;
        if (!(!i || i.scope !== a)) {
          if (w === "drop") {
            f.delete(i.entryId), r = { status: "dropped", entry: i };
            return;
          }
          if (ae(i), i.updatedAt = this.now(), w === "auth") {
            i.status = "pending", f.put(i), p.put({ key: St(a), value: !0 }), r = { status: "auth", entry: i };
            return;
          }
          if (w === "retry") {
            if (i.attempts = (i.attempts || 0) + 1, i.attempts >= m) {
              i.status = "failed", i.nextAttemptAt = 0, f.put(i), r = { status: "failed", entry: i };
              return;
            }
            const t = h[Math.min(i.attempts - 1, h.length - 1)];
            i.status = "pending", i.nextAttemptAt = this.now() + t, f.put(i), r = { status: "retry", entry: i, delay: t };
          }
        }
      }, u.oncomplete = () => c(r), u.onerror = () => s(u.error || new Error("Queue nack transaction failed")), u.onabort = () => s(u.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(a, y, w) {
    return this._remapTransaction(a, null, y, w);
  }
  resolveCreate(a, y, w, b) {
    return this._remapTransaction(a, y, w, b);
  }
  _remapTransaction(a, y, w, b) {
    return this.open().then((m) => m ? new Promise((h, o) => {
      const c = m.transaction($, "readwrite"), s = c.objectStore($), u = s.index("by_scope_seq").getAll(pt(this.keyRange, a));
      let f = { changed: [], deleted: [] };
      u.onerror = () => o(et(u, "Queue remap read failed")), u.onsuccess = () => {
        f = un(u.result || [], y, w, b, this.now());
        for (const p of f.deleted) s.delete(p);
        for (const p of f.changed) s.put(p);
      }, c.oncomplete = () => h(f.changed), c.onerror = () => o(c.error || new Error("Queue remap transaction failed")), c.onabort = () => o(c.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(a) {
    return this.open().then((y) => y ? new Promise((w, b) => {
      const m = y.transaction($, "readwrite"), h = m.objectStore($), o = h.index("by_scope_seq").getAll(pt(this.keyRange, a));
      let c = 0;
      o.onerror = () => b(et(o, "Queue failed-entry read failed")), o.onsuccess = () => {
        for (const s of o.result || [])
          s.status === "failed" && (s.status = "pending", s.attempts = 0, s.nextAttemptAt = 0, s.updatedAt = this.now(), ae(s), h.put(s), c++);
      }, m.oncomplete = () => w(c), m.onerror = () => b(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => b(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(a) {
    return this.open().then((y) => y ? new Promise((w, b) => {
      const h = y.transaction(Y, "readonly").objectStore(Y).get(St(a));
      h.onsuccess = () => w(!!(h.result && h.result.value)), h.onerror = () => b(et(h, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(a, y) {
    return this.open().then((w) => {
      if (w)
        return new Promise((b, m) => {
          const h = w.transaction(Y, "readwrite");
          h.objectStore(Y).put({ key: St(a), value: !!y }), h.oncomplete = () => b(), h.onerror = () => m(h.error || new Error("Queue pause-state write failed")), h.onabort = () => m(h.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(a) {
    return this.open().then((y) => {
      if (y)
        return new Promise((w, b) => {
          const m = y.transaction([$, Y], "readwrite"), o = m.objectStore($).index("by_scope_seq").openCursor(pt(this.keyRange, a));
          o.onsuccess = (c) => {
            const s = c.target.result;
            s && (s.delete(), s.continue());
          }, o.onerror = () => b(et(o, "Queue clear failed")), m.objectStore(Y).delete(se(a)), m.objectStore(Y).delete(St(a)), m.oncomplete = () => w(), m.onerror = () => b(m.error || new Error("Queue clear transaction failed")), m.onabort = () => b(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(a, y, w) {
    return this.open().then((b) => b ? new Promise((m, h) => {
      const o = b.transaction($, "readwrite"), c = o.objectStore($), s = c.get(y);
      let u = null;
      s.onerror = () => h(et(s, "Queue entry read failed")), s.onsuccess = () => {
        const f = s.result;
        !f || f.scope !== a || (u = w(f, c));
      }, o.oncomplete = () => m(u), o.onerror = () => h(o.error || new Error("Queue entry transaction failed")), o.onabort = () => h(o.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const d = "data-ln-api-queue", a = "lnApiQueue", y = [2e3, 5e3, 15e3, 6e4, 3e5], w = 8, b = 6e4;
  if (window[a] !== void 0) return;
  function m() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (u) => {
        const f = Math.random() * 16 | 0;
        return (u === "x" ? f : f & 3 | 8).toString(16);
      });
    }
  }
  const h = new hn({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: m
  });
  function o(s) {
    this.dom = s, s[a] = this;
    const u = s.closest("[data-ln-data-coordinator]");
    this.scope = s.id || (u ? u.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = m(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const f = this;
    return h.open().then((p) => p ? h.getPaused(f.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((p) => (f._paused = !!p, f._paused && L(f.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), f._emitPendingCount())).then(() => f._drain()).catch((p) => {
      console.error("[ln-api-queue] Initialization failed:", p), L(f.dom, "ln-api-queue:error", { operation: "initialize", error: p });
    }), this;
  }
  o.prototype._isOnline = function() {
    const s = this.dom.getAttribute("data-ln-api-queue-online");
    return s === "true" ? !0 : s === "false" ? !1 : navigator.onLine;
  }, o.prototype._emitPendingCount = function() {
    const s = this;
    return h.allForScope(s.scope).then((u) => (L(s.dom, "ln-api-queue:pending-count", { count: u.length, scope: s.scope }), u.length === 0 && L(s.dom, "ln-api-queue:drained", { scope: s.scope }), u));
  }, o.prototype._clearTimer = function(s) {
    const u = this._timers.get(s);
    u && (clearTimeout(u), this._timers.delete(s));
  }, o.prototype._scheduleTimer = function(s, u) {
    const f = Math.max(0, u), p = this._timers.get(s);
    p && clearTimeout(p);
    const _ = this, r = setTimeout(() => {
      _._timers.delete(s), _._drain();
    }, f);
    this._timers.set(s, r);
  }, o.prototype._drain = function() {
    const s = this;
    return s._paused || !s._isOnline() ? Promise.resolve() : (s._drainPromise || (s._drainPromise = h.claimReady(s.scope, s._workerId, b).then((u) => {
      for (const f of u.wakeups)
        s._scheduleTimer(f.chainKey, f.at - Date.now());
      for (const f of u.entries)
        s._clearTimer(f.chainKey), L(s.dom, "ln-api-queue:send", {
          entryId: f.entryId,
          chainKey: f.chainKey,
          op: f.op,
          targetId: f.targetId,
          payload: f.payload,
          expectedVersion: f.expectedVersion,
          idempotencyKey: f.entryId,
          meta: f.meta
        });
    }).catch((u) => {
      console.error("[ln-api-queue] Drain failed:", u), L(s.dom, "ln-api-queue:error", { operation: "drain", error: u });
    }).finally(() => {
      s._drainPromise = null;
    })), s._drainPromise);
  }, o.prototype._onEnqueue = function(s) {
    const u = this;
    return h.enqueue(u.scope, s.detail || {}).then((f) => {
      if (f)
        return u._emitPendingCount().then((p) => (L(u.dom, "ln-api-queue:enqueued", {
          entryId: f.entryId,
          chainKey: f.chainKey,
          count: p.length
        }), u._drain()));
    }).catch((f) => {
      L(u.dom, "ln-api-queue:error", { operation: "enqueue", error: f });
    });
  }, o.prototype._onAck = function(s) {
    const u = this, f = s.detail || {};
    return h.ack(u.scope, f.entryId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((p) => {
      L(u.dom, "ln-api-queue:error", { operation: "ack", entryId: f.entryId, error: p });
    });
  }, o.prototype._onNack = function(s) {
    const u = this, f = s.detail || {};
    return h.nack(u.scope, f.entryId, f.reason, {
      maxAttempts: w,
      backoff: y
    }).then((p) => {
      if (p)
        return p.status === "failed" ? L(u.dom, "ln-api-queue:failed", {
          entryId: p.entry.entryId,
          chainKey: p.entry.chainKey,
          attempts: p.entry.attempts
        }) : p.status === "retry" ? u._scheduleTimer(p.entry.chainKey, p.delay) : p.status === "auth" && (u._paused = !0, L(u.dom, "ln-api-queue:paused", { reason: "auth" }), L(u.dom, "ln-api-queue:auth-required", {
          entryId: p.entry.entryId,
          chainKey: p.entry.chainKey
        })), u._emitPendingCount().then(() => {
          if (p.status === "dropped") return u._drain();
        });
    }).catch((p) => {
      L(u.dom, "ln-api-queue:error", { operation: "nack", entryId: f.entryId, error: p });
    });
  }, o.prototype._onRemap = function(s) {
    const u = this, f = s.detail || {};
    return h.remap(u.scope, f.oldKey, f.newId).catch((p) => {
      L(u.dom, "ln-api-queue:error", { operation: "remap", error: p });
    });
  }, o.prototype._onResolveCreate = function(s) {
    const u = this, f = s.detail || {};
    return h.resolveCreate(u.scope, f.entryId, f.oldKey, f.newId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((p) => {
      L(u.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: f.entryId,
        error: p
      });
    });
  }, o.prototype._onResume = function() {
    const s = this;
    return h.setPaused(s.scope, !1).then(() => (s._paused = !1, L(s.dom, "ln-api-queue:resumed", {}), s._drain())).catch((u) => {
      L(s.dom, "ln-api-queue:error", { operation: "resume", error: u });
    });
  }, o.prototype._onDrain = function() {
    const s = this;
    return h.resetFailed(s.scope).then(() => {
      const u = s._drainPromise;
      return u ? u.then(() => s._drain()) : s._drain();
    }).catch((u) => {
      L(s.dom, "ln-api-queue:error", { operation: "manual-drain", error: u });
    });
  }, o.prototype._onClear = function() {
    const s = this;
    return s._timers.forEach((u) => clearTimeout(u)), s._timers.clear(), h.clear(s.scope).then(() => {
      s._paused = !1, L(s.dom, "ln-api-queue:pending-count", { count: 0, scope: s.scope }), L(s.dom, "ln-api-queue:drained", { scope: s.scope });
    }).catch((u) => {
      L(s.dom, "ln-api-queue:error", { operation: "clear", error: u });
    });
  }, o.prototype._bindEvents = function() {
    const s = this;
    s._handlers = {
      enqueue: (u) => s._onEnqueue(u),
      ack: (u) => s._onAck(u),
      nack: (u) => s._onNack(u),
      remap: (u) => s._onRemap(u),
      resolveCreate: (u) => s._onResolveCreate(u),
      resume: () => s._onResume(),
      drain: () => s._onDrain(),
      clear: () => s._onClear()
    }, s.dom.addEventListener("ln-api-queue:request-enqueue", s._handlers.enqueue), s.dom.addEventListener("ln-api-queue:ack", s._handlers.ack), s.dom.addEventListener("ln-api-queue:nack", s._handlers.nack), s.dom.addEventListener("ln-api-queue:request-remap", s._handlers.remap), s.dom.addEventListener("ln-api-queue:resolve-create", s._handlers.resolveCreate), s.dom.addEventListener("ln-api-queue:request-resume", s._handlers.resume), s.dom.addEventListener("ln-api-queue:request-drain", s._handlers.drain), s.dom.addEventListener("ln-api-queue:request-clear", s._handlers.clear);
  }, o.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const s = this;
    s.dom.removeEventListener("ln-api-queue:request-enqueue", s._handlers.enqueue), s.dom.removeEventListener("ln-api-queue:ack", s._handlers.ack), s.dom.removeEventListener("ln-api-queue:nack", s._handlers.nack), s.dom.removeEventListener("ln-api-queue:request-remap", s._handlers.remap), s.dom.removeEventListener("ln-api-queue:resolve-create", s._handlers.resolveCreate), s.dom.removeEventListener("ln-api-queue:request-resume", s._handlers.resume), s.dom.removeEventListener("ln-api-queue:request-drain", s._handlers.drain), s.dom.removeEventListener("ln-api-queue:request-clear", s._handlers.clear), window.removeEventListener("online", s._onlineHandler), s._timers.forEach((u) => clearTimeout(u)), s._timers.clear(), L(s.dom, "ln-api-queue:destroyed", { scope: s.scope }), delete s.dom[a];
  };
  function c(s) {
    const u = s[a];
    u && u._drain();
  }
  B(d, a, o, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: c
  });
})();
function ke(d) {
  if (d == null || d === "") return null;
  const a = Number(d);
  return Number.isFinite(a) ? a : null;
}
function mt(d) {
  return String(Math.round(d * 1e3) / 1e3);
}
function fn(d, a, y) {
  const w = ke(d);
  return w === null || w < 0 ? 0 : Math.min(w, Math.min(a, y) / 2);
}
function pn(d) {
  if (typeof d != "string") return null;
  const a = d.trim().split(/[\s,]+/).map(Number);
  return a.length !== 4 || a.some((y) => !Number.isFinite(y)) || a[2] <= 0 || a[3] <= 0 ? null : { x: a[0], y: a[1], width: a[2], height: a[3] };
}
function mn(d, a) {
  a = a || {};
  const y = a.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, w = a.xField || "label", b = a.yField || "value", m = a.includeZero !== !1, h = fn(a.padding, y.width, y.height), o = Array.isArray(d) ? d : [], c = [];
  for (let T = 0; T < o.length; T++) {
    const x = o[T] || {}, k = ke(x[b]);
    k !== null && c.push({
      record: x,
      sourceIndex: T,
      label: x[w] == null ? String(T + 1) : String(x[w]),
      value: k
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
      baselineY: y.y + y.height - h
    };
  const s = c.map((T) => T.value), u = Math.min(...s), f = Math.max(...s);
  let p = m ? Math.min(0, u) : u, _ = m ? Math.max(0, f) : f;
  if (p === _)
    if (p === 0)
      _ = 1;
    else {
      const T = Math.max(Math.abs(p) * 0.1, 1);
      p -= T, _ += T;
    }
  const r = y.x + h, i = y.y + h, t = Math.max(0, y.width - h * 2), e = Math.max(0, y.height - h * 2), n = c.length > 1 ? t / (c.length - 1) : 0, l = _ - p, g = (T) => i + (_ - T) / l * e, E = c.map((T, x) => ({
    ...T,
    x: c.length === 1 ? r + t / 2 : r + x * n,
    y: g(T.value)
  })), v = p <= 0 && _ >= 0 ? 0 : p, A = g(v), S = E.map((T) => mt(T.x) + "," + mt(T.y)).join(" "), q = [
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
    max: f,
    domainMin: p,
    domainMax: _,
    baselineY: A
  };
}
(function() {
  const d = "data-ln-chart", a = "lnChart", y = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[a] !== void 0) return;
  function w(o) {
    if (!o) return null;
    const c = o.split(":"), s = c[0].trim();
    return s ? {
      field: s,
      direction: c[1] && c[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function b(o, c) {
    if (o == null || !Number.isFinite(o)) return "";
    try {
      return new Intl.NumberFormat(W(c)).format(o);
    } catch {
      return String(o);
    }
  }
  function m(o, c) {
    o && (o.textContent = c);
  }
  function h(o) {
    this.dom = o, this.name = o.getAttribute(d) || "", this.source = o.getAttribute("data-ln-chart-source") || this.name, this.plot = o.querySelector("[data-ln-chart-plot]"), this.line = o.querySelector("[data-ln-chart-line]"), this.area = o.querySelector("[data-ln-chart-area]"), this.labels = o.querySelector("[data-ln-chart-labels]"), this.empty = o.querySelector("[data-ln-chart-empty]"), this.minimum = o.querySelector("[data-ln-chart-min]"), this.maximum = o.querySelector("[data-ln-chart-max]"), this.count = o.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const c = this;
    return this._onSetData = function(s) {
      const u = s.detail || {};
      c._data = Array.isArray(u.data) ? u.data : [], c.isLoaded = !0, c._setLoading(!1), c._render();
    }, this._onSetLoading = function(s) {
      c._setLoading(!!(s.detail && s.detail.loading));
    }, this._onRefresh = function() {
      c.requestData();
    }, o.addEventListener("ln-chart:set-data", this._onSetData), o.addEventListener("ln-chart:set-loading", this._onSetLoading), o.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  h.prototype._readOptions = function() {
    const o = this.dom.getAttribute("data-ln-chart-padding"), c = o === null ? NaN : Number(o), s = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(c) && c >= 0 ? c : 16,
      type: s === "area" || s === "polygon" ? "area" : "line",
      viewBox: this.plot && pn(this.plot.getAttribute("viewBox")) || y
    };
  }, h.prototype._setLoading = function(o) {
    this.dom.classList.toggle("ln-chart--loading", o), this.dom.setAttribute("aria-busy", o ? "true" : "false");
  }, h.prototype._renderLabels = function(o) {
    if (!this.labels || (this.labels.replaceChildren(), o.count === 0)) return;
    const c = this.name + "-label", s = '[data-ln-template="' + c + '"]';
    if (!this.dom.querySelector(s) && !document.querySelector(s)) return;
    const u = ct(this.dom, c, "ln-chart");
    if (u)
      for (const f of o.points) {
        const p = u.cloneNode(!0);
        Et(p, {
          label: f.label,
          value: b(f.value, this.dom)
        }), this.labels.appendChild(p);
      }
  }, h.prototype._render = function() {
    const o = this._readOptions(), c = mn(this._data, o);
    this.model = c, this.line && (this.line.setAttribute("points", c.linePoints), this.line.toggleAttribute("hidden", c.count === 0)), this.area && (this.area.setAttribute("points", c.areaPoints), this.area.toggleAttribute("hidden", c.count === 0 || o.type !== "area"));
    const s = c.count === 0;
    this.dom.classList.toggle("ln-chart--empty", s), this.empty && this.empty.toggleAttribute("hidden", !s), m(this.minimum, b(c.min, this.dom)), m(this.maximum, b(c.max, this.dom)), m(this.count, b(c.count, this.dom)), this._renderLabels(c), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: c.count,
      min: c.min,
      max: c.max
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
  }, B(d, a, h, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(o, c) {
      const s = o[a];
      if (s) {
        if (c === "data-ln-chart-source" || c === "data-ln-chart-sort") {
          s.requestData();
          return;
        }
        s._render();
      }
    }
  });
})();
(function() {
  const d = "data-ln-options", a = "lnOptions";
  if (window[a] !== void 0) return;
  function y(w) {
    this.dom = w, this._storeName = w.getAttribute(d), this._valueField = w.getAttribute("data-ln-options-value") || "id", this._labelField = w.getAttribute("data-ln-options-label") || "name";
    const b = this;
    return this._onSetData = function(m) {
      b._rebuild(m.detail.data || []);
    }, w.addEventListener("ln-options:set-data", this._onSetData), L(w, "ln-options:request-data", { options: this._storeName }), this;
  }
  y.prototype._rebuild = function(w) {
    const b = this.dom, m = this._valueField, h = this._labelField, o = b.value, c = b.querySelectorAll("option");
    for (let u = c.length - 1; u >= 0; u--)
      c[u].value !== "" && b.removeChild(c[u]);
    for (let u = 0; u < w.length; u++) {
      const f = w[u], p = document.createElement("option");
      p.value = String(f[m]), p.textContent = f[h] != null ? f[h] : "", b.appendChild(p);
    }
    const s = b.options;
    for (let u = 0; u < s.length; u++)
      if (s[u].value === o) {
        b.value = o;
        break;
      }
  }, y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[a]);
  }, B(d, a, y, "ln-options");
})();
(function() {
  const d = "data-ln-stat", a = "lnStat";
  if (window[a] !== void 0) return;
  function y(b) {
    if (!b) return null;
    const m = b.indexOf(":");
    if (m === -1) return null;
    const h = b.slice(0, m), o = b.slice(m + 1), c = {};
    return c[h] = [o], c;
  }
  function w(b) {
    return this.dom = b, this._storeName = b.getAttribute(d), this._filters = y(b.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      b.textContent = String(m.detail.count), b.classList.remove("is-loading");
    }, b.addEventListener("ln-stat:set-count", this._onSetCount), L(b, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  w.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[a]);
  }, B(d, a, w, "ln-stat");
})();
(function() {
  const d = "ln-icon-sprite", a = "#ln-icon-", y = "#ln-icon-custom-", w = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set();
  let m = null;
  const h = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), o = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), c = "lni:", s = "lni:v", u = "1";
  function f() {
    try {
      if (localStorage.getItem(s) !== u) {
        for (let n = localStorage.length - 1; n >= 0; n--) {
          const l = localStorage.key(n);
          l && l.indexOf(c) === 0 && localStorage.removeItem(l);
        }
        localStorage.setItem(s, u);
      }
    } catch {
    }
  }
  f();
  function p() {
    return m || (m = document.getElementById(d), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = d, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function _(n) {
    return n.indexOf(y) === 0 ? o + "/" + n.slice(y.length) + ".svg" : h + "/" + n.slice(a.length) + ".svg";
  }
  function r(n, l) {
    const g = l.match(/viewBox="([^"]+)"/), E = g ? g[1] : "0 0 24 24", v = l.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = v ? v[1].trim() : "", S = l.match(/<svg([^>]*)>/i), q = S ? S[1] : "", T = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    T.id = n, T.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(x) {
      const k = q.match(new RegExp(x + '="([^"]*)"'));
      k && T.setAttribute(x, k[1]);
    }), T.innerHTML = A, p().querySelector("defs").appendChild(T);
  }
  function i(n) {
    if (w.has(n) || b.has(n)) return;
    if (n.indexOf(y) === 0 && !o) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", n);
      return;
    }
    const l = n.slice(1);
    try {
      const E = localStorage.getItem(c + l);
      if (E) {
        r(l, E), w.add(n);
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
      r(l, E), w.add(n), b.delete(n);
      try {
        localStorage.setItem(c + l, E);
      } catch {
      }
    }).catch(function(E) {
      console.error("[ln-icon] Fetch failed for:", l, E), b.delete(n);
    });
  }
  function t(n) {
    const l = 'use[href^="' + a + '"], use[href^="' + y + '"]', g = n.querySelectorAll ? n.querySelectorAll(l) : [];
    if (n.matches && n.matches(l)) {
      const E = n.getAttribute("href");
      E && i(E);
    }
    Array.prototype.forEach.call(g, function(E) {
      const v = E.getAttribute("href");
      v && i(v);
    });
  }
  function e() {
    t(document), new MutationObserver(function(n) {
      n.forEach(function(l) {
        if (l.type === "childList")
          l.addedNodes.forEach(function(g) {
            g.nodeType === 1 && t(g);
          });
        else if (l.type === "attributes" && l.attributeName === "href") {
          const g = l.target.getAttribute("href");
          g && (g.indexOf(a) === 0 || g.indexOf(y) === 0) && i(g);
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
  const d = "data-ln-debug", a = "lnDebug";
  if (window[a] !== void 0) return;
  function y(w) {
    return this.dom = w, this;
  }
  y.prototype.destroy = function() {
    delete this.dom[a];
  }, B(d, a, y, "ln-debug");
})();
