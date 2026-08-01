if (typeof window < "u") {
  const u = console.warn;
  console.warn = function(...c) {
    typeof c[0] == "string" && (c[0].startsWith("[ln-") || c[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || u.apply(console, c);
  };
}
const Mt = {};
function kt(u, c) {
  Mt[u] || (Mt[u] = document.querySelector('[data-ln-template="' + u + '"]'));
  const v = Mt[u];
  return v ? v.content.cloneNode(!0) : (console.warn("[" + (c || "ln-core") + '] Template "' + u + '" not found'), null);
}
function S(u, c, v) {
  u.dispatchEvent(new CustomEvent(c, {
    bubbles: !0,
    detail: v || {}
  }));
}
function $(u, c, v) {
  const y = new CustomEvent(c, {
    bubbles: !0,
    cancelable: !0,
    detail: v || {}
  });
  return u.dispatchEvent(y), y;
}
function ie(u, c, v) {
  u._applyFilterAndSort(), u._vStart = -1, u._vEnd = -1, u._render(), u._updateFooter();
  const y = {
    sort: u.currentSort,
    filters: u.currentFilters,
    search: u.currentSearch
  };
  y[v] = u.name, S(u.dom, c, y);
}
function et(u, c) {
  if (!u || !c) return u;
  const v = u.querySelectorAll("[data-ln-field]");
  for (let h = 0; h < v.length; h++) {
    const l = v[h], p = l.getAttribute("data-ln-field");
    c[p] != null && (l.textContent = c[p]);
  }
  const y = u.querySelectorAll("[data-ln-attr]");
  for (let h = 0; h < y.length; h++) {
    const l = y[h], p = l.getAttribute("data-ln-attr").split(",");
    for (let s = 0; s < p.length; s++) {
      const d = p[s].trim().split(":");
      if (d.length !== 2) continue;
      const f = d[0].trim(), n = d[1].trim();
      c[n] != null && l.setAttribute(f, c[n]);
    }
  }
  const _ = u.querySelectorAll("[data-ln-show]");
  for (let h = 0; h < _.length; h++) {
    const l = _[h], p = l.getAttribute("data-ln-show");
    p in c && l.classList.toggle("hidden", !c[p]);
  }
  const m = u.querySelectorAll("[data-ln-class]");
  for (let h = 0; h < m.length; h++) {
    const l = m[h], p = l.getAttribute("data-ln-class").split(",");
    for (let s = 0; s < p.length; s++) {
      const d = p[s].trim().split(":");
      if (d.length !== 2) continue;
      const f = d[0].trim(), n = d[1].trim();
      n in c && l.classList.toggle(f, !!c[n]);
    }
  }
  return u;
}
function Se(u, c) {
  u.matches && u.matches("[data-ln-form], [data-ln-fillable]") && u.dispatchEvent(new CustomEvent("ln-fill", { detail: c ?? null, bubbles: !0 }));
  const v = u.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let y = 0; y < v.length; y++)
    v[y].dispatchEvent(new CustomEvent("ln-fill", { detail: c ?? null, bubbles: !0 }));
  return u;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(u) {
  if (!(!u.target.matches || !u.target.matches("[data-ln-fillable]")))
    if (u.detail)
      et(u.target, u.detail);
    else {
      const c = u.target.querySelectorAll("[data-ln-field]");
      for (let v = 0; v < c.length; v++)
        c[v].textContent = "";
    }
})));
function Ct(u, c) {
  if (!u || !c) return u;
  const v = document.createTreeWalker(u, NodeFilter.SHOW_TEXT);
  for (; v.nextNode(); ) {
    const m = v.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(h, l) {
        return c[l] !== void 0 ? c[l] : "";
      }
    ));
  }
  const y = function(m, h) {
    return c[h] !== void 0 ? c[h] : "";
  }, _ = Array.from(u.querySelectorAll("*"));
  u.nodeType === 1 && _.push(u);
  for (let m = 0; m < _.length; m++) {
    const h = _[m], l = h.attributes;
    for (let p = 0; p < l.length; p++) {
      const s = l[p];
      s.value.indexOf("{{") !== -1 && h.setAttribute(s.name, s.value.replace(/\{\{\s*(\w+)\s*\}\}/g, y));
    }
  }
  return u;
}
function Ce(u, c, v, y, _, m) {
  const h = {};
  for (let p = 0; p < u.children.length; p++) {
    const s = u.children[p], d = s.getAttribute("data-ln-key");
    d && (h[d] = s);
  }
  const l = document.createDocumentFragment();
  for (let p = 0; p < c.length; p++) {
    const s = c[p], d = String(y(s));
    let f = h[d];
    if (f)
      _(f, s, p);
    else {
      const n = kt(v, m);
      if (!n || (Ct(n, s), f = n.firstElementChild, !f)) continue;
      f.setAttribute("data-ln-key", d), _(f, s, p);
    }
    l.appendChild(f);
  }
  u.textContent = "", u.appendChild(l);
}
function it(u, c) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      it(u, c);
    }), console.warn("[" + c + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  u();
}
function ht(u, c, v) {
  if (u) {
    const y = u.querySelector('[data-ln-template="' + c + '"]');
    if (y) return y.content.cloneNode(!0);
  }
  return kt(c, v);
}
function Kt(u, c) {
  const v = {}, y = u.querySelectorAll("[" + c + "]");
  for (let _ = 0; _ < y.length; _++)
    v[y[_].getAttribute(c)] = y[_].textContent, y[_].remove();
  return v;
}
function Nt(u, c, v, y) {
  if (u.nodeType !== 1) return;
  const m = c.indexOf("[") !== -1 || c.indexOf(".") !== -1 || c.indexOf("#") !== -1 ? c : "[" + c + "]", h = Array.from(u.querySelectorAll(m));
  u.matches && u.matches(m) && h.push(u);
  for (const l of h)
    l[v] || (l[v] = new y(l));
}
function qt(u) {
  return !!(u.offsetWidth || u.offsetHeight || u.getClientRects().length);
}
function Le(u) {
  const c = u.querySelector('input[name="_method"]');
  return ((c && c.value !== "" ? c.value : u.method) || "").toUpperCase();
}
function re(u, c) {
  const v = !!(c && c.typed), y = c && c.exclude, _ = {}, m = u.elements, h = {};
  if (v)
    for (let l = 0; l < m.length; l++) {
      const p = m[l];
      p.name && p.type === "checkbox" && !p.disabled && (h[p.name] = (h[p.name] || 0) + 1);
    }
  for (let l = 0; l < m.length; l++) {
    const p = m[l];
    if (!(!p.name || p.disabled || p.type === "file" || p.type === "submit" || p.type === "button") && !(y && p.matches && p.matches(y)))
      if (p.type === "checkbox")
        v && h[p.name] === 1 ? _[p.name] = p.checked : (_[p.name] || (_[p.name] = []), p.checked && _[p.name].push(p.value));
      else if (p.type === "radio")
        p.checked && (_[p.name] = p.value);
      else if (p.type === "select-multiple") {
        _[p.name] = [];
        for (let s = 0; s < p.options.length; s++)
          p.options[s].selected && _[p.name].push(p.options[s].value);
      } else if (v && p.type === "hidden")
        _[p.name] = p.value;
      else if (v && (p.type === "number" || p.type === "range")) {
        const s = Number(p.value);
        _[p.name] = p.value === "" || isNaN(s) ? null : s;
      } else
        _[p.name] = p.value;
  }
  return _;
}
function Te(u) {
  if (typeof u != "string") return !!u;
  const c = u.trim().toLowerCase();
  return c !== "false" && c !== "0" && c !== "" && c !== "off" && c !== "no";
}
function oe(u, c) {
  const v = u.elements, y = [], _ = {};
  for (let m = 0; m < v.length; m++) {
    const h = v[m];
    h.name && h.type === "checkbox" && (_[h.name] = (_[h.name] || 0) + 1);
  }
  for (let m = 0; m < v.length; m++) {
    const h = v[m];
    if (h.type === "file" || h.type === "submit" || h.type === "button") continue;
    const l = h.getAttribute("data-ln-fill-as") || h.name;
    if (!l || !(l in c)) continue;
    const p = c[l];
    if (h.type === "checkbox") {
      if (Array.isArray(p))
        h.checked = p.indexOf(h.value) !== -1;
      else if (_[h.name] > 1) {
        const s = String(p).split(",").map(function(d) {
          return d.trim();
        });
        h.checked = s.indexOf(h.value) !== -1;
      } else
        h.checked = Te(p);
      y.push(h);
    } else if (h.type === "radio")
      h.checked = h.value === String(p), y.push(h);
    else if (h.type === "select-multiple") {
      if (Array.isArray(p))
        for (let s = 0; s < h.options.length; s++)
          h.options[s].selected = p.indexOf(h.options[s].value) !== -1;
      y.push(h);
    } else
      h.value = p, y.push(h);
  }
  return y;
}
const $t = {
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
function W(u) {
  const c = u ? u.closest("[lang]") : null, v = (c ? c.getAttribute("lang") || c.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!v) return "en-US";
  const y = v.trim().toLowerCase();
  return y.indexOf("-") === -1 && $t[y] ? $t[y] : v;
}
function Yt(u) {
  return u.hasAttribute("data-ln-value") ? u.getAttribute("data-ln-value") : u.textContent.trim();
}
function se(u, c, { get: v, set: y }) {
  Object.defineProperty(u, "value", {
    get: function() {
      return v ? v.call(this) : c.get.call(this);
    },
    set: function(_) {
      y ? y.call(this, _, (m) => c.set.call(this, m)) : c.set.call(this, _);
    },
    configurable: !0
  });
}
function H(u, c, v, y, _ = {}) {
  const m = _.extraAttributes || [], h = _.onAttributeChange || null, l = _.onInit || null;
  function p(s) {
    const d = s || document.body;
    Nt(d, u, c, v), l && l(d);
  }
  return it(function() {
    const s = new MutationObserver(function(f) {
      for (let n = 0; n < f.length; n++) {
        const e = f[n];
        if (e.type === "childList") {
          for (let a = 0; a < e.addedNodes.length; a++) {
            const i = e.addedNodes[a];
            i.nodeType === 1 && (Nt(i, u, c, v), l && l(i));
          }
          for (let a = 0; a < e.removedNodes.length; a++) {
            const i = e.removedNodes[a];
            if (i.nodeType === 1) {
              const o = u.indexOf("[") !== -1 || u.indexOf(".") !== -1 || u.indexOf("#") !== -1 ? u : "[" + u + "]", r = Array.from(i.querySelectorAll(o));
              i.matches && i.matches(o) && r.push(i);
              for (let g = 0; g < r.length; g++) {
                const b = r[g];
                if (!document.contains(b)) {
                  const w = b[c];
                  w && typeof w.destroy == "function" && w.destroy();
                }
              }
            }
          }
        } else e.type === "attributes" && (h && e.target[c] ? h(e.target, e.attributeName) : (Nt(e.target, u, c, v), l && l(e.target)));
      }
    });
    let d = [];
    if (u.indexOf("[") !== -1) {
      const f = /\[([\w-]+)/g;
      let n;
      for (; (n = f.exec(u)) !== null; )
        d.push(n[1]);
    } else
      d.push(u);
    s.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: d.concat(m)
    });
  }, y || (u.indexOf("[") === -1 ? u.replace("data-", "") : "component")), window[c] = p, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body), p;
}
function ae(u, c) {
  if (u.ctrlKey || u.metaKey || u.shiftKey || u.altKey || u.button !== 0 || !c) return !1;
  const v = c.getAttribute("href");
  return !(!v || c.getAttribute("target") === "_blank" || c.hasAttribute("download") || v.startsWith("mailto:") || v.startsWith("tel:") || v === "#" || v.startsWith("#") || c.hostname && c.hostname !== window.location.hostname);
}
function Y(...u) {
  return u.filter((c) => c != null && c !== "").map((c, v) => v === 0 ? c.replace(/\/+$/, "") : c.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function bt(u, c) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, u, c ? { Authorization: c } : null);
}
function le(u, c = "ln-core") {
  try {
    return u ? JSON.parse(u) : {};
  } catch (v) {
    return console.error(`[${c}] Invalid headers JSON:`, v), {};
  }
}
const ce = {};
function qe(u, c) {
  ce[u] = c;
}
function ke(u) {
  return ce[u] || { ingress: (c) => c, egress: (c) => c };
}
const de = {};
function jt(u, c) {
  if (!u || typeof c != "object") return;
  const v = u.toLowerCase().split("-")[0];
  de[v] = c;
}
function At(u) {
  if (!u) return null;
  const c = u.toLowerCase().split("-")[0];
  return de[c] || null;
}
jt("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = qe, window.lnCore.getDataMapper = ke, window.lnCore.registerLocaleFallback = jt, window.lnCore.getLocaleFallback = At, window.lnCore.fillTemplate = Ct, window.lnCore.fill = et, window.lnCore.lnFill = Se, window.lnCore.renderList = Ce);
function Vt(u, c) {
  let v = !1;
  return function() {
    v || (v = !0, queueMicrotask(function() {
      v = !1, u(), c && c();
    }));
  };
}
function ue(u) {
  u = u || {};
  let c = u.windowSize > 0 ? u.windowSize : 1e3, v = u.pageSize > 0 ? u.pageSize : 200, y = u.threshold != null ? u.threshold : 25, _ = u.fetchDebounce != null ? u.fetchDebounce : 120;
  const m = typeof u.requestPage == "function" ? u.requestPage : function() {
  }, h = typeof u.onChange == "function" ? u.onChange : function() {
  }, l = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let d = 0, f = 0, n = 0, e = { sort: null, filters: {}, search: "" }, a = null, i = 0;
  function t(b) {
    p.set(b, ++i);
  }
  function o() {
    return !!(e && (e.search || e.filters && Object.keys(e.filters).length));
  }
  function r() {
    if (l.size <= c) return;
    const b = Array.from(l.keys()).sort(function(E, A) {
      return (p.get(E) || 0) - (p.get(A) || 0);
    });
    let w = 0;
    for (; l.size > c && w < b.length; )
      l.delete(b[w]), p.delete(b[w]), w++;
  }
  function g(b, w) {
    s.add(b), m(e, b, w);
  }
  return {
    get: function(b) {
      return l.get(b);
    },
    has: function(b) {
      return l.has(b);
    },
    peek: function() {
      return l.size ? l.values().next().value : void 0;
    },
    get logicalTotal() {
      return d;
    },
    get grandTotal() {
      return f;
    },
    get queryGen() {
      return n;
    },
    get size() {
      return l.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(b, w) {
      for (let D = b; D < w; D++)
        l.has(D) && t(D);
      if (d <= 0) return;
      const E = Math.max(0, b - y), A = Math.min(d, w + y), L = Math.floor(E / v), T = Math.floor(Math.max(0, A - 1) / v);
      let k = -1, x = v;
      for (let D = L; D <= T; D++) {
        const N = D * v, O = Math.min(v, d - N);
        let F = !1;
        for (let U = N; U < N + O; U++)
          if (!l.has(U)) {
            F = !0;
            break;
          }
        if (F && !s.has(N)) {
          k = N, x = O;
          break;
        }
      }
      k !== -1 && (clearTimeout(a), a = setTimeout(function() {
        g(k, x);
      }, _));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(b) {
      if (b = b || {}, b.queryGen != null && b.queryGen !== n) return;
      f = b.total != null ? b.total : f, d = b.filtered != null ? b.filtered : b.data ? b.data.length : d;
      const w = b.offset || 0, E = b.data || [];
      for (let A = 0; A < E.length; A++)
        l.set(w + A, E[A]), t(w + A);
      s.delete(w), r(), h();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(b) {
      b && (e = b), g(0, v);
    },
    // Query change: new generation, drop everything, refetch page 0, then
    // notify for an immediate all-placeholder repaint at the stale height.
    invalidate: function(b) {
      n++, l.clear(), p.clear(), s.clear(), clearTimeout(a), b && (e = b), g(0, v), h();
    },
    destroy: function() {
      clearTimeout(a), l.clear(), p.clear(), s.clear();
    },
    configure: function(b) {
      b = b || {};
      let w = !1;
      if (b.windowSize != null && b.windowSize > 0 && b.windowSize !== c) {
        const E = b.windowSize < c;
        c = b.windowSize, E && r(), w = !0;
      }
      b.pageSize != null && b.pageSize > 0 && (v = b.pageSize), b.threshold != null && b.threshold >= 0 && (y = b.threshold), b.fetchDebounce != null && b.fetchDebounce >= 0 && (_ = b.fetchDebounce), w && h();
    },
    setGrandTotal: function(b) {
      b == null || isNaN(b) || b < 0 || (f = b, o() || (d = b), h());
    }
  };
}
const xe = "ln:";
let mt = null;
function he() {
  if (mt !== null) return mt;
  try {
    if (typeof localStorage > "u")
      return mt = !1, !1;
    const u = "__ln_test__";
    localStorage.setItem(u, u), localStorage.removeItem(u), mt = !0;
  } catch {
    mt = !1;
  }
  return mt;
}
function De() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function fe(u, c) {
  const v = c.getAttribute("data-ln-persist"), y = v !== null && v !== "" ? v : c.id;
  return y ? xe + u + ":" + De() + ":" + y : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', c), null);
}
function It(u, c) {
  if (!he()) return null;
  const v = fe(u, c);
  if (!v) return null;
  try {
    const y = localStorage.getItem(v);
    return y !== null ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
function ft(u, c, v) {
  if (!he()) return;
  const y = fe(u, c);
  if (y)
    try {
      v == null ? localStorage.removeItem(y) : localStorage.setItem(y, JSON.stringify(v));
    } catch {
    }
}
function pe(u) {
  return (u || "").replace(/^#/, "");
}
function Rt(u) {
  const c = u === void 0 ? location.hash : u, v = {}, y = pe(c);
  if (!y) return v;
  const _ = y.split("&");
  for (let m = 0; m < _.length; m++) {
    const h = _[m];
    if (!h) continue;
    const l = h.indexOf(":"), p = l > -1 ? h.slice(0, l) : h, s = l > -1 ? h.slice(l + 1) : "";
    if (p)
      try {
        v[p] = decodeURIComponent(s);
      } catch {
        v[p] = s;
      }
  }
  return v;
}
function ut(u) {
  if (!u) return null;
  const c = Rt();
  return u in c ? c[u] : null;
}
function nt(u, c) {
  if (!u) return;
  const v = Rt();
  c == null ? delete v[u] : v[u] = String(c);
  const _ = Object.keys(v).map(function(m) {
    const h = v[m];
    return h === "" ? m : m + ":" + encodeURIComponent(h);
  }).join("&");
  pe(location.hash) !== _ && (location.hash = _);
}
function Wt(u) {
  return u.button === 1 || u.ctrlKey || u.metaKey || u.shiftKey ? !1 : (u.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Rt, window.lnCore.hashGet = ut, window.lnCore.hashSet = nt, window.lnCore.hashLinkClick = Wt);
function xt(u, c, v, y) {
  const _ = typeof y == "number" ? y : 4, m = window.innerWidth, h = window.innerHeight, l = c.width, p = c.height, s = (v || "bottom").split("-"), d = s[0], f = s[1] === "start" || s[1] === "end" ? s[1] : "center", n = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, e = n[d] || n.bottom;
  function a(g) {
    return g === "top" || g === "bottom" ? f === "start" ? u.left : f === "end" ? u.right - l : u.left + (u.width - l) / 2 : f === "start" ? u.top : f === "end" ? u.bottom - p : u.top + (u.height - p) / 2;
  }
  function i(g) {
    let b, w, E = !0;
    return g === "top" ? (b = u.top - _ - p, w = a(g), b < 0 && (E = !1)) : g === "bottom" ? (b = u.bottom + _, w = a(g), b + p > h && (E = !1)) : g === "left" ? (b = a(g), w = u.left - _ - l, w < 0 && (E = !1)) : (b = a(g), w = u.right + _, w + l > m && (E = !1)), { top: b, left: w, side: g, fits: E };
  }
  let t = null;
  for (let g = 0; g < e.length; g++) {
    const b = i(e[g]);
    if (b.fits) {
      t = b;
      break;
    }
  }
  t || (t = i(e[0]));
  let o = t.top, r = t.left;
  return l >= m ? r = 0 : (r < 0 && (r = 0), r + l > m && (r = m - l)), p >= h ? o = 0 : (o < 0 && (o = 0), o + p > h && (o = h - p)), { top: o, left: r, placement: t.side };
}
function Pt(u) {
  if (!u) return { width: 0, height: 0 };
  const c = u.style, v = c.visibility, y = c.display, _ = c.position;
  c.visibility = "hidden", c.display = "block", c.position = "fixed";
  const m = u.offsetWidth, h = u.offsetHeight;
  return c.visibility = v, c.display = y, c.position = _, { width: m, height: h };
}
let dt = null;
async function Xt(u) {
  if (!u) {
    dt = null;
    return;
  }
  try {
    const c = new TextEncoder(), v = await crypto.subtle.digest("SHA-256", c.encode(u));
    dt = await crypto.subtle.importKey(
      "raw",
      v,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (c) {
    console.error("[ln-core/crypto] Key derivation failed:", c), dt = null;
  }
}
function _t() {
  return dt;
}
async function Ie(u, c = dt) {
  const v = c || dt;
  if (!v || u === void 0 || u === null) return u;
  try {
    const y = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), m = typeof u == "string" ? u : JSON.stringify(u), h = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      v,
      y.encode(m)
    ), l = btoa(String.fromCharCode(..._)), p = btoa(String.fromCharCode(...new Uint8Array(h)));
    return {
      encrypted: !0,
      iv: l,
      data: p
    };
  } catch (y) {
    return console.error("[ln-core/crypto] Encryption failed:", y), u;
  }
}
async function Re(u, c = dt) {
  const v = c || dt;
  if (!u || !u.encrypted || !v) return u;
  try {
    const y = new TextDecoder(), _ = Uint8Array.from(atob(u.iv), (p) => p.charCodeAt(0)), m = Uint8Array.from(atob(u.data), (p) => p.charCodeAt(0)), h = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      v,
      m
    ), l = y.decode(h);
    try {
      return JSON.parse(l);
    } catch {
      return l;
    }
  } catch (y) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", y), { ...u, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const u = window.fetch.bind(window), c = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  function y(s) {
    return typeof s == "string" ? s : s instanceof URL ? s.href : s instanceof Request ? s.url : String(s);
  }
  function _(s, d) {
    return d && d.method ? String(d.method).toUpperCase() : s instanceof Request ? s.method.toUpperCase() : "GET";
  }
  function m(s, d) {
    return d + " " + s;
  }
  function h(s) {
    return s === "GET" || s === "HEAD";
  }
  function l(s, d) {
    d = d || {};
    const f = y(s), n = _(s, d), e = m(f, n);
    h(n) && c.has(e) && (c.get(e).abort(), c.delete(e));
    const a = new AbortController(), i = d.signal;
    let t = null;
    i && (i.aborted ? a.abort(i.reason) : (t = function() {
      a.abort(i.reason);
    }, i.addEventListener("abort", t, { once: !0 })));
    const o = Object.assign({}, d, { signal: a.signal });
    return c.set(e, a), u(s, o).finally(function() {
      i && t && i.removeEventListener("abort", t), c.get(e) === a && c.delete(e);
    });
  }
  l.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = l;
  function p(s) {
    if (!s.detail || !s.detail.url) return;
    const d = s.target, f = (s.detail.method || (s.detail.body ? "POST" : "GET")).toUpperCase(), n = s.detail.key;
    n && v.has(n) && (v.get(n).abort(), v.delete(n));
    const e = new AbortController(), a = s.detail.signal;
    let i = null;
    a && (a.aborted ? e.abort(a.reason) : (i = function() {
      e.abort(a.reason);
    }, a.addEventListener("abort", i, { once: !0 }))), n && v.set(n, e);
    const t = { method: f, signal: e.signal };
    s.detail.body !== void 0 && (t.body = s.detail.body), window.fetch(s.detail.url, t).then(function(o) {
      a && i && a.removeEventListener("abort", i), n && v.get(n) === e && v.delete(n), S(d, "ln-http:response", {
        ok: o.ok,
        status: o.status,
        response: o
      });
    }).catch(function(o) {
      a && i && a.removeEventListener("abort", i), n && v.get(n) === e && v.delete(n), !(o && o.name === "AbortError") && S(d, "ln-http:error", {
        ok: !1,
        status: 0,
        error: o
      });
    });
  }
  document.addEventListener("ln-http:request", p), window.lnHttp = {
    cancel: function(s) {
      let d = !1;
      return c.forEach(function(f, n) {
        n.endsWith(" " + s) && (f.abort(), c.delete(n), d = !0);
      }), d;
    },
    cancelByKey: function(s) {
      return v.has(s) ? (v.get(s).abort(), v.delete(s), !0) : !1;
    },
    cancelAll: function() {
      c.forEach(function(s) {
        s.abort();
      }), c.clear(), v.forEach(function(s) {
        s.abort();
      }), v.clear();
    },
    get inflight() {
      const s = [];
      return c.forEach(function(d, f) {
        const n = f.indexOf(" ");
        s.push({ method: f.slice(0, n), url: f.slice(n + 1) });
      }), v.forEach(function(d, f) {
        s.push({ key: f });
      }), s;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", p), window.fetch = u, delete window.lnHttp;
    }
  };
})();
(function() {
  const u = "data-ln-form", c = "lnForm", v = "data-ln-form-action-edit", y = "data-ln-form-action-method";
  if (window[c] !== void 0) return;
  function _(m) {
    this.dom = m, this._baseAction = m.getAttribute("action") || "";
    const h = this;
    return this._onLnFill = function(l) {
      l.target === h.dom && (l.detail ? (h.fill(l.detail), h._applyActionMode(l.detail)) : h.dom.reset());
    }, this._onReset = function() {
      h._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  _.prototype.fill = function(m) {
    const h = oe(this.dom, m);
    for (let l = 0; l < h.length; l++) {
      const p = h[l], s = p.tagName === "SELECT" || p.type === "checkbox" || p.type === "radio";
      p.dispatchEvent(new Event(s ? "change" : "input", { bubbles: !0 }));
    }
  }, _.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, _.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute(v)) return;
    const h = m && m.id != null && m.id !== "" ? m.id : null, l = this._ensureMethodInput();
    if (h !== null) {
      const p = this.dom.getAttribute(v);
      p ? this.dom.setAttribute("action", p.replace(":id", encodeURIComponent(h))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(h)), l.value = this.dom.getAttribute(y) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), l.value = "";
  }, _.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[c]);
  }, H(u, c, _, "ln-form");
})();
(function() {
  const u = "data-ln-validate", c = "lnValidate", v = "data-ln-validate-errors", y = "data-ln-validate-error", _ = "ln-validate-valid", m = "ln-validate-invalid", h = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[c] !== void 0) return;
  function l(p) {
    this.dom = p, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const s = this, d = p.tagName, f = p.type, n = d === "SELECT" || f === "checkbox" || f === "radio";
    this._onInput = function() {
      s._touched = !0, s.validate();
    }, this._onChange = function() {
      s._touched = !0, s.validate();
    }, this._onSetCustom = function(a) {
      const i = a.detail && a.detail.error;
      if (!i) return;
      s._customErrors.add(i), s._touched = !0;
      const t = p.closest(".form-element");
      if (t) {
        const o = t.querySelector("[" + y + '="' + i + '"]');
        o && o.classList.remove("hidden");
      }
      p.classList.remove(_), p.classList.add(m), p.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(a) {
      const i = a.detail && a.detail.error, t = p.closest(".form-element");
      if (i) {
        if (s._customErrors.delete(i), t) {
          const o = t.querySelector("[" + y + '="' + i + '"]');
          o && o.classList.add("hidden");
        }
      } else
        s._customErrors.forEach(function(o) {
          if (t) {
            const r = t.querySelector("[" + y + '="' + o + '"]');
            r && r.classList.add("hidden");
          }
        }), s._customErrors.clear();
      s._touched && s.validate();
    }, n || p.addEventListener("input", this._onInput), p.addEventListener("change", this._onChange), p.addEventListener("ln-validate:set-custom", this._onSetCustom), p.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const e = p.form;
    return e && (e.hasAttribute("novalidate") || e.setAttribute("novalidate", ""), this._onFormReset = function() {
      s.reset();
    }, this._onValidateRequest = function(a) {
      s._touched = !0, !s.validate() && a.detail && a.detail.invalidFields && a.detail.invalidFields.push(s.dom);
    }, e.addEventListener("reset", this._onFormReset), e.addEventListener("ln-validate:request-validate", this._onValidateRequest), e._lnValidateGateBound || (e._lnValidateGateBound = !0, e.addEventListener("submit", function(a) {
      const i = { invalidFields: [] };
      S(e, "ln-validate:request-validate", i), i.invalidFields.length > 0 && (a.preventDefault(), i.invalidFields.sort((t, o) => t.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), i.invalidFields[0].focus());
    }))), this;
  }
  l.prototype.validate = function() {
    const p = this.dom, s = p.validity, f = p.checkValidity() && this._customErrors.size === 0, n = p.closest(".form-element");
    if (n) {
      const a = n.querySelector("[" + v + "]");
      if (a) {
        const i = a.querySelectorAll("[" + y + "]");
        for (let t = 0; t < i.length; t++) {
          const o = i[t].getAttribute(y), r = h[o];
          r && (s[r] ? i[t].classList.remove("hidden") : i[t].classList.add("hidden"));
        }
      }
    }
    return p.classList.toggle(_, f), p.classList.toggle(m, !f), p.setAttribute("aria-invalid", f ? "false" : "true"), S(p, f ? "ln-validate:valid" : "ln-validate:invalid", { target: p, field: p.name }), f;
  }, l.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, m), this.dom.removeAttribute("aria-invalid");
    const p = this.dom.closest(".form-element");
    if (p) {
      const s = p.querySelectorAll("[" + y + "]");
      for (let d = 0; d < s.length; d++)
        s[d].classList.add("hidden");
    }
  }, Object.defineProperty(l.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), l.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const p = this.dom.form;
    p && (this._onFormReset && p.removeEventListener("reset", this._onFormReset), this._onValidateRequest && p.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(_, m), this.dom.removeAttribute("aria-invalid"), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[c];
  }, H(u, c, l, "ln-validate");
})();
(function() {
  const u = "data-ln-ajax", c = "lnAjax", v = "data-ln-form-scope";
  if (window[c] !== void 0) return;
  function y(f) {
    if (!f.hasAttribute(u) || f[c]) return;
    f[c] = !0;
    const n = p(f);
    _(n.links), m(n.forms);
  }
  function _(f) {
    for (const n of f) {
      if (n[c + "Trigger"] || n.hostname && n.hostname !== window.location.hostname) continue;
      const e = n.getAttribute("href");
      if (e && e.includes("#")) continue;
      const a = function(i) {
        if (!ae(i, n)) return;
        i.preventDefault();
        const t = n.getAttribute("href");
        t && l("GET", t, null, n);
      };
      n.addEventListener("click", a), n[c + "Trigger"] = a;
    }
  }
  function m(f) {
    for (const n of f) {
      if (n[c + "Trigger"]) continue;
      if (n.hasAttribute(v)) {
        n[c + "ScopeWarned"] || (n[c + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const e = function(a) {
        if (a.defaultPrevented) return;
        a.preventDefault();
        const i = n.method.toUpperCase(), t = n.action, o = new FormData(n);
        for (const r of n.querySelectorAll('button, input[type="submit"]'))
          r.disabled = !0;
        l(i, t, o, n, function() {
          for (const r of n.querySelectorAll('button, input[type="submit"]'))
            r.disabled = !1;
        });
      };
      n.addEventListener("submit", e), n[c + "Trigger"] = e;
    }
  }
  function h(f) {
    if (!f[c]) return;
    const n = p(f);
    for (const e of n.links)
      e[c + "Trigger"] && (e.removeEventListener("click", e[c + "Trigger"]), delete e[c + "Trigger"]);
    for (const e of n.forms)
      e[c + "Trigger"] && (e.removeEventListener("submit", e[c + "Trigger"]), delete e[c + "Trigger"]);
    delete f[c];
  }
  function l(f, n, e, a, i) {
    if ($(a, "ln-ajax:before-start", { method: f, url: n }).defaultPrevented) return;
    S(a, "ln-ajax:start", { method: f, url: n }), a.classList.add("ln-ajax--loading");
    const o = document.createElement("span");
    o.className = "ln-ajax-spinner", a.appendChild(o);
    function r() {
      a.classList.remove("ln-ajax--loading");
      const A = a.querySelector(".ln-ajax-spinner");
      A && A.remove(), i && i();
    }
    let g = n;
    const b = document.querySelector('meta[name="csrf-token"]'), w = b ? b.getAttribute("content") : null;
    e instanceof FormData && w && e.append("_token", w);
    const E = {
      method: f,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (E.headers["X-CSRF-TOKEN"] = w), f === "GET" && e) {
      const A = new URLSearchParams(e);
      g = n + (n.includes("?") ? "&" : "?") + A.toString();
    } else f !== "GET" && e && (E.body = e);
    fetch(g, E).then(function(A) {
      const L = A.ok;
      return A.json().then(function(T) {
        return { ok: L, status: A.status, data: T };
      });
    }).then(function(A) {
      const L = A.data;
      if (A.ok) {
        if (L.title && (document.title = L.title), L.content)
          for (const T in L.content) {
            const k = document.getElementById(T);
            k && (k.innerHTML = L.content[T]);
          }
        if (a.tagName === "A") {
          const T = a.getAttribute("href");
          T && window.history.pushState({ ajax: !0 }, "", T);
        } else a.tagName === "FORM" && a.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", g);
        S(a, "ln-ajax:success", { method: f, url: g, data: L });
      } else
        S(a, "ln-ajax:error", { method: f, url: g, status: A.status, data: L });
      if (L.message) {
        const T = L.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: T.type || (A.ok ? "success" : "error"),
            title: T.title || "",
            message: T.body || ""
          }
        }));
      }
      S(a, "ln-ajax:complete", { method: f, url: g }), r();
    }).catch(function(A) {
      S(a, "ln-ajax:error", { method: f, url: g, error: A }), S(a, "ln-ajax:complete", { method: f, url: g }), r();
    });
  }
  function p(f) {
    const n = { links: [], forms: [] };
    return f.tagName === "A" && f.getAttribute(u) !== "false" ? n.links.push(f) : f.tagName === "FORM" && f.getAttribute(u) !== "false" ? n.forms.push(f) : (n.links = Array.from(f.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(f.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function s() {
    it(function() {
      new MutationObserver(function(n) {
        for (const e of n)
          if (e.type === "childList") {
            for (const a of e.addedNodes)
              if (a.nodeType === 1 && (y(a), !a.hasAttribute(u))) {
                for (const t of a.querySelectorAll("[" + u + "]"))
                  y(t);
                const i = a.closest && a.closest("[" + u + "]");
                if (i && i.getAttribute(u) !== "false") {
                  const t = p(a);
                  _(t.links), m(t.forms);
                }
              }
          } else e.type === "attributes" && y(e.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-ajax");
  }
  function d() {
    for (const f of document.querySelectorAll("[" + u + "]"))
      y(f);
  }
  window[c] = y, window[c].destroy = h, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
const me = {
  navigate: function(u) {
    St(u, { historyAction: "push" });
  },
  replace: function(u) {
    St(u, { historyAction: "replace" });
  },
  current: function() {
    return Ht ? {
      path: Bt,
      params: be,
      query: ye,
      route: Ht,
      regions: ge
    } : null;
  }
}, Gt = "data-ln-route", _e = "lnRoute";
typeof window < "u" && (window.lnRouter = me);
const at = /* @__PURE__ */ new Map(), Jt = /* @__PURE__ */ new WeakMap();
let ge = /* @__PURE__ */ new Map(), Zt = !1, Bt = null, be = {}, ye = {}, Ht = null, Ut = !1;
function te(u, c, v) {
  Ut ? queueMicrotask(function() {
    S(u, c, v);
  }) : S(u, c, v);
}
function Dt(u) {
  try {
    const m = new URL(u, window.location.origin);
    u = m.pathname + m.search + m.hash;
  } catch {
  }
  let [c] = u.split("#"), [v, y] = c.split("?");
  const _ = {};
  if (y) {
    const m = new URLSearchParams(y);
    for (const [h, l] of m.entries())
      _[h] = l;
  }
  return v = v.replace(/\/+$/, ""), v === "" && (v = "/"), { path: v, query: _ };
}
function ve(u, c) {
  if (u.pattern === "*") return 1;
  if (c.pattern === "*") return -1;
  const v = u.segments, y = c.segments, _ = Math.max(v.length, y.length);
  for (let m = 0; m < _; m++) {
    const h = v[m], l = y[m];
    if (h === void 0) return 1;
    if (l === void 0) return -1;
    if (h === "*") return 1;
    if (l === "*") return -1;
    const p = h.startsWith(":"), s = l.startsWith(":");
    if (p && !s) return 1;
    if (!p && s) return -1;
  }
  return 0;
}
function Ee(u, c) {
  const v = u.split("/").filter(Boolean);
  for (const y of c) {
    if (y.pattern === "*")
      return {
        route: y,
        params: { wildcard: u }
      };
    const _ = y.segments, m = {};
    let h = !0;
    if (!(v.length > _.length && _[_.length - 1] !== "*")) {
      for (let l = 0; l < _.length; l++) {
        const p = _[l], s = v[l];
        if (p === "*") {
          m.wildcard = v.slice(l).join("/");
          break;
        }
        if (s === void 0) {
          h = !1;
          break;
        }
        if (p.startsWith(":"))
          m[p.slice(1)] = decodeURIComponent(s);
        else if (p !== s) {
          h = !1;
          break;
        }
      }
      if (h && (_.indexOf("*") !== -1 || v.length <= _.length))
        return { route: y, params: m };
    }
  }
  return null;
}
function zt(u, c) {
  if (u !== "__primary__") {
    const y = document.getElementById(c.target);
    return y || console.warn(`[ln-router] Explicit target element #${c.target} not found in DOM`), y;
  }
  const v = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return v || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), v;
}
function Oe(u) {
  if (!u) return;
  const c = Array.from(u.querySelectorAll("*")), v = [u].concat(c);
  for (const _ of v)
    for (const m of Object.keys(_))
      if (m.startsWith("ln") && _[m] && typeof _[m].destroy == "function")
        try {
          _[m].destroy();
        } catch (h) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, _, h);
        }
  const y = document.querySelectorAll('[data-ln-popover="open"]');
  for (const _ of y) {
    const m = _.lnPopover;
    if (m && m.trigger && u.contains(m.trigger))
      try {
        m.destroy();
      } catch (h) {
        console.error("[ln-router] Error destroying open popover:", h);
      }
  }
}
function St(u, c = {}) {
  const { path: v, query: y } = Dt(u), _ = /* @__PURE__ */ new Map();
  for (const [d, f] of at)
    _.set(d, Ee(v, f.sorted));
  const m = at.has("__primary__"), h = _.get("__primary__");
  if (m && !h) {
    te(document.body, "ln-router:not-found", { path: v });
    return;
  }
  let l = null;
  if (h && (l = zt("__primary__", h.route), !l || $(l, "ln-router:before-navigate", {
    from: Bt,
    to: u,
    params: h.params,
    query: y
  }).defaultPrevented))
    return;
  const p = [];
  for (const [d, f] of _) {
    if (!f) continue;
    const n = zt(d, f.route);
    n && (d !== "__primary__" && n.hasAttribute("data-ln-route-keep") && Jt.get(n) === f.route.templateNode || p.push({ regionKey: d, match: f, targetEl: n }));
  }
  c.historyAction === "push" ? window.history.pushState(null, "", u) : c.historyAction === "replace" && window.history.replaceState(null, "", u);
  const s = function() {
    for (const { regionKey: d, match: f, targetEl: n } of p) {
      if (!(c.isHydration && n.hasAttribute("data-ln-router-hydrate") && n.children.length > 0)) {
        Oe(n);
        const a = f.route.templateNode.content.cloneNode(!0);
        n.replaceChildren(a);
      }
      if (Jt.set(n, f.route.templateNode), d === "__primary__" && (f.route.title && (document.title = f.route.title), !c.isHydration)) {
        n.hasAttribute("tabindex") || n.setAttribute("tabindex", "-1");
        const a = n.querySelector("h1, h2, h3, h4, h5, h6");
        a ? (a.setAttribute("tabindex", "-1"), a.focus()) : n.focus(), n.scrollIntoView({ block: "start", behavior: "instant" });
      }
      te(n, "ln-router:navigated", {
        path: u,
        params: f.params,
        query: y,
        route: f.route,
        target: n,
        region: d
      });
    }
    h && (Bt = u, be = h.params, ye = y, Ht = h.route), ge = new Map(
      Array.from(_.entries()).map(([d, f]) => [d, f ? { route: f.route, params: f.params } : null])
    );
  };
  document.startViewTransition && !c.isHydration ? document.startViewTransition(s) : s();
}
function Me(u) {
  const c = u.target.closest("a");
  if (!c || !ae(u, c)) return;
  const v = c.getAttribute("href"), { path: y } = Dt(v), _ = at.get("__primary__");
  if (!_) return;
  Ee(y, _.sorted) && (u.preventDefault(), St(v, { historyAction: "push" }));
}
function Ne(u, c) {
  const v = Object.keys(u), y = Object.keys(c);
  if (v.length !== y.length) return !1;
  for (let _ = 0; _ < v.length; _++) {
    const m = v[_];
    if (u[m] !== c[m]) return !1;
  }
  return !0;
}
function Fe() {
  const u = window.location.pathname + window.location.search, c = me.current();
  if (c && c.path != null) {
    const v = Dt(u);
    if (Dt(c.path).path === v.path && Ne(c.query, v.query))
      return;
  }
  St(u, { historyAction: "skip" });
}
function Pe() {
  Zt || (Zt = !0, it(function() {
    document.addEventListener("click", Me), window.addEventListener("popstate", Fe), Ut = !0;
    const u = window.location.pathname + window.location.search + window.location.hash;
    St(u, { historyAction: "replace", isHydration: !0 }), Ut = !1;
  }, "ln-router"));
}
function Be(u) {
  const c = u.getAttribute(Gt);
  if (!c) return;
  const v = u.getAttribute("data-ln-route-target") || null;
  if (v === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${c}" rejected.`);
    return;
  }
  const y = v || "__primary__";
  at.has(y) || at.set(y, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const _ = at.get(y);
  if (_.routes.has(c)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${c}" in region "${y}"`);
    return;
  }
  const m = u.getAttribute("data-ln-route-title"), h = c.split("/").filter(Boolean), l = {
    pattern: c,
    segments: h,
    target: v,
    title: m,
    templateNode: u
  }, p = zt(y, l);
  p && p.contains(u) && console.warn(`[ln-router] Route template with pattern "${c}" is declared inside its own outlet element:`, u), _.routes.set(c, l), _.sorted = Array.from(_.routes.values()).sort(ve);
}
function He(u) {
  const c = u.getAttribute(Gt);
  if (!c) return;
  const y = u.getAttribute("data-ln-route-target") || null || "__primary__", _ = at.get(y);
  _ && (_.routes.delete(c), _.sorted = Array.from(_.routes.values()).sort(ve), _.routes.size === 0 && at.delete(y));
}
function we(u) {
  return this.dom = u, Be(u), this;
}
we.prototype.destroy = function() {
  He(this.dom), delete this.dom[_e];
};
H(Gt, _e, we, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    at.size > 0 && Pe();
  }
});
(function() {
  const u = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0) return;
  function v(_) {
    this.dom = _, this.isOpen = _.getAttribute(u) === "open";
    const m = this;
    return this._onRequestOpen = function() {
      m.dom.setAttribute(u, "open");
    }, this._onRequestClose = function() {
      m.dom.setAttribute(u, "close");
    }, this._onCancel = function(h) {
      h.preventDefault(), m.dom.setAttribute(u, "close");
    }, this._onClickClose = function(h) {
      const l = h.target.closest("[data-ln-modal-close]");
      l && m.dom.contains(l) && (h.preventDefault(), m.dom.setAttribute(u, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  v.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + u + '="open"]'),
          function(h) {
            return h !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[c];
    }
  };
  function y(_) {
    const m = _[c];
    if (!m) return;
    const l = _.getAttribute(u) === "open";
    if (l !== m.isOpen)
      if (l) {
        if ($(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(u, "close");
          return;
        }
        m.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof _.showModal == "function" && _.showModal();
        const s = _.querySelector("[autofocus]");
        if (s && qt(s))
          s.focus();
        else {
          const d = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), f = Array.prototype.find.call(d, qt);
          if (f) f.focus();
          else {
            const n = _.querySelectorAll("a[href], button:not([disabled])"), e = Array.prototype.find.call(n, qt);
            e && e.focus();
          }
        }
        S(_, "ln-modal:open", { modalId: _.id, target: _ });
      } else {
        if ($(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(u, "open");
          return;
        }
        m.isOpen = !1, S(_, "ln-modal:close", { modalId: _.id, target: _ }), typeof _.close == "function" && _.close(), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  H(u, c, v, "ln-modal", {
    onAttributeChange: y
  });
})();
(function() {
  const u = "data-ln-modal-coordinator", c = "lnModalCoordinator";
  if (window[c] !== void 0) return;
  function v(f, n) {
    if (n) {
      if (f) {
        const a = f.closest("[" + u + "]");
        if (a) {
          if (a.id === n && a.hasAttribute("data-ln-modal")) return a;
          const i = a.querySelector("#" + CSS.escape(n) + '[data-ln-modal], [data-ln-modal="' + n + '"]');
          if (i) return i;
        }
      }
      const e = document.getElementById(n) || document.querySelector('[data-ln-modal="' + n + '"]');
      if (e) return e;
    }
    if (f) {
      const e = f.closest("[" + u + "]");
      if (e) {
        if (e.hasAttribute("data-ln-modal")) return e;
        const i = e.querySelector("[data-ln-modal]");
        if (i) return i;
      }
      const a = f.closest("[data-ln-modal]");
      if (a) return a;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function y(f, n) {
    if (f !== "edit") return "";
    if (n) {
      const e = n.getAttribute("data-ln-fill-id");
      if (e) return e;
    }
    return "edit";
  }
  function _(f) {
    if (!f) return;
    const n = f.querySelectorAll("[data-ln-field]");
    for (let a = 0; a < n.length; a++)
      n[a].textContent = "";
    const e = f.querySelectorAll("form");
    for (let a = 0; a < e.length; a++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(e[a], null) : e[a].reset();
  }
  document.addEventListener("submit", function(f) {
    if (f.defaultPrevented) return;
    const e = f.target.closest("[data-ln-modal]");
    if (e && e.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + e.id, "true");
      } catch {
      }
      nt(e.id, null);
    }
  }), document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const n = f.target.closest("[data-ln-modal-for]");
    if (n) {
      const a = n.getAttribute("data-ln-modal-for"), i = v(n, a);
      if (i && i.lnModal) {
        f.preventDefault();
        const t = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, o = {}, r = n.dataset;
        for (const w in r) {
          if (!w.startsWith("lnModal") || t[w]) continue;
          const E = w.slice(7);
          E && (o[E.charAt(0).toLowerCase() + E.slice(1)] = r[w]);
        }
        const g = Object.keys(o).length > 0;
        n.hasAttribute("data-ln-modal-mode") ? i.dataset.lnModalMode = n.getAttribute("data-ln-modal-mode") : i.dataset.lnModalMode = g ? "edit" : "new", g && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(i, o) : i.dataset.lnModalMode === "new" && _(i), i.getAttribute("data-ln-modal") === "open" ? S(i, "ln-modal:request-close", {}) : (i.id && nt(i.id, y(i.dataset.lnModalMode, n)), S(i, "ln-modal:request-open", {}));
      }
      return;
    }
    const e = f.target.closest('a[href^="#"]');
    if (e) {
      const a = Rt(e.getAttribute("href"));
      for (const i in a) {
        const t = document.getElementById(i);
        if (t && t.lnModal) {
          if (!Wt(f)) return;
          nt(i, a[i]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(f) {
    const n = f.target;
    if (!n || !n.lnModal) return;
    (n.dataset.lnModalMode || "new") === "new" && _(n);
  }), document.addEventListener("ln-modal:open", function(f) {
    const n = f.target;
    if (!n || !n.lnModal || !n.id) return;
    let e = ut(n.id);
    e === null && (e = y(n.dataset.lnModalMode, null), nt(n.id, e)), e ? (n.dataset.lnModalMode = "edit", n.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: e }
    }))) : (n.dataset.lnModalMode = "new", _(n));
  });
  let m = !1;
  function h() {
    if (!m) {
      m = !0;
      try {
        const f = document.querySelectorAll("[data-ln-modal][id]");
        for (let n = 0; n < f.length; n++) {
          const e = f[n];
          if (!e.lnModal) continue;
          const a = e.id, i = "ln-modal-pending:" + a;
          let t = !1;
          try {
            t = sessionStorage.getItem(i) === "true";
          } catch {
          }
          if (t) {
            try {
              sessionStorage.removeItem(i);
            } catch {
            }
            if (!!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || e.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger"))) {
              e.dataset.lnModalMode = "edit", S(e, "ln-modal:request-open", {});
              continue;
            } else {
              nt(a, null), S(e, "ln-modal:request-close", {}), _(e);
              continue;
            }
          }
          const o = ut(a), r = o !== null, g = e.lnModal.isOpen;
          if (r) {
            const b = o ? "edit" : "new";
            e.dataset.lnModalMode = b, g ? o ? e.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: o }
            })) : _(e) : S(e, "ln-modal:request-open", {});
          } else g && S(e, "ln-modal:request-close", {});
        }
      } finally {
        m = !1;
      }
    }
  }
  function l() {
    const f = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let n = 0; n < f.length; n++) {
      const e = f[n];
      e.lnModal && ut(e.id) === null && nt(e.id, y(e.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", h);
  function p() {
    l(), h();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    setTimeout(p, 0);
  }) : setTimeout(p, 0);
  function s(f) {
    const n = f.target.closest("[data-ln-modal]");
    if (!(!n || !n.lnModal)) {
      if (n.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + n.id);
        } catch {
        }
        nt(n.id, null);
      }
      S(n, "ln-modal:request-close", {}), _(n);
    }
  }
  document.addEventListener("ln-form:success", s), document.addEventListener("ln-ajax:success", s), document.addEventListener("ln-modal:close", function(f) {
    const n = f.target;
    if (!(!n || !n.lnModal)) {
      if (n.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + n.id);
        } catch {
        }
        ut(n.id) !== null && nt(n.id, null);
      }
      n.dataset.lnModalMode === "new" && _(n);
    }
  });
  function d(f) {
    return this.dom = f, this;
  }
  d.prototype.destroy = function() {
    this.dom[c] && delete this.dom[c];
  }, H(u, c, d, "ln-modal-coordinator");
})();
(function() {
  const u = "data-ln-number", c = "lnNumber";
  if (window[c] !== void 0) return;
  const v = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(s) {
    if (!v[s]) {
      const d = new Intl.NumberFormat(s, { useGrouping: !0 }), f = d.formatToParts(1234.5);
      let n = "", e = ".";
      for (let a = 0; a < f.length; a++)
        f[a].type === "group" && (n = f[a].value), f[a].type === "decimal" && (e = f[a].value);
      v[s] = { fmt: d, groupSep: n, decimalSep: e };
    }
    return v[s];
  }
  function m(s, d, f) {
    if (f !== null) {
      const n = parseInt(f, 10), e = s + "|d" + n;
      return v[e] || (v[e] = new Intl.NumberFormat(s, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: n })), v[e].format(d);
    }
    return _(s).fmt.format(d);
  }
  function h(s) {
    if (s[c]) return s[c];
    if (s[c] = this, this.dom = s, s.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const d = document.createElement("input");
    d.type = "hidden", d.name = s.name, s.removeAttribute("name"), s.hasAttribute("data-ln-fill-as") && d.setAttribute("data-ln-fill-as", s.getAttribute("data-ln-fill-as")), s.type = "text", s.setAttribute("inputmode", "decimal"), s.insertAdjacentElement("afterend", d), this._hidden = d;
    const f = this;
    Object.defineProperty(d, "value", {
      get: function() {
        return y.get.call(d);
      },
      set: function(e) {
        y.set.call(d, e), e !== "" && !isNaN(parseFloat(e)) ? f._setDisplayRaw(m(W(f.dom), parseFloat(e), f.dom.getAttribute("data-ln-number-decimals"))) : f._setDisplayRaw(""), f.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), se(s, y, {
      get: function() {
        return y.get.call(s);
      },
      set: function(e) {
        if (e === "") {
          f._setDisplayRaw(""), f._setHiddenRaw(""), s.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const a = typeof e == "number" ? e : parseFloat(String(e).replace(/[^\d.-]/g, ""));
        isNaN(a) ? (f._setDisplayRaw(String(e)), f._setHiddenRaw("")) : (f._setHiddenRaw(a), f._setDisplayRaw(m(W(s), a, s.getAttribute("data-ln-number-decimals")))), s.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      f._handleInput();
    }, s.addEventListener("input", this._onInput), this._onPaste = function(e) {
      e.preventDefault();
      const a = (e.clipboardData || window.clipboardData).getData("text"), i = _(W(s)), t = i.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let o = a.replace(new RegExp("[^0-9\\-" + t + ".]", "g"), "");
      i.groupSep && (o = o.split(i.groupSep).join("")), i.decimalSep !== "." && (o = o.replace(i.decimalSep, "."));
      const r = parseFloat(o);
      f.value = isNaN(r) ? NaN : r;
    }, s.addEventListener("paste", this._onPaste);
    const n = s.value;
    if (n !== "") {
      const e = parseFloat(n);
      isNaN(e) || (this._setHiddenRaw(e), this._setDisplayRaw(m(W(s), e, s.getAttribute("data-ln-number-decimals"))), s.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function l(s) {
    if (typeof s == "number") return isNaN(s) ? null : s;
    if (!s || typeof s != "string") return null;
    let d = s.trim();
    if (d === "") return null;
    d = d.replace(/[\s\u00A0$€£]/g, ""), d.indexOf(",") !== -1 && d.indexOf(".") !== -1 ? d.indexOf(".") < d.indexOf(",") ? d = d.replace(/\./g, "").replace(",", ".") : d = d.replace(/,/g, "") : d.indexOf(",") !== -1 && (d = d.replace(",", ".")), d = d.replace(/[^\d.-]/g, "");
    const f = parseFloat(d);
    return isNaN(f) ? null : f;
  }
  h.prototype._initTextElement = function() {
    const s = this.dom;
    let d = s.getAttribute("data-ln-value"), f = s.getAttribute("data-ln-number"), n = null;
    d !== null && d !== "" ? n = d : f !== null && f !== "" && f !== "true" ? n = f : n = s.textContent.trim();
    const e = l(n);
    e !== null ? (this._rawValue = e, s.hasAttribute("data-ln-value") || s.setAttribute("data-ln-value", String(e)), this._formatTextContent()) : this._rawValue = null;
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = m(W(this.dom), this._rawValue, s);
    }
  }, h.prototype._handleInput = function() {
    const s = this.dom, d = _(W(s)), f = y.get.call(s);
    if (f === "") {
      this._setHiddenRaw(""), S(s, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (f === "-") {
      this._setHiddenRaw("");
      return;
    }
    const n = s.selectionStart;
    let e = 0;
    for (let A = 0; A < n; A++)
      /[0-9]/.test(f[A]) && e++;
    let a = f;
    if (d.groupSep && (a = a.split(d.groupSep).join("")), a = a.replace(d.decimalSep, "."), f.endsWith(d.decimalSep) || f.endsWith(".")) {
      const A = a.replace(/\.$/, ""), L = parseFloat(A);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const i = a.indexOf(".");
    if (i !== -1 && a.slice(i + 1).endsWith("0")) {
      const L = parseFloat(a);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const t = s.getAttribute("data-ln-number-decimals");
    if (t !== null && i !== -1) {
      const A = parseInt(t, 10);
      a.slice(i + 1).length > A && (a = a.slice(0, i + 1 + A));
    }
    const o = parseFloat(a);
    if (isNaN(o)) return;
    const r = s.getAttribute("data-ln-number-min"), g = s.getAttribute("data-ln-number-max");
    if (r !== null && o < parseFloat(r) || g !== null && o > parseFloat(g)) return;
    let b;
    if (t !== null)
      b = m(W(s), o, t);
    else {
      const A = i !== -1 ? a.slice(i + 1).length : 0;
      if (A > 0) {
        const L = W(s) + "|u" + A;
        v[L] || (v[L] = new Intl.NumberFormat(W(s), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), b = v[L].format(o);
      } else
        b = d.fmt.format(o);
    }
    this._setDisplayRaw(b);
    let w = e, E = 0;
    for (let A = 0; A < b.length && w > 0; A++)
      E = A + 1, /[0-9]/.test(b[A]) && w--;
    w > 0 && (E = b.length), s.setSelectionRange(E, E), this._setHiddenRaw(o), S(s, "ln-number:input", { value: o, formatted: b });
  }, h.prototype._setHiddenRaw = function(s) {
    this._hidden && y.set.call(this._hidden, String(s));
  }, h.prototype._setDisplayRaw = function(s) {
    this.isTextElement ? this.dom.textContent = String(s) : y.set.call(this.dom, String(s));
  }, h.prototype._displayFormatted = function(s) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(m(W(this.dom), s, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const s = y.get.call(this._hidden);
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
      return this.isTextElement ? this.dom.textContent : y.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[c] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function p() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + u + "]");
      for (let d = 0; d < s.length; d++) {
        const f = s[d][c];
        f && (f.isTextElement ? f._formatTextContent() : isNaN(f.value) || f._displayFormatted(f.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(u, c, h, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(s) {
      const d = s[c];
      d && (d.isTextElement ? d._initTextElement() : isNaN(d.value) || d._displayFormatted(d.value));
    }
  }), p();
})();
(function() {
  const u = "data-ln-date", c = "lnDate";
  if (window[c] !== void 0) return;
  const v = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(r, g) {
    const b = r + "|" + JSON.stringify(g);
    return v[b] || (v[b] = new Intl.DateTimeFormat(r, g)), v[b];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, h = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function l(r) {
    return !r || r === "" ? { dateStyle: "medium" } : r.match(m) ? h[r] : null;
  }
  function p(r, g, b) {
    const w = r.getDate(), E = r.getMonth(), A = r.getFullYear(), L = r.getHours(), T = r.getMinutes();
    let k, x;
    const D = At(b), N = (b || "").toLowerCase().split("-")[0], F = _(b, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], U = D && F !== N;
    U && D.monthsLong ? k = D.monthsLong[E] : k = _(b, { month: "long" }).format(r), U && D.monthsShort ? x = D.monthsShort[E] : x = _(b, { month: "short" }).format(r);
    const lt = {
      yyyy: String(A),
      yy: String(A).slice(-2),
      MMMM: k,
      MMM: x,
      MM: String(E + 1).padStart(2, "0"),
      M: String(E + 1),
      dd: String(w).padStart(2, "0"),
      d: String(w),
      HH: String(L).padStart(2, "0"),
      mm: String(T).padStart(2, "0")
    };
    return g.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(rt) {
      return lt[rt];
    });
  }
  function s(r, g, b) {
    const w = l(g);
    if (w) {
      const E = _(b, w), A = (b || "").toLowerCase().split("-")[0], L = E.resolvedOptions().locale.toLowerCase().split("-")[0];
      return At(b) && L !== A ? p(r, "dd.MM.yyyy", b) : E.format(r);
    }
    return p(r, g, b);
  }
  function d(r) {
    if (!r) return "";
    const g = r.getFullYear(), b = String(r.getMonth() + 1).padStart(2, "0"), w = String(r.getDate()).padStart(2, "0");
    return g + "-" + b + "-" + w;
  }
  function f(r, g, b) {
    S(r.dom, "ln-date:change", {
      value: g,
      formatted: r.dom.value,
      date: b
    }), r.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function n(r, g, b, w) {
    r._setHiddenRaw(g), y.set.call(r._picker, g), r._lastISO = g, w !== void 0 ? (r._isFormatting = !0, r.dom.value = w, r._isFormatting = !1) : b && r._displayFormatted(b), f(r, g, b);
  }
  function e(r) {
    r._setHiddenRaw(""), y.set.call(r._picker, ""), r._isFormatting = !0, r.dom.value = "", r._isFormatting = !1, r._lastISO = "", f(r, "", null);
  }
  a.prototype._initTextElement = function() {
    const r = this.dom;
    let g = r.getAttribute("data-ln-value"), b = r.getAttribute("data-ln-date"), w = r.getAttribute("datetime"), E = null;
    g !== null && g !== "" ? E = g : w !== null && w !== "" ? E = w : b !== null && b !== "" && b !== "true" && !m.test(b) ? E = b : E = r.textContent.trim();
    let A = i(E) || t(E);
    if (!A && E)
      if (isNaN(E))
        A = new Date(E);
      else {
        const L = Number(E);
        A = new Date(L > 1e11 ? L : L * 1e3);
      }
    if (A && !isNaN(A.getTime())) {
      const L = d(A);
      this._rawValue = L, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", L), this._formatTextContent();
    } else
      this._rawValue = null;
  }, a.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const r = i(this._rawValue);
      if (r) {
        let b = this.dom.getAttribute("data-ln-date-format");
        if (!b) {
          const E = this.dom.getAttribute("data-ln-date");
          E && m.test(E) && (b = E);
        }
        const w = W(this.dom);
        this.dom.textContent = s(r, b || "medium", w);
      }
    }
  };
  function a(r) {
    if (r[c]) return r[c];
    if (r[c] = this, this.dom = r, r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const g = this, b = r.value, w = r.name, A = (r.closest(".form-element, form") || r.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let D = 0; D < A.length; D++) {
      const N = A[D].getAttribute("data-ln-date-dict");
      if (N) {
        const O = Kt(A[D], "data-ln-date-dict-key");
        O["months-long"] && (O.monthsLong = O["months-long"].split(",").map((F) => F.trim())), O["months-short"] && (O.monthsShort = O["months-short"].split(",").map((F) => F.trim())), jt(N, O);
      }
    }
    const L = document.createElement("span");
    L.setAttribute("data-ln-date-field", ""), r.parentNode.insertBefore(L, r), L.appendChild(r), this._wrapper = L;
    const T = document.createElement("input");
    T.type = "hidden", T.name = w, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && T.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.insertAdjacentElement("afterend", T), this._hidden = T;
    const k = document.createElement("input");
    k.type = "date", k.tabIndex = -1, k.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", T.insertAdjacentElement("afterend", k), this._picker = k, r.type = "text";
    const x = document.createElement("button");
    if (x.type = "button", x.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Open date picker"), x.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', k.insertAdjacentElement("afterend", x), this._btn = x, this._lastISO = "", Object.defineProperty(T, "value", {
      get: function() {
        return y.get.call(T);
      },
      set: function(D) {
        if (y.set.call(T, D), D && D !== "") {
          const N = i(D);
          N && n(g, D, N);
        } else D === "" && e(g);
      }
    }), se(r, y, {
      get: function() {
        return y.get.call(r);
      },
      set: function(D, N) {
        if (g._isFormatting) {
          N(D);
          return;
        }
        if (!D || D === "") {
          N(""), e(g);
          return;
        }
        const O = i(D) || t(D);
        if (O) {
          const F = d(O), U = r.getAttribute(u) || "", lt = W(r), rt = s(O, U, lt);
          N(rt), n(g, F, O, rt);
        } else
          N(String(D)), e(g);
      }
    }), this._onPickerChange = function() {
      const D = k.value;
      if (D) {
        const N = i(D);
        N && n(g, D, N);
      } else
        e(g);
    }, k.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const D = g.dom.value.trim();
      if (D === "") {
        g._lastISO !== "" && e(g);
        return;
      }
      if (g._lastISO) {
        const O = i(g._lastISO);
        if (O) {
          const F = g.dom.getAttribute(u) || "", U = W(g.dom);
          if (D === s(O, F, U)) return;
        }
      }
      const N = t(D);
      if (N) {
        const O = d(N);
        n(g, O, N);
      } else if (g._lastISO) {
        const O = i(g._lastISO);
        O && g._displayFormatted(O);
      } else
        g.dom.value = "";
    }, r.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      g._openPicker();
    }, x.addEventListener("click", this._onBtnClick), b && b !== "") {
      const D = i(b);
      D && n(g, b, D);
    }
    return this;
  }
  function i(r) {
    if (!r || typeof r != "string") return null;
    const g = r.split("T"), b = g[0].split("-");
    if (b.length < 3) return null;
    const w = parseInt(b[0], 10), E = parseInt(b[1], 10) - 1, A = parseInt(b[2], 10);
    if (isNaN(w) || isNaN(E) || isNaN(A)) return null;
    let L = 0, T = 0;
    if (g[1]) {
      const x = g[1].split(":");
      L = parseInt(x[0], 10) || 0, T = parseInt(x[1], 10) || 0;
    }
    const k = new Date(w, E, A, L, T);
    return k.getFullYear() !== w || k.getMonth() !== E || k.getDate() !== A ? null : k;
  }
  function t(r) {
    if (!r || typeof r != "string" || (r = r.trim(), r.length < 6)) return null;
    let g, b;
    if (r.indexOf(".") !== -1)
      g = ".", b = r.split(".");
    else if (r.indexOf("/") !== -1)
      g = "/", b = r.split("/");
    else if (r.indexOf("-") !== -1)
      g = "-", b = r.split("-");
    else
      return null;
    if (b.length !== 3) return null;
    const w = [];
    for (let k = 0; k < 3; k++) {
      const x = parseInt(b[k], 10);
      if (isNaN(x)) return null;
      w.push(x);
    }
    let E, A, L;
    g === "." ? (E = w[0], A = w[1], L = w[2]) : g === "/" ? (A = w[0], E = w[1], L = w[2]) : b[0].length === 4 ? (L = w[0], A = w[1], E = w[2]) : (E = w[0], A = w[1], L = w[2]), L < 100 && (L += L < 50 ? 2e3 : 1900);
    const T = new Date(L, A - 1, E);
    return T.getFullYear() !== L || T.getMonth() !== A - 1 || T.getDate() !== E ? null : T;
  }
  a.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, a.prototype._setHiddenRaw = function(r) {
    y.set.call(this._hidden, r);
  }, a.prototype._displayFormatted = function(r) {
    const g = this.dom.getAttribute(u) || "", b = W(this.dom);
    this._isFormatting = !0, this.dom.value = s(r, g, b), this._isFormatting = !1;
  }, Object.defineProperty(a.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : y.get.call(this._hidden);
    },
    set: function(r) {
      if (this.isTextElement) {
        if (!r || r === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const b = i(r) || t(r);
        if (!b) return;
        const w = d(b);
        this._rawValue = w, this.dom.setAttribute("data-ln-value", w), this._formatTextContent();
        return;
      }
      if (!r || r === "") {
        e(this);
        return;
      }
      const g = i(r);
      g && n(this, r, g);
    }
  }), Object.defineProperty(a.prototype, "date", {
    get: function() {
      const r = this.value;
      return r ? i(r) : null;
    },
    set: function(r) {
      if (!r || !(r instanceof Date) || isNaN(r.getTime())) {
        this.value = "";
        return;
      }
      this.value = d(r);
    }
  }), Object.defineProperty(a.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), a.prototype.destroy = function() {
    if (!this.dom[c]) return;
    if (this.isTextElement) {
      S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const r = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", r && (this.dom.value = r), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function o() {
    new MutationObserver(function() {
      const r = document.querySelectorAll("[" + u + "]");
      for (let g = 0; g < r.length; g++) {
        const b = r[g][c];
        if (b) {
          if (b.isTextElement)
            b._formatTextContent();
          else if (b.value) {
            const w = i(b.value);
            w && b._displayFormatted(w);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(u, c, a, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(r) {
      const g = r[c];
      if (g) {
        if (g.isTextElement)
          g._initTextElement();
        else if (g.value) {
          const b = i(g.value);
          b && g._displayFormatted(b);
        }
      }
    }
  }), o();
})();
(function() {
  const u = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0) return;
  const v = [];
  if (!history._lnNavPatched) {
    const h = history.pushState;
    history.pushState = function() {
      h.apply(history, arguments);
      for (const l of v)
        l();
    }, history._lnNavPatched = !0;
  }
  function y(h) {
    return this.dom = h, this.activeClass = h.getAttribute(u) || "active", this.exact = h.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), v.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(h, { childList: !0, subtree: !0 }), this.update(), this;
  }
  y.prototype.update = function() {
    if (!this.activeClass || $(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const l = Array.from(this.dom.querySelectorAll("a")), p = window.location.pathname, s = _(p);
    for (const d of l) {
      const f = d.getAttribute("href");
      if (!f || f === "#" || f.startsWith("#") || f.startsWith("javascript:") || f.startsWith("mailto:") || f.startsWith("tel:")) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      if (d.hostname && d.hostname !== window.location.hostname) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      const n = _(f), e = n === s, a = !this.exact && n !== "/" && s.startsWith(n + "/");
      e || a ? (d.classList.add(this.activeClass), d.setAttribute("aria-current", "page")) : (d.classList.remove(this.activeClass), d.removeAttribute("aria-current"));
    }
    S(this.dom, "ln-nav:update", { target: this.dom });
  }, y.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const h = v.indexOf(this.updateHandler);
    h !== -1 && v.splice(h, 1), S(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function _(h) {
    try {
      return new URL(h, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return h.replace(/\/$/, "") || "/";
    }
  }
  function m(h, l) {
    const p = h[c];
    if (p) {
      if (l === u) {
        if (!h.hasAttribute(u)) {
          p.destroy();
          return;
        }
        const s = p.activeClass, d = h.getAttribute(u) || "active";
        if (s !== d) {
          const f = h.querySelectorAll("a");
          for (const n of f)
            s && n.classList.remove(s);
          p.activeClass = d;
        }
      } else l === "data-ln-nav-exact" && (p.exact = h.hasAttribute("data-ln-nav-exact"));
      p.update();
    }
  }
  H(u, c, y, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: m
  });
})();
(function() {
  const u = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function v(m, h) {
    const l = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (l) return l;
    if (m.tagName !== "A") return "";
    const p = m.getAttribute("href") || "";
    if (!p.startsWith("#")) return "";
    const s = p.slice(1);
    if (!s) return "";
    const d = s.split("&");
    if (h)
      for (const e of d) {
        const a = e.indexOf(":");
        if (a > 0 && e.slice(0, a).toLowerCase().trim() === h)
          return e.slice(a + 1).toLowerCase().trim();
      }
    const f = d[d.length - 1] || "", n = f.indexOf(":");
    return (n > 0 ? f.slice(n + 1) : f).toLowerCase().trim();
  }
  function y(m) {
    return this.dom = m, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((p) => p.tagName === "A" && (p.getAttribute("href") || "").startsWith("#")), h = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = h && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : h && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const p of this.tabs) {
      const s = v(p, this.nsKey);
      s ? this.mapTabs[s] = p : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', p);
    }
    for (const p of this.panels) {
      const s = (p.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      s && (this.mapPanels[s] = p);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const l = this;
    this._clickHandlers = [];
    for (const p of this.tabs) {
      if (p[c + "Trigger"]) continue;
      const s = function(d) {
        const f = p.tagName === "A";
        if (!f && (d.ctrlKey || d.metaKey || d.button === 1)) return;
        const n = v(p, l.nsKey);
        n && (f && !Wt(d) || (l.hashEnabled ? ut(l.nsKey) === n ? l.dom.setAttribute("data-ln-tabs-active", n) : nt(l.nsKey, n) : l.dom.setAttribute("data-ln-tabs-active", n)));
      };
      p.addEventListener("click", s), p[c + "Trigger"] = s, l._clickHandlers.push({ el: p, handler: s });
    }
    if (this._onRequestSelect = function(p) {
      const s = p.detail && (p.detail.key || p.detail.tab);
      s && l.dom.setAttribute("data-ln-tabs-active", (s + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!l.hashEnabled) return;
      const p = ut(l.nsKey);
      l.dom.setAttribute("data-ln-tabs-active", p !== null ? p : l.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let p = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const s = It("tabs", this.dom);
        s !== null && s in this.mapPanels && (p = s);
      }
      this.dom.setAttribute("data-ln-tabs-active", p);
    }
  }
  y.prototype._applyActive = function(m) {
    var h;
    (!m || !(m in this.mapPanels)) && (m = this.defaultKey);
    for (const l in this.mapTabs) {
      const p = this.mapTabs[l];
      l === m ? (p.setAttribute("data-active", ""), p.setAttribute("aria-selected", "true")) : (p.removeAttribute("data-active"), p.setAttribute("aria-selected", "false"));
    }
    for (const l in this.mapPanels) {
      const p = this.mapPanels[l], s = l === m;
      p.classList.toggle("hidden", !s), p.setAttribute("aria-hidden", s ? "false" : "true");
    }
    if (this.autoFocus) {
      const l = (h = this.mapPanels[m]) == null ? void 0 : h.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      l && setTimeout(() => l.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: m, tab: this.mapTabs[m], panel: this.mapPanels[m] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && ft("tabs", this.dom, m);
  }, y.prototype.destroy = function() {
    if (this.dom[c]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: m, handler: h } of this._clickHandlers)
        m.removeEventListener("click", h), delete m[c + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[c];
    }
  }, H(u, c, y, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const h = m.getAttribute("data-ln-tabs-active");
      m[c]._applyActive(h);
    }
  });
})();
(function() {
  const u = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function v(m, h) {
    const l = document.querySelectorAll(
      '[data-ln-toggle-for="' + m.id + '"]'
    );
    for (const p of l)
      p.setAttribute("aria-expanded", h ? "true" : "false");
  }
  function y(m) {
    this.dom = m;
    const h = this;
    if (this._onRequestOpen = function() {
      h.open();
    }, this._onRequestClose = function() {
      h.close();
    }, this._onRequestToggle = function() {
      h.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.hasAttribute("data-ln-persist")) {
      const l = It("toggle", m);
      l !== null && m.setAttribute(u, l);
    }
    return this.isOpen = m.getAttribute(u) === "open", this.isOpen && m.classList.add("open"), v(m, this.isOpen), this;
  }
  y.prototype.open = function() {
    this.dom.setAttribute(u, "open");
  }, y.prototype.close = function() {
    this.dom.setAttribute(u, "close");
  }, y.prototype.toggle = function() {
    const m = this.dom.getAttribute(u);
    this.dom.setAttribute(u, m === "open" ? "close" : "open");
  }, y.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function _(m) {
    const h = m[c];
    if (!h) return;
    const p = m.getAttribute(u) === "open";
    if (p !== h.isOpen)
      if (p) {
        if ($(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(u, "close");
          return;
        }
        h.isOpen = !0, m.classList.add("open"), v(m, !0), S(m, "ln-toggle:open", { target: m }), m.hasAttribute("data-ln-persist") && ft("toggle", m, "open");
      } else {
        if ($(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(u, "open");
          return;
        }
        h.isOpen = !1, m.classList.remove("open"), v(m, !1), S(m, "ln-toggle:close", { target: m }), m.hasAttribute("data-ln-persist") && ft("toggle", m, "close");
      }
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const h = m.target.closest("[data-ln-toggle-for]");
    if (h) {
      const l = h.getAttribute("data-ln-toggle-for"), p = document.getElementById(l);
      if (p && p[c]) {
        m.preventDefault();
        const s = h.getAttribute("data-ln-toggle-action") || "toggle";
        if (s === "open")
          p.setAttribute(u, "open");
        else if (s === "close")
          p.setAttribute(u, "close");
        else if (s === "toggle") {
          const d = p.getAttribute(u);
          p.setAttribute(u, d === "open" ? "close" : "open");
        }
      }
    }
  }), H(u, c, y, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const u = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function v(y) {
    return this.dom = y, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== y) return;
      const m = y.querySelectorAll("[data-ln-toggle]");
      for (const h of m)
        h !== _.detail.target && h.closest("[data-ln-accordion]") === y && h.getAttribute("data-ln-toggle") === "open" && h.setAttribute("data-ln-toggle", "close");
      S(y, "ln-accordion:change", { target: _.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[c]);
  }, H(u, c, v, "ln-accordion");
})();
(function() {
  const u = "data-ln-dropdown", c = "lnDropdown";
  if (window[c] !== void 0) return;
  function v(y) {
    if (this.dom = y, this.toggleEl = y.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = y.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const m of this.toggleEl.children)
        m.setAttribute("role", "menuitem");
    const _ = this;
    return this._onRequestOpen = function() {
      _.toggleEl && _.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      _.toggleEl && _.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (_.toggleEl) {
        const m = _.toggleEl.getAttribute("data-ln-toggle");
        _.toggleEl.setAttribute("data-ln-toggle", m === "open" ? "close" : "open");
      }
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._onToggleOpen = function(m) {
      !m.detail || m.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "true"), typeof _.toggleEl.showPopover == "function" && _.toggleEl.showPopover(), _._reposition(), _._addOutsideClickListener(), _._addScrollRepositionListener(), _._addResizeCloseListener(), S(y, "ln-dropdown:open", { target: m.detail.target }));
    }, this._onToggleClose = function(m) {
      !m.detail || m.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "false"), _._removeOutsideClickListener(), _._removeScrollRepositionListener(), _._removeResizeCloseListener(), _.toggleEl.style.top = "", _.toggleEl.style.left = "", typeof _.toggleEl.hidePopover == "function" && _.toggleEl.matches(":popover-open") && _.toggleEl.hidePopover(), S(y, "ln-dropdown:close", { target: m.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  v.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const y = this.triggerBtn.getBoundingClientRect(), _ = Pt(this.toggleEl), m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, h = xt(y, _, "bottom-end", m);
    this.toggleEl.style.top = h.top + "px", this.toggleEl.style.left = h.left + "px";
  }, v.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const y = this;
    this._boundDocClick = function(_) {
      y.dom.contains(_.target) || y.toggleEl && y.toggleEl.contains(_.target) || y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
    }, y._docClickTimeout = setTimeout(function() {
      y._docClickTimeout = null, document.addEventListener("click", y._boundDocClick);
    }, 0);
  }, v.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, v.prototype._addScrollRepositionListener = function() {
    const y = this;
    this._boundScrollReposition = function() {
      y._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, v.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, v.prototype._addResizeCloseListener = function() {
    const y = this;
    this._boundResizeClose = function() {
      y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, v.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, v.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[c]);
  }, H(u, c, v, "ln-dropdown");
})();
(function() {
  const u = "data-ln-popover", c = "lnPopover", v = "data-ln-popover-for", y = "data-ln-popover-position";
  if (window[c] !== void 0) return;
  const _ = [];
  let m = null;
  function h() {
    m || (m = function(d) {
      if (d.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function l() {
    _.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function p(d) {
    this.dom = d, this.isOpen = d.getAttribute(u) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const f = this;
    return this._onRequestOpen = function(n) {
      const e = n.detail && n.detail.trigger ? n.detail.trigger : null;
      f.open(e);
    }, this._onRequestClose = function() {
      f.close();
    }, this._onRequestToggle = function(n) {
      const e = n.detail && n.detail.trigger ? n.detail.trigger : null;
      f.toggle(e);
    }, d.addEventListener("ln-popover:request-open", this._onRequestOpen), d.addEventListener("ln-popover:request-close", this._onRequestClose), d.addEventListener("ln-popover:request-toggle", this._onRequestToggle), d.hasAttribute("tabindex") || d.setAttribute("tabindex", "-1"), d.hasAttribute("role") || d.setAttribute("role", "dialog"), d.hasAttribute("popover") || d.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  p.prototype.open = function(d) {
    this.isOpen || (this.trigger = d || null, this.dom.setAttribute(u, "open"));
  }, p.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "closed");
  }, p.prototype.toggle = function(d) {
    this.isOpen ? this.close() : this.open(d);
  }, p.prototype._applyOpen = function(d) {
    this.isOpen = !0, d && (this.trigger = d), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const f = Pt(this.dom);
    if (this.trigger) {
      const i = this.trigger.getBoundingClientRect(), t = this.dom.getAttribute(y) || "bottom", o = xt(i, f, t, 8);
      this.dom.style.top = o.top + "px", this.dom.style.left = o.left + "px", this.dom.setAttribute("data-ln-popover-placement", o.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const n = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), e = Array.prototype.find.call(n, qt);
    e ? e.focus() : this.dom.focus();
    const a = this;
    this._boundDocClick = function(i) {
      a.dom.contains(i.target) || a.trigger && a.trigger.contains(i.target) || a.close();
    }, a._docClickTimeout = setTimeout(function() {
      a._docClickTimeout = null, document.addEventListener("click", a._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!a.trigger) return;
      const i = a.trigger.getBoundingClientRect(), t = Pt(a.dom), o = a.dom.getAttribute(y) || "bottom", r = xt(i, t, o, 8);
      a.dom.style.top = r.top + "px", a.dom.style.left = r.left + "px", a.dom.setAttribute("data-ln-popover-placement", r.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), h(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, p.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const d = _.indexOf(this);
    d !== -1 && _.splice(d, 1), l(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, p.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[c], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function s(d) {
    this.dom = d;
    const f = d.getAttribute(v);
    return d.setAttribute("aria-haspopup", "dialog"), d.setAttribute("aria-expanded", "false"), d.setAttribute("aria-controls", f), this._onClick = function(n) {
      if (n.ctrlKey || n.metaKey || n.button === 1) return;
      n.preventDefault();
      const e = document.getElementById(f);
      if (!e) return;
      e[c] && (e[c].trigger = d);
      const a = e.getAttribute(u);
      e.setAttribute(u, a === "open" ? "closed" : "open");
    }, d.addEventListener("click", this._onClick), this;
  }
  s.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[c + "Trigger"];
  }, H(u, c, p, "ln-popover", {
    onAttributeChange: function(d) {
      const f = d[c];
      if (!f) return;
      const e = d.getAttribute(u) === "open";
      if (e !== f.isOpen)
        if (e) {
          if ($(d, "ln-popover:before-open", {
            popoverId: d.id,
            target: d,
            trigger: f.trigger
          }).defaultPrevented) {
            d.setAttribute(u, "closed");
            return;
          }
          f._applyOpen(f.trigger);
        } else {
          if ($(d, "ln-popover:before-close", {
            popoverId: d.id,
            target: d,
            trigger: f.trigger
          }).defaultPrevented) {
            d.setAttribute(u, "open");
            return;
          }
          f._applyClose();
        }
    }
  }), H(v, c + "Trigger", s, "ln-popover-trigger");
})();
(function() {
  const u = "data-ln-tooltip-enhance", c = "data-ln-tooltip", v = "data-ln-tooltip-position", y = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[y] !== void 0) return;
  let m = 0, h = null, l = null, p = null, s = null, d = null, f = null;
  function n() {
    return h && h.parentNode || (h = document.getElementById(_), h || (h = document.createElement("div"), h.id = _, document.body.appendChild(h)), h.hasAttribute("popover") || h.setAttribute("popover", "manual")), h;
  }
  function e() {
    f || (f = function(r) {
      r.key === "Escape" && t();
    }, document.addEventListener("keydown", f));
  }
  function a() {
    f && (document.removeEventListener("keydown", f), f = null);
  }
  function i(r) {
    if (p === r) return;
    t();
    const g = r.getAttribute(c) || r.getAttribute("title");
    if (!g) return;
    n(), typeof h.showPopover == "function" && h.showPopover(), r.hasAttribute("title") && (s = r.getAttribute("title"), r.removeAttribute("title"));
    const b = r.getAttribute("aria-describedby");
    b ? d = b : d = null;
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = g, r[y + "Uid"] || (m += 1, r[y + "Uid"] = "ln-tooltip-" + m), w.id = r[y + "Uid"], h.appendChild(w);
    const E = w.offsetWidth, A = w.offsetHeight, L = r.getBoundingClientRect(), T = r.getAttribute(v) || "top", k = xt(L, { width: E, height: A }, T, 6);
    w.style.top = k.top + "px", w.style.left = k.left + "px", w.setAttribute("data-ln-tooltip-placement", k.placement), d ? r.setAttribute("aria-describedby", d + " " + w.id) : r.setAttribute("aria-describedby", w.id), l = w, p = r, e();
  }
  function t() {
    if (!l) {
      a();
      return;
    }
    p && (d !== null ? p.setAttribute("aria-describedby", d) : p.removeAttribute("aria-describedby"), d = null, s !== null && p.setAttribute("title", s)), s = null, l.parentNode && l.parentNode.removeChild(l), l = null, p = null, h && typeof h.hidePopover == "function" && h.matches(":popover-open") && h.hidePopover(), a();
  }
  function o(r) {
    return this.dom = r, r.hasAttribute("data-ln-tooltip-enhanced") || (r.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      i(r);
    }, this._onLeave = function() {
      p === r && !r.contains(document.activeElement) && t();
    }, this._onFocus = function() {
      i(r);
    }, this._onBlur = function() {
      p === r && !r.matches(":hover") && t();
    }, r.addEventListener("mouseenter", this._onEnter), r.addEventListener("mouseleave", this._onLeave), r.addEventListener("focus", this._onFocus, !0), r.addEventListener("blur", this._onBlur, !0), this;
  }
  o.prototype.destroy = function() {
    const r = this.dom;
    r.removeEventListener("mouseenter", this._onEnter), r.removeEventListener("mouseleave", this._onLeave), r.removeEventListener("focus", this._onFocus, !0), r.removeEventListener("blur", this._onBlur, !0), p === r && t(), this._addedEnhancedAttr && r.removeAttribute("data-ln-tooltip-enhanced"), delete r[y], delete r[y + "Uid"], S(r, "ln-tooltip:destroyed", { trigger: r });
  }, H(
    "[" + u + "], [data-ln-tooltip-enhanced], [" + c + "][title]",
    y,
    o,
    "ln-tooltip"
  );
})();
(function() {
  const u = "data-ln-toast", c = "lnToast", v = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function y(i) {
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
  function _(i) {
    if (!i || !(i instanceof HTMLElement)) return;
    if (i.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof i.hidePopover == "function" && i.matches(":popover-open"))
      try {
        i.hidePopover();
      } catch {
      }
  }
  function m(i) {
    if (!i || i.nodeType !== 1) return;
    const t = Array.from(i.querySelectorAll("[" + u + "]"));
    i.hasAttribute && i.hasAttribute(u) && t.push(i);
    for (const o of t)
      o[c] || new h(o);
  }
  function h(i) {
    this.dom = i, i[c] = this, this.timeoutDefault = parseInt(i.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(i.getAttribute("data-ln-toast-max") || "5", 10);
    const t = Array.from(i.querySelectorAll("[data-ln-toast-item]"));
    for (; t.length > this.max; ) i.removeChild(t.shift());
    for (const o of t) n(o, this);
    return t.length > 0 && y(i), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const i of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        d(i);
      _(this.dom), delete this.dom[c];
    }
  };
  function l(i, t) {
    const o = ((i.type || "") + "").trim().toLowerCase(), r = ht(t, v, "ln-toast");
    if (!r)
      return console.warn('[ln-toast] Template "' + v + '" not found'), null;
    et(r, {
      type: o,
      title: i.title,
      message: typeof i.message == "string" ? i.message : void 0
    });
    const g = r.firstElementChild;
    if (!g) return null;
    g.hasAttribute("data-ln-toast-item") || g.setAttribute("data-ln-toast-item", ""), g.classList.add("ln-enter");
    const b = g.querySelector(".body");
    b && p(b, i);
    const w = g.querySelector("[data-ln-toast-close]");
    return w && w.addEventListener("click", function() {
      d(g);
    }), g;
  }
  function p(i, t) {
    if (Array.isArray(t.message)) {
      const o = document.createElement("ul");
      for (const r of t.message) {
        const g = document.createElement("li");
        g.textContent = r, o.appendChild(g);
      }
      i.appendChild(o);
    }
    if (t.data && t.data.errors) {
      const o = document.createElement("ul");
      for (const r of Object.values(t.data.errors).flat()) {
        const g = document.createElement("li");
        g.textContent = r, o.appendChild(g);
      }
      i.appendChild(o);
    }
  }
  function s(i, t) {
    const o = Array.from(i.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; o.length >= i.max && o.length > 0; ) i.dom.removeChild(o.shift());
    i.dom.appendChild(t), y(i.dom), requestAnimationFrame(() => t.classList.remove("ln-enter"));
  }
  function d(i) {
    if (!i || !i.parentNode) return;
    const t = i.parentNode;
    clearTimeout(i._timer), i.classList.remove("ln-enter"), i.classList.add("ln-out"), setTimeout(() => {
      i.parentNode && (i.parentNode.removeChild(i), _(t));
    }, 200);
  }
  function f(i) {
    let t = i && i.container;
    return typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), t || null;
  }
  function n(i, t) {
    if (i._lnToastHydrated) return;
    i._lnToastHydrated = !0;
    const o = i.querySelector("[data-ln-toast-close]");
    o && o.addEventListener("click", function() {
      d(i);
    });
    const r = i.getAttribute("data-ln-toast-timeout"), g = r !== null ? parseInt(r, 10) : NaN, b = Number.isFinite(g) ? g : t.timeoutDefault;
    b > 0 && (i._timer = setTimeout(function() {
      d(i);
    }, b));
  }
  function e(i) {
    const t = i.detail || {}, o = f(t);
    if (!o) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const r = o[c] || new h(o), g = l(t, o);
    if (!g) return;
    const b = Number.isFinite(t.timeout) ? t.timeout : r.timeoutDefault;
    s(r, g), b > 0 && (g._timer = setTimeout(() => d(g), b));
  }
  function a(i) {
    const t = i && i.detail || {};
    if (t.container) {
      const o = f(t);
      if (o)
        for (const r of Array.from(o.querySelectorAll("[data-ln-toast-item]"))) d(r);
    } else {
      const o = document.querySelectorAll("[" + u + "]");
      for (const r of Array.from(o))
        for (const g of Array.from(r.querySelectorAll("[data-ln-toast-item]"))) d(g);
    }
  }
  it(function() {
    window.addEventListener("ln-toast:enqueue", e), window.addEventListener("ln-toast:clear", a), window.addEventListener("ln-modal:open", function() {
      const t = document.querySelectorAll("[" + u + "]");
      for (const o of Array.from(t))
        o.querySelectorAll("[data-ln-toast-item]").length > 0 && y(o);
    }), new MutationObserver(function(t) {
      for (const o of t) {
        if (o.type === "attributes") {
          m(o.target);
          continue;
        }
        for (const r of o.addedNodes)
          m(r);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] }), m(document.body);
  }, "ln-toast");
})();
(function() {
  const u = "data-ln-upload", c = "lnUpload", v = "data-ln-upload-dict", y = "data-ln-upload-accept", _ = "data-ln-upload-context", m = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function h() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const a = document.createElement("div");
    a.innerHTML = m;
    const i = a.firstElementChild;
    i && document.body.appendChild(i);
  }
  if (window[c] !== void 0) return;
  function l(a) {
    if (a === 0) return "0 B";
    const i = 1024, t = ["B", "KB", "MB", "GB"], o = Math.floor(Math.log(a) / Math.log(i));
    return parseFloat((a / Math.pow(i, o)).toFixed(1)) + " " + t[o];
  }
  function p(a) {
    return a.split(".").pop().toLowerCase();
  }
  function s(a) {
    return a === "docx" && (a = "doc"), ["pdf", "doc", "epub"].includes(a) ? "lnc-file-" + a : "ln-file";
  }
  function d(a, i) {
    if (!i) return !0;
    const t = "." + p(a.name);
    return i.split(",").map(function(r) {
      return r.trim().toLowerCase();
    }).includes(t.toLowerCase());
  }
  function f(a) {
    if (a.lnUploadAPI) return;
    h();
    const i = Kt(a, v), t = a.querySelector(".ln-upload__zone"), o = a.querySelector(".ln-upload__list"), r = a.getAttribute(y) || "";
    if (!t || !o) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", a);
      return;
    }
    let g = a.querySelector('input[type="file"]');
    g || (g = document.createElement("input"), g.type = "file", g.multiple = !0, g.classList.add("hidden"), r && (g.accept = r.split(",").map(function(P) {
      return P = P.trim(), P.startsWith(".") ? P : "." + P;
    }).join(",")), a.appendChild(g));
    const b = a.getAttribute(u) || "/files/upload", w = a.getAttribute(_) || "", E = a.getAttribute("data-ln-upload-delete") || (b.includes("/upload") ? b.replace(/\/upload\/?$/, "/{id}") : b + "/{id}"), A = /* @__PURE__ */ new Map();
    let L = 0;
    function T() {
      const P = document.querySelector('meta[name="csrf-token"]');
      return P ? P.getAttribute("content") : "";
    }
    function k(P) {
      if (!d(P, r)) {
        const R = i["invalid-type"];
        S(a, "ln-upload:invalid", {
          file: P,
          message: R
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: i["invalid-title"] || "Invalid File",
          message: R || i["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const K = "file-" + ++L, G = p(P.name), vt = s(G), ot = ht(a, "ln-upload-item", "ln-upload");
      if (!ot) return;
      const tt = ot.firstElementChild;
      if (!tt) return;
      tt.setAttribute("data-file-id", K), et(tt, {
        name: P.name,
        sizeText: "0%",
        iconHref: "#" + vt,
        removeLabel: i.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const Et = tt.querySelector(".ln-upload__progress-bar"), st = tt.querySelector('[data-ln-upload-action="remove"]');
      st && (st.disabled = !0), o.appendChild(tt);
      const pt = new FormData();
      pt.append("file", P);
      const C = /* @__PURE__ */ new Set();
      a.querySelectorAll("input, select, textarea").forEach(function(R) {
        if (R.name && R.name !== "file_ids[]" && R.type !== "file") {
          if ((R.type === "checkbox" || R.type === "radio") && !R.checked)
            return;
          pt.append(R.name, R.value), C.add(R.name);
        }
      }), !C.has("context") && w && pt.append("context", w);
      const q = new XMLHttpRequest();
      q.upload.addEventListener("progress", function(R) {
        if (R.lengthComputable) {
          const M = Math.round(R.loaded / R.total * 100);
          Et.style.width = M + "%", et(tt, { sizeText: M + "%" });
        }
      }), q.addEventListener("load", function() {
        if (q.status >= 200 && q.status < 300) {
          let R;
          try {
            R = JSON.parse(q.responseText);
          } catch {
            I("Invalid response");
            return;
          }
          et(tt, { sizeText: l(R.size || P.size), uploading: !1 }), st && (st.disabled = !1), A.set(K, {
            serverId: R.id,
            name: R.name,
            size: R.size
          }), x(), S(a, "ln-upload:uploaded", {
            localId: K,
            serverId: R.id,
            name: R.name
          });
        } else {
          let R = i["upload-failed"] || "Upload failed";
          try {
            R = JSON.parse(q.responseText).message || R;
          } catch {
          }
          I(R);
        }
      }), q.addEventListener("error", function() {
        I(i["network-error"] || "Network error");
      });
      function I(R) {
        Et && (Et.style.width = "100%"), et(tt, { sizeText: i.error || "Error", uploading: !1, error: !0 }), st && (st.disabled = !1), S(a, "ln-upload:error", {
          file: P,
          message: R
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: i["error-title"] || "Upload Error",
          message: R || i["upload-failed"] || "Failed to upload file"
        });
      }
      q.open("POST", b), q.setRequestHeader("X-CSRF-TOKEN", T()), q.setRequestHeader("Accept", "application/json"), q.send(pt);
    }
    function x() {
      for (const P of a.querySelectorAll('input[name="file_ids[]"]'))
        P.remove();
      for (const [, P] of A) {
        const K = document.createElement("input");
        K.type = "hidden", K.name = "file_ids[]", K.value = P.serverId, a.appendChild(K);
      }
    }
    function D(P) {
      const K = A.get(P), G = o.querySelector('[data-file-id="' + P + '"]');
      if (!K || !K.serverId) {
        G && G.remove(), A.delete(P), x();
        return;
      }
      G && et(G, { deleting: !0 });
      const vt = E.replace("{id}", K.serverId);
      fetch(vt, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": T(),
          Accept: "application/json"
        }
      }).then(function(ot) {
        ot.status === 200 ? (G && G.remove(), A.delete(P), x(), S(a, "ln-upload:removed", {
          localId: P,
          serverId: K.serverId
        })) : (G && et(G, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: i["delete-title"] || "Error",
          message: i["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(ot) {
        console.warn("[ln-upload] Delete error:", ot), G && et(G, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: i["network-error"] || "Network error",
          message: i["connection-error"] || "Could not connect to server"
        });
      });
    }
    function N(P) {
      for (const K of P)
        k(K);
      g.value = "";
    }
    const O = function() {
      g.click();
    }, F = function() {
      N(this.files);
    }, U = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, lt = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.add("ln-upload__zone--dragover");
    }, rt = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover");
    }, yt = function(P) {
      P.preventDefault(), P.stopPropagation(), t.classList.remove("ln-upload__zone--dragover"), N(P.dataTransfer.files);
    }, Lt = function(P) {
      const K = P.target.closest('[data-ln-upload-action="remove"]');
      if (!K || !o.contains(K) || K.disabled) return;
      const G = K.closest(".ln-upload__item");
      G && D(G.getAttribute("data-file-id"));
    };
    t.addEventListener("click", O), g.addEventListener("change", F), t.addEventListener("dragenter", U), t.addEventListener("dragover", lt), t.addEventListener("dragleave", rt), t.addEventListener("drop", yt), o.addEventListener("click", Lt), a.lnUploadAPI = {
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
            const K = E.replace("{id}", P.serverId);
            fetch(K, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": T(),
                Accept: "application/json"
              }
            });
          }
        A.clear(), o.innerHTML = "", x(), S(a, "ln-upload:cleared", {});
      },
      destroy: function() {
        t.removeEventListener("click", O), g.removeEventListener("change", F), t.removeEventListener("dragenter", U), t.removeEventListener("dragover", lt), t.removeEventListener("dragleave", rt), t.removeEventListener("drop", yt), o.removeEventListener("click", Lt), A.clear(), o.innerHTML = "", x(), delete a.lnUploadAPI;
      }
    };
  }
  function n() {
    for (const a of document.querySelectorAll("[" + u + "]"))
      f(a);
  }
  function e() {
    it(function() {
      new MutationObserver(function(i) {
        for (const t of i)
          if (t.type === "childList") {
            for (const o of t.addedNodes)
              if (o.nodeType === 1) {
                o.hasAttribute(u) && f(o);
                for (const r of o.querySelectorAll("[" + u + "]"))
                  f(r);
              }
          } else t.type === "attributes" && t.target.hasAttribute(u) && f(t.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-upload");
  }
  window[c] = {
    init: f,
    initAll: n
  }, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const u = "lnExternalLinks";
  if (window[u] !== void 0) return;
  function c(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function v(l) {
    if (l.getAttribute("data-ln-external-link") === "processed" || !c(l)) return;
    l.target = "_blank";
    const p = (l.rel || "").split(/\s+/).filter(Boolean);
    p.includes("noopener") || p.push("noopener"), p.includes("noreferrer") || p.push("noreferrer"), l.rel = p.join(" ");
    const s = document.createElement("span");
    s.className = "sr-only", s.textContent = "(opens in new tab)", l.appendChild(s), l.setAttribute("data-ln-external-link", "processed"), S(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    });
  }
  function y(l) {
    l = l || document.body;
    for (const p of l.querySelectorAll("a, area"))
      v(p);
  }
  function _() {
    it(function() {
      document.body.addEventListener("click", function(l) {
        const p = l.target.closest("a, area");
        p && p.getAttribute("data-ln-external-link") === "processed" && S(p, "ln-external-links:clicked", {
          link: p,
          href: p.href,
          text: p.textContent || p.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    it(function() {
      new MutationObserver(function(p) {
        for (const s of p) {
          if (s.type === "childList") {
            for (const d of s.addedNodes)
              if (d.nodeType === 1 && (d.matches && (d.matches("a") || d.matches("area")) && v(d), d.querySelectorAll))
                for (const f of d.querySelectorAll("a, area"))
                  v(f);
          }
          if (s.type === "attributes" && s.attributeName === "href") {
            const d = s.target;
            d.matches && (d.matches("a") || d.matches("area")) && v(d);
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
    _(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[u] = {
    process: y
  }, h();
})();
(function() {
  const u = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  let v = null;
  function y() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function _(o) {
    v && (v.textContent = o, v.classList.add("ln-link-status--visible"));
  }
  function m() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function h(o, r) {
    if (r.target.closest("a, button, input, select, textarea")) return;
    const g = o.querySelector("a");
    if (!g) return;
    const b = g.getAttribute("href");
    if (!b) return;
    if (r.ctrlKey || r.metaKey || r.button === 1) {
      window.open(b, "_blank");
      return;
    }
    $(o, "ln-link:navigate", { target: o, href: b, link: g }).defaultPrevented || g.click();
  }
  function l(o) {
    const r = o.querySelector("a");
    if (!r) return;
    const g = r.getAttribute("href");
    g && _(g);
  }
  function p() {
    m();
  }
  function s(o) {
    o[c + "Row"] || !o.querySelector("a") || (o[c + "Row"] = !0, o._lnLinkClick = function(g) {
      h(o, g);
    }, o._lnLinkEnter = function() {
      l(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", p));
  }
  function d(o) {
    o[c + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", p), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[c + "Row"]);
  }
  function f(o) {
    if (!o[c + "Init"]) return;
    const r = o.tagName;
    if (r === "TABLE" || r === "TBODY") {
      const g = r === "TABLE" && o.querySelector("tbody") || o;
      for (const b of g.querySelectorAll("tr"))
        d(b);
    } else
      d(o);
    delete o[c + "Init"];
  }
  function n(o) {
    if (o[c + "Init"]) return;
    o[c + "Init"] = !0;
    const r = o.tagName;
    if (r === "TABLE" || r === "TBODY") {
      const g = r === "TABLE" && o.querySelector("tbody") || o;
      for (const b of g.querySelectorAll("tr"))
        s(b);
    } else
      s(o);
  }
  function e(o) {
    o.hasAttribute && o.hasAttribute(u) && n(o);
    const r = o.querySelectorAll ? o.querySelectorAll("[" + u + "]") : [];
    for (const g of r)
      n(g);
  }
  function a() {
    it(function() {
      new MutationObserver(function(r) {
        for (const g of r)
          if (g.type === "childList") {
            for (const b of g.addedNodes)
              if (b.nodeType === 1) {
                e(b);
                const w = b.closest("[" + u + "]");
                if (w)
                  if (b.tagName === "TR")
                    s(b);
                  else {
                    const E = w.tagName;
                    if (E === "TABLE" || E === "TBODY") {
                      const A = b.querySelectorAll ? b.querySelectorAll("tr") : [];
                      for (const L of A)
                        s(L);
                    }
                  }
              }
          } else g.type === "attributes" && (g.target.hasAttribute && g.target.hasAttribute(u) ? e(g.target) : f(g.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-link");
  }
  function i(o) {
    e(o);
  }
  window[c] = { init: i, destroy: f };
  function t() {
    y(), a(), i(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const u = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0) return;
  function v(h) {
    return this.dom = h, this._attrObserver = null, this._parentObserver = null, m.call(this), y.call(this), _.call(this), this;
  }
  v.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[c]);
  };
  function y() {
    const h = this, l = new MutationObserver(function(p) {
      for (const s of p)
        (s.attributeName === "data-ln-progress" || s.attributeName === "data-ln-progress-max") && m.call(h);
    });
    l.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = l;
  }
  function _() {
    const h = this, l = this.dom.parentElement;
    if (!l) return;
    const p = new MutationObserver(function(s) {
      for (const d of s)
        d.attributeName === "data-ln-progress-max" && m.call(h);
    });
    p.observe(l, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = p;
  }
  function m() {
    const h = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, l = this.dom.parentElement, s = (l && l.hasAttribute("data-ln-progress-max") ? parseFloat(l.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let d = s > 0 ? h / s * 100 : 0;
    d < 0 && (d = 0), d > 100 && (d = 100), this.dom.style.width = d + "%";
    const f = Math.max(0, Math.min(h, s));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(s)), this.dom.setAttribute("aria-valuenow", String(f)), S(this.dom, "ln-progress:change", { target: this.dom, value: h, max: s, percentage: d });
  }
  H(
    u,
    c,
    v,
    "ln-progress"
  );
})();
(function() {
  const u = "data-ln-filter", c = "lnFilter", v = "data-ln-filter-key", y = "data-ln-filter-value", _ = "data-ln-filter-hide", m = "data-ln-filter-reset", h = "data-ln-filter-col", l = /* @__PURE__ */ new WeakMap();
  if (window[c] !== void 0) return;
  function p(e) {
    return e.hasAttribute(m) || e.getAttribute(y) === "";
  }
  function s(e) {
    let a = e._filterKey;
    const i = [];
    for (let t = 0; t < e.inputs.length; t++) {
      const o = e.inputs[t];
      if (o.checked && !p(o)) {
        const r = o.getAttribute(y);
        r && i.push(r);
      }
    }
    return { key: a, values: i };
  }
  function d(e, a) {
    if (e.length !== a.length) return !0;
    for (let i = 0; i < e.length; i++) if (e[i] !== a[i]) return !0;
    return !1;
  }
  function f(e) {
    const a = e.dom, i = e.colIndex, t = a.querySelector("template");
    if (!t || i === null) return;
    const o = document.getElementById(e.targetId);
    if (!o) return;
    const r = o.tagName === "TABLE" ? o : o.querySelector("table");
    if (!r || o.hasAttribute("data-ln-table")) return;
    const g = {}, b = [], w = r.tBodies;
    for (let L = 0; L < w.length; L++) {
      const T = w[L].rows;
      for (let k = 0; k < T.length; k++) {
        const x = T[k].cells[i], D = x ? x.textContent.trim() : "";
        D && !g[D] && (g[D] = !0, b.push(D));
      }
    }
    b.sort(function(L, T) {
      return L.localeCompare(T);
    });
    const E = a.querySelector("[" + v + "]"), A = E ? E.getAttribute(v) : a.getAttribute("data-ln-filter-key") || "col" + i;
    for (let L = 0; L < b.length; L++) {
      const T = t.content.cloneNode(!0), k = T.querySelector("input");
      k && (k.setAttribute(v, A), k.setAttribute(y, b[L]), Ct(T, { text: b[L] }), a.appendChild(T));
    }
  }
  function n(e) {
    this.dom = e, this.targetId = e.getAttribute(u);
    const a = e.getAttribute(h);
    this.colIndex = a !== null ? parseInt(a, 10) : null, f(this), this.inputs = Array.from(e.querySelectorAll("[" + v + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(v) : null, this._lastSnapshot = null;
    const i = this, t = Vt(
      function() {
        i._render();
      },
      function() {
        i._afterRender();
      }
    );
    this._queueRender = t, this._attachHandlers();
    let o = !1;
    if (e.hasAttribute("data-ln-persist")) {
      const r = It("filter", e);
      if (r && r.key && Array.isArray(r.values) && r.values.length > 0) {
        for (let g = 0; g < this.inputs.length; g++) {
          const b = this.inputs[g];
          p(b) ? b.checked = !1 : b.getAttribute(v) === r.key && r.values.indexOf(b.getAttribute(y)) !== -1 ? b.checked = !0 : b.checked = !1;
        }
        t(), o = !0;
      }
    }
    if (!o) {
      for (let r = 0; r < this.inputs.length; r++)
        if (this.inputs[r].checked && !p(this.inputs[r])) {
          t();
          break;
        }
    }
    return e.setAttribute(INIT_ATTR, ""), this;
  }
  n.prototype._attachHandlers = function() {
    const e = this;
    this.inputs.forEach(function(a) {
      a[c + "Bound"] || (a[c + "Bound"] = !0, a._lnFilterChange = function() {
        if (p(a)) {
          for (let i = 0; i < e.inputs.length; i++)
            p(e.inputs[i]) || (e.inputs[i].checked = !1);
          a.checked = !0, e._queueRender();
          return;
        }
        if (a.checked) {
          for (let t = 0; t < e.inputs.length; t++)
            p(e.inputs[t]) && (e.inputs[t].checked = !1);
          let i = !1;
          for (let t = 0; t < e.inputs.length; t++)
            if (p(e.inputs[t])) {
              i = !0;
              break;
            }
          if (i) {
            let t = !0;
            for (let o = 0; o < e.inputs.length; o++)
              if (!p(e.inputs[o]) && !e.inputs[o].checked) {
                t = !1;
                break;
              }
            if (t)
              for (let o = 0; o < e.inputs.length; o++)
                p(e.inputs[o]) ? e.inputs[o].checked = !0 : e.inputs[o].checked = !1;
          }
        } else {
          let i = !1;
          for (let t = 0; t < e.inputs.length; t++)
            if (!p(e.inputs[t]) && e.inputs[t].checked) {
              i = !0;
              break;
            }
          if (!i)
            for (let t = 0; t < e.inputs.length; t++)
              p(e.inputs[t]) && (e.inputs[t].checked = !0);
        }
        e._queueRender();
      }, a.addEventListener("change", a._lnFilterChange));
    });
  }, n.prototype._render = function() {
    const e = this, a = s(this), i = a.key === null || a.values.length === 0, t = [];
    for (let o = 0; o < a.values.length; o++)
      t.push(a.values[o].toLowerCase());
    if (e.colIndex !== null)
      e._filterTableRows(a);
    else {
      const o = document.getElementById(e.targetId);
      if (!o) return;
      const r = o.children;
      for (let g = 0; g < r.length; g++) {
        const b = r[g];
        if (i) {
          b.removeAttribute(_);
          continue;
        }
        const w = b.getAttribute("data-" + a.key);
        b.removeAttribute(_), w !== null && t.indexOf(w.toLowerCase()) === -1 && b.setAttribute(_, "true");
      }
    }
  }, n.prototype._afterRender = function() {
    const e = s(this), a = this._lastSnapshot;
    if (!a || a.key !== e.key || d(a.values, e.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: e.key,
        values: e.values.slice()
      });
      const t = a && a.values.length > 0, o = e.values.length === 0;
      t && o && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: e.key, values: e.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (e.key && e.values.length > 0 ? ft("filter", this.dom, { key: e.key, values: e.values.slice() }) : ft("filter", this.dom, null));
  }, n.prototype._dispatchOnBoth = function(e, a) {
    S(this.dom, e, a);
    const i = document.getElementById(this.targetId);
    i && i !== this.dom && S(i, e, a);
  }, n.prototype._filterTableRows = function(e) {
    const a = document.getElementById(this.targetId);
    if (!a) return;
    const i = a.tagName === "TABLE" ? a : a.querySelector("table");
    if (!i || a.hasAttribute("data-ln-table")) return;
    const t = e.key || this._filterKey, o = e.values;
    l.has(i) || l.set(i, {});
    const r = l.get(i);
    if (t && o.length > 0) {
      const E = [];
      for (let A = 0; A < o.length; A++)
        E.push(o[A].toLowerCase());
      r[t] = { col: this.colIndex, values: E };
    } else t && delete r[t];
    const g = Object.keys(r), b = g.length > 0, w = i.tBodies;
    for (let E = 0; E < w.length; E++) {
      const A = w[E].rows;
      for (let L = 0; L < A.length; L++) {
        const T = A[L];
        if (!b) {
          T.removeAttribute(_);
          continue;
        }
        let k = !0;
        for (let x = 0; x < g.length; x++) {
          const D = r[g[x]], N = T.cells[D.col], O = N ? N.textContent.trim().toLowerCase() : "";
          if (D.values.indexOf(O) === -1) {
            k = !1;
            break;
          }
        }
        k ? T.removeAttribute(_) : T.setAttribute(_, "true");
      }
    }
  }, n.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.colIndex !== null) {
        const e = document.getElementById(this.targetId);
        if (e) {
          const a = e.tagName === "TABLE" ? e : e.querySelector("table");
          if (a && l.has(a)) {
            const i = l.get(a), t = this._filterKey;
            t && i[t] && delete i[t], Object.keys(i).length === 0 && l.delete(a);
          }
        }
      }
      this.inputs.forEach(function(e) {
        e._lnFilterChange && (e.removeEventListener("change", e._lnFilterChange), delete e._lnFilterChange), delete e[c + "Bound"];
      }), delete this.dom[c];
    }
  }, H(u, c, n, "ln-filter");
})();
(function() {
  const u = "data-ln-search", c = "lnSearch", v = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function _(m) {
    this.dom = m, this.targetId = m.getAttribute(u);
    const h = m.tagName;
    this.input = h === "INPUT" || h === "TEXTAREA" ? m : m.querySelector('[name="search"]') || m.querySelector('input[type="search"]') || m.querySelector('input[type="text"]'), this.itemsSelector = m.getAttribute("data-ln-search-items") || null;
    const l = m.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = l !== null ? parseInt(l, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const p = this;
      queueMicrotask(function() {
        p._search(p.input.value.trim().toLowerCase());
      });
    }
    return this;
  }
  _.prototype._attachHandler = function() {
    if (!this.input) return;
    const m = this, h = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = h ? h.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      m.input.value = "", m._search(""), m.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(m._debounceTimer), m._debounceTimer = setTimeout(function() {
        m._search(m.input.value.trim().toLowerCase());
      }, m.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, _.prototype._search = function(m) {
    const h = document.getElementById(this.targetId);
    if (!h || $(h, "ln-search:change", { term: m, targetId: this.targetId }).defaultPrevented) return;
    const p = this.itemsSelector ? h.querySelectorAll(this.itemsSelector) : h.children;
    for (let s = 0; s < p.length; s++) {
      const d = p[s];
      d.removeAttribute(v), m && !d.textContent.replace(/\s+/g, " ").toLowerCase().includes(m) && d.setAttribute(v, "true");
    }
  }, _.prototype.destroy = function() {
    this.dom[c] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), delete this.dom[c]);
  }, H(u, c, _, "ln-search");
})();
(function() {
  const u = "lnTableSort", c = "data-ln-table-sort", v = "data-ln-table-col-sort";
  if (window[u] !== void 0) return;
  function y(l) {
    _(l);
  }
  function _(l) {
    const p = Array.from(l.querySelectorAll("table"));
    l.tagName === "TABLE" && p.push(l), p.forEach(function(s) {
      if (s[u]) return;
      const d = Array.from(s.querySelectorAll("th[" + c + "]"));
      d.length && (s[u] = new m(s, d));
    });
  }
  function m(l, p) {
    this.table = l, this.ths = p, this._col = -1, this._dir = null;
    const s = this;
    p.forEach(function(f, n) {
      if (f[u + "Bound"]) return;
      f[u + "Bound"] = !0;
      const e = f.querySelector("[" + v + "]");
      e && (e._lnSortClick = function() {
        s._handleClick(n, f);
      }, e.addEventListener("click", e._lnSortClick));
    });
    const d = l.closest("[data-ln-table][data-ln-persist]");
    if (d) {
      const f = It("table-sort", d);
      f && f.dir && f.col >= 0 && f.col < p.length && this._applySort(f.col, p[f.col], f.dir);
    }
    return this;
  }
  m.prototype._applySort = function(l, p, s) {
    this.ths.forEach(function(d) {
      d.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), s === null ? (this._col = -1, this._dir = null) : (this._col = l, this._dir = s, p.classList.add(s === "asc" ? "ln-sort-asc" : "ln-sort-desc")), S(this.table, "ln-table:sort", {
      column: l,
      sortType: p.getAttribute(c),
      direction: s
    });
  }, m.prototype._handleClick = function(l, p) {
    let s;
    this._col !== l ? s = "asc" : this._dir === "asc" ? s = "desc" : this._dir === "desc" ? s = null : s = "asc", this._applySort(l, p, s);
    const d = this.table.closest("[data-ln-table][data-ln-persist]");
    d && (s === null ? ft("table-sort", d, null) : ft("table-sort", d, { col: l, dir: s }));
  }, m.prototype.destroy = function() {
    this.table[u] && (this.ths.forEach(function(l) {
      const p = l.querySelector("[" + v + "]");
      p && p._lnSortClick && (p.removeEventListener("click", p._lnSortClick), delete p._lnSortClick), delete l[u + "Bound"];
    }), delete this.table[u]);
  };
  function h() {
    it(function() {
      new MutationObserver(function(p) {
        p.forEach(function(s) {
          s.type === "childList" ? s.addedNodes.forEach(function(d) {
            d.nodeType === 1 && _(d);
          }) : s.type === "attributes" && _(s.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [c] });
    }, "ln-table-sort");
  }
  window[u] = y, h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const u = "data-ln-table", c = "lnTable", v = "data-ln-table-sort", y = "data-ln-table-empty";
  if (window[c] !== void 0) return;
  const s = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function d(e, a) {
    if (e == null || isNaN(e)) return "";
    try {
      return new Intl.NumberFormat(W(a)).format(e);
    } catch {
      return String(e);
    }
  }
  function f(e) {
    let a = e.parentElement;
    for (; a && a !== document.body && a !== document.documentElement; ) {
      const t = getComputedStyle(a).overflowY;
      if (t === "auto" || t === "scroll") return a;
      a = a.parentElement;
    }
    return null;
  }
  function n(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("[data-ln-table-body]") || e.querySelector("tbody"), this.thead = e.querySelector("thead");
    const a = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = a ? Array.from(a.querySelectorAll("th")) : [], this.isDataDriven = e.hasAttribute("data-ln-table-source"), this.name = e.getAttribute(u) || "", this.source = e.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const i = this;
    return this._onSetSearch = function(t) {
      const o = (t.detail && t.detail.query != null ? t.detail.query : t.detail && t.detail.term != null ? t.detail.term : "").trim();
      i.isDataDriven ? (i.currentSearch = o, S(e, "ln-table:search", {
        table: i.name,
        query: i.currentSearch
      }), i._requestData()) : (i._searchTerm = o.toLowerCase(), i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), S(e, "ln-table:filter", {
        term: i._searchTerm,
        matched: i._filteredData.length,
        total: i._data.length
      }));
    }, e.addEventListener("ln-table:set-search", this._onSetSearch), this._onSetFilter = function(t) {
      if (!t.detail) return;
      const o = t.detail.key, r = t.detail.values;
      if (i.isDataDriven)
        !r || r.length === 0 ? delete i.currentFilters[o] : i.currentFilters[o] = r, i._requestData();
      else {
        if (!r || r.length === 0)
          delete i._columnFilters[o];
        else {
          const g = [];
          for (let b = 0; b < r.length; b++)
            g.push(r[b].toLowerCase());
          i._columnFilters[o] = g;
        }
        i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), S(e, "ln-table:filter", {
          term: i._searchTerm,
          matched: i._filteredData.length,
          total: i._data.length
        });
      }
    }, e.addEventListener("ln-table:set-filter", this._onSetFilter), this._onRequestClearFilters = function() {
      i.isDataDriven ? (i.currentFilters = {}, i.currentSearch = "", S(e, "ln-table:clear-filters", { table: i.name }), i._requestData()) : (i._searchTerm = "", i._columnFilters = {}, i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), S(e, "ln-table:filter", {
        term: "",
        matched: i._filteredData.length,
        total: i._data.length
      }));
    }, e.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && e.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._totalSpan = e.querySelector("[data-ln-table-total]"), this._filteredSpan = e.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== e ? this._filteredSpan.parentElement : null), this._selectedSpan = e.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== e ? this._selectedSpan.parentElement : null), this._onSetData = function(t) {
      const o = t.detail || {};
      if (i._windowed) {
        e.classList.remove("ln-table--loading"), i._cache.ingest(o);
        return;
      }
      i._data = o.data || [], i._lastTotal = o.total != null ? o.total : i._data.length, i._lastFiltered = o.filtered != null ? o.filtered : i._data.length, i.totalCount = i._lastTotal, i.visibleCount = i._lastFiltered, i.isLoaded = !0, e.classList.remove("ln-table--loading"), i._vStart = -1, i._vEnd = -1, i._applyFilterAndSort(), i._render(), i._updateFooter(), S(e, "ln-table:rendered", {
        table: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      });
    }, e.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(t) {
      const o = t.detail && t.detail.loading;
      e.classList.toggle("ln-table--loading", !!o), o && (i.isLoaded = !1);
    }, e.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(t) {
      const o = t.target.closest("[data-ln-table-col-sort]");
      if (!o) return;
      const r = o.closest("th");
      if (!r) return;
      const g = r.getAttribute("data-ln-table-col");
      g && i._handleSort(g, r);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._selectable = e.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(t) {
      if (t.target.closest("[data-ln-table-row-select]") || t.target.closest("[data-ln-table-row-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const o = t.target.closest("[data-ln-table-row]");
      if (!o) return;
      const r = o.getAttribute("data-ln-table-row-id"), g = o._lnRecord || {};
      S(e, "ln-table:row-click", {
        table: i.name,
        id: r,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(t) {
      const o = t.target.closest("[data-ln-table-row-action]");
      if (!o) return;
      t.stopPropagation();
      const r = o.closest("[data-ln-table-row]");
      if (!r) return;
      const g = o.getAttribute("data-ln-table-row-action"), b = r.getAttribute("data-ln-table-row-id"), w = r._lnRecord || {};
      S(e, "ln-table:row-action", {
        table: i.name,
        id: b,
        action: g,
        record: w
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(t) {
      if (!e.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      const o = i.tbody ? Array.from(i.tbody.querySelectorAll("[data-ln-table-row]")) : [];
      if (o.length)
        switch (t.key) {
          case "ArrowDown":
            t.preventDefault(), i._focusedRowIndex = Math.min(i._focusedRowIndex + 1, o.length - 1), i._focusRow(o);
            break;
          case "ArrowUp":
            t.preventDefault(), i._focusedRowIndex = Math.max(i._focusedRowIndex - 1, 0), i._focusRow(o);
            break;
          case "Home":
            t.preventDefault(), i._focusedRowIndex = 0, i._focusRow(o);
            break;
          case "End":
            t.preventDefault(), i._focusedRowIndex = o.length - 1, i._focusRow(o);
            break;
          case "Enter":
            if (i._focusedRowIndex >= 0 && i._focusedRowIndex < o.length) {
              t.preventDefault();
              const r = o[i._focusedRowIndex];
              S(e, "ln-table:row-click", {
                table: i.name,
                id: r.getAttribute("data-ln-table-row-id"),
                record: r._lnRecord || {}
              });
            }
            break;
          case " ":
            if (i._selectable && i._focusedRowIndex >= 0 && i._focusedRowIndex < o.length) {
              t.preventDefault();
              const r = o[i._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              r && (r.checked = !r.checked, r.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : S(e, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      i.tbody.rows.length > 0 && (i._emptyTbodyObserver.disconnect(), i._emptyTbodyObserver = null, i._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(t) {
      i._sortCol = t.detail.direction === null ? -1 : t.detail.column, i._sortDir = t.detail.direction, i._sortType = t.detail.sortType, i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), S(e, "ln-table:sorted", {
        column: t.detail.column,
        direction: t.detail.direction,
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, e.addEventListener("ln-table:sort", this._onSort)), this;
  }
  n.prototype._parseRows = function() {
    const e = this.tbody.rows, a = this.ths;
    this._data = [];
    const i = [];
    for (let t = 0; t < a.length; t++)
      i[t] = a[t].getAttribute(v);
    e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (let t = 0; t < e.length; t++) {
      const o = e[t], r = [], g = [], b = [];
      for (let E = 0; E < o.cells.length; E++) {
        const A = o.cells[E], L = A.textContent.trim(), T = Yt(A), k = i[E];
        g[E] = L.toLowerCase(), k === "number" || k === "date" ? r[E] = parseFloat(T) || 0 : k === "string" ? r[E] = String(T) : r[E] = null, E < o.cells.length - 1 && b.push(L.toLowerCase());
      }
      let w = null;
      if (this.isDataDriven) {
        w = {};
        const E = o.getAttribute("data-ln-table-row-id");
        E != null && (w.id = E);
        for (let A = 0; A < a.length; A++) {
          const L = a[A].getAttribute("data-ln-table-col");
          if (L) {
            const T = A;
            if (T < o.cells.length) {
              const k = o.cells[T];
              w[L] = Yt(k);
            }
          }
        }
      }
      this._data.push({
        sortKeys: r,
        rawTexts: g,
        html: o.outerHTML,
        searchText: b.join(" "),
        id: this.isDataDriven && w ? w.id : void 0,
        ...w
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, n.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const e = (this.currentSearch || "").trim().toLowerCase(), a = this.currentFilters || {}, i = Object.keys(a).length > 0;
      if (this._filteredData = this._data.filter(function(w) {
        if (e) {
          let E = !1;
          for (const A in w)
            if (w.hasOwnProperty(A) && typeof w[A] == "string" && A !== "html" && A !== "searchText" && w[A].toLowerCase().indexOf(e) !== -1) {
              E = !0;
              break;
            }
          if (!E) return !1;
        }
        if (i)
          for (const E in a) {
            const A = a[E];
            if (A && A.length > 0) {
              const L = w[E], T = L != null ? String(L) : "";
              if (A.indexOf(T) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const t = this.currentSort.field, r = this.currentSort.direction === "desc" ? -1 : 1;
      let g = null;
      if (this.ths) {
        for (let w = 0; w < this.ths.length; w++)
          if (this.ths[w].getAttribute("data-ln-table-col") === t) {
            g = this.ths[w].getAttribute(v);
            break;
          }
      }
      const b = s ? s.compare : function(w, E) {
        return w < E ? -1 : w > E ? 1 : 0;
      };
      this._filteredData.sort(function(w, E) {
        const A = w[t], L = E[t];
        if (g === "number" || g === "date") {
          const x = parseFloat(A) || 0, D = parseFloat(L) || 0;
          return (x - D) * r;
        }
        if (typeof A == "number" && typeof L == "number")
          return (A - L) * r;
        const T = A != null ? String(A) : "", k = L != null ? String(L) : "";
        return b(T, k) * r;
      });
    } else {
      const e = this._searchTerm, a = this._columnFilters, i = Object.keys(a).length > 0, t = this.ths, o = {};
      if (i)
        for (let E = 0; E < t.length; E++) {
          const A = t[E].getAttribute("data-ln-table-filter-col");
          A && (o[A] = E);
        }
      if (!e && !i ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
        if (e && E.searchText.indexOf(e) === -1) return !1;
        if (i)
          for (const A in a) {
            const L = o[A];
            if (L !== void 0 && a[A].indexOf(E.rawTexts[L]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const r = this._sortCol, g = this._sortDir === "desc" ? -1 : 1, b = this._sortType === "number" || this._sortType === "date", w = s ? s.compare : function(E, A) {
        return E < A ? -1 : E > A ? 1 : 0;
      };
      this._filteredData.sort(function(E, A) {
        const L = E.sortKeys[r], T = A.sortKeys[r];
        return b ? (L - T) * g : w(L, T) * g;
      });
    }
  }, n.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const e = document.createElement("colgroup");
    this.ths.forEach(function(a) {
      const i = document.createElement("col");
      i.style.width = a.offsetWidth + "px", e.appendChild(i);
    }), this.table.insertBefore(e, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = e;
  }, n.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const e = this._lastTotal, a = this.visibleCount;
        if (e === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || a === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const e = this._filteredData.length;
        e === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, n.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const e = this._filteredData, a = document.createDocumentFragment();
      for (let i = 0; i < e.length; i++) {
        const t = this._buildRow(e[i]);
        if (!t) break;
        a.appendChild(t);
      }
      this.tbody.textContent = "", this.tbody.appendChild(a), this._selectable && this._updateSelectAll();
    } else {
      const e = [], a = this._filteredData;
      for (let i = 0; i < a.length; i++) e.push(a[i].html);
      this.tbody.innerHTML = e.join("");
    }
  }, n.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const e = this;
    if (!this._rowHeight)
      if (this._windowed) {
        let i = null;
        const t = this._cache.peek();
        t ? i = this._buildRow(t) : i = this._buildPlaceholderRow(), i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._rowHeight = i.offsetHeight || 40, this.tbody.textContent = "");
      } else if (this.isDataDriven) {
        if (this._data.length > 0) {
          const i = this._buildRow(this._data[0]);
          i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._rowHeight = i.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const i = this.tbody ? this.tbody.rows : [];
        i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = f(this.dom) : this._scrollContainer = null;
    const a = this._scrollContainer || window;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._windowed ? e._renderWindowed() : e._renderVirtual();
      }));
    }, a.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, n.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, n.prototype._renderVirtual = function() {
    const e = this._filteredData, a = e.length, i = this._rowHeight;
    if (!i || !a) return;
    const t = this.thead ? this.thead.offsetHeight : 0, o = this._scrollContainer;
    let r, g;
    if (o) {
      const T = this.table.getBoundingClientRect(), k = o.getBoundingClientRect(), x = T.top - k.top + o.scrollTop + t;
      r = o.scrollTop - x, g = o.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + t;
      r = window.scrollY - x, g = window.innerHeight;
    }
    let b = Math.max(0, Math.floor(r / i) - 15);
    b = Math.min(b, a);
    const w = Math.min(b + Math.ceil(g / i) + 30, a);
    if (b === this._vStart && w === this._vEnd) return;
    this._vStart = b, this._vEnd = w;
    const E = this.ths.length || 1, A = b * i, L = (a - w) * i;
    if (this.isDataDriven) {
      const T = document.createDocumentFragment();
      if (A > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", E), x.style.height = A + "px", k.appendChild(x), T.appendChild(k);
      }
      for (let k = b; k < w; k++) {
        const x = this._buildRow(e[k]);
        x && T.appendChild(x);
      }
      if (L > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", E), x.style.height = L + "px", k.appendChild(x), T.appendChild(k);
      }
      this.tbody.textContent = "", this.tbody.appendChild(T), this._selectable && this._updateSelectAll();
    } else {
      let T = "";
      A > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let k = b; k < w; k++) T += e[k].html;
      L > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = T;
    }
  }, n.prototype._buildPlaceholderRow = function() {
    const e = document.createElement("tr");
    e.className = "ln-table__placeholder", e.setAttribute("aria-hidden", "true");
    const a = document.createElement("td");
    return a.setAttribute("colspan", this.ths.length || 1), a.style.height = this._rowHeight + "px", e.appendChild(a), e;
  }, n.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const e = this._rowHeight;
    if (!e) return;
    const a = this._cache.logicalTotal, i = this.thead ? this.thead.offsetHeight : 0, t = this._scrollContainer;
    let o, r;
    if (t) {
      const T = this.table.getBoundingClientRect(), k = t.getBoundingClientRect(), x = T.top - k.top + t.scrollTop + i;
      o = t.scrollTop - x, r = t.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + i;
      o = window.scrollY - x, r = window.innerHeight;
    }
    let g = Math.max(0, Math.floor(o / e) - 15);
    g = Math.min(g, a);
    const b = Math.min(g + Math.ceil(r / e) + 30, a), w = this.ths.length || 1, E = g * e, A = (a - b) * e, L = document.createDocumentFragment();
    if (E > 0) {
      const T = document.createElement("tr");
      T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = E + "px", T.appendChild(k), L.appendChild(T);
    }
    for (let T = g; T < b; T++)
      if (this._cache.has(T)) {
        const k = this._buildRow(this._cache.get(T));
        k && L.appendChild(k);
      } else
        L.appendChild(this._buildPlaceholderRow());
    if (A > 0) {
      const T = document.createElement("tr");
      T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", w), k.style.height = A + "px", T.appendChild(k), L.appendChild(T);
    }
    this.tbody.textContent = "", this.tbody.appendChild(L), this._vStart = g, this._vEnd = b, this._cache.ensure(g, b);
  }, n.prototype._showEmptyState = function() {
    const e = this.ths.length || 1;
    this.tbody.textContent = "";
    let a = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount, o = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (t < i || t === 0), r = o ? this.name + "-empty-filtered" : this.name + "-empty";
      if (a = ht(this.dom, r, "ln-table"), !a) {
        const g = this.dom.querySelector("template[data-ln-table-empty]");
        if (g) {
          const b = o ? "search" : "initial", w = g.content.querySelector('[data-ln-table-empty-when="' + b + '"]') || g.content.firstElementChild;
          w && (a = document.importNode(w, !0));
        }
      }
      if (a)
        if (a.tagName === "TR")
          this.tbody.appendChild(a);
        else {
          const g = document.createElement("td");
          g.setAttribute("colspan", String(e)), g.appendChild(a);
          const b = document.createElement("tr");
          b.className = "ln-table__empty", b.appendChild(g), this.tbody.appendChild(b);
        }
    } else {
      const i = this.dom.querySelector("template[" + y + "]"), t = document.createElement("td");
      t.setAttribute("colspan", String(e)), i && t.appendChild(document.importNode(i.content, !0));
      const o = document.createElement("tr");
      o.className = "ln-table__empty", o.appendChild(t), this.tbody.appendChild(o);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, n.prototype._fillRow = function(e, a) {
    Ct(e, a);
    const i = e.querySelectorAll("[data-ln-table-cell-attr]");
    for (let t = 0; t < i.length; t++) {
      const o = i[t], r = o.getAttribute("data-ln-table-cell-attr").split(",");
      for (let g = 0; g < r.length; g++) {
        const b = r[g].trim().split(":");
        if (b.length !== 2) continue;
        const w = b[0].trim(), E = b[1].trim();
        a[w] != null && o.setAttribute(E, a[w]);
      }
    }
  }, n.prototype._buildRow = function(e) {
    const a = ht(this.dom, this.name + "-row", "ln-table");
    if (!a) return null;
    const i = a.querySelector("[data-ln-table-row]") || a.firstElementChild;
    if (!i) return null;
    if (this._fillRow(i, e), i._lnRecord = e, e.id != null && i.setAttribute("data-ln-table-row-id", e.id), this._selectable && e.id != null && this.selectedIds.has(String(e.id))) {
      i.classList.add("ln-row-selected");
      const t = i.querySelector("[data-ln-table-row-select]");
      t && (t.checked = !0);
    }
    return i;
  }, n.prototype._handleSort = function(e, a) {
    let i;
    !this.currentSort || this.currentSort.field !== e ? i = "asc" : this.currentSort.direction === "asc" ? i = "desc" : i = null;
    for (let t = 0; t < this.ths.length; t++)
      this.ths[t].classList.remove("ln-sort-asc", "ln-sort-desc");
    i ? (this.currentSort = { field: e, direction: i }, a.classList.add(i === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-table:sort", {
      table: this.name,
      field: e,
      direction: i
    }), this._requestData();
  }, n.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    ie(this, "ln-table:request-data", "table");
  }, n.prototype._enterWindowedMode = function() {
    const e = this, a = this.dom, i = parseInt(a.getAttribute("data-ln-table-window"), 10), t = parseInt(a.getAttribute("data-ln-table-window-page"), 10), o = parseInt(a.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !e._windowed || !e._cache || (e.totalCount = e._cache.grandTotal, e.visibleCount = e._cache.logicalTotal, e._lastTotal = e._cache.grandTotal, e.isLoaded = !0, e._vStart = -1, e._vEnd = -1, e._render(), e._updateFooter(), S(a, "ln-table:rendered", {
        table: e.name,
        total: e.totalCount,
        visible: e.visibleCount
      }));
    }, this._renderBatch = Vt(this._onCacheChange), this._cache = ue({
      windowSize: i > 0 ? i : 1e3,
      pageSize: t > 0 ? t : 200,
      threshold: o >= 0 ? o : 25,
      fetchDebounce: 120,
      requestPage: function(r, g, b) {
        S(a, "ln-table:request-data", {
          table: e.name,
          sort: r.sort,
          filters: r.filters,
          search: r.search,
          offset: g,
          limit: b,
          queryGen: e._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, n.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let e = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(e) && this._totalSpan) {
        const i = this._totalSpan.textContent.replace(/[^\d]/g, "");
        i && (e = parseInt(i, 10));
      }
      const a = e > 0 ? e : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: a,
        filtered: a
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, n.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, n.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const e = this.tbody.querySelectorAll("[data-ln-table-row]");
    let a = e.length > 0;
    for (let i = 0; i < e.length; i++) {
      const t = e[i].getAttribute("data-ln-table-row-id");
      if (t != null && !this.selectedIds.has(t)) {
        a = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = a;
  }, Object.defineProperty(n.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), n.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const e = this;
    if (this._onSelectionChange = function(a) {
      const i = a.target.closest("[data-ln-table-row-select]");
      if (!i) return;
      const t = i.closest("[data-ln-table-row]");
      if (!t) return;
      const o = t.getAttribute("data-ln-table-row-id");
      o != null && (i.checked ? (e.selectedIds.add(o), t.classList.add("ln-row-selected")) : (e.selectedIds.delete(o), t.classList.remove("ln-row-selected")), e.selectedCount = e.selectedIds.size, e._updateSelectAll(), e._updateFooter(), S(e.dom, "ln-table:select", {
        table: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const a = document.createElement("input");
      a.type = "checkbox";
      const i = e.dom.querySelector('[data-ln-table-dict="select-all"]'), t = e.dom.getAttribute("data-ln-table-select-all-label") || (i ? i.textContent.trim() : null) || "Select all";
      a.setAttribute("aria-label", t), this._selectAllCheckbox.appendChild(a), this._selectAllCheckbox = a;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const a = e._selectAllCheckbox.checked, i = e.tbody ? e.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let t = 0; t < i.length; t++) {
        const o = i[t].getAttribute("data-ln-table-row-id"), r = i[t].querySelector("[data-ln-table-row-select]");
        o != null && (a ? (e.selectedIds.add(o), i[t].classList.add("ln-row-selected")) : (e.selectedIds.delete(o), i[t].classList.remove("ln-row-selected")), r && (r.checked = a));
      }
      e.selectedCount = e.selectedIds.size, S(e.dom, "ln-table:select-all", {
        table: e.name,
        selected: a
      }), S(e.dom, "ln-table:select", {
        table: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedCount
      }), e._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const a = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let i = 0; i < a.length; i++) {
        const t = a[i].querySelector("[data-ln-table-row-select]"), o = a[i].getAttribute("data-ln-table-row-id");
        t && t.checked && o != null && (this.selectedIds.add(o), a[i].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, n.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const e = this.dom.querySelector("[data-ln-table-col-select]");
    if (e) {
      const a = e.querySelector('input[type="checkbox"]');
      a && a.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const a = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let i = 0; i < a.length; i++) {
        a[i].classList.remove("ln-row-selected");
        const t = a[i].querySelector("[data-ln-table-row-select]");
        t && (t.checked = !1);
      }
    }
    this._updateFooter();
  }, n.prototype._updateFooter = function() {
    let e = 0, a = 0;
    this.isDataDriven ? (e = this._lastTotal != null ? this._lastTotal : this._data.length, a = this.visibleCount) : (e = this._data.length, a = this._filteredData.length);
    const i = a < e;
    if (this._totalSpan && (this._totalSpan.textContent = d(e, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = i ? d(a, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const t = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = t > 0 ? d(t, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", t === 0);
    }
  }, n.prototype._focusRow = function(e) {
    for (let a = 0; a < e.length; a++)
      e[a].classList.remove("ln-row-focused"), e[a].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < e.length) {
      const a = e[this._focusedRowIndex];
      a.classList.add("ln-row-focused"), a.setAttribute("tabindex", "0"), a.focus(), a.scrollIntoView({ block: "nearest" });
    }
  }, n.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:set-filter", this._onSetFilter), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-table:sort", this._onSort)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, H(u, c, n, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(e, a) {
      const i = e[c];
      if (!(!i || !i.isDataDriven)) {
        if (a === "data-ln-table-window") {
          const t = e.hasAttribute("data-ln-table-window");
          if (t && !i._windowed)
            i._enterWindowedMode(), i._kickWindowInitial();
          else if (!t && i._windowed)
            i._exitWindowedMode();
          else if (t && i._windowed) {
            const o = parseInt(e.getAttribute("data-ln-table-window"), 10);
            o > 0 && i._cache.configure({ windowSize: o });
          }
          return;
        }
        if (!(!i._windowed || !i._cache)) {
          if (a === "data-ln-table-window-page") {
            const t = parseInt(e.getAttribute("data-ln-table-window-page"), 10);
            t > 0 && i._cache.configure({ pageSize: t });
          } else if (a === "data-ln-table-window-threshold") {
            const t = parseInt(e.getAttribute("data-ln-table-window-threshold"), 10);
            t >= 0 && i._cache.configure({ threshold: t });
          } else if (a === "data-ln-table-count") {
            const t = parseInt(e.getAttribute("data-ln-table-count"), 10);
            t >= 0 && i._cache.setGrandTotal(t);
          }
        }
      }
    }
  });
})();
(function() {
  const u = "data-ln-table-coordinator", c = "lnTableCoordinator";
  if (window[c] !== void 0) return;
  function v(_, m) {
    if (m) {
      const h = document.getElementById(m);
      if (h && h.hasAttribute("data-ln-table")) return h;
    }
    if (_) {
      const h = _.getAttribute("data-ln-search") || _.getAttribute("data-ln-filter");
      if (h) {
        const s = document.getElementById(h) || document.querySelector('[data-ln-table="' + h + '"]');
        if (s) return s;
      }
      const l = _.closest("[" + u + "]");
      if (l) {
        const s = l.querySelector("[data-ln-table]");
        if (s) return s;
      }
      const p = _.closest("[data-ln-table]");
      if (p) return p;
    }
    return document.querySelector("[data-ln-table]");
  }
  document.addEventListener("ln-search:change", function(_) {
    const m = _.detail && _.detail.term != null ? _.detail.term : "", h = _.target, l = h.getAttribute ? h.getAttribute("data-ln-search") : null, p = v(h, l);
    if (!p || !p.lnTable) return;
    _.preventDefault();
    const s = h.tagName === "INPUT" || h.tagName === "TEXTAREA" ? h : h.querySelector ? h.querySelector('input[type="search"], input[type="text"], input') : null;
    s && s.value !== m && (s.value = m), S(p, "ln-table:set-search", {
      query: m,
      term: m,
      table: p.lnTable.name || p.id
    });
  }), document.addEventListener("ln-filter:changed", function(_) {
    if (!_.detail) return;
    const m = _.detail.key, h = _.detail.values || [], l = _.target;
    if (!l.hasAttribute || !l.hasAttribute("data-ln-filter")) return;
    const p = l.getAttribute ? l.getAttribute("data-ln-filter") : null, s = v(l, p);
    if (!s || !s.lnTable) return;
    const d = s.querySelectorAll("th");
    for (let f = 0; f < d.length; f++)
      if (d[f].getAttribute("data-ln-table-filter-col") === m) {
        const n = d[f].querySelector("[data-ln-table-col-filter]");
        n && n.classList.toggle("ln-filter-active", h.length > 0);
        break;
      }
    S(s, "ln-table:set-filter", {
      key: m,
      values: h,
      table: s.lnTable.name || s.id
    });
  }), document.addEventListener("click", function(_) {
    const m = _.target.closest("[data-ln-table-clear-all], [data-ln-table-clear]");
    if (!m) return;
    const h = v(m);
    if (!h || !h.lnTable) return;
    const l = h.querySelectorAll("th");
    for (let e = 0; e < l.length; e++) {
      const a = l[e].querySelector("[data-ln-table-col-filter]");
      a && a.classList.remove("ln-filter-active");
    }
    const s = m.closest("[" + u + "]") || document, d = h.id, f = d && s.querySelector('[data-ln-search="' + d + '"]') || s.querySelector("[data-ln-search]");
    if (f) {
      const e = f.tagName === "INPUT" || f.tagName === "TEXTAREA" ? f : f.querySelector("input");
      e && (e.value = "");
    }
    const n = d && s.querySelectorAll('[data-ln-filter="' + d + '"]') || s.querySelectorAll("[data-ln-filter]");
    for (let e = 0; e < n.length; e++) {
      const a = n[e].querySelector("[data-ln-filter-reset]");
      a && (a.checked = !0, a.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    S(h, "ln-table:request-clear-filters", {
      table: h.lnTable.name || h.id
    });
  }), document.addEventListener("keydown", function(_) {
    if (_.key !== "/" || _.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
    const m = document.querySelector("[" + u + "] [data-ln-search]") || document.querySelector("[data-ln-search]");
    if (!m) return;
    const h = m.tagName === "INPUT" || m.tagName === "TEXTAREA" ? m : m.querySelector('input[type="search"], input[type="text"], input');
    h && (_.preventDefault(), h.focus());
  });
  function y(_) {
    return this.dom = _, this;
  }
  y.prototype.destroy = function() {
    this.dom[c] && delete this.dom[c];
  }, H(u, c, y, "ln-table-coordinator");
})();
(function() {
  const u = "data-ln-list", c = "lnList", v = "data-ln-list-empty";
  if (window[c] !== void 0) return;
  function p(n, e) {
    if (n == null || isNaN(n)) return "";
    try {
      return new Intl.NumberFormat(W(e)).format(n);
    } catch {
      return String(n);
    }
  }
  function s(n) {
    let e = n;
    for (; e && e !== document.body && e !== document.documentElement; ) {
      const i = getComputedStyle(e).overflowY;
      if (i === "auto" || i === "scroll") return e;
      e = e.parentElement;
    }
    return null;
  }
  function d(n) {
    if (!n) return 0;
    const e = getComputedStyle(n), a = parseFloat(e.marginTop) || 0, i = parseFloat(e.marginBottom) || 0;
    return n.offsetHeight + a + i;
  }
  function f(n) {
    this.dom = n, this.tbody = n.querySelector("[data-ln-list-body]") || n, this.isDataDriven = n.hasAttribute("data-ln-list-source"), this.name = n.getAttribute(u) || "", this.source = n.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const e = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._windowed = !1, this._cache = null, this.isDataDriven && n.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = n.querySelector("[data-ln-list-total]"), this._filteredSpan = n.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.parentElement : null), this._selectedSpan = n.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.parentElement : null), this._onSetData = function(a) {
      const i = a.detail || {};
      if (e._windowed) {
        n.classList.remove("ln-list--loading"), e._cache.ingest(i);
        return;
      }
      e._data = i.data || [], e._lastTotal = i.total != null ? i.total : e._data.length, e._lastFiltered = i.filtered != null ? i.filtered : e._data.length, e.totalCount = e._lastTotal, e.visibleCount = e._lastFiltered, e.isLoaded = !0, n.classList.remove("ln-list--loading"), e._vStart = -1, e._vEnd = -1, e._applyFilterAndSort(), e._render(), e._updateFooter(), S(n, "ln-list:rendered", {
        list: e.name,
        total: e.totalCount,
        visible: e.visibleCount
      });
    }, n.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(a) {
      const i = a.detail && a.detail.loading;
      n.classList.toggle("ln-list--loading", !!i), i && (e.isLoaded = !1);
    }, n.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(a) {
      a.target.closest("[data-ln-list-clear-all]") && (e.currentFilters = {}, S(n, "ln-list:clear-filters", { list: e.name }), e._requestData());
    }, n.addEventListener("click", this._onClearAll), this._selectable = n.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onItemClick = function(a) {
      if (a.target.closest("[data-ln-item-select]") || a.target.closest("[data-ln-item-action]") || a.target.closest("a") || a.target.closest("button") || a.ctrlKey || a.metaKey || a.button === 1) return;
      const i = a.target.closest("[data-ln-item]");
      if (!i) return;
      const t = i.getAttribute("data-ln-item-id"), o = i._lnRecord || {};
      S(n, "ln-list:item-click", {
        list: e.name,
        id: t,
        record: o
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(a) {
      const i = a.target.closest("[data-ln-item-action]");
      if (!i) return;
      a.stopPropagation();
      const t = i.closest("[data-ln-item]");
      if (!t) return;
      const o = i.getAttribute("data-ln-item-action"), r = t.getAttribute("data-ln-item-id"), g = t._lnRecord || {};
      S(n, "ln-list:item-action", {
        list: e.name,
        id: r,
        action: o,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(a) {
      a.preventDefault(), e.currentSearch = a.detail && a.detail.term || "", S(n, "ln-list:search", {
        list: e.name,
        query: e.currentSearch
      }), e._requestData();
    }, n.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : S(n, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      e.tbody.children.length > 0 && (e._emptyObserver.disconnect(), e._emptyObserver = null, e._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(a) {
      a.preventDefault(), e._searchTerm = a.detail && a.detail.term || "", e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), S(n, "ln-list:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, n.addEventListener("ln-search:change", this._onSearch)), this._onClear = function(a) {
      if (!a.target.closest("[data-ln-list-clear]") || $(n, "ln-list:before-clear-search", { list: e.name }).defaultPrevented) return;
      e.isDataDriven ? e.currentSearch = "" : e._searchTerm = "";
      const o = document.querySelector('[data-ln-search="' + n.id + '"]');
      if (o) {
        const r = o.tagName === "INPUT" ? o : o.querySelector("input");
        r && (r.value = "", r.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
      e.isDataDriven ? (S(n, "ln-list:search", {
        list: e.name,
        query: ""
      }), e._requestData()) : (e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), S(n, "ln-list:filter", {
        term: "",
        matched: e._filteredData.length,
        total: e._data.length
      }));
    }, n.addEventListener("click", this._onClear), this;
  }
  f.prototype._parseChildren = function() {
    const n = Array.from(this.tbody.children).filter((e) => !e.classList.contains("ln-list__spacer"));
    this._data = [], n.length > 0 && (this._itemHeight = d(n[0]) || 50);
    for (let e = 0; e < n.length; e++) {
      const a = n[e], i = a.getAttribute("data-ln-item-id") || a.getAttribute("id"), t = a.textContent.trim().toLowerCase();
      let o = null;
      if (this.isDataDriven) {
        o = {}, i != null && (o.id = i);
        const r = a.querySelectorAll("[data-ln-list-field]");
        for (let g = 0; g < r.length; g++) {
          const b = r[g], w = b.getAttribute("data-ln-list-field");
          w && (o[w] = b.textContent.trim());
        }
      }
      this._data.push({
        html: a.outerHTML,
        searchText: t,
        id: i,
        ...o
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, f.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const n = (this.currentSearch || "").trim().toLowerCase(), e = this.currentFilters || {}, a = Object.keys(e).length > 0;
      if (this._filteredData = this._data.filter(function(r) {
        if (n) {
          let g = !1;
          for (const b in r)
            if (r.hasOwnProperty(b) && typeof r[b] == "string" && b !== "html" && b !== "searchText" && r[b].toLowerCase().indexOf(n) !== -1) {
              g = !0;
              break;
            }
          if (!g) return !1;
        }
        if (a)
          for (const g in e) {
            const b = e[g];
            if (b && b.length > 0) {
              const w = r[g], E = w != null ? String(w) : "";
              if (b.indexOf(E) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, t = this.currentSort.direction === "desc" ? -1 : 1, o = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(r, g) {
        return r < g ? -1 : r > g ? 1 : 0;
      };
      this._filteredData.sort(function(r, g) {
        const b = r[i], w = g[i];
        if (typeof b == "number" && typeof w == "number")
          return (b - w) * t;
        const E = b != null ? String(b) : "", A = w != null ? String(w) : "";
        return o(E, A) * t;
      });
    } else {
      const n = this._searchTerm;
      n ? this._filteredData = this._data.filter(function(e) {
        return e.searchText.indexOf(n) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, f.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const n = this._lastTotal, e = this.visibleCount;
        if (n === 0 || this._filteredData.length === 0 || e === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const n = this._filteredData.length;
        n === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : n > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, f.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const n = this._filteredData, e = document.createDocumentFragment();
      for (let a = 0; a < n.length; a++) {
        const i = this._buildItem(n[a]);
        if (!i) break;
        e.appendChild(i);
      }
      this.tbody.textContent = "", this.tbody.appendChild(e), this._selectable && this._updateSelectAll();
    } else {
      const n = [], e = this._filteredData;
      for (let a = 0; a < e.length; a++) n.push(e[a].html);
      this.tbody.innerHTML = n.join("");
    }
  }, f.prototype._readGridLayout = function() {
    const n = getComputedStyle(this.tbody), e = n.gridTemplateColumns;
    let a = 1;
    if (e && e !== "none") {
      const t = e.trim().split(/\s+/).filter(Boolean);
      t.length > 0 && (a = t.length);
    }
    const i = parseFloat(n.rowGap);
    return { columns: a, rowGap: isNaN(i) ? 0 : i };
  }, f.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const n = this._cache.peek(), e = n ? this._buildItem(n) : this._buildPlaceholderItem();
      e && (this.tbody.textContent = "", this.tbody.appendChild(e), this._itemHeight = d(e) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const n = this._buildItem(this._data[0]);
        n && (this.tbody.textContent = "", this.tbody.appendChild(n), this._itemHeight = d(n) || 50, this.tbody.textContent = "");
      }
    } else {
      const n = this.tbody.children;
      n.length > 0 && (this._itemHeight = d(n[0]) || 50);
    }
  }, f.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = s(this.dom);
    const e = this._scrollContainer || window;
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._windowed ? n._renderWindowed() : n._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      n._itemHeight = 0, n._measureItemHeight(), n._vStart = -1, n._vEnd = -1, n._windowed ? n._renderWindowed() : n._renderVirtual();
    }, e.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, f.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, f.prototype._renderVirtual = function() {
    const n = this._filteredData, e = n.length, a = this._itemHeight;
    if (!a || !e) return;
    const i = this._scrollContainer;
    let t, o;
    if (i) {
      const O = this.tbody.getBoundingClientRect(), F = i.getBoundingClientRect(), U = i === this.tbody ? 0 : O.top - F.top + i.scrollTop;
      t = i.scrollTop - U, o = i.clientHeight;
    } else {
      const F = this.tbody.getBoundingClientRect().top + window.scrollY;
      t = window.scrollY - F, o = window.innerHeight;
    }
    const r = this._readGridLayout(), g = r.columns, b = r.rowGap, w = a + b, E = Math.ceil(e / g);
    let A = Math.max(0, Math.floor(t / w) - 15);
    A = Math.min(A, E);
    const L = Math.ceil(o / w) + 30, T = Math.min(A + L, E), k = Math.min(A * g, e), x = Math.min(T * g, e);
    if (k === this._vStart && x === this._vEnd) return;
    this._vStart = k, this._vEnd = x;
    const D = A * w, N = (E - T) * w;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (D > 0) {
        const F = document.createElement(this.isUl ? "li" : "div");
        F.className = "ln-list__spacer", F.style.height = D + "px", O.appendChild(F);
      }
      for (let F = k; F < x; F++) {
        const U = this._buildItem(n[F]);
        U && O.appendChild(U);
      }
      if (N > 0) {
        const F = document.createElement(this.isUl ? "li" : "div");
        F.className = "ln-list__spacer", F.style.height = N + "px", O.appendChild(F);
      }
      this.tbody.textContent = "", this.tbody.appendChild(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      D > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${D}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let F = k; F < x; F++)
        O += n[F].html;
      N > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${N}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = O;
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
    const e = this._scrollContainer;
    let a, i;
    if (e) {
      const O = this.tbody.getBoundingClientRect(), F = e.getBoundingClientRect(), U = e === this.tbody ? 0 : O.top - F.top + e.scrollTop;
      a = e.scrollTop - U, i = e.clientHeight;
    } else {
      const F = this.tbody.getBoundingClientRect().top + window.scrollY;
      a = window.scrollY - F, i = window.innerHeight;
    }
    const t = this._readGridLayout(), o = t.columns, r = t.rowGap, g = n + r, b = this._cache.logicalTotal, w = Math.ceil(b / o);
    let E = Math.max(0, Math.floor(a / g) - 15);
    E = Math.min(E, w);
    const A = Math.ceil(i / g) + 30, L = Math.min(E + A, w), T = Math.min(E * o, b), k = Math.min(L * o, b), x = E * g, D = (w - L) * g, N = document.createDocumentFragment();
    if (x > 0) {
      const O = document.createElement(this.isUl ? "li" : "div");
      O.className = "ln-list__spacer", O.style.height = x + "px", N.appendChild(O);
    }
    for (let O = T; O < k; O++)
      if (this._cache.has(O)) {
        const F = this._buildItem(this._cache.get(O));
        F && N.appendChild(F);
      } else
        N.appendChild(this._buildPlaceholderItem());
    if (D > 0) {
      const O = document.createElement(this.isUl ? "li" : "div");
      O.className = "ln-list__spacer", O.style.height = D + "px", N.appendChild(O);
    }
    this.tbody.textContent = "", this.tbody.appendChild(N), this._vStart = T, this._vEnd = k, this._cache.ensure(T, k);
  }, f.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let n = null;
    if (this.isDataDriven) {
      const e = this._lastTotal != null ? this._lastTotal : this._data.length, a = this.visibleCount, i = this.currentSearch && (a < e || a === 0), t = i ? this.name + "-empty-filtered" : this.name + "-empty";
      if (n = ht(this.dom, t, "ln-list"), !n) {
        const o = this.dom.querySelector("template[data-ln-empty]");
        if (o) {
          const r = i ? "search" : "initial", g = o.content.querySelector(`[data-ln-empty-when="${r}"]`) || o.content.firstElementChild;
          g && (n = document.importNode(g, !0));
        }
      }
    } else {
      const e = this.dom.querySelector(`template[${v}]`);
      e && (n = document.importNode(e.content, !0));
    }
    if (n)
      if (n.tagName === "LI" || n.tagName === "TR")
        this.tbody.appendChild(n);
      else {
        const e = document.createElement(this.isUl ? "li" : "div");
        e.appendChild(n), this.tbody.appendChild(e);
      }
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, f.prototype._buildItem = function(n) {
    const e = ht(this.dom, this.name + "-row", "ln-list");
    if (!e) return null;
    const a = e.querySelector("[data-ln-item]") || e.firstElementChild;
    if (!a) return null;
    if (Ct(a, n), et(a, n), a._lnRecord = n, n.id != null && (a.setAttribute("data-ln-item-id", n.id), this._selectable && this.selectedIds.has(String(n.id)))) {
      a.classList.add("ln-item-selected");
      const i = a.querySelector("[data-ln-item-select]");
      i && (i.checked = !0);
    }
    return a;
  }, f.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const n = this;
    this._onSelectionChange = function(e) {
      const a = e.target.closest("[data-ln-item-select]");
      if (!a) return;
      const i = a.closest("[data-ln-item]");
      if (!i) return;
      const t = i.getAttribute("data-ln-item-id");
      t != null && (a.checked ? (n.selectedIds.add(String(t)), i.classList.add("ln-item-selected")) : (n.selectedIds.delete(String(t)), i.classList.remove("ln-item-selected")), n._updateSelectAll(), n._updateFooter(), S(n.dom, "ln-list:select", {
        list: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const e = n._selectAllCheckbox.checked, a = n.tbody.querySelectorAll("[data-ln-item]");
      for (let i = 0; i < a.length; i++) {
        const t = a[i], o = t.getAttribute("data-ln-item-id"), r = t.querySelector("[data-ln-item-select]");
        o != null && (e ? (n.selectedIds.add(String(o)), t.classList.add("ln-item-selected")) : (n.selectedIds.delete(String(o)), t.classList.remove("ln-item-selected")), r && (r.checked = e));
      }
      S(n.dom, "ln-list:select-all", { list: n.name, selected: e }), S(n.dom, "ln-list:select", {
        list: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedIds.size
      }), n._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, f.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const n = this.tbody.querySelectorAll("[data-ln-item]");
    let e = n.length > 0;
    for (let a = 0; a < n.length; a++) {
      const i = n[a].getAttribute("data-ln-item-id");
      if (i != null && !this.selectedIds.has(String(i))) {
        e = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = e;
  }, f.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    ie(this, "ln-list:request-data", "list");
  }, f.prototype._enterWindowedMode = function() {
    const n = this, e = this.dom, a = parseInt(e.getAttribute("data-ln-list-window"), 10), i = parseInt(e.getAttribute("data-ln-list-window-page"), 10), t = parseInt(e.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !n._windowed || !n._cache || (n.totalCount = n._cache.grandTotal, n.visibleCount = n._cache.logicalTotal, n._lastTotal = n._cache.grandTotal, n.isLoaded = !0, n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), S(e, "ln-list:rendered", {
        list: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      }));
    }, this._renderBatch = Vt(this._onCacheChange), this._cache = ue({
      windowSize: a > 0 ? a : 1e3,
      pageSize: i > 0 ? i : 200,
      threshold: t >= 0 ? t : 25,
      fetchDebounce: 120,
      requestPage: function(o, r, g) {
        S(e, "ln-list:request-data", {
          list: n.name,
          sort: o.sort,
          filters: o.filters,
          search: o.search,
          offset: r,
          limit: g,
          queryGen: n._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, f.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const n = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), e = n > 0 ? n : this._data.length;
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
  }, f.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, f.prototype._updateFooter = function() {
    let n = 0, e = 0;
    this.isDataDriven ? (n = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount) : (n = this._data.length, e = this._filteredData.length);
    const a = e < n;
    if (this._totalSpan && (this._totalSpan.textContent = p(n, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = a ? p(e, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !a), this._selectedSpan) {
      const i = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = i > 0 ? p(i, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, f.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch)), this._onClear && this.dom.removeEventListener("click", this._onClear), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, H(u, c, f, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(n, e) {
      const a = n[c];
      if (!(!a || !a.isDataDriven)) {
        if (e === "data-ln-list-window") {
          const i = n.hasAttribute("data-ln-list-window");
          if (i && !a._windowed)
            a._enterWindowedMode(), a._kickWindowInitial();
          else if (!i && a._windowed)
            a._exitWindowedMode();
          else if (i && a._windowed) {
            const t = parseInt(n.getAttribute("data-ln-list-window"), 10);
            t > 0 && a._cache.configure({ windowSize: t });
          }
          return;
        }
        if (!(!a._windowed || !a._cache)) {
          if (e === "data-ln-list-window-page") {
            const i = parseInt(n.getAttribute("data-ln-list-window-page"), 10);
            i > 0 && a._cache.configure({ pageSize: i });
          } else if (e === "data-ln-list-window-threshold") {
            const i = parseInt(n.getAttribute("data-ln-list-window-threshold"), 10);
            i >= 0 && a._cache.configure({ threshold: i });
          } else if (e === "data-ln-list-count") {
            const i = parseInt(n.getAttribute("data-ln-list-count"), 10);
            i >= 0 && a._cache.setGrandTotal(i);
          }
        }
      }
    }
  });
})();
(function() {
  const u = "data-ln-circular-progress", c = "lnCircularProgress";
  if (window[c] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", y = 36, _ = 16, m = 2 * Math.PI * _;
  function h(f) {
    return this.dom = f, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, p.call(this), d.call(this), s.call(this), this;
  }
  h.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[c]);
  };
  function l(f, n) {
    const e = document.createElementNS(v, f);
    for (const a in n)
      e.setAttribute(a, n[a]);
    return e;
  }
  function p() {
    this.svg = l("svg", {
      viewBox: "0 0 " + y + " " + y,
      "aria-hidden": "true"
    }), this.trackCircle = l("circle", {
      cx: y / 2,
      cy: y / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = l("circle", {
      cx: y / 2,
      cy: y / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + y / 2 + " " + y / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function s() {
    const f = this, n = new MutationObserver(function(e) {
      for (const a of e)
        (a.attributeName === "data-ln-circular-progress" || a.attributeName === "data-ln-circular-progress-max" || a.attributeName === "data-ln-circular-progress-label") && d.call(f);
    });
    n.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = n;
  }
  function d() {
    const f = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, n = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let e = n > 0 ? f / n * 100 : 0;
    e < 0 && (e = 0), e > 100 && (e = 100);
    const a = m - e / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", a);
    const i = this.dom.getAttribute("data-ln-circular-progress-label"), t = i !== null ? i : Math.round(e) + "%";
    this.labelEl.textContent = t, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(n));
    const o = Math.max(0, Math.min(f, n));
    this.dom.setAttribute("aria-valuenow", String(o)), this.dom.setAttribute("aria-valuetext", t), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: f,
      max: n,
      percentage: e
    });
  }
  H(u, c, h, "ln-circular-progress");
})();
(function() {
  const u = "data-ln-sortable", c = "lnSortable", v = "data-ln-sortable-handle";
  if (window[c] !== void 0) return;
  function y(m) {
    this.dom = m, this.isEnabled = m.getAttribute(u) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const h = this;
    return this._onPointerDown = function(l) {
      h.isEnabled && h._handlePointerDown(l);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(u, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(u, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[c]);
  }, y.prototype._handlePointerDown = function(m) {
    let h = m.target.closest("[" + v + "]"), l;
    if (h) {
      for (l = h; l && l.parentElement !== this.dom; )
        l = l.parentElement;
      if (!l || l.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (l = m.target; l && l.parentElement !== this.dom; )
        l = l.parentElement;
      if (!l || l.parentElement !== this.dom) return;
      h = l;
    }
    const s = Array.from(this.dom.children).indexOf(l);
    if ($(this.dom, "ln-sortable:before-drag", {
      item: l,
      index: s
    }).defaultPrevented) return;
    m.preventDefault(), h.setPointerCapture(m.pointerId), this._dragging = l, l.classList.add("ln-sortable--dragging"), l.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: l,
      index: s
    });
    const f = this, n = function(a) {
      f._handlePointerMove(a);
    }, e = function(a) {
      f._handlePointerEnd(a), h.removeEventListener("pointermove", n), h.removeEventListener("pointerup", e), h.removeEventListener("pointercancel", e);
    };
    h.addEventListener("pointermove", n), h.addEventListener("pointerup", e), h.addEventListener("pointercancel", e);
  }, y.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const h = Array.from(this.dom.children), l = this._dragging;
    for (const p of h)
      p.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const p of h) {
      if (p === l) continue;
      const s = p.getBoundingClientRect(), d = s.top + s.height / 2;
      if (m.clientY >= s.top && m.clientY < d) {
        p.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= d && m.clientY <= s.bottom) {
        p.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const h = this._dragging, l = Array.from(this.dom.children), p = l.indexOf(h);
    let s = null, d = null;
    for (const f of l) {
      if (f.classList.contains("ln-sortable--drop-before")) {
        s = f, d = "before";
        break;
      }
      if (f.classList.contains("ln-sortable--drop-after")) {
        s = f, d = "after";
        break;
      }
    }
    for (const f of l)
      f.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (h.classList.remove("ln-sortable--dragging"), h.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), s && s !== h) {
      d === "before" ? this.dom.insertBefore(h, s) : this.dom.insertBefore(h, s.nextElementSibling);
      const n = Array.from(this.dom.children).indexOf(h);
      S(this.dom, "ln-sortable:reordered", {
        item: h,
        oldIndex: p,
        newIndex: n
      });
    }
    this._dragging = null;
  };
  function _(m) {
    const h = m[c];
    if (!h) return;
    const l = m.getAttribute(u) !== "disabled";
    l !== h.isEnabled && (h.isEnabled = l, S(m, l ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  H(u, c, y, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const u = "data-ln-confirm", c = "lnConfirm", v = "data-ln-confirm-timeout";
  if (window[c] !== void 0) return;
  function _(...h) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...h);
  }
  function m(h) {
    _("constructor called on", h), this.dom = h, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = h.querySelector("[data-ln-confirm-idle]"), this.activeEl = h.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = h.textContent.trim(), this.confirmText = h.getAttribute(u) || "Confirm?");
    const l = this;
    return this._onClick = function(p) {
      if (_("click handler, confirming:", l.confirming, "submitted:", l._submitted, "target:", p.target), !l.confirming)
        p.preventDefault(), p.stopImmediatePropagation(), l._enterConfirm();
      else {
        if (l._submitted) return;
        l._submitted = !0, l._reset();
      }
    }, h.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const h = parseFloat(this.dom.getAttribute(v));
    return isNaN(h) || h <= 0 ? 3 : h;
  }, m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const l = this.activeEl ? this.activeEl.textContent.trim() : "";
      l && (this.dom.setAttribute("aria-label", l), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = h.getAttribute("href"), h.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const h = this, l = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      h._reset();
    }, l);
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
    _("destroy called on", this.dom), this.dom[c] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[c]);
  }, H(u, c, m, "ln-confirm");
})();
(function() {
  const u = "data-ln-translations", c = "lnTranslations";
  if (window[c] !== void 0) return;
  const v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function y(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(u + "-default") || "", this.placeholderLabel = _.getAttribute(u + "-placeholder") || "{lang} translation", this.removeLabel = _.getAttribute(u + "-remove-label") || "Remove {lang}", this.badgesEl = _.querySelector("[" + u + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = _.getAttribute(u + "-locales");
    if (this.locales = v, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const h = this;
    return this._onRequestAdd = function(l) {
      l.detail && l.detail.lang && h.addLanguage(l.detail.lang);
    }, this._onRequestRemove = function(l) {
      l.detail && l.detail.lang && h.removeLanguage(l.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  y.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of _) {
      const h = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const l of h)
        l.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, y.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of _) {
      const h = m.getAttribute("data-ln-translatable-lang");
      h && h !== this.defaultLang && this.activeLanguages.add(h);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, y.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let m = 0;
    for (const l in this.locales) {
      if (!this.locales.hasOwnProperty(l) || this.activeLanguages.has(l)) continue;
      m++;
      const p = kt("ln-translations-menu-item", "ln-translations");
      if (!p) return;
      const s = p.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", l), s.textContent = this.locales[l], s.addEventListener("click", function(d) {
        d.ctrlKey || d.metaKey || d.button === 1 || (d.preventDefault(), d.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(l));
      }), this.menuEl.appendChild(p);
    }
    const h = this.dom.querySelector("[" + u + "-add]");
    h && (h.hidden = m === 0);
  }, y.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(m) {
      const h = kt("ln-translations-badge", "ln-translations");
      if (!h) return;
      const l = h.querySelector("[data-ln-translations-lang]");
      l.setAttribute("data-ln-translations-lang", m);
      const p = l.querySelector("span");
      p.textContent = _.locales[m] || m.toUpperCase();
      const s = l.querySelector("button"), d = _.locales[m] || m.toUpperCase();
      s.setAttribute("aria-label", _.removeLabel.replace("{lang}", d)), s.addEventListener("click", function(f) {
        f.ctrlKey || f.metaKey || f.button === 1 || (f.preventDefault(), f.stopPropagation(), _.removeLanguage(m));
      }), _.badgesEl.appendChild(h);
    });
  }, y.prototype.addLanguage = function(_, m) {
    if (this.activeLanguages.has(_)) return;
    const h = this.locales[_] || _;
    if ($(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: h
    }).defaultPrevented) return;
    this.activeLanguages.add(_), m = m || {};
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const s of p) {
      const d = s.getAttribute("data-ln-translatable"), f = s.getAttribute("data-ln-translations-prefix") || "", n = s.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!n) continue;
      const e = n.cloneNode(n.tagName === "SELECT");
      f ? e.name = f + "[trans][" + _ + "][" + d + "]" : e.name = "trans[" + _ + "][" + d + "]", e.value = m[d] !== void 0 ? m[d] : "", e.removeAttribute("id"), "placeholder" in e && (e.placeholder = this.placeholderLabel.replace("{lang}", h)), e.setAttribute("data-ln-translatable-lang", _);
      const a = s.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), i = a.length > 0 ? a[a.length - 1] : n;
      i.parentNode.insertBefore(e, i.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: h
    });
  }, y.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || $(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const h = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const l of h)
      l.parentNode.removeChild(l);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: _
    });
  }, y.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, y.prototype.hasLanguage = function(_) {
    return this.activeLanguages.has(_);
  }, y.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const _ = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of m)
      h.getAttribute("data-ln-translatable-lang") !== _ && h.parentNode.removeChild(h);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[c];
  }, H(u, c, y, "ln-translations");
})();
(function() {
  const u = "data-ln-autosave", c = "lnAutosave", v = "data-ln-autosave-clear", y = "data-ln-autosave-debounce-input", _ = "ln-autosave:";
  if (window[c] !== void 0) return;
  function h(d) {
    const f = l(d);
    if (!f) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", d);
      return;
    }
    this.dom = d, this.key = f;
    let n = null;
    function e() {
      const o = re(d, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(f, JSON.stringify(o));
      } catch {
        return;
      }
      S(d, "ln-autosave:saved", { target: d, data: o });
    }
    function a() {
      let o;
      try {
        o = localStorage.getItem(f);
      } catch {
        return;
      }
      if (!o) return;
      let r;
      try {
        r = JSON.parse(o);
      } catch {
        return;
      }
      if ($(d, "ln-autosave:before-restore", { target: d, data: r }).defaultPrevented) return;
      const b = oe(d, r);
      for (let w = 0; w < b.length; w++)
        b[w].dispatchEvent(new Event("input", { bubbles: !0 })), b[w].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(d, "ln-autosave:restored", { target: d, data: r });
    }
    function i() {
      try {
        localStorage.removeItem(f);
      } catch {
        return;
      }
      S(d, "ln-autosave:cleared", { target: d });
    }
    this._onFocusout = function(o) {
      const r = o.target;
      p(r) && r.name && !r.hasAttribute("data-ln-autosave-exclude") && e();
    }, this._onChange = function(o) {
      const r = o.target;
      p(r) && r.name && !r.hasAttribute("data-ln-autosave-exclude") && e();
    }, this._onSubmit = function() {
      i();
    }, this._onReset = function() {
      i();
    }, this._onClearClick = function(o) {
      o.target.closest("[" + v + "]") && i();
    }, d.addEventListener("focusout", this._onFocusout), d.addEventListener("change", this._onChange), d.addEventListener("submit", this._onSubmit), d.addEventListener("reset", this._onReset), d.addEventListener("click", this._onClearClick);
    const t = s(d);
    return t > 0 && (this._onInput = function(o) {
      const r = o.target;
      !p(r) || !r.name || r.hasAttribute("data-ln-autosave-exclude") || (n !== null && clearTimeout(n), n = setTimeout(e, t));
    }, d.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return n;
    }, a(), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const d = this._getInputTimer();
        d !== null && clearTimeout(d);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[c];
    }
  };
  function l(d) {
    const n = d.getAttribute(u) || d.id;
    return n ? _ + window.location.pathname + ":" + n : null;
  }
  function p(d) {
    const f = d.tagName;
    return f === "INPUT" || f === "TEXTAREA" || f === "SELECT";
  }
  function s(d) {
    if (!d.hasAttribute(y)) return 0;
    const f = d.getAttribute(y);
    if (f === "" || f === null) return 1e3;
    const n = parseInt(f, 10);
    return isNaN(n) || n < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", d), 1e3) : n;
  }
  H(u, c, h, "ln-autosave");
})();
(function() {
  const u = "data-ln-autoresize", c = "lnAutoresize";
  if (window[c] !== void 0) return;
  function v(y) {
    if (y.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", y.tagName), this;
    this.dom = y;
    const _ = this;
    return this._onInput = function() {
      _._resize();
    }, y.addEventListener("input", this._onInput), this._resize(), this;
  }
  v.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, v.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[c]);
  }, H(u, c, v, "ln-autoresize");
})();
(function() {
  const u = "data-ln-editor", c = "lnEditor";
  if (window[c] !== void 0) return;
  const v = {
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
  }, m = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let h = 0;
  function l(t) {
    return !!(y[t] || _[t] || m[t] || t === "link");
  }
  function p(t) {
    this.dom = t;
    const o = this;
    if (this._textarea = t.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", t), this;
    const r = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), r && this._surface.setAttribute("data-placeholder", r);
    const g = this._textarea.id;
    if (g) {
      const A = t.querySelector('label[for="' + g + '"]');
      A && (A.id || (A.id = g + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = g ? g + "-surface" : "ln-editor-surface-" + ++h;
    const b = this._textarea.value.trim();
    b && (this._surface.innerHTML = b);
    const w = t.querySelector('[role="toolbar"]');
    if (w && w.nextSibling ? t.insertBefore(this._surface, w.nextSibling) : t.appendChild(this._surface), w) {
      w.setAttribute("aria-controls", this._surface.id);
      const A = w.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < A.length; L++) {
        const T = A[L].getAttribute("data-ln-editor-action");
        l(T) && A[L].setAttribute("aria-pressed", "false");
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
      const T = L.getAttribute("data-ln-editor-action");
      o._execAction(T);
    }, this._onPaste = function(A) {
      f(o, A);
    }, this._onKeydown = function(A) {
      a(o, A);
    }, this._onSelectionChange = function() {
      document.contains(o._surface) && o._updateActiveStates();
    }, this._onFocus = function() {
      S(o.dom, "ln-editor:focus", { target: o.dom });
    }, this._onBlur = function() {
      o._syncToTextarea(), S(o.dom, "ln-editor:blur", { target: o.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), w && (w.addEventListener("mousedown", this._onMousedownToolbar), w.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      const L = A.detail && A.detail.html;
      L !== void 0 && (o._surface.innerHTML = L, o._syncToTextarea(), S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      }));
    }, t.addEventListener("ln-editor:set-content", this._onSetContent);
    const E = this._textarea.form;
    return E && (this._onFormReset = function() {
      setTimeout(function() {
        o._surface.innerHTML = o._textarea.value, S(t, "ln-editor:changed", {
          html: o._textarea.value,
          target: t
        });
      }, 0);
    }, E.addEventListener("reset", this._onFormReset)), this;
  }
  p.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, p.prototype._execAction = function(t) {
    if (!(!t || $(this.dom, "ln-editor:before-change", {
      action: t,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), y[t])
        document.execCommand(y[t], !1, null);
      else if (_[t]) {
        const r = _[t], g = s(this._surface);
        g && g.toLowerCase() === r ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + r + ">");
      } else m[t] ? document.execCommand(m[t], !1, null) : t === "link" ? i(this) : t === "unlink" ? document.execCommand("unlink", !1, null) : t === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, p.prototype._updateActiveStates = function() {
    const t = this.dom.querySelector('[role="toolbar"]');
    if (!t) return;
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const r = o.anchorNode;
    if (!r || !this._surface.contains(r)) return;
    const g = t.querySelectorAll("[data-ln-editor-action]");
    for (let b = 0; b < g.length; b++) {
      const w = g[b], E = w.getAttribute("data-ln-editor-action");
      let A = !1;
      if (y[E])
        try {
          A = document.queryCommandState(y[E]);
        } catch {
        }
      else if (_[E]) {
        const L = s(this._surface);
        A = L && L.toLowerCase() === _[E];
      } else if (m[E])
        try {
          A = document.queryCommandState(m[E]);
        } catch {
        }
      else E === "link" && (A = !!d(o.anchorNode, "A", this._surface));
      l(E) && w.setAttribute("aria-pressed", String(A)), A ? w.classList.add("ln-editor-active") : w.classList.remove("ln-editor-active");
    }
  }, p.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, p.prototype.setHTML = function(t) {
    this._surface && (this._surface.innerHTML = t, this._syncToTextarea(), S(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const t = this.dom.querySelector('[role="toolbar"]');
    t && (t.removeEventListener("mousedown", this._onMousedownToolbar), t.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const o = this._textarea ? this._textarea.form : null;
    o && this._onFormReset && o.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const r = this.dom.querySelector(".ln-editor__link-popover");
    r && r.remove(), S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function s(t) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return null;
    let r = o.anchorNode;
    if (!r) return null;
    for (; r && r !== t; ) {
      if (r.nodeType === 1) {
        const g = r.tagName;
        if (g === "H2" || g === "H3" || g === "H4" || g === "BLOCKQUOTE" || g === "PRE" || g === "P")
          return g;
      }
      r = r.parentNode;
    }
    return null;
  }
  function d(t, o, r) {
    for (; t && t !== r; ) {
      if (t.nodeType === 1 && t.tagName === o)
        return t;
      t = t.parentNode;
    }
    return null;
  }
  function f(t, o) {
    o.preventDefault();
    let r = "";
    if (o.clipboardData && (r = o.clipboardData.getData("text/html"), !r)) {
      const b = o.clipboardData.getData("text/plain");
      b && (r = b.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), r = "<p>" + r + "</p>");
    }
    if (!r) return;
    const g = n(r);
    g && document.execCommand("insertHTML", !1, g);
  }
  function n(t) {
    const o = document.createElement("div");
    return o.innerHTML = t, e(o), o.innerHTML;
  }
  function e(t) {
    const o = Array.from(t.childNodes);
    for (let r = 0; r < o.length; r++) {
      const g = o[r];
      if (g.nodeType !== 3) {
        if (g.nodeType !== 1) {
          t.removeChild(g);
          continue;
        }
        if (v[g.tagName]) {
          const b = Array.from(g.attributes);
          for (let w = 0; w < b.length; w++) {
            const E = b[w].name;
            if (g.tagName === "A" && E === "href") {
              const A = g.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || g.removeAttribute("href");
            } else
              g.removeAttribute(E);
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
  function a(t, o) {
    if (!(o.ctrlKey || o.metaKey)) return;
    let r = null;
    switch (o.key.toLowerCase()) {
      case "b":
        r = "bold";
        break;
      case "i":
        r = "italic";
        break;
      case "u":
        r = "underline";
        break;
      case "k":
        r = "link";
        break;
    }
    r && (o.preventDefault(), t._execAction(r));
  }
  function i(t) {
    const o = window.getSelection();
    if (!o || o.rangeCount === 0) return;
    const r = d(o.anchorNode, "A", t._surface), g = o.getRangeAt(0).cloneRange(), b = t.dom.querySelector(".ln-editor__link-popover");
    b && b.remove();
    const w = ht(t.dom, "ln-editor-link-popover", "ln-editor");
    if (!w) return;
    const E = w.firstElementChild;
    if (!E) return;
    const A = E.querySelector('input[type="url"]'), L = E.querySelector('[data-ln-editor-action="confirm-link"]'), T = E.querySelector('[data-ln-editor-action="cancel-link"]');
    r && (A.value = r.getAttribute("href") || "");
    const k = t.dom.querySelector('[role="toolbar"]');
    k ? k.after(E) : t.dom.insertBefore(E, t._surface), A.focus();
    function x() {
      const O = window.getSelection();
      O.removeAllRanges(), O.addRange(g);
    }
    function D() {
      const O = A.value.trim();
      if (E.remove(), x(), t._surface.focus(), O)
        if (r)
          r.setAttribute("href", O), r.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea(), S(t.dom, "ln-editor:changed", {
            html: t._textarea.value,
            target: t.dom
          });
        else {
          document.execCommand("createLink", !1, O);
          const F = window.getSelection();
          if (F && F.anchorNode) {
            const U = d(F.anchorNode, "A", t._surface);
            U && (U.setAttribute("rel", "noopener noreferrer"), t._syncToTextarea());
          }
        }
      else r && document.execCommand("unlink", !1, null);
    }
    function N() {
      E.remove(), x(), t._surface.focus();
    }
    L.addEventListener("click", D), T.addEventListener("click", N), A.addEventListener("keydown", function(O) {
      O.key === "Enter" ? (O.preventDefault(), D()) : O.key === "Escape" && (O.preventDefault(), N());
    });
  }
  H(u, c, p, "ln-editor");
})();
(function() {
  const u = "lnFill";
  if (window[u] !== void 0) return;
  const c = { lnFillForm: !0, lnFillStore: !0 };
  function v(_) {
    const m = {}, h = _.dataset;
    for (const l in h) {
      if (!l.startsWith("lnFill") || c[l]) continue;
      const p = l.slice(6);
      p && (m[p.charAt(0).toLowerCase() + p.slice(1)] = h[l]);
    }
    return m;
  }
  function y(_, m) {
    const h = window.CSS && CSS.escape ? CSS.escape(m) : m, l = document.querySelectorAll('[data-ln-fill-id="' + h + '"]');
    if (l.length === 0) return null;
    for (let p = 0; p < l.length; p++) {
      const s = l[p].getAttribute("data-ln-fill-form");
      if (s) {
        const d = document.getElementById(s);
        if (d && _.contains(d)) return l[p];
      }
    }
    return l[0];
  }
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const m = _.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const h = m.getAttribute("href");
    if (h && h.indexOf("#") !== -1) return;
    const l = m.getAttribute("data-ln-fill-form"), p = document.getElementById(l);
    if (!p) return;
    const s = v(m), d = Object.keys(s).length > 0;
    window.lnCore.lnFill(p, d ? s : null);
  }), document.addEventListener("ln-fill:request", function(_) {
    const m = _.detail;
    if (!m) return;
    const h = _.target, l = m.id;
    if (l == null) {
      window.lnCore.lnFill(h, null);
      return;
    }
    const p = y(h, l);
    if (!p) return;
    const s = v(p);
    window.lnCore.lnFill(h, s);
  }), window[u] = !0;
})();
(function() {
  const u = "data-ln-slug-from", c = "lnSlug";
  if (window[c] !== void 0) return;
  function v(_) {
    return String(_).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function y(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const m = _.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    const h = _.getAttribute(u), l = m.elements[h];
    if (!l)
      return console.warn('[ln-slug] Source field "' + h + '" not found in form:', _), this;
    if (typeof l.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + h + '" is a RadioNodeList (same-name group) — single source field required:', _), this;
    this.dom = _, this.source = l, this._pristine = _.value === "", this._mirroring = !1;
    const p = this;
    return this._onSource = function() {
      p._pristine && p._mirror();
    }, this._onSlug = function() {
      p._mirroring || (p._pristine = p.dom.value === "");
    }, l.addEventListener("input", this._onSource), _.addEventListener("input", this._onSlug), this;
  }
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = v(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[c] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[c]);
  }, H(u, c, y, "ln-slug");
})();
(function() {
  const u = "data-ln-time", c = "lnTime";
  if (window[c] !== void 0) return;
  const v = {}, y = {};
  function _(E) {
    return E.getAttribute("data-ln-time-locale") || W(E);
  }
  function m(E, A) {
    const L = (E || "") + "|" + JSON.stringify(A);
    return v[L] || (v[L] = new Intl.DateTimeFormat(E, A)), v[L];
  }
  function h(E) {
    const A = E || "";
    return y[A] || (y[A] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), y[A];
  }
  const l = /* @__PURE__ */ new Set();
  let p = null;
  function s() {
    p || (p = setInterval(f, 6e4));
  }
  function d() {
    p && (clearInterval(p), p = null);
  }
  function f() {
    for (const E of l) {
      if (!document.body.contains(E.dom)) {
        l.delete(E);
        continue;
      }
      o(E);
    }
    l.size === 0 && d();
  }
  function n(E, A) {
    const L = At(A), T = (A || "").toLowerCase().split("-")[0], k = m(A, { dateStyle: "long", timeStyle: "short" }), x = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && x !== T && L.monthsLong) {
      const D = L.monthsLong[E.getMonth()], N = E.getDate(), O = E.getFullYear(), F = String(E.getHours()).padStart(2, "0"), U = String(E.getMinutes()).padStart(2, "0");
      return `${N} ${D} ${O} во ${F}:${U}`;
    }
    return k.format(E);
  }
  function e(E, A) {
    const L = /* @__PURE__ */ new Date(), T = { month: "short", day: "numeric" };
    E.getFullYear() !== L.getFullYear() && (T.year = "numeric");
    const k = At(A), x = (A || "").toLowerCase().split("-")[0], D = m(A, T), N = D.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (k && N !== x && k.monthsShort) {
      const O = k.monthsShort[E.getMonth()], F = E.getDate(), U = E.getFullYear() !== L.getFullYear() ? " " + E.getFullYear() : "";
      return `${F} ${O}${U}`;
    }
    return D.format(E);
  }
  function a(E, A) {
    return m(A, { dateStyle: "medium" }).format(E);
  }
  function i(E, A) {
    return m(A, { timeStyle: "short" }).format(E);
  }
  function t(E, A) {
    const L = Math.floor(Date.now() / 1e3), k = Math.floor(E.getTime() / 1e3) - L, x = Math.abs(k);
    if (x < 10) return h(A).format(0, "second");
    let D, N;
    if (x < 60)
      D = "second", N = k;
    else if (x < 3600)
      D = "minute", N = Math.round(k / 60);
    else if (x < 86400)
      D = "hour", N = Math.round(k / 3600);
    else if (x < 604800)
      D = "day", N = Math.round(k / 86400);
    else if (x < 2592e3)
      D = "week", N = Math.round(k / 604800);
    else
      return e(E, A);
    return h(A).format(N, D);
  }
  function o(E) {
    const A = E.dom.getAttribute("datetime");
    if (!A) return;
    const L = Number(A);
    if (isNaN(L)) return;
    const T = new Date(L * 1e3), k = E.dom.getAttribute(u) || "short", x = _(E.dom);
    let D;
    switch (k) {
      case "relative":
        D = t(T, x);
        break;
      case "full":
        D = n(T, x);
        break;
      case "date":
        D = a(T, x);
        break;
      case "time":
        D = i(T, x);
        break;
      default:
        D = e(T, x);
        break;
    }
    E.dom.textContent = D, k !== "full" && (E.dom.title = n(T, x));
  }
  function r(E) {
    return this.dom = E, o(this), E.getAttribute(u) === "relative" && (l.add(this), s()), this;
  }
  r.prototype.render = function() {
    o(this);
  }, r.prototype.destroy = function() {
    l.delete(this), l.size === 0 && d(), delete this.dom[c];
  };
  function g(E) {
    const A = E[c];
    if (!A) return;
    E.getAttribute(u) === "relative" ? (l.add(A), s()) : (l.delete(A), l.size === 0 && d()), o(A);
  }
  function b(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(u) && E[c] && o(E[c]);
  }
  function w() {
    new MutationObserver(function() {
      const E = document.querySelectorAll("[" + u + "]");
      for (let A = 0; A < E.length; A++) {
        const L = E[A][c];
        L && o(L);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(u, c, r, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: g,
    onInit: b
  }), w();
})();
(function() {
  const u = "data-ln-data-store", c = "lnDataStore";
  if (window[c] !== void 0) return;
  const v = "ln_app_cache", y = "_meta", _ = "1.0";
  let m = null, h = null;
  const l = {};
  function p(C) {
    C && C.name === "QuotaExceededError" && S(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function s() {
    const C = {};
    for (const q of document.querySelectorAll(`[${u}]`)) {
      const I = q.getAttribute(u);
      if (I) {
        const R = q.getAttribute("data-ln-data-store-indexes") || "";
        C[I] = {
          indexes: R.split(",").map((M) => M.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function d() {
    return h || (h = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), C(null);
      const q = s(), I = Object.keys(q), R = indexedDB.open(v);
      R.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, R.onsuccess = (M) => {
        const B = M.target.result, z = Array.from(B.objectStoreNames);
        if (!(!z.includes(y) || I.some((wt) => !z.includes(wt))))
          return f(B), m = B, C(B);
        const Q = B.version;
        B.close();
        const J = indexedDB.open(v, Q + 1);
        J.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, J.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, J.onupgradeneeded = (wt) => {
          const ct = wt.target.result;
          ct.objectStoreNames.contains(y) || ct.createObjectStore(y, { keyPath: "key" });
          for (const Ot of I)
            if (!ct.objectStoreNames.contains(Ot)) {
              const Ae = ct.createObjectStore(Ot, { keyPath: "id" });
              for (const Qt of q[Ot].indexes)
                Ae.createIndex(Qt, Qt, { unique: !1 });
            }
        }, J.onsuccess = (wt) => {
          const ct = wt.target.result;
          f(ct), m = ct, C(ct);
        };
      };
    }), h);
  }
  function f(C) {
    C.onversionchange = () => {
      C.close(), m = null, h = null;
    };
  }
  function n() {
    return m ? Promise.resolve(m) : (h = null, d());
  }
  async function e(C) {
    if (!_t() || !C) return C;
    const q = { ...C }, I = q.id, R = await Ie(q);
    return !R || !R.encrypted ? C : {
      id: I,
      encrypted: !0,
      iv: R.iv,
      data: R.data
    };
  }
  async function a(C) {
    return !C || !C.encrypted || !_t() ? C : Re(C);
  }
  const i = (C, q) => n().then((I) => I ? I.transaction(C, q).objectStore(C) : null);
  function t(C) {
    return new Promise((q, I) => {
      C.onsuccess = () => q(C.result), C.onerror = () => {
        p(C.error), I(C.error);
      };
    });
  }
  const o = (C) => i(C, "readonly").then((q) => q ? t(q.getAll()) : []).then((q) => _t() ? Promise.all(q.map((I) => a(I))) : q), r = (C, q) => i(C, "readonly").then((I) => I ? t(I.get(q)) : null).then((I) => I ? a(I) : null), g = (C, q) => (_t() ? e(q) : Promise.resolve(q)).then((R) => i(C, "readwrite").then((M) => M ? t(M.put(R)) : null)), b = (C, q) => i(C, "readwrite").then((I) => I ? t(I.delete(q)) : null), w = (C) => i(C, "readwrite").then((q) => q ? t(q.clear()) : null), E = (C) => i(C, "readonly").then((q) => q ? t(q.count()) : 0), A = (C) => i(y, "readonly").then((q) => q ? t(q.get(C)) : null), L = (C, q) => i(y, "readwrite").then((I) => {
    if (I)
      return q.key = C, t(I.put(q));
  });
  function T(C) {
    this.dom = C, this._name = C.getAttribute(u);
    const q = C.getAttribute("data-ln-data-store-stale"), I = parseInt(q, 10);
    this._staleThreshold = q === "never" || q === "-1" ? -1 : isNaN(I) ? 300 : I;
    const R = C.getAttribute("data-ln-data-store-search-fields") || "";
    return this._searchFields = R.split(",").map((M) => M.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), l[this._name] = this, k(this), this.ready = rt(this), this;
  }
  function k(C) {
    C._handlers = {
      create: (q) => x(C, "create", q.detail, () => N(C, q.detail)),
      update: (q) => x(C, "update", q.detail, () => O(C, q.detail)),
      delete: (q) => x(C, "delete", q.detail, () => F(C, q.detail)),
      "bulk-delete": (q) => x(C, "bulk-delete", q.detail, () => U(C, q.detail)),
      "sync-failed": (q) => {
        C.isSyncing = !1, S(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: q.detail && q.detail.error,
          status: q.detail && q.detail.status
        });
      }
    };
    for (const [q, I] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${q}`, I);
  }
  function x(C, q, I, R) {
    const M = I && I.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return R();
    }).catch((B) => lt(C, q, M, B)), C._mutationChain;
  }
  function D(C) {
    return E(C._name).then((q) => (C.totalCount = q, C.hasCache = !0, C.isLoaded = !0, L(C._name, {
      schema_version: _,
      last_synced_at: C.lastSyncedAt,
      has_cache: !0,
      record_count: q
    })));
  }
  function N(C, { tempId: q, data: I = {}, requestId: R } = {}) {
    const M = { ...I, id: q };
    return g(C._name, M).then(() => D(C)).then(() => {
      S(C.dom, "ln-data-store:created", { store: C._name, record: M, tempId: q, requestId: R });
    });
  }
  function O(C, { id: q, data: I = {}, requestId: R } = {}) {
    return r(C._name, q).then((M) => {
      if (!M) throw new Error(`Record not found: ${q}`);
      const B = { ...M, ...I }, z = I.id;
      return (z !== void 0 && z !== q ? K(C._name, q, B) : g(C._name, B)).then(() => D(C)).then(() => {
        S(C.dom, "ln-data-store:updated", { store: C._name, record: B, previous: M, requestId: R });
      });
    });
  }
  function F(C, { id: q, requestId: I } = {}) {
    return r(C._name, q).then((R) => {
      if (!R) {
        S(C.dom, "ln-data-store:deleted", { store: C._name, id: q, requestId: I, missing: !0 });
        return;
      }
      return b(C._name, q).then(() => D(C)).then(() => {
        S(C.dom, "ln-data-store:deleted", { store: C._name, id: q, requestId: I });
      });
    });
  }
  function U(C, { ids: q = [], requestId: I } = {}) {
    return q.length ? Promise.all(q.map((R) => r(C._name, R))).then((R) => {
      const M = R.filter(Boolean).map((B) => B.id);
      return P(C._name, M).then(() => D(C)).then(() => {
        S(C.dom, "ln-data-store:deleted", { store: C._name, ids: M, requestId: I });
      });
    }) : (S(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: I }), Promise.resolve());
  }
  function lt(C, q, I, R) {
    console.error("[ln-data-store] " + q + " failed:", R), S(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: q,
      requestId: I,
      error: R
    });
  }
  function rt(C) {
    return d().then((q) => {
      if (!q) throw new Error("IndexedDB is unavailable");
      return A(C._name);
    }).then((q) => {
      if (C.initializationError = null, q && q.schema_version === _)
        C.lastSyncedAt = q.last_synced_at || null, C.totalCount = q.record_count || 0, C.hasCache = q.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, S(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, S(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (q && q.schema_version !== _)
          return w(C._name).then(() => L(C._name, { schema_version: _, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, S(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, S(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((q) => (C.isInitialized = !0, C.isLoaded = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = q, S(C.dom, "ln-data-store:initialization-error", { store: C._name, error: q }), { ok: !1, error: q }));
  }
  function yt(C) {
    C.isSyncing = !0, S(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function Lt(C, q) {
    return n().then((I) => I ? (_t() ? Promise.all(q.map((M) => e(M))) : Promise.resolve(q)).then((M) => new Promise((B, z) => {
      const j = I.transaction(C, "readwrite"), Q = j.objectStore(C);
      M.forEach((J) => Q.put(J)), j.oncomplete = () => B(), j.onerror = () => {
        p(j.error), z(j.error);
      };
    })) : void 0);
  }
  function P(C, q) {
    return n().then((I) => {
      if (I)
        return new Promise((R, M) => {
          const B = I.transaction(C, "readwrite"), z = B.objectStore(C);
          q.forEach((j) => z.delete(j)), B.oncomplete = () => R(), B.onerror = () => M(B.error);
        });
    });
  }
  function K(C, q, I) {
    return (_t() ? e(I) : Promise.resolve(I)).then((M) => n().then((B) => {
      if (B)
        return new Promise((z, j) => {
          const Q = B.transaction(C, "readwrite"), J = Q.objectStore(C);
          J.put(M), J.delete(q), Q.oncomplete = () => z(), Q.onerror = () => {
            p(Q.error), j(Q.error);
          };
        });
    }));
  }
  const G = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function vt(C, q) {
    if (!q || !q.field) return C;
    const { field: I, direction: R } = q, M = R === "desc";
    return [...C].sort((B, z) => {
      const j = B[I], Q = z[I];
      if (j == null && Q == null) return 0;
      if (j == null) return M ? 1 : -1;
      if (Q == null) return M ? -1 : 1;
      const J = typeof j == "string" && typeof Q == "string" ? G.compare(j, Q) : j < Q ? -1 : j > Q ? 1 : 0;
      return M ? -J : J;
    });
  }
  function ot(C, q) {
    if (!q) return C;
    const I = Object.keys(q).filter((R) => Array.isArray(q[R]) && q[R].length > 0);
    return I.length ? C.filter(
      (R) => I.every((M) => q[M].map(String).includes(String(R[M])))
    ) : C;
  }
  function tt(C, q, I) {
    if (!q || !I || !I.length) return C;
    const R = q.toLowerCase();
    return C.filter(
      (M) => I.some((B) => {
        const z = M[B];
        return z != null && String(z).toLowerCase().includes(R);
      })
    );
  }
  function Et(C, q, I) {
    if (!C.length) return 0;
    if (I === "count") return C.length;
    const R = C.map((B) => parseFloat(B[q])).filter((B) => !isNaN(B)), M = R.reduce((B, z) => B + z, 0);
    return I === "sum" ? M : I === "avg" && R.length ? M / R.length : 0;
  }
  function st(C, q) {
    if (!C.presenters || !C.presenters.computed) return q;
    const I = C.presenters.computed;
    return q.map((R) => {
      const M = { ...R };
      for (const [B, z] of Object.entries(I))
        try {
          M[B] = z(R);
        } catch (j) {
          console.error(`[ln-data-store] Decorator computed field failed for ${B}`, j);
        }
      return M;
    });
  }
  T.prototype.getAll = function(C = {}) {
    const q = this;
    return o(q._name).then((I) => {
      const R = I.length;
      C.filters && (I = ot(I, C.filters)), C.search && (I = tt(I, C.search, q._searchFields));
      const M = I.length;
      if (C.sort && (I = vt(I, C.sort)), C.offset || C.limit) {
        const B = C.offset || 0, z = C.limit || I.length;
        I = I.slice(B, B + z);
      }
      return {
        data: st(q, I),
        total: R,
        filtered: M
      };
    });
  }, T.prototype.getById = function(C) {
    return r(this._name, C).then((q) => q ? st(this, [q])[0] : null);
  }, T.prototype.count = function(C) {
    return C ? o(this._name).then((q) => ot(q, C).length) : E(this._name);
  }, T.prototype.aggregate = function(C, q) {
    return o(this._name).then((I) => Et(I, C, q));
  }, T.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, T.prototype.applySync = function(C, q, I, R) {
    R = R || {};
    const M = this;
    C.length > 0 || q.length > 0;
    let B = Promise.resolve();
    return C.length > 0 && (B = B.then(() => Lt(M._name, C))), q.length > 0 && (B = B.then(() => P(M._name, q))), B.then(() => E(M._name)).then((z) => (M.totalCount = R.total !== void 0 ? R.total : z, M.hasCache = !0, L(M._name, {
      schema_version: _,
      last_synced_at: I,
      has_cache: !0,
      record_count: M.totalCount
    }))).then(() => {
      const z = !M.isLoaded;
      M.isLoaded = !0, M.isSyncing = !1, M.lastSyncedAt = I, z ? (S(M.dom, "ln-data-store:loaded", { store: M._name, count: M.totalCount, meta: R }), S(M.dom, "ln-data-store:ready", { store: M._name, count: M.totalCount, source: "server", meta: R })) : S(M.dom, "ln-data-store:synced", {
        store: M._name,
        added: C.length,
        deleted: q.length,
        changed: !0,
        meta: R
      });
    }).catch((z) => {
      M.isSyncing = !1, console.error("[ln-data-store] applySync failed:", z);
    });
  }, T.prototype.forceSync = function() {
    yt(this);
  }, T.prototype.fullReload = function() {
    const C = this;
    return w(C._name).then(() => L(C._name, {
      schema_version: _,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, yt(C);
    });
  }, T.prototype.destroy = function() {
    if (this._handlers) {
      for (const [C, q] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, q);
      this._handlers = null;
    }
    delete l[this._name], delete this.dom[c], S(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function pt() {
    return n().then((C) => {
      if (!C) return;
      const q = Array.from(C.objectStoreNames);
      return new Promise((I, R) => {
        const M = C.transaction(q, "readwrite");
        q.forEach((B) => M.objectStore(B).clear()), M.oncomplete = () => I(), M.onerror = () => R(M.error);
      });
    }).then(() => {
      Object.values(l).forEach((C) => {
        C.isLoaded = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  H(u, c, T, "ln-data-store"), window[c].clearAll = pt, window[c].init = window[c], window[c].setStorageKey = Xt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Xt);
})();
(function() {
  const u = "data-ln-api-connector", c = "lnApiConnector", v = "lnConnector";
  if (window[c] !== void 0) return;
  function y(l) {
    return l.ok ? l.status === 204 ? null : l.json() : l.json().catch(() => null).then((p) => {
      const s = new Error("HTTP " + l.status + ": " + l.statusText);
      throw s.status = l.status, s.data = p, s;
    });
  }
  function _(l) {
    return this.dom = l, l[c] = this, l[v] = this, this.refreshConfig(), this._handlers = null, m(this), this;
  }
  _.prototype.refreshConfig = function() {
    const l = this.dom;
    this.baseUrl = l.getAttribute("data-ln-api-base-url") || "", this.path = l.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: l.getAttribute("data-ln-api-param-offset") || "offset",
      limit: l.getAttribute("data-ln-api-param-limit") || "limit",
      search: l.getAttribute("data-ln-api-param-search") || "search",
      sortField: l.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: l.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const p = l.getAttribute("data-ln-api-headers") || "";
    this.headers = le(p, "ln-api-connector"), (p.toLowerCase().includes("authorization") || p.toLowerCase().includes("bearer") || p.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(l, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, _.prototype._reqHeaders = function(l) {
    const p = Object.assign({}, bt(this.headers), { "X-LN-Response": "data" });
    return l && (p["Idempotency-Key"] = l), p;
  }, _.prototype.fetchDelta = function(l) {
    const p = this;
    let s = Y(p.baseUrl, p.path);
    return l != null && l !== "" && (s += (s.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(l)), window.fetch(s, { method: "GET", headers: p._reqHeaders(), credentials: p.credentials }).then(y);
  }, _.prototype.query = function(l) {
    const p = this;
    l = l || {};
    let s = Y(p.baseUrl, p.path);
    const d = p.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, f = new URLSearchParams();
    l.search && f.append(d.search, l.search), l.offset != null && f.append(d.offset, l.offset), l.limit != null && f.append(d.limit, l.limit), l.sort && l.sort.field && l.sort.direction && (f.append(d.sortField, l.sort.field), f.append(d.sortDir, l.sort.direction)), l.filters && typeof l.filters == "object" && Object.keys(l.filters).forEach((e) => {
      const a = l.filters[e];
      Array.isArray(a) && a.length > 0 && f.append(e, a.join(","));
    });
    const n = f.toString();
    return n && (s += (s.indexOf("?") !== -1 ? "&" : "?") + n), window.fetch(s, { method: "GET", headers: p._reqHeaders(), credentials: p.credentials }).then(y);
  }, _.prototype.create = function(l, p, s) {
    const d = this;
    return window.fetch(Y(d.baseUrl, p || d.path), {
      method: "POST",
      headers: d._reqHeaders(s),
      credentials: d.credentials,
      body: JSON.stringify(l)
    }).then(y);
  }, _.prototype.update = function(l, p, s, d, f) {
    const n = this;
    s != null && (p = Object.assign({}, p, { expected_version: s }));
    const e = d ? Y(n.baseUrl, d) : Y(n.baseUrl, n.path, l);
    return window.fetch(e, {
      method: "PUT",
      headers: n._reqHeaders(f),
      credentials: n.credentials,
      body: JSON.stringify(p)
    }).then(y);
  }, _.prototype.delete = function(l, p, s) {
    const d = this;
    return window.fetch(Y(d.baseUrl, p || d.path, l), {
      method: "DELETE",
      headers: d._reqHeaders(s),
      credentials: d.credentials
    }).then(y);
  }, _.prototype.bulkDelete = function(l, p, s) {
    const d = this;
    return window.fetch(Y(d.baseUrl, p || d.path) + "/bulk-delete", {
      method: "DELETE",
      headers: d._reqHeaders(s),
      credentials: d.credentials,
      body: JSON.stringify({ ids: l })
    }).then(y);
  };
  function m(l) {
    l._handlers = {
      sync: function(s) {
        const d = s.detail || {};
        l.fetchDelta(d.since).then(function(f) {
          S(l.dom, "ln-api-connector:fetched", { data: f, since: d.since, meta: d.meta || null });
        }).catch(function(f) {
          S(l.dom, "ln-api-connector:error", {
            action: "sync",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            since: d.since,
            meta: d.meta || null
          });
        });
      },
      query: function(s) {
        const d = s.detail || {}, f = d.query || d;
        l.query(f).then(function(n) {
          const e = n || {};
          S(l.dom, "ln-api-connector:fetched", {
            data: e.data || (Array.isArray(e) ? e : []),
            total: e.total,
            filtered: e.filtered,
            offset: f.offset,
            queryGen: f.queryGen,
            meta: d.meta || null
          });
        }).catch(function(n) {
          S(l.dom, "ln-api-connector:error", {
            action: "query",
            error: n.message,
            status: n.status || 0,
            data: n.data || null,
            meta: d.meta || null
          });
        });
      },
      create: function(s) {
        const d = s.detail || {};
        l.create(d.data, d.url, d.idempotencyKey).then(function(f) {
          const n = f && f.content !== void 0 ? f.content : f, e = f && f.message ? f.message : null;
          S(l.dom, "ln-api-connector:created", { record: n, tempId: d.tempId, message: e, meta: d.meta || null });
        }).catch(function(f) {
          S(l.dom, "ln-api-connector:error", {
            action: "create",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            tempId: d.tempId,
            meta: d.meta || null
          });
        });
      },
      update: function(s) {
        const d = s.detail || {};
        l.update(d.id, d.data, d.expected_version, d.url, d.idempotencyKey).then(function(f) {
          const n = f && f.content !== void 0 ? f.content : f, e = f && f.message ? f.message : null;
          S(l.dom, "ln-api-connector:updated", { record: n, id: d.id, message: e, meta: d.meta || null });
        }).catch(function(f) {
          S(l.dom, "ln-api-connector:error", {
            action: "update",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            id: d.id,
            conflictData: f.status === 409 ? f.data : null,
            meta: d.meta || null
          });
        });
      },
      delete: function(s) {
        const d = s.detail || {};
        l.delete(d.id, d.url, d.idempotencyKey).then(function(f) {
          const n = f && f.message ? f.message : null;
          S(l.dom, "ln-api-connector:deleted", { response: f, id: d.id, message: n, meta: d.meta || null });
        }).catch(function(f) {
          S(l.dom, "ln-api-connector:error", {
            action: "delete",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            id: d.id,
            meta: d.meta || null
          });
        });
      },
      bulkDelete: function(s) {
        const d = s.detail || {};
        l.bulkDelete(d.ids, d.url, d.idempotencyKey).then(function(f) {
          const n = f && f.message ? f.message : null;
          S(l.dom, "ln-api-connector:bulk-deleted", { response: f, ids: d.ids, message: n, meta: d.meta || null });
        }).catch(function(f) {
          S(l.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            ids: d.ids,
            meta: d.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(s) {
      l.dom.addEventListener(s + ":request-sync", l._handlers.sync), l.dom.addEventListener(s + ":request-query", l._handlers.query), l.dom.addEventListener(s + ":request-fetch", l._handlers.query), l.dom.addEventListener(s + ":request-create", l._handlers.create), l.dom.addEventListener(s + ":request-update", l._handlers.update), l.dom.addEventListener(s + ":request-delete", l._handlers.delete), l.dom.addEventListener(s + ":request-bulk-delete", l._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const l = this;
    l._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(s) {
      l.dom.removeEventListener(s + ":request-sync", l._handlers.sync), l.dom.removeEventListener(s + ":request-query", l._handlers.query), l.dom.removeEventListener(s + ":request-fetch", l._handlers.query), l.dom.removeEventListener(s + ":request-create", l._handlers.create), l.dom.removeEventListener(s + ":request-update", l._handlers.update), l.dom.removeEventListener(s + ":request-delete", l._handlers.delete), l.dom.removeEventListener(s + ":request-bulk-delete", l._handlers.bulkDelete);
    }), l._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[c], delete this.dom[v];
  };
  function h(l) {
    const p = l[c];
    p && p.refreshConfig();
  }
  H(u, c, _, "ln-api-connector", {
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
  const u = "data-ln-couchdb-connector", c = "lnCouchDbConnector", v = "lnConnector";
  if (window[c] !== void 0) return;
  function y(n) {
    const e = n && n.content !== void 0 ? n.content : n, a = n && n.message ? n.message : null;
    return { content: e, message: a };
  }
  function _(n) {
    return this.dom = n, n[c] = this, n[v] = this, this.refreshConfig(), this._handlers = null, d(this), this;
  }
  _.prototype.refreshConfig = function() {
    const n = this.dom;
    this.url = n.getAttribute("data-ln-couchdb-url") || "", this.db = n.getAttribute("data-ln-couchdb-db") || "", this.auth = n.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const e = n.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = le(e, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), e.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(n, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function m(n, e, a) {
    const i = Object.assign({}, bt(n.headers, n.auth), a || {});
    return e && (i["Idempotency-Key"] = e), i;
  }
  _.prototype.fetchDelta = function(n) {
    const e = this, a = ["include_docs=true", "feed=normal"];
    n && a.push("since=" + encodeURIComponent(n));
    const i = Y(e.url, e.db, "_changes") + "?" + a.join("&");
    return window.fetch(i, { method: "GET", headers: bt(e.headers, e.auth), credentials: e.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const o = t.results || [];
      return {
        data: o.filter((r) => !r.deleted && r.doc).map((r) => Object.assign({}, r.doc, { id: r.doc._id })),
        deleted: o.filter((r) => r.deleted).map((r) => r.id),
        synced_at: t.last_seq || n || ""
      };
    });
  };
  function h(n, e, a) {
    const i = Object.assign({ _id: e.id }, e);
    return i._id || delete i._id, window.fetch(Y(n.url, n.db), {
      method: "POST",
      headers: m(n, a),
      credentials: n.credentials,
      body: JSON.stringify(i)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const o = y(t), r = o.content;
      return { record: Object.assign({}, i, { id: r.id, _id: r.id, _rev: r.rev }), message: o.message };
    });
  }
  _.prototype.create = function(n, e) {
    return h(this, n, e).then((a) => a.record);
  };
  function l(n, e, a, i) {
    const t = Object.assign({ id: String(e), _id: String(e) }, a), o = t._rev || t.rev;
    return (o ? Promise.resolve(o) : window.fetch(Y(n.url, n.db, null, e), { method: "GET", headers: bt(n.headers, n.auth), credentials: n.credentials }).then((g) => {
      if (!g.ok) throw new Error("Could not retrieve document for revision mapping");
      return g.json().then((b) => b._rev);
    })).then((g) => {
      const b = Object.assign({}, t, { _rev: g });
      delete b.rev;
      const w = m(n, i, { "If-Match": g });
      return window.fetch(Y(n.url, n.db, null, e), {
        method: "PUT",
        headers: w,
        credentials: n.credentials,
        body: JSON.stringify(b)
      }).then((E) => {
        if (E.ok) return E.json().then((A) => {
          const L = y(A);
          return { record: Object.assign({}, b, { _rev: L.content.rev }), message: L.message };
        });
        if (E.status === 409) return E.json().then((A) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = A, L;
        });
        throw new Error("HTTP " + E.status + ": " + E.statusText);
      });
    });
  }
  _.prototype.update = function(n, e, a) {
    return l(this, n, e, a).then((i) => i.record);
  };
  function p(n, e, a, i) {
    return (a ? Promise.resolve(a) : window.fetch(Y(n.url, n.db, null, e), { method: "GET", headers: bt(n.headers, n.auth), credentials: n.credentials }).then((o) => {
      if (!o.ok) throw new Error("Could not retrieve document for revision delete");
      return o.json().then((r) => r._rev);
    })).then((o) => {
      const r = Y(n.url, n.db, null, e) + "?rev=" + encodeURIComponent(o);
      return window.fetch(r, { method: "DELETE", headers: m(n, i), credentials: n.credentials }).then((g) => {
        if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
        return g.json();
      }).then((g) => {
        const b = y(g);
        return { response: b.content, message: b.message };
      });
    });
  }
  _.prototype.delete = function(n, e, a) {
    return p(this, n, e, a).then((i) => i.response);
  };
  function s(n, e, a) {
    return !e || e.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Y(n.url, n.db, "_all_docs"), {
      method: "POST",
      headers: bt(n.headers, n.auth),
      credentials: n.credentials,
      body: JSON.stringify({ keys: e })
    }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => {
      const o = (i.rows || []).filter((r) => !r.error && r.value && r.value.rev).map((r) => ({ _id: r.id, _rev: r.value.rev, _deleted: !0 }));
      return o.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Y(n.url, n.db, "_bulk_docs"), {
        method: "POST",
        headers: m(n, a),
        credentials: n.credentials,
        body: JSON.stringify({ docs: o })
      }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
        return r.json();
      }).then((r) => {
        const g = y(r);
        return { response: { ok: !0, results: g.content, deletedCount: o.length }, message: g.message };
      });
    });
  }
  _.prototype.bulkDelete = function(n, e) {
    return s(this, n, e).then((a) => a.response);
  };
  function d(n) {
    n._handlers = {
      sync: function(a) {
        const i = a.detail || {};
        n.fetchDelta(i.since).then(function(t) {
          S(n.dom, "ln-couchdb-connector:fetched", { data: t, since: i.since, meta: i.meta || null });
        }).catch(function(t) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: i.since,
            meta: i.meta || null
          });
        });
      },
      create: function(a) {
        const i = a.detail || {};
        h(n, i.data, i.idempotencyKey).then(function(t) {
          S(n.dom, "ln-couchdb-connector:created", { record: t.record, tempId: i.tempId, message: t.message, meta: i.meta || null });
        }).catch(function(t) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: i.tempId,
            meta: i.meta || null
          });
        });
      },
      update: function(a) {
        const i = a.detail || {}, t = Object.assign({}, i.data);
        i.expected_version !== void 0 && (t._rev = i.expected_version), l(n, i.id, t, i.idempotencyKey).then(function(o) {
          S(n.dom, "ln-couchdb-connector:updated", { record: o.record, id: i.id, message: o.message, meta: i.meta || null });
        }).catch(function(o) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: o.message,
            status: o.status || 0,
            id: i.id,
            data: o.status === 409 ? o.data : null,
            conflictData: o.status === 409 ? o.data : null,
            meta: i.meta || null
          });
        });
      },
      delete: function(a) {
        const i = a.detail || {};
        p(n, i.id, i.rev, i.idempotencyKey).then(function(t) {
          S(n.dom, "ln-couchdb-connector:deleted", { response: t.response, id: i.id, message: t.message, meta: i.meta || null });
        }).catch(function(t) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: i.id,
            meta: i.meta || null
          });
        });
      },
      bulkDelete: function(a) {
        const i = a.detail || {};
        s(n, i.ids, i.idempotencyKey).then(function(t) {
          S(n.dom, "ln-couchdb-connector:bulk-deleted", { response: t.response, ids: i.ids, message: t.message, meta: i.meta || null });
        }).catch(function(t) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: i.ids,
            meta: i.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(a) {
      n.dom.addEventListener(a + ":request-sync", n._handlers.sync), n.dom.addEventListener(a + ":request-fetch", n._handlers.sync), n.dom.addEventListener(a + ":request-create", n._handlers.create), n.dom.addEventListener(a + ":request-update", n._handlers.update), n.dom.addEventListener(a + ":request-delete", n._handlers.delete), n.dom.addEventListener(a + ":request-bulk-delete", n._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const n = this;
    n._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(a) {
      n.dom.removeEventListener(a + ":request-sync", n._handlers.sync), n.dom.removeEventListener(a + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(a + ":request-create", n._handlers.create), n.dom.removeEventListener(a + ":request-update", n._handlers.update), n.dom.removeEventListener(a + ":request-delete", n._handlers.delete), n.dom.removeEventListener(a + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[c], delete this.dom[v];
  };
  function f(n) {
    const e = n[c];
    e && e.refreshConfig();
  }
  H(u, c, _, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: f
  });
})();
function Ue(u) {
  return u = u || {}, {
    sort: u.sort,
    filters: u.filters,
    search: u.search,
    offset: u.offset,
    limit: u.limit,
    queryGen: u.queryGen
  };
}
function Ft(u, c, v) {
  const y = !u || !!u.initializationError;
  return c && (v || y || !u.isLoaded) ? "remote" : u && !u.initializationError ? "store" : "none";
}
class ze {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(c) {
    return c ? this._pending.has(c) ? Promise.reject(new Error(`Duplicate mutation requestId: ${c}`)) : new Promise((v, y) => {
      this._pending.set(c, { resolve: v, reject: y });
    }) : Promise.reject(new Error("Mutation requestId is required"));
  }
  resolve(c) {
    return this._settle(c, !1);
  }
  reject(c) {
    return this._settle(c, !0);
  }
  close(c) {
    const v = c || new Error("Mutation receipt registry closed");
    for (const y of this._pending.values()) y.reject(v);
    this._pending.clear();
  }
  _settle(c, v) {
    const y = c && c.requestId;
    if (!y) return !1;
    const _ = this._pending.get(y);
    return _ ? (this._pending.delete(y), v ? _.reject(c.error || new Error("Store mutation failed")) : _.resolve(c), !0) : !1;
  }
}
(function() {
  const u = "data-ln-data-coordinator", c = "lnDataCoordinator", v = "lnCoordinator", y = "data-ln-form-scope";
  if (window[c] !== void 0) return;
  const _ = /* @__PURE__ */ new Set();
  let m = !1, h = null, l = null, p = null;
  function s() {
    m || (m = !0, h = function() {
      S(document, "ln-data-store:online", {}), _.forEach(function(t) {
        t._maybeSync();
      });
    }, l = function() {
      S(document, "ln-data-store:offline", {});
    }, p = function() {
      document.visibilityState === "visible" && _.forEach(function(t) {
        const o = t.findChildren(), r = o.store;
        r && o.connector && r.isInitialized && !r.initializationError && !r.isSyncing && !t._noAutosync && (!r.hasCache || t._isStale()) && r.forceSync();
      });
    }, window.addEventListener("online", h), window.addEventListener("offline", l), document.addEventListener("visibilitychange", p));
  }
  function d() {
    m && (_.size > 0 || (window.removeEventListener("online", h), window.removeEventListener("offline", l), document.removeEventListener("visibilitychange", p), h = null, l = null, p = null, m = !1));
  }
  function f() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (o) => {
        const r = Math.random() * 16 | 0;
        return (o === "x" ? r : r & 3 | 8).toString(16);
      });
    }
  }
  const n = ["ln-api-connector", "ln-couchdb-connector"];
  function e(t) {
    return this.dom = t, this._name = t.getAttribute(u), t[c] = this, t[v] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new ze(), this._dict = Kt(t, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), a(this), _.add(this), s(), this._checkInitialSync(), this;
  }
  e.prototype._parseStaleAttributes = function() {
    const o = this.findChildren().storeEl, r = this.dom.getAttribute("data-ln-data-coordinator-stale") || (o ? o.getAttribute("data-ln-data-store-stale") : null), g = parseInt(r, 10);
    this._staleThreshold = r === "never" || r === "-1" ? -1 : isNaN(g) ? 300 : g;
    const b = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (o ? o.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!b;
  }, e.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const o = this.findChildren().store;
    return !o || !o.lastSyncedAt ? !0 : Date.now() / 1e3 - o.lastSyncedAt > this._staleThreshold;
  }, e.prototype._maybeSync = function() {
    const t = this.findChildren(), o = t.store;
    !o || o.initializationError || !t.connector || this._noAutosync || !o.isInitialized || o.isSyncing || (!o.hasCache || this._isStale()) && o.forceSync();
  }, e.prototype._checkInitialSync = function() {
    const t = this, r = this.findChildren().store;
    r && Promise.resolve(r.ready).then(function() {
      const g = t.findChildren(), b = g.store;
      if (b && b.initializationError) {
        t._reportReconciliationError("store-initialize", b.initializationError, null);
        return;
      }
      !b || !g.connector || t._noAutosync || b.isSyncing || (!b.hasCache || t._isStale()) && b.forceSync();
    }).catch(function(g) {
      t._reportReconciliationError("store-initialize", g, null);
    });
  }, e.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const o = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    o && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(o)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(r) {
      return r;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(r) {
      return r;
    });
  }, e.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), o = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), r = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: t,
      connectorEl: o,
      queueEl: r,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: o ? o.lnConnector || o.lnApiConnector || o.lnCouchDbConnector : null,
      queue: r ? r.lnApiQueue : null
    };
  }, e.prototype._handleSubmitRecord = function(t) {
    const o = this.findChildren();
    if (!o.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const r = t.data || {}, g = r.id, b = r.expected_version, w = Object.assign({}, r);
    delete w.id, delete w.expected_version;
    const E = t.method.toUpperCase();
    E === "POST" ? this._fanOutCreate(o, w, t.action) : (E === "PUT" || E === "PATCH") && this._fanOutUpdate(o, g, w, b, t.action);
  }, e.prototype._fanOutCreate = function(t, o, r) {
    this.refreshMapper();
    const g = "_temp_" + f();
    S(t.storeEl, "ln-data-store:request-create", { tempId: g, data: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: g,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(o),
      expectedVersion: null,
      meta: { tempId: g, action: r }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(o),
      url: r,
      meta: { entryId: f(), queued: !1, op: "create", tempId: g }
    });
  }, e.prototype._fanOutUpdate = function(t, o, r, g, b) {
    this.refreshMapper(), S(t.storeEl, "ln-data-store:request-update", { id: o, data: r }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "update",
      targetId: o,
      payload: this.mapper.egress(r),
      expectedVersion: g,
      meta: { id: o, action: b }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-update", {
      id: o,
      data: this.mapper.egress(r),
      expected_version: g,
      url: b,
      meta: { entryId: f(), queued: !1, op: "update", id: o }
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
      meta: { entryId: f(), queued: !1, op: "delete", id: o }
    });
  }, e.prototype._fanOutBulkDelete = function(t, o) {
    this.refreshMapper();
    const r = o.join(",");
    S(t.storeEl, "ln-data-store:request-bulk-delete", { ids: o }), t.queue ? S(t.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: r,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: o },
      expectedVersion: null,
      meta: { bulkKey: r, ids: o }
    }) : t.connector && S(t.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: o,
      meta: { entryId: f(), queued: !1, op: "bulk-delete", bulkKey: r }
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
  }, e.prototype._requestStoreMutation = function(t, o, r) {
    const g = t.storeEl;
    if (!g) return Promise.reject(new Error("Store element not found"));
    const b = f(), w = this._mutationReceipts.wait(b);
    try {
      S(g, "ln-data-store:request-" + o, Object.assign({}, r, { requestId: b }));
    } catch (E) {
      this._mutationReceipts.reject({ requestId: b, error: E });
    }
    return w;
  }, e.prototype._reportReconciliationError = function(t, o, r) {
    S(this.dom, "ln-data-coordinator:error", {
      operation: t,
      error: o,
      meta: r || null
    });
  };
  function a(t) {
    t._handlers = {
      sync: function(o) {
        t.refreshMapper();
        const r = t.findChildren();
        if (!r.store || !r.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        S(r.connectorEl, "ln-api-connector:request-sync", { since: o.detail.since, meta: { op: "sync" } });
      },
      reqCreate: function(o) {
        const r = t.findChildren();
        r.storeEl && t._fanOutCreate(r, o.detail.data || {}, o.detail.action);
      },
      reqUpdate: function(o) {
        const r = t.findChildren();
        r.storeEl && t._fanOutUpdate(r, o.detail.id, o.detail.data || {}, o.detail.expected_version, o.detail.action);
      },
      reqDelete: function(o) {
        const r = t.findChildren();
        r.storeEl && t._fanOutDelete(r, o.detail.id);
      },
      reqBulkDelete: function(o) {
        const r = t.findChildren();
        r.storeEl && t._fanOutBulkDelete(r, o.detail.ids || []);
      },
      queueFailed: function() {
        t._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(o) {
        t.refreshMapper();
        const r = t.findChildren();
        if (!r.store || !r.connector || !r.queue) return;
        const g = o.detail || {}, b = g.entryId, w = g.op, E = g.targetId, A = g.payload, L = g.expectedVersion, T = g.meta || {}, k = T.action || null, x = g.idempotencyKey || b;
        w === "create" ? S(r.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: k,
          idempotencyKey: x,
          meta: { entryId: b, queued: !0, op: "create", tempId: T.tempId }
        }) : w === "update" ? S(r.connectorEl, "ln-api-connector:request-update", {
          id: E,
          data: A,
          expected_version: L,
          url: k,
          idempotencyKey: x,
          meta: { entryId: b, queued: !0, op: "update", id: E }
        }) : w === "delete" ? S(r.connectorEl, "ln-api-connector:request-delete", {
          id: E,
          idempotencyKey: x,
          meta: { entryId: b, queued: !0, op: "delete", id: E }
        }) : w === "bulk-delete" ? S(r.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          idempotencyKey: x,
          meta: { entryId: b, queued: !0, op: "bulk-delete", bulkKey: T.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", w);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(o) {
        const r = o.target;
        if (o.defaultPrevented) return;
        const g = r.hasAttribute(y) ? r.getAttribute(y) : null;
        if (g === null) return;
        let b;
        if (g ? b = g === t._name : b = r.closest("[data-ln-data-coordinator]") === t.dom, !b) return;
        const w = Le(r);
        if (w !== "POST" && w !== "PUT" && w !== "PATCH") return;
        o.preventDefault();
        const E = re(r);
        delete E._method, delete E._token, t._handleSubmitRecord({ data: E, method: w, action: r.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(o) {
        const r = o.detail.meta || {}, g = t.findChildren();
        t.refreshMapper();
        const b = o.detail.data;
        let w = [], E = [], A = null;
        Array.isArray(b) ? (w = b, A = Math.floor(Date.now() / 1e3)) : b && (w = Array.isArray(b.data) ? b.data : [], E = Array.isArray(b.deleted) ? b.deleted : [], A = b.synced_at !== void 0 ? b.synced_at : b.since !== void 0 ? b.since : null);
        const L = w.map((T) => t.mapper.ingress(T));
        if (g.store && !g.store.initializationError)
          g.store.applySync(L, E, A || Math.floor(Date.now() / 1e3), {
            total: o.detail.total,
            filtered: o.detail.filtered,
            offset: o.detail.offset,
            queryGen: o.detail.queryGen,
            targetEl: r.targetEl,
            kind: r.kind
          });
        else if (r.targetEl && r.kind) {
          if (r.kind === "table" || r.kind === "list")
            S(r.targetEl, "ln-" + r.kind + ":set-loading", { loading: !1 }), S(r.targetEl, "ln-" + r.kind + ":set-data", {
              data: L,
              total: o.detail.total !== void 0 ? o.detail.total : L.length,
              filtered: o.detail.filtered !== void 0 ? o.detail.filtered : L.length,
              offset: o.detail.offset,
              queryGen: o.detail.queryGen
            }), t._boundDelivered.set(r.targetEl, !0);
          else if (r.kind === "options")
            S(r.targetEl, "ln-options:set-data", { data: L });
          else if (r.kind === "stat") {
            const T = o.detail.filtered !== void 0 ? o.detail.filtered : o.detail.total !== void 0 ? o.detail.total : L.length;
            S(r.targetEl, "ln-stat:set-count", { count: T });
          }
        }
      },
      connCreated: function(o) {
        const r = t.findChildren();
        if (!r.storeEl) return;
        const g = o.detail.meta || {}, b = t.mapper.ingress(o.detail.record);
        t._requestStoreMutation(r, "update", { id: g.tempId, data: b }).then(function() {
          t._toastFromMessage(o.detail.message), g.queued && r.queue && S(r.queueEl, "ln-api-queue:resolve-create", {
            entryId: g.entryId,
            oldKey: g.tempId,
            newId: b.id
          });
        }).catch(function(w) {
          t._reportReconciliationError("create-reconcile", w, g);
        });
      },
      connUpdated: function(o) {
        const r = t.findChildren();
        if (!r.storeEl) return;
        const g = o.detail.meta || {}, b = t.mapper.ingress(o.detail.record);
        t._requestStoreMutation(r, "update", { id: g.id, data: b }).then(function() {
          t._toastFromMessage(o.detail.message), g.queued && r.queue && S(r.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
        }).catch(function(w) {
          t._reportReconciliationError("update-reconcile", w, g);
        });
      },
      connDeleted: function(o) {
        const r = t.findChildren();
        if (!r.storeEl) return;
        const g = o.detail.meta || {};
        t._toastFromMessage(o.detail.message), g.queued && r.queue && S(r.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
      },
      connBulkDeleted: function(o) {
        const r = t.findChildren();
        if (!r.storeEl) return;
        const g = o.detail.meta || {};
        t._toastFromMessage(o.detail.message), g.queued && r.queue && S(r.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
      },
      connError: function(o) {
        const r = o.detail || {}, g = r.meta || {}, b = g.op || r.action, w = r.status || 0, E = t.findChildren();
        if (b === "sync") {
          E.storeEl && S(E.storeEl, "ln-data-store:request-sync-failed", {
            error: r.error,
            status: w
          }), console.error("[ln-data-coordinator] Sync failed:", r.error);
          return;
        }
        if (b === "query") {
          g.targetEl && g.kind && S(g.targetEl, "ln-" + g.kind + ":set-loading", { loading: !1 }), t._reportReconciliationError("query", r.error || r, g);
          return;
        }
        if (!E.storeEl) return;
        const A = w === 401 || w === 419, L = w === 0 || w >= 500, T = w === 409;
        if (A) {
          t._toastFromDict("auth"), g.queued && E.queue && S(E.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "auth" });
          return;
        }
        if (L) {
          g.queued && E.queue ? S(E.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "retry" }) : t._toastFromDict("network");
          return;
        }
        let k = Promise.resolve();
        if (T && b === "update") {
          const x = r.data && r.data.remote ? t.mapper.ingress(r.data.remote) : null;
          x && (k = t._requestStoreMutation(E, "update", { id: g.id, data: x })), t._toastFromDict("conflict");
        } else b === "create" && (k = t._requestStoreMutation(E, "delete", { id: g.tempId })), t._toastFromDict("rejected");
        g.queued && E.queue ? k.then(function() {
          S(E.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: "drop" });
        }).catch(function(x) {
          t._reportReconciliationError("deterministic-reconcile", x, g);
        }) : k.catch(function(x) {
          t._reportReconciliationError("deterministic-reconcile", x, g);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(o) {
        const r = t.findChildren(), g = r.store;
        if (!g || g.initializationError || !r.connector || t._noAutosync || g.isSyncing) return;
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
      refresh: function(o) {
        t._mutationReceipts.resolve(o.detail), t._refreshAll();
      },
      mutationError: function(o) {
        t._mutationReceipts.reject(o.detail);
      },
      refreshSynced: function(o) {
        o.detail && o.detail.changed && t._refreshAll(o.detail.meta);
      }
    }, t.dom.addEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.addEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.addEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.addEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.addEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.addEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.addEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.addEventListener("submit", t._handlers.formSubmit), n.forEach(function(o) {
      t.dom.addEventListener(o + ":fetched", t._handlers.connFetched), t.dom.addEventListener(o + ":created", t._handlers.connCreated), t.dom.addEventListener(o + ":updated", t._handlers.connUpdated), t.dom.addEventListener(o + ":deleted", t._handlers.connDeleted), t.dom.addEventListener(o + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.addEventListener(o + ":error", t._handlers.connError);
    }), document.addEventListener("ln-table:request-data", t._handlers.reqTableData), document.addEventListener("ln-list:request-data", t._handlers.reqListData), document.addEventListener("ln-options:request-data", t._handlers.reqOptions), document.addEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.addEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.addEventListener("ln-data-store:loaded", t._handlers.refresh), t.dom.addEventListener("ln-data-store:created", t._handlers.refresh), t.dom.addEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.addEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.addEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.addEventListener("ln-data-store:synced", t._handlers.refreshSynced);
  }
  e.prototype._ownsStore = function(t) {
    const o = this.findChildren();
    return !!(o.store && o.store._name === t && t || this._name === t && t);
  }, e.prototype._serveData = function(t, o) {
    const r = t.target, g = o === "table" ? "data-ln-table-store" : "data-ln-list-store", b = r.getAttribute(g) || r.getAttribute("data-ln-table-source") || r.getAttribute("data-ln-list-source");
    if (!b || !this._ownsStore(b)) return;
    const w = t.detail || {}, E = Ue(w);
    this._boundQueries.set(r, E);
    const A = this.findChildren(), L = this, T = w.offset != null, k = A.store;
    return (k && k.ready ? k.ready : Promise.resolve()).then(function() {
      const D = Ft(k, A.connector, T);
      if (D === "remote") {
        S(r, "ln-" + o + ":set-loading", { loading: !0 }), S(A.connectorEl, "ln-api-connector:request-query", {
          query: E,
          meta: { targetEl: r, kind: o }
        });
        return;
      }
      if (D !== "store") {
        S(r, "ln-" + o + ":set-loading", { loading: !1 });
        return;
      }
      return k.getAll(E).then(function(N) {
        const O = {
          data: N.data,
          total: N.total,
          filtered: N.filtered,
          offset: w.offset !== void 0 ? w.offset : N.offset,
          queryGen: w.queryGen !== void 0 ? w.queryGen : N.queryGen
        };
        S(r, "ln-" + o + ":set-data", O), L._boundDelivered.set(r, !0);
      });
    }).catch(function(D) {
      S(r, "ln-" + o + ":set-loading", { loading: !1 }), S(L.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: o,
        store: b,
        target: r,
        error: D
      });
    });
  }, e.prototype._serveOptions = function(t) {
    const o = t.target, r = o.getAttribute("data-ln-options");
    if (!this._ownsStore(r)) return;
    const g = this.findChildren(), b = g.store, w = b && b.ready ? b.ready : Promise.resolve(), E = this;
    return w.then(function() {
      const A = Ft(b, g.connector, !1);
      if (A === "remote") {
        S(g.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: o, kind: "options" }
        });
        return;
      }
      if (A === "store")
        return b.getAll({}).then(function(L) {
          S(o, "ln-options:set-data", { data: L.data });
        });
    }).catch(function(A) {
      E._reportReconciliationError("options-query", A, { targetEl: o, kind: "options" });
    });
  }, e.prototype._serveStat = function(t) {
    const o = t.target, r = o.getAttribute("data-ln-stat");
    if (!this._ownsStore(r)) return;
    const g = t.detail && t.detail.filters ? t.detail.filters : null, b = this.findChildren(), w = b.store, E = w && w.ready ? w.ready : Promise.resolve(), A = this;
    return E.then(function() {
      const L = Ft(w, b.connector, !1);
      if (L === "remote") {
        S(b.connectorEl, "ln-api-connector:request-query", {
          query: { filters: g },
          meta: { targetEl: o, kind: "stat" }
        });
        return;
      }
      if (L === "store")
        return w.count(g).then(function(T) {
          S(o, "ln-stat:set-count", { count: T });
        });
    }).catch(function(L) {
      A._reportReconciliationError("stat-query", L, { targetEl: o, kind: "stat" });
    });
  }, e.prototype._refreshAll = function(t) {
    const o = this, r = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let g = 0; g < r.length; g++) {
      const b = r[g];
      let w, E;
      if (b.hasAttribute("data-ln-table-store") ? (w = b.getAttribute("data-ln-table-store"), E = "table") : b.hasAttribute("data-ln-list-store") ? (w = b.getAttribute("data-ln-list-store"), E = "list") : b.hasAttribute("data-ln-options") ? (w = b.getAttribute("data-ln-options"), E = "options") : b.hasAttribute("data-ln-stat") && (w = b.getAttribute("data-ln-stat"), E = "stat"), !this._ownsStore(w)) continue;
      const A = this.findChildren().store;
      if (E === "table" || E === "list") {
        const L = o._boundQueries.get(b) || { sort: null, filters: {}, search: "" };
        (function(T, k) {
          A.getAll(L).then(function(x) {
            const D = {
              data: x.data,
              total: t && t.total !== void 0 ? t.total : x.total,
              filtered: t && t.filtered !== void 0 ? t.filtered : x.filtered,
              offset: t && t.offset !== void 0 ? t.offset : L.offset,
              queryGen: t && t.queryGen !== void 0 ? t.queryGen : L.queryGen
            };
            S(T, "ln-" + k + ":set-loading", { loading: !1 }), S(T, "ln-" + k + ":set-data", D), o._boundDelivered.set(T, !0);
          });
        })(b, E);
      } else if (E === "options")
        (function(L) {
          A.getAll({}).then(function(T) {
            S(L, "ln-options:set-data", { data: T.data });
          });
        })(b);
      else if (E === "stat") {
        const L = b.getAttribute("data-ln-stat-filter");
        let T = null;
        if (L) {
          const k = L.indexOf(":");
          if (k !== -1) {
            const x = L.slice(0, k), D = L.slice(k + 1);
            T = {}, T[x] = [D];
          }
        }
        (function(k, x) {
          A.count(x).then(function(D) {
            S(k, "ln-stat:set-count", { count: D });
          });
        })(b, T);
      }
    }
  }, e.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-data-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-data-coordinator:request-create", t._handlers.reqCreate), t.dom.removeEventListener("ln-data-coordinator:request-update", t._handlers.reqUpdate), t.dom.removeEventListener("ln-data-coordinator:request-delete", t._handlers.reqDelete), t.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", t._handlers.reqBulkDelete), t.dom.removeEventListener("ln-api-queue:send", t._handlers.queueSend), t.dom.removeEventListener("ln-api-queue:failed", t._handlers.queueFailed), t.dom.removeEventListener("ln-data-store:initialized", t._handlers.storeInitialized), document.removeEventListener("submit", t._handlers.formSubmit), n.forEach(function(o) {
      t.dom.removeEventListener(o + ":fetched", t._handlers.connFetched), t.dom.removeEventListener(o + ":created", t._handlers.connCreated), t.dom.removeEventListener(o + ":updated", t._handlers.connUpdated), t.dom.removeEventListener(o + ":deleted", t._handlers.connDeleted), t.dom.removeEventListener(o + ":bulk-deleted", t._handlers.connBulkDeleted), t.dom.removeEventListener(o + ":error", t._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", t._handlers.reqTableData), document.removeEventListener("ln-list:request-data", t._handlers.reqListData), document.removeEventListener("ln-options:request-data", t._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", t._handlers.reqStat), t.dom.removeEventListener("ln-data-store:ready", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:loaded", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:created", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:updated", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:deleted", t._handlers.refresh), t.dom.removeEventListener("ln-data-store:mutation-error", t._handlers.mutationError), t.dom.removeEventListener("ln-data-store:synced", t._handlers.refreshSynced), t._handlers = null), t._boundQueries = null, t._boundDelivered = null, t._mutationReceipts.close(new Error("Data coordinator destroyed")), t._mutationReceipts = null, _.delete(this), d(), delete this.dom[c], delete this.dom[v];
  };
  function i(t, o) {
    const r = t[c];
    r && o === "data-ln-data-mapper" && r.refreshMapper();
  }
  H(u, c, e, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: i
  });
})();
const Ke = "ln_api_queue", je = 2, V = "outbox", X = "_queue_meta";
function Z(u, c) {
  return u.error || new Error(c);
}
function gt(u, c) {
  return u.bound([c, -1 / 0], [c, 1 / 0]);
}
function ee(u) {
  return "seq:" + u;
}
function Tt(u) {
  return "paused:" + u;
}
function ne(u) {
  u.leaseOwner = null, u.leaseUntil = 0;
}
function Ve(u, c, v) {
  return typeof u != "string" || u.indexOf(c) === -1 ? u : u.split(c).join(v);
}
function We(u, c, v, y) {
  const _ = /* @__PURE__ */ new Map(), m = [], h = [];
  for (const l of u || [])
    _.has(l.chainKey) || _.set(l.chainKey, []), _.get(l.chainKey).push(l);
  return _.forEach((l, p) => {
    l.sort((d, f) => d.seq - f.seq);
    const s = l[0];
    if (!(!s || s.status === "failed")) {
      if (s.status === "inflight" && (s.leaseUntil || 0) > y) {
        h.push({ chainKey: p, at: s.leaseUntil });
        return;
      }
      if ((s.nextAttemptAt || 0) > y) {
        h.push({ chainKey: p, at: s.nextAttemptAt });
        return;
      }
      s.status = "inflight", s.leaseOwner = c, s.leaseUntil = y + v, s.updatedAt = y, m.push(s);
    }
  }), { entries: m, wakeups: h };
}
function Ge(u, c, v, y, _) {
  const m = [], h = [];
  for (const l of u || []) {
    if (l.entryId === c) {
      h.push(l.entryId);
      continue;
    }
    l.chainKey === v && (l.chainKey = y, l.targetId === v && (l.targetId = y), l.meta && l.meta.id === v && (l.meta.id = y), l.meta && typeof l.meta.action == "string" && (l.meta.action = Ve(l.meta.action, v, y)), l.updatedAt = _, m.push(l));
  }
  return { changed: m, deleted: h };
}
class Qe {
  constructor(c) {
    c = c || {}, this.indexedDB = c.indexedDB || globalThis.indexedDB, this.keyRange = c.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = c.dbName || Ke, this.now = c.now || (() => Date.now()), this.uuid = c.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((c, v) => {
      const y = this.indexedDB.open(this.dbName, je);
      y.onupgradeneeded = (_) => {
        const m = _.target.result;
        let h;
        m.objectStoreNames.contains(V) ? h = _.target.transaction.objectStore(V) : h = m.createObjectStore(V, { keyPath: "entryId" }), h.indexNames.contains("by_scope_chain") || h.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), h.indexNames.contains("by_scope_seq") || h.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(X) || m.createObjectStore(X, { keyPath: "key" });
      }, y.onerror = () => v(Z(y, "Queue database open failed")), y.onsuccess = (_) => {
        this._db = _.target.result, this._db.onversionchange = () => this.close(), c(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((c, v) => {
      const y = this.indexedDB.deleteDatabase(this.dbName);
      y.onsuccess = () => c(), y.onerror = () => v(Z(y, "Queue database delete failed")), y.onblocked = () => v(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(c) {
    return this.open().then((v) => v ? new Promise((y, _) => {
      const h = v.transaction(V, "readonly").objectStore(V).index("by_scope_seq").getAll(gt(this.keyRange, c));
      h.onsuccess = () => y(h.result || []), h.onerror = () => _(Z(h, "Queue scope read failed"));
    }) : []);
  }
  enqueue(c, v) {
    return v = v || {}, this.open().then((y) => y ? new Promise((_, m) => {
      const h = y.transaction([X, V], "readwrite"), l = h.objectStore(X), p = h.objectStore(V), s = ee(c);
      let d = null;
      const f = (e) => {
        const a = e + 1;
        d = {
          entryId: this.uuid(),
          scope: c,
          chainKey: v.chainKey,
          seq: a,
          op: v.op,
          targetId: v.targetId !== void 0 ? v.targetId : null,
          payload: v.payload,
          expectedVersion: v.expectedVersion !== void 0 ? v.expectedVersion : null,
          meta: v.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, l.put({ key: s, value: a }), p.put(d);
      }, n = l.get(s);
      n.onerror = () => m(Z(n, "Queue sequence read failed")), n.onsuccess = () => {
        const e = n.result;
        if (e && typeof e.value == "number") {
          f(e.value);
          return;
        }
        const a = p.index("by_scope_seq").getAll(gt(this.keyRange, c));
        a.onerror = () => m(Z(a, "Queue sequence migration failed")), a.onsuccess = () => {
          const i = (a.result || []).reduce((t, o) => Math.max(t, o.seq || 0), 0);
          f(i);
        };
      }, h.oncomplete = () => _(d), h.onerror = () => m(h.error || new Error("Queue enqueue transaction failed")), h.onabort = () => m(h.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(c, v, y) {
    return this.open().then((_) => _ ? new Promise((m, h) => {
      const l = _.transaction(V, "readwrite"), p = l.objectStore(V), s = p.index("by_scope_seq").getAll(gt(this.keyRange, c)), d = this.now();
      let f = { entries: [], wakeups: [] };
      s.onerror = () => h(Z(s, "Queue claim read failed")), s.onsuccess = () => {
        f = We(s.result || [], v, y, d);
        for (const n of f.entries) p.put(n);
      }, l.oncomplete = () => m(f), l.onerror = () => h(l.error || new Error("Queue claim transaction failed")), l.onabort = () => h(l.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(c, v) {
    return this._updateEntry(c, v, (y, _) => (_.delete(y.entryId), { status: "acked", entry: y }));
  }
  nack(c, v, y, _) {
    _ = _ || {};
    const m = _.maxAttempts || 8, h = _.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((l) => l ? new Promise((p, s) => {
      const d = l.transaction([V, X], "readwrite"), f = d.objectStore(V), n = d.objectStore(X), e = f.get(v);
      let a = null;
      e.onerror = () => s(Z(e, "Queue nack read failed")), e.onsuccess = () => {
        const i = e.result;
        if (!(!i || i.scope !== c)) {
          if (y === "drop") {
            f.delete(i.entryId), a = { status: "dropped", entry: i };
            return;
          }
          if (ne(i), i.updatedAt = this.now(), y === "auth") {
            i.status = "pending", f.put(i), n.put({ key: Tt(c), value: !0 }), a = { status: "auth", entry: i };
            return;
          }
          if (y === "retry") {
            if (i.attempts = (i.attempts || 0) + 1, i.attempts >= m) {
              i.status = "failed", i.nextAttemptAt = 0, f.put(i), a = { status: "failed", entry: i };
              return;
            }
            const t = h[Math.min(i.attempts - 1, h.length - 1)];
            i.status = "pending", i.nextAttemptAt = this.now() + t, f.put(i), a = { status: "retry", entry: i, delay: t };
          }
        }
      }, d.oncomplete = () => p(a), d.onerror = () => s(d.error || new Error("Queue nack transaction failed")), d.onabort = () => s(d.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(c, v, y) {
    return this._remapTransaction(c, null, v, y);
  }
  resolveCreate(c, v, y, _) {
    return this._remapTransaction(c, v, y, _);
  }
  _remapTransaction(c, v, y, _) {
    return this.open().then((m) => m ? new Promise((h, l) => {
      const p = m.transaction(V, "readwrite"), s = p.objectStore(V), d = s.index("by_scope_seq").getAll(gt(this.keyRange, c));
      let f = { changed: [], deleted: [] };
      d.onerror = () => l(Z(d, "Queue remap read failed")), d.onsuccess = () => {
        f = Ge(d.result || [], v, y, _, this.now());
        for (const n of f.deleted) s.delete(n);
        for (const n of f.changed) s.put(n);
      }, p.oncomplete = () => h(f.changed), p.onerror = () => l(p.error || new Error("Queue remap transaction failed")), p.onabort = () => l(p.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(c) {
    return this.open().then((v) => v ? new Promise((y, _) => {
      const m = v.transaction(V, "readwrite"), h = m.objectStore(V), l = h.index("by_scope_seq").getAll(gt(this.keyRange, c));
      let p = 0;
      l.onerror = () => _(Z(l, "Queue failed-entry read failed")), l.onsuccess = () => {
        for (const s of l.result || [])
          s.status === "failed" && (s.status = "pending", s.attempts = 0, s.nextAttemptAt = 0, s.updatedAt = this.now(), ne(s), h.put(s), p++);
      }, m.oncomplete = () => y(p), m.onerror = () => _(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => _(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(c) {
    return this.open().then((v) => v ? new Promise((y, _) => {
      const h = v.transaction(X, "readonly").objectStore(X).get(Tt(c));
      h.onsuccess = () => y(!!(h.result && h.result.value)), h.onerror = () => _(Z(h, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(c, v) {
    return this.open().then((y) => {
      if (y)
        return new Promise((_, m) => {
          const h = y.transaction(X, "readwrite");
          h.objectStore(X).put({ key: Tt(c), value: !!v }), h.oncomplete = () => _(), h.onerror = () => m(h.error || new Error("Queue pause-state write failed")), h.onabort = () => m(h.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(c) {
    return this.open().then((v) => {
      if (v)
        return new Promise((y, _) => {
          const m = v.transaction([V, X], "readwrite"), l = m.objectStore(V).index("by_scope_seq").openCursor(gt(this.keyRange, c));
          l.onsuccess = (p) => {
            const s = p.target.result;
            s && (s.delete(), s.continue());
          }, l.onerror = () => _(Z(l, "Queue clear failed")), m.objectStore(X).delete(ee(c)), m.objectStore(X).delete(Tt(c)), m.oncomplete = () => y(), m.onerror = () => _(m.error || new Error("Queue clear transaction failed")), m.onabort = () => _(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(c, v, y) {
    return this.open().then((_) => _ ? new Promise((m, h) => {
      const l = _.transaction(V, "readwrite"), p = l.objectStore(V), s = p.get(v);
      let d = null;
      s.onerror = () => h(Z(s, "Queue entry read failed")), s.onsuccess = () => {
        const f = s.result;
        !f || f.scope !== c || (d = y(f, p));
      }, l.oncomplete = () => m(d), l.onerror = () => h(l.error || new Error("Queue entry transaction failed")), l.onabort = () => h(l.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const u = "data-ln-api-queue", c = "lnApiQueue", v = [2e3, 5e3, 15e3, 6e4, 3e5], y = 8, _ = 6e4;
  if (window[c] !== void 0) return;
  function m() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (d) => {
        const f = Math.random() * 16 | 0;
        return (d === "x" ? f : f & 3 | 8).toString(16);
      });
    }
  }
  const h = new Qe({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: m
  });
  function l(s) {
    this.dom = s, s[c] = this;
    const d = s.closest("[data-ln-data-coordinator]");
    this.scope = s.getAttribute(u) || (d ? d.getAttribute("data-ln-data-coordinator") : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = m(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const f = this;
    return h.open().then((n) => n ? h.getPaused(f.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((n) => (f._paused = !!n, f._paused && S(f.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), f._emitPendingCount())).then(() => f._drain()).catch((n) => {
      console.error("[ln-api-queue] Initialization failed:", n), S(f.dom, "ln-api-queue:error", { operation: "initialize", error: n });
    }), this;
  }
  l.prototype._isOnline = function() {
    const s = this.dom.getAttribute("data-ln-api-queue-online");
    return s === "true" ? !0 : s === "false" ? !1 : navigator.onLine;
  }, l.prototype._emitPendingCount = function() {
    const s = this;
    return h.allForScope(s.scope).then((d) => (S(s.dom, "ln-api-queue:pending-count", { count: d.length, scope: s.scope }), d.length === 0 && S(s.dom, "ln-api-queue:drained", { scope: s.scope }), d));
  }, l.prototype._clearTimer = function(s) {
    const d = this._timers.get(s);
    d && (clearTimeout(d), this._timers.delete(s));
  }, l.prototype._scheduleTimer = function(s, d) {
    const f = Math.max(0, d), n = this._timers.get(s);
    n && clearTimeout(n);
    const e = this, a = setTimeout(() => {
      e._timers.delete(s), e._drain();
    }, f);
    this._timers.set(s, a);
  }, l.prototype._drain = function() {
    const s = this;
    return s._paused || !s._isOnline() ? Promise.resolve() : (s._drainPromise || (s._drainPromise = h.claimReady(s.scope, s._workerId, _).then((d) => {
      for (const f of d.wakeups)
        s._scheduleTimer(f.chainKey, f.at - Date.now());
      for (const f of d.entries)
        s._clearTimer(f.chainKey), S(s.dom, "ln-api-queue:send", {
          entryId: f.entryId,
          chainKey: f.chainKey,
          op: f.op,
          targetId: f.targetId,
          payload: f.payload,
          expectedVersion: f.expectedVersion,
          idempotencyKey: f.entryId,
          meta: f.meta
        });
    }).catch((d) => {
      console.error("[ln-api-queue] Drain failed:", d), S(s.dom, "ln-api-queue:error", { operation: "drain", error: d });
    }).finally(() => {
      s._drainPromise = null;
    })), s._drainPromise);
  }, l.prototype._onEnqueue = function(s) {
    const d = this;
    return h.enqueue(d.scope, s.detail || {}).then((f) => {
      if (f)
        return d._emitPendingCount().then((n) => (S(d.dom, "ln-api-queue:enqueued", {
          entryId: f.entryId,
          chainKey: f.chainKey,
          count: n.length
        }), d._drain()));
    }).catch((f) => {
      S(d.dom, "ln-api-queue:error", { operation: "enqueue", error: f });
    });
  }, l.prototype._onAck = function(s) {
    const d = this, f = s.detail || {};
    return h.ack(d.scope, f.entryId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((n) => {
      S(d.dom, "ln-api-queue:error", { operation: "ack", entryId: f.entryId, error: n });
    });
  }, l.prototype._onNack = function(s) {
    const d = this, f = s.detail || {};
    return h.nack(d.scope, f.entryId, f.reason, {
      maxAttempts: y,
      backoff: v
    }).then((n) => {
      if (n)
        return n.status === "failed" ? S(d.dom, "ln-api-queue:failed", {
          entryId: n.entry.entryId,
          chainKey: n.entry.chainKey,
          attempts: n.entry.attempts
        }) : n.status === "retry" ? d._scheduleTimer(n.entry.chainKey, n.delay) : n.status === "auth" && (d._paused = !0, S(d.dom, "ln-api-queue:paused", { reason: "auth" }), S(d.dom, "ln-api-queue:auth-required", {
          entryId: n.entry.entryId,
          chainKey: n.entry.chainKey
        })), d._emitPendingCount().then(() => {
          if (n.status === "dropped") return d._drain();
        });
    }).catch((n) => {
      S(d.dom, "ln-api-queue:error", { operation: "nack", entryId: f.entryId, error: n });
    });
  }, l.prototype._onRemap = function(s) {
    const d = this, f = s.detail || {};
    return h.remap(d.scope, f.oldKey, f.newId).catch((n) => {
      S(d.dom, "ln-api-queue:error", { operation: "remap", error: n });
    });
  }, l.prototype._onResolveCreate = function(s) {
    const d = this, f = s.detail || {};
    return h.resolveCreate(d.scope, f.entryId, f.oldKey, f.newId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((n) => {
      S(d.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: f.entryId,
        error: n
      });
    });
  }, l.prototype._onResume = function() {
    const s = this;
    return h.setPaused(s.scope, !1).then(() => (s._paused = !1, S(s.dom, "ln-api-queue:resumed", {}), s._drain())).catch((d) => {
      S(s.dom, "ln-api-queue:error", { operation: "resume", error: d });
    });
  }, l.prototype._onDrain = function() {
    const s = this;
    return h.resetFailed(s.scope).then(() => {
      const d = s._drainPromise;
      return d ? d.then(() => s._drain()) : s._drain();
    }).catch((d) => {
      S(s.dom, "ln-api-queue:error", { operation: "manual-drain", error: d });
    });
  }, l.prototype._onClear = function() {
    const s = this;
    return s._timers.forEach((d) => clearTimeout(d)), s._timers.clear(), h.clear(s.scope).then(() => {
      s._paused = !1, S(s.dom, "ln-api-queue:pending-count", { count: 0, scope: s.scope }), S(s.dom, "ln-api-queue:drained", { scope: s.scope });
    }).catch((d) => {
      S(s.dom, "ln-api-queue:error", { operation: "clear", error: d });
    });
  }, l.prototype._bindEvents = function() {
    const s = this;
    s._handlers = {
      enqueue: (d) => s._onEnqueue(d),
      ack: (d) => s._onAck(d),
      nack: (d) => s._onNack(d),
      remap: (d) => s._onRemap(d),
      resolveCreate: (d) => s._onResolveCreate(d),
      resume: () => s._onResume(),
      drain: () => s._onDrain(),
      clear: () => s._onClear()
    }, s.dom.addEventListener("ln-api-queue:request-enqueue", s._handlers.enqueue), s.dom.addEventListener("ln-api-queue:ack", s._handlers.ack), s.dom.addEventListener("ln-api-queue:nack", s._handlers.nack), s.dom.addEventListener("ln-api-queue:request-remap", s._handlers.remap), s.dom.addEventListener("ln-api-queue:resolve-create", s._handlers.resolveCreate), s.dom.addEventListener("ln-api-queue:request-resume", s._handlers.resume), s.dom.addEventListener("ln-api-queue:request-drain", s._handlers.drain), s.dom.addEventListener("ln-api-queue:request-clear", s._handlers.clear);
  }, l.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const s = this;
    s.dom.removeEventListener("ln-api-queue:request-enqueue", s._handlers.enqueue), s.dom.removeEventListener("ln-api-queue:ack", s._handlers.ack), s.dom.removeEventListener("ln-api-queue:nack", s._handlers.nack), s.dom.removeEventListener("ln-api-queue:request-remap", s._handlers.remap), s.dom.removeEventListener("ln-api-queue:resolve-create", s._handlers.resolveCreate), s.dom.removeEventListener("ln-api-queue:request-resume", s._handlers.resume), s.dom.removeEventListener("ln-api-queue:request-drain", s._handlers.drain), s.dom.removeEventListener("ln-api-queue:request-clear", s._handlers.clear), window.removeEventListener("online", s._onlineHandler), s._timers.forEach((d) => clearTimeout(d)), s._timers.clear(), S(s.dom, "ln-api-queue:destroyed", { scope: s.scope }), delete s.dom[c];
  };
  function p(s) {
    const d = s[c];
    d && d._drain();
  }
  H(u, c, l, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: p
  });
})();
(function() {
  const u = "data-ln-options", c = "lnOptions";
  if (window[c] !== void 0) return;
  function v(y) {
    this.dom = y, this._storeName = y.getAttribute(u), this._valueField = y.getAttribute("data-ln-options-value") || "id", this._labelField = y.getAttribute("data-ln-options-label") || "name";
    const _ = this;
    return this._onSetData = function(m) {
      _._rebuild(m.detail.data || []);
    }, y.addEventListener("ln-options:set-data", this._onSetData), S(y, "ln-options:request-data", { options: this._storeName }), this;
  }
  v.prototype._rebuild = function(y) {
    const _ = this.dom, m = this._valueField, h = this._labelField, l = _.value, p = _.querySelectorAll("option");
    for (let d = p.length - 1; d >= 0; d--)
      p[d].value !== "" && _.removeChild(p[d]);
    for (let d = 0; d < y.length; d++) {
      const f = y[d], n = document.createElement("option");
      n.value = String(f[m]), n.textContent = f[h] != null ? f[h] : "", _.appendChild(n);
    }
    const s = _.options;
    for (let d = 0; d < s.length; d++)
      if (s[d].value === l) {
        _.value = l;
        break;
      }
  }, v.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[c]);
  }, H(u, c, v, "ln-options");
})();
(function() {
  const u = "data-ln-stat", c = "lnStat";
  if (window[c] !== void 0) return;
  function v(_) {
    if (!_) return null;
    const m = _.indexOf(":");
    if (m === -1) return null;
    const h = _.slice(0, m), l = _.slice(m + 1), p = {};
    return p[h] = [l], p;
  }
  function y(_) {
    return this.dom = _, this._storeName = _.getAttribute(u), this._filters = v(_.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      _.textContent = String(m.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), S(_, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[c]);
  }, H(u, c, y, "ln-stat");
})();
(function() {
  const u = "ln-icons-sprite", c = "#ln-", v = "#lnc-", y = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let m = null;
  const h = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), l = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), p = "lni:", s = "lni:v", d = "1";
  function f() {
    try {
      if (localStorage.getItem(s) !== d) {
        for (let r = localStorage.length - 1; r >= 0; r--) {
          const g = localStorage.key(r);
          g && g.indexOf(p) === 0 && localStorage.removeItem(g);
        }
        localStorage.setItem(s, d);
      }
    } catch {
    }
  }
  f();
  function n() {
    return m || (m = document.getElementById(u), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = u, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function e(r) {
    return r.indexOf(v) === 0 ? l + "/" + r.slice(v.length) + ".svg" : h + "/" + r.slice(c.length) + ".svg";
  }
  function a(r, g) {
    const b = g.match(/viewBox="([^"]+)"/), w = b ? b[1] : "0 0 24 24", E = g.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = E ? E[1].trim() : "", L = g.match(/<svg([^>]*)>/i), T = L ? L[1] : "", k = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    k.id = r, k.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(x) {
      const D = T.match(new RegExp(x + '="([^"]*)"'));
      D && k.setAttribute(x, D[1]);
    }), k.innerHTML = A, n().querySelector("defs").appendChild(k);
  }
  function i(r) {
    if (y.has(r) || _.has(r) || r.indexOf(v) === 0 && !l) return;
    const g = r.slice(1);
    try {
      const b = localStorage.getItem(p + g);
      if (b) {
        a(g, b), y.add(r);
        return;
      }
    } catch {
    }
    _.add(r), fetch(e(r)).then(function(b) {
      if (!b.ok) throw new Error(b.status);
      return b.text();
    }).then(function(b) {
      a(g, b), y.add(r), _.delete(r);
      try {
        localStorage.setItem(p + g, b);
      } catch {
      }
    }).catch(function() {
      _.delete(r);
    });
  }
  function t(r) {
    const g = 'use[href^="' + c + '"], use[href^="' + v + '"]', b = r.querySelectorAll ? r.querySelectorAll(g) : [];
    if (r.matches && r.matches(g)) {
      const w = r.getAttribute("href");
      w && i(w);
    }
    Array.prototype.forEach.call(b, function(w) {
      const E = w.getAttribute("href");
      E && i(E);
    });
  }
  function o() {
    t(document), new MutationObserver(function(r) {
      r.forEach(function(g) {
        if (g.type === "childList")
          g.addedNodes.forEach(function(b) {
            b.nodeType === 1 && t(b);
          });
        else if (g.type === "attributes" && g.attributeName === "href") {
          const b = g.target.getAttribute("href");
          b && (b.indexOf(c) === 0 || b.indexOf(v) === 0) && i(b);
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
  const u = "data-ln-debug", c = "lnDebug";
  if (window[c] !== void 0) return;
  function v(y) {
    return this.dom = y, this;
  }
  v.prototype.destroy = function() {
    delete this.dom[c];
  }, H(u, c, v, "ln-debug");
})();
