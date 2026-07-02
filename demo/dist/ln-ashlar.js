if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...c) {
    typeof c[0] == "string" && (c[0].startsWith("[ln-") || c[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, c);
  };
}
const xt = {};
function wt(h, c) {
  xt[h] || (xt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const _ = xt[h];
  return _ ? _.content.cloneNode(!0) : (console.warn("[" + (c || "ln-core") + '] Template "' + h + '" not found'), null);
}
function S(h, c, _) {
  h.dispatchEvent(new CustomEvent(c, {
    bubbles: !0,
    detail: _ || {}
  }));
}
function z(h, c, _) {
  const m = new CustomEvent(c, {
    bubbles: !0,
    cancelable: !0,
    detail: _ || {}
  });
  return h.dispatchEvent(m), m;
}
function Kt(h, c, _) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const m = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  m[_] = h.name, S(h.dom, c, m);
}
function X(h, c) {
  if (!h || !c) return h;
  const _ = h.querySelectorAll("[data-ln-field]");
  for (let n = 0; n < _.length; n++) {
    const s = _[n], t = s.getAttribute("data-ln-field");
    c[t] != null && (s.textContent = c[t]);
  }
  const m = h.querySelectorAll("[data-ln-attr]");
  for (let n = 0; n < m.length; n++) {
    const s = m[n], t = s.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const i = e[0].trim(), u = e[1].trim();
      c[u] != null && s.setAttribute(i, c[u]);
    }
  }
  const p = h.querySelectorAll("[data-ln-show]");
  for (let n = 0; n < p.length; n++) {
    const s = p[n], t = s.getAttribute("data-ln-show");
    t in c && s.classList.toggle("hidden", !c[t]);
  }
  const f = h.querySelectorAll("[data-ln-class]");
  for (let n = 0; n < f.length; n++) {
    const s = f[n], t = s.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const i = e[0].trim(), u = e[1].trim();
      u in c && s.classList.toggle(i, !!c[u]);
    }
  }
  return h;
}
function ce(h, c) {
  h.matches && h.matches("[data-ln-form], [data-ln-fillable]") && h.dispatchEvent(new CustomEvent("ln-fill", { detail: c ?? null, bubbles: !0 }));
  const _ = h.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let m = 0; m < _.length; m++)
    _[m].dispatchEvent(new CustomEvent("ln-fill", { detail: c ?? null, bubbles: !0 }));
  return h;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(h) {
  if (!(!h.target.matches || !h.target.matches("[data-ln-fillable]")))
    if (h.detail)
      X(h.target, h.detail);
    else {
      const c = h.target.querySelectorAll("[data-ln-field]");
      for (let _ = 0; _ < c.length; _++)
        c[_].textContent = "";
    }
})));
function yt(h, c) {
  if (!h || !c) return h;
  const _ = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; _.nextNode(); ) {
    const f = _.currentNode;
    f.textContent.indexOf("{{") !== -1 && (f.textContent = f.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(n, s) {
        return c[s] !== void 0 ? c[s] : "";
      }
    ));
  }
  const m = function(f, n) {
    return c[n] !== void 0 ? c[n] : "";
  }, p = Array.from(h.querySelectorAll("*"));
  h.nodeType === 1 && p.push(h);
  for (let f = 0; f < p.length; f++) {
    const n = p[f], s = n.attributes;
    for (let t = 0; t < s.length; t++) {
      const o = s[t];
      o.value.indexOf("{{") !== -1 && n.setAttribute(o.name, o.value.replace(/\{\{\s*(\w+)\s*\}\}/g, m));
    }
  }
  return h;
}
function de(h, c, _, m, p, f) {
  const n = {};
  for (let t = 0; t < h.children.length; t++) {
    const o = h.children[t], e = o.getAttribute("data-ln-key");
    e && (n[e] = o);
  }
  const s = document.createDocumentFragment();
  for (let t = 0; t < c.length; t++) {
    const o = c[t], e = String(m(o));
    let i = n[e];
    if (i)
      p(i, o, t);
    else {
      const u = wt(_, f);
      if (!u || (yt(u, o), i = u.firstElementChild, !i)) continue;
      i.setAttribute("data-ln-key", e), p(i, o, t);
    }
    s.appendChild(i);
  }
  h.textContent = "", h.appendChild(s);
}
function $(h, c) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      $(h, c);
    }), console.warn("[" + c + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function dt(h, c, _) {
  if (h) {
    const m = h.querySelector('[data-ln-template="' + c + '"]');
    if (m) return m.content.cloneNode(!0);
  }
  return wt(c, _);
}
function ue(h, c) {
  const _ = {}, m = h.querySelectorAll("[" + c + "]");
  for (let p = 0; p < m.length; p++)
    _[m[p].getAttribute(c)] = m[p].textContent, m[p].remove();
  return _;
}
function Dt(h, c, _, m) {
  if (h.nodeType !== 1) return;
  const f = c.indexOf("[") !== -1 || c.indexOf(".") !== -1 || c.indexOf("#") !== -1 ? c : "[" + c + "]", n = Array.from(h.querySelectorAll(f));
  h.matches && h.matches(f) && n.push(h);
  for (const s of n)
    s[_] || (s[_] = new m(s));
}
function bt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function Vt(h, c) {
  const _ = !!(c && c.typed), m = {}, p = h.elements, f = {};
  if (_)
    for (let n = 0; n < p.length; n++) {
      const s = p[n];
      s.name && s.type === "checkbox" && !s.disabled && (f[s.name] = (f[s.name] || 0) + 1);
    }
  for (let n = 0; n < p.length; n++) {
    const s = p[n];
    if (!(!s.name || s.disabled || s.type === "file" || s.type === "submit" || s.type === "button"))
      if (s.type === "checkbox")
        _ && f[s.name] === 1 ? m[s.name] = s.checked : (m[s.name] || (m[s.name] = []), s.checked && m[s.name].push(s.value));
      else if (s.type === "radio")
        s.checked && (m[s.name] = s.value);
      else if (s.type === "select-multiple") {
        m[s.name] = [];
        for (let t = 0; t < s.options.length; t++)
          s.options[t].selected && m[s.name].push(s.options[t].value);
      } else if (_ && s.type === "hidden")
        m[s.name] = s.value;
      else if (_ && (s.type === "number" || s.type === "range")) {
        const t = Number(s.value);
        m[s.name] = s.value === "" || isNaN(t) ? null : t;
      } else
        m[s.name] = s.value;
  }
  return m;
}
function he(h) {
  if (typeof h != "string") return !!h;
  const c = h.trim().toLowerCase();
  return c !== "false" && c !== "0" && c !== "" && c !== "off" && c !== "no";
}
function Wt(h, c) {
  const _ = h.elements, m = [], p = {};
  for (let f = 0; f < _.length; f++) {
    const n = _[f];
    n.name && n.type === "checkbox" && (p[n.name] = (p[n.name] || 0) + 1);
  }
  for (let f = 0; f < _.length; f++) {
    const n = _[f];
    if (n.type === "file" || n.type === "submit" || n.type === "button") continue;
    const s = n.getAttribute("data-ln-fill-as") || n.name;
    if (!s || !(s in c)) continue;
    const t = c[s];
    if (n.type === "checkbox") {
      if (Array.isArray(t))
        n.checked = t.indexOf(n.value) !== -1;
      else if (p[n.name] > 1) {
        const o = String(t).split(",").map(function(e) {
          return e.trim();
        });
        n.checked = o.indexOf(n.value) !== -1;
      } else
        n.checked = he(t);
      m.push(n);
    } else if (n.type === "radio")
      n.checked = n.value === String(t), m.push(n);
    else if (n.type === "select-multiple") {
      if (Array.isArray(t))
        for (let o = 0; o < n.options.length; o++)
          n.options[o].selected = t.indexOf(n.options[o].value) !== -1;
      m.push(n);
    } else
      n.value = t, m.push(n);
  }
  return m;
}
function K(h) {
  const c = h ? h.closest("[lang]") : null;
  return (c ? c.lang : null) || (document.documentElement ? document.documentElement.lang : null) || navigator.language;
}
function Ht(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function Gt(h, c, { get: _, set: m }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return _ ? _.call(this) : c.get.call(this);
    },
    set: function(p) {
      m ? m.call(this, p, (f) => c.set.call(this, f)) : c.set.call(this, p);
    },
    configurable: !0
  });
}
function B(h, c, _, m, p = {}) {
  const f = p.extraAttributes || [], n = p.onAttributeChange || null, s = p.onInit || null;
  function t(o) {
    const e = o || document.body;
    Dt(e, h, c, _), s && s(e);
  }
  return $(function() {
    const o = new MutationObserver(function(i) {
      for (let u = 0; u < i.length; u++) {
        const a = i[u];
        if (a.type === "childList") {
          for (let r = 0; r < a.addedNodes.length; r++) {
            const d = a.addedNodes[r];
            d.nodeType === 1 && (Dt(d, h, c, _), s && s(d));
          }
          for (let r = 0; r < a.removedNodes.length; r++) {
            const d = a.removedNodes[r];
            if (d.nodeType === 1) {
              const l = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", b = Array.from(d.querySelectorAll(l));
              d.matches && d.matches(l) && b.push(d);
              for (let v = 0; v < b.length; v++) {
                const E = b[v];
                if (!document.contains(E)) {
                  const A = E[c];
                  A && typeof A.destroy == "function" && A.destroy();
                }
              }
            }
          }
        } else a.type === "attributes" && (n && a.target[c] ? n(a.target, a.attributeName) : (Dt(a.target, h, c, _), s && s(a.target)));
      }
    });
    let e = [];
    if (h.indexOf("[") !== -1) {
      const i = /\[([\w-]+)/g;
      let u;
      for (; (u = i.exec(h)) !== null; )
        e.push(u[1]);
    } else
      e.push(h);
    o.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: e.concat(f)
    });
  }, m || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[c] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function $t(h, c) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !c) return !1;
  const _ = c.getAttribute("href");
  return !(!_ || c.getAttribute("target") === "_blank" || c.hasAttribute("download") || _.startsWith("mailto:") || _.startsWith("tel:") || _ === "#" || _.startsWith("#") || c.hostname && c.hostname !== window.location.hostname);
}
function V(...h) {
  return h.filter((c) => c != null && c !== "").map((c, _) => _ === 0 ? c.replace(/\/+$/, "") : c.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function W(h, c) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, c ? { Authorization: c } : null);
}
function Yt(h, c = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (_) {
    return console.error(`[${c}] Invalid headers JSON:`, _), {};
  }
}
const Xt = {};
function fe(h, c) {
  Xt[h] = c;
}
function pe(h) {
  return Xt[h] || { ingress: (c) => c, egress: (c) => c };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = fe, window.lnCore.getDataMapper = pe, window.lnCore.fillTemplate = yt, window.lnCore.fill = X, window.lnCore.lnFill = ce, window.lnCore.renderList = de);
function me(h, c) {
  let _ = !1;
  return function() {
    _ || (_ = !0, queueMicrotask(function() {
      _ = !1, h(), c && c();
    }));
  };
}
const ge = "ln:";
function _e() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Jt(h, c) {
  const _ = c.getAttribute("data-ln-persist"), m = _ !== null && _ !== "" ? _ : c.id;
  return m ? ge + h + ":" + _e() + ":" + m : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', c), null);
}
function Ct(h, c) {
  const _ = Jt(h, c);
  if (!_) return null;
  try {
    const m = localStorage.getItem(_);
    return m !== null ? JSON.parse(m) : null;
  } catch {
    return null;
  }
}
function lt(h, c, _) {
  const m = Jt(h, c);
  if (m)
    try {
      localStorage.setItem(m, JSON.stringify(_));
    } catch {
    }
}
function Qt(h) {
  return (h || "").replace(/^#/, "");
}
function Tt(h) {
  const c = h === void 0 ? location.hash : h, _ = {}, m = Qt(c);
  if (!m) return _;
  const p = m.split("&");
  for (let f = 0; f < p.length; f++) {
    const n = p[f];
    if (!n) continue;
    const s = n.indexOf(":"), t = s > -1 ? n.slice(0, s) : n, o = s > -1 ? n.slice(s + 1) : "";
    if (t)
      try {
        _[t] = decodeURIComponent(o);
      } catch {
        _[t] = o;
      }
  }
  return _;
}
function at(h) {
  if (!h) return null;
  const c = Tt();
  return h in c ? c[h] : null;
}
function ct(h, c) {
  if (!h) return;
  const _ = Tt();
  c == null ? delete _[h] : _[h] = String(c);
  const p = Object.keys(_).map(function(f) {
    const n = _[f];
    return n === "" ? f : f + ":" + encodeURIComponent(n);
  }).join("&");
  Qt(location.hash) !== p && (location.hash = p);
}
function Nt(h) {
  return h.button === 1 || h.ctrlKey || h.metaKey || h.shiftKey ? !1 : (h.preventDefault(), !0);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Tt, window.lnCore.hashGet = at, window.lnCore.hashSet = ct, window.lnCore.hashLinkClick = Nt);
function St(h, c, _, m) {
  const p = typeof m == "number" ? m : 4, f = window.innerWidth, n = window.innerHeight, s = c.width, t = c.height, o = (_ || "bottom").split("-"), e = o[0], i = o[1] === "start" || o[1] === "end" ? o[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, a = u[e] || u.bottom;
  function r(v) {
    return v === "top" || v === "bottom" ? i === "start" ? h.left : i === "end" ? h.right - s : h.left + (h.width - s) / 2 : i === "start" ? h.top : i === "end" ? h.bottom - t : h.top + (h.height - t) / 2;
  }
  function d(v) {
    let E, A, w = !0;
    return v === "top" ? (E = h.top - p - t, A = r(v), E < 0 && (w = !1)) : v === "bottom" ? (E = h.bottom + p, A = r(v), E + t > n && (w = !1)) : v === "left" ? (E = r(v), A = h.left - p - s, A < 0 && (w = !1)) : (E = r(v), A = h.right + p, A + s > f && (w = !1)), { top: E, left: A, side: v, fits: w };
  }
  let g = null;
  for (let v = 0; v < a.length; v++) {
    const E = d(a[v]);
    if (E.fits) {
      g = E;
      break;
    }
  }
  g || (g = d(a[0]));
  let l = g.top, b = g.left;
  return s >= f ? b = 0 : (b < 0 && (b = 0), b + s > f && (b = f - s)), t >= n ? l = 0 : (l < 0 && (l = 0), l + t > n && (l = n - t)), { top: l, left: b, placement: g.side };
}
function Zt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const c = h.parentNode, _ = document.createComment("ln-teleport");
  return c.insertBefore(_, h), document.body.appendChild(h), function() {
    _.parentNode && (_.parentNode.insertBefore(h, _), _.parentNode.removeChild(_));
  };
}
function Ot(h) {
  if (!h) return { width: 0, height: 0 };
  const c = h.style, _ = c.visibility, m = c.display, p = c.position;
  c.visibility = "hidden", c.display = "block", c.position = "fixed";
  const f = h.offsetWidth, n = h.offsetHeight;
  return c.visibility = _, c.display = m, c.position = p, { width: f, height: n };
}
let rt = null;
async function Pt(h) {
  if (!h) {
    rt = null;
    return;
  }
  try {
    const c = new TextEncoder(), _ = await crypto.subtle.digest("SHA-256", c.encode(h));
    rt = await crypto.subtle.importKey(
      "raw",
      _,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (c) {
    console.error("[ln-core/crypto] Key derivation failed:", c), rt = null;
  }
}
function _t() {
  return rt;
}
async function be(h, c = rt) {
  const _ = c || rt;
  if (!_ || h === void 0 || h === null) return h;
  try {
    const m = new TextEncoder(), p = crypto.getRandomValues(new Uint8Array(12)), f = typeof h == "string" ? h : JSON.stringify(h), n = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      _,
      m.encode(f)
    ), s = btoa(String.fromCharCode(...p)), t = btoa(String.fromCharCode(...new Uint8Array(n)));
    return {
      encrypted: !0,
      iv: s,
      data: t
    };
  } catch (m) {
    return console.error("[ln-core/crypto] Encryption failed:", m), h;
  }
}
async function ve(h, c = rt) {
  const _ = c || rt;
  if (!h || !h.encrypted || !_) return h;
  try {
    const m = new TextDecoder(), p = Uint8Array.from(atob(h.iv), (t) => t.charCodeAt(0)), f = Uint8Array.from(atob(h.data), (t) => t.charCodeAt(0)), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: p },
      _,
      f
    ), s = m.decode(n);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (m) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", m), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), c = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
  function m(o) {
    return typeof o == "string" ? o : o instanceof URL ? o.href : o instanceof Request ? o.url : String(o);
  }
  function p(o, e) {
    return e && e.method ? String(e.method).toUpperCase() : o instanceof Request ? o.method.toUpperCase() : "GET";
  }
  function f(o, e) {
    return e + " " + o;
  }
  function n(o) {
    return o === "GET" || o === "HEAD";
  }
  function s(o, e) {
    e = e || {};
    const i = m(o), u = p(o, e), a = f(i, u);
    n(u) && c.has(a) && (c.get(a).abort(), c.delete(a));
    const r = new AbortController(), d = e.signal;
    d && (d.aborted ? r.abort(d.reason) : d.addEventListener("abort", function() {
      r.abort(d.reason);
    }, { once: !0 }));
    const g = Object.assign({}, e, { signal: r.signal });
    return c.set(a, r), h(o, g).finally(function() {
      c.get(a) === r && c.delete(a);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function t(o) {
    const e = o.detail || {};
    if (!e.url) return;
    const i = o.target, u = (e.method || (e.body ? "POST" : "GET")).toUpperCase(), a = e.key;
    a && _.has(a) && (_.get(a).abort(), _.delete(a));
    const r = new AbortController(), d = e.signal;
    d && (d.aborted ? r.abort(d.reason) : d.addEventListener("abort", function() {
      r.abort(d.reason);
    }, { once: !0 })), a && _.set(a, r);
    const g = { method: u, signal: r.signal };
    e.body !== void 0 && (g.body = e.body), window.fetch(e.url, g).then(function(l) {
      a && _.get(a) === r && _.delete(a), S(i, "ln-http:response", {
        ok: l.ok,
        status: l.status,
        response: l
      });
    }).catch(function(l) {
      a && _.get(a) === r && _.delete(a), !(l && l.name === "AbortError") && S(i, "ln-http:error", {
        ok: !1,
        status: 0,
        error: l
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(o) {
      let e = !1;
      return c.forEach(function(i, u) {
        u.endsWith(" " + o) && (i.abort(), c.delete(u), e = !0);
      }), e;
    },
    cancelByKey: function(o) {
      return _.has(o) ? (_.get(o).abort(), _.delete(o), !0) : !1;
    },
    cancelAll: function() {
      c.forEach(function(o) {
        o.abort();
      }), c.clear(), _.forEach(function(o) {
        o.abort();
      }), _.clear();
    },
    get inflight() {
      const o = [];
      return c.forEach(function(e, i) {
        const u = i.indexOf(" ");
        o.push({ method: i.slice(0, u), url: i.slice(u + 1) });
      }), _.forEach(function(e, i) {
        o.push({ key: i });
      }), o;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", t), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0) return;
  function _(e) {
    if (!e.hasAttribute(h) || e[c]) return;
    e[c] = !0;
    const i = s(e);
    m(i.links), p(i.forms);
  }
  function m(e) {
    for (const i of e) {
      if (i[c + "Trigger"] || i.hostname && i.hostname !== window.location.hostname) continue;
      const u = i.getAttribute("href");
      if (u && u.includes("#")) continue;
      const a = function(r) {
        if (!$t(r, i)) return;
        r.preventDefault();
        const d = i.getAttribute("href");
        d && n("GET", d, null, i);
      };
      i.addEventListener("click", a), i[c + "Trigger"] = a;
    }
  }
  function p(e) {
    for (const i of e) {
      if (i[c + "Trigger"]) continue;
      const u = function(a) {
        a.preventDefault();
        const r = i.method.toUpperCase(), d = i.action, g = new FormData(i);
        for (const l of i.querySelectorAll('button, input[type="submit"]'))
          l.disabled = !0;
        n(r, d, g, i, function() {
          for (const l of i.querySelectorAll('button, input[type="submit"]'))
            l.disabled = !1;
        });
      };
      i.addEventListener("submit", u), i[c + "Trigger"] = u;
    }
  }
  function f(e) {
    if (!e[c]) return;
    const i = s(e);
    for (const u of i.links)
      u[c + "Trigger"] && (u.removeEventListener("click", u[c + "Trigger"]), delete u[c + "Trigger"]);
    for (const u of i.forms)
      u[c + "Trigger"] && (u.removeEventListener("submit", u[c + "Trigger"]), delete u[c + "Trigger"]);
    delete e[c];
  }
  function n(e, i, u, a, r) {
    if (z(a, "ln-ajax:before-start", { method: e, url: i }).defaultPrevented) return;
    S(a, "ln-ajax:start", { method: e, url: i }), a.classList.add("ln-ajax--loading");
    const g = document.createElement("span");
    g.className = "ln-ajax-spinner", a.appendChild(g);
    function l() {
      a.classList.remove("ln-ajax--loading");
      const w = a.querySelector(".ln-ajax-spinner");
      w && w.remove(), r && r();
    }
    let b = i;
    const v = document.querySelector('meta[name="csrf-token"]'), E = v ? v.getAttribute("content") : null;
    u instanceof FormData && E && u.append("_token", E);
    const A = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (A.headers["X-CSRF-TOKEN"] = E), e === "GET" && u) {
      const w = new URLSearchParams(u);
      b = i + (i.includes("?") ? "&" : "?") + w.toString();
    } else e !== "GET" && u && (A.body = u);
    fetch(b, A).then(function(w) {
      const C = w.ok;
      return w.json().then(function(x) {
        return { ok: C, status: w.status, data: x };
      });
    }).then(function(w) {
      const C = w.data;
      if (w.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const x in C.content) {
            const R = document.getElementById(x);
            R && (R.innerHTML = C.content[x]);
          }
        if (a.tagName === "A") {
          const x = a.getAttribute("href");
          x && window.history.pushState({ ajax: !0 }, "", x);
        } else a.tagName === "FORM" && a.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", b);
        S(a, "ln-ajax:success", { method: e, url: b, data: C });
      } else
        S(a, "ln-ajax:error", { method: e, url: b, status: w.status, data: C });
      if (C.message) {
        const x = C.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: x.type || (w.ok ? "success" : "error"),
            title: x.title || "",
            message: x.body || ""
          }
        }));
      }
      S(a, "ln-ajax:complete", { method: e, url: b }), l();
    }).catch(function(w) {
      S(a, "ln-ajax:error", { method: e, url: b, error: w }), S(a, "ln-ajax:complete", { method: e, url: b }), l();
    });
  }
  function s(e) {
    const i = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? i.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? i.forms.push(e) : (i.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), i.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), i;
  }
  function t() {
    $(function() {
      new MutationObserver(function(i) {
        for (const u of i)
          if (u.type === "childList") {
            for (const a of u.addedNodes)
              if (a.nodeType === 1 && (_(a), !a.hasAttribute(h))) {
                for (const d of a.querySelectorAll("[" + h + "]"))
                  _(d);
                const r = a.closest && a.closest("[" + h + "]");
                if (r && r.getAttribute(h) !== "false") {
                  const d = s(a);
                  m(d.links), p(d.forms);
                }
              }
          } else u.type === "attributes" && _(u.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function o() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      _(e);
  }
  window[c] = _, window[c].destroy = f, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
const te = {
  navigate: function(h) {
    vt(h, { historyAction: "push" });
  },
  replace: function(h) {
    vt(h, { historyAction: "replace" });
  },
  current: function() {
    return It ? {
      path: Rt,
      params: ie,
      query: oe,
      route: It,
      regions: ne
    } : null;
  }
}, Ft = "data-ln-route", ee = "lnRoute";
typeof window < "u" && (window.lnRouter = te);
const et = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new WeakMap();
let ne = /* @__PURE__ */ new Map(), jt = !1, Rt = null, ie = {}, oe = {}, It = null, qt = !1;
function zt(h, c, _) {
  qt ? queueMicrotask(function() {
    S(h, c, _);
  }) : S(h, c, _);
}
function Lt(h) {
  try {
    const f = new URL(h, window.location.origin);
    h = f.pathname + f.search + f.hash;
  } catch {
  }
  let [c] = h.split("#"), [_, m] = c.split("?");
  const p = {};
  if (m) {
    const f = new URLSearchParams(m);
    for (const [n, s] of f.entries())
      p[n] = s;
  }
  return _ = _.replace(/\/+$/, ""), _ === "" && (_ = "/"), { path: _, query: p };
}
function re(h, c) {
  if (h.pattern === "*") return 1;
  if (c.pattern === "*") return -1;
  const _ = h.segments, m = c.segments, p = Math.max(_.length, m.length);
  for (let f = 0; f < p; f++) {
    const n = _[f], s = m[f];
    if (n === void 0) return 1;
    if (s === void 0) return -1;
    if (n === "*") return 1;
    if (s === "*") return -1;
    const t = n.startsWith(":"), o = s.startsWith(":");
    if (t && !o) return 1;
    if (!t && o) return -1;
  }
  return 0;
}
function se(h, c) {
  const _ = h.split("/").filter(Boolean);
  for (const m of c) {
    if (m.pattern === "*")
      return {
        route: m,
        params: { wildcard: h }
      };
    const p = m.segments, f = {};
    let n = !0;
    if (!(_.length > p.length && p[p.length - 1] !== "*")) {
      for (let s = 0; s < p.length; s++) {
        const t = p[s], o = _[s];
        if (t === "*") {
          f.wildcard = _.slice(s).join("/");
          break;
        }
        if (o === void 0) {
          n = !1;
          break;
        }
        if (t.startsWith(":"))
          f[t.slice(1)] = decodeURIComponent(o);
        else if (t !== o) {
          n = !1;
          break;
        }
      }
      if (n && (p.indexOf("*") !== -1 || _.length <= p.length))
        return { route: m, params: f };
    }
  }
  return null;
}
function Mt(h, c) {
  if (h !== "__primary__") {
    const m = document.getElementById(c.target);
    return m || console.warn(`[ln-router] Explicit target element #${c.target} not found in DOM`), m;
  }
  const _ = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return _ || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), _;
}
function ye(h) {
  if (!h) return;
  const c = Array.from(h.querySelectorAll("*")), _ = [h].concat(c);
  for (const p of _)
    for (const f of Object.keys(p))
      if (f.startsWith("ln") && p[f] && typeof p[f].destroy == "function")
        try {
          p[f].destroy();
        } catch (n) {
          console.error(`[ln-router] Error destroying component ${f} on element:`, p, n);
        }
  const m = document.querySelectorAll('[data-ln-popover="open"]');
  for (const p of m) {
    const f = p.lnPopover;
    if (f && f.trigger && h.contains(f.trigger))
      try {
        f.destroy();
      } catch (n) {
        console.error("[ln-router] Error destroying open teleported popover:", n);
      }
  }
}
function vt(h, c = {}) {
  const { path: _, query: m } = Lt(h), p = /* @__PURE__ */ new Map();
  for (const [e, i] of et)
    p.set(e, se(_, i.sorted));
  const f = et.has("__primary__"), n = p.get("__primary__");
  if (f && !n) {
    zt(document.body, "ln-router:not-found", { path: _ });
    return;
  }
  let s = null;
  if (n && (s = Mt("__primary__", n.route), !s || z(s, "ln-router:before-navigate", {
    from: Rt,
    to: h,
    params: n.params,
    query: m
  }).defaultPrevented))
    return;
  const t = [];
  for (const [e, i] of p) {
    if (!i) continue;
    const u = Mt(e, i.route);
    u && (e !== "__primary__" && u.hasAttribute("data-ln-route-keep") && Ut.get(u) === i.route.templateNode || t.push({ regionKey: e, match: i, targetEl: u }));
  }
  c.historyAction === "push" ? window.history.pushState(null, "", h) : c.historyAction === "replace" && window.history.replaceState(null, "", h);
  const o = function() {
    for (const { regionKey: e, match: i, targetEl: u } of t) {
      if (!(c.isHydration && u.hasAttribute("data-ln-router-hydrate") && u.children.length > 0)) {
        ye(u);
        const r = i.route.templateNode.content.cloneNode(!0);
        u.replaceChildren(r);
      }
      if (Ut.set(u, i.route.templateNode), e === "__primary__" && (i.route.title && (document.title = i.route.title), !c.isHydration)) {
        u.hasAttribute("tabindex") || u.setAttribute("tabindex", "-1");
        const r = u.querySelector("h1, h2, h3, h4, h5, h6");
        r ? (r.setAttribute("tabindex", "-1"), r.focus()) : u.focus(), u.scrollIntoView({ block: "start", behavior: "instant" });
      }
      zt(u, "ln-router:navigated", {
        path: h,
        params: i.params,
        query: m,
        route: i.route,
        target: u,
        region: e
      });
    }
    n && (Rt = h, ie = n.params, oe = m, It = n.route), ne = new Map(
      Array.from(p.entries()).map(([e, i]) => [e, i ? { route: i.route, params: i.params } : null])
    );
  };
  document.startViewTransition && !c.isHydration ? document.startViewTransition(o) : o();
}
function Ee(h) {
  const c = h.target.closest("a");
  if (!c || !$t(h, c)) return;
  const _ = c.getAttribute("href"), { path: m } = Lt(_), p = et.get("__primary__");
  if (!p) return;
  se(m, p.sorted) && (h.preventDefault(), vt(_, { historyAction: "push" }));
}
function Ae(h, c) {
  const _ = Object.keys(h), m = Object.keys(c);
  if (_.length !== m.length) return !1;
  for (let p = 0; p < _.length; p++) {
    const f = _[p];
    if (h[f] !== c[f]) return !1;
  }
  return !0;
}
function we() {
  const h = window.location.pathname + window.location.search, c = te.current();
  if (c && c.path != null) {
    const _ = Lt(h);
    if (Lt(c.path).path === _.path && Ae(c.query, _.query))
      return;
  }
  vt(h, { historyAction: "skip" });
}
function Se() {
  jt || (jt = !0, $(function() {
    document.addEventListener("click", Ee), window.addEventListener("popstate", we), qt = !0;
    const h = window.location.pathname + window.location.search + window.location.hash;
    vt(h, { historyAction: "replace", isHydration: !0 }), qt = !1;
  }, "ln-router"));
}
function Le(h) {
  const c = h.getAttribute(Ft);
  if (!c) return;
  const _ = h.getAttribute("data-ln-route-target") || null;
  if (_ === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${c}" rejected.`);
    return;
  }
  const m = _ || "__primary__";
  et.has(m) || et.set(m, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const p = et.get(m);
  if (p.routes.has(c)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${c}" in region "${m}"`);
    return;
  }
  const f = h.getAttribute("data-ln-route-title"), n = c.split("/").filter(Boolean), s = {
    pattern: c,
    segments: n,
    target: _,
    title: f,
    templateNode: h
  }, t = Mt(m, s);
  t && t.contains(h) && console.warn(`[ln-router] Route template with pattern "${c}" is declared inside its own outlet element:`, h), p.routes.set(c, s), p.sorted = Array.from(p.routes.values()).sort(re);
}
function Ce(h) {
  const c = h.getAttribute(Ft);
  if (!c) return;
  const m = h.getAttribute("data-ln-route-target") || null || "__primary__", p = et.get(m);
  p && (p.routes.delete(c), p.sorted = Array.from(p.routes.values()).sort(re), p.routes.size === 0 && et.delete(m));
}
function ae(h) {
  return this.dom = h, Le(h), this;
}
ae.prototype.destroy = function() {
  Ce(this.dom), delete this.dom[ee];
};
B(Ft, ee, ae, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    et.size > 0 && Se();
  }
});
(function() {
  const h = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0) return;
  function _(p) {
    this.dom = p, this.isOpen = p.getAttribute(h) === "open";
    const f = this;
    return this._hashNs = p.id || null, this._onHashChange = function() {
      if (!f._hashNs) return;
      const n = at(f._hashNs) !== null;
      n && !f.isOpen ? f.dom.setAttribute(h, "open") : !n && f.isOpen && f.dom.setAttribute(h, "close");
    }, this._onEscape = function(n) {
      n.key === "Escape" && f.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(n) {
      if (n.key !== "Tab") return;
      const s = Array.prototype.filter.call(
        f.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        bt
      );
      if (s.length === 0) return;
      const t = s[0], o = s[s.length - 1];
      n.shiftKey ? document.activeElement === t && (n.preventDefault(), o.focus()) : document.activeElement === o && (n.preventDefault(), t.focus());
    }, this._onAjaxSuccess = function() {
      f.isOpen && f.dom.setAttribute(h, "close");
    }, this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this._hashNs && (window.addEventListener("hashchange", this._onHashChange), at(this._hashNs) !== null && !this.isOpen && this.dom.setAttribute(h, "open")), this.dom.addEventListener("ln-ajax:success", this._onAjaxSuccess), this;
  }
  _.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.dom.removeEventListener("ln-ajax:success", this._onAjaxSuccess), this.isOpen) {
        this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null;
        const p = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + h + '="open"]'),
          function(n) {
            return n !== p;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      this._hashNs && window.removeEventListener("hashchange", this._onHashChange), S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[c];
    }
  };
  function m(p) {
    const f = p[c];
    if (!f) return;
    const s = p.getAttribute(h) === "open";
    if (s !== f.isOpen)
      if (s) {
        if (z(p, "ln-modal:before-open", { modalId: p.id, target: p }).defaultPrevented) {
          f._hashNs && ct(f._hashNs, null), p.setAttribute(h, "close");
          return;
        }
        f.isOpen = !0, p.setAttribute("aria-modal", "true"), p.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", f._onEscape), document.addEventListener("keydown", f._onFocusTrap);
        const o = document.activeElement;
        f._returnFocusEl = o && o !== document.body ? o : null;
        const e = p.querySelector("[autofocus]");
        if (e && bt(e))
          e.focus();
        else {
          const i = p.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(i, bt);
          if (u) u.focus();
          else {
            const a = p.querySelectorAll("a[href], button:not([disabled])"), r = Array.prototype.find.call(a, bt);
            r && r.focus();
          }
        }
        if (f._hashNs) {
          at(f._hashNs) === null && ct(f._hashNs, "");
          const i = at(f._hashNs), u = i || null;
          p.dataset.lnModalMode = u ? "edit" : "new", S(p, "ln-modal:open", { modalId: p.id, target: p, hashNs: f._hashNs, param: u });
        } else
          S(p, "ln-modal:open", { modalId: p.id, target: p });
      } else {
        if (z(p, "ln-modal:before-close", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(h, "open");
          return;
        }
        f.isOpen = !1, p.removeAttribute("aria-modal"), document.removeEventListener("keydown", f._onEscape), document.removeEventListener("keydown", f._onFocusTrap), S(p, "ln-modal:close", { modalId: p.id, target: p }), f._hashNs && ct(f._hashNs, null), f._returnFocusEl && document.contains(f._returnFocusEl) && typeof f._returnFocusEl.focus == "function" && f._returnFocusEl.focus(), f._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const f = p.target.closest("[data-ln-modal-for]");
    if (f) {
      const t = f.getAttribute("data-ln-modal-for"), o = document.getElementById(t);
      if (o && o[c]) {
        p.preventDefault();
        const e = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, i = {}, u = f.dataset;
        for (const d in u) {
          if (!d.startsWith("lnModal") || e[d]) continue;
          const g = d.slice(7);
          g && (i[g.charAt(0).toLowerCase() + g.slice(1)] = u[d]);
        }
        const a = Object.keys(i).length > 0;
        if (a)
          window.lnCore.fill(o, i);
        else {
          const d = o.querySelectorAll("[data-ln-field]");
          for (let g = 0; g < d.length; g++)
            d[g].textContent = "";
        }
        f.hasAttribute("data-ln-modal-mode") ? o.dataset.lnModalMode = f.getAttribute("data-ln-modal-mode") : o.dataset.lnModalMode = a ? "edit" : "new";
        const r = o.getAttribute(h);
        o.setAttribute(h, r === "open" ? "close" : "open");
      }
      return;
    }
    const n = p.target.closest('a[href^="#"]');
    if (n) {
      const t = Tt(n.getAttribute("href"));
      for (const o in t) {
        const e = document.getElementById(o);
        if (e && e[c]) {
          if (!Nt(p)) return;
          ct(o, t[o]);
          return;
        }
      }
    }
    const s = p.target.closest("[data-ln-modal-close]");
    if (s) {
      const t = s.closest("[" + h + "]");
      t && t[c] && (p.preventDefault(), t.setAttribute(h, "close"));
    }
  }), B(h, c, _, "ln-modal", {
    onAttributeChange: m
  });
})();
(function() {
  const h = "data-ln-number", c = "lnNumber";
  if (window[c] !== void 0) return;
  const _ = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(t) {
    if (!_[t]) {
      const o = new Intl.NumberFormat(t, { useGrouping: !0 }), e = o.formatToParts(1234.5);
      let i = "", u = ".";
      for (let a = 0; a < e.length; a++)
        e[a].type === "group" && (i = e[a].value), e[a].type === "decimal" && (u = e[a].value);
      _[t] = { fmt: o, groupSep: i, decimalSep: u };
    }
    return _[t];
  }
  function f(t, o, e) {
    if (e !== null) {
      const i = parseInt(e, 10), u = t + "|d" + i;
      return _[u] || (_[u] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: i })), _[u].format(o);
    }
    return p(t).fmt.format(o);
  }
  function n(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[c]) return t[c];
    t[c] = this, this.dom = t;
    const o = document.createElement("input");
    o.type = "hidden", o.name = t.name, t.removeAttribute("name"), t.hasAttribute("data-ln-fill-as") && o.setAttribute("data-ln-fill-as", t.getAttribute("data-ln-fill-as")), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", o), this._hidden = o;
    const e = this;
    Object.defineProperty(o, "value", {
      get: function() {
        return m.get.call(o);
      },
      set: function(u) {
        m.set.call(o, u), u !== "" && !isNaN(parseFloat(u)) ? e._setDisplayRaw(f(K(e.dom), parseFloat(u), e.dom.getAttribute("data-ln-number-decimals"))) : e._setDisplayRaw(""), e.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Gt(t, m, {
      get: function() {
        return m.get.call(t);
      },
      set: function(u) {
        if (u === "") {
          e._setDisplayRaw(""), e._setHiddenRaw(""), t.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const a = typeof u == "number" ? u : parseFloat(String(u).replace(/[^\d.-]/g, ""));
        isNaN(a) ? (e._setDisplayRaw(String(u)), e._setHiddenRaw("")) : (e._setHiddenRaw(a), e._setDisplayRaw(f(K(t), a, t.getAttribute("data-ln-number-decimals")))), t.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(u) {
      u.preventDefault();
      const a = (u.clipboardData || window.clipboardData).getData("text"), r = p(K(t)), d = r.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let g = a.replace(new RegExp("[^0-9\\-" + d + ".]", "g"), "");
      r.groupSep && (g = g.split(r.groupSep).join("")), r.decimalSep !== "." && (g = g.replace(r.decimalSep, "."));
      const l = parseFloat(g);
      e.value = isNaN(l) ? NaN : l;
    }, t.addEventListener("paste", this._onPaste);
    const i = t.value;
    if (i !== "") {
      const u = parseFloat(i);
      isNaN(u) || (this._setHiddenRaw(u), this._setDisplayRaw(f(K(t), u, t.getAttribute("data-ln-number-decimals"))), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  n.prototype._handleInput = function() {
    const t = this.dom, o = p(K(t)), e = m.get.call(t);
    if (e === "") {
      this._setHiddenRaw(""), S(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._setHiddenRaw("");
      return;
    }
    const i = t.selectionStart;
    let u = 0;
    for (let w = 0; w < i; w++)
      /[0-9]/.test(e[w]) && u++;
    let a = e;
    if (o.groupSep && (a = a.split(o.groupSep).join("")), a = a.replace(o.decimalSep, "."), e.endsWith(o.decimalSep) || e.endsWith(".")) {
      const w = a.replace(/\.$/, ""), C = parseFloat(w);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const r = a.indexOf(".");
    if (r !== -1 && a.slice(r + 1).endsWith("0")) {
      const C = parseFloat(a);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const d = t.getAttribute("data-ln-number-decimals");
    if (d !== null && r !== -1) {
      const w = parseInt(d, 10);
      a.slice(r + 1).length > w && (a = a.slice(0, r + 1 + w));
    }
    const g = parseFloat(a);
    if (isNaN(g)) return;
    const l = t.getAttribute("data-ln-number-min"), b = t.getAttribute("data-ln-number-max");
    if (l !== null && g < parseFloat(l) || b !== null && g > parseFloat(b)) return;
    let v;
    if (d !== null)
      v = f(K(t), g, d);
    else {
      const w = r !== -1 ? a.slice(r + 1).length : 0;
      if (w > 0) {
        const C = K(t) + "|u" + w;
        _[C] || (_[C] = new Intl.NumberFormat(K(t), { useGrouping: !0, minimumFractionDigits: w, maximumFractionDigits: w })), v = _[C].format(g);
      } else
        v = o.fmt.format(g);
    }
    this._setDisplayRaw(v);
    let E = u, A = 0;
    for (let w = 0; w < v.length && E > 0; w++)
      A = w + 1, /[0-9]/.test(v[w]) && E--;
    E > 0 && (A = v.length), t.setSelectionRange(A, A), this._setHiddenRaw(g), S(t, "ln-number:input", { value: g, formatted: v });
  }, n.prototype._setHiddenRaw = function(t) {
    m.set.call(this._hidden, String(t));
  }, n.prototype._setDisplayRaw = function(t) {
    m.set.call(this.dom, String(t));
  }, n.prototype._displayFormatted = function(t) {
    this._setDisplayRaw(f(K(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(n.prototype, "value", {
    get: function() {
      const t = m.get.call(this._hidden);
      return t === "" ? NaN : parseFloat(t);
    },
    set: function(t) {
      if (typeof t != "number" || isNaN(t)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(t), this._setDisplayRaw(f(K(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(n.prototype, "formatted", {
    get: function() {
      return m.get.call(this.dom);
    }
  }), n.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function s() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let o = 0; o < t.length; o++) {
        const e = t[o][c];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, c, n, "ln-number"), s();
})();
(function() {
  const h = "data-ln-date", c = "lnDate";
  if (window[c] !== void 0) return;
  const _ = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(r, d) {
    const g = r + "|" + JSON.stringify(d);
    return _[g] || (_[g] = new Intl.DateTimeFormat(r, d)), _[g];
  }
  const f = /^(short|medium|long)(\s+datetime)?$/, n = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(r) {
    return !r || r === "" ? { dateStyle: "medium" } : r.match(f) ? n[r] : null;
  }
  function t(r, d, g) {
    const l = r.getDate(), b = r.getMonth(), v = r.getFullYear(), E = r.getHours(), A = r.getMinutes();
    let w, C;
    if (g.startsWith("mk") && !p(g, { month: "long" }).resolvedOptions().locale.startsWith("mk")) {
      const D = [
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
      ], F = [
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
      ];
      w = D[b], C = F[b];
    }
    w === void 0 && (w = p(g, { month: "long" }).format(r)), C === void 0 && (C = p(g, { month: "short" }).format(r));
    const x = {
      yyyy: String(v),
      yy: String(v).slice(-2),
      MMMM: w,
      MMM: C,
      MM: String(b + 1).padStart(2, "0"),
      M: String(b + 1),
      dd: String(l).padStart(2, "0"),
      d: String(l),
      HH: String(E).padStart(2, "0"),
      mm: String(A).padStart(2, "0")
    };
    return d.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(R) {
      return x[R];
    });
  }
  function o(r, d, g) {
    const l = s(d);
    if (l) {
      const b = p(g, l), v = b.resolvedOptions().locale;
      return g.startsWith("mk") && !v.startsWith("mk") ? t(r, "dd.MM.yyyy", g) : b.format(r);
    }
    return t(r, d, g);
  }
  function e(r) {
    if (r.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", r.tagName), this;
    if (r[c]) return r[c];
    r[c] = this, this.dom = r;
    const d = this, g = r.value, l = r.name, b = document.createElement("span");
    b.setAttribute("data-ln-date-field", ""), r.parentNode.insertBefore(b, r), b.appendChild(r), this._wrapper = b;
    const v = document.createElement("input");
    v.type = "hidden", v.name = l, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && v.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.insertAdjacentElement("afterend", v), this._hidden = v;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", v.insertAdjacentElement("afterend", E), this._picker = E, r.type = "text";
    const A = document.createElement("button");
    if (A.type = "button", A.setAttribute("aria-label", "Open date picker"), A.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', E.insertAdjacentElement("afterend", A), this._btn = A, this._lastISO = "", Object.defineProperty(v, "value", {
      get: function() {
        return m.get.call(v);
      },
      set: function(w) {
        if (m.set.call(v, w), w && w !== "") {
          const C = i(w);
          C && (d._displayFormatted(C), m.set.call(E, w), d._lastISO = w, S(d.dom, "ln-date:change", {
            value: w,
            formatted: d.dom.value,
            date: C
          }), d.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else w === "" && (d.dom.value = "", m.set.call(E, ""), d._lastISO = "", S(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), d.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), Gt(r, m, {
      get: function() {
        return m.get.call(r);
      },
      set: function(w, C) {
        if (d._isFormatting) {
          C(w);
          return;
        }
        if (!w || w === "") {
          C(""), d._setHiddenRaw(""), m.set.call(d._picker, ""), d._lastISO = "", S(r, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), r.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let x = i(w);
        if (x || (x = u(w)), x) {
          const R = x.getFullYear(), O = String(x.getMonth() + 1).padStart(2, "0"), D = String(x.getDate()).padStart(2, "0"), F = R + "-" + O + "-" + D;
          d._setHiddenRaw(F), m.set.call(d._picker, F), d._lastISO = F;
          const U = r.getAttribute(h) || "", Q = K(r), Z = o(x, U, Q);
          C(Z), S(r, "ln-date:change", {
            value: F,
            formatted: Z,
            date: x
          }), r.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          C(String(w)), d._setHiddenRaw(""), m.set.call(d._picker, ""), d._lastISO = "", S(r, "ln-date:change", {
            value: "",
            formatted: String(w),
            date: null
          }), r.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const w = E.value;
      if (w) {
        const C = i(w);
        C && (d._setHiddenRaw(w), d._displayFormatted(C), d._lastISO = w, S(d.dom, "ln-date:change", {
          value: w,
          formatted: d.dom.value,
          date: C
        }));
      } else
        d._setHiddenRaw(""), d.dom.value = "", d._lastISO = "", S(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const w = d.dom.value.trim();
      if (w === "") {
        d._lastISO !== "" && (d._setHiddenRaw(""), m.set.call(d._picker, ""), d.dom.value = "", d._lastISO = "", S(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (d._lastISO) {
        const x = i(d._lastISO);
        if (x) {
          const R = d.dom.getAttribute(h) || "", O = K(d.dom), D = o(x, R, O);
          if (w === D) return;
        }
      }
      const C = u(w);
      if (C) {
        const x = C.getFullYear(), R = String(C.getMonth() + 1).padStart(2, "0"), O = String(C.getDate()).padStart(2, "0"), D = x + "-" + R + "-" + O;
        d._setHiddenRaw(D), m.set.call(d._picker, D), d._displayFormatted(C), d._lastISO = D, S(d.dom, "ln-date:change", {
          value: D,
          formatted: d.dom.value,
          date: C
        });
      } else if (d._lastISO) {
        const x = i(d._lastISO);
        x && d._displayFormatted(x);
      } else
        d.dom.value = "";
    }, r.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, A.addEventListener("click", this._onBtnClick), g && g !== "") {
      const w = i(g);
      w && (this._setHiddenRaw(g), m.set.call(E, g), this._displayFormatted(w), this._lastISO = g, S(r, "ln-date:change", {
        value: g,
        formatted: r.value,
        date: w
      }), r.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function i(r) {
    if (!r || typeof r != "string") return null;
    const d = r.split("T"), g = d[0].split("-");
    if (g.length < 3) return null;
    const l = parseInt(g[0], 10), b = parseInt(g[1], 10) - 1, v = parseInt(g[2], 10);
    if (isNaN(l) || isNaN(b) || isNaN(v)) return null;
    let E = 0, A = 0;
    if (d[1]) {
      const C = d[1].split(":");
      E = parseInt(C[0], 10) || 0, A = parseInt(C[1], 10) || 0;
    }
    const w = new Date(l, b, v, E, A);
    return w.getFullYear() !== l || w.getMonth() !== b || w.getDate() !== v ? null : w;
  }
  function u(r) {
    if (!r || typeof r != "string" || (r = r.trim(), r.length < 6)) return null;
    let d, g;
    if (r.indexOf(".") !== -1)
      d = ".", g = r.split(".");
    else if (r.indexOf("/") !== -1)
      d = "/", g = r.split("/");
    else if (r.indexOf("-") !== -1)
      d = "-", g = r.split("-");
    else
      return null;
    if (g.length !== 3) return null;
    const l = [];
    for (let w = 0; w < 3; w++) {
      const C = parseInt(g[w], 10);
      if (isNaN(C)) return null;
      l.push(C);
    }
    let b, v, E;
    d === "." ? (b = l[0], v = l[1], E = l[2]) : d === "/" ? (v = l[0], b = l[1], E = l[2]) : g[0].length === 4 ? (E = l[0], v = l[1], b = l[2]) : (b = l[0], v = l[1], E = l[2]), E < 100 && (E += E < 50 ? 2e3 : 1900);
    const A = new Date(E, v - 1, b);
    return A.getFullYear() !== E || A.getMonth() !== v - 1 || A.getDate() !== b ? null : A;
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
  }, e.prototype._setHiddenRaw = function(r) {
    m.set.call(this._hidden, r);
  }, e.prototype._displayFormatted = function(r) {
    const d = this.dom.getAttribute(h) || "", g = K(this.dom);
    console.log("[ln-date] _displayFormatted:", {
      date: r,
      format: d,
      locale: g,
      dom: this.dom,
      closestLang: this.dom.closest("[lang]"),
      htmlLang: document.documentElement ? document.documentElement.lang : null,
      formatted: o(r, d, g)
    }), this._isFormatting = !0, this.dom.value = o(r, d, g), this._isFormatting = !1;
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return m.get.call(this._hidden);
    },
    set: function(r) {
      if (!r || r === "") {
        this._setHiddenRaw(""), m.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const d = i(r);
      d && (this._setHiddenRaw(r), m.set.call(this._picker, r), this._displayFormatted(d), this._lastISO = r, S(this.dom, "ln-date:change", {
        value: r,
        formatted: this.dom.value,
        date: d
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const r = this.value;
      return r ? i(r) : null;
    },
    set: function(r) {
      if (!r || !(r instanceof Date) || isNaN(r.getTime())) {
        this.value = "";
        return;
      }
      const d = r.getFullYear(), g = String(r.getMonth() + 1).padStart(2, "0"), l = String(r.getDate()).padStart(2, "0");
      this.value = d + "-" + g + "-" + l;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const r = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), r && (this.dom.value = r), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function a() {
    new MutationObserver(function() {
      const r = document.querySelectorAll("[" + h + "]");
      for (let d = 0; d < r.length; d++) {
        const g = r[d][c];
        if (g && g.value) {
          const l = i(g.value);
          l && g._displayFormatted(l);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, c, e, "ln-date"), a();
})();
(function() {
  const h = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0) return;
  const _ = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const i of m)
        i();
    }, history._lnNavPatched = !0;
  }
  function p(e) {
    if (!e.hasAttribute(h) || _.has(e)) return;
    const i = e.getAttribute(h);
    if (!i) return;
    const u = f(e, i);
    _.set(e, u), e[c] = u;
  }
  function f(e, i) {
    const u = e.hasAttribute("data-ln-nav-exact");
    let a = Array.from(e.querySelectorAll("a"));
    s(a, i, window.location.pathname, u);
    const r = function() {
      a = Array.from(e.querySelectorAll("a")), s(a, i, window.location.pathname, u);
    };
    window.addEventListener("popstate", r), m.push(r);
    const d = new MutationObserver(function(g) {
      for (const l of g)
        if (l.type === "childList") {
          for (const b of l.addedNodes)
            if (b.nodeType === 1) {
              if (b.tagName === "A")
                a.push(b), s([b], i, window.location.pathname, u);
              else if (b.querySelectorAll) {
                const v = Array.from(b.querySelectorAll("a"));
                a = a.concat(v), s(v, i, window.location.pathname, u);
              }
            }
          for (const b of l.removedNodes)
            if (b.nodeType === 1) {
              if (b.tagName === "A")
                a = a.filter(function(v) {
                  return v !== b;
                });
              else if (b.querySelectorAll) {
                const v = Array.from(b.querySelectorAll("a"));
                a = a.filter(function(E) {
                  return !v.includes(E);
                });
              }
            }
        }
    });
    return d.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: i,
      observer: d,
      updateHandler: r,
      destroy: function() {
        d.disconnect(), window.removeEventListener("popstate", r);
        const g = m.indexOf(r);
        g !== -1 && m.splice(g, 1), _.delete(e), delete e[c];
      }
    };
  }
  function n(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function s(e, i, u, a) {
    const r = n(u);
    for (const d of e) {
      const g = d.getAttribute("href");
      if (!g) continue;
      const l = n(g);
      d.classList.remove(i);
      const b = l === r, v = !a && l !== "/" && r.startsWith(l + "/");
      b || v ? (d.classList.add(i), d.setAttribute("aria-current", "page")) : d.removeAttribute("aria-current");
    }
  }
  function t() {
    $(function() {
      new MutationObserver(function(i) {
        for (const u of i)
          if (u.type === "childList") {
            for (const a of u.addedNodes)
              if (a.nodeType === 1 && (a.hasAttribute && a.hasAttribute(h) && p(a), a.querySelectorAll))
                for (const r of a.querySelectorAll("[" + h + "]"))
                  p(r);
          } else u.type === "attributes" && u.target.hasAttribute && u.target.hasAttribute(h) && p(u.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[c] = p;
  function o() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      p(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const h = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function _(f, n) {
    const s = (f.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (s) return s;
    if (f.tagName !== "A") return "";
    const t = f.getAttribute("href") || "";
    if (!t.startsWith("#")) return "";
    const o = t.slice(1);
    if (!o) return "";
    const e = o.split("&");
    if (n)
      for (const a of e) {
        const r = a.indexOf(":");
        if (r > 0 && a.slice(0, r).toLowerCase().trim() === n)
          return a.slice(r + 1).toLowerCase().trim();
      }
    const i = e[e.length - 1] || "", u = i.indexOf(":");
    return (u > 0 ? i.slice(u + 1) : i).toLowerCase().trim();
  }
  function m(f) {
    return this.dom = f, p.call(this), this;
  }
  function p() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const f = this.tabs.filter((t) => t.tagName === "A" && (t.getAttribute("href") || "").startsWith("#")), n = f.length > 0 && f.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = n && !!this.nsKey, f.length > 0 && f.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const t of this.tabs) {
      const o = _(t, this.nsKey);
      o ? this.mapTabs[o] = t : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', t);
    }
    for (const t of this.panels) {
      const o = (t.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = t);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const s = this;
    this._clickHandlers = [];
    for (const t of this.tabs) {
      if (t[c + "Trigger"]) continue;
      const o = function(e) {
        const i = t.tagName === "A";
        if (!i && (e.ctrlKey || e.metaKey || e.button === 1)) return;
        const u = _(t, s.nsKey);
        u && (i && !Nt(e) || (s.hashEnabled ? at(s.nsKey) === u ? s.dom.setAttribute("data-ln-tabs-active", u) : ct(s.nsKey, u) : s.dom.setAttribute("data-ln-tabs-active", u)));
      };
      t.addEventListener("click", o), t[c + "Trigger"] = o, s._clickHandlers.push({ el: t, handler: o });
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
        const o = Ct("tabs", this.dom);
        o !== null && o in this.mapPanels && (t = o);
      }
      this.dom.setAttribute("data-ln-tabs-active", t);
    }
  }
  m.prototype._applyActive = function(f) {
    var n;
    (!f || !(f in this.mapPanels)) && (f = this.defaultKey);
    for (const s in this.mapTabs) {
      const t = this.mapTabs[s];
      s === f ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const s in this.mapPanels) {
      const t = this.mapPanels[s], o = s === f;
      t.classList.toggle("hidden", !o), t.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const s = (n = this.mapPanels[f]) == null ? void 0 : n.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      s && setTimeout(() => s.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: f, tab: this.mapTabs[f], panel: this.mapPanels[f] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && lt("tabs", this.dom, f);
  }, m.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const { el: f, handler: n } of this._clickHandlers)
        f.removeEventListener("click", n), delete f[c + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[c];
    }
  }, B(h, c, m, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(f) {
      const n = f.getAttribute("data-ln-tabs-active");
      f[c]._applyActive(n);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function _(f, n) {
    const s = document.querySelectorAll(
      '[data-ln-toggle-for="' + f.id + '"]'
    );
    for (const t of s)
      t.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function m(f) {
    if (this.dom = f, f.hasAttribute("data-ln-persist")) {
      const n = Ct("toggle", f);
      n !== null && f.setAttribute(h, n);
    }
    return this.isOpen = f.getAttribute(h) === "open", this.isOpen && f.classList.add("open"), _(f, this.isOpen), this;
  }
  m.prototype.destroy = function() {
    this.dom[c] && (S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function p(f) {
    const n = f[c];
    if (!n) return;
    const t = f.getAttribute(h) === "open";
    if (t !== n.isOpen)
      if (t) {
        if (z(f, "ln-toggle:before-open", { target: f }).defaultPrevented) {
          f.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, f.classList.add("open"), _(f, !0), S(f, "ln-toggle:open", { target: f }), f.hasAttribute("data-ln-persist") && lt("toggle", f, "open");
      } else {
        if (z(f, "ln-toggle:before-close", { target: f }).defaultPrevented) {
          f.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, f.classList.remove("open"), _(f, !1), S(f, "ln-toggle:close", { target: f }), f.hasAttribute("data-ln-persist") && lt("toggle", f, "close");
      }
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const n = f.target.closest("[data-ln-toggle-for]");
    if (n) {
      const s = n.getAttribute("data-ln-toggle-for"), t = document.getElementById(s);
      if (t && t[c]) {
        f.preventDefault();
        const o = n.getAttribute("data-ln-toggle-action") || "toggle";
        if (o === "open")
          t.setAttribute(h, "open");
        else if (o === "close")
          t.setAttribute(h, "close");
        else if (o === "toggle") {
          const e = t.getAttribute(h);
          t.setAttribute(h, e === "open" ? "close" : "open");
        }
      }
    }
  }), B(h, c, m, "ln-toggle", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function _(m) {
    return this.dom = m, this._onToggleOpen = function(p) {
      if (p.detail.target.closest("[data-ln-accordion]") !== m) return;
      const f = m.querySelectorAll("[data-ln-toggle]");
      for (const n of f)
        n !== p.detail.target && n.closest("[data-ln-accordion]") === m && n.getAttribute("data-ln-toggle") === "open" && n.setAttribute("data-ln-toggle", "close");
      S(m, "ln-accordion:change", { target: p.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  _.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, _, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", c = "lnDropdown";
  if (window[c] !== void 0) return;
  function _(m) {
    if (this.dom = m, this.toggleEl = m.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = m.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const f of this.toggleEl.children)
        f.setAttribute("role", "menuitem");
    const p = this;
    return this._onToggleOpen = function(f) {
      f.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "true"), p._teleportRestore = Zt(p.toggleEl), p.toggleEl.style.position = "fixed", p.toggleEl.style.right = "auto", p._reposition(), p._addOutsideClickListener(), p._addScrollRepositionListener(), p._addResizeCloseListener(), S(m, "ln-dropdown:open", { target: f.detail.target }));
    }, this._onToggleClose = function(f) {
      f.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "false"), p._removeOutsideClickListener(), p._removeScrollRepositionListener(), p._removeResizeCloseListener(), p.toggleEl.style.position = "", p.toggleEl.style.top = "", p.toggleEl.style.left = "", p.toggleEl.style.right = "", p.toggleEl.style.transform = "", p.toggleEl.style.margin = "", p._teleportRestore && (p._teleportRestore(), p._teleportRestore = null), S(m, "ln-dropdown:close", { target: f.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  _.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const m = this.triggerBtn.getBoundingClientRect(), p = Ot(this.toggleEl), f = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = St(m, p, "bottom-end", f);
    this.toggleEl.style.top = n.top + "px", this.toggleEl.style.left = n.left + "px";
  }, _.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const m = this;
    this._boundDocClick = function(p) {
      m.dom.contains(p.target) || m.toggleEl && m.toggleEl.contains(p.target) || m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, m._docClickTimeout = setTimeout(function() {
      m._docClickTimeout = null, document.addEventListener("click", m._boundDocClick);
    }, 0);
  }, _.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, _.prototype._addScrollRepositionListener = function() {
    const m = this;
    this._boundScrollReposition = function() {
      m._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, _.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, _.prototype._addResizeCloseListener = function() {
    const m = this;
    this._boundResizeClose = function() {
      m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, _.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, _.prototype.destroy = function() {
    this.dom[c] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, _, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", c = "lnPopover", _ = "data-ln-popover-for", m = "data-ln-popover-position";
  if (window[c] !== void 0) return;
  const p = [];
  let f = null;
  function n() {
    f || (f = function(e) {
      if (e.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", f));
  }
  function s() {
    p.length > 0 || f && (document.removeEventListener("keydown", f), f = null);
  }
  function t(e) {
    return this.dom = e, this.isOpen = e.getAttribute(h) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, e.hasAttribute("tabindex") || e.setAttribute("tabindex", "-1"), e.hasAttribute("role") || e.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  t.prototype.open = function(e) {
    this.isOpen || (this.trigger = e || null, this.dom.setAttribute(h, "open"));
  }, t.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, t.prototype.toggle = function(e) {
    this.isOpen ? this.close() : this.open(e);
  }, t.prototype._applyOpen = function(e) {
    this.isOpen = !0, e && (this.trigger = e), this._previousFocus = document.activeElement, this._teleportRestore = Zt(this.dom);
    const i = Ot(this.dom);
    if (this.trigger) {
      const d = this.trigger.getBoundingClientRect(), g = this.dom.getAttribute(m) || "bottom", l = St(d, i, g, 8);
      this.dom.style.top = l.top + "px", this.dom.style.left = l.left + "px", this.dom.setAttribute("data-ln-popover-placement", l.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const u = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), a = Array.prototype.find.call(u, bt);
    a ? a.focus() : this.dom.focus();
    const r = this;
    this._boundDocClick = function(d) {
      r.dom.contains(d.target) || r.trigger && r.trigger.contains(d.target) || r.close();
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!r.trigger) return;
      const d = r.trigger.getBoundingClientRect(), g = Ot(r.dom), l = r.dom.getAttribute(m) || "bottom", b = St(d, g, l, 8);
      r.dom.style.top = b.top + "px", r.dom.style.left = b.left + "px", r.dom.setAttribute("data-ln-popover-placement", b.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), n(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const e = p.indexOf(this);
    e !== -1 && p.splice(e, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[c] && (this.isOpen && this._applyClose(), delete this.dom[c], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(e) {
    this.dom = e;
    const i = e.getAttribute(_);
    return e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-controls", i), this._onClick = function(u) {
      if (u.ctrlKey || u.metaKey || u.button === 1) return;
      u.preventDefault();
      const a = document.getElementById(i);
      !a || !a[c] || a[c].toggle(e);
    }, e.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[c + "Trigger"];
  }, B(h, c, t, "ln-popover", {
    onAttributeChange: function(e) {
      const i = e[c];
      if (!i) return;
      const a = e.getAttribute(h) === "open";
      if (a !== i.isOpen)
        if (a) {
          if (z(e, "ln-popover:before-open", {
            popoverId: e.id,
            target: e,
            trigger: i.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "closed");
            return;
          }
          i._applyOpen(i.trigger);
        } else {
          if (z(e, "ln-popover:before-close", {
            popoverId: e.id,
            target: e,
            trigger: i.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "open");
            return;
          }
          i._applyClose();
        }
    }
  }), B(_, c + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", c = "data-ln-tooltip", _ = "data-ln-tooltip-position", m = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[m] !== void 0) return;
  let f = 0, n = null, s = null, t = null, o = null, e = null;
  function i() {
    return n && n.parentNode || (n = document.getElementById(p), n || (n = document.createElement("div"), n.id = p, document.body.appendChild(n))), n;
  }
  function u() {
    e || (e = function(l) {
      l.key === "Escape" && d();
    }, document.addEventListener("keydown", e));
  }
  function a() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function r(l) {
    if (t === l) return;
    d();
    const b = l.getAttribute(c) || l.getAttribute("title");
    if (!b) return;
    i(), l.hasAttribute("title") && (o = l.getAttribute("title"), l.removeAttribute("title"));
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = b, l[m + "Uid"] || (f += 1, l[m + "Uid"] = "ln-tooltip-" + f), v.id = l[m + "Uid"], n.appendChild(v);
    const E = v.offsetWidth, A = v.offsetHeight, w = l.getBoundingClientRect(), C = l.getAttribute(_) || "top", x = St(w, { width: E, height: A }, C, 6);
    v.style.top = x.top + "px", v.style.left = x.left + "px", v.setAttribute("data-ln-tooltip-placement", x.placement), l.setAttribute("aria-describedby", v.id), s = v, t = l, u();
  }
  function d() {
    if (!s) {
      a();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), o !== null && t.setAttribute("title", o)), o = null, s.parentNode && s.parentNode.removeChild(s), s = null, t = null, a();
  }
  function g(l) {
    return this.dom = l, l.hasAttribute("data-ln-tooltip-enhanced") || (l.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(l);
    }, this._onLeave = function() {
      t === l && d();
    }, this._onFocus = function() {
      r(l);
    }, this._onBlur = function() {
      t === l && d();
    }, l.addEventListener("mouseenter", this._onEnter), l.addEventListener("mouseleave", this._onLeave), l.addEventListener("focus", this._onFocus, !0), l.addEventListener("blur", this._onBlur, !0), this;
  }
  g.prototype.destroy = function() {
    const l = this.dom;
    l.removeEventListener("mouseenter", this._onEnter), l.removeEventListener("mouseleave", this._onLeave), l.removeEventListener("focus", this._onFocus, !0), l.removeEventListener("blur", this._onBlur, !0), t === l && d(), this._addedEnhancedAttr && l.removeAttribute("data-ln-tooltip-enhanced"), delete l[m], delete l[m + "Uid"], S(l, "ln-tooltip:destroyed", { trigger: l });
  }, B(
    "[" + h + "], [" + c + "][title]",
    m,
    g,
    "ln-tooltip"
  );
})();
const Te = `<li class="ln-toast__item">\r
	<div class="ln-toast__card" data-ln-attr="role:role, aria-live:ariaLive">\r
		<div class="ln-toast__side">\r
			<svg class="ln-icon" aria-hidden="true"><use href=""></use></svg>\r
		</div>\r
		<div class="ln-toast__content">\r
			<div class="ln-toast__head">\r
				<strong class="ln-toast__title" data-ln-field="title"></strong>\r
			</div>\r
			<button type="button" class="ln-toast__close" aria-label="Close"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button>\r
			<div class="ln-toast__body" data-ln-show="hasBody"></div>\r
		</div>\r
	</div>\r
</li>\r
`;
(function() {
  const h = "data-ln-toast", c = "lnToast", _ = "ln-toast-item", m = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, p = { success: "success", error: "error", warn: "warning", info: "info" }, f = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function n() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const l = document.createElement("template");
    l.setAttribute("data-ln-template", "ln-toast-item"), l.innerHTML = Te, document.body.appendChild(l);
  }
  function s(l) {
    if (!l || l.nodeType !== 1) return;
    const b = Array.from(l.querySelectorAll("[" + h + "]"));
    l.hasAttribute && l.hasAttribute(h) && b.push(l);
    for (const v of b)
      v[c] || new t(v);
  }
  function t(l) {
    this.dom = l, l[c] = this, this.timeoutDefault = parseInt(l.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(l.getAttribute("data-ln-toast-max") || "5", 10);
    for (const b of Array.from(l.querySelectorAll("[data-ln-toast-item]")))
      r(b, l);
    return this;
  }
  t.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const l of Array.from(this.dom.children))
        u(l);
      delete this.dom[c];
    }
  };
  function o(l, b) {
    const v = ((l.type || "info") + "").toLowerCase(), E = dt(b, _, "ln-toast");
    if (!E)
      return console.warn('[ln-toast] Template "' + _ + '" not found'), null;
    const A = E.firstElementChild;
    if (!A) return null;
    const w = !!(l.message || l.data && l.data.errors);
    X(A, {
      title: l.title || f[v] || f.info,
      role: v === "error" ? "alert" : "status",
      ariaLive: v === "error" ? "assertive" : "polite",
      hasBody: w
    });
    const C = A.querySelector(".ln-toast__card");
    C && C.classList.add(p[v] || "info");
    const x = A.querySelector(".ln-toast__side");
    if (x) {
      const D = x.querySelector("use");
      D && D.setAttribute("href", "#ln-" + (m[v] || m.info));
    }
    const R = A.querySelector(".ln-toast__body");
    R && w && e(R, l);
    const O = A.querySelector(".ln-toast__close");
    return O && O.addEventListener("click", function() {
      u(A);
    }), A;
  }
  function e(l, b) {
    if (b.message)
      if (Array.isArray(b.message)) {
        const v = document.createElement("ul");
        for (const E of b.message) {
          const A = document.createElement("li");
          A.textContent = E, v.appendChild(A);
        }
        l.appendChild(v);
      } else {
        const v = document.createElement("p");
        v.textContent = b.message, l.appendChild(v);
      }
    if (b.data && b.data.errors) {
      const v = document.createElement("ul");
      for (const E of Object.values(b.data.errors).flat()) {
        const A = document.createElement("li");
        A.textContent = E, v.appendChild(A);
      }
      l.appendChild(v);
    }
  }
  function i(l, b) {
    for (; l.dom.children.length >= l.max; ) l.dom.removeChild(l.dom.firstElementChild);
    l.dom.appendChild(b), requestAnimationFrame(() => b.classList.add("ln-toast__item--in"));
  }
  function u(l) {
    !l || !l.parentNode || (clearTimeout(l._timer), l.classList.remove("ln-toast__item--in"), l.classList.add("ln-toast__item--out"), setTimeout(() => {
      l.parentNode && l.parentNode.removeChild(l);
    }, 200));
  }
  function a(l) {
    let b = l && l.container;
    return typeof b == "string" && (b = document.querySelector(b)), b instanceof HTMLElement || (b = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), b || null;
  }
  function r(l, b) {
    const v = ((l.getAttribute("data-type") || "info") + "").toLowerCase(), E = l.getAttribute("data-title"), A = (l.innerText || l.textContent || "").trim(), w = o({
      type: v,
      title: E,
      message: A || void 0
    }, b);
    w && (l.parentNode && l.parentNode.replaceChild(w, l), requestAnimationFrame(() => w.classList.add("ln-toast__item--in")));
  }
  function d(l) {
    const b = l.detail || {}, v = a(b);
    if (!v) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const E = v[c] || new t(v), A = o(b, v);
    if (!A) return;
    const w = Number.isFinite(b.timeout) ? b.timeout : E.timeoutDefault;
    i(E, A), w > 0 && (A._timer = setTimeout(() => u(A), w));
  }
  function g(l) {
    const b = l && l.detail || {};
    if (b.container) {
      const v = a(b);
      if (v)
        for (const E of Array.from(v.children)) u(E);
    } else {
      const v = document.querySelectorAll("[" + h + "]");
      for (const E of Array.from(v))
        for (const A of Array.from(E.children)) u(A);
    }
  }
  $(function() {
    n(), window.addEventListener("ln-toast:enqueue", d), window.addEventListener("ln-toast:clear", g), new MutationObserver(function(b) {
      for (const v of b) {
        if (v.type === "attributes") {
          s(v.target);
          continue;
        }
        for (const E of v.addedNodes)
          s(E);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), s(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", c = "lnUpload", _ = "data-ln-upload-dict", m = "data-ln-upload-accept", p = "data-ln-upload-context", f = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function n() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const r = document.createElement("div");
    r.innerHTML = f;
    const d = r.firstElementChild;
    d && document.body.appendChild(d);
  }
  if (window[c] !== void 0) return;
  function s(r) {
    if (r === 0) return "0 B";
    const d = 1024, g = ["B", "KB", "MB", "GB"], l = Math.floor(Math.log(r) / Math.log(d));
    return parseFloat((r / Math.pow(d, l)).toFixed(1)) + " " + g[l];
  }
  function t(r) {
    return r.split(".").pop().toLowerCase();
  }
  function o(r) {
    return r === "docx" && (r = "doc"), ["pdf", "doc", "epub"].includes(r) ? "lnc-file-" + r : "ln-file";
  }
  function e(r, d) {
    if (!d) return !0;
    const g = "." + t(r.name);
    return d.split(",").map(function(b) {
      return b.trim().toLowerCase();
    }).includes(g.toLowerCase());
  }
  function i(r) {
    if (r.hasAttribute("data-ln-upload-initialized")) return;
    r.setAttribute("data-ln-upload-initialized", "true"), n();
    const d = ue(r, _), g = r.querySelector(".ln-upload__zone"), l = r.querySelector(".ln-upload__list"), b = r.getAttribute(m) || "";
    if (!g || !l) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", r);
      return;
    }
    let v = r.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), b && (v.accept = b.split(",").map(function(q) {
      return q = q.trim(), q.startsWith(".") ? q : "." + q;
    }).join(",")), r.appendChild(v));
    const E = r.getAttribute(h) || "/files/upload", A = r.getAttribute(p) || "", w = r.getAttribute("data-ln-upload-delete") || (E.includes("/upload") ? E.replace(/\/upload\/?$/, "/{id}") : E + "/{id}"), C = /* @__PURE__ */ new Map();
    let x = 0;
    function R() {
      const q = document.querySelector('meta[name="csrf-token"]');
      return q ? q.getAttribute("content") : "";
    }
    function O(q) {
      if (!e(q, b)) {
        const T = d["invalid-type"];
        S(r, "ln-upload:invalid", {
          file: q,
          message: T
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["invalid-title"] || "Invalid File",
          message: T || d["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const H = "file-" + ++x, P = t(q.name), pt = o(P), nt = dt(r, "ln-upload-item", "ln-upload");
      if (!nt) return;
      const G = nt.firstElementChild;
      if (!G) return;
      G.setAttribute("data-file-id", H), X(G, {
        name: q.name,
        sizeText: "0%",
        iconHref: "#" + pt,
        removeLabel: d.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const mt = G.querySelector(".ln-upload__progress-bar"), it = G.querySelector('[data-ln-upload-action="remove"]');
      it && (it.disabled = !0), l.appendChild(G);
      const st = new FormData();
      st.append("file", q);
      const At = /* @__PURE__ */ new Set();
      r.querySelectorAll("input, select, textarea").forEach(function(T) {
        if (T.name && T.name !== "file_ids[]" && T.type !== "file") {
          if ((T.type === "checkbox" || T.type === "radio") && !T.checked)
            return;
          st.append(T.name, T.value), At.add(T.name);
        }
      }), !At.has("context") && A && st.append("context", A);
      const y = new XMLHttpRequest();
      y.upload.addEventListener("progress", function(T) {
        if (T.lengthComputable) {
          const k = Math.round(T.loaded / T.total * 100);
          mt.style.width = k + "%", X(G, { sizeText: k + "%" });
        }
      }), y.addEventListener("load", function() {
        if (y.status >= 200 && y.status < 300) {
          let T;
          try {
            T = JSON.parse(y.responseText);
          } catch {
            L("Invalid response");
            return;
          }
          X(G, { sizeText: s(T.size || q.size), uploading: !1 }), it && (it.disabled = !1), C.set(H, {
            serverId: T.id,
            name: T.name,
            size: T.size
          }), D(), S(r, "ln-upload:uploaded", {
            localId: H,
            serverId: T.id,
            name: T.name
          });
        } else {
          let T = d["upload-failed"] || "Upload failed";
          try {
            T = JSON.parse(y.responseText).message || T;
          } catch {
          }
          L(T);
        }
      }), y.addEventListener("error", function() {
        L(d["network-error"] || "Network error");
      });
      function L(T) {
        mt && (mt.style.width = "100%"), X(G, { sizeText: d.error || "Error", uploading: !1, error: !0 }), it && (it.disabled = !1), S(r, "ln-upload:error", {
          file: q,
          message: T
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["error-title"] || "Upload Error",
          message: T || d["upload-failed"] || "Failed to upload file"
        });
      }
      y.open("POST", E), y.setRequestHeader("X-CSRF-TOKEN", R()), y.setRequestHeader("Accept", "application/json"), y.send(st);
    }
    function D() {
      for (const q of r.querySelectorAll('input[name="file_ids[]"]'))
        q.remove();
      for (const [, q] of C) {
        const H = document.createElement("input");
        H.type = "hidden", H.name = "file_ids[]", H.value = q.serverId, r.appendChild(H);
      }
    }
    function F(q) {
      const H = C.get(q), P = l.querySelector('[data-file-id="' + q + '"]');
      if (!H || !H.serverId) {
        P && P.remove(), C.delete(q), D();
        return;
      }
      P && X(P, { deleting: !0 });
      const pt = w.replace("{id}", H.serverId);
      fetch(pt, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": R(),
          Accept: "application/json"
        }
      }).then(function(nt) {
        nt.status === 200 ? (P && P.remove(), C.delete(q), D(), S(r, "ln-upload:removed", {
          localId: q,
          serverId: H.serverId
        })) : (P && X(P, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["delete-title"] || "Error",
          message: d["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(nt) {
        console.warn("[ln-upload] Delete error:", nt), P && X(P, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["network-error"] || "Network error",
          message: d["connection-error"] || "Could not connect to server"
        });
      });
    }
    function U(q) {
      for (const H of q)
        O(H);
      v.value = "";
    }
    const Q = function() {
      v.click();
    }, Z = function() {
      U(this.files);
    }, Et = function(q) {
      q.preventDefault(), q.stopPropagation(), g.classList.add("ln-upload__zone--dragover");
    }, ut = function(q) {
      q.preventDefault(), q.stopPropagation(), g.classList.add("ln-upload__zone--dragover");
    }, Y = function(q) {
      q.preventDefault(), q.stopPropagation(), g.classList.remove("ln-upload__zone--dragover");
    }, ht = function(q) {
      q.preventDefault(), q.stopPropagation(), g.classList.remove("ln-upload__zone--dragover"), U(q.dataTransfer.files);
    }, ft = function(q) {
      const H = q.target.closest('[data-ln-upload-action="remove"]');
      if (!H || !l.contains(H) || H.disabled) return;
      const P = H.closest(".ln-upload__item");
      P && F(P.getAttribute("data-file-id"));
    };
    g.addEventListener("click", Q), v.addEventListener("change", Z), g.addEventListener("dragenter", Et), g.addEventListener("dragover", ut), g.addEventListener("dragleave", Y), g.addEventListener("drop", ht), l.addEventListener("click", ft), r.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(C.values()).map(function(q) {
          return q.serverId;
        });
      },
      getFiles: function() {
        return Array.from(C.values());
      },
      clear: function() {
        for (const [, q] of C)
          if (q.serverId) {
            const H = w.replace("{id}", q.serverId);
            fetch(H, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": R(),
                Accept: "application/json"
              }
            });
          }
        C.clear(), l.innerHTML = "", D(), S(r, "ln-upload:cleared", {});
      },
      destroy: function() {
        g.removeEventListener("click", Q), v.removeEventListener("change", Z), g.removeEventListener("dragenter", Et), g.removeEventListener("dragover", ut), g.removeEventListener("dragleave", Y), g.removeEventListener("drop", ht), l.removeEventListener("click", ft), C.clear(), l.innerHTML = "", D(), r.removeAttribute("data-ln-upload-initialized"), delete r.lnUploadAPI;
      }
    };
  }
  function u() {
    for (const r of document.querySelectorAll("[" + h + "]"))
      i(r);
  }
  function a() {
    $(function() {
      new MutationObserver(function(d) {
        for (const g of d)
          if (g.type === "childList") {
            for (const l of g.addedNodes)
              if (l.nodeType === 1) {
                l.hasAttribute(h) && i(l);
                for (const b of l.querySelectorAll("[" + h + "]"))
                  i(b);
              }
          } else g.type === "attributes" && g.target.hasAttribute(h) && i(g.target);
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
    initAll: u
  }, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function c(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function _(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !c(s)) return;
    s.target = "_blank";
    const t = (s.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), s.rel = t.join(" ");
    const o = document.createElement("span");
    o.className = "sr-only", o.textContent = "(opens in new tab)", s.appendChild(o), s.setAttribute("data-ln-external-link", "processed"), S(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function m(s) {
    s = s || document.body;
    for (const t of s.querySelectorAll("a, area"))
      _(t);
  }
  function p() {
    $(function() {
      document.body.addEventListener("click", function(s) {
        const t = s.target.closest("a, area");
        t && t.getAttribute("data-ln-external-link") === "processed" && S(t, "ln-external-links:clicked", {
          link: t,
          href: t.href,
          text: t.textContent || t.title || ""
        });
      });
    }, "ln-external-links");
  }
  function f() {
    $(function() {
      new MutationObserver(function(t) {
        for (const o of t) {
          if (o.type === "childList") {
            for (const e of o.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && _(e), e.querySelectorAll))
                for (const i of e.querySelectorAll("a, area"))
                  _(i);
          }
          if (o.type === "attributes" && o.attributeName === "href") {
            const e = o.target;
            e.matches && (e.matches("a") || e.matches("area")) && _(e);
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
  function n() {
    p(), f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[h] = {
    process: m
  }, n();
})();
(function() {
  const h = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  let _ = null;
  function m() {
    _ = document.createElement("div"), _.className = "ln-link-status", document.body.appendChild(_);
  }
  function p(l) {
    _ && (_.textContent = l, _.classList.add("ln-link-status--visible"));
  }
  function f() {
    _ && _.classList.remove("ln-link-status--visible");
  }
  function n(l, b) {
    if (b.target.closest("a, button, input, select, textarea")) return;
    const v = l.querySelector("a");
    if (!v) return;
    const E = v.getAttribute("href");
    if (!E) return;
    if (b.ctrlKey || b.metaKey || b.button === 1) {
      window.open(E, "_blank");
      return;
    }
    z(l, "ln-link:navigate", { target: l, href: E, link: v }).defaultPrevented || v.click();
  }
  function s(l) {
    const b = l.querySelector("a");
    if (!b) return;
    const v = b.getAttribute("href");
    v && p(v);
  }
  function t() {
    f();
  }
  function o(l) {
    l[c + "Row"] || (l[c + "Row"] = !0, l.querySelector("a") && (l._lnLinkClick = function(b) {
      n(l, b);
    }, l._lnLinkEnter = function() {
      s(l);
    }, l.addEventListener("click", l._lnLinkClick), l.addEventListener("mouseenter", l._lnLinkEnter), l.addEventListener("mouseleave", t)));
  }
  function e(l) {
    l[c + "Row"] && (l._lnLinkClick && l.removeEventListener("click", l._lnLinkClick), l._lnLinkEnter && l.removeEventListener("mouseenter", l._lnLinkEnter), l.removeEventListener("mouseleave", t), delete l._lnLinkClick, delete l._lnLinkEnter, delete l[c + "Row"]);
  }
  function i(l) {
    if (!l[c + "Init"]) return;
    const b = l.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const v = b === "TABLE" && l.querySelector("tbody") || l;
      for (const E of v.querySelectorAll("tr"))
        e(E);
    } else
      e(l);
    delete l[c + "Init"];
  }
  function u(l) {
    if (l[c + "Init"]) return;
    l[c + "Init"] = !0;
    const b = l.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const v = b === "TABLE" && l.querySelector("tbody") || l;
      for (const E of v.querySelectorAll("tr"))
        o(E);
    } else
      o(l);
  }
  function a(l) {
    l.hasAttribute && l.hasAttribute(h) && u(l);
    const b = l.querySelectorAll ? l.querySelectorAll("[" + h + "]") : [];
    for (const v of b)
      u(v);
  }
  function r() {
    $(function() {
      new MutationObserver(function(b) {
        for (const v of b)
          if (v.type === "childList")
            for (const E of v.addedNodes)
              E.nodeType === 1 && (a(E), E.tagName === "TR" && E.closest("[" + h + "]") && o(E));
          else v.type === "attributes" && a(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function d(l) {
    a(l);
  }
  window[c] = { init: d, destroy: i };
  function g() {
    m(), r(), d(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", g) : g();
})();
(function() {
  const h = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0) return;
  function _(o) {
    m(o);
  }
  function m(o) {
    const e = Array.from(o.querySelectorAll(h));
    for (const i of e)
      i[c] || (i[c] = new p(i));
    o.hasAttribute && o.hasAttribute("data-ln-progress") && !o[c] && (o[c] = new p(o));
  }
  function p(o) {
    return this.dom = o, this._attrObserver = null, this._parentObserver = null, t.call(this), n.call(this), s.call(this), this;
  }
  p.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[c]);
  };
  function f() {
    $(function() {
      new MutationObserver(function(e) {
        for (const i of e)
          if (i.type === "childList")
            for (const u of i.addedNodes)
              u.nodeType === 1 && m(u);
          else i.type === "attributes" && m(i.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  f();
  function n() {
    const o = this, e = new MutationObserver(function(i) {
      for (const u of i)
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && t.call(o);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function s() {
    const o = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const i = new MutationObserver(function(u) {
      for (const a of u)
        a.attributeName === "data-ln-progress-max" && t.call(o);
    });
    i.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = i;
  }
  function t() {
    const o = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, u = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let a = u > 0 ? o / u * 100 : 0;
    a < 0 && (a = 0), a > 100 && (a = 100), this.dom.style.width = a + "%";
    const r = Math.max(0, Math.min(o, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(r)), S(this.dom, "ln-progress:change", { target: this.dom, value: o, max: u, percentage: a });
  }
  window[c] = _, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const h = "data-ln-filter", c = "lnFilter", _ = "data-ln-filter-initialized", m = "data-ln-filter-key", p = "data-ln-filter-value", f = "data-ln-filter-hide", n = "data-ln-filter-reset", s = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[c] !== void 0) return;
  function o(r) {
    return r.hasAttribute(n) || r.getAttribute(p) === "";
  }
  function e(r) {
    let d = r._filterKey;
    const g = [];
    for (let l = 0; l < r.inputs.length; l++) {
      const b = r.inputs[l];
      if (b.checked && !o(b)) {
        const v = b.getAttribute(p);
        v && g.push(v);
      }
    }
    return { key: d, values: g };
  }
  function i(r, d) {
    if (r.length !== d.length) return !0;
    for (let g = 0; g < r.length; g++) if (r[g] !== d[g]) return !0;
    return !1;
  }
  function u(r) {
    const d = r.dom, g = r.colIndex, l = d.querySelector("template");
    if (!l || g === null) return;
    const b = document.getElementById(r.targetId);
    if (!b) return;
    const v = b.tagName === "TABLE" ? b : b.querySelector("table");
    if (!v || b.hasAttribute("data-ln-table")) return;
    const E = {}, A = [], w = v.tBodies;
    for (let R = 0; R < w.length; R++) {
      const O = w[R].rows;
      for (let D = 0; D < O.length; D++) {
        const F = O[D].cells[g], U = F ? F.textContent.trim() : "";
        U && !E[U] && (E[U] = !0, A.push(U));
      }
    }
    A.sort(function(R, O) {
      return R.localeCompare(O);
    });
    const C = d.querySelector("[" + m + "]"), x = C ? C.getAttribute(m) : d.getAttribute("data-ln-filter-key") || "col" + g;
    for (let R = 0; R < A.length; R++) {
      const O = l.content.cloneNode(!0), D = O.querySelector("input");
      D && (D.setAttribute(m, x), D.setAttribute(p, A[R]), yt(O, { text: A[R] }), d.appendChild(O));
    }
  }
  function a(r) {
    if (r.hasAttribute(_)) return this;
    this.dom = r, this.targetId = r.getAttribute(h);
    const d = r.getAttribute(s);
    this.colIndex = d !== null ? parseInt(d, 10) : null, u(this), this.inputs = Array.from(r.querySelectorAll("[" + m + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(m) : null, this._lastSnapshot = null;
    const g = this, l = me(
      function() {
        g._render();
      },
      function() {
        g._afterRender();
      }
    );
    this._queueRender = l, this._attachHandlers();
    let b = !1;
    if (r.hasAttribute("data-ln-persist")) {
      const v = Ct("filter", r);
      if (v && v.key && Array.isArray(v.values) && v.values.length > 0) {
        for (let E = 0; E < this.inputs.length; E++) {
          const A = this.inputs[E];
          o(A) ? A.checked = !1 : A.getAttribute(m) === v.key && v.values.indexOf(A.getAttribute(p)) !== -1 ? A.checked = !0 : A.checked = !1;
        }
        l(), b = !0;
      }
    }
    if (!b) {
      for (let v = 0; v < this.inputs.length; v++)
        if (this.inputs[v].checked && !o(this.inputs[v])) {
          l();
          break;
        }
    }
    return r.setAttribute(_, ""), this;
  }
  a.prototype._attachHandlers = function() {
    const r = this;
    this.inputs.forEach(function(d) {
      d[c + "Bound"] || (d[c + "Bound"] = !0, d._lnFilterChange = function() {
        if (o(d)) {
          for (let g = 0; g < r.inputs.length; g++)
            o(r.inputs[g]) || (r.inputs[g].checked = !1);
          d.checked = !0, r._queueRender();
          return;
        }
        if (d.checked) {
          for (let l = 0; l < r.inputs.length; l++)
            o(r.inputs[l]) && (r.inputs[l].checked = !1);
          let g = !1;
          for (let l = 0; l < r.inputs.length; l++)
            if (o(r.inputs[l])) {
              g = !0;
              break;
            }
          if (g) {
            let l = !0;
            for (let b = 0; b < r.inputs.length; b++)
              if (!o(r.inputs[b]) && !r.inputs[b].checked) {
                l = !1;
                break;
              }
            if (l)
              for (let b = 0; b < r.inputs.length; b++)
                o(r.inputs[b]) ? r.inputs[b].checked = !0 : r.inputs[b].checked = !1;
          }
        } else {
          let g = !1;
          for (let l = 0; l < r.inputs.length; l++)
            if (!o(r.inputs[l]) && r.inputs[l].checked) {
              g = !0;
              break;
            }
          if (!g)
            for (let l = 0; l < r.inputs.length; l++)
              o(r.inputs[l]) && (r.inputs[l].checked = !0);
        }
        r._queueRender();
      }, d.addEventListener("change", d._lnFilterChange));
    });
  }, a.prototype._render = function() {
    const r = this, d = e(this), g = d.key === null || d.values.length === 0, l = [];
    for (let b = 0; b < d.values.length; b++)
      l.push(d.values[b].toLowerCase());
    if (r.colIndex !== null)
      r._filterTableRows(d);
    else {
      const b = document.getElementById(r.targetId);
      if (!b) return;
      const v = b.children;
      for (let E = 0; E < v.length; E++) {
        const A = v[E];
        if (g) {
          A.removeAttribute(f);
          continue;
        }
        const w = A.getAttribute("data-" + d.key);
        A.removeAttribute(f), w !== null && l.indexOf(w.toLowerCase()) === -1 && A.setAttribute(f, "true");
      }
    }
  }, a.prototype._afterRender = function() {
    const r = e(this), d = this._lastSnapshot;
    if (!d || d.key !== r.key || i(d.values, r.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: r.key,
        values: r.values.slice()
      });
      const l = d && d.values.length > 0, b = r.values.length === 0;
      l && b && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: r.key, values: r.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (r.key && r.values.length > 0 ? lt("filter", this.dom, { key: r.key, values: r.values.slice() }) : lt("filter", this.dom, null));
  }, a.prototype._dispatchOnBoth = function(r, d) {
    S(this.dom, r, d);
    const g = document.getElementById(this.targetId);
    g && g !== this.dom && S(g, r, d);
  }, a.prototype._filterTableRows = function(r) {
    const d = document.getElementById(this.targetId);
    if (!d) return;
    const g = d.tagName === "TABLE" ? d : d.querySelector("table");
    if (!g || d.hasAttribute("data-ln-table")) return;
    const l = r.key || this._filterKey, b = r.values;
    t.has(g) || t.set(g, {});
    const v = t.get(g);
    if (l && b.length > 0) {
      const C = [];
      for (let x = 0; x < b.length; x++)
        C.push(b[x].toLowerCase());
      v[l] = { col: this.colIndex, values: C };
    } else l && delete v[l];
    const E = Object.keys(v), A = E.length > 0, w = g.tBodies;
    for (let C = 0; C < w.length; C++) {
      const x = w[C].rows;
      for (let R = 0; R < x.length; R++) {
        const O = x[R];
        if (!A) {
          O.removeAttribute(f);
          continue;
        }
        let D = !0;
        for (let F = 0; F < E.length; F++) {
          const U = v[E[F]], Q = O.cells[U.col], Z = Q ? Q.textContent.trim().toLowerCase() : "";
          if (U.values.indexOf(Z) === -1) {
            D = !1;
            break;
          }
        }
        D ? O.removeAttribute(f) : O.setAttribute(f, "true");
      }
    }
  }, a.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const d = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (d && t.has(d)) {
            const g = t.get(d), l = this._filterKey;
            l && g[l] && delete g[l], Object.keys(g).length === 0 && t.delete(d);
          }
        }
      }
      this.inputs.forEach(function(r) {
        r._lnFilterChange && (r.removeEventListener("change", r._lnFilterChange), delete r._lnFilterChange), delete r[c + "Bound"];
      }), this.dom.removeAttribute(_), delete this.dom[c];
    }
  }, B(h, c, a, "ln-filter");
})();
(function() {
  const h = "data-ln-search", c = "lnSearch", _ = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function f(n) {
    if (n.hasAttribute(_)) return this;
    this.dom = n, this.targetId = n.getAttribute(h);
    const s = n.tagName;
    if (this.input = s === "INPUT" || s === "TEXTAREA" ? n : n.querySelector('[name="search"]') || n.querySelector('input[type="search"]') || n.querySelector('input[type="text"]'), this.itemsSelector = n.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return n.setAttribute(_, ""), this;
  }
  f.prototype._attachHandler = function() {
    if (!this.input) return;
    const n = this, s = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = s ? s.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      n.input.value = "", n._search(""), n.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(n._debounceTimer), n._debounceTimer = setTimeout(function() {
        n._search(n.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, f.prototype._search = function(n) {
    const s = document.getElementById(this.targetId);
    if (!s || z(s, "ln-search:change", { term: n, targetId: this.targetId }).defaultPrevented) return;
    const o = this.itemsSelector ? s.querySelectorAll(this.itemsSelector) : s.children;
    for (let e = 0; e < o.length; e++) {
      const i = o[e];
      i.removeAttribute(m), n && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(n) && i.setAttribute(m, "true");
    }
  }, f.prototype.destroy = function() {
    this.dom[c] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(_), delete this.dom[c]);
  }, B(h, c, f, "ln-search");
})();
(function() {
  const h = "lnTableSort", c = "data-ln-table-sort", _ = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function m(s) {
    p(s);
  }
  function p(s) {
    const t = Array.from(s.querySelectorAll("table"));
    s.tagName === "TABLE" && t.push(s), t.forEach(function(o) {
      if (o[h]) return;
      const e = Array.from(o.querySelectorAll("th[" + c + "]"));
      e.length && (o[h] = new f(o, e));
    });
  }
  function f(s, t) {
    this.table = s, this.ths = t, this._col = -1, this._dir = null;
    const o = this;
    t.forEach(function(i, u) {
      if (i[h + "Bound"]) return;
      i[h + "Bound"] = !0;
      const a = i.querySelector("[" + _ + "]");
      a && (a._lnSortClick = function() {
        o._handleClick(u, i);
      }, a.addEventListener("click", a._lnSortClick));
    });
    const e = s.closest("[data-ln-table][data-ln-persist]");
    if (e) {
      const i = Ct("table-sort", e);
      i && i.dir && i.col >= 0 && i.col < t.length && (this._handleClick(i.col, t[i.col]), i.dir === "desc" && this._handleClick(i.col, t[i.col]));
    }
    return this;
  }
  f.prototype._handleClick = function(s, t) {
    let o;
    this._col !== s ? o = "asc" : this._dir === "asc" ? o = "desc" : this._dir === "desc" ? o = null : o = "asc", this.ths.forEach(function(i) {
      i.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), o === null ? (this._col = -1, this._dir = null) : (this._col = s, this._dir = o, t.classList.add(o === "asc" ? "ln-sort-asc" : "ln-sort-desc")), S(this.table, "ln-table:sort", {
      column: s,
      sortType: t.getAttribute(c),
      direction: o
    });
    const e = this.table.closest("[data-ln-table][data-ln-persist]");
    e && (o === null ? lt("table-sort", e, null) : lt("table-sort", e, { col: s, dir: o }));
  }, f.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(s) {
      const t = s.querySelector("[" + _ + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete s[h + "Bound"];
    }), delete this.table[h]);
  };
  function n() {
    $(function() {
      new MutationObserver(function(t) {
        t.forEach(function(o) {
          o.type === "childList" ? o.addedNodes.forEach(function(e) {
            e.nodeType === 1 && p(e);
          }) : o.type === "attributes" && p(o.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [c] });
    }, "ln-table-sort");
  }
  window[h] = m, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-table", c = "lnTable", _ = "data-ln-table-sort", m = "data-ln-table-empty";
  if (window[c] !== void 0) return;
  const n = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, s = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function t(i) {
    return s ? s.format(i) : String(i);
  }
  function o(i) {
    let u = i.parentElement;
    for (; u && u !== document.body && u !== document.documentElement; ) {
      const r = getComputedStyle(u).overflowY;
      if (r === "auto" || r === "scroll") return u;
      u = u.parentElement;
    }
    return null;
  }
  function e(i) {
    this.dom = i, this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead");
    const u = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = u ? Array.from(u.querySelectorAll("th")) : [], this.isDataDriven = i.hasAttribute("data-ln-table-source"), this.name = i.getAttribute(h) || "", this.source = i.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const a = this;
    if (this._onColumnFilter = function(r) {
      const d = r.detail.key;
      let g = null;
      for (let v = 0; v < a.ths.length; v++)
        if (a.ths[v].getAttribute("data-ln-table-filter-col") === d) {
          g = a.ths[v];
          break;
        }
      if (!g) return;
      const l = r.detail.values, b = g.querySelector("[data-ln-table-col-filter]");
      if (b && b.classList.toggle("ln-filter-active", !!(l && l.length > 0)), a.isDataDriven)
        !l || l.length === 0 ? delete a.currentFilters[d] : a.currentFilters[d] = l, a._requestData();
      else {
        if (!l || l.length === 0)
          delete a._columnFilters[d];
        else {
          const v = [];
          for (let E = 0; E < l.length; E++)
            v.push(l[E].toLowerCase());
          a._columnFilters[d] = v;
        }
        a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), S(i, "ln-table:filter", {
          term: a._searchTerm,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }
    }, this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = i.querySelector("[data-ln-table-total]"), this._filteredSpan = i.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = i.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(d) {
        const g = d.detail || {};
        a._data = g.data || [], a._lastTotal = g.total != null ? g.total : a._data.length, a._lastFiltered = g.filtered != null ? g.filtered : a._data.length, a.totalCount = a._lastTotal, a.visibleCount = a._lastFiltered, a.isLoaded = !0, i.classList.remove("ln-table--loading"), a._vStart = -1, a._vEnd = -1, a._applyFilterAndSort(), a._render(), a._updateFooter(), S(i, "ln-table:rendered", {
          table: a.name,
          total: a.totalCount,
          visible: a.visibleCount
        });
      }, i.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(d) {
        const g = d.detail && d.detail.loading;
        i.classList.toggle("ln-table--loading", !!g), g && (a.isLoaded = !1);
      }, i.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(d) {
        const g = d.target.closest("[data-ln-table-col-sort]");
        if (!g) return;
        const l = g.closest("th");
        if (!l) return;
        const b = l.getAttribute("data-ln-table-col");
        b && a._handleSort(b, l);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), i.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClearAll = function(d) {
        if (d.target.closest("[data-ln-table-clear-all]") || d.target.closest("[data-ln-data-table-clear-all]")) {
          a.currentFilters = {};
          for (let l = 0; l < a.ths.length; l++) {
            const b = a.ths[l].querySelector("[data-ln-table-col-filter]");
            b && b.classList.remove("ln-filter-active");
          }
          S(i, "ln-table:clear-filters", { table: a.name }), a._requestData();
        }
      }, i.addEventListener("click", this._onClearAll), this._selectable = i.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(d) {
        if (d.target.closest("[data-ln-table-row-select]") || d.target.closest("[data-ln-table-row-action]") || d.target.closest("a") || d.target.closest("button") || d.ctrlKey || d.metaKey || d.button === 1) return;
        const g = d.target.closest("[data-ln-table-row]");
        if (!g) return;
        const l = g.getAttribute("data-ln-table-row-id"), b = g._lnRecord || {};
        S(i, "ln-table:row-click", {
          table: a.name,
          id: l,
          record: b
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(d) {
        const g = d.target.closest("[data-ln-table-row-action]");
        if (!g) return;
        d.stopPropagation();
        const l = g.closest("[data-ln-table-row]");
        if (!l) return;
        const b = g.getAttribute("data-ln-table-row-action"), v = l.getAttribute("data-ln-table-row-id"), E = l._lnRecord || {};
        S(i, "ln-table:row-action", {
          table: a.name,
          id: v,
          action: b,
          record: E
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const r = document.querySelector('[data-ln-search="' + i.id + '"]');
      if (r) {
        const d = r.tagName;
        this._searchInput = d === "INPUT" || d === "TEXTAREA" ? r : r.querySelector('input[type="search"]') || r.querySelector('input[type="text"]') || r.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(d) {
        d.preventDefault(), a.currentSearch = d.detail.term, a._searchInput && (a._searchInput.value = d.detail.term), S(i, "ln-table:search", {
          table: a.name,
          query: a.currentSearch
        }), a._requestData();
      }, i.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(d) {
        if (!i.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (d.key === "/") {
          a._searchInput && (d.preventDefault(), a._searchInput.focus());
          return;
        }
        const g = a.tbody ? Array.from(a.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (g.length)
          switch (d.key) {
            case "ArrowDown":
              d.preventDefault(), a._focusedRowIndex = Math.min(a._focusedRowIndex + 1, g.length - 1), a._focusRow(g);
              break;
            case "ArrowUp":
              d.preventDefault(), a._focusedRowIndex = Math.max(a._focusedRowIndex - 1, 0), a._focusRow(g);
              break;
            case "Home":
              d.preventDefault(), a._focusedRowIndex = 0, a._focusRow(g);
              break;
            case "End":
              d.preventDefault(), a._focusedRowIndex = g.length - 1, a._focusRow(g);
              break;
            case "Enter":
              if (a._focusedRowIndex >= 0 && a._focusedRowIndex < g.length) {
                d.preventDefault();
                const l = g[a._focusedRowIndex];
                S(i, "ln-table:row-click", {
                  table: a.name,
                  id: l.getAttribute("data-ln-table-row-id"),
                  record: l._lnRecord || {}
                });
              }
              break;
            case " ":
              if (a._selectable && a._focusedRowIndex >= 0 && a._focusedRowIndex < g.length) {
                d.preventDefault();
                const l = g[a._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                l && (l.checked = !l.checked, l.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), S(i, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        a.tbody.rows.length > 0 && (a._emptyTbodyObserver.disconnect(), a._emptyTbodyObserver = null, a._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(r) {
        r.preventDefault(), a._searchTerm = r.detail.term, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), S(i, "ln-table:filter", {
          term: a._searchTerm,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }, i.addEventListener("ln-search:change", this._onSearch), this._onSort = function(r) {
        a._sortCol = r.detail.direction === null ? -1 : r.detail.column, a._sortDir = r.detail.direction, a._sortType = r.detail.sortType, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), S(i, "ln-table:sorted", {
          column: r.detail.column,
          direction: r.detail.direction,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }, i.addEventListener("ln-table:sort", this._onSort), i.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(r) {
        if (!r.target.closest("[data-ln-table-clear]")) return;
        a._searchTerm = "";
        const g = document.querySelector('[data-ln-search="' + i.id + '"]');
        if (g) {
          const b = g.tagName === "INPUT" ? g : g.querySelector("input");
          b && (b.value = "");
        }
        a._columnFilters = {};
        for (let b = 0; b < a.ths.length; b++) {
          const v = a.ths[b].querySelector("[data-ln-table-col-filter]");
          v && v.classList.remove("ln-filter-active");
        }
        const l = document.querySelectorAll('[data-ln-filter="' + i.id + '"]');
        for (let b = 0; b < l.length; b++) {
          const v = l[b].querySelector("[data-ln-filter-reset]");
          v && (v.checked = !0, v.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), S(i, "ln-table:filter", {
          term: "",
          matched: a._filteredData.length,
          total: a._data.length
        });
      }, i.addEventListener("click", this._onClear);
    return this;
  }
  e.prototype._parseRows = function() {
    const i = this.tbody.rows, u = this.ths;
    this._data = [];
    const a = [];
    for (let r = 0; r < u.length; r++)
      a[r] = u[r].getAttribute(_);
    i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40), this._lockColumnWidths();
    for (let r = 0; r < i.length; r++) {
      const d = i[r], g = [], l = [], b = [];
      for (let E = 0; E < d.cells.length; E++) {
        const A = d.cells[E], w = A.textContent.trim(), C = Ht(A), x = a[E];
        l[E] = w.toLowerCase(), x === "number" || x === "date" ? g[E] = parseFloat(C) || 0 : x === "string" ? g[E] = String(C) : g[E] = null, E < d.cells.length - 1 && b.push(w.toLowerCase());
      }
      let v = null;
      if (this.isDataDriven) {
        v = {};
        const E = d.getAttribute("data-ln-table-row-id");
        E != null && (v.id = E);
        for (let A = 0; A < u.length; A++) {
          const w = u[A].getAttribute("data-ln-table-col");
          if (w) {
            const C = A;
            if (C < d.cells.length) {
              const x = d.cells[C];
              v[w] = Ht(x);
            }
          }
        }
      }
      this._data.push({
        sortKeys: g,
        rawTexts: l,
        html: d.outerHTML,
        searchText: b.join(" "),
        id: this.isDataDriven && v ? v.id : void 0,
        ...v
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, e.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const i = (this.currentSearch || "").trim().toLowerCase(), u = this.currentFilters || {}, a = Object.keys(u).length > 0;
      if (this._filteredData = this._data.filter(function(v) {
        if (i) {
          let E = !1;
          for (const A in v)
            if (v.hasOwnProperty(A) && typeof v[A] == "string" && A !== "html" && A !== "searchText" && v[A].toLowerCase().indexOf(i) !== -1) {
              E = !0;
              break;
            }
          if (!E) return !1;
        }
        if (a)
          for (const E in u) {
            const A = u[E];
            if (A && A.length > 0) {
              const w = v[E], C = w != null ? String(w) : "";
              if (A.indexOf(C) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const r = this.currentSort.field, g = this.currentSort.direction === "desc" ? -1 : 1;
      let l = null;
      if (this.ths) {
        for (let v = 0; v < this.ths.length; v++)
          if (this.ths[v].getAttribute("data-ln-table-col") === r) {
            l = this.ths[v].getAttribute(_);
            break;
          }
      }
      const b = n ? n.compare : function(v, E) {
        return v < E ? -1 : v > E ? 1 : 0;
      };
      this._filteredData.sort(function(v, E) {
        const A = v[r], w = E[r];
        if (l === "number" || l === "date") {
          const R = parseFloat(A) || 0, O = parseFloat(w) || 0;
          return (R - O) * g;
        }
        if (typeof A == "number" && typeof w == "number")
          return (A - w) * g;
        const C = A != null ? String(A) : "", x = w != null ? String(w) : "";
        return b(C, x) * g;
      });
    } else {
      const i = this._searchTerm, u = this._columnFilters, a = Object.keys(u).length > 0, r = this.ths, d = {};
      if (a)
        for (let E = 0; E < r.length; E++) {
          const A = r[E].getAttribute("data-ln-table-filter-col");
          A && (d[A] = E);
        }
      if (!i && !a ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
        if (i && E.searchText.indexOf(i) === -1) return !1;
        if (a)
          for (const A in u) {
            const w = d[A];
            if (w !== void 0 && u[A].indexOf(E.rawTexts[w]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, l = this._sortDir === "desc" ? -1 : 1, b = this._sortType === "number" || this._sortType === "date", v = n ? n.compare : function(E, A) {
        return E < A ? -1 : E > A ? 1 : 0;
      };
      this._filteredData.sort(function(E, A) {
        const w = E.sortKeys[g], C = A.sortKeys[g];
        return b ? (w - C) * l : v(w, C) * l;
      });
    }
  }, e.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const i = document.createElement("colgroup");
    this.ths.forEach(function(u) {
      const a = document.createElement("col");
      a.style.width = u.offsetWidth + "px", i.appendChild(a);
    }), this.table.insertBefore(i, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = i;
  }, e.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const i = this._lastTotal, u = this.visibleCount;
        if (i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || u === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, e.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, u = document.createDocumentFragment();
      for (let a = 0; a < i.length; a++) {
        const r = this._buildRow(i[a]);
        if (!r) break;
        u.appendChild(r);
      }
      this.tbody.textContent = "", this.tbody.appendChild(u), this._selectable && this._updateSelectAll();
    } else {
      const i = [], u = this._filteredData;
      for (let a = 0; a < u.length; a++) i.push(u[a].html);
      this.tbody.innerHTML = i.join("");
    }
  }, e.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    if (!this._rowHeight)
      if (this.isDataDriven) {
        if (this._data.length > 0) {
          const a = this._buildRow(this._data[0]);
          a && (this.tbody.textContent = "", this.tbody.appendChild(a), this._rowHeight = a.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const a = this.tbody ? this.tbody.rows : [];
        a.length > 0 && (this._rowHeight = a[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = o(this.dom) : this._scrollContainer = null;
    const u = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._renderVirtual();
      }));
    }, u.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    const i = this._filteredData, u = i.length, a = this._rowHeight;
    if (!a || !u) return;
    const r = this.thead ? this.thead.offsetHeight : 0, d = this._scrollContainer;
    let g, l;
    if (d) {
      const C = this.table.getBoundingClientRect(), x = d.getBoundingClientRect(), R = C.top - x.top + d.scrollTop + r;
      g = d.scrollTop - R, l = d.clientHeight;
    } else {
      const R = this.table.getBoundingClientRect().top + window.scrollY + r;
      g = window.scrollY - R, l = window.innerHeight;
    }
    let b = Math.max(0, Math.floor(g / a) - 15);
    b = Math.min(b, u);
    const v = Math.min(b + Math.ceil(l / a) + 30, u);
    if (b === this._vStart && v === this._vEnd) return;
    this._vStart = b, this._vEnd = v;
    const E = this.ths.length || 1, A = b * a, w = (u - v) * a;
    if (this.isDataDriven) {
      const C = document.createDocumentFragment();
      if (A > 0) {
        const x = document.createElement("tr");
        x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", E), R.style.height = A + "px", x.appendChild(R), C.appendChild(x);
      }
      for (let x = b; x < v; x++) {
        const R = this._buildRow(i[x]);
        R && C.appendChild(R);
      }
      if (w > 0) {
        const x = document.createElement("tr");
        x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", E), R.style.height = w + "px", x.appendChild(R), C.appendChild(x);
      }
      this.tbody.textContent = "", this.tbody.appendChild(C), this._selectable && this._updateSelectAll();
    } else {
      let C = "";
      A > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let x = b; x < v; x++) C += i[x].html;
      w > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
    }
  }, e.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let u = null;
    if (this.isDataDriven) {
      const a = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount, d = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (r < a || r === 0), g = d ? this.name + "-empty-filtered" : this.name + "-empty";
      if (u = dt(this.dom, g, "ln-table"), !u) {
        const l = this.dom.querySelector("template[data-ln-table-empty]");
        if (l) {
          const b = d ? "search" : "initial", v = l.content.querySelector('[data-ln-table-empty-when="' + b + '"]') || l.content.firstElementChild;
          v && (u = document.importNode(v, !0));
        }
      }
      if (u)
        if (u.tagName === "TR")
          this.tbody.appendChild(u);
        else {
          const l = document.createElement("td");
          l.setAttribute("colspan", String(i)), l.appendChild(u);
          const b = document.createElement("tr");
          b.className = "ln-table__empty", b.appendChild(l), this.tbody.appendChild(b);
        }
    } else {
      const a = this.dom.querySelector("template[" + m + "]"), r = document.createElement("td");
      r.setAttribute("colspan", String(i)), a && r.appendChild(document.importNode(a.content, !0));
      const d = document.createElement("tr");
      d.className = "ln-table__empty", d.appendChild(r), this.tbody.appendChild(d);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, e.prototype._fillRow = function(i, u) {
    yt(i, u);
    const a = i.querySelectorAll("[data-ln-table-cell-attr]");
    for (let r = 0; r < a.length; r++) {
      const d = a[r], g = d.getAttribute("data-ln-table-cell-attr").split(",");
      for (let l = 0; l < g.length; l++) {
        const b = g[l].trim().split(":");
        if (b.length !== 2) continue;
        const v = b[0].trim(), E = b[1].trim();
        u[v] != null && d.setAttribute(E, u[v]);
      }
    }
  }, e.prototype._buildRow = function(i) {
    const u = dt(this.dom, this.name + "-row", "ln-table");
    if (!u) return null;
    const a = u.querySelector("[data-ln-table-row]") || u.firstElementChild;
    if (!a) return null;
    if (this._fillRow(a, i), a._lnRecord = i, i.id != null && a.setAttribute("data-ln-table-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      a.classList.add("ln-row-selected");
      const r = a.querySelector("[data-ln-table-row-select]");
      r && (r.checked = !0);
    }
    return a;
  }, e.prototype._handleSort = function(i, u) {
    let a;
    !this.currentSort || this.currentSort.field !== i ? a = "asc" : this.currentSort.direction === "asc" ? a = "desc" : a = null;
    for (let r = 0; r < this.ths.length; r++)
      this.ths[r].classList.remove("ln-sort-asc", "ln-sort-desc");
    a ? (this.currentSort = { field: i, direction: a }, u.classList.add(a === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-table:sort", {
      table: this.name,
      field: i,
      direction: a
    }), this._requestData();
  }, e.prototype._requestData = function() {
    Kt(this, "ln-table:request-data", "table");
  }, e.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    let u = i.length > 0;
    for (let a = 0; a < i.length; a++) {
      const r = i[a].getAttribute("data-ln-table-row-id");
      if (r != null && !this.selectedIds.has(r)) {
        u = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = u;
  }, Object.defineProperty(e.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), e.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    if (this._onSelectionChange = function(u) {
      const a = u.target.closest("[data-ln-table-row-select]");
      if (!a) return;
      const r = a.closest("[data-ln-table-row]");
      if (!r) return;
      const d = r.getAttribute("data-ln-table-row-id");
      d != null && (a.checked ? (i.selectedIds.add(d), r.classList.add("ln-row-selected")) : (i.selectedIds.delete(d), r.classList.remove("ln-row-selected")), i.selectedCount = i.selectedIds.size, i._updateSelectAll(), i._updateFooter(), S(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const u = document.createElement("input");
      u.type = "checkbox", u.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(u), this._selectAllCheckbox = u;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const u = i._selectAllCheckbox.checked, a = i.tbody ? i.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let r = 0; r < a.length; r++) {
        const d = a[r].getAttribute("data-ln-table-row-id"), g = a[r].querySelector("[data-ln-table-row-select]");
        d != null && (u ? (i.selectedIds.add(d), a[r].classList.add("ln-row-selected")) : (i.selectedIds.delete(d), a[r].classList.remove("ln-row-selected")), g && (g.checked = u));
      }
      i.selectedCount = i.selectedIds.size, S(i.dom, "ln-table:select-all", {
        table: i.name,
        selected: u
      }), S(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let a = 0; a < u.length; a++) {
        const r = u[a].querySelector("[data-ln-table-row-select]"), d = u[a].getAttribute("data-ln-table-row-id");
        r && r.checked && d != null && (this.selectedIds.add(d), u[a].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, e.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const i = this.dom.querySelector("[data-ln-table-col-select]");
    if (i) {
      const u = i.querySelector('input[type="checkbox"]');
      u && u.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let a = 0; a < u.length; a++) {
        u[a].classList.remove("ln-row-selected");
        const r = u[a].querySelector("[data-ln-table-row-select]");
        r && (r.checked = !1);
      }
    }
    this._updateFooter();
  }, e.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const i = this._lastTotal != null ? this._lastTotal : this._data.length, u = this.visibleCount, a = u < i;
    if (this._totalSpan && (this._totalSpan.textContent = t(i)), this._filteredSpan && (this._filteredSpan.textContent = a ? t(u) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !a), this._selectedSpan) {
      const r = this.selectedIds.size;
      this._selectedSpan.textContent = r > 0 ? t(r) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, e.prototype._focusRow = function(i) {
    for (let u = 0; u < i.length; u++)
      i[u].classList.remove("ln-row-focused"), i[u].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const u = i[this._focusedRowIndex];
      u.classList.add("ln-row-focused"), u.setAttribute("tabindex", "0"), u.focus(), u.scrollIntoView({ block: "nearest" });
    }
  }, e.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter)) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, B(h, c, e, "ln-table");
})();
(function() {
  const h = "data-ln-list", c = "lnList", _ = "data-ln-list-empty";
  if (window[c] !== void 0) return;
  function f(t) {
    let o = t;
    for (; o && o !== document.body && o !== document.documentElement; ) {
      const i = getComputedStyle(o).overflowY;
      if (i === "auto" || i === "scroll") return o;
      o = o.parentElement;
    }
    return null;
  }
  function n(t) {
    if (!t) return 0;
    const o = getComputedStyle(t), e = parseFloat(o.marginTop) || 0, i = parseFloat(o.marginBottom) || 0;
    return t.offsetHeight + e + i;
  }
  function s(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const o = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== t ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== t ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(e) {
      const i = e.detail || {};
      o._data = i.data || [], o._lastTotal = i.total != null ? i.total : o._data.length, o._lastFiltered = i.filtered != null ? i.filtered : o._data.length, o.totalCount = o._lastTotal, o.visibleCount = o._lastFiltered, o.isLoaded = !0, t.classList.remove("ln-list--loading"), o._vStart = -1, o._vEnd = -1, o._applyFilterAndSort(), o._render(), o._updateFooter(), S(t, "ln-list:rendered", {
        list: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(e) {
      const i = e.detail && e.detail.loading;
      t.classList.toggle("ln-list--loading", !!i), i && (o.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(e) {
      (e.target.closest("[data-ln-list-clear-all]") || e.target.closest("[data-ln-data-list-clear-all]")) && (o.currentFilters = {}, S(t, "ln-list:clear-filters", { list: o.name }), o._requestData());
    }, t.addEventListener("click", this._onClearAll), this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(e) {
      if (e.target.closest("[data-ln-item-select]") || e.target.closest("[data-ln-item-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const i = e.target.closest("[data-ln-item]");
      if (!i) return;
      const u = i.getAttribute("data-ln-item-id"), a = i._lnRecord || {};
      S(t, "ln-list:item-click", {
        list: o.name,
        id: u,
        record: a
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(e) {
      const i = e.target.closest("[data-ln-item-action]");
      if (!i) return;
      e.stopPropagation();
      const u = i.closest("[data-ln-item]");
      if (!u) return;
      const a = i.getAttribute("data-ln-item-action"), r = u.getAttribute("data-ln-item-id"), d = u._lnRecord || {};
      S(t, "ln-list:item-action", {
        list: o.name,
        id: r,
        action: a,
        record: d
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(e) {
      e.preventDefault(), o.currentSearch = e.detail.term, S(t, "ln-list:search", {
        list: o.name,
        query: o.currentSearch
      }), o._requestData();
    }, t.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), S(t, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      o.tbody.children.length > 0 && (o._emptyObserver.disconnect(), o._emptyObserver = null, o._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(e) {
      e.preventDefault(), o._searchTerm = e.detail.term, o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), S(t, "ln-list:filter", {
        term: o._searchTerm,
        matched: o._filteredData.length,
        total: o._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onClear = function(e) {
      if (!e.target.closest("[data-ln-list-clear]")) return;
      o._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (u) {
        const a = u.tagName === "INPUT" ? u : u.querySelector("input");
        a && (a.value = "");
      }
      o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), S(t, "ln-list:filter", {
        term: "",
        matched: o._filteredData.length,
        total: o._data.length
      });
    }, t.addEventListener("click", this._onClear)), this;
  }
  s.prototype._parseChildren = function() {
    const t = Array.from(this.tbody.children).filter((o) => !o.classList.contains("ln-list__spacer"));
    this._data = [], t.length > 0 && (this._itemHeight = n(t[0]) || 50);
    for (let o = 0; o < t.length; o++) {
      const e = t[o], i = e.getAttribute("data-ln-item-id") || e.getAttribute("id"), u = e.textContent.trim().toLowerCase();
      let a = null;
      if (this.isDataDriven) {
        a = {}, i != null && (a.id = i);
        const r = e.querySelectorAll("[data-ln-list-field]");
        for (let d = 0; d < r.length; d++) {
          const g = r[d], l = g.getAttribute("data-ln-list-field");
          l && (a[l] = g.textContent.trim());
        }
      }
      this._data.push({
        html: e.outerHTML,
        searchText: u,
        id: i,
        ...a
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, s.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), o = this.currentFilters || {}, e = Object.keys(o).length > 0;
      if (this._filteredData = this._data.filter(function(r) {
        if (t) {
          let d = !1;
          for (const g in r)
            if (r.hasOwnProperty(g) && typeof r[g] == "string" && g !== "html" && g !== "searchText" && r[g].toLowerCase().indexOf(t) !== -1) {
              d = !0;
              break;
            }
          if (!d) return !1;
        }
        if (e)
          for (const d in o) {
            const g = o[d];
            if (g && g.length > 0) {
              const l = r[d], b = l != null ? String(l) : "";
              if (g.indexOf(b) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, u = this.currentSort.direction === "desc" ? -1 : 1, a = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(r, d) {
        return r < d ? -1 : r > d ? 1 : 0;
      };
      this._filteredData.sort(function(r, d) {
        const g = r[i], l = d[i];
        if (typeof g == "number" && typeof l == "number")
          return (g - l) * u;
        const b = g != null ? String(g) : "", v = l != null ? String(l) : "";
        return a(b, v) * u;
      });
    } else {
      const t = this._searchTerm;
      t ? this._filteredData = this._data.filter(function(o) {
        return o.searchText.indexOf(t) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, s.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const t = this._lastTotal, o = this.visibleCount;
        if (t === 0 || this._filteredData.length === 0 || o === 0) {
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
      const t = this._filteredData, o = document.createDocumentFragment();
      for (let e = 0; e < t.length; e++) {
        const i = this._buildItem(t[e]);
        if (!i) break;
        o.appendChild(i);
      }
      this.tbody.textContent = "", this.tbody.appendChild(o), this._selectable && this._updateSelectAll();
    } else {
      const t = [], o = this._filteredData;
      for (let e = 0; e < o.length; e++) t.push(o[e].html);
      this.tbody.innerHTML = t.join("");
    }
  }, s.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), o = t.gridTemplateColumns;
    let e = 1;
    if (o && o !== "none") {
      const u = o.trim().split(/\s+/).filter(Boolean);
      u.length > 0 && (e = u.length);
    }
    const i = parseFloat(t.rowGap);
    return { columns: e, rowGap: isNaN(i) ? 0 : i };
  }, s.prototype._measureItemHeight = function() {
    if (this.isDataDriven) {
      if (this._data.length > 0) {
        const t = this._buildItem(this._data[0]);
        t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._itemHeight = n(t) || 50, this.tbody.textContent = "");
      }
    } else {
      const t = this.tbody.children;
      t.length > 0 && (this._itemHeight = n(t[0]) || 50);
    }
  }, s.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = f(this.dom);
    const o = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      t._itemHeight = 0, t._measureItemHeight(), t._vStart = -1, t._vEnd = -1, t._renderVirtual();
    }, o.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const t = this._filteredData, o = t.length, e = this._itemHeight;
    if (!e || !o) return;
    const i = this._scrollContainer;
    let u, a;
    if (i) {
      const O = this.tbody.getBoundingClientRect(), D = i.getBoundingClientRect(), F = i === this.tbody ? 0 : O.top - D.top + i.scrollTop;
      u = i.scrollTop - F, a = i.clientHeight;
    } else {
      const D = this.tbody.getBoundingClientRect().top + window.scrollY;
      u = window.scrollY - D, a = window.innerHeight;
    }
    const r = this._readGridLayout(), d = r.columns, g = r.rowGap, l = e + g, b = Math.ceil(o / d);
    let v = Math.max(0, Math.floor(u / l) - 15);
    v = Math.min(v, b);
    const E = Math.ceil(a / l) + 30, A = Math.min(v + E, b), w = Math.min(v * d, o), C = Math.min(A * d, o);
    if (w === this._vStart && C === this._vEnd) return;
    this._vStart = w, this._vEnd = C;
    const x = v * l, R = (b - A) * l;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (x > 0) {
        const D = document.createElement(this.isUl ? "li" : "div");
        D.className = "ln-list__spacer", D.style.height = x + "px", O.appendChild(D);
      }
      for (let D = w; D < C; D++) {
        const F = this._buildItem(t[D]);
        F && O.appendChild(F);
      }
      if (R > 0) {
        const D = document.createElement(this.isUl ? "li" : "div");
        D.className = "ln-list__spacer", D.style.height = R + "px", O.appendChild(D);
      }
      this.tbody.textContent = "", this.tbody.appendChild(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      x > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${x}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let D = w; D < C; D++)
        O += t[D].html;
      R > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${R}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = O;
    }
  }, s.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const o = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount, i = this.currentSearch && (e < o || e === 0), u = i ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = dt(this.dom, u, "ln-list"), !t) {
        const a = this.dom.querySelector("template[data-ln-empty]");
        if (a) {
          const r = i ? "search" : "initial", d = a.content.querySelector(`[data-ln-empty-when="${r}"]`) || a.content.firstElementChild;
          d && (t = document.importNode(d, !0));
        }
      }
    } else {
      const o = this.dom.querySelector(`template[${_}]`);
      o && (t = document.importNode(o.content, !0));
    }
    if (t)
      if (t.tagName === "LI" || t.tagName === "TR")
        this.tbody.appendChild(t);
      else {
        const o = document.createElement(this.isUl ? "li" : "div");
        o.appendChild(t), this.tbody.appendChild(o);
      }
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, s.prototype._buildItem = function(t) {
    const o = dt(this.dom, this.name + "-row", "ln-list");
    if (!o) return null;
    const e = o.querySelector("[data-ln-item]") || o.firstElementChild;
    if (!e) return null;
    if (yt(e, t), X(e, t), e._lnRecord = t, t.id != null && (e.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      e.classList.add("ln-item-selected");
      const i = e.querySelector("[data-ln-item-select]");
      i && (i.checked = !0);
    }
    return e;
  }, s.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(o) {
      const e = o.target.closest("[data-ln-item-select]");
      if (!e) return;
      const i = e.closest("[data-ln-item]");
      if (!i) return;
      const u = i.getAttribute("data-ln-item-id");
      u != null && (e.checked ? (t.selectedIds.add(String(u)), i.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(u)), i.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), S(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const o = t._selectAllCheckbox.checked, e = t.tbody.querySelectorAll("[data-ln-item]");
      for (let i = 0; i < e.length; i++) {
        const u = e[i], a = u.getAttribute("data-ln-item-id"), r = u.querySelector("[data-ln-item-select]");
        a != null && (o ? (t.selectedIds.add(String(a)), u.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(a)), u.classList.remove("ln-item-selected")), r && (r.checked = o));
      }
      S(t.dom, "ln-list:select-all", { list: t.name, selected: o }), S(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, s.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    let o = t.length > 0;
    for (let e = 0; e < t.length; e++) {
      const i = t[e].getAttribute("data-ln-item-id");
      if (i != null && !this.selectedIds.has(String(i))) {
        o = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = o;
  }, s.prototype._requestData = function() {
    Kt(this, "ln-list:request-data", "list");
  }, s.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const t = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount, e = o < t;
    if (this._totalSpan && (this._totalSpan.textContent = t), this._filteredSpan && (this._filteredSpan.textContent = e ? o : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const i = this.selectedIds.size;
      this._selectedSpan.textContent = i > 0 ? i : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, B(h, c, s, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", c = "lnCircularProgress";
  if (window[c] !== void 0) return;
  const _ = "http://www.w3.org/2000/svg", m = 36, p = 16, f = 2 * Math.PI * p;
  function n(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), o.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  n.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[c]);
  };
  function s(i, u) {
    const a = document.createElementNS(_, i);
    for (const r in u)
      a.setAttribute(r, u[r]);
    return a;
  }
  function t() {
    this.svg = s("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: m / 2,
      cy: m / 2,
      r: p,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: m / 2,
      cy: m / 2,
      r: p,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": f,
      "stroke-dashoffset": f,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const i = this, u = new MutationObserver(function(a) {
      for (const r of a)
        (r.attributeName === "data-ln-circular-progress" || r.attributeName === "data-ln-circular-progress-max") && e.call(i);
    });
    u.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = u;
  }
  function e() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, u = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let a = u > 0 ? i / u * 100 : 0;
    a < 0 && (a = 0), a > 100 && (a = 100);
    const r = f - a / 100 * f;
    this.progressCircle.setAttribute("stroke-dashoffset", r);
    const d = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = d !== null ? d : Math.round(a) + "%", S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: u,
      percentage: a
    });
  }
  B(h, c, n, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", c = "lnSortable", _ = "data-ln-sortable-handle";
  if (window[c] !== void 0) return;
  function m(f) {
    this.dom = f, this.isEnabled = f.getAttribute(h) !== "disabled", this._dragging = null, f.setAttribute("aria-roledescription", "sortable list");
    const n = this;
    return this._onPointerDown = function(s) {
      n.isEnabled && n._handlePointerDown(s);
    }, f.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, m.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, m.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[c]);
  }, m.prototype._handlePointerDown = function(f) {
    let n = f.target.closest("[" + _ + "]"), s;
    if (n) {
      for (s = n; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + _ + "]")) return;
      for (s = f.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      n = s;
    }
    const o = Array.from(this.dom.children).indexOf(s);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: o
    }).defaultPrevented) return;
    f.preventDefault(), n.setPointerCapture(f.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: o
    });
    const i = this, u = function(r) {
      i._handlePointerMove(r);
    }, a = function(r) {
      i._handlePointerEnd(r), n.removeEventListener("pointermove", u), n.removeEventListener("pointerup", a), n.removeEventListener("pointercancel", a);
    };
    n.addEventListener("pointermove", u), n.addEventListener("pointerup", a), n.addEventListener("pointercancel", a);
  }, m.prototype._handlePointerMove = function(f) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), s = this._dragging;
    for (const t of n)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of n) {
      if (t === s) continue;
      const o = t.getBoundingClientRect(), e = o.top + o.height / 2;
      if (f.clientY >= o.top && f.clientY < e) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (f.clientY >= e && f.clientY <= o.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(f) {
    if (!this._dragging) return;
    const n = this._dragging, s = Array.from(this.dom.children), t = s.indexOf(n);
    let o = null, e = null;
    for (const i of s) {
      if (i.classList.contains("ln-sortable--drop-before")) {
        o = i, e = "before";
        break;
      }
      if (i.classList.contains("ln-sortable--drop-after")) {
        o = i, e = "after";
        break;
      }
    }
    for (const i of s)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== n) {
      e === "before" ? this.dom.insertBefore(n, o) : this.dom.insertBefore(n, o.nextElementSibling);
      const u = Array.from(this.dom.children).indexOf(n);
      S(this.dom, "ln-sortable:reordered", {
        item: n,
        oldIndex: t,
        newIndex: u
      });
    }
    this._dragging = null;
  };
  function p(f) {
    const n = f[c];
    if (!n) return;
    const s = f.getAttribute(h) !== "disabled";
    s !== n.isEnabled && (n.isEnabled = s, S(f, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: f }));
  }
  B(h, c, m, "ln-sortable", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-confirm", c = "lnConfirm", _ = "data-ln-confirm-timeout";
  if (window[c] !== void 0) return;
  function p(...n) {
    (document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) && console.warn("[ln-confirm]", ...n);
  }
  function f(n) {
    p("constructor called on", n), this.dom = n, this.confirming = !1, this.originalText = n.textContent.trim(), this.confirmText = n.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const s = this;
    return this._onClick = function(t) {
      if (p("click handler, confirming:", s.confirming, "submitted:", s._submitted, "target:", t.target), !s.confirming)
        t.preventDefault(), t.stopImmediatePropagation(), s._enterConfirm();
      else {
        if (s._submitted) return;
        s._submitted = !0, s._reset();
      }
    }, n.addEventListener("click", this._onClick), this;
  }
  f.prototype._getTimeout = function() {
    const n = parseFloat(this.dom.getAttribute(_));
    return isNaN(n) || n <= 0 ? 3 : n;
  }, f.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var n = this.dom.querySelector("svg.ln-icon use");
    n && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = n.getAttribute("href"), n.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, f.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const n = this, s = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      n._reset();
    }, s);
  }, f.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var n = this.dom.querySelector("svg.ln-icon use");
      n && this.originalIconHref && n.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, f.prototype.destroy = function() {
    p("destroy called on", this.dom), this.dom[c] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[c]);
  }, B(h, c, f, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", c = "lnTranslations";
  if (window[c] !== void 0) return;
  const _ = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(p) {
    this.dom = p, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = p.getAttribute(h + "-default") || "", this.badgesEl = p.querySelector("[" + h + "-active]"), this.menuEl = p.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const f = p.getAttribute(h + "-locales");
    if (this.locales = _, f)
      try {
        this.locales = JSON.parse(f);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const n = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && n.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && n.removeLanguage(s.detail.lang);
    }, p.addEventListener("ln-translations:request-add", this._onRequestAdd), p.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of p) {
      const n = f.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of n)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, m.prototype._detectExisting = function() {
    const p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const f of p) {
      const n = f.getAttribute("data-ln-translatable-lang");
      n && n !== this.defaultLang && this.activeLanguages.add(n);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, m.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const p = this;
    let f = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      f++;
      const t = wt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const o = t.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", s), o.textContent = this.locales[s], o.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.menuEl.getAttribute("data-ln-toggle") === "open" && p.menuEl.setAttribute("data-ln-toggle", "close"), p.addLanguage(s));
      }), this.menuEl.appendChild(t);
    }
    const n = this.dom.querySelector("[" + h + "-add]");
    n && (n.style.display = f === 0 ? "none" : "");
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const p = this;
    this.activeLanguages.forEach(function(f) {
      const n = wt("ln-translations-badge", "ln-translations");
      if (!n) return;
      const s = n.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", f);
      const t = s.querySelector("span");
      t.textContent = p.locales[f] || f.toUpperCase();
      const o = s.querySelector("button");
      o.setAttribute("aria-label", "Remove " + (p.locales[f] || f.toUpperCase())), o.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.removeLanguage(f));
      }), p.badgesEl.appendChild(n);
    });
  }, m.prototype.addLanguage = function(p, f) {
    if (this.activeLanguages.has(p)) return;
    const n = this.locales[p] || p;
    if (z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: p,
      langName: n
    }).defaultPrevented) return;
    this.activeLanguages.add(p), f = f || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of t) {
      const e = o.getAttribute("data-ln-translatable"), i = o.getAttribute("data-ln-translations-prefix") || "", u = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!u) continue;
      const a = u.cloneNode(!1);
      i ? a.name = i + "[trans][" + p + "][" + e + "]" : a.name = "trans[" + p + "][" + e + "]", a.value = f[e] !== void 0 ? f[e] : "", a.removeAttribute("id"), a.placeholder = n + " translation", a.setAttribute("data-ln-translatable-lang", p);
      const r = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), d = r.length > 0 ? r[r.length - 1] : u;
      d.parentNode.insertBefore(a, d.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: p,
      langName: n
    });
  }, m.prototype.removeLanguage = function(p) {
    if (!this.activeLanguages.has(p) || z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: p
    }).defaultPrevented) return;
    const n = this.dom.querySelectorAll('[data-ln-translatable-lang="' + p + '"]');
    for (const s of n)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(p), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: p
    });
  }, m.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, m.prototype.hasLanguage = function(p) {
    return this.activeLanguages.has(p);
  }, m.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const p = this.defaultLang, f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of f)
      n.getAttribute("data-ln-translatable-lang") !== p && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[c];
  }, B(h, c, m, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", c = "lnAutosave", _ = "data-ln-autosave-clear", m = "data-ln-autosave-debounce-input", p = "ln-autosave:";
  if (window[c] !== void 0) return;
  function n(e) {
    const i = s(e);
    if (!i) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = i;
    let u = null;
    function a() {
      const l = Vt(e);
      try {
        localStorage.setItem(i, JSON.stringify(l));
      } catch {
        return;
      }
      S(e, "ln-autosave:saved", { target: e, data: l });
    }
    function r() {
      let l;
      try {
        l = localStorage.getItem(i);
      } catch {
        return;
      }
      if (!l) return;
      let b;
      try {
        b = JSON.parse(l);
      } catch {
        return;
      }
      if (z(e, "ln-autosave:before-restore", { target: e, data: b }).defaultPrevented) return;
      const E = Wt(e, b);
      for (let A = 0; A < E.length; A++)
        E[A].dispatchEvent(new Event("input", { bubbles: !0 })), E[A].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(e, "ln-autosave:restored", { target: e, data: b });
    }
    function d() {
      try {
        localStorage.removeItem(i);
      } catch {
        return;
      }
      S(e, "ln-autosave:cleared", { target: e });
    }
    this._onFocusout = function(l) {
      const b = l.target;
      t(b) && b.name && a();
    }, this._onChange = function(l) {
      const b = l.target;
      t(b) && b.name && a();
    }, this._onSubmit = function() {
      d();
    }, this._onReset = function() {
      d();
    }, this._onClearClick = function(l) {
      l.target.closest("[" + _ + "]") && d();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick);
    const g = o(e);
    return g > 0 && (this._onInput = function(l) {
      const b = l.target;
      !t(b) || !b.name || (u !== null && clearTimeout(u), u = setTimeout(a, g));
    }, e.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, r(), this;
  }
  n.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const e = this._getInputTimer();
        e !== null && clearTimeout(e);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[c];
    }
  };
  function s(e) {
    const u = e.getAttribute(h) || e.id;
    return u ? p + window.location.pathname + ":" + u : null;
  }
  function t(e) {
    const i = e.tagName;
    return i === "INPUT" || i === "TEXTAREA" || i === "SELECT";
  }
  function o(e) {
    if (!e.hasAttribute(m)) return 0;
    const i = e.getAttribute(m);
    if (i === "" || i === null) return 1e3;
    const u = parseInt(i, 10);
    return isNaN(u) || u < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", e), 1e3) : u;
  }
  B(h, c, n, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", c = "lnAutoresize";
  if (window[c] !== void 0) return;
  function _(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  _.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, _.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[c]);
  }, B(h, c, _, "ln-autoresize");
})();
(function() {
  const h = "data-ln-editor", c = "lnEditor";
  if (window[c] !== void 0) return;
  var _ = {
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
  }, m = {
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
  function n(r) {
    this.dom = r;
    var d = this;
    if (this._textarea = r.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", r), this;
    var g = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), g && this._surface.setAttribute("data-placeholder", g);
    var l = this._textarea.id;
    if (l) {
      var b = r.querySelector('label[for="' + l + '"]');
      b && (b.id || (b.id = l + "-label"), this._surface.setAttribute("aria-labelledby", b.id));
    }
    var v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    var E = r.querySelector("nav");
    return E && E.nextSibling ? r.insertBefore(this._surface, E.nextSibling) : r.appendChild(this._surface), this._onInput = function() {
      d._syncToTextarea(), S(d.dom, "ln-editor:changed", {
        html: d._textarea.value,
        target: d.dom
      });
    }, this._onMousedownToolbar = function(A) {
      var w = A.target.closest("[data-ln-editor-action]");
      w && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      var w = A.target.closest("[data-ln-editor-action]");
      if (w) {
        var C = w.getAttribute("data-ln-editor-action");
        d._execAction(C);
      }
    }, this._onPaste = function(A) {
      o(d, A);
    }, this._onKeydown = function(A) {
      u(d, A);
    }, this._onSelectionChange = function() {
      d._updateActiveStates();
    }, this._onFocus = function() {
      S(d.dom, "ln-editor:focus", { target: d.dom });
    }, this._onBlur = function() {
      d._syncToTextarea(), S(d.dom, "ln-editor:blur", { target: d.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      var w = A.detail && A.detail.html;
      w !== void 0 && (d._surface.innerHTML = w, d._syncToTextarea());
    }, r.addEventListener("ln-editor:set-content", this._onSetContent), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(r) {
    if (r) {
      var d = z(this.dom, "ln-editor:before-change", {
        action: r,
        target: this.dom
      });
      if (!d.defaultPrevented) {
        if (this._surface.focus(), m[r])
          document.execCommand(m[r], !1, null);
        else if (p[r]) {
          var g = p[r], l = s(this._surface);
          l && l.toLowerCase() === g ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + g + ">");
        } else f[r] ? document.execCommand(f[r], !1, null) : r === "link" ? a(this) : r === "unlink" ? document.execCommand("unlink", !1, null) : r === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
        this._syncToTextarea(), this._updateActiveStates(), S(this.dom, "ln-editor:changed", {
          html: this._textarea.value,
          target: this.dom
        });
      }
    }
  }, n.prototype._updateActiveStates = function() {
    var r = this.dom.querySelector("nav");
    if (r) {
      var d = window.getSelection();
      if (!(!d || d.rangeCount === 0)) {
        var g = d.anchorNode;
        if (!(!g || !this._surface.contains(g)))
          for (var l = r.querySelectorAll("[data-ln-editor-action]"), b = 0; b < l.length; b++) {
            var v = l[b], E = v.getAttribute("data-ln-editor-action"), A = !1;
            if (m[E])
              try {
                A = document.queryCommandState(m[E]);
              } catch {
              }
            else if (p[E]) {
              var w = s(this._surface);
              A = w && w.toLowerCase() === p[E];
            } else if (f[E])
              try {
                A = document.queryCommandState(f[E]);
              } catch {
              }
            else E === "link" && (A = !!t(d.anchorNode, "A", this._surface));
            A ? v.classList.add("ln-editor-active") : v.classList.remove("ln-editor-active");
          }
      }
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(r) {
    this._surface && (this._surface.innerHTML = r, this._syncToTextarea());
  }, n.prototype.destroy = function() {
    if (this.dom[c]) {
      this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
      var r = this.dom.querySelector("nav");
      r && (r.removeEventListener("mousedown", this._onMousedownToolbar), r.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
      var d = this.dom.querySelector(".ln-editor__link-popover");
      d && d.remove(), S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[c];
    }
  };
  function s(r) {
    var d = window.getSelection();
    if (!d || d.rangeCount === 0) return null;
    var g = d.anchorNode;
    if (!g) return null;
    for (; g && g !== r; ) {
      if (g.nodeType === 1) {
        var l = g.tagName;
        if (l === "H2" || l === "H3" || l === "H4" || l === "BLOCKQUOTE" || l === "PRE" || l === "P")
          return l;
      }
      g = g.parentNode;
    }
    return null;
  }
  function t(r, d, g) {
    for (; r && r !== g; ) {
      if (r.nodeType === 1 && r.tagName === d)
        return r;
      r = r.parentNode;
    }
    return null;
  }
  function o(r, d) {
    d.preventDefault();
    var g = "";
    if (d.clipboardData && (g = d.clipboardData.getData("text/html"), !g)) {
      var l = d.clipboardData.getData("text/plain");
      l && (g = l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), g = "<p>" + g + "</p>");
    }
    if (g) {
      var b = e(g);
      b && document.execCommand("insertHTML", !1, b);
    }
  }
  function e(r) {
    var d = document.createElement("div");
    return d.innerHTML = r, i(d), d.innerHTML;
  }
  function i(r) {
    for (var d = Array.from(r.childNodes), g = 0; g < d.length; g++) {
      var l = d[g];
      if (l.nodeType !== 3) {
        if (l.nodeType !== 1) {
          r.removeChild(l);
          continue;
        }
        if (_[l.tagName]) {
          for (var b = Array.from(l.attributes), v = 0; v < b.length; v++) {
            var E = b[v].name;
            if (l.tagName === "A" && E === "href") {
              var A = l.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || l.removeAttribute("href");
            } else
              l.removeAttribute(E);
          }
          l.tagName === "A" && l.setAttribute("rel", "noopener noreferrer"), i(l);
        } else {
          for (; l.firstChild; )
            r.insertBefore(l.firstChild, l);
          r.removeChild(l);
        }
      }
    }
  }
  function u(r, d) {
    if (d.ctrlKey || d.metaKey) {
      var g = null;
      switch (d.key.toLowerCase()) {
        case "b":
          g = "bold";
          break;
        case "i":
          g = "italic";
          break;
        case "u":
          g = "underline";
          break;
        case "k":
          g = "link";
          break;
      }
      g && (d.preventDefault(), r._execAction(g));
    }
  }
  function a(r) {
    var d = window.getSelection();
    if (!d || d.rangeCount === 0) return;
    var g = t(d.anchorNode, "A", r._surface), l = d.getRangeAt(0).cloneRange(), b = r.dom.querySelector(".ln-editor__link-popover");
    b && b.remove();
    var v = document.createElement("div");
    v.className = "ln-editor__link-popover";
    var E = document.createElement("input");
    E.type = "url", E.placeholder = "https://…", g && (E.value = g.getAttribute("href") || "");
    var A = document.createElement("button");
    A.type = "button", A.innerHTML = '<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-check"></use></svg>', A.setAttribute("aria-label", "Confirm");
    var w = document.createElement("button");
    w.type = "button", w.innerHTML = '<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>', w.setAttribute("aria-label", "Cancel"), v.appendChild(E), v.appendChild(A), v.appendChild(w);
    var C = r.dom.querySelector("nav");
    C ? C.after(v) : r.dom.insertBefore(v, r._surface), E.focus();
    function x() {
      var D = window.getSelection();
      D.removeAllRanges(), D.addRange(l);
    }
    function R() {
      var D = E.value.trim();
      if (v.remove(), x(), r._surface.focus(), D)
        if (g)
          g.setAttribute("href", D);
        else {
          document.execCommand("createLink", !1, D);
          var F = window.getSelection();
          if (F && F.anchorNode) {
            var U = t(F.anchorNode, "A", r._surface);
            U && U.setAttribute("rel", "noopener noreferrer");
          }
        }
      else g && document.execCommand("unlink", !1, null);
      r._syncToTextarea(), S(r.dom, "ln-editor:changed", {
        html: r._textarea.value,
        target: r.dom
      });
    }
    function O() {
      v.remove(), x(), r._surface.focus();
    }
    A.addEventListener("click", R), w.addEventListener("click", O), E.addEventListener("keydown", function(D) {
      D.key === "Enter" ? (D.preventDefault(), R()) : D.key === "Escape" && (D.preventDefault(), O());
    });
  }
  B(h, c, n, "ln-editor");
})();
(function() {
  const h = "data-ln-validate", c = "lnValidate", _ = "data-ln-validate-errors", m = "data-ln-validate-error", p = "ln-validate-valid", f = "ln-validate-invalid", n = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[c] !== void 0) return;
  function s(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, e = t.tagName, i = t.type, u = e === "SELECT" || i === "checkbox" || i === "radio";
    return this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(a) {
      const r = a.detail && a.detail.error;
      if (!r) return;
      o._customErrors.add(r), o._touched = !0;
      const d = t.closest(".form-element");
      if (d) {
        const g = d.querySelector("[" + m + '="' + r + '"]');
        g && g.classList.remove("hidden");
      }
      t.classList.remove(p), t.classList.add(f);
    }, this._onClearCustom = function(a) {
      const r = a.detail && a.detail.error, d = t.closest(".form-element");
      if (r) {
        if (o._customErrors.delete(r), d) {
          const g = d.querySelector("[" + m + '="' + r + '"]');
          g && g.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(g) {
          if (d) {
            const l = d.querySelector("[" + m + '="' + g + '"]');
            l && l.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, u || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  s.prototype.validate = function() {
    const t = this.dom, o = t.validity, i = t.checkValidity() && this._customErrors.size === 0, u = t.closest(".form-element");
    if (u) {
      const r = u.querySelector("[" + _ + "]");
      if (r) {
        const d = r.querySelectorAll("[" + m + "]");
        for (let g = 0; g < d.length; g++) {
          const l = d[g].getAttribute(m), b = n[l];
          b && (o[b] ? d[g].classList.remove("hidden") : d[g].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(p, i), t.classList.toggle(f, !i), S(t, i ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), i;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, f);
    const t = this.dom.closest(".form-element");
    if (t) {
      const o = t.querySelectorAll("[" + m + "]");
      for (let e = 0; e < o.length; e++)
        o[e].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(p, f), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, s, "ln-validate");
})();
(function() {
  const h = "data-ln-form", c = "lnForm", _ = "data-ln-form-auto", m = "data-ln-form-debounce", p = "data-ln-form-typed", f = "data-ln-validate", n = "lnValidate", s = "data-ln-form-action-edit", t = "data-ln-form-action-method";
  if (window[c] !== void 0) return;
  function o(e) {
    this.dom = e, this._debounceTimer = null, this._baseAction = e.getAttribute("action") || "";
    const i = this;
    if (this._onValid = function() {
      i._updateSubmitButton();
    }, this._onInvalid = function() {
      i._updateSubmitButton();
    }, this._onSubmit = function(u) {
      u.preventDefault(), i.submit();
    }, this._onFill = function(u) {
      u.detail && i.fill(u.detail);
    }, this._onLnFill = function(u) {
      u.target === i.dom && (u.detail ? i.fill(u.detail) : i.reset(), i._applyActionMode(u.detail));
    }, this._onFormReset = function() {
      i.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        i._resetValidation();
      }, 0);
    }, e.addEventListener("ln-validate:valid", this._onValid), e.addEventListener("ln-validate:invalid", this._onInvalid), e.addEventListener("submit", this._onSubmit), e.addEventListener("ln-form:fill", this._onFill), e.addEventListener("ln-form:reset", this._onFormReset), e.addEventListener("ln-fill", this._onLnFill), e.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, e.hasAttribute(_)) {
      const u = parseInt(e.getAttribute(m)) || 0;
      this._onAutoInput = function() {
        u > 0 ? (clearTimeout(i._debounceTimer), i._debounceTimer = setTimeout(function() {
          i.submit();
        }, u)) : i.submit();
      }, e.addEventListener("input", this._onAutoInput), e.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  o.prototype._updateSubmitButton = function() {
    const e = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!e.length) return;
    const i = this.dom.querySelectorAll("[" + f + "]");
    let u = !1;
    if (i.length > 0) {
      let a = !1, r = !1;
      for (let d = 0; d < i.length; d++) {
        const g = i[d][n];
        g && g._touched && (a = !0), i[d].checkValidity() || (r = !0);
      }
      u = r || !a;
    }
    for (let a = 0; a < e.length; a++)
      e[a].disabled = u;
  }, o.prototype.fill = function(e) {
    const i = Wt(this.dom, e);
    for (let u = 0; u < i.length; u++) {
      const a = i[u], r = a.tagName === "SELECT" || a.type === "checkbox" || a.type === "radio";
      a.dispatchEvent(new Event(r ? "change" : "input", { bubbles: !0 }));
    }
  }, o.prototype.submit = function() {
    const e = this.dom.querySelectorAll("[" + f + "]");
    let i = !0;
    for (let a = 0; a < e.length; a++) {
      const r = e[a][n];
      r && (r.validate() || (i = !1));
    }
    if (!i) return;
    const u = Vt(this.dom, { typed: this.dom.hasAttribute(p) });
    S(this.dom, "ln-form:submit", { data: u });
  }, o.prototype.reset = function() {
    this.dom.reset();
    const e = this.dom.querySelectorAll("input, textarea, select");
    for (let i = 0; i < e.length; i++) {
      const u = e[i], a = u.tagName === "SELECT" || u.type === "checkbox" || u.type === "radio";
      u.dispatchEvent(new Event(a ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), S(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, o.prototype._resetValidation = function() {
    const e = this.dom.querySelectorAll("[" + f + "]");
    for (let i = 0; i < e.length; i++) {
      const u = e[i][n];
      u && u.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      const e = this.dom.querySelectorAll("[" + f + "]");
      for (let i = 0; i < e.length; i++)
        if (!e[i].checkValidity()) return !1;
      return !0;
    }
  }), o.prototype._ensureMethodInput = function() {
    let e = this.dom.querySelector('input[name="_method"]');
    return e || (e = document.createElement("input"), e.type = "hidden", e.name = "_method", e.value = "", this.dom.appendChild(e)), e;
  }, o.prototype._applyActionMode = function(e) {
    if (!this.dom.hasAttribute(s)) return;
    const i = e && e.id != null && e.id !== "" ? e.id : null, u = this._ensureMethodInput();
    if (i !== null) {
      const a = this.dom.getAttribute(s);
      a ? this.dom.setAttribute("action", a.replace(":id", encodeURIComponent(i))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(i)), u.value = this.dom.getAttribute(t) || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), u.value = "";
  }, o.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, o, "ln-form");
})();
(function() {
  const h = "lnFill";
  if (window[h] !== void 0) return;
  const c = { lnFillForm: !0, lnFillStore: !0 };
  document.addEventListener("click", function(_) {
    if (_.ctrlKey || _.metaKey || _.button === 1) return;
    const m = _.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const p = m.getAttribute("data-ln-fill-form"), f = document.getElementById(p);
    if (!f) return;
    const n = {}, s = m.dataset;
    for (const o in s) {
      if (!o.startsWith("lnFill") || c[o]) continue;
      const e = o.slice(6);
      e && (n[e.charAt(0).toLowerCase() + e.slice(1)] = s[o]);
    }
    const t = Object.keys(n).length > 0;
    window.lnCore.lnFill(f, t ? n : null);
  }), window[h] = !0;
})();
(function() {
  const h = "lnModalFill";
  if (window[h] !== void 0) return;
  const c = { lnFillForm: !0, lnFillStore: !0 };
  function _(p) {
    const f = {}, n = p.dataset;
    for (const s in n) {
      if (!s.startsWith("lnFill") || c[s]) continue;
      const t = s.slice(6);
      t && (f[t.charAt(0).toLowerCase() + t.slice(1)] = n[s]);
    }
    return f;
  }
  function m(p, f) {
    const n = window.CSS && CSS.escape ? CSS.escape(f) : f, s = document.querySelectorAll('[data-ln-fill-id="' + n + '"]');
    if (s.length === 0) return null;
    for (let t = 0; t < s.length; t++) {
      const o = s[t].getAttribute("data-ln-fill-form");
      if (o) {
        const e = document.getElementById(o);
        if (e && p.contains(e)) return s[t];
      }
    }
    return s[0];
  }
  document.addEventListener("ln-modal:open", function(p) {
    const f = p.detail;
    if (!f) return;
    const n = f.param;
    if (n == null) return;
    const s = f.target;
    if (!s) return;
    const t = m(s, n);
    if (!t) return;
    const o = _(t);
    window.lnCore.lnFill(s, o);
  }), window[h] = !0;
})();
(function() {
  const h = "data-ln-slug-from", c = "lnSlug";
  if (window[c] !== void 0) return;
  function _(p) {
    return String(p).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function m(p) {
    if (p.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", p.tagName), this;
    const f = p.form;
    if (!f)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", p), this;
    const n = p.getAttribute(h), s = f.elements[n];
    if (!s)
      return console.warn('[ln-slug] Source field "' + n + '" not found in form:', p), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + n + '" is a RadioNodeList (same-name group) — single source field required:', p), this;
    this.dom = p, this.source = s, this._pristine = p.value === "", this._mirroring = !1;
    const t = this;
    return this._onSource = function() {
      t._pristine && t._mirror();
    }, this._onSlug = function() {
      t._mirroring || (t._pristine = t.dom.value === "");
    }, s.addEventListener("input", this._onSource), p.addEventListener("input", this._onSlug), this;
  }
  m.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = _(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, m.prototype.destroy = function() {
    this.dom[c] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[c]);
  }, B(h, c, m, "ln-slug");
})();
(function() {
  const h = "data-ln-time", c = "lnTime";
  if (window[c] !== void 0) return;
  const _ = {}, m = {};
  function p(A) {
    return A.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function f(A, w) {
    const C = (A || "") + "|" + JSON.stringify(w);
    return _[C] || (_[C] = new Intl.DateTimeFormat(A, w)), _[C];
  }
  function n(A) {
    const w = A || "";
    return m[w] || (m[w] = new Intl.RelativeTimeFormat(A, { numeric: "auto", style: "narrow" })), m[w];
  }
  const s = /* @__PURE__ */ new Set();
  let t = null;
  function o() {
    t || (t = setInterval(i, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function i() {
    for (const A of s) {
      if (!document.body.contains(A.dom)) {
        s.delete(A);
        continue;
      }
      l(A);
    }
    s.size === 0 && e();
  }
  function u(A, w) {
    return f(w, { dateStyle: "long", timeStyle: "short" }).format(A);
  }
  function a(A, w) {
    const C = /* @__PURE__ */ new Date(), x = { month: "short", day: "numeric" };
    return A.getFullYear() !== C.getFullYear() && (x.year = "numeric"), f(w, x).format(A);
  }
  function r(A, w) {
    return f(w, { dateStyle: "medium" }).format(A);
  }
  function d(A, w) {
    return f(w, { timeStyle: "short" }).format(A);
  }
  function g(A, w) {
    const C = Math.floor(Date.now() / 1e3), R = Math.floor(A.getTime() / 1e3) - C, O = Math.abs(R);
    if (O < 10) return n(w).format(0, "second");
    let D, F;
    if (O < 60)
      D = "second", F = R;
    else if (O < 3600)
      D = "minute", F = Math.round(R / 60);
    else if (O < 86400)
      D = "hour", F = Math.round(R / 3600);
    else if (O < 604800)
      D = "day", F = Math.round(R / 86400);
    else if (O < 2592e3)
      D = "week", F = Math.round(R / 604800);
    else
      return a(A, w);
    return n(w).format(F, D);
  }
  function l(A) {
    const w = A.dom.getAttribute("datetime");
    if (!w) return;
    const C = Number(w);
    if (isNaN(C)) return;
    const x = new Date(C * 1e3), R = A.dom.getAttribute(h) || "short", O = p(A.dom);
    let D;
    switch (R) {
      case "relative":
        D = g(x, O);
        break;
      case "full":
        D = u(x, O);
        break;
      case "date":
        D = r(x, O);
        break;
      case "time":
        D = d(x, O);
        break;
      default:
        D = a(x, O);
        break;
    }
    A.dom.textContent = D, R !== "full" && (A.dom.title = u(x, O));
  }
  function b(A) {
    return this.dom = A, l(this), A.getAttribute(h) === "relative" && (s.add(this), o()), this;
  }
  b.prototype.render = function() {
    l(this);
  }, b.prototype.destroy = function() {
    s.delete(this), s.size === 0 && e(), delete this.dom[c];
  };
  function v(A) {
    const w = A[c];
    if (!w) return;
    A.getAttribute(h) === "relative" ? (s.add(w), o()) : (s.delete(w), s.size === 0 && e()), l(w);
  }
  function E(A) {
    A.nodeType === 1 && A.hasAttribute && A.hasAttribute(h) && A[c] && l(A[c]);
  }
  B(h, c, b, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: E
  });
})();
(function() {
  const h = "data-ln-data-store", c = "lnDataStore";
  if (window[c] !== void 0) return;
  const _ = "ln_app_cache", m = "_meta", p = "1.0";
  let f = null, n = null;
  const s = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (L) => {
        const T = Math.random() * 16 | 0;
        return (L === "x" ? T : T & 3 | 8).toString(16);
      });
    }
  }
  function o(y) {
    y && y.name === "QuotaExceededError" && S(document, "ln-store:quota-exceeded", { error: y });
  }
  function e() {
    const y = {};
    for (const L of document.querySelectorAll(`[${h}]`)) {
      const T = L.getAttribute(h);
      if (T) {
        const k = L.getAttribute("data-ln-data-store-indexes") || L.getAttribute("data-ln-store-indexes") || "";
        y[T] = {
          indexes: k.split(",").map((I) => I.trim()).filter(Boolean)
        };
      }
    }
    return y;
  }
  function i() {
    return n || (n = new Promise((y) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), y(null);
      const L = e(), T = Object.keys(L), k = indexedDB.open(_);
      k.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), y(null);
      }, k.onsuccess = (I) => {
        const M = I.target.result, N = Array.from(M.objectStoreNames);
        if (!(!N.includes(m) || T.some((gt) => !N.includes(gt))))
          return u(M), f = M, y(M);
        const J = M.version;
        M.close();
        const tt = indexedDB.open(_, J + 1);
        tt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, tt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), y(null);
        }, tt.onupgradeneeded = (gt) => {
          const ot = gt.target.result;
          ot.objectStoreNames.contains(m) || ot.createObjectStore(m, { keyPath: "key" });
          for (const kt of T)
            if (!ot.objectStoreNames.contains(kt)) {
              const le = ot.createObjectStore(kt, { keyPath: "id" });
              for (const Bt of L[kt].indexes)
                le.createIndex(Bt, Bt, { unique: !1 });
            }
        }, tt.onsuccess = (gt) => {
          const ot = gt.target.result;
          u(ot), f = ot, y(ot);
        };
      };
    }), n);
  }
  function u(y) {
    y.onversionchange = () => {
      y.close(), f = null, n = null;
    };
  }
  function a() {
    return f ? Promise.resolve(f) : (n = null, i());
  }
  async function r(y) {
    if (!_t() || !y) return y;
    const L = { ...y }, T = L.id, k = L._pending, I = await be(L);
    return !I || !I.encrypted ? y : {
      id: T,
      _pending: k,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function d(y) {
    return !y || !y.encrypted || !_t() ? y : ve(y);
  }
  const g = (y, L) => a().then((T) => T ? T.transaction(y, L).objectStore(y) : null);
  function l(y) {
    return new Promise((L, T) => {
      y.onsuccess = () => L(y.result), y.onerror = () => {
        o(y.error), T(y.error);
      };
    });
  }
  const b = (y) => g(y, "readonly").then((L) => L ? l(L.getAll()) : []).then((L) => _t() ? Promise.all(L.map((T) => d(T))) : L), v = (y, L) => g(y, "readonly").then((T) => T ? l(T.get(L)) : null).then((T) => T ? d(T) : null), E = (y, L) => (_t() ? r(L) : Promise.resolve(L)).then((k) => g(y, "readwrite").then((I) => I ? l(I.put(k)) : null)), A = (y, L) => g(y, "readwrite").then((T) => T ? l(T.delete(L)) : null), w = (y) => g(y, "readwrite").then((L) => L ? l(L.clear()) : null), C = (y) => g(y, "readonly").then((L) => L ? l(L.count()) : 0), x = (y) => g(m, "readonly").then((L) => L ? l(L.get(y)) : null), R = (y, L) => g(m, "readwrite").then((T) => {
    if (T)
      return L.key = y, l(T.put(L));
  });
  function O(y) {
    this.dom = y, this._name = y.getAttribute(h);
    const L = y.getAttribute("data-ln-data-store-stale") || y.getAttribute("data-ln-store-stale"), T = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(T) ? 300 : T;
    const k = y.getAttribute("data-ln-data-store-search-fields") || y.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = k.split(",").map((I) => I.trim()).filter(Boolean), this._noAutosync = y.hasAttribute("data-ln-data-store-no-autosync") || y.hasAttribute("data-ln-store-no-autosync"), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, s[this._name] = this, D(this), Et(this), this;
  }
  function D(y) {
    y._handlers = {
      create: (L) => F(y, L.detail),
      update: (L) => U(y, L.detail),
      delete: (L) => Q(y, L.detail),
      "bulk-delete": (L) => Z(y, L.detail)
    };
    for (const [L, T] of Object.entries(y._handlers))
      y.dom.addEventListener(`ln-store:request-${L}`, T);
  }
  function F(y, { data: L = {} } = {}) {
    const T = `_temp_${t()}`, k = { ...L, id: T, _pending: !0 };
    E(y._name, k).then(() => {
      y.totalCount++, S(y.dom, "ln-store:created", { store: y._name, record: k, tempId: T }), S(y.dom, "ln-store:request-remote-create", { tempId: T, data: L });
    });
  }
  function U(y, { id: L, data: T = {}, expected_version: k } = {}) {
    v(y._name, L).then((I) => {
      if (!I) throw new Error(`Record not found: ${L}`);
      y._pendingSnapshots[L] = { ...I };
      const M = { ...I, ...T, _pending: !0 };
      return E(y._name, M).then(() => {
        S(y.dom, "ln-store:updated", { store: y._name, record: M, previous: y._pendingSnapshots[L] }), S(y.dom, "ln-store:request-remote-update", { id: L, data: T, expected_version: k });
      });
    }).catch((I) => console.error("[ln-data-store] Optimistic update failed:", I));
  }
  function Q(y, { id: L } = {}) {
    v(y._name, L).then((T) => {
      if (T)
        return y._pendingSnapshots[L] = { ...T }, A(y._name, L).then(() => {
          y.totalCount--, S(y.dom, "ln-store:deleted", { store: y._name, id: L }), S(y.dom, "ln-store:request-remote-delete", { id: L });
        });
    }).catch((T) => console.error("[ln-data-store] Optimistic delete failed:", T));
  }
  function Z(y, { ids: L = [] } = {}) {
    L.length && Promise.all(L.map((T) => v(y._name, T))).then((T) => {
      const k = T.filter(Boolean), I = k.map((M) => M.id);
      return y._pendingSnapshots[I.join(",")] = k, ft(y._name, I).then(() => {
        y.totalCount -= I.length, S(y.dom, "ln-store:deleted", { store: y._name, ids: I }), S(y.dom, "ln-store:request-remote-bulk-delete", { ids: I });
      });
    }).catch((T) => console.error("[ln-data-store] Optimistic bulk delete failed:", T));
  }
  function Et(y) {
    i().then(() => x(y._name)).then((L) => {
      L && L.schema_version === p ? (y.lastSyncedAt = L.last_synced_at || null, y.totalCount = L.record_count || 0, y.totalCount > 0 ? (y.isLoaded = !0, S(y.dom, "ln-store:ready", { store: y._name, count: y.totalCount, source: "cache" }), ut(y) && Y(y)) : Y(y)) : L && L.schema_version !== p ? w(y._name).then(() => R(y._name, { schema_version: p, last_synced_at: null, record_count: 0 })).then(() => Y(y)) : Y(y);
    });
  }
  function ut(y) {
    return y._staleThreshold === -1 ? !1 : y.lastSyncedAt ? Math.floor(Date.now() / 1e3) - y.lastSyncedAt > y._staleThreshold : !0;
  }
  function Y(y) {
    y.isSyncing = !0, S(y.dom, "ln-store:request-remote-sync", { since: y.lastSyncedAt });
  }
  function ht(y, L) {
    return a().then((T) => T ? (_t() ? Promise.all(L.map((I) => r(I))) : Promise.resolve(L)).then((I) => new Promise((M, N) => {
      const j = T.transaction(y, "readwrite"), J = j.objectStore(y);
      I.forEach((tt) => J.put(tt)), j.oncomplete = () => M(), j.onerror = () => {
        o(j.error), N(j.error);
      };
    })) : void 0);
  }
  function ft(y, L) {
    return a().then((T) => {
      if (T)
        return new Promise((k, I) => {
          const M = T.transaction(y, "readwrite"), N = M.objectStore(y);
          L.forEach((j) => N.delete(j)), M.oncomplete = () => k(), M.onerror = () => I(M.error);
        });
    });
  }
  let q = () => {
    document.visibilityState === "visible" && Object.values(s).forEach((y) => {
      y.isLoaded && !y.isSyncing && ut(y) && Y(y);
    });
  };
  document.addEventListener("visibilitychange", q);
  let H = () => {
    S(document, "ln-store:online", {}), Object.values(s).forEach((y) => {
      y._noAutosync || y.isLoaded && !y.isSyncing && Y(y);
    });
  };
  window.addEventListener("online", H);
  let P = () => {
    S(document, "ln-store:offline", {});
  };
  window.addEventListener("offline", P);
  const pt = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function nt(y, L) {
    if (!L || !L.field) return y;
    const { field: T, direction: k } = L, I = k === "desc";
    return [...y].sort((M, N) => {
      const j = M[T], J = N[T];
      if (j == null && J == null) return 0;
      if (j == null) return I ? 1 : -1;
      if (J == null) return I ? -1 : 1;
      const tt = typeof j == "string" && typeof J == "string" ? pt.compare(j, J) : j < J ? -1 : j > J ? 1 : 0;
      return I ? -tt : tt;
    });
  }
  function G(y, L) {
    if (!L) return y;
    const T = Object.keys(L).filter((k) => Array.isArray(L[k]) && L[k].length > 0);
    return T.length ? y.filter(
      (k) => T.every((I) => L[I].map(String).includes(String(k[I])))
    ) : y;
  }
  function mt(y, L, T) {
    if (!L || !T || !T.length) return y;
    const k = L.toLowerCase();
    return y.filter(
      (I) => T.some((M) => {
        const N = I[M];
        return N != null && String(N).toLowerCase().includes(k);
      })
    );
  }
  function it(y, L, T) {
    if (!y.length) return 0;
    if (T === "count") return y.length;
    const k = y.map((M) => parseFloat(M[L])).filter((M) => !isNaN(M)), I = k.reduce((M, N) => M + N, 0);
    return T === "sum" ? I : T === "avg" && k.length ? I / k.length : 0;
  }
  function st(y, L) {
    if (!y.presenters || !y.presenters.computed) return L;
    const T = y.presenters.computed;
    return L.map((k) => {
      const I = { ...k };
      for (const [M, N] of Object.entries(T))
        try {
          I[M] = N(k);
        } catch (j) {
          console.error(`[ln-data-store] Decorator computed field failed for ${M}`, j);
        }
      return I;
    });
  }
  O.prototype.getAll = function(y = {}) {
    const L = this;
    return b(L._name).then((T) => {
      const k = T.length;
      y.filters && (T = G(T, y.filters)), y.search && (T = mt(T, y.search, L._searchFields));
      const I = T.length;
      if (y.sort && (T = nt(T, y.sort)), y.offset || y.limit) {
        const M = y.offset || 0, N = y.limit || T.length;
        T = T.slice(M, M + N);
      }
      return {
        data: st(L, T),
        total: k,
        filtered: I
      };
    });
  }, O.prototype.getById = function(y) {
    return v(this._name, y).then((L) => L ? st(this, [L])[0] : null);
  }, O.prototype.count = function(y) {
    return y ? b(this._name).then((L) => G(L, y).length) : C(this._name);
  }, O.prototype.aggregate = function(y, L) {
    return b(this._name).then((T) => it(T, y, L));
  }, O.prototype.setPresenters = function(y) {
    this.presenters = y;
  }, O.prototype.applySync = function(y, L, T) {
    const k = this, I = y.length > 0 || L.length > 0;
    let M = Promise.resolve();
    return y.length > 0 && (M = M.then(() => ht(k._name, y))), L.length > 0 && (M = M.then(() => ft(k._name, L))), M.then(() => C(k._name)).then((N) => (k.totalCount = N, R(k._name, {
      schema_version: p,
      last_synced_at: T,
      record_count: N
    }))).then(() => {
      const N = !k.isLoaded;
      k.isLoaded = !0, k.isSyncing = !1, k.lastSyncedAt = T, N ? (S(k.dom, "ln-store:loaded", { store: k._name, count: k.totalCount }), S(k.dom, "ln-store:ready", { store: k._name, count: k.totalCount, source: "server" })) : S(k.dom, "ln-store:synced", {
        store: k._name,
        added: y.length,
        deleted: L.length,
        changed: I
      });
    }).catch((N) => {
      k.isSyncing = !1, console.error("[ln-data-store] applySync failed:", N);
    });
  }, O.prototype.confirmMutation = function(y, L, T) {
    const k = this, I = {
      create: () => A(k._name, y).then(() => E(k._name, L)).then(() => {
        delete k._pendingSnapshots[y], S(k.dom, "ln-store:confirmed", { store: k._name, record: L, tempId: y, action: "create" });
      }),
      update: () => E(k._name, L).then(() => {
        delete k._pendingSnapshots[y], S(k.dom, "ln-store:confirmed", { store: k._name, record: L, action: "update" });
      }),
      delete: () => (delete k._pendingSnapshots[y], S(k.dom, "ln-store:confirmed", { store: k._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete k._pendingSnapshots[y], S(k.dom, "ln-store:confirmed", { store: k._name, record: null, ids: y.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return I[T] ? I[T]() : Promise.resolve();
  }, O.prototype.revertMutation = function(y, L, T) {
    const k = this, I = T || `Server rejected ${L}`, M = {
      create: () => A(k._name, y).then(() => {
        k.totalCount--, delete k._pendingSnapshots[y], S(k.dom, "ln-store:reverted", { store: k._name, record: null, action: "create", error: I });
      }),
      update: () => {
        const N = k._pendingSnapshots[y];
        return N ? E(k._name, N).then(() => {
          delete k._pendingSnapshots[y], S(k.dom, "ln-store:reverted", { store: k._name, record: N, action: "update", error: I });
        }) : Promise.resolve();
      },
      delete: () => {
        const N = k._pendingSnapshots[y];
        return N ? E(k._name, N).then(() => {
          k.totalCount++, delete k._pendingSnapshots[y], S(k.dom, "ln-store:reverted", { store: k._name, record: N, action: "delete", error: I });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const N = k._pendingSnapshots[y];
        return !N || !N.length ? Promise.resolve() : ht(k._name, N).then(() => {
          k.totalCount += N.length, delete k._pendingSnapshots[y], S(k.dom, "ln-store:reverted", { store: k._name, record: null, ids: y.split(","), action: "bulk-delete", error: I });
        });
      }
    };
    return M[L] ? M[L]() : Promise.resolve();
  }, O.prototype.resolveConflict = function(y, L, T) {
    const k = this._pendingSnapshots[y];
    return k ? E(this._name, k).then(() => {
      delete this._pendingSnapshots[y], S(this.dom, "ln-store:conflict", {
        store: this._name,
        local: k,
        remote: L,
        field_diffs: T || null
      });
    }) : Promise.resolve();
  }, O.prototype.forceSync = function() {
    Y(this);
  }, O.prototype.fullReload = function() {
    const y = this;
    return w(y._name).then(() => {
      y.isLoaded = !1, y.lastSyncedAt = null, y.totalCount = 0, Y(y);
    });
  }, O.prototype.destroy = function() {
    if (this._handlers) {
      for (const [y, L] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${y}`, L);
      this._handlers = null;
    }
    delete s[this._name], Object.keys(s).length === 0 && (q && (document.removeEventListener("visibilitychange", q), q = null), H && (window.removeEventListener("online", H), H = null), P && (window.removeEventListener("offline", P), P = null)), delete this.dom[c], S(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function At() {
    return a().then((y) => {
      if (!y) return;
      const L = Array.from(y.objectStoreNames);
      return new Promise((T, k) => {
        const I = y.transaction(L, "readwrite");
        L.forEach((M) => I.objectStore(M).clear()), I.oncomplete = () => T(), I.onerror = () => k(I.error);
      });
    }).then(() => {
      Object.values(s).forEach((y) => {
        y.isLoaded = !1, y.isSyncing = !1, y.lastSyncedAt = null, y.totalCount = 0;
      });
    });
  }
  B(h, c, O, "ln-data-store"), window[c].clearAll = At, window[c].init = window[c], window[c].setStorageKey = Pt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Pt);
})();
(function() {
  const h = "data-ln-api-connector", c = "lnApiConnector", _ = "lnConnector";
  if (window[c] !== void 0) return;
  function m(n) {
    return this.dom = n, n[c] = this, n[_] = this, this.refreshConfig(), this._handlers = null, p(this), this;
  }
  m.prototype.refreshConfig = function() {
    const n = this.dom;
    this.baseUrl = n.getAttribute("data-ln-api-base-url") || "", this.path = n.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const s = n.getAttribute("data-ln-api-headers") || "";
    this.headers = Yt(s, "ln-api-connector"), (s.toLowerCase().includes("authorization") || s.toLowerCase().includes("bearer") || s.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(n, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, m.prototype.fetchDelta = function(n) {
    const s = this;
    let t = V(s.baseUrl, s.path);
    return n != null && n !== "" && (t += (t.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n)), window.fetch(t, { method: "GET", headers: W(s.headers), credentials: s.credentials }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    });
  }, m.prototype.create = function(n) {
    const s = this;
    return window.fetch(V(s.baseUrl, s.path), {
      method: "POST",
      headers: W(s.headers),
      credentials: s.credentials,
      body: JSON.stringify(n)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, m.prototype.update = function(n, s) {
    const t = this;
    return window.fetch(V(t.baseUrl, t.path, n), {
      method: "PUT",
      headers: W(t.headers),
      credentials: t.credentials,
      body: JSON.stringify(s)
    }).then((o) => {
      if (o.ok) return o.json();
      if (o.status === 409) return o.json().then((e) => {
        const i = new Error("Conflict");
        throw i.status = 409, i.data = e, i;
      });
      throw new Error("HTTP " + o.status + ": " + o.statusText);
    });
  }, m.prototype.delete = function(n) {
    const s = this;
    return window.fetch(V(s.baseUrl, s.path, n), {
      method: "DELETE",
      headers: W(s.headers),
      credentials: s.credentials
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, m.prototype.bulkDelete = function(n) {
    const s = this;
    return window.fetch(V(s.baseUrl, s.path) + "/bulk-delete", {
      method: "DELETE",
      headers: W(s.headers),
      credentials: s.credentials,
      body: JSON.stringify({ ids: n })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  };
  function p(n) {
    n._handlers = {
      sync: function(t) {
        const o = t.detail || {};
        n.fetchDelta(o.since).then(function(e) {
          S(n.dom, "ln-api-connector:fetched", { data: e, since: o.since });
        }).catch(function(e) {
          S(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: o.since
          });
        });
      },
      create: function(t) {
        const o = t.detail || {};
        n.create(o.data).then(function(e) {
          S(n.dom, "ln-api-connector:created", { record: e, tempId: o.tempId });
        }).catch(function(e) {
          S(n.dom, "ln-api-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: o.tempId
          });
        });
      },
      update: function(t) {
        const o = t.detail || {}, e = Object.assign({}, o.data);
        o.expected_version !== void 0 && (e.expected_version = o.expected_version), n.update(o.id, e).then(function(i) {
          S(n.dom, "ln-api-connector:updated", { record: i, id: o.id });
        }).catch(function(i) {
          S(n.dom, "ln-api-connector:error", {
            action: "update",
            error: i.message,
            status: i.status || 0,
            id: o.id,
            conflictData: i.status === 409 ? i.data : null
          });
        });
      },
      delete: function(t) {
        const o = t.detail || {};
        n.delete(o.id).then(function(e) {
          S(n.dom, "ln-api-connector:deleted", { response: e, id: o.id });
        }).catch(function(e) {
          S(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: o.id
          });
        });
      },
      bulkDelete: function(t) {
        const o = t.detail || {};
        n.bulkDelete(o.ids).then(function(e) {
          S(n.dom, "ln-api-connector:bulk-deleted", { response: e, ids: o.ids });
        }).catch(function(e) {
          S(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: o.ids
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.addEventListener(t + ":request-sync", n._handlers.sync), n.dom.addEventListener(t + ":request-fetch", n._handlers.sync), n.dom.addEventListener(t + ":request-create", n._handlers.create), n.dom.addEventListener(t + ":request-update", n._handlers.update), n.dom.addEventListener(t + ":request-delete", n._handlers.delete), n.dom.addEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const n = this;
    n._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[c], delete this.dom[_];
  };
  function f(n) {
    const s = n[c];
    s && s.refreshConfig();
  }
  B(h, c, m, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", c = "lnCouchDbConnector", _ = "lnConnector";
  if (window[c] !== void 0) return;
  function m(n) {
    return this.dom = n, n[c] = this, n[_] = this, this.refreshConfig(), this._handlers = null, p(this), this;
  }
  m.prototype.refreshConfig = function() {
    const n = this.dom;
    this.url = n.getAttribute("data-ln-couchdb-url") || "", this.db = n.getAttribute("data-ln-couchdb-db") || "", this.auth = n.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const s = n.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Yt(s, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), s.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(n, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, m.prototype.fetchDelta = function(n) {
    const s = this, t = ["include_docs=true", "feed=normal"];
    n && t.push("since=" + encodeURIComponent(n));
    const o = V(s.url, s.db, "_changes") + "?" + t.join("&");
    return window.fetch(o, { method: "GET", headers: W(s.headers, s.auth), credentials: s.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const i = e.results || [];
      return {
        data: i.filter((u) => !u.deleted && u.doc).map((u) => Object.assign({}, u.doc, { id: u.doc._id })),
        deleted: i.filter((u) => u.deleted).map((u) => u.id),
        synced_at: e.last_seq || n || ""
      };
    });
  }, m.prototype.create = function(n) {
    const s = this, t = Object.assign({ _id: n.id }, n);
    return t._id || delete t._id, window.fetch(V(s.url, s.db), {
      method: "POST",
      headers: W(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify(t)
    }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => Object.assign({}, t, { id: o.id, _id: o.id, _rev: o.rev }));
  }, m.prototype.update = function(n, s) {
    const t = this, o = Object.assign({ id: String(n), _id: String(n) }, s), e = o._rev || o.rev;
    return (e ? Promise.resolve(e) : window.fetch(V(t.url, t.db, null, n), { method: "GET", headers: W(t.headers, t.auth), credentials: t.credentials }).then((u) => {
      if (!u.ok) throw new Error("Could not retrieve document for revision mapping");
      return u.json().then((a) => a._rev);
    })).then((u) => {
      const a = Object.assign({}, o, { _rev: u });
      delete a.rev;
      const r = Object.assign(W(t.headers, t.auth), { "If-Match": u });
      return window.fetch(V(t.url, t.db, null, n), {
        method: "PUT",
        headers: r,
        credentials: t.credentials,
        body: JSON.stringify(a)
      }).then((d) => {
        if (d.ok) return d.json().then((g) => Object.assign({}, a, { _rev: g.rev }));
        if (d.status === 409) return d.json().then((g) => {
          const l = new Error("Conflict");
          throw l.status = 409, l.data = g, l;
        });
        throw new Error("HTTP " + d.status + ": " + d.statusText);
      });
    });
  }, m.prototype.delete = function(n, s) {
    const t = this;
    return (s ? Promise.resolve(s) : window.fetch(V(t.url, t.db, null, n), { method: "GET", headers: W(t.headers, t.auth), credentials: t.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((i) => i._rev);
    })).then((e) => {
      const i = V(t.url, t.db, null, n) + "?rev=" + encodeURIComponent(e);
      return window.fetch(i, { method: "DELETE", headers: W(t.headers, t.auth), credentials: t.credentials }).then((u) => {
        if (!u.ok) throw new Error("HTTP " + u.status + ": " + u.statusText);
        return u.json();
      });
    });
  }, m.prototype.bulkDelete = function(n) {
    const s = this;
    return !n || n.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch(V(s.url, s.db, "_all_docs"), {
      method: "POST",
      headers: W(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify({ keys: n })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = (t.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return e.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(V(s.url, s.db, "_bulk_docs"), {
        method: "POST",
        headers: W(s.headers, s.auth),
        credentials: s.credentials,
        body: JSON.stringify({ docs: e })
      }).then((i) => {
        if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
        return i.json();
      }).then((i) => ({ ok: !0, results: i, deletedCount: e.length }));
    });
  };
  function p(n) {
    n._handlers = {
      sync: function(t) {
        const o = t.detail || {};
        n.fetchDelta(o.since).then(function(e) {
          S(n.dom, "ln-couchdb-connector:fetched", { data: e, since: o.since });
        }).catch(function(e) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: o.since
          });
        });
      },
      create: function(t) {
        const o = t.detail || {};
        n.create(o.data).then(function(e) {
          S(n.dom, "ln-couchdb-connector:created", { record: e, tempId: o.tempId });
        }).catch(function(e) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: o.tempId
          });
        });
      },
      update: function(t) {
        const o = t.detail || {}, e = Object.assign({}, o.data);
        o.expected_version !== void 0 && (e._rev = o.expected_version), n.update(o.id, e).then(function(i) {
          S(n.dom, "ln-couchdb-connector:updated", { record: i, id: o.id });
        }).catch(function(i) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: i.message,
            status: i.status || 0,
            id: o.id,
            conflictData: i.status === 409 ? i.data : null
          });
        });
      },
      delete: function(t) {
        const o = t.detail || {};
        n.delete(o.id, o.rev).then(function(e) {
          S(n.dom, "ln-couchdb-connector:deleted", { response: e, id: o.id });
        }).catch(function(e) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: o.id
          });
        });
      },
      bulkDelete: function(t) {
        const o = t.detail || {};
        n.bulkDelete(o.ids).then(function(e) {
          S(n.dom, "ln-couchdb-connector:bulk-deleted", { response: e, ids: o.ids });
        }).catch(function(e) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: o.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.addEventListener(t + ":request-sync", n._handlers.sync), n.dom.addEventListener(t + ":request-fetch", n._handlers.sync), n.dom.addEventListener(t + ":request-create", n._handlers.create), n.dom.addEventListener(t + ":request-update", n._handlers.update), n.dom.addEventListener(t + ":request-delete", n._handlers.delete), n.dom.addEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const n = this;
    n._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[c], delete this.dom[_];
  };
  function f(n) {
    const s = n[c];
    s && s.refreshConfig();
  }
  B(h, c, m, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-data-coordinator", c = "lnDataCoordinator", _ = "lnCoordinator";
  if (window[c] !== void 0) return;
  function m(n) {
    return this.dom = n, this._name = n.getAttribute(h), n[c] = this, n[_] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this.refreshMapper(), p(this), this;
  }
  m.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const s = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    s && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(s)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(t) {
      return t;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(t) {
      return t;
    });
  }, m.prototype.findChildren = function() {
    const n = this.dom.querySelector("[data-ln-data-store]"), s = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]");
    return {
      storeEl: n,
      connectorEl: s,
      store: n ? n.lnDataStore || n.lnStore : null,
      connector: s ? s.lnConnector || s.lnApiConnector || s.lnCouchDbConnector : null
    };
  };
  function p(n) {
    n._handlers = {
      sync: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        const o = s.detail.since;
        t.connector.fetchDelta(o).then(function(e) {
          let i = [], u = [], a = null;
          e && Array.isArray(e) ? (i = e, a = Math.floor(Date.now() / 1e3)) : e && (i = Array.isArray(e.data) ? e.data : [], u = Array.isArray(e.deleted) ? e.deleted : [], a = e.synced_at !== void 0 ? e.synced_at : e.since !== void 0 ? e.since : null);
          const r = i.map((d) => n.mapper.ingress(d));
          t.store.applySync(r, u, a);
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Sync failed:", e);
        });
      },
      create: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const o = s.detail.tempId, e = s.detail.data || {}, i = n.mapper.egress(e);
        t.connector.create(i).then(function(u) {
          const a = n.mapper.ingress(u);
          t.store.confirmMutation(o, a, "create");
        }).catch(function(u) {
          console.error("[ln-data-coordinator] Create mutation failed:", u), t.store.revertMutation(o, "create", u.message || u);
        });
      },
      update: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const o = s.detail.id, e = s.detail.expected_version;
        t.store.getById(o).then(function(i) {
          if (!i) throw new Error("Record not found in cache store: " + o);
          const u = Object.assign({}, i);
          delete u._pending;
          const a = n.mapper.egress(u);
          return t.connector.update(o, a, e);
        }).then(function(i) {
          const u = n.mapper.ingress(i);
          t.store.confirmMutation(o, u, "update");
        }).catch(function(i) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", i), i.status === 409) {
            const u = i.data && i.data.remote ? n.mapper.ingress(i.data.remote) : null, a = i.data ? i.data.field_diffs : null;
            t.store.resolveConflict(o, u, a);
          } else
            t.store.revertMutation(o, "update", i.message || i);
        });
      },
      delete: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const o = s.detail.id;
        t.connector.delete(o).then(function() {
          t.store.confirmMutation(o, null, "delete");
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Delete mutation failed:", e), t.store.revertMutation(o, "delete", e.message || e);
        });
      },
      bulkDelete: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const o = s.detail.ids || [], e = o.join(",");
        t.connector.bulkDelete(o).then(function() {
          t.store.confirmMutation(e, null, "bulk-delete");
        }).catch(function(i) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", i), t.store.revertMutation(e, "bulk-delete", i.message || i);
        });
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(s) {
        n._serveData(s, "table");
      },
      reqListData: function(s) {
        n._serveData(s, "list");
      },
      reqOptions: function(s) {
        n._serveOptions(s);
      },
      reqStat: function(s) {
        n._serveStat(s);
      },
      refresh: function() {
        n._refreshAll();
      },
      refreshSynced: function(s) {
        s.detail && s.detail.changed && n._refreshAll();
      }
    }, n.dom.addEventListener("ln-store:request-remote-sync", n._handlers.sync), n.dom.addEventListener("ln-store:request-remote-create", n._handlers.create), n.dom.addEventListener("ln-store:request-remote-update", n._handlers.update), n.dom.addEventListener("ln-store:request-remote-delete", n._handlers.delete), n.dom.addEventListener("ln-store:request-remote-bulk-delete", n._handlers.bulkDelete), document.addEventListener("ln-table:request-data", n._handlers.reqTableData), document.addEventListener("ln-list:request-data", n._handlers.reqListData), document.addEventListener("ln-options:request-data", n._handlers.reqOptions), document.addEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.addEventListener("ln-store:ready", n._handlers.refresh), n.dom.addEventListener("ln-store:loaded", n._handlers.refresh), n.dom.addEventListener("ln-store:created", n._handlers.refresh), n.dom.addEventListener("ln-store:updated", n._handlers.refresh), n.dom.addEventListener("ln-store:deleted", n._handlers.refresh), n.dom.addEventListener("ln-store:synced", n._handlers.refreshSynced);
  }
  m.prototype._ownsStore = function(n) {
    const s = this.findChildren();
    return !!(s.store && s.store._name === n && n);
  }, m.prototype._serveData = function(n, s) {
    const t = n.target, o = s === "table" ? "data-ln-table-store" : "data-ln-list-store", e = t.getAttribute(o);
    if (!e || !this._ownsStore(e)) return;
    this._boundQueries.set(t, {
      sort: n.detail.sort,
      filters: n.detail.filters,
      search: n.detail.search
    });
    const i = this.findChildren().store;
    if (!i.isLoaded) {
      S(t, "ln-" + s + ":set-loading", { loading: !0 });
      return;
    }
    const u = this, a = { sort: n.detail.sort, filters: n.detail.filters, search: n.detail.search };
    i.getAll(a).then(function(r) {
      const d = { data: r.data, total: r.total, filtered: r.filtered };
      S(t, "ln-" + s + ":set-data", d), u._boundDelivered.set(t, !0);
    });
  }, m.prototype._serveOptions = function(n) {
    const s = n.target, t = s.getAttribute("data-ln-options");
    if (!this._ownsStore(t)) return;
    this.findChildren().store.getAll({}).then(function(e) {
      S(s, "ln-options:set-data", { data: e.data });
    });
  }, m.prototype._serveStat = function(n) {
    const s = n.target, t = s.getAttribute("data-ln-stat");
    if (!this._ownsStore(t)) return;
    const o = n.detail.filters || null;
    this.findChildren().store.count(o).then(function(i) {
      S(s, "ln-stat:set-count", { count: i });
    });
  }, m.prototype._refreshAll = function() {
    const n = this, s = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let t = 0; t < s.length; t++) {
      const o = s[t];
      let e, i;
      if (o.hasAttribute("data-ln-table-store") ? (e = o.getAttribute("data-ln-table-store"), i = "table") : o.hasAttribute("data-ln-list-store") ? (e = o.getAttribute("data-ln-list-store"), i = "list") : o.hasAttribute("data-ln-options") ? (e = o.getAttribute("data-ln-options"), i = "options") : o.hasAttribute("data-ln-stat") && (e = o.getAttribute("data-ln-stat"), i = "stat"), !this._ownsStore(e)) continue;
      const u = this.findChildren().store;
      if (i === "table" || i === "list") {
        const a = n._boundQueries.get(o) || { sort: null, filters: {}, search: "" };
        (function(r, d) {
          u.getAll(a).then(function(g) {
            const l = { data: g.data, total: g.total, filtered: g.filtered };
            S(r, "ln-" + d + ":set-data", l), n._boundDelivered.set(r, !0);
          });
        })(o, i);
      } else if (i === "options")
        (function(a) {
          u.getAll({}).then(function(r) {
            S(a, "ln-options:set-data", { data: r.data });
          });
        })(o);
      else if (i === "stat") {
        const a = o.getAttribute("data-ln-stat-filter");
        let r = null;
        if (a) {
          const d = a.indexOf(":");
          if (d !== -1) {
            const g = a.slice(0, d), l = a.slice(d + 1);
            r = {}, r[g] = [l];
          }
        }
        (function(d, g) {
          u.count(g).then(function(l) {
            S(d, "ln-stat:set-count", { count: l });
          });
        })(o, r);
      }
    }
  }, m.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const n = this;
    n._handlers && (n.dom.removeEventListener("ln-store:request-remote-sync", n._handlers.sync), n.dom.removeEventListener("ln-store:request-remote-create", n._handlers.create), n.dom.removeEventListener("ln-store:request-remote-update", n._handlers.update), n.dom.removeEventListener("ln-store:request-remote-delete", n._handlers.delete), n.dom.removeEventListener("ln-store:request-remote-bulk-delete", n._handlers.bulkDelete), document.removeEventListener("ln-table:request-data", n._handlers.reqTableData), document.removeEventListener("ln-list:request-data", n._handlers.reqListData), document.removeEventListener("ln-options:request-data", n._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.removeEventListener("ln-store:ready", n._handlers.refresh), n.dom.removeEventListener("ln-store:loaded", n._handlers.refresh), n.dom.removeEventListener("ln-store:created", n._handlers.refresh), n.dom.removeEventListener("ln-store:updated", n._handlers.refresh), n.dom.removeEventListener("ln-store:deleted", n._handlers.refresh), n.dom.removeEventListener("ln-store:synced", n._handlers.refreshSynced), n._handlers = null), n._boundQueries = null, n._boundDelivered = null, delete this.dom[c], delete this.dom[_];
  };
  function f(n, s) {
    const t = n[c];
    t && s === "data-ln-data-mapper" && t.refreshMapper();
  }
  B(h, c, m, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-options", c = "lnOptions";
  if (window[c] !== void 0) return;
  function _(m) {
    this.dom = m, this._storeName = m.getAttribute(h), this._valueField = m.getAttribute("data-ln-options-value") || "id", this._labelField = m.getAttribute("data-ln-options-label") || "name";
    const p = this;
    return this._onSetData = function(f) {
      p._rebuild(f.detail.data || []);
    }, m.addEventListener("ln-options:set-data", this._onSetData), S(m, "ln-options:request-data", { options: this._storeName }), this;
  }
  _.prototype._rebuild = function(m) {
    const p = this.dom, f = this._valueField, n = this._labelField, s = p.value, t = p.querySelectorAll("option");
    for (let e = t.length - 1; e >= 0; e--)
      t[e].value !== "" && p.removeChild(t[e]);
    for (let e = 0; e < m.length; e++) {
      const i = m[e], u = document.createElement("option");
      u.value = String(i[f]), u.textContent = i[n] != null ? i[n] : "", p.appendChild(u);
    }
    const o = p.options;
    for (let e = 0; e < o.length; e++)
      if (o[e].value === s) {
        p.value = s;
        break;
      }
  }, _.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[c]);
  }, B(h, c, _, "ln-options");
})();
(function() {
  const h = "data-ln-stat", c = "lnStat";
  if (window[c] !== void 0) return;
  function _(p) {
    if (!p) return null;
    const f = p.indexOf(":");
    if (f === -1) return null;
    const n = p.slice(0, f), s = p.slice(f + 1), t = {};
    return t[n] = [s], t;
  }
  function m(p) {
    return this.dom = p, this._storeName = p.getAttribute(h), this._filters = _(p.getAttribute("data-ln-stat-filter")), this._onSetCount = function(f) {
      p.textContent = String(f.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), S(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  m.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[c]);
  }, B(h, c, m, "ln-stat");
})();
(function() {
  const h = "data-ln-store-notify", c = "lnStoreNotify";
  if (window[c] !== void 0) return;
  function _(p, f, n) {
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: p, title: f, message: n }
    }));
  }
  function m(p) {
    this.dom = p, this._savedTitle = p.getAttribute("data-ln-store-notify-saved") || null, this._deletedTitle = p.getAttribute("data-ln-store-notify-deleted") || null, this._failedTitle = p.getAttribute("data-ln-store-notify-failed") || null;
    const f = this;
    return this._onConfirmed = function(n) {
      const s = n.detail || {}, t = s.action || "confirmed";
      let o, e;
      if (t === "create" || t === "update")
        o = f._savedTitle || t, e = s.record && s.record.name ? s.record.name : void 0;
      else if (t === "delete")
        o = f._deletedTitle || t, e = void 0;
      else if (t === "bulk-delete") {
        o = f._deletedTitle || t;
        const i = s.ids ? s.ids.length : 0;
        e = i ? String(i) : void 0;
      } else
        o = f._savedTitle || t, e = void 0;
      _("success", o, e);
    }, this._onReverted = function(n) {
      const s = n.detail || {}, t = s.action || "reverted", o = f._failedTitle || t, e = s.error ? String(s.error) : void 0;
      _("error", o, e);
    }, p.addEventListener("ln-store:confirmed", this._onConfirmed), p.addEventListener("ln-store:reverted", this._onReverted), this;
  }
  m.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-store:confirmed", this._onConfirmed), this.dom.removeEventListener("ln-store:reverted", this._onReverted), delete this.dom[c]);
  }, B(h, c, m, "ln-store-notify");
})();
(function() {
  const h = "ln-icons-sprite", c = "#ln-", _ = "#lnc-", m = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let f = null;
  const n = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", o = "lni:v", e = "1";
  function i() {
    try {
      if (localStorage.getItem(o) !== e) {
        for (let b = localStorage.length - 1; b >= 0; b--) {
          const v = localStorage.key(b);
          v && v.indexOf(t) === 0 && localStorage.removeItem(v);
        }
        localStorage.setItem(o, e);
      }
    } catch {
    }
  }
  i();
  function u() {
    return f || (f = document.getElementById(h), f || (f = document.createElementNS("http://www.w3.org/2000/svg", "svg"), f.id = h, f.setAttribute("hidden", ""), f.setAttribute("aria-hidden", "true"), f.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(f, document.body.firstChild))), f;
  }
  function a(b) {
    return b.indexOf(_) === 0 ? s + "/" + b.slice(_.length) + ".svg" : n + "/" + b.slice(c.length) + ".svg";
  }
  function r(b, v) {
    const E = v.match(/viewBox="([^"]+)"/), A = E ? E[1] : "0 0 24 24", w = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = w ? w[1].trim() : "", x = v.match(/<svg([^>]*)>/i), R = x ? x[1] : "", O = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    O.id = b, O.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(D) {
      const F = R.match(new RegExp(D + '="([^"]*)"'));
      F && O.setAttribute(D, F[1]);
    }), O.innerHTML = C, u().querySelector("defs").appendChild(O);
  }
  function d(b) {
    if (m.has(b) || p.has(b) || b.indexOf(_) === 0 && !s) return;
    const v = b.slice(1);
    try {
      const E = localStorage.getItem(t + v);
      if (E) {
        r(v, E), m.add(b);
        return;
      }
    } catch {
    }
    p.add(b), fetch(a(b)).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      r(v, E), m.add(b), p.delete(b);
      try {
        localStorage.setItem(t + v, E);
      } catch {
      }
    }).catch(function() {
      p.delete(b);
    });
  }
  function g(b) {
    const v = 'use[href^="' + c + '"], use[href^="' + _ + '"]', E = b.querySelectorAll ? b.querySelectorAll(v) : [];
    if (b.matches && b.matches(v)) {
      const A = b.getAttribute("href");
      A && d(A);
    }
    Array.prototype.forEach.call(E, function(A) {
      const w = A.getAttribute("href");
      w && d(w);
    });
  }
  function l() {
    g(document), new MutationObserver(function(b) {
      b.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(E) {
            E.nodeType === 1 && g(E);
          });
        else if (v.type === "attributes" && v.attributeName === "href") {
          const E = v.target.getAttribute("href");
          E && (E.indexOf(c) === 0 || E.indexOf(_) === 0) && d(E);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const h = "data-ln-debug", c = "lnDebug";
  if (window[c] !== void 0) return;
  function _(m) {
    return this.dom = m, this;
  }
  _.prototype.destroy = function() {
    delete this.dom[c];
  }, B(h, c, _, "ln-debug");
})();
