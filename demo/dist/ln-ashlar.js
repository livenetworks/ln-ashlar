if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...c) {
    typeof c[0] == "string" && (c[0].startsWith("[ln-") || c[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, c);
  };
}
const Pt = {};
function It(h, c) {
  Pt[h] || (Pt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const y = Pt[h];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (c || "ln-core") + '] Template "' + h + '" not found'), null);
}
function S(h, c, y) {
  h.dispatchEvent(new CustomEvent(c, {
    bubbles: !0,
    detail: y || {}
  }));
}
function Y(h, c, y) {
  const b = new CustomEvent(c, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return h.dispatchEvent(b), b;
}
function se(h, c, y) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const b = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  b[y] = h.name, S(h.dom, c, b);
}
function it(h, c) {
  if (!h || !c) return h;
  const y = h.querySelectorAll("[data-ln-field]");
  for (let u = 0; u < y.length; u++) {
    const a = y[u], d = a.getAttribute("data-ln-field");
    c[d] != null && (a.textContent = c[d]);
  }
  const b = h.querySelectorAll("[data-ln-attr]");
  for (let u = 0; u < b.length; u++) {
    const a = b[u], d = a.getAttribute("data-ln-attr").split(",");
    for (let e = 0; e < d.length; e++) {
      const t = d[e].trim().split(":");
      if (t.length !== 2) continue;
      const i = t[0].trim(), n = t[1].trim();
      c[n] != null && a.setAttribute(i, c[n]);
    }
  }
  const p = h.querySelectorAll("[data-ln-show]");
  for (let u = 0; u < p.length; u++) {
    const a = p[u], d = a.getAttribute("data-ln-show");
    d in c && a.classList.toggle("hidden", !c[d]);
  }
  const f = h.querySelectorAll("[data-ln-class]");
  for (let u = 0; u < f.length; u++) {
    const a = f[u], d = a.getAttribute("data-ln-class").split(",");
    for (let e = 0; e < d.length; e++) {
      const t = d[e].trim().split(":");
      if (t.length !== 2) continue;
      const i = t[0].trim(), n = t[1].trim();
      n in c && a.classList.toggle(i, !!c[n]);
    }
  }
  return h;
}
function Te(h, c) {
  h.matches && h.matches("[data-ln-form], [data-ln-fillable]") && h.dispatchEvent(new CustomEvent("ln-fill", { detail: c ?? null, bubbles: !0 }));
  const y = h.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let b = 0; b < y.length; b++)
    y[b].dispatchEvent(new CustomEvent("ln-fill", { detail: c ?? null, bubbles: !0 }));
  return h;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(h) {
  if (!(!h.target.matches || !h.target.matches("[data-ln-fillable]")))
    if (h.detail)
      it(h.target, h.detail);
    else {
      const c = h.target.querySelectorAll("[data-ln-field]");
      for (let y = 0; y < c.length; y++)
        c[y].textContent = "";
    }
})));
function wt(h, c) {
  if (!h || !c) return h;
  const y = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const f = y.currentNode;
    f.textContent.indexOf("{{") !== -1 && (f.textContent = f.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(u, a) {
        return c[a] !== void 0 ? c[a] : "";
      }
    ));
  }
  const b = function(f, u) {
    return c[u] !== void 0 ? c[u] : "";
  }, p = Array.from(h.querySelectorAll("*"));
  h.nodeType === 1 && p.push(h);
  for (let f = 0; f < p.length; f++) {
    const u = p[f], a = u.attributes;
    for (let d = 0; d < a.length; d++) {
      const e = a[d];
      e.value.indexOf("{{") !== -1 && u.setAttribute(e.name, e.value.replace(/\{\{\s*(\w+)\s*\}\}/g, b));
    }
  }
  return h;
}
function qe(h, c, y, b, p, f) {
  const u = {};
  for (let d = 0; d < h.children.length; d++) {
    const e = h.children[d], t = e.getAttribute("data-ln-key");
    t && (u[t] = e);
  }
  const a = document.createDocumentFragment();
  for (let d = 0; d < c.length; d++) {
    const e = c[d], t = String(b(e));
    let i = u[t];
    if (i)
      p(i, e, d);
    else {
      const n = It(y, f);
      if (!n || (wt(n, e), i = n.firstElementChild, !i)) continue;
      i.setAttribute("data-ln-key", t), p(i, e, d);
    }
    a.appendChild(i);
  }
  h.textContent = "", h.appendChild(a);
}
function st(h, c) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      st(h, c);
    }), console.warn("[" + c + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function mt(h, c, y) {
  if (h) {
    const b = h.querySelector('[data-ln-template="' + c + '"]');
    if (b) return b.content.cloneNode(!0);
  }
  return It(c, y);
}
function Gt(h, c) {
  const y = {}, b = h.querySelectorAll("[" + c + "]");
  for (let p = 0; p < b.length; p++)
    y[b[p].getAttribute(c)] = b[p].textContent, b[p].remove();
  return y;
}
function Bt(h, c, y, b) {
  if (h.nodeType !== 1) return;
  const f = c.indexOf("[") !== -1 || c.indexOf(".") !== -1 || c.indexOf("#") !== -1 ? c : "[" + c + "]", u = Array.from(h.querySelectorAll(f));
  h.matches && h.matches(f) && u.push(h);
  for (const a of u)
    a[y] || (a[y] = new b(a));
}
function Dt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function xe(h) {
  const c = h.querySelector('input[name="_method"]');
  return ((c && c.value !== "" ? c.value : h.method) || "").toUpperCase();
}
function ae(h, c) {
  const y = !!(c && c.typed), b = c && c.exclude, p = {}, f = h.elements, u = {};
  if (y)
    for (let a = 0; a < f.length; a++) {
      const d = f[a];
      d.name && d.type === "checkbox" && !d.disabled && (u[d.name] = (u[d.name] || 0) + 1);
    }
  for (let a = 0; a < f.length; a++) {
    const d = f[a];
    if (!(!d.name || d.disabled || d.type === "file" || d.type === "submit" || d.type === "button") && !(b && d.matches && d.matches(b)))
      if (d.type === "checkbox")
        y && u[d.name] === 1 ? p[d.name] = d.checked : (p[d.name] || (p[d.name] = []), d.checked && p[d.name].push(d.value));
      else if (d.type === "radio")
        d.checked && (p[d.name] = d.value);
      else if (d.type === "select-multiple") {
        p[d.name] = [];
        for (let e = 0; e < d.options.length; e++)
          d.options[e].selected && p[d.name].push(d.options[e].value);
      } else if (y && d.type === "hidden")
        p[d.name] = d.value;
      else if (y && (d.type === "number" || d.type === "range")) {
        const e = Number(d.value);
        p[d.name] = d.value === "" || isNaN(e) ? null : e;
      } else
        p[d.name] = d.value;
  }
  return p;
}
function ke(h) {
  if (typeof h != "string") return !!h;
  const c = h.trim().toLowerCase();
  return c !== "false" && c !== "0" && c !== "" && c !== "off" && c !== "no";
}
function le(h, c) {
  const y = h.elements, b = [], p = {};
  for (let f = 0; f < y.length; f++) {
    const u = y[f];
    u.name && u.type === "checkbox" && (p[u.name] = (p[u.name] || 0) + 1);
  }
  for (let f = 0; f < y.length; f++) {
    const u = y[f];
    if (u.type === "file" || u.type === "submit" || u.type === "button") continue;
    const a = u.getAttribute("data-ln-fill-as") || u.name;
    if (!a || !(a in c)) continue;
    const d = c[a];
    if (u.type === "checkbox") {
      if (Array.isArray(d))
        u.checked = d.indexOf(u.value) !== -1;
      else if (p[u.name] > 1) {
        const e = String(d).split(",").map(function(t) {
          return t.trim();
        });
        u.checked = e.indexOf(u.value) !== -1;
      } else
        u.checked = ke(d);
      b.push(u);
    } else if (u.type === "radio")
      u.checked = u.value === String(d), b.push(u);
    else if (u.type === "select-multiple") {
      if (Array.isArray(d))
        for (let e = 0; e < u.options.length; e++)
          u.options[e].selected = d.indexOf(u.options[e].value) !== -1;
      b.push(u);
    } else
      u.value = d, b.push(u);
  }
  return b;
}
const Xt = {
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
function W(h) {
  const c = h ? h.closest("[lang]") : null, y = (c ? c.getAttribute("lang") || c.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!y) return "en-US";
  const b = y.trim().toLowerCase();
  return b.indexOf("-") === -1 && Xt[b] ? Xt[b] : y;
}
function Jt(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function ce(h, c, { get: y, set: b }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return y ? y.call(this) : c.get.call(this);
    },
    set: function(p) {
      b ? b.call(this, p, (f) => c.set.call(this, f)) : c.set.call(this, p);
    },
    configurable: !0
  });
}
function H(h, c, y, b, p = {}) {
  const f = p.extraAttributes || [], u = p.onAttributeChange || null, a = p.onInit || null;
  function d(e) {
    const t = e || document.body;
    Bt(t, h, c, y), a && a(t);
  }
  return st(function() {
    const e = new MutationObserver(function(i) {
      for (let n = 0; n < i.length; n++) {
        const l = i[n];
        if (l.type === "childList") {
          for (let m = 0; m < l.addedNodes.length; m++) {
            const g = l.addedNodes[m];
            g.nodeType === 1 && (Bt(g, h, c, y), a && a(g));
          }
          for (let m = 0; m < l.removedNodes.length; m++) {
            const g = l.removedNodes[m];
            if (g.nodeType === 1) {
              const s = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", o = Array.from(g.querySelectorAll(s));
              g.matches && g.matches(s) && o.push(g);
              for (let _ = 0; _ < o.length; _++) {
                const v = o[_];
                if (!document.contains(v)) {
                  const A = v[c];
                  A && typeof A.destroy == "function" && A.destroy();
                }
              }
            }
          }
        } else l.type === "attributes" && (u && l.target[c] ? u(l.target, l.attributeName) : (Bt(l.target, h, c, y), a && a(l.target)));
      }
    });
    let t = [];
    if (h.indexOf("[") !== -1) {
      const i = /\[([\w-]+)/g;
      let n;
      for (; (n = i.exec(h)) !== null; )
        t.push(n[1]);
    } else
      t.push(h);
    e.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: t.concat(f)
    });
  }, b || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[c] = d, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    d(document.body);
  }) : d(document.body), d;
}
function de(h, c) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !c) return !1;
  const y = c.getAttribute("href");
  return !(!y || c.getAttribute("target") === "_blank" || c.hasAttribute("download") || y.startsWith("mailto:") || y.startsWith("tel:") || y === "#" || y.startsWith("#") || c.hostname && c.hostname !== window.location.hostname);
}
function X(...h) {
  return h.filter((c) => c != null && c !== "").map((c, y) => y === 0 ? c.replace(/\/+$/, "") : c.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Et(h, c) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, c ? { Authorization: c } : null);
}
function ue(h, c = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (y) {
    return console.error(`[${c}] Invalid headers JSON:`, y), {};
  }
}
const he = {};
function De(h, c) {
  he[h] = c;
}
function Ie(h) {
  return he[h] || { ingress: (c) => c, egress: (c) => c };
}
const fe = {};
function Wt(h, c) {
  if (!h || typeof c != "object") return;
  const y = h.toLowerCase().split("-")[0];
  fe[y] = c;
}
function Lt(h) {
  if (!h) return null;
  const c = h.toLowerCase().split("-")[0];
  return fe[c] || null;
}
Wt("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = De, window.lnCore.getDataMapper = Ie, window.lnCore.registerLocaleFallback = Wt, window.lnCore.getLocaleFallback = Lt, window.lnCore.fillTemplate = wt, window.lnCore.fill = it, window.lnCore.lnFill = Te, window.lnCore.renderList = qe);
function Oe(h, c) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, h(), c && c();
    }));
  };
}
const Re = "ln:";
let bt = null;
function me() {
  if (bt !== null) return bt;
  try {
    if (typeof localStorage > "u")
      return bt = !1, !1;
    const h = "__ln_test__";
    localStorage.setItem(h, h), localStorage.removeItem(h), bt = !0;
  } catch {
    bt = !1;
  }
  return bt;
}
function Me() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function pe(h, c) {
  const y = c.getAttribute("data-ln-persist"), b = y !== null && y !== "" ? y : c.id;
  return b ? Re + h + ":" + Me() + ":" + b : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', c), null);
}
function Mt(h, c) {
  if (!me()) return null;
  const y = pe(h, c);
  if (!y) return null;
  try {
    const b = localStorage.getItem(y);
    return b !== null ? JSON.parse(b) : null;
  } catch {
    return null;
  }
}
function _t(h, c, y) {
  if (!me()) return;
  const b = pe(h, c);
  if (b)
    try {
      y == null ? localStorage.removeItem(b) : localStorage.setItem(b, JSON.stringify(y));
    } catch {
    }
}
function ge(h) {
  return (h || "").replace(/^#/, "");
}
function Nt(h) {
  const c = h === void 0 ? location.hash : h, y = {}, b = ge(c);
  if (!b) return y;
  const p = b.split("&");
  for (let f = 0; f < p.length; f++) {
    const u = p[f];
    if (!u) continue;
    const a = u.indexOf(":"), d = a > -1 ? u.slice(0, a) : u, e = a > -1 ? u.slice(a + 1) : "";
    if (d)
      try {
        y[d] = decodeURIComponent(e);
      } catch {
        y[d] = e;
      }
  }
  return y;
}
function gt(h) {
  if (!h) return null;
  const c = Nt();
  return h in c ? c[h] : null;
}
function ot(h, c) {
  if (!h) return;
  const y = Nt();
  c == null ? delete y[h] : y[h] = String(c);
  const p = Object.keys(y).map(function(f) {
    const u = y[f];
    return u === "" ? f : f + ":" + encodeURIComponent(u);
  }).join("&");
  ge(location.hash) !== p && (location.hash = p);
}
function Qt(h) {
  return h.button === 1 || h.ctrlKey || h.metaKey || h.shiftKey ? !1 : (h.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Nt, window.lnCore.hashGet = gt, window.lnCore.hashSet = ot, window.lnCore.hashLinkClick = Qt);
function Ot(h, c, y, b) {
  const p = typeof b == "number" ? b : 4, f = window.innerWidth, u = window.innerHeight, a = c.width, d = c.height, e = (y || "bottom").split("-"), t = e[0], i = e[1] === "start" || e[1] === "end" ? e[1] : "center", n = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, l = n[t] || n.bottom;
  function m(_) {
    return _ === "top" || _ === "bottom" ? i === "start" ? h.left : i === "end" ? h.right - a : h.left + (h.width - a) / 2 : i === "start" ? h.top : i === "end" ? h.bottom - d : h.top + (h.height - d) / 2;
  }
  function g(_) {
    let v, A, w = !0;
    return _ === "top" ? (v = h.top - p - d, A = m(_), v < 0 && (w = !1)) : _ === "bottom" ? (v = h.bottom + p, A = m(_), v + d > u && (w = !1)) : _ === "left" ? (v = m(_), A = h.left - p - a, A < 0 && (w = !1)) : (v = m(_), A = h.right + p, A + a > f && (w = !1)), { top: v, left: A, side: _, fits: w };
  }
  let r = null;
  for (let _ = 0; _ < l.length; _++) {
    const v = g(l[_]);
    if (v.fits) {
      r = v;
      break;
    }
  }
  r || (r = g(l[0]));
  let s = r.top, o = r.left;
  return a >= f ? o = 0 : (o < 0 && (o = 0), o + a > f && (o = f - a)), d >= u ? s = 0 : (s < 0 && (s = 0), s + d > u && (s = u - d)), { top: s, left: o, placement: r.side };
}
function Ut(h) {
  if (!h) return { width: 0, height: 0 };
  const c = h.style, y = c.visibility, b = c.display, p = c.position;
  c.visibility = "hidden", c.display = "block", c.position = "fixed";
  const f = h.offsetWidth, u = h.offsetHeight;
  return c.visibility = y, c.display = b, c.position = p, { width: f, height: u };
}
let ft = null;
async function Zt(h) {
  if (!h) {
    ft = null;
    return;
  }
  try {
    const c = new TextEncoder(), y = await crypto.subtle.digest("SHA-256", c.encode(h));
    ft = await crypto.subtle.importKey(
      "raw",
      y,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (c) {
    console.error("[ln-core/crypto] Key derivation failed:", c), ft = null;
  }
}
function pt() {
  return ft;
}
async function Ne(h, c = ft) {
  const y = c || ft;
  if (!y || h === void 0 || h === null) return h;
  try {
    const b = new TextEncoder(), p = crypto.getRandomValues(new Uint8Array(12)), f = typeof h == "string" ? h : JSON.stringify(h), u = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      y,
      b.encode(f)
    ), a = btoa(String.fromCharCode(...p)), d = btoa(String.fromCharCode(...new Uint8Array(u)));
    return {
      encrypted: !0,
      iv: a,
      data: d
    };
  } catch (b) {
    return console.error("[ln-core/crypto] Encryption failed:", b), h;
  }
}
async function Fe(h, c = ft) {
  const y = c || ft;
  if (!h || !h.encrypted || !y) return h;
  try {
    const b = new TextDecoder(), p = Uint8Array.from(atob(h.iv), (d) => d.charCodeAt(0)), f = Uint8Array.from(atob(h.data), (d) => d.charCodeAt(0)), u = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: p },
      y,
      f
    ), a = b.decode(u);
    try {
      return JSON.parse(a);
    } catch {
      return a;
    }
  } catch (b) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", b), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), c = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function b(e) {
    return typeof e == "string" ? e : e instanceof URL ? e.href : e instanceof Request ? e.url : String(e);
  }
  function p(e, t) {
    return t && t.method ? String(t.method).toUpperCase() : e instanceof Request ? e.method.toUpperCase() : "GET";
  }
  function f(e, t) {
    return t + " " + e;
  }
  function u(e) {
    return e === "GET" || e === "HEAD";
  }
  function a(e, t) {
    t = t || {};
    const i = b(e), n = p(e, t), l = f(i, n);
    u(n) && c.has(l) && (c.get(l).abort(), c.delete(l));
    const m = new AbortController(), g = t.signal;
    let r = null;
    g && (g.aborted ? m.abort(g.reason) : (r = function() {
      m.abort(g.reason);
    }, g.addEventListener("abort", r, { once: !0 })));
    const s = Object.assign({}, t, { signal: m.signal });
    return c.set(l, m), h(e, s).finally(function() {
      g && r && g.removeEventListener("abort", r), c.get(l) === m && c.delete(l);
    });
  }
  a.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = a;
  function d(e) {
    if (!e.detail || !e.detail.url) return;
    const t = e.target, i = (e.detail.method || (e.detail.body ? "POST" : "GET")).toUpperCase(), n = e.detail.key;
    n && y.has(n) && (y.get(n).abort(), y.delete(n));
    const l = new AbortController(), m = e.detail.signal;
    let g = null;
    m && (m.aborted ? l.abort(m.reason) : (g = function() {
      l.abort(m.reason);
    }, m.addEventListener("abort", g, { once: !0 }))), n && y.set(n, l);
    const r = { method: i, signal: l.signal };
    e.detail.body !== void 0 && (r.body = e.detail.body), window.fetch(e.detail.url, r).then(function(s) {
      m && g && m.removeEventListener("abort", g), n && y.get(n) === l && y.delete(n), S(t, "ln-http:response", {
        ok: s.ok,
        status: s.status,
        response: s
      });
    }).catch(function(s) {
      m && g && m.removeEventListener("abort", g), n && y.get(n) === l && y.delete(n), !(s && s.name === "AbortError") && S(t, "ln-http:error", {
        ok: !1,
        status: 0,
        error: s
      });
    });
  }
  document.addEventListener("ln-http:request", d), window.lnHttp = {
    cancel: function(e) {
      let t = !1;
      return c.forEach(function(i, n) {
        n.endsWith(" " + e) && (i.abort(), c.delete(n), t = !0);
      }), t;
    },
    cancelByKey: function(e) {
      return y.has(e) ? (y.get(e).abort(), y.delete(e), !0) : !1;
    },
    cancelAll: function() {
      c.forEach(function(e) {
        e.abort();
      }), c.clear(), y.forEach(function(e) {
        e.abort();
      }), y.clear();
    },
    get inflight() {
      const e = [];
      return c.forEach(function(t, i) {
        const n = i.indexOf(" ");
        e.push({ method: i.slice(0, n), url: i.slice(n + 1) });
      }), y.forEach(function(t, i) {
        e.push({ key: i });
      }), e;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", d), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-form", c = "lnForm", y = "data-ln-form-action-edit", b = "data-ln-form-action-method";
  if (window[c] !== void 0) return;
  function p(f) {
    this.dom = f, this._baseAction = f.getAttribute("action") || "";
    const u = this;
    return this._onLnFill = function(a) {
      a.target === u.dom && (a.detail ? (u.fill(a.detail), u._applyActionMode(a.detail)) : u.dom.reset());
    }, this._onReset = function() {
      u._applyActionMode(null);
    }, f.addEventListener("ln-fill", this._onLnFill), f.addEventListener("reset", this._onReset), this;
  }
  p.prototype.fill = function(f) {
    const u = le(this.dom, f);
    for (let a = 0; a < u.length; a++) {
      const d = u[a], e = d.tagName === "SELECT" || d.type === "checkbox" || d.type === "radio";
      d.dispatchEvent(new Event(e ? "change" : "input", { bubbles: !0 }));
    }
  }, p.prototype._ensureMethodInput = function() {
    let f = this.dom.querySelector('input[name="_method"]');
    return f || (f = document.createElement("input"), f.type = "hidden", f.name = "_method", f.value = "", this.dom.appendChild(f)), f;
  }, p.prototype._applyActionMode = function(f) {
    if (!this.dom.hasAttribute(y)) return;
    const u = f && f.id != null && f.id !== "" ? f.id : null, a = this._ensureMethodInput();
    if (u !== null) {
      const d = this.dom.getAttribute(y);
      d ? this.dom.setAttribute("action", d.replace(":id", encodeURIComponent(u))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(u)), a.value = this.dom.getAttribute(b) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), a.value = "";
  }, p.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[c]);
  }, H(h, c, p, "ln-form");
})();
(function() {
  const h = "data-ln-validate", c = "lnValidate", y = "data-ln-validate-errors", b = "data-ln-validate-error", p = "ln-validate-valid", f = "ln-validate-invalid", u = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[c] !== void 0) return;
  function a(d) {
    this.dom = d, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const e = this, t = d.tagName, i = d.type, n = t === "SELECT" || i === "checkbox" || i === "radio";
    this._onInput = function() {
      e._touched = !0, e.validate();
    }, this._onChange = function() {
      e._touched = !0, e.validate();
    }, this._onSetCustom = function(m) {
      const g = m.detail && m.detail.error;
      if (!g) return;
      e._customErrors.add(g), e._touched = !0;
      const r = d.closest(".form-element");
      if (r) {
        const s = r.querySelector("[" + b + '="' + g + '"]');
        s && s.classList.remove("hidden");
      }
      d.classList.remove(p), d.classList.add(f), d.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(m) {
      const g = m.detail && m.detail.error, r = d.closest(".form-element");
      if (g) {
        if (e._customErrors.delete(g), r) {
          const s = r.querySelector("[" + b + '="' + g + '"]');
          s && s.classList.add("hidden");
        }
      } else
        e._customErrors.forEach(function(s) {
          if (r) {
            const o = r.querySelector("[" + b + '="' + s + '"]');
            o && o.classList.add("hidden");
          }
        }), e._customErrors.clear();
      e._touched && e.validate();
    }, n || d.addEventListener("input", this._onInput), d.addEventListener("change", this._onChange), d.addEventListener("ln-validate:set-custom", this._onSetCustom), d.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const l = d.form;
    return l && (l.hasAttribute("novalidate") || l.setAttribute("novalidate", ""), this._onFormReset = function() {
      e.reset();
    }, this._onValidateRequest = function(m) {
      e._touched = !0, !e.validate() && m.detail && m.detail.invalidFields && m.detail.invalidFields.push(e.dom);
    }, l.addEventListener("reset", this._onFormReset), l.addEventListener("ln-validate:request-validate", this._onValidateRequest), l._lnValidateGateBound || (l._lnValidateGateBound = !0, l.addEventListener("submit", function(m) {
      const g = { invalidFields: [] };
      S(l, "ln-validate:request-validate", g), g.invalidFields.length > 0 && (m.preventDefault(), g.invalidFields.sort((r, s) => r.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), g.invalidFields[0].focus());
    }))), this;
  }
  a.prototype.validate = function() {
    const d = this.dom, e = d.validity, i = d.checkValidity() && this._customErrors.size === 0, n = d.closest(".form-element");
    if (n) {
      const m = n.querySelector("[" + y + "]");
      if (m) {
        const g = m.querySelectorAll("[" + b + "]");
        for (let r = 0; r < g.length; r++) {
          const s = g[r].getAttribute(b), o = u[s];
          o && (e[o] ? g[r].classList.remove("hidden") : g[r].classList.add("hidden"));
        }
      }
    }
    return d.classList.toggle(p, i), d.classList.toggle(f, !i), d.setAttribute("aria-invalid", i ? "false" : "true"), S(d, i ? "ln-validate:valid" : "ln-validate:invalid", { target: d, field: d.name }), i;
  }, a.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, f), this.dom.removeAttribute("aria-invalid");
    const d = this.dom.closest(".form-element");
    if (d) {
      const e = d.querySelectorAll("[" + b + "]");
      for (let t = 0; t < e.length; t++)
        e[t].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), a.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const d = this.dom.form;
    d && (this._onFormReset && d.removeEventListener("reset", this._onFormReset), this._onValidateRequest && d.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(p, f), this.dom.removeAttribute("aria-invalid"), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[c];
  }, H(h, c, a, "ln-validate");
})();
(function() {
  const h = "data-ln-ajax", c = "lnAjax", y = "data-ln-form-scope";
  if (window[c] !== void 0) return;
  function b(i) {
    if (!i.hasAttribute(h) || i[c]) return;
    i[c] = !0;
    const n = d(i);
    p(n.links), f(n.forms);
  }
  function p(i) {
    for (const n of i) {
      if (n[c + "Trigger"] || n.hostname && n.hostname !== window.location.hostname) continue;
      const l = n.getAttribute("href");
      if (l && l.includes("#")) continue;
      const m = function(g) {
        if (!de(g, n)) return;
        g.preventDefault();
        const r = n.getAttribute("href");
        r && a("GET", r, null, n);
      };
      n.addEventListener("click", m), n[c + "Trigger"] = m;
    }
  }
  function f(i) {
    for (const n of i) {
      if (n[c + "Trigger"]) continue;
      if (n.hasAttribute(y)) {
        n[c + "ScopeWarned"] || (n[c + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const l = function(m) {
        if (m.defaultPrevented) return;
        m.preventDefault();
        const g = n.method.toUpperCase(), r = n.action, s = new FormData(n);
        for (const o of n.querySelectorAll('button, input[type="submit"]'))
          o.disabled = !0;
        a(g, r, s, n, function() {
          for (const o of n.querySelectorAll('button, input[type="submit"]'))
            o.disabled = !1;
        });
      };
      n.addEventListener("submit", l), n[c + "Trigger"] = l;
    }
  }
  function u(i) {
    if (!i[c]) return;
    const n = d(i);
    for (const l of n.links)
      l[c + "Trigger"] && (l.removeEventListener("click", l[c + "Trigger"]), delete l[c + "Trigger"]);
    for (const l of n.forms)
      l[c + "Trigger"] && (l.removeEventListener("submit", l[c + "Trigger"]), delete l[c + "Trigger"]);
    delete i[c];
  }
  function a(i, n, l, m, g) {
    if (Y(m, "ln-ajax:before-start", { method: i, url: n }).defaultPrevented) return;
    S(m, "ln-ajax:start", { method: i, url: n }), m.classList.add("ln-ajax--loading");
    const s = document.createElement("span");
    s.className = "ln-ajax-spinner", m.appendChild(s);
    function o() {
      m.classList.remove("ln-ajax--loading");
      const C = m.querySelector(".ln-ajax-spinner");
      C && C.remove(), g && g();
    }
    let _ = n;
    const v = document.querySelector('meta[name="csrf-token"]'), A = v ? v.getAttribute("content") : null;
    l instanceof FormData && A && l.append("_token", A);
    const w = {
      method: i,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (A && (w.headers["X-CSRF-TOKEN"] = A), i === "GET" && l) {
      const C = new URLSearchParams(l);
      _ = n + (n.includes("?") ? "&" : "?") + C.toString();
    } else i !== "GET" && l && (w.body = l);
    fetch(_, w).then(function(C) {
      const T = C.ok;
      return C.json().then(function(q) {
        return { ok: T, status: C.status, data: q };
      });
    }).then(function(C) {
      const T = C.data;
      if (C.ok) {
        if (T.title && (document.title = T.title), T.content)
          for (const q in T.content) {
            const x = document.getElementById(q);
            x && (x.innerHTML = T.content[q]);
          }
        if (m.tagName === "A") {
          const q = m.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else m.tagName === "FORM" && m.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
        S(m, "ln-ajax:success", { method: i, url: _, data: T });
      } else
        S(m, "ln-ajax:error", { method: i, url: _, status: C.status, data: T });
      if (T.message) {
        const q = T.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: q.type || (C.ok ? "success" : "error"),
            title: q.title || "",
            message: q.body || ""
          }
        }));
      }
      S(m, "ln-ajax:complete", { method: i, url: _ }), o();
    }).catch(function(C) {
      S(m, "ln-ajax:error", { method: i, url: _, error: C }), S(m, "ln-ajax:complete", { method: i, url: _ }), o();
    });
  }
  function d(i) {
    const n = { links: [], forms: [] };
    return i.tagName === "A" && i.getAttribute(h) !== "false" ? n.links.push(i) : i.tagName === "FORM" && i.getAttribute(h) !== "false" ? n.forms.push(i) : (n.links = Array.from(i.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(i.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function e() {
    st(function() {
      new MutationObserver(function(n) {
        for (const l of n)
          if (l.type === "childList") {
            for (const m of l.addedNodes)
              if (m.nodeType === 1 && (b(m), !m.hasAttribute(h))) {
                for (const r of m.querySelectorAll("[" + h + "]"))
                  b(r);
                const g = m.closest && m.closest("[" + h + "]");
                if (g && g.getAttribute(h) !== "false") {
                  const r = d(m);
                  p(r.links), f(r.forms);
                }
              }
          } else l.type === "attributes" && b(l.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function t() {
    for (const i of document.querySelectorAll("[" + h + "]"))
      b(i);
  }
  window[c] = b, window[c].destroy = u, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
const _e = {
  navigate: function(h) {
    Tt(h, { historyAction: "push" });
  },
  replace: function(h) {
    Tt(h, { historyAction: "replace" });
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
}, $t = "data-ln-route", be = "lnRoute";
typeof window < "u" && (window.lnRouter = _e);
const lt = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new WeakMap();
let ye = /* @__PURE__ */ new Map(), ee = !1, zt = null, ve = {}, Ee = {}, jt = null, Kt = !1;
function ne(h, c, y) {
  Kt ? queueMicrotask(function() {
    S(h, c, y);
  }) : S(h, c, y);
}
function Rt(h) {
  try {
    const f = new URL(h, window.location.origin);
    h = f.pathname + f.search + f.hash;
  } catch {
  }
  let [c] = h.split("#"), [y, b] = c.split("?");
  const p = {};
  if (b) {
    const f = new URLSearchParams(b);
    for (const [u, a] of f.entries())
      p[u] = a;
  }
  return y = y.replace(/\/+$/, ""), y === "" && (y = "/"), { path: y, query: p };
}
function we(h, c) {
  if (h.pattern === "*") return 1;
  if (c.pattern === "*") return -1;
  const y = h.segments, b = c.segments, p = Math.max(y.length, b.length);
  for (let f = 0; f < p; f++) {
    const u = y[f], a = b[f];
    if (u === void 0) return 1;
    if (a === void 0) return -1;
    if (u === "*") return 1;
    if (a === "*") return -1;
    const d = u.startsWith(":"), e = a.startsWith(":");
    if (d && !e) return 1;
    if (!d && e) return -1;
  }
  return 0;
}
function Ae(h, c) {
  const y = h.split("/").filter(Boolean);
  for (const b of c) {
    if (b.pattern === "*")
      return {
        route: b,
        params: { wildcard: h }
      };
    const p = b.segments, f = {};
    let u = !0;
    if (!(y.length > p.length && p[p.length - 1] !== "*")) {
      for (let a = 0; a < p.length; a++) {
        const d = p[a], e = y[a];
        if (d === "*") {
          f.wildcard = y.slice(a).join("/");
          break;
        }
        if (e === void 0) {
          u = !1;
          break;
        }
        if (d.startsWith(":"))
          f[d.slice(1)] = decodeURIComponent(e);
        else if (d !== e) {
          u = !1;
          break;
        }
      }
      if (u && (p.indexOf("*") !== -1 || y.length <= p.length))
        return { route: b, params: f };
    }
  }
  return null;
}
function Vt(h, c) {
  if (h !== "__primary__") {
    const b = document.getElementById(c.target);
    return b || console.warn(`[ln-router] Explicit target element #${c.target} not found in DOM`), b;
  }
  const y = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return y || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), y;
}
function Pe(h) {
  if (!h) return;
  const c = Array.from(h.querySelectorAll("*")), y = [h].concat(c);
  for (const p of y)
    for (const f of Object.keys(p))
      if (f.startsWith("ln") && p[f] && typeof p[f].destroy == "function")
        try {
          p[f].destroy();
        } catch (u) {
          console.error(`[ln-router] Error destroying component ${f} on element:`, p, u);
        }
  const b = document.querySelectorAll('[data-ln-popover="open"]');
  for (const p of b) {
    const f = p.lnPopover;
    if (f && f.trigger && h.contains(f.trigger))
      try {
        f.destroy();
      } catch (u) {
        console.error("[ln-router] Error destroying open popover:", u);
      }
  }
}
function Tt(h, c = {}) {
  const { path: y, query: b } = Rt(h), p = /* @__PURE__ */ new Map();
  for (const [t, i] of lt)
    p.set(t, Ae(y, i.sorted));
  const f = lt.has("__primary__"), u = p.get("__primary__");
  if (f && !u) {
    ne(document.body, "ln-router:not-found", { path: y });
    return;
  }
  let a = null;
  if (u && (a = Vt("__primary__", u.route), !a || Y(a, "ln-router:before-navigate", {
    from: zt,
    to: h,
    params: u.params,
    query: b
  }).defaultPrevented))
    return;
  const d = [];
  for (const [t, i] of p) {
    if (!i) continue;
    const n = Vt(t, i.route);
    n && (t !== "__primary__" && n.hasAttribute("data-ln-route-keep") && te.get(n) === i.route.templateNode || d.push({ regionKey: t, match: i, targetEl: n }));
  }
  c.historyAction === "push" ? window.history.pushState(null, "", h) : c.historyAction === "replace" && window.history.replaceState(null, "", h);
  const e = function() {
    for (const { regionKey: t, match: i, targetEl: n } of d) {
      if (!(c.isHydration && n.hasAttribute("data-ln-router-hydrate") && n.children.length > 0)) {
        Pe(n);
        const m = i.route.templateNode.content.cloneNode(!0);
        n.replaceChildren(m);
      }
      if (te.set(n, i.route.templateNode), t === "__primary__" && (i.route.title && (document.title = i.route.title), !c.isHydration)) {
        n.hasAttribute("tabindex") || n.setAttribute("tabindex", "-1");
        const m = n.querySelector("h1, h2, h3, h4, h5, h6");
        m ? (m.setAttribute("tabindex", "-1"), m.focus()) : n.focus(), n.scrollIntoView({ block: "start", behavior: "instant" });
      }
      ne(n, "ln-router:navigated", {
        path: h,
        params: i.params,
        query: b,
        route: i.route,
        target: n,
        region: t
      });
    }
    u && (zt = h, ve = u.params, Ee = b, jt = u.route), ye = new Map(
      Array.from(p.entries()).map(([t, i]) => [t, i ? { route: i.route, params: i.params } : null])
    );
  };
  document.startViewTransition && !c.isHydration ? document.startViewTransition(e) : e();
}
function Be(h) {
  const c = h.target.closest("a");
  if (!c || !de(h, c)) return;
  const y = c.getAttribute("href"), { path: b } = Rt(y), p = lt.get("__primary__");
  if (!p) return;
  Ae(b, p.sorted) && (h.preventDefault(), Tt(y, { historyAction: "push" }));
}
function He(h, c) {
  const y = Object.keys(h), b = Object.keys(c);
  if (y.length !== b.length) return !1;
  for (let p = 0; p < y.length; p++) {
    const f = y[p];
    if (h[f] !== c[f]) return !1;
  }
  return !0;
}
function Ue() {
  const h = window.location.pathname + window.location.search, c = _e.current();
  if (c && c.path != null) {
    const y = Rt(h);
    if (Rt(c.path).path === y.path && He(c.query, y.query))
      return;
  }
  Tt(h, { historyAction: "skip" });
}
function ze() {
  ee || (ee = !0, st(function() {
    document.addEventListener("click", Be), window.addEventListener("popstate", Ue), Kt = !0;
    const h = window.location.pathname + window.location.search + window.location.hash;
    Tt(h, { historyAction: "replace", isHydration: !0 }), Kt = !1;
  }, "ln-router"));
}
function je(h) {
  const c = h.getAttribute($t);
  if (!c) return;
  const y = h.getAttribute("data-ln-route-target") || null;
  if (y === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${c}" rejected.`);
    return;
  }
  const b = y || "__primary__";
  lt.has(b) || lt.set(b, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const p = lt.get(b);
  if (p.routes.has(c)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${c}" in region "${b}"`);
    return;
  }
  const f = h.getAttribute("data-ln-route-title"), u = c.split("/").filter(Boolean), a = {
    pattern: c,
    segments: u,
    target: y,
    title: f,
    templateNode: h
  }, d = Vt(b, a);
  d && d.contains(h) && console.warn(`[ln-router] Route template with pattern "${c}" is declared inside its own outlet element:`, h), p.routes.set(c, a), p.sorted = Array.from(p.routes.values()).sort(we);
}
function Ke(h) {
  const c = h.getAttribute($t);
  if (!c) return;
  const b = h.getAttribute("data-ln-route-target") || null || "__primary__", p = lt.get(b);
  p && (p.routes.delete(c), p.sorted = Array.from(p.routes.values()).sort(we), p.routes.size === 0 && lt.delete(b));
}
function Se(h) {
  return this.dom = h, je(h), this;
}
Se.prototype.destroy = function() {
  Ke(this.dom), delete this.dom[be];
};
H($t, be, Se, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    lt.size > 0 && ze();
  }
});
(function() {
  const h = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0) return;
  function y(p) {
    this.dom = p, this.isOpen = p.getAttribute(h) === "open";
    const f = this;
    return this._onRequestOpen = function() {
      f.dom.setAttribute(h, "open");
    }, this._onRequestClose = function() {
      f.dom.setAttribute(h, "close");
    }, this._onCancel = function(u) {
      u.preventDefault(), f.dom.setAttribute(h, "close");
    }, this._onClickClose = function(u) {
      const a = u.target.closest("[data-ln-modal-close]");
      a && f.dom.contains(a) && (u.preventDefault(), f.dom.setAttribute(h, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  y.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const p = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + h + '="open"]'),
          function(u) {
            return u !== p;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[c];
    }
  };
  function b(p) {
    const f = p[c];
    if (!f) return;
    const a = p.getAttribute(h) === "open";
    if (a !== f.isOpen)
      if (a) {
        if (Y(p, "ln-modal:before-open", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(h, "close");
          return;
        }
        f.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof p.showModal == "function" && p.showModal();
        const e = p.querySelector("[autofocus]");
        if (e && Dt(e))
          e.focus();
        else {
          const t = p.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), i = Array.prototype.find.call(t, Dt);
          if (i) i.focus();
          else {
            const n = p.querySelectorAll("a[href], button:not([disabled])"), l = Array.prototype.find.call(n, Dt);
            l && l.focus();
          }
        }
        S(p, "ln-modal:open", { modalId: p.id, target: p });
      } else {
        if (Y(p, "ln-modal:before-close", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(h, "open");
          return;
        }
        f.isOpen = !1, S(p, "ln-modal:close", { modalId: p.id, target: p }), typeof p.close == "function" && p.close(), document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  H(h, c, y, "ln-modal", {
    onAttributeChange: b
  });
})();
(function() {
  const h = "data-ln-modal-coordinator", c = "lnModalCoordinator";
  if (window[c] !== void 0) return;
  function y(i, n) {
    if (n) {
      if (i) {
        const m = i.closest("[" + h + "]");
        if (m) {
          if (m.id === n && m.hasAttribute("data-ln-modal")) return m;
          const g = m.querySelector("#" + CSS.escape(n) + '[data-ln-modal], [data-ln-modal="' + n + '"]');
          if (g) return g;
        }
      }
      const l = document.getElementById(n) || document.querySelector('[data-ln-modal="' + n + '"]');
      if (l) return l;
    }
    if (i) {
      const l = i.closest("[" + h + "]");
      if (l) {
        if (l.hasAttribute("data-ln-modal")) return l;
        const g = l.querySelector("[data-ln-modal]");
        if (g) return g;
      }
      const m = i.closest("[data-ln-modal]");
      if (m) return m;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function b(i, n) {
    if (i !== "edit") return "";
    if (n) {
      const l = n.getAttribute("data-ln-fill-id");
      if (l) return l;
    }
    return "edit";
  }
  function p(i) {
    if (!i) return;
    const n = i.querySelectorAll("[data-ln-field]");
    for (let m = 0; m < n.length; m++)
      n[m].textContent = "";
    const l = i.querySelectorAll("form");
    for (let m = 0; m < l.length; m++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(l[m], null) : l[m].reset();
  }
  document.addEventListener("submit", function(i) {
    if (i.defaultPrevented) return;
    const l = i.target.closest("[data-ln-modal]");
    if (l && l.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + l.id, "true");
      } catch {
      }
      ot(l.id, null);
    }
  }), document.addEventListener("click", function(i) {
    if (i.ctrlKey || i.metaKey || i.button === 1) return;
    const n = i.target.closest("[data-ln-modal-for]");
    if (n) {
      const m = n.getAttribute("data-ln-modal-for"), g = y(n, m);
      if (g && g.lnModal) {
        i.preventDefault();
        const r = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, s = {}, o = n.dataset;
        for (const A in o) {
          if (!A.startsWith("lnModal") || r[A]) continue;
          const w = A.slice(7);
          w && (s[w.charAt(0).toLowerCase() + w.slice(1)] = o[A]);
        }
        const _ = Object.keys(s).length > 0;
        n.hasAttribute("data-ln-modal-mode") ? g.dataset.lnModalMode = n.getAttribute("data-ln-modal-mode") : g.dataset.lnModalMode = _ ? "edit" : "new", _ && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(g, s) : g.dataset.lnModalMode === "new" && p(g), g.getAttribute("data-ln-modal") === "open" ? S(g, "ln-modal:request-close", {}) : (g.id && ot(g.id, b(g.dataset.lnModalMode, n)), S(g, "ln-modal:request-open", {}));
      }
      return;
    }
    const l = i.target.closest('a[href^="#"]');
    if (l) {
      const m = Nt(l.getAttribute("href"));
      for (const g in m) {
        const r = document.getElementById(g);
        if (r && r.lnModal) {
          if (!Qt(i)) return;
          ot(g, m[g]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(i) {
    const n = i.target;
    if (!n || !n.lnModal) return;
    (n.dataset.lnModalMode || "new") === "new" && p(n);
  }), document.addEventListener("ln-modal:open", function(i) {
    const n = i.target;
    if (!n || !n.lnModal || !n.id) return;
    let l = gt(n.id);
    l === null && (l = b(n.dataset.lnModalMode, null), ot(n.id, l)), l ? (n.dataset.lnModalMode = "edit", n.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: l }
    }))) : (n.dataset.lnModalMode = "new", p(n));
  });
  let f = !1;
  function u() {
    if (!f) {
      f = !0;
      try {
        const i = document.querySelectorAll("[data-ln-modal][id]");
        for (let n = 0; n < i.length; n++) {
          const l = i[n];
          if (!l.lnModal) continue;
          const m = l.id, g = "ln-modal-pending:" + m;
          let r = !1;
          try {
            r = sessionStorage.getItem(g) === "true";
          } catch {
          }
          if (r) {
            try {
              sessionStorage.removeItem(g);
            } catch {
            }
            if (!!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || l.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger"))) {
              l.dataset.lnModalMode = "edit", S(l, "ln-modal:request-open", {});
              continue;
            } else {
              ot(m, null), S(l, "ln-modal:request-close", {}), p(l);
              continue;
            }
          }
          const s = gt(m), o = s !== null, _ = l.lnModal.isOpen;
          if (o) {
            const v = s ? "edit" : "new";
            l.dataset.lnModalMode = v, _ ? s ? l.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: s }
            })) : p(l) : S(l, "ln-modal:request-open", {});
          } else _ && S(l, "ln-modal:request-close", {});
        }
      } finally {
        f = !1;
      }
    }
  }
  function a() {
    const i = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let n = 0; n < i.length; n++) {
      const l = i[n];
      l.lnModal && gt(l.id) === null && ot(l.id, b(l.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", u);
  function d() {
    a(), u();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    setTimeout(d, 0);
  }) : setTimeout(d, 0);
  function e(i) {
    const n = i.target.closest("[data-ln-modal]");
    if (!(!n || !n.lnModal)) {
      if (n.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + n.id);
        } catch {
        }
        ot(n.id, null);
      }
      S(n, "ln-modal:request-close", {}), p(n);
    }
  }
  document.addEventListener("ln-form:success", e), document.addEventListener("ln-ajax:success", e), document.addEventListener("ln-modal:close", function(i) {
    const n = i.target;
    if (!(!n || !n.lnModal)) {
      if (n.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + n.id);
        } catch {
        }
        gt(n.id) !== null && ot(n.id, null);
      }
      n.dataset.lnModalMode === "new" && p(n);
    }
  });
  function t(i) {
    return this.dom = i, this;
  }
  t.prototype.destroy = function() {
    this.dom[c] && delete this.dom[c];
  }, H(h, c, t, "ln-modal-coordinator");
})();
(function() {
  const h = "data-ln-number", c = "lnNumber";
  if (window[c] !== void 0) return;
  const y = {}, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(e) {
    if (!y[e]) {
      const t = new Intl.NumberFormat(e, { useGrouping: !0 }), i = t.formatToParts(1234.5);
      let n = "", l = ".";
      for (let m = 0; m < i.length; m++)
        i[m].type === "group" && (n = i[m].value), i[m].type === "decimal" && (l = i[m].value);
      y[e] = { fmt: t, groupSep: n, decimalSep: l };
    }
    return y[e];
  }
  function f(e, t, i) {
    if (i !== null) {
      const n = parseInt(i, 10), l = e + "|d" + n;
      return y[l] || (y[l] = new Intl.NumberFormat(e, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: n })), y[l].format(t);
    }
    return p(e).fmt.format(t);
  }
  function u(e) {
    if (e[c]) return e[c];
    if (e[c] = this, this.dom = e, e.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const t = document.createElement("input");
    t.type = "hidden", t.name = e.name, e.removeAttribute("name"), e.hasAttribute("data-ln-fill-as") && t.setAttribute("data-ln-fill-as", e.getAttribute("data-ln-fill-as")), e.type = "text", e.setAttribute("inputmode", "decimal"), e.insertAdjacentElement("afterend", t), this._hidden = t;
    const i = this;
    Object.defineProperty(t, "value", {
      get: function() {
        return b.get.call(t);
      },
      set: function(l) {
        b.set.call(t, l), l !== "" && !isNaN(parseFloat(l)) ? i._setDisplayRaw(f(W(i.dom), parseFloat(l), i.dom.getAttribute("data-ln-number-decimals"))) : i._setDisplayRaw(""), i.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), ce(e, b, {
      get: function() {
        return b.get.call(e);
      },
      set: function(l) {
        if (l === "") {
          i._setDisplayRaw(""), i._setHiddenRaw(""), e.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const m = typeof l == "number" ? l : parseFloat(String(l).replace(/[^\d.-]/g, ""));
        isNaN(m) ? (i._setDisplayRaw(String(l)), i._setHiddenRaw("")) : (i._setHiddenRaw(m), i._setDisplayRaw(f(W(e), m, e.getAttribute("data-ln-number-decimals")))), e.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      i._handleInput();
    }, e.addEventListener("input", this._onInput), this._onPaste = function(l) {
      l.preventDefault();
      const m = (l.clipboardData || window.clipboardData).getData("text"), g = p(W(e)), r = g.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let s = m.replace(new RegExp("[^0-9\\-" + r + ".]", "g"), "");
      g.groupSep && (s = s.split(g.groupSep).join("")), g.decimalSep !== "." && (s = s.replace(g.decimalSep, "."));
      const o = parseFloat(s);
      i.value = isNaN(o) ? NaN : o;
    }, e.addEventListener("paste", this._onPaste);
    const n = e.value;
    if (n !== "") {
      const l = parseFloat(n);
      isNaN(l) || (this._setHiddenRaw(l), this._setDisplayRaw(f(W(e), l, e.getAttribute("data-ln-number-decimals"))), e.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function a(e) {
    if (typeof e == "number") return isNaN(e) ? null : e;
    if (!e || typeof e != "string") return null;
    let t = e.trim();
    if (t === "") return null;
    t = t.replace(/[\s\u00A0$€£]/g, ""), t.indexOf(",") !== -1 && t.indexOf(".") !== -1 ? t.indexOf(".") < t.indexOf(",") ? t = t.replace(/\./g, "").replace(",", ".") : t = t.replace(/,/g, "") : t.indexOf(",") !== -1 && (t = t.replace(",", ".")), t = t.replace(/[^\d.-]/g, "");
    const i = parseFloat(t);
    return isNaN(i) ? null : i;
  }
  u.prototype._initTextElement = function() {
    const e = this.dom;
    let t = e.getAttribute("data-ln-value"), i = e.getAttribute("data-ln-number"), n = null;
    t !== null && t !== "" ? n = t : i !== null && i !== "" && i !== "true" ? n = i : n = e.textContent.trim();
    const l = a(n);
    l !== null ? (this._rawValue = l, e.hasAttribute("data-ln-value") || e.setAttribute("data-ln-value", String(l)), this._formatTextContent()) : this._rawValue = null;
  }, u.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const e = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = f(W(this.dom), this._rawValue, e);
    }
  }, u.prototype._handleInput = function() {
    const e = this.dom, t = p(W(e)), i = b.get.call(e);
    if (i === "") {
      this._setHiddenRaw(""), S(e, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (i === "-") {
      this._setHiddenRaw("");
      return;
    }
    const n = e.selectionStart;
    let l = 0;
    for (let C = 0; C < n; C++)
      /[0-9]/.test(i[C]) && l++;
    let m = i;
    if (t.groupSep && (m = m.split(t.groupSep).join("")), m = m.replace(t.decimalSep, "."), i.endsWith(t.decimalSep) || i.endsWith(".")) {
      const C = m.replace(/\.$/, ""), T = parseFloat(C);
      isNaN(T) || this._setHiddenRaw(T);
      return;
    }
    const g = m.indexOf(".");
    if (g !== -1 && m.slice(g + 1).endsWith("0")) {
      const T = parseFloat(m);
      isNaN(T) || this._setHiddenRaw(T);
      return;
    }
    const r = e.getAttribute("data-ln-number-decimals");
    if (r !== null && g !== -1) {
      const C = parseInt(r, 10);
      m.slice(g + 1).length > C && (m = m.slice(0, g + 1 + C));
    }
    const s = parseFloat(m);
    if (isNaN(s)) return;
    const o = e.getAttribute("data-ln-number-min"), _ = e.getAttribute("data-ln-number-max");
    if (o !== null && s < parseFloat(o) || _ !== null && s > parseFloat(_)) return;
    let v;
    if (r !== null)
      v = f(W(e), s, r);
    else {
      const C = g !== -1 ? m.slice(g + 1).length : 0;
      if (C > 0) {
        const T = W(e) + "|u" + C;
        y[T] || (y[T] = new Intl.NumberFormat(W(e), { useGrouping: !0, minimumFractionDigits: C, maximumFractionDigits: C })), v = y[T].format(s);
      } else
        v = t.fmt.format(s);
    }
    this._setDisplayRaw(v);
    let A = l, w = 0;
    for (let C = 0; C < v.length && A > 0; C++)
      w = C + 1, /[0-9]/.test(v[C]) && A--;
    A > 0 && (w = v.length), e.setSelectionRange(w, w), this._setHiddenRaw(s), S(e, "ln-number:input", { value: s, formatted: v });
  }, u.prototype._setHiddenRaw = function(e) {
    this._hidden && b.set.call(this._hidden, String(e));
  }, u.prototype._setDisplayRaw = function(e) {
    this.isTextElement ? this.dom.textContent = String(e) : b.set.call(this.dom, String(e));
  }, u.prototype._displayFormatted = function(e) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(f(W(this.dom), e, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(u.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const e = b.get.call(this._hidden);
      return e === "" ? NaN : parseFloat(e);
    },
    set: function(e) {
      if (this.isTextElement) {
        typeof e != "number" || isNaN(e) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = e, this.dom.setAttribute("data-ln-value", String(e)), this._formatTextContent());
        return;
      }
      if (typeof e != "number" || isNaN(e)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(e), this._setDisplayRaw(f(W(this.dom), e, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(u.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : b.get.call(this.dom);
    }
  }), u.prototype.destroy = function() {
    this.dom[c] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function d() {
    new MutationObserver(function() {
      const e = document.querySelectorAll("[" + h + "]");
      for (let t = 0; t < e.length; t++) {
        const i = e[t][c];
        i && (i.isTextElement ? i._formatTextContent() : isNaN(i.value) || i._displayFormatted(i.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(h, c, u, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(e) {
      const t = e[c];
      t && (t.isTextElement ? t._initTextElement() : isNaN(t.value) || t._displayFormatted(t.value));
    }
  }), d();
})();
(function() {
  const h = "data-ln-date", c = "lnDate";
  if (window[c] !== void 0) return;
  const y = {}, b = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(o, _) {
    const v = o + "|" + JSON.stringify(_);
    return y[v] || (y[v] = new Intl.DateTimeFormat(o, _)), y[v];
  }
  const f = /^(short|medium|long)(\s+datetime)?$/, u = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function a(o) {
    return !o || o === "" ? { dateStyle: "medium" } : o.match(f) ? u[o] : null;
  }
  function d(o, _, v) {
    const A = o.getDate(), w = o.getMonth(), C = o.getFullYear(), T = o.getHours(), q = o.getMinutes();
    let x, I;
    const D = Lt(v), R = (v || "").toLowerCase().split("-")[0], z = p(v, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], Q = D && z !== R;
    Q && D.monthsLong ? x = D.monthsLong[w] : x = p(v, { month: "long" }).format(o), Q && D.monthsShort ? I = D.monthsShort[w] : I = p(v, { month: "short" }).format(o);
    const ct = {
      yyyy: String(C),
      yy: String(C).slice(-2),
      MMMM: x,
      MMM: I,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(A).padStart(2, "0"),
      d: String(A),
      HH: String(T).padStart(2, "0"),
      mm: String(q).padStart(2, "0")
    };
    return _.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(at) {
      return ct[at];
    });
  }
  function e(o, _, v) {
    const A = a(_);
    if (A) {
      const w = p(v, A), C = (v || "").toLowerCase().split("-")[0], T = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return Lt(v) && T !== C ? d(o, "dd.MM.yyyy", v) : w.format(o);
    }
    return d(o, _, v);
  }
  function t(o) {
    if (!o) return "";
    const _ = o.getFullYear(), v = String(o.getMonth() + 1).padStart(2, "0"), A = String(o.getDate()).padStart(2, "0");
    return _ + "-" + v + "-" + A;
  }
  function i(o, _, v) {
    S(o.dom, "ln-date:change", {
      value: _,
      formatted: o.dom.value,
      date: v
    }), o.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function n(o, _, v, A) {
    o._setHiddenRaw(_), b.set.call(o._picker, _), o._lastISO = _, A !== void 0 ? (o._isFormatting = !0, o.dom.value = A, o._isFormatting = !1) : v && o._displayFormatted(v), i(o, _, v);
  }
  function l(o) {
    o._setHiddenRaw(""), b.set.call(o._picker, ""), o._isFormatting = !0, o.dom.value = "", o._isFormatting = !1, o._lastISO = "", i(o, "", null);
  }
  m.prototype._initTextElement = function() {
    const o = this.dom;
    let _ = o.getAttribute("data-ln-value"), v = o.getAttribute("data-ln-date"), A = o.getAttribute("datetime"), w = null;
    _ !== null && _ !== "" ? w = _ : A !== null && A !== "" ? w = A : v !== null && v !== "" && v !== "true" && !f.test(v) ? w = v : w = o.textContent.trim();
    let C = g(w) || r(w);
    if (!C && w)
      if (isNaN(w))
        C = new Date(w);
      else {
        const T = Number(w);
        C = new Date(T > 1e11 ? T : T * 1e3);
      }
    if (C && !isNaN(C.getTime())) {
      const T = t(C);
      this._rawValue = T, o.hasAttribute("data-ln-value") || o.setAttribute("data-ln-value", T), this._formatTextContent();
    } else
      this._rawValue = null;
  }, m.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const o = g(this._rawValue);
      if (o) {
        let v = this.dom.getAttribute("data-ln-date-format");
        if (!v) {
          const w = this.dom.getAttribute("data-ln-date");
          w && f.test(w) && (v = w);
        }
        const A = W(this.dom);
        this.dom.textContent = e(o, v || "medium", A);
      }
    }
  };
  function m(o) {
    if (o[c]) return o[c];
    if (o[c] = this, this.dom = o, o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const _ = this, v = o.value, A = o.name, C = (o.closest(".form-element, form") || o.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let D = 0; D < C.length; D++) {
      const R = C[D].getAttribute("data-ln-date-dict");
      if (R) {
        const N = Gt(C[D], "data-ln-date-dict-key");
        N["months-long"] && (N.monthsLong = N["months-long"].split(",").map((z) => z.trim())), N["months-short"] && (N.monthsShort = N["months-short"].split(",").map((z) => z.trim())), Wt(R, N);
      }
    }
    const T = document.createElement("span");
    T.setAttribute("data-ln-date-field", ""), o.parentNode.insertBefore(T, o), T.appendChild(o), this._wrapper = T;
    const q = document.createElement("input");
    q.type = "hidden", q.name = A, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && q.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.insertAdjacentElement("afterend", q), this._hidden = q;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", q.insertAdjacentElement("afterend", x), this._picker = x, o.type = "text";
    const I = document.createElement("button");
    if (I.type = "button", I.setAttribute("aria-label", o.getAttribute("data-ln-date-label") || "Open date picker"), I.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', x.insertAdjacentElement("afterend", I), this._btn = I, this._lastISO = "", Object.defineProperty(q, "value", {
      get: function() {
        return b.get.call(q);
      },
      set: function(D) {
        if (b.set.call(q, D), D && D !== "") {
          const R = g(D);
          R && n(_, D, R);
        } else D === "" && l(_);
      }
    }), ce(o, b, {
      get: function() {
        return b.get.call(o);
      },
      set: function(D, R) {
        if (_._isFormatting) {
          R(D);
          return;
        }
        if (!D || D === "") {
          R(""), l(_);
          return;
        }
        const N = g(D) || r(D);
        if (N) {
          const z = t(N), Q = o.getAttribute(h) || "", ct = W(o), at = e(N, Q, ct);
          R(at), n(_, z, N, at);
        } else
          R(String(D)), l(_);
      }
    }), this._onPickerChange = function() {
      const D = x.value;
      if (D) {
        const R = g(D);
        R && n(_, D, R);
      } else
        l(_);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const D = _.dom.value.trim();
      if (D === "") {
        _._lastISO !== "" && l(_);
        return;
      }
      if (_._lastISO) {
        const N = g(_._lastISO);
        if (N) {
          const z = _.dom.getAttribute(h) || "", Q = W(_.dom);
          if (D === e(N, z, Q)) return;
        }
      }
      const R = r(D);
      if (R) {
        const N = t(R);
        n(_, N, R);
      } else if (_._lastISO) {
        const N = g(_._lastISO);
        N && _._displayFormatted(N);
      } else
        _.dom.value = "";
    }, o.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      _._openPicker();
    }, I.addEventListener("click", this._onBtnClick), v && v !== "") {
      const D = g(v);
      D && n(_, v, D);
    }
    return this;
  }
  function g(o) {
    if (!o || typeof o != "string") return null;
    const _ = o.split("T"), v = _[0].split("-");
    if (v.length < 3) return null;
    const A = parseInt(v[0], 10), w = parseInt(v[1], 10) - 1, C = parseInt(v[2], 10);
    if (isNaN(A) || isNaN(w) || isNaN(C)) return null;
    let T = 0, q = 0;
    if (_[1]) {
      const I = _[1].split(":");
      T = parseInt(I[0], 10) || 0, q = parseInt(I[1], 10) || 0;
    }
    const x = new Date(A, w, C, T, q);
    return x.getFullYear() !== A || x.getMonth() !== w || x.getDate() !== C ? null : x;
  }
  function r(o) {
    if (!o || typeof o != "string" || (o = o.trim(), o.length < 6)) return null;
    let _, v;
    if (o.indexOf(".") !== -1)
      _ = ".", v = o.split(".");
    else if (o.indexOf("/") !== -1)
      _ = "/", v = o.split("/");
    else if (o.indexOf("-") !== -1)
      _ = "-", v = o.split("-");
    else
      return null;
    if (v.length !== 3) return null;
    const A = [];
    for (let x = 0; x < 3; x++) {
      const I = parseInt(v[x], 10);
      if (isNaN(I)) return null;
      A.push(I);
    }
    let w, C, T;
    _ === "." ? (w = A[0], C = A[1], T = A[2]) : _ === "/" ? (C = A[0], w = A[1], T = A[2]) : v[0].length === 4 ? (T = A[0], C = A[1], w = A[2]) : (w = A[0], C = A[1], T = A[2]), T < 100 && (T += T < 50 ? 2e3 : 1900);
    const q = new Date(T, C - 1, w);
    return q.getFullYear() !== T || q.getMonth() !== C - 1 || q.getDate() !== w ? null : q;
  }
  m.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, m.prototype._setHiddenRaw = function(o) {
    b.set.call(this._hidden, o);
  }, m.prototype._displayFormatted = function(o) {
    const _ = this.dom.getAttribute(h) || "", v = W(this.dom);
    this._isFormatting = !0, this.dom.value = e(o, _, v), this._isFormatting = !1;
  }, Object.defineProperty(m.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : b.get.call(this._hidden);
    },
    set: function(o) {
      if (this.isTextElement) {
        if (!o || o === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const v = g(o) || r(o);
        if (!v) return;
        const A = t(v);
        this._rawValue = A, this.dom.setAttribute("data-ln-value", A), this._formatTextContent();
        return;
      }
      if (!o || o === "") {
        l(this);
        return;
      }
      const _ = g(o);
      _ && n(this, o, _);
    }
  }), Object.defineProperty(m.prototype, "date", {
    get: function() {
      const o = this.value;
      return o ? g(o) : null;
    },
    set: function(o) {
      if (!o || !(o instanceof Date) || isNaN(o.getTime())) {
        this.value = "";
        return;
      }
      this.value = t(o);
    }
  }), Object.defineProperty(m.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), m.prototype.destroy = function() {
    if (!this.dom[c]) return;
    if (this.isTextElement) {
      S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const o = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", o && (this.dom.value = o), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function s() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + h + "]");
      for (let _ = 0; _ < o.length; _++) {
        const v = o[_][c];
        if (v) {
          if (v.isTextElement)
            v._formatTextContent();
          else if (v.value) {
            const A = g(v.value);
            A && v._displayFormatted(A);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(h, c, m, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(o) {
      const _ = o[c];
      if (_) {
        if (_.isTextElement)
          _._initTextElement();
        else if (_.value) {
          const v = g(_.value);
          v && _._displayFormatted(v);
        }
      }
    }
  }), s();
})();
(function() {
  const h = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0) return;
  const y = [];
  if (!history._lnNavPatched) {
    const u = history.pushState;
    history.pushState = function() {
      u.apply(history, arguments);
      for (const a of y)
        a();
    }, history._lnNavPatched = !0;
  }
  function b(u) {
    return this.dom = u, this.activeClass = u.getAttribute(h) || "active", this.exact = u.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), y.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(u, { childList: !0, subtree: !0 }), this.update(), this;
  }
  b.prototype.update = function() {
    if (!this.activeClass || Y(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const a = Array.from(this.dom.querySelectorAll("a")), d = window.location.pathname, e = p(d);
    for (const t of a) {
      const i = t.getAttribute("href");
      if (!i || i === "#" || i.startsWith("#") || i.startsWith("javascript:") || i.startsWith("mailto:") || i.startsWith("tel:")) {
        t.classList.remove(this.activeClass), t.removeAttribute("aria-current");
        continue;
      }
      if (t.hostname && t.hostname !== window.location.hostname) {
        t.classList.remove(this.activeClass), t.removeAttribute("aria-current");
        continue;
      }
      const n = p(i), l = n === e, m = !this.exact && n !== "/" && e.startsWith(n + "/");
      l || m ? (t.classList.add(this.activeClass), t.setAttribute("aria-current", "page")) : (t.classList.remove(this.activeClass), t.removeAttribute("aria-current"));
    }
    S(this.dom, "ln-nav:update", { target: this.dom });
  }, b.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const u = y.indexOf(this.updateHandler);
    u !== -1 && y.splice(u, 1), S(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function p(u) {
    try {
      return new URL(u, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return u.replace(/\/$/, "") || "/";
    }
  }
  function f(u, a) {
    const d = u[c];
    if (d) {
      if (a === h) {
        if (!u.hasAttribute(h)) {
          d.destroy();
          return;
        }
        const e = d.activeClass, t = u.getAttribute(h) || "active";
        if (e !== t) {
          const i = u.querySelectorAll("a");
          for (const n of i)
            e && n.classList.remove(e);
          d.activeClass = t;
        }
      } else a === "data-ln-nav-exact" && (d.exact = u.hasAttribute("data-ln-nav-exact"));
      d.update();
    }
  }
  H(h, c, b, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function y(f, u) {
    const a = (f.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (a) return a;
    if (f.tagName !== "A") return "";
    const d = f.getAttribute("href") || "";
    if (!d.startsWith("#")) return "";
    const e = d.slice(1);
    if (!e) return "";
    const t = e.split("&");
    if (u)
      for (const l of t) {
        const m = l.indexOf(":");
        if (m > 0 && l.slice(0, m).toLowerCase().trim() === u)
          return l.slice(m + 1).toLowerCase().trim();
      }
    const i = t[t.length - 1] || "", n = i.indexOf(":");
    return (n > 0 ? i.slice(n + 1) : i).toLowerCase().trim();
  }
  function b(f) {
    return this.dom = f, p.call(this), this;
  }
  function p() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const f = this.tabs.filter((d) => d.tagName === "A" && (d.getAttribute("href") || "").startsWith("#")), u = f.length > 0 && f.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = u && !!this.nsKey, f.length > 0 && f.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : u && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const d of this.tabs) {
      const e = y(d, this.nsKey);
      e ? this.mapTabs[e] = d : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', d);
    }
    for (const d of this.panels) {
      const e = (d.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      e && (this.mapPanels[e] = d);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const a = this;
    this._clickHandlers = [];
    for (const d of this.tabs) {
      if (d[c + "Trigger"]) continue;
      const e = function(t) {
        const i = d.tagName === "A";
        if (!i && (t.ctrlKey || t.metaKey || t.button === 1)) return;
        const n = y(d, a.nsKey);
        n && (i && !Qt(t) || (a.hashEnabled ? gt(a.nsKey) === n ? a.dom.setAttribute("data-ln-tabs-active", n) : ot(a.nsKey, n) : a.dom.setAttribute("data-ln-tabs-active", n)));
      };
      d.addEventListener("click", e), d[c + "Trigger"] = e, a._clickHandlers.push({ el: d, handler: e });
    }
    if (this._onRequestSelect = function(d) {
      const e = d.detail && (d.detail.key || d.detail.tab);
      e && a.dom.setAttribute("data-ln-tabs-active", (e + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!a.hashEnabled) return;
      const d = gt(a.nsKey);
      a.dom.setAttribute("data-ln-tabs-active", d !== null ? d : a.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let d = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const e = Mt("tabs", this.dom);
        e !== null && e in this.mapPanels && (d = e);
      }
      this.dom.setAttribute("data-ln-tabs-active", d);
    }
  }
  b.prototype._applyActive = function(f) {
    var u;
    (!f || !(f in this.mapPanels)) && (f = this.defaultKey);
    for (const a in this.mapTabs) {
      const d = this.mapTabs[a];
      a === f ? (d.setAttribute("data-active", ""), d.setAttribute("aria-selected", "true")) : (d.removeAttribute("data-active"), d.setAttribute("aria-selected", "false"));
    }
    for (const a in this.mapPanels) {
      const d = this.mapPanels[a], e = a === f;
      d.classList.toggle("hidden", !e), d.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const a = (u = this.mapPanels[f]) == null ? void 0 : u.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      a && setTimeout(() => a.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: f, tab: this.mapTabs[f], panel: this.mapPanels[f] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && _t("tabs", this.dom, f);
  }, b.prototype.destroy = function() {
    if (this.dom[c]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: f, handler: u } of this._clickHandlers)
        f.removeEventListener("click", u), delete f[c + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[c];
    }
  }, H(h, c, b, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(f) {
      const u = f.getAttribute("data-ln-tabs-active");
      f[c]._applyActive(u);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function y(f, u) {
    const a = document.querySelectorAll(
      '[data-ln-toggle-for="' + f.id + '"]'
    );
    for (const d of a)
      d.setAttribute("aria-expanded", u ? "true" : "false");
  }
  function b(f) {
    this.dom = f;
    const u = this;
    if (this._onRequestOpen = function() {
      u.open();
    }, this._onRequestClose = function() {
      u.close();
    }, this._onRequestToggle = function() {
      u.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), f.hasAttribute("data-ln-persist")) {
      const a = Mt("toggle", f);
      a !== null && f.setAttribute(h, a);
    }
    return this.isOpen = f.getAttribute(h) === "open", this.isOpen && f.classList.add("open"), y(f, this.isOpen), this;
  }
  b.prototype.open = function() {
    this.dom.setAttribute(h, "open");
  }, b.prototype.close = function() {
    this.dom.setAttribute(h, "close");
  }, b.prototype.toggle = function() {
    const f = this.dom.getAttribute(h);
    this.dom.setAttribute(h, f === "open" ? "close" : "open");
  }, b.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function p(f) {
    const u = f[c];
    if (!u) return;
    const d = f.getAttribute(h) === "open";
    if (d !== u.isOpen)
      if (d) {
        if (Y(f, "ln-toggle:before-open", { target: f }).defaultPrevented) {
          f.setAttribute(h, "close");
          return;
        }
        u.isOpen = !0, f.classList.add("open"), y(f, !0), S(f, "ln-toggle:open", { target: f }), f.hasAttribute("data-ln-persist") && _t("toggle", f, "open");
      } else {
        if (Y(f, "ln-toggle:before-close", { target: f }).defaultPrevented) {
          f.setAttribute(h, "open");
          return;
        }
        u.isOpen = !1, f.classList.remove("open"), y(f, !1), S(f, "ln-toggle:close", { target: f }), f.hasAttribute("data-ln-persist") && _t("toggle", f, "close");
      }
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const u = f.target.closest("[data-ln-toggle-for]");
    if (u) {
      const a = u.getAttribute("data-ln-toggle-for"), d = document.getElementById(a);
      if (d && d[c]) {
        f.preventDefault();
        const e = u.getAttribute("data-ln-toggle-action") || "toggle";
        if (e === "open")
          d.setAttribute(h, "open");
        else if (e === "close")
          d.setAttribute(h, "close");
        else if (e === "toggle") {
          const t = d.getAttribute(h);
          d.setAttribute(h, t === "open" ? "close" : "open");
        }
      }
    }
  }), H(h, c, b, "ln-toggle", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function y(b) {
    return this.dom = b, this._onToggleOpen = function(p) {
      if (p.detail.target.closest("[data-ln-accordion]") !== b) return;
      const f = b.querySelectorAll("[data-ln-toggle]");
      for (const u of f)
        u !== p.detail.target && u.closest("[data-ln-accordion]") === b && u.getAttribute("data-ln-toggle") === "open" && u.setAttribute("data-ln-toggle", "close");
      S(b, "ln-accordion:change", { target: p.detail.target });
    }, b.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[c]);
  }, H(h, c, y, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", c = "lnDropdown";
  if (window[c] !== void 0) return;
  function y(b) {
    if (this.dom = b, this.toggleEl = b.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = b.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const f of this.toggleEl.children)
        f.setAttribute("role", "menuitem");
    const p = this;
    return this._onRequestOpen = function() {
      p.toggleEl && p.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      p.toggleEl && p.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (p.toggleEl) {
        const f = p.toggleEl.getAttribute("data-ln-toggle");
        p.toggleEl.setAttribute("data-ln-toggle", f === "open" ? "close" : "open");
      }
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._onToggleOpen = function(f) {
      !f.detail || f.detail.target !== p.toggleEl || (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "true"), typeof p.toggleEl.showPopover == "function" && p.toggleEl.showPopover(), p._reposition(), p._addOutsideClickListener(), p._addScrollRepositionListener(), p._addResizeCloseListener(), S(b, "ln-dropdown:open", { target: f.detail.target }));
    }, this._onToggleClose = function(f) {
      !f.detail || f.detail.target !== p.toggleEl || (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "false"), p._removeOutsideClickListener(), p._removeScrollRepositionListener(), p._removeResizeCloseListener(), p.toggleEl.style.top = "", p.toggleEl.style.left = "", typeof p.toggleEl.hidePopover == "function" && p.toggleEl.matches(":popover-open") && p.toggleEl.hidePopover(), S(b, "ln-dropdown:close", { target: f.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  y.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const b = this.triggerBtn.getBoundingClientRect(), p = Ut(this.toggleEl), f = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, u = Ot(b, p, "bottom-end", f);
    this.toggleEl.style.top = u.top + "px", this.toggleEl.style.left = u.left + "px";
  }, y.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const b = this;
    this._boundDocClick = function(p) {
      b.dom.contains(p.target) || b.toggleEl && b.toggleEl.contains(p.target) || b.toggleEl && b.toggleEl.getAttribute("data-ln-toggle") === "open" && b.toggleEl.setAttribute("data-ln-toggle", "close");
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
    this.dom[c] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[c]);
  }, H(h, c, y, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", c = "lnPopover", y = "data-ln-popover-for", b = "data-ln-popover-position";
  if (window[c] !== void 0) return;
  const p = [];
  let f = null;
  function u() {
    f || (f = function(t) {
      if (t.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", f));
  }
  function a() {
    p.length > 0 || f && (document.removeEventListener("keydown", f), f = null);
  }
  function d(t) {
    this.dom = t, this.isOpen = t.getAttribute(h) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const i = this;
    return this._onRequestOpen = function(n) {
      const l = n.detail && n.detail.trigger ? n.detail.trigger : null;
      i.open(l);
    }, this._onRequestClose = function() {
      i.close();
    }, this._onRequestToggle = function(n) {
      const l = n.detail && n.detail.trigger ? n.detail.trigger : null;
      i.toggle(l);
    }, t.addEventListener("ln-popover:request-open", this._onRequestOpen), t.addEventListener("ln-popover:request-close", this._onRequestClose), t.addEventListener("ln-popover:request-toggle", this._onRequestToggle), t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), t.hasAttribute("role") || t.setAttribute("role", "dialog"), t.hasAttribute("popover") || t.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  d.prototype.open = function(t) {
    this.isOpen || (this.trigger = t || null, this.dom.setAttribute(h, "open"));
  }, d.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, d.prototype.toggle = function(t) {
    this.isOpen ? this.close() : this.open(t);
  }, d.prototype._applyOpen = function(t) {
    this.isOpen = !0, t && (this.trigger = t), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const i = Ut(this.dom);
    if (this.trigger) {
      const g = this.trigger.getBoundingClientRect(), r = this.dom.getAttribute(b) || "bottom", s = Ot(g, i, r, 8);
      this.dom.style.top = s.top + "px", this.dom.style.left = s.left + "px", this.dom.setAttribute("data-ln-popover-placement", s.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const n = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), l = Array.prototype.find.call(n, Dt);
    l ? l.focus() : this.dom.focus();
    const m = this;
    this._boundDocClick = function(g) {
      m.dom.contains(g.target) || m.trigger && m.trigger.contains(g.target) || m.close();
    }, m._docClickTimeout = setTimeout(function() {
      m._docClickTimeout = null, document.addEventListener("click", m._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!m.trigger) return;
      const g = m.trigger.getBoundingClientRect(), r = Ut(m.dom), s = m.dom.getAttribute(b) || "bottom", o = Ot(g, r, s, 8);
      m.dom.style.top = o.top + "px", m.dom.style.left = o.left + "px", m.dom.setAttribute("data-ln-popover-placement", o.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), u(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, d.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const t = p.indexOf(this);
    t !== -1 && p.splice(t, 1), a(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, d.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[c], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function e(t) {
    this.dom = t;
    const i = t.getAttribute(y);
    return t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", i), this._onClick = function(n) {
      if (n.ctrlKey || n.metaKey || n.button === 1) return;
      n.preventDefault();
      const l = document.getElementById(i);
      if (!l) return;
      l[c] && (l[c].trigger = t);
      const m = l.getAttribute(h);
      l.setAttribute(h, m === "open" ? "closed" : "open");
    }, t.addEventListener("click", this._onClick), this;
  }
  e.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[c + "Trigger"];
  }, H(h, c, d, "ln-popover", {
    onAttributeChange: function(t) {
      const i = t[c];
      if (!i) return;
      const l = t.getAttribute(h) === "open";
      if (l !== i.isOpen)
        if (l) {
          if (Y(t, "ln-popover:before-open", {
            popoverId: t.id,
            target: t,
            trigger: i.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "closed");
            return;
          }
          i._applyOpen(i.trigger);
        } else {
          if (Y(t, "ln-popover:before-close", {
            popoverId: t.id,
            target: t,
            trigger: i.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "open");
            return;
          }
          i._applyClose();
        }
    }
  }), H(y, c + "Trigger", e, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", c = "data-ln-tooltip", y = "data-ln-tooltip-position", b = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[b] !== void 0) return;
  let f = 0, u = null, a = null, d = null, e = null, t = null, i = null;
  function n() {
    return u && u.parentNode || (u = document.getElementById(p), u || (u = document.createElement("div"), u.id = p, document.body.appendChild(u)), u.hasAttribute("popover") || u.setAttribute("popover", "manual")), u;
  }
  function l() {
    i || (i = function(o) {
      o.key === "Escape" && r();
    }, document.addEventListener("keydown", i));
  }
  function m() {
    i && (document.removeEventListener("keydown", i), i = null);
  }
  function g(o) {
    if (d === o) return;
    r();
    const _ = o.getAttribute(c) || o.getAttribute("title");
    if (!_) return;
    n(), typeof u.showPopover == "function" && u.showPopover(), o.hasAttribute("title") && (e = o.getAttribute("title"), o.removeAttribute("title"));
    const v = o.getAttribute("aria-describedby");
    v ? t = v : t = null;
    const A = document.createElement("div");
    A.className = "ln-tooltip", A.textContent = _, o[b + "Uid"] || (f += 1, o[b + "Uid"] = "ln-tooltip-" + f), A.id = o[b + "Uid"], u.appendChild(A);
    const w = A.offsetWidth, C = A.offsetHeight, T = o.getBoundingClientRect(), q = o.getAttribute(y) || "top", x = Ot(T, { width: w, height: C }, q, 6);
    A.style.top = x.top + "px", A.style.left = x.left + "px", A.setAttribute("data-ln-tooltip-placement", x.placement), t ? o.setAttribute("aria-describedby", t + " " + A.id) : o.setAttribute("aria-describedby", A.id), a = A, d = o, l();
  }
  function r() {
    if (!a) {
      m();
      return;
    }
    d && (t !== null ? d.setAttribute("aria-describedby", t) : d.removeAttribute("aria-describedby"), t = null, e !== null && d.setAttribute("title", e)), e = null, a.parentNode && a.parentNode.removeChild(a), a = null, d = null, u && typeof u.hidePopover == "function" && u.matches(":popover-open") && u.hidePopover(), m();
  }
  function s(o) {
    return this.dom = o, o.hasAttribute("data-ln-tooltip-enhanced") || (o.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      g(o);
    }, this._onLeave = function() {
      d === o && !o.contains(document.activeElement) && r();
    }, this._onFocus = function() {
      g(o);
    }, this._onBlur = function() {
      d === o && !o.matches(":hover") && r();
    }, o.addEventListener("mouseenter", this._onEnter), o.addEventListener("mouseleave", this._onLeave), o.addEventListener("focus", this._onFocus, !0), o.addEventListener("blur", this._onBlur, !0), this;
  }
  s.prototype.destroy = function() {
    const o = this.dom;
    o.removeEventListener("mouseenter", this._onEnter), o.removeEventListener("mouseleave", this._onLeave), o.removeEventListener("focus", this._onFocus, !0), o.removeEventListener("blur", this._onBlur, !0), d === o && r(), this._addedEnhancedAttr && o.removeAttribute("data-ln-tooltip-enhanced"), delete o[b], delete o[b + "Uid"], S(o, "ln-tooltip:destroyed", { trigger: o });
  }, H(
    "[" + h + "], [data-ln-tooltip-enhanced], [" + c + "][title]",
    b,
    s,
    "ln-tooltip"
  );
})();
(function() {
  const h = "data-ln-toast", c = "lnToast", y = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function b(g) {
    if (!(!g || !(g instanceof HTMLElement)) && (g.hasAttribute("popover") || g.setAttribute("popover", "manual"), typeof g.showPopover == "function")) {
      if (g.matches(":popover-open"))
        try {
          g.hidePopover();
        } catch {
        }
      try {
        g.showPopover();
      } catch {
      }
    }
  }
  function p(g) {
    if (!g || !(g instanceof HTMLElement)) return;
    if (g.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof g.hidePopover == "function" && g.matches(":popover-open"))
      try {
        g.hidePopover();
      } catch {
      }
  }
  function f(g) {
    if (!g || g.nodeType !== 1) return;
    const r = Array.from(g.querySelectorAll("[" + h + "]"));
    g.hasAttribute && g.hasAttribute(h) && r.push(g);
    for (const s of r)
      s[c] || new u(s);
  }
  function u(g) {
    this.dom = g, g[c] = this, this.timeoutDefault = parseInt(g.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(g.getAttribute("data-ln-toast-max") || "5", 10);
    const r = Array.from(g.querySelectorAll("[data-ln-toast-item]"));
    for (; r.length > this.max; ) g.removeChild(r.shift());
    for (const s of r) n(s, this);
    return r.length > 0 && b(g), this;
  }
  u.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const g of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        t(g);
      p(this.dom), delete this.dom[c];
    }
  };
  function a(g, r) {
    const s = ((g.type || "") + "").trim().toLowerCase(), o = mt(r, y, "ln-toast");
    if (!o)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    it(o, {
      type: s,
      title: g.title,
      message: typeof g.message == "string" ? g.message : void 0
    });
    const _ = o.firstElementChild;
    if (!_) return null;
    _.hasAttribute("data-ln-toast-item") || _.setAttribute("data-ln-toast-item", ""), _.classList.add("ln-enter");
    const v = _.querySelector(".body");
    v && d(v, g);
    const A = _.querySelector("[data-ln-toast-close]");
    return A && A.addEventListener("click", function() {
      t(_);
    }), _;
  }
  function d(g, r) {
    if (Array.isArray(r.message)) {
      const s = document.createElement("ul");
      for (const o of r.message) {
        const _ = document.createElement("li");
        _.textContent = o, s.appendChild(_);
      }
      g.appendChild(s);
    }
    if (r.data && r.data.errors) {
      const s = document.createElement("ul");
      for (const o of Object.values(r.data.errors).flat()) {
        const _ = document.createElement("li");
        _.textContent = o, s.appendChild(_);
      }
      g.appendChild(s);
    }
  }
  function e(g, r) {
    const s = Array.from(g.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; s.length >= g.max && s.length > 0; ) g.dom.removeChild(s.shift());
    g.dom.appendChild(r), b(g.dom), requestAnimationFrame(() => r.classList.remove("ln-enter"));
  }
  function t(g) {
    if (!g || !g.parentNode) return;
    const r = g.parentNode;
    clearTimeout(g._timer), g.classList.remove("ln-enter"), g.classList.add("ln-out"), setTimeout(() => {
      g.parentNode && (g.parentNode.removeChild(g), p(r));
    }, 200);
  }
  function i(g) {
    let r = g && g.container;
    return typeof r == "string" && (r = document.querySelector(r)), r instanceof HTMLElement || (r = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), r || null;
  }
  function n(g, r) {
    if (g._lnToastHydrated) return;
    g._lnToastHydrated = !0;
    const s = g.querySelector("[data-ln-toast-close]");
    s && s.addEventListener("click", function() {
      t(g);
    });
    const o = g.getAttribute("data-ln-toast-timeout"), _ = o !== null ? parseInt(o, 10) : NaN, v = Number.isFinite(_) ? _ : r.timeoutDefault;
    v > 0 && (g._timer = setTimeout(function() {
      t(g);
    }, v));
  }
  function l(g) {
    const r = g.detail || {}, s = i(r);
    if (!s) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const o = s[c] || new u(s), _ = a(r, s);
    if (!_) return;
    const v = Number.isFinite(r.timeout) ? r.timeout : o.timeoutDefault;
    e(o, _), v > 0 && (_._timer = setTimeout(() => t(_), v));
  }
  function m(g) {
    const r = g && g.detail || {};
    if (r.container) {
      const s = i(r);
      if (s)
        for (const o of Array.from(s.querySelectorAll("[data-ln-toast-item]"))) t(o);
    } else {
      const s = document.querySelectorAll("[" + h + "]");
      for (const o of Array.from(s))
        for (const _ of Array.from(o.querySelectorAll("[data-ln-toast-item]"))) t(_);
    }
  }
  st(function() {
    window.addEventListener("ln-toast:enqueue", l), window.addEventListener("ln-toast:clear", m), window.addEventListener("ln-modal:open", function() {
      const r = document.querySelectorAll("[" + h + "]");
      for (const s of Array.from(r))
        s.querySelectorAll("[data-ln-toast-item]").length > 0 && b(s);
    }), new MutationObserver(function(r) {
      for (const s of r) {
        if (s.type === "attributes") {
          f(s.target);
          continue;
        }
        for (const o of s.addedNodes)
          f(o);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), f(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", c = "lnUpload", y = "data-ln-upload-dict", b = "data-ln-upload-accept", p = "data-ln-upload-context", f = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function u() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const m = document.createElement("div");
    m.innerHTML = f;
    const g = m.firstElementChild;
    g && document.body.appendChild(g);
  }
  if (window[c] !== void 0) return;
  function a(m) {
    if (m === 0) return "0 B";
    const g = 1024, r = ["B", "KB", "MB", "GB"], s = Math.floor(Math.log(m) / Math.log(g));
    return parseFloat((m / Math.pow(g, s)).toFixed(1)) + " " + r[s];
  }
  function d(m) {
    return m.split(".").pop().toLowerCase();
  }
  function e(m) {
    return m === "docx" && (m = "doc"), ["pdf", "doc", "epub"].includes(m) ? "lnc-file-" + m : "ln-file";
  }
  function t(m, g) {
    if (!g) return !0;
    const r = "." + d(m.name);
    return g.split(",").map(function(o) {
      return o.trim().toLowerCase();
    }).includes(r.toLowerCase());
  }
  function i(m) {
    if (m.lnUploadAPI) return;
    u();
    const g = Gt(m, y), r = m.querySelector(".ln-upload__zone"), s = m.querySelector(".ln-upload__list"), o = m.getAttribute(b) || "";
    if (!r || !s) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", m);
      return;
    }
    let _ = m.querySelector('input[type="file"]');
    _ || (_ = document.createElement("input"), _.type = "file", _.multiple = !0, _.classList.add("hidden"), o && (_.accept = o.split(",").map(function(P) {
      return P = P.trim(), P.startsWith(".") ? P : "." + P;
    }).join(",")), m.appendChild(_));
    const v = m.getAttribute(h) || "/files/upload", A = m.getAttribute(p) || "", w = m.getAttribute("data-ln-upload-delete") || (v.includes("/upload") ? v.replace(/\/upload\/?$/, "/{id}") : v + "/{id}"), C = /* @__PURE__ */ new Map();
    let T = 0;
    function q() {
      const P = document.querySelector('meta[name="csrf-token"]');
      return P ? P.getAttribute("content") : "";
    }
    function x(P) {
      if (!t(P, o)) {
        const L = g["invalid-type"];
        S(m, "ln-upload:invalid", {
          file: P,
          message: L
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: g["invalid-title"] || "Invalid File",
          message: L || g["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const j = "file-" + ++T, $ = d(P.name), St = e($), dt = mt(m, "ln-upload-item", "ln-upload");
      if (!dt) return;
      const et = dt.firstElementChild;
      if (!et) return;
      et.setAttribute("data-file-id", j), it(et, {
        name: P.name,
        sizeText: "0%",
        iconHref: "#" + St,
        removeLabel: g.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const Ct = et.querySelector(".ln-upload__progress-bar"), ut = et.querySelector('[data-ln-upload-action="remove"]');
      ut && (ut.disabled = !0), s.appendChild(et);
      const ht = new FormData();
      ht.append("file", P);
      const xt = /* @__PURE__ */ new Set();
      m.querySelectorAll("input, select, textarea").forEach(function(L) {
        if (L.name && L.name !== "file_ids[]" && L.type !== "file") {
          if ((L.type === "checkbox" || L.type === "radio") && !L.checked)
            return;
          ht.append(L.name, L.value), xt.add(L.name);
        }
      }), !xt.has("context") && A && ht.append("context", A);
      const J = new XMLHttpRequest();
      J.upload.addEventListener("progress", function(L) {
        if (L.lengthComputable) {
          const k = Math.round(L.loaded / L.total * 100);
          Ct.style.width = k + "%", it(et, { sizeText: k + "%" });
        }
      }), J.addEventListener("load", function() {
        if (J.status >= 200 && J.status < 300) {
          let L;
          try {
            L = JSON.parse(J.responseText);
          } catch {
            E("Invalid response");
            return;
          }
          it(et, { sizeText: a(L.size || P.size), uploading: !1 }), ut && (ut.disabled = !1), C.set(j, {
            serverId: L.id,
            name: L.name,
            size: L.size
          }), I(), S(m, "ln-upload:uploaded", {
            localId: j,
            serverId: L.id,
            name: L.name
          });
        } else {
          let L = g["upload-failed"] || "Upload failed";
          try {
            L = JSON.parse(J.responseText).message || L;
          } catch {
          }
          E(L);
        }
      }), J.addEventListener("error", function() {
        E(g["network-error"] || "Network error");
      });
      function E(L) {
        Ct && (Ct.style.width = "100%"), it(et, { sizeText: g.error || "Error", uploading: !1, error: !0 }), ut && (ut.disabled = !1), S(m, "ln-upload:error", {
          file: P,
          message: L
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: g["error-title"] || "Upload Error",
          message: L || g["upload-failed"] || "Failed to upload file"
        });
      }
      J.open("POST", v), J.setRequestHeader("X-CSRF-TOKEN", q()), J.setRequestHeader("Accept", "application/json"), J.send(ht);
    }
    function I() {
      for (const P of m.querySelectorAll('input[name="file_ids[]"]'))
        P.remove();
      for (const [, P] of C) {
        const j = document.createElement("input");
        j.type = "hidden", j.name = "file_ids[]", j.value = P.serverId, m.appendChild(j);
      }
    }
    function D(P) {
      const j = C.get(P), $ = s.querySelector('[data-file-id="' + P + '"]');
      if (!j || !j.serverId) {
        $ && $.remove(), C.delete(P), I();
        return;
      }
      $ && it($, { deleting: !0 });
      const St = w.replace("{id}", j.serverId);
      fetch(St, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": q(),
          Accept: "application/json"
        }
      }).then(function(dt) {
        dt.status === 200 ? ($ && $.remove(), C.delete(P), I(), S(m, "ln-upload:removed", {
          localId: P,
          serverId: j.serverId
        })) : ($ && it($, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: g["delete-title"] || "Error",
          message: g["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(dt) {
        console.warn("[ln-upload] Delete error:", dt), $ && it($, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: g["network-error"] || "Network error",
          message: g["connection-error"] || "Could not connect to server"
        });
      });
    }
    function R(P) {
      for (const j of P)
        x(j);
      _.value = "";
    }
    const N = function() {
      _.click();
    }, z = function() {
      R(this.files);
    }, Q = function(P) {
      P.preventDefault(), P.stopPropagation(), r.classList.add("ln-upload__zone--dragover");
    }, ct = function(P) {
      P.preventDefault(), P.stopPropagation(), r.classList.add("ln-upload__zone--dragover");
    }, at = function(P) {
      P.preventDefault(), P.stopPropagation(), r.classList.remove("ln-upload__zone--dragover");
    }, qt = function(P) {
      P.preventDefault(), P.stopPropagation(), r.classList.remove("ln-upload__zone--dragover"), R(P.dataTransfer.files);
    }, At = function(P) {
      const j = P.target.closest('[data-ln-upload-action="remove"]');
      if (!j || !s.contains(j) || j.disabled) return;
      const $ = j.closest(".ln-upload__item");
      $ && D($.getAttribute("data-file-id"));
    };
    r.addEventListener("click", N), _.addEventListener("change", z), r.addEventListener("dragenter", Q), r.addEventListener("dragover", ct), r.addEventListener("dragleave", at), r.addEventListener("drop", qt), s.addEventListener("click", At), m.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(C.values()).map(function(P) {
          return P.serverId;
        });
      },
      getFiles: function() {
        return Array.from(C.values());
      },
      clear: function() {
        for (const [, P] of C)
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
        C.clear(), s.innerHTML = "", I(), S(m, "ln-upload:cleared", {});
      },
      destroy: function() {
        r.removeEventListener("click", N), _.removeEventListener("change", z), r.removeEventListener("dragenter", Q), r.removeEventListener("dragover", ct), r.removeEventListener("dragleave", at), r.removeEventListener("drop", qt), s.removeEventListener("click", At), C.clear(), s.innerHTML = "", I(), delete m.lnUploadAPI;
      }
    };
  }
  function n() {
    for (const m of document.querySelectorAll("[" + h + "]"))
      i(m);
  }
  function l() {
    st(function() {
      new MutationObserver(function(g) {
        for (const r of g)
          if (r.type === "childList") {
            for (const s of r.addedNodes)
              if (s.nodeType === 1) {
                s.hasAttribute(h) && i(s);
                for (const o of s.querySelectorAll("[" + h + "]"))
                  i(o);
              }
          } else r.type === "attributes" && r.target.hasAttribute(h) && i(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[c] = {
    init: i,
    initAll: n
  }, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function c(a) {
    return a.hostname && a.hostname !== window.location.hostname;
  }
  function y(a) {
    if (a.getAttribute("data-ln-external-link") === "processed" || !c(a)) return;
    a.target = "_blank";
    const d = (a.rel || "").split(/\s+/).filter(Boolean);
    d.includes("noopener") || d.push("noopener"), d.includes("noreferrer") || d.push("noreferrer"), a.rel = d.join(" ");
    const e = document.createElement("span");
    e.className = "sr-only", e.textContent = "(opens in new tab)", a.appendChild(e), a.setAttribute("data-ln-external-link", "processed"), S(a, "ln-external-links:processed", {
      link: a,
      href: a.href
    });
  }
  function b(a) {
    a = a || document.body;
    for (const d of a.querySelectorAll("a, area"))
      y(d);
  }
  function p() {
    st(function() {
      document.body.addEventListener("click", function(a) {
        const d = a.target.closest("a, area");
        d && d.getAttribute("data-ln-external-link") === "processed" && S(d, "ln-external-links:clicked", {
          link: d,
          href: d.href,
          text: d.textContent || d.title || ""
        });
      });
    }, "ln-external-links");
  }
  function f() {
    st(function() {
      new MutationObserver(function(d) {
        for (const e of d) {
          if (e.type === "childList") {
            for (const t of e.addedNodes)
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && y(t), t.querySelectorAll))
                for (const i of t.querySelectorAll("a, area"))
                  y(i);
          }
          if (e.type === "attributes" && e.attributeName === "href") {
            const t = e.target;
            t.matches && (t.matches("a") || t.matches("area")) && y(t);
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
    p(), f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      b();
    }) : b();
  }
  window[h] = {
    process: b
  }, u();
})();
(function() {
  const h = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  let y = null;
  function b() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function p(s) {
    y && (y.textContent = s, y.classList.add("ln-link-status--visible"));
  }
  function f() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function u(s, o) {
    if (o.target.closest("a, button, input, select, textarea")) return;
    const _ = s.querySelector("a");
    if (!_) return;
    const v = _.getAttribute("href");
    if (!v) return;
    if (o.ctrlKey || o.metaKey || o.button === 1) {
      window.open(v, "_blank");
      return;
    }
    Y(s, "ln-link:navigate", { target: s, href: v, link: _ }).defaultPrevented || _.click();
  }
  function a(s) {
    const o = s.querySelector("a");
    if (!o) return;
    const _ = o.getAttribute("href");
    _ && p(_);
  }
  function d() {
    f();
  }
  function e(s) {
    s[c + "Row"] || !s.querySelector("a") || (s[c + "Row"] = !0, s._lnLinkClick = function(_) {
      u(s, _);
    }, s._lnLinkEnter = function() {
      a(s);
    }, s.addEventListener("click", s._lnLinkClick), s.addEventListener("mouseenter", s._lnLinkEnter), s.addEventListener("mouseleave", d));
  }
  function t(s) {
    s[c + "Row"] && (s._lnLinkClick && s.removeEventListener("click", s._lnLinkClick), s._lnLinkEnter && s.removeEventListener("mouseenter", s._lnLinkEnter), s.removeEventListener("mouseleave", d), delete s._lnLinkClick, delete s._lnLinkEnter, delete s[c + "Row"]);
  }
  function i(s) {
    if (!s[c + "Init"]) return;
    const o = s.tagName;
    if (o === "TABLE" || o === "TBODY") {
      const _ = o === "TABLE" && s.querySelector("tbody") || s;
      for (const v of _.querySelectorAll("tr"))
        t(v);
    } else
      t(s);
    delete s[c + "Init"];
  }
  function n(s) {
    if (s[c + "Init"]) return;
    s[c + "Init"] = !0;
    const o = s.tagName;
    if (o === "TABLE" || o === "TBODY") {
      const _ = o === "TABLE" && s.querySelector("tbody") || s;
      for (const v of _.querySelectorAll("tr"))
        e(v);
    } else
      e(s);
  }
  function l(s) {
    s.hasAttribute && s.hasAttribute(h) && n(s);
    const o = s.querySelectorAll ? s.querySelectorAll("[" + h + "]") : [];
    for (const _ of o)
      n(_);
  }
  function m() {
    st(function() {
      new MutationObserver(function(o) {
        for (const _ of o)
          if (_.type === "childList") {
            for (const v of _.addedNodes)
              if (v.nodeType === 1) {
                l(v);
                const A = v.closest("[" + h + "]");
                if (A)
                  if (v.tagName === "TR")
                    e(v);
                  else {
                    const w = A.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const C = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const T of C)
                        e(T);
                    }
                  }
              }
          } else _.type === "attributes" && (_.target.hasAttribute && _.target.hasAttribute(h) ? l(_.target) : i(_.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function g(s) {
    l(s);
  }
  window[c] = { init: g, destroy: i };
  function r() {
    b(), m(), g(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
(function() {
  const h = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0) return;
  function y(u) {
    return this.dom = u, this._attrObserver = null, this._parentObserver = null, f.call(this), b.call(this), p.call(this), this;
  }
  y.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[c]);
  };
  function b() {
    const u = this, a = new MutationObserver(function(d) {
      for (const e of d)
        (e.attributeName === "data-ln-progress" || e.attributeName === "data-ln-progress-max") && f.call(u);
    });
    a.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = a;
  }
  function p() {
    const u = this, a = this.dom.parentElement;
    if (!a) return;
    const d = new MutationObserver(function(e) {
      for (const t of e)
        t.attributeName === "data-ln-progress-max" && f.call(u);
    });
    d.observe(a, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = d;
  }
  function f() {
    const u = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, a = this.dom.parentElement, e = (a && a.hasAttribute("data-ln-progress-max") ? parseFloat(a.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let t = e > 0 ? u / e * 100 : 0;
    t < 0 && (t = 0), t > 100 && (t = 100), this.dom.style.width = t + "%";
    const i = Math.max(0, Math.min(u, e));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(e)), this.dom.setAttribute("aria-valuenow", String(i)), S(this.dom, "ln-progress:change", { target: this.dom, value: u, max: e, percentage: t });
  }
  H(
    h,
    c,
    y,
    "ln-progress"
  );
})();
(function() {
  const h = "data-ln-filter", c = "lnFilter", y = "data-ln-filter-key", b = "data-ln-filter-value", p = "data-ln-filter-hide", f = "data-ln-filter-reset", u = "data-ln-filter-col", a = /* @__PURE__ */ new WeakMap();
  if (window[c] !== void 0) return;
  function d(l) {
    return l.hasAttribute(f) || l.getAttribute(b) === "";
  }
  function e(l) {
    let m = l._filterKey;
    const g = [];
    for (let r = 0; r < l.inputs.length; r++) {
      const s = l.inputs[r];
      if (s.checked && !d(s)) {
        const o = s.getAttribute(b);
        o && g.push(o);
      }
    }
    return { key: m, values: g };
  }
  function t(l, m) {
    if (l.length !== m.length) return !0;
    for (let g = 0; g < l.length; g++) if (l[g] !== m[g]) return !0;
    return !1;
  }
  function i(l) {
    const m = l.dom, g = l.colIndex, r = m.querySelector("template");
    if (!r || g === null) return;
    const s = document.getElementById(l.targetId);
    if (!s) return;
    const o = s.tagName === "TABLE" ? s : s.querySelector("table");
    if (!o || s.hasAttribute("data-ln-table")) return;
    const _ = {}, v = [], A = o.tBodies;
    for (let T = 0; T < A.length; T++) {
      const q = A[T].rows;
      for (let x = 0; x < q.length; x++) {
        const I = q[x].cells[g], D = I ? I.textContent.trim() : "";
        D && !_[D] && (_[D] = !0, v.push(D));
      }
    }
    v.sort(function(T, q) {
      return T.localeCompare(q);
    });
    const w = m.querySelector("[" + y + "]"), C = w ? w.getAttribute(y) : m.getAttribute("data-ln-filter-key") || "col" + g;
    for (let T = 0; T < v.length; T++) {
      const q = r.content.cloneNode(!0), x = q.querySelector("input");
      x && (x.setAttribute(y, C), x.setAttribute(b, v[T]), wt(q, { text: v[T] }), m.appendChild(q));
    }
  }
  function n(l) {
    this.dom = l, this.targetId = l.getAttribute(h);
    const m = l.getAttribute(u);
    this.colIndex = m !== null ? parseInt(m, 10) : null, i(this), this.inputs = Array.from(l.querySelectorAll("[" + y + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(y) : null, this._lastSnapshot = null;
    const g = this, r = Oe(
      function() {
        g._render();
      },
      function() {
        g._afterRender();
      }
    );
    this._queueRender = r, this._attachHandlers();
    let s = !1;
    if (l.hasAttribute("data-ln-persist")) {
      const o = Mt("filter", l);
      if (o && o.key && Array.isArray(o.values) && o.values.length > 0) {
        for (let _ = 0; _ < this.inputs.length; _++) {
          const v = this.inputs[_];
          d(v) ? v.checked = !1 : v.getAttribute(y) === o.key && o.values.indexOf(v.getAttribute(b)) !== -1 ? v.checked = !0 : v.checked = !1;
        }
        r(), s = !0;
      }
    }
    if (!s) {
      for (let o = 0; o < this.inputs.length; o++)
        if (this.inputs[o].checked && !d(this.inputs[o])) {
          r();
          break;
        }
    }
    return l.setAttribute(INIT_ATTR, ""), this;
  }
  n.prototype._attachHandlers = function() {
    const l = this;
    this.inputs.forEach(function(m) {
      m[c + "Bound"] || (m[c + "Bound"] = !0, m._lnFilterChange = function() {
        if (d(m)) {
          for (let g = 0; g < l.inputs.length; g++)
            d(l.inputs[g]) || (l.inputs[g].checked = !1);
          m.checked = !0, l._queueRender();
          return;
        }
        if (m.checked) {
          for (let r = 0; r < l.inputs.length; r++)
            d(l.inputs[r]) && (l.inputs[r].checked = !1);
          let g = !1;
          for (let r = 0; r < l.inputs.length; r++)
            if (d(l.inputs[r])) {
              g = !0;
              break;
            }
          if (g) {
            let r = !0;
            for (let s = 0; s < l.inputs.length; s++)
              if (!d(l.inputs[s]) && !l.inputs[s].checked) {
                r = !1;
                break;
              }
            if (r)
              for (let s = 0; s < l.inputs.length; s++)
                d(l.inputs[s]) ? l.inputs[s].checked = !0 : l.inputs[s].checked = !1;
          }
        } else {
          let g = !1;
          for (let r = 0; r < l.inputs.length; r++)
            if (!d(l.inputs[r]) && l.inputs[r].checked) {
              g = !0;
              break;
            }
          if (!g)
            for (let r = 0; r < l.inputs.length; r++)
              d(l.inputs[r]) && (l.inputs[r].checked = !0);
        }
        l._queueRender();
      }, m.addEventListener("change", m._lnFilterChange));
    });
  }, n.prototype._render = function() {
    const l = this, m = e(this), g = m.key === null || m.values.length === 0, r = [];
    for (let s = 0; s < m.values.length; s++)
      r.push(m.values[s].toLowerCase());
    if (l.colIndex !== null)
      l._filterTableRows(m);
    else {
      const s = document.getElementById(l.targetId);
      if (!s) return;
      const o = s.children;
      for (let _ = 0; _ < o.length; _++) {
        const v = o[_];
        if (g) {
          v.removeAttribute(p);
          continue;
        }
        const A = v.getAttribute("data-" + m.key);
        v.removeAttribute(p), A !== null && r.indexOf(A.toLowerCase()) === -1 && v.setAttribute(p, "true");
      }
    }
  }, n.prototype._afterRender = function() {
    const l = e(this), m = this._lastSnapshot;
    if (!m || m.key !== l.key || t(m.values, l.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: l.key,
        values: l.values.slice()
      });
      const r = m && m.values.length > 0, s = l.values.length === 0;
      r && s && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: l.key, values: l.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (l.key && l.values.length > 0 ? _t("filter", this.dom, { key: l.key, values: l.values.slice() }) : _t("filter", this.dom, null));
  }, n.prototype._dispatchOnBoth = function(l, m) {
    S(this.dom, l, m);
    const g = document.getElementById(this.targetId);
    g && g !== this.dom && S(g, l, m);
  }, n.prototype._filterTableRows = function(l) {
    const m = document.getElementById(this.targetId);
    if (!m) return;
    const g = m.tagName === "TABLE" ? m : m.querySelector("table");
    if (!g || m.hasAttribute("data-ln-table")) return;
    const r = l.key || this._filterKey, s = l.values;
    a.has(g) || a.set(g, {});
    const o = a.get(g);
    if (r && s.length > 0) {
      const w = [];
      for (let C = 0; C < s.length; C++)
        w.push(s[C].toLowerCase());
      o[r] = { col: this.colIndex, values: w };
    } else r && delete o[r];
    const _ = Object.keys(o), v = _.length > 0, A = g.tBodies;
    for (let w = 0; w < A.length; w++) {
      const C = A[w].rows;
      for (let T = 0; T < C.length; T++) {
        const q = C[T];
        if (!v) {
          q.removeAttribute(p);
          continue;
        }
        let x = !0;
        for (let I = 0; I < _.length; I++) {
          const D = o[_[I]], R = q.cells[D.col], N = R ? R.textContent.trim().toLowerCase() : "";
          if (D.values.indexOf(N) === -1) {
            x = !1;
            break;
          }
        }
        x ? q.removeAttribute(p) : q.setAttribute(p, "true");
      }
    }
  }, n.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.colIndex !== null) {
        const l = document.getElementById(this.targetId);
        if (l) {
          const m = l.tagName === "TABLE" ? l : l.querySelector("table");
          if (m && a.has(m)) {
            const g = a.get(m), r = this._filterKey;
            r && g[r] && delete g[r], Object.keys(g).length === 0 && a.delete(m);
          }
        }
      }
      this.inputs.forEach(function(l) {
        l._lnFilterChange && (l.removeEventListener("change", l._lnFilterChange), delete l._lnFilterChange), delete l[c + "Bound"];
      }), delete this.dom[c];
    }
  }, H(h, c, n, "ln-filter");
})();
(function() {
  const h = "data-ln-search", c = "lnSearch", y = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function p(f) {
    this.dom = f, this.targetId = f.getAttribute(h);
    const u = f.tagName;
    this.input = u === "INPUT" || u === "TEXTAREA" ? f : f.querySelector('[name="search"]') || f.querySelector('input[type="search"]') || f.querySelector('input[type="text"]'), this.itemsSelector = f.getAttribute("data-ln-search-items") || null;
    const a = f.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = a !== null ? parseInt(a, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const d = this;
      queueMicrotask(function() {
        d._search(d.input.value.trim().toLowerCase());
      });
    }
    return this;
  }
  p.prototype._attachHandler = function() {
    if (!this.input) return;
    const f = this, u = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = u ? u.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      f.input.value = "", f._search(""), f.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(f._debounceTimer), f._debounceTimer = setTimeout(function() {
        f._search(f.input.value.trim().toLowerCase());
      }, f.debounceTime);
    }, this.input.addEventListener("input", this._onInput);
  }, p.prototype._search = function(f) {
    const u = document.getElementById(this.targetId);
    if (!u || Y(u, "ln-search:change", { term: f, targetId: this.targetId }).defaultPrevented) return;
    const d = this.itemsSelector ? u.querySelectorAll(this.itemsSelector) : u.children;
    for (let e = 0; e < d.length; e++) {
      const t = d[e];
      t.removeAttribute(y), f && !t.textContent.replace(/\s+/g, " ").toLowerCase().includes(f) && t.setAttribute(y, "true");
    }
  }, p.prototype.destroy = function() {
    this.dom[c] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), delete this.dom[c]);
  }, H(h, c, p, "ln-search");
})();
(function() {
  const h = "lnTableSort", c = "data-ln-table-sort", y = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function b(a) {
    p(a);
  }
  function p(a) {
    const d = Array.from(a.querySelectorAll("table"));
    a.tagName === "TABLE" && d.push(a), d.forEach(function(e) {
      if (e[h]) return;
      const t = Array.from(e.querySelectorAll("th[" + c + "]"));
      t.length && (e[h] = new f(e, t));
    });
  }
  function f(a, d) {
    this.table = a, this.ths = d, this._col = -1, this._dir = null;
    const e = this;
    d.forEach(function(i, n) {
      if (i[h + "Bound"]) return;
      i[h + "Bound"] = !0;
      const l = i.querySelector("[" + y + "]");
      l && (l._lnSortClick = function() {
        e._handleClick(n, i);
      }, l.addEventListener("click", l._lnSortClick));
    });
    const t = a.closest("[data-ln-table][data-ln-persist]");
    if (t) {
      const i = Mt("table-sort", t);
      i && i.dir && i.col >= 0 && i.col < d.length && this._applySort(i.col, d[i.col], i.dir);
    }
    return this;
  }
  f.prototype._applySort = function(a, d, e) {
    this.ths.forEach(function(t) {
      t.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = a, this._dir = e, d.classList.add(e === "asc" ? "ln-sort-asc" : "ln-sort-desc")), S(this.table, "ln-table:sort", {
      column: a,
      sortType: d.getAttribute(c),
      direction: e
    });
  }, f.prototype._handleClick = function(a, d) {
    let e;
    this._col !== a ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this._applySort(a, d, e);
    const t = this.table.closest("[data-ln-table][data-ln-persist]");
    t && (e === null ? _t("table-sort", t, null) : _t("table-sort", t, { col: a, dir: e }));
  }, f.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(a) {
      const d = a.querySelector("[" + y + "]");
      d && d._lnSortClick && (d.removeEventListener("click", d._lnSortClick), delete d._lnSortClick), delete a[h + "Bound"];
    }), delete this.table[h]);
  };
  function u() {
    st(function() {
      new MutationObserver(function(d) {
        d.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(t) {
            t.nodeType === 1 && p(t);
          }) : e.type === "attributes" && p(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [c] });
    }, "ln-table-sort");
  }
  window[h] = b, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-table", c = "lnTable", y = "data-ln-table-sort", b = "data-ln-table-empty";
  if (window[c] !== void 0) return;
  const u = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function a(t, i) {
    if (t == null || isNaN(t)) return "";
    try {
      return new Intl.NumberFormat(W(i)).format(t);
    } catch {
      return String(t);
    }
  }
  function d(t) {
    let i = t.parentElement;
    for (; i && i !== document.body && i !== document.documentElement; ) {
      const l = getComputedStyle(i).overflowY;
      if (l === "auto" || l === "scroll") return i;
      i = i.parentElement;
    }
    return null;
  }
  function e(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("[data-ln-table-body]") || t.querySelector("tbody"), this.thead = t.querySelector("thead");
    const i = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = i ? Array.from(i.querySelectorAll("th")) : [], this.isDataDriven = t.hasAttribute("data-ln-table-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const n = this;
    return this._onSetSearch = function(l) {
      if (n.isDataDriven) return;
      const m = (l.detail && l.detail.query != null ? l.detail.query : l.detail && l.detail.term != null ? l.detail.term : "").trim();
      n._searchTerm = m.toLowerCase(), n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), S(t, "ln-table:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-table:set-search", this._onSetSearch), this._onSetFilter = function(l) {
      if (n.isDataDriven || !l.detail) return;
      const m = l.detail.key, g = l.detail.values;
      if (!g || g.length === 0)
        delete n._columnFilters[m];
      else {
        const r = [];
        for (let s = 0; s < g.length; s++)
          r.push(g[s].toLowerCase());
        n._columnFilters[m] = r;
      }
      n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), S(t, "ln-table:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-table:set-filter", this._onSetFilter), this._onRequestClearFilters = function() {
      n.isDataDriven || (n._searchTerm = "", n._columnFilters = {}, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), S(t, "ln-table:filter", {
        term: "",
        matched: n._filteredData.length,
        total: n._data.length
      }));
    }, t.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._sliceOffset = 0, this._sliceData = [], this._debounceId = null, this._totalSpan = t.querySelector("[data-ln-table-total]"), this._filteredSpan = t.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== t ? this._filteredSpan.parentElement : null), this._selectedSpan = t.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== t ? this._selectedSpan.parentElement : null), this._onSetData = function(l) {
      const m = l.detail || {};
      if (m.offset != null) {
        n._sliceOffset = m.offset, n._sliceData = m.data || [], n._lastTotal = m.total != null ? m.total : n._lastTotal, n._lastFiltered = m.filtered != null ? m.filtered : n._lastFiltered, n.totalCount = n._lastTotal, n.visibleCount = n._lastFiltered, n.isLoaded = !0, n._selectable && n._selectAllCheckbox && n._selectAllCheckbox.classList.add("hidden"), t.classList.remove("ln-table--loading"), n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), S(t, "ln-table:rendered", {
          table: n.name,
          total: n.totalCount,
          visible: n.visibleCount
        });
        return;
      }
      n._data = m.data || [], n._sliceOffset = 0, n._sliceData = [], n._lastTotal = m.total != null ? m.total : n._data.length, n._lastFiltered = m.filtered != null ? m.filtered : n._data.length, n.totalCount = n._lastTotal, n.visibleCount = n._lastFiltered, n.isLoaded = !0, n._selectable && n._selectAllCheckbox && n._selectAllCheckbox.classList.remove("hidden"), t.classList.remove("ln-table--loading"), n._vStart = -1, n._vEnd = -1, n._applyFilterAndSort(), n._render(), n._updateFooter(), S(t, "ln-table:rendered", {
        table: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      });
    }, t.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(l) {
      const m = l.detail && l.detail.loading;
      t.classList.toggle("ln-table--loading", !!m), m && (n.isLoaded = !1);
    }, t.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(l) {
      const m = l.target.closest("[data-ln-table-col-sort]");
      if (!m) return;
      const g = m.closest("th");
      if (!g) return;
      const r = g.getAttribute("data-ln-table-col");
      r && n._handleSort(r, g);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._selectable = t.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(l) {
      if (l.target.closest("[data-ln-table-row-select]") || l.target.closest("[data-ln-table-row-action]") || l.target.closest("a") || l.target.closest("button") || l.ctrlKey || l.metaKey || l.button === 1) return;
      const m = l.target.closest("[data-ln-table-row]");
      if (!m) return;
      const g = m.getAttribute("data-ln-table-row-id"), r = m._lnRecord || {};
      S(t, "ln-table:row-click", {
        table: n.name,
        id: g,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(l) {
      const m = l.target.closest("[data-ln-table-row-action]");
      if (!m) return;
      l.stopPropagation();
      const g = m.closest("[data-ln-table-row]");
      if (!g) return;
      const r = m.getAttribute("data-ln-table-row-action"), s = g.getAttribute("data-ln-table-row-id"), o = g._lnRecord || {};
      S(t, "ln-table:row-action", {
        table: n.name,
        id: s,
        action: r,
        record: o
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(l) {
      if (!t.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      const m = n.tbody ? Array.from(n.tbody.querySelectorAll("[data-ln-table-row]")) : [];
      if (m.length)
        switch (l.key) {
          case "ArrowDown":
            l.preventDefault(), n._focusedRowIndex = Math.min(n._focusedRowIndex + 1, m.length - 1), n._focusRow(m);
            break;
          case "ArrowUp":
            l.preventDefault(), n._focusedRowIndex = Math.max(n._focusedRowIndex - 1, 0), n._focusRow(m);
            break;
          case "Home":
            l.preventDefault(), n._focusedRowIndex = 0, n._focusRow(m);
            break;
          case "End":
            l.preventDefault(), n._focusedRowIndex = m.length - 1, n._focusRow(m);
            break;
          case "Enter":
            if (n._focusedRowIndex >= 0 && n._focusedRowIndex < m.length) {
              l.preventDefault();
              const g = m[n._focusedRowIndex];
              S(t, "ln-table:row-click", {
                table: n.name,
                id: g.getAttribute("data-ln-table-row-id"),
                record: g._lnRecord || {}
              });
            }
            break;
          case " ":
            if (n._selectable && n._focusedRowIndex >= 0 && n._focusedRowIndex < m.length) {
              l.preventDefault();
              const g = m[n._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              g && (g.checked = !g.checked, g.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), S(t, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      n.tbody.rows.length > 0 && (n._emptyTbodyObserver.disconnect(), n._emptyTbodyObserver = null, n._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(l) {
      n._sortCol = l.detail.direction === null ? -1 : l.detail.column, n._sortDir = l.detail.direction, n._sortType = l.detail.sortType, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), S(t, "ln-table:sorted", {
        column: l.detail.column,
        direction: l.detail.direction,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort)), this;
  }
  e.prototype._parseRows = function() {
    const t = this.tbody.rows, i = this.ths;
    this._data = [];
    const n = [];
    for (let l = 0; l < i.length; l++)
      n[l] = i[l].getAttribute(y);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let l = 0; l < t.length; l++) {
      const m = t[l], g = [], r = [], s = [];
      for (let _ = 0; _ < m.cells.length; _++) {
        const v = m.cells[_], A = v.textContent.trim(), w = Jt(v), C = n[_];
        r[_] = A.toLowerCase(), C === "number" || C === "date" ? g[_] = parseFloat(w) || 0 : C === "string" ? g[_] = String(w) : g[_] = null, _ < m.cells.length - 1 && s.push(A.toLowerCase());
      }
      let o = null;
      if (this.isDataDriven) {
        o = {};
        const _ = m.getAttribute("data-ln-table-row-id");
        _ != null && (o.id = _);
        for (let v = 0; v < i.length; v++) {
          const A = i[v].getAttribute("data-ln-table-col");
          if (A) {
            const w = v;
            if (w < m.cells.length) {
              const C = m.cells[w];
              o[A] = Jt(C);
            }
          }
        }
      }
      this._data.push({
        sortKeys: g,
        rawTexts: r,
        html: m.outerHTML,
        searchText: s.join(" "),
        id: this.isDataDriven && o ? o.id : void 0,
        ...o
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, e.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      if (this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const t = this.currentSort.field, n = this.currentSort.direction === "desc" ? -1 : 1;
      let l = null;
      if (this.ths) {
        for (let g = 0; g < this.ths.length; g++)
          if (this.ths[g].getAttribute("data-ln-table-col") === t) {
            l = this.ths[g].getAttribute(y);
            break;
          }
      }
      const m = u ? u.compare : function(g, r) {
        return g < r ? -1 : g > r ? 1 : 0;
      };
      this._filteredData.sort(function(g, r) {
        const s = g[t], o = r[t];
        if (l === "number" || l === "date") {
          const A = parseFloat(s) || 0, w = parseFloat(o) || 0;
          return (A - w) * n;
        }
        if (typeof s == "number" && typeof o == "number")
          return (s - o) * n;
        const _ = s != null ? String(s) : "", v = o != null ? String(o) : "";
        return m(_, v) * n;
      });
    } else {
      const t = this._searchTerm, i = this._columnFilters, n = Object.keys(i).length > 0, l = this.ths, m = {};
      if (n)
        for (let _ = 0; _ < l.length; _++) {
          const v = l[_].getAttribute("data-ln-table-filter-col");
          v && (m[v] = _);
        }
      if (!t && !n ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(_) {
        if (t && _.searchText.indexOf(t) === -1) return !1;
        if (n)
          for (const v in i) {
            const A = m[v];
            if (A !== void 0 && i[v].indexOf(_.rawTexts[A]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, r = this._sortDir === "desc" ? -1 : 1, s = this._sortType === "number" || this._sortType === "date", o = u ? u.compare : function(_, v) {
        return _ < v ? -1 : _ > v ? 1 : 0;
      };
      this._filteredData.sort(function(_, v) {
        const A = _.sortKeys[g], w = v.sortKeys[g];
        return s ? (A - w) * r : o(A, w) * r;
      });
    }
  }, e.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(i) {
      const n = document.createElement("col");
      n.style.width = i.offsetWidth + "px", t.appendChild(n);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, e.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const t = this._sliceData && this._sliceData.length > 0, i = t ? this.visibleCount : this._lastTotal, n = this.visibleCount;
        if (i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (!t && (this._filteredData.length === 0 || n === 0)) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        t || this._filteredData.length > 200 ? (this._virtual || this._enableVirtualScroll(), this._measureRowHeight(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const t = this._filteredData.length;
        t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, e.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, i = document.createDocumentFragment();
      for (let n = 0; n < t.length; n++) {
        const l = this._buildRow(t[n]);
        if (!l) break;
        i.appendChild(l);
      }
      this.tbody.textContent = "", this.tbody.appendChild(i), this._selectable && this._updateSelectAll();
    } else {
      const t = [], i = this._filteredData;
      for (let n = 0; n < i.length; n++) t.push(i[n].html);
      this.tbody.innerHTML = t.join("");
    }
  }, e.prototype._measureRowHeight = function() {
    if (this._rowHeight) return;
    const t = this._sliceData && this._sliceData.length > 0;
    if (!t && !this.isDataDriven) {
      const l = this.tbody ? this.tbody.rows : [];
      l.length > 0 && (this._rowHeight = l[0].offsetHeight || 40);
      return;
    }
    let i = null;
    if (t) {
      for (let l = 0; l < this._sliceData.length; l++)
        if (this._sliceData[l]) {
          i = this._sliceData[l];
          break;
        }
    }
    if (!i && this._data.length > 0 && (i = this._data[0]), !i) return;
    const n = this._buildRow(i);
    n && (this.tbody.textContent = "", this.tbody.appendChild(n), this._rowHeight = n.offsetHeight || 40, this.tbody.textContent = "");
  }, e.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    this._measureRowHeight(), this.isDataDriven ? this._scrollContainer = d(this.dom) : this._scrollContainer = null;
    const i = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, i.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    const t = this._sliceData && this._sliceData.length > 0, i = t ? this._sliceData : this._filteredData, n = t ? this.visibleCount : i.length, l = this._rowHeight;
    if (!l || !n) return;
    const m = this.thead ? this.thead.offsetHeight : 0, g = this._scrollContainer;
    let r, s;
    if (g) {
      const C = this.table.getBoundingClientRect(), T = g.getBoundingClientRect(), q = C.top - T.top + g.scrollTop + m;
      r = g.scrollTop - q, s = g.clientHeight;
    } else {
      const q = this.table.getBoundingClientRect().top + window.scrollY + m;
      r = window.scrollY - q, s = window.innerHeight;
    }
    let o = Math.max(0, Math.floor(r / l) - 15);
    o = Math.min(o, n);
    const _ = Math.min(o + Math.ceil(s / l) + 30, n);
    if (o === this._vStart && _ === this._vEnd) return;
    this._vStart = o, this._vEnd = _;
    const v = this.ths.length || 1, A = o * l, w = (n - _) * l;
    if (this.isDataDriven) {
      const C = document.createDocumentFragment();
      if (A > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const q = document.createElement("td");
        q.setAttribute("colspan", v), q.style.height = A + "px", T.appendChild(q), C.appendChild(T);
      }
      for (let T = o; T < _; T++)
        if (t)
          if (T >= this._sliceOffset && T < this._sliceOffset + this._sliceData.length) {
            const q = this._sliceData[T - this._sliceOffset];
            if (q) {
              const x = this._buildRow(q);
              x && C.appendChild(x);
            } else
              C.appendChild(this._buildPlaceholderRow());
          } else
            C.appendChild(this._buildPlaceholderRow());
        else {
          const q = this._buildRow(i[T]);
          q && C.appendChild(q);
        }
      if (w > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const q = document.createElement("td");
        q.setAttribute("colspan", v), q.style.height = w + "px", T.appendChild(q), C.appendChild(T);
      }
      this.tbody.textContent = "", this.tbody.appendChild(C), this._selectable && this._updateSelectAll(), t && this._ensureSlice(o, _);
    } else {
      let C = "";
      A > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + v + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let T = o; T < _; T++) C += i[T].html;
      w > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + v + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
    }
  }, e.prototype._buildPlaceholderRow = function() {
    const t = document.createElement("tr");
    t.className = "ln-table__placeholder", t.setAttribute("aria-hidden", "true");
    const i = document.createElement("td");
    return i.setAttribute("colspan", this.ths.length || 1), i.style.height = this._rowHeight + "px", t.appendChild(i), t;
  }, e.prototype._ensureSlice = function(t, i) {
    const n = this._sliceData ? this._sliceData.length : 0;
    if (n === 0 || this.visibleCount === 0) return;
    const l = 25, m = Math.max(0, t - l), g = Math.min(this.visibleCount, i + l), r = n, s = Math.floor(m / r), o = Math.floor(Math.max(0, g - 1) / r);
    let _ = -1;
    for (let C = s; C <= o; C++) {
      const T = C * r;
      if (T < this._sliceOffset || T >= this._sliceOffset + n) {
        _ = C;
        break;
      }
    }
    if (_ === -1) return;
    const v = _ * r, A = r;
    this._debounceId && clearTimeout(this._debounceId);
    const w = this;
    this._debounceId = setTimeout(function() {
      w.dom.classList.add("ln-table--loading"), S(w.dom, "ln-table:request-data", {
        table: w.name,
        sort: w.currentSort,
        offset: v,
        limit: A
      });
    }, 120);
  }, e.prototype._showEmptyState = function() {
    const t = this.ths.length || 1;
    this.tbody.textContent = "";
    let i = null;
    if (this.isDataDriven) {
      const n = this._lastTotal != null ? this._lastTotal : this._data.length, m = this.visibleCount < n, g = m ? this.name + "-empty-filtered" : this.name + "-empty";
      if (i = mt(this.dom, g, "ln-table"), !i) {
        const r = this.dom.querySelector("template[data-ln-table-empty]");
        if (r) {
          const s = m ? "search" : "initial", o = r.content.querySelector('[data-ln-table-empty-when="' + s + '"]') || r.content.firstElementChild;
          o && (i = document.importNode(o, !0));
        }
      }
      if (i)
        if (i.tagName === "TR")
          this.tbody.appendChild(i);
        else {
          const r = document.createElement("td");
          r.setAttribute("colspan", String(t)), r.appendChild(i);
          const s = document.createElement("tr");
          s.className = "ln-table__empty", s.appendChild(r), this.tbody.appendChild(s);
        }
    } else {
      const n = this.dom.querySelector("template[" + b + "]"), l = document.createElement("td");
      l.setAttribute("colspan", String(t)), n && l.appendChild(document.importNode(n.content, !0));
      const m = document.createElement("tr");
      m.className = "ln-table__empty", m.appendChild(l), this.tbody.appendChild(m);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, e.prototype._fillRow = function(t, i) {
    wt(t, i);
    const n = t.querySelectorAll("[data-ln-table-cell-attr]");
    for (let l = 0; l < n.length; l++) {
      const m = n[l], g = m.getAttribute("data-ln-table-cell-attr").split(",");
      for (let r = 0; r < g.length; r++) {
        const s = g[r].trim().split(":");
        if (s.length !== 2) continue;
        const o = s[0].trim(), _ = s[1].trim();
        i[o] != null && m.setAttribute(_, i[o]);
      }
    }
  }, e.prototype._buildRow = function(t) {
    const i = mt(this.dom, this.name + "-row", "ln-table");
    if (!i) return null;
    const n = i.querySelector("[data-ln-table-row]") || i.firstElementChild;
    if (!n) return null;
    if (this._fillRow(n, t), n._lnRecord = t, t.id != null && n.setAttribute("data-ln-table-row-id", t.id), this._selectable && t.id != null && this.selectedIds.has(String(t.id))) {
      n.classList.add("ln-row-selected");
      const l = n.querySelector("[data-ln-table-row-select]");
      l && (l.checked = !0);
    }
    return n;
  }, e.prototype._handleSort = function(t, i) {
    let n;
    !this.currentSort || this.currentSort.field !== t ? n = "asc" : this.currentSort.direction === "asc" ? n = "desc" : n = null;
    for (let l = 0; l < this.ths.length; l++)
      this.ths[l].classList.remove("ln-sort-asc", "ln-sort-desc");
    n ? (this.currentSort = { field: t, direction: n }, i.classList.add(n === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-table:sort", {
      table: this.name,
      field: t,
      direction: n
    }), this._requestData();
  }, e.prototype._requestData = function() {
    if (this._sliceData && this._sliceData.length > 0) {
      this.dom.classList.add("ln-table--loading");
      const i = this._sliceData.length || 200;
      this._sliceOffset = 0, this._sliceData = [], S(this.dom, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        offset: 0,
        limit: i
      });
      return;
    }
    se(this, "ln-table:request-data", "table");
  }, e.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const t = this.tbody.querySelectorAll("[data-ln-table-row]");
    let i = t.length > 0;
    for (let n = 0; n < t.length; n++) {
      const l = t[n].getAttribute("data-ln-table-row-id");
      if (l != null && !this.selectedIds.has(l)) {
        i = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = i;
  }, Object.defineProperty(e.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), e.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    if (this._onSelectionChange = function(i) {
      const n = i.target.closest("[data-ln-table-row-select]");
      if (!n) return;
      const l = n.closest("[data-ln-table-row]");
      if (!l) return;
      const m = l.getAttribute("data-ln-table-row-id");
      m != null && (n.checked ? (t.selectedIds.add(m), l.classList.add("ln-row-selected")) : (t.selectedIds.delete(m), l.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), S(t.dom, "ln-table:select", {
        table: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const i = document.createElement("input");
      i.type = "checkbox";
      const n = t.dom.querySelector('[data-ln-table-dict="select-all"]'), l = t.dom.getAttribute("data-ln-table-select-all-label") || (n ? n.textContent.trim() : null) || "Select all";
      i.setAttribute("aria-label", l), this._selectAllCheckbox.appendChild(i), this._selectAllCheckbox = i;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const i = t._selectAllCheckbox.checked, n = t.tbody ? t.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let l = 0; l < n.length; l++) {
        const m = n[l].getAttribute("data-ln-table-row-id"), g = n[l].querySelector("[data-ln-table-row-select]");
        m != null && (i ? (t.selectedIds.add(m), n[l].classList.add("ln-row-selected")) : (t.selectedIds.delete(m), n[l].classList.remove("ln-row-selected")), g && (g.checked = i));
      }
      t.selectedCount = t.selectedIds.size, S(t.dom, "ln-table:select-all", {
        table: t.name,
        selected: i
      }), S(t.dom, "ln-table:select", {
        table: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedCount
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const i = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let n = 0; n < i.length; n++) {
        const l = i[n].querySelector("[data-ln-table-row-select]"), m = i[n].getAttribute("data-ln-table-row-id");
        l && l.checked && m != null && (this.selectedIds.add(m), i[n].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, e.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const t = this.dom.querySelector("[data-ln-table-col-select]");
    if (t) {
      const i = t.querySelector('input[type="checkbox"]');
      i && i.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const i = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let n = 0; n < i.length; n++) {
        i[n].classList.remove("ln-row-selected");
        const l = i[n].querySelector("[data-ln-table-row-select]");
        l && (l.checked = !1);
      }
    }
    this._updateFooter();
  }, e.prototype._updateFooter = function() {
    let t = 0, i = 0;
    this.isDataDriven ? (t = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount) : (t = this._data.length, i = this._filteredData.length);
    const n = i < t;
    if (this._totalSpan && (this._totalSpan.textContent = a(t, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = n ? a(i, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n), this._selectedSpan) {
      const l = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = l > 0 ? a(l, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", l === 0);
    }
  }, e.prototype._focusRow = function(t) {
    for (let i = 0; i < t.length; i++)
      t[i].classList.remove("ln-row-focused"), t[i].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < t.length) {
      const i = t[this._focusedRowIndex];
      i.classList.add("ln-row-focused"), i.setAttribute("tabindex", "0"), i.focus(), i.scrollIntoView({ block: "nearest" });
    }
  }, e.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this._debounceId && (clearTimeout(this._debounceId), this._debounceId = null), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:set-filter", this._onSetFilter), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll)) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-table:sort", this._onSort)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, H(h, c, e, "ln-table");
})();
(function() {
  const h = "data-ln-table-coordinator", c = "lnTableCoordinator";
  if (window[c] !== void 0) return;
  function y(p, f) {
    if (f) {
      const u = document.getElementById(f);
      if (u && u.hasAttribute("data-ln-table")) return u;
    }
    if (p) {
      const u = p.getAttribute("data-ln-search") || p.getAttribute("data-ln-filter");
      if (u) {
        const e = document.getElementById(u) || document.querySelector('[data-ln-table="' + u + '"]');
        if (e) return e;
      }
      const a = p.closest("[" + h + "]");
      if (a) {
        const e = a.querySelector("[data-ln-table]");
        if (e) return e;
      }
      const d = p.closest("[data-ln-table]");
      if (d) return d;
    }
    return document.querySelector("[data-ln-table]");
  }
  document.addEventListener("ln-search:change", function(p) {
    const f = p.detail && p.detail.term != null ? p.detail.term : "", u = p.target, a = u.getAttribute ? u.getAttribute("data-ln-search") : null, d = y(u, a);
    if (!d || !d.lnTable) return;
    p.preventDefault();
    const e = u.tagName === "INPUT" || u.tagName === "TEXTAREA" ? u : u.querySelector ? u.querySelector('input[type="search"], input[type="text"], input') : null;
    e && e.value !== f && (e.value = f), S(d, "ln-table:set-search", {
      query: f,
      term: f,
      table: d.lnTable.name || d.id
    });
  }), document.addEventListener("ln-filter:changed", function(p) {
    if (!p.detail) return;
    const f = p.detail.key, u = p.detail.values || [], a = p.target;
    if (!a.hasAttribute || !a.hasAttribute("data-ln-filter")) return;
    const d = a.getAttribute ? a.getAttribute("data-ln-filter") : null, e = y(a, d);
    if (!e || !e.lnTable) return;
    const t = e.querySelectorAll("th");
    for (let i = 0; i < t.length; i++)
      if (t[i].getAttribute("data-ln-table-filter-col") === f) {
        const n = t[i].querySelector("[data-ln-table-col-filter]");
        n && n.classList.toggle("ln-filter-active", u.length > 0);
        break;
      }
    S(e, "ln-table:set-filter", {
      key: f,
      values: u,
      table: e.lnTable.name || e.id
    });
  }), document.addEventListener("click", function(p) {
    const f = p.target.closest("[data-ln-table-clear-all], [data-ln-table-clear]");
    if (!f) return;
    const u = y(f);
    if (!u || !u.lnTable) return;
    const a = u.querySelectorAll("th");
    for (let l = 0; l < a.length; l++) {
      const m = a[l].querySelector("[data-ln-table-col-filter]");
      m && m.classList.remove("ln-filter-active");
    }
    const e = f.closest("[" + h + "]") || document, t = u.id, i = t && e.querySelector('[data-ln-search="' + t + '"]') || e.querySelector("[data-ln-search]");
    if (i) {
      const l = i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector("input");
      l && (l.value = "");
    }
    const n = t && e.querySelectorAll('[data-ln-filter="' + t + '"]') || e.querySelectorAll("[data-ln-filter]");
    for (let l = 0; l < n.length; l++) {
      const m = n[l].querySelector("[data-ln-filter-reset]");
      m && (m.checked = !0, m.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    S(u, "ln-table:request-clear-filters", {
      table: u.lnTable.name || u.id
    });
  }), document.addEventListener("keydown", function(p) {
    if (p.key !== "/" || p.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
    const f = document.querySelector("[" + h + "] [data-ln-search]") || document.querySelector("[data-ln-search]");
    if (!f) return;
    const u = f.tagName === "INPUT" || f.tagName === "TEXTAREA" ? f : f.querySelector('input[type="search"], input[type="text"], input');
    u && (p.preventDefault(), u.focus());
  });
  function b(p) {
    return this.dom = p, this;
  }
  b.prototype.destroy = function() {
    this.dom[c] && delete this.dom[c];
  }, H(h, c, b, "ln-table-coordinator");
})();
(function() {
  const h = "data-ln-list", c = "lnList", y = "data-ln-list-empty";
  if (window[c] !== void 0) return;
  function f(e, t) {
    if (e == null || isNaN(e)) return "";
    try {
      return new Intl.NumberFormat(W(t)).format(e);
    } catch {
      return String(e);
    }
  }
  function u(e) {
    let t = e;
    for (; t && t !== document.body && t !== document.documentElement; ) {
      const n = getComputedStyle(t).overflowY;
      if (n === "auto" || n === "scroll") return t;
      t = t.parentElement;
    }
    return null;
  }
  function a(e) {
    if (!e) return 0;
    const t = getComputedStyle(e), i = parseFloat(t.marginTop) || 0, n = parseFloat(t.marginBottom) || 0;
    return e.offsetHeight + i + n;
  }
  function d(e) {
    this.dom = e, this.tbody = e.querySelector("[data-ln-list-body]") || e, this.isDataDriven = e.hasAttribute("data-ln-list-source"), this.name = e.getAttribute(h) || "", this.source = e.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const t = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._sliceOffset = 0, this._sliceData = [], this._debounceId = null, this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = e.querySelector("[data-ln-list-total]"), this._filteredSpan = e.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== e ? this._filteredSpan.parentElement : null), this._selectedSpan = e.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== e ? this._selectedSpan.parentElement : null), this._onSetData = function(i) {
      const n = i.detail || {};
      if (n.offset != null) {
        t._sliceOffset = n.offset, t._sliceData = n.data || [], t._lastTotal = n.total != null ? n.total : t._lastTotal, t._lastFiltered = n.filtered != null ? n.filtered : t._lastFiltered, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._selectable && t._selectAllCheckbox && t._selectAllCheckbox.classList.add("hidden"), e.classList.remove("ln-list--loading"), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), S(e, "ln-list:rendered", {
          list: t.name,
          total: t.totalCount,
          visible: t.visibleCount
        });
        return;
      }
      t._data = n.data || [], t._sliceOffset = 0, t._sliceData = [], t._lastTotal = n.total != null ? n.total : t._data.length, t._lastFiltered = n.filtered != null ? n.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._selectable && t._selectAllCheckbox && t._selectAllCheckbox.classList.remove("hidden"), e.classList.remove("ln-list--loading"), t._vStart = -1, t._vEnd = -1, t._applyFilterAndSort(), t._render(), t._updateFooter(), S(e, "ln-list:rendered", {
        list: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, e.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(i) {
      const n = i.detail && i.detail.loading;
      e.classList.toggle("ln-list--loading", !!n), n && (t.isLoaded = !1);
    }, e.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(i) {
      i.target.closest("[data-ln-list-clear-all]") && (t.currentFilters = {}, S(e, "ln-list:clear-filters", { list: t.name }), t._requestData());
    }, e.addEventListener("click", this._onClearAll), this._selectable = e.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(i) {
      if (i.target.closest("[data-ln-item-select]") || i.target.closest("[data-ln-item-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const n = i.target.closest("[data-ln-item]");
      if (!n) return;
      const l = n.getAttribute("data-ln-item-id"), m = n._lnRecord || {};
      S(e, "ln-list:item-click", {
        list: t.name,
        id: l,
        record: m
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(i) {
      const n = i.target.closest("[data-ln-item-action]");
      if (!n) return;
      i.stopPropagation();
      const l = n.closest("[data-ln-item]");
      if (!l) return;
      const m = n.getAttribute("data-ln-item-action"), g = l.getAttribute("data-ln-item-id"), r = l._lnRecord || {};
      S(e, "ln-list:item-action", {
        list: t.name,
        id: g,
        action: m,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(i) {
      i.preventDefault(), t.currentSearch = i.detail && i.detail.term || "", S(e, "ln-list:search", {
        list: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, e.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), S(e, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      t.tbody.children.length > 0 && (t._emptyObserver.disconnect(), t._emptyObserver = null, t._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(i) {
      i.preventDefault(), t._searchTerm = i.detail && i.detail.term || "", t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), S(e, "ln-list:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-search:change", this._onSearch)), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-list-clear]") || Y(e, "ln-list:before-clear-search", { list: t.name }).defaultPrevented) return;
      t.isDataDriven ? t.currentSearch = "" : t._searchTerm = "";
      const m = document.querySelector('[data-ln-search="' + e.id + '"]');
      if (m) {
        const g = m.tagName === "INPUT" ? m : m.querySelector("input");
        g && (g.value = "", g.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
      t.isDataDriven ? (S(e, "ln-list:search", {
        list: t.name,
        query: ""
      }), t._requestData()) : (t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), S(e, "ln-list:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, e.addEventListener("click", this._onClear), this;
  }
  d.prototype._parseChildren = function() {
    const e = Array.from(this.tbody.children).filter((t) => !t.classList.contains("ln-list__spacer"));
    this._data = [], e.length > 0 && (this._itemHeight = a(e[0]) || 50);
    for (let t = 0; t < e.length; t++) {
      const i = e[t], n = i.getAttribute("data-ln-item-id") || i.getAttribute("id"), l = i.textContent.trim().toLowerCase();
      let m = null;
      if (this.isDataDriven) {
        m = {}, n != null && (m.id = n);
        const g = i.querySelectorAll("[data-ln-list-field]");
        for (let r = 0; r < g.length; r++) {
          const s = g[r], o = s.getAttribute("data-ln-list-field");
          o && (m[o] = s.textContent.trim());
        }
      }
      this._data.push({
        html: i.outerHTML,
        searchText: l,
        id: n,
        ...m
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, d.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const e = (this.currentSearch || "").trim().toLowerCase(), t = this.currentFilters || {}, i = Object.keys(t).length > 0;
      if (this._filteredData = this._data.filter(function(g) {
        if (e) {
          let r = !1;
          for (const s in g)
            if (g.hasOwnProperty(s) && typeof g[s] == "string" && s !== "html" && s !== "searchText" && g[s].toLowerCase().indexOf(e) !== -1) {
              r = !0;
              break;
            }
          if (!r) return !1;
        }
        if (i)
          for (const r in t) {
            const s = t[r];
            if (s && s.length > 0) {
              const o = g[r], _ = o != null ? String(o) : "";
              if (s.indexOf(_) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, l = this.currentSort.direction === "desc" ? -1 : 1, m = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(g, r) {
        return g < r ? -1 : g > r ? 1 : 0;
      };
      this._filteredData.sort(function(g, r) {
        const s = g[n], o = r[n];
        if (typeof s == "number" && typeof o == "number")
          return (s - o) * l;
        const _ = s != null ? String(s) : "", v = o != null ? String(o) : "";
        return m(_, v) * l;
      });
    } else {
      const e = this._searchTerm;
      e ? this._filteredData = this._data.filter(function(t) {
        return t.searchText.indexOf(e) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, d.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const e = this._sliceData && this._sliceData.length > 0, t = e ? this.visibleCount : this._lastTotal, i = this.visibleCount;
        if (t === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (!e && (this._filteredData.length === 0 || i === 0)) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        e || this._filteredData.length > 200 ? (this._virtual || this._enableVirtualScroll(), this._measureItemHeight(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const e = this._filteredData.length;
        e === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, d.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const e = this._filteredData, t = document.createDocumentFragment();
      for (let i = 0; i < e.length; i++) {
        const n = this._buildItem(e[i]);
        if (!n) break;
        t.appendChild(n);
      }
      this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
    } else {
      const e = [], t = this._filteredData;
      for (let i = 0; i < t.length; i++) e.push(t[i].html);
      this.tbody.innerHTML = e.join("");
    }
  }, d.prototype._readGridLayout = function() {
    const e = getComputedStyle(this.tbody), t = e.gridTemplateColumns;
    let i = 1;
    if (t && t !== "none") {
      const l = t.trim().split(/\s+/).filter(Boolean);
      l.length > 0 && (i = l.length);
    }
    const n = parseFloat(e.rowGap);
    return { columns: i, rowGap: isNaN(n) ? 0 : n };
  }, d.prototype._measureItemHeight = function() {
    if (this._itemHeight) return;
    const e = this._sliceData && this._sliceData.length > 0;
    if (!e && !this.isDataDriven) {
      const n = this.tbody.children;
      n.length > 0 && (this._itemHeight = a(n[0]) || 50);
      return;
    }
    let t = null;
    if (e) {
      for (let n = 0; n < this._sliceData.length; n++)
        if (this._sliceData[n]) {
          t = this._sliceData[n];
          break;
        }
    }
    if (!t && this._data.length > 0 && (t = this._data[0]), !t) return;
    const i = this._buildItem(t);
    i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._itemHeight = a(i) || 50, this.tbody.textContent = "");
  }, d.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const e = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = u(this.dom);
    const t = this._scrollContainer || window;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      e._itemHeight = 0, e._measureItemHeight(), e._vStart = -1, e._vEnd = -1, e._renderVirtual();
    }, t.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, d.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, d.prototype._renderVirtual = function() {
    const e = this._sliceData && this._sliceData.length > 0, t = e ? this._sliceData : this._filteredData, i = e ? this.visibleCount : t.length, n = this._itemHeight;
    if (!n || !i) return;
    const l = this._scrollContainer;
    let m, g;
    if (l) {
      const D = this.tbody.getBoundingClientRect(), R = l.getBoundingClientRect(), N = l === this.tbody ? 0 : D.top - R.top + l.scrollTop;
      m = l.scrollTop - N, g = l.clientHeight;
    } else {
      const R = this.tbody.getBoundingClientRect().top + window.scrollY;
      m = window.scrollY - R, g = window.innerHeight;
    }
    const r = this._readGridLayout(), s = r.columns, o = r.rowGap, _ = n + o, v = Math.ceil(i / s);
    let A = Math.max(0, Math.floor(m / _) - 15);
    A = Math.min(A, v);
    const w = Math.ceil(g / _) + 30, C = Math.min(A + w, v), T = Math.min(A * s, i), q = Math.min(C * s, i);
    if (T === this._vStart && q === this._vEnd) return;
    this._vStart = T, this._vEnd = q;
    const x = A * _, I = (v - C) * _;
    if (this.isDataDriven) {
      const D = document.createDocumentFragment();
      if (x > 0) {
        const R = document.createElement(this.isUl ? "li" : "div");
        R.className = "ln-list__spacer", R.style.height = x + "px", D.appendChild(R);
      }
      for (let R = T; R < q; R++)
        if (e)
          if (R >= this._sliceOffset && R < this._sliceOffset + this._sliceData.length) {
            const N = this._sliceData[R - this._sliceOffset];
            if (N) {
              const z = this._buildItem(N);
              z && D.appendChild(z);
            } else
              D.appendChild(this._buildPlaceholderItem());
          } else
            D.appendChild(this._buildPlaceholderItem());
        else {
          const N = this._buildItem(t[R]);
          N && D.appendChild(N);
        }
      if (I > 0) {
        const R = document.createElement(this.isUl ? "li" : "div");
        R.className = "ln-list__spacer", R.style.height = I + "px", D.appendChild(R);
      }
      this.tbody.textContent = "", this.tbody.appendChild(D), this._selectable && this._updateSelectAll(), e && this._ensureSlice(T, q);
    } else {
      let D = "";
      x > 0 && (D += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${x}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let R = T; R < q; R++)
        D += t[R].html;
      I > 0 && (D += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${I}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = D;
    }
  }, d.prototype._buildPlaceholderItem = function() {
    const e = document.createElement(this.isUl ? "li" : "div");
    return e.className = "ln-list__placeholder", e.setAttribute("aria-hidden", "true"), e.style.height = this._itemHeight + "px", e;
  }, d.prototype._ensureSlice = function(e, t) {
    const i = this._sliceData ? this._sliceData.length : 0;
    if (i === 0 || this.visibleCount === 0) return;
    const n = 25, l = Math.max(0, e - n), m = Math.min(this.visibleCount, t + n), g = i, r = Math.floor(l / g), s = Math.floor(Math.max(0, m - 1) / g);
    let o = -1;
    for (let w = r; w <= s; w++) {
      const C = w * g;
      if (C < this._sliceOffset || C >= this._sliceOffset + i) {
        o = w;
        break;
      }
    }
    if (o === -1) return;
    const _ = o * g, v = g;
    this._debounceId && clearTimeout(this._debounceId);
    const A = this;
    this._debounceId = setTimeout(function() {
      A.dom.classList.add("ln-list--loading"), S(A.dom, "ln-list:request-data", {
        list: A.name,
        sort: A.currentSort,
        offset: _,
        limit: v
      });
    }, 120);
  }, d.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let e = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount, n = this.currentSearch && (i < t || i === 0), l = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (e = mt(this.dom, l, "ln-list"), !e) {
        const m = this.dom.querySelector("template[data-ln-empty]");
        if (m) {
          const g = n ? "search" : "initial", r = m.content.querySelector(`[data-ln-empty-when="${g}"]`) || m.content.firstElementChild;
          r && (e = document.importNode(r, !0));
        }
      }
    } else {
      const t = this.dom.querySelector(`template[${y}]`);
      t && (e = document.importNode(t.content, !0));
    }
    if (e)
      if (e.tagName === "LI" || e.tagName === "TR")
        this.tbody.appendChild(e);
      else {
        const t = document.createElement(this.isUl ? "li" : "div");
        t.appendChild(e), this.tbody.appendChild(t);
      }
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, d.prototype._buildItem = function(e) {
    const t = mt(this.dom, this.name + "-row", "ln-list");
    if (!t) return null;
    const i = t.querySelector("[data-ln-item]") || t.firstElementChild;
    if (!i) return null;
    if (wt(i, e), it(i, e), i._lnRecord = e, e.id != null && (i.setAttribute("data-ln-item-id", e.id), this._selectable && this.selectedIds.has(String(e.id)))) {
      i.classList.add("ln-item-selected");
      const n = i.querySelector("[data-ln-item-select]");
      n && (n.checked = !0);
    }
    return i;
  }, d.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const e = this;
    this._onSelectionChange = function(t) {
      const i = t.target.closest("[data-ln-item-select]");
      if (!i) return;
      const n = i.closest("[data-ln-item]");
      if (!n) return;
      const l = n.getAttribute("data-ln-item-id");
      l != null && (i.checked ? (e.selectedIds.add(String(l)), n.classList.add("ln-item-selected")) : (e.selectedIds.delete(String(l)), n.classList.remove("ln-item-selected")), e._updateSelectAll(), e._updateFooter(), S(e.dom, "ln-list:select", {
        list: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const t = e._selectAllCheckbox.checked, i = e.tbody.querySelectorAll("[data-ln-item]");
      for (let n = 0; n < i.length; n++) {
        const l = i[n], m = l.getAttribute("data-ln-item-id"), g = l.querySelector("[data-ln-item-select]");
        m != null && (t ? (e.selectedIds.add(String(m)), l.classList.add("ln-item-selected")) : (e.selectedIds.delete(String(m)), l.classList.remove("ln-item-selected")), g && (g.checked = t));
      }
      S(e.dom, "ln-list:select-all", { list: e.name, selected: t }), S(e.dom, "ln-list:select", {
        list: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedIds.size
      }), e._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, d.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const e = this.tbody.querySelectorAll("[data-ln-item]");
    let t = e.length > 0;
    for (let i = 0; i < e.length; i++) {
      const n = e[i].getAttribute("data-ln-item-id");
      if (n != null && !this.selectedIds.has(String(n))) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, d.prototype._requestData = function() {
    if (this._sliceData && this._sliceData.length > 0) {
      this.dom.classList.add("ln-list--loading");
      const t = this._sliceData.length || 200;
      this._sliceOffset = 0, this._sliceData = [], S(this.dom, "ln-list:request-data", {
        list: this.name,
        sort: this.currentSort,
        offset: 0,
        limit: t
      });
      return;
    }
    se(this, "ln-list:request-data", "list");
  }, d.prototype._updateFooter = function() {
    let e = 0, t = 0;
    this.isDataDriven ? (e = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount) : (e = this._data.length, t = this._filteredData.length);
    const i = t < e;
    if (this._totalSpan && (this._totalSpan.textContent = f(e, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = i ? f(t, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const n = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = n > 0 ? f(n, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", n === 0);
    }
  }, d.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this._debounceId && (clearTimeout(this._debounceId), this._debounceId = null), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch)), this._onClear && this.dom.removeEventListener("click", this._onClear), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, H(h, c, d, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", c = "lnCircularProgress";
  if (window[c] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", b = 36, p = 16, f = 2 * Math.PI * p;
  function u(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, d.call(this), t.call(this), e.call(this), this;
  }
  u.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[c]);
  };
  function a(i, n) {
    const l = document.createElementNS(y, i);
    for (const m in n)
      l.setAttribute(m, n[m]);
    return l;
  }
  function d() {
    this.svg = a("svg", {
      viewBox: "0 0 " + b + " " + b,
      "aria-hidden": "true"
    }), this.trackCircle = a("circle", {
      cx: b / 2,
      cy: b / 2,
      r: p,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = a("circle", {
      cx: b / 2,
      cy: b / 2,
      r: p,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": f,
      "stroke-dashoffset": f,
      transform: "rotate(-90 " + b / 2 + " " + b / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function e() {
    const i = this, n = new MutationObserver(function(l) {
      for (const m of l)
        (m.attributeName === "data-ln-circular-progress" || m.attributeName === "data-ln-circular-progress-max" || m.attributeName === "data-ln-circular-progress-label") && t.call(i);
    });
    n.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = n;
  }
  function t() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, n = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let l = n > 0 ? i / n * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100);
    const m = f - l / 100 * f;
    this.progressCircle.setAttribute("stroke-dashoffset", m);
    const g = this.dom.getAttribute("data-ln-circular-progress-label"), r = g !== null ? g : Math.round(l) + "%";
    this.labelEl.textContent = r, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(n));
    const s = Math.max(0, Math.min(i, n));
    this.dom.setAttribute("aria-valuenow", String(s)), this.dom.setAttribute("aria-valuetext", r), S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: n,
      percentage: l
    });
  }
  H(h, c, u, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", c = "lnSortable", y = "data-ln-sortable-handle";
  if (window[c] !== void 0) return;
  function b(f) {
    this.dom = f, this.isEnabled = f.getAttribute(h) !== "disabled", this._dragging = null, f.setAttribute("aria-roledescription", "sortable list");
    const u = this;
    return this._onPointerDown = function(a) {
      u.isEnabled && u._handlePointerDown(a);
    }, f.addEventListener("pointerdown", this._onPointerDown), this;
  }
  b.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, b.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, b.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[c]);
  }, b.prototype._handlePointerDown = function(f) {
    let u = f.target.closest("[" + y + "]"), a;
    if (u) {
      for (a = u; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (a = f.target; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
      u = a;
    }
    const e = Array.from(this.dom.children).indexOf(a);
    if (Y(this.dom, "ln-sortable:before-drag", {
      item: a,
      index: e
    }).defaultPrevented) return;
    f.preventDefault(), u.setPointerCapture(f.pointerId), this._dragging = a, a.classList.add("ln-sortable--dragging"), a.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: a,
      index: e
    });
    const i = this, n = function(m) {
      i._handlePointerMove(m);
    }, l = function(m) {
      i._handlePointerEnd(m), u.removeEventListener("pointermove", n), u.removeEventListener("pointerup", l), u.removeEventListener("pointercancel", l);
    };
    u.addEventListener("pointermove", n), u.addEventListener("pointerup", l), u.addEventListener("pointercancel", l);
  }, b.prototype._handlePointerMove = function(f) {
    if (!this._dragging) return;
    const u = Array.from(this.dom.children), a = this._dragging;
    for (const d of u)
      d.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const d of u) {
      if (d === a) continue;
      const e = d.getBoundingClientRect(), t = e.top + e.height / 2;
      if (f.clientY >= e.top && f.clientY < t) {
        d.classList.add("ln-sortable--drop-before");
        break;
      } else if (f.clientY >= t && f.clientY <= e.bottom) {
        d.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, b.prototype._handlePointerEnd = function(f) {
    if (!this._dragging) return;
    const u = this._dragging, a = Array.from(this.dom.children), d = a.indexOf(u);
    let e = null, t = null;
    for (const i of a) {
      if (i.classList.contains("ln-sortable--drop-before")) {
        e = i, t = "before";
        break;
      }
      if (i.classList.contains("ln-sortable--drop-after")) {
        e = i, t = "after";
        break;
      }
    }
    for (const i of a)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (u.classList.remove("ln-sortable--dragging"), u.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== u) {
      t === "before" ? this.dom.insertBefore(u, e) : this.dom.insertBefore(u, e.nextElementSibling);
      const n = Array.from(this.dom.children).indexOf(u);
      S(this.dom, "ln-sortable:reordered", {
        item: u,
        oldIndex: d,
        newIndex: n
      });
    }
    this._dragging = null;
  };
  function p(f) {
    const u = f[c];
    if (!u) return;
    const a = f.getAttribute(h) !== "disabled";
    a !== u.isEnabled && (u.isEnabled = a, S(f, a ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: f }));
  }
  H(h, c, b, "ln-sortable", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-confirm", c = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[c] !== void 0) return;
  function p(...u) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...u);
  }
  function f(u) {
    p("constructor called on", u), this.dom = u, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = u.querySelector("[data-ln-confirm-idle]"), this.activeEl = u.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = u.textContent.trim(), this.confirmText = u.getAttribute(h) || "Confirm?");
    const a = this;
    return this._onClick = function(d) {
      if (p("click handler, confirming:", a.confirming, "submitted:", a._submitted, "target:", d.target), !a.confirming)
        d.preventDefault(), d.stopImmediatePropagation(), a._enterConfirm();
      else {
        if (a._submitted) return;
        a._submitted = !0, a._reset();
      }
    }, u.addEventListener("click", this._onClick), this;
  }
  f.prototype._getTimeout = function() {
    const u = parseFloat(this.dom.getAttribute(y));
    return isNaN(u) || u <= 0 ? 3 : u;
  }, f.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const a = this.activeEl ? this.activeEl.textContent.trim() : "";
      a && (this.dom.setAttribute("aria-label", a), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = u.getAttribute("href"), u.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, f.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const u = this, a = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      u._reset();
    }, a);
  }, f.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      var u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalIconHref && u.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, f.prototype.destroy = function() {
    p("destroy called on", this.dom), this.dom[c] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[c]);
  }, H(h, c, f, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", c = "lnTranslations";
  if (window[c] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function b(p) {
    this.dom = p, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = p.getAttribute(h + "-default") || "", this.placeholderLabel = p.getAttribute(h + "-placeholder") || "{lang} translation", this.removeLabel = p.getAttribute(h + "-remove-label") || "Remove {lang}", this.badgesEl = p.querySelector("[" + h + "-active]"), this.menuEl = p.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const f = p.getAttribute(h + "-locales");
    if (this.locales = y, f)
      try {
        this.locales = JSON.parse(f);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const u = this;
    return this._onRequestAdd = function(a) {
      a.detail && a.detail.lang && u.addLanguage(a.detail.lang);
    }, this._onRequestRemove = function(a) {
      a.detail && a.detail.lang && u.removeLanguage(a.detail.lang);
    }, p.addEventListener("ln-translations:request-add", this._onRequestAdd), p.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  b.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of p) {
      const u = f.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const a of u)
        a.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, b.prototype._detectExisting = function() {
    const p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const f of p) {
      const u = f.getAttribute("data-ln-translatable-lang");
      u && u !== this.defaultLang && this.activeLanguages.add(u);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, b.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const p = this;
    let f = 0;
    for (const a in this.locales) {
      if (!this.locales.hasOwnProperty(a) || this.activeLanguages.has(a)) continue;
      f++;
      const d = It("ln-translations-menu-item", "ln-translations");
      if (!d) return;
      const e = d.querySelector("[data-ln-translations-lang]");
      e.setAttribute("data-ln-translations-lang", a), e.textContent = this.locales[a], e.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), p.menuEl.getAttribute("data-ln-toggle") === "open" && p.menuEl.setAttribute("data-ln-toggle", "close"), p.addLanguage(a));
      }), this.menuEl.appendChild(d);
    }
    const u = this.dom.querySelector("[" + h + "-add]");
    u && (u.hidden = f === 0);
  }, b.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const p = this;
    this.activeLanguages.forEach(function(f) {
      const u = It("ln-translations-badge", "ln-translations");
      if (!u) return;
      const a = u.querySelector("[data-ln-translations-lang]");
      a.setAttribute("data-ln-translations-lang", f);
      const d = a.querySelector("span");
      d.textContent = p.locales[f] || f.toUpperCase();
      const e = a.querySelector("button"), t = p.locales[f] || f.toUpperCase();
      e.setAttribute("aria-label", p.removeLabel.replace("{lang}", t)), e.addEventListener("click", function(i) {
        i.ctrlKey || i.metaKey || i.button === 1 || (i.preventDefault(), i.stopPropagation(), p.removeLanguage(f));
      }), p.badgesEl.appendChild(u);
    });
  }, b.prototype.addLanguage = function(p, f) {
    if (this.activeLanguages.has(p)) return;
    const u = this.locales[p] || p;
    if (Y(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: p,
      langName: u
    }).defaultPrevented) return;
    this.activeLanguages.add(p), f = f || {};
    const d = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const e of d) {
      const t = e.getAttribute("data-ln-translatable"), i = e.getAttribute("data-ln-translations-prefix") || "", n = e.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!n) continue;
      const l = n.cloneNode(n.tagName === "SELECT");
      i ? l.name = i + "[trans][" + p + "][" + t + "]" : l.name = "trans[" + p + "][" + t + "]", l.value = f[t] !== void 0 ? f[t] : "", l.removeAttribute("id"), "placeholder" in l && (l.placeholder = this.placeholderLabel.replace("{lang}", u)), l.setAttribute("data-ln-translatable-lang", p);
      const m = e.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), g = m.length > 0 ? m[m.length - 1] : n;
      g.parentNode.insertBefore(l, g.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: p,
      langName: u
    });
  }, b.prototype.removeLanguage = function(p) {
    if (!this.activeLanguages.has(p) || Y(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: p
    }).defaultPrevented) return;
    const u = this.dom.querySelectorAll('[data-ln-translatable-lang="' + p + '"]');
    for (const a of u)
      a.parentNode.removeChild(a);
    this.activeLanguages.delete(p), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: p
    });
  }, b.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, b.prototype.hasLanguage = function(p) {
    return this.activeLanguages.has(p);
  }, b.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const p = this.defaultLang, f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const u of f)
      u.getAttribute("data-ln-translatable-lang") !== p && u.parentNode.removeChild(u);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[c];
  }, H(h, c, b, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", c = "lnAutosave", y = "data-ln-autosave-clear", b = "data-ln-autosave-debounce-input", p = "ln-autosave:";
  if (window[c] !== void 0) return;
  function u(t) {
    const i = a(t);
    if (!i) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = i;
    let n = null;
    function l() {
      const s = ae(t, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(i, JSON.stringify(s));
      } catch {
        return;
      }
      S(t, "ln-autosave:saved", { target: t, data: s });
    }
    function m() {
      let s;
      try {
        s = localStorage.getItem(i);
      } catch {
        return;
      }
      if (!s) return;
      let o;
      try {
        o = JSON.parse(s);
      } catch {
        return;
      }
      if (Y(t, "ln-autosave:before-restore", { target: t, data: o }).defaultPrevented) return;
      const v = le(t, o);
      for (let A = 0; A < v.length; A++)
        v[A].dispatchEvent(new Event("input", { bubbles: !0 })), v[A].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(t, "ln-autosave:restored", { target: t, data: o });
    }
    function g() {
      try {
        localStorage.removeItem(i);
      } catch {
        return;
      }
      S(t, "ln-autosave:cleared", { target: t });
    }
    this._onFocusout = function(s) {
      const o = s.target;
      d(o) && o.name && !o.hasAttribute("data-ln-autosave-exclude") && l();
    }, this._onChange = function(s) {
      const o = s.target;
      d(o) && o.name && !o.hasAttribute("data-ln-autosave-exclude") && l();
    }, this._onSubmit = function() {
      g();
    }, this._onReset = function() {
      g();
    }, this._onClearClick = function(s) {
      s.target.closest("[" + y + "]") && g();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick);
    const r = e(t);
    return r > 0 && (this._onInput = function(s) {
      const o = s.target;
      !d(o) || !o.name || o.hasAttribute("data-ln-autosave-exclude") || (n !== null && clearTimeout(n), n = setTimeout(l, r));
    }, t.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return n;
    }, m(), this;
  }
  u.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const t = this._getInputTimer();
        t !== null && clearTimeout(t);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[c];
    }
  };
  function a(t) {
    const n = t.getAttribute(h) || t.id;
    return n ? p + window.location.pathname + ":" + n : null;
  }
  function d(t) {
    const i = t.tagName;
    return i === "INPUT" || i === "TEXTAREA" || i === "SELECT";
  }
  function e(t) {
    if (!t.hasAttribute(b)) return 0;
    const i = t.getAttribute(b);
    if (i === "" || i === null) return 1e3;
    const n = parseInt(i, 10);
    return isNaN(n) || n < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", t), 1e3) : n;
  }
  H(h, c, u, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", c = "lnAutoresize";
  if (window[c] !== void 0) return;
  function y(b) {
    if (b.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", b.tagName), this;
    this.dom = b;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, b.addEventListener("input", this._onInput), this._resize(), this;
  }
  y.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, y.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[c]);
  }, H(h, c, y, "ln-autoresize");
})();
(function() {
  const h = "data-ln-editor", c = "lnEditor";
  if (window[c] !== void 0) return;
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
  }, p = {
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
  let u = 0;
  function a(r) {
    return !!(b[r] || p[r] || f[r] || r === "link");
  }
  function d(r) {
    this.dom = r;
    const s = this;
    if (this._textarea = r.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", r), this;
    const o = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), o && this._surface.setAttribute("data-placeholder", o);
    const _ = this._textarea.id;
    if (_) {
      const C = r.querySelector('label[for="' + _ + '"]');
      C && (C.id || (C.id = _ + "-label"), this._surface.setAttribute("aria-labelledby", C.id));
    }
    this._surface.id = _ ? _ + "-surface" : "ln-editor-surface-" + ++u;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const A = r.querySelector('[role="toolbar"]');
    if (A && A.nextSibling ? r.insertBefore(this._surface, A.nextSibling) : r.appendChild(this._surface), A) {
      A.setAttribute("aria-controls", this._surface.id);
      const C = A.querySelectorAll("[data-ln-editor-action]");
      for (let T = 0; T < C.length; T++) {
        const q = C[T].getAttribute("data-ln-editor-action");
        a(q) && C[T].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      s._syncToTextarea(), S(s.dom, "ln-editor:changed", {
        html: s._textarea.value,
        target: s.dom
      });
    }, this._onMousedownToolbar = function(C) {
      C.target.closest("[data-ln-editor-action]") && C.preventDefault();
    }, this._onClickToolbar = function(C) {
      const T = C.target.closest("[data-ln-editor-action]");
      if (!T) return;
      const q = T.getAttribute("data-ln-editor-action");
      s._execAction(q);
    }, this._onPaste = function(C) {
      i(s, C);
    }, this._onKeydown = function(C) {
      m(s, C);
    }, this._onSelectionChange = function() {
      document.contains(s._surface) && s._updateActiveStates();
    }, this._onFocus = function() {
      S(s.dom, "ln-editor:focus", { target: s.dom });
    }, this._onBlur = function() {
      s._syncToTextarea(), S(s.dom, "ln-editor:blur", { target: s.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), A && (A.addEventListener("mousedown", this._onMousedownToolbar), A.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(C) {
      const T = C.detail && C.detail.html;
      T !== void 0 && (s._surface.innerHTML = T, s._syncToTextarea(), S(s.dom, "ln-editor:changed", {
        html: s._textarea.value,
        target: s.dom
      }));
    }, r.addEventListener("ln-editor:set-content", this._onSetContent);
    const w = this._textarea.form;
    return w && (this._onFormReset = function() {
      setTimeout(function() {
        s._surface.innerHTML = s._textarea.value, S(r, "ln-editor:changed", {
          html: s._textarea.value,
          target: r
        });
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), this;
  }
  d.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, d.prototype._execAction = function(r) {
    if (!(!r || Y(this.dom, "ln-editor:before-change", {
      action: r,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), b[r])
        document.execCommand(b[r], !1, null);
      else if (p[r]) {
        const o = p[r], _ = e(this._surface);
        _ && _.toLowerCase() === o ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + o + ">");
      } else f[r] ? document.execCommand(f[r], !1, null) : r === "link" ? g(this) : r === "unlink" ? document.execCommand("unlink", !1, null) : r === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, d.prototype._updateActiveStates = function() {
    const r = this.dom.querySelector('[role="toolbar"]');
    if (!r) return;
    const s = window.getSelection();
    if (!s || s.rangeCount === 0) return;
    const o = s.anchorNode;
    if (!o || !this._surface.contains(o)) return;
    const _ = r.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < _.length; v++) {
      const A = _[v], w = A.getAttribute("data-ln-editor-action");
      let C = !1;
      if (b[w])
        try {
          C = document.queryCommandState(b[w]);
        } catch {
        }
      else if (p[w]) {
        const T = e(this._surface);
        C = T && T.toLowerCase() === p[w];
      } else if (f[w])
        try {
          C = document.queryCommandState(f[w]);
        } catch {
        }
      else w === "link" && (C = !!t(s.anchorNode, "A", this._surface));
      a(w) && A.setAttribute("aria-pressed", String(C)), C ? A.classList.add("ln-editor-active") : A.classList.remove("ln-editor-active");
    }
  }, d.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, d.prototype.setHTML = function(r) {
    this._surface && (this._surface.innerHTML = r, this._syncToTextarea(), S(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, d.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const r = this.dom.querySelector('[role="toolbar"]');
    r && (r.removeEventListener("mousedown", this._onMousedownToolbar), r.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const s = this._textarea ? this._textarea.form : null;
    s && this._onFormReset && s.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const o = this.dom.querySelector(".ln-editor__link-popover");
    o && o.remove(), S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function e(r) {
    const s = window.getSelection();
    if (!s || s.rangeCount === 0) return null;
    let o = s.anchorNode;
    if (!o) return null;
    for (; o && o !== r; ) {
      if (o.nodeType === 1) {
        const _ = o.tagName;
        if (_ === "H2" || _ === "H3" || _ === "H4" || _ === "BLOCKQUOTE" || _ === "PRE" || _ === "P")
          return _;
      }
      o = o.parentNode;
    }
    return null;
  }
  function t(r, s, o) {
    for (; r && r !== o; ) {
      if (r.nodeType === 1 && r.tagName === s)
        return r;
      r = r.parentNode;
    }
    return null;
  }
  function i(r, s) {
    s.preventDefault();
    let o = "";
    if (s.clipboardData && (o = s.clipboardData.getData("text/html"), !o)) {
      const v = s.clipboardData.getData("text/plain");
      v && (o = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), o = "<p>" + o + "</p>");
    }
    if (!o) return;
    const _ = n(o);
    _ && document.execCommand("insertHTML", !1, _);
  }
  function n(r) {
    const s = document.createElement("div");
    return s.innerHTML = r, l(s), s.innerHTML;
  }
  function l(r) {
    const s = Array.from(r.childNodes);
    for (let o = 0; o < s.length; o++) {
      const _ = s[o];
      if (_.nodeType !== 3) {
        if (_.nodeType !== 1) {
          r.removeChild(_);
          continue;
        }
        if (y[_.tagName]) {
          const v = Array.from(_.attributes);
          for (let A = 0; A < v.length; A++) {
            const w = v[A].name;
            if (_.tagName === "A" && w === "href") {
              const C = _.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(C) || _.removeAttribute("href");
            } else
              _.removeAttribute(w);
          }
          _.tagName === "A" && _.setAttribute("rel", "noopener noreferrer"), l(_);
        } else {
          for (; _.firstChild; )
            r.insertBefore(_.firstChild, _);
          r.removeChild(_);
        }
      }
    }
  }
  function m(r, s) {
    if (!(s.ctrlKey || s.metaKey)) return;
    let o = null;
    switch (s.key.toLowerCase()) {
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
    o && (s.preventDefault(), r._execAction(o));
  }
  function g(r) {
    const s = window.getSelection();
    if (!s || s.rangeCount === 0) return;
    const o = t(s.anchorNode, "A", r._surface), _ = s.getRangeAt(0).cloneRange(), v = r.dom.querySelector(".ln-editor__link-popover");
    v && v.remove();
    const A = mt(r.dom, "ln-editor-link-popover", "ln-editor");
    if (!A) return;
    const w = A.firstElementChild;
    if (!w) return;
    const C = w.querySelector('input[type="url"]'), T = w.querySelector('[data-ln-editor-action="confirm-link"]'), q = w.querySelector('[data-ln-editor-action="cancel-link"]');
    o && (C.value = o.getAttribute("href") || "");
    const x = r.dom.querySelector('[role="toolbar"]');
    x ? x.after(w) : r.dom.insertBefore(w, r._surface), C.focus();
    function I() {
      const N = window.getSelection();
      N.removeAllRanges(), N.addRange(_);
    }
    function D() {
      const N = C.value.trim();
      if (w.remove(), I(), r._surface.focus(), N)
        if (o)
          o.setAttribute("href", N), o.setAttribute("rel", "noopener noreferrer"), r._syncToTextarea(), S(r.dom, "ln-editor:changed", {
            html: r._textarea.value,
            target: r.dom
          });
        else {
          document.execCommand("createLink", !1, N);
          const z = window.getSelection();
          if (z && z.anchorNode) {
            const Q = t(z.anchorNode, "A", r._surface);
            Q && (Q.setAttribute("rel", "noopener noreferrer"), r._syncToTextarea());
          }
        }
      else o && document.execCommand("unlink", !1, null);
    }
    function R() {
      w.remove(), I(), r._surface.focus();
    }
    T.addEventListener("click", D), q.addEventListener("click", R), C.addEventListener("keydown", function(N) {
      N.key === "Enter" ? (N.preventDefault(), D()) : N.key === "Escape" && (N.preventDefault(), R());
    });
  }
  H(h, c, d, "ln-editor");
})();
(function() {
  const h = "lnFill";
  if (window[h] !== void 0) return;
  const c = { lnFillForm: !0, lnFillStore: !0 };
  function y(p) {
    const f = {}, u = p.dataset;
    for (const a in u) {
      if (!a.startsWith("lnFill") || c[a]) continue;
      const d = a.slice(6);
      d && (f[d.charAt(0).toLowerCase() + d.slice(1)] = u[a]);
    }
    return f;
  }
  function b(p, f) {
    const u = window.CSS && CSS.escape ? CSS.escape(f) : f, a = document.querySelectorAll('[data-ln-fill-id="' + u + '"]');
    if (a.length === 0) return null;
    for (let d = 0; d < a.length; d++) {
      const e = a[d].getAttribute("data-ln-fill-form");
      if (e) {
        const t = document.getElementById(e);
        if (t && p.contains(t)) return a[d];
      }
    }
    return a[0];
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const f = p.target.closest("[data-ln-fill-form]");
    if (!f) return;
    const u = f.getAttribute("href");
    if (u && u.indexOf("#") !== -1) return;
    const a = f.getAttribute("data-ln-fill-form"), d = document.getElementById(a);
    if (!d) return;
    const e = y(f), t = Object.keys(e).length > 0;
    window.lnCore.lnFill(d, t ? e : null);
  }), document.addEventListener("ln-fill:request", function(p) {
    const f = p.detail;
    if (!f) return;
    const u = p.target, a = f.id;
    if (a == null) {
      window.lnCore.lnFill(u, null);
      return;
    }
    const d = b(u, a);
    if (!d) return;
    const e = y(d);
    window.lnCore.lnFill(u, e);
  }), window[h] = !0;
})();
(function() {
  const h = "data-ln-slug-from", c = "lnSlug";
  if (window[c] !== void 0) return;
  function y(p) {
    return String(p).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function b(p) {
    if (p.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", p.tagName), this;
    const f = p.form;
    if (!f)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", p), this;
    const u = p.getAttribute(h), a = f.elements[u];
    if (!a)
      return console.warn('[ln-slug] Source field "' + u + '" not found in form:', p), this;
    if (typeof a.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + u + '" is a RadioNodeList (same-name group) — single source field required:', p), this;
    this.dom = p, this.source = a, this._pristine = p.value === "", this._mirroring = !1;
    const d = this;
    return this._onSource = function() {
      d._pristine && d._mirror();
    }, this._onSlug = function() {
      d._mirroring || (d._pristine = d.dom.value === "");
    }, a.addEventListener("input", this._onSource), p.addEventListener("input", this._onSlug), this;
  }
  b.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = y(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, b.prototype.destroy = function() {
    this.dom[c] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[c]);
  }, H(h, c, b, "ln-slug");
})();
(function() {
  const h = "data-ln-time", c = "lnTime";
  if (window[c] !== void 0) return;
  const y = {}, b = {};
  function p(w) {
    return w.getAttribute("data-ln-time-locale") || W(w);
  }
  function f(w, C) {
    const T = (w || "") + "|" + JSON.stringify(C);
    return y[T] || (y[T] = new Intl.DateTimeFormat(w, C)), y[T];
  }
  function u(w) {
    const C = w || "";
    return b[C] || (b[C] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), b[C];
  }
  const a = /* @__PURE__ */ new Set();
  let d = null;
  function e() {
    d || (d = setInterval(i, 6e4));
  }
  function t() {
    d && (clearInterval(d), d = null);
  }
  function i() {
    for (const w of a) {
      if (!document.body.contains(w.dom)) {
        a.delete(w);
        continue;
      }
      s(w);
    }
    a.size === 0 && t();
  }
  function n(w, C) {
    const T = Lt(C), q = (C || "").toLowerCase().split("-")[0], x = f(C, { dateStyle: "long", timeStyle: "short" }), I = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (T && I !== q && T.monthsLong) {
      const D = T.monthsLong[w.getMonth()], R = w.getDate(), N = w.getFullYear(), z = String(w.getHours()).padStart(2, "0"), Q = String(w.getMinutes()).padStart(2, "0");
      return `${R} ${D} ${N} во ${z}:${Q}`;
    }
    return x.format(w);
  }
  function l(w, C) {
    const T = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    w.getFullYear() !== T.getFullYear() && (q.year = "numeric");
    const x = Lt(C), I = (C || "").toLowerCase().split("-")[0], D = f(C, q), R = D.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && R !== I && x.monthsShort) {
      const N = x.monthsShort[w.getMonth()], z = w.getDate(), Q = w.getFullYear() !== T.getFullYear() ? " " + w.getFullYear() : "";
      return `${z} ${N}${Q}`;
    }
    return D.format(w);
  }
  function m(w, C) {
    return f(C, { dateStyle: "medium" }).format(w);
  }
  function g(w, C) {
    return f(C, { timeStyle: "short" }).format(w);
  }
  function r(w, C) {
    const T = Math.floor(Date.now() / 1e3), x = Math.floor(w.getTime() / 1e3) - T, I = Math.abs(x);
    if (I < 10) return u(C).format(0, "second");
    let D, R;
    if (I < 60)
      D = "second", R = x;
    else if (I < 3600)
      D = "minute", R = Math.round(x / 60);
    else if (I < 86400)
      D = "hour", R = Math.round(x / 3600);
    else if (I < 604800)
      D = "day", R = Math.round(x / 86400);
    else if (I < 2592e3)
      D = "week", R = Math.round(x / 604800);
    else
      return l(w, C);
    return u(C).format(R, D);
  }
  function s(w) {
    const C = w.dom.getAttribute("datetime");
    if (!C) return;
    const T = Number(C);
    if (isNaN(T)) return;
    const q = new Date(T * 1e3), x = w.dom.getAttribute(h) || "short", I = p(w.dom);
    let D;
    switch (x) {
      case "relative":
        D = r(q, I);
        break;
      case "full":
        D = n(q, I);
        break;
      case "date":
        D = m(q, I);
        break;
      case "time":
        D = g(q, I);
        break;
      default:
        D = l(q, I);
        break;
    }
    w.dom.textContent = D, x !== "full" && (w.dom.title = n(q, I));
  }
  function o(w) {
    return this.dom = w, s(this), w.getAttribute(h) === "relative" && (a.add(this), e()), this;
  }
  o.prototype.render = function() {
    s(this);
  }, o.prototype.destroy = function() {
    a.delete(this), a.size === 0 && t(), delete this.dom[c];
  };
  function _(w) {
    const C = w[c];
    if (!C) return;
    w.getAttribute(h) === "relative" ? (a.add(C), e()) : (a.delete(C), a.size === 0 && t()), s(C);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(h) && w[c] && s(w[c]);
  }
  function A() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + h + "]");
      for (let C = 0; C < w.length; C++) {
        const T = w[C][c];
        T && s(T);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(h, c, o, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: _,
    onInit: v
  }), A();
})();
function Ve(h) {
  h = h || {};
  let c = h.windowSize > 0 ? h.windowSize : 1e3, y = h.pageSize > 0 ? h.pageSize : 200, b = h.threshold != null ? h.threshold : 25, p = h.fetchDebounce != null ? h.fetchDebounce : 120;
  const f = typeof h.requestPage == "function" ? h.requestPage : function() {
  }, u = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
  let e = 0, t = 0, i = 0, n = null, l = 0;
  function m(s) {
    a.set(s, ++l);
  }
  function g() {
    if (u.size <= c) return;
    const s = Array.from(u.keys()).sort(function(_, v) {
      return (a.get(_) || 0) - (a.get(v) || 0);
    });
    let o = 0;
    for (; u.size > c && o < s.length; )
      u.delete(s[o]), a.delete(s[o]), o++;
  }
  function r(s, o, _) {
    d.add(s), f(s, o, _);
  }
  return {
    get logicalTotal() {
      return e;
    },
    set logicalTotal(s) {
      e = s;
    },
    get grandTotal() {
      return t;
    },
    set grandTotal(s) {
      t = s;
    },
    get queryGen() {
      return i;
    },
    set queryGen(s) {
      i = s;
    },
    get size() {
      return u.size;
    },
    getId: function(s) {
      if (u.has(s))
        return m(s), u.get(s);
    },
    ensure: function(s, o, _) {
      if (e <= 0) {
        d.has(0) || (clearTimeout(n), n = setTimeout(function() {
          r(0, y, _);
        }, p));
        return;
      }
      const v = Math.max(0, s - b), A = Math.min(e, o + b), w = Math.floor(v / y), C = Math.floor(Math.max(0, A - 1) / y);
      let T = -1, q = y;
      for (let x = w; x <= C; x++) {
        const I = x * y, D = Math.min(y, e - I);
        let R = !1;
        for (let N = I; N < I + D; N++)
          if (!u.has(N)) {
            R = !0;
            break;
          }
        if (R && !d.has(I)) {
          T = I, q = D;
          break;
        }
      }
      T !== -1 && (clearTimeout(n), n = setTimeout(function() {
        r(T, q, _);
      }, p));
    },
    ingest: function(s, o, _, v, A) {
      if (!(A != null && A !== i)) {
        t = _ ?? t, e = v ?? e;
        for (let w = 0; w < o.length; w++)
          u.set(s + w, o[w]), m(s + w);
        d.delete(s), g();
      }
    },
    reset: function() {
      i++, u.clear(), a.clear(), d.clear(), t = 0, clearTimeout(n);
    },
    clear: function() {
      u.clear(), a.clear(), d.clear(), clearTimeout(n);
    },
    configure: function(s) {
      if (s = s || {}, s.windowSize != null && s.windowSize > 0 && s.windowSize !== c) {
        const o = s.windowSize < c;
        c = s.windowSize, o && g();
      }
      s.pageSize != null && s.pageSize > 0 && (y = s.pageSize), s.threshold != null && s.threshold >= 0 && (b = s.threshold), s.fetchDebounce != null && s.fetchDebounce >= 0 && (p = s.fetchDebounce);
    }
  };
}
(function() {
  const h = "data-ln-data-store", c = "lnDataStore";
  if (window[c] !== void 0) return;
  const y = "ln_app_cache", b = "_meta", p = "1.0";
  let f = null, u = null;
  const a = {};
  function d(E) {
    E && E.name === "QuotaExceededError" && S(document, "ln-data-store:quota-exceeded", { error: E });
  }
  function e() {
    const E = {};
    for (const L of document.querySelectorAll(`[${h}]`)) {
      const k = L.id;
      if (k) {
        const M = L.getAttribute("data-ln-data-store-indexes") || "";
        E[k] = {
          indexes: M.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return E;
  }
  function t() {
    return u || (u = new Promise((E) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), E(null);
      const L = e(), k = Object.keys(L), M = indexedDB.open(y);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), E(null);
      }, M.onsuccess = (O) => {
        const F = O.target.result, B = Array.from(F.objectStoreNames);
        if (!(!B.includes(b) || k.some((Z) => !B.includes(Z))))
          return i(F), f = F, E(F);
        const K = F.version;
        F.close();
        const V = indexedDB.open(y, K + 1);
        V.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, V.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), E(null);
        }, V.onupgradeneeded = (Z) => {
          const rt = Z.target.result;
          rt.objectStoreNames.contains(b) || rt.createObjectStore(b, { keyPath: "key" });
          for (const Ft of k)
            if (!rt.objectStoreNames.contains(Ft)) {
              const Le = rt.createObjectStore(Ft, { keyPath: "id" });
              for (const Yt of L[Ft].indexes)
                Le.createIndex(Yt, Yt, { unique: !1 });
            }
        }, V.onsuccess = (Z) => {
          const rt = Z.target.result;
          i(rt), f = rt, E(rt);
        };
      };
    }), u);
  }
  function i(E) {
    E.onversionchange = () => {
      E.close(), f = null, u = null;
    };
  }
  function n() {
    return f ? Promise.resolve(f) : (u = null, t());
  }
  async function l(E) {
    if (!pt() || !E) return E;
    const L = { ...E }, k = L.id, M = await Ne(L);
    return !M || !M.encrypted ? E : {
      id: k,
      encrypted: !0,
      iv: M.iv,
      data: M.data
    };
  }
  async function m(E) {
    return !E || !E.encrypted || !pt() ? E : Fe(E);
  }
  const g = (E, L) => n().then((k) => k ? k.transaction(E, L).objectStore(E) : null);
  function r(E) {
    return new Promise((L, k) => {
      E.onsuccess = () => L(E.result), E.onerror = () => {
        d(E.error), k(E.error);
      };
    });
  }
  const s = (E) => g(E, "readonly").then((L) => L ? r(L.getAll()) : []).then((L) => pt() ? Promise.all(L.map((k) => m(k))) : L), o = (E, L) => g(E, "readonly").then((k) => k ? r(k.get(L)) : null).then((k) => k ? m(k) : null), _ = (E, L) => n().then((k) => {
    if (!k) return [];
    const O = k.transaction(E, "readonly").objectStore(E), F = L.map((B) => r(O.get(B)));
    return Promise.all(F).then((B) => pt() ? Promise.all(B.map((U) => m(U))) : B);
  }), v = (E, L) => (pt() ? l(L) : Promise.resolve(L)).then((M) => g(E, "readwrite").then((O) => O ? r(O.put(M)) : null)), A = (E, L) => g(E, "readwrite").then((k) => k ? r(k.delete(L)) : null), w = (E) => g(E, "readwrite").then((L) => L ? r(L.clear()) : null), C = (E) => g(E, "readonly").then((L) => L ? r(L.count()) : 0), T = (E) => g(b, "readonly").then((L) => L ? r(L.get(E)) : null), q = (E, L) => g(b, "readwrite").then((k) => {
    if (k)
      return L.key = E, r(k.put(L));
  });
  function x(E) {
    this.dom = E, this._name = E.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", E);
    const L = E.getAttribute("data-ln-data-store-stale"), k = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(k) ? 300 : k;
    const M = E.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = M.split(",").map((F) => F.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "" };
    const O = E.getAttribute("data-ln-data-store-window");
    if (O !== null) {
      const F = parseInt(O, 10) || 1e3, B = parseInt(E.getAttribute("data-ln-data-store-window-page"), 10) || 200, U = parseInt(E.getAttribute("data-ln-data-store-window-threshold"), 10) || 25;
      this._windowIndex = Ve({
        windowSize: F,
        pageSize: B,
        threshold: U,
        requestPage: (K, V, Z) => {
          S(this.dom, "ln-data-store:request-page", {
            store: this._name,
            offset: K,
            limit: V,
            query: Z,
            queryGen: this._windowIndex.queryGen
          });
        }
      });
    } else
      this._windowIndex = null;
    return this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), a[this._name] = this, I(this), this.ready = qt(this), this;
  }
  function I(E) {
    E._handlers = {
      create: (L) => D(E, "create", L.detail, () => N(E, L.detail)),
      update: (L) => D(E, "update", L.detail, () => z(E, L.detail)),
      delete: (L) => D(E, "delete", L.detail, () => Q(E, L.detail)),
      "bulk-delete": (L) => D(E, "bulk-delete", L.detail, () => ct(E, L.detail)),
      "sync-failed": (L) => {
        E.isSyncing = !1, S(E.dom, "ln-data-store:sync-error", {
          store: E._name,
          error: L.detail && L.detail.error,
          status: L.detail && L.detail.status
        });
      }
    };
    for (const [L, k] of Object.entries(E._handlers))
      E.dom.addEventListener(`ln-data-store:request-${L}`, k);
    E._queryHandlers = {
      "ln-search:change": (L) => {
        L.preventDefault();
        const k = L.detail && L.detail.term != null ? L.detail.term : "";
        k !== E.query.search && (E.query.search = k, J(E));
      },
      "ln-filter:changed": (L) => {
        const k = L.detail && L.detail.key;
        if (!k) return;
        const M = (L.detail.values || []).slice();
        M.length ? E.query.filters[k] = M : delete E.query.filters[k], J(E);
      }
    };
    for (const [L, k] of Object.entries(E._queryHandlers))
      E.dom.addEventListener(L, k);
  }
  function D(E, L, k, M) {
    const O = k && k.requestId;
    return E._mutationChain = E._mutationChain.then(() => E.ready).then(() => {
      if (E.initializationError) throw E.initializationError;
      return M();
    }).catch((F) => at(E, L, O, F)), E._mutationChain;
  }
  function R(E) {
    return C(E._name).then((L) => (E.totalCount = L, E.hasCache = !0, E.isLoaded = !0, q(E._name, {
      schema_version: p,
      last_synced_at: E.lastSyncedAt,
      has_cache: !0,
      record_count: L
    })));
  }
  function N(E, { tempId: L, data: k = {}, requestId: M } = {}) {
    const O = { ...k, id: L };
    return v(E._name, O).then(() => R(E)).then(() => {
      S(E.dom, "ln-data-store:created", { store: E._name, record: O, tempId: L, requestId: M });
    });
  }
  function z(E, { id: L, data: k = {}, requestId: M } = {}) {
    return o(E._name, L).then((O) => {
      if (!O) throw new Error(`Record not found: ${L}`);
      const F = { ...O, ...k }, B = k.id;
      return (B !== void 0 && B !== L ? $(E._name, L, F) : v(E._name, F)).then(() => R(E)).then(() => {
        S(E.dom, "ln-data-store:updated", { store: E._name, record: F, previous: O, requestId: M });
      });
    });
  }
  function Q(E, { id: L, requestId: k } = {}) {
    return o(E._name, L).then((M) => {
      if (!M) {
        S(E.dom, "ln-data-store:deleted", { store: E._name, id: L, requestId: k, missing: !0 });
        return;
      }
      return A(E._name, L).then(() => R(E)).then(() => {
        S(E.dom, "ln-data-store:deleted", { store: E._name, id: L, requestId: k });
      });
    });
  }
  function ct(E, { ids: L = [], requestId: k } = {}) {
    return L.length ? Promise.all(L.map((M) => o(E._name, M))).then((M) => {
      const O = M.filter(Boolean).map((F) => F.id);
      return j(E._name, O).then(() => R(E)).then(() => {
        S(E.dom, "ln-data-store:deleted", { store: E._name, ids: O, requestId: k });
      });
    }) : (S(E.dom, "ln-data-store:deleted", { store: E._name, ids: [], requestId: k }), Promise.resolve());
  }
  function at(E, L, k, M) {
    console.error("[ln-data-store] " + L + " failed:", M), S(E.dom, "ln-data-store:mutation-error", {
      store: E._name,
      action: L,
      requestId: k,
      error: M
    });
  }
  function qt(E) {
    return t().then((L) => {
      if (!L) throw new Error("IndexedDB is unavailable");
      return T(E._name);
    }).then((L) => {
      if (E.initializationError = null, L && L.schema_version === p)
        E.lastSyncedAt = L.last_synced_at || null, E.totalCount = L.record_count || 0, E.hasCache = L.has_cache === !0 || E.totalCount > 0, E.hasCache && (E.isLoaded = !0, S(E.dom, "ln-data-store:ready", { store: E._name, count: E.totalCount, source: "cache" })), E.isInitialized = !0, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: E.hasCache, lastSyncedAt: E.lastSyncedAt, count: E.totalCount });
      else {
        if (L && L.schema_version !== p)
          return w(E._name).then(() => q(E._name, { schema_version: p, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            E.isInitialized = !0, E.hasCache = !1, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        E.isInitialized = !0, E.hasCache = !1, S(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((L) => (E.isInitialized = !0, E.isLoaded = !1, E.hasCache = !1, E.isSyncing = !1, E.initializationError = L, S(E.dom, "ln-data-store:initialization-error", { store: E._name, error: L }), { ok: !1, error: L }));
  }
  function At(E) {
    E.isSyncing = !0, S(E.dom, "ln-data-store:request-remote-sync", { since: E.lastSyncedAt });
  }
  function P(E, L) {
    return n().then((k) => k ? (pt() ? Promise.all(L.map((O) => l(O))) : Promise.resolve(L)).then((O) => new Promise((F, B) => {
      const U = k.transaction(E, "readwrite"), K = U.objectStore(E);
      O.forEach((V) => K.put(V)), U.oncomplete = () => F(), U.onerror = () => {
        d(U.error), B(U.error);
      };
    })) : void 0);
  }
  function j(E, L) {
    return n().then((k) => {
      if (k)
        return new Promise((M, O) => {
          const F = k.transaction(E, "readwrite"), B = F.objectStore(E);
          L.forEach((U) => B.delete(U)), F.oncomplete = () => M(), F.onerror = () => O(F.error);
        });
    });
  }
  function $(E, L, k) {
    return (pt() ? l(k) : Promise.resolve(k)).then((O) => n().then((F) => {
      if (F)
        return new Promise((B, U) => {
          const K = F.transaction(E, "readwrite"), V = K.objectStore(E);
          V.put(O), V.delete(L), K.oncomplete = () => B(), K.onerror = () => {
            d(K.error), U(K.error);
          };
        });
    }));
  }
  const St = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function dt(E, L) {
    if (!L || !L.field) return E;
    const { field: k, direction: M } = L, O = M === "desc";
    return [...E].sort((F, B) => {
      const U = F[k], K = B[k];
      if (U == null && K == null) return 0;
      if (U == null) return O ? 1 : -1;
      if (K == null) return O ? -1 : 1;
      const V = typeof U == "string" && typeof K == "string" ? St.compare(U, K) : U < K ? -1 : U > K ? 1 : 0;
      return O ? -V : V;
    });
  }
  function et(E, L) {
    if (!L) return E;
    const k = Object.keys(L).filter((M) => Array.isArray(L[M]) && L[M].length > 0);
    return k.length ? E.filter(
      (M) => k.every((O) => L[O].map(String).includes(String(M[O])))
    ) : E;
  }
  function Ct(E, L, k) {
    if (!L || !k || !k.length) return E;
    const M = L.toLowerCase();
    return E.filter(
      (O) => k.some((F) => {
        const B = O[F];
        return B != null && String(B).toLowerCase().includes(M);
      })
    );
  }
  function ut(E, L, k) {
    if (!E.length) return 0;
    if (k === "count") return E.length;
    const M = E.map((F) => parseFloat(F[L])).filter((F) => !isNaN(F)), O = M.reduce((F, B) => F + B, 0);
    return k === "sum" ? O : k === "avg" && M.length ? O / M.length : 0;
  }
  function ht(E, L) {
    if (!E.presenters || !E.presenters.computed) return L;
    const k = E.presenters.computed;
    return L.map((M) => {
      if (!M) return null;
      const O = { ...M };
      for (const [F, B] of Object.entries(k))
        try {
          O[F] = B(M);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${F}`, U);
        }
      return O;
    });
  }
  x.prototype.getAll = function(E = {}) {
    const L = this;
    if (L._windowIndex) {
      const k = E.offset || 0, M = E.limit || 200;
      L._windowIndex.ensure(k, k + M, E);
      const O = [];
      for (let B = k; B < k + M; B++) {
        const U = L._windowIndex.getId(B);
        O.push(U);
      }
      const F = Array.from(new Set(O.filter((B) => B !== void 0)));
      return _(L._name, F).then((B) => {
        const U = /* @__PURE__ */ new Map();
        for (let V = 0; V < B.length; V++) {
          const Z = B[V];
          Z && U.set(String(Z.id), Z);
        }
        const K = [];
        for (let V = 0; V < O.length; V++) {
          const Z = O[V];
          if (Z === void 0)
            K.push(null);
          else {
            const rt = U.get(String(Z));
            K.push(rt || null);
          }
        }
        return {
          data: ht(L, K),
          total: L._windowIndex.grandTotal,
          filtered: L._windowIndex.logicalTotal,
          offset: k,
          queryGen: L._windowIndex.queryGen
        };
      });
    }
    return s(L._name).then((k) => {
      const M = k.length;
      E.filters && (k = et(k, E.filters)), E.search && (k = Ct(k, E.search, L._searchFields));
      const O = k.length;
      if (E.sort && (k = dt(k, E.sort)), E.offset || E.limit) {
        const F = E.offset || 0, B = E.limit || k.length;
        k = k.slice(F, F + B);
      }
      return {
        data: ht(L, k),
        total: M,
        filtered: O
      };
    });
  }, x.prototype.getById = function(E) {
    return o(this._name, E).then((L) => L ? ht(this, [L])[0] : null);
  }, x.prototype.count = function(E) {
    return E ? s(this._name).then((L) => et(L, E).length) : C(this._name);
  }, x.prototype.aggregate = function(E, L) {
    return s(this._name).then((k) => ut(k, E, L));
  }, x.prototype.setPresenters = function(E) {
    this.presenters = E;
  }, x.prototype.applySync = function(E, L, k, M) {
    M = M || {};
    const O = this;
    E.length > 0 || L.length > 0;
    let F = Promise.resolve();
    return E.length > 0 && (F = F.then(() => P(O._name, E))), L.length > 0 && (F = F.then(() => j(O._name, L))), F.then(() => {
      if (O._windowIndex && M.offset != null) {
        const B = E.map((U) => U.id);
        O._windowIndex.ingest(M.offset, B, M.total, M.filtered, M.queryGen);
      }
    }).then(() => C(O._name)).then((B) => (O.totalCount = M.total !== void 0 ? M.total : B, O.hasCache = !0, q(O._name, {
      schema_version: p,
      last_synced_at: k,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const B = !O.isLoaded;
      O.isLoaded = !0, O.isSyncing = !1, O.lastSyncedAt = k, B ? (S(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: M }), S(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: M })) : S(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: E.length,
        deleted: L.length,
        changed: !0,
        meta: M
      });
    }).catch((B) => {
      O.isSyncing = !1, console.error("[ln-data-store] applySync failed:", B);
    });
  }, x.prototype.forceSync = function() {
    At(this);
  }, x.prototype.fullReload = function() {
    const E = this;
    return w(E._name).then(() => q(E._name, {
      schema_version: p,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      E.isLoaded = !1, E.hasCache = !1, E.lastSyncedAt = null, E.totalCount = 0, At(E);
    });
  }, x.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null), this._handlers) {
      for (const [E, L] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${E}`, L);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [E, L] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(E, L);
      this._queryHandlers = null;
    }
    delete a[this._name], delete this.dom[c], S(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function xt() {
    return n().then((E) => {
      if (!E) return;
      const L = Array.from(E.objectStoreNames);
      return new Promise((k, M) => {
        const O = E.transaction(L, "readwrite");
        L.forEach((F) => O.objectStore(F).clear()), O.oncomplete = () => k(), O.onerror = () => M(O.error);
      });
    }).then(() => {
      Object.values(a).forEach((E) => {
        E.isLoaded = !1, E.isInitialized = !1, E.initializationError = null, E.hasCache = !1, E.isSyncing = !1, E.lastSyncedAt = null, E.totalCount = 0;
      });
    });
  }
  function J(E) {
    E._windowIndex && E._windowIndex.reset(), S(E.dom, "ln-data-store:query-changed", {
      store: E._name,
      query: { filters: Object.assign({}, E.query.filters), search: E.query.search }
    });
  }
  H(h, c, x, "ln-data-store"), window[c].clearAll = xt, window[c].init = window[c], window[c].setStorageKey = Zt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Zt);
})();
(function() {
  const h = "data-ln-api-connector", c = "lnApiConnector", y = "lnConnector";
  if (window[c] !== void 0) return;
  function b(a) {
    return a.ok ? a.status === 204 ? null : a.json() : a.json().catch(() => null).then((d) => {
      const e = new Error("HTTP " + a.status + ": " + a.statusText);
      throw e.status = a.status, e.data = d, e;
    });
  }
  function p(a) {
    return this.dom = a, a[c] = this, a[y] = this, this.refreshConfig(), this._handlers = null, f(this), this;
  }
  p.prototype.refreshConfig = function() {
    const a = this.dom;
    this.baseUrl = a.getAttribute("data-ln-api-base-url") || "", this.path = a.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: a.getAttribute("data-ln-api-param-offset") || "offset",
      limit: a.getAttribute("data-ln-api-param-limit") || "limit",
      search: a.getAttribute("data-ln-api-param-search") || "search",
      sortField: a.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: a.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const d = a.getAttribute("data-ln-api-headers") || "";
    this.headers = ue(d, "ln-api-connector"), (d.toLowerCase().includes("authorization") || d.toLowerCase().includes("bearer") || d.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(a, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, p.prototype._reqHeaders = function(a) {
    const d = Object.assign({}, Et(this.headers), { "X-LN-Response": "data" });
    return a && (d["Idempotency-Key"] = a), d;
  }, p.prototype.fetchDelta = function(a) {
    const d = this;
    let e = X(d.baseUrl, d.path);
    return a != null && a !== "" && (e += (e.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(a)), window.fetch(e, { method: "GET", headers: d._reqHeaders(), credentials: d.credentials }).then(b);
  }, p.prototype.query = function(a) {
    const d = this;
    a = a || {};
    let e = X(d.baseUrl, d.path);
    const t = d.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, i = new URLSearchParams();
    a.search && i.append(t.search, a.search), a.offset != null && i.append(t.offset, a.offset), a.limit != null && i.append(t.limit, a.limit), a.sort && a.sort.field && a.sort.direction && (i.append(t.sortField, a.sort.field), i.append(t.sortDir, a.sort.direction)), a.filters && typeof a.filters == "object" && Object.keys(a.filters).forEach((l) => {
      const m = a.filters[l];
      Array.isArray(m) && m.length > 0 && i.append(l, m.join(","));
    });
    const n = i.toString();
    return n && (e += (e.indexOf("?") !== -1 ? "&" : "?") + n), window.fetch(e, { method: "GET", headers: d._reqHeaders(), credentials: d.credentials }).then(b);
  }, p.prototype.create = function(a, d, e) {
    const t = this;
    return window.fetch(X(t.baseUrl, d || t.path), {
      method: "POST",
      headers: t._reqHeaders(e),
      credentials: t.credentials,
      body: JSON.stringify(a)
    }).then(b);
  }, p.prototype.update = function(a, d, e, t, i) {
    const n = this;
    e != null && (d = Object.assign({}, d, { expected_version: e }));
    const l = t ? X(n.baseUrl, t) : X(n.baseUrl, n.path, a);
    return window.fetch(l, {
      method: "PUT",
      headers: n._reqHeaders(i),
      credentials: n.credentials,
      body: JSON.stringify(d)
    }).then(b);
  }, p.prototype.delete = function(a, d, e) {
    const t = this;
    return window.fetch(X(t.baseUrl, d || t.path, a), {
      method: "DELETE",
      headers: t._reqHeaders(e),
      credentials: t.credentials
    }).then(b);
  }, p.prototype.bulkDelete = function(a, d, e) {
    const t = this;
    return window.fetch(X(t.baseUrl, d || t.path) + "/bulk-delete", {
      method: "DELETE",
      headers: t._reqHeaders(e),
      credentials: t.credentials,
      body: JSON.stringify({ ids: a })
    }).then(b);
  };
  function f(a) {
    a._handlers = {
      sync: function(e) {
        const t = e.detail || {};
        a.fetchDelta(t.since).then(function(i) {
          S(a.dom, "ln-api-connector:fetched", { data: i, since: t.since, meta: t.meta || null });
        }).catch(function(i) {
          S(a.dom, "ln-api-connector:error", {
            action: "sync",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            since: t.since,
            meta: t.meta || null
          });
        });
      },
      query: function(e) {
        const t = e.detail || {}, i = t.query || t;
        a.query(i).then(function(n) {
          const l = n || {};
          S(a.dom, "ln-api-connector:fetched", {
            data: l.data || (Array.isArray(l) ? l : []),
            total: l.total,
            filtered: l.filtered,
            offset: i.offset,
            queryGen: i.queryGen,
            meta: t.meta || null
          });
        }).catch(function(n) {
          S(a.dom, "ln-api-connector:error", {
            action: "query",
            error: n.message,
            status: n.status || 0,
            data: n.data || null,
            meta: t.meta || null
          });
        });
      },
      create: function(e) {
        const t = e.detail || {};
        a.create(t.data, t.url, t.idempotencyKey).then(function(i) {
          const n = i && i.content !== void 0 ? i.content : i, l = i && i.message ? i.message : null;
          S(a.dom, "ln-api-connector:created", { record: n, tempId: t.tempId, message: l, meta: t.meta || null });
        }).catch(function(i) {
          S(a.dom, "ln-api-connector:error", {
            action: "create",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            tempId: t.tempId,
            meta: t.meta || null
          });
        });
      },
      update: function(e) {
        const t = e.detail || {};
        a.update(t.id, t.data, t.expected_version, t.url, t.idempotencyKey).then(function(i) {
          const n = i && i.content !== void 0 ? i.content : i, l = i && i.message ? i.message : null;
          S(a.dom, "ln-api-connector:updated", { record: n, id: t.id, message: l, meta: t.meta || null });
        }).catch(function(i) {
          S(a.dom, "ln-api-connector:error", {
            action: "update",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            id: t.id,
            conflictData: i.status === 409 ? i.data : null,
            meta: t.meta || null
          });
        });
      },
      delete: function(e) {
        const t = e.detail || {};
        a.delete(t.id, t.url, t.idempotencyKey).then(function(i) {
          const n = i && i.message ? i.message : null;
          S(a.dom, "ln-api-connector:deleted", { response: i, id: t.id, message: n, meta: t.meta || null });
        }).catch(function(i) {
          S(a.dom, "ln-api-connector:error", {
            action: "delete",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            id: t.id,
            meta: t.meta || null
          });
        });
      },
      bulkDelete: function(e) {
        const t = e.detail || {};
        a.bulkDelete(t.ids, t.url, t.idempotencyKey).then(function(i) {
          const n = i && i.message ? i.message : null;
          S(a.dom, "ln-api-connector:bulk-deleted", { response: i, ids: t.ids, message: n, meta: t.meta || null });
        }).catch(function(i) {
          S(a.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: i.message,
            status: i.status || 0,
            data: i.data || null,
            ids: t.ids,
            meta: t.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      a.dom.addEventListener(e + ":request-sync", a._handlers.sync), a.dom.addEventListener(e + ":request-query", a._handlers.query), a.dom.addEventListener(e + ":request-fetch", a._handlers.query), a.dom.addEventListener(e + ":request-create", a._handlers.create), a.dom.addEventListener(e + ":request-update", a._handlers.update), a.dom.addEventListener(e + ":request-delete", a._handlers.delete), a.dom.addEventListener(e + ":request-bulk-delete", a._handlers.bulkDelete);
    });
  }
  p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const a = this;
    a._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      a.dom.removeEventListener(e + ":request-sync", a._handlers.sync), a.dom.removeEventListener(e + ":request-query", a._handlers.query), a.dom.removeEventListener(e + ":request-fetch", a._handlers.query), a.dom.removeEventListener(e + ":request-create", a._handlers.create), a.dom.removeEventListener(e + ":request-update", a._handlers.update), a.dom.removeEventListener(e + ":request-delete", a._handlers.delete), a.dom.removeEventListener(e + ":request-bulk-delete", a._handlers.bulkDelete);
    }), a._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[c], delete this.dom[y];
  };
  function u(a) {
    const d = a[c];
    d && d.refreshConfig();
  }
  H(h, c, p, "ln-api-connector", {
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
    onAttributeChange: u
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", c = "lnCouchDbConnector", y = "lnConnector";
  if (window[c] !== void 0) return;
  function b(n) {
    const l = n && n.content !== void 0 ? n.content : n, m = n && n.message ? n.message : null;
    return { content: l, message: m };
  }
  function p(n) {
    return this.dom = n, n[c] = this, n[y] = this, this.refreshConfig(), this._handlers = null, t(this), this;
  }
  p.prototype.refreshConfig = function() {
    const n = this.dom;
    this.url = n.getAttribute("data-ln-couchdb-url") || "", this.db = n.getAttribute("data-ln-couchdb-db") || "", this.auth = n.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const l = n.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = ue(l, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), l.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(n, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function f(n, l, m) {
    const g = Object.assign({}, Et(n.headers, n.auth), m || {});
    return l && (g["Idempotency-Key"] = l), g;
  }
  p.prototype.fetchDelta = function(n) {
    const l = this, m = ["include_docs=true", "feed=normal"];
    n && m.push("since=" + encodeURIComponent(n));
    const g = X(l.url, l.db, "_changes") + "?" + m.join("&");
    return window.fetch(g, { method: "GET", headers: Et(l.headers, l.auth), credentials: l.credentials }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const s = r.results || [];
      return {
        data: s.filter((o) => !o.deleted && o.doc).map((o) => Object.assign({}, o.doc, { id: o.doc._id })),
        deleted: s.filter((o) => o.deleted).map((o) => o.id),
        synced_at: r.last_seq || n || ""
      };
    });
  };
  function u(n, l, m) {
    const g = Object.assign({ _id: l.id }, l);
    return g._id || delete g._id, window.fetch(X(n.url, n.db), {
      method: "POST",
      headers: f(n, m),
      credentials: n.credentials,
      body: JSON.stringify(g)
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const s = b(r), o = s.content;
      return { record: Object.assign({}, g, { id: o.id, _id: o.id, _rev: o.rev }), message: s.message };
    });
  }
  p.prototype.create = function(n, l) {
    return u(this, n, l).then((m) => m.record);
  };
  function a(n, l, m, g) {
    const r = Object.assign({ id: String(l), _id: String(l) }, m), s = r._rev || r.rev;
    return (s ? Promise.resolve(s) : window.fetch(X(n.url, n.db, null, l), { method: "GET", headers: Et(n.headers, n.auth), credentials: n.credentials }).then((_) => {
      if (!_.ok) throw new Error("Could not retrieve document for revision mapping");
      return _.json().then((v) => v._rev);
    })).then((_) => {
      const v = Object.assign({}, r, { _rev: _ });
      delete v.rev;
      const A = f(n, g, { "If-Match": _ });
      return window.fetch(X(n.url, n.db, null, l), {
        method: "PUT",
        headers: A,
        credentials: n.credentials,
        body: JSON.stringify(v)
      }).then((w) => {
        if (w.ok) return w.json().then((C) => {
          const T = b(C);
          return { record: Object.assign({}, v, { _rev: T.content.rev }), message: T.message };
        });
        if (w.status === 409) return w.json().then((C) => {
          const T = new Error("Conflict");
          throw T.status = 409, T.data = C, T;
        });
        throw new Error("HTTP " + w.status + ": " + w.statusText);
      });
    });
  }
  p.prototype.update = function(n, l, m) {
    return a(this, n, l, m).then((g) => g.record);
  };
  function d(n, l, m, g) {
    return (m ? Promise.resolve(m) : window.fetch(X(n.url, n.db, null, l), { method: "GET", headers: Et(n.headers, n.auth), credentials: n.credentials }).then((s) => {
      if (!s.ok) throw new Error("Could not retrieve document for revision delete");
      return s.json().then((o) => o._rev);
    })).then((s) => {
      const o = X(n.url, n.db, null, l) + "?rev=" + encodeURIComponent(s);
      return window.fetch(o, { method: "DELETE", headers: f(n, g), credentials: n.credentials }).then((_) => {
        if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
        return _.json();
      }).then((_) => {
        const v = b(_);
        return { response: v.content, message: v.message };
      });
    });
  }
  p.prototype.delete = function(n, l, m) {
    return d(this, n, l, m).then((g) => g.response);
  };
  function e(n, l, m) {
    return !l || l.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(X(n.url, n.db, "_all_docs"), {
      method: "POST",
      headers: Et(n.headers, n.auth),
      credentials: n.credentials,
      body: JSON.stringify({ keys: l })
    }).then((g) => {
      if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
      return g.json();
    }).then((g) => {
      const s = (g.rows || []).filter((o) => !o.error && o.value && o.value.rev).map((o) => ({ _id: o.id, _rev: o.value.rev, _deleted: !0 }));
      return s.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(X(n.url, n.db, "_bulk_docs"), {
        method: "POST",
        headers: f(n, m),
        credentials: n.credentials,
        body: JSON.stringify({ docs: s })
      }).then((o) => {
        if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
        return o.json();
      }).then((o) => {
        const _ = b(o);
        return { response: { ok: !0, results: _.content, deletedCount: s.length }, message: _.message };
      });
    });
  }
  p.prototype.bulkDelete = function(n, l) {
    return e(this, n, l).then((m) => m.response);
  };
  function t(n) {
    n._handlers = {
      sync: function(m) {
        const g = m.detail || {};
        n.fetchDelta(g.since).then(function(r) {
          S(n.dom, "ln-couchdb-connector:fetched", { data: r, since: g.since, meta: g.meta || null });
        }).catch(function(r) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: r.message,
            status: r.status || 0,
            since: g.since,
            meta: g.meta || null
          });
        });
      },
      create: function(m) {
        const g = m.detail || {};
        u(n, g.data, g.idempotencyKey).then(function(r) {
          S(n.dom, "ln-couchdb-connector:created", { record: r.record, tempId: g.tempId, message: r.message, meta: g.meta || null });
        }).catch(function(r) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: r.message,
            status: r.status || 0,
            tempId: g.tempId,
            meta: g.meta || null
          });
        });
      },
      update: function(m) {
        const g = m.detail || {}, r = Object.assign({}, g.data);
        g.expected_version !== void 0 && (r._rev = g.expected_version), a(n, g.id, r, g.idempotencyKey).then(function(s) {
          S(n.dom, "ln-couchdb-connector:updated", { record: s.record, id: g.id, message: s.message, meta: g.meta || null });
        }).catch(function(s) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: s.message,
            status: s.status || 0,
            id: g.id,
            data: s.status === 409 ? s.data : null,
            conflictData: s.status === 409 ? s.data : null,
            meta: g.meta || null
          });
        });
      },
      delete: function(m) {
        const g = m.detail || {};
        d(n, g.id, g.rev, g.idempotencyKey).then(function(r) {
          S(n.dom, "ln-couchdb-connector:deleted", { response: r.response, id: g.id, message: r.message, meta: g.meta || null });
        }).catch(function(r) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: r.message,
            status: r.status || 0,
            id: g.id,
            meta: g.meta || null
          });
        });
      },
      bulkDelete: function(m) {
        const g = m.detail || {};
        e(n, g.ids, g.idempotencyKey).then(function(r) {
          S(n.dom, "ln-couchdb-connector:bulk-deleted", { response: r.response, ids: g.ids, message: r.message, meta: g.meta || null });
        }).catch(function(r) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: r.message,
            status: r.status || 0,
            ids: g.ids,
            meta: g.meta || null
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(m) {
      n.dom.addEventListener(m + ":request-sync", n._handlers.sync), n.dom.addEventListener(m + ":request-fetch", n._handlers.sync), n.dom.addEventListener(m + ":request-create", n._handlers.create), n.dom.addEventListener(m + ":request-update", n._handlers.update), n.dom.addEventListener(m + ":request-delete", n._handlers.delete), n.dom.addEventListener(m + ":request-bulk-delete", n._handlers.bulkDelete);
    });
  }
  p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const n = this;
    n._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(m) {
      n.dom.removeEventListener(m + ":request-sync", n._handlers.sync), n.dom.removeEventListener(m + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(m + ":request-create", n._handlers.create), n.dom.removeEventListener(m + ":request-update", n._handlers.update), n.dom.removeEventListener(m + ":request-delete", n._handlers.delete), n.dom.removeEventListener(m + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[c], delete this.dom[y];
  };
  function i(n) {
    const l = n[c];
    l && l.refreshConfig();
  }
  H(h, c, p, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: i
  });
})();
function Ge(h) {
  return h = h || {}, {
    sort: h.sort,
    filters: h.filters,
    search: h.search,
    offset: h.offset,
    limit: h.limit,
    queryGen: h.queryGen
  };
}
function Ht(h, c) {
  const y = !h || !!h.initializationError;
  return c && (y || !h.isLoaded) ? "remote" : h && !h.initializationError ? "store" : "none";
}
function ie(h, c) {
  const y = Object.assign({}, h);
  return c && (y.filters = c.filters, y.search = c.search), y;
}
class We {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(c) {
    return c ? this._pending.has(c) ? Promise.reject(new Error(`Duplicate mutation requestId: ${c}`)) : new Promise((y, b) => {
      this._pending.set(c, { resolve: y, reject: b });
    }) : Promise.reject(new Error("Mutation requestId is required"));
  }
  resolve(c) {
    return this._settle(c, !1);
  }
  reject(c) {
    return this._settle(c, !0);
  }
  close(c) {
    const y = c || new Error("Mutation receipt registry closed");
    for (const b of this._pending.values()) b.reject(y);
    this._pending.clear();
  }
  _settle(c, y) {
    const b = c && c.requestId;
    if (!b) return !1;
    const p = this._pending.get(b);
    return p ? (this._pending.delete(b), y ? p.reject(c.error || new Error("Store mutation failed")) : p.resolve(c), !0) : !1;
  }
}
(function() {
  const h = "data-ln-data-coordinator", c = "lnDataCoordinator", y = "lnCoordinator", b = "data-ln-form-scope";
  if (window[c] !== void 0) return;
  const p = /* @__PURE__ */ new Set();
  let f = !1, u = null, a = null, d = null;
  function e() {
    f || (f = !0, u = function() {
      S(document, "ln-data-store:online", {}), p.forEach(function(r) {
        r._maybeSync();
      });
    }, a = function() {
      S(document, "ln-data-store:offline", {});
    }, d = function() {
      document.visibilityState === "visible" && p.forEach(function(r) {
        const s = r.findChildren(), o = s.store;
        o && s.connector && o.isInitialized && !o.initializationError && !o.isSyncing && !r._noAutosync && (!o.hasCache || r._isStale()) && o.forceSync();
      });
    }, window.addEventListener("online", u), window.addEventListener("offline", a), document.addEventListener("visibilitychange", d));
  }
  function t() {
    f && (p.size > 0 || (window.removeEventListener("online", u), window.removeEventListener("offline", a), document.removeEventListener("visibilitychange", d), u = null, a = null, d = null, f = !1));
  }
  function i() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (s) => {
        const o = Math.random() * 16 | 0;
        return (s === "x" ? o : o & 3 | 8).toString(16);
      });
    }
  }
  const n = ["ln-api-connector", "ln-couchdb-connector"];
  function l(r) {
    return this.dom = r, this._name = r.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", r), r[c] = this, r[y] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new We(), this._dict = Gt(r, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), m(this), p.add(this), e(), this._checkInitialSync(), this;
  }
  l.prototype._parseStaleAttributes = function() {
    const s = this.findChildren().storeEl, o = this.dom.getAttribute("data-ln-data-coordinator-stale") || (s ? s.getAttribute("data-ln-data-store-stale") : null), _ = parseInt(o, 10);
    this._staleThreshold = o === "never" || o === "-1" ? -1 : isNaN(_) ? 300 : _;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (s ? s.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, l.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const s = this.findChildren().store;
    return !s || !s.lastSyncedAt ? !0 : Date.now() / 1e3 - s.lastSyncedAt > this._staleThreshold;
  }, l.prototype._maybeSync = function() {
    const r = this.findChildren(), s = r.store;
    !s || s.initializationError || !r.connector || this._noAutosync || !s.isInitialized || s.isSyncing || (!s.hasCache || this._isStale()) && s.forceSync();
  }, l.prototype._checkInitialSync = function() {
    const r = this, o = this.findChildren().store;
    o && Promise.resolve(o.ready).then(function() {
      const _ = r.findChildren(), v = _.store;
      if (v && v.initializationError) {
        r._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !_.connector || r._noAutosync || v.isSyncing || (!v.hasCache || r._isStale()) && v.forceSync();
    }).catch(function(_) {
      r._reportReconciliationError("store-initialize", _, null);
    });
  }, l.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const s = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    s && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(s)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(o) {
      return o;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(o) {
      return o;
    });
  }, l.prototype.findChildren = function() {
    const r = this.dom.querySelector("[data-ln-data-store]"), s = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), o = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: r,
      connectorEl: s,
      queueEl: o,
      store: r ? r.lnDataStore || r.lnStore : null,
      connector: s ? s.lnConnector || s.lnApiConnector || s.lnCouchDbConnector : null,
      queue: o ? o.lnApiQueue : null
    };
  }, l.prototype._handleSubmitRecord = function(r) {
    const s = this.findChildren();
    if (!s.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const o = r.data || {}, _ = o.id, v = o.expected_version, A = Object.assign({}, o);
    delete A.id, delete A.expected_version;
    const w = r.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(s, A, r.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(s, _, A, v, r.action);
  }, l.prototype._fanOutCreate = function(r, s, o) {
    this.refreshMapper();
    const _ = "_temp_" + i();
    S(r.storeEl, "ln-data-store:request-create", { tempId: _, data: s }), r.queue ? S(r.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: _,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(s),
      expectedVersion: null,
      meta: { tempId: _, action: o }
    }) : r.connector && S(r.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(s),
      url: o,
      meta: { entryId: i(), queued: !1, op: "create", tempId: _ }
    });
  }, l.prototype._fanOutUpdate = function(r, s, o, _, v) {
    this.refreshMapper(), S(r.storeEl, "ln-data-store:request-update", { id: s, data: o }), r.queue ? S(r.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: s,
      op: "update",
      targetId: s,
      payload: this.mapper.egress(o),
      expectedVersion: _,
      meta: { id: s, action: v }
    }) : r.connector && S(r.connectorEl, "ln-api-connector:request-update", {
      id: s,
      data: this.mapper.egress(o),
      expected_version: _,
      url: v,
      meta: { entryId: i(), queued: !1, op: "update", id: s }
    });
  }, l.prototype._fanOutDelete = function(r, s) {
    this.refreshMapper(), S(r.storeEl, "ln-data-store:request-delete", { id: s }), r.queue ? S(r.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: s,
      op: "delete",
      targetId: s,
      payload: null,
      expectedVersion: null,
      meta: { id: s }
    }) : r.connector && S(r.connectorEl, "ln-api-connector:request-delete", {
      id: s,
      meta: { entryId: i(), queued: !1, op: "delete", id: s }
    });
  }, l.prototype._fanOutBulkDelete = function(r, s) {
    this.refreshMapper();
    const o = s.join(",");
    S(r.storeEl, "ln-data-store:request-bulk-delete", { ids: s }), r.queue ? S(r.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: o,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: s },
      expectedVersion: null,
      meta: { bulkKey: o, ids: s }
    }) : r.connector && S(r.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: s,
      meta: { entryId: i(), queued: !1, op: "bulk-delete", bulkKey: o }
    });
  }, l.prototype._toastFromMessage = function(r) {
    r && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: r.type || "success",
        title: r.title || "",
        message: r.body || ""
      }
    }));
  }, l.prototype._toastFromDict = function(r) {
    const s = this._dict[r];
    s && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: s }
    }));
  }, l.prototype._requestStoreMutation = function(r, s, o) {
    const _ = r.storeEl;
    if (!_) return Promise.reject(new Error("Store element not found"));
    const v = i(), A = this._mutationReceipts.wait(v);
    try {
      S(_, "ln-data-store:request-" + s, Object.assign({}, o, { requestId: v }));
    } catch (w) {
      this._mutationReceipts.reject({ requestId: v, error: w });
    }
    return A;
  }, l.prototype._reportReconciliationError = function(r, s, o) {
    S(this.dom, "ln-data-coordinator:error", {
      operation: r,
      error: s,
      meta: o || null
    });
  };
  function m(r) {
    r._handlers = {
      sync: function(s) {
        r.refreshMapper();
        const o = r.findChildren();
        if (!o.store || !o.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        S(o.connectorEl, "ln-api-connector:request-sync", { since: s.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(s) {
        const o = r.findChildren();
        if (!o.connectorEl) return;
        const _ = s.detail || {};
        S(o.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, _.query, {
            offset: _.offset,
            limit: _.limit,
            queryGen: _.queryGen
          })
        });
      },
      reqCreate: function(s) {
        const o = r.findChildren();
        o.storeEl && r._fanOutCreate(o, s.detail.data || {}, s.detail.action);
      },
      reqUpdate: function(s) {
        const o = r.findChildren();
        o.storeEl && r._fanOutUpdate(o, s.detail.id, s.detail.data || {}, s.detail.expected_version, s.detail.action);
      },
      reqDelete: function(s) {
        const o = r.findChildren();
        o.storeEl && r._fanOutDelete(o, s.detail.id);
      },
      reqBulkDelete: function(s) {
        const o = r.findChildren();
        o.storeEl && r._fanOutBulkDelete(o, s.detail.ids || []);
      },
      queueFailed: function() {
        r._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(s) {
        r.refreshMapper();
        const o = r.findChildren();
        if (!o.store || !o.connector || !o.queue) return;
        const _ = s.detail || {}, v = _.entryId, A = _.op, w = _.targetId, C = _.payload, T = _.expectedVersion, q = _.meta || {}, x = q.action || null, I = _.idempotencyKey || v;
        A === "create" ? S(o.connectorEl, "ln-api-connector:request-create", {
          data: C,
          url: x,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "create", tempId: q.tempId }
        }) : A === "update" ? S(o.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: C,
          expected_version: T,
          url: x,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "update", id: w }
        }) : A === "delete" ? S(o.connectorEl, "ln-api-connector:request-delete", {
          id: w,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "delete", id: w }
        }) : A === "bulk-delete" ? S(o.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: C && C.ids ? C.ids : [],
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", A);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(s) {
        const o = s.target;
        if (s.defaultPrevented) return;
        const _ = o.hasAttribute(b) ? o.getAttribute(b) : null;
        if (_ === null) return;
        let v;
        if (_ ? v = _ === r._name : v = o.closest("[data-ln-data-coordinator]") === r.dom, !v) return;
        const A = xe(o);
        if (A !== "POST" && A !== "PUT" && A !== "PATCH") return;
        s.preventDefault();
        const w = ae(o);
        delete w._method, delete w._token, r._handleSubmitRecord({ data: w, method: A, action: o.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(s) {
        const o = s.detail.meta || {}, _ = r.findChildren();
        r.refreshMapper();
        const v = s.detail.data;
        let A = [], w = [], C = null;
        Array.isArray(v) ? (A = v, C = Math.floor(Date.now() / 1e3)) : v && (A = Array.isArray(v.data) ? v.data : [], w = Array.isArray(v.deleted) ? v.deleted : [], C = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const T = A.map((q) => r.mapper.ingress(q));
        if (_.store && !_.store.initializationError)
          _.store.applySync(T, w, C || Math.floor(Date.now() / 1e3), {
            total: s.detail.total,
            filtered: s.detail.filtered,
            offset: s.detail.offset,
            queryGen: s.detail.queryGen,
            targetEl: o.targetEl,
            kind: o.kind
          });
        else if (o.targetEl && o.kind) {
          if (o.kind === "table" || o.kind === "list" || o.kind === "chart")
            S(o.targetEl, "ln-" + o.kind + ":set-loading", { loading: !1 }), S(o.targetEl, "ln-" + o.kind + ":set-data", {
              data: T,
              total: s.detail.total !== void 0 ? s.detail.total : T.length,
              filtered: s.detail.filtered !== void 0 ? s.detail.filtered : T.length,
              offset: s.detail.offset,
              queryGen: s.detail.queryGen
            }), r._boundDelivered.set(o.targetEl, !0);
          else if (o.kind === "options")
            S(o.targetEl, "ln-options:set-data", { data: T });
          else if (o.kind === "stat") {
            const q = s.detail.filtered !== void 0 ? s.detail.filtered : s.detail.total !== void 0 ? s.detail.total : T.length;
            S(o.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(s) {
        const o = r.findChildren();
        if (!o.storeEl) return;
        const _ = s.detail.meta || {}, v = r.mapper.ingress(s.detail.record);
        r._requestStoreMutation(o, "update", { id: _.tempId, data: v }).then(function() {
          r._toastFromMessage(s.detail.message), _.queued && o.queue && S(o.queueEl, "ln-api-queue:resolve-create", {
            entryId: _.entryId,
            oldKey: _.tempId,
            newId: v.id
          });
        }).catch(function(A) {
          r._reportReconciliationError("create-reconcile", A, _);
        });
      },
      connUpdated: function(s) {
        const o = r.findChildren();
        if (!o.storeEl) return;
        const _ = s.detail.meta || {}, v = r.mapper.ingress(s.detail.record);
        r._requestStoreMutation(o, "update", { id: _.id, data: v }).then(function() {
          r._toastFromMessage(s.detail.message), _.queued && o.queue && S(o.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
        }).catch(function(A) {
          r._reportReconciliationError("update-reconcile", A, _);
        });
      },
      connDeleted: function(s) {
        const o = r.findChildren();
        if (!o.storeEl) return;
        const _ = s.detail.meta || {};
        r._toastFromMessage(s.detail.message), _.queued && o.queue && S(o.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      },
      connBulkDeleted: function(s) {
        const o = r.findChildren();
        if (!o.storeEl) return;
        const _ = s.detail.meta || {};
        r._toastFromMessage(s.detail.message), _.queued && o.queue && S(o.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      },
      connError: function(s) {
        const o = s.detail || {}, _ = o.meta || {}, v = _.op || o.action, A = o.status || 0, w = r.findChildren();
        if (v === "sync") {
          w.storeEl && S(w.storeEl, "ln-data-store:request-sync-failed", {
            error: o.error,
            status: A
          }), console.error("[ln-data-coordinator] Sync failed:", o.error);
          return;
        }
        if (v === "query") {
          _.targetEl && _.kind && S(_.targetEl, "ln-" + _.kind + ":set-loading", { loading: !1 }), r._reportReconciliationError("query", o.error || o, _);
          return;
        }
        if (!w.storeEl) return;
        const C = A === 401 || A === 419, T = A === 0 || A >= 500, q = A === 409;
        if (C) {
          r._toastFromDict("auth"), _.queued && w.queue && S(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "auth" });
          return;
        }
        if (T) {
          _.queued && w.queue ? S(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "retry" }) : r._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (q && v === "update") {
          const I = o.data && o.data.remote ? r.mapper.ingress(o.data.remote) : null;
          I && (x = r._requestStoreMutation(w, "update", { id: _.id, data: I })), r._toastFromDict("conflict");
        } else v === "create" && (x = r._requestStoreMutation(w, "delete", { id: _.tempId })), r._toastFromDict("rejected");
        _.queued && w.queue ? x.then(function() {
          S(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "drop" });
        }).catch(function(I) {
          r._reportReconciliationError("deterministic-reconcile", I, _);
        }) : x.catch(function(I) {
          r._reportReconciliationError("deterministic-reconcile", I, _);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(s) {
        const o = r.findChildren(), _ = o.store;
        if (!_ || _.initializationError || !o.connector || r._noAutosync || _.isSyncing) return;
        (s.detail || {}).hasCache ? r._isStale() && _.forceSync() : _.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(s) {
        r._serveData(s, "table");
      },
      reqListData: function(s) {
        r._serveData(s, "list");
      },
      reqChartData: function(s) {
        r._serveData(s, "chart");
      },
      reqOptions: function(s) {
        r._serveOptions(s);
      },
      reqStat: function(s) {
        r._serveStat(s);
      },
      refreshQuery: function() {
        r._refreshAll();
      },
      refresh: function(s) {
        r._mutationReceipts.resolve(s.detail), r._refreshAll();
      },
      mutationError: function(s) {
        r._mutationReceipts.reject(s.detail);
      },
      refreshSynced: function(s) {
        s.detail && s.detail.changed && r._refreshAll(s.detail.meta);
      }
    }, r.dom.addEventListener("ln-data-store:request-remote-sync", r._handlers.sync), r.dom.addEventListener("ln-data-store:request-page", r._handlers.requestPage), r.dom.addEventListener("ln-data-coordinator:request-create", r._handlers.reqCreate), r.dom.addEventListener("ln-data-coordinator:request-update", r._handlers.reqUpdate), r.dom.addEventListener("ln-data-coordinator:request-delete", r._handlers.reqDelete), r.dom.addEventListener("ln-data-coordinator:request-bulk-delete", r._handlers.reqBulkDelete), r.dom.addEventListener("ln-api-queue:send", r._handlers.queueSend), r.dom.addEventListener("ln-api-queue:failed", r._handlers.queueFailed), r.dom.addEventListener("ln-data-store:initialized", r._handlers.storeInitialized), document.addEventListener("submit", r._handlers.formSubmit), n.forEach(function(s) {
      r.dom.addEventListener(s + ":fetched", r._handlers.connFetched), r.dom.addEventListener(s + ":created", r._handlers.connCreated), r.dom.addEventListener(s + ":updated", r._handlers.connUpdated), r.dom.addEventListener(s + ":deleted", r._handlers.connDeleted), r.dom.addEventListener(s + ":bulk-deleted", r._handlers.connBulkDeleted), r.dom.addEventListener(s + ":error", r._handlers.connError);
    }), document.addEventListener("ln-table:request-data", r._handlers.reqTableData), document.addEventListener("ln-list:request-data", r._handlers.reqListData), document.addEventListener("ln-chart:request-data", r._handlers.reqChartData), document.addEventListener("ln-options:request-data", r._handlers.reqOptions), document.addEventListener("ln-stat:request-count", r._handlers.reqStat), r.dom.addEventListener("ln-data-store:ready", r._handlers.refresh), r.dom.addEventListener("ln-data-store:loaded", r._handlers.refresh), r.dom.addEventListener("ln-data-store:created", r._handlers.refresh), r.dom.addEventListener("ln-data-store:updated", r._handlers.refresh), r.dom.addEventListener("ln-data-store:deleted", r._handlers.refresh), r.dom.addEventListener("ln-data-store:mutation-error", r._handlers.mutationError), r.dom.addEventListener("ln-data-store:synced", r._handlers.refreshSynced), r.dom.addEventListener("ln-data-store:query-changed", r._handlers.refreshQuery);
  }
  l.prototype._ownsStore = function(r) {
    const s = this.findChildren();
    return !!(s.store && s.store._name === r && r);
  }, l.prototype._serveData = function(r, s) {
    const o = r.target, _ = s === "table" ? "data-ln-table-source" : s === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = o.getAttribute(_);
    if (!v || !this._ownsStore(v)) return;
    const A = r.detail || {}, w = Ge(A);
    this._boundQueries.set(o, w);
    const C = this.findChildren(), T = this, q = C.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const I = Ht(q, C.connector), D = ie(w, q && q.query);
      if (I === "remote") {
        S(o, "ln-" + s + ":set-loading", { loading: !0 }), S(C.connectorEl, "ln-api-connector:request-query", {
          query: D,
          meta: { targetEl: o, kind: s }
        });
        return;
      }
      if (I !== "store") {
        S(o, "ln-" + s + ":set-loading", { loading: !1 });
        return;
      }
      return q.getAll(D).then(function(R) {
        const N = {
          data: R.data,
          total: R.total,
          filtered: R.filtered,
          offset: A.offset !== void 0 ? A.offset : R.offset,
          queryGen: A.queryGen !== void 0 ? A.queryGen : R.queryGen
        };
        S(o, "ln-" + s + ":set-data", N), T._boundDelivered.set(o, !0);
      });
    }).catch(function(I) {
      S(o, "ln-" + s + ":set-loading", { loading: !1 }), S(T.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: s,
        store: v,
        target: o,
        error: I
      });
    });
  }, l.prototype._serveOptions = function(r) {
    const s = r.target, o = s.getAttribute("data-ln-options");
    if (!this._ownsStore(o)) return;
    const _ = this.findChildren(), v = _.store, A = v && v.ready ? v.ready : Promise.resolve(), w = this;
    return A.then(function() {
      const C = Ht(v, _.connector);
      if (C === "remote") {
        S(_.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: s, kind: "options" }
        });
        return;
      }
      if (C === "store")
        return v.getAll({}).then(function(T) {
          S(s, "ln-options:set-data", { data: T.data });
        });
    }).catch(function(C) {
      w._reportReconciliationError("options-query", C, { targetEl: s, kind: "options" });
    });
  }, l.prototype._serveStat = function(r) {
    const s = r.target, o = s.getAttribute("data-ln-stat");
    if (!this._ownsStore(o)) return;
    const _ = r.detail && r.detail.filters ? r.detail.filters : null, v = this.findChildren(), A = v.store, w = A && A.ready ? A.ready : Promise.resolve(), C = this;
    return w.then(function() {
      const T = Ht(A, v.connector);
      if (T === "remote") {
        S(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: _ },
          meta: { targetEl: s, kind: "stat" }
        });
        return;
      }
      if (T === "store")
        return A.count(_).then(function(q) {
          S(s, "ln-stat:set-count", { count: q });
        });
    }).catch(function(T) {
      C._reportReconciliationError("stat-query", T, { targetEl: s, kind: "stat" });
    });
  }, l.prototype._refreshAll = function(r) {
    const s = this, o = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let _ = 0; _ < o.length; _++) {
      const v = o[_];
      let A, w;
      if (v.hasAttribute("data-ln-table-source") ? (A = v.getAttribute("data-ln-table-source"), w = "table") : v.hasAttribute("data-ln-list-source") ? (A = v.getAttribute("data-ln-list-source"), w = "list") : v.hasAttribute("data-ln-chart-source") ? (A = v.getAttribute("data-ln-chart-source"), w = "chart") : v.hasAttribute("data-ln-options") ? (A = v.getAttribute("data-ln-options"), w = "options") : v.hasAttribute("data-ln-stat") && (A = v.getAttribute("data-ln-stat"), w = "stat"), !this._ownsStore(A)) continue;
      const C = this.findChildren().store;
      if (w === "table" || w === "list" || w === "chart") {
        const T = s._boundQueries.get(v) || { sort: null, filters: {}, search: "" };
        (function(q, x) {
          C.getAll(ie(T, C.query)).then(function(I) {
            const D = {
              data: I.data,
              total: r && r.total !== void 0 ? r.total : I.total,
              filtered: r && r.filtered !== void 0 ? r.filtered : I.filtered,
              offset: I.offset !== void 0 ? I.offset : r && r.offset !== void 0 ? r.offset : T.offset,
              queryGen: I.queryGen !== void 0 ? I.queryGen : r && r.queryGen !== void 0 ? r.queryGen : T.queryGen
            };
            S(q, "ln-" + x + ":set-loading", { loading: !1 }), S(q, "ln-" + x + ":set-data", D), s._boundDelivered.set(q, !0);
          });
        })(v, w);
      } else if (w === "options")
        (function(T) {
          C.getAll({}).then(function(q) {
            S(T, "ln-options:set-data", { data: q.data });
          });
        })(v);
      else if (w === "stat") {
        const T = v.getAttribute("data-ln-stat-filter");
        let q = null;
        if (T) {
          const x = T.indexOf(":");
          if (x !== -1) {
            const I = T.slice(0, x), D = T.slice(x + 1);
            q = {}, q[I] = [D];
          }
        }
        (function(x, I) {
          C.count(I).then(function(D) {
            S(x, "ln-stat:set-count", { count: D });
          });
        })(v, q);
      }
    }
  }, l.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const r = this;
    r._handlers && (r.dom.removeEventListener("ln-data-store:request-remote-sync", r._handlers.sync), r.dom.removeEventListener("ln-data-store:request-page", r._handlers.requestPage), r.dom.removeEventListener("ln-data-coordinator:request-create", r._handlers.reqCreate), r.dom.removeEventListener("ln-data-coordinator:request-update", r._handlers.reqUpdate), r.dom.removeEventListener("ln-data-coordinator:request-delete", r._handlers.reqDelete), r.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", r._handlers.reqBulkDelete), r.dom.removeEventListener("ln-api-queue:send", r._handlers.queueSend), r.dom.removeEventListener("ln-api-queue:failed", r._handlers.queueFailed), r.dom.removeEventListener("ln-data-store:initialized", r._handlers.storeInitialized), document.removeEventListener("submit", r._handlers.formSubmit), n.forEach(function(s) {
      r.dom.removeEventListener(s + ":fetched", r._handlers.connFetched), r.dom.removeEventListener(s + ":created", r._handlers.connCreated), r.dom.removeEventListener(s + ":updated", r._handlers.connUpdated), r.dom.removeEventListener(s + ":deleted", r._handlers.connDeleted), r.dom.removeEventListener(s + ":bulk-deleted", r._handlers.connBulkDeleted), r.dom.removeEventListener(s + ":error", r._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", r._handlers.reqTableData), document.removeEventListener("ln-list:request-data", r._handlers.reqListData), document.removeEventListener("ln-chart:request-data", r._handlers.reqChartData), document.removeEventListener("ln-options:request-data", r._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", r._handlers.reqStat), r.dom.removeEventListener("ln-data-store:ready", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:loaded", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:created", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:updated", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:deleted", r._handlers.refresh), r.dom.removeEventListener("ln-data-store:mutation-error", r._handlers.mutationError), r.dom.removeEventListener("ln-data-store:synced", r._handlers.refreshSynced), r.dom.removeEventListener("ln-data-store:query-changed", r._handlers.refreshQuery), r._handlers = null), r._boundQueries = null, r._boundDelivered = null, r._mutationReceipts.close(new Error("Data coordinator destroyed")), r._mutationReceipts = null, p.delete(this), t(), delete this.dom[c], delete this.dom[y];
  };
  function g(r, s) {
    const o = r[c];
    o && s === "data-ln-data-mapper" && o.refreshMapper();
  }
  H(h, c, l, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: g
  });
})();
const Qe = "ln_api_queue", $e = 2, G = "outbox", tt = "_queue_meta";
function nt(h, c) {
  return h.error || new Error(c);
}
function yt(h, c) {
  return h.bound([c, -1 / 0], [c, 1 / 0]);
}
function re(h) {
  return "seq:" + h;
}
function kt(h) {
  return "paused:" + h;
}
function oe(h) {
  h.leaseOwner = null, h.leaseUntil = 0;
}
function Ye(h, c, y) {
  return typeof h != "string" || h.indexOf(c) === -1 ? h : h.split(c).join(y);
}
function Xe(h, c, y, b) {
  const p = /* @__PURE__ */ new Map(), f = [], u = [];
  for (const a of h || [])
    p.has(a.chainKey) || p.set(a.chainKey, []), p.get(a.chainKey).push(a);
  return p.forEach((a, d) => {
    a.sort((t, i) => t.seq - i.seq);
    const e = a[0];
    if (!(!e || e.status === "failed")) {
      if (e.status === "inflight" && (e.leaseUntil || 0) > b) {
        u.push({ chainKey: d, at: e.leaseUntil });
        return;
      }
      if ((e.nextAttemptAt || 0) > b) {
        u.push({ chainKey: d, at: e.nextAttemptAt });
        return;
      }
      e.status = "inflight", e.leaseOwner = c, e.leaseUntil = b + y, e.updatedAt = b, f.push(e);
    }
  }), { entries: f, wakeups: u };
}
function Je(h, c, y, b, p) {
  const f = [], u = [];
  for (const a of h || []) {
    if (a.entryId === c) {
      u.push(a.entryId);
      continue;
    }
    a.chainKey === y && (a.chainKey = b, a.targetId === y && (a.targetId = b), a.meta && a.meta.id === y && (a.meta.id = b), a.meta && typeof a.meta.action == "string" && (a.meta.action = Ye(a.meta.action, y, b)), a.updatedAt = p, f.push(a));
  }
  return { changed: f, deleted: u };
}
class Ze {
  constructor(c) {
    c = c || {}, this.indexedDB = c.indexedDB || globalThis.indexedDB, this.keyRange = c.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = c.dbName || Qe, this.now = c.now || (() => Date.now()), this.uuid = c.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((c, y) => {
      const b = this.indexedDB.open(this.dbName, $e);
      b.onupgradeneeded = (p) => {
        const f = p.target.result;
        let u;
        f.objectStoreNames.contains(G) ? u = p.target.transaction.objectStore(G) : u = f.createObjectStore(G, { keyPath: "entryId" }), u.indexNames.contains("by_scope_chain") || u.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), u.indexNames.contains("by_scope_seq") || u.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), f.objectStoreNames.contains(tt) || f.createObjectStore(tt, { keyPath: "key" });
      }, b.onerror = () => y(nt(b, "Queue database open failed")), b.onsuccess = (p) => {
        this._db = p.target.result, this._db.onversionchange = () => this.close(), c(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((c, y) => {
      const b = this.indexedDB.deleteDatabase(this.dbName);
      b.onsuccess = () => c(), b.onerror = () => y(nt(b, "Queue database delete failed")), b.onblocked = () => y(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(c) {
    return this.open().then((y) => y ? new Promise((b, p) => {
      const u = y.transaction(G, "readonly").objectStore(G).index("by_scope_seq").getAll(yt(this.keyRange, c));
      u.onsuccess = () => b(u.result || []), u.onerror = () => p(nt(u, "Queue scope read failed"));
    }) : []);
  }
  enqueue(c, y) {
    return y = y || {}, this.open().then((b) => b ? new Promise((p, f) => {
      const u = b.transaction([tt, G], "readwrite"), a = u.objectStore(tt), d = u.objectStore(G), e = re(c);
      let t = null;
      const i = (l) => {
        const m = l + 1;
        t = {
          entryId: this.uuid(),
          scope: c,
          chainKey: y.chainKey,
          seq: m,
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
        }, a.put({ key: e, value: m }), d.put(t);
      }, n = a.get(e);
      n.onerror = () => f(nt(n, "Queue sequence read failed")), n.onsuccess = () => {
        const l = n.result;
        if (l && typeof l.value == "number") {
          i(l.value);
          return;
        }
        const m = d.index("by_scope_seq").getAll(yt(this.keyRange, c));
        m.onerror = () => f(nt(m, "Queue sequence migration failed")), m.onsuccess = () => {
          const g = (m.result || []).reduce((r, s) => Math.max(r, s.seq || 0), 0);
          i(g);
        };
      }, u.oncomplete = () => p(t), u.onerror = () => f(u.error || new Error("Queue enqueue transaction failed")), u.onabort = () => f(u.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(c, y, b) {
    return this.open().then((p) => p ? new Promise((f, u) => {
      const a = p.transaction(G, "readwrite"), d = a.objectStore(G), e = d.index("by_scope_seq").getAll(yt(this.keyRange, c)), t = this.now();
      let i = { entries: [], wakeups: [] };
      e.onerror = () => u(nt(e, "Queue claim read failed")), e.onsuccess = () => {
        i = Xe(e.result || [], y, b, t);
        for (const n of i.entries) d.put(n);
      }, a.oncomplete = () => f(i), a.onerror = () => u(a.error || new Error("Queue claim transaction failed")), a.onabort = () => u(a.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(c, y) {
    return this._updateEntry(c, y, (b, p) => (p.delete(b.entryId), { status: "acked", entry: b }));
  }
  nack(c, y, b, p) {
    p = p || {};
    const f = p.maxAttempts || 8, u = p.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((a) => a ? new Promise((d, e) => {
      const t = a.transaction([G, tt], "readwrite"), i = t.objectStore(G), n = t.objectStore(tt), l = i.get(y);
      let m = null;
      l.onerror = () => e(nt(l, "Queue nack read failed")), l.onsuccess = () => {
        const g = l.result;
        if (!(!g || g.scope !== c)) {
          if (b === "drop") {
            i.delete(g.entryId), m = { status: "dropped", entry: g };
            return;
          }
          if (oe(g), g.updatedAt = this.now(), b === "auth") {
            g.status = "pending", i.put(g), n.put({ key: kt(c), value: !0 }), m = { status: "auth", entry: g };
            return;
          }
          if (b === "retry") {
            if (g.attempts = (g.attempts || 0) + 1, g.attempts >= f) {
              g.status = "failed", g.nextAttemptAt = 0, i.put(g), m = { status: "failed", entry: g };
              return;
            }
            const r = u[Math.min(g.attempts - 1, u.length - 1)];
            g.status = "pending", g.nextAttemptAt = this.now() + r, i.put(g), m = { status: "retry", entry: g, delay: r };
          }
        }
      }, t.oncomplete = () => d(m), t.onerror = () => e(t.error || new Error("Queue nack transaction failed")), t.onabort = () => e(t.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(c, y, b) {
    return this._remapTransaction(c, null, y, b);
  }
  resolveCreate(c, y, b, p) {
    return this._remapTransaction(c, y, b, p);
  }
  _remapTransaction(c, y, b, p) {
    return this.open().then((f) => f ? new Promise((u, a) => {
      const d = f.transaction(G, "readwrite"), e = d.objectStore(G), t = e.index("by_scope_seq").getAll(yt(this.keyRange, c));
      let i = { changed: [], deleted: [] };
      t.onerror = () => a(nt(t, "Queue remap read failed")), t.onsuccess = () => {
        i = Je(t.result || [], y, b, p, this.now());
        for (const n of i.deleted) e.delete(n);
        for (const n of i.changed) e.put(n);
      }, d.oncomplete = () => u(i.changed), d.onerror = () => a(d.error || new Error("Queue remap transaction failed")), d.onabort = () => a(d.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(c) {
    return this.open().then((y) => y ? new Promise((b, p) => {
      const f = y.transaction(G, "readwrite"), u = f.objectStore(G), a = u.index("by_scope_seq").getAll(yt(this.keyRange, c));
      let d = 0;
      a.onerror = () => p(nt(a, "Queue failed-entry read failed")), a.onsuccess = () => {
        for (const e of a.result || [])
          e.status === "failed" && (e.status = "pending", e.attempts = 0, e.nextAttemptAt = 0, e.updatedAt = this.now(), oe(e), u.put(e), d++);
      }, f.oncomplete = () => b(d), f.onerror = () => p(f.error || new Error("Queue failed-entry reset failed")), f.onabort = () => p(f.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(c) {
    return this.open().then((y) => y ? new Promise((b, p) => {
      const u = y.transaction(tt, "readonly").objectStore(tt).get(kt(c));
      u.onsuccess = () => b(!!(u.result && u.result.value)), u.onerror = () => p(nt(u, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(c, y) {
    return this.open().then((b) => {
      if (b)
        return new Promise((p, f) => {
          const u = b.transaction(tt, "readwrite");
          u.objectStore(tt).put({ key: kt(c), value: !!y }), u.oncomplete = () => p(), u.onerror = () => f(u.error || new Error("Queue pause-state write failed")), u.onabort = () => f(u.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(c) {
    return this.open().then((y) => {
      if (y)
        return new Promise((b, p) => {
          const f = y.transaction([G, tt], "readwrite"), a = f.objectStore(G).index("by_scope_seq").openCursor(yt(this.keyRange, c));
          a.onsuccess = (d) => {
            const e = d.target.result;
            e && (e.delete(), e.continue());
          }, a.onerror = () => p(nt(a, "Queue clear failed")), f.objectStore(tt).delete(re(c)), f.objectStore(tt).delete(kt(c)), f.oncomplete = () => b(), f.onerror = () => p(f.error || new Error("Queue clear transaction failed")), f.onabort = () => p(f.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(c, y, b) {
    return this.open().then((p) => p ? new Promise((f, u) => {
      const a = p.transaction(G, "readwrite"), d = a.objectStore(G), e = d.get(y);
      let t = null;
      e.onerror = () => u(nt(e, "Queue entry read failed")), e.onsuccess = () => {
        const i = e.result;
        !i || i.scope !== c || (t = b(i, d));
      }, a.oncomplete = () => f(t), a.onerror = () => u(a.error || new Error("Queue entry transaction failed")), a.onabort = () => u(a.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const h = "data-ln-api-queue", c = "lnApiQueue", y = [2e3, 5e3, 15e3, 6e4, 3e5], b = 8, p = 6e4;
  if (window[c] !== void 0) return;
  function f() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
        const i = Math.random() * 16 | 0;
        return (t === "x" ? i : i & 3 | 8).toString(16);
      });
    }
  }
  const u = new Ze({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: f
  });
  function a(e) {
    this.dom = e, e[c] = this;
    const t = e.closest("[data-ln-data-coordinator]");
    this.scope = e.id || (t ? t.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = f(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const i = this;
    return u.open().then((n) => n ? u.getPaused(i.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((n) => (i._paused = !!n, i._paused && S(i.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), i._emitPendingCount())).then(() => i._drain()).catch((n) => {
      console.error("[ln-api-queue] Initialization failed:", n), S(i.dom, "ln-api-queue:error", { operation: "initialize", error: n });
    }), this;
  }
  a.prototype._isOnline = function() {
    const e = this.dom.getAttribute("data-ln-api-queue-online");
    return e === "true" ? !0 : e === "false" ? !1 : navigator.onLine;
  }, a.prototype._emitPendingCount = function() {
    const e = this;
    return u.allForScope(e.scope).then((t) => (S(e.dom, "ln-api-queue:pending-count", { count: t.length, scope: e.scope }), t.length === 0 && S(e.dom, "ln-api-queue:drained", { scope: e.scope }), t));
  }, a.prototype._clearTimer = function(e) {
    const t = this._timers.get(e);
    t && (clearTimeout(t), this._timers.delete(e));
  }, a.prototype._scheduleTimer = function(e, t) {
    const i = Math.max(0, t), n = this._timers.get(e);
    n && clearTimeout(n);
    const l = this, m = setTimeout(() => {
      l._timers.delete(e), l._drain();
    }, i);
    this._timers.set(e, m);
  }, a.prototype._drain = function() {
    const e = this;
    return e._paused || !e._isOnline() ? Promise.resolve() : (e._drainPromise || (e._drainPromise = u.claimReady(e.scope, e._workerId, p).then((t) => {
      for (const i of t.wakeups)
        e._scheduleTimer(i.chainKey, i.at - Date.now());
      for (const i of t.entries)
        e._clearTimer(i.chainKey), S(e.dom, "ln-api-queue:send", {
          entryId: i.entryId,
          chainKey: i.chainKey,
          op: i.op,
          targetId: i.targetId,
          payload: i.payload,
          expectedVersion: i.expectedVersion,
          idempotencyKey: i.entryId,
          meta: i.meta
        });
    }).catch((t) => {
      console.error("[ln-api-queue] Drain failed:", t), S(e.dom, "ln-api-queue:error", { operation: "drain", error: t });
    }).finally(() => {
      e._drainPromise = null;
    })), e._drainPromise);
  }, a.prototype._onEnqueue = function(e) {
    const t = this;
    return u.enqueue(t.scope, e.detail || {}).then((i) => {
      if (i)
        return t._emitPendingCount().then((n) => (S(t.dom, "ln-api-queue:enqueued", {
          entryId: i.entryId,
          chainKey: i.chainKey,
          count: n.length
        }), t._drain()));
    }).catch((i) => {
      S(t.dom, "ln-api-queue:error", { operation: "enqueue", error: i });
    });
  }, a.prototype._onAck = function(e) {
    const t = this, i = e.detail || {};
    return u.ack(t.scope, i.entryId).then(() => t._emitPendingCount()).then(() => t._drain()).catch((n) => {
      S(t.dom, "ln-api-queue:error", { operation: "ack", entryId: i.entryId, error: n });
    });
  }, a.prototype._onNack = function(e) {
    const t = this, i = e.detail || {};
    return u.nack(t.scope, i.entryId, i.reason, {
      maxAttempts: b,
      backoff: y
    }).then((n) => {
      if (n)
        return n.status === "failed" ? S(t.dom, "ln-api-queue:failed", {
          entryId: n.entry.entryId,
          chainKey: n.entry.chainKey,
          attempts: n.entry.attempts
        }) : n.status === "retry" ? t._scheduleTimer(n.entry.chainKey, n.delay) : n.status === "auth" && (t._paused = !0, S(t.dom, "ln-api-queue:paused", { reason: "auth" }), S(t.dom, "ln-api-queue:auth-required", {
          entryId: n.entry.entryId,
          chainKey: n.entry.chainKey
        })), t._emitPendingCount().then(() => {
          if (n.status === "dropped") return t._drain();
        });
    }).catch((n) => {
      S(t.dom, "ln-api-queue:error", { operation: "nack", entryId: i.entryId, error: n });
    });
  }, a.prototype._onRemap = function(e) {
    const t = this, i = e.detail || {};
    return u.remap(t.scope, i.oldKey, i.newId).catch((n) => {
      S(t.dom, "ln-api-queue:error", { operation: "remap", error: n });
    });
  }, a.prototype._onResolveCreate = function(e) {
    const t = this, i = e.detail || {};
    return u.resolveCreate(t.scope, i.entryId, i.oldKey, i.newId).then(() => t._emitPendingCount()).then(() => t._drain()).catch((n) => {
      S(t.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: i.entryId,
        error: n
      });
    });
  }, a.prototype._onResume = function() {
    const e = this;
    return u.setPaused(e.scope, !1).then(() => (e._paused = !1, S(e.dom, "ln-api-queue:resumed", {}), e._drain())).catch((t) => {
      S(e.dom, "ln-api-queue:error", { operation: "resume", error: t });
    });
  }, a.prototype._onDrain = function() {
    const e = this;
    return u.resetFailed(e.scope).then(() => {
      const t = e._drainPromise;
      return t ? t.then(() => e._drain()) : e._drain();
    }).catch((t) => {
      S(e.dom, "ln-api-queue:error", { operation: "manual-drain", error: t });
    });
  }, a.prototype._onClear = function() {
    const e = this;
    return e._timers.forEach((t) => clearTimeout(t)), e._timers.clear(), u.clear(e.scope).then(() => {
      e._paused = !1, S(e.dom, "ln-api-queue:pending-count", { count: 0, scope: e.scope }), S(e.dom, "ln-api-queue:drained", { scope: e.scope });
    }).catch((t) => {
      S(e.dom, "ln-api-queue:error", { operation: "clear", error: t });
    });
  }, a.prototype._bindEvents = function() {
    const e = this;
    e._handlers = {
      enqueue: (t) => e._onEnqueue(t),
      ack: (t) => e._onAck(t),
      nack: (t) => e._onNack(t),
      remap: (t) => e._onRemap(t),
      resolveCreate: (t) => e._onResolveCreate(t),
      resume: () => e._onResume(),
      drain: () => e._onDrain(),
      clear: () => e._onClear()
    }, e.dom.addEventListener("ln-api-queue:request-enqueue", e._handlers.enqueue), e.dom.addEventListener("ln-api-queue:ack", e._handlers.ack), e.dom.addEventListener("ln-api-queue:nack", e._handlers.nack), e.dom.addEventListener("ln-api-queue:request-remap", e._handlers.remap), e.dom.addEventListener("ln-api-queue:resolve-create", e._handlers.resolveCreate), e.dom.addEventListener("ln-api-queue:request-resume", e._handlers.resume), e.dom.addEventListener("ln-api-queue:request-drain", e._handlers.drain), e.dom.addEventListener("ln-api-queue:request-clear", e._handlers.clear);
  }, a.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const e = this;
    e.dom.removeEventListener("ln-api-queue:request-enqueue", e._handlers.enqueue), e.dom.removeEventListener("ln-api-queue:ack", e._handlers.ack), e.dom.removeEventListener("ln-api-queue:nack", e._handlers.nack), e.dom.removeEventListener("ln-api-queue:request-remap", e._handlers.remap), e.dom.removeEventListener("ln-api-queue:resolve-create", e._handlers.resolveCreate), e.dom.removeEventListener("ln-api-queue:request-resume", e._handlers.resume), e.dom.removeEventListener("ln-api-queue:request-drain", e._handlers.drain), e.dom.removeEventListener("ln-api-queue:request-clear", e._handlers.clear), window.removeEventListener("online", e._onlineHandler), e._timers.forEach((t) => clearTimeout(t)), e._timers.clear(), S(e.dom, "ln-api-queue:destroyed", { scope: e.scope }), delete e.dom[c];
  };
  function d(e) {
    const t = e[c];
    t && t._drain();
  }
  H(h, c, a, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: d
  });
})();
function Ce(h) {
  if (h == null || h === "") return null;
  const c = Number(h);
  return Number.isFinite(c) ? c : null;
}
function vt(h) {
  return String(Math.round(h * 1e3) / 1e3);
}
function tn(h, c, y) {
  const b = Ce(h);
  return b === null || b < 0 ? 0 : Math.min(b, Math.min(c, y) / 2);
}
function en(h) {
  if (typeof h != "string") return null;
  const c = h.trim().split(/[\s,]+/).map(Number);
  return c.length !== 4 || c.some((y) => !Number.isFinite(y)) || c[2] <= 0 || c[3] <= 0 ? null : { x: c[0], y: c[1], width: c[2], height: c[3] };
}
function nn(h, c) {
  c = c || {};
  const y = c.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, b = c.xField || "label", p = c.yField || "value", f = c.includeZero !== !1, u = tn(c.padding, y.width, y.height), a = Array.isArray(h) ? h : [], d = [];
  for (let x = 0; x < a.length; x++) {
    const I = a[x] || {}, D = Ce(I[p]);
    D !== null && d.push({
      record: I,
      sourceIndex: x,
      label: I[b] == null ? String(x + 1) : String(I[b]),
      value: D
    });
  }
  if (d.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: y.y + y.height - u
    };
  const e = d.map((x) => x.value), t = Math.min(...e), i = Math.max(...e);
  let n = f ? Math.min(0, t) : t, l = f ? Math.max(0, i) : i;
  if (n === l)
    if (n === 0)
      l = 1;
    else {
      const x = Math.max(Math.abs(n) * 0.1, 1);
      n -= x, l += x;
    }
  const m = y.x + u, g = y.y + u, r = Math.max(0, y.width - u * 2), s = Math.max(0, y.height - u * 2), o = d.length > 1 ? r / (d.length - 1) : 0, _ = l - n, v = (x) => g + (l - x) / _ * s, A = d.map((x, I) => ({
    ...x,
    x: d.length === 1 ? m + r / 2 : m + I * o,
    y: v(x.value)
  })), w = n <= 0 && l >= 0 ? 0 : n, C = v(w), T = A.map((x) => vt(x.x) + "," + vt(x.y)).join(" "), q = [
    vt(A[0].x) + "," + vt(C),
    T,
    vt(A[A.length - 1].x) + "," + vt(C)
  ].join(" ");
  return {
    points: A,
    linePoints: T,
    areaPoints: q,
    count: A.length,
    min: t,
    max: i,
    domainMin: n,
    domainMax: l,
    baselineY: C
  };
}
(function() {
  const h = "data-ln-chart", c = "lnChart", y = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[c] !== void 0) return;
  function b(a) {
    if (!a) return null;
    const d = a.split(":"), e = d[0].trim();
    return e ? {
      field: e,
      direction: d[1] && d[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function p(a, d) {
    if (a == null || !Number.isFinite(a)) return "";
    try {
      return new Intl.NumberFormat(W(d)).format(a);
    } catch {
      return String(a);
    }
  }
  function f(a, d) {
    a && (a.textContent = d);
  }
  function u(a) {
    this.dom = a, this.name = a.getAttribute(h) || "", this.source = a.getAttribute("data-ln-chart-source") || this.name, this.plot = a.querySelector("[data-ln-chart-plot]"), this.line = a.querySelector("[data-ln-chart-line]"), this.area = a.querySelector("[data-ln-chart-area]"), this.labels = a.querySelector("[data-ln-chart-labels]"), this.empty = a.querySelector("[data-ln-chart-empty]"), this.minimum = a.querySelector("[data-ln-chart-min]"), this.maximum = a.querySelector("[data-ln-chart-max]"), this.count = a.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const d = this;
    return this._onSetData = function(e) {
      const t = e.detail || {};
      d._data = Array.isArray(t.data) ? t.data : [], d.isLoaded = !0, d._setLoading(!1), d._render();
    }, this._onSetLoading = function(e) {
      d._setLoading(!!(e.detail && e.detail.loading));
    }, this._onRefresh = function() {
      d.requestData();
    }, a.addEventListener("ln-chart:set-data", this._onSetData), a.addEventListener("ln-chart:set-loading", this._onSetLoading), a.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  u.prototype._readOptions = function() {
    const a = this.dom.getAttribute("data-ln-chart-padding"), d = a === null ? NaN : Number(a), e = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(d) && d >= 0 ? d : 16,
      type: e === "area" || e === "polygon" ? "area" : "line",
      viewBox: this.plot && en(this.plot.getAttribute("viewBox")) || y
    };
  }, u.prototype._setLoading = function(a) {
    this.dom.classList.toggle("ln-chart--loading", a), this.dom.setAttribute("aria-busy", a ? "true" : "false");
  }, u.prototype._renderLabels = function(a) {
    if (!this.labels || (this.labels.replaceChildren(), a.count === 0)) return;
    const d = this.name + "-label", e = '[data-ln-template="' + d + '"]';
    if (!this.dom.querySelector(e) && !document.querySelector(e)) return;
    const t = mt(this.dom, d, "ln-chart");
    if (t)
      for (const i of a.points) {
        const n = t.cloneNode(!0);
        wt(n, {
          label: i.label,
          value: p(i.value, this.dom)
        }), this.labels.appendChild(n);
      }
  }, u.prototype._render = function() {
    const a = this._readOptions(), d = nn(this._data, a);
    this.model = d, this.line && (this.line.setAttribute("points", d.linePoints), this.line.toggleAttribute("hidden", d.count === 0)), this.area && (this.area.setAttribute("points", d.areaPoints), this.area.toggleAttribute("hidden", d.count === 0 || a.type !== "area"));
    const e = d.count === 0;
    this.dom.classList.toggle("ln-chart--empty", e), this.empty && this.empty.toggleAttribute("hidden", !e), f(this.minimum, p(d.min, this.dom)), f(this.maximum, p(d.max, this.dom)), f(this.count, p(d.count, this.dom)), this._renderLabels(d), S(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: d.count,
      min: d.min,
      max: d.max
    });
  }, u.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, S(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: b(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, u.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[c]);
  }, H(h, c, u, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(a, d) {
      const e = a[c];
      if (e) {
        if (d === "data-ln-chart-source" || d === "data-ln-chart-sort") {
          e.requestData();
          return;
        }
        e._render();
      }
    }
  });
})();
(function() {
  const h = "data-ln-options", c = "lnOptions";
  if (window[c] !== void 0) return;
  function y(b) {
    this.dom = b, this._storeName = b.getAttribute(h), this._valueField = b.getAttribute("data-ln-options-value") || "id", this._labelField = b.getAttribute("data-ln-options-label") || "name";
    const p = this;
    return this._onSetData = function(f) {
      p._rebuild(f.detail.data || []);
    }, b.addEventListener("ln-options:set-data", this._onSetData), S(b, "ln-options:request-data", { options: this._storeName }), this;
  }
  y.prototype._rebuild = function(b) {
    const p = this.dom, f = this._valueField, u = this._labelField, a = p.value, d = p.querySelectorAll("option");
    for (let t = d.length - 1; t >= 0; t--)
      d[t].value !== "" && p.removeChild(d[t]);
    for (let t = 0; t < b.length; t++) {
      const i = b[t], n = document.createElement("option");
      n.value = String(i[f]), n.textContent = i[u] != null ? i[u] : "", p.appendChild(n);
    }
    const e = p.options;
    for (let t = 0; t < e.length; t++)
      if (e[t].value === a) {
        p.value = a;
        break;
      }
  }, y.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[c]);
  }, H(h, c, y, "ln-options");
})();
(function() {
  const h = "data-ln-stat", c = "lnStat";
  if (window[c] !== void 0) return;
  function y(p) {
    if (!p) return null;
    const f = p.indexOf(":");
    if (f === -1) return null;
    const u = p.slice(0, f), a = p.slice(f + 1), d = {};
    return d[u] = [a], d;
  }
  function b(p) {
    return this.dom = p, this._storeName = p.getAttribute(h), this._filters = y(p.getAttribute("data-ln-stat-filter")), this._onSetCount = function(f) {
      p.textContent = String(f.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), S(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  b.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[c]);
  }, H(h, c, b, "ln-stat");
})();
(function() {
  const h = "ln-icons-sprite", c = "#ln-", y = "#lnc-", b = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let f = null;
  const u = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), a = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), d = "lni:", e = "lni:v", t = "1";
  function i() {
    try {
      if (localStorage.getItem(e) !== t) {
        for (let o = localStorage.length - 1; o >= 0; o--) {
          const _ = localStorage.key(o);
          _ && _.indexOf(d) === 0 && localStorage.removeItem(_);
        }
        localStorage.setItem(e, t);
      }
    } catch {
    }
  }
  i();
  function n() {
    return f || (f = document.getElementById(h), f || (f = document.createElementNS("http://www.w3.org/2000/svg", "svg"), f.id = h, f.setAttribute("hidden", ""), f.setAttribute("aria-hidden", "true"), f.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(f, document.body.firstChild))), f;
  }
  function l(o) {
    return o.indexOf(y) === 0 ? a + "/" + o.slice(y.length) + ".svg" : u + "/" + o.slice(c.length) + ".svg";
  }
  function m(o, _) {
    const v = _.match(/viewBox="([^"]+)"/), A = v ? v[1] : "0 0 24 24", w = _.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = w ? w[1].trim() : "", T = _.match(/<svg([^>]*)>/i), q = T ? T[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = o, x.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const D = q.match(new RegExp(I + '="([^"]*)"'));
      D && x.setAttribute(I, D[1]);
    }), x.innerHTML = C, n().querySelector("defs").appendChild(x);
  }
  function g(o) {
    if (b.has(o) || p.has(o) || o.indexOf(y) === 0 && !a) return;
    const _ = o.slice(1);
    try {
      const v = localStorage.getItem(d + _);
      if (v) {
        m(_, v), b.add(o);
        return;
      }
    } catch {
    }
    p.add(o), fetch(l(o)).then(function(v) {
      if (!v.ok) throw new Error(v.status);
      return v.text();
    }).then(function(v) {
      m(_, v), b.add(o), p.delete(o);
      try {
        localStorage.setItem(d + _, v);
      } catch {
      }
    }).catch(function() {
      p.delete(o);
    });
  }
  function r(o) {
    const _ = 'use[href^="' + c + '"], use[href^="' + y + '"]', v = o.querySelectorAll ? o.querySelectorAll(_) : [];
    if (o.matches && o.matches(_)) {
      const A = o.getAttribute("href");
      A && g(A);
    }
    Array.prototype.forEach.call(v, function(A) {
      const w = A.getAttribute("href");
      w && g(w);
    });
  }
  function s() {
    r(document), new MutationObserver(function(o) {
      o.forEach(function(_) {
        if (_.type === "childList")
          _.addedNodes.forEach(function(v) {
            v.nodeType === 1 && r(v);
          });
        else if (_.type === "attributes" && _.attributeName === "href") {
          const v = _.target.getAttribute("href");
          v && (v.indexOf(c) === 0 || v.indexOf(y) === 0) && g(v);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const h = "data-ln-debug", c = "lnDebug";
  if (window[c] !== void 0) return;
  function y(b) {
    return this.dom = b, this;
  }
  y.prototype.destroy = function() {
    delete this.dom[c];
  }, H(h, c, y, "ln-debug");
})();
