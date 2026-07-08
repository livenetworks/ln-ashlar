if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...d) {
    typeof d[0] == "string" && (d[0].startsWith("[ln-") || d[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, d);
  };
}
const Ct = {};
function vt(h, d) {
  Ct[h] || (Ct[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const E = Ct[h];
  return E ? E.content.cloneNode(!0) : (console.warn("[" + (d || "ln-core") + '] Template "' + h + '" not found'), null);
}
function L(h, d, E) {
  h.dispatchEvent(new CustomEvent(d, {
    bubbles: !0,
    detail: E || {}
  }));
}
function V(h, d, E) {
  const v = new CustomEvent(d, {
    bubbles: !0,
    cancelable: !0,
    detail: E || {}
  });
  return h.dispatchEvent(v), v;
}
function jt(h, d, E) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const v = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  v[E] = h.name, L(h.dom, d, v);
}
function X(h, d) {
  if (!h || !d) return h;
  const E = h.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < E.length; l++) {
    const s = E[l], t = s.getAttribute("data-ln-field");
    d[t] != null && (s.textContent = d[t]);
  }
  const v = h.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < v.length; l++) {
    const s = v[l], t = s.getAttribute("data-ln-attr").split(",");
    for (let e = 0; e < t.length; e++) {
      const i = t[e].trim().split(":");
      if (i.length !== 2) continue;
      const o = i[0].trim(), p = i[1].trim();
      d[p] != null && s.setAttribute(o, d[p]);
    }
  }
  const _ = h.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < _.length; l++) {
    const s = _[l], t = s.getAttribute("data-ln-show");
    t in d && s.classList.toggle("hidden", !d[t]);
  }
  const m = h.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < m.length; l++) {
    const s = m[l], t = s.getAttribute("data-ln-class").split(",");
    for (let e = 0; e < t.length; e++) {
      const i = t[e].trim().split(":");
      if (i.length !== 2) continue;
      const o = i[0].trim(), p = i[1].trim();
      p in d && s.classList.toggle(o, !!d[p]);
    }
  }
  return h;
}
function ce(h, d) {
  h.matches && h.matches("[data-ln-form], [data-ln-fillable]") && h.dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  const E = h.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let v = 0; v < E.length; v++)
    E[v].dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  return h;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(h) {
  if (!(!h.target.matches || !h.target.matches("[data-ln-fillable]")))
    if (h.detail)
      X(h.target, h.detail);
    else {
      const d = h.target.querySelectorAll("[data-ln-field]");
      for (let E = 0; E < d.length; E++)
        d[E].textContent = "";
    }
})));
function bt(h, d) {
  if (!h || !d) return h;
  const E = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; E.nextNode(); ) {
    const m = E.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(l, s) {
        return d[s] !== void 0 ? d[s] : "";
      }
    ));
  }
  const v = function(m, l) {
    return d[l] !== void 0 ? d[l] : "";
  }, _ = Array.from(h.querySelectorAll("*"));
  h.nodeType === 1 && _.push(h);
  for (let m = 0; m < _.length; m++) {
    const l = _[m], s = l.attributes;
    for (let t = 0; t < s.length; t++) {
      const e = s[t];
      e.value.indexOf("{{") !== -1 && l.setAttribute(e.name, e.value.replace(/\{\{\s*(\w+)\s*\}\}/g, v));
    }
  }
  return h;
}
function de(h, d, E, v, _, m) {
  const l = {};
  for (let t = 0; t < h.children.length; t++) {
    const e = h.children[t], i = e.getAttribute("data-ln-key");
    i && (l[i] = e);
  }
  const s = document.createDocumentFragment();
  for (let t = 0; t < d.length; t++) {
    const e = d[t], i = String(v(e));
    let o = l[i];
    if (o)
      _(o, e, t);
    else {
      const p = vt(E, m);
      if (!p || (bt(p, e), o = p.firstElementChild, !o)) continue;
      o.setAttribute("data-ln-key", i), _(o, e, t);
    }
    s.appendChild(o);
  }
  h.textContent = "", h.appendChild(s);
}
function J(h, d) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      J(h, d);
    }), console.warn("[" + d + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function lt(h, d, E) {
  if (h) {
    const v = h.querySelector('[data-ln-template="' + d + '"]');
    if (v) return v.content.cloneNode(!0);
  }
  return vt(d, E);
}
function Kt(h, d) {
  const E = {}, v = h.querySelectorAll("[" + d + "]");
  for (let _ = 0; _ < v.length; _++)
    E[v[_].getAttribute(d)] = v[_].textContent, v[_].remove();
  return E;
}
function Tt(h, d, E, v) {
  if (h.nodeType !== 1) return;
  const m = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", l = Array.from(h.querySelectorAll(m));
  h.matches && h.matches(m) && l.push(h);
  for (const s of l)
    s[E] || (s[E] = new v(s));
}
function mt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function zt(h, d) {
  const E = !!(d && d.typed), v = d && d.exclude, _ = {}, m = h.elements, l = {};
  if (E)
    for (let s = 0; s < m.length; s++) {
      const t = m[s];
      t.name && t.type === "checkbox" && !t.disabled && (l[t.name] = (l[t.name] || 0) + 1);
    }
  for (let s = 0; s < m.length; s++) {
    const t = m[s];
    if (!(!t.name || t.disabled || t.type === "file" || t.type === "submit" || t.type === "button") && !(v && t.matches && t.matches(v)))
      if (t.type === "checkbox")
        E && l[t.name] === 1 ? _[t.name] = t.checked : (_[t.name] || (_[t.name] = []), t.checked && _[t.name].push(t.value));
      else if (t.type === "radio")
        t.checked && (_[t.name] = t.value);
      else if (t.type === "select-multiple") {
        _[t.name] = [];
        for (let e = 0; e < t.options.length; e++)
          t.options[e].selected && _[t.name].push(t.options[e].value);
      } else if (E && t.type === "hidden")
        _[t.name] = t.value;
      else if (E && (t.type === "number" || t.type === "range")) {
        const e = Number(t.value);
        _[t.name] = t.value === "" || isNaN(e) ? null : e;
      } else
        _[t.name] = t.value;
  }
  return _;
}
function ue(h) {
  if (typeof h != "string") return !!h;
  const d = h.trim().toLowerCase();
  return d !== "false" && d !== "0" && d !== "" && d !== "off" && d !== "no";
}
function Vt(h, d) {
  const E = h.elements, v = [], _ = {};
  for (let m = 0; m < E.length; m++) {
    const l = E[m];
    l.name && l.type === "checkbox" && (_[l.name] = (_[l.name] || 0) + 1);
  }
  for (let m = 0; m < E.length; m++) {
    const l = E[m];
    if (l.type === "file" || l.type === "submit" || l.type === "button") continue;
    const s = l.getAttribute("data-ln-fill-as") || l.name;
    if (!s || !(s in d)) continue;
    const t = d[s];
    if (l.type === "checkbox") {
      if (Array.isArray(t))
        l.checked = t.indexOf(l.value) !== -1;
      else if (_[l.name] > 1) {
        const e = String(t).split(",").map(function(i) {
          return i.trim();
        });
        l.checked = e.indexOf(l.value) !== -1;
      } else
        l.checked = ue(t);
      v.push(l);
    } else if (l.type === "radio")
      l.checked = l.value === String(t), v.push(l);
    else if (l.type === "select-multiple") {
      if (Array.isArray(t))
        for (let e = 0; e < l.options.length; e++)
          l.options[e].selected = t.indexOf(l.options[e].value) !== -1;
      v.push(l);
    } else
      l.value = t, v.push(l);
  }
  return v;
}
function $(h) {
  const d = h ? h.closest("[lang]") : null;
  return (d ? d.lang : null) || (document.documentElement ? document.documentElement.lang : null) || navigator.language;
}
function Ft(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function Wt(h, d, { get: E, set: v }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return E ? E.call(this) : d.get.call(this);
    },
    set: function(_) {
      v ? v.call(this, _, (m) => d.set.call(this, m)) : d.set.call(this, _);
    },
    configurable: !0
  });
}
function H(h, d, E, v, _ = {}) {
  const m = _.extraAttributes || [], l = _.onAttributeChange || null, s = _.onInit || null;
  function t(e) {
    const i = e || document.body;
    Tt(i, h, d, E), s && s(i);
  }
  return J(function() {
    const e = new MutationObserver(function(o) {
      for (let p = 0; p < o.length; p++) {
        const c = o[p];
        if (c.type === "childList") {
          for (let f = 0; f < c.addedNodes.length; f++) {
            const r = c.addedNodes[f];
            r.nodeType === 1 && (Tt(r, h, d, E), s && s(r));
          }
          for (let f = 0; f < c.removedNodes.length; f++) {
            const r = c.removedNodes[f];
            if (r.nodeType === 1) {
              const a = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", n = Array.from(r.querySelectorAll(a));
              r.matches && r.matches(a) && n.push(r);
              for (let y = 0; y < n.length; y++) {
                const g = n[y];
                if (!document.contains(g)) {
                  const b = g[d];
                  b && typeof b.destroy == "function" && b.destroy();
                }
              }
            }
          }
        } else c.type === "attributes" && (l && c.target[d] ? l(c.target, c.attributeName) : (Tt(c.target, h, d, E), s && s(c.target)));
      }
    });
    let i = [];
    if (h.indexOf("[") !== -1) {
      const o = /\[([\w-]+)/g;
      let p;
      for (; (p = o.exec(h)) !== null; )
        i.push(p[1]);
    } else
      i.push(h);
    e.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: i.concat(m)
    });
  }, v || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[d] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function $t(h, d) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !d) return !1;
  const E = d.getAttribute("href");
  return !(!E || d.getAttribute("target") === "_blank" || d.hasAttribute("download") || E.startsWith("mailto:") || E.startsWith("tel:") || E === "#" || E.startsWith("#") || d.hostname && d.hostname !== window.location.hostname);
}
function G(...h) {
  return h.filter((d) => d != null && d !== "").map((d, E) => E === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function it(h, d) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, d ? { Authorization: d } : null);
}
function Gt(h, d = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (E) {
    return console.error(`[${d}] Invalid headers JSON:`, E), {};
  }
}
const Yt = {};
function he(h, d) {
  Yt[h] = d;
}
function fe(h) {
  return Yt[h] || { ingress: (d) => d, egress: (d) => d };
}
const Xt = {};
function Ot(h, d) {
  if (!h || typeof d != "object") return;
  const E = h.toLowerCase().split("-")[0];
  Xt[E] = d;
}
function _t(h) {
  if (!h) return null;
  const d = h.toLowerCase().split("-")[0];
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = he, window.lnCore.getDataMapper = fe, window.lnCore.registerLocaleFallback = Ot, window.lnCore.getLocaleFallback = _t, window.lnCore.fillTemplate = bt, window.lnCore.fill = X, window.lnCore.lnFill = ce, window.lnCore.renderList = de);
function pe(h, d) {
  let E = !1;
  return function() {
    E || (E = !0, queueMicrotask(function() {
      E = !1, h(), d && d();
    }));
  };
}
const me = "ln:";
function _e() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Jt(h, d) {
  const E = d.getAttribute("data-ln-persist"), v = E !== null && E !== "" ? E : d.id;
  return v ? me + h + ":" + _e() + ":" + v : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', d), null);
}
function wt(h, d) {
  const E = Jt(h, d);
  if (!E) return null;
  try {
    const v = localStorage.getItem(E);
    return v !== null ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
function ct(h, d, E) {
  const v = Jt(h, d);
  if (v)
    try {
      E == null ? localStorage.removeItem(v) : localStorage.setItem(v, JSON.stringify(E));
    } catch {
    }
}
function Qt(h) {
  return (h || "").replace(/^#/, "");
}
function St(h) {
  const d = h === void 0 ? location.hash : h, E = {}, v = Qt(d);
  if (!v) return E;
  const _ = v.split("&");
  for (let m = 0; m < _.length; m++) {
    const l = _[m];
    if (!l) continue;
    const s = l.indexOf(":"), t = s > -1 ? l.slice(0, s) : l, e = s > -1 ? l.slice(s + 1) : "";
    if (t)
      try {
        E[t] = decodeURIComponent(e);
      } catch {
        E[t] = e;
      }
  }
  return E;
}
function at(h) {
  if (!h) return null;
  const d = St();
  return h in d ? d[h] : null;
}
function dt(h, d) {
  if (!h) return;
  const E = St();
  d == null ? delete E[h] : E[h] = String(d);
  const _ = Object.keys(E).map(function(m) {
    const l = E[m];
    return l === "" ? m : m + ":" + encodeURIComponent(l);
  }).join("&");
  Qt(location.hash) !== _ && (location.hash = _);
}
function Rt(h) {
  return h.button === 1 || h.ctrlKey || h.metaKey || h.shiftKey ? !1 : (h.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = St, window.lnCore.hashGet = at, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = Rt);
function Et(h, d, E, v) {
  const _ = typeof v == "number" ? v : 4, m = window.innerWidth, l = window.innerHeight, s = d.width, t = d.height, e = (E || "bottom").split("-"), i = e[0], o = e[1] === "start" || e[1] === "end" ? e[1] : "center", p = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, c = p[i] || p.bottom;
  function f(y) {
    return y === "top" || y === "bottom" ? o === "start" ? h.left : o === "end" ? h.right - s : h.left + (h.width - s) / 2 : o === "start" ? h.top : o === "end" ? h.bottom - t : h.top + (h.height - t) / 2;
  }
  function r(y) {
    let g, b, A = !0;
    return y === "top" ? (g = h.top - _ - t, b = f(y), g < 0 && (A = !1)) : y === "bottom" ? (g = h.bottom + _, b = f(y), g + t > l && (A = !1)) : y === "left" ? (g = f(y), b = h.left - _ - s, b < 0 && (A = !1)) : (g = f(y), b = h.right + _, b + s > m && (A = !1)), { top: g, left: b, side: y, fits: A };
  }
  let u = null;
  for (let y = 0; y < c.length; y++) {
    const g = r(c[y]);
    if (g.fits) {
      u = g;
      break;
    }
  }
  u || (u = r(c[0]));
  let a = u.top, n = u.left;
  return s >= m ? n = 0 : (n < 0 && (n = 0), n + s > m && (n = m - s)), t >= l ? a = 0 : (a < 0 && (a = 0), a + t > l && (a = l - t)), { top: a, left: n, placement: u.side };
}
function Zt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const d = h.parentNode, E = document.createComment("ln-teleport");
  return d.insertBefore(E, h), document.body.appendChild(h), function() {
    E.parentNode && (E.parentNode.insertBefore(h, E), E.parentNode.removeChild(E));
  };
}
function kt(h) {
  if (!h) return { width: 0, height: 0 };
  const d = h.style, E = d.visibility, v = d.display, _ = d.position;
  d.visibility = "hidden", d.display = "block", d.position = "fixed";
  const m = h.offsetWidth, l = h.offsetHeight;
  return d.visibility = E, d.display = v, d.position = _, { width: m, height: l };
}
let st = null;
async function Bt(h) {
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
function pt() {
  return st;
}
async function ge(h, d = st) {
  const E = d || st;
  if (!E || h === void 0 || h === null) return h;
  try {
    const v = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), m = typeof h == "string" ? h : JSON.stringify(h), l = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      E,
      v.encode(m)
    ), s = btoa(String.fromCharCode(..._)), t = btoa(String.fromCharCode(...new Uint8Array(l)));
    return {
      encrypted: !0,
      iv: s,
      data: t
    };
  } catch (v) {
    return console.error("[ln-core/crypto] Encryption failed:", v), h;
  }
}
async function be(h, d = st) {
  const E = d || st;
  if (!h || !h.encrypted || !E) return h;
  try {
    const v = new TextDecoder(), _ = Uint8Array.from(atob(h.iv), (t) => t.charCodeAt(0)), m = Uint8Array.from(atob(h.data), (t) => t.charCodeAt(0)), l = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      E,
      m
    ), s = v.decode(l);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (v) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", v), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), d = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
  function v(e) {
    return typeof e == "string" ? e : e instanceof URL ? e.href : e instanceof Request ? e.url : String(e);
  }
  function _(e, i) {
    return i && i.method ? String(i.method).toUpperCase() : e instanceof Request ? e.method.toUpperCase() : "GET";
  }
  function m(e, i) {
    return i + " " + e;
  }
  function l(e) {
    return e === "GET" || e === "HEAD";
  }
  function s(e, i) {
    i = i || {};
    const o = v(e), p = _(e, i), c = m(o, p);
    l(p) && d.has(c) && (d.get(c).abort(), d.delete(c));
    const f = new AbortController(), r = i.signal;
    r && (r.aborted ? f.abort(r.reason) : r.addEventListener("abort", function() {
      f.abort(r.reason);
    }, { once: !0 }));
    const u = Object.assign({}, i, { signal: f.signal });
    return d.set(c, f), h(e, u).finally(function() {
      d.get(c) === f && d.delete(c);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function t(e) {
    const i = e.detail || {};
    if (!i.url) return;
    const o = e.target, p = (i.method || (i.body ? "POST" : "GET")).toUpperCase(), c = i.key;
    c && E.has(c) && (E.get(c).abort(), E.delete(c));
    const f = new AbortController(), r = i.signal;
    r && (r.aborted ? f.abort(r.reason) : r.addEventListener("abort", function() {
      f.abort(r.reason);
    }, { once: !0 })), c && E.set(c, f);
    const u = { method: p, signal: f.signal };
    i.body !== void 0 && (u.body = i.body), window.fetch(i.url, u).then(function(a) {
      c && E.get(c) === f && E.delete(c), L(o, "ln-http:response", {
        ok: a.ok,
        status: a.status,
        response: a
      });
    }).catch(function(a) {
      c && E.get(c) === f && E.delete(c), !(a && a.name === "AbortError") && L(o, "ln-http:error", {
        ok: !1,
        status: 0,
        error: a
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(e) {
      let i = !1;
      return d.forEach(function(o, p) {
        p.endsWith(" " + e) && (o.abort(), d.delete(p), i = !0);
      }), i;
    },
    cancelByKey: function(e) {
      return E.has(e) ? (E.get(e).abort(), E.delete(e), !0) : !1;
    },
    cancelAll: function() {
      d.forEach(function(e) {
        e.abort();
      }), d.clear(), E.forEach(function(e) {
        e.abort();
      }), E.clear();
    },
    get inflight() {
      const e = [];
      return d.forEach(function(i, o) {
        const p = o.indexOf(" ");
        e.push({ method: o.slice(0, p), url: o.slice(p + 1) });
      }), E.forEach(function(i, o) {
        e.push({ key: o });
      }), e;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", t), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", d = "lnAjax", E = "data-ln-form-scope";
  if (window[d] !== void 0) return;
  function v(o) {
    if (!o.hasAttribute(h) || o[d]) return;
    o[d] = !0;
    const p = t(o);
    _(p.links), m(p.forms);
  }
  function _(o) {
    for (const p of o) {
      if (p[d + "Trigger"] || p.hostname && p.hostname !== window.location.hostname) continue;
      const c = p.getAttribute("href");
      if (c && c.includes("#")) continue;
      const f = function(r) {
        if (!$t(r, p)) return;
        r.preventDefault();
        const u = p.getAttribute("href");
        u && s("GET", u, null, p);
      };
      p.addEventListener("click", f), p[d + "Trigger"] = f;
    }
  }
  function m(o) {
    for (const p of o) {
      if (p[d + "Trigger"]) continue;
      if (p.hasAttribute(E)) {
        p[d + "ScopeWarned"] || (p[d + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const c = function(f) {
        f.preventDefault();
        const r = p.method.toUpperCase(), u = p.action, a = new FormData(p);
        for (const n of p.querySelectorAll('button, input[type="submit"]'))
          n.disabled = !0;
        s(r, u, a, p, function() {
          for (const n of p.querySelectorAll('button, input[type="submit"]'))
            n.disabled = !1;
        });
      };
      p.addEventListener("submit", c), p[d + "Trigger"] = c;
    }
  }
  function l(o) {
    if (!o[d]) return;
    const p = t(o);
    for (const c of p.links)
      c[d + "Trigger"] && (c.removeEventListener("click", c[d + "Trigger"]), delete c[d + "Trigger"]);
    for (const c of p.forms)
      c[d + "Trigger"] && (c.removeEventListener("submit", c[d + "Trigger"]), delete c[d + "Trigger"]);
    delete o[d];
  }
  function s(o, p, c, f, r) {
    if (V(f, "ln-ajax:before-start", { method: o, url: p }).defaultPrevented) return;
    L(f, "ln-ajax:start", { method: o, url: p }), f.classList.add("ln-ajax--loading");
    const a = document.createElement("span");
    a.className = "ln-ajax-spinner", f.appendChild(a);
    function n() {
      f.classList.remove("ln-ajax--loading");
      const w = f.querySelector(".ln-ajax-spinner");
      w && w.remove(), r && r();
    }
    let y = p;
    const g = document.querySelector('meta[name="csrf-token"]'), b = g ? g.getAttribute("content") : null;
    c instanceof FormData && b && c.append("_token", b);
    const A = {
      method: o,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (b && (A.headers["X-CSRF-TOKEN"] = b), o === "GET" && c) {
      const w = new URLSearchParams(c);
      y = p + (p.includes("?") ? "&" : "?") + w.toString();
    } else o !== "GET" && c && (A.body = c);
    fetch(y, A).then(function(w) {
      const T = w.ok;
      return w.json().then(function(C) {
        return { ok: T, status: w.status, data: C };
      });
    }).then(function(w) {
      const T = w.data;
      if (w.ok) {
        if (T.title && (document.title = T.title), T.content)
          for (const C in T.content) {
            const x = document.getElementById(C);
            x && (x.innerHTML = T.content[C]);
          }
        if (f.tagName === "A") {
          const C = f.getAttribute("href");
          C && window.history.pushState({ ajax: !0 }, "", C);
        } else f.tagName === "FORM" && f.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", y);
        L(f, "ln-ajax:success", { method: o, url: y, data: T });
      } else
        L(f, "ln-ajax:error", { method: o, url: y, status: w.status, data: T });
      if (T.message) {
        const C = T.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: C.type || (w.ok ? "success" : "error"),
            title: C.title || "",
            message: C.body || ""
          }
        }));
      }
      L(f, "ln-ajax:complete", { method: o, url: y }), n();
    }).catch(function(w) {
      L(f, "ln-ajax:error", { method: o, url: y, error: w }), L(f, "ln-ajax:complete", { method: o, url: y }), n();
    });
  }
  function t(o) {
    const p = { links: [], forms: [] };
    return o.tagName === "A" && o.getAttribute(h) !== "false" ? p.links.push(o) : o.tagName === "FORM" && o.getAttribute(h) !== "false" ? p.forms.push(o) : (p.links = Array.from(o.querySelectorAll('a:not([data-ln-ajax="false"])')), p.forms = Array.from(o.querySelectorAll('form:not([data-ln-ajax="false"])'))), p;
  }
  function e() {
    J(function() {
      new MutationObserver(function(p) {
        for (const c of p)
          if (c.type === "childList") {
            for (const f of c.addedNodes)
              if (f.nodeType === 1 && (v(f), !f.hasAttribute(h))) {
                for (const u of f.querySelectorAll("[" + h + "]"))
                  v(u);
                const r = f.closest && f.closest("[" + h + "]");
                if (r && r.getAttribute(h) !== "false") {
                  const u = t(f);
                  _(u.links), m(u.forms);
                }
              }
          } else c.type === "attributes" && v(c.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function i() {
    for (const o of document.querySelectorAll("[" + h + "]"))
      v(o);
  }
  window[d] = v, window[d].destroy = l, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
const te = {
  navigate: function(h) {
    gt(h, { historyAction: "push" });
  },
  replace: function(h) {
    gt(h, { historyAction: "replace" });
  },
  current: function() {
    return Dt ? {
      path: xt,
      params: ie,
      query: oe,
      route: Dt,
      regions: ne
    } : null;
  }
}, Mt = "data-ln-route", ee = "lnRoute";
typeof window < "u" && (window.lnRouter = te);
const ot = /* @__PURE__ */ new Map(), Pt = /* @__PURE__ */ new WeakMap();
let ne = /* @__PURE__ */ new Map(), Ht = !1, xt = null, ie = {}, oe = {}, Dt = null, qt = !1;
function Ut(h, d, E) {
  qt ? queueMicrotask(function() {
    L(h, d, E);
  }) : L(h, d, E);
}
function At(h) {
  try {
    const m = new URL(h, window.location.origin);
    h = m.pathname + m.search + m.hash;
  } catch {
  }
  let [d] = h.split("#"), [E, v] = d.split("?");
  const _ = {};
  if (v) {
    const m = new URLSearchParams(v);
    for (const [l, s] of m.entries())
      _[l] = s;
  }
  return E = E.replace(/\/+$/, ""), E === "" && (E = "/"), { path: E, query: _ };
}
function re(h, d) {
  if (h.pattern === "*") return 1;
  if (d.pattern === "*") return -1;
  const E = h.segments, v = d.segments, _ = Math.max(E.length, v.length);
  for (let m = 0; m < _; m++) {
    const l = E[m], s = v[m];
    if (l === void 0) return 1;
    if (s === void 0) return -1;
    if (l === "*") return 1;
    if (s === "*") return -1;
    const t = l.startsWith(":"), e = s.startsWith(":");
    if (t && !e) return 1;
    if (!t && e) return -1;
  }
  return 0;
}
function se(h, d) {
  const E = h.split("/").filter(Boolean);
  for (const v of d) {
    if (v.pattern === "*")
      return {
        route: v,
        params: { wildcard: h }
      };
    const _ = v.segments, m = {};
    let l = !0;
    if (!(E.length > _.length && _[_.length - 1] !== "*")) {
      for (let s = 0; s < _.length; s++) {
        const t = _[s], e = E[s];
        if (t === "*") {
          m.wildcard = E.slice(s).join("/");
          break;
        }
        if (e === void 0) {
          l = !1;
          break;
        }
        if (t.startsWith(":"))
          m[t.slice(1)] = decodeURIComponent(e);
        else if (t !== e) {
          l = !1;
          break;
        }
      }
      if (l && (_.indexOf("*") !== -1 || E.length <= _.length))
        return { route: v, params: m };
    }
  }
  return null;
}
function It(h, d) {
  if (h !== "__primary__") {
    const v = document.getElementById(d.target);
    return v || console.warn(`[ln-router] Explicit target element #${d.target} not found in DOM`), v;
  }
  const E = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return E || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), E;
}
function ye(h) {
  if (!h) return;
  const d = Array.from(h.querySelectorAll("*")), E = [h].concat(d);
  for (const _ of E)
    for (const m of Object.keys(_))
      if (m.startsWith("ln") && _[m] && typeof _[m].destroy == "function")
        try {
          _[m].destroy();
        } catch (l) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, _, l);
        }
  const v = document.querySelectorAll('[data-ln-popover="open"]');
  for (const _ of v) {
    const m = _.lnPopover;
    if (m && m.trigger && h.contains(m.trigger))
      try {
        m.destroy();
      } catch (l) {
        console.error("[ln-router] Error destroying open teleported popover:", l);
      }
  }
}
function gt(h, d = {}) {
  const { path: E, query: v } = At(h), _ = /* @__PURE__ */ new Map();
  for (const [i, o] of ot)
    _.set(i, se(E, o.sorted));
  const m = ot.has("__primary__"), l = _.get("__primary__");
  if (m && !l) {
    Ut(document.body, "ln-router:not-found", { path: E });
    return;
  }
  let s = null;
  if (l && (s = It("__primary__", l.route), !s || V(s, "ln-router:before-navigate", {
    from: xt,
    to: h,
    params: l.params,
    query: v
  }).defaultPrevented))
    return;
  const t = [];
  for (const [i, o] of _) {
    if (!o) continue;
    const p = It(i, o.route);
    p && (i !== "__primary__" && p.hasAttribute("data-ln-route-keep") && Pt.get(p) === o.route.templateNode || t.push({ regionKey: i, match: o, targetEl: p }));
  }
  d.historyAction === "push" ? window.history.pushState(null, "", h) : d.historyAction === "replace" && window.history.replaceState(null, "", h);
  const e = function() {
    for (const { regionKey: i, match: o, targetEl: p } of t) {
      if (!(d.isHydration && p.hasAttribute("data-ln-router-hydrate") && p.children.length > 0)) {
        ye(p);
        const f = o.route.templateNode.content.cloneNode(!0);
        p.replaceChildren(f);
      }
      if (Pt.set(p, o.route.templateNode), i === "__primary__" && (o.route.title && (document.title = o.route.title), !d.isHydration)) {
        p.hasAttribute("tabindex") || p.setAttribute("tabindex", "-1");
        const f = p.querySelector("h1, h2, h3, h4, h5, h6");
        f ? (f.setAttribute("tabindex", "-1"), f.focus()) : p.focus(), p.scrollIntoView({ block: "start", behavior: "instant" });
      }
      Ut(p, "ln-router:navigated", {
        path: h,
        params: o.params,
        query: v,
        route: o.route,
        target: p,
        region: i
      });
    }
    l && (xt = h, ie = l.params, oe = v, Dt = l.route), ne = new Map(
      Array.from(_.entries()).map(([i, o]) => [i, o ? { route: o.route, params: o.params } : null])
    );
  };
  document.startViewTransition && !d.isHydration ? document.startViewTransition(e) : e();
}
function ve(h) {
  const d = h.target.closest("a");
  if (!d || !$t(h, d)) return;
  const E = d.getAttribute("href"), { path: v } = At(E), _ = ot.get("__primary__");
  if (!_) return;
  se(v, _.sorted) && (h.preventDefault(), gt(E, { historyAction: "push" }));
}
function Ee(h, d) {
  const E = Object.keys(h), v = Object.keys(d);
  if (E.length !== v.length) return !1;
  for (let _ = 0; _ < E.length; _++) {
    const m = E[_];
    if (h[m] !== d[m]) return !1;
  }
  return !0;
}
function Ae() {
  const h = window.location.pathname + window.location.search, d = te.current();
  if (d && d.path != null) {
    const E = At(h);
    if (At(d.path).path === E.path && Ee(d.query, E.query))
      return;
  }
  gt(h, { historyAction: "skip" });
}
function we() {
  Ht || (Ht = !0, J(function() {
    document.addEventListener("click", ve), window.addEventListener("popstate", Ae), qt = !0;
    const h = window.location.pathname + window.location.search + window.location.hash;
    gt(h, { historyAction: "replace", isHydration: !0 }), qt = !1;
  }, "ln-router"));
}
function Se(h) {
  const d = h.getAttribute(Mt);
  if (!d) return;
  const E = h.getAttribute("data-ln-route-target") || null;
  if (E === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${d}" rejected.`);
    return;
  }
  const v = E || "__primary__";
  ot.has(v) || ot.set(v, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const _ = ot.get(v);
  if (_.routes.has(d)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${d}" in region "${v}"`);
    return;
  }
  const m = h.getAttribute("data-ln-route-title"), l = d.split("/").filter(Boolean), s = {
    pattern: d,
    segments: l,
    target: E,
    title: m,
    templateNode: h
  }, t = It(v, s);
  t && t.contains(h) && console.warn(`[ln-router] Route template with pattern "${d}" is declared inside its own outlet element:`, h), _.routes.set(d, s), _.sorted = Array.from(_.routes.values()).sort(re);
}
function Le(h) {
  const d = h.getAttribute(Mt);
  if (!d) return;
  const v = h.getAttribute("data-ln-route-target") || null || "__primary__", _ = ot.get(v);
  _ && (_.routes.delete(d), _.sorted = Array.from(_.routes.values()).sort(re), _.routes.size === 0 && ot.delete(v));
}
function ae(h) {
  return this.dom = h, Se(h), this;
}
ae.prototype.destroy = function() {
  Le(this.dom), delete this.dom[ee];
};
H(Mt, ee, ae, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    ot.size > 0 && we();
  }
});
(function() {
  const h = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0) return;
  function E(_) {
    this.dom = _, this.isOpen = _.getAttribute(h) === "open";
    const m = this;
    return this._hashNs = _.id || null, this._onHashChange = function() {
      if (!m._hashNs) return;
      const l = at(m._hashNs) !== null;
      l && !m.isOpen ? m.dom.setAttribute(h, "open") : !l && m.isOpen && m.dom.setAttribute(h, "close");
    }, this._onEscape = function(l) {
      l.key === "Escape" && m.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(l) {
      if (l.key !== "Tab") return;
      const s = Array.prototype.filter.call(
        m.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        mt
      );
      if (s.length === 0) return;
      const t = s[0], e = s[s.length - 1];
      l.shiftKey ? document.activeElement === t && (l.preventDefault(), e.focus()) : document.activeElement === e && (l.preventDefault(), t.focus());
    }, this._onAjaxSuccess = function() {
      m.isOpen && m.dom.setAttribute(h, "close");
    }, this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this._hashNs && (window.addEventListener("hashchange", this._onHashChange), at(this._hashNs) !== null && !this.isOpen && this.dom.setAttribute(h, "open")), this.dom.addEventListener("ln-ajax:success", this._onAjaxSuccess), this;
  }
  E.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("ln-ajax:success", this._onAjaxSuccess), this.isOpen) {
        this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null;
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + h + '="open"]'),
          function(l) {
            return l !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      this._hashNs && window.removeEventListener("hashchange", this._onHashChange), L(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[d];
    }
  };
  function v(_) {
    const m = _[d];
    if (!m) return;
    const s = _.getAttribute(h) === "open";
    if (s !== m.isOpen)
      if (s) {
        if (V(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
          m._hashNs && dt(m._hashNs, null), _.setAttribute(h, "close");
          return;
        }
        m.isOpen = !0, _.setAttribute("aria-modal", "true"), _.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", m._onEscape), document.addEventListener("keydown", m._onFocusTrap);
        const e = document.activeElement;
        m._returnFocusEl = e && e !== document.body ? e : null;
        const i = _.querySelector("[autofocus]");
        if (i && mt(i))
          i.focus();
        else {
          const o = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), p = Array.prototype.find.call(o, mt);
          if (p) p.focus();
          else {
            const c = _.querySelectorAll("a[href], button:not([disabled])"), f = Array.prototype.find.call(c, mt);
            f && f.focus();
          }
        }
        if (m._hashNs) {
          at(m._hashNs) === null && dt(m._hashNs, "");
          const o = at(m._hashNs), p = o || null;
          _.dataset.lnModalMode = p ? "edit" : "new", L(_, "ln-modal:open", { modalId: _.id, target: _, hashNs: m._hashNs, param: p });
        } else
          L(_, "ln-modal:open", { modalId: _.id, target: _ });
      } else {
        if (V(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
          _.setAttribute(h, "open");
          return;
        }
        m.isOpen = !1, _.removeAttribute("aria-modal"), document.removeEventListener("keydown", m._onEscape), document.removeEventListener("keydown", m._onFocusTrap), L(_, "ln-modal:close", { modalId: _.id, target: _ }), m._hashNs && dt(m._hashNs, null), m._returnFocusEl && document.contains(m._returnFocusEl) && typeof m._returnFocusEl.focus == "function" && m._returnFocusEl.focus(), m._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const m = _.target.closest("[data-ln-modal-for]");
    if (m) {
      const t = m.getAttribute("data-ln-modal-for"), e = document.getElementById(t);
      if (e && e[d]) {
        _.preventDefault();
        const i = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, o = {}, p = m.dataset;
        for (const r in p) {
          if (!r.startsWith("lnModal") || i[r]) continue;
          const u = r.slice(7);
          u && (o[u.charAt(0).toLowerCase() + u.slice(1)] = p[r]);
        }
        const c = Object.keys(o).length > 0;
        if (c)
          window.lnCore.fill(e, o);
        else {
          const r = e.querySelectorAll("[data-ln-field]");
          for (let u = 0; u < r.length; u++)
            r[u].textContent = "";
        }
        m.hasAttribute("data-ln-modal-mode") ? e.dataset.lnModalMode = m.getAttribute("data-ln-modal-mode") : e.dataset.lnModalMode = c ? "edit" : "new";
        const f = e.getAttribute(h);
        e.setAttribute(h, f === "open" ? "close" : "open");
      }
      return;
    }
    const l = _.target.closest('a[href^="#"]');
    if (l) {
      const t = St(l.getAttribute("href"));
      for (const e in t) {
        const i = document.getElementById(e);
        if (i && i[d]) {
          if (!Rt(_)) return;
          dt(e, t[e]);
          return;
        }
      }
    }
    const s = _.target.closest("[data-ln-modal-close]");
    if (s) {
      const t = s.closest("[" + h + "]");
      t && t[d] && (_.preventDefault(), t.setAttribute(h, "close"));
    }
  }), H(h, d, E, "ln-modal", {
    onAttributeChange: v
  });
})();
(function() {
  const h = "data-ln-number", d = "lnNumber";
  if (window[d] !== void 0) return;
  const E = {}, v = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(t) {
    if (!E[t]) {
      const e = new Intl.NumberFormat(t, { useGrouping: !0 }), i = e.formatToParts(1234.5);
      let o = "", p = ".";
      for (let c = 0; c < i.length; c++)
        i[c].type === "group" && (o = i[c].value), i[c].type === "decimal" && (p = i[c].value);
      E[t] = { fmt: e, groupSep: o, decimalSep: p };
    }
    return E[t];
  }
  function m(t, e, i) {
    if (i !== null) {
      const o = parseInt(i, 10), p = t + "|d" + o;
      return E[p] || (E[p] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: o })), E[p].format(e);
    }
    return _(t).fmt.format(e);
  }
  function l(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[d]) return t[d];
    t[d] = this, this.dom = t;
    const e = document.createElement("input");
    e.type = "hidden", e.name = t.name, t.removeAttribute("name"), t.hasAttribute("data-ln-fill-as") && e.setAttribute("data-ln-fill-as", t.getAttribute("data-ln-fill-as")), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", e), this._hidden = e;
    const i = this;
    Object.defineProperty(e, "value", {
      get: function() {
        return v.get.call(e);
      },
      set: function(p) {
        v.set.call(e, p), p !== "" && !isNaN(parseFloat(p)) ? i._setDisplayRaw(m($(i.dom), parseFloat(p), i.dom.getAttribute("data-ln-number-decimals"))) : i._setDisplayRaw(""), i.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Wt(t, v, {
      get: function() {
        return v.get.call(t);
      },
      set: function(p) {
        if (p === "") {
          i._setDisplayRaw(""), i._setHiddenRaw(""), t.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const c = typeof p == "number" ? p : parseFloat(String(p).replace(/[^\d.-]/g, ""));
        isNaN(c) ? (i._setDisplayRaw(String(p)), i._setHiddenRaw("")) : (i._setHiddenRaw(c), i._setDisplayRaw(m($(t), c, t.getAttribute("data-ln-number-decimals")))), t.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      i._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(p) {
      p.preventDefault();
      const c = (p.clipboardData || window.clipboardData).getData("text"), f = _($(t)), r = f.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let u = c.replace(new RegExp("[^0-9\\-" + r + ".]", "g"), "");
      f.groupSep && (u = u.split(f.groupSep).join("")), f.decimalSep !== "." && (u = u.replace(f.decimalSep, "."));
      const a = parseFloat(u);
      i.value = isNaN(a) ? NaN : a;
    }, t.addEventListener("paste", this._onPaste);
    const o = t.value;
    if (o !== "") {
      const p = parseFloat(o);
      isNaN(p) || (this._setHiddenRaw(p), this._setDisplayRaw(m($(t), p, t.getAttribute("data-ln-number-decimals"))), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  l.prototype._handleInput = function() {
    const t = this.dom, e = _($(t)), i = v.get.call(t);
    if (i === "") {
      this._setHiddenRaw(""), L(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (i === "-") {
      this._setHiddenRaw("");
      return;
    }
    const o = t.selectionStart;
    let p = 0;
    for (let A = 0; A < o; A++)
      /[0-9]/.test(i[A]) && p++;
    let c = i;
    if (e.groupSep && (c = c.split(e.groupSep).join("")), c = c.replace(e.decimalSep, "."), i.endsWith(e.decimalSep) || i.endsWith(".")) {
      const A = c.replace(/\.$/, ""), w = parseFloat(A);
      isNaN(w) || this._setHiddenRaw(w);
      return;
    }
    const f = c.indexOf(".");
    if (f !== -1 && c.slice(f + 1).endsWith("0")) {
      const w = parseFloat(c);
      isNaN(w) || this._setHiddenRaw(w);
      return;
    }
    const r = t.getAttribute("data-ln-number-decimals");
    if (r !== null && f !== -1) {
      const A = parseInt(r, 10);
      c.slice(f + 1).length > A && (c = c.slice(0, f + 1 + A));
    }
    const u = parseFloat(c);
    if (isNaN(u)) return;
    const a = t.getAttribute("data-ln-number-min"), n = t.getAttribute("data-ln-number-max");
    if (a !== null && u < parseFloat(a) || n !== null && u > parseFloat(n)) return;
    let y;
    if (r !== null)
      y = m($(t), u, r);
    else {
      const A = f !== -1 ? c.slice(f + 1).length : 0;
      if (A > 0) {
        const w = $(t) + "|u" + A;
        E[w] || (E[w] = new Intl.NumberFormat($(t), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), y = E[w].format(u);
      } else
        y = e.fmt.format(u);
    }
    this._setDisplayRaw(y);
    let g = p, b = 0;
    for (let A = 0; A < y.length && g > 0; A++)
      b = A + 1, /[0-9]/.test(y[A]) && g--;
    g > 0 && (b = y.length), t.setSelectionRange(b, b), this._setHiddenRaw(u), L(t, "ln-number:input", { value: u, formatted: y });
  }, l.prototype._setHiddenRaw = function(t) {
    v.set.call(this._hidden, String(t));
  }, l.prototype._setDisplayRaw = function(t) {
    v.set.call(this.dom, String(t));
  }, l.prototype._displayFormatted = function(t) {
    this._setDisplayRaw(m($(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(l.prototype, "value", {
    get: function() {
      const t = v.get.call(this._hidden);
      return t === "" ? NaN : parseFloat(t);
    },
    set: function(t) {
      if (typeof t != "number" || isNaN(t)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(t), this._setDisplayRaw(m($(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(l.prototype, "formatted", {
    get: function() {
      return v.get.call(this.dom);
    }
  }), l.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), L(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function s() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let e = 0; e < t.length; e++) {
        const i = t[e][d];
        i && !isNaN(i.value) && i._displayFormatted(i.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  H(h, d, l, "ln-number"), s();
})();
(function() {
  const h = "data-ln-date", d = "lnDate";
  if (window[d] !== void 0) return;
  const E = {}, v = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(n, y) {
    const g = n + "|" + JSON.stringify(y);
    return E[g] || (E[g] = new Intl.DateTimeFormat(n, y)), E[g];
  }
  const m = /^(short|medium|long)(\s+datetime)?$/, l = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(n) {
    return !n || n === "" ? { dateStyle: "medium" } : n.match(m) ? l[n] : null;
  }
  function t(n, y, g) {
    const b = n.getDate(), A = n.getMonth(), w = n.getFullYear(), T = n.getHours(), C = n.getMinutes();
    let x, I;
    const R = _t(g), P = (g || "").toLowerCase().split("-")[0], j = _(g, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], W = R && j !== P;
    W && R.monthsLong ? x = R.monthsLong[A] : x = _(g, { month: "long" }).format(n), W && R.monthsShort ? I = R.monthsShort[A] : I = _(g, { month: "short" }).format(n);
    const tt = {
      yyyy: String(w),
      yy: String(w).slice(-2),
      MMMM: x,
      MMM: I,
      MM: String(A + 1).padStart(2, "0"),
      M: String(A + 1),
      dd: String(b).padStart(2, "0"),
      d: String(b),
      HH: String(T).padStart(2, "0"),
      mm: String(C).padStart(2, "0")
    };
    return y.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(Q) {
      return tt[Q];
    });
  }
  function e(n, y, g) {
    const b = s(y);
    if (b) {
      const A = _(g, b), w = (g || "").toLowerCase().split("-")[0], T = A.resolvedOptions().locale.toLowerCase().split("-")[0];
      return _t(g) && T !== w ? t(n, "dd.MM.yyyy", g) : A.format(n);
    }
    return t(n, y, g);
  }
  function i(n) {
    if (!n) return "";
    const y = n.getFullYear(), g = String(n.getMonth() + 1).padStart(2, "0"), b = String(n.getDate()).padStart(2, "0");
    return y + "-" + g + "-" + b;
  }
  function o(n, y, g) {
    L(n.dom, "ln-date:change", {
      value: y,
      formatted: n.dom.value,
      date: g
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function p(n, y, g, b) {
    n._setHiddenRaw(y), v.set.call(n._picker, y), n._lastISO = y, b !== void 0 ? (n._isFormatting = !0, n.dom.value = b, n._isFormatting = !1) : g && n._displayFormatted(g), o(n, y, g);
  }
  function c(n) {
    n._setHiddenRaw(""), v.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", o(n, "", null);
  }
  function f(n) {
    if (n.tagName !== "INPUT")
      return this;
    if (n[d]) return n[d];
    n[d] = this, this.dom = n;
    const y = this, g = n.value, b = n.name, w = (n.closest(".form-element, form") || n.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let R = 0; R < w.length; R++) {
      const P = w[R].getAttribute("data-ln-date-dict");
      if (P) {
        const B = Kt(w[R], "data-ln-date-dict-key");
        B["months-long"] && (B.monthsLong = B["months-long"].split(",").map((j) => j.trim())), B["months-short"] && (B.monthsShort = B["months-short"].split(",").map((j) => j.trim())), Ot(P, B);
      }
    }
    const T = document.createElement("span");
    T.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(T, n), T.appendChild(n), this._wrapper = T;
    const C = document.createElement("input");
    C.type = "hidden", C.name = b, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && C.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", C), this._hidden = C;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", C.insertAdjacentElement("afterend", x), this._picker = x, n.type = "text";
    const I = document.createElement("button");
    if (I.type = "button", I.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), I.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', x.insertAdjacentElement("afterend", I), this._btn = I, this._lastISO = "", Object.defineProperty(C, "value", {
      get: function() {
        return v.get.call(C);
      },
      set: function(R) {
        if (v.set.call(C, R), R && R !== "") {
          const P = r(R);
          P && p(y, R, P);
        } else R === "" && c(y);
      }
    }), Wt(n, v, {
      get: function() {
        return v.get.call(n);
      },
      set: function(R, P) {
        if (y._isFormatting) {
          P(R);
          return;
        }
        if (!R || R === "") {
          P(""), c(y);
          return;
        }
        const B = r(R) || u(R);
        if (B) {
          const j = i(B), W = n.getAttribute(h) || "", tt = $(n), Q = e(B, W, tt);
          P(Q), p(y, j, B, Q);
        } else
          P(String(R)), c(y);
      }
    }), this._onPickerChange = function() {
      const R = x.value;
      if (R) {
        const P = r(R);
        P && p(y, R, P);
      } else
        c(y);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const R = y.dom.value.trim();
      if (R === "") {
        y._lastISO !== "" && c(y);
        return;
      }
      if (y._lastISO) {
        const B = r(y._lastISO);
        if (B) {
          const j = y.dom.getAttribute(h) || "", W = $(y.dom);
          if (R === e(B, j, W)) return;
        }
      }
      const P = u(R);
      if (P) {
        const B = i(P);
        p(y, B, P);
      } else if (y._lastISO) {
        const B = r(y._lastISO);
        B && y._displayFormatted(B);
      } else
        y.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      y._openPicker();
    }, I.addEventListener("click", this._onBtnClick), g && g !== "") {
      const R = r(g);
      R && p(y, g, R);
    }
    return this;
  }
  function r(n) {
    if (!n || typeof n != "string") return null;
    const y = n.split("T"), g = y[0].split("-");
    if (g.length < 3) return null;
    const b = parseInt(g[0], 10), A = parseInt(g[1], 10) - 1, w = parseInt(g[2], 10);
    if (isNaN(b) || isNaN(A) || isNaN(w)) return null;
    let T = 0, C = 0;
    if (y[1]) {
      const I = y[1].split(":");
      T = parseInt(I[0], 10) || 0, C = parseInt(I[1], 10) || 0;
    }
    const x = new Date(b, A, w, T, C);
    return x.getFullYear() !== b || x.getMonth() !== A || x.getDate() !== w ? null : x;
  }
  function u(n) {
    if (!n || typeof n != "string" || (n = n.trim(), n.length < 6)) return null;
    let y, g;
    if (n.indexOf(".") !== -1)
      y = ".", g = n.split(".");
    else if (n.indexOf("/") !== -1)
      y = "/", g = n.split("/");
    else if (n.indexOf("-") !== -1)
      y = "-", g = n.split("-");
    else
      return null;
    if (g.length !== 3) return null;
    const b = [];
    for (let x = 0; x < 3; x++) {
      const I = parseInt(g[x], 10);
      if (isNaN(I)) return null;
      b.push(I);
    }
    let A, w, T;
    y === "." ? (A = b[0], w = b[1], T = b[2]) : y === "/" ? (w = b[0], A = b[1], T = b[2]) : g[0].length === 4 ? (T = b[0], w = b[1], A = b[2]) : (A = b[0], w = b[1], T = b[2]), T < 100 && (T += T < 50 ? 2e3 : 1900);
    const C = new Date(T, w - 1, A);
    return C.getFullYear() !== T || C.getMonth() !== w - 1 || C.getDate() !== A ? null : C;
  }
  f.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, f.prototype._setHiddenRaw = function(n) {
    v.set.call(this._hidden, n);
  }, f.prototype._displayFormatted = function(n) {
    const y = this.dom.getAttribute(h) || "", g = $(this.dom);
    this._isFormatting = !0, this.dom.value = e(n, y, g), this._isFormatting = !1;
  }, Object.defineProperty(f.prototype, "value", {
    get: function() {
      return v.get.call(this._hidden);
    },
    set: function(n) {
      if (!n || n === "") {
        c(this);
        return;
      }
      const y = r(n);
      y && p(this, n, y);
    }
  }), Object.defineProperty(f.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? r(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = i(n);
    }
  }), Object.defineProperty(f.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), f.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), L(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function a() {
    new MutationObserver(function() {
      const n = document.querySelectorAll("[" + h + "]");
      for (let y = 0; y < n.length; y++) {
        const g = n[y][d];
        if (g && g.value) {
          const b = r(g.value);
          b && g._displayFormatted(b);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  H(h, d, f, "ln-date"), a();
})();
(function() {
  const h = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0) return;
  const E = [];
  if (!history._lnNavPatched) {
    const l = history.pushState;
    history.pushState = function() {
      l.apply(history, arguments);
      for (const s of E)
        s();
    }, history._lnNavPatched = !0;
  }
  function v(l) {
    return this.dom = l, this.activeClass = l.getAttribute(h) || "active", this.exact = l.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), E.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(l, { childList: !0, subtree: !0 }), this.update(), this;
  }
  v.prototype.update = function() {
    if (!this.activeClass || V(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), t = window.location.pathname, e = _(t);
    for (const i of s) {
      const o = i.getAttribute("href");
      if (!o || o === "#" || o.startsWith("#") || o.startsWith("javascript:") || o.startsWith("mailto:") || o.startsWith("tel:")) {
        i.classList.remove(this.activeClass), i.removeAttribute("aria-current");
        continue;
      }
      if (i.hostname && i.hostname !== window.location.hostname) {
        i.classList.remove(this.activeClass), i.removeAttribute("aria-current");
        continue;
      }
      const p = _(o), c = p === e, f = !this.exact && p !== "/" && e.startsWith(p + "/");
      c || f ? (i.classList.add(this.activeClass), i.setAttribute("aria-current", "page")) : (i.classList.remove(this.activeClass), i.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom });
  }, v.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const l = E.indexOf(this.updateHandler);
    l !== -1 && E.splice(l, 1), L(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function _(l) {
    try {
      return new URL(l, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return l.replace(/\/$/, "") || "/";
    }
  }
  function m(l, s) {
    const t = l[d];
    if (t) {
      if (s === h) {
        if (!l.hasAttribute(h)) {
          t.destroy();
          return;
        }
        const e = t.activeClass, i = l.getAttribute(h) || "active";
        if (e !== i) {
          const o = l.querySelectorAll("a");
          for (const p of o)
            e && p.classList.remove(e);
          t.activeClass = i;
        }
      } else s === "data-ln-nav-exact" && (t.exact = l.hasAttribute("data-ln-nav-exact"));
      t.update();
    }
  }
  H(h, d, v, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: m
  });
})();
(function() {
  const h = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function E(m, l) {
    const s = (m.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (s) return s;
    if (m.tagName !== "A") return "";
    const t = m.getAttribute("href") || "";
    if (!t.startsWith("#")) return "";
    const e = t.slice(1);
    if (!e) return "";
    const i = e.split("&");
    if (l)
      for (const c of i) {
        const f = c.indexOf(":");
        if (f > 0 && c.slice(0, f).toLowerCase().trim() === l)
          return c.slice(f + 1).toLowerCase().trim();
      }
    const o = i[i.length - 1] || "", p = o.indexOf(":");
    return (p > 0 ? o.slice(p + 1) : o).toLowerCase().trim();
  }
  function v(m) {
    return this.dom = m, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const m = this.tabs.filter((t) => t.tagName === "A" && (t.getAttribute("href") || "").startsWith("#")), l = m.length > 0 && m.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = l && !!this.nsKey, m.length > 0 && m.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : l && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const t of this.tabs) {
      const e = E(t, this.nsKey);
      e ? this.mapTabs[e] = t : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', t);
    }
    for (const t of this.panels) {
      const e = (t.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      e && (this.mapPanels[e] = t);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const t of this.tabs) {
      if (t[d + "Trigger"]) continue;
      const e = function(i) {
        const o = t.tagName === "A";
        if (!o && (i.ctrlKey || i.metaKey || i.button === 1)) return;
        const p = E(t, s.nsKey);
        p && (o && !Rt(i) || (s.hashEnabled ? at(s.nsKey) === p ? s.dom.setAttribute("data-ln-tabs-active", p) : dt(s.nsKey, p) : s.dom.setAttribute("data-ln-tabs-active", p)));
      };
      t.addEventListener("click", e), t[d + "Trigger"] = e, s._clickHandlers.push({ el: t, handler: e });
    }
    if (this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const t = at(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", t !== null ? t : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let t = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const e = wt("tabs", this.dom);
        e !== null && e in this.mapPanels && (t = e);
      }
      this.dom.setAttribute("data-ln-tabs-active", t);
    }
  }
  v.prototype._applyActive = function(m) {
    var l;
    (!m || !(m in this.mapPanels)) && (m = this.defaultKey);
    for (const s in this.mapTabs) {
      const t = this.mapTabs[s];
      s === m ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const s in this.mapPanels) {
      const t = this.mapPanels[s], e = s === m;
      t.classList.toggle("hidden", !e), t.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const s = (l = this.mapPanels[m]) == null ? void 0 : l.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      s && setTimeout(() => s.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", { key: m, tab: this.mapTabs[m], panel: this.mapPanels[m] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && ct("tabs", this.dom, m);
  }, v.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const { el: m, handler: l } of this._clickHandlers)
        m.removeEventListener("click", l), delete m[d + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), L(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[d];
    }
  }, H(h, d, v, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(m) {
      const l = m.getAttribute("data-ln-tabs-active");
      m[d]._applyActive(l);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
  function E(m, l) {
    const s = document.querySelectorAll(
      '[data-ln-toggle-for="' + m.id + '"]'
    );
    for (const t of s)
      t.setAttribute("aria-expanded", l ? "true" : "false");
  }
  function v(m) {
    if (this.dom = m, m.hasAttribute("data-ln-persist")) {
      const l = wt("toggle", m);
      l !== null && m.setAttribute(h, l);
    }
    return this.isOpen = m.getAttribute(h) === "open", this.isOpen && m.classList.add("open"), E(m, this.isOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[d] && (L(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function _(m) {
    const l = m[d];
    if (!l) return;
    const t = m.getAttribute(h) === "open";
    if (t !== l.isOpen)
      if (t) {
        if (V(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(h, "close");
          return;
        }
        l.isOpen = !0, m.classList.add("open"), E(m, !0), L(m, "ln-toggle:open", { target: m }), m.hasAttribute("data-ln-persist") && ct("toggle", m, "open");
      } else {
        if (V(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(h, "open");
          return;
        }
        l.isOpen = !1, m.classList.remove("open"), E(m, !1), L(m, "ln-toggle:close", { target: m }), m.hasAttribute("data-ln-persist") && ct("toggle", m, "close");
      }
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const l = m.target.closest("[data-ln-toggle-for]");
    if (l) {
      const s = l.getAttribute("data-ln-toggle-for"), t = document.getElementById(s);
      if (t && t[d]) {
        m.preventDefault();
        const e = l.getAttribute("data-ln-toggle-action") || "toggle";
        if (e === "open")
          t.setAttribute(h, "open");
        else if (e === "close")
          t.setAttribute(h, "close");
        else if (e === "toggle") {
          const i = t.getAttribute(h);
          t.setAttribute(h, i === "open" ? "close" : "open");
        }
      }
    }
  }), H(h, d, v, "ln-toggle", {
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
  function E(v) {
    return this.dom = v, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== v) return;
      const m = v.querySelectorAll("[data-ln-toggle]");
      for (const l of m)
        l !== _.detail.target && l.closest("[data-ln-accordion]") === v && l.getAttribute("data-ln-toggle") === "open" && l.setAttribute("data-ln-toggle", "close");
      L(v, "ln-accordion:change", { target: _.detail.target });
    }, v.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), L(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[d]);
  }, H(h, d, E, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", d = "lnDropdown";
  if (window[d] !== void 0) return;
  function E(v) {
    if (this.dom = v, this.toggleEl = v.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = v.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const m of this.toggleEl.children)
        m.setAttribute("role", "menuitem");
    const _ = this;
    return this._onToggleOpen = function(m) {
      !m.detail || m.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "true"), _._teleportRestore = Zt(_.toggleEl), _.toggleEl.style.position = "fixed", _.toggleEl.style.right = "auto", _._reposition(), _._addOutsideClickListener(), _._addScrollRepositionListener(), _._addResizeCloseListener(), L(v, "ln-dropdown:open", { target: m.detail.target }));
    }, this._onToggleClose = function(m) {
      !m.detail || m.detail.target !== _.toggleEl || (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "false"), _._removeOutsideClickListener(), _._removeScrollRepositionListener(), _._removeResizeCloseListener(), _.toggleEl.style.position = "", _.toggleEl.style.top = "", _.toggleEl.style.left = "", _.toggleEl.style.right = "", _.toggleEl.style.transform = "", _.toggleEl.style.margin = "", _._teleportRestore && (_._teleportRestore(), _._teleportRestore = null), L(v, "ln-dropdown:close", { target: m.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  E.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const v = this.triggerBtn.getBoundingClientRect(), _ = kt(this.toggleEl), m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, l = Et(v, _, "bottom-end", m);
    this.toggleEl.style.top = l.top + "px", this.toggleEl.style.left = l.left + "px";
  }, E.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const v = this;
    this._boundDocClick = function(_) {
      v.dom.contains(_.target) || v.toggleEl && v.toggleEl.contains(_.target) || v.toggleEl && v.toggleEl.getAttribute("data-ln-toggle") === "open" && v.toggleEl.setAttribute("data-ln-toggle", "close");
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
    this.dom[d] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), L(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[d]);
  }, H(h, d, E, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", d = "lnPopover", E = "data-ln-popover-for", v = "data-ln-popover-position";
  if (window[d] !== void 0) return;
  const _ = [];
  let m = null;
  function l() {
    m || (m = function(i) {
      if (i.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", m));
  }
  function s() {
    _.length > 0 || m && (document.removeEventListener("keydown", m), m = null);
  }
  function t(i) {
    return this.dom = i, this.isOpen = i.getAttribute(h) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, i.hasAttribute("tabindex") || i.setAttribute("tabindex", "-1"), i.hasAttribute("role") || i.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  t.prototype.open = function(i) {
    this.isOpen || (this.trigger = i || null, this.dom.setAttribute(h, "open"));
  }, t.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, t.prototype.toggle = function(i) {
    this.isOpen ? this.close() : this.open(i);
  }, t.prototype._applyOpen = function(i) {
    this.isOpen = !0, i && (this.trigger = i), this._previousFocus = document.activeElement, this._teleportRestore = Zt(this.dom);
    const o = kt(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), u = this.dom.getAttribute(v) || "bottom", a = Et(r, o, u, 8);
      this.dom.style.top = a.top + "px", this.dom.style.left = a.left + "px", this.dom.setAttribute("data-ln-popover-placement", a.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const p = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), c = Array.prototype.find.call(p, mt);
    c ? c.focus() : this.dom.focus();
    const f = this;
    this._boundDocClick = function(r) {
      f.dom.contains(r.target) || f.trigger && f.trigger.contains(r.target) || f.close();
    }, f._docClickTimeout = setTimeout(function() {
      f._docClickTimeout = null, document.addEventListener("click", f._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!f.trigger) return;
      const r = f.trigger.getBoundingClientRect(), u = kt(f.dom), a = f.dom.getAttribute(v) || "bottom", n = Et(r, u, a, 8);
      f.dom.style.top = n.top + "px", f.dom.style.left = n.left + "px", f.dom.setAttribute("data-ln-popover-placement", n.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), l(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const i = _.indexOf(this);
    i !== -1 && _.splice(i, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[d] && (this.isOpen && this._applyClose(), delete this.dom[d], L(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function e(i) {
    this.dom = i;
    const o = i.getAttribute(E);
    return i.setAttribute("aria-haspopup", "dialog"), i.setAttribute("aria-expanded", "false"), i.setAttribute("aria-controls", o), this._onClick = function(p) {
      if (p.ctrlKey || p.metaKey || p.button === 1) return;
      p.preventDefault();
      const c = document.getElementById(o);
      !c || !c[d] || c[d].toggle(i);
    }, i.addEventListener("click", this._onClick), this;
  }
  e.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[d + "Trigger"];
  }, H(h, d, t, "ln-popover", {
    onAttributeChange: function(i) {
      const o = i[d];
      if (!o) return;
      const c = i.getAttribute(h) === "open";
      if (c !== o.isOpen)
        if (c) {
          if (V(i, "ln-popover:before-open", {
            popoverId: i.id,
            target: i,
            trigger: o.trigger
          }).defaultPrevented) {
            i.setAttribute(h, "closed");
            return;
          }
          o._applyOpen(o.trigger);
        } else {
          if (V(i, "ln-popover:before-close", {
            popoverId: i.id,
            target: i,
            trigger: o.trigger
          }).defaultPrevented) {
            i.setAttribute(h, "open");
            return;
          }
          o._applyClose();
        }
    }
  }), H(E, d + "Trigger", e, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", d = "data-ln-tooltip", E = "data-ln-tooltip-position", v = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[v] !== void 0) return;
  let m = 0, l = null, s = null, t = null, e = null, i = null, o = null;
  function p() {
    return l && l.parentNode || (l = document.getElementById(_), l || (l = document.createElement("div"), l.id = _, document.body.appendChild(l))), l;
  }
  function c() {
    o || (o = function(n) {
      n.key === "Escape" && u();
    }, document.addEventListener("keydown", o));
  }
  function f() {
    o && (document.removeEventListener("keydown", o), o = null);
  }
  function r(n) {
    if (t === n) return;
    u();
    const y = n.getAttribute(d) || n.getAttribute("title");
    if (!y) return;
    p(), n.hasAttribute("title") && (e = n.getAttribute("title"), n.removeAttribute("title"));
    const g = n.getAttribute("aria-describedby");
    g ? i = g : i = null;
    const b = document.createElement("div");
    b.className = "ln-tooltip", b.textContent = y, n[v + "Uid"] || (m += 1, n[v + "Uid"] = "ln-tooltip-" + m), b.id = n[v + "Uid"], l.appendChild(b);
    const A = b.offsetWidth, w = b.offsetHeight, T = n.getBoundingClientRect(), C = n.getAttribute(E) || "top", x = Et(T, { width: A, height: w }, C, 6);
    b.style.top = x.top + "px", b.style.left = x.left + "px", b.setAttribute("data-ln-tooltip-placement", x.placement), i ? n.setAttribute("aria-describedby", i + " " + b.id) : n.setAttribute("aria-describedby", b.id), s = b, t = n, c();
  }
  function u() {
    if (!s) {
      f();
      return;
    }
    t && (i !== null ? t.setAttribute("aria-describedby", i) : t.removeAttribute("aria-describedby"), i = null, e !== null && t.setAttribute("title", e)), e = null, s.parentNode && s.parentNode.removeChild(s), s = null, t = null, f();
  }
  function a(n) {
    return this.dom = n, n.hasAttribute("data-ln-tooltip-enhanced") || (n.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(n);
    }, this._onLeave = function() {
      t === n && !n.contains(document.activeElement) && u();
    }, this._onFocus = function() {
      r(n);
    }, this._onBlur = function() {
      t === n && !n.matches(":hover") && u();
    }, n.addEventListener("mouseenter", this._onEnter), n.addEventListener("mouseleave", this._onLeave), n.addEventListener("focus", this._onFocus, !0), n.addEventListener("blur", this._onBlur, !0), this;
  }
  a.prototype.destroy = function() {
    const n = this.dom;
    n.removeEventListener("mouseenter", this._onEnter), n.removeEventListener("mouseleave", this._onLeave), n.removeEventListener("focus", this._onFocus, !0), n.removeEventListener("blur", this._onBlur, !0), t === n && u(), this._addedEnhancedAttr && n.removeAttribute("data-ln-tooltip-enhanced"), delete n[v], delete n[v + "Uid"], L(n, "ln-tooltip:destroyed", { trigger: n });
  }, H(
    "[" + h + "], [data-ln-tooltip-enhanced], [" + d + "][title]",
    v,
    a,
    "ln-tooltip"
  );
})();
(function() {
  const h = "data-ln-toast", d = "lnToast", E = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function v(c) {
    if (!c || c.nodeType !== 1) return;
    const f = Array.from(c.querySelectorAll("[" + h + "]"));
    c.hasAttribute && c.hasAttribute(h) && f.push(c);
    for (const r of f)
      r[d] || new _(r);
  }
  function _(c) {
    this.dom = c, c[d] = this, this.timeoutDefault = parseInt(c.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(c.getAttribute("data-ln-toast-max") || "5", 10);
    const f = Array.from(c.querySelectorAll("[data-ln-toast-item]"));
    for (; f.length > this.max; ) c.removeChild(f.shift());
    for (const r of f) i(r, this);
    return this;
  }
  _.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const c of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        t(c);
      delete this.dom[d];
    }
  };
  function m(c, f) {
    const r = ((c.type || "") + "").trim().toLowerCase(), u = lt(f, E, "ln-toast");
    if (!u)
      return console.warn('[ln-toast] Template "' + E + '" not found'), null;
    X(u, {
      type: r,
      title: c.title,
      message: typeof c.message == "string" ? c.message : void 0
    });
    const a = u.firstElementChild;
    if (!a) return null;
    a.hasAttribute("data-ln-toast-item") || a.setAttribute("data-ln-toast-item", ""), a.classList.add("ln-enter");
    const n = a.querySelector(".body");
    n && l(n, c);
    const y = a.querySelector("[data-ln-toast-close]");
    return y && y.addEventListener("click", function() {
      t(a);
    }), a;
  }
  function l(c, f) {
    if (Array.isArray(f.message)) {
      const r = document.createElement("ul");
      for (const u of f.message) {
        const a = document.createElement("li");
        a.textContent = u, r.appendChild(a);
      }
      c.appendChild(r);
    }
    if (f.data && f.data.errors) {
      const r = document.createElement("ul");
      for (const u of Object.values(f.data.errors).flat()) {
        const a = document.createElement("li");
        a.textContent = u, r.appendChild(a);
      }
      c.appendChild(r);
    }
  }
  function s(c, f) {
    const r = Array.from(c.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; r.length >= c.max && r.length > 0; ) c.dom.removeChild(r.shift());
    c.dom.appendChild(f), requestAnimationFrame(() => f.classList.remove("ln-enter"));
  }
  function t(c) {
    !c || !c.parentNode || (clearTimeout(c._timer), c.classList.remove("ln-enter"), c.classList.add("ln-out"), setTimeout(() => {
      c.parentNode && c.parentNode.removeChild(c);
    }, 200));
  }
  function e(c) {
    let f = c && c.container;
    return typeof f == "string" && (f = document.querySelector(f)), f instanceof HTMLElement || (f = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), f || null;
  }
  function i(c, f) {
    if (c._lnToastHydrated) return;
    c._lnToastHydrated = !0;
    const r = c.querySelector("[data-ln-toast-close]");
    r && r.addEventListener("click", function() {
      t(c);
    });
    const u = c.getAttribute("data-ln-toast-timeout"), a = u !== null ? parseInt(u, 10) : NaN, n = Number.isFinite(a) ? a : f.timeoutDefault;
    n > 0 && (c._timer = setTimeout(function() {
      t(c);
    }, n));
  }
  function o(c) {
    const f = c.detail || {}, r = e(f);
    if (!r) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const u = r[d] || new _(r), a = m(f, r);
    if (!a) return;
    const n = Number.isFinite(f.timeout) ? f.timeout : u.timeoutDefault;
    s(u, a), n > 0 && (a._timer = setTimeout(() => t(a), n));
  }
  function p(c) {
    const f = c && c.detail || {};
    if (f.container) {
      const r = e(f);
      if (r)
        for (const u of Array.from(r.querySelectorAll("[data-ln-toast-item]"))) t(u);
    } else {
      const r = document.querySelectorAll("[" + h + "]");
      for (const u of Array.from(r))
        for (const a of Array.from(u.querySelectorAll("[data-ln-toast-item]"))) t(a);
    }
  }
  J(function() {
    window.addEventListener("ln-toast:enqueue", o), window.addEventListener("ln-toast:clear", p), new MutationObserver(function(f) {
      for (const r of f) {
        if (r.type === "attributes") {
          v(r.target);
          continue;
        }
        for (const u of r.addedNodes)
          v(u);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), v(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", d = "lnUpload", E = "data-ln-upload-dict", v = "data-ln-upload-accept", _ = "data-ln-upload-context", m = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function l() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const f = document.createElement("div");
    f.innerHTML = m;
    const r = f.firstElementChild;
    r && document.body.appendChild(r);
  }
  if (window[d] !== void 0) return;
  function s(f) {
    if (f === 0) return "0 B";
    const r = 1024, u = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(f) / Math.log(r));
    return parseFloat((f / Math.pow(r, a)).toFixed(1)) + " " + u[a];
  }
  function t(f) {
    return f.split(".").pop().toLowerCase();
  }
  function e(f) {
    return f === "docx" && (f = "doc"), ["pdf", "doc", "epub"].includes(f) ? "lnc-file-" + f : "ln-file";
  }
  function i(f, r) {
    if (!r) return !0;
    const u = "." + t(f.name);
    return r.split(",").map(function(n) {
      return n.trim().toLowerCase();
    }).includes(u.toLowerCase());
  }
  function o(f) {
    if (f.hasAttribute("data-ln-upload-initialized")) return;
    f.setAttribute("data-ln-upload-initialized", "true"), l();
    const r = Kt(f, E), u = f.querySelector(".ln-upload__zone"), a = f.querySelector(".ln-upload__list"), n = f.getAttribute(v) || "";
    if (!u || !a) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", f);
      return;
    }
    let y = f.querySelector('input[type="file"]');
    y || (y = document.createElement("input"), y.type = "file", y.multiple = !0, y.classList.add("hidden"), n && (y.accept = n.split(",").map(function(N) {
      return N = N.trim(), N.startsWith(".") ? N : "." + N;
    }).join(",")), f.appendChild(y));
    const g = f.getAttribute(h) || "/files/upload", b = f.getAttribute(_) || "", A = f.getAttribute("data-ln-upload-delete") || (g.includes("/upload") ? g.replace(/\/upload\/?$/, "/{id}") : g + "/{id}"), w = /* @__PURE__ */ new Map();
    let T = 0;
    function C() {
      const N = document.querySelector('meta[name="csrf-token"]');
      return N ? N.getAttribute("content") : "";
    }
    function x(N) {
      if (!i(N, n)) {
        const M = r["invalid-type"];
        L(f, "ln-upload:invalid", {
          file: N,
          message: M
        }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["invalid-title"] || "Invalid File",
          message: M || r["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const U = "file-" + ++T, z = t(N.name), ht = e(z), et = lt(f, "ln-upload-item", "ln-upload");
      if (!et) return;
      const Y = et.firstElementChild;
      if (!Y) return;
      Y.setAttribute("data-file-id", U), X(Y, {
        name: N.name,
        sizeText: "0%",
        iconHref: "#" + ht,
        removeLabel: r.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const S = Y.querySelector(".ln-upload__progress-bar"), k = Y.querySelector('[data-ln-upload-action="remove"]');
      k && (k.disabled = !0), a.appendChild(Y);
      const D = new FormData();
      D.append("file", N);
      const q = /* @__PURE__ */ new Set();
      f.querySelectorAll("input, select, textarea").forEach(function(M) {
        if (M.name && M.name !== "file_ids[]" && M.type !== "file") {
          if ((M.type === "checkbox" || M.type === "radio") && !M.checked)
            return;
          D.append(M.name, M.value), q.add(M.name);
        }
      }), !q.has("context") && b && D.append("context", b);
      const O = new XMLHttpRequest();
      O.upload.addEventListener("progress", function(M) {
        if (M.lengthComputable) {
          const K = Math.round(M.loaded / M.total * 100);
          S.style.width = K + "%", X(Y, { sizeText: K + "%" });
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
          X(Y, { sizeText: s(M.size || N.size), uploading: !1 }), k && (k.disabled = !1), w.set(U, {
            serverId: M.id,
            name: M.name,
            size: M.size
          }), I(), L(f, "ln-upload:uploaded", {
            localId: U,
            serverId: M.id,
            name: M.name
          });
        } else {
          let M = r["upload-failed"] || "Upload failed";
          try {
            M = JSON.parse(O.responseText).message || M;
          } catch {
          }
          F(M);
        }
      }), O.addEventListener("error", function() {
        F(r["network-error"] || "Network error");
      });
      function F(M) {
        S && (S.style.width = "100%"), X(Y, { sizeText: r.error || "Error", uploading: !1, error: !0 }), k && (k.disabled = !1), L(f, "ln-upload:error", {
          file: N,
          message: M
        }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["error-title"] || "Upload Error",
          message: M || r["upload-failed"] || "Failed to upload file"
        });
      }
      O.open("POST", g), O.setRequestHeader("X-CSRF-TOKEN", C()), O.setRequestHeader("Accept", "application/json"), O.send(D);
    }
    function I() {
      for (const N of f.querySelectorAll('input[name="file_ids[]"]'))
        N.remove();
      for (const [, N] of w) {
        const U = document.createElement("input");
        U.type = "hidden", U.name = "file_ids[]", U.value = N.serverId, f.appendChild(U);
      }
    }
    function R(N) {
      const U = w.get(N), z = a.querySelector('[data-file-id="' + N + '"]');
      if (!U || !U.serverId) {
        z && z.remove(), w.delete(N), I();
        return;
      }
      z && X(z, { deleting: !0 });
      const ht = A.replace("{id}", U.serverId);
      fetch(ht, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": C(),
          Accept: "application/json"
        }
      }).then(function(et) {
        et.status === 200 ? (z && z.remove(), w.delete(N), I(), L(f, "ln-upload:removed", {
          localId: N,
          serverId: U.serverId
        })) : (z && X(z, { deleting: !1 }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["delete-title"] || "Error",
          message: r["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(et) {
        console.warn("[ln-upload] Delete error:", et), z && X(z, { deleting: !1 }), L(window, "ln-toast:enqueue", {
          type: "error",
          title: r["network-error"] || "Network error",
          message: r["connection-error"] || "Could not connect to server"
        });
      });
    }
    function P(N) {
      for (const U of N)
        x(U);
      y.value = "";
    }
    const B = function() {
      y.click();
    }, j = function() {
      P(this.files);
    }, W = function(N) {
      N.preventDefault(), N.stopPropagation(), u.classList.add("ln-upload__zone--dragover");
    }, tt = function(N) {
      N.preventDefault(), N.stopPropagation(), u.classList.add("ln-upload__zone--dragover");
    }, Q = function(N) {
      N.preventDefault(), N.stopPropagation(), u.classList.remove("ln-upload__zone--dragover");
    }, ut = function(N) {
      N.preventDefault(), N.stopPropagation(), u.classList.remove("ln-upload__zone--dragover"), P(N.dataTransfer.files);
    }, yt = function(N) {
      const U = N.target.closest('[data-ln-upload-action="remove"]');
      if (!U || !a.contains(U) || U.disabled) return;
      const z = U.closest(".ln-upload__item");
      z && R(z.getAttribute("data-file-id"));
    };
    u.addEventListener("click", B), y.addEventListener("change", j), u.addEventListener("dragenter", W), u.addEventListener("dragover", tt), u.addEventListener("dragleave", Q), u.addEventListener("drop", ut), a.addEventListener("click", yt), f.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(w.values()).map(function(N) {
          return N.serverId;
        });
      },
      getFiles: function() {
        return Array.from(w.values());
      },
      clear: function() {
        for (const [, N] of w)
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
        w.clear(), a.innerHTML = "", I(), L(f, "ln-upload:cleared", {});
      },
      destroy: function() {
        u.removeEventListener("click", B), y.removeEventListener("change", j), u.removeEventListener("dragenter", W), u.removeEventListener("dragover", tt), u.removeEventListener("dragleave", Q), u.removeEventListener("drop", ut), a.removeEventListener("click", yt), w.clear(), a.innerHTML = "", I(), f.removeAttribute("data-ln-upload-initialized"), delete f.lnUploadAPI;
      }
    };
  }
  function p() {
    for (const f of document.querySelectorAll("[" + h + "]"))
      o(f);
  }
  function c() {
    J(function() {
      new MutationObserver(function(r) {
        for (const u of r)
          if (u.type === "childList") {
            for (const a of u.addedNodes)
              if (a.nodeType === 1) {
                a.hasAttribute(h) && o(a);
                for (const n of a.querySelectorAll("[" + h + "]"))
                  o(n);
              }
          } else u.type === "attributes" && u.target.hasAttribute(h) && o(u.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[d] = {
    init: o,
    initAll: p
  }, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function d(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function E(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !d(s)) return;
    s.target = "_blank";
    const t = (s.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), s.rel = t.join(" ");
    const e = document.createElement("span");
    e.className = "sr-only", e.textContent = "(opens in new tab)", s.appendChild(e), s.setAttribute("data-ln-external-link", "processed"), L(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function v(s) {
    s = s || document.body;
    for (const t of s.querySelectorAll("a, area"))
      E(t);
  }
  function _() {
    J(function() {
      document.body.addEventListener("click", function(s) {
        const t = s.target.closest("a, area");
        t && t.getAttribute("data-ln-external-link") === "processed" && L(t, "ln-external-links:clicked", {
          link: t,
          href: t.href,
          text: t.textContent || t.title || ""
        });
      });
    }, "ln-external-links");
  }
  function m() {
    J(function() {
      new MutationObserver(function(t) {
        for (const e of t) {
          if (e.type === "childList") {
            for (const i of e.addedNodes)
              if (i.nodeType === 1 && (i.matches && (i.matches("a") || i.matches("area")) && E(i), i.querySelectorAll))
                for (const o of i.querySelectorAll("a, area"))
                  E(o);
          }
          if (e.type === "attributes" && e.attributeName === "href") {
            const i = e.target;
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
  function l() {
    _(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      v();
    }) : v();
  }
  window[h] = {
    process: v
  }, l();
})();
(function() {
  const h = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  let E = null;
  function v() {
    E = document.createElement("div"), E.className = "ln-link-status", document.body.appendChild(E);
  }
  function _(a) {
    E && (E.textContent = a, E.classList.add("ln-link-status--visible"));
  }
  function m() {
    E && E.classList.remove("ln-link-status--visible");
  }
  function l(a, n) {
    if (n.target.closest("a, button, input, select, textarea")) return;
    const y = a.querySelector("a");
    if (!y) return;
    const g = y.getAttribute("href");
    if (!g) return;
    if (n.ctrlKey || n.metaKey || n.button === 1) {
      window.open(g, "_blank");
      return;
    }
    V(a, "ln-link:navigate", { target: a, href: g, link: y }).defaultPrevented || y.click();
  }
  function s(a) {
    const n = a.querySelector("a");
    if (!n) return;
    const y = n.getAttribute("href");
    y && _(y);
  }
  function t() {
    m();
  }
  function e(a) {
    a[d + "Row"] || (a[d + "Row"] = !0, a.querySelector("a") && (a._lnLinkClick = function(n) {
      l(a, n);
    }, a._lnLinkEnter = function() {
      s(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", t)));
  }
  function i(a) {
    a[d + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", t), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[d + "Row"]);
  }
  function o(a) {
    if (!a[d + "Init"]) return;
    const n = a.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const y = n === "TABLE" && a.querySelector("tbody") || a;
      for (const g of y.querySelectorAll("tr"))
        i(g);
    } else
      i(a);
    delete a[d + "Init"];
  }
  function p(a) {
    if (a[d + "Init"]) return;
    a[d + "Init"] = !0;
    const n = a.tagName;
    if (n === "TABLE" || n === "TBODY") {
      const y = n === "TABLE" && a.querySelector("tbody") || a;
      for (const g of y.querySelectorAll("tr"))
        e(g);
    } else
      e(a);
  }
  function c(a) {
    a.hasAttribute && a.hasAttribute(h) && p(a);
    const n = a.querySelectorAll ? a.querySelectorAll("[" + h + "]") : [];
    for (const y of n)
      p(y);
  }
  function f() {
    J(function() {
      new MutationObserver(function(n) {
        for (const y of n)
          if (y.type === "childList")
            for (const g of y.addedNodes)
              g.nodeType === 1 && (c(g), g.tagName === "TR" && g.closest("[" + h + "]") && e(g));
          else y.type === "attributes" && c(y.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function r(a) {
    c(a);
  }
  window[d] = { init: r, destroy: o };
  function u() {
    v(), f(), r(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const h = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0) return;
  function E(e) {
    v(e);
  }
  function v(e) {
    const i = Array.from(e.querySelectorAll(h));
    for (const o of i)
      o[d] || (o[d] = new _(o));
    e.hasAttribute && e.hasAttribute("data-ln-progress") && !e[d] && (e[d] = new _(e));
  }
  function _(e) {
    return this.dom = e, this._attrObserver = null, this._parentObserver = null, t.call(this), l.call(this), s.call(this), this;
  }
  _.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[d]);
  };
  function m() {
    J(function() {
      new MutationObserver(function(i) {
        for (const o of i)
          if (o.type === "childList")
            for (const p of o.addedNodes)
              p.nodeType === 1 && v(p);
          else o.type === "attributes" && v(o.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  m();
  function l() {
    const e = this, i = new MutationObserver(function(o) {
      for (const p of o)
        (p.attributeName === "data-ln-progress" || p.attributeName === "data-ln-progress-max") && t.call(e);
    });
    i.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = i;
  }
  function s() {
    const e = this, i = this.dom.parentElement;
    if (!i || !i.hasAttribute("data-ln-progress-max")) return;
    const o = new MutationObserver(function(p) {
      for (const c of p)
        c.attributeName === "data-ln-progress-max" && t.call(e);
    });
    o.observe(i, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = o;
  }
  function t() {
    const e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, i = this.dom.parentElement, p = (i && i.hasAttribute("data-ln-progress-max") ? parseFloat(i.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let c = p > 0 ? e / p * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100), this.dom.style.width = c + "%";
    const f = Math.max(0, Math.min(e, p));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(p)), this.dom.setAttribute("aria-valuenow", String(f)), L(this.dom, "ln-progress:change", { target: this.dom, value: e, max: p, percentage: c });
  }
  window[d] = E, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const h = "data-ln-filter", d = "lnFilter", E = "data-ln-filter-initialized", v = "data-ln-filter-key", _ = "data-ln-filter-value", m = "data-ln-filter-hide", l = "data-ln-filter-reset", s = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[d] !== void 0) return;
  function e(f) {
    return f.hasAttribute(l) || f.getAttribute(_) === "";
  }
  function i(f) {
    let r = f._filterKey;
    const u = [];
    for (let a = 0; a < f.inputs.length; a++) {
      const n = f.inputs[a];
      if (n.checked && !e(n)) {
        const y = n.getAttribute(_);
        y && u.push(y);
      }
    }
    return { key: r, values: u };
  }
  function o(f, r) {
    if (f.length !== r.length) return !0;
    for (let u = 0; u < f.length; u++) if (f[u] !== r[u]) return !0;
    return !1;
  }
  function p(f) {
    const r = f.dom, u = f.colIndex, a = r.querySelector("template");
    if (!a || u === null) return;
    const n = document.getElementById(f.targetId);
    if (!n) return;
    const y = n.tagName === "TABLE" ? n : n.querySelector("table");
    if (!y || n.hasAttribute("data-ln-table")) return;
    const g = {}, b = [], A = y.tBodies;
    for (let C = 0; C < A.length; C++) {
      const x = A[C].rows;
      for (let I = 0; I < x.length; I++) {
        const R = x[I].cells[u], P = R ? R.textContent.trim() : "";
        P && !g[P] && (g[P] = !0, b.push(P));
      }
    }
    b.sort(function(C, x) {
      return C.localeCompare(x);
    });
    const w = r.querySelector("[" + v + "]"), T = w ? w.getAttribute(v) : r.getAttribute("data-ln-filter-key") || "col" + u;
    for (let C = 0; C < b.length; C++) {
      const x = a.content.cloneNode(!0), I = x.querySelector("input");
      I && (I.setAttribute(v, T), I.setAttribute(_, b[C]), bt(x, { text: b[C] }), r.appendChild(x));
    }
  }
  function c(f) {
    if (f.hasAttribute(E)) return this;
    this.dom = f, this.targetId = f.getAttribute(h);
    const r = f.getAttribute(s);
    this.colIndex = r !== null ? parseInt(r, 10) : null, p(this), this.inputs = Array.from(f.querySelectorAll("[" + v + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(v) : null, this._lastSnapshot = null;
    const u = this, a = pe(
      function() {
        u._render();
      },
      function() {
        u._afterRender();
      }
    );
    this._queueRender = a, this._attachHandlers();
    let n = !1;
    if (f.hasAttribute("data-ln-persist")) {
      const y = wt("filter", f);
      if (y && y.key && Array.isArray(y.values) && y.values.length > 0) {
        for (let g = 0; g < this.inputs.length; g++) {
          const b = this.inputs[g];
          e(b) ? b.checked = !1 : b.getAttribute(v) === y.key && y.values.indexOf(b.getAttribute(_)) !== -1 ? b.checked = !0 : b.checked = !1;
        }
        a(), n = !0;
      }
    }
    if (!n) {
      for (let y = 0; y < this.inputs.length; y++)
        if (this.inputs[y].checked && !e(this.inputs[y])) {
          a();
          break;
        }
    }
    return f.setAttribute(E, ""), this;
  }
  c.prototype._attachHandlers = function() {
    const f = this;
    this.inputs.forEach(function(r) {
      r[d + "Bound"] || (r[d + "Bound"] = !0, r._lnFilterChange = function() {
        if (e(r)) {
          for (let u = 0; u < f.inputs.length; u++)
            e(f.inputs[u]) || (f.inputs[u].checked = !1);
          r.checked = !0, f._queueRender();
          return;
        }
        if (r.checked) {
          for (let a = 0; a < f.inputs.length; a++)
            e(f.inputs[a]) && (f.inputs[a].checked = !1);
          let u = !1;
          for (let a = 0; a < f.inputs.length; a++)
            if (e(f.inputs[a])) {
              u = !0;
              break;
            }
          if (u) {
            let a = !0;
            for (let n = 0; n < f.inputs.length; n++)
              if (!e(f.inputs[n]) && !f.inputs[n].checked) {
                a = !1;
                break;
              }
            if (a)
              for (let n = 0; n < f.inputs.length; n++)
                e(f.inputs[n]) ? f.inputs[n].checked = !0 : f.inputs[n].checked = !1;
          }
        } else {
          let u = !1;
          for (let a = 0; a < f.inputs.length; a++)
            if (!e(f.inputs[a]) && f.inputs[a].checked) {
              u = !0;
              break;
            }
          if (!u)
            for (let a = 0; a < f.inputs.length; a++)
              e(f.inputs[a]) && (f.inputs[a].checked = !0);
        }
        f._queueRender();
      }, r.addEventListener("change", r._lnFilterChange));
    });
  }, c.prototype._render = function() {
    const f = this, r = i(this), u = r.key === null || r.values.length === 0, a = [];
    for (let n = 0; n < r.values.length; n++)
      a.push(r.values[n].toLowerCase());
    if (f.colIndex !== null)
      f._filterTableRows(r);
    else {
      const n = document.getElementById(f.targetId);
      if (!n) return;
      const y = n.children;
      for (let g = 0; g < y.length; g++) {
        const b = y[g];
        if (u) {
          b.removeAttribute(m);
          continue;
        }
        const A = b.getAttribute("data-" + r.key);
        b.removeAttribute(m), A !== null && a.indexOf(A.toLowerCase()) === -1 && b.setAttribute(m, "true");
      }
    }
  }, c.prototype._afterRender = function() {
    const f = i(this), r = this._lastSnapshot;
    if (!r || r.key !== f.key || o(r.values, f.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: f.key,
        values: f.values.slice()
      });
      const a = r && r.values.length > 0, n = f.values.length === 0;
      a && n && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: f.key, values: f.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (f.key && f.values.length > 0 ? ct("filter", this.dom, { key: f.key, values: f.values.slice() }) : ct("filter", this.dom, null));
  }, c.prototype._dispatchOnBoth = function(f, r) {
    L(this.dom, f, r);
    const u = document.getElementById(this.targetId);
    u && u !== this.dom && L(u, f, r);
  }, c.prototype._filterTableRows = function(f) {
    const r = document.getElementById(this.targetId);
    if (!r) return;
    const u = r.tagName === "TABLE" ? r : r.querySelector("table");
    if (!u || r.hasAttribute("data-ln-table")) return;
    const a = f.key || this._filterKey, n = f.values;
    t.has(u) || t.set(u, {});
    const y = t.get(u);
    if (a && n.length > 0) {
      const w = [];
      for (let T = 0; T < n.length; T++)
        w.push(n[T].toLowerCase());
      y[a] = { col: this.colIndex, values: w };
    } else a && delete y[a];
    const g = Object.keys(y), b = g.length > 0, A = u.tBodies;
    for (let w = 0; w < A.length; w++) {
      const T = A[w].rows;
      for (let C = 0; C < T.length; C++) {
        const x = T[C];
        if (!b) {
          x.removeAttribute(m);
          continue;
        }
        let I = !0;
        for (let R = 0; R < g.length; R++) {
          const P = y[g[R]], B = x.cells[P.col], j = B ? B.textContent.trim().toLowerCase() : "";
          if (P.values.indexOf(j) === -1) {
            I = !1;
            break;
          }
        }
        I ? x.removeAttribute(m) : x.setAttribute(m, "true");
      }
    }
  }, c.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.colIndex !== null) {
        const f = document.getElementById(this.targetId);
        if (f) {
          const r = f.tagName === "TABLE" ? f : f.querySelector("table");
          if (r && t.has(r)) {
            const u = t.get(r), a = this._filterKey;
            a && u[a] && delete u[a], Object.keys(u).length === 0 && t.delete(r);
          }
        }
      }
      this.inputs.forEach(function(f) {
        f._lnFilterChange && (f.removeEventListener("change", f._lnFilterChange), delete f._lnFilterChange), delete f[d + "Bound"];
      }), this.dom.removeAttribute(E), delete this.dom[d];
    }
  }, H(h, d, c, "ln-filter");
})();
(function() {
  const h = "data-ln-search", d = "lnSearch", E = "data-ln-search-initialized", v = "data-ln-search-hide";
  if (window[d] !== void 0) return;
  function m(l) {
    if (l.hasAttribute(E)) return this;
    this.dom = l, this.targetId = l.getAttribute(h);
    const s = l.tagName;
    this.input = s === "INPUT" || s === "TEXTAREA" ? l : l.querySelector('[name="search"]') || l.querySelector('input[type="search"]') || l.querySelector('input[type="text"]'), this.itemsSelector = l.getAttribute("data-ln-search-items") || null;
    const t = l.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = t !== null ? parseInt(t, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const e = this;
      queueMicrotask(function() {
        e._search(e.input.value.trim().toLowerCase());
      });
    }
    return l.setAttribute(E, ""), this;
  }
  m.prototype._attachHandler = function() {
    if (!this.input) return;
    const l = this, s = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = s ? s.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      l.input.value = "", l._search(""), l.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(l._debounceTimer), l._debounceTimer = setTimeout(function() {
        l._search(l.input.value.trim().toLowerCase());
      }, l.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, m.prototype._search = function(l) {
    const s = document.getElementById(this.targetId);
    if (!s || V(s, "ln-search:change", { term: l, targetId: this.targetId }).defaultPrevented) return;
    const e = this.itemsSelector ? s.querySelectorAll(this.itemsSelector) : s.children;
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      o.removeAttribute(v), l && !o.textContent.replace(/\s+/g, " ").toLowerCase().includes(l) && o.setAttribute(v, "true");
    }
  }, m.prototype.destroy = function() {
    this.dom[d] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(E), delete this.dom[d]);
  }, H(h, d, m, "ln-search");
})();
(function() {
  const h = "lnTableSort", d = "data-ln-table-sort", E = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function v(s) {
    _(s);
  }
  function _(s) {
    const t = Array.from(s.querySelectorAll("table"));
    s.tagName === "TABLE" && t.push(s), t.forEach(function(e) {
      if (e[h]) return;
      const i = Array.from(e.querySelectorAll("th[" + d + "]"));
      i.length && (e[h] = new m(e, i));
    });
  }
  function m(s, t) {
    this.table = s, this.ths = t, this._col = -1, this._dir = null;
    const e = this;
    t.forEach(function(o, p) {
      if (o[h + "Bound"]) return;
      o[h + "Bound"] = !0;
      const c = o.querySelector("[" + E + "]");
      c && (c._lnSortClick = function() {
        e._handleClick(p, o);
      }, c.addEventListener("click", c._lnSortClick));
    });
    const i = s.closest("[data-ln-table][data-ln-persist]");
    if (i) {
      const o = wt("table-sort", i);
      o && o.dir && o.col >= 0 && o.col < t.length && (this._handleClick(o.col, t[o.col]), o.dir === "desc" && this._handleClick(o.col, t[o.col]));
    }
    return this;
  }
  m.prototype._handleClick = function(s, t) {
    let e;
    this._col !== s ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this.ths.forEach(function(o) {
      o.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = s, this._dir = e, t.classList.add(e === "asc" ? "ln-sort-asc" : "ln-sort-desc")), L(this.table, "ln-table:sort", {
      column: s,
      sortType: t.getAttribute(d),
      direction: e
    });
    const i = this.table.closest("[data-ln-table][data-ln-persist]");
    i && (e === null ? ct("table-sort", i, null) : ct("table-sort", i, { col: s, dir: e }));
  }, m.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(s) {
      const t = s.querySelector("[" + E + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete s[h + "Bound"];
    }), delete this.table[h]);
  };
  function l() {
    J(function() {
      new MutationObserver(function(t) {
        t.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(i) {
            i.nodeType === 1 && _(i);
          }) : e.type === "attributes" && _(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table-sort");
  }
  window[h] = v, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-table", d = "lnTable", E = "data-ln-table-sort", v = "data-ln-table-empty";
  if (window[d] !== void 0) return;
  const l = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, s = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function t(o) {
    return s ? s.format(o) : String(o);
  }
  function e(o) {
    let p = o.parentElement;
    for (; p && p !== document.body && p !== document.documentElement; ) {
      const f = getComputedStyle(p).overflowY;
      if (f === "auto" || f === "scroll") return p;
      p = p.parentElement;
    }
    return null;
  }
  function i(o) {
    this.dom = o, this.table = o.querySelector("table"), this.tbody = o.querySelector("[data-ln-table-body]") || o.querySelector("tbody"), this.thead = o.querySelector("thead");
    const p = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = p ? Array.from(p.querySelectorAll("th")) : [], this.isDataDriven = o.hasAttribute("data-ln-table-source"), this.name = o.getAttribute(h) || "", this.source = o.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const c = this;
    if (this._onColumnFilter = function(f) {
      const r = f.detail.key;
      let u = null;
      for (let y = 0; y < c.ths.length; y++)
        if (c.ths[y].getAttribute("data-ln-table-filter-col") === r) {
          u = c.ths[y];
          break;
        }
      if (!u) return;
      const a = f.detail.values, n = u.querySelector("[data-ln-table-col-filter]");
      if (n && n.classList.toggle("ln-filter-active", !!(a && a.length > 0)), c.isDataDriven)
        !a || a.length === 0 ? delete c.currentFilters[r] : c.currentFilters[r] = a, c._requestData();
      else {
        if (!a || a.length === 0)
          delete c._columnFilters[r];
        else {
          const y = [];
          for (let g = 0; g < a.length; g++)
            y.push(a[g].toLowerCase());
          c._columnFilters[r] = y;
        }
        c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), L(o, "ln-table:filter", {
          term: c._searchTerm,
          matched: c._filteredData.length,
          total: c._data.length
        });
      }
    }, this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = o.querySelector("[data-ln-table-total]"), this._filteredSpan = o.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = o.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(r) {
        const u = r.detail || {};
        c._data = u.data || [], c._lastTotal = u.total != null ? u.total : c._data.length, c._lastFiltered = u.filtered != null ? u.filtered : c._data.length, c.totalCount = c._lastTotal, c.visibleCount = c._lastFiltered, c.isLoaded = !0, o.classList.remove("ln-table--loading"), c._vStart = -1, c._vEnd = -1, c._applyFilterAndSort(), c._render(), c._updateFooter(), L(o, "ln-table:rendered", {
          table: c.name,
          total: c.totalCount,
          visible: c.visibleCount
        });
      }, o.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(r) {
        const u = r.detail && r.detail.loading;
        o.classList.toggle("ln-table--loading", !!u), u && (c.isLoaded = !1);
      }, o.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(r) {
        const u = r.target.closest("[data-ln-table-col-sort]");
        if (!u) return;
        const a = u.closest("th");
        if (!a) return;
        const n = a.getAttribute("data-ln-table-col");
        n && c._handleSort(n, a);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), o.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClearAll = function(r) {
        if (r.target.closest("[data-ln-table-clear-all]") || r.target.closest("[data-ln-data-table-clear-all]")) {
          c.currentFilters = {};
          for (let a = 0; a < c.ths.length; a++) {
            const n = c.ths[a].querySelector("[data-ln-table-col-filter]");
            n && n.classList.remove("ln-filter-active");
          }
          L(o, "ln-table:clear-filters", { table: c.name }), c._requestData();
        }
      }, o.addEventListener("click", this._onClearAll), this._selectable = o.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(r) {
        if (r.target.closest("[data-ln-table-row-select]") || r.target.closest("[data-ln-table-row-action]") || r.target.closest("a") || r.target.closest("button") || r.ctrlKey || r.metaKey || r.button === 1) return;
        const u = r.target.closest("[data-ln-table-row]");
        if (!u) return;
        const a = u.getAttribute("data-ln-table-row-id"), n = u._lnRecord || {};
        L(o, "ln-table:row-click", {
          table: c.name,
          id: a,
          record: n
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(r) {
        const u = r.target.closest("[data-ln-table-row-action]");
        if (!u) return;
        r.stopPropagation();
        const a = u.closest("[data-ln-table-row]");
        if (!a) return;
        const n = u.getAttribute("data-ln-table-row-action"), y = a.getAttribute("data-ln-table-row-id"), g = a._lnRecord || {};
        L(o, "ln-table:row-action", {
          table: c.name,
          id: y,
          action: n,
          record: g
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const f = document.querySelector('[data-ln-search="' + o.id + '"]');
      if (f) {
        const r = f.tagName;
        this._searchInput = r === "INPUT" || r === "TEXTAREA" ? f : f.querySelector('input[type="search"]') || f.querySelector('input[type="text"]') || f.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(r) {
        r.preventDefault(), c.currentSearch = r.detail.term, c._searchInput && (c._searchInput.value = r.detail.term), L(o, "ln-table:search", {
          table: c.name,
          query: c.currentSearch
        }), c._requestData();
      }, o.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(r) {
        if (!o.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (r.key === "/") {
          c._searchInput && (r.preventDefault(), c._searchInput.focus());
          return;
        }
        const u = c.tbody ? Array.from(c.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (u.length)
          switch (r.key) {
            case "ArrowDown":
              r.preventDefault(), c._focusedRowIndex = Math.min(c._focusedRowIndex + 1, u.length - 1), c._focusRow(u);
              break;
            case "ArrowUp":
              r.preventDefault(), c._focusedRowIndex = Math.max(c._focusedRowIndex - 1, 0), c._focusRow(u);
              break;
            case "Home":
              r.preventDefault(), c._focusedRowIndex = 0, c._focusRow(u);
              break;
            case "End":
              r.preventDefault(), c._focusedRowIndex = u.length - 1, c._focusRow(u);
              break;
            case "Enter":
              if (c._focusedRowIndex >= 0 && c._focusedRowIndex < u.length) {
                r.preventDefault();
                const a = u[c._focusedRowIndex];
                L(o, "ln-table:row-click", {
                  table: c.name,
                  id: a.getAttribute("data-ln-table-row-id"),
                  record: a._lnRecord || {}
                });
              }
              break;
            case " ":
              if (c._selectable && c._focusedRowIndex >= 0 && c._focusedRowIndex < u.length) {
                r.preventDefault();
                const a = u[c._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                a && (a.checked = !a.checked, a.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), L(o, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        c.tbody.rows.length > 0 && (c._emptyTbodyObserver.disconnect(), c._emptyTbodyObserver = null, c._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(f) {
        f.preventDefault(), c._searchTerm = f.detail.term, c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), L(o, "ln-table:filter", {
          term: c._searchTerm,
          matched: c._filteredData.length,
          total: c._data.length
        });
      }, o.addEventListener("ln-search:change", this._onSearch), this._onSort = function(f) {
        c._sortCol = f.detail.direction === null ? -1 : f.detail.column, c._sortDir = f.detail.direction, c._sortType = f.detail.sortType, c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), L(o, "ln-table:sorted", {
          column: f.detail.column,
          direction: f.detail.direction,
          matched: c._filteredData.length,
          total: c._data.length
        });
      }, o.addEventListener("ln-table:sort", this._onSort), o.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(f) {
        if (!f.target.closest("[data-ln-table-clear]")) return;
        c._searchTerm = "";
        const u = document.querySelector('[data-ln-search="' + o.id + '"]');
        if (u) {
          const n = u.tagName === "INPUT" ? u : u.querySelector("input");
          n && (n.value = "");
        }
        c._columnFilters = {};
        for (let n = 0; n < c.ths.length; n++) {
          const y = c.ths[n].querySelector("[data-ln-table-col-filter]");
          y && y.classList.remove("ln-filter-active");
        }
        const a = document.querySelectorAll('[data-ln-filter="' + o.id + '"]');
        for (let n = 0; n < a.length; n++) {
          const y = a[n].querySelector("[data-ln-filter-reset]");
          y && (y.checked = !0, y.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        c._applyFilterAndSort(), c._vStart = -1, c._vEnd = -1, c._render(), L(o, "ln-table:filter", {
          term: "",
          matched: c._filteredData.length,
          total: c._data.length
        });
      }, o.addEventListener("click", this._onClear);
    return this;
  }
  i.prototype._parseRows = function() {
    const o = this.tbody.rows, p = this.ths;
    this._data = [];
    const c = [];
    for (let f = 0; f < p.length; f++)
      c[f] = p[f].getAttribute(E);
    o.length > 0 && (this._rowHeight = o[0].offsetHeight || 40), this._lockColumnWidths();
    for (let f = 0; f < o.length; f++) {
      const r = o[f], u = [], a = [], n = [];
      for (let g = 0; g < r.cells.length; g++) {
        const b = r.cells[g], A = b.textContent.trim(), w = Ft(b), T = c[g];
        a[g] = A.toLowerCase(), T === "number" || T === "date" ? u[g] = parseFloat(w) || 0 : T === "string" ? u[g] = String(w) : u[g] = null, g < r.cells.length - 1 && n.push(A.toLowerCase());
      }
      let y = null;
      if (this.isDataDriven) {
        y = {};
        const g = r.getAttribute("data-ln-table-row-id");
        g != null && (y.id = g);
        for (let b = 0; b < p.length; b++) {
          const A = p[b].getAttribute("data-ln-table-col");
          if (A) {
            const w = b;
            if (w < r.cells.length) {
              const T = r.cells[w];
              y[A] = Ft(T);
            }
          }
        }
      }
      this._data.push({
        sortKeys: u,
        rawTexts: a,
        html: r.outerHTML,
        searchText: n.join(" "),
        id: this.isDataDriven && y ? y.id : void 0,
        ...y
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, i.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const o = (this.currentSearch || "").trim().toLowerCase(), p = this.currentFilters || {}, c = Object.keys(p).length > 0;
      if (this._filteredData = this._data.filter(function(y) {
        if (o) {
          let g = !1;
          for (const b in y)
            if (y.hasOwnProperty(b) && typeof y[b] == "string" && b !== "html" && b !== "searchText" && y[b].toLowerCase().indexOf(o) !== -1) {
              g = !0;
              break;
            }
          if (!g) return !1;
        }
        if (c)
          for (const g in p) {
            const b = p[g];
            if (b && b.length > 0) {
              const A = y[g], w = A != null ? String(A) : "";
              if (b.indexOf(w) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const f = this.currentSort.field, u = this.currentSort.direction === "desc" ? -1 : 1;
      let a = null;
      if (this.ths) {
        for (let y = 0; y < this.ths.length; y++)
          if (this.ths[y].getAttribute("data-ln-table-col") === f) {
            a = this.ths[y].getAttribute(E);
            break;
          }
      }
      const n = l ? l.compare : function(y, g) {
        return y < g ? -1 : y > g ? 1 : 0;
      };
      this._filteredData.sort(function(y, g) {
        const b = y[f], A = g[f];
        if (a === "number" || a === "date") {
          const C = parseFloat(b) || 0, x = parseFloat(A) || 0;
          return (C - x) * u;
        }
        if (typeof b == "number" && typeof A == "number")
          return (b - A) * u;
        const w = b != null ? String(b) : "", T = A != null ? String(A) : "";
        return n(w, T) * u;
      });
    } else {
      const o = this._searchTerm, p = this._columnFilters, c = Object.keys(p).length > 0, f = this.ths, r = {};
      if (c)
        for (let g = 0; g < f.length; g++) {
          const b = f[g].getAttribute("data-ln-table-filter-col");
          b && (r[b] = g);
        }
      if (!o && !c ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(g) {
        if (o && g.searchText.indexOf(o) === -1) return !1;
        if (c)
          for (const b in p) {
            const A = r[b];
            if (A !== void 0 && p[b].indexOf(g.rawTexts[A]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const u = this._sortCol, a = this._sortDir === "desc" ? -1 : 1, n = this._sortType === "number" || this._sortType === "date", y = l ? l.compare : function(g, b) {
        return g < b ? -1 : g > b ? 1 : 0;
      };
      this._filteredData.sort(function(g, b) {
        const A = g.sortKeys[u], w = b.sortKeys[u];
        return n ? (A - w) * a : y(A, w) * a;
      });
    }
  }, i.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const o = document.createElement("colgroup");
    this.ths.forEach(function(p) {
      const c = document.createElement("col");
      c.style.width = p.offsetWidth + "px", o.appendChild(c);
    }), this.table.insertBefore(o, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = o;
  }, i.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const o = this._lastTotal, p = this.visibleCount;
        if (o === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || p === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const o = this._filteredData.length;
        o === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, i.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const o = this._filteredData, p = document.createDocumentFragment();
      for (let c = 0; c < o.length; c++) {
        const f = this._buildRow(o[c]);
        if (!f) break;
        p.appendChild(f);
      }
      this.tbody.textContent = "", this.tbody.appendChild(p), this._selectable && this._updateSelectAll();
    } else {
      const o = [], p = this._filteredData;
      for (let c = 0; c < p.length; c++) o.push(p[c].html);
      this.tbody.innerHTML = o.join("");
    }
  }, i.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
    if (!this._rowHeight)
      if (this.isDataDriven) {
        if (this._data.length > 0) {
          const c = this._buildRow(this._data[0]);
          c && (this.tbody.textContent = "", this.tbody.appendChild(c), this._rowHeight = c.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const c = this.tbody ? this.tbody.rows : [];
        c.length > 0 && (this._rowHeight = c[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = e(this.dom) : this._scrollContainer = null;
    const p = this._scrollContainer || window;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._renderVirtual();
      }));
    }, p.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, i.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, i.prototype._renderVirtual = function() {
    const o = this._filteredData, p = o.length, c = this._rowHeight;
    if (!c || !p) return;
    const f = this.thead ? this.thead.offsetHeight : 0, r = this._scrollContainer;
    let u, a;
    if (r) {
      const w = this.table.getBoundingClientRect(), T = r.getBoundingClientRect(), C = w.top - T.top + r.scrollTop + f;
      u = r.scrollTop - C, a = r.clientHeight;
    } else {
      const C = this.table.getBoundingClientRect().top + window.scrollY + f;
      u = window.scrollY - C, a = window.innerHeight;
    }
    let n = Math.max(0, Math.floor(u / c) - 15);
    n = Math.min(n, p);
    const y = Math.min(n + Math.ceil(a / c) + 30, p);
    if (n === this._vStart && y === this._vEnd) return;
    this._vStart = n, this._vEnd = y;
    const g = this.ths.length || 1, b = n * c, A = (p - y) * c;
    if (this.isDataDriven) {
      const w = document.createDocumentFragment();
      if (b > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const C = document.createElement("td");
        C.setAttribute("colspan", g), C.style.height = b + "px", T.appendChild(C), w.appendChild(T);
      }
      for (let T = n; T < y; T++) {
        const C = this._buildRow(o[T]);
        C && w.appendChild(C);
      }
      if (A > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const C = document.createElement("td");
        C.setAttribute("colspan", g), C.style.height = A + "px", T.appendChild(C), w.appendChild(T);
      }
      this.tbody.textContent = "", this.tbody.appendChild(w), this._selectable && this._updateSelectAll();
    } else {
      let w = "";
      b > 0 && (w += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + g + '" style="height:' + b + 'px;padding:0;border:none"></td></tr>');
      for (let T = n; T < y; T++) w += o[T].html;
      A > 0 && (w += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + g + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = w;
    }
  }, i.prototype._showEmptyState = function() {
    const o = this.ths.length || 1;
    this.tbody.textContent = "";
    let p = null;
    if (this.isDataDriven) {
      const c = this._lastTotal != null ? this._lastTotal : this._data.length, f = this.visibleCount, r = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (f < c || f === 0), u = r ? this.name + "-empty-filtered" : this.name + "-empty";
      if (p = lt(this.dom, u, "ln-table"), !p) {
        const a = this.dom.querySelector("template[data-ln-table-empty]");
        if (a) {
          const n = r ? "search" : "initial", y = a.content.querySelector('[data-ln-table-empty-when="' + n + '"]') || a.content.firstElementChild;
          y && (p = document.importNode(y, !0));
        }
      }
      if (p)
        if (p.tagName === "TR")
          this.tbody.appendChild(p);
        else {
          const a = document.createElement("td");
          a.setAttribute("colspan", String(o)), a.appendChild(p);
          const n = document.createElement("tr");
          n.className = "ln-table__empty", n.appendChild(a), this.tbody.appendChild(n);
        }
    } else {
      const c = this.dom.querySelector("template[" + v + "]"), f = document.createElement("td");
      f.setAttribute("colspan", String(o)), c && f.appendChild(document.importNode(c.content, !0));
      const r = document.createElement("tr");
      r.className = "ln-table__empty", r.appendChild(f), this.tbody.appendChild(r);
    }
    L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, i.prototype._fillRow = function(o, p) {
    bt(o, p);
    const c = o.querySelectorAll("[data-ln-table-cell-attr]");
    for (let f = 0; f < c.length; f++) {
      const r = c[f], u = r.getAttribute("data-ln-table-cell-attr").split(",");
      for (let a = 0; a < u.length; a++) {
        const n = u[a].trim().split(":");
        if (n.length !== 2) continue;
        const y = n[0].trim(), g = n[1].trim();
        p[y] != null && r.setAttribute(g, p[y]);
      }
    }
  }, i.prototype._buildRow = function(o) {
    const p = lt(this.dom, this.name + "-row", "ln-table");
    if (!p) return null;
    const c = p.querySelector("[data-ln-table-row]") || p.firstElementChild;
    if (!c) return null;
    if (this._fillRow(c, o), c._lnRecord = o, o.id != null && c.setAttribute("data-ln-table-row-id", o.id), this._selectable && o.id != null && this.selectedIds.has(String(o.id))) {
      c.classList.add("ln-row-selected");
      const f = c.querySelector("[data-ln-table-row-select]");
      f && (f.checked = !0);
    }
    return c;
  }, i.prototype._handleSort = function(o, p) {
    let c;
    !this.currentSort || this.currentSort.field !== o ? c = "asc" : this.currentSort.direction === "asc" ? c = "desc" : c = null;
    for (let f = 0; f < this.ths.length; f++)
      this.ths[f].classList.remove("ln-sort-asc", "ln-sort-desc");
    c ? (this.currentSort = { field: o, direction: c }, p.classList.add(c === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, L(this.dom, "ln-table:sort", {
      table: this.name,
      field: o,
      direction: c
    }), this._requestData();
  }, i.prototype._requestData = function() {
    jt(this, "ln-table:request-data", "table");
  }, i.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-table-row]");
    let p = o.length > 0;
    for (let c = 0; c < o.length; c++) {
      const f = o[c].getAttribute("data-ln-table-row-id");
      if (f != null && !this.selectedIds.has(f)) {
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
    const o = this;
    if (this._onSelectionChange = function(p) {
      const c = p.target.closest("[data-ln-table-row-select]");
      if (!c) return;
      const f = c.closest("[data-ln-table-row]");
      if (!f) return;
      const r = f.getAttribute("data-ln-table-row-id");
      r != null && (c.checked ? (o.selectedIds.add(r), f.classList.add("ln-row-selected")) : (o.selectedIds.delete(r), f.classList.remove("ln-row-selected")), o.selectedCount = o.selectedIds.size, o._updateSelectAll(), o._updateFooter(), L(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const p = document.createElement("input");
      p.type = "checkbox", p.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(p), this._selectAllCheckbox = p;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const p = o._selectAllCheckbox.checked, c = o.tbody ? o.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let f = 0; f < c.length; f++) {
        const r = c[f].getAttribute("data-ln-table-row-id"), u = c[f].querySelector("[data-ln-table-row-select]");
        r != null && (p ? (o.selectedIds.add(r), c[f].classList.add("ln-row-selected")) : (o.selectedIds.delete(r), c[f].classList.remove("ln-row-selected")), u && (u.checked = p));
      }
      o.selectedCount = o.selectedIds.size, L(o.dom, "ln-table:select-all", {
        table: o.name,
        selected: p
      }), L(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }), o._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const p = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let c = 0; c < p.length; c++) {
        const f = p[c].querySelector("[data-ln-table-row-select]"), r = p[c].getAttribute("data-ln-table-row-id");
        f && f.checked && r != null && (this.selectedIds.add(r), p[c].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, i.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const o = this.dom.querySelector("[data-ln-table-col-select]");
    if (o) {
      const p = o.querySelector('input[type="checkbox"]');
      p && p.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const p = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let c = 0; c < p.length; c++) {
        p[c].classList.remove("ln-row-selected");
        const f = p[c].querySelector("[data-ln-table-row-select]");
        f && (f.checked = !1);
      }
    }
    this._updateFooter();
  }, i.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const o = this._lastTotal != null ? this._lastTotal : this._data.length, p = this.visibleCount, c = p < o;
    if (this._totalSpan && (this._totalSpan.textContent = t(o)), this._filteredSpan && (this._filteredSpan.textContent = c ? t(p) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !c), this._selectedSpan) {
      const f = this.selectedIds.size;
      this._selectedSpan.textContent = f > 0 ? t(f) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", f === 0);
    }
  }, i.prototype._focusRow = function(o) {
    for (let p = 0; p < o.length; p++)
      o[p].classList.remove("ln-row-focused"), o[p].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < o.length) {
      const p = o[this._focusedRowIndex];
      p.classList.add("ln-row-focused"), p.setAttribute("tabindex", "0"), p.focus(), p.scrollIntoView({ block: "nearest" });
    }
  }, i.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter)) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, H(h, d, i, "ln-table");
})();
(function() {
  const h = "data-ln-list", d = "lnList", E = "data-ln-list-empty";
  if (window[d] !== void 0) return;
  function m(t) {
    let e = t;
    for (; e && e !== document.body && e !== document.documentElement; ) {
      const o = getComputedStyle(e).overflowY;
      if (o === "auto" || o === "scroll") return e;
      e = e.parentElement;
    }
    return null;
  }
  function l(t) {
    if (!t) return 0;
    const e = getComputedStyle(t), i = parseFloat(e.marginTop) || 0, o = parseFloat(e.marginBottom) || 0;
    return t.offsetHeight + i + o;
  }
  function s(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const e = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== t ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== t ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(i) {
      const o = i.detail || {};
      e._data = o.data || [], e._lastTotal = o.total != null ? o.total : e._data.length, e._lastFiltered = o.filtered != null ? o.filtered : e._data.length, e.totalCount = e._lastTotal, e.visibleCount = e._lastFiltered, e.isLoaded = !0, t.classList.remove("ln-list--loading"), e._vStart = -1, e._vEnd = -1, e._applyFilterAndSort(), e._render(), e._updateFooter(), L(t, "ln-list:rendered", {
        list: e.name,
        total: e.totalCount,
        visible: e.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(i) {
      const o = i.detail && i.detail.loading;
      t.classList.toggle("ln-list--loading", !!o), o && (e.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(i) {
      (i.target.closest("[data-ln-list-clear-all]") || i.target.closest("[data-ln-data-list-clear-all]")) && (e.currentFilters = {}, L(t, "ln-list:clear-filters", { list: e.name }), e._requestData());
    }, t.addEventListener("click", this._onClearAll), this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(i) {
      if (i.target.closest("[data-ln-item-select]") || i.target.closest("[data-ln-item-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const o = i.target.closest("[data-ln-item]");
      if (!o) return;
      const p = o.getAttribute("data-ln-item-id"), c = o._lnRecord || {};
      L(t, "ln-list:item-click", {
        list: e.name,
        id: p,
        record: c
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(i) {
      const o = i.target.closest("[data-ln-item-action]");
      if (!o) return;
      i.stopPropagation();
      const p = o.closest("[data-ln-item]");
      if (!p) return;
      const c = o.getAttribute("data-ln-item-action"), f = p.getAttribute("data-ln-item-id"), r = p._lnRecord || {};
      L(t, "ln-list:item-action", {
        list: e.name,
        id: f,
        action: c,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(i) {
      i.preventDefault(), e.currentSearch = i.detail.term, L(t, "ln-list:search", {
        list: e.name,
        query: e.currentSearch
      }), e._requestData();
    }, t.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), L(t, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      e.tbody.children.length > 0 && (e._emptyObserver.disconnect(), e._emptyObserver = null, e._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(i) {
      i.preventDefault(), e._searchTerm = i.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), L(t, "ln-list:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-list-clear]")) return;
      e._searchTerm = "";
      const p = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (p) {
        const c = p.tagName === "INPUT" ? p : p.querySelector("input");
        c && (c.value = "");
      }
      e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), L(t, "ln-list:filter", {
        term: "",
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("click", this._onClear)), this;
  }
  s.prototype._parseChildren = function() {
    const t = Array.from(this.tbody.children).filter((e) => !e.classList.contains("ln-list__spacer"));
    this._data = [], t.length > 0 && (this._itemHeight = l(t[0]) || 50);
    for (let e = 0; e < t.length; e++) {
      const i = t[e], o = i.getAttribute("data-ln-item-id") || i.getAttribute("id"), p = i.textContent.trim().toLowerCase();
      let c = null;
      if (this.isDataDriven) {
        c = {}, o != null && (c.id = o);
        const f = i.querySelectorAll("[data-ln-list-field]");
        for (let r = 0; r < f.length; r++) {
          const u = f[r], a = u.getAttribute("data-ln-list-field");
          a && (c[a] = u.textContent.trim());
        }
      }
      this._data.push({
        html: i.outerHTML,
        searchText: p,
        id: o,
        ...c
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, s.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), e = this.currentFilters || {}, i = Object.keys(e).length > 0;
      if (this._filteredData = this._data.filter(function(f) {
        if (t) {
          let r = !1;
          for (const u in f)
            if (f.hasOwnProperty(u) && typeof f[u] == "string" && u !== "html" && u !== "searchText" && f[u].toLowerCase().indexOf(t) !== -1) {
              r = !0;
              break;
            }
          if (!r) return !1;
        }
        if (i)
          for (const r in e) {
            const u = e[r];
            if (u && u.length > 0) {
              const a = f[r], n = a != null ? String(a) : "";
              if (u.indexOf(n) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const o = this.currentSort.field, p = this.currentSort.direction === "desc" ? -1 : 1, c = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(f, r) {
        return f < r ? -1 : f > r ? 1 : 0;
      };
      this._filteredData.sort(function(f, r) {
        const u = f[o], a = r[o];
        if (typeof u == "number" && typeof a == "number")
          return (u - a) * p;
        const n = u != null ? String(u) : "", y = a != null ? String(a) : "";
        return c(n, y) * p;
      });
    } else {
      const t = this._searchTerm;
      t ? this._filteredData = this._data.filter(function(e) {
        return e.searchText.indexOf(t) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, s.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const t = this._lastTotal, e = this.visibleCount;
        if (t === 0 || this._filteredData.length === 0 || e === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const t = this._filteredData.length;
        t === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, s.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, e = document.createDocumentFragment();
      for (let i = 0; i < t.length; i++) {
        const o = this._buildItem(t[i]);
        if (!o) break;
        e.appendChild(o);
      }
      this.tbody.textContent = "", this.tbody.appendChild(e), this._selectable && this._updateSelectAll();
    } else {
      const t = [], e = this._filteredData;
      for (let i = 0; i < e.length; i++) t.push(e[i].html);
      this.tbody.innerHTML = t.join("");
    }
  }, s.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), e = t.gridTemplateColumns;
    let i = 1;
    if (e && e !== "none") {
      const p = e.trim().split(/\s+/).filter(Boolean);
      p.length > 0 && (i = p.length);
    }
    const o = parseFloat(t.rowGap);
    return { columns: i, rowGap: isNaN(o) ? 0 : o };
  }, s.prototype._measureItemHeight = function() {
    if (this.isDataDriven) {
      if (this._data.length > 0) {
        const t = this._buildItem(this._data[0]);
        t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._itemHeight = l(t) || 50, this.tbody.textContent = "");
      }
    } else {
      const t = this.tbody.children;
      t.length > 0 && (this._itemHeight = l(t[0]) || 50);
    }
  }, s.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = m(this.dom);
    const e = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      t._itemHeight = 0, t._measureItemHeight(), t._vStart = -1, t._vEnd = -1, t._renderVirtual();
    }, e.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const t = this._filteredData, e = t.length, i = this._itemHeight;
    if (!i || !e) return;
    const o = this._scrollContainer;
    let p, c;
    if (o) {
      const x = this.tbody.getBoundingClientRect(), I = o.getBoundingClientRect(), R = o === this.tbody ? 0 : x.top - I.top + o.scrollTop;
      p = o.scrollTop - R, c = o.clientHeight;
    } else {
      const I = this.tbody.getBoundingClientRect().top + window.scrollY;
      p = window.scrollY - I, c = window.innerHeight;
    }
    const f = this._readGridLayout(), r = f.columns, u = f.rowGap, a = i + u, n = Math.ceil(e / r);
    let y = Math.max(0, Math.floor(p / a) - 15);
    y = Math.min(y, n);
    const g = Math.ceil(c / a) + 30, b = Math.min(y + g, n), A = Math.min(y * r, e), w = Math.min(b * r, e);
    if (A === this._vStart && w === this._vEnd) return;
    this._vStart = A, this._vEnd = w;
    const T = y * a, C = (n - b) * a;
    if (this.isDataDriven) {
      const x = document.createDocumentFragment();
      if (T > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = T + "px", x.appendChild(I);
      }
      for (let I = A; I < w; I++) {
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
      T > 0 && (x += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${T}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let I = A; I < w; I++)
        x += t[I].html;
      C > 0 && (x += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${C}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = x;
    }
  }, s.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const e = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount, o = this.currentSearch && (i < e || i === 0), p = o ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = lt(this.dom, p, "ln-list"), !t) {
        const c = this.dom.querySelector("template[data-ln-empty]");
        if (c) {
          const f = o ? "search" : "initial", r = c.content.querySelector(`[data-ln-empty-when="${f}"]`) || c.content.firstElementChild;
          r && (t = document.importNode(r, !0));
        }
      }
    } else {
      const e = this.dom.querySelector(`template[${E}]`);
      e && (t = document.importNode(e.content, !0));
    }
    if (t)
      if (t.tagName === "LI" || t.tagName === "TR")
        this.tbody.appendChild(t);
      else {
        const e = document.createElement(this.isUl ? "li" : "div");
        e.appendChild(t), this.tbody.appendChild(e);
      }
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, s.prototype._buildItem = function(t) {
    const e = lt(this.dom, this.name + "-row", "ln-list");
    if (!e) return null;
    const i = e.querySelector("[data-ln-item]") || e.firstElementChild;
    if (!i) return null;
    if (bt(i, t), X(i, t), i._lnRecord = t, t.id != null && (i.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      i.classList.add("ln-item-selected");
      const o = i.querySelector("[data-ln-item-select]");
      o && (o.checked = !0);
    }
    return i;
  }, s.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(e) {
      const i = e.target.closest("[data-ln-item-select]");
      if (!i) return;
      const o = i.closest("[data-ln-item]");
      if (!o) return;
      const p = o.getAttribute("data-ln-item-id");
      p != null && (i.checked ? (t.selectedIds.add(String(p)), o.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(p)), o.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), L(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const e = t._selectAllCheckbox.checked, i = t.tbody.querySelectorAll("[data-ln-item]");
      for (let o = 0; o < i.length; o++) {
        const p = i[o], c = p.getAttribute("data-ln-item-id"), f = p.querySelector("[data-ln-item-select]");
        c != null && (e ? (t.selectedIds.add(String(c)), p.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(c)), p.classList.remove("ln-item-selected")), f && (f.checked = e));
      }
      L(t.dom, "ln-list:select-all", { list: t.name, selected: e }), L(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, s.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    let e = t.length > 0;
    for (let i = 0; i < t.length; i++) {
      const o = t[i].getAttribute("data-ln-item-id");
      if (o != null && !this.selectedIds.has(String(o))) {
        e = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = e;
  }, s.prototype._requestData = function() {
    jt(this, "ln-list:request-data", "list");
  }, s.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const t = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount, i = e < t;
    if (this._totalSpan && (this._totalSpan.textContent = t), this._filteredSpan && (this._filteredSpan.textContent = i ? e : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const o = this.selectedIds.size;
      this._selectedSpan.textContent = o > 0 ? o : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", o === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, H(h, d, s, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", d = "lnCircularProgress";
  if (window[d] !== void 0) return;
  const E = "http://www.w3.org/2000/svg", v = 36, _ = 16, m = 2 * Math.PI * _;
  function l(o) {
    return this.dom = o, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), i.call(this), e.call(this), o.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  l.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[d]);
  };
  function s(o, p) {
    const c = document.createElementNS(E, o);
    for (const f in p)
      c.setAttribute(f, p[f]);
    return c;
  }
  function t() {
    this.svg = s("svg", {
      viewBox: "0 0 " + v + " " + v,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: v / 2,
      cy: v / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: v / 2,
      cy: v / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + v / 2 + " " + v / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function e() {
    const o = this, p = new MutationObserver(function(c) {
      for (const f of c)
        (f.attributeName === "data-ln-circular-progress" || f.attributeName === "data-ln-circular-progress-max" || f.attributeName === "data-ln-circular-progress-label") && i.call(o);
    });
    p.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = p;
  }
  function i() {
    const o = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, p = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let c = p > 0 ? o / p * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100);
    const f = m - c / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", f);
    const r = this.dom.getAttribute("data-ln-circular-progress-label"), u = r !== null ? r : Math.round(c) + "%";
    this.labelEl.textContent = u, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(p));
    const a = Math.max(0, Math.min(o, p));
    this.dom.setAttribute("aria-valuenow", String(a)), this.dom.setAttribute("aria-valuetext", u), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: o,
      max: p,
      percentage: c
    });
  }
  H(h, d, l, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", d = "lnSortable", E = "data-ln-sortable-handle";
  if (window[d] !== void 0) return;
  function v(m) {
    this.dom = m, this.isEnabled = m.getAttribute(h) !== "disabled", this._dragging = null, m.setAttribute("aria-roledescription", "sortable list");
    const l = this;
    return this._onPointerDown = function(s) {
      l.isEnabled && l._handlePointerDown(s);
    }, m.addEventListener("pointerdown", this._onPointerDown), this;
  }
  v.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, v.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, v.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), L(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[d]);
  }, v.prototype._handlePointerDown = function(m) {
    let l = m.target.closest("[" + E + "]"), s;
    if (l) {
      for (s = l; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + E + "]")) return;
      for (s = m.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      l = s;
    }
    const e = Array.from(this.dom.children).indexOf(s);
    if (V(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: e
    }).defaultPrevented) return;
    m.preventDefault(), l.setPointerCapture(m.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: e
    });
    const o = this, p = function(f) {
      o._handlePointerMove(f);
    }, c = function(f) {
      o._handlePointerEnd(f), l.removeEventListener("pointermove", p), l.removeEventListener("pointerup", c), l.removeEventListener("pointercancel", c);
    };
    l.addEventListener("pointermove", p), l.addEventListener("pointerup", c), l.addEventListener("pointercancel", c);
  }, v.prototype._handlePointerMove = function(m) {
    if (!this._dragging) return;
    const l = Array.from(this.dom.children), s = this._dragging;
    for (const t of l)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of l) {
      if (t === s) continue;
      const e = t.getBoundingClientRect(), i = e.top + e.height / 2;
      if (m.clientY >= e.top && m.clientY < i) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (m.clientY >= i && m.clientY <= e.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, v.prototype._handlePointerEnd = function(m) {
    if (!this._dragging) return;
    const l = this._dragging, s = Array.from(this.dom.children), t = s.indexOf(l);
    let e = null, i = null;
    for (const o of s) {
      if (o.classList.contains("ln-sortable--drop-before")) {
        e = o, i = "before";
        break;
      }
      if (o.classList.contains("ln-sortable--drop-after")) {
        e = o, i = "after";
        break;
      }
    }
    for (const o of s)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (l.classList.remove("ln-sortable--dragging"), l.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== l) {
      i === "before" ? this.dom.insertBefore(l, e) : this.dom.insertBefore(l, e.nextElementSibling);
      const p = Array.from(this.dom.children).indexOf(l);
      L(this.dom, "ln-sortable:reordered", {
        item: l,
        oldIndex: t,
        newIndex: p
      });
    }
    this._dragging = null;
  };
  function _(m) {
    const l = m[d];
    if (!l) return;
    const s = m.getAttribute(h) !== "disabled";
    s !== l.isEnabled && (l.isEnabled = s, L(m, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: m }));
  }
  H(h, d, v, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-confirm", d = "lnConfirm", E = "data-ln-confirm-timeout";
  if (window[d] !== void 0) return;
  function _(...l) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...l);
  }
  function m(l) {
    _("constructor called on", l), this.dom = l, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = l.querySelector("[data-ln-confirm-idle]"), this.activeEl = l.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = l.textContent.trim(), this.confirmText = l.getAttribute(h) || "Confirm?");
    const s = this;
    return this._onClick = function(t) {
      if (_("click handler, confirming:", s.confirming, "submitted:", s._submitted, "target:", t.target), !s.confirming)
        t.preventDefault(), t.stopImmediatePropagation(), s._enterConfirm();
      else {
        if (s._submitted) return;
        s._submitted = !0, s._reset();
      }
    }, l.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const l = parseFloat(this.dom.getAttribute(E));
    return isNaN(l) || l <= 0 ? 3 : l;
  }, m.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden"), this.originalAriaLabel = this.dom.getAttribute("aria-label");
      const s = this.activeEl ? this.activeEl.textContent.trim() : "";
      s && (this.dom.setAttribute("aria-label", s), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = s, this.dom.appendChild(this.alertNode));
    } else {
      var l = this.dom.querySelector("svg.ln-icon use");
      l && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = l.getAttribute("href"), l.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const l = this, s = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      l._reset();
    }, s);
  }, m.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null;
    else if (this.isIconButton) {
      var l = this.dom.querySelector("svg.ln-icon use");
      l && this.originalIconHref && l.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    _("destroy called on", this.dom), this.dom[d] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[d]);
  }, H(h, d, m, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", d = "lnTranslations";
  if (window[d] !== void 0) return;
  const E = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function v(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(h + "-default") || "", this.badgesEl = _.querySelector("[" + h + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const m = _.getAttribute(h + "-locales");
    if (this.locales = E, m)
      try {
        this.locales = JSON.parse(m);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const l = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && l.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && l.removeLanguage(s.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  v.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of _) {
      const l = m.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of l)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, v.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const m of _) {
      const l = m.getAttribute("data-ln-translatable-lang");
      l && l !== this.defaultLang && this.activeLanguages.add(l);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, v.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let m = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      m++;
      const t = vt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const e = t.querySelector("[data-ln-translations-lang]");
      e.setAttribute("data-ln-translations-lang", s), e.textContent = this.locales[s], e.addEventListener("click", function(i) {
        i.ctrlKey || i.metaKey || i.button === 1 || (i.preventDefault(), i.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(s));
      }), this.menuEl.appendChild(t);
    }
    const l = this.dom.querySelector("[" + h + "-add]");
    l && (l.style.display = m === 0 ? "none" : "");
  }, v.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(m) {
      const l = vt("ln-translations-badge", "ln-translations");
      if (!l) return;
      const s = l.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", m);
      const t = s.querySelector("span");
      t.textContent = _.locales[m] || m.toUpperCase();
      const e = s.querySelector("button");
      e.setAttribute("aria-label", "Remove " + (_.locales[m] || m.toUpperCase())), e.addEventListener("click", function(i) {
        i.ctrlKey || i.metaKey || i.button === 1 || (i.preventDefault(), i.stopPropagation(), _.removeLanguage(m));
      }), _.badgesEl.appendChild(l);
    });
  }, v.prototype.addLanguage = function(_, m) {
    if (this.activeLanguages.has(_)) return;
    const l = this.locales[_] || _;
    if (V(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: l
    }).defaultPrevented) return;
    this.activeLanguages.add(_), m = m || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const e of t) {
      const i = e.getAttribute("data-ln-translatable"), o = e.getAttribute("data-ln-translations-prefix") || "", p = e.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!p) continue;
      const c = p.cloneNode(!1);
      o ? c.name = o + "[trans][" + _ + "][" + i + "]" : c.name = "trans[" + _ + "][" + i + "]", c.value = m[i] !== void 0 ? m[i] : "", c.removeAttribute("id"), c.placeholder = l + " translation", c.setAttribute("data-ln-translatable-lang", _);
      const f = e.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = f.length > 0 ? f[f.length - 1] : p;
      r.parentNode.insertBefore(c, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: l
    });
  }, v.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || V(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const l = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const s of l)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: _
    });
  }, v.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, v.prototype.hasLanguage = function(_) {
    return this.activeLanguages.has(_);
  }, v.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const _ = this.defaultLang, m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const l of m)
      l.getAttribute("data-ln-translatable-lang") !== _ && l.parentNode.removeChild(l);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[d];
  }, H(h, d, v, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", d = "lnAutosave", E = "data-ln-autosave-clear", v = "data-ln-autosave-debounce-input", _ = "ln-autosave:";
  if (window[d] !== void 0) return;
  function l(i) {
    const o = s(i);
    if (!o) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", i);
      return;
    }
    this.dom = i, this.key = o;
    let p = null;
    function c() {
      const a = zt(i, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(o, JSON.stringify(a));
      } catch {
        return;
      }
      L(i, "ln-autosave:saved", { target: i, data: a });
    }
    function f() {
      let a;
      try {
        a = localStorage.getItem(o);
      } catch {
        return;
      }
      if (!a) return;
      let n;
      try {
        n = JSON.parse(a);
      } catch {
        return;
      }
      if (V(i, "ln-autosave:before-restore", { target: i, data: n }).defaultPrevented) return;
      const g = Vt(i, n);
      for (let b = 0; b < g.length; b++)
        g[b].dispatchEvent(new Event("input", { bubbles: !0 })), g[b].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(i, "ln-autosave:restored", { target: i, data: n });
    }
    function r() {
      try {
        localStorage.removeItem(o);
      } catch {
        return;
      }
      L(i, "ln-autosave:cleared", { target: i });
    }
    this._onFocusout = function(a) {
      const n = a.target;
      t(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && c();
    }, this._onChange = function(a) {
      const n = a.target;
      t(n) && n.name && !n.hasAttribute("data-ln-autosave-exclude") && c();
    }, this._onSubmit = function() {
      r();
    }, this._onReset = function() {
      r();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + E + "]") && r();
    }, i.addEventListener("focusout", this._onFocusout), i.addEventListener("change", this._onChange), i.addEventListener("submit", this._onSubmit), i.addEventListener("reset", this._onReset), i.addEventListener("click", this._onClearClick);
    const u = e(i);
    return u > 0 && (this._onInput = function(a) {
      const n = a.target;
      !t(n) || !n.name || n.hasAttribute("data-ln-autosave-exclude") || (p !== null && clearTimeout(p), p = setTimeout(c, u));
    }, i.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return p;
    }, f(), this;
  }
  l.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const i = this._getInputTimer();
        i !== null && clearTimeout(i);
      }
      L(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function s(i) {
    const p = i.getAttribute(h) || i.id;
    return p ? _ + window.location.pathname + ":" + p : null;
  }
  function t(i) {
    const o = i.tagName;
    return o === "INPUT" || o === "TEXTAREA" || o === "SELECT";
  }
  function e(i) {
    if (!i.hasAttribute(v)) return 0;
    const o = i.getAttribute(v);
    if (o === "" || o === null) return 1e3;
    const p = parseInt(o, 10);
    return isNaN(p) || p < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", i), 1e3) : p;
  }
  H(h, d, l, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", d = "lnAutoresize";
  if (window[d] !== void 0) return;
  function E(v) {
    if (v.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", v.tagName), this;
    this.dom = v;
    const _ = this;
    return this._onInput = function() {
      _._resize();
    }, v.addEventListener("input", this._onInput), this._resize(), this;
  }
  E.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[d]);
  }, H(h, d, E, "ln-autoresize");
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
  let l = 0;
  function s(u) {
    return !!(v[u] || _[u] || m[u] || u === "link");
  }
  function t(u) {
    this.dom = u;
    const a = this;
    if (this._textarea = u.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", u), this;
    const n = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), n && this._surface.setAttribute("data-placeholder", n);
    const y = this._textarea.id;
    if (y) {
      const w = u.querySelector('label[for="' + y + '"]');
      w && (w.id || (w.id = y + "-label"), this._surface.setAttribute("aria-labelledby", w.id));
    }
    this._surface.id = y ? y + "-surface" : "ln-editor-surface-" + ++l;
    const g = this._textarea.value.trim();
    g && (this._surface.innerHTML = g);
    const b = u.querySelector('[role="toolbar"]');
    if (b && b.nextSibling ? u.insertBefore(this._surface, b.nextSibling) : u.appendChild(this._surface), b) {
      b.setAttribute("aria-controls", this._surface.id);
      const w = b.querySelectorAll("[data-ln-editor-action]");
      for (let T = 0; T < w.length; T++) {
        const C = w[T].getAttribute("data-ln-editor-action");
        s(C) && w[T].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      a._syncToTextarea(), L(a.dom, "ln-editor:changed", {
        html: a._textarea.value,
        target: a.dom
      });
    }, this._onMousedownToolbar = function(w) {
      w.target.closest("[data-ln-editor-action]") && w.preventDefault();
    }, this._onClickToolbar = function(w) {
      const T = w.target.closest("[data-ln-editor-action]");
      if (!T) return;
      const C = T.getAttribute("data-ln-editor-action");
      a._execAction(C);
    }, this._onPaste = function(w) {
      o(a, w);
    }, this._onKeydown = function(w) {
      f(a, w);
    }, this._onSelectionChange = function() {
      document.contains(a._surface) && a._updateActiveStates();
    }, this._onFocus = function() {
      L(a.dom, "ln-editor:focus", { target: a.dom });
    }, this._onBlur = function() {
      a._syncToTextarea(), L(a.dom, "ln-editor:blur", { target: a.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), b && (b.addEventListener("mousedown", this._onMousedownToolbar), b.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(w) {
      const T = w.detail && w.detail.html;
      T !== void 0 && (a._surface.innerHTML = T, a._syncToTextarea(), L(a.dom, "ln-editor:changed", {
        html: a._textarea.value,
        target: a.dom
      }));
    }, u.addEventListener("ln-editor:set-content", this._onSetContent);
    const A = this._textarea.form;
    return A && (this._onFormReset = function() {
      setTimeout(function() {
        a._surface.innerHTML = a._textarea.value, L(u, "ln-editor:changed", {
          html: a._textarea.value,
          target: u
        });
      }, 0);
    }, A.addEventListener("reset", this._onFormReset)), this;
  }
  t.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, t.prototype._execAction = function(u) {
    if (!(!u || V(this.dom, "ln-editor:before-change", {
      action: u,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), v[u])
        document.execCommand(v[u], !1, null);
      else if (_[u]) {
        const n = _[u], y = e(this._surface);
        y && y.toLowerCase() === n ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + n + ">");
      } else m[u] ? document.execCommand(m[u], !1, null) : u === "link" ? r(this) : u === "unlink" ? document.execCommand("unlink", !1, null) : u === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, t.prototype._updateActiveStates = function() {
    const u = this.dom.querySelector('[role="toolbar"]');
    if (!u) return;
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return;
    const n = a.anchorNode;
    if (!n || !this._surface.contains(n)) return;
    const y = u.querySelectorAll("[data-ln-editor-action]");
    for (let g = 0; g < y.length; g++) {
      const b = y[g], A = b.getAttribute("data-ln-editor-action");
      let w = !1;
      if (v[A])
        try {
          w = document.queryCommandState(v[A]);
        } catch {
        }
      else if (_[A]) {
        const T = e(this._surface);
        w = T && T.toLowerCase() === _[A];
      } else if (m[A])
        try {
          w = document.queryCommandState(m[A]);
        } catch {
        }
      else A === "link" && (w = !!i(a.anchorNode, "A", this._surface));
      s(A) && b.setAttribute("aria-pressed", String(w)), w ? b.classList.add("ln-editor-active") : b.classList.remove("ln-editor-active");
    }
  }, t.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, t.prototype.setHTML = function(u) {
    this._surface && (this._surface.innerHTML = u, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, t.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const u = this.dom.querySelector('[role="toolbar"]');
    u && (u.removeEventListener("mousedown", this._onMousedownToolbar), u.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const a = this._textarea ? this._textarea.form : null;
    a && this._onFormReset && a.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const n = this.dom.querySelector(".ln-editor__link-popover");
    n && n.remove(), L(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function e(u) {
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return null;
    let n = a.anchorNode;
    if (!n) return null;
    for (; n && n !== u; ) {
      if (n.nodeType === 1) {
        const y = n.tagName;
        if (y === "H2" || y === "H3" || y === "H4" || y === "BLOCKQUOTE" || y === "PRE" || y === "P")
          return y;
      }
      n = n.parentNode;
    }
    return null;
  }
  function i(u, a, n) {
    for (; u && u !== n; ) {
      if (u.nodeType === 1 && u.tagName === a)
        return u;
      u = u.parentNode;
    }
    return null;
  }
  function o(u, a) {
    a.preventDefault();
    let n = "";
    if (a.clipboardData && (n = a.clipboardData.getData("text/html"), !n)) {
      const g = a.clipboardData.getData("text/plain");
      g && (n = g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), n = "<p>" + n + "</p>");
    }
    if (!n) return;
    const y = p(n);
    y && document.execCommand("insertHTML", !1, y);
  }
  function p(u) {
    const a = document.createElement("div");
    return a.innerHTML = u, c(a), a.innerHTML;
  }
  function c(u) {
    const a = Array.from(u.childNodes);
    for (let n = 0; n < a.length; n++) {
      const y = a[n];
      if (y.nodeType !== 3) {
        if (y.nodeType !== 1) {
          u.removeChild(y);
          continue;
        }
        if (E[y.tagName]) {
          const g = Array.from(y.attributes);
          for (let b = 0; b < g.length; b++) {
            const A = g[b].name;
            if (y.tagName === "A" && A === "href") {
              const w = y.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(w) || y.removeAttribute("href");
            } else
              y.removeAttribute(A);
          }
          y.tagName === "A" && y.setAttribute("rel", "noopener noreferrer"), c(y);
        } else {
          for (; y.firstChild; )
            u.insertBefore(y.firstChild, y);
          u.removeChild(y);
        }
      }
    }
  }
  function f(u, a) {
    if (!(a.ctrlKey || a.metaKey)) return;
    let n = null;
    switch (a.key.toLowerCase()) {
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
    n && (a.preventDefault(), u._execAction(n));
  }
  function r(u) {
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return;
    const n = i(a.anchorNode, "A", u._surface), y = a.getRangeAt(0).cloneRange(), g = u.dom.querySelector(".ln-editor__link-popover");
    g && g.remove();
    const b = lt(u.dom, "ln-editor-link-popover", "ln-editor");
    if (!b) return;
    const A = b.firstElementChild;
    if (!A) return;
    const w = A.querySelector('input[type="url"]'), T = A.querySelector('[data-ln-editor-action="confirm-link"]'), C = A.querySelector('[data-ln-editor-action="cancel-link"]');
    n && (w.value = n.getAttribute("href") || "");
    const x = u.dom.querySelector('[role="toolbar"]');
    x ? x.after(A) : u.dom.insertBefore(A, u._surface), w.focus();
    function I() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(y);
    }
    function R() {
      const B = w.value.trim();
      if (A.remove(), I(), u._surface.focus(), B)
        if (n)
          n.setAttribute("href", B), n.setAttribute("rel", "noopener noreferrer"), u._syncToTextarea(), L(u.dom, "ln-editor:changed", {
            html: u._textarea.value,
            target: u.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const j = window.getSelection();
          if (j && j.anchorNode) {
            const W = i(j.anchorNode, "A", u._surface);
            W && (W.setAttribute("rel", "noopener noreferrer"), u._syncToTextarea());
          }
        }
      else n && document.execCommand("unlink", !1, null);
    }
    function P() {
      A.remove(), I(), u._surface.focus();
    }
    T.addEventListener("click", R), C.addEventListener("click", P), w.addEventListener("keydown", function(B) {
      B.key === "Enter" ? (B.preventDefault(), R()) : B.key === "Escape" && (B.preventDefault(), P());
    });
  }
  H(h, d, t, "ln-editor");
})();
(function() {
  const h = "data-ln-validate", d = "lnValidate", E = "data-ln-validate-errors", v = "data-ln-validate-error", _ = "ln-validate-valid", m = "ln-validate-invalid", l = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[d] !== void 0) return;
  function s(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const e = this, i = t.tagName, o = t.type, p = i === "SELECT" || o === "checkbox" || o === "radio";
    this._onInput = function() {
      e._touched = !0, e.validate();
    }, this._onChange = function() {
      e._touched = !0, e.validate();
    }, this._onSetCustom = function(f) {
      const r = f.detail && f.detail.error;
      if (!r) return;
      e._customErrors.add(r), e._touched = !0;
      const u = t.closest(".form-element");
      if (u) {
        const a = u.querySelector("[" + v + '="' + r + '"]');
        a && a.classList.remove("hidden");
      }
      t.classList.remove(_), t.classList.add(m), t.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(f) {
      const r = f.detail && f.detail.error, u = t.closest(".form-element");
      if (r) {
        if (e._customErrors.delete(r), u) {
          const a = u.querySelector("[" + v + '="' + r + '"]');
          a && a.classList.add("hidden");
        }
      } else
        e._customErrors.forEach(function(a) {
          if (u) {
            const n = u.querySelector("[" + v + '="' + a + '"]');
            n && n.classList.add("hidden");
          }
        }), e._customErrors.clear();
      e._touched && e.validate();
    }, p || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const c = t.form;
    return c && (this._onFormReset = function() {
      e.reset();
    }, c.addEventListener("reset", this._onFormReset)), this;
  }
  s.prototype.validate = function() {
    const t = this.dom, e = t.validity, o = t.checkValidity() && this._customErrors.size === 0, p = t.closest(".form-element");
    if (p) {
      const f = p.querySelector("[" + E + "]");
      if (f) {
        const r = f.querySelectorAll("[" + v + "]");
        for (let u = 0; u < r.length; u++) {
          const a = r[u].getAttribute(v), n = l[a];
          n && (e[n] ? r[u].classList.remove("hidden") : r[u].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(_, o), t.classList.toggle(m, !o), t.setAttribute("aria-invalid", o ? "false" : "true"), L(t, o ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), o;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, m), this.dom.removeAttribute("aria-invalid");
    const t = this.dom.closest(".form-element");
    if (t) {
      const e = t.querySelectorAll("[" + v + "]");
      for (let i = 0; i < e.length; i++)
        e[i].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const t = this.dom.form;
    t && this._onFormReset && t.removeEventListener("reset", this._onFormReset), this.dom.classList.remove(_, m), this.dom.removeAttribute("aria-invalid"), L(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[d];
  }, H(h, d, s, "ln-validate");
})();
(function() {
  const h = "data-ln-form", d = "lnForm", E = "data-ln-form-action-edit", v = "data-ln-form-action-method", _ = "data-ln-form-scope";
  if (window[d] !== void 0) return;
  function m(l) {
    this.dom = l, this._baseAction = l.getAttribute("action") || "";
    const s = this;
    return this._onLnFill = function(t) {
      t.target === s.dom && (t.detail ? (s.fill(t.detail), s._applyActionMode(t.detail)) : s.dom.reset());
    }, this._onReset = function() {
      s._applyActionMode(null);
    }, this._onSubmit = function(t) {
      if (!s.dom.hasAttribute(_)) return;
      const e = s.dom.querySelector('input[name="_method"]');
      let i = e && e.value !== "" ? e.value.toUpperCase() : s.dom.method.toUpperCase();
      if (i !== "POST" && i !== "PUT" && i !== "PATCH") return;
      t.preventDefault();
      const o = zt(s.dom), p = s.dom.getAttribute(_);
      delete o._method, delete o._token;
      const c = {
        scope: p || null,
        action: s._baseAction,
        actionResolved: s.dom.getAttribute("action") || "",
        method: i,
        data: o,
        form: s.dom,
        claimed: !1
      };
      L(s.dom, "ln-form:submit-record", c), c.claimed || console.warn("[ln-form] ln-form:submit-record was not claimed. Check the data-ln-form-scope name, or make sure this form is nested inside a [data-ln-data-coordinator] element.");
    }, l.addEventListener("ln-fill", this._onLnFill), l.addEventListener("reset", this._onReset), l.addEventListener("submit", this._onSubmit), this;
  }
  m.prototype.fill = function(l) {
    const s = Vt(this.dom, l);
    for (let t = 0; t < s.length; t++) {
      const e = s[t], i = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
  }, m.prototype._ensureMethodInput = function() {
    let l = this.dom.querySelector('input[name="_method"]');
    return l || (l = document.createElement("input"), l.type = "hidden", l.name = "_method", l.value = "", this.dom.appendChild(l)), l;
  }, m.prototype._applyActionMode = function(l) {
    if (!this.dom.hasAttribute(E)) return;
    const s = l && l.id != null && l.id !== "" ? l.id : null, t = this._ensureMethodInput();
    if (s !== null) {
      const e = this.dom.getAttribute(E);
      e ? this.dom.setAttribute("action", e.replace(":id", encodeURIComponent(s))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(s)), t.value = this.dom.getAttribute(v) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), t.value = "";
  }, m.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("submit", this._onSubmit), L(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[d]);
  }, H(h, d, m, "ln-form");
})();
(function() {
  const h = "lnFill";
  if (window[h] !== void 0) return;
  const d = { lnFillForm: !0, lnFillStore: !0 };
  document.addEventListener("click", function(E) {
    if (E.ctrlKey || E.metaKey || E.button === 1) return;
    const v = E.target.closest("[data-ln-fill-form]");
    if (!v) return;
    const _ = v.getAttribute("data-ln-fill-form"), m = document.getElementById(_);
    if (!m) return;
    const l = {}, s = v.dataset;
    for (const e in s) {
      if (!e.startsWith("lnFill") || d[e]) continue;
      const i = e.slice(6);
      i && (l[i.charAt(0).toLowerCase() + i.slice(1)] = s[e]);
    }
    const t = Object.keys(l).length > 0;
    window.lnCore.lnFill(m, t ? l : null);
  }), window[h] = !0;
})();
(function() {
  const h = "lnModalFill";
  if (window[h] !== void 0) return;
  const d = { lnFillForm: !0, lnFillStore: !0 };
  function E(_) {
    const m = {}, l = _.dataset;
    for (const s in l) {
      if (!s.startsWith("lnFill") || d[s]) continue;
      const t = s.slice(6);
      t && (m[t.charAt(0).toLowerCase() + t.slice(1)] = l[s]);
    }
    return m;
  }
  function v(_, m) {
    const l = window.CSS && CSS.escape ? CSS.escape(m) : m, s = document.querySelectorAll('[data-ln-fill-id="' + l + '"]');
    if (s.length === 0) return null;
    for (let t = 0; t < s.length; t++) {
      const e = s[t].getAttribute("data-ln-fill-form");
      if (e) {
        const i = document.getElementById(e);
        if (i && _.contains(i)) return s[t];
      }
    }
    return s[0];
  }
  document.addEventListener("ln-modal:open", function(_) {
    const m = _.detail;
    if (!m || !("param" in m)) return;
    const l = m.target;
    if (!l) return;
    const s = m.param;
    if (s == null) {
      window.lnCore.lnFill(l, null);
      return;
    }
    const t = v(l, s);
    if (!t) return;
    const e = E(t);
    window.lnCore.lnFill(l, e);
  }), window[h] = !0;
})();
(function() {
  const h = "data-ln-slug-from", d = "lnSlug";
  if (window[d] !== void 0) return;
  function E(_) {
    return String(_).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function v(_) {
    if (_.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", _.tagName), this;
    const m = _.form;
    if (!m)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", _), this;
    const l = _.getAttribute(h), s = m.elements[l];
    if (!s)
      return console.warn('[ln-slug] Source field "' + l + '" not found in form:', _), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + l + '" is a RadioNodeList (same-name group) — single source field required:', _), this;
    this.dom = _, this.source = s, this._pristine = _.value === "", this._mirroring = !1;
    const t = this;
    return this._onSource = function() {
      t._pristine && t._mirror();
    }, this._onSlug = function() {
      t._mirroring || (t._pristine = t.dom.value === "");
    }, s.addEventListener("input", this._onSource), _.addEventListener("input", this._onSlug), this;
  }
  v.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = E(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, v.prototype.destroy = function() {
    this.dom[d] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[d]);
  }, H(h, d, v, "ln-slug");
})();
(function() {
  const h = "data-ln-time", d = "lnTime";
  if (window[d] !== void 0) return;
  const E = {}, v = {};
  function _(b) {
    return b.getAttribute("data-ln-time-locale") || $(b);
  }
  function m(b, A) {
    const w = (b || "") + "|" + JSON.stringify(A);
    return E[w] || (E[w] = new Intl.DateTimeFormat(b, A)), E[w];
  }
  function l(b) {
    const A = b || "";
    return v[A] || (v[A] = new Intl.RelativeTimeFormat(b, { numeric: "auto", style: "narrow" })), v[A];
  }
  const s = /* @__PURE__ */ new Set();
  let t = null;
  function e() {
    t || (t = setInterval(o, 6e4));
  }
  function i() {
    t && (clearInterval(t), t = null);
  }
  function o() {
    for (const b of s) {
      if (!document.body.contains(b.dom)) {
        s.delete(b);
        continue;
      }
      a(b);
    }
    s.size === 0 && i();
  }
  function p(b, A) {
    const w = _t(A), T = (A || "").toLowerCase().split("-")[0], C = m(A, { dateStyle: "long", timeStyle: "short" }), x = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (w && x !== T && w.monthsLong) {
      const I = w.monthsLong[b.getMonth()], R = b.getDate(), P = b.getFullYear(), B = String(b.getHours()).padStart(2, "0"), j = String(b.getMinutes()).padStart(2, "0");
      return `${R} ${I} ${P} во ${B}:${j}`;
    }
    return C.format(b);
  }
  function c(b, A) {
    const w = /* @__PURE__ */ new Date(), T = { month: "short", day: "numeric" };
    b.getFullYear() !== w.getFullYear() && (T.year = "numeric");
    const C = _t(A), x = (A || "").toLowerCase().split("-")[0], I = m(A, T), R = I.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (C && R !== x && C.monthsShort) {
      const P = C.monthsShort[b.getMonth()], B = b.getDate(), j = b.getFullYear() !== w.getFullYear() ? " " + b.getFullYear() : "";
      return `${B} ${P}${j}`;
    }
    return I.format(b);
  }
  function f(b, A) {
    return m(A, { dateStyle: "medium" }).format(b);
  }
  function r(b, A) {
    return m(A, { timeStyle: "short" }).format(b);
  }
  function u(b, A) {
    const w = Math.floor(Date.now() / 1e3), C = Math.floor(b.getTime() / 1e3) - w, x = Math.abs(C);
    if (x < 10) return l(A).format(0, "second");
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
      return c(b, A);
    return l(A).format(R, I);
  }
  function a(b) {
    const A = b.dom.getAttribute("datetime");
    if (!A) return;
    const w = Number(A);
    if (isNaN(w)) return;
    const T = new Date(w * 1e3), C = b.dom.getAttribute(h) || "short", x = _(b.dom);
    let I;
    switch (C) {
      case "relative":
        I = u(T, x);
        break;
      case "full":
        I = p(T, x);
        break;
      case "date":
        I = f(T, x);
        break;
      case "time":
        I = r(T, x);
        break;
      default:
        I = c(T, x);
        break;
    }
    b.dom.textContent = I, C !== "full" && (b.dom.title = p(T, x));
  }
  function n(b) {
    return this.dom = b, a(this), b.getAttribute(h) === "relative" && (s.add(this), e()), this;
  }
  n.prototype.render = function() {
    a(this);
  }, n.prototype.destroy = function() {
    s.delete(this), s.size === 0 && i(), delete this.dom[d];
  };
  function y(b) {
    const A = b[d];
    if (!A) return;
    b.getAttribute(h) === "relative" ? (s.add(A), e()) : (s.delete(A), s.size === 0 && i()), a(A);
  }
  function g(b) {
    b.nodeType === 1 && b.hasAttribute && b.hasAttribute(h) && b[d] && a(b[d]);
  }
  H(h, d, n, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: y,
    onInit: g
  });
})();
(function() {
  const h = "data-ln-data-store", d = "lnDataStore";
  if (window[d] !== void 0) return;
  const E = "ln_app_cache", v = "_meta", _ = "1.0";
  let m = null, l = null;
  const s = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (k) => {
        const D = Math.random() * 16 | 0;
        return (k === "x" ? D : D & 3 | 8).toString(16);
      });
    }
  }
  function e(S) {
    S && S.name === "QuotaExceededError" && L(document, "ln-store:quota-exceeded", { error: S });
  }
  function i() {
    const S = {};
    for (const k of document.querySelectorAll(`[${h}]`)) {
      const D = k.getAttribute(h);
      if (D) {
        const q = k.getAttribute("data-ln-data-store-indexes") || k.getAttribute("data-ln-store-indexes") || "";
        S[D] = {
          indexes: q.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return S;
  }
  function o() {
    return l || (l = new Promise((S) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), S(null);
      const k = i(), D = Object.keys(k), q = indexedDB.open(E);
      q.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), S(null);
      }, q.onsuccess = (O) => {
        const F = O.target.result, M = Array.from(F.objectStoreNames);
        if (!(!M.includes(v) || D.some((ft) => !M.includes(ft))))
          return p(F), m = F, S(F);
        const Z = F.version;
        F.close();
        const nt = indexedDB.open(E, Z + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), S(null);
        }, nt.onupgradeneeded = (ft) => {
          const rt = ft.target.result;
          rt.objectStoreNames.contains(v) || rt.createObjectStore(v, { keyPath: "key" });
          for (const Lt of D)
            if (!rt.objectStoreNames.contains(Lt)) {
              const le = rt.createObjectStore(Lt, { keyPath: "id" });
              for (const Nt of k[Lt].indexes)
                le.createIndex(Nt, Nt, { unique: !1 });
            }
        }, nt.onsuccess = (ft) => {
          const rt = ft.target.result;
          p(rt), m = rt, S(rt);
        };
      };
    }), l);
  }
  function p(S) {
    S.onversionchange = () => {
      S.close(), m = null, l = null;
    };
  }
  function c() {
    return m ? Promise.resolve(m) : (l = null, o());
  }
  async function f(S) {
    if (!pt() || !S) return S;
    const k = { ...S }, D = k.id, q = k._pending, O = await ge(k);
    return !O || !O.encrypted ? S : {
      id: D,
      _pending: q,
      encrypted: !0,
      iv: O.iv,
      data: O.data
    };
  }
  async function r(S) {
    return !S || !S.encrypted || !pt() ? S : be(S);
  }
  const u = (S, k) => c().then((D) => D ? D.transaction(S, k).objectStore(S) : null);
  function a(S) {
    return new Promise((k, D) => {
      S.onsuccess = () => k(S.result), S.onerror = () => {
        e(S.error), D(S.error);
      };
    });
  }
  const n = (S) => u(S, "readonly").then((k) => k ? a(k.getAll()) : []).then((k) => pt() ? Promise.all(k.map((D) => r(D))) : k), y = (S, k) => u(S, "readonly").then((D) => D ? a(D.get(k)) : null).then((D) => D ? r(D) : null), g = (S, k) => (pt() ? f(k) : Promise.resolve(k)).then((q) => u(S, "readwrite").then((O) => O ? a(O.put(q)) : null)), b = (S, k) => u(S, "readwrite").then((D) => D ? a(D.delete(k)) : null), A = (S) => u(S, "readwrite").then((k) => k ? a(k.clear()) : null), w = (S) => u(S, "readonly").then((k) => k ? a(k.count()) : 0), T = (S) => u(v, "readonly").then((k) => k ? a(k.get(S)) : null), C = (S, k) => u(v, "readwrite").then((D) => {
    if (D)
      return k.key = S, a(D.put(k));
  });
  function x(S) {
    this.dom = S, this._name = S.getAttribute(h);
    const k = S.getAttribute("data-ln-data-store-stale") || S.getAttribute("data-ln-store-stale"), D = parseInt(k, 10);
    this._staleThreshold = k === "never" || k === "-1" ? -1 : isNaN(D) ? 300 : D;
    const q = S.getAttribute("data-ln-data-store-search-fields") || S.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = q.split(",").map((O) => O.trim()).filter(Boolean), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, s[this._name] = this, I(this), W(this), this;
  }
  function I(S) {
    S._handlers = {
      create: (k) => R(S, k.detail),
      update: (k) => P(S, k.detail),
      delete: (k) => B(S, k.detail),
      "bulk-delete": (k) => j(S, k.detail)
    };
    for (const [k, D] of Object.entries(S._handlers))
      S.dom.addEventListener(`ln-store:request-${k}`, D);
  }
  function R(S, { data: k = {} } = {}) {
    const D = `_temp_${t()}`, q = { ...k, id: D, _pending: !0 };
    g(S._name, q).then(() => {
      S.totalCount++, L(S.dom, "ln-store:created", { store: S._name, record: q, tempId: D }), L(S.dom, "ln-store:request-remote-create", { tempId: D, data: k });
    });
  }
  function P(S, { id: k, data: D = {}, expected_version: q } = {}) {
    y(S._name, k).then((O) => {
      if (!O) throw new Error(`Record not found: ${k}`);
      S._pendingSnapshots[k] = { ...O };
      const F = { ...O, ...D, _pending: !0 };
      return g(S._name, F).then(() => {
        L(S.dom, "ln-store:updated", { store: S._name, record: F, previous: S._pendingSnapshots[k] }), L(S.dom, "ln-store:request-remote-update", { id: k, data: D, expected_version: q });
      });
    }).catch((O) => console.error("[ln-data-store] Optimistic update failed:", O));
  }
  function B(S, { id: k } = {}) {
    y(S._name, k).then((D) => {
      if (D)
        return S._pendingSnapshots[k] = { ...D }, b(S._name, k).then(() => {
          S.totalCount--, L(S.dom, "ln-store:deleted", { store: S._name, id: k }), L(S.dom, "ln-store:request-remote-delete", { id: k });
        });
    }).catch((D) => console.error("[ln-data-store] Optimistic delete failed:", D));
  }
  function j(S, { ids: k = [] } = {}) {
    k.length && Promise.all(k.map((D) => y(S._name, D))).then((D) => {
      const q = D.filter(Boolean), O = q.map((F) => F.id);
      return S._pendingSnapshots[O.join(",")] = q, ut(S._name, O).then(() => {
        S.totalCount -= O.length, L(S.dom, "ln-store:deleted", { store: S._name, ids: O }), L(S.dom, "ln-store:request-remote-bulk-delete", { ids: O });
      });
    }).catch((D) => console.error("[ln-data-store] Optimistic bulk delete failed:", D));
  }
  function W(S) {
    o().then(() => T(S._name)).then((k) => {
      k && k.schema_version === _ ? (S.lastSyncedAt = k.last_synced_at || null, S.totalCount = k.record_count || 0, S.totalCount > 0 && (S.isLoaded = !0, L(S.dom, "ln-store:ready", { store: S._name, count: S.totalCount, source: "cache" })), L(S.dom, "ln-store:initialized", { store: S._name, hasCache: S.totalCount > 0, lastSyncedAt: S.lastSyncedAt, count: S.totalCount })) : k && k.schema_version !== _ ? A(S._name).then(() => C(S._name, { schema_version: _, last_synced_at: null, record_count: 0 })).then(() => L(S.dom, "ln-store:initialized", { store: S._name, hasCache: !1, lastSyncedAt: null, count: 0 })) : L(S.dom, "ln-store:initialized", { store: S._name, hasCache: !1, lastSyncedAt: null, count: 0 });
    });
  }
  function tt(S) {
    S.isSyncing = !0, L(S.dom, "ln-store:request-remote-sync", { since: S.lastSyncedAt });
  }
  function Q(S, k) {
    return c().then((D) => D ? (pt() ? Promise.all(k.map((O) => f(O))) : Promise.resolve(k)).then((O) => new Promise((F, M) => {
      const K = D.transaction(S, "readwrite"), Z = K.objectStore(S);
      O.forEach((nt) => Z.put(nt)), K.oncomplete = () => F(), K.onerror = () => {
        e(K.error), M(K.error);
      };
    })) : void 0);
  }
  function ut(S, k) {
    return c().then((D) => {
      if (D)
        return new Promise((q, O) => {
          const F = D.transaction(S, "readwrite"), M = F.objectStore(S);
          k.forEach((K) => M.delete(K)), F.oncomplete = () => q(), F.onerror = () => O(F.error);
        });
    });
  }
  const yt = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function N(S, k) {
    if (!k || !k.field) return S;
    const { field: D, direction: q } = k, O = q === "desc";
    return [...S].sort((F, M) => {
      const K = F[D], Z = M[D];
      if (K == null && Z == null) return 0;
      if (K == null) return O ? 1 : -1;
      if (Z == null) return O ? -1 : 1;
      const nt = typeof K == "string" && typeof Z == "string" ? yt.compare(K, Z) : K < Z ? -1 : K > Z ? 1 : 0;
      return O ? -nt : nt;
    });
  }
  function U(S, k) {
    if (!k) return S;
    const D = Object.keys(k).filter((q) => Array.isArray(k[q]) && k[q].length > 0);
    return D.length ? S.filter(
      (q) => D.every((O) => k[O].map(String).includes(String(q[O])))
    ) : S;
  }
  function z(S, k, D) {
    if (!k || !D || !D.length) return S;
    const q = k.toLowerCase();
    return S.filter(
      (O) => D.some((F) => {
        const M = O[F];
        return M != null && String(M).toLowerCase().includes(q);
      })
    );
  }
  function ht(S, k, D) {
    if (!S.length) return 0;
    if (D === "count") return S.length;
    const q = S.map((F) => parseFloat(F[k])).filter((F) => !isNaN(F)), O = q.reduce((F, M) => F + M, 0);
    return D === "sum" ? O : D === "avg" && q.length ? O / q.length : 0;
  }
  function et(S, k) {
    if (!S.presenters || !S.presenters.computed) return k;
    const D = S.presenters.computed;
    return k.map((q) => {
      const O = { ...q };
      for (const [F, M] of Object.entries(D))
        try {
          O[F] = M(q);
        } catch (K) {
          console.error(`[ln-data-store] Decorator computed field failed for ${F}`, K);
        }
      return O;
    });
  }
  x.prototype.getAll = function(S = {}) {
    const k = this;
    return n(k._name).then((D) => {
      const q = D.length;
      S.filters && (D = U(D, S.filters)), S.search && (D = z(D, S.search, k._searchFields));
      const O = D.length;
      if (S.sort && (D = N(D, S.sort)), S.offset || S.limit) {
        const F = S.offset || 0, M = S.limit || D.length;
        D = D.slice(F, F + M);
      }
      return {
        data: et(k, D),
        total: q,
        filtered: O
      };
    });
  }, x.prototype.getById = function(S) {
    return y(this._name, S).then((k) => k ? et(this, [k])[0] : null);
  }, x.prototype.count = function(S) {
    return S ? n(this._name).then((k) => U(k, S).length) : w(this._name);
  }, x.prototype.aggregate = function(S, k) {
    return n(this._name).then((D) => ht(D, S, k));
  }, x.prototype.setPresenters = function(S) {
    this.presenters = S;
  }, x.prototype.applySync = function(S, k, D) {
    const q = this, O = S.length > 0 || k.length > 0;
    let F = Promise.resolve();
    return S.length > 0 && (F = F.then(() => Q(q._name, S))), k.length > 0 && (F = F.then(() => ut(q._name, k))), F.then(() => w(q._name)).then((M) => (q.totalCount = M, C(q._name, {
      schema_version: _,
      last_synced_at: D,
      record_count: M
    }))).then(() => {
      const M = !q.isLoaded;
      q.isLoaded = !0, q.isSyncing = !1, q.lastSyncedAt = D, M ? (L(q.dom, "ln-store:loaded", { store: q._name, count: q.totalCount }), L(q.dom, "ln-store:ready", { store: q._name, count: q.totalCount, source: "server" })) : L(q.dom, "ln-store:synced", {
        store: q._name,
        added: S.length,
        deleted: k.length,
        changed: O
      });
    }).catch((M) => {
      q.isSyncing = !1, console.error("[ln-data-store] applySync failed:", M);
    });
  }, x.prototype.confirmMutation = function(S, k, D) {
    const q = this, O = {
      create: () => b(q._name, S).then(() => g(q._name, k)).then(() => {
        delete q._pendingSnapshots[S], L(q.dom, "ln-store:confirmed", { store: q._name, record: k, tempId: S, action: "create" });
      }),
      update: () => g(q._name, k).then(() => {
        delete q._pendingSnapshots[S], L(q.dom, "ln-store:confirmed", { store: q._name, record: k, action: "update" });
      }),
      delete: () => (delete q._pendingSnapshots[S], L(q.dom, "ln-store:confirmed", { store: q._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete q._pendingSnapshots[S], L(q.dom, "ln-store:confirmed", { store: q._name, record: null, ids: S.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return O[D] ? O[D]() : Promise.resolve();
  }, x.prototype.revertMutation = function(S, k, D) {
    const q = this, O = D || `Server rejected ${k}`, F = {
      create: () => b(q._name, S).then(() => {
        q.totalCount--, delete q._pendingSnapshots[S], L(q.dom, "ln-store:reverted", { store: q._name, record: null, action: "create", error: O });
      }),
      update: () => {
        const M = q._pendingSnapshots[S];
        return M ? g(q._name, M).then(() => {
          delete q._pendingSnapshots[S], L(q.dom, "ln-store:reverted", { store: q._name, record: M, action: "update", error: O });
        }) : Promise.resolve();
      },
      delete: () => {
        const M = q._pendingSnapshots[S];
        return M ? g(q._name, M).then(() => {
          q.totalCount++, delete q._pendingSnapshots[S], L(q.dom, "ln-store:reverted", { store: q._name, record: M, action: "delete", error: O });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const M = q._pendingSnapshots[S];
        return !M || !M.length ? Promise.resolve() : Q(q._name, M).then(() => {
          q.totalCount += M.length, delete q._pendingSnapshots[S], L(q.dom, "ln-store:reverted", { store: q._name, record: null, ids: S.split(","), action: "bulk-delete", error: O });
        });
      }
    };
    return F[k] ? F[k]() : Promise.resolve();
  }, x.prototype.resolveConflict = function(S, k, D) {
    const q = this._pendingSnapshots[S];
    return q ? g(this._name, q).then(() => {
      delete this._pendingSnapshots[S], L(this.dom, "ln-store:conflict", {
        store: this._name,
        local: q,
        remote: k,
        field_diffs: D || null
      });
    }) : Promise.resolve();
  }, x.prototype.forceSync = function() {
    tt(this);
  }, x.prototype.fullReload = function() {
    const S = this;
    return A(S._name).then(() => {
      S.isLoaded = !1, S.lastSyncedAt = null, S.totalCount = 0, tt(S);
    });
  }, x.prototype.destroy = function() {
    if (this._handlers) {
      for (const [S, k] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${S}`, k);
      this._handlers = null;
    }
    delete s[this._name], delete this.dom[d], L(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function Y() {
    return c().then((S) => {
      if (!S) return;
      const k = Array.from(S.objectStoreNames);
      return new Promise((D, q) => {
        const O = S.transaction(k, "readwrite");
        k.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => D(), O.onerror = () => q(O.error);
      });
    }).then(() => {
      Object.values(s).forEach((S) => {
        S.isLoaded = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      });
    });
  }
  H(h, d, x, "ln-data-store"), window[d].clearAll = Y, window[d].init = window[d], window[d].setStorageKey = Bt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Bt);
})();
(function() {
  const h = "data-ln-api-connector", d = "lnApiConnector", E = "lnConnector";
  if (window[d] !== void 0) return;
  function v(s) {
    return s.ok ? s.status === 204 ? null : s.json() : s.json().catch(() => null).then((t) => {
      const e = new Error("HTTP " + s.status + ": " + s.statusText);
      throw e.status = s.status, e.data = t, e;
    });
  }
  function _(s) {
    return this.dom = s, s[d] = this, s[E] = this, this.refreshConfig(), this._handlers = null, m(this), this;
  }
  _.prototype.refreshConfig = function() {
    const s = this.dom;
    this.baseUrl = s.getAttribute("data-ln-api-base-url") || "", this.path = s.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const t = s.getAttribute("data-ln-api-headers") || "";
    this.headers = Gt(t, "ln-api-connector"), (t.toLowerCase().includes("authorization") || t.toLowerCase().includes("bearer") || t.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(s, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, _.prototype._reqHeaders = function() {
    return Object.assign({}, it(this.headers), { "X-LN-Response": "data" });
  }, _.prototype.fetchDelta = function(s) {
    const t = this;
    let e = G(t.baseUrl, t.path);
    return s != null && s !== "" && (e += (e.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(s)), window.fetch(e, { method: "GET", headers: t._reqHeaders(), credentials: t.credentials }).then(v);
  }, _.prototype.create = function(s, t) {
    const e = this;
    return window.fetch(G(e.baseUrl, t || e.path), {
      method: "POST",
      headers: e._reqHeaders(),
      credentials: e.credentials,
      body: JSON.stringify(s)
    }).then(v);
  }, _.prototype.update = function(s, t, e, i) {
    const o = this;
    return e != null && (t = Object.assign({}, t, { expected_version: e })), window.fetch(G(o.baseUrl, i || o.path, s), {
      method: "PUT",
      headers: o._reqHeaders(),
      credentials: o.credentials,
      body: JSON.stringify(t)
    }).then(v);
  }, _.prototype.delete = function(s, t) {
    const e = this;
    return window.fetch(G(e.baseUrl, t || e.path, s), {
      method: "DELETE",
      headers: e._reqHeaders(),
      credentials: e.credentials
    }).then(v);
  }, _.prototype.bulkDelete = function(s, t) {
    const e = this;
    return window.fetch(G(e.baseUrl, t || e.path) + "/bulk-delete", {
      method: "DELETE",
      headers: e._reqHeaders(),
      credentials: e.credentials,
      body: JSON.stringify({ ids: s })
    }).then(v);
  };
  function m(s) {
    s._handlers = {
      sync: function(e) {
        const i = e.detail || {};
        s.fetchDelta(i.since).then(function(o) {
          L(s.dom, "ln-api-connector:fetched", { data: o, since: i.since, meta: i.meta || null });
        }).catch(function(o) {
          L(s.dom, "ln-api-connector:error", {
            action: "sync",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            since: i.since,
            meta: i.meta || null
          });
        });
      },
      create: function(e) {
        const i = e.detail || {};
        s.create(i.data, i.url).then(function(o) {
          L(s.dom, "ln-api-connector:created", { record: o, tempId: i.tempId, meta: i.meta || null });
        }).catch(function(o) {
          L(s.dom, "ln-api-connector:error", {
            action: "create",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            tempId: i.tempId,
            meta: i.meta || null
          });
        });
      },
      update: function(e) {
        const i = e.detail || {};
        s.update(i.id, i.data, i.expected_version, i.url).then(function(o) {
          L(s.dom, "ln-api-connector:updated", { record: o, id: i.id, meta: i.meta || null });
        }).catch(function(o) {
          L(s.dom, "ln-api-connector:error", {
            action: "update",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            id: i.id,
            conflictData: o.status === 409 ? o.data : null,
            meta: i.meta || null
          });
        });
      },
      delete: function(e) {
        const i = e.detail || {};
        s.delete(i.id, i.url).then(function(o) {
          L(s.dom, "ln-api-connector:deleted", { response: o, id: i.id, meta: i.meta || null });
        }).catch(function(o) {
          L(s.dom, "ln-api-connector:error", {
            action: "delete",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            id: i.id,
            meta: i.meta || null
          });
        });
      },
      bulkDelete: function(e) {
        const i = e.detail || {};
        s.bulkDelete(i.ids, i.url).then(function(o) {
          L(s.dom, "ln-api-connector:bulk-deleted", { response: o, ids: i.ids, meta: i.meta || null });
        }).catch(function(o) {
          L(s.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            ids: i.ids,
            meta: i.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      s.dom.addEventListener(e + ":request-sync", s._handlers.sync), s.dom.addEventListener(e + ":request-fetch", s._handlers.sync), s.dom.addEventListener(e + ":request-create", s._handlers.create), s.dom.addEventListener(e + ":request-update", s._handlers.update), s.dom.addEventListener(e + ":request-delete", s._handlers.delete), s.dom.addEventListener(e + ":request-bulk-delete", s._handlers.bulkDelete);
    });
  }
  _.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const s = this;
    s._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      s.dom.removeEventListener(e + ":request-sync", s._handlers.sync), s.dom.removeEventListener(e + ":request-fetch", s._handlers.sync), s.dom.removeEventListener(e + ":request-create", s._handlers.create), s.dom.removeEventListener(e + ":request-update", s._handlers.update), s.dom.removeEventListener(e + ":request-delete", s._handlers.delete), s.dom.removeEventListener(e + ":request-bulk-delete", s._handlers.bulkDelete);
    }), s._handlers = null), L(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[E];
  };
  function l(s) {
    const t = s[d];
    t && t.refreshConfig();
  }
  H(h, d, _, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: l
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", d = "lnCouchDbConnector", E = "lnConnector";
  if (window[d] !== void 0) return;
  function v(l) {
    return this.dom = l, l[d] = this, l[E] = this, this.refreshConfig(), this._handlers = null, _(this), this;
  }
  v.prototype.refreshConfig = function() {
    const l = this.dom;
    this.url = l.getAttribute("data-ln-couchdb-url") || "", this.db = l.getAttribute("data-ln-couchdb-db") || "", this.auth = l.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const s = l.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Gt(s, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), s.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(l, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, v.prototype.fetchDelta = function(l) {
    const s = this, t = ["include_docs=true", "feed=normal"];
    l && t.push("since=" + encodeURIComponent(l));
    const e = G(s.url, s.db, "_changes") + "?" + t.join("&");
    return window.fetch(e, { method: "GET", headers: it(s.headers, s.auth), credentials: s.credentials }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => {
      const o = i.results || [];
      return {
        data: o.filter((p) => !p.deleted && p.doc).map((p) => Object.assign({}, p.doc, { id: p.doc._id })),
        deleted: o.filter((p) => p.deleted).map((p) => p.id),
        synced_at: i.last_seq || l || ""
      };
    });
  }, v.prototype.create = function(l) {
    const s = this, t = Object.assign({ _id: l.id }, l);
    return t._id || delete t._id, window.fetch(G(s.url, s.db), {
      method: "POST",
      headers: it(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify(t)
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => Object.assign({}, t, { id: e.id, _id: e.id, _rev: e.rev }));
  }, v.prototype.update = function(l, s) {
    const t = this, e = Object.assign({ id: String(l), _id: String(l) }, s), i = e._rev || e.rev;
    return (i ? Promise.resolve(i) : window.fetch(G(t.url, t.db, null, l), { method: "GET", headers: it(t.headers, t.auth), credentials: t.credentials }).then((p) => {
      if (!p.ok) throw new Error("Could not retrieve document for revision mapping");
      return p.json().then((c) => c._rev);
    })).then((p) => {
      const c = Object.assign({}, e, { _rev: p });
      delete c.rev;
      const f = Object.assign(it(t.headers, t.auth), { "If-Match": p });
      return window.fetch(G(t.url, t.db, null, l), {
        method: "PUT",
        headers: f,
        credentials: t.credentials,
        body: JSON.stringify(c)
      }).then((r) => {
        if (r.ok) return r.json().then((u) => Object.assign({}, c, { _rev: u.rev }));
        if (r.status === 409) return r.json().then((u) => {
          const a = new Error("Conflict");
          throw a.status = 409, a.data = u, a;
        });
        throw new Error("HTTP " + r.status + ": " + r.statusText);
      });
    });
  }, v.prototype.delete = function(l, s) {
    const t = this;
    return (s ? Promise.resolve(s) : window.fetch(G(t.url, t.db, null, l), { method: "GET", headers: it(t.headers, t.auth), credentials: t.credentials }).then((i) => {
      if (!i.ok) throw new Error("Could not retrieve document for revision delete");
      return i.json().then((o) => o._rev);
    })).then((i) => {
      const o = G(t.url, t.db, null, l) + "?rev=" + encodeURIComponent(i);
      return window.fetch(o, { method: "DELETE", headers: it(t.headers, t.auth), credentials: t.credentials }).then((p) => {
        if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
        return p.json();
      });
    });
  }, v.prototype.bulkDelete = function(l) {
    const s = this;
    return !l || l.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch(G(s.url, s.db, "_all_docs"), {
      method: "POST",
      headers: it(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify({ keys: l })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const i = (t.rows || []).filter((o) => !o.error && o.value && o.value.rev).map((o) => ({ _id: o.id, _rev: o.value.rev, _deleted: !0 }));
      return i.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(G(s.url, s.db, "_bulk_docs"), {
        method: "POST",
        headers: it(s.headers, s.auth),
        credentials: s.credentials,
        body: JSON.stringify({ docs: i })
      }).then((o) => {
        if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
        return o.json();
      }).then((o) => ({ ok: !0, results: o, deletedCount: i.length }));
    });
  };
  function _(l) {
    l._handlers = {
      sync: function(t) {
        const e = t.detail || {};
        l.fetchDelta(e.since).then(function(i) {
          L(l.dom, "ln-couchdb-connector:fetched", { data: i, since: e.since });
        }).catch(function(i) {
          L(l.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: i.message,
            status: i.status || 0,
            since: e.since
          });
        });
      },
      create: function(t) {
        const e = t.detail || {};
        l.create(e.data).then(function(i) {
          L(l.dom, "ln-couchdb-connector:created", { record: i, tempId: e.tempId });
        }).catch(function(i) {
          L(l.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: i.message,
            status: i.status || 0,
            tempId: e.tempId
          });
        });
      },
      update: function(t) {
        const e = t.detail || {}, i = Object.assign({}, e.data);
        e.expected_version !== void 0 && (i._rev = e.expected_version), l.update(e.id, i).then(function(o) {
          L(l.dom, "ln-couchdb-connector:updated", { record: o, id: e.id });
        }).catch(function(o) {
          L(l.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: o.message,
            status: o.status || 0,
            id: e.id,
            conflictData: o.status === 409 ? o.data : null
          });
        });
      },
      delete: function(t) {
        const e = t.detail || {};
        l.delete(e.id, e.rev).then(function(i) {
          L(l.dom, "ln-couchdb-connector:deleted", { response: i, id: e.id });
        }).catch(function(i) {
          L(l.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: i.message,
            status: i.status || 0,
            id: e.id
          });
        });
      },
      bulkDelete: function(t) {
        const e = t.detail || {};
        l.bulkDelete(e.ids).then(function(i) {
          L(l.dom, "ln-couchdb-connector:bulk-deleted", { response: i, ids: e.ids });
        }).catch(function(i) {
          L(l.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: i.message,
            status: i.status || 0,
            ids: e.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      l.dom.addEventListener(t + ":request-sync", l._handlers.sync), l.dom.addEventListener(t + ":request-fetch", l._handlers.sync), l.dom.addEventListener(t + ":request-create", l._handlers.create), l.dom.addEventListener(t + ":request-update", l._handlers.update), l.dom.addEventListener(t + ":request-delete", l._handlers.delete), l.dom.addEventListener(t + ":request-bulk-delete", l._handlers.bulkDelete);
    });
  }
  v.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const l = this;
    l._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      l.dom.removeEventListener(t + ":request-sync", l._handlers.sync), l.dom.removeEventListener(t + ":request-fetch", l._handlers.sync), l.dom.removeEventListener(t + ":request-create", l._handlers.create), l.dom.removeEventListener(t + ":request-update", l._handlers.update), l.dom.removeEventListener(t + ":request-delete", l._handlers.delete), l.dom.removeEventListener(t + ":request-bulk-delete", l._handlers.bulkDelete);
    }), l._handlers = null), L(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[E];
  };
  function m(l) {
    const s = l[d];
    s && s.refreshConfig();
  }
  H(h, d, v, "ln-couchdb-connector", {
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
  const h = "data-ln-data-coordinator", d = "lnDataCoordinator", E = "lnCoordinator";
  if (window[d] !== void 0) return;
  const v = /* @__PURE__ */ new Set();
  let _ = !1, m = null, l = null, s = null;
  function t() {
    _ || (_ = !0, m = function() {
      L(document, "ln-store:online", {}), v.forEach(function(r) {
        r._maybeSync();
      });
    }, l = function() {
      L(document, "ln-store:offline", {});
    }, s = function() {
      document.visibilityState === "visible" && v.forEach(function(r) {
        const a = r.findChildren().store;
        a && a.isLoaded && !a.isSyncing && !r._noAutosync && r._isStale() && a.forceSync();
      });
    }, window.addEventListener("online", m), window.addEventListener("offline", l), document.addEventListener("visibilitychange", s));
  }
  function e() {
    _ && (v.size > 0 || (window.removeEventListener("online", m), window.removeEventListener("offline", l), document.removeEventListener("visibilitychange", s), m = null, l = null, s = null, _ = !1));
  }
  function i() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (u) => {
        const a = Math.random() * 16 | 0;
        return (u === "x" ? a : a & 3 | 8).toString(16);
      });
    }
  }
  const o = ["ln-api-connector", "ln-couchdb-connector"];
  function p(r) {
    return this.dom = r, this._name = r.getAttribute(h), r[d] = this, r[E] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._pendingFormAction = /* @__PURE__ */ new WeakMap(), this._pendingActionById = /* @__PURE__ */ new Map(), this._parseStaleAttributes(), this.refreshMapper(), c(this), v.add(this), t(), this._checkInitialSync(), this;
  }
  p.prototype._parseStaleAttributes = function() {
    const u = this.findChildren().storeEl, a = this.dom.getAttribute("data-ln-data-coordinator-stale") || (u ? u.getAttribute("data-ln-data-store-stale") || u.getAttribute("data-ln-store-stale") : null), n = parseInt(a, 10);
    this._staleThreshold = a === "never" || a === "-1" ? -1 : isNaN(n) ? 300 : n;
    const y = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (u ? u.hasAttribute("data-ln-data-store-no-autosync") || u.hasAttribute("data-ln-store-no-autosync") : !1);
    this._noAutosync = !!y;
  }, p.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const u = this.findChildren().store;
    return !u || !u.lastSyncedAt ? !0 : Date.now() / 1e3 - u.lastSyncedAt > this._staleThreshold;
  }, p.prototype._maybeSync = function() {
    const u = this.findChildren().store;
    !u || this._noAutosync || u.isLoaded && !u.isSyncing && u.forceSync();
  }, p.prototype._checkInitialSync = function() {
    const u = this.findChildren().store;
    !u || !u.isLoaded || this._noAutosync || (u.totalCount === 0 || this._isStale()) && u.forceSync();
  }, p.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const u = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    u && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(u)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(a) {
      return a;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(a) {
      return a;
    });
  }, p.prototype.findChildren = function() {
    const r = this.dom.querySelector("[data-ln-data-store]"), u = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), a = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: r,
      connectorEl: u,
      queueEl: a,
      store: r ? r.lnDataStore || r.lnStore : null,
      connector: u ? u.lnConnector || u.lnApiConnector || u.lnCouchDbConnector : null,
      queue: a ? a.lnApiQueue : null
    };
  }, p.prototype._handleSubmitRecord = function(r) {
    const u = this.findChildren();
    if (!u.storeEl) {
      console.warn('[ln-data-coordinator] ln-form:submit-record claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const a = r.data || {}, n = a.id, y = a.expected_version, g = Object.assign({}, a);
    delete g.id, delete g.expected_version;
    const b = r.method.toUpperCase();
    b === "POST" ? (this._pendingFormAction.set(g, r.action), L(u.storeEl, "ln-store:request-create", { data: g })) : (b === "PUT" || b === "PATCH") && (this._pendingActionById.set(n, r.action), L(u.storeEl, "ln-store:request-update", { id: n, data: g, expected_version: y }));
  };
  function c(r) {
    r._handlers = {
      sync: function(u) {
        r.refreshMapper();
        const a = r.findChildren();
        if (!a.store || !a.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        L(a.connectorEl, "ln-api-connector:request-sync", { since: u.detail.since, meta: { op: "sync" } });
      },
      create: function(u) {
        r.refreshMapper();
        const a = r.findChildren();
        if (!a.store || !a.connector) return;
        const n = u.detail.tempId, y = u.detail.data || {}, g = r._pendingFormAction.get(y) || null;
        r._pendingFormAction.delete(y);
        const b = r.mapper.egress(y);
        a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", {
          chainKey: n,
          op: "create",
          targetId: null,
          payload: b,
          expectedVersion: null,
          meta: { tempId: n, action: g }
        }) : L(a.connectorEl, "ln-api-connector:request-create", {
          data: b,
          url: g,
          meta: { entryId: i(), queued: !1, op: "create", tempId: n }
        });
      },
      update: function(u) {
        r.refreshMapper();
        const a = r.findChildren();
        if (!a.store || !a.connector) return;
        const n = u.detail.id, y = u.detail.expected_version, g = r._pendingActionById.get(n) || null;
        r._pendingActionById.delete(n), a.store.getById(n).then(function(b) {
          if (!b) {
            if (!a.queue) throw new Error("Record not found in cache store: " + n);
            return;
          }
          const A = Object.assign({}, b);
          delete A._pending;
          const w = r.mapper.egress(A);
          a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", {
            chainKey: n,
            op: "update",
            targetId: n,
            payload: w,
            expectedVersion: y,
            meta: { id: n, action: g }
          }) : L(a.connectorEl, "ln-api-connector:request-update", {
            id: n,
            data: w,
            expected_version: y,
            url: g,
            meta: { entryId: i(), queued: !1, op: "update", id: n }
          });
        }).catch(function(b) {
          console.error("[ln-data-coordinator] Update mutation failed:", b), a.queue || a.store.revertMutation(n, "update", b.message || b);
        });
      },
      delete: function(u) {
        r.refreshMapper();
        const a = r.findChildren();
        if (!a.store || !a.connector) return;
        const n = u.detail.id;
        a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", {
          chainKey: n,
          op: "delete",
          targetId: n,
          payload: null,
          expectedVersion: null,
          meta: { id: n }
        }) : L(a.connectorEl, "ln-api-connector:request-delete", {
          id: n,
          meta: { entryId: i(), queued: !1, op: "delete", id: n }
        });
      },
      bulkDelete: function(u) {
        r.refreshMapper();
        const a = r.findChildren();
        if (!a.store || !a.connector) return;
        const n = u.detail.ids || [], y = n.join(",");
        a.queue ? L(a.queueEl, "ln-api-queue:request-enqueue", {
          chainKey: y,
          op: "bulk-delete",
          targetId: null,
          payload: { ids: n },
          expectedVersion: null,
          meta: { bulkKey: y, ids: n }
        }) : L(a.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: n,
          meta: { entryId: i(), queued: !1, op: "bulk-delete", bulkKey: y }
        });
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(u) {
        r.refreshMapper();
        const a = r.findChildren();
        if (!a.store || !a.connector || !a.queue) return;
        const n = u.detail || {}, y = n.entryId, g = n.op, b = n.targetId, A = n.payload, w = n.expectedVersion, T = n.meta || {}, C = T.action || null;
        g === "create" ? L(a.connectorEl, "ln-api-connector:request-create", {
          data: A,
          url: C,
          meta: { entryId: y, queued: !0, op: "create", tempId: T.tempId }
        }) : g === "update" ? L(a.connectorEl, "ln-api-connector:request-update", {
          id: b,
          data: A,
          expected_version: w,
          url: C,
          meta: { entryId: y, queued: !0, op: "update", id: T.id !== void 0 ? T.id : b }
        }) : g === "delete" ? L(a.connectorEl, "ln-api-connector:request-delete", {
          id: b,
          meta: { entryId: y, queued: !0, op: "delete", id: T.id !== void 0 ? T.id : b }
        }) : g === "bulk-delete" ? L(a.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: A && A.ids ? A.ids : [],
          meta: { entryId: y, queued: !0, op: "bulk-delete", bulkKey: T.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", g);
      },
      // ─── Form Write Intake ─────────────────────────────────
      formSubmitRecord: function(u) {
        const a = u.detail;
        if (!a || a.claimed || !a.form) return;
        let n;
        a.scope ? n = a.scope === r._name : n = a.form.closest("[data-ln-data-coordinator]") === r.dom, n && (a.claimed = !0, r._handleSubmitRecord(a));
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(u) {
        const a = r.findChildren();
        if (!a.store) return;
        const n = u.detail.data;
        let y = [], g = [], b = null;
        n && Array.isArray(n) ? (y = n, b = Math.floor(Date.now() / 1e3)) : n && (y = Array.isArray(n.data) ? n.data : [], g = Array.isArray(n.deleted) ? n.deleted : [], b = n.synced_at !== void 0 ? n.synced_at : n.since !== void 0 ? n.since : null);
        const A = y.map((w) => r.mapper.ingress(w));
        a.store.applySync(A, g, b);
      },
      connCreated: function(u) {
        const a = r.findChildren();
        if (!a.store) return;
        const n = u.detail.meta || {}, y = r.mapper.ingress(u.detail.record);
        a.store.confirmMutation(n.tempId, y, "create"), n.queued && a.queue && (L(a.queueEl, "ln-api-queue:request-remap", { oldKey: n.tempId, newId: y.id }), L(a.queueEl, "ln-api-queue:ack", { entryId: n.entryId }));
      },
      connUpdated: function(u) {
        const a = r.findChildren();
        if (!a.store) return;
        const n = u.detail.meta || {}, y = r.mapper.ingress(u.detail.record);
        a.store.confirmMutation(n.id, y, "update"), n.queued && a.queue && L(a.queueEl, "ln-api-queue:ack", { entryId: n.entryId });
      },
      connDeleted: function(u) {
        const a = r.findChildren();
        if (!a.store) return;
        const n = u.detail.meta || {};
        a.store.confirmMutation(n.id, null, "delete"), n.queued && a.queue && L(a.queueEl, "ln-api-queue:ack", { entryId: n.entryId });
      },
      connBulkDeleted: function(u) {
        const a = r.findChildren();
        if (!a.store) return;
        const n = u.detail.meta || {};
        a.store.confirmMutation(n.bulkKey, null, "bulk-delete"), n.queued && a.queue && L(a.queueEl, "ln-api-queue:ack", { entryId: n.entryId });
      },
      connError: function(u) {
        const a = u.detail || {}, n = a.meta || {}, y = n.op || a.action;
        if (y === "sync") {
          console.error("[ln-data-coordinator] Sync failed:", a.error);
          return;
        }
        const g = r.findChildren();
        if (g.store) {
          if (!n.queued) {
            if (console.error("[ln-data-coordinator] " + y + " mutation failed:", a.error), y === "update" && a.status === 409) {
              const b = a.data && a.data.remote ? r.mapper.ingress(a.data.remote) : null, A = a.data ? a.data.field_diffs : null;
              g.store.resolveConflict(n.id, b, A);
            } else {
              const b = y === "create" ? n.tempId : y === "bulk-delete" ? n.bulkKey : n.id;
              g.store.revertMutation(b, y, a.error);
            }
            return;
          }
          if (g.queue) {
            if (a.status === 401 || a.status === 419) {
              L(g.queueEl, "ln-api-queue:nack", { entryId: n.entryId, reason: "auth" });
              return;
            }
            if (a.status === 409 && y === "update") {
              const b = a.data && a.data.remote ? r.mapper.ingress(a.data.remote) : null, A = a.data ? a.data.field_diffs : null;
              g.store.resolveConflict(n.id, b, A), L(g.queueEl, "ln-api-queue:nack", { entryId: n.entryId, reason: "drop" });
              return;
            }
            if (a.status >= 400 && a.status < 500) {
              const b = n.id !== void 0 ? n.id : n.tempId !== void 0 ? n.tempId : n.bulkKey;
              L(r.dom, "ln-store:sync-conflict", { store: g.store._name, action: y, id: b, data: a.data }), g.store.revertMutation(b, y, a.error), L(g.queueEl, "ln-api-queue:nack", { entryId: n.entryId, reason: "drop" }), g.store.forceSync();
              return;
            }
            L(g.queueEl, "ln-api-queue:nack", { entryId: n.entryId, reason: "retry" });
          }
        }
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(u) {
        const n = r.findChildren().store;
        if (!n || r._noAutosync) return;
        (u.detail || {}).hasCache ? r._isStale() && n.forceSync() : n.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(u) {
        r._serveData(u, "table");
      },
      reqListData: function(u) {
        r._serveData(u, "list");
      },
      reqOptions: function(u) {
        r._serveOptions(u);
      },
      reqStat: function(u) {
        r._serveStat(u);
      },
      refresh: function() {
        r._refreshAll();
      },
      refreshSynced: function(u) {
        u.detail && u.detail.changed && r._refreshAll();
      }
    }, r.dom.addEventListener("ln-store:request-remote-sync", r._handlers.sync), r.dom.addEventListener("ln-store:request-remote-create", r._handlers.create), r.dom.addEventListener("ln-store:request-remote-update", r._handlers.update), r.dom.addEventListener("ln-store:request-remote-delete", r._handlers.delete), r.dom.addEventListener("ln-store:request-remote-bulk-delete", r._handlers.bulkDelete), r.dom.addEventListener("ln-api-queue:send", r._handlers.queueSend), r.dom.addEventListener("ln-store:initialized", r._handlers.storeInitialized), document.addEventListener("ln-form:submit-record", r._handlers.formSubmitRecord), o.forEach(function(u) {
      r.dom.addEventListener(u + ":fetched", r._handlers.connFetched), r.dom.addEventListener(u + ":created", r._handlers.connCreated), r.dom.addEventListener(u + ":updated", r._handlers.connUpdated), r.dom.addEventListener(u + ":deleted", r._handlers.connDeleted), r.dom.addEventListener(u + ":bulk-deleted", r._handlers.connBulkDeleted), r.dom.addEventListener(u + ":error", r._handlers.connError);
    }), document.addEventListener("ln-table:request-data", r._handlers.reqTableData), document.addEventListener("ln-list:request-data", r._handlers.reqListData), document.addEventListener("ln-options:request-data", r._handlers.reqOptions), document.addEventListener("ln-stat:request-count", r._handlers.reqStat), r.dom.addEventListener("ln-store:ready", r._handlers.refresh), r.dom.addEventListener("ln-store:loaded", r._handlers.refresh), r.dom.addEventListener("ln-store:created", r._handlers.refresh), r.dom.addEventListener("ln-store:updated", r._handlers.refresh), r.dom.addEventListener("ln-store:deleted", r._handlers.refresh), r.dom.addEventListener("ln-store:synced", r._handlers.refreshSynced);
  }
  p.prototype._ownsStore = function(r) {
    const u = this.findChildren();
    return !!(u.store && u.store._name === r && r);
  }, p.prototype._serveData = function(r, u) {
    const a = r.target, n = u === "table" ? "data-ln-table-store" : "data-ln-list-store", y = a.getAttribute(n);
    if (!y || !this._ownsStore(y)) return;
    this._boundQueries.set(a, {
      sort: r.detail.sort,
      filters: r.detail.filters,
      search: r.detail.search
    });
    const g = this.findChildren().store;
    if (!g.isLoaded) {
      L(a, "ln-" + u + ":set-loading", { loading: !0 });
      return;
    }
    const b = this, A = { sort: r.detail.sort, filters: r.detail.filters, search: r.detail.search };
    g.getAll(A).then(function(w) {
      const T = { data: w.data, total: w.total, filtered: w.filtered };
      L(a, "ln-" + u + ":set-data", T), b._boundDelivered.set(a, !0);
    });
  }, p.prototype._serveOptions = function(r) {
    const u = r.target, a = u.getAttribute("data-ln-options");
    if (!this._ownsStore(a)) return;
    this.findChildren().store.getAll({}).then(function(y) {
      L(u, "ln-options:set-data", { data: y.data });
    });
  }, p.prototype._serveStat = function(r) {
    const u = r.target, a = u.getAttribute("data-ln-stat");
    if (!this._ownsStore(a)) return;
    const n = r.detail.filters || null;
    this.findChildren().store.count(n).then(function(g) {
      L(u, "ln-stat:set-count", { count: g });
    });
  }, p.prototype._refreshAll = function() {
    const r = this, u = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let a = 0; a < u.length; a++) {
      const n = u[a];
      let y, g;
      if (n.hasAttribute("data-ln-table-store") ? (y = n.getAttribute("data-ln-table-store"), g = "table") : n.hasAttribute("data-ln-list-store") ? (y = n.getAttribute("data-ln-list-store"), g = "list") : n.hasAttribute("data-ln-options") ? (y = n.getAttribute("data-ln-options"), g = "options") : n.hasAttribute("data-ln-stat") && (y = n.getAttribute("data-ln-stat"), g = "stat"), !this._ownsStore(y)) continue;
      const b = this.findChildren().store;
      if (g === "table" || g === "list") {
        const A = r._boundQueries.get(n) || { sort: null, filters: {}, search: "" };
        (function(w, T) {
          b.getAll(A).then(function(C) {
            const x = { data: C.data, total: C.total, filtered: C.filtered };
            L(w, "ln-" + T + ":set-data", x), r._boundDelivered.set(w, !0);
          });
        })(n, g);
      } else if (g === "options")
        (function(A) {
          b.getAll({}).then(function(w) {
            L(A, "ln-options:set-data", { data: w.data });
          });
        })(n);
      else if (g === "stat") {
        const A = n.getAttribute("data-ln-stat-filter");
        let w = null;
        if (A) {
          const T = A.indexOf(":");
          if (T !== -1) {
            const C = A.slice(0, T), x = A.slice(T + 1);
            w = {}, w[C] = [x];
          }
        }
        (function(T, C) {
          b.count(C).then(function(x) {
            L(T, "ln-stat:set-count", { count: x });
          });
        })(n, w);
      }
    }
  }, p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const r = this;
    r._handlers && (r.dom.removeEventListener("ln-store:request-remote-sync", r._handlers.sync), r.dom.removeEventListener("ln-store:request-remote-create", r._handlers.create), r.dom.removeEventListener("ln-store:request-remote-update", r._handlers.update), r.dom.removeEventListener("ln-store:request-remote-delete", r._handlers.delete), r.dom.removeEventListener("ln-store:request-remote-bulk-delete", r._handlers.bulkDelete), r.dom.removeEventListener("ln-api-queue:send", r._handlers.queueSend), r.dom.removeEventListener("ln-store:initialized", r._handlers.storeInitialized), document.removeEventListener("ln-form:submit-record", r._handlers.formSubmitRecord), o.forEach(function(u) {
      r.dom.removeEventListener(u + ":fetched", r._handlers.connFetched), r.dom.removeEventListener(u + ":created", r._handlers.connCreated), r.dom.removeEventListener(u + ":updated", r._handlers.connUpdated), r.dom.removeEventListener(u + ":deleted", r._handlers.connDeleted), r.dom.removeEventListener(u + ":bulk-deleted", r._handlers.connBulkDeleted), r.dom.removeEventListener(u + ":error", r._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", r._handlers.reqTableData), document.removeEventListener("ln-list:request-data", r._handlers.reqListData), document.removeEventListener("ln-options:request-data", r._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", r._handlers.reqStat), r.dom.removeEventListener("ln-store:ready", r._handlers.refresh), r.dom.removeEventListener("ln-store:loaded", r._handlers.refresh), r.dom.removeEventListener("ln-store:created", r._handlers.refresh), r.dom.removeEventListener("ln-store:updated", r._handlers.refresh), r.dom.removeEventListener("ln-store:deleted", r._handlers.refresh), r.dom.removeEventListener("ln-store:synced", r._handlers.refreshSynced), r._handlers = null), r._boundQueries = null, r._boundDelivered = null, r._pendingFormAction = null, r._pendingActionById = null, v.delete(this), e(), delete this.dom[d], delete this.dom[E];
  };
  function f(r, u) {
    const a = r[d];
    a && u === "data-ln-data-mapper" && a.refreshMapper();
  }
  H(h, d, p, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-api-queue", d = "lnApiQueue";
  if (window[d] !== void 0) return;
  const E = "ln_api_queue", v = "outbox", _ = "_queue_meta", m = [2e3, 5e3, 15e3, 6e4, 3e5], l = 8;
  let s = null, t = null;
  function e() {
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
        const w = A.target.result;
        if (!w.objectStoreNames.contains(v)) {
          const T = w.createObjectStore(v, { keyPath: "entryId" });
          T.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), T.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 });
        }
        w.objectStoreNames.contains(_) || w.createObjectStore(_, { keyPath: "key" });
      }, b.onsuccess = (A) => {
        const w = A.target.result;
        w.onversionchange = () => {
          w.close(), s = null, t = null;
        }, s = w, g(w);
      };
    }), t);
  }
  function o() {
    return s ? Promise.resolve(s) : (t = null, i());
  }
  function p(g) {
    return new Promise((b, A) => {
      g.onsuccess = () => b(g.result), g.onerror = () => A(g.error);
    });
  }
  const c = (g, b) => o().then((A) => A ? A.transaction(g, b).objectStore(g) : null);
  function f(g) {
    return c(v, "readwrite").then((b) => b ? p(b.put(g)) : null);
  }
  function r(g) {
    return c(v, "readwrite").then((b) => b ? p(b.delete(g)) : null);
  }
  function u(g) {
    return c(v, "readonly").then((b) => {
      if (!b) return [];
      const A = b.index("by_scope_seq"), w = IDBKeyRange.bound([g, -1 / 0], [g, 1 / 0]);
      return p(A.getAll(w));
    });
  }
  function a(g) {
    return c(_, "readwrite").then((b) => b ? p(b.get("seq")).then((A) => {
      const w = (A && typeof A.value == "number" ? A.value : 0) + 1;
      return c(_, "readwrite").then((T) => p(T.put({ key: "seq", value: w }))).then(() => w);
    }) : 0);
  }
  function n(g) {
    this.dom = g, g[d] = this;
    const b = g.closest("[data-ln-data-coordinator]");
    this.scope = g.getAttribute(h) || (b ? b.getAttribute("data-ln-data-coordinator") : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const A = this;
    return i().then(() => {
      A._emitPendingCount(), A._drain();
    }), this;
  }
  n.prototype._isOnline = function() {
    const g = this.dom.getAttribute("data-ln-api-queue-online");
    return g === "true" ? !0 : g === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const g = this;
    return u(g.scope).then((b) => {
      L(g.dom, "ln-api-queue:pending-count", { count: b.length, scope: g.scope }), b.length === 0 && L(g.dom, "ln-api-queue:drained", { scope: g.scope });
    });
  }, n.prototype._clearTimer = function(g) {
    const b = this._timers.get(g);
    b && (clearTimeout(b), this._timers.delete(g));
  }, n.prototype._scheduleTimer = function(g, b) {
    if (this._timers.has(g)) return;
    const A = this, w = setTimeout(() => {
      A._timers.delete(g), A._drain();
    }, b);
    this._timers.set(g, w);
  }, n.prototype._drain = function() {
    const g = this;
    if (!g._paused && g._isOnline())
      return u(g.scope).then((b) => {
        const A = /* @__PURE__ */ new Map();
        for (const w of b)
          A.has(w.chainKey) || A.set(w.chainKey, []), A.get(w.chainKey).push(w);
        A.forEach((w, T) => {
          w.sort((I, R) => I.seq - R.seq);
          const C = w.find((I) => I.status !== "failed");
          if (!C || C.status === "inflight") return;
          const x = Date.now();
          if (C.nextAttemptAt > x) {
            g._scheduleTimer(T, C.nextAttemptAt - x);
            return;
          }
          g._clearTimer(T), C.status = "inflight", f(C).then(() => {
            L(g.dom, "ln-api-queue:send", {
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
  }, n.prototype._onEnqueue = function(g) {
    const b = this, A = g.detail || {};
    return a(b.scope).then((w) => {
      const T = {
        entryId: e(),
        scope: b.scope,
        chainKey: A.chainKey,
        seq: w,
        op: A.op,
        targetId: A.targetId !== void 0 ? A.targetId : null,
        payload: A.payload,
        expectedVersion: A.expectedVersion !== void 0 ? A.expectedVersion : null,
        meta: A.meta || {},
        attempts: 0,
        nextAttemptAt: 0,
        status: "pending"
      };
      return f(T).then(() => u(b.scope)).then((C) => {
        L(b.dom, "ln-api-queue:enqueued", { entryId: T.entryId, chainKey: T.chainKey, count: C.length }), L(b.dom, "ln-api-queue:pending-count", { count: C.length, scope: b.scope }), b._drain();
      });
    });
  }, n.prototype._onAck = function(g) {
    const b = this, A = g.detail || {};
    return r(A.entryId).then(() => u(b.scope)).then((w) => {
      L(b.dom, "ln-api-queue:pending-count", { count: w.length, scope: b.scope }), w.length === 0 && L(b.dom, "ln-api-queue:drained", { scope: b.scope }), b._drain();
    });
  }, n.prototype._onNack = function(g) {
    const b = this, A = g.detail || {}, w = A.reason;
    return u(b.scope).then((T) => {
      const C = T.find((x) => x.entryId === A.entryId);
      if (C) {
        if (w === "retry")
          return C.attempts = (C.attempts || 0) + 1, C.attempts >= l ? (C.status = "failed", f(C).then(() => (L(b.dom, "ln-api-queue:failed", { entryId: C.entryId, chainKey: C.chainKey, attempts: C.attempts }), u(b.scope))).then((x) => {
            L(b.dom, "ln-api-queue:pending-count", { count: x.length, scope: b.scope });
          })) : (C.nextAttemptAt = Date.now() + m[Math.min(C.attempts - 1, m.length - 1)], C.status = "pending", f(C).then(() => (b._scheduleTimer(C.chainKey, C.nextAttemptAt - Date.now()), u(b.scope))).then((x) => {
            L(b.dom, "ln-api-queue:pending-count", { count: x.length, scope: b.scope });
          }));
        if (w === "drop")
          return r(C.entryId).then(() => u(b.scope)).then((x) => {
            L(b.dom, "ln-api-queue:pending-count", { count: x.length, scope: b.scope }), x.length === 0 && L(b.dom, "ln-api-queue:drained", { scope: b.scope }), b._drain();
          });
        if (w === "auth")
          return C.status = "pending", f(C).then(() => {
            b._paused = !0, L(b.dom, "ln-api-queue:paused", { reason: "auth" }), L(b.dom, "ln-api-queue:auth-required", { entryId: C.entryId, chainKey: C.chainKey });
          });
      }
    });
  }, n.prototype._onRemap = function(g) {
    const b = this, A = g.detail || {}, w = A.oldKey, T = A.newId;
    return u(b.scope).then((C) => {
      const x = C.filter((I) => I.chainKey === w && I.status !== "failed");
      return Promise.all(x.map((I) => (I.targetId === w && (I.targetId = T), I.chainKey = T, f(I))));
    });
  }, n.prototype._onResume = function() {
    this._paused = !1, L(this.dom, "ln-api-queue:resumed", {}), this._drain();
  }, n.prototype._onDrain = function() {
    this._drain();
  }, n.prototype._onClear = function() {
    const g = this;
    return u(g.scope).then((b) => Promise.all(b.map((A) => r(A.entryId)))).then(() => {
      L(g.dom, "ln-api-queue:pending-count", { count: 0, scope: g.scope }), L(g.dom, "ln-api-queue:drained", { scope: g.scope });
    });
  }, n.prototype._bindEvents = function() {
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
  }, n.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const g = this;
    g.dom.removeEventListener("ln-api-queue:request-enqueue", g._handlers.enqueue), g.dom.removeEventListener("ln-api-queue:ack", g._handlers.ack), g.dom.removeEventListener("ln-api-queue:nack", g._handlers.nack), g.dom.removeEventListener("ln-api-queue:request-remap", g._handlers.remap), g.dom.removeEventListener("ln-api-queue:request-resume", g._handlers.resume), g.dom.removeEventListener("ln-api-queue:request-drain", g._handlers.drain), g.dom.removeEventListener("ln-api-queue:request-clear", g._handlers.clear), window.removeEventListener("online", g._onlineHandler), g._timers.forEach((b) => clearTimeout(b)), g._timers.clear(), L(g.dom, "ln-api-queue:destroyed", { scope: g.scope }), delete g.dom[d];
  };
  function y(g) {
    const b = g[d];
    b && b._drain();
  }
  H(h, d, n, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: y
  });
})();
(function() {
  const h = "data-ln-options", d = "lnOptions";
  if (window[d] !== void 0) return;
  function E(v) {
    this.dom = v, this._storeName = v.getAttribute(h), this._valueField = v.getAttribute("data-ln-options-value") || "id", this._labelField = v.getAttribute("data-ln-options-label") || "name";
    const _ = this;
    return this._onSetData = function(m) {
      _._rebuild(m.detail.data || []);
    }, v.addEventListener("ln-options:set-data", this._onSetData), L(v, "ln-options:request-data", { options: this._storeName }), this;
  }
  E.prototype._rebuild = function(v) {
    const _ = this.dom, m = this._valueField, l = this._labelField, s = _.value, t = _.querySelectorAll("option");
    for (let i = t.length - 1; i >= 0; i--)
      t[i].value !== "" && _.removeChild(t[i]);
    for (let i = 0; i < v.length; i++) {
      const o = v[i], p = document.createElement("option");
      p.value = String(o[m]), p.textContent = o[l] != null ? o[l] : "", _.appendChild(p);
    }
    const e = _.options;
    for (let i = 0; i < e.length; i++)
      if (e[i].value === s) {
        _.value = s;
        break;
      }
  }, E.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[d]);
  }, H(h, d, E, "ln-options");
})();
(function() {
  const h = "data-ln-stat", d = "lnStat";
  if (window[d] !== void 0) return;
  function E(_) {
    if (!_) return null;
    const m = _.indexOf(":");
    if (m === -1) return null;
    const l = _.slice(0, m), s = _.slice(m + 1), t = {};
    return t[l] = [s], t;
  }
  function v(_) {
    return this.dom = _, this._storeName = _.getAttribute(h), this._filters = E(_.getAttribute("data-ln-stat-filter")), this._onSetCount = function(m) {
      _.textContent = String(m.detail.count), _.classList.remove("is-loading");
    }, _.addEventListener("ln-stat:set-count", this._onSetCount), L(_, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  v.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[d]);
  }, H(h, d, v, "ln-stat");
})();
(function() {
  const h = "data-ln-store-notify", d = "lnStoreNotify";
  if (window[d] !== void 0) return;
  function E(_, m, l) {
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: _, title: m, message: l }
    }));
  }
  function v(_) {
    this.dom = _, this._savedTitle = _.getAttribute("data-ln-store-notify-saved") || null, this._deletedTitle = _.getAttribute("data-ln-store-notify-deleted") || null, this._failedTitle = _.getAttribute("data-ln-store-notify-failed") || null;
    const m = this;
    return this._onConfirmed = function(l) {
      const s = l.detail || {}, t = s.action || "confirmed";
      let e, i;
      if (t === "create" || t === "update")
        e = m._savedTitle || t, i = s.record && s.record.name ? s.record.name : void 0;
      else if (t === "delete")
        e = m._deletedTitle || t, i = void 0;
      else if (t === "bulk-delete") {
        e = m._deletedTitle || t;
        const o = s.ids ? s.ids.length : 0;
        i = o ? String(o) : void 0;
      } else
        e = m._savedTitle || t, i = void 0;
      E("success", e, i);
    }, this._onReverted = function(l) {
      const s = l.detail || {}, t = s.action || "reverted", e = m._failedTitle || t, i = s.error ? String(s.error) : void 0;
      E("error", e, i);
    }, _.addEventListener("ln-store:confirmed", this._onConfirmed), _.addEventListener("ln-store:reverted", this._onReverted), this;
  }
  v.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-store:confirmed", this._onConfirmed), this.dom.removeEventListener("ln-store:reverted", this._onReverted), delete this.dom[d]);
  }, H(h, d, v, "ln-store-notify");
})();
(function() {
  const h = "ln-icons-sprite", d = "#ln-", E = "#lnc-", v = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let m = null;
  const l = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", e = "lni:v", i = "1";
  function o() {
    try {
      if (localStorage.getItem(e) !== i) {
        for (let n = localStorage.length - 1; n >= 0; n--) {
          const y = localStorage.key(n);
          y && y.indexOf(t) === 0 && localStorage.removeItem(y);
        }
        localStorage.setItem(e, i);
      }
    } catch {
    }
  }
  o();
  function p() {
    return m || (m = document.getElementById(h), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = h, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function c(n) {
    return n.indexOf(E) === 0 ? s + "/" + n.slice(E.length) + ".svg" : l + "/" + n.slice(d.length) + ".svg";
  }
  function f(n, y) {
    const g = y.match(/viewBox="([^"]+)"/), b = g ? g[1] : "0 0 24 24", A = y.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), w = A ? A[1].trim() : "", T = y.match(/<svg([^>]*)>/i), C = T ? T[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = n, x.setAttribute("viewBox", b), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const R = C.match(new RegExp(I + '="([^"]*)"'));
      R && x.setAttribute(I, R[1]);
    }), x.innerHTML = w, p().querySelector("defs").appendChild(x);
  }
  function r(n) {
    if (v.has(n) || _.has(n) || n.indexOf(E) === 0 && !s) return;
    const y = n.slice(1);
    try {
      const g = localStorage.getItem(t + y);
      if (g) {
        f(y, g), v.add(n);
        return;
      }
    } catch {
    }
    _.add(n), fetch(c(n)).then(function(g) {
      if (!g.ok) throw new Error(g.status);
      return g.text();
    }).then(function(g) {
      f(y, g), v.add(n), _.delete(n);
      try {
        localStorage.setItem(t + y, g);
      } catch {
      }
    }).catch(function() {
      _.delete(n);
    });
  }
  function u(n) {
    const y = 'use[href^="' + d + '"], use[href^="' + E + '"]', g = n.querySelectorAll ? n.querySelectorAll(y) : [];
    if (n.matches && n.matches(y)) {
      const b = n.getAttribute("href");
      b && r(b);
    }
    Array.prototype.forEach.call(g, function(b) {
      const A = b.getAttribute("href");
      A && r(A);
    });
  }
  function a() {
    u(document), new MutationObserver(function(n) {
      n.forEach(function(y) {
        if (y.type === "childList")
          y.addedNodes.forEach(function(g) {
            g.nodeType === 1 && u(g);
          });
        else if (y.type === "attributes" && y.attributeName === "href") {
          const g = y.target.getAttribute("href");
          g && (g.indexOf(d) === 0 || g.indexOf(E) === 0) && r(g);
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
  const h = "data-ln-debug", d = "lnDebug";
  if (window[d] !== void 0) return;
  function E(v) {
    return this.dom = v, this;
  }
  E.prototype.destroy = function() {
    delete this.dom[d];
  }, H(h, d, E, "ln-debug");
})();
