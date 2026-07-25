if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...d) {
    typeof d[0] == "string" && (d[0].startsWith("[ln-") || d[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, d);
  };
}
const Tt = {};
function wt(h, d) {
  Tt[h] || (Tt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const E = Tt[h];
  return E ? E.content.cloneNode(!0) : (console.warn("[" + (d || "ln-core") + '] Template "' + h + '" not found'), null);
}
function S(h, d, E) {
  h.dispatchEvent(new CustomEvent(d, {
    bubbles: !0,
    detail: E || {}
  }));
}
function G(h, d, E) {
  const v = new CustomEvent(d, {
    bubbles: !0,
    cancelable: !0,
    detail: E || {}
  });
  return h.dispatchEvent(v), v;
}
function Wt(h, d, E) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const v = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  v[E] = h.name, S(h.dom, d, v);
}
function Q(h, d) {
  if (!h || !d) return h;
  const E = h.querySelectorAll("[data-ln-field]");
  for (let _ = 0; _ < E.length; _++) {
    const l = E[_], f = l.getAttribute("data-ln-field");
    d[f] != null && (l.textContent = d[f]);
  }
  const v = h.querySelectorAll("[data-ln-attr]");
  for (let _ = 0; _ < v.length; _++) {
    const l = v[_], f = l.getAttribute("data-ln-attr").split(",");
    for (let u = 0; u < f.length; u++) {
      const p = f[u].trim().split(":");
      if (p.length !== 2) continue;
      const s = p[0].trim(), a = p[1].trim();
      d[a] != null && l.setAttribute(s, d[a]);
    }
  }
  const b = h.querySelectorAll("[data-ln-show]");
  for (let _ = 0; _ < b.length; _++) {
    const l = b[_], f = l.getAttribute("data-ln-show");
    f in d && l.classList.toggle("hidden", !d[f]);
  }
  const m = h.querySelectorAll("[data-ln-class]");
  for (let _ = 0; _ < m.length; _++) {
    const l = m[_], f = l.getAttribute("data-ln-class").split(",");
    for (let u = 0; u < f.length; u++) {
      const p = f[u].trim().split(":");
      if (p.length !== 2) continue;
      const s = p[0].trim(), a = p[1].trim();
      a in d && l.classList.toggle(s, !!d[a]);
    }
  }
  return h;
}
function fe(h, d) {
  h.matches && h.matches("[data-ln-form], [data-ln-fillable]") && h.dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  const E = h.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let v = 0; v < E.length; v++)
    E[v].dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  return h;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(h) {
  if (!(!h.target.matches || !h.target.matches("[data-ln-fillable]")))
    if (h.detail)
      Q(h.target, h.detail);
    else {
      const d = h.target.querySelectorAll("[data-ln-field]");
      for (let E = 0; E < d.length; E++)
        d[E].textContent = "";
    }
})));
function gt(h, d) {
  if (!h || !d) return h;
  const E = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; E.nextNode(); ) {
    const m = E.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(_, l) {
        return d[l] !== void 0 ? d[l] : "";
      }
    ));
  }
  const v = function(m, _) {
    return d[_] !== void 0 ? d[_] : "";
  }, b = Array.from(h.querySelectorAll("*"));
  h.nodeType === 1 && b.push(h);
  for (let m = 0; m < b.length; m++) {
    const _ = b[m], l = _.attributes;
    for (let f = 0; f < l.length; f++) {
      const u = l[f];
      u.value.indexOf("{{") !== -1 && _.setAttribute(u.name, u.value.replace(/\{\{\s*(\w+)\s*\}\}/g, v));
    }
  }
  return h;
}
function pe(h, d, E, v, b, m) {
  const _ = {};
  for (let f = 0; f < h.children.length; f++) {
    const u = h.children[f], p = u.getAttribute("data-ln-key");
    p && (_[p] = u);
  }
  const l = document.createDocumentFragment();
  for (let f = 0; f < d.length; f++) {
    const u = d[f], p = String(v(u));
    let s = _[p];
    if (s)
      b(s, u, f);
    else {
      const a = wt(E, m);
      if (!a || (gt(a, u), s = a.firstElementChild, !s)) continue;
      s.setAttribute("data-ln-key", p), b(s, u, f);
    }
    l.appendChild(s);
  }
  h.textContent = "", h.appendChild(l);
}
function tt(h, d) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      tt(h, d);
    }), console.warn("[" + d + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function ct(h, d, E) {
  if (h) {
    const v = h.querySelector('[data-ln-template="' + d + '"]');
    if (v) return v.content.cloneNode(!0);
  }
  return wt(d, E);
}
function Rt(h, d) {
  const E = {}, v = h.querySelectorAll("[" + d + "]");
  for (let b = 0; b < v.length; b++)
    E[v[b].getAttribute(d)] = v[b].textContent, v[b].remove();
  return E;
}
function xt(h, d, E, v) {
  if (h.nodeType !== 1) return;
  const m = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", _ = Array.from(h.querySelectorAll(m));
  h.matches && h.matches(m) && _.push(h);
  for (const l of _)
    l[E] || (l[E] = new v(l));
}
function vt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function me(h) {
  const d = h.querySelector('input[name="_method"]');
  return ((d && d.value !== "" ? d.value : h.method) || "").toUpperCase();
}
function Gt(h, d) {
  const E = !!(d && d.typed), v = d && d.exclude, b = {}, m = h.elements, _ = {};
  if (E)
    for (let l = 0; l < m.length; l++) {
      const f = m[l];
      f.name && f.type === "checkbox" && !f.disabled && (_[f.name] = (_[f.name] || 0) + 1);
    }
  for (let l = 0; l < m.length; l++) {
    const f = m[l];
    if (!(!f.name || f.disabled || f.type === "file" || f.type === "submit" || f.type === "button") && !(v && f.matches && f.matches(v)))
      if (f.type === "checkbox")
        E && _[f.name] === 1 ? b[f.name] = f.checked : (b[f.name] || (b[f.name] = []), f.checked && b[f.name].push(f.value));
      else if (f.type === "radio")
        f.checked && (b[f.name] = f.value);
      else if (f.type === "select-multiple") {
        b[f.name] = [];
        for (let u = 0; u < f.options.length; u++)
          f.options[u].selected && b[f.name].push(f.options[u].value);
      } else if (E && f.type === "hidden")
        b[f.name] = f.value;
      else if (E && (f.type === "number" || f.type === "range")) {
        const u = Number(f.value);
        b[f.name] = f.value === "" || isNaN(u) ? null : u;
      } else
        b[f.name] = f.value;
  }
  return b;
}
function _e(h) {
  if (typeof h != "string") return !!h;
  const d = h.trim().toLowerCase();
  return d !== "false" && d !== "0" && d !== "" && d !== "off" && d !== "no";
}
function $t(h, d) {
  const E = h.elements, v = [], b = {};
  for (let m = 0; m < E.length; m++) {
    const _ = E[m];
    _.name && _.type === "checkbox" && (b[_.name] = (b[_.name] || 0) + 1);
  }
  for (let m = 0; m < E.length; m++) {
    const _ = E[m];
    if (_.type === "file" || _.type === "submit" || _.type === "button") continue;
    const l = _.getAttribute("data-ln-fill-as") || _.name;
    if (!l || !(l in d)) continue;
    const f = d[l];
    if (_.type === "checkbox") {
      if (Array.isArray(f))
        _.checked = f.indexOf(_.value) !== -1;
      else if (b[_.name] > 1) {
        const u = String(f).split(",").map(function(p) {
          return p.trim();
        });
        _.checked = u.indexOf(_.value) !== -1;
      } else
        _.checked = _e(f);
      v.push(_);
    } else if (_.type === "radio")
      _.checked = _.value === String(f), v.push(_);
    else if (_.type === "select-multiple") {
      if (Array.isArray(f))
        for (let u = 0; u < _.options.length; u++)
          _.options[u].selected = f.indexOf(_.options[u].value) !== -1;
      v.push(_);
    } else
      _.value = f, v.push(_);
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
function V(h) {
  const d = h ? h.closest("[lang]") : null, E = (d ? d.getAttribute("lang") || d.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!E) return "en-US";
  const v = E.trim().toLowerCase();
  return v.indexOf("-") === -1 && Ht[v] ? Ht[v] : E;
}
function Ut(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function Yt(h, d, { get: E, set: v }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return E ? E.call(this) : d.get.call(this);
    },
    set: function(b) {
      v ? v.call(this, b, (m) => d.set.call(this, m)) : d.set.call(this, b);
    },
    configurable: !0
  });
}
function U(h, d, E, v, b = {}) {
  const m = b.extraAttributes || [], _ = b.onAttributeChange || null, l = b.onInit || null;
  function f(u) {
    const p = u || document.body;
    xt(p, h, d, E), l && l(p);
  }
  return tt(function() {
    const u = new MutationObserver(function(s) {
      for (let a = 0; a < s.length; a++) {
        const e = s[a];
        if (e.type === "childList") {
          for (let i = 0; i < e.addedNodes.length; i++) {
            const r = e.addedNodes[i];
            r.nodeType === 1 && (xt(r, h, d, E), l && l(r));
          }
          for (let i = 0; i < e.removedNodes.length; i++) {
            const r = e.removedNodes[i];
            if (r.nodeType === 1) {
              const o = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", n = Array.from(r.querySelectorAll(o));
              r.matches && r.matches(o) && n.push(r);
              for (let g = 0; g < n.length; g++) {
                const c = n[g];
                if (!document.contains(c)) {
                  const y = c[d];
                  y && typeof y.destroy == "function" && y.destroy();
                }
              }
            }
          }
        } else e.type === "attributes" && (_ && e.target[d] ? _(e.target, e.attributeName) : (xt(e.target, h, d, E), l && l(e.target)));
      }
    });
    let p = [];
    if (h.indexOf("[") !== -1) {
      const s = /\[([\w-]+)/g;
      let a;
      for (; (a = s.exec(h)) !== null; )
        p.push(a[1]);
    } else
      p.push(h);
    u.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: p.concat(m)
    });
  }, v || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[d] = f, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body), f;
}
function Xt(h, d) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !d) return !1;
  const E = d.getAttribute("href");
  return !(!E || d.getAttribute("target") === "_blank" || d.hasAttribute("download") || E.startsWith("mailto:") || E.startsWith("tel:") || E === "#" || E.startsWith("#") || d.hostname && d.hostname !== window.location.hostname);
}
function Y(...h) {
  return h.filter((d) => d != null && d !== "").map((d, E) => E === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function nt(h, d) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, d ? { Authorization: d } : null);
}
function Jt(h, d = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (E) {
    return console.error(`[${d}] Invalid headers JSON:`, E), {};
  }
}
const Qt = {};
function ge(h, d) {
  Qt[h] = d;
}
function be(h) {
  return Qt[h] || { ingress: (d) => d, egress: (d) => d };
}
const Zt = {};
function Nt(h, d) {
  if (!h || typeof d != "object") return;
  const E = h.toLowerCase().split("-")[0];
  Zt[E] = d;
}
function mt(h) {
  if (!h) return null;
  const d = h.toLowerCase().split("-")[0];
  return Zt[d] || null;
}
Nt("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ge, window.lnCore.getDataMapper = be, window.lnCore.registerLocaleFallback = Nt, window.lnCore.getLocaleFallback = mt, window.lnCore.fillTemplate = gt, window.lnCore.fill = Q, window.lnCore.lnFill = fe, window.lnCore.renderList = pe);
function Mt(h, d) {
  let E = !1;
  return function() {
    E || (E = !0, queueMicrotask(function() {
      E = !1, h(), d && d();
    }));
  };
}
function te(h) {
  h = h || {};
  let d = h.windowSize > 0 ? h.windowSize : 1e3, E = h.pageSize > 0 ? h.pageSize : 200, v = h.threshold != null ? h.threshold : 25, b = h.fetchDebounce != null ? h.fetchDebounce : 120;
  const m = typeof h.requestPage == "function" ? h.requestPage : function() {
  }, _ = typeof h.onChange == "function" ? h.onChange : function() {
  }, l = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  let p = 0, s = 0, a = 0, e = { sort: null, filters: {}, search: "" }, i = null, r = 0;
  function t(c) {
    f.set(c, ++r);
  }
  function o() {
    return !!(e && (e.search || e.filters && Object.keys(e.filters).length));
  }
  function n() {
    if (l.size <= d) return;
    const c = Array.from(l.keys()).sort(function(w, A) {
      return (f.get(w) || 0) - (f.get(A) || 0);
    });
    let y = 0;
    for (; l.size > d && y < c.length; )
      l.delete(c[y]), f.delete(c[y]), y++;
  }
  function g(c, y) {
    u.add(c), m(e, c, y);
  }
  return {
    get: function(c) {
      return l.get(c);
    },
    has: function(c) {
      return l.has(c);
    },
    peek: function() {
      return l.size ? l.values().next().value : void 0;
    },
    get logicalTotal() {
      return p;
    },
    get grandTotal() {
      return s;
    },
    get queryGen() {
      return a;
    },
    get size() {
      return l.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(c, y) {
      for (let q = c; q < y; q++)
        l.has(q) && t(q);
      if (p <= 0) return;
      const w = Math.max(0, c - v), A = Math.min(p, y + v), L = Math.floor(w / E), C = Math.floor(Math.max(0, A - 1) / E);
      let x = -1, D = E;
      for (let q = L; q <= C; q++) {
        const N = q * E, O = Math.min(E, p - N);
        let B = !1;
        for (let j = N; j < N + O; j++)
          if (!l.has(j)) {
            B = !0;
            break;
          }
        if (B && !u.has(N)) {
          x = N, D = O;
          break;
        }
      }
      x !== -1 && (clearTimeout(i), i = setTimeout(function() {
        g(x, D);
      }, b));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(c) {
      if (c = c || {}, c.queryGen != null && c.queryGen !== a) return;
      s = c.total != null ? c.total : s, p = c.filtered != null ? c.filtered : c.data ? c.data.length : p;
      const y = c.offset || 0, w = c.data || [];
      for (let A = 0; A < w.length; A++)
        l.set(y + A, w[A]), t(y + A);
      u.delete(y), n(), _();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(c) {
      c && (e = c), g(0, E);
    },
    // Query change: new generation, drop everything, refetch page 0, then
    // notify for an immediate all-placeholder repaint at the stale height.
    invalidate: function(c) {
      a++, l.clear(), f.clear(), u.clear(), clearTimeout(i), c && (e = c), g(0, E), _();
    },
    destroy: function() {
      clearTimeout(i), l.clear(), f.clear(), u.clear();
    },
    configure: function(c) {
      c = c || {};
      let y = !1;
      if (c.windowSize != null && c.windowSize > 0 && c.windowSize !== d) {
        const w = c.windowSize < d;
        d = c.windowSize, w && n(), y = !0;
      }
      c.pageSize != null && c.pageSize > 0 && (E = c.pageSize), c.threshold != null && c.threshold >= 0 && (v = c.threshold), c.fetchDebounce != null && c.fetchDebounce >= 0 && (b = c.fetchDebounce), y && _();
    },
    setGrandTotal: function(c) {
      c == null || isNaN(c) || c < 0 || (s = c, o() || (p = c), _());
    }
  };
}
const ye = "ln:";
let ut = null;
function ee() {
  if (ut !== null) return ut;
  try {
    if (typeof localStorage > "u")
      return ut = !1, !1;
    const h = "__ln_test__";
    localStorage.setItem(h, h), localStorage.removeItem(h), ut = !0;
  } catch {
    ut = !1;
  }
  return ut;
}
function ve() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function ne(h, d) {
  const E = d.getAttribute("data-ln-persist"), v = E !== null && E !== "" ? E : d.id;
  return v ? ye + h + ":" + ve() + ":" + v : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', d), null);
}
function St(h, d) {
  if (!ee()) return null;
  const E = ne(h, d);
  if (!E) return null;
  try {
    const v = localStorage.getItem(E);
    return v !== null ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
function dt(h, d, E) {
  if (!ee()) return;
  const v = ne(h, d);
  if (v)
    try {
      E == null ? localStorage.removeItem(v) : localStorage.setItem(v, JSON.stringify(E));
    } catch {
    }
}
function ie(h) {
  return (h || "").replace(/^#/, "");
}
function Ct(h) {
  const d = h === void 0 ? location.hash : h, E = {}, v = ie(d);
  if (!v) return E;
  const b = v.split("&");
  for (let m = 0; m < b.length; m++) {
    const _ = b[m];
    if (!_) continue;
    const l = _.indexOf(":"), f = l > -1 ? _.slice(0, l) : _, u = l > -1 ? _.slice(l + 1) : "";
    if (f)
      try {
        E[f] = decodeURIComponent(u);
      } catch {
        E[f] = u;
      }
  }
  return E;
}
function lt(h) {
  if (!h) return null;
  const d = Ct();
  return h in d ? d[h] : null;
}
function at(h, d) {
  if (!h) return;
  const E = Ct();
  d == null ? delete E[h] : E[h] = String(d);
  const b = Object.keys(E).map(function(m) {
    const _ = E[m];
    return _ === "" ? m : m + ":" + encodeURIComponent(_);
  }).join("&");
  ie(location.hash) !== b && (location.hash = b);
}
function Ft(h) {
  return h.button === 1 || h.ctrlKey || h.metaKey || h.shiftKey ? !1 : (h.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Ct, window.lnCore.hashGet = lt, window.lnCore.hashSet = at, window.lnCore.hashLinkClick = Ft);
function Et(h, d, E, v) {
  const b = typeof v == "number" ? v : 4, m = window.innerWidth, _ = window.innerHeight, l = d.width, f = d.height, u = (E || "bottom").split("-"), p = u[0], s = u[1] === "start" || u[1] === "end" ? u[1] : "center", a = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, e = a[p] || a.bottom;
  function i(g) {
    return g === "top" || g === "bottom" ? s === "start" ? h.left : s === "end" ? h.right - l : h.left + (h.width - l) / 2 : s === "start" ? h.top : s === "end" ? h.bottom - f : h.top + (h.height - f) / 2;
  }
  function r(g) {
    let c, y, w = !0;
    return g === "top" ? (c = h.top - b - f, y = i(g), c < 0 && (w = !1)) : g === "bottom" ? (c = h.bottom + b, y = i(g), c + f > _ && (w = !1)) : g === "left" ? (c = i(g), y = h.left - b - l, y < 0 && (w = !1)) : (c = i(g), y = h.right + b, y + l > m && (w = !1)), { top: c, left: y, side: g, fits: w };
  }
  let t = null;
  for (let g = 0; g < e.length; g++) {
    const c = r(e[g]);
    if (c.fits) {
      t = c;
      break;
    }
  }
  t || (t = r(e[0]));
  let o = t.top, n = t.left;
  return l >= m ? n = 0 : (n < 0 && (n = 0), n + l > m && (n = m - l)), f >= _ ? o = 0 : (o < 0 && (o = 0), o + f > _ && (o = _ - f)), { top: o, left: n, placement: t.side };
}
function kt(h) {
  if (!h) return { width: 0, height: 0 };
  const d = h.style, E = d.visibility, v = d.display, b = d.position;
  d.visibility = "hidden", d.display = "block", d.position = "fixed";
  const m = h.offsetWidth, _ = h.offsetHeight;
  return d.visibility = E, d.display = v, d.position = b, { width: m, height: _ };
}
let st = null;
async function jt(h) {
  if (!h) {
    st = null;
    return;
  }
  try {
    const d = new TextEncoder(), E = await crypto.subtle.digest("SHA-256", d.encode(h));
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
function ht() {
  return st;
}
async function we(h, d = st) {
  const E = d || st;
  if (!E || h === void 0 || h === null) return h;
  try {
    const v = new TextEncoder(), b = crypto.getRandomValues(new Uint8Array(12)), m = typeof h == "string" ? h : JSON.stringify(h), _ = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: b },
      E,
      v.encode(m)
    ), l = btoa(String.fromCharCode(...b)), f = btoa(String.fromCharCode(...new Uint8Array(_)));
    return {
      encrypted: !0,
      iv: l,
      data: f
    };
  } catch (v) {
    return console.error("[ln-core/crypto] Encryption failed:", v), h;
  }
}
async function Ee(h, d = st) {
  const E = d || st;
  if (!h || !h.encrypted || !E) return h;
  try {
    const v = new TextDecoder(), b = Uint8Array.from(atob(h.iv), (f) => f.charCodeAt(0)), m = Uint8Array.from(atob(h.data), (f) => f.charCodeAt(0)), _ = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b },
      E,
      m
    ), l = v.decode(_);
    try {
      return JSON.parse(l);
    } catch {
      return l;
    }
  } catch (v) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", v), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), d = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
  function v(u) {
    return typeof u == "string" ? u : u instanceof URL ? u.href : u instanceof Request ? u.url : String(u);
  }
  function b(u, p) {
    return p && p.method ? String(p.method).toUpperCase() : u instanceof Request ? u.method.toUpperCase() : "GET";
  }
  function m(u, p) {
    return p + " " + u;
  }
  function _(u) {
    return u === "GET" || u === "HEAD";
  }
  function l(u, p) {
    p = p || {};
    const s = v(u), a = b(u, p), e = m(s, a);
    _(a) && d.has(e) && (d.get(e).abort(), d.delete(e));
    const i = new AbortController(), r = p.signal;
    let t = null;
    r && (r.aborted ? i.abort(r.reason) : (t = function() {
      i.abort(r.reason);
    }, r.addEventListener("abort", t, { once: !0 })));
    const o = Object.assign({}, p, { signal: i.signal });
    return d.set(e, i), h(u, o).finally(function() {
      r && t && r.removeEventListener("abort", t), d.get(e) === i && d.delete(e);
    });
  }
  l.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = l;
  function f(u) {
    if (!u.detail || !u.detail.url) return;
    const p = u.target, s = (u.detail.method || (u.detail.body ? "POST" : "GET")).toUpperCase(), a = u.detail.key;
    a && E.has(a) && (E.get(a).abort(), E.delete(a));
    const e = new AbortController(), i = u.detail.signal;
    let r = null;
    i && (i.aborted ? e.abort(i.reason) : (r = function() {
      e.abort(i.reason);
    }, i.addEventListener("abort", r, { once: !0 }))), a && E.set(a, e);
    const t = { method: s, signal: e.signal };
    u.detail.body !== void 0 && (t.body = u.detail.body), window.fetch(u.detail.url, t).then(function(o) {
      i && r && i.removeEventListener("abort", r), a && E.get(a) === e && E.delete(a), S(p, "ln-http:response", {
        ok: o.ok,
        status: o.status,
        response: o
      });
    }).catch(function(o) {
      i && r && i.removeEventListener("abort", r), a && E.get(a) === e && E.delete(a), !(o && o.name === "AbortError") && S(p, "ln-http:error", {
        ok: !1,
        status: 0,
        error: o
      });
    });
  }
  document.addEventListener("ln-http:request", f), window.lnHttp = {
    cancel: function(u) {
      let p = !1;
      return d.forEach(function(s, a) {
        a.endsWith(" " + u) && (s.abort(), d.delete(a), p = !0);
      }), p;
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
      return d.forEach(function(p, s) {
        const a = s.indexOf(" ");
        u.push({ method: s.slice(0, a), url: s.slice(a + 1) });
      }), E.forEach(function(p, s) {
        u.push({ key: s });
      }), u;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", f), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-form", d = "lnForm", E = "data-ln-form-action-edit", v = "data-ln-form-action-method";
  if (window[d] !== void 0) return;
  function b(m) {
    this.dom = m, this._baseAction = m.getAttribute("action") || "";
    const _ = this;
    return this._onLnFill = function(l) {
      l.target === _.dom && (l.detail ? (_.fill(l.detail), _._applyActionMode(l.detail)) : _.dom.reset());
    }, this._onReset = function() {
      _._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  b.prototype.fill = function(m) {
    const _ = $t(this.dom, m);
    for (let l = 0; l < _.length; l++) {
      const f = _[l], u = f.tagName === "SELECT" || f.type === "checkbox" || f.type === "radio";
      f.dispatchEvent(new Event(u ? "change" : "input", { bubbles: !0 }));
    }
  }, b.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, b.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute(E)) return;
    const _ = m && m.id != null && m.id !== "" ? m.id : null, l = this._ensureMethodInput();
    if (_ !== null) {
      const f = this.dom.getAttribute(E);
      f ? this.dom.setAttribute("action", f.replace(":id", encodeURIComponent(_))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(_)), l.value = this.dom.getAttribute(v) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), l.value = "";
  }, b.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[d]);
  }, U(h, d, b, "ln-form");
})();
(function() {
  const h = "data-ln-validate", d = "lnValidate", E = "data-ln-validate-errors", v = "data-ln-validate-error", b = "ln-validate-valid", m = "ln-validate-invalid", _ = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[d] !== void 0) return;
  function l(f) {
    this.dom = f, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const u = this, p = f.tagName, s = f.type, a = p === "SELECT" || s === "checkbox" || s === "radio";
    this._onInput = function() {
      u._touched = !0, u.validate();
    }, this._onChange = function() {
      u._touched = !0, u.validate();
    }, this._onSetCustom = function(i) {
      const r = i.detail && i.detail.error;
      if (!r) return;
      u._customErrors.add(r), u._touched = !0;
      const t = f.closest(".form-element");
      if (t) {
        const o = t.querySelector("[" + v + '="' + r + '"]');
        o && o.classList.remove("hidden");
      }
      f.classList.remove(b), f.classList.add(m), f.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const r = i.detail && i.detail.error, t = f.closest(".form-element");
      if (r) {
        if (u._customErrors.delete(r), t) {
          const o = t.querySelector("[" + v + '="' + r + '"]');
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
    }, a || f.addEventListener("input", this._onInput), f.addEventListener("change", this._onChange), f.addEventListener("ln-validate:set-custom", this._onSetCustom), f.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const e = f.form;
    return e && (e.hasAttribute("novalidate") || e.setAttribute("novalidate", ""), this._onFormReset = function() {
      u.reset();
    }, this._onValidateRequest = function(i) {
      u._touched = !0, !u.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(u.dom);
    }, e.addEventListener("reset", this._onFormReset), e.addEventListener("ln-validate:request-validate", this._onValidateRequest), e._lnValidateGateBound || (e._lnValidateGateBound = !0, e.addEventListener("submit", function(i) {
      const r = { invalidFields: [] };
      S(e, "ln-validate:request-validate", r), r.invalidFields.length > 0 && (i.preventDefault(), r.invalidFields.sort((t, o) => t.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), r.invalidFields[0].focus());
    }))), this;
  }
  l.prototype.validate = function() {
    const f = this.dom, u = f.validity, s = f.checkValidity() && this._customErrors.size === 0, a = f.closest(".form-element");
    if (a) {
      const i = a.querySelector("[" + E + "]");
      if (i) {
        const r = i.querySelectorAll("[" + v + "]");
        for (let t = 0; t < r.length; t++) {
          const o = r[t].getAttribute(v), n = _[o];
          n && (u[n] ? r[t].classList.remove("hidden") : r[t].classList.add("hidden"));
        }
      }
    }
    return f.classList.toggle(b, s), f.classList.toggle(m, !s), f.setAttribute("aria-invalid", s ? "false" : "true"), S(f, s ? "ln-validate:valid" : "ln-validate:invalid", { target: f, field: f.name }), s;
  }, l.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(b, m), this.dom.removeAttribute("aria-invalid");
    const f = this.dom.closest(".form-element");
    if (f) {
      const u = f.querySelectorAll("[" + v + "]");
      for (let p = 0; p < u.length; p++)
        u[p].classList.add("hidden");
    }
  }, Object.defineProperty(l.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), l.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const f = this.dom.form;
    f && (this._onFormReset && f.removeEventListener("reset", this._onFormReset), this._onValidateRequest && f.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(b, m), this.dom.removeAttribute("aria-invalid"), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[d];
  }, U(h, d, l, "ln-validate");
})();
(function() {
  const h = "data-ln-ajax", d = "lnAjax", E = "data-ln-form-scope";
  if (window[d] !== void 0) return;
  function v(s) {
    if (!s.hasAttribute(h) || s[d]) return;
    s[d] = !0;
    const a = f(s);
    b(a.links), m(a.forms);
  }
  function b(s) {
    for (const a of s) {
      if (a[d + "Trigger"] || a.hostname && a.hostname !== window.location.hostname) continue;
      const e = a.getAttribute("href");
      if (e && e.includes("#")) continue;
      const i = function(r) {
        if (!Xt(r, a)) return;
        r.preventDefault();
        const t = a.getAttribute("href");
        t && l("GET", t, null, a);
      };
      a.addEventListener("click", i), a[d + "Trigger"] = i;
    }
  }
  function m(s) {
    for (const a of s) {
      if (a[d + "Trigger"]) continue;
      if (a.hasAttribute(E)) {
        a[d + "ScopeWarned"] || (a[d + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const e = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const r = a.method.toUpperCase(), t = a.action, o = new FormData(a);
        for (const n of a.querySelectorAll('button, input[type="submit"]'))
          n.disabled = !0;
        l(r, t, o, a, function() {
          for (const n of a.querySelectorAll('button, input[type="submit"]'))
            n.disabled = !1;
        });
      };
      a.addEventListener("submit", e), a[d + "Trigger"] = e;
    }
  }
  function _(s) {
    if (!s[d]) return;
    const a = f(s);
    for (const e of a.links)
      e[d + "Trigger"] && (e.removeEventListener("click", e[d + "Trigger"]), delete e[d + "Trigger"]);
    for (const e of a.forms)
      e[d + "Trigger"] && (e.removeEventListener("submit", e[d + "Trigger"]), delete e[d + "Trigger"]);
    delete s[d];
  }
  function l(s, a, e, i, r) {
    if (G(i, "ln-ajax:before-start", { method: s, url: a }).defaultPrevented) return;
    S(i, "ln-ajax:start", { method: s, url: a }), i.classList.add("ln-ajax--loading");
    const o = document.createElement("span");
    o.className = "ln-ajax-spinner", i.appendChild(o);
    function n() {
      i.classList.remove("ln-ajax--loading");
      const A = i.querySelector(".ln-ajax-spinner");
      A && A.remove(), r && r();
    }
    let g = a;
    const c = document.querySelector('meta[name="csrf-token"]'), y = c ? c.getAttribute("content") : null;
    e instanceof FormData && y && e.append("_token", y);
    const w = {
      method: s,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (y && (w.headers["X-CSRF-TOKEN"] = y), s === "GET" && e) {
      const A = new URLSearchParams(e);
      g = a + (a.includes("?") ? "&" : "?") + A.toString();
    } else s !== "GET" && e && (w.body = e);
    fetch(g, w).then(function(A) {
      const L = A.ok;
      return A.json().then(function(C) {
        return { ok: L, status: A.status, data: C };
      });
    }).then(function(A) {
      const L = A.data;
      if (A.ok) {
        if (L.title && (document.title = L.title), L.content)
          for (const C in L.content) {
            const x = document.getElementById(C);
            x && (x.innerHTML = L.content[C]);
          }
        if (i.tagName === "A") {
          const C = i.getAttribute("href");
          C && window.history.pushState({ ajax: !0 }, "", C);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", g);
        S(i, "ln-ajax:success", { method: s, url: g, data: L });
      } else
        S(i, "ln-ajax:error", { method: s, url: g, status: A.status, data: L });
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
      S(i, "ln-ajax:complete", { method: s, url: g }), n();
    }).catch(function(A) {
      S(i, "ln-ajax:error", { method: s, url: g, error: A }), S(i, "ln-ajax:complete", { method: s, url: g }), n();
    });
  }
  function f(s) {
    const a = { links: [], forms: [] };
    return s.tagName === "A" && s.getAttribute(h) !== "false" ? a.links.push(s) : s.tagName === "FORM" && s.getAttribute(h) !== "false" ? a.forms.push(s) : (a.links = Array.from(s.querySelectorAll('a:not([data-ln-ajax="false"])')), a.forms = Array.from(s.querySelectorAll('form:not([data-ln-ajax="false"])'))), a;
  }
  function u() {
    tt(function() {
      new MutationObserver(function(a) {
        for (const e of a)
          if (e.type === "childList") {
            for (const i of e.addedNodes)
              if (i.nodeType === 1 && (v(i), !i.hasAttribute(h))) {
                for (const t of i.querySelectorAll("[" + h + "]"))
                  v(t);
                const r = i.closest && i.closest("[" + h + "]");
                if (r && r.getAttribute(h) !== "false") {
                  const t = f(i);
                  b(t.links), m(t.forms);
                }
              }
          } else e.type === "attributes" && v(e.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function p() {
    for (const s of document.querySelectorAll("[" + h + "]"))
      v(s);
  }
  window[d] = v, window[d].destroy = _, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
const oe = {
  navigate: function(h) {
    _t(h, { historyAction: "push" });
  },
  replace: function(h) {
    _t(h, { historyAction: "replace" });
  },
  current: function() {
    return qt ? {
      path: Dt,
      params: ae,
      query: le,
      route: qt,
      regions: se
    } : null;
  }
}, Bt = "data-ln-route", re = "lnRoute";
typeof window < "u" && (window.lnRouter = oe);
const it = /* @__PURE__ */ new Map(), zt = /* @__PURE__ */ new WeakMap();
let se = /* @__PURE__ */ new Map(), Kt = !1, Dt = null, ae = {}, le = {}, qt = null, It = !1;
function Vt(h, d, E) {
  It ? queueMicrotask(function() {
    S(h, d, E);
  }) : S(h, d, E);
}
function At(h) {
  try {
    const m = new URL(h, window.location.origin);
    h = m.pathname + m.search + m.hash;
  } catch {
  }
  let [d] = h.split("#"), [E, v] = d.split("?");
  const b = {};
  if (v) {
    const m = new URLSearchParams(v);
    for (const [_, l] of m.entries())
      b[_] = l;
  }
  return E = E.replace(/\/+$/, ""), E === "" && (E = "/"), { path: E, query: b };
}
function ce(h, d) {
  if (h.pattern === "*") return 1;
  if (d.pattern === "*") return -1;
  const E = h.segments, v = d.segments, b = Math.max(E.length, v.length);
  for (let m = 0; m < b; m++) {
    const _ = E[m], l = v[m];
    if (_ === void 0) return 1;
    if (l === void 0) return -1;
    if (_ === "*") return 1;
    if (l === "*") return -1;
    const f = _.startsWith(":"), u = l.startsWith(":");
    if (f && !u) return 1;
    if (!f && u) return -1;
  }
  return 0;
}
function de(h, d) {
  const E = h.split("/").filter(Boolean);
  for (const v of d) {
    if (v.pattern === "*")
      return {
        route: v,
        params: { wildcard: h }
      };
    const b = v.segments, m = {};
    let _ = !0;
    if (!(E.length > b.length && b[b.length - 1] !== "*")) {
      for (let l = 0; l < b.length; l++) {
        const f = b[l], u = E[l];
        if (f === "*") {
          m.wildcard = E.slice(l).join("/");
          break;
        }
        if (u === void 0) {
          _ = !1;
          break;
        }
        if (f.startsWith(":"))
          m[f.slice(1)] = decodeURIComponent(u);
        else if (f !== u) {
          _ = !1;
          break;
        }
      }
      if (_ && (b.indexOf("*") !== -1 || E.length <= b.length))
        return { route: v, params: m };
    }
  }
  return null;
}
function Ot(h, d) {
  if (h !== "__primary__") {
    const v = document.getElementById(d.target);
    return v || console.warn(`[ln-router] Explicit target element #${d.target} not found in DOM`), v;
  }
  const E = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return E || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), E;
}
function Ae(h) {
  if (!h) return;
  const d = Array.from(h.querySelectorAll("*")), E = [h].concat(d);
  for (const b of E)
    for (const m of Object.keys(b))
      if (m.startsWith("ln") && b[m] && typeof b[m].destroy == "function")
        try {
          b[m].destroy();
        } catch (_) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, b, _);
        }
  const v = document.querySelectorAll('[data-ln-popover="open"]');
  for (const b of v) {
    const m = b.lnPopover;
    if (m && m.trigger && h.contains(m.trigger))
      try {
        m.destroy();
      } catch (_) {
        console.error("[ln-router] Error destroying open popover:", _);
      }
  }
}
function _t(h, d = {}) {
  const { path: E, query: v } = At(h), b = /* @__PURE__ */ new Map();
  for (const [p, s] of it)
    b.set(p, de(E, s.sorted));
  const m = it.has("__primary__"), _ = b.get("__primary__");
  if (m && !_) {
    Vt(document.body, "ln-router:not-found", { path: E });
    return;
  }
  let l = null;
  if (_ && (l = Ot("__primary__", _.route), !l || G(l, "ln-router:before-navigate", {
    from: Dt,
    to: h,
    params: _.params,
    query: v
  }).defaultPrevented))
    return;
  const f = [];
  for (const [p, s] of b) {
    if (!s) continue;
    const a = Ot(p, s.route);
    a && (p !== "__primary__" && a.hasAttribute("data-ln-route-keep") && zt.get(a) === s.route.templateNode || f.push({ regionKey: p, match: s, targetEl: a }));
  }
  d.historyAction === "push" ? window.history.pushState(null, "", h) : d.historyAction === "replace" && window.history.replaceState(null, "", h);
  const u = function() {
    for (const { regionKey: p, match: s, targetEl: a } of f) {
      if (!(d.isHydration && a.hasAttribute("data-ln-router-hydrate") && a.children.length > 0)) {
        Ae(a);
        const i = s.route.templateNode.content.cloneNode(!0);
        a.replaceChildren(i);
      }
      if (zt.set(a, s.route.templateNode), p === "__primary__" && (s.route.title && (document.title = s.route.title), !d.isHydration)) {
        a.hasAttribute("tabindex") || a.setAttribute("tabindex", "-1");
        const i = a.querySelector("h1, h2, h3, h4, h5, h6");
        i ? (i.setAttribute("tabindex", "-1"), i.focus()) : a.focus(), a.scrollIntoView({ block: "start", behavior: "instant" });
      }
      Vt(a, "ln-router:navigated", {
        path: h,
        params: s.params,
        query: v,
        route: s.route,
        target: a,
        region: p
      });
    }
    _ && (Dt = h, ae = _.params, le = v, qt = _.route), se = new Map(
      Array.from(b.entries()).map(([p, s]) => [p, s ? { route: s.route, params: s.params } : null])
    );
  };
  document.startViewTransition && !d.isHydration ? document.startViewTransition(u) : u();
}
function Se(h) {
  const d = h.target.closest("a");
  if (!d || !Xt(h, d)) return;
  const E = d.getAttribute("href"), { path: v } = At(E), b = it.get("__primary__");
  if (!b) return;
  de(v, b.sorted) && (h.preventDefault(), _t(E, { historyAction: "push" }));
}
function Ce(h, d) {
  const E = Object.keys(h), v = Object.keys(d);
  if (E.length !== v.length) return !1;
  for (let b = 0; b < E.length; b++) {
    const m = E[b];
    if (h[m] !== d[m]) return !1;
  }
  return !0;
}
function Le() {
  const h = window.location.pathname + window.location.search, d = oe.current();
  if (d && d.path != null) {
    const E = At(h);
    if (At(d.path).path === E.path && Ce(d.query, E.query))
      return;
  }
  _t(h, { historyAction: "skip" });
}
function Te() {
  Kt || (Kt = !0, tt(function() {
    document.addEventListener("click", Se), window.addEventListener("popstate", Le), It = !0;
    const h = window.location.pathname + window.location.search + window.location.hash;
    _t(h, { historyAction: "replace", isHydration: !0 }), It = !1;
  }, "ln-router"));
}
function xe(h) {
  const d = h.getAttribute(Bt);
  if (!d) return;
  const E = h.getAttribute("data-ln-route-target") || null;
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
  const m = h.getAttribute("data-ln-route-title"), _ = d.split("/").filter(Boolean), l = {
    pattern: d,
    segments: _,
    target: E,
    title: m,
    templateNode: h
  }, f = Ot(v, l);
  f && f.contains(h) && console.warn(`[ln-router] Route template with pattern "${d}" is declared inside its own outlet element:`, h), b.routes.set(d, l), b.sorted = Array.from(b.routes.values()).sort(ce);
}
function ke(h) {
  const d = h.getAttribute(Bt);
  if (!d) return;
  const v = h.getAttribute("data-ln-route-target") || null || "__primary__", b = it.get(v);
  b && (b.routes.delete(d), b.sorted = Array.from(b.routes.values()).sort(ce), b.routes.size === 0 && it.delete(v));
}
function ue(h) {
  return this.dom = h, xe(h), this;
}
ue.prototype.destroy = function() {
  ke(this.dom), delete this.dom[re];
};
U(Bt, re, ue, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    it.size > 0 && Te();
  }
});
(function() {
  const h = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0) return;
  function E(b) {
    this.dom = b, this.isOpen = b.getAttribute(h) === "open";
    const m = this;
    if (this._hashNs = b.id || null, this._onHashChange = function() {
      if (!m._hashNs) return;
      const _ = lt(m._hashNs) !== null;
      _ && !m.isOpen ? m.dom.setAttribute(h, "open") : !_ && m.isOpen && m.dom.setAttribute(h, "close");
    }, this._onCancel = function(_) {
      _.preventDefault(), m.dom.setAttribute(h, "close");
    }, this._onFormSuccess = function() {
      m.isOpen && m.dom.setAttribute(h, "close");
    }, this._onSubmit = function(_) {
      if (!_.defaultPrevented && m._hashNs)
        try {
          sessionStorage.setItem("ln-modal-pending:" + m._hashNs, "true");
        } catch {
        }
    }, this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("ln-form:success", this._onFormSuccess), this.dom.addEventListener("ln-ajax:success", this._onFormSuccess), this.dom.addEventListener("submit", this._onSubmit), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this._hashNs) {
      window.addEventListener("hashchange", this._onHashChange);
      const _ = "ln-modal-pending:" + this._hashNs;
      let l = !1;
      try {
        l = sessionStorage.getItem(_) === "true";
      } catch {
      }
      if (l) {
        try {
          sessionStorage.removeItem(_);
        } catch {
        }
        !!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || m.dom.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger")) ? m.isOpen || m.dom.setAttribute(h, "open") : (at(m._hashNs, null), m.isOpen && m.dom.setAttribute(h, "close"));
      } else lt(this._hashNs) !== null && !this.isOpen && this.dom.setAttribute(h, "open");
    }
    return this;
  }
  E.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("ln-form:success", this._onFormSuccess), this.dom.removeEventListener("ln-ajax:success", this._onFormSuccess), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("cancel", this._onCancel), this.isOpen) {
        const b = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + h + '="open"]'),
          function(_) {
            return _ !== b;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      this._hashNs && window.removeEventListener("hashchange", this._onHashChange), S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[d];
    }
  };
  function v(b) {
    const m = b[d];
    if (!m) return;
    const l = b.getAttribute(h) === "open";
    if (l !== m.isOpen)
      if (l) {
        if (G(b, "ln-modal:before-open", { modalId: b.id, target: b }).defaultPrevented) {
          m._hashNs && at(m._hashNs, null), b.setAttribute(h, "close");
          return;
        }
        m.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof b.showModal == "function" && b.showModal();
        const u = b.querySelector("[autofocus]");
        if (u && vt(u))
          u.focus();
        else {
          const p = b.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), s = Array.prototype.find.call(p, vt);
          if (s) s.focus();
          else {
            const a = b.querySelectorAll("a[href], button:not([disabled])"), e = Array.prototype.find.call(a, vt);
            e && e.focus();
          }
        }
        if (m._hashNs) {
          lt(m._hashNs) === null && at(m._hashNs, "");
          const p = lt(m._hashNs), s = p || null;
          b.dataset.lnModalMode = s ? "edit" : "new", S(b, "ln-modal:open", { modalId: b.id, target: b, hashNs: m._hashNs, param: s });
        } else
          S(b, "ln-modal:open", { modalId: b.id, target: b });
      } else {
        if (G(b, "ln-modal:before-close", { modalId: b.id, target: b }).defaultPrevented) {
          b.setAttribute(h, "open");
          return;
        }
        m.isOpen = !1, S(b, "ln-modal:close", { modalId: b.id, target: b }), m._hashNs && at(m._hashNs, null), typeof b.close == "function" && b.close(), document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  document.addEventListener("click", function(b) {
    if (b.ctrlKey || b.metaKey || b.button === 1) return;
    const m = b.target.closest("[data-ln-modal-for]");
    if (m) {
      const f = m.getAttribute("data-ln-modal-for"), u = document.getElementById(f);
      if (u && u[d]) {
        b.preventDefault();
        const p = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, s = {}, a = m.dataset;
        for (const r in a) {
          if (!r.startsWith("lnModal") || p[r]) continue;
          const t = r.slice(7);
          t && (s[t.charAt(0).toLowerCase() + t.slice(1)] = a[r]);
        }
        const e = Object.keys(s).length > 0;
        if (e)
          window.lnCore.fill(u, s);
        else {
          const r = u.querySelectorAll("[data-ln-field]");
          for (let t = 0; t < r.length; t++)
            r[t].textContent = "";
        }
        m.hasAttribute("data-ln-modal-mode") ? u.dataset.lnModalMode = m.getAttribute("data-ln-modal-mode") : u.dataset.lnModalMode = e ? "edit" : "new";
        const i = u.getAttribute(h);
        u.setAttribute(h, i === "open" ? "close" : "open");
      }
      return;
    }
    const _ = b.target.closest('a[href^="#"]');
    if (_) {
      const f = Ct(_.getAttribute("href"));
      for (const u in f) {
        const p = document.getElementById(u);
        if (p && p[d]) {
          if (!Ft(b)) return;
          at(u, f[u]);
          return;
        }
      }
    }
    const l = b.target.closest("[data-ln-modal-close]");
    if (l) {
      const f = l.closest("[" + h + "]");
      f && f[d] && (b.preventDefault(), f.setAttribute(h, "close"));
    }
  }), U(h, d, E, "ln-modal", {
    onAttributeChange: v
  });
})();
(function() {
  const h = "data-ln-number", d = "lnNumber";
  if (window[d] !== void 0) return;
  const E = {}, v = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function b(u) {
    if (!E[u]) {
      const p = new Intl.NumberFormat(u, { useGrouping: !0 }), s = p.formatToParts(1234.5);
      let a = "", e = ".";
      for (let i = 0; i < s.length; i++)
        s[i].type === "group" && (a = s[i].value), s[i].type === "decimal" && (e = s[i].value);
      E[u] = { fmt: p, groupSep: a, decimalSep: e };
    }
    return E[u];
  }
  function m(u, p, s) {
    if (s !== null) {
      const a = parseInt(s, 10), e = u + "|d" + a;
      return E[e] || (E[e] = new Intl.NumberFormat(u, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: a })), E[e].format(p);
    }
    return b(u).fmt.format(p);
  }
  function _(u) {
    if (u[d]) return u[d];
    if (u[d] = this, this.dom = u, u.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const p = document.createElement("input");
    p.type = "hidden", p.name = u.name, u.removeAttribute("name"), u.hasAttribute("data-ln-fill-as") && p.setAttribute("data-ln-fill-as", u.getAttribute("data-ln-fill-as")), u.type = "text", u.setAttribute("inputmode", "decimal"), u.insertAdjacentElement("afterend", p), this._hidden = p;
    const s = this;
    Object.defineProperty(p, "value", {
      get: function() {
        return v.get.call(p);
      },
      set: function(e) {
        v.set.call(p, e), e !== "" && !isNaN(parseFloat(e)) ? s._setDisplayRaw(m(V(s.dom), parseFloat(e), s.dom.getAttribute("data-ln-number-decimals"))) : s._setDisplayRaw(""), s.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Yt(u, v, {
      get: function() {
        return v.get.call(u);
      },
      set: function(e) {
        if (e === "") {
          s._setDisplayRaw(""), s._setHiddenRaw(""), u.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const i = typeof e == "number" ? e : parseFloat(String(e).replace(/[^\d.-]/g, ""));
        isNaN(i) ? (s._setDisplayRaw(String(e)), s._setHiddenRaw("")) : (s._setHiddenRaw(i), s._setDisplayRaw(m(V(u), i, u.getAttribute("data-ln-number-decimals")))), u.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      s._handleInput();
    }, u.addEventListener("input", this._onInput), this._onPaste = function(e) {
      e.preventDefault();
      const i = (e.clipboardData || window.clipboardData).getData("text"), r = b(V(u)), t = r.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let o = i.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      r.groupSep && (o = o.split(r.groupSep).join("")), r.decimalSep !== "." && (o = o.replace(r.decimalSep, "."));
      const n = parseFloat(o);
      s.value = isNaN(n) ? NaN : n;
    }, u.addEventListener("paste", this._onPaste);
    const a = u.value;
    if (a !== "") {
      const e = parseFloat(a);
      isNaN(e) || (this._setHiddenRaw(e), this._setDisplayRaw(m(V(u), e, u.getAttribute("data-ln-number-decimals"))), u.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function l(u) {
    if (typeof u == "number") return isNaN(u) ? null : u;
    if (!u || typeof u != "string") return null;
    let p = u.trim();
    if (p === "") return null;
    p = p.replace(/[\s\u00A0$€£]/g, ""), p.indexOf(",") !== -1 && p.indexOf(".") !== -1 ? p.indexOf(".") < p.indexOf(",") ? p = p.replace(/\./g, "").replace(",", ".") : p = p.replace(/,/g, "") : p.indexOf(",") !== -1 && (p = p.replace(",", ".")), p = p.replace(/[^\d.-]/g, "");
    const s = parseFloat(p);
    return isNaN(s) ? null : s;
  }
  _.prototype._initTextElement = function() {
    const u = this.dom;
    let p = u.getAttribute("data-ln-value"), s = u.getAttribute("data-ln-number"), a = null;
    p !== null && p !== "" ? a = p : s !== null && s !== "" && s !== "true" ? a = s : a = u.textContent.trim();
    const e = l(a);
    e !== null ? (this._rawValue = e, u.hasAttribute("data-ln-value") || u.setAttribute("data-ln-value", String(e)), this._formatTextContent()) : this._rawValue = null;
  }, _.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const u = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = m(V(this.dom), this._rawValue, u);
    }
  }, _.prototype._handleInput = function() {
    const u = this.dom, p = b(V(u)), s = v.get.call(u);
    if (s === "") {
      this._setHiddenRaw(""), S(u, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (s === "-") {
      this._setHiddenRaw("");
      return;
    }
    const a = u.selectionStart;
    let e = 0;
    for (let A = 0; A < a; A++)
      /[0-9]/.test(s[A]) && e++;
    let i = s;
    if (p.groupSep && (i = i.split(p.groupSep).join("")), i = i.replace(p.decimalSep, "."), s.endsWith(p.decimalSep) || s.endsWith(".")) {
      const A = i.replace(/\.$/, ""), L = parseFloat(A);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const r = i.indexOf(".");
    if (r !== -1 && i.slice(r + 1).endsWith("0")) {
      const L = parseFloat(i);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const t = u.getAttribute("data-ln-number-decimals");
    if (t !== null && r !== -1) {
      const A = parseInt(t, 10);
      i.slice(r + 1).length > A && (i = i.slice(0, r + 1 + A));
    }
    const o = parseFloat(i);
    if (isNaN(o)) return;
    const n = u.getAttribute("data-ln-number-min"), g = u.getAttribute("data-ln-number-max");
    if (n !== null && o < parseFloat(n) || g !== null && o > parseFloat(g)) return;
    let c;
    if (t !== null)
      c = m(V(u), o, t);
    else {
      const A = r !== -1 ? i.slice(r + 1).length : 0;
      if (A > 0) {
        const L = V(u) + "|u" + A;
        E[L] || (E[L] = new Intl.NumberFormat(V(u), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), c = E[L].format(o);
      } else
        c = p.fmt.format(o);
    }
    this._setDisplayRaw(c);
    let y = e, w = 0;
    for (let A = 0; A < c.length && y > 0; A++)
      w = A + 1, /[0-9]/.test(c[A]) && y--;
    y > 0 && (w = c.length), u.setSelectionRange(w, w), this._setHiddenRaw(o), S(u, "ln-number:input", { value: o, formatted: c });
  }, _.prototype._setHiddenRaw = function(u) {
    this._hidden && v.set.call(this._hidden, String(u));
  }, _.prototype._setDisplayRaw = function(u) {
    this.isTextElement ? this.dom.textContent = String(u) : v.set.call(this.dom, String(u));
  }, _.prototype._displayFormatted = function(u) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(m(V(this.dom), u, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(_.prototype, "value", {
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
      this._setHiddenRaw(u), this._setDisplayRaw(m(V(this.dom), u, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(_.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : v.get.call(this.dom);
    }
  }), _.prototype.destroy = function() {
    this.dom[d] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function f() {
    new MutationObserver(function() {
      const u = document.querySelectorAll("[" + h + "]");
      for (let p = 0; p < u.length; p++) {
        const s = u[p][d];
        s && (s.isTextElement ? s._formatTextContent() : isNaN(s.value) || s._displayFormatted(s.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(h, d, _, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(u) {
      const p = u[d];
      p && (p.isTextElement ? p._initTextElement() : isNaN(p.value) || p._displayFormatted(p.value));
    }
  }), f();
})();
(function() {
  const h = "data-ln-date", d = "lnDate";
  if (window[d] !== void 0) return;
  const E = {}, v = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function b(n, g) {
    const c = n + "|" + JSON.stringify(g);
    return E[c] || (E[c] = new Intl.DateTimeFormat(n, g)), E[c];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, _ = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function l(n) {
    return !n || n === "" ? { dateStyle: "medium" } : n.match(m) ? _[n] : null;
  }
  function f(n, g, c) {
    const y = n.getDate(), w = n.getMonth(), A = n.getFullYear(), L = n.getHours(), C = n.getMinutes();
    let x, D;
    const q = mt(c), N = (c || "").toLowerCase().split("-")[0], B = b(c, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], j = q && B !== N;
    j && q.monthsLong ? x = q.monthsLong[w] : x = b(c, { month: "long" }).format(n), j && q.monthsShort ? D = q.monthsShort[w] : D = b(c, { month: "short" }).format(n);
    const ot = {
      yyyy: String(A),
      yy: String(A).slice(-2),
      MMMM: x,
      MMM: D,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(y).padStart(2, "0"),
      d: String(y),
      HH: String(L).padStart(2, "0"),
      mm: String(C).padStart(2, "0")
    };
    return g.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(Z) {
      return ot[Z];
    });
  }
  function u(n, g, c) {
    const y = l(g);
    if (y) {
      const w = b(c, y), A = (c || "").toLowerCase().split("-")[0], L = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return mt(c) && L !== A ? f(n, "dd.MM.yyyy", c) : w.format(n);
    }
    return f(n, g, c);
  }
  function p(n) {
    if (!n) return "";
    const g = n.getFullYear(), c = String(n.getMonth() + 1).padStart(2, "0"), y = String(n.getDate()).padStart(2, "0");
    return g + "-" + c + "-" + y;
  }
  function s(n, g, c) {
    S(n.dom, "ln-date:change", {
      value: g,
      formatted: n.dom.value,
      date: c
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function a(n, g, c, y) {
    n._setHiddenRaw(g), v.set.call(n._picker, g), n._lastISO = g, y !== void 0 ? (n._isFormatting = !0, n.dom.value = y, n._isFormatting = !1) : c && n._displayFormatted(c), s(n, g, c);
  }
  function e(n) {
    n._setHiddenRaw(""), v.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", s(n, "", null);
  }
  i.prototype._initTextElement = function() {
    const n = this.dom;
    let g = n.getAttribute("data-ln-value"), c = n.getAttribute("data-ln-date"), y = n.getAttribute("datetime"), w = null;
    g !== null && g !== "" ? w = g : y !== null && y !== "" ? w = y : c !== null && c !== "" && c !== "true" && !m.test(c) ? w = c : w = n.textContent.trim();
    let A = r(w) || t(w);
    if (!A && w)
      if (isNaN(w))
        A = new Date(w);
      else {
        const L = Number(w);
        A = new Date(L > 1e11 ? L : L * 1e3);
      }
    if (A && !isNaN(A.getTime())) {
      const L = p(A);
      this._rawValue = L, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", L), this._formatTextContent();
    } else
      this._rawValue = null;
  }, i.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = r(this._rawValue);
      if (n) {
        let c = this.dom.getAttribute("data-ln-date-format");
        if (!c) {
          const w = this.dom.getAttribute("data-ln-date");
          w && m.test(w) && (c = w);
        }
        const y = V(this.dom);
        this.dom.textContent = u(n, c || "medium", y);
      }
    }
  };
  function i(n) {
    if (n[d]) return n[d];
    if (n[d] = this, this.dom = n, n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const g = this, c = n.value, y = n.name, A = (n.closest(".form-element, form") || n.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let q = 0; q < A.length; q++) {
      const N = A[q].getAttribute("data-ln-date-dict");
      if (N) {
        const O = Rt(A[q], "data-ln-date-dict-key");
        O["months-long"] && (O.monthsLong = O["months-long"].split(",").map((B) => B.trim())), O["months-short"] && (O.monthsShort = O["months-short"].split(",").map((B) => B.trim())), Nt(N, O);
      }
    }
    const L = document.createElement("span");
    L.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(L, n), L.appendChild(n), this._wrapper = L;
    const C = document.createElement("input");
    C.type = "hidden", C.name = y, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && C.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", C), this._hidden = C;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", C.insertAdjacentElement("afterend", x), this._picker = x, n.type = "text";
    const D = document.createElement("button");
    if (D.type = "button", D.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), D.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', x.insertAdjacentElement("afterend", D), this._btn = D, this._lastISO = "", Object.defineProperty(C, "value", {
      get: function() {
        return v.get.call(C);
      },
      set: function(q) {
        if (v.set.call(C, q), q && q !== "") {
          const N = r(q);
          N && a(g, q, N);
        } else q === "" && e(g);
      }
    }), Yt(n, v, {
      get: function() {
        return v.get.call(n);
      },
      set: function(q, N) {
        if (g._isFormatting) {
          N(q);
          return;
        }
        if (!q || q === "") {
          N(""), e(g);
          return;
        }
        const O = r(q) || t(q);
        if (O) {
          const B = p(O), j = n.getAttribute(h) || "", ot = V(n), Z = u(O, j, ot);
          N(Z), a(g, B, O, Z);
        } else
          N(String(q)), e(g);
      }
    }), this._onPickerChange = function() {
      const q = x.value;
      if (q) {
        const N = r(q);
        N && a(g, q, N);
      } else
        e(g);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const q = g.dom.value.trim();
      if (q === "") {
        g._lastISO !== "" && e(g);
        return;
      }
      if (g._lastISO) {
        const O = r(g._lastISO);
        if (O) {
          const B = g.dom.getAttribute(h) || "", j = V(g.dom);
          if (q === u(O, B, j)) return;
        }
      }
      const N = t(q);
      if (N) {
        const O = p(N);
        a(g, O, N);
      } else if (g._lastISO) {
        const O = r(g._lastISO);
        O && g._displayFormatted(O);
      } else
        g.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      g._openPicker();
    }, D.addEventListener("click", this._onBtnClick), c && c !== "") {
      const q = r(c);
      q && a(g, c, q);
    }
    return this;
  }
  function r(n) {
    if (!n || typeof n != "string") return null;
    const g = n.split("T"), c = g[0].split("-");
    if (c.length < 3) return null;
    const y = parseInt(c[0], 10), w = parseInt(c[1], 10) - 1, A = parseInt(c[2], 10);
    if (isNaN(y) || isNaN(w) || isNaN(A)) return null;
    let L = 0, C = 0;
    if (g[1]) {
      const D = g[1].split(":");
      L = parseInt(D[0], 10) || 0, C = parseInt(D[1], 10) || 0;
    }
    const x = new Date(y, w, A, L, C);
    return x.getFullYear() !== y || x.getMonth() !== w || x.getDate() !== A ? null : x;
  }
  function t(n) {
    if (!n || typeof n != "string" || (n = n.trim(), n.length < 6)) return null;
    let g, c;
    if (n.indexOf(".") !== -1)
      g = ".", c = n.split(".");
    else if (n.indexOf("/") !== -1)
      g = "/", c = n.split("/");
    else if (n.indexOf("-") !== -1)
      g = "-", c = n.split("-");
    else
      return null;
    if (c.length !== 3) return null;
    const y = [];
    for (let x = 0; x < 3; x++) {
      const D = parseInt(c[x], 10);
      if (isNaN(D)) return null;
      y.push(D);
    }
    let w, A, L;
    g === "." ? (w = y[0], A = y[1], L = y[2]) : g === "/" ? (A = y[0], w = y[1], L = y[2]) : c[0].length === 4 ? (L = y[0], A = y[1], w = y[2]) : (w = y[0], A = y[1], L = y[2]), L < 100 && (L += L < 50 ? 2e3 : 1900);
    const C = new Date(L, A - 1, w);
    return C.getFullYear() !== L || C.getMonth() !== A - 1 || C.getDate() !== w ? null : C;
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
    v.set.call(this._hidden, n);
  }, i.prototype._displayFormatted = function(n) {
    const g = this.dom.getAttribute(h) || "", c = V(this.dom);
    this._isFormatting = !0, this.dom.value = u(n, g, c), this._isFormatting = !1;
  }, Object.defineProperty(i.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : v.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const c = r(n) || t(n);
        if (!c) return;
        const y = p(c);
        this._rawValue = y, this.dom.setAttribute("data-ln-value", y), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        e(this);
        return;
      }
      const g = r(n);
      g && a(this, n, g);
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
      this.value = p(n);
    }
  }), Object.defineProperty(i.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), i.prototype.destroy = function() {
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
      const n = document.querySelectorAll("[" + h + "]");
      for (let g = 0; g < n.length; g++) {
        const c = n[g][d];
        if (c) {
          if (c.isTextElement)
            c._formatTextContent();
          else if (c.value) {
            const y = r(c.value);
            y && c._displayFormatted(y);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(h, d, i, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "lang"],
    onAttributeChange: function(n) {
      const g = n[d];
      if (g) {
        if (g.isTextElement)
          g._initTextElement();
        else if (g.value) {
          const c = r(g.value);
          c && g._displayFormatted(c);
        }
      }
    }
  }), o();
})();
(function() {
  const h = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0) return;
  const E = [];
  if (!history._lnNavPatched) {
    const _ = history.pushState;
    history.pushState = function() {
      _.apply(history, arguments);
      for (const l of E)
        l();
    }, history._lnNavPatched = !0;
  }
  function v(_) {
    return this.dom = _, this.activeClass = _.getAttribute(h) || "active", this.exact = _.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), E.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(_, { childList: !0, subtree: !0 }), this.update(), this;
  }
  v.prototype.update = function() {
    if (!this.activeClass || G(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const l = Array.from(this.dom.querySelectorAll("a")), f = window.location.pathname, u = b(f);
    for (const p of l) {
      const s = p.getAttribute("href");
      if (!s || s === "#" || s.startsWith("#") || s.startsWith("javascript:") || s.startsWith("mailto:") || s.startsWith("tel:")) {
        p.classList.remove(this.activeClass), p.removeAttribute("aria-current");
        continue;
      }
      if (p.hostname && p.hostname !== window.location.hostname) {
        p.classList.remove(this.activeClass), p.removeAttribute("aria-current");
        continue;
      }
      const a = b(s), e = a === u, i = !this.exact && a !== "/" && u.startsWith(a + "/");
      e || i ? (p.classList.add(this.activeClass), p.setAttribute("aria-current", "page")) : (p.classList.remove(this.activeClass), p.removeAttribute("aria-current"));
    }
    S(this.dom, "ln-nav:update", { target: this.dom });
  }, v.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const _ = E.indexOf(this.updateHandler);
    _ !== -1 && E.splice(_, 1), S(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function b(_) {
    try {
      return new URL(_, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return _.replace(/\/$/, "") || "/";
    }
  }
  function m(_, l) {
    const f = _[d];
    if (f) {
      if (l === h) {
        if (!_.hasAttribute(h)) {
          f.destroy();
          return;
        }
        const u = f.activeClass, p = _.getAttribute(h) || "active";
        if (u !== p) {
          const s = _.querySelectorAll("a");
          for (const a of s)
            u && a.classList.remove(u);
          f.activeClass = p;
        }
      } else l === "data-ln-nav-exact" && (f.exact = _.hasAttribute("data-ln-nav-exact"));
      f.update();
    }
  }
  U(h, d, v, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: m
  });
})();
(function() {
  const h = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function E(m, _) {
    const l = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (l) return l;
    if (m.tagName !== "A") return "";
    const f = m.getAttribute("href") || "";
    if (!f.startsWith("#")) return "";
    const u = f.slice(1);
    if (!u) return "";
    const p = u.split("&");
    if (_)
      for (const e of p) {
        const i = e.indexOf(":");
        if (i > 0 && e.slice(0, i).toLowerCase().trim() === _)
          return e.slice(i + 1).toLowerCase().trim();
      }
    const s = p[p.length - 1] || "", a = s.indexOf(":");
    return (a > 0 ? s.slice(a + 1) : s).toLowerCase().trim();
  }
  function v(m) {
    return this.dom = m, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((f) => f.tagName === "A" && (f.getAttribute("href") || "").startsWith("#")), _ = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = _ && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : _ && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const f of this.tabs) {
      const u = E(f, this.nsKey);
      u ? this.mapTabs[u] = f : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', f);
    }
    for (const f of this.panels) {
      const u = (f.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      u && (this.mapPanels[u] = f);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const l = this;
    this._clickHandlers = [];
    for (const f of this.tabs) {
      if (f[d + "Trigger"]) continue;
      const u = function(p) {
        const s = f.tagName === "A";
        if (!s && (p.ctrlKey || p.metaKey || p.button === 1)) return;
        const a = E(f, l.nsKey);
        a && (s && !Ft(p) || (l.hashEnabled ? lt(l.nsKey) === a ? l.dom.setAttribute("data-ln-tabs-active", a) : at(l.nsKey, a) : l.dom.setAttribute("data-ln-tabs-active", a)));
      };
      f.addEventListener("click", u), f[d + "Trigger"] = u, l._clickHandlers.push({ el: f, handler: u });
    }
    if (this._hashHandler = function() {
      if (!l.hashEnabled) return;
      const f = lt(l.nsKey);
      l.dom.setAttribute("data-ln-tabs-active", f !== null ? f : l.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let f = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const u = St("tabs", this.dom);
        u !== null && u in this.mapPanels && (f = u);
      }
      this.dom.setAttribute("data-ln-tabs-active", f);
    }
  }
  v.prototype._applyActive = function(m) {
    var _;
    (!m || !(m in this.mapPanels)) && (m = this.defaultKey);
    for (const l in this.mapTabs) {
      const f = this.mapTabs[l];
      l === m ? (f.setAttribute("data-active", ""), f.setAttribute("aria-selected", "true")) : (f.removeAttribute("data-active"), f.setAttribute("aria-selected", "false"));
    }
    for (const l in this.mapPanels) {
      const f = this.mapPanels[l], u = l === m;
      f.classList.toggle("hidden", !u), f.setAttribute("aria-hidden", u ? "false" : "true");
    }
    if (this.autoFocus) {
      const l = (_ = this.mapPanels[m]) == null ? void 0 : _.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      l && setTimeout(() => l.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: m, tab: this.mapTabs[m], panel: this.mapPanels[m] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && dt("tabs", this.dom, m);
  }, v.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const { el: m, handler: _ } of this._clickHandlers)
        m.removeEventListener("click", _), delete m[d + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[d];
    }
  }, U(h, d, v, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const _ = m.getAttribute("data-ln-tabs-active");
      m[d]._applyActive(_);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
  function E(m, _) {
    const l = document.querySelectorAll(
      '[data-ln-toggle-for="' + m.id + '"]'
    );
    for (const f of l)
      f.setAttribute("aria-expanded", _ ? "true" : "false");
  }
  function v(m) {
    if (this.dom = m, m.hasAttribute("data-ln-persist")) {
      const _ = St("toggle", m);
      _ !== null && m.setAttribute(h, _);
    }
    return this.isOpen = m.getAttribute(h) === "open", this.isOpen && m.classList.add("open"), E(m, this.isOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[d] && (S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function b(m) {
    const _ = m[d];
    if (!_) return;
    const f = m.getAttribute(h) === "open";
    if (f !== _.isOpen)
      if (f) {
        if (G(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(h, "close");
          return;
        }
        _.isOpen = !0, m.classList.add("open"), E(m, !0), S(m, "ln-toggle:open", { target: m }), m.hasAttribute("data-ln-persist") && dt("toggle", m, "open");
      } else {
        if (G(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(h, "open");
          return;
        }
        _.isOpen = !1, m.classList.remove("open"), E(m, !1), S(m, "ln-toggle:close", { target: m }), m.hasAttribute("data-ln-persist") && dt("toggle", m, "close");
      }
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const _ = m.target.closest("[data-ln-toggle-for]");
    if (_) {
      const l = _.getAttribute("data-ln-toggle-for"), f = document.getElementById(l);
      if (f && f[d]) {
        m.preventDefault();
        const u = _.getAttribute("data-ln-toggle-action") || "toggle";
        if (u === "open")
          f.setAttribute(h, "open");
        else if (u === "close")
          f.setAttribute(h, "close");
        else if (u === "toggle") {
          const p = f.getAttribute(h);
          f.setAttribute(h, p === "open" ? "close" : "open");
        }
      }
    }
  }), U(h, d, v, "ln-toggle", {
    onAttributeChange: b
  });
})();
(function() {
  const h = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
  function E(v) {
    return this.dom = v, this._onToggleOpen = function(b) {
      if (b.detail.target.closest("[data-ln-accordion]") !== v) return;
      const m = v.querySelectorAll("[data-ln-toggle]");
      for (const _ of m)
        _ !== b.detail.target && _.closest("[data-ln-accordion]") === v && _.getAttribute("data-ln-toggle") === "open" && _.setAttribute("data-ln-toggle", "close");
      S(v, "ln-accordion:change", { target: b.detail.target });
    }, v.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[d]);
  }, U(h, d, E, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", d = "lnDropdown";
  if (window[d] !== void 0) return;
  function E(v) {
    if (this.dom = v, this.toggleEl = v.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = v.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const m of this.toggleEl.children)
        m.setAttribute("role", "menuitem");
    const b = this;
    return this._onToggleOpen = function(m) {
      !m.detail || m.detail.target !== b.toggleEl || (b.triggerBtn && b.triggerBtn.setAttribute("aria-expanded", "true"), typeof b.toggleEl.showPopover == "function" && b.toggleEl.showPopover(), b._reposition(), b._addOutsideClickListener(), b._addScrollRepositionListener(), b._addResizeCloseListener(), S(v, "ln-dropdown:open", { target: m.detail.target }));
    }, this._onToggleClose = function(m) {
      !m.detail || m.detail.target !== b.toggleEl || (b.triggerBtn && b.triggerBtn.setAttribute("aria-expanded", "false"), b._removeOutsideClickListener(), b._removeScrollRepositionListener(), b._removeResizeCloseListener(), b.toggleEl.style.top = "", b.toggleEl.style.left = "", typeof b.toggleEl.hidePopover == "function" && b.toggleEl.matches(":popover-open") && b.toggleEl.hidePopover(), S(v, "ln-dropdown:close", { target: m.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  E.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const v = this.triggerBtn.getBoundingClientRect(), b = kt(this.toggleEl), m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, _ = Et(v, b, "bottom-end", m);
    this.toggleEl.style.top = _.top + "px", this.toggleEl.style.left = _.left + "px";
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
  }, U(h, d, E, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", d = "lnPopover", E = "data-ln-popover-for", v = "data-ln-popover-position";
  if (window[d] !== void 0) return;
  const b = [];
  let m = null;
  function _() {
    m || (m = function(p) {
      if (p.key !== "Escape" || b.length === 0) return;
      b[b.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function l() {
    b.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function f(p) {
    return this.dom = p, this.isOpen = p.getAttribute(h) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, p.hasAttribute("tabindex") || p.setAttribute("tabindex", "-1"), p.hasAttribute("role") || p.setAttribute("role", "dialog"), p.hasAttribute("popover") || p.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  f.prototype.open = function(p) {
    this.isOpen || (this.trigger = p || null, this.dom.setAttribute(h, "open"));
  }, f.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, f.prototype.toggle = function(p) {
    this.isOpen ? this.close() : this.open(p);
  }, f.prototype._applyOpen = function(p) {
    this.isOpen = !0, p && (this.trigger = p), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const s = kt(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(v) || "bottom", o = Et(r, s, t, 8);
      this.dom.style.top = o.top + "px", this.dom.style.left = o.left + "px", this.dom.setAttribute("data-ln-popover-placement", o.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const a = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), e = Array.prototype.find.call(a, vt);
    e ? e.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(r) {
      i.dom.contains(r.target) || i.trigger && i.trigger.contains(r.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const r = i.trigger.getBoundingClientRect(), t = kt(i.dom), o = i.dom.getAttribute(v) || "bottom", n = Et(r, t, o, 8);
      i.dom.style.top = n.top + "px", i.dom.style.left = n.left + "px", i.dom.setAttribute("data-ln-popover-placement", n.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), b.push(this), _(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, f.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const p = b.indexOf(this);
    p !== -1 && b.splice(p, 1), l(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, f.prototype.destroy = function() {
    this.dom[d] && (this.isOpen && this._applyClose(), delete this.dom[d], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function u(p) {
    this.dom = p;
    const s = p.getAttribute(E);
    return p.setAttribute("aria-haspopup", "dialog"), p.setAttribute("aria-expanded", "false"), p.setAttribute("aria-controls", s), this._onClick = function(a) {
      if (a.ctrlKey || a.metaKey || a.button === 1) return;
      a.preventDefault();
      const e = document.getElementById(s);
      !e || !e[d] || e[d].toggle(p);
    }, p.addEventListener("click", this._onClick), this;
  }
  u.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[d + "Trigger"];
  }, U(h, d, f, "ln-popover", {
    onAttributeChange: function(p) {
      const s = p[d];
      if (!s) return;
      const e = p.getAttribute(h) === "open";
      if (e !== s.isOpen)
        if (e) {
          if (G(p, "ln-popover:before-open", {
            popoverId: p.id,
            target: p,
            trigger: s.trigger
          }).defaultPrevented) {
            p.setAttribute(h, "closed");
            return;
          }
          s._applyOpen(s.trigger);
        } else {
          if (G(p, "ln-popover:before-close", {
            popoverId: p.id,
            target: p,
            trigger: s.trigger
          }).defaultPrevented) {
            p.setAttribute(h, "open");
            return;
          }
          s._applyClose();
        }
    }
  }), U(E, d + "Trigger", u, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", d = "data-ln-tooltip", E = "data-ln-tooltip-position", v = "lnTooltipEnhance", b = "ln-tooltip-portal";
  if (window[v] !== void 0) return;
  let m = 0, _ = null, l = null, f = null, u = null, p = null, s = null;
  function a() {
    return _ && _.parentNode || (_ = document.getElementById(b), _ || (_ = document.createElement("div"), _.id = b, document.body.appendChild(_)), _.hasAttribute("popover") || _.setAttribute("popover", "manual")), _;
  }
  function e() {
    s || (s = function(n) {
      n.key === "Escape" && t();
    }, document.addEventListener("keydown", s));
  }
  function i() {
    s && (document.removeEventListener("keydown", s), s = null);
  }
  function r(n) {
    if (f === n) return;
    t();
    const g = n.getAttribute(d) || n.getAttribute("title");
    if (!g) return;
    a(), typeof _.showPopover == "function" && _.showPopover(), n.hasAttribute("title") && (u = n.getAttribute("title"), n.removeAttribute("title"));
    const c = n.getAttribute("aria-describedby");
    c ? p = c : p = null;
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = g, n[v + "Uid"] || (m += 1, n[v + "Uid"] = "ln-tooltip-" + m), y.id = n[v + "Uid"], _.appendChild(y);
    const w = y.offsetWidth, A = y.offsetHeight, L = n.getBoundingClientRect(), C = n.getAttribute(E) || "top", x = Et(L, { width: w, height: A }, C, 6);
    y.style.top = x.top + "px", y.style.left = x.left + "px", y.setAttribute("data-ln-tooltip-placement", x.placement), p ? n.setAttribute("aria-describedby", p + " " + y.id) : n.setAttribute("aria-describedby", y.id), l = y, f = n, e();
  }
  function t() {
    if (!l) {
      i();
      return;
    }
    f && (p !== null ? f.setAttribute("aria-describedby", p) : f.removeAttribute("aria-describedby"), p = null, u !== null && f.setAttribute("title", u)), u = null, l.parentNode && l.parentNode.removeChild(l), l = null, f = null, _ && typeof _.hidePopover == "function" && _.matches(":popover-open") && _.hidePopover(), i();
  }
  function o(n) {
    return this.dom = n, n.hasAttribute("data-ln-tooltip-enhanced") || (n.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(n);
    }, this._onLeave = function() {
      f === n && !n.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      r(n);
    }, this._onBlur = function() {
      f === n && !n.matches(":hover") && t();
    }, n.addEventListener("mouseenter", this._onEnter), n.addEventListener("mouseleave", this._onLeave), n.addEventListener("focus", this._onFocus, !0), n.addEventListener("blur", this._onBlur, !0), this;
  }
  o.prototype.destroy = function() {
    const n = this.dom;
    n.removeEventListener("mouseenter", this._onEnter), n.removeEventListener("mouseleave", this._onLeave), n.removeEventListener("focus", this._onFocus, !0), n.removeEventListener("blur", this._onBlur, !0), f === n && t(), this._addedEnhancedAttr && n.removeAttribute("data-ln-tooltip-enhanced"), delete n[v], delete n[v + "Uid"], S(n, "ln-tooltip:destroyed", { trigger: n });
  }, U(
    "[" + h + "], [data-ln-tooltip-enhanced], [" + d + "][title]",
    v,
    o,
    "ln-tooltip"
  );
})();
(function() {
  const h = "data-ln-toast", d = "lnToast", E = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function v(e) {
    if (!e || e.nodeType !== 1) return;
    const i = Array.from(e.querySelectorAll("[" + h + "]"));
    e.hasAttribute && e.hasAttribute(h) && i.push(e);
    for (const r of i)
      r[d] || new b(r);
  }
  function b(e) {
    this.dom = e, e[d] = this, this.timeoutDefault = parseInt(e.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(e.getAttribute("data-ln-toast-max") || "5", 10);
    const i = Array.from(e.querySelectorAll("[data-ln-toast-item]"));
    for (; i.length > this.max; ) e.removeChild(i.shift());
    for (const r of i) p(r, this);
    return this;
  }
  b.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const e of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        f(e);
      delete this.dom[d];
    }
  };
  function m(e, i) {
    const r = ((e.type || "") + "").trim().toLowerCase(), t = ct(i, E, "ln-toast");
    if (!t)
      return console.warn('[ln-toast] Template "' + E + '" not found'), null;
    Q(t, {
      type: r,
      title: e.title,
      message: typeof e.message == "string" ? e.message : void 0
    });
    const o = t.firstElementChild;
    if (!o) return null;
    o.hasAttribute("data-ln-toast-item") || o.setAttribute("data-ln-toast-item", ""), o.classList.add("ln-enter");
    const n = o.querySelector(".body");
    n && _(n, e);
    const g = o.querySelector("[data-ln-toast-close]");
    return g && g.addEventListener("click", function() {
      f(o);
    }), o;
  }
  function _(e, i) {
    if (Array.isArray(i.message)) {
      const r = document.createElement("ul");
      for (const t of i.message) {
        const o = document.createElement("li");
        o.textContent = t, r.appendChild(o);
      }
      e.appendChild(r);
    }
    if (i.data && i.data.errors) {
      const r = document.createElement("ul");
      for (const t of Object.values(i.data.errors).flat()) {
        const o = document.createElement("li");
        o.textContent = t, r.appendChild(o);
      }
      e.appendChild(r);
    }
  }
  function l(e, i) {
    const r = Array.from(e.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; r.length >= e.max && r.length > 0; ) e.dom.removeChild(r.shift());
    e.dom.appendChild(i), requestAnimationFrame(() => i.classList.remove("ln-enter"));
  }
  function f(e) {
    !e || !e.parentNode || (clearTimeout(e._timer), e.classList.remove("ln-enter"), e.classList.add("ln-out"), setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e);
    }, 200));
  }
  function u(e) {
    let i = e && e.container;
    return typeof i == "string" && (i = document.querySelector(i)), i instanceof HTMLElement || (i = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), i || null;
  }
  function p(e, i) {
    if (e._lnToastHydrated) return;
    e._lnToastHydrated = !0;
    const r = e.querySelector("[data-ln-toast-close]");
    r && r.addEventListener("click", function() {
      f(e);
    });
    const t = e.getAttribute("data-ln-toast-timeout"), o = t !== null ? parseInt(t, 10) : NaN, n = Number.isFinite(o) ? o : i.timeoutDefault;
    n > 0 && (e._timer = setTimeout(function() {
      f(e);
    }, n));
  }
  function s(e) {
    const i = e.detail || {}, r = u(i);
    if (!r) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const t = r[d] || new b(r), o = m(i, r);
    if (!o) return;
    const n = Number.isFinite(i.timeout) ? i.timeout : t.timeoutDefault;
    l(t, o), n > 0 && (o._timer = setTimeout(() => f(o), n));
  }
  function a(e) {
    const i = e && e.detail || {};
    if (i.container) {
      const r = u(i);
      if (r)
        for (const t of Array.from(r.querySelectorAll("[data-ln-toast-item]"))) f(t);
    } else {
      const r = document.querySelectorAll("[" + h + "]");
      for (const t of Array.from(r))
        for (const o of Array.from(t.querySelectorAll("[data-ln-toast-item]"))) f(o);
    }
  }
  tt(function() {
    window.addEventListener("ln-toast:enqueue", s), window.addEventListener("ln-toast:clear", a), new MutationObserver(function(i) {
      for (const r of i) {
        if (r.type === "attributes") {
          v(r.target);
          continue;
        }
        for (const t of r.addedNodes)
          v(t);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), v(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", d = "lnUpload", E = "data-ln-upload-dict", v = "data-ln-upload-accept", b = "data-ln-upload-context", m = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function _() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const i = document.createElement("div");
    i.innerHTML = m;
    const r = i.firstElementChild;
    r && document.body.appendChild(r);
  }
  if (window[d] !== void 0) return;
  function l(i) {
    if (i === 0) return "0 B";
    const r = 1024, t = ["B", "KB", "MB", "GB"], o = Math.floor(Math.log(i) / Math.log(r));
    return parseFloat((i / Math.pow(r, o)).toFixed(1)) + " " + t[o];
  }
  function f(i) {
    return i.split(".").pop().toLowerCase();
  }
  function u(i) {
    return i === "docx" && (i = "doc"), ["pdf", "doc", "epub"].includes(i) ? "lnc-file-" + i : "ln-file";
  }
  function p(i, r) {
    if (!r) return !0;
    const t = "." + f(i.name);
    return r.split(",").map(function(n) {
      return n.trim().toLowerCase();
    }).includes(t.toLowerCase());
  }
  function s(i) {
    if (i.hasAttribute("data-ln-upload-initialized")) return;
    i.setAttribute("data-ln-upload-initialized", "true"), _();
    const r = Rt(i, E), t = i.querySelector(".ln-upload__zone"), o = i.querySelector(".ln-upload__list"), n = i.getAttribute(v) || "";
    if (!t || !o) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", i);
      return;
    }
    let g = i.querySelector('input[type="file"]');
    g || (g = document.createElement("input"), g.type = "file", g.multiple = !0, g.classList.add("hidden"), n && (g.accept = n.split(",").map(function(P) {
      return P = P.trim(), P.startsWith(".") ? P : "." + P;
    }).join(",")), i.appendChild(g));
    const c = i.getAttribute(h) || "/files/upload", y = i.getAttribute(b) || "", w = i.getAttribute("data-ln-upload-delete") || (c.includes("/upload") ? c.replace(/\/upload\/?$/, "/{id}") : c + "/{id}"), A = /* @__PURE__ */ new Map();
    let L = 0;
    function C() {
      const P = document.querySelector('meta[name="csrf-token"]');
      return P ? P.getAttribute("content") : "";
    }
    function x(P) {
      if (!p(P, n)) {
        const F = r["invalid-type"];
        S(i, "ln-upload:invalid", {
          file: P,
          message: F
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: r["invalid-title"] || "Invalid File",
          message: F || r["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const K = "file-" + ++L, W = f(P.name), ft = u(W), et = ct(i, "ln-upload-item", "ln-upload");
      if (!et) return;
      const J = et.firstElementChild;
      if (!J) return;
      J.setAttribute("data-file-id", K), Q(J, {
        name: P.name,
        sizeText: "0%",
        iconHref: "#" + ft,
        removeLabel: r.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const T = J.querySelector(".ln-upload__progress-bar"), k = J.querySelector('[data-ln-upload-action="remove"]');
      k && (k.disabled = !0), o.appendChild(J);
      const I = new FormData();
      I.append("file", P);
      const M = /* @__PURE__ */ new Set();
      i.querySelectorAll("input, select, textarea").forEach(function(F) {
        if (F.name && F.name !== "file_ids[]" && F.type !== "file") {
          if ((F.type === "checkbox" || F.type === "radio") && !F.checked)
            return;
          I.append(F.name, F.value), M.add(F.name);
        }
      }), !M.has("context") && y && I.append("context", y);
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
          Q(J, { sizeText: l(F.size || P.size), uploading: !1 }), k && (k.disabled = !1), A.set(K, {
            serverId: F.id,
            name: F.name,
            size: F.size
          }), D(), S(i, "ln-upload:uploaded", {
            localId: K,
            serverId: F.id,
            name: F.name
          });
        } else {
          let F = r["upload-failed"] || "Upload failed";
          try {
            F = JSON.parse(R.responseText).message || F;
          } catch {
          }
          H(F);
        }
      }), R.addEventListener("error", function() {
        H(r["network-error"] || "Network error");
      });
      function H(F) {
        T && (T.style.width = "100%"), Q(J, { sizeText: r.error || "Error", uploading: !1, error: !0 }), k && (k.disabled = !1), S(i, "ln-upload:error", {
          file: P,
          message: F
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: r["error-title"] || "Upload Error",
          message: F || r["upload-failed"] || "Failed to upload file"
        });
      }
      R.open("POST", c), R.setRequestHeader("X-CSRF-TOKEN", C()), R.setRequestHeader("Accept", "application/json"), R.send(I);
    }
    function D() {
      for (const P of i.querySelectorAll('input[name="file_ids[]"]'))
        P.remove();
      for (const [, P] of A) {
        const K = document.createElement("input");
        K.type = "hidden", K.name = "file_ids[]", K.value = P.serverId, i.appendChild(K);
      }
    }
    function q(P) {
      const K = A.get(P), W = o.querySelector('[data-file-id="' + P + '"]');
      if (!K || !K.serverId) {
        W && W.remove(), A.delete(P), D();
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
        et.status === 200 ? (W && W.remove(), A.delete(P), D(), S(i, "ln-upload:removed", {
          localId: P,
          serverId: K.serverId
        })) : (W && Q(W, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: r["delete-title"] || "Error",
          message: r["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(et) {
        console.warn("[ln-upload] Delete error:", et), W && Q(W, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: r["network-error"] || "Network error",
          message: r["connection-error"] || "Could not connect to server"
        });
      });
    }
    function N(P) {
      for (const K of P)
        x(K);
      g.value = "";
    }
    const O = function() {
      g.click();
    }, B = function() {
      N(this.files);
    }, j = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, ot = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, Z = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover");
    }, bt = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover"), N(P.dataTransfer.files);
    }, yt = function(P) {
      const K = P.target.closest('[data-ln-upload-action="remove"]');
      if (!K || !o.contains(K) || K.disabled) return;
      const W = K.closest(".ln-upload__item");
      W && q(W.getAttribute("data-file-id"));
    };
    t.addEventListener("click", O), g.addEventListener("change", B), t.addEventListener("dragenter", j), t.addEventListener("dragover", ot), t.addEventListener("dragleave", Z), t.addEventListener("drop", bt), o.addEventListener("click", yt), i.lnUploadAPI = {
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
        A.clear(), o.innerHTML = "", D(), S(i, "ln-upload:cleared", {});
      },
      destroy: function() {
        t.removeEventListener("click", O), g.removeEventListener("change", B), t.removeEventListener("dragenter", j), t.removeEventListener("dragover", ot), t.removeEventListener("dragleave", Z), t.removeEventListener("drop", bt), o.removeEventListener("click", yt), A.clear(), o.innerHTML = "", D(), i.removeAttribute("data-ln-upload-initialized"), delete i.lnUploadAPI;
      }
    };
  }
  function a() {
    for (const i of document.querySelectorAll("[" + h + "]"))
      s(i);
  }
  function e() {
    tt(function() {
      new MutationObserver(function(r) {
        for (const t of r)
          if (t.type === "childList") {
            for (const o of t.addedNodes)
              if (o.nodeType === 1) {
                o.hasAttribute(h) && s(o);
                for (const n of o.querySelectorAll("[" + h + "]"))
                  s(n);
              }
          } else t.type === "attributes" && t.target.hasAttribute(h) && s(t.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[d] = {
    init: s,
    initAll: a
  }, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function d(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function E(l) {
    if (l.getAttribute("data-ln-external-link") === "processed" || !d(l)) return;
    l.target = "_blank";
    const f = (l.rel || "").split(/\s+/).filter(Boolean);
    f.includes("noopener") || f.push("noopener"), f.includes("noreferrer") || f.push("noreferrer"), l.rel = f.join(" ");
    const u = document.createElement("span");
    u.className = "sr-only", u.textContent = "(opens in new tab)", l.appendChild(u), l.setAttribute("data-ln-external-link", "processed"), S(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    });
  }
  function v(l) {
    l = l || document.body;
    for (const f of l.querySelectorAll("a, area"))
      E(f);
  }
  function b() {
    tt(function() {
      document.body.addEventListener("click", function(l) {
        const f = l.target.closest("a, area");
        f && f.getAttribute("data-ln-external-link") === "processed" && S(f, "ln-external-links:clicked", {
          link: f,
          href: f.href,
          text: f.textContent || f.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    tt(function() {
      new MutationObserver(function(f) {
        for (const u of f) {
          if (u.type === "childList") {
            for (const p of u.addedNodes)
              if (p.nodeType === 1 && (p.matches && (p.matches("a") || p.matches("area")) && E(p), p.querySelectorAll))
                for (const s of p.querySelectorAll("a, area"))
                  E(s);
          }
          if (u.type === "attributes" && u.attributeName === "href") {
            const p = u.target;
            p.matches && (p.matches("a") || p.matches("area")) && E(p);
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
  function _() {
    b(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      v();
    }) : v();
  }
  window[h] = {
    process: v
  }, _();
})();
(function() {
  const h = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  let E = null;
  function v() {
    E = document.createElement("div"), E.className = "ln-link-status", document.body.appendChild(E);
  }
  function b(o) {
    E && (E.textContent = o, E.classList.add("ln-link-status--visible"));
  }
  function m() {
    E && E.classList.remove("ln-link-status--visible");
  }
  function _(o, n) {
    if (n.target.closest("a, button, input, select, textarea")) return;
    const g = o.querySelector("a");
    if (!g) return;
    const c = g.getAttribute("href");
    if (!c) return;
    if (n.ctrlKey || n.metaKey || n.button === 1) {
      window.open(c, "_blank");
      return;
    }
    G(o, "ln-link:navigate", { target: o, href: c, link: g }).defaultPrevented || g.click();
  }
  function l(o) {
    const n = o.querySelector("a");
    if (!n) return;
    const g = n.getAttribute("href");
    g && b(g);
  }
  function f() {
    m();
  }
  function u(o) {
    o[d + "Row"] || !o.querySelector("a") || (o[d + "Row"] = !0, o._lnLinkClick = function(g) {
      _(o, g);
    }, o._lnLinkEnter = function() {
      l(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", f));
  }
  function p(o) {
    o[d + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", f), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[d + "Row"]);
  }
  function s(o) {
    if (!o[d + "Init"]) return;
    const n = o.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const g = n === "TABLE" && o.querySelector("tbody") || o;
      for (const c of g.querySelectorAll("tr"))
        p(c);
    } else
      p(o);
    delete o[d + "Init"];
  }
  function a(o) {
    if (o[d + "Init"]) return;
    o[d + "Init"] = !0;
    const n = o.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const g = n === "TABLE" && o.querySelector("tbody") || o;
      for (const c of g.querySelectorAll("tr"))
        u(c);
    } else
      u(o);
  }
  function e(o) {
    o.hasAttribute && o.hasAttribute(h) && a(o);
    const n = o.querySelectorAll ? o.querySelectorAll("[" + h + "]") : [];
    for (const g of n)
      a(g);
  }
  function i() {
    tt(function() {
      new MutationObserver(function(n) {
        for (const g of n)
          if (g.type === "childList") {
            for (const c of g.addedNodes)
              if (c.nodeType === 1) {
                e(c);
                const y = c.closest("[" + h + "]");
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
          } else g.type === "attributes" && (g.target.hasAttribute && g.target.hasAttribute(h) ? e(g.target) : s(g.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function r(o) {
    e(o);
  }
  window[d] = { init: r, destroy: s };
  function t() {
    v(), i(), r(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const h = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0) return;
  function E(_) {
    return this.dom = _, this._attrObserver = null, this._parentObserver = null, m.call(this), v.call(this), b.call(this), this;
  }
  E.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[d]);
  };
  function v() {
    const _ = this, l = new MutationObserver(function(f) {
      for (const u of f)
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && m.call(_);
    });
    l.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = l;
  }
  function b() {
    const _ = this, l = this.dom.parentElement;
    if (!l) return;
    const f = new MutationObserver(function(u) {
      for (const p of u)
        p.attributeName === "data-ln-progress-max" && m.call(_);
    });
    f.observe(l, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = f;
  }
  function m() {
    const _ = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, l = this.dom.parentElement, u = (l && l.hasAttribute("data-ln-progress-max") ? parseFloat(l.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let p = u > 0 ? _ / u * 100 : 0;
    p < 0 && (p = 0), p > 100 && (p = 100), this.dom.style.width = p + "%";
    const s = Math.max(0, Math.min(_, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(s)), S(this.dom, "ln-progress:change", { target: this.dom, value: _, max: u, percentage: p });
  }
  U(
    h,
    d,
    E,
    "ln-progress"
  );
})();
(function() {
  const h = "data-ln-filter", d = "lnFilter", E = "data-ln-filter-initialized", v = "data-ln-filter-key", b = "data-ln-filter-value", m = "data-ln-filter-hide", _ = "data-ln-filter-reset", l = "data-ln-filter-col", f = /* @__PURE__ */ new WeakMap();
  if (window[d] !== void 0) return;
  function u(i) {
    return i.hasAttribute(_) || i.getAttribute(b) === "";
  }
  function p(i) {
    let r = i._filterKey;
    const t = [];
    for (let o = 0; o < i.inputs.length; o++) {
      const n = i.inputs[o];
      if (n.checked && !u(n)) {
        const g = n.getAttribute(b);
        g && t.push(g);
      }
    }
    return { key: r, values: t };
  }
  function s(i, r) {
    if (i.length !== r.length) return !0;
    for (let t = 0; t < i.length; t++) if (i[t] !== r[t]) return !0;
    return !1;
  }
  function a(i) {
    const r = i.dom, t = i.colIndex, o = r.querySelector("template");
    if (!o || t === null) return;
    const n = document.getElementById(i.targetId);
    if (!n) return;
    const g = n.tagName === "TABLE" ? n : n.querySelector("table");
    if (!g || n.hasAttribute("data-ln-table")) return;
    const c = {}, y = [], w = g.tBodies;
    for (let C = 0; C < w.length; C++) {
      const x = w[C].rows;
      for (let D = 0; D < x.length; D++) {
        const q = x[D].cells[t], N = q ? q.textContent.trim() : "";
        N && !c[N] && (c[N] = !0, y.push(N));
      }
    }
    y.sort(function(C, x) {
      return C.localeCompare(x);
    });
    const A = r.querySelector("[" + v + "]"), L = A ? A.getAttribute(v) : r.getAttribute("data-ln-filter-key") || "col" + t;
    for (let C = 0; C < y.length; C++) {
      const x = o.content.cloneNode(!0), D = x.querySelector("input");
      D && (D.setAttribute(v, L), D.setAttribute(b, y[C]), gt(x, { text: y[C] }), r.appendChild(x));
    }
  }
  function e(i) {
    if (i.hasAttribute(E)) return this;
    this.dom = i, this.targetId = i.getAttribute(h);
    const r = i.getAttribute(l);
    this.colIndex = r !== null ? parseInt(r, 10) : null, a(this), this.inputs = Array.from(i.querySelectorAll("[" + v + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(v) : null, this._lastSnapshot = null;
    const t = this, o = Mt(
      function() {
        t._render();
      },
      function() {
        t._afterRender();
      }
    );
    this._queueRender = o, this._attachHandlers();
    let n = !1;
    if (i.hasAttribute("data-ln-persist")) {
      const g = St("filter", i);
      if (g && g.key && Array.isArray(g.values) && g.values.length > 0) {
        for (let c = 0; c < this.inputs.length; c++) {
          const y = this.inputs[c];
          u(y) ? y.checked = !1 : y.getAttribute(v) === g.key && g.values.indexOf(y.getAttribute(b)) !== -1 ? y.checked = !0 : y.checked = !1;
        }
        o(), n = !0;
      }
    }
    if (!n) {
      for (let g = 0; g < this.inputs.length; g++)
        if (this.inputs[g].checked && !u(this.inputs[g])) {
          o();
          break;
        }
    }
    return i.setAttribute(E, ""), this;
  }
  e.prototype._attachHandlers = function() {
    const i = this;
    this.inputs.forEach(function(r) {
      r[d + "Bound"] || (r[d + "Bound"] = !0, r._lnFilterChange = function() {
        if (u(r)) {
          for (let t = 0; t < i.inputs.length; t++)
            u(i.inputs[t]) || (i.inputs[t].checked = !1);
          r.checked = !0, i._queueRender();
          return;
        }
        if (r.checked) {
          for (let o = 0; o < i.inputs.length; o++)
            u(i.inputs[o]) && (i.inputs[o].checked = !1);
          let t = !1;
          for (let o = 0; o < i.inputs.length; o++)
            if (u(i.inputs[o])) {
              t = !0;
              break;
            }
          if (t) {
            let o = !0;
            for (let n = 0; n < i.inputs.length; n++)
              if (!u(i.inputs[n]) && !i.inputs[n].checked) {
                o = !1;
                break;
              }
            if (o)
              for (let n = 0; n < i.inputs.length; n++)
                u(i.inputs[n]) ? i.inputs[n].checked = !0 : i.inputs[n].checked = !1;
          }
        } else {
          let t = !1;
          for (let o = 0; o < i.inputs.length; o++)
            if (!u(i.inputs[o]) && i.inputs[o].checked) {
              t = !0;
              break;
            }
          if (!t)
            for (let o = 0; o < i.inputs.length; o++)
              u(i.inputs[o]) && (i.inputs[o].checked = !0);
        }
        i._queueRender();
      }, r.addEventListener("change", r._lnFilterChange));
    });
  }, e.prototype._render = function() {
    const i = this, r = p(this), t = r.key === null || r.values.length === 0, o = [];
    for (let n = 0; n < r.values.length; n++)
      o.push(r.values[n].toLowerCase());
    if (i.colIndex !== null)
      i._filterTableRows(r);
    else {
      const n = document.getElementById(i.targetId);
      if (!n) return;
      const g = n.children;
      for (let c = 0; c < g.length; c++) {
        const y = g[c];
        if (t) {
          y.removeAttribute(m);
          continue;
        }
        const w = y.getAttribute("data-" + r.key);
        y.removeAttribute(m), w !== null && o.indexOf(w.toLowerCase()) === -1 && y.setAttribute(m, "true");
      }
    }
  }, e.prototype._afterRender = function() {
    const i = p(this), r = this._lastSnapshot;
    if (!r || r.key !== i.key || s(r.values, i.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: i.key,
        values: i.values.slice()
      });
      const o = r && r.values.length > 0, n = i.values.length === 0;
      o && n && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: i.key, values: i.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (i.key && i.values.length > 0 ? dt("filter", this.dom, { key: i.key, values: i.values.slice() }) : dt("filter", this.dom, null));
  }, e.prototype._dispatchOnBoth = function(i, r) {
    S(this.dom, i, r);
    const t = document.getElementById(this.targetId);
    t && t !== this.dom && S(t, i, r);
  }, e.prototype._filterTableRows = function(i) {
    const r = document.getElementById(this.targetId);
    if (!r) return;
    const t = r.tagName === "TABLE" ? r : r.querySelector("table");
    if (!t || r.hasAttribute("data-ln-table")) return;
    const o = i.key || this._filterKey, n = i.values;
    f.has(t) || f.set(t, {});
    const g = f.get(t);
    if (o && n.length > 0) {
      const A = [];
      for (let L = 0; L < n.length; L++)
        A.push(n[L].toLowerCase());
      g[o] = { col: this.colIndex, values: A };
    } else o && delete g[o];
    const c = Object.keys(g), y = c.length > 0, w = t.tBodies;
    for (let A = 0; A < w.length; A++) {
      const L = w[A].rows;
      for (let C = 0; C < L.length; C++) {
        const x = L[C];
        if (!y) {
          x.removeAttribute(m);
          continue;
        }
        let D = !0;
        for (let q = 0; q < c.length; q++) {
          const N = g[c[q]], O = x.cells[N.col], B = O ? O.textContent.trim().toLowerCase() : "";
          if (N.values.indexOf(B) === -1) {
            D = !1;
            break;
          }
        }
        D ? x.removeAttribute(m) : x.setAttribute(m, "true");
      }
    }
  }, e.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.colIndex !== null) {
        const i = document.getElementById(this.targetId);
        if (i) {
          const r = i.tagName === "TABLE" ? i : i.querySelector("table");
          if (r && f.has(r)) {
            const t = f.get(r), o = this._filterKey;
            o && t[o] && delete t[o], Object.keys(t).length === 0 && f.delete(r);
          }
        }
      }
      this.inputs.forEach(function(i) {
        i._lnFilterChange && (i.removeEventListener("change", i._lnFilterChange), delete i._lnFilterChange), delete i[d + "Bound"];
      }), this.dom.removeAttribute(E), delete this.dom[d];
    }
  }, U(h, d, e, "ln-filter");
})();
(function() {
  const h = "data-ln-search", d = "lnSearch", E = "data-ln-search-initialized", v = "data-ln-search-hide";
  if (window[d] !== void 0) return;
  function m(_) {
    if (_.hasAttribute(E)) return this;
    this.dom = _, this.targetId = _.getAttribute(h);
    const l = _.tagName;
    this.input = l === "INPUT" || l === "TEXTAREA" ? _ : _.querySelector('[name="search"]') || _.querySelector('input[type="search"]') || _.querySelector('input[type="text"]'), this.itemsSelector = _.getAttribute("data-ln-search-items") || null;
    const f = _.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = f !== null ? parseInt(f, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const u = this;
      queueMicrotask(function() {
        u._search(u.input.value.trim().toLowerCase());
      });
    }
    return _.setAttribute(E, ""), this;
  }
  m.prototype._attachHandler = function() {
    if (!this.input) return;
    const _ = this, l = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = l ? l.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      _.input.value = "", _._search(""), _.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(_._debounceTimer), _._debounceTimer = setTimeout(function() {
        _._search(_.input.value.trim().toLowerCase());
      }, _.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, m.prototype._search = function(_) {
    const l = document.getElementById(this.targetId);
    if (!l || G(l, "ln-search:change", { term: _, targetId: this.targetId }).defaultPrevented) return;
    const u = this.itemsSelector ? l.querySelectorAll(this.itemsSelector) : l.children;
    for (let p = 0; p < u.length; p++) {
      const s = u[p];
      s.removeAttribute(v), _ && !s.textContent.replace(/\s+/g, " ").toLowerCase().includes(_) && s.setAttribute(v, "true");
    }
  }, m.prototype.destroy = function() {
    this.dom[d] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(E), delete this.dom[d]);
  }, U(h, d, m, "ln-search");
})();
(function() {
  const h = "lnTableSort", d = "data-ln-table-sort", E = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function v(l) {
    b(l);
  }
  function b(l) {
    const f = Array.from(l.querySelectorAll("table"));
    l.tagName === "TABLE" && f.push(l), f.forEach(function(u) {
      if (u[h]) return;
      const p = Array.from(u.querySelectorAll("th[" + d + "]"));
      p.length && (u[h] = new m(u, p));
    });
  }
  function m(l, f) {
    this.table = l, this.ths = f, this._col = -1, this._dir = null;
    const u = this;
    f.forEach(function(s, a) {
      if (s[h + "Bound"]) return;
      s[h + "Bound"] = !0;
      const e = s.querySelector("[" + E + "]");
      e && (e._lnSortClick = function() {
        u._handleClick(a, s);
      }, e.addEventListener("click", e._lnSortClick));
    });
    const p = l.closest("[data-ln-table][data-ln-persist]");
    if (p) {
      const s = St("table-sort", p);
      s && s.dir && s.col >= 0 && s.col < f.length && this._applySort(s.col, f[s.col], s.dir);
    }
    return this;
  }
  m.prototype._applySort = function(l, f, u) {
    this.ths.forEach(function(p) {
      p.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), u === null ? (this._col = -1, this._dir = null) : (this._col = l, this._dir = u, f.classList.add(u === "asc" ? "ln-sort-asc" : "ln-sort-desc")), S(this.table, "ln-table:sort", {
      column: l,
      sortType: f.getAttribute(d),
      direction: u
    });
  }, m.prototype._handleClick = function(l, f) {
    let u;
    this._col !== l ? u = "asc" : this._dir === "asc" ? u = "desc" : this._dir === "desc" ? u = null : u = "asc", this._applySort(l, f, u);
    const p = this.table.closest("[data-ln-table][data-ln-persist]");
    p && (u === null ? dt("table-sort", p, null) : dt("table-sort", p, { col: l, dir: u }));
  }, m.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(l) {
      const f = l.querySelector("[" + E + "]");
      f && f._lnSortClick && (f.removeEventListener("click", f._lnSortClick), delete f._lnSortClick), delete l[h + "Bound"];
    }), delete this.table[h]);
  };
  function _() {
    tt(function() {
      new MutationObserver(function(f) {
        f.forEach(function(u) {
          u.type === "childList" ? u.addedNodes.forEach(function(p) {
            p.nodeType === 1 && b(p);
          }) : u.type === "attributes" && b(u.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table-sort");
  }
  window[h] = v, _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-table", d = "lnTable", E = "data-ln-table-sort", v = "data-ln-table-empty";
  if (window[d] !== void 0) return;
  const u = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function p(e, i) {
    if (e == null || isNaN(e)) return "";
    try {
      return new Intl.NumberFormat(V(i)).format(e);
    } catch {
      return String(e);
    }
  }
  function s(e) {
    let i = e.parentElement;
    for (; i && i !== document.body && i !== document.documentElement; ) {
      const t = getComputedStyle(i).overflowY;
      if (t === "auto" || t === "scroll") return i;
      i = i.parentElement;
    }
    return null;
  }
  function a(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("[data-ln-table-body]") || e.querySelector("tbody"), this.thead = e.querySelector("thead");
    const i = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = i ? Array.from(i.querySelectorAll("th")) : [], this.isDataDriven = e.hasAttribute("data-ln-table-source"), this.name = e.getAttribute(h) || "", this.source = e.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const r = this;
    if (this._onColumnFilter = function(t) {
      const o = t.detail.key;
      let n = null;
      for (let y = 0; y < r.ths.length; y++)
        if (r.ths[y].getAttribute("data-ln-table-filter-col") === o) {
          n = r.ths[y];
          break;
        }
      if (!n) return;
      const g = t.detail.values, c = n.querySelector("[data-ln-table-col-filter]");
      if (c && c.classList.toggle("ln-filter-active", !!(g && g.length > 0)), r.isDataDriven)
        !g || g.length === 0 ? delete r.currentFilters[o] : r.currentFilters[o] = g, r._requestData();
      else {
        if (!g || g.length === 0)
          delete r._columnFilters[o];
        else {
          const y = [];
          for (let w = 0; w < g.length; w++)
            y.push(g[w].toLowerCase());
          r._columnFilters[o] = y;
        }
        r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), S(e, "ln-table:filter", {
          term: r._searchTerm,
          matched: r._filteredData.length,
          total: r._data.length
        });
      }
    }, this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && e.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._totalSpan = e.querySelector("[data-ln-table-total]"), this._filteredSpan = e.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== e ? this._filteredSpan.parentElement : null), this._selectedSpan = e.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== e ? this._selectedSpan.parentElement : null), this._onSetData = function(o) {
        const n = o.detail || {};
        if (r._windowed) {
          e.classList.remove("ln-table--loading"), r._cache.ingest(n);
          return;
        }
        r._data = n.data || [], r._lastTotal = n.total != null ? n.total : r._data.length, r._lastFiltered = n.filtered != null ? n.filtered : r._data.length, r.totalCount = r._lastTotal, r.visibleCount = r._lastFiltered, r.isLoaded = !0, e.classList.remove("ln-table--loading"), r._vStart = -1, r._vEnd = -1, r._applyFilterAndSort(), r._render(), r._updateFooter(), S(e, "ln-table:rendered", {
          table: r.name,
          total: r.totalCount,
          visible: r.visibleCount
        });
      }, e.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(o) {
        const n = o.detail && o.detail.loading;
        e.classList.toggle("ln-table--loading", !!n), n && (r.isLoaded = !1);
      }, e.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(o) {
        const n = o.target.closest("[data-ln-table-col-sort]");
        if (!n) return;
        const g = n.closest("th");
        if (!g) return;
        const c = g.getAttribute("data-ln-table-col");
        c && r._handleSort(c, g);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), e.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClearAll = function(o) {
        if (o.target.closest("[data-ln-table-clear-all]")) {
          r.currentFilters = {};
          for (let g = 0; g < r.ths.length; g++) {
            const c = r.ths[g].querySelector("[data-ln-table-col-filter]");
            c && c.classList.remove("ln-filter-active");
          }
          S(e, "ln-table:clear-filters", { table: r.name }), r._requestData();
        }
      }, e.addEventListener("click", this._onClearAll), this._selectable = e.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(o) {
        if (o.target.closest("[data-ln-table-row-select]") || o.target.closest("[data-ln-table-row-action]") || o.target.closest("a") || o.target.closest("button") || o.ctrlKey || o.metaKey || o.button === 1) return;
        const n = o.target.closest("[data-ln-table-row]");
        if (!n) return;
        const g = n.getAttribute("data-ln-table-row-id"), c = n._lnRecord || {};
        S(e, "ln-table:row-click", {
          table: r.name,
          id: g,
          record: c
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(o) {
        const n = o.target.closest("[data-ln-table-row-action]");
        if (!n) return;
        o.stopPropagation();
        const g = n.closest("[data-ln-table-row]");
        if (!g) return;
        const c = n.getAttribute("data-ln-table-row-action"), y = g.getAttribute("data-ln-table-row-id"), w = g._lnRecord || {};
        S(e, "ln-table:row-action", {
          table: r.name,
          id: y,
          action: c,
          record: w
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const t = document.querySelector('[data-ln-search="' + e.id + '"]');
      if (t) {
        const o = t.tagName;
        this._searchInput = o === "INPUT" || o === "TEXTAREA" ? t : t.querySelector('input[type="search"]') || t.querySelector('input[type="text"]') || t.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(o) {
        o.preventDefault(), r.currentSearch = o.detail.term, r._searchInput && (r._searchInput.value = o.detail.term), S(e, "ln-table:search", {
          table: r.name,
          query: r.currentSearch
        }), r._requestData();
      }, e.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(o) {
        if (!e.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (o.key === "/") {
          r._searchInput && (o.preventDefault(), r._searchInput.focus());
          return;
        }
        const n = r.tbody ? Array.from(r.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (n.length)
          switch (o.key) {
            case "ArrowDown":
              o.preventDefault(), r._focusedRowIndex = Math.min(r._focusedRowIndex + 1, n.length - 1), r._focusRow(n);
              break;
            case "ArrowUp":
              o.preventDefault(), r._focusedRowIndex = Math.max(r._focusedRowIndex - 1, 0), r._focusRow(n);
              break;
            case "Home":
              o.preventDefault(), r._focusedRowIndex = 0, r._focusRow(n);
              break;
            case "End":
              o.preventDefault(), r._focusedRowIndex = n.length - 1, r._focusRow(n);
              break;
            case "Enter":
              if (r._focusedRowIndex >= 0 && r._focusedRowIndex < n.length) {
                o.preventDefault();
                const g = n[r._focusedRowIndex];
                S(e, "ln-table:row-click", {
                  table: r.name,
                  id: g.getAttribute("data-ln-table-row-id"),
                  record: g._lnRecord || {}
                });
              }
              break;
            case " ":
              if (r._selectable && r._focusedRowIndex >= 0 && r._focusedRowIndex < n.length) {
                o.preventDefault();
                const g = n[r._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                g && (g.checked = !g.checked, g.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : S(e, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        r.tbody.rows.length > 0 && (r._emptyTbodyObserver.disconnect(), r._emptyTbodyObserver = null, r._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(t) {
        t.preventDefault(), r._searchTerm = t.detail.term, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), S(e, "ln-table:filter", {
          term: r._searchTerm,
          matched: r._filteredData.length,
          total: r._data.length
        });
      }, e.addEventListener("ln-search:change", this._onSearch), this._onSort = function(t) {
        r._sortCol = t.detail.direction === null ? -1 : t.detail.column, r._sortDir = t.detail.direction, r._sortType = t.detail.sortType, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), S(e, "ln-table:sorted", {
          column: t.detail.column,
          direction: t.detail.direction,
          matched: r._filteredData.length,
          total: r._data.length
        });
      }, e.addEventListener("ln-table:sort", this._onSort), e.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(t) {
        if (!t.target.closest("[data-ln-table-clear]")) return;
        r._searchTerm = "";
        const n = document.querySelector('[data-ln-search="' + e.id + '"]');
        if (n) {
          const c = n.tagName === "INPUT" ? n : n.querySelector("input");
          c && (c.value = "");
        }
        r._columnFilters = {};
        for (let c = 0; c < r.ths.length; c++) {
          const y = r.ths[c].querySelector("[data-ln-table-col-filter]");
          y && y.classList.remove("ln-filter-active");
        }
        const g = document.querySelectorAll('[data-ln-filter="' + e.id + '"]');
        for (let c = 0; c < g.length; c++) {
          const y = g[c].querySelector("[data-ln-filter-reset]");
          y && (y.checked = !0, y.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), S(e, "ln-table:filter", {
          term: "",
          matched: r._filteredData.length,
          total: r._data.length
        });
      }, e.addEventListener("click", this._onClear);
    return this;
  }
  a.prototype._parseRows = function() {
    const e = this.tbody.rows, i = this.ths;
    this._data = [];
    const r = [];
    for (let t = 0; t < i.length; t++)
      r[t] = i[t].getAttribute(E);
    e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < e.length; t++) {
      const o = e[t], n = [], g = [], c = [];
      for (let w = 0; w < o.cells.length; w++) {
        const A = o.cells[w], L = A.textContent.trim(), C = Ut(A), x = r[w];
        g[w] = L.toLowerCase(), x === "number" || x === "date" ? n[w] = parseFloat(C) || 0 : x === "string" ? n[w] = String(C) : n[w] = null, w < o.cells.length - 1 && c.push(L.toLowerCase());
      }
      let y = null;
      if (this.isDataDriven) {
        y = {};
        const w = o.getAttribute("data-ln-table-row-id");
        w != null && (y.id = w);
        for (let A = 0; A < i.length; A++) {
          const L = i[A].getAttribute("data-ln-table-col");
          if (L) {
            const C = A;
            if (C < o.cells.length) {
              const x = o.cells[C];
              y[L] = Ut(x);
            }
          }
        }
      }
      this._data.push({
        sortKeys: n,
        rawTexts: g,
        html: o.outerHTML,
        searchText: c.join(" "),
        id: this.isDataDriven && y ? y.id : void 0,
        ...y
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, a.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const e = (this.currentSearch || "").trim().toLowerCase(), i = this.currentFilters || {}, r = Object.keys(i).length > 0;
      if (this._filteredData = this._data.filter(function(y) {
        if (e) {
          let w = !1;
          for (const A in y)
            if (y.hasOwnProperty(A) && typeof y[A] == "string" && A !== "html" && A !== "searchText" && y[A].toLowerCase().indexOf(e) !== -1) {
              w = !0;
              break;
            }
          if (!w) return !1;
        }
        if (r)
          for (const w in i) {
            const A = i[w];
            if (A && A.length > 0) {
              const L = y[w], C = L != null ? String(L) : "";
              if (A.indexOf(C) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const t = this.currentSort.field, n = this.currentSort.direction === "desc" ? -1 : 1;
      let g = null;
      if (this.ths) {
        for (let y = 0; y < this.ths.length; y++)
          if (this.ths[y].getAttribute("data-ln-table-col") === t) {
            g = this.ths[y].getAttribute(E);
            break;
          }
      }
      const c = u ? u.compare : function(y, w) {
        return y < w ? -1 : y > w ? 1 : 0;
      };
      this._filteredData.sort(function(y, w) {
        const A = y[t], L = w[t];
        if (g === "number" || g === "date") {
          const D = parseFloat(A) || 0, q = parseFloat(L) || 0;
          return (D - q) * n;
        }
        if (typeof A == "number" && typeof L == "number")
          return (A - L) * n;
        const C = A != null ? String(A) : "", x = L != null ? String(L) : "";
        return c(C, x) * n;
      });
    } else {
      const e = this._searchTerm, i = this._columnFilters, r = Object.keys(i).length > 0, t = this.ths, o = {};
      if (r)
        for (let w = 0; w < t.length; w++) {
          const A = t[w].getAttribute("data-ln-table-filter-col");
          A && (o[A] = w);
        }
      if (!e && !r ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(w) {
        if (e && w.searchText.indexOf(e) === -1) return !1;
        if (r)
          for (const A in i) {
            const L = o[A];
            if (L !== void 0 && i[A].indexOf(w.rawTexts[L]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const n = this._sortCol, g = this._sortDir === "desc" ? -1 : 1, c = this._sortType === "number" || this._sortType === "date", y = u ? u.compare : function(w, A) {
        return w < A ? -1 : w > A ? 1 : 0;
      };
      this._filteredData.sort(function(w, A) {
        const L = w.sortKeys[n], C = A.sortKeys[n];
        return c ? (L - C) * g : y(L, C) * g;
      });
    }
  }, a.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const e = document.createElement("colgroup");
    this.ths.forEach(function(i) {
      const r = document.createElement("col");
      r.style.width = i.offsetWidth + "px", e.appendChild(r);
    }), this.table.insertBefore(e, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = e;
  }, a.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const e = this._lastTotal, i = this.visibleCount;
        if (e === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const e = this._filteredData.length;
        e === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, a.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const e = this._filteredData, i = document.createDocumentFragment();
      for (let r = 0; r < e.length; r++) {
        const t = this._buildRow(e[r]);
        if (!t) break;
        i.appendChild(t);
      }
      this.tbody.textContent = "", this.tbody.appendChild(i), this._selectable && this._updateSelectAll();
    } else {
      const e = [], i = this._filteredData;
      for (let r = 0; r < i.length; r++) e.push(i[r].html);
      this.tbody.innerHTML = e.join("");
    }
  }, a.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const e = this;
    if (!this._rowHeight)
      if (this._windowed) {
        let r = null;
        const t = this._cache.peek();
        t ? r = this._buildRow(t) : r = this._buildPlaceholderRow(), r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._rowHeight = r.offsetHeight || 40, this.tbody.textContent = "");
      } else if (this.isDataDriven) {
        if (this._data.length > 0) {
          const r = this._buildRow(this._data[0]);
          r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._rowHeight = r.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const r = this.tbody ? this.tbody.rows : [];
        r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = s(this.dom) : this._scrollContainer = null;
    const i = this._scrollContainer || window;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._windowed ? e._renderWindowed() : e._renderVirtual();
      }));
    }, i.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, a.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, a.prototype._renderVirtual = function() {
    const e = this._filteredData, i = e.length, r = this._rowHeight;
    if (!r || !i) return;
    const t = this.thead ? this.thead.offsetHeight : 0, o = this._scrollContainer;
    let n, g;
    if (o) {
      const C = this.table.getBoundingClientRect(), x = o.getBoundingClientRect(), D = C.top - x.top + o.scrollTop + t;
      n = o.scrollTop - D, g = o.clientHeight;
    } else {
      const D = this.table.getBoundingClientRect().top + window.scrollY + t;
      n = window.scrollY - D, g = window.innerHeight;
    }
    let c = Math.max(0, Math.floor(n / r) - 15);
    c = Math.min(c, i);
    const y = Math.min(c + Math.ceil(g / r) + 30, i);
    if (c === this._vStart && y === this._vEnd) return;
    this._vStart = c, this._vEnd = y;
    const w = this.ths.length || 1, A = c * r, L = (i - y) * r;
    if (this.isDataDriven) {
      const C = document.createDocumentFragment();
      if (A > 0) {
        const x = document.createElement("tr");
        x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
        const D = document.createElement("td");
        D.setAttribute("colspan", w), D.style.height = A + "px", x.appendChild(D), C.appendChild(x);
      }
      for (let x = c; x < y; x++) {
        const D = this._buildRow(e[x]);
        D && C.appendChild(D);
      }
      if (L > 0) {
        const x = document.createElement("tr");
        x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
        const D = document.createElement("td");
        D.setAttribute("colspan", w), D.style.height = L + "px", x.appendChild(D), C.appendChild(x);
      }
      this.tbody.textContent = "", this.tbody.appendChild(C), this._selectable && this._updateSelectAll();
    } else {
      let C = "";
      A > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let x = c; x < y; x++) C += e[x].html;
      L > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
    }
  }, a.prototype._buildPlaceholderRow = function() {
    const e = document.createElement("tr");
    e.className = "ln-table__placeholder", e.setAttribute("aria-hidden", "true");
    const i = document.createElement("td");
    return i.setAttribute("colspan", this.ths.length || 1), i.style.height = this._rowHeight + "px", e.appendChild(i), e;
  }, a.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const e = this._rowHeight;
    if (!e) return;
    const i = this._cache.logicalTotal, r = this.thead ? this.thead.offsetHeight : 0, t = this._scrollContainer;
    let o, n;
    if (t) {
      const C = this.table.getBoundingClientRect(), x = t.getBoundingClientRect(), D = C.top - x.top + t.scrollTop + r;
      o = t.scrollTop - D, n = t.clientHeight;
    } else {
      const D = this.table.getBoundingClientRect().top + window.scrollY + r;
      o = window.scrollY - D, n = window.innerHeight;
    }
    let g = Math.max(0, Math.floor(o / e) - 15);
    g = Math.min(g, i);
    const c = Math.min(g + Math.ceil(n / e) + 30, i), y = this.ths.length || 1, w = g * e, A = (i - c) * e, L = document.createDocumentFragment();
    if (w > 0) {
      const C = document.createElement("tr");
      C.className = "ln-table__spacer", C.setAttribute("aria-hidden", "true");
      const x = document.createElement("td");
      x.setAttribute("colspan", y), x.style.height = w + "px", C.appendChild(x), L.appendChild(C);
    }
    for (let C = g; C < c; C++)
      if (this._cache.has(C)) {
        const x = this._buildRow(this._cache.get(C));
        x && L.appendChild(x);
      } else
        L.appendChild(this._buildPlaceholderRow());
    if (A > 0) {
      const C = document.createElement("tr");
      C.className = "ln-table__spacer", C.setAttribute("aria-hidden", "true");
      const x = document.createElement("td");
      x.setAttribute("colspan", y), x.style.height = A + "px", C.appendChild(x), L.appendChild(C);
    }
    this.tbody.textContent = "", this.tbody.appendChild(L), this._vStart = g, this._vEnd = c, this._cache.ensure(g, c);
  }, a.prototype._showEmptyState = function() {
    const e = this.ths.length || 1;
    this.tbody.textContent = "";
    let i = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount, o = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (t < r || t === 0), n = o ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = ct(this.dom, n, "ln-table"), !i) {
        const g = this.dom.querySelector("template[data-ln-table-empty]");
        if (g) {
          const c = o ? "search" : "initial", y = g.content.querySelector('[data-ln-table-empty-when="' + c + '"]') || g.content.firstElementChild;
          y && (i = document.importNode(y, !0));
        }
      }
      if (i)
        if (i.tagName === "TR")
          this.tbody.appendChild(i);
        else {
          const g = document.createElement("td");
          g.setAttribute("colspan", String(e)), g.appendChild(i);
          const c = document.createElement("tr");
          c.className = "ln-table__empty", c.appendChild(g), this.tbody.appendChild(c);
        }
    } else {
      const r = this.dom.querySelector("template[" + v + "]"), t = document.createElement("td");
      t.setAttribute("colspan", String(e)), r && t.appendChild(document.importNode(r.content, !0));
      const o = document.createElement("tr");
      o.className = "ln-table__empty", o.appendChild(t), this.tbody.appendChild(o);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, a.prototype._fillRow = function(e, i) {
    gt(e, i);
    const r = e.querySelectorAll("[data-ln-table-cell-attr]");
    for (let t = 0; t < r.length; t++) {
      const o = r[t], n = o.getAttribute("data-ln-table-cell-attr").split(",");
      for (let g = 0; g < n.length; g++) {
        const c = n[g].trim().split(":");
        if (c.length !== 2) continue;
        const y = c[0].trim(), w = c[1].trim();
        i[y] != null && o.setAttribute(w, i[y]);
      }
    }
  }, a.prototype._buildRow = function(e) {
    const i = ct(this.dom, this.name + "-row", "ln-table");
    if (!i) return null;
    const r = i.querySelector("[data-ln-table-row]") || i.firstElementChild;
    if (!r) return null;
    if (this._fillRow(r, e), r._lnRecord = e, e.id != null && r.setAttribute("data-ln-table-row-id", e.id), this._selectable && e.id != null && this.selectedIds.has(String(e.id))) {
      r.classList.add("ln-row-selected");
      const t = r.querySelector("[data-ln-table-row-select]");
      t && (t.checked = !0);
    }
    return r;
  }, a.prototype._handleSort = function(e, i) {
    let r;
    !this.currentSort || this.currentSort.field !== e ? r = "asc" : this.currentSort.direction === "asc" ? r = "desc" : r = null;
    for (let t = 0; t < this.ths.length; t++)
      this.ths[t].classList.remove("ln-sort-asc", "ln-sort-desc");
    r ? (this.currentSort = { field: e, direction: r }, i.classList.add(r === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-table:sort", {
      table: this.name,
      field: e,
      direction: r
    }), this._requestData();
  }, a.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Wt(this, "ln-table:request-data", "table");
  }, a.prototype._enterWindowedMode = function() {
    const e = this, i = this.dom, r = parseInt(i.getAttribute("data-ln-table-window"), 10), t = parseInt(i.getAttribute("data-ln-table-window-page"), 10), o = parseInt(i.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !e._windowed || !e._cache || (e.totalCount = e._cache.grandTotal, e.visibleCount = e._cache.logicalTotal, e._lastTotal = e._cache.grandTotal, e.isLoaded = !0, e._vStart = -1, e._vEnd = -1, e._render(), e._updateFooter(), S(i, "ln-table:rendered", {
        table: e.name,
        total: e.totalCount,
        visible: e.visibleCount
      }));
    }, this._renderBatch = Mt(this._onCacheChange), this._cache = te({
      windowSize: r > 0 ? r : 1e3,
      pageSize: t > 0 ? t : 200,
      threshold: o >= 0 ? o : 25,
      fetchDebounce: 120,
      requestPage: function(n, g, c) {
        S(i, "ln-table:request-data", {
          table: e.name,
          sort: n.sort,
          filters: n.filters,
          search: n.search,
          offset: g,
          limit: c,
          queryGen: e._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, a.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let e = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(e) && this._totalSpan) {
        const r = this._totalSpan.textContent.replace(/[^\d]/g, "");
        r && (e = parseInt(r, 10));
      }
      const i = e > 0 ? e : this._data.length;
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
  }, a.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, a.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const e = this.tbody.querySelectorAll("[data-ln-table-row]");
    let i = e.length > 0;
    for (let r = 0; r < e.length; r++) {
      const t = e[r].getAttribute("data-ln-table-row-id");
      if (t != null && !this.selectedIds.has(t)) {
        i = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = i;
  }, Object.defineProperty(a.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), a.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const e = this;
    if (this._onSelectionChange = function(i) {
      const r = i.target.closest("[data-ln-table-row-select]");
      if (!r) return;
      const t = r.closest("[data-ln-table-row]");
      if (!t) return;
      const o = t.getAttribute("data-ln-table-row-id");
      o != null && (r.checked ? (e.selectedIds.add(o), t.classList.add("ln-row-selected")) : (e.selectedIds.delete(o), t.classList.remove("ln-row-selected")), e.selectedCount = e.selectedIds.size, e._updateSelectAll(), e._updateFooter(), S(e.dom, "ln-table:select", {
        table: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const i = document.createElement("input");
      i.type = "checkbox", i.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(i), this._selectAllCheckbox = i;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const i = e._selectAllCheckbox.checked, r = e.tbody ? e.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let t = 0; t < r.length; t++) {
        const o = r[t].getAttribute("data-ln-table-row-id"), n = r[t].querySelector("[data-ln-table-row-select]");
        o != null && (i ? (e.selectedIds.add(o), r[t].classList.add("ln-row-selected")) : (e.selectedIds.delete(o), r[t].classList.remove("ln-row-selected")), n && (n.checked = i));
      }
      e.selectedCount = e.selectedIds.size, S(e.dom, "ln-table:select-all", {
        table: e.name,
        selected: i
      }), S(e.dom, "ln-table:select", {
        table: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedCount
      }), e._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const i = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let r = 0; r < i.length; r++) {
        const t = i[r].querySelector("[data-ln-table-row-select]"), o = i[r].getAttribute("data-ln-table-row-id");
        t && t.checked && o != null && (this.selectedIds.add(o), i[r].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, a.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const e = this.dom.querySelector("[data-ln-table-col-select]");
    if (e) {
      const i = e.querySelector('input[type="checkbox"]');
      i && i.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const i = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let r = 0; r < i.length; r++) {
        i[r].classList.remove("ln-row-selected");
        const t = i[r].querySelector("[data-ln-table-row-select]");
        t && (t.checked = !1);
      }
    }
    this._updateFooter();
  }, a.prototype._updateFooter = function() {
    let e = 0, i = 0;
    this.isDataDriven ? (e = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount) : (e = this._data.length, i = this._filteredData.length);
    const r = i < e;
    if (this._totalSpan && (this._totalSpan.textContent = p(e, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = r ? p(i, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !r), this._selectedSpan) {
      const t = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = t > 0 ? p(t, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", t === 0);
    }
  }, a.prototype._focusRow = function(e) {
    for (let i = 0; i < e.length; i++)
      e[i].classList.remove("ln-row-focused"), e[i].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < e.length) {
      const i = e[this._focusedRowIndex];
      i.classList.add("ln-row-focused"), i.setAttribute("tabindex", "0"), i.focus(), i.scrollIntoView({ block: "nearest" });
    }
  }, a.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, U(h, d, a, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(e, i) {
      const r = e[d];
      if (!(!r || !r.isDataDriven)) {
        if (i === "data-ln-table-window") {
          const t = e.hasAttribute("data-ln-table-window");
          if (t && !r._windowed)
            r._enterWindowedMode(), r._kickWindowInitial();
          else if (!t && r._windowed)
            r._exitWindowedMode();
          else if (t && r._windowed) {
            const o = parseInt(e.getAttribute("data-ln-table-window"), 10);
            o > 0 && r._cache.configure({ windowSize: o });
          }
          return;
        }
        if (!(!r._windowed || !r._cache)) {
          if (i === "data-ln-table-window-page") {
            const t = parseInt(e.getAttribute("data-ln-table-window-page"), 10);
            t > 0 && r._cache.configure({ pageSize: t });
          } else if (i === "data-ln-table-window-threshold") {
            const t = parseInt(e.getAttribute("data-ln-table-window-threshold"), 10);
            t >= 0 && r._cache.configure({ threshold: t });
          } else if (i === "data-ln-table-count") {
            const t = parseInt(e.getAttribute("data-ln-table-count"), 10);
            t >= 0 && r._cache.setGrandTotal(t);
          }
        }
      }
    }
  });
})();
(function() {
  const h = "data-ln-list", d = "lnList", E = "data-ln-list-empty";
  if (window[d] !== void 0) return;
  function f(a, e) {
    if (a == null || isNaN(a)) return "";
    try {
      return new Intl.NumberFormat(V(e)).format(a);
    } catch {
      return String(a);
    }
  }
  function u(a) {
    let e = a;
    for (; e && e !== document.body && e !== document.documentElement; ) {
      const r = getComputedStyle(e).overflowY;
      if (r === "auto" || r === "scroll") return e;
      e = e.parentElement;
    }
    return null;
  }
  function p(a) {
    if (!a) return 0;
    const e = getComputedStyle(a), i = parseFloat(e.marginTop) || 0, r = parseFloat(e.marginBottom) || 0;
    return a.offsetHeight + i + r;
  }
  function s(a) {
    this.dom = a, this.tbody = a.querySelector("[data-ln-list-body]") || a, this.isDataDriven = a.hasAttribute("data-ln-list-source"), this.name = a.getAttribute(h) || "", this.source = a.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const e = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._windowed = !1, this._cache = null, this.isDataDriven && a.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = a.querySelector("[data-ln-list-total]"), this._filteredSpan = a.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== a ? this._filteredSpan.parentElement : null), this._selectedSpan = a.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== a ? this._selectedSpan.parentElement : null), this._onSetData = function(i) {
      const r = i.detail || {};
      if (e._windowed) {
        a.classList.remove("ln-list--loading"), e._cache.ingest(r);
        return;
      }
      e._data = r.data || [], e._lastTotal = r.total != null ? r.total : e._data.length, e._lastFiltered = r.filtered != null ? r.filtered : e._data.length, e.totalCount = e._lastTotal, e.visibleCount = e._lastFiltered, e.isLoaded = !0, a.classList.remove("ln-list--loading"), e._vStart = -1, e._vEnd = -1, e._applyFilterAndSort(), e._render(), e._updateFooter(), S(a, "ln-list:rendered", {
        list: e.name,
        total: e.totalCount,
        visible: e.visibleCount
      });
    }, a.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(i) {
      const r = i.detail && i.detail.loading;
      a.classList.toggle("ln-list--loading", !!r), r && (e.isLoaded = !1);
    }, a.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(i) {
      i.target.closest("[data-ln-list-clear-all]") && (e.currentFilters = {}, S(a, "ln-list:clear-filters", { list: e.name }), e._requestData());
    }, a.addEventListener("click", this._onClearAll), this._selectable = a.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onItemClick = function(i) {
      if (i.target.closest("[data-ln-item-select]") || i.target.closest("[data-ln-item-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const r = i.target.closest("[data-ln-item]");
      if (!r) return;
      const t = r.getAttribute("data-ln-item-id"), o = r._lnRecord || {};
      S(a, "ln-list:item-click", {
        list: e.name,
        id: t,
        record: o
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(i) {
      const r = i.target.closest("[data-ln-item-action]");
      if (!r) return;
      i.stopPropagation();
      const t = r.closest("[data-ln-item]");
      if (!t) return;
      const o = r.getAttribute("data-ln-item-action"), n = t.getAttribute("data-ln-item-id"), g = t._lnRecord || {};
      S(a, "ln-list:item-action", {
        list: e.name,
        id: n,
        action: o,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(i) {
      i.preventDefault(), e.currentSearch = i.detail && i.detail.term || "", S(a, "ln-list:search", {
        list: e.name,
        query: e.currentSearch
      }), e._requestData();
    }, a.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : S(a, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      e.tbody.children.length > 0 && (e._emptyObserver.disconnect(), e._emptyObserver = null, e._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(i) {
      i.preventDefault(), e._searchTerm = i.detail && i.detail.term || "", e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), S(a, "ln-list:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, a.addEventListener("ln-search:change", this._onSearch)), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-list-clear]") || G(a, "ln-list:before-clear-search", { list: e.name }).defaultPrevented) return;
      e.isDataDriven ? e.currentSearch = "" : e._searchTerm = "";
      const o = document.querySelector('[data-ln-search="' + a.id + '"]');
      if (o) {
        const n = o.tagName === "INPUT" ? o : o.querySelector("input");
        n && (n.value = "", n.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
      e.isDataDriven ? (S(a, "ln-list:search", {
        list: e.name,
        query: ""
      }), e._requestData()) : (e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), S(a, "ln-list:filter", {
        term: "",
        matched: e._filteredData.length,
        total: e._data.length
      }));
    }, a.addEventListener("click", this._onClear), this;
  }
  s.prototype._parseChildren = function() {
    const a = Array.from(this.tbody.children).filter((e) => !e.classList.contains("ln-list__spacer"));
    this._data = [], a.length > 0 && (this._itemHeight = p(a[0]) || 50);
    for (let e = 0; e < a.length; e++) {
      const i = a[e], r = i.getAttribute("data-ln-item-id") || i.getAttribute("id"), t = i.textContent.trim().toLowerCase();
      let o = null;
      if (this.isDataDriven) {
        o = {}, r != null && (o.id = r);
        const n = i.querySelectorAll("[data-ln-list-field]");
        for (let g = 0; g < n.length; g++) {
          const c = n[g], y = c.getAttribute("data-ln-list-field");
          y && (o[y] = c.textContent.trim());
        }
      }
      this._data.push({
        html: i.outerHTML,
        searchText: t,
        id: r,
        ...o
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, s.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const a = (this.currentSearch || "").trim().toLowerCase(), e = this.currentFilters || {}, i = Object.keys(e).length > 0;
      if (this._filteredData = this._data.filter(function(n) {
        if (a) {
          let g = !1;
          for (const c in n)
            if (n.hasOwnProperty(c) && typeof n[c] == "string" && c !== "html" && c !== "searchText" && n[c].toLowerCase().indexOf(a) !== -1) {
              g = !0;
              break;
            }
          if (!g) return !1;
        }
        if (i)
          for (const g in e) {
            const c = e[g];
            if (c && c.length > 0) {
              const y = n[g], w = y != null ? String(y) : "";
              if (c.indexOf(w) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const r = this.currentSort.field, t = this.currentSort.direction === "desc" ? -1 : 1, o = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(n, g) {
        return n < g ? -1 : n > g ? 1 : 0;
      };
      this._filteredData.sort(function(n, g) {
        const c = n[r], y = g[r];
        if (typeof c == "number" && typeof y == "number")
          return (c - y) * t;
        const w = c != null ? String(c) : "", A = y != null ? String(y) : "";
        return o(w, A) * t;
      });
    } else {
      const a = this._searchTerm;
      a ? this._filteredData = this._data.filter(function(e) {
        return e.searchText.indexOf(a) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, s.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const a = this._lastTotal, e = this.visibleCount;
        if (a === 0 || this._filteredData.length === 0 || e === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const a = this._filteredData.length;
        a === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : a > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, s.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const a = this._filteredData, e = document.createDocumentFragment();
      for (let i = 0; i < a.length; i++) {
        const r = this._buildItem(a[i]);
        if (!r) break;
        e.appendChild(r);
      }
      this.tbody.textContent = "", this.tbody.appendChild(e), this._selectable && this._updateSelectAll();
    } else {
      const a = [], e = this._filteredData;
      for (let i = 0; i < e.length; i++) a.push(e[i].html);
      this.tbody.innerHTML = a.join("");
    }
  }, s.prototype._readGridLayout = function() {
    const a = getComputedStyle(this.tbody), e = a.gridTemplateColumns;
    let i = 1;
    if (e && e !== "none") {
      const t = e.trim().split(/\s+/).filter(Boolean);
      t.length > 0 && (i = t.length);
    }
    const r = parseFloat(a.rowGap);
    return { columns: i, rowGap: isNaN(r) ? 0 : r };
  }, s.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const a = this._cache.peek(), e = a ? this._buildItem(a) : this._buildPlaceholderItem();
      e && (this.tbody.textContent = "", this.tbody.appendChild(e), this._itemHeight = p(e) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const a = this._buildItem(this._data[0]);
        a && (this.tbody.textContent = "", this.tbody.appendChild(a), this._itemHeight = p(a) || 50, this.tbody.textContent = "");
      }
    } else {
      const a = this.tbody.children;
      a.length > 0 && (this._itemHeight = p(a[0]) || 50);
    }
  }, s.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const a = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = u(this.dom);
    const e = this._scrollContainer || window;
    this._scrollHandler = function() {
      a._rafId || (a._rafId = requestAnimationFrame(function() {
        a._rafId = null, a._windowed ? a._renderWindowed() : a._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      a._itemHeight = 0, a._measureItemHeight(), a._vStart = -1, a._vEnd = -1, a._windowed ? a._renderWindowed() : a._renderVirtual();
    }, e.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const a = this._filteredData, e = a.length, i = this._itemHeight;
    if (!i || !e) return;
    const r = this._scrollContainer;
    let t, o;
    if (r) {
      const O = this.tbody.getBoundingClientRect(), B = r.getBoundingClientRect(), j = r === this.tbody ? 0 : O.top - B.top + r.scrollTop;
      t = r.scrollTop - j, o = r.clientHeight;
    } else {
      const B = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - B, o = window.innerHeight;
    }
    const n = this._readGridLayout(), g = n.columns, c = n.rowGap, y = i + c, w = Math.ceil(e / g);
    let A = Math.max(0, Math.floor(t / y) - 15);
    A = Math.min(A, w);
    const L = Math.ceil(o / y) + 30, C = Math.min(A + L, w), x = Math.min(A * g, e), D = Math.min(C * g, e);
    if (x === this._vStart && D === this._vEnd) return;
    this._vStart = x, this._vEnd = D;
    const q = A * y, N = (w - C) * y;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (q > 0) {
        const B = document.createElement(this.isUl ? "li" : "div");
        B.className = "ln-list__spacer", B.style.height = q + "px", O.appendChild(B);
      }
      for (let B = x; B < D; B++) {
        const j = this._buildItem(a[B]);
        j && O.appendChild(j);
      }
      if (N > 0) {
        const B = document.createElement(this.isUl ? "li" : "div");
        B.className = "ln-list__spacer", B.style.height = N + "px", O.appendChild(B);
      }
      this.tbody.textContent = "", this.tbody.appendChild(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      q > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${q}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let B = x; B < D; B++)
        O += a[B].html;
      N > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${N}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = O;
    }
  }, s.prototype._buildPlaceholderItem = function() {
    const a = document.createElement(this.isUl ? "li" : "div");
    return a.className = "ln-list__placeholder", a.setAttribute("aria-hidden", "true"), a.style.height = this._itemHeight + "px", a;
  }, s.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const a = this._itemHeight;
    if (!a) return;
    const e = this._scrollContainer;
    let i, r;
    if (e) {
      const O = this.tbody.getBoundingClientRect(), B = e.getBoundingClientRect(), j = e === this.tbody ? 0 : O.top - B.top + e.scrollTop;
      i = e.scrollTop - j, r = e.clientHeight;
    } else {
      const B = this.tbody.getBoundingClientRect().top + window.scrollY;
      i = window.scrollY - B, r = window.innerHeight;
    }
    const t = this._readGridLayout(), o = t.columns, n = t.rowGap, g = a + n, c = this._cache.logicalTotal, y = Math.ceil(c / o);
    let w = Math.max(0, Math.floor(i / g) - 15);
    w = Math.min(w, y);
    const A = Math.ceil(r / g) + 30, L = Math.min(w + A, y), C = Math.min(w * o, c), x = Math.min(L * o, c), D = w * g, q = (y - L) * g, N = document.createDocumentFragment();
    if (D > 0) {
      const O = document.createElement(this.isUl ? "li" : "div");
      O.className = "ln-list__spacer", O.style.height = D + "px", N.appendChild(O);
    }
    for (let O = C; O < x; O++)
      if (this._cache.has(O)) {
        const B = this._buildItem(this._cache.get(O));
        B && N.appendChild(B);
      } else
        N.appendChild(this._buildPlaceholderItem());
    if (q > 0) {
      const O = document.createElement(this.isUl ? "li" : "div");
      O.className = "ln-list__spacer", O.style.height = q + "px", N.appendChild(O);
    }
    this.tbody.textContent = "", this.tbody.appendChild(N), this._vStart = C, this._vEnd = x, this._cache.ensure(C, x);
  }, s.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let a = null;
    if (this.isDataDriven) {
      const e = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount, r = this.currentSearch && (i < e || i === 0), t = r ? this.name + "-empty-filtered" : this.name + "-empty";
      if (a = ct(this.dom, t, "ln-list"), !a) {
        const o = this.dom.querySelector("template[data-ln-empty]");
        if (o) {
          const n = r ? "search" : "initial", g = o.content.querySelector(`[data-ln-empty-when="${n}"]`) || o.content.firstElementChild;
          g && (a = document.importNode(g, !0));
        }
      }
    } else {
      const e = this.dom.querySelector(`template[${E}]`);
      e && (a = document.importNode(e.content, !0));
    }
    if (a)
      if (a.tagName === "LI" || a.tagName === "TR")
        this.tbody.appendChild(a);
      else {
        const e = document.createElement(this.isUl ? "li" : "div");
        e.appendChild(a), this.tbody.appendChild(e);
      }
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, s.prototype._buildItem = function(a) {
    const e = ct(this.dom, this.name + "-row", "ln-list");
    if (!e) return null;
    const i = e.querySelector("[data-ln-item]") || e.firstElementChild;
    if (!i) return null;
    if (gt(i, a), Q(i, a), i._lnRecord = a, a.id != null && (i.setAttribute("data-ln-item-id", a.id), this._selectable && this.selectedIds.has(String(a.id)))) {
      i.classList.add("ln-item-selected");
      const r = i.querySelector("[data-ln-item-select]");
      r && (r.checked = !0);
    }
    return i;
  }, s.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const a = this;
    this._onSelectionChange = function(e) {
      const i = e.target.closest("[data-ln-item-select]");
      if (!i) return;
      const r = i.closest("[data-ln-item]");
      if (!r) return;
      const t = r.getAttribute("data-ln-item-id");
      t != null && (i.checked ? (a.selectedIds.add(String(t)), r.classList.add("ln-item-selected")) : (a.selectedIds.delete(String(t)), r.classList.remove("ln-item-selected")), a._updateSelectAll(), a._updateFooter(), S(a.dom, "ln-list:select", {
        list: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const e = a._selectAllCheckbox.checked, i = a.tbody.querySelectorAll("[data-ln-item]");
      for (let r = 0; r < i.length; r++) {
        const t = i[r], o = t.getAttribute("data-ln-item-id"), n = t.querySelector("[data-ln-item-select]");
        o != null && (e ? (a.selectedIds.add(String(o)), t.classList.add("ln-item-selected")) : (a.selectedIds.delete(String(o)), t.classList.remove("ln-item-selected")), n && (n.checked = e));
      }
      S(a.dom, "ln-list:select-all", { list: a.name, selected: e }), S(a.dom, "ln-list:select", {
        list: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedIds.size
      }), a._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, s.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const a = this.tbody.querySelectorAll("[data-ln-item]");
    let e = a.length > 0;
    for (let i = 0; i < a.length; i++) {
      const r = a[i].getAttribute("data-ln-item-id");
      if (r != null && !this.selectedIds.has(String(r))) {
        e = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = e;
  }, s.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Wt(this, "ln-list:request-data", "list");
  }, s.prototype._enterWindowedMode = function() {
    const a = this, e = this.dom, i = parseInt(e.getAttribute("data-ln-list-window"), 10), r = parseInt(e.getAttribute("data-ln-list-window-page"), 10), t = parseInt(e.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !a._windowed || !a._cache || (a.totalCount = a._cache.grandTotal, a.visibleCount = a._cache.logicalTotal, a._lastTotal = a._cache.grandTotal, a.isLoaded = !0, a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), S(e, "ln-list:rendered", {
        list: a.name,
        total: a.totalCount,
        visible: a.visibleCount
      }));
    }, this._renderBatch = Mt(this._onCacheChange), this._cache = te({
      windowSize: i > 0 ? i : 1e3,
      pageSize: r > 0 ? r : 200,
      threshold: t >= 0 ? t : 25,
      fetchDebounce: 120,
      requestPage: function(o, n, g) {
        S(e, "ln-list:request-data", {
          list: a.name,
          sort: o.sort,
          filters: o.filters,
          search: o.search,
          offset: n,
          limit: g,
          queryGen: a._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, s.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const a = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), e = a > 0 ? a : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: e,
        filtered: e
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
    let a = 0, e = 0;
    this.isDataDriven ? (a = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount) : (a = this._data.length, e = this._filteredData.length);
    const i = e < a;
    if (this._totalSpan && (this._totalSpan.textContent = f(a, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = i ? f(e, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const r = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = r > 0 ? f(r, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch)), this._onClear && this.dom.removeEventListener("click", this._onClear), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, U(h, d, s, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(a, e) {
      const i = a[d];
      if (!(!i || !i.isDataDriven)) {
        if (e === "data-ln-list-window") {
          const r = a.hasAttribute("data-ln-list-window");
          if (r && !i._windowed)
            i._enterWindowedMode(), i._kickWindowInitial();
          else if (!r && i._windowed)
            i._exitWindowedMode();
          else if (r && i._windowed) {
            const t = parseInt(a.getAttribute("data-ln-list-window"), 10);
            t > 0 && i._cache.configure({ windowSize: t });
          }
          return;
        }
        if (!(!i._windowed || !i._cache)) {
          if (e === "data-ln-list-window-page") {
            const r = parseInt(a.getAttribute("data-ln-list-window-page"), 10);
            r > 0 && i._cache.configure({ pageSize: r });
          } else if (e === "data-ln-list-window-threshold") {
            const r = parseInt(a.getAttribute("data-ln-list-window-threshold"), 10);
            r >= 0 && i._cache.configure({ threshold: r });
          } else if (e === "data-ln-list-count") {
            const r = parseInt(a.getAttribute("data-ln-list-count"), 10);
            r >= 0 && i._cache.setGrandTotal(r);
          }
        }
      }
    }
  });
})();
(function() {
  const h = "data-ln-circular-progress", d = "lnCircularProgress";
  if (window[d] !== void 0) return;
  const E = "http://www.w3.org/2000/svg", v = 36, b = 16, m = 2 * Math.PI * b;
  function _(s) {
    return this.dom = s, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, f.call(this), p.call(this), u.call(this), s.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  _.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[d]);
  };
  function l(s, a) {
    const e = document.createElementNS(E, s);
    for (const i in a)
      e.setAttribute(i, a[i]);
    return e;
  }
  function f() {
    this.svg = l("svg", {
      viewBox: "0 0 " + v + " " + v,
      "aria-hidden": "true"
    }), this.trackCircle = l("circle", {
      cx: v / 2,
      cy: v / 2,
      r: b,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = l("circle", {
      cx: v / 2,
      cy: v / 2,
      r: b,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + v / 2 + " " + v / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function u() {
    const s = this, a = new MutationObserver(function(e) {
      for (const i of e)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max" || i.attributeName === "data-ln-circular-progress-label") && p.call(s);
    });
    a.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = a;
  }
  function p() {
    const s = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, a = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let e = a > 0 ? s / a * 100 : 0;
    e < 0 && (e = 0), e > 100 && (e = 100);
    const i = m - e / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), t = r !== null ? r : Math.round(e) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(a));
    const o = Math.max(0, Math.min(s, a));
    this.dom.setAttribute("aria-valuenow", String(o)), this.dom.setAttribute("aria-valuetext", t), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: s,
      max: a,
      percentage: e
    });
  }
  U(h, d, _, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", d = "lnSortable", E = "data-ln-sortable-handle";
  if (window[d] !== void 0) return;
  function v(m) {
    this.dom = m, this.isEnabled = m.getAttribute(h) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const _ = this;
    return this._onPointerDown = function(l) {
      _.isEnabled && _._handlePointerDown(l);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  v.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, v.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, v.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[d]);
  }, v.prototype._handlePointerDown = function(m) {
    let _ = m.target.closest("[" + E + "]"), l;
    if (_) {
      for (l = _; l && l.parentElement !== this.dom; )
        l = l.parentElement;
      if (!l || l.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + E + "]")) return;
      for (l = m.target; l && l.parentElement !== this.dom; )
        l = l.parentElement;
      if (!l || l.parentElement !== this.dom) return;
      _ = l;
    }
    const u = Array.from(this.dom.children).indexOf(l);
    if (G(this.dom, "ln-sortable:before-drag", {
      item: l,
      index: u
    }).defaultPrevented) return;
    m.preventDefault(), _.setPointerCapture(m.pointerId), this._dragging = l, l.classList.add("ln-sortable--dragging"), l.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: l,
      index: u
    });
    const s = this, a = function(i) {
      s._handlePointerMove(i);
    }, e = function(i) {
      s._handlePointerEnd(i), _.removeEventListener("pointermove", a), _.removeEventListener("pointerup", e), _.removeEventListener("pointercancel", e);
    };
    _.addEventListener("pointermove", a), _.addEventListener("pointerup", e), _.addEventListener("pointercancel", e);
  }, v.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const _ = Array.from(this.dom.children), l = this._dragging;
    for (const f of _)
      f.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const f of _) {
      if (f === l) continue;
      const u = f.getBoundingClientRect(), p = u.top + u.height / 2;
      if (m.clientY >= u.top && m.clientY < p) {
        f.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= p && m.clientY <= u.bottom) {
        f.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, v.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const _ = this._dragging, l = Array.from(this.dom.children), f = l.indexOf(_);
    let u = null, p = null;
    for (const s of l) {
      if (s.classList.contains("ln-sortable--drop-before")) {
        u = s, p = "before";
        break;
      }
      if (s.classList.contains("ln-sortable--drop-after")) {
        u = s, p = "after";
        break;
      }
    }
    for (const s of l)
      s.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (_.classList.remove("ln-sortable--dragging"), _.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), u && u !== _) {
      p === "before" ? this.dom.insertBefore(_, u) : this.dom.insertBefore(_, u.nextElementSibling);
      const a = Array.from(this.dom.children).indexOf(_);
      S(this.dom, "ln-sortable:reordered", {
        item: _,
        oldIndex: f,
        newIndex: a
      });
    }
    this._dragging = null;
  };
  function b(m) {
    const _ = m[d];
    if (!_) return;
    const l = m.getAttribute(h) !== "disabled";
    l !== _.isEnabled && (_.isEnabled = l, S(m, l ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  U(h, d, v, "ln-sortable", {
    onAttributeChange: b
  });
})();
(function() {
  const h = "data-ln-confirm", d = "lnConfirm", E = "data-ln-confirm-timeout";
  if (window[d] !== void 0) return;
  function b(..._) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ..._);
  }
  function m(_) {
    b("constructor called on", _), this.dom = _, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = _.querySelector("[data-ln-confirm-idle]"), this.activeEl = _.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = _.textContent.trim(), this.confirmText = _.getAttribute(h) || "Confirm?");
    const l = this;
    return this._onClick = function(f) {
      if (b("click handler, confirming:", l.confirming, "submitted:", l._submitted, "target:", f.target), !l.confirming)
        f.preventDefault(), f.stopImmediatePropagation(), l._enterConfirm();
      else {
        if (l._submitted) return;
        l._submitted = !0, l._reset();
      }
    }, _.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const _ = parseFloat(this.dom.getAttribute(E));
    return isNaN(_) || _ <= 0 ? 3 : _;
  }, m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden"), this.originalAriaLabel = this.dom.getAttribute("aria-label");
      const l = this.activeEl ? this.activeEl.textContent.trim() : "";
      l && (this.dom.setAttribute("aria-label", l), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = l, this.dom.appendChild(this.alertNode));
    } else {
      var _ = this.dom.querySelector("svg.ln-icon use");
      _ && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = _.getAttribute("href"), _.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const _ = this, l = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      _._reset();
    }, l);
  }, m.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null;
    else if (this.isIconButton) {
      var _ = this.dom.querySelector("svg.ln-icon use");
      _ && this.originalIconHref && _.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    b("destroy called on", this.dom), this.dom[d] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[d]);
  }, U(h, d, m, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", d = "lnTranslations";
  if (window[d] !== void 0) return;
  const E = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function v(b) {
    this.dom = b, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = b.getAttribute(h + "-default") || "", this.placeholderLabel = b.getAttribute(h + "-placeholder") || "{lang} translation", this.removeLabel = b.getAttribute(h + "-remove-label") || "Remove {lang}", this.badgesEl = b.querySelector("[" + h + "-active]"), this.menuEl = b.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = b.getAttribute(h + "-locales");
    if (this.locales = E, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const _ = this;
    return this._onRequestAdd = function(l) {
      l.detail && l.detail.lang && _.addLanguage(l.detail.lang);
    }, this._onRequestRemove = function(l) {
      l.detail && l.detail.lang && _.removeLanguage(l.detail.lang);
    }, b.addEventListener("ln-translations:request-add", this._onRequestAdd), b.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  v.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const b = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of b) {
      const _ = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const l of _)
        l.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, v.prototype._detectExisting = function() {
    const b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of b) {
      const _ = m.getAttribute("data-ln-translatable-lang");
      _ && _ !== this.defaultLang && this.activeLanguages.add(_);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, v.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const b = this;
    let m = 0;
    for (const l in this.locales) {
      if (!this.locales.hasOwnProperty(l) || this.activeLanguages.has(l)) continue;
      m++;
      const f = wt("ln-translations-menu-item", "ln-translations");
      if (!f) return;
      const u = f.querySelector("[data-ln-translations-lang]");
      u.setAttribute("data-ln-translations-lang", l), u.textContent = this.locales[l], u.addEventListener("click", function(p) {
        p.ctrlKey || p.metaKey || p.button === 1 || (p.preventDefault(), p.stopPropagation(), b.menuEl.getAttribute("data-ln-toggle") === "open" && b.menuEl.setAttribute("data-ln-toggle", "close"), b.addLanguage(l));
      }), this.menuEl.appendChild(f);
    }
    const _ = this.dom.querySelector("[" + h + "-add]");
    _ && (_.hidden = m === 0);
  }, v.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const b = this;
    this.activeLanguages.forEach(function(m) {
      const _ = wt("ln-translations-badge", "ln-translations");
      if (!_) return;
      const l = _.querySelector("[data-ln-translations-lang]");
      l.setAttribute("data-ln-translations-lang", m);
      const f = l.querySelector("span");
      f.textContent = b.locales[m] || m.toUpperCase();
      const u = l.querySelector("button"), p = b.locales[m] || m.toUpperCase();
      u.setAttribute("aria-label", b.removeLabel.replace("{lang}", p)), u.addEventListener("click", function(s) {
        s.ctrlKey || s.metaKey || s.button === 1 || (s.preventDefault(), s.stopPropagation(), b.removeLanguage(m));
      }), b.badgesEl.appendChild(_);
    });
  }, v.prototype.addLanguage = function(b, m) {
    if (this.activeLanguages.has(b)) return;
    const _ = this.locales[b] || b;
    if (G(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: b,
      langName: _
    }).defaultPrevented) return;
    this.activeLanguages.add(b), m = m || {};
    const f = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const u of f) {
      const p = u.getAttribute("data-ln-translatable"), s = u.getAttribute("data-ln-translations-prefix") || "", a = u.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!a) continue;
      const e = a.cloneNode(a.tagName === "SELECT");
      s ? e.name = s + "[trans][" + b + "][" + p + "]" : e.name = "trans[" + b + "][" + p + "]", e.value = m[p] !== void 0 ? m[p] : "", e.removeAttribute("id"), "placeholder" in e && (e.placeholder = this.placeholderLabel.replace("{lang}", _)), e.setAttribute("data-ln-translatable-lang", b);
      const i = u.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = i.length > 0 ? i[i.length - 1] : a;
      r.parentNode.insertBefore(e, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: b,
      langName: _
    });
  }, v.prototype.removeLanguage = function(b) {
    if (!this.activeLanguages.has(b) || G(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: b
    }).defaultPrevented) return;
    const _ = this.dom.querySelectorAll('[data-ln-translatable-lang="' + b + '"]');
    for (const l of _)
      l.parentNode.removeChild(l);
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
    const b = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const _ of m)
      _.getAttribute("data-ln-translatable-lang") !== b && _.parentNode.removeChild(_);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[d];
  }, U(h, d, v, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", d = "lnAutosave", E = "data-ln-autosave-clear", v = "data-ln-autosave-debounce-input", b = "ln-autosave:";
  if (window[d] !== void 0) return;
  function _(p) {
    const s = l(p);
    if (!s) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", p);
      return;
    }
    this.dom = p, this.key = s;
    let a = null;
    function e() {
      const o = Gt(p, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(s, JSON.stringify(o));
      } catch {
        return;
      }
      S(p, "ln-autosave:saved", { target: p, data: o });
    }
    function i() {
      let o;
      try {
        o = localStorage.getItem(s);
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
      if (G(p, "ln-autosave:before-restore", { target: p, data: n }).defaultPrevented) return;
      const c = $t(p, n);
      for (let y = 0; y < c.length; y++)
        c[y].dispatchEvent(new Event("input", { bubbles: !0 })), c[y].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(p, "ln-autosave:restored", { target: p, data: n });
    }
    function r() {
      try {
        localStorage.removeItem(s);
      } catch {
        return;
      }
      S(p, "ln-autosave:cleared", { target: p });
    }
    this._onFocusout = function(o) {
      const n = o.target;
      f(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && e();
    }, this._onChange = function(o) {
      const n = o.target;
      f(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && e();
    }, this._onSubmit = function() {
      r();
    }, this._onReset = function() {
      r();
    }, this._onClearClick = function(o) {
      o.target.closest("[" + E + "]") && r();
    }, p.addEventListener("focusout", this._onFocusout), p.addEventListener("change", this._onChange), p.addEventListener("submit", this._onSubmit), p.addEventListener("reset", this._onReset), p.addEventListener("click", this._onClearClick);
    const t = u(p);
    return t > 0 && (this._onInput = function(o) {
      const n = o.target;
      !f(n) || !n.name || n.hasAttribute("data-ln-autosave-exclude") || (a !== null && clearTimeout(a), a = setTimeout(e, t));
    }, p.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return a;
    }, i(), this;
  }
  _.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const p = this._getInputTimer();
        p !== null && clearTimeout(p);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function l(p) {
    const a = p.getAttribute(h) || p.id;
    return a ? b + window.location.pathname + ":" + a : null;
  }
  function f(p) {
    const s = p.tagName;
    return s === "INPUT" || s === "TEXTAREA" || s === "SELECT";
  }
  function u(p) {
    if (!p.hasAttribute(v)) return 0;
    const s = p.getAttribute(v);
    if (s === "" || s === null) return 1e3;
    const a = parseInt(s, 10);
    return isNaN(a) || a < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", p), 1e3) : a;
  }
  U(h, d, _, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", d = "lnAutoresize";
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
  }, U(h, d, E, "ln-autoresize");
})();
(function() {
  const h = "data-ln-editor", d = "lnEditor";
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
  }, m = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let _ = 0;
  function l(t) {
    return !!(v[t] || b[t] || m[t] || t === "link");
  }
  function f(t) {
    this.dom = t;
    const o = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const n = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), n && this._surface.setAttribute("data-placeholder", n);
    const g = this._textarea.id;
    if (g) {
      const A = t.querySelector('label[for="' + g + '"]');
      A && (A.id || (A.id = g + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = g ? g + "-surface" : "ln-editor-surface-" + ++_;
    const c = this._textarea.value.trim();
    c && (this._surface.innerHTML = c);
    const y = t.querySelector('[role="toolbar"]');
    if (y && y.nextSibling ? t.insertBefore(this._surface, y.nextSibling) : t.appendChild(this._surface), y) {
      y.setAttribute("aria-controls", this._surface.id);
      const A = y.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < A.length; L++) {
        const C = A[L].getAttribute("data-ln-editor-action");
        l(C) && A[L].setAttribute("aria-pressed", "false");
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
      s(o, A);
    }, this._onKeydown = function(A) {
      i(o, A);
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
  f.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, f.prototype._execAction = function(t) {
    if (!(!t || G(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), v[t])
        document.execCommand(v[t], !1, null);
      else if (b[t]) {
        const n = b[t], g = u(this._surface);
        g && g.toLowerCase() === n ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + n + ">");
      } else m[t] ? document.execCommand(m[t], !1, null) : t === "link" ? r(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, f.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const n = o.anchorNode;
    if (!n || !this._surface.contains(n)) return;
    const g = t.querySelectorAll("[data-ln-editor-action]");
    for (let c = 0; c < g.length; c++) {
      const y = g[c], w = y.getAttribute("data-ln-editor-action");
      let A = !1;
      if (v[w])
        try {
          A = document.queryCommandState(v[w]);
        } catch {
        }
      else if (b[w]) {
        const L = u(this._surface);
        A = L && L.toLowerCase() === b[w];
      } else if (m[w])
        try {
          A = document.queryCommandState(m[w]);
        } catch {
        }
      else w === "link" && (A = !!p(o.anchorNode, "A", this._surface));
      l(w) && y.setAttribute("aria-pressed", String(A)), A ? y.classList.add("ln-editor-active") : y.classList.remove("ln-editor-active");
    }
  }, f.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, f.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), S(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, f.prototype.destroy = function() {
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
        const g = n.tagName;
        if (g === "H2" || g === "H3" || g === "H4" || g === "BLOCKQUOTE" || g === "PRE" || g === "P")
          return g;
      }
      n = n.parentNode;
    }
    return null;
  }
  function p(t, o, n) {
    for (; t && t !== n; ) {
      if (t.nodeType === 1 && t.tagName === o)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function s(t, o) {
    o.preventDefault();
    let n = "";
    if (o.clipboardData && (n = o.clipboardData.getData("text/html"), !n)) {
      const c = o.clipboardData.getData("text/plain");
      c && (n = c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), n = "<p>" + n + "</p>");
    }
    if (!n) return;
    const g = a(n);
    g && document.execCommand("insertHTML", !1, g);
  }
  function a(t) {
    const o = document.createElement("div");
    return o.innerHTML = t, e(o), o.innerHTML;
  }
  function e(t) {
    const o = Array.from(t.childNodes);
    for (let n = 0; n < o.length; n++) {
      const g = o[n];
      if (g.nodeType !== 3) {
        if (g.nodeType !== 1) {
          t.removeChild(g);
          continue;
        }
        if (E[g.tagName]) {
          const c = Array.from(g.attributes);
          for (let y = 0; y < c.length; y++) {
            const w = c[y].name;
            if (g.tagName === "A" && w === "href") {
              const A = g.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || g.removeAttribute("href");
            } else
              g.removeAttribute(w);
          }
          g.tagName === "A" && g.setAttribute("rel", "noopener noreferrer"), e(g);
        } else {
          for (; g.firstChild; )
            t.insertBefore(g.firstChild, g);
          t.removeChild(g);
        }
      }
    }
  }
  function i(t, o) {
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
  function r(t) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const n = p(o.anchorNode, "A", t._surface), g = o.getRangeAt(0).cloneRange(), c = t.dom.querySelector(".ln-editor__link-popover");
    c && c.remove();
    const y = ct(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!y) return;
    const w = y.firstElementChild;
    if (!w) return;
    const A = w.querySelector('input[type="url"]'), L = w.querySelector('[data-ln-editor-action="confirm-link"]'), C = w.querySelector('[data-ln-editor-action="cancel-link"]');
    n && (A.value = n.getAttribute("href") || "");
    const x = t.dom.querySelector('[role="toolbar"]');
    x ? x.after(w) : t.dom.insertBefore(w, t._surface), A.focus();
    function D() {
      const O = window.getSelection();
      O.removeAllRanges(), O.addRange(g);
    }
    function q() {
      const O = A.value.trim();
      if (w.remove(), D(), t._surface.focus(), O)
        if (n)
          n.setAttribute("href", O), n.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), S(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, O);
          const B = window.getSelection();
          if (B && B.anchorNode) {
            const j = p(B.anchorNode, "A", t._surface);
            j && (j.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else n && document.execCommand("unlink", !1, null);
    }
    function N() {
      w.remove(), D(), t._surface.focus();
    }
    L.addEventListener("click", q), C.addEventListener("click", N), A.addEventListener("keydown", function(O) {
      O.key === "Enter" ? (O.preventDefault(), q()) : O.key === "Escape" && (O.preventDefault(), N());
    });
  }
  U(h, d, f, "ln-editor");
})();
(function() {
  const h = "lnFill";
  if (window[h] !== void 0) return;
  const d = { lnFillForm: !0, lnFillStore: !0 };
  function E(b) {
    const m = {}, _ = b.dataset;
    for (const l in _) {
      if (!l.startsWith("lnFill") || d[l]) continue;
      const f = l.slice(6);
      f && (m[f.charAt(0).toLowerCase() + f.slice(1)] = _[l]);
    }
    return m;
  }
  function v(b, m) {
    const _ = window.CSS && CSS.escape ? CSS.escape(m) : m, l = document.querySelectorAll('[data-ln-fill-id="' + _ + '"]');
    if (l.length === 0) return null;
    for (let f = 0; f < l.length; f++) {
      const u = l[f].getAttribute("data-ln-fill-form");
      if (u) {
        const p = document.getElementById(u);
        if (p && b.contains(p)) return l[f];
      }
    }
    return l[0];
  }
  document.addEventListener("click", function(b) {
    if (b.ctrlKey || b.metaKey || b.button === 1) return;
    const m = b.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const _ = m.getAttribute("href");
    if (_ && _.indexOf("#") !== -1) return;
    const l = m.getAttribute("data-ln-fill-form"), f = document.getElementById(l);
    if (!f) return;
    const u = E(m), p = Object.keys(u).length > 0;
    window.lnCore.lnFill(f, p ? u : null);
  }), document.addEventListener("ln-fill:request", function(b) {
    const m = b.detail;
    if (!m) return;
    const _ = b.target, l = m.id;
    if (l == null) {
      window.lnCore.lnFill(_, null);
      return;
    }
    const f = v(_, l);
    if (!f) return;
    const u = E(f);
    window.lnCore.lnFill(_, u);
  }), window[h] = !0;
})();
(function() {
  const h = "lnModalFill";
  window[h] === void 0 && (document.addEventListener("ln-modal:open", function(d) {
    const E = d.detail;
    if (!E || !("param" in E)) return;
    const v = E.target;
    v && v.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: E.param }
    }));
  }), window[h] = !0);
})();
(function() {
  const h = "data-ln-slug-from", d = "lnSlug";
  if (window[d] !== void 0) return;
  function E(b) {
    return String(b).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function v(b) {
    if (b.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", b.tagName), this;
    const m = b.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", b), this;
    const _ = b.getAttribute(h), l = m.elements[_];
    if (!l)
      return console.warn('[ln-slug] Source field "' + _ + '" not found in form:', b), this;
    if (typeof l.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + _ + '" is a RadioNodeList (same-name group) — single source field required:', b), this;
    this.dom = b, this.source = l, this._pristine = b.value === "", this._mirroring = !1;
    const f = this;
    return this._onSource = function() {
      f._pristine && f._mirror();
    }, this._onSlug = function() {
      f._mirroring || (f._pristine = f.dom.value === "");
    }, l.addEventListener("input", this._onSource), b.addEventListener("input", this._onSlug), this;
  }
  v.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = E(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, v.prototype.destroy = function() {
    this.dom[d] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[d]);
  }, U(h, d, v, "ln-slug");
})();
(function() {
  const h = "data-ln-time", d = "lnTime";
  if (window[d] !== void 0) return;
  const E = {}, v = {};
  function b(w) {
    return w.getAttribute("data-ln-time-locale") || V(w);
  }
  function m(w, A) {
    const L = (w || "") + "|" + JSON.stringify(A);
    return E[L] || (E[L] = new Intl.DateTimeFormat(w, A)), E[L];
  }
  function _(w) {
    const A = w || "";
    return v[A] || (v[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), v[A];
  }
  const l = /* @__PURE__ */ new Set();
  let f = null;
  function u() {
    f || (f = setInterval(s, 6e4));
  }
  function p() {
    f && (clearInterval(f), f = null);
  }
  function s() {
    for (const w of l) {
      if (!document.body.contains(w.dom)) {
        l.delete(w);
        continue;
      }
      o(w);
    }
    l.size === 0 && p();
  }
  function a(w, A) {
    const L = mt(A), C = (A || "").toLowerCase().split("-")[0], x = m(A, { dateStyle: "long", timeStyle: "short" }), D = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && D !== C && L.monthsLong) {
      const q = L.monthsLong[w.getMonth()], N = w.getDate(), O = w.getFullYear(), B = String(w.getHours()).padStart(2, "0"), j = String(w.getMinutes()).padStart(2, "0");
      return `${N} ${q} ${O} во ${B}:${j}`;
    }
    return x.format(w);
  }
  function e(w, A) {
    const L = /* @__PURE__ */ new Date(), C = { month: "short", day: "numeric" };
    w.getFullYear() !== L.getFullYear() && (C.year = "numeric");
    const x = mt(A), D = (A || "").toLowerCase().split("-")[0], q = m(A, C), N = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && N !== D && x.monthsShort) {
      const O = x.monthsShort[w.getMonth()], B = w.getDate(), j = w.getFullYear() !== L.getFullYear() ? " " + w.getFullYear() : "";
      return `${B} ${O}${j}`;
    }
    return q.format(w);
  }
  function i(w, A) {
    return m(A, { dateStyle: "medium" }).format(w);
  }
  function r(w, A) {
    return m(A, { timeStyle: "short" }).format(w);
  }
  function t(w, A) {
    const L = Math.floor(Date.now() / 1e3), x = Math.floor(w.getTime() / 1e3) - L, D = Math.abs(x);
    if (D < 10) return _(A).format(0, "second");
    let q, N;
    if (D < 60)
      q = "second", N = x;
    else if (D < 3600)
      q = "minute", N = Math.round(x / 60);
    else if (D < 86400)
      q = "hour", N = Math.round(x / 3600);
    else if (D < 604800)
      q = "day", N = Math.round(x / 86400);
    else if (D < 2592e3)
      q = "week", N = Math.round(x / 604800);
    else
      return e(w, A);
    return _(A).format(N, q);
  }
  function o(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const L = Number(A);
    if (isNaN(L)) return;
    const C = new Date(L * 1e3), x = w.dom.getAttribute(h) || "short", D = b(w.dom);
    let q;
    switch (x) {
      case "relative":
        q = t(C, D);
        break;
      case "full":
        q = a(C, D);
        break;
      case "date":
        q = i(C, D);
        break;
      case "time":
        q = r(C, D);
        break;
      default:
        q = e(C, D);
        break;
    }
    w.dom.textContent = q, x !== "full" && (w.dom.title = a(C, D));
  }
  function n(w) {
    return this.dom = w, o(this), w.getAttribute(h) === "relative" && (l.add(this), u()), this;
  }
  n.prototype.render = function() {
    o(this);
  }, n.prototype.destroy = function() {
    l.delete(this), l.size === 0 && p(), delete this.dom[d];
  };
  function g(w) {
    const A = w[d];
    if (!A) return;
    w.getAttribute(h) === "relative" ? (l.add(A), u()) : (l.delete(A), l.size === 0 && p()), o(A);
  }
  function c(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(h) && w[d] && o(w[d]);
  }
  function y() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + h + "]");
      for (let A = 0; A < w.length; A++) {
        const L = w[A][d];
        L && o(L);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  U(h, d, n, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: g,
    onInit: c
  }), y();
})();
(function() {
  const h = "data-ln-data-store", d = "lnDataStore";
  if (window[d] !== void 0) return;
  const E = "ln_app_cache", v = "_meta", b = "1.0";
  let m = null, _ = null;
  const l = {};
  function f(T) {
    T && T.name === "QuotaExceededError" && S(document, "ln-data-store:quota-exceeded", { error: T });
  }
  function u() {
    const T = {};
    for (const k of document.querySelectorAll(`[${h}]`)) {
      const I = k.getAttribute(h);
      if (I) {
        const M = k.getAttribute("data-ln-data-store-indexes") || "";
        T[I] = {
          indexes: M.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return T;
  }
  function p() {
    return _ || (_ = new Promise((T) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), T(null);
      const k = u(), I = Object.keys(k), M = indexedDB.open(E);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), T(null);
      }, M.onsuccess = (R) => {
        const H = R.target.result, F = Array.from(H.objectStoreNames);
        if (!(!F.includes(v) || I.some((pt) => !F.includes(pt))))
          return s(H), m = H, T(H);
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
              for (const Pt of k[Lt].indexes)
                he.createIndex(Pt, Pt, { unique: !1 });
            }
        }, X.onsuccess = (pt) => {
          const rt = pt.target.result;
          s(rt), m = rt, T(rt);
        };
      };
    }), _);
  }
  function s(T) {
    T.onversionchange = () => {
      T.close(), m = null, _ = null;
    };
  }
  function a() {
    return m ? Promise.resolve(m) : (_ = null, p());
  }
  async function e(T) {
    if (!ht() || !T) return T;
    const k = { ...T }, I = k.id, M = await we(k);
    return !M || !M.encrypted ? T : {
      id: I,
      encrypted: !0,
      iv: M.iv,
      data: M.data
    };
  }
  async function i(T) {
    return !T || !T.encrypted || !ht() ? T : Ee(T);
  }
  const r = (T, k) => a().then((I) => I ? I.transaction(T, k).objectStore(T) : null);
  function t(T) {
    return new Promise((k, I) => {
      T.onsuccess = () => k(T.result), T.onerror = () => {
        f(T.error), I(T.error);
      };
    });
  }
  const o = (T) => r(T, "readonly").then((k) => k ? t(k.getAll()) : []).then((k) => ht() ? Promise.all(k.map((I) => i(I))) : k), n = (T, k) => r(T, "readonly").then((I) => I ? t(I.get(k)) : null).then((I) => I ? i(I) : null), g = (T, k) => (ht() ? e(k) : Promise.resolve(k)).then((M) => r(T, "readwrite").then((R) => R ? t(R.put(M)) : null)), c = (T, k) => r(T, "readwrite").then((I) => I ? t(I.delete(k)) : null), y = (T) => r(T, "readwrite").then((k) => k ? t(k.clear()) : null), w = (T) => r(T, "readonly").then((k) => k ? t(k.count()) : 0), A = (T) => r(v, "readonly").then((k) => k ? t(k.get(T)) : null), L = (T, k) => r(v, "readwrite").then((I) => {
    if (I)
      return k.key = T, t(I.put(k));
  });
  function C(T) {
    this.dom = T, this._name = T.getAttribute(h);
    const k = T.getAttribute("data-ln-data-store-stale"), I = parseInt(k, 10);
    this._staleThreshold = k === "never" || k === "-1" ? -1 : isNaN(I) ? 300 : I;
    const M = T.getAttribute("data-ln-data-store-search-fields") || "";
    return this._searchFields = M.split(",").map((R) => R.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, l[this._name] = this, x(this), B(this), this;
  }
  function x(T) {
    T._handlers = {
      create: (k) => D(T, k.detail),
      update: (k) => q(T, k.detail),
      delete: (k) => N(T, k.detail),
      "bulk-delete": (k) => O(T, k.detail)
    };
    for (const [k, I] of Object.entries(T._handlers))
      T.dom.addEventListener(`ln-data-store:request-${k}`, I);
  }
  function D(T, { tempId: k, data: I = {} } = {}) {
    const M = { ...I, id: k };
    g(T._name, M).then(() => {
      T.totalCount++, S(T.dom, "ln-data-store:created", { store: T._name, record: M, tempId: k });
    });
  }
  function q(T, { id: k, data: I = {} } = {}) {
    n(T._name, k).then((M) => {
      if (!M) throw new Error(`Record not found: ${k}`);
      const R = { ...M, ...I }, H = I.id;
      return (H !== void 0 && H !== k ? bt(T._name, k, R) : g(T._name, R)).then(() => {
        S(T.dom, "ln-data-store:updated", { store: T._name, record: R, previous: M });
      });
    }).catch((M) => console.error("[ln-data-store] Optimistic update failed:", M));
  }
  function N(T, { id: k } = {}) {
    n(T._name, k).then((I) => {
      if (I)
        return c(T._name, k).then(() => {
          T.totalCount--, S(T.dom, "ln-data-store:deleted", { store: T._name, id: k });
        });
    }).catch((I) => console.error("[ln-data-store] Optimistic delete failed:", I));
  }
  function O(T, { ids: k = [] } = {}) {
    k.length && Promise.all(k.map((I) => n(T._name, I))).then((I) => {
      const M = I.filter(Boolean).map((R) => R.id);
      return Z(T._name, M).then(() => {
        T.totalCount -= M.length, S(T.dom, "ln-data-store:deleted", { store: T._name, ids: M });
      });
    }).catch((I) => console.error("[ln-data-store] Optimistic bulk delete failed:", I));
  }
  function B(T) {
    p().then(() => A(T._name)).then((k) => {
      k && k.schema_version === b ? (T.lastSyncedAt = k.last_synced_at || null, T.totalCount = k.record_count || 0, T.totalCount > 0 && (T.isLoaded = !0, S(T.dom, "ln-data-store:ready", { store: T._name, count: T.totalCount, source: "cache" })), S(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: T.totalCount > 0, lastSyncedAt: T.lastSyncedAt, count: T.totalCount })) : k && k.schema_version !== b ? y(T._name).then(() => L(T._name, { schema_version: b, last_synced_at: null, record_count: 0 })).then(() => S(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: !1, lastSyncedAt: null, count: 0 })) : S(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: !1, lastSyncedAt: null, count: 0 });
    });
  }
  function j(T) {
    T.isSyncing = !0, S(T.dom, "ln-data-store:request-remote-sync", { since: T.lastSyncedAt });
  }
  function ot(T, k) {
    return a().then((I) => I ? (ht() ? Promise.all(k.map((R) => e(R))) : Promise.resolve(k)).then((R) => new Promise((H, F) => {
      const z = I.transaction(T, "readwrite"), $ = z.objectStore(T);
      R.forEach((X) => $.put(X)), z.oncomplete = () => H(), z.onerror = () => {
        f(z.error), F(z.error);
      };
    })) : void 0);
  }
  function Z(T, k) {
    return a().then((I) => {
      if (I)
        return new Promise((M, R) => {
          const H = I.transaction(T, "readwrite"), F = H.objectStore(T);
          k.forEach((z) => F.delete(z)), H.oncomplete = () => M(), H.onerror = () => R(H.error);
        });
    });
  }
  function bt(T, k, I) {
    return (ht() ? e(I) : Promise.resolve(I)).then((R) => a().then((H) => {
      if (H)
        return new Promise((F, z) => {
          const $ = H.transaction(T, "readwrite"), X = $.objectStore(T);
          X.put(R), X.delete(k), $.oncomplete = () => F(), $.onerror = () => {
            f($.error), z($.error);
          };
        });
    }));
  }
  const yt = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function P(T, k) {
    if (!k || !k.field) return T;
    const { field: I, direction: M } = k, R = M === "desc";
    return [...T].sort((H, F) => {
      const z = H[I], $ = F[I];
      if (z == null && $ == null) return 0;
      if (z == null) return R ? 1 : -1;
      if ($ == null) return R ? -1 : 1;
      const X = typeof z == "string" && typeof $ == "string" ? yt.compare(z, $) : z < $ ? -1 : z > $ ? 1 : 0;
      return R ? -X : X;
    });
  }
  function K(T, k) {
    if (!k) return T;
    const I = Object.keys(k).filter((M) => Array.isArray(k[M]) && k[M].length > 0);
    return I.length ? T.filter(
      (M) => I.every((R) => k[R].map(String).includes(String(M[R])))
    ) : T;
  }
  function W(T, k, I) {
    if (!k || !I || !I.length) return T;
    const M = k.toLowerCase();
    return T.filter(
      (R) => I.some((H) => {
        const F = R[H];
        return F != null && String(F).toLowerCase().includes(M);
      })
    );
  }
  function ft(T, k, I) {
    if (!T.length) return 0;
    if (I === "count") return T.length;
    const M = T.map((H) => parseFloat(H[k])).filter((H) => !isNaN(H)), R = M.reduce((H, F) => H + F, 0);
    return I === "sum" ? R : I === "avg" && M.length ? R / M.length : 0;
  }
  function et(T, k) {
    if (!T.presenters || !T.presenters.computed) return k;
    const I = T.presenters.computed;
    return k.map((M) => {
      const R = { ...M };
      for (const [H, F] of Object.entries(I))
        try {
          R[H] = F(M);
        } catch (z) {
          console.error(`[ln-data-store] Decorator computed field failed for ${H}`, z);
        }
      return R;
    });
  }
  C.prototype.getAll = function(T = {}) {
    const k = this;
    return o(k._name).then((I) => {
      const M = I.length;
      T.filters && (I = K(I, T.filters)), T.search && (I = W(I, T.search, k._searchFields));
      const R = I.length;
      if (T.sort && (I = P(I, T.sort)), T.offset || T.limit) {
        const H = T.offset || 0, F = T.limit || I.length;
        I = I.slice(H, H + F);
      }
      return {
        data: et(k, I),
        total: M,
        filtered: R
      };
    });
  }, C.prototype.getById = function(T) {
    return n(this._name, T).then((k) => k ? et(this, [k])[0] : null);
  }, C.prototype.count = function(T) {
    return T ? o(this._name).then((k) => K(k, T).length) : w(this._name);
  }, C.prototype.aggregate = function(T, k) {
    return o(this._name).then((I) => ft(I, T, k));
  }, C.prototype.setPresenters = function(T) {
    this.presenters = T;
  }, C.prototype.applySync = function(T, k, I, M) {
    M = M || {};
    const R = this;
    T.length > 0 || k.length > 0;
    let H = Promise.resolve();
    return T.length > 0 && (H = H.then(() => ot(R._name, T))), k.length > 0 && (H = H.then(() => Z(R._name, k))), H.then(() => w(R._name)).then((F) => (R.totalCount = M.total !== void 0 ? M.total : F, L(R._name, {
      schema_version: b,
      last_synced_at: I,
      record_count: R.totalCount
    }))).then(() => {
      const F = !R.isLoaded;
      R.isLoaded = !0, R.isSyncing = !1, R.lastSyncedAt = I, F ? (S(R.dom, "ln-data-store:loaded", { store: R._name, count: R.totalCount, meta: M }), S(R.dom, "ln-data-store:ready", { store: R._name, count: R.totalCount, source: "server", meta: M })) : S(R.dom, "ln-data-store:synced", {
        store: R._name,
        added: T.length,
        deleted: k.length,
        changed: !0,
        meta: M
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
      for (const [T, k] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${T}`, k);
      this._handlers = null;
    }
    delete l[this._name], delete this.dom[d], S(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function J() {
    return a().then((T) => {
      if (!T) return;
      const k = Array.from(T.objectStoreNames);
      return new Promise((I, M) => {
        const R = T.transaction(k, "readwrite");
        k.forEach((H) => R.objectStore(H).clear()), R.oncomplete = () => I(), R.onerror = () => M(R.error);
      });
    }).then(() => {
      Object.values(l).forEach((T) => {
        T.isLoaded = !1, T.isSyncing = !1, T.lastSyncedAt = null, T.totalCount = 0;
      });
    });
  }
  U(h, d, C, "ln-data-store"), window[d].clearAll = J, window[d].init = window[d], window[d].setStorageKey = jt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = jt);
})();
(function() {
  const h = "data-ln-api-connector", d = "lnApiConnector", E = "lnConnector";
  if (window[d] !== void 0) return;
  function v(l) {
    return l.ok ? l.status === 204 ? null : l.json() : l.json().catch(() => null).then((f) => {
      const u = new Error("HTTP " + l.status + ": " + l.statusText);
      throw u.status = l.status, u.data = f, u;
    });
  }
  function b(l) {
    return this.dom = l, l[d] = this, l[E] = this, this.refreshConfig(), this._handlers = null, m(this), this;
  }
  b.prototype.refreshConfig = function() {
    const l = this.dom;
    this.baseUrl = l.getAttribute("data-ln-api-base-url") || "", this.path = l.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: l.getAttribute("data-ln-api-param-offset") || "offset",
      limit: l.getAttribute("data-ln-api-param-limit") || "limit",
      search: l.getAttribute("data-ln-api-param-search") || "search",
      sortField: l.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: l.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const f = l.getAttribute("data-ln-api-headers") || "";
    this.headers = Jt(f, "ln-api-connector"), (f.toLowerCase().includes("authorization") || f.toLowerCase().includes("bearer") || f.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(l, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, b.prototype._reqHeaders = function() {
    return Object.assign({}, nt(this.headers), { "X-LN-Response": "data" });
  }, b.prototype.fetchDelta = function(l) {
    const f = this;
    let u = Y(f.baseUrl, f.path);
    return l != null && l !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(l)), window.fetch(u, { method: "GET", headers: f._reqHeaders(), credentials: f.credentials }).then(v);
  }, b.prototype.query = function(l) {
    const f = this;
    l = l || {};
    let u = Y(f.baseUrl, f.path);
    const p = f.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, s = new URLSearchParams();
    l.search && s.append(p.search, l.search), l.offset != null && s.append(p.offset, l.offset), l.limit != null && s.append(p.limit, l.limit), l.sort && l.sort.field && l.sort.direction && (s.append(p.sortField, l.sort.field), s.append(p.sortDir, l.sort.direction)), l.filters && typeof l.filters == "object" && Object.keys(l.filters).forEach((e) => {
      const i = l.filters[e];
      Array.isArray(i) && i.length > 0 && s.append(e, i.join(","));
    });
    const a = s.toString();
    return a && (u += (u.indexOf("?") !== -1 ? "&" : "?") + a), window.fetch(u, { method: "GET", headers: f._reqHeaders(), credentials: f.credentials }).then(v);
  }, b.prototype.create = function(l, f) {
    const u = this;
    return window.fetch(Y(u.baseUrl, f || u.path), {
      method: "POST",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      body: JSON.stringify(l)
    }).then(v);
  }, b.prototype.update = function(l, f, u, p) {
    const s = this;
    u != null && (f = Object.assign({}, f, { expected_version: u }));
    const a = p ? Y(s.baseUrl, p) : Y(s.baseUrl, s.path, l);
    return window.fetch(a, {
      method: "PUT",
      headers: s._reqHeaders(),
      credentials: s.credentials,
      body: JSON.stringify(f)
    }).then(v);
  }, b.prototype.delete = function(l, f) {
    const u = this;
    return window.fetch(Y(u.baseUrl, f || u.path, l), {
      method: "DELETE",
      headers: u._reqHeaders(),
      credentials: u.credentials
    }).then(v);
  }, b.prototype.bulkDelete = function(l, f) {
    const u = this;
    return window.fetch(Y(u.baseUrl, f || u.path) + "/bulk-delete", {
      method: "DELETE",
      headers: u._reqHeaders(),
      credentials: u.credentials,
      body: JSON.stringify({ ids: l })
    }).then(v);
  };
  function m(l) {
    l._handlers = {
      sync: function(u) {
        const p = u.detail || {};
        l.fetchDelta(p.since).then(function(s) {
          S(l.dom, "ln-api-connector:fetched", { data: s, since: p.since, meta: p.meta || null });
        }).catch(function(s) {
          S(l.dom, "ln-api-connector:error", {
            action: "sync",
            error: s.message,
            status: s.status || 0,
            data: s.data || null,
            since: p.since,
            meta: p.meta || null
          });
        });
      },
      query: function(u) {
        const p = u.detail || {}, s = p.query || p;
        l.query(s).then(function(a) {
          const e = a || {};
          S(l.dom, "ln-api-connector:fetched", {
            data: e.data || (Array.isArray(e) ? e : []),
            total: e.total,
            filtered: e.filtered,
            offset: s.offset,
            queryGen: s.queryGen,
            meta: p.meta || null
          });
        }).catch(function(a) {
          S(l.dom, "ln-api-connector:error", {
            action: "query",
            error: a.message,
            status: a.status || 0,
            data: a.data || null,
            meta: p.meta || null
          });
        });
      },
      create: function(u) {
        const p = u.detail || {};
        l.create(p.data, p.url).then(function(s) {
          const a = s && s.content !== void 0 ? s.content : s, e = s && s.message ? s.message : null;
          S(l.dom, "ln-api-connector:created", { record: a, tempId: p.tempId, message: e, meta: p.meta || null });
        }).catch(function(s) {
          S(l.dom, "ln-api-connector:error", {
            action: "create",
            error: s.message,
            status: s.status || 0,
            data: s.data || null,
            tempId: p.tempId,
            meta: p.meta || null
          });
        });
      },
      update: function(u) {
        const p = u.detail || {};
        l.update(p.id, p.data, p.expected_version, p.url).then(function(s) {
          const a = s && s.content !== void 0 ? s.content : s, e = s && s.message ? s.message : null;
          S(l.dom, "ln-api-connector:updated", { record: a, id: p.id, message: e, meta: p.meta || null });
        }).catch(function(s) {
          S(l.dom, "ln-api-connector:error", {
            action: "update",
            error: s.message,
            status: s.status || 0,
            data: s.data || null,
            id: p.id,
            conflictData: s.status === 409 ? s.data : null,
            meta: p.meta || null
          });
        });
      },
      delete: function(u) {
        const p = u.detail || {};
        l.delete(p.id, p.url).then(function(s) {
          const a = s && s.message ? s.message : null;
          S(l.dom, "ln-api-connector:deleted", { response: s, id: p.id, message: a, meta: p.meta || null });
        }).catch(function(s) {
          S(l.dom, "ln-api-connector:error", {
            action: "delete",
            error: s.message,
            status: s.status || 0,
            data: s.data || null,
            id: p.id,
            meta: p.meta || null
          });
        });
      },
      bulkDelete: function(u) {
        const p = u.detail || {};
        l.bulkDelete(p.ids, p.url).then(function(s) {
          const a = s && s.message ? s.message : null;
          S(l.dom, "ln-api-connector:bulk-deleted", { response: s, ids: p.ids, message: a, meta: p.meta || null });
        }).catch(function(s) {
          S(l.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: s.message,
            status: s.status || 0,
            data: s.data || null,
            ids: p.ids,
            meta: p.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(u) {
      l.dom.addEventListener(u + ":request-sync", l._handlers.sync), l.dom.addEventListener(u + ":request-query", l._handlers.query), l.dom.addEventListener(u + ":request-fetch", l._handlers.query), l.dom.addEventListener(u + ":request-create", l._handlers.create), l.dom.addEventListener(u + ":request-update", l._handlers.update), l.dom.addEventListener(u + ":request-delete", l._handlers.delete), l.dom.addEventListener(u + ":request-bulk-delete", l._handlers.bulkDelete);
    });
  }
  b.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const l = this;
    l._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(u) {
      l.dom.removeEventListener(u + ":request-sync", l._handlers.sync), l.dom.removeEventListener(u + ":request-query", l._handlers.query), l.dom.removeEventListener(u + ":request-fetch", l._handlers.query), l.dom.removeEventListener(u + ":request-create", l._handlers.create), l.dom.removeEventListener(u + ":request-update", l._handlers.update), l.dom.removeEventListener(u + ":request-delete", l._handlers.delete), l.dom.removeEventListener(u + ":request-bulk-delete", l._handlers.bulkDelete);
    }), l._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[E];
  };
  function _(l) {
    const f = l[d];
    f && f.refreshConfig();
  }
  U(h, d, b, "ln-api-connector", {
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
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", d = "lnCouchDbConnector", E = "lnConnector";
  if (window[d] !== void 0) return;
  function v(s) {
    const a = s && s.content !== void 0 ? s.content : s, e = s && s.message ? s.message : null;
    return { content: a, message: e };
  }
  function b(s) {
    return this.dom = s, s[d] = this, s[E] = this, this.refreshConfig(), this._handlers = null, u(this), this;
  }
  b.prototype.refreshConfig = function() {
    const s = this.dom;
    this.url = s.getAttribute("data-ln-couchdb-url") || "", this.db = s.getAttribute("data-ln-couchdb-db") || "", this.auth = s.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const a = s.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Jt(a, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), a.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(s, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, b.prototype.fetchDelta = function(s) {
    const a = this, e = ["include_docs=true", "feed=normal"];
    s && e.push("since=" + encodeURIComponent(s));
    const i = Y(a.url, a.db, "_changes") + "?" + e.join("&");
    return window.fetch(i, { method: "GET", headers: nt(a.headers, a.auth), credentials: a.credentials }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const t = r.results || [];
      return {
        data: t.filter((o) => !o.deleted && o.doc).map((o) => Object.assign({}, o.doc, { id: o.doc._id })),
        deleted: t.filter((o) => o.deleted).map((o) => o.id),
        synced_at: r.last_seq || s || ""
      };
    });
  };
  function m(s, a) {
    const e = Object.assign({ _id: a.id }, a);
    return e._id || delete e._id, window.fetch(Y(s.url, s.db), {
      method: "POST",
      headers: nt(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify(e)
    }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => {
      const r = v(i), t = r.content;
      return { record: Object.assign({}, e, { id: t.id, _id: t.id, _rev: t.rev }), message: r.message };
    });
  }
  b.prototype.create = function(s) {
    return m(this, s).then((a) => a.record);
  };
  function _(s, a, e) {
    const i = Object.assign({ id: String(a), _id: String(a) }, e), r = i._rev || i.rev;
    return (r ? Promise.resolve(r) : window.fetch(Y(s.url, s.db, null, a), { method: "GET", headers: nt(s.headers, s.auth), credentials: s.credentials }).then((o) => {
      if (!o.ok) throw new Error("Could not retrieve document for revision mapping");
      return o.json().then((n) => n._rev);
    })).then((o) => {
      const n = Object.assign({}, i, { _rev: o });
      delete n.rev;
      const g = Object.assign(nt(s.headers, s.auth), { "If-Match": o });
      return window.fetch(Y(s.url, s.db, null, a), {
        method: "PUT",
        headers: g,
        credentials: s.credentials,
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
  b.prototype.update = function(s, a) {
    return _(this, s, a).then((e) => e.record);
  };
  function l(s, a, e) {
    return (e ? Promise.resolve(e) : window.fetch(Y(s.url, s.db, null, a), { method: "GET", headers: nt(s.headers, s.auth), credentials: s.credentials }).then((r) => {
      if (!r.ok) throw new Error("Could not retrieve document for revision delete");
      return r.json().then((t) => t._rev);
    })).then((r) => {
      const t = Y(s.url, s.db, null, a) + "?rev=" + encodeURIComponent(r);
      return window.fetch(t, { method: "DELETE", headers: nt(s.headers, s.auth), credentials: s.credentials }).then((o) => {
        if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
        return o.json();
      }).then((o) => {
        const n = v(o);
        return { response: n.content, message: n.message };
      });
    });
  }
  b.prototype.delete = function(s, a) {
    return l(this, s, a).then((e) => e.response);
  };
  function f(s, a) {
    return !a || a.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Y(s.url, s.db, "_all_docs"), {
      method: "POST",
      headers: nt(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify({ keys: a })
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const r = (e.rows || []).filter((t) => !t.error && t.value && t.value.rev).map((t) => ({ _id: t.id, _rev: t.value.rev, _deleted: !0 }));
      return r.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Y(s.url, s.db, "_bulk_docs"), {
        method: "POST",
        headers: nt(s.headers, s.auth),
        credentials: s.credentials,
        body: JSON.stringify({ docs: r })
      }).then((t) => {
        if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
        return t.json();
      }).then((t) => {
        const o = v(t);
        return { response: { ok: !0, results: o.content, deletedCount: r.length }, message: o.message };
      });
    });
  }
  b.prototype.bulkDelete = function(s) {
    return f(this, s).then((a) => a.response);
  };
  function u(s) {
    s._handlers = {
      sync: function(e) {
        const i = e.detail || {};
        s.fetchDelta(i.since).then(function(r) {
          S(s.dom, "ln-couchdb-connector:fetched", { data: r, since: i.since, meta: i.meta || null });
        }).catch(function(r) {
          S(s.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: r.message,
            status: r.status || 0,
            since: i.since,
            meta: i.meta || null
          });
        });
      },
      create: function(e) {
        const i = e.detail || {};
        m(s, i.data).then(function(r) {
          S(s.dom, "ln-couchdb-connector:created", { record: r.record, tempId: i.tempId, message: r.message, meta: i.meta || null });
        }).catch(function(r) {
          S(s.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: r.message,
            status: r.status || 0,
            tempId: i.tempId,
            meta: i.meta || null
          });
        });
      },
      update: function(e) {
        const i = e.detail || {}, r = Object.assign({}, i.data);
        i.expected_version !== void 0 && (r._rev = i.expected_version), _(s, i.id, r).then(function(t) {
          S(s.dom, "ln-couchdb-connector:updated", { record: t.record, id: i.id, message: t.message, meta: i.meta || null });
        }).catch(function(t) {
          S(s.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: t.message,
            status: t.status || 0,
            id: i.id,
            data: t.status === 409 ? t.data : null,
            conflictData: t.status === 409 ? t.data : null,
            meta: i.meta || null
          });
        });
      },
      delete: function(e) {
        const i = e.detail || {};
        l(s, i.id, i.rev).then(function(r) {
          S(s.dom, "ln-couchdb-connector:deleted", { response: r.response, id: i.id, message: r.message, meta: i.meta || null });
        }).catch(function(r) {
          S(s.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: r.message,
            status: r.status || 0,
            id: i.id,
            meta: i.meta || null
          });
        });
      },
      bulkDelete: function(e) {
        const i = e.detail || {};
        f(s, i.ids).then(function(r) {
          S(s.dom, "ln-couchdb-connector:bulk-deleted", { response: r.response, ids: i.ids, message: r.message, meta: i.meta || null });
        }).catch(function(r) {
          S(s.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: r.message,
            status: r.status || 0,
            ids: i.ids,
            meta: i.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      s.dom.addEventListener(e + ":request-sync", s._handlers.sync), s.dom.addEventListener(e + ":request-fetch", s._handlers.sync), s.dom.addEventListener(e + ":request-create", s._handlers.create), s.dom.addEventListener(e + ":request-update", s._handlers.update), s.dom.addEventListener(e + ":request-delete", s._handlers.delete), s.dom.addEventListener(e + ":request-bulk-delete", s._handlers.bulkDelete);
    });
  }
  b.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const s = this;
    s._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      s.dom.removeEventListener(e + ":request-sync", s._handlers.sync), s.dom.removeEventListener(e + ":request-fetch", s._handlers.sync), s.dom.removeEventListener(e + ":request-create", s._handlers.create), s.dom.removeEventListener(e + ":request-update", s._handlers.update), s.dom.removeEventListener(e + ":request-delete", s._handlers.delete), s.dom.removeEventListener(e + ":request-bulk-delete", s._handlers.bulkDelete);
    }), s._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[E];
  };
  function p(s) {
    const a = s[d];
    a && a.refreshConfig();
  }
  U(h, d, b, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-data-coordinator", d = "lnDataCoordinator", E = "lnCoordinator", v = "data-ln-form-scope";
  if (window[d] !== void 0) return;
  const b = /* @__PURE__ */ new Set();
  let m = !1, _ = null, l = null, f = null;
  function u() {
    m || (m = !0, _ = function() {
      S(document, "ln-data-store:online", {}), b.forEach(function(t) {
        t._maybeSync();
      });
    }, l = function() {
      S(document, "ln-data-store:offline", {});
    }, f = function() {
      document.visibilityState === "visible" && b.forEach(function(t) {
        const n = t.findChildren().store;
        n && n.isLoaded && !n.isSyncing && !t._noAutosync && t._isStale() && n.forceSync();
      });
    }, window.addEventListener("online", _), window.addEventListener("offline", l), document.addEventListener("visibilitychange", f));
  }
  function p() {
    m && (b.size > 0 || (window.removeEventListener("online", _), window.removeEventListener("offline", l), document.removeEventListener("visibilitychange", f), _ = null, l = null, f = null, m = !1));
  }
  function s() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (o) => {
        const n = Math.random() * 16 | 0;
        return (o === "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
  const a = ["ln-api-connector", "ln-couchdb-connector"];
  function e(t) {
    return this.dom = t, this._name = t.getAttribute(h), t[d] = this, t[E] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._dict = Rt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), i(this), b.add(this), u(), this._checkInitialSync(), this;
  }
  e.prototype._parseStaleAttributes = function() {
    const o = this.findChildren().storeEl, n = this.dom.getAttribute("data-ln-data-coordinator-stale") || (o ? o.getAttribute("data-ln-data-store-stale") : null), g = parseInt(n, 10);
    this._staleThreshold = n === "never" || n === "-1" ? -1 : isNaN(g) ? 300 : g;
    const c = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (o ? o.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!c;
  }, e.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const o = this.findChildren().store;
    return !o || !o.lastSyncedAt ? !0 : Date.now() / 1e3 - o.lastSyncedAt > this._staleThreshold;
  }, e.prototype._maybeSync = function() {
    const o = this.findChildren().store;
    !o || this._noAutosync || o.isLoaded && !o.isSyncing && o.forceSync();
  }, e.prototype._checkInitialSync = function() {
    const o = this.findChildren().store;
    !o || !o.isLoaded || this._noAutosync || (o.totalCount === 0 || this._isStale()) && o.forceSync();
  }, e.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const o = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    o && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(o)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(n) {
      return n;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(n) {
      return n;
    });
  }, e.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), o = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), n = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: o,
      queueEl: n,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: o ? o.lnConnector || o.lnApiConnector || o.lnCouchDbConnector : null,
      queue: n ? n.lnApiQueue : null
    };
  }, e.prototype._handleSubmitRecord = function(t) {
    const o = this.findChildren();
    if (!o.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const n = t.data || {}, g = n.id, c = n.expected_version, y = Object.assign({}, n);
    delete y.id, delete y.expected_version;
    const w = t.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(o, y, t.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(o, g, y, c, t.action);
  }, e.prototype._fanOutCreate = function(t, o, n) {
    this.refreshMapper();
    const g = "_temp_" + s();
    S(t.storeEl, "ln-data-store:request-create", { tempId: g, data: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: g,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(o),
      expectedVersion: null,
      meta: { tempId: g, action: n }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(o),
      url: n,
      meta: { entryId: s(), queued: !1, op: "create", tempId: g }
    });
  }, e.prototype._fanOutUpdate = function(t, o, n, g, c) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-update", { id: o, data: n }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "update",
      targetId: o,
      payload: this.mapper.egress(n),
      expectedVersion: g,
      meta: { id: o, action: c }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-update", {
      id: o,
      data: this.mapper.egress(n),
      expected_version: g,
      url: c,
      meta: { entryId: s(), queued: !1, op: "update", id: o }
    });
  }, e.prototype._fanOutDelete = function(t, o) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-delete", { id: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "delete",
      targetId: o,
      payload: null,
      expectedVersion: null,
      meta: { id: o }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-delete", {
      id: o,
      meta: { entryId: s(), queued: !1, op: "delete", id: o }
    });
  }, e.prototype._fanOutBulkDelete = function(t, o) {
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
      meta: { entryId: s(), queued: !1, op: "bulk-delete", bulkKey: n }
    });
  }, e.prototype._toastFromMessage = function(t) {
    t && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: t.type || "success",
        title: t.title || "",
        message: t.body || ""
      }
    }));
  }, e.prototype._toastFromDict = function(t) {
    const o = this._dict[t];
    o && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: o }
    }));
  };
  function i(t) {
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
        const g = o.detail || {}, c = g.entryId, y = g.op, w = g.targetId, A = g.payload, L = g.expectedVersion, C = g.meta || {}, x = C.action || null;
        y === "create" ? S(n.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: x,
          meta: { entryId: c, queued: !0, op: "create", tempId: C.tempId }
        }) : y === "update" ? S(n.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: A,
          expected_version: L,
          url: x,
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
        const g = n.hasAttribute(v) ? n.getAttribute(v) : null;
        if (g === null) return;
        let c;
        if (g ? c = g === t._name : c = n.closest("[data-ln-data-coordinator]") === t.dom, !c) return;
        const y = me(n);
        if (y !== "POST" && y !== "PUT" && y !== "PATCH") return;
        o.preventDefault();
        const w = Gt(n);
        delete w._method, delete w._token, t._handleSubmitRecord({ data: w, method: y, action: n.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(o) {
        const n = o.detail.meta || {}, g = t.findChildren();
        t.refreshMapper();
        const c = o.detail.data;
        let y = [], w = [], A = null;
        Array.isArray(c) ? (y = c, A = Math.floor(Date.now() / 1e3)) : c && (y = Array.isArray(c.data) ? c.data : [], w = Array.isArray(c.deleted) ? c.deleted : [], A = c.synced_at !== void 0 ? c.synced_at : c.since !== void 0 ? c.since : null);
        const L = y.map((C) => t.mapper.ingress(C));
        g.store && g.store.applySync(L, w, A || Math.floor(Date.now() / 1e3), {
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
        const g = o.detail.meta || {}, c = t.mapper.ingress(o.detail.record);
        S(n.storeEl, "ln-data-store:request-update", { id: g.tempId, data: c }), t._toastFromMessage(o.detail.message), g.queued && n.queue && (S(n.queueEl, "ln-api-queue:request-remap", { oldKey: g.tempId, newId: c.id }), S(n.queueEl, "ln-api-queue:ack", { entryId: g.entryId }));
      },
      connUpdated: function(o) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const g = o.detail.meta || {}, c = t.mapper.ingress(o.detail.record);
        S(n.storeEl, "ln-data-store:request-update", { id: g.id, data: c }), t._toastFromMessage(o.detail.message), g.queued && n.queue && S(n.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
      },
      connDeleted: function(o) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const g = o.detail.meta || {};
        t._toastFromMessage(o.detail.message), g.queued && n.queue && S(n.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
      },
      connBulkDeleted: function(o) {
        const n = t.findChildren();
        if (!n.storeEl) return;
        const g = o.detail.meta || {};
        t._toastFromMessage(o.detail.message), g.queued && n.queue && S(n.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
      },
      connError: function(o) {
        const n = o.detail || {}, g = n.meta || {}, c = g.op || n.action, y = n.status || 0;
        if (c === "sync") {
          console.error("[ln-data-coordinator] Sync failed:", n.error);
          return;
        }
        const w = t.findChildren();
        if (!w.storeEl) return;
        const A = y === 401 || y === 419, L = y === 0 || y >= 500, C = y === 409;
        if (A) {
          t._toastFromDict("auth"), g.queued && w.queue && S(w.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "auth" });
          return;
        }
        if (L) {
          g.queued && w.queue ? S(w.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        if (C && c === "update") {
          const x = n.data && n.data.remote ? t.mapper.ingress(n.data.remote) : null;
          x && S(w.storeEl, "ln-data-store:request-update", { id: g.id, data: x }), t._toastFromDict("conflict");
        } else c === "create" && S(w.storeEl, "ln-data-store:request-delete", { id: g.tempId }), t._toastFromDict("rejected");
        g.queued && w.queue && S(w.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "drop" });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(o) {
        const g = t.findChildren().store;
        if (!g || t._noAutosync) return;
        (o.detail || {}).hasCache ? t._isStale() && g.forceSync() : g.forceSync();
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
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), a.forEach(function(o) {
      t.dom.addEventListener(o + ":fetched", t._handlers.connFetched), t.dom.addEventListener(o + ":created", t._handlers.connCreated), t.dom.addEventListener(o + ":updated", t._handlers.connUpdated), t.dom.addEventListener(o + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(o + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(o + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:loaded", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced);
  }
  e.prototype._ownsStore = function(t) {
    const o = this.findChildren();
    return !!(o.store && o.store._name === t && t || this._name === t && t);
  }, e.prototype._serveData = function(t, o) {
    const n = t.target, g = o === "table" ? "data-ln-table-store" : "data-ln-list-store", c = n.getAttribute(g) || n.getAttribute("data-ln-table-source") || n.getAttribute("data-ln-list-source");
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
      const x = {
        data: C.data,
        total: C.total,
        filtered: C.filtered,
        offset: t.detail.offset !== void 0 ? t.detail.offset : C.offset,
        queryGen: t.detail.queryGen !== void 0 ? t.detail.queryGen : C.queryGen
      };
      S(n, "ln-" + o + ":set-data", x), A._boundDelivered.set(n, !0);
    });
  }, e.prototype._serveOptions = function(t) {
    const o = t.target, n = o.getAttribute("data-ln-options");
    if (!this._ownsStore(n)) return;
    this.findChildren().store.getAll({}).then(function(c) {
      S(o, "ln-options:set-data", { data: c.data });
    });
  }, e.prototype._serveStat = function(t) {
    const o = t.target, n = o.getAttribute("data-ln-stat");
    if (!this._ownsStore(n)) return;
    const g = t.detail.filters || null;
    this.findChildren().store.count(g).then(function(y) {
      S(o, "ln-stat:set-count", { count: y });
    });
  }, e.prototype._refreshAll = function(t) {
    const o = this, n = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let g = 0; g < n.length; g++) {
      const c = n[g];
      let y, w;
      if (c.hasAttribute("data-ln-table-store") ? (y = c.getAttribute("data-ln-table-store"), w = "table") : c.hasAttribute("data-ln-list-store") ? (y = c.getAttribute("data-ln-list-store"), w = "list") : c.hasAttribute("data-ln-options") ? (y = c.getAttribute("data-ln-options"), w = "options") : c.hasAttribute("data-ln-stat") && (y = c.getAttribute("data-ln-stat"), w = "stat"), !this._ownsStore(y)) continue;
      const A = this.findChildren().store;
      if (w === "table" || w === "list") {
        const L = o._boundQueries.get(c) || { sort: null, filters: {}, search: "" };
        (function(C, x) {
          A.getAll(L).then(function(D) {
            const q = {
              data: D.data,
              total: t && t.total !== void 0 ? t.total : D.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : D.filtered,
              offset: t && t.offset !== void 0 ? t.offset : L.offset,
              queryGen: t && t.queryGen !== void 0 ? t.queryGen : L.queryGen
            };
            S(C, "ln-" + x + ":set-loading", { loading: !1 }), S(C, "ln-" + x + ":set-data", q), o._boundDelivered.set(C, !0);
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
          const x = L.indexOf(":");
          if (x !== -1) {
            const D = L.slice(0, x), q = L.slice(x + 1);
            C = {}, C[D] = [q];
          }
        }
        (function(x, D) {
          A.count(D).then(function(q) {
            S(x, "ln-stat:set-count", { count: q });
          });
        })(c, C);
      }
    }
  }, e.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), a.forEach(function(o) {
      t.dom.removeEventListener(o + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(o + ":created", t._handlers.connCreated), t.dom.removeEventListener(o + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(o + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(o + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(o + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:loaded", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, b.delete(this), p(), delete this.dom[d], delete this.dom[E];
  };
  function r(t, o) {
    const n = t[d];
    n && o === "data-ln-data-mapper" && n.refreshMapper();
  }
  U(h, d, e, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: r
  });
})();
(function() {
  const h = "data-ln-api-queue", d = "lnApiQueue";
  if (window[d] !== void 0) return;
  const E = "ln_api_queue", v = "outbox", b = "_queue_meta", m = [2e3, 5e3, 15e3, 6e4, 3e5], _ = 8;
  let l = null, f = null;
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
  function p() {
    return f || (f = new Promise((c) => {
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
          A.close(), l = null, f = null;
        }, l = A, c(A);
      };
    }), f);
  }
  function s() {
    return l ? Promise.resolve(l) : (f = null, p());
  }
  function a(c) {
    return new Promise((y, w) => {
      c.onsuccess = () => y(c.result), c.onerror = () => w(c.error);
    });
  }
  const e = (c, y) => s().then((w) => w ? w.transaction(c, y).objectStore(c) : null);
  function i(c) {
    return e(v, "readwrite").then((y) => y ? a(y.put(c)) : null);
  }
  function r(c) {
    return e(v, "readwrite").then((y) => y ? a(y.delete(c)) : null);
  }
  function t(c) {
    return e(v, "readonly").then((y) => {
      if (!y) return [];
      const w = y.index("by_scope_seq"), A = IDBKeyRange.bound([c, -1 / 0], [c, 1 / 0]);
      return a(w.getAll(A));
    });
  }
  function o(c) {
    return e(b, "readwrite").then((y) => y ? a(y.get("seq")).then((w) => {
      const A = (w && typeof w.value == "number" ? w.value : 0) + 1;
      return e(b, "readwrite").then((L) => a(L.put({ key: "seq", value: A }))).then(() => A);
    }) : 0);
  }
  function n(c) {
    this.dom = c, c[d] = this;
    const y = c.closest("[data-ln-data-coordinator]");
    this.scope = c.getAttribute(h) || (y ? y.getAttribute("data-ln-data-coordinator") : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const w = this;
    return p().then(() => {
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
          A.sort((D, q) => D.seq - q.seq);
          const C = A.find((D) => D.status !== "failed");
          if (!C || C.status === "inflight") return;
          const x = Date.now();
          if (C.nextAttemptAt > x) {
            c._scheduleTimer(L, C.nextAttemptAt - x);
            return;
          }
          c._clearTimer(L), C.status = "inflight", i(C).then(() => {
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
      return i(L).then(() => t(y.scope)).then((C) => {
        S(y.dom, "ln-api-queue:enqueued", { entryId: L.entryId, chainKey: L.chainKey, count: C.length }), S(y.dom, "ln-api-queue:pending-count", { count: C.length, scope: y.scope }), y._drain();
      });
    });
  }, n.prototype._onAck = function(c) {
    const y = this, w = c.detail || {};
    return r(w.entryId).then(() => t(y.scope)).then((A) => {
      S(y.dom, "ln-api-queue:pending-count", { count: A.length, scope: y.scope }), A.length === 0 && S(y.dom, "ln-api-queue:drained", { scope: y.scope }), y._drain();
    });
  }, n.prototype._onNack = function(c) {
    const y = this, w = c.detail || {}, A = w.reason;
    return t(y.scope).then((L) => {
      const C = L.find((x) => x.entryId === w.entryId);
      if (C) {
        if (A === "retry")
          return C.attempts = (C.attempts || 0) + 1, C.attempts >= _ ? (C.status = "failed", i(C).then(() => (S(y.dom, "ln-api-queue:failed", { entryId: C.entryId, chainKey: C.chainKey, attempts: C.attempts }), t(y.scope))).then((x) => {
            S(y.dom, "ln-api-queue:pending-count", { count: x.length, scope: y.scope });
          })) : (C.nextAttemptAt = Date.now() + m[Math.min(C.attempts - 1, m.length - 1)], C.status = "pending", i(C).then(() => (y._scheduleTimer(C.chainKey, C.nextAttemptAt - Date.now()), t(y.scope))).then((x) => {
            S(y.dom, "ln-api-queue:pending-count", { count: x.length, scope: y.scope });
          }));
        if (A === "drop")
          return r(C.entryId).then(() => t(y.scope)).then((x) => {
            S(y.dom, "ln-api-queue:pending-count", { count: x.length, scope: y.scope }), x.length === 0 && S(y.dom, "ln-api-queue:drained", { scope: y.scope }), y._drain();
          });
        if (A === "auth")
          return C.status = "pending", i(C).then(() => {
            y._paused = !0, S(y.dom, "ln-api-queue:paused", { reason: "auth" }), S(y.dom, "ln-api-queue:auth-required", { entryId: C.entryId, chainKey: C.chainKey });
          });
      }
    });
  }, n.prototype._onRemap = function(c) {
    const y = this, w = c.detail || {}, A = w.oldKey, L = w.newId;
    return t(y.scope).then((C) => {
      const x = C.filter((D) => D.chainKey === A && D.status !== "failed");
      return Promise.all(x.map((D) => (D.targetId === A && (D.targetId = L), D.meta && typeof D.meta.action == "string" && D.meta.action.indexOf(A) !== -1 && (D.meta.action = D.meta.action.split(A).join(L)), D.chainKey = L, i(D))));
    });
  }, n.prototype._onResume = function() {
    this._paused = !1, S(this.dom, "ln-api-queue:resumed", {}), this._drain();
  }, n.prototype._onDrain = function() {
    this._drain();
  }, n.prototype._onClear = function() {
    const c = this;
    return t(c.scope).then((y) => Promise.all(y.map((w) => r(w.entryId)))).then(() => {
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
  function g(c) {
    const y = c[d];
    y && y._drain();
  }
  U(h, d, n, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: g
  });
})();
(function() {
  const h = "data-ln-options", d = "lnOptions";
  if (window[d] !== void 0) return;
  function E(v) {
    this.dom = v, this._storeName = v.getAttribute(h), this._valueField = v.getAttribute("data-ln-options-value") || "id", this._labelField = v.getAttribute("data-ln-options-label") || "name";
    const b = this;
    return this._onSetData = function(m) {
      b._rebuild(m.detail.data || []);
    }, v.addEventListener("ln-options:set-data", this._onSetData), S(v, "ln-options:request-data", { options: this._storeName }), this;
  }
  E.prototype._rebuild = function(v) {
    const b = this.dom, m = this._valueField, _ = this._labelField, l = b.value, f = b.querySelectorAll("option");
    for (let p = f.length - 1; p >= 0; p--)
      f[p].value !== "" && b.removeChild(f[p]);
    for (let p = 0; p < v.length; p++) {
      const s = v[p], a = document.createElement("option");
      a.value = String(s[m]), a.textContent = s[_] != null ? s[_] : "", b.appendChild(a);
    }
    const u = b.options;
    for (let p = 0; p < u.length; p++)
      if (u[p].value === l) {
        b.value = l;
        break;
      }
  }, E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[d]);
  }, U(h, d, E, "ln-options");
})();
(function() {
  const h = "data-ln-stat", d = "lnStat";
  if (window[d] !== void 0) return;
  function E(b) {
    if (!b) return null;
    const m = b.indexOf(":");
    if (m === -1) return null;
    const _ = b.slice(0, m), l = b.slice(m + 1), f = {};
    return f[_] = [l], f;
  }
  function v(b) {
    return this.dom = b, this._storeName = b.getAttribute(h), this._filters = E(b.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      b.textContent = String(m.detail.count), b.classList.remove("is-loading");
    }, b.addEventListener("ln-stat:set-count", this._onSetCount), S(b, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  v.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[d]);
  }, U(h, d, v, "ln-stat");
})();
(function() {
  const h = "ln-icons-sprite", d = "#ln-", E = "#lnc-", v = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set();
  let m = null;
  const _ = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), l = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), f = "lni:", u = "lni:v", p = "1";
  function s() {
    try {
      if (localStorage.getItem(u) !== p) {
        for (let n = localStorage.length - 1; n >= 0; n--) {
          const g = localStorage.key(n);
          g && g.indexOf(f) === 0 && localStorage.removeItem(g);
        }
        localStorage.setItem(u, p);
      }
    } catch {
    }
  }
  s();
  function a() {
    return m || (m = document.getElementById(h), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = h, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function e(n) {
    return n.indexOf(E) === 0 ? l + "/" + n.slice(E.length) + ".svg" : _ + "/" + n.slice(d.length) + ".svg";
  }
  function i(n, g) {
    const c = g.match(/viewBox="([^"]+)"/), y = c ? c[1] : "0 0 24 24", w = g.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = w ? w[1].trim() : "", L = g.match(/<svg([^>]*)>/i), C = L ? L[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = n, x.setAttribute("viewBox", y), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(D) {
      const q = C.match(new RegExp(D + '="([^"]*)"'));
      q && x.setAttribute(D, q[1]);
    }), x.innerHTML = A, a().querySelector("defs").appendChild(x);
  }
  function r(n) {
    if (v.has(n) || b.has(n) || n.indexOf(E) === 0 && !l) return;
    const g = n.slice(1);
    try {
      const c = localStorage.getItem(f + g);
      if (c) {
        i(g, c), v.add(n);
        return;
      }
    } catch {
    }
    b.add(n), fetch(e(n)).then(function(c) {
      if (!c.ok) throw new Error(c.status);
      return c.text();
    }).then(function(c) {
      i(g, c), v.add(n), b.delete(n);
      try {
        localStorage.setItem(f + g, c);
      } catch {
      }
    }).catch(function() {
      b.delete(n);
    });
  }
  function t(n) {
    const g = 'use[href^="' + d + '"], use[href^="' + E + '"]', c = n.querySelectorAll ? n.querySelectorAll(g) : [];
    if (n.matches && n.matches(g)) {
      const y = n.getAttribute("href");
      y && r(y);
    }
    Array.prototype.forEach.call(c, function(y) {
      const w = y.getAttribute("href");
      w && r(w);
    });
  }
  function o() {
    t(document), new MutationObserver(function(n) {
      n.forEach(function(g) {
        if (g.type === "childList")
          g.addedNodes.forEach(function(c) {
            c.nodeType === 1 && t(c);
          });
        else if (g.type === "attributes" && g.attributeName === "href") {
          const c = g.target.getAttribute("href");
          c && (c.indexOf(d) === 0 || c.indexOf(E) === 0) && r(c);
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
  const h = "data-ln-debug", d = "lnDebug";
  if (window[d] !== void 0) return;
  function E(v) {
    return this.dom = v, this;
  }
  E.prototype.destroy = function() {
    delete this.dom[d];
  }, U(h, d, E, "ln-debug");
})();
