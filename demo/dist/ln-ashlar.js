if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...l) {
    typeof l[0] == "string" && (l[0].startsWith("[ln-") || l[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, l);
  };
}
const Pt = {};
function It(h, l) {
  Pt[h] || (Pt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const b = Pt[h];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (l || "ln-core") + '] Template "' + h + '" not found'), null);
}
function A(h, l, b) {
  h.dispatchEvent(new CustomEvent(l, {
    bubbles: !0,
    detail: b || {}
  }));
}
function Y(h, l, b) {
  const y = new CustomEvent(l, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return h.dispatchEvent(y), y;
}
function qe(h, l, b) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const y = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  y[b] = h.name, A(h.dom, l, y);
}
function it(h, l) {
  if (!h || !l) return h;
  const b = h.querySelectorAll("[data-ln-field]");
  for (let u = 0; u < b.length; u++) {
    const o = b[u], d = o.getAttribute("data-ln-field");
    l[d] != null && (o.textContent = l[d]);
  }
  const y = h.querySelectorAll("[data-ln-attr]");
  for (let u = 0; u < y.length; u++) {
    const o = y[u], d = o.getAttribute("data-ln-attr").split(",");
    for (let e = 0; e < d.length; e++) {
      const t = d[e].trim().split(":");
      if (t.length !== 2) continue;
      const r = t[0].trim(), n = t[1].trim();
      l[n] != null && o.setAttribute(r, l[n]);
    }
  }
  const p = h.querySelectorAll("[data-ln-show]");
  for (let u = 0; u < p.length; u++) {
    const o = p[u], d = o.getAttribute("data-ln-show");
    d in l && o.classList.toggle("hidden", !l[d]);
  }
  const f = h.querySelectorAll("[data-ln-class]");
  for (let u = 0; u < f.length; u++) {
    const o = f[u], d = o.getAttribute("data-ln-class").split(",");
    for (let e = 0; e < d.length; e++) {
      const t = d[e].trim().split(":");
      if (t.length !== 2) continue;
      const r = t[0].trim(), n = t[1].trim();
      n in l && o.classList.toggle(r, !!l[n]);
    }
  }
  return h;
}
function xe(h, l) {
  h.matches && h.matches("[data-ln-form], [data-ln-fillable]") && h.dispatchEvent(new CustomEvent("ln-fill", { detail: l ?? null, bubbles: !0 }));
  const b = h.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let y = 0; y < b.length; y++)
    b[y].dispatchEvent(new CustomEvent("ln-fill", { detail: l ?? null, bubbles: !0 }));
  return h;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(h) {
  if (!(!h.target.matches || !h.target.matches("[data-ln-fillable]")))
    if (h.detail)
      it(h.target, h.detail);
    else {
      const l = h.target.querySelectorAll("[data-ln-field]");
      for (let b = 0; b < l.length; b++)
        l[b].textContent = "";
    }
})));
function wt(h, l) {
  if (!h || !l) return h;
  const b = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const f = b.currentNode;
    f.textContent.indexOf("{{") !== -1 && (f.textContent = f.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(u, o) {
        return l[o] !== void 0 ? l[o] : "";
      }
    ));
  }
  const y = function(f, u) {
    return l[u] !== void 0 ? l[u] : "";
  }, p = Array.from(h.querySelectorAll("*"));
  h.nodeType === 1 && p.push(h);
  for (let f = 0; f < p.length; f++) {
    const u = p[f], o = u.attributes;
    for (let d = 0; d < o.length; d++) {
      const e = o[d];
      e.value.indexOf("{{") !== -1 && u.setAttribute(e.name, e.value.replace(/\{\{\s*(\w+)\s*\}\}/g, y));
    }
  }
  return h;
}
function ke(h, l, b, y, p, f) {
  const u = {};
  for (let d = 0; d < h.children.length; d++) {
    const e = h.children[d], t = e.getAttribute("data-ln-key");
    t && (u[t] = e);
  }
  const o = document.createDocumentFragment();
  for (let d = 0; d < l.length; d++) {
    const e = l[d], t = String(y(e));
    let r = u[t];
    if (r)
      p(r, e, d);
    else {
      const n = It(b, f);
      if (!n || (wt(n, e), r = n.firstElementChild, !r)) continue;
      r.setAttribute("data-ln-key", t), p(r, e, d);
    }
    o.appendChild(r);
  }
  h.textContent = "", h.appendChild(o);
}
function st(h, l) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      st(h, l);
    }), console.warn("[" + l + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function mt(h, l, b) {
  if (h) {
    const y = h.querySelector('[data-ln-template="' + l + '"]');
    if (y) return y.content.cloneNode(!0);
  }
  return It(l, b);
}
function Qt(h, l) {
  const b = {}, y = h.querySelectorAll("[" + l + "]");
  for (let p = 0; p < y.length; p++)
    b[y[p].getAttribute(l)] = y[p].textContent, y[p].remove();
  return b;
}
function Bt(h, l, b, y) {
  if (h.nodeType !== 1) return;
  const f = l.indexOf("[") !== -1 || l.indexOf(".") !== -1 || l.indexOf("#") !== -1 ? l : "[" + l + "]", u = Array.from(h.querySelectorAll(f));
  h.matches && h.matches(f) && u.push(h);
  for (const o of u)
    o[b] || (o[b] = new y(o));
}
function Dt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function De(h) {
  const l = h.querySelector('input[name="_method"]');
  return ((l && l.value !== "" ? l.value : h.method) || "").toUpperCase();
}
function le(h, l) {
  const b = !!(l && l.typed), y = l && l.exclude, p = {}, f = h.elements, u = {};
  if (b)
    for (let o = 0; o < f.length; o++) {
      const d = f[o];
      d.name && d.type === "checkbox" && !d.disabled && (u[d.name] = (u[d.name] || 0) + 1);
    }
  for (let o = 0; o < f.length; o++) {
    const d = f[o];
    if (!(!d.name || d.disabled || d.type === "file" || d.type === "submit" || d.type === "button") && !(y && d.matches && d.matches(y)))
      if (d.type === "checkbox")
        b && u[d.name] === 1 ? p[d.name] = d.checked : (p[d.name] || (p[d.name] = []), d.checked && p[d.name].push(d.value));
      else if (d.type === "radio")
        d.checked && (p[d.name] = d.value);
      else if (d.type === "select-multiple") {
        p[d.name] = [];
        for (let e = 0; e < d.options.length; e++)
          d.options[e].selected && p[d.name].push(d.options[e].value);
      } else if (b && d.type === "hidden")
        p[d.name] = d.value;
      else if (b && (d.type === "number" || d.type === "range")) {
        const e = Number(d.value);
        p[d.name] = d.value === "" || isNaN(e) ? null : e;
      } else
        p[d.name] = d.value;
  }
  return p;
}
function Ie(h) {
  if (typeof h != "string") return !!h;
  const l = h.trim().toLowerCase();
  return l !== "false" && l !== "0" && l !== "" && l !== "off" && l !== "no";
}
function ce(h, l) {
  const b = h.elements, y = [], p = {};
  for (let f = 0; f < b.length; f++) {
    const u = b[f];
    u.name && u.type === "checkbox" && (p[u.name] = (p[u.name] || 0) + 1);
  }
  for (let f = 0; f < b.length; f++) {
    const u = b[f];
    if (u.type === "file" || u.type === "submit" || u.type === "button") continue;
    const o = u.getAttribute("data-ln-fill-as") || u.name;
    if (!o || !(o in l)) continue;
    const d = l[o];
    if (u.type === "checkbox") {
      if (Array.isArray(d))
        u.checked = d.indexOf(u.value) !== -1;
      else if (p[u.name] > 1) {
        const e = String(d).split(",").map(function(t) {
          return t.trim();
        });
        u.checked = e.indexOf(u.value) !== -1;
      } else
        u.checked = Ie(d);
      y.push(u);
    } else if (u.type === "radio")
      u.checked = u.value === String(d), y.push(u);
    else if (u.type === "select-multiple") {
      if (Array.isArray(d))
        for (let e = 0; e < u.options.length; e++)
          u.options[e].selected = d.indexOf(u.options[e].value) !== -1;
      y.push(u);
    } else
      u.value = d, y.push(u);
  }
  return y;
}
const Zt = {
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
  const l = h ? h.closest("[lang]") : null, b = (l ? l.getAttribute("lang") || l.lang : null) || (document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || navigator.language;
  if (!b) return "en-US";
  const y = b.trim().toLowerCase();
  return y.indexOf("-") === -1 && Zt[y] ? Zt[y] : b;
}
function te(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function de(h, l, { get: b, set: y }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return b ? b.call(this) : l.get.call(this);
    },
    set: function(p) {
      y ? y.call(this, p, (f) => l.set.call(this, f)) : l.set.call(this, p);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Oe() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function Ht() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const h = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let l = 0; l < h.length; l++)
      h[l]();
  }
}
function Re() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function zt(h) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(h) : setTimeout(h, 0)) : h();
}
function H(h, l, b, y, p = {}) {
  const f = p.extraAttributes || [], u = p.onAttributeChange || null, o = p.onInit || null;
  function d(t) {
    const r = t || document.body;
    Bt(r, h, l, b), o && o(r);
  }
  st(function() {
    const t = new MutationObserver(function(n) {
      for (let c = 0; c < n.length; c++) {
        const m = n[c];
        if (m.type === "childList") {
          for (let g = 0; g < m.addedNodes.length; g++) {
            const i = m.addedNodes[g];
            i.nodeType === 1 && (Bt(i, h, l, b), o && o(i));
          }
          for (let g = 0; g < m.removedNodes.length; g++) {
            const i = m.removedNodes[g];
            if (i.nodeType === 1) {
              const s = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", _ = Array.from(i.querySelectorAll(s));
              i.matches && i.matches(s) && _.push(i);
              for (let v = 0; v < _.length; v++) {
                const S = _[v];
                if (!document.contains(S)) {
                  const w = S[l];
                  w && typeof w.destroy == "function" && w.destroy();
                }
              }
            }
          }
        } else m.type === "attributes" && (u && m.target[l] ? u(m.target, m.attributeName) : (Bt(m.target, h, l, b), o && o(m.target)));
      }
    });
    let r = [];
    if (h.indexOf("[") !== -1) {
      const n = /\[([\w-]+)/g;
      let c;
      for (; (c = n.exec(h)) !== null; )
        r.push(c[1]);
    } else
      r.push(h);
    t.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: r.concat(f)
    });
  }, y || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[l] = d;
  function e() {
    Re() > 0 ? zt(function() {
      d(document.body);
    }) : d(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e(), d;
}
function ue(h, l) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !l) return !1;
  const b = l.getAttribute("href");
  return !(!b || l.getAttribute("target") === "_blank" || l.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || l.hostname && l.hostname !== window.location.hostname);
}
function J(...h) {
  return h.filter((l) => l != null && l !== "").map((l, b) => b === 0 ? l.replace(/\/+$/, "") : l.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Et(h, l) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, l ? { Authorization: l } : null);
}
function he(h, l = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (b) {
    return console.error(`[${l}] Invalid headers JSON:`, b), {};
  }
}
const fe = {};
function Me(h, l) {
  fe[h] = l;
}
function Ne(h) {
  return fe[h] || { ingress: (l) => l, egress: (l) => l };
}
const me = {};
function $t(h, l) {
  if (!h || typeof l != "object") return;
  const b = h.toLowerCase().split("-")[0];
  me[b] = l;
}
function Lt(h) {
  if (!h) return null;
  const l = h.toLowerCase().split("-")[0];
  return me[l] || null;
}
$t("mk", {
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Me, window.lnCore.getDataMapper = Ne, window.lnCore.registerLocaleFallback = $t, window.lnCore.getLocaleFallback = Lt, window.lnCore.fillTemplate = wt, window.lnCore.fill = it, window.lnCore.lnFill = xe, window.lnCore.renderList = ke);
function Fe(h, l) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, h(), l && l();
    }));
  };
}
const Pe = "ln:";
let bt = null;
function pe() {
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
function Be() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function ge(h, l) {
  const b = l.getAttribute("data-ln-persist"), y = b !== null && b !== "" ? b : l.id;
  return y ? Pe + h + ":" + Be() + ":" + y : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', l), null);
}
function Mt(h, l) {
  if (!pe()) return null;
  const b = ge(h, l);
  if (!b) return null;
  try {
    const y = localStorage.getItem(b);
    return y !== null ? JSON.parse(y) : null;
  } catch {
    return null;
  }
}
function _t(h, l, b) {
  if (!pe()) return;
  const y = ge(h, l);
  if (y)
    try {
      b == null ? localStorage.removeItem(y) : localStorage.setItem(y, JSON.stringify(b));
    } catch {
    }
}
function _e(h) {
  return (h || "").replace(/^#/, "");
}
function Nt(h) {
  const l = h === void 0 ? location.hash : h, b = {}, y = _e(l);
  if (!y) return b;
  const p = y.split("&");
  for (let f = 0; f < p.length; f++) {
    const u = p[f];
    if (!u) continue;
    const o = u.indexOf(":"), d = o > -1 ? u.slice(0, o) : u, e = o > -1 ? u.slice(o + 1) : "";
    if (d)
      try {
        b[d] = decodeURIComponent(e);
      } catch {
        b[d] = e;
      }
  }
  return b;
}
function gt(h) {
  if (!h) return null;
  const l = Nt();
  return h in l ? l[h] : null;
}
function ot(h, l) {
  if (!h) return;
  const b = Nt();
  l == null ? delete b[h] : b[h] = String(l);
  const p = Object.keys(b).map(function(f) {
    const u = b[f];
    return u === "" ? f : f + ":" + encodeURIComponent(u);
  }).join("&");
  _e(location.hash) !== p && (location.hash = p);
}
function Yt(h) {
  return h.button === 1 || h.ctrlKey || h.metaKey || h.shiftKey ? !1 : (h.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Nt, window.lnCore.hashGet = gt, window.lnCore.hashSet = ot, window.lnCore.hashLinkClick = Yt);
function Ot(h, l, b, y) {
  const p = typeof y == "number" ? y : 4, f = window.innerWidth, u = window.innerHeight, o = l.width, d = l.height, e = (b || "bottom").split("-"), t = e[0], r = e[1] === "start" || e[1] === "end" ? e[1] : "center", n = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, c = n[t] || n.bottom;
  function m(_) {
    return _ === "top" || _ === "bottom" ? r === "start" ? h.left : r === "end" ? h.right - o : h.left + (h.width - o) / 2 : r === "start" ? h.top : r === "end" ? h.bottom - d : h.top + (h.height - d) / 2;
  }
  function g(_) {
    let v, S, w = !0;
    return _ === "top" ? (v = h.top - p - d, S = m(_), v < 0 && (w = !1)) : _ === "bottom" ? (v = h.bottom + p, S = m(_), v + d > u && (w = !1)) : _ === "left" ? (v = m(_), S = h.left - p - o, S < 0 && (w = !1)) : (v = m(_), S = h.right + p, S + o > f && (w = !1)), { top: v, left: S, side: _, fits: w };
  }
  let i = null;
  for (let _ = 0; _ < c.length; _++) {
    const v = g(c[_]);
    if (v.fits) {
      i = v;
      break;
    }
  }
  i || (i = g(c[0]));
  let a = i.top, s = i.left;
  return o >= f ? s = 0 : (s < 0 && (s = 0), s + o > f && (s = f - o)), d >= u ? a = 0 : (a < 0 && (a = 0), a + d > u && (a = u - d)), { top: a, left: s, placement: i.side };
}
function Kt(h) {
  if (!h) return { width: 0, height: 0 };
  const l = h.style, b = l.visibility, y = l.display, p = l.position;
  l.visibility = "hidden", l.display = "block", l.position = "fixed";
  const f = h.offsetWidth, u = h.offsetHeight;
  return l.visibility = b, l.display = y, l.position = p, { width: f, height: u };
}
let ft = null;
async function ee(h) {
  if (!h) {
    ft = null;
    return;
  }
  try {
    const l = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", l.encode(h));
    ft = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (l) {
    console.error("[ln-core/crypto] Key derivation failed:", l), ft = null;
  }
}
function pt() {
  return ft;
}
async function He(h, l = ft) {
  const b = l || ft;
  if (!b || h === void 0 || h === null) return h;
  try {
    const y = new TextEncoder(), p = crypto.getRandomValues(new Uint8Array(12)), f = typeof h == "string" ? h : JSON.stringify(h), u = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      b,
      y.encode(f)
    ), o = btoa(String.fromCharCode(...p)), d = btoa(String.fromCharCode(...new Uint8Array(u)));
    return {
      encrypted: !0,
      iv: o,
      data: d
    };
  } catch (y) {
    return console.error("[ln-core/crypto] Encryption failed:", y), h;
  }
}
async function Ue(h, l = ft) {
  const b = l || ft;
  if (!h || !h.encrypted || !b) return h;
  try {
    const y = new TextDecoder(), p = Uint8Array.from(atob(h.iv), (d) => d.charCodeAt(0)), f = Uint8Array.from(atob(h.data), (d) => d.charCodeAt(0)), u = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: p },
      b,
      f
    ), o = y.decode(u);
    try {
      return JSON.parse(o);
    } catch {
      return o;
    }
  } catch (y) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", y), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), l = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function y(e) {
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
  function o(e, t) {
    t = t || {};
    const r = y(e), n = p(e, t), c = f(r, n);
    u(n) && l.has(c) && (l.get(c).abort(), l.delete(c));
    const m = new AbortController(), g = t.signal;
    let i = null;
    g && (g.aborted ? m.abort(g.reason) : (i = function() {
      m.abort(g.reason);
    }, g.addEventListener("abort", i, { once: !0 })));
    const a = Object.assign({}, t, { signal: m.signal });
    return l.set(c, m), h(e, a).finally(function() {
      g && i && g.removeEventListener("abort", i), l.get(c) === m && l.delete(c);
    });
  }
  o.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = o;
  function d(e) {
    if (!e.detail || !e.detail.url) return;
    const t = e.target, r = (e.detail.method || (e.detail.body ? "POST" : "GET")).toUpperCase(), n = e.detail.key;
    n && b.has(n) && (b.get(n).abort(), b.delete(n));
    const c = new AbortController(), m = e.detail.signal;
    let g = null;
    m && (m.aborted ? c.abort(m.reason) : (g = function() {
      c.abort(m.reason);
    }, m.addEventListener("abort", g, { once: !0 }))), n && b.set(n, c);
    const i = { method: r, signal: c.signal };
    e.detail.body !== void 0 && (i.body = e.detail.body), window.fetch(e.detail.url, i).then(function(a) {
      m && g && m.removeEventListener("abort", g), n && b.get(n) === c && b.delete(n), A(t, "ln-http:response", {
        ok: a.ok,
        status: a.status,
        response: a
      });
    }).catch(function(a) {
      m && g && m.removeEventListener("abort", g), n && b.get(n) === c && b.delete(n), !(a && a.name === "AbortError") && A(t, "ln-http:error", {
        ok: !1,
        status: 0,
        error: a
      });
    });
  }
  document.addEventListener("ln-http:request", d), window.lnHttp = {
    cancel: function(e) {
      let t = !1;
      return l.forEach(function(r, n) {
        n.endsWith(" " + e) && (r.abort(), l.delete(n), t = !0);
      }), t;
    },
    cancelByKey: function(e) {
      return b.has(e) ? (b.get(e).abort(), b.delete(e), !0) : !1;
    },
    cancelAll: function() {
      l.forEach(function(e) {
        e.abort();
      }), l.clear(), b.forEach(function(e) {
        e.abort();
      }), b.clear();
    },
    get inflight() {
      const e = [];
      return l.forEach(function(t, r) {
        const n = r.indexOf(" ");
        e.push({ method: r.slice(0, n), url: r.slice(n + 1) });
      }), b.forEach(function(t, r) {
        e.push({ key: r });
      }), e;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", d), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "template[data-ln-include]", l = "lnInclude";
  if (window[l] !== void 0) return;
  const b = /* @__PURE__ */ new Map();
  function y(p) {
    if (this.dom = p, this.url = p.getAttribute("data-ln-include"), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Oe(), this._held = !0;
    const f = this, u = this.url;
    let o = b.get(u);
    return o || (o = fetch(u).then(function(d) {
      if (!d.ok)
        throw new Error("HTTP error! status: " + d.status);
      return d.text();
    }).catch(function(d) {
      throw b.delete(u), d;
    }), b.set(u, o)), o.then(function(d) {
      if (f._destroyed) return;
      const e = document.createElement("template");
      e.innerHTML = d, f.dom.content.appendChild(e.content), A(f.dom, "ln-include:loaded", { target: f.dom, url: f.url }), f._held && (f._held = !1, Ht());
    }).catch(function(d) {
      f._destroyed || (console.error("[ln-include] Failed to fetch template from " + f.url + ":", d), A(f.dom, "ln-include:error", { target: f.dom, url: f.url, error: d }), f._held && (f._held = !1, Ht()));
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[l] && (this._destroyed = !0, this._held && (this._held = !1, Ht()), delete this.dom[l]);
  }, H(h, l, y, "ln-include");
})();
(function() {
  const h = "data-ln-form", l = "lnForm", b = "data-ln-form-action-edit", y = "data-ln-form-action-method";
  if (window[l] !== void 0) return;
  function p(f) {
    this.dom = f, this._baseAction = f.getAttribute("action") || "";
    const u = this;
    return this._onLnFill = function(o) {
      o.target === u.dom && (o.detail ? (u.fill(o.detail), u._applyActionMode(o.detail)) : u.dom.reset());
    }, this._onReset = function() {
      u._applyActionMode(null);
    }, f.addEventListener("ln-fill", this._onLnFill), f.addEventListener("reset", this._onReset), this;
  }
  p.prototype.fill = function(f) {
    const u = ce(this.dom, f);
    for (let o = 0; o < u.length; o++) {
      const d = u[o], e = d.tagName === "SELECT" || d.type === "checkbox" || d.type === "radio";
      d.dispatchEvent(new Event(e ? "change" : "input", { bubbles: !0 }));
    }
  }, p.prototype._ensureMethodInput = function() {
    let f = this.dom.querySelector('input[name="_method"]');
    return f || (f = document.createElement("input"), f.type = "hidden", f.name = "_method", f.value = "", this.dom.appendChild(f)), f;
  }, p.prototype._applyActionMode = function(f) {
    if (!this.dom.hasAttribute(b)) return;
    const u = f && f.id != null && f.id !== "" ? f.id : null, o = this._ensureMethodInput();
    if (u !== null) {
      const d = this.dom.getAttribute(b);
      d ? this.dom.setAttribute("action", d.replace(":id", encodeURIComponent(u))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(u)), o.value = this.dom.getAttribute(y) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), o.value = "";
  }, p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), A(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[l]);
  }, H(h, l, p, "ln-form");
})();
(function() {
  const h = "data-ln-validate", l = "lnValidate", b = "data-ln-validate-errors", y = "data-ln-validate-error", p = "ln-validate-valid", f = "ln-validate-invalid", u = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[l] !== void 0) return;
  function o(d) {
    this.dom = d, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const e = this, t = d.tagName, r = d.type, n = t === "SELECT" || r === "checkbox" || r === "radio";
    this._onInput = function() {
      e._touched = !0, e.validate();
    }, this._onChange = function() {
      e._touched = !0, e.validate();
    }, this._onSetCustom = function(m) {
      const g = m.detail && m.detail.error;
      if (!g) return;
      e._customErrors.add(g), e._touched = !0;
      const i = d.closest(".form-element");
      if (i) {
        const a = i.querySelector("[" + y + '="' + g + '"]');
        a && a.classList.remove("hidden");
      }
      d.classList.remove(p), d.classList.add(f), d.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(m) {
      const g = m.detail && m.detail.error, i = d.closest(".form-element");
      if (g) {
        if (e._customErrors.delete(g), i) {
          const a = i.querySelector("[" + y + '="' + g + '"]');
          a && a.classList.add("hidden");
        }
      } else
        e._customErrors.forEach(function(a) {
          if (i) {
            const s = i.querySelector("[" + y + '="' + a + '"]');
            s && s.classList.add("hidden");
          }
        }), e._customErrors.clear();
      e._touched && e.validate();
    }, n || d.addEventListener("input", this._onInput), d.addEventListener("change", this._onChange), d.addEventListener("ln-validate:set-custom", this._onSetCustom), d.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const c = d.form;
    return c && (c.hasAttribute("novalidate") || c.setAttribute("novalidate", ""), this._onFormReset = function() {
      e.reset();
    }, this._onValidateRequest = function(m) {
      e._touched = !0, !e.validate() && m.detail && m.detail.invalidFields && m.detail.invalidFields.push(e.dom);
    }, c.addEventListener("reset", this._onFormReset), c.addEventListener("ln-validate:request-validate", this._onValidateRequest), c._lnValidateGateBound || (c._lnValidateGateBound = !0, c.addEventListener("submit", function(m) {
      const g = { invalidFields: [] };
      A(c, "ln-validate:request-validate", g), g.invalidFields.length > 0 && (m.preventDefault(), g.invalidFields.sort((i, a) => i.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), g.invalidFields[0].focus());
    }))), this;
  }
  o.prototype.validate = function() {
    const d = this.dom, e = d.validity, r = d.checkValidity() && this._customErrors.size === 0, n = d.closest(".form-element");
    if (n) {
      const m = n.querySelector("[" + b + "]");
      if (m) {
        const g = m.querySelectorAll("[" + y + "]");
        for (let i = 0; i < g.length; i++) {
          const a = g[i].getAttribute(y), s = u[a];
          s && (e[s] ? g[i].classList.remove("hidden") : g[i].classList.add("hidden"));
        }
      }
    }
    return d.classList.toggle(p, r), d.classList.toggle(f, !r), d.setAttribute("aria-invalid", r ? "false" : "true"), A(d, r ? "ln-validate:valid" : "ln-validate:invalid", { target: d, field: d.name }), r;
  }, o.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, f), this.dom.removeAttribute("aria-invalid");
    const d = this.dom.closest(".form-element");
    if (d) {
      const e = d.querySelectorAll("[" + y + "]");
      for (let t = 0; t < e.length; t++)
        e[t].classList.add("hidden");
    }
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), o.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const d = this.dom.form;
    d && (this._onFormReset && d.removeEventListener("reset", this._onFormReset), this._onValidateRequest && d.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(p, f), this.dom.removeAttribute("aria-invalid"), A(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[l];
  }, H(h, l, o, "ln-validate");
})();
(function() {
  const h = "data-ln-ajax", l = "lnAjax", b = "data-ln-form-scope";
  if (window[l] !== void 0) return;
  function y(r) {
    if (!r.hasAttribute(h) || r[l]) return;
    r[l] = !0;
    const n = d(r);
    p(n.links), f(n.forms);
  }
  function p(r) {
    for (const n of r) {
      if (n[l + "Trigger"] || n.hostname && n.hostname !== window.location.hostname) continue;
      const c = n.getAttribute("href");
      if (c && c.includes("#")) continue;
      const m = function(g) {
        if (!ue(g, n)) return;
        g.preventDefault();
        const i = n.getAttribute("href");
        i && o("GET", i, null, n);
      };
      n.addEventListener("click", m), n[l + "Trigger"] = m;
    }
  }
  function f(r) {
    for (const n of r) {
      if (n[l + "Trigger"]) continue;
      if (n.hasAttribute(b)) {
        n[l + "ScopeWarned"] || (n[l + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const c = function(m) {
        if (m.defaultPrevented) return;
        m.preventDefault();
        const g = n.method.toUpperCase(), i = n.action, a = new FormData(n);
        for (const s of n.querySelectorAll('button, input[type="submit"]'))
          s.disabled = !0;
        o(g, i, a, n, function() {
          for (const s of n.querySelectorAll('button, input[type="submit"]'))
            s.disabled = !1;
        });
      };
      n.addEventListener("submit", c), n[l + "Trigger"] = c;
    }
  }
  function u(r) {
    if (!r[l]) return;
    const n = d(r);
    for (const c of n.links)
      c[l + "Trigger"] && (c.removeEventListener("click", c[l + "Trigger"]), delete c[l + "Trigger"]);
    for (const c of n.forms)
      c[l + "Trigger"] && (c.removeEventListener("submit", c[l + "Trigger"]), delete c[l + "Trigger"]);
    delete r[l];
  }
  function o(r, n, c, m, g) {
    if (Y(m, "ln-ajax:before-start", { method: r, url: n }).defaultPrevented) return;
    A(m, "ln-ajax:start", { method: r, url: n }), m.classList.add("ln-ajax--loading");
    const a = document.createElement("span");
    a.className = "ln-ajax-spinner", m.appendChild(a);
    function s() {
      m.classList.remove("ln-ajax--loading");
      const C = m.querySelector(".ln-ajax-spinner");
      C && C.remove(), g && g();
    }
    let _ = n;
    const v = document.querySelector('meta[name="csrf-token"]'), S = v ? v.getAttribute("content") : null;
    c instanceof FormData && S && c.append("_token", S);
    const w = {
      method: r,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (S && (w.headers["X-CSRF-TOKEN"] = S), r === "GET" && c) {
      const C = new URLSearchParams(c);
      _ = n + (n.includes("?") ? "&" : "?") + C.toString();
    } else r !== "GET" && c && (w.body = c);
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
        A(m, "ln-ajax:success", { method: r, url: _, data: T });
      } else
        A(m, "ln-ajax:error", { method: r, url: _, status: C.status, data: T });
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
      A(m, "ln-ajax:complete", { method: r, url: _ }), s();
    }).catch(function(C) {
      A(m, "ln-ajax:error", { method: r, url: _, error: C }), A(m, "ln-ajax:complete", { method: r, url: _ }), s();
    });
  }
  function d(r) {
    const n = { links: [], forms: [] };
    return r.tagName === "A" && r.getAttribute(h) !== "false" ? n.links.push(r) : r.tagName === "FORM" && r.getAttribute(h) !== "false" ? n.forms.push(r) : (n.links = Array.from(r.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(r.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function e() {
    st(function() {
      new MutationObserver(function(n) {
        for (const c of n)
          if (c.type === "childList") {
            for (const m of c.addedNodes)
              if (m.nodeType === 1 && (y(m), !m.hasAttribute(h))) {
                for (const i of m.querySelectorAll("[" + h + "]"))
                  y(i);
                const g = m.closest && m.closest("[" + h + "]");
                if (g && g.getAttribute(h) !== "false") {
                  const i = d(m);
                  p(i.links), f(i.forms);
                }
              }
          } else c.type === "attributes" && y(c.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function t() {
    for (const r of document.querySelectorAll("[" + h + "]"))
      y(r);
  }
  window[l] = y, window[l].destroy = u, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
const be = {
  navigate: function(h) {
    Tt(h, { historyAction: "push" });
  },
  replace: function(h) {
    Tt(h, { historyAction: "replace" });
  },
  current: function() {
    return Vt ? {
      path: jt,
      params: Ee,
      query: we,
      route: Vt,
      regions: ve
    } : null;
  }
}, Xt = "data-ln-route", ye = "lnRoute";
typeof window < "u" && (window.lnRouter = be);
const lt = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new WeakMap();
let ve = /* @__PURE__ */ new Map(), ie = !1, jt = null, Ee = {}, we = {}, Vt = null, Gt = !1;
function re(h, l, b) {
  Gt ? queueMicrotask(function() {
    A(h, l, b);
  }) : A(h, l, b);
}
function Rt(h) {
  try {
    const f = new URL(h, window.location.origin);
    h = f.pathname + f.search + f.hash;
  } catch {
  }
  let [l] = h.split("#"), [b, y] = l.split("?");
  const p = {};
  if (y) {
    const f = new URLSearchParams(y);
    for (const [u, o] of f.entries())
      p[u] = o;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: p };
}
function Ae(h, l) {
  if (h.pattern === "*") return 1;
  if (l.pattern === "*") return -1;
  const b = h.segments, y = l.segments, p = Math.max(b.length, y.length);
  for (let f = 0; f < p; f++) {
    const u = b[f], o = y[f];
    if (u === void 0) return 1;
    if (o === void 0) return -1;
    if (u === "*") return 1;
    if (o === "*") return -1;
    const d = u.startsWith(":"), e = o.startsWith(":");
    if (d && !e) return 1;
    if (!d && e) return -1;
  }
  return 0;
}
function Se(h, l) {
  const b = h.split("/").filter(Boolean);
  for (const y of l) {
    if (y.pattern === "*")
      return {
        route: y,
        params: { wildcard: h }
      };
    const p = y.segments, f = {};
    let u = !0;
    if (!(b.length > p.length && p[p.length - 1] !== "*")) {
      for (let o = 0; o < p.length; o++) {
        const d = p[o], e = b[o];
        if (d === "*") {
          f.wildcard = b.slice(o).join("/");
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
      if (u && (p.indexOf("*") !== -1 || b.length <= p.length))
        return { route: y, params: f };
    }
  }
  return null;
}
function Wt(h, l) {
  if (h !== "__primary__") {
    const y = document.getElementById(l.target);
    return y || console.warn(`[ln-router] Explicit target element #${l.target} not found in DOM`), y;
  }
  const b = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return b || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), b;
}
function ze(h) {
  if (!h) return;
  const l = Array.from(h.querySelectorAll("*")), b = [h].concat(l);
  for (const p of b)
    for (const f of Object.keys(p))
      if (f.startsWith("ln") && p[f] && typeof p[f].destroy == "function")
        try {
          p[f].destroy();
        } catch (u) {
          console.error(`[ln-router] Error destroying component ${f} on element:`, p, u);
        }
  const y = document.querySelectorAll('[data-ln-popover="open"]');
  for (const p of y) {
    const f = p.lnPopover;
    if (f && f.trigger && h.contains(f.trigger))
      try {
        f.destroy();
      } catch (u) {
        console.error("[ln-router] Error destroying open popover:", u);
      }
  }
}
function Tt(h, l = {}) {
  const { path: b, query: y } = Rt(h), p = /* @__PURE__ */ new Map();
  for (const [t, r] of lt)
    p.set(t, Se(b, r.sorted));
  const f = lt.has("__primary__"), u = p.get("__primary__");
  if (f && !u) {
    re(document.body, "ln-router:not-found", { path: b });
    return;
  }
  let o = null;
  if (u && (o = Wt("__primary__", u.route), !o || Y(o, "ln-router:before-navigate", {
    from: jt,
    to: h,
    params: u.params,
    query: y
  }).defaultPrevented))
    return;
  const d = [];
  for (const [t, r] of p) {
    if (!r) continue;
    const n = Wt(t, r.route);
    n && (t !== "__primary__" && n.hasAttribute("data-ln-route-keep") && ne.get(n) === r.route.templateNode || d.push({ regionKey: t, match: r, targetEl: n }));
  }
  l.historyAction === "push" ? window.history.pushState(null, "", h) : l.historyAction === "replace" && window.history.replaceState(null, "", h);
  const e = function() {
    for (const { regionKey: t, match: r, targetEl: n } of d) {
      if (!(l.isHydration && n.hasAttribute("data-ln-router-hydrate") && n.children.length > 0)) {
        ze(n);
        const m = r.route.templateNode.content.cloneNode(!0);
        n.replaceChildren(m);
      }
      if (ne.set(n, r.route.templateNode), t === "__primary__" && (r.route.title && (document.title = r.route.title), !l.isHydration)) {
        n.hasAttribute("tabindex") || n.setAttribute("tabindex", "-1");
        const m = n.querySelector("h1, h2, h3, h4, h5, h6");
        m ? (m.setAttribute("tabindex", "-1"), m.focus()) : n.focus(), n.scrollIntoView({ block: "start", behavior: "instant" });
      }
      re(n, "ln-router:navigated", {
        path: h,
        params: r.params,
        query: y,
        route: r.route,
        target: n,
        region: t
      });
    }
    u && (jt = h, Ee = u.params, we = y, Vt = u.route), ve = new Map(
      Array.from(p.entries()).map(([t, r]) => [t, r ? { route: r.route, params: r.params } : null])
    );
  };
  document.startViewTransition && !l.isHydration ? document.startViewTransition(e) : e();
}
function Ke(h) {
  const l = h.target.closest("a");
  if (!l || !ue(h, l)) return;
  const b = l.getAttribute("href"), { path: y } = Rt(b), p = lt.get("__primary__");
  if (!p) return;
  Se(y, p.sorted) && (h.preventDefault(), Tt(b, { historyAction: "push" }));
}
function je(h, l) {
  const b = Object.keys(h), y = Object.keys(l);
  if (b.length !== y.length) return !1;
  for (let p = 0; p < b.length; p++) {
    const f = b[p];
    if (h[f] !== l[f]) return !1;
  }
  return !0;
}
function Ve() {
  const h = window.location.pathname + window.location.search, l = be.current();
  if (l && l.path != null) {
    const b = Rt(h);
    if (Rt(l.path).path === b.path && je(l.query, b.query))
      return;
  }
  Tt(h, { historyAction: "skip" });
}
function Ge() {
  ie || (ie = !0, st(function() {
    document.addEventListener("click", Ke), window.addEventListener("popstate", Ve), Gt = !0;
    const h = window.location.pathname + window.location.search + window.location.hash;
    Tt(h, { historyAction: "replace", isHydration: !0 }), Gt = !1;
  }, "ln-router"));
}
function We(h) {
  const l = h.getAttribute(Xt);
  if (!l) return;
  const b = h.getAttribute("data-ln-route-target") || null;
  if (b === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${l}" rejected.`);
    return;
  }
  const y = b || "__primary__";
  lt.has(y) || lt.set(y, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const p = lt.get(y);
  if (p.routes.has(l)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${l}" in region "${y}"`);
    return;
  }
  const f = h.getAttribute("data-ln-route-title"), u = l.split("/").filter(Boolean), o = {
    pattern: l,
    segments: u,
    target: b,
    title: f,
    templateNode: h
  }, d = Wt(y, o);
  d && d.contains(h) && console.warn(`[ln-router] Route template with pattern "${l}" is declared inside its own outlet element:`, h), p.routes.set(l, o), p.sorted = Array.from(p.routes.values()).sort(Ae);
}
function Qe(h) {
  const l = h.getAttribute(Xt);
  if (!l) return;
  const y = h.getAttribute("data-ln-route-target") || null || "__primary__", p = lt.get(y);
  p && (p.routes.delete(l), p.sorted = Array.from(p.routes.values()).sort(Ae), p.routes.size === 0 && lt.delete(y));
}
function Ce(h) {
  return this.dom = h, We(h), this;
}
Ce.prototype.destroy = function() {
  Qe(this.dom), delete this.dom[ye];
};
H(Xt, ye, Ce, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    lt.size > 0 && Ge();
  }
});
(function() {
  const h = "data-ln-modal", l = "lnModal";
  if (window[l] !== void 0) return;
  function b(p) {
    this.dom = p, this.isOpen = p.getAttribute(h) === "open";
    const f = this;
    return this._onRequestOpen = function() {
      f.dom.setAttribute(h, "open");
    }, this._onRequestClose = function() {
      f.dom.setAttribute(h, "close");
    }, this._onCancel = function(u) {
      u.preventDefault(), f.dom.setAttribute(h, "close");
    }, this._onClickClose = function(u) {
      const o = u.target.closest("[data-ln-modal-close]");
      o && f.dom.contains(o) && (u.preventDefault(), f.dom.setAttribute(h, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  b.prototype.destroy = function() {
    if (this.dom[l]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const p = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + h + '="open"]'),
          function(u) {
            return u !== p;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      A(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[l];
    }
  };
  function y(p) {
    const f = p[l];
    if (!f) return;
    const o = p.getAttribute(h) === "open";
    if (o !== f.isOpen)
      if (o) {
        if (Y(p, "ln-modal:before-open", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(h, "close");
          return;
        }
        f.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof p.showModal == "function" && p.showModal();
        const e = p.querySelector("[autofocus]");
        if (e && Dt(e))
          e.focus();
        else {
          const t = p.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), r = Array.prototype.find.call(t, Dt);
          if (r) r.focus();
          else {
            const n = p.querySelectorAll("a[href], button:not([disabled])"), c = Array.prototype.find.call(n, Dt);
            c && c.focus();
          }
        }
        A(p, "ln-modal:open", { modalId: p.id, target: p });
      } else {
        if (Y(p, "ln-modal:before-close", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(h, "open");
          return;
        }
        f.isOpen = !1, A(p, "ln-modal:close", { modalId: p.id, target: p }), typeof p.close == "function" && p.close(), document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  H(h, l, b, "ln-modal", {
    onAttributeChange: y
  });
})();
(function() {
  const h = "data-ln-modal-coordinator", l = "lnModalCoordinator";
  if (window[l] !== void 0) return;
  function b(r, n) {
    if (n) {
      if (r) {
        const m = r.closest("[" + h + "]");
        if (m) {
          if (m.id === n && m.hasAttribute("data-ln-modal")) return m;
          const g = m.querySelector("#" + CSS.escape(n) + '[data-ln-modal], [data-ln-modal="' + n + '"]');
          if (g) return g;
        }
      }
      const c = document.getElementById(n) || document.querySelector('[data-ln-modal="' + n + '"]');
      if (c) return c;
    }
    if (r) {
      const c = r.closest("[" + h + "]");
      if (c) {
        if (c.hasAttribute("data-ln-modal")) return c;
        const g = c.querySelector("[data-ln-modal]");
        if (g) return g;
      }
      const m = r.closest("[data-ln-modal]");
      if (m) return m;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function y(r, n) {
    if (r !== "edit") return "";
    if (n) {
      const c = n.getAttribute("data-ln-fill-id");
      if (c) return c;
    }
    return "edit";
  }
  function p(r) {
    if (!r) return;
    const n = r.querySelectorAll("[data-ln-field]");
    for (let m = 0; m < n.length; m++)
      n[m].textContent = "";
    const c = r.querySelectorAll("form");
    for (let m = 0; m < c.length; m++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(c[m], null) : c[m].reset();
  }
  document.addEventListener("submit", function(r) {
    if (r.defaultPrevented) return;
    const c = r.target.closest("[data-ln-modal]");
    if (c && c.id) {
      try {
        sessionStorage.setItem("ln-modal-pending:" + c.id, "true");
      } catch {
      }
      ot(c.id, null);
    }
  }), document.addEventListener("click", function(r) {
    if (r.ctrlKey || r.metaKey || r.button === 1) return;
    const n = r.target.closest("[data-ln-modal-for]");
    if (n) {
      const m = n.getAttribute("data-ln-modal-for"), g = b(n, m);
      if (g && g.lnModal) {
        r.preventDefault();
        const i = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, a = {}, s = n.dataset;
        for (const S in s) {
          if (!S.startsWith("lnModal") || i[S]) continue;
          const w = S.slice(7);
          w && (a[w.charAt(0).toLowerCase() + w.slice(1)] = s[S]);
        }
        const _ = Object.keys(a).length > 0;
        n.hasAttribute("data-ln-modal-mode") ? g.dataset.lnModalMode = n.getAttribute("data-ln-modal-mode") : g.dataset.lnModalMode = _ ? "edit" : "new", _ && window.lnCore && typeof window.lnCore.fill == "function" ? window.lnCore.fill(g, a) : g.dataset.lnModalMode === "new" && p(g), g.getAttribute("data-ln-modal") === "open" ? A(g, "ln-modal:request-close", {}) : (g.id && ot(g.id, y(g.dataset.lnModalMode, n)), A(g, "ln-modal:request-open", {}));
      }
      return;
    }
    const c = r.target.closest('a[href^="#"]');
    if (c) {
      const m = Nt(c.getAttribute("href"));
      for (const g in m) {
        const i = document.getElementById(g);
        if (i && i.lnModal) {
          if (!Yt(r)) return;
          ot(g, m[g]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(r) {
    const n = r.target;
    if (!n || !n.lnModal) return;
    (n.dataset.lnModalMode || "new") === "new" && p(n);
  }), document.addEventListener("ln-modal:open", function(r) {
    const n = r.target;
    if (!n || !n.lnModal || !n.id) return;
    let c = gt(n.id);
    c === null && (c = y(n.dataset.lnModalMode, null), ot(n.id, c)), c ? (n.dataset.lnModalMode = "edit", n.dispatchEvent(new CustomEvent("ln-fill:request", {
      bubbles: !0,
      detail: { id: c }
    }))) : (n.dataset.lnModalMode = "new", p(n));
  });
  let f = !1;
  function u() {
    if (!f) {
      f = !0;
      try {
        const r = document.querySelectorAll("[data-ln-modal][id]");
        for (let n = 0; n < r.length; n++) {
          const c = r[n];
          if (!c.lnModal) continue;
          const m = c.id, g = "ln-modal-pending:" + m;
          let i = !1;
          try {
            i = sessionStorage.getItem(g) === "true";
          } catch {
          }
          if (i) {
            try {
              sessionStorage.removeItem(g);
            } catch {
            }
            if (!!(document.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger") || c.querySelector(".has-error, [data-ln-validate-error], .form-error, .alert-danger"))) {
              c.dataset.lnModalMode = "edit", A(c, "ln-modal:request-open", {});
              continue;
            } else {
              ot(m, null), A(c, "ln-modal:request-close", {}), p(c);
              continue;
            }
          }
          const a = gt(m), s = a !== null, _ = c.lnModal.isOpen;
          if (s) {
            const v = a ? "edit" : "new";
            c.dataset.lnModalMode = v, _ ? a ? c.dispatchEvent(new CustomEvent("ln-fill:request", {
              bubbles: !0,
              detail: { id: a }
            })) : p(c) : A(c, "ln-modal:request-open", {});
          } else _ && A(c, "ln-modal:request-close", {});
        }
      } finally {
        f = !1;
      }
    }
  }
  function o() {
    const r = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let n = 0; n < r.length; n++) {
      const c = r[n];
      c.lnModal && gt(c.id) === null && ot(c.id, y(c.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", u);
  function d() {
    o(), u();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    zt(d);
  }) : zt(d);
  function e(r) {
    const n = r.target.closest("[data-ln-modal]");
    if (!(!n || !n.lnModal)) {
      if (n.id) {
        try {
          sessionStorage.removeItem("ln-modal-pending:" + n.id);
        } catch {
        }
        ot(n.id, null);
      }
      A(n, "ln-modal:request-close", {}), p(n);
    }
  }
  document.addEventListener("ln-form:success", e), document.addEventListener("ln-ajax:success", e), document.addEventListener("ln-modal:close", function(r) {
    const n = r.target;
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
  function t(r) {
    return this.dom = r, this;
  }
  t.prototype.destroy = function() {
    this.dom[l] && delete this.dom[l];
  }, H(h, l, t, "ln-modal-coordinator");
})();
(function() {
  const h = "data-ln-number", l = "lnNumber";
  if (window[l] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(e) {
    if (!b[e]) {
      const t = new Intl.NumberFormat(e, { useGrouping: !0 }), r = t.formatToParts(1234.5);
      let n = "", c = ".";
      for (let m = 0; m < r.length; m++)
        r[m].type === "group" && (n = r[m].value), r[m].type === "decimal" && (c = r[m].value);
      b[e] = { fmt: t, groupSep: n, decimalSep: c };
    }
    return b[e];
  }
  function f(e, t, r) {
    if (r !== null) {
      const n = parseInt(r, 10), c = e + "|d" + n;
      return b[c] || (b[c] = new Intl.NumberFormat(e, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: n })), b[c].format(t);
    }
    return p(e).fmt.format(t);
  }
  function u(e) {
    if (e[l]) return e[l];
    if (e[l] = this, this.dom = e, e.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const t = document.createElement("input");
    t.type = "hidden", t.name = e.name, e.removeAttribute("name"), e.hasAttribute("data-ln-fill-as") && t.setAttribute("data-ln-fill-as", e.getAttribute("data-ln-fill-as")), e.type = "text", e.setAttribute("inputmode", "decimal"), e.insertAdjacentElement("afterend", t), this._hidden = t;
    const r = this;
    Object.defineProperty(t, "value", {
      get: function() {
        return y.get.call(t);
      },
      set: function(c) {
        y.set.call(t, c), c !== "" && !isNaN(parseFloat(c)) ? r._setDisplayRaw(f(W(r.dom), parseFloat(c), r.dom.getAttribute("data-ln-number-decimals"))) : r._setDisplayRaw(""), r.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), de(e, y, {
      get: function() {
        return y.get.call(e);
      },
      set: function(c) {
        if (c === "") {
          r._setDisplayRaw(""), r._setHiddenRaw(""), e.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const m = typeof c == "number" ? c : parseFloat(String(c).replace(/[^\d.-]/g, ""));
        isNaN(m) ? (r._setDisplayRaw(String(c)), r._setHiddenRaw("")) : (r._setHiddenRaw(m), r._setDisplayRaw(f(W(e), m, e.getAttribute("data-ln-number-decimals")))), e.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      r._handleInput();
    }, e.addEventListener("input", this._onInput), this._onPaste = function(c) {
      c.preventDefault();
      const m = (c.clipboardData || window.clipboardData).getData("text"), g = p(W(e)), i = g.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let a = m.replace(new RegExp("[^0-9\\-" + i + ".]", "g"), "");
      g.groupSep && (a = a.split(g.groupSep).join("")), g.decimalSep !== "." && (a = a.replace(g.decimalSep, "."));
      const s = parseFloat(a);
      r.value = isNaN(s) ? NaN : s;
    }, e.addEventListener("paste", this._onPaste);
    const n = e.value;
    if (n !== "") {
      const c = parseFloat(n);
      isNaN(c) || (this._setHiddenRaw(c), this._setDisplayRaw(f(W(e), c, e.getAttribute("data-ln-number-decimals"))), e.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  function o(e) {
    if (typeof e == "number") return isNaN(e) ? null : e;
    if (!e || typeof e != "string") return null;
    let t = e.trim();
    if (t === "") return null;
    t = t.replace(/[\s\u00A0$€£]/g, ""), t.indexOf(",") !== -1 && t.indexOf(".") !== -1 ? t.indexOf(".") < t.indexOf(",") ? t = t.replace(/\./g, "").replace(",", ".") : t = t.replace(/,/g, "") : t.indexOf(",") !== -1 && (t = t.replace(",", ".")), t = t.replace(/[^\d.-]/g, "");
    const r = parseFloat(t);
    return isNaN(r) ? null : r;
  }
  u.prototype._initTextElement = function() {
    const e = this.dom;
    let t = e.getAttribute("data-ln-value"), r = e.getAttribute("data-ln-number"), n = null;
    t !== null && t !== "" ? n = t : r !== null && r !== "" && r !== "true" ? n = r : n = e.textContent.trim();
    const c = o(n);
    c !== null ? (this._rawValue = c, e.hasAttribute("data-ln-value") || e.setAttribute("data-ln-value", String(c)), this._formatTextContent()) : this._rawValue = null;
  }, u.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const e = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = f(W(this.dom), this._rawValue, e);
    }
  }, u.prototype._handleInput = function() {
    const e = this.dom, t = p(W(e)), r = y.get.call(e);
    if (r === "") {
      this._setHiddenRaw(""), A(e, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (r === "-") {
      this._setHiddenRaw("");
      return;
    }
    const n = e.selectionStart;
    let c = 0;
    for (let C = 0; C < n; C++)
      /[0-9]/.test(r[C]) && c++;
    let m = r;
    if (t.groupSep && (m = m.split(t.groupSep).join("")), m = m.replace(t.decimalSep, "."), r.endsWith(t.decimalSep) || r.endsWith(".")) {
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
    const i = e.getAttribute("data-ln-number-decimals");
    if (i !== null && g !== -1) {
      const C = parseInt(i, 10);
      m.slice(g + 1).length > C && (m = m.slice(0, g + 1 + C));
    }
    const a = parseFloat(m);
    if (isNaN(a)) return;
    const s = e.getAttribute("data-ln-number-min"), _ = e.getAttribute("data-ln-number-max");
    if (s !== null && a < parseFloat(s) || _ !== null && a > parseFloat(_)) return;
    let v;
    if (i !== null)
      v = f(W(e), a, i);
    else {
      const C = g !== -1 ? m.slice(g + 1).length : 0;
      if (C > 0) {
        const T = W(e) + "|u" + C;
        b[T] || (b[T] = new Intl.NumberFormat(W(e), { useGrouping: !0, minimumFractionDigits: C, maximumFractionDigits: C })), v = b[T].format(a);
      } else
        v = t.fmt.format(a);
    }
    this._setDisplayRaw(v);
    let S = c, w = 0;
    for (let C = 0; C < v.length && S > 0; C++)
      w = C + 1, /[0-9]/.test(v[C]) && S--;
    S > 0 && (w = v.length), e.setSelectionRange(w, w), this._setHiddenRaw(a), A(e, "ln-number:input", { value: a, formatted: v });
  }, u.prototype._setHiddenRaw = function(e) {
    this._hidden && y.set.call(this._hidden, String(e));
  }, u.prototype._setDisplayRaw = function(e) {
    this.isTextElement ? this.dom.textContent = String(e) : y.set.call(this.dom, String(e));
  }, u.prototype._displayFormatted = function(e) {
    this.isTextElement ? this._formatTextContent() : this._setDisplayRaw(f(W(this.dom), e, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(u.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const e = y.get.call(this._hidden);
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
      return this.isTextElement ? this.dom.textContent : y.get.call(this.dom);
    }
  }), u.prototype.destroy = function() {
    this.dom[l] && (this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), A(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function d() {
    new MutationObserver(function() {
      const e = document.querySelectorAll("[" + h + "]");
      for (let t = 0; t < e.length; t++) {
        const r = e[t][l];
        r && (r.isTextElement ? r._formatTextContent() : isNaN(r.value) || r._displayFormatted(r.value));
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(h, l, u, "ln-number", {
    extraAttributes: [
      "data-ln-value",
      "data-ln-number-decimals",
      "data-ln-number-min",
      "data-ln-number-max",
      "lang"
    ],
    onAttributeChange: function(e) {
      const t = e[l];
      t && (t.isTextElement ? t._initTextElement() : isNaN(t.value) || t._displayFormatted(t.value));
    }
  }), d();
})();
(function() {
  const h = "data-ln-date", l = "lnDate";
  if (window[l] !== void 0) return;
  const b = {}, y = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(s, _) {
    const v = s + "|" + JSON.stringify(_);
    return b[v] || (b[v] = new Intl.DateTimeFormat(s, _)), b[v];
  }
  const f = /^(short|medium|long)(\s+datetime)?$/, u = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function o(s) {
    return !s || s === "" ? { dateStyle: "medium" } : s.match(f) ? u[s] : null;
  }
  function d(s, _, v) {
    const S = s.getDate(), w = s.getMonth(), C = s.getFullYear(), T = s.getHours(), q = s.getMinutes();
    let x, I;
    const D = Lt(v), M = (v || "").toLowerCase().split("-")[0], z = p(v, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0], Q = D && z !== M;
    Q && D.monthsLong ? x = D.monthsLong[w] : x = p(v, { month: "long" }).format(s), Q && D.monthsShort ? I = D.monthsShort[w] : I = p(v, { month: "short" }).format(s);
    const ct = {
      yyyy: String(C),
      yy: String(C).slice(-2),
      MMMM: x,
      MMM: I,
      MM: String(w + 1).padStart(2, "0"),
      M: String(w + 1),
      dd: String(S).padStart(2, "0"),
      d: String(S),
      HH: String(T).padStart(2, "0"),
      mm: String(q).padStart(2, "0")
    };
    return _.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(at) {
      return ct[at];
    });
  }
  function e(s, _, v) {
    const S = o(_);
    if (S) {
      const w = p(v, S), C = (v || "").toLowerCase().split("-")[0], T = w.resolvedOptions().locale.toLowerCase().split("-")[0];
      return Lt(v) && T !== C ? d(s, "dd.MM.yyyy", v) : w.format(s);
    }
    return d(s, _, v);
  }
  function t(s) {
    if (!s) return "";
    const _ = s.getFullYear(), v = String(s.getMonth() + 1).padStart(2, "0"), S = String(s.getDate()).padStart(2, "0");
    return _ + "-" + v + "-" + S;
  }
  function r(s, _, v) {
    A(s.dom, "ln-date:change", {
      value: _,
      formatted: s.dom.value,
      date: v
    }), s.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function n(s, _, v, S) {
    s._setHiddenRaw(_), y.set.call(s._picker, _), s._lastISO = _, S !== void 0 ? (s._isFormatting = !0, s.dom.value = S, s._isFormatting = !1) : v && s._displayFormatted(v), r(s, _, v);
  }
  function c(s) {
    s._setHiddenRaw(""), y.set.call(s._picker, ""), s._isFormatting = !0, s.dom.value = "", s._isFormatting = !1, s._lastISO = "", r(s, "", null);
  }
  m.prototype._initTextElement = function() {
    const s = this.dom;
    let _ = s.getAttribute("data-ln-value"), v = s.getAttribute("data-ln-date"), S = s.getAttribute("datetime"), w = null;
    _ !== null && _ !== "" ? w = _ : S !== null && S !== "" ? w = S : v !== null && v !== "" && v !== "true" && !f.test(v) ? w = v : w = s.textContent.trim();
    let C = g(w) || i(w);
    if (!C && w)
      if (isNaN(w))
        C = new Date(w);
      else {
        const T = Number(w);
        C = new Date(T > 1e11 ? T : T * 1e3);
      }
    if (C && !isNaN(C.getTime())) {
      const T = t(C);
      this._rawValue = T, s.hasAttribute("data-ln-value") || s.setAttribute("data-ln-value", T), this._formatTextContent();
    } else
      this._rawValue = null;
  }, m.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const s = g(this._rawValue);
      if (s) {
        let v = this.dom.getAttribute("data-ln-date-format");
        if (!v) {
          const w = this.dom.getAttribute("data-ln-date");
          w && f.test(w) && (v = w);
        }
        const S = W(this.dom);
        this.dom.textContent = e(s, v || "medium", S);
      }
    }
  };
  function m(s) {
    if (s[l]) return s[l];
    if (s[l] = this, this.dom = s, s.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const _ = this, v = s.value, S = s.name, C = (s.closest(".form-element, form") || s.parentNode).querySelectorAll("[data-ln-date-dict]");
    for (let D = 0; D < C.length; D++) {
      const M = C[D].getAttribute("data-ln-date-dict");
      if (M) {
        const F = Qt(C[D], "data-ln-date-dict-key");
        F["months-long"] && (F.monthsLong = F["months-long"].split(",").map((z) => z.trim())), F["months-short"] && (F.monthsShort = F["months-short"].split(",").map((z) => z.trim())), $t(M, F);
      }
    }
    const T = document.createElement("span");
    T.setAttribute("data-ln-date-field", ""), s.parentNode.insertBefore(T, s), T.appendChild(s), this._wrapper = T;
    const q = document.createElement("input");
    q.type = "hidden", q.name = S, s.removeAttribute("name"), s.hasAttribute("data-ln-fill-as") && q.setAttribute("data-ln-fill-as", s.getAttribute("data-ln-fill-as")), s.insertAdjacentElement("afterend", q), this._hidden = q;
    const x = document.createElement("input");
    x.type = "date", x.tabIndex = -1, x.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", q.insertAdjacentElement("afterend", x), this._picker = x, s.type = "text";
    const I = document.createElement("button");
    if (I.type = "button", I.setAttribute("aria-label", s.getAttribute("data-ln-date-label") || "Open date picker"), I.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', x.insertAdjacentElement("afterend", I), this._btn = I, this._lastISO = "", Object.defineProperty(q, "value", {
      get: function() {
        return y.get.call(q);
      },
      set: function(D) {
        if (y.set.call(q, D), D && D !== "") {
          const M = g(D);
          M && n(_, D, M);
        } else D === "" && c(_);
      }
    }), de(s, y, {
      get: function() {
        return y.get.call(s);
      },
      set: function(D, M) {
        if (_._isFormatting) {
          M(D);
          return;
        }
        if (!D || D === "") {
          M(""), c(_);
          return;
        }
        const F = g(D) || i(D);
        if (F) {
          const z = t(F), Q = s.getAttribute(h) || "", ct = W(s), at = e(F, Q, ct);
          M(at), n(_, z, F, at);
        } else
          M(String(D)), c(_);
      }
    }), this._onPickerChange = function() {
      const D = x.value;
      if (D) {
        const M = g(D);
        M && n(_, D, M);
      } else
        c(_);
    }, x.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const D = _.dom.value.trim();
      if (D === "") {
        _._lastISO !== "" && c(_);
        return;
      }
      if (_._lastISO) {
        const F = g(_._lastISO);
        if (F) {
          const z = _.dom.getAttribute(h) || "", Q = W(_.dom);
          if (D === e(F, z, Q)) return;
        }
      }
      const M = i(D);
      if (M) {
        const F = t(M);
        n(_, F, M);
      } else if (_._lastISO) {
        const F = g(_._lastISO);
        F && _._displayFormatted(F);
      } else
        _.dom.value = "";
    }, s.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      _._openPicker();
    }, I.addEventListener("click", this._onBtnClick), v && v !== "") {
      const D = g(v);
      D && n(_, v, D);
    }
    return this;
  }
  function g(s) {
    if (!s || typeof s != "string") return null;
    const _ = s.split("T"), v = _[0].split("-");
    if (v.length < 3) return null;
    const S = parseInt(v[0], 10), w = parseInt(v[1], 10) - 1, C = parseInt(v[2], 10);
    if (isNaN(S) || isNaN(w) || isNaN(C)) return null;
    let T = 0, q = 0;
    if (_[1]) {
      const I = _[1].split(":");
      T = parseInt(I[0], 10) || 0, q = parseInt(I[1], 10) || 0;
    }
    const x = new Date(S, w, C, T, q);
    return x.getFullYear() !== S || x.getMonth() !== w || x.getDate() !== C ? null : x;
  }
  function i(s) {
    if (!s || typeof s != "string" || (s = s.trim(), s.length < 6)) return null;
    let _, v;
    if (s.indexOf(".") !== -1)
      _ = ".", v = s.split(".");
    else if (s.indexOf("/") !== -1)
      _ = "/", v = s.split("/");
    else if (s.indexOf("-") !== -1)
      _ = "-", v = s.split("-");
    else
      return null;
    if (v.length !== 3) return null;
    const S = [];
    for (let x = 0; x < 3; x++) {
      const I = parseInt(v[x], 10);
      if (isNaN(I)) return null;
      S.push(I);
    }
    let w, C, T;
    _ === "." ? (w = S[0], C = S[1], T = S[2]) : _ === "/" ? (C = S[0], w = S[1], T = S[2]) : v[0].length === 4 ? (T = S[0], C = S[1], w = S[2]) : (w = S[0], C = S[1], T = S[2]), T < 100 && (T += T < 50 ? 2e3 : 1900);
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
  }, m.prototype._setHiddenRaw = function(s) {
    y.set.call(this._hidden, s);
  }, m.prototype._displayFormatted = function(s) {
    const _ = this.dom.getAttribute(h) || "", v = W(this.dom);
    this._isFormatting = !0, this.dom.value = e(s, _, v), this._isFormatting = !1;
  }, Object.defineProperty(m.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : y.get.call(this._hidden);
    },
    set: function(s) {
      if (this.isTextElement) {
        if (!s || s === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.textContent = "";
          return;
        }
        const v = g(s) || i(s);
        if (!v) return;
        const S = t(v);
        this._rawValue = S, this.dom.setAttribute("data-ln-value", S), this._formatTextContent();
        return;
      }
      if (!s || s === "") {
        c(this);
        return;
      }
      const _ = g(s);
      _ && n(this, s, _);
    }
  }), Object.defineProperty(m.prototype, "date", {
    get: function() {
      const s = this.value;
      return s ? g(s) : null;
    },
    set: function(s) {
      if (!s || !(s instanceof Date) || isNaN(s.getTime())) {
        this.value = "";
        return;
      }
      this.value = t(s);
    }
  }), Object.defineProperty(m.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), m.prototype.destroy = function() {
    if (!this.dom[l]) return;
    if (this.isTextElement) {
      A(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[l];
      return;
    }
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const s = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", s && (this.dom.value = s), A(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[l];
  };
  function a() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + h + "]");
      for (let _ = 0; _ < s.length; _++) {
        const v = s[_][l];
        if (v) {
          if (v.isTextElement)
            v._formatTextContent();
          else if (v.value) {
            const S = g(v.value);
            S && v._displayFormatted(S);
          }
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(h, l, m, "ln-date", {
    extraAttributes: ["data-ln-date-format", "data-ln-date-locale", "data-ln-value", "datetime", "lang"],
    onAttributeChange: function(s) {
      const _ = s[l];
      if (_) {
        if (_.isTextElement)
          _._initTextElement();
        else if (_.value) {
          const v = g(_.value);
          v && _._displayFormatted(v);
        }
      }
    }
  }), a();
})();
(function() {
  const h = "data-ln-nav", l = "lnNav";
  if (window[l] !== void 0) return;
  const b = [];
  if (!history._lnNavPatched) {
    const u = history.pushState;
    history.pushState = function() {
      u.apply(history, arguments);
      for (const o of b)
        o();
    }, history._lnNavPatched = !0;
  }
  function y(u) {
    return this.dom = u, this.activeClass = u.getAttribute(h) || "active", this.exact = u.hasAttribute("data-ln-nav-exact"), this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), b.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(u, { childList: !0, subtree: !0 }), this.update(), this;
  }
  y.prototype.update = function() {
    if (!this.activeClass || Y(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const o = Array.from(this.dom.querySelectorAll("a")), d = window.location.pathname, e = p(d);
    for (const t of o) {
      const r = t.getAttribute("href");
      if (!r || r === "#" || r.startsWith("#") || r.startsWith("javascript:") || r.startsWith("mailto:") || r.startsWith("tel:")) {
        t.classList.remove(this.activeClass), t.removeAttribute("aria-current");
        continue;
      }
      if (t.hostname && t.hostname !== window.location.hostname) {
        t.classList.remove(this.activeClass), t.removeAttribute("aria-current");
        continue;
      }
      const n = p(r), c = n === e, m = !this.exact && n !== "/" && e.startsWith(n + "/");
      c || m ? (t.classList.add(this.activeClass), t.setAttribute("aria-current", "page")) : (t.classList.remove(this.activeClass), t.removeAttribute("aria-current"));
    }
    A(this.dom, "ln-nav:update", { target: this.dom });
  }, y.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const u = b.indexOf(this.updateHandler);
    u !== -1 && b.splice(u, 1), A(this.dom, "ln-nav:destroyed", { target: this.dom }), delete this.dom[l];
  };
  function p(u) {
    try {
      return new URL(u, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return u.replace(/\/$/, "") || "/";
    }
  }
  function f(u, o) {
    const d = u[l];
    if (d) {
      if (o === h) {
        if (!u.hasAttribute(h)) {
          d.destroy();
          return;
        }
        const e = d.activeClass, t = u.getAttribute(h) || "active";
        if (e !== t) {
          const r = u.querySelectorAll("a");
          for (const n of r)
            e && n.classList.remove(e);
          d.activeClass = t;
        }
      } else o === "data-ln-nav-exact" && (d.exact = u.hasAttribute("data-ln-nav-exact"));
      d.update();
    }
  }
  H(h, l, y, "ln-nav", {
    extraAttributes: ["data-ln-nav-exact"],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-tabs", l = "lnTabs";
  if (window[l] !== void 0 && window[l] !== null) return;
  function b(f, u) {
    const o = (f.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (o) return o;
    if (f.tagName !== "A") return "";
    const d = f.getAttribute("href") || "";
    if (!d.startsWith("#")) return "";
    const e = d.slice(1);
    if (!e) return "";
    const t = e.split("&");
    if (u)
      for (const c of t) {
        const m = c.indexOf(":");
        if (m > 0 && c.slice(0, m).toLowerCase().trim() === u)
          return c.slice(m + 1).toLowerCase().trim();
      }
    const r = t[t.length - 1] || "", n = r.indexOf(":");
    return (n > 0 ? r.slice(n + 1) : r).toLowerCase().trim();
  }
  function y(f) {
    return this.dom = f, p.call(this), this;
  }
  function p() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const f = this.tabs.filter((d) => d.tagName === "A" && (d.getAttribute("href") || "").startsWith("#")), u = f.length > 0 && f.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = u && !!this.nsKey, f.length > 0 && f.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : u && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const d of this.tabs) {
      const e = b(d, this.nsKey);
      e ? this.mapTabs[e] = d : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', d);
    }
    for (const d of this.panels) {
      const e = (d.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      e && (this.mapPanels[e] = d);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const o = this;
    this._clickHandlers = [];
    for (const d of this.tabs) {
      if (d[l + "Trigger"]) continue;
      const e = function(t) {
        const r = d.tagName === "A";
        if (!r && (t.ctrlKey || t.metaKey || t.button === 1)) return;
        const n = b(d, o.nsKey);
        n && (r && !Yt(t) || (o.hashEnabled ? gt(o.nsKey) === n ? o.dom.setAttribute("data-ln-tabs-active", n) : ot(o.nsKey, n) : o.dom.setAttribute("data-ln-tabs-active", n)));
      };
      d.addEventListener("click", e), d[l + "Trigger"] = e, o._clickHandlers.push({ el: d, handler: e });
    }
    if (this._onRequestSelect = function(d) {
      const e = d.detail && (d.detail.key || d.detail.tab);
      e && o.dom.setAttribute("data-ln-tabs-active", (e + "").toLowerCase().trim());
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.addEventListener("ln-tabs:request-activate", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const d = gt(o.nsKey);
      o.dom.setAttribute("data-ln-tabs-active", d !== null ? d : o.defaultKey);
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
  y.prototype._applyActive = function(f) {
    var u;
    (!f || !(f in this.mapPanels)) && (f = this.defaultKey);
    for (const o in this.mapTabs) {
      const d = this.mapTabs[o];
      o === f ? (d.setAttribute("data-active", ""), d.setAttribute("aria-selected", "true")) : (d.removeAttribute("data-active"), d.setAttribute("aria-selected", "false"));
    }
    for (const o in this.mapPanels) {
      const d = this.mapPanels[o], e = o === f;
      d.classList.toggle("hidden", !e), d.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const o = (u = this.mapPanels[f]) == null ? void 0 : u.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      o && setTimeout(() => o.focus({ preventScroll: !0 }), 0);
    }
    A(this.dom, "ln-tabs:change", { key: f, tab: this.mapTabs[f], panel: this.mapPanels[f] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && _t("tabs", this.dom, f);
  }, y.prototype.destroy = function() {
    if (this.dom[l]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect), this.dom.removeEventListener("ln-tabs:request-activate", this._onRequestSelect);
      for (const { el: f, handler: u } of this._clickHandlers)
        f.removeEventListener("click", u), delete f[l + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), A(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[l];
    }
  }, H(h, l, y, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(f) {
      const u = f.getAttribute("data-ln-tabs-active");
      f[l]._applyActive(u);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", l = "lnToggle";
  if (window[l] !== void 0) return;
  function b(f, u) {
    const o = document.querySelectorAll(
      '[data-ln-toggle-for="' + f.id + '"]'
    );
    for (const d of o)
      d.setAttribute("aria-expanded", u ? "true" : "false");
  }
  function y(f) {
    this.dom = f;
    const u = this;
    if (this._onRequestOpen = function() {
      u.open();
    }, this._onRequestClose = function() {
      u.close();
    }, this._onRequestToggle = function() {
      u.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), f.hasAttribute("data-ln-persist")) {
      const o = Mt("toggle", f);
      o !== null && f.setAttribute(h, o);
    }
    return this.isOpen = f.getAttribute(h) === "open", this.isOpen && f.classList.add("open"), b(f, this.isOpen), this;
  }
  y.prototype.open = function() {
    this.dom.setAttribute(h, "open");
  }, y.prototype.close = function() {
    this.dom.setAttribute(h, "close");
  }, y.prototype.toggle = function() {
    const f = this.dom.getAttribute(h);
    this.dom.setAttribute(h, f === "open" ? "close" : "open");
  }, y.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), A(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function p(f) {
    const u = f[l];
    if (!u) return;
    const d = f.getAttribute(h) === "open";
    if (d !== u.isOpen)
      if (d) {
        if (Y(f, "ln-toggle:before-open", { target: f }).defaultPrevented) {
          f.setAttribute(h, "close");
          return;
        }
        u.isOpen = !0, f.classList.add("open"), b(f, !0), A(f, "ln-toggle:open", { target: f }), f.hasAttribute("data-ln-persist") && _t("toggle", f, "open");
      } else {
        if (Y(f, "ln-toggle:before-close", { target: f }).defaultPrevented) {
          f.setAttribute(h, "open");
          return;
        }
        u.isOpen = !1, f.classList.remove("open"), b(f, !1), A(f, "ln-toggle:close", { target: f }), f.hasAttribute("data-ln-persist") && _t("toggle", f, "close");
      }
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const u = f.target.closest("[data-ln-toggle-for]");
    if (u) {
      const o = u.getAttribute("data-ln-toggle-for"), d = document.getElementById(o);
      if (d && d[l]) {
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
  }), H(h, l, y, "ln-toggle", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-accordion", l = "lnAccordion";
  if (window[l] !== void 0) return;
  function b(y) {
    return this.dom = y, this._onToggleOpen = function(p) {
      if (p.detail.target.closest("[data-ln-accordion]") !== y) return;
      const f = y.querySelectorAll("[data-ln-toggle]");
      for (const u of f)
        u !== p.detail.target && u.closest("[data-ln-accordion]") === y && u.getAttribute("data-ln-toggle") === "open" && u.setAttribute("data-ln-toggle", "close");
      A(y, "ln-accordion:change", { target: p.detail.target });
    }, y.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), A(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[l]);
  }, H(h, l, b, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", l = "lnDropdown";
  if (window[l] !== void 0) return;
  function b(y) {
    if (this.dom = y, this.toggleEl = y.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual")), this.triggerBtn = y.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
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
      !f.detail || f.detail.target !== p.toggleEl || (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "true"), typeof p.toggleEl.showPopover == "function" && p.toggleEl.showPopover(), p._reposition(), p._addOutsideClickListener(), p._addScrollRepositionListener(), p._addResizeCloseListener(), A(y, "ln-dropdown:open", { target: f.detail.target }));
    }, this._onToggleClose = function(f) {
      !f.detail || f.detail.target !== p.toggleEl || (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "false"), p._removeOutsideClickListener(), p._removeScrollRepositionListener(), p._removeResizeCloseListener(), p.toggleEl.style.top = "", p.toggleEl.style.left = "", typeof p.toggleEl.hidePopover == "function" && p.toggleEl.matches(":popover-open") && p.toggleEl.hidePopover(), A(y, "ln-dropdown:close", { target: f.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  b.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const y = this.triggerBtn.getBoundingClientRect(), p = Kt(this.toggleEl), f = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, u = Ot(y, p, "bottom-end", f);
    this.toggleEl.style.top = u.top + "px", this.toggleEl.style.left = u.left + "px";
  }, b.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const y = this;
    this._boundDocClick = function(p) {
      y.dom.contains(p.target) || y.toggleEl && y.toggleEl.contains(p.target) || y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
    }, y._docClickTimeout = setTimeout(function() {
      y._docClickTimeout = null, document.addEventListener("click", y._boundDocClick);
    }, 0);
  }, b.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, b.prototype._addScrollRepositionListener = function() {
    const y = this;
    this._boundScrollReposition = function() {
      y._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, b.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, b.prototype._addResizeCloseListener = function() {
    const y = this;
    this._boundResizeClose = function() {
      y.toggleEl && y.toggleEl.getAttribute("data-ln-toggle") === "open" && y.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, b.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, b.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), A(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[l]);
  }, H(h, l, b, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", l = "lnPopover", b = "data-ln-popover-for", y = "data-ln-popover-position";
  if (window[l] !== void 0) return;
  const p = [];
  let f = null;
  function u() {
    f || (f = function(t) {
      if (t.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", f));
  }
  function o() {
    p.length > 0 || f && (document.removeEventListener("keydown", f), f = null);
  }
  function d(t) {
    this.dom = t, this.isOpen = t.getAttribute(h) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const r = this;
    return this._onRequestOpen = function(n) {
      const c = n.detail && n.detail.trigger ? n.detail.trigger : null;
      r.open(c);
    }, this._onRequestClose = function() {
      r.close();
    }, this._onRequestToggle = function(n) {
      const c = n.detail && n.detail.trigger ? n.detail.trigger : null;
      r.toggle(c);
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
    const r = Kt(this.dom);
    if (this.trigger) {
      const g = this.trigger.getBoundingClientRect(), i = this.dom.getAttribute(y) || "bottom", a = Ot(g, r, i, 8);
      this.dom.style.top = a.top + "px", this.dom.style.left = a.left + "px", this.dom.setAttribute("data-ln-popover-placement", a.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const n = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), c = Array.prototype.find.call(n, Dt);
    c ? c.focus() : this.dom.focus();
    const m = this;
    this._boundDocClick = function(g) {
      m.dom.contains(g.target) || m.trigger && m.trigger.contains(g.target) || m.close();
    }, m._docClickTimeout = setTimeout(function() {
      m._docClickTimeout = null, document.addEventListener("click", m._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!m.trigger) return;
      const g = m.trigger.getBoundingClientRect(), i = Kt(m.dom), a = m.dom.getAttribute(y) || "bottom", s = Ot(g, i, a, 8);
      m.dom.style.top = s.top + "px", m.dom.style.left = s.left + "px", m.dom.setAttribute("data-ln-popover-placement", s.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), u(), A(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, d.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const t = p.indexOf(this);
    t !== -1 && p.splice(t, 1), o(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, A(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, d.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[l], A(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function e(t) {
    this.dom = t;
    const r = t.getAttribute(b);
    return t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", r), this._onClick = function(n) {
      if (n.ctrlKey || n.metaKey || n.button === 1) return;
      n.preventDefault();
      const c = document.getElementById(r);
      if (!c) return;
      c[l] && (c[l].trigger = t);
      const m = c.getAttribute(h);
      c.setAttribute(h, m === "open" ? "closed" : "open");
    }, t.addEventListener("click", this._onClick), this;
  }
  e.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[l + "Trigger"];
  }, H(h, l, d, "ln-popover", {
    onAttributeChange: function(t) {
      const r = t[l];
      if (!r) return;
      const c = t.getAttribute(h) === "open";
      if (c !== r.isOpen)
        if (c) {
          if (Y(t, "ln-popover:before-open", {
            popoverId: t.id,
            target: t,
            trigger: r.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "closed");
            return;
          }
          r._applyOpen(r.trigger);
        } else {
          if (Y(t, "ln-popover:before-close", {
            popoverId: t.id,
            target: t,
            trigger: r.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "open");
            return;
          }
          r._applyClose();
        }
    }
  }), H(b, l + "Trigger", e, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", l = "data-ln-tooltip", b = "data-ln-tooltip-position", y = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[y] !== void 0) return;
  let f = 0, u = null, o = null, d = null, e = null, t = null, r = null;
  function n() {
    return u && u.parentNode || (u = document.getElementById(p), u || (u = document.createElement("div"), u.id = p, document.body.appendChild(u)), u.hasAttribute("popover") || u.setAttribute("popover", "manual")), u;
  }
  function c() {
    r || (r = function(s) {
      s.key === "Escape" && i();
    }, document.addEventListener("keydown", r));
  }
  function m() {
    r && (document.removeEventListener("keydown", r), r = null);
  }
  function g(s) {
    if (d === s) return;
    i();
    const _ = s.getAttribute(l) || s.getAttribute("title");
    if (!_) return;
    n(), typeof u.showPopover == "function" && u.showPopover(), s.hasAttribute("title") && (e = s.getAttribute("title"), s.removeAttribute("title"));
    const v = s.getAttribute("aria-describedby");
    v ? t = v : t = null;
    const S = document.createElement("div");
    S.className = "ln-tooltip", S.textContent = _, s[y + "Uid"] || (f += 1, s[y + "Uid"] = "ln-tooltip-" + f), S.id = s[y + "Uid"], u.appendChild(S);
    const w = S.offsetWidth, C = S.offsetHeight, T = s.getBoundingClientRect(), q = s.getAttribute(b) || "top", x = Ot(T, { width: w, height: C }, q, 6);
    S.style.top = x.top + "px", S.style.left = x.left + "px", S.setAttribute("data-ln-tooltip-placement", x.placement), t ? s.setAttribute("aria-describedby", t + " " + S.id) : s.setAttribute("aria-describedby", S.id), o = S, d = s, c();
  }
  function i() {
    if (!o) {
      m();
      return;
    }
    d && (t !== null ? d.setAttribute("aria-describedby", t) : d.removeAttribute("aria-describedby"), t = null, e !== null && d.setAttribute("title", e)), e = null, o.parentNode && o.parentNode.removeChild(o), o = null, d = null, u && typeof u.hidePopover == "function" && u.matches(":popover-open") && u.hidePopover(), m();
  }
  function a(s) {
    return this.dom = s, s.hasAttribute("data-ln-tooltip-enhanced") || (s.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      g(s);
    }, this._onLeave = function() {
      d === s && !s.contains(document.activeElement) && i();
    }, this._onFocus = function() {
      g(s);
    }, this._onBlur = function() {
      d === s && !s.matches(":hover") && i();
    }, s.addEventListener("mouseenter", this._onEnter), s.addEventListener("mouseleave", this._onLeave), s.addEventListener("focus", this._onFocus, !0), s.addEventListener("blur", this._onBlur, !0), this;
  }
  a.prototype.destroy = function() {
    const s = this.dom;
    s.removeEventListener("mouseenter", this._onEnter), s.removeEventListener("mouseleave", this._onLeave), s.removeEventListener("focus", this._onFocus, !0), s.removeEventListener("blur", this._onBlur, !0), d === s && i(), this._addedEnhancedAttr && s.removeAttribute("data-ln-tooltip-enhanced"), delete s[y], delete s[y + "Uid"], A(s, "ln-tooltip:destroyed", { trigger: s });
  }, H(
    "[" + h + "], [data-ln-tooltip-enhanced], [" + l + "][title]",
    y,
    a,
    "ln-tooltip"
  );
})();
(function() {
  const h = "data-ln-toast", l = "lnToast", b = "ln-toast-item";
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function y(g) {
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
    const i = Array.from(g.querySelectorAll("[" + h + "]"));
    g.hasAttribute && g.hasAttribute(h) && i.push(g);
    for (const a of i)
      a[l] || new u(a);
  }
  function u(g) {
    this.dom = g, g[l] = this, this.timeoutDefault = parseInt(g.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(g.getAttribute("data-ln-toast-max") || "5", 10);
    const i = Array.from(g.querySelectorAll("[data-ln-toast-item]"));
    for (; i.length > this.max; ) g.removeChild(i.shift());
    for (const a of i) n(a, this);
    return i.length > 0 && y(g), this;
  }
  u.prototype.destroy = function() {
    if (this.dom[l]) {
      for (const g of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        t(g);
      p(this.dom), delete this.dom[l];
    }
  };
  function o(g, i) {
    const a = ((g.type || "") + "").trim().toLowerCase(), s = mt(i, b, "ln-toast");
    if (!s)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    it(s, {
      type: a,
      title: g.title,
      message: typeof g.message == "string" ? g.message : void 0
    });
    const _ = s.firstElementChild;
    if (!_) return null;
    _.hasAttribute("data-ln-toast-item") || _.setAttribute("data-ln-toast-item", ""), _.classList.add("ln-enter");
    const v = _.querySelector(".body");
    v && d(v, g);
    const S = _.querySelector("[data-ln-toast-close]");
    return S && S.addEventListener("click", function() {
      t(_);
    }), _;
  }
  function d(g, i) {
    if (Array.isArray(i.message)) {
      const a = document.createElement("ul");
      for (const s of i.message) {
        const _ = document.createElement("li");
        _.textContent = s, a.appendChild(_);
      }
      g.appendChild(a);
    }
    if (i.data && i.data.errors) {
      const a = document.createElement("ul");
      for (const s of Object.values(i.data.errors).flat()) {
        const _ = document.createElement("li");
        _.textContent = s, a.appendChild(_);
      }
      g.appendChild(a);
    }
  }
  function e(g, i) {
    const a = Array.from(g.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; a.length >= g.max && a.length > 0; ) g.dom.removeChild(a.shift());
    g.dom.appendChild(i), y(g.dom), requestAnimationFrame(() => i.classList.remove("ln-enter"));
  }
  function t(g) {
    if (!g || !g.parentNode) return;
    const i = g.parentNode;
    clearTimeout(g._timer), g.classList.remove("ln-enter"), g.classList.add("ln-out"), setTimeout(() => {
      g.parentNode && (g.parentNode.removeChild(g), p(i));
    }, 200);
  }
  function r(g) {
    let i = g && g.container;
    return typeof i == "string" && (i = document.querySelector(i)), i instanceof HTMLElement || (i = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), i || null;
  }
  function n(g, i) {
    if (g._lnToastHydrated) return;
    g._lnToastHydrated = !0;
    const a = g.querySelector("[data-ln-toast-close]");
    a && a.addEventListener("click", function() {
      t(g);
    });
    const s = g.getAttribute("data-ln-toast-timeout"), _ = s !== null ? parseInt(s, 10) : NaN, v = Number.isFinite(_) ? _ : i.timeoutDefault;
    v > 0 && (g._timer = setTimeout(function() {
      t(g);
    }, v));
  }
  function c(g) {
    const i = g.detail || {}, a = r(i);
    if (!a) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const s = a[l] || new u(a), _ = o(i, a);
    if (!_) return;
    const v = Number.isFinite(i.timeout) ? i.timeout : s.timeoutDefault;
    e(s, _), v > 0 && (_._timer = setTimeout(() => t(_), v));
  }
  function m(g) {
    const i = g && g.detail || {};
    if (i.container) {
      const a = r(i);
      if (a)
        for (const s of Array.from(a.querySelectorAll("[data-ln-toast-item]"))) t(s);
    } else {
      const a = document.querySelectorAll("[" + h + "]");
      for (const s of Array.from(a))
        for (const _ of Array.from(s.querySelectorAll("[data-ln-toast-item]"))) t(_);
    }
  }
  st(function() {
    window.addEventListener("ln-toast:enqueue", c), window.addEventListener("ln-toast:clear", m), window.addEventListener("ln-modal:open", function() {
      const i = document.querySelectorAll("[" + h + "]");
      for (const a of Array.from(i))
        a.querySelectorAll("[data-ln-toast-item]").length > 0 && y(a);
    }), new MutationObserver(function(i) {
      for (const a of i) {
        if (a.type === "attributes") {
          f(a.target);
          continue;
        }
        for (const s of a.addedNodes)
          f(s);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), f(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", l = "lnUpload", b = "data-ln-upload-dict", y = "data-ln-upload-accept", p = "data-ln-upload-context", f = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function u() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const m = document.createElement("div");
    m.innerHTML = f;
    const g = m.firstElementChild;
    g && document.body.appendChild(g);
  }
  if (window[l] !== void 0) return;
  function o(m) {
    if (m === 0) return "0 B";
    const g = 1024, i = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(m) / Math.log(g));
    return parseFloat((m / Math.pow(g, a)).toFixed(1)) + " " + i[a];
  }
  function d(m) {
    return m.split(".").pop().toLowerCase();
  }
  function e(m) {
    return m === "docx" && (m = "doc"), ["pdf", "doc", "epub"].includes(m) ? "lnc-file-" + m : "ln-file";
  }
  function t(m, g) {
    if (!g) return !0;
    const i = "." + d(m.name);
    return g.split(",").map(function(s) {
      return s.trim().toLowerCase();
    }).includes(i.toLowerCase());
  }
  function r(m) {
    if (m.lnUploadAPI) return;
    u();
    const g = Qt(m, b), i = m.querySelector(".ln-upload__zone"), a = m.querySelector(".ln-upload__list"), s = m.getAttribute(y) || "";
    if (!i || !a) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", m);
      return;
    }
    let _ = m.querySelector('input[type="file"]');
    _ || (_ = document.createElement("input"), _.type = "file", _.multiple = !0, _.classList.add("hidden"), s && (_.accept = s.split(",").map(function(P) {
      return P = P.trim(), P.startsWith(".") ? P : "." + P;
    }).join(",")), m.appendChild(_));
    const v = m.getAttribute(h) || "/files/upload", S = m.getAttribute(p) || "", w = m.getAttribute("data-ln-upload-delete") || (v.includes("/upload") ? v.replace(/\/upload\/?$/, "/{id}") : v + "/{id}"), C = /* @__PURE__ */ new Map();
    let T = 0;
    function q() {
      const P = document.querySelector('meta[name="csrf-token"]');
      return P ? P.getAttribute("content") : "";
    }
    function x(P) {
      if (!t(P, s)) {
        const L = g["invalid-type"];
        A(m, "ln-upload:invalid", {
          file: P,
          message: L
        }), A(window, "ln-toast:enqueue", {
          type: "error",
          title: g["invalid-title"] || "Invalid File",
          message: L || g["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const K = "file-" + ++T, $ = d(P.name), St = e($), dt = mt(m, "ln-upload-item", "ln-upload");
      if (!dt) return;
      const et = dt.firstElementChild;
      if (!et) return;
      et.setAttribute("data-file-id", K), it(et, {
        name: P.name,
        sizeText: "0%",
        iconHref: "#" + St,
        removeLabel: g.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const Ct = et.querySelector(".ln-upload__progress-bar"), ut = et.querySelector('[data-ln-upload-action="remove"]');
      ut && (ut.disabled = !0), a.appendChild(et);
      const ht = new FormData();
      ht.append("file", P);
      const xt = /* @__PURE__ */ new Set();
      m.querySelectorAll("input, select, textarea").forEach(function(L) {
        if (L.name && L.name !== "file_ids[]" && L.type !== "file") {
          if ((L.type === "checkbox" || L.type === "radio") && !L.checked)
            return;
          ht.append(L.name, L.value), xt.add(L.name);
        }
      }), !xt.has("context") && S && ht.append("context", S);
      const X = new XMLHttpRequest();
      X.upload.addEventListener("progress", function(L) {
        if (L.lengthComputable) {
          const k = Math.round(L.loaded / L.total * 100);
          Ct.style.width = k + "%", it(et, { sizeText: k + "%" });
        }
      }), X.addEventListener("load", function() {
        if (X.status >= 200 && X.status < 300) {
          let L;
          try {
            L = JSON.parse(X.responseText);
          } catch {
            E("Invalid response");
            return;
          }
          it(et, { sizeText: o(L.size || P.size), uploading: !1 }), ut && (ut.disabled = !1), C.set(K, {
            serverId: L.id,
            name: L.name,
            size: L.size
          }), I(), A(m, "ln-upload:uploaded", {
            localId: K,
            serverId: L.id,
            name: L.name
          });
        } else {
          let L = g["upload-failed"] || "Upload failed";
          try {
            L = JSON.parse(X.responseText).message || L;
          } catch {
          }
          E(L);
        }
      }), X.addEventListener("error", function() {
        E(g["network-error"] || "Network error");
      });
      function E(L) {
        Ct && (Ct.style.width = "100%"), it(et, { sizeText: g.error || "Error", uploading: !1, error: !0 }), ut && (ut.disabled = !1), A(m, "ln-upload:error", {
          file: P,
          message: L
        }), A(window, "ln-toast:enqueue", {
          type: "error",
          title: g["error-title"] || "Upload Error",
          message: L || g["upload-failed"] || "Failed to upload file"
        });
      }
      X.open("POST", v), X.setRequestHeader("X-CSRF-TOKEN", q()), X.setRequestHeader("Accept", "application/json"), X.send(ht);
    }
    function I() {
      for (const P of m.querySelectorAll('input[name="file_ids[]"]'))
        P.remove();
      for (const [, P] of C) {
        const K = document.createElement("input");
        K.type = "hidden", K.name = "file_ids[]", K.value = P.serverId, m.appendChild(K);
      }
    }
    function D(P) {
      const K = C.get(P), $ = a.querySelector('[data-file-id="' + P + '"]');
      if (!K || !K.serverId) {
        $ && $.remove(), C.delete(P), I();
        return;
      }
      $ && it($, { deleting: !0 });
      const St = w.replace("{id}", K.serverId);
      fetch(St, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": q(),
          Accept: "application/json"
        }
      }).then(function(dt) {
        dt.status === 200 ? ($ && $.remove(), C.delete(P), I(), A(m, "ln-upload:removed", {
          localId: P,
          serverId: K.serverId
        })) : ($ && it($, { deleting: !1 }), A(window, "ln-toast:enqueue", {
          type: "error",
          title: g["delete-title"] || "Error",
          message: g["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(dt) {
        console.warn("[ln-upload] Delete error:", dt), $ && it($, { deleting: !1 }), A(window, "ln-toast:enqueue", {
          type: "error",
          title: g["network-error"] || "Network error",
          message: g["connection-error"] || "Could not connect to server"
        });
      });
    }
    function M(P) {
      for (const K of P)
        x(K);
      _.value = "";
    }
    const F = function() {
      _.click();
    }, z = function() {
      M(this.files);
    }, Q = function(P) {
      P.preventDefault(), P.stopPropagation(), i.classList.add("ln-upload__zone--dragover");
    }, ct = function(P) {
      P.preventDefault(), P.stopPropagation(), i.classList.add("ln-upload__zone--dragover");
    }, at = function(P) {
      P.preventDefault(), P.stopPropagation(), i.classList.remove("ln-upload__zone--dragover");
    }, qt = function(P) {
      P.preventDefault(), P.stopPropagation(), i.classList.remove("ln-upload__zone--dragover"), M(P.dataTransfer.files);
    }, At = function(P) {
      const K = P.target.closest('[data-ln-upload-action="remove"]');
      if (!K || !a.contains(K) || K.disabled) return;
      const $ = K.closest(".ln-upload__item");
      $ && D($.getAttribute("data-file-id"));
    };
    i.addEventListener("click", F), _.addEventListener("change", z), i.addEventListener("dragenter", Q), i.addEventListener("dragover", ct), i.addEventListener("dragleave", at), i.addEventListener("drop", qt), a.addEventListener("click", At), m.lnUploadAPI = {
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
            const K = w.replace("{id}", P.serverId);
            fetch(K, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": q(),
                Accept: "application/json"
              }
            });
          }
        C.clear(), a.innerHTML = "", I(), A(m, "ln-upload:cleared", {});
      },
      destroy: function() {
        i.removeEventListener("click", F), _.removeEventListener("change", z), i.removeEventListener("dragenter", Q), i.removeEventListener("dragover", ct), i.removeEventListener("dragleave", at), i.removeEventListener("drop", qt), a.removeEventListener("click", At), C.clear(), a.innerHTML = "", I(), delete m.lnUploadAPI;
      }
    };
  }
  function n() {
    for (const m of document.querySelectorAll("[" + h + "]"))
      r(m);
  }
  function c() {
    st(function() {
      new MutationObserver(function(g) {
        for (const i of g)
          if (i.type === "childList") {
            for (const a of i.addedNodes)
              if (a.nodeType === 1) {
                a.hasAttribute(h) && r(a);
                for (const s of a.querySelectorAll("[" + h + "]"))
                  r(s);
              }
          } else i.type === "attributes" && i.target.hasAttribute(h) && r(i.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[l] = {
    init: r,
    initAll: n
  }, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function l(o) {
    return o.hostname && o.hostname !== window.location.hostname;
  }
  function b(o) {
    if (o.getAttribute("data-ln-external-link") === "processed" || !l(o)) return;
    o.target = "_blank";
    const d = (o.rel || "").split(/\s+/).filter(Boolean);
    d.includes("noopener") || d.push("noopener"), d.includes("noreferrer") || d.push("noreferrer"), o.rel = d.join(" ");
    const e = document.createElement("span");
    e.className = "sr-only", e.textContent = "(opens in new tab)", o.appendChild(e), o.setAttribute("data-ln-external-link", "processed"), A(o, "ln-external-links:processed", {
      link: o,
      href: o.href
    });
  }
  function y(o) {
    o = o || document.body;
    for (const d of o.querySelectorAll("a, area"))
      b(d);
  }
  function p() {
    st(function() {
      document.body.addEventListener("click", function(o) {
        const d = o.target.closest("a, area");
        d && d.getAttribute("data-ln-external-link") === "processed" && A(d, "ln-external-links:clicked", {
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
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && b(t), t.querySelectorAll))
                for (const r of t.querySelectorAll("a, area"))
                  b(r);
          }
          if (e.type === "attributes" && e.attributeName === "href") {
            const t = e.target;
            t.matches && (t.matches("a") || t.matches("area")) && b(t);
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
      y();
    }) : y();
  }
  window[h] = {
    process: y
  }, u();
})();
(function() {
  const h = "data-ln-link", l = "lnLink";
  if (window[l] !== void 0) return;
  let b = null;
  function y() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function p(a) {
    b && (b.textContent = a, b.classList.add("ln-link-status--visible"));
  }
  function f() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function u(a, s) {
    if (s.target.closest("a, button, input, select, textarea")) return;
    const _ = a.querySelector("a");
    if (!_) return;
    const v = _.getAttribute("href");
    if (!v) return;
    if (s.ctrlKey || s.metaKey || s.button === 1) {
      window.open(v, "_blank");
      return;
    }
    Y(a, "ln-link:navigate", { target: a, href: v, link: _ }).defaultPrevented || _.click();
  }
  function o(a) {
    const s = a.querySelector("a");
    if (!s) return;
    const _ = s.getAttribute("href");
    _ && p(_);
  }
  function d() {
    f();
  }
  function e(a) {
    a[l + "Row"] || !a.querySelector("a") || (a[l + "Row"] = !0, a._lnLinkClick = function(_) {
      u(a, _);
    }, a._lnLinkEnter = function() {
      o(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", d));
  }
  function t(a) {
    a[l + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", d), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[l + "Row"]);
  }
  function r(a) {
    if (!a[l + "Init"]) return;
    const s = a.tagName;
    if (s === "TABLE" || s === "TBODY") {
      const _ = s === "TABLE" && a.querySelector("tbody") || a;
      for (const v of _.querySelectorAll("tr"))
        t(v);
    } else
      t(a);
    delete a[l + "Init"];
  }
  function n(a) {
    if (a[l + "Init"]) return;
    a[l + "Init"] = !0;
    const s = a.tagName;
    if (s === "TABLE" || s === "TBODY") {
      const _ = s === "TABLE" && a.querySelector("tbody") || a;
      for (const v of _.querySelectorAll("tr"))
        e(v);
    } else
      e(a);
  }
  function c(a) {
    a.hasAttribute && a.hasAttribute(h) && n(a);
    const s = a.querySelectorAll ? a.querySelectorAll("[" + h + "]") : [];
    for (const _ of s)
      n(_);
  }
  function m() {
    st(function() {
      new MutationObserver(function(s) {
        for (const _ of s)
          if (_.type === "childList") {
            for (const v of _.addedNodes)
              if (v.nodeType === 1) {
                c(v);
                const S = v.closest("[" + h + "]");
                if (S)
                  if (v.tagName === "TR")
                    e(v);
                  else {
                    const w = S.tagName;
                    if (w === "TABLE" || w === "TBODY") {
                      const C = v.querySelectorAll ? v.querySelectorAll("tr") : [];
                      for (const T of C)
                        e(T);
                    }
                  }
              }
          } else _.type === "attributes" && (_.target.hasAttribute && _.target.hasAttribute(h) ? c(_.target) : r(_.target));
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function g(a) {
    c(a);
  }
  window[l] = { init: g, destroy: r };
  function i() {
    y(), m(), g(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = "[data-ln-progress]", l = "lnProgress";
  if (window[l] !== void 0) return;
  function b(u) {
    return this.dom = u, this._attrObserver = null, this._parentObserver = null, f.call(this), y.call(this), p.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[l]);
  };
  function y() {
    const u = this, o = new MutationObserver(function(d) {
      for (const e of d)
        (e.attributeName === "data-ln-progress" || e.attributeName === "data-ln-progress-max") && f.call(u);
    });
    o.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = o;
  }
  function p() {
    const u = this, o = this.dom.parentElement;
    if (!o) return;
    const d = new MutationObserver(function(e) {
      for (const t of e)
        t.attributeName === "data-ln-progress-max" && f.call(u);
    });
    d.observe(o, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = d;
  }
  function f() {
    const u = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, o = this.dom.parentElement, e = (o && o.hasAttribute("data-ln-progress-max") ? parseFloat(o.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let t = e > 0 ? u / e * 100 : 0;
    t < 0 && (t = 0), t > 100 && (t = 100), this.dom.style.width = t + "%";
    const r = Math.max(0, Math.min(u, e));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(e)), this.dom.setAttribute("aria-valuenow", String(r)), A(this.dom, "ln-progress:change", { target: this.dom, value: u, max: e, percentage: t });
  }
  H(
    h,
    l,
    b,
    "ln-progress"
  );
})();
(function() {
  const h = "data-ln-filter", l = "lnFilter", b = "data-ln-filter-key", y = "data-ln-filter-value", p = "data-ln-filter-hide", f = "data-ln-filter-reset", u = "data-ln-filter-col", o = /* @__PURE__ */ new WeakMap();
  if (window[l] !== void 0) return;
  function d(c) {
    return c.hasAttribute(f) || c.getAttribute(y) === "";
  }
  function e(c) {
    let m = c._filterKey;
    const g = [];
    for (let i = 0; i < c.inputs.length; i++) {
      const a = c.inputs[i];
      if (a.checked && !d(a)) {
        const s = a.getAttribute(y);
        s && g.push(s);
      }
    }
    return { key: m, values: g };
  }
  function t(c, m) {
    if (c.length !== m.length) return !0;
    for (let g = 0; g < c.length; g++) if (c[g] !== m[g]) return !0;
    return !1;
  }
  function r(c) {
    const m = c.dom, g = c.colIndex, i = m.querySelector("template");
    if (!i || g === null) return;
    const a = document.getElementById(c.targetId);
    if (!a) return;
    const s = a.tagName === "TABLE" ? a : a.querySelector("table");
    if (!s || a.hasAttribute("data-ln-table")) return;
    const _ = {}, v = [], S = s.tBodies;
    for (let T = 0; T < S.length; T++) {
      const q = S[T].rows;
      for (let x = 0; x < q.length; x++) {
        const I = q[x].cells[g], D = I ? I.textContent.trim() : "";
        D && !_[D] && (_[D] = !0, v.push(D));
      }
    }
    v.sort(function(T, q) {
      return T.localeCompare(q);
    });
    const w = m.querySelector("[" + b + "]"), C = w ? w.getAttribute(b) : m.getAttribute("data-ln-filter-key") || "col" + g;
    for (let T = 0; T < v.length; T++) {
      const q = i.content.cloneNode(!0), x = q.querySelector("input");
      x && (x.setAttribute(b, C), x.setAttribute(y, v[T]), wt(q, { text: v[T] }), m.appendChild(q));
    }
  }
  function n(c) {
    this.dom = c, this.targetId = c.getAttribute(h);
    const m = c.getAttribute(u);
    this.colIndex = m !== null ? parseInt(m, 10) : null, r(this), this.inputs = Array.from(c.querySelectorAll("[" + b + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(b) : null, this._lastSnapshot = null;
    const g = this, i = Fe(
      function() {
        g._render();
      },
      function() {
        g._afterRender();
      }
    );
    this._queueRender = i, this._attachHandlers();
    let a = !1;
    if (c.hasAttribute("data-ln-persist")) {
      const s = Mt("filter", c);
      if (s && s.key && Array.isArray(s.values) && s.values.length > 0) {
        for (let _ = 0; _ < this.inputs.length; _++) {
          const v = this.inputs[_];
          d(v) ? v.checked = !1 : v.getAttribute(b) === s.key && s.values.indexOf(v.getAttribute(y)) !== -1 ? v.checked = !0 : v.checked = !1;
        }
        i(), a = !0;
      }
    }
    if (!a) {
      for (let s = 0; s < this.inputs.length; s++)
        if (this.inputs[s].checked && !d(this.inputs[s])) {
          i();
          break;
        }
    }
    return c.setAttribute(INIT_ATTR, ""), this;
  }
  n.prototype._attachHandlers = function() {
    const c = this;
    this.inputs.forEach(function(m) {
      m[l + "Bound"] || (m[l + "Bound"] = !0, m._lnFilterChange = function() {
        if (d(m)) {
          for (let g = 0; g < c.inputs.length; g++)
            d(c.inputs[g]) || (c.inputs[g].checked = !1);
          m.checked = !0, c._queueRender();
          return;
        }
        if (m.checked) {
          for (let i = 0; i < c.inputs.length; i++)
            d(c.inputs[i]) && (c.inputs[i].checked = !1);
          let g = !1;
          for (let i = 0; i < c.inputs.length; i++)
            if (d(c.inputs[i])) {
              g = !0;
              break;
            }
          if (g) {
            let i = !0;
            for (let a = 0; a < c.inputs.length; a++)
              if (!d(c.inputs[a]) && !c.inputs[a].checked) {
                i = !1;
                break;
              }
            if (i)
              for (let a = 0; a < c.inputs.length; a++)
                d(c.inputs[a]) ? c.inputs[a].checked = !0 : c.inputs[a].checked = !1;
          }
        } else {
          let g = !1;
          for (let i = 0; i < c.inputs.length; i++)
            if (!d(c.inputs[i]) && c.inputs[i].checked) {
              g = !0;
              break;
            }
          if (!g)
            for (let i = 0; i < c.inputs.length; i++)
              d(c.inputs[i]) && (c.inputs[i].checked = !0);
        }
        c._queueRender();
      }, m.addEventListener("change", m._lnFilterChange));
    });
  }, n.prototype._render = function() {
    const c = this, m = e(this), g = m.key === null || m.values.length === 0, i = [];
    for (let a = 0; a < m.values.length; a++)
      i.push(m.values[a].toLowerCase());
    if (c.colIndex !== null)
      c._filterTableRows(m);
    else {
      const a = document.getElementById(c.targetId);
      if (!a) return;
      const s = a.children;
      for (let _ = 0; _ < s.length; _++) {
        const v = s[_];
        if (g) {
          v.removeAttribute(p);
          continue;
        }
        const S = v.getAttribute("data-" + m.key);
        v.removeAttribute(p), S !== null && i.indexOf(S.toLowerCase()) === -1 && v.setAttribute(p, "true");
      }
    }
  }, n.prototype._afterRender = function() {
    const c = e(this), m = this._lastSnapshot;
    if (!m || m.key !== c.key || t(m.values, c.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: c.key,
        values: c.values.slice()
      });
      const i = m && m.values.length > 0, a = c.values.length === 0;
      i && a && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: c.key, values: c.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (c.key && c.values.length > 0 ? _t("filter", this.dom, { key: c.key, values: c.values.slice() }) : _t("filter", this.dom, null));
  }, n.prototype._dispatchOnBoth = function(c, m) {
    A(this.dom, c, m);
    const g = document.getElementById(this.targetId);
    g && g !== this.dom && A(g, c, m);
  }, n.prototype._filterTableRows = function(c) {
    const m = document.getElementById(this.targetId);
    if (!m) return;
    const g = m.tagName === "TABLE" ? m : m.querySelector("table");
    if (!g || m.hasAttribute("data-ln-table")) return;
    const i = c.key || this._filterKey, a = c.values;
    o.has(g) || o.set(g, {});
    const s = o.get(g);
    if (i && a.length > 0) {
      const w = [];
      for (let C = 0; C < a.length; C++)
        w.push(a[C].toLowerCase());
      s[i] = { col: this.colIndex, values: w };
    } else i && delete s[i];
    const _ = Object.keys(s), v = _.length > 0, S = g.tBodies;
    for (let w = 0; w < S.length; w++) {
      const C = S[w].rows;
      for (let T = 0; T < C.length; T++) {
        const q = C[T];
        if (!v) {
          q.removeAttribute(p);
          continue;
        }
        let x = !0;
        for (let I = 0; I < _.length; I++) {
          const D = s[_[I]], M = q.cells[D.col], F = M ? M.textContent.trim().toLowerCase() : "";
          if (D.values.indexOf(F) === -1) {
            x = !1;
            break;
          }
        }
        x ? q.removeAttribute(p) : q.setAttribute(p, "true");
      }
    }
  }, n.prototype.destroy = function() {
    if (this.dom[l]) {
      if (this.colIndex !== null) {
        const c = document.getElementById(this.targetId);
        if (c) {
          const m = c.tagName === "TABLE" ? c : c.querySelector("table");
          if (m && o.has(m)) {
            const g = o.get(m), i = this._filterKey;
            i && g[i] && delete g[i], Object.keys(g).length === 0 && o.delete(m);
          }
        }
      }
      this.inputs.forEach(function(c) {
        c._lnFilterChange && (c.removeEventListener("change", c._lnFilterChange), delete c._lnFilterChange), delete c[l + "Bound"];
      }), delete this.dom[l];
    }
  }, H(h, l, n, "ln-filter");
})();
(function() {
  const h = "data-ln-search", l = "lnSearch", b = "data-ln-search-hide";
  if (window[l] !== void 0) return;
  function p(f) {
    this.dom = f, this.targetId = f.getAttribute(h);
    const u = f.tagName;
    this.input = u === "INPUT" || u === "TEXTAREA" ? f : f.querySelector('[name="search"]') || f.querySelector('input[type="search"]') || f.querySelector('input[type="text"]'), this.itemsSelector = f.getAttribute("data-ln-search-items") || null;
    const o = f.getAttribute("data-ln-search-debounce");
    if (this.debounceTime = o !== null ? parseInt(o, 10) : 150, isNaN(this.debounceTime) && (this.debounceTime = 150), this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
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
      t.removeAttribute(b), f && !t.textContent.replace(/\s+/g, " ").toLowerCase().includes(f) && t.setAttribute(b, "true");
    }
  }, p.prototype.destroy = function() {
    this.dom[l] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), delete this.dom[l]);
  }, H(h, l, p, "ln-search");
})();
(function() {
  const h = "data-ln-sort", l = "lnSort", b = "data-ln-sort-field", y = "ln-sort-asc", p = "ln-sort-desc";
  if (window[l] !== void 0) return;
  function f(o, d) {
    return !o || o.field !== d ? "asc" : o.direction === "asc" ? "desc" : null;
  }
  function u(o) {
    this.dom = o, this.targetId = o.getAttribute(h), this.triggers = Array.from(o.querySelectorAll("[" + b + "]")), this._current = null, this._lastSnapshot = null;
    const d = this;
    return this._onClick = function(e) {
      const t = e.target.closest("[" + b + "]");
      if (!t || !o.contains(t)) return;
      const r = t.getAttribute(b), n = f(d._current, r);
      d._current = n ? { field: r, direction: n } : null, d._emit();
    }, o.addEventListener("click", this._onClick), this._onQueryChanged = function(e) {
      const t = e.detail || {};
      t.store === d.targetId && d._paint(t.query && t.query.sort ? t.query.sort : null);
    }, document.addEventListener("ln-data-store:query-changed", this._onQueryChanged), this;
  }
  u.prototype._emit = function() {
    const o = this._current, d = this._lastSnapshot;
    !d && !o || d && o && d.field === o.field && d.direction === o.direction || (this._lastSnapshot = o ? { field: o.field, direction: o.direction } : null, this._dispatchOnBoth("ln-sort:changed", {
      field: o ? o.field : null,
      direction: o ? o.direction : null
    }));
  }, u.prototype._dispatchOnBoth = function(o, d) {
    A(this.dom, o, d);
    const e = document.getElementById(this.targetId);
    e && e !== this.dom && A(e, o, d);
  }, u.prototype._paint = function(o) {
    for (let d = 0; d < this.triggers.length; d++) {
      const e = this.triggers[d], t = e.getAttribute(b);
      e.classList.remove(y, p), o && o.field === t && e.classList.add(o.direction === "desc" ? p : y);
    }
    this._current = o ? { field: o.field, direction: o.direction } : null;
  }, u.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-data-store:query-changed", this._onQueryChanged), delete this.dom[l]);
  }, H(h, l, u, "ln-sort");
})();
(function() {
  const h = "lnTableSort", l = "data-ln-table-sort", b = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function y(o) {
    p(o);
  }
  function p(o) {
    const d = Array.from(o.querySelectorAll("table"));
    o.tagName === "TABLE" && d.push(o), d.forEach(function(e) {
      if (e[h]) return;
      const t = Array.from(e.querySelectorAll("th[" + l + "]"));
      t.length && (e[h] = new f(e, t));
    });
  }
  function f(o, d) {
    this.table = o, this.ths = d, this._col = -1, this._dir = null;
    const e = this;
    d.forEach(function(r, n) {
      if (r[h + "Bound"]) return;
      r[h + "Bound"] = !0;
      const c = r.querySelector("[" + b + "]");
      c && (c._lnSortClick = function() {
        e._handleClick(n, r);
      }, c.addEventListener("click", c._lnSortClick));
    });
    const t = o.closest("[data-ln-table][data-ln-persist]");
    if (t) {
      const r = Mt("table-sort", t);
      r && r.dir && r.col >= 0 && r.col < d.length && this._applySort(r.col, d[r.col], r.dir);
    }
    return this;
  }
  f.prototype._applySort = function(o, d, e) {
    this.ths.forEach(function(t) {
      t.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = o, this._dir = e, d.classList.add(e === "asc" ? "ln-sort-asc" : "ln-sort-desc")), A(this.table, "ln-table:sort", {
      column: o,
      sortType: d.getAttribute(l),
      direction: e
    });
  }, f.prototype._handleClick = function(o, d) {
    let e;
    this._col !== o ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this._applySort(o, d, e);
    const t = this.table.closest("[data-ln-table][data-ln-persist]");
    t && (e === null ? _t("table-sort", t, null) : _t("table-sort", t, { col: o, dir: e }));
  }, f.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(o) {
      const d = o.querySelector("[" + b + "]");
      d && d._lnSortClick && (d.removeEventListener("click", d._lnSortClick), delete d._lnSortClick), delete o[h + "Bound"];
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
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [l] });
    }, "ln-table-sort");
  }
  window[h] = y, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const h = "data-ln-table", l = "lnTable", b = "data-ln-table-sort", y = "data-ln-table-empty";
  if (window[l] !== void 0) return;
  const u = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function o(t, r) {
    if (t == null || isNaN(t)) return "";
    try {
      return new Intl.NumberFormat(W(r)).format(t);
    } catch {
      return String(t);
    }
  }
  function d(t) {
    let r = t.parentElement;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const c = getComputedStyle(r).overflowY;
      if (c === "auto" || c === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function e(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("[data-ln-table-body]") || t.querySelector("tbody"), this.thead = t.querySelector("thead");
    const r = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = r ? Array.from(r.querySelectorAll("th")) : [], this.isDataDriven = t.hasAttribute("data-ln-table-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const n = this;
    return this._onSetSearch = function(c) {
      if (n.isDataDriven) return;
      const m = (c.detail && c.detail.query != null ? c.detail.query : c.detail && c.detail.term != null ? c.detail.term : "").trim();
      n._searchTerm = m.toLowerCase(), n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), A(t, "ln-table:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-table:set-search", this._onSetSearch), this._onSetFilter = function(c) {
      if (n.isDataDriven || !c.detail) return;
      const m = c.detail.key, g = c.detail.values;
      if (!g || g.length === 0)
        delete n._columnFilters[m];
      else {
        const i = [];
        for (let a = 0; a < g.length; a++)
          i.push(g[a].toLowerCase());
        n._columnFilters[m] = i;
      }
      n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), A(t, "ln-table:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-table:set-filter", this._onSetFilter), this._onRequestClearFilters = function() {
      n.isDataDriven || (n._searchTerm = "", n._columnFilters = {}, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), A(t, "ln-table:filter", {
        term: "",
        matched: n._filteredData.length,
        total: n._data.length
      }));
    }, t.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._sliceOffset = 0, this._sliceData = [], this._debounceId = null, this._totalSpan = t.querySelector("[data-ln-table-total]"), this._filteredSpan = t.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== t ? this._filteredSpan.parentElement : null), this._selectedSpan = t.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== t ? this._selectedSpan.parentElement : null), this._onSetData = function(c) {
      const m = c.detail || {};
      if (m.offset != null) {
        n._sliceOffset = m.offset, n._sliceData = m.data || [], n._lastTotal = m.total != null ? m.total : n._lastTotal, n._lastFiltered = m.filtered != null ? m.filtered : n._lastFiltered, n.totalCount = n._lastTotal, n.visibleCount = n._lastFiltered, n.isLoaded = !0, n._selectable && n._selectAllCheckbox && n._selectAllCheckbox.classList.add("hidden"), t.classList.remove("ln-table--loading"), n._vStart = -1, n._vEnd = -1, n._render(), n._updateFooter(), A(t, "ln-table:rendered", {
          table: n.name,
          total: n.totalCount,
          visible: n.visibleCount
        });
        return;
      }
      n._data = m.data || [], n._sliceOffset = 0, n._sliceData = [], n._lastTotal = m.total != null ? m.total : n._data.length, n._lastFiltered = m.filtered != null ? m.filtered : n._data.length, n.totalCount = n._lastTotal, n.visibleCount = n._lastFiltered, n.isLoaded = !0, n._selectable && n._selectAllCheckbox && n._selectAllCheckbox.classList.remove("hidden"), t.classList.remove("ln-table--loading"), n._vStart = -1, n._vEnd = -1, n._applyFilterAndSort(), n._render(), n._updateFooter(), A(t, "ln-table:rendered", {
        table: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      });
    }, t.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(c) {
      const m = c.detail && c.detail.loading;
      t.classList.toggle("ln-table--loading", !!m), m && (n.isLoaded = !1);
    }, t.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(c) {
      if (n.thead.hasAttribute("data-ln-sort")) return;
      const m = c.target.closest("[data-ln-table-col-sort]");
      if (!m) return;
      const g = m.closest("th");
      if (!g) return;
      const i = g.getAttribute("data-ln-table-col");
      i && n._handleSort(i, g);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._selectable = t.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(c) {
      if (c.target.closest("[data-ln-table-row-select]") || c.target.closest("[data-ln-table-row-action]") || c.target.closest("a") || c.target.closest("button") || c.ctrlKey || c.metaKey || c.button === 1) return;
      const m = c.target.closest("[data-ln-table-row]");
      if (!m) return;
      const g = m.getAttribute("data-ln-table-row-id"), i = m._lnRecord || {};
      A(t, "ln-table:row-click", {
        table: n.name,
        id: g,
        record: i
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(c) {
      const m = c.target.closest("[data-ln-table-row-action]");
      if (!m) return;
      c.stopPropagation();
      const g = m.closest("[data-ln-table-row]");
      if (!g) return;
      const i = m.getAttribute("data-ln-table-row-action"), a = g.getAttribute("data-ln-table-row-id"), s = g._lnRecord || {};
      A(t, "ln-table:row-action", {
        table: n.name,
        id: a,
        action: i,
        record: s
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._focusedRowIndex = -1, this._onKeydown = function(c) {
      if (!t.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      const m = n.tbody ? Array.from(n.tbody.querySelectorAll("[data-ln-table-row]")) : [];
      if (m.length)
        switch (c.key) {
          case "ArrowDown":
            c.preventDefault(), n._focusedRowIndex = Math.min(n._focusedRowIndex + 1, m.length - 1), n._focusRow(m);
            break;
          case "ArrowUp":
            c.preventDefault(), n._focusedRowIndex = Math.max(n._focusedRowIndex - 1, 0), n._focusRow(m);
            break;
          case "Home":
            c.preventDefault(), n._focusedRowIndex = 0, n._focusRow(m);
            break;
          case "End":
            c.preventDefault(), n._focusedRowIndex = m.length - 1, n._focusRow(m);
            break;
          case "Enter":
            if (n._focusedRowIndex >= 0 && n._focusedRowIndex < m.length) {
              c.preventDefault();
              const g = m[n._focusedRowIndex];
              A(t, "ln-table:row-click", {
                table: n.name,
                id: g.getAttribute("data-ln-table-row-id"),
                record: g._lnRecord || {}
              });
            }
            break;
          case " ":
            if (n._selectable && n._focusedRowIndex >= 0 && n._focusedRowIndex < m.length) {
              c.preventDefault();
              const g = m[n._focusedRowIndex].querySelector("[data-ln-table-row-select]");
              g && (g.checked = !g.checked, g.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), A(t, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      n.tbody.rows.length > 0 && (n._emptyTbodyObserver.disconnect(), n._emptyTbodyObserver = null, n._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(c) {
      n._sortCol = c.detail.direction === null ? -1 : c.detail.column, n._sortDir = c.detail.direction, n._sortType = c.detail.sortType, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), A(t, "ln-table:sorted", {
        column: c.detail.column,
        direction: c.detail.direction,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort)), this;
  }
  e.prototype._parseRows = function() {
    const t = this.tbody.rows, r = this.ths;
    this._data = [];
    const n = [];
    for (let c = 0; c < r.length; c++)
      n[c] = r[c].getAttribute(b);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let c = 0; c < t.length; c++) {
      const m = t[c], g = [], i = [], a = [];
      for (let _ = 0; _ < m.cells.length; _++) {
        const v = m.cells[_], S = v.textContent.trim(), w = te(v), C = n[_];
        i[_] = S.toLowerCase(), C === "number" || C === "date" ? g[_] = parseFloat(w) || 0 : C === "string" ? g[_] = String(w) : g[_] = null, _ < m.cells.length - 1 && a.push(S.toLowerCase());
      }
      let s = null;
      if (this.isDataDriven) {
        s = {};
        const _ = m.getAttribute("data-ln-table-row-id");
        _ != null && (s.id = _);
        for (let v = 0; v < r.length; v++) {
          const S = r[v].getAttribute("data-ln-table-col");
          if (S) {
            const w = v;
            if (w < m.cells.length) {
              const C = m.cells[w];
              s[S] = te(C);
            }
          }
        }
      }
      this._data.push({
        sortKeys: g,
        rawTexts: i,
        html: m.outerHTML,
        searchText: a.join(" "),
        id: this.isDataDriven && s ? s.id : void 0,
        ...s
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), A(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, e.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      if (this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const t = this.currentSort.field, n = this.currentSort.direction === "desc" ? -1 : 1;
      let c = null;
      if (this.ths) {
        for (let g = 0; g < this.ths.length; g++)
          if (this.ths[g].getAttribute("data-ln-table-col") === t) {
            c = this.ths[g].getAttribute(b);
            break;
          }
      }
      const m = u ? u.compare : function(g, i) {
        return g < i ? -1 : g > i ? 1 : 0;
      };
      this._filteredData.sort(function(g, i) {
        const a = g[t], s = i[t];
        if (c === "number" || c === "date") {
          const S = parseFloat(a) || 0, w = parseFloat(s) || 0;
          return (S - w) * n;
        }
        if (typeof a == "number" && typeof s == "number")
          return (a - s) * n;
        const _ = a != null ? String(a) : "", v = s != null ? String(s) : "";
        return m(_, v) * n;
      });
    } else {
      const t = this._searchTerm, r = this._columnFilters, n = Object.keys(r).length > 0, c = this.ths, m = {};
      if (n)
        for (let _ = 0; _ < c.length; _++) {
          const v = c[_].getAttribute("data-ln-table-filter-col");
          v && (m[v] = _);
        }
      if (!t && !n ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(_) {
        if (t && _.searchText.indexOf(t) === -1) return !1;
        if (n)
          for (const v in r) {
            const S = m[v];
            if (S !== void 0 && r[v].indexOf(_.rawTexts[S]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, i = this._sortDir === "desc" ? -1 : 1, a = this._sortType === "number" || this._sortType === "date", s = u ? u.compare : function(_, v) {
        return _ < v ? -1 : _ > v ? 1 : 0;
      };
      this._filteredData.sort(function(_, v) {
        const S = _.sortKeys[g], w = v.sortKeys[g];
        return a ? (S - w) * i : s(S, w) * i;
      });
    }
  }, e.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(r) {
      const n = document.createElement("col");
      n.style.width = r.offsetWidth + "px", t.appendChild(n);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, e.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const t = this._sliceData && this._sliceData.length > 0, r = t ? this.visibleCount : this._lastTotal, n = this.visibleCount;
        if (r === 0) {
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
      const t = this._filteredData, r = document.createDocumentFragment();
      for (let n = 0; n < t.length; n++) {
        const c = this._buildRow(t[n]);
        if (!c) break;
        r.appendChild(c);
      }
      this.tbody.textContent = "", this.tbody.appendChild(r), this._selectable && this._updateSelectAll();
    } else {
      const t = [], r = this._filteredData;
      for (let n = 0; n < r.length; n++) t.push(r[n].html);
      this.tbody.innerHTML = t.join("");
    }
  }, e.prototype._measureRowHeight = function() {
    if (this._rowHeight) return;
    const t = this._sliceData && this._sliceData.length > 0;
    if (!t && !this.isDataDriven) {
      const c = this.tbody ? this.tbody.rows : [];
      c.length > 0 && (this._rowHeight = c[0].offsetHeight || 40);
      return;
    }
    let r = null;
    if (t) {
      for (let c = 0; c < this._sliceData.length; c++)
        if (this._sliceData[c]) {
          r = this._sliceData[c];
          break;
        }
    }
    if (!r && this._data.length > 0 && (r = this._data[0]), !r) return;
    const n = this._buildRow(r);
    n && (this.tbody.textContent = "", this.tbody.appendChild(n), this._rowHeight = n.offsetHeight || 40, this.tbody.textContent = "");
  }, e.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    this._measureRowHeight(), this.isDataDriven ? this._scrollContainer = d(this.dom) : this._scrollContainer = null;
    const r = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, r.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    const t = this._sliceData && this._sliceData.length > 0, r = t ? this._sliceData : this._filteredData, n = t ? this.visibleCount : r.length, c = this._rowHeight;
    if (!c || !n) return;
    const m = this.thead ? this.thead.offsetHeight : 0, g = this._scrollContainer;
    let i, a;
    if (g) {
      const C = this.table.getBoundingClientRect(), T = g.getBoundingClientRect(), q = C.top - T.top + g.scrollTop + m;
      i = g.scrollTop - q, a = g.clientHeight;
    } else {
      const q = this.table.getBoundingClientRect().top + window.scrollY + m;
      i = window.scrollY - q, a = window.innerHeight;
    }
    let s = Math.max(0, Math.floor(i / c) - 15);
    s = Math.min(s, n);
    const _ = Math.min(s + Math.ceil(a / c) + 30, n);
    if (s === this._vStart && _ === this._vEnd) return;
    this._vStart = s, this._vEnd = _;
    const v = this.ths.length || 1, S = s * c, w = (n - _) * c;
    if (this.isDataDriven) {
      const C = document.createDocumentFragment();
      if (S > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const q = document.createElement("td");
        q.setAttribute("colspan", v), q.style.height = S + "px", T.appendChild(q), C.appendChild(T);
      }
      for (let T = s; T < _; T++)
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
          const q = this._buildRow(r[T]);
          q && C.appendChild(q);
        }
      if (w > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const q = document.createElement("td");
        q.setAttribute("colspan", v), q.style.height = w + "px", T.appendChild(q), C.appendChild(T);
      }
      this.tbody.textContent = "", this.tbody.appendChild(C), this._selectable && this._updateSelectAll(), t && this._ensureSlice(s, _);
    } else {
      let C = "";
      S > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + v + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
      for (let T = s; T < _; T++) C += r[T].html;
      w > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + v + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
    }
  }, e.prototype._buildPlaceholderRow = function() {
    const t = document.createElement("tr");
    t.className = "ln-table__placeholder", t.setAttribute("aria-hidden", "true");
    const r = document.createElement("td");
    return r.setAttribute("colspan", this.ths.length || 1), r.style.height = this._rowHeight + "px", t.appendChild(r), t;
  }, e.prototype._ensureSlice = function(t, r) {
    const n = this._sliceData ? this._sliceData.length : 0;
    if (n === 0 || this.visibleCount === 0) return;
    const c = 25, m = Math.max(0, t - c), g = Math.min(this.visibleCount, r + c), i = n, a = Math.floor(m / i), s = Math.floor(Math.max(0, g - 1) / i);
    let _ = -1;
    for (let C = a; C <= s; C++) {
      const T = C * i;
      if (T < this._sliceOffset || T >= this._sliceOffset + n) {
        _ = C;
        break;
      }
    }
    if (_ === -1) return;
    const v = _ * i, S = i;
    this._debounceId && clearTimeout(this._debounceId);
    const w = this;
    this._debounceId = setTimeout(function() {
      w.dom.classList.add("ln-table--loading"), A(w.dom, "ln-table:request-data", {
        table: w.name,
        sort: w.currentSort,
        offset: v,
        limit: S
      });
    }, 120);
  }, e.prototype._showEmptyState = function() {
    const t = this.ths.length || 1;
    this.tbody.textContent = "";
    let r = null;
    if (this.isDataDriven) {
      const n = this._lastTotal != null ? this._lastTotal : this._data.length, m = this.visibleCount < n, g = m ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = mt(this.dom, g, "ln-table"), !r) {
        const i = this.dom.querySelector("template[data-ln-table-empty]");
        if (i) {
          const a = m ? "search" : "initial", s = i.content.querySelector('[data-ln-table-empty-when="' + a + '"]') || i.content.firstElementChild;
          s && (r = document.importNode(s, !0));
        }
      }
      if (r)
        if (r.tagName === "TR")
          this.tbody.appendChild(r);
        else {
          const i = document.createElement("td");
          i.setAttribute("colspan", String(t)), i.appendChild(r);
          const a = document.createElement("tr");
          a.className = "ln-table__empty", a.appendChild(i), this.tbody.appendChild(a);
        }
    } else {
      const n = this.dom.querySelector("template[" + y + "]"), c = document.createElement("td");
      c.setAttribute("colspan", String(t)), n && c.appendChild(document.importNode(n.content, !0));
      const m = document.createElement("tr");
      m.className = "ln-table__empty", m.appendChild(c), this.tbody.appendChild(m);
    }
    A(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, e.prototype._fillRow = function(t, r) {
    wt(t, r);
    const n = t.querySelectorAll("[data-ln-table-cell-attr]");
    for (let c = 0; c < n.length; c++) {
      const m = n[c], g = m.getAttribute("data-ln-table-cell-attr").split(",");
      for (let i = 0; i < g.length; i++) {
        const a = g[i].trim().split(":");
        if (a.length !== 2) continue;
        const s = a[0].trim(), _ = a[1].trim();
        r[s] != null && m.setAttribute(_, r[s]);
      }
    }
  }, e.prototype._buildRow = function(t) {
    const r = mt(this.dom, this.name + "-row", "ln-table");
    if (!r) return null;
    const n = r.querySelector("[data-ln-table-row]") || r.firstElementChild;
    if (!n) return null;
    if (this._fillRow(n, t), n._lnRecord = t, t.id != null && n.setAttribute("data-ln-table-row-id", t.id), this._selectable && t.id != null && this.selectedIds.has(String(t.id))) {
      n.classList.add("ln-row-selected");
      const c = n.querySelector("[data-ln-table-row-select]");
      c && (c.checked = !0);
    }
    return n;
  }, e.prototype._handleSort = function(t, r) {
    let n;
    !this.currentSort || this.currentSort.field !== t ? n = "asc" : this.currentSort.direction === "asc" ? n = "desc" : n = null;
    for (let c = 0; c < this.ths.length; c++)
      this.ths[c].classList.remove("ln-sort-asc", "ln-sort-desc");
    n ? (this.currentSort = { field: t, direction: n }, r.classList.add(n === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, A(this.dom, "ln-table:sort", {
      table: this.name,
      field: t,
      direction: n
    }), this._requestData();
  }, e.prototype._requestData = function() {
    if (this._sliceData && this._sliceData.length > 0) {
      this.dom.classList.add("ln-table--loading");
      const r = this._sliceData.length || 200;
      this._sliceOffset = 0, this._sliceData = [], A(this.dom, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        offset: 0,
        limit: r
      });
      return;
    }
    qe(this, "ln-table:request-data", "table");
  }, e.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const t = this.tbody.querySelectorAll("[data-ln-table-row]");
    let r = t.length > 0;
    for (let n = 0; n < t.length; n++) {
      const c = t[n].getAttribute("data-ln-table-row-id");
      if (c != null && !this.selectedIds.has(c)) {
        r = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = r;
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
    if (this._onSelectionChange = function(r) {
      const n = r.target.closest("[data-ln-table-row-select]");
      if (!n) return;
      const c = n.closest("[data-ln-table-row]");
      if (!c) return;
      const m = c.getAttribute("data-ln-table-row-id");
      m != null && (n.checked ? (t.selectedIds.add(m), c.classList.add("ln-row-selected")) : (t.selectedIds.delete(m), c.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), A(t.dom, "ln-table:select", {
        table: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const r = document.createElement("input");
      r.type = "checkbox";
      const n = t.dom.querySelector('[data-ln-table-dict="select-all"]'), c = t.dom.getAttribute("data-ln-table-select-all-label") || (n ? n.textContent.trim() : null) || "Select all";
      r.setAttribute("aria-label", c), this._selectAllCheckbox.appendChild(r), this._selectAllCheckbox = r;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const r = t._selectAllCheckbox.checked, n = t.tbody ? t.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let c = 0; c < n.length; c++) {
        const m = n[c].getAttribute("data-ln-table-row-id"), g = n[c].querySelector("[data-ln-table-row-select]");
        m != null && (r ? (t.selectedIds.add(m), n[c].classList.add("ln-row-selected")) : (t.selectedIds.delete(m), n[c].classList.remove("ln-row-selected")), g && (g.checked = r));
      }
      t.selectedCount = t.selectedIds.size, A(t.dom, "ln-table:select-all", {
        table: t.name,
        selected: r
      }), A(t.dom, "ln-table:select", {
        table: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedCount
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let n = 0; n < r.length; n++) {
        const c = r[n].querySelector("[data-ln-table-row-select]"), m = r[n].getAttribute("data-ln-table-row-id");
        c && c.checked && m != null && (this.selectedIds.add(m), r[n].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, e.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const t = this.dom.querySelector("[data-ln-table-col-select]");
    if (t) {
      const r = t.querySelector('input[type="checkbox"]');
      r && r.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const r = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let n = 0; n < r.length; n++) {
        r[n].classList.remove("ln-row-selected");
        const c = r[n].querySelector("[data-ln-table-row-select]");
        c && (c.checked = !1);
      }
    }
    this._updateFooter();
  }, e.prototype._updateFooter = function() {
    let t = 0, r = 0;
    this.isDataDriven ? (t = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount) : (t = this._data.length, r = this._filteredData.length);
    const n = r < t;
    if (this._totalSpan && (this._totalSpan.textContent = o(t, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = n ? o(r, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n), this._selectedSpan) {
      const c = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = c > 0 ? o(c, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", c === 0);
    }
  }, e.prototype._focusRow = function(t) {
    for (let r = 0; r < t.length; r++)
      t[r].classList.remove("ln-row-focused"), t[r].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < t.length) {
      const r = t[this._focusedRowIndex];
      r.classList.add("ln-row-focused"), r.setAttribute("tabindex", "0"), r.focus(), r.scrollIntoView({ block: "nearest" });
    }
  }, e.prototype.destroy = function() {
    this.dom[l] && (this._disableVirtualScroll(), this._debounceId && (clearTimeout(this._debounceId), this._debounceId = null), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:set-filter", this._onSetFilter), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll)) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-table:sort", this._onSort)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[l]);
  }, H(h, l, e, "ln-table");
})();
(function() {
  const h = "data-ln-table-coordinator", l = "lnTableCoordinator";
  if (window[l] !== void 0) return;
  function b(p, f) {
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
      const o = p.closest("[" + h + "]");
      if (o) {
        const e = o.querySelector("[data-ln-table]");
        if (e) return e;
      }
      const d = p.closest("[data-ln-table]");
      if (d) return d;
    }
    return document.querySelector("[data-ln-table]");
  }
  document.addEventListener("ln-search:change", function(p) {
    const f = p.detail && p.detail.term != null ? p.detail.term : "", u = p.target, o = u.getAttribute ? u.getAttribute("data-ln-search") : null, d = b(u, o);
    if (!d || !d.lnTable) return;
    p.preventDefault();
    const e = u.tagName === "INPUT" || u.tagName === "TEXTAREA" ? u : u.querySelector ? u.querySelector('input[type="search"], input[type="text"], input') : null;
    e && e.value !== f && (e.value = f), A(d, "ln-table:set-search", {
      query: f,
      term: f,
      table: d.lnTable.name || d.id
    });
  }), document.addEventListener("ln-filter:changed", function(p) {
    if (!p.detail) return;
    const f = p.detail.key, u = p.detail.values || [], o = p.target;
    if (!o.hasAttribute || !o.hasAttribute("data-ln-filter")) return;
    const d = o.getAttribute ? o.getAttribute("data-ln-filter") : null, e = b(o, d);
    if (!e || !e.lnTable) return;
    const t = e.querySelectorAll("th");
    for (let r = 0; r < t.length; r++)
      if (t[r].getAttribute("data-ln-table-filter-col") === f) {
        const n = t[r].querySelector("[data-ln-table-col-filter]");
        n && n.classList.toggle("ln-filter-active", u.length > 0);
        break;
      }
    A(e, "ln-table:set-filter", {
      key: f,
      values: u,
      table: e.lnTable.name || e.id
    });
  }), document.addEventListener("click", function(p) {
    const f = p.target.closest("[data-ln-table-clear-all], [data-ln-table-clear]");
    if (!f) return;
    const u = b(f);
    if (!u || !u.lnTable) return;
    const o = u.querySelectorAll("th");
    for (let c = 0; c < o.length; c++) {
      const m = o[c].querySelector("[data-ln-table-col-filter]");
      m && m.classList.remove("ln-filter-active");
    }
    const e = f.closest("[" + h + "]") || document, t = u.id, r = t && e.querySelector('[data-ln-search="' + t + '"]') || e.querySelector("[data-ln-search]");
    if (r) {
      const c = r.tagName === "INPUT" || r.tagName === "TEXTAREA" ? r : r.querySelector("input");
      c && (c.value = "");
    }
    const n = t && e.querySelectorAll('[data-ln-filter="' + t + '"]') || e.querySelectorAll("[data-ln-filter]");
    for (let c = 0; c < n.length; c++) {
      const m = n[c].querySelector("[data-ln-filter-reset]");
      m && (m.checked = !0, m.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    A(u, "ln-table:request-clear-filters", {
      table: u.lnTable.name || u.id
    });
  }), document.addEventListener("keydown", function(p) {
    if (p.key !== "/" || p.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
    const f = document.querySelector("[" + h + "] [data-ln-search]") || document.querySelector("[data-ln-search]");
    if (!f) return;
    const u = f.tagName === "INPUT" || f.tagName === "TEXTAREA" ? f : f.querySelector('input[type="search"], input[type="text"], input');
    u && (p.preventDefault(), u.focus());
  });
  function y(p) {
    return this.dom = p, this;
  }
  y.prototype.destroy = function() {
    this.dom[l] && delete this.dom[l];
  }, H(h, l, y, "ln-table-coordinator");
})();
(function() {
  const h = "data-ln-list", l = "lnList", b = "data-ln-list-empty";
  if (window[l] !== void 0) return;
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
  function o(e) {
    if (!e) return 0;
    const t = getComputedStyle(e), r = parseFloat(t.marginTop) || 0, n = parseFloat(t.marginBottom) || 0;
    return e.offsetHeight + r + n;
  }
  function d(e) {
    this.dom = e, this.tbody = e.querySelector("[data-ln-list-body]") || e, this.isDataDriven = e.hasAttribute("data-ln-list-source"), this.name = e.getAttribute(h) || "", this.source = e.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const t = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.selectedIds = /* @__PURE__ */ new Set(), this._sliceOffset = 0, this._sliceData = [], this._debounceId = null, this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = e.querySelector("[data-ln-list-total]"), this._filteredSpan = e.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== e ? this._filteredSpan.parentElement : null), this._selectedSpan = e.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== e ? this._selectedSpan.parentElement : null), this._onSetData = function(r) {
      const n = r.detail || {};
      if (n.offset != null) {
        t._sliceOffset = n.offset, t._sliceData = n.data || [], t._lastTotal = n.total != null ? n.total : t._lastTotal, t._lastFiltered = n.filtered != null ? n.filtered : t._lastFiltered, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._selectable && t._selectAllCheckbox && t._selectAllCheckbox.classList.add("hidden"), e.classList.remove("ln-list--loading"), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter(), A(e, "ln-list:rendered", {
          list: t.name,
          total: t.totalCount,
          visible: t.visibleCount
        });
        return;
      }
      t._data = n.data || [], t._sliceOffset = 0, t._sliceData = [], t._lastTotal = n.total != null ? n.total : t._data.length, t._lastFiltered = n.filtered != null ? n.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._selectable && t._selectAllCheckbox && t._selectAllCheckbox.classList.remove("hidden"), e.classList.remove("ln-list--loading"), t._vStart = -1, t._vEnd = -1, t._applyFilterAndSort(), t._render(), t._updateFooter(), A(e, "ln-list:rendered", {
        list: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, e.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(r) {
      const n = r.detail && r.detail.loading;
      e.classList.toggle("ln-list--loading", !!n), n && (t.isLoaded = !1);
    }, e.addEventListener("ln-list:set-loading", this._onSetLoading), this._selectable = e.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(r) {
      if (r.target.closest("[data-ln-item-select]") || r.target.closest("[data-ln-item-action]") || r.target.closest("a") || r.target.closest("button") || r.ctrlKey || r.metaKey || r.button === 1) return;
      const n = r.target.closest("[data-ln-item]");
      if (!n) return;
      const c = n.getAttribute("data-ln-item-id"), m = n._lnRecord || {};
      A(e, "ln-list:item-click", {
        list: t.name,
        id: c,
        record: m
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(r) {
      const n = r.target.closest("[data-ln-item-action]");
      if (!n) return;
      r.stopPropagation();
      const c = n.closest("[data-ln-item]");
      if (!c) return;
      const m = n.getAttribute("data-ln-item-action"), g = c.getAttribute("data-ln-item-id"), i = c._lnRecord || {};
      A(e, "ln-list:item-action", {
        list: t.name,
        id: g,
        action: m,
        record: i
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), A(e, "ln-list:request-data", {
      list: this.name
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      t.tbody.children.length > 0 && (t._emptyObserver.disconnect(), t._emptyObserver = null, t._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(r) {
      r.preventDefault(), t._searchTerm = r.detail && r.detail.term || "", t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), A(e, "ln-list:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-search:change", this._onSearch)), this._onClear = function(r) {
      if (!r.target.closest("[data-ln-list-clear]") || Y(e, "ln-list:before-clear-search", { list: t.name }).defaultPrevented) return;
      t.isDataDriven || (t._searchTerm = "");
      const m = t.isDataDriven ? t.source : e.id, g = document.querySelector('[data-ln-search="' + m + '"]');
      if (g) {
        const i = g.tagName === "INPUT" ? g : g.querySelector("input");
        i && (i.value = "", i.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
      t.isDataDriven || (t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), A(e, "ln-list:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      }));
    }, e.addEventListener("click", this._onClear), this;
  }
  d.prototype._parseChildren = function() {
    const e = Array.from(this.tbody.children).filter((t) => !t.classList.contains("ln-list__spacer"));
    this._data = [], e.length > 0 && (this._itemHeight = o(e[0]) || 50);
    for (let t = 0; t < e.length; t++) {
      const r = e[t], n = r.getAttribute("data-ln-item-id") || r.getAttribute("id"), c = r.textContent.trim().toLowerCase();
      let m = null;
      if (this.isDataDriven) {
        m = {}, n != null && (m.id = n);
        const g = r.querySelectorAll("[data-ln-list-field]");
        for (let i = 0; i < g.length; i++) {
          const a = g[i], s = a.getAttribute("data-ln-list-field");
          s && (m[s] = a.textContent.trim());
        }
      }
      this._data.push({
        html: r.outerHTML,
        searchText: c,
        id: n,
        ...m
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), A(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, d.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data.slice(), this.visibleCount = this._filteredData.length;
    else {
      const e = this._searchTerm;
      e ? this._filteredData = this._data.filter(function(t) {
        return t.searchText.indexOf(e) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, d.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const e = this._sliceData && this._sliceData.length > 0, t = e ? this.visibleCount : this._lastTotal, r = this.visibleCount;
        if (t === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (!e && (this._filteredData.length === 0 || r === 0)) {
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
      for (let r = 0; r < e.length; r++) {
        const n = this._buildItem(e[r]);
        if (!n) break;
        t.appendChild(n);
      }
      this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
    } else {
      const e = [], t = this._filteredData;
      for (let r = 0; r < t.length; r++) e.push(t[r].html);
      this.tbody.innerHTML = e.join("");
    }
  }, d.prototype._readGridLayout = function() {
    const e = getComputedStyle(this.tbody), t = e.gridTemplateColumns;
    let r = 1;
    if (t && t !== "none") {
      const c = t.trim().split(/\s+/).filter(Boolean);
      c.length > 0 && (r = c.length);
    }
    const n = parseFloat(e.rowGap);
    return { columns: r, rowGap: isNaN(n) ? 0 : n };
  }, d.prototype._measureItemHeight = function() {
    if (this._itemHeight) return;
    const e = this._sliceData && this._sliceData.length > 0;
    if (!e && !this.isDataDriven) {
      const n = this.tbody.children;
      n.length > 0 && (this._itemHeight = o(n[0]) || 50);
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
    const r = this._buildItem(t);
    r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._itemHeight = o(r) || 50, this.tbody.textContent = "");
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
    const e = this._sliceData && this._sliceData.length > 0, t = e ? this._sliceData : this._filteredData, r = e ? this.visibleCount : t.length, n = this._itemHeight;
    if (!n || !r) return;
    const c = this._scrollContainer;
    let m, g;
    if (c) {
      const D = this.tbody.getBoundingClientRect(), M = c.getBoundingClientRect(), F = c === this.tbody ? 0 : D.top - M.top + c.scrollTop;
      m = c.scrollTop - F, g = c.clientHeight;
    } else {
      const M = this.tbody.getBoundingClientRect().top + window.scrollY;
      m = window.scrollY - M, g = window.innerHeight;
    }
    const i = this._readGridLayout(), a = i.columns, s = i.rowGap, _ = n + s, v = Math.ceil(r / a);
    let S = Math.max(0, Math.floor(m / _) - 15);
    S = Math.min(S, v);
    const w = Math.ceil(g / _) + 30, C = Math.min(S + w, v), T = Math.min(S * a, r), q = Math.min(C * a, r);
    if (T === this._vStart && q === this._vEnd) return;
    this._vStart = T, this._vEnd = q;
    const x = S * _, I = (v - C) * _;
    if (this.isDataDriven) {
      const D = document.createDocumentFragment();
      if (x > 0) {
        const M = document.createElement(this.isUl ? "li" : "div");
        M.className = "ln-list__spacer", M.style.height = x + "px", D.appendChild(M);
      }
      for (let M = T; M < q; M++)
        if (e)
          if (M >= this._sliceOffset && M < this._sliceOffset + this._sliceData.length) {
            const F = this._sliceData[M - this._sliceOffset];
            if (F) {
              const z = this._buildItem(F);
              z && D.appendChild(z);
            } else
              D.appendChild(this._buildPlaceholderItem());
          } else
            D.appendChild(this._buildPlaceholderItem());
        else {
          const F = this._buildItem(t[M]);
          F && D.appendChild(F);
        }
      if (I > 0) {
        const M = document.createElement(this.isUl ? "li" : "div");
        M.className = "ln-list__spacer", M.style.height = I + "px", D.appendChild(M);
      }
      this.tbody.textContent = "", this.tbody.appendChild(D), this._selectable && this._updateSelectAll(), e && this._ensureSlice(T, q);
    } else {
      let D = "";
      x > 0 && (D += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${x}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let M = T; M < q; M++)
        D += t[M].html;
      I > 0 && (D += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${I}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = D;
    }
  }, d.prototype._buildPlaceholderItem = function() {
    const e = document.createElement(this.isUl ? "li" : "div");
    return e.className = "ln-list__placeholder", e.setAttribute("aria-hidden", "true"), e.style.height = this._itemHeight + "px", e;
  }, d.prototype._ensureSlice = function(e, t) {
    const r = this._sliceData ? this._sliceData.length : 0;
    if (r === 0 || this.visibleCount === 0) return;
    const n = 25, c = Math.max(0, e - n), m = Math.min(this.visibleCount, t + n), g = r, i = Math.floor(c / g), a = Math.floor(Math.max(0, m - 1) / g);
    let s = -1;
    for (let w = i; w <= a; w++) {
      const C = w * g;
      if (C < this._sliceOffset || C >= this._sliceOffset + r) {
        s = w;
        break;
      }
    }
    if (s === -1) return;
    const _ = s * g, v = g;
    this._debounceId && clearTimeout(this._debounceId);
    const S = this;
    this._debounceId = setTimeout(function() {
      S.dom.classList.add("ln-list--loading"), A(S.dom, "ln-list:request-data", {
        list: S.name,
        offset: _,
        limit: v
      });
    }, 120);
  }, d.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let e = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount < t, c = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (e = mt(this.dom, c, "ln-list"), !e) {
        const m = this.dom.querySelector("template[data-ln-empty]");
        if (m) {
          const g = n ? "search" : "initial", i = m.content.querySelector(`[data-ln-empty-when="${g}"]`) || m.content.firstElementChild;
          i && (e = document.importNode(i, !0));
        }
      }
    } else {
      const t = this.dom.querySelector(`template[${b}]`);
      t && (e = document.importNode(t.content, !0));
    }
    if (e)
      if (e.tagName === "LI" || e.tagName === "TR")
        this.tbody.appendChild(e);
      else {
        const t = document.createElement(this.isUl ? "li" : "div");
        t.appendChild(e), this.tbody.appendChild(t);
      }
    A(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, d.prototype._buildItem = function(e) {
    const t = mt(this.dom, this.name + "-row", "ln-list");
    if (!t) return null;
    const r = t.querySelector("[data-ln-item]") || t.firstElementChild;
    if (!r) return null;
    if (wt(r, e), it(r, e), r._lnRecord = e, e.id != null && (r.setAttribute("data-ln-item-id", e.id), this._selectable && this.selectedIds.has(String(e.id)))) {
      r.classList.add("ln-item-selected");
      const n = r.querySelector("[data-ln-item-select]");
      n && (n.checked = !0);
    }
    return r;
  }, d.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const e = this;
    this._onSelectionChange = function(t) {
      const r = t.target.closest("[data-ln-item-select]");
      if (!r) return;
      const n = r.closest("[data-ln-item]");
      if (!n) return;
      const c = n.getAttribute("data-ln-item-id");
      c != null && (r.checked ? (e.selectedIds.add(String(c)), n.classList.add("ln-item-selected")) : (e.selectedIds.delete(String(c)), n.classList.remove("ln-item-selected")), e._updateSelectAll(), e._updateFooter(), A(e.dom, "ln-list:select", {
        list: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const t = e._selectAllCheckbox.checked, r = e.tbody.querySelectorAll("[data-ln-item]");
      for (let n = 0; n < r.length; n++) {
        const c = r[n], m = c.getAttribute("data-ln-item-id"), g = c.querySelector("[data-ln-item-select]");
        m != null && (t ? (e.selectedIds.add(String(m)), c.classList.add("ln-item-selected")) : (e.selectedIds.delete(String(m)), c.classList.remove("ln-item-selected")), g && (g.checked = t));
      }
      A(e.dom, "ln-list:select-all", { list: e.name, selected: t }), A(e.dom, "ln-list:select", {
        list: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedIds.size
      }), e._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, d.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const e = this.tbody.querySelectorAll("[data-ln-item]");
    let t = e.length > 0;
    for (let r = 0; r < e.length; r++) {
      const n = e[r].getAttribute("data-ln-item-id");
      if (n != null && !this.selectedIds.has(String(n))) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, d.prototype._updateFooter = function() {
    let e = 0, t = 0;
    this.isDataDriven ? (e = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount) : (e = this._data.length, t = this._filteredData.length);
    const r = t < e;
    if (this._totalSpan && (this._totalSpan.textContent = f(e, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = r ? f(t, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !r), this._selectedSpan) {
      const n = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = n > 0 ? f(n, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", n === 0);
    }
  }, d.prototype.destroy = function() {
    this.dom[l] && (this._disableVirtualScroll(), this._debounceId && (clearTimeout(this._debounceId), this._debounceId = null), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch)), this._onClear && this.dom.removeEventListener("click", this._onClear), this._data = [], this._filteredData = [], delete this.dom[l]);
  }, H(h, l, d, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", l = "lnCircularProgress";
  if (window[l] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", y = 36, p = 16, f = 2 * Math.PI * p;
  function u(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, d.call(this), t.call(this), e.call(this), this;
  }
  u.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("role"), this.dom.removeAttribute("aria-valuemin"), this.dom.removeAttribute("aria-valuemax"), this.dom.removeAttribute("aria-valuenow"), this.dom.removeAttribute("aria-valuetext"), delete this.dom[l]);
  };
  function o(r, n) {
    const c = document.createElementNS(b, r);
    for (const m in n)
      c.setAttribute(m, n[m]);
    return c;
  }
  function d() {
    this.svg = o("svg", {
      viewBox: "0 0 " + y + " " + y,
      "aria-hidden": "true"
    }), this.trackCircle = o("circle", {
      cx: y / 2,
      cy: y / 2,
      r: p,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = o("circle", {
      cx: y / 2,
      cy: y / 2,
      r: p,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": f,
      "stroke-dashoffset": f,
      transform: "rotate(-90 " + y / 2 + " " + y / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function e() {
    const r = this, n = new MutationObserver(function(c) {
      for (const m of c)
        (m.attributeName === "data-ln-circular-progress" || m.attributeName === "data-ln-circular-progress-max" || m.attributeName === "data-ln-circular-progress-label") && t.call(r);
    });
    n.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max", "data-ln-circular-progress-label"]
    }), this._attrObserver = n;
  }
  function t() {
    const r = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, n = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let c = n > 0 ? r / n * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100);
    const m = f - c / 100 * f;
    this.progressCircle.setAttribute("stroke-dashoffset", m);
    const g = this.dom.getAttribute("data-ln-circular-progress-label"), i = g !== null ? g : Math.round(c) + "%";
    this.labelEl.textContent = i, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(n));
    const a = Math.max(0, Math.min(r, n));
    this.dom.setAttribute("aria-valuenow", String(a)), this.dom.setAttribute("aria-valuetext", i), A(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: r,
      max: n,
      percentage: c
    });
  }
  H(h, l, u, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", l = "lnSortable", b = "data-ln-sortable-handle";
  if (window[l] !== void 0) return;
  function y(f) {
    this.dom = f, this.isEnabled = f.getAttribute(h) !== "disabled", this._dragging = null, f.setAttribute("aria-roledescription", "sortable list");
    const u = this;
    return this._onPointerDown = function(o) {
      u.isEnabled && u._handlePointerDown(o);
    }, f.addEventListener("pointerdown", this._onPointerDown), this;
  }
  y.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, y.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, y.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), A(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[l]);
  }, y.prototype._handlePointerDown = function(f) {
    let u = f.target.closest("[" + b + "]"), o;
    if (u) {
      for (o = u; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (o = f.target; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
      u = o;
    }
    const e = Array.from(this.dom.children).indexOf(o);
    if (Y(this.dom, "ln-sortable:before-drag", {
      item: o,
      index: e
    }).defaultPrevented) return;
    f.preventDefault(), u.setPointerCapture(f.pointerId), this._dragging = o, o.classList.add("ln-sortable--dragging"), o.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), A(this.dom, "ln-sortable:drag-start", {
      item: o,
      index: e
    });
    const r = this, n = function(m) {
      r._handlePointerMove(m);
    }, c = function(m) {
      r._handlePointerEnd(m), u.removeEventListener("pointermove", n), u.removeEventListener("pointerup", c), u.removeEventListener("pointercancel", c);
    };
    u.addEventListener("pointermove", n), u.addEventListener("pointerup", c), u.addEventListener("pointercancel", c);
  }, y.prototype._handlePointerMove = function(f) {
    if (!this._dragging) return;
    const u = Array.from(this.dom.children), o = this._dragging;
    for (const d of u)
      d.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const d of u) {
      if (d === o) continue;
      const e = d.getBoundingClientRect(), t = e.top + e.height / 2;
      if (f.clientY >= e.top && f.clientY < t) {
        d.classList.add("ln-sortable--drop-before");
        break;
      } else if (f.clientY >= t && f.clientY <= e.bottom) {
        d.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, y.prototype._handlePointerEnd = function(f) {
    if (!this._dragging) return;
    const u = this._dragging, o = Array.from(this.dom.children), d = o.indexOf(u);
    let e = null, t = null;
    for (const r of o) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        e = r, t = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        e = r, t = "after";
        break;
      }
    }
    for (const r of o)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (u.classList.remove("ln-sortable--dragging"), u.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== u) {
      t === "before" ? this.dom.insertBefore(u, e) : this.dom.insertBefore(u, e.nextElementSibling);
      const n = Array.from(this.dom.children).indexOf(u);
      A(this.dom, "ln-sortable:reordered", {
        item: u,
        oldIndex: d,
        newIndex: n
      });
    }
    this._dragging = null;
  };
  function p(f) {
    const u = f[l];
    if (!u) return;
    const o = f.getAttribute(h) !== "disabled";
    o !== u.isEnabled && (u.isEnabled = o, A(f, o ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: f }));
  }
  H(h, l, y, "ln-sortable", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-confirm", l = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[l] !== void 0) return;
  function p(...u) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...u);
  }
  function f(u) {
    p("constructor called on", u), this.dom = u, this.confirming = !1, this.revertTimer = null, this._submitted = !1, this.idleEl = u.querySelector("[data-ln-confirm-idle]"), this.activeEl = u.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.isTwoElementMode ? (this.originalText = "", this.confirmText = "") : (this.originalText = u.textContent.trim(), this.confirmText = u.getAttribute(h) || "Confirm?");
    const o = this;
    return this._onClick = function(d) {
      if (p("click handler, confirming:", o.confirming, "submitted:", o._submitted, "target:", d.target), !o.confirming)
        d.preventDefault(), d.stopImmediatePropagation(), o._enterConfirm();
      else {
        if (o._submitted) return;
        o._submitted = !0, o._reset();
      }
    }, u.addEventListener("click", this._onClick), this;
  }
  f.prototype._getTimeout = function() {
    const u = parseFloat(this.dom.getAttribute(b));
    return isNaN(u) || u <= 0 ? 3 : u;
  }, f.prototype._enterConfirm = function() {
    if (this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const o = this.activeEl ? this.activeEl.textContent.trim() : "";
      o && (this.dom.setAttribute("aria-label", o), this.dom.setAttribute("aria-live", "polite"));
    } else {
      var u = this.dom.querySelector("svg.ln-icon use");
      u && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = u.getAttribute("href"), u.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.dom.setAttribute("aria-label", this.confirmText), this.dom.setAttribute("aria-live", "polite")) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), A(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, f.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const u = this, o = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      u._reset();
    }, o);
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
    p("destroy called on", this.dom), this.dom[l] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[l]);
  }, H(h, l, f, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", l = "lnTranslations";
  if (window[l] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function y(p) {
    this.dom = p, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = p.getAttribute(h + "-default") || "", this.placeholderLabel = p.getAttribute(h + "-placeholder") || "{lang} translation", this.removeLabel = p.getAttribute(h + "-remove-label") || "Remove {lang}", this.badgesEl = p.querySelector("[" + h + "-active]"), this.menuEl = p.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const f = p.getAttribute(h + "-locales");
    if (this.locales = b, f)
      try {
        this.locales = JSON.parse(f);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const u = this;
    return this._onRequestAdd = function(o) {
      o.detail && o.detail.lang && u.addLanguage(o.detail.lang);
    }, this._onRequestRemove = function(o) {
      o.detail && o.detail.lang && u.removeLanguage(o.detail.lang);
    }, p.addEventListener("ln-translations:request-add", this._onRequestAdd), p.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  y.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of p) {
      const u = f.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const o of u)
        o.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, y.prototype._detectExisting = function() {
    const p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const f of p) {
      const u = f.getAttribute("data-ln-translatable-lang");
      u && u !== this.defaultLang && this.activeLanguages.add(u);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, y.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const p = this;
    let f = 0;
    for (const o in this.locales) {
      if (!this.locales.hasOwnProperty(o) || this.activeLanguages.has(o)) continue;
      f++;
      const d = It("ln-translations-menu-item", "ln-translations");
      if (!d) return;
      const e = d.querySelector("[data-ln-translations-lang]");
      e.setAttribute("data-ln-translations-lang", o), e.textContent = this.locales[o], e.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), p.menuEl.getAttribute("data-ln-toggle") === "open" && p.menuEl.setAttribute("data-ln-toggle", "close"), p.addLanguage(o));
      }), this.menuEl.appendChild(d);
    }
    const u = this.dom.querySelector("[" + h + "-add]");
    u && (u.hidden = f === 0);
  }, y.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const p = this;
    this.activeLanguages.forEach(function(f) {
      const u = It("ln-translations-badge", "ln-translations");
      if (!u) return;
      const o = u.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", f);
      const d = o.querySelector("span");
      d.textContent = p.locales[f] || f.toUpperCase();
      const e = o.querySelector("button"), t = p.locales[f] || f.toUpperCase();
      e.setAttribute("aria-label", p.removeLabel.replace("{lang}", t)), e.addEventListener("click", function(r) {
        r.ctrlKey || r.metaKey || r.button === 1 || (r.preventDefault(), r.stopPropagation(), p.removeLanguage(f));
      }), p.badgesEl.appendChild(u);
    });
  }, y.prototype.addLanguage = function(p, f) {
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
      const t = e.getAttribute("data-ln-translatable"), r = e.getAttribute("data-ln-translations-prefix") || "", n = e.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!n) continue;
      const c = n.cloneNode(n.tagName === "SELECT");
      r ? c.name = r + "[trans][" + p + "][" + t + "]" : c.name = "trans[" + p + "][" + t + "]", c.value = f[t] !== void 0 ? f[t] : "", c.removeAttribute("id"), "placeholder" in c && (c.placeholder = this.placeholderLabel.replace("{lang}", u)), c.setAttribute("data-ln-translatable-lang", p);
      const m = e.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), g = m.length > 0 ? m[m.length - 1] : n;
      g.parentNode.insertBefore(c, g.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), A(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: p,
      langName: u
    });
  }, y.prototype.removeLanguage = function(p) {
    if (!this.activeLanguages.has(p) || Y(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: p
    }).defaultPrevented) return;
    const u = this.dom.querySelectorAll('[data-ln-translatable-lang="' + p + '"]');
    for (const o of u)
      o.parentNode.removeChild(o);
    this.activeLanguages.delete(p), this._updateDropdown(), this._updateBadges(), A(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: p
    });
  }, y.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, y.prototype.hasLanguage = function(p) {
    return this.activeLanguages.has(p);
  }, y.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const p = this.defaultLang, f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const u of f)
      u.getAttribute("data-ln-translatable-lang") !== p && u.parentNode.removeChild(u);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[l];
  }, H(h, l, y, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", l = "lnAutosave", b = "data-ln-autosave-clear", y = "data-ln-autosave-debounce-input", p = "ln-autosave:";
  if (window[l] !== void 0) return;
  function u(t) {
    const r = o(t);
    if (!r) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = r;
    let n = null;
    function c() {
      const a = le(t, { exclude: "[data-ln-autosave-exclude]" });
      try {
        localStorage.setItem(r, JSON.stringify(a));
      } catch {
        return;
      }
      A(t, "ln-autosave:saved", { target: t, data: a });
    }
    function m() {
      let a;
      try {
        a = localStorage.getItem(r);
      } catch {
        return;
      }
      if (!a) return;
      let s;
      try {
        s = JSON.parse(a);
      } catch {
        return;
      }
      if (Y(t, "ln-autosave:before-restore", { target: t, data: s }).defaultPrevented) return;
      const v = ce(t, s);
      for (let S = 0; S < v.length; S++)
        v[S].dispatchEvent(new Event("input", { bubbles: !0 })), v[S].dispatchEvent(new Event("change", { bubbles: !0 }));
      A(t, "ln-autosave:restored", { target: t, data: s });
    }
    function g() {
      try {
        localStorage.removeItem(r);
      } catch {
        return;
      }
      A(t, "ln-autosave:cleared", { target: t });
    }
    this._onFocusout = function(a) {
      const s = a.target;
      d(s) && s.name && !s.hasAttribute("data-ln-autosave-exclude") && c();
    }, this._onChange = function(a) {
      const s = a.target;
      d(s) && s.name && !s.hasAttribute("data-ln-autosave-exclude") && c();
    }, this._onSubmit = function() {
      g();
    }, this._onReset = function() {
      g();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + b + "]") && g();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick);
    const i = e(t);
    return i > 0 && (this._onInput = function(a) {
      const s = a.target;
      !d(s) || !s.name || s.hasAttribute("data-ln-autosave-exclude") || (n !== null && clearTimeout(n), n = setTimeout(c, i));
    }, t.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return n;
    }, m(), this;
  }
  u.prototype.destroy = function() {
    if (this.dom[l]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const t = this._getInputTimer();
        t !== null && clearTimeout(t);
      }
      A(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[l];
    }
  };
  function o(t) {
    const n = t.getAttribute(h) || t.id;
    return n ? p + window.location.pathname + ":" + n : null;
  }
  function d(t) {
    const r = t.tagName;
    return r === "INPUT" || r === "TEXTAREA" || r === "SELECT";
  }
  function e(t) {
    if (!t.hasAttribute(y)) return 0;
    const r = t.getAttribute(y);
    if (r === "" || r === null) return 1e3;
    const n = parseInt(r, 10);
    return isNaN(n) || n < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", t), 1e3) : n;
  }
  H(h, l, u, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", l = "lnAutoresize";
  if (window[l] !== void 0) return;
  function b(y) {
    if (y.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", y.tagName), this;
    this.dom = y;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, y.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[l]);
  }, H(h, l, b, "ln-autoresize");
})();
(function() {
  const h = "data-ln-editor", l = "lnEditor";
  if (window[l] !== void 0) return;
  const b = {
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
  function o(i) {
    return !!(y[i] || p[i] || f[i] || i === "link");
  }
  function d(i) {
    this.dom = i;
    const a = this;
    if (this._textarea = i.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", i), this;
    const s = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), s && this._surface.setAttribute("data-placeholder", s);
    const _ = this._textarea.id;
    if (_) {
      const C = i.querySelector('label[for="' + _ + '"]');
      C && (C.id || (C.id = _ + "-label"), this._surface.setAttribute("aria-labelledby", C.id));
    }
    this._surface.id = _ ? _ + "-surface" : "ln-editor-surface-" + ++u;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const S = i.querySelector('[role="toolbar"]');
    if (S && S.nextSibling ? i.insertBefore(this._surface, S.nextSibling) : i.appendChild(this._surface), S) {
      S.setAttribute("aria-controls", this._surface.id);
      const C = S.querySelectorAll("[data-ln-editor-action]");
      for (let T = 0; T < C.length; T++) {
        const q = C[T].getAttribute("data-ln-editor-action");
        o(q) && C[T].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      a._syncToTextarea(), A(a.dom, "ln-editor:changed", {
        html: a._textarea.value,
        target: a.dom
      });
    }, this._onMousedownToolbar = function(C) {
      C.target.closest("[data-ln-editor-action]") && C.preventDefault();
    }, this._onClickToolbar = function(C) {
      const T = C.target.closest("[data-ln-editor-action]");
      if (!T) return;
      const q = T.getAttribute("data-ln-editor-action");
      a._execAction(q);
    }, this._onPaste = function(C) {
      r(a, C);
    }, this._onKeydown = function(C) {
      m(a, C);
    }, this._onSelectionChange = function() {
      document.contains(a._surface) && a._updateActiveStates();
    }, this._onFocus = function() {
      A(a.dom, "ln-editor:focus", { target: a.dom });
    }, this._onBlur = function() {
      a._syncToTextarea(), A(a.dom, "ln-editor:blur", { target: a.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), S && (S.addEventListener("mousedown", this._onMousedownToolbar), S.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(C) {
      const T = C.detail && C.detail.html;
      T !== void 0 && (a._surface.innerHTML = T, a._syncToTextarea(), A(a.dom, "ln-editor:changed", {
        html: a._textarea.value,
        target: a.dom
      }));
    }, i.addEventListener("ln-editor:set-content", this._onSetContent);
    const w = this._textarea.form;
    return w && (this._onFormReset = function() {
      setTimeout(function() {
        a._surface.innerHTML = a._textarea.value, A(i, "ln-editor:changed", {
          html: a._textarea.value,
          target: i
        });
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), this;
  }
  d.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, d.prototype._execAction = function(i) {
    if (!(!i || Y(this.dom, "ln-editor:before-change", {
      action: i,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), y[i])
        document.execCommand(y[i], !1, null);
      else if (p[i]) {
        const s = p[i], _ = e(this._surface);
        _ && _.toLowerCase() === s ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + s + ">");
      } else f[i] ? document.execCommand(f[i], !1, null) : i === "link" ? g(this) : i === "unlink" ? document.execCommand("unlink", !1, null) : i === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, d.prototype._updateActiveStates = function() {
    const i = this.dom.querySelector('[role="toolbar"]');
    if (!i) return;
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return;
    const s = a.anchorNode;
    if (!s || !this._surface.contains(s)) return;
    const _ = i.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < _.length; v++) {
      const S = _[v], w = S.getAttribute("data-ln-editor-action");
      let C = !1;
      if (y[w])
        try {
          C = document.queryCommandState(y[w]);
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
      else w === "link" && (C = !!t(a.anchorNode, "A", this._surface));
      o(w) && S.setAttribute("aria-pressed", String(C)), C ? S.classList.add("ln-editor-active") : S.classList.remove("ln-editor-active");
    }
  }, d.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, d.prototype.setHTML = function(i) {
    this._surface && (this._surface.innerHTML = i, this._syncToTextarea(), A(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, d.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const i = this.dom.querySelector('[role="toolbar"]');
    i && (i.removeEventListener("mousedown", this._onMousedownToolbar), i.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const a = this._textarea ? this._textarea.form : null;
    a && this._onFormReset && a.removeEventListener("reset", this._onFormReset), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
    const s = this.dom.querySelector(".ln-editor__link-popover");
    s && s.remove(), A(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[l];
  };
  function e(i) {
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return null;
    let s = a.anchorNode;
    if (!s) return null;
    for (; s && s !== i; ) {
      if (s.nodeType === 1) {
        const _ = s.tagName;
        if (_ === "H2" || _ === "H3" || _ === "H4" || _ === "BLOCKQUOTE" || _ === "PRE" || _ === "P")
          return _;
      }
      s = s.parentNode;
    }
    return null;
  }
  function t(i, a, s) {
    for (; i && i !== s; ) {
      if (i.nodeType === 1 && i.tagName === a)
        return i;
      i = i.parentNode;
    }
    return null;
  }
  function r(i, a) {
    a.preventDefault();
    let s = "";
    if (a.clipboardData && (s = a.clipboardData.getData("text/html"), !s)) {
      const v = a.clipboardData.getData("text/plain");
      v && (s = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), s = "<p>" + s + "</p>");
    }
    if (!s) return;
    const _ = n(s);
    _ && document.execCommand("insertHTML", !1, _);
  }
  function n(i) {
    const a = document.createElement("div");
    return a.innerHTML = i, c(a), a.innerHTML;
  }
  function c(i) {
    const a = Array.from(i.childNodes);
    for (let s = 0; s < a.length; s++) {
      const _ = a[s];
      if (_.nodeType !== 3) {
        if (_.nodeType !== 1) {
          i.removeChild(_);
          continue;
        }
        if (b[_.tagName]) {
          const v = Array.from(_.attributes);
          for (let S = 0; S < v.length; S++) {
            const w = v[S].name;
            if (_.tagName === "A" && w === "href") {
              const C = _.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(C) || _.removeAttribute("href");
            } else
              _.removeAttribute(w);
          }
          _.tagName === "A" && _.setAttribute("rel", "noopener noreferrer"), c(_);
        } else {
          for (; _.firstChild; )
            i.insertBefore(_.firstChild, _);
          i.removeChild(_);
        }
      }
    }
  }
  function m(i, a) {
    if (!(a.ctrlKey || a.metaKey)) return;
    let s = null;
    switch (a.key.toLowerCase()) {
      case "b":
        s = "bold";
        break;
      case "i":
        s = "italic";
        break;
      case "u":
        s = "underline";
        break;
      case "k":
        s = "link";
        break;
    }
    s && (a.preventDefault(), i._execAction(s));
  }
  function g(i) {
    const a = window.getSelection();
    if (!a || a.rangeCount === 0) return;
    const s = t(a.anchorNode, "A", i._surface), _ = a.getRangeAt(0).cloneRange(), v = i.dom.querySelector(".ln-editor__link-popover");
    v && v.remove();
    const S = mt(i.dom, "ln-editor-link-popover", "ln-editor");
    if (!S) return;
    const w = S.firstElementChild;
    if (!w) return;
    const C = w.querySelector('input[type="url"]'), T = w.querySelector('[data-ln-editor-action="confirm-link"]'), q = w.querySelector('[data-ln-editor-action="cancel-link"]');
    s && (C.value = s.getAttribute("href") || "");
    const x = i.dom.querySelector('[role="toolbar"]');
    x ? x.after(w) : i.dom.insertBefore(w, i._surface), C.focus();
    function I() {
      const F = window.getSelection();
      F.removeAllRanges(), F.addRange(_);
    }
    function D() {
      const F = C.value.trim();
      if (w.remove(), I(), i._surface.focus(), F)
        if (s)
          s.setAttribute("href", F), s.setAttribute("rel", "noopener noreferrer"), i._syncToTextarea(), A(i.dom, "ln-editor:changed", {
            html: i._textarea.value,
            target: i.dom
          });
        else {
          document.execCommand("createLink", !1, F);
          const z = window.getSelection();
          if (z && z.anchorNode) {
            const Q = t(z.anchorNode, "A", i._surface);
            Q && (Q.setAttribute("rel", "noopener noreferrer"), i._syncToTextarea());
          }
        }
      else s && document.execCommand("unlink", !1, null);
    }
    function M() {
      w.remove(), I(), i._surface.focus();
    }
    T.addEventListener("click", D), q.addEventListener("click", M), C.addEventListener("keydown", function(F) {
      F.key === "Enter" ? (F.preventDefault(), D()) : F.key === "Escape" && (F.preventDefault(), M());
    });
  }
  H(h, l, d, "ln-editor");
})();
(function() {
  const h = "lnFill";
  if (window[h] !== void 0) return;
  const l = { lnFillForm: !0, lnFillStore: !0 };
  function b(p) {
    const f = {}, u = p.dataset;
    for (const o in u) {
      if (!o.startsWith("lnFill") || l[o]) continue;
      const d = o.slice(6);
      d && (f[d.charAt(0).toLowerCase() + d.slice(1)] = u[o]);
    }
    return f;
  }
  function y(p, f) {
    const u = window.CSS && CSS.escape ? CSS.escape(f) : f, o = document.querySelectorAll('[data-ln-fill-id="' + u + '"]');
    if (o.length === 0) return null;
    for (let d = 0; d < o.length; d++) {
      const e = o[d].getAttribute("data-ln-fill-form");
      if (e) {
        const t = document.getElementById(e);
        if (t && p.contains(t)) return o[d];
      }
    }
    return o[0];
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const f = p.target.closest("[data-ln-fill-form]");
    if (!f) return;
    const u = f.getAttribute("href");
    if (u && u.indexOf("#") !== -1) return;
    const o = f.getAttribute("data-ln-fill-form"), d = document.getElementById(o);
    if (!d) return;
    const e = b(f), t = Object.keys(e).length > 0;
    window.lnCore.lnFill(d, t ? e : null);
  }), document.addEventListener("ln-fill:request", function(p) {
    const f = p.detail;
    if (!f) return;
    const u = p.target, o = f.id;
    if (o == null) {
      window.lnCore.lnFill(u, null);
      return;
    }
    const d = y(u, o);
    if (!d) return;
    const e = b(d);
    window.lnCore.lnFill(u, e);
  }), window[h] = !0;
})();
(function() {
  const h = "data-ln-slug-from", l = "lnSlug";
  if (window[l] !== void 0) return;
  function b(p) {
    return String(p).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function y(p) {
    if (p.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", p.tagName), this;
    const f = p.form;
    if (!f)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", p), this;
    const u = p.getAttribute(h), o = f.elements[u];
    if (!o)
      return console.warn('[ln-slug] Source field "' + u + '" not found in form:', p), this;
    if (typeof o.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + u + '" is a RadioNodeList (same-name group) — single source field required:', p), this;
    this.dom = p, this.source = o, this._pristine = p.value === "", this._mirroring = !1;
    const d = this;
    return this._onSource = function() {
      d._pristine && d._mirror();
    }, this._onSlug = function() {
      d._mirroring || (d._pristine = d.dom.value === "");
    }, o.addEventListener("input", this._onSource), p.addEventListener("input", this._onSlug), this;
  }
  y.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = b(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, y.prototype.destroy = function() {
    this.dom[l] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[l]);
  }, H(h, l, y, "ln-slug");
})();
(function() {
  const h = "data-ln-time", l = "lnTime";
  if (window[l] !== void 0) return;
  const b = {}, y = {};
  function p(w) {
    return w.getAttribute("data-ln-time-locale") || W(w);
  }
  function f(w, C) {
    const T = (w || "") + "|" + JSON.stringify(C);
    return b[T] || (b[T] = new Intl.DateTimeFormat(w, C)), b[T];
  }
  function u(w) {
    const C = w || "";
    return y[C] || (y[C] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), y[C];
  }
  const o = /* @__PURE__ */ new Set();
  let d = null;
  function e() {
    d || (d = setInterval(r, 6e4));
  }
  function t() {
    d && (clearInterval(d), d = null);
  }
  function r() {
    for (const w of o) {
      if (!document.body.contains(w.dom)) {
        o.delete(w);
        continue;
      }
      a(w);
    }
    o.size === 0 && t();
  }
  function n(w, C) {
    const T = Lt(C), q = (C || "").toLowerCase().split("-")[0], x = f(C, { dateStyle: "long", timeStyle: "short" }), I = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (T && I !== q && T.monthsLong) {
      const D = T.monthsLong[w.getMonth()], M = w.getDate(), F = w.getFullYear(), z = String(w.getHours()).padStart(2, "0"), Q = String(w.getMinutes()).padStart(2, "0");
      return `${M} ${D} ${F} во ${z}:${Q}`;
    }
    return x.format(w);
  }
  function c(w, C) {
    const T = /* @__PURE__ */ new Date(), q = { month: "short", day: "numeric" };
    w.getFullYear() !== T.getFullYear() && (q.year = "numeric");
    const x = Lt(C), I = (C || "").toLowerCase().split("-")[0], D = f(C, q), M = D.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && M !== I && x.monthsShort) {
      const F = x.monthsShort[w.getMonth()], z = w.getDate(), Q = w.getFullYear() !== T.getFullYear() ? " " + w.getFullYear() : "";
      return `${z} ${F}${Q}`;
    }
    return D.format(w);
  }
  function m(w, C) {
    return f(C, { dateStyle: "medium" }).format(w);
  }
  function g(w, C) {
    return f(C, { timeStyle: "short" }).format(w);
  }
  function i(w, C) {
    const T = Math.floor(Date.now() / 1e3), x = Math.floor(w.getTime() / 1e3) - T, I = Math.abs(x);
    if (I < 10) return u(C).format(0, "second");
    let D, M;
    if (I < 60)
      D = "second", M = x;
    else if (I < 3600)
      D = "minute", M = Math.round(x / 60);
    else if (I < 86400)
      D = "hour", M = Math.round(x / 3600);
    else if (I < 604800)
      D = "day", M = Math.round(x / 86400);
    else if (I < 2592e3)
      D = "week", M = Math.round(x / 604800);
    else
      return c(w, C);
    return u(C).format(M, D);
  }
  function a(w) {
    const C = w.dom.getAttribute("datetime");
    if (!C) return;
    const T = Number(C);
    if (isNaN(T)) return;
    const q = new Date(T * 1e3), x = w.dom.getAttribute(h) || "short", I = p(w.dom);
    let D;
    switch (x) {
      case "relative":
        D = i(q, I);
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
        D = c(q, I);
        break;
    }
    w.dom.textContent = D, x !== "full" && (w.dom.title = n(q, I));
  }
  function s(w) {
    return this.dom = w, a(this), w.getAttribute(h) === "relative" && (o.add(this), e()), this;
  }
  s.prototype.render = function() {
    a(this);
  }, s.prototype.destroy = function() {
    o.delete(this), o.size === 0 && t(), delete this.dom[l];
  };
  function _(w) {
    const C = w[l];
    if (!C) return;
    w.getAttribute(h) === "relative" ? (o.add(C), e()) : (o.delete(C), o.size === 0 && t()), a(C);
  }
  function v(w) {
    w.nodeType === 1 && w.hasAttribute && w.hasAttribute(h) && w[l] && a(w[l]);
  }
  function S() {
    new MutationObserver(function() {
      const w = document.querySelectorAll("[" + h + "]");
      for (let C = 0; C < w.length; C++) {
        const T = w[C][l];
        T && a(T);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"], subtree: !0 });
  }
  H(h, l, s, "ln-time", {
    extraAttributes: ["datetime", "data-ln-time-locale", "lang"],
    onAttributeChange: _,
    onInit: v
  }), S();
})();
function $e(h) {
  h = h || {};
  let l = h.windowSize > 0 ? h.windowSize : 1e3, b = h.pageSize > 0 ? h.pageSize : 200, y = h.threshold != null ? h.threshold : 25, p = h.fetchDebounce != null ? h.fetchDebounce : 120;
  const f = typeof h.requestPage == "function" ? h.requestPage : function() {
  }, u = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
  let e = 0, t = 0, r = 0, n = null, c = 0;
  function m(a) {
    o.set(a, ++c);
  }
  function g() {
    if (u.size <= l) return;
    const a = Array.from(u.keys()).sort(function(_, v) {
      return (o.get(_) || 0) - (o.get(v) || 0);
    });
    let s = 0;
    for (; u.size > l && s < a.length; )
      u.delete(a[s]), o.delete(a[s]), s++;
  }
  function i(a, s, _) {
    d.add(a), f(a, s, _);
  }
  return {
    get logicalTotal() {
      return e;
    },
    set logicalTotal(a) {
      e = a;
    },
    get grandTotal() {
      return t;
    },
    set grandTotal(a) {
      t = a;
    },
    get queryGen() {
      return r;
    },
    set queryGen(a) {
      r = a;
    },
    get size() {
      return u.size;
    },
    getId: function(a) {
      if (u.has(a))
        return m(a), u.get(a);
    },
    ensure: function(a, s, _) {
      if (e <= 0) {
        d.has(0) || (clearTimeout(n), n = setTimeout(function() {
          i(0, b, _);
        }, p));
        return;
      }
      const v = Math.max(0, a - y), S = Math.min(e, s + y), w = Math.floor(v / b), C = Math.floor(Math.max(0, S - 1) / b);
      let T = -1, q = b;
      for (let x = w; x <= C; x++) {
        const I = x * b, D = Math.min(b, e - I);
        let M = !1;
        for (let F = I; F < I + D; F++)
          if (!u.has(F)) {
            M = !0;
            break;
          }
        if (M && !d.has(I)) {
          T = I, q = D;
          break;
        }
      }
      T !== -1 && (clearTimeout(n), n = setTimeout(function() {
        i(T, q, _);
      }, p));
    },
    ingest: function(a, s, _, v, S) {
      if (!(S != null && S !== r)) {
        t = _ ?? t, e = v ?? e;
        for (let w = 0; w < s.length; w++)
          u.set(a + w, s[w]), m(a + w);
        d.delete(a), g();
      }
    },
    reset: function() {
      r++, u.clear(), o.clear(), d.clear(), t = 0, clearTimeout(n);
    },
    clear: function() {
      u.clear(), o.clear(), d.clear(), clearTimeout(n);
    },
    configure: function(a) {
      if (a = a || {}, a.windowSize != null && a.windowSize > 0 && a.windowSize !== l) {
        const s = a.windowSize < l;
        l = a.windowSize, s && g();
      }
      a.pageSize != null && a.pageSize > 0 && (b = a.pageSize), a.threshold != null && a.threshold >= 0 && (y = a.threshold), a.fetchDebounce != null && a.fetchDebounce >= 0 && (p = a.fetchDebounce);
    }
  };
}
(function() {
  const h = "data-ln-data-store", l = "lnDataStore";
  if (window[l] !== void 0) return;
  const b = "ln_app_cache", y = "_meta", p = "1.0";
  let f = null, u = null;
  const o = {};
  function d(E) {
    E && E.name === "QuotaExceededError" && A(document, "ln-data-store:quota-exceeded", { error: E });
  }
  function e() {
    const E = {};
    for (const L of document.querySelectorAll(`[${h}]`)) {
      const k = L.id;
      if (k) {
        const R = L.getAttribute("data-ln-data-store-indexes") || "";
        E[k] = {
          indexes: R.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return E;
  }
  function t() {
    return u || (u = new Promise((E) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), E(null);
      const L = e(), k = Object.keys(L), R = indexedDB.open(b);
      R.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), E(null);
      }, R.onsuccess = (O) => {
        const N = O.target.result, B = Array.from(N.objectStoreNames);
        if (!(!B.includes(y) || k.some((Z) => !B.includes(Z))))
          return r(N), f = N, E(N);
        const j = N.version;
        N.close();
        const V = indexedDB.open(b, j + 1);
        V.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, V.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), E(null);
        }, V.onupgradeneeded = (Z) => {
          const rt = Z.target.result;
          rt.objectStoreNames.contains(y) || rt.createObjectStore(y, { keyPath: "key" });
          for (const Ft of k)
            if (!rt.objectStoreNames.contains(Ft)) {
              const Te = rt.createObjectStore(Ft, { keyPath: "id" });
              for (const Jt of L[Ft].indexes)
                Te.createIndex(Jt, Jt, { unique: !1 });
            }
        }, V.onsuccess = (Z) => {
          const rt = Z.target.result;
          r(rt), f = rt, E(rt);
        };
      };
    }), u);
  }
  function r(E) {
    E.onversionchange = () => {
      E.close(), f = null, u = null;
    };
  }
  function n() {
    return f ? Promise.resolve(f) : (u = null, t());
  }
  async function c(E) {
    if (!pt() || !E) return E;
    const L = { ...E }, k = L.id, R = await He(L);
    return !R || !R.encrypted ? E : {
      id: k,
      encrypted: !0,
      iv: R.iv,
      data: R.data
    };
  }
  async function m(E) {
    return !E || !E.encrypted || !pt() ? E : Ue(E);
  }
  const g = (E, L) => n().then((k) => k ? k.transaction(E, L).objectStore(E) : null);
  function i(E) {
    return new Promise((L, k) => {
      E.onsuccess = () => L(E.result), E.onerror = () => {
        d(E.error), k(E.error);
      };
    });
  }
  const a = (E) => g(E, "readonly").then((L) => L ? i(L.getAll()) : []).then((L) => pt() ? Promise.all(L.map((k) => m(k))) : L), s = (E, L) => g(E, "readonly").then((k) => k ? i(k.get(L)) : null).then((k) => k ? m(k) : null), _ = (E, L) => n().then((k) => {
    if (!k) return [];
    const O = k.transaction(E, "readonly").objectStore(E), N = L.map((B) => i(O.get(B)));
    return Promise.all(N).then((B) => pt() ? Promise.all(B.map((U) => m(U))) : B);
  }), v = (E, L) => (pt() ? c(L) : Promise.resolve(L)).then((R) => g(E, "readwrite").then((O) => O ? i(O.put(R)) : null)), S = (E, L) => g(E, "readwrite").then((k) => k ? i(k.delete(L)) : null), w = (E) => g(E, "readwrite").then((L) => L ? i(L.clear()) : null), C = (E) => g(E, "readonly").then((L) => L ? i(L.count()) : 0), T = (E) => g(y, "readonly").then((L) => L ? i(L.get(E)) : null), q = (E, L) => g(y, "readwrite").then((k) => {
    if (k)
      return L.key = E, i(k.put(L));
  });
  function x(E) {
    this.dom = E, this._name = E.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", E);
    const L = E.getAttribute("data-ln-data-store-stale"), k = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(k) ? 300 : k;
    const R = E.getAttribute("data-ln-data-store-search-fields") || "";
    this._searchFields = R.split(",").map((N) => N.trim()).filter(Boolean), this._handlers = null, this.isLoaded = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null };
    const O = E.getAttribute("data-ln-data-store-window");
    if (O !== null) {
      const N = parseInt(O, 10) || 1e3, B = parseInt(E.getAttribute("data-ln-data-store-window-page"), 10) || 200, U = parseInt(E.getAttribute("data-ln-data-store-window-threshold"), 10) || 25;
      this._windowIndex = $e({
        windowSize: N,
        pageSize: B,
        threshold: U,
        requestPage: (j, V, Z) => {
          A(this.dom, "ln-data-store:request-page", {
            store: this._name,
            offset: j,
            limit: V,
            query: Z,
            queryGen: this._windowIndex.queryGen
          });
        }
      });
    } else
      this._windowIndex = null;
    return this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), o[this._name] = this, I(this), this.ready = qt(this), this;
  }
  function I(E) {
    E._handlers = {
      create: (L) => D(E, "create", L.detail, () => F(E, L.detail)),
      update: (L) => D(E, "update", L.detail, () => z(E, L.detail)),
      delete: (L) => D(E, "delete", L.detail, () => Q(E, L.detail)),
      "bulk-delete": (L) => D(E, "bulk-delete", L.detail, () => ct(E, L.detail)),
      "sync-failed": (L) => {
        E.isSyncing = !1, A(E.dom, "ln-data-store:sync-error", {
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
        k !== E.query.search && (E.query.search = k, X(E));
      },
      "ln-filter:changed": (L) => {
        const k = L.detail && L.detail.key;
        if (!k) return;
        const R = (L.detail.values || []).slice();
        R.length ? E.query.filters[k] = R : delete E.query.filters[k], X(E);
      },
      "ln-sort:changed": (L) => {
        const k = L.detail && L.detail.field, R = L.detail && L.detail.direction, O = R ? { field: k, direction: R } : null, N = E.query.sort;
        !N && !O || N && O && N.field === O.field && N.direction === O.direction || (E.query.sort = O, X(E));
      }
    };
    for (const [L, k] of Object.entries(E._queryHandlers))
      E.dom.addEventListener(L, k);
  }
  function D(E, L, k, R) {
    const O = k && k.requestId;
    return E._mutationChain = E._mutationChain.then(() => E.ready).then(() => {
      if (E.initializationError) throw E.initializationError;
      return R();
    }).catch((N) => at(E, L, O, N)), E._mutationChain;
  }
  function M(E) {
    return C(E._name).then((L) => (E.totalCount = L, E.hasCache = !0, E.isLoaded = !0, q(E._name, {
      schema_version: p,
      last_synced_at: E.lastSyncedAt,
      has_cache: !0,
      record_count: L
    })));
  }
  function F(E, { tempId: L, data: k = {}, requestId: R } = {}) {
    const O = { ...k, id: L };
    return v(E._name, O).then(() => M(E)).then(() => {
      A(E.dom, "ln-data-store:created", { store: E._name, record: O, tempId: L, requestId: R });
    });
  }
  function z(E, { id: L, data: k = {}, requestId: R } = {}) {
    return s(E._name, L).then((O) => {
      if (!O) throw new Error(`Record not found: ${L}`);
      const N = { ...O, ...k }, B = k.id;
      return (B !== void 0 && B !== L ? $(E._name, L, N) : v(E._name, N)).then(() => M(E)).then(() => {
        A(E.dom, "ln-data-store:updated", { store: E._name, record: N, previous: O, requestId: R });
      });
    });
  }
  function Q(E, { id: L, requestId: k } = {}) {
    return s(E._name, L).then((R) => {
      if (!R) {
        A(E.dom, "ln-data-store:deleted", { store: E._name, id: L, requestId: k, missing: !0 });
        return;
      }
      return S(E._name, L).then(() => M(E)).then(() => {
        A(E.dom, "ln-data-store:deleted", { store: E._name, id: L, requestId: k });
      });
    });
  }
  function ct(E, { ids: L = [], requestId: k } = {}) {
    return L.length ? Promise.all(L.map((R) => s(E._name, R))).then((R) => {
      const O = R.filter(Boolean).map((N) => N.id);
      return K(E._name, O).then(() => M(E)).then(() => {
        A(E.dom, "ln-data-store:deleted", { store: E._name, ids: O, requestId: k });
      });
    }) : (A(E.dom, "ln-data-store:deleted", { store: E._name, ids: [], requestId: k }), Promise.resolve());
  }
  function at(E, L, k, R) {
    console.error("[ln-data-store] " + L + " failed:", R), A(E.dom, "ln-data-store:mutation-error", {
      store: E._name,
      action: L,
      requestId: k,
      error: R
    });
  }
  function qt(E) {
    return t().then((L) => {
      if (!L) throw new Error("IndexedDB is unavailable");
      return T(E._name);
    }).then((L) => {
      if (E.initializationError = null, L && L.schema_version === p)
        E.lastSyncedAt = L.last_synced_at || null, E.totalCount = L.record_count || 0, E.hasCache = L.has_cache === !0 || E.totalCount > 0, E.hasCache && (E.isLoaded = !0, A(E.dom, "ln-data-store:ready", { store: E._name, count: E.totalCount, source: "cache" })), E.isInitialized = !0, A(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: E.hasCache, lastSyncedAt: E.lastSyncedAt, count: E.totalCount });
      else {
        if (L && L.schema_version !== p)
          return w(E._name).then(() => q(E._name, { schema_version: p, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            E.isInitialized = !0, E.hasCache = !1, A(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        E.isInitialized = !0, E.hasCache = !1, A(E.dom, "ln-data-store:initialized", { store: E._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((L) => (E.isInitialized = !0, E.isLoaded = !1, E.hasCache = !1, E.isSyncing = !1, E.initializationError = L, A(E.dom, "ln-data-store:initialization-error", { store: E._name, error: L }), { ok: !1, error: L }));
  }
  function At(E) {
    E.isSyncing = !0, A(E.dom, "ln-data-store:request-remote-sync", { since: E.lastSyncedAt });
  }
  function P(E, L) {
    return n().then((k) => k ? (pt() ? Promise.all(L.map((O) => c(O))) : Promise.resolve(L)).then((O) => new Promise((N, B) => {
      const U = k.transaction(E, "readwrite"), j = U.objectStore(E);
      O.forEach((V) => j.put(V)), U.oncomplete = () => N(), U.onerror = () => {
        d(U.error), B(U.error);
      };
    })) : void 0);
  }
  function K(E, L) {
    return n().then((k) => {
      if (k)
        return new Promise((R, O) => {
          const N = k.transaction(E, "readwrite"), B = N.objectStore(E);
          L.forEach((U) => B.delete(U)), N.oncomplete = () => R(), N.onerror = () => O(N.error);
        });
    });
  }
  function $(E, L, k) {
    return (pt() ? c(k) : Promise.resolve(k)).then((O) => n().then((N) => {
      if (N)
        return new Promise((B, U) => {
          const j = N.transaction(E, "readwrite"), V = j.objectStore(E);
          V.put(O), V.delete(L), j.oncomplete = () => B(), j.onerror = () => {
            d(j.error), U(j.error);
          };
        });
    }));
  }
  const St = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function dt(E, L) {
    if (!L || !L.field) return E;
    const { field: k, direction: R } = L, O = R === "desc";
    return [...E].sort((N, B) => {
      const U = N[k], j = B[k];
      if (U == null && j == null) return 0;
      if (U == null) return O ? 1 : -1;
      if (j == null) return O ? -1 : 1;
      const V = typeof U == "string" && typeof j == "string" ? St.compare(U, j) : U < j ? -1 : U > j ? 1 : 0;
      return O ? -V : V;
    });
  }
  function et(E, L) {
    if (!L) return E;
    const k = Object.keys(L).filter((R) => Array.isArray(L[R]) && L[R].length > 0);
    return k.length ? E.filter(
      (R) => k.every((O) => L[O].map(String).includes(String(R[O])))
    ) : E;
  }
  function Ct(E, L, k) {
    if (!L || !k || !k.length) return E;
    const R = L.toLowerCase();
    return E.filter(
      (O) => k.some((N) => {
        const B = O[N];
        return B != null && String(B).toLowerCase().includes(R);
      })
    );
  }
  function ut(E, L, k) {
    if (!E.length) return 0;
    if (k === "count") return E.length;
    const R = E.map((N) => parseFloat(N[L])).filter((N) => !isNaN(N)), O = R.reduce((N, B) => N + B, 0);
    return k === "sum" ? O : k === "avg" && R.length ? O / R.length : 0;
  }
  function ht(E, L) {
    if (!E.presenters || !E.presenters.computed) return L;
    const k = E.presenters.computed;
    return L.map((R) => {
      if (!R) return null;
      const O = { ...R };
      for (const [N, B] of Object.entries(k))
        try {
          O[N] = B(R);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${N}`, U);
        }
      return O;
    });
  }
  x.prototype.getAll = function(E = {}) {
    const L = this;
    if (L._windowIndex) {
      const k = E.offset || 0, R = E.limit || 200;
      L._windowIndex.ensure(k, k + R, E);
      const O = [];
      for (let B = k; B < k + R; B++) {
        const U = L._windowIndex.getId(B);
        O.push(U);
      }
      const N = Array.from(new Set(O.filter((B) => B !== void 0)));
      return _(L._name, N).then((B) => {
        const U = /* @__PURE__ */ new Map();
        for (let V = 0; V < B.length; V++) {
          const Z = B[V];
          Z && U.set(String(Z.id), Z);
        }
        const j = [];
        for (let V = 0; V < O.length; V++) {
          const Z = O[V];
          if (Z === void 0)
            j.push(null);
          else {
            const rt = U.get(String(Z));
            j.push(rt || null);
          }
        }
        return {
          data: ht(L, j),
          total: L._windowIndex.grandTotal,
          filtered: L._windowIndex.logicalTotal,
          offset: k,
          queryGen: L._windowIndex.queryGen
        };
      });
    }
    return a(L._name).then((k) => {
      const R = k.length;
      E.filters && (k = et(k, E.filters)), E.search && (k = Ct(k, E.search, L._searchFields));
      const O = k.length;
      if (E.sort && (k = dt(k, E.sort)), E.offset || E.limit) {
        const N = E.offset || 0, B = E.limit || k.length;
        k = k.slice(N, N + B);
      }
      return {
        data: ht(L, k),
        total: R,
        filtered: O
      };
    });
  }, x.prototype.getById = function(E) {
    return s(this._name, E).then((L) => L ? ht(this, [L])[0] : null);
  }, x.prototype.count = function(E) {
    return E ? a(this._name).then((L) => et(L, E).length) : C(this._name);
  }, x.prototype.aggregate = function(E, L) {
    return a(this._name).then((k) => ut(k, E, L));
  }, x.prototype.setPresenters = function(E) {
    this.presenters = E;
  }, x.prototype.applySync = function(E, L, k, R) {
    R = R || {};
    const O = this;
    if (O._windowIndex && R.queryGen != null && R.queryGen !== O._windowIndex.queryGen)
      return Promise.resolve();
    E.length > 0 || L.length > 0;
    let N = Promise.resolve();
    return E.length > 0 && (N = N.then(() => P(O._name, E))), L.length > 0 && (N = N.then(() => K(O._name, L))), N.then(() => {
      if (O._windowIndex && R.offset != null) {
        const B = E.map((U) => U.id);
        O._windowIndex.ingest(R.offset, B, R.total, R.filtered, R.queryGen);
      }
    }).then(() => C(O._name)).then((B) => (O.totalCount = R.total !== void 0 ? R.total : B, O.hasCache = !0, q(O._name, {
      schema_version: p,
      last_synced_at: k,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const B = !O.isLoaded;
      O.isLoaded = !0, O.isSyncing = !1, O.lastSyncedAt = k, B ? (A(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: R }), A(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: R })) : A(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: E.length,
        deleted: L.length,
        changed: !0,
        meta: R
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
    delete o[this._name], delete this.dom[l], A(this.dom, "ln-data-store:destroyed", { store: this._name });
  };
  function xt() {
    return n().then((E) => {
      if (!E) return;
      const L = Array.from(E.objectStoreNames);
      return new Promise((k, R) => {
        const O = E.transaction(L, "readwrite");
        L.forEach((N) => O.objectStore(N).clear()), O.oncomplete = () => k(), O.onerror = () => R(O.error);
      });
    }).then(() => {
      Object.values(o).forEach((E) => {
        E.isLoaded = !1, E.isInitialized = !1, E.initializationError = null, E.hasCache = !1, E.isSyncing = !1, E.lastSyncedAt = null, E.totalCount = 0;
      });
    });
  }
  function X(E) {
    E._windowIndex && E._windowIndex.reset(), A(E.dom, "ln-data-store:query-changed", {
      store: E._name,
      query: {
        filters: Object.assign({}, E.query.filters),
        search: E.query.search,
        sort: E.query.sort ? Object.assign({}, E.query.sort) : null
      }
    });
  }
  H(h, l, x, "ln-data-store"), window[l].clearAll = xt, window[l].init = window[l], window[l].setStorageKey = ee, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ee);
})();
(function() {
  const h = "data-ln-api-connector", l = "lnApiConnector", b = "lnConnector";
  if (window[l] !== void 0) return;
  function y(o) {
    return o.ok ? o.status === 204 ? null : o.json() : o.json().catch(() => null).then((d) => {
      const e = new Error("HTTP " + o.status + ": " + o.statusText);
      throw e.status = o.status, e.data = d, e;
    });
  }
  function p(o) {
    return this.dom = o, o[l] = this, o[b] = this, this._inflight = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, f(this), this;
  }
  p.prototype.refreshConfig = function() {
    const o = this.dom;
    this.baseUrl = o.getAttribute("data-ln-api-base-url") || "", this.path = o.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin", this.paramKeys = {
      offset: o.getAttribute("data-ln-api-param-offset") || "offset",
      limit: o.getAttribute("data-ln-api-param-limit") || "limit",
      search: o.getAttribute("data-ln-api-param-search") || "search",
      sortField: o.getAttribute("data-ln-api-param-sort-field") || "sort_field",
      sortDir: o.getAttribute("data-ln-api-param-sort-dir") || "sort_dir"
    };
    const d = o.getAttribute("data-ln-api-headers") || "";
    this.headers = he(d, "ln-api-connector"), (d.toLowerCase().includes("authorization") || d.toLowerCase().includes("bearer") || d.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), A(o, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, p.prototype._reqHeaders = function(o) {
    const d = Object.assign({}, Et(this.headers), { "X-LN-Response": "data" });
    return o && (d["Idempotency-Key"] = o), d;
  }, p.prototype.fetchDelta = function(o, d) {
    const e = this;
    let t = J(e.baseUrl, e.path);
    o != null && o !== "" && (t += (t.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(o));
    const r = d || "sync";
    e._inflight.has(r) && e._inflight.get(r).abort();
    const n = new AbortController();
    return e._inflight.set(r, n), window.fetch(t, {
      method: "GET",
      headers: e._reqHeaders(),
      credentials: e.credentials,
      signal: n.signal
    }).then(y).finally(function() {
      e._inflight.get(r) === n && e._inflight.delete(r);
    });
  }, p.prototype.query = function(o, d) {
    const e = this;
    o = o || {};
    let t = J(e.baseUrl, e.path);
    const r = e.paramKeys || {
      offset: "offset",
      limit: "limit",
      search: "search",
      sortField: "sort_field",
      sortDir: "sort_dir"
    }, n = new URLSearchParams();
    o.search && n.append(r.search, o.search), o.offset != null && n.append(r.offset, o.offset), o.limit != null && n.append(r.limit, o.limit), o.sort && o.sort.field && o.sort.direction && (n.append(r.sortField, o.sort.field), n.append(r.sortDir, o.sort.direction)), o.filters && typeof o.filters == "object" && Object.keys(o.filters).forEach((a) => {
      const s = o.filters[a];
      Array.isArray(s) && s.length > 0 && n.append(a, s.join(","));
    });
    const c = n.toString();
    c && (t += (t.indexOf("?") !== -1 ? "&" : "?") + c);
    let m = null;
    d && (e._inflight.has(d) && e._inflight.get(d).abort(), m = new AbortController(), e._inflight.set(d, m));
    const g = {
      method: "GET",
      headers: e._reqHeaders(),
      credentials: e.credentials
    };
    m && (g.signal = m.signal);
    let i = window.fetch(t, g).then(y);
    return d && m && (i = i.finally(function() {
      e._inflight.get(d) === m && e._inflight.delete(d);
    })), i;
  }, p.prototype.create = function(o, d, e) {
    const t = this;
    return window.fetch(J(t.baseUrl, d || t.path), {
      method: "POST",
      headers: t._reqHeaders(e),
      credentials: t.credentials,
      body: JSON.stringify(o)
    }).then(y);
  }, p.prototype.update = function(o, d, e, t, r) {
    const n = this;
    e != null && (d = Object.assign({}, d, { expected_version: e }));
    const c = t ? J(n.baseUrl, t) : J(n.baseUrl, n.path, o);
    return window.fetch(c, {
      method: "PUT",
      headers: n._reqHeaders(r),
      credentials: n.credentials,
      body: JSON.stringify(d)
    }).then(y);
  }, p.prototype.delete = function(o, d, e) {
    const t = this;
    return window.fetch(J(t.baseUrl, d || t.path, o), {
      method: "DELETE",
      headers: t._reqHeaders(e),
      credentials: t.credentials
    }).then(y);
  }, p.prototype.bulkDelete = function(o, d, e) {
    const t = this;
    return window.fetch(J(t.baseUrl, d || t.path) + "/bulk-delete", {
      method: "DELETE",
      headers: t._reqHeaders(e),
      credentials: t.credentials,
      body: JSON.stringify({ ids: o })
    }).then(y);
  };
  function f(o) {
    o._handlers = {
      sync: function(e) {
        const t = e.detail || {}, r = t.meta && t.meta.targetEl ? t.meta.targetEl : null;
        o.fetchDelta(t.since, r).then(function(n) {
          A(o.dom, "ln-api-connector:fetched", { data: n, since: t.since, meta: t.meta || null });
        }).catch(function(n) {
          n && n.name === "AbortError" || A(o.dom, "ln-api-connector:error", {
            action: "sync",
            error: n.message,
            status: n.status || 0,
            data: n.data || null,
            since: t.since,
            meta: t.meta || null
          });
        });
      },
      query: function(e) {
        const t = e.detail || {}, r = t.query || t, n = t.meta && t.meta.targetEl ? t.meta.targetEl : null;
        o.query(r, n).then(function(c) {
          const m = c || {};
          A(o.dom, "ln-api-connector:fetched", {
            data: m.data || (Array.isArray(m) ? m : []),
            total: m.total,
            filtered: m.filtered,
            offset: r.offset,
            queryGen: r.queryGen,
            meta: t.meta || null
          });
        }).catch(function(c) {
          c && c.name === "AbortError" || A(o.dom, "ln-api-connector:error", {
            action: "query",
            error: c.message,
            status: c.status || 0,
            data: c.data || null,
            meta: t.meta || null
          });
        });
      },
      create: function(e) {
        const t = e.detail || {};
        o.create(t.data, t.url, t.idempotencyKey).then(function(r) {
          const n = r && r.content !== void 0 ? r.content : r, c = r && r.message ? r.message : null;
          A(o.dom, "ln-api-connector:created", { record: n, tempId: t.tempId, message: c, meta: t.meta || null });
        }).catch(function(r) {
          A(o.dom, "ln-api-connector:error", {
            action: "create",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            tempId: t.tempId,
            meta: t.meta || null
          });
        });
      },
      update: function(e) {
        const t = e.detail || {};
        o.update(t.id, t.data, t.expected_version, t.url, t.idempotencyKey).then(function(r) {
          const n = r && r.content !== void 0 ? r.content : r, c = r && r.message ? r.message : null;
          A(o.dom, "ln-api-connector:updated", { record: n, id: t.id, message: c, meta: t.meta || null });
        }).catch(function(r) {
          A(o.dom, "ln-api-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            id: t.id,
            conflictData: r.status === 409 ? r.data : null,
            meta: t.meta || null
          });
        });
      },
      delete: function(e) {
        const t = e.detail || {};
        o.delete(t.id, t.url, t.idempotencyKey).then(function(r) {
          const n = r && r.message ? r.message : null;
          A(o.dom, "ln-api-connector:deleted", { response: r, id: t.id, message: n, meta: t.meta || null });
        }).catch(function(r) {
          A(o.dom, "ln-api-connector:error", {
            action: "delete",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            id: t.id,
            meta: t.meta || null
          });
        });
      },
      bulkDelete: function(e) {
        const t = e.detail || {};
        o.bulkDelete(t.ids, t.url, t.idempotencyKey).then(function(r) {
          const n = r && r.message ? r.message : null;
          A(o.dom, "ln-api-connector:bulk-deleted", { response: r, ids: t.ids, message: n, meta: t.meta || null });
        }).catch(function(r) {
          A(o.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            ids: t.ids,
            meta: t.meta || null
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      o.dom.addEventListener(e + ":request-sync", o._handlers.sync), o.dom.addEventListener(e + ":request-query", o._handlers.query), o.dom.addEventListener(e + ":request-fetch", o._handlers.query), o.dom.addEventListener(e + ":request-create", o._handlers.create), o.dom.addEventListener(e + ":request-update", o._handlers.update), o.dom.addEventListener(e + ":request-delete", o._handlers.delete), o.dom.addEventListener(e + ":request-bulk-delete", o._handlers.bulkDelete);
    });
  }
  p.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const o = this;
    o._inflight && (o._inflight.forEach(function(d) {
      d.abort();
    }), o._inflight.clear()), o._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      o.dom.removeEventListener(e + ":request-sync", o._handlers.sync), o.dom.removeEventListener(e + ":request-query", o._handlers.query), o.dom.removeEventListener(e + ":request-fetch", o._handlers.query), o.dom.removeEventListener(e + ":request-create", o._handlers.create), o.dom.removeEventListener(e + ":request-update", o._handlers.update), o.dom.removeEventListener(e + ":request-delete", o._handlers.delete), o.dom.removeEventListener(e + ":request-bulk-delete", o._handlers.bulkDelete);
    }), o._handlers = null), A(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[l], delete this.dom[b];
  };
  function u(o) {
    const d = o[l];
    d && d.refreshConfig();
  }
  H(h, l, p, "ln-api-connector", {
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
  const h = "data-ln-couchdb-connector", l = "lnCouchDbConnector", b = "lnConnector";
  if (window[l] !== void 0) return;
  function y(n) {
    const c = n && n.content !== void 0 ? n.content : n, m = n && n.message ? n.message : null;
    return { content: c, message: m };
  }
  function p(n) {
    return this.dom = n, n[l] = this, n[b] = this, this.refreshConfig(), this._handlers = null, t(this), this;
  }
  p.prototype.refreshConfig = function() {
    const n = this.dom;
    this.url = n.getAttribute("data-ln-couchdb-url") || "", this.db = n.getAttribute("data-ln-couchdb-db") || "", this.auth = n.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const c = n.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = he(c, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), c.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), A(n, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function f(n, c, m) {
    const g = Object.assign({}, Et(n.headers, n.auth), m || {});
    return c && (g["Idempotency-Key"] = c), g;
  }
  p.prototype.fetchDelta = function(n) {
    const c = this, m = ["include_docs=true", "feed=normal"];
    n && m.push("since=" + encodeURIComponent(n));
    const g = J(c.url, c.db, "_changes") + "?" + m.join("&");
    return window.fetch(g, { method: "GET", headers: Et(c.headers, c.auth), credentials: c.credentials }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => {
      const a = i.results || [];
      return {
        data: a.filter((s) => !s.deleted && s.doc).map((s) => Object.assign({}, s.doc, { id: s.doc._id })),
        deleted: a.filter((s) => s.deleted).map((s) => s.id),
        synced_at: i.last_seq || n || ""
      };
    });
  };
  function u(n, c, m) {
    const g = Object.assign({ _id: c.id }, c);
    return g._id || delete g._id, window.fetch(J(n.url, n.db), {
      method: "POST",
      headers: f(n, m),
      credentials: n.credentials,
      body: JSON.stringify(g)
    }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => {
      const a = y(i), s = a.content;
      return { record: Object.assign({}, g, { id: s.id, _id: s.id, _rev: s.rev }), message: a.message };
    });
  }
  p.prototype.create = function(n, c) {
    return u(this, n, c).then((m) => m.record);
  };
  function o(n, c, m, g) {
    const i = Object.assign({ id: String(c), _id: String(c) }, m), a = i._rev || i.rev;
    return (a ? Promise.resolve(a) : window.fetch(J(n.url, n.db, null, c), { method: "GET", headers: Et(n.headers, n.auth), credentials: n.credentials }).then((_) => {
      if (!_.ok) throw new Error("Could not retrieve document for revision mapping");
      return _.json().then((v) => v._rev);
    })).then((_) => {
      const v = Object.assign({}, i, { _rev: _ });
      delete v.rev;
      const S = f(n, g, { "If-Match": _ });
      return window.fetch(J(n.url, n.db, null, c), {
        method: "PUT",
        headers: S,
        credentials: n.credentials,
        body: JSON.stringify(v)
      }).then((w) => {
        if (w.ok) return w.json().then((C) => {
          const T = y(C);
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
  p.prototype.update = function(n, c, m) {
    return o(this, n, c, m).then((g) => g.record);
  };
  function d(n, c, m, g) {
    return (m ? Promise.resolve(m) : window.fetch(J(n.url, n.db, null, c), { method: "GET", headers: Et(n.headers, n.auth), credentials: n.credentials }).then((a) => {
      if (!a.ok) throw new Error("Could not retrieve document for revision delete");
      return a.json().then((s) => s._rev);
    })).then((a) => {
      const s = J(n.url, n.db, null, c) + "?rev=" + encodeURIComponent(a);
      return window.fetch(s, { method: "DELETE", headers: f(n, g), credentials: n.credentials }).then((_) => {
        if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
        return _.json();
      }).then((_) => {
        const v = y(_);
        return { response: v.content, message: v.message };
      });
    });
  }
  p.prototype.delete = function(n, c, m) {
    return d(this, n, c, m).then((g) => g.response);
  };
  function e(n, c, m) {
    return !c || c.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(J(n.url, n.db, "_all_docs"), {
      method: "POST",
      headers: Et(n.headers, n.auth),
      credentials: n.credentials,
      body: JSON.stringify({ keys: c })
    }).then((g) => {
      if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
      return g.json();
    }).then((g) => {
      const a = (g.rows || []).filter((s) => !s.error && s.value && s.value.rev).map((s) => ({ _id: s.id, _rev: s.value.rev, _deleted: !0 }));
      return a.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(J(n.url, n.db, "_bulk_docs"), {
        method: "POST",
        headers: f(n, m),
        credentials: n.credentials,
        body: JSON.stringify({ docs: a })
      }).then((s) => {
        if (!s.ok) throw new Error("HTTP " + s.status + ": " + s.statusText);
        return s.json();
      }).then((s) => {
        const _ = y(s);
        return { response: { ok: !0, results: _.content, deletedCount: a.length }, message: _.message };
      });
    });
  }
  p.prototype.bulkDelete = function(n, c) {
    return e(this, n, c).then((m) => m.response);
  };
  function t(n) {
    n._handlers = {
      sync: function(m) {
        const g = m.detail || {};
        n.fetchDelta(g.since).then(function(i) {
          A(n.dom, "ln-couchdb-connector:fetched", { data: i, since: g.since, meta: g.meta || null });
        }).catch(function(i) {
          A(n.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: i.message,
            status: i.status || 0,
            since: g.since,
            meta: g.meta || null
          });
        });
      },
      create: function(m) {
        const g = m.detail || {};
        u(n, g.data, g.idempotencyKey).then(function(i) {
          A(n.dom, "ln-couchdb-connector:created", { record: i.record, tempId: g.tempId, message: i.message, meta: g.meta || null });
        }).catch(function(i) {
          A(n.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: i.message,
            status: i.status || 0,
            tempId: g.tempId,
            meta: g.meta || null
          });
        });
      },
      update: function(m) {
        const g = m.detail || {}, i = Object.assign({}, g.data);
        g.expected_version !== void 0 && (i._rev = g.expected_version), o(n, g.id, i, g.idempotencyKey).then(function(a) {
          A(n.dom, "ln-couchdb-connector:updated", { record: a.record, id: g.id, message: a.message, meta: g.meta || null });
        }).catch(function(a) {
          A(n.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: a.message,
            status: a.status || 0,
            id: g.id,
            data: a.status === 409 ? a.data : null,
            conflictData: a.status === 409 ? a.data : null,
            meta: g.meta || null
          });
        });
      },
      delete: function(m) {
        const g = m.detail || {};
        d(n, g.id, g.rev, g.idempotencyKey).then(function(i) {
          A(n.dom, "ln-couchdb-connector:deleted", { response: i.response, id: g.id, message: i.message, meta: g.meta || null });
        }).catch(function(i) {
          A(n.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: i.message,
            status: i.status || 0,
            id: g.id,
            meta: g.meta || null
          });
        });
      },
      bulkDelete: function(m) {
        const g = m.detail || {};
        e(n, g.ids, g.idempotencyKey).then(function(i) {
          A(n.dom, "ln-couchdb-connector:bulk-deleted", { response: i.response, ids: g.ids, message: i.message, meta: g.meta || null });
        }).catch(function(i) {
          A(n.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: i.message,
            status: i.status || 0,
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
    if (!this.dom[l]) return;
    const n = this;
    n._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(m) {
      n.dom.removeEventListener(m + ":request-sync", n._handlers.sync), n.dom.removeEventListener(m + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(m + ":request-create", n._handlers.create), n.dom.removeEventListener(m + ":request-update", n._handlers.update), n.dom.removeEventListener(m + ":request-delete", n._handlers.delete), n.dom.removeEventListener(m + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), A(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[l], delete this.dom[b];
  };
  function r(n) {
    const c = n[l];
    c && c.refreshConfig();
  }
  H(h, l, p, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: r
  });
})();
function Ye(h) {
  return h = h || {}, {
    sort: h.sort,
    filters: h.filters,
    search: h.search,
    offset: h.offset,
    limit: h.limit,
    queryGen: h.queryGen
  };
}
function Ut(h, l) {
  const b = !h || !!h.initializationError;
  return l && (b || !h.isLoaded) ? "remote" : h && !h.initializationError ? "store" : "none";
}
function oe(h, l) {
  const b = Object.assign({}, h);
  return l && (b.filters = l.filters, b.search = l.search, b.sort = l.sort), b;
}
class Xe {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(l) {
    return new Promise((b, y) => {
      this._pending.set(l, { resolve: b, reject: y });
    });
  }
  resolve(l) {
    return this._settle(l, !1);
  }
  reject(l) {
    return this._settle(l, !0);
  }
  close(l) {
    const b = l || new Error("Mutation receipt registry closed");
    for (const y of this._pending.values()) y.reject(b);
    this._pending.clear();
  }
  _settle(l, b) {
    const y = l && l.requestId;
    if (!y) return !1;
    const p = this._pending.get(y);
    return p ? (this._pending.delete(y), b ? p.reject(l.error || new Error("Store mutation failed")) : p.resolve(l), !0) : !1;
  }
}
(function() {
  const h = "data-ln-data-coordinator", l = "lnDataCoordinator", b = "lnCoordinator", y = "data-ln-form-scope";
  if (window[l] !== void 0) return;
  const p = /* @__PURE__ */ new Set();
  let f = !1, u = null, o = null, d = null;
  function e() {
    f || (f = !0, u = function() {
      A(document, "ln-data-store:online", {}), p.forEach(function(i) {
        i._maybeSync();
      });
    }, o = function() {
      A(document, "ln-data-store:offline", {});
    }, d = function() {
      document.visibilityState === "visible" && p.forEach(function(i) {
        const a = i.findChildren(), s = a.store;
        s && a.connector && s.isInitialized && !s.initializationError && !s.isSyncing && !i._noAutosync && (!s.hasCache || i._isStale()) && s.forceSync();
      });
    }, window.addEventListener("online", u), window.addEventListener("offline", o), document.addEventListener("visibilitychange", d));
  }
  function t() {
    f && (p.size > 0 || (window.removeEventListener("online", u), window.removeEventListener("offline", o), document.removeEventListener("visibilitychange", d), u = null, o = null, d = null, f = !1));
  }
  function r() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (a) => {
        const s = Math.random() * 16 | 0;
        return (a === "x" ? s : s & 3 | 8).toString(16);
      });
    }
  }
  const n = ["ln-api-connector", "ln-couchdb-connector"];
  function c(i) {
    return this.dom = i, this._name = i.id, this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", i), i[l] = this, i[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Xe(), this._dict = Qt(i, "data-ln-data-coordinator-dict"), this._parseStaleAttributes(), this.refreshMapper(), m(this), p.add(this), e(), this._checkInitialSync(), this;
  }
  c.prototype._parseStaleAttributes = function() {
    const a = this.findChildren().storeEl, s = this.dom.getAttribute("data-ln-data-coordinator-stale") || (a ? a.getAttribute("data-ln-data-store-stale") : null), _ = parseInt(s, 10);
    this._staleThreshold = s === "never" || s === "-1" ? -1 : isNaN(_) ? 300 : _;
    const v = this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (a ? a.hasAttribute("data-ln-data-store-no-autosync") : !1);
    this._noAutosync = !!v;
  }, c.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const a = this.findChildren().store;
    return !a || !a.lastSyncedAt ? !0 : Date.now() / 1e3 - a.lastSyncedAt > this._staleThreshold;
  }, c.prototype._maybeSync = function() {
    const i = this.findChildren(), a = i.store;
    !a || a.initializationError || !i.connector || this._noAutosync || !a.isInitialized || a.isSyncing || (!a.hasCache || this._isStale()) && a.forceSync();
  }, c.prototype._checkInitialSync = function() {
    const i = this, s = this.findChildren().store;
    s && Promise.resolve(s.ready).then(function() {
      const _ = i.findChildren(), v = _.store;
      if (v && v.initializationError) {
        i._reportReconciliationError("store-initialize", v.initializationError, null);
        return;
      }
      !v || !_.connector || i._noAutosync || v.isSyncing || (!v.hasCache || i._isStale()) && v.forceSync();
    }).catch(function(_) {
      i._reportReconciliationError("store-initialize", _, null);
    });
  }, c.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const a = this.dom.getAttribute("data-ln-data-mapper") || this.dom.id;
    a && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(a)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(s) {
      return s;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(s) {
      return s;
    });
  }, c.prototype.findChildren = function() {
    const i = this.dom.querySelector("[data-ln-data-store]"), a = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]"), s = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: i,
      connectorEl: a,
      queueEl: s,
      store: i ? i.lnDataStore || i.lnStore : null,
      connector: a ? a.lnConnector || a.lnApiConnector || a.lnCouchDbConnector : null,
      queue: s ? s.lnApiQueue : null
    };
  }, c.prototype._handleSubmitRecord = function(i) {
    const a = this.findChildren();
    if (!a.storeEl) {
      console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || "") + '"');
      return;
    }
    const s = i.data || {}, _ = s.id, v = s.expected_version, S = Object.assign({}, s);
    delete S.id, delete S.expected_version;
    const w = i.method.toUpperCase();
    w === "POST" ? this._fanOutCreate(a, S, i.action) : (w === "PUT" || w === "PATCH") && this._fanOutUpdate(a, _, S, v, i.action);
  }, c.prototype._fanOutCreate = function(i, a, s) {
    this.refreshMapper();
    const _ = "_temp_" + r();
    A(i.storeEl, "ln-data-store:request-create", { tempId: _, data: a }), i.queue ? A(i.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: _,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(a),
      expectedVersion: null,
      meta: { tempId: _, action: s }
    }) : i.connector && A(i.connectorEl, "ln-api-connector:request-create", {
      data: this.mapper.egress(a),
      url: s,
      meta: { entryId: r(), queued: !1, op: "create", tempId: _ }
    });
  }, c.prototype._fanOutUpdate = function(i, a, s, _, v) {
    this.refreshMapper(), A(i.storeEl, "ln-data-store:request-update", { id: a, data: s }), i.queue ? A(i.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: a,
      op: "update",
      targetId: a,
      payload: this.mapper.egress(s),
      expectedVersion: _,
      meta: { id: a, action: v }
    }) : i.connector && A(i.connectorEl, "ln-api-connector:request-update", {
      id: a,
      data: this.mapper.egress(s),
      expected_version: _,
      url: v,
      meta: { entryId: r(), queued: !1, op: "update", id: a }
    });
  }, c.prototype._fanOutDelete = function(i, a) {
    this.refreshMapper(), A(i.storeEl, "ln-data-store:request-delete", { id: a }), i.queue ? A(i.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: a,
      op: "delete",
      targetId: a,
      payload: null,
      expectedVersion: null,
      meta: { id: a }
    }) : i.connector && A(i.connectorEl, "ln-api-connector:request-delete", {
      id: a,
      meta: { entryId: r(), queued: !1, op: "delete", id: a }
    });
  }, c.prototype._fanOutBulkDelete = function(i, a) {
    this.refreshMapper();
    const s = a.join(",");
    A(i.storeEl, "ln-data-store:request-bulk-delete", { ids: a }), i.queue ? A(i.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: s,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: a },
      expectedVersion: null,
      meta: { bulkKey: s, ids: a }
    }) : i.connector && A(i.connectorEl, "ln-api-connector:request-bulk-delete", {
      ids: a,
      meta: { entryId: r(), queued: !1, op: "bulk-delete", bulkKey: s }
    });
  }, c.prototype._toastFromMessage = function(i) {
    i && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: {
        type: i.type || "success",
        title: i.title || "",
        message: i.body || ""
      }
    }));
  }, c.prototype._toastFromDict = function(i) {
    const a = this._dict[i];
    a && window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: "error", title: "", message: a }
    }));
  }, c.prototype._requestStoreMutation = function(i, a, s) {
    const _ = i.storeEl;
    if (!_) return Promise.reject(new Error("Store element not found"));
    const v = r(), S = this._mutationReceipts.wait(v);
    return A(_, "ln-data-store:request-" + a, Object.assign({}, s, { requestId: v })), S;
  }, c.prototype._reportReconciliationError = function(i, a, s) {
    A(this.dom, "ln-data-coordinator:error", {
      operation: i,
      error: a,
      meta: s || null
    });
  };
  function m(i) {
    i._handlers = {
      sync: function(a) {
        i.refreshMapper();
        const s = i.findChildren();
        if (!s.store || !s.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        A(s.connectorEl, "ln-api-connector:request-sync", { since: a.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(a) {
        const s = i.findChildren();
        if (!s.connectorEl) return;
        const _ = a.detail || {};
        A(s.connectorEl, "ln-api-connector:request-query", {
          query: Object.assign({}, _.query, {
            offset: _.offset,
            limit: _.limit,
            queryGen: _.queryGen
          })
        });
      },
      reqCreate: function(a) {
        const s = i.findChildren();
        s.storeEl && i._fanOutCreate(s, a.detail.data || {}, a.detail.action);
      },
      reqUpdate: function(a) {
        const s = i.findChildren();
        s.storeEl && i._fanOutUpdate(s, a.detail.id, a.detail.data || {}, a.detail.expected_version, a.detail.action);
      },
      reqDelete: function(a) {
        const s = i.findChildren();
        s.storeEl && i._fanOutDelete(s, a.detail.id);
      },
      reqBulkDelete: function(a) {
        const s = i.findChildren();
        s.storeEl && i._fanOutBulkDelete(s, a.detail.ids || []);
      },
      queueFailed: function() {
        i._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(a) {
        i.refreshMapper();
        const s = i.findChildren();
        if (!s.store || !s.connector || !s.queue) return;
        const _ = a.detail || {}, v = _.entryId, S = _.op, w = _.targetId, C = _.payload, T = _.expectedVersion, q = _.meta || {}, x = q.action || null, I = _.idempotencyKey || v;
        S === "create" ? A(s.connectorEl, "ln-api-connector:request-create", {
          data: C,
          url: x,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "create", tempId: q.tempId }
        }) : S === "update" ? A(s.connectorEl, "ln-api-connector:request-update", {
          id: w,
          data: C,
          expected_version: T,
          url: x,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "update", id: w }
        }) : S === "delete" ? A(s.connectorEl, "ln-api-connector:request-delete", {
          id: w,
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "delete", id: w }
        }) : S === "bulk-delete" ? A(s.connectorEl, "ln-api-connector:request-bulk-delete", {
          ids: C && C.ids ? C.ids : [],
          idempotencyKey: I,
          meta: { entryId: v, queued: !0, op: "bulk-delete", bulkKey: q.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", S);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(a) {
        const s = a.target;
        if (a.defaultPrevented) return;
        const _ = s.hasAttribute(y) ? s.getAttribute(y) : null;
        if (_ === null) return;
        let v;
        if (_ ? v = _ === i._name : v = s.closest("[data-ln-data-coordinator]") === i.dom, !v) return;
        const S = De(s);
        if (S !== "POST" && S !== "PUT" && S !== "PATCH") return;
        a.preventDefault();
        const w = le(s);
        delete w._method, delete w._token, i._handleSubmitRecord({ data: w, method: S, action: s.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(a) {
        const s = a.detail.meta || {}, _ = i.findChildren();
        i.refreshMapper();
        const v = a.detail.data;
        let S = [], w = [], C = null;
        Array.isArray(v) ? (S = v, C = Math.floor(Date.now() / 1e3)) : v && (S = Array.isArray(v.data) ? v.data : [], w = Array.isArray(v.deleted) ? v.deleted : [], C = v.synced_at !== void 0 ? v.synced_at : v.since !== void 0 ? v.since : null);
        const T = S.map((q) => i.mapper.ingress(q));
        if (_.store && !_.store.initializationError)
          _.store.applySync(T, w, C || Math.floor(Date.now() / 1e3), {
            total: a.detail.total,
            filtered: a.detail.filtered,
            offset: a.detail.offset,
            queryGen: a.detail.queryGen,
            targetEl: s.targetEl,
            kind: s.kind
          });
        else if (s.targetEl && s.kind) {
          if (s.kind === "table" || s.kind === "list" || s.kind === "chart")
            A(s.targetEl, "ln-" + s.kind + ":set-loading", { loading: !1 }), A(s.targetEl, "ln-" + s.kind + ":set-data", {
              data: T,
              total: a.detail.total !== void 0 ? a.detail.total : T.length,
              filtered: a.detail.filtered !== void 0 ? a.detail.filtered : T.length,
              offset: a.detail.offset,
              queryGen: a.detail.queryGen
            }), i._boundDelivered.set(s.targetEl, !0);
          else if (s.kind === "options")
            A(s.targetEl, "ln-options:set-data", { data: T });
          else if (s.kind === "stat") {
            const q = a.detail.filtered !== void 0 ? a.detail.filtered : a.detail.total !== void 0 ? a.detail.total : T.length;
            A(s.targetEl, "ln-stat:set-count", { count: q });
          }
        }
      },
      connCreated: function(a) {
        const s = i.findChildren();
        if (!s.storeEl) return;
        const _ = a.detail.meta || {}, v = i.mapper.ingress(a.detail.record);
        i._requestStoreMutation(s, "update", { id: _.tempId, data: v }).then(function() {
          i._toastFromMessage(a.detail.message), _.queued && s.queue && A(s.queueEl, "ln-api-queue:resolve-create", {
            entryId: _.entryId,
            oldKey: _.tempId,
            newId: v.id
          });
        }).catch(function(S) {
          i._reportReconciliationError("create-reconcile", S, _);
        });
      },
      connUpdated: function(a) {
        const s = i.findChildren();
        if (!s.storeEl) return;
        const _ = a.detail.meta || {}, v = i.mapper.ingress(a.detail.record);
        i._requestStoreMutation(s, "update", { id: _.id, data: v }).then(function() {
          i._toastFromMessage(a.detail.message), _.queued && s.queue && A(s.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
        }).catch(function(S) {
          i._reportReconciliationError("update-reconcile", S, _);
        });
      },
      connDeleted: function(a) {
        const s = i.findChildren();
        if (!s.storeEl) return;
        const _ = a.detail.meta || {};
        i._toastFromMessage(a.detail.message), _.queued && s.queue && A(s.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      },
      connBulkDeleted: function(a) {
        const s = i.findChildren();
        if (!s.storeEl) return;
        const _ = a.detail.meta || {};
        i._toastFromMessage(a.detail.message), _.queued && s.queue && A(s.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      },
      connError: function(a) {
        const s = a.detail || {}, _ = s.meta || {}, v = _.op || s.action, S = s.status || 0, w = i.findChildren();
        if (v === "sync") {
          w.storeEl && A(w.storeEl, "ln-data-store:request-sync-failed", {
            error: s.error,
            status: S
          }), console.error("[ln-data-coordinator] Sync failed:", s.error);
          return;
        }
        if (v === "query") {
          _.targetEl && _.kind && A(_.targetEl, "ln-" + _.kind + ":set-loading", { loading: !1 }), i._reportReconciliationError("query", s.error || s, _);
          return;
        }
        if (!w.storeEl) return;
        const C = S === 401 || S === 419, T = S === 0 || S >= 500, q = S === 409 || S === 412;
        if (C) {
          i._toastFromDict("auth"), _.queued && w.queue && A(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "auth" });
          return;
        }
        if (T) {
          _.queued && w.queue ? A(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "retry" }) : i._toastFromDict("network");
          return;
        }
        let x = Promise.resolve();
        if (q && v === "update") {
          const I = s.data && s.data.remote ? i.mapper.ingress(s.data.remote) : null;
          I && (x = i._requestStoreMutation(w, "update", { id: _.id, data: I })), i._toastFromDict("conflict");
        } else v === "create" && (x = i._requestStoreMutation(w, "delete", { id: _.tempId })), i._toastFromDict("rejected");
        _.queued && w.queue ? x.then(function() {
          A(w.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: "drop" });
        }).catch(function(I) {
          i._reportReconciliationError("deterministic-reconcile", I, _);
        }) : x.catch(function(I) {
          i._reportReconciliationError("deterministic-reconcile", I, _);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(a) {
        const s = i.findChildren(), _ = s.store;
        if (!_ || _.initializationError || !s.connector || i._noAutosync || _.isSyncing) return;
        (a.detail || {}).hasCache ? i._isStale() && _.forceSync() : _.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(a) {
        i._serveData(a, "table");
      },
      reqListData: function(a) {
        i._serveData(a, "list");
      },
      reqChartData: function(a) {
        i._serveData(a, "chart");
      },
      reqOptions: function(a) {
        i._serveOptions(a);
      },
      reqStat: function(a) {
        i._serveStat(a);
      },
      refreshQuery: function() {
        i._refreshAll();
      },
      refresh: function(a) {
        i._mutationReceipts.resolve(a.detail), i._refreshAll();
      },
      mutationError: function(a) {
        i._mutationReceipts.reject(a.detail);
      },
      refreshSynced: function(a) {
        a.detail && a.detail.changed && i._refreshAll(a.detail.meta);
      }
    }, i.dom.addEventListener("ln-data-store:request-remote-sync", i._handlers.sync), i.dom.addEventListener("ln-data-store:request-page", i._handlers.requestPage), i.dom.addEventListener("ln-data-coordinator:request-create", i._handlers.reqCreate), i.dom.addEventListener("ln-data-coordinator:request-update", i._handlers.reqUpdate), i.dom.addEventListener("ln-data-coordinator:request-delete", i._handlers.reqDelete), i.dom.addEventListener("ln-data-coordinator:request-bulk-delete", i._handlers.reqBulkDelete), i.dom.addEventListener("ln-api-queue:send", i._handlers.queueSend), i.dom.addEventListener("ln-api-queue:failed", i._handlers.queueFailed), i.dom.addEventListener("ln-data-store:initialized", i._handlers.storeInitialized), document.addEventListener("submit", i._handlers.formSubmit), n.forEach(function(a) {
      i.dom.addEventListener(a + ":fetched", i._handlers.connFetched), i.dom.addEventListener(a + ":created", i._handlers.connCreated), i.dom.addEventListener(a + ":updated", i._handlers.connUpdated), i.dom.addEventListener(a + ":deleted", i._handlers.connDeleted), i.dom.addEventListener(a + ":bulk-deleted", i._handlers.connBulkDeleted), i.dom.addEventListener(a + ":error", i._handlers.connError);
    }), document.addEventListener("ln-table:request-data", i._handlers.reqTableData), document.addEventListener("ln-list:request-data", i._handlers.reqListData), document.addEventListener("ln-chart:request-data", i._handlers.reqChartData), document.addEventListener("ln-options:request-data", i._handlers.reqOptions), document.addEventListener("ln-stat:request-count", i._handlers.reqStat), i.dom.addEventListener("ln-data-store:ready", i._handlers.refresh), i.dom.addEventListener("ln-data-store:loaded", i._handlers.refresh), i.dom.addEventListener("ln-data-store:created", i._handlers.refresh), i.dom.addEventListener("ln-data-store:updated", i._handlers.refresh), i.dom.addEventListener("ln-data-store:deleted", i._handlers.refresh), i.dom.addEventListener("ln-data-store:mutation-error", i._handlers.mutationError), i.dom.addEventListener("ln-data-store:synced", i._handlers.refreshSynced), i.dom.addEventListener("ln-data-store:query-changed", i._handlers.refreshQuery);
  }
  c.prototype._ownsStore = function(i) {
    const a = this.findChildren();
    return !!(a.store && a.store._name === i && i);
  }, c.prototype._serveData = function(i, a) {
    const s = i.target, _ = a === "table" ? "data-ln-table-source" : a === "list" ? "data-ln-list-source" : "data-ln-chart-source", v = s.getAttribute(_);
    if (!v || !this._ownsStore(v)) return;
    const S = i.detail || {}, w = Ye(S);
    this._boundQueries.set(s, w);
    const C = this.findChildren(), T = this, q = C.store;
    return (q && q.ready ? q.ready : Promise.resolve()).then(function() {
      const I = Ut(q, C.connector), D = oe(w, q && q.query);
      if (I === "remote") {
        A(s, "ln-" + a + ":set-loading", { loading: !0 }), A(C.connectorEl, "ln-api-connector:request-query", {
          query: D,
          meta: { targetEl: s, kind: a }
        });
        return;
      }
      if (I !== "store") {
        A(s, "ln-" + a + ":set-loading", { loading: !1 });
        return;
      }
      return q.getAll(D).then(function(M) {
        const F = {
          data: M.data,
          total: M.total,
          filtered: M.filtered,
          offset: S.offset !== void 0 ? S.offset : M.offset,
          queryGen: S.queryGen !== void 0 ? S.queryGen : M.queryGen
        };
        A(s, "ln-" + a + ":set-data", F), T._boundDelivered.set(s, !0);
      });
    }).catch(function(I) {
      A(s, "ln-" + a + ":set-loading", { loading: !1 }), A(T.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: a,
        store: v,
        target: s,
        error: I
      });
    });
  }, c.prototype._serveOptions = function(i) {
    const a = i.target, s = a.getAttribute("data-ln-options");
    if (!this._ownsStore(s)) return;
    const _ = this.findChildren(), v = _.store, S = v && v.ready ? v.ready : Promise.resolve(), w = this;
    return S.then(function() {
      const C = Ut(v, _.connector);
      if (C === "remote") {
        A(_.connectorEl, "ln-api-connector:request-query", {
          query: {},
          meta: { targetEl: a, kind: "options" }
        });
        return;
      }
      if (C === "store")
        return v.getAll({}).then(function(T) {
          A(a, "ln-options:set-data", { data: T.data });
        });
    }).catch(function(C) {
      w._reportReconciliationError("options-query", C, { targetEl: a, kind: "options" });
    });
  }, c.prototype._serveStat = function(i) {
    const a = i.target, s = a.getAttribute("data-ln-stat");
    if (!this._ownsStore(s)) return;
    const _ = i.detail && i.detail.filters ? i.detail.filters : null, v = this.findChildren(), S = v.store, w = S && S.ready ? S.ready : Promise.resolve(), C = this;
    return w.then(function() {
      const T = Ut(S, v.connector);
      if (T === "remote") {
        A(v.connectorEl, "ln-api-connector:request-query", {
          query: { filters: _ },
          meta: { targetEl: a, kind: "stat" }
        });
        return;
      }
      if (T === "store")
        return S.count(_).then(function(q) {
          A(a, "ln-stat:set-count", { count: q });
        });
    }).catch(function(T) {
      C._reportReconciliationError("stat-query", T, { targetEl: a, kind: "stat" });
    });
  }, c.prototype._refreshAll = function(i) {
    const a = this, s = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let _ = 0; _ < s.length; _++) {
      const v = s[_];
      let S, w;
      if (v.hasAttribute("data-ln-table-source") ? (S = v.getAttribute("data-ln-table-source"), w = "table") : v.hasAttribute("data-ln-list-source") ? (S = v.getAttribute("data-ln-list-source"), w = "list") : v.hasAttribute("data-ln-chart-source") ? (S = v.getAttribute("data-ln-chart-source"), w = "chart") : v.hasAttribute("data-ln-options") ? (S = v.getAttribute("data-ln-options"), w = "options") : v.hasAttribute("data-ln-stat") && (S = v.getAttribute("data-ln-stat"), w = "stat"), !this._ownsStore(S)) continue;
      const C = this.findChildren().store;
      if (w === "table" || w === "list" || w === "chart") {
        const T = a._boundQueries.get(v) || { sort: null, filters: {}, search: "" };
        (function(q, x) {
          C.getAll(oe(T, C.query)).then(function(I) {
            const D = {
              data: I.data,
              total: i && i.total !== void 0 ? i.total : I.total,
              filtered: i && i.filtered !== void 0 ? i.filtered : I.filtered,
              offset: I.offset !== void 0 ? I.offset : i && i.offset !== void 0 ? i.offset : T.offset,
              queryGen: I.queryGen !== void 0 ? I.queryGen : i && i.queryGen !== void 0 ? i.queryGen : T.queryGen
            };
            A(q, "ln-" + x + ":set-loading", { loading: !1 }), A(q, "ln-" + x + ":set-data", D), a._boundDelivered.set(q, !0);
          });
        })(v, w);
      } else if (w === "options")
        (function(T) {
          C.getAll({}).then(function(q) {
            A(T, "ln-options:set-data", { data: q.data });
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
            A(x, "ln-stat:set-count", { count: D });
          });
        })(v, q);
      }
    }
  }, c.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const i = this;
    i._handlers && (i.dom.removeEventListener("ln-data-store:request-remote-sync", i._handlers.sync), i.dom.removeEventListener("ln-data-store:request-page", i._handlers.requestPage), i.dom.removeEventListener("ln-data-coordinator:request-create", i._handlers.reqCreate), i.dom.removeEventListener("ln-data-coordinator:request-update", i._handlers.reqUpdate), i.dom.removeEventListener("ln-data-coordinator:request-delete", i._handlers.reqDelete), i.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", i._handlers.reqBulkDelete), i.dom.removeEventListener("ln-api-queue:send", i._handlers.queueSend), i.dom.removeEventListener("ln-api-queue:failed", i._handlers.queueFailed), i.dom.removeEventListener("ln-data-store:initialized", i._handlers.storeInitialized), document.removeEventListener("submit", i._handlers.formSubmit), n.forEach(function(a) {
      i.dom.removeEventListener(a + ":fetched", i._handlers.connFetched), i.dom.removeEventListener(a + ":created", i._handlers.connCreated), i.dom.removeEventListener(a + ":updated", i._handlers.connUpdated), i.dom.removeEventListener(a + ":deleted", i._handlers.connDeleted), i.dom.removeEventListener(a + ":bulk-deleted", i._handlers.connBulkDeleted), i.dom.removeEventListener(a + ":error", i._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", i._handlers.reqTableData), document.removeEventListener("ln-list:request-data", i._handlers.reqListData), document.removeEventListener("ln-chart:request-data", i._handlers.reqChartData), document.removeEventListener("ln-options:request-data", i._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", i._handlers.reqStat), i.dom.removeEventListener("ln-data-store:ready", i._handlers.refresh), i.dom.removeEventListener("ln-data-store:loaded", i._handlers.refresh), i.dom.removeEventListener("ln-data-store:created", i._handlers.refresh), i.dom.removeEventListener("ln-data-store:updated", i._handlers.refresh), i.dom.removeEventListener("ln-data-store:deleted", i._handlers.refresh), i.dom.removeEventListener("ln-data-store:mutation-error", i._handlers.mutationError), i.dom.removeEventListener("ln-data-store:synced", i._handlers.refreshSynced), i.dom.removeEventListener("ln-data-store:query-changed", i._handlers.refreshQuery), i._handlers = null), i._boundQueries = null, i._boundDelivered = null, i._mutationReceipts.close(new Error("Data coordinator destroyed")), i._mutationReceipts = null, p.delete(this), t(), delete this.dom[l], delete this.dom[b];
  };
  function g(i, a) {
    const s = i[l];
    s && a === "data-ln-data-mapper" && s.refreshMapper();
  }
  H(h, l, c, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: g
  });
})();
const Je = "ln_api_queue", Ze = 2, G = "outbox", tt = "_queue_meta";
function nt(h, l) {
  return h.error || new Error(l);
}
function yt(h, l) {
  return h.bound([l, -1 / 0], [l, 1 / 0]);
}
function se(h) {
  return "seq:" + h;
}
function kt(h) {
  return "paused:" + h;
}
function ae(h) {
  h.leaseOwner = null, h.leaseUntil = 0;
}
function tn(h, l, b) {
  return typeof h != "string" || h.indexOf(l) === -1 ? h : h.split(l).join(b);
}
function en(h, l, b, y) {
  const p = /* @__PURE__ */ new Map(), f = [], u = [];
  for (const o of h || [])
    p.has(o.chainKey) || p.set(o.chainKey, []), p.get(o.chainKey).push(o);
  return p.forEach((o, d) => {
    o.sort((t, r) => t.seq - r.seq);
    const e = o[0];
    if (!(!e || e.status === "failed")) {
      if (e.status === "inflight" && (e.leaseUntil || 0) > y) {
        u.push({ chainKey: d, at: e.leaseUntil });
        return;
      }
      if ((e.nextAttemptAt || 0) > y) {
        u.push({ chainKey: d, at: e.nextAttemptAt });
        return;
      }
      e.status = "inflight", e.leaseOwner = l, e.leaseUntil = y + b, e.updatedAt = y, f.push(e);
    }
  }), { entries: f, wakeups: u };
}
function nn(h, l, b, y, p) {
  const f = [], u = [];
  for (const o of h || []) {
    if (o.entryId === l) {
      u.push(o.entryId);
      continue;
    }
    o.chainKey === b && (o.chainKey = y, o.targetId === b && (o.targetId = y), o.meta && o.meta.id === b && (o.meta.id = y), o.meta && typeof o.meta.action == "string" && (o.meta.action = tn(o.meta.action, b, y)), o.updatedAt = p, f.push(o));
  }
  return { changed: f, deleted: u };
}
class rn {
  constructor(l) {
    l = l || {}, this.indexedDB = l.indexedDB || globalThis.indexedDB, this.keyRange = l.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = l.dbName || Je, this.now = l.now || (() => Date.now()), this.uuid = l.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((l, b) => {
      const y = this.indexedDB.open(this.dbName, Ze);
      y.onupgradeneeded = (p) => {
        const f = p.target.result;
        let u;
        f.objectStoreNames.contains(G) ? u = p.target.transaction.objectStore(G) : u = f.createObjectStore(G, { keyPath: "entryId" }), u.indexNames.contains("by_scope_chain") || u.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), u.indexNames.contains("by_scope_seq") || u.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), f.objectStoreNames.contains(tt) || f.createObjectStore(tt, { keyPath: "key" });
      }, y.onerror = () => b(nt(y, "Queue database open failed")), y.onsuccess = (p) => {
        this._db = p.target.result, this._db.onversionchange = () => this.close(), l(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((l, b) => {
      const y = this.indexedDB.deleteDatabase(this.dbName);
      y.onsuccess = () => l(), y.onerror = () => b(nt(y, "Queue database delete failed")), y.onblocked = () => b(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(l) {
    return this.open().then((b) => b ? new Promise((y, p) => {
      const u = b.transaction(G, "readonly").objectStore(G).index("by_scope_seq").getAll(yt(this.keyRange, l));
      u.onsuccess = () => y(u.result || []), u.onerror = () => p(nt(u, "Queue scope read failed"));
    }) : []);
  }
  enqueue(l, b) {
    return b = b || {}, this.open().then((y) => y ? new Promise((p, f) => {
      const u = y.transaction([tt, G], "readwrite"), o = u.objectStore(tt), d = u.objectStore(G), e = se(l);
      let t = null;
      const r = (c) => {
        const m = c + 1;
        t = {
          entryId: this.uuid(),
          scope: l,
          chainKey: b.chainKey,
          seq: m,
          op: b.op,
          targetId: b.targetId !== void 0 ? b.targetId : null,
          payload: b.payload,
          expectedVersion: b.expectedVersion !== void 0 ? b.expectedVersion : null,
          meta: b.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, o.put({ key: e, value: m }), d.put(t);
      }, n = o.get(e);
      n.onerror = () => f(nt(n, "Queue sequence read failed")), n.onsuccess = () => {
        const c = n.result;
        if (c && typeof c.value == "number") {
          r(c.value);
          return;
        }
        const m = d.index("by_scope_seq").getAll(yt(this.keyRange, l));
        m.onerror = () => f(nt(m, "Queue sequence migration failed")), m.onsuccess = () => {
          const g = (m.result || []).reduce((i, a) => Math.max(i, a.seq || 0), 0);
          r(g);
        };
      }, u.oncomplete = () => p(t), u.onerror = () => f(u.error || new Error("Queue enqueue transaction failed")), u.onabort = () => f(u.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(l, b, y) {
    return this.open().then((p) => p ? new Promise((f, u) => {
      const o = p.transaction(G, "readwrite"), d = o.objectStore(G), e = d.index("by_scope_seq").getAll(yt(this.keyRange, l)), t = this.now();
      let r = { entries: [], wakeups: [] };
      e.onerror = () => u(nt(e, "Queue claim read failed")), e.onsuccess = () => {
        r = en(e.result || [], b, y, t);
        for (const n of r.entries) d.put(n);
      }, o.oncomplete = () => f(r), o.onerror = () => u(o.error || new Error("Queue claim transaction failed")), o.onabort = () => u(o.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(l, b) {
    return this._updateEntry(l, b, (y, p) => (p.delete(y.entryId), { status: "acked", entry: y }));
  }
  nack(l, b, y, p) {
    p = p || {};
    const f = p.maxAttempts || 8, u = p.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((o) => o ? new Promise((d, e) => {
      const t = o.transaction([G, tt], "readwrite"), r = t.objectStore(G), n = t.objectStore(tt), c = r.get(b);
      let m = null;
      c.onerror = () => e(nt(c, "Queue nack read failed")), c.onsuccess = () => {
        const g = c.result;
        if (!(!g || g.scope !== l)) {
          if (y === "drop") {
            r.delete(g.entryId), m = { status: "dropped", entry: g };
            return;
          }
          if (ae(g), g.updatedAt = this.now(), y === "auth") {
            g.status = "pending", r.put(g), n.put({ key: kt(l), value: !0 }), m = { status: "auth", entry: g };
            return;
          }
          if (y === "retry") {
            if (g.attempts = (g.attempts || 0) + 1, g.attempts >= f) {
              g.status = "failed", g.nextAttemptAt = 0, r.put(g), m = { status: "failed", entry: g };
              return;
            }
            const i = u[Math.min(g.attempts - 1, u.length - 1)];
            g.status = "pending", g.nextAttemptAt = this.now() + i, r.put(g), m = { status: "retry", entry: g, delay: i };
          }
        }
      }, t.oncomplete = () => d(m), t.onerror = () => e(t.error || new Error("Queue nack transaction failed")), t.onabort = () => e(t.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(l, b, y) {
    return this._remapTransaction(l, null, b, y);
  }
  resolveCreate(l, b, y, p) {
    return this._remapTransaction(l, b, y, p);
  }
  _remapTransaction(l, b, y, p) {
    return this.open().then((f) => f ? new Promise((u, o) => {
      const d = f.transaction(G, "readwrite"), e = d.objectStore(G), t = e.index("by_scope_seq").getAll(yt(this.keyRange, l));
      let r = { changed: [], deleted: [] };
      t.onerror = () => o(nt(t, "Queue remap read failed")), t.onsuccess = () => {
        r = nn(t.result || [], b, y, p, this.now());
        for (const n of r.deleted) e.delete(n);
        for (const n of r.changed) e.put(n);
      }, d.oncomplete = () => u(r.changed), d.onerror = () => o(d.error || new Error("Queue remap transaction failed")), d.onabort = () => o(d.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(l) {
    return this.open().then((b) => b ? new Promise((y, p) => {
      const f = b.transaction(G, "readwrite"), u = f.objectStore(G), o = u.index("by_scope_seq").getAll(yt(this.keyRange, l));
      let d = 0;
      o.onerror = () => p(nt(o, "Queue failed-entry read failed")), o.onsuccess = () => {
        for (const e of o.result || [])
          e.status === "failed" && (e.status = "pending", e.attempts = 0, e.nextAttemptAt = 0, e.updatedAt = this.now(), ae(e), u.put(e), d++);
      }, f.oncomplete = () => y(d), f.onerror = () => p(f.error || new Error("Queue failed-entry reset failed")), f.onabort = () => p(f.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(l) {
    return this.open().then((b) => b ? new Promise((y, p) => {
      const u = b.transaction(tt, "readonly").objectStore(tt).get(kt(l));
      u.onsuccess = () => y(!!(u.result && u.result.value)), u.onerror = () => p(nt(u, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(l, b) {
    return this.open().then((y) => {
      if (y)
        return new Promise((p, f) => {
          const u = y.transaction(tt, "readwrite");
          u.objectStore(tt).put({ key: kt(l), value: !!b }), u.oncomplete = () => p(), u.onerror = () => f(u.error || new Error("Queue pause-state write failed")), u.onabort = () => f(u.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(l) {
    return this.open().then((b) => {
      if (b)
        return new Promise((y, p) => {
          const f = b.transaction([G, tt], "readwrite"), o = f.objectStore(G).index("by_scope_seq").openCursor(yt(this.keyRange, l));
          o.onsuccess = (d) => {
            const e = d.target.result;
            e && (e.delete(), e.continue());
          }, o.onerror = () => p(nt(o, "Queue clear failed")), f.objectStore(tt).delete(se(l)), f.objectStore(tt).delete(kt(l)), f.oncomplete = () => y(), f.onerror = () => p(f.error || new Error("Queue clear transaction failed")), f.onabort = () => p(f.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(l, b, y) {
    return this.open().then((p) => p ? new Promise((f, u) => {
      const o = p.transaction(G, "readwrite"), d = o.objectStore(G), e = d.get(b);
      let t = null;
      e.onerror = () => u(nt(e, "Queue entry read failed")), e.onsuccess = () => {
        const r = e.result;
        !r || r.scope !== l || (t = y(r, d));
      }, o.oncomplete = () => f(t), o.onerror = () => u(o.error || new Error("Queue entry transaction failed")), o.onabort = () => u(o.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const h = "data-ln-api-queue", l = "lnApiQueue", b = [2e3, 5e3, 15e3, 6e4, 3e5], y = 8, p = 6e4;
  if (window[l] !== void 0) return;
  function f() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
        const r = Math.random() * 16 | 0;
        return (t === "x" ? r : r & 3 | 8).toString(16);
      });
    }
  }
  const u = new rn({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: f
  });
  function o(e) {
    this.dom = e, e[l] = this;
    const t = e.closest("[data-ln-data-coordinator]");
    this.scope = e.id || (t ? t.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = f(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const r = this;
    return u.open().then((n) => n ? u.getPaused(r.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((n) => (r._paused = !!n, r._paused && A(r.dom, "ln-api-queue:paused", { reason: "auth", restored: !0 }), r._emitPendingCount())).then(() => r._drain()).catch((n) => {
      console.error("[ln-api-queue] Initialization failed:", n), A(r.dom, "ln-api-queue:error", { operation: "initialize", error: n });
    }), this;
  }
  o.prototype._isOnline = function() {
    const e = this.dom.getAttribute("data-ln-api-queue-online");
    return e === "true" ? !0 : e === "false" ? !1 : navigator.onLine;
  }, o.prototype._emitPendingCount = function() {
    const e = this;
    return u.allForScope(e.scope).then((t) => (A(e.dom, "ln-api-queue:pending-count", { count: t.length, scope: e.scope }), t.length === 0 && A(e.dom, "ln-api-queue:drained", { scope: e.scope }), t));
  }, o.prototype._clearTimer = function(e) {
    const t = this._timers.get(e);
    t && (clearTimeout(t), this._timers.delete(e));
  }, o.prototype._scheduleTimer = function(e, t) {
    const r = Math.max(0, t), n = this._timers.get(e);
    n && clearTimeout(n);
    const c = this, m = setTimeout(() => {
      c._timers.delete(e), c._drain();
    }, r);
    this._timers.set(e, m);
  }, o.prototype._drain = function() {
    const e = this;
    return e._paused || !e._isOnline() ? Promise.resolve() : (e._drainPromise || (e._drainPromise = u.claimReady(e.scope, e._workerId, p).then((t) => {
      for (const r of t.wakeups)
        e._scheduleTimer(r.chainKey, r.at - Date.now());
      for (const r of t.entries)
        e._clearTimer(r.chainKey), A(e.dom, "ln-api-queue:send", {
          entryId: r.entryId,
          chainKey: r.chainKey,
          op: r.op,
          targetId: r.targetId,
          payload: r.payload,
          expectedVersion: r.expectedVersion,
          idempotencyKey: r.entryId,
          meta: r.meta
        });
    }).catch((t) => {
      console.error("[ln-api-queue] Drain failed:", t), A(e.dom, "ln-api-queue:error", { operation: "drain", error: t });
    }).finally(() => {
      e._drainPromise = null;
    })), e._drainPromise);
  }, o.prototype._onEnqueue = function(e) {
    const t = this;
    return u.enqueue(t.scope, e.detail || {}).then((r) => {
      if (r)
        return t._emitPendingCount().then((n) => (A(t.dom, "ln-api-queue:enqueued", {
          entryId: r.entryId,
          chainKey: r.chainKey,
          count: n.length
        }), t._drain()));
    }).catch((r) => {
      A(t.dom, "ln-api-queue:error", { operation: "enqueue", error: r });
    });
  }, o.prototype._onAck = function(e) {
    const t = this, r = e.detail || {};
    return u.ack(t.scope, r.entryId).then(() => t._emitPendingCount()).then(() => t._drain()).catch((n) => {
      A(t.dom, "ln-api-queue:error", { operation: "ack", entryId: r.entryId, error: n });
    });
  }, o.prototype._onNack = function(e) {
    const t = this, r = e.detail || {};
    return u.nack(t.scope, r.entryId, r.reason, {
      maxAttempts: y,
      backoff: b
    }).then((n) => {
      if (n)
        return n.status === "failed" ? A(t.dom, "ln-api-queue:failed", {
          entryId: n.entry.entryId,
          chainKey: n.entry.chainKey,
          attempts: n.entry.attempts
        }) : n.status === "retry" ? t._scheduleTimer(n.entry.chainKey, n.delay) : n.status === "auth" && (t._paused = !0, A(t.dom, "ln-api-queue:paused", { reason: "auth" }), A(t.dom, "ln-api-queue:auth-required", {
          entryId: n.entry.entryId,
          chainKey: n.entry.chainKey
        })), t._emitPendingCount().then(() => {
          if (n.status === "dropped") return t._drain();
        });
    }).catch((n) => {
      A(t.dom, "ln-api-queue:error", { operation: "nack", entryId: r.entryId, error: n });
    });
  }, o.prototype._onRemap = function(e) {
    const t = this, r = e.detail || {};
    return u.remap(t.scope, r.oldKey, r.newId).catch((n) => {
      A(t.dom, "ln-api-queue:error", { operation: "remap", error: n });
    });
  }, o.prototype._onResolveCreate = function(e) {
    const t = this, r = e.detail || {};
    return u.resolveCreate(t.scope, r.entryId, r.oldKey, r.newId).then(() => t._emitPendingCount()).then(() => t._drain()).catch((n) => {
      A(t.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: r.entryId,
        error: n
      });
    });
  }, o.prototype._onResume = function() {
    const e = this;
    return u.setPaused(e.scope, !1).then(() => (e._paused = !1, A(e.dom, "ln-api-queue:resumed", {}), e._drain())).catch((t) => {
      A(e.dom, "ln-api-queue:error", { operation: "resume", error: t });
    });
  }, o.prototype._onDrain = function() {
    const e = this;
    return u.resetFailed(e.scope).then(() => {
      const t = e._drainPromise;
      return t ? t.then(() => e._drain()) : e._drain();
    }).catch((t) => {
      A(e.dom, "ln-api-queue:error", { operation: "manual-drain", error: t });
    });
  }, o.prototype._onClear = function() {
    const e = this;
    return e._timers.forEach((t) => clearTimeout(t)), e._timers.clear(), u.clear(e.scope).then(() => {
      e._paused = !1, A(e.dom, "ln-api-queue:pending-count", { count: 0, scope: e.scope }), A(e.dom, "ln-api-queue:drained", { scope: e.scope });
    }).catch((t) => {
      A(e.dom, "ln-api-queue:error", { operation: "clear", error: t });
    });
  }, o.prototype._bindEvents = function() {
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
  }, o.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const e = this;
    e.dom.removeEventListener("ln-api-queue:request-enqueue", e._handlers.enqueue), e.dom.removeEventListener("ln-api-queue:ack", e._handlers.ack), e.dom.removeEventListener("ln-api-queue:nack", e._handlers.nack), e.dom.removeEventListener("ln-api-queue:request-remap", e._handlers.remap), e.dom.removeEventListener("ln-api-queue:resolve-create", e._handlers.resolveCreate), e.dom.removeEventListener("ln-api-queue:request-resume", e._handlers.resume), e.dom.removeEventListener("ln-api-queue:request-drain", e._handlers.drain), e.dom.removeEventListener("ln-api-queue:request-clear", e._handlers.clear), window.removeEventListener("online", e._onlineHandler), e._timers.forEach((t) => clearTimeout(t)), e._timers.clear(), A(e.dom, "ln-api-queue:destroyed", { scope: e.scope }), delete e.dom[l];
  };
  function d(e) {
    const t = e[l];
    t && t._drain();
  }
  H(h, l, o, "ln-api-queue", {
    extraAttributes: ["data-ln-api-queue-online"],
    onAttributeChange: d
  });
})();
function Le(h) {
  if (h == null || h === "") return null;
  const l = Number(h);
  return Number.isFinite(l) ? l : null;
}
function vt(h) {
  return String(Math.round(h * 1e3) / 1e3);
}
function on(h, l, b) {
  const y = Le(h);
  return y === null || y < 0 ? 0 : Math.min(y, Math.min(l, b) / 2);
}
function sn(h) {
  if (typeof h != "string") return null;
  const l = h.trim().split(/[\s,]+/).map(Number);
  return l.length !== 4 || l.some((b) => !Number.isFinite(b)) || l[2] <= 0 || l[3] <= 0 ? null : { x: l[0], y: l[1], width: l[2], height: l[3] };
}
function an(h, l) {
  l = l || {};
  const b = l.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, y = l.xField || "label", p = l.yField || "value", f = l.includeZero !== !1, u = on(l.padding, b.width, b.height), o = Array.isArray(h) ? h : [], d = [];
  for (let x = 0; x < o.length; x++) {
    const I = o[x] || {}, D = Le(I[p]);
    D !== null && d.push({
      record: I,
      sourceIndex: x,
      label: I[y] == null ? String(x + 1) : String(I[y]),
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
      baselineY: b.y + b.height - u
    };
  const e = d.map((x) => x.value), t = Math.min(...e), r = Math.max(...e);
  let n = f ? Math.min(0, t) : t, c = f ? Math.max(0, r) : r;
  if (n === c)
    if (n === 0)
      c = 1;
    else {
      const x = Math.max(Math.abs(n) * 0.1, 1);
      n -= x, c += x;
    }
  const m = b.x + u, g = b.y + u, i = Math.max(0, b.width - u * 2), a = Math.max(0, b.height - u * 2), s = d.length > 1 ? i / (d.length - 1) : 0, _ = c - n, v = (x) => g + (c - x) / _ * a, S = d.map((x, I) => ({
    ...x,
    x: d.length === 1 ? m + i / 2 : m + I * s,
    y: v(x.value)
  })), w = n <= 0 && c >= 0 ? 0 : n, C = v(w), T = S.map((x) => vt(x.x) + "," + vt(x.y)).join(" "), q = [
    vt(S[0].x) + "," + vt(C),
    T,
    vt(S[S.length - 1].x) + "," + vt(C)
  ].join(" ");
  return {
    points: S,
    linePoints: T,
    areaPoints: q,
    count: S.length,
    min: t,
    max: r,
    domainMin: n,
    domainMax: c,
    baselineY: C
  };
}
(function() {
  const h = "data-ln-chart", l = "lnChart", b = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[l] !== void 0) return;
  function y(o) {
    if (!o) return null;
    const d = o.split(":"), e = d[0].trim();
    return e ? {
      field: e,
      direction: d[1] && d[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
    } : null;
  }
  function p(o, d) {
    if (o == null || !Number.isFinite(o)) return "";
    try {
      return new Intl.NumberFormat(W(d)).format(o);
    } catch {
      return String(o);
    }
  }
  function f(o, d) {
    o && (o.textContent = d);
  }
  function u(o) {
    this.dom = o, this.name = o.getAttribute(h) || "", this.source = o.getAttribute("data-ln-chart-source") || this.name, this.plot = o.querySelector("[data-ln-chart-plot]"), this.line = o.querySelector("[data-ln-chart-line]"), this.area = o.querySelector("[data-ln-chart-area]"), this.labels = o.querySelector("[data-ln-chart-labels]"), this.empty = o.querySelector("[data-ln-chart-empty]"), this.minimum = o.querySelector("[data-ln-chart-min]"), this.maximum = o.querySelector("[data-ln-chart-max]"), this.count = o.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const d = this;
    return this._onSetData = function(e) {
      const t = e.detail || {};
      d._data = Array.isArray(t.data) ? t.data : [], d.isLoaded = !0, d._setLoading(!1), d._render();
    }, this._onSetLoading = function(e) {
      d._setLoading(!!(e.detail && e.detail.loading));
    }, this._onRefresh = function() {
      d.requestData();
    }, o.addEventListener("ln-chart:set-data", this._onSetData), o.addEventListener("ln-chart:set-loading", this._onSetLoading), o.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  u.prototype._readOptions = function() {
    const o = this.dom.getAttribute("data-ln-chart-padding"), d = o === null ? NaN : Number(o), e = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(d) && d >= 0 ? d : 16,
      type: e === "area" || e === "polygon" ? "area" : "line",
      viewBox: this.plot && sn(this.plot.getAttribute("viewBox")) || b
    };
  }, u.prototype._setLoading = function(o) {
    this.dom.classList.toggle("ln-chart--loading", o), this.dom.setAttribute("aria-busy", o ? "true" : "false");
  }, u.prototype._renderLabels = function(o) {
    if (!this.labels || (this.labels.replaceChildren(), o.count === 0)) return;
    const d = this.name + "-label", e = '[data-ln-template="' + d + '"]';
    if (!this.dom.querySelector(e) && !document.querySelector(e)) return;
    const t = mt(this.dom, d, "ln-chart");
    if (t)
      for (const r of o.points) {
        const n = t.cloneNode(!0);
        wt(n, {
          label: r.label,
          value: p(r.value, this.dom)
        }), this.labels.appendChild(n);
      }
  }, u.prototype._render = function() {
    const o = this._readOptions(), d = an(this._data, o);
    this.model = d, this.line && (this.line.setAttribute("points", d.linePoints), this.line.toggleAttribute("hidden", d.count === 0)), this.area && (this.area.setAttribute("points", d.areaPoints), this.area.toggleAttribute("hidden", d.count === 0 || o.type !== "area"));
    const e = d.count === 0;
    this.dom.classList.toggle("ln-chart--empty", e), this.empty && this.empty.toggleAttribute("hidden", !e), f(this.minimum, p(d.min, this.dom)), f(this.maximum, p(d.max, this.dom)), f(this.count, p(d.count, this.dom)), this._renderLabels(d), A(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: d.count,
      min: d.min,
      max: d.max
    });
  }, u.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, A(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: y(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, u.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[l]);
  }, H(h, l, u, "ln-chart", {
    extraAttributes: [
      "data-ln-chart-source",
      "data-ln-chart-x",
      "data-ln-chart-y",
      "data-ln-chart-type",
      "data-ln-chart-padding",
      "data-ln-chart-zero",
      "data-ln-chart-sort"
    ],
    onAttributeChange: function(o, d) {
      const e = o[l];
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
  const h = "data-ln-options", l = "lnOptions";
  if (window[l] !== void 0) return;
  function b(y) {
    this.dom = y, this._storeName = y.getAttribute(h), this._valueField = y.getAttribute("data-ln-options-value") || "id", this._labelField = y.getAttribute("data-ln-options-label") || "name";
    const p = this;
    return this._onSetData = function(f) {
      p._rebuild(f.detail.data || []);
    }, y.addEventListener("ln-options:set-data", this._onSetData), A(y, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(y) {
    const p = this.dom, f = this._valueField, u = this._labelField, o = p.value, d = p.querySelectorAll("option");
    for (let t = d.length - 1; t >= 0; t--)
      d[t].value !== "" && p.removeChild(d[t]);
    for (let t = 0; t < y.length; t++) {
      const r = y[t], n = document.createElement("option");
      n.value = String(r[f]), n.textContent = r[u] != null ? r[u] : "", p.appendChild(n);
    }
    const e = p.options;
    for (let t = 0; t < e.length; t++)
      if (e[t].value === o) {
        p.value = o;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[l]);
  }, H(h, l, b, "ln-options");
})();
(function() {
  const h = "data-ln-stat", l = "lnStat";
  if (window[l] !== void 0) return;
  function b(p) {
    if (!p) return null;
    const f = p.indexOf(":");
    if (f === -1) return null;
    const u = p.slice(0, f), o = p.slice(f + 1), d = {};
    return d[u] = [o], d;
  }
  function y(p) {
    return this.dom = p, this._storeName = p.getAttribute(h), this._filters = b(p.getAttribute("data-ln-stat-filter")), this._onSetCount = function(f) {
      p.textContent = String(f.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), A(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  y.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[l]);
  }, H(h, l, y, "ln-stat");
})();
(function() {
  const h = "ln-icons-sprite", l = "#ln-", b = "#lnc-", y = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let f = null;
  const u = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), o = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), d = "lni:", e = "lni:v", t = "1";
  function r() {
    try {
      if (localStorage.getItem(e) !== t) {
        for (let s = localStorage.length - 1; s >= 0; s--) {
          const _ = localStorage.key(s);
          _ && _.indexOf(d) === 0 && localStorage.removeItem(_);
        }
        localStorage.setItem(e, t);
      }
    } catch {
    }
  }
  r();
  function n() {
    return f || (f = document.getElementById(h), f || (f = document.createElementNS("http://www.w3.org/2000/svg", "svg"), f.id = h, f.setAttribute("hidden", ""), f.setAttribute("aria-hidden", "true"), f.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(f, document.body.firstChild))), f;
  }
  function c(s) {
    return s.indexOf(b) === 0 ? o + "/" + s.slice(b.length) + ".svg" : u + "/" + s.slice(l.length) + ".svg";
  }
  function m(s, _) {
    const v = _.match(/viewBox="([^"]+)"/), S = v ? v[1] : "0 0 24 24", w = _.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = w ? w[1].trim() : "", T = _.match(/<svg([^>]*)>/i), q = T ? T[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = s, x.setAttribute("viewBox", S), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const D = q.match(new RegExp(I + '="([^"]*)"'));
      D && x.setAttribute(I, D[1]);
    }), x.innerHTML = C, n().querySelector("defs").appendChild(x);
  }
  function g(s) {
    if (y.has(s) || p.has(s) || s.indexOf(b) === 0 && !o) return;
    const _ = s.slice(1);
    try {
      const v = localStorage.getItem(d + _);
      if (v) {
        m(_, v), y.add(s);
        return;
      }
    } catch {
    }
    p.add(s), fetch(c(s)).then(function(v) {
      if (!v.ok) throw new Error(v.status);
      return v.text();
    }).then(function(v) {
      m(_, v), y.add(s), p.delete(s);
      try {
        localStorage.setItem(d + _, v);
      } catch {
      }
    }).catch(function() {
      p.delete(s);
    });
  }
  function i(s) {
    const _ = 'use[href^="' + l + '"], use[href^="' + b + '"]', v = s.querySelectorAll ? s.querySelectorAll(_) : [];
    if (s.matches && s.matches(_)) {
      const S = s.getAttribute("href");
      S && g(S);
    }
    Array.prototype.forEach.call(v, function(S) {
      const w = S.getAttribute("href");
      w && g(w);
    });
  }
  function a() {
    i(document), new MutationObserver(function(s) {
      s.forEach(function(_) {
        if (_.type === "childList")
          _.addedNodes.forEach(function(v) {
            v.nodeType === 1 && i(v);
          });
        else if (_.type === "attributes" && _.attributeName === "href") {
          const v = _.target.getAttribute("href");
          v && (v.indexOf(l) === 0 || v.indexOf(b) === 0) && g(v);
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
  const h = "data-ln-debug", l = "lnDebug";
  if (window[l] !== void 0) return;
  function b(y) {
    return this.dom = y, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[l];
  }, H(h, l, b, "ln-debug");
})();
