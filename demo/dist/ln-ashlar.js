if (typeof window < "u") {
  const f = console.warn;
  console.warn = function(...l) {
    typeof l[0] == "string" && (l[0].startsWith("[ln-") || l[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || f.apply(console, l);
  };
}
const Pt = {};
function kt(f, l) {
  Pt[f] || (Pt[f] = document.querySelector('[data-ln-template="' + f + '"]'));
  const v = Pt[f];
  return v ? v.content.cloneNode(!0) : (console.warn("[" + (l || "ln-core") + '] Template "' + f + '" not found'), null);
}
function A(f, l, v) {
  f.dispatchEvent(new CustomEvent(l, {
    bubbles: !0,
    detail: v || {}
  }));
}
function G(f, l, v) {
  const b = new CustomEvent(l, {
    bubbles: !0,
    cancelable: !0,
    detail: v || {}
  });
  return f.dispatchEvent(b), b;
}
function oe(f, l, v) {
  f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter();
  const b = {
    sort: f.currentSort,
    filters: f.currentFilters,
    search: f.currentSearch
  };
  b[v] = f.name, A(f.dom, l, b);
}
function et(f, l) {
  if (!f || !l) return f;
  const v = f.querySelectorAll("[data-ln-field]");
  for (let h = 0; h < v.length; h++) {
    const c = v[h], p = c.getAttribute("data-ln-field");
    l[p] != null && (c.textContent = l[p]);
  }
  const b = f.querySelectorAll("[data-ln-attr]");
  for (let h = 0; h < b.length; h++) {
    const c = b[h], p = c.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < p.length; o++) {
      const d = p[o].trim().split(":");
      if (d.length !== 2) continue;
      const u = d[0].trim(), t = d[1].trim();
      l[t] != null && c.setAttribute(u, l[t]);
    }
  }
  const g = f.querySelectorAll("[data-ln-show]");
  for (let h = 0; h < g.length; h++) {
    const c = g[h], p = c.getAttribute("data-ln-show");
    p in l && c.classList.toggle("hidden", !l[p]);
  }
  const m = f.querySelectorAll("[data-ln-class]");
  for (let h = 0; h < m.length; h++) {
    const c = m[h], p = c.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < p.length; o++) {
      const d = p[o].trim().split(":");
      if (d.length !== 2) continue;
      const u = d[0].trim(), t = d[1].trim();
      t in l && c.classList.toggle(u, !!l[t]);
    }
  }
  return f;
}
function Le(f, l) {
  f.matches && f.matches("[data-ln-form], [data-ln-fillable]") && f.dispatchEvent(new CustomEvent("ln-fill", { detail: l ?? null, bubbles: !0 }));
  const v = f.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let b = 0; b < v.length; b++)
    v[b].dispatchEvent(new CustomEvent("ln-fill", { detail: l ?? null, bubbles: !0 }));
  return f;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(f) {
  if (!(!f.target.matches || !f.target.matches("[data-ln-fillable]")))
    if (f.detail)
      et(f.target, f.detail);
    else {
      const l = f.target.querySelectorAll("[data-ln-field]");
      for (let v = 0; v < l.length; v++)
        l[v].textContent = "";
    }
})));
function Ct(f, l) {
  if (!f || !l) return f;
  const v = document.createTreeWalker(f, NodeFilter.SHOW_TEXT);
  for (; v.nextNode(); ) {
    const m = v.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(h, c) {
        return l[c] !== void 0 ? l[c] : "";
      }
    ));
  }
  const b = function(m, h) {
    return l[h] !== void 0 ? l[h] : "";
  }, g = Array.from(f.querySelectorAll("*"));
  f.nodeType === 1 && g.push(f);
  for (let m = 0; m < g.length; m++) {
    const h = g[m], c = h.attributes;
    for (let p = 0; p < c.length; p++) {
      const o = c[p];
      o.value.indexOf("{{") !== -1 && h.setAttribute(o.name, o.value.replace(/\{\{\s*(\w+)\s*\}\}/g, b));
    }
  }
  return f;
}
function Te(f, l, v, b, g, m) {
  const h = {};
  for (let p = 0; p < f.children.length; p++) {
    const o = f.children[p], d = o.getAttribute("data-ln-key");
    d && (h[d] = o);
  }
  const c = document.createDocumentFragment();
  for (let p = 0; p < l.length; p++) {
    const o = l[p], d = String(b(o));
    let u = h[d];
    if (u)
      g(u, o, p);
    else {
      const t = kt(v, m);
      if (!t || (Ct(t, o), u = t.firstElementChild, !u)) continue;
      u.setAttribute("data-ln-key", d), g(u, o, p);
    }
    c.appendChild(u);
  }
  f.textContent = "", f.appendChild(c);
}
function at(f, l) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      at(f, l);
    }), console.warn("[" + l + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  f();
}
function ht(f, l, v) {
  if (f) {
    const b = f.querySelector('[data-ln-template="' + l + '"]');
    if (b) return b.content.cloneNode(!0);
  }
  return kt(l, v);
}
function Wt(f, l) {
  const v = {}, b = f.querySelectorAll("[" + l + "]");
  for (let g = 0; g < b.length; g++)
    v[b[g].getAttribute(l)] = b[g].textContent, b[g].remove();
  return v;
}
function Bt(f, l, v, b) {
  if (f.nodeType !== 1) return;
  const m = l.indexOf("[") !== -1 || l.indexOf(".") !== -1 || l.indexOf("#") !== -1 ? l : "[" + l + "]", h = Array.from(f.querySelectorAll(m));
  f.matches && f.matches(m) && h.push(f);
  for (const c of h)
    c[v] || (c[v] = new b(c));
}
function qt(f) {
  return !!(f.offsetWidth || f.offsetHeight || f.getClientRects().length);
}
function qe(f) {
  const l = f.querySelector('input[name="_method"]');
  return ((l && l.value !== "" ? l.value : f.method) || "").toUpperCase();
}
function se(f, l) {
  const v = !!(l && l.typed), b = l && l.exclude, g = {}, m = f.elements, h = {};
  if (v)
    for (let c = 0; c < m.length; c++) {
      const p = m[c];
      p.name && p.type === "checkbox" && !p.disabled && (h[p.name] = (h[p.name] || 0) + 1);
    }
  for (let c = 0; c < m.length; c++) {
    const p = m[c];
    if (!(!p.name || p.disabled || p.type === "file" || p.type === "submit" || p.type === "button") && !(b && p.matches && p.matches(b)))
      if (p.type === "checkbox")
        v && h[p.name] === 1 ? g[p.name] = p.checked : (g[p.name] || (g[p.name] = []), p.checked && g[p.name].push(p.value));
      else if (p.type === "radio")
        p.checked && (g[p.name] = p.value);
      else if (p.type === "select-multiple") {
        g[p.name] = [];
        for (let o = 0; o < p.options.length; o++)
          p.options[o].selected && g[p.name].push(p.options[o].value);
      } else if (v && p.type === "hidden")
        g[p.name] = p.value;
      else if (v && (p.type === "number" || p.type === "range")) {
        const o = Number(p.value);
        g[p.name] = p.value === "" || isNaN(o) ? null : o;
      } else
        g[p.name] = p.value;
  }
  return g;
}
function ke(f) {
  if (typeof f != "string") return !!f;
  const l = f.trim().toLowerCase();
  return l !== "false" && l !== "0" && l !== "" && l !== "off" && l !== "no";
}
function ae(f, l) {
  const v = f.elements, b = [], g = {};
  for (let m = 0; m < v.length; m++) {
    const h = v[m];
    h.name && h.type === "checkbox" && (g[h.name] = (g[h.name] || 0) + 1);
  }
  for (let m = 0; m < v.length; m++) {
    const h = v[m];
    if (h.type === "file" || h.type === "submit" || h.type === "button") continue;
    const c = h.getAttribute("data-ln-fill-as") || h.name;
    if (!c || !(c in l)) continue;
    const p = l[c];
    if (h.type === "checkbox") {
      if (Array.isArray(p))
        h.checked = p.indexOf(h.value) !== -1;
      else if (g[h.name] > 1) {
        const o = String(p).split(",").map(function(d) {
          return d.trim();
        });
        h.checked = o.indexOf(h.value) !== -1;
      } else
        h.checked = ke(p);
      b.push(h);
    } else if (h.type === "radio")
      h.checked = h.value === String(p), b.push(h);
    else if (h.type === "select-multiple") {
      if (Array.isArray(p))
        for (let o = 0; o < h.options.length; o++)
          h.options[o].selected = p.indexOf(h.options[o].value) !== -1;
      b.push(h);
    } else
      h.value = p, b.push(h);
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
function V(f) {
  const l = f ? f.closest("[lang]") : null, v = (l ? l.getAttribute("lang") || l.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!v) return "en-US";
  const b = v.trim().toLowerCase();
  return b.indexOf("-") === -1 && Jt[b] ? Jt[b] : v;
}
function xt(f) {
  return f.hasAttribute("data-ln-value") ? f.getAttribute("data-ln-value") : f.textContent.trim();
}
function Dt(f) {
  let l = !1;
  for (let v = 0; v < f.length; v++) {
    const b = f[v];
    if (!(b === "" || b == null) && (l = !0, !Number.isFinite(Number(b))))
      return "string";
  }
  return l ? "number" : "string";
}
function It(f, l, v, b) {
  if (v === "number") {
    const h = parseFloat(f), c = parseFloat(l);
    return (isNaN(h) ? 0 : h) - (isNaN(c) ? 0 : c);
  }
  const g = f != null ? String(f) : "", m = l != null ? String(l) : "";
  return b ? b.compare(g, m) : g < m ? -1 : g > m ? 1 : 0;
}
function le(f, l, { get: v, set: b }) {
  Object.defineProperty(f, "value", {
    get: function() {
      return v ? v.call(this) : l.get.call(this);
    },
    set: function(g) {
      b ? b.call(this, g, (m) => l.set.call(this, m)) : l.set.call(this, g);
    },
    configurable: !0
  });
}
function H(f, l, v, b, g = {}) {
  const m = g.extraAttributes || [], h = g.onAttributeChange || null, c = g.onInit || null;
  function p(o) {
    const d = o || document.body;
    Bt(d, f, l, v), c && c(d);
  }
  return at(function() {
    const o = new MutationObserver(function(u) {
      for (let t = 0; t < u.length; t++) {
        const n = u[t];
        if (n.type === "childList") {
          for (let i = 0; i < n.addedNodes.length; i++) {
            const s = n.addedNodes[i];
            s.nodeType === 1 && (Bt(s, f, l, v), c && c(s));
          }
          for (let i = 0; i < n.removedNodes.length; i++) {
            const s = n.removedNodes[i];
            if (s.nodeType === 1) {
              const a = f.indexOf("[") !== -1 || f.indexOf(".") !== -1 || f.indexOf("#") !== -1 ? f : "[" + f + "]", r = Array.from(s.querySelectorAll(a));
              s.matches && s.matches(a) && r.push(s);
              for (let _ = 0; _ < r.length; _++) {
                const y = r[_];
                if (!document.contains(y)) {
                  const E = y[l];
                  E && typeof E.destroy == "function" && E.destroy();
                }
              }
            }
          }
        } else n.type === "attributes" && (h && n.target[l] ? h(n.target, n.attributeName) : (Bt(n.target, f, l, v), c && c(n.target)));
      }
    });
    let d = [];
    if (f.indexOf("[") !== -1) {
      const u = /\[([\w-]+)/g;
      let t;
      for (; (t = u.exec(f)) !== null; )
        d.push(t[1]);
    } else
      d.push(f);
    o.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: d.concat(m)
    });
  }, b || (f.indexOf("[") === -1 ? f.replace("data-", "") : "component")), window[l] = p, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body), p;
}
function ce(f, l) {
  if (f.ctrlKey || f.metaKey || f.shiftKey || f.altKey || f.button !== 0 || !l) return !1;
  const v = l.getAttribute("href");
  return !(!v || l.getAttribute("target") === "_blank" || l.hasAttribute("download") || v.startsWith("mailto:") || v.startsWith("tel:") || v === "#" || v.startsWith("#") || l.hostname && l.hostname !== window.location.hostname);
}
function Y(...f) {
  return f.filter((l) => l != null && l !== "").map((l, v) => v === 0 ? l.replace(/\/+$/, "") : l.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function bt(f, l) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, f, l ? { Authorization: l } : null);
}
function de(f, l = "ln-core") {
  try {
    return f ? JSON.parse(f) : {};
  } catch (v) {
    return console.error(`[${l}] Invalid headers JSON:`, v), {};
  }
}
const ue = {};
function xe(f, l) {
  ue[f] = l;
}
function De(f) {
  return ue[f] || { ingress: (l) => l, egress: (l) => l };
}
const he = {};
function Gt(f, l) {
  if (!f || typeof l != "object") return;
  const v = f.toLowerCase().split("-")[0];
  he[v] = l;
}
function At(f) {
  if (!f) return null;
  const l = f.toLowerCase().split("-")[0];
  return he[l] || null;
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = xe, window.lnCore.getDataMapper = De, window.lnCore.registerLocaleFallback = Gt, window.lnCore.getLocaleFallback = At, window.lnCore.fillTemplate = Ct, window.lnCore.fill = et, window.lnCore.lnFill = Le, window.lnCore.renderList = Te);
function Qt(f, l) {
  let v = !1;
  return function() {
    v || (v = !0, queueMicrotask(function() {
      v = !1, f(), l && l();
    }));
  };
}
function fe(f) {
  f = f || {};
  let l = f.windowSize > 0 ? f.windowSize : 1e3, v = f.pageSize > 0 ? f.pageSize : 200, b = f.threshold != null ? f.threshold : 25, g = f.fetchDebounce != null ? f.fetchDebounce : 120;
  const m = typeof f.requestPage == "function" ? f.requestPage : function() {
  }, h = typeof f.onChange == "function" ? f.onChange : function() {
  }, c = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let d = 0, u = 0, t = 0, n = { sort: null, filters: {}, search: "" }, i = null, s = 0;
  function e(y) {
    p.set(y, ++s);
  }
  function a() {
    return !!(n && (n.search || n.filters && Object.keys(n.filters).length));
  }
  function r() {
    if (c.size <= l) return;
    const y = Array.from(c.keys()).sort(function(w, S) {
      return (p.get(w) || 0) - (p.get(S) || 0);
    });
    let E = 0;
    for (; c.size > l && E < y.length; )
      c.delete(y[E]), p.delete(y[E]), E++;
  }
  function _(y, E) {
    o.add(y), m(n, y, E);
  }
  return {
    get: function(y) {
      return c.get(y);
    },
    has: function(y) {
      return c.has(y);
    },
    peek: function() {
      return c.size ? c.values().next().value : void 0;
    },
    get logicalTotal() {
      return d;
    },
    get grandTotal() {
      return u;
    },
    get queryGen() {
      return t;
    },
    get size() {
      return c.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(y, E) {
      for (let x = y; x < E; x++)
        c.has(x) && e(x);
      if (d <= 0) return;
      const w = Math.max(0, y - b), S = Math.min(d, E + b), L = Math.floor(w / v), q = Math.floor(Math.max(0, S - 1) / v);
      let k = -1, R = v;
      for (let x = L; x <= q; x++) {
        const N = x * v, O = Math.min(v, d - N);
        let F = !1;
        for (let U = N; U < N + O; U++)
          if (!c.has(U)) {
            F = !0;
            break;
          }
        if (F && !o.has(N)) {
          k = N, R = O;
          break;
        }
      }
      k !== -1 && (clearTimeout(i), i = setTimeout(function() {
        _(k, R);
      }, g));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    ingest: function(y) {
      if (y = y || {}, y.queryGen != null && y.queryGen !== t) return;
      u = y.total != null ? y.total : u, d = y.filtered != null ? y.filtered : y.data ? y.data.length : d;
      const E = y.offset || 0, w = y.data || [];
      for (let S = 0; S < w.length; S++)
        c.set(E + S, w[S]), e(E + S);
      o.delete(E), r(), h();
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(y) {
      y && (n = y), _(0, v);
    },
    // Query change: new generation, drop everything, refetch page 0, then
    // notify for an immediate all-placeholder repaint at the stale height.
    invalidate: function(y) {
      t++, c.clear(), p.clear(), o.clear(), clearTimeout(i), y && (n = y), _(0, v), h();
    },
    destroy: function() {
      clearTimeout(i), c.clear(), p.clear(), o.clear();
    },
    configure: function(y) {
      y = y || {};
      let E = !1;
      if (y.windowSize != null && y.windowSize > 0 && y.windowSize !== l) {
        const w = y.windowSize < l;
        l = y.windowSize, w && r(), E = !0;
      }
      y.pageSize != null && y.pageSize > 0 && (v = y.pageSize), y.threshold != null && y.threshold >= 0 && (b = y.threshold), y.fetchDebounce != null && y.fetchDebounce >= 0 && (g = y.fetchDebounce), E && h();
    },
    setGrandTotal: function(y) {
      y == null || isNaN(y) || y < 0 || (u = y, a() || (d = y), h());
    }
  };
}
const Ie = "ln:";
let mt = null;
function pe() {
  if (mt !== null) return mt;
  try {
    if (typeof localStorage > "u")
      return mt = !1, !1;
    const f = "__ln_test__";
    localStorage.setItem(f, f), localStorage.removeItem(f), mt = !0;
  } catch {
    mt = !1;
  }
  return mt;
}
function Re() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function me(f, l) {
  const v = l.getAttribute("data-ln-persist"), b = v !== null && v !== "" ? v : l.id;
  return b ? Ie + f + ":" + Re() + ":" + b : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', l), null);
}
function Mt(f, l) {
  if (!pe()) return null;
  const v = me(f, l);
  if (!v) return null;
  try {
    const b = localStorage.getItem(v);
    return b !== null ? JSON.parse(b) : null;
  } catch {
    return null;
  }
}
function ft(f, l, v) {
  if (!pe()) return;
  const b = me(f, l);
  if (b)
    try {
      v == null ? localStorage.removeItem(b) : localStorage.setItem(b, JSON.stringify(v));
    } catch {
    }
}
function ge(f) {
  return (f || "").replace(/^#/, "");
}
function Nt(f) {
  const l = f === void 0 ? location.hash : f, v = {}, b = ge(l);
  if (!b) return v;
  const g = b.split("&");
  for (let m = 0; m < g.length; m++) {
    const h = g[m];
    if (!h) continue;
    const c = h.indexOf(":"), p = c > -1 ? h.slice(0, c) : h, o = c > -1 ? h.slice(c + 1) : "";
    if (p)
      try {
        v[p] = decodeURIComponent(o);
      } catch {
        v[p] = o;
      }
  }
  return v;
}
function ut(f) {
  if (!f) return null;
  const l = Nt();
  return f in l ? l[f] : null;
}
function nt(f, l) {
  if (!f) return;
  const v = Nt();
  l == null ? delete v[f] : v[f] = String(l);
  const g = Object.keys(v).map(function(m) {
    const h = v[m];
    return h === "" ? m : m + ":" + encodeURIComponent(h);
  }).join("&");
  ge(location.hash) !== g && (location.hash = g);
}
function $t(f) {
  return f.button === 1 || f.ctrlKey || f.metaKey || f.shiftKey ? !1 : (f.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Nt, window.lnCore.hashGet = ut, window.lnCore.hashSet = nt, window.lnCore.hashLinkClick = $t);
function Rt(f, l, v, b) {
  const g = typeof b == "number" ? b : 4, m = window.innerWidth, h = window.innerHeight, c = l.width, p = l.height, o = (v || "bottom").split("-"), d = o[0], u = o[1] === "start" || o[1] === "end" ? o[1] : "center", t = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, n = t[d] || t.bottom;
  function i(_) {
    return _ === "top" || _ === "bottom" ? u === "start" ? f.left : u === "end" ? f.right - c : f.left + (f.width - c) / 2 : u === "start" ? f.top : u === "end" ? f.bottom - p : f.top + (f.height - p) / 2;
  }
  function s(_) {
    let y, E, w = !0;
    return _ === "top" ? (y = f.top - g - p, E = i(_), y < 0 && (w = !1)) : _ === "bottom" ? (y = f.bottom + g, E = i(_), y + p > h && (w = !1)) : _ === "left" ? (y = i(_), E = f.left - g - c, E < 0 && (w = !1)) : (y = i(_), E = f.right + g, E + c > m && (w = !1)), { top: y, left: E, side: _, fits: w };
  }
  let e = null;
  for (let _ = 0; _ < n.length; _++) {
    const y = s(n[_]);
    if (y.fits) {
      e = y;
      break;
    }
  }
  e || (e = s(n[0]));
  let a = e.top, r = e.left;
  return c >= m ? r = 0 : (r < 0 && (r = 0), r + c > m && (r = m - c)), p >= h ? a = 0 : (a < 0 && (a = 0), a + p > h && (a = h - p)), { top: a, left: r, placement: e.side };
}
function Ut(f) {
  if (!f) return { width: 0, height: 0 };
  const l = f.style, v = l.visibility, b = l.display, g = l.position;
  l.visibility = "hidden", l.display = "block", l.position = "fixed";
  const m = f.offsetWidth, h = f.offsetHeight;
  return l.visibility = v, l.display = b, l.position = g, { width: m, height: h };
}
let dt = null;
async function Zt(f) {
  if (!f) {
    dt = null;
    return;
  }
  try {
    const l = new TextEncoder(), v = await crypto.subtle.digest("SHA-256", l.encode(f));
    dt = await crypto.subtle.importKey(
      "raw",
      v,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (l) {
    console.error("[ln-core/crypto] Key derivation failed:", l), dt = null;
  }
}
function gt() {
  return dt;
}
async function Oe(f, l = dt) {
  const v = l || dt;
  if (!v || f === void 0 || f === null) return f;
  try {
    const b = new TextEncoder(), g = crypto.getRandomValues(new Uint8Array(12)), m = typeof f == "string" ? f : JSON.stringify(f), h = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: g },
      v,
      b.encode(m)
    ), c = btoa(String.fromCharCode(...g)), p = btoa(String.fromCharCode(...new Uint8Array(h)));
    return {
      encrypted: !0,
      iv: c,
      data: p
    };
  } catch (b) {
    return console.error("[ln-core/crypto] Encryption failed:", b), f;
  }
}
async function Me(f, l = dt) {
  const v = l || dt;
  if (!f || !f.encrypted || !v) return f;
  try {
    const b = new TextDecoder(), g = Uint8Array.from(atob(f.iv), (p) => p.charCodeAt(0)), m = Uint8Array.from(atob(f.data), (p) => p.charCodeAt(0)), h = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: g },
      v,
      m
    ), c = b.decode(h);
    try {
      return JSON.parse(c);
    } catch {
      return c;
    }
  } catch (b) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", b), { ...f, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const f = window.fetch.bind(window), l = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  function b(o) {
    return typeof o == "string" ? o : o instanceof URL ? o.href : o instanceof Request ? o.url : String(o);
  }
  function g(o, d) {
    return d && d.method ? String(d.method).toUpperCase() : o instanceof Request ? o.method.toUpperCase() : "GET";
  }
  function m(o, d) {
    return d + " " + o;
  }
  function h(o) {
    return o === "GET" || o === "HEAD";
  }
  function c(o, d) {
    d = d || {};
    const u = b(o), t = g(o, d), n = m(u, t);
    h(t) && l.has(n) && (l.get(n).abort(), l.delete(n));
    const i = new AbortController(), s = d.signal;
    let e = null;
    s && (s.aborted ? i.abort(s.reason) : (e = function() {
      i.abort(s.reason);
    }, s.addEventListener("abort", e, { once: !0 })));
    const a = Object.assign({}, d, { signal: i.signal });
    return l.set(n, i), f(o, a).finally(function() {
      s && e && s.removeEventListener("abort", e), l.get(n) === i && l.delete(n);
    });
  }
  c.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = c;
  function p(o) {
    if (!o.detail || !o.detail.url) return;
    const d = o.target, u = (o.detail.method || (o.detail.body ? "POST" : "GET")).toUpperCase(), t = o.detail.key;
    t && v.has(t) && (v.get(t).abort(), v.delete(t));
    const n = new AbortController(), i = o.detail.signal;
    let s = null;
    i && (i.aborted ? n.abort(i.reason) : (s = function() {
      n.abort(i.reason);
    }, i.addEventListener("abort", s, { once: !0 }))), t && v.set(t, n);
    const e = { method: u, signal: n.signal };
    o.detail.body !== void 0 && (e.body = o.detail.body), window.fetch(o.detail.url, e).then(function(a) {
      i && s && i.removeEventListener("abort", s), t && v.get(t) === n && v.delete(t), A(d, "ln-http:response", {
        ok: a.ok,
        status: a.status,
        response: a
      });
    }).catch(function(a) {
      i && s && i.removeEventListener("abort", s), t && v.get(t) === n && v.delete(t), !(a && a.name === "AbortError") && A(d, "ln-http:error", {
        ok: !1,
        status: 0,
        error: a
      });
    });
  }
  document.addEventListener("ln-http:request", p), window.lnHttp = {
    cancel: function(o) {
      let d = !1;
      return l.forEach(function(u, t) {
        t.endsWith(" " + o) && (u.abort(), l.delete(t), d = !0);
      }), d;
    },
    cancelByKey: function(o) {
      return v.has(o) ? (v.get(o).abort(), v.delete(o), !0) : !1;
    },
    cancelAll: function() {
      l.forEach(function(o) {
        o.abort();
      }), l.clear(), v.forEach(function(o) {
        o.abort();
      }), v.clear();
    },
    get inflight() {
      const o = [];
      return l.forEach(function(d, u) {
        const t = u.indexOf(" ");
        o.push({ method: u.slice(0, t), url: u.slice(t + 1) });
      }), v.forEach(function(d, u) {
        o.push({ key: u });
      }), o;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", p), window.fetch = f, delete window.lnHttp;
    }
  };
})();
(function() {
  const f = "data-ln-form", l = "lnForm", v = "data-ln-form-action-edit", b = "data-ln-form-action-method";
  if (window[l] !== void 0) return;
  function g(m) {
    this.dom = m, this._baseAction = m.getAttribute("action") || "";
    const h = this;
    return this._onLnFill = function(c) {
      c.target === h.dom && (c.detail ? (h.fill(c.detail), h._applyActionMode(c.detail)) : h.dom.reset());
    }, this._onReset = function() {
      h._applyActionMode(null);
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  g.prototype.fill = function(m) {
    const h = ae(this.dom, m);
    for (let c = 0; c < h.length; c++) {
      const p = h[c], o = p.tagName === "SELECT" || p.type === "checkbox" || p.type === "radio";
      p.dispatchEvent(new Event(o ? "change" : "input", { bubbles: !0 }));
    }
  }, g.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, g.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute(v)) return;
    const h = m && m.id != null && m.id !== "" ? m.id : null, c = this._ensureMethodInput();
    if (h !== null) {
      const p = this.dom.getAttribute(v);
      p ? this.dom.setAttribute("action", p.replace(":id", encodeURIComponent(h))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(h)), c.value = this.dom.getAttribute(b) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), c.value = "";
  }, g.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), A(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[l]);
  }, H(f, l, g, "ln-form");
})();
(function() {
  const f = "data-ln-validate", l = "lnValidate", v = "data-ln-validate-errors", b = "data-ln-validate-error", g = "ln-validate-valid", m = "ln-validate-invalid", h = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[l] !== void 0) return;
  function c(p) {
    this.dom = p, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, d = p.tagName, u = p.type, t = d === "SELECT" || u === "checkbox" || u === "radio";
    this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(i) {
      const s = i.detail && i.detail.error;
      if (!s) return;
      o._customErrors.add(s), o._touched = !0;
      const e = p.closest(".form-element");
      if (e) {
        const a = e.querySelector("[" + b + '="' + s + '"]');
        a && a.classList.remove("hidden");
      }
      p.classList.remove(g), p.classList.add(m), p.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(i) {
      const s = i.detail && i.detail.error, e = p.closest(".form-element");
      if (s) {
        if (o._customErrors.delete(s), e) {
          const a = e.querySelector("[" + b + '="' + s + '"]');
          a && a.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(a) {
          if (e) {
            const r = e.querySelector("[" + b + '="' + a + '"]');
            r && r.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, t || p.addEventListener("input", this._onInput), p.addEventListener("change", this._onChange), p.addEventListener("ln-validate:set-custom", this._onSetCustom), p.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const n = p.form;
    return n && (n.hasAttribute("novalidate") || n.setAttribute("novalidate", ""), this._onFormReset = function() {
      o.reset();
    }, this._onValidateRequest = function(i) {
      o._touched = !0, !o.validate() && i.detail && i.detail.invalidFields && i.detail.invalidFields.push(o.dom);
    }, n.addEventListener("reset", this._onFormReset), n.addEventListener("ln-validate:request-validate", this._onValidateRequest), n._lnValidateGateBound || (n._lnValidateGateBound = !0, n.addEventListener("submit", function(i) {
      const s = { invalidFields: [] };
      A(n, "ln-validate:request-validate", s), s.invalidFields.length > 0 && (i.preventDefault(), s.invalidFields.sort((e, a) => e.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), s.invalidFields[0].focus());
    }))), this;
  }
  c.prototype.validate = function() {
    const p = this.dom, o = p.validity, u = p.checkValidity() && this._customErrors.size === 0, t = p.closest(".form-element");
    if (t) {
      const i = t.querySelector("[" + v + "]");
      if (i) {
        const s = i.querySelectorAll("[" + b + "]");
        for (let e = 0; e < s.length; e++) {
          const a = s[e].getAttribute(b), r = h[a];
          r && (o[r] ? s[e].classList.remove("hidden") : s[e].classList.add("hidden"));
        }
      }
    }
    return p.classList.toggle(g, u), p.classList.toggle(m, !u), p.setAttribute("aria-invalid", u ? "false" : "true"), A(p, u ? "ln-validate:valid" : "ln-validate:invalid", { target: p, field: p.name }), u;
  }, c.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(g, m), this.dom.removeAttribute("aria-invalid");
    const p = this.dom.closest(".form-element");
    if (p) {
      const o = p.querySelectorAll("[" + b + "]");
      for (let d = 0; d < o.length; d++)
        o[d].classList.add("hidden");
    }
  }, Object.defineProperty(c.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const p = this.dom.form;
    p && (this._onFormReset && p.removeEventListener("reset", this._onFormReset), this._onValidateRequest && p.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(g, m), this.dom.removeAttribute("aria-invalid"), A(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[l];
  }, H(f, l, c, "ln-validate");
})();
(function() {
  const f = "data-ln-ajax", l = "lnAjax", v = "data-ln-form-scope";
  if (window[l] !== void 0) return;
  function b(u) {
    if (!u.hasAttribute(f) || u[l]) return;
    u[l] = !0;
    const t = p(u);
    g(t.links), m(t.forms);
  }
  function g(u) {
    for (const t of u) {
      if (t[l + "Trigger"] || t.hostname && t.hostname !== window.location.hostname) continue;
      const n = t.getAttribute("href");
      if (n && n.includes("#")) continue;
      const i = function(s) {
        if (!ce(s, t)) return;
        s.preventDefault();
        const e = t.getAttribute("href");
        e && c("GET", e, null, t);
      };
      t.addEventListener("click", i), t[l + "Trigger"] = i;
    }
  }
  function m(u) {
    for (const t of u) {
      if (t[l + "Trigger"]) continue;
      if (t.hasAttribute(v)) {
        t[l + "ScopeWarned"] || (t[l + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const n = function(i) {
        if (i.defaultPrevented) return;
        i.preventDefault();
        const s = t.method.toUpperCase(), e = t.action, a = new FormData(t);
        for (const r of t.querySelectorAll('button, input[type="submit"]'))
          r.disabled = !0;
        c(s, e, a, t, function() {
          for (const r of t.querySelectorAll('button, input[type="submit"]'))
            r.disabled = !1;
        });
      };
      t.addEventListener("submit", n), t[l + "Trigger"] = n;
    }
  }
  function h(u) {
    if (!u[l]) return;
    const t = p(u);
    for (const n of t.links)
      n[l + "Trigger"] && (n.removeEventListener("click", n[l + "Trigger"]), delete n[l + "Trigger"]);
    for (const n of t.forms)
      n[l + "Trigger"] && (n.removeEventListener("submit", n[l + "Trigger"]), delete n[l + "Trigger"]);
    delete u[l];
  }
  function c(u, t, n, i, s) {
    if (G(i, "ln-ajax:before-start", { method: u, url: t }).defaultPrevented) return;
    A(i, "ln-ajax:start", { method: u, url: t }), i.classList.add("ln-ajax--loading");
    const a = document.createElement("span");
    a.className = "ln-ajax-spinner", i.appendChild(a);
    function r() {
      i.classList.remove("ln-ajax--loading");
      const S = i.querySelector(".ln-ajax-spinner");
      S && S.remove(), s && s();
    }
    let _ = t;
    const y = document.querySelector('meta[name="csrf-token"]'), E = y ? y.getAttribute("content") : null;
    n instanceof FormData && E && n.append("_token", E);
    const w = {
      method: u,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (w.headers["X-CSRF-TOKEN"] = E), u === "GET" && n) {
      const S = new URLSearchParams(n);
      _ = t + (t.includes("?") ? "&" : "?") + S.toString();
    } else u !== "GET" && n && (w.body = n);
    fetch(_, w).then(function(S) {
      const L = S.ok;
      return S.json().then(function(q) {
        return { ok: L, status: S.status, data: q };
      });
    }).then(function(S) {
      const L = S.data;
      if (S.ok) {
        if (L.title && (document.title = L.title), L.content)
          for (const q in L.content) {
            const k = document.getElementById(q);
            k && (k.innerHTML = L.content[q]);
          }
        if (i.tagName === "A") {
          const q = i.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
        A(i, "ln-ajax:success", { method: u, url: _, data: L });
      } else
        A(i, "ln-ajax:error", { method: u, url: _, status: S.status, data: L });
      if (L.message) {
        const q = L.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: q.type || (S.ok ? "success" : "error"),
            title: q.title || "",
            message: q.body || ""
          }
        }));
      }
      A(i, "ln-ajax:complete", { method: u, url: _ }), r();
    }).catch(function(S) {
      A(i, "ln-ajax:error", { method: u, url: _, error: S }), A(i, "ln-ajax:complete", { method: u, url: _ }), r();
    });
  }
  function p(u) {
    const t = { links: [], forms: [] };
    return u.tagName === "A" && u.getAttribute(f) !== "false" ? t.links.push(u) : u.tagName === "FORM" && u.getAttribute(f) !== "false" ? t.forms.push(u) : (t.links = Array.from(u.querySelectorAll('a:not([data-ln-ajax="false"])')), t.forms = Array.from(u.querySelectorAll('form:not([data-ln-ajax="false"])'))), t;
  }
  function o() {
    at(function() {
      new MutationObserver(function(t) {
        for (const n of t)
          if (n.type === "childList") {
            for (const i of n.addedNodes)
              if (i.nodeType === 1 && (b(i), !i.hasAttribute(f))) {
                for (const e of i.querySelectorAll("[" + f + "]"))
                  b(e);
                const s = i.closest && i.closest("[" + f + "]");
                if (s && s.getAttribute(f) !== "false") {
                  const e = p(i);
                  g(e.links), m(e.forms);
                }
              }
          } else n.type === "attributes" && b(n.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-ajax");
  }
  function d() {
    for (const u of document.querySelectorAll("[" + f + "]"))
      b(u);
  }
  window[l] = b, window[l].destroy = h, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
const _e = {
  navigate: function(f) {
    St(f, { historyAction: "push" });
  },
  replace: function(f) {
    St(f, { historyAction: "replace" });
  },
  current: function() {
    return jt ? {
      path: zt,
      params: ve,
      query: Ee,
      route: jt,
      regions: ye
    } : null;
  }
}, Yt = "data-ln-route", be = "lnRoute";
typeof window < "u" && (window.lnRouter = _e);
const st = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new WeakMap();
let ye = /* @__PURE__ */ new Map(), ee = !1, zt = null, ve = {}, Ee = {}, jt = null, Kt = !1;
function ne(f, l, v) {
  Kt ? queueMicrotask(function() {
    A(f, l, v);
  }) : A(f, l, v);
}
function Ot(f) {
  try {
    const m = new URL(f, window.location.origin);
    f = m.pathname + m.search + m.hash;
  } catch {
  }
  let [l] = f.split("#"), [v, b] = l.split("?");
  const g = {};
  if (b) {
    const m = new URLSearchParams(b);
    for (const [h, c] of m.entries())
      g[h] = c;
  }
  return v = v.replace(/\/+$/, ""), v === "" && (v = "/"), { path: v, query: g };
}
function we(f, l) {
  if (f.pattern === "*") return 1;
  if (l.pattern === "*") return -1;
  const v = f.segments, b = l.segments, g = Math.max(v.length, b.length);
  for (let m = 0; m < g; m++) {
    const h = v[m], c = b[m];
    if (h === void 0) return 1;
    if (c === void 0) return -1;
    if (h === "*") return 1;
    if (c === "*") return -1;
    const p = h.startsWith(":"), o = c.startsWith(":");
    if (p && !o) return 1;
    if (!p && o) return -1;
  }
  return 0;
}
function Ae(f, l) {
  const v = f.split("/").filter(Boolean);
  for (const b of l) {
    if (b.pattern === "*")
      return {
        route: b,
        params: { wildcard: f }
      };
    const g = b.segments, m = {};
    let h = !0;
    if (!(v.length > g.length && g[g.length - 1] !== "*")) {
      for (let c = 0; c < g.length; c++) {
        const p = g[c], o = v[c];
        if (p === "*") {
          m.wildcard = v.slice(c).join("/");
          break;
        }
        if (o === void 0) {
          h = !1;
          break;
        }
        if (p.startsWith(":"))
          m[p.slice(1)] = decodeURIComponent(o);
        else if (p !== o) {
          h = !1;
          break;
        }
      }
      if (h && (g.indexOf("*") !== -1 || v.length <= g.length))
        return { route: b, params: m };
    }
  }
  return null;
}
function Vt(f, l) {
  if (f !== "__primary__") {
    const b = document.getElementById(l.target);
    return b || console.warn(`[ln-router] Explicit target element #${l.target} not found in DOM`), b;
  }
  const v = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return v || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), v;
}
function Ne(f) {
  if (!f) return;
  const l = Array.from(f.querySelectorAll("*")), v = [f].concat(l);
  for (const g of v)
    for (const m of Object.keys(g))
      if (m.startsWith("ln") && g[m] && typeof g[m].destroy == "function")
        try {
          g[m].destroy();
        } catch (h) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, g, h);
        }
  const b = document.querySelectorAll('[data-ln-popover="open"]');
  for (const g of b) {
    const m = g.lnPopover;
    if (m && m.trigger && f.contains(m.trigger))
      try {
        m.destroy();
      } catch (h) {
        console.error("[ln-router] Error destroying open popover:", h);
      }
  }
}
function St(f, l = {}) {
  const { path: v, query: b } = Ot(f), g = /* @__PURE__ */ new Map();
  for (const [d, u] of st)
    g.set(d, Ae(v, u.sorted));
  const m = st.has("__primary__"), h = g.get("__primary__");
  if (m && !h) {
    ne(document.body, "ln-router:not-found", { path: v });
    return;
  }
  let c = null;
  if (h && (c = Vt("__primary__", h.route), !c || G(c, "ln-router:before-navigate", {
    from: zt,
    to: f,
    params: h.params,
    query: b
  }).defaultPrevented))
    return;
  const p = [];
  for (const [d, u] of g) {
    if (!u) continue;
    const t = Vt(d, u.route);
    t && (d !== "__primary__" && t.hasAttribute("data-ln-route-keep") && te.get(t) === u.route.templateNode || p.push({ regionKey: d, match: u, targetEl: t }));
  }
  l.historyAction === "push" ? window.history.pushState(null, "", f) : l.historyAction === "replace" && window.history.replaceState(null, "", f);
  const o = function() {
    for (const { regionKey: d, match: u, targetEl: t } of p) {
      if (!(l.isHydration && t.hasAttribute("data-ln-router-hydrate") && t.children.length > 0)) {
        Ne(t);
        const i = u.route.templateNode.content.cloneNode(!0);
        t.replaceChildren(i);
      }
      if (te.set(t, u.route.templateNode), d === "__primary__" && (u.route.title && (document.title = u.route.title), !l.isHydration)) {
        t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1");
        const i = t.querySelector("h1, h2, h3, h4, h5, h6");
        i ? (i.setAttribute("tabindex", "-1"), i.focus()) : t.focus(), t.scrollIntoView({ block: "start", behavior: "instant" });
      }
      ne(t, "ln-router:navigated", {
        path: f,
        params: u.params,
        query: b,
        route: u.route,
        target: t,
        region: d
      });
    }
    h && (zt = f, ve = h.params, Ee = b, jt = h.route), ye = new Map(
      Array.from(g.entries()).map(([d, u]) => [d, u ? { route: u.route, params: u.params } : null])
    );
  };
  document.startViewTransition && !l.isHydration ? document.startViewTransition(o) : o();
}
function Fe(f) {
  const l = f.target.closest("a");
  if (!l || !ce(f, l)) return;
  const v = l.getAttribute("href"), { path: b } = Ot(v), g = st.get("__primary__");
  if (!g) return;
  Ae(b, g.sorted) && (f.preventDefault(), St(v, { historyAction: "push" }));
}
function Pe(f, l) {
  const v = Object.keys(f), b = Object.keys(l);
  if (v.length !== b.length) return !1;
  for (let g = 0; g < v.length; g++) {
    const m = v[g];
    if (f[m] !== l[m]) return !1;
  }
  return !0;
}
function Be() {
  const f = window.location.pathname + window.location.search, l = _e.current();
  if (l && l.path != null) {
    const v = Ot(f);
    if (Ot(l.path).path === v.path && Pe(l.query, v.query))
      return;
  }
  St(f, { historyAction: "skip" });
}
function He() {
  ee || (ee = !0, at(function() {
    document.addEventListener("click", Fe), window.addEventListener("popstate", Be), Kt = !0;
    const f = window.location.pathname + window.location.search + window.location.hash;
    St(f, { historyAction: "replace", isHydration: !0 }), Kt = !1;
  }, "ln-router"));
}
function Ue(f) {
  const l = f.getAttribute(Yt);
  if (!l) return;
  const v = f.getAttribute("data-ln-route-target") || null;
  if (v === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${l}" rejected.`);
    return;
  }
  const b = v || "__primary__";
  st.has(b) || st.set(b, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const g = st.get(b);
  if (g.routes.has(l)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${l}" in region "${b}"`);
    return;
  }
  const m = f.getAttribute("data-ln-route-title"), h = l.split("/").filter(Boolean), c = {
    pattern: l,
    segments: h,
    target: v,
    title: m,
    templateNode: f
  }, p = Vt(b, c);
  p && p.contains(f) && console.warn(`[ln-router] Route template with pattern "${l}" is declared inside its own outlet element:`, f), g.routes.set(l, c), g.sorted = Array.from(g.routes.values()).sort(we);
}
function ze(f) {
  const l = f.getAttribute(Yt);
  if (!l) return;
  const b = f.getAttribute("data-ln-route-target") || null || "__primary__", g = st.get(b);
  g && (g.routes.delete(l), g.sorted = Array.from(g.routes.values()).sort(we), g.routes.size === 0 && st.delete(b));
}
function Se(f) {
  return this.dom = f, Ue(f), this;
}
Se.prototype.destroy = function() {
  ze(this.dom), delete this.dom[be];
};
H(Yt, be, Se, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    st.size > 0 && He();
  }
});
(function() {
  const f = "data-ln-modal", l = "lnModal";
  if (window[l] !== void 0) return;
  function v(g) {
    this.dom = g, this.isOpen = g.getAttribute(f) === "open";
    const m = this;
    return this._onRequestOpen = function() {
      m.dom.setAttribute(f, "open");
    }, this._onRequestClose = function() {
      m.dom.setAttribute(f, "close");
    }, this._onCancel = function(h) {
      h.preventDefault(), m.dom.setAttribute(f, "close");
    }, this._onClickClose = function(h) {
      const c = h.target.closest("[data-ln-modal-close]");
      c && m.dom.contains(c) && (h.preventDefault(), m.dom.setAttribute(f, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  v.prototype.destroy = function() {
    if (this.dom[l]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const g = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + f + '="open"]'),
          function(h) {
            return h !== g;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      A(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[l];
    }
  };
  function b(g) {
    const m = g[l];
    if (!m) return;
    const c = g.getAttribute(f) === "open";
    if (c !== m.isOpen)
      if (c) {
        if (G(g, "ln-modal:before-open", { modalId: g.id, target: g }).defaultPrevented) {
          g.setAttribute(f, "close");
          return;
        }
        m.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof g.showModal == "function" && g.showModal();
        const o = g.querySelector("[autofocus]");
        if (o && qt(o))
          o.focus();
        else {
          const d = g.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(d, qt);
          if (u) u.focus();
          else {
            const t = g.querySelectorAll("a[href], button:not([disabled])"), n = Array.prototype.find.call(t, qt);
            n && n.focus();
          }
        }
        A(g, "ln-modal:open", { modalId: g.id, target: g });
      } else {
        if (G(g, "ln-modal:before-close", { modalId: g.id, target: g }).defaultPrevented) {
          g.setAttribute(f, "open");
          return;
        }
        m.isOpen = !1, A(g, "ln-modal:close", { modalId: g.id, target: g }), typeof g.close == "function" && g.close(), document.querySelector("[" + f + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  H(f, l, v, "ln-modal", {
    onAttributeChange: b
  });
})();
(function() {
  const f = "data-ln-modal-coordinator", l = "lnModalCoordinator";
  if (window[l] !== void 0) return;
  function v(u, t) {
    if (t) {
      if (u) {
        const i = u.closest("[" + f + "]");
        if (i) {
          if (i.id === t && i.hasAttribute("data-ln-modal")) return i;
          const s = i.querySelector("#" + CSS.escape(t) + '[data-ln-modal], [data-ln-modal="' + t + '"]');
          if (s) return s;
        }
      }
      const n = document.getElementById(t) || document.querySelector('[data-ln-modal="' + t + '"]');
      if (n) return n;
    }
    if (u) {
      const n = u.closest("[" + f + "]");
      if (n) {
        if (n.hasAttribute("data-ln-modal")) return n;
        const s = n.querySelector("[data-ln-modal]");
        if (s) return s;
      }
      const i = u.closest("[data-ln-modal]");
      if (i) return i;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function b(u, t) {
    if (u !== "edit") return "";
    if (t) {
      const n = t.getAttribute("data-ln-fill-id");
      if (n) return n;
    }
    return "edit";
  }
  function g(u) {
    if (!u) return;
    const t = u.querySelectorAll("[data-ln-field]");
    for (let i = 0; i < t.length; i++)
      t[i].textContent = "";
    const n = u.querySelectorAll("form");
    for (let i = 0; i < n.length; i++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(n[i], null) : n[i].reset();
  }
  document.addEventListener("submit", function(u) {
    if (u.defaultPrevented) return;
    const n = u.target.closest("[data-ln-modal]");
    if (n && n.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + n.id, "true");
      } catch {
      }
      nt(n.id, null);
    }
  }), document.addEventListener("click", function(u) {
    if (u.ctrlKey || u.metaKey || u.button === 1) return;
    const t = u.target.closest("[data-ln-modal-for]");
    if (t) {
      const i = t.getAttribute("data-ln-modal-for"), s = v(t, i);
      if (s && s.lnModal) {
        u.preventDefault();
        const e = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, a = {}, r = t.dataset;
        for (const E in r) {
          if (!E.startsWith("lnModal") || e[E]) continue;
          const w = E.slice(7);
          w && (a[w.charAt(0).toLowerCase() + w.slice(1)] = r[E]);
        }
        const _ = Object.keys(a).length > 0;
        t.hasAttribute("data-ln-modal-mode") ? s.dataset.lnModalMode = t.getAttribute("data-ln-modal-mode") : s.dataset.lnModalMode = _ ? "edit" : "new", _ && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(s, a) : s.dataset.lnModalMode === "new" && g(s), s.getAttribute("data-ln-modal") === "open" ? A(s, "ln-modal:request-close", {}) : (s.id && nt(s.id, b(s.dataset.lnModalMode, t)), A(s, "ln-modal:request-open", {}));
      }
      return;
    }
    const n = u.target.closest('a[href^="#"]');
    if (n) {
      const i = Nt(n.getAttribute("href"));
      for (const s in i) {
        const e = document.getElementById(s);
        if (e && e.lnModal) {
          if (!$t(u)) return;
          nt(s, i[s]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(u) {
    const t = u.target;
    if (!t || !t.lnModal) return;
    (t.dataset.lnModalMode || "new") === "new" && g(t);
  }), document.addEventListener("ln-modal:open", function(u) {
    const t = u.target;
    if (!t || !t.lnModal || !t.id) return;
    let n = ut(t.id);
    n === null && (n = b(t.dataset.lnModalMode, null), nt(t.id, n)), n ? (t.dataset.lnModalMode = "edit", t.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: n }
    }))) : (t.dataset.lnModalMode = "new", g(t));
  });
  let m = !1;
  function h() {
    if (!m) {
      m = !0;
      try {
        const u = document.querySelectorAll("[data-ln-modal][id]");
        for (let t = 0; t < u.length; t++) {
          const n = u[t];
          if (!n.lnModal) continue;
          const i = n.id, s = "ln-modal-pending:" + i;
          let e = !1;
          try {
            e = sessionStorage.getItem(s) === "true";
          } catch {
          }
          if (e) {
            try {
              sessionStorage.removeItem(s);
            } catch {
            }
            if (!!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || n.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger"))) {
              n.dataset.lnModalMode = "edit", A(n, "ln-modal:request-open", {});
              continue;
            } else {
              nt(i, null), A(n, "ln-modal:request-close", {}), g(n);
              continue;
            }
          }
          const a = ut(i), r = a !== null, _ = n.lnModal.isOpen;
          if (r) {
            const y = a ? "edit" : "new";
            n.dataset.lnModalMode = y, _ ? a ? n.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: a }
            })) : g(n) : A(n, "ln-modal:request-open", {});
          } else _ && A(n, "ln-modal:request-close", {});
        }
      } finally {
        m = !1;
      }
    }
  }
  function c() {
    const u = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let t = 0; t < u.length; t++) {
      const n = u[t];
      n.lnModal && ut(n.id) === null && nt(n.id, b(n.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", h);
  function p() {
    c(), h();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    setTimeout(p, 0);
  }) : setTimeout(p, 0);
  function o(u) {
    const t = u.target.closest("[data-ln-modal]");
    if (!(!t || !t.lnModal)) {
      if (t.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + t.id);
        } catch {
        }
        nt(t.id, null);
      }
      A(t, "ln-modal:request-close", {}), g(t);
    }
  }
  document.addEventListener("ln-form:success", o), document.addEventListener("ln-ajax:success", o), document.addEventListener("ln-modal:close", function(u) {
    const t = u.target;
    if (!(!t || !t.lnModal)) {
      if (t.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + t.id);
        } catch {
        }
        ut(t.id) !== null && nt(t.id, null);
      }
      t.dataset.lnModalMode === "new" && g(t);
    }
  });
  function d(u) {
    return this.dom = u, this;
  }
  d.prototype.destroy = function() {
    this.dom[l] && delete this.dom[l];
  }, H(f, l, d, "ln-modal-coordinator");
})();
(function() {
  const f = "data-ln-number", l = "lnNumber";
  if (window[l] !== void 0) return;
  const v = {}, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(o) {
    if (!v[o]) {
      const d = new Intl.NumberFormat(o, { useGrouping: !0 }), u = d.formatToParts(1234.5);
      let t = "", n = ".";
      for (let i = 0; i < u.length; i++)
        u[i].type === "group" && (t = u[i].value), u[i].type === "decimal" && (n = u[i].value);
      v[o] = { fmt: d, groupSep: t, decimalSep: n };
    }
    return v[o];
  }
  function m(o, d, u) {
    if (u !== null) {
      const t = parseInt(u, 10), n = o + "|d" + t;
      return v[n] || (v[n] = new Intl.NumberFormat(o, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: t })), v[n].format(d);
    }
    return g(o).fmt.format(d);
  }
  function h(o) {
    if (o[l]) return o[l];
    if (o[l] = this, this.dom = o, o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const d = document.createElement("input");
    d.type = "hidden", d.name = o.name, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && d.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.type = "text", o.setAttribute("inputmode", "decimal"), o.insertAdjacentElement("afterend", d), this._hidden = d;
    const u = this;
    Object.defineProperty(d, "value", {
      get: function() {
        return b.get.call(d);
      },
      set: function(n) {
        b.set.call(d, n), n !== "" && !isNaN(parseFloat(n)) ? u._setDisplayRaw(m(V(u.dom), parseFloat(n), u.dom.getAttribute("data-ln-number-decimals"))) : u._setDisplayRaw(""), u.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), le(o, b, {
      get: function() {
        return b.get.call(o);
      },
      set: function(n) {
        if (n === "") {
          u._setDisplayRaw(""), u._setHiddenRaw(""), o.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const i = typeof n == "number" ? n : parseFloat(String(n).replace(/[^\d.-]/g, ""));
        isNaN(i) ? (u._setDisplayRaw(String(n)), u._setHiddenRaw("")) : (u._setHiddenRaw(i), u._setDisplayRaw(m(V(o), i, o.getAttribute("data-ln-number-decimals")))), o.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      u._handleInput();
    }, o.addEventListener("input", this._onInput), this._onPaste = function(n) {
      n.preventDefault();
      const i = (n.clipboardData || window.clipboardData).getData("text"), s = g(V(o)), e = s.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let a = i.replace(new RegExp("[^0-9\\-" + e + ".]", "g"), "");
      s.groupSep && (a = a.split(s.groupSep).join("")), s.decimalSep !== "." && (a = a.replace(s.decimalSep, "."));
      const r = parseFloat(a);
      u.value = isNaN(r) ? NaN : r;
    }, o.addEventListener("paste", this._onPaste);
    const t = o.value;
    if (t !== "") {
      const n = parseFloat(t);
      isNaN(n) || (this._setHiddenRaw(n), this._setDisplayRaw(m(V(o), n, o.getAttribute("data-ln-number-decimals"))), o.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function c(o) {
    if (typeof o == "number") return isNaN(o) ? null : o;
    if (!o || typeof o != "string") return null;
    let d = o.trim();
    if (d === "") return null;
    d = d.replace(/[\s\u00A0$€£]/g, ""), d.indexOf(",") !== -1 && d.indexOf(".") !== -1 ? d.indexOf(".") < d.indexOf(",") ? d = d.replace(/\./g, "").replace(",", ".") : d = d.replace(/,/g, "") : d.indexOf(",") !== -1 && (d = d.replace(",", ".")), d = d.replace(/[^\d.-]/g, "");
    const u = parseFloat(d);
    return isNaN(u) ? null : u;
  }
  h.prototype._initTextElement = function() {
    const o = this.dom;
    let d = o.getAttribute("data-ln-value"), u = o.getAttribute("data-ln-number"), t = null;
    d !== null && d !== "" ? t = d : u !== null && u !== "" && u !== "true" ? t = u : t = o.textContent.trim();
    const n = c(t);
    n !== null ? (this._rawValue = n, o.hasAttribute("data-ln-value") || o.setAttribute("data-ln-value", String(n)), this._formatTextContent()) : this._rawValue = null;
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = m(V(this.dom), this._rawValue, o);
    }
  }, h.prototype._handleInput = function() {
    const o = this.dom, d = g(V(o)), u = b.get.call(o);
    if (u === "") {
      this._setHiddenRaw(""), A(o, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (u === "-") {
      this._setHiddenRaw("");
      return;
    }
    const t = o.selectionStart;
    let n = 0;
    for (let S = 0; S < t; S++)
      /[0-9]/.test(u[S]) && n++;
    let i = u;
    if (d.groupSep && (i = i.split(d.groupSep).join("")), i = i.replace(d.decimalSep, "."), u.endsWith(d.decimalSep) || u.endsWith(".")) {
      const S = i.replace(/\.$/, ""), L = parseFloat(S);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const s = i.indexOf(".");
    if (s !== -1 && i.slice(s + 1).endsWith("0")) {
      const L = parseFloat(i);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const e = o.getAttribute("data-ln-number-decimals");
    if (e !== null && s !== -1) {
      const S = parseInt(e, 10);
      i.slice(s + 1).length > S && (i = i.slice(0, s + 1 + S));
    }
    const a = parseFloat(i);
    if (isNaN(a)) return;
    const r = o.getAttribute("data-ln-number-min"), _ = o.getAttribute("data-ln-number-max");
    if (r !== null && a < parseFloat(r) || _ !== null && a > parseFloat(_)) return;
    let y;
    if (e !== null)
      y = m(V(o), a, e);
    else {
      const S = s !== -1 ? i.slice(s + 1).length : 0;
      if (S > 0) {
        const L = V(o) + "|u" + S;
        v[L] || (v[L] = new Intl.NumberFormat(V(o), { useGrouping: !0, minimumFractionDigits: S, maximumFractionDigits: S })), y = v[L].format(a);
      } else
        y = d.fmt.format(a);
    }
    this._setDisplayRaw(y);
    let E = n, w = 0;
    for (let S = 0; S < y.length && E > 0; S++)
      w = S + 1, /[0-9]/.test(y[S]) && E--;
    E > 0 && (w = y.length), o.setSelectionRange(w, w), this._setHiddenRaw(a), A(o, "ln-number:input", { value: a, formatted: y });
  }, h.prototype._setHiddenRaw = function(o) {
    this._hidden && b.set.call(this._hidden, String(o));
  }, h.prototype._setDisplayRaw = function(o) {
    this.isTextElement ? this.dom.textContent = String(o) : b.set.call(this.dom, String(o));
  }, h.prototype._displayFormatted = function(o) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(m(V(this.dom), o, this.dom.getAttribute("data-ln-number-decimals")));
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
      this._setHiddenRaw(o), this._setDisplayRaw(m(V(this.dom), o, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : b.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[l] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), A(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function p() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + f + "]");
      for (let d = 0; d < o.length; d++) {
        const u = o[d][l];
        u && (u.isTextElement ? u._formatTextContent() : isNaN(u.value) || u._displayFormatted(u.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(f, l, h, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(o) {
      const d = o[l];
      d && (d.isTextElement ? d._initTextElement() : isNaN(d.value) || d._displayFormatted(d.value));
    }
  }), p();
})();
(function() {
  const f = "data-ln-date", l = "lnDate";
  if (window[l] !== void 0) return;
  const v = {}, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(r, _) {
    const y = r + "|" + JSON.stringify(_);
    return v[y] || (v[y] = new Intl.DateTimeFormat(r, _)), v[y];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, h = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function c(r) {
    return !r || r === "" ? { dateStyle: "medium" } : r.match(m) ? h[r] : null;
  }
  function p(r, _, y) {
    const E = r.getDate(), w = r.getMonth(), S = r.getFullYear(), L = r.getHours(), q = r.getMinutes();
    let k, R;
    const x = At(y), N = (y || "").toLowerCase().split("-")[0], F = g(y, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], U = x && F !== N;
    U && x.monthsLong ? k = x.monthsLong[w] : k = g(y, { month: "long" }).format(r), U && x.monthsShort ? R = x.monthsShort[w] : R = g(y, { month: "short" }).format(r);
    const lt = {
      yyyy: String(S),
      yy: String(S).slice(-2),
      MMMM: k,
      MMM: R,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(E).padStart(2, "0"),
      d: String(E),
      HH: String(L).padStart(2, "0"),
      mm: String(q).padStart(2, "0")
    };
    return _.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(it) {
      return lt[it];
    });
  }
  function o(r, _, y) {
    const E = c(_);
    if (E) {
      const w = g(y, E), S = (y || "").toLowerCase().split("-")[0], L = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return At(y) && L !== S ? p(r, "dd.MM.yyyy", y) : w.format(r);
    }
    return p(r, _, y);
  }
  function d(r) {
    if (!r) return "";
    const _ = r.getFullYear(), y = String(r.getMonth() + 1).padStart(2, "0"), E = String(r.getDate()).padStart(2, "0");
    return _ + "-" + y + "-" + E;
  }
  function u(r, _, y) {
    A(r.dom, "ln-date:change", {
      value: _,
      formatted: r.dom.value,
      date: y
    }), r.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function t(r, _, y, E) {
    r._setHiddenRaw(_), b.set.call(r._picker, _), r._lastISO = _, E !== void 0 ? (r._isFormatting = !0, r.dom.value = E, r._isFormatting = !1) : y && r._displayFormatted(y), u(r, _, y);
  }
  function n(r) {
    r._setHiddenRaw(""), b.set.call(r._picker, ""), r._isFormatting = !0, r.dom.value = "", r._isFormatting = !1, r._lastISO = "", u(r, "", null);
  }
  i.prototype._initTextElement = function() {
    const r = this.dom;
    let _ = r.getAttribute("data-ln-value"), y = r.getAttribute("data-ln-date"), E = r.getAttribute("datetime"), w = null;
    _ !== null && _ !== "" ? w = _ : E !== null && E !== "" ? w = E : y !== null && y !== "" && y !== "true" && !m.test(y) ? w = y : w = r.textContent.trim();
    let S = s(w) || e(w);
    if (!S && w)
      if (isNaN(w))
        S = new Date(w);
      else {
        const L = Number(w);
        S = new Date(L > 1e11 ? L : L * 1e3);
      }
    if (S && !isNaN(S.getTime())) {
      const L = d(S);
      this._rawValue = L, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", L), this._formatTextContent();
    } else
      this._rawValue = null;
  }, i.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const r = s(this._rawValue);
      if (r) {
        let y = this.dom.getAttribute("data-ln-date-format");
        if (!y) {
          const w = this.dom.getAttribute("data-ln-date");
          w && m.test(w) && (y = w);
        }
        const E = V(this.dom);
        this.dom.textContent = o(r, y || "medium", E);
      }
    }
  };
  function i(r) {
    if (r[l]) return r[l];
    if (r[l] = this, this.dom = r, r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const _ = this, y = r.value, E = r.name, S = (r.closest(".form-element, form") || r.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let x = 0; x < S.length; x++) {
      const N = S[x].getAttribute("data-ln-date-dict");
      if (N) {
        const O = Wt(S[x], "data-ln-date-dict-key");
        O["months-long"] && (O.monthsLong = O["months-long"].split(",").map((F) => F.trim())), O["months-short"] && (O.monthsShort = O["months-short"].split(",").map((F) => F.trim())), Gt(N, O);
      }
    }
    const L = document.createElement("span");
    L.setAttribute("data-ln-date-field", ""), r.parentNode.insertBefore(L, r), L.appendChild(r), this._wrapper = L;
    const q = document.createElement("input");
    q.type = "hidden", q.name = E, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && q.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.insertAdjacentElement("afterend", q), this._hidden = q;
    const k = document.createElement("input");
    k.type = "date", k.tabIndex = -1, k.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", q.insertAdjacentElement("afterend", k), this._picker = k, r.type = "text";
    const R = document.createElement("button");
    if (R.type = "button", R.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Open date picker"), R.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', k.insertAdjacentElement("afterend", R), this._btn = R, this._lastISO = "", Object.defineProperty(q, "value", {
      get: function() {
        return b.get.call(q);
      },
      set: function(x) {
        if (b.set.call(q, x), x && x !== "") {
          const N = s(x);
          N && t(_, x, N);
        } else x === "" && n(_);
      }
    }), le(r, b, {
      get: function() {
        return b.get.call(r);
      },
      set: function(x, N) {
        if (_._isFormatting) {
          N(x);
          return;
        }
        if (!x || x === "") {
          N(""), n(_);
          return;
        }
        const O = s(x) || e(x);
        if (O) {
          const F = d(O), U = r.getAttribute(f) || "", lt = V(r), it = o(O, U, lt);
          N(it), t(_, F, O, it);
        } else
          N(String(x)), n(_);
      }
    }), this._onPickerChange = function() {
      const x = k.value;
      if (x) {
        const N = s(x);
        N && t(_, x, N);
      } else
        n(_);
    }, k.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const x = _.dom.value.trim();
      if (x === "") {
        _._lastISO !== "" && n(_);
        return;
      }
      if (_._lastISO) {
        const O = s(_._lastISO);
        if (O) {
          const F = _.dom.getAttribute(f) || "", U = V(_.dom);
          if (x === o(O, F, U)) return;
        }
      }
      const N = e(x);
      if (N) {
        const O = d(N);
        t(_, O, N);
      } else if (_._lastISO) {
        const O = s(_._lastISO);
        O && _._displayFormatted(O);
      } else
        _.dom.value = "";
    }, r.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      _._openPicker();
    }, R.addEventListener("click", this._onBtnClick), y && y !== "") {
      const x = s(y);
      x && t(_, y, x);
    }
    return this;
  }
  function s(r) {
    if (!r || typeof r != "string") return null;
    const _ = r.split("T"), y = _[0].split("-");
    if (y.length < 3) return null;
    const E = parseInt(y[0], 10), w = parseInt(y[1], 10) - 1, S = parseInt(y[2], 10);
    if (isNaN(E) || isNaN(w) || isNaN(S)) return null;
    let L = 0, q = 0;
    if (_[1]) {
      const R = _[1].split(":");
      L = parseInt(R[0], 10) || 0, q = parseInt(R[1], 10) || 0;
    }
    const k = new Date(E, w, S, L, q);
    return k.getFullYear() !== E || k.getMonth() !== w || k.getDate() !== S ? null : k;
  }
  function e(r) {
    if (!r || typeof r != "string" || (r = r.trim(), r.length < 6)) return null;
    let _, y;
    if (r.indexOf(".") !== -1)
      _ = ".", y = r.split(".");
    else if (r.indexOf("/") !== -1)
      _ = "/", y = r.split("/");
    else if (r.indexOf("-") !== -1)
      _ = "-", y = r.split("-");
    else
      return null;
    if (y.length !== 3) return null;
    const E = [];
    for (let k = 0; k < 3; k++) {
      const R = parseInt(y[k], 10);
      if (isNaN(R)) return null;
      E.push(R);
    }
    let w, S, L;
    _ === "." ? (w = E[0], S = E[1], L = E[2]) : _ === "/" ? (S = E[0], w = E[1], L = E[2]) : y[0].length === 4 ? (L = E[0], S = E[1], w = E[2]) : (w = E[0], S = E[1], L = E[2]), L < 100 && (L += L < 50 ? 2e3 : 1900);
    const q = new Date(L, S - 1, w);
    return q.getFullYear() !== L || q.getMonth() !== S - 1 || q.getDate() !== w ? null : q;
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
  }, i.prototype._setHiddenRaw = function(r) {
    b.set.call(this._hidden, r);
  }, i.prototype._displayFormatted = function(r) {
    const _ = this.dom.getAttribute(f) || "", y = V(this.dom);
    this._isFormatting = !0, this.dom.value = o(r, _, y), this._isFormatting = !1;
  }, Object.defineProperty(i.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : b.get.call(this._hidden);
    },
    set: function(r) {
      if (this.isTextElement) {
        if (!r || r === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const y = s(r) || e(r);
        if (!y) return;
        const E = d(y);
        this._rawValue = E, this.dom.setAttribute("data-ln-value", E), this._formatTextContent();
        return;
      }
      if (!r || r === "") {
        n(this);
        return;
      }
      const _ = s(r);
      _ && t(this, r, _);
    }
  }), Object.defineProperty(i.prototype, "date", {
    get: function() {
      const r = this.value;
      return r ? s(r) : null;
    },
    set: function(r) {
      if (!r || !(r instanceof Date) || isNaN(r.getTime())) {
        this.value = "";
        return;
      }
      this.value = d(r);
    }
  }), Object.defineProperty(i.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), i.prototype.destroy = function() {
    if (!this.dom[l]) return;
    if (this.isTextElement) {
      A(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[l];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const r = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", r && (this.dom.value = r), A(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[l];
  };
  function a() {
    new MutationObserver(function() {
      const r = document.querySelectorAll("[" + f + "]");
      for (let _ = 0; _ < r.length; _++) {
        const y = r[_][l];
        if (y) {
          if (y.isTextElement)
            y._formatTextContent();
          else if (y.value) {
            const E = s(y.value);
            E && y._displayFormatted(E);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(f, l, i, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(r) {
      const _ = r[l];
      if (_) {
        if (_.isTextElement)
          _._initTextElement();
        else if (_.value) {
          const y = s(_.value);
          y && _._displayFormatted(y);
        }
      }
    }
  }), a();
})();
(function() {
  const f = "data-ln-nav", l = "lnNav";
  if (window[l] !== void 0) return;
  const v = [];
  if (!history._lnNavPatched) {
    const h = history.pushState;
    history.pushState = function() {
      h.apply(history, arguments);
      for (const c of v)
        c();
    }, history._lnNavPatched = !0;
  }
  function b(h) {
    return this.dom = h, this.activeClass = h.getAttribute(f) || "active", this.exact = h.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), v.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(h, { childList: !0, subtree: !0 }), this.update(), this;
  }
  b.prototype.update = function() {
    if (!this.activeClass || G(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const c = Array.from(this.dom.querySelectorAll("a")), p = window.location.pathname, o = g(p);
    for (const d of c) {
      const u = d.getAttribute("href");
      if (!u || u === "#" || u.startsWith("#") || u.startsWith("javascript:") || u.startsWith("mailto:") || u.startsWith("tel:")) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      if (d.hostname && d.hostname !== window.location.hostname) {
        d.classList.remove(this.activeClass), d.removeAttribute("aria-current");
        continue;
      }
      const t = g(u), n = t === o, i = !this.exact && t !== "/" && o.startsWith(t + "/");
      n || i ? (d.classList.add(this.activeClass), d.setAttribute("aria-current", "page")) : (d.classList.remove(this.activeClass), d.removeAttribute("aria-current"));
    }
    A(this.dom, "ln-nav:update", { target: this.dom });
  }, b.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const h = v.indexOf(this.updateHandler);
    h !== -1 && v.splice(h, 1), A(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[l];
  };
  function g(h) {
    try {
      return new URL(h, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return h.replace(/\/$/, "") || "/";
    }
  }
  function m(h, c) {
    const p = h[l];
    if (p) {
      if (c === f) {
        if (!h.hasAttribute(f)) {
          p.destroy();
          return;
        }
        const o = p.activeClass, d = h.getAttribute(f) || "active";
        if (o !== d) {
          const u = h.querySelectorAll("a");
          for (const t of u)
            o && t.classList.remove(o);
          p.activeClass = d;
        }
      } else c === "data-ln-nav-exact" && (p.exact = h.hasAttribute("data-ln-nav-exact"));
      p.update();
    }
  }
  H(f, l, b, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: m
  });
})();
(function() {
  const f = "data-ln-tabs", l = "lnTabs";
  if (window[l] !== void 0 && window[l] !== null) return;
  function v(m, h) {
    const c = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (c) return c;
    if (m.tagName !== "A") return "";
    const p = m.getAttribute("href") || "";
    if (!p.startsWith("#")) return "";
    const o = p.slice(1);
    if (!o) return "";
    const d = o.split("&");
    if (h)
      for (const n of d) {
        const i = n.indexOf(":");
        if (i > 0 && n.slice(0, i).toLowerCase().trim() === h)
          return n.slice(i + 1).toLowerCase().trim();
      }
    const u = d[d.length - 1] || "", t = u.indexOf(":");
    return (t > 0 ? u.slice(t + 1) : u).toLowerCase().trim();
  }
  function b(m) {
    return this.dom = m, g.call(this), this;
  }
  function g() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((p) => p.tagName === "A" && (p.getAttribute("href") || "").startsWith("#")), h = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = h && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : h && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const p of this.tabs) {
      const o = v(p, this.nsKey);
      o ? this.mapTabs[o] = p : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', p);
    }
    for (const p of this.panels) {
      const o = (p.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = p);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const c = this;
    this._clickHandlers = [];
    for (const p of this.tabs) {
      if (p[l + "Trigger"]) continue;
      const o = function(d) {
        const u = p.tagName === "A";
        if (!u && (d.ctrlKey || d.metaKey || d.button === 1)) return;
        const t = v(p, c.nsKey);
        t && (u && !$t(d) || (c.hashEnabled ? ut(c.nsKey) === t ? c.dom.setAttribute("data-ln-tabs-active", t) : nt(c.nsKey, t) : c.dom.setAttribute("data-ln-tabs-active", t)));
      };
      p.addEventListener("click", o), p[l + "Trigger"] = o, c._clickHandlers.push({ el: p, handler: o });
    }
    if (this._onRequestSelect = function(p) {
      const o = p.detail && (p.detail.key || p.detail.tab);
      o && c.dom.setAttribute("data-ln-tabs-active", (o + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!c.hashEnabled) return;
      const p = ut(c.nsKey);
      c.dom.setAttribute("data-ln-tabs-active", p !== null ? p : c.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let p = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const o = Mt("tabs", this.dom);
        o !== null && o in this.mapPanels && (p = o);
      }
      this.dom.setAttribute("data-ln-tabs-active", p);
    }
  }
  b.prototype._applyActive = function(m) {
    var h;
    (!m || !(m in this.mapPanels)) && (m = this.defaultKey);
    for (const c in this.mapTabs) {
      const p = this.mapTabs[c];
      c === m ? (p.setAttribute("data-active", ""), p.setAttribute("aria-selected", "true")) : (p.removeAttribute("data-active"), p.setAttribute("aria-selected", "false"));
    }
    for (const c in this.mapPanels) {
      const p = this.mapPanels[c], o = c === m;
      p.classList.toggle("hidden", !o), p.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const c = (h = this.mapPanels[m]) == null ? void 0 : h.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      c && setTimeout(() => c.focus({ preventScroll: !0 }), 0);
    }
    A(this.dom, "ln-tabs:change", { key: m, tab: this.mapTabs[m], panel: this.mapPanels[m] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && ft("tabs", this.dom, m);
  }, b.prototype.destroy = function() {
    if (this.dom[l]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: m, handler: h } of this._clickHandlers)
        m.removeEventListener("click", h), delete m[l + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), A(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[l];
    }
  }, H(f, l, b, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const h = m.getAttribute("data-ln-tabs-active");
      m[l]._applyActive(h);
    }
  });
})();
(function() {
  const f = "data-ln-toggle", l = "lnToggle";
  if (window[l] !== void 0) return;
  function v(m, h) {
    const c = document.querySelectorAll(
      '[data-ln-toggle-for="' + m.id + '"]'
    );
    for (const p of c)
      p.setAttribute("aria-expanded", h ? "true" : "false");
  }
  function b(m) {
    this.dom = m;
    const h = this;
    if (this._onRequestOpen = function() {
      h.open();
    }, this._onRequestClose = function() {
      h.close();
    }, this._onRequestToggle = function() {
      h.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.hasAttribute("data-ln-persist")) {
      const c = Mt("toggle", m);
      c !== null && m.setAttribute(f, c);
    }
    return this.isOpen = m.getAttribute(f) === "open", this.isOpen && m.classList.add("open"), v(m, this.isOpen), this;
  }
  b.prototype.open = function() {
    this.dom.setAttribute(f, "open");
  }, b.prototype.close = function() {
    this.dom.setAttribute(f, "close");
  }, b.prototype.toggle = function() {
    const m = this.dom.getAttribute(f);
    this.dom.setAttribute(f, m === "open" ? "close" : "open");
  }, b.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), A(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function g(m) {
    const h = m[l];
    if (!h) return;
    const p = m.getAttribute(f) === "open";
    if (p !== h.isOpen)
      if (p) {
        if (G(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(f, "close");
          return;
        }
        h.isOpen = !0, m.classList.add("open"), v(m, !0), A(m, "ln-toggle:open", { target: m }), m.hasAttribute("data-ln-persist") && ft("toggle", m, "open");
      } else {
        if (G(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(f, "open");
          return;
        }
        h.isOpen = !1, m.classList.remove("open"), v(m, !1), A(m, "ln-toggle:close", { target: m }), m.hasAttribute("data-ln-persist") && ft("toggle", m, "close");
      }
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const h = m.target.closest("[data-ln-toggle-for]");
    if (h) {
      const c = h.getAttribute("data-ln-toggle-for"), p = document.getElementById(c);
      if (p && p[l]) {
        m.preventDefault();
        const o = h.getAttribute("data-ln-toggle-action") || "toggle";
        if (o === "open")
          p.setAttribute(f, "open");
        else if (o === "close")
          p.setAttribute(f, "close");
        else if (o === "toggle") {
          const d = p.getAttribute(f);
          p.setAttribute(f, d === "open" ? "close" : "open");
        }
      }
    }
  }), H(f, l, b, "ln-toggle", {
    onAttributeChange: g
  });
})();
(function() {
  const f = "data-ln-accordion", l = "lnAccordion";
  if (window[l] !== void 0) return;
  function v(b) {
    return this.dom = b, this._onToggleOpen = function(g) {
      if (g.detail.target.closest("[data-ln-accordion]") !== b) return;
      const m = b.querySelectorAll("[data-ln-toggle]");
      for (const h of m)
        h !== g.detail.target && h.closest("[data-ln-accordion]") === b && h.getAttribute("data-ln-toggle") === "open" && h.setAttribute("data-ln-toggle", "close");
      A(b, "ln-accordion:change", { target: g.detail.target });
    }, b.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), A(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[l]);
  }, H(f, l, v, "ln-accordion");
})();
(function() {
  const f = "data-ln-dropdown", l = "lnDropdown";
  if (window[l] !== void 0) return;
  function v(b) {
    if (this.dom = b, this.toggleEl = b.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = b.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const m of this.toggleEl.children)
        m.setAttribute("role", "menuitem");
    const g = this;
    return this._onRequestOpen = function() {
      g.toggleEl && g.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      g.toggleEl && g.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (g.toggleEl) {
        const m = g.toggleEl.getAttribute("data-ln-toggle");
        g.toggleEl.setAttribute("data-ln-toggle", m === "open" ? "close" : "open");
      }
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._onToggleOpen = function(m) {
      !m.detail || m.detail.target !== g.toggleEl || (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "true"), typeof g.toggleEl.showPopover == "function" && g.toggleEl.showPopover(), g._reposition(), g._addOutsideClickListener(), g._addScrollRepositionListener(), g._addResizeCloseListener(), A(b, "ln-dropdown:open", { target: m.detail.target }));
    }, this._onToggleClose = function(m) {
      !m.detail || m.detail.target !== g.toggleEl || (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "false"), g._removeOutsideClickListener(), g._removeScrollRepositionListener(), g._removeResizeCloseListener(), g.toggleEl.style.top = "", g.toggleEl.style.left = "", typeof g.toggleEl.hidePopover == "function" && g.toggleEl.matches(":popover-open") && g.toggleEl.hidePopover(), A(b, "ln-dropdown:close", { target: m.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  v.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const b = this.triggerBtn.getBoundingClientRect(), g = Ut(this.toggleEl), m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, h = Rt(b, g, "bottom-end", m);
    this.toggleEl.style.top = h.top + "px", this.toggleEl.style.left = h.left + "px";
  }, v.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const b = this;
    this._boundDocClick = function(g) {
      b.dom.contains(g.target) || b.toggleEl && b.toggleEl.contains(g.target) || b.toggleEl && b.toggleEl.getAttribute("data-ln-toggle") === "open" && b.toggleEl.setAttribute("data-ln-toggle", "close");
    }, b._docClickTimeout = setTimeout(function() {
      b._docClickTimeout = null, document.addEventListener("click", b._boundDocClick);
    }, 0);
  }, v.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, v.prototype._addScrollRepositionListener = function() {
    const b = this;
    this._boundScrollReposition = function() {
      b._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, v.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, v.prototype._addResizeCloseListener = function() {
    const b = this;
    this._boundResizeClose = function() {
      b.toggleEl && b.toggleEl.getAttribute("data-ln-toggle") === "open" && b.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, v.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, v.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), A(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[l]);
  }, H(f, l, v, "ln-dropdown");
})();
(function() {
  const f = "data-ln-popover", l = "lnPopover", v = "data-ln-popover-for", b = "data-ln-popover-position";
  if (window[l] !== void 0) return;
  const g = [];
  let m = null;
  function h() {
    m || (m = function(d) {
      if (d.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function c() {
    g.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function p(d) {
    this.dom = d, this.isOpen = d.getAttribute(f) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const u = this;
    return this._onRequestOpen = function(t) {
      const n = t.detail && t.detail.trigger ? t.detail.trigger : null;
      u.open(n);
    }, this._onRequestClose = function() {
      u.close();
    }, this._onRequestToggle = function(t) {
      const n = t.detail && t.detail.trigger ? t.detail.trigger : null;
      u.toggle(n);
    }, d.addEventListener("ln-popover:request-open", this._onRequestOpen), d.addEventListener("ln-popover:request-close", this._onRequestClose), d.addEventListener("ln-popover:request-toggle", this._onRequestToggle), d.hasAttribute("tabindex") || d.setAttribute("tabindex", "-1"), d.hasAttribute("role") || d.setAttribute("role", "dialog"), d.hasAttribute("popover") || d.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  p.prototype.open = function(d) {
    this.isOpen || (this.trigger = d || null, this.dom.setAttribute(f, "open"));
  }, p.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(f, "closed");
  }, p.prototype.toggle = function(d) {
    this.isOpen ? this.close() : this.open(d);
  }, p.prototype._applyOpen = function(d) {
    this.isOpen = !0, d && (this.trigger = d), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const u = Ut(this.dom);
    if (this.trigger) {
      const s = this.trigger.getBoundingClientRect(), e = this.dom.getAttribute(b) || "bottom", a = Rt(s, u, e, 8);
      this.dom.style.top = a.top + "px", this.dom.style.left = a.left + "px", this.dom.setAttribute("data-ln-popover-placement", a.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const t = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), n = Array.prototype.find.call(t, qt);
    n ? n.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(s) {
      i.dom.contains(s.target) || i.trigger && i.trigger.contains(s.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const s = i.trigger.getBoundingClientRect(), e = Ut(i.dom), a = i.dom.getAttribute(b) || "bottom", r = Rt(s, e, a, 8);
      i.dom.style.top = r.top + "px", i.dom.style.left = r.left + "px", i.dom.setAttribute("data-ln-popover-placement", r.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), h(), A(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, p.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const d = g.indexOf(this);
    d !== -1 && g.splice(d, 1), c(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, A(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[l], A(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(d) {
    this.dom = d;
    const u = d.getAttribute(v);
    return d.setAttribute("aria-haspopup", "dialog"), d.setAttribute("aria-expanded", "false"), d.setAttribute("aria-controls", u), this._onClick = function(t) {
      if (t.ctrlKey || t.metaKey || t.button === 1) return;
      t.preventDefault();
      const n = document.getElementById(u);
      if (!n) return;
      n[l] && (n[l].trigger = d);
      const i = n.getAttribute(f);
      n.setAttribute(f, i === "open" ? "closed" : "open");
    }, d.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[l + "Trigger"];
  }, H(f, l, p, "ln-popover", {
    onAttributeChange: function(d) {
      const u = d[l];
      if (!u) return;
      const n = d.getAttribute(f) === "open";
      if (n !== u.isOpen)
        if (n) {
          if (G(d, "ln-popover:before-open", {
            popoverId: d.id,
            target: d,
            trigger: u.trigger
          }).defaultPrevented) {
            d.setAttribute(f, "closed");
            return;
          }
          u._applyOpen(u.trigger);
        } else {
          if (G(d, "ln-popover:before-close", {
            popoverId: d.id,
            target: d,
            trigger: u.trigger
          }).defaultPrevented) {
            d.setAttribute(f, "open");
            return;
          }
          u._applyClose();
        }
    }
  }), H(v, l + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const f = "data-ln-tooltip-enhance", l = "data-ln-tooltip", v = "data-ln-tooltip-position", b = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[b] !== void 0) return;
  let m = 0, h = null, c = null, p = null, o = null, d = null, u = null;
  function t() {
    return h && h.parentNode || (h = document.getElementById(g), h || (h = document.createElement("div"), h.id = g, document.body.appendChild(h)), h.hasAttribute("popover") || h.setAttribute("popover", "manual")), h;
  }
  function n() {
    u || (u = function(r) {
      r.key === "Escape" && e();
    }, document.addEventListener("keydown", u));
  }
  function i() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function s(r) {
    if (p === r) return;
    e();
    const _ = r.getAttribute(l) || r.getAttribute("title");
    if (!_) return;
    t(), typeof h.showPopover == "function" && h.showPopover(), r.hasAttribute("title") && (o = r.getAttribute("title"), r.removeAttribute("title"));
    const y = r.getAttribute("aria-describedby");
    y ? d = y : d = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = _, r[b + "Uid"] || (m += 1, r[b + "Uid"] = "ln-tooltip-" + m), E.id = r[b + "Uid"], h.appendChild(E);
    const w = E.offsetWidth, S = E.offsetHeight, L = r.getBoundingClientRect(), q = r.getAttribute(v) || "top", k = Rt(L, { width: w, height: S }, q, 6);
    E.style.top = k.top + "px", E.style.left = k.left + "px", E.setAttribute("data-ln-tooltip-placement", k.placement), d ? r.setAttribute("aria-describedby", d + " " + E.id) : r.setAttribute("aria-describedby", E.id), c = E, p = r, n();
  }
  function e() {
    if (!c) {
      i();
      return;
    }
    p && (d !== null ? p.setAttribute("aria-describedby", d) : p.removeAttribute("aria-describedby"), d = null, o !== null && p.setAttribute("title", o)), o = null, c.parentNode && c.parentNode.removeChild(c), c = null, p = null, h && typeof h.hidePopover == "function" && h.matches(":popover-open") && h.hidePopover(), i();
  }
  function a(r) {
    return this.dom = r, r.hasAttribute("data-ln-tooltip-enhanced") || (r.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      s(r);
    }, this._onLeave = function() {
      p === r && !r.contains(document.activeElement) && e();
    }, this._onFocus = function() {
      s(r);
    }, this._onBlur = function() {
      p === r && !r.matches(":hover") && e();
    }, r.addEventListener("mouseenter", this._onEnter), r.addEventListener("mouseleave", this._onLeave), r.addEventListener("focus", this._onFocus, !0), r.addEventListener("blur", this._onBlur, !0), this;
  }
  a.prototype.destroy = function() {
    const r = this.dom;
    r.removeEventListener("mouseenter", this._onEnter), r.removeEventListener("mouseleave", this._onLeave), r.removeEventListener("focus", this._onFocus, !0), r.removeEventListener("blur", this._onBlur, !0), p === r && e(), this._addedEnhancedAttr && r.removeAttribute("data-ln-tooltip-enhanced"), delete r[b], delete r[b + "Uid"], A(r, "ln-tooltip:destroyed", { trigger: r });
  }, H(
    "[" + f + "], [data-ln-tooltip-enhanced], [" + l + "][title]",
    b,
    a,
    "ln-tooltip"
  );
})();
(function() {
  const f = "data-ln-toast", l = "lnToast", v = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function b(s) {
    if (!(!s || !(s instanceof HTMLElement)) && (s.hasAttribute("popover") || s.setAttribute("popover", "manual"), typeof s.showPopover == "function")) {
      if (s.matches(":popover-open"))
        try {
          s.hidePopover();
        } catch {
        }
      try {
        s.showPopover();
      } catch {
      }
    }
  }
  function g(s) {
    if (!s || !(s instanceof HTMLElement)) return;
    if (s.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof s.hidePopover == "function" && s.matches(":popover-open"))
      try {
        s.hidePopover();
      } catch {
      }
  }
  function m(s) {
    if (!s || s.nodeType !== 1) return;
    const e = Array.from(s.querySelectorAll("[" + f + "]"));
    s.hasAttribute && s.hasAttribute(f) && e.push(s);
    for (const a of e)
      a[l] || new h(a);
  }
  function h(s) {
    this.dom = s, s[l] = this, this.timeoutDefault = parseInt(s.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(s.getAttribute("data-ln-toast-max") || "5", 10);
    const e = Array.from(s.querySelectorAll("[data-ln-toast-item]"));
    for (; e.length > this.max; ) s.removeChild(e.shift());
    for (const a of e) t(a, this);
    return e.length > 0 && b(s), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[l]) {
      for (const s of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        d(s);
      g(this.dom), delete this.dom[l];
    }
  };
  function c(s, e) {
    const a = ((s.type || "") + "").trim().toLowerCase(), r = ht(e, v, "ln-toast");
    if (!r)
      return console.warn('[ln-toast] Template "' + v + '" not found'), null;
    et(r, {
      type: a,
      title: s.title,
      message: typeof s.message == "string" ? s.message : void 0
    });
    const _ = r.firstElementChild;
    if (!_) return null;
    _.hasAttribute("data-ln-toast-item") || _.setAttribute("data-ln-toast-item", ""), _.classList.add("ln-enter");
    const y = _.querySelector(".body");
    y && p(y, s);
    const E = _.querySelector("[data-ln-toast-close]");
    return E && E.addEventListener("click", function() {
      d(_);
    }), _;
  }
  function p(s, e) {
    if (Array.isArray(e.message)) {
      const a = document.createElement("ul");
      for (const r of e.message) {
        const _ = document.createElement("li");
        _.textContent = r, a.appendChild(_);
      }
      s.appendChild(a);
    }
    if (e.data && e.data.errors) {
      const a = document.createElement("ul");
      for (const r of Object.values(e.data.errors).flat()) {
        const _ = document.createElement("li");
        _.textContent = r, a.appendChild(_);
      }
      s.appendChild(a);
    }
  }
  function o(s, e) {
    const a = Array.from(s.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; a.length >= s.max && a.length > 0; ) s.dom.removeChild(a.shift());
    s.dom.appendChild(e), b(s.dom), requestAnimationFrame(() => e.classList.remove("ln-enter"));
  }
  function d(s) {
    if (!s || !s.parentNode) return;
    const e = s.parentNode;
    clearTimeout(s._timer), s.classList.remove("ln-enter"), s.classList.add("ln-out"), setTimeout(() => {
      s.parentNode && (s.parentNode.removeChild(s), g(e));
    }, 200);
  }
  function u(s) {
    let e = s && s.container;
    return typeof e == "string" && (e = document.querySelector(e)), e instanceof HTMLElement || (e = document.querySelector("[" + f + "]") || document.getElementById("ln-toast-container")), e || null;
  }
  function t(s, e) {
    if (s._lnToastHydrated) return;
    s._lnToastHydrated = !0;
    const a = s.querySelector("[data-ln-toast-close]");
    a && a.addEventListener("click", function() {
      d(s);
    });
    const r = s.getAttribute("data-ln-toast-timeout"), _ = r !== null ? parseInt(r, 10) : NaN, y = Number.isFinite(_) ? _ : e.timeoutDefault;
    y > 0 && (s._timer = setTimeout(function() {
      d(s);
    }, y));
  }
  function n(s) {
    const e = s.detail || {}, a = u(e);
    if (!a) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const r = a[l] || new h(a), _ = c(e, a);
    if (!_) return;
    const y = Number.isFinite(e.timeout) ? e.timeout : r.timeoutDefault;
    o(r, _), y > 0 && (_._timer = setTimeout(() => d(_), y));
  }
  function i(s) {
    const e = s && s.detail || {};
    if (e.container) {
      const a = u(e);
      if (a)
        for (const r of Array.from(a.querySelectorAll("[data-ln-toast-item]"))) d(r);
    } else {
      const a = document.querySelectorAll("[" + f + "]");
      for (const r of Array.from(a))
        for (const _ of Array.from(r.querySelectorAll("[data-ln-toast-item]"))) d(_);
    }
  }
  at(function() {
    window.addEventListener("ln-toast:enqueue", n), window.addEventListener("ln-toast:clear", i), window.addEventListener("ln-modal:open", function() {
      const e = document.querySelectorAll("[" + f + "]");
      for (const a of Array.from(e))
        a.querySelectorAll("[data-ln-toast-item]").length > 0 && b(a);
    }), new MutationObserver(function(e) {
      for (const a of e) {
        if (a.type === "attributes") {
          m(a.target);
          continue;
        }
        for (const r of a.addedNodes)
          m(r);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] }), m(document.body);
  }, "ln-toast");
})();
(function() {
  const f = "data-ln-upload", l = "lnUpload", v = "data-ln-upload-dict", b = "data-ln-upload-accept", g = "data-ln-upload-context", m = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-icon-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function h() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const i = document.createElement("div");
    i.innerHTML = m;
    const s = i.firstElementChild;
    s && document.body.appendChild(s);
  }
  if (window[l] !== void 0) return;
  function c(i) {
    if (i === 0) return "0 B";
    const s = 1024, e = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(i) / Math.log(s));
    return parseFloat((i / Math.pow(s, a)).toFixed(1)) + " " + e[a];
  }
  function p(i) {
    return i.split(".").pop().toLowerCase();
  }
  function o(i) {
    return i === "docx" && (i = "doc"), ["pdf", "doc", "epub"].includes(i) ? "ln-icon-custom-file-" + i : "ln-icon-file";
  }
  function d(i, s) {
    if (!s) return !0;
    const e = "." + p(i.name);
    return s.split(",").map(function(r) {
      return r.trim().toLowerCase();
    }).includes(e.toLowerCase());
  }
  function u(i) {
    if (i.lnUploadAPI) return;
    h();
    const s = Wt(i, v), e = i.querySelector(".ln-upload__zone"), a = i.querySelector(".ln-upload__list"), r = i.getAttribute(b) || "";
    if (!e || !a) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", i);
      return;
    }
    let _ = i.querySelector('input[type="file"]');
    _ || (_ = document.createElement("input"), _.type = "file", _.multiple = !0, _.classList.add("hidden"), r && (_.accept = r.split(",").map(function(P) {
      return P = P.trim(), P.startsWith(".") ? P : "." + P;
    }).join(",")), i.appendChild(_));
    const y = i.getAttribute(f) || "/files/upload", E = i.getAttribute(g) || "", w = i.getAttribute("data-ln-upload-delete") || (y.includes("/upload") ? y.replace(/\/upload\/?$/, "/{id}") : y + "/{id}"), S = /* @__PURE__ */ new Map();
    let L = 0;
    function q() {
      const P = document.querySelector('meta[name="csrf-token"]');
      return P ? P.getAttribute("content") : "";
    }
    function k(P) {
      if (!d(P, r)) {
        const I = s["invalid-type"];
        A(i, "ln-upload:invalid", {
          file: P,
          message: I
        }), A(window, "ln-toast:enqueue", {
          type: "error",
          title: s["invalid-title"] || "Invalid File",
          message: I || s["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const j = "file-" + ++L, Q = p(P.name), vt = o(Q), rt = ht(i, "ln-upload-item", "ln-upload");
      if (!rt) return;
      const tt = rt.firstElementChild;
      if (!tt) return;
      tt.setAttribute("data-file-id", j), et(tt, {
        name: P.name,
        sizeText: "0%",
        iconHref: "#" + vt,
        removeLabel: s.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const Et = tt.querySelector(".ln-upload__progress-bar"), ot = tt.querySelector('[data-ln-upload-action="remove"]');
      ot && (ot.disabled = !0), a.appendChild(tt);
      const pt = new FormData();
      pt.append("file", P);
      const C = /* @__PURE__ */ new Set();
      i.querySelectorAll("input, select, textarea").forEach(function(I) {
        if (I.name && I.name !== "file_ids[]" && I.type !== "file") {
          if ((I.type === "checkbox" || I.type === "radio") && !I.checked)
            return;
          pt.append(I.name, I.value), C.add(I.name);
        }
      }), !C.has("context") && E && pt.append("context", E);
      const T = new XMLHttpRequest();
      T.upload.addEventListener("progress", function(I) {
        if (I.lengthComputable) {
          const M = Math.round(I.loaded / I.total * 100);
          Et.style.width = M + "%", et(tt, { sizeText: M + "%" });
        }
      }), T.addEventListener("load", function() {
        if (T.status >= 200 && T.status < 300) {
          let I;
          try {
            I = JSON.parse(T.responseText);
          } catch {
            D("Invalid response");
            return;
          }
          et(tt, { sizeText: c(I.size || P.size), uploading: !1 }), ot && (ot.disabled = !1), S.set(j, {
            serverId: I.id,
            name: I.name,
            size: I.size
          }), R(), A(i, "ln-upload:uploaded", {
            localId: j,
            serverId: I.id,
            name: I.name
          });
        } else {
          let I = s["upload-failed"] || "Upload failed";
          try {
            I = JSON.parse(T.responseText).message || I;
          } catch {
          }
          D(I);
        }
      }), T.addEventListener("error", function() {
        D(s["network-error"] || "Network error");
      });
      function D(I) {
        Et && (Et.style.width = "100%"), et(tt, { sizeText: s.error || "Error", uploading: !1, error: !0 }), ot && (ot.disabled = !1), A(i, "ln-upload:error", {
          file: P,
          message: I
        }), A(window, "ln-toast:enqueue", {
          type: "error",
          title: s["error-title"] || "Upload Error",
          message: I || s["upload-failed"] || "Failed to upload file"
        });
      }
      T.open("POST", y), T.setRequestHeader("X-CSRF-TOKEN", q()), T.setRequestHeader("Accept", "application/json"), T.send(pt);
    }
    function R() {
      for (const P of i.querySelectorAll('input[name="file_ids[]"]'))
        P.remove();
      for (const [, P] of S) {
        const j = document.createElement("input");
        j.type = "hidden", j.name = "file_ids[]", j.value = P.serverId, i.appendChild(j);
      }
    }
    function x(P) {
      const j = S.get(P), Q = a.querySelector('[data-file-id="' + P + '"]');
      if (!j || !j.serverId) {
        Q && Q.remove(), S.delete(P), R();
        return;
      }
      Q && et(Q, { deleting: !0 });
      const vt = w.replace("{id}", j.serverId);
      fetch(vt, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": q(),
          Accept: "application/json"
        }
      }).then(function(rt) {
        rt.status === 200 ? (Q && Q.remove(), S.delete(P), R(), A(i, "ln-upload:removed", {
          localId: P,
          serverId: j.serverId
        })) : (Q && et(Q, { deleting: !1 }), A(window, "ln-toast:enqueue", {
          type: "error",
          title: s["delete-title"] || "Error",
          message: s["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(rt) {
        console.warn("[ln-upload] Delete error:", rt), Q && et(Q, { deleting: !1 }), A(window, "ln-toast:enqueue", {
          type: "error",
          title: s["network-error"] || "Network error",
          message: s["connection-error"] || "Could not connect to server"
        });
      });
    }
    function N(P) {
      for (const j of P)
        k(j);
      _.value = "";
    }
    const O = function() {
      _.click();
    }, F = function() {
      N(this.files);
    }, U = function(P) {
      P.preventDefault(), P.stopPropagation(), e.classList.add("ln-upload__zone--dragover");
    }, lt = function(P) {
      P.preventDefault(), P.stopPropagation(), e.classList.add("ln-upload__zone--dragover");
    }, it = function(P) {
      P.preventDefault(), P.stopPropagation(), e.classList.remove("ln-upload__zone--dragover");
    }, yt = function(P) {
      P.preventDefault(), P.stopPropagation(), e.classList.remove("ln-upload__zone--dragover"), N(P.dataTransfer.files);
    }, Lt = function(P) {
      const j = P.target.closest('[data-ln-upload-action="remove"]');
      if (!j || !a.contains(j) || j.disabled) return;
      const Q = j.closest(".ln-upload__item");
      Q && x(Q.getAttribute("data-file-id"));
    };
    e.addEventListener("click", O), _.addEventListener("change", F), e.addEventListener("dragenter", U), e.addEventListener("dragover", lt), e.addEventListener("dragleave", it), e.addEventListener("drop", yt), a.addEventListener("click", Lt), i.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(S.values()).map(function(P) {
          return P.serverId;
        });
      },
      getFiles: function() {
        return Array.from(S.values());
      },
      clear: function() {
        for (const [, P] of S)
          if (P.serverId) {
            const j = w.replace("{id}", P.serverId);
            fetch(j, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": q(),
                Accept: "application/json"
              }
            });
          }
        S.clear(), a.innerHTML = "", R(), A(i, "ln-upload:cleared", {});
      },
      destroy: function() {
        e.removeEventListener("click", O), _.removeEventListener("change", F), e.removeEventListener("dragenter", U), e.removeEventListener("dragover", lt), e.removeEventListener("dragleave", it), e.removeEventListener("drop", yt), a.removeEventListener("click", Lt), S.clear(), a.innerHTML = "", R(), delete i.lnUploadAPI;
      }
    };
  }
  function t() {
    for (const i of document.querySelectorAll("[" + f + "]"))
      u(i);
  }
  function n() {
    at(function() {
      new MutationObserver(function(s) {
        for (const e of s)
          if (e.type === "childList") {
            for (const a of e.addedNodes)
              if (a.nodeType === 1) {
                a.hasAttribute(f) && u(a);
                for (const r of a.querySelectorAll("[" + f + "]"))
                  u(r);
              }
          } else e.type === "attributes" && e.target.hasAttribute(f) && u(e.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-upload");
  }
  window[l] = {
    init: u,
    initAll: t
  }, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const f = "lnExternalLinks";
  if (window[f] !== void 0) return;
  function l(c) {
    return c.hostname && c.hostname !== window.location.hostname;
  }
  function v(c) {
    if (c.getAttribute("data-ln-external-link") === "processed" || !l(c)) return;
    c.target = "_blank";
    const p = (c.rel || "").split(/\s+/).filter(Boolean);
    p.includes("noopener") || p.push("noopener"), p.includes("noreferrer") || p.push("noreferrer"), c.rel = p.join(" ");
    const o = document.createElement("span");
    o.className = "sr-only", o.textContent = "(opens in new tab)", c.appendChild(o), c.setAttribute("data-ln-external-link", "processed"), A(c, "ln-external-links:processed", {
      link: c,
      href: c.href
    });
  }
  function b(c) {
    c = c || document.body;
    for (const p of c.querySelectorAll("a, area"))
      v(p);
  }
  function g() {
    at(function() {
      document.body.addEventListener("click", function(c) {
        const p = c.target.closest("a, area");
        p && p.getAttribute("data-ln-external-link") === "processed" && A(p, "ln-external-links:clicked", {
          link: p,
          href: p.href,
          text: p.textContent || p.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    at(function() {
      new MutationObserver(function(p) {
        for (const o of p) {
          if (o.type === "childList") {
            for (const d of o.addedNodes)
              if (d.nodeType === 1 && (d.matches && (d.matches("a") || d.matches("area")) && v(d), d.querySelectorAll))
                for (const u of d.querySelectorAll("a, area"))
                  v(u);
          }
          if (o.type === "attributes" && o.attributeName === "href") {
            const d = o.target;
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
    g(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      b();
    }) : b();
  }
  window[f] = {
    process: b
  }, h();
})();
(function() {
  const f = "data-ln-link", l = "lnLink";
  if (window[l] !== void 0) return;
  let v = null;
  function b() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function g(a) {
    v && (v.textContent = a, v.classList.add("ln-link-status--visible"));
  }
  function m() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function h(a, r) {
    if (r.target.closest("a, button, input, select, textarea")) return;
    const _ = a.querySelector("a");
    if (!_) return;
    const y = _.getAttribute("href");
    if (!y) return;
    if (r.ctrlKey || r.metaKey || r.button === 1) {
      window.open(y, "_blank");
      return;
    }
    G(a, "ln-link:navigate", { target: a, href: y, link: _ }).defaultPrevented || _.click();
  }
  function c(a) {
    const r = a.querySelector("a");
    if (!r) return;
    const _ = r.getAttribute("href");
    _ && g(_);
  }
  function p() {
    m();
  }
  function o(a) {
    a[l + "Row"] || !a.querySelector("a") || (a[l + "Row"] = !0, a._lnLinkClick = function(_) {
      h(a, _);
    }, a._lnLinkEnter = function() {
      c(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", p));
  }
  function d(a) {
    a[l + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", p), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[l + "Row"]);
  }
  function u(a) {
    if (!a[l + "Init"]) return;
    const r = a.tagName;
    if (r === "TABLE" || r === "TBODY") {
      const _ = r === "TABLE" && a.querySelector("tbody") || a;
      for (const y of _.querySelectorAll("tr"))
        d(y);
    } else
      d(a);
    delete a[l + "Init"];
  }
  function t(a) {
    if (a[l + "Init"]) return;
    a[l + "Init"] = !0;
    const r = a.tagName;
    if (r === "TABLE" || r === "TBODY") {
      const _ = r === "TABLE" && a.querySelector("tbody") || a;
      for (const y of _.querySelectorAll("tr"))
        o(y);
    } else
      o(a);
  }
  function n(a) {
    a.hasAttribute && a.hasAttribute(f) && t(a);
    const r = a.querySelectorAll ? a.querySelectorAll("[" + f + "]") : [];
    for (const _ of r)
      t(_);
  }
  function i() {
    at(function() {
      new MutationObserver(function(r) {
        for (const _ of r)
          if (_.type === "childList") {
            for (const y of _.addedNodes)
              if (y.nodeType === 1) {
                n(y);
                const E = y.closest("[" + f + "]");
                if (E)
                  if (y.tagName === "TR")
                    o(y);
                  else {
                    const w = E.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const S = y.querySelectorAll ? y.querySelectorAll("tr") : [];
                      for (const L of S)
                        o(L);
                    }
                  }
              }
          } else _.type === "attributes" && (_.target.hasAttribute && _.target.hasAttribute(f) ? n(_.target) : u(_.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-link");
  }
  function s(a) {
    n(a);
  }
  window[l] = { init: s, destroy: u };
  function e() {
    b(), i(), s(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
(function() {
  const f = "[data-ln-progress]", l = "lnProgress";
  if (window[l] !== void 0) return;
  function v(h) {
    return this.dom = h, this._attrObserver = null, this._parentObserver = null, m.call(this), b.call(this), g.call(this), this;
  }
  v.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[l]);
  };
  function b() {
    const h = this, c = new MutationObserver(function(p) {
      for (const o of p)
        (o.attributeName === "data-ln-progress" || o.attributeName === "data-ln-progress-max") && m.call(h);
    });
    c.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = c;
  }
  function g() {
    const h = this, c = this.dom.parentElement;
    if (!c) return;
    const p = new MutationObserver(function(o) {
      for (const d of o)
        d.attributeName === "data-ln-progress-max" && m.call(h);
    });
    p.observe(c, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = p;
  }
  function m() {
    const h = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, c = this.dom.parentElement, o = (c && c.hasAttribute("data-ln-progress-max") ? parseFloat(c.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let d = o > 0 ? h / o * 100 : 0;
    d < 0 && (d = 0), d > 100 && (d = 100), this.dom.style.width = d + "%";
    const u = Math.max(0, Math.min(h, o));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(o)), this.dom.setAttribute("aria-valuenow", String(u)), A(this.dom, "ln-progress:change", { target: this.dom, value: h, max: o, percentage: d });
  }
  H(
    f,
    l,
    v,
    "ln-progress"
  );
})();
(function() {
  const f = "data-ln-filter", l = "lnFilter", v = "data-ln-filter-key", b = "data-ln-filter-value", g = "data-ln-filter-hide", m = "data-ln-filter-reset", h = "data-ln-filter-col", c = /* @__PURE__ */ new WeakMap();
  if (window[l] !== void 0) return;
  function p(n) {
    return n.hasAttribute(m) || n.getAttribute(b) === "";
  }
  function o(n) {
    let i = n._filterKey;
    const s = [];
    for (let e = 0; e < n.inputs.length; e++) {
      const a = n.inputs[e];
      if (a.checked && !p(a)) {
        const r = a.getAttribute(b);
        r && s.push(r);
      }
    }
    return { key: i, values: s };
  }
  function d(n, i) {
    if (n.length !== i.length) return !0;
    for (let s = 0; s < n.length; s++) if (n[s] !== i[s]) return !0;
    return !1;
  }
  function u(n) {
    const i = n.dom, s = n.colIndex, e = i.querySelector("template");
    if (!e || s === null) return;
    const a = document.getElementById(n.targetId);
    if (!a) return;
    const r = a.tagName === "TABLE" ? a : a.querySelector("table");
    if (!r || a.hasAttribute("data-ln-table")) return;
    const _ = {}, y = [], E = r.tBodies;
    for (let L = 0; L < E.length; L++) {
      const q = E[L].rows;
      for (let k = 0; k < q.length; k++) {
        const R = q[k].cells[s], x = R ? R.textContent.trim() : "";
        x && !_[x] && (_[x] = !0, y.push(x));
      }
    }
    y.sort(function(L, q) {
      return L.localeCompare(q);
    });
    const w = i.querySelector("[" + v + "]"), S = w ? w.getAttribute(v) : i.getAttribute("data-ln-filter-key") || "col" + s;
    for (let L = 0; L < y.length; L++) {
      const q = e.content.cloneNode(!0), k = q.querySelector("input");
      k && (k.setAttribute(v, S), k.setAttribute(b, y[L]), Ct(q, { text: y[L] }), i.appendChild(q));
    }
  }
  function t(n) {
    this.dom = n, this.targetId = n.getAttribute(f);
    const i = n.getAttribute(h);
    this.colIndex = i !== null ? parseInt(i, 10) : null, u(this), this.inputs = Array.from(n.querySelectorAll("[" + v + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(v) : null, this._lastSnapshot = null;
    const s = this, e = Qt(
      function() {
        s._render();
      },
      function() {
        s._afterRender();
      }
    );
    this._queueRender = e, this._attachHandlers();
    let a = !1;
    if (n.hasAttribute("data-ln-persist")) {
      const r = Mt("filter", n);
      if (r && r.key && Array.isArray(r.values) && r.values.length > 0) {
        for (let _ = 0; _ < this.inputs.length; _++) {
          const y = this.inputs[_];
          p(y) ? y.checked = !1 : y.getAttribute(v) === r.key && r.values.indexOf(y.getAttribute(b)) !== -1 ? y.checked = !0 : y.checked = !1;
        }
        e(), a = !0;
      }
    }
    if (!a) {
      for (let r = 0; r < this.inputs.length; r++)
        if (this.inputs[r].checked && !p(this.inputs[r])) {
          e();
          break;
        }
    }
    return this;
  }
  t.prototype._attachHandlers = function() {
    const n = this;
    this.inputs.forEach(function(i) {
      i[l + "Bound"] || (i[l + "Bound"] = !0, i._lnFilterChange = function() {
        if (p(i)) {
          for (let s = 0; s < n.inputs.length; s++)
            p(n.inputs[s]) || (n.inputs[s].checked = !1);
          i.checked = !0, n._queueRender();
          return;
        }
        if (i.checked) {
          for (let e = 0; e < n.inputs.length; e++)
            p(n.inputs[e]) && (n.inputs[e].checked = !1);
          let s = !1;
          for (let e = 0; e < n.inputs.length; e++)
            if (p(n.inputs[e])) {
              s = !0;
              break;
            }
          if (s) {
            let e = !0;
            for (let a = 0; a < n.inputs.length; a++)
              if (!p(n.inputs[a]) && !n.inputs[a].checked) {
                e = !1;
                break;
              }
            if (e)
              for (let a = 0; a < n.inputs.length; a++)
                p(n.inputs[a]) ? n.inputs[a].checked = !0 : n.inputs[a].checked = !1;
          }
        } else {
          let s = !1;
          for (let e = 0; e < n.inputs.length; e++)
            if (!p(n.inputs[e]) && n.inputs[e].checked) {
              s = !0;
              break;
            }
          if (!s)
            for (let e = 0; e < n.inputs.length; e++)
              p(n.inputs[e]) && (n.inputs[e].checked = !0);
        }
        n._queueRender();
      }, i.addEventListener("change", i._lnFilterChange));
    });
  }, t.prototype._render = function() {
    const n = this, i = o(this), s = i.key === null || i.values.length === 0, e = [];
    for (let a = 0; a < i.values.length; a++)
      e.push(i.values[a].toLowerCase());
    if (n.colIndex !== null)
      n._filterTableRows(i);
    else {
      const a = document.getElementById(n.targetId);
      if (!a) return;
      const r = a.children;
      for (let _ = 0; _ < r.length; _++) {
        const y = r[_];
        if (s) {
          y.removeAttribute(g);
          continue;
        }
        const E = y.getAttribute("data-" + i.key);
        y.removeAttribute(g), E !== null && e.indexOf(E.toLowerCase()) === -1 && y.setAttribute(g, "true");
      }
    }
  }, t.prototype._afterRender = function() {
    const n = o(this), i = this._lastSnapshot;
    if (!i || i.key !== n.key || d(i.values, n.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: n.key,
        values: n.values.slice()
      });
      const e = i && i.values.length > 0, a = n.values.length === 0;
      e && a && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: n.key, values: n.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (n.key && n.values.length > 0 ? ft("filter", this.dom, { key: n.key, values: n.values.slice() }) : ft("filter", this.dom, null));
  }, t.prototype._dispatchOnBoth = function(n, i) {
    A(this.dom, n, i);
    const s = document.getElementById(this.targetId);
    s && s !== this.dom && A(s, n, i);
  }, t.prototype._filterTableRows = function(n) {
    const i = document.getElementById(this.targetId);
    if (!i) return;
    const s = i.tagName === "TABLE" ? i : i.querySelector("table");
    if (!s || i.hasAttribute("data-ln-table")) return;
    const e = n.key || this._filterKey, a = n.values;
    c.has(s) || c.set(s, {});
    const r = c.get(s);
    if (e && a.length > 0) {
      const w = [];
      for (let S = 0; S < a.length; S++)
        w.push(a[S].toLowerCase());
      r[e] = { col: this.colIndex, values: w };
    } else e && delete r[e];
    const _ = Object.keys(r), y = _.length > 0, E = s.tBodies;
    for (let w = 0; w < E.length; w++) {
      const S = E[w].rows;
      for (let L = 0; L < S.length; L++) {
        const q = S[L];
        if (!y) {
          q.removeAttribute(g);
          continue;
        }
        let k = !0;
        for (let R = 0; R < _.length; R++) {
          const x = r[_[R]], N = q.cells[x.col], O = N ? N.textContent.trim().toLowerCase() : "";
          if (x.values.indexOf(O) === -1) {
            k = !1;
            break;
          }
        }
        k ? q.removeAttribute(g) : q.setAttribute(g, "true");
      }
    }
  }, t.prototype.destroy = function() {
    if (this.dom[l]) {
      if (this.colIndex !== null) {
        const n = document.getElementById(this.targetId);
        if (n) {
          const i = n.tagName === "TABLE" ? n : n.querySelector("table");
          if (i && c.has(i)) {
            const s = c.get(i), e = this._filterKey;
            e && s[e] && delete s[e], Object.keys(s).length === 0 && c.delete(i);
          }
        }
      }
      this.inputs.forEach(function(n) {
        n._lnFilterChange && (n.removeEventListener("change", n._lnFilterChange), delete n._lnFilterChange), delete n[l + "Bound"];
      }), delete this.dom[l];
    }
  }, H(f, l, t, "ln-filter");
})();
(function() {
  const f = "data-ln-search", l = "lnSearch", v = "data-ln-search-hide";
  if (window[l] !== void 0) return;
  function g(m) {
    this.dom = m, this.targetId = m.getAttribute(f);
    const h = m.tagName;
    this.input = h === "INPUT" || h === "TEXTAREA" ? m : m.querySelector('[name="search"]') || m.querySelector('input[type="search"]') || m.querySelector('input[type="text"]'), this.itemsSelector = m.getAttribute("data-ln-search-items") || null;
    const c = m.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = c !== null ? parseInt(c, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const p = this;
      queueMicrotask(function() {
        p._search(p.input.value.trim().toLowerCase());
      });
    }
    return this;
  }
  g.prototype._attachHandler = function() {
    if (!this.input) return;
    const m = this, h = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = h ? h.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      m.input.value = "", m._search(""), m.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(m._debounceTimer), m._debounceTimer = setTimeout(function() {
        m._search(m.input.value.trim().toLowerCase());
      }, m.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, g.prototype._search = function(m) {
    const h = document.getElementById(this.targetId);
    if (!h || G(h, "ln-search:change", { term: m, targetId: this.targetId }).defaultPrevented) return;
    const p = this.itemsSelector ? h.querySelectorAll(this.itemsSelector) : h.children;
    for (let o = 0; o < p.length; o++) {
      const d = p[o];
      d.removeAttribute(v), m && !d.textContent.replace(/\s+/g, " ").toLowerCase().includes(m) && d.setAttribute(v, "true");
    }
  }, g.prototype.destroy = function() {
    this.dom[l] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), delete this.dom[l]);
  }, H(f, l, g, "ln-search");
})();
(function() {
  const f = "data-ln-sort", l = "lnSort", v = "data-ln-sort-field", b = "data-ln-sort-state", g = "data-ln-sort-dir", m = "data-ln-sort-items";
  if (window[l] !== void 0) return;
  function h(p, o) {
    if (o) {
      const d = p.querySelector('[data-ln-field="' + o + '"]');
      if (d) return xt(d);
    }
    return xt(p);
  }
  function c(p) {
    this.dom = p, this.targetId = p.getAttribute(f), this.field = p.getAttribute(v) || null;
    const o = p.closest("th");
    this.column = !this.field && o ? o.cellIndex : null, this.itemsSelector = p.getAttribute(m) || null, this._initialOrder = null;
    const d = document.getElementById(this.targetId);
    d && (this._initialOrder = this.itemsSelector ? Array.from(d.querySelectorAll(this.itemsSelector)) : Array.from(d.children)), this._target = d;
    const u = this;
    if (this._onClick = function(t) {
      const n = t.target.closest("[" + g + "]");
      n && u._apply(n.getAttribute(g));
    }, p.addEventListener("click", this._onClick), this._onTargetChange = function(t) {
      (u.field ? t.detail.field === u.field : t.detail.column === u.column) || (p.setAttribute(b, "none"), p.hasAttribute("data-ln-persist") && ft("sort", p, null));
    }, d && d.addEventListener("ln-sort:change", this._onTargetChange), p.hasAttribute("data-ln-persist")) {
      const t = Mt("sort", p);
      t && t.direction && queueMicrotask(function() {
        u._apply(t.direction, !0);
      });
    }
    return this;
  }
  c.prototype._apply = function(p, o) {
    this.dom.setAttribute(b, p);
    const d = this._target || document.getElementById(this.targetId);
    if (!d) return;
    const u = {
      field: this.field,
      column: this.column,
      direction: p,
      targetId: this.targetId
    };
    !o && this.dom.hasAttribute("data-ln-persist") && ft("sort", this.dom, p === "none" ? null : u), !G(d, "ln-sort:change", u).defaultPrevented && this._defaultSort(d, p);
  }, c.prototype._defaultSort = function(p, o) {
    const d = this.itemsSelector ? Array.from(p.querySelectorAll(this.itemsSelector)) : Array.from(p.children);
    if (!d.length) return;
    const u = d[0].parentNode;
    let t;
    if (o === "none")
      t = (this._initialOrder || d).filter(function(i) {
        return i.parentNode === u;
      });
    else {
      const i = this.field, s = d.map(function(_) {
        return h(_, i);
      }), e = Dt(s), a = typeof Intl < "u" ? new Intl.Collator(V(this.dom), { sensitivity: "base" }) : null, r = o === "desc" ? -1 : 1;
      t = d.slice().sort(function(_, y) {
        return It(h(_, i), h(y, i), e, a) * r;
      });
    }
    const n = document.createDocumentFragment();
    for (let i = 0; i < t.length; i++) n.appendChild(t[i]);
    u.appendChild(n);
  }, c.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("click", this._onClick), this._target && this._target.removeEventListener("ln-sort:change", this._onTargetChange), delete this.dom[l]);
  }, H(f, l, c, "ln-sort");
})();
(function() {
  const f = "data-ln-table", l = "lnTable", v = "data-ln-table-empty";
  if (window[l] !== void 0) return;
  const p = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function o(t, n) {
    if (t == null || isNaN(t)) return "";
    try {
      return new Intl.NumberFormat(V(n)).format(t);
    } catch {
      return String(t);
    }
  }
  function d(t) {
    let n = t.parentElement;
    for (; n && n !== document.body && n !== document.documentElement; ) {
      const s = getComputedStyle(n).overflowY;
      if (s === "auto" || s === "scroll") return n;
      n = n.parentElement;
    }
    return null;
  }
  function u(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("[data-ln-table-body]") || t.querySelector("tbody"), this.thead = t.querySelector("thead");
    const n = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = n ? Array.from(n.querySelectorAll("th")) : [], this._totalSpan = t.querySelector("[data-ln-table-total]"), this._filteredSpan = t.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== t ? this._filteredSpan.parentElement : null), this._selectedSpan = t.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== t ? this._selectedSpan.parentElement : null), this.isDataDriven = t.hasAttribute("data-ln-table-source"), this.name = t.getAttribute(f) || "", this.source = t.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const i = this;
    return this._onSetSearch = function(s) {
      const e = (s.detail && s.detail.query != null ? s.detail.query : s.detail && s.detail.term != null ? s.detail.term : "").trim();
      i.isDataDriven ? (i.currentSearch = e, A(t, "ln-table:search", {
        table: i.name,
        query: i.currentSearch
      }), i._requestData()) : (i._searchTerm = e.toLowerCase(), i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), A(t, "ln-table:filter", {
        term: i._searchTerm,
        matched: i._filteredData.length,
        total: i._data.length
      }));
    }, t.addEventListener("ln-table:set-search", this._onSetSearch), this._onSetFilter = function(s) {
      if (!s.detail) return;
      const e = s.detail.key, a = s.detail.values;
      if (i.isDataDriven)
        !a || a.length === 0 ? delete i.currentFilters[e] : i.currentFilters[e] = a, i._requestData();
      else {
        if (!a || a.length === 0)
          delete i._columnFilters[e];
        else {
          const r = [];
          for (let _ = 0; _ < a.length; _++)
            r.push(a[_].toLowerCase());
          i._columnFilters[e] = r;
        }
        i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), A(t, "ln-table:filter", {
          term: i._searchTerm,
          matched: i._filteredData.length,
          total: i._data.length
        });
      }
    }, t.addEventListener("ln-table:set-filter", this._onSetFilter), this._onRequestClearFilters = function() {
      i.isDataDriven ? (i.currentFilters = {}, i.currentSearch = "", A(t, "ln-table:clear-filters", { table: i.name }), i._requestData()) : (i._searchTerm = "", i._columnFilters = {}, i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), i._updateFooter(), A(t, "ln-table:filter", {
        term: "",
        matched: i._filteredData.length,
        total: i._data.length
      }));
    }, t.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectable = t.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._windowed = !1, this._cache = null, this.isDataDriven && t.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(s) {
      const e = s.detail || {};
      if (i._windowed) {
        t.classList.remove("ln-table--loading"), i._cache.ingest(e);
        return;
      }
      i._data = e.data || [], i._lastTotal = e.total != null ? e.total : i._data.length, i._lastFiltered = e.filtered != null ? e.filtered : i._data.length, i.totalCount = i._lastTotal, i.visibleCount = i._lastFiltered, i.isLoaded = !0, t.classList.remove("ln-table--loading"), i._vStart = -1, i._vEnd = -1, i._applyFilterAndSort(), i._render(), i._updateFooter(), A(t, "ln-table:rendered", {
        table: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      });
    }, t.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(s) {
      const e = s.detail && s.detail.loading;
      t.classList.toggle("ln-table--loading", !!e), e && (i.isLoaded = !1);
    }, t.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSort = function(s) {
      s.preventDefault(), i.currentSort = s.detail.direction === "none" ? null : { field: s.detail.field, direction: s.detail.direction }, i._requestData();
    }, t.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(s) {
      if (s.target.closest("[data-ln-table-row-select]") || s.target.closest("[data-ln-table-row-action]") || s.target.closest("a") || s.target.closest("button") || s.ctrlKey || s.metaKey || s.button === 1) return;
      const e = s.target.closest("[data-ln-table-row]");
      if (!e) return;
      const a = e.getAttribute("data-ln-table-row-id"), r = e._lnRecord || {};
      A(t, "ln-table:row-click", {
        table: i.name,
        id: a,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(s) {
      const e = s.target.closest("[data-ln-table-row-action]");
      if (!e) return;
      s.stopPropagation();
      const a = e.closest("[data-ln-table-row]");
      if (!a) return;
      const r = e.getAttribute("data-ln-table-row-action"), _ = a.getAttribute("data-ln-table-row-id"), y = a._lnRecord || {};
      A(t, "ln-table:row-action", {
        table: i.name,
        id: _,
        action: r,
        record: y
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(s) {
      if (!t.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      const e = i.tbody ? Array.from(i.tbody.querySelectorAll("[data-ln-table-row]")) : [];
      if (e.length)
        switch (s.key) {
          case "ArrowDown":
            s.preventDefault(), i._focusedRowIndex = Math.min(i._focusedRowIndex + 1, e.length - 1), i._focusRow(e);
            break;
          case "ArrowUp":
            s.preventDefault(), i._focusedRowIndex = Math.max(i._focusedRowIndex - 1, 0), i._focusRow(e);
            break;
          case "Home":
            s.preventDefault(), i._focusedRowIndex = 0, i._focusRow(e);
            break;
          case "End":
            s.preventDefault(), i._focusedRowIndex = e.length - 1, i._focusRow(e);
            break;
          case "Enter":
            if (i._focusedRowIndex >= 0 && i._focusedRowIndex < e.length) {
              s.preventDefault();
              const a = e[i._focusedRowIndex];
              A(t, "ln-table:row-click", {
                table: i.name,
                id: a.getAttribute("data-ln-table-row-id"),
                record: a._lnRecord || {}
              });
            }
            break;
          case " ":
            if (i._selectable && i._focusedRowIndex >= 0 && i._focusedRowIndex < e.length) {
              s.preventDefault();
              const a = e[i._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              a && (a.checked = !a.checked, a.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : A(t, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      i.tbody.rows.length > 0 && (i._emptyTbodyObserver.disconnect(), i._emptyTbodyObserver = null, i._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(s) {
      s.preventDefault();
      const e = s.detail.direction === "none" ? null : s.detail.direction;
      i._sortCol = e === null ? -1 : s.detail.column, i._sortDir = e, i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), A(t, "ln-table:sorted", {
        column: s.detail.column,
        direction: s.detail.direction,
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, t.addEventListener("ln-sort:change", this._onSort)), this;
  }
  u.prototype._parseRows = function() {
    const t = this.tbody.rows, n = this.ths;
    this._data = [], t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let i = 0; i < t.length; i++) {
      const s = t[i], e = [], a = [], r = [];
      for (let y = 0; y < s.cells.length; y++) {
        const E = s.cells[y], w = E.textContent.trim();
        e[y] = xt(E), a[y] = w.toLowerCase(), y < s.cells.length - 1 && r.push(w.toLowerCase());
      }
      let _ = null;
      if (this.isDataDriven) {
        _ = {};
        const y = s.getAttribute("data-ln-table-row-id");
        y != null && (_.id = y);
        for (let E = 0; E < n.length; E++) {
          const w = n[E].getAttribute("data-ln-table-col");
          if (w) {
            const S = E;
            if (S < s.cells.length) {
              const L = s.cells[S];
              _[w] = xt(L);
            }
          }
        }
      }
      this._data.push({
        values: e,
        rawTexts: a,
        html: s.outerHTML,
        searchText: r.join(" "),
        id: this.isDataDriven && _ ? _.id : void 0,
        ..._
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), A(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, u.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), n = this.currentFilters || {}, i = Object.keys(n).length > 0;
      if (this._filteredData = this._data.filter(function(y) {
        if (t) {
          let E = !1;
          for (const w in y)
            if (y.hasOwnProperty(w) && typeof y[w] == "string" && w !== "html" && w !== "searchText" && y[w].toLowerCase().indexOf(t) !== -1) {
              E = !0;
              break;
            }
          if (!E) return !1;
        }
        if (i)
          for (const E in n) {
            const w = n[E];
            if (w && w.length > 0) {
              const S = y[E], L = S != null ? String(S) : "";
              if (w.indexOf(L) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const s = this.currentSort.field, a = this.currentSort.direction === "desc" ? -1 : 1, r = this._filteredData.map(function(y) {
        return y[s];
      }), _ = Dt(r);
      this._filteredData.sort(function(y, E) {
        return It(y[s], E[s], _, p) * a;
      });
    } else {
      const t = this._searchTerm, n = this._columnFilters, i = Object.keys(n).length > 0, s = this.ths, e = {};
      if (i)
        for (let E = 0; E < s.length; E++) {
          const w = s[E].getAttribute("data-ln-table-filter-col");
          w && (e[w] = E);
        }
      if (!t && !i ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
        if (t && E.searchText.indexOf(t) === -1) return !1;
        if (i)
          for (const w in n) {
            const S = e[w];
            if (S !== void 0 && n[w].indexOf(E.rawTexts[S]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const a = this._sortCol, r = this._sortDir === "desc" ? -1 : 1, _ = this._filteredData.map(function(E) {
        return E.values[a];
      }), y = Dt(_);
      this._filteredData.sort(function(E, w) {
        return It(E.values[a], w.values[a], y, p) * r;
      });
    }
  }, u.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(n) {
      const i = document.createElement("col");
      i.style.width = n.offsetWidth + "px", t.appendChild(i);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, u.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const t = this._lastTotal, n = this.visibleCount;
        if (t === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || n === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const t = this._filteredData.length;
        t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, u.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, n = document.createDocumentFragment();
      for (let i = 0; i < t.length; i++) {
        const s = this._buildRow(t[i]);
        if (!s) break;
        n.appendChild(s);
      }
      this.tbody.textContent = "", this.tbody.appendChild(n), this._selectable && this._updateSelectAll();
    } else {
      const t = [], n = this._filteredData;
      for (let i = 0; i < n.length; i++) t.push(n[i].html);
      this.tbody.innerHTML = t.join(""), this._selectable && this._restoreSelection();
    }
  }, u.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    if (!this._rowHeight)
      if (this._windowed) {
        let i = null;
        const s = this._cache.peek();
        s ? i = this._buildRow(s) : i = this._buildPlaceholderRow(), i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._rowHeight = i.offsetHeight || 40, this.tbody.textContent = "");
      } else if (this.isDataDriven) {
        if (this._data.length > 0) {
          const i = this._buildRow(this._data[0]);
          i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._rowHeight = i.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const i = this.tbody ? this.tbody.rows : [];
        i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = d(this.dom) : this._scrollContainer = null;
    const n = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._windowed ? t._renderWindowed() : t._renderVirtual();
      }));
    }, n.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, u.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, u.prototype._renderVirtual = function() {
    const t = this._filteredData, n = t.length, i = this._rowHeight;
    if (!i || !n) return;
    const s = this.thead ? this.thead.offsetHeight : 0, e = this._scrollContainer;
    let a, r;
    if (e) {
      const L = this.table.getBoundingClientRect(), q = e.getBoundingClientRect(), k = L.top - q.top + e.scrollTop + s;
      a = e.scrollTop - k, r = e.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + s;
      a = window.scrollY - k, r = window.innerHeight;
    }
    let _ = Math.max(0, Math.floor(a / i) - 15);
    _ = Math.min(_, n);
    const y = Math.min(_ + Math.ceil(r / i) + 30, n);
    if (_ === this._vStart && y === this._vEnd) return;
    this._vStart = _, this._vEnd = y;
    const E = this.ths.length || 1, w = _ * i, S = (n - y) * i;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (w > 0) {
        const q = document.createElement("tr");
        q.className = "ln-table__spacer", q.setAttribute("aria-hidden", "true");
        const k = document.createElement("td");
        k.setAttribute("colspan", E), k.style.height = w + "px", q.appendChild(k), L.appendChild(q);
      }
      for (let q = _; q < y; q++) {
        const k = this._buildRow(t[q]);
        k && L.appendChild(k);
      }
      if (S > 0) {
        const q = document.createElement("tr");
        q.className = "ln-table__spacer", q.setAttribute("aria-hidden", "true");
        const k = document.createElement("td");
        k.setAttribute("colspan", E), k.style.height = S + "px", q.appendChild(k), L.appendChild(q);
      }
      this.tbody.textContent = "", this.tbody.appendChild(L), this._selectable && this._updateSelectAll();
    } else {
      let L = "";
      w > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>');
      for (let q = _; q < y; q++) L += t[q].html;
      S > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L, this._selectable && this._restoreSelection();
    }
  }, u.prototype._buildPlaceholderRow = function() {
    const t = document.createElement("tr");
    t.className = "ln-table__placeholder", t.setAttribute("aria-hidden", "true");
    const n = document.createElement("td");
    return n.setAttribute("colspan", this.ths.length || 1), n.style.height = this._rowHeight + "px", t.appendChild(n), t;
  }, u.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const t = this._rowHeight;
    if (!t) return;
    const n = this._cache.logicalTotal, i = this.thead ? this.thead.offsetHeight : 0, s = this._scrollContainer;
    let e, a;
    if (s) {
      const L = this.table.getBoundingClientRect(), q = s.getBoundingClientRect(), k = L.top - q.top + s.scrollTop + i;
      e = s.scrollTop - k, a = s.clientHeight;
    } else {
      const k = this.table.getBoundingClientRect().top + window.scrollY + i;
      e = window.scrollY - k, a = window.innerHeight;
    }
    let r = Math.max(0, Math.floor(e / t) - 15);
    r = Math.min(r, n);
    const _ = Math.min(r + Math.ceil(a / t) + 30, n), y = this.ths.length || 1, E = r * t, w = (n - _) * t, S = document.createDocumentFragment();
    if (E > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const q = document.createElement("td");
      q.setAttribute("colspan", y), q.style.height = E + "px", L.appendChild(q), S.appendChild(L);
    }
    for (let L = r; L < _; L++)
      if (this._cache.has(L)) {
        const q = this._buildRow(this._cache.get(L));
        q && S.appendChild(q);
      } else
        S.appendChild(this._buildPlaceholderRow());
    if (w > 0) {
      const L = document.createElement("tr");
      L.className = "ln-table__spacer", L.setAttribute("aria-hidden", "true");
      const q = document.createElement("td");
      q.setAttribute("colspan", y), q.style.height = w + "px", L.appendChild(q), S.appendChild(L);
    }
    this.tbody.textContent = "", this.tbody.appendChild(S), this._vStart = r, this._vEnd = _, this._cache.ensure(r, _);
  }, u.prototype._showEmptyState = function() {
    const t = this.ths.length || 1;
    this.tbody.textContent = "";
    let n = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount, e = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (s < i || s === 0), a = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (n = ht(this.dom, a, "ln-table"), !n) {
        const r = this.dom.querySelector("template[data-ln-table-empty]");
        if (r) {
          const _ = e ? "search" : "initial", y = r.content.querySelector('[data-ln-table-empty-when="' + _ + '"]') || r.content.firstElementChild;
          y && (n = document.importNode(y, !0));
        }
      }
      if (n)
        if (n.tagName === "TR")
          this.tbody.appendChild(n);
        else {
          const r = document.createElement("td");
          r.setAttribute("colspan", String(t)), r.appendChild(n);
          const _ = document.createElement("tr");
          _.className = "ln-table__empty", _.appendChild(r), this.tbody.appendChild(_);
        }
    } else {
      const i = this.dom.querySelector("template[" + v + "]"), s = document.createElement("td");
      s.setAttribute("colspan", String(t)), i && s.appendChild(document.importNode(i.content, !0));
      const e = document.createElement("tr");
      e.className = "ln-table__empty", e.appendChild(s), this.tbody.appendChild(e);
    }
    A(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, u.prototype._fillRow = function(t, n) {
    Ct(t, n);
    const i = t.querySelectorAll("[data-ln-table-cell-attr]");
    for (let s = 0; s < i.length; s++) {
      const e = i[s], a = e.getAttribute("data-ln-table-cell-attr").split(",");
      for (let r = 0; r < a.length; r++) {
        const _ = a[r].trim().split(":");
        if (_.length !== 2) continue;
        const y = _[0].trim(), E = _[1].trim();
        n[y] != null && e.setAttribute(E, n[y]);
      }
    }
  }, u.prototype._buildRow = function(t) {
    const n = ht(this.dom, this.name + "-row", "ln-table");
    if (!n) return null;
    const i = n.querySelector("[data-ln-table-row]") || n.firstElementChild;
    if (!i) return null;
    if (this._fillRow(i, t), i._lnRecord = t, t.id != null && i.setAttribute("data-ln-table-row-id", t.id), this._selectable && t.id != null && this.selectedIds.has(String(t.id))) {
      i.classList.add("ln-row-selected");
      const s = i.querySelector("[data-ln-table-row-select]");
      s && (s.checked = !0);
    }
    return i;
  }, u.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    oe(this, "ln-table:request-data", "table");
  }, u.prototype._enterWindowedMode = function() {
    const t = this, n = this.dom, i = parseInt(n.getAttribute("data-ln-table-window"), 10), s = parseInt(n.getAttribute("data-ln-table-window-page"), 10), e = parseInt(n.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !t._windowed || !t._cache || (t.totalCount = t._cache.grandTotal, t.visibleCount = t._cache.logicalTotal, t._lastTotal = t._cache.grandTotal, t.isLoaded = !0, t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), A(n, "ln-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      }));
    }, this._renderBatch = Qt(this._onCacheChange), this._cache = fe({
      windowSize: i > 0 ? i : 1e3,
      pageSize: s > 0 ? s : 200,
      threshold: e >= 0 ? e : 25,
      fetchDebounce: 120,
      requestPage: function(a, r, _) {
        A(n, "ln-table:request-data", {
          table: t.name,
          sort: a.sort,
          filters: a.filters,
          search: a.search,
          offset: r,
          limit: _,
          queryGen: t._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, u.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let t = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(t) && this._totalSpan) {
        const i = this._totalSpan.textContent.replace(/[^\d]/g, "");
        i && (t = parseInt(i, 10));
      }
      const n = t > 0 ? t : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: n,
        filtered: n
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, u.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, u.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const t = this.tbody.querySelectorAll("[data-ln-table-row]");
    let n = t.length > 0;
    for (let i = 0; i < t.length; i++) {
      const s = t[i].getAttribute("data-ln-table-row-id");
      if (s != null && !this.selectedIds.has(s)) {
        n = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = n;
  }, u.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const t = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let n = 0; n < t.length; n++) {
      const i = t[n].getAttribute("data-ln-table-row-id"), s = i != null && this.selectedIds.has(i);
      t[n].classList.toggle("ln-row-selected", s);
      const e = t[n].querySelector("[data-ln-table-row-select]");
      e && (e.checked = s);
    }
    this._updateSelectAll();
  }, Object.defineProperty(u.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), u.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    if (this._onSelectionChange = function(n) {
      const i = n.target.closest("[data-ln-table-row-select]");
      if (!i) return;
      const s = i.closest("[data-ln-table-row]");
      if (!s) return;
      const e = s.getAttribute("data-ln-table-row-id");
      e != null && (i.checked ? (t.selectedIds.add(e), s.classList.add("ln-row-selected")) : (t.selectedIds.delete(e), s.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), A(t.dom, "ln-table:select", {
        table: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const n = document.createElement("input");
      n.type = "checkbox";
      const i = t.dom.querySelector('[data-ln-table-dict="select-all"]'), s = t.dom.getAttribute("data-ln-table-select-all-label") || (i ? i.textContent.trim() : null) || "Select all";
      n.setAttribute("aria-label", s), this._selectAllCheckbox.appendChild(n), this._selectAllCheckbox = n;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const n = t._selectAllCheckbox.checked, i = t.tbody ? t.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let s = 0; s < i.length; s++) {
        const e = i[s].getAttribute("data-ln-table-row-id"), a = i[s].querySelector("[data-ln-table-row-select]");
        e != null && (n ? (t.selectedIds.add(e), i[s].classList.add("ln-row-selected")) : (t.selectedIds.delete(e), i[s].classList.remove("ln-row-selected")), a && (a.checked = n));
      }
      t.selectedCount = t.selectedIds.size, A(t.dom, "ln-table:select-all", {
        table: t.name,
        selected: n
      }), A(t.dom, "ln-table:select", {
        table: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedCount
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const n = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let i = 0; i < n.length; i++) {
        const s = n[i].querySelector("[data-ln-table-row-select]"), e = n[i].getAttribute("data-ln-table-row-id");
        s && s.checked && e != null && (this.selectedIds.add(e), n[i].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, u.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const t = this.dom.querySelector("[data-ln-table-col-select]");
    if (t) {
      const n = t.querySelector('input[type="checkbox"]');
      n && n.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const n = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let i = 0; i < n.length; i++) {
        n[i].classList.remove("ln-row-selected");
        const s = n[i].querySelector("[data-ln-table-row-select]");
        s && (s.checked = !1);
      }
    }
    this._updateFooter();
  }, u.prototype._updateFooter = function() {
    let t = 0, n = 0;
    this.isDataDriven ? (t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount) : (t = this._data.length, n = this._filteredData.length);
    const i = n < t;
    if (this._totalSpan && (this._totalSpan.textContent = o(t, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = i ? o(n, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const s = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = s > 0 ? o(s, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
    }
  }, u.prototype._focusRow = function(t) {
    for (let n = 0; n < t.length; n++)
      t[n].classList.remove("ln-row-focused"), t[n].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < t.length) {
      const n = t[this._focusedRowIndex];
      n.classList.add("ln-row-focused"), n.setAttribute("tabindex", "0"), n.focus(), n.scrollIntoView({ block: "nearest" });
    }
  }, u.prototype.destroy = function() {
    this.dom[l] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:set-filter", this._onSetFilter), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-sort:change", this._onSort), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[l]);
  }, H(f, l, u, "ln-table", {
    extraAttributes: [
      "data-ln-table-window",
      "data-ln-table-window-page",
      "data-ln-table-window-threshold",
      "data-ln-table-count"
    ],
    onAttributeChange: function(t, n) {
      const i = t[l];
      if (!(!i || !i.isDataDriven)) {
        if (n === "data-ln-table-window") {
          const s = t.hasAttribute("data-ln-table-window");
          if (s && !i._windowed)
            i._enterWindowedMode(), i._kickWindowInitial();
          else if (!s && i._windowed)
            i._exitWindowedMode();
          else if (s && i._windowed) {
            const e = parseInt(t.getAttribute("data-ln-table-window"), 10);
            e > 0 && i._cache.configure({ windowSize: e });
          }
          return;
        }
        if (!(!i._windowed || !i._cache)) {
          if (n === "data-ln-table-window-page") {
            const s = parseInt(t.getAttribute("data-ln-table-window-page"), 10);
            s > 0 && i._cache.configure({ pageSize: s });
          } else if (n === "data-ln-table-window-threshold") {
            const s = parseInt(t.getAttribute("data-ln-table-window-threshold"), 10);
            s >= 0 && i._cache.configure({ threshold: s });
          } else if (n === "data-ln-table-count") {
            const s = parseInt(t.getAttribute("data-ln-table-count"), 10);
            s >= 0 && i._cache.setGrandTotal(s);
          }
        }
      }
    }
  });
})();
(function() {
  const f = "data-ln-table-coordinator", l = "lnTableCoordinator";
  if (window[l] !== void 0) return;
  function v(g, m) {
    if (m) {
      const h = document.getElementById(m);
      if (h && h.hasAttribute("data-ln-table")) return h;
    }
    if (g) {
      const h = g.getAttribute("data-ln-search") || g.getAttribute("data-ln-filter");
      if (h) {
        const o = document.getElementById(h) || document.querySelector('[data-ln-table="' + h + '"]');
        if (o) return o;
      }
      const c = g.closest("[" + f + "]");
      if (c) {
        const o = c.querySelector("[data-ln-table]");
        if (o) return o;
      }
      const p = g.closest("[data-ln-table]");
      if (p) return p;
    }
    return document.querySelector("[data-ln-table]");
  }
  document.addEventListener("ln-search:change", function(g) {
    const m = g.detail && g.detail.term != null ? g.detail.term : "", h = g.target, c = h.getAttribute ? h.getAttribute("data-ln-search") : null, p = v(h, c);
    if (!p || !p.lnTable) return;
    g.preventDefault();
    const o = h.tagName === "INPUT" || h.tagName === "TEXTAREA" ? h : h.querySelector ? h.querySelector('input[type="search"], input[type="text"], input') : null;
    o && o.value !== m && (o.value = m), A(p, "ln-table:set-search", {
      query: m,
      term: m,
      table: p.lnTable.name || p.id
    });
  }), document.addEventListener("ln-filter:changed", function(g) {
    if (!g.detail) return;
    const m = g.detail.key, h = g.detail.values || [], c = g.target;
    if (!c.hasAttribute || !c.hasAttribute("data-ln-filter")) return;
    const p = c.getAttribute ? c.getAttribute("data-ln-filter") : null, o = v(c, p);
    if (!o || !o.lnTable) return;
    const d = o.querySelectorAll("th");
    for (let u = 0; u < d.length; u++)
      if (d[u].getAttribute("data-ln-table-filter-col") === m) {
        const t = d[u].querySelector("[data-ln-table-col-filter]");
        t && t.classList.toggle("ln-filter-active", h.length > 0);
        break;
      }
    A(o, "ln-table:set-filter", {
      key: m,
      values: h,
      table: o.lnTable.name || o.id
    });
  }), document.addEventListener("click", function(g) {
    const m = g.target.closest("[data-ln-table-clear-all], [data-ln-table-clear]");
    if (!m) return;
    const h = v(m);
    if (!h || !h.lnTable) return;
    const c = h.querySelectorAll("th");
    for (let n = 0; n < c.length; n++) {
      const i = c[n].querySelector("[data-ln-table-col-filter]");
      i && i.classList.remove("ln-filter-active");
    }
    const o = m.closest("[" + f + "]") || document, d = h.id, u = d && o.querySelector('[data-ln-search="' + d + '"]') || o.querySelector("[data-ln-search]");
    if (u) {
      const n = u.tagName === "INPUT" || u.tagName === "TEXTAREA" ? u : u.querySelector("input");
      n && (n.value = "");
    }
    const t = d && o.querySelectorAll('[data-ln-filter="' + d + '"]') || o.querySelectorAll("[data-ln-filter]");
    for (let n = 0; n < t.length; n++) {
      const i = t[n].querySelector("[data-ln-filter-reset]");
      i && (i.checked = !0, i.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    A(h, "ln-table:request-clear-filters", {
      table: h.lnTable.name || h.id
    });
  }), document.addEventListener("keydown", function(g) {
    if (g.key !== "/" || g.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
    const m = document.querySelector("[" + f + "] [data-ln-search]") || document.querySelector("[data-ln-search]");
    if (!m) return;
    const h = m.tagName === "INPUT" || m.tagName === "TEXTAREA" ? m : m.querySelector('input[type="search"], input[type="text"], input');
    h && (g.preventDefault(), h.focus());
  });
  function b(g) {
    return this.dom = g, this;
  }
  b.prototype.destroy = function() {
    this.dom[l] && delete this.dom[l];
  }, H(f, l, b, "ln-table-coordinator");
})();
(function() {
  const f = "data-ln-list", l = "lnList", v = "data-ln-list-empty";
  if (window[l] !== void 0) return;
  function p(t, n) {
    if (t == null || isNaN(t)) return "";
    try {
      return new Intl.NumberFormat(V(n)).format(t);
    } catch {
      return String(t);
    }
  }
  function o(t) {
    let n = t;
    for (; n && n !== document.body && n !== document.documentElement; ) {
      const s = getComputedStyle(n).overflowY;
      if (s === "auto" || s === "scroll") return n;
      n = n.parentElement;
    }
    return null;
  }
  function d(t) {
    if (!t) return 0;
    const n = getComputedStyle(t), i = parseFloat(n.marginTop) || 0, s = parseFloat(n.marginBottom) || 0;
    return t.offsetHeight + i + s;
  }
  function u(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(f) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== t ? this._filteredSpan.parentElement : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== t ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const n = this;
    return this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._windowed = !1, this._cache = null, this.isDataDriven && t.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._lastTotal = 0, this._lastFiltered = 0, this._onSetData = function(i) {
      const s = i.detail || {};
      if (n._windowed) {
        t.classList.remove("ln-list--loading"), n._cache.ingest(s);
        return;
      }
      n._data = s.data || [], n._lastTotal = s.total != null ? s.total : n._data.length, n._lastFiltered = s.filtered != null ? s.filtered : n._data.length, n.totalCount = n._lastTotal, n.visibleCount = n._lastFiltered, n.isLoaded = !0, t.classList.remove("ln-list--loading"), n._vStart = -1, n._vEnd = -1, n._applyFilterAndSort(), n._render(), n._updateFooter(), A(t, "ln-list:rendered", {
        list: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(i) {
      const s = i.detail && i.detail.loading;
      t.classList.toggle("ln-list--loading", !!s), s && (n.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(i) {
      i.target.closest("[data-ln-list-clear-all]") && (n.currentFilters = {}, A(t, "ln-list:clear-filters", { list: n.name }), n._requestData());
    }, t.addEventListener("click", this._onClearAll), this._onSort = function(i) {
      i.detail.field != null && (i.preventDefault(), n.currentSort = i.detail.direction === "none" ? null : { field: i.detail.field, direction: i.detail.direction }, n._windowed ? n._requestData() : (n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render()));
    }, t.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onItemClick = function(i) {
      if (i.target.closest("[data-ln-item-select]") || i.target.closest("[data-ln-item-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const s = i.target.closest("[data-ln-item]");
      if (!s) return;
      const e = s.getAttribute("data-ln-item-id"), a = s._lnRecord || {};
      A(t, "ln-list:item-click", {
        list: n.name,
        id: e,
        record: a
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(i) {
      const s = i.target.closest("[data-ln-item-action]");
      if (!s) return;
      i.stopPropagation();
      const e = s.closest("[data-ln-item]");
      if (!e) return;
      const a = s.getAttribute("data-ln-item-action"), r = e.getAttribute("data-ln-item-id"), _ = e._lnRecord || {};
      A(t, "ln-list:item-action", {
        list: n.name,
        id: r,
        action: a,
        record: _
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(i) {
      i.preventDefault(), n.currentSearch = i.detail && i.detail.term || "", A(t, "ln-list:search", {
        list: n.name,
        query: n.currentSearch
      }), n._requestData();
    }, t.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : A(t, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      n.tbody.children.length > 0 && (n._emptyObserver.disconnect(), n._emptyObserver = null, n._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(i) {
      i.preventDefault(), n._searchTerm = i.detail && i.detail.term || "", n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), A(t, "ln-list:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch)), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-list-clear]") || G(t, "ln-list:before-clear-search", { list: n.name }).defaultPrevented) return;
      n.isDataDriven ? n.currentSearch = "" : n._searchTerm = "";
      const a = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (a) {
        const r = a.tagName === "INPUT" ? a : a.querySelector("input");
        r && (r.value = "", r.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
      n.isDataDriven ? (A(t, "ln-list:search", {
        list: n.name,
        query: ""
      }), n._requestData()) : (n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), A(t, "ln-list:filter", {
        term: "",
        matched: n._filteredData.length,
        total: n._data.length
      }));
    }, t.addEventListener("click", this._onClear), this;
  }
  u.prototype._parseChildren = function() {
    const t = Array.from(this.tbody.children).filter((n) => !n.classList.contains("ln-list__spacer"));
    this._data = [], t.length > 0 && (this._itemHeight = d(t[0]) || 50);
    for (let n = 0; n < t.length; n++) {
      const i = t[n], s = i.getAttribute("data-ln-item-id") || i.getAttribute("id"), e = i.textContent.trim().toLowerCase();
      let a = null;
      if (this.isDataDriven) {
        a = {}, s != null && (a.id = s);
        const r = i.querySelectorAll("[data-ln-list-field]");
        for (let _ = 0; _ < r.length; _++) {
          const y = r[_], E = y.getAttribute("data-ln-list-field");
          E && (a[E] = y.textContent.trim());
        }
      }
      this._data.push({
        html: i.outerHTML,
        searchText: e,
        id: s,
        ...a
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), A(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, u.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), n = this.currentFilters || {}, i = Object.keys(n).length > 0;
      if (this._filteredData = this._data.filter(function(y) {
        if (t) {
          let E = !1;
          for (const w in y)
            if (y.hasOwnProperty(w) && typeof y[w] == "string" && w !== "html" && w !== "searchText" && y[w].toLowerCase().indexOf(t) !== -1) {
              E = !0;
              break;
            }
          if (!E) return !1;
        }
        if (i)
          for (const E in n) {
            const w = n[E];
            if (w && w.length > 0) {
              const S = y[E], L = S != null ? String(S) : "";
              if (w.indexOf(L) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const s = this.currentSort.field, e = this.currentSort.direction === "desc" ? -1 : 1, a = this._filteredData.map(function(y) {
        return y[s];
      }), r = Dt(a), _ = typeof Intl < "u" ? new Intl.Collator(V(this.dom), { sensitivity: "base" }) : null;
      this._filteredData.sort(function(y, E) {
        return It(y[s], E[s], r, _) * e;
      });
    } else {
      const t = this._searchTerm;
      t ? this._filteredData = this._data.filter(function(n) {
        return n.searchText.indexOf(t) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, u.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const t = this._lastTotal, n = this.visibleCount;
        if (t === 0 || this._filteredData.length === 0 || n === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const t = this._filteredData.length;
        t === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, u.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, n = document.createDocumentFragment();
      for (let i = 0; i < t.length; i++) {
        const s = this._buildItem(t[i]);
        if (!s) break;
        n.appendChild(s);
      }
      this.tbody.textContent = "", this.tbody.appendChild(n), this._selectable && this._updateSelectAll();
    } else {
      const t = [], n = this._filteredData;
      for (let i = 0; i < n.length; i++) t.push(n[i].html);
      this.tbody.innerHTML = t.join(""), this._selectable && this._restoreSelection();
    }
  }, u.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), n = t.gridTemplateColumns;
    let i = 1;
    if (n && n !== "none") {
      const e = n.trim().split(/\s+/).filter(Boolean);
      e.length > 0 && (i = e.length);
    }
    const s = parseFloat(t.rowGap);
    return { columns: i, rowGap: isNaN(s) ? 0 : s };
  }, u.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const t = this._cache.peek(), n = t ? this._buildItem(t) : this._buildPlaceholderItem();
      n && (this.tbody.textContent = "", this.tbody.appendChild(n), this._itemHeight = d(n) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const t = this._buildItem(this._data[0]);
        t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._itemHeight = d(t) || 50, this.tbody.textContent = "");
      }
    } else {
      const t = this.tbody.children;
      t.length > 0 && (this._itemHeight = d(t[0]) || 50);
    }
  }, u.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = o(this.dom);
    const n = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._windowed ? t._renderWindowed() : t._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      t._itemHeight = 0, t._measureItemHeight(), t._vStart = -1, t._vEnd = -1, t._windowed ? t._renderWindowed() : t._renderVirtual();
    }, n.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, u.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, u.prototype._renderVirtual = function() {
    const t = this._filteredData, n = t.length, i = this._itemHeight;
    if (!i || !n) return;
    const s = this._scrollContainer;
    let e, a;
    if (s) {
      const O = this.tbody.getBoundingClientRect(), F = s.getBoundingClientRect(), U = s === this.tbody ? 0 : O.top - F.top + s.scrollTop;
      e = s.scrollTop - U, a = s.clientHeight;
    } else {
      const F = this.tbody.getBoundingClientRect().top + window.scrollY;
      e = window.scrollY - F, a = window.innerHeight;
    }
    const r = this._readGridLayout(), _ = r.columns, y = r.rowGap, E = i + y, w = Math.ceil(n / _);
    let S = Math.max(0, Math.floor(e / E) - 15);
    S = Math.min(S, w);
    const L = Math.ceil(a / E) + 30, q = Math.min(S + L, w), k = Math.min(S * _, n), R = Math.min(q * _, n);
    if (k === this._vStart && R === this._vEnd) return;
    this._vStart = k, this._vEnd = R;
    const x = S * E, N = (w - q) * E;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (x > 0) {
        const F = document.createElement(this.isUl ? "li" : "div");
        F.className = "ln-list__spacer", F.style.height = x + "px", O.appendChild(F);
      }
      for (let F = k; F < R; F++) {
        const U = this._buildItem(t[F]);
        U && O.appendChild(U);
      }
      if (N > 0) {
        const F = document.createElement(this.isUl ? "li" : "div");
        F.className = "ln-list__spacer", F.style.height = N + "px", O.appendChild(F);
      }
      this.tbody.textContent = "", this.tbody.appendChild(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      x > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${x}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let F = k; F < R; F++)
        O += t[F].html;
      N > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${N}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = O, this._selectable && this._restoreSelection();
    }
  }, u.prototype._buildPlaceholderItem = function() {
    const t = document.createElement(this.isUl ? "li" : "div");
    return t.className = "ln-list__placeholder", t.setAttribute("aria-hidden", "true"), t.style.height = this._itemHeight + "px", t;
  }, u.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const t = this._itemHeight;
    if (!t) return;
    const n = this._scrollContainer;
    let i, s;
    if (n) {
      const O = this.tbody.getBoundingClientRect(), F = n.getBoundingClientRect(), U = n === this.tbody ? 0 : O.top - F.top + n.scrollTop;
      i = n.scrollTop - U, s = n.clientHeight;
    } else {
      const F = this.tbody.getBoundingClientRect().top + window.scrollY;
      i = window.scrollY - F, s = window.innerHeight;
    }
    const e = this._readGridLayout(), a = e.columns, r = e.rowGap, _ = t + r, y = this._cache.logicalTotal, E = Math.ceil(y / a);
    let w = Math.max(0, Math.floor(i / _) - 15);
    w = Math.min(w, E);
    const S = Math.ceil(s / _) + 30, L = Math.min(w + S, E), q = Math.min(w * a, y), k = Math.min(L * a, y), R = w * _, x = (E - L) * _, N = document.createDocumentFragment();
    if (R > 0) {
      const O = document.createElement(this.isUl ? "li" : "div");
      O.className = "ln-list__spacer", O.style.height = R + "px", N.appendChild(O);
    }
    for (let O = q; O < k; O++)
      if (this._cache.has(O)) {
        const F = this._buildItem(this._cache.get(O));
        F && N.appendChild(F);
      } else
        N.appendChild(this._buildPlaceholderItem());
    if (x > 0) {
      const O = document.createElement(this.isUl ? "li" : "div");
      O.className = "ln-list__spacer", O.style.height = x + "px", N.appendChild(O);
    }
    this.tbody.textContent = "", this.tbody.appendChild(N), this._vStart = q, this._vEnd = k, this._cache.ensure(q, k);
  }, u.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const n = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount, s = this.currentSearch && (i < n || i === 0), e = s ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = ht(this.dom, e, "ln-list"), !t) {
        const a = this.dom.querySelector("template[data-ln-empty]");
        if (a) {
          const r = s ? "search" : "initial", _ = a.content.querySelector(`[data-ln-empty-when="${r}"]`) || a.content.firstElementChild;
          _ && (t = document.importNode(_, !0));
        }
      }
    } else {
      const n = this.dom.querySelector(`template[${v}]`);
      n && (t = document.importNode(n.content, !0));
    }
    if (t)
      if (t.tagName === "LI" || t.tagName === "TR")
        this.tbody.appendChild(t);
      else {
        const n = document.createElement(this.isUl ? "li" : "div");
        n.appendChild(t), this.tbody.appendChild(n);
      }
    A(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, u.prototype._buildItem = function(t) {
    const n = ht(this.dom, this.name + "-row", "ln-list");
    if (!n) return null;
    const i = n.querySelector("[data-ln-item]") || n.firstElementChild;
    if (!i) return null;
    if (Ct(i, t), et(i, t), i._lnRecord = t, t.id != null && (i.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      i.classList.add("ln-item-selected");
      const s = i.querySelector("[data-ln-item-select]");
      s && (s.checked = !0);
    }
    return i;
  }, u.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(n) {
      const i = n.target.closest("[data-ln-item-select]");
      if (!i) return;
      const s = i.closest("[data-ln-item]");
      if (!s) return;
      const e = s.getAttribute("data-ln-item-id");
      e != null && (i.checked ? (t.selectedIds.add(String(e)), s.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(e)), s.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), A(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const n = t._selectAllCheckbox.checked, i = t.tbody.querySelectorAll("[data-ln-item]");
      for (let s = 0; s < i.length; s++) {
        const e = i[s], a = e.getAttribute("data-ln-item-id"), r = e.querySelector("[data-ln-item-select]");
        a != null && (n ? (t.selectedIds.add(String(a)), e.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(a)), e.classList.remove("ln-item-selected")), r && (r.checked = n));
      }
      A(t.dom, "ln-list:select-all", { list: t.name, selected: n }), A(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, u.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    let n = t.length > 0;
    for (let i = 0; i < t.length; i++) {
      const s = t[i].getAttribute("data-ln-item-id");
      if (s != null && !this.selectedIds.has(String(s))) {
        n = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = n;
  }, u.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    for (let n = 0; n < t.length; n++) {
      const i = t[n].getAttribute("data-ln-item-id"), s = i != null && this.selectedIds.has(String(i));
      t[n].classList.toggle("ln-item-selected", s);
      const e = t[n].querySelector("[data-ln-item-select]");
      e && (e.checked = s);
    }
    this._updateSelectAll();
  }, u.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    oe(this, "ln-list:request-data", "list");
  }, u.prototype._enterWindowedMode = function() {
    const t = this, n = this.dom, i = parseInt(n.getAttribute("data-ln-list-window"), 10), s = parseInt(n.getAttribute("data-ln-list-window-page"), 10), e = parseInt(n.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !t._windowed || !t._cache || (t.totalCount = t._cache.grandTotal, t.visibleCount = t._cache.logicalTotal, t._lastTotal = t._cache.grandTotal, t.isLoaded = !0, t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), A(n, "ln-list:rendered", {
        list: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      }));
    }, this._renderBatch = Qt(this._onCacheChange), this._cache = fe({
      windowSize: i > 0 ? i : 1e3,
      pageSize: s > 0 ? s : 200,
      threshold: e >= 0 ? e : 25,
      fetchDebounce: 120,
      requestPage: function(a, r, _) {
        A(n, "ln-list:request-data", {
          list: t.name,
          sort: a.sort,
          filters: a.filters,
          search: a.search,
          offset: r,
          limit: _,
          queryGen: t._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, u.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const t = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), n = t > 0 ? t : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: n,
        filtered: n
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, u.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, u.prototype._updateFooter = function() {
    let t = 0, n = 0;
    this.isDataDriven ? (t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount) : (t = this._data.length, n = this._filteredData.length);
    const i = n < t;
    if (this._totalSpan && (this._totalSpan.textContent = p(t, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = i ? p(n, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const s = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = s > 0 ? p(s, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
    }
  }, u.prototype.destroy = function() {
    this.dom[l] && (this._disableVirtualScroll(), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._onClear && this.dom.removeEventListener("click", this._onClear), this._data = [], this._filteredData = [], delete this.dom[l]);
  }, H(f, l, u, "ln-list", {
    extraAttributes: [
      "data-ln-list-window",
      "data-ln-list-window-page",
      "data-ln-list-window-threshold",
      "data-ln-list-count"
    ],
    onAttributeChange: function(t, n) {
      const i = t[l];
      if (!(!i || !i.isDataDriven)) {
        if (n === "data-ln-list-window") {
          const s = t.hasAttribute("data-ln-list-window");
          if (s && !i._windowed)
            i._enterWindowedMode(), i._kickWindowInitial();
          else if (!s && i._windowed)
            i._exitWindowedMode();
          else if (s && i._windowed) {
            const e = parseInt(t.getAttribute("data-ln-list-window"), 10);
            e > 0 && i._cache.configure({ windowSize: e });
          }
          return;
        }
        if (!(!i._windowed || !i._cache)) {
          if (n === "data-ln-list-window-page") {
            const s = parseInt(t.getAttribute("data-ln-list-window-page"), 10);
            s > 0 && i._cache.configure({ pageSize: s });
          } else if (n === "data-ln-list-window-threshold") {
            const s = parseInt(t.getAttribute("data-ln-list-window-threshold"), 10);
            s >= 0 && i._cache.configure({ threshold: s });
          } else if (n === "data-ln-list-count") {
            const s = parseInt(t.getAttribute("data-ln-list-count"), 10);
            s >= 0 && i._cache.setGrandTotal(s);
          }
        }
      }
    }
  });
})();
(function() {
  const f = "data-ln-circular-progress", l = "lnCircularProgress";
  if (window[l] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", b = 36, g = 16, m = 2 * Math.PI * g;
  function h(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, p.call(this), d.call(this), o.call(this), this;
  }
  h.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[l]);
  };
  function c(u, t) {
    const n = document.createElementNS(v, u);
    for (const i in t)
      n.setAttribute(i, t[i]);
    return n;
  }
  function p() {
    this.svg = c("svg", {
      viewBox: "0 0 " + b + " " + b,
      "aria-hidden": "true"
    }), this.trackCircle = c("circle", {
      cx: b / 2,
      cy: b / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = c("circle", {
      cx: b / 2,
      cy: b / 2,
      r: g,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + b / 2 + " " + b / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const u = this, t = new MutationObserver(function(n) {
      for (const i of n)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max" || i.attributeName === "data-ln-circular-progress-label") && d.call(u);
    });
    t.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = t;
  }
  function d() {
    const u = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, t = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let n = t > 0 ? u / t * 100 : 0;
    n < 0 && (n = 0), n > 100 && (n = 100);
    const i = m - n / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const s = this.dom.getAttribute("data-ln-circular-progress-label"), e = s !== null ? s : Math.round(n) + "%";
    this.labelEl.textContent = e, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(t));
    const a = Math.max(0, Math.min(u, t));
    this.dom.setAttribute("aria-valuenow", String(a)), this.dom.setAttribute("aria-valuetext", e), A(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: u,
      max: t,
      percentage: n
    });
  }
  H(f, l, h, "ln-circular-progress");
})();
(function() {
  const f = "data-ln-sortable", l = "lnSortable", v = "data-ln-sortable-handle";
  if (window[l] !== void 0) return;
  function b(m) {
    this.dom = m, this.isEnabled = m.getAttribute(f) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const h = this;
    return this._onPointerDown = function(c) {
      h.isEnabled && h._handlePointerDown(c);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  b.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(f, "");
  }, b.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(f, "disabled");
  }, b.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), A(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[l]);
  }, b.prototype._handlePointerDown = function(m) {
    let h = m.target.closest("[" + v + "]"), c;
    if (h) {
      for (c = h; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (c = m.target; c && c.parentElement !== this.dom; )
        c = c.parentElement;
      if (!c || c.parentElement !== this.dom) return;
      h = c;
    }
    const o = Array.from(this.dom.children).indexOf(c);
    if (G(this.dom, "ln-sortable:before-drag", {
      item: c,
      index: o
    }).defaultPrevented) return;
    m.preventDefault(), h.setPointerCapture(m.pointerId), this._dragging = c, c.classList.add("ln-sortable--dragging"), c.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), A(this.dom, "ln-sortable:drag-start", {
      item: c,
      index: o
    });
    const u = this, t = function(i) {
      u._handlePointerMove(i);
    }, n = function(i) {
      u._handlePointerEnd(i), h.removeEventListener("pointermove", t), h.removeEventListener("pointerup", n), h.removeEventListener("pointercancel", n);
    };
    h.addEventListener("pointermove", t), h.addEventListener("pointerup", n), h.addEventListener("pointercancel", n);
  }, b.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const h = Array.from(this.dom.children), c = this._dragging;
    for (const p of h)
      p.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const p of h) {
      if (p === c) continue;
      const o = p.getBoundingClientRect(), d = o.top + o.height / 2;
      if (m.clientY >= o.top && m.clientY < d) {
        p.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= d && m.clientY <= o.bottom) {
        p.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, b.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const h = this._dragging, c = Array.from(this.dom.children), p = c.indexOf(h);
    let o = null, d = null;
    for (const u of c) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        o = u, d = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        o = u, d = "after";
        break;
      }
    }
    for (const u of c)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (h.classList.remove("ln-sortable--dragging"), h.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== h) {
      d === "before" ? this.dom.insertBefore(h, o) : this.dom.insertBefore(h, o.nextElementSibling);
      const t = Array.from(this.dom.children).indexOf(h);
      A(this.dom, "ln-sortable:reordered", {
        item: h,
        oldIndex: p,
        newIndex: t
      });
    }
    this._dragging = null;
  };
  function g(m) {
    const h = m[l];
    if (!h) return;
    const c = m.getAttribute(f) !== "disabled";
    c !== h.isEnabled && (h.isEnabled = c, A(m, c ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  H(f, l, b, "ln-sortable", {
    onAttributeChange: g
  });
})();
(function() {
  const f = "data-ln-confirm", l = "lnConfirm", v = "data-ln-confirm-timeout";
  if (window[l] !== void 0) return;
  function g(...h) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...h);
  }
  function m(h) {
    g("constructor called on", h), this.dom = h, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = h.querySelector("[data-ln-confirm-idle]"), this.activeEl = h.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = h.textContent.trim(), this.confirmText = h.getAttribute(f) || "Confirm?");
    const c = this;
    return this._onClick = function(p) {
      if (g("click handler, confirming:", c.confirming, "submitted:", c._submitted, "target:", p.target), !c.confirming)
        p.preventDefault(), p.stopImmediatePropagation(), c._enterConfirm();
      else {
        if (c._submitted) return;
        c._submitted = !0, c._reset();
      }
    }, h.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const h = parseFloat(this.dom.getAttribute(v));
    return isNaN(h) || h <= 0 ? 3 : h;
  }, m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const c = this.activeEl ? this.activeEl.textContent.trim() : "";
      c && (this.dom.setAttribute("aria-label", c), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = h.getAttribute("href"), h.setAttribute("href", "#ln-icon-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), A(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const h = this, c = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      h._reset();
    }, c);
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
    g("destroy called on", this.dom), this.dom[l] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[l]);
  }, H(f, l, m, "ln-confirm");
})();
(function() {
  const f = "data-ln-translations", l = "lnTranslations";
  if (window[l] !== void 0) return;
  const v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function b(g) {
    this.dom = g, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = g.getAttribute(f + "-default") || "", this.placeholderLabel = g.getAttribute(f + "-placeholder") || "{lang} translation", this.removeLabel = g.getAttribute(f + "-remove-label") || "Remove {lang}", this.badgesEl = g.querySelector("[" + f + "-active]"), this.menuEl = g.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = g.getAttribute(f + "-locales");
    if (this.locales = v, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const h = this;
    return this._onRequestAdd = function(c) {
      c.detail && c.detail.lang && h.addLanguage(c.detail.lang);
    }, this._onRequestRemove = function(c) {
      c.detail && c.detail.lang && h.removeLanguage(c.detail.lang);
    }, g.addEventListener("ln-translations:request-add", this._onRequestAdd), g.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  b.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const g = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of g) {
      const h = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const c of h)
        c.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, b.prototype._detectExisting = function() {
    const g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of g) {
      const h = m.getAttribute("data-ln-translatable-lang");
      h && h !== this.defaultLang && this.activeLanguages.add(h);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, b.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const g = this;
    let m = 0;
    for (const c in this.locales) {
      if (!this.locales.hasOwnProperty(c) || this.activeLanguages.has(c)) continue;
      m++;
      const p = kt("ln-translations-menu-item", "ln-translations");
      if (!p) return;
      const o = p.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", c), o.textContent = this.locales[c], o.addEventListener("click", function(d) {
        d.ctrlKey || d.metaKey || d.button === 1 || (d.preventDefault(), d.stopPropagation(), g.menuEl.getAttribute("data-ln-toggle") === "open" && g.menuEl.setAttribute("data-ln-toggle", "close"), g.addLanguage(c));
      }), this.menuEl.appendChild(p);
    }
    const h = this.dom.querySelector("[" + f + "-add]");
    h && (h.hidden = m === 0);
  }, b.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const g = this;
    this.activeLanguages.forEach(function(m) {
      const h = kt("ln-translations-badge", "ln-translations");
      if (!h) return;
      const c = h.querySelector("[data-ln-translations-lang]");
      c.setAttribute("data-ln-translations-lang", m);
      const p = c.querySelector("span");
      p.textContent = g.locales[m] || m.toUpperCase();
      const o = c.querySelector("button"), d = g.locales[m] || m.toUpperCase();
      o.setAttribute("aria-label", g.removeLabel.replace("{lang}", d)), o.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), g.removeLanguage(m));
      }), g.badgesEl.appendChild(h);
    });
  }, b.prototype.addLanguage = function(g, m) {
    if (this.activeLanguages.has(g)) return;
    const h = this.locales[g] || g;
    if (G(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: g,
      langName: h
    }).defaultPrevented) return;
    this.activeLanguages.add(g), m = m || {};
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of p) {
      const d = o.getAttribute("data-ln-translatable"), u = o.getAttribute("data-ln-translations-prefix") || "", t = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!t) continue;
      const n = t.cloneNode(t.tagName === "SELECT");
      u ? n.name = u + "[trans][" + g + "][" + d + "]" : n.name = "trans[" + g + "][" + d + "]", n.value = m[d] !== void 0 ? m[d] : "", n.removeAttribute("id"), "placeholder" in n && (n.placeholder = this.placeholderLabel.replace("{lang}", h)), n.setAttribute("data-ln-translatable-lang", g);
      const i = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), s = i.length > 0 ? i[i.length - 1] : t;
      s.parentNode.insertBefore(n, s.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), A(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: g,
      langName: h
    });
  }, b.prototype.removeLanguage = function(g) {
    if (!this.activeLanguages.has(g) || G(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: g
    }).defaultPrevented) return;
    const h = this.dom.querySelectorAll('[data-ln-translatable-lang="' + g + '"]');
    for (const c of h)
      c.parentNode.removeChild(c);
    this.activeLanguages.delete(g), this._updateDropdown(), this._updateBadges(), A(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: g
    });
  }, b.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, b.prototype.hasLanguage = function(g) {
    return this.activeLanguages.has(g);
  }, b.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const g = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of m)
      h.getAttribute("data-ln-translatable-lang") !== g && h.parentNode.removeChild(h);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[l];
  }, H(f, l, b, "ln-translations");
})();
(function() {
  const f = "data-ln-autosave", l = "lnAutosave", v = "data-ln-autosave-clear", b = "data-ln-autosave-debounce-input", g = "ln-autosave:";
  if (window[l] !== void 0) return;
  function h(d) {
    const u = c(d);
    if (!u) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", d);
      return;
    }
    this.dom = d, this.key = u;
    let t = null;
    function n() {
      const a = se(d, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(u, JSON.stringify(a));
      } catch {
        return;
      }
      A(d, "ln-autosave:saved", { target: d, data: a });
    }
    function i() {
      let a;
      try {
        a = localStorage.getItem(u);
      } catch {
        return;
      }
      if (!a) return;
      let r;
      try {
        r = JSON.parse(a);
      } catch {
        return;
      }
      if (G(d, "ln-autosave:before-restore", { target: d, data: r }).defaultPrevented) return;
      const y = ae(d, r);
      for (let E = 0; E < y.length; E++)
        y[E].dispatchEvent(new Event("input", { bubbles: !0 })), y[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      A(d, "ln-autosave:restored", { target: d, data: r });
    }
    function s() {
      try {
        localStorage.removeItem(u);
      } catch {
        return;
      }
      A(d, "ln-autosave:cleared", { target: d });
    }
    this._onFocusout = function(a) {
      const r = a.target;
      p(r) && r.name && !r.hasAttribute("data-ln-autosave-exclude") && n();
    }, this._onChange = function(a) {
      const r = a.target;
      p(r) && r.name && !r.hasAttribute("data-ln-autosave-exclude") && n();
    }, this._onSubmit = function() {
      s();
    }, this._onReset = function() {
      s();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + v + "]") && s();
    }, d.addEventListener("focusout", this._onFocusout), d.addEventListener("change", this._onChange), d.addEventListener("submit", this._onSubmit), d.addEventListener("reset", this._onReset), d.addEventListener("click", this._onClearClick);
    const e = o(d);
    return e > 0 && (this._onInput = function(a) {
      const r = a.target;
      !p(r) || !r.name || r.hasAttribute("data-ln-autosave-exclude") || (t !== null && clearTimeout(t), t = setTimeout(n, e));
    }, d.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return t;
    }, i(), this;
  }
  h.prototype.destroy = function() {
    if (this.dom[l]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const d = this._getInputTimer();
        d !== null && clearTimeout(d);
      }
      A(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[l];
    }
  };
  function c(d) {
    const t = d.getAttribute(f) || d.id;
    return t ? g + window.location.pathname + ":" + t : null;
  }
  function p(d) {
    const u = d.tagName;
    return u === "INPUT" || u === "TEXTAREA" || u === "SELECT";
  }
  function o(d) {
    if (!d.hasAttribute(b)) return 0;
    const u = d.getAttribute(b);
    if (u === "" || u === null) return 1e3;
    const t = parseInt(u, 10);
    return isNaN(t) || t < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", d), 1e3) : t;
  }
  H(f, l, h, "ln-autosave");
})();
(function() {
  const f = "data-ln-autoresize", l = "lnAutoresize";
  if (window[l] !== void 0) return;
  function v(b) {
    if (b.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", b.tagName), this;
    this.dom = b;
    const g = this;
    return this._onInput = function() {
      g._resize();
    }, b.addEventListener("input", this._onInput), this._resize(), this;
  }
  v.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, v.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[l]);
  }, H(f, l, v, "ln-autoresize");
})();
(function() {
  const f = "data-ln-editor", l = "lnEditor";
  if (window[l] !== void 0) return;
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
  }, b = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, g = {
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
  function c(e) {
    return !!(b[e] || g[e] || m[e] || e === "link");
  }
  function p(e) {
    this.dom = e;
    const a = this;
    if (this._textarea = e.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", e), this;
    const r = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), r && this._surface.setAttribute("data-placeholder", r);
    const _ = this._textarea.id;
    if (_) {
      const S = e.querySelector('label[for="' + _ + '"]');
      S && (S.id || (S.id = _ + "-label"), this._surface.setAttribute("aria-labelledby", S.id));
    }
    this._surface.id = _ ? _ + "-surface" : "ln-editor-surface-" + ++h;
    const y = this._textarea.value.trim();
    y && (this._surface.innerHTML = y);
    const E = e.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? e.insertBefore(this._surface, E.nextSibling) : e.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const S = E.querySelectorAll("[data-ln-editor-action]");
      for (let L = 0; L < S.length; L++) {
        const q = S[L].getAttribute("data-ln-editor-action");
        c(q) && S[L].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      a._syncToTextarea(), A(a.dom, "ln-editor:changed", {
        html: a._textarea.value,
        target: a.dom
      });
    }, this._onMousedownToolbar = function(S) {
      S.target.closest("[data-ln-editor-action]") && S.preventDefault();
    }, this._onClickToolbar = function(S) {
      const L = S.target.closest("[data-ln-editor-action]");
      if (!L) return;
      const q = L.getAttribute("data-ln-editor-action");
      a._execAction(q);
    }, this._onPaste = function(S) {
      u(a, S);
    }, this._onKeydown = function(S) {
      i(a, S);
    }, this._onSelectionChange = function() {
      document.contains(a._surface) && a._updateActiveStates();
    }, this._onFocus = function() {
      A(a.dom, "ln-editor:focus", { target: a.dom });
    }, this._onBlur = function() {
      a._syncToTextarea(), A(a.dom, "ln-editor:blur", { target: a.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(S) {
      const L = S.detail && S.detail.html;
      L !== void 0 && (a._surface.innerHTML = L, a._syncToTextarea(), A(a.dom, "ln-editor:changed", {
        html: a._textarea.value,
        target: a.dom
      }));
    }, e.addEventListener("ln-editor:set-content", this._onSetContent);
    const w = this._textarea.form;
    return w && (this._onFormReset = function() {
      setTimeout(function() {
        a._surface.innerHTML = a._textarea.value, A(e, "ln-editor:changed", {
          html: a._textarea.value,
          target: e
        });
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), this;
  }
  p.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, p.prototype._execAction = function(e) {
    if (!(!e || G(this.dom, "ln-editor:before-change", {
      action: e,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), b[e])
        document.execCommand(b[e], !1, null);
      else if (g[e]) {
        const r = g[e], _ = o(this._surface);
        _ && _.toLowerCase() === r ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + r + ">");
      } else m[e] ? document.execCommand(m[e], !1, null) : e === "link" ? s(this) : e === "unlink" ? document.execCommand("unlink", !1, null) : e === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, p.prototype._updateActiveStates = function() {
    const e = this.dom.querySelector('[role="toolbar"]');
    if (!e) return;
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return;
    const r = a.anchorNode;
    if (!r || !this._surface.contains(r)) return;
    const _ = e.querySelectorAll("[data-ln-editor-action]");
    for (let y = 0; y < _.length; y++) {
      const E = _[y], w = E.getAttribute("data-ln-editor-action");
      let S = !1;
      if (b[w])
        try {
          S = document.queryCommandState(b[w]);
        } catch {
        }
      else if (g[w]) {
        const L = o(this._surface);
        S = L && L.toLowerCase() === g[w];
      } else if (m[w])
        try {
          S = document.queryCommandState(m[w]);
        } catch {
        }
      else w === "link" && (S = !!d(a.anchorNode, "A", this._surface));
      c(w) && E.setAttribute("aria-pressed", String(S)), S ? E.classList.add("ln-editor-active") : E.classList.remove("ln-editor-active");
    }
  }, p.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, p.prototype.setHTML = function(e) {
    this._surface && (this._surface.innerHTML = e, this._syncToTextarea(), A(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, p.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const e = this.dom.querySelector('[role="toolbar"]');
    e && (e.removeEventListener("mousedown", this._onMousedownToolbar), e.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const a = this._textarea ? this._textarea.form : null;
    a && this._onFormReset && a.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const r = this.dom.querySelector(".ln-editor__link-popover");
    r && r.remove(), A(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[l];
  };
  function o(e) {
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return null;
    let r = a.anchorNode;
    if (!r) return null;
    for (; r && r !== e; ) {
      if (r.nodeType === 1) {
        const _ = r.tagName;
        if (_ === "H2" || _ === "H3" || _ === "H4" || _ === "BLOCKQUOTE" || _ === "PRE" || _ === "P")
          return _;
      }
      r = r.parentNode;
    }
    return null;
  }
  function d(e, a, r) {
    for (; e && e !== r; ) {
      if (e.nodeType === 1 && e.tagName === a)
        return e;
      e = e.parentNode;
    }
    return null;
  }
  function u(e, a) {
    a.preventDefault();
    let r = "";
    if (a.clipboardData && (r = a.clipboardData.getData("text/html"), !r)) {
      const y = a.clipboardData.getData("text/plain");
      y && (r = y.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), r = "<p>" + r + "</p>");
    }
    if (!r) return;
    const _ = t(r);
    _ && document.execCommand("insertHTML", !1, _);
  }
  function t(e) {
    const a = document.createElement("div");
    return a.innerHTML = e, n(a), a.innerHTML;
  }
  function n(e) {
    const a = Array.from(e.childNodes);
    for (let r = 0; r < a.length; r++) {
      const _ = a[r];
      if (_.nodeType !== 3) {
        if (_.nodeType !== 1) {
          e.removeChild(_);
          continue;
        }
        if (v[_.tagName]) {
          const y = Array.from(_.attributes);
          for (let E = 0; E < y.length; E++) {
            const w = y[E].name;
            if (_.tagName === "A" && w === "href") {
              const S = _.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(S) || _.removeAttribute("href");
            } else
              _.removeAttribute(w);
          }
          _.tagName === "A" && _.setAttribute("rel", "noopener noreferrer"), n(_);
        } else {
          for (; _.firstChild; )
            e.insertBefore(_.firstChild, _);
          e.removeChild(_);
        }
      }
    }
  }
  function i(e, a) {
    if (!(a.ctrlKey || a.metaKey)) return;
    let r = null;
    switch (a.key.toLowerCase()) {
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
    r && (a.preventDefault(), e._execAction(r));
  }
  function s(e) {
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return;
    const r = d(a.anchorNode, "A", e._surface), _ = a.getRangeAt(0).cloneRange(), y = e.dom.querySelector(".ln-editor__link-popover");
    y && y.remove();
    const E = ht(e.dom, "ln-editor-link-popover", "ln-editor");
    if (!E) return;
    const w = E.firstElementChild;
    if (!w) return;
    const S = w.querySelector('input[type="url"]'), L = w.querySelector('[data-ln-editor-action="confirm-link"]'), q = w.querySelector('[data-ln-editor-action="cancel-link"]');
    r && (S.value = r.getAttribute("href") || "");
    const k = e.dom.querySelector('[role="toolbar"]');
    k ? k.after(w) : e.dom.insertBefore(w, e._surface), S.focus();
    function R() {
      const O = window.getSelection();
      O.removeAllRanges(), O.addRange(_);
    }
    function x() {
      const O = S.value.trim();
      if (w.remove(), R(), e._surface.focus(), O)
        if (r)
          r.setAttribute("href", O), r.setAttribute("rel", "noopener noreferrer"), e._syncToTextarea(), A(e.dom, "ln-editor:changed", {
            html: e._textarea.value,
            target: e.dom
          });
        else {
          document.execCommand("createLink", !1, O);
          const F = window.getSelection();
          if (F && F.anchorNode) {
            const U = d(F.anchorNode, "A", e._surface);
            U && (U.setAttribute("rel", "noopener noreferrer"), e._syncToTextarea());
          }
        }
      else r && document.execCommand("unlink", !1, null);
    }
    function N() {
      w.remove(), R(), e._surface.focus();
    }
    L.addEventListener("click", x), q.addEventListener("click", N), S.addEventListener("keydown", function(O) {
      O.key === "Enter" ? (O.preventDefault(), x()) : O.key === "Escape" && (O.preventDefault(), N());
    });
  }
  H(f, l, p, "ln-editor");
})();
(function() {
  const f = "lnFill";
  if (window[f] !== void 0) return;
  const l = { lnFillForm: !0, lnFillStore: !0 };
  function v(g) {
    const m = {}, h = g.dataset;
    for (const c in h) {
      if (!c.startsWith("lnFill") || l[c]) continue;
      const p = c.slice(6);
      p && (m[p.charAt(0).toLowerCase() + p.slice(1)] = h[c]);
    }
    return m;
  }
  function b(g, m) {
    const h = window.CSS && CSS.escape ? CSS.escape(m) : m, c = document.querySelectorAll('[data-ln-fill-id="' + h + '"]');
    if (c.length === 0) return null;
    for (let p = 0; p < c.length; p++) {
      const o = c[p].getAttribute("data-ln-fill-form");
      if (o) {
        const d = document.getElementById(o);
        if (d && g.contains(d)) return c[p];
      }
    }
    return c[0];
  }
  document.addEventListener("click", function(g) {
    if (g.ctrlKey || g.metaKey || g.button === 1) return;
    const m = g.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const h = m.getAttribute("href");
    if (h && h.indexOf("#") !== -1) return;
    const c = m.getAttribute("data-ln-fill-form"), p = document.getElementById(c);
    if (!p) return;
    const o = v(m), d = Object.keys(o).length > 0;
    window.lnCore.lnFill(p, d ? o : null);
  }), document.addEventListener("ln-fill:request", function(g) {
    const m = g.detail;
    if (!m) return;
    const h = g.target, c = m.id;
    if (c == null) {
      window.lnCore.lnFill(h, null);
      return;
    }
    const p = b(h, c);
    if (!p) return;
    const o = v(p);
    window.lnCore.lnFill(h, o);
  }), window[f] = !0;
})();
(function() {
  const f = "data-ln-slug-from", l = "lnSlug";
  if (window[l] !== void 0) return;
  function v(g) {
    return String(g).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function b(g) {
    if (g.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", g.tagName), this;
    const m = g.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", g), this;
    const h = g.getAttribute(f), c = m.elements[h];
    if (!c)
      return console.warn('[ln-slug] Source field "' + h + '" not found in form:', g), this;
    if (typeof c.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + h + '" is a RadioNodeList (same-name group) — single source field required:', g), this;
    this.dom = g, this.source = c, this._pristine = g.value === "", this._mirroring = !1;
    const p = this;
    return this._onSource = function() {
      p._pristine && p._mirror();
    }, this._onSlug = function() {
      p._mirroring || (p._pristine = p.dom.value === "");
    }, c.addEventListener("input", this._onSource), g.addEventListener("input", this._onSlug), this;
  }
  b.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = v(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, b.prototype.destroy = function() {
    this.dom[l] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[l]);
  }, H(f, l, b, "ln-slug");
})();
(function() {
  const f = "data-ln-time", l = "lnTime";
  if (window[l] !== void 0) return;
  const v = {}, b = {};
  function g(w) {
    return w.getAttribute("data-ln-time-locale") || V(w);
  }
  function m(w, S) {
    const L = (w || "") + "|" + JSON.stringify(S);
    return v[L] || (v[L] = new Intl.DateTimeFormat(w, S)), v[L];
  }
  function h(w) {
    const S = w || "";
    return b[S] || (b[S] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), b[S];
  }
  const c = /* @__PURE__ */ new Set();
  let p = null;
  function o() {
    p || (p = setInterval(u, 6e4));
  }
  function d() {
    p && (clearInterval(p), p = null);
  }
  function u() {
    for (const w of c) {
      if (!document.body.contains(w.dom)) {
        c.delete(w);
        continue;
      }
      a(w);
    }
    c.size === 0 && d();
  }
  function t(w, S) {
    const L = At(S), q = (S || "").toLowerCase().split("-")[0], k = m(S, { dateStyle: "long", timeStyle: "short" }), R = k.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && R !== q && L.monthsLong) {
      const x = L.monthsLong[w.getMonth()], N = w.getDate(), O = w.getFullYear(), F = String(w.getHours()).padStart(2, "0"), U = String(w.getMinutes()).padStart(2, "0");
      return `${N} ${x} ${O} во ${F}:${U}`;
    }
    return k.format(w);
  }
  function n(w, S) {
    const L = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    w.getFullYear() !== L.getFullYear() && (q.year = "numeric");
    const k = At(S), R = (S || "").toLowerCase().split("-")[0], x = m(S, q), N = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (k && N !== R && k.monthsShort) {
      const O = k.monthsShort[w.getMonth()], F = w.getDate(), U = w.getFullYear() !== L.getFullYear() ? " " + w.getFullYear() : "";
      return `${F} ${O}${U}`;
    }
    return x.format(w);
  }
  function i(w, S) {
    return m(S, { dateStyle: "medium" }).format(w);
  }
  function s(w, S) {
    return m(S, { timeStyle: "short" }).format(w);
  }
  function e(w, S) {
    const L = Math.floor(Date.now() / 1e3), k = Math.floor(w.getTime() / 1e3) - L, R = Math.abs(k);
    if (R < 10) return h(S).format(0, "second");
    let x, N;
    if (R < 60)
      x = "second", N = k;
    else if (R < 3600)
      x = "minute", N = Math.round(k / 60);
    else if (R < 86400)
      x = "hour", N = Math.round(k / 3600);
    else if (R < 604800)
      x = "day", N = Math.round(k / 86400);
    else if (R < 2592e3)
      x = "week", N = Math.round(k / 604800);
    else
      return n(w, S);
    return h(S).format(N, x);
  }
  function a(w) {
    const S = w.dom.getAttribute("datetime");
    if (!S) return;
    const L = Number(S);
    if (isNaN(L)) return;
    const q = new Date(L * 1e3), k = w.dom.getAttribute(f) || "short", R = g(w.dom);
    let x;
    switch (k) {
      case "relative":
        x = e(q, R);
        break;
      case "full":
        x = t(q, R);
        break;
      case "date":
        x = i(q, R);
        break;
      case "time":
        x = s(q, R);
        break;
      default:
        x = n(q, R);
        break;
    }
    w.dom.textContent = x, k !== "full" && (w.dom.title = t(q, R));
  }
  function r(w) {
    return this.dom = w, a(this), w.getAttribute(f) === "relative" && (c.add(this), o()), this;
  }
  r.prototype.render = function() {
    a(this);
  }, r.prototype.destroy = function() {
    c.delete(this), c.size === 0 && d(), delete this.dom[l];
  };
  function _(w) {
    const S = w[l];
    if (!S) return;
    w.getAttribute(f) === "relative" ? (c.add(S), o()) : (c.delete(S), c.size === 0 && d()), a(S);
  }
  function y(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(f) && w[l] && a(w[l]);
  }
  function E() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + f + "]");
      for (let S = 0; S < w.length; S++) {
        const L = w[S][l];
        L && a(L);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(f, l, r, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: _,
    onInit: y
  }), E();
})();
(function() {
  const f = "data-ln-data-store", l = "lnDataStore";
  if (window[l] !== void 0) return;
  const v = "ln_app_cache", b = "_meta", g = "1.0";
  let m = null, h = null;
  const c = {};
  function p(C) {
    C && C.name === "QuotaExceededError" && A(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function o() {
    const C = {};
    for (const T of document.querySelectorAll(`[${f}]`)) {
      const D = T.getAttribute(f);
      if (D) {
        const I = T.getAttribute("data-ln-data-store-indexes") || "";
        C[D] = {
          indexes: I.split(",").map((M) => M.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function d() {
    return h || (h = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), C(null);
      const T = o(), D = Object.keys(T), I = indexedDB.open(v);
      I.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), C(null);
      }, I.onsuccess = (M) => {
        const B = M.target.result, z = Array.from(B.objectStoreNames);
        if (!(!z.includes(b) || D.some((wt) => !z.includes(wt))))
          return u(B), m = B, C(B);
        const $ = B.version;
        B.close();
        const J = indexedDB.open(v, $ + 1);
        J.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, J.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), C(null);
        }, J.onupgradeneeded = (wt) => {
          const ct = wt.target.result;
          ct.objectStoreNames.contains(b) || ct.createObjectStore(b, { keyPath: "key" });
          for (const Ft of D)
            if (!ct.objectStoreNames.contains(Ft)) {
              const Ce = ct.createObjectStore(Ft, { keyPath: "id" });
              for (const Xt of T[Ft].indexes)
                Ce.createIndex(Xt, Xt, { unique: !1 });
            }
        }, J.onsuccess = (wt) => {
          const ct = wt.target.result;
          u(ct), m = ct, C(ct);
        };
      };
    }), h);
  }
  function u(C) {
    C.onversionchange = () => {
      C.close(), m = null, h = null;
    };
  }
  function t() {
    return m ? Promise.resolve(m) : (h = null, d());
  }
  async function n(C) {
    if (!gt() || !C) return C;
    const T = { ...C }, D = T.id, I = await Oe(T);
    return !I || !I.encrypted ? C : {
      id: D,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function i(C) {
    return !C || !C.encrypted || !gt() ? C : Me(C);
  }
  const s = (C, T) => t().then((D) => D ? D.transaction(C, T).objectStore(C) : null);
  function e(C) {
    return new Promise((T, D) => {
      C.onsuccess = () => T(C.result), C.onerror = () => {
        p(C.error), D(C.error);
      };
    });
  }
  const a = (C) => s(C, "readonly").then((T) => T ? e(T.getAll()) : []).then((T) => gt() ? Promise.all(T.map((D) => i(D))) : T), r = (C, T) => s(C, "readonly").then((D) => D ? e(D.get(T)) : null).then((D) => D ? i(D) : null), _ = (C, T) => (gt() ? n(T) : Promise.resolve(T)).then((I) => s(C, "readwrite").then((M) => M ? e(M.put(I)) : null)), y = (C, T) => s(C, "readwrite").then((D) => D ? e(D.delete(T)) : null), E = (C) => s(C, "readwrite").then((T) => T ? e(T.clear()) : null), w = (C) => s(C, "readonly").then((T) => T ? e(T.count()) : 0), S = (C) => s(b, "readonly").then((T) => T ? e(T.get(C)) : null), L = (C, T) => s(b, "readwrite").then((D) => {
    if (D)
      return T.key = C, e(D.put(T));
  });
  function q(C) {
    this.dom = C, this._name = C.getAttribute(f);
    const T = C.getAttribute("data-ln-data-store-stale"), D = parseInt(T, 10);
    this._staleThreshold = T === "never" || T === "-1" ? -1 : isNaN(D) ? 300 : D;
    const I = C.getAttribute("data-ln-data-store-search-fields") || "";
    return this._searchFields = I.split(",").map((M) => M.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), c[this._name] = this, k(this), this.ready = it(this), this;
  }
  function k(C) {
    C._handlers = {
      create: (T) => R(C, "create", T.detail, () => N(C, T.detail)),
      update: (T) => R(C, "update", T.detail, () => O(C, T.detail)),
      delete: (T) => R(C, "delete", T.detail, () => F(C, T.detail)),
      "bulk-delete": (T) => R(C, "bulk-delete", T.detail, () => U(C, T.detail)),
      "sync-failed": (T) => {
        C.isSyncing = !1, A(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: T.detail && T.detail.error,
          status: T.detail && T.detail.status
        });
      }
    };
    for (const [T, D] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${T}`, D);
  }
  function R(C, T, D, I) {
    const M = D && D.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return I();
    }).catch((B) => lt(C, T, M, B)), C._mutationChain;
  }
  function x(C) {
    return w(C._name).then((T) => (C.totalCount = T, C.hasCache = !0, C.isLoaded = !0, L(C._name, {
      schema_version: g,
      last_synced_at: C.lastSyncedAt,
      has_cache: !0,
      record_count: T
    })));
  }
  function N(C, { tempId: T, data: D = {}, requestId: I } = {}) {
    const M = { ...D, id: T };
    return _(C._name, M).then(() => x(C)).then(() => {
      A(C.dom, "ln-data-store:created", { store: C._name, record: M, tempId: T, requestId: I });
    });
  }
  function O(C, { id: T, data: D = {}, requestId: I } = {}) {
    return r(C._name, T).then((M) => {
      if (!M) throw new Error(`Record not found: ${T}`);
      const B = { ...M, ...D }, z = D.id;
      return (z !== void 0 && z !== T ? j(C._name, T, B) : _(C._name, B)).then(() => x(C)).then(() => {
        A(C.dom, "ln-data-store:updated", { store: C._name, record: B, previous: M, requestId: I });
      });
    });
  }
  function F(C, { id: T, requestId: D } = {}) {
    return r(C._name, T).then((I) => {
      if (!I) {
        A(C.dom, "ln-data-store:deleted", { store: C._name, id: T, requestId: D, missing: !0 });
        return;
      }
      return y(C._name, T).then(() => x(C)).then(() => {
        A(C.dom, "ln-data-store:deleted", { store: C._name, id: T, requestId: D });
      });
    });
  }
  function U(C, { ids: T = [], requestId: D } = {}) {
    return T.length ? Promise.all(T.map((I) => r(C._name, I))).then((I) => {
      const M = I.filter(Boolean).map((B) => B.id);
      return P(C._name, M).then(() => x(C)).then(() => {
        A(C.dom, "ln-data-store:deleted", { store: C._name, ids: M, requestId: D });
      });
    }) : (A(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: D }), Promise.resolve());
  }
  function lt(C, T, D, I) {
    console.error("[ln-data-store] " + T + " failed:", I), A(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: T,
      requestId: D,
      error: I
    });
  }
  function it(C) {
    return d().then((T) => {
      if (!T) throw new Error("IndexedDB is unavailable");
      return S(C._name);
    }).then((T) => {
      if (C.initializationError = null, T && T.schema_version === g)
        C.lastSyncedAt = T.last_synced_at || null, C.totalCount = T.record_count || 0, C.hasCache = T.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, A(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, A(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (T && T.schema_version !== g)
          return E(C._name).then(() => L(C._name, { schema_version: g, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, A(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, A(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((T) => (C.isInitialized = !0, C.isLoaded = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = T, A(C.dom, "ln-data-store:initialization-error", { store: C._name, error: T }), { ok: !1, error: T }));
  }
  function yt(C) {
    C.isSyncing = !0, A(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function Lt(C, T) {
    return t().then((D) => D ? (gt() ? Promise.all(T.map((M) => n(M))) : Promise.resolve(T)).then((M) => new Promise((B, z) => {
      const K = D.transaction(C, "readwrite"), $ = K.objectStore(C);
      M.forEach((J) => $.put(J)), K.oncomplete = () => B(), K.onerror = () => {
        p(K.error), z(K.error);
      };
    })) : void 0);
  }
  function P(C, T) {
    return t().then((D) => {
      if (D)
        return new Promise((I, M) => {
          const B = D.transaction(C, "readwrite"), z = B.objectStore(C);
          T.forEach((K) => z.delete(K)), B.oncomplete = () => I(), B.onerror = () => M(B.error);
        });
    });
  }
  function j(C, T, D) {
    return (gt() ? n(D) : Promise.resolve(D)).then((M) => t().then((B) => {
      if (B)
        return new Promise((z, K) => {
          const $ = B.transaction(C, "readwrite"), J = $.objectStore(C);
          J.put(M), J.delete(T), $.oncomplete = () => z(), $.onerror = () => {
            p($.error), K($.error);
          };
        });
    }));
  }
  const Q = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function vt(C, T) {
    if (!T || !T.field) return C;
    const { field: D, direction: I } = T, M = I === "desc";
    return [...C].sort((B, z) => {
      const K = B[D], $ = z[D];
      if (K == null && $ == null) return 0;
      if (K == null) return M ? 1 : -1;
      if ($ == null) return M ? -1 : 1;
      const J = typeof K == "string" && typeof $ == "string" ? Q.compare(K, $) : K < $ ? -1 : K > $ ? 1 : 0;
      return M ? -J : J;
    });
  }
  function rt(C, T) {
    if (!T) return C;
    const D = Object.keys(T).filter((I) => Array.isArray(T[I]) && T[I].length > 0);
    return D.length ? C.filter(
      (I) => D.every((M) => T[M].map(String).includes(String(I[M])))
    ) : C;
  }
  function tt(C, T, D) {
    if (!T || !D || !D.length) return C;
    const I = T.toLowerCase();
    return C.filter(
      (M) => D.some((B) => {
        const z = M[B];
        return z != null && String(z).toLowerCase().includes(I);
      })
    );
  }
  function Et(C, T, D) {
    if (!C.length) return 0;
    if (D === "count") return C.length;
    const I = C.map((B) => parseFloat(B[T])).filter((B) => !isNaN(B)), M = I.reduce((B, z) => B + z, 0);
    return D === "sum" ? M : D === "avg" && I.length ? M / I.length : 0;
  }
  function ot(C, T) {
    if (!C.presenters || !C.presenters.computed) return T;
    const D = C.presenters.computed;
    return T.map((I) => {
      const M = { ...I };
      for (const [B, z] of Object.entries(D))
        try {
          M[B] = z(I);
        } catch (K) {
          console.error(`[ln-data-store] Decorator computed field failed for ${B}`, K);
        }
      return M;
    });
  }
  q.prototype.getAll = function(C = {}) {
    const T = this;
    return a(T._name).then((D) => {
      const I = D.length;
      C.filters && (D = rt(D, C.filters)), C.search && (D = tt(D, C.search, T._searchFields));
      const M = D.length;
      if (C.sort && (D = vt(D, C.sort)), C.offset || C.limit) {
        const B = C.offset || 0, z = C.limit || D.length;
        D = D.slice(B, B + z);
      }
      return {
        data: ot(T, D),
        total: I,
        filtered: M
      };
    });
  }, q.prototype.getById = function(C) {
    return r(this._name, C).then((T) => T ? ot(this, [T])[0] : null);
  }, q.prototype.count = function(C) {
    return C ? a(this._name).then((T) => rt(T, C).length) : w(this._name);
  }, q.prototype.aggregate = function(C, T) {
    return a(this._name).then((D) => Et(D, C, T));
  }, q.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, q.prototype.applySync = function(C, T, D, I) {
    I = I || {};
    const M = this;
    C.length > 0 || T.length > 0;
    let B = Promise.resolve();
    return C.length > 0 && (B = B.then(() => Lt(M._name, C))), T.length > 0 && (B = B.then(() => P(M._name, T))), B.then(() => w(M._name)).then((z) => (M.totalCount = I.total !== void 0 ? I.total : z, M.hasCache = !0, L(M._name, {
      schema_version: g,
      last_synced_at: D,
      has_cache: !0,
      record_count: M.totalCount
    }))).then(() => {
      const z = !M.isLoaded;
      M.isLoaded = !0, M.isSyncing = !1, M.lastSyncedAt = D, z ? (A(M.dom, "ln-data-store:loaded", { store: M._name, count: M.totalCount, meta: I }), A(M.dom, "ln-data-store:ready", { store: M._name, count: M.totalCount, source: "server", meta: I })) : A(M.dom, "ln-data-store:synced", {
        store: M._name,
        added: C.length,
        deleted: T.length,
        changed: !0,
        meta: I
      });
    }).catch((z) => {
      M.isSyncing = !1, console.error("[ln-data-store] applySync failed:", z);
    });
  }, q.prototype.forceSync = function() {
    yt(this);
  }, q.prototype.fullReload = function() {
    const C = this;
    return E(C._name).then(() => L(C._name, {
      schema_version: g,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, yt(C);
    });
  }, q.prototype.destroy = function() {
    if (this._handlers) {
      for (const [C, T] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, T);
      this._handlers = null;
    }
    delete c[this._name], delete this.dom[l], A(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function pt() {
    return t().then((C) => {
      if (!C) return;
      const T = Array.from(C.objectStoreNames);
      return new Promise((D, I) => {
        const M = C.transaction(T, "readwrite");
        T.forEach((B) => M.objectStore(B).clear()), M.oncomplete = () => D(), M.onerror = () => I(M.error);
      });
    }).then(() => {
      Object.values(c).forEach((C) => {
        C.isLoaded = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  H(f, l, q, "ln-data-store"), window[l].clearAll = pt, window[l].init = window[l], window[l].setStorageKey = Zt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Zt);
})();
(function() {
  const f = "data-ln-api-connector", l = "lnApiConnector", v = "lnConnector";
  if (window[l] !== void 0) return;
  function b(c) {
    return c.ok ? c.status === 204 ? null : c.json() : c.json().catch(() => null).then((p) => {
      const o = new Error("HTTP " + c.status + ": " + c.statusText);
      throw o.status = c.status, o.data = p, o;
    });
  }
  function g(c) {
    return this.dom = c, c[l] = this, c[v] = this, this.refreshConfig(), this._handlers = null, m(this), this;
  }
  g.prototype.refreshConfig = function() {
    const c = this.dom;
    this.baseUrl = c.getAttribute("data-ln-api-base-url") || "", this.path = c.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: c.getAttribute("data-ln-api-param-offset") || "offset",
      limit: c.getAttribute("data-ln-api-param-limit") || "limit",
      search: c.getAttribute("data-ln-api-param-search") || "search",
      sortField: c.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: c.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const p = c.getAttribute("data-ln-api-headers") || "";
    this.headers = de(p, "ln-api-connector"), (p.toLowerCase().includes("authorization") || p.toLowerCase().includes("bearer") || p.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), A(c, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, g.prototype._reqHeaders = function(c) {
    const p = Object.assign({}, bt(this.headers), { "X-LN-Response": "data" });
    return c && (p["Idempotency-Key"] = c), p;
  }, g.prototype.fetchDelta = function(c) {
    const p = this;
    let o = Y(p.baseUrl, p.path);
    return c != null && c !== "" && (o += (o.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(c)), window.fetch(o, { method: "GET", headers: p._reqHeaders(), credentials: p.credentials }).then(b);
  }, g.prototype.query = function(c) {
    const p = this;
    c = c || {};
    let o = Y(p.baseUrl, p.path);
    const d = p.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, u = new URLSearchParams();
    c.search && u.append(d.search, c.search), c.offset != null && u.append(d.offset, c.offset), c.limit != null && u.append(d.limit, c.limit), c.sort && c.sort.field && c.sort.direction && (u.append(d.sortField, c.sort.field), u.append(d.sortDir, c.sort.direction)), c.filters && typeof c.filters == "object" && Object.keys(c.filters).forEach((n) => {
      const i = c.filters[n];
      Array.isArray(i) && i.length > 0 && u.append(n, i.join(","));
    });
    const t = u.toString();
    return t && (o += (o.indexOf("?") !== -1 ? "&" : "?") + t), window.fetch(o, { method: "GET", headers: p._reqHeaders(), credentials: p.credentials }).then(b);
  }, g.prototype.create = function(c, p, o) {
    const d = this;
    return window.fetch(Y(d.baseUrl, p || d.path), {
      method: "POST",
      headers: d._reqHeaders(o),
      credentials: d.credentials,
      body: JSON.stringify(c)
    }).then(b);
  }, g.prototype.update = function(c, p, o, d, u) {
    const t = this;
    o != null && (p = Object.assign({}, p, { expected_version: o }));
    const n = d ? Y(t.baseUrl, d) : Y(t.baseUrl, t.path, c);
    return window.fetch(n, {
      method: "PUT",
      headers: t._reqHeaders(u),
      credentials: t.credentials,
      body: JSON.stringify(p)
    }).then(b);
  }, g.prototype.delete = function(c, p, o) {
    const d = this;
    return window.fetch(Y(d.baseUrl, p || d.path, c), {
      method: "DELETE",
      headers: d._reqHeaders(o),
      credentials: d.credentials
    }).then(b);
  }, g.prototype.bulkDelete = function(c, p, o) {
    const d = this;
    return window.fetch(Y(d.baseUrl, p || d.path) + "/bulk-delete", {
      method: "DELETE",
      headers: d._reqHeaders(o),
      credentials: d.credentials,
      body: JSON.stringify({ ids: c })
    }).then(b);
  };
  function m(c) {
    c._handlers = {
      sync: function(o) {
        const d = o.detail || {};
        c.fetchDelta(d.since).then(function(u) {
          A(c.dom, "ln-api-connector:fetched", { data: u, since: d.since, meta: d.meta || null });
        }).catch(function(u) {
          A(c.dom, "ln-api-connector:error", {
            action: "sync",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            since: d.since,
            meta: d.meta || null
          });
        });
      },
      query: function(o) {
        const d = o.detail || {}, u = d.query || d;
        c.query(u).then(function(t) {
          const n = t || {};
          A(c.dom, "ln-api-connector:fetched", {
            data: n.data || (Array.isArray(n) ? n : []),
            total: n.total,
            filtered: n.filtered,
            offset: u.offset,
            queryGen: u.queryGen,
            meta: d.meta || null
          });
        }).catch(function(t) {
          A(c.dom, "ln-api-connector:error", {
            action: "query",
            error: t.message,
            status: t.status || 0,
            data: t.data || null,
            meta: d.meta || null
          });
        });
      },
      create: function(o) {
        const d = o.detail || {};
        c.create(d.data, d.url, d.idempotencyKey).then(function(u) {
          const t = u && u.content !== void 0 ? u.content : u, n = u && u.message ? u.message : null;
          A(c.dom, "ln-api-connector:created", { record: t, tempId: d.tempId, message: n, meta: d.meta || null });
        }).catch(function(u) {
          A(c.dom, "ln-api-connector:error", {
            action: "create",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            tempId: d.tempId,
            meta: d.meta || null
          });
        });
      },
      update: function(o) {
        const d = o.detail || {};
        c.update(d.id, d.data, d.expected_version, d.url, d.idempotencyKey).then(function(u) {
          const t = u && u.content !== void 0 ? u.content : u, n = u && u.message ? u.message : null;
          A(c.dom, "ln-api-connector:updated", { record: t, id: d.id, message: n, meta: d.meta || null });
        }).catch(function(u) {
          A(c.dom, "ln-api-connector:error", {
            action: "update",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: d.id,
            conflictData: u.status === 409 ? u.data : null,
            meta: d.meta || null
          });
        });
      },
      delete: function(o) {
        const d = o.detail || {};
        c.delete(d.id, d.url, d.idempotencyKey).then(function(u) {
          const t = u && u.message ? u.message : null;
          A(c.dom, "ln-api-connector:deleted", { response: u, id: d.id, message: t, meta: d.meta || null });
        }).catch(function(u) {
          A(c.dom, "ln-api-connector:error", {
            action: "delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: d.id,
            meta: d.meta || null
          });
        });
      },
      bulkDelete: function(o) {
        const d = o.detail || {};
        c.bulkDelete(d.ids, d.url, d.idempotencyKey).then(function(u) {
          const t = u && u.message ? u.message : null;
          A(c.dom, "ln-api-connector:bulk-deleted", { response: u, ids: d.ids, message: t, meta: d.meta || null });
        }).catch(function(u) {
          A(c.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            ids: d.ids,
            meta: d.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(o) {
      c.dom.addEventListener(o + ":request-sync", c._handlers.sync), c.dom.addEventListener(o + ":request-query", c._handlers.query), c.dom.addEventListener(o + ":request-fetch", c._handlers.query), c.dom.addEventListener(o + ":request-create", c._handlers.create), c.dom.addEventListener(o + ":request-update", c._handlers.update), c.dom.addEventListener(o + ":request-delete", c._handlers.delete), c.dom.addEventListener(o + ":request-bulk-delete", c._handlers.bulkDelete);
    });
  }
  g.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const c = this;
    c._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(o) {
      c.dom.removeEventListener(o + ":request-sync", c._handlers.sync), c.dom.removeEventListener(o + ":request-query", c._handlers.query), c.dom.removeEventListener(o + ":request-fetch", c._handlers.query), c.dom.removeEventListener(o + ":request-create", c._handlers.create), c.dom.removeEventListener(o + ":request-update", c._handlers.update), c.dom.removeEventListener(o + ":request-delete", c._handlers.delete), c.dom.removeEventListener(o + ":request-bulk-delete", c._handlers.bulkDelete);
    }), c._handlers = null), A(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[l], delete this.dom[v];
  };
  function h(c) {
    const p = c[l];
    p && p.refreshConfig();
  }
  H(f, l, g, "ln-api-connector", {
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
  const f = "data-ln-couchdb-connector", l = "lnCouchDbConnector", v = "lnConnector";
  if (window[l] !== void 0) return;
  function b(t) {
    const n = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
    return { content: n, message: i };
  }
  function g(t) {
    return this.dom = t, t[l] = this, t[v] = this, this.refreshConfig(), this._handlers = null, d(this), this;
  }
  g.prototype.refreshConfig = function() {
    const t = this.dom;
    this.url = t.getAttribute("data-ln-couchdb-url") || "", this.db = t.getAttribute("data-ln-couchdb-db") || "", this.auth = t.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const n = t.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = de(n, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), n.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), A(t, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function m(t, n, i) {
    const s = Object.assign({}, bt(t.headers, t.auth), i || {});
    return n && (s["Idempotency-Key"] = n), s;
  }
  g.prototype.fetchDelta = function(t) {
    const n = this, i = ["include_docs=true", "feed=normal"];
    t && i.push("since=" + encodeURIComponent(t));
    const s = Y(n.url, n.db, "_changes") + "?" + i.join("&");
    return window.fetch(s, { method: "GET", headers: bt(n.headers, n.auth), credentials: n.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const a = e.results || [];
      return {
        data: a.filter((r) => !r.deleted && r.doc).map((r) => Object.assign({}, r.doc, { id: r.doc._id })),
        deleted: a.filter((r) => r.deleted).map((r) => r.id),
        synced_at: e.last_seq || t || ""
      };
    });
  };
  function h(t, n, i) {
    const s = Object.assign({ _id: n.id }, n);
    return s._id || delete s._id, window.fetch(Y(t.url, t.db), {
      method: "POST",
      headers: m(t, i),
      credentials: t.credentials,
      body: JSON.stringify(s)
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const a = b(e), r = a.content;
      return { record: Object.assign({}, s, { id: r.id, _id: r.id, _rev: r.rev }), message: a.message };
    });
  }
  g.prototype.create = function(t, n) {
    return h(this, t, n).then((i) => i.record);
  };
  function c(t, n, i, s) {
    const e = Object.assign({ id: String(n), _id: String(n) }, i), a = e._rev || e.rev;
    return (a ? Promise.resolve(a) : window.fetch(Y(t.url, t.db, null, n), { method: "GET", headers: bt(t.headers, t.auth), credentials: t.credentials }).then((_) => {
      if (!_.ok) throw new Error("Could not retrieve document for revision mapping");
      return _.json().then((y) => y._rev);
    })).then((_) => {
      const y = Object.assign({}, e, { _rev: _ });
      delete y.rev;
      const E = m(t, s, { "If-Match": _ });
      return window.fetch(Y(t.url, t.db, null, n), {
        method: "PUT",
        headers: E,
        credentials: t.credentials,
        body: JSON.stringify(y)
      }).then((w) => {
        if (w.ok) return w.json().then((S) => {
          const L = b(S);
          return { record: Object.assign({}, y, { _rev: L.content.rev }), message: L.message };
        });
        if (w.status === 409) return w.json().then((S) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = S, L;
        });
        throw new Error("HTTP " + w.status + ": " + w.statusText);
      });
    });
  }
  g.prototype.update = function(t, n, i) {
    return c(this, t, n, i).then((s) => s.record);
  };
  function p(t, n, i, s) {
    return (i ? Promise.resolve(i) : window.fetch(Y(t.url, t.db, null, n), { method: "GET", headers: bt(t.headers, t.auth), credentials: t.credentials }).then((a) => {
      if (!a.ok) throw new Error("Could not retrieve document for revision delete");
      return a.json().then((r) => r._rev);
    })).then((a) => {
      const r = Y(t.url, t.db, null, n) + "?rev=" + encodeURIComponent(a);
      return window.fetch(r, { method: "DELETE", headers: m(t, s), credentials: t.credentials }).then((_) => {
        if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
        return _.json();
      }).then((_) => {
        const y = b(_);
        return { response: y.content, message: y.message };
      });
    });
  }
  g.prototype.delete = function(t, n, i) {
    return p(this, t, n, i).then((s) => s.response);
  };
  function o(t, n, i) {
    return !n || n.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Y(t.url, t.db, "_all_docs"), {
      method: "POST",
      headers: bt(t.headers, t.auth),
      credentials: t.credentials,
      body: JSON.stringify({ keys: n })
    }).then((s) => {
      if (!s.ok) throw new Error("HTTP " + s.status + ": " + s.statusText);
      return s.json();
    }).then((s) => {
      const a = (s.rows || []).filter((r) => !r.error && r.value && r.value.rev).map((r) => ({ _id: r.id, _rev: r.value.rev, _deleted: !0 }));
      return a.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Y(t.url, t.db, "_bulk_docs"), {
        method: "POST",
        headers: m(t, i),
        credentials: t.credentials,
        body: JSON.stringify({ docs: a })
      }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
        return r.json();
      }).then((r) => {
        const _ = b(r);
        return { response: { ok: !0, results: _.content, deletedCount: a.length }, message: _.message };
      });
    });
  }
  g.prototype.bulkDelete = function(t, n) {
    return o(this, t, n).then((i) => i.response);
  };
  function d(t) {
    t._handlers = {
      sync: function(i) {
        const s = i.detail || {};
        t.fetchDelta(s.since).then(function(e) {
          A(t.dom, "ln-couchdb-connector:fetched", { data: e, since: s.since, meta: s.meta || null });
        }).catch(function(e) {
          A(t.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: s.since,
            meta: s.meta || null
          });
        });
      },
      create: function(i) {
        const s = i.detail || {};
        h(t, s.data, s.idempotencyKey).then(function(e) {
          A(t.dom, "ln-couchdb-connector:created", { record: e.record, tempId: s.tempId, message: e.message, meta: s.meta || null });
        }).catch(function(e) {
          A(t.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: s.tempId,
            meta: s.meta || null
          });
        });
      },
      update: function(i) {
        const s = i.detail || {}, e = Object.assign({}, s.data);
        s.expected_version !== void 0 && (e._rev = s.expected_version), c(t, s.id, e, s.idempotencyKey).then(function(a) {
          A(t.dom, "ln-couchdb-connector:updated", { record: a.record, id: s.id, message: a.message, meta: s.meta || null });
        }).catch(function(a) {
          A(t.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: a.message,
            status: a.status || 0,
            id: s.id,
            data: a.status === 409 ? a.data : null,
            conflictData: a.status === 409 ? a.data : null,
            meta: s.meta || null
          });
        });
      },
      delete: function(i) {
        const s = i.detail || {};
        p(t, s.id, s.rev, s.idempotencyKey).then(function(e) {
          A(t.dom, "ln-couchdb-connector:deleted", { response: e.response, id: s.id, message: e.message, meta: s.meta || null });
        }).catch(function(e) {
          A(t.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: s.id,
            meta: s.meta || null
          });
        });
      },
      bulkDelete: function(i) {
        const s = i.detail || {};
        o(t, s.ids, s.idempotencyKey).then(function(e) {
          A(t.dom, "ln-couchdb-connector:bulk-deleted", { response: e.response, ids: s.ids, message: e.message, meta: s.meta || null });
        }).catch(function(e) {
          A(t.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: s.ids,
            meta: s.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      t.dom.addEventListener(i + ":request-sync", t._handlers.sync), t.dom.addEventListener(i + ":request-fetch", t._handlers.sync), t.dom.addEventListener(i + ":request-create", t._handlers.create), t.dom.addEventListener(i + ":request-update", t._handlers.update), t.dom.addEventListener(i + ":request-delete", t._handlers.delete), t.dom.addEventListener(i + ":request-bulk-delete", t._handlers.bulkDelete);
    });
  }
  g.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const t = this;
    t._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(i) {
      t.dom.removeEventListener(i + ":request-sync", t._handlers.sync), t.dom.removeEventListener(i + ":request-fetch", t._handlers.sync), t.dom.removeEventListener(i + ":request-create", t._handlers.create), t.dom.removeEventListener(i + ":request-update", t._handlers.update), t.dom.removeEventListener(i + ":request-delete", t._handlers.delete), t.dom.removeEventListener(i + ":request-bulk-delete", t._handlers.bulkDelete);
    }), t._handlers = null), A(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[l], delete this.dom[v];
  };
  function u(t) {
    const n = t[l];
    n && n.refreshConfig();
  }
  H(f, l, g, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: u
  });
})();
function je(f) {
  return f = f || {}, {
    sort: f.sort,
    filters: f.filters,
    search: f.search,
    offset: f.offset,
    limit: f.limit,
    queryGen: f.queryGen
  };
}
function Ht(f, l, v) {
  const b = !f || !!f.initializationError;
  return l && (v || b || !f.isLoaded) ? "remote" : f && !f.initializationError ? "store" : "none";
}
class Ke {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(l) {
    return l ? this._pending.has(l) ? Promise.reject(new Error(`Duplicate mutation requestId: ${l}`)) : new Promise((v, b) => {
      this._pending.set(l, { resolve: v, reject: b });
    }) : Promise.reject(new Error("Mutation requestId is required"));
  }
  resolve(l) {
    return this._settle(l, !1);
  }
  reject(l) {
    return this._settle(l, !0);
  }
  close(l) {
    const v = l || new Error("Mutation receipt registry closed");
    for (const b of this._pending.values()) b.reject(v);
    this._pending.clear();
  }
  _settle(l, v) {
    const b = l && l.requestId;
    if (!b) return !1;
    const g = this._pending.get(b);
    return g ? (this._pending.delete(b), v ? g.reject(l.error || new Error("Store mutation failed")) : g.resolve(l), !0) : !1;
  }
}
(function() {
  const f = "data-ln-data-coordinator", l = "lnDataCoordinator", v = "lnCoordinator", b = "data-ln-form-scope";
  if (window[l] !== void 0) return;
  const g = /* @__PURE__ */ new Set();
  let m = !1, h = null, c = null, p = null;
  function o() {
    m || (m = !0, h = function() {
      A(document, "ln-data-store:online", {}), g.forEach(function(e) {
        e._maybeSync();
      });
    }, c = function() {
      A(document, "ln-data-store:offline", {});
    }, p = function() {
      document.visibilityState === "visible" && g.forEach(function(e) {
        const a = e.findChildren(), r = a.store;
        r && a.connector && r.isInitialized && !r.initializationError && !r.isSyncing && !e._noAutosync && (!r.hasCache || e._isStale()) && r.forceSync();
      });
    }, window.addEventListener("online", h), window.addEventListener("offline", c), document.addEventListener("visibilitychange", p));
  }
  function d() {
    m && (g.size > 0 || (window.removeEventListener("online", h), window.removeEventListener("offline", c), document.removeEventListener("visibilitychange", p), h = null, c = null, p = null, m = !1));
  }
  function u() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (a) => {
        const r = Math.random() * 16 | 0;
        return (a === "x" ? r : r & 3 | 8).toString(16);
      });
    }
  }
  const t = ["ln-api-connector", "ln-couchdb-connector"];
  function n(e) {
    return this.dom = e, this._name = e.getAttribute(f), e[l] = this, e[v] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Ke(), this._dict = Wt(e, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), i(this), g.add(this), o(), this._checkInitialSync(), this;
  }
  n.prototype._parseStaleAttributes = function() {
    const a = this.findChildren().storeEl, r = this.dom.getAttribute("data-ln-data-coordinator-stale") || (a ? a.getAttribute("data-ln-data-store-stale") : null), _ = parseInt(r, 10);
    this._staleThreshold = r === "never" || r === "-1" ? -1 : isNaN(_) ? 300 : _;
    const y = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (a ? a.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!y;
  }, n.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const a = this.findChildren().store;
    return !a || !a.lastSyncedAt ? !0 : Date.now() / 1e3 - a.lastSyncedAt > this._staleThreshold;
  }, n.prototype._maybeSync = function() {
    const e = this.findChildren(), a = e.store;
    !a || a.initializationError || !e.connector || this._noAutosync || !a.isInitialized || a.isSyncing || (!a.hasCache || this._isStale()) && a.forceSync();
  }, n.prototype._checkInitialSync = function() {
    const e = this, r = this.findChildren().store;
    r && Promise.resolve(r.ready).then(function() {
      const _ = e.findChildren(), y = _.store;
      if (y && y.initializationError) {
        e._reportReconciliationError("store-initialize", y.initializationError, null);
        return;
      }
      !y || !_.connector || e._noAutosync || y.isSyncing || (!y.hasCache || e._isStale()) && y.forceSync();
    }).catch(function(_) {
      e._reportReconciliationError("store-initialize", _, null);
    });
  }, n.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const a = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    a && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(a)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(r) {
      return r;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(r) {
      return r;
    });
  }, n.prototype.findChildren = function() {
    const e = this.dom.querySelector("[data-ln-data-store]"), a = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), r = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: e,
      connectorEl: a,
      queueEl: r,
      store: e ? e.lnDataStore || e.lnStore : null,
      connector: a ? a.lnConnector || a.lnApiConnector || a.lnCouchDbConnector : null,
      queue: r ? r.lnApiQueue : null
    };
  }, n.prototype._handleSubmitRecord = function(e) {
    const a = this.findChildren();
    if (!a.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const r = e.data || {}, _ = r.id, y = r.expected_version, E = Object.assign({}, r);
    delete E.id, delete E.expected_version;
    const w = e.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(a, E, e.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(a, _, E, y, e.action);
  }, n.prototype._fanOutCreate = function(e, a, r) {
    this.refreshMapper();
    const _ = "_temp_" + u();
    A(e.storeEl, "ln-data-store:request-create", { tempId: _, data: a }), e.queue ? A(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: _,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(a),
      expectedVersion: null,
      meta: { tempId: _, action: r }
    }) : e.connector && A(e.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(a),
      url: r,
      meta: { entryId: u(), queued: !1, op: "create", tempId: _ }
    });
  }, n.prototype._fanOutUpdate = function(e, a, r, _, y) {
    this.refreshMapper(), A(e.storeEl, "ln-data-store:request-update", { id: a, data: r }), e.queue ? A(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: a,
      op: "update",
      targetId: a,
      payload: this.mapper.egress(r),
      expectedVersion: _,
      meta: { id: a, action: y }
    }) : e.connector && A(e.connectorEl, "ln-api-connector:request-update", {
      id: a,
      data: this.mapper.egress(r),
      expected_version: _,
      url: y,
      meta: { entryId: u(), queued: !1, op: "update", id: a }
    });
  }, n.prototype._fanOutDelete = function(e, a) {
    this.refreshMapper(), A(e.storeEl, "ln-data-store:request-delete", { id: a }), e.queue ? A(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: a,
      op: "delete",
      targetId: a,
      payload: null,
      expectedVersion: null,
      meta: { id: a }
    }) : e.connector && A(e.connectorEl, "ln-api-connector:request-delete", {
      id: a,
      meta: { entryId: u(), queued: !1, op: "delete", id: a }
    });
  }, n.prototype._fanOutBulkDelete = function(e, a) {
    this.refreshMapper();
    const r = a.join(",");
    A(e.storeEl, "ln-data-store:request-bulk-delete", { ids: a }), e.queue ? A(e.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: r,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: a },
      expectedVersion: null,
      meta: { bulkKey: r, ids: a }
    }) : e.connector && A(e.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: a,
      meta: { entryId: u(), queued: !1, op: "bulk-delete", bulkKey: r }
    });
  }, n.prototype._toastFromMessage = function(e) {
    e && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: e.type || "success",
        title: e.title || "",
        message: e.body || ""
      }
    }));
  }, n.prototype._toastFromDict = function(e) {
    const a = this._dict[e];
    a && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: a }
    }));
  }, n.prototype._requestStoreMutation = function(e, a, r) {
    const _ = e.storeEl;
    if (!_) return Promise.reject(new Error("Store element not found"));
    const y = u(), E = this._mutationReceipts.wait(y);
    try {
      A(_, "ln-data-store:request-" + a, Object.assign({}, r, { requestId: y }));
    } catch (w) {
      this._mutationReceipts.reject({ requestId: y, error: w });
    }
    return E;
  }, n.prototype._reportReconciliationError = function(e, a, r) {
    A(this.dom, "ln-data-coordinator:error", {
      operation: e,
      error: a,
      meta: r || null
    });
  };
  function i(e) {
    e._handlers = {
      sync: function(a) {
        e.refreshMapper();
        const r = e.findChildren();
        if (!r.store || !r.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        A(r.connectorEl, "ln-api-connector:request-sync", { since: a.detail.since, meta: { op: "sync" } });
      },
      reqCreate: function(a) {
        const r = e.findChildren();
        r.storeEl && e._fanOutCreate(r, a.detail.data || {}, a.detail.action);
      },
      reqUpdate: function(a) {
        const r = e.findChildren();
        r.storeEl && e._fanOutUpdate(r, a.detail.id, a.detail.data || {}, a.detail.expected_version, a.detail.action);
      },
      reqDelete: function(a) {
        const r = e.findChildren();
        r.storeEl && e._fanOutDelete(r, a.detail.id);
      },
      reqBulkDelete: function(a) {
        const r = e.findChildren();
        r.storeEl && e._fanOutBulkDelete(r, a.detail.ids || []);
      },
      queueFailed: function() {
        e._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(a) {
        e.refreshMapper();
        const r = e.findChildren();
        if (!r.store || !r.connector || !r.queue) return;
        const _ = a.detail || {}, y = _.entryId, E = _.op, w = _.targetId, S = _.payload, L = _.expectedVersion, q = _.meta || {}, k = q.action || null, R = _.idempotencyKey || y;
        E === "create" ? A(r.connectorEl, "ln-api-connector:request-create", {
          data: S,
          url: k,
          idempotencyKey: R,
          meta: { entryId: y, queued: !0, op: "create", tempId: q.tempId }
        }) : E === "update" ? A(r.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: S,
          expected_version: L,
          url: k,
          idempotencyKey: R,
          meta: { entryId: y, queued: !0, op: "update", id: w }
        }) : E === "delete" ? A(r.connectorEl, "ln-api-connector:request-delete", {
          id: w,
          idempotencyKey: R,
          meta: { entryId: y, queued: !0, op: "delete", id: w }
        }) : E === "bulk-delete" ? A(r.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: S && S.ids ? S.ids : [],
          idempotencyKey: R,
          meta: { entryId: y, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", E);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(a) {
        const r = a.target;
        if (a.defaultPrevented) return;
        const _ = r.hasAttribute(b) ? r.getAttribute(b) : null;
        if (_ === null) return;
        let y;
        if (_ ? y = _ === e._name : y = r.closest("[data-ln-data-coordinator]") === e.dom, !y) return;
        const E = qe(r);
        if (E !== "POST" && E !== "PUT" && E !== "PATCH") return;
        a.preventDefault();
        const w = se(r);
        delete w._method, delete w._token, e._handleSubmitRecord({ data: w, method: E, action: r.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(a) {
        const r = a.detail.meta || {}, _ = e.findChildren();
        e.refreshMapper();
        const y = a.detail.data;
        let E = [], w = [], S = null;
        Array.isArray(y) ? (E = y, S = Math.floor(Date.now() / 1e3)) : y && (E = Array.isArray(y.data) ? y.data : [], w = Array.isArray(y.deleted) ? y.deleted : [], S = y.synced_at !== void 0 ? y.synced_at : y.since !== void 0 ? y.since : null);
        const L = E.map((q) => e.mapper.ingress(q));
        if (_.store && !_.store.initializationError)
          _.store.applySync(L, w, S || Math.floor(Date.now() / 1e3), {
            total: a.detail.total,
            filtered: a.detail.filtered,
            offset: a.detail.offset,
            queryGen: a.detail.queryGen,
            targetEl: r.targetEl,
            kind: r.kind
          });
        else if (r.targetEl && r.kind) {
          if (r.kind === "table" || r.kind === "list")
            A(r.targetEl, "ln-" + r.kind + ":set-loading", { loading: !1 }), A(r.targetEl, "ln-" + r.kind + ":set-data", {
              data: L,
              total: a.detail.total !== void 0 ? a.detail.total : L.length,
              filtered: a.detail.filtered !== void 0 ? a.detail.filtered : L.length,
              offset: a.detail.offset,
              queryGen: a.detail.queryGen
            }), e._boundDelivered.set(r.targetEl, !0);
          else if (r.kind === "options")
            A(r.targetEl, "ln-options:set-data", { data: L });
          else if (r.kind === "stat") {
            const q = a.detail.filtered !== void 0 ? a.detail.filtered : a.detail.total !== void 0 ? a.detail.total : L.length;
            A(r.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(a) {
        const r = e.findChildren();
        if (!r.storeEl) return;
        const _ = a.detail.meta || {}, y = e.mapper.ingress(a.detail.record);
        e._requestStoreMutation(r, "update", { id: _.tempId, data: y }).then(function() {
          e._toastFromMessage(a.detail.message), _.queued && r.queue && A(r.queueEl, "ln-api-queue:resolve-create", {
            entryId: _.entryId,
            oldKey: _.tempId,
            newId: y.id
          });
        }).catch(function(E) {
          e._reportReconciliationError("create-reconcile", E, _);
        });
      },
      connUpdated: function(a) {
        const r = e.findChildren();
        if (!r.storeEl) return;
        const _ = a.detail.meta || {}, y = e.mapper.ingress(a.detail.record);
        e._requestStoreMutation(r, "update", { id: _.id, data: y }).then(function() {
          e._toastFromMessage(a.detail.message), _.queued && r.queue && A(r.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
        }).catch(function(E) {
          e._reportReconciliationError("update-reconcile", E, _);
        });
      },
      connDeleted: function(a) {
        const r = e.findChildren();
        if (!r.storeEl) return;
        const _ = a.detail.meta || {};
        e._toastFromMessage(a.detail.message), _.queued && r.queue && A(r.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      },
      connBulkDeleted: function(a) {
        const r = e.findChildren();
        if (!r.storeEl) return;
        const _ = a.detail.meta || {};
        e._toastFromMessage(a.detail.message), _.queued && r.queue && A(r.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      },
      connError: function(a) {
        const r = a.detail || {}, _ = r.meta || {}, y = _.op || r.action, E = r.status || 0, w = e.findChildren();
        if (y === "sync") {
          w.storeEl && A(w.storeEl, "ln-data-store:request-sync-failed", {
            error: r.error,
            status: E
          }), console.error("[ln-data-coordinator] Sync failed:", r.error);
          return;
        }
        if (y === "query") {
          _.targetEl && _.kind && A(_.targetEl, "ln-" + _.kind + ":set-loading", { loading: !1 }), e._reportReconciliationError("query", r.error || r, _);
          return;
        }
        if (!w.storeEl) return;
        const S = E === 401 || E === 419, L = E === 0 || E >= 500, q = E === 409;
        if (S) {
          e._toastFromDict("auth"), _.queued && w.queue && A(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "auth" });
          return;
        }
        if (L) {
          _.queued && w.queue ? A(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "retry" }) : e._toastFromDict("network");
          return;
        }
        let k = Promise.resolve();
        if (q && y === "update") {
          const R = r.data && r.data.remote ? e.mapper.ingress(r.data.remote) : null;
          R && (k = e._requestStoreMutation(w, "update", { id: _.id, data: R })), e._toastFromDict("conflict");
        } else y === "create" && (k = e._requestStoreMutation(w, "delete", { id: _.tempId })), e._toastFromDict("rejected");
        _.queued && w.queue ? k.then(function() {
          A(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "drop" });
        }).catch(function(R) {
          e._reportReconciliationError("deterministic-reconcile", R, _);
        }) : k.catch(function(R) {
          e._reportReconciliationError("deterministic-reconcile", R, _);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(a) {
        const r = e.findChildren(), _ = r.store;
        if (!_ || _.initializationError || !r.connector || e._noAutosync || _.isSyncing) return;
        (a.detail || {}).hasCache ? e._isStale() && _.forceSync() : _.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(a) {
        e._serveData(a, "table");
      },
      reqListData: function(a) {
        e._serveData(a, "list");
      },
      reqOptions: function(a) {
        e._serveOptions(a);
      },
      reqStat: function(a) {
        e._serveStat(a);
      },
      refresh: function(a) {
        e._mutationReceipts.resolve(a.detail), e._refreshAll();
      },
      mutationError: function(a) {
        e._mutationReceipts.reject(a.detail);
      },
      refreshSynced: function(a) {
        a.detail && a.detail.changed && e._refreshAll(a.detail.meta);
      }
    }, e.dom.addEventListener("ln-data-store:request-remote-sync", e._handlers.sync), e.dom.addEventListener("ln-data-coordinator:request-create", e._handlers.reqCreate), e.dom.addEventListener("ln-data-coordinator:request-update", e._handlers.reqUpdate), e.dom.addEventListener("ln-data-coordinator:request-delete", e._handlers.reqDelete), e.dom.addEventListener("ln-data-coordinator:request-bulk-delete", e._handlers.reqBulkDelete), e.dom.addEventListener("ln-api-queue:send", e._handlers.queueSend), e.dom.addEventListener("ln-api-queue:failed", e._handlers.queueFailed), e.dom.addEventListener("ln-data-store:initialized", e._handlers.storeInitialized), document.addEventListener("submit", e._handlers.formSubmit), t.forEach(function(a) {
      e.dom.addEventListener(a + ":fetched", e._handlers.connFetched), e.dom.addEventListener(a + ":created", e._handlers.connCreated), e.dom.addEventListener(a + ":updated", e._handlers.connUpdated), e.dom.addEventListener(a + ":deleted", e._handlers.connDeleted), e.dom.addEventListener(a + ":bulk-deleted", e._handlers.connBulkDeleted), e.dom.addEventListener(a + ":error", e._handlers.connError);
    }), document.addEventListener("ln-table:request-data", e._handlers.reqTableData), document.addEventListener("ln-list:request-data", e._handlers.reqListData), document.addEventListener("ln-options:request-data", e._handlers.reqOptions), document.addEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.addEventListener("ln-data-store:ready", e._handlers.refresh), e.dom.addEventListener("ln-data-store:loaded", e._handlers.refresh), e.dom.addEventListener("ln-data-store:created", e._handlers.refresh), e.dom.addEventListener("ln-data-store:updated", e._handlers.refresh), e.dom.addEventListener("ln-data-store:deleted", e._handlers.refresh), e.dom.addEventListener("ln-data-store:mutation-error", e._handlers.mutationError), e.dom.addEventListener("ln-data-store:synced", e._handlers.refreshSynced);
  }
  n.prototype._ownsStore = function(e) {
    const a = this.findChildren();
    return !!(a.store && a.store._name === e && e || this._name === e && e);
  }, n.prototype._serveData = function(e, a) {
    const r = e.target, _ = a === "table" ? "data-ln-table-store" : "data-ln-list-store", y = r.getAttribute(_) || r.getAttribute("data-ln-table-source") || r.getAttribute("data-ln-list-source");
    if (!y || !this._ownsStore(y)) return;
    const E = e.detail || {}, w = je(E);
    this._boundQueries.set(r, w);
    const S = this.findChildren(), L = this, q = E.offset != null, k = S.store;
    return (k && k.ready ? k.ready : Promise.resolve()).then(function() {
      const x = Ht(k, S.connector, q);
      if (x === "remote") {
        A(r, "ln-" + a + ":set-loading", { loading: !0 }), A(S.connectorEl, "ln-api-connector:request-query", {
          query: w,
          meta: { targetEl: r, kind: a }
        });
        return;
      }
      if (x !== "store") {
        A(r, "ln-" + a + ":set-loading", { loading: !1 });
        return;
      }
      return k.getAll(w).then(function(N) {
        const O = {
          data: N.data,
          total: N.total,
          filtered: N.filtered,
          offset: E.offset !== void 0 ? E.offset : N.offset,
          queryGen: E.queryGen !== void 0 ? E.queryGen : N.queryGen
        };
        A(r, "ln-" + a + ":set-data", O), L._boundDelivered.set(r, !0);
      });
    }).catch(function(x) {
      A(r, "ln-" + a + ":set-loading", { loading: !1 }), A(L.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: a,
        store: y,
        target: r,
        error: x
      });
    });
  }, n.prototype._serveOptions = function(e) {
    const a = e.target, r = a.getAttribute("data-ln-options");
    if (!this._ownsStore(r)) return;
    const _ = this.findChildren(), y = _.store, E = y && y.ready ? y.ready : Promise.resolve(), w = this;
    return E.then(function() {
      const S = Ht(y, _.connector, !1);
      if (S === "remote") {
        A(_.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: a, kind: "options" }
        });
        return;
      }
      if (S === "store")
        return y.getAll({}).then(function(L) {
          A(a, "ln-options:set-data", { data: L.data });
        });
    }).catch(function(S) {
      w._reportReconciliationError("options-query", S, { targetEl: a, kind: "options" });
    });
  }, n.prototype._serveStat = function(e) {
    const a = e.target, r = a.getAttribute("data-ln-stat");
    if (!this._ownsStore(r)) return;
    const _ = e.detail && e.detail.filters ? e.detail.filters : null, y = this.findChildren(), E = y.store, w = E && E.ready ? E.ready : Promise.resolve(), S = this;
    return w.then(function() {
      const L = Ht(E, y.connector, !1);
      if (L === "remote") {
        A(y.connectorEl, "ln-api-connector:request-query", {
          query: { filters: _ },
          meta: { targetEl: a, kind: "stat" }
        });
        return;
      }
      if (L === "store")
        return E.count(_).then(function(q) {
          A(a, "ln-stat:set-count", { count: q });
        });
    }).catch(function(L) {
      S._reportReconciliationError("stat-query", L, { targetEl: a, kind: "stat" });
    });
  }, n.prototype._refreshAll = function(e) {
    const a = this, r = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let _ = 0; _ < r.length; _++) {
      const y = r[_];
      let E, w;
      if (y.hasAttribute("data-ln-table-store") ? (E = y.getAttribute("data-ln-table-store"), w = "table") : y.hasAttribute("data-ln-list-store") ? (E = y.getAttribute("data-ln-list-store"), w = "list") : y.hasAttribute("data-ln-options") ? (E = y.getAttribute("data-ln-options"), w = "options") : y.hasAttribute("data-ln-stat") && (E = y.getAttribute("data-ln-stat"), w = "stat"), !this._ownsStore(E)) continue;
      const S = this.findChildren().store;
      if (w === "table" || w === "list") {
        const L = a._boundQueries.get(y) || { sort: null, filters: {}, search: "" };
        (function(q, k) {
          S.getAll(L).then(function(R) {
            const x = {
              data: R.data,
              total: e && e.total !== void 0 ? e.total : R.total,
              filtered: e && e.filtered !== void 0 ? e.filtered : R.filtered,
              offset: e && e.offset !== void 0 ? e.offset : L.offset,
              queryGen: e && e.queryGen !== void 0 ? e.queryGen : L.queryGen
            };
            A(q, "ln-" + k + ":set-loading", { loading: !1 }), A(q, "ln-" + k + ":set-data", x), a._boundDelivered.set(q, !0);
          });
        })(y, w);
      } else if (w === "options")
        (function(L) {
          S.getAll({}).then(function(q) {
            A(L, "ln-options:set-data", { data: q.data });
          });
        })(y);
      else if (w === "stat") {
        const L = y.getAttribute("data-ln-stat-filter");
        let q = null;
        if (L) {
          const k = L.indexOf(":");
          if (k !== -1) {
            const R = L.slice(0, k), x = L.slice(k + 1);
            q = {}, q[R] = [x];
          }
        }
        (function(k, R) {
          S.count(R).then(function(x) {
            A(k, "ln-stat:set-count", { count: x });
          });
        })(y, q);
      }
    }
  }, n.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const e = this;
    e._handlers && (e.dom.removeEventListener("ln-data-store:request-remote-sync", e._handlers.sync), e.dom.removeEventListener("ln-data-coordinator:request-create", e._handlers.reqCreate), e.dom.removeEventListener("ln-data-coordinator:request-update", e._handlers.reqUpdate), e.dom.removeEventListener("ln-data-coordinator:request-delete", e._handlers.reqDelete), e.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", e._handlers.reqBulkDelete), e.dom.removeEventListener("ln-api-queue:send", e._handlers.queueSend), e.dom.removeEventListener("ln-api-queue:failed", e._handlers.queueFailed), e.dom.removeEventListener("ln-data-store:initialized", e._handlers.storeInitialized), document.removeEventListener("submit", e._handlers.formSubmit), t.forEach(function(a) {
      e.dom.removeEventListener(a + ":fetched", e._handlers.connFetched), e.dom.removeEventListener(a + ":created", e._handlers.connCreated), e.dom.removeEventListener(a + ":updated", e._handlers.connUpdated), e.dom.removeEventListener(a + ":deleted", e._handlers.connDeleted), e.dom.removeEventListener(a + ":bulk-deleted", e._handlers.connBulkDeleted), e.dom.removeEventListener(a + ":error", e._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", e._handlers.reqTableData), document.removeEventListener("ln-list:request-data", e._handlers.reqListData), document.removeEventListener("ln-options:request-data", e._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.removeEventListener("ln-data-store:ready", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:loaded", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:created", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:updated", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:deleted", e._handlers.refresh), e.dom.removeEventListener("ln-data-store:mutation-error", e._handlers.mutationError), e.dom.removeEventListener("ln-data-store:synced", e._handlers.refreshSynced), e._handlers = null), e._boundQueries = null, e._boundDelivered = null, e._mutationReceipts.close(new Error("Data coordinator destroyed")), e._mutationReceipts = null, g.delete(this), d(), delete this.dom[l], delete this.dom[v];
  };
  function s(e, a) {
    const r = e[l];
    r && a === "data-ln-data-mapper" && r.refreshMapper();
  }
  H(f, l, n, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: s
  });
})();
const Ve = "ln_api_queue", We = 2, W = "outbox", X = "_queue_meta";
function Z(f, l) {
  return f.error || new Error(l);
}
function _t(f, l) {
  return f.bound([l, -1 / 0], [l, 1 / 0]);
}
function ie(f) {
  return "seq:" + f;
}
function Tt(f) {
  return "paused:" + f;
}
function re(f) {
  f.leaseOwner = null, f.leaseUntil = 0;
}
function Ge(f, l, v) {
  return typeof f != "string" || f.indexOf(l) === -1 ? f : f.split(l).join(v);
}
function Qe(f, l, v, b) {
  const g = /* @__PURE__ */ new Map(), m = [], h = [];
  for (const c of f || [])
    g.has(c.chainKey) || g.set(c.chainKey, []), g.get(c.chainKey).push(c);
  return g.forEach((c, p) => {
    c.sort((d, u) => d.seq - u.seq);
    const o = c[0];
    if (!(!o || o.status === "failed")) {
      if (o.status === "inflight" && (o.leaseUntil || 0) > b) {
        h.push({ chainKey: p, at: o.leaseUntil });
        return;
      }
      if ((o.nextAttemptAt || 0) > b) {
        h.push({ chainKey: p, at: o.nextAttemptAt });
        return;
      }
      o.status = "inflight", o.leaseOwner = l, o.leaseUntil = b + v, o.updatedAt = b, m.push(o);
    }
  }), { entries: m, wakeups: h };
}
function $e(f, l, v, b, g) {
  const m = [], h = [];
  for (const c of f || []) {
    if (c.entryId === l) {
      h.push(c.entryId);
      continue;
    }
    c.chainKey === v && (c.chainKey = b, c.targetId === v && (c.targetId = b), c.meta && c.meta.id === v && (c.meta.id = b), c.meta && typeof c.meta.action == "string" && (c.meta.action = Ge(c.meta.action, v, b)), c.updatedAt = g, m.push(c));
  }
  return { changed: m, deleted: h };
}
class Ye {
  constructor(l) {
    l = l || {}, this.indexedDB = l.indexedDB || globalThis.indexedDB, this.keyRange = l.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = l.dbName || Ve, this.now = l.now || (() => Date.now()), this.uuid = l.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((l, v) => {
      const b = this.indexedDB.open(this.dbName, We);
      b.onupgradeneeded = (g) => {
        const m = g.target.result;
        let h;
        m.objectStoreNames.contains(W) ? h = g.target.transaction.objectStore(W) : h = m.createObjectStore(W, { keyPath: "entryId" }), h.indexNames.contains("by_scope_chain") || h.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), h.indexNames.contains("by_scope_seq") || h.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(X) || m.createObjectStore(X, { keyPath: "key" });
      }, b.onerror = () => v(Z(b, "Queue database open failed")), b.onsuccess = (g) => {
        this._db = g.target.result, this._db.onversionchange = () => this.close(), l(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((l, v) => {
      const b = this.indexedDB.deleteDatabase(this.dbName);
      b.onsuccess = () => l(), b.onerror = () => v(Z(b, "Queue database delete failed")), b.onblocked = () => v(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(l) {
    return this.open().then((v) => v ? new Promise((b, g) => {
      const h = v.transaction(W, "readonly").objectStore(W).index("by_scope_seq").getAll(_t(this.keyRange, l));
      h.onsuccess = () => b(h.result || []), h.onerror = () => g(Z(h, "Queue scope read failed"));
    }) : []);
  }
  enqueue(l, v) {
    return v = v || {}, this.open().then((b) => b ? new Promise((g, m) => {
      const h = b.transaction([X, W], "readwrite"), c = h.objectStore(X), p = h.objectStore(W), o = ie(l);
      let d = null;
      const u = (n) => {
        const i = n + 1;
        d = {
          entryId: this.uuid(),
          scope: l,
          chainKey: v.chainKey,
          seq: i,
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
        }, c.put({ key: o, value: i }), p.put(d);
      }, t = c.get(o);
      t.onerror = () => m(Z(t, "Queue sequence read failed")), t.onsuccess = () => {
        const n = t.result;
        if (n && typeof n.value == "number") {
          u(n.value);
          return;
        }
        const i = p.index("by_scope_seq").getAll(_t(this.keyRange, l));
        i.onerror = () => m(Z(i, "Queue sequence migration failed")), i.onsuccess = () => {
          const s = (i.result || []).reduce((e, a) => Math.max(e, a.seq || 0), 0);
          u(s);
        };
      }, h.oncomplete = () => g(d), h.onerror = () => m(h.error || new Error("Queue enqueue transaction failed")), h.onabort = () => m(h.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(l, v, b) {
    return this.open().then((g) => g ? new Promise((m, h) => {
      const c = g.transaction(W, "readwrite"), p = c.objectStore(W), o = p.index("by_scope_seq").getAll(_t(this.keyRange, l)), d = this.now();
      let u = { entries: [], wakeups: [] };
      o.onerror = () => h(Z(o, "Queue claim read failed")), o.onsuccess = () => {
        u = Qe(o.result || [], v, b, d);
        for (const t of u.entries) p.put(t);
      }, c.oncomplete = () => m(u), c.onerror = () => h(c.error || new Error("Queue claim transaction failed")), c.onabort = () => h(c.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(l, v) {
    return this._updateEntry(l, v, (b, g) => (g.delete(b.entryId), { status: "acked", entry: b }));
  }
  nack(l, v, b, g) {
    g = g || {};
    const m = g.maxAttempts || 8, h = g.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((c) => c ? new Promise((p, o) => {
      const d = c.transaction([W, X], "readwrite"), u = d.objectStore(W), t = d.objectStore(X), n = u.get(v);
      let i = null;
      n.onerror = () => o(Z(n, "Queue nack read failed")), n.onsuccess = () => {
        const s = n.result;
        if (!(!s || s.scope !== l)) {
          if (b === "drop") {
            u.delete(s.entryId), i = { status: "dropped", entry: s };
            return;
          }
          if (re(s), s.updatedAt = this.now(), b === "auth") {
            s.status = "pending", u.put(s), t.put({ key: Tt(l), value: !0 }), i = { status: "auth", entry: s };
            return;
          }
          if (b === "retry") {
            if (s.attempts = (s.attempts || 0) + 1, s.attempts >= m) {
              s.status = "failed", s.nextAttemptAt = 0, u.put(s), i = { status: "failed", entry: s };
              return;
            }
            const e = h[Math.min(s.attempts - 1, h.length - 1)];
            s.status = "pending", s.nextAttemptAt = this.now() + e, u.put(s), i = { status: "retry", entry: s, delay: e };
          }
        }
      }, d.oncomplete = () => p(i), d.onerror = () => o(d.error || new Error("Queue nack transaction failed")), d.onabort = () => o(d.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(l, v, b) {
    return this._remapTransaction(l, null, v, b);
  }
  resolveCreate(l, v, b, g) {
    return this._remapTransaction(l, v, b, g);
  }
  _remapTransaction(l, v, b, g) {
    return this.open().then((m) => m ? new Promise((h, c) => {
      const p = m.transaction(W, "readwrite"), o = p.objectStore(W), d = o.index("by_scope_seq").getAll(_t(this.keyRange, l));
      let u = { changed: [], deleted: [] };
      d.onerror = () => c(Z(d, "Queue remap read failed")), d.onsuccess = () => {
        u = $e(d.result || [], v, b, g, this.now());
        for (const t of u.deleted) o.delete(t);
        for (const t of u.changed) o.put(t);
      }, p.oncomplete = () => h(u.changed), p.onerror = () => c(p.error || new Error("Queue remap transaction failed")), p.onabort = () => c(p.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(l) {
    return this.open().then((v) => v ? new Promise((b, g) => {
      const m = v.transaction(W, "readwrite"), h = m.objectStore(W), c = h.index("by_scope_seq").getAll(_t(this.keyRange, l));
      let p = 0;
      c.onerror = () => g(Z(c, "Queue failed-entry read failed")), c.onsuccess = () => {
        for (const o of c.result || [])
          o.status === "failed" && (o.status = "pending", o.attempts = 0, o.nextAttemptAt = 0, o.updatedAt = this.now(), re(o), h.put(o), p++);
      }, m.oncomplete = () => b(p), m.onerror = () => g(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => g(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(l) {
    return this.open().then((v) => v ? new Promise((b, g) => {
      const h = v.transaction(X, "readonly").objectStore(X).get(Tt(l));
      h.onsuccess = () => b(!!(h.result && h.result.value)), h.onerror = () => g(Z(h, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(l, v) {
    return this.open().then((b) => {
      if (b)
        return new Promise((g, m) => {
          const h = b.transaction(X, "readwrite");
          h.objectStore(X).put({ key: Tt(l), value: !!v }), h.oncomplete = () => g(), h.onerror = () => m(h.error || new Error("Queue pause-state write failed")), h.onabort = () => m(h.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(l) {
    return this.open().then((v) => {
      if (v)
        return new Promise((b, g) => {
          const m = v.transaction([W, X], "readwrite"), c = m.objectStore(W).index("by_scope_seq").openCursor(_t(this.keyRange, l));
          c.onsuccess = (p) => {
            const o = p.target.result;
            o && (o.delete(), o.continue());
          }, c.onerror = () => g(Z(c, "Queue clear failed")), m.objectStore(X).delete(ie(l)), m.objectStore(X).delete(Tt(l)), m.oncomplete = () => b(), m.onerror = () => g(m.error || new Error("Queue clear transaction failed")), m.onabort = () => g(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(l, v, b) {
    return this.open().then((g) => g ? new Promise((m, h) => {
      const c = g.transaction(W, "readwrite"), p = c.objectStore(W), o = p.get(v);
      let d = null;
      o.onerror = () => h(Z(o, "Queue entry read failed")), o.onsuccess = () => {
        const u = o.result;
        !u || u.scope !== l || (d = b(u, p));
      }, c.oncomplete = () => m(d), c.onerror = () => h(c.error || new Error("Queue entry transaction failed")), c.onabort = () => h(c.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const f = "data-ln-api-queue", l = "lnApiQueue", v = [2e3, 5e3, 15e3, 6e4, 3e5], b = 8, g = 6e4;
  if (window[l] !== void 0) return;
  function m() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (d) => {
        const u = Math.random() * 16 | 0;
        return (d === "x" ? u : u & 3 | 8).toString(16);
      });
    }
  }
  const h = new Ye({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: m
  });
  function c(o) {
    this.dom = o, o[l] = this;
    const d = o.closest("[data-ln-data-coordinator]");
    this.scope = o.getAttribute(f) || (d ? d.getAttribute("data-ln-data-coordinator") : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = m(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const u = this;
    return h.open().then((t) => t ? h.getPaused(u.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((t) => (u._paused = !!t, u._paused && A(u.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), u._emitPendingCount())).then(() => u._drain()).catch((t) => {
      console.error("[ln-api-queue] Initialization failed:", t), A(u.dom, "ln-api-queue:error", { operation: "initialize", error: t });
    }), this;
  }
  c.prototype._isOnline = function() {
    const o = this.dom.getAttribute("data-ln-api-queue-online");
    return o === "true" ? !0 : o === "false" ? !1 : navigator.onLine;
  }, c.prototype._emitPendingCount = function() {
    const o = this;
    return h.allForScope(o.scope).then((d) => (A(o.dom, "ln-api-queue:pending-count", { count: d.length, scope: o.scope }), d.length === 0 && A(o.dom, "ln-api-queue:drained", { scope: o.scope }), d));
  }, c.prototype._clearTimer = function(o) {
    const d = this._timers.get(o);
    d && (clearTimeout(d), this._timers.delete(o));
  }, c.prototype._scheduleTimer = function(o, d) {
    const u = Math.max(0, d), t = this._timers.get(o);
    t && clearTimeout(t);
    const n = this, i = setTimeout(() => {
      n._timers.delete(o), n._drain();
    }, u);
    this._timers.set(o, i);
  }, c.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = h.claimReady(o.scope, o._workerId, g).then((d) => {
      for (const u of d.wakeups)
        o._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of d.entries)
        o._clearTimer(u.chainKey), A(o.dom, "ln-api-queue:send", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          op: u.op,
          targetId: u.targetId,
          payload: u.payload,
          expectedVersion: u.expectedVersion,
          idempotencyKey: u.entryId,
          meta: u.meta
        });
    }).catch((d) => {
      console.error("[ln-api-queue] Drain failed:", d), A(o.dom, "ln-api-queue:error", { operation: "drain", error: d });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, c.prototype._onEnqueue = function(o) {
    const d = this;
    return h.enqueue(d.scope, o.detail || {}).then((u) => {
      if (u)
        return d._emitPendingCount().then((t) => (A(d.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: t.length
        }), d._drain()));
    }).catch((u) => {
      A(d.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, c.prototype._onAck = function(o) {
    const d = this, u = o.detail || {};
    return h.ack(d.scope, u.entryId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((t) => {
      A(d.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: t });
    });
  }, c.prototype._onNack = function(o) {
    const d = this, u = o.detail || {};
    return h.nack(d.scope, u.entryId, u.reason, {
      maxAttempts: b,
      backoff: v
    }).then((t) => {
      if (t)
        return t.status === "failed" ? A(d.dom, "ln-api-queue:failed", {
          entryId: t.entry.entryId,
          chainKey: t.entry.chainKey,
          attempts: t.entry.attempts
        }) : t.status === "retry" ? d._scheduleTimer(t.entry.chainKey, t.delay) : t.status === "auth" && (d._paused = !0, A(d.dom, "ln-api-queue:paused", { reason: "auth" }), A(d.dom, "ln-api-queue:auth-required", {
          entryId: t.entry.entryId,
          chainKey: t.entry.chainKey
        })), d._emitPendingCount().then(() => {
          if (t.status === "dropped") return d._drain();
        });
    }).catch((t) => {
      A(d.dom, "ln-api-queue:error", { operation: "nack", entryId: u.entryId, error: t });
    });
  }, c.prototype._onRemap = function(o) {
    const d = this, u = o.detail || {};
    return h.remap(d.scope, u.oldKey, u.newId).catch((t) => {
      A(d.dom, "ln-api-queue:error", { operation: "remap", error: t });
    });
  }, c.prototype._onResolveCreate = function(o) {
    const d = this, u = o.detail || {};
    return h.resolveCreate(d.scope, u.entryId, u.oldKey, u.newId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((t) => {
      A(d.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
        error: t
      });
    });
  }, c.prototype._onResume = function() {
    const o = this;
    return h.setPaused(o.scope, !1).then(() => (o._paused = !1, A(o.dom, "ln-api-queue:resumed", {}), o._drain())).catch((d) => {
      A(o.dom, "ln-api-queue:error", { operation: "resume", error: d });
    });
  }, c.prototype._onDrain = function() {
    const o = this;
    return h.resetFailed(o.scope).then(() => {
      const d = o._drainPromise;
      return d ? d.then(() => o._drain()) : o._drain();
    }).catch((d) => {
      A(o.dom, "ln-api-queue:error", { operation: "manual-drain", error: d });
    });
  }, c.prototype._onClear = function() {
    const o = this;
    return o._timers.forEach((d) => clearTimeout(d)), o._timers.clear(), h.clear(o.scope).then(() => {
      o._paused = !1, A(o.dom, "ln-api-queue:pending-count", { count: 0, scope: o.scope }), A(o.dom, "ln-api-queue:drained", { scope: o.scope });
    }).catch((d) => {
      A(o.dom, "ln-api-queue:error", { operation: "clear", error: d });
    });
  }, c.prototype._bindEvents = function() {
    const o = this;
    o._handlers = {
      enqueue: (d) => o._onEnqueue(d),
      ack: (d) => o._onAck(d),
      nack: (d) => o._onNack(d),
      remap: (d) => o._onRemap(d),
      resolveCreate: (d) => o._onResolveCreate(d),
      resume: () => o._onResume(),
      drain: () => o._onDrain(),
      clear: () => o._onClear()
    }, o.dom.addEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.addEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.addEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.addEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.addEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.addEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.addEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.addEventListener("ln-api-queue:request-clear", o._handlers.clear);
  }, c.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const o = this;
    o.dom.removeEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.removeEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.removeEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.removeEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.removeEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.removeEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.removeEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.removeEventListener("ln-api-queue:request-clear", o._handlers.clear), window.removeEventListener("online", o._onlineHandler), o._timers.forEach((d) => clearTimeout(d)), o._timers.clear(), A(o.dom, "ln-api-queue:destroyed", { scope: o.scope }), delete o.dom[l];
  };
  function p(o) {
    const d = o[l];
    d && d._drain();
  }
  H(f, l, c, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: p
  });
})();
(function() {
  const f = "data-ln-options", l = "lnOptions";
  if (window[l] !== void 0) return;
  function v(b) {
    this.dom = b, this._storeName = b.getAttribute(f), this._valueField = b.getAttribute("data-ln-options-value") || "id", this._labelField = b.getAttribute("data-ln-options-label") || "name";
    const g = this;
    return this._onSetData = function(m) {
      g._rebuild(m.detail.data || []);
    }, b.addEventListener("ln-options:set-data", this._onSetData), A(b, "ln-options:request-data", { options: this._storeName }), this;
  }
  v.prototype._rebuild = function(b) {
    const g = this.dom, m = this._valueField, h = this._labelField, c = g.value, p = g.querySelectorAll("option");
    for (let d = p.length - 1; d >= 0; d--)
      p[d].value !== "" && g.removeChild(p[d]);
    for (let d = 0; d < b.length; d++) {
      const u = b[d], t = document.createElement("option");
      t.value = String(u[m]), t.textContent = u[h] != null ? u[h] : "", g.appendChild(t);
    }
    const o = g.options;
    for (let d = 0; d < o.length; d++)
      if (o[d].value === c) {
        g.value = c;
        break;
      }
  }, v.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[l]);
  }, H(f, l, v, "ln-options");
})();
(function() {
  const f = "data-ln-stat", l = "lnStat";
  if (window[l] !== void 0) return;
  function v(g) {
    if (!g) return null;
    const m = g.indexOf(":");
    if (m === -1) return null;
    const h = g.slice(0, m), c = g.slice(m + 1), p = {};
    return p[h] = [c], p;
  }
  function b(g) {
    return this.dom = g, this._storeName = g.getAttribute(f), this._filters = v(g.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      g.textContent = String(m.detail.count), g.classList.remove("is-loading");
    }, g.addEventListener("ln-stat:set-count", this._onSetCount), A(g, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  b.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[l]);
  }, H(f, l, b, "ln-stat");
})();
(function() {
  const f = "ln-icon-sprite", l = "#ln-icon-", v = "#ln-icon-custom-", b = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let m = null;
  const h = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), c = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), p = "lni:", o = "lni:v", d = "1";
  function u() {
    try {
      if (localStorage.getItem(o) !== d) {
        for (let r = localStorage.length - 1; r >= 0; r--) {
          const _ = localStorage.key(r);
          _ && _.indexOf(p) === 0 && localStorage.removeItem(_);
        }
        localStorage.setItem(o, d);
      }
    } catch {
    }
  }
  u();
  function t() {
    return m || (m = document.getElementById(f), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = f, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function n(r) {
    return r.indexOf(v) === 0 ? c + "/" + r.slice(v.length) + ".svg" : h + "/" + r.slice(l.length) + ".svg";
  }
  function i(r, _) {
    const y = _.match(/viewBox="([^"]+)"/), E = y ? y[1] : "0 0 24 24", w = _.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), S = w ? w[1].trim() : "", L = _.match(/<svg([^>]*)>/i), q = L ? L[1] : "", k = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    k.id = r, k.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(R) {
      const x = q.match(new RegExp(R + '="([^"]*)"'));
      x && k.setAttribute(R, x[1]);
    }), k.innerHTML = S, t().querySelector("defs").appendChild(k);
  }
  function s(r) {
    if (console.log("[ln-icon] _load called for:", r), b.has(r) || g.has(r)) return;
    if (r.indexOf(v) === 0 && !c) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", r);
      return;
    }
    const _ = r.slice(1);
    try {
      const E = localStorage.getItem(p + _);
      if (E) {
        console.log("[ln-icon] Cache hit for:", _), i(_, E), b.add(r);
        return;
      }
    } catch {
    }
    g.add(r);
    const y = n(r);
    console.log("[ln-icon] Fetching from CDN:", y), fetch(y).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      console.log("[ln-icon] Fetch succeeded for:", _), i(_, E), b.add(r), g.delete(r);
      try {
        localStorage.setItem(p + _, E);
      } catch {
      }
    }).catch(function(E) {
      console.error("[ln-icon] Fetch failed for:", _, E), g.delete(r);
    });
  }
  function e(r) {
    const _ = 'use[href^="' + l + '"], use[href^="' + v + '"]', y = r.querySelectorAll ? r.querySelectorAll(_) : [];
    if (r.matches && r.matches(_)) {
      const E = r.getAttribute("href");
      E && s(E);
    }
    Array.prototype.forEach.call(y, function(E) {
      const w = E.getAttribute("href");
      w && s(w);
    });
  }
  function a() {
    e(document), new MutationObserver(function(r) {
      r.forEach(function(_) {
        if (_.type === "childList")
          _.addedNodes.forEach(function(y) {
            y.nodeType === 1 && e(y);
          });
        else if (_.type === "attributes" && _.attributeName === "href") {
          const y = _.target.getAttribute("href");
          y && (y.indexOf(l) === 0 || y.indexOf(v) === 0) && s(y);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
(function() {
  const f = "data-ln-debug", l = "lnDebug";
  if (window[l] !== void 0) return;
  function v(b) {
    return this.dom = b, this;
  }
  v.prototype.destroy = function() {
    delete this.dom[l];
  }, H(f, l, v, "ln-debug");
})();
