if (typeof window < "u") {
  const p = console.warn;
  console.warn = function(...d) {
    typeof d[0] == "string" && (d[0].startsWith("[ln-") || d[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || p.apply(console, d);
  };
}
const Tt = {};
function wt(p, d) {
  Tt[p] || (Tt[p] = document.querySelector('[data-ln-template="' + p + '"]'));
  const E = Tt[p];
  return E ? E.content.cloneNode(!0) : (console.warn("[" + (d || "ln-core") + '] Template "' + p + '" not found'), null);
}
function S(p, d, E) {
  p.dispatchEvent(new CustomEvent(d, {
    bubbles: !0,
    detail: E || {}
  }));
}
function G(p, d, E) {
  const v = new CustomEvent(d, {
    bubbles: !0,
    cancelable: !0,
    detail: E || {}
  });
  return p.dispatchEvent(v), v;
}
function Wt(p, d, E) {
  p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter();
  const v = {
    sort: p.currentSort,
    filters: p.currentFilters,
    search: p.currentSearch
  };
  v[E] = p.name, S(p.dom, d, v);
}
function Q(p, d) {
  if (!p || !d) return p;
  const E = p.querySelectorAll("[data-ln-field]");
  for (let f = 0; f < E.length; f++) {
    const s = E[f], h = s.getAttribute("data-ln-field");
    d[h] != null && (s.textContent = d[h]);
  }
  const v = p.querySelectorAll("[data-ln-attr]");
  for (let f = 0; f < v.length; f++) {
    const s = v[f], h = s.getAttribute("data-ln-attr").split(",");
    for (let u = 0; u < h.length; u++) {
      const g = h[u].trim().split(":");
      if (g.length !== 2) continue;
      const a = g[0].trim(), l = g[1].trim();
      d[l] != null && s.setAttribute(a, d[l]);
    }
  }
  const b = p.querySelectorAll("[data-ln-show]");
  for (let f = 0; f < b.length; f++) {
    const s = b[f], h = s.getAttribute("data-ln-show");
    h in d && s.classList.toggle("hidden", !d[h]);
  }
  const _ = p.querySelectorAll("[data-ln-class]");
  for (let f = 0; f < _.length; f++) {
    const s = _[f], h = s.getAttribute("data-ln-class").split(",");
    for (let u = 0; u < h.length; u++) {
      const g = h[u].trim().split(":");
      if (g.length !== 2) continue;
      const a = g[0].trim(), l = g[1].trim();
      l in d && s.classList.toggle(a, !!d[l]);
    }
  }
  return p;
}
function fe(p, d) {
  p.matches && p.matches("[data-ln-form], [data-ln-fillable]") && p.dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  const E = p.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let v = 0; v < E.length; v++)
    E[v].dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  return p;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(p) {
  if (!(!p.target.matches || !p.target.matches("[data-ln-fillable]")))
    if (p.detail)
      Q(p.target, p.detail);
    else {
      const d = p.target.querySelectorAll("[data-ln-field]");
      for (let E = 0; E < d.length; E++)
        d[E].textContent = "";
    }
})));
function _t(p, d) {
  if (!p || !d) return p;
  const E = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  for (; E.nextNode(); ) {
    const _ = E.currentNode;
    _.textContent.indexOf("{{") !== -1 && (_.textContent = _.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(f, s) {
        return d[s] !== void 0 ? d[s] : "";
      }
    ));
  }
  const v = function(_, f) {
    return d[f] !== void 0 ? d[f] : "";
  }, b = Array.from(p.querySelectorAll("*"));
  p.nodeType === 1 && b.push(p);
  for (let _ = 0; _ < b.length; _++) {
    const f = b[_], s = f.attributes;
    for (let h = 0; h < s.length; h++) {
      const u = s[h];
      u.value.indexOf("{{") !== -1 && f.setAttribute(u.name, u.value.replace(/\{\{\s*(\w+)\s*\}\}/g, v));
    }
  }
  return p;
}
function pe(p, d, E, v, b, _) {
  const f = {};
  for (let h = 0; h < p.children.length; h++) {
    const u = p.children[h], g = u.getAttribute("data-ln-key");
    g && (f[g] = u);
  }
  const s = document.createDocumentFragment();
  for (let h = 0; h < d.length; h++) {
    const u = d[h], g = String(v(u));
    let a = f[g];
    if (a)
      b(a, u, h);
    else {
      const l = wt(E, _);
      if (!l || (_t(l, u), a = l.firstElementChild, !a)) continue;
      a.setAttribute("data-ln-key", g), b(a, u, h);
    }
    s.appendChild(a);
  }
  p.textContent = "", p.appendChild(s);
}
function tt(p, d) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      tt(p, d);
    }), console.warn("[" + d + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  p();
}
function lt(p, d, E) {
  if (p) {
    const v = p.querySelector('[data-ln-template="' + d + '"]');
    if (v) return v.content.cloneNode(!0);
  }
  return wt(d, E);
}
function Rt(p, d) {
  const E = {}, v = p.querySelectorAll("[" + d + "]");
  for (let b = 0; b < v.length; b++)
    E[v[b].getAttribute(d)] = v[b].textContent, v[b].remove();
  return E;
}
function kt(p, d, E, v) {
  if (p.nodeType !== 1) return;
  const _ = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", f = Array.from(p.querySelectorAll(_));
  p.matches && p.matches(_) && f.push(p);
  for (const s of f)
    s[E] || (s[E] = new v(s));
}
function vt(p) {
  return !!(p.offsetWidth || p.offsetHeight || p.getClientRects().length);
}
function me(p) {
  const d = p.querySelector('input[name="_method"]');
  return ((d && d.value !== "" ? d.value : p.method) || "").toUpperCase();
}
function Gt(p, d) {
  const E = !!(d && d.typed), v = d && d.exclude, b = {}, _ = p.elements, f = {};
  if (E)
    for (let s = 0; s < _.length; s++) {
      const h = _[s];
      h.name && h.type === "checkbox" && !h.disabled && (f[h.name] = (f[h.name] || 0) + 1);
    }
  for (let s = 0; s < _.length; s++) {
    const h = _[s];
    if (!(!h.name || h.disabled || h.type === "file" || h.type === "submit" || h.type === "button") && !(v && h.matches && h.matches(v)))
      if (h.type === "checkbox")
        E && f[h.name] === 1 ? b[h.name] = h.checked : (b[h.name] || (b[h.name] = []), h.checked && b[h.name].push(h.value));
      else if (h.type === "radio")
        h.checked && (b[h.name] = h.value);
      else if (h.type === "select-multiple") {
        b[h.name] = [];
        for (let u = 0; u < h.options.length; u++)
          h.options[u].selected && b[h.name].push(h.options[u].value);
      } else if (E && h.type === "hidden")
        b[h.name] = h.value;
      else if (E && (h.type === "number" || h.type === "range")) {
        const u = Number(h.value);
        b[h.name] = h.value === "" || isNaN(u) ? null : u;
      } else
        b[h.name] = h.value;
  }
  return b;
}
function ge(p) {
  if (typeof p != "string") return !!p;
  const d = p.trim().toLowerCase();
  return d !== "false" && d !== "0" && d !== "" && d !== "off" && d !== "no";
}
function $t(p, d) {
  const E = p.elements, v = [], b = {};
  for (let _ = 0; _ < E.length; _++) {
    const f = E[_];
    f.name && f.type === "checkbox" && (b[f.name] = (b[f.name] || 0) + 1);
  }
  for (let _ = 0; _ < E.length; _++) {
    const f = E[_];
    if (f.type === "file" || f.type === "submit" || f.type === "button") continue;
    const s = f.getAttribute("data-ln-fill-as") || f.name;
    if (!s || !(s in d)) continue;
    const h = d[s];
    if (f.type === "checkbox") {
      if (Array.isArray(h))
        f.checked = h.indexOf(f.value) !== -1;
      else if (b[f.name] > 1) {
        const u = String(h).split(",").map(function(g) {
          return g.trim();
        });
        f.checked = u.indexOf(f.value) !== -1;
      } else
        f.checked = ge(h);
      v.push(f);
    } else if (f.type === "radio")
      f.checked = f.value === String(h), v.push(f);
    else if (f.type === "select-multiple") {
      if (Array.isArray(h))
        for (let u = 0; u < f.options.length; u++)
          f.options[u].selected = h.indexOf(f.options[u].value) !== -1;
      v.push(f);
    } else
      f.value = h, v.push(f);
  }
  return v;
}
const Ht = {
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
function V(p) {
  const d = p ? p.closest("[lang]") : null, E = (d ? d.getAttribute("lang") || d.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!E) return "en-US";
  const v = E.trim().toLowerCase();
  return v.indexOf("-") === -1 && Ht[v] ? Ht[v] : E;
}
function Ut(p) {
  return p.hasAttribute("data-ln-value") ? p.getAttribute("data-ln-value") : p.textContent.trim();
}
function Yt(p, d, { get: E, set: v }) {
  Object.defineProperty(p, "value", {
    get: function() {
      return E ? E.call(this) : d.get.call(this);
    },
    set: function(b) {
      v ? v.call(this, b, (_) => d.set.call(this, _)) : d.set.call(this, b);
    },
    configurable: !0
  });
}
function U(p, d, E, v, b = {}) {
  const _ = b.extraAttributes || [], f = b.onAttributeChange || null, s = b.onInit || null;
  function h(u) {
    const g = u || document.body;
    kt(g, p, d, E), s && s(g);
  }
  return tt(function() {
    const u = new MutationObserver(function(a) {
      for (let l = 0; l < a.length; l++) {
        const i = a[l];
        if (i.type === "childList") {
          for (let r = 0; r < i.addedNodes.length; r++) {
            const e = i.addedNodes[r];
            e.nodeType === 1 && (kt(e, p, d, E), s && s(e));
          }
          for (let r = 0; r < i.removedNodes.length; r++) {
            const e = i.removedNodes[r];
            if (e.nodeType === 1) {
              const o = p.indexOf("[") !== -1 || p.indexOf(".") !== -1 || p.indexOf("#") !== -1 ? p : "[" + p + "]", n = Array.from(e.querySelectorAll(o));
              e.matches && e.matches(o) && n.push(e);
              for (let m = 0; m < n.length; m++) {
                const c = n[m];
                if (!document.contains(c)) {
                  const y = c[d];
                  y && typeof y.destroy == "function" && y.destroy();
                }
              }
            }
          }
        } else i.type === "attributes" && (f && i.target[d] ? f(i.target, i.attributeName) : (kt(i.target, p, d, E), s && s(i.target)));
      }
    });
    let g = [];
    if (p.indexOf("[") !== -1) {
      const a = /\[([\w-]+)/g;
      let l;
      for (; (l = a.exec(p)) !== null; )
        g.push(l[1]);
    } else
      g.push(p);
    u.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: g.concat(_)
    });
  }, v || (p.indexOf("[") === -1 ? p.replace("data-", "") : "component")), window[d] = h, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    h(document.body);
  }) : h(document.body), h;
}
function Xt(p, d) {
  if (p.ctrlKey || p.metaKey || p.shiftKey || p.altKey || p.button !== 0 || !d) return !1;
  const E = d.getAttribute("href");
  return !(!E || d.getAttribute("target") === "_blank" || d.hasAttribute("download") || E.startsWith("mailto:") || E.startsWith("tel:") || E === "#" || E.startsWith("#") || d.hostname && d.hostname !== window.location.hostname);
}
function Y(...p) {
  return p.filter((d) => d != null && d !== "").map((d, E) => E === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function nt(p, d) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, p, d ? { Authorization: d } : null);
}
function Jt(p, d = "ln-core") {
  try {
    return p ? JSON.parse(p) : {};
  } catch (E) {
    return console.error(`[${d}] Invalid headers JSON:`, E), {};
  }
}
const Qt = {};
function _e(p, d) {
  Qt[p] = d;
}
function be(p) {
  return Qt[p] || { ingress: (d) => d, egress: (d) => d };
}
const Zt = {};
function Mt(p, d) {
  if (!p || typeof d != "object") return;
  const E = p.toLowerCase().split("-")[0];
  Zt[E] = d;
}
function mt(p) {
  if (!p) return null;
  const d = p.toLowerCase().split("-")[0];
  return Zt[d] || null;
}
Mt("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = _e, window.lnCore.getDataMapper = be, window.lnCore.registerLocaleFallback = Mt, window.lnCore.getLocaleFallback = mt, window.lnCore.fillTemplate = _t, window.lnCore.fill = Q, window.lnCore.lnFill = fe, window.lnCore.renderList = pe);
function Nt(p, d) {
  let E = !1;
  return function() {
    E || (E = !0, queueMicrotask(function() {
      E = !1, p(), d && d();
    }));
  };
}
function te(p) {
  p = p || {};
  let d = p.windowSize > 0 ? p.windowSize : 1e3, E = p.pageSize > 0 ? p.pageSize : 200, v = p.threshold != null ? p.threshold : 25, b = p.fetchDebounce != null ? p.fetchDebounce : 120;
  const _ = typeof p.requestPage == "function" ? p.requestPage : function() {
  }, f = typeof p.onChange == "function" ? p.onChange : function() {
  }, s = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  let g = 0, a = 0, l = 0, i = { sort: null, filters: {}, search: "" }, r = null, e = 0;
  function t(c) {
    h.set(c, ++e);
  }
  function o() {
    return !!(i && (i.search || i.filters && Object.keys(i.filters).length));
  }
  function n() {
    if (s.size <= d) return;
    const c = Array.from(s.keys()).sort(function(w, A) {
      return (h.get(w) || 0) - (h.get(A) || 0);
    });
    let y = 0;
    for (; s.size > d && y < c.length; )
      s.delete(c[y]), h.delete(c[y]), y++;
  }
  function m(c, y) {
    u.add(c), _(i, c, y);
  }
  return {
    get: function(c) {
      return s.get(c);
    },
    has: function(c) {
      return s.has(c);
    },
    peek: function() {
      return s.size ? s.values().next().value : void 0;
    },
    get logicalTotal() {
      return g;
    },
    get grandTotal() {
      return a;
    },
    get queryGen() {
      return l;
    },
    get size() {
      return s.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(c, y) {
      for (let D = c; D < y; D++)
        s.has(D) && t(D);
      if (g <= 0) return;
      const w = Math.max(0, c - v), A = Math.min(g, y + v), L = Math.floor(w / E), C = Math.floor(Math.max(0, A - 1) / E);
      let k = -1, q = E;
      for (let D = L; D <= C; D++) {
        const M = D * E, O = Math.min(E, g - M);
        let B = !1;
        for (let j = M; j < M + O; j++)
          if (!s.has(j)) {
            B = !0;
            break;
          }
        if (B && !u.has(M)) {
          k = M, q = O;
          break;
        }
      }
      k !== -1 && (clearTimeout(r), r = setTimeout(function() {
        m(k, q);
      }, b));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(c) {
      if (c = c || {}, c.queryGen != null && c.queryGen !== l) return;
      a = c.total != null ? c.total : a, g = c.filtered != null ? c.filtered : c.data ? c.data.length : g;
      const y = c.offset || 0, w = c.data || [];
      for (let A = 0; A < w.length; A++)
        s.set(y + A, w[A]), t(y + A);
      u.delete(y), n(), f();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(c) {
      c && (i = c), m(0, E);
    },
    // Query change: new generation, drop everything, refetch page 0, then
    // notify for an immediate all-placeholder repaint at the stale height.
    invalidate: function(c) {
      l++, s.clear(), h.clear(), u.clear(), clearTimeout(r), c && (i = c), m(0, E), f();
    },
    destroy: function() {
      clearTimeout(r), s.clear(), h.clear(), u.clear();
    },
    configure: function(c) {
      c = c || {};
      let y = !1;
      if (c.windowSize != null && c.windowSize > 0 && c.windowSize !== d) {
        const w = c.windowSize < d;
        d = c.windowSize, w && n(), y = !0;
      }
      c.pageSize != null && c.pageSize > 0 && (E = c.pageSize), c.threshold != null && c.threshold >= 0 && (v = c.threshold), c.fetchDebounce != null && c.fetchDebounce >= 0 && (b = c.fetchDebounce), y && f();
    },
    setGrandTotal: function(c) {
      c == null || isNaN(c) || c < 0 || (a = c, o() || (g = c), f());
    }
  };
}
const ye = "ln:";
let dt = null;
function ee() {
  if (dt !== null) return dt;
  try {
    if (typeof localStorage > "u")
      return dt = !1, !1;
    const p = "__ln_test__";
    localStorage.setItem(p, p), localStorage.removeItem(p), dt = !0;
  } catch {
    dt = !1;
  }
  return dt;
}
function ve() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function ne(p, d) {
  const E = d.getAttribute("data-ln-persist"), v = E !== null && E !== "" ? E : d.id;
  return v ? ye + p + ":" + ve() + ":" + v : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', d), null);
}
function St(p, d) {
  if (!ee()) return null;
  const E = ne(p, d);
  if (!E) return null;
  try {
    const v = localStorage.getItem(E);
    return v !== null ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
function ct(p, d, E) {
  if (!ee()) return;
  const v = ne(p, d);
  if (v)
    try {
      E == null ? localStorage.removeItem(v) : localStorage.setItem(v, JSON.stringify(E));
    } catch {
    }
}
function ie(p) {
  return (p || "").replace(/^#/, "");
}
function Ct(p) {
  const d = p === void 0 ? location.hash : p, E = {}, v = ie(d);
  if (!v) return E;
  const b = v.split("&");
  for (let _ = 0; _ < b.length; _++) {
    const f = b[_];
    if (!f) continue;
    const s = f.indexOf(":"), h = s > -1 ? f.slice(0, s) : f, u = s > -1 ? f.slice(s + 1) : "";
    if (h)
      try {
        E[h] = decodeURIComponent(u);
      } catch {
        E[h] = u;
      }
  }
  return E;
}
function ht(p) {
  if (!p) return null;
  const d = Ct();
  return p in d ? d[p] : null;
}
function at(p, d) {
  if (!p) return;
  const E = Ct();
  d == null ? delete E[p] : E[p] = String(d);
  const b = Object.keys(E).map(function(_) {
    const f = E[_];
    return f === "" ? _ : _ + ":" + encodeURIComponent(f);
  }).join("&");
  ie(location.hash) !== b && (location.hash = b);
}
function Ft(p) {
  return p.button === 1 || p.ctrlKey || p.metaKey || p.shiftKey ? !1 : (p.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Ct, window.lnCore.hashGet = ht, window.lnCore.hashSet = at, window.lnCore.hashLinkClick = Ft);
function Et(p, d, E, v) {
  const b = typeof v == "number" ? v : 4, _ = window.innerWidth, f = window.innerHeight, s = d.width, h = d.height, u = (E || "bottom").split("-"), g = u[0], a = u[1] === "start" || u[1] === "end" ? u[1] : "center", l = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, i = l[g] || l.bottom;
  function r(m) {
    return m === "top" || m === "bottom" ? a === "start" ? p.left : a === "end" ? p.right - s : p.left + (p.width - s) / 2 : a === "start" ? p.top : a === "end" ? p.bottom - h : p.top + (p.height - h) / 2;
  }
  function e(m) {
    let c, y, w = !0;
    return m === "top" ? (c = p.top - b - h, y = r(m), c < 0 && (w = !1)) : m === "bottom" ? (c = p.bottom + b, y = r(m), c + h > f && (w = !1)) : m === "left" ? (c = r(m), y = p.left - b - s, y < 0 && (w = !1)) : (c = r(m), y = p.right + b, y + s > _ && (w = !1)), { top: c, left: y, side: m, fits: w };
  }
  let t = null;
  for (let m = 0; m < i.length; m++) {
    const c = e(i[m]);
    if (c.fits) {
      t = c;
      break;
    }
  }
  t || (t = e(i[0]));
  let o = t.top, n = t.left;
  return s >= _ ? n = 0 : (n < 0 && (n = 0), n + s > _ && (n = _ - s)), h >= f ? o = 0 : (o < 0 && (o = 0), o + h > f && (o = f - h)), { top: o, left: n, placement: t.side };
}
function xt(p) {
  if (!p) return { width: 0, height: 0 };
  const d = p.style, E = d.visibility, v = d.display, b = d.position;
  d.visibility = "hidden", d.display = "block", d.position = "fixed";
  const _ = p.offsetWidth, f = p.offsetHeight;
  return d.visibility = E, d.display = v, d.position = b, { width: _, height: f };
}
let st = null;
async function jt(p) {
  if (!p) {
    st = null;
    return;
  }
  try {
    const d = new TextEncoder(), E = await crypto.subtle.digest("SHA-256", d.encode(p));
    st = await crypto.subtle.importKey(
      "raw",
      E,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (d) {
    console.error("[ln-core/crypto] Key derivation failed:", d), st = null;
  }
}
function ut() {
  return st;
}
async function we(p, d = st) {
  const E = d || st;
  if (!E || p === void 0 || p === null) return p;
  try {
    const v = new TextEncoder(), b = crypto.getRandomValues(new Uint8Array(12)), _ = typeof p == "string" ? p : JSON.stringify(p), f = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: b },
      E,
      v.encode(_)
    ), s = btoa(String.fromCharCode(...b)), h = btoa(String.fromCharCode(...new Uint8Array(f)));
    return {
      encrypted: !0,
      iv: s,
      data: h
    };
  } catch (v) {
    return console.error("[ln-core/crypto] Encryption failed:", v), p;
  }
}
async function Ee(p, d = st) {
  const E = d || st;
  if (!p || !p.encrypted || !E) return p;
  try {
    const v = new TextDecoder(), b = Uint8Array.from(atob(p.iv), (h) => h.charCodeAt(0)), _ = Uint8Array.from(atob(p.data), (h) => h.charCodeAt(0)), f = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b },
      E,
      _
    ), s = v.decode(f);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (v) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", v), { ...p, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const p = window.fetch.bind(window), d = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
  function v(u) {
    return typeof u == "string" ? u : u instanceof URL ? u.href : u instanceof Request ? u.url : String(u);
  }
  function b(u, g) {
    return g && g.method ? String(g.method).toUpperCase() : u instanceof Request ? u.method.toUpperCase() : "GET";
  }
  function _(u, g) {
    return g + " " + u;
  }
  function f(u) {
    return u === "GET" || u === "HEAD";
  }
  function s(u, g) {
    g = g || {};
    const a = v(u), l = b(u, g), i = _(a, l);
    f(l) && d.has(i) && (d.get(i).abort(), d.delete(i));
    const r = new AbortController(), e = g.signal;
    let t = null;
    e && (e.aborted ? r.abort(e.reason) : (t = function() {
      r.abort(e.reason);
    }, e.addEventListener("abort", t, { once: !0 })));
    const o = Object.assign({}, g, { signal: r.signal });
    return d.set(i, r), p(u, o).finally(function() {
      e && t && e.removeEventListener("abort", t), d.get(i) === r && d.delete(i);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function h(u) {
    if (!u.detail || !u.detail.url) return;
    const g = u.target, a = (u.detail.method || (u.detail.body ? "POST" : "GET")).toUpperCase(), l = u.detail.key;
    l && E.has(l) && (E.get(l).abort(), E.delete(l));
    const i = new AbortController(), r = u.detail.signal;
    let e = null;
    r && (r.aborted ? i.abort(r.reason) : (e = function() {
      i.abort(r.reason);
    }, r.addEventListener("abort", e, { once: !0 }))), l && E.set(l, i);
    const t = { method: a, signal: i.signal };
    u.detail.body !== void 0 && (t.body = u.detail.body), window.fetch(u.detail.url, t).then(function(o) {
      r && e && r.removeEventListener("abort", e), l && E.get(l) === i && E.delete(l), S(g, "ln-http:response", {
        ok: o.ok,
        status: o.status,
        response: o
      });
    }).catch(function(o) {
      r && e && r.removeEventListener("abort", e), l && E.get(l) === i && E.delete(l), !(o && o.name === "AbortError") && S(g, "ln-http:error", {
        ok: !1,
        status: 0,
        error: o
      });
    });
  }
  document.addEventListener("ln-http:request", h), window.lnHttp = {
    cancel: function(u) {
      let g = !1;
      return d.forEach(function(a, l) {
        l.endsWith(" " + u) && (a.abort(), d.delete(l), g = !0);
      }), g;
    },
    cancelByKey: function(u) {
      return E.has(u) ? (E.get(u).abort(), E.delete(u), !0) : !1;
    },
    cancelAll: function() {
      d.forEach(function(u) {
        u.abort();
      }), d.clear(), E.forEach(function(u) {
        u.abort();
      }), E.clear();
    },
    get inflight() {
      const u = [];
      return d.forEach(function(g, a) {
        const l = a.indexOf(" ");
        u.push({ method: a.slice(0, l), url: a.slice(l + 1) });
      }), E.forEach(function(g, a) {
        u.push({ key: a });
      }), u;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", h), window.fetch = p, delete window.lnHttp;
    }
  };
})();
(function() {
  const p = "data-ln-form", d = "lnForm", E = "data-ln-form-action-edit", v = "data-ln-form-action-method";
  if (window[d] !== void 0) return;
  function b(_) {
    this.dom = _, this._baseAction = _.getAttribute("action") || "";
    const f = this;
    return this._onLnFill = function(s) {
      s.target === f.dom && (s.detail ? (f.fill(s.detail), f._applyActionMode(s.detail)) : f.dom.reset());
    }, this._onReset = function() {
      f._applyActionMode(null);
    }, _.addEventListener("ln-fill", this._onLnFill), _.addEventListener("reset", this._onReset), this;
  }
  b.prototype.fill = function(_) {
    const f = $t(this.dom, _);
    for (let s = 0; s < f.length; s++) {
      const h = f[s], u = h.tagName === "SELECT" || h.type === "checkbox" || h.type === "radio";
      h.dispatchEvent(new Event(u ? "change" : "input", { bubbles: !0 }));
    }
  }, b.prototype._ensureMethodInput = function() {
    let _ = this.dom.querySelector('input[name="_method"]');
    return _ || (_ = document.createElement("input"), _.type = "hidden", _.name = "_method", _.value = "", this.dom.appendChild(_)), _;
  }, b.prototype._applyActionMode = function(_) {
    if (!this.dom.hasAttribute(E)) return;
    const f = _ && _.id != null && _.id !== "" ? _.id : null, s = this._ensureMethodInput();
    if (f !== null) {
      const h = this.dom.getAttribute(E);
      h ? this.dom.setAttribute("action", h.replace(":id", encodeURIComponent(f))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(f)), s.value = this.dom.getAttribute(v) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), s.value = "";
  }, b.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[d]);
  }, U(p, d, b, "ln-form");
})();
(function() {
  const p = "data-ln-validate", d = "lnValidate", E = "data-ln-validate-errors", v = "data-ln-validate-error", b = "ln-validate-valid", _ = "ln-validate-invalid", f = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[d] !== void 0) return;
  function s(h) {
    this.dom = h, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const u = this, g = h.tagName, a = h.type, l = g === "SELECT" || a === "checkbox" || a === "radio";
    this._onInput = function() {
      u._touched = !0, u.validate();
    }, this._onChange = function() {
      u._touched = !0, u.validate();
    }, this._onSetCustom = function(r) {
      const e = r.detail && r.detail.error;
      if (!e) return;
      u._customErrors.add(e), u._touched = !0;
      const t = h.closest(".form-element");
      if (t) {
        const o = t.querySelector("[" + v + '="' + e + '"]');
        o && o.classList.remove("hidden");
      }
      h.classList.remove(b), h.classList.add(_), h.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(r) {
      const e = r.detail && r.detail.error, t = h.closest(".form-element");
      if (e) {
        if (u._customErrors.delete(e), t) {
          const o = t.querySelector("[" + v + '="' + e + '"]');
          o && o.classList.add("hidden");
        }
      } else
        u._customErrors.forEach(function(o) {
          if (t) {
            const n = t.querySelector("[" + v + '="' + o + '"]');
            n && n.classList.add("hidden");
          }
        }), u._customErrors.clear();
      u._touched && u.validate();
    }, l || h.addEventListener("input", this._onInput), h.addEventListener("change", this._onChange), h.addEventListener("ln-validate:set-custom", this._onSetCustom), h.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const i = h.form;
    return i && (i.hasAttribute("novalidate") || i.setAttribute("novalidate", ""), this._onFormReset = function() {
      u.reset();
    }, this._onValidateRequest = function(r) {
      u._touched = !0, !u.validate() && r.detail && r.detail.invalidFields && r.detail.invalidFields.push(u.dom);
    }, i.addEventListener("reset", this._onFormReset), i.addEventListener("ln-validate:request-validate", this._onValidateRequest), i._lnValidateGateBound || (i._lnValidateGateBound = !0, i.addEventListener("submit", function(r) {
      const e = { invalidFields: [] };
      S(i, "ln-validate:request-validate", e), e.invalidFields.length > 0 && (r.preventDefault(), e.invalidFields.sort((t, o) => t.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), e.invalidFields[0].focus());
    }))), this;
  }
  s.prototype.validate = function() {
    const h = this.dom, u = h.validity, a = h.checkValidity() && this._customErrors.size === 0, l = h.closest(".form-element");
    if (l) {
      const r = l.querySelector("[" + E + "]");
      if (r) {
        const e = r.querySelectorAll("[" + v + "]");
        for (let t = 0; t < e.length; t++) {
          const o = e[t].getAttribute(v), n = f[o];
          n && (u[n] ? e[t].classList.remove("hidden") : e[t].classList.add("hidden"));
        }
      }
    }
    return h.classList.toggle(b, a), h.classList.toggle(_, !a), h.setAttribute("aria-invalid", a ? "false" : "true"), S(h, a ? "ln-validate:valid" : "ln-validate:invalid", { target: h, field: h.name }), a;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(b, _), this.dom.removeAttribute("aria-invalid");
    const h = this.dom.closest(".form-element");
    if (h) {
      const u = h.querySelectorAll("[" + v + "]");
      for (let g = 0; g < u.length; g++)
        u[g].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const h = this.dom.form;
    h && (this._onFormReset && h.removeEventListener("reset", this._onFormReset), this._onValidateRequest && h.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(b, _), this.dom.removeAttribute("aria-invalid"), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[d];
  }, U(p, d, s, "ln-validate");
})();
(function() {
  const p = "data-ln-ajax", d = "lnAjax", E = "data-ln-form-scope";
  if (window[d] !== void 0) return;
  function v(a) {
    if (!a.hasAttribute(p) || a[d]) return;
    a[d] = !0;
    const l = h(a);
    b(l.links), _(l.forms);
  }
  function b(a) {
    for (const l of a) {
      if (l[d + "Trigger"] || l.hostname && l.hostname !== window.location.hostname) continue;
      const i = l.getAttribute("href");
      if (i && i.includes("#")) continue;
      const r = function(e) {
        if (!Xt(e, l)) return;
        e.preventDefault();
        const t = l.getAttribute("href");
        t && s("GET", t, null, l);
      };
      l.addEventListener("click", r), l[d + "Trigger"] = r;
    }
  }
  function _(a) {
    for (const l of a) {
      if (l[d + "Trigger"]) continue;
      if (l.hasAttribute(E)) {
        l[d + "ScopeWarned"] || (l[d + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const i = function(r) {
        if (r.defaultPrevented) return;
        r.preventDefault();
        const e = l.method.toUpperCase(), t = l.action, o = new FormData(l);
        for (const n of l.querySelectorAll('button, input[type="submit"]'))
          n.disabled = !0;
        s(e, t, o, l, function() {
          for (const n of l.querySelectorAll('button, input[type="submit"]'))
            n.disabled = !1;
        });
      };
      l.addEventListener("submit", i), l[d + "Trigger"] = i;
    }
  }
  function f(a) {
    if (!a[d]) return;
    const l = h(a);
    for (const i of l.links)
      i[d + "Trigger"] && (i.removeEventListener("click", i[d + "Trigger"]), delete i[d + "Trigger"]);
    for (const i of l.forms)
      i[d + "Trigger"] && (i.removeEventListener("submit", i[d + "Trigger"]), delete i[d + "Trigger"]);
    delete a[d];
  }
  function s(a, l, i, r, e) {
    if (G(r, "ln-ajax:before-start", { method: a, url: l }).defaultPrevented) return;
    S(r, "ln-ajax:start", { method: a, url: l }), r.classList.add("ln-ajax--loading");
    const o = document.createElement("span");
    o.className = "ln-ajax-spinner", r.appendChild(o);
    function n() {
      r.classList.remove("ln-ajax--loading");
      const A = r.querySelector(".ln-ajax-spinner");
      A && A.remove(), e && e();
    }
    let m = l;
    const c = document.querySelector('meta[name="csrf-token"]'), y = c ? c.getAttribute("content") : null;
    i instanceof FormData && y && i.append("_token", y);
    const w = {
      method: a,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (y && (w.headers["X-CSRF-TOKEN"] = y), a === "GET" && i) {
      const A = new URLSearchParams(i);
      m = l + (l.includes("?") ? "&" : "?") + A.toString();
    } else a !== "GET" && i && (w.body = i);
    fetch(m, w).then(function(A) {
      const L = A.ok;
      return A.json().then(function(C) {
        return { ok: L, status: A.status, data: C };
      });
    }).then(function(A) {
      const L = A.data;
      if (A.ok) {
        if (L.title && (document.title = L.title), L.content)
          for (const C in L.content) {
            const k = document.getElementById(C);
            k && (k.innerHTML = L.content[C]);
          }
        if (r.tagName === "A") {
          const C = r.getAttribute("href");
          C && window.history.pushState({ ajax: !0 }, "", C);
        } else r.tagName === "FORM" && r.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", m);
        S(r, "ln-ajax:success", { method: a, url: m, data: L });
      } else
        S(r, "ln-ajax:error", { method: a, url: m, status: A.status, data: L });
      if (L.message) {
        const C = L.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: C.type || (A.ok ? "success" : "error"),
            title: C.title || "",
            message: C.body || ""
          }
        }));
      }
      S(r, "ln-ajax:complete", { method: a, url: m }), n();
    }).catch(function(A) {
      S(r, "ln-ajax:error", { method: a, url: m, error: A }), S(r, "ln-ajax:complete", { method: a, url: m }), n();
    });
  }
  function h(a) {
    const l = { links: [], forms: [] };
    return a.tagName === "A" && a.getAttribute(p) !== "false" ? l.links.push(a) : a.tagName === "FORM" && a.getAttribute(p) !== "false" ? l.forms.push(a) : (l.links = Array.from(a.querySelectorAll('a:not([data-ln-ajax="false"])')), l.forms = Array.from(a.querySelectorAll('form:not([data-ln-ajax="false"])'))), l;
  }
  function u() {
    tt(function() {
      new MutationObserver(function(l) {
        for (const i of l)
          if (i.type === "childList") {
            for (const r of i.addedNodes)
              if (r.nodeType === 1 && (v(r), !r.hasAttribute(p))) {
                for (const t of r.querySelectorAll("[" + p + "]"))
                  v(t);
                const e = r.closest && r.closest("[" + p + "]");
                if (e && e.getAttribute(p) !== "false") {
                  const t = h(r);
                  b(t.links), _(t.forms);
                }
              }
          } else i.type === "attributes" && v(i.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-ajax");
  }
  function g() {
    for (const a of document.querySelectorAll("[" + p + "]"))
      v(a);
  }
  window[d] = v, window[d].destroy = f, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", g) : g();
})();
const oe = {
  navigate: function(p) {
    gt(p, { historyAction: "push" });
  },
  replace: function(p) {
    gt(p, { historyAction: "replace" });
  },
  current: function() {
    return Dt ? {
      path: qt,
      params: ae,
      query: le,
      route: Dt,
      regions: se
    } : null;
  }
}, Bt = "data-ln-route", re = "lnRoute";
typeof window < "u" && (window.lnRouter = oe);
const it = /* @__PURE__ */ new Map(), zt = /* @__PURE__ */ new WeakMap();
let se = /* @__PURE__ */ new Map(), Kt = !1, qt = null, ae = {}, le = {}, Dt = null, It = !1;
function Vt(p, d, E) {
  It ? queueMicrotask(function() {
    S(p, d, E);
  }) : S(p, d, E);
}
function At(p) {
  try {
    const _ = new URL(p, window.location.origin);
    p = _.pathname + _.search + _.hash;
  } catch {
  }
  let [d] = p.split("#"), [E, v] = d.split("?");
  const b = {};
  if (v) {
    const _ = new URLSearchParams(v);
    for (const [f, s] of _.entries())
      b[f] = s;
  }
  return E = E.replace(/\/+$/, ""), E === "" && (E = "/"), { path: E, query: b };
}
function ce(p, d) {
  if (p.pattern === "*") return 1;
  if (d.pattern === "*") return -1;
  const E = p.segments, v = d.segments, b = Math.max(E.length, v.length);
  for (let _ = 0; _ < b; _++) {
    const f = E[_], s = v[_];
    if (f === void 0) return 1;
    if (s === void 0) return -1;
    if (f === "*") return 1;
    if (s === "*") return -1;
    const h = f.startsWith(":"), u = s.startsWith(":");
    if (h && !u) return 1;
    if (!h && u) return -1;
  }
  return 0;
}
function de(p, d) {
  const E = p.split("/").filter(Boolean);
  for (const v of d) {
    if (v.pattern === "*")
      return {
        route: v,
        params: { wildcard: p }
      };
    const b = v.segments, _ = {};
    let f = !0;
    if (!(E.length > b.length && b[b.length - 1] !== "*")) {
      for (let s = 0; s < b.length; s++) {
        const h = b[s], u = E[s];
        if (h === "*") {
          _.wildcard = E.slice(s).join("/");
          break;
        }
        if (u === void 0) {
          f = !1;
          break;
        }
        if (h.startsWith(":"))
          _[h.slice(1)] = decodeURIComponent(u);
        else if (h !== u) {
          f = !1;
          break;
        }
      }
      if (f && (b.indexOf("*") !== -1 || E.length <= b.length))
        return { route: v, params: _ };
    }
  }
  return null;
}
function Ot(p, d) {
  if (p !== "__primary__") {
    const v = document.getElementById(d.target);
    return v || console.warn(`[ln-router] Explicit target element #${d.target} not found in DOM`), v;
  }
  const E = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return E || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), E;
}
function Ae(p) {
  if (!p) return;
  const d = Array.from(p.querySelectorAll("*")), E = [p].concat(d);
  for (const b of E)
    for (const _ of Object.keys(b))
      if (_.startsWith("ln") && b[_] && typeof b[_].destroy == "function")
        try {
          b[_].destroy();
        } catch (f) {
          console.error(`[ln-router] Error destroying component ${_} on element:`, b, f);
        }
  const v = document.querySelectorAll('[data-ln-popover="open"]');
  for (const b of v) {
    const _ = b.lnPopover;
    if (_ && _.trigger && p.contains(_.trigger))
      try {
        _.destroy();
      } catch (f) {
        console.error("[ln-router] Error destroying open popover:", f);
      }
  }
}
function gt(p, d = {}) {
  const { path: E, query: v } = At(p), b = /* @__PURE__ */ new Map();
  for (const [g, a] of it)
    b.set(g, de(E, a.sorted));
  const _ = it.has("__primary__"), f = b.get("__primary__");
  if (_ && !f) {
    Vt(document.body, "ln-router:not-found", { path: E });
    return;
  }
  let s = null;
  if (f && (s = Ot("__primary__", f.route), !s || G(s, "ln-router:before-navigate", {
    from: qt,
    to: p,
    params: f.params,
    query: v
  }).defaultPrevented))
    return;
  const h = [];
  for (const [g, a] of b) {
    if (!a) continue;
    const l = Ot(g, a.route);
    l && (g !== "__primary__" && l.hasAttribute("data-ln-route-keep") && zt.get(l) === a.route.templateNode || h.push({ regionKey: g, match: a, targetEl: l }));
  }
  d.historyAction === "push" ? window.history.pushState(null, "", p) : d.historyAction === "replace" && window.history.replaceState(null, "", p);
  const u = function() {
    for (const { regionKey: g, match: a, targetEl: l } of h) {
      if (!(d.isHydration && l.hasAttribute("data-ln-router-hydrate") && l.children.length > 0)) {
        Ae(l);
        const r = a.route.templateNode.content.cloneNode(!0);
        l.replaceChildren(r);
      }
      if (zt.set(l, a.route.templateNode), g === "__primary__" && (a.route.title && (document.title = a.route.title), !d.isHydration)) {
        l.hasAttribute("tabindex") || l.setAttribute("tabindex", "-1");
        const r = l.querySelector("h1, h2, h3, h4, h5, h6");
        r ? (r.setAttribute("tabindex", "-1"), r.focus()) : l.focus(), l.scrollIntoView({ block: "start", behavior: "instant" });
      }
      Vt(l, "ln-router:navigated", {
        path: p,
        params: a.params,
        query: v,
        route: a.route,
        target: l,
        region: g
      });
    }
    f && (qt = p, ae = f.params, le = v, Dt = f.route), se = new Map(
      Array.from(b.entries()).map(([g, a]) => [g, a ? { route: a.route, params: a.params } : null])
    );
  };
  document.startViewTransition && !d.isHydration ? document.startViewTransition(u) : u();
}
function Se(p) {
  const d = p.target.closest("a");
  if (!d || !Xt(p, d)) return;
  const E = d.getAttribute("href"), { path: v } = At(E), b = it.get("__primary__");
  if (!b) return;
  de(v, b.sorted) && (p.preventDefault(), gt(E, { historyAction: "push" }));
}
function Ce(p, d) {
  const E = Object.keys(p), v = Object.keys(d);
  if (E.length !== v.length) return !1;
  for (let b = 0; b < E.length; b++) {
    const _ = E[b];
    if (p[_] !== d[_]) return !1;
  }
  return !0;
}
function Le() {
  const p = window.location.pathname + window.location.search, d = oe.current();
  if (d && d.path != null) {
    const E = At(p);
    if (At(d.path).path === E.path && Ce(d.query, E.query))
      return;
  }
  gt(p, { historyAction: "skip" });
}
function Te() {
  Kt || (Kt = !0, tt(function() {
    document.addEventListener("click", Se), window.addEventListener("popstate", Le), It = !0;
    const p = window.location.pathname + window.location.search + window.location.hash;
    gt(p, { historyAction: "replace", isHydration: !0 }), It = !1;
  }, "ln-router"));
}
function ke(p) {
  const d = p.getAttribute(Bt);
  if (!d) return;
  const E = p.getAttribute("data-ln-route-target") || null;
  if (E === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${d}" rejected.`);
    return;
  }
  const v = E || "__primary__";
  it.has(v) || it.set(v, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const b = it.get(v);
  if (b.routes.has(d)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${d}" in region "${v}"`);
    return;
  }
  const _ = p.getAttribute("data-ln-route-title"), f = d.split("/").filter(Boolean), s = {
    pattern: d,
    segments: f,
    target: E,
    title: _,
    templateNode: p
  }, h = Ot(v, s);
  h && h.contains(p) && console.warn(`[ln-router] Route template with pattern "${d}" is declared inside its own outlet element:`, p), b.routes.set(d, s), b.sorted = Array.from(b.routes.values()).sort(ce);
}
function xe(p) {
  const d = p.getAttribute(Bt);
  if (!d) return;
  const v = p.getAttribute("data-ln-route-target") || null || "__primary__", b = it.get(v);
  b && (b.routes.delete(d), b.sorted = Array.from(b.routes.values()).sort(ce), b.routes.size === 0 && it.delete(v));
}
function ue(p) {
  return this.dom = p, ke(p), this;
}
ue.prototype.destroy = function() {
  xe(this.dom), delete this.dom[re];
};
U(Bt, re, ue, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    it.size > 0 && Te();
  }
});
(function() {
  const p = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0) return;
  function E(b) {
    this.dom = b, this.isOpen = b.getAttribute(p) === "open";
    const _ = this;
    return this._onRequestOpen = function() {
      _.dom.setAttribute(p, "open");
    }, this._onRequestClose = function() {
      _.dom.setAttribute(p, "close");
    }, this._onCancel = function(f) {
      f.preventDefault(), _.dom.setAttribute(p, "close");
    }, this._onClickClose = function(f) {
      const s = f.target.closest("[data-ln-modal-close]");
      s && _.dom.contains(s) && (f.preventDefault(), _.dom.setAttribute(p, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  E.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const b = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + p + '="open"]'),
          function(f) {
            return f !== b;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[d];
    }
  };
  function v(b) {
    const _ = b[d];
    if (!_) return;
    const s = b.getAttribute(p) === "open";
    if (s !== _.isOpen)
      if (s) {
        if (G(b, "ln-modal:before-open", { modalId: b.id, target: b }).defaultPrevented) {
          b.setAttribute(p, "close");
          return;
        }
        _.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof b.showModal == "function" && b.showModal();
        const u = b.querySelector("[autofocus]");
        if (u && vt(u))
          u.focus();
        else {
          const g = b.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), a = Array.prototype.find.call(g, vt);
          if (a) a.focus();
          else {
            const l = b.querySelectorAll("a[href], button:not([disabled])"), i = Array.prototype.find.call(l, vt);
            i && i.focus();
          }
        }
        S(b, "ln-modal:open", { modalId: b.id, target: b });
      } else {
        if (G(b, "ln-modal:before-close", { modalId: b.id, target: b }).defaultPrevented) {
          b.setAttribute(p, "open");
          return;
        }
        _.isOpen = !1, S(b, "ln-modal:close", { modalId: b.id, target: b }), typeof b.close == "function" && b.close(), document.querySelector("[" + p + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  U(p, d, E, "ln-modal", {
    onAttributeChange: v
  });
})();
(function() {
  const p = "lnModalCoordinator";
  if (window[p] !== void 0) return;
  function d(_) {
    if (!_) return;
    const f = _.querySelectorAll("[data-ln-field]");
    for (let h = 0; h < f.length; h++)
      f[h].textContent = "";
    const s = _.querySelectorAll("form");
    for (let h = 0; h < s.length; h++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(s[h], null) : s[h].reset();
  }
  document.addEventListener("submit", function(_) {
    if (_.defaultPrevented) return;
    const s = _.target.closest("[data-ln-modal]");
    if (s && s.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + s.id, "true");
      } catch {
      }
      at(s.id, null);
    }
  }), document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const f = _.target.closest("[data-ln-modal-for]");
    if (f) {
      const h = f.getAttribute("data-ln-modal-for"), u = document.getElementById(h);
      if (u && u.lnModal) {
        _.preventDefault();
        const g = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, a = {}, l = f.dataset;
        for (const e in l) {
          if (!e.startsWith("lnModal") || g[e]) continue;
          const t = e.slice(7);
          t && (a[t.charAt(0).toLowerCase() + t.slice(1)] = l[e]);
        }
        const i = Object.keys(a).length > 0;
        f.hasAttribute("data-ln-modal-mode") ? u.dataset.lnModalMode = f.getAttribute("data-ln-modal-mode") : u.dataset.lnModalMode = i ? "edit" : "new", i && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(u, a) : u.dataset.lnModalMode === "new" && d(u), u.getAttribute("data-ln-modal") === "open" ? S(u, "ln-modal:request-close", {}) : S(u, "ln-modal:request-open", {});
      }
      return;
    }
    const s = _.target.closest('a[href^="#"]');
    if (s) {
      const h = Ct(s.getAttribute("href"));
      for (const u in h) {
        const g = document.getElementById(u);
        if (g && g.lnModal) {
          if (!Ft(_)) return;
          at(u, h[u]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(_) {
    const f = _.target;
    if (!f || !f.lnModal) return;
    (f.dataset.lnModalMode || "new") === "new" && d(f);
  }), document.addEventListener("ln-modal:open", function(_) {
    const f = _.target;
    if (!(!f || !f.lnModal) && f.id) {
      const s = ht(f.id);
      s ? (f.dataset.lnModalMode = "edit", f.dispatchEvent(new CustomEvent("ln-fill:request", {
        bubbles: !0,
        detail: { id: s }
      }))) : s === "" && (f.dataset.lnModalMode = "new", d(f));
    }
  });
  let E = !1;
  function v() {
    if (!E) {
      E = !0;
      try {
        const _ = document.querySelectorAll("[data-ln-modal][id]");
        for (let f = 0; f < _.length; f++) {
          const s = _[f];
          if (!s.lnModal) continue;
          const h = s.id, u = "ln-modal-pending:" + h;
          let g = !1;
          try {
            g = sessionStorage.getItem(u) === "true";
          } catch {
          }
          if (g) {
            try {
              sessionStorage.removeItem(u);
            } catch {
            }
            if (!!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || s.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger"))) {
              s.dataset.lnModalMode = "edit", S(s, "ln-modal:request-open", {});
              continue;
            } else {
              at(h, null), S(s, "ln-modal:request-close", {}), d(s);
              continue;
            }
          }
          const a = ht(h), l = a !== null, i = s.lnModal.isOpen;
          if (l) {
            const r = a ? "edit" : "new";
            s.dataset.lnModalMode = r, i ? a ? s.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: a }
            })) : d(s) : S(s, "ln-modal:request-open", {});
          } else i && S(s, "ln-modal:request-close", {});
        }
      } finally {
        E = !1;
      }
    }
  }
  window.addEventListener("hashchange", v), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    setTimeout(v, 0);
  }) : setTimeout(v, 0);
  function b(_) {
    const f = _.target.closest("[data-ln-modal]");
    if (!(!f || !f.lnModal)) {
      if (f.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + f.id);
        } catch {
        }
        at(f.id, null);
      }
      S(f, "ln-modal:request-close", {}), d(f);
    }
  }
  document.addEventListener("ln-form:success", b), document.addEventListener("ln-ajax:success", b), document.addEventListener("ln-modal:close", function(_) {
    const f = _.target;
    if (!(!f || !f.lnModal)) {
      if (f.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + f.id);
        } catch {
        }
        ht(f.id) !== null && at(f.id, null);
      }
      f.dataset.lnModalMode === "new" && d(f);
    }
  }), window[p] = !0;
})();
(function() {
  const p = "data-ln-number", d = "lnNumber";
  if (window[d] !== void 0) return;
  const E = {}, v = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function b(u) {
    if (!E[u]) {
      const g = new Intl.NumberFormat(u, { useGrouping: !0 }), a = g.formatToParts(1234.5);
      let l = "", i = ".";
      for (let r = 0; r < a.length; r++)
        a[r].type === "group" && (l = a[r].value), a[r].type === "decimal" && (i = a[r].value);
      E[u] = { fmt: g, groupSep: l, decimalSep: i };
    }
    return E[u];
  }
  function _(u, g, a) {
    if (a !== null) {
      const l = parseInt(a, 10), i = u + "|d" + l;
      return E[i] || (E[i] = new Intl.NumberFormat(u, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: l })), E[i].format(g);
    }
    return b(u).fmt.format(g);
  }
  function f(u) {
    if (u[d]) return u[d];
    if (u[d] = this, this.dom = u, u.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const g = document.createElement("input");
    g.type = "hidden", g.name = u.name, u.removeAttribute("name"), u.hasAttribute("data-ln-fill-as") && g.setAttribute("data-ln-fill-as", u.getAttribute("data-ln-fill-as")), u.type = "text", u.setAttribute("inputmode", "decimal"), u.insertAdjacentElement("afterend", g), this._hidden = g;
    const a = this;
    Object.defineProperty(g, "value", {
      get: function() {
        return v.get.call(g);
      },
      set: function(i) {
        v.set.call(g, i), i !== "" && !isNaN(parseFloat(i)) ? a._setDisplayRaw(_(V(a.dom), parseFloat(i), a.dom.getAttribute("data-ln-number-decimals"))) : a._setDisplayRaw(""), a.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Yt(u, v, {
      get: function() {
        return v.get.call(u);
      },
      set: function(i) {
        if (i === "") {
          a._setDisplayRaw(""), a._setHiddenRaw(""), u.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const r = typeof i == "number" ? i : parseFloat(String(i).replace(/[^\d.-]/g, ""));
        isNaN(r) ? (a._setDisplayRaw(String(i)), a._setHiddenRaw("")) : (a._setHiddenRaw(r), a._setDisplayRaw(_(V(u), r, u.getAttribute("data-ln-number-decimals")))), u.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      a._handleInput();
    }, u.addEventListener("input", this._onInput), this._onPaste = function(i) {
      i.preventDefault();
      const r = (i.clipboardData || window.clipboardData).getData("text"), e = b(V(u)), t = e.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let o = r.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      e.groupSep && (o = o.split(e.groupSep).join("")), e.decimalSep !== "." && (o = o.replace(e.decimalSep, "."));
      const n = parseFloat(o);
      a.value = isNaN(n) ? NaN : n;
    }, u.addEventListener("paste", this._onPaste);
    const l = u.value;
    if (l !== "") {
      const i = parseFloat(l);
      isNaN(i) || (this._setHiddenRaw(i), this._setDisplayRaw(_(V(u), i, u.getAttribute("data-ln-number-decimals"))), u.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function s(u) {
    if (typeof u == "number") return isNaN(u) ? null : u;
    if (!u || typeof u != "string") return null;
    let g = u.trim();
    if (g === "") return null;
    g = g.replace(/[\s\u00A0$€£]/g, ""), g.indexOf(",") !== -1 && g.indexOf(".") !== -1 ? g.indexOf(".") < g.indexOf(",") ? g = g.replace(/\./g, "").replace(",", ".") : g = g.replace(/,/g, "") : g.indexOf(",") !== -1 && (g = g.replace(",", ".")), g = g.replace(/[^\d.-]/g, "");
    const a = parseFloat(g);
    return isNaN(a) ? null : a;
  }
  f.prototype._initTextElement = function() {
    const u = this.dom;
    let g = u.getAttribute("data-ln-value"), a = u.getAttribute("data-ln-number"), l = null;
    g !== null && g !== "" ? l = g : a !== null && a !== "" && a !== "true" ? l = a : l = u.textContent.trim();
    const i = s(l);
    i !== null ? (this._rawValue = i, u.hasAttribute("data-ln-value") || u.setAttribute("data-ln-value", String(i)), this._formatTextContent()) : this._rawValue = null;
  }, f.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const u = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = _(V(this.dom), this._rawValue, u);
    }
  }, f.prototype._handleInput = function() {
    const u = this.dom, g = b(V(u)), a = v.get.call(u);
    if (a === "") {
      this._setHiddenRaw(""), S(u, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (a === "-") {
      this._setHiddenRaw("");
      return;
    }
    const l = u.selectionStart;
    let i = 0;
    for (let A = 0; A < l; A++)
      /[0-9]/.test(a[A]) && i++;
    let r = a;
    if (g.groupSep && (r = r.split(g.groupSep).join("")), r = r.replace(g.decimalSep, "."), a.endsWith(g.decimalSep) || a.endsWith(".")) {
      const A = r.replace(/\.$/, ""), L = parseFloat(A);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const e = r.indexOf(".");
    if (e !== -1 && r.slice(e + 1).endsWith("0")) {
      const L = parseFloat(r);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const t = u.getAttribute("data-ln-number-decimals");
    if (t !== null && e !== -1) {
      const A = parseInt(t, 10);
      r.slice(e + 1).length > A && (r = r.slice(0, e + 1 + A));
    }
    const o = parseFloat(r);
    if (isNaN(o)) return;
    const n = u.getAttribute("data-ln-number-min"), m = u.getAttribute("data-ln-number-max");
    if (n !== null && o < parseFloat(n) || m !== null && o > parseFloat(m)) return;
    let c;
    if (t !== null)
      c = _(V(u), o, t);
    else {
      const A = e !== -1 ? r.slice(e + 1).length : 0;
      if (A > 0) {
        const L = V(u) + "|u" + A;
        E[L] || (E[L] = new Intl.NumberFormat(V(u), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), c = E[L].format(o);
      } else
        c = g.fmt.format(o);
    }
    this._setDisplayRaw(c);
    let y = i, w = 0;
    for (let A = 0; A < c.length && y > 0; A++)
      w = A + 1, /[0-9]/.test(c[A]) && y--;
    y > 0 && (w = c.length), u.setSelectionRange(w, w), this._setHiddenRaw(o), S(u, "ln-number:input", { value: o, formatted: c });
  }, f.prototype._setHiddenRaw = function(u) {
    this._hidden && v.set.call(this._hidden, String(u));
  }, f.prototype._setDisplayRaw = function(u) {
    this.isTextElement ? this.dom.textContent = String(u) : v.set.call(this.dom, String(u));
  }, f.prototype._displayFormatted = function(u) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(_(V(this.dom), u, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(f.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const u = v.get.call(this._hidden);
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
      this._setHiddenRaw(u), this._setDisplayRaw(_(V(this.dom), u, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(f.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : v.get.call(this.dom);
    }
  }), f.prototype.destroy = function() {
    this.dom[d] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function h() {
    new MutationObserver(function() {
      const u = document.querySelectorAll("[" + p + "]");
      for (let g = 0; g < u.length; g++) {
        const a = u[g][d];
        a && (a.isTextElement ? a._formatTextContent() : isNaN(a.value) || a._displayFormatted(a.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(p, d, f, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(u) {
      const g = u[d];
      g && (g.isTextElement ? g._initTextElement() : isNaN(g.value) || g._displayFormatted(g.value));
    }
  }), h();
})();
(function() {
  const p = "data-ln-date", d = "lnDate";
  if (window[d] !== void 0) return;
  const E = {}, v = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function b(n, m) {
    const c = n + "|" + JSON.stringify(m);
    return E[c] || (E[c] = new Intl.DateTimeFormat(n, m)), E[c];
  }
  const _ = /^(short|medium|long)(\s+datetime)?$/, f = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(n) {
    return !n || n === "" ? { dateStyle: "medium" } : n.match(_) ? f[n] : null;
  }
  function h(n, m, c) {
    const y = n.getDate(), w = n.getMonth(), A = n.getFullYear(), L = n.getHours(), C = n.getMinutes();
    let k, q;
    const D = mt(c), M = (c || "").toLowerCase().split("-")[0], B = b(c, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], j = D && B !== M;
    j && D.monthsLong ? k = D.monthsLong[w] : k = b(c, { month: "long" }).format(n), j && D.monthsShort ? q = D.monthsShort[w] : q = b(c, { month: "short" }).format(n);
    const ot = {
      yyyy: String(A),
      yy: String(A).slice(-2),
      MMMM: k,
      MMM: q,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(y).padStart(2, "0"),
      d: String(y),
      HH: String(L).padStart(2, "0"),
      mm: String(C).padStart(2, "0")
    };
    return m.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(Z) {
      return ot[Z];
    });
  }
  function u(n, m, c) {
    const y = s(m);
    if (y) {
      const w = b(c, y), A = (c || "").toLowerCase().split("-")[0], L = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return mt(c) && L !== A ? h(n, "dd.MM.yyyy", c) : w.format(n);
    }
    return h(n, m, c);
  }
  function g(n) {
    if (!n) return "";
    const m = n.getFullYear(), c = String(n.getMonth() + 1).padStart(2, "0"), y = String(n.getDate()).padStart(2, "0");
    return m + "-" + c + "-" + y;
  }
  function a(n, m, c) {
    S(n.dom, "ln-date:change", {
      value: m,
      formatted: n.dom.value,
      date: c
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function l(n, m, c, y) {
    n._setHiddenRaw(m), v.set.call(n._picker, m), n._lastISO = m, y !== void 0 ? (n._isFormatting = !0, n.dom.value = y, n._isFormatting = !1) : c && n._displayFormatted(c), a(n, m, c);
  }
  function i(n) {
    n._setHiddenRaw(""), v.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", a(n, "", null);
  }
  r.prototype._initTextElement = function() {
    const n = this.dom;
    let m = n.getAttribute("data-ln-value"), c = n.getAttribute("data-ln-date"), y = n.getAttribute("datetime"), w = null;
    m !== null && m !== "" ? w = m : y !== null && y !== "" ? w = y : c !== null && c !== "" && c !== "true" && !_.test(c) ? w = c : w = n.textContent.trim();
    let A = e(w) || t(w);
    if (!A && w)
      if (isNaN(w))
        A = new Date(w);
      else {
        const L = Number(w);
        A = new Date(L > 1e11 ? L : L * 1e3);
      }
    if (A && !isNaN(A.getTime())) {
      const L = g(A);
      this._rawValue = L, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", L), this._formatTextContent();
    } else
      this._rawValue = null;
  }, r.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = e(this._rawValue);
      if (n) {
        let c = this.dom.getAttribute("data-ln-date-format");
        if (!c) {
          const w = this.dom.getAttribute("data-ln-date");
          w && _.test(w) && (c = w);
        }
        const y = V(this.dom);
        this.dom.textContent = u(n, c || "medium", y);
      }
    }
  };
  function r(n) {
    if (n[d]) return n[d];
    if (n[d] = this, this.dom = n, n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const m = this, c = n.value, y = n.name, A = (n.closest(".form-element, form") || n.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let D = 0; D < A.length; D++) {
      const M = A[D].getAttribute("data-ln-date-dict");
      if (M) {
        const O = Rt(A[D], "data-ln-date-dict-key");
        O["months-long"] && (O.monthsLong = O["months-long"].split(",").map((B) => B.trim())), O["months-short"] && (O.monthsShort = O["months-short"].split(",").map((B) => B.trim())), Mt(M, O);
      }
    }
    const L = document.createElement("span");
    L.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(L, n), L.appendChild(n), this._wrapper = L;
    const C = document.createElement("input");
    C.type = "hidden", C.name = y, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && C.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", C), this._hidden = C;
    const k = document.createElement("input");
    k.type = "date", k.tabIndex = -1, k.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", C.insertAdjacentElement("afterend", k), this._picker = k, n.type = "text";
    const q = document.createElement("button");
    if (q.type = "button", q.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), q.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', k.insertAdjacentElement("afterend", q), this._btn = q, this._lastISO = "", Object.defineProperty(C, "value", {
      get: function() {
        return v.get.call(C);
      },
      set: function(D) {
        if (v.set.call(C, D), D && D !== "") {
          const M = e(D);
          M && l(m, D, M);
        } else D === "" && i(m);
      }
    }), Yt(n, v, {
      get: function() {
        return v.get.call(n);
      },
      set: function(D, M) {
        if (m._isFormatting) {
          M(D);
          return;
        }
        if (!D || D === "") {
          M(""), i(m);
          return;
        }
        const O = e(D) || t(D);
        if (O) {
          const B = g(O), j = n.getAttribute(p) || "", ot = V(n), Z = u(O, j, ot);
          M(Z), l(m, B, O, Z);
        } else
          M(String(D)), i(m);
      }
    }), this._onPickerChange = function() {
      const D = k.value;
      if (D) {
        const M = e(D);
        M && l(m, D, M);
      } else
        i(m);
    }, k.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const D = m.dom.value.trim();
      if (D === "") {
        m._lastISO !== "" && i(m);
        return;
      }
      if (m._lastISO) {
        const O = e(m._lastISO);
        if (O) {
          const B = m.dom.getAttribute(p) || "", j = V(m.dom);
          if (D === u(O, B, j)) return;
        }
      }
      const M = t(D);
      if (M) {
        const O = g(M);
        l(m, O, M);
      } else if (m._lastISO) {
        const O = e(m._lastISO);
        O && m._displayFormatted(O);
      } else
        m.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      m._openPicker();
    }, q.addEventListener("click", this._onBtnClick), c && c !== "") {
      const D = e(c);
      D && l(m, c, D);
    }
    return this;
  }
  function e(n) {
    if (!n || typeof n != "string") return null;
    const m = n.split("T"), c = m[0].split("-");
    if (c.length < 3) return null;
    const y = parseInt(c[0], 10), w = parseInt(c[1], 10) - 1, A = parseInt(c[2], 10);
    if (isNaN(y) || isNaN(w) || isNaN(A)) return null;
    let L = 0, C = 0;
    if (m[1]) {
      const q = m[1].split(":");
      L = parseInt(q[0], 10) || 0, C = parseInt(q[1], 10) || 0;
    }
    const k = new Date(y, w, A, L, C);
    return k.getFullYear() !== y || k.getMonth() !== w || k.getDate() !== A ? null : k;
  }
  function t(n) {
    if (!n || typeof n != "string" || (n = n.trim(), n.length < 6)) return null;
    let m, c;
    if (n.indexOf(".") !== -1)
      m = ".", c = n.split(".");
    else if (n.indexOf("/") !== -1)
      m = "/", c = n.split("/");
    else if (n.indexOf("-") !== -1)
      m = "-", c = n.split("-");
    else
      return null;
    if (c.length !== 3) return null;
    const y = [];
    for (let k = 0; k < 3; k++) {
      const q = parseInt(c[k], 10);
      if (isNaN(q)) return null;
      y.push(q);
    }
    let w, A, L;
    m === "." ? (w = y[0], A = y[1], L = y[2]) : m === "/" ? (A = y[0], w = y[1], L = y[2]) : c[0].length === 4 ? (L = y[0], A = y[1], w = y[2]) : (w = y[0], A = y[1], L = y[2]), L < 100 && (L += L < 50 ? 2e3 : 1900);
    const C = new Date(L, A - 1, w);
    return C.getFullYear() !== L || C.getMonth() !== A - 1 || C.getDate() !== w ? null : C;
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
    v.set.call(this._hidden, n);
  }, r.prototype._displayFormatted = function(n) {
    const m = this.dom.getAttribute(p) || "", c = V(this.dom);
    this._isFormatting = !0, this.dom.value = u(n, m, c), this._isFormatting = !1;
  }, Object.defineProperty(r.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : v.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const c = e(n) || t(n);
        if (!c) return;
        const y = g(c);
        this._rawValue = y, this.dom.setAttribute("data-ln-value", y), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        i(this);
        return;
      }
      const m = e(n);
      m && l(this, n, m);
    }
  }), Object.defineProperty(r.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? e(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = g(n);
    }
  }), Object.defineProperty(r.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), r.prototype.destroy = function() {
    if (!this.dom[d]) return;
    if (this.isTextElement) {
      S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[d];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function o() {
    new MutationObserver(function() {
      const n = document.querySelectorAll("[" + p + "]");
      for (let m = 0; m < n.length; m++) {
        const c = n[m][d];
        if (c) {
          if (c.isTextElement)
            c._formatTextContent();
          else if (c.value) {
            const y = e(c.value);
            y && c._displayFormatted(y);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(p, d, r, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(n) {
      const m = n[d];
      if (m) {
        if (m.isTextElement)
          m._initTextElement();
        else if (m.value) {
          const c = e(m.value);
          c && m._displayFormatted(c);
        }
      }
    }
  }), o();
})();
(function() {
  const p = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0) return;
  const E = [];
  if (!history._lnNavPatched) {
    const f = history.pushState;
    history.pushState = function() {
      f.apply(history, arguments);
      for (const s of E)
        s();
    }, history._lnNavPatched = !0;
  }
  function v(f) {
    return this.dom = f, this.activeClass = f.getAttribute(p) || "active", this.exact = f.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), E.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(f, { childList: !0, subtree: !0 }), this.update(), this;
  }
  v.prototype.update = function() {
    if (!this.activeClass || G(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), h = window.location.pathname, u = b(h);
    for (const g of s) {
      const a = g.getAttribute("href");
      if (!a || a === "#" || a.startsWith("#") || a.startsWith("javascript:") || a.startsWith("mailto:") || a.startsWith("tel:")) {
        g.classList.remove(this.activeClass), g.removeAttribute("aria-current");
        continue;
      }
      if (g.hostname && g.hostname !== window.location.hostname) {
        g.classList.remove(this.activeClass), g.removeAttribute("aria-current");
        continue;
      }
      const l = b(a), i = l === u, r = !this.exact && l !== "/" && u.startsWith(l + "/");
      i || r ? (g.classList.add(this.activeClass), g.setAttribute("aria-current", "page")) : (g.classList.remove(this.activeClass), g.removeAttribute("aria-current"));
    }
    S(this.dom, "ln-nav:update", { target: this.dom });
  }, v.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const f = E.indexOf(this.updateHandler);
    f !== -1 && E.splice(f, 1), S(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function b(f) {
    try {
      return new URL(f, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return f.replace(/\/$/, "") || "/";
    }
  }
  function _(f, s) {
    const h = f[d];
    if (h) {
      if (s === p) {
        if (!f.hasAttribute(p)) {
          h.destroy();
          return;
        }
        const u = h.activeClass, g = f.getAttribute(p) || "active";
        if (u !== g) {
          const a = f.querySelectorAll("a");
          for (const l of a)
            u && l.classList.remove(u);
          h.activeClass = g;
        }
      } else s === "data-ln-nav-exact" && (h.exact = f.hasAttribute("data-ln-nav-exact"));
      h.update();
    }
  }
  U(p, d, v, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: _
  });
})();
(function() {
  const p = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function E(_, f) {
    const s = (_.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (s) return s;
    if (_.tagName !== "A") return "";
    const h = _.getAttribute("href") || "";
    if (!h.startsWith("#")) return "";
    const u = h.slice(1);
    if (!u) return "";
    const g = u.split("&");
    if (f)
      for (const i of g) {
        const r = i.indexOf(":");
        if (r > 0 && i.slice(0, r).toLowerCase().trim() === f)
          return i.slice(r + 1).toLowerCase().trim();
      }
    const a = g[g.length - 1] || "", l = a.indexOf(":");
    return (l > 0 ? a.slice(l + 1) : a).toLowerCase().trim();
  }
  function v(_) {
    return this.dom = _, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const _ = this.tabs.filter((h) => h.tagName === "A" && (h.getAttribute("href") || "").startsWith("#")), f = _.length > 0 && _.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = f && !!this.nsKey, _.length > 0 && _.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : f && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const h of this.tabs) {
      const u = E(h, this.nsKey);
      u ? this.mapTabs[u] = h : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', h);
    }
    for (const h of this.panels) {
      const u = (h.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      u && (this.mapPanels[u] = h);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const h of this.tabs) {
      if (h[d + "Trigger"]) continue;
      const u = function(g) {
        const a = h.tagName === "A";
        if (!a && (g.ctrlKey || g.metaKey || g.button === 1)) return;
        const l = E(h, s.nsKey);
        l && (a && !Ft(g) || (s.hashEnabled ? ht(s.nsKey) === l ? s.dom.setAttribute("data-ln-tabs-active", l) : at(s.nsKey, l) : s.dom.setAttribute("data-ln-tabs-active", l)));
      };
      h.addEventListener("click", u), h[d + "Trigger"] = u, s._clickHandlers.push({ el: h, handler: u });
    }
    if (this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const h = ht(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", h !== null ? h : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let h = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const u = St("tabs", this.dom);
        u !== null && u in this.mapPanels && (h = u);
      }
      this.dom.setAttribute("data-ln-tabs-active", h);
    }
  }
  v.prototype._applyActive = function(_) {
    var f;
    (!_ || !(_ in this.mapPanels)) && (_ = this.defaultKey);
    for (const s in this.mapTabs) {
      const h = this.mapTabs[s];
      s === _ ? (h.setAttribute("data-active", ""), h.setAttribute("aria-selected", "true")) : (h.removeAttribute("data-active"), h.setAttribute("aria-selected", "false"));
    }
    for (const s in this.mapPanels) {
      const h = this.mapPanels[s], u = s === _;
      h.classList.toggle("hidden", !u), h.setAttribute("aria-hidden", u ? "false" : "true");
    }
    if (this.autoFocus) {
      const s = (f = this.mapPanels[_]) == null ? void 0 : f.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      s && setTimeout(() => s.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: _, tab: this.mapTabs[_], panel: this.mapPanels[_] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && ct("tabs", this.dom, _);
  }, v.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const { el: _, handler: f } of this._clickHandlers)
        _.removeEventListener("click", f), delete _[d + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[d];
    }
  }, U(p, d, v, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(_) {
      const f = _.getAttribute("data-ln-tabs-active");
      _[d]._applyActive(f);
    }
  });
})();
(function() {
  const p = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
  function E(_, f) {
    const s = document.querySelectorAll(
      '[data-ln-toggle-for="' + _.id + '"]'
    );
    for (const h of s)
      h.setAttribute("aria-expanded", f ? "true" : "false");
  }
  function v(_) {
    if (this.dom = _, _.hasAttribute("data-ln-persist")) {
      const f = St("toggle", _);
      f !== null && _.setAttribute(p, f);
    }
    return this.isOpen = _.getAttribute(p) === "open", this.isOpen && _.classList.add("open"), E(_, this.isOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[d] && (S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function b(_) {
    const f = _[d];
    if (!f) return;
    const h = _.getAttribute(p) === "open";
    if (h !== f.isOpen)
      if (h) {
        if (G(_, "ln-toggle:before-open", { target: _ }).defaultPrevented) {
          _.setAttribute(p, "close");
          return;
        }
        f.isOpen = !0, _.classList.add("open"), E(_, !0), S(_, "ln-toggle:open", { target: _ }), _.hasAttribute("data-ln-persist") && ct("toggle", _, "open");
      } else {
        if (G(_, "ln-toggle:before-close", { target: _ }).defaultPrevented) {
          _.setAttribute(p, "open");
          return;
        }
        f.isOpen = !1, _.classList.remove("open"), E(_, !1), S(_, "ln-toggle:close", { target: _ }), _.hasAttribute("data-ln-persist") && ct("toggle", _, "close");
      }
  }
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const f = _.target.closest("[data-ln-toggle-for]");
    if (f) {
      const s = f.getAttribute("data-ln-toggle-for"), h = document.getElementById(s);
      if (h && h[d]) {
        _.preventDefault();
        const u = f.getAttribute("data-ln-toggle-action") || "toggle";
        if (u === "open")
          h.setAttribute(p, "open");
        else if (u === "close")
          h.setAttribute(p, "close");
        else if (u === "toggle") {
          const g = h.getAttribute(p);
          h.setAttribute(p, g === "open" ? "close" : "open");
        }
      }
    }
  }), U(p, d, v, "ln-toggle", {
    onAttributeChange: b
  });
})();
(function() {
  const p = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
  function E(v) {
    return this.dom = v, this._onToggleOpen = function(b) {
      if (b.detail.target.closest("[data-ln-accordion]") !== v) return;
      const _ = v.querySelectorAll("[data-ln-toggle]");
      for (const f of _)
        f !== b.detail.target && f.closest("[data-ln-accordion]") === v && f.getAttribute("data-ln-toggle") === "open" && f.setAttribute("data-ln-toggle", "close");
      S(v, "ln-accordion:change", { target: b.detail.target });
    }, v.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[d]);
  }, U(p, d, E, "ln-accordion");
})();
(function() {
  const p = "data-ln-dropdown", d = "lnDropdown";
  if (window[d] !== void 0) return;
  function E(v) {
    if (this.dom = v, this.toggleEl = v.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = v.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const _ of this.toggleEl.children)
        _.setAttribute("role", "menuitem");
    const b = this;
    return this._onToggleOpen = function(_) {
      !_.detail || _.detail.target !== b.toggleEl || (b.triggerBtn && b.triggerBtn.setAttribute("aria-expanded", "true"), typeof b.toggleEl.showPopover == "function" && b.toggleEl.showPopover(), b._reposition(), b._addOutsideClickListener(), b._addScrollRepositionListener(), b._addResizeCloseListener(), S(v, "ln-dropdown:open", { target: _.detail.target }));
    }, this._onToggleClose = function(_) {
      !_.detail || _.detail.target !== b.toggleEl || (b.triggerBtn && b.triggerBtn.setAttribute("aria-expanded", "false"), b._removeOutsideClickListener(), b._removeScrollRepositionListener(), b._removeResizeCloseListener(), b.toggleEl.style.top = "", b.toggleEl.style.left = "", typeof b.toggleEl.hidePopover == "function" && b.toggleEl.matches(":popover-open") && b.toggleEl.hidePopover(), S(v, "ln-dropdown:close", { target: _.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  E.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const v = this.triggerBtn.getBoundingClientRect(), b = xt(this.toggleEl), _ = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, f = Et(v, b, "bottom-end", _);
    this.toggleEl.style.top = f.top + "px", this.toggleEl.style.left = f.left + "px";
  }, E.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const v = this;
    this._boundDocClick = function(b) {
      v.dom.contains(b.target) || v.toggleEl && v.toggleEl.contains(b.target) || v.toggleEl && v.toggleEl.getAttribute("data-ln-toggle") === "open" && v.toggleEl.setAttribute("data-ln-toggle", "close");
    }, v._docClickTimeout = setTimeout(function() {
      v._docClickTimeout = null, document.addEventListener("click", v._boundDocClick);
    }, 0);
  }, E.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, E.prototype._addScrollRepositionListener = function() {
    const v = this;
    this._boundScrollReposition = function() {
      v._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, E.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, E.prototype._addResizeCloseListener = function() {
    const v = this;
    this._boundResizeClose = function() {
      v.toggleEl && v.toggleEl.getAttribute("data-ln-toggle") === "open" && v.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, E.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, E.prototype.destroy = function() {
    this.dom[d] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[d]);
  }, U(p, d, E, "ln-dropdown");
})();
(function() {
  const p = "data-ln-popover", d = "lnPopover", E = "data-ln-popover-for", v = "data-ln-popover-position";
  if (window[d] !== void 0) return;
  const b = [];
  let _ = null;
  function f() {
    _ || (_ = function(g) {
      if (g.key !== "Escape" || b.length === 0) return;
      b[b.length - 1].close();
    }, document.addEventListener("keydown", _));
  }
  function s() {
    b.length > 0 || _ && (document.removeEventListener("keydown", _), _ = null);
  }
  function h(g) {
    return this.dom = g, this.isOpen = g.getAttribute(p) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, g.hasAttribute("tabindex") || g.setAttribute("tabindex", "-1"), g.hasAttribute("role") || g.setAttribute("role", "dialog"), g.hasAttribute("popover") || g.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  h.prototype.open = function(g) {
    this.isOpen || (this.trigger = g || null, this.dom.setAttribute(p, "open"));
  }, h.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(p, "closed");
  }, h.prototype.toggle = function(g) {
    this.isOpen ? this.close() : this.open(g);
  }, h.prototype._applyOpen = function(g) {
    this.isOpen = !0, g && (this.trigger = g), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const a = xt(this.dom);
    if (this.trigger) {
      const e = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(v) || "bottom", o = Et(e, a, t, 8);
      this.dom.style.top = o.top + "px", this.dom.style.left = o.left + "px", this.dom.setAttribute("data-ln-popover-placement", o.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const l = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), i = Array.prototype.find.call(l, vt);
    i ? i.focus() : this.dom.focus();
    const r = this;
    this._boundDocClick = function(e) {
      r.dom.contains(e.target) || r.trigger && r.trigger.contains(e.target) || r.close();
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!r.trigger) return;
      const e = r.trigger.getBoundingClientRect(), t = xt(r.dom), o = r.dom.getAttribute(v) || "bottom", n = Et(e, t, o, 8);
      r.dom.style.top = n.top + "px", r.dom.style.left = n.left + "px", r.dom.setAttribute("data-ln-popover-placement", n.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), b.push(this), f(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, h.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const g = b.indexOf(this);
    g !== -1 && b.splice(g, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, h.prototype.destroy = function() {
    this.dom[d] && (this.isOpen && this._applyClose(), delete this.dom[d], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function u(g) {
    this.dom = g;
    const a = g.getAttribute(E);
    return g.setAttribute("aria-haspopup", "dialog"), g.setAttribute("aria-expanded", "false"), g.setAttribute("aria-controls", a), this._onClick = function(l) {
      if (l.ctrlKey || l.metaKey || l.button === 1) return;
      l.preventDefault();
      const i = document.getElementById(a);
      !i || !i[d] || i[d].toggle(g);
    }, g.addEventListener("click", this._onClick), this;
  }
  u.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[d + "Trigger"];
  }, U(p, d, h, "ln-popover", {
    onAttributeChange: function(g) {
      const a = g[d];
      if (!a) return;
      const i = g.getAttribute(p) === "open";
      if (i !== a.isOpen)
        if (i) {
          if (G(g, "ln-popover:before-open", {
            popoverId: g.id,
            target: g,
            trigger: a.trigger
          }).defaultPrevented) {
            g.setAttribute(p, "closed");
            return;
          }
          a._applyOpen(a.trigger);
        } else {
          if (G(g, "ln-popover:before-close", {
            popoverId: g.id,
            target: g,
            trigger: a.trigger
          }).defaultPrevented) {
            g.setAttribute(p, "open");
            return;
          }
          a._applyClose();
        }
    }
  }), U(E, d + "Trigger", u, "ln-popover-trigger");
})();
(function() {
  const p = "data-ln-tooltip-enhance", d = "data-ln-tooltip", E = "data-ln-tooltip-position", v = "lnTooltipEnhance", b = "ln-tooltip-portal";
  if (window[v] !== void 0) return;
  let _ = 0, f = null, s = null, h = null, u = null, g = null, a = null;
  function l() {
    return f && f.parentNode || (f = document.getElementById(b), f || (f = document.createElement("div"), f.id = b, document.body.appendChild(f)), f.hasAttribute("popover") || f.setAttribute("popover", "manual")), f;
  }
  function i() {
    a || (a = function(n) {
      n.key === "Escape" && t();
    }, document.addEventListener("keydown", a));
  }
  function r() {
    a && (document.removeEventListener("keydown", a), a = null);
  }
  function e(n) {
    if (h === n) return;
    t();
    const m = n.getAttribute(d) || n.getAttribute("title");
    if (!m) return;
    l(), typeof f.showPopover == "function" && f.showPopover(), n.hasAttribute("title") && (u = n.getAttribute("title"), n.removeAttribute("title"));
    const c = n.getAttribute("aria-describedby");
    c ? g = c : g = null;
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = m, n[v + "Uid"] || (_ += 1, n[v + "Uid"] = "ln-tooltip-" + _), y.id = n[v + "Uid"], f.appendChild(y);
    const w = y.offsetWidth, A = y.offsetHeight, L = n.getBoundingClientRect(), C = n.getAttribute(E) || "top", k = Et(L, { width: w, height: A }, C, 6);
    y.style.top = k.top + "px", y.style.left = k.left + "px", y.setAttribute("data-ln-tooltip-placement", k.placement), g ? n.setAttribute("aria-describedby", g + " " + y.id) : n.setAttribute("aria-describedby", y.id), s = y, h = n, i();
  }
  function t() {
    if (!s) {
      r();
      return;
    }
    h && (g !== null ? h.setAttribute("aria-describedby", g) : h.removeAttribute("aria-describedby"), g = null, u !== null && h.setAttribute("title", u)), u = null, s.parentNode && s.parentNode.removeChild(s), s = null, h = null, f && typeof f.hidePopover == "function" && f.matches(":popover-open") && f.hidePopover(), r();
  }
  function o(n) {
    return this.dom = n, n.hasAttribute("data-ln-tooltip-enhanced") || (n.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      e(n);
    }, this._onLeave = function() {
      h === n && !n.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      e(n);
    }, this._onBlur = function() {
      h === n && !n.matches(":hover") && t();
    }, n.addEventListener("mouseenter", this._onEnter), n.addEventListener("mouseleave", this._onLeave), n.addEventListener("focus", this._onFocus, !0), n.addEventListener("blur", this._onBlur, !0), this;
  }
  o.prototype.destroy = function() {
    const n = this.dom;
    n.removeEventListener("mouseenter", this._onEnter), n.removeEventListener("mouseleave", this._onLeave), n.removeEventListener("focus", this._onFocus, !0), n.removeEventListener("blur", this._onBlur, !0), h === n && t(), this._addedEnhancedAttr && n.removeAttribute("data-ln-tooltip-enhanced"), delete n[v], delete n[v + "Uid"], S(n, "ln-tooltip:destroyed", { trigger: n });
  }, U(
    "[" + p + "], [data-ln-tooltip-enhanced], [" + d + "][title]",
    v,
    o,
    "ln-tooltip"
  );
})();
(function() {
  const p = "data-ln-toast", d = "lnToast", E = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function v(e) {
    if (!(!e || !(e instanceof HTMLElement)) && (e.hasAttribute("popover") || e.setAttribute("popover", "manual"), typeof e.showPopover == "function")) {
      if (e.matches(":popover-open"))
        try {
          e.hidePopover();
        } catch {
        }
      try {
        e.showPopover();
      } catch {
      }
    }
  }
  function b(e) {
    if (!e || !(e instanceof HTMLElement)) return;
    if (e.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof e.hidePopover == "function" && e.matches(":popover-open"))
      try {
        e.hidePopover();
      } catch {
      }
  }
  function _(e) {
    if (!e || e.nodeType !== 1) return;
    const t = Array.from(e.querySelectorAll("[" + p + "]"));
    e.hasAttribute && e.hasAttribute(p) && t.push(e);
    for (const o of t)
      o[d] || new f(o);
  }
  function f(e) {
    this.dom = e, e[d] = this, this.timeoutDefault = parseInt(e.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(e.getAttribute("data-ln-toast-max") || "5", 10);
    const t = Array.from(e.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length > this.max; ) e.removeChild(t.shift());
    for (const o of t) l(o, this);
    return t.length > 0 && v(e), this;
  }
  f.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const e of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        g(e);
      b(this.dom), delete this.dom[d];
    }
  };
  function s(e, t) {
    const o = ((e.type || "") + "").trim().toLowerCase(), n = lt(t, E, "ln-toast");
    if (!n)
      return console.warn('[ln-toast] Template "' + E + '" not found'), null;
    Q(n, {
      type: o,
      title: e.title,
      message: typeof e.message == "string" ? e.message : void 0
    });
    const m = n.firstElementChild;
    if (!m) return null;
    m.hasAttribute("data-ln-toast-item") || m.setAttribute("data-ln-toast-item", ""), m.classList.add("ln-enter");
    const c = m.querySelector(".body");
    c && h(c, e);
    const y = m.querySelector("[data-ln-toast-close]");
    return y && y.addEventListener("click", function() {
      g(m);
    }), m;
  }
  function h(e, t) {
    if (Array.isArray(t.message)) {
      const o = document.createElement("ul");
      for (const n of t.message) {
        const m = document.createElement("li");
        m.textContent = n, o.appendChild(m);
      }
      e.appendChild(o);
    }
    if (t.data && t.data.errors) {
      const o = document.createElement("ul");
      for (const n of Object.values(t.data.errors).flat()) {
        const m = document.createElement("li");
        m.textContent = n, o.appendChild(m);
      }
      e.appendChild(o);
    }
  }
  function u(e, t) {
    const o = Array.from(e.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; o.length >= e.max && o.length > 0; ) e.dom.removeChild(o.shift());
    e.dom.appendChild(t), v(e.dom), requestAnimationFrame(() => t.classList.remove("ln-enter"));
  }
  function g(e) {
    if (!e || !e.parentNode) return;
    const t = e.parentNode;
    clearTimeout(e._timer), e.classList.remove("ln-enter"), e.classList.add("ln-out"), setTimeout(() => {
      e.parentNode && (e.parentNode.removeChild(e), b(t));
    }, 200);
  }
  function a(e) {
    let t = e && e.container;
    return typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + p + "]") || document.getElementById("ln-toast-container")), t || null;
  }
  function l(e, t) {
    if (e._lnToastHydrated) return;
    e._lnToastHydrated = !0;
    const o = e.querySelector("[data-ln-toast-close]");
    o && o.addEventListener("click", function() {
      g(e);
    });
    const n = e.getAttribute("data-ln-toast-timeout"), m = n !== null ? parseInt(n, 10) : NaN, c = Number.isFinite(m) ? m : t.timeoutDefault;
    c > 0 && (e._timer = setTimeout(function() {
      g(e);
    }, c));
  }
  function i(e) {
    const t = e.detail || {}, o = a(t);
    if (!o) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const n = o[d] || new f(o), m = s(t, o);
    if (!m) return;
    const c = Number.isFinite(t.timeout) ? t.timeout : n.timeoutDefault;
    u(n, m), c > 0 && (m._timer = setTimeout(() => g(m), c));
  }
  function r(e) {
    const t = e && e.detail || {};
    if (t.container) {
      const o = a(t);
      if (o)
        for (const n of Array.from(o.querySelectorAll("[data-ln-toast-item]"))) g(n);
    } else {
      const o = document.querySelectorAll("[" + p + "]");
      for (const n of Array.from(o))
        for (const m of Array.from(n.querySelectorAll("[data-ln-toast-item]"))) g(m);
    }
  }
  tt(function() {
    window.addEventListener("ln-toast:enqueue", i), window.addEventListener("ln-toast:clear", r), window.addEventListener("ln-modal:open", function() {
      const t = document.querySelectorAll("[" + p + "]");
      for (const o of Array.from(t))
        o.querySelectorAll("[data-ln-toast-item]").length > 0 && v(o);
    }), new MutationObserver(function(t) {
      for (const o of t) {
        if (o.type === "attributes") {
          _(o.target);
          continue;
        }
        for (const n of o.addedNodes)
          _(n);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [p] }), _(document.body);
  }, "ln-toast");
})();
(function() {
  const p = "data-ln-upload", d = "lnUpload", E = "data-ln-upload-dict", v = "data-ln-upload-accept", b = "data-ln-upload-context", _ = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function f() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const r = document.createElement("div");
    r.innerHTML = _;
    const e = r.firstElementChild;
    e && document.body.appendChild(e);
  }
  if (window[d] !== void 0) return;
  function s(r) {
    if (r === 0) return "0 B";
    const e = 1024, t = ["B", "KB", "MB", "GB"], o = Math.floor(Math.log(r) / Math.log(e));
    return parseFloat((r / Math.pow(e, o)).toFixed(1)) + " " + t[o];
  }
  function h(r) {
    return r.split(".").pop().toLowerCase();
  }
  function u(r) {
    return r === "docx" && (r = "doc"), ["pdf", "doc", "epub"].includes(r) ? "lnc-file-" + r : "ln-file";
  }
  function g(r, e) {
    if (!e) return !0;
    const t = "." + h(r.name);
    return e.split(",").map(function(n) {
      return n.trim().toLowerCase();
    }).includes(t.toLowerCase());
  }
  function a(r) {
    if (r.hasAttribute("data-ln-upload-initialized")) return;
    r.setAttribute("data-ln-upload-initialized", "true"), f();
    const e = Rt(r, E), t = r.querySelector(".ln-upload__zone"), o = r.querySelector(".ln-upload__list"), n = r.getAttribute(v) || "";
    if (!t || !o) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", r);
      return;
    }
    let m = r.querySelector('input[type="file"]');
    m || (m = document.createElement("input"), m.type = "file", m.multiple = !0, m.classList.add("hidden"), n && (m.accept = n.split(",").map(function(P) {
      return P = P.trim(), P.startsWith(".") ? P : "." + P;
    }).join(",")), r.appendChild(m));
    const c = r.getAttribute(p) || "/files/upload", y = r.getAttribute(b) || "", w = r.getAttribute("data-ln-upload-delete") || (c.includes("/upload") ? c.replace(/\/upload\/?$/, "/{id}") : c + "/{id}"), A = /* @__PURE__ */ new Map();
    let L = 0;
    function C() {
      const P = document.querySelector('meta[name="csrf-token"]');
      return P ? P.getAttribute("content") : "";
    }
    function k(P) {
      if (!g(P, n)) {
        const F = e["invalid-type"];
        S(r, "ln-upload:invalid", {
          file: P,
          message: F
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: e["invalid-title"] || "Invalid File",
          message: F || e["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const K = "file-" + ++L, W = h(P.name), ft = u(W), et = lt(r, "ln-upload-item", "ln-upload");
      if (!et) return;
      const J = et.firstElementChild;
      if (!J) return;
      J.setAttribute("data-file-id", K), Q(J, {
        name: P.name,
        sizeText: "0%",
        iconHref: "#" + ft,
        removeLabel: e.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const T = J.querySelector(".ln-upload__progress-bar"), x = J.querySelector('[data-ln-upload-action="remove"]');
      x && (x.disabled = !0), o.appendChild(J);
      const I = new FormData();
      I.append("file", P);
      const N = /* @__PURE__ */ new Set();
      r.querySelectorAll("input, select, textarea").forEach(function(F) {
        if (F.name && F.name !== "file_ids[]" && F.type !== "file") {
          if ((F.type === "checkbox" || F.type === "radio") && !F.checked)
            return;
          I.append(F.name, F.value), N.add(F.name);
        }
      }), !N.has("context") && y && I.append("context", y);
      const R = new XMLHttpRequest();
      R.upload.addEventListener("progress", function(F) {
        if (F.lengthComputable) {
          const z = Math.round(F.loaded / F.total * 100);
          T.style.width = z + "%", Q(J, { sizeText: z + "%" });
        }
      }), R.addEventListener("load", function() {
        if (R.status >= 200 && R.status < 300) {
          let F;
          try {
            F = JSON.parse(R.responseText);
          } catch {
            H("Invalid response");
            return;
          }
          Q(J, { sizeText: s(F.size || P.size), uploading: !1 }), x && (x.disabled = !1), A.set(K, {
            serverId: F.id,
            name: F.name,
            size: F.size
          }), q(), S(r, "ln-upload:uploaded", {
            localId: K,
            serverId: F.id,
            name: F.name
          });
        } else {
          let F = e["upload-failed"] || "Upload failed";
          try {
            F = JSON.parse(R.responseText).message || F;
          } catch {
          }
          H(F);
        }
      }), R.addEventListener("error", function() {
        H(e["network-error"] || "Network error");
      });
      function H(F) {
        T && (T.style.width = "100%"), Q(J, { sizeText: e.error || "Error", uploading: !1, error: !0 }), x && (x.disabled = !1), S(r, "ln-upload:error", {
          file: P,
          message: F
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: e["error-title"] || "Upload Error",
          message: F || e["upload-failed"] || "Failed to upload file"
        });
      }
      R.open("POST", c), R.setRequestHeader("X-CSRF-TOKEN", C()), R.setRequestHeader("Accept", "application/json"), R.send(I);
    }
    function q() {
      for (const P of r.querySelectorAll('input[name="file_ids[]"]'))
        P.remove();
      for (const [, P] of A) {
        const K = document.createElement("input");
        K.type = "hidden", K.name = "file_ids[]", K.value = P.serverId, r.appendChild(K);
      }
    }
    function D(P) {
      const K = A.get(P), W = o.querySelector('[data-file-id="' + P + '"]');
      if (!K || !K.serverId) {
        W && W.remove(), A.delete(P), q();
        return;
      }
      W && Q(W, { deleting: !0 });
      const ft = w.replace("{id}", K.serverId);
      fetch(ft, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": C(),
          Accept: "application/json"
        }
      }).then(function(et) {
        et.status === 200 ? (W && W.remove(), A.delete(P), q(), S(r, "ln-upload:removed", {
          localId: P,
          serverId: K.serverId
        })) : (W && Q(W, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: e["delete-title"] || "Error",
          message: e["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(et) {
        console.warn("[ln-upload] Delete error:", et), W && Q(W, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: e["network-error"] || "Network error",
          message: e["connection-error"] || "Could not connect to server"
        });
      });
    }
    function M(P) {
      for (const K of P)
        k(K);
      m.value = "";
    }
    const O = function() {
      m.click();
    }, B = function() {
      M(this.files);
    }, j = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, ot = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, Z = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover");
    }, bt = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover"), M(P.dataTransfer.files);
    }, yt = function(P) {
      const K = P.target.closest('[data-ln-upload-action="remove"]');
      if (!K || !o.contains(K) || K.disabled) return;
      const W = K.closest(".ln-upload__item");
      W && D(W.getAttribute("data-file-id"));
    };
    t.addEventListener("click", O), m.addEventListener("change", B), t.addEventListener("dragenter", j), t.addEventListener("dragover", ot), t.addEventListener("dragleave", Z), t.addEventListener("drop", bt), o.addEventListener("click", yt), r.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(A.values()).map(function(P) {
          return P.serverId;
        });
      },
      getFiles: function() {
        return Array.from(A.values());
      },
      clear: function() {
        for (const [, P] of A)
          if (P.serverId) {
            const K = w.replace("{id}", P.serverId);
            fetch(K, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": C(),
                Accept: "application/json"
              }
            });
          }
        A.clear(), o.innerHTML = "", q(), S(r, "ln-upload:cleared", {});
      },
      destroy: function() {
        t.removeEventListener("click", O), m.removeEventListener("change", B), t.removeEventListener("dragenter", j), t.removeEventListener("dragover", ot), t.removeEventListener("dragleave", Z), t.removeEventListener("drop", bt), o.removeEventListener("click", yt), A.clear(), o.innerHTML = "", q(), r.removeAttribute("data-ln-upload-initialized"), delete r.lnUploadAPI;
      }
    };
  }
  function l() {
    for (const r of document.querySelectorAll("[" + p + "]"))
      a(r);
  }
  function i() {
    tt(function() {
      new MutationObserver(function(e) {
        for (const t of e)
          if (t.type === "childList") {
            for (const o of t.addedNodes)
              if (o.nodeType === 1) {
                o.hasAttribute(p) && a(o);
                for (const n of o.querySelectorAll("[" + p + "]"))
                  a(n);
              }
          } else t.type === "attributes" && t.target.hasAttribute(p) && a(t.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-upload");
  }
  window[d] = {
    init: a,
    initAll: l
  }, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const p = "lnExternalLinks";
  if (window[p] !== void 0) return;
  function d(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function E(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !d(s)) return;
    s.target = "_blank";
    const h = (s.rel || "").split(/\s+/).filter(Boolean);
    h.includes("noopener") || h.push("noopener"), h.includes("noreferrer") || h.push("noreferrer"), s.rel = h.join(" ");
    const u = document.createElement("span");
    u.className = "sr-only", u.textContent = "(opens in new tab)", s.appendChild(u), s.setAttribute("data-ln-external-link", "processed"), S(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function v(s) {
    s = s || document.body;
    for (const h of s.querySelectorAll("a, area"))
      E(h);
  }
  function b() {
    tt(function() {
      document.body.addEventListener("click", function(s) {
        const h = s.target.closest("a, area");
        h && h.getAttribute("data-ln-external-link") === "processed" && S(h, "ln-external-links:clicked", {
          link: h,
          href: h.href,
          text: h.textContent || h.title || ""
        });
      });
    }, "ln-external-links");
  }
  function _() {
    tt(function() {
      new MutationObserver(function(h) {
        for (const u of h) {
          if (u.type === "childList") {
            for (const g of u.addedNodes)
              if (g.nodeType === 1 && (g.matches && (g.matches("a") || g.matches("area")) && E(g), g.querySelectorAll))
                for (const a of g.querySelectorAll("a, area"))
                  E(a);
          }
          if (u.type === "attributes" && u.attributeName === "href") {
            const g = u.target;
            g.matches && (g.matches("a") || g.matches("area")) && E(g);
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
  function f() {
    b(), _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      v();
    }) : v();
  }
  window[p] = {
    process: v
  }, f();
})();
(function() {
  const p = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  let E = null;
  function v() {
    E = document.createElement("div"), E.className = "ln-link-status", document.body.appendChild(E);
  }
  function b(o) {
    E && (E.textContent = o, E.classList.add("ln-link-status--visible"));
  }
  function _() {
    E && E.classList.remove("ln-link-status--visible");
  }
  function f(o, n) {
    if (n.target.closest("a, button, input, select, textarea")) return;
    const m = o.querySelector("a");
    if (!m) return;
    const c = m.getAttribute("href");
    if (!c) return;
    if (n.ctrlKey || n.metaKey || n.button === 1) {
      window.open(c, "_blank");
      return;
    }
    G(o, "ln-link:navigate", { target: o, href: c, link: m }).defaultPrevented || m.click();
  }
  function s(o) {
    const n = o.querySelector("a");
    if (!n) return;
    const m = n.getAttribute("href");
    m && b(m);
  }
  function h() {
    _();
  }
  function u(o) {
    o[d + "Row"] || !o.querySelector("a") || (o[d + "Row"] = !0, o._lnLinkClick = function(m) {
      f(o, m);
    }, o._lnLinkEnter = function() {
      s(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", h));
  }
  function g(o) {
    o[d + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", h), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[d + "Row"]);
  }
  function a(o) {
    if (!o[d + "Init"]) return;
    const n = o.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const m = n === "TABLE" && o.querySelector("tbody") || o;
      for (const c of m.querySelectorAll("tr"))
        g(c);
    } else
      g(o);
    delete o[d + "Init"];
  }
  function l(o) {
    if (o[d + "Init"]) return;
    o[d + "Init"] = !0;
    const n = o.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const m = n === "TABLE" && o.querySelector("tbody") || o;
      for (const c of m.querySelectorAll("tr"))
        u(c);
    } else
      u(o);
  }
  function i(o) {
    o.hasAttribute && o.hasAttribute(p) && l(o);
    const n = o.querySelectorAll ? o.querySelectorAll("[" + p + "]") : [];
    for (const m of n)
      l(m);
  }
  function r() {
    tt(function() {
      new MutationObserver(function(n) {
        for (const m of n)
          if (m.type === "childList") {
            for (const c of m.addedNodes)
              if (c.nodeType === 1) {
                i(c);
                const y = c.closest("[" + p + "]");
                if (y)
                  if (c.tagName === "TR")
                    u(c);
                  else {
                    const w = y.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const A = c.querySelectorAll ? c.querySelectorAll("tr") : [];
                      for (const L of A)
                        u(L);
                    }
                  }
              }
          } else m.type === "attributes" && (m.target.hasAttribute && m.target.hasAttribute(p) ? i(m.target) : a(m.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-link");
  }
  function e(o) {
    i(o);
  }
  window[d] = { init: e, destroy: a };
  function t() {
    v(), r(), e(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const p = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0) return;
  function E(f) {
    return this.dom = f, this._attrObserver = null, this._parentObserver = null, _.call(this), v.call(this), b.call(this), this;
  }
  E.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[d]);
  };
  function v() {
    const f = this, s = new MutationObserver(function(h) {
      for (const u of h)
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && _.call(f);
    });
    s.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = s;
  }
  function b() {
    const f = this, s = this.dom.parentElement;
    if (!s) return;
    const h = new MutationObserver(function(u) {
      for (const g of u)
        g.attributeName === "data-ln-progress-max" && _.call(f);
    });
    h.observe(s, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = h;
  }
  function _() {
    const f = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, s = this.dom.parentElement, u = (s && s.hasAttribute("data-ln-progress-max") ? parseFloat(s.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let g = u > 0 ? f / u * 100 : 0;
    g < 0 && (g = 0), g > 100 && (g = 100), this.dom.style.width = g + "%";
    const a = Math.max(0, Math.min(f, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(a)), S(this.dom, "ln-progress:change", { target: this.dom, value: f, max: u, percentage: g });
  }
  U(
    p,
    d,
    E,
    "ln-progress"
  );
})();
(function() {
  const p = "data-ln-filter", d = "lnFilter", E = "data-ln-filter-initialized", v = "data-ln-filter-key", b = "data-ln-filter-value", _ = "data-ln-filter-hide", f = "data-ln-filter-reset", s = "data-ln-filter-col", h = /* @__PURE__ */ new WeakMap();
  if (window[d] !== void 0) return;
  function u(r) {
    return r.hasAttribute(f) || r.getAttribute(b) === "";
  }
  function g(r) {
    let e = r._filterKey;
    const t = [];
    for (let o = 0; o < r.inputs.length; o++) {
      const n = r.inputs[o];
      if (n.checked && !u(n)) {
        const m = n.getAttribute(b);
        m && t.push(m);
      }
    }
    return { key: e, values: t };
  }
  function a(r, e) {
    if (r.length !== e.length) return !0;
    for (let t = 0; t < r.length; t++) if (r[t] !== e[t]) return !0;
    return !1;
  }
  function l(r) {
    const e = r.dom, t = r.colIndex, o = e.querySelector("template");
    if (!o || t === null) return;
    const n = document.getElementById(r.targetId);
    if (!n) return;
    const m = n.tagName === "TABLE" ? n : n.querySelector("table");
    if (!m || n.hasAttribute("data-ln-table")) return;
    const c = {}, y = [], w = m.tBodies;
    for (let C = 0; C < w.length; C++) {
      const k = w[C].rows;
      for (let q = 0; q < k.length; q++) {
        const D = k[q].cells[t], M = D ? D.textContent.trim() : "";
        M && !c[M] && (c[M] = !0, y.push(M));
      }
    }
    y.sort(function(C, k) {
      return C.localeCompare(k);
    });
    const A = e.querySelector("[" + v + "]"), L = A ? A.getAttribute(v) : e.getAttribute("data-ln-filter-key") || "col" + t;
    for (let C = 0; C < y.length; C++) {
      const k = o.content.cloneNode(!0), q = k.querySelector("input");
      q && (q.setAttribute(v, L), q.setAttribute(b, y[C]), _t(k, { text: y[C] }), e.appendChild(k));
    }
  }
  function i(r) {
    if (r.hasAttribute(E)) return this;
    this.dom = r, this.targetId = r.getAttribute(p);
    const e = r.getAttribute(s);
    this.colIndex = e !== null ? parseInt(e, 10) : null, l(this), this.inputs = Array.from(r.querySelectorAll("[" + v + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(v) : null, this._lastSnapshot = null;
    const t = this, o = Nt(
      function() {
        t._render();
      },
      function() {
        t._afterRender();
      }
    );
    this._queueRender = o, this._attachHandlers();
    let n = !1;
    if (r.hasAttribute("data-ln-persist")) {
      const m = St("filter", r);
      if (m && m.key && Array.isArray(m.values) && m.values.length > 0) {
        for (let c = 0; c < this.inputs.length; c++) {
          const y = this.inputs[c];
          u(y) ? y.checked = !1 : y.getAttribute(v) === m.key && m.values.indexOf(y.getAttribute(b)) !== -1 ? y.checked = !0 : y.checked = !1;
        }
        o(), n = !0;
      }
    }
    if (!n) {
      for (let m = 0; m < this.inputs.length; m++)
        if (this.inputs[m].checked && !u(this.inputs[m])) {
          o();
          break;
        }
    }
    return r.setAttribute(E, ""), this;
  }
  i.prototype._attachHandlers = function() {
    const r = this;
    this.inputs.forEach(function(e) {
      e[d + "Bound"] || (e[d + "Bound"] = !0, e._lnFilterChange = function() {
        if (u(e)) {
          for (let t = 0; t < r.inputs.length; t++)
            u(r.inputs[t]) || (r.inputs[t].checked = !1);
          e.checked = !0, r._queueRender();
          return;
        }
        if (e.checked) {
          for (let o = 0; o < r.inputs.length; o++)
            u(r.inputs[o]) && (r.inputs[o].checked = !1);
          let t = !1;
          for (let o = 0; o < r.inputs.length; o++)
            if (u(r.inputs[o])) {
              t = !0;
              break;
            }
          if (t) {
            let o = !0;
            for (let n = 0; n < r.inputs.length; n++)
              if (!u(r.inputs[n]) && !r.inputs[n].checked) {
                o = !1;
                break;
              }
            if (o)
              for (let n = 0; n < r.inputs.length; n++)
                u(r.inputs[n]) ? r.inputs[n].checked = !0 : r.inputs[n].checked = !1;
          }
        } else {
          let t = !1;
          for (let o = 0; o < r.inputs.length; o++)
            if (!u(r.inputs[o]) && r.inputs[o].checked) {
              t = !0;
              break;
            }
          if (!t)
            for (let o = 0; o < r.inputs.length; o++)
              u(r.inputs[o]) && (r.inputs[o].checked = !0);
        }
        r._queueRender();
      }, e.addEventListener("change", e._lnFilterChange));
    });
  }, i.prototype._render = function() {
    const r = this, e = g(this), t = e.key === null || e.values.length === 0, o = [];
    for (let n = 0; n < e.values.length; n++)
      o.push(e.values[n].toLowerCase());
    if (r.colIndex !== null)
      r._filterTableRows(e);
    else {
      const n = document.getElementById(r.targetId);
      if (!n) return;
      const m = n.children;
      for (let c = 0; c < m.length; c++) {
        const y = m[c];
        if (t) {
          y.removeAttribute(_);
          continue;
        }
        const w = y.getAttribute("data-" + e.key);
        y.removeAttribute(_), w !== null && o.indexOf(w.toLowerCase()) === -1 && y.setAttribute(_, "true");
      }
    }
  }, i.prototype._afterRender = function() {
    const r = g(this), e = this._lastSnapshot;
    if (!e || e.key !== r.key || a(e.values, r.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: r.key,
        values: r.values.slice()
      });
      const o = e && e.values.length > 0, n = r.values.length === 0;
      o && n && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: r.key, values: r.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (r.key && r.values.length > 0 ? ct("filter", this.dom, { key: r.key, values: r.values.slice() }) : ct("filter", this.dom, null));
  }, i.prototype._dispatchOnBoth = function(r, e) {
    S(this.dom, r, e);
    const t = document.getElementById(this.targetId);
    t && t !== this.dom && S(t, r, e);
  }, i.prototype._filterTableRows = function(r) {
    const e = document.getElementById(this.targetId);
    if (!e) return;
    const t = e.tagName === "TABLE" ? e : e.querySelector("table");
    if (!t || e.hasAttribute("data-ln-table")) return;
    const o = r.key || this._filterKey, n = r.values;
    h.has(t) || h.set(t, {});
    const m = h.get(t);
    if (o && n.length > 0) {
      const A = [];
      for (let L = 0; L < n.length; L++)
        A.push(n[L].toLowerCase());
      m[o] = { col: this.colIndex, values: A };
    } else o && delete m[o];
    const c = Object.keys(m), y = c.length > 0, w = t.tBodies;
    for (let A = 0; A < w.length; A++) {
      const L = w[A].rows;
      for (let C = 0; C < L.length; C++) {
        const k = L[C];
        if (!y) {
          k.removeAttribute(_);
          continue;
        }
        let q = !0;
        for (let D = 0; D < c.length; D++) {
          const M = m[c[D]], O = k.cells[M.col], B = O ? O.textContent.trim().toLowerCase() : "";
          if (M.values.indexOf(B) === -1) {
            q = !1;
            break;
          }
        }
        q ? k.removeAttribute(_) : k.setAttribute(_, "true");
      }
    }
  }, i.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const e = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (e && h.has(e)) {
            const t = h.get(e), o = this._filterKey;
            o && t[o] && delete t[o], Object.keys(t).length === 0 && h.delete(e);
          }
        }
      }
      this.inputs.forEach(function(r) {
        r._lnFilterChange && (r.removeEventListener("change", r._lnFilterChange), delete r._lnFilterChange), delete r[d + "Bound"];
      }), this.dom.removeAttribute(E), delete this.dom[d];
    }
  }, U(p, d, i, "ln-filter");
})();
(function() {
  const p = "data-ln-search", d = "lnSearch", E = "data-ln-search-initialized", v = "data-ln-search-hide";
  if (window[d] !== void 0) return;
  function _(f) {
    if (f.hasAttribute(E)) return this;
    this.dom = f, this.targetId = f.getAttribute(p);
    const s = f.tagName;
    this.input = s === "INPUT" || s === "TEXTAREA" ? f : f.querySelector('[name="search"]') || f.querySelector('input[type="search"]') || f.querySelector('input[type="text"]'), this.itemsSelector = f.getAttribute("data-ln-search-items") || null;
    const h = f.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = h !== null ? parseInt(h, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const u = this;
      queueMicrotask(function() {
        u._search(u.input.value.trim().toLowerCase());
      });
    }
    return f.setAttribute(E, ""), this;
  }
  _.prototype._attachHandler = function() {
    if (!this.input) return;
    const f = this, s = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = s ? s.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      f.input.value = "", f._search(""), f.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(f._debounceTimer), f._debounceTimer = setTimeout(function() {
        f._search(f.input.value.trim().toLowerCase());
      }, f.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, _.prototype._search = function(f) {
    const s = document.getElementById(this.targetId);
    if (!s || G(s, "ln-search:change", { term: f, targetId: this.targetId }).defaultPrevented) return;
    const u = this.itemsSelector ? s.querySelectorAll(this.itemsSelector) : s.children;
    for (let g = 0; g < u.length; g++) {
      const a = u[g];
      a.removeAttribute(v), f && !a.textContent.replace(/\s+/g, " ").toLowerCase().includes(f) && a.setAttribute(v, "true");
    }
  }, _.prototype.destroy = function() {
    this.dom[d] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(E), delete this.dom[d]);
  }, U(p, d, _, "ln-search");
})();
(function() {
  const p = "lnTableSort", d = "data-ln-table-sort", E = "data-ln-table-col-sort";
  if (window[p] !== void 0) return;
  function v(s) {
    b(s);
  }
  function b(s) {
    const h = Array.from(s.querySelectorAll("table"));
    s.tagName === "TABLE" && h.push(s), h.forEach(function(u) {
      if (u[p]) return;
      const g = Array.from(u.querySelectorAll("th[" + d + "]"));
      g.length && (u[p] = new _(u, g));
    });
  }
  function _(s, h) {
    this.table = s, this.ths = h, this._col = -1, this._dir = null;
    const u = this;
    h.forEach(function(a, l) {
      if (a[p + "Bound"]) return;
      a[p + "Bound"] = !0;
      const i = a.querySelector("[" + E + "]");
      i && (i._lnSortClick = function() {
        u._handleClick(l, a);
      }, i.addEventListener("click", i._lnSortClick));
    });
    const g = s.closest("[data-ln-table][data-ln-persist]");
    if (g) {
      const a = St("table-sort", g);
      a && a.dir && a.col >= 0 && a.col < h.length && this._applySort(a.col, h[a.col], a.dir);
    }
    return this;
  }
  _.prototype._applySort = function(s, h, u) {
    this.ths.forEach(function(g) {
      g.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), u === null ? (this._col = -1, this._dir = null) : (this._col = s, this._dir = u, h.classList.add(u === "asc" ? "ln-sort-asc" : "ln-sort-desc")), S(this.table, "ln-table:sort", {
      column: s,
      sortType: h.getAttribute(d),
      direction: u
    });
  }, _.prototype._handleClick = function(s, h) {
    let u;
    this._col !== s ? u = "asc" : this._dir === "asc" ? u = "desc" : this._dir === "desc" ? u = null : u = "asc", this._applySort(s, h, u);
    const g = this.table.closest("[data-ln-table][data-ln-persist]");
    g && (u === null ? ct("table-sort", g, null) : ct("table-sort", g, { col: s, dir: u }));
  }, _.prototype.destroy = function() {
    this.table[p] && (this.ths.forEach(function(s) {
      const h = s.querySelector("[" + E + "]");
      h && h._lnSortClick && (h.removeEventListener("click", h._lnSortClick), delete h._lnSortClick), delete s[p + "Bound"];
    }), delete this.table[p]);
  };
  function f() {
    tt(function() {
      new MutationObserver(function(h) {
        h.forEach(function(u) {
          u.type === "childList" ? u.addedNodes.forEach(function(g) {
            g.nodeType === 1 && b(g);
          }) : u.type === "attributes" && b(u.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table-sort");
  }
  window[p] = v, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const p = "data-ln-table", d = "lnTable", E = "data-ln-table-sort", v = "data-ln-table-empty";
  if (window[d] !== void 0) return;
  const u = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function g(i, r) {
    if (i == null || isNaN(i)) return "";
    try {
      return new Intl.NumberFormat(V(r)).format(i);
    } catch {
      return String(i);
    }
  }
  function a(i) {
    let r = i.parentElement;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const t = getComputedStyle(r).overflowY;
      if (t === "auto" || t === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function l(i) {
    this.dom = i, this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead");
    const r = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = r ? Array.from(r.querySelectorAll("th")) : [], this.isDataDriven = i.hasAttribute("data-ln-table-source"), this.name = i.getAttribute(p) || "", this.source = i.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const e = this;
    if (this._onColumnFilter = function(t) {
      const o = t.detail.key;
      let n = null;
      for (let y = 0; y < e.ths.length; y++)
        if (e.ths[y].getAttribute("data-ln-table-filter-col") === o) {
          n = e.ths[y];
          break;
        }
      if (!n) return;
      const m = t.detail.values, c = n.querySelector("[data-ln-table-col-filter]");
      if (c && c.classList.toggle("ln-filter-active", !!(m && m.length > 0)), e.isDataDriven)
        !m || m.length === 0 ? delete e.currentFilters[o] : e.currentFilters[o] = m, e._requestData();
      else {
        if (!m || m.length === 0)
          delete e._columnFilters[o];
        else {
          const y = [];
          for (let w = 0; w < m.length; w++)
            y.push(m[w].toLowerCase());
          e._columnFilters[o] = y;
        }
        e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), S(i, "ln-table:filter", {
          term: e._searchTerm,
          matched: e._filteredData.length,
          total: e._data.length
        });
      }
    }, this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && i.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._totalSpan = i.querySelector("[data-ln-table-total]"), this._filteredSpan = i.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.parentElement : null), this._selectedSpan = i.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.parentElement : null), this._onSetData = function(o) {
        const n = o.detail || {};
        if (e._windowed) {
          i.classList.remove("ln-table--loading"), e._cache.ingest(n);
          return;
        }
        e._data = n.data || [], e._lastTotal = n.total != null ? n.total : e._data.length, e._lastFiltered = n.filtered != null ? n.filtered : e._data.length, e.totalCount = e._lastTotal, e.visibleCount = e._lastFiltered, e.isLoaded = !0, i.classList.remove("ln-table--loading"), e._vStart = -1, e._vEnd = -1, e._applyFilterAndSort(), e._render(), e._updateFooter(), S(i, "ln-table:rendered", {
          table: e.name,
          total: e.totalCount,
          visible: e.visibleCount
        });
      }, i.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(o) {
        const n = o.detail && o.detail.loading;
        i.classList.toggle("ln-table--loading", !!n), n && (e.isLoaded = !1);
      }, i.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(o) {
        const n = o.target.closest("[data-ln-table-col-sort]");
        if (!n) return;
        const m = n.closest("th");
        if (!m) return;
        const c = m.getAttribute("data-ln-table-col");
        c && e._handleSort(c, m);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), i.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClearAll = function(o) {
        if (o.target.closest("[data-ln-table-clear-all]")) {
          e.currentFilters = {};
          for (let m = 0; m < e.ths.length; m++) {
            const c = e.ths[m].querySelector("[data-ln-table-col-filter]");
            c && c.classList.remove("ln-filter-active");
          }
          S(i, "ln-table:clear-filters", { table: e.name }), e._requestData();
        }
      }, i.addEventListener("click", this._onClearAll), this._selectable = i.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(o) {
        if (o.target.closest("[data-ln-table-row-select]") || o.target.closest("[data-ln-table-row-action]") || o.target.closest("a") || o.target.closest("button") || o.ctrlKey || o.metaKey || o.button === 1) return;
        const n = o.target.closest("[data-ln-table-row]");
        if (!n) return;
        const m = n.getAttribute("data-ln-table-row-id"), c = n._lnRecord || {};
        S(i, "ln-table:row-click", {
          table: e.name,
          id: m,
          record: c
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(o) {
        const n = o.target.closest("[data-ln-table-row-action]");
        if (!n) return;
        o.stopPropagation();
        const m = n.closest("[data-ln-table-row]");
        if (!m) return;
        const c = n.getAttribute("data-ln-table-row-action"), y = m.getAttribute("data-ln-table-row-id"), w = m._lnRecord || {};
        S(i, "ln-table:row-action", {
          table: e.name,
          id: y,
          action: c,
          record: w
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const t = document.querySelector('[data-ln-search="' + i.id + '"]');
      if (t) {
        const o = t.tagName;
        this._searchInput = o === "INPUT" || o === "TEXTAREA" ? t : t.querySelector('input[type="search"]') || t.querySelector('input[type="text"]') || t.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(o) {
        o.preventDefault(), e.currentSearch = o.detail.term, e._searchInput && (e._searchInput.value = o.detail.term), S(i, "ln-table:search", {
          table: e.name,
          query: e.currentSearch
        }), e._requestData();
      }, i.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(o) {
        if (!i.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (o.key === "/") {
          e._searchInput && (o.preventDefault(), e._searchInput.focus());
          return;
        }
        const n = e.tbody ? Array.from(e.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (n.length)
          switch (o.key) {
            case "ArrowDown":
              o.preventDefault(), e._focusedRowIndex = Math.min(e._focusedRowIndex + 1, n.length - 1), e._focusRow(n);
              break;
            case "ArrowUp":
              o.preventDefault(), e._focusedRowIndex = Math.max(e._focusedRowIndex - 1, 0), e._focusRow(n);
              break;
            case "Home":
              o.preventDefault(), e._focusedRowIndex = 0, e._focusRow(n);
              break;
            case "End":
              o.preventDefault(), e._focusedRowIndex = n.length - 1, e._focusRow(n);
              break;
            case "Enter":
              if (e._focusedRowIndex >= 0 && e._focusedRowIndex < n.length) {
                o.preventDefault();
                const m = n[e._focusedRowIndex];
                S(i, "ln-table:row-click", {
                  table: e.name,
                  id: m.getAttribute("data-ln-table-row-id"),
                  record: m._lnRecord || {}
                });
              }
              break;
            case " ":
              if (e._selectable && e._focusedRowIndex >= 0 && e._focusedRowIndex < n.length) {
                o.preventDefault();
                const m = n[e._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                m && (m.checked = !m.checked, m.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : S(i, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        e.tbody.rows.length > 0 && (e._emptyTbodyObserver.disconnect(), e._emptyTbodyObserver = null, e._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(t) {
        t.preventDefault(), e._searchTerm = t.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), e._updateFooter(), S(i, "ln-table:filter", {
          term: e._searchTerm,
          matched: e._filteredData.length,
          total: e._data.length
        });
      }, i.addEventListener("ln-search:change", this._onSearch), this._onSort = function(t) {
        e._sortCol = t.detail.direction === null ? -1 : t.detail.column, e._sortDir = t.detail.direction, e._sortType = t.detail.sortType, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), S(i, "ln-table:sorted", {
          column: t.detail.column,
          direction: t.detail.direction,
          matched: e._filteredData.length,
          total: e._data.length
        });
      }, i.addEventListener("ln-table:sort", this._onSort), i.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(t) {
        if (!t.target.closest("[data-ln-table-clear]")) return;
        e._searchTerm = "";
        const n = document.querySelector('[data-ln-search="' + i.id + '"]');
        if (n) {
          const c = n.tagName === "INPUT" ? n : n.querySelector("input");
          c && (c.value = "");
        }
        e._columnFilters = {};
        for (let c = 0; c < e.ths.length; c++) {
          const y = e.ths[c].querySelector("[data-ln-table-col-filter]");
          y && y.classList.remove("ln-filter-active");
        }
        const m = document.querySelectorAll('[data-ln-filter="' + i.id + '"]');
        for (let c = 0; c < m.length; c++) {
          const y = m[c].querySelector("[data-ln-filter-reset]");
          y && (y.checked = !0, y.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), S(i, "ln-table:filter", {
          term: "",
          matched: e._filteredData.length,
          total: e._data.length
        });
      }, i.addEventListener("click", this._onClear);
    return this;
  }
  l.prototype._parseRows = function() {
    const i = this.tbody.rows, r = this.ths;
    this._data = [];
    const e = [];
    for (let t = 0; t < r.length; t++)
      e[t] = r[t].getAttribute(E);
    i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < i.length; t++) {
      const o = i[t], n = [], m = [], c = [];
      for (let w = 0; w < o.cells.length; w++) {
        const A = o.cells[w], L = A.textContent.trim(), C = Ut(A), k = e[w];
        m[w] = L.toLowerCase(), k === "number" || k === "date" ? n[w] = parseFloat(C) || 0 : k === "string" ? n[w] = String(C) : n[w] = null, w < o.cells.length - 1 && c.push(L.toLowerCase());
      }
      let y = null;
      if (this.isDataDriven) {
        y = {};
        const w = o.getAttribute("data-ln-table-row-id");
        w != null && (y.id = w);
        for (let A = 0; A < r.length; A++) {
          const L = r[A].getAttribute("data-ln-table-col");
          if (L) {
            const C = A;
            if (C < o.cells.length) {
              const k = o.cells[C];
              y[L] = Ut(k);
            }
          }
        }
      }
      this._data.push({
        sortKeys: n,
        rawTexts: m,
        html: o.outerHTML,
        searchText: c.join(" "),
        id: this.isDataDriven && y ? y.id : void 0,
        ...y
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, l.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const i = (this.currentSearch || "").trim().toLowerCase(), r = this.currentFilters || {}, e = Object.keys(r).length > 0;
      if (this._filteredData = this._data.filter(function(y) {
        if (i) {
          let w = !1;
          for (const A in y)
            if (y.hasOwnProperty(A) && typeof y[A] == "string" && A !== "html" && A !== "searchText" && y[A].toLowerCase().indexOf(i) !== -1) {
              w = !0;
              break;
            }
          if (!w) return !1;
        }
        if (e)
          for (const w in r) {
            const A = r[w];
            if (A && A.length > 0) {
              const L = y[w], C = L != null ? String(L) : "";
              if (A.indexOf(C) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const t = this.currentSort.field, n = this.currentSort.direction === "desc" ? -1 : 1;
      let m = null;
      if (this.ths) {
        for (let y = 0; y < this.ths.length; y++)
          if (this.ths[y].getAttribute("data-ln-table-col") === t) {
            m = this.ths[y].getAttribute(E);
            break;
          }
      }
      const c = u ? u.compare : function(y, w) {
        return y < w ? -1 : y > w ? 1 : 0;
      };
      this._filteredData.sort(function(y, w) {
        const A = y[t], L = w[t];
        if (m === "number" || m === "date") {
          const q = parseFloat(A) || 0, D = parseFloat(L) || 0;
          return (q - D) * n;
        }
        if (typeof A == "number" && typeof L == "number")
          return (A - L) * n;
        const C = A != null ? String(A) : "", k = L != null ? String(L) : "";
        return c(C, k) * n;
      });
    } else {
      const i = this._searchTerm, r = this._columnFilters, e = Object.keys(r).length > 0, t = this.ths, o = {};
      if (e)
        for (let w = 0; w < t.length; w++) {
          const A = t[w].getAttribute("data-ln-table-filter-col");
          A && (o[A] = w);
        }
      if (!i && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(w) {
        if (i && w.searchText.indexOf(i) === -1) return !1;
        if (e)
          for (const A in r) {
            const L = o[A];
            if (L !== void 0 && r[A].indexOf(w.rawTexts[L]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const n = this._sortCol, m = this._sortDir === "desc" ? -1 : 1, c = this._sortType === "number" || this._sortType === "date", y = u ? u.compare : function(w, A) {
        return w < A ? -1 : w > A ? 1 : 0;
      };
      this._filteredData.sort(function(w, A) {
        const L = w.sortKeys[n], C = A.sortKeys[n];
        return c ? (L - C) * m : y(L, C) * m;
      });
    }
  }, l.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const i = document.createElement("colgroup");
    this.ths.forEach(function(r) {
      const e = document.createElement("col");
      e.style.width = r.offsetWidth + "px", i.appendChild(e);
    }), this.table.insertBefore(i, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = i;
  }, l.prototype._render = function() {
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
  }, l.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, r = document.createDocumentFragment();
      for (let e = 0; e < i.length; e++) {
        const t = this._buildRow(i[e]);
        if (!t) break;
        r.appendChild(t);
      }
      this.tbody.textContent = "", this.tbody.appendChild(r), this._selectable && this._updateSelectAll();
    } else {
      const i = [], r = this._filteredData;
      for (let e = 0; e < r.length; e++) i.push(r[e].html);
      this.tbody.innerHTML = i.join("");
    }
  }, l.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    if (!this._rowHeight)
      if (this._windowed) {
        let e = null;
        const t = this._cache.peek();
        t ? e = this._buildRow(t) : e = this._buildPlaceholderRow(), e && (this.tbody.textContent = "", this.tbody.appendChild(e), this._rowHeight = e.offsetHeight || 40, this.tbody.textContent = "");
      } else if (this.isDataDriven) {
        if (this._data.length > 0) {
          const e = this._buildRow(this._data[0]);
          e && (this.tbody.textContent = "", this.tbody.appendChild(e), this._rowHeight = e.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const e = this.tbody ? this.tbody.rows : [];
        e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = a(this.dom) : this._scrollContainer = null;
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._windowed ? i._renderWindowed() : i._renderVirtual();
      }));
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, l.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, l.prototype._renderVirtual = function() {
    const i = this._filteredData, r = i.length, e = this._rowHeight;
    if (!e || !r) return;
    const t = this.thead ? this.thead.offsetHeight : 0, o = this._scrollContainer;
    let n, m;
    if (o) {
      const C = this.table.getBoundingClientRect(), k = o.getBoundingClientRect(), q = C.top - k.top + o.scrollTop + t;
      n = o.scrollTop - q, m = o.clientHeight;
    } else {
      const q = this.table.getBoundingClientRect().top + window.scrollY + t;
      n = window.scrollY - q, m = window.innerHeight;
    }
    let c = Math.max(0, Math.floor(n / e) - 15);
    c = Math.min(c, r);
    const y = Math.min(c + Math.ceil(m / e) + 30, r);
    if (c === this._vStart && y === this._vEnd) return;
    this._vStart = c, this._vEnd = y;
    const w = this.ths.length || 1, A = c * e, L = (r - y) * e;
    if (this.isDataDriven) {
      const C = document.createDocumentFragment();
      if (A > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const q = document.createElement("td");
        q.setAttribute("colspan", w), q.style.height = A + "px", k.appendChild(q), C.appendChild(k);
      }
      for (let k = c; k < y; k++) {
        const q = this._buildRow(i[k]);
        q && C.appendChild(q);
      }
      if (L > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const q = document.createElement("td");
        q.setAttribute("colspan", w), q.style.height = L + "px", k.appendChild(q), C.appendChild(k);
      }
      this.tbody.textContent = "", this.tbody.appendChild(C), this._selectable && this._updateSelectAll();
    } else {
      let C = "";
      A > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let k = c; k < y; k++) C += i[k].html;
      L > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
    }
  }, l.prototype._buildPlaceholderRow = function() {
    const i = document.createElement("tr");
    i.className = "ln-table__placeholder", i.setAttribute("aria-hidden", "true");
    const r = document.createElement("td");
    return r.setAttribute("colspan", this.ths.length || 1), r.style.height = this._rowHeight + "px", i.appendChild(r), i;
  }, l.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const i = this._rowHeight;
    if (!i) return;
    const r = this._cache.logicalTotal, e = this.thead ? this.thead.offsetHeight : 0, t = this._scrollContainer;
    let o, n;
    if (t) {
      const C = this.table.getBoundingClientRect(), k = t.getBoundingClientRect(), q = C.top - k.top + t.scrollTop + e;
      o = t.scrollTop - q, n = t.clientHeight;
    } else {
      const q = this.table.getBoundingClientRect().top + window.scrollY + e;
      o = window.scrollY - q, n = window.innerHeight;
    }
    let m = Math.max(0, Math.floor(o / i) - 15);
    m = Math.min(m, r);
    const c = Math.min(m + Math.ceil(n / i) + 30, r), y = this.ths.length || 1, w = m * i, A = (r - c) * i, L = document.createDocumentFragment();
    if (w > 0) {
      const C = document.createElement("tr");
      C.className = "ln-table__spacer", C.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", y), k.style.height = w + "px", C.appendChild(k), L.appendChild(C);
    }
    for (let C = m; C < c; C++)
      if (this._cache.has(C)) {
        const k = this._buildRow(this._cache.get(C));
        k && L.appendChild(k);
      } else
        L.appendChild(this._buildPlaceholderRow());
    if (A > 0) {
      const C = document.createElement("tr");
      C.className = "ln-table__spacer", C.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", y), k.style.height = A + "px", C.appendChild(k), L.appendChild(C);
    }
    this.tbody.textContent = "", this.tbody.appendChild(L), this._vStart = m, this._vEnd = c, this._cache.ensure(m, c);
  }, l.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let r = null;
    if (this.isDataDriven) {
      const e = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount, o = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (t < e || t === 0), n = o ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = lt(this.dom, n, "ln-table"), !r) {
        const m = this.dom.querySelector("template[data-ln-table-empty]");
        if (m) {
          const c = o ? "search" : "initial", y = m.content.querySelector('[data-ln-table-empty-when="' + c + '"]') || m.content.firstElementChild;
          y && (r = document.importNode(y, !0));
        }
      }
      if (r)
        if (r.tagName === "TR")
          this.tbody.appendChild(r);
        else {
          const m = document.createElement("td");
          m.setAttribute("colspan", String(i)), m.appendChild(r);
          const c = document.createElement("tr");
          c.className = "ln-table__empty", c.appendChild(m), this.tbody.appendChild(c);
        }
    } else {
      const e = this.dom.querySelector("template[" + v + "]"), t = document.createElement("td");
      t.setAttribute("colspan", String(i)), e && t.appendChild(document.importNode(e.content, !0));
      const o = document.createElement("tr");
      o.className = "ln-table__empty", o.appendChild(t), this.tbody.appendChild(o);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, l.prototype._fillRow = function(i, r) {
    _t(i, r);
    const e = i.querySelectorAll("[data-ln-table-cell-attr]");
    for (let t = 0; t < e.length; t++) {
      const o = e[t], n = o.getAttribute("data-ln-table-cell-attr").split(",");
      for (let m = 0; m < n.length; m++) {
        const c = n[m].trim().split(":");
        if (c.length !== 2) continue;
        const y = c[0].trim(), w = c[1].trim();
        r[y] != null && o.setAttribute(w, r[y]);
      }
    }
  }, l.prototype._buildRow = function(i) {
    const r = lt(this.dom, this.name + "-row", "ln-table");
    if (!r) return null;
    const e = r.querySelector("[data-ln-table-row]") || r.firstElementChild;
    if (!e) return null;
    if (this._fillRow(e, i), e._lnRecord = i, i.id != null && e.setAttribute("data-ln-table-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      e.classList.add("ln-row-selected");
      const t = e.querySelector("[data-ln-table-row-select]");
      t && (t.checked = !0);
    }
    return e;
  }, l.prototype._handleSort = function(i, r) {
    let e;
    !this.currentSort || this.currentSort.field !== i ? e = "asc" : this.currentSort.direction === "asc" ? e = "desc" : e = null;
    for (let t = 0; t < this.ths.length; t++)
      this.ths[t].classList.remove("ln-sort-asc", "ln-sort-desc");
    e ? (this.currentSort = { field: i, direction: e }, r.classList.add(e === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-table:sort", {
      table: this.name,
      field: i,
      direction: e
    }), this._requestData();
  }, l.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Wt(this, "ln-table:request-data", "table");
  }, l.prototype._enterWindowedMode = function() {
    const i = this, r = this.dom, e = parseInt(r.getAttribute("data-ln-table-window"), 10), t = parseInt(r.getAttribute("data-ln-table-window-page"), 10), o = parseInt(r.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !i._windowed || !i._cache || (i.totalCount = i._cache.grandTotal, i.visibleCount = i._cache.logicalTotal, i._lastTotal = i._cache.grandTotal, i.isLoaded = !0, i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), S(r, "ln-table:rendered", {
        table: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      }));
    }, this._renderBatch = Nt(this._onCacheChange), this._cache = te({
      windowSize: e > 0 ? e : 1e3,
      pageSize: t > 0 ? t : 200,
      threshold: o >= 0 ? o : 25,
      fetchDebounce: 120,
      requestPage: function(n, m, c) {
        S(r, "ln-table:request-data", {
          table: i.name,
          sort: n.sort,
          filters: n.filters,
          search: n.search,
          offset: m,
          limit: c,
          queryGen: i._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, l.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let i = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(i) && this._totalSpan) {
        const e = this._totalSpan.textContent.replace(/[^\d]/g, "");
        e && (i = parseInt(e, 10));
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
  }, l.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, l.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    let r = i.length > 0;
    for (let e = 0; e < i.length; e++) {
      const t = i[e].getAttribute("data-ln-table-row-id");
      if (t != null && !this.selectedIds.has(t)) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
  }, Object.defineProperty(l.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), l.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    if (this._onSelectionChange = function(r) {
      const e = r.target.closest("[data-ln-table-row-select]");
      if (!e) return;
      const t = e.closest("[data-ln-table-row]");
      if (!t) return;
      const o = t.getAttribute("data-ln-table-row-id");
      o != null && (e.checked ? (i.selectedIds.add(o), t.classList.add("ln-row-selected")) : (i.selectedIds.delete(o), t.classList.remove("ln-row-selected")), i.selectedCount = i.selectedIds.size, i._updateSelectAll(), i._updateFooter(), S(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const r = document.createElement("input");
      r.type = "checkbox", r.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(r), this._selectAllCheckbox = r;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = i._selectAllCheckbox.checked, e = i.tbody ? i.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let t = 0; t < e.length; t++) {
        const o = e[t].getAttribute("data-ln-table-row-id"), n = e[t].querySelector("[data-ln-table-row-select]");
        o != null && (r ? (i.selectedIds.add(o), e[t].classList.add("ln-row-selected")) : (i.selectedIds.delete(o), e[t].classList.remove("ln-row-selected")), n && (n.checked = r));
      }
      i.selectedCount = i.selectedIds.size, S(i.dom, "ln-table:select-all", {
        table: i.name,
        selected: r
      }), S(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let e = 0; e < r.length; e++) {
        const t = r[e].querySelector("[data-ln-table-row-select]"), o = r[e].getAttribute("data-ln-table-row-id");
        t && t.checked && o != null && (this.selectedIds.add(o), r[e].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, l.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const i = this.dom.querySelector("[data-ln-table-col-select]");
    if (i) {
      const r = i.querySelector('input[type="checkbox"]');
      r && r.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let e = 0; e < r.length; e++) {
        r[e].classList.remove("ln-row-selected");
        const t = r[e].querySelector("[data-ln-table-row-select]");
        t && (t.checked = !1);
      }
    }
    this._updateFooter();
  }, l.prototype._updateFooter = function() {
    let i = 0, r = 0;
    this.isDataDriven ? (i = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (i = this._data.length, r = this._filteredData.length);
    const e = r < i;
    if (this._totalSpan && (this._totalSpan.textContent = g(i, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = e ? g(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const t = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = t > 0 ? g(t, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", t === 0);
    }
  }, l.prototype._focusRow = function(i) {
    for (let r = 0; r < i.length; r++)
      i[r].classList.remove("ln-row-focused"), i[r].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const r = i[this._focusedRowIndex];
      r.classList.add("ln-row-focused"), r.setAttribute("tabindex", "0"), r.focus(), r.scrollIntoView({ block: "nearest" });
    }
  }, l.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, U(p, d, l, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(i, r) {
      const e = i[d];
      if (!(!e || !e.isDataDriven)) {
        if (r === "data-ln-table-window") {
          const t = i.hasAttribute("data-ln-table-window");
          if (t && !e._windowed)
            e._enterWindowedMode(), e._kickWindowInitial();
          else if (!t && e._windowed)
            e._exitWindowedMode();
          else if (t && e._windowed) {
            const o = parseInt(i.getAttribute("data-ln-table-window"), 10);
            o > 0 && e._cache.configure({ windowSize: o });
          }
          return;
        }
        if (!(!e._windowed || !e._cache)) {
          if (r === "data-ln-table-window-page") {
            const t = parseInt(i.getAttribute("data-ln-table-window-page"), 10);
            t > 0 && e._cache.configure({ pageSize: t });
          } else if (r === "data-ln-table-window-threshold") {
            const t = parseInt(i.getAttribute("data-ln-table-window-threshold"), 10);
            t >= 0 && e._cache.configure({ threshold: t });
          } else if (r === "data-ln-table-count") {
            const t = parseInt(i.getAttribute("data-ln-table-count"), 10);
            t >= 0 && e._cache.setGrandTotal(t);
          }
        }
      }
    }
  });
})();
(function() {
  const p = "data-ln-list", d = "lnList", E = "data-ln-list-empty";
  if (window[d] !== void 0) return;
  function h(l, i) {
    if (l == null || isNaN(l)) return "";
    try {
      return new Intl.NumberFormat(V(i)).format(l);
    } catch {
      return String(l);
    }
  }
  function u(l) {
    let i = l;
    for (; i && i !== document.body && i !== document.documentElement; ) {
      const e = getComputedStyle(i).overflowY;
      if (e === "auto" || e === "scroll") return i;
      i = i.parentElement;
    }
    return null;
  }
  function g(l) {
    if (!l) return 0;
    const i = getComputedStyle(l), r = parseFloat(i.marginTop) || 0, e = parseFloat(i.marginBottom) || 0;
    return l.offsetHeight + r + e;
  }
  function a(l) {
    this.dom = l, this.tbody = l.querySelector("[data-ln-list-body]") || l, this.isDataDriven = l.hasAttribute("data-ln-list-source"), this.name = l.getAttribute(p) || "", this.source = l.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const i = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._windowed = !1, this._cache = null, this.isDataDriven && l.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = l.querySelector("[data-ln-list-total]"), this._filteredSpan = l.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== l ? this._filteredSpan.parentElement : null), this._selectedSpan = l.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== l ? this._selectedSpan.parentElement : null), this._onSetData = function(r) {
      const e = r.detail || {};
      if (i._windowed) {
        l.classList.remove("ln-list--loading"), i._cache.ingest(e);
        return;
      }
      i._data = e.data || [], i._lastTotal = e.total != null ? e.total : i._data.length, i._lastFiltered = e.filtered != null ? e.filtered : i._data.length, i.totalCount = i._lastTotal, i.visibleCount = i._lastFiltered, i.isLoaded = !0, l.classList.remove("ln-list--loading"), i._vStart = -1, i._vEnd = -1, i._applyFilterAndSort(), i._render(), i._updateFooter(), S(l, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      });
    }, l.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(r) {
      const e = r.detail && r.detail.loading;
      l.classList.toggle("ln-list--loading", !!e), e && (i.isLoaded = !1);
    }, l.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(r) {
      r.target.closest("[data-ln-list-clear-all]") && (i.currentFilters = {}, S(l, "ln-list:clear-filters", { list: i.name }), i._requestData());
    }, l.addEventListener("click", this._onClearAll), this._selectable = l.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onItemClick = function(r) {
      if (r.target.closest("[data-ln-item-select]") || r.target.closest("[data-ln-item-action]") || r.target.closest("a") || r.target.closest("button") || r.ctrlKey || r.metaKey || r.button === 1) return;
      const e = r.target.closest("[data-ln-item]");
      if (!e) return;
      const t = e.getAttribute("data-ln-item-id"), o = e._lnRecord || {};
      S(l, "ln-list:item-click", {
        list: i.name,
        id: t,
        record: o
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(r) {
      const e = r.target.closest("[data-ln-item-action]");
      if (!e) return;
      r.stopPropagation();
      const t = e.closest("[data-ln-item]");
      if (!t) return;
      const o = e.getAttribute("data-ln-item-action"), n = t.getAttribute("data-ln-item-id"), m = t._lnRecord || {};
      S(l, "ln-list:item-action", {
        list: i.name,
        id: n,
        action: o,
        record: m
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(r) {
      r.preventDefault(), i.currentSearch = r.detail && r.detail.term || "", S(l, "ln-list:search", {
        list: i.name,
        query: i.currentSearch
      }), i._requestData();
    }, l.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : S(l, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      i.tbody.children.length > 0 && (i._emptyObserver.disconnect(), i._emptyObserver = null, i._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(r) {
      r.preventDefault(), i._searchTerm = r.detail && r.detail.term || "", i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), S(l, "ln-list:filter", {
        term: i._searchTerm,
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, l.addEventListener("ln-search:change", this._onSearch)), this._onClear = function(r) {
      if (!r.target.closest("[data-ln-list-clear]") || G(l, "ln-list:before-clear-search", { list: i.name }).defaultPrevented) return;
      i.isDataDriven ? i.currentSearch = "" : i._searchTerm = "";
      const o = document.querySelector('[data-ln-search="' + l.id + '"]');
      if (o) {
        const n = o.tagName === "INPUT" ? o : o.querySelector("input");
        n && (n.value = "", n.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
      i.isDataDriven ? (S(l, "ln-list:search", {
        list: i.name,
        query: ""
      }), i._requestData()) : (i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), S(l, "ln-list:filter", {
        term: "",
        matched: i._filteredData.length,
        total: i._data.length
      }));
    }, l.addEventListener("click", this._onClear), this;
  }
  a.prototype._parseChildren = function() {
    const l = Array.from(this.tbody.children).filter((i) => !i.classList.contains("ln-list__spacer"));
    this._data = [], l.length > 0 && (this._itemHeight = g(l[0]) || 50);
    for (let i = 0; i < l.length; i++) {
      const r = l[i], e = r.getAttribute("data-ln-item-id") || r.getAttribute("id"), t = r.textContent.trim().toLowerCase();
      let o = null;
      if (this.isDataDriven) {
        o = {}, e != null && (o.id = e);
        const n = r.querySelectorAll("[data-ln-list-field]");
        for (let m = 0; m < n.length; m++) {
          const c = n[m], y = c.getAttribute("data-ln-list-field");
          y && (o[y] = c.textContent.trim());
        }
      }
      this._data.push({
        html: r.outerHTML,
        searchText: t,
        id: e,
        ...o
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, a.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const l = (this.currentSearch || "").trim().toLowerCase(), i = this.currentFilters || {}, r = Object.keys(i).length > 0;
      if (this._filteredData = this._data.filter(function(n) {
        if (l) {
          let m = !1;
          for (const c in n)
            if (n.hasOwnProperty(c) && typeof n[c] == "string" && c !== "html" && c !== "searchText" && n[c].toLowerCase().indexOf(l) !== -1) {
              m = !0;
              break;
            }
          if (!m) return !1;
        }
        if (r)
          for (const m in i) {
            const c = i[m];
            if (c && c.length > 0) {
              const y = n[m], w = y != null ? String(y) : "";
              if (c.indexOf(w) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const e = this.currentSort.field, t = this.currentSort.direction === "desc" ? -1 : 1, o = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(n, m) {
        return n < m ? -1 : n > m ? 1 : 0;
      };
      this._filteredData.sort(function(n, m) {
        const c = n[e], y = m[e];
        if (typeof c == "number" && typeof y == "number")
          return (c - y) * t;
        const w = c != null ? String(c) : "", A = y != null ? String(y) : "";
        return o(w, A) * t;
      });
    } else {
      const l = this._searchTerm;
      l ? this._filteredData = this._data.filter(function(i) {
        return i.searchText.indexOf(l) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, a.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const l = this._lastTotal, i = this.visibleCount;
        if (l === 0 || this._filteredData.length === 0 || i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const l = this._filteredData.length;
        l === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : l > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, a.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const l = this._filteredData, i = document.createDocumentFragment();
      for (let r = 0; r < l.length; r++) {
        const e = this._buildItem(l[r]);
        if (!e) break;
        i.appendChild(e);
      }
      this.tbody.textContent = "", this.tbody.appendChild(i), this._selectable && this._updateSelectAll();
    } else {
      const l = [], i = this._filteredData;
      for (let r = 0; r < i.length; r++) l.push(i[r].html);
      this.tbody.innerHTML = l.join("");
    }
  }, a.prototype._readGridLayout = function() {
    const l = getComputedStyle(this.tbody), i = l.gridTemplateColumns;
    let r = 1;
    if (i && i !== "none") {
      const t = i.trim().split(/\s+/).filter(Boolean);
      t.length > 0 && (r = t.length);
    }
    const e = parseFloat(l.rowGap);
    return { columns: r, rowGap: isNaN(e) ? 0 : e };
  }, a.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const l = this._cache.peek(), i = l ? this._buildItem(l) : this._buildPlaceholderItem();
      i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = g(i) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const l = this._buildItem(this._data[0]);
        l && (this.tbody.textContent = "", this.tbody.appendChild(l), this._itemHeight = g(l) || 50, this.tbody.textContent = "");
      }
    } else {
      const l = this.tbody.children;
      l.length > 0 && (this._itemHeight = g(l[0]) || 50);
    }
  }, a.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const l = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = u(this.dom);
    const i = this._scrollContainer || window;
    this._scrollHandler = function() {
      l._rafId || (l._rafId = requestAnimationFrame(function() {
        l._rafId = null, l._windowed ? l._renderWindowed() : l._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      l._itemHeight = 0, l._measureItemHeight(), l._vStart = -1, l._vEnd = -1, l._windowed ? l._renderWindowed() : l._renderVirtual();
    }, i.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, a.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, a.prototype._renderVirtual = function() {
    const l = this._filteredData, i = l.length, r = this._itemHeight;
    if (!r || !i) return;
    const e = this._scrollContainer;
    let t, o;
    if (e) {
      const O = this.tbody.getBoundingClientRect(), B = e.getBoundingClientRect(), j = e === this.tbody ? 0 : O.top - B.top + e.scrollTop;
      t = e.scrollTop - j, o = e.clientHeight;
    } else {
      const B = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - B, o = window.innerHeight;
    }
    const n = this._readGridLayout(), m = n.columns, c = n.rowGap, y = r + c, w = Math.ceil(i / m);
    let A = Math.max(0, Math.floor(t / y) - 15);
    A = Math.min(A, w);
    const L = Math.ceil(o / y) + 30, C = Math.min(A + L, w), k = Math.min(A * m, i), q = Math.min(C * m, i);
    if (k === this._vStart && q === this._vEnd) return;
    this._vStart = k, this._vEnd = q;
    const D = A * y, M = (w - C) * y;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (D > 0) {
        const B = document.createElement(this.isUl ? "li" : "div");
        B.className = "ln-list__spacer", B.style.height = D + "px", O.appendChild(B);
      }
      for (let B = k; B < q; B++) {
        const j = this._buildItem(l[B]);
        j && O.appendChild(j);
      }
      if (M > 0) {
        const B = document.createElement(this.isUl ? "li" : "div");
        B.className = "ln-list__spacer", B.style.height = M + "px", O.appendChild(B);
      }
      this.tbody.textContent = "", this.tbody.appendChild(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      D > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${D}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let B = k; B < q; B++)
        O += l[B].html;
      M > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${M}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = O;
    }
  }, a.prototype._buildPlaceholderItem = function() {
    const l = document.createElement(this.isUl ? "li" : "div");
    return l.className = "ln-list__placeholder", l.setAttribute("aria-hidden", "true"), l.style.height = this._itemHeight + "px", l;
  }, a.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const l = this._itemHeight;
    if (!l) return;
    const i = this._scrollContainer;
    let r, e;
    if (i) {
      const O = this.tbody.getBoundingClientRect(), B = i.getBoundingClientRect(), j = i === this.tbody ? 0 : O.top - B.top + i.scrollTop;
      r = i.scrollTop - j, e = i.clientHeight;
    } else {
      const B = this.tbody.getBoundingClientRect().top + window.scrollY;
      r = window.scrollY - B, e = window.innerHeight;
    }
    const t = this._readGridLayout(), o = t.columns, n = t.rowGap, m = l + n, c = this._cache.logicalTotal, y = Math.ceil(c / o);
    let w = Math.max(0, Math.floor(r / m) - 15);
    w = Math.min(w, y);
    const A = Math.ceil(e / m) + 30, L = Math.min(w + A, y), C = Math.min(w * o, c), k = Math.min(L * o, c), q = w * m, D = (y - L) * m, M = document.createDocumentFragment();
    if (q > 0) {
      const O = document.createElement(this.isUl ? "li" : "div");
      O.className = "ln-list__spacer", O.style.height = q + "px", M.appendChild(O);
    }
    for (let O = C; O < k; O++)
      if (this._cache.has(O)) {
        const B = this._buildItem(this._cache.get(O));
        B && M.appendChild(B);
      } else
        M.appendChild(this._buildPlaceholderItem());
    if (D > 0) {
      const O = document.createElement(this.isUl ? "li" : "div");
      O.className = "ln-list__spacer", O.style.height = D + "px", M.appendChild(O);
    }
    this.tbody.textContent = "", this.tbody.appendChild(M), this._vStart = C, this._vEnd = k, this._cache.ensure(C, k);
  }, a.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let l = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount, e = this.currentSearch && (r < i || r === 0), t = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (l = lt(this.dom, t, "ln-list"), !l) {
        const o = this.dom.querySelector("template[data-ln-empty]");
        if (o) {
          const n = e ? "search" : "initial", m = o.content.querySelector(`[data-ln-empty-when="${n}"]`) || o.content.firstElementChild;
          m && (l = document.importNode(m, !0));
        }
      }
    } else {
      const i = this.dom.querySelector(`template[${E}]`);
      i && (l = document.importNode(i.content, !0));
    }
    if (l)
      if (l.tagName === "LI" || l.tagName === "TR")
        this.tbody.appendChild(l);
      else {
        const i = document.createElement(this.isUl ? "li" : "div");
        i.appendChild(l), this.tbody.appendChild(i);
      }
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, a.prototype._buildItem = function(l) {
    const i = lt(this.dom, this.name + "-row", "ln-list");
    if (!i) return null;
    const r = i.querySelector("[data-ln-item]") || i.firstElementChild;
    if (!r) return null;
    if (_t(r, l), Q(r, l), r._lnRecord = l, l.id != null && (r.setAttribute("data-ln-item-id", l.id), this._selectable && this.selectedIds.has(String(l.id)))) {
      r.classList.add("ln-item-selected");
      const e = r.querySelector("[data-ln-item-select]");
      e && (e.checked = !0);
    }
    return r;
  }, a.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const l = this;
    this._onSelectionChange = function(i) {
      const r = i.target.closest("[data-ln-item-select]");
      if (!r) return;
      const e = r.closest("[data-ln-item]");
      if (!e) return;
      const t = e.getAttribute("data-ln-item-id");
      t != null && (r.checked ? (l.selectedIds.add(String(t)), e.classList.add("ln-item-selected")) : (l.selectedIds.delete(String(t)), e.classList.remove("ln-item-selected")), l._updateSelectAll(), l._updateFooter(), S(l.dom, "ln-list:select", {
        list: l.name,
        selectedIds: l.selectedIds,
        count: l.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const i = l._selectAllCheckbox.checked, r = l.tbody.querySelectorAll("[data-ln-item]");
      for (let e = 0; e < r.length; e++) {
        const t = r[e], o = t.getAttribute("data-ln-item-id"), n = t.querySelector("[data-ln-item-select]");
        o != null && (i ? (l.selectedIds.add(String(o)), t.classList.add("ln-item-selected")) : (l.selectedIds.delete(String(o)), t.classList.remove("ln-item-selected")), n && (n.checked = i));
      }
      S(l.dom, "ln-list:select-all", { list: l.name, selected: i }), S(l.dom, "ln-list:select", {
        list: l.name,
        selectedIds: l.selectedIds,
        count: l.selectedIds.size
      }), l._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, a.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const l = this.tbody.querySelectorAll("[data-ln-item]");
    let i = l.length > 0;
    for (let r = 0; r < l.length; r++) {
      const e = l[r].getAttribute("data-ln-item-id");
      if (e != null && !this.selectedIds.has(String(e))) {
        i = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = i;
  }, a.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Wt(this, "ln-list:request-data", "list");
  }, a.prototype._enterWindowedMode = function() {
    const l = this, i = this.dom, r = parseInt(i.getAttribute("data-ln-list-window"), 10), e = parseInt(i.getAttribute("data-ln-list-window-page"), 10), t = parseInt(i.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !l._windowed || !l._cache || (l.totalCount = l._cache.grandTotal, l.visibleCount = l._cache.logicalTotal, l._lastTotal = l._cache.grandTotal, l.isLoaded = !0, l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), S(i, "ln-list:rendered", {
        list: l.name,
        total: l.totalCount,
        visible: l.visibleCount
      }));
    }, this._renderBatch = Nt(this._onCacheChange), this._cache = te({
      windowSize: r > 0 ? r : 1e3,
      pageSize: e > 0 ? e : 200,
      threshold: t >= 0 ? t : 25,
      fetchDebounce: 120,
      requestPage: function(o, n, m) {
        S(i, "ln-list:request-data", {
          list: l.name,
          sort: o.sort,
          filters: o.filters,
          search: o.search,
          offset: n,
          limit: m,
          queryGen: l._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, a.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const l = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), i = l > 0 ? l : this._data.length;
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
  }, a.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, a.prototype._updateFooter = function() {
    let l = 0, i = 0;
    this.isDataDriven ? (l = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount) : (l = this._data.length, i = this._filteredData.length);
    const r = i < l;
    if (this._totalSpan && (this._totalSpan.textContent = h(l, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = r ? h(i, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !r), this._selectedSpan) {
      const e = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = e > 0 ? h(e, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, a.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch)), this._onClear && this.dom.removeEventListener("click", this._onClear), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, U(p, d, a, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(l, i) {
      const r = l[d];
      if (!(!r || !r.isDataDriven)) {
        if (i === "data-ln-list-window") {
          const e = l.hasAttribute("data-ln-list-window");
          if (e && !r._windowed)
            r._enterWindowedMode(), r._kickWindowInitial();
          else if (!e && r._windowed)
            r._exitWindowedMode();
          else if (e && r._windowed) {
            const t = parseInt(l.getAttribute("data-ln-list-window"), 10);
            t > 0 && r._cache.configure({ windowSize: t });
          }
          return;
        }
        if (!(!r._windowed || !r._cache)) {
          if (i === "data-ln-list-window-page") {
            const e = parseInt(l.getAttribute("data-ln-list-window-page"), 10);
            e > 0 && r._cache.configure({ pageSize: e });
          } else if (i === "data-ln-list-window-threshold") {
            const e = parseInt(l.getAttribute("data-ln-list-window-threshold"), 10);
            e >= 0 && r._cache.configure({ threshold: e });
          } else if (i === "data-ln-list-count") {
            const e = parseInt(l.getAttribute("data-ln-list-count"), 10);
            e >= 0 && r._cache.setGrandTotal(e);
          }
        }
      }
    }
  });
})();
(function() {
  const p = "data-ln-circular-progress", d = "lnCircularProgress";
  if (window[d] !== void 0) return;
  const E = "http://www.w3.org/2000/svg", v = 36, b = 16, _ = 2 * Math.PI * b;
  function f(a) {
    return this.dom = a, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, h.call(this), g.call(this), u.call(this), a.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  f.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[d]);
  };
  function s(a, l) {
    const i = document.createElementNS(E, a);
    for (const r in l)
      i.setAttribute(r, l[r]);
    return i;
  }
  function h() {
    this.svg = s("svg", {
      viewBox: "0 0 " + v + " " + v,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: v / 2,
      cy: v / 2,
      r: b,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: v / 2,
      cy: v / 2,
      r: b,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": _,
      "stroke-dashoffset": _,
      transform: "rotate(-90 " + v / 2 + " " + v / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function u() {
    const a = this, l = new MutationObserver(function(i) {
      for (const r of i)
        (r.attributeName === "data-ln-circular-progress" || r.attributeName === "data-ln-circular-progress-max" || r.attributeName === "data-ln-circular-progress-label") && g.call(a);
    });
    l.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = l;
  }
  function g() {
    const a = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, l = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let i = l > 0 ? a / l * 100 : 0;
    i < 0 && (i = 0), i > 100 && (i = 100);
    const r = _ - i / 100 * _;
    this.progressCircle.setAttribute("stroke-dashoffset", r);
    const e = this.dom.getAttribute("data-ln-circular-progress-label"), t = e !== null ? e : Math.round(i) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(l));
    const o = Math.max(0, Math.min(a, l));
    this.dom.setAttribute("aria-valuenow", String(o)), this.dom.setAttribute("aria-valuetext", t), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: a,
      max: l,
      percentage: i
    });
  }
  U(p, d, f, "ln-circular-progress");
})();
(function() {
  const p = "data-ln-sortable", d = "lnSortable", E = "data-ln-sortable-handle";
  if (window[d] !== void 0) return;
  function v(_) {
    this.dom = _, this.isEnabled = _.getAttribute(p) !== "disabled", this._dragging = null, _.setAttribute("aria-roledescription", "sortable list");
    const f = this;
    return this._onPointerDown = function(s) {
      f.isEnabled && f._handlePointerDown(s);
    }, _.addEventListener("pointerdown", this._onPointerDown), this;
  }
  v.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(p, "");
  }, v.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(p, "disabled");
  }, v.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[d]);
  }, v.prototype._handlePointerDown = function(_) {
    let f = _.target.closest("[" + E + "]"), s;
    if (f) {
      for (s = f; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + E + "]")) return;
      for (s = _.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      f = s;
    }
    const u = Array.from(this.dom.children).indexOf(s);
    if (G(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: u
    }).defaultPrevented) return;
    _.preventDefault(), f.setPointerCapture(_.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: u
    });
    const a = this, l = function(r) {
      a._handlePointerMove(r);
    }, i = function(r) {
      a._handlePointerEnd(r), f.removeEventListener("pointermove", l), f.removeEventListener("pointerup", i), f.removeEventListener("pointercancel", i);
    };
    f.addEventListener("pointermove", l), f.addEventListener("pointerup", i), f.addEventListener("pointercancel", i);
  }, v.prototype._handlePointerMove = function(_) {
    if (!this._dragging) return;
    const f = Array.from(this.dom.children), s = this._dragging;
    for (const h of f)
      h.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const h of f) {
      if (h === s) continue;
      const u = h.getBoundingClientRect(), g = u.top + u.height / 2;
      if (_.clientY >= u.top && _.clientY < g) {
        h.classList.add("ln-sortable--drop-before");
        break;
      } else if (_.clientY >= g && _.clientY <= u.bottom) {
        h.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, v.prototype._handlePointerEnd = function(_) {
    if (!this._dragging) return;
    const f = this._dragging, s = Array.from(this.dom.children), h = s.indexOf(f);
    let u = null, g = null;
    for (const a of s) {
      if (a.classList.contains("ln-sortable--drop-before")) {
        u = a, g = "before";
        break;
      }
      if (a.classList.contains("ln-sortable--drop-after")) {
        u = a, g = "after";
        break;
      }
    }
    for (const a of s)
      a.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (f.classList.remove("ln-sortable--dragging"), f.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), u && u !== f) {
      g === "before" ? this.dom.insertBefore(f, u) : this.dom.insertBefore(f, u.nextElementSibling);
      const l = Array.from(this.dom.children).indexOf(f);
      S(this.dom, "ln-sortable:reordered", {
        item: f,
        oldIndex: h,
        newIndex: l
      });
    }
    this._dragging = null;
  };
  function b(_) {
    const f = _[d];
    if (!f) return;
    const s = _.getAttribute(p) !== "disabled";
    s !== f.isEnabled && (f.isEnabled = s, S(_, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: _ }));
  }
  U(p, d, v, "ln-sortable", {
    onAttributeChange: b
  });
})();
(function() {
  const p = "data-ln-confirm", d = "lnConfirm", E = "data-ln-confirm-timeout";
  if (window[d] !== void 0) return;
  function b(...f) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...f);
  }
  function _(f) {
    b("constructor called on", f), this.dom = f, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = f.querySelector("[data-ln-confirm-idle]"), this.activeEl = f.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = f.textContent.trim(), this.confirmText = f.getAttribute(p) || "Confirm?");
    const s = this;
    return this._onClick = function(h) {
      if (b("click handler, confirming:", s.confirming, "submitted:", s._submitted, "target:", h.target), !s.confirming)
        h.preventDefault(), h.stopImmediatePropagation(), s._enterConfirm();
      else {
        if (s._submitted) return;
        s._submitted = !0, s._reset();
      }
    }, f.addEventListener("click", this._onClick), this;
  }
  _.prototype._getTimeout = function() {
    const f = parseFloat(this.dom.getAttribute(E));
    return isNaN(f) || f <= 0 ? 3 : f;
  }, _.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden"), this.originalAriaLabel = this.dom.getAttribute("aria-label");
      const s = this.activeEl ? this.activeEl.textContent.trim() : "";
      s && (this.dom.setAttribute("aria-label", s), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = s, this.dom.appendChild(this.alertNode));
    } else {
      var f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = f.getAttribute("href"), f.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, _.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const f = this, s = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      f._reset();
    }, s);
  }, _.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null;
    else if (this.isIconButton) {
      var f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalIconHref && f.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, _.prototype.destroy = function() {
    b("destroy called on", this.dom), this.dom[d] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[d]);
  }, U(p, d, _, "ln-confirm");
})();
(function() {
  const p = "data-ln-translations", d = "lnTranslations";
  if (window[d] !== void 0) return;
  const E = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function v(b) {
    this.dom = b, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = b.getAttribute(p + "-default") || "", this.placeholderLabel = b.getAttribute(p + "-placeholder") || "{lang} translation", this.removeLabel = b.getAttribute(p + "-remove-label") || "Remove {lang}", this.badgesEl = b.querySelector("[" + p + "-active]"), this.menuEl = b.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const _ = b.getAttribute(p + "-locales");
    if (this.locales = E, _)
      try {
        this.locales = JSON.parse(_);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const f = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && f.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && f.removeLanguage(s.detail.lang);
    }, b.addEventListener("ln-translations:request-add", this._onRequestAdd), b.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  v.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const b = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const _ of b) {
      const f = _.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of f)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, v.prototype._detectExisting = function() {
    const b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const _ of b) {
      const f = _.getAttribute("data-ln-translatable-lang");
      f && f !== this.defaultLang && this.activeLanguages.add(f);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, v.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const b = this;
    let _ = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      _++;
      const h = wt("ln-translations-menu-item", "ln-translations");
      if (!h) return;
      const u = h.querySelector("[data-ln-translations-lang]");
      u.setAttribute("data-ln-translations-lang", s), u.textContent = this.locales[s], u.addEventListener("click", function(g) {
        g.ctrlKey || g.metaKey || g.button === 1 || (g.preventDefault(), g.stopPropagation(), b.menuEl.getAttribute("data-ln-toggle") === "open" && b.menuEl.setAttribute("data-ln-toggle", "close"), b.addLanguage(s));
      }), this.menuEl.appendChild(h);
    }
    const f = this.dom.querySelector("[" + p + "-add]");
    f && (f.hidden = _ === 0);
  }, v.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const b = this;
    this.activeLanguages.forEach(function(_) {
      const f = wt("ln-translations-badge", "ln-translations");
      if (!f) return;
      const s = f.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", _);
      const h = s.querySelector("span");
      h.textContent = b.locales[_] || _.toUpperCase();
      const u = s.querySelector("button"), g = b.locales[_] || _.toUpperCase();
      u.setAttribute("aria-label", b.removeLabel.replace("{lang}", g)), u.addEventListener("click", function(a) {
        a.ctrlKey || a.metaKey || a.button === 1 || (a.preventDefault(), a.stopPropagation(), b.removeLanguage(_));
      }), b.badgesEl.appendChild(f);
    });
  }, v.prototype.addLanguage = function(b, _) {
    if (this.activeLanguages.has(b)) return;
    const f = this.locales[b] || b;
    if (G(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: b,
      langName: f
    }).defaultPrevented) return;
    this.activeLanguages.add(b), _ = _ || {};
    const h = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const u of h) {
      const g = u.getAttribute("data-ln-translatable"), a = u.getAttribute("data-ln-translations-prefix") || "", l = u.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!l) continue;
      const i = l.cloneNode(l.tagName === "SELECT");
      a ? i.name = a + "[trans][" + b + "][" + g + "]" : i.name = "trans[" + b + "][" + g + "]", i.value = _[g] !== void 0 ? _[g] : "", i.removeAttribute("id"), "placeholder" in i && (i.placeholder = this.placeholderLabel.replace("{lang}", f)), i.setAttribute("data-ln-translatable-lang", b);
      const r = u.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), e = r.length > 0 ? r[r.length - 1] : l;
      e.parentNode.insertBefore(i, e.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: b,
      langName: f
    });
  }, v.prototype.removeLanguage = function(b) {
    if (!this.activeLanguages.has(b) || G(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: b
    }).defaultPrevented) return;
    const f = this.dom.querySelectorAll('[data-ln-translatable-lang="' + b + '"]');
    for (const s of f)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(b), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: b
    });
  }, v.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, v.prototype.hasLanguage = function(b) {
    return this.activeLanguages.has(b);
  }, v.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const b = this.defaultLang, _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const f of _)
      f.getAttribute("data-ln-translatable-lang") !== b && f.parentNode.removeChild(f);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[d];
  }, U(p, d, v, "ln-translations");
})();
(function() {
  const p = "data-ln-autosave", d = "lnAutosave", E = "data-ln-autosave-clear", v = "data-ln-autosave-debounce-input", b = "ln-autosave:";
  if (window[d] !== void 0) return;
  function f(g) {
    const a = s(g);
    if (!a) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", g);
      return;
    }
    this.dom = g, this.key = a;
    let l = null;
    function i() {
      const o = Gt(g, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(a, JSON.stringify(o));
      } catch {
        return;
      }
      S(g, "ln-autosave:saved", { target: g, data: o });
    }
    function r() {
      let o;
      try {
        o = localStorage.getItem(a);
      } catch {
        return;
      }
      if (!o) return;
      let n;
      try {
        n = JSON.parse(o);
      } catch {
        return;
      }
      if (G(g, "ln-autosave:before-restore", { target: g, data: n }).defaultPrevented) return;
      const c = $t(g, n);
      for (let y = 0; y < c.length; y++)
        c[y].dispatchEvent(new Event("input", { bubbles: !0 })), c[y].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(g, "ln-autosave:restored", { target: g, data: n });
    }
    function e() {
      try {
        localStorage.removeItem(a);
      } catch {
        return;
      }
      S(g, "ln-autosave:cleared", { target: g });
    }
    this._onFocusout = function(o) {
      const n = o.target;
      h(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && i();
    }, this._onChange = function(o) {
      const n = o.target;
      h(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && i();
    }, this._onSubmit = function() {
      e();
    }, this._onReset = function() {
      e();
    }, this._onClearClick = function(o) {
      o.target.closest("[" + E + "]") && e();
    }, g.addEventListener("focusout", this._onFocusout), g.addEventListener("change", this._onChange), g.addEventListener("submit", this._onSubmit), g.addEventListener("reset", this._onReset), g.addEventListener("click", this._onClearClick);
    const t = u(g);
    return t > 0 && (this._onInput = function(o) {
      const n = o.target;
      !h(n) || !n.name || n.hasAttribute("data-ln-autosave-exclude") || (l !== null && clearTimeout(l), l = setTimeout(i, t));
    }, g.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return l;
    }, r(), this;
  }
  f.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const g = this._getInputTimer();
        g !== null && clearTimeout(g);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function s(g) {
    const l = g.getAttribute(p) || g.id;
    return l ? b + window.location.pathname + ":" + l : null;
  }
  function h(g) {
    const a = g.tagName;
    return a === "INPUT" || a === "TEXTAREA" || a === "SELECT";
  }
  function u(g) {
    if (!g.hasAttribute(v)) return 0;
    const a = g.getAttribute(v);
    if (a === "" || a === null) return 1e3;
    const l = parseInt(a, 10);
    return isNaN(l) || l < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", g), 1e3) : l;
  }
  U(p, d, f, "ln-autosave");
})();
(function() {
  const p = "data-ln-autoresize", d = "lnAutoresize";
  if (window[d] !== void 0) return;
  function E(v) {
    if (v.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", v.tagName), this;
    this.dom = v;
    const b = this;
    return this._onInput = function() {
      b._resize();
    }, v.addEventListener("input", this._onInput), this._resize(), this;
  }
  E.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[d]);
  }, U(p, d, E, "ln-autoresize");
})();
(function() {
  const p = "data-ln-editor", d = "lnEditor";
  if (window[d] !== void 0) return;
  const E = {
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
  }, v = {
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
  }, _ = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let f = 0;
  function s(t) {
    return !!(v[t] || b[t] || _[t] || t === "link");
  }
  function h(t) {
    this.dom = t;
    const o = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const n = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), n && this._surface.setAttribute("data-placeholder", n);
    const m = this._textarea.id;
    if (m) {
      const A = t.querySelector('label[for="' + m + '"]');
      A && (A.id || (A.id = m + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = m ? m + "-surface" : "ln-editor-surface-" + ++f;
    const c = this._textarea.value.trim();
    c && (this._surface.innerHTML = c);
    const y = t.querySelector('[role="toolbar"]');
    if (y && y.nextSibling ? t.insertBefore(this._surface, y.nextSibling) : t.appendChild(this._surface), y) {
      y.setAttribute("aria-controls", this._surface.id);
      const A = y.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < A.length; L++) {
        const C = A[L].getAttribute("data-ln-editor-action");
        s(C) && A[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      o._syncToTextarea(), S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      });
    }, this._onMousedownToolbar = function(A) {
      A.target.closest("[data-ln-editor-action]") && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      const L = A.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const C = L.getAttribute("data-ln-editor-action");
      o._execAction(C);
    }, this._onPaste = function(A) {
      a(o, A);
    }, this._onKeydown = function(A) {
      r(o, A);
    }, this._onSelectionChange = function() {
      document.contains(o._surface) && o._updateActiveStates();
    }, this._onFocus = function() {
      S(o.dom, "ln-editor:focus", { target: o.dom });
    }, this._onBlur = function() {
      o._syncToTextarea(), S(o.dom, "ln-editor:blur", { target: o.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), y && (y.addEventListener("mousedown", this._onMousedownToolbar), y.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      const L = A.detail && A.detail.html;
      L !== void 0 && (o._surface.innerHTML = L, o._syncToTextarea(), S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      }));
    }, t.addEventListener("ln-editor:set-content", this._onSetContent);
    const w = this._textarea.form;
    return w && (this._onFormReset = function() {
      setTimeout(function() {
        o._surface.innerHTML = o._textarea.value, S(t, "ln-editor:changed", {
          html: o._textarea.value,
          target: t
        });
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), this;
  }
  h.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, h.prototype._execAction = function(t) {
    if (!(!t || G(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), v[t])
        document.execCommand(v[t], !1, null);
      else if (b[t]) {
        const n = b[t], m = u(this._surface);
        m && m.toLowerCase() === n ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + n + ">");
      } else _[t] ? document.execCommand(_[t], !1, null) : t === "link" ? e(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, h.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const n = o.anchorNode;
    if (!n || !this._surface.contains(n)) return;
    const m = t.querySelectorAll("[data-ln-editor-action]");
    for (let c = 0; c < m.length; c++) {
      const y = m[c], w = y.getAttribute("data-ln-editor-action");
      let A = !1;
      if (v[w])
        try {
          A = document.queryCommandState(v[w]);
        } catch {
        }
      else if (b[w]) {
        const L = u(this._surface);
        A = L && L.toLowerCase() === b[w];
      } else if (_[w])
        try {
          A = document.queryCommandState(_[w]);
        } catch {
        }
      else w === "link" && (A = !!g(o.anchorNode, "A", this._surface));
      s(w) && y.setAttribute("aria-pressed", String(A)), A ? y.classList.add("ln-editor-active") : y.classList.remove("ln-editor-active");
    }
  }, h.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, h.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), S(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, h.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const t = this.dom.querySelector('[role="toolbar"]');
    t && (t.removeEventListener("mousedown", this._onMousedownToolbar), t.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const o = this._textarea ? this._textarea.form : null;
    o && this._onFormReset && o.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const n = this.dom.querySelector(".ln-editor__link-popover");
    n && n.remove(), S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function u(t) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return null;
    let n = o.anchorNode;
    if (!n) return null;
    for (; n && n !== t; ) {
      if (n.nodeType === 1) {
        const m = n.tagName;
        if (m === "H2" || m === "H3" || m === "H4" || m === "BLOCKQUOTE" || m === "PRE" || m === "P")
          return m;
      }
      n = n.parentNode;
    }
    return null;
  }
  function g(t, o, n) {
    for (; t && t !== n; ) {
      if (t.nodeType === 1 && t.tagName === o)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function a(t, o) {
    o.preventDefault();
    let n = "";
    if (o.clipboardData && (n = o.clipboardData.getData("text/html"), !n)) {
      const c = o.clipboardData.getData("text/plain");
      c && (n = c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), n = "<p>" + n + "</p>");
    }
    if (!n) return;
    const m = l(n);
    m && document.execCommand("insertHTML", !1, m);
  }
  function l(t) {
    const o = document.createElement("div");
    return o.innerHTML = t, i(o), o.innerHTML;
  }
  function i(t) {
    const o = Array.from(t.childNodes);
    for (let n = 0; n < o.length; n++) {
      const m = o[n];
      if (m.nodeType !== 3) {
        if (m.nodeType !== 1) {
          t.removeChild(m);
          continue;
        }
        if (E[m.tagName]) {
          const c = Array.from(m.attributes);
          for (let y = 0; y < c.length; y++) {
            const w = c[y].name;
            if (m.tagName === "A" && w === "href") {
              const A = m.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || m.removeAttribute("href");
            } else
              m.removeAttribute(w);
          }
          m.tagName === "A" && m.setAttribute("rel", "noopener noreferrer"), i(m);
        } else {
          for (; m.firstChild; )
            t.insertBefore(m.firstChild, m);
          t.removeChild(m);
        }
      }
    }
  }
  function r(t, o) {
    if (!(o.ctrlKey || o.metaKey)) return;
    let n = null;
    switch (o.key.toLowerCase()) {
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
    n && (o.preventDefault(), t._execAction(n));
  }
  function e(t) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const n = g(o.anchorNode, "A", t._surface), m = o.getRangeAt(0).cloneRange(), c = t.dom.querySelector(".ln-editor__link-popover");
    c && c.remove();
    const y = lt(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!y) return;
    const w = y.firstElementChild;
    if (!w) return;
    const A = w.querySelector('input[type="url"]'), L = w.querySelector('[data-ln-editor-action="confirm-link"]'), C = w.querySelector('[data-ln-editor-action="cancel-link"]');
    n && (A.value = n.getAttribute("href") || "");
    const k = t.dom.querySelector('[role="toolbar"]');
    k ? k.after(w) : t.dom.insertBefore(w, t._surface), A.focus();
    function q() {
      const O = window.getSelection();
      O.removeAllRanges(), O.addRange(m);
    }
    function D() {
      const O = A.value.trim();
      if (w.remove(), q(), t._surface.focus(), O)
        if (n)
          n.setAttribute("href", O), n.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), S(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, O);
          const B = window.getSelection();
          if (B && B.anchorNode) {
            const j = g(B.anchorNode, "A", t._surface);
            j && (j.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else n && document.execCommand("unlink", !1, null);
    }
    function M() {
      w.remove(), q(), t._surface.focus();
    }
    L.addEventListener("click", D), C.addEventListener("click", M), A.addEventListener("keydown", function(O) {
      O.key === "Enter" ? (O.preventDefault(), D()) : O.key === "Escape" && (O.preventDefault(), M());
    });
  }
  U(p, d, h, "ln-editor");
})();
(function() {
  const p = "lnFill";
  if (window[p] !== void 0) return;
  const d = { lnFillForm: !0, lnFillStore: !0 };
  function E(b) {
    const _ = {}, f = b.dataset;
    for (const s in f) {
      if (!s.startsWith("lnFill") || d[s]) continue;
      const h = s.slice(6);
      h && (_[h.charAt(0).toLowerCase() + h.slice(1)] = f[s]);
    }
    return _;
  }
  function v(b, _) {
    const f = window.CSS && CSS.escape ? CSS.escape(_) : _, s = document.querySelectorAll('[data-ln-fill-id="' + f + '"]');
    if (s.length === 0) return null;
    for (let h = 0; h < s.length; h++) {
      const u = s[h].getAttribute("data-ln-fill-form");
      if (u) {
        const g = document.getElementById(u);
        if (g && b.contains(g)) return s[h];
      }
    }
    return s[0];
  }
  document.addEventListener("click", function(b) {
    if (b.ctrlKey || b.metaKey || b.button === 1) return;
    const _ = b.target.closest("[data-ln-fill-form]");
    if (!_) return;
    const f = _.getAttribute("href");
    if (f && f.indexOf("#") !== -1) return;
    const s = _.getAttribute("data-ln-fill-form"), h = document.getElementById(s);
    if (!h) return;
    const u = E(_), g = Object.keys(u).length > 0;
    window.lnCore.lnFill(h, g ? u : null);
  }), document.addEventListener("ln-fill:request", function(b) {
    const _ = b.detail;
    if (!_) return;
    const f = b.target, s = _.id;
    if (s == null) {
      window.lnCore.lnFill(f, null);
      return;
    }
    const h = v(f, s);
    if (!h) return;
    const u = E(h);
    window.lnCore.lnFill(f, u);
  }), window[p] = !0;
})();
(function() {
  const p = "data-ln-slug-from", d = "lnSlug";
  if (window[d] !== void 0) return;
  function E(b) {
    return String(b).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function v(b) {
    if (b.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", b.tagName), this;
    const _ = b.form;
    if (!_)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", b), this;
    const f = b.getAttribute(p), s = _.elements[f];
    if (!s)
      return console.warn('[ln-slug] Source field "' + f + '" not found in form:', b), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + f + '" is a RadioNodeList (same-name group) — single source field required:', b), this;
    this.dom = b, this.source = s, this._pristine = b.value === "", this._mirroring = !1;
    const h = this;
    return this._onSource = function() {
      h._pristine && h._mirror();
    }, this._onSlug = function() {
      h._mirroring || (h._pristine = h.dom.value === "");
    }, s.addEventListener("input", this._onSource), b.addEventListener("input", this._onSlug), this;
  }
  v.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = E(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, v.prototype.destroy = function() {
    this.dom[d] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[d]);
  }, U(p, d, v, "ln-slug");
})();
(function() {
  const p = "data-ln-time", d = "lnTime";
  if (window[d] !== void 0) return;
  const E = {}, v = {};
  function b(w) {
    return w.getAttribute("data-ln-time-locale") || V(w);
  }
  function _(w, A) {
    const L = (w || "") + "|" + JSON.stringify(A);
    return E[L] || (E[L] = new Intl.DateTimeFormat(w, A)), E[L];
  }
  function f(w) {
    const A = w || "";
    return v[A] || (v[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), v[A];
  }
  const s = /* @__PURE__ */ new Set();
  let h = null;
  function u() {
    h || (h = setInterval(a, 6e4));
  }
  function g() {
    h && (clearInterval(h), h = null);
  }
  function a() {
    for (const w of s) {
      if (!document.body.contains(w.dom)) {
        s.delete(w);
        continue;
      }
      o(w);
    }
    s.size === 0 && g();
  }
  function l(w, A) {
    const L = mt(A), C = (A || "").toLowerCase().split("-")[0], k = _(A, { dateStyle: "long", timeStyle: "short" }), q = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && q !== C && L.monthsLong) {
      const D = L.monthsLong[w.getMonth()], M = w.getDate(), O = w.getFullYear(), B = String(w.getHours()).padStart(2, "0"), j = String(w.getMinutes()).padStart(2, "0");
      return `${M} ${D} ${O} во ${B}:${j}`;
    }
    return k.format(w);
  }
  function i(w, A) {
    const L = /* @__PURE__ */ new Date(), C = { month: "short", day: "numeric" };
    w.getFullYear() !== L.getFullYear() && (C.year = "numeric");
    const k = mt(A), q = (A || "").toLowerCase().split("-")[0], D = _(A, C), M = D.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (k && M !== q && k.monthsShort) {
      const O = k.monthsShort[w.getMonth()], B = w.getDate(), j = w.getFullYear() !== L.getFullYear() ? " " + w.getFullYear() : "";
      return `${B} ${O}${j}`;
    }
    return D.format(w);
  }
  function r(w, A) {
    return _(A, { dateStyle: "medium" }).format(w);
  }
  function e(w, A) {
    return _(A, { timeStyle: "short" }).format(w);
  }
  function t(w, A) {
    const L = Math.floor(Date.now() / 1e3), k = Math.floor(w.getTime() / 1e3) - L, q = Math.abs(k);
    if (q < 10) return f(A).format(0, "second");
    let D, M;
    if (q < 60)
      D = "second", M = k;
    else if (q < 3600)
      D = "minute", M = Math.round(k / 60);
    else if (q < 86400)
      D = "hour", M = Math.round(k / 3600);
    else if (q < 604800)
      D = "day", M = Math.round(k / 86400);
    else if (q < 2592e3)
      D = "week", M = Math.round(k / 604800);
    else
      return i(w, A);
    return f(A).format(M, D);
  }
  function o(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const L = Number(A);
    if (isNaN(L)) return;
    const C = new Date(L * 1e3), k = w.dom.getAttribute(p) || "short", q = b(w.dom);
    let D;
    switch (k) {
      case "relative":
        D = t(C, q);
        break;
      case "full":
        D = l(C, q);
        break;
      case "date":
        D = r(C, q);
        break;
      case "time":
        D = e(C, q);
        break;
      default:
        D = i(C, q);
        break;
    }
    w.dom.textContent = D, k !== "full" && (w.dom.title = l(C, q));
  }
  function n(w) {
    return this.dom = w, o(this), w.getAttribute(p) === "relative" && (s.add(this), u()), this;
  }
  n.prototype.render = function() {
    o(this);
  }, n.prototype.destroy = function() {
    s.delete(this), s.size === 0 && g(), delete this.dom[d];
  };
  function m(w) {
    const A = w[d];
    if (!A) return;
    w.getAttribute(p) === "relative" ? (s.add(A), u()) : (s.delete(A), s.size === 0 && g()), o(A);
  }
  function c(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(p) && w[d] && o(w[d]);
  }
  function y() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + p + "]");
      for (let A = 0; A < w.length; A++) {
        const L = w[A][d];
        L && o(L);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(p, d, n, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: m,
    onInit: c
  }), y();
})();
(function() {
  const p = "data-ln-data-store", d = "lnDataStore";
  if (window[d] !== void 0) return;
  const E = "ln_app_cache", v = "_meta", b = "1.0";
  let _ = null, f = null;
  const s = {};
  function h(T) {
    T && T.name === "QuotaExceededError" && S(document, "ln-data-store:quota-exceeded", { error: T });
  }
  function u() {
    const T = {};
    for (const x of document.querySelectorAll(`[${p}]`)) {
      const I = x.getAttribute(p);
      if (I) {
        const N = x.getAttribute("data-ln-data-store-indexes") || "";
        T[I] = {
          indexes: N.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return T;
  }
  function g() {
    return f || (f = new Promise((T) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), T(null);
      const x = u(), I = Object.keys(x), N = indexedDB.open(E);
      N.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), T(null);
      }, N.onsuccess = (R) => {
        const H = R.target.result, F = Array.from(H.objectStoreNames);
        if (!(!F.includes(v) || I.some((pt) => !F.includes(pt))))
          return a(H), _ = H, T(H);
        const $ = H.version;
        H.close();
        const X = indexedDB.open(E, $ + 1);
        X.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, X.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), T(null);
        }, X.onupgradeneeded = (pt) => {
          const rt = pt.target.result;
          rt.objectStoreNames.contains(v) || rt.createObjectStore(v, { keyPath: "key" });
          for (const Lt of I)
            if (!rt.objectStoreNames.contains(Lt)) {
              const he = rt.createObjectStore(Lt, { keyPath: "id" });
              for (const Pt of x[Lt].indexes)
                he.createIndex(Pt, Pt, { unique: !1 });
            }
        }, X.onsuccess = (pt) => {
          const rt = pt.target.result;
          a(rt), _ = rt, T(rt);
        };
      };
    }), f);
  }
  function a(T) {
    T.onversionchange = () => {
      T.close(), _ = null, f = null;
    };
  }
  function l() {
    return _ ? Promise.resolve(_) : (f = null, g());
  }
  async function i(T) {
    if (!ut() || !T) return T;
    const x = { ...T }, I = x.id, N = await we(x);
    return !N || !N.encrypted ? T : {
      id: I,
      encrypted: !0,
      iv: N.iv,
      data: N.data
    };
  }
  async function r(T) {
    return !T || !T.encrypted || !ut() ? T : Ee(T);
  }
  const e = (T, x) => l().then((I) => I ? I.transaction(T, x).objectStore(T) : null);
  function t(T) {
    return new Promise((x, I) => {
      T.onsuccess = () => x(T.result), T.onerror = () => {
        h(T.error), I(T.error);
      };
    });
  }
  const o = (T) => e(T, "readonly").then((x) => x ? t(x.getAll()) : []).then((x) => ut() ? Promise.all(x.map((I) => r(I))) : x), n = (T, x) => e(T, "readonly").then((I) => I ? t(I.get(x)) : null).then((I) => I ? r(I) : null), m = (T, x) => (ut() ? i(x) : Promise.resolve(x)).then((N) => e(T, "readwrite").then((R) => R ? t(R.put(N)) : null)), c = (T, x) => e(T, "readwrite").then((I) => I ? t(I.delete(x)) : null), y = (T) => e(T, "readwrite").then((x) => x ? t(x.clear()) : null), w = (T) => e(T, "readonly").then((x) => x ? t(x.count()) : 0), A = (T) => e(v, "readonly").then((x) => x ? t(x.get(T)) : null), L = (T, x) => e(v, "readwrite").then((I) => {
    if (I)
      return x.key = T, t(I.put(x));
  });
  function C(T) {
    this.dom = T, this._name = T.getAttribute(p);
    const x = T.getAttribute("data-ln-data-store-stale"), I = parseInt(x, 10);
    this._staleThreshold = x === "never" || x === "-1" ? -1 : isNaN(I) ? 300 : I;
    const N = T.getAttribute("data-ln-data-store-search-fields") || "";
    return this._searchFields = N.split(",").map((R) => R.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, s[this._name] = this, k(this), B(this), this;
  }
  function k(T) {
    T._handlers = {
      create: (x) => q(T, x.detail),
      update: (x) => D(T, x.detail),
      delete: (x) => M(T, x.detail),
      "bulk-delete": (x) => O(T, x.detail)
    };
    for (const [x, I] of Object.entries(T._handlers))
      T.dom.addEventListener(`ln-data-store:request-${x}`, I);
  }
  function q(T, { tempId: x, data: I = {} } = {}) {
    const N = { ...I, id: x };
    m(T._name, N).then(() => {
      T.totalCount++, S(T.dom, "ln-data-store:created", { store: T._name, record: N, tempId: x });
    });
  }
  function D(T, { id: x, data: I = {} } = {}) {
    n(T._name, x).then((N) => {
      if (!N) throw new Error(`Record not found: ${x}`);
      const R = { ...N, ...I }, H = I.id;
      return (H !== void 0 && H !== x ? bt(T._name, x, R) : m(T._name, R)).then(() => {
        S(T.dom, "ln-data-store:updated", { store: T._name, record: R, previous: N });
      });
    }).catch((N) => console.error("[ln-data-store] Optimistic update failed:", N));
  }
  function M(T, { id: x } = {}) {
    n(T._name, x).then((I) => {
      if (I)
        return c(T._name, x).then(() => {
          T.totalCount--, S(T.dom, "ln-data-store:deleted", { store: T._name, id: x });
        });
    }).catch((I) => console.error("[ln-data-store] Optimistic delete failed:", I));
  }
  function O(T, { ids: x = [] } = {}) {
    x.length && Promise.all(x.map((I) => n(T._name, I))).then((I) => {
      const N = I.filter(Boolean).map((R) => R.id);
      return Z(T._name, N).then(() => {
        T.totalCount -= N.length, S(T.dom, "ln-data-store:deleted", { store: T._name, ids: N });
      });
    }).catch((I) => console.error("[ln-data-store] Optimistic bulk delete failed:", I));
  }
  function B(T) {
    g().then(() => A(T._name)).then((x) => {
      x && x.schema_version === b ? (T.lastSyncedAt = x.last_synced_at || null, T.totalCount = x.record_count || 0, T.totalCount > 0 && (T.isLoaded = !0, S(T.dom, "ln-data-store:ready", { store: T._name, count: T.totalCount, source: "cache" })), S(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: T.totalCount > 0, lastSyncedAt: T.lastSyncedAt, count: T.totalCount })) : x && x.schema_version !== b ? y(T._name).then(() => L(T._name, { schema_version: b, last_synced_at: null, record_count: 0 })).then(() => S(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: !1, lastSyncedAt: null, count: 0 })) : S(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: !1, lastSyncedAt: null, count: 0 });
    });
  }
  function j(T) {
    T.isSyncing = !0, S(T.dom, "ln-data-store:request-remote-sync", { since: T.lastSyncedAt });
  }
  function ot(T, x) {
    return l().then((I) => I ? (ut() ? Promise.all(x.map((R) => i(R))) : Promise.resolve(x)).then((R) => new Promise((H, F) => {
      const z = I.transaction(T, "readwrite"), $ = z.objectStore(T);
      R.forEach((X) => $.put(X)), z.oncomplete = () => H(), z.onerror = () => {
        h(z.error), F(z.error);
      };
    })) : void 0);
  }
  function Z(T, x) {
    return l().then((I) => {
      if (I)
        return new Promise((N, R) => {
          const H = I.transaction(T, "readwrite"), F = H.objectStore(T);
          x.forEach((z) => F.delete(z)), H.oncomplete = () => N(), H.onerror = () => R(H.error);
        });
    });
  }
  function bt(T, x, I) {
    return (ut() ? i(I) : Promise.resolve(I)).then((R) => l().then((H) => {
      if (H)
        return new Promise((F, z) => {
          const $ = H.transaction(T, "readwrite"), X = $.objectStore(T);
          X.put(R), X.delete(x), $.oncomplete = () => F(), $.onerror = () => {
            h($.error), z($.error);
          };
        });
    }));
  }
  const yt = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function P(T, x) {
    if (!x || !x.field) return T;
    const { field: I, direction: N } = x, R = N === "desc";
    return [...T].sort((H, F) => {
      const z = H[I], $ = F[I];
      if (z == null && $ == null) return 0;
      if (z == null) return R ? 1 : -1;
      if ($ == null) return R ? -1 : 1;
      const X = typeof z == "string" && typeof $ == "string" ? yt.compare(z, $) : z < $ ? -1 : z > $ ? 1 : 0;
      return R ? -X : X;
    });
  }
  function K(T, x) {
    if (!x) return T;
    const I = Object.keys(x).filter((N) => Array.isArray(x[N]) && x[N].length > 0);
    return I.length ? T.filter(
      (N) => I.every((R) => x[R].map(String).includes(String(N[R])))
    ) : T;
  }
  function W(T, x, I) {
    if (!x || !I || !I.length) return T;
    const N = x.toLowerCase();
    return T.filter(
      (R) => I.some((H) => {
        const F = R[H];
        return F != null && String(F).toLowerCase().includes(N);
      })
    );
  }
  function ft(T, x, I) {
    if (!T.length) return 0;
    if (I === "count") return T.length;
    const N = T.map((H) => parseFloat(H[x])).filter((H) => !isNaN(H)), R = N.reduce((H, F) => H + F, 0);
    return I === "sum" ? R : I === "avg" && N.length ? R / N.length : 0;
  }
  function et(T, x) {
    if (!T.presenters || !T.presenters.computed) return x;
    const I = T.presenters.computed;
    return x.map((N) => {
      const R = { ...N };
      for (const [H, F] of Object.entries(I))
        try {
          R[H] = F(N);
        } catch (z) {
          console.error(`[ln-data-store] Decorator computed field failed for ${H}`, z);
        }
      return R;
    });
  }
  C.prototype.getAll = function(T = {}) {
    const x = this;
    return o(x._name).then((I) => {
      const N = I.length;
      T.filters && (I = K(I, T.filters)), T.search && (I = W(I, T.search, x._searchFields));
      const R = I.length;
      if (T.sort && (I = P(I, T.sort)), T.offset || T.limit) {
        const H = T.offset || 0, F = T.limit || I.length;
        I = I.slice(H, H + F);
      }
      return {
        data: et(x, I),
        total: N,
        filtered: R
      };
    });
  }, C.prototype.getById = function(T) {
    return n(this._name, T).then((x) => x ? et(this, [x])[0] : null);
  }, C.prototype.count = function(T) {
    return T ? o(this._name).then((x) => K(x, T).length) : w(this._name);
  }, C.prototype.aggregate = function(T, x) {
    return o(this._name).then((I) => ft(I, T, x));
  }, C.prototype.setPresenters = function(T) {
    this.presenters = T;
  }, C.prototype.applySync = function(T, x, I, N) {
    N = N || {};
    const R = this;
    T.length > 0 || x.length > 0;
    let H = Promise.resolve();
    return T.length > 0 && (H = H.then(() => ot(R._name, T))), x.length > 0 && (H = H.then(() => Z(R._name, x))), H.then(() => w(R._name)).then((F) => (R.totalCount = N.total !== void 0 ? N.total : F, L(R._name, {
      schema_version: b,
      last_synced_at: I,
      record_count: R.totalCount
    }))).then(() => {
      const F = !R.isLoaded;
      R.isLoaded = !0, R.isSyncing = !1, R.lastSyncedAt = I, F ? (S(R.dom, "ln-data-store:loaded", { store: R._name, count: R.totalCount, meta: N }), S(R.dom, "ln-data-store:ready", { store: R._name, count: R.totalCount, source: "server", meta: N })) : S(R.dom, "ln-data-store:synced", {
        store: R._name,
        added: T.length,
        deleted: x.length,
        changed: !0,
        meta: N
      });
    }).catch((F) => {
      R.isSyncing = !1, console.error("[ln-data-store] applySync failed:", F);
    });
  }, C.prototype.forceSync = function() {
    j(this);
  }, C.prototype.fullReload = function() {
    const T = this;
    return y(T._name).then(() => {
      T.isLoaded = !1, T.lastSyncedAt = null, T.totalCount = 0, j(T);
    });
  }, C.prototype.destroy = function() {
    if (this._handlers) {
      for (const [T, x] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${T}`, x);
      this._handlers = null;
    }
    delete s[this._name], delete this.dom[d], S(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function J() {
    return l().then((T) => {
      if (!T) return;
      const x = Array.from(T.objectStoreNames);
      return new Promise((I, N) => {
        const R = T.transaction(x, "readwrite");
        x.forEach((H) => R.objectStore(H).clear()), R.oncomplete = () => I(), R.onerror = () => N(R.error);
      });
    }).then(() => {
      Object.values(s).forEach((T) => {
        T.isLoaded = !1, T.isSyncing = !1, T.lastSyncedAt = null, T.totalCount = 0;
      });
    });
  }
  U(p, d, C, "ln-data-store"), window[d].clearAll = J, window[d].init = window[d], window[d].setStorageKey = jt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = jt);
})();
(function() {
  const p = "data-ln-api-connector", d = "lnApiConnector", E = "lnConnector";
  if (window[d] !== void 0) return;
  function v(s) {
    return s.ok ? s.status === 204 ? null : s.json() : s.json().catch(() => null).then((h) => {
      const u = new Error("HTTP " + s.status + ": " + s.statusText);
      throw u.status = s.status, u.data = h, u;
    });
  }
  function b(s) {
    return this.dom = s, s[d] = this, s[E] = this, this.refreshConfig(), this._handlers = null, _(this), this;
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
    const h = s.getAttribute("data-ln-api-headers") || "";
    this.headers = Jt(h, "ln-api-connector"), (h.toLowerCase().includes("authorization") || h.toLowerCase().includes("bearer") || h.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(s, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, b.prototype._reqHeaders = function() {
    return Object.assign({}, nt(this.headers), { "X-LN-Response": "data" });
  }, b.prototype.fetchDelta = function(s) {
    const h = this;
    let u = Y(h.baseUrl, h.path);
    return s != null && s !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(s)), window.fetch(u, { method: "GET", headers: h._reqHeaders(), credentials: h.credentials }).then(v);
  }, b.prototype.query = function(s) {
    const h = this;
    s = s || {};
    let u = Y(h.baseUrl, h.path);
    const g = h.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, a = new URLSearchParams();
    s.search && a.append(g.search, s.search), s.offset != null && a.append(g.offset, s.offset), s.limit != null && a.append(g.limit, s.limit), s.sort && s.sort.field && s.sort.direction && (a.append(g.sortField, s.sort.field), a.append(g.sortDir, s.sort.direction)), s.filters && typeof s.filters == "object" && Object.keys(s.filters).forEach((i) => {
      const r = s.filters[i];
      Array.isArray(r) && r.length > 0 && a.append(i, r.join(","));
    });
    const l = a.toString();
    return l && (u += (u.indexOf("?") !== -1 ? "&" : "?") + l), window.fetch(u, { method: "GET", headers: h._reqHeaders(), credentials: h.credentials }).then(v);
  }, b.prototype.create = function(s, h) {
    const u = this;
    return window.fetch(Y(u.baseUrl, h || u.path), {
      method: "POST",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      body: JSON.stringify(s)
    }).then(v);
  }, b.prototype.update = function(s, h, u, g) {
    const a = this;
    u != null && (h = Object.assign({}, h, { expected_version: u }));
    const l = g ? Y(a.baseUrl, g) : Y(a.baseUrl, a.path, s);
    return window.fetch(l, {
      method: "PUT",
      headers: a._reqHeaders(),
      credentials: a.credentials,
      body: JSON.stringify(h)
    }).then(v);
  }, b.prototype.delete = function(s, h) {
    const u = this;
    return window.fetch(Y(u.baseUrl, h || u.path, s), {
      method: "DELETE",
      headers: u._reqHeaders(),
      credentials: u.credentials
    }).then(v);
  }, b.prototype.bulkDelete = function(s, h) {
    const u = this;
    return window.fetch(Y(u.baseUrl, h || u.path) + "/bulk-delete", {
      method: "DELETE",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      body: JSON.stringify({ ids: s })
    }).then(v);
  };
  function _(s) {
    s._handlers = {
      sync: function(u) {
        const g = u.detail || {};
        s.fetchDelta(g.since).then(function(a) {
          S(s.dom, "ln-api-connector:fetched", { data: a, since: g.since, meta: g.meta || null });
        }).catch(function(a) {
          S(s.dom, "ln-api-connector:error", {
            action: "sync",
            error: a.message,
            status: a.status || 0,
            data: a.data || null,
            since: g.since,
            meta: g.meta || null
          });
        });
      },
      query: function(u) {
        const g = u.detail || {}, a = g.query || g;
        s.query(a).then(function(l) {
          const i = l || {};
          S(s.dom, "ln-api-connector:fetched", {
            data: i.data || (Array.isArray(i) ? i : []),
            total: i.total,
            filtered: i.filtered,
            offset: a.offset,
            queryGen: a.queryGen,
            meta: g.meta || null
          });
        }).catch(function(l) {
          S(s.dom, "ln-api-connector:error", {
            action: "query",
            error: l.message,
            status: l.status || 0,
            data: l.data || null,
            meta: g.meta || null
          });
        });
      },
      create: function(u) {
        const g = u.detail || {};
        s.create(g.data, g.url).then(function(a) {
          const l = a && a.content !== void 0 ? a.content : a, i = a && a.message ? a.message : null;
          S(s.dom, "ln-api-connector:created", { record: l, tempId: g.tempId, message: i, meta: g.meta || null });
        }).catch(function(a) {
          S(s.dom, "ln-api-connector:error", {
            action: "create",
            error: a.message,
            status: a.status || 0,
            data: a.data || null,
            tempId: g.tempId,
            meta: g.meta || null
          });
        });
      },
      update: function(u) {
        const g = u.detail || {};
        s.update(g.id, g.data, g.expected_version, g.url).then(function(a) {
          const l = a && a.content !== void 0 ? a.content : a, i = a && a.message ? a.message : null;
          S(s.dom, "ln-api-connector:updated", { record: l, id: g.id, message: i, meta: g.meta || null });
        }).catch(function(a) {
          S(s.dom, "ln-api-connector:error", {
            action: "update",
            error: a.message,
            status: a.status || 0,
            data: a.data || null,
            id: g.id,
            conflictData: a.status === 409 ? a.data : null,
            meta: g.meta || null
          });
        });
      },
      delete: function(u) {
        const g = u.detail || {};
        s.delete(g.id, g.url).then(function(a) {
          const l = a && a.message ? a.message : null;
          S(s.dom, "ln-api-connector:deleted", { response: a, id: g.id, message: l, meta: g.meta || null });
        }).catch(function(a) {
          S(s.dom, "ln-api-connector:error", {
            action: "delete",
            error: a.message,
            status: a.status || 0,
            data: a.data || null,
            id: g.id,
            meta: g.meta || null
          });
        });
      },
      bulkDelete: function(u) {
        const g = u.detail || {};
        s.bulkDelete(g.ids, g.url).then(function(a) {
          const l = a && a.message ? a.message : null;
          S(s.dom, "ln-api-connector:bulk-deleted", { response: a, ids: g.ids, message: l, meta: g.meta || null });
        }).catch(function(a) {
          S(s.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: a.message,
            status: a.status || 0,
            data: a.data || null,
            ids: g.ids,
            meta: g.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(u) {
      s.dom.addEventListener(u + ":request-sync", s._handlers.sync), s.dom.addEventListener(u + ":request-query", s._handlers.query), s.dom.addEventListener(u + ":request-fetch", s._handlers.query), s.dom.addEventListener(u + ":request-create", s._handlers.create), s.dom.addEventListener(u + ":request-update", s._handlers.update), s.dom.addEventListener(u + ":request-delete", s._handlers.delete), s.dom.addEventListener(u + ":request-bulk-delete", s._handlers.bulkDelete);
    });
  }
  b.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const s = this;
    s._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(u) {
      s.dom.removeEventListener(u + ":request-sync", s._handlers.sync), s.dom.removeEventListener(u + ":request-query", s._handlers.query), s.dom.removeEventListener(u + ":request-fetch", s._handlers.query), s.dom.removeEventListener(u + ":request-create", s._handlers.create), s.dom.removeEventListener(u + ":request-update", s._handlers.update), s.dom.removeEventListener(u + ":request-delete", s._handlers.delete), s.dom.removeEventListener(u + ":request-bulk-delete", s._handlers.bulkDelete);
    }), s._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[E];
  };
  function f(s) {
    const h = s[d];
    h && h.refreshConfig();
  }
  U(p, d, b, "ln-api-connector", {
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
    onAttributeChange: f
  });
})();
(function() {
  const p = "data-ln-couchdb-connector", d = "lnCouchDbConnector", E = "lnConnector";
  if (window[d] !== void 0) return;
  function v(a) {
    const l = a && a.content !== void 0 ? a.content : a, i = a && a.message ? a.message : null;
    return { content: l, message: i };
  }
  function b(a) {
    return this.dom = a, a[d] = this, a[E] = this, this.refreshConfig(), this._handlers = null, u(this), this;
  }
  b.prototype.refreshConfig = function() {
    const a = this.dom;
    this.url = a.getAttribute("data-ln-couchdb-url") || "", this.db = a.getAttribute("data-ln-couchdb-db") || "", this.auth = a.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const l = a.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Jt(l, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), l.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(a, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, b.prototype.fetchDelta = function(a) {
    const l = this, i = ["include_docs=true", "feed=normal"];
    a && i.push("since=" + encodeURIComponent(a));
    const r = Y(l.url, l.db, "_changes") + "?" + i.join("&");
    return window.fetch(r, { method: "GET", headers: nt(l.headers, l.auth), credentials: l.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const t = e.results || [];
      return {
        data: t.filter((o) => !o.deleted && o.doc).map((o) => Object.assign({}, o.doc, { id: o.doc._id })),
        deleted: t.filter((o) => o.deleted).map((o) => o.id),
        synced_at: e.last_seq || a || ""
      };
    });
  };
  function _(a, l) {
    const i = Object.assign({ _id: l.id }, l);
    return i._id || delete i._id, window.fetch(Y(a.url, a.db), {
      method: "POST",
      headers: nt(a.headers, a.auth),
      credentials: a.credentials,
      body: JSON.stringify(i)
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const e = v(r), t = e.content;
      return { record: Object.assign({}, i, { id: t.id, _id: t.id, _rev: t.rev }), message: e.message };
    });
  }
  b.prototype.create = function(a) {
    return _(this, a).then((l) => l.record);
  };
  function f(a, l, i) {
    const r = Object.assign({ id: String(l), _id: String(l) }, i), e = r._rev || r.rev;
    return (e ? Promise.resolve(e) : window.fetch(Y(a.url, a.db, null, l), { method: "GET", headers: nt(a.headers, a.auth), credentials: a.credentials }).then((o) => {
      if (!o.ok) throw new Error("Could not retrieve document for revision mapping");
      return o.json().then((n) => n._rev);
    })).then((o) => {
      const n = Object.assign({}, r, { _rev: o });
      delete n.rev;
      const m = Object.assign(nt(a.headers, a.auth), { "If-Match": o });
      return window.fetch(Y(a.url, a.db, null, l), {
        method: "PUT",
        headers: m,
        credentials: a.credentials,
        body: JSON.stringify(n)
      }).then((c) => {
        if (c.ok) return c.json().then((y) => {
          const w = v(y);
          return { record: Object.assign({}, n, { _rev: w.content.rev }), message: w.message };
        });
        if (c.status === 409) return c.json().then((y) => {
          const w = new Error("Conflict");
          throw w.status = 409, w.data = y, w;
        });
        throw new Error("HTTP " + c.status + ": " + c.statusText);
      });
    });
  }
  b.prototype.update = function(a, l) {
    return f(this, a, l).then((i) => i.record);
  };
  function s(a, l, i) {
    return (i ? Promise.resolve(i) : window.fetch(Y(a.url, a.db, null, l), { method: "GET", headers: nt(a.headers, a.auth), credentials: a.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((t) => t._rev);
    })).then((e) => {
      const t = Y(a.url, a.db, null, l) + "?rev=" + encodeURIComponent(e);
      return window.fetch(t, { method: "DELETE", headers: nt(a.headers, a.auth), credentials: a.credentials }).then((o) => {
        if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
        return o.json();
      }).then((o) => {
        const n = v(o);
        return { response: n.content, message: n.message };
      });
    });
  }
  b.prototype.delete = function(a, l) {
    return s(this, a, l).then((i) => i.response);
  };
  function h(a, l) {
    return !l || l.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Y(a.url, a.db, "_all_docs"), {
      method: "POST",
      headers: nt(a.headers, a.auth),
      credentials: a.credentials,
      body: JSON.stringify({ keys: l })
    }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => {
      const e = (i.rows || []).filter((t) => !t.error && t.value && t.value.rev).map((t) => ({ _id: t.id, _rev: t.value.rev, _deleted: !0 }));
      return e.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Y(a.url, a.db, "_bulk_docs"), {
        method: "POST",
        headers: nt(a.headers, a.auth),
        credentials: a.credentials,
        body: JSON.stringify({ docs: e })
      }).then((t) => {
        if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
        return t.json();
      }).then((t) => {
        const o = v(t);
        return { response: { ok: !0, results: o.content, deletedCount: e.length }, message: o.message };
      });
    });
  }
  b.prototype.bulkDelete = function(a) {
    return h(this, a).then((l) => l.response);
  };
  function u(a) {
    a._handlers = {
      sync: function(i) {
        const r = i.detail || {};
        a.fetchDelta(r.since).then(function(e) {
          S(a.dom, "ln-couchdb-connector:fetched", { data: e, since: r.since, meta: r.meta || null });
        }).catch(function(e) {
          S(a.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      create: function(i) {
        const r = i.detail || {};
        _(a, r.data).then(function(e) {
          S(a.dom, "ln-couchdb-connector:created", { record: e.record, tempId: r.tempId, message: e.message, meta: r.meta || null });
        }).catch(function(e) {
          S(a.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(i) {
        const r = i.detail || {}, e = Object.assign({}, r.data);
        r.expected_version !== void 0 && (e._rev = r.expected_version), f(a, r.id, e).then(function(t) {
          S(a.dom, "ln-couchdb-connector:updated", { record: t.record, id: r.id, message: t.message, meta: r.meta || null });
        }).catch(function(t) {
          S(a.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: t.message,
            status: t.status || 0,
            id: r.id,
            data: t.status === 409 ? t.data : null,
            conflictData: t.status === 409 ? t.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(i) {
        const r = i.detail || {};
        s(a, r.id, r.rev).then(function(e) {
          S(a.dom, "ln-couchdb-connector:deleted", { response: e.response, id: r.id, message: e.message, meta: r.meta || null });
        }).catch(function(e) {
          S(a.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(i) {
        const r = i.detail || {};
        h(a, r.ids).then(function(e) {
          S(a.dom, "ln-couchdb-connector:bulk-deleted", { response: e.response, ids: r.ids, message: e.message, meta: r.meta || null });
        }).catch(function(e) {
          S(a.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      a.dom.addEventListener(i + ":request-sync", a._handlers.sync), a.dom.addEventListener(i + ":request-fetch", a._handlers.sync), a.dom.addEventListener(i + ":request-create", a._handlers.create), a.dom.addEventListener(i + ":request-update", a._handlers.update), a.dom.addEventListener(i + ":request-delete", a._handlers.delete), a.dom.addEventListener(i + ":request-bulk-delete", a._handlers.bulkDelete);
    });
  }
  b.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const a = this;
    a._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      a.dom.removeEventListener(i + ":request-sync", a._handlers.sync), a.dom.removeEventListener(i + ":request-fetch", a._handlers.sync), a.dom.removeEventListener(i + ":request-create", a._handlers.create), a.dom.removeEventListener(i + ":request-update", a._handlers.update), a.dom.removeEventListener(i + ":request-delete", a._handlers.delete), a.dom.removeEventListener(i + ":request-bulk-delete", a._handlers.bulkDelete);
    }), a._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[E];
  };
  function g(a) {
    const l = a[d];
    l && l.refreshConfig();
  }
  U(p, d, b, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: g
  });
})();
(function() {
  const p = "data-ln-data-coordinator", d = "lnDataCoordinator", E = "lnCoordinator", v = "data-ln-form-scope";
  if (window[d] !== void 0) return;
  const b = /* @__PURE__ */ new Set();
  let _ = !1, f = null, s = null, h = null;
  function u() {
    _ || (_ = !0, f = function() {
      S(document, "ln-data-store:online", {}), b.forEach(function(t) {
        t._maybeSync();
      });
    }, s = function() {
      S(document, "ln-data-store:offline", {});
    }, h = function() {
      document.visibilityState === "visible" && b.forEach(function(t) {
        const n = t.findChildren().store;
        n && n.isLoaded && !n.isSyncing && !t._noAutosync && t._isStale() && n.forceSync();
      });
    }, window.addEventListener("online", f), window.addEventListener("offline", s), document.addEventListener("visibilitychange", h));
  }
  function g() {
    _ && (b.size > 0 || (window.removeEventListener("online", f), window.removeEventListener("offline", s), document.removeEventListener("visibilitychange", h), f = null, s = null, h = null, _ = !1));
  }
  function a() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (o) => {
        const n = Math.random() * 16 | 0;
        return (o === "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
  const l = ["ln-api-connector", "ln-couchdb-connector"];
  function i(t) {
    return this.dom = t, this._name = t.getAttribute(p), t[d] = this, t[E] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._dict = Rt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), r(this), b.add(this), u(), this._checkInitialSync(), this;
  }
  i.prototype._parseStaleAttributes = function() {
    const o = this.findChildren().storeEl, n = this.dom.getAttribute("data-ln-data-coordinator-stale") || (o ? o.getAttribute("data-ln-data-store-stale") : null), m = parseInt(n, 10);
    this._staleThreshold = n === "never" || n === "-1" ? -1 : isNaN(m) ? 300 : m;
    const c = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (o ? o.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!c;
  }, i.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const o = this.findChildren().store;
    return !o || !o.lastSyncedAt ? !0 : Date.now() / 1e3 - o.lastSyncedAt > this._staleThreshold;
  }, i.prototype._maybeSync = function() {
    const o = this.findChildren().store;
    !o || this._noAutosync || o.isLoaded && !o.isSyncing && o.forceSync();
  }, i.prototype._checkInitialSync = function() {
    const o = this.findChildren().store;
    !o || !o.isLoaded || this._noAutosync || (o.totalCount === 0 || this._isStale()) && o.forceSync();
  }, i.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const o = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    o && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(o)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(n) {
      return n;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(n) {
      return n;
    });
  }, i.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), o = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), n = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: o,
      queueEl: n,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: o ? o.lnConnector || o.lnApiConnector || o.lnCouchDbConnector : null,
      queue: n ? n.lnApiQueue : null
    };
  }, i.prototype._handleSubmitRecord = function(t) {
    const o = this.findChildren();
    if (!o.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const n = t.data || {}, m = n.id, c = n.expected_version, y = Object.assign({}, n);
    delete y.id, delete y.expected_version;
    const w = t.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(o, y, t.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(o, m, y, c, t.action);
  }, i.prototype._fanOutCreate = function(t, o, n) {
    this.refreshMapper();
    const m = "_temp_" + a();
    S(t.storeEl, "ln-data-store:request-create", { tempId: m, data: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: m,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(o),
      expectedVersion: null,
      meta: { tempId: m, action: n }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(o),
      url: n,
      meta: { entryId: a(), queued: !1, op: "create", tempId: m }
    });
  }, i.prototype._fanOutUpdate = function(t, o, n, m, c) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-update", { id: o, data: n }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "update",
      targetId: o,
      payload: this.mapper.egress(n),
      expectedVersion: m,
      meta: { id: o, action: c }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-update", {
      id: o,
      data: this.mapper.egress(n),
      expected_version: m,
      url: c,
      meta: { entryId: a(), queued: !1, op: "update", id: o }
    });
  }, i.prototype._fanOutDelete = function(t, o) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-delete", { id: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "delete",
      targetId: o,
      payload: null,
      expectedVersion: null,
      meta: { id: o }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-delete", {
      id: o,
      meta: { entryId: a(), queued: !1, op: "delete", id: o }
    });
  }, i.prototype._fanOutBulkDelete = function(t, o) {
    this.refreshMapper();
    const n = o.join(",");
    S(t.storeEl, "ln-data-store:request-bulk-delete", { ids: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: n,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: o },
      expectedVersion: null,
      meta: { bulkKey: n, ids: o }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: o,
      meta: { entryId: a(), queued: !1, op: "bulk-delete", bulkKey: n }
    });
  }, i.prototype._toastFromMessage = function(t) {
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: t.type || "success",
        title: t.title || "",
        message: t.body || ""
      }
    }));
  }, i.prototype._toastFromDict = function(t) {
    const o = this._dict[t];
    o && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: o }
    }));
  };
  function r(t) {
    t._handlers = {
      sync: function(o) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        S(n.connectorEl, "ln-api-connector:request-sync", { since: o.detail.since, meta: { op: "sync" } });
      },
      reqCreate: function(o) {
        const n = t.findChildren();
        n.storeEl && t._fanOutCreate(n, o.detail.data || {}, o.detail.action);
      },
      reqUpdate: function(o) {
        const n = t.findChildren();
        n.storeEl && t._fanOutUpdate(n, o.detail.id, o.detail.data || {}, o.detail.expected_version, o.detail.action);
      },
      reqDelete: function(o) {
        const n = t.findChildren();
        n.storeEl && t._fanOutDelete(n, o.detail.id);
      },
      reqBulkDelete: function(o) {
        const n = t.findChildren();
        n.storeEl && t._fanOutBulkDelete(n, o.detail.ids || []);
      },
      queueFailed: function() {
        t._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(o) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector || !n.queue) return;
        const m = o.detail || {}, c = m.entryId, y = m.op, w = m.targetId, A = m.payload, L = m.expectedVersion, C = m.meta || {}, k = C.action || null;
        y === "create" ? S(n.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: k,
          meta: { entryId: c, queued: !0, op: "create", tempId: C.tempId }
        }) : y === "update" ? S(n.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: A,
          expected_version: L,
          url: k,
          meta: { entryId: c, queued: !0, op: "update", id: C.id !== void 0 ? C.id : w }
        }) : y === "delete" ? S(n.connectorEl, "ln-api-connector:request-delete", {
          id: w,
          meta: { entryId: c, queued: !0, op: "delete", id: C.id !== void 0 ? C.id : w }
        }) : y === "bulk-delete" ? S(n.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          meta: { entryId: c, queued: !0, op: "bulk-delete", bulkKey: C.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", y);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(o) {
        const n = o.target;
        if (o.defaultPrevented) return;
        const m = n.hasAttribute(v) ? n.getAttribute(v) : null;
        if (m === null) return;
        let c;
        if (m ? c = m === t._name : c = n.closest("[data-ln-data-coordinator]") === t.dom, !c) return;
        const y = me(n);
        if (y !== "POST" && y !== "PUT" && y !== "PATCH") return;
        o.preventDefault();
        const w = Gt(n);
        delete w._method, delete w._token, t._handleSubmitRecord({ data: w, method: y, action: n.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(o) {
        const n = o.detail.meta || {}, m = t.findChildren();
        t.refreshMapper();
        const c = o.detail.data;
        let y = [], w = [], A = null;
        Array.isArray(c) ? (y = c, A = Math.floor(Date.now() / 1e3)) : c && (y = Array.isArray(c.data) ? c.data : [], w = Array.isArray(c.deleted) ? c.deleted : [], A = c.synced_at !== void 0 ? c.synced_at : c.since !== void 0 ? c.since : null);
        const L = y.map((C) => t.mapper.ingress(C));
        m.store && m.store.applySync(L, w, A || Math.floor(Date.now() / 1e3), {
          total: o.detail.total,
          filtered: o.detail.filtered,
          offset: o.detail.offset,
          queryGen: o.detail.queryGen,
          targetEl: n.targetEl,
          kind: n.kind
        });
      },
      connCreated: function(o) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const m = o.detail.meta || {}, c = t.mapper.ingress(o.detail.record);
        S(n.storeEl, "ln-data-store:request-update", { id: m.tempId, data: c }), t._toastFromMessage(o.detail.message), m.queued && n.queue && (S(n.queueEl, "ln-api-queue:request-remap", { oldKey: m.tempId, newId: c.id }), S(n.queueEl, "ln-api-queue:ack", { entryId: m.entryId }));
      },
      connUpdated: function(o) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const m = o.detail.meta || {}, c = t.mapper.ingress(o.detail.record);
        S(n.storeEl, "ln-data-store:request-update", { id: m.id, data: c }), t._toastFromMessage(o.detail.message), m.queued && n.queue && S(n.queueEl, "ln-api-queue:ack", { entryId: m.entryId });
      },
      connDeleted: function(o) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const m = o.detail.meta || {};
        t._toastFromMessage(o.detail.message), m.queued && n.queue && S(n.queueEl, "ln-api-queue:ack", { entryId: m.entryId });
      },
      connBulkDeleted: function(o) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const m = o.detail.meta || {};
        t._toastFromMessage(o.detail.message), m.queued && n.queue && S(n.queueEl, "ln-api-queue:ack", { entryId: m.entryId });
      },
      connError: function(o) {
        const n = o.detail || {}, m = n.meta || {}, c = m.op || n.action, y = n.status || 0;
        if (c === "sync") {
          console.error("[ln-data-coordinator] Sync failed:", n.error);
          return;
        }
        const w = t.findChildren();
        if (!w.storeEl) return;
        const A = y === 401 || y === 419, L = y === 0 || y >= 500, C = y === 409;
        if (A) {
          t._toastFromDict("auth"), m.queued && w.queue && S(w.queueEl, "ln-api-queue:nack", { entryId: m.entryId, reason: "auth" });
          return;
        }
        if (L) {
          m.queued && w.queue ? S(w.queueEl, "ln-api-queue:nack", { entryId: m.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        if (C && c === "update") {
          const k = n.data && n.data.remote ? t.mapper.ingress(n.data.remote) : null;
          k && S(w.storeEl, "ln-data-store:request-update", { id: m.id, data: k }), t._toastFromDict("conflict");
        } else c === "create" && S(w.storeEl, "ln-data-store:request-delete", { id: m.tempId }), t._toastFromDict("rejected");
        m.queued && w.queue && S(w.queueEl, "ln-api-queue:nack", { entryId: m.entryId, reason: "drop" });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(o) {
        const m = t.findChildren().store;
        if (!m || t._noAutosync) return;
        (o.detail || {}).hasCache ? t._isStale() && m.forceSync() : m.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(o) {
        t._serveData(o, "table");
      },
      reqListData: function(o) {
        t._serveData(o, "list");
      },
      reqOptions: function(o) {
        t._serveOptions(o);
      },
      reqStat: function(o) {
        t._serveStat(o);
      },
      refresh: function() {
        t._refreshAll();
      },
      refreshSynced: function(o) {
        o.detail && o.detail.changed && t._refreshAll(o.detail.meta);
      }
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), l.forEach(function(o) {
      t.dom.addEventListener(o + ":fetched", t._handlers.connFetched), t.dom.addEventListener(o + ":created", t._handlers.connCreated), t.dom.addEventListener(o + ":updated", t._handlers.connUpdated), t.dom.addEventListener(o + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(o + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(o + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:loaded", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced);
  }
  i.prototype._ownsStore = function(t) {
    const o = this.findChildren();
    return !!(o.store && o.store._name === t && t || this._name === t && t);
  }, i.prototype._serveData = function(t, o) {
    const n = t.target, m = o === "table" ? "data-ln-table-store" : "data-ln-list-store", c = n.getAttribute(m) || n.getAttribute("data-ln-table-source") || n.getAttribute("data-ln-list-source");
    if (!c || !this._ownsStore(c)) return;
    this._boundQueries.set(n, {
      sort: t.detail.sort,
      filters: t.detail.filters,
      search: t.detail.search,
      offset: t.detail.offset,
      limit: t.detail.limit,
      queryGen: t.detail.queryGen
    });
    const y = this.findChildren(), w = {
      sort: t.detail.sort,
      filters: t.detail.filters,
      search: t.detail.search,
      offset: t.detail.offset,
      limit: t.detail.limit,
      queryGen: t.detail.queryGen
    }, A = this, L = t.detail.offset != null;
    if (y.connector && (L || !y.store || !y.store.isLoaded)) {
      S(n, "ln-" + o + ":set-loading", { loading: !0 }), S(y.connectorEl, "ln-api-connector:request-query", {
        query: w,
        meta: { targetEl: n, kind: o }
      });
      return;
    }
    y.store && y.store.isLoaded && store.getAll(w).then(function(C) {
      const k = {
        data: C.data,
        total: C.total,
        filtered: C.filtered,
        offset: t.detail.offset !== void 0 ? t.detail.offset : C.offset,
        queryGen: t.detail.queryGen !== void 0 ? t.detail.queryGen : C.queryGen
      };
      S(n, "ln-" + o + ":set-data", k), A._boundDelivered.set(n, !0);
    });
  }, i.prototype._serveOptions = function(t) {
    const o = t.target, n = o.getAttribute("data-ln-options");
    if (!this._ownsStore(n)) return;
    this.findChildren().store.getAll({}).then(function(c) {
      S(o, "ln-options:set-data", { data: c.data });
    });
  }, i.prototype._serveStat = function(t) {
    const o = t.target, n = o.getAttribute("data-ln-stat");
    if (!this._ownsStore(n)) return;
    const m = t.detail.filters || null;
    this.findChildren().store.count(m).then(function(y) {
      S(o, "ln-stat:set-count", { count: y });
    });
  }, i.prototype._refreshAll = function(t) {
    const o = this, n = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let m = 0; m < n.length; m++) {
      const c = n[m];
      let y, w;
      if (c.hasAttribute("data-ln-table-store") ? (y = c.getAttribute("data-ln-table-store"), w = "table") : c.hasAttribute("data-ln-list-store") ? (y = c.getAttribute("data-ln-list-store"), w = "list") : c.hasAttribute("data-ln-options") ? (y = c.getAttribute("data-ln-options"), w = "options") : c.hasAttribute("data-ln-stat") && (y = c.getAttribute("data-ln-stat"), w = "stat"), !this._ownsStore(y)) continue;
      const A = this.findChildren().store;
      if (w === "table" || w === "list") {
        const L = o._boundQueries.get(c) || { sort: null, filters: {}, search: "" };
        (function(C, k) {
          A.getAll(L).then(function(q) {
            const D = {
              data: q.data,
              total: t && t.total !== void 0 ? t.total : q.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : q.filtered,
              offset: t && t.offset !== void 0 ? t.offset : L.offset,
              queryGen: t && t.queryGen !== void 0 ? t.queryGen : L.queryGen
            };
            S(C, "ln-" + k + ":set-loading", { loading: !1 }), S(C, "ln-" + k + ":set-data", D), o._boundDelivered.set(C, !0);
          });
        })(c, w);
      } else if (w === "options")
        (function(L) {
          A.getAll({}).then(function(C) {
            S(L, "ln-options:set-data", { data: C.data });
          });
        })(c);
      else if (w === "stat") {
        const L = c.getAttribute("data-ln-stat-filter");
        let C = null;
        if (L) {
          const k = L.indexOf(":");
          if (k !== -1) {
            const q = L.slice(0, k), D = L.slice(k + 1);
            C = {}, C[q] = [D];
          }
        }
        (function(k, q) {
          A.count(q).then(function(D) {
            S(k, "ln-stat:set-count", { count: D });
          });
        })(c, C);
      }
    }
  }, i.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), l.forEach(function(o) {
      t.dom.removeEventListener(o + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(o + ":created", t._handlers.connCreated), t.dom.removeEventListener(o + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(o + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(o + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(o + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:loaded", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, b.delete(this), g(), delete this.dom[d], delete this.dom[E];
  };
  function e(t, o) {
    const n = t[d];
    n && o === "data-ln-data-mapper" && n.refreshMapper();
  }
  U(p, d, i, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: e
  });
})();
(function() {
  const p = "data-ln-api-queue", d = "lnApiQueue";
  if (window[d] !== void 0) return;
  const E = "ln_api_queue", v = "outbox", b = "_queue_meta", _ = [2e3, 5e3, 15e3, 6e4, 3e5], f = 8;
  let s = null, h = null;
  function u() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (y) => {
        const w = Math.random() * 16 | 0;
        return (y === "x" ? w : w & 3 | 8).toString(16);
      });
    }
  }
  function g() {
    return h || (h = new Promise((c) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), c(null);
      const y = indexedDB.open(E, 1);
      y.onerror = () => {
        console.warn("[ln-api-queue] IndexedDB open failed — queue disabled"), c(null);
      }, y.onupgradeneeded = (w) => {
        const A = w.target.result;
        if (!A.objectStoreNames.contains(v)) {
          const L = A.createObjectStore(v, { keyPath: "entryId" });
          L.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), L.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 });
        }
        A.objectStoreNames.contains(b) || A.createObjectStore(b, { keyPath: "key" });
      }, y.onsuccess = (w) => {
        const A = w.target.result;
        A.onversionchange = () => {
          A.close(), s = null, h = null;
        }, s = A, c(A);
      };
    }), h);
  }
  function a() {
    return s ? Promise.resolve(s) : (h = null, g());
  }
  function l(c) {
    return new Promise((y, w) => {
      c.onsuccess = () => y(c.result), c.onerror = () => w(c.error);
    });
  }
  const i = (c, y) => a().then((w) => w ? w.transaction(c, y).objectStore(c) : null);
  function r(c) {
    return i(v, "readwrite").then((y) => y ? l(y.put(c)) : null);
  }
  function e(c) {
    return i(v, "readwrite").then((y) => y ? l(y.delete(c)) : null);
  }
  function t(c) {
    return i(v, "readonly").then((y) => {
      if (!y) return [];
      const w = y.index("by_scope_seq"), A = IDBKeyRange.bound([c, -1 / 0], [c, 1 / 0]);
      return l(w.getAll(A));
    });
  }
  function o(c) {
    return i(b, "readwrite").then((y) => y ? l(y.get("seq")).then((w) => {
      const A = (w && typeof w.value == "number" ? w.value : 0) + 1;
      return i(b, "readwrite").then((L) => l(L.put({ key: "seq", value: A }))).then(() => A);
    }) : 0);
  }
  function n(c) {
    this.dom = c, c[d] = this;
    const y = c.closest("[data-ln-data-coordinator]");
    this.scope = c.getAttribute(p) || (y ? y.getAttribute("data-ln-data-coordinator") : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const w = this;
    return g().then(() => {
      w._emitPendingCount(), w._drain();
    }), this;
  }
  n.prototype._isOnline = function() {
    const c = this.dom.getAttribute("data-ln-api-queue-online");
    return c === "true" ? !0 : c === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const c = this;
    return t(c.scope).then((y) => {
      S(c.dom, "ln-api-queue:pending-count", { count: y.length, scope: c.scope }), y.length === 0 && S(c.dom, "ln-api-queue:drained", { scope: c.scope });
    });
  }, n.prototype._clearTimer = function(c) {
    const y = this._timers.get(c);
    y && (clearTimeout(y), this._timers.delete(c));
  }, n.prototype._scheduleTimer = function(c, y) {
    if (this._timers.has(c)) return;
    const w = this, A = setTimeout(() => {
      w._timers.delete(c), w._drain();
    }, y);
    this._timers.set(c, A);
  }, n.prototype._drain = function() {
    const c = this;
    if (!c._paused && c._isOnline())
      return t(c.scope).then((y) => {
        const w = /* @__PURE__ */ new Map();
        for (const A of y)
          w.has(A.chainKey) || w.set(A.chainKey, []), w.get(A.chainKey).push(A);
        w.forEach((A, L) => {
          A.sort((q, D) => q.seq - D.seq);
          const C = A.find((q) => q.status !== "failed");
          if (!C || C.status === "inflight") return;
          const k = Date.now();
          if (C.nextAttemptAt > k) {
            c._scheduleTimer(L, C.nextAttemptAt - k);
            return;
          }
          c._clearTimer(L), C.status = "inflight", r(C).then(() => {
            S(c.dom, "ln-api-queue:send", {
              entryId: C.entryId,
              chainKey: C.chainKey,
              op: C.op,
              targetId: C.targetId,
              payload: C.payload,
              expectedVersion: C.expectedVersion,
              meta: C.meta
            });
          });
        });
      });
  }, n.prototype._onEnqueue = function(c) {
    const y = this, w = c.detail || {};
    return o(y.scope).then((A) => {
      const L = {
        entryId: u(),
        scope: y.scope,
        chainKey: w.chainKey,
        seq: A,
        op: w.op,
        targetId: w.targetId !== void 0 ? w.targetId : null,
        payload: w.payload,
        expectedVersion: w.expectedVersion !== void 0 ? w.expectedVersion : null,
        meta: w.meta || {},
        attempts: 0,
        nextAttemptAt: 0,
        status: "pending"
      };
      return r(L).then(() => t(y.scope)).then((C) => {
        S(y.dom, "ln-api-queue:enqueued", { entryId: L.entryId, chainKey: L.chainKey, count: C.length }), S(y.dom, "ln-api-queue:pending-count", { count: C.length, scope: y.scope }), y._drain();
      });
    });
  }, n.prototype._onAck = function(c) {
    const y = this, w = c.detail || {};
    return e(w.entryId).then(() => t(y.scope)).then((A) => {
      S(y.dom, "ln-api-queue:pending-count", { count: A.length, scope: y.scope }), A.length === 0 && S(y.dom, "ln-api-queue:drained", { scope: y.scope }), y._drain();
    });
  }, n.prototype._onNack = function(c) {
    const y = this, w = c.detail || {}, A = w.reason;
    return t(y.scope).then((L) => {
      const C = L.find((k) => k.entryId === w.entryId);
      if (C) {
        if (A === "retry")
          return C.attempts = (C.attempts || 0) + 1, C.attempts >= f ? (C.status = "failed", r(C).then(() => (S(y.dom, "ln-api-queue:failed", { entryId: C.entryId, chainKey: C.chainKey, attempts: C.attempts }), t(y.scope))).then((k) => {
            S(y.dom, "ln-api-queue:pending-count", { count: k.length, scope: y.scope });
          })) : (C.nextAttemptAt = Date.now() + _[Math.min(C.attempts - 1, _.length - 1)], C.status = "pending", r(C).then(() => (y._scheduleTimer(C.chainKey, C.nextAttemptAt - Date.now()), t(y.scope))).then((k) => {
            S(y.dom, "ln-api-queue:pending-count", { count: k.length, scope: y.scope });
          }));
        if (A === "drop")
          return e(C.entryId).then(() => t(y.scope)).then((k) => {
            S(y.dom, "ln-api-queue:pending-count", { count: k.length, scope: y.scope }), k.length === 0 && S(y.dom, "ln-api-queue:drained", { scope: y.scope }), y._drain();
          });
        if (A === "auth")
          return C.status = "pending", r(C).then(() => {
            y._paused = !0, S(y.dom, "ln-api-queue:paused", { reason: "auth" }), S(y.dom, "ln-api-queue:auth-required", { entryId: C.entryId, chainKey: C.chainKey });
          });
      }
    });
  }, n.prototype._onRemap = function(c) {
    const y = this, w = c.detail || {}, A = w.oldKey, L = w.newId;
    return t(y.scope).then((C) => {
      const k = C.filter((q) => q.chainKey === A && q.status !== "failed");
      return Promise.all(k.map((q) => (q.targetId === A && (q.targetId = L), q.meta && typeof q.meta.action == "string" && q.meta.action.indexOf(A) !== -1 && (q.meta.action = q.meta.action.split(A).join(L)), q.chainKey = L, r(q))));
    });
  }, n.prototype._onResume = function() {
    this._paused = !1, S(this.dom, "ln-api-queue:resumed", {}), this._drain();
  }, n.prototype._onDrain = function() {
    this._drain();
  }, n.prototype._onClear = function() {
    const c = this;
    return t(c.scope).then((y) => Promise.all(y.map((w) => e(w.entryId)))).then(() => {
      S(c.dom, "ln-api-queue:pending-count", { count: 0, scope: c.scope }), S(c.dom, "ln-api-queue:drained", { scope: c.scope });
    });
  }, n.prototype._bindEvents = function() {
    const c = this;
    c._handlers = {
      enqueue: (y) => c._onEnqueue(y),
      ack: (y) => c._onAck(y),
      nack: (y) => c._onNack(y),
      remap: (y) => c._onRemap(y),
      resume: (y) => c._onResume(y),
      drain: (y) => c._onDrain(y),
      clear: (y) => c._onClear(y)
    }, c.dom.addEventListener("ln-api-queue:request-enqueue", c._handlers.enqueue), c.dom.addEventListener("ln-api-queue:ack", c._handlers.ack), c.dom.addEventListener("ln-api-queue:nack", c._handlers.nack), c.dom.addEventListener("ln-api-queue:request-remap", c._handlers.remap), c.dom.addEventListener("ln-api-queue:request-resume", c._handlers.resume), c.dom.addEventListener("ln-api-queue:request-drain", c._handlers.drain), c.dom.addEventListener("ln-api-queue:request-clear", c._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const c = this;
    c.dom.removeEventListener("ln-api-queue:request-enqueue", c._handlers.enqueue), c.dom.removeEventListener("ln-api-queue:ack", c._handlers.ack), c.dom.removeEventListener("ln-api-queue:nack", c._handlers.nack), c.dom.removeEventListener("ln-api-queue:request-remap", c._handlers.remap), c.dom.removeEventListener("ln-api-queue:request-resume", c._handlers.resume), c.dom.removeEventListener("ln-api-queue:request-drain", c._handlers.drain), c.dom.removeEventListener("ln-api-queue:request-clear", c._handlers.clear), window.removeEventListener("online", c._onlineHandler), c._timers.forEach((y) => clearTimeout(y)), c._timers.clear(), S(c.dom, "ln-api-queue:destroyed", { scope: c.scope }), delete c.dom[d];
  };
  function m(c) {
    const y = c[d];
    y && y._drain();
  }
  U(p, d, n, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: m
  });
})();
(function() {
  const p = "data-ln-options", d = "lnOptions";
  if (window[d] !== void 0) return;
  function E(v) {
    this.dom = v, this._storeName = v.getAttribute(p), this._valueField = v.getAttribute("data-ln-options-value") || "id", this._labelField = v.getAttribute("data-ln-options-label") || "name";
    const b = this;
    return this._onSetData = function(_) {
      b._rebuild(_.detail.data || []);
    }, v.addEventListener("ln-options:set-data", this._onSetData), S(v, "ln-options:request-data", { options: this._storeName }), this;
  }
  E.prototype._rebuild = function(v) {
    const b = this.dom, _ = this._valueField, f = this._labelField, s = b.value, h = b.querySelectorAll("option");
    for (let g = h.length - 1; g >= 0; g--)
      h[g].value !== "" && b.removeChild(h[g]);
    for (let g = 0; g < v.length; g++) {
      const a = v[g], l = document.createElement("option");
      l.value = String(a[_]), l.textContent = a[f] != null ? a[f] : "", b.appendChild(l);
    }
    const u = b.options;
    for (let g = 0; g < u.length; g++)
      if (u[g].value === s) {
        b.value = s;
        break;
      }
  }, E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[d]);
  }, U(p, d, E, "ln-options");
})();
(function() {
  const p = "data-ln-stat", d = "lnStat";
  if (window[d] !== void 0) return;
  function E(b) {
    if (!b) return null;
    const _ = b.indexOf(":");
    if (_ === -1) return null;
    const f = b.slice(0, _), s = b.slice(_ + 1), h = {};
    return h[f] = [s], h;
  }
  function v(b) {
    return this.dom = b, this._storeName = b.getAttribute(p), this._filters = E(b.getAttribute("data-ln-stat-filter")), this._onSetCount = function(_) {
      b.textContent = String(_.detail.count), b.classList.remove("is-loading");
    }, b.addEventListener("ln-stat:set-count", this._onSetCount), S(b, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  v.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[d]);
  }, U(p, d, v, "ln-stat");
})();
(function() {
  const p = "ln-icons-sprite", d = "#ln-", E = "#lnc-", v = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set();
  let _ = null;
  const f = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), h = "lni:", u = "lni:v", g = "1";
  function a() {
    try {
      if (localStorage.getItem(u) !== g) {
        for (let n = localStorage.length - 1; n >= 0; n--) {
          const m = localStorage.key(n);
          m && m.indexOf(h) === 0 && localStorage.removeItem(m);
        }
        localStorage.setItem(u, g);
      }
    } catch {
    }
  }
  a();
  function l() {
    return _ || (_ = document.getElementById(p), _ || (_ = document.createElementNS("http://www.w3.org/2000/svg", "svg"), _.id = p, _.setAttribute("hidden", ""), _.setAttribute("aria-hidden", "true"), _.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(_, document.body.firstChild))), _;
  }
  function i(n) {
    return n.indexOf(E) === 0 ? s + "/" + n.slice(E.length) + ".svg" : f + "/" + n.slice(d.length) + ".svg";
  }
  function r(n, m) {
    const c = m.match(/viewBox="([^"]+)"/), y = c ? c[1] : "0 0 24 24", w = m.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = w ? w[1].trim() : "", L = m.match(/<svg([^>]*)>/i), C = L ? L[1] : "", k = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    k.id = n, k.setAttribute("viewBox", y), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(q) {
      const D = C.match(new RegExp(q + '="([^"]*)"'));
      D && k.setAttribute(q, D[1]);
    }), k.innerHTML = A, l().querySelector("defs").appendChild(k);
  }
  function e(n) {
    if (v.has(n) || b.has(n) || n.indexOf(E) === 0 && !s) return;
    const m = n.slice(1);
    try {
      const c = localStorage.getItem(h + m);
      if (c) {
        r(m, c), v.add(n);
        return;
      }
    } catch {
    }
    b.add(n), fetch(i(n)).then(function(c) {
      if (!c.ok) throw new Error(c.status);
      return c.text();
    }).then(function(c) {
      r(m, c), v.add(n), b.delete(n);
      try {
        localStorage.setItem(h + m, c);
      } catch {
      }
    }).catch(function() {
      b.delete(n);
    });
  }
  function t(n) {
    const m = 'use[href^="' + d + '"], use[href^="' + E + '"]', c = n.querySelectorAll ? n.querySelectorAll(m) : [];
    if (n.matches && n.matches(m)) {
      const y = n.getAttribute("href");
      y && e(y);
    }
    Array.prototype.forEach.call(c, function(y) {
      const w = y.getAttribute("href");
      w && e(w);
    });
  }
  function o() {
    t(document), new MutationObserver(function(n) {
      n.forEach(function(m) {
        if (m.type === "childList")
          m.addedNodes.forEach(function(c) {
            c.nodeType === 1 && t(c);
          });
        else if (m.type === "attributes" && m.attributeName === "href") {
          const c = m.target.getAttribute("href");
          c && (c.indexOf(d) === 0 || c.indexOf(E) === 0) && e(c);
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
(function() {
  const p = "data-ln-debug", d = "lnDebug";
  if (window[d] !== void 0) return;
  function E(v) {
    return this.dom = v, this;
  }
  E.prototype.destroy = function() {
    delete this.dom[d];
  }, U(p, d, E, "ln-debug");
})();
