if (typeof window < "u") {
  const d = console.warn;
  console.warn = function(...s) {
    typeof s[0] == "string" && (s[0].startsWith("[ln-") || s[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || d.apply(console, s);
  };
}
const Pt = {};
function kt(d, s) {
  Pt[d] || (Pt[d] = document.querySelector('[data-ln-template="' + d + '"]'));
  const y = Pt[d];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (s || "ln-core") + '] Template "' + d + '" not found'), null);
}
function S(d, s, y) {
  d.dispatchEvent(new CustomEvent(s, {
    bubbles: !0,
    detail: y || {}
  }));
}
function $(d, s, y) {
  const b = new CustomEvent(s, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return d.dispatchEvent(b), b;
}
function oe(d, s, y) {
  d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter();
  const b = {
    sort: d.currentSort,
    filters: d.currentFilters,
    search: d.currentSearch
  };
  b[y] = d.name, S(d.dom, s, b);
}
function rt(d, s) {
  if (!d || !s) return d;
  const y = d.querySelectorAll("[data-ln-field]");
  for (let h = 0; h < y.length; h++) {
    const a = y[h], m = a.getAttribute("data-ln-field");
    s[m] != null && (a.textContent = s[m]);
  }
  const b = d.querySelectorAll("[data-ln-attr]");
  for (let h = 0; h < b.length; h++) {
    const a = b[h], m = a.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < m.length; o++) {
      const l = m[o].trim().split(":");
      if (l.length !== 2) continue;
      const u = l[0].trim(), c = l[1].trim();
      s[c] != null && a.setAttribute(u, s[c]);
    }
  }
  const _ = d.querySelectorAll("[data-ln-show]");
  for (let h = 0; h < _.length; h++) {
    const a = _[h], m = a.getAttribute("data-ln-show");
    m in s && a.classList.toggle("hidden", !s[m]);
  }
  const p = d.querySelectorAll("[data-ln-class]");
  for (let h = 0; h < p.length; h++) {
    const a = p[h], m = a.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < m.length; o++) {
      const l = m[o].trim().split(":");
      if (l.length !== 2) continue;
      const u = l[0].trim(), c = l[1].trim();
      c in s && a.classList.toggle(u, !!s[c]);
    }
  }
  return d;
}
function Le(d, s) {
  d.matches && d.matches("[data-ln-form], [data-ln-fillable]") && d.dispatchEvent(new CustomEvent("ln-fill", { detail: s ?? null, bubbles: !0 }));
  const y = d.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let b = 0; b < y.length; b++)
    y[b].dispatchEvent(new CustomEvent("ln-fill", { detail: s ?? null, bubbles: !0 }));
  return d;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(d) {
  if (!(!d.target.matches || !d.target.matches("[data-ln-fillable]")))
    if (d.detail)
      rt(d.target, d.detail);
    else {
      const s = d.target.querySelectorAll("[data-ln-field]");
      for (let y = 0; y < s.length; y++)
        s[y].textContent = "";
    }
})));
function Lt(d, s) {
  if (!d || !s) return d;
  const y = document.createTreeWalker(d, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const p = y.currentNode;
    p.textContent.indexOf("{{") !== -1 && (p.textContent = p.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(h, a) {
        return s[a] !== void 0 ? s[a] : "";
      }
    ));
  }
  const b = function(p, h) {
    return s[h] !== void 0 ? s[h] : "";
  }, _ = Array.from(d.querySelectorAll("*"));
  d.nodeType === 1 && _.push(d);
  for (let p = 0; p < _.length; p++) {
    const h = _[p], a = h.attributes;
    for (let m = 0; m < a.length; m++) {
      const o = a[m];
      o.value.indexOf("{{") !== -1 && h.setAttribute(o.name, o.value.replace(/\{\{\s*(\w+)\s*\}\}/g, b));
    }
  }
  return d;
}
function Te(d, s, y, b, _, p) {
  const h = {};
  for (let m = 0; m < d.children.length; m++) {
    const o = d.children[m], l = o.getAttribute("data-ln-key");
    l && (h[l] = o);
  }
  const a = document.createDocumentFragment();
  for (let m = 0; m < s.length; m++) {
    const o = s[m], l = String(b(o));
    let u = h[l];
    if (u)
      _(u, o, m);
    else {
      const c = kt(y, p);
      if (!c || (Lt(c, o), u = c.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-key", l), _(u, o, m);
    }
    a.appendChild(u);
  }
  d.textContent = "", d.appendChild(a);
}
function ct(d, s) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ct(d, s);
    }), console.warn("[" + s + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  d();
}
function ft(d, s, y) {
  if (d) {
    const b = d.querySelector('[data-ln-template="' + s + '"]');
    if (b) return b.content.cloneNode(!0);
  }
  return kt(s, y);
}
function Wt(d, s) {
  const y = {}, b = d.querySelectorAll("[" + s + "]");
  for (let _ = 0; _ < b.length; _++)
    y[b[_].getAttribute(s)] = b[_].textContent, b[_].remove();
  return y;
}
function Bt(d, s, y, b) {
  if (d.nodeType !== 1) return;
  const p = s.indexOf("[") !== -1 || s.indexOf(".") !== -1 || s.indexOf("#") !== -1 ? s : "[" + s + "]", h = Array.from(d.querySelectorAll(p));
  d.matches && d.matches(p) && h.push(d);
  for (const a of h)
    a[y] || (a[y] = new b(a));
}
function qt(d) {
  return !!(d.offsetWidth || d.offsetHeight || d.getClientRects().length);
}
function qe(d) {
  const s = d.querySelector('input[name="_method"]');
  return ((s && s.value !== "" ? s.value : d.method) || "").toUpperCase();
}
function se(d, s) {
  const y = !!(s && s.typed), b = s && s.exclude, _ = {}, p = d.elements, h = {};
  if (y)
    for (let a = 0; a < p.length; a++) {
      const m = p[a];
      m.name && m.type === "checkbox" && !m.disabled && (h[m.name] = (h[m.name] || 0) + 1);
    }
  for (let a = 0; a < p.length; a++) {
    const m = p[a];
    if (!(!m.name || m.disabled || m.type === "file" || m.type === "submit" || m.type === "button") && !(b && m.matches && m.matches(b)))
      if (m.type === "checkbox")
        y && h[m.name] === 1 ? _[m.name] = m.checked : (_[m.name] || (_[m.name] = []), m.checked && _[m.name].push(m.value));
      else if (m.type === "radio")
        m.checked && (_[m.name] = m.value);
      else if (m.type === "select-multiple") {
        _[m.name] = [];
        for (let o = 0; o < m.options.length; o++)
          m.options[o].selected && _[m.name].push(m.options[o].value);
      } else if (y && m.type === "hidden")
        _[m.name] = m.value;
      else if (y && (m.type === "number" || m.type === "range")) {
        const o = Number(m.value);
        _[m.name] = m.value === "" || isNaN(o) ? null : o;
      } else
        _[m.name] = m.value;
  }
  return _;
}
function ke(d) {
  if (typeof d != "string") return !!d;
  const s = d.trim().toLowerCase();
  return s !== "false" && s !== "0" && s !== "" && s !== "off" && s !== "no";
}
function ae(d, s) {
  const y = d.elements, b = [], _ = {};
  for (let p = 0; p < y.length; p++) {
    const h = y[p];
    h.name && h.type === "checkbox" && (_[h.name] = (_[h.name] || 0) + 1);
  }
  for (let p = 0; p < y.length; p++) {
    const h = y[p];
    if (h.type === "file" || h.type === "submit" || h.type === "button") continue;
    const a = h.getAttribute("data-ln-fill-as") || h.name;
    if (!a || !(a in s)) continue;
    const m = s[a];
    if (h.type === "checkbox") {
      if (Array.isArray(m))
        h.checked = m.indexOf(h.value) !== -1;
      else if (_[h.name] > 1) {
        const o = String(m).split(",").map(function(l) {
          return l.trim();
        });
        h.checked = o.indexOf(h.value) !== -1;
      } else
        h.checked = ke(m);
      b.push(h);
    } else if (h.type === "radio")
      h.checked = h.value === String(m), b.push(h);
    else if (h.type === "select-multiple") {
      if (Array.isArray(m))
        for (let o = 0; o < h.options.length; o++)
          h.options[o].selected = m.indexOf(h.options[o].value) !== -1;
      b.push(h);
    } else
      h.value = m, b.push(h);
  }
  return b;
}
const Jt = {
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
function G(d) {
  const s = d ? d.closest("[lang]") : null, y = (s ? s.getAttribute("lang") || s.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!y) return "en-US";
  const b = y.trim().toLowerCase();
  return b.indexOf("-") === -1 && Jt[b] ? Jt[b] : y;
}
function xt(d) {
  return d.hasAttribute("data-ln-value") ? d.getAttribute("data-ln-value") : d.textContent.trim();
}
function Dt(d) {
  let s = !1;
  for (let y = 0; y < d.length; y++) {
    const b = d[y];
    if (!(b === "" || b == null) && (s = !0, !Number.isFinite(Number(b))))
      return "string";
  }
  return s ? "number" : "string";
}
function It(d, s, y, b) {
  if (y === "number") {
    const h = parseFloat(d), a = parseFloat(s);
    return (isNaN(h) ? 0 : h) - (isNaN(a) ? 0 : a);
  }
  const _ = d != null ? String(d) : "", p = s != null ? String(s) : "";
  return b ? b.compare(_, p) : _ < p ? -1 : _ > p ? 1 : 0;
}
function le(d, s, { get: y, set: b }) {
  Object.defineProperty(d, "value", {
    get: function() {
      return y ? y.call(this) : s.get.call(this);
    },
    set: function(_) {
      b ? b.call(this, _, (p) => s.set.call(this, p)) : s.set.call(this, _);
    },
    configurable: !0
  });
}
function U(d, s, y, b, _ = {}) {
  const p = _.extraAttributes || [], h = _.onAttributeChange || null, a = _.onInit || null;
  function m(o) {
    const l = o || document.body;
    Bt(l, d, s, y), a && a(l);
  }
  return ct(function() {
    const o = new MutationObserver(function(u) {
      for (let c = 0; c < u.length; c++) {
        const f = u[c];
        if (f.type === "childList") {
          for (let e = 0; e < f.addedNodes.length; e++) {
            const r = f.addedNodes[e];
            r.nodeType === 1 && (Bt(r, d, s, y), a && a(r));
          }
          for (let e = 0; e < f.removedNodes.length; e++) {
            const r = f.removedNodes[e];
            if (r.nodeType === 1) {
              const n = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", i = Array.from(r.querySelectorAll(n));
              r.matches && r.matches(n) && i.push(r);
              for (let g = 0; g < i.length; g++) {
                const v = i[g];
                if (!document.contains(v)) {
                  const A = v[s];
                  A && typeof A.destroy == "function" && A.destroy();
                }
              }
            }
          }
        } else f.type === "attributes" && (h && f.target[s] ? h(f.target, f.attributeName) : (Bt(f.target, d, s, y), a && a(f.target)));
      }
    });
    let l = [];
    if (d.indexOf("[") !== -1) {
      const u = /\[([\w-]+)/g;
      let c;
      for (; (c = u.exec(d)) !== null; )
        l.push(c[1]);
    } else
      l.push(d);
    o.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: l.concat(p)
    });
  }, b || (d.indexOf("[") === -1 ? d.replace("data-", "") : "component")), window[s] = m, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body), m;
}
function ce(d, s) {
  if (d.ctrlKey || d.metaKey || d.shiftKey || d.altKey || d.button !== 0 || !s) return !1;
  const y = s.getAttribute("href");
  return !(!y || s.getAttribute("target") === "_blank" || s.hasAttribute("download") || y.startsWith("mailto:") || y.startsWith("tel:") || y === "#" || y.startsWith("#") || s.hostname && s.hostname !== window.location.hostname);
}
function J(...d) {
  return d.filter((s) => s != null && s !== "").map((s, y) => y === 0 ? s.replace(/\/+$/, "") : s.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function yt(d, s) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, d, s ? { Authorization: s } : null);
}
function de(d, s = "ln-core") {
  try {
    return d ? JSON.parse(d) : {};
  } catch (y) {
    return console.error(`[${s}] Invalid headers JSON:`, y), {};
  }
}
const ue = {};
function xe(d, s) {
  ue[d] = s;
}
function De(d) {
  return ue[d] || { ingress: (s) => s, egress: (s) => s };
}
const he = {};
function Gt(d, s) {
  if (!d || typeof s != "object") return;
  const y = d.toLowerCase().split("-")[0];
  he[y] = s;
}
function St(d) {
  if (!d) return null;
  const s = d.toLowerCase().split("-")[0];
  return he[s] || null;
}
Gt("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = xe, window.lnCore.getDataMapper = De, window.lnCore.registerLocaleFallback = Gt, window.lnCore.getLocaleFallback = St, window.lnCore.fillTemplate = Lt, window.lnCore.fill = rt, window.lnCore.lnFill = Le, window.lnCore.renderList = Te);
function Qt(d, s) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, d(), s && s();
    }));
  };
}
function fe(d) {
  d = d || {};
  let s = d.windowSize > 0 ? d.windowSize : 1e3, y = d.pageSize > 0 ? d.pageSize : 200, b = d.threshold != null ? d.threshold : 25, _ = d.fetchDebounce != null ? d.fetchDebounce : 120;
  const p = typeof d.requestPage == "function" ? d.requestPage : function() {
  }, h = typeof d.onChange == "function" ? d.onChange : function() {
  }, a = typeof d.onSwap == "function" ? d.onSwap : function() {
  }, m = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
  let u = 0, c = 0, f = 0, e = { sort: null, filters: {}, search: "" }, r = null, t = 0, n = 0, i = null;
  function g(w) {
    o.set(w, ++t);
  }
  function v() {
    return !!(e && (e.search || e.filters && Object.keys(e.filters).length));
  }
  function A() {
    if (m.size <= s) return;
    const w = Array.from(m.keys()).sort(function(q, x) {
      return (o.get(q) || 0) - (o.get(x) || 0);
    });
    let L = 0;
    for (; m.size > s && L < w.length; )
      m.delete(w[L]), o.delete(w[L]), L++;
  }
  function E(w, L) {
    l.add(w), p(e, w, L);
  }
  return {
    get: function(w) {
      return m.get(w);
    },
    has: function(w) {
      return m.has(w);
    },
    peek: function() {
      return m.size ? m.values().next().value : void 0;
    },
    get logicalTotal() {
      return u;
    },
    get grandTotal() {
      return c;
    },
    get queryGen() {
      return f;
    },
    get size() {
      return m.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(w, L) {
      clearTimeout(r), n = w;
      for (let B = w; B < L; B++)
        m.has(B) && g(B);
      if (u <= 0) return;
      const q = Math.max(0, w - b), x = Math.min(u, L + b), D = Math.floor(q / y), k = Math.floor(Math.max(0, x - 1) / y);
      let M = -1, N = y;
      for (let B = D; B <= k; B++) {
        const H = B * y, j = Math.min(y, u - H);
        let z = !1;
        for (let Z = H; Z < H + j; Z++)
          if (!m.has(Z)) {
            z = !0;
            break;
          }
        if (z && !l.has(H)) {
          M = H, N = j;
          break;
        }
      }
      M !== -1 && (r = setTimeout(function() {
        E(M, N);
      }, _));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(w) {
      if (w = w || {}, w.queryGen != null && w.queryGen !== f) return;
      i && (m.clear(), o.clear(), a(i), i = null), c = w.total != null ? w.total : c, u = w.filtered != null ? w.filtered : w.data ? w.data.length : u;
      const L = w.offset || 0, q = w.data || [];
      for (let x = 0; x < q.length; x++)
        m.set(L + x, q[x]), g(L + x);
      l.delete(L), A(), h();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(w) {
      w && (e = w), E(0, y);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(w) {
      f++, l.clear(), clearTimeout(r), w && (e = w), i = "invalidate", E(0, y);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      f++, l.clear(), clearTimeout(r), i = "revalidate";
      const w = Math.max(0, Math.floor(n / y) * y), L = u > 0 ? Math.min(y, Math.max(1, u - w)) : y;
      E(w, L);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(w) {
      l.delete(w);
    },
    destroy: function() {
      clearTimeout(r), m.clear(), o.clear(), l.clear();
    },
    configure: function(w) {
      w = w || {};
      let L = !1;
      if (w.windowSize != null && w.windowSize > 0 && w.windowSize !== s) {
        const q = w.windowSize < s;
        s = w.windowSize, q && A(), L = !0;
      }
      w.pageSize != null && w.pageSize > 0 && (y = w.pageSize), w.threshold != null && w.threshold >= 0 && (b = w.threshold), w.fetchDebounce != null && w.fetchDebounce >= 0 && (_ = w.fetchDebounce), L && h();
    },
    setGrandTotal: function(w) {
      w == null || isNaN(w) || w < 0 || (c = w, v() || (u = w), h());
    }
  };
}
const Ie = "ln:";
let _t = null;
function pe() {
  if (_t !== null) return _t;
  try {
    if (typeof localStorage > "u")
      return _t = !1, !1;
    const d = "__ln_test__";
    localStorage.setItem(d, d), localStorage.removeItem(d), _t = !0;
  } catch {
    _t = !1;
  }
  return _t;
}
function Re() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function me(d, s) {
  const y = s.getAttribute("data-ln-persist"), b = y !== null && y !== "" ? y : s.id;
  return b ? Ie + d + ":" + Re() + ":" + b : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', s), null);
}
function Mt(d, s) {
  if (!pe()) return null;
  const y = me(d, s);
  if (!y) return null;
  try {
    const b = localStorage.getItem(y);
    return b !== null ? JSON.parse(b) : null;
  } catch {
    return null;
  }
}
function pt(d, s, y) {
  if (!pe()) return;
  const b = me(d, s);
  if (b)
    try {
      y == null ? localStorage.removeItem(b) : localStorage.setItem(b, JSON.stringify(y));
    } catch {
    }
}
function _e(d) {
  return (d || "").replace(/^#/, "");
}
function Nt(d) {
  const s = d === void 0 ? location.hash : d, y = {}, b = _e(s);
  if (!b) return y;
  const _ = b.split("&");
  for (let p = 0; p < _.length; p++) {
    const h = _[p];
    if (!h) continue;
    const a = h.indexOf(":"), m = a > -1 ? h.slice(0, a) : h, o = a > -1 ? h.slice(a + 1) : "";
    if (m)
      try {
        y[m] = decodeURIComponent(o);
      } catch {
        y[m] = o;
      }
  }
  return y;
}
function ht(d) {
  if (!d) return null;
  const s = Nt();
  return d in s ? s[d] : null;
}
function st(d, s) {
  if (!d) return;
  const y = Nt();
  s == null ? delete y[d] : y[d] = String(s);
  const _ = Object.keys(y).map(function(p) {
    const h = y[p];
    return h === "" ? p : p + ":" + encodeURIComponent(h);
  }).join("&");
  _e(location.hash) !== _ && (location.hash = _);
}
function $t(d) {
  return d.button === 1 || d.ctrlKey || d.metaKey || d.shiftKey ? !1 : (d.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Nt, window.lnCore.hashGet = ht, window.lnCore.hashSet = st, window.lnCore.hashLinkClick = $t);
function Rt(d, s, y, b) {
  const _ = typeof b == "number" ? b : 4, p = window.innerWidth, h = window.innerHeight, a = s.width, m = s.height, o = (y || "bottom").split("-"), l = o[0], u = o[1] === "start" || o[1] === "end" ? o[1] : "center", c = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, f = c[l] || c.bottom;
  function e(g) {
    return g === "top" || g === "bottom" ? u === "start" ? d.left : u === "end" ? d.right - a : d.left + (d.width - a) / 2 : u === "start" ? d.top : u === "end" ? d.bottom - m : d.top + (d.height - m) / 2;
  }
  function r(g) {
    let v, A, E = !0;
    return g === "top" ? (v = d.top - _ - m, A = e(g), v < 0 && (E = !1)) : g === "bottom" ? (v = d.bottom + _, A = e(g), v + m > h && (E = !1)) : g === "left" ? (v = e(g), A = d.left - _ - a, A < 0 && (E = !1)) : (v = e(g), A = d.right + _, A + a > p && (E = !1)), { top: v, left: A, side: g, fits: E };
  }
  let t = null;
  for (let g = 0; g < f.length; g++) {
    const v = r(f[g]);
    if (v.fits) {
      t = v;
      break;
    }
  }
  t || (t = r(f[0]));
  let n = t.top, i = t.left;
  return a >= p ? i = 0 : (i < 0 && (i = 0), i + a > p && (i = p - a)), m >= h ? n = 0 : (n < 0 && (n = 0), n + m > h && (n = h - m)), { top: n, left: i, placement: t.side };
}
function Ut(d) {
  if (!d) return { width: 0, height: 0 };
  const s = d.style, y = s.visibility, b = s.display, _ = s.position;
  s.visibility = "hidden", s.display = "block", s.position = "fixed";
  const p = d.offsetWidth, h = d.offsetHeight;
  return s.visibility = y, s.display = b, s.position = _, { width: p, height: h };
}
let ut = null;
async function Zt(d) {
  if (!d) {
    ut = null;
    return;
  }
  try {
    const s = new TextEncoder(), y = await crypto.subtle.digest("SHA-256", s.encode(d));
    ut = await crypto.subtle.importKey(
      "raw",
      y,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (s) {
    console.error("[ln-core/crypto] Key derivation failed:", s), ut = null;
  }
}
function gt() {
  return ut;
}
async function Oe(d, s = ut) {
  const y = s || ut;
  if (!y || d === void 0 || d === null) return d;
  try {
    const b = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), p = typeof d == "string" ? d : JSON.stringify(d), h = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      y,
      b.encode(p)
    ), a = btoa(String.fromCharCode(..._)), m = btoa(String.fromCharCode(...new Uint8Array(h)));
    return {
      encrypted: !0,
      iv: a,
      data: m
    };
  } catch (b) {
    return console.error("[ln-core/crypto] Encryption failed:", b), d;
  }
}
async function Me(d, s = ut) {
  const y = s || ut;
  if (!d || !d.encrypted || !y) return d;
  try {
    const b = new TextDecoder(), _ = Uint8Array.from(atob(d.iv), (m) => m.charCodeAt(0)), p = Uint8Array.from(atob(d.data), (m) => m.charCodeAt(0)), h = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      y,
      p
    ), a = b.decode(h);
    try {
      return JSON.parse(a);
    } catch {
      return a;
    }
  } catch (b) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", b), { ...d, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const d = window.fetch.bind(window), s = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function b(o) {
    return typeof o == "string" ? o : o instanceof URL ? o.href : o instanceof Request ? o.url : String(o);
  }
  function _(o, l) {
    return l && l.method ? String(l.method).toUpperCase() : o instanceof Request ? o.method.toUpperCase() : "GET";
  }
  function p(o, l) {
    return l + " " + o;
  }
  function h(o) {
    return o === "GET" || o === "HEAD";
  }
  function a(o, l) {
    l = l || {};
    const u = b(o), c = _(o, l), f = p(u, c);
    h(c) && s.has(f) && (s.get(f).abort(), s.delete(f));
    const e = new AbortController(), r = l.signal;
    let t = null;
    r && (r.aborted ? e.abort(r.reason) : (t = function() {
      e.abort(r.reason);
    }, r.addEventListener("abort", t, { once: !0 })));
    const n = Object.assign({}, l, { signal: e.signal });
    return s.set(f, e), d(o, n).finally(function() {
      r && t && r.removeEventListener("abort", t), s.get(f) === e && s.delete(f);
    });
  }
  a.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = a;
  function m(o) {
    if (!o.detail || !o.detail.url) return;
    const l = o.target, u = (o.detail.method || (o.detail.body ? "POST" : "GET")).toUpperCase(), c = o.detail.key;
    c && y.has(c) && (y.get(c).abort(), y.delete(c));
    const f = new AbortController(), e = o.detail.signal;
    let r = null;
    e && (e.aborted ? f.abort(e.reason) : (r = function() {
      f.abort(e.reason);
    }, e.addEventListener("abort", r, { once: !0 }))), c && y.set(c, f);
    const t = { method: u, signal: f.signal };
    o.detail.body !== void 0 && (t.body = o.detail.body), window.fetch(o.detail.url, t).then(function(n) {
      e && r && e.removeEventListener("abort", r), c && y.get(c) === f && y.delete(c), S(l, "ln-http:response", {
        ok: n.ok,
        status: n.status,
        response: n
      });
    }).catch(function(n) {
      e && r && e.removeEventListener("abort", r), c && y.get(c) === f && y.delete(c), !(n && n.name === "AbortError") && S(l, "ln-http:error", {
        ok: !1,
        status: 0,
        error: n
      });
    });
  }
  document.addEventListener("ln-http:request", m), window.lnHttp = {
    cancel: function(o) {
      let l = !1;
      return s.forEach(function(u, c) {
        c.endsWith(" " + o) && (u.abort(), s.delete(c), l = !0);
      }), l;
    },
    cancelByKey: function(o) {
      return y.has(o) ? (y.get(o).abort(), y.delete(o), !0) : !1;
    },
    cancelAll: function() {
      s.forEach(function(o) {
        o.abort();
      }), s.clear(), y.forEach(function(o) {
        o.abort();
      }), y.clear();
    },
    get inflight() {
      const o = [];
      return s.forEach(function(l, u) {
        const c = u.indexOf(" ");
        o.push({ method: u.slice(0, c), url: u.slice(c + 1) });
      }), y.forEach(function(l, u) {
        o.push({ key: u });
      }), o;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", m), window.fetch = d, delete window.lnHttp;
    }
  };
})();
(function() {
  const d = "data-ln-form", s = "lnForm", y = "data-ln-form-action-edit", b = "data-ln-form-action-method";
  if (window[s] !== void 0) return;
  function _(p) {
    this.dom = p, this._baseAction = p.getAttribute("action") || "";
    const h = this;
    return this._onLnFill = function(a) {
      a.target === h.dom && (a.detail ? (h.fill(a.detail), h._applyActionMode(a.detail)) : h.dom.reset());
    }, this._onReset = function() {
      h._applyActionMode(null);
    }, p.addEventListener("ln-fill", this._onLnFill), p.addEventListener("reset", this._onReset), this;
  }
  _.prototype.fill = function(p) {
    const h = ae(this.dom, p);
    for (let a = 0; a < h.length; a++) {
      const m = h[a], o = m.tagName === "SELECT" || m.type === "checkbox" || m.type === "radio";
      m.dispatchEvent(new Event(o ? "change" : "input", { bubbles: !0 }));
    }
  }, _.prototype._ensureMethodInput = function() {
    let p = this.dom.querySelector('input[name="_method"]');
    return p || (p = document.createElement("input"), p.type = "hidden", p.name = "_method", p.value = "", this.dom.appendChild(p)), p;
  }, _.prototype._applyActionMode = function(p) {
    if (!this.dom.hasAttribute(y)) return;
    const h = p && p.id != null && p.id !== "" ? p.id : null, a = this._ensureMethodInput();
    if (h !== null) {
      const m = this.dom.getAttribute(y);
      m ? this.dom.setAttribute("action", m.replace(":id", encodeURIComponent(h))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(h)), a.value = this.dom.getAttribute(b) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), a.value = "";
  }, _.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[s]);
  }, U(d, s, _, "ln-form");
})();
(function() {
  const d = "data-ln-validate", s = "lnValidate", y = "data-ln-validate-errors", b = "data-ln-validate-error", _ = "ln-validate-valid", p = "ln-validate-invalid", h = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[s] !== void 0) return;
  function a(m) {
    this.dom = m, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, l = m.tagName, u = m.type, c = l === "SELECT" || u === "checkbox" || u === "radio";
    this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(e) {
      const r = e.detail && e.detail.error;
      if (!r) return;
      o._customErrors.add(r), o._touched = !0;
      const t = m.closest(".form-element");
      if (t) {
        const n = t.querySelector("[" + b + '="' + r + '"]');
        n && n.classList.remove("hidden");
      }
      m.classList.remove(_), m.classList.add(p), m.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(e) {
      const r = e.detail && e.detail.error, t = m.closest(".form-element");
      if (r) {
        if (o._customErrors.delete(r), t) {
          const n = t.querySelector("[" + b + '="' + r + '"]');
          n && n.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(n) {
          if (t) {
            const i = t.querySelector("[" + b + '="' + n + '"]');
            i && i.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, c || m.addEventListener("input", this._onInput), m.addEventListener("change", this._onChange), m.addEventListener("ln-validate:set-custom", this._onSetCustom), m.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const f = m.form;
    return f && (f.hasAttribute("novalidate") || f.setAttribute("novalidate", ""), this._onFormReset = function() {
      o.reset();
    }, this._onValidateRequest = function(e) {
      o._touched = !0, !o.validate() && e.detail && e.detail.invalidFields && e.detail.invalidFields.push(o.dom);
    }, f.addEventListener("reset", this._onFormReset), f.addEventListener("ln-validate:request-validate", this._onValidateRequest), f._lnValidateGateBound || (f._lnValidateGateBound = !0, f.addEventListener("submit", function(e) {
      const r = { invalidFields: [] };
      S(f, "ln-validate:request-validate", r), r.invalidFields.length > 0 && (e.preventDefault(), r.invalidFields.sort((t, n) => t.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), r.invalidFields[0].focus());
    }))), this;
  }
  a.prototype.validate = function() {
    const m = this.dom, o = m.validity, u = m.checkValidity() && this._customErrors.size === 0, c = m.closest(".form-element");
    if (c) {
      const e = c.querySelector("[" + y + "]");
      if (e) {
        const r = e.querySelectorAll("[" + b + "]");
        for (let t = 0; t < r.length; t++) {
          const n = r[t].getAttribute(b), i = h[n];
          i && (o[i] ? r[t].classList.remove("hidden") : r[t].classList.add("hidden"));
        }
      }
    }
    return m.classList.toggle(_, u), m.classList.toggle(p, !u), m.setAttribute("aria-invalid", u ? "false" : "true"), S(m, u ? "ln-validate:valid" : "ln-validate:invalid", { target: m, field: m.name }), u;
  }, a.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, p), this.dom.removeAttribute("aria-invalid");
    const m = this.dom.closest(".form-element");
    if (m) {
      const o = m.querySelectorAll("[" + b + "]");
      for (let l = 0; l < o.length; l++)
        o[l].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), a.prototype.destroy = function() {
    if (!this.dom[s]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const m = this.dom.form;
    m && (this._onFormReset && m.removeEventListener("reset", this._onFormReset), this._onValidateRequest && m.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(_, p), this.dom.removeAttribute("aria-invalid"), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[s];
  }, U(d, s, a, "ln-validate");
})();
(function() {
  const d = "data-ln-ajax", s = "lnAjax", y = "data-ln-form-scope";
  if (window[s] !== void 0) return;
  function b(u) {
    if (!u.hasAttribute(d) || u[s]) return;
    u[s] = !0;
    const c = m(u);
    _(c.links), p(c.forms);
  }
  function _(u) {
    for (const c of u) {
      if (c[s + "Trigger"] || c.hostname && c.hostname !== window.location.hostname) continue;
      const f = c.getAttribute("href");
      if (f && f.includes("#")) continue;
      const e = function(r) {
        if (!ce(r, c)) return;
        r.preventDefault();
        const t = c.getAttribute("href");
        t && a("GET", t, null, c);
      };
      c.addEventListener("click", e), c[s + "Trigger"] = e;
    }
  }
  function p(u) {
    for (const c of u) {
      if (c[s + "Trigger"]) continue;
      if (c.hasAttribute(y)) {
        c[s + "ScopeWarned"] || (c[s + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const f = function(e) {
        if (e.defaultPrevented) return;
        e.preventDefault();
        const r = c.method.toUpperCase(), t = c.action, n = new FormData(c);
        for (const i of c.querySelectorAll('button, input[type="submit"]'))
          i.disabled = !0;
        a(r, t, n, c, function() {
          for (const i of c.querySelectorAll('button, input[type="submit"]'))
            i.disabled = !1;
        });
      };
      c.addEventListener("submit", f), c[s + "Trigger"] = f;
    }
  }
  function h(u) {
    if (!u[s]) return;
    const c = m(u);
    for (const f of c.links)
      f[s + "Trigger"] && (f.removeEventListener("click", f[s + "Trigger"]), delete f[s + "Trigger"]);
    for (const f of c.forms)
      f[s + "Trigger"] && (f.removeEventListener("submit", f[s + "Trigger"]), delete f[s + "Trigger"]);
    delete u[s];
  }
  function a(u, c, f, e, r) {
    if ($(e, "ln-ajax:before-start", { method: u, url: c }).defaultPrevented) return;
    S(e, "ln-ajax:start", { method: u, url: c }), e.classList.add("ln-ajax--loading");
    const n = document.createElement("span");
    n.className = "ln-ajax-spinner", e.appendChild(n);
    function i() {
      e.classList.remove("ln-ajax--loading");
      const w = e.querySelector(".ln-ajax-spinner");
      w && w.remove(), r && r();
    }
    let g = c;
    const v = document.querySelector('meta[name="csrf-token"]'), A = v ? v.getAttribute("content") : null;
    f instanceof FormData && A && f.append("_token", A);
    const E = {
      method: u,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (A && (E.headers["X-CSRF-TOKEN"] = A), u === "GET" && f) {
      const w = new URLSearchParams(f);
      g = c + (c.includes("?") ? "&" : "?") + w.toString();
    } else u !== "GET" && f && (E.body = f);
    fetch(g, E).then(function(w) {
      const L = w.ok;
      return w.json().then(function(q) {
        return { ok: L, status: w.status, data: q };
      });
    }).then(function(w) {
      const L = w.data;
      if (w.ok) {
        if (L.title && (document.title = L.title), L.content)
          for (const q in L.content) {
            const x = document.getElementById(q);
            x && (x.innerHTML = L.content[q]);
          }
        if (e.tagName === "A") {
          const q = e.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else e.tagName === "FORM" && e.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", g);
        S(e, "ln-ajax:success", { method: u, url: g, data: L });
      } else
        S(e, "ln-ajax:error", { method: u, url: g, status: w.status, data: L });
      if (L.message) {
        const q = L.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: q.type || (w.ok ? "success" : "error"),
            title: q.title || "",
            message: q.body || ""
          }
        }));
      }
      S(e, "ln-ajax:complete", { method: u, url: g }), i();
    }).catch(function(w) {
      S(e, "ln-ajax:error", { method: u, url: g, error: w }), S(e, "ln-ajax:complete", { method: u, url: g }), i();
    });
  }
  function m(u) {
    const c = { links: [], forms: [] };
    return u.tagName === "A" && u.getAttribute(d) !== "false" ? c.links.push(u) : u.tagName === "FORM" && u.getAttribute(d) !== "false" ? c.forms.push(u) : (c.links = Array.from(u.querySelectorAll('a:not([data-ln-ajax="false"])')), c.forms = Array.from(u.querySelectorAll('form:not([data-ln-ajax="false"])'))), c;
  }
  function o() {
    ct(function() {
      new MutationObserver(function(c) {
        for (const f of c)
          if (f.type === "childList") {
            for (const e of f.addedNodes)
              if (e.nodeType === 1 && (b(e), !e.hasAttribute(d))) {
                for (const t of e.querySelectorAll("[" + d + "]"))
                  b(t);
                const r = e.closest && e.closest("[" + d + "]");
                if (r && r.getAttribute(d) !== "false") {
                  const t = m(e);
                  _(t.links), p(t.forms);
                }
              }
          } else f.type === "attributes" && b(f.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-ajax");
  }
  function l() {
    for (const u of document.querySelectorAll("[" + d + "]"))
      b(u);
  }
  window[s] = b, window[s].destroy = h, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
const ge = {
  navigate: function(d) {
    Ct(d, { historyAction: "push" });
  },
  replace: function(d) {
    Ct(d, { historyAction: "replace" });
  },
  current: function() {
    return jt ? {
      path: zt,
      params: ve,
      query: we,
      route: jt,
      regions: ye
    } : null;
  }
}, Yt = "data-ln-route", be = "lnRoute";
typeof window < "u" && (window.lnRouter = ge);
const lt = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new WeakMap();
let ye = /* @__PURE__ */ new Map(), ee = !1, zt = null, ve = {}, we = {}, jt = null, Kt = !1;
function ne(d, s, y) {
  Kt ? queueMicrotask(function() {
    S(d, s, y);
  }) : S(d, s, y);
}
function Ot(d) {
  try {
    const p = new URL(d, window.location.origin);
    d = p.pathname + p.search + p.hash;
  } catch {
  }
  let [s] = d.split("#"), [y, b] = s.split("?");
  const _ = {};
  if (b) {
    const p = new URLSearchParams(b);
    for (const [h, a] of p.entries())
      _[h] = a;
  }
  return y = y.replace(/\/+$/, ""), y === "" && (y = "/"), { path: y, query: _ };
}
function Ee(d, s) {
  if (d.pattern === "*") return 1;
  if (s.pattern === "*") return -1;
  const y = d.segments, b = s.segments, _ = Math.max(y.length, b.length);
  for (let p = 0; p < _; p++) {
    const h = y[p], a = b[p];
    if (h === void 0) return 1;
    if (a === void 0) return -1;
    if (h === "*") return 1;
    if (a === "*") return -1;
    const m = h.startsWith(":"), o = a.startsWith(":");
    if (m && !o) return 1;
    if (!m && o) return -1;
  }
  return 0;
}
function Ae(d, s) {
  const y = d.split("/").filter(Boolean);
  for (const b of s) {
    if (b.pattern === "*")
      return {
        route: b,
        params: { wildcard: d }
      };
    const _ = b.segments, p = {};
    let h = !0;
    if (!(y.length > _.length && _[_.length - 1] !== "*")) {
      for (let a = 0; a < _.length; a++) {
        const m = _[a], o = y[a];
        if (m === "*") {
          p.wildcard = y.slice(a).join("/");
          break;
        }
        if (o === void 0) {
          h = !1;
          break;
        }
        if (m.startsWith(":"))
          p[m.slice(1)] = decodeURIComponent(o);
        else if (m !== o) {
          h = !1;
          break;
        }
      }
      if (h && (_.indexOf("*") !== -1 || y.length <= _.length))
        return { route: b, params: p };
    }
  }
  return null;
}
function Vt(d, s) {
  if (d !== "__primary__") {
    const b = document.getElementById(s.target);
    return b || console.warn(`[ln-router] Explicit target element #${s.target} not found in DOM`), b;
  }
  const y = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return y || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), y;
}
function Ne(d) {
  if (!d) return;
  const s = Array.from(d.querySelectorAll("*")), y = [d].concat(s);
  for (const _ of y)
    for (const p of Object.keys(_))
      if (p.startsWith("ln") && _[p] && typeof _[p].destroy == "function")
        try {
          _[p].destroy();
        } catch (h) {
          console.error(`[ln-router] Error destroying component ${p} on element:`, _, h);
        }
  const b = document.querySelectorAll('[data-ln-popover="open"]');
  for (const _ of b) {
    const p = _.lnPopover;
    if (p && p.trigger && d.contains(p.trigger))
      try {
        p.destroy();
      } catch (h) {
        console.error("[ln-router] Error destroying open popover:", h);
      }
  }
}
function Ct(d, s = {}) {
  const { path: y, query: b } = Ot(d), _ = /* @__PURE__ */ new Map();
  for (const [l, u] of lt)
    _.set(l, Ae(y, u.sorted));
  const p = lt.has("__primary__"), h = _.get("__primary__");
  if (p && !h) {
    ne(document.body, "ln-router:not-found", { path: y });
    return;
  }
  let a = null;
  if (h && (a = Vt("__primary__", h.route), !a || $(a, "ln-router:before-navigate", {
    from: zt,
    to: d,
    params: h.params,
    query: b
  }).defaultPrevented))
    return;
  const m = [];
  for (const [l, u] of _) {
    if (!u) continue;
    const c = Vt(l, u.route);
    c && (l !== "__primary__" && c.hasAttribute("data-ln-route-keep") && te.get(c) === u.route.templateNode || m.push({ regionKey: l, match: u, targetEl: c }));
  }
  s.historyAction === "push" ? window.history.pushState(null, "", d) : s.historyAction === "replace" && window.history.replaceState(null, "", d);
  const o = function() {
    for (const { regionKey: l, match: u, targetEl: c } of m) {
      if (!(s.isHydration && c.hasAttribute("data-ln-router-hydrate") && c.children.length > 0)) {
        Ne(c);
        const e = u.route.templateNode.content.cloneNode(!0);
        c.replaceChildren(e);
      }
      if (te.set(c, u.route.templateNode), l === "__primary__" && (u.route.title && (document.title = u.route.title), !s.isHydration)) {
        c.hasAttribute("tabindex") || c.setAttribute("tabindex", "-1");
        const e = c.querySelector("h1, h2, h3, h4, h5, h6");
        e ? (e.setAttribute("tabindex", "-1"), e.focus()) : c.focus(), c.scrollIntoView({ block: "start", behavior: "instant" });
      }
      ne(c, "ln-router:navigated", {
        path: d,
        params: u.params,
        query: b,
        route: u.route,
        target: c,
        region: l
      });
    }
    h && (zt = d, ve = h.params, we = b, jt = h.route), ye = new Map(
      Array.from(_.entries()).map(([l, u]) => [l, u ? { route: u.route, params: u.params } : null])
    );
  };
  document.startViewTransition && !s.isHydration ? document.startViewTransition(o) : o();
}
function Fe(d) {
  const s = d.target.closest("a");
  if (!s || !ce(d, s)) return;
  const y = s.getAttribute("href"), { path: b } = Ot(y), _ = lt.get("__primary__");
  if (!_) return;
  Ae(b, _.sorted) && (d.preventDefault(), Ct(y, { historyAction: "push" }));
}
function Pe(d, s) {
  const y = Object.keys(d), b = Object.keys(s);
  if (y.length !== b.length) return !1;
  for (let _ = 0; _ < y.length; _++) {
    const p = y[_];
    if (d[p] !== s[p]) return !1;
  }
  return !0;
}
function Be() {
  const d = window.location.pathname + window.location.search, s = ge.current();
  if (s && s.path != null) {
    const y = Ot(d);
    if (Ot(s.path).path === y.path && Pe(s.query, y.query))
      return;
  }
  Ct(d, { historyAction: "skip" });
}
function He() {
  ee || (ee = !0, ct(function() {
    document.addEventListener("click", Fe), window.addEventListener("popstate", Be), Kt = !0;
    const d = window.location.pathname + window.location.search + window.location.hash;
    Ct(d, { historyAction: "replace", isHydration: !0 }), Kt = !1;
  }, "ln-router"));
}
function Ue(d) {
  const s = d.getAttribute(Yt);
  if (!s) return;
  const y = d.getAttribute("data-ln-route-target") || null;
  if (y === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${s}" rejected.`);
    return;
  }
  const b = y || "__primary__";
  lt.has(b) || lt.set(b, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const _ = lt.get(b);
  if (_.routes.has(s)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${s}" in region "${b}"`);
    return;
  }
  const p = d.getAttribute("data-ln-route-title"), h = s.split("/").filter(Boolean), a = {
    pattern: s,
    segments: h,
    target: y,
    title: p,
    templateNode: d
  }, m = Vt(b, a);
  m && m.contains(d) && console.warn(`[ln-router] Route template with pattern "${s}" is declared inside its own outlet element:`, d), _.routes.set(s, a), _.sorted = Array.from(_.routes.values()).sort(Ee);
}
function ze(d) {
  const s = d.getAttribute(Yt);
  if (!s) return;
  const b = d.getAttribute("data-ln-route-target") || null || "__primary__", _ = lt.get(b);
  _ && (_.routes.delete(s), _.sorted = Array.from(_.routes.values()).sort(Ee), _.routes.size === 0 && lt.delete(b));
}
function Se(d) {
  return this.dom = d, Ue(d), this;
}
Se.prototype.destroy = function() {
  ze(this.dom), delete this.dom[be];
};
U(Yt, be, Se, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    lt.size > 0 && He();
  }
});
(function() {
  const d = "data-ln-modal", s = "lnModal";
  if (window[s] !== void 0) return;
  function y(_) {
    this.dom = _, this.isOpen = _.getAttribute(d) === "open";
    const p = this;
    return this._onRequestOpen = function() {
      p.dom.setAttribute(d, "open");
    }, this._onRequestClose = function() {
      p.dom.setAttribute(d, "close");
    }, this._onCancel = function(h) {
      h.preventDefault(), p.dom.setAttribute(d, "close");
    }, this._onClickClose = function(h) {
      const a = h.target.closest("[data-ln-modal-close]");
      a && p.dom.contains(a) && (h.preventDefault(), p.dom.setAttribute(d, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  y.prototype.destroy = function() {
    if (this.dom[s]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + d + '="open"]'),
          function(h) {
            return h !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[s];
    }
  };
  function b(_) {
    const p = _[s];
    if (!p) return;
    const a = _.getAttribute(d) === "open";
    if (a !== p.isOpen)
      if (a) {
        if ($(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(d, "close");
          return;
        }
        p.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof _.showModal == "function" && _.showModal();
        const o = _.querySelector("[autofocus]");
        if (o && qt(o))
          o.focus();
        else {
          const l = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(l, qt);
          if (u) u.focus();
          else {
            const c = _.querySelectorAll("a[href], button:not([disabled])"), f = Array.prototype.find.call(c, qt);
            f && f.focus();
          }
        }
        S(_, "ln-modal:open", { modalId: _.id, target: _ });
      } else {
        if ($(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(d, "open");
          return;
        }
        p.isOpen = !1, S(_, "ln-modal:close", { modalId: _.id, target: _ }), typeof _.close == "function" && _.close(), document.querySelector("[" + d + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  U(d, s, y, "ln-modal", {
    onAttributeChange: b
  });
})();
(function() {
  const d = "data-ln-modal-coordinator", s = "lnModalCoordinator";
  if (window[s] !== void 0) return;
  function y(u, c) {
    if (c) {
      if (u) {
        const e = u.closest("[" + d + "]");
        if (e) {
          if (e.id === c && e.hasAttribute("data-ln-modal")) return e;
          const r = e.querySelector("#" + CSS.escape(c) + '[data-ln-modal], [data-ln-modal="' + c + '"]');
          if (r) return r;
        }
      }
      const f = document.getElementById(c) || document.querySelector('[data-ln-modal="' + c + '"]');
      if (f) return f;
    }
    if (u) {
      const f = u.closest("[" + d + "]");
      if (f) {
        if (f.hasAttribute("data-ln-modal")) return f;
        const r = f.querySelector("[data-ln-modal]");
        if (r) return r;
      }
      const e = u.closest("[data-ln-modal]");
      if (e) return e;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function b(u, c) {
    if (u !== "edit") return "";
    if (c) {
      const f = c.getAttribute("data-ln-fill-id");
      if (f) return f;
    }
    return "edit";
  }
  function _(u) {
    if (!u) return;
    const c = u.querySelectorAll("[data-ln-field]");
    for (let e = 0; e < c.length; e++)
      c[e].textContent = "";
    const f = u.querySelectorAll("form");
    for (let e = 0; e < f.length; e++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(f[e], null) : f[e].reset();
  }
  document.addEventListener("submit", function(u) {
    if (u.defaultPrevented) return;
    const f = u.target.closest("[data-ln-modal]");
    if (f && f.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + f.id, "true");
      } catch {
      }
      st(f.id, null);
    }
  }), document.addEventListener("click", function(u) {
    if (u.ctrlKey || u.metaKey || u.button === 1) return;
    const c = u.target.closest("[data-ln-modal-for]");
    if (c) {
      const e = c.getAttribute("data-ln-modal-for"), r = y(c, e);
      if (r && r.lnModal) {
        u.preventDefault();
        const t = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, n = {}, i = c.dataset;
        for (const A in i) {
          if (!A.startsWith("lnModal") || t[A]) continue;
          const E = A.slice(7);
          E && (n[E.charAt(0).toLowerCase() + E.slice(1)] = i[A]);
        }
        const g = Object.keys(n).length > 0;
        c.hasAttribute("data-ln-modal-mode") ? r.dataset.lnModalMode = c.getAttribute("data-ln-modal-mode") : r.dataset.lnModalMode = g ? "edit" : "new", g && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(r, n) : r.dataset.lnModalMode === "new" && _(r), r.getAttribute("data-ln-modal") === "open" ? S(r, "ln-modal:request-close", {}) : (r.id && st(r.id, b(r.dataset.lnModalMode, c)), S(r, "ln-modal:request-open", {}));
      }
      return;
    }
    const f = u.target.closest('a[href^="#"]');
    if (f) {
      const e = Nt(f.getAttribute("href"));
      for (const r in e) {
        const t = document.getElementById(r);
        if (t && t.lnModal) {
          if (!$t(u)) return;
          st(r, e[r]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(u) {
    const c = u.target;
    if (!c || !c.lnModal) return;
    (c.dataset.lnModalMode || "new") === "new" && _(c);
  }), document.addEventListener("ln-modal:open", function(u) {
    const c = u.target;
    if (!c || !c.lnModal || !c.id) return;
    let f = ht(c.id);
    f === null && (f = b(c.dataset.lnModalMode, null), st(c.id, f)), f ? (c.dataset.lnModalMode = "edit", c.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: f }
    }))) : (c.dataset.lnModalMode = "new", _(c));
  });
  let p = !1;
  function h() {
    if (!p) {
      p = !0;
      try {
        const u = document.querySelectorAll("[data-ln-modal][id]");
        for (let c = 0; c < u.length; c++) {
          const f = u[c];
          if (!f.lnModal) continue;
          const e = f.id, r = "ln-modal-pending:" + e;
          let t = !1;
          try {
            t = sessionStorage.getItem(r) === "true";
          } catch {
          }
          if (t) {
            try {
              sessionStorage.removeItem(r);
            } catch {
            }
            if (!!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || f.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger"))) {
              f.dataset.lnModalMode = "edit", S(f, "ln-modal:request-open", {});
              continue;
            } else {
              st(e, null), S(f, "ln-modal:request-close", {}), _(f);
              continue;
            }
          }
          const n = ht(e), i = n !== null, g = f.lnModal.isOpen;
          if (i) {
            const v = n ? "edit" : "new";
            f.dataset.lnModalMode = v, g ? n ? f.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: n }
            })) : _(f) : S(f, "ln-modal:request-open", {});
          } else g && S(f, "ln-modal:request-close", {});
        }
      } finally {
        p = !1;
      }
    }
  }
  function a() {
    const u = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let c = 0; c < u.length; c++) {
      const f = u[c];
      f.lnModal && ht(f.id) === null && st(f.id, b(f.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", h);
  function m() {
    a(), h();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    setTimeout(m, 0);
  }) : setTimeout(m, 0);
  function o(u) {
    const c = u.target.closest("[data-ln-modal]");
    if (!(!c || !c.lnModal)) {
      if (c.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + c.id);
        } catch {
        }
        st(c.id, null);
      }
      S(c, "ln-modal:request-close", {}), _(c);
    }
  }
  document.addEventListener("ln-form:success", o), document.addEventListener("ln-ajax:success", o), document.addEventListener("ln-modal:close", function(u) {
    const c = u.target;
    if (!(!c || !c.lnModal)) {
      if (c.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + c.id);
        } catch {
        }
        ht(c.id) !== null && st(c.id, null);
      }
      c.dataset.lnModalMode === "new" && _(c);
    }
  });
  function l(u) {
    return this.dom = u, this;
  }
  l.prototype.destroy = function() {
    this.dom[s] && delete this.dom[s];
  }, U(d, s, l, "ln-modal-coordinator");
})();
(function() {
  const d = "data-ln-number", s = "lnNumber";
  if (window[s] !== void 0) return;
  const y = {}, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(o) {
    if (!y[o]) {
      const l = new Intl.NumberFormat(o, { useGrouping: !0 }), u = l.formatToParts(1234.5);
      let c = "", f = ".";
      for (let e = 0; e < u.length; e++)
        u[e].type === "group" && (c = u[e].value), u[e].type === "decimal" && (f = u[e].value);
      y[o] = { fmt: l, groupSep: c, decimalSep: f };
    }
    return y[o];
  }
  function p(o, l, u) {
    if (u !== null) {
      const c = parseInt(u, 10), f = o + "|d" + c;
      return y[f] || (y[f] = new Intl.NumberFormat(o, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: c })), y[f].format(l);
    }
    return _(o).fmt.format(l);
  }
  function h(o) {
    if (o[s]) return o[s];
    if (o[s] = this, this.dom = o, o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const l = document.createElement("input");
    l.type = "hidden", l.name = o.name, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && l.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.type = "text", o.setAttribute("inputmode", "decimal"), o.insertAdjacentElement("afterend", l), this._hidden = l;
    const u = this;
    Object.defineProperty(l, "value", {
      get: function() {
        return b.get.call(l);
      },
      set: function(f) {
        b.set.call(l, f), f !== "" && !isNaN(parseFloat(f)) ? u._setDisplayRaw(p(G(u.dom), parseFloat(f), u.dom.getAttribute("data-ln-number-decimals"))) : u._setDisplayRaw(""), u.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), le(o, b, {
      get: function() {
        return b.get.call(o);
      },
      set: function(f) {
        if (f === "") {
          u._setDisplayRaw(""), u._setHiddenRaw(""), o.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const e = typeof f == "number" ? f : parseFloat(String(f).replace(/[^\d.-]/g, ""));
        isNaN(e) ? (u._setDisplayRaw(String(f)), u._setHiddenRaw("")) : (u._setHiddenRaw(e), u._setDisplayRaw(p(G(o), e, o.getAttribute("data-ln-number-decimals")))), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      u._handleInput();
    }, o.addEventListener("input", this._onInput), this._onPaste = function(f) {
      f.preventDefault();
      const e = (f.clipboardData || window.clipboardData).getData("text"), r = _(G(o)), t = r.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let n = e.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      r.groupSep && (n = n.split(r.groupSep).join("")), r.decimalSep !== "." && (n = n.replace(r.decimalSep, "."));
      const i = parseFloat(n);
      u.value = isNaN(i) ? NaN : i;
    }, o.addEventListener("paste", this._onPaste);
    const c = o.value;
    if (c !== "") {
      const f = parseFloat(c);
      isNaN(f) || (this._setHiddenRaw(f), this._setDisplayRaw(p(G(o), f, o.getAttribute("data-ln-number-decimals"))), o.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function a(o) {
    if (typeof o == "number") return isNaN(o) ? null : o;
    if (!o || typeof o != "string") return null;
    let l = o.trim();
    if (l === "") return null;
    l = l.replace(/[\s\u00A0$€£]/g, ""), l.indexOf(",") !== -1 && l.indexOf(".") !== -1 ? l.indexOf(".") < l.indexOf(",") ? l = l.replace(/\./g, "").replace(",", ".") : l = l.replace(/,/g, "") : l.indexOf(",") !== -1 && (l = l.replace(",", ".")), l = l.replace(/[^\d.-]/g, "");
    const u = parseFloat(l);
    return isNaN(u) ? null : u;
  }
  h.prototype._initTextElement = function() {
    const o = this.dom;
    let l = o.getAttribute("data-ln-value"), u = o.getAttribute("data-ln-number"), c = null;
    l !== null && l !== "" ? c = l : u !== null && u !== "" && u !== "true" ? c = u : c = o.textContent.trim();
    const f = a(c);
    f !== null ? (this._rawValue = f, o.hasAttribute("data-ln-value") || o.setAttribute("data-ln-value", String(f)), this._formatTextContent()) : this._rawValue = null;
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = p(G(this.dom), this._rawValue, o);
    }
  }, h.prototype._handleInput = function() {
    const o = this.dom, l = _(G(o)), u = b.get.call(o);
    if (u === "") {
      this._setHiddenRaw(""), S(o, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (u === "-") {
      this._setHiddenRaw("");
      return;
    }
    const c = o.selectionStart;
    let f = 0;
    for (let w = 0; w < c; w++)
      /[0-9]/.test(u[w]) && f++;
    let e = u;
    if (l.groupSep && (e = e.split(l.groupSep).join("")), e = e.replace(l.decimalSep, "."), u.endsWith(l.decimalSep) || u.endsWith(".")) {
      const w = e.replace(/\.$/, ""), L = parseFloat(w);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const r = e.indexOf(".");
    if (r !== -1 && e.slice(r + 1).endsWith("0")) {
      const L = parseFloat(e);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const t = o.getAttribute("data-ln-number-decimals");
    if (t !== null && r !== -1) {
      const w = parseInt(t, 10);
      e.slice(r + 1).length > w && (e = e.slice(0, r + 1 + w));
    }
    const n = parseFloat(e);
    if (isNaN(n)) return;
    const i = o.getAttribute("data-ln-number-min"), g = o.getAttribute("data-ln-number-max");
    if (i !== null && n < parseFloat(i) || g !== null && n > parseFloat(g)) return;
    let v;
    if (t !== null)
      v = p(G(o), n, t);
    else {
      const w = r !== -1 ? e.slice(r + 1).length : 0;
      if (w > 0) {
        const L = G(o) + "|u" + w;
        y[L] || (y[L] = new Intl.NumberFormat(G(o), { useGrouping: !0, minimumFractionDigits: w, maximumFractionDigits: w })), v = y[L].format(n);
      } else
        v = l.fmt.format(n);
    }
    this._setDisplayRaw(v);
    let A = f, E = 0;
    for (let w = 0; w < v.length && A > 0; w++)
      E = w + 1, /[0-9]/.test(v[w]) && A--;
    A > 0 && (E = v.length), o.setSelectionRange(E, E), this._setHiddenRaw(n), S(o, "ln-number:input", { value: n, formatted: v });
  }, h.prototype._setHiddenRaw = function(o) {
    this._hidden && b.set.call(this._hidden, String(o));
  }, h.prototype._setDisplayRaw = function(o) {
    this.isTextElement ? this.dom.textContent = String(o) : b.set.call(this.dom, String(o));
  }, h.prototype._displayFormatted = function(o) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(p(G(this.dom), o, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const o = b.get.call(this._hidden);
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
      this._setHiddenRaw(o), this._setDisplayRaw(p(G(this.dom), o, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : b.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[s] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function m() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + d + "]");
      for (let l = 0; l < o.length; l++) {
        const u = o[l][s];
        u && (u.isTextElement ? u._formatTextContent() : isNaN(u.value) || u._displayFormatted(u.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(d, s, h, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(o) {
      const l = o[s];
      l && (l.isTextElement ? l._initTextElement() : isNaN(l.value) || l._displayFormatted(l.value));
    }
  }), m();
})();
(function() {
  const d = "data-ln-date", s = "lnDate";
  if (window[s] !== void 0) return;
  const y = {}, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(i, g) {
    const v = i + "|" + JSON.stringify(g);
    return y[v] || (y[v] = new Intl.DateTimeFormat(i, g)), y[v];
  }
  const p = /^(short|medium|long)(\s+datetime)?$/, h = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function a(i) {
    return !i || i === "" ? { dateStyle: "medium" } : i.match(p) ? h[i] : null;
  }
  function m(i, g, v) {
    const A = i.getDate(), E = i.getMonth(), w = i.getFullYear(), L = i.getHours(), q = i.getMinutes();
    let x, D;
    const k = St(v), M = (v || "").toLowerCase().split("-")[0], B = _(v, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], H = k && B !== M;
    H && k.monthsLong ? x = k.monthsLong[E] : x = _(v, { month: "long" }).format(i), H && k.monthsShort ? D = k.monthsShort[E] : D = _(v, { month: "short" }).format(i);
    const j = {
      yyyy: String(w),
      yy: String(w).slice(-2),
      MMMM: x,
      MMM: D,
      MM: String(E + 1).padStart(2, "0"),
      M: String(E + 1),
      dd: String(A).padStart(2, "0"),
      d: String(A),
      HH: String(L).padStart(2, "0"),
      mm: String(q).padStart(2, "0")
    };
    return g.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(z) {
      return j[z];
    });
  }
  function o(i, g, v) {
    const A = a(g);
    if (A) {
      const E = _(v, A), w = (v || "").toLowerCase().split("-")[0], L = E.resolvedOptions().locale.toLowerCase().split("-")[0];
      return St(v) && L !== w ? m(i, "dd.MM.yyyy", v) : E.format(i);
    }
    return m(i, g, v);
  }
  function l(i) {
    if (!i) return "";
    const g = i.getFullYear(), v = String(i.getMonth() + 1).padStart(2, "0"), A = String(i.getDate()).padStart(2, "0");
    return g + "-" + v + "-" + A;
  }
  function u(i, g, v) {
    S(i.dom, "ln-date:change", {
      value: g,
      formatted: i.dom.value,
      date: v
    }), i.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function c(i, g, v, A) {
    i._setHiddenRaw(g), b.set.call(i._picker, g), i._lastISO = g, A !== void 0 ? (i._isFormatting = !0, i.dom.value = A, i._isFormatting = !1) : v && i._displayFormatted(v), u(i, g, v);
  }
  function f(i) {
    i._setHiddenRaw(""), b.set.call(i._picker, ""), i._isFormatting = !0, i.dom.value = "", i._isFormatting = !1, i._lastISO = "", u(i, "", null);
  }
  e.prototype._initTextElement = function() {
    const i = this.dom;
    let g = i.getAttribute("data-ln-value"), v = i.getAttribute("data-ln-date"), A = i.getAttribute("datetime"), E = null;
    g !== null && g !== "" ? E = g : A !== null && A !== "" ? E = A : v !== null && v !== "" && v !== "true" && !p.test(v) ? E = v : E = i.textContent.trim();
    let w = r(E) || t(E);
    if (!w && E)
      if (isNaN(E))
        w = new Date(E);
      else {
        const L = Number(E);
        w = new Date(L > 1e11 ? L : L * 1e3);
      }
    if (w && !isNaN(w.getTime())) {
      const L = l(w);
      this._rawValue = L, i.hasAttribute("data-ln-value") || i.setAttribute("data-ln-value", L), this._formatTextContent();
    } else
      this._rawValue = null;
  }, e.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const i = r(this._rawValue);
      if (i) {
        let v = this.dom.getAttribute("data-ln-date-format");
        if (!v) {
          const E = this.dom.getAttribute("data-ln-date");
          E && p.test(E) && (v = E);
        }
        const A = G(this.dom);
        this.dom.textContent = o(i, v || "medium", A);
      }
    }
  };
  function e(i) {
    if (i[s]) return i[s];
    if (i[s] = this, this.dom = i, i.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const g = this, v = i.value, A = i.name, w = (i.closest(".form-element, form") || i.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let k = 0; k < w.length; k++) {
      const M = w[k].getAttribute("data-ln-date-dict");
      if (M) {
        const N = Wt(w[k], "data-ln-date-dict-key");
        N["months-long"] && (N.monthsLong = N["months-long"].split(",").map((B) => B.trim())), N["months-short"] && (N.monthsShort = N["months-short"].split(",").map((B) => B.trim())), Gt(M, N);
      }
    }
    const L = document.createElement("span");
    L.setAttribute("data-ln-date-field", ""), i.parentNode.insertBefore(L, i), L.appendChild(i), this._wrapper = L;
    const q = document.createElement("input");
    q.type = "hidden", q.name = A, i.removeAttribute("name"), i.hasAttribute("data-ln-fill-as") && q.setAttribute("data-ln-fill-as", i.getAttribute("data-ln-fill-as")), i.insertAdjacentElement("afterend", q), this._hidden = q;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", q.insertAdjacentElement("afterend", x), this._picker = x, i.type = "text";
    const D = document.createElement("button");
    if (D.type = "button", D.setAttribute("aria-label", i.getAttribute("data-ln-date-label") || "Open date picker"), D.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', x.insertAdjacentElement("afterend", D), this._btn = D, this._lastISO = "", Object.defineProperty(q, "value", {
      get: function() {
        return b.get.call(q);
      },
      set: function(k) {
        if (b.set.call(q, k), k && k !== "") {
          const M = r(k);
          M && c(g, k, M);
        } else k === "" && f(g);
      }
    }), le(i, b, {
      get: function() {
        return b.get.call(i);
      },
      set: function(k, M) {
        if (g._isFormatting) {
          M(k);
          return;
        }
        if (!k || k === "") {
          M(""), f(g);
          return;
        }
        const N = r(k) || t(k);
        if (N) {
          const B = l(N), H = i.getAttribute(d) || "", j = G(i), z = o(N, H, j);
          M(z), c(g, B, N, z);
        } else
          M(String(k)), f(g);
      }
    }), this._onPickerChange = function() {
      const k = x.value;
      if (k) {
        const M = r(k);
        M && c(g, k, M);
      } else
        f(g);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const k = g.dom.value.trim();
      if (k === "") {
        g._lastISO !== "" && f(g);
        return;
      }
      if (g._lastISO) {
        const N = r(g._lastISO);
        if (N) {
          const B = g.dom.getAttribute(d) || "", H = G(g.dom);
          if (k === o(N, B, H)) return;
        }
      }
      const M = t(k);
      if (M) {
        const N = l(M);
        c(g, N, M);
      } else if (g._lastISO) {
        const N = r(g._lastISO);
        N && g._displayFormatted(N);
      } else
        g.dom.value = "";
    }, i.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      g._openPicker();
    }, D.addEventListener("click", this._onBtnClick), v && v !== "") {
      const k = r(v);
      k && c(g, v, k);
    }
    return this;
  }
  function r(i) {
    if (!i || typeof i != "string") return null;
    const g = i.split("T"), v = g[0].split("-");
    if (v.length < 3) return null;
    const A = parseInt(v[0], 10), E = parseInt(v[1], 10) - 1, w = parseInt(v[2], 10);
    if (isNaN(A) || isNaN(E) || isNaN(w)) return null;
    let L = 0, q = 0;
    if (g[1]) {
      const D = g[1].split(":");
      L = parseInt(D[0], 10) || 0, q = parseInt(D[1], 10) || 0;
    }
    const x = new Date(A, E, w, L, q);
    return x.getFullYear() !== A || x.getMonth() !== E || x.getDate() !== w ? null : x;
  }
  function t(i) {
    if (!i || typeof i != "string" || (i = i.trim(), i.length < 6)) return null;
    let g, v;
    if (i.indexOf(".") !== -1)
      g = ".", v = i.split(".");
    else if (i.indexOf("/") !== -1)
      g = "/", v = i.split("/");
    else if (i.indexOf("-") !== -1)
      g = "-", v = i.split("-");
    else
      return null;
    if (v.length !== 3) return null;
    const A = [];
    for (let x = 0; x < 3; x++) {
      const D = parseInt(v[x], 10);
      if (isNaN(D)) return null;
      A.push(D);
    }
    let E, w, L;
    g === "." ? (E = A[0], w = A[1], L = A[2]) : g === "/" ? (w = A[0], E = A[1], L = A[2]) : v[0].length === 4 ? (L = A[0], w = A[1], E = A[2]) : (E = A[0], w = A[1], L = A[2]), L < 100 && (L += L < 50 ? 2e3 : 1900);
    const q = new Date(L, w - 1, E);
    return q.getFullYear() !== L || q.getMonth() !== w - 1 || q.getDate() !== E ? null : q;
  }
  e.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, e.prototype._setHiddenRaw = function(i) {
    b.set.call(this._hidden, i);
  }, e.prototype._displayFormatted = function(i) {
    const g = this.dom.getAttribute(d) || "", v = G(this.dom);
    this._isFormatting = !0, this.dom.value = o(i, g, v), this._isFormatting = !1;
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : b.get.call(this._hidden);
    },
    set: function(i) {
      if (this.isTextElement) {
        if (!i || i === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const v = r(i) || t(i);
        if (!v) return;
        const A = l(v);
        this._rawValue = A, this.dom.setAttribute("data-ln-value", A), this._formatTextContent();
        return;
      }
      if (!i || i === "") {
        f(this);
        return;
      }
      const g = r(i);
      g && c(this, i, g);
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const i = this.value;
      return i ? r(i) : null;
    },
    set: function(i) {
      if (!i || !(i instanceof Date) || isNaN(i.getTime())) {
        this.value = "";
        return;
      }
      this.value = l(i);
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[s]) return;
    if (this.isTextElement) {
      S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[s];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const i = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", i && (this.dom.value = i), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[s];
  };
  function n() {
    new MutationObserver(function() {
      const i = document.querySelectorAll("[" + d + "]");
      for (let g = 0; g < i.length; g++) {
        const v = i[g][s];
        if (v) {
          if (v.isTextElement)
            v._formatTextContent();
          else if (v.value) {
            const A = r(v.value);
            A && v._displayFormatted(A);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(d, s, e, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(i) {
      const g = i[s];
      if (g) {
        if (g.isTextElement)
          g._initTextElement();
        else if (g.value) {
          const v = r(g.value);
          v && g._displayFormatted(v);
        }
      }
    }
  }), n();
})();
(function() {
  const d = "data-ln-nav", s = "lnNav";
  if (window[s] !== void 0) return;
  const y = [];
  if (!history._lnNavPatched) {
    const h = history.pushState;
    history.pushState = function() {
      h.apply(history, arguments);
      for (const a of y)
        a();
    }, history._lnNavPatched = !0;
  }
  function b(h) {
    return this.dom = h, this.activeClass = h.getAttribute(d) || "active", this.exact = h.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), y.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(h, { childList: !0, subtree: !0 }), this.update(), this;
  }
  b.prototype.update = function() {
    if (!this.activeClass || $(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const a = Array.from(this.dom.querySelectorAll("a")), m = window.location.pathname, o = _(m);
    for (const l of a) {
      const u = l.getAttribute("href");
      if (!u || u === "#" || u.startsWith("#") || u.startsWith("javascript:") || u.startsWith("mailto:") || u.startsWith("tel:")) {
        l.classList.remove(this.activeClass), l.removeAttribute("aria-current");
        continue;
      }
      if (l.hostname && l.hostname !== window.location.hostname) {
        l.classList.remove(this.activeClass), l.removeAttribute("aria-current");
        continue;
      }
      const c = _(u), f = c === o, e = !this.exact && c !== "/" && o.startsWith(c + "/");
      f || e ? (l.classList.add(this.activeClass), l.setAttribute("aria-current", "page")) : (l.classList.remove(this.activeClass), l.removeAttribute("aria-current"));
    }
    S(this.dom, "ln-nav:update", { target: this.dom });
  }, b.prototype.destroy = function() {
    if (!this.dom[s]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const h = y.indexOf(this.updateHandler);
    h !== -1 && y.splice(h, 1), S(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[s];
  };
  function _(h) {
    try {
      return new URL(h, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return h.replace(/\/$/, "") || "/";
    }
  }
  function p(h, a) {
    const m = h[s];
    if (m) {
      if (a === d) {
        if (!h.hasAttribute(d)) {
          m.destroy();
          return;
        }
        const o = m.activeClass, l = h.getAttribute(d) || "active";
        if (o !== l) {
          const u = h.querySelectorAll("a");
          for (const c of u)
            o && c.classList.remove(o);
          m.activeClass = l;
        }
      } else a === "data-ln-nav-exact" && (m.exact = h.hasAttribute("data-ln-nav-exact"));
      m.update();
    }
  }
  U(d, s, b, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: p
  });
})();
(function() {
  const d = "data-ln-tabs", s = "lnTabs";
  if (window[s] !== void 0 && window[s] !== null) return;
  function y(p, h) {
    const a = (p.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (a) return a;
    if (p.tagName !== "A") return "";
    const m = p.getAttribute("href") || "";
    if (!m.startsWith("#")) return "";
    const o = m.slice(1);
    if (!o) return "";
    const l = o.split("&");
    if (h)
      for (const f of l) {
        const e = f.indexOf(":");
        if (e > 0 && f.slice(0, e).toLowerCase().trim() === h)
          return f.slice(e + 1).toLowerCase().trim();
      }
    const u = l[l.length - 1] || "", c = u.indexOf(":");
    return (c > 0 ? u.slice(c + 1) : u).toLowerCase().trim();
  }
  function b(p) {
    return this.dom = p, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const p = this.tabs.filter((m) => m.tagName === "A" && (m.getAttribute("href") || "").startsWith("#")), h = p.length > 0 && p.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = h && !!this.nsKey, p.length > 0 && p.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : h && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const m of this.tabs) {
      const o = y(m, this.nsKey);
      o ? this.mapTabs[o] = m : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', m);
    }
    for (const m of this.panels) {
      const o = (m.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = m);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const a = this;
    this._clickHandlers = [];
    for (const m of this.tabs) {
      if (m[s + "Trigger"]) continue;
      const o = function(l) {
        const u = m.tagName === "A";
        if (!u && (l.ctrlKey || l.metaKey || l.button === 1)) return;
        const c = y(m, a.nsKey);
        c && (u && !$t(l) || (a.hashEnabled ? ht(a.nsKey) === c ? a.dom.setAttribute("data-ln-tabs-active", c) : st(a.nsKey, c) : a.dom.setAttribute("data-ln-tabs-active", c)));
      };
      m.addEventListener("click", o), m[s + "Trigger"] = o, a._clickHandlers.push({ el: m, handler: o });
    }
    if (this._onRequestSelect = function(m) {
      const o = m.detail && (m.detail.key || m.detail.tab);
      o && a.dom.setAttribute("data-ln-tabs-active", (o + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!a.hashEnabled) return;
      const m = ht(a.nsKey);
      a.dom.setAttribute("data-ln-tabs-active", m !== null ? m : a.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let m = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const o = Mt("tabs", this.dom);
        o !== null && o in this.mapPanels && (m = o);
      }
      this.dom.setAttribute("data-ln-tabs-active", m);
    }
  }
  b.prototype._applyActive = function(p) {
    var h;
    (!p || !(p in this.mapPanels)) && (p = this.defaultKey);
    for (const a in this.mapTabs) {
      const m = this.mapTabs[a];
      a === p ? (m.setAttribute("data-active", ""), m.setAttribute("aria-selected", "true")) : (m.removeAttribute("data-active"), m.setAttribute("aria-selected", "false"));
    }
    for (const a in this.mapPanels) {
      const m = this.mapPanels[a], o = a === p;
      m.classList.toggle("hidden", !o), m.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const a = (h = this.mapPanels[p]) == null ? void 0 : h.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      a && setTimeout(() => a.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: p, tab: this.mapTabs[p], panel: this.mapPanels[p] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && pt("tabs", this.dom, p);
  }, b.prototype.destroy = function() {
    if (this.dom[s]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: p, handler: h } of this._clickHandlers)
        p.removeEventListener("click", h), delete p[s + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[s];
    }
  }, U(d, s, b, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(p) {
      const h = p.getAttribute("data-ln-tabs-active");
      p[s]._applyActive(h);
    }
  });
})();
(function() {
  const d = "data-ln-toggle", s = "lnToggle";
  if (window[s] !== void 0) return;
  function y(p, h) {
    const a = document.querySelectorAll(
      '[data-ln-toggle-for="' + p.id + '"]'
    );
    for (const m of a)
      m.setAttribute("aria-expanded", h ? "true" : "false");
  }
  function b(p) {
    this.dom = p;
    const h = this;
    if (this._onRequestOpen = function() {
      h.open();
    }, this._onRequestClose = function() {
      h.close();
    }, this._onRequestToggle = function() {
      h.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), p.hasAttribute("data-ln-persist")) {
      const a = Mt("toggle", p);
      a !== null && p.setAttribute(d, a);
    }
    return this.isOpen = p.getAttribute(d) === "open", this.isOpen && p.classList.add("open"), y(p, this.isOpen), this;
  }
  b.prototype.open = function() {
    this.dom.setAttribute(d, "open");
  }, b.prototype.close = function() {
    this.dom.setAttribute(d, "close");
  }, b.prototype.toggle = function() {
    const p = this.dom.getAttribute(d);
    this.dom.setAttribute(d, p === "open" ? "close" : "open");
  }, b.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function _(p) {
    const h = p[s];
    if (!h) return;
    const m = p.getAttribute(d) === "open";
    if (m !== h.isOpen)
      if (m) {
        if ($(p, "ln-toggle:before-open", { target: p }).defaultPrevented) {
          p.setAttribute(d, "close");
          return;
        }
        h.isOpen = !0, p.classList.add("open"), y(p, !0), S(p, "ln-toggle:open", { target: p }), p.hasAttribute("data-ln-persist") && pt("toggle", p, "open");
      } else {
        if ($(p, "ln-toggle:before-close", { target: p }).defaultPrevented) {
          p.setAttribute(d, "open");
          return;
        }
        h.isOpen = !1, p.classList.remove("open"), y(p, !1), S(p, "ln-toggle:close", { target: p }), p.hasAttribute("data-ln-persist") && pt("toggle", p, "close");
      }
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const h = p.target.closest("[data-ln-toggle-for]");
    if (h) {
      const a = h.getAttribute("data-ln-toggle-for"), m = document.getElementById(a);
      if (m && m[s]) {
        p.preventDefault();
        const o = h.getAttribute("data-ln-toggle-action") || "toggle";
        if (o === "open")
          m.setAttribute(d, "open");
        else if (o === "close")
          m.setAttribute(d, "close");
        else if (o === "toggle") {
          const l = m.getAttribute(d);
          m.setAttribute(d, l === "open" ? "close" : "open");
        }
      }
    }
  }), U(d, s, b, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const d = "data-ln-accordion", s = "lnAccordion";
  if (window[s] !== void 0) return;
  function y(b) {
    return this.dom = b, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== b) return;
      const p = b.querySelectorAll("[data-ln-toggle]");
      for (const h of p)
        h !== _.detail.target && h.closest("[data-ln-accordion]") === b && h.getAttribute("data-ln-toggle") === "open" && h.setAttribute("data-ln-toggle", "close");
      S(b, "ln-accordion:change", { target: _.detail.target });
    }, b.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[s]);
  }, U(d, s, y, "ln-accordion");
})();
(function() {
  const d = "data-ln-dropdown", s = "lnDropdown";
  if (window[s] !== void 0) return;
  function y(b) {
    if (this.dom = b, this.toggleEl = b.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = b.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const p of this.toggleEl.children)
        p.setAttribute("role", "menuitem");
    const _ = this;
    return this._onRequestOpen = function() {
      _.toggleEl && _.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      _.toggleEl && _.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (_.toggleEl) {
        const p = _.toggleEl.getAttribute("data-ln-toggle");
        _.toggleEl.setAttribute("data-ln-toggle", p === "open" ? "close" : "open");
      }
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._onToggleOpen = function(p) {
      !p.detail || p.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "true"), typeof _.toggleEl.showPopover == "function" && _.toggleEl.showPopover(), _._reposition(), _._addOutsideClickListener(), _._addScrollRepositionListener(), _._addResizeCloseListener(), S(b, "ln-dropdown:open", { target: p.detail.target }));
    }, this._onToggleClose = function(p) {
      !p.detail || p.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "false"), _._removeOutsideClickListener(), _._removeScrollRepositionListener(), _._removeResizeCloseListener(), _.toggleEl.style.top = "", _.toggleEl.style.left = "", typeof _.toggleEl.hidePopover == "function" && _.toggleEl.matches(":popover-open") && _.toggleEl.hidePopover(), S(b, "ln-dropdown:close", { target: p.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  y.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const b = this.triggerBtn.getBoundingClientRect(), _ = Ut(this.toggleEl), p = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, h = Rt(b, _, "bottom-end", p);
    this.toggleEl.style.top = h.top + "px", this.toggleEl.style.left = h.left + "px";
  }, y.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const b = this;
    this._boundDocClick = function(_) {
      b.dom.contains(_.target) || b.toggleEl && b.toggleEl.contains(_.target) || b.toggleEl && b.toggleEl.getAttribute("data-ln-toggle") === "open" && b.toggleEl.setAttribute("data-ln-toggle", "close");
    }, b._docClickTimeout = setTimeout(function() {
      b._docClickTimeout = null, document.addEventListener("click", b._boundDocClick);
    }, 0);
  }, y.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, y.prototype._addScrollRepositionListener = function() {
    const b = this;
    this._boundScrollReposition = function() {
      b._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, y.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, y.prototype._addResizeCloseListener = function() {
    const b = this;
    this._boundResizeClose = function() {
      b.toggleEl && b.toggleEl.getAttribute("data-ln-toggle") === "open" && b.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, y.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, y.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[s]);
  }, U(d, s, y, "ln-dropdown");
})();
(function() {
  const d = "data-ln-popover", s = "lnPopover", y = "data-ln-popover-for", b = "data-ln-popover-position";
  if (window[s] !== void 0) return;
  const _ = [];
  let p = null;
  function h() {
    p || (p = function(l) {
      if (l.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", p));
  }
  function a() {
    _.length > 0 || p && (document.removeEventListener("keydown", p), p = null);
  }
  function m(l) {
    this.dom = l, this.isOpen = l.getAttribute(d) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const u = this;
    return this._onRequestOpen = function(c) {
      const f = c.detail && c.detail.trigger ? c.detail.trigger : null;
      u.open(f);
    }, this._onRequestClose = function() {
      u.close();
    }, this._onRequestToggle = function(c) {
      const f = c.detail && c.detail.trigger ? c.detail.trigger : null;
      u.toggle(f);
    }, l.addEventListener("ln-popover:request-open", this._onRequestOpen), l.addEventListener("ln-popover:request-close", this._onRequestClose), l.addEventListener("ln-popover:request-toggle", this._onRequestToggle), l.hasAttribute("tabindex") || l.setAttribute("tabindex", "-1"), l.hasAttribute("role") || l.setAttribute("role", "dialog"), l.hasAttribute("popover") || l.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  m.prototype.open = function(l) {
    this.isOpen || (this.trigger = l || null, this.dom.setAttribute(d, "open"));
  }, m.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(d, "closed");
  }, m.prototype.toggle = function(l) {
    this.isOpen ? this.close() : this.open(l);
  }, m.prototype._applyOpen = function(l) {
    this.isOpen = !0, l && (this.trigger = l), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const u = Ut(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(b) || "bottom", n = Rt(r, u, t, 8);
      this.dom.style.top = n.top + "px", this.dom.style.left = n.left + "px", this.dom.setAttribute("data-ln-popover-placement", n.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const c = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), f = Array.prototype.find.call(c, qt);
    f ? f.focus() : this.dom.focus();
    const e = this;
    this._boundDocClick = function(r) {
      e.dom.contains(r.target) || e.trigger && e.trigger.contains(r.target) || e.close();
    }, e._docClickTimeout = setTimeout(function() {
      e._docClickTimeout = null, document.addEventListener("click", e._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!e.trigger) return;
      const r = e.trigger.getBoundingClientRect(), t = Ut(e.dom), n = e.dom.getAttribute(b) || "bottom", i = Rt(r, t, n, 8);
      e.dom.style.top = i.top + "px", e.dom.style.left = i.left + "px", e.dom.setAttribute("data-ln-popover-placement", i.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), h(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, m.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const l = _.indexOf(this);
    l !== -1 && _.splice(l, 1), a(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, m.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[s], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(l) {
    this.dom = l;
    const u = l.getAttribute(y);
    return l.setAttribute("aria-haspopup", "dialog"), l.setAttribute("aria-expanded", "false"), l.setAttribute("aria-controls", u), this._onClick = function(c) {
      if (c.ctrlKey || c.metaKey || c.button === 1) return;
      c.preventDefault();
      const f = document.getElementById(u);
      if (!f) return;
      f[s] && (f[s].trigger = l);
      const e = f.getAttribute(d);
      f.setAttribute(d, e === "open" ? "closed" : "open");
    }, l.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[s + "Trigger"];
  }, U(d, s, m, "ln-popover", {
    onAttributeChange: function(l) {
      const u = l[s];
      if (!u) return;
      const f = l.getAttribute(d) === "open";
      if (f !== u.isOpen)
        if (f) {
          if ($(l, "ln-popover:before-open", {
            popoverId: l.id,
            target: l,
            trigger: u.trigger
          }).defaultPrevented) {
            l.setAttribute(d, "closed");
            return;
          }
          u._applyOpen(u.trigger);
        } else {
          if ($(l, "ln-popover:before-close", {
            popoverId: l.id,
            target: l,
            trigger: u.trigger
          }).defaultPrevented) {
            l.setAttribute(d, "open");
            return;
          }
          u._applyClose();
        }
    }
  }), U(y, s + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const d = "data-ln-tooltip-enhance", s = "data-ln-tooltip", y = "data-ln-tooltip-position", b = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[b] !== void 0) return;
  let p = 0, h = null, a = null, m = null, o = null, l = null, u = null;
  function c() {
    return h && h.parentNode || (h = document.getElementById(_), h || (h = document.createElement("div"), h.id = _, document.body.appendChild(h)), h.hasAttribute("popover") || h.setAttribute("popover", "manual")), h;
  }
  function f() {
    u || (u = function(i) {
      i.key === "Escape" && t();
    }, document.addEventListener("keydown", u));
  }
  function e() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function r(i) {
    if (m === i) return;
    t();
    const g = i.getAttribute(s) || i.getAttribute("title");
    if (!g) return;
    c(), typeof h.showPopover == "function" && h.showPopover(), i.hasAttribute("title") && (o = i.getAttribute("title"), i.removeAttribute("title"));
    const v = i.getAttribute("aria-describedby");
    v ? l = v : l = null;
    const A = document.createElement("div");
    A.className = "ln-tooltip", A.textContent = g, i[b + "Uid"] || (p += 1, i[b + "Uid"] = "ln-tooltip-" + p), A.id = i[b + "Uid"], h.appendChild(A);
    const E = A.offsetWidth, w = A.offsetHeight, L = i.getBoundingClientRect(), q = i.getAttribute(y) || "top", x = Rt(L, { width: E, height: w }, q, 6);
    A.style.top = x.top + "px", A.style.left = x.left + "px", A.setAttribute("data-ln-tooltip-placement", x.placement), l ? i.setAttribute("aria-describedby", l + " " + A.id) : i.setAttribute("aria-describedby", A.id), a = A, m = i, f();
  }
  function t() {
    if (!a) {
      e();
      return;
    }
    m && (l !== null ? m.setAttribute("aria-describedby", l) : m.removeAttribute("aria-describedby"), l = null, o !== null && m.setAttribute("title", o)), o = null, a.parentNode && a.parentNode.removeChild(a), a = null, m = null, h && typeof h.hidePopover == "function" && h.matches(":popover-open") && h.hidePopover(), e();
  }
  function n(i) {
    return this.dom = i, i.hasAttribute("data-ln-tooltip-enhanced") || (i.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(i);
    }, this._onLeave = function() {
      m === i && !i.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      r(i);
    }, this._onBlur = function() {
      m === i && !i.matches(":hover") && t();
    }, i.addEventListener("mouseenter", this._onEnter), i.addEventListener("mouseleave", this._onLeave), i.addEventListener("focus", this._onFocus, !0), i.addEventListener("blur", this._onBlur, !0), this;
  }
  n.prototype.destroy = function() {
    const i = this.dom;
    i.removeEventListener("mouseenter", this._onEnter), i.removeEventListener("mouseleave", this._onLeave), i.removeEventListener("focus", this._onFocus, !0), i.removeEventListener("blur", this._onBlur, !0), m === i && t(), this._addedEnhancedAttr && i.removeAttribute("data-ln-tooltip-enhanced"), delete i[b], delete i[b + "Uid"], S(i, "ln-tooltip:destroyed", { trigger: i });
  }, U(
    "[" + d + "], [data-ln-tooltip-enhanced], [" + s + "][title]",
    b,
    n,
    "ln-tooltip"
  );
})();
(function() {
  const d = "data-ln-toast", s = "lnToast", y = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function b(r) {
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
  function _(r) {
    if (!r || !(r instanceof HTMLElement)) return;
    if (r.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof r.hidePopover == "function" && r.matches(":popover-open"))
      try {
        r.hidePopover();
      } catch {
      }
  }
  function p(r) {
    if (!r || r.nodeType !== 1) return;
    const t = Array.from(r.querySelectorAll("[" + d + "]"));
    r.hasAttribute && r.hasAttribute(d) && t.push(r);
    for (const n of t)
      n[s] || new h(n);
  }
  function h(r) {
    this.dom = r, r[s] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10);
    const t = Array.from(r.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length > this.max; ) r.removeChild(t.shift());
    for (const n of t) c(n, this);
    return t.length > 0 && b(r), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[s]) {
      for (const r of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        l(r);
      _(this.dom), delete this.dom[s];
    }
  };
  function a(r, t) {
    const n = ((r.type || "") + "").trim().toLowerCase(), i = ft(t, y, "ln-toast");
    if (!i)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    rt(i, {
      type: n,
      title: r.title,
      message: typeof r.message == "string" ? r.message : void 0
    });
    const g = i.firstElementChild;
    if (!g) return null;
    g.hasAttribute("data-ln-toast-item") || g.setAttribute("data-ln-toast-item", ""), g.classList.add("ln-enter");
    const v = g.querySelector(".body");
    v && m(v, r);
    const A = g.querySelector("[data-ln-toast-close]");
    return A && A.addEventListener("click", function() {
      l(g);
    }), g;
  }
  function m(r, t) {
    if (Array.isArray(t.message)) {
      const n = document.createElement("ul");
      for (const i of t.message) {
        const g = document.createElement("li");
        g.textContent = i, n.appendChild(g);
      }
      r.appendChild(n);
    }
    if (t.data && t.data.errors) {
      const n = document.createElement("ul");
      for (const i of Object.values(t.data.errors).flat()) {
        const g = document.createElement("li");
        g.textContent = i, n.appendChild(g);
      }
      r.appendChild(n);
    }
  }
  function o(r, t) {
    const n = Array.from(r.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; n.length >= r.max && n.length > 0; ) r.dom.removeChild(n.shift());
    r.dom.appendChild(t), b(r.dom), requestAnimationFrame(() => t.classList.remove("ln-enter"));
  }
  function l(r) {
    if (!r || !r.parentNode) return;
    const t = r.parentNode;
    clearTimeout(r._timer), r.classList.remove("ln-enter"), r.classList.add("ln-out"), setTimeout(() => {
      r.parentNode && (r.parentNode.removeChild(r), _(t));
    }, 200);
  }
  function u(r) {
    let t = r && r.container;
    return typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), t || null;
  }
  function c(r, t) {
    if (r._lnToastHydrated) return;
    r._lnToastHydrated = !0;
    const n = r.querySelector("[data-ln-toast-close]");
    n && n.addEventListener("click", function() {
      l(r);
    });
    const i = r.getAttribute("data-ln-toast-timeout"), g = i !== null ? parseInt(i, 10) : NaN, v = Number.isFinite(g) ? g : t.timeoutDefault;
    v > 0 && (r._timer = setTimeout(function() {
      l(r);
    }, v));
  }
  function f(r) {
    const t = r.detail || {}, n = u(t);
    if (!n) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const i = n[s] || new h(n), g = a(t, n);
    if (!g) return;
    const v = Number.isFinite(t.timeout) ? t.timeout : i.timeoutDefault;
    o(i, g), v > 0 && (g._timer = setTimeout(() => l(g), v));
  }
  function e(r) {
    const t = r && r.detail || {};
    if (t.container) {
      const n = u(t);
      if (n)
        for (const i of Array.from(n.querySelectorAll("[data-ln-toast-item]"))) l(i);
    } else {
      const n = document.querySelectorAll("[" + d + "]");
      for (const i of Array.from(n))
        for (const g of Array.from(i.querySelectorAll("[data-ln-toast-item]"))) l(g);
    }
  }
  ct(function() {
    window.addEventListener("ln-toast:enqueue", f), window.addEventListener("ln-toast:clear", e), window.addEventListener("ln-modal:open", function() {
      const t = document.querySelectorAll("[" + d + "]");
      for (const n of Array.from(t))
        n.querySelectorAll("[data-ln-toast-item]").length > 0 && b(n);
    }), new MutationObserver(function(t) {
      for (const n of t) {
        if (n.type === "attributes") {
          p(n.target);
          continue;
        }
        for (const i of n.addedNodes)
          p(i);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] }), p(document.body);
  }, "ln-toast");
})();
(function() {
  const d = "data-ln-upload", s = "lnUpload", y = "data-ln-upload-dict", b = "data-ln-upload-accept", _ = "data-ln-upload-context", p = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-icon-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function h() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const e = document.createElement("div");
    e.innerHTML = p;
    const r = e.firstElementChild;
    r && document.body.appendChild(r);
  }
  if (window[s] !== void 0) return;
  function a(e) {
    if (e === 0) return "0 B";
    const r = 1024, t = ["B", "KB", "MB", "GB"], n = Math.floor(Math.log(e) / Math.log(r));
    return parseFloat((e / Math.pow(r, n)).toFixed(1)) + " " + t[n];
  }
  function m(e) {
    return e.split(".").pop().toLowerCase();
  }
  function o(e) {
    return e === "docx" && (e = "doc"), ["pdf", "doc", "epub"].includes(e) ? "ln-icon-custom-file-" + e : "ln-icon-file";
  }
  function l(e, r) {
    if (!r) return !0;
    const t = "." + m(e.name);
    return r.split(",").map(function(i) {
      return i.trim().toLowerCase();
    }).includes(t.toLowerCase());
  }
  function u(e) {
    if (e.lnUploadAPI) return;
    h();
    const r = Wt(e, y), t = e.querySelector(".ln-upload__zone"), n = e.querySelector(".ln-upload__list"), i = e.getAttribute(b) || "";
    if (!t || !n) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", e);
      return;
    }
    let g = e.querySelector('input[type="file"]');
    g || (g = document.createElement("input"), g.type = "file", g.multiple = !0, g.classList.add("hidden"), i && (g.accept = i.split(",").map(function(F) {
      return F = F.trim(), F.startsWith(".") ? F : "." + F;
    }).join(",")), e.appendChild(g));
    const v = e.getAttribute(d) || "/files/upload", A = e.getAttribute(_) || "", E = e.getAttribute("data-ln-upload-delete") || (v.includes("/upload") ? v.replace(/\/upload\/?$/, "/{id}") : v + "/{id}"), w = /* @__PURE__ */ new Map();
    let L = 0;
    function q() {
      const F = document.querySelector('meta[name="csrf-token"]');
      return F ? F.getAttribute("content") : "";
    }
    function x(F) {
      if (!l(F, i)) {
        const R = r["invalid-type"];
        S(e, "ln-upload:invalid", {
          file: F,
          message: R
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: r["invalid-title"] || "Invalid File",
          message: R || r["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const V = "file-" + ++L, Y = m(F.name), wt = o(Y), at = ft(e, "ln-upload-item", "ln-upload");
      if (!at) return;
      const it = at.firstElementChild;
      if (!it) return;
      it.setAttribute("data-file-id", V), rt(it, {
        name: F.name,
        sizeText: "0%",
        iconHref: "#" + wt,
        removeLabel: r.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const Et = it.querySelector(".ln-upload__progress-bar"), ot = it.querySelector('[data-ln-upload-action="remove"]');
      ot && (ot.disabled = !0), n.appendChild(it);
      const mt = new FormData();
      mt.append("file", F);
      const C = /* @__PURE__ */ new Set();
      e.querySelectorAll("input, select, textarea").forEach(function(R) {
        if (R.name && R.name !== "file_ids[]" && R.type !== "file") {
          if ((R.type === "checkbox" || R.type === "radio") && !R.checked)
            return;
          mt.append(R.name, R.value), C.add(R.name);
        }
      }), !C.has("context") && A && mt.append("context", A);
      const T = new XMLHttpRequest();
      T.upload.addEventListener("progress", function(R) {
        if (R.lengthComputable) {
          const O = Math.round(R.loaded / R.total * 100);
          Et.style.width = O + "%", rt(it, { sizeText: O + "%" });
        }
      }), T.addEventListener("load", function() {
        if (T.status >= 200 && T.status < 300) {
          let R;
          try {
            R = JSON.parse(T.responseText);
          } catch {
            I("Invalid response");
            return;
          }
          rt(it, { sizeText: a(R.size || F.size), uploading: !1 }), ot && (ot.disabled = !1), w.set(V, {
            serverId: R.id,
            name: R.name,
            size: R.size
          }), D(), S(e, "ln-upload:uploaded", {
            localId: V,
            serverId: R.id,
            name: R.name
          });
        } else {
          let R = r["upload-failed"] || "Upload failed";
          try {
            R = JSON.parse(T.responseText).message || R;
          } catch {
          }
          I(R);
        }
      }), T.addEventListener("error", function() {
        I(r["network-error"] || "Network error");
      });
      function I(R) {
        Et && (Et.style.width = "100%"), rt(it, { sizeText: r.error || "Error", uploading: !1, error: !0 }), ot && (ot.disabled = !1), S(e, "ln-upload:error", {
          file: F,
          message: R
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: r["error-title"] || "Upload Error",
          message: R || r["upload-failed"] || "Failed to upload file"
        });
      }
      T.open("POST", v), T.setRequestHeader("X-CSRF-TOKEN", q()), T.setRequestHeader("Accept", "application/json"), T.send(mt);
    }
    function D() {
      for (const F of e.querySelectorAll('input[name="file_ids[]"]'))
        F.remove();
      for (const [, F] of w) {
        const V = document.createElement("input");
        V.type = "hidden", V.name = "file_ids[]", V.value = F.serverId, e.appendChild(V);
      }
    }
    function k(F) {
      const V = w.get(F), Y = n.querySelector('[data-file-id="' + F + '"]');
      if (!V || !V.serverId) {
        Y && Y.remove(), w.delete(F), D();
        return;
      }
      Y && rt(Y, { deleting: !0 });
      const wt = E.replace("{id}", V.serverId);
      fetch(wt, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": q(),
          Accept: "application/json"
        }
      }).then(function(at) {
        at.status === 200 ? (Y && Y.remove(), w.delete(F), D(), S(e, "ln-upload:removed", {
          localId: F,
          serverId: V.serverId
        })) : (Y && rt(Y, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: r["delete-title"] || "Error",
          message: r["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(at) {
        console.warn("[ln-upload] Delete error:", at), Y && rt(Y, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: r["network-error"] || "Network error",
          message: r["connection-error"] || "Could not connect to server"
        });
      });
    }
    function M(F) {
      for (const V of F)
        x(V);
      g.value = "";
    }
    const N = function() {
      g.click();
    }, B = function() {
      M(this.files);
    }, H = function(F) {
      F.preventDefault(), F.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, j = function(F) {
      F.preventDefault(), F.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, z = function(F) {
      F.preventDefault(), F.stopPropagation(), t.classList.remove("ln-upload__zone--dragover");
    }, Z = function(F) {
      F.preventDefault(), F.stopPropagation(), t.classList.remove("ln-upload__zone--dragover"), M(F.dataTransfer.files);
    }, vt = function(F) {
      const V = F.target.closest('[data-ln-upload-action="remove"]');
      if (!V || !n.contains(V) || V.disabled) return;
      const Y = V.closest(".ln-upload__item");
      Y && k(Y.getAttribute("data-file-id"));
    };
    t.addEventListener("click", N), g.addEventListener("change", B), t.addEventListener("dragenter", H), t.addEventListener("dragover", j), t.addEventListener("dragleave", z), t.addEventListener("drop", Z), n.addEventListener("click", vt), e.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(w.values()).map(function(F) {
          return F.serverId;
        });
      },
      getFiles: function() {
        return Array.from(w.values());
      },
      clear: function() {
        for (const [, F] of w)
          if (F.serverId) {
            const V = E.replace("{id}", F.serverId);
            fetch(V, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": q(),
                Accept: "application/json"
              }
            });
          }
        w.clear(), n.innerHTML = "", D(), S(e, "ln-upload:cleared", {});
      },
      destroy: function() {
        t.removeEventListener("click", N), g.removeEventListener("change", B), t.removeEventListener("dragenter", H), t.removeEventListener("dragover", j), t.removeEventListener("dragleave", z), t.removeEventListener("drop", Z), n.removeEventListener("click", vt), w.clear(), n.innerHTML = "", D(), delete e.lnUploadAPI;
      }
    };
  }
  function c() {
    for (const e of document.querySelectorAll("[" + d + "]"))
      u(e);
  }
  function f() {
    ct(function() {
      new MutationObserver(function(r) {
        for (const t of r)
          if (t.type === "childList") {
            for (const n of t.addedNodes)
              if (n.nodeType === 1) {
                n.hasAttribute(d) && u(n);
                for (const i of n.querySelectorAll("[" + d + "]"))
                  u(i);
              }
          } else t.type === "attributes" && t.target.hasAttribute(d) && u(t.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-upload");
  }
  window[s] = {
    init: u,
    initAll: c
  }, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const d = "lnExternalLinks";
  if (window[d] !== void 0) return;
  function s(a) {
    return a.hostname && a.hostname !== window.location.hostname;
  }
  function y(a) {
    if (a.getAttribute("data-ln-external-link") === "processed" || !s(a)) return;
    a.target = "_blank";
    const m = (a.rel || "").split(/\s+/).filter(Boolean);
    m.includes("noopener") || m.push("noopener"), m.includes("noreferrer") || m.push("noreferrer"), a.rel = m.join(" ");
    const o = document.createElement("span");
    o.className = "sr-only", o.textContent = "(opens in new tab)", a.appendChild(o), a.setAttribute("data-ln-external-link", "processed"), S(a, "ln-external-links:processed", {
      link: a,
      href: a.href
    });
  }
  function b(a) {
    a = a || document.body;
    for (const m of a.querySelectorAll("a, area"))
      y(m);
  }
  function _() {
    ct(function() {
      document.body.addEventListener("click", function(a) {
        const m = a.target.closest("a, area");
        m && m.getAttribute("data-ln-external-link") === "processed" && S(m, "ln-external-links:clicked", {
          link: m,
          href: m.href,
          text: m.textContent || m.title || ""
        });
      });
    }, "ln-external-links");
  }
  function p() {
    ct(function() {
      new MutationObserver(function(m) {
        for (const o of m) {
          if (o.type === "childList") {
            for (const l of o.addedNodes)
              if (l.nodeType === 1 && (l.matches && (l.matches("a") || l.matches("area")) && y(l), l.querySelectorAll))
                for (const u of l.querySelectorAll("a, area"))
                  y(u);
          }
          if (o.type === "attributes" && o.attributeName === "href") {
            const l = o.target;
            l.matches && (l.matches("a") || l.matches("area")) && y(l);
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
    _(), p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      b();
    }) : b();
  }
  window[d] = {
    process: b
  }, h();
})();
(function() {
  const d = "data-ln-link", s = "lnLink";
  if (window[s] !== void 0) return;
  let y = null;
  function b() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function _(n) {
    y && (y.textContent = n, y.classList.add("ln-link-status--visible"));
  }
  function p() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function h(n, i) {
    if (i.target.closest("a, button, input, select, textarea")) return;
    const g = n.querySelector("a");
    if (!g) return;
    const v = g.getAttribute("href");
    if (!v) return;
    if (i.ctrlKey || i.metaKey || i.button === 1) {
      window.open(v, "_blank");
      return;
    }
    $(n, "ln-link:navigate", { target: n, href: v, link: g }).defaultPrevented || g.click();
  }
  function a(n) {
    const i = n.querySelector("a");
    if (!i) return;
    const g = i.getAttribute("href");
    g && _(g);
  }
  function m() {
    p();
  }
  function o(n) {
    n[s + "Row"] || !n.querySelector("a") || (n[s + "Row"] = !0, n._lnLinkClick = function(g) {
      h(n, g);
    }, n._lnLinkEnter = function() {
      a(n);
    }, n.addEventListener("click", n._lnLinkClick), n.addEventListener("mouseenter", n._lnLinkEnter), n.addEventListener("mouseleave", m));
  }
  function l(n) {
    n[s + "Row"] && (n._lnLinkClick && n.removeEventListener("click", n._lnLinkClick), n._lnLinkEnter && n.removeEventListener("mouseenter", n._lnLinkEnter), n.removeEventListener("mouseleave", m), delete n._lnLinkClick, delete n._lnLinkEnter, delete n[s + "Row"]);
  }
  function u(n) {
    if (!n[s + "Init"]) return;
    const i = n.tagName;
    if (i === "TABLE" || i === "TBODY") {
      const g = i === "TABLE" && n.querySelector("tbody") || n;
      for (const v of g.querySelectorAll("tr"))
        l(v);
    } else
      l(n);
    delete n[s + "Init"];
  }
  function c(n) {
    if (n[s + "Init"]) return;
    n[s + "Init"] = !0;
    const i = n.tagName;
    if (i === "TABLE" || i === "TBODY") {
      const g = i === "TABLE" && n.querySelector("tbody") || n;
      for (const v of g.querySelectorAll("tr"))
        o(v);
    } else
      o(n);
  }
  function f(n) {
    n.hasAttribute && n.hasAttribute(d) && c(n);
    const i = n.querySelectorAll ? n.querySelectorAll("[" + d + "]") : [];
    for (const g of i)
      c(g);
  }
  function e() {
    ct(function() {
      new MutationObserver(function(i) {
        for (const g of i)
          if (g.type === "childList") {
            for (const v of g.addedNodes)
              if (v.nodeType === 1) {
                f(v);
                const A = v.closest("[" + d + "]");
                if (A)
                  if (v.tagName === "TR")
                    o(v);
                  else {
                    const E = A.tagName;
                    if (E === "TABLE" || E === "TBODY") {
                      const w = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const L of w)
                        o(L);
                    }
                  }
              }
          } else g.type === "attributes" && (g.target.hasAttribute && g.target.hasAttribute(d) ? f(g.target) : u(g.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-link");
  }
  function r(n) {
    f(n);
  }
  window[s] = { init: r, destroy: u };
  function t() {
    b(), e(), r(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const d = "[data-ln-progress]", s = "lnProgress";
  if (window[s] !== void 0) return;
  function y(h) {
    return this.dom = h, this._attrObserver = null, this._parentObserver = null, p.call(this), b.call(this), _.call(this), this;
  }
  y.prototype.destroy = function() {
    this.dom[s] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[s]);
  };
  function b() {
    const h = this, a = new MutationObserver(function(m) {
      for (const o of m)
        (o.attributeName === "data-ln-progress" || o.attributeName === "data-ln-progress-max") && p.call(h);
    });
    a.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = a;
  }
  function _() {
    const h = this, a = this.dom.parentElement;
    if (!a) return;
    const m = new MutationObserver(function(o) {
      for (const l of o)
        l.attributeName === "data-ln-progress-max" && p.call(h);
    });
    m.observe(a, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = m;
  }
  function p() {
    const h = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, a = this.dom.parentElement, o = (a && a.hasAttribute("data-ln-progress-max") ? parseFloat(a.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let l = o > 0 ? h / o * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100), this.dom.style.width = l + "%";
    const u = Math.max(0, Math.min(h, o));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(o)), this.dom.setAttribute("aria-valuenow", String(u)), S(this.dom, "ln-progress:change", { target: this.dom, value: h, max: o, percentage: l });
  }
  U(
    d,
    s,
    y,
    "ln-progress"
  );
})();
(function() {
  const d = "data-ln-filter", s = "lnFilter", y = "data-ln-filter-key", b = "data-ln-filter-value", _ = "data-ln-filter-hide", p = "data-ln-filter-reset", h = "data-ln-filter-col", a = /* @__PURE__ */ new WeakMap();
  if (window[s] !== void 0) return;
  function m(f) {
    return f.hasAttribute(p) || f.getAttribute(b) === "";
  }
  function o(f) {
    let e = f._filterKey;
    const r = [];
    for (let t = 0; t < f.inputs.length; t++) {
      const n = f.inputs[t];
      if (n.checked && !m(n)) {
        const i = n.getAttribute(b);
        i && r.push(i);
      }
    }
    return { key: e, values: r };
  }
  function l(f, e) {
    if (f.length !== e.length) return !0;
    for (let r = 0; r < f.length; r++) if (f[r] !== e[r]) return !0;
    return !1;
  }
  function u(f) {
    const e = f.dom, r = f.colIndex, t = e.querySelector("template");
    if (!t || r === null) return;
    const n = document.getElementById(f.targetId);
    if (!n) return;
    const i = n.tagName === "TABLE" ? n : n.querySelector("table");
    if (!i || n.hasAttribute("data-ln-table")) return;
    const g = {}, v = [], A = i.tBodies;
    for (let L = 0; L < A.length; L++) {
      const q = A[L].rows;
      for (let x = 0; x < q.length; x++) {
        const D = q[x].cells[r], k = D ? D.textContent.trim() : "";
        k && !g[k] && (g[k] = !0, v.push(k));
      }
    }
    v.sort(function(L, q) {
      return L.localeCompare(q);
    });
    const E = e.querySelector("[" + y + "]"), w = E ? E.getAttribute(y) : e.getAttribute("data-ln-filter-key") || "col" + r;
    for (let L = 0; L < v.length; L++) {
      const q = t.content.cloneNode(!0), x = q.querySelector("input");
      x && (x.setAttribute(y, w), x.setAttribute(b, v[L]), Lt(q, { text: v[L] }), e.appendChild(q));
    }
  }
  function c(f) {
    this.dom = f, this.targetId = f.getAttribute(d);
    const e = f.getAttribute(h);
    this.colIndex = e !== null ? parseInt(e, 10) : null, u(this), this.inputs = Array.from(f.querySelectorAll("[" + y + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(y) : null, this._lastSnapshot = null;
    const r = this, t = Qt(
      function() {
        r._render();
      },
      function() {
        r._afterRender();
      }
    );
    this._queueRender = t, this._attachHandlers();
    let n = !1;
    if (f.hasAttribute("data-ln-persist")) {
      const i = Mt("filter", f);
      if (i && i.key && Array.isArray(i.values) && i.values.length > 0) {
        for (let g = 0; g < this.inputs.length; g++) {
          const v = this.inputs[g];
          m(v) ? v.checked = !1 : v.getAttribute(y) === i.key && i.values.indexOf(v.getAttribute(b)) !== -1 ? v.checked = !0 : v.checked = !1;
        }
        t(), n = !0;
      }
    }
    if (!n) {
      for (let i = 0; i < this.inputs.length; i++)
        if (this.inputs[i].checked && !m(this.inputs[i])) {
          t();
          break;
        }
    }
    return this;
  }
  c.prototype._attachHandlers = function() {
    const f = this;
    this.inputs.forEach(function(e) {
      e[s + "Bound"] || (e[s + "Bound"] = !0, e._lnFilterChange = function() {
        if (m(e)) {
          for (let r = 0; r < f.inputs.length; r++)
            m(f.inputs[r]) || (f.inputs[r].checked = !1);
          e.checked = !0, f._queueRender();
          return;
        }
        if (e.checked) {
          for (let t = 0; t < f.inputs.length; t++)
            m(f.inputs[t]) && (f.inputs[t].checked = !1);
          let r = !1;
          for (let t = 0; t < f.inputs.length; t++)
            if (m(f.inputs[t])) {
              r = !0;
              break;
            }
          if (r) {
            let t = !0;
            for (let n = 0; n < f.inputs.length; n++)
              if (!m(f.inputs[n]) && !f.inputs[n].checked) {
                t = !1;
                break;
              }
            if (t)
              for (let n = 0; n < f.inputs.length; n++)
                m(f.inputs[n]) ? f.inputs[n].checked = !0 : f.inputs[n].checked = !1;
          }
        } else {
          let r = !1;
          for (let t = 0; t < f.inputs.length; t++)
            if (!m(f.inputs[t]) && f.inputs[t].checked) {
              r = !0;
              break;
            }
          if (!r)
            for (let t = 0; t < f.inputs.length; t++)
              m(f.inputs[t]) && (f.inputs[t].checked = !0);
        }
        f._queueRender();
      }, e.addEventListener("change", e._lnFilterChange));
    });
  }, c.prototype._render = function() {
    const f = this, e = o(this), r = e.key === null || e.values.length === 0, t = [];
    for (let n = 0; n < e.values.length; n++)
      t.push(e.values[n].toLowerCase());
    if (f.colIndex !== null)
      f._filterTableRows(e);
    else {
      const n = document.getElementById(f.targetId);
      if (!n) return;
      const i = n.children;
      for (let g = 0; g < i.length; g++) {
        const v = i[g];
        if (r) {
          v.removeAttribute(_);
          continue;
        }
        const A = v.getAttribute("data-" + e.key);
        v.removeAttribute(_), A !== null && t.indexOf(A.toLowerCase()) === -1 && v.setAttribute(_, "true");
      }
    }
  }, c.prototype._afterRender = function() {
    const f = o(this), e = this._lastSnapshot;
    if (!e || e.key !== f.key || l(e.values, f.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: f.key,
        values: f.values.slice()
      });
      const t = e && e.values.length > 0, n = f.values.length === 0;
      t && n && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: f.key, values: f.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (f.key && f.values.length > 0 ? pt("filter", this.dom, { key: f.key, values: f.values.slice() }) : pt("filter", this.dom, null));
  }, c.prototype._dispatchOnBoth = function(f, e) {
    S(this.dom, f, e);
    const r = document.getElementById(this.targetId);
    r && r !== this.dom && S(r, f, e);
  }, c.prototype._filterTableRows = function(f) {
    const e = document.getElementById(this.targetId);
    if (!e) return;
    const r = e.tagName === "TABLE" ? e : e.querySelector("table");
    if (!r || e.hasAttribute("data-ln-table")) return;
    const t = f.key || this._filterKey, n = f.values;
    a.has(r) || a.set(r, {});
    const i = a.get(r);
    if (t && n.length > 0) {
      const E = [];
      for (let w = 0; w < n.length; w++)
        E.push(n[w].toLowerCase());
      i[t] = { col: this.colIndex, values: E };
    } else t && delete i[t];
    const g = Object.keys(i), v = g.length > 0, A = r.tBodies;
    for (let E = 0; E < A.length; E++) {
      const w = A[E].rows;
      for (let L = 0; L < w.length; L++) {
        const q = w[L];
        if (!v) {
          q.removeAttribute(_);
          continue;
        }
        let x = !0;
        for (let D = 0; D < g.length; D++) {
          const k = i[g[D]], M = q.cells[k.col], N = M ? M.textContent.trim().toLowerCase() : "";
          if (k.values.indexOf(N) === -1) {
            x = !1;
            break;
          }
        }
        x ? q.removeAttribute(_) : q.setAttribute(_, "true");
      }
    }
  }, c.prototype.destroy = function() {
    if (this.dom[s]) {
      if (this.colIndex !== null) {
        const f = document.getElementById(this.targetId);
        if (f) {
          const e = f.tagName === "TABLE" ? f : f.querySelector("table");
          if (e && a.has(e)) {
            const r = a.get(e), t = this._filterKey;
            t && r[t] && delete r[t], Object.keys(r).length === 0 && a.delete(e);
          }
        }
      }
      this.inputs.forEach(function(f) {
        f._lnFilterChange && (f.removeEventListener("change", f._lnFilterChange), delete f._lnFilterChange), delete f[s + "Bound"];
      }), delete this.dom[s];
    }
  }, U(d, s, c, "ln-filter");
})();
(function() {
  const d = "data-ln-search", s = "lnSearch", y = "data-ln-search-hide";
  if (window[s] !== void 0) return;
  function _(p) {
    this.dom = p, this.targetId = p.getAttribute(d);
    const h = p.tagName;
    this.input = h === "INPUT" || h === "TEXTAREA" ? p : p.querySelector('[name="search"]') || p.querySelector('input[type="search"]') || p.querySelector('input[type="text"]'), this.itemsSelector = p.getAttribute("data-ln-search-items") || null;
    const a = p.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = a !== null ? parseInt(a, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const m = this;
      queueMicrotask(function() {
        m._search(m.input.value.trim().toLowerCase());
      });
    }
    return this;
  }
  _.prototype._attachHandler = function() {
    if (!this.input) return;
    const p = this, h = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = h ? h.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      p.input.value = "", p._search(""), p.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(p._debounceTimer), p._debounceTimer = setTimeout(function() {
        p._search(p.input.value.trim().toLowerCase());
      }, p.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, _.prototype._search = function(p) {
    const h = document.getElementById(this.targetId);
    if (!h || $(h, "ln-search:change", { term: p, targetId: this.targetId }).defaultPrevented) return;
    const m = this.itemsSelector ? h.querySelectorAll(this.itemsSelector) : h.children;
    for (let o = 0; o < m.length; o++) {
      const l = m[o];
      l.removeAttribute(y), p && !l.textContent.replace(/\s+/g, " ").toLowerCase().includes(p) && l.setAttribute(y, "true");
    }
  }, _.prototype.destroy = function() {
    this.dom[s] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), delete this.dom[s]);
  }, U(d, s, _, "ln-search");
})();
(function() {
  const d = "data-ln-sort", s = "lnSort", y = "data-ln-sort-field", b = "data-ln-sort-state", _ = "data-ln-sort-dir", p = "data-ln-sort-items";
  if (window[s] !== void 0) return;
  function h(o, l) {
    if (l) {
      const u = o.querySelector('[data-ln-field="' + l + '"]');
      if (u) return xt(u);
    }
    return xt(o);
  }
  function a(o) {
    this.dom = o, this.targetId = o.getAttribute(d), this.field = o.getAttribute(y) || null;
    const l = o.closest("th");
    this.column = !this.field && l ? l.cellIndex : null, this.itemsSelector = o.getAttribute(p) || null, this._initialOrder = null;
    const u = document.getElementById(this.targetId);
    u && (this._initialOrder = this.itemsSelector ? Array.from(u.querySelectorAll(this.itemsSelector)) : Array.from(u.children)), this._target = u;
    const c = this;
    if (this._onClick = function(f) {
      const e = f.target.closest("[" + _ + "]");
      e && c._apply(e.getAttribute(_));
    }, o.addEventListener("click", this._onClick), this._onTargetChange = function(f) {
      (c.field ? f.detail.field === c.field : f.detail.column === c.column) || (o.setAttribute(b, "none"), o.hasAttribute("data-ln-persist") && pt("sort", o, null));
    }, u && u.addEventListener("ln-sort:change", this._onTargetChange), o.hasAttribute("data-ln-persist")) {
      const f = Mt("sort", o);
      f && f.direction && queueMicrotask(function() {
        c._apply(f.direction, !0);
      });
    }
    return this;
  }
  a.prototype._apply = function(o, l) {
    this.dom.setAttribute(b, o);
    const u = this._target || document.getElementById(this.targetId);
    if (!u) return;
    const c = {
      field: this.field,
      column: this.column,
      direction: o,
      targetId: this.targetId
    };
    !l && this.dom.hasAttribute("data-ln-persist") && pt("sort", this.dom, o === "none" ? null : c), !$(u, "ln-sort:change", c).defaultPrevented && this._defaultSort(u, o);
  }, a.prototype._defaultSort = function(o, l) {
    const u = this.itemsSelector ? Array.from(o.querySelectorAll(this.itemsSelector)) : Array.from(o.children);
    if (!u.length) return;
    const c = u[0].parentNode;
    let f;
    if (l === "none")
      f = (this._initialOrder || u).filter(function(r) {
        return r.parentNode === c;
      });
    else {
      const r = this.field, t = u.map(function(v) {
        return h(v, r);
      }), n = Dt(t), i = typeof Intl < "u" ? new Intl.Collator(G(this.dom), { sensitivity: "base" }) : null, g = l === "desc" ? -1 : 1;
      f = u.slice().sort(function(v, A) {
        return It(h(v, r), h(A, r), n, i) * g;
      });
    }
    const e = document.createDocumentFragment();
    for (let r = 0; r < f.length; r++) e.appendChild(f[r]);
    c.appendChild(e);
  }, a.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("click", this._onClick), this._target && this._target.removeEventListener("ln-sort:change", this._onTargetChange), delete this.dom[s]);
  };
  function m(o, l) {
    const u = o[s];
    if (u)
      if (l === y) {
        u.field = o.getAttribute(y) || null;
        const c = o.closest("th");
        u.column = !u.field && c ? c.cellIndex : null;
      } else l === p && (u.itemsSelector = o.getAttribute(p) || null);
  }
  U(d, s, a, "ln-sort", {
    extraAttributes: [y, p],
    onAttributeChange: m
  });
})();
(function() {
  const d = "data-ln-table", s = "lnTable", y = "data-ln-table-empty";
  if (window[s] !== void 0) return;
  const m = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function o(e, r) {
    if (e == null || isNaN(e)) return "";
    try {
      return new Intl.NumberFormat(G(r)).format(e);
    } catch {
      return String(e);
    }
  }
  function l(e) {
    let r = e.parentElement;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const n = getComputedStyle(r).overflowY;
      if (n === "auto" || n === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function u(e) {
    const r = e._scrollContainer || l(e.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function c(e) {
    e.container ? e.container.scrollTop = e.top : window.scrollTo(window.scrollX, e.top);
  }
  function f(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("[data-ln-table-body]") || e.querySelector("tbody"), this.thead = e.querySelector("thead");
    const r = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = r ? Array.from(r.querySelectorAll("th")) : [], this._totalSpan = e.querySelector("[data-ln-table-total]"), this._filteredSpan = e.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== e ? this._filteredSpan.parentElement : null), this._selectedSpan = e.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== e ? this._selectedSpan.parentElement : null), this.isDataDriven = e.hasAttribute("data-ln-table-source"), this.name = e.getAttribute(d) || "", this.source = e.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const t = this;
    return this._onSetSearch = function(n) {
      const i = (n.detail && n.detail.query != null ? n.detail.query : n.detail && n.detail.term != null ? n.detail.term : "").trim();
      t.isDataDriven ? (t.currentSearch = i, S(e, "ln-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData()) : (t._searchTerm = i.toLowerCase(), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), S(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, e.addEventListener("ln-table:set-search", this._onSetSearch), this._onSetFilter = function(n) {
      if (!n.detail) return;
      const i = n.detail.key, g = n.detail.values;
      if (t.isDataDriven)
        !g || g.length === 0 ? delete t.currentFilters[i] : t.currentFilters[i] = g, t._requestData();
      else {
        if (!g || g.length === 0)
          delete t._columnFilters[i];
        else {
          const v = [];
          for (let A = 0; A < g.length; A++)
            v.push(g[A].toLowerCase());
          t._columnFilters[i] = v;
        }
        t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), S(e, "ln-table:filter", {
          term: t._searchTerm,
          matched: t._filteredData.length,
          total: t._data.length
        });
      }
    }, e.addEventListener("ln-table:set-filter", this._onSetFilter), this._onRequestClearFilters = function() {
      t.isDataDriven ? (t.currentFilters = {}, t.currentSearch = "", S(e, "ln-table:clear-filters", { table: t.name }), t._requestData()) : (t._searchTerm = "", t._columnFilters = {}, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), S(e, "ln-table:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, e.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = e.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && e.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(n) {
      const i = n.detail || {};
      if (t._windowed) {
        e.classList.remove("ln-table--loading"), t._cache.ingest(i);
        return;
      }
      t._data = i.data || [], t._lastTotal = i.total != null ? i.total : t._data.length, t._lastFiltered = i.filtered != null ? i.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, e.classList.remove("ln-table--loading"), t._vStart = -1, t._vEnd = -1, t._applyFilterAndSort(), t._render(), t._updateFooter(), S(e, "ln-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, e.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(n) {
      const i = n.detail && n.detail.loading;
      e.classList.toggle("ln-table--loading", !!i), i && (t.isLoaded = !1);
    }, e.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(n) {
      !t._windowed || !t._cache || t._cache.release(n.detail && n.detail.offset);
    }, e.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !t._windowed || !t._cache || t._cache.revalidate();
    }, e.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onSort = function(n) {
      n.preventDefault(), t.currentSort = n.detail.direction === "none" ? null : { field: n.detail.field, direction: n.detail.direction }, t._requestData();
    }, e.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(n) {
      if (n.target.closest("[data-ln-table-row-select]") || n.target.closest("[data-ln-table-row-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const i = n.target.closest("[data-ln-table-row]");
      if (!i) return;
      const g = i.getAttribute("data-ln-table-row-id"), v = i._lnRecord || {};
      S(e, "ln-table:row-click", {
        table: t.name,
        id: g,
        record: v
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(n) {
      const i = n.target.closest("[data-ln-table-row-action]");
      if (!i) return;
      n.stopPropagation();
      const g = i.closest("[data-ln-table-row]");
      if (!g) return;
      const v = i.getAttribute("data-ln-table-row-action"), A = g.getAttribute("data-ln-table-row-id"), E = g._lnRecord || {};
      S(e, "ln-table:row-action", {
        table: t.name,
        id: A,
        action: v,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(n) {
      if (!e.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      const i = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-table-row]")) : [];
      if (i.length)
        switch (n.key) {
          case "ArrowDown":
            n.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, i.length - 1), t._focusRow(i);
            break;
          case "ArrowUp":
            n.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(i);
            break;
          case "Home":
            n.preventDefault(), t._focusedRowIndex = 0, t._focusRow(i);
            break;
          case "End":
            n.preventDefault(), t._focusedRowIndex = i.length - 1, t._focusRow(i);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < i.length) {
              n.preventDefault();
              const g = i[t._focusedRowIndex];
              S(e, "ln-table:row-click", {
                table: t.name,
                id: g.getAttribute("data-ln-table-row-id"),
                record: g._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < i.length) {
              n.preventDefault();
              const g = i[t._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              g && (g.checked = !g.checked, g.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : S(e, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(n) {
      n.preventDefault();
      const i = n.detail.direction === "none" ? null : n.detail.direction;
      t._sortCol = i === null ? -1 : n.detail.column, t._sortDir = i, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), S(e, "ln-table:sorted", {
        column: n.detail.column,
        direction: n.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-sort:change", this._onSort)), this;
  }
  f.prototype._parseRows = function() {
    const e = this.tbody.rows, r = this.ths;
    this._data = [], e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < e.length; t++) {
      const n = e[t], i = [], g = [], v = [];
      for (let E = 0; E < n.cells.length; E++) {
        const w = n.cells[E], L = w.textContent.trim();
        i[E] = xt(w), g[E] = L.toLowerCase(), E < n.cells.length - 1 && v.push(L.toLowerCase());
      }
      let A = null;
      if (this.isDataDriven) {
        A = {};
        const E = n.getAttribute("data-ln-table-row-id");
        E != null && (A.id = E);
        for (let w = 0; w < r.length; w++) {
          const L = r[w].getAttribute("data-ln-table-col");
          if (L) {
            const q = w;
            if (q < n.cells.length) {
              const x = n.cells[q];
              A[L] = xt(x);
            }
          }
        }
      }
      this._data.push({
        values: i,
        rawTexts: g,
        html: n.outerHTML,
        searchText: v.join(" "),
        id: this.isDataDriven && A ? A.id : void 0,
        ...A
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, f.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const e = (this.currentSearch || "").trim().toLowerCase(), r = this.currentFilters || {}, t = Object.keys(r).length > 0;
      if (this._filteredData = this._data.filter(function(E) {
        if (e) {
          let w = !1;
          for (const L in E)
            if (E.hasOwnProperty(L) && typeof E[L] == "string" && L !== "html" && L !== "searchText" && E[L].toLowerCase().indexOf(e) !== -1) {
              w = !0;
              break;
            }
          if (!w) return !1;
        }
        if (t)
          for (const w in r) {
            const L = r[w];
            if (L && L.length > 0) {
              const q = E[w], x = q != null ? String(q) : "";
              if (L.indexOf(x) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, g = this.currentSort.direction === "desc" ? -1 : 1, v = this._filteredData.map(function(E) {
        return E[n];
      }), A = Dt(v);
      this._filteredData.sort(function(E, w) {
        return It(E[n], w[n], A, m) * g;
      });
    } else {
      const e = this._searchTerm, r = this._columnFilters, t = Object.keys(r).length > 0, n = this.ths, i = {};
      if (t)
        for (let w = 0; w < n.length; w++) {
          const L = n[w].getAttribute("data-ln-table-filter-col");
          L && (i[L] = w);
        }
      if (!e && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(w) {
        if (e && w.searchText.indexOf(e) === -1) return !1;
        if (t)
          for (const L in r) {
            const q = i[L];
            if (q !== void 0 && r[L].indexOf(w.rawTexts[q]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, v = this._sortDir === "desc" ? -1 : 1, A = this._filteredData.map(function(w) {
        return w.values[g];
      }), E = Dt(A);
      this._filteredData.sort(function(w, L) {
        return It(w.values[g], L.values[g], E, m) * v;
      });
    }
  }, f.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const e = document.createElement("colgroup");
    this.ths.forEach(function(r) {
      const t = document.createElement("col");
      t.style.width = r.offsetWidth + "px", e.appendChild(t);
    }), this.table.insertBefore(e, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = e;
  }, f.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const e = this._lastTotal, r = this.visibleCount;
        if (e === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const e = this._filteredData.length;
        e === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, f.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const e = this._filteredData, r = document.createDocumentFragment();
      for (let n = 0; n < e.length; n++) {
        const i = this._buildRow(e[n]);
        if (!i) break;
        r.appendChild(i);
      }
      const t = u(this);
      this.tbody.textContent = "", this.tbody.appendChild(r), c(t), this._selectable && this._updateSelectAll();
    } else {
      const e = [], r = this._filteredData;
      for (let n = 0; n < r.length; n++) e.push(r[n].html);
      const t = u(this);
      this.tbody.innerHTML = e.join(""), c(t), this._selectable && this._restoreSelection();
    }
  }, f.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const e = this;
    if (!this._rowHeight)
      if (this._windowed) {
        let t = null;
        const n = this._cache.peek();
        n ? t = this._buildRow(n) : t = this._buildPlaceholderRow(), t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
      } else if (this.isDataDriven) {
        if (this._data.length > 0) {
          const t = this._buildRow(this._data[0]);
          t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const t = this.tbody ? this.tbody.rows : [];
        t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = l(this.dom) : this._scrollContainer = null;
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._windowed ? e._renderWindowed() : e._renderVirtual();
      }));
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, f.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, f.prototype._renderVirtual = function() {
    const e = this._filteredData, r = e.length, t = this._rowHeight;
    if (!t || !r) return;
    const n = this.thead ? this.thead.offsetHeight : 0, i = this._scrollContainer;
    let g, v;
    if (i) {
      const x = this.table.getBoundingClientRect(), D = i.getBoundingClientRect(), k = x.top - D.top + i.scrollTop + n;
      g = i.scrollTop - k, v = i.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + n;
      g = window.scrollY - k, v = window.innerHeight;
    }
    let A = Math.max(0, Math.floor(g / t) - 15);
    A = Math.min(A, r);
    const E = Math.min(A + Math.ceil(v / t) + 30, r);
    if (A === this._vStart && E === this._vEnd) return;
    this._vStart = A, this._vEnd = E;
    const w = this.ths.length || 1, L = A * t, q = (r - E) * t;
    if (this.isDataDriven) {
      const x = document.createDocumentFragment();
      if (L > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const M = document.createElement("td");
        M.setAttribute("colspan", w), M.style.height = L + "px", k.appendChild(M), x.appendChild(k);
      }
      for (let k = A; k < E; k++) {
        const M = this._buildRow(e[k]);
        M && x.appendChild(M);
      }
      if (q > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const M = document.createElement("td");
        M.setAttribute("colspan", w), M.style.height = q + "px", k.appendChild(M), x.appendChild(k);
      }
      const D = u(this);
      this.tbody.textContent = "", this.tbody.appendChild(x), c(D), this._selectable && this._updateSelectAll();
    } else {
      let x = "";
      L > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>');
      for (let k = A; k < E; k++) x += e[k].html;
      q > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + q + 'px;padding:0;border:none"></td></tr>');
      const D = u(this);
      this.tbody.innerHTML = x, c(D), this._selectable && this._restoreSelection();
    }
  }, f.prototype._buildPlaceholderRow = function() {
    const e = document.createElement("tr");
    e.className = "ln-table__placeholder", e.setAttribute("aria-hidden", "true");
    const r = document.createElement("td");
    return r.setAttribute("colspan", this.ths.length || 1), r.style.height = this._rowHeight + "px", e.appendChild(r), e;
  }, f.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const e = this._rowHeight;
    if (!e) return;
    const r = this._cache.logicalTotal, t = this.thead ? this.thead.offsetHeight : 0, n = this._scrollContainer;
    let i, g;
    if (n) {
      const D = this.table.getBoundingClientRect(), k = n.getBoundingClientRect(), M = D.top - k.top + n.scrollTop + t;
      i = n.scrollTop - M, g = n.clientHeight;
    } else {
      const M = this.table.getBoundingClientRect().top + window.scrollY + t;
      i = window.scrollY - M, g = window.innerHeight;
    }
    let v = Math.max(0, Math.floor(i / e) - 15);
    v = Math.min(v, r);
    const A = Math.min(v + Math.ceil(g / e) + 30, r), E = this.ths.length || 1, w = v * e, L = (r - A) * e, q = document.createDocumentFragment();
    if (w > 0) {
      const D = document.createElement("tr");
      D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", E), k.style.height = w + "px", D.appendChild(k), q.appendChild(D);
    }
    for (let D = v; D < A; D++)
      if (this._cache.has(D)) {
        const k = this._buildRow(this._cache.get(D));
        k && q.appendChild(k);
      } else
        q.appendChild(this._buildPlaceholderRow());
    if (L > 0) {
      const D = document.createElement("tr");
      D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", E), k.style.height = L + "px", D.appendChild(k), q.appendChild(D);
    }
    const x = u(this);
    this.tbody.textContent = "", this.tbody.appendChild(q), c(x), this._vStart = v, this._vEnd = A, this._cache.ensure(v, A);
  }, f.prototype._showEmptyState = function() {
    const e = this.ths.length || 1;
    this.tbody.textContent = "";
    let r = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount, i = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (n < t || n === 0), g = i ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = ft(this.dom, g, "ln-table"), !r) {
        const v = this.dom.querySelector("template[data-ln-table-empty]");
        if (v) {
          const A = i ? "search" : "initial", E = v.content.querySelector('[data-ln-table-empty-when="' + A + '"]') || v.content.firstElementChild;
          E && (r = document.importNode(E, !0));
        }
      }
      if (r)
        if (r.tagName === "TR")
          this.tbody.appendChild(r);
        else {
          const v = document.createElement("td");
          v.setAttribute("colspan", String(e)), v.appendChild(r);
          const A = document.createElement("tr");
          A.className = "ln-table__empty", A.appendChild(v), this.tbody.appendChild(A);
        }
    } else {
      const t = this.dom.querySelector("template[" + y + "]"), n = document.createElement("td");
      n.setAttribute("colspan", String(e)), t && n.appendChild(document.importNode(t.content, !0));
      const i = document.createElement("tr");
      i.className = "ln-table__empty", i.appendChild(n), this.tbody.appendChild(i);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, f.prototype._fillRow = function(e, r) {
    Lt(e, r);
    const t = e.querySelectorAll("[data-ln-table-cell-attr]");
    for (let n = 0; n < t.length; n++) {
      const i = t[n], g = i.getAttribute("data-ln-table-cell-attr").split(",");
      for (let v = 0; v < g.length; v++) {
        const A = g[v].trim().split(":");
        if (A.length !== 2) continue;
        const E = A[0].trim(), w = A[1].trim();
        r[E] != null && i.setAttribute(w, r[E]);
      }
    }
  }, f.prototype._buildRow = function(e) {
    const r = ft(this.dom, this.name + "-row", "ln-table");
    if (!r) return null;
    const t = r.querySelector("[data-ln-table-row]") || r.firstElementChild;
    if (!t) return null;
    if (this._fillRow(t, e), t._lnRecord = e, e.id != null && t.setAttribute("data-ln-table-row-id", e.id), this._selectable && e.id != null && this.selectedIds.has(String(e.id))) {
      t.classList.add("ln-row-selected");
      const n = t.querySelector("[data-ln-table-row-select]");
      n && (n.checked = !0);
    }
    return t;
  }, f.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    oe(this, "ln-table:request-data", "table");
  }, f.prototype._enterWindowedMode = function() {
    const e = this, r = this.dom, t = parseInt(r.getAttribute("data-ln-table-window"), 10), n = parseInt(r.getAttribute("data-ln-table-window-page"), 10), i = parseInt(r.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !e._windowed || !e._cache || (e.totalCount = e._cache.grandTotal, e.visibleCount = e._cache.logicalTotal, e._lastTotal = e._cache.grandTotal, e.isLoaded = !0, e._vStart = -1, e._vEnd = -1, e._render(), e._updateFooter(), S(r, "ln-table:rendered", {
        table: e.name,
        total: e.totalCount,
        visible: e.visibleCount
      }));
    }, this._renderBatch = Qt(this._onCacheChange), this._cache = fe({
      windowSize: t > 0 ? t : 1e3,
      pageSize: n > 0 ? n : 200,
      threshold: i >= 0 ? i : 25,
      fetchDebounce: 120,
      requestPage: function(g, v, A) {
        S(r, "ln-table:request-data", {
          table: e.name,
          sort: g.sort,
          filters: g.filters,
          search: g.search,
          offset: v,
          limit: A,
          queryGen: e._cache.queryGen
        });
      },
      // Query-change swap: reset to top, the new result set starts at row 0.
      // Post-mutation revalidate swap: leave scroll position alone.
      onSwap: function(g) {
        g === "invalidate" && e._scrollContainer && (e._scrollContainer.scrollTop = 0);
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, f.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let e = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(e) && this._totalSpan) {
        const t = this._totalSpan.textContent.replace(/[^\d]/g, "");
        t && (e = parseInt(t, 10));
      }
      const r = e > 0 ? e : this._data.length;
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
  }, f.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, f.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const e = this.tbody.querySelectorAll("[data-ln-table-row]");
    let r = e.length > 0;
    for (let t = 0; t < e.length; t++) {
      const n = e[t].getAttribute("data-ln-table-row-id");
      if (n != null && !this.selectedIds.has(n)) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
  }, f.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const e = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let r = 0; r < e.length; r++) {
      const t = e[r].getAttribute("data-ln-table-row-id"), n = t != null && this.selectedIds.has(t);
      e[r].classList.toggle("ln-row-selected", n);
      const i = e[r].querySelector("[data-ln-table-row-select]");
      i && (i.checked = n);
    }
    this._updateSelectAll();
  }, Object.defineProperty(f.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), f.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const e = this;
    if (this._onSelectionChange = function(r) {
      const t = r.target.closest("[data-ln-table-row-select]");
      if (!t) return;
      const n = t.closest("[data-ln-table-row]");
      if (!n) return;
      const i = n.getAttribute("data-ln-table-row-id");
      i != null && (t.checked ? (e.selectedIds.add(i), n.classList.add("ln-row-selected")) : (e.selectedIds.delete(i), n.classList.remove("ln-row-selected")), e.selectedCount = e.selectedIds.size, e._updateSelectAll(), e._updateFooter(), S(e.dom, "ln-table:select", {
        table: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const r = document.createElement("input");
      r.type = "checkbox";
      const t = e.dom.querySelector('[data-ln-table-dict="select-all"]'), n = e.dom.getAttribute("data-ln-table-select-all-label") || (t ? t.textContent.trim() : null) || "Select all";
      r.setAttribute("aria-label", n), this._selectAllCheckbox.appendChild(r), this._selectAllCheckbox = r;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = e._selectAllCheckbox.checked, t = e.tbody ? e.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let n = 0; n < t.length; n++) {
        const i = t[n].getAttribute("data-ln-table-row-id"), g = t[n].querySelector("[data-ln-table-row-select]");
        i != null && (r ? (e.selectedIds.add(i), t[n].classList.add("ln-row-selected")) : (e.selectedIds.delete(i), t[n].classList.remove("ln-row-selected")), g && (g.checked = r));
      }
      e.selectedCount = e.selectedIds.size, S(e.dom, "ln-table:select-all", {
        table: e.name,
        selected: r
      }), S(e.dom, "ln-table:select", {
        table: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedCount
      }), e._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < r.length; t++) {
        const n = r[t].querySelector("[data-ln-table-row-select]"), i = r[t].getAttribute("data-ln-table-row-id");
        n && n.checked && i != null && (this.selectedIds.add(i), r[t].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, f.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const e = this.dom.querySelector("[data-ln-table-col-select]");
    if (e) {
      const r = e.querySelector('input[type="checkbox"]');
      r && r.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let t = 0; t < r.length; t++) {
        r[t].classList.remove("ln-row-selected");
        const n = r[t].querySelector("[data-ln-table-row-select]");
        n && (n.checked = !1);
      }
    }
    this._updateFooter();
  }, f.prototype._updateFooter = function() {
    let e = 0, r = 0;
    this.isDataDriven ? (e = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (e = this._data.length, r = this._filteredData.length);
    const t = r < e;
    if (this._totalSpan && (this._totalSpan.textContent = o(e, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? o(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const n = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = n > 0 ? o(n, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", n === 0);
    }
  }, f.prototype._focusRow = function(e) {
    for (let r = 0; r < e.length; r++)
      e[r].classList.remove("ln-row-focused"), e[r].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < e.length) {
      const r = e[this._focusedRowIndex];
      r.classList.add("ln-row-focused"), r.setAttribute("tabindex", "0"), r.focus(), r.scrollIntoView({ block: "nearest" });
    }
  }, f.prototype.destroy = function() {
    this.dom[s] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:set-filter", this._onSetFilter), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[s]);
  }, U(d, s, f, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(e, r) {
      const t = e[s];
      if (!(!t || !t.isDataDriven)) {
        if (r === "data-ln-table-window") {
          const n = e.hasAttribute("data-ln-table-window");
          if (n && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!n && t._windowed)
            t._exitWindowedMode();
          else if (n && t._windowed) {
            const i = parseInt(e.getAttribute("data-ln-table-window"), 10);
            i > 0 && t._cache.configure({ windowSize: i });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (r === "data-ln-table-window-page") {
            const n = parseInt(e.getAttribute("data-ln-table-window-page"), 10);
            n > 0 && t._cache.configure({ pageSize: n });
          } else if (r === "data-ln-table-window-threshold") {
            const n = parseInt(e.getAttribute("data-ln-table-window-threshold"), 10);
            n >= 0 && t._cache.configure({ threshold: n });
          } else if (r === "data-ln-table-count") {
            const n = parseInt(e.getAttribute("data-ln-table-count"), 10);
            n >= 0 && t._cache.setGrandTotal(n);
          }
        }
      }
    }
  });
})();
(function() {
  const d = "data-ln-table-coordinator", s = "lnTableCoordinator";
  if (window[s] !== void 0) return;
  function y(_, p) {
    if (p) {
      const h = document.getElementById(p);
      if (h && h.hasAttribute("data-ln-table")) return h;
    }
    if (_) {
      const h = _.getAttribute("data-ln-search") || _.getAttribute("data-ln-filter");
      if (h) {
        const o = document.getElementById(h) || document.querySelector('[data-ln-table="' + h + '"]');
        if (o) return o;
      }
      const a = _.closest("[" + d + "]");
      if (a) {
        const o = a.querySelector("[data-ln-table]");
        if (o) return o;
      }
      const m = _.closest("[data-ln-table]");
      if (m) return m;
    }
    return document.querySelector("[data-ln-table]");
  }
  document.addEventListener("ln-search:change", function(_) {
    const p = _.detail && _.detail.term != null ? _.detail.term : "", h = _.target, a = h.getAttribute ? h.getAttribute("data-ln-search") : null, m = y(h, a);
    if (!m || !m.lnTable) return;
    _.preventDefault();
    const o = h.tagName === "INPUT" || h.tagName === "TEXTAREA" ? h : h.querySelector ? h.querySelector('input[type="search"], input[type="text"], input') : null;
    o && o.value !== p && (o.value = p), S(m, "ln-table:set-search", {
      query: p,
      term: p,
      table: m.lnTable.name || m.id
    });
  }), document.addEventListener("ln-filter:changed", function(_) {
    if (!_.detail) return;
    const p = _.detail.key, h = _.detail.values || [], a = _.target;
    if (!a.hasAttribute || !a.hasAttribute("data-ln-filter")) return;
    const m = a.getAttribute ? a.getAttribute("data-ln-filter") : null, o = y(a, m);
    if (!o || !o.lnTable) return;
    const l = o.querySelectorAll("th");
    for (let u = 0; u < l.length; u++)
      if (l[u].getAttribute("data-ln-table-filter-col") === p) {
        const c = l[u].querySelector("[data-ln-table-col-filter]");
        c && c.classList.toggle("ln-filter-active", h.length > 0);
        break;
      }
    S(o, "ln-table:set-filter", {
      key: p,
      values: h,
      table: o.lnTable.name || o.id
    });
  }), document.addEventListener("click", function(_) {
    const p = _.target.closest("[data-ln-table-clear-all], [data-ln-table-clear]");
    if (!p) return;
    const h = y(p);
    if (!h || !h.lnTable) return;
    const a = h.querySelectorAll("th");
    for (let f = 0; f < a.length; f++) {
      const e = a[f].querySelector("[data-ln-table-col-filter]");
      e && e.classList.remove("ln-filter-active");
    }
    const o = p.closest("[" + d + "]") || document, l = h.id, u = l && o.querySelector('[data-ln-search="' + l + '"]') || o.querySelector("[data-ln-search]");
    if (u) {
      const f = u.tagName === "INPUT" || u.tagName === "TEXTAREA" ? u : u.querySelector("input");
      f && (f.value = "");
    }
    const c = l && o.querySelectorAll('[data-ln-filter="' + l + '"]') || o.querySelectorAll("[data-ln-filter]");
    for (let f = 0; f < c.length; f++) {
      const e = c[f].querySelector("[data-ln-filter-reset]");
      e && (e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    S(h, "ln-table:request-clear-filters", {
      table: h.lnTable.name || h.id
    });
  }), document.addEventListener("keydown", function(_) {
    if (_.key !== "/" || _.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
    const p = document.querySelector("[" + d + "] [data-ln-search]") || document.querySelector("[data-ln-search]");
    if (!p) return;
    const h = p.tagName === "INPUT" || p.tagName === "TEXTAREA" ? p : p.querySelector('input[type="search"], input[type="text"], input');
    h && (_.preventDefault(), h.focus());
  });
  function b(_) {
    return this.dom = _, this;
  }
  b.prototype.destroy = function() {
    this.dom[s] && delete this.dom[s];
  }, U(d, s, b, "ln-table-coordinator");
})();
(function() {
  const d = "data-ln-list", s = "lnList", y = "data-ln-list-empty";
  if (window[s] !== void 0) return;
  function m(e, r) {
    if (e == null || isNaN(e)) return "";
    try {
      return new Intl.NumberFormat(G(r)).format(e);
    } catch {
      return String(e);
    }
  }
  function o(e) {
    let r = e;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const n = getComputedStyle(r).overflowY;
      if (n === "auto" || n === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function l(e) {
    const r = e._scrollContainer || o(e.dom);
    return {
      container: r,
      top: r ? r.scrollTop : window.scrollY
    };
  }
  function u(e) {
    e.container ? e.container.scrollTop = e.top : window.scrollTo(window.scrollX, e.top);
  }
  function c(e) {
    if (!e) return 0;
    const r = getComputedStyle(e), t = parseFloat(r.marginTop) || 0, n = parseFloat(r.marginBottom) || 0;
    return e.offsetHeight + t + n;
  }
  function f(e) {
    this.dom = e, this.tbody = e.querySelector("[data-ln-list-body]") || e, this.isDataDriven = e.hasAttribute("data-ln-list-source"), this.name = e.getAttribute(d) || "", this.source = e.getAttribute("data-ln-list-source") || "", this._totalSpan = e.querySelector("[data-ln-list-total]"), this._filteredSpan = e.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== e ? this._filteredSpan.parentElement : null), this._selectedSpan = e.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== e ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const r = this;
    return this._selectable = e.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._windowed = !1, this._cache = null, this.isDataDriven && e.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._onSetData = function(t) {
      const n = t.detail || {};
      if (r._windowed) {
        e.classList.remove("ln-list--loading"), r._cache.ingest(n);
        return;
      }
      r._data = n.data || [], r._lastTotal = n.total != null ? n.total : r._data.length, r._lastFiltered = n.filtered != null ? n.filtered : r._data.length, r.totalCount = r._lastTotal, r.visibleCount = r._lastFiltered, r.isLoaded = !0, e.classList.remove("ln-list--loading"), r._vStart = -1, r._vEnd = -1, r._applyFilterAndSort(), r._render(), r._updateFooter(), S(e, "ln-list:rendered", {
        list: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      });
    }, e.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(t) {
      const n = t.detail && t.detail.loading;
      e.classList.toggle("ln-list--loading", !!n), n && (r.isLoaded = !1);
    }, e.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(t) {
      !r._windowed || !r._cache || r._cache.release(t.detail && t.detail.offset);
    }, e.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !r._windowed || !r._cache || r._cache.revalidate();
    }, e.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onClearAll = function(t) {
      t.target.closest("[data-ln-list-clear-all]") && (r.currentFilters = {}, S(e, "ln-list:clear-filters", { list: r.name }), r._requestData());
    }, e.addEventListener("click", this._onClearAll), this._onSort = function(t) {
      t.detail.field != null && (t.preventDefault(), r.currentSort = t.detail.direction === "none" ? null : { field: t.detail.field, direction: t.detail.direction }, r._windowed ? r._requestData() : (r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render()));
    }, e.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onItemClick = function(t) {
      if (t.target.closest("[data-ln-item-select]") || t.target.closest("[data-ln-item-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const n = t.target.closest("[data-ln-item]");
      if (!n) return;
      const i = n.getAttribute("data-ln-item-id"), g = n._lnRecord || {};
      S(e, "ln-list:item-click", {
        list: r.name,
        id: i,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(t) {
      const n = t.target.closest("[data-ln-item-action]");
      if (!n) return;
      t.stopPropagation();
      const i = n.closest("[data-ln-item]");
      if (!i) return;
      const g = n.getAttribute("data-ln-item-action"), v = i.getAttribute("data-ln-item-id"), A = i._lnRecord || {};
      S(e, "ln-list:item-action", {
        list: r.name,
        id: v,
        action: g,
        record: A
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(t) {
      t.preventDefault(), r.currentSearch = t.detail && t.detail.term || "", S(e, "ln-list:search", {
        list: r.name,
        query: r.currentSearch
      }), r._requestData();
    }, e.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : S(e, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      r.tbody.children.length > 0 && (r._emptyObserver.disconnect(), r._emptyObserver = null, r._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(t) {
      t.preventDefault(), r._searchTerm = t.detail && t.detail.term || "", r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), S(e, "ln-list:filter", {
        term: r._searchTerm,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, e.addEventListener("ln-search:change", this._onSearch)), this._onClear = function(t) {
      if (!t.target.closest("[data-ln-list-clear]") || $(e, "ln-list:before-clear-search", { list: r.name }).defaultPrevented) return;
      r.isDataDriven ? r.currentSearch = "" : r._searchTerm = "";
      const g = document.querySelector('[data-ln-search="' + e.id + '"]');
      if (g) {
        const v = g.tagName === "INPUT" ? g : g.querySelector("input");
        v && (v.value = "", v.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
      r.isDataDriven ? (S(e, "ln-list:search", {
        list: r.name,
        query: ""
      }), r._requestData()) : (r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), S(e, "ln-list:filter", {
        term: "",
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, e.addEventListener("click", this._onClear), this;
  }
  f.prototype._parseChildren = function() {
    const e = Array.from(this.tbody.children).filter((r) => !r.classList.contains("ln-list__spacer"));
    this._data = [], e.length > 0 && (this._itemHeight = c(e[0]) || 50);
    for (let r = 0; r < e.length; r++) {
      const t = e[r], n = t.getAttribute("data-ln-item-id") || t.getAttribute("id"), i = t.textContent.trim().toLowerCase();
      let g = null;
      if (this.isDataDriven) {
        g = {}, n != null && (g.id = n);
        const v = t.querySelectorAll("[data-ln-list-field]");
        for (let A = 0; A < v.length; A++) {
          const E = v[A], w = E.getAttribute("data-ln-list-field");
          w && (g[w] = E.textContent.trim());
        }
      }
      this._data.push({
        html: t.outerHTML,
        searchText: i,
        id: n,
        ...g
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, f.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const e = (this.currentSearch || "").trim().toLowerCase(), r = this.currentFilters || {}, t = Object.keys(r).length > 0;
      if (this._filteredData = this._data.filter(function(E) {
        if (e) {
          let w = !1;
          for (const L in E)
            if (E.hasOwnProperty(L) && typeof E[L] == "string" && L !== "html" && L !== "searchText" && E[L].toLowerCase().indexOf(e) !== -1) {
              w = !0;
              break;
            }
          if (!w) return !1;
        }
        if (t)
          for (const w in r) {
            const L = r[w];
            if (L && L.length > 0) {
              const q = E[w], x = q != null ? String(q) : "";
              if (L.indexOf(x) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, i = this.currentSort.direction === "desc" ? -1 : 1, g = this._filteredData.map(function(E) {
        return E[n];
      }), v = Dt(g), A = typeof Intl < "u" ? new Intl.Collator(G(this.dom), { sensitivity: "base" }) : null;
      this._filteredData.sort(function(E, w) {
        return It(E[n], w[n], v, A) * i;
      });
    } else {
      const e = this._searchTerm;
      e ? this._filteredData = this._data.filter(function(r) {
        return r.searchText.indexOf(e) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, f.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const e = this._lastTotal, r = this.visibleCount;
        if (e === 0 || this._filteredData.length === 0 || r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const e = this._filteredData.length;
        e === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, f.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const e = this._filteredData, r = document.createDocumentFragment();
      for (let n = 0; n < e.length; n++) {
        const i = this._buildItem(e[n]);
        if (!i) break;
        r.appendChild(i);
      }
      const t = l(this);
      this.tbody.textContent = "", this.tbody.appendChild(r), u(t), this._selectable && this._updateSelectAll();
    } else {
      const e = [], r = this._filteredData;
      for (let n = 0; n < r.length; n++) e.push(r[n].html);
      const t = l(this);
      this.tbody.innerHTML = e.join(""), u(t), this._selectable && this._restoreSelection();
    }
  }, f.prototype._readGridLayout = function() {
    const e = getComputedStyle(this.tbody), r = e.gridTemplateColumns;
    let t = 1;
    if (r && r !== "none") {
      const i = r.trim().split(/\s+/).filter(Boolean);
      i.length > 0 && (t = i.length);
    }
    const n = parseFloat(e.rowGap);
    return { columns: t, rowGap: isNaN(n) ? 0 : n };
  }, f.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const e = this._cache.peek(), r = e ? this._buildItem(e) : this._buildPlaceholderItem();
      r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = c(r) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const e = this._buildItem(this._data[0]);
        e && (this.tbody.textContent = "", this.tbody.appendChild(e), this._itemHeight = c(e) || 50, this.tbody.textContent = "");
      }
    } else {
      const e = this.tbody.children;
      e.length > 0 && (this._itemHeight = c(e[0]) || 50);
    }
  }, f.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const e = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = o(this.dom);
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._windowed ? e._renderWindowed() : e._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      e._itemHeight = 0, e._measureItemHeight(), e._vStart = -1, e._vEnd = -1, e._windowed ? e._renderWindowed() : e._renderVirtual();
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, f.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, f.prototype._renderVirtual = function() {
    const e = this._filteredData, r = e.length, t = this._itemHeight;
    if (!t || !r) return;
    const n = this._scrollContainer;
    let i, g;
    if (n) {
      const H = this.tbody.getBoundingClientRect(), j = n.getBoundingClientRect(), z = n === this.tbody ? 0 : H.top - j.top + n.scrollTop;
      i = n.scrollTop - z, g = n.clientHeight;
    } else {
      const j = this.tbody.getBoundingClientRect().top + window.scrollY;
      i = window.scrollY - j, g = window.innerHeight;
    }
    const v = this._readGridLayout(), A = v.columns, E = v.rowGap, w = t + E, L = Math.ceil(r / A);
    let q = Math.max(0, Math.floor(i / w) - 15);
    q = Math.min(q, L);
    const x = Math.ceil(g / w) + 30, D = Math.min(q + x, L), k = Math.min(q * A, r), M = Math.min(D * A, r);
    if (k === this._vStart && M === this._vEnd) return;
    this._vStart = k, this._vEnd = M;
    const N = q * w, B = (L - D) * w;
    if (this.isDataDriven) {
      const H = document.createDocumentFragment();
      if (N > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.style.height = N + "px", H.appendChild(z);
      }
      for (let z = k; z < M; z++) {
        const Z = this._buildItem(e[z]);
        Z && H.appendChild(Z);
      }
      if (B > 0) {
        const z = document.createElement(this.isUl ? "li" : "div");
        z.className = "ln-list__spacer", z.style.height = B + "px", H.appendChild(z);
      }
      const j = l(this);
      this.tbody.textContent = "", this.tbody.appendChild(H), u(j), this._selectable && this._updateSelectAll();
    } else {
      let H = "";
      N > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${N}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let z = k; z < M; z++)
        H += e[z].html;
      B > 0 && (H += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${B}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      const j = l(this);
      this.tbody.innerHTML = H, u(j), this._selectable && this._restoreSelection();
    }
  }, f.prototype._buildPlaceholderItem = function() {
    const e = document.createElement(this.isUl ? "li" : "div");
    return e.className = "ln-list__placeholder", e.setAttribute("aria-hidden", "true"), e.style.height = this._itemHeight + "px", e;
  }, f.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const e = this._itemHeight;
    if (!e) return;
    const r = this._scrollContainer;
    let t, n;
    if (r) {
      const j = this.tbody.getBoundingClientRect(), z = r.getBoundingClientRect(), Z = r === this.tbody ? 0 : j.top - z.top + r.scrollTop;
      t = r.scrollTop - Z, n = r.clientHeight;
    } else {
      const z = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - z, n = window.innerHeight;
    }
    const i = this._readGridLayout(), g = i.columns, v = i.rowGap, A = e + v, E = this._cache.logicalTotal, w = Math.ceil(E / g);
    let L = Math.max(0, Math.floor(t / A) - 15);
    L = Math.min(L, w);
    const q = Math.ceil(n / A) + 30, x = Math.min(L + q, w), D = Math.min(L * g, E), k = Math.min(x * g, E), M = L * A, N = (w - x) * A, B = document.createDocumentFragment();
    if (M > 0) {
      const j = document.createElement(this.isUl ? "li" : "div");
      j.className = "ln-list__spacer", j.style.height = M + "px", B.appendChild(j);
    }
    for (let j = D; j < k; j++)
      if (this._cache.has(j)) {
        const z = this._buildItem(this._cache.get(j));
        z && B.appendChild(z);
      } else
        B.appendChild(this._buildPlaceholderItem());
    if (N > 0) {
      const j = document.createElement(this.isUl ? "li" : "div");
      j.className = "ln-list__spacer", j.style.height = N + "px", B.appendChild(j);
    }
    const H = l(this);
    this.tbody.textContent = "", this.tbody.appendChild(B), u(H), this._vStart = D, this._vEnd = k, this._cache.ensure(D, k);
  }, f.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let e = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount, n = this.currentSearch && (t < r || t === 0), i = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (e = ft(this.dom, i, "ln-list"), !e) {
        const g = this.dom.querySelector("template[data-ln-empty]");
        if (g) {
          const v = n ? "search" : "initial", A = g.content.querySelector(`[data-ln-empty-when="${v}"]`) || g.content.firstElementChild;
          A && (e = document.importNode(A, !0));
        }
      }
    } else {
      const r = this.dom.querySelector(`template[${y}]`);
      r && (e = document.importNode(r.content, !0));
    }
    if (e)
      if (e.tagName === "LI" || e.tagName === "TR")
        this.tbody.appendChild(e);
      else {
        const r = document.createElement(this.isUl ? "li" : "div");
        r.appendChild(e), this.tbody.appendChild(r);
      }
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, f.prototype._buildItem = function(e) {
    const r = ft(this.dom, this.name + "-row", "ln-list");
    if (!r) return null;
    const t = r.querySelector("[data-ln-item]") || r.firstElementChild;
    if (!t) return null;
    if (Lt(t, e), rt(t, e), t._lnRecord = e, e.id != null && (t.setAttribute("data-ln-item-id", e.id), this._selectable && this.selectedIds.has(String(e.id)))) {
      t.classList.add("ln-item-selected");
      const n = t.querySelector("[data-ln-item-select]");
      n && (n.checked = !0);
    }
    return t;
  }, f.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const e = this;
    this._onSelectionChange = function(r) {
      const t = r.target.closest("[data-ln-item-select]");
      if (!t) return;
      const n = t.closest("[data-ln-item]");
      if (!n) return;
      const i = n.getAttribute("data-ln-item-id");
      i != null && (t.checked ? (e.selectedIds.add(String(i)), n.classList.add("ln-item-selected")) : (e.selectedIds.delete(String(i)), n.classList.remove("ln-item-selected")), e._updateSelectAll(), e._updateFooter(), S(e.dom, "ln-list:select", {
        list: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = e._selectAllCheckbox.checked, t = e.tbody.querySelectorAll("[data-ln-item]");
      for (let n = 0; n < t.length; n++) {
        const i = t[n], g = i.getAttribute("data-ln-item-id"), v = i.querySelector("[data-ln-item-select]");
        g != null && (r ? (e.selectedIds.add(String(g)), i.classList.add("ln-item-selected")) : (e.selectedIds.delete(String(g)), i.classList.remove("ln-item-selected")), v && (v.checked = r));
      }
      S(e.dom, "ln-list:select-all", { list: e.name, selected: r }), S(e.dom, "ln-list:select", {
        list: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedIds.size
      }), e._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, f.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const e = this.tbody.querySelectorAll("[data-ln-item]");
    let r = e.length > 0;
    for (let t = 0; t < e.length; t++) {
      const n = e[t].getAttribute("data-ln-item-id");
      if (n != null && !this.selectedIds.has(String(n))) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
  }, f.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const e = this.tbody.querySelectorAll("[data-ln-item]");
    for (let r = 0; r < e.length; r++) {
      const t = e[r].getAttribute("data-ln-item-id"), n = t != null && this.selectedIds.has(String(t));
      e[r].classList.toggle("ln-item-selected", n);
      const i = e[r].querySelector("[data-ln-item-select]");
      i && (i.checked = n);
    }
    this._updateSelectAll();
  }, f.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    oe(this, "ln-list:request-data", "list");
  }, f.prototype._enterWindowedMode = function() {
    const e = this, r = this.dom, t = parseInt(r.getAttribute("data-ln-list-window"), 10), n = parseInt(r.getAttribute("data-ln-list-window-page"), 10), i = parseInt(r.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !e._windowed || !e._cache || (e.totalCount = e._cache.grandTotal, e.visibleCount = e._cache.logicalTotal, e._lastTotal = e._cache.grandTotal, e.isLoaded = !0, e._vStart = -1, e._vEnd = -1, e._render(), e._updateFooter(), S(r, "ln-list:rendered", {
        list: e.name,
        total: e.totalCount,
        visible: e.visibleCount
      }));
    }, this._renderBatch = Qt(this._onCacheChange), this._cache = fe({
      windowSize: t > 0 ? t : 1e3,
      pageSize: n > 0 ? n : 200,
      threshold: i >= 0 ? i : 25,
      fetchDebounce: 120,
      requestPage: function(g, v, A) {
        S(r, "ln-list:request-data", {
          list: e.name,
          sort: g.sort,
          filters: g.filters,
          search: g.search,
          offset: v,
          limit: A,
          queryGen: e._cache.queryGen
        });
      },
      // Query-change swap: reset to top, the new result set starts at row 0.
      // Post-mutation revalidate swap: leave scroll position alone.
      onSwap: function(g) {
        g === "invalidate" && e._scrollContainer && (e._scrollContainer.scrollTop = 0);
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, f.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const e = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), r = e > 0 ? e : this._data.length;
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
  }, f.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, f.prototype._updateFooter = function() {
    let e = 0, r = 0;
    this.isDataDriven ? (e = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (e = this._data.length, r = this._filteredData.length);
    const t = r < e;
    if (this._totalSpan && (this._totalSpan.textContent = m(e, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = t ? m(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const n = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = n > 0 ? m(n, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", n === 0);
    }
  }, f.prototype.destroy = function() {
    this.dom[s] && (this._disableVirtualScroll(), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._onClear && this.dom.removeEventListener("click", this._onClear), this._data = [], this._filteredData = [], delete this.dom[s]);
  }, U(d, s, f, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(e, r) {
      const t = e[s];
      if (!(!t || !t.isDataDriven)) {
        if (r === "data-ln-list-window") {
          const n = e.hasAttribute("data-ln-list-window");
          if (n && !t._windowed)
            t._enterWindowedMode(), t._kickWindowInitial();
          else if (!n && t._windowed)
            t._exitWindowedMode();
          else if (n && t._windowed) {
            const i = parseInt(e.getAttribute("data-ln-list-window"), 10);
            i > 0 && t._cache.configure({ windowSize: i });
          }
          return;
        }
        if (!(!t._windowed || !t._cache)) {
          if (r === "data-ln-list-window-page") {
            const n = parseInt(e.getAttribute("data-ln-list-window-page"), 10);
            n > 0 && t._cache.configure({ pageSize: n });
          } else if (r === "data-ln-list-window-threshold") {
            const n = parseInt(e.getAttribute("data-ln-list-window-threshold"), 10);
            n >= 0 && t._cache.configure({ threshold: n });
          } else if (r === "data-ln-list-count") {
            const n = parseInt(e.getAttribute("data-ln-list-count"), 10);
            n >= 0 && t._cache.setGrandTotal(n);
          }
        }
      }
    }
  });
})();
(function() {
  const d = "data-ln-circular-progress", s = "lnCircularProgress";
  if (window[s] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", b = 36, _ = 16, p = 2 * Math.PI * _;
  function h(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, m.call(this), l.call(this), o.call(this), this;
  }
  h.prototype.destroy = function() {
    this.dom[s] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[s]);
  };
  function a(u, c) {
    const f = document.createElementNS(y, u);
    for (const e in c)
      f.setAttribute(e, c[e]);
    return f;
  }
  function m() {
    this.svg = a("svg", {
      viewBox: "0 0 " + b + " " + b,
      "aria-hidden": "true"
    }), this.trackCircle = a("circle", {
      cx: b / 2,
      cy: b / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = a("circle", {
      cx: b / 2,
      cy: b / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": p,
      "stroke-dashoffset": p,
      transform: "rotate(-90 " + b / 2 + " " + b / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const u = this, c = new MutationObserver(function(f) {
      for (const e of f)
        (e.attributeName === "data-ln-circular-progress" || e.attributeName === "data-ln-circular-progress-max" || e.attributeName === "data-ln-circular-progress-label") && l.call(u);
    });
    c.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = c;
  }
  function l() {
    const u = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, c = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let f = c > 0 ? u / c * 100 : 0;
    f < 0 && (f = 0), f > 100 && (f = 100);
    const e = p - f / 100 * p;
    this.progressCircle.setAttribute("stroke-dashoffset", e);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), t = r !== null ? r : Math.round(f) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(c));
    const n = Math.max(0, Math.min(u, c));
    this.dom.setAttribute("aria-valuenow", String(n)), this.dom.setAttribute("aria-valuetext", t), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: u,
      max: c,
      percentage: f
    });
  }
  U(d, s, h, "ln-circular-progress");
})();
(function() {
  const d = "data-ln-sortable", s = "lnSortable", y = "data-ln-sortable-handle";
  if (window[s] !== void 0) return;
  function b(p) {
    this.dom = p, this.isEnabled = p.getAttribute(d) !== "disabled", this._dragging = null, p.setAttribute("aria-roledescription", "sortable list");
    const h = this;
    return this._onPointerDown = function(a) {
      h.isEnabled && h._handlePointerDown(a);
    }, p.addEventListener("pointerdown", this._onPointerDown), this;
  }
  b.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(d, "");
  }, b.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(d, "disabled");
  }, b.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[s]);
  }, b.prototype._handlePointerDown = function(p) {
    let h = p.target.closest("[" + y + "]"), a;
    if (h) {
      for (a = h; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (a = p.target; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
      h = a;
    }
    const o = Array.from(this.dom.children).indexOf(a);
    if ($(this.dom, "ln-sortable:before-drag", {
      item: a,
      index: o
    }).defaultPrevented) return;
    p.preventDefault(), h.setPointerCapture(p.pointerId), this._dragging = a, a.classList.add("ln-sortable--dragging"), a.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: a,
      index: o
    });
    const u = this, c = function(e) {
      u._handlePointerMove(e);
    }, f = function(e) {
      u._handlePointerEnd(e), h.removeEventListener("pointermove", c), h.removeEventListener("pointerup", f), h.removeEventListener("pointercancel", f);
    };
    h.addEventListener("pointermove", c), h.addEventListener("pointerup", f), h.addEventListener("pointercancel", f);
  }, b.prototype._handlePointerMove = function(p) {
    if (!this._dragging) return;
    const h = Array.from(this.dom.children), a = this._dragging;
    for (const m of h)
      m.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const m of h) {
      if (m === a) continue;
      const o = m.getBoundingClientRect(), l = o.top + o.height / 2;
      if (p.clientY >= o.top && p.clientY < l) {
        m.classList.add("ln-sortable--drop-before");
        break;
      } else if (p.clientY >= l && p.clientY <= o.bottom) {
        m.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, b.prototype._handlePointerEnd = function(p) {
    if (!this._dragging) return;
    const h = this._dragging, a = Array.from(this.dom.children), m = a.indexOf(h);
    let o = null, l = null;
    for (const u of a) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        o = u, l = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        o = u, l = "after";
        break;
      }
    }
    for (const u of a)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (h.classList.remove("ln-sortable--dragging"), h.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== h) {
      l === "before" ? this.dom.insertBefore(h, o) : this.dom.insertBefore(h, o.nextElementSibling);
      const c = Array.from(this.dom.children).indexOf(h);
      S(this.dom, "ln-sortable:reordered", {
        item: h,
        oldIndex: m,
        newIndex: c
      });
    }
    this._dragging = null;
  };
  function _(p) {
    const h = p[s];
    if (!h) return;
    const a = p.getAttribute(d) !== "disabled";
    a !== h.isEnabled && (h.isEnabled = a, S(p, a ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: p }));
  }
  U(d, s, b, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const d = "data-ln-confirm", s = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[s] !== void 0) return;
  function _(...h) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...h);
  }
  function p(h) {
    _("constructor called on", h), this.dom = h, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = h.querySelector("[data-ln-confirm-idle]"), this.activeEl = h.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = h.textContent.trim(), this.confirmText = h.getAttribute(d) || "Confirm?");
    const a = this;
    return this._onClick = function(m) {
      if (_("click handler, confirming:", a.confirming, "submitted:", a._submitted, "target:", m.target), !a.confirming)
        m.preventDefault(), m.stopImmediatePropagation(), a._enterConfirm();
      else {
        if (a._submitted) return;
        a._submitted = !0, a._reset();
      }
    }, h.addEventListener("click", this._onClick), this;
  }
  p.prototype._getTimeout = function() {
    const h = parseFloat(this.dom.getAttribute(y));
    return isNaN(h) || h <= 0 ? 3 : h;
  }, p.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const a = this.activeEl ? this.activeEl.textContent.trim() : "";
      a && (this.dom.setAttribute("aria-label", a), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = h.getAttribute("href"), h.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, p.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const h = this, a = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      h._reset();
    }, a);
  }, p.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      var h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalIconHref && h.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, p.prototype.destroy = function() {
    _("destroy called on", this.dom), this.dom[s] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[s]);
  }, U(d, s, p, "ln-confirm");
})();
(function() {
  const d = "data-ln-translations", s = "lnTranslations";
  if (window[s] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function b(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(d + "-default") || "", this.placeholderLabel = _.getAttribute(d + "-placeholder") || "{lang} translation", this.removeLabel = _.getAttribute(d + "-remove-label") || "Remove {lang}", this.badgesEl = _.querySelector("[" + d + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const p = _.getAttribute(d + "-locales");
    if (this.locales = y, p)
      try {
        this.locales = JSON.parse(p);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const h = this;
    return this._onRequestAdd = function(a) {
      a.detail && a.detail.lang && h.addLanguage(a.detail.lang);
    }, this._onRequestRemove = function(a) {
      a.detail && a.detail.lang && h.removeLanguage(a.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  b.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const p of _) {
      const h = p.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const a of h)
        a.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, b.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const p of _) {
      const h = p.getAttribute("data-ln-translatable-lang");
      h && h !== this.defaultLang && this.activeLanguages.add(h);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, b.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let p = 0;
    for (const a in this.locales) {
      if (!this.locales.hasOwnProperty(a) || this.activeLanguages.has(a)) continue;
      p++;
      const m = kt("ln-translations-menu-item", "ln-translations");
      if (!m) return;
      const o = m.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", a), o.textContent = this.locales[a], o.addEventListener("click", function(l) {
        l.ctrlKey || l.metaKey || l.button === 1 || (l.preventDefault(), l.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(a));
      }), this.menuEl.appendChild(m);
    }
    const h = this.dom.querySelector("[" + d + "-add]");
    h && (h.hidden = p === 0);
  }, b.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(p) {
      const h = kt("ln-translations-badge", "ln-translations");
      if (!h) return;
      const a = h.querySelector("[data-ln-translations-lang]");
      a.setAttribute("data-ln-translations-lang", p);
      const m = a.querySelector("span");
      m.textContent = _.locales[p] || p.toUpperCase();
      const o = a.querySelector("button"), l = _.locales[p] || p.toUpperCase();
      o.setAttribute("aria-label", _.removeLabel.replace("{lang}", l)), o.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), _.removeLanguage(p));
      }), _.badgesEl.appendChild(h);
    });
  }, b.prototype.addLanguage = function(_, p) {
    if (this.activeLanguages.has(_)) return;
    const h = this.locales[_] || _;
    if ($(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: h
    }).defaultPrevented) return;
    this.activeLanguages.add(_), p = p || {};
    const m = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of m) {
      const l = o.getAttribute("data-ln-translatable"), u = o.getAttribute("data-ln-translations-prefix") || "", c = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!c) continue;
      const f = c.cloneNode(c.tagName === "SELECT");
      u ? f.name = u + "[trans][" + _ + "][" + l + "]" : f.name = "trans[" + _ + "][" + l + "]", f.value = p[l] !== void 0 ? p[l] : "", f.removeAttribute("id"), "placeholder" in f && (f.placeholder = this.placeholderLabel.replace("{lang}", h)), f.setAttribute("data-ln-translatable-lang", _);
      const e = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = e.length > 0 ? e[e.length - 1] : c;
      r.parentNode.insertBefore(f, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: h
    });
  }, b.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || $(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const h = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const a of h)
      a.parentNode.removeChild(a);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: _
    });
  }, b.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, b.prototype.hasLanguage = function(_) {
    return this.activeLanguages.has(_);
  }, b.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const _ = this.defaultLang, p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of p)
      h.getAttribute("data-ln-translatable-lang") !== _ && h.parentNode.removeChild(h);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[s];
  }, U(d, s, b, "ln-translations");
})();
(function() {
  const d = "data-ln-autosave", s = "lnAutosave", y = "data-ln-autosave-clear", b = "data-ln-autosave-debounce-input", _ = "ln-autosave:";
  if (window[s] !== void 0) return;
  function h(l) {
    const u = a(l);
    if (!u) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", l);
      return;
    }
    this.dom = l, this.key = u;
    let c = null;
    function f() {
      const n = se(l, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(u, JSON.stringify(n));
      } catch {
        return;
      }
      S(l, "ln-autosave:saved", { target: l, data: n });
    }
    function e() {
      let n;
      try {
        n = localStorage.getItem(u);
      } catch {
        return;
      }
      if (!n) return;
      let i;
      try {
        i = JSON.parse(n);
      } catch {
        return;
      }
      if ($(l, "ln-autosave:before-restore", { target: l, data: i }).defaultPrevented) return;
      const v = ae(l, i);
      for (let A = 0; A < v.length; A++)
        v[A].dispatchEvent(new Event("input", { bubbles: !0 })), v[A].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(l, "ln-autosave:restored", { target: l, data: i });
    }
    function r() {
      try {
        localStorage.removeItem(u);
      } catch {
        return;
      }
      S(l, "ln-autosave:cleared", { target: l });
    }
    this._onFocusout = function(n) {
      const i = n.target;
      m(i) && i.name && !i.hasAttribute("data-ln-autosave-exclude") && f();
    }, this._onChange = function(n) {
      const i = n.target;
      m(i) && i.name && !i.hasAttribute("data-ln-autosave-exclude") && f();
    }, this._onSubmit = function() {
      r();
    }, this._onReset = function() {
      r();
    }, this._onClearClick = function(n) {
      n.target.closest("[" + y + "]") && r();
    }, l.addEventListener("focusout", this._onFocusout), l.addEventListener("change", this._onChange), l.addEventListener("submit", this._onSubmit), l.addEventListener("reset", this._onReset), l.addEventListener("click", this._onClearClick);
    const t = o(l);
    return t > 0 && (this._onInput = function(n) {
      const i = n.target;
      !m(i) || !i.name || i.hasAttribute("data-ln-autosave-exclude") || (c !== null && clearTimeout(c), c = setTimeout(f, t));
    }, l.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return c;
    }, e(), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[s]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const l = this._getInputTimer();
        l !== null && clearTimeout(l);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[s];
    }
  };
  function a(l) {
    const c = l.getAttribute(d) || l.id;
    return c ? _ + window.location.pathname + ":" + c : null;
  }
  function m(l) {
    const u = l.tagName;
    return u === "INPUT" || u === "TEXTAREA" || u === "SELECT";
  }
  function o(l) {
    if (!l.hasAttribute(b)) return 0;
    const u = l.getAttribute(b);
    if (u === "" || u === null) return 1e3;
    const c = parseInt(u, 10);
    return isNaN(c) || c < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", l), 1e3) : c;
  }
  U(d, s, h, "ln-autosave");
})();
(function() {
  const d = "data-ln-autoresize", s = "lnAutoresize";
  if (window[s] !== void 0) return;
  function y(b) {
    if (b.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", b.tagName), this;
    this.dom = b;
    const _ = this;
    return this._onInput = function() {
      _._resize();
    }, b.addEventListener("input", this._onInput), this._resize(), this;
  }
  y.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, y.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[s]);
  }, U(d, s, y, "ln-autoresize");
})();
(function() {
  const d = "data-ln-editor", s = "lnEditor";
  if (window[s] !== void 0) return;
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
  }, b = {
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
  }, p = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let h = 0;
  function a(t) {
    return !!(b[t] || _[t] || p[t] || t === "link");
  }
  function m(t) {
    this.dom = t;
    const n = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const i = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), i && this._surface.setAttribute("data-placeholder", i);
    const g = this._textarea.id;
    if (g) {
      const w = t.querySelector('label[for="' + g + '"]');
      w && (w.id || (w.id = g + "-label"), this._surface.setAttribute("aria-labelledby", w.id));
    }
    this._surface.id = g ? g + "-surface" : "ln-editor-surface-" + ++h;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const A = t.querySelector('[role="toolbar"]');
    if (A && A.nextSibling ? t.insertBefore(this._surface, A.nextSibling) : t.appendChild(this._surface), A) {
      A.setAttribute("aria-controls", this._surface.id);
      const w = A.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < w.length; L++) {
        const q = w[L].getAttribute("data-ln-editor-action");
        a(q) && w[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      n._syncToTextarea(), S(n.dom, "ln-editor:changed", {
        html: n._textarea.value,
        target: n.dom
      });
    }, this._onMousedownToolbar = function(w) {
      w.target.closest("[data-ln-editor-action]") && w.preventDefault();
    }, this._onClickToolbar = function(w) {
      const L = w.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const q = L.getAttribute("data-ln-editor-action");
      n._execAction(q);
    }, this._onPaste = function(w) {
      u(n, w);
    }, this._onKeydown = function(w) {
      e(n, w);
    }, this._onSelectionChange = function() {
      document.contains(n._surface) && n._updateActiveStates();
    }, this._onFocus = function() {
      S(n.dom, "ln-editor:focus", { target: n.dom });
    }, this._onBlur = function() {
      n._syncToTextarea(), S(n.dom, "ln-editor:blur", { target: n.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), A && (A.addEventListener("mousedown", this._onMousedownToolbar), A.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(w) {
      const L = w.detail && w.detail.html;
      L !== void 0 && (n._surface.innerHTML = L, n._syncToTextarea(), S(n.dom, "ln-editor:changed", {
        html: n._textarea.value,
        target: n.dom
      }));
    }, t.addEventListener("ln-editor:set-content", this._onSetContent);
    const E = this._textarea.form;
    return E && (this._onFormReset = function() {
      setTimeout(function() {
        n._surface.innerHTML = n._textarea.value, S(t, "ln-editor:changed", {
          html: n._textarea.value,
          target: t
        });
      }, 0);
    }, E.addEventListener("reset", this._onFormReset)), this;
  }
  m.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, m.prototype._execAction = function(t) {
    if (!(!t || $(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), b[t])
        document.execCommand(b[t], !1, null);
      else if (_[t]) {
        const i = _[t], g = o(this._surface);
        g && g.toLowerCase() === i ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + i + ">");
      } else p[t] ? document.execCommand(p[t], !1, null) : t === "link" ? r(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, m.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const n = window.getSelection();
    if (!n || n.rangeCount === 0) return;
    const i = n.anchorNode;
    if (!i || !this._surface.contains(i)) return;
    const g = t.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < g.length; v++) {
      const A = g[v], E = A.getAttribute("data-ln-editor-action");
      let w = !1;
      if (b[E])
        try {
          w = document.queryCommandState(b[E]);
        } catch {
        }
      else if (_[E]) {
        const L = o(this._surface);
        w = L && L.toLowerCase() === _[E];
      } else if (p[E])
        try {
          w = document.queryCommandState(p[E]);
        } catch {
        }
      else E === "link" && (w = !!l(n.anchorNode, "A", this._surface));
      a(E) && A.setAttribute("aria-pressed", String(w)), w ? A.classList.add("ln-editor-active") : A.classList.remove("ln-editor-active");
    }
  }, m.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, m.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), S(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, m.prototype.destroy = function() {
    if (!this.dom[s]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const t = this.dom.querySelector('[role="toolbar"]');
    t && (t.removeEventListener("mousedown", this._onMousedownToolbar), t.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const n = this._textarea ? this._textarea.form : null;
    n && this._onFormReset && n.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const i = this.dom.querySelector(".ln-editor__link-popover");
    i && i.remove(), S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[s];
  };
  function o(t) {
    const n = window.getSelection();
    if (!n || n.rangeCount === 0) return null;
    let i = n.anchorNode;
    if (!i) return null;
    for (; i && i !== t; ) {
      if (i.nodeType === 1) {
        const g = i.tagName;
        if (g === "H2" || g === "H3" || g === "H4" || g === "BLOCKQUOTE" || g === "PRE" || g === "P")
          return g;
      }
      i = i.parentNode;
    }
    return null;
  }
  function l(t, n, i) {
    for (; t && t !== i; ) {
      if (t.nodeType === 1 && t.tagName === n)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function u(t, n) {
    n.preventDefault();
    let i = "";
    if (n.clipboardData && (i = n.clipboardData.getData("text/html"), !i)) {
      const v = n.clipboardData.getData("text/plain");
      v && (i = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), i = "<p>" + i + "</p>");
    }
    if (!i) return;
    const g = c(i);
    g && document.execCommand("insertHTML", !1, g);
  }
  function c(t) {
    const n = document.createElement("div");
    return n.innerHTML = t, f(n), n.innerHTML;
  }
  function f(t) {
    const n = Array.from(t.childNodes);
    for (let i = 0; i < n.length; i++) {
      const g = n[i];
      if (g.nodeType !== 3) {
        if (g.nodeType !== 1) {
          t.removeChild(g);
          continue;
        }
        if (y[g.tagName]) {
          const v = Array.from(g.attributes);
          for (let A = 0; A < v.length; A++) {
            const E = v[A].name;
            if (g.tagName === "A" && E === "href") {
              const w = g.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(w) || g.removeAttribute("href");
            } else
              g.removeAttribute(E);
          }
          g.tagName === "A" && g.setAttribute("rel", "noopener noreferrer"), f(g);
        } else {
          for (; g.firstChild; )
            t.insertBefore(g.firstChild, g);
          t.removeChild(g);
        }
      }
    }
  }
  function e(t, n) {
    if (!(n.ctrlKey || n.metaKey)) return;
    let i = null;
    switch (n.key.toLowerCase()) {
      case "b":
        i = "bold";
        break;
      case "i":
        i = "italic";
        break;
      case "u":
        i = "underline";
        break;
      case "k":
        i = "link";
        break;
    }
    i && (n.preventDefault(), t._execAction(i));
  }
  function r(t) {
    const n = window.getSelection();
    if (!n || n.rangeCount === 0) return;
    const i = l(n.anchorNode, "A", t._surface), g = n.getRangeAt(0).cloneRange(), v = t.dom.querySelector(".ln-editor__link-popover");
    v && v.remove();
    const A = ft(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!A) return;
    const E = A.firstElementChild;
    if (!E) return;
    const w = E.querySelector('input[type="url"]'), L = E.querySelector('[data-ln-editor-action="confirm-link"]'), q = E.querySelector('[data-ln-editor-action="cancel-link"]');
    i && (w.value = i.getAttribute("href") || "");
    const x = t.dom.querySelector('[role="toolbar"]');
    x ? x.after(E) : t.dom.insertBefore(E, t._surface), w.focus();
    function D() {
      const N = window.getSelection();
      N.removeAllRanges(), N.addRange(g);
    }
    function k() {
      const N = w.value.trim();
      if (E.remove(), D(), t._surface.focus(), N)
        if (i)
          i.setAttribute("href", N), i.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), S(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, N);
          const B = window.getSelection();
          if (B && B.anchorNode) {
            const H = l(B.anchorNode, "A", t._surface);
            H && (H.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else i && document.execCommand("unlink", !1, null);
    }
    function M() {
      E.remove(), D(), t._surface.focus();
    }
    L.addEventListener("click", k), q.addEventListener("click", M), w.addEventListener("keydown", function(N) {
      N.key === "Enter" ? (N.preventDefault(), k()) : N.key === "Escape" && (N.preventDefault(), M());
    });
  }
  U(d, s, m, "ln-editor");
})();
(function() {
  const d = "lnFill";
  if (window[d] !== void 0) return;
  const s = { lnFillForm: !0, lnFillStore: !0 };
  function y(_) {
    const p = {}, h = _.dataset;
    for (const a in h) {
      if (!a.startsWith("lnFill") || s[a]) continue;
      const m = a.slice(6);
      m && (p[m.charAt(0).toLowerCase() + m.slice(1)] = h[a]);
    }
    return p;
  }
  function b(_, p) {
    const h = window.CSS && CSS.escape ? CSS.escape(p) : p, a = document.querySelectorAll('[data-ln-fill-id="' + h + '"]');
    if (a.length === 0) return null;
    for (let m = 0; m < a.length; m++) {
      const o = a[m].getAttribute("data-ln-fill-form");
      if (o) {
        const l = document.getElementById(o);
        if (l && _.contains(l)) return a[m];
      }
    }
    return a[0];
  }
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const p = _.target.closest("[data-ln-fill-form]");
    if (!p) return;
    const h = p.getAttribute("href");
    if (h && h.indexOf("#") !== -1) return;
    const a = p.getAttribute("data-ln-fill-form"), m = document.getElementById(a);
    if (!m) return;
    const o = y(p), l = Object.keys(o).length > 0;
    window.lnCore.lnFill(m, l ? o : null);
  }), document.addEventListener("ln-fill:request", function(_) {
    const p = _.detail;
    if (!p) return;
    const h = _.target, a = p.id;
    if (a == null) {
      window.lnCore.lnFill(h, null);
      return;
    }
    const m = b(h, a);
    if (!m) return;
    const o = y(m);
    window.lnCore.lnFill(h, o);
  }), window[d] = !0;
})();
(function() {
  const d = "data-ln-slug-from", s = "lnSlug";
  if (window[s] !== void 0) return;
  function y(_) {
    return String(_).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function b(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const p = _.form;
    if (!p)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    const h = _.getAttribute(d), a = p.elements[h];
    if (!a)
      return console.warn('[ln-slug] Source field "' + h + '" not found in form:', _), this;
    if (typeof a.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + h + '" is a RadioNodeList (same-name group) — single source field required:', _), this;
    this.dom = _, this.source = a, this._pristine = _.value === "", this._mirroring = !1;
    const m = this;
    return this._onSource = function() {
      m._pristine && m._mirror();
    }, this._onSlug = function() {
      m._mirroring || (m._pristine = m.dom.value === "");
    }, a.addEventListener("input", this._onSource), _.addEventListener("input", this._onSlug), this;
  }
  b.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = y(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, b.prototype.destroy = function() {
    this.dom[s] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[s]);
  }, U(d, s, b, "ln-slug");
})();
(function() {
  const d = "data-ln-time", s = "lnTime";
  if (window[s] !== void 0) return;
  const y = {}, b = {};
  function _(E) {
    return E.getAttribute("data-ln-time-locale") || G(E);
  }
  function p(E, w) {
    const L = (E || "") + "|" + JSON.stringify(w);
    return y[L] || (y[L] = new Intl.DateTimeFormat(E, w)), y[L];
  }
  function h(E) {
    const w = E || "";
    return b[w] || (b[w] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), b[w];
  }
  const a = /* @__PURE__ */ new Set();
  let m = null;
  function o() {
    m || (m = setInterval(u, 6e4));
  }
  function l() {
    m && (clearInterval(m), m = null);
  }
  function u() {
    for (const E of a) {
      if (!document.body.contains(E.dom)) {
        a.delete(E);
        continue;
      }
      n(E);
    }
    a.size === 0 && l();
  }
  function c(E, w) {
    const L = St(w), q = (w || "").toLowerCase().split("-")[0], x = p(w, { dateStyle: "long", timeStyle: "short" }), D = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && D !== q && L.monthsLong) {
      const k = L.monthsLong[E.getMonth()], M = E.getDate(), N = E.getFullYear(), B = String(E.getHours()).padStart(2, "0"), H = String(E.getMinutes()).padStart(2, "0");
      return `${M} ${k} ${N} во ${B}:${H}`;
    }
    return x.format(E);
  }
  function f(E, w) {
    const L = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    E.getFullYear() !== L.getFullYear() && (q.year = "numeric");
    const x = St(w), D = (w || "").toLowerCase().split("-")[0], k = p(w, q), M = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && M !== D && x.monthsShort) {
      const N = x.monthsShort[E.getMonth()], B = E.getDate(), H = E.getFullYear() !== L.getFullYear() ? " " + E.getFullYear() : "";
      return `${B} ${N}${H}`;
    }
    return k.format(E);
  }
  function e(E, w) {
    return p(w, { dateStyle: "medium" }).format(E);
  }
  function r(E, w) {
    return p(w, { timeStyle: "short" }).format(E);
  }
  function t(E, w) {
    const L = Math.floor(Date.now() / 1e3), x = Math.floor(E.getTime() / 1e3) - L, D = Math.abs(x);
    if (D < 10) return h(w).format(0, "second");
    let k, M;
    if (D < 60)
      k = "second", M = x;
    else if (D < 3600)
      k = "minute", M = Math.round(x / 60);
    else if (D < 86400)
      k = "hour", M = Math.round(x / 3600);
    else if (D < 604800)
      k = "day", M = Math.round(x / 86400);
    else if (D < 2592e3)
      k = "week", M = Math.round(x / 604800);
    else
      return f(E, w);
    return h(w).format(M, k);
  }
  function n(E) {
    const w = E.dom.getAttribute("datetime");
    if (!w) return;
    const L = Number(w);
    if (isNaN(L)) return;
    const q = new Date(L * 1e3), x = E.dom.getAttribute(d) || "short", D = _(E.dom);
    let k;
    switch (x) {
      case "relative":
        k = t(q, D);
        break;
      case "full":
        k = c(q, D);
        break;
      case "date":
        k = e(q, D);
        break;
      case "time":
        k = r(q, D);
        break;
      default:
        k = f(q, D);
        break;
    }
    E.dom.textContent = k, x !== "full" && (E.dom.title = c(q, D));
  }
  function i(E) {
    return this.dom = E, n(this), E.getAttribute(d) === "relative" && (a.add(this), o()), this;
  }
  i.prototype.render = function() {
    n(this);
  }, i.prototype.destroy = function() {
    a.delete(this), a.size === 0 && l(), delete this.dom[s];
  };
  function g(E) {
    const w = E[s];
    if (!w) return;
    E.getAttribute(d) === "relative" ? (a.add(w), o()) : (a.delete(w), a.size === 0 && l()), n(w);
  }
  function v(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(d) && E[s] && n(E[s]);
  }
  function A() {
    new MutationObserver(function() {
      const E = document.querySelectorAll("[" + d + "]");
      for (let w = 0; w < E.length; w++) {
        const L = E[w][s];
        L && n(L);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(d, s, i, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: g,
    onInit: v
  }), A();
})();
(function() {
  const d = "data-ln-data-store", s = "lnDataStore";
  if (window[s] !== void 0) return;
  const y = "ln_app_cache", b = "_meta", _ = "1.0";
  let p = null, h = null;
  const a = {};
  function m(C) {
    C && C.name === "QuotaExceededError" && S(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function o() {
    const C = {};
    for (const T of document.querySelectorAll(`[${d}]`)) {
      const I = T.getAttribute(d);
      if (I) {
        const R = T.getAttribute("data-ln-data-store-indexes") || "";
        C[I] = {
          indexes: R.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function l() {
    return h || (h = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), C(null);
      const T = o(), I = Object.keys(T), R = indexedDB.open(y);
      R.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, R.onsuccess = (O) => {
        const P = O.target.result, K = Array.from(P.objectStoreNames);
        if (!(!K.includes(b) || I.some((At) => !K.includes(At))))
          return u(P), p = P, C(P);
        const X = P.version;
        P.close();
        const et = indexedDB.open(y, X + 1);
        et.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, et.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, et.onupgradeneeded = (At) => {
          const dt = At.target.result;
          dt.objectStoreNames.contains(b) || dt.createObjectStore(b, { keyPath: "key" });
          for (const Ft of I)
            if (!dt.objectStoreNames.contains(Ft)) {
              const Ce = dt.createObjectStore(Ft, { keyPath: "id" });
              for (const Xt of T[Ft].indexes)
                Ce.createIndex(Xt, Xt, { unique: !1 });
            }
        }, et.onsuccess = (At) => {
          const dt = At.target.result;
          u(dt), p = dt, C(dt);
        };
      };
    }), h);
  }
  function u(C) {
    C.onversionchange = () => {
      C.close(), p = null, h = null;
    };
  }
  function c() {
    return p ? Promise.resolve(p) : (h = null, l());
  }
  async function f(C) {
    if (!gt() || !C) return C;
    const T = { ...C }, I = T.id, R = await Oe(T);
    return !R || !R.encrypted ? C : {
      id: I,
      encrypted: !0,
      iv: R.iv,
      data: R.data
    };
  }
  async function e(C) {
    return !C || !C.encrypted || !gt() ? C : Me(C);
  }
  const r = (C, T) => c().then((I) => I ? I.transaction(C, T).objectStore(C) : null);
  function t(C) {
    return new Promise((T, I) => {
      C.onsuccess = () => T(C.result), C.onerror = () => {
        m(C.error), I(C.error);
      };
    });
  }
  const n = (C) => r(C, "readonly").then((T) => T ? t(T.getAll()) : []).then((T) => gt() ? Promise.all(T.map((I) => e(I))) : T), i = (C, T) => r(C, "readonly").then((I) => I ? t(I.get(T)) : null).then((I) => I ? e(I) : null), g = (C, T) => (gt() ? f(T) : Promise.resolve(T)).then((R) => r(C, "readwrite").then((O) => O ? t(O.put(R)) : null)), v = (C, T) => r(C, "readwrite").then((I) => I ? t(I.delete(T)) : null), A = (C) => r(C, "readwrite").then((T) => T ? t(T.clear()) : null), E = (C) => r(C, "readonly").then((T) => T ? t(T.count()) : 0), w = (C) => r(b, "readonly").then((T) => T ? t(T.get(C)) : null), L = (C, T) => r(b, "readwrite").then((I) => {
    if (I)
      return T.key = C, t(I.put(T));
  });
  function q(C) {
    this.dom = C, this._name = C.getAttribute(d);
    const T = C.getAttribute("data-ln-data-store-stale"), I = parseInt(T, 10);
    this._staleThreshold = T === "never" || T === "-1" ? -1 : isNaN(I) ? 300 : I;
    const R = C.getAttribute("data-ln-data-store-search-fields") || "";
    return this._searchFields = R.split(",").map((O) => O.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), a[this._name] = this, x(this), this.ready = z(this), this;
  }
  function x(C) {
    C._handlers = {
      create: (T) => D(C, "create", T.detail, () => M(C, T.detail)),
      update: (T) => D(C, "update", T.detail, () => N(C, T.detail)),
      delete: (T) => D(C, "delete", T.detail, () => B(C, T.detail)),
      "bulk-delete": (T) => D(C, "bulk-delete", T.detail, () => H(C, T.detail)),
      "sync-failed": (T) => {
        C.isSyncing = !1, S(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: T.detail && T.detail.error,
          status: T.detail && T.detail.status
        });
      }
    };
    for (const [T, I] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${T}`, I);
  }
  function D(C, T, I, R) {
    const O = I && I.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return R();
    }).catch((P) => j(C, T, O, P)), C._mutationChain;
  }
  function k(C) {
    return E(C._name).then((T) => (C.totalCount = T, C.hasCache = !0, C.isLoaded = !0, L(C._name, {
      schema_version: _,
      last_synced_at: C.lastSyncedAt,
      has_cache: !0,
      record_count: T
    })));
  }
  function M(C, { tempId: T, data: I = {}, requestId: R } = {}) {
    const O = { ...I, id: T };
    return g(C._name, O).then(() => k(C)).then(() => {
      S(C.dom, "ln-data-store:created", { store: C._name, record: O, tempId: T, requestId: R });
    });
  }
  function N(C, { id: T, data: I = {}, requestId: R } = {}) {
    return i(C._name, T).then((O) => {
      if (!O) throw new Error(`Record not found: ${T}`);
      const P = { ...O, ...I }, K = I.id;
      return (K !== void 0 && K !== T ? V(C._name, T, P) : g(C._name, P)).then(() => k(C)).then(() => {
        S(C.dom, "ln-data-store:updated", { store: C._name, record: P, previous: O, requestId: R });
      });
    });
  }
  function B(C, { id: T, requestId: I } = {}) {
    return i(C._name, T).then((R) => {
      if (!R) {
        S(C.dom, "ln-data-store:deleted", { store: C._name, id: T, requestId: I, missing: !0 });
        return;
      }
      return v(C._name, T).then(() => k(C)).then(() => {
        S(C.dom, "ln-data-store:deleted", { store: C._name, id: T, requestId: I });
      });
    });
  }
  function H(C, { ids: T = [], requestId: I } = {}) {
    return T.length ? Promise.all(T.map((R) => i(C._name, R))).then((R) => {
      const O = R.filter(Boolean).map((P) => P.id);
      return F(C._name, O).then(() => k(C)).then(() => {
        S(C.dom, "ln-data-store:deleted", { store: C._name, ids: O, requestId: I });
      });
    }) : (S(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: I }), Promise.resolve());
  }
  function j(C, T, I, R) {
    console.error("[ln-data-store] " + T + " failed:", R), S(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: T,
      requestId: I,
      error: R
    });
  }
  function z(C) {
    return l().then((T) => {
      if (!T) throw new Error("IndexedDB is unavailable");
      return w(C._name);
    }).then((T) => {
      if (C.initializationError = null, T && T.schema_version === _)
        C.lastSyncedAt = T.last_synced_at || null, C.totalCount = T.record_count || 0, C.hasCache = T.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, S(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, S(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (T && T.schema_version !== _)
          return A(C._name).then(() => L(C._name, { schema_version: _, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, S(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, S(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((T) => (C.isInitialized = !0, C.isLoaded = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = T, S(C.dom, "ln-data-store:initialization-error", { store: C._name, error: T }), { ok: !1, error: T }));
  }
  function Z(C) {
    C.isSyncing = !0, S(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function vt(C, T) {
    return c().then((I) => I ? (gt() ? Promise.all(T.map((O) => f(O))) : Promise.resolve(T)).then((O) => new Promise((P, K) => {
      const W = I.transaction(C, "readwrite"), X = W.objectStore(C);
      O.forEach((et) => X.put(et)), W.oncomplete = () => P(), W.onerror = () => {
        m(W.error), K(W.error);
      };
    })) : void 0);
  }
  function F(C, T) {
    return c().then((I) => {
      if (I)
        return new Promise((R, O) => {
          const P = I.transaction(C, "readwrite"), K = P.objectStore(C);
          T.forEach((W) => K.delete(W)), P.oncomplete = () => R(), P.onerror = () => O(P.error);
        });
    });
  }
  function V(C, T, I) {
    return (gt() ? f(I) : Promise.resolve(I)).then((O) => c().then((P) => {
      if (P)
        return new Promise((K, W) => {
          const X = P.transaction(C, "readwrite"), et = X.objectStore(C);
          et.put(O), et.delete(T), X.oncomplete = () => K(), X.onerror = () => {
            m(X.error), W(X.error);
          };
        });
    }));
  }
  const Y = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function wt(C, T) {
    if (!T || !T.field) return C;
    const { field: I, direction: R } = T, O = R === "desc";
    return [...C].sort((P, K) => {
      const W = P[I], X = K[I];
      if (W == null && X == null) return 0;
      if (W == null) return O ? 1 : -1;
      if (X == null) return O ? -1 : 1;
      const et = typeof W == "string" && typeof X == "string" ? Y.compare(W, X) : W < X ? -1 : W > X ? 1 : 0;
      return O ? -et : et;
    });
  }
  function at(C, T) {
    if (!T) return C;
    const I = Object.keys(T).filter((R) => Array.isArray(T[R]) && T[R].length > 0);
    return I.length ? C.filter(
      (R) => I.every((O) => T[O].map(String).includes(String(R[O])))
    ) : C;
  }
  function it(C, T, I) {
    if (!T || !I || !I.length) return C;
    const R = T.toLowerCase();
    return C.filter(
      (O) => I.some((P) => {
        const K = O[P];
        return K != null && String(K).toLowerCase().includes(R);
      })
    );
  }
  function Et(C, T, I) {
    if (!C.length) return 0;
    if (I === "count") return C.length;
    const R = C.map((P) => parseFloat(P[T])).filter((P) => !isNaN(P)), O = R.reduce((P, K) => P + K, 0);
    return I === "sum" ? O : I === "avg" && R.length ? O / R.length : 0;
  }
  function ot(C, T) {
    if (!C.presenters || !C.presenters.computed) return T;
    const I = C.presenters.computed;
    return T.map((R) => {
      const O = { ...R };
      for (const [P, K] of Object.entries(I))
        try {
          O[P] = K(R);
        } catch (W) {
          console.error(`[ln-data-store] Decorator computed field failed for ${P}`, W);
        }
      return O;
    });
  }
  q.prototype.getAll = function(C = {}) {
    const T = this;
    return n(T._name).then((I) => {
      const R = I.length;
      C.filters && (I = at(I, C.filters)), C.search && (I = it(I, C.search, T._searchFields));
      const O = I.length;
      if (C.sort && (I = wt(I, C.sort)), C.offset || C.limit) {
        const P = C.offset || 0, K = C.limit || I.length;
        I = I.slice(P, P + K);
      }
      return {
        data: ot(T, I),
        total: R,
        filtered: O
      };
    });
  }, q.prototype.getById = function(C) {
    return i(this._name, C).then((T) => T ? ot(this, [T])[0] : null);
  }, q.prototype.count = function(C) {
    return C ? n(this._name).then((T) => at(T, C).length) : E(this._name);
  }, q.prototype.aggregate = function(C, T) {
    return n(this._name).then((I) => Et(I, C, T));
  }, q.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, q.prototype.applySync = function(C, T, I, R) {
    R = R || {};
    const O = this;
    let P = Promise.resolve();
    return C.length > 0 && (P = P.then(() => vt(O._name, C))), T.length > 0 && (P = P.then(() => F(O._name, T))), P.then(() => E(O._name)).then((K) => (O.totalCount = R.total !== void 0 ? R.total : K, O.hasCache = !0, L(O._name, {
      schema_version: _,
      last_synced_at: I,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const K = !O.isLoaded;
      O.isLoaded = !0, O.isSyncing = !1, O.lastSyncedAt = I, K ? (S(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: R }), S(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: R })) : S(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: C.length,
        deleted: T.length,
        changed: !0,
        meta: R
      });
    }).catch((K) => {
      O.isSyncing = !1, console.error("[ln-data-store] applySync failed:", K);
    });
  }, q.prototype.applyQuery = function(C, T) {
    T = T || {};
    const I = this;
    let R = Promise.resolve();
    return C.length > 0 && (R = R.then(() => vt(I._name, C))), R.then(() => E(I._name)).then((O) => (I.totalCount = T.total !== void 0 ? T.total : O, ot(I, C))).catch((O) => (console.error("[ln-data-store] applyQuery failed:", O), []));
  }, q.prototype.forceSync = function() {
    this.isSyncing || Z(this);
  }, q.prototype.fullReload = function() {
    const C = this;
    return A(C._name).then(() => L(C._name, {
      schema_version: _,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, Z(C);
    });
  }, q.prototype.destroy = function() {
    if (this._handlers) {
      for (const [C, T] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, T);
      this._handlers = null;
    }
    delete a[this._name], delete this.dom[s], S(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function mt() {
    return c().then((C) => {
      if (!C) return;
      const T = Array.from(C.objectStoreNames);
      return new Promise((I, R) => {
        const O = C.transaction(T, "readwrite");
        T.forEach((P) => O.objectStore(P).clear()), O.oncomplete = () => I(), O.onerror = () => R(O.error);
      });
    }).then(() => {
      Object.values(a).forEach((C) => {
        C.isLoaded = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  U(d, s, q, "ln-data-store"), window[s].clearAll = mt, window[s].init = window[s], window[s].setStorageKey = Zt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Zt);
})();
(function() {
  const d = "data-ln-api-connector", s = "lnApiConnector", y = "lnConnector";
  if (window[s] !== void 0) return;
  function b(a) {
    return a.ok ? a.status === 204 ? null : a.json() : a.json().catch(() => null).then((m) => {
      const o = new Error("HTTP " + a.status + ": " + a.statusText);
      throw o.status = a.status, o.data = m, o;
    });
  }
  function _(a) {
    return this.dom = a, a[s] = this, a[y] = this, this.refreshConfig(), this._handlers = null, p(this), this;
  }
  _.prototype.refreshConfig = function() {
    const a = this.dom;
    this.baseUrl = a.getAttribute("data-ln-api-base-url") || "", this.path = a.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: a.getAttribute("data-ln-api-param-offset") || "offset",
      limit: a.getAttribute("data-ln-api-param-limit") || "limit",
      search: a.getAttribute("data-ln-api-param-search") || "search",
      sortField: a.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: a.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const m = a.getAttribute("data-ln-api-headers") || "";
    this.headers = de(m, "ln-api-connector"), (m.toLowerCase().includes("authorization") || m.toLowerCase().includes("bearer") || m.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(a, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, _.prototype._reqHeaders = function(a) {
    const m = Object.assign({}, yt(this.headers), { "X-LN-Response": "data" });
    return a && (m["Idempotency-Key"] = a), m;
  }, _.prototype.fetchDelta = function(a) {
    const m = this;
    let o = J(m.baseUrl, m.path);
    return a != null && a !== "" && (o += (o.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(a)), window.fetch(o, { method: "GET", headers: m._reqHeaders(), credentials: m.credentials }).then(b);
  }, _.prototype.query = function(a) {
    const m = this;
    a = a || {};
    let o = J(m.baseUrl, m.path);
    const l = m.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, u = new URLSearchParams();
    a.search && u.append(l.search, a.search), a.offset != null && u.append(l.offset, a.offset), a.limit != null && u.append(l.limit, a.limit), a.sort && a.sort.field && a.sort.direction && (u.append(l.sortField, a.sort.field), u.append(l.sortDir, a.sort.direction)), a.filters && typeof a.filters == "object" && Object.keys(a.filters).forEach((f) => {
      const e = a.filters[f];
      Array.isArray(e) && e.length > 0 && u.append(f, e.join(","));
    });
    const c = u.toString();
    return c && (o += (o.indexOf("?") !== -1 ? "&" : "?") + c), window.fetch(o, { method: "GET", headers: m._reqHeaders(), credentials: m.credentials }).then(b);
  }, _.prototype.create = function(a, m, o) {
    const l = this;
    return window.fetch(J(l.baseUrl, m || l.path), {
      method: "POST",
      headers: l._reqHeaders(o),
      credentials: l.credentials,
      body: JSON.stringify(a)
    }).then(b);
  }, _.prototype.update = function(a, m, o, l, u) {
    const c = this;
    o != null && (m = Object.assign({}, m, { expected_version: o }));
    const f = l ? J(c.baseUrl, l) : J(c.baseUrl, c.path, a);
    return window.fetch(f, {
      method: "PUT",
      headers: c._reqHeaders(u),
      credentials: c.credentials,
      body: JSON.stringify(m)
    }).then(b);
  }, _.prototype.delete = function(a, m, o) {
    const l = this;
    return window.fetch(J(l.baseUrl, m || l.path, a), {
      method: "DELETE",
      headers: l._reqHeaders(o),
      credentials: l.credentials
    }).then(b);
  }, _.prototype.bulkDelete = function(a, m, o) {
    const l = this;
    return window.fetch(J(l.baseUrl, m || l.path) + "/bulk-delete", {
      method: "DELETE",
      headers: l._reqHeaders(o),
      credentials: l.credentials,
      body: JSON.stringify({ ids: a })
    }).then(b);
  };
  function p(a) {
    a._handlers = {
      sync: function(o) {
        const l = o.detail || {};
        a.fetchDelta(l.since).then(function(u) {
          S(a.dom, "ln-api-connector:fetched", { data: u, since: l.since, meta: l.meta || null });
        }).catch(function(u) {
          S(a.dom, "ln-api-connector:error", {
            action: "sync",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            since: l.since,
            meta: l.meta || null
          });
        });
      },
      query: function(o) {
        const l = o.detail || {}, u = l.query || l;
        a.query(u).then(function(c) {
          const f = c || {};
          S(a.dom, "ln-api-connector:fetched", {
            data: f.data || (Array.isArray(f) ? f : []),
            total: f.total,
            filtered: f.filtered,
            offset: u.offset,
            queryGen: u.queryGen,
            meta: l.meta || null
          });
        }).catch(function(c) {
          S(a.dom, "ln-api-connector:error", {
            action: "query",
            error: c.message,
            status: c.status || 0,
            data: c.data || null,
            meta: l.meta || null
          });
        });
      },
      create: function(o) {
        const l = o.detail || {};
        a.create(l.data, l.url, l.idempotencyKey).then(function(u) {
          const c = u && u.content !== void 0 ? u.content : u, f = u && u.message ? u.message : null;
          S(a.dom, "ln-api-connector:created", { record: c, tempId: l.tempId, message: f, meta: l.meta || null });
        }).catch(function(u) {
          S(a.dom, "ln-api-connector:error", {
            action: "create",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            tempId: l.tempId,
            meta: l.meta || null
          });
        });
      },
      update: function(o) {
        const l = o.detail || {};
        a.update(l.id, l.data, l.expected_version, l.url, l.idempotencyKey).then(function(u) {
          const c = u && u.content !== void 0 ? u.content : u, f = u && u.message ? u.message : null;
          S(a.dom, "ln-api-connector:updated", { record: c, id: l.id, message: f, meta: l.meta || null });
        }).catch(function(u) {
          S(a.dom, "ln-api-connector:error", {
            action: "update",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: l.id,
            conflictData: u.status === 409 ? u.data : null,
            meta: l.meta || null
          });
        });
      },
      delete: function(o) {
        const l = o.detail || {};
        a.delete(l.id, l.url, l.idempotencyKey).then(function(u) {
          const c = u && u.message ? u.message : null;
          S(a.dom, "ln-api-connector:deleted", { response: u, id: l.id, message: c, meta: l.meta || null });
        }).catch(function(u) {
          S(a.dom, "ln-api-connector:error", {
            action: "delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: l.id,
            meta: l.meta || null
          });
        });
      },
      bulkDelete: function(o) {
        const l = o.detail || {};
        a.bulkDelete(l.ids, l.url, l.idempotencyKey).then(function(u) {
          const c = u && u.message ? u.message : null;
          S(a.dom, "ln-api-connector:bulk-deleted", { response: u, ids: l.ids, message: c, meta: l.meta || null });
        }).catch(function(u) {
          S(a.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            ids: l.ids,
            meta: l.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(o) {
      a.dom.addEventListener(o + ":request-sync", a._handlers.sync), a.dom.addEventListener(o + ":request-query", a._handlers.query), a.dom.addEventListener(o + ":request-fetch", a._handlers.query), a.dom.addEventListener(o + ":request-create", a._handlers.create), a.dom.addEventListener(o + ":request-update", a._handlers.update), a.dom.addEventListener(o + ":request-delete", a._handlers.delete), a.dom.addEventListener(o + ":request-bulk-delete", a._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const a = this;
    a._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(o) {
      a.dom.removeEventListener(o + ":request-sync", a._handlers.sync), a.dom.removeEventListener(o + ":request-query", a._handlers.query), a.dom.removeEventListener(o + ":request-fetch", a._handlers.query), a.dom.removeEventListener(o + ":request-create", a._handlers.create), a.dom.removeEventListener(o + ":request-update", a._handlers.update), a.dom.removeEventListener(o + ":request-delete", a._handlers.delete), a.dom.removeEventListener(o + ":request-bulk-delete", a._handlers.bulkDelete);
    }), a._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[s], delete this.dom[y];
  };
  function h(a) {
    const m = a[s];
    m && m.refreshConfig();
  }
  U(d, s, _, "ln-api-connector", {
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
  const d = "data-ln-couchdb-connector", s = "lnCouchDbConnector", y = "lnConnector";
  if (window[s] !== void 0) return;
  function b(c) {
    const f = c && c.content !== void 0 ? c.content : c, e = c && c.message ? c.message : null;
    return { content: f, message: e };
  }
  function _(c) {
    return this.dom = c, c[s] = this, c[y] = this, this.refreshConfig(), this._handlers = null, l(this), this;
  }
  _.prototype.refreshConfig = function() {
    const c = this.dom;
    this.url = c.getAttribute("data-ln-couchdb-url") || "", this.db = c.getAttribute("data-ln-couchdb-db") || "", this.auth = c.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const f = c.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = de(f, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), f.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(c, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function p(c, f, e) {
    const r = Object.assign({}, yt(c.headers, c.auth), e || {});
    return f && (r["Idempotency-Key"] = f), r;
  }
  _.prototype.fetchDelta = function(c) {
    const f = this, e = ["include_docs=true", "feed=normal"];
    c && e.push("since=" + encodeURIComponent(c));
    const r = J(f.url, f.db, "_changes") + "?" + e.join("&");
    return window.fetch(r, { method: "GET", headers: yt(f.headers, f.auth), credentials: f.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const n = t.results || [];
      return {
        data: n.filter((i) => !i.deleted && i.doc).map((i) => Object.assign({}, i.doc, { id: i.doc._id })),
        deleted: n.filter((i) => i.deleted).map((i) => i.id),
        synced_at: t.last_seq || c || ""
      };
    });
  };
  function h(c, f, e) {
    const r = Object.assign({ _id: f.id }, f);
    return r._id || delete r._id, window.fetch(J(c.url, c.db), {
      method: "POST",
      headers: p(c, e),
      credentials: c.credentials,
      body: JSON.stringify(r)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const n = b(t), i = n.content;
      return { record: Object.assign({}, r, { id: i.id, _id: i.id, _rev: i.rev }), message: n.message };
    });
  }
  _.prototype.create = function(c, f) {
    return h(this, c, f).then((e) => e.record);
  };
  function a(c, f, e, r) {
    const t = Object.assign({ id: String(f), _id: String(f) }, e), n = t._rev || t.rev;
    return (n ? Promise.resolve(n) : window.fetch(J(c.url, c.db, null, f), { method: "GET", headers: yt(c.headers, c.auth), credentials: c.credentials }).then((g) => {
      if (!g.ok) throw new Error("Could not retrieve document for revision mapping");
      return g.json().then((v) => v._rev);
    })).then((g) => {
      const v = Object.assign({}, t, { _rev: g });
      delete v.rev;
      const A = p(c, r, { "If-Match": g });
      return window.fetch(J(c.url, c.db, null, f), {
        method: "PUT",
        headers: A,
        credentials: c.credentials,
        body: JSON.stringify(v)
      }).then((E) => {
        if (E.ok) return E.json().then((w) => {
          const L = b(w);
          return { record: Object.assign({}, v, { _rev: L.content.rev }), message: L.message };
        });
        if (E.status === 409) return E.json().then((w) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = w, L;
        });
        throw new Error("HTTP " + E.status + ": " + E.statusText);
      });
    });
  }
  _.prototype.update = function(c, f, e) {
    return a(this, c, f, e).then((r) => r.record);
  };
  function m(c, f, e, r) {
    return (e ? Promise.resolve(e) : window.fetch(J(c.url, c.db, null, f), { method: "GET", headers: yt(c.headers, c.auth), credentials: c.credentials }).then((n) => {
      if (!n.ok) throw new Error("Could not retrieve document for revision delete");
      return n.json().then((i) => i._rev);
    })).then((n) => {
      const i = J(c.url, c.db, null, f) + "?rev=" + encodeURIComponent(n);
      return window.fetch(i, { method: "DELETE", headers: p(c, r), credentials: c.credentials }).then((g) => {
        if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
        return g.json();
      }).then((g) => {
        const v = b(g);
        return { response: v.content, message: v.message };
      });
    });
  }
  _.prototype.delete = function(c, f, e) {
    return m(this, c, f, e).then((r) => r.response);
  };
  function o(c, f, e) {
    return !f || f.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(J(c.url, c.db, "_all_docs"), {
      method: "POST",
      headers: yt(c.headers, c.auth),
      credentials: c.credentials,
      body: JSON.stringify({ keys: f })
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const n = (r.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return n.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(J(c.url, c.db, "_bulk_docs"), {
        method: "POST",
        headers: p(c, e),
        credentials: c.credentials,
        body: JSON.stringify({ docs: n })
      }).then((i) => {
        if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
        return i.json();
      }).then((i) => {
        const g = b(i);
        return { response: { ok: !0, results: g.content, deletedCount: n.length }, message: g.message };
      });
    });
  }
  _.prototype.bulkDelete = function(c, f) {
    return o(this, c, f).then((e) => e.response);
  };
  function l(c) {
    c._handlers = {
      sync: function(e) {
        const r = e.detail || {};
        c.fetchDelta(r.since).then(function(t) {
          S(c.dom, "ln-couchdb-connector:fetched", { data: t, since: r.since, meta: r.meta || null });
        }).catch(function(t) {
          S(c.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      create: function(e) {
        const r = e.detail || {};
        h(c, r.data, r.idempotencyKey).then(function(t) {
          S(c.dom, "ln-couchdb-connector:created", { record: t.record, tempId: r.tempId, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          S(c.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(e) {
        const r = e.detail || {}, t = Object.assign({}, r.data);
        r.expected_version !== void 0 && (t._rev = r.expected_version), a(c, r.id, t, r.idempotencyKey).then(function(n) {
          S(c.dom, "ln-couchdb-connector:updated", { record: n.record, id: r.id, message: n.message, meta: r.meta || null });
        }).catch(function(n) {
          S(c.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: n.message,
            status: n.status || 0,
            id: r.id,
            data: n.status === 409 ? n.data : null,
            conflictData: n.status === 409 ? n.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(e) {
        const r = e.detail || {};
        m(c, r.id, r.rev, r.idempotencyKey).then(function(t) {
          S(c.dom, "ln-couchdb-connector:deleted", { response: t.response, id: r.id, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          S(c.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(e) {
        const r = e.detail || {};
        o(c, r.ids, r.idempotencyKey).then(function(t) {
          S(c.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: r.ids, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          S(c.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      c.dom.addEventListener(e + ":request-sync", c._handlers.sync), c.dom.addEventListener(e + ":request-fetch", c._handlers.sync), c.dom.addEventListener(e + ":request-create", c._handlers.create), c.dom.addEventListener(e + ":request-update", c._handlers.update), c.dom.addEventListener(e + ":request-delete", c._handlers.delete), c.dom.addEventListener(e + ":request-bulk-delete", c._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const c = this;
    c._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      c.dom.removeEventListener(e + ":request-sync", c._handlers.sync), c.dom.removeEventListener(e + ":request-fetch", c._handlers.sync), c.dom.removeEventListener(e + ":request-create", c._handlers.create), c.dom.removeEventListener(e + ":request-update", c._handlers.update), c.dom.removeEventListener(e + ":request-delete", c._handlers.delete), c.dom.removeEventListener(e + ":request-bulk-delete", c._handlers.bulkDelete);
    }), c._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[s], delete this.dom[y];
  };
  function u(c) {
    const f = c[s];
    f && f.refreshConfig();
  }
  U(d, s, _, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: u
  });
})();
function je(d) {
  return d = d || {}, {
    sort: d.sort,
    filters: d.filters,
    search: d.search,
    offset: d.offset,
    limit: d.limit,
    queryGen: d.queryGen
  };
}
function Ht(d, s, y) {
  const b = !d || !!d.initializationError;
  return s && (y || b || !d.isLoaded) ? "remote" : d && !d.initializationError ? "store" : "none";
}
class Ke {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(s) {
    return s ? this._pending.has(s) ? Promise.reject(new Error(`Duplicate mutation requestId: ${s}`)) : new Promise((y, b) => {
      this._pending.set(s, { resolve: y, reject: b });
    }) : Promise.reject(new Error("Mutation requestId is required"));
  }
  resolve(s) {
    return this._settle(s, !1);
  }
  reject(s) {
    return this._settle(s, !0);
  }
  close(s) {
    const y = s || new Error("Mutation receipt registry closed");
    for (const b of this._pending.values()) b.reject(y);
    this._pending.clear();
  }
  _settle(s, y) {
    const b = s && s.requestId;
    if (!b) return !1;
    const _ = this._pending.get(b);
    return _ ? (this._pending.delete(b), y ? _.reject(s.error || new Error("Store mutation failed")) : _.resolve(s), !0) : !1;
  }
}
(function() {
  const d = "data-ln-data-coordinator", s = "lnDataCoordinator", y = "lnCoordinator", b = "data-ln-form-scope";
  if (window[s] !== void 0) return;
  const _ = /* @__PURE__ */ new Set();
  let p = !1, h = null, a = null, m = null;
  function o() {
    p || (p = !0, h = function() {
      S(document, "ln-data-store:online", {}), _.forEach(function(t) {
        t._maybeSync();
      });
    }, a = function() {
      S(document, "ln-data-store:offline", {});
    }, m = function() {
      document.visibilityState === "visible" && _.forEach(function(t) {
        const n = t.findChildren(), i = n.store;
        i && n.connector && i.isInitialized && !i.initializationError && !i.isSyncing && !t._noAutosync && (!i.hasCache || t._isStale()) && i.forceSync();
      });
    }, window.addEventListener("online", h), window.addEventListener("offline", a), document.addEventListener("visibilitychange", m));
  }
  function l() {
    p && (_.size > 0 || (window.removeEventListener("online", h), window.removeEventListener("offline", a), document.removeEventListener("visibilitychange", m), h = null, a = null, m = null, p = !1));
  }
  function u() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (n) => {
        const i = Math.random() * 16 | 0;
        return (n === "x" ? i : i & 3 | 8).toString(16);
      });
    }
  }
  const c = ["ln-api-connector", "ln-couchdb-connector"];
  function f(t) {
    return this.dom = t, this._name = t.getAttribute(d), t[s] = this, t[y] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Ke(), this._dict = Wt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), e(this), _.add(this), o(), this._checkInitialSync(), this;
  }
  f.prototype._parseStaleAttributes = function() {
    const n = this.findChildren().storeEl, i = this.dom.getAttribute("data-ln-data-coordinator-stale") || (n ? n.getAttribute("data-ln-data-store-stale") : null), g = parseInt(i, 10);
    this._staleThreshold = i === "never" || i === "-1" ? -1 : isNaN(g) ? 300 : g;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (n ? n.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, f.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const n = this.findChildren().store;
    return !n || !n.lastSyncedAt ? !0 : Date.now() / 1e3 - n.lastSyncedAt > this._staleThreshold;
  }, f.prototype._maybeSync = function() {
    const t = this.findChildren(), n = t.store;
    !n || n.initializationError || !t.connector || this._noAutosync || !n.isInitialized || n.isSyncing || (!n.hasCache || this._isStale()) && n.forceSync();
  }, f.prototype._checkInitialSync = function() {
    const t = this, i = this.findChildren().store;
    i && Promise.resolve(i.ready).then(function() {
      const g = t.findChildren(), v = g.store;
      if (v && v.initializationError) {
        t._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !g.connector || t._noAutosync || v.isSyncing || (!v.hasCache || t._isStale()) && v.forceSync();
    }).catch(function(g) {
      t._reportReconciliationError("store-initialize", g, null);
    });
  }, f.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const n = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    n && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(n)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(i) {
      return i;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(i) {
      return i;
    });
  }, f.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), n = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), i = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: n,
      queueEl: i,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: n ? n.lnConnector || n.lnApiConnector || n.lnCouchDbConnector : null,
      queue: i ? i.lnApiQueue : null
    };
  }, f.prototype._handleSubmitRecord = function(t) {
    const n = this.findChildren();
    if (!n.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const i = t.data || {}, g = i.id, v = i.expected_version, A = Object.assign({}, i);
    delete A.id, delete A.expected_version;
    const E = t.method.toUpperCase();
    E === "POST" ? this._fanOutCreate(n, A, t.action) : (E === "PUT" || E === "PATCH") && this._fanOutUpdate(n, g, A, v, t.action);
  }, f.prototype._fanOutCreate = function(t, n, i) {
    this.refreshMapper();
    const g = "_temp_" + u();
    S(t.storeEl, "ln-data-store:request-create", { tempId: g, data: n }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: g,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(n),
      expectedVersion: null,
      meta: { tempId: g, action: i }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(n),
      url: i,
      meta: { entryId: u(), queued: !1, op: "create", tempId: g }
    });
  }, f.prototype._fanOutUpdate = function(t, n, i, g, v) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-update", { id: n, data: i }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: n,
      op: "update",
      targetId: n,
      payload: this.mapper.egress(i),
      expectedVersion: g,
      meta: { id: n, action: v }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-update", {
      id: n,
      data: this.mapper.egress(i),
      expected_version: g,
      url: v,
      meta: { entryId: u(), queued: !1, op: "update", id: n }
    });
  }, f.prototype._fanOutDelete = function(t, n) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-delete", { id: n }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: n,
      op: "delete",
      targetId: n,
      payload: null,
      expectedVersion: null,
      meta: { id: n }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-delete", {
      id: n,
      meta: { entryId: u(), queued: !1, op: "delete", id: n }
    });
  }, f.prototype._fanOutBulkDelete = function(t, n) {
    this.refreshMapper();
    const i = n.join(",");
    S(t.storeEl, "ln-data-store:request-bulk-delete", { ids: n }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: i,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: n },
      expectedVersion: null,
      meta: { bulkKey: i, ids: n }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: n,
      meta: { entryId: u(), queued: !1, op: "bulk-delete", bulkKey: i }
    });
  }, f.prototype._toastFromMessage = function(t) {
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: t.type || "success",
        title: t.title || "",
        message: t.body || ""
      }
    }));
  }, f.prototype._toastFromDict = function(t) {
    const n = this._dict[t];
    n && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: n }
    }));
  }, f.prototype._requestStoreMutation = function(t, n, i) {
    const g = t.storeEl;
    if (!g) return Promise.reject(new Error("Store element not found"));
    const v = u(), A = this._mutationReceipts.wait(v);
    try {
      S(g, "ln-data-store:request-" + n, Object.assign({}, i, { requestId: v }));
    } catch (E) {
      this._mutationReceipts.reject({ requestId: v, error: E });
    }
    return A;
  }, f.prototype._reportReconciliationError = function(t, n, i) {
    S(this.dom, "ln-data-coordinator:error", {
      operation: t,
      error: n,
      meta: i || null
    });
  };
  function e(t) {
    t._handlers = {
      sync: function(n) {
        t.refreshMapper();
        const i = t.findChildren();
        if (!i.store || !i.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        S(i.connectorEl, "ln-api-connector:request-sync", { since: n.detail.since, meta: { op: "sync" } });
      },
      reqCreate: function(n) {
        const i = t.findChildren();
        i.storeEl && t._fanOutCreate(i, n.detail.data || {}, n.detail.action);
      },
      reqUpdate: function(n) {
        const i = t.findChildren();
        i.storeEl && t._fanOutUpdate(i, n.detail.id, n.detail.data || {}, n.detail.expected_version, n.detail.action);
      },
      reqDelete: function(n) {
        const i = t.findChildren();
        i.storeEl && t._fanOutDelete(i, n.detail.id);
      },
      reqBulkDelete: function(n) {
        const i = t.findChildren();
        i.storeEl && t._fanOutBulkDelete(i, n.detail.ids || []);
      },
      queueFailed: function() {
        t._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(n) {
        t.refreshMapper();
        const i = t.findChildren();
        if (!i.store || !i.connector || !i.queue) return;
        const g = n.detail || {}, v = g.entryId, A = g.op, E = g.targetId, w = g.payload, L = g.expectedVersion, q = g.meta || {}, x = q.action || null, D = g.idempotencyKey || v;
        A === "create" ? S(i.connectorEl, "ln-api-connector:request-create", {
          data: w,
          url: x,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "create", tempId: q.tempId }
        }) : A === "update" ? S(i.connectorEl, "ln-api-connector:request-update", {
          id: E,
          data: w,
          expected_version: L,
          url: x,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "update", id: E }
        }) : A === "delete" ? S(i.connectorEl, "ln-api-connector:request-delete", {
          id: E,
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "delete", id: E }
        }) : A === "bulk-delete" ? S(i.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: w && w.ids ? w.ids : [],
          idempotencyKey: D,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", A);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(n) {
        const i = n.target;
        if (n.defaultPrevented) return;
        const g = i.hasAttribute(b) ? i.getAttribute(b) : null;
        if (g === null) return;
        let v;
        if (g ? v = g === t._name : v = i.closest("[data-ln-data-coordinator]") === t.dom, !v) return;
        const A = qe(i);
        if (A !== "POST" && A !== "PUT" && A !== "PATCH") return;
        n.preventDefault();
        const E = se(i);
        delete E._method, delete E._token, t._handleSubmitRecord({ data: E, method: A, action: i.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(n) {
        const i = n.detail.meta || {}, g = t.findChildren();
        t.refreshMapper();
        const v = n.detail.data;
        let A = [], E = [], w = null;
        Array.isArray(v) ? (A = v, w = Math.floor(Date.now() / 1e3)) : v && (A = Array.isArray(v.data) ? v.data : [], E = Array.isArray(v.deleted) ? v.deleted : [], w = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const L = A.map((q) => t.mapper.ingress(q));
        if (g.store && !g.store.initializationError)
          i.kind ? i.kind === "table" || i.kind === "list" ? g.store.applyQuery(L, { total: n.detail.total }).then(function(q) {
            S(i.targetEl, "ln-" + i.kind + ":set-loading", { loading: !1 }), S(i.targetEl, "ln-" + i.kind + ":set-data", {
              data: q,
              total: n.detail.total !== void 0 ? n.detail.total : q.length,
              filtered: n.detail.filtered !== void 0 ? n.detail.filtered : q.length,
              offset: n.detail.offset,
              queryGen: n.detail.queryGen
            }), t._boundDelivered.set(i.targetEl, !0);
          }) : i.kind === "options" ? g.store.applyQuery(L, { total: n.detail.total }).then(function() {
            return g.store.getAll({});
          }).then(function(q) {
            S(i.targetEl, "ln-options:set-data", { data: q.data });
          }) : i.kind === "stat" && g.store.applyQuery(L, { total: n.detail.total }).then(function() {
            const q = n.detail.filtered !== void 0 ? n.detail.filtered : n.detail.total !== void 0 ? n.detail.total : L.length;
            S(i.targetEl, "ln-stat:set-count", { count: q });
          }) : g.store.applySync(L, E, w || Math.floor(Date.now() / 1e3), {
            total: n.detail.total,
            filtered: n.detail.filtered,
            offset: n.detail.offset,
            queryGen: n.detail.queryGen,
            targetEl: i.targetEl
          });
        else if (i.targetEl && i.kind) {
          if (i.kind === "table" || i.kind === "list")
            S(i.targetEl, "ln-" + i.kind + ":set-loading", { loading: !1 }), S(i.targetEl, "ln-" + i.kind + ":set-data", {
              data: L,
              total: n.detail.total !== void 0 ? n.detail.total : L.length,
              filtered: n.detail.filtered !== void 0 ? n.detail.filtered : L.length,
              offset: n.detail.offset,
              queryGen: n.detail.queryGen
            }), t._boundDelivered.set(i.targetEl, !0);
          else if (i.kind === "options")
            S(i.targetEl, "ln-options:set-data", { data: L });
          else if (i.kind === "stat") {
            const q = n.detail.filtered !== void 0 ? n.detail.filtered : n.detail.total !== void 0 ? n.detail.total : L.length;
            S(i.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(n) {
        const i = t.findChildren();
        if (!i.storeEl) return;
        const g = n.detail.meta || {}, v = t.mapper.ingress(n.detail.record);
        t._requestStoreMutation(i, "update", { id: g.tempId, data: v }).then(function() {
          t._toastFromMessage(n.detail.message), g.queued && i.queue && S(i.queueEl, "ln-api-queue:resolve-create", {
            entryId: g.entryId,
            oldKey: g.tempId,
            newId: v.id
          });
        }).catch(function(A) {
          t._reportReconciliationError("create-reconcile", A, g);
        });
      },
      connUpdated: function(n) {
        const i = t.findChildren();
        if (!i.storeEl) return;
        const g = n.detail.meta || {}, v = t.mapper.ingress(n.detail.record);
        t._requestStoreMutation(i, "update", { id: g.id, data: v }).then(function() {
          t._toastFromMessage(n.detail.message), g.queued && i.queue && S(i.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
        }).catch(function(A) {
          t._reportReconciliationError("update-reconcile", A, g);
        });
      },
      connDeleted: function(n) {
        const i = t.findChildren();
        if (!i.storeEl) return;
        const g = n.detail.meta || {};
        t._toastFromMessage(n.detail.message), g.queued && i.queue && S(i.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
      },
      connBulkDeleted: function(n) {
        const i = t.findChildren();
        if (!i.storeEl) return;
        const g = n.detail.meta || {};
        t._toastFromMessage(n.detail.message), g.queued && i.queue && S(i.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
      },
      connError: function(n) {
        const i = n.detail || {}, g = i.meta || {}, v = g.op || i.action, A = i.status || 0, E = t.findChildren();
        if (v === "sync") {
          E.storeEl && S(E.storeEl, "ln-data-store:request-sync-failed", {
            error: i.error,
            status: A
          }), console.error("[ln-data-coordinator] Sync failed:", i.error);
          return;
        }
        if (v === "query") {
          g.targetEl && g.kind && (S(g.targetEl, "ln-" + g.kind + ":set-loading", { loading: !1 }), (g.kind === "table" || g.kind === "list") && S(g.targetEl, "ln-" + g.kind + ":page-failed", { offset: g.offset })), t._reportReconciliationError("query", i.error || i, g);
          return;
        }
        if (!E.storeEl) return;
        const w = A === 401 || A === 419, L = A === 0 || A >= 500, q = A === 409;
        if (w) {
          t._toastFromDict("auth"), g.queued && E.queue && S(E.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "auth" });
          return;
        }
        if (L) {
          g.queued && E.queue ? S(E.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (q && v === "update") {
          const D = i.data && i.data.remote ? t.mapper.ingress(i.data.remote) : null;
          D && (x = t._requestStoreMutation(E, "update", { id: g.id, data: D })), t._toastFromDict("conflict");
        } else v === "create" && (x = t._requestStoreMutation(E, "delete", { id: g.tempId })), t._toastFromDict("rejected");
        g.queued && E.queue ? x.then(function() {
          S(E.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "drop" });
        }).catch(function(D) {
          t._reportReconciliationError("deterministic-reconcile", D, g);
        }) : x.catch(function(D) {
          t._reportReconciliationError("deterministic-reconcile", D, g);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(n) {
        const i = t.findChildren(), g = i.store;
        if (!g || g.initializationError || !i.connector || t._noAutosync || g.isSyncing) return;
        (n.detail || {}).hasCache ? t._isStale() && g.forceSync() : g.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(n) {
        t._serveData(n, "table");
      },
      reqListData: function(n) {
        t._serveData(n, "list");
      },
      reqOptions: function(n) {
        t._serveOptions(n);
      },
      reqStat: function(n) {
        t._serveStat(n);
      },
      refresh: function(n) {
        t._mutationReceipts.resolve(n.detail), t._refreshAll();
      },
      mutationError: function(n) {
        t._mutationReceipts.reject(n.detail);
      },
      refreshSynced: function(n) {
        n.detail && n.detail.changed && t._refreshAll(n.detail.meta);
      }
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), c.forEach(function(n) {
      t.dom.addEventListener(n + ":fetched", t._handlers.connFetched), t.dom.addEventListener(n + ":created", t._handlers.connCreated), t.dom.addEventListener(n + ":updated", t._handlers.connUpdated), t.dom.addEventListener(n + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(n + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(n + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced);
  }
  f.prototype._ownsStore = function(t) {
    const n = this.findChildren();
    return !!(n.store && n.store._name === t && t || this._name === t && t);
  }, f.prototype._serveData = function(t, n) {
    const i = t.target, g = n === "table" ? "data-ln-table-store" : "data-ln-list-store", v = i.getAttribute(g) || i.getAttribute("data-ln-table-source") || i.getAttribute("data-ln-list-source");
    if (!v || !this._ownsStore(v)) return;
    const A = t.detail || {}, E = je(A);
    this._boundQueries.set(i, E);
    const w = this.findChildren(), L = this, q = A.offset != null, x = w.store;
    return (x && x.ready ? x.ready : Promise.resolve()).then(function() {
      const k = Ht(x, w.connector, q);
      if (k === "remote") {
        S(i, "ln-" + n + ":set-loading", { loading: !0 }), S(w.connectorEl, "ln-api-connector:request-query", {
          query: E,
          meta: { targetEl: i, kind: n, offset: E.offset, limit: E.limit }
        });
        return;
      }
      if (k !== "store") {
        S(i, "ln-" + n + ":set-loading", { loading: !1 });
        return;
      }
      return x.getAll(E).then(function(M) {
        const N = {
          data: M.data,
          total: M.total,
          filtered: M.filtered,
          offset: A.offset !== void 0 ? A.offset : M.offset,
          queryGen: A.queryGen !== void 0 ? A.queryGen : M.queryGen
        };
        S(i, "ln-" + n + ":set-data", N), L._boundDelivered.set(i, !0);
      });
    }).catch(function(k) {
      S(i, "ln-" + n + ":set-loading", { loading: !1 }), S(L.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: n,
        store: v,
        target: i,
        error: k
      });
    });
  }, f.prototype._serveOptions = function(t) {
    const n = t.target, i = n.getAttribute("data-ln-options");
    if (!this._ownsStore(i)) return;
    const g = this.findChildren(), v = g.store, A = v && v.ready ? v.ready : Promise.resolve(), E = this;
    return A.then(function() {
      const w = Ht(v, g.connector, !1);
      if (w === "remote") {
        S(g.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: n, kind: "options" }
        });
        return;
      }
      if (w === "store")
        return v.getAll({}).then(function(L) {
          S(n, "ln-options:set-data", { data: L.data });
        });
    }).catch(function(w) {
      E._reportReconciliationError("options-query", w, { targetEl: n, kind: "options" });
    });
  }, f.prototype._serveStat = function(t) {
    const n = t.target, i = n.getAttribute("data-ln-stat");
    if (!this._ownsStore(i)) return;
    const g = t.detail && t.detail.filters ? t.detail.filters : null, v = this.findChildren(), A = v.store, E = A && A.ready ? A.ready : Promise.resolve(), w = this;
    return E.then(function() {
      const L = Ht(A, v.connector, !1);
      if (L === "remote") {
        S(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: g },
          meta: { targetEl: n, kind: "stat" }
        });
        return;
      }
      if (L === "store")
        return A.count(g).then(function(q) {
          S(n, "ln-stat:set-count", { count: q });
        });
    }).catch(function(L) {
      w._reportReconciliationError("stat-query", L, { targetEl: n, kind: "stat" });
    });
  }, f.prototype._refreshAll = function(t) {
    const n = this, i = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let g = 0; g < i.length; g++) {
      const v = i[g];
      let A, E;
      if (v.hasAttribute("data-ln-table-store") ? (A = v.getAttribute("data-ln-table-store"), E = "table") : v.hasAttribute("data-ln-list-store") ? (A = v.getAttribute("data-ln-list-store"), E = "list") : v.hasAttribute("data-ln-options") ? (A = v.getAttribute("data-ln-options"), E = "options") : v.hasAttribute("data-ln-stat") && (A = v.getAttribute("data-ln-stat"), E = "stat"), !this._ownsStore(A)) continue;
      const w = this.findChildren().store;
      if (E === "table" || E === "list") {
        const L = E === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (v.hasAttribute(L)) {
          S(v, "ln-" + E + ":request-revalidate", {});
          continue;
        }
        const q = n._boundQueries.get(v) || { sort: null, filters: {}, search: "" };
        (function(x, D) {
          w.getAll(q).then(function(k) {
            const M = {
              data: k.data,
              total: t && t.total !== void 0 ? t.total : k.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : k.filtered,
              offset: t && t.offset !== void 0 ? t.offset : q.offset,
              queryGen: t && t.queryGen !== void 0 ? t.queryGen : q.queryGen
            };
            S(x, "ln-" + D + ":set-loading", { loading: !1 }), S(x, "ln-" + D + ":set-data", M), n._boundDelivered.set(x, !0);
          });
        })(v, E);
      } else if (E === "options")
        (function(L) {
          w.getAll({}).then(function(q) {
            S(L, "ln-options:set-data", { data: q.data });
          });
        })(v);
      else if (E === "stat") {
        const L = v.getAttribute("data-ln-stat-filter");
        let q = null;
        if (L) {
          const x = L.indexOf(":");
          if (x !== -1) {
            const D = L.slice(0, x), k = L.slice(x + 1);
            q = {}, q[D] = [k];
          }
        }
        (function(x, D) {
          w.count(D).then(function(k) {
            S(x, "ln-stat:set-count", { count: k });
          });
        })(v, q);
      }
    }
  }, f.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), c.forEach(function(n) {
      t.dom.removeEventListener(n + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(n + ":created", t._handlers.connCreated), t.dom.removeEventListener(n + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(n + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(n + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(n + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, _.delete(this), l(), delete this.dom[s], delete this.dom[y];
  };
  function r(t, n) {
    const i = t[s];
    i && n === "data-ln-data-mapper" && i.refreshMapper();
  }
  U(d, s, f, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: r
  });
})();
const Ve = "ln_api_queue", We = 2, Q = "outbox", tt = "_queue_meta";
function nt(d, s) {
  return d.error || new Error(s);
}
function bt(d, s) {
  return d.bound([s, -1 / 0], [s, 1 / 0]);
}
function ie(d) {
  return "seq:" + d;
}
function Tt(d) {
  return "paused:" + d;
}
function re(d) {
  d.leaseOwner = null, d.leaseUntil = 0;
}
function Ge(d, s, y) {
  return typeof d != "string" || d.indexOf(s) === -1 ? d : d.split(s).join(y);
}
function Qe(d, s, y, b) {
  const _ = /* @__PURE__ */ new Map(), p = [], h = [];
  for (const a of d || [])
    _.has(a.chainKey) || _.set(a.chainKey, []), _.get(a.chainKey).push(a);
  return _.forEach((a, m) => {
    a.sort((l, u) => l.seq - u.seq);
    const o = a[0];
    if (!(!o || o.status === "failed")) {
      if (o.status === "inflight" && (o.leaseUntil || 0) > b) {
        h.push({ chainKey: m, at: o.leaseUntil });
        return;
      }
      if ((o.nextAttemptAt || 0) > b) {
        h.push({ chainKey: m, at: o.nextAttemptAt });
        return;
      }
      o.status = "inflight", o.leaseOwner = s, o.leaseUntil = b + y, o.updatedAt = b, p.push(o);
    }
  }), { entries: p, wakeups: h };
}
function $e(d, s, y, b, _) {
  const p = [], h = [];
  for (const a of d || []) {
    if (a.entryId === s) {
      h.push(a.entryId);
      continue;
    }
    a.chainKey === y && (a.chainKey = b, a.targetId === y && (a.targetId = b), a.meta && a.meta.id === y && (a.meta.id = b), a.meta && typeof a.meta.action == "string" && (a.meta.action = Ge(a.meta.action, y, b)), a.updatedAt = _, p.push(a));
  }
  return { changed: p, deleted: h };
}
class Ye {
  constructor(s) {
    s = s || {}, this.indexedDB = s.indexedDB || globalThis.indexedDB, this.keyRange = s.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = s.dbName || Ve, this.now = s.now || (() => Date.now()), this.uuid = s.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((s, y) => {
      const b = this.indexedDB.open(this.dbName, We);
      b.onupgradeneeded = (_) => {
        const p = _.target.result;
        let h;
        p.objectStoreNames.contains(Q) ? h = _.target.transaction.objectStore(Q) : h = p.createObjectStore(Q, { keyPath: "entryId" }), h.indexNames.contains("by_scope_chain") || h.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), h.indexNames.contains("by_scope_seq") || h.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), p.objectStoreNames.contains(tt) || p.createObjectStore(tt, { keyPath: "key" });
      }, b.onerror = () => y(nt(b, "Queue database open failed")), b.onsuccess = (_) => {
        this._db = _.target.result, this._db.onversionchange = () => this.close(), s(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((s, y) => {
      const b = this.indexedDB.deleteDatabase(this.dbName);
      b.onsuccess = () => s(), b.onerror = () => y(nt(b, "Queue database delete failed")), b.onblocked = () => y(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(s) {
    return this.open().then((y) => y ? new Promise((b, _) => {
      const h = y.transaction(Q, "readonly").objectStore(Q).index("by_scope_seq").getAll(bt(this.keyRange, s));
      h.onsuccess = () => b(h.result || []), h.onerror = () => _(nt(h, "Queue scope read failed"));
    }) : []);
  }
  enqueue(s, y) {
    return y = y || {}, this.open().then((b) => b ? new Promise((_, p) => {
      const h = b.transaction([tt, Q], "readwrite"), a = h.objectStore(tt), m = h.objectStore(Q), o = ie(s);
      let l = null;
      const u = (f) => {
        const e = f + 1;
        l = {
          entryId: this.uuid(),
          scope: s,
          chainKey: y.chainKey,
          seq: e,
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
        }, a.put({ key: o, value: e }), m.put(l);
      }, c = a.get(o);
      c.onerror = () => p(nt(c, "Queue sequence read failed")), c.onsuccess = () => {
        const f = c.result;
        if (f && typeof f.value == "number") {
          u(f.value);
          return;
        }
        const e = m.index("by_scope_seq").getAll(bt(this.keyRange, s));
        e.onerror = () => p(nt(e, "Queue sequence migration failed")), e.onsuccess = () => {
          const r = (e.result || []).reduce((t, n) => Math.max(t, n.seq || 0), 0);
          u(r);
        };
      }, h.oncomplete = () => _(l), h.onerror = () => p(h.error || new Error("Queue enqueue transaction failed")), h.onabort = () => p(h.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(s, y, b) {
    return this.open().then((_) => _ ? new Promise((p, h) => {
      const a = _.transaction(Q, "readwrite"), m = a.objectStore(Q), o = m.index("by_scope_seq").getAll(bt(this.keyRange, s)), l = this.now();
      let u = { entries: [], wakeups: [] };
      o.onerror = () => h(nt(o, "Queue claim read failed")), o.onsuccess = () => {
        u = Qe(o.result || [], y, b, l);
        for (const c of u.entries) m.put(c);
      }, a.oncomplete = () => p(u), a.onerror = () => h(a.error || new Error("Queue claim transaction failed")), a.onabort = () => h(a.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(s, y) {
    return this._updateEntry(s, y, (b, _) => (_.delete(b.entryId), { status: "acked", entry: b }));
  }
  nack(s, y, b, _) {
    _ = _ || {};
    const p = _.maxAttempts || 8, h = _.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((a) => a ? new Promise((m, o) => {
      const l = a.transaction([Q, tt], "readwrite"), u = l.objectStore(Q), c = l.objectStore(tt), f = u.get(y);
      let e = null;
      f.onerror = () => o(nt(f, "Queue nack read failed")), f.onsuccess = () => {
        const r = f.result;
        if (!(!r || r.scope !== s)) {
          if (b === "drop") {
            u.delete(r.entryId), e = { status: "dropped", entry: r };
            return;
          }
          if (re(r), r.updatedAt = this.now(), b === "auth") {
            r.status = "pending", u.put(r), c.put({ key: Tt(s), value: !0 }), e = { status: "auth", entry: r };
            return;
          }
          if (b === "retry") {
            if (r.attempts = (r.attempts || 0) + 1, r.attempts >= p) {
              r.status = "failed", r.nextAttemptAt = 0, u.put(r), e = { status: "failed", entry: r };
              return;
            }
            const t = h[Math.min(r.attempts - 1, h.length - 1)];
            r.status = "pending", r.nextAttemptAt = this.now() + t, u.put(r), e = { status: "retry", entry: r, delay: t };
          }
        }
      }, l.oncomplete = () => m(e), l.onerror = () => o(l.error || new Error("Queue nack transaction failed")), l.onabort = () => o(l.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(s, y, b) {
    return this._remapTransaction(s, null, y, b);
  }
  resolveCreate(s, y, b, _) {
    return this._remapTransaction(s, y, b, _);
  }
  _remapTransaction(s, y, b, _) {
    return this.open().then((p) => p ? new Promise((h, a) => {
      const m = p.transaction(Q, "readwrite"), o = m.objectStore(Q), l = o.index("by_scope_seq").getAll(bt(this.keyRange, s));
      let u = { changed: [], deleted: [] };
      l.onerror = () => a(nt(l, "Queue remap read failed")), l.onsuccess = () => {
        u = $e(l.result || [], y, b, _, this.now());
        for (const c of u.deleted) o.delete(c);
        for (const c of u.changed) o.put(c);
      }, m.oncomplete = () => h(u.changed), m.onerror = () => a(m.error || new Error("Queue remap transaction failed")), m.onabort = () => a(m.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(s) {
    return this.open().then((y) => y ? new Promise((b, _) => {
      const p = y.transaction(Q, "readwrite"), h = p.objectStore(Q), a = h.index("by_scope_seq").getAll(bt(this.keyRange, s));
      let m = 0;
      a.onerror = () => _(nt(a, "Queue failed-entry read failed")), a.onsuccess = () => {
        for (const o of a.result || [])
          o.status === "failed" && (o.status = "pending", o.attempts = 0, o.nextAttemptAt = 0, o.updatedAt = this.now(), re(o), h.put(o), m++);
      }, p.oncomplete = () => b(m), p.onerror = () => _(p.error || new Error("Queue failed-entry reset failed")), p.onabort = () => _(p.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(s) {
    return this.open().then((y) => y ? new Promise((b, _) => {
      const h = y.transaction(tt, "readonly").objectStore(tt).get(Tt(s));
      h.onsuccess = () => b(!!(h.result && h.result.value)), h.onerror = () => _(nt(h, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(s, y) {
    return this.open().then((b) => {
      if (b)
        return new Promise((_, p) => {
          const h = b.transaction(tt, "readwrite");
          h.objectStore(tt).put({ key: Tt(s), value: !!y }), h.oncomplete = () => _(), h.onerror = () => p(h.error || new Error("Queue pause-state write failed")), h.onabort = () => p(h.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(s) {
    return this.open().then((y) => {
      if (y)
        return new Promise((b, _) => {
          const p = y.transaction([Q, tt], "readwrite"), a = p.objectStore(Q).index("by_scope_seq").openCursor(bt(this.keyRange, s));
          a.onsuccess = (m) => {
            const o = m.target.result;
            o && (o.delete(), o.continue());
          }, a.onerror = () => _(nt(a, "Queue clear failed")), p.objectStore(tt).delete(ie(s)), p.objectStore(tt).delete(Tt(s)), p.oncomplete = () => b(), p.onerror = () => _(p.error || new Error("Queue clear transaction failed")), p.onabort = () => _(p.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(s, y, b) {
    return this.open().then((_) => _ ? new Promise((p, h) => {
      const a = _.transaction(Q, "readwrite"), m = a.objectStore(Q), o = m.get(y);
      let l = null;
      o.onerror = () => h(nt(o, "Queue entry read failed")), o.onsuccess = () => {
        const u = o.result;
        !u || u.scope !== s || (l = b(u, m));
      }, a.oncomplete = () => p(l), a.onerror = () => h(a.error || new Error("Queue entry transaction failed")), a.onabort = () => h(a.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const d = "data-ln-api-queue", s = "lnApiQueue", y = [2e3, 5e3, 15e3, 6e4, 3e5], b = 8, _ = 6e4;
  if (window[s] !== void 0) return;
  function p() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (l) => {
        const u = Math.random() * 16 | 0;
        return (l === "x" ? u : u & 3 | 8).toString(16);
      });
    }
  }
  const h = new Ye({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: p
  });
  function a(o) {
    this.dom = o, o[s] = this;
    const l = o.closest("[data-ln-data-coordinator]");
    this.scope = o.getAttribute(d) || (l ? l.getAttribute("data-ln-data-coordinator") : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = p(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const u = this;
    return h.open().then((c) => c ? h.getPaused(u.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((c) => (u._paused = !!c, u._paused && S(u.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), u._emitPendingCount())).then(() => u._drain()).catch((c) => {
      console.error("[ln-api-queue] Initialization failed:", c), S(u.dom, "ln-api-queue:error", { operation: "initialize", error: c });
    }), this;
  }
  a.prototype._isOnline = function() {
    const o = this.dom.getAttribute("data-ln-api-queue-online");
    return o === "true" ? !0 : o === "false" ? !1 : navigator.onLine;
  }, a.prototype._emitPendingCount = function() {
    const o = this;
    return h.allForScope(o.scope).then((l) => (S(o.dom, "ln-api-queue:pending-count", { count: l.length, scope: o.scope }), l.length === 0 && S(o.dom, "ln-api-queue:drained", { scope: o.scope }), l));
  }, a.prototype._clearTimer = function(o) {
    const l = this._timers.get(o);
    l && (clearTimeout(l), this._timers.delete(o));
  }, a.prototype._scheduleTimer = function(o, l) {
    const u = Math.max(0, l), c = this._timers.get(o);
    c && clearTimeout(c);
    const f = this, e = setTimeout(() => {
      f._timers.delete(o), f._drain();
    }, u);
    this._timers.set(o, e);
  }, a.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = h.claimReady(o.scope, o._workerId, _).then((l) => {
      for (const u of l.wakeups)
        o._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of l.entries)
        o._clearTimer(u.chainKey), S(o.dom, "ln-api-queue:send", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          op: u.op,
          targetId: u.targetId,
          payload: u.payload,
          expectedVersion: u.expectedVersion,
          idempotencyKey: u.entryId,
          meta: u.meta
        });
    }).catch((l) => {
      console.error("[ln-api-queue] Drain failed:", l), S(o.dom, "ln-api-queue:error", { operation: "drain", error: l });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, a.prototype._onEnqueue = function(o) {
    const l = this;
    return h.enqueue(l.scope, o.detail || {}).then((u) => {
      if (u)
        return l._emitPendingCount().then((c) => (S(l.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: c.length
        }), l._drain()));
    }).catch((u) => {
      S(l.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, a.prototype._onAck = function(o) {
    const l = this, u = o.detail || {};
    return h.ack(l.scope, u.entryId).then(() => l._emitPendingCount()).then(() => l._drain()).catch((c) => {
      S(l.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: c });
    });
  }, a.prototype._onNack = function(o) {
    const l = this, u = o.detail || {};
    return h.nack(l.scope, u.entryId, u.reason, {
      maxAttempts: b,
      backoff: y
    }).then((c) => {
      if (c)
        return c.status === "failed" ? S(l.dom, "ln-api-queue:failed", {
          entryId: c.entry.entryId,
          chainKey: c.entry.chainKey,
          attempts: c.entry.attempts
        }) : c.status === "retry" ? l._scheduleTimer(c.entry.chainKey, c.delay) : c.status === "auth" && (l._paused = !0, S(l.dom, "ln-api-queue:paused", { reason: "auth" }), S(l.dom, "ln-api-queue:auth-required", {
          entryId: c.entry.entryId,
          chainKey: c.entry.chainKey
        })), l._emitPendingCount().then(() => {
          if (c.status === "dropped") return l._drain();
        });
    }).catch((c) => {
      S(l.dom, "ln-api-queue:error", { operation: "nack", entryId: u.entryId, error: c });
    });
  }, a.prototype._onRemap = function(o) {
    const l = this, u = o.detail || {};
    return h.remap(l.scope, u.oldKey, u.newId).catch((c) => {
      S(l.dom, "ln-api-queue:error", { operation: "remap", error: c });
    });
  }, a.prototype._onResolveCreate = function(o) {
    const l = this, u = o.detail || {};
    return h.resolveCreate(l.scope, u.entryId, u.oldKey, u.newId).then(() => l._emitPendingCount()).then(() => l._drain()).catch((c) => {
      S(l.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
        error: c
      });
    });
  }, a.prototype._onResume = function() {
    const o = this;
    return h.setPaused(o.scope, !1).then(() => (o._paused = !1, S(o.dom, "ln-api-queue:resumed", {}), o._drain())).catch((l) => {
      S(o.dom, "ln-api-queue:error", { operation: "resume", error: l });
    });
  }, a.prototype._onDrain = function() {
    const o = this;
    return h.resetFailed(o.scope).then(() => {
      const l = o._drainPromise;
      return l ? l.then(() => o._drain()) : o._drain();
    }).catch((l) => {
      S(o.dom, "ln-api-queue:error", { operation: "manual-drain", error: l });
    });
  }, a.prototype._onClear = function() {
    const o = this;
    return o._timers.forEach((l) => clearTimeout(l)), o._timers.clear(), h.clear(o.scope).then(() => {
      o._paused = !1, S(o.dom, "ln-api-queue:pending-count", { count: 0, scope: o.scope }), S(o.dom, "ln-api-queue:drained", { scope: o.scope });
    }).catch((l) => {
      S(o.dom, "ln-api-queue:error", { operation: "clear", error: l });
    });
  }, a.prototype._bindEvents = function() {
    const o = this;
    o._handlers = {
      enqueue: (l) => o._onEnqueue(l),
      ack: (l) => o._onAck(l),
      nack: (l) => o._onNack(l),
      remap: (l) => o._onRemap(l),
      resolveCreate: (l) => o._onResolveCreate(l),
      resume: () => o._onResume(),
      drain: () => o._onDrain(),
      clear: () => o._onClear()
    }, o.dom.addEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.addEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.addEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.addEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.addEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.addEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.addEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.addEventListener("ln-api-queue:request-clear", o._handlers.clear);
  }, a.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const o = this;
    o.dom.removeEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.removeEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.removeEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.removeEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.removeEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.removeEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.removeEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.removeEventListener("ln-api-queue:request-clear", o._handlers.clear), window.removeEventListener("online", o._onlineHandler), o._timers.forEach((l) => clearTimeout(l)), o._timers.clear(), S(o.dom, "ln-api-queue:destroyed", { scope: o.scope }), delete o.dom[s];
  };
  function m(o) {
    const l = o[s];
    l && l._drain();
  }
  U(d, s, a, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: m
  });
})();
(function() {
  const d = "data-ln-options", s = "lnOptions";
  if (window[s] !== void 0) return;
  function y(b) {
    this.dom = b, this._storeName = b.getAttribute(d), this._valueField = b.getAttribute("data-ln-options-value") || "id", this._labelField = b.getAttribute("data-ln-options-label") || "name";
    const _ = this;
    return this._onSetData = function(p) {
      _._rebuild(p.detail.data || []);
    }, b.addEventListener("ln-options:set-data", this._onSetData), S(b, "ln-options:request-data", { options: this._storeName }), this;
  }
  y.prototype._rebuild = function(b) {
    const _ = this.dom, p = this._valueField, h = this._labelField, a = _.value, m = _.querySelectorAll("option");
    for (let l = m.length - 1; l >= 0; l--)
      m[l].value !== "" && _.removeChild(m[l]);
    for (let l = 0; l < b.length; l++) {
      const u = b[l], c = document.createElement("option");
      c.value = String(u[p]), c.textContent = u[h] != null ? u[h] : "", _.appendChild(c);
    }
    const o = _.options;
    for (let l = 0; l < o.length; l++)
      if (o[l].value === a) {
        _.value = a;
        break;
      }
  }, y.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[s]);
  }, U(d, s, y, "ln-options");
})();
(function() {
  const d = "data-ln-stat", s = "lnStat";
  if (window[s] !== void 0) return;
  function y(_) {
    if (!_) return null;
    const p = _.indexOf(":");
    if (p === -1) return null;
    const h = _.slice(0, p), a = _.slice(p + 1), m = {};
    return m[h] = [a], m;
  }
  function b(_) {
    return this.dom = _, this._storeName = _.getAttribute(d), this._filters = y(_.getAttribute("data-ln-stat-filter")), this._onSetCount = function(p) {
      _.textContent = String(p.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), S(_, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  b.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[s]);
  }, U(d, s, b, "ln-stat");
})();
(function() {
  const d = "ln-icon-sprite", s = "#ln-icon-", y = "#ln-icon-custom-", b = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let p = null;
  const h = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), a = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), m = "lni:", o = "lni:v", l = "1";
  function u() {
    try {
      if (localStorage.getItem(o) !== l) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const g = localStorage.key(i);
          g && g.indexOf(m) === 0 && localStorage.removeItem(g);
        }
        localStorage.setItem(o, l);
      }
    } catch {
    }
  }
  u();
  function c() {
    return p || (p = document.getElementById(d), p || (p = document.createElementNS("http://www.w3.org/2000/svg", "svg"), p.id = d, p.setAttribute("hidden", ""), p.setAttribute("aria-hidden", "true"), p.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(p, document.body.firstChild))), p;
  }
  function f(i) {
    return i.indexOf(y) === 0 ? a + "/" + i.slice(y.length) + ".svg" : h + "/" + i.slice(s.length) + ".svg";
  }
  function e(i, g) {
    const v = g.match(/viewBox="([^"]+)"/), A = v ? v[1] : "0 0 24 24", E = g.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), w = E ? E[1].trim() : "", L = g.match(/<svg([^>]*)>/i), q = L ? L[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = i, x.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(D) {
      const k = q.match(new RegExp(D + '="([^"]*)"'));
      k && x.setAttribute(D, k[1]);
    }), x.innerHTML = w, c().querySelector("defs").appendChild(x);
  }
  function r(i) {
    if (b.has(i) || _.has(i)) return;
    if (i.indexOf(y) === 0 && !a) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", i);
      return;
    }
    const g = i.slice(1);
    try {
      const A = localStorage.getItem(m + g);
      if (A) {
        e(g, A), b.add(i);
        return;
      }
    } catch {
    }
    _.add(i);
    const v = f(i);
    fetch(v).then(function(A) {
      if (!A.ok) throw new Error(A.status);
      return A.text();
    }).then(function(A) {
      e(g, A), b.add(i), _.delete(i);
      try {
        localStorage.setItem(m + g, A);
      } catch {
      }
    }).catch(function(A) {
      console.error("[ln-icon] Fetch failed for:", g, A), _.delete(i);
    });
  }
  function t(i) {
    const g = 'use[href^="' + s + '"], use[href^="' + y + '"]', v = i.querySelectorAll ? i.querySelectorAll(g) : [];
    if (i.matches && i.matches(g)) {
      const A = i.getAttribute("href");
      A && r(A);
    }
    Array.prototype.forEach.call(v, function(A) {
      const E = A.getAttribute("href");
      E && r(E);
    });
  }
  function n() {
    t(document), new MutationObserver(function(i) {
      i.forEach(function(g) {
        if (g.type === "childList")
          g.addedNodes.forEach(function(v) {
            v.nodeType === 1 && t(v);
          });
        else if (g.type === "attributes" && g.attributeName === "href") {
          const v = g.target.getAttribute("href");
          v && (v.indexOf(s) === 0 || v.indexOf(y) === 0) && r(v);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const d = "data-ln-debug", s = "lnDebug";
  if (window[s] !== void 0) return;
  function y(b) {
    return this.dom = b, this;
  }
  y.prototype.destroy = function() {
    delete this.dom[s];
  }, U(d, s, y, "ln-debug");
})();
