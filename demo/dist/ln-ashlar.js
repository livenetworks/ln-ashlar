if (typeof window < "u") {
  const f = console.warn;
  console.warn = function(...d) {
    typeof d[0] == "string" && (d[0].startsWith("[ln-") || d[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || f.apply(console, d);
  };
}
const Ct = {};
function vt(f, d) {
  Ct[f] || (Ct[f] = document.querySelector('[data-ln-template="' + f + '"]'));
  const E = Ct[f];
  return E ? E.content.cloneNode(!0) : (console.warn("[" + (d || "ln-core") + '] Template "' + f + '" not found'), null);
}
function S(f, d, E) {
  f.dispatchEvent(new CustomEvent(d, {
    bubbles: !0,
    detail: E || {}
  }));
}
function V(f, d, E) {
  const y = new CustomEvent(d, {
    bubbles: !0,
    cancelable: !0,
    detail: E || {}
  });
  return f.dispatchEvent(y), y;
}
function jt(f, d, E) {
  f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter();
  const y = {
    sort: f.currentSort,
    filters: f.currentFilters,
    search: f.currentSearch
  };
  y[E] = f.name, S(f.dom, d, y);
}
function J(f, d) {
  if (!f || !d) return f;
  const E = f.querySelectorAll("[data-ln-field]");
  for (let u = 0; u < E.length; u++) {
    const a = E[u], t = a.getAttribute("data-ln-field");
    d[t] != null && (a.textContent = d[t]);
  }
  const y = f.querySelectorAll("[data-ln-attr]");
  for (let u = 0; u < y.length; u++) {
    const a = y[u], t = a.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < t.length; n++) {
      const i = t[n].trim().split(":");
      if (i.length !== 2) continue;
      const r = i[0].trim(), p = i[1].trim();
      d[p] != null && a.setAttribute(r, d[p]);
    }
  }
  const _ = f.querySelectorAll("[data-ln-show]");
  for (let u = 0; u < _.length; u++) {
    const a = _[u], t = a.getAttribute("data-ln-show");
    t in d && a.classList.toggle("hidden", !d[t]);
  }
  const m = f.querySelectorAll("[data-ln-class]");
  for (let u = 0; u < m.length; u++) {
    const a = m[u], t = a.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < t.length; n++) {
      const i = t[n].trim().split(":");
      if (i.length !== 2) continue;
      const r = i[0].trim(), p = i[1].trim();
      p in d && a.classList.toggle(r, !!d[p]);
    }
  }
  return f;
}
function ce(f, d) {
  f.matches && f.matches("[data-ln-form], [data-ln-fillable]") && f.dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  const E = f.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let y = 0; y < E.length; y++)
    E[y].dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  return f;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(f) {
  if (!(!f.target.matches || !f.target.matches("[data-ln-fillable]")))
    if (f.detail)
      J(f.target, f.detail);
    else {
      const d = f.target.querySelectorAll("[data-ln-field]");
      for (let E = 0; E < d.length; E++)
        d[E].textContent = "";
    }
})));
function bt(f, d) {
  if (!f || !d) return f;
  const E = document.createTreeWalker(f, NodeFilter.SHOW_TEXT);
  for (; E.nextNode(); ) {
    const m = E.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(u, a) {
        return d[a] !== void 0 ? d[a] : "";
      }
    ));
  }
  const y = function(m, u) {
    return d[u] !== void 0 ? d[u] : "";
  }, _ = Array.from(f.querySelectorAll("*"));
  f.nodeType === 1 && _.push(f);
  for (let m = 0; m < _.length; m++) {
    const u = _[m], a = u.attributes;
    for (let t = 0; t < a.length; t++) {
      const n = a[t];
      n.value.indexOf("{{") !== -1 && u.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, y));
    }
  }
  return f;
}
function de(f, d, E, y, _, m) {
  const u = {};
  for (let t = 0; t < f.children.length; t++) {
    const n = f.children[t], i = n.getAttribute("data-ln-key");
    i && (u[i] = n);
  }
  const a = document.createDocumentFragment();
  for (let t = 0; t < d.length; t++) {
    const n = d[t], i = String(y(n));
    let r = u[i];
    if (r)
      _(r, n, t);
    else {
      const p = vt(E, m);
      if (!p || (bt(p, n), r = p.firstElementChild, !r)) continue;
      r.setAttribute("data-ln-key", i), _(r, n, t);
    }
    a.appendChild(r);
  }
  f.textContent = "", f.appendChild(a);
}
function G(f, d) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      G(f, d);
    }), console.warn("[" + d + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  f();
}
function dt(f, d, E) {
  if (f) {
    const y = f.querySelector('[data-ln-template="' + d + '"]');
    if (y) return y.content.cloneNode(!0);
  }
  return vt(d, E);
}
function Kt(f, d) {
  const E = {}, y = f.querySelectorAll("[" + d + "]");
  for (let _ = 0; _ < y.length; _++)
    E[y[_].getAttribute(d)] = y[_].textContent, y[_].remove();
  return E;
}
function Tt(f, d, E, y) {
  if (f.nodeType !== 1) return;
  const m = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", u = Array.from(f.querySelectorAll(m));
  f.matches && f.matches(m) && u.push(f);
  for (const a of u)
    a[E] || (a[E] = new y(a));
}
function mt(f) {
  return !!(f.offsetWidth || f.offsetHeight || f.getClientRects().length);
}
function zt(f, d) {
  const E = !!(d && d.typed), y = d && d.exclude, _ = {}, m = f.elements, u = {};
  if (E)
    for (let a = 0; a < m.length; a++) {
      const t = m[a];
      t.name && t.type === "checkbox" && !t.disabled && (u[t.name] = (u[t.name] || 0) + 1);
    }
  for (let a = 0; a < m.length; a++) {
    const t = m[a];
    if (!(!t.name || t.disabled || t.type === "file" || t.type === "submit" || t.type === "button") && !(y && t.matches && t.matches(y)))
      if (t.type === "checkbox")
        E && u[t.name] === 1 ? _[t.name] = t.checked : (_[t.name] || (_[t.name] = []), t.checked && _[t.name].push(t.value));
      else if (t.type === "radio")
        t.checked && (_[t.name] = t.value);
      else if (t.type === "select-multiple") {
        _[t.name] = [];
        for (let n = 0; n < t.options.length; n++)
          t.options[n].selected && _[t.name].push(t.options[n].value);
      } else if (E && t.type === "hidden")
        _[t.name] = t.value;
      else if (E && (t.type === "number" || t.type === "range")) {
        const n = Number(t.value);
        _[t.name] = t.value === "" || isNaN(n) ? null : n;
      } else
        _[t.name] = t.value;
  }
  return _;
}
function ue(f) {
  if (typeof f != "string") return !!f;
  const d = f.trim().toLowerCase();
  return d !== "false" && d !== "0" && d !== "" && d !== "off" && d !== "no";
}
function Vt(f, d) {
  const E = f.elements, y = [], _ = {};
  for (let m = 0; m < E.length; m++) {
    const u = E[m];
    u.name && u.type === "checkbox" && (_[u.name] = (_[u.name] || 0) + 1);
  }
  for (let m = 0; m < E.length; m++) {
    const u = E[m];
    if (u.type === "file" || u.type === "submit" || u.type === "button") continue;
    const a = u.getAttribute("data-ln-fill-as") || u.name;
    if (!a || !(a in d)) continue;
    const t = d[a];
    if (u.type === "checkbox") {
      if (Array.isArray(t))
        u.checked = t.indexOf(u.value) !== -1;
      else if (_[u.name] > 1) {
        const n = String(t).split(",").map(function(i) {
          return i.trim();
        });
        u.checked = n.indexOf(u.value) !== -1;
      } else
        u.checked = ue(t);
      y.push(u);
    } else if (u.type === "radio")
      u.checked = u.value === String(t), y.push(u);
    else if (u.type === "select-multiple") {
      if (Array.isArray(t))
        for (let n = 0; n < u.options.length; n++)
          u.options[n].selected = t.indexOf(u.options[n].value) !== -1;
      y.push(u);
    } else
      u.value = t, y.push(u);
  }
  return y;
}
function W(f) {
  const d = f ? f.closest("[lang]") : null;
  return (d ? d.lang : null) || (document.documentElement ? document.documentElement.lang : null) || navigator.language;
}
function Ft(f) {
  return f.hasAttribute("data-ln-value") ? f.getAttribute("data-ln-value") : f.textContent.trim();
}
function Wt(f, d, { get: E, set: y }) {
  Object.defineProperty(f, "value", {
    get: function() {
      return E ? E.call(this) : d.get.call(this);
    },
    set: function(_) {
      y ? y.call(this, _, (m) => d.set.call(this, m)) : d.set.call(this, _);
    },
    configurable: !0
  });
}
function P(f, d, E, y, _ = {}) {
  const m = _.extraAttributes || [], u = _.onAttributeChange || null, a = _.onInit || null;
  function t(n) {
    const i = n || document.body;
    Tt(i, f, d, E), a && a(i);
  }
  return G(function() {
    const n = new MutationObserver(function(r) {
      for (let p = 0; p < r.length; p++) {
        const l = r[p];
        if (l.type === "childList") {
          for (let s = 0; s < l.addedNodes.length; s++) {
            const e = l.addedNodes[s];
            e.nodeType === 1 && (Tt(e, f, d, E), a && a(e));
          }
          for (let s = 0; s < l.removedNodes.length; s++) {
            const e = l.removedNodes[s];
            if (e.nodeType === 1) {
              const c = f.indexOf("[") !== -1 || f.indexOf(".") !== -1 || f.indexOf("#") !== -1 ? f : "[" + f + "]", o = Array.from(e.querySelectorAll(c));
              e.matches && e.matches(c) && o.push(e);
              for (let v = 0; v < o.length; v++) {
                const g = o[v];
                if (!document.contains(g)) {
                  const b = g[d];
                  b && typeof b.destroy == "function" && b.destroy();
                }
              }
            }
          }
        } else l.type === "attributes" && (u && l.target[d] ? u(l.target, l.attributeName) : (Tt(l.target, f, d, E), a && a(l.target)));
      }
    });
    let i = [];
    if (f.indexOf("[") !== -1) {
      const r = /\[([\w-]+)/g;
      let p;
      for (; (p = r.exec(f)) !== null; )
        i.push(p[1]);
    } else
      i.push(f);
    n.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: i.concat(m)
    });
  }, y || (f.indexOf("[") === -1 ? f.replace("data-", "") : "component")), window[d] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function $t(f, d) {
  if (f.ctrlKey || f.metaKey || f.shiftKey || f.altKey || f.button !== 0 || !d) return !1;
  const E = d.getAttribute("href");
  return !(!E || d.getAttribute("target") === "_blank" || d.hasAttribute("download") || E.startsWith("mailto:") || E.startsWith("tel:") || E === "#" || E.startsWith("#") || d.hostname && d.hostname !== window.location.hostname);
}
function $(...f) {
  return f.filter((d) => d != null && d !== "").map((d, E) => E === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function it(f, d) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, f, d ? { Authorization: d } : null);
}
function Gt(f, d = "ln-core") {
  try {
    return f ? JSON.parse(f) : {};
  } catch (E) {
    return console.error(`[${d}] Invalid headers JSON:`, E), {};
  }
}
const Yt = {};
function he(f, d) {
  Yt[f] = d;
}
function fe(f) {
  return Yt[f] || { ingress: (d) => d, egress: (d) => d };
}
const Xt = {};
function Ot(f, d) {
  if (!f || typeof d != "object") return;
  const E = f.toLowerCase().split("-")[0];
  Xt[E] = d;
}
function _t(f) {
  if (!f) return null;
  const d = f.toLowerCase().split("-")[0];
  return Xt[d] || null;
}
Ot("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = he, window.lnCore.getDataMapper = fe, window.lnCore.registerLocaleFallback = Ot, window.lnCore.getLocaleFallback = _t, window.lnCore.fillTemplate = bt, window.lnCore.fill = J, window.lnCore.lnFill = ce, window.lnCore.renderList = de);
function pe(f, d) {
  let E = !1;
  return function() {
    E || (E = !0, queueMicrotask(function() {
      E = !1, f(), d && d();
    }));
  };
}
const me = "ln:";
function _e() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Jt(f, d) {
  const E = d.getAttribute("data-ln-persist"), y = E !== null && E !== "" ? E : d.id;
  return y ? me + f + ":" + _e() + ":" + y : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', d), null);
}
function wt(f, d) {
  const E = Jt(f, d);
  if (!E) return null;
  try {
    const y = localStorage.getItem(E);
    return y !== null ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
function lt(f, d, E) {
  const y = Jt(f, d);
  if (y)
    try {
      E == null ? localStorage.removeItem(y) : localStorage.setItem(y, JSON.stringify(E));
    } catch {
    }
}
function Qt(f) {
  return (f || "").replace(/^#/, "");
}
function St(f) {
  const d = f === void 0 ? location.hash : f, E = {}, y = Qt(d);
  if (!y) return E;
  const _ = y.split("&");
  for (let m = 0; m < _.length; m++) {
    const u = _[m];
    if (!u) continue;
    const a = u.indexOf(":"), t = a > -1 ? u.slice(0, a) : u, n = a > -1 ? u.slice(a + 1) : "";
    if (t)
      try {
        E[t] = decodeURIComponent(n);
      } catch {
        E[t] = n;
      }
  }
  return E;
}
function at(f) {
  if (!f) return null;
  const d = St();
  return f in d ? d[f] : null;
}
function ct(f, d) {
  if (!f) return;
  const E = St();
  d == null ? delete E[f] : E[f] = String(d);
  const _ = Object.keys(E).map(function(m) {
    const u = E[m];
    return u === "" ? m : m + ":" + encodeURIComponent(u);
  }).join("&");
  Qt(location.hash) !== _ && (location.hash = _);
}
function Rt(f) {
  return f.button === 1 || f.ctrlKey || f.metaKey || f.shiftKey ? !1 : (f.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = St, window.lnCore.hashGet = at, window.lnCore.hashSet = ct, window.lnCore.hashLinkClick = Rt);
function Et(f, d, E, y) {
  const _ = typeof y == "number" ? y : 4, m = window.innerWidth, u = window.innerHeight, a = d.width, t = d.height, n = (E || "bottom").split("-"), i = n[0], r = n[1] === "start" || n[1] === "end" ? n[1] : "center", p = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, l = p[i] || p.bottom;
  function s(v) {
    return v === "top" || v === "bottom" ? r === "start" ? f.left : r === "end" ? f.right - a : f.left + (f.width - a) / 2 : r === "start" ? f.top : r === "end" ? f.bottom - t : f.top + (f.height - t) / 2;
  }
  function e(v) {
    let g, b, A = !0;
    return v === "top" ? (g = f.top - _ - t, b = s(v), g < 0 && (A = !1)) : v === "bottom" ? (g = f.bottom + _, b = s(v), g + t > u && (A = !1)) : v === "left" ? (g = s(v), b = f.left - _ - a, b < 0 && (A = !1)) : (g = s(v), b = f.right + _, b + a > m && (A = !1)), { top: g, left: b, side: v, fits: A };
  }
  let h = null;
  for (let v = 0; v < l.length; v++) {
    const g = e(l[v]);
    if (g.fits) {
      h = g;
      break;
    }
  }
  h || (h = e(l[0]));
  let c = h.top, o = h.left;
  return a >= m ? o = 0 : (o < 0 && (o = 0), o + a > m && (o = m - a)), t >= u ? c = 0 : (c < 0 && (c = 0), c + t > u && (c = u - t)), { top: c, left: o, placement: h.side };
}
function Zt(f) {
  if (!f || f.parentNode === document.body)
    return function() {
    };
  const d = f.parentNode, E = document.createComment("ln-teleport");
  return d.insertBefore(E, f), document.body.appendChild(f), function() {
    E.parentNode && (E.parentNode.insertBefore(f, E), E.parentNode.removeChild(E));
  };
}
function kt(f) {
  if (!f) return { width: 0, height: 0 };
  const d = f.style, E = d.visibility, y = d.display, _ = d.position;
  d.visibility = "hidden", d.display = "block", d.position = "fixed";
  const m = f.offsetWidth, u = f.offsetHeight;
  return d.visibility = E, d.display = y, d.position = _, { width: m, height: u };
}
let st = null;
async function Bt(f) {
  if (!f) {
    st = null;
    return;
  }
  try {
    const d = new TextEncoder(), E = await crypto.subtle.digest("SHA-256", d.encode(f));
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
function pt() {
  return st;
}
async function ge(f, d = st) {
  const E = d || st;
  if (!E || f === void 0 || f === null) return f;
  try {
    const y = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), m = typeof f == "string" ? f : JSON.stringify(f), u = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      E,
      y.encode(m)
    ), a = btoa(String.fromCharCode(..._)), t = btoa(String.fromCharCode(...new Uint8Array(u)));
    return {
      encrypted: !0,
      iv: a,
      data: t
    };
  } catch (y) {
    return console.error("[ln-core/crypto] Encryption failed:", y), f;
  }
}
async function be(f, d = st) {
  const E = d || st;
  if (!f || !f.encrypted || !E) return f;
  try {
    const y = new TextDecoder(), _ = Uint8Array.from(atob(f.iv), (t) => t.charCodeAt(0)), m = Uint8Array.from(atob(f.data), (t) => t.charCodeAt(0)), u = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      E,
      m
    ), a = y.decode(u);
    try {
      return JSON.parse(a);
    } catch {
      return a;
    }
  } catch (y) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", y), { ...f, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const f = window.fetch.bind(window), d = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
  function y(n) {
    return typeof n == "string" ? n : n instanceof URL ? n.href : n instanceof Request ? n.url : String(n);
  }
  function _(n, i) {
    return i && i.method ? String(i.method).toUpperCase() : n instanceof Request ? n.method.toUpperCase() : "GET";
  }
  function m(n, i) {
    return i + " " + n;
  }
  function u(n) {
    return n === "GET" || n === "HEAD";
  }
  function a(n, i) {
    i = i || {};
    const r = y(n), p = _(n, i), l = m(r, p);
    u(p) && d.has(l) && (d.get(l).abort(), d.delete(l));
    const s = new AbortController(), e = i.signal;
    e && (e.aborted ? s.abort(e.reason) : e.addEventListener("abort", function() {
      s.abort(e.reason);
    }, { once: !0 }));
    const h = Object.assign({}, i, { signal: s.signal });
    return d.set(l, s), f(n, h).finally(function() {
      d.get(l) === s && d.delete(l);
    });
  }
  a.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = a;
  function t(n) {
    const i = n.detail || {};
    if (!i.url) return;
    const r = n.target, p = (i.method || (i.body ? "POST" : "GET")).toUpperCase(), l = i.key;
    l && E.has(l) && (E.get(l).abort(), E.delete(l));
    const s = new AbortController(), e = i.signal;
    e && (e.aborted ? s.abort(e.reason) : e.addEventListener("abort", function() {
      s.abort(e.reason);
    }, { once: !0 })), l && E.set(l, s);
    const h = { method: p, signal: s.signal };
    i.body !== void 0 && (h.body = i.body), window.fetch(i.url, h).then(function(c) {
      l && E.get(l) === s && E.delete(l), S(r, "ln-http:response", {
        ok: c.ok,
        status: c.status,
        response: c
      });
    }).catch(function(c) {
      l && E.get(l) === s && E.delete(l), !(c && c.name === "AbortError") && S(r, "ln-http:error", {
        ok: !1,
        status: 0,
        error: c
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(n) {
      let i = !1;
      return d.forEach(function(r, p) {
        p.endsWith(" " + n) && (r.abort(), d.delete(p), i = !0);
      }), i;
    },
    cancelByKey: function(n) {
      return E.has(n) ? (E.get(n).abort(), E.delete(n), !0) : !1;
    },
    cancelAll: function() {
      d.forEach(function(n) {
        n.abort();
      }), d.clear(), E.forEach(function(n) {
        n.abort();
      }), E.clear();
    },
    get inflight() {
      const n = [];
      return d.forEach(function(i, r) {
        const p = r.indexOf(" ");
        n.push({ method: r.slice(0, p), url: r.slice(p + 1) });
      }), E.forEach(function(i, r) {
        n.push({ key: r });
      }), n;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", t), window.fetch = f, delete window.lnHttp;
    }
  };
})();
(function() {
  const f = "data-ln-ajax", d = "lnAjax", E = "data-ln-form-scope";
  if (window[d] !== void 0) return;
  function y(r) {
    if (!r.hasAttribute(f) || r[d]) return;
    r[d] = !0;
    const p = t(r);
    _(p.links), m(p.forms);
  }
  function _(r) {
    for (const p of r) {
      if (p[d + "Trigger"] || p.hostname && p.hostname !== window.location.hostname) continue;
      const l = p.getAttribute("href");
      if (l && l.includes("#")) continue;
      const s = function(e) {
        if (!$t(e, p)) return;
        e.preventDefault();
        const h = p.getAttribute("href");
        h && a("GET", h, null, p);
      };
      p.addEventListener("click", s), p[d + "Trigger"] = s;
    }
  }
  function m(r) {
    for (const p of r) {
      if (p[d + "Trigger"]) continue;
      if (p.hasAttribute(E)) {
        p[d + "ScopeWarned"] || (p[d + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const l = function(s) {
        s.preventDefault();
        const e = p.method.toUpperCase(), h = p.action, c = new FormData(p);
        for (const o of p.querySelectorAll('button, input[type="submit"]'))
          o.disabled = !0;
        a(e, h, c, p, function() {
          for (const o of p.querySelectorAll('button, input[type="submit"]'))
            o.disabled = !1;
        });
      };
      p.addEventListener("submit", l), p[d + "Trigger"] = l;
    }
  }
  function u(r) {
    if (!r[d]) return;
    const p = t(r);
    for (const l of p.links)
      l[d + "Trigger"] && (l.removeEventListener("click", l[d + "Trigger"]), delete l[d + "Trigger"]);
    for (const l of p.forms)
      l[d + "Trigger"] && (l.removeEventListener("submit", l[d + "Trigger"]), delete l[d + "Trigger"]);
    delete r[d];
  }
  function a(r, p, l, s, e) {
    if (V(s, "ln-ajax:before-start", { method: r, url: p }).defaultPrevented) return;
    S(s, "ln-ajax:start", { method: r, url: p }), s.classList.add("ln-ajax--loading");
    const c = document.createElement("span");
    c.className = "ln-ajax-spinner", s.appendChild(c);
    function o() {
      s.classList.remove("ln-ajax--loading");
      const L = s.querySelector(".ln-ajax-spinner");
      L && L.remove(), e && e();
    }
    let v = p;
    const g = document.querySelector('meta[name="csrf-token"]'), b = g ? g.getAttribute("content") : null;
    l instanceof FormData && b && l.append("_token", b);
    const A = {
      method: r,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (b && (A.headers["X-CSRF-TOKEN"] = b), r === "GET" && l) {
      const L = new URLSearchParams(l);
      v = p + (p.includes("?") ? "&" : "?") + L.toString();
    } else r !== "GET" && l && (A.body = l);
    fetch(v, A).then(function(L) {
      const k = L.ok;
      return L.json().then(function(C) {
        return { ok: k, status: L.status, data: C };
      });
    }).then(function(L) {
      const k = L.data;
      if (L.ok) {
        if (k.title && (document.title = k.title), k.content)
          for (const C in k.content) {
            const x = document.getElementById(C);
            x && (x.innerHTML = k.content[C]);
          }
        if (s.tagName === "A") {
          const C = s.getAttribute("href");
          C && window.history.pushState({ ajax: !0 }, "", C);
        } else s.tagName === "FORM" && s.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", v);
        S(s, "ln-ajax:success", { method: r, url: v, data: k });
      } else
        S(s, "ln-ajax:error", { method: r, url: v, status: L.status, data: k });
      if (k.message) {
        const C = k.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: C.type || (L.ok ? "success" : "error"),
            title: C.title || "",
            message: C.body || ""
          }
        }));
      }
      S(s, "ln-ajax:complete", { method: r, url: v }), o();
    }).catch(function(L) {
      S(s, "ln-ajax:error", { method: r, url: v, error: L }), S(s, "ln-ajax:complete", { method: r, url: v }), o();
    });
  }
  function t(r) {
    const p = { links: [], forms: [] };
    return r.tagName === "A" && r.getAttribute(f) !== "false" ? p.links.push(r) : r.tagName === "FORM" && r.getAttribute(f) !== "false" ? p.forms.push(r) : (p.links = Array.from(r.querySelectorAll('a:not([data-ln-ajax="false"])')), p.forms = Array.from(r.querySelectorAll('form:not([data-ln-ajax="false"])'))), p;
  }
  function n() {
    G(function() {
      new MutationObserver(function(p) {
        for (const l of p)
          if (l.type === "childList") {
            for (const s of l.addedNodes)
              if (s.nodeType === 1 && (y(s), !s.hasAttribute(f))) {
                for (const h of s.querySelectorAll("[" + f + "]"))
                  y(h);
                const e = s.closest && s.closest("[" + f + "]");
                if (e && e.getAttribute(f) !== "false") {
                  const h = t(s);
                  _(h.links), m(h.forms);
                }
              }
          } else l.type === "attributes" && y(l.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-ajax");
  }
  function i() {
    for (const r of document.querySelectorAll("[" + f + "]"))
      y(r);
  }
  window[d] = y, window[d].destroy = u, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
const te = {
  navigate: function(f) {
    gt(f, { historyAction: "push" });
  },
  replace: function(f) {
    gt(f, { historyAction: "replace" });
  },
  current: function() {
    return Dt ? {
      path: xt,
      params: ie,
      query: re,
      route: Dt,
      regions: ne
    } : null;
  }
}, Mt = "data-ln-route", ee = "lnRoute";
typeof window < "u" && (window.lnRouter = te);
const rt = /* @__PURE__ */ new Map(), Pt = /* @__PURE__ */ new WeakMap();
let ne = /* @__PURE__ */ new Map(), Ht = !1, xt = null, ie = {}, re = {}, Dt = null, qt = !1;
function Ut(f, d, E) {
  qt ? queueMicrotask(function() {
    S(f, d, E);
  }) : S(f, d, E);
}
function At(f) {
  try {
    const m = new URL(f, window.location.origin);
    f = m.pathname + m.search + m.hash;
  } catch {
  }
  let [d] = f.split("#"), [E, y] = d.split("?");
  const _ = {};
  if (y) {
    const m = new URLSearchParams(y);
    for (const [u, a] of m.entries())
      _[u] = a;
  }
  return E = E.replace(/\/+$/, ""), E === "" && (E = "/"), { path: E, query: _ };
}
function oe(f, d) {
  if (f.pattern === "*") return 1;
  if (d.pattern === "*") return -1;
  const E = f.segments, y = d.segments, _ = Math.max(E.length, y.length);
  for (let m = 0; m < _; m++) {
    const u = E[m], a = y[m];
    if (u === void 0) return 1;
    if (a === void 0) return -1;
    if (u === "*") return 1;
    if (a === "*") return -1;
    const t = u.startsWith(":"), n = a.startsWith(":");
    if (t && !n) return 1;
    if (!t && n) return -1;
  }
  return 0;
}
function se(f, d) {
  const E = f.split("/").filter(Boolean);
  for (const y of d) {
    if (y.pattern === "*")
      return {
        route: y,
        params: { wildcard: f }
      };
    const _ = y.segments, m = {};
    let u = !0;
    if (!(E.length > _.length && _[_.length - 1] !== "*")) {
      for (let a = 0; a < _.length; a++) {
        const t = _[a], n = E[a];
        if (t === "*") {
          m.wildcard = E.slice(a).join("/");
          break;
        }
        if (n === void 0) {
          u = !1;
          break;
        }
        if (t.startsWith(":"))
          m[t.slice(1)] = decodeURIComponent(n);
        else if (t !== n) {
          u = !1;
          break;
        }
      }
      if (u && (_.indexOf("*") !== -1 || E.length <= _.length))
        return { route: y, params: m };
    }
  }
  return null;
}
function It(f, d) {
  if (f !== "__primary__") {
    const y = document.getElementById(d.target);
    return y || console.warn(`[ln-router] Explicit target element #${d.target} not found in DOM`), y;
  }
  const E = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return E || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), E;
}
function ye(f) {
  if (!f) return;
  const d = Array.from(f.querySelectorAll("*")), E = [f].concat(d);
  for (const _ of E)
    for (const m of Object.keys(_))
      if (m.startsWith("ln") && _[m] && typeof _[m].destroy == "function")
        try {
          _[m].destroy();
        } catch (u) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, _, u);
        }
  const y = document.querySelectorAll('[data-ln-popover="open"]');
  for (const _ of y) {
    const m = _.lnPopover;
    if (m && m.trigger && f.contains(m.trigger))
      try {
        m.destroy();
      } catch (u) {
        console.error("[ln-router] Error destroying open teleported popover:", u);
      }
  }
}
function gt(f, d = {}) {
  const { path: E, query: y } = At(f), _ = /* @__PURE__ */ new Map();
  for (const [i, r] of rt)
    _.set(i, se(E, r.sorted));
  const m = rt.has("__primary__"), u = _.get("__primary__");
  if (m && !u) {
    Ut(document.body, "ln-router:not-found", { path: E });
    return;
  }
  let a = null;
  if (u && (a = It("__primary__", u.route), !a || V(a, "ln-router:before-navigate", {
    from: xt,
    to: f,
    params: u.params,
    query: y
  }).defaultPrevented))
    return;
  const t = [];
  for (const [i, r] of _) {
    if (!r) continue;
    const p = It(i, r.route);
    p && (i !== "__primary__" && p.hasAttribute("data-ln-route-keep") && Pt.get(p) === r.route.templateNode || t.push({ regionKey: i, match: r, targetEl: p }));
  }
  d.historyAction === "push" ? window.history.pushState(null, "", f) : d.historyAction === "replace" && window.history.replaceState(null, "", f);
  const n = function() {
    for (const { regionKey: i, match: r, targetEl: p } of t) {
      if (!(d.isHydration && p.hasAttribute("data-ln-router-hydrate") && p.children.length > 0)) {
        ye(p);
        const s = r.route.templateNode.content.cloneNode(!0);
        p.replaceChildren(s);
      }
      if (Pt.set(p, r.route.templateNode), i === "__primary__" && (r.route.title && (document.title = r.route.title), !d.isHydration)) {
        p.hasAttribute("tabindex") || p.setAttribute("tabindex", "-1");
        const s = p.querySelector("h1, h2, h3, h4, h5, h6");
        s ? (s.setAttribute("tabindex", "-1"), s.focus()) : p.focus(), p.scrollIntoView({ block: "start", behavior: "instant" });
      }
      Ut(p, "ln-router:navigated", {
        path: f,
        params: r.params,
        query: y,
        route: r.route,
        target: p,
        region: i
      });
    }
    u && (xt = f, ie = u.params, re = y, Dt = u.route), ne = new Map(
      Array.from(_.entries()).map(([i, r]) => [i, r ? { route: r.route, params: r.params } : null])
    );
  };
  document.startViewTransition && !d.isHydration ? document.startViewTransition(n) : n();
}
function ve(f) {
  const d = f.target.closest("a");
  if (!d || !$t(f, d)) return;
  const E = d.getAttribute("href"), { path: y } = At(E), _ = rt.get("__primary__");
  if (!_) return;
  se(y, _.sorted) && (f.preventDefault(), gt(E, { historyAction: "push" }));
}
function Ee(f, d) {
  const E = Object.keys(f), y = Object.keys(d);
  if (E.length !== y.length) return !1;
  for (let _ = 0; _ < E.length; _++) {
    const m = E[_];
    if (f[m] !== d[m]) return !1;
  }
  return !0;
}
function Ae() {
  const f = window.location.pathname + window.location.search, d = te.current();
  if (d && d.path != null) {
    const E = At(f);
    if (At(d.path).path === E.path && Ee(d.query, E.query))
      return;
  }
  gt(f, { historyAction: "skip" });
}
function we() {
  Ht || (Ht = !0, G(function() {
    document.addEventListener("click", ve), window.addEventListener("popstate", Ae), qt = !0;
    const f = window.location.pathname + window.location.search + window.location.hash;
    gt(f, { historyAction: "replace", isHydration: !0 }), qt = !1;
  }, "ln-router"));
}
function Se(f) {
  const d = f.getAttribute(Mt);
  if (!d) return;
  const E = f.getAttribute("data-ln-route-target") || null;
  if (E === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${d}" rejected.`);
    return;
  }
  const y = E || "__primary__";
  rt.has(y) || rt.set(y, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const _ = rt.get(y);
  if (_.routes.has(d)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${d}" in region "${y}"`);
    return;
  }
  const m = f.getAttribute("data-ln-route-title"), u = d.split("/").filter(Boolean), a = {
    pattern: d,
    segments: u,
    target: E,
    title: m,
    templateNode: f
  }, t = It(y, a);
  t && t.contains(f) && console.warn(`[ln-router] Route template with pattern "${d}" is declared inside its own outlet element:`, f), _.routes.set(d, a), _.sorted = Array.from(_.routes.values()).sort(oe);
}
function Le(f) {
  const d = f.getAttribute(Mt);
  if (!d) return;
  const y = f.getAttribute("data-ln-route-target") || null || "__primary__", _ = rt.get(y);
  _ && (_.routes.delete(d), _.sorted = Array.from(_.routes.values()).sort(oe), _.routes.size === 0 && rt.delete(y));
}
function ae(f) {
  return this.dom = f, Se(f), this;
}
ae.prototype.destroy = function() {
  Le(this.dom), delete this.dom[ee];
};
P(Mt, ee, ae, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    rt.size > 0 && we();
  }
});
(function() {
  const f = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0) return;
  function E(_) {
    this.dom = _, this.isOpen = _.getAttribute(f) === "open";
    const m = this;
    return this._hashNs = _.id || null, this._onHashChange = function() {
      if (!m._hashNs) return;
      const u = at(m._hashNs) !== null;
      u && !m.isOpen ? m.dom.setAttribute(f, "open") : !u && m.isOpen && m.dom.setAttribute(f, "close");
    }, this._onEscape = function(u) {
      u.key === "Escape" && m.dom.setAttribute(f, "close");
    }, this._onFocusTrap = function(u) {
      if (u.key !== "Tab") return;
      const a = Array.prototype.filter.call(
        m.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        mt
      );
      if (a.length === 0) return;
      const t = a[0], n = a[a.length - 1];
      u.shiftKey ? document.activeElement === t && (u.preventDefault(), n.focus()) : document.activeElement === n && (u.preventDefault(), t.focus());
    }, this._onAjaxSuccess = function() {
      m.isOpen && m.dom.setAttribute(f, "close");
    }, this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this._hashNs && (window.addEventListener("hashchange", this._onHashChange), at(this._hashNs) !== null && !this.isOpen && this.dom.setAttribute(f, "open")), this.dom.addEventListener("ln-ajax:success", this._onAjaxSuccess), this;
  }
  E.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("ln-ajax:success", this._onAjaxSuccess), this.isOpen) {
        this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null;
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + f + '="open"]'),
          function(u) {
            return u !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      this._hashNs && window.removeEventListener("hashchange", this._onHashChange), S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[d];
    }
  };
  function y(_) {
    const m = _[d];
    if (!m) return;
    const a = _.getAttribute(f) === "open";
    if (a !== m.isOpen)
      if (a) {
        if (V(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
          m._hashNs && ct(m._hashNs, null), _.setAttribute(f, "close");
          return;
        }
        m.isOpen = !0, _.setAttribute("aria-modal", "true"), _.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", m._onEscape), document.addEventListener("keydown", m._onFocusTrap);
        const n = document.activeElement;
        m._returnFocusEl = n && n !== document.body ? n : null;
        const i = _.querySelector("[autofocus]");
        if (i && mt(i))
          i.focus();
        else {
          const r = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), p = Array.prototype.find.call(r, mt);
          if (p) p.focus();
          else {
            const l = _.querySelectorAll("a[href], button:not([disabled])"), s = Array.prototype.find.call(l, mt);
            s && s.focus();
          }
        }
        if (m._hashNs) {
          at(m._hashNs) === null && ct(m._hashNs, "");
          const r = at(m._hashNs), p = r || null;
          _.dataset.lnModalMode = p ? "edit" : "new", S(_, "ln-modal:open", { modalId: _.id, target: _, hashNs: m._hashNs, param: p });
        } else
          S(_, "ln-modal:open", { modalId: _.id, target: _ });
      } else {
        if (V(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(f, "open");
          return;
        }
        m.isOpen = !1, _.removeAttribute("aria-modal"), document.removeEventListener("keydown", m._onEscape), document.removeEventListener("keydown", m._onFocusTrap), S(_, "ln-modal:close", { modalId: _.id, target: _ }), m._hashNs && ct(m._hashNs, null), m._returnFocusEl && document.contains(m._returnFocusEl) && typeof m._returnFocusEl.focus == "function" && m._returnFocusEl.focus(), m._returnFocusEl = null, document.querySelector("[" + f + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const m = _.target.closest("[data-ln-modal-for]");
    if (m) {
      const t = m.getAttribute("data-ln-modal-for"), n = document.getElementById(t);
      if (n && n[d]) {
        _.preventDefault();
        const i = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, r = {}, p = m.dataset;
        for (const e in p) {
          if (!e.startsWith("lnModal") || i[e]) continue;
          const h = e.slice(7);
          h && (r[h.charAt(0).toLowerCase() + h.slice(1)] = p[e]);
        }
        const l = Object.keys(r).length > 0;
        if (l)
          window.lnCore.fill(n, r);
        else {
          const e = n.querySelectorAll("[data-ln-field]");
          for (let h = 0; h < e.length; h++)
            e[h].textContent = "";
        }
        m.hasAttribute("data-ln-modal-mode") ? n.dataset.lnModalMode = m.getAttribute("data-ln-modal-mode") : n.dataset.lnModalMode = l ? "edit" : "new";
        const s = n.getAttribute(f);
        n.setAttribute(f, s === "open" ? "close" : "open");
      }
      return;
    }
    const u = _.target.closest('a[href^="#"]');
    if (u) {
      const t = St(u.getAttribute("href"));
      for (const n in t) {
        const i = document.getElementById(n);
        if (i && i[d]) {
          if (!Rt(_)) return;
          ct(n, t[n]);
          return;
        }
      }
    }
    const a = _.target.closest("[data-ln-modal-close]");
    if (a) {
      const t = a.closest("[" + f + "]");
      t && t[d] && (_.preventDefault(), t.setAttribute(f, "close"));
    }
  }), P(f, d, E, "ln-modal", {
    onAttributeChange: y
  });
})();
(function() {
  const f = "data-ln-number", d = "lnNumber";
  if (window[d] !== void 0) return;
  const E = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(t) {
    if (!E[t]) {
      const n = new Intl.NumberFormat(t, { useGrouping: !0 }), i = n.formatToParts(1234.5);
      let r = "", p = ".";
      for (let l = 0; l < i.length; l++)
        i[l].type === "group" && (r = i[l].value), i[l].type === "decimal" && (p = i[l].value);
      E[t] = { fmt: n, groupSep: r, decimalSep: p };
    }
    return E[t];
  }
  function m(t, n, i) {
    if (i !== null) {
      const r = parseInt(i, 10), p = t + "|d" + r;
      return E[p] || (E[p] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: r })), E[p].format(n);
    }
    return _(t).fmt.format(n);
  }
  function u(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[d]) return t[d];
    t[d] = this, this.dom = t;
    const n = document.createElement("input");
    n.type = "hidden", n.name = t.name, t.removeAttribute("name"), t.hasAttribute("data-ln-fill-as") && n.setAttribute("data-ln-fill-as", t.getAttribute("data-ln-fill-as")), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", n), this._hidden = n;
    const i = this;
    Object.defineProperty(n, "value", {
      get: function() {
        return y.get.call(n);
      },
      set: function(p) {
        y.set.call(n, p), p !== "" && !isNaN(parseFloat(p)) ? i._setDisplayRaw(m(W(i.dom), parseFloat(p), i.dom.getAttribute("data-ln-number-decimals"))) : i._setDisplayRaw(""), i.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Wt(t, y, {
      get: function() {
        return y.get.call(t);
      },
      set: function(p) {
        if (p === "") {
          i._setDisplayRaw(""), i._setHiddenRaw(""), t.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const l = typeof p == "number" ? p : parseFloat(String(p).replace(/[^\d.-]/g, ""));
        isNaN(l) ? (i._setDisplayRaw(String(p)), i._setHiddenRaw("")) : (i._setHiddenRaw(l), i._setDisplayRaw(m(W(t), l, t.getAttribute("data-ln-number-decimals")))), t.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      i._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(p) {
      p.preventDefault();
      const l = (p.clipboardData || window.clipboardData).getData("text"), s = _(W(t)), e = s.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let h = l.replace(new RegExp("[^0-9\\-" + e + ".]", "g"), "");
      s.groupSep && (h = h.split(s.groupSep).join("")), s.decimalSep !== "." && (h = h.replace(s.decimalSep, "."));
      const c = parseFloat(h);
      i.value = isNaN(c) ? NaN : c;
    }, t.addEventListener("paste", this._onPaste);
    const r = t.value;
    if (r !== "") {
      const p = parseFloat(r);
      isNaN(p) || (this._setHiddenRaw(p), this._setDisplayRaw(m(W(t), p, t.getAttribute("data-ln-number-decimals"))), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  u.prototype._handleInput = function() {
    const t = this.dom, n = _(W(t)), i = y.get.call(t);
    if (i === "") {
      this._setHiddenRaw(""), S(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (i === "-") {
      this._setHiddenRaw("");
      return;
    }
    const r = t.selectionStart;
    let p = 0;
    for (let A = 0; A < r; A++)
      /[0-9]/.test(i[A]) && p++;
    let l = i;
    if (n.groupSep && (l = l.split(n.groupSep).join("")), l = l.replace(n.decimalSep, "."), i.endsWith(n.decimalSep) || i.endsWith(".")) {
      const A = l.replace(/\.$/, ""), L = parseFloat(A);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const s = l.indexOf(".");
    if (s !== -1 && l.slice(s + 1).endsWith("0")) {
      const L = parseFloat(l);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const e = t.getAttribute("data-ln-number-decimals");
    if (e !== null && s !== -1) {
      const A = parseInt(e, 10);
      l.slice(s + 1).length > A && (l = l.slice(0, s + 1 + A));
    }
    const h = parseFloat(l);
    if (isNaN(h)) return;
    const c = t.getAttribute("data-ln-number-min"), o = t.getAttribute("data-ln-number-max");
    if (c !== null && h < parseFloat(c) || o !== null && h > parseFloat(o)) return;
    let v;
    if (e !== null)
      v = m(W(t), h, e);
    else {
      const A = s !== -1 ? l.slice(s + 1).length : 0;
      if (A > 0) {
        const L = W(t) + "|u" + A;
        E[L] || (E[L] = new Intl.NumberFormat(W(t), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = E[L].format(h);
      } else
        v = n.fmt.format(h);
    }
    this._setDisplayRaw(v);
    let g = p, b = 0;
    for (let A = 0; A < v.length && g > 0; A++)
      b = A + 1, /[0-9]/.test(v[A]) && g--;
    g > 0 && (b = v.length), t.setSelectionRange(b, b), this._setHiddenRaw(h), S(t, "ln-number:input", { value: h, formatted: v });
  }, u.prototype._setHiddenRaw = function(t) {
    y.set.call(this._hidden, String(t));
  }, u.prototype._setDisplayRaw = function(t) {
    y.set.call(this.dom, String(t));
  }, u.prototype._displayFormatted = function(t) {
    this._setDisplayRaw(m(W(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(u.prototype, "value", {
    get: function() {
      const t = y.get.call(this._hidden);
      return t === "" ? NaN : parseFloat(t);
    },
    set: function(t) {
      if (typeof t != "number" || isNaN(t)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(t), this._setDisplayRaw(m(W(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(u.prototype, "formatted", {
    get: function() {
      return y.get.call(this.dom);
    }
  }), u.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function a() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + f + "]");
      for (let n = 0; n < t.length; n++) {
        const i = t[n][d];
        i && !isNaN(i.value) && i._displayFormatted(i.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  P(f, d, u, "ln-number"), a();
})();
(function() {
  const f = "data-ln-date", d = "lnDate";
  if (window[d] !== void 0) return;
  const E = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(o, v) {
    const g = o + "|" + JSON.stringify(v);
    return E[g] || (E[g] = new Intl.DateTimeFormat(o, v)), E[g];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, u = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function a(o) {
    return !o || o === "" ? { dateStyle: "medium" } : o.match(m) ? u[o] : null;
  }
  function t(o, v, g) {
    const b = o.getDate(), A = o.getMonth(), L = o.getFullYear(), k = o.getHours(), C = o.getMinutes();
    let x, I;
    const R = _t(g), B = (g || "").toLowerCase().split("-")[0], K = _(g, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], Y = R && K !== B;
    Y && R.monthsLong ? x = R.monthsLong[A] : x = _(g, { month: "long" }).format(o), Y && R.monthsShort ? I = R.monthsShort[A] : I = _(g, { month: "short" }).format(o);
    const tt = {
      yyyy: String(L),
      yy: String(L).slice(-2),
      MMMM: x,
      MMM: I,
      MM: String(A + 1).padStart(2, "0"),
      M: String(A + 1),
      dd: String(b).padStart(2, "0"),
      d: String(b),
      HH: String(k).padStart(2, "0"),
      mm: String(C).padStart(2, "0")
    };
    return v.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(Q) {
      return tt[Q];
    });
  }
  function n(o, v, g) {
    const b = a(v);
    if (b) {
      const A = _(g, b), L = (g || "").toLowerCase().split("-")[0], k = A.resolvedOptions().locale.toLowerCase().split("-")[0];
      return _t(g) && k !== L ? t(o, "dd.MM.yyyy", g) : A.format(o);
    }
    return t(o, v, g);
  }
  function i(o) {
    if (!o) return "";
    const v = o.getFullYear(), g = String(o.getMonth() + 1).padStart(2, "0"), b = String(o.getDate()).padStart(2, "0");
    return v + "-" + g + "-" + b;
  }
  function r(o, v, g) {
    S(o.dom, "ln-date:change", {
      value: v,
      formatted: o.dom.value,
      date: g
    }), o.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function p(o, v, g, b) {
    o._setHiddenRaw(v), y.set.call(o._picker, v), o._lastISO = v, b !== void 0 ? (o._isFormatting = !0, o.dom.value = b, o._isFormatting = !1) : g && o._displayFormatted(g), r(o, v, g);
  }
  function l(o) {
    o._setHiddenRaw(""), y.set.call(o._picker, ""), o._isFormatting = !0, o.dom.value = "", o._isFormatting = !1, o._lastISO = "", r(o, "", null);
  }
  function s(o) {
    if (o.tagName !== "INPUT")
      return this;
    if (o[d]) return o[d];
    o[d] = this, this.dom = o;
    const v = this, g = o.value, b = o.name, L = (o.closest(".form-element, form") || o.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let R = 0; R < L.length; R++) {
      const B = L[R].getAttribute("data-ln-date-dict");
      if (B) {
        const H = Kt(L[R], "data-ln-date-dict-key");
        H["months-long"] && (H.monthsLong = H["months-long"].split(",").map((K) => K.trim())), H["months-short"] && (H.monthsShort = H["months-short"].split(",").map((K) => K.trim())), Ot(B, H);
      }
    }
    const k = document.createElement("span");
    k.setAttribute("data-ln-date-field", ""), o.parentNode.insertBefore(k, o), k.appendChild(o), this._wrapper = k;
    const C = document.createElement("input");
    C.type = "hidden", C.name = b, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && C.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.insertAdjacentElement("afterend", C), this._hidden = C;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", C.insertAdjacentElement("afterend", x), this._picker = x, o.type = "text";
    const I = document.createElement("button");
    if (I.type = "button", I.setAttribute("aria-label", o.getAttribute("data-ln-date-label") || "Open date picker"), I.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', x.insertAdjacentElement("afterend", I), this._btn = I, this._lastISO = "", Object.defineProperty(C, "value", {
      get: function() {
        return y.get.call(C);
      },
      set: function(R) {
        if (y.set.call(C, R), R && R !== "") {
          const B = e(R);
          B && p(v, R, B);
        } else R === "" && l(v);
      }
    }), Wt(o, y, {
      get: function() {
        return y.get.call(o);
      },
      set: function(R, B) {
        if (v._isFormatting) {
          B(R);
          return;
        }
        if (!R || R === "") {
          B(""), l(v);
          return;
        }
        const H = e(R) || h(R);
        if (H) {
          const K = i(H), Y = o.getAttribute(f) || "", tt = W(o), Q = n(H, Y, tt);
          B(Q), p(v, K, H, Q);
        } else
          B(String(R)), l(v);
      }
    }), this._onPickerChange = function() {
      const R = x.value;
      if (R) {
        const B = e(R);
        B && p(v, R, B);
      } else
        l(v);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const R = v.dom.value.trim();
      if (R === "") {
        v._lastISO !== "" && l(v);
        return;
      }
      if (v._lastISO) {
        const H = e(v._lastISO);
        if (H) {
          const K = v.dom.getAttribute(f) || "", Y = W(v.dom);
          if (R === n(H, K, Y)) return;
        }
      }
      const B = h(R);
      if (B) {
        const H = i(B);
        p(v, H, B);
      } else if (v._lastISO) {
        const H = e(v._lastISO);
        H && v._displayFormatted(H);
      } else
        v.dom.value = "";
    }, o.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      v._openPicker();
    }, I.addEventListener("click", this._onBtnClick), g && g !== "") {
      const R = e(g);
      R && p(v, g, R);
    }
    return this;
  }
  function e(o) {
    if (!o || typeof o != "string") return null;
    const v = o.split("T"), g = v[0].split("-");
    if (g.length < 3) return null;
    const b = parseInt(g[0], 10), A = parseInt(g[1], 10) - 1, L = parseInt(g[2], 10);
    if (isNaN(b) || isNaN(A) || isNaN(L)) return null;
    let k = 0, C = 0;
    if (v[1]) {
      const I = v[1].split(":");
      k = parseInt(I[0], 10) || 0, C = parseInt(I[1], 10) || 0;
    }
    const x = new Date(b, A, L, k, C);
    return x.getFullYear() !== b || x.getMonth() !== A || x.getDate() !== L ? null : x;
  }
  function h(o) {
    if (!o || typeof o != "string" || (o = o.trim(), o.length < 6)) return null;
    let v, g;
    if (o.indexOf(".") !== -1)
      v = ".", g = o.split(".");
    else if (o.indexOf("/") !== -1)
      v = "/", g = o.split("/");
    else if (o.indexOf("-") !== -1)
      v = "-", g = o.split("-");
    else
      return null;
    if (g.length !== 3) return null;
    const b = [];
    for (let x = 0; x < 3; x++) {
      const I = parseInt(g[x], 10);
      if (isNaN(I)) return null;
      b.push(I);
    }
    let A, L, k;
    v === "." ? (A = b[0], L = b[1], k = b[2]) : v === "/" ? (L = b[0], A = b[1], k = b[2]) : g[0].length === 4 ? (k = b[0], L = b[1], A = b[2]) : (A = b[0], L = b[1], k = b[2]), k < 100 && (k += k < 50 ? 2e3 : 1900);
    const C = new Date(k, L - 1, A);
    return C.getFullYear() !== k || C.getMonth() !== L - 1 || C.getDate() !== A ? null : C;
  }
  s.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, s.prototype._setHiddenRaw = function(o) {
    y.set.call(this._hidden, o);
  }, s.prototype._displayFormatted = function(o) {
    const v = this.dom.getAttribute(f) || "", g = W(this.dom);
    this._isFormatting = !0, this.dom.value = n(o, v, g), this._isFormatting = !1;
  }, Object.defineProperty(s.prototype, "value", {
    get: function() {
      return y.get.call(this._hidden);
    },
    set: function(o) {
      if (!o || o === "") {
        l(this);
        return;
      }
      const v = e(o);
      v && p(this, o, v);
    }
  }), Object.defineProperty(s.prototype, "date", {
    get: function() {
      const o = this.value;
      return o ? e(o) : null;
    },
    set: function(o) {
      if (!o || !(o instanceof Date) || isNaN(o.getTime())) {
        this.value = "";
        return;
      }
      this.value = i(o);
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const o = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", o && (this.dom.value = o), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function c() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + f + "]");
      for (let v = 0; v < o.length; v++) {
        const g = o[v][d];
        if (g && g.value) {
          const b = e(g.value);
          b && g._displayFormatted(b);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  P(f, d, s, "ln-date"), c();
})();
(function() {
  const f = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0) return;
  const E = /* @__PURE__ */ new WeakMap(), y = [];
  if (!history._lnNavPatched) {
    const i = history.pushState;
    history.pushState = function() {
      i.apply(history, arguments);
      for (const r of y)
        r();
    }, history._lnNavPatched = !0;
  }
  function _(i) {
    if (!i.hasAttribute(f) || E.has(i)) return;
    const r = i.getAttribute(f);
    if (!r) return;
    const p = m(i, r);
    E.set(i, p), i[d] = p;
  }
  function m(i, r) {
    const p = i.hasAttribute("data-ln-nav-exact");
    let l = Array.from(i.querySelectorAll("a"));
    a(l, r, window.location.pathname, p);
    const s = function() {
      l = Array.from(i.querySelectorAll("a")), a(l, r, window.location.pathname, p);
    };
    window.addEventListener("popstate", s), y.push(s);
    const e = new MutationObserver(function(h) {
      for (const c of h)
        if (c.type === "childList") {
          for (const o of c.addedNodes)
            if (o.nodeType === 1) {
              if (o.tagName === "A")
                l.push(o), a([o], r, window.location.pathname, p);
              else if (o.querySelectorAll) {
                const v = Array.from(o.querySelectorAll("a"));
                l = l.concat(v), a(v, r, window.location.pathname, p);
              }
            }
          for (const o of c.removedNodes)
            if (o.nodeType === 1) {
              if (o.tagName === "A")
                l = l.filter(function(v) {
                  return v !== o;
                });
              else if (o.querySelectorAll) {
                const v = Array.from(o.querySelectorAll("a"));
                l = l.filter(function(g) {
                  return !v.includes(g);
                });
              }
            }
        }
    });
    return e.observe(i, { childList: !0, subtree: !0 }), {
      navElement: i,
      activeClass: r,
      observer: e,
      updateHandler: s,
      destroy: function() {
        e.disconnect(), window.removeEventListener("popstate", s);
        const h = y.indexOf(s);
        h !== -1 && y.splice(h, 1), E.delete(i), delete i[d];
      }
    };
  }
  function u(i) {
    try {
      return new URL(i, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return i.replace(/\/$/, "") || "/";
    }
  }
  function a(i, r, p, l) {
    const s = u(p);
    for (const e of i) {
      const h = e.getAttribute("href");
      if (!h) continue;
      const c = u(h);
      e.classList.remove(r);
      const o = c === s, v = !l && c !== "/" && s.startsWith(c + "/");
      o || v ? (e.classList.add(r), e.setAttribute("aria-current", "page")) : e.removeAttribute("aria-current");
    }
  }
  function t() {
    G(function() {
      new MutationObserver(function(r) {
        for (const p of r)
          if (p.type === "childList") {
            for (const l of p.addedNodes)
              if (l.nodeType === 1 && (l.hasAttribute && l.hasAttribute(f) && _(l), l.querySelectorAll))
                for (const s of l.querySelectorAll("[" + f + "]"))
                  _(s);
          } else p.type === "attributes" && p.target.hasAttribute && p.target.hasAttribute(f) && _(p.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] });
    }, "ln-nav");
  }
  window[d] = _;
  function n() {
    for (const i of document.querySelectorAll("[" + f + "]"))
      _(i);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const f = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function E(m, u) {
    const a = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (a) return a;
    if (m.tagName !== "A") return "";
    const t = m.getAttribute("href") || "";
    if (!t.startsWith("#")) return "";
    const n = t.slice(1);
    if (!n) return "";
    const i = n.split("&");
    if (u)
      for (const l of i) {
        const s = l.indexOf(":");
        if (s > 0 && l.slice(0, s).toLowerCase().trim() === u)
          return l.slice(s + 1).toLowerCase().trim();
      }
    const r = i[i.length - 1] || "", p = r.indexOf(":");
    return (p > 0 ? r.slice(p + 1) : r).toLowerCase().trim();
  }
  function y(m) {
    return this.dom = m, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((t) => t.tagName === "A" && (t.getAttribute("href") || "").startsWith("#")), u = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = u && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : u && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const t of this.tabs) {
      const n = E(t, this.nsKey);
      n ? this.mapTabs[n] = t : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', t);
    }
    for (const t of this.panels) {
      const n = (t.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      n && (this.mapPanels[n] = t);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const a = this;
    this._clickHandlers = [];
    for (const t of this.tabs) {
      if (t[d + "Trigger"]) continue;
      const n = function(i) {
        const r = t.tagName === "A";
        if (!r && (i.ctrlKey || i.metaKey || i.button === 1)) return;
        const p = E(t, a.nsKey);
        p && (r && !Rt(i) || (a.hashEnabled ? at(a.nsKey) === p ? a.dom.setAttribute("data-ln-tabs-active", p) : ct(a.nsKey, p) : a.dom.setAttribute("data-ln-tabs-active", p)));
      };
      t.addEventListener("click", n), t[d + "Trigger"] = n, a._clickHandlers.push({ el: t, handler: n });
    }
    if (this._hashHandler = function() {
      if (!a.hashEnabled) return;
      const t = at(a.nsKey);
      a.dom.setAttribute("data-ln-tabs-active", t !== null ? t : a.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let t = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const n = wt("tabs", this.dom);
        n !== null && n in this.mapPanels && (t = n);
      }
      this.dom.setAttribute("data-ln-tabs-active", t);
    }
  }
  y.prototype._applyActive = function(m) {
    var u;
    (!m || !(m in this.mapPanels)) && (m = this.defaultKey);
    for (const a in this.mapTabs) {
      const t = this.mapTabs[a];
      a === m ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const a in this.mapPanels) {
      const t = this.mapPanels[a], n = a === m;
      t.classList.toggle("hidden", !n), t.setAttribute("aria-hidden", n ? "false" : "true");
    }
    if (this.autoFocus) {
      const a = (u = this.mapPanels[m]) == null ? void 0 : u.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      a && setTimeout(() => a.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: m, tab: this.mapTabs[m], panel: this.mapPanels[m] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && lt("tabs", this.dom, m);
  }, y.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const { el: m, handler: u } of this._clickHandlers)
        m.removeEventListener("click", u), delete m[d + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[d];
    }
  }, P(f, d, y, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const u = m.getAttribute("data-ln-tabs-active");
      m[d]._applyActive(u);
    }
  });
})();
(function() {
  const f = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
  function E(m, u) {
    const a = document.querySelectorAll(
      '[data-ln-toggle-for="' + m.id + '"]'
    );
    for (const t of a)
      t.setAttribute("aria-expanded", u ? "true" : "false");
  }
  function y(m) {
    if (this.dom = m, m.hasAttribute("data-ln-persist")) {
      const u = wt("toggle", m);
      u !== null && m.setAttribute(f, u);
    }
    return this.isOpen = m.getAttribute(f) === "open", this.isOpen && m.classList.add("open"), E(m, this.isOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[d] && (S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function _(m) {
    const u = m[d];
    if (!u) return;
    const t = m.getAttribute(f) === "open";
    if (t !== u.isOpen)
      if (t) {
        if (V(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(f, "close");
          return;
        }
        u.isOpen = !0, m.classList.add("open"), E(m, !0), S(m, "ln-toggle:open", { target: m }), m.hasAttribute("data-ln-persist") && lt("toggle", m, "open");
      } else {
        if (V(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(f, "open");
          return;
        }
        u.isOpen = !1, m.classList.remove("open"), E(m, !1), S(m, "ln-toggle:close", { target: m }), m.hasAttribute("data-ln-persist") && lt("toggle", m, "close");
      }
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const u = m.target.closest("[data-ln-toggle-for]");
    if (u) {
      const a = u.getAttribute("data-ln-toggle-for"), t = document.getElementById(a);
      if (t && t[d]) {
        m.preventDefault();
        const n = u.getAttribute("data-ln-toggle-action") || "toggle";
        if (n === "open")
          t.setAttribute(f, "open");
        else if (n === "close")
          t.setAttribute(f, "close");
        else if (n === "toggle") {
          const i = t.getAttribute(f);
          t.setAttribute(f, i === "open" ? "close" : "open");
        }
      }
    }
  }), P(f, d, y, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const f = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
  function E(y) {
    return this.dom = y, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== y) return;
      const m = y.querySelectorAll("[data-ln-toggle]");
      for (const u of m)
        u !== _.detail.target && u.closest("[data-ln-accordion]") === y && u.getAttribute("data-ln-toggle") === "open" && u.setAttribute("data-ln-toggle", "close");
      S(y, "ln-accordion:change", { target: _.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[d]);
  }, P(f, d, E, "ln-accordion");
})();
(function() {
  const f = "data-ln-dropdown", d = "lnDropdown";
  if (window[d] !== void 0) return;
  function E(y) {
    if (this.dom = y, this.toggleEl = y.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = y.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const m of this.toggleEl.children)
        m.setAttribute("role", "menuitem");
    const _ = this;
    return this._onToggleOpen = function(m) {
      !m.detail || m.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "true"), _._teleportRestore = Zt(_.toggleEl), _.toggleEl.style.position = "fixed", _.toggleEl.style.right = "auto", _._reposition(), _._addOutsideClickListener(), _._addScrollRepositionListener(), _._addResizeCloseListener(), S(y, "ln-dropdown:open", { target: m.detail.target }));
    }, this._onToggleClose = function(m) {
      !m.detail || m.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "false"), _._removeOutsideClickListener(), _._removeScrollRepositionListener(), _._removeResizeCloseListener(), _.toggleEl.style.position = "", _.toggleEl.style.top = "", _.toggleEl.style.left = "", _.toggleEl.style.right = "", _.toggleEl.style.transform = "", _.toggleEl.style.margin = "", _._teleportRestore && (_._teleportRestore(), _._teleportRestore = null), S(y, "ln-dropdown:close", { target: m.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  E.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const y = this.triggerBtn.getBoundingClientRect(), _ = kt(this.toggleEl), m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, u = Et(y, _, "bottom-end", m);
    this.toggleEl.style.top = u.top + "px", this.toggleEl.style.left = u.left + "px";
  }, E.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const y = this;
    this._boundDocClick = function(_) {
      y.dom.contains(_.target) || y.toggleEl && y.toggleEl.contains(_.target) || y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
    }, y._docClickTimeout = setTimeout(function() {
      y._docClickTimeout = null, document.addEventListener("click", y._boundDocClick);
    }, 0);
  }, E.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, E.prototype._addScrollRepositionListener = function() {
    const y = this;
    this._boundScrollReposition = function() {
      y._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, E.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, E.prototype._addResizeCloseListener = function() {
    const y = this;
    this._boundResizeClose = function() {
      y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, E.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, E.prototype.destroy = function() {
    this.dom[d] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[d]);
  }, P(f, d, E, "ln-dropdown");
})();
(function() {
  const f = "data-ln-popover", d = "lnPopover", E = "data-ln-popover-for", y = "data-ln-popover-position";
  if (window[d] !== void 0) return;
  const _ = [];
  let m = null;
  function u() {
    m || (m = function(i) {
      if (i.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function a() {
    _.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function t(i) {
    return this.dom = i, this.isOpen = i.getAttribute(f) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, i.hasAttribute("tabindex") || i.setAttribute("tabindex", "-1"), i.hasAttribute("role") || i.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  t.prototype.open = function(i) {
    this.isOpen || (this.trigger = i || null, this.dom.setAttribute(f, "open"));
  }, t.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(f, "closed");
  }, t.prototype.toggle = function(i) {
    this.isOpen ? this.close() : this.open(i);
  }, t.prototype._applyOpen = function(i) {
    this.isOpen = !0, i && (this.trigger = i), this._previousFocus = document.activeElement, this._teleportRestore = Zt(this.dom);
    const r = kt(this.dom);
    if (this.trigger) {
      const e = this.trigger.getBoundingClientRect(), h = this.dom.getAttribute(y) || "bottom", c = Et(e, r, h, 8);
      this.dom.style.top = c.top + "px", this.dom.style.left = c.left + "px", this.dom.setAttribute("data-ln-popover-placement", c.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const p = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), l = Array.prototype.find.call(p, mt);
    l ? l.focus() : this.dom.focus();
    const s = this;
    this._boundDocClick = function(e) {
      s.dom.contains(e.target) || s.trigger && s.trigger.contains(e.target) || s.close();
    }, s._docClickTimeout = setTimeout(function() {
      s._docClickTimeout = null, document.addEventListener("click", s._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!s.trigger) return;
      const e = s.trigger.getBoundingClientRect(), h = kt(s.dom), c = s.dom.getAttribute(y) || "bottom", o = Et(e, h, c, 8);
      s.dom.style.top = o.top + "px", s.dom.style.left = o.left + "px", s.dom.setAttribute("data-ln-popover-placement", o.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), u(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const i = _.indexOf(this);
    i !== -1 && _.splice(i, 1), a(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[d] && (this.isOpen && this._applyClose(), delete this.dom[d], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function n(i) {
    this.dom = i;
    const r = i.getAttribute(E);
    return i.setAttribute("aria-haspopup", "dialog"), i.setAttribute("aria-expanded", "false"), i.setAttribute("aria-controls", r), this._onClick = function(p) {
      if (p.ctrlKey || p.metaKey || p.button === 1) return;
      p.preventDefault();
      const l = document.getElementById(r);
      !l || !l[d] || l[d].toggle(i);
    }, i.addEventListener("click", this._onClick), this;
  }
  n.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[d + "Trigger"];
  }, P(f, d, t, "ln-popover", {
    onAttributeChange: function(i) {
      const r = i[d];
      if (!r) return;
      const l = i.getAttribute(f) === "open";
      if (l !== r.isOpen)
        if (l) {
          if (V(i, "ln-popover:before-open", {
            popoverId: i.id,
            target: i,
            trigger: r.trigger
          }).defaultPrevented) {
            i.setAttribute(f, "closed");
            return;
          }
          r._applyOpen(r.trigger);
        } else {
          if (V(i, "ln-popover:before-close", {
            popoverId: i.id,
            target: i,
            trigger: r.trigger
          }).defaultPrevented) {
            i.setAttribute(f, "open");
            return;
          }
          r._applyClose();
        }
    }
  }), P(E, d + "Trigger", n, "ln-popover-trigger");
})();
(function() {
  const f = "data-ln-tooltip-enhance", d = "data-ln-tooltip", E = "data-ln-tooltip-position", y = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[y] !== void 0) return;
  let m = 0, u = null, a = null, t = null, n = null, i = null, r = null;
  function p() {
    return u && u.parentNode || (u = document.getElementById(_), u || (u = document.createElement("div"), u.id = _, document.body.appendChild(u))), u;
  }
  function l() {
    r || (r = function(o) {
      o.key === "Escape" && h();
    }, document.addEventListener("keydown", r));
  }
  function s() {
    r && (document.removeEventListener("keydown", r), r = null);
  }
  function e(o) {
    if (t === o) return;
    h();
    const v = o.getAttribute(d) || o.getAttribute("title");
    if (!v) return;
    p(), o.hasAttribute("title") && (n = o.getAttribute("title"), o.removeAttribute("title"));
    const g = o.getAttribute("aria-describedby");
    g ? i = g : i = null;
    const b = document.createElement("div");
    b.className = "ln-tooltip", b.textContent = v, o[y + "Uid"] || (m += 1, o[y + "Uid"] = "ln-tooltip-" + m), b.id = o[y + "Uid"], u.appendChild(b);
    const A = b.offsetWidth, L = b.offsetHeight, k = o.getBoundingClientRect(), C = o.getAttribute(E) || "top", x = Et(k, { width: A, height: L }, C, 6);
    b.style.top = x.top + "px", b.style.left = x.left + "px", b.setAttribute("data-ln-tooltip-placement", x.placement), i ? o.setAttribute("aria-describedby", i + " " + b.id) : o.setAttribute("aria-describedby", b.id), a = b, t = o, l();
  }
  function h() {
    if (!a) {
      s();
      return;
    }
    t && (i !== null ? t.setAttribute("aria-describedby", i) : t.removeAttribute("aria-describedby"), i = null, n !== null && t.setAttribute("title", n)), n = null, a.parentNode && a.parentNode.removeChild(a), a = null, t = null, s();
  }
  function c(o) {
    return this.dom = o, o.hasAttribute("data-ln-tooltip-enhanced") || (o.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      e(o);
    }, this._onLeave = function() {
      t === o && !o.contains(document.activeElement) && h();
    }, this._onFocus = function() {
      e(o);
    }, this._onBlur = function() {
      t === o && !o.matches(":hover") && h();
    }, o.addEventListener("mouseenter", this._onEnter), o.addEventListener("mouseleave", this._onLeave), o.addEventListener("focus", this._onFocus, !0), o.addEventListener("blur", this._onBlur, !0), this;
  }
  c.prototype.destroy = function() {
    const o = this.dom;
    o.removeEventListener("mouseenter", this._onEnter), o.removeEventListener("mouseleave", this._onLeave), o.removeEventListener("focus", this._onFocus, !0), o.removeEventListener("blur", this._onBlur, !0), t === o && h(), this._addedEnhancedAttr && o.removeAttribute("data-ln-tooltip-enhanced"), delete o[y], delete o[y + "Uid"], S(o, "ln-tooltip:destroyed", { trigger: o });
  }, P(
    "[" + f + "], [data-ln-tooltip-enhanced], [" + d + "][title]",
    y,
    c,
    "ln-tooltip"
  );
})();
(function() {
  const f = "data-ln-toast", d = "lnToast", E = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function y(l) {
    if (!l || l.nodeType !== 1) return;
    const s = Array.from(l.querySelectorAll("[" + f + "]"));
    l.hasAttribute && l.hasAttribute(f) && s.push(l);
    for (const e of s)
      e[d] || new _(e);
  }
  function _(l) {
    this.dom = l, l[d] = this, this.timeoutDefault = parseInt(l.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(l.getAttribute("data-ln-toast-max") || "5", 10);
    const s = Array.from(l.querySelectorAll("[data-ln-toast-item]"));
    for (; s.length > this.max; ) l.removeChild(s.shift());
    for (const e of s) i(e, this);
    return this;
  }
  _.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const l of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        t(l);
      delete this.dom[d];
    }
  };
  function m(l, s) {
    const e = ((l.type || "") + "").trim().toLowerCase(), h = dt(s, E, "ln-toast");
    if (!h)
      return console.warn('[ln-toast] Template "' + E + '" not found'), null;
    J(h, {
      type: e,
      title: l.title,
      message: typeof l.message == "string" ? l.message : void 0
    });
    const c = h.firstElementChild;
    if (!c) return null;
    c.hasAttribute("data-ln-toast-item") || c.setAttribute("data-ln-toast-item", ""), c.classList.add("ln-enter");
    const o = c.querySelector(".body");
    o && u(o, l);
    const v = c.querySelector("[data-ln-toast-close]");
    return v && v.addEventListener("click", function() {
      t(c);
    }), c;
  }
  function u(l, s) {
    if (Array.isArray(s.message)) {
      const e = document.createElement("ul");
      for (const h of s.message) {
        const c = document.createElement("li");
        c.textContent = h, e.appendChild(c);
      }
      l.appendChild(e);
    }
    if (s.data && s.data.errors) {
      const e = document.createElement("ul");
      for (const h of Object.values(s.data.errors).flat()) {
        const c = document.createElement("li");
        c.textContent = h, e.appendChild(c);
      }
      l.appendChild(e);
    }
  }
  function a(l, s) {
    const e = Array.from(l.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; e.length >= l.max && e.length > 0; ) l.dom.removeChild(e.shift());
    l.dom.appendChild(s), requestAnimationFrame(() => s.classList.remove("ln-enter"));
  }
  function t(l) {
    !l || !l.parentNode || (clearTimeout(l._timer), l.classList.remove("ln-enter"), l.classList.add("ln-out"), setTimeout(() => {
      l.parentNode && l.parentNode.removeChild(l);
    }, 200));
  }
  function n(l) {
    let s = l && l.container;
    return typeof s == "string" && (s = document.querySelector(s)), s instanceof HTMLElement || (s = document.querySelector("[" + f + "]") || document.getElementById("ln-toast-container")), s || null;
  }
  function i(l, s) {
    if (l._lnToastHydrated) return;
    l._lnToastHydrated = !0;
    const e = l.querySelector("[data-ln-toast-close]");
    e && e.addEventListener("click", function() {
      t(l);
    });
    const h = l.getAttribute("data-ln-toast-timeout"), c = h !== null ? parseInt(h, 10) : NaN, o = Number.isFinite(c) ? c : s.timeoutDefault;
    o > 0 && (l._timer = setTimeout(function() {
      t(l);
    }, o));
  }
  function r(l) {
    const s = l.detail || {}, e = n(s);
    if (!e) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const h = e[d] || new _(e), c = m(s, e);
    if (!c) return;
    const o = Number.isFinite(s.timeout) ? s.timeout : h.timeoutDefault;
    a(h, c), o > 0 && (c._timer = setTimeout(() => t(c), o));
  }
  function p(l) {
    const s = l && l.detail || {};
    if (s.container) {
      const e = n(s);
      if (e)
        for (const h of Array.from(e.querySelectorAll("[data-ln-toast-item]"))) t(h);
    } else {
      const e = document.querySelectorAll("[" + f + "]");
      for (const h of Array.from(e))
        for (const c of Array.from(h.querySelectorAll("[data-ln-toast-item]"))) t(c);
    }
  }
  G(function() {
    window.addEventListener("ln-toast:enqueue", r), window.addEventListener("ln-toast:clear", p), new MutationObserver(function(s) {
      for (const e of s) {
        if (e.type === "attributes") {
          y(e.target);
          continue;
        }
        for (const h of e.addedNodes)
          y(h);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] }), y(document.body);
  }, "ln-toast");
})();
(function() {
  const f = "data-ln-upload", d = "lnUpload", E = "data-ln-upload-dict", y = "data-ln-upload-accept", _ = "data-ln-upload-context", m = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function u() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const s = document.createElement("div");
    s.innerHTML = m;
    const e = s.firstElementChild;
    e && document.body.appendChild(e);
  }
  if (window[d] !== void 0) return;
  function a(s) {
    if (s === 0) return "0 B";
    const e = 1024, h = ["B", "KB", "MB", "GB"], c = Math.floor(Math.log(s) / Math.log(e));
    return parseFloat((s / Math.pow(e, c)).toFixed(1)) + " " + h[c];
  }
  function t(s) {
    return s.split(".").pop().toLowerCase();
  }
  function n(s) {
    return s === "docx" && (s = "doc"), ["pdf", "doc", "epub"].includes(s) ? "lnc-file-" + s : "ln-file";
  }
  function i(s, e) {
    if (!e) return !0;
    const h = "." + t(s.name);
    return e.split(",").map(function(o) {
      return o.trim().toLowerCase();
    }).includes(h.toLowerCase());
  }
  function r(s) {
    if (s.hasAttribute("data-ln-upload-initialized")) return;
    s.setAttribute("data-ln-upload-initialized", "true"), u();
    const e = Kt(s, E), h = s.querySelector(".ln-upload__zone"), c = s.querySelector(".ln-upload__list"), o = s.getAttribute(y) || "";
    if (!h || !c) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", s);
      return;
    }
    let v = s.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), o && (v.accept = o.split(",").map(function(N) {
      return N = N.trim(), N.startsWith(".") ? N : "." + N;
    }).join(",")), s.appendChild(v));
    const g = s.getAttribute(f) || "/files/upload", b = s.getAttribute(_) || "", A = s.getAttribute("data-ln-upload-delete") || (g.includes("/upload") ? g.replace(/\/upload\/?$/, "/{id}") : g + "/{id}"), L = /* @__PURE__ */ new Map();
    let k = 0;
    function C() {
      const N = document.querySelector('meta[name="csrf-token"]');
      return N ? N.getAttribute("content") : "";
    }
    function x(N) {
      if (!i(N, o)) {
        const M = e["invalid-type"];
        S(s, "ln-upload:invalid", {
          file: N,
          message: M
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: e["invalid-title"] || "Invalid File",
          message: M || e["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const U = "file-" + ++k, z = t(N.name), ht = n(z), et = dt(s, "ln-upload-item", "ln-upload");
      if (!et) return;
      const X = et.firstElementChild;
      if (!X) return;
      X.setAttribute("data-file-id", U), J(X, {
        name: N.name,
        sizeText: "0%",
        iconHref: "#" + ht,
        removeLabel: e.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const w = X.querySelector(".ln-upload__progress-bar"), T = X.querySelector('[data-ln-upload-action="remove"]');
      T && (T.disabled = !0), c.appendChild(X);
      const D = new FormData();
      D.append("file", N);
      const q = /* @__PURE__ */ new Set();
      s.querySelectorAll("input, select, textarea").forEach(function(M) {
        if (M.name && M.name !== "file_ids[]" && M.type !== "file") {
          if ((M.type === "checkbox" || M.type === "radio") && !M.checked)
            return;
          D.append(M.name, M.value), q.add(M.name);
        }
      }), !q.has("context") && b && D.append("context", b);
      const O = new XMLHttpRequest();
      O.upload.addEventListener("progress", function(M) {
        if (M.lengthComputable) {
          const j = Math.round(M.loaded / M.total * 100);
          w.style.width = j + "%", J(X, { sizeText: j + "%" });
        }
      }), O.addEventListener("load", function() {
        if (O.status >= 200 && O.status < 300) {
          let M;
          try {
            M = JSON.parse(O.responseText);
          } catch {
            F("Invalid response");
            return;
          }
          J(X, { sizeText: a(M.size || N.size), uploading: !1 }), T && (T.disabled = !1), L.set(U, {
            serverId: M.id,
            name: M.name,
            size: M.size
          }), I(), S(s, "ln-upload:uploaded", {
            localId: U,
            serverId: M.id,
            name: M.name
          });
        } else {
          let M = e["upload-failed"] || "Upload failed";
          try {
            M = JSON.parse(O.responseText).message || M;
          } catch {
          }
          F(M);
        }
      }), O.addEventListener("error", function() {
        F(e["network-error"] || "Network error");
      });
      function F(M) {
        w && (w.style.width = "100%"), J(X, { sizeText: e.error || "Error", uploading: !1, error: !0 }), T && (T.disabled = !1), S(s, "ln-upload:error", {
          file: N,
          message: M
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: e["error-title"] || "Upload Error",
          message: M || e["upload-failed"] || "Failed to upload file"
        });
      }
      O.open("POST", g), O.setRequestHeader("X-CSRF-TOKEN", C()), O.setRequestHeader("Accept", "application/json"), O.send(D);
    }
    function I() {
      for (const N of s.querySelectorAll('input[name="file_ids[]"]'))
        N.remove();
      for (const [, N] of L) {
        const U = document.createElement("input");
        U.type = "hidden", U.name = "file_ids[]", U.value = N.serverId, s.appendChild(U);
      }
    }
    function R(N) {
      const U = L.get(N), z = c.querySelector('[data-file-id="' + N + '"]');
      if (!U || !U.serverId) {
        z && z.remove(), L.delete(N), I();
        return;
      }
      z && J(z, { deleting: !0 });
      const ht = A.replace("{id}", U.serverId);
      fetch(ht, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": C(),
          Accept: "application/json"
        }
      }).then(function(et) {
        et.status === 200 ? (z && z.remove(), L.delete(N), I(), S(s, "ln-upload:removed", {
          localId: N,
          serverId: U.serverId
        })) : (z && J(z, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: e["delete-title"] || "Error",
          message: e["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(et) {
        console.warn("[ln-upload] Delete error:", et), z && J(z, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: e["network-error"] || "Network error",
          message: e["connection-error"] || "Could not connect to server"
        });
      });
    }
    function B(N) {
      for (const U of N)
        x(U);
      v.value = "";
    }
    const H = function() {
      v.click();
    }, K = function() {
      B(this.files);
    }, Y = function(N) {
      N.preventDefault(), N.stopPropagation(), h.classList.add("ln-upload__zone--dragover");
    }, tt = function(N) {
      N.preventDefault(), N.stopPropagation(), h.classList.add("ln-upload__zone--dragover");
    }, Q = function(N) {
      N.preventDefault(), N.stopPropagation(), h.classList.remove("ln-upload__zone--dragover");
    }, ut = function(N) {
      N.preventDefault(), N.stopPropagation(), h.classList.remove("ln-upload__zone--dragover"), B(N.dataTransfer.files);
    }, yt = function(N) {
      const U = N.target.closest('[data-ln-upload-action="remove"]');
      if (!U || !c.contains(U) || U.disabled) return;
      const z = U.closest(".ln-upload__item");
      z && R(z.getAttribute("data-file-id"));
    };
    h.addEventListener("click", H), v.addEventListener("change", K), h.addEventListener("dragenter", Y), h.addEventListener("dragover", tt), h.addEventListener("dragleave", Q), h.addEventListener("drop", ut), c.addEventListener("click", yt), s.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(L.values()).map(function(N) {
          return N.serverId;
        });
      },
      getFiles: function() {
        return Array.from(L.values());
      },
      clear: function() {
        for (const [, N] of L)
          if (N.serverId) {
            const U = A.replace("{id}", N.serverId);
            fetch(U, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": C(),
                Accept: "application/json"
              }
            });
          }
        L.clear(), c.innerHTML = "", I(), S(s, "ln-upload:cleared", {});
      },
      destroy: function() {
        h.removeEventListener("click", H), v.removeEventListener("change", K), h.removeEventListener("dragenter", Y), h.removeEventListener("dragover", tt), h.removeEventListener("dragleave", Q), h.removeEventListener("drop", ut), c.removeEventListener("click", yt), L.clear(), c.innerHTML = "", I(), s.removeAttribute("data-ln-upload-initialized"), delete s.lnUploadAPI;
      }
    };
  }
  function p() {
    for (const s of document.querySelectorAll("[" + f + "]"))
      r(s);
  }
  function l() {
    G(function() {
      new MutationObserver(function(e) {
        for (const h of e)
          if (h.type === "childList") {
            for (const c of h.addedNodes)
              if (c.nodeType === 1) {
                c.hasAttribute(f) && r(c);
                for (const o of c.querySelectorAll("[" + f + "]"))
                  r(o);
              }
          } else h.type === "attributes" && h.target.hasAttribute(f) && r(h.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-upload");
  }
  window[d] = {
    init: r,
    initAll: p
  }, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
(function() {
  const f = "lnExternalLinks";
  if (window[f] !== void 0) return;
  function d(a) {
    return a.hostname && a.hostname !== window.location.hostname;
  }
  function E(a) {
    if (a.getAttribute("data-ln-external-link") === "processed" || !d(a)) return;
    a.target = "_blank";
    const t = (a.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), a.rel = t.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", a.appendChild(n), a.setAttribute("data-ln-external-link", "processed"), S(a, "ln-external-links:processed", {
      link: a,
      href: a.href
    });
  }
  function y(a) {
    a = a || document.body;
    for (const t of a.querySelectorAll("a, area"))
      E(t);
  }
  function _() {
    G(function() {
      document.body.addEventListener("click", function(a) {
        const t = a.target.closest("a, area");
        t && t.getAttribute("data-ln-external-link") === "processed" && S(t, "ln-external-links:clicked", {
          link: t,
          href: t.href,
          text: t.textContent || t.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    G(function() {
      new MutationObserver(function(t) {
        for (const n of t) {
          if (n.type === "childList") {
            for (const i of n.addedNodes)
              if (i.nodeType === 1 && (i.matches && (i.matches("a") || i.matches("area")) && E(i), i.querySelectorAll))
                for (const r of i.querySelectorAll("a, area"))
                  E(r);
          }
          if (n.type === "attributes" && n.attributeName === "href") {
            const i = n.target;
            i.matches && (i.matches("a") || i.matches("area")) && E(i);
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
  function u() {
    _(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[f] = {
    process: y
  }, u();
})();
(function() {
  const f = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  let E = null;
  function y() {
    E = document.createElement("div"), E.className = "ln-link-status", document.body.appendChild(E);
  }
  function _(c) {
    E && (E.textContent = c, E.classList.add("ln-link-status--visible"));
  }
  function m() {
    E && E.classList.remove("ln-link-status--visible");
  }
  function u(c, o) {
    if (o.target.closest("a, button, input, select, textarea")) return;
    const v = c.querySelector("a");
    if (!v) return;
    const g = v.getAttribute("href");
    if (!g) return;
    if (o.ctrlKey || o.metaKey || o.button === 1) {
      window.open(g, "_blank");
      return;
    }
    V(c, "ln-link:navigate", { target: c, href: g, link: v }).defaultPrevented || v.click();
  }
  function a(c) {
    const o = c.querySelector("a");
    if (!o) return;
    const v = o.getAttribute("href");
    v && _(v);
  }
  function t() {
    m();
  }
  function n(c) {
    c[d + "Row"] || (c[d + "Row"] = !0, c.querySelector("a") && (c._lnLinkClick = function(o) {
      u(c, o);
    }, c._lnLinkEnter = function() {
      a(c);
    }, c.addEventListener("click", c._lnLinkClick), c.addEventListener("mouseenter", c._lnLinkEnter), c.addEventListener("mouseleave", t)));
  }
  function i(c) {
    c[d + "Row"] && (c._lnLinkClick && c.removeEventListener("click", c._lnLinkClick), c._lnLinkEnter && c.removeEventListener("mouseenter", c._lnLinkEnter), c.removeEventListener("mouseleave", t), delete c._lnLinkClick, delete c._lnLinkEnter, delete c[d + "Row"]);
  }
  function r(c) {
    if (!c[d + "Init"]) return;
    const o = c.tagName;
    if (o === "TABLE" || o === "TBODY") {
      const v = o === "TABLE" && c.querySelector("tbody") || c;
      for (const g of v.querySelectorAll("tr"))
        i(g);
    } else
      i(c);
    delete c[d + "Init"];
  }
  function p(c) {
    if (c[d + "Init"]) return;
    c[d + "Init"] = !0;
    const o = c.tagName;
    if (o === "TABLE" || o === "TBODY") {
      const v = o === "TABLE" && c.querySelector("tbody") || c;
      for (const g of v.querySelectorAll("tr"))
        n(g);
    } else
      n(c);
  }
  function l(c) {
    c.hasAttribute && c.hasAttribute(f) && p(c);
    const o = c.querySelectorAll ? c.querySelectorAll("[" + f + "]") : [];
    for (const v of o)
      p(v);
  }
  function s() {
    G(function() {
      new MutationObserver(function(o) {
        for (const v of o)
          if (v.type === "childList")
            for (const g of v.addedNodes)
              g.nodeType === 1 && (l(g), g.tagName === "TR" && g.closest("[" + f + "]") && n(g));
          else v.type === "attributes" && l(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-link");
  }
  function e(c) {
    l(c);
  }
  window[d] = { init: e, destroy: r };
  function h() {
    y(), s(), e(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h();
})();
(function() {
  const f = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0) return;
  function E(n) {
    y(n);
  }
  function y(n) {
    const i = Array.from(n.querySelectorAll(f));
    for (const r of i)
      r[d] || (r[d] = new _(r));
    n.hasAttribute && n.hasAttribute("data-ln-progress") && !n[d] && (n[d] = new _(n));
  }
  function _(n) {
    return this.dom = n, this._attrObserver = null, this._parentObserver = null, t.call(this), u.call(this), a.call(this), this;
  }
  _.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[d]);
  };
  function m() {
    G(function() {
      new MutationObserver(function(i) {
        for (const r of i)
          if (r.type === "childList")
            for (const p of r.addedNodes)
              p.nodeType === 1 && y(p);
          else r.type === "attributes" && y(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  m();
  function u() {
    const n = this, i = new MutationObserver(function(r) {
      for (const p of r)
        (p.attributeName === "data-ln-progress" || p.attributeName === "data-ln-progress-max") && t.call(n);
    });
    i.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = i;
  }
  function a() {
    const n = this, i = this.dom.parentElement;
    if (!i || !i.hasAttribute("data-ln-progress-max")) return;
    const r = new MutationObserver(function(p) {
      for (const l of p)
        l.attributeName === "data-ln-progress-max" && t.call(n);
    });
    r.observe(i, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = r;
  }
  function t() {
    const n = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, i = this.dom.parentElement, p = (i && i.hasAttribute("data-ln-progress-max") ? parseFloat(i.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let l = p > 0 ? n / p * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100), this.dom.style.width = l + "%";
    const s = Math.max(0, Math.min(n, p));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(p)), this.dom.setAttribute("aria-valuenow", String(s)), S(this.dom, "ln-progress:change", { target: this.dom, value: n, max: p, percentage: l });
  }
  window[d] = E, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const f = "data-ln-filter", d = "lnFilter", E = "data-ln-filter-initialized", y = "data-ln-filter-key", _ = "data-ln-filter-value", m = "data-ln-filter-hide", u = "data-ln-filter-reset", a = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[d] !== void 0) return;
  function n(s) {
    return s.hasAttribute(u) || s.getAttribute(_) === "";
  }
  function i(s) {
    let e = s._filterKey;
    const h = [];
    for (let c = 0; c < s.inputs.length; c++) {
      const o = s.inputs[c];
      if (o.checked && !n(o)) {
        const v = o.getAttribute(_);
        v && h.push(v);
      }
    }
    return { key: e, values: h };
  }
  function r(s, e) {
    if (s.length !== e.length) return !0;
    for (let h = 0; h < s.length; h++) if (s[h] !== e[h]) return !0;
    return !1;
  }
  function p(s) {
    const e = s.dom, h = s.colIndex, c = e.querySelector("template");
    if (!c || h === null) return;
    const o = document.getElementById(s.targetId);
    if (!o) return;
    const v = o.tagName === "TABLE" ? o : o.querySelector("table");
    if (!v || o.hasAttribute("data-ln-table")) return;
    const g = {}, b = [], A = v.tBodies;
    for (let C = 0; C < A.length; C++) {
      const x = A[C].rows;
      for (let I = 0; I < x.length; I++) {
        const R = x[I].cells[h], B = R ? R.textContent.trim() : "";
        B && !g[B] && (g[B] = !0, b.push(B));
      }
    }
    b.sort(function(C, x) {
      return C.localeCompare(x);
    });
    const L = e.querySelector("[" + y + "]"), k = L ? L.getAttribute(y) : e.getAttribute("data-ln-filter-key") || "col" + h;
    for (let C = 0; C < b.length; C++) {
      const x = c.content.cloneNode(!0), I = x.querySelector("input");
      I && (I.setAttribute(y, k), I.setAttribute(_, b[C]), bt(x, { text: b[C] }), e.appendChild(x));
    }
  }
  function l(s) {
    if (s.hasAttribute(E)) return this;
    this.dom = s, this.targetId = s.getAttribute(f);
    const e = s.getAttribute(a);
    this.colIndex = e !== null ? parseInt(e, 10) : null, p(this), this.inputs = Array.from(s.querySelectorAll("[" + y + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(y) : null, this._lastSnapshot = null;
    const h = this, c = pe(
      function() {
        h._render();
      },
      function() {
        h._afterRender();
      }
    );
    this._queueRender = c, this._attachHandlers();
    let o = !1;
    if (s.hasAttribute("data-ln-persist")) {
      const v = wt("filter", s);
      if (v && v.key && Array.isArray(v.values) && v.values.length > 0) {
        for (let g = 0; g < this.inputs.length; g++) {
          const b = this.inputs[g];
          n(b) ? b.checked = !1 : b.getAttribute(y) === v.key && v.values.indexOf(b.getAttribute(_)) !== -1 ? b.checked = !0 : b.checked = !1;
        }
        c(), o = !0;
      }
    }
    if (!o) {
      for (let v = 0; v < this.inputs.length; v++)
        if (this.inputs[v].checked && !n(this.inputs[v])) {
          c();
          break;
        }
    }
    return s.setAttribute(E, ""), this;
  }
  l.prototype._attachHandlers = function() {
    const s = this;
    this.inputs.forEach(function(e) {
      e[d + "Bound"] || (e[d + "Bound"] = !0, e._lnFilterChange = function() {
        if (n(e)) {
          for (let h = 0; h < s.inputs.length; h++)
            n(s.inputs[h]) || (s.inputs[h].checked = !1);
          e.checked = !0, s._queueRender();
          return;
        }
        if (e.checked) {
          for (let c = 0; c < s.inputs.length; c++)
            n(s.inputs[c]) && (s.inputs[c].checked = !1);
          let h = !1;
          for (let c = 0; c < s.inputs.length; c++)
            if (n(s.inputs[c])) {
              h = !0;
              break;
            }
          if (h) {
            let c = !0;
            for (let o = 0; o < s.inputs.length; o++)
              if (!n(s.inputs[o]) && !s.inputs[o].checked) {
                c = !1;
                break;
              }
            if (c)
              for (let o = 0; o < s.inputs.length; o++)
                n(s.inputs[o]) ? s.inputs[o].checked = !0 : s.inputs[o].checked = !1;
          }
        } else {
          let h = !1;
          for (let c = 0; c < s.inputs.length; c++)
            if (!n(s.inputs[c]) && s.inputs[c].checked) {
              h = !0;
              break;
            }
          if (!h)
            for (let c = 0; c < s.inputs.length; c++)
              n(s.inputs[c]) && (s.inputs[c].checked = !0);
        }
        s._queueRender();
      }, e.addEventListener("change", e._lnFilterChange));
    });
  }, l.prototype._render = function() {
    const s = this, e = i(this), h = e.key === null || e.values.length === 0, c = [];
    for (let o = 0; o < e.values.length; o++)
      c.push(e.values[o].toLowerCase());
    if (s.colIndex !== null)
      s._filterTableRows(e);
    else {
      const o = document.getElementById(s.targetId);
      if (!o) return;
      const v = o.children;
      for (let g = 0; g < v.length; g++) {
        const b = v[g];
        if (h) {
          b.removeAttribute(m);
          continue;
        }
        const A = b.getAttribute("data-" + e.key);
        b.removeAttribute(m), A !== null && c.indexOf(A.toLowerCase()) === -1 && b.setAttribute(m, "true");
      }
    }
  }, l.prototype._afterRender = function() {
    const s = i(this), e = this._lastSnapshot;
    if (!e || e.key !== s.key || r(e.values, s.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: s.key,
        values: s.values.slice()
      });
      const c = e && e.values.length > 0, o = s.values.length === 0;
      c && o && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: s.key, values: s.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (s.key && s.values.length > 0 ? lt("filter", this.dom, { key: s.key, values: s.values.slice() }) : lt("filter", this.dom, null));
  }, l.prototype._dispatchOnBoth = function(s, e) {
    S(this.dom, s, e);
    const h = document.getElementById(this.targetId);
    h && h !== this.dom && S(h, s, e);
  }, l.prototype._filterTableRows = function(s) {
    const e = document.getElementById(this.targetId);
    if (!e) return;
    const h = e.tagName === "TABLE" ? e : e.querySelector("table");
    if (!h || e.hasAttribute("data-ln-table")) return;
    const c = s.key || this._filterKey, o = s.values;
    t.has(h) || t.set(h, {});
    const v = t.get(h);
    if (c && o.length > 0) {
      const L = [];
      for (let k = 0; k < o.length; k++)
        L.push(o[k].toLowerCase());
      v[c] = { col: this.colIndex, values: L };
    } else c && delete v[c];
    const g = Object.keys(v), b = g.length > 0, A = h.tBodies;
    for (let L = 0; L < A.length; L++) {
      const k = A[L].rows;
      for (let C = 0; C < k.length; C++) {
        const x = k[C];
        if (!b) {
          x.removeAttribute(m);
          continue;
        }
        let I = !0;
        for (let R = 0; R < g.length; R++) {
          const B = v[g[R]], H = x.cells[B.col], K = H ? H.textContent.trim().toLowerCase() : "";
          if (B.values.indexOf(K) === -1) {
            I = !1;
            break;
          }
        }
        I ? x.removeAttribute(m) : x.setAttribute(m, "true");
      }
    }
  }, l.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.colIndex !== null) {
        const s = document.getElementById(this.targetId);
        if (s) {
          const e = s.tagName === "TABLE" ? s : s.querySelector("table");
          if (e && t.has(e)) {
            const h = t.get(e), c = this._filterKey;
            c && h[c] && delete h[c], Object.keys(h).length === 0 && t.delete(e);
          }
        }
      }
      this.inputs.forEach(function(s) {
        s._lnFilterChange && (s.removeEventListener("change", s._lnFilterChange), delete s._lnFilterChange), delete s[d + "Bound"];
      }), this.dom.removeAttribute(E), delete this.dom[d];
    }
  }, P(f, d, l, "ln-filter");
})();
(function() {
  const f = "data-ln-search", d = "lnSearch", E = "data-ln-search-initialized", y = "data-ln-search-hide";
  if (window[d] !== void 0) return;
  function m(u) {
    if (u.hasAttribute(E)) return this;
    this.dom = u, this.targetId = u.getAttribute(f);
    const a = u.tagName;
    this.input = a === "INPUT" || a === "TEXTAREA" ? u : u.querySelector('[name="search"]') || u.querySelector('input[type="search"]') || u.querySelector('input[type="text"]'), this.itemsSelector = u.getAttribute("data-ln-search-items") || null;
    const t = u.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = t !== null ? parseInt(t, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const n = this;
      queueMicrotask(function() {
        n._search(n.input.value.trim().toLowerCase());
      });
    }
    return u.setAttribute(E, ""), this;
  }
  m.prototype._attachHandler = function() {
    if (!this.input) return;
    const u = this, a = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = a ? a.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      u.input.value = "", u._search(""), u.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(u._debounceTimer), u._debounceTimer = setTimeout(function() {
        u._search(u.input.value.trim().toLowerCase());
      }, u.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, m.prototype._search = function(u) {
    const a = document.getElementById(this.targetId);
    if (!a || V(a, "ln-search:change", { term: u, targetId: this.targetId }).defaultPrevented) return;
    const n = this.itemsSelector ? a.querySelectorAll(this.itemsSelector) : a.children;
    for (let i = 0; i < n.length; i++) {
      const r = n[i];
      r.removeAttribute(y), u && !r.textContent.replace(/\s+/g, " ").toLowerCase().includes(u) && r.setAttribute(y, "true");
    }
  }, m.prototype.destroy = function() {
    this.dom[d] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(E), delete this.dom[d]);
  }, P(f, d, m, "ln-search");
})();
(function() {
  const f = "lnTableSort", d = "data-ln-table-sort", E = "data-ln-table-col-sort";
  if (window[f] !== void 0) return;
  function y(a) {
    _(a);
  }
  function _(a) {
    const t = Array.from(a.querySelectorAll("table"));
    a.tagName === "TABLE" && t.push(a), t.forEach(function(n) {
      if (n[f]) return;
      const i = Array.from(n.querySelectorAll("th[" + d + "]"));
      i.length && (n[f] = new m(n, i));
    });
  }
  function m(a, t) {
    this.table = a, this.ths = t, this._col = -1, this._dir = null;
    const n = this;
    t.forEach(function(r, p) {
      if (r[f + "Bound"]) return;
      r[f + "Bound"] = !0;
      const l = r.querySelector("[" + E + "]");
      l && (l._lnSortClick = function() {
        n._handleClick(p, r);
      }, l.addEventListener("click", l._lnSortClick));
    });
    const i = a.closest("[data-ln-table][data-ln-persist]");
    if (i) {
      const r = wt("table-sort", i);
      r && r.dir && r.col >= 0 && r.col < t.length && (this._handleClick(r.col, t[r.col]), r.dir === "desc" && this._handleClick(r.col, t[r.col]));
    }
    return this;
  }
  m.prototype._handleClick = function(a, t) {
    let n;
    this._col !== a ? n = "asc" : this._dir === "asc" ? n = "desc" : this._dir === "desc" ? n = null : n = "asc", this.ths.forEach(function(r) {
      r.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), n === null ? (this._col = -1, this._dir = null) : (this._col = a, this._dir = n, t.classList.add(n === "asc" ? "ln-sort-asc" : "ln-sort-desc")), S(this.table, "ln-table:sort", {
      column: a,
      sortType: t.getAttribute(d),
      direction: n
    });
    const i = this.table.closest("[data-ln-table][data-ln-persist]");
    i && (n === null ? lt("table-sort", i, null) : lt("table-sort", i, { col: a, dir: n }));
  }, m.prototype.destroy = function() {
    this.table[f] && (this.ths.forEach(function(a) {
      const t = a.querySelector("[" + E + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete a[f + "Bound"];
    }), delete this.table[f]);
  };
  function u() {
    G(function() {
      new MutationObserver(function(t) {
        t.forEach(function(n) {
          n.type === "childList" ? n.addedNodes.forEach(function(i) {
            i.nodeType === 1 && _(i);
          }) : n.type === "attributes" && _(n.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table-sort");
  }
  window[f] = y, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const f = "data-ln-table", d = "lnTable", E = "data-ln-table-sort", y = "data-ln-table-empty";
  if (window[d] !== void 0) return;
  const u = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, a = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function t(r) {
    return a ? a.format(r) : String(r);
  }
  function n(r) {
    let p = r.parentElement;
    for (; p && p !== document.body && p !== document.documentElement; ) {
      const s = getComputedStyle(p).overflowY;
      if (s === "auto" || s === "scroll") return p;
      p = p.parentElement;
    }
    return null;
  }
  function i(r) {
    this.dom = r, this.table = r.querySelector("table"), this.tbody = r.querySelector("[data-ln-table-body]") || r.querySelector("tbody"), this.thead = r.querySelector("thead");
    const p = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = p ? Array.from(p.querySelectorAll("th")) : [], this.isDataDriven = r.hasAttribute("data-ln-table-source"), this.name = r.getAttribute(f) || "", this.source = r.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const l = this;
    if (this._onColumnFilter = function(s) {
      const e = s.detail.key;
      let h = null;
      for (let v = 0; v < l.ths.length; v++)
        if (l.ths[v].getAttribute("data-ln-table-filter-col") === e) {
          h = l.ths[v];
          break;
        }
      if (!h) return;
      const c = s.detail.values, o = h.querySelector("[data-ln-table-col-filter]");
      if (o && o.classList.toggle("ln-filter-active", !!(c && c.length > 0)), l.isDataDriven)
        !c || c.length === 0 ? delete l.currentFilters[e] : l.currentFilters[e] = c, l._requestData();
      else {
        if (!c || c.length === 0)
          delete l._columnFilters[e];
        else {
          const v = [];
          for (let g = 0; g < c.length; g++)
            v.push(c[g].toLowerCase());
          l._columnFilters[e] = v;
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), S(r, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }
    }, this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = r.querySelector("[data-ln-table-total]"), this._filteredSpan = r.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = r.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(e) {
        const h = e.detail || {};
        l._data = h.data || [], l._lastTotal = h.total != null ? h.total : l._data.length, l._lastFiltered = h.filtered != null ? h.filtered : l._data.length, l.totalCount = l._lastTotal, l.visibleCount = l._lastFiltered, l.isLoaded = !0, r.classList.remove("ln-table--loading"), l._vStart = -1, l._vEnd = -1, l._applyFilterAndSort(), l._render(), l._updateFooter(), S(r, "ln-table:rendered", {
          table: l.name,
          total: l.totalCount,
          visible: l.visibleCount
        });
      }, r.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(e) {
        const h = e.detail && e.detail.loading;
        r.classList.toggle("ln-table--loading", !!h), h && (l.isLoaded = !1);
      }, r.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(e) {
        const h = e.target.closest("[data-ln-table-col-sort]");
        if (!h) return;
        const c = h.closest("th");
        if (!c) return;
        const o = c.getAttribute("data-ln-table-col");
        o && l._handleSort(o, c);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), r.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClearAll = function(e) {
        if (e.target.closest("[data-ln-table-clear-all]") || e.target.closest("[data-ln-data-table-clear-all]")) {
          l.currentFilters = {};
          for (let c = 0; c < l.ths.length; c++) {
            const o = l.ths[c].querySelector("[data-ln-table-col-filter]");
            o && o.classList.remove("ln-filter-active");
          }
          S(r, "ln-table:clear-filters", { table: l.name }), l._requestData();
        }
      }, r.addEventListener("click", this._onClearAll), this._selectable = r.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(e) {
        if (e.target.closest("[data-ln-table-row-select]") || e.target.closest("[data-ln-table-row-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
        const h = e.target.closest("[data-ln-table-row]");
        if (!h) return;
        const c = h.getAttribute("data-ln-table-row-id"), o = h._lnRecord || {};
        S(r, "ln-table:row-click", {
          table: l.name,
          id: c,
          record: o
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
        const h = e.target.closest("[data-ln-table-row-action]");
        if (!h) return;
        e.stopPropagation();
        const c = h.closest("[data-ln-table-row]");
        if (!c) return;
        const o = h.getAttribute("data-ln-table-row-action"), v = c.getAttribute("data-ln-table-row-id"), g = c._lnRecord || {};
        S(r, "ln-table:row-action", {
          table: l.name,
          id: v,
          action: o,
          record: g
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const s = document.querySelector('[data-ln-search="' + r.id + '"]');
      if (s) {
        const e = s.tagName;
        this._searchInput = e === "INPUT" || e === "TEXTAREA" ? s : s.querySelector('input[type="search"]') || s.querySelector('input[type="text"]') || s.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(e) {
        e.preventDefault(), l.currentSearch = e.detail.term, l._searchInput && (l._searchInput.value = e.detail.term), S(r, "ln-table:search", {
          table: l.name,
          query: l.currentSearch
        }), l._requestData();
      }, r.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(e) {
        if (!r.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (e.key === "/") {
          l._searchInput && (e.preventDefault(), l._searchInput.focus());
          return;
        }
        const h = l.tbody ? Array.from(l.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (h.length)
          switch (e.key) {
            case "ArrowDown":
              e.preventDefault(), l._focusedRowIndex = Math.min(l._focusedRowIndex + 1, h.length - 1), l._focusRow(h);
              break;
            case "ArrowUp":
              e.preventDefault(), l._focusedRowIndex = Math.max(l._focusedRowIndex - 1, 0), l._focusRow(h);
              break;
            case "Home":
              e.preventDefault(), l._focusedRowIndex = 0, l._focusRow(h);
              break;
            case "End":
              e.preventDefault(), l._focusedRowIndex = h.length - 1, l._focusRow(h);
              break;
            case "Enter":
              if (l._focusedRowIndex >= 0 && l._focusedRowIndex < h.length) {
                e.preventDefault();
                const c = h[l._focusedRowIndex];
                S(r, "ln-table:row-click", {
                  table: l.name,
                  id: c.getAttribute("data-ln-table-row-id"),
                  record: c._lnRecord || {}
                });
              }
              break;
            case " ":
              if (l._selectable && l._focusedRowIndex >= 0 && l._focusedRowIndex < h.length) {
                e.preventDefault();
                const c = h[l._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                c && (c.checked = !c.checked, c.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), S(r, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        l.tbody.rows.length > 0 && (l._emptyTbodyObserver.disconnect(), l._emptyTbodyObserver = null, l._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(s) {
        s.preventDefault(), l._searchTerm = s.detail.term, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), S(r, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, r.addEventListener("ln-search:change", this._onSearch), this._onSort = function(s) {
        l._sortCol = s.detail.direction === null ? -1 : s.detail.column, l._sortDir = s.detail.direction, l._sortType = s.detail.sortType, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), S(r, "ln-table:sorted", {
          column: s.detail.column,
          direction: s.detail.direction,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, r.addEventListener("ln-table:sort", this._onSort), r.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(s) {
        if (!s.target.closest("[data-ln-table-clear]")) return;
        l._searchTerm = "";
        const h = document.querySelector('[data-ln-search="' + r.id + '"]');
        if (h) {
          const o = h.tagName === "INPUT" ? h : h.querySelector("input");
          o && (o.value = "");
        }
        l._columnFilters = {};
        for (let o = 0; o < l.ths.length; o++) {
          const v = l.ths[o].querySelector("[data-ln-table-col-filter]");
          v && v.classList.remove("ln-filter-active");
        }
        const c = document.querySelectorAll('[data-ln-filter="' + r.id + '"]');
        for (let o = 0; o < c.length; o++) {
          const v = c[o].querySelector("[data-ln-filter-reset]");
          v && (v.checked = !0, v.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), S(r, "ln-table:filter", {
          term: "",
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, r.addEventListener("click", this._onClear);
    return this;
  }
  i.prototype._parseRows = function() {
    const r = this.tbody.rows, p = this.ths;
    this._data = [];
    const l = [];
    for (let s = 0; s < p.length; s++)
      l[s] = p[s].getAttribute(E);
    r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40), this._lockColumnWidths();
    for (let s = 0; s < r.length; s++) {
      const e = r[s], h = [], c = [], o = [];
      for (let g = 0; g < e.cells.length; g++) {
        const b = e.cells[g], A = b.textContent.trim(), L = Ft(b), k = l[g];
        c[g] = A.toLowerCase(), k === "number" || k === "date" ? h[g] = parseFloat(L) || 0 : k === "string" ? h[g] = String(L) : h[g] = null, g < e.cells.length - 1 && o.push(A.toLowerCase());
      }
      let v = null;
      if (this.isDataDriven) {
        v = {};
        const g = e.getAttribute("data-ln-table-row-id");
        g != null && (v.id = g);
        for (let b = 0; b < p.length; b++) {
          const A = p[b].getAttribute("data-ln-table-col");
          if (A) {
            const L = b;
            if (L < e.cells.length) {
              const k = e.cells[L];
              v[A] = Ft(k);
            }
          }
        }
      }
      this._data.push({
        sortKeys: h,
        rawTexts: c,
        html: e.outerHTML,
        searchText: o.join(" "),
        id: this.isDataDriven && v ? v.id : void 0,
        ...v
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, i.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const r = (this.currentSearch || "").trim().toLowerCase(), p = this.currentFilters || {}, l = Object.keys(p).length > 0;
      if (this._filteredData = this._data.filter(function(v) {
        if (r) {
          let g = !1;
          for (const b in v)
            if (v.hasOwnProperty(b) && typeof v[b] == "string" && b !== "html" && b !== "searchText" && v[b].toLowerCase().indexOf(r) !== -1) {
              g = !0;
              break;
            }
          if (!g) return !1;
        }
        if (l)
          for (const g in p) {
            const b = p[g];
            if (b && b.length > 0) {
              const A = v[g], L = A != null ? String(A) : "";
              if (b.indexOf(L) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const s = this.currentSort.field, h = this.currentSort.direction === "desc" ? -1 : 1;
      let c = null;
      if (this.ths) {
        for (let v = 0; v < this.ths.length; v++)
          if (this.ths[v].getAttribute("data-ln-table-col") === s) {
            c = this.ths[v].getAttribute(E);
            break;
          }
      }
      const o = u ? u.compare : function(v, g) {
        return v < g ? -1 : v > g ? 1 : 0;
      };
      this._filteredData.sort(function(v, g) {
        const b = v[s], A = g[s];
        if (c === "number" || c === "date") {
          const C = parseFloat(b) || 0, x = parseFloat(A) || 0;
          return (C - x) * h;
        }
        if (typeof b == "number" && typeof A == "number")
          return (b - A) * h;
        const L = b != null ? String(b) : "", k = A != null ? String(A) : "";
        return o(L, k) * h;
      });
    } else {
      const r = this._searchTerm, p = this._columnFilters, l = Object.keys(p).length > 0, s = this.ths, e = {};
      if (l)
        for (let g = 0; g < s.length; g++) {
          const b = s[g].getAttribute("data-ln-table-filter-col");
          b && (e[b] = g);
        }
      if (!r && !l ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(g) {
        if (r && g.searchText.indexOf(r) === -1) return !1;
        if (l)
          for (const b in p) {
            const A = e[b];
            if (A !== void 0 && p[b].indexOf(g.rawTexts[A]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const h = this._sortCol, c = this._sortDir === "desc" ? -1 : 1, o = this._sortType === "number" || this._sortType === "date", v = u ? u.compare : function(g, b) {
        return g < b ? -1 : g > b ? 1 : 0;
      };
      this._filteredData.sort(function(g, b) {
        const A = g.sortKeys[h], L = b.sortKeys[h];
        return o ? (A - L) * c : v(A, L) * c;
      });
    }
  }, i.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const r = document.createElement("colgroup");
    this.ths.forEach(function(p) {
      const l = document.createElement("col");
      l.style.width = p.offsetWidth + "px", r.appendChild(l);
    }), this.table.insertBefore(r, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = r;
  }, i.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const r = this._lastTotal, p = this.visibleCount;
        if (r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || p === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, i.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, p = document.createDocumentFragment();
      for (let l = 0; l < r.length; l++) {
        const s = this._buildRow(r[l]);
        if (!s) break;
        p.appendChild(s);
      }
      this.tbody.textContent = "", this.tbody.appendChild(p), this._selectable && this._updateSelectAll();
    } else {
      const r = [], p = this._filteredData;
      for (let l = 0; l < p.length; l++) r.push(p[l].html);
      this.tbody.innerHTML = r.join("");
    }
  }, i.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    if (!this._rowHeight)
      if (this.isDataDriven) {
        if (this._data.length > 0) {
          const l = this._buildRow(this._data[0]);
          l && (this.tbody.textContent = "", this.tbody.appendChild(l), this._rowHeight = l.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const l = this.tbody ? this.tbody.rows : [];
        l.length > 0 && (this._rowHeight = l[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = n(this.dom) : this._scrollContainer = null;
    const p = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._renderVirtual();
      }));
    }, p.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, i.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, i.prototype._renderVirtual = function() {
    const r = this._filteredData, p = r.length, l = this._rowHeight;
    if (!l || !p) return;
    const s = this.thead ? this.thead.offsetHeight : 0, e = this._scrollContainer;
    let h, c;
    if (e) {
      const L = this.table.getBoundingClientRect(), k = e.getBoundingClientRect(), C = L.top - k.top + e.scrollTop + s;
      h = e.scrollTop - C, c = e.clientHeight;
    } else {
      const C = this.table.getBoundingClientRect().top + window.scrollY + s;
      h = window.scrollY - C, c = window.innerHeight;
    }
    let o = Math.max(0, Math.floor(h / l) - 15);
    o = Math.min(o, p);
    const v = Math.min(o + Math.ceil(c / l) + 30, p);
    if (o === this._vStart && v === this._vEnd) return;
    this._vStart = o, this._vEnd = v;
    const g = this.ths.length || 1, b = o * l, A = (p - v) * l;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (b > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const C = document.createElement("td");
        C.setAttribute("colspan", g), C.style.height = b + "px", k.appendChild(C), L.appendChild(k);
      }
      for (let k = o; k < v; k++) {
        const C = this._buildRow(r[k]);
        C && L.appendChild(C);
      }
      if (A > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const C = document.createElement("td");
        C.setAttribute("colspan", g), C.style.height = A + "px", k.appendChild(C), L.appendChild(k);
      }
      this.tbody.textContent = "", this.tbody.appendChild(L), this._selectable && this._updateSelectAll();
    } else {
      let L = "";
      b > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + g + '" style="height:' + b + 'px;padding:0;border:none"></td></tr>');
      for (let k = o; k < v; k++) L += r[k].html;
      A > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + g + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L;
    }
  }, i.prototype._showEmptyState = function() {
    const r = this.ths.length || 1;
    this.tbody.textContent = "";
    let p = null;
    if (this.isDataDriven) {
      const l = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount, e = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (s < l || s === 0), h = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (p = dt(this.dom, h, "ln-table"), !p) {
        const c = this.dom.querySelector("template[data-ln-table-empty]");
        if (c) {
          const o = e ? "search" : "initial", v = c.content.querySelector('[data-ln-table-empty-when="' + o + '"]') || c.content.firstElementChild;
          v && (p = document.importNode(v, !0));
        }
      }
      if (p)
        if (p.tagName === "TR")
          this.tbody.appendChild(p);
        else {
          const c = document.createElement("td");
          c.setAttribute("colspan", String(r)), c.appendChild(p);
          const o = document.createElement("tr");
          o.className = "ln-table__empty", o.appendChild(c), this.tbody.appendChild(o);
        }
    } else {
      const l = this.dom.querySelector("template[" + y + "]"), s = document.createElement("td");
      s.setAttribute("colspan", String(r)), l && s.appendChild(document.importNode(l.content, !0));
      const e = document.createElement("tr");
      e.className = "ln-table__empty", e.appendChild(s), this.tbody.appendChild(e);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, i.prototype._fillRow = function(r, p) {
    bt(r, p);
    const l = r.querySelectorAll("[data-ln-table-cell-attr]");
    for (let s = 0; s < l.length; s++) {
      const e = l[s], h = e.getAttribute("data-ln-table-cell-attr").split(",");
      for (let c = 0; c < h.length; c++) {
        const o = h[c].trim().split(":");
        if (o.length !== 2) continue;
        const v = o[0].trim(), g = o[1].trim();
        p[v] != null && e.setAttribute(g, p[v]);
      }
    }
  }, i.prototype._buildRow = function(r) {
    const p = dt(this.dom, this.name + "-row", "ln-table");
    if (!p) return null;
    const l = p.querySelector("[data-ln-table-row]") || p.firstElementChild;
    if (!l) return null;
    if (this._fillRow(l, r), l._lnRecord = r, r.id != null && l.setAttribute("data-ln-table-row-id", r.id), this._selectable && r.id != null && this.selectedIds.has(String(r.id))) {
      l.classList.add("ln-row-selected");
      const s = l.querySelector("[data-ln-table-row-select]");
      s && (s.checked = !0);
    }
    return l;
  }, i.prototype._handleSort = function(r, p) {
    let l;
    !this.currentSort || this.currentSort.field !== r ? l = "asc" : this.currentSort.direction === "asc" ? l = "desc" : l = null;
    for (let s = 0; s < this.ths.length; s++)
      this.ths[s].classList.remove("ln-sort-asc", "ln-sort-desc");
    l ? (this.currentSort = { field: r, direction: l }, p.classList.add(l === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-table:sort", {
      table: this.name,
      field: r,
      direction: l
    }), this._requestData();
  }, i.prototype._requestData = function() {
    jt(this, "ln-table:request-data", "table");
  }, i.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-table-row]");
    let p = r.length > 0;
    for (let l = 0; l < r.length; l++) {
      const s = r[l].getAttribute("data-ln-table-row-id");
      if (s != null && !this.selectedIds.has(s)) {
        p = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = p;
  }, Object.defineProperty(i.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), i.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    if (this._onSelectionChange = function(p) {
      const l = p.target.closest("[data-ln-table-row-select]");
      if (!l) return;
      const s = l.closest("[data-ln-table-row]");
      if (!s) return;
      const e = s.getAttribute("data-ln-table-row-id");
      e != null && (l.checked ? (r.selectedIds.add(e), s.classList.add("ln-row-selected")) : (r.selectedIds.delete(e), s.classList.remove("ln-row-selected")), r.selectedCount = r.selectedIds.size, r._updateSelectAll(), r._updateFooter(), S(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const p = document.createElement("input");
      p.type = "checkbox", p.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(p), this._selectAllCheckbox = p;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const p = r._selectAllCheckbox.checked, l = r.tbody ? r.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let s = 0; s < l.length; s++) {
        const e = l[s].getAttribute("data-ln-table-row-id"), h = l[s].querySelector("[data-ln-table-row-select]");
        e != null && (p ? (r.selectedIds.add(e), l[s].classList.add("ln-row-selected")) : (r.selectedIds.delete(e), l[s].classList.remove("ln-row-selected")), h && (h.checked = p));
      }
      r.selectedCount = r.selectedIds.size, S(r.dom, "ln-table:select-all", {
        table: r.name,
        selected: p
      }), S(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const p = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < p.length; l++) {
        const s = p[l].querySelector("[data-ln-table-row-select]"), e = p[l].getAttribute("data-ln-table-row-id");
        s && s.checked && e != null && (this.selectedIds.add(e), p[l].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, i.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const r = this.dom.querySelector("[data-ln-table-col-select]");
    if (r) {
      const p = r.querySelector('input[type="checkbox"]');
      p && p.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const p = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < p.length; l++) {
        p[l].classList.remove("ln-row-selected");
        const s = p[l].querySelector("[data-ln-table-row-select]");
        s && (s.checked = !1);
      }
    }
    this._updateFooter();
  }, i.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const r = this._lastTotal != null ? this._lastTotal : this._data.length, p = this.visibleCount, l = p < r;
    if (this._totalSpan && (this._totalSpan.textContent = t(r)), this._filteredSpan && (this._filteredSpan.textContent = l ? t(p) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const s = this.selectedIds.size;
      this._selectedSpan.textContent = s > 0 ? t(s) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
    }
  }, i.prototype._focusRow = function(r) {
    for (let p = 0; p < r.length; p++)
      r[p].classList.remove("ln-row-focused"), r[p].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < r.length) {
      const p = r[this._focusedRowIndex];
      p.classList.add("ln-row-focused"), p.setAttribute("tabindex", "0"), p.focus(), p.scrollIntoView({ block: "nearest" });
    }
  }, i.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter)) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, P(f, d, i, "ln-table");
})();
(function() {
  const f = "data-ln-list", d = "lnList", E = "data-ln-list-empty";
  if (window[d] !== void 0) return;
  function m(t) {
    let n = t;
    for (; n && n !== document.body && n !== document.documentElement; ) {
      const r = getComputedStyle(n).overflowY;
      if (r === "auto" || r === "scroll") return n;
      n = n.parentElement;
    }
    return null;
  }
  function u(t) {
    if (!t) return 0;
    const n = getComputedStyle(t), i = parseFloat(n.marginTop) || 0, r = parseFloat(n.marginBottom) || 0;
    return t.offsetHeight + i + r;
  }
  function a(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(f) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const n = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== t ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== t ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(i) {
      const r = i.detail || {};
      n._data = r.data || [], n._lastTotal = r.total != null ? r.total : n._data.length, n._lastFiltered = r.filtered != null ? r.filtered : n._data.length, n.totalCount = n._lastTotal, n.visibleCount = n._lastFiltered, n.isLoaded = !0, t.classList.remove("ln-list--loading"), n._vStart = -1, n._vEnd = -1, n._applyFilterAndSort(), n._render(), n._updateFooter(), S(t, "ln-list:rendered", {
        list: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(i) {
      const r = i.detail && i.detail.loading;
      t.classList.toggle("ln-list--loading", !!r), r && (n.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(i) {
      (i.target.closest("[data-ln-list-clear-all]") || i.target.closest("[data-ln-data-list-clear-all]")) && (n.currentFilters = {}, S(t, "ln-list:clear-filters", { list: n.name }), n._requestData());
    }, t.addEventListener("click", this._onClearAll), this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(i) {
      if (i.target.closest("[data-ln-item-select]") || i.target.closest("[data-ln-item-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const r = i.target.closest("[data-ln-item]");
      if (!r) return;
      const p = r.getAttribute("data-ln-item-id"), l = r._lnRecord || {};
      S(t, "ln-list:item-click", {
        list: n.name,
        id: p,
        record: l
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(i) {
      const r = i.target.closest("[data-ln-item-action]");
      if (!r) return;
      i.stopPropagation();
      const p = r.closest("[data-ln-item]");
      if (!p) return;
      const l = r.getAttribute("data-ln-item-action"), s = p.getAttribute("data-ln-item-id"), e = p._lnRecord || {};
      S(t, "ln-list:item-action", {
        list: n.name,
        id: s,
        action: l,
        record: e
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(i) {
      i.preventDefault(), n.currentSearch = i.detail.term, S(t, "ln-list:search", {
        list: n.name,
        query: n.currentSearch
      }), n._requestData();
    }, t.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), S(t, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      n.tbody.children.length > 0 && (n._emptyObserver.disconnect(), n._emptyObserver = null, n._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(i) {
      i.preventDefault(), n._searchTerm = i.detail.term, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), S(t, "ln-list:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-list-clear]")) return;
      n._searchTerm = "";
      const p = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (p) {
        const l = p.tagName === "INPUT" ? p : p.querySelector("input");
        l && (l.value = "");
      }
      n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), S(t, "ln-list:filter", {
        term: "",
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("click", this._onClear)), this;
  }
  a.prototype._parseChildren = function() {
    const t = Array.from(this.tbody.children).filter((n) => !n.classList.contains("ln-list__spacer"));
    this._data = [], t.length > 0 && (this._itemHeight = u(t[0]) || 50);
    for (let n = 0; n < t.length; n++) {
      const i = t[n], r = i.getAttribute("data-ln-item-id") || i.getAttribute("id"), p = i.textContent.trim().toLowerCase();
      let l = null;
      if (this.isDataDriven) {
        l = {}, r != null && (l.id = r);
        const s = i.querySelectorAll("[data-ln-list-field]");
        for (let e = 0; e < s.length; e++) {
          const h = s[e], c = h.getAttribute("data-ln-list-field");
          c && (l[c] = h.textContent.trim());
        }
      }
      this._data.push({
        html: i.outerHTML,
        searchText: p,
        id: r,
        ...l
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, a.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), n = this.currentFilters || {}, i = Object.keys(n).length > 0;
      if (this._filteredData = this._data.filter(function(s) {
        if (t) {
          let e = !1;
          for (const h in s)
            if (s.hasOwnProperty(h) && typeof s[h] == "string" && h !== "html" && h !== "searchText" && s[h].toLowerCase().indexOf(t) !== -1) {
              e = !0;
              break;
            }
          if (!e) return !1;
        }
        if (i)
          for (const e in n) {
            const h = n[e];
            if (h && h.length > 0) {
              const c = s[e], o = c != null ? String(c) : "";
              if (h.indexOf(o) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const r = this.currentSort.field, p = this.currentSort.direction === "desc" ? -1 : 1, l = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(s, e) {
        return s < e ? -1 : s > e ? 1 : 0;
      };
      this._filteredData.sort(function(s, e) {
        const h = s[r], c = e[r];
        if (typeof h == "number" && typeof c == "number")
          return (h - c) * p;
        const o = h != null ? String(h) : "", v = c != null ? String(c) : "";
        return l(o, v) * p;
      });
    } else {
      const t = this._searchTerm;
      t ? this._filteredData = this._data.filter(function(n) {
        return n.searchText.indexOf(t) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, a.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
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
  }, a.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, n = document.createDocumentFragment();
      for (let i = 0; i < t.length; i++) {
        const r = this._buildItem(t[i]);
        if (!r) break;
        n.appendChild(r);
      }
      this.tbody.textContent = "", this.tbody.appendChild(n), this._selectable && this._updateSelectAll();
    } else {
      const t = [], n = this._filteredData;
      for (let i = 0; i < n.length; i++) t.push(n[i].html);
      this.tbody.innerHTML = t.join("");
    }
  }, a.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), n = t.gridTemplateColumns;
    let i = 1;
    if (n && n !== "none") {
      const p = n.trim().split(/\s+/).filter(Boolean);
      p.length > 0 && (i = p.length);
    }
    const r = parseFloat(t.rowGap);
    return { columns: i, rowGap: isNaN(r) ? 0 : r };
  }, a.prototype._measureItemHeight = function() {
    if (this.isDataDriven) {
      if (this._data.length > 0) {
        const t = this._buildItem(this._data[0]);
        t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._itemHeight = u(t) || 50, this.tbody.textContent = "");
      }
    } else {
      const t = this.tbody.children;
      t.length > 0 && (this._itemHeight = u(t[0]) || 50);
    }
  }, a.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = m(this.dom);
    const n = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      t._itemHeight = 0, t._measureItemHeight(), t._vStart = -1, t._vEnd = -1, t._renderVirtual();
    }, n.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, a.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, a.prototype._renderVirtual = function() {
    const t = this._filteredData, n = t.length, i = this._itemHeight;
    if (!i || !n) return;
    const r = this._scrollContainer;
    let p, l;
    if (r) {
      const x = this.tbody.getBoundingClientRect(), I = r.getBoundingClientRect(), R = r === this.tbody ? 0 : x.top - I.top + r.scrollTop;
      p = r.scrollTop - R, l = r.clientHeight;
    } else {
      const I = this.tbody.getBoundingClientRect().top + window.scrollY;
      p = window.scrollY - I, l = window.innerHeight;
    }
    const s = this._readGridLayout(), e = s.columns, h = s.rowGap, c = i + h, o = Math.ceil(n / e);
    let v = Math.max(0, Math.floor(p / c) - 15);
    v = Math.min(v, o);
    const g = Math.ceil(l / c) + 30, b = Math.min(v + g, o), A = Math.min(v * e, n), L = Math.min(b * e, n);
    if (A === this._vStart && L === this._vEnd) return;
    this._vStart = A, this._vEnd = L;
    const k = v * c, C = (o - b) * c;
    if (this.isDataDriven) {
      const x = document.createDocumentFragment();
      if (k > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = k + "px", x.appendChild(I);
      }
      for (let I = A; I < L; I++) {
        const R = this._buildItem(t[I]);
        R && x.appendChild(R);
      }
      if (C > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = C + "px", x.appendChild(I);
      }
      this.tbody.textContent = "", this.tbody.appendChild(x), this._selectable && this._updateSelectAll();
    } else {
      let x = "";
      k > 0 && (x += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${k}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let I = A; I < L; I++)
        x += t[I].html;
      C > 0 && (x += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${C}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = x;
    }
  }, a.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const n = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount, r = this.currentSearch && (i < n || i === 0), p = r ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = dt(this.dom, p, "ln-list"), !t) {
        const l = this.dom.querySelector("template[data-ln-empty]");
        if (l) {
          const s = r ? "search" : "initial", e = l.content.querySelector(`[data-ln-empty-when="${s}"]`) || l.content.firstElementChild;
          e && (t = document.importNode(e, !0));
        }
      }
    } else {
      const n = this.dom.querySelector(`template[${E}]`);
      n && (t = document.importNode(n.content, !0));
    }
    if (t)
      if (t.tagName === "LI" || t.tagName === "TR")
        this.tbody.appendChild(t);
      else {
        const n = document.createElement(this.isUl ? "li" : "div");
        n.appendChild(t), this.tbody.appendChild(n);
      }
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, a.prototype._buildItem = function(t) {
    const n = dt(this.dom, this.name + "-row", "ln-list");
    if (!n) return null;
    const i = n.querySelector("[data-ln-item]") || n.firstElementChild;
    if (!i) return null;
    if (bt(i, t), J(i, t), i._lnRecord = t, t.id != null && (i.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      i.classList.add("ln-item-selected");
      const r = i.querySelector("[data-ln-item-select]");
      r && (r.checked = !0);
    }
    return i;
  }, a.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(n) {
      const i = n.target.closest("[data-ln-item-select]");
      if (!i) return;
      const r = i.closest("[data-ln-item]");
      if (!r) return;
      const p = r.getAttribute("data-ln-item-id");
      p != null && (i.checked ? (t.selectedIds.add(String(p)), r.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(p)), r.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), S(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const n = t._selectAllCheckbox.checked, i = t.tbody.querySelectorAll("[data-ln-item]");
      for (let r = 0; r < i.length; r++) {
        const p = i[r], l = p.getAttribute("data-ln-item-id"), s = p.querySelector("[data-ln-item-select]");
        l != null && (n ? (t.selectedIds.add(String(l)), p.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(l)), p.classList.remove("ln-item-selected")), s && (s.checked = n));
      }
      S(t.dom, "ln-list:select-all", { list: t.name, selected: n }), S(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, a.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    let n = t.length > 0;
    for (let i = 0; i < t.length; i++) {
      const r = t[i].getAttribute("data-ln-item-id");
      if (r != null && !this.selectedIds.has(String(r))) {
        n = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = n;
  }, a.prototype._requestData = function() {
    jt(this, "ln-list:request-data", "list");
  }, a.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount, i = n < t;
    if (this._totalSpan && (this._totalSpan.textContent = t), this._filteredSpan && (this._filteredSpan.textContent = i ? n : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const r = this.selectedIds.size;
      this._selectedSpan.textContent = r > 0 ? r : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, a.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, P(f, d, a, "ln-list");
})();
(function() {
  const f = "data-ln-circular-progress", d = "lnCircularProgress";
  if (window[d] !== void 0) return;
  const E = "http://www.w3.org/2000/svg", y = 36, _ = 16, m = 2 * Math.PI * _;
  function u(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), i.call(this), n.call(this), r.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  u.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[d]);
  };
  function a(r, p) {
    const l = document.createElementNS(E, r);
    for (const s in p)
      l.setAttribute(s, p[s]);
    return l;
  }
  function t() {
    this.svg = a("svg", {
      viewBox: "0 0 " + y + " " + y,
      "aria-hidden": "true"
    }), this.trackCircle = a("circle", {
      cx: y / 2,
      cy: y / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = a("circle", {
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
  function n() {
    const r = this, p = new MutationObserver(function(l) {
      for (const s of l)
        (s.attributeName === "data-ln-circular-progress" || s.attributeName === "data-ln-circular-progress-max" || s.attributeName === "data-ln-circular-progress-label") && i.call(r);
    });
    p.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = p;
  }
  function i() {
    const r = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, p = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let l = p > 0 ? r / p * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100);
    const s = m - l / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", s);
    const e = this.dom.getAttribute("data-ln-circular-progress-label"), h = e !== null ? e : Math.round(l) + "%";
    this.labelEl.textContent = h, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(p));
    const c = Math.max(0, Math.min(r, p));
    this.dom.setAttribute("aria-valuenow", String(c)), this.dom.setAttribute("aria-valuetext", h), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: r,
      max: p,
      percentage: l
    });
  }
  P(f, d, u, "ln-circular-progress");
})();
(function() {
  const f = "data-ln-sortable", d = "lnSortable", E = "data-ln-sortable-handle";
  if (window[d] !== void 0) return;
  function y(m) {
    this.dom = m, this.isEnabled = m.getAttribute(f) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const u = this;
    return this._onPointerDown = function(a) {
      u.isEnabled && u._handlePointerDown(a);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(f, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(f, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[d]);
  }, y.prototype._handlePointerDown = function(m) {
    let u = m.target.closest("[" + E + "]"), a;
    if (u) {
      for (a = u; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + E + "]")) return;
      for (a = m.target; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
      u = a;
    }
    const n = Array.from(this.dom.children).indexOf(a);
    if (V(this.dom, "ln-sortable:before-drag", {
      item: a,
      index: n
    }).defaultPrevented) return;
    m.preventDefault(), u.setPointerCapture(m.pointerId), this._dragging = a, a.classList.add("ln-sortable--dragging"), a.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: a,
      index: n
    });
    const r = this, p = function(s) {
      r._handlePointerMove(s);
    }, l = function(s) {
      r._handlePointerEnd(s), u.removeEventListener("pointermove", p), u.removeEventListener("pointerup", l), u.removeEventListener("pointercancel", l);
    };
    u.addEventListener("pointermove", p), u.addEventListener("pointerup", l), u.addEventListener("pointercancel", l);
  }, y.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const u = Array.from(this.dom.children), a = this._dragging;
    for (const t of u)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of u) {
      if (t === a) continue;
      const n = t.getBoundingClientRect(), i = n.top + n.height / 2;
      if (m.clientY >= n.top && m.clientY < i) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= i && m.clientY <= n.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const u = this._dragging, a = Array.from(this.dom.children), t = a.indexOf(u);
    let n = null, i = null;
    for (const r of a) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        n = r, i = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        n = r, i = "after";
        break;
      }
    }
    for (const r of a)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (u.classList.remove("ln-sortable--dragging"), u.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), n && n !== u) {
      i === "before" ? this.dom.insertBefore(u, n) : this.dom.insertBefore(u, n.nextElementSibling);
      const p = Array.from(this.dom.children).indexOf(u);
      S(this.dom, "ln-sortable:reordered", {
        item: u,
        oldIndex: t,
        newIndex: p
      });
    }
    this._dragging = null;
  };
  function _(m) {
    const u = m[d];
    if (!u) return;
    const a = m.getAttribute(f) !== "disabled";
    a !== u.isEnabled && (u.isEnabled = a, S(m, a ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  P(f, d, y, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const f = "data-ln-confirm", d = "lnConfirm", E = "data-ln-confirm-timeout";
  if (window[d] !== void 0) return;
  function _(...u) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...u);
  }
  function m(u) {
    _("constructor called on", u), this.dom = u, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = u.querySelector("[data-ln-confirm-idle]"), this.activeEl = u.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = u.textContent.trim(), this.confirmText = u.getAttribute(f) || "Confirm?");
    const a = this;
    return this._onClick = function(t) {
      if (_("click handler, confirming:", a.confirming, "submitted:", a._submitted, "target:", t.target), !a.confirming)
        t.preventDefault(), t.stopImmediatePropagation(), a._enterConfirm();
      else {
        if (a._submitted) return;
        a._submitted = !0, a._reset();
      }
    }, u.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const u = parseFloat(this.dom.getAttribute(E));
    return isNaN(u) || u <= 0 ? 3 : u;
  }, m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden"), this.originalAriaLabel = this.dom.getAttribute("aria-label");
      const a = this.activeEl ? this.activeEl.textContent.trim() : "";
      a && (this.dom.setAttribute("aria-label", a), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = a, this.dom.appendChild(this.alertNode));
    } else {
      var u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = u.getAttribute("href"), u.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const u = this, a = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      u._reset();
    }, a);
  }, m.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null;
    else if (this.isIconButton) {
      var u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalIconHref && u.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    _("destroy called on", this.dom), this.dom[d] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[d]);
  }, P(f, d, m, "ln-confirm");
})();
(function() {
  const f = "data-ln-translations", d = "lnTranslations";
  if (window[d] !== void 0) return;
  const E = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function y(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(f + "-default") || "", this.badgesEl = _.querySelector("[" + f + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = _.getAttribute(f + "-locales");
    if (this.locales = E, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const u = this;
    return this._onRequestAdd = function(a) {
      a.detail && a.detail.lang && u.addLanguage(a.detail.lang);
    }, this._onRequestRemove = function(a) {
      a.detail && a.detail.lang && u.removeLanguage(a.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  y.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of _) {
      const u = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const a of u)
        a.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, y.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of _) {
      const u = m.getAttribute("data-ln-translatable-lang");
      u && u !== this.defaultLang && this.activeLanguages.add(u);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, y.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let m = 0;
    for (const a in this.locales) {
      if (!this.locales.hasOwnProperty(a) || this.activeLanguages.has(a)) continue;
      m++;
      const t = vt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const n = t.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", a), n.textContent = this.locales[a], n.addEventListener("click", function(i) {
        i.ctrlKey || i.metaKey || i.button === 1 || (i.preventDefault(), i.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(a));
      }), this.menuEl.appendChild(t);
    }
    const u = this.dom.querySelector("[" + f + "-add]");
    u && (u.style.display = m === 0 ? "none" : "");
  }, y.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(m) {
      const u = vt("ln-translations-badge", "ln-translations");
      if (!u) return;
      const a = u.querySelector("[data-ln-translations-lang]");
      a.setAttribute("data-ln-translations-lang", m);
      const t = a.querySelector("span");
      t.textContent = _.locales[m] || m.toUpperCase();
      const n = a.querySelector("button");
      n.setAttribute("aria-label", "Remove " + (_.locales[m] || m.toUpperCase())), n.addEventListener("click", function(i) {
        i.ctrlKey || i.metaKey || i.button === 1 || (i.preventDefault(), i.stopPropagation(), _.removeLanguage(m));
      }), _.badgesEl.appendChild(u);
    });
  }, y.prototype.addLanguage = function(_, m) {
    if (this.activeLanguages.has(_)) return;
    const u = this.locales[_] || _;
    if (V(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: u
    }).defaultPrevented) return;
    this.activeLanguages.add(_), m = m || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const n of t) {
      const i = n.getAttribute("data-ln-translatable"), r = n.getAttribute("data-ln-translations-prefix") || "", p = n.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!p) continue;
      const l = p.cloneNode(!1);
      r ? l.name = r + "[trans][" + _ + "][" + i + "]" : l.name = "trans[" + _ + "][" + i + "]", l.value = m[i] !== void 0 ? m[i] : "", l.removeAttribute("id"), l.placeholder = u + " translation", l.setAttribute("data-ln-translatable-lang", _);
      const s = n.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), e = s.length > 0 ? s[s.length - 1] : p;
      e.parentNode.insertBefore(l, e.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: u
    });
  }, y.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || V(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const u = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const a of u)
      a.parentNode.removeChild(a);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: _
    });
  }, y.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, y.prototype.hasLanguage = function(_) {
    return this.activeLanguages.has(_);
  }, y.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const _ = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const u of m)
      u.getAttribute("data-ln-translatable-lang") !== _ && u.parentNode.removeChild(u);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[d];
  }, P(f, d, y, "ln-translations");
})();
(function() {
  const f = "data-ln-autosave", d = "lnAutosave", E = "data-ln-autosave-clear", y = "data-ln-autosave-debounce-input", _ = "ln-autosave:";
  if (window[d] !== void 0) return;
  function u(i) {
    const r = a(i);
    if (!r) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", i);
      return;
    }
    this.dom = i, this.key = r;
    let p = null;
    function l() {
      const c = zt(i, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(r, JSON.stringify(c));
      } catch {
        return;
      }
      S(i, "ln-autosave:saved", { target: i, data: c });
    }
    function s() {
      let c;
      try {
        c = localStorage.getItem(r);
      } catch {
        return;
      }
      if (!c) return;
      let o;
      try {
        o = JSON.parse(c);
      } catch {
        return;
      }
      if (V(i, "ln-autosave:before-restore", { target: i, data: o }).defaultPrevented) return;
      const g = Vt(i, o);
      for (let b = 0; b < g.length; b++)
        g[b].dispatchEvent(new Event("input", { bubbles: !0 })), g[b].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(i, "ln-autosave:restored", { target: i, data: o });
    }
    function e() {
      try {
        localStorage.removeItem(r);
      } catch {
        return;
      }
      S(i, "ln-autosave:cleared", { target: i });
    }
    this._onFocusout = function(c) {
      const o = c.target;
      t(o) && o.name && !o.hasAttribute("data-ln-autosave-exclude") && l();
    }, this._onChange = function(c) {
      const o = c.target;
      t(o) && o.name && !o.hasAttribute("data-ln-autosave-exclude") && l();
    }, this._onSubmit = function() {
      e();
    }, this._onReset = function() {
      e();
    }, this._onClearClick = function(c) {
      c.target.closest("[" + E + "]") && e();
    }, i.addEventListener("focusout", this._onFocusout), i.addEventListener("change", this._onChange), i.addEventListener("submit", this._onSubmit), i.addEventListener("reset", this._onReset), i.addEventListener("click", this._onClearClick);
    const h = n(i);
    return h > 0 && (this._onInput = function(c) {
      const o = c.target;
      !t(o) || !o.name || o.hasAttribute("data-ln-autosave-exclude") || (p !== null && clearTimeout(p), p = setTimeout(l, h));
    }, i.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return p;
    }, s(), this;
  }
  u.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const i = this._getInputTimer();
        i !== null && clearTimeout(i);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function a(i) {
    const p = i.getAttribute(f) || i.id;
    return p ? _ + window.location.pathname + ":" + p : null;
  }
  function t(i) {
    const r = i.tagName;
    return r === "INPUT" || r === "TEXTAREA" || r === "SELECT";
  }
  function n(i) {
    if (!i.hasAttribute(y)) return 0;
    const r = i.getAttribute(y);
    if (r === "" || r === null) return 1e3;
    const p = parseInt(r, 10);
    return isNaN(p) || p < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", i), 1e3) : p;
  }
  P(f, d, u, "ln-autosave");
})();
(function() {
  const f = "data-ln-autoresize", d = "lnAutoresize";
  if (window[d] !== void 0) return;
  function E(y) {
    if (y.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", y.tagName), this;
    this.dom = y;
    const _ = this;
    return this._onInput = function() {
      _._resize();
    }, y.addEventListener("input", this._onInput), this._resize(), this;
  }
  E.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[d]);
  }, P(f, d, E, "ln-autoresize");
})();
(function() {
  const f = "data-ln-editor", d = "lnEditor";
  if (window[d] !== void 0) return;
  var E = {
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
  function u(s) {
    this.dom = s;
    var e = this;
    if (this._textarea = s.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", s), this;
    var h = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), h && this._surface.setAttribute("data-placeholder", h);
    var c = this._textarea.id;
    if (c) {
      var o = s.querySelector('label[for="' + c + '"]');
      o && (o.id || (o.id = c + "-label"), this._surface.setAttribute("aria-labelledby", o.id));
    }
    var v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    var g = s.querySelector("nav");
    return g && g.nextSibling ? s.insertBefore(this._surface, g.nextSibling) : s.appendChild(this._surface), this._onInput = function() {
      e._syncToTextarea(), S(e.dom, "ln-editor:changed", {
        html: e._textarea.value,
        target: e.dom
      });
    }, this._onMousedownToolbar = function(b) {
      var A = b.target.closest("[data-ln-editor-action]");
      A && b.preventDefault();
    }, this._onClickToolbar = function(b) {
      var A = b.target.closest("[data-ln-editor-action]");
      if (A) {
        var L = A.getAttribute("data-ln-editor-action");
        e._execAction(L);
      }
    }, this._onPaste = function(b) {
      n(e, b);
    }, this._onKeydown = function(b) {
      p(e, b);
    }, this._onSelectionChange = function() {
      e._updateActiveStates();
    }, this._onFocus = function() {
      S(e.dom, "ln-editor:focus", { target: e.dom });
    }, this._onBlur = function() {
      e._syncToTextarea(), S(e.dom, "ln-editor:blur", { target: e.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), g && (g.addEventListener("mousedown", this._onMousedownToolbar), g.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(b) {
      var A = b.detail && b.detail.html;
      A !== void 0 && (e._surface.innerHTML = A, e._syncToTextarea());
    }, s.addEventListener("ln-editor:set-content", this._onSetContent), this;
  }
  u.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, u.prototype._execAction = function(s) {
    if (s) {
      var e = V(this.dom, "ln-editor:before-change", {
        action: s,
        target: this.dom
      });
      if (!e.defaultPrevented) {
        if (this._surface.focus(), y[s])
          document.execCommand(y[s], !1, null);
        else if (_[s]) {
          var h = _[s], c = a(this._surface);
          c && c.toLowerCase() === h ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + h + ">");
        } else m[s] ? document.execCommand(m[s], !1, null) : s === "link" ? l(this) : s === "unlink" ? document.execCommand("unlink", !1, null) : s === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
        this._syncToTextarea(), this._updateActiveStates(), S(this.dom, "ln-editor:changed", {
          html: this._textarea.value,
          target: this.dom
        });
      }
    }
  }, u.prototype._updateActiveStates = function() {
    var s = this.dom.querySelector("nav");
    if (s) {
      var e = window.getSelection();
      if (!(!e || e.rangeCount === 0)) {
        var h = e.anchorNode;
        if (!(!h || !this._surface.contains(h)))
          for (var c = s.querySelectorAll("[data-ln-editor-action]"), o = 0; o < c.length; o++) {
            var v = c[o], g = v.getAttribute("data-ln-editor-action"), b = !1;
            if (y[g])
              try {
                b = document.queryCommandState(y[g]);
              } catch {
              }
            else if (_[g]) {
              var A = a(this._surface);
              b = A && A.toLowerCase() === _[g];
            } else if (m[g])
              try {
                b = document.queryCommandState(m[g]);
              } catch {
              }
            else g === "link" && (b = !!t(e.anchorNode, "A", this._surface));
            b ? v.classList.add("ln-editor-active") : v.classList.remove("ln-editor-active");
          }
      }
    }
  }, u.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, u.prototype.setHTML = function(s) {
    this._surface && (this._surface.innerHTML = s, this._syncToTextarea());
  }, u.prototype.destroy = function() {
    if (this.dom[d]) {
      this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
      var s = this.dom.querySelector("nav");
      s && (s.removeEventListener("mousedown", this._onMousedownToolbar), s.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
      var e = this.dom.querySelector(".ln-editor__link-popover");
      e && e.remove(), S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function a(s) {
    var e = window.getSelection();
    if (!e || e.rangeCount === 0) return null;
    var h = e.anchorNode;
    if (!h) return null;
    for (; h && h !== s; ) {
      if (h.nodeType === 1) {
        var c = h.tagName;
        if (c === "H2" || c === "H3" || c === "H4" || c === "BLOCKQUOTE" || c === "PRE" || c === "P")
          return c;
      }
      h = h.parentNode;
    }
    return null;
  }
  function t(s, e, h) {
    for (; s && s !== h; ) {
      if (s.nodeType === 1 && s.tagName === e)
        return s;
      s = s.parentNode;
    }
    return null;
  }
  function n(s, e) {
    e.preventDefault();
    var h = "";
    if (e.clipboardData && (h = e.clipboardData.getData("text/html"), !h)) {
      var c = e.clipboardData.getData("text/plain");
      c && (h = c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), h = "<p>" + h + "</p>");
    }
    if (h) {
      var o = i(h);
      o && document.execCommand("insertHTML", !1, o);
    }
  }
  function i(s) {
    var e = document.createElement("div");
    return e.innerHTML = s, r(e), e.innerHTML;
  }
  function r(s) {
    for (var e = Array.from(s.childNodes), h = 0; h < e.length; h++) {
      var c = e[h];
      if (c.nodeType !== 3) {
        if (c.nodeType !== 1) {
          s.removeChild(c);
          continue;
        }
        if (E[c.tagName]) {
          for (var o = Array.from(c.attributes), v = 0; v < o.length; v++) {
            var g = o[v].name;
            if (c.tagName === "A" && g === "href") {
              var b = c.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(b) || c.removeAttribute("href");
            } else
              c.removeAttribute(g);
          }
          c.tagName === "A" && c.setAttribute("rel", "noopener noreferrer"), r(c);
        } else {
          for (; c.firstChild; )
            s.insertBefore(c.firstChild, c);
          s.removeChild(c);
        }
      }
    }
  }
  function p(s, e) {
    if (e.ctrlKey || e.metaKey) {
      var h = null;
      switch (e.key.toLowerCase()) {
        case "b":
          h = "bold";
          break;
        case "i":
          h = "italic";
          break;
        case "u":
          h = "underline";
          break;
        case "k":
          h = "link";
          break;
      }
      h && (e.preventDefault(), s._execAction(h));
    }
  }
  function l(s) {
    var e = window.getSelection();
    if (!e || e.rangeCount === 0) return;
    var h = t(e.anchorNode, "A", s._surface), c = e.getRangeAt(0).cloneRange(), o = s.dom.querySelector(".ln-editor__link-popover");
    o && o.remove();
    var v = document.createElement("div");
    v.className = "ln-editor__link-popover";
    var g = document.createElement("input");
    g.type = "url", g.placeholder = "https://…", h && (g.value = h.getAttribute("href") || "");
    var b = document.createElement("button");
    b.type = "button", b.innerHTML = '<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-check"></use></svg>', b.setAttribute("aria-label", "Confirm");
    var A = document.createElement("button");
    A.type = "button", A.innerHTML = '<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>', A.setAttribute("aria-label", "Cancel"), v.appendChild(g), v.appendChild(b), v.appendChild(A);
    var L = s.dom.querySelector("nav");
    L ? L.after(v) : s.dom.insertBefore(v, s._surface), g.focus();
    function k() {
      var I = window.getSelection();
      I.removeAllRanges(), I.addRange(c);
    }
    function C() {
      var I = g.value.trim();
      if (v.remove(), k(), s._surface.focus(), I)
        if (h)
          h.setAttribute("href", I);
        else {
          document.execCommand("createLink", !1, I);
          var R = window.getSelection();
          if (R && R.anchorNode) {
            var B = t(R.anchorNode, "A", s._surface);
            B && B.setAttribute("rel", "noopener noreferrer");
          }
        }
      else h && document.execCommand("unlink", !1, null);
      s._syncToTextarea(), S(s.dom, "ln-editor:changed", {
        html: s._textarea.value,
        target: s.dom
      });
    }
    function x() {
      v.remove(), k(), s._surface.focus();
    }
    b.addEventListener("click", C), A.addEventListener("click", x), g.addEventListener("keydown", function(I) {
      I.key === "Enter" ? (I.preventDefault(), C()) : I.key === "Escape" && (I.preventDefault(), x());
    });
  }
  P(f, d, u, "ln-editor");
})();
(function() {
  const f = "data-ln-validate", d = "lnValidate", E = "data-ln-validate-errors", y = "data-ln-validate-error", _ = "ln-validate-valid", m = "ln-validate-invalid", u = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[d] !== void 0) return;
  function a(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, i = t.tagName, r = t.type, p = i === "SELECT" || r === "checkbox" || r === "radio";
    return this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(l) {
      const s = l.detail && l.detail.error;
      if (!s) return;
      n._customErrors.add(s), n._touched = !0;
      const e = t.closest(".form-element");
      if (e) {
        const h = e.querySelector("[" + y + '="' + s + '"]');
        h && h.classList.remove("hidden");
      }
      t.classList.remove(_), t.classList.add(m);
    }, this._onClearCustom = function(l) {
      const s = l.detail && l.detail.error, e = t.closest(".form-element");
      if (s) {
        if (n._customErrors.delete(s), e) {
          const h = e.querySelector("[" + y + '="' + s + '"]');
          h && h.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(h) {
          if (e) {
            const c = e.querySelector("[" + y + '="' + h + '"]');
            c && c.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, p || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  a.prototype.validate = function() {
    const t = this.dom, n = t.validity, r = t.checkValidity() && this._customErrors.size === 0, p = t.closest(".form-element");
    if (p) {
      const s = p.querySelector("[" + E + "]");
      if (s) {
        const e = s.querySelectorAll("[" + y + "]");
        for (let h = 0; h < e.length; h++) {
          const c = e[h].getAttribute(y), o = u[c];
          o && (n[o] ? e[h].classList.remove("hidden") : e[h].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(_, r), t.classList.toggle(m, !r), S(t, r ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), r;
  }, a.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, m);
    const t = this.dom.closest(".form-element");
    if (t) {
      const n = t.querySelectorAll("[" + y + "]");
      for (let i = 0; i < n.length; i++)
        n[i].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), a.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(_, m), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[d]);
  }, P(f, d, a, "ln-validate");
})();
(function() {
  const f = "data-ln-form", d = "lnForm", E = "data-ln-form-action-edit", y = "data-ln-form-action-method", _ = "data-ln-form-scope";
  if (window[d] !== void 0) return;
  function m(u) {
    this.dom = u, this._baseAction = u.getAttribute("action") || "";
    const a = this;
    return this._onLnFill = function(t) {
      t.target === a.dom && (t.detail ? (a.fill(t.detail), a._applyActionMode(t.detail)) : a.dom.reset());
    }, this._onReset = function() {
      a._applyActionMode(null);
    }, this._onSubmit = function(t) {
      if (!a.dom.hasAttribute(_)) return;
      const n = a.dom.querySelector('input[name="_method"]');
      let i = n && n.value !== "" ? n.value.toUpperCase() : a.dom.method.toUpperCase();
      if (i !== "POST" && i !== "PUT" && i !== "PATCH") return;
      t.preventDefault();
      const r = zt(a.dom), p = a.dom.getAttribute(_);
      delete r._method, delete r._token;
      const l = {
        scope: p || null,
        action: a._baseAction,
        actionResolved: a.dom.getAttribute("action") || "",
        method: i,
        data: r,
        form: a.dom,
        claimed: !1
      };
      S(a.dom, "ln-form:submit-record", l), l.claimed || console.warn("[ln-form] ln-form:submit-record was not claimed. Check the data-ln-form-scope name, or make sure this form is nested inside a [data-ln-data-coordinator] element.");
    }, u.addEventListener("ln-fill", this._onLnFill), u.addEventListener("reset", this._onReset), u.addEventListener("submit", this._onSubmit), this;
  }
  m.prototype.fill = function(u) {
    const a = Vt(this.dom, u);
    for (let t = 0; t < a.length; t++) {
      const n = a[t], i = n.tagName === "SELECT" || n.type === "checkbox" || n.type === "radio";
      n.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
  }, m.prototype._ensureMethodInput = function() {
    let u = this.dom.querySelector('input[name="_method"]');
    return u || (u = document.createElement("input"), u.type = "hidden", u.name = "_method", u.value = "", this.dom.appendChild(u)), u;
  }, m.prototype._applyActionMode = function(u) {
    if (!this.dom.hasAttribute(E)) return;
    const a = u && u.id != null && u.id !== "" ? u.id : null, t = this._ensureMethodInput();
    if (a !== null) {
      const n = this.dom.getAttribute(E);
      n ? this.dom.setAttribute("action", n.replace(":id", encodeURIComponent(a))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(a)), t.value = this.dom.getAttribute(y) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), t.value = "";
  }, m.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("submit", this._onSubmit), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[d]);
  }, P(f, d, m, "ln-form");
})();
(function() {
  const f = "lnFill";
  if (window[f] !== void 0) return;
  const d = { lnFillForm: !0, lnFillStore: !0 };
  document.addEventListener("click", function(E) {
    if (E.ctrlKey || E.metaKey || E.button === 1) return;
    const y = E.target.closest("[data-ln-fill-form]");
    if (!y) return;
    const _ = y.getAttribute("data-ln-fill-form"), m = document.getElementById(_);
    if (!m) return;
    const u = {}, a = y.dataset;
    for (const n in a) {
      if (!n.startsWith("lnFill") || d[n]) continue;
      const i = n.slice(6);
      i && (u[i.charAt(0).toLowerCase() + i.slice(1)] = a[n]);
    }
    const t = Object.keys(u).length > 0;
    window.lnCore.lnFill(m, t ? u : null);
  }), window[f] = !0;
})();
(function() {
  const f = "lnModalFill";
  if (window[f] !== void 0) return;
  const d = { lnFillForm: !0, lnFillStore: !0 };
  function E(_) {
    const m = {}, u = _.dataset;
    for (const a in u) {
      if (!a.startsWith("lnFill") || d[a]) continue;
      const t = a.slice(6);
      t && (m[t.charAt(0).toLowerCase() + t.slice(1)] = u[a]);
    }
    return m;
  }
  function y(_, m) {
    const u = window.CSS && CSS.escape ? CSS.escape(m) : m, a = document.querySelectorAll('[data-ln-fill-id="' + u + '"]');
    if (a.length === 0) return null;
    for (let t = 0; t < a.length; t++) {
      const n = a[t].getAttribute("data-ln-fill-form");
      if (n) {
        const i = document.getElementById(n);
        if (i && _.contains(i)) return a[t];
      }
    }
    return a[0];
  }
  document.addEventListener("ln-modal:open", function(_) {
    const m = _.detail;
    if (!m || !("param" in m)) return;
    const u = m.target;
    if (!u) return;
    const a = m.param;
    if (a == null) {
      window.lnCore.lnFill(u, null);
      return;
    }
    const t = y(u, a);
    if (!t) return;
    const n = E(t);
    window.lnCore.lnFill(u, n);
  }), window[f] = !0;
})();
(function() {
  const f = "data-ln-slug-from", d = "lnSlug";
  if (window[d] !== void 0) return;
  function E(_) {
    return String(_).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function y(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const m = _.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    const u = _.getAttribute(f), a = m.elements[u];
    if (!a)
      return console.warn('[ln-slug] Source field "' + u + '" not found in form:', _), this;
    if (typeof a.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + u + '" is a RadioNodeList (same-name group) — single source field required:', _), this;
    this.dom = _, this.source = a, this._pristine = _.value === "", this._mirroring = !1;
    const t = this;
    return this._onSource = function() {
      t._pristine && t._mirror();
    }, this._onSlug = function() {
      t._mirroring || (t._pristine = t.dom.value === "");
    }, a.addEventListener("input", this._onSource), _.addEventListener("input", this._onSlug), this;
  }
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = E(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[d] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[d]);
  }, P(f, d, y, "ln-slug");
})();
(function() {
  const f = "data-ln-time", d = "lnTime";
  if (window[d] !== void 0) return;
  const E = {}, y = {};
  function _(b) {
    return b.getAttribute("data-ln-time-locale") || W(b);
  }
  function m(b, A) {
    const L = (b || "") + "|" + JSON.stringify(A);
    return E[L] || (E[L] = new Intl.DateTimeFormat(b, A)), E[L];
  }
  function u(b) {
    const A = b || "";
    return y[A] || (y[A] = new Intl.RelativeTimeFormat(b, { numeric: "auto", style: "narrow" })), y[A];
  }
  const a = /* @__PURE__ */ new Set();
  let t = null;
  function n() {
    t || (t = setInterval(r, 6e4));
  }
  function i() {
    t && (clearInterval(t), t = null);
  }
  function r() {
    for (const b of a) {
      if (!document.body.contains(b.dom)) {
        a.delete(b);
        continue;
      }
      c(b);
    }
    a.size === 0 && i();
  }
  function p(b, A) {
    const L = _t(A), k = (A || "").toLowerCase().split("-")[0], C = m(A, { dateStyle: "long", timeStyle: "short" }), x = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (L && x !== k && L.monthsLong) {
      const I = L.monthsLong[b.getMonth()], R = b.getDate(), B = b.getFullYear(), H = String(b.getHours()).padStart(2, "0"), K = String(b.getMinutes()).padStart(2, "0");
      return `${R} ${I} ${B} во ${H}:${K}`;
    }
    return C.format(b);
  }
  function l(b, A) {
    const L = /* @__PURE__ */ new Date(), k = { month: "short", day: "numeric" };
    b.getFullYear() !== L.getFullYear() && (k.year = "numeric");
    const C = _t(A), x = (A || "").toLowerCase().split("-")[0], I = m(A, k), R = I.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (C && R !== x && C.monthsShort) {
      const B = C.monthsShort[b.getMonth()], H = b.getDate(), K = b.getFullYear() !== L.getFullYear() ? " " + b.getFullYear() : "";
      return `${H} ${B}${K}`;
    }
    return I.format(b);
  }
  function s(b, A) {
    return m(A, { dateStyle: "medium" }).format(b);
  }
  function e(b, A) {
    return m(A, { timeStyle: "short" }).format(b);
  }
  function h(b, A) {
    const L = Math.floor(Date.now() / 1e3), C = Math.floor(b.getTime() / 1e3) - L, x = Math.abs(C);
    if (x < 10) return u(A).format(0, "second");
    let I, R;
    if (x < 60)
      I = "second", R = C;
    else if (x < 3600)
      I = "minute", R = Math.round(C / 60);
    else if (x < 86400)
      I = "hour", R = Math.round(C / 3600);
    else if (x < 604800)
      I = "day", R = Math.round(C / 86400);
    else if (x < 2592e3)
      I = "week", R = Math.round(C / 604800);
    else
      return l(b, A);
    return u(A).format(R, I);
  }
  function c(b) {
    const A = b.dom.getAttribute("datetime");
    if (!A) return;
    const L = Number(A);
    if (isNaN(L)) return;
    const k = new Date(L * 1e3), C = b.dom.getAttribute(f) || "short", x = _(b.dom);
    let I;
    switch (C) {
      case "relative":
        I = h(k, x);
        break;
      case "full":
        I = p(k, x);
        break;
      case "date":
        I = s(k, x);
        break;
      case "time":
        I = e(k, x);
        break;
      default:
        I = l(k, x);
        break;
    }
    b.dom.textContent = I, C !== "full" && (b.dom.title = p(k, x));
  }
  function o(b) {
    return this.dom = b, c(this), b.getAttribute(f) === "relative" && (a.add(this), n()), this;
  }
  o.prototype.render = function() {
    c(this);
  }, o.prototype.destroy = function() {
    a.delete(this), a.size === 0 && i(), delete this.dom[d];
  };
  function v(b) {
    const A = b[d];
    if (!A) return;
    b.getAttribute(f) === "relative" ? (a.add(A), n()) : (a.delete(A), a.size === 0 && i()), c(A);
  }
  function g(b) {
    b.nodeType === 1 && b.hasAttribute && b.hasAttribute(f) && b[d] && c(b[d]);
  }
  P(f, d, o, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: g
  });
})();
(function() {
  const f = "data-ln-data-store", d = "lnDataStore";
  if (window[d] !== void 0) return;
  const E = "ln_app_cache", y = "_meta", _ = "1.0";
  let m = null, u = null;
  const a = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (T) => {
        const D = Math.random() * 16 | 0;
        return (T === "x" ? D : D & 3 | 8).toString(16);
      });
    }
  }
  function n(w) {
    w && w.name === "QuotaExceededError" && S(document, "ln-store:quota-exceeded", { error: w });
  }
  function i() {
    const w = {};
    for (const T of document.querySelectorAll(`[${f}]`)) {
      const D = T.getAttribute(f);
      if (D) {
        const q = T.getAttribute("data-ln-data-store-indexes") || T.getAttribute("data-ln-store-indexes") || "";
        w[D] = {
          indexes: q.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return w;
  }
  function r() {
    return u || (u = new Promise((w) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), w(null);
      const T = i(), D = Object.keys(T), q = indexedDB.open(E);
      q.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), w(null);
      }, q.onsuccess = (O) => {
        const F = O.target.result, M = Array.from(F.objectStoreNames);
        if (!(!M.includes(y) || D.some((ft) => !M.includes(ft))))
          return p(F), m = F, w(F);
        const Z = F.version;
        F.close();
        const nt = indexedDB.open(E, Z + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), w(null);
        }, nt.onupgradeneeded = (ft) => {
          const ot = ft.target.result;
          ot.objectStoreNames.contains(y) || ot.createObjectStore(y, { keyPath: "key" });
          for (const Lt of D)
            if (!ot.objectStoreNames.contains(Lt)) {
              const le = ot.createObjectStore(Lt, { keyPath: "id" });
              for (const Nt of T[Lt].indexes)
                le.createIndex(Nt, Nt, { unique: !1 });
            }
        }, nt.onsuccess = (ft) => {
          const ot = ft.target.result;
          p(ot), m = ot, w(ot);
        };
      };
    }), u);
  }
  function p(w) {
    w.onversionchange = () => {
      w.close(), m = null, u = null;
    };
  }
  function l() {
    return m ? Promise.resolve(m) : (u = null, r());
  }
  async function s(w) {
    if (!pt() || !w) return w;
    const T = { ...w }, D = T.id, q = T._pending, O = await ge(T);
    return !O || !O.encrypted ? w : {
      id: D,
      _pending: q,
      encrypted: !0,
      iv: O.iv,
      data: O.data
    };
  }
  async function e(w) {
    return !w || !w.encrypted || !pt() ? w : be(w);
  }
  const h = (w, T) => l().then((D) => D ? D.transaction(w, T).objectStore(w) : null);
  function c(w) {
    return new Promise((T, D) => {
      w.onsuccess = () => T(w.result), w.onerror = () => {
        n(w.error), D(w.error);
      };
    });
  }
  const o = (w) => h(w, "readonly").then((T) => T ? c(T.getAll()) : []).then((T) => pt() ? Promise.all(T.map((D) => e(D))) : T), v = (w, T) => h(w, "readonly").then((D) => D ? c(D.get(T)) : null).then((D) => D ? e(D) : null), g = (w, T) => (pt() ? s(T) : Promise.resolve(T)).then((q) => h(w, "readwrite").then((O) => O ? c(O.put(q)) : null)), b = (w, T) => h(w, "readwrite").then((D) => D ? c(D.delete(T)) : null), A = (w) => h(w, "readwrite").then((T) => T ? c(T.clear()) : null), L = (w) => h(w, "readonly").then((T) => T ? c(T.count()) : 0), k = (w) => h(y, "readonly").then((T) => T ? c(T.get(w)) : null), C = (w, T) => h(y, "readwrite").then((D) => {
    if (D)
      return T.key = w, c(D.put(T));
  });
  function x(w) {
    this.dom = w, this._name = w.getAttribute(f);
    const T = w.getAttribute("data-ln-data-store-stale") || w.getAttribute("data-ln-store-stale"), D = parseInt(T, 10);
    this._staleThreshold = T === "never" || T === "-1" ? -1 : isNaN(D) ? 300 : D;
    const q = w.getAttribute("data-ln-data-store-search-fields") || w.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = q.split(",").map((O) => O.trim()).filter(Boolean), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, a[this._name] = this, I(this), Y(this), this;
  }
  function I(w) {
    w._handlers = {
      create: (T) => R(w, T.detail),
      update: (T) => B(w, T.detail),
      delete: (T) => H(w, T.detail),
      "bulk-delete": (T) => K(w, T.detail)
    };
    for (const [T, D] of Object.entries(w._handlers))
      w.dom.addEventListener(`ln-store:request-${T}`, D);
  }
  function R(w, { data: T = {} } = {}) {
    const D = `_temp_${t()}`, q = { ...T, id: D, _pending: !0 };
    g(w._name, q).then(() => {
      w.totalCount++, S(w.dom, "ln-store:created", { store: w._name, record: q, tempId: D }), S(w.dom, "ln-store:request-remote-create", { tempId: D, data: T });
    });
  }
  function B(w, { id: T, data: D = {}, expected_version: q } = {}) {
    v(w._name, T).then((O) => {
      if (!O) throw new Error(`Record not found: ${T}`);
      w._pendingSnapshots[T] = { ...O };
      const F = { ...O, ...D, _pending: !0 };
      return g(w._name, F).then(() => {
        S(w.dom, "ln-store:updated", { store: w._name, record: F, previous: w._pendingSnapshots[T] }), S(w.dom, "ln-store:request-remote-update", { id: T, data: D, expected_version: q });
      });
    }).catch((O) => console.error("[ln-data-store] Optimistic update failed:", O));
  }
  function H(w, { id: T } = {}) {
    v(w._name, T).then((D) => {
      if (D)
        return w._pendingSnapshots[T] = { ...D }, b(w._name, T).then(() => {
          w.totalCount--, S(w.dom, "ln-store:deleted", { store: w._name, id: T }), S(w.dom, "ln-store:request-remote-delete", { id: T });
        });
    }).catch((D) => console.error("[ln-data-store] Optimistic delete failed:", D));
  }
  function K(w, { ids: T = [] } = {}) {
    T.length && Promise.all(T.map((D) => v(w._name, D))).then((D) => {
      const q = D.filter(Boolean), O = q.map((F) => F.id);
      return w._pendingSnapshots[O.join(",")] = q, ut(w._name, O).then(() => {
        w.totalCount -= O.length, S(w.dom, "ln-store:deleted", { store: w._name, ids: O }), S(w.dom, "ln-store:request-remote-bulk-delete", { ids: O });
      });
    }).catch((D) => console.error("[ln-data-store] Optimistic bulk delete failed:", D));
  }
  function Y(w) {
    r().then(() => k(w._name)).then((T) => {
      T && T.schema_version === _ ? (w.lastSyncedAt = T.last_synced_at || null, w.totalCount = T.record_count || 0, w.totalCount > 0 && (w.isLoaded = !0, S(w.dom, "ln-store:ready", { store: w._name, count: w.totalCount, source: "cache" })), S(w.dom, "ln-store:initialized", { store: w._name, hasCache: w.totalCount > 0, lastSyncedAt: w.lastSyncedAt, count: w.totalCount })) : T && T.schema_version !== _ ? A(w._name).then(() => C(w._name, { schema_version: _, last_synced_at: null, record_count: 0 })).then(() => S(w.dom, "ln-store:initialized", { store: w._name, hasCache: !1, lastSyncedAt: null, count: 0 })) : S(w.dom, "ln-store:initialized", { store: w._name, hasCache: !1, lastSyncedAt: null, count: 0 });
    });
  }
  function tt(w) {
    w.isSyncing = !0, S(w.dom, "ln-store:request-remote-sync", { since: w.lastSyncedAt });
  }
  function Q(w, T) {
    return l().then((D) => D ? (pt() ? Promise.all(T.map((O) => s(O))) : Promise.resolve(T)).then((O) => new Promise((F, M) => {
      const j = D.transaction(w, "readwrite"), Z = j.objectStore(w);
      O.forEach((nt) => Z.put(nt)), j.oncomplete = () => F(), j.onerror = () => {
        n(j.error), M(j.error);
      };
    })) : void 0);
  }
  function ut(w, T) {
    return l().then((D) => {
      if (D)
        return new Promise((q, O) => {
          const F = D.transaction(w, "readwrite"), M = F.objectStore(w);
          T.forEach((j) => M.delete(j)), F.oncomplete = () => q(), F.onerror = () => O(F.error);
        });
    });
  }
  const yt = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function N(w, T) {
    if (!T || !T.field) return w;
    const { field: D, direction: q } = T, O = q === "desc";
    return [...w].sort((F, M) => {
      const j = F[D], Z = M[D];
      if (j == null && Z == null) return 0;
      if (j == null) return O ? 1 : -1;
      if (Z == null) return O ? -1 : 1;
      const nt = typeof j == "string" && typeof Z == "string" ? yt.compare(j, Z) : j < Z ? -1 : j > Z ? 1 : 0;
      return O ? -nt : nt;
    });
  }
  function U(w, T) {
    if (!T) return w;
    const D = Object.keys(T).filter((q) => Array.isArray(T[q]) && T[q].length > 0);
    return D.length ? w.filter(
      (q) => D.every((O) => T[O].map(String).includes(String(q[O])))
    ) : w;
  }
  function z(w, T, D) {
    if (!T || !D || !D.length) return w;
    const q = T.toLowerCase();
    return w.filter(
      (O) => D.some((F) => {
        const M = O[F];
        return M != null && String(M).toLowerCase().includes(q);
      })
    );
  }
  function ht(w, T, D) {
    if (!w.length) return 0;
    if (D === "count") return w.length;
    const q = w.map((F) => parseFloat(F[T])).filter((F) => !isNaN(F)), O = q.reduce((F, M) => F + M, 0);
    return D === "sum" ? O : D === "avg" && q.length ? O / q.length : 0;
  }
  function et(w, T) {
    if (!w.presenters || !w.presenters.computed) return T;
    const D = w.presenters.computed;
    return T.map((q) => {
      const O = { ...q };
      for (const [F, M] of Object.entries(D))
        try {
          O[F] = M(q);
        } catch (j) {
          console.error(`[ln-data-store] Decorator computed field failed for ${F}`, j);
        }
      return O;
    });
  }
  x.prototype.getAll = function(w = {}) {
    const T = this;
    return o(T._name).then((D) => {
      const q = D.length;
      w.filters && (D = U(D, w.filters)), w.search && (D = z(D, w.search, T._searchFields));
      const O = D.length;
      if (w.sort && (D = N(D, w.sort)), w.offset || w.limit) {
        const F = w.offset || 0, M = w.limit || D.length;
        D = D.slice(F, F + M);
      }
      return {
        data: et(T, D),
        total: q,
        filtered: O
      };
    });
  }, x.prototype.getById = function(w) {
    return v(this._name, w).then((T) => T ? et(this, [T])[0] : null);
  }, x.prototype.count = function(w) {
    return w ? o(this._name).then((T) => U(T, w).length) : L(this._name);
  }, x.prototype.aggregate = function(w, T) {
    return o(this._name).then((D) => ht(D, w, T));
  }, x.prototype.setPresenters = function(w) {
    this.presenters = w;
  }, x.prototype.applySync = function(w, T, D) {
    const q = this, O = w.length > 0 || T.length > 0;
    let F = Promise.resolve();
    return w.length > 0 && (F = F.then(() => Q(q._name, w))), T.length > 0 && (F = F.then(() => ut(q._name, T))), F.then(() => L(q._name)).then((M) => (q.totalCount = M, C(q._name, {
      schema_version: _,
      last_synced_at: D,
      record_count: M
    }))).then(() => {
      const M = !q.isLoaded;
      q.isLoaded = !0, q.isSyncing = !1, q.lastSyncedAt = D, M ? (S(q.dom, "ln-store:loaded", { store: q._name, count: q.totalCount }), S(q.dom, "ln-store:ready", { store: q._name, count: q.totalCount, source: "server" })) : S(q.dom, "ln-store:synced", {
        store: q._name,
        added: w.length,
        deleted: T.length,
        changed: O
      });
    }).catch((M) => {
      q.isSyncing = !1, console.error("[ln-data-store] applySync failed:", M);
    });
  }, x.prototype.confirmMutation = function(w, T, D) {
    const q = this, O = {
      create: () => b(q._name, w).then(() => g(q._name, T)).then(() => {
        delete q._pendingSnapshots[w], S(q.dom, "ln-store:confirmed", { store: q._name, record: T, tempId: w, action: "create" });
      }),
      update: () => g(q._name, T).then(() => {
        delete q._pendingSnapshots[w], S(q.dom, "ln-store:confirmed", { store: q._name, record: T, action: "update" });
      }),
      delete: () => (delete q._pendingSnapshots[w], S(q.dom, "ln-store:confirmed", { store: q._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete q._pendingSnapshots[w], S(q.dom, "ln-store:confirmed", { store: q._name, record: null, ids: w.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return O[D] ? O[D]() : Promise.resolve();
  }, x.prototype.revertMutation = function(w, T, D) {
    const q = this, O = D || `Server rejected ${T}`, F = {
      create: () => b(q._name, w).then(() => {
        q.totalCount--, delete q._pendingSnapshots[w], S(q.dom, "ln-store:reverted", { store: q._name, record: null, action: "create", error: O });
      }),
      update: () => {
        const M = q._pendingSnapshots[w];
        return M ? g(q._name, M).then(() => {
          delete q._pendingSnapshots[w], S(q.dom, "ln-store:reverted", { store: q._name, record: M, action: "update", error: O });
        }) : Promise.resolve();
      },
      delete: () => {
        const M = q._pendingSnapshots[w];
        return M ? g(q._name, M).then(() => {
          q.totalCount++, delete q._pendingSnapshots[w], S(q.dom, "ln-store:reverted", { store: q._name, record: M, action: "delete", error: O });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const M = q._pendingSnapshots[w];
        return !M || !M.length ? Promise.resolve() : Q(q._name, M).then(() => {
          q.totalCount += M.length, delete q._pendingSnapshots[w], S(q.dom, "ln-store:reverted", { store: q._name, record: null, ids: w.split(","), action: "bulk-delete", error: O });
        });
      }
    };
    return F[T] ? F[T]() : Promise.resolve();
  }, x.prototype.resolveConflict = function(w, T, D) {
    const q = this._pendingSnapshots[w];
    return q ? g(this._name, q).then(() => {
      delete this._pendingSnapshots[w], S(this.dom, "ln-store:conflict", {
        store: this._name,
        local: q,
        remote: T,
        field_diffs: D || null
      });
    }) : Promise.resolve();
  }, x.prototype.forceSync = function() {
    tt(this);
  }, x.prototype.fullReload = function() {
    const w = this;
    return A(w._name).then(() => {
      w.isLoaded = !1, w.lastSyncedAt = null, w.totalCount = 0, tt(w);
    });
  }, x.prototype.destroy = function() {
    if (this._handlers) {
      for (const [w, T] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${w}`, T);
      this._handlers = null;
    }
    delete a[this._name], delete this.dom[d], S(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function X() {
    return l().then((w) => {
      if (!w) return;
      const T = Array.from(w.objectStoreNames);
      return new Promise((D, q) => {
        const O = w.transaction(T, "readwrite");
        T.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => D(), O.onerror = () => q(O.error);
      });
    }).then(() => {
      Object.values(a).forEach((w) => {
        w.isLoaded = !1, w.isSyncing = !1, w.lastSyncedAt = null, w.totalCount = 0;
      });
    });
  }
  P(f, d, x, "ln-data-store"), window[d].clearAll = X, window[d].init = window[d], window[d].setStorageKey = Bt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Bt);
})();
(function() {
  const f = "data-ln-api-connector", d = "lnApiConnector", E = "lnConnector";
  if (window[d] !== void 0) return;
  function y(a) {
    return a.ok ? a.status === 204 ? null : a.json() : a.json().catch(() => null).then((t) => {
      const n = new Error("HTTP " + a.status + ": " + a.statusText);
      throw n.status = a.status, n.data = t, n;
    });
  }
  function _(a) {
    return this.dom = a, a[d] = this, a[E] = this, this.refreshConfig(), this._handlers = null, m(this), this;
  }
  _.prototype.refreshConfig = function() {
    const a = this.dom;
    this.baseUrl = a.getAttribute("data-ln-api-base-url") || "", this.path = a.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const t = a.getAttribute("data-ln-api-headers") || "";
    this.headers = Gt(t, "ln-api-connector"), (t.toLowerCase().includes("authorization") || t.toLowerCase().includes("bearer") || t.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(a, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, _.prototype._reqHeaders = function() {
    return Object.assign({}, it(this.headers), { "X-LN-Response": "data" });
  }, _.prototype.fetchDelta = function(a) {
    const t = this;
    let n = $(t.baseUrl, t.path);
    return a != null && a !== "" && (n += (n.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(a)), window.fetch(n, { method: "GET", headers: t._reqHeaders(), credentials: t.credentials }).then(y);
  }, _.prototype.create = function(a, t) {
    const n = this;
    return window.fetch($(n.baseUrl, t || n.path), {
      method: "POST",
      headers: n._reqHeaders(),
      credentials: n.credentials,
      body: JSON.stringify(a)
    }).then(y);
  }, _.prototype.update = function(a, t, n, i) {
    const r = this;
    return n != null && (t = Object.assign({}, t, { expected_version: n })), window.fetch($(r.baseUrl, i || r.path, a), {
      method: "PUT",
      headers: r._reqHeaders(),
      credentials: r.credentials,
      body: JSON.stringify(t)
    }).then(y);
  }, _.prototype.delete = function(a, t) {
    const n = this;
    return window.fetch($(n.baseUrl, t || n.path, a), {
      method: "DELETE",
      headers: n._reqHeaders(),
      credentials: n.credentials
    }).then(y);
  }, _.prototype.bulkDelete = function(a, t) {
    const n = this;
    return window.fetch($(n.baseUrl, t || n.path) + "/bulk-delete", {
      method: "DELETE",
      headers: n._reqHeaders(),
      credentials: n.credentials,
      body: JSON.stringify({ ids: a })
    }).then(y);
  };
  function m(a) {
    a._handlers = {
      sync: function(n) {
        const i = n.detail || {};
        a.fetchDelta(i.since).then(function(r) {
          S(a.dom, "ln-api-connector:fetched", { data: r, since: i.since, meta: i.meta || null });
        }).catch(function(r) {
          S(a.dom, "ln-api-connector:error", {
            action: "sync",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            since: i.since,
            meta: i.meta || null
          });
        });
      },
      create: function(n) {
        const i = n.detail || {};
        a.create(i.data, i.url).then(function(r) {
          S(a.dom, "ln-api-connector:created", { record: r, tempId: i.tempId, meta: i.meta || null });
        }).catch(function(r) {
          S(a.dom, "ln-api-connector:error", {
            action: "create",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            tempId: i.tempId,
            meta: i.meta || null
          });
        });
      },
      update: function(n) {
        const i = n.detail || {};
        a.update(i.id, i.data, i.expected_version, i.url).then(function(r) {
          S(a.dom, "ln-api-connector:updated", { record: r, id: i.id, meta: i.meta || null });
        }).catch(function(r) {
          S(a.dom, "ln-api-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            id: i.id,
            conflictData: r.status === 409 ? r.data : null,
            meta: i.meta || null
          });
        });
      },
      delete: function(n) {
        const i = n.detail || {};
        a.delete(i.id, i.url).then(function(r) {
          S(a.dom, "ln-api-connector:deleted", { response: r, id: i.id, meta: i.meta || null });
        }).catch(function(r) {
          S(a.dom, "ln-api-connector:error", {
            action: "delete",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            id: i.id,
            meta: i.meta || null
          });
        });
      },
      bulkDelete: function(n) {
        const i = n.detail || {};
        a.bulkDelete(i.ids, i.url).then(function(r) {
          S(a.dom, "ln-api-connector:bulk-deleted", { response: r, ids: i.ids, meta: i.meta || null });
        }).catch(function(r) {
          S(a.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            ids: i.ids,
            meta: i.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(n) {
      a.dom.addEventListener(n + ":request-sync", a._handlers.sync), a.dom.addEventListener(n + ":request-fetch", a._handlers.sync), a.dom.addEventListener(n + ":request-create", a._handlers.create), a.dom.addEventListener(n + ":request-update", a._handlers.update), a.dom.addEventListener(n + ":request-delete", a._handlers.delete), a.dom.addEventListener(n + ":request-bulk-delete", a._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const a = this;
    a._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(n) {
      a.dom.removeEventListener(n + ":request-sync", a._handlers.sync), a.dom.removeEventListener(n + ":request-fetch", a._handlers.sync), a.dom.removeEventListener(n + ":request-create", a._handlers.create), a.dom.removeEventListener(n + ":request-update", a._handlers.update), a.dom.removeEventListener(n + ":request-delete", a._handlers.delete), a.dom.removeEventListener(n + ":request-bulk-delete", a._handlers.bulkDelete);
    }), a._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[E];
  };
  function u(a) {
    const t = a[d];
    t && t.refreshConfig();
  }
  P(f, d, _, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: u
  });
})();
(function() {
  const f = "data-ln-couchdb-connector", d = "lnCouchDbConnector", E = "lnConnector";
  if (window[d] !== void 0) return;
  function y(u) {
    return this.dom = u, u[d] = this, u[E] = this, this.refreshConfig(), this._handlers = null, _(this), this;
  }
  y.prototype.refreshConfig = function() {
    const u = this.dom;
    this.url = u.getAttribute("data-ln-couchdb-url") || "", this.db = u.getAttribute("data-ln-couchdb-db") || "", this.auth = u.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const a = u.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Gt(a, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), a.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(u, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, y.prototype.fetchDelta = function(u) {
    const a = this, t = ["include_docs=true", "feed=normal"];
    u && t.push("since=" + encodeURIComponent(u));
    const n = $(a.url, a.db, "_changes") + "?" + t.join("&");
    return window.fetch(n, { method: "GET", headers: it(a.headers, a.auth), credentials: a.credentials }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => {
      const r = i.results || [];
      return {
        data: r.filter((p) => !p.deleted && p.doc).map((p) => Object.assign({}, p.doc, { id: p.doc._id })),
        deleted: r.filter((p) => p.deleted).map((p) => p.id),
        synced_at: i.last_seq || u || ""
      };
    });
  }, y.prototype.create = function(u) {
    const a = this, t = Object.assign({ _id: u.id }, u);
    return t._id || delete t._id, window.fetch($(a.url, a.db), {
      method: "POST",
      headers: it(a.headers, a.auth),
      credentials: a.credentials,
      body: JSON.stringify(t)
    }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    }).then((n) => Object.assign({}, t, { id: n.id, _id: n.id, _rev: n.rev }));
  }, y.prototype.update = function(u, a) {
    const t = this, n = Object.assign({ id: String(u), _id: String(u) }, a), i = n._rev || n.rev;
    return (i ? Promise.resolve(i) : window.fetch($(t.url, t.db, null, u), { method: "GET", headers: it(t.headers, t.auth), credentials: t.credentials }).then((p) => {
      if (!p.ok) throw new Error("Could not retrieve document for revision mapping");
      return p.json().then((l) => l._rev);
    })).then((p) => {
      const l = Object.assign({}, n, { _rev: p });
      delete l.rev;
      const s = Object.assign(it(t.headers, t.auth), { "If-Match": p });
      return window.fetch($(t.url, t.db, null, u), {
        method: "PUT",
        headers: s,
        credentials: t.credentials,
        body: JSON.stringify(l)
      }).then((e) => {
        if (e.ok) return e.json().then((h) => Object.assign({}, l, { _rev: h.rev }));
        if (e.status === 409) return e.json().then((h) => {
          const c = new Error("Conflict");
          throw c.status = 409, c.data = h, c;
        });
        throw new Error("HTTP " + e.status + ": " + e.statusText);
      });
    });
  }, y.prototype.delete = function(u, a) {
    const t = this;
    return (a ? Promise.resolve(a) : window.fetch($(t.url, t.db, null, u), { method: "GET", headers: it(t.headers, t.auth), credentials: t.credentials }).then((i) => {
      if (!i.ok) throw new Error("Could not retrieve document for revision delete");
      return i.json().then((r) => r._rev);
    })).then((i) => {
      const r = $(t.url, t.db, null, u) + "?rev=" + encodeURIComponent(i);
      return window.fetch(r, { method: "DELETE", headers: it(t.headers, t.auth), credentials: t.credentials }).then((p) => {
        if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
        return p.json();
      });
    });
  }, y.prototype.bulkDelete = function(u) {
    const a = this;
    return !u || u.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch($(a.url, a.db, "_all_docs"), {
      method: "POST",
      headers: it(a.headers, a.auth),
      credentials: a.credentials,
      body: JSON.stringify({ keys: u })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const i = (t.rows || []).filter((r) => !r.error && r.value && r.value.rev).map((r) => ({ _id: r.id, _rev: r.value.rev, _deleted: !0 }));
      return i.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch($(a.url, a.db, "_bulk_docs"), {
        method: "POST",
        headers: it(a.headers, a.auth),
        credentials: a.credentials,
        body: JSON.stringify({ docs: i })
      }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
        return r.json();
      }).then((r) => ({ ok: !0, results: r, deletedCount: i.length }));
    });
  };
  function _(u) {
    u._handlers = {
      sync: function(t) {
        const n = t.detail || {};
        u.fetchDelta(n.since).then(function(i) {
          S(u.dom, "ln-couchdb-connector:fetched", { data: i, since: n.since });
        }).catch(function(i) {
          S(u.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: i.message,
            status: i.status || 0,
            since: n.since
          });
        });
      },
      create: function(t) {
        const n = t.detail || {};
        u.create(n.data).then(function(i) {
          S(u.dom, "ln-couchdb-connector:created", { record: i, tempId: n.tempId });
        }).catch(function(i) {
          S(u.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: i.message,
            status: i.status || 0,
            tempId: n.tempId
          });
        });
      },
      update: function(t) {
        const n = t.detail || {}, i = Object.assign({}, n.data);
        n.expected_version !== void 0 && (i._rev = n.expected_version), u.update(n.id, i).then(function(r) {
          S(u.dom, "ln-couchdb-connector:updated", { record: r, id: n.id });
        }).catch(function(r) {
          S(u.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            id: n.id,
            conflictData: r.status === 409 ? r.data : null
          });
        });
      },
      delete: function(t) {
        const n = t.detail || {};
        u.delete(n.id, n.rev).then(function(i) {
          S(u.dom, "ln-couchdb-connector:deleted", { response: i, id: n.id });
        }).catch(function(i) {
          S(u.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: i.message,
            status: i.status || 0,
            id: n.id
          });
        });
      },
      bulkDelete: function(t) {
        const n = t.detail || {};
        u.bulkDelete(n.ids).then(function(i) {
          S(u.dom, "ln-couchdb-connector:bulk-deleted", { response: i, ids: n.ids });
        }).catch(function(i) {
          S(u.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: i.message,
            status: i.status || 0,
            ids: n.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      u.dom.addEventListener(t + ":request-sync", u._handlers.sync), u.dom.addEventListener(t + ":request-fetch", u._handlers.sync), u.dom.addEventListener(t + ":request-create", u._handlers.create), u.dom.addEventListener(t + ":request-update", u._handlers.update), u.dom.addEventListener(t + ":request-delete", u._handlers.delete), u.dom.addEventListener(t + ":request-bulk-delete", u._handlers.bulkDelete);
    });
  }
  y.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const u = this;
    u._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      u.dom.removeEventListener(t + ":request-sync", u._handlers.sync), u.dom.removeEventListener(t + ":request-fetch", u._handlers.sync), u.dom.removeEventListener(t + ":request-create", u._handlers.create), u.dom.removeEventListener(t + ":request-update", u._handlers.update), u.dom.removeEventListener(t + ":request-delete", u._handlers.delete), u.dom.removeEventListener(t + ":request-bulk-delete", u._handlers.bulkDelete);
    }), u._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[E];
  };
  function m(u) {
    const a = u[d];
    a && a.refreshConfig();
  }
  P(f, d, y, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: m
  });
})();
(function() {
  const f = "data-ln-data-coordinator", d = "lnDataCoordinator", E = "lnCoordinator";
  if (window[d] !== void 0) return;
  const y = /* @__PURE__ */ new Set();
  let _ = !1, m = null, u = null, a = null;
  function t() {
    _ || (_ = !0, m = function() {
      S(document, "ln-store:online", {}), y.forEach(function(e) {
        e._maybeSync();
      });
    }, u = function() {
      S(document, "ln-store:offline", {});
    }, a = function() {
      document.visibilityState === "visible" && y.forEach(function(e) {
        const c = e.findChildren().store;
        c && c.isLoaded && !c.isSyncing && !e._noAutosync && e._isStale() && c.forceSync();
      });
    }, window.addEventListener("online", m), window.addEventListener("offline", u), document.addEventListener("visibilitychange", a));
  }
  function n() {
    _ && (y.size > 0 || (window.removeEventListener("online", m), window.removeEventListener("offline", u), document.removeEventListener("visibilitychange", a), m = null, u = null, a = null, _ = !1));
  }
  function i() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (h) => {
        const c = Math.random() * 16 | 0;
        return (h === "x" ? c : c & 3 | 8).toString(16);
      });
    }
  }
  const r = ["ln-api-connector", "ln-couchdb-connector"];
  function p(e) {
    return this.dom = e, this._name = e.getAttribute(f), e[d] = this, e[E] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._pendingFormAction = /* @__PURE__ */ new WeakMap(), this._pendingActionById = /* @__PURE__ */ new Map(), this._parseStaleAttributes(), this.refreshMapper(), l(this), y.add(this), t(), this._checkInitialSync(), this;
  }
  p.prototype._parseStaleAttributes = function() {
    const h = this.findChildren().storeEl, c = this.dom.getAttribute("data-ln-data-coordinator-stale") || (h ? h.getAttribute("data-ln-data-store-stale") || h.getAttribute("data-ln-store-stale") : null), o = parseInt(c, 10);
    this._staleThreshold = c === "never" || c === "-1" ? -1 : isNaN(o) ? 300 : o;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (h ? h.hasAttribute("data-ln-data-store-no-autosync") || h.hasAttribute("data-ln-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, p.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const h = this.findChildren().store;
    return !h || !h.lastSyncedAt ? !0 : Date.now() / 1e3 - h.lastSyncedAt > this._staleThreshold;
  }, p.prototype._maybeSync = function() {
    const h = this.findChildren().store;
    !h || this._noAutosync || h.isLoaded && !h.isSyncing && h.forceSync();
  }, p.prototype._checkInitialSync = function() {
    const h = this.findChildren().store;
    !h || !h.isLoaded || this._noAutosync || (h.totalCount === 0 || this._isStale()) && h.forceSync();
  }, p.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const h = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    h && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(h)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(c) {
      return c;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(c) {
      return c;
    });
  }, p.prototype.findChildren = function() {
    const e = this.dom.querySelector("[data-ln-data-store]"), h = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), c = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: e,
      connectorEl: h,
      queueEl: c,
      store: e ? e.lnDataStore || e.lnStore : null,
      connector: h ? h.lnConnector || h.lnApiConnector || h.lnCouchDbConnector : null,
      queue: c ? c.lnApiQueue : null
    };
  }, p.prototype._handleSubmitRecord = function(e) {
    const h = this.findChildren();
    if (!h.storeEl) {
      console.warn('[ln-data-coordinator] ln-form:submit-record claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const c = e.data || {}, o = c.id, v = c.expected_version, g = Object.assign({}, c);
    delete g.id, delete g.expected_version;
    const b = e.method.toUpperCase();
    b === "POST" ? (this._pendingFormAction.set(g, e.action), S(h.storeEl, "ln-store:request-create", { data: g })) : (b === "PUT" || b === "PATCH") && (this._pendingActionById.set(o, e.action), S(h.storeEl, "ln-store:request-update", { id: o, data: g, expected_version: v }));
  };
  function l(e) {
    e._handlers = {
      sync: function(h) {
        e.refreshMapper();
        const c = e.findChildren();
        if (!c.store || !c.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        S(c.connectorEl, "ln-api-connector:request-sync", { since: h.detail.since, meta: { op: "sync" } });
      },
      create: function(h) {
        e.refreshMapper();
        const c = e.findChildren();
        if (!c.store || !c.connector) return;
        const o = h.detail.tempId, v = h.detail.data || {}, g = e._pendingFormAction.get(v) || null;
        e._pendingFormAction.delete(v);
        const b = e.mapper.egress(v);
        c.queue ? S(c.queueEl, "ln-api-queue:request-enqueue", {
          chainKey: o,
          op: "create",
          targetId: null,
          payload: b,
          expectedVersion: null,
          meta: { tempId: o, action: g }
        }) : S(c.connectorEl, "ln-api-connector:request-create", {
          data: b,
          url: g,
          meta: { entryId: i(), queued: !1, op: "create", tempId: o }
        });
      },
      update: function(h) {
        e.refreshMapper();
        const c = e.findChildren();
        if (!c.store || !c.connector) return;
        const o = h.detail.id, v = h.detail.expected_version, g = e._pendingActionById.get(o) || null;
        e._pendingActionById.delete(o), c.store.getById(o).then(function(b) {
          if (!b) {
            if (!c.queue) throw new Error("Record not found in cache store: " + o);
            return;
          }
          const A = Object.assign({}, b);
          delete A._pending;
          const L = e.mapper.egress(A);
          c.queue ? S(c.queueEl, "ln-api-queue:request-enqueue", {
            chainKey: o,
            op: "update",
            targetId: o,
            payload: L,
            expectedVersion: v,
            meta: { id: o, action: g }
          }) : S(c.connectorEl, "ln-api-connector:request-update", {
            id: o,
            data: L,
            expected_version: v,
            url: g,
            meta: { entryId: i(), queued: !1, op: "update", id: o }
          });
        }).catch(function(b) {
          console.error("[ln-data-coordinator] Update mutation failed:", b), c.queue || c.store.revertMutation(o, "update", b.message || b);
        });
      },
      delete: function(h) {
        e.refreshMapper();
        const c = e.findChildren();
        if (!c.store || !c.connector) return;
        const o = h.detail.id;
        c.queue ? S(c.queueEl, "ln-api-queue:request-enqueue", {
          chainKey: o,
          op: "delete",
          targetId: o,
          payload: null,
          expectedVersion: null,
          meta: { id: o }
        }) : S(c.connectorEl, "ln-api-connector:request-delete", {
          id: o,
          meta: { entryId: i(), queued: !1, op: "delete", id: o }
        });
      },
      bulkDelete: function(h) {
        e.refreshMapper();
        const c = e.findChildren();
        if (!c.store || !c.connector) return;
        const o = h.detail.ids || [], v = o.join(",");
        c.queue ? S(c.queueEl, "ln-api-queue:request-enqueue", {
          chainKey: v,
          op: "bulk-delete",
          targetId: null,
          payload: { ids: o },
          expectedVersion: null,
          meta: { bulkKey: v, ids: o }
        }) : S(c.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: o,
          meta: { entryId: i(), queued: !1, op: "bulk-delete", bulkKey: v }
        });
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(h) {
        e.refreshMapper();
        const c = e.findChildren();
        if (!c.store || !c.connector || !c.queue) return;
        const o = h.detail || {}, v = o.entryId, g = o.op, b = o.targetId, A = o.payload, L = o.expectedVersion, k = o.meta || {}, C = k.action || null;
        g === "create" ? S(c.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: C,
          meta: { entryId: v, queued: !0, op: "create", tempId: k.tempId }
        }) : g === "update" ? S(c.connectorEl, "ln-api-connector:request-update", {
          id: b,
          data: A,
          expected_version: L,
          url: C,
          meta: { entryId: v, queued: !0, op: "update", id: k.id !== void 0 ? k.id : b }
        }) : g === "delete" ? S(c.connectorEl, "ln-api-connector:request-delete", {
          id: b,
          meta: { entryId: v, queued: !0, op: "delete", id: k.id !== void 0 ? k.id : b }
        }) : g === "bulk-delete" ? S(c.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: k.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", g);
      },
      // ─── Form Write Intake ─────────────────────────────────
      formSubmitRecord: function(h) {
        const c = h.detail;
        if (!c || c.claimed || !c.form) return;
        let o;
        c.scope ? o = c.scope === e._name : o = c.form.closest("[data-ln-data-coordinator]") === e.dom, o && (c.claimed = !0, e._handleSubmitRecord(c));
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(h) {
        const c = e.findChildren();
        if (!c.store) return;
        const o = h.detail.data;
        let v = [], g = [], b = null;
        o && Array.isArray(o) ? (v = o, b = Math.floor(Date.now() / 1e3)) : o && (v = Array.isArray(o.data) ? o.data : [], g = Array.isArray(o.deleted) ? o.deleted : [], b = o.synced_at !== void 0 ? o.synced_at : o.since !== void 0 ? o.since : null);
        const A = v.map((L) => e.mapper.ingress(L));
        c.store.applySync(A, g, b);
      },
      connCreated: function(h) {
        const c = e.findChildren();
        if (!c.store) return;
        const o = h.detail.meta || {}, v = e.mapper.ingress(h.detail.record);
        c.store.confirmMutation(o.tempId, v, "create"), o.queued && c.queue && (S(c.queueEl, "ln-api-queue:request-remap", { oldKey: o.tempId, newId: v.id }), S(c.queueEl, "ln-api-queue:ack", { entryId: o.entryId }));
      },
      connUpdated: function(h) {
        const c = e.findChildren();
        if (!c.store) return;
        const o = h.detail.meta || {}, v = e.mapper.ingress(h.detail.record);
        c.store.confirmMutation(o.id, v, "update"), o.queued && c.queue && S(c.queueEl, "ln-api-queue:ack", { entryId: o.entryId });
      },
      connDeleted: function(h) {
        const c = e.findChildren();
        if (!c.store) return;
        const o = h.detail.meta || {};
        c.store.confirmMutation(o.id, null, "delete"), o.queued && c.queue && S(c.queueEl, "ln-api-queue:ack", { entryId: o.entryId });
      },
      connBulkDeleted: function(h) {
        const c = e.findChildren();
        if (!c.store) return;
        const o = h.detail.meta || {};
        c.store.confirmMutation(o.bulkKey, null, "bulk-delete"), o.queued && c.queue && S(c.queueEl, "ln-api-queue:ack", { entryId: o.entryId });
      },
      connError: function(h) {
        const c = h.detail || {}, o = c.meta || {}, v = o.op || c.action;
        if (v === "sync") {
          console.error("[ln-data-coordinator] Sync failed:", c.error);
          return;
        }
        const g = e.findChildren();
        if (g.store) {
          if (!o.queued) {
            if (console.error("[ln-data-coordinator] " + v + " mutation failed:", c.error), v === "update" && c.status === 409) {
              const b = c.data && c.data.remote ? e.mapper.ingress(c.data.remote) : null, A = c.data ? c.data.field_diffs : null;
              g.store.resolveConflict(o.id, b, A);
            } else {
              const b = v === "create" ? o.tempId : v === "bulk-delete" ? o.bulkKey : o.id;
              g.store.revertMutation(b, v, c.error);
            }
            return;
          }
          if (g.queue) {
            if (c.status === 401 || c.status === 419) {
              S(g.queueEl, "ln-api-queue:nack", { entryId: o.entryId, reason: "auth" });
              return;
            }
            if (c.status === 409 && v === "update") {
              const b = c.data && c.data.remote ? e.mapper.ingress(c.data.remote) : null, A = c.data ? c.data.field_diffs : null;
              g.store.resolveConflict(o.id, b, A), S(g.queueEl, "ln-api-queue:nack", { entryId: o.entryId, reason: "drop" });
              return;
            }
            if (c.status >= 400 && c.status < 500) {
              const b = o.id !== void 0 ? o.id : o.tempId !== void 0 ? o.tempId : o.bulkKey;
              S(e.dom, "ln-store:sync-conflict", { store: g.store._name, action: v, id: b, data: c.data }), g.store.revertMutation(b, v, c.error), S(g.queueEl, "ln-api-queue:nack", { entryId: o.entryId, reason: "drop" }), g.store.forceSync();
              return;
            }
            S(g.queueEl, "ln-api-queue:nack", { entryId: o.entryId, reason: "retry" });
          }
        }
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(h) {
        const o = e.findChildren().store;
        if (!o || e._noAutosync) return;
        (h.detail || {}).hasCache ? e._isStale() && o.forceSync() : o.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(h) {
        e._serveData(h, "table");
      },
      reqListData: function(h) {
        e._serveData(h, "list");
      },
      reqOptions: function(h) {
        e._serveOptions(h);
      },
      reqStat: function(h) {
        e._serveStat(h);
      },
      refresh: function() {
        e._refreshAll();
      },
      refreshSynced: function(h) {
        h.detail && h.detail.changed && e._refreshAll();
      }
    }, e.dom.addEventListener("ln-store:request-remote-sync", e._handlers.sync), e.dom.addEventListener("ln-store:request-remote-create", e._handlers.create), e.dom.addEventListener("ln-store:request-remote-update", e._handlers.update), e.dom.addEventListener("ln-store:request-remote-delete", e._handlers.delete), e.dom.addEventListener("ln-store:request-remote-bulk-delete", e._handlers.bulkDelete), e.dom.addEventListener("ln-api-queue:send", e._handlers.queueSend), e.dom.addEventListener("ln-store:initialized", e._handlers.storeInitialized), document.addEventListener("ln-form:submit-record", e._handlers.formSubmitRecord), r.forEach(function(h) {
      e.dom.addEventListener(h + ":fetched", e._handlers.connFetched), e.dom.addEventListener(h + ":created", e._handlers.connCreated), e.dom.addEventListener(h + ":updated", e._handlers.connUpdated), e.dom.addEventListener(h + ":deleted", e._handlers.connDeleted), e.dom.addEventListener(h + ":bulk-deleted", e._handlers.connBulkDeleted), e.dom.addEventListener(h + ":error", e._handlers.connError);
    }), document.addEventListener("ln-table:request-data", e._handlers.reqTableData), document.addEventListener("ln-list:request-data", e._handlers.reqListData), document.addEventListener("ln-options:request-data", e._handlers.reqOptions), document.addEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.addEventListener("ln-store:ready", e._handlers.refresh), e.dom.addEventListener("ln-store:loaded", e._handlers.refresh), e.dom.addEventListener("ln-store:created", e._handlers.refresh), e.dom.addEventListener("ln-store:updated", e._handlers.refresh), e.dom.addEventListener("ln-store:deleted", e._handlers.refresh), e.dom.addEventListener("ln-store:synced", e._handlers.refreshSynced);
  }
  p.prototype._ownsStore = function(e) {
    const h = this.findChildren();
    return !!(h.store && h.store._name === e && e);
  }, p.prototype._serveData = function(e, h) {
    const c = e.target, o = h === "table" ? "data-ln-table-store" : "data-ln-list-store", v = c.getAttribute(o);
    if (!v || !this._ownsStore(v)) return;
    this._boundQueries.set(c, {
      sort: e.detail.sort,
      filters: e.detail.filters,
      search: e.detail.search
    });
    const g = this.findChildren().store;
    if (!g.isLoaded) {
      S(c, "ln-" + h + ":set-loading", { loading: !0 });
      return;
    }
    const b = this, A = { sort: e.detail.sort, filters: e.detail.filters, search: e.detail.search };
    g.getAll(A).then(function(L) {
      const k = { data: L.data, total: L.total, filtered: L.filtered };
      S(c, "ln-" + h + ":set-data", k), b._boundDelivered.set(c, !0);
    });
  }, p.prototype._serveOptions = function(e) {
    const h = e.target, c = h.getAttribute("data-ln-options");
    if (!this._ownsStore(c)) return;
    this.findChildren().store.getAll({}).then(function(v) {
      S(h, "ln-options:set-data", { data: v.data });
    });
  }, p.prototype._serveStat = function(e) {
    const h = e.target, c = h.getAttribute("data-ln-stat");
    if (!this._ownsStore(c)) return;
    const o = e.detail.filters || null;
    this.findChildren().store.count(o).then(function(g) {
      S(h, "ln-stat:set-count", { count: g });
    });
  }, p.prototype._refreshAll = function() {
    const e = this, h = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let c = 0; c < h.length; c++) {
      const o = h[c];
      let v, g;
      if (o.hasAttribute("data-ln-table-store") ? (v = o.getAttribute("data-ln-table-store"), g = "table") : o.hasAttribute("data-ln-list-store") ? (v = o.getAttribute("data-ln-list-store"), g = "list") : o.hasAttribute("data-ln-options") ? (v = o.getAttribute("data-ln-options"), g = "options") : o.hasAttribute("data-ln-stat") && (v = o.getAttribute("data-ln-stat"), g = "stat"), !this._ownsStore(v)) continue;
      const b = this.findChildren().store;
      if (g === "table" || g === "list") {
        const A = e._boundQueries.get(o) || { sort: null, filters: {}, search: "" };
        (function(L, k) {
          b.getAll(A).then(function(C) {
            const x = { data: C.data, total: C.total, filtered: C.filtered };
            S(L, "ln-" + k + ":set-data", x), e._boundDelivered.set(L, !0);
          });
        })(o, g);
      } else if (g === "options")
        (function(A) {
          b.getAll({}).then(function(L) {
            S(A, "ln-options:set-data", { data: L.data });
          });
        })(o);
      else if (g === "stat") {
        const A = o.getAttribute("data-ln-stat-filter");
        let L = null;
        if (A) {
          const k = A.indexOf(":");
          if (k !== -1) {
            const C = A.slice(0, k), x = A.slice(k + 1);
            L = {}, L[C] = [x];
          }
        }
        (function(k, C) {
          b.count(C).then(function(x) {
            S(k, "ln-stat:set-count", { count: x });
          });
        })(o, L);
      }
    }
  }, p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const e = this;
    e._handlers && (e.dom.removeEventListener("ln-store:request-remote-sync", e._handlers.sync), e.dom.removeEventListener("ln-store:request-remote-create", e._handlers.create), e.dom.removeEventListener("ln-store:request-remote-update", e._handlers.update), e.dom.removeEventListener("ln-store:request-remote-delete", e._handlers.delete), e.dom.removeEventListener("ln-store:request-remote-bulk-delete", e._handlers.bulkDelete), e.dom.removeEventListener("ln-api-queue:send", e._handlers.queueSend), e.dom.removeEventListener("ln-store:initialized", e._handlers.storeInitialized), document.removeEventListener("ln-form:submit-record", e._handlers.formSubmitRecord), r.forEach(function(h) {
      e.dom.removeEventListener(h + ":fetched", e._handlers.connFetched), e.dom.removeEventListener(h + ":created", e._handlers.connCreated), e.dom.removeEventListener(h + ":updated", e._handlers.connUpdated), e.dom.removeEventListener(h + ":deleted", e._handlers.connDeleted), e.dom.removeEventListener(h + ":bulk-deleted", e._handlers.connBulkDeleted), e.dom.removeEventListener(h + ":error", e._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", e._handlers.reqTableData), document.removeEventListener("ln-list:request-data", e._handlers.reqListData), document.removeEventListener("ln-options:request-data", e._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.removeEventListener("ln-store:ready", e._handlers.refresh), e.dom.removeEventListener("ln-store:loaded", e._handlers.refresh), e.dom.removeEventListener("ln-store:created", e._handlers.refresh), e.dom.removeEventListener("ln-store:updated", e._handlers.refresh), e.dom.removeEventListener("ln-store:deleted", e._handlers.refresh), e.dom.removeEventListener("ln-store:synced", e._handlers.refreshSynced), e._handlers = null), e._boundQueries = null, e._boundDelivered = null, e._pendingFormAction = null, e._pendingActionById = null, y.delete(this), n(), delete this.dom[d], delete this.dom[E];
  };
  function s(e, h) {
    const c = e[d];
    c && h === "data-ln-data-mapper" && c.refreshMapper();
  }
  P(f, d, p, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: s
  });
})();
(function() {
  const f = "data-ln-api-queue", d = "lnApiQueue";
  if (window[d] !== void 0) return;
  const E = "ln_api_queue", y = "outbox", _ = "_queue_meta", m = [2e3, 5e3, 15e3, 6e4, 3e5], u = 8;
  let a = null, t = null;
  function n() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (b) => {
        const A = Math.random() * 16 | 0;
        return (b === "x" ? A : A & 3 | 8).toString(16);
      });
    }
  }
  function i() {
    return t || (t = new Promise((g) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), g(null);
      const b = indexedDB.open(E, 1);
      b.onerror = () => {
        console.warn("[ln-api-queue] IndexedDB open failed — queue disabled"), g(null);
      }, b.onupgradeneeded = (A) => {
        const L = A.target.result;
        if (!L.objectStoreNames.contains(y)) {
          const k = L.createObjectStore(y, { keyPath: "entryId" });
          k.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), k.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 });
        }
        L.objectStoreNames.contains(_) || L.createObjectStore(_, { keyPath: "key" });
      }, b.onsuccess = (A) => {
        const L = A.target.result;
        L.onversionchange = () => {
          L.close(), a = null, t = null;
        }, a = L, g(L);
      };
    }), t);
  }
  function r() {
    return a ? Promise.resolve(a) : (t = null, i());
  }
  function p(g) {
    return new Promise((b, A) => {
      g.onsuccess = () => b(g.result), g.onerror = () => A(g.error);
    });
  }
  const l = (g, b) => r().then((A) => A ? A.transaction(g, b).objectStore(g) : null);
  function s(g) {
    return l(y, "readwrite").then((b) => b ? p(b.put(g)) : null);
  }
  function e(g) {
    return l(y, "readwrite").then((b) => b ? p(b.delete(g)) : null);
  }
  function h(g) {
    return l(y, "readonly").then((b) => {
      if (!b) return [];
      const A = b.index("by_scope_seq"), L = IDBKeyRange.bound([g, -1 / 0], [g, 1 / 0]);
      return p(A.getAll(L));
    });
  }
  function c(g) {
    return l(_, "readwrite").then((b) => b ? p(b.get("seq")).then((A) => {
      const L = (A && typeof A.value == "number" ? A.value : 0) + 1;
      return l(_, "readwrite").then((k) => p(k.put({ key: "seq", value: L }))).then(() => L);
    }) : 0);
  }
  function o(g) {
    this.dom = g, g[d] = this;
    const b = g.closest("[data-ln-data-coordinator]");
    this.scope = g.getAttribute(f) || (b ? b.getAttribute("data-ln-data-coordinator") : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const A = this;
    return i().then(() => {
      A._emitPendingCount(), A._drain();
    }), this;
  }
  o.prototype._isOnline = function() {
    const g = this.dom.getAttribute("data-ln-api-queue-online");
    return g === "true" ? !0 : g === "false" ? !1 : navigator.onLine;
  }, o.prototype._emitPendingCount = function() {
    const g = this;
    return h(g.scope).then((b) => {
      S(g.dom, "ln-api-queue:pending-count", { count: b.length, scope: g.scope }), b.length === 0 && S(g.dom, "ln-api-queue:drained", { scope: g.scope });
    });
  }, o.prototype._clearTimer = function(g) {
    const b = this._timers.get(g);
    b && (clearTimeout(b), this._timers.delete(g));
  }, o.prototype._scheduleTimer = function(g, b) {
    if (this._timers.has(g)) return;
    const A = this, L = setTimeout(() => {
      A._timers.delete(g), A._drain();
    }, b);
    this._timers.set(g, L);
  }, o.prototype._drain = function() {
    const g = this;
    if (!g._paused && g._isOnline())
      return h(g.scope).then((b) => {
        const A = /* @__PURE__ */ new Map();
        for (const L of b)
          A.has(L.chainKey) || A.set(L.chainKey, []), A.get(L.chainKey).push(L);
        A.forEach((L, k) => {
          L.sort((I, R) => I.seq - R.seq);
          const C = L.find((I) => I.status !== "failed");
          if (!C || C.status === "inflight") return;
          const x = Date.now();
          if (C.nextAttemptAt > x) {
            g._scheduleTimer(k, C.nextAttemptAt - x);
            return;
          }
          g._clearTimer(k), C.status = "inflight", s(C).then(() => {
            S(g.dom, "ln-api-queue:send", {
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
  }, o.prototype._onEnqueue = function(g) {
    const b = this, A = g.detail || {};
    return c(b.scope).then((L) => {
      const k = {
        entryId: n(),
        scope: b.scope,
        chainKey: A.chainKey,
        seq: L,
        op: A.op,
        targetId: A.targetId !== void 0 ? A.targetId : null,
        payload: A.payload,
        expectedVersion: A.expectedVersion !== void 0 ? A.expectedVersion : null,
        meta: A.meta || {},
        attempts: 0,
        nextAttemptAt: 0,
        status: "pending"
      };
      return s(k).then(() => h(b.scope)).then((C) => {
        S(b.dom, "ln-api-queue:enqueued", { entryId: k.entryId, chainKey: k.chainKey, count: C.length }), S(b.dom, "ln-api-queue:pending-count", { count: C.length, scope: b.scope }), b._drain();
      });
    });
  }, o.prototype._onAck = function(g) {
    const b = this, A = g.detail || {};
    return e(A.entryId).then(() => h(b.scope)).then((L) => {
      S(b.dom, "ln-api-queue:pending-count", { count: L.length, scope: b.scope }), L.length === 0 && S(b.dom, "ln-api-queue:drained", { scope: b.scope }), b._drain();
    });
  }, o.prototype._onNack = function(g) {
    const b = this, A = g.detail || {}, L = A.reason;
    return h(b.scope).then((k) => {
      const C = k.find((x) => x.entryId === A.entryId);
      if (C) {
        if (L === "retry")
          return C.attempts = (C.attempts || 0) + 1, C.attempts >= u ? (C.status = "failed", s(C).then(() => (S(b.dom, "ln-api-queue:failed", { entryId: C.entryId, chainKey: C.chainKey, attempts: C.attempts }), h(b.scope))).then((x) => {
            S(b.dom, "ln-api-queue:pending-count", { count: x.length, scope: b.scope });
          })) : (C.nextAttemptAt = Date.now() + m[Math.min(C.attempts - 1, m.length - 1)], C.status = "pending", s(C).then(() => (b._scheduleTimer(C.chainKey, C.nextAttemptAt - Date.now()), h(b.scope))).then((x) => {
            S(b.dom, "ln-api-queue:pending-count", { count: x.length, scope: b.scope });
          }));
        if (L === "drop")
          return e(C.entryId).then(() => h(b.scope)).then((x) => {
            S(b.dom, "ln-api-queue:pending-count", { count: x.length, scope: b.scope }), x.length === 0 && S(b.dom, "ln-api-queue:drained", { scope: b.scope }), b._drain();
          });
        if (L === "auth")
          return C.status = "pending", s(C).then(() => {
            b._paused = !0, S(b.dom, "ln-api-queue:paused", { reason: "auth" }), S(b.dom, "ln-api-queue:auth-required", { entryId: C.entryId, chainKey: C.chainKey });
          });
      }
    });
  }, o.prototype._onRemap = function(g) {
    const b = this, A = g.detail || {}, L = A.oldKey, k = A.newId;
    return h(b.scope).then((C) => {
      const x = C.filter((I) => I.chainKey === L && I.status !== "failed");
      return Promise.all(x.map((I) => (I.targetId === L && (I.targetId = k), I.chainKey = k, s(I))));
    });
  }, o.prototype._onResume = function() {
    this._paused = !1, S(this.dom, "ln-api-queue:resumed", {}), this._drain();
  }, o.prototype._onDrain = function() {
    this._drain();
  }, o.prototype._onClear = function() {
    const g = this;
    return h(g.scope).then((b) => Promise.all(b.map((A) => e(A.entryId)))).then(() => {
      S(g.dom, "ln-api-queue:pending-count", { count: 0, scope: g.scope }), S(g.dom, "ln-api-queue:drained", { scope: g.scope });
    });
  }, o.prototype._bindEvents = function() {
    const g = this;
    g._handlers = {
      enqueue: (b) => g._onEnqueue(b),
      ack: (b) => g._onAck(b),
      nack: (b) => g._onNack(b),
      remap: (b) => g._onRemap(b),
      resume: (b) => g._onResume(b),
      drain: (b) => g._onDrain(b),
      clear: (b) => g._onClear(b)
    }, g.dom.addEventListener("ln-api-queue:request-enqueue", g._handlers.enqueue), g.dom.addEventListener("ln-api-queue:ack", g._handlers.ack), g.dom.addEventListener("ln-api-queue:nack", g._handlers.nack), g.dom.addEventListener("ln-api-queue:request-remap", g._handlers.remap), g.dom.addEventListener("ln-api-queue:request-resume", g._handlers.resume), g.dom.addEventListener("ln-api-queue:request-drain", g._handlers.drain), g.dom.addEventListener("ln-api-queue:request-clear", g._handlers.clear);
  }, o.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const g = this;
    g.dom.removeEventListener("ln-api-queue:request-enqueue", g._handlers.enqueue), g.dom.removeEventListener("ln-api-queue:ack", g._handlers.ack), g.dom.removeEventListener("ln-api-queue:nack", g._handlers.nack), g.dom.removeEventListener("ln-api-queue:request-remap", g._handlers.remap), g.dom.removeEventListener("ln-api-queue:request-resume", g._handlers.resume), g.dom.removeEventListener("ln-api-queue:request-drain", g._handlers.drain), g.dom.removeEventListener("ln-api-queue:request-clear", g._handlers.clear), window.removeEventListener("online", g._onlineHandler), g._timers.forEach((b) => clearTimeout(b)), g._timers.clear(), S(g.dom, "ln-api-queue:destroyed", { scope: g.scope }), delete g.dom[d];
  };
  function v(g) {
    const b = g[d];
    b && b._drain();
  }
  P(f, d, o, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: v
  });
})();
(function() {
  const f = "data-ln-options", d = "lnOptions";
  if (window[d] !== void 0) return;
  function E(y) {
    this.dom = y, this._storeName = y.getAttribute(f), this._valueField = y.getAttribute("data-ln-options-value") || "id", this._labelField = y.getAttribute("data-ln-options-label") || "name";
    const _ = this;
    return this._onSetData = function(m) {
      _._rebuild(m.detail.data || []);
    }, y.addEventListener("ln-options:set-data", this._onSetData), S(y, "ln-options:request-data", { options: this._storeName }), this;
  }
  E.prototype._rebuild = function(y) {
    const _ = this.dom, m = this._valueField, u = this._labelField, a = _.value, t = _.querySelectorAll("option");
    for (let i = t.length - 1; i >= 0; i--)
      t[i].value !== "" && _.removeChild(t[i]);
    for (let i = 0; i < y.length; i++) {
      const r = y[i], p = document.createElement("option");
      p.value = String(r[m]), p.textContent = r[u] != null ? r[u] : "", _.appendChild(p);
    }
    const n = _.options;
    for (let i = 0; i < n.length; i++)
      if (n[i].value === a) {
        _.value = a;
        break;
      }
  }, E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[d]);
  }, P(f, d, E, "ln-options");
})();
(function() {
  const f = "data-ln-stat", d = "lnStat";
  if (window[d] !== void 0) return;
  function E(_) {
    if (!_) return null;
    const m = _.indexOf(":");
    if (m === -1) return null;
    const u = _.slice(0, m), a = _.slice(m + 1), t = {};
    return t[u] = [a], t;
  }
  function y(_) {
    return this.dom = _, this._storeName = _.getAttribute(f), this._filters = E(_.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      _.textContent = String(m.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), S(_, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[d]);
  }, P(f, d, y, "ln-stat");
})();
(function() {
  const f = "data-ln-store-notify", d = "lnStoreNotify";
  if (window[d] !== void 0) return;
  function E(_, m, u) {
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: _, title: m, message: u }
    }));
  }
  function y(_) {
    this.dom = _, this._savedTitle = _.getAttribute("data-ln-store-notify-saved") || null, this._deletedTitle = _.getAttribute("data-ln-store-notify-deleted") || null, this._failedTitle = _.getAttribute("data-ln-store-notify-failed") || null;
    const m = this;
    return this._onConfirmed = function(u) {
      const a = u.detail || {}, t = a.action || "confirmed";
      let n, i;
      if (t === "create" || t === "update")
        n = m._savedTitle || t, i = a.record && a.record.name ? a.record.name : void 0;
      else if (t === "delete")
        n = m._deletedTitle || t, i = void 0;
      else if (t === "bulk-delete") {
        n = m._deletedTitle || t;
        const r = a.ids ? a.ids.length : 0;
        i = r ? String(r) : void 0;
      } else
        n = m._savedTitle || t, i = void 0;
      E("success", n, i);
    }, this._onReverted = function(u) {
      const a = u.detail || {}, t = a.action || "reverted", n = m._failedTitle || t, i = a.error ? String(a.error) : void 0;
      E("error", n, i);
    }, _.addEventListener("ln-store:confirmed", this._onConfirmed), _.addEventListener("ln-store:reverted", this._onReverted), this;
  }
  y.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-store:confirmed", this._onConfirmed), this.dom.removeEventListener("ln-store:reverted", this._onReverted), delete this.dom[d]);
  }, P(f, d, y, "ln-store-notify");
})();
(function() {
  const f = "ln-icons-sprite", d = "#ln-", E = "#lnc-", y = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let m = null;
  const u = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), a = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", n = "lni:v", i = "1";
  function r() {
    try {
      if (localStorage.getItem(n) !== i) {
        for (let o = localStorage.length - 1; o >= 0; o--) {
          const v = localStorage.key(o);
          v && v.indexOf(t) === 0 && localStorage.removeItem(v);
        }
        localStorage.setItem(n, i);
      }
    } catch {
    }
  }
  r();
  function p() {
    return m || (m = document.getElementById(f), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = f, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function l(o) {
    return o.indexOf(E) === 0 ? a + "/" + o.slice(E.length) + ".svg" : u + "/" + o.slice(d.length) + ".svg";
  }
  function s(o, v) {
    const g = v.match(/viewBox="([^"]+)"/), b = g ? g[1] : "0 0 24 24", A = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), L = A ? A[1].trim() : "", k = v.match(/<svg([^>]*)>/i), C = k ? k[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = o, x.setAttribute("viewBox", b), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const R = C.match(new RegExp(I + '="([^"]*)"'));
      R && x.setAttribute(I, R[1]);
    }), x.innerHTML = L, p().querySelector("defs").appendChild(x);
  }
  function e(o) {
    if (y.has(o) || _.has(o) || o.indexOf(E) === 0 && !a) return;
    const v = o.slice(1);
    try {
      const g = localStorage.getItem(t + v);
      if (g) {
        s(v, g), y.add(o);
        return;
      }
    } catch {
    }
    _.add(o), fetch(l(o)).then(function(g) {
      if (!g.ok) throw new Error(g.status);
      return g.text();
    }).then(function(g) {
      s(v, g), y.add(o), _.delete(o);
      try {
        localStorage.setItem(t + v, g);
      } catch {
      }
    }).catch(function() {
      _.delete(o);
    });
  }
  function h(o) {
    const v = 'use[href^="' + d + '"], use[href^="' + E + '"]', g = o.querySelectorAll ? o.querySelectorAll(v) : [];
    if (o.matches && o.matches(v)) {
      const b = o.getAttribute("href");
      b && e(b);
    }
    Array.prototype.forEach.call(g, function(b) {
      const A = b.getAttribute("href");
      A && e(A);
    });
  }
  function c() {
    h(document), new MutationObserver(function(o) {
      o.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(g) {
            g.nodeType === 1 && h(g);
          });
        else if (v.type === "attributes" && v.attributeName === "href") {
          const g = v.target.getAttribute("href");
          g && (g.indexOf(d) === 0 || g.indexOf(E) === 0) && e(g);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const f = "data-ln-debug", d = "lnDebug";
  if (window[d] !== void 0) return;
  function E(y) {
    return this.dom = y, this;
  }
  E.prototype.destroy = function() {
    delete this.dom[d];
  }, P(f, d, E, "ln-debug");
})();
