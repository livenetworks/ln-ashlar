const Ct = {};
function bt(h, d) {
  Ct[h] || (Ct[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const b = Ct[h];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (d || "ln-core") + '] Template "' + h + '" not found'), null);
}
function w(h, d, b) {
  h.dispatchEvent(new CustomEvent(d, {
    bubbles: !0,
    detail: b || {}
  }));
}
function z(h, d, b) {
  const p = new CustomEvent(d, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return h.dispatchEvent(p), p;
}
function Bt(h, d, b) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const p = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  p[b] = h.name, w(h.dom, d, p);
}
function $(h, d) {
  if (!h || !d) return h;
  const b = h.querySelectorAll("[data-ln-field]");
  for (let i = 0; i < b.length; i++) {
    const l = b[i], t = l.getAttribute("data-ln-field");
    d[t] != null && (l.textContent = d[t]);
  }
  const p = h.querySelectorAll("[data-ln-attr]");
  for (let i = 0; i < p.length; i++) {
    const l = p[i], t = l.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const n = e[0].trim(), u = e[1].trim();
      d[u] != null && l.setAttribute(n, d[u]);
    }
  }
  const g = h.querySelectorAll("[data-ln-show]");
  for (let i = 0; i < g.length; i++) {
    const l = g[i], t = l.getAttribute("data-ln-show");
    t in d && l.classList.toggle("hidden", !d[t]);
  }
  const _ = h.querySelectorAll("[data-ln-class]");
  for (let i = 0; i < _.length; i++) {
    const l = _[i], t = l.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const n = e[0].trim(), u = e[1].trim();
      u in d && l.classList.toggle(n, !!d[u]);
    }
  }
  return h;
}
function gt(h, d) {
  if (!h || !d) return h;
  const b = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const p = b.currentNode;
    p.textContent.indexOf("{{") !== -1 && (p.textContent = p.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(g, _) {
        return d[_] !== void 0 ? d[_] : "";
      }
    ));
  }
  return h;
}
function Zt(h, d, b, p, g, _) {
  const i = {};
  for (let t = 0; t < h.children.length; t++) {
    const o = h.children[t], e = o.getAttribute("data-ln-key");
    e && (i[e] = o);
  }
  const l = document.createDocumentFragment();
  for (let t = 0; t < d.length; t++) {
    const o = d[t], e = String(p(o));
    let n = i[e];
    if (n)
      g(n, o, t);
    else {
      const u = bt(b, _);
      if (!u || (gt(u, o), n = u.firstElementChild, !n)) continue;
      n.setAttribute("data-ln-key", e), g(n, o, t);
    }
    l.appendChild(n);
  }
  h.textContent = "", h.appendChild(l);
}
function W(h, d) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      W(h, d);
    }), console.warn("[" + d + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function Q(h, d, b) {
  if (h) {
    const p = h.querySelector('[data-ln-template="' + d + '"]');
    if (p) return p.content.cloneNode(!0);
  }
  return bt(d, b);
}
function te(h, d) {
  const b = {}, p = h.querySelectorAll("[" + d + "]");
  for (let g = 0; g < p.length; g++)
    b[p[g].getAttribute(d)] = p[g].textContent, p[g].remove();
  return b;
}
function Lt(h, d, b, p) {
  if (h.nodeType !== 1) return;
  const _ = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", i = Array.from(h.querySelectorAll(_));
  h.matches && h.matches(_) && i.push(h);
  for (const l of i)
    l[b] || (l[b] = new p(l));
}
function mt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function Pt(h) {
  const d = {}, b = h.elements;
  for (let p = 0; p < b.length; p++) {
    const g = b[p];
    if (!(!g.name || g.disabled || g.type === "file" || g.type === "submit" || g.type === "button"))
      if (g.type === "checkbox")
        d[g.name] || (d[g.name] = []), g.checked && d[g.name].push(g.value);
      else if (g.type === "radio")
        g.checked && (d[g.name] = g.value);
      else if (g.type === "select-multiple") {
        d[g.name] = [];
        for (let _ = 0; _ < g.options.length; _++)
          g.options[_].selected && d[g.name].push(g.options[_].value);
      } else
        d[g.name] = g.value;
  }
  return d;
}
function Ht(h, d) {
  const b = h.elements, p = [];
  for (let g = 0; g < b.length; g++) {
    const _ = b[g];
    if (!_.name || !(_.name in d) || _.type === "file" || _.type === "submit" || _.type === "button") continue;
    const i = d[_.name];
    if (_.type === "checkbox")
      _.checked = Array.isArray(i) ? i.indexOf(_.value) !== -1 : !!i, p.push(_);
    else if (_.type === "radio")
      _.checked = _.value === String(i), p.push(_);
    else if (_.type === "select-multiple") {
      if (Array.isArray(i))
        for (let l = 0; l < _.options.length; l++)
          _.options[l].selected = i.indexOf(_.options[l].value) !== -1;
      p.push(_);
    } else
      _.value = i, p.push(_);
  }
  return p;
}
function J(h) {
  const d = h.closest("[lang]");
  return (d ? d.lang : null) || navigator.language;
}
function qt(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function Ut(h, d, { get: b, set: p }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return b ? b.call(this) : d.get.call(this);
    },
    set: function(g) {
      p ? p.call(this, g, (_) => d.set.call(this, _)) : d.set.call(this, g);
    },
    configurable: !0
  });
}
function B(h, d, b, p, g = {}) {
  const _ = g.extraAttributes || [], i = g.onAttributeChange || null, l = g.onInit || null;
  function t(o) {
    const e = o || document.body;
    Lt(e, h, d, b), l && l(e);
  }
  return W(function() {
    const o = new MutationObserver(function(n) {
      for (let u = 0; u < n.length; u++) {
        const s = n[u];
        if (s.type === "childList") {
          for (let r = 0; r < s.addedNodes.length; r++) {
            const c = s.addedNodes[r];
            c.nodeType === 1 && (Lt(c, h, d, b), l && l(c));
          }
          for (let r = 0; r < s.removedNodes.length; r++) {
            const c = s.removedNodes[r];
            if (c.nodeType === 1) {
              const a = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", m = Array.from(c.querySelectorAll(a));
              c.matches && c.matches(a) && m.push(c);
              for (let y = 0; y < m.length; y++) {
                const A = m[y];
                if (!document.contains(A)) {
                  const E = A[d];
                  E && typeof E.destroy == "function" && E.destroy();
                }
              }
            }
          }
        } else s.type === "attributes" && (i && s.target[d] ? i(s.target, s.attributeName) : (Lt(s.target, h, d, b), l && l(s.target)));
      }
    });
    let e = [];
    if (h.indexOf("[") !== -1) {
      const n = /\[([\w-]+)/g;
      let u;
      for (; (u = n.exec(h)) !== null; )
        e.push(u[1]);
    } else
      e.push(h);
    o.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: e.concat(_)
    });
  }, p || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[d] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function jt(h, d) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !d) return !1;
  const b = d.getAttribute("href");
  return !(!b || d.getAttribute("target") === "_blank" || d.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || d.hostname && d.hostname !== window.location.hostname);
}
function V(...h) {
  return h.filter((d) => d != null && d !== "").map((d, b) => b === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function K(h, d) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, d ? { Authorization: d } : null);
}
function zt(h, d = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (b) {
    return console.error(`[${d}] Invalid headers JSON:`, b), {};
  }
}
const Vt = {};
function ee(h, d) {
  Vt[h] = d;
}
function ne(h) {
  return Vt[h] || { ingress: (d) => d, egress: (d) => d };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ee, window.lnCore.getDataMapper = ne, window.lnCore.fillTemplate = gt, window.lnCore.fill = $, window.lnCore.renderList = Zt);
function ie(h, d) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, h(), d && d();
    }));
  };
}
const oe = "ln:";
function re() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Kt(h, d) {
  const b = d.getAttribute("data-ln-persist"), p = b !== null && b !== "" ? b : d.id;
  return p ? oe + h + ":" + re() + ":" + p : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', d), null);
}
function vt(h, d) {
  const b = Kt(h, d);
  if (!b) return null;
  try {
    const p = localStorage.getItem(b);
    return p !== null ? JSON.parse(p) : null;
  } catch {
    return null;
  }
}
function st(h, d, b) {
  const p = Kt(h, d);
  if (p)
    try {
      localStorage.setItem(p, JSON.stringify(b));
    } catch {
    }
}
function yt(h, d, b, p) {
  const g = typeof p == "number" ? p : 4, _ = window.innerWidth, i = window.innerHeight, l = d.width, t = d.height, o = (b || "bottom").split("-"), e = o[0], n = o[1] === "start" || o[1] === "end" ? o[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, s = u[e] || u.bottom;
  function r(y) {
    return y === "top" || y === "bottom" ? n === "start" ? h.left : n === "end" ? h.right - l : h.left + (h.width - l) / 2 : n === "start" ? h.top : n === "end" ? h.bottom - t : h.top + (h.height - t) / 2;
  }
  function c(y) {
    let A, E, S = !0;
    return y === "top" ? (A = h.top - g - t, E = r(y), A < 0 && (S = !1)) : y === "bottom" ? (A = h.bottom + g, E = r(y), A + t > i && (S = !1)) : y === "left" ? (A = r(y), E = h.left - g - l, E < 0 && (S = !1)) : (A = r(y), E = h.right + g, E + l > _ && (S = !1)), { top: A, left: E, side: y, fits: S };
  }
  let f = null;
  for (let y = 0; y < s.length; y++) {
    const A = c(s[y]);
    if (A.fits) {
      f = A;
      break;
    }
  }
  f || (f = c(s[0]));
  let a = f.top, m = f.left;
  return l >= _ ? m = 0 : (m < 0 && (m = 0), m + l > _ && (m = _ - l)), t >= i ? a = 0 : (a < 0 && (a = 0), a + t > i && (a = i - t)), { top: a, left: m, placement: f.side };
}
function Wt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const d = h.parentNode, b = document.createComment("ln-teleport");
  return d.insertBefore(b, h), document.body.appendChild(h), function() {
    b.parentNode && (b.parentNode.insertBefore(h, b), b.parentNode.removeChild(b));
  };
}
function Tt(h) {
  if (!h) return { width: 0, height: 0 };
  const d = h.style, b = d.visibility, p = d.display, g = d.position;
  d.visibility = "hidden", d.display = "block", d.position = "fixed";
  const _ = h.offsetWidth, i = h.offsetHeight;
  return d.visibility = b, d.display = p, d.position = g, { width: _, height: i };
}
let ot = null;
async function Ft(h) {
  if (!h) {
    ot = null;
    return;
  }
  try {
    const d = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", d.encode(h));
    ot = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (d) {
    console.error("[ln-core/crypto] Key derivation failed:", d), ot = null;
  }
}
function pt() {
  return ot;
}
async function se(h, d = ot) {
  const b = d || ot;
  if (!b || h === void 0 || h === null) return h;
  try {
    const p = new TextEncoder(), g = crypto.getRandomValues(new Uint8Array(12)), _ = typeof h == "string" ? h : JSON.stringify(h), i = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: g },
      b,
      p.encode(_)
    ), l = btoa(String.fromCharCode(...g)), t = btoa(String.fromCharCode(...new Uint8Array(i)));
    return {
      encrypted: !0,
      iv: l,
      data: t
    };
  } catch (p) {
    return console.error("[ln-core/crypto] Encryption failed:", p), h;
  }
}
async function le(h, d = ot) {
  const b = d || ot;
  if (!h || !h.encrypted || !b) return h;
  try {
    const p = new TextDecoder(), g = Uint8Array.from(atob(h.iv), (t) => t.charCodeAt(0)), _ = Uint8Array.from(atob(h.data), (t) => t.charCodeAt(0)), i = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: g },
      b,
      _
    ), l = p.decode(i);
    try {
      return JSON.parse(l);
    } catch {
      return l;
    }
  } catch (p) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", p), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), d = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function p(o) {
    return typeof o == "string" ? o : o instanceof URL ? o.href : o instanceof Request ? o.url : String(o);
  }
  function g(o, e) {
    return e && e.method ? String(e.method).toUpperCase() : o instanceof Request ? o.method.toUpperCase() : "GET";
  }
  function _(o, e) {
    return e + " " + o;
  }
  function i(o) {
    return o === "GET" || o === "HEAD";
  }
  function l(o, e) {
    e = e || {};
    const n = p(o), u = g(o, e), s = _(n, u);
    i(u) && d.has(s) && (d.get(s).abort(), d.delete(s));
    const r = new AbortController(), c = e.signal;
    c && (c.aborted ? r.abort(c.reason) : c.addEventListener("abort", function() {
      r.abort(c.reason);
    }, { once: !0 }));
    const f = Object.assign({}, e, { signal: r.signal });
    return d.set(s, r), h(o, f).finally(function() {
      d.get(s) === r && d.delete(s);
    });
  }
  l.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = l;
  function t(o) {
    const e = o.detail || {};
    if (!e.url) return;
    const n = o.target, u = (e.method || (e.body ? "POST" : "GET")).toUpperCase(), s = e.key;
    s && b.has(s) && (b.get(s).abort(), b.delete(s));
    const r = new AbortController(), c = e.signal;
    c && (c.aborted ? r.abort(c.reason) : c.addEventListener("abort", function() {
      r.abort(c.reason);
    }, { once: !0 })), s && b.set(s, r);
    const f = { method: u, signal: r.signal };
    e.body !== void 0 && (f.body = e.body), window.fetch(e.url, f).then(function(a) {
      s && b.get(s) === r && b.delete(s), w(n, "ln-http:response", {
        ok: a.ok,
        status: a.status,
        response: a
      });
    }).catch(function(a) {
      s && b.get(s) === r && b.delete(s), !(a && a.name === "AbortError") && w(n, "ln-http:error", {
        ok: !1,
        status: 0,
        error: a
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(o) {
      let e = !1;
      return d.forEach(function(n, u) {
        u.endsWith(" " + o) && (n.abort(), d.delete(u), e = !0);
      }), e;
    },
    cancelByKey: function(o) {
      return b.has(o) ? (b.get(o).abort(), b.delete(o), !0) : !1;
    },
    cancelAll: function() {
      d.forEach(function(o) {
        o.abort();
      }), d.clear(), b.forEach(function(o) {
        o.abort();
      }), b.clear();
    },
    get inflight() {
      const o = [];
      return d.forEach(function(e, n) {
        const u = n.indexOf(" ");
        o.push({ method: n.slice(0, u), url: n.slice(u + 1) });
      }), b.forEach(function(e, n) {
        o.push({ key: n });
      }), o;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", t), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", d = "lnAjax";
  if (window[d] !== void 0) return;
  function b(e) {
    if (!e.hasAttribute(h) || e[d]) return;
    e[d] = !0;
    const n = l(e);
    p(n.links), g(n.forms);
  }
  function p(e) {
    for (const n of e) {
      if (n[d + "Trigger"] || n.hostname && n.hostname !== window.location.hostname) continue;
      const u = n.getAttribute("href");
      if (u && u.includes("#")) continue;
      const s = function(r) {
        if (!jt(r, n)) return;
        r.preventDefault();
        const c = n.getAttribute("href");
        c && i("GET", c, null, n);
      };
      n.addEventListener("click", s), n[d + "Trigger"] = s;
    }
  }
  function g(e) {
    for (const n of e) {
      if (n[d + "Trigger"]) continue;
      const u = function(s) {
        s.preventDefault();
        const r = n.method.toUpperCase(), c = n.action, f = new FormData(n);
        for (const a of n.querySelectorAll('button, input[type="submit"]'))
          a.disabled = !0;
        i(r, c, f, n, function() {
          for (const a of n.querySelectorAll('button, input[type="submit"]'))
            a.disabled = !1;
        });
      };
      n.addEventListener("submit", u), n[d + "Trigger"] = u;
    }
  }
  function _(e) {
    if (!e[d]) return;
    const n = l(e);
    for (const u of n.links)
      u[d + "Trigger"] && (u.removeEventListener("click", u[d + "Trigger"]), delete u[d + "Trigger"]);
    for (const u of n.forms)
      u[d + "Trigger"] && (u.removeEventListener("submit", u[d + "Trigger"]), delete u[d + "Trigger"]);
    delete e[d];
  }
  function i(e, n, u, s, r) {
    if (z(s, "ln-ajax:before-start", { method: e, url: n }).defaultPrevented) return;
    w(s, "ln-ajax:start", { method: e, url: n }), s.classList.add("ln-ajax--loading");
    const f = document.createElement("span");
    f.className = "ln-ajax-spinner", s.appendChild(f);
    function a() {
      s.classList.remove("ln-ajax--loading");
      const S = s.querySelector(".ln-ajax-spinner");
      S && S.remove(), r && r();
    }
    let m = n;
    const y = document.querySelector('meta[name="csrf-token"]'), A = y ? y.getAttribute("content") : null;
    u instanceof FormData && A && u.append("_token", A);
    const E = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (A && (E.headers["X-CSRF-TOKEN"] = A), e === "GET" && u) {
      const S = new URLSearchParams(u);
      m = n + (n.includes("?") ? "&" : "?") + S.toString();
    } else e !== "GET" && u && (E.body = u);
    fetch(m, E).then(function(S) {
      const L = S.ok;
      return S.json().then(function(D) {
        return { ok: L, status: S.status, data: D };
      });
    }).then(function(S) {
      const L = S.data;
      if (S.ok) {
        if (L.title && (document.title = L.title), L.content)
          for (const D in L.content) {
            const O = document.getElementById(D);
            if (O) {
              let x = L.content[D];
              window.DOMPurify && typeof window.DOMPurify.sanitize == "function" ? x = window.DOMPurify.sanitize(x) : x = x.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""), O.innerHTML = x;
            }
          }
        if (s.tagName === "A") {
          const D = s.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else s.tagName === "FORM" && s.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", m);
        w(s, "ln-ajax:success", { method: e, url: m, data: L });
      } else
        w(s, "ln-ajax:error", { method: e, url: m, status: S.status, data: L });
      if (L.message) {
        const D = L.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: D.type || (S.ok ? "success" : "error"),
            title: D.title || "",
            message: D.body || ""
          }
        }));
      }
      w(s, "ln-ajax:complete", { method: e, url: m }), a();
    }).catch(function(S) {
      w(s, "ln-ajax:error", { method: e, url: m, error: S }), w(s, "ln-ajax:complete", { method: e, url: m }), a();
    });
  }
  function l(e) {
    const n = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? n.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? n.forms.push(e) : (n.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function t() {
    W(function() {
      new MutationObserver(function(n) {
        for (const u of n)
          if (u.type === "childList") {
            for (const s of u.addedNodes)
              if (s.nodeType === 1 && (b(s), !s.hasAttribute(h))) {
                for (const c of s.querySelectorAll("[" + h + "]"))
                  b(c);
                const r = s.closest && s.closest("[" + h + "]");
                if (r && r.getAttribute(h) !== "false") {
                  const c = l(s);
                  p(c.links), g(c.forms);
                }
              }
          } else u.type === "attributes" && b(u.target);
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
      b(e);
  }
  window[d] = b, window[d].destroy = _, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
const ae = {
  navigate: function(h) {
    Nt(h, { historyAction: "push" });
  },
  replace: function(h) {
    Nt(h, { historyAction: "replace" });
  },
  current: function() {
    return Dt ? {
      path: kt,
      params: $t,
      query: Yt,
      route: Dt
    } : null;
  }
}, xt = "data-ln-route", Gt = "lnRoute";
typeof window < "u" && (window.lnRouter = ae);
const lt = /* @__PURE__ */ new Map();
let Ot = [], Mt = !1, kt = null, $t = {}, Yt = {}, Dt = null;
function Et(h) {
  let [d] = h.split("#"), [b, p] = d.split("?");
  const g = {};
  if (p) {
    const _ = new URLSearchParams(p);
    for (const [i, l] of _.entries())
      g[i] = l;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: g };
}
function Xt(h, d) {
  if (h.pattern === "*") return 1;
  if (d.pattern === "*") return -1;
  const b = h.segments, p = d.segments, g = Math.max(b.length, p.length);
  for (let _ = 0; _ < g; _++) {
    const i = b[_], l = p[_];
    if (i === void 0) return 1;
    if (l === void 0) return -1;
    if (i === "*") return 1;
    if (l === "*") return -1;
    const t = i.startsWith(":"), o = l.startsWith(":");
    if (t && !o) return 1;
    if (!t && o) return -1;
  }
  return 0;
}
function At(h) {
  const d = h.split("/").filter(Boolean);
  for (const b of Ot) {
    if (b.pattern === "*")
      return {
        route: b,
        params: { wildcard: h }
      };
    const p = b.segments, g = {};
    let _ = !0;
    if (!(d.length > p.length && p[p.length - 1] !== "*")) {
      for (let i = 0; i < p.length; i++) {
        const l = p[i], t = d[i];
        if (l === "*") {
          g.wildcard = d.slice(i).join("/");
          break;
        }
        if (t === void 0) {
          _ = !1;
          break;
        }
        if (l.startsWith(":"))
          g[l.slice(1)] = decodeURIComponent(t);
        else if (l !== t) {
          _ = !1;
          break;
        }
      }
      if (_ && (p.indexOf("*") !== -1 || d.length <= p.length))
        return { route: b, params: g };
    }
  }
  return null;
}
function It(h) {
  if (h.target) {
    const b = document.getElementById(h.target);
    return b || console.warn(`[ln-router] Explicit target element #${h.target} not found in DOM`), b;
  }
  const d = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return d || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), d;
}
function ce(h) {
  if (!h) return;
  const d = Array.from(h.querySelectorAll("*")), b = [h].concat(d);
  for (const g of b)
    for (const _ of Object.keys(g))
      if (_.startsWith("ln") && g[_] && typeof g[_].destroy == "function")
        try {
          g[_].destroy();
        } catch (i) {
          console.error(`[ln-router] Error destroying component ${_} on element:`, g, i);
        }
  const p = document.querySelectorAll('[data-ln-popover="open"]');
  for (const g of p) {
    const _ = g.lnPopover;
    if (_ && _.trigger && h.contains(_.trigger))
      try {
        _.destroy();
      } catch (i) {
        console.error("[ln-router] Error destroying open teleported popover:", i);
      }
  }
}
function St(h, d, b, p, g = {}) {
  const _ = It(h);
  if (!_ || z(_, "ln-router:before-navigate", {
    from: kt,
    to: p,
    params: d,
    query: b
  }).defaultPrevented)
    return;
  g.historyAction === "push" ? window.history.pushState(null, "", p) : g.historyAction === "replace" && window.history.replaceState(null, "", p);
  const o = () => {
    if (g.isHydration || ce(_), !g.isHydration) {
      const e = h.templateNode.content.cloneNode(!0);
      _.replaceChildren(e);
    }
    if (h.title && (document.title = h.title), !g.isHydration) {
      _.hasAttribute("tabindex") || _.setAttribute("tabindex", "-1");
      const e = _.querySelector("h1, h2, h3, h4, h5, h6");
      e ? (e.setAttribute("tabindex", "-1"), e.focus()) : _.focus(), _.scrollIntoView({ block: "start", behavior: "instant" });
    }
    kt = p, $t = d, Yt = b, Dt = h, w(_, "ln-router:navigated", {
      path: p,
      params: d,
      query: b,
      route: h,
      target: _
    });
  };
  document.startViewTransition && !g.isHydration ? document.startViewTransition(o) : o();
}
function Nt(h, d = {}) {
  const { path: b, query: p } = Et(h), g = At(b);
  g ? St(g.route, g.params, p, h, d) : w(document.body, "ln-router:not-found", { path: b });
}
function de(h) {
  const d = h.target.closest("a");
  if (!d || !jt(h, d)) return;
  const b = d.getAttribute("href"), { path: p, query: g } = Et(b), _ = At(p);
  _ && (h.preventDefault(), St(_.route, _.params, g, b, { historyAction: "push" }));
}
function ue() {
  const h = window.location.pathname + window.location.search, { path: d, query: b } = Et(h), p = At(d);
  p ? St(p.route, p.params, b, h, { historyAction: "skip" }) : w(document.body, "ln-router:not-found", { path: d });
}
function he() {
  Mt || (Mt = !0, W(function() {
    document.addEventListener("click", de), window.addEventListener("popstate", ue);
    const h = window.location.pathname + window.location.search, { path: d, query: b } = Et(h), p = At(d);
    if (p) {
      const g = It(p.route), _ = g && g.hasAttribute("data-ln-router-hydrate") && g.children.length > 0;
      St(p.route, p.params, b, h, {
        historyAction: "replace",
        isHydration: _
      });
    } else
      w(document.body, "ln-router:not-found", { path: d });
  }, "ln-router"));
}
function fe(h) {
  const d = h.getAttribute(xt);
  if (!d) return;
  if (lt.has(d)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${d}"`);
    return;
  }
  const b = h.getAttribute("data-ln-route-target"), p = h.getAttribute("data-ln-route-title"), g = d.split("/").filter(Boolean), _ = {
    pattern: d,
    segments: g,
    target: b,
    title: p,
    templateNode: h
  }, i = It(_);
  i && i.contains(h) && console.warn(`[ln-router] Route template with pattern "${d}" is declared inside its own outlet element:`, h), lt.set(d, _), Ot = Array.from(lt.values()).sort(Xt), he();
}
function pe(h) {
  const d = h.getAttribute(xt);
  d && lt.has(d) && (lt.delete(d), Ot = Array.from(lt.values()).sort(Xt));
}
function Jt(h) {
  return this.dom = h, fe(h), this;
}
Jt.prototype.destroy = function() {
  pe(this.dom), delete this.dom[Gt];
};
B(xt, Gt, Jt, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"]
});
(function() {
  const h = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0) return;
  function b(i) {
    const l = Array.from(i.querySelectorAll("[data-ln-modal-for]"));
    i.hasAttribute && i.hasAttribute("data-ln-modal-for") && l.push(i);
    for (const t of l) {
      if (t[d + "Trigger"]) continue;
      const o = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const n = t.getAttribute("data-ln-modal-for"), u = document.getElementById(n);
        if (!u) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + n + '"');
          return;
        }
        if (!u[d]) return;
        const s = u.getAttribute(h);
        u.setAttribute(h, s === "open" ? "close" : "open");
      };
      t.addEventListener("click", o), t[d + "Trigger"] = o;
    }
  }
  function p(i) {
    this.dom = i, this.isOpen = i.getAttribute(h) === "open";
    const l = this;
    return this._onEscape = function(t) {
      t.key === "Escape" && l.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(t) {
      if (t.key !== "Tab") return;
      const o = Array.prototype.filter.call(
        l.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        mt
      );
      if (o.length === 0) return;
      const e = o[0], n = o[o.length - 1];
      t.shiftKey ? document.activeElement === e && (t.preventDefault(), n.focus()) : document.activeElement === n && (t.preventDefault(), e.focus());
    }, this._onClose = function(t) {
      t.preventDefault(), l.dom.setAttribute(h, "close");
    }, _(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const i = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of i)
      t[d + "Close"] && (t.removeEventListener("click", t[d + "Close"]), delete t[d + "Close"]);
    const l = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const t of l)
      t[d + "Trigger"] && (t.removeEventListener("click", t[d + "Trigger"]), delete t[d + "Trigger"]);
    w(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[d];
  };
  function g(i) {
    const l = i[d];
    if (!l) return;
    const o = i.getAttribute(h) === "open";
    if (o !== l.isOpen)
      if (o) {
        if (z(i, "ln-modal:before-open", { modalId: i.id, target: i }).defaultPrevented) {
          i.setAttribute(h, "close");
          return;
        }
        l.isOpen = !0, i.setAttribute("aria-modal", "true"), i.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", l._onEscape), document.addEventListener("keydown", l._onFocusTrap);
        const n = document.activeElement;
        l._returnFocusEl = n && n !== document.body ? n : null;
        const u = i.querySelector("[autofocus]");
        if (u && mt(u))
          u.focus();
        else {
          const s = i.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), r = Array.prototype.find.call(s, mt);
          if (r) r.focus();
          else {
            const c = i.querySelectorAll("a[href], button:not([disabled])"), f = Array.prototype.find.call(c, mt);
            f && f.focus();
          }
        }
        w(i, "ln-modal:open", { modalId: i.id, target: i });
      } else {
        if (z(i, "ln-modal:before-close", { modalId: i.id, target: i }).defaultPrevented) {
          i.setAttribute(h, "open");
          return;
        }
        l.isOpen = !1, i.removeAttribute("aria-modal"), document.removeEventListener("keydown", l._onEscape), document.removeEventListener("keydown", l._onFocusTrap), w(i, "ln-modal:close", { modalId: i.id, target: i }), l._returnFocusEl && document.contains(l._returnFocusEl) && typeof l._returnFocusEl.focus == "function" && l._returnFocusEl.focus(), l._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function _(i) {
    const l = i.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of l)
      t[d + "Close"] || (t.addEventListener("click", i._onClose), t[d + "Close"] = i._onClose);
  }
  B(h, d, p, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: g,
    onInit: b
  });
})();
(function() {
  const h = "data-ln-number", d = "lnNumber";
  if (window[d] !== void 0) return;
  const b = {}, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(t) {
    if (!b[t]) {
      const o = new Intl.NumberFormat(t, { useGrouping: !0 }), e = o.formatToParts(1234.5);
      let n = "", u = ".";
      for (let s = 0; s < e.length; s++)
        e[s].type === "group" && (n = e[s].value), e[s].type === "decimal" && (u = e[s].value);
      b[t] = { fmt: o, groupSep: n, decimalSep: u };
    }
    return b[t];
  }
  function _(t, o, e) {
    if (e !== null) {
      const n = parseInt(e, 10), u = t + "|d" + n;
      return b[u] || (b[u] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: n })), b[u].format(o);
    }
    return g(t).fmt.format(o);
  }
  function i(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[d]) return t[d];
    t[d] = this, this.dom = t;
    const o = document.createElement("input");
    o.type = "hidden", o.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", o), this._hidden = o;
    const e = this;
    Object.defineProperty(o, "value", {
      get: function() {
        return p.get.call(o);
      },
      set: function(u) {
        if (p.set.call(o, u), u !== "" && !isNaN(parseFloat(u))) {
          const s = parseFloat(u);
          e._displayFormatted(s), w(e.dom, "ln-number:input", { value: s, formatted: e.dom.value }), e.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        } else u === "" && (e.dom.value = "", w(e.dom, "ln-number:input", { value: NaN, formatted: "" }), e.dom.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
    }), Ut(t, p, {
      get: function() {
        return p.get.call(t);
      },
      set: function(u, s) {
        if (e._isFormatting) {
          s(u);
          return;
        }
        if (u === "") {
          s(""), e._setHiddenRaw(""), w(t, "ln-number:input", { value: NaN, formatted: "" }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        let r = typeof u == "number" ? u : parseFloat(String(u).replace(/[^\d.-]/g, ""));
        if (isNaN(r))
          s(String(u)), e._setHiddenRaw(""), w(t, "ln-number:input", { value: NaN, formatted: String(u) }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        else {
          e._setHiddenRaw(r);
          const c = _(J(t), r, t.getAttribute("data-ln-number-decimals"));
          s(c), w(t, "ln-number:input", { value: r, formatted: c }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(u) {
      u.preventDefault();
      const s = (u.clipboardData || window.clipboardData).getData("text"), r = g(J(t)), c = r.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let f = s.replace(new RegExp("[^0-9\\-" + c + ".]", "g"), "");
      r.groupSep && (f = f.split(r.groupSep).join("")), r.decimalSep !== "." && (f = f.replace(r.decimalSep, "."));
      const a = parseFloat(f);
      isNaN(a) ? (t.value = "", e._hidden.value = "") : e.value = a;
    }, t.addEventListener("paste", this._onPaste);
    const n = t.value;
    if (n !== "") {
      const u = parseFloat(n);
      isNaN(u) || (this._displayFormatted(u), p.set.call(o, String(u)), w(t, "ln-number:input", { value: u, formatted: t.value }), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  i.prototype._handleInput = function() {
    const t = this.dom, o = g(J(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", w(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const n = t.selectionStart;
    let u = 0;
    for (let S = 0; S < n; S++)
      /[0-9]/.test(e[S]) && u++;
    let s = e;
    if (o.groupSep && (s = s.split(o.groupSep).join("")), s = s.replace(o.decimalSep, "."), e.endsWith(o.decimalSep) || e.endsWith(".")) {
      const S = s.replace(/\.$/, ""), L = parseFloat(S);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const r = s.indexOf(".");
    if (r !== -1 && s.slice(r + 1).endsWith("0")) {
      const L = parseFloat(s);
      isNaN(L) || this._setHiddenRaw(L);
      return;
    }
    const c = t.getAttribute("data-ln-number-decimals");
    if (c !== null && r !== -1) {
      const S = parseInt(c, 10);
      s.slice(r + 1).length > S && (s = s.slice(0, r + 1 + S));
    }
    const f = parseFloat(s);
    if (isNaN(f)) return;
    const a = t.getAttribute("data-ln-number-min"), m = t.getAttribute("data-ln-number-max");
    if (a !== null && f < parseFloat(a) || m !== null && f > parseFloat(m)) return;
    let y;
    if (c !== null)
      y = _(J(t), f, c);
    else {
      const S = r !== -1 ? s.slice(r + 1).length : 0;
      if (S > 0) {
        const L = J(t) + "|u" + S;
        b[L] || (b[L] = new Intl.NumberFormat(J(t), { useGrouping: !0, minimumFractionDigits: S, maximumFractionDigits: S })), y = b[L].format(f);
      } else
        y = o.fmt.format(f);
    }
    t.value = y;
    let A = u, E = 0;
    for (let S = 0; S < y.length && A > 0; S++)
      E = S + 1, /[0-9]/.test(y[S]) && A--;
    A > 0 && (E = y.length), t.setSelectionRange(E, E), this._setHiddenRaw(f), w(t, "ln-number:input", { value: f, formatted: y });
  }, i.prototype._setHiddenRaw = function(t) {
    p.set.call(this._hidden, String(t));
  }, i.prototype._displayFormatted = function(t) {
    this._isFormatting = !0, this.dom.value = _(J(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")), this._isFormatting = !1;
  }, Object.defineProperty(i.prototype, "value", {
    get: function() {
      const t = this._hidden.value;
      return t === "" ? NaN : parseFloat(t);
    },
    set: function(t) {
      if (typeof t != "number" || isNaN(t)) {
        this.dom.value = "", this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._displayFormatted(t), this._setHiddenRaw(t), w(this.dom, "ln-number:input", {
        value: t,
        formatted: this.dom.value
      }), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(i.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), i.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), w(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function l() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let o = 0; o < t.length; o++) {
        const e = t[o][d];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, d, i, "ln-number"), l();
})();
(function() {
  const h = "data-ln-date", d = "lnDate";
  if (window[d] !== void 0) return;
  const b = {}, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(r, c) {
    const f = r + "|" + JSON.stringify(c);
    return b[f] || (b[f] = new Intl.DateTimeFormat(r, c)), b[f];
  }
  const _ = /^(short|medium|long)(\s+datetime)?$/, i = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function l(r) {
    return !r || r === "" ? { dateStyle: "medium" } : r.match(_) ? i[r] : null;
  }
  function t(r, c, f) {
    const a = r.getDate(), m = r.getMonth(), y = r.getFullYear(), A = r.getHours(), E = r.getMinutes(), S = {
      yyyy: String(y),
      yy: String(y).slice(-2),
      MMMM: g(f, { month: "long" }).format(r),
      MMM: g(f, { month: "short" }).format(r),
      MM: String(m + 1).padStart(2, "0"),
      M: String(m + 1),
      dd: String(a).padStart(2, "0"),
      d: String(a),
      HH: String(A).padStart(2, "0"),
      mm: String(E).padStart(2, "0")
    };
    return c.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(L) {
      return S[L];
    });
  }
  function o(r, c, f) {
    const a = l(c);
    return a ? g(f, a).format(r) : t(r, c, f);
  }
  function e(r) {
    if (r.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", r.tagName), this;
    if (r[d]) return r[d];
    r[d] = this, this.dom = r;
    const c = this, f = r.value, a = r.name, m = document.createElement("span");
    m.setAttribute("data-ln-date-field", ""), r.parentNode.insertBefore(m, r), m.appendChild(r), this._wrapper = m;
    const y = document.createElement("input");
    y.type = "hidden", y.name = a, r.removeAttribute("name"), r.insertAdjacentElement("afterend", y), this._hidden = y;
    const A = document.createElement("input");
    A.type = "date", A.tabIndex = -1, A.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", y.insertAdjacentElement("afterend", A), this._picker = A, r.type = "text";
    const E = document.createElement("button");
    if (E.type = "button", E.setAttribute("aria-label", "Open date picker"), E.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', A.insertAdjacentElement("afterend", E), this._btn = E, this._lastISO = "", Object.defineProperty(y, "value", {
      get: function() {
        return p.get.call(y);
      },
      set: function(S) {
        if (p.set.call(y, S), S && S !== "") {
          const L = n(S);
          L && (c._displayFormatted(L), p.set.call(A, S), c._lastISO = S, w(c.dom, "ln-date:change", {
            value: S,
            formatted: c.dom.value,
            date: L
          }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else S === "" && (c.dom.value = "", p.set.call(A, ""), c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), Ut(r, p, {
      get: function() {
        return p.get.call(r);
      },
      set: function(S, L) {
        if (c._isFormatting) {
          L(S);
          return;
        }
        if (!S || S === "") {
          L(""), c._setHiddenRaw(""), p.set.call(c._picker, ""), c._lastISO = "", w(r, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), r.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let D = n(S);
        if (D || (D = u(S)), D) {
          const O = D.getFullYear(), x = String(D.getMonth() + 1).padStart(2, "0"), I = String(D.getDate()).padStart(2, "0"), N = O + "-" + x + "-" + I;
          c._setHiddenRaw(N), p.set.call(c._picker, N), c._lastISO = N;
          const j = r.getAttribute(h) || "", Z = J(r), tt = o(D, j, Z);
          L(tt), w(r, "ln-date:change", {
            value: N,
            formatted: tt,
            date: D
          }), r.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          L(String(S)), c._setHiddenRaw(""), p.set.call(c._picker, ""), c._lastISO = "", w(r, "ln-date:change", {
            value: "",
            formatted: String(S),
            date: null
          }), r.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const S = A.value;
      if (S) {
        const L = n(S);
        L && (c._setHiddenRaw(S), c._displayFormatted(L), c._lastISO = S, w(c.dom, "ln-date:change", {
          value: S,
          formatted: c.dom.value,
          date: L
        }));
      } else
        c._setHiddenRaw(""), c.dom.value = "", c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const S = c.dom.value.trim();
      if (S === "") {
        c._lastISO !== "" && (c._setHiddenRaw(""), p.set.call(c._picker, ""), c.dom.value = "", c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (c._lastISO) {
        const D = n(c._lastISO);
        if (D) {
          const O = c.dom.getAttribute(h) || "", x = J(c.dom), I = o(D, O, x);
          if (S === I) return;
        }
      }
      const L = u(S);
      if (L) {
        const D = L.getFullYear(), O = String(L.getMonth() + 1).padStart(2, "0"), x = String(L.getDate()).padStart(2, "0"), I = D + "-" + O + "-" + x;
        c._setHiddenRaw(I), p.set.call(c._picker, I), c._displayFormatted(L), c._lastISO = I, w(c.dom, "ln-date:change", {
          value: I,
          formatted: c.dom.value,
          date: L
        });
      } else if (c._lastISO) {
        const D = n(c._lastISO);
        D && c._displayFormatted(D);
      } else
        c.dom.value = "";
    }, r.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      c._openPicker();
    }, E.addEventListener("click", this._onBtnClick), f && f !== "") {
      const S = n(f);
      S && (this._setHiddenRaw(f), p.set.call(A, f), this._displayFormatted(S), this._lastISO = f, w(r, "ln-date:change", {
        value: f,
        formatted: r.value,
        date: S
      }), r.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function n(r) {
    if (!r || typeof r != "string") return null;
    const c = r.split("T"), f = c[0].split("-");
    if (f.length < 3) return null;
    const a = parseInt(f[0], 10), m = parseInt(f[1], 10) - 1, y = parseInt(f[2], 10);
    if (isNaN(a) || isNaN(m) || isNaN(y)) return null;
    let A = 0, E = 0;
    if (c[1]) {
      const L = c[1].split(":");
      A = parseInt(L[0], 10) || 0, E = parseInt(L[1], 10) || 0;
    }
    const S = new Date(a, m, y, A, E);
    return S.getFullYear() !== a || S.getMonth() !== m || S.getDate() !== y ? null : S;
  }
  function u(r) {
    if (!r || typeof r != "string" || (r = r.trim(), r.length < 6)) return null;
    let c, f;
    if (r.indexOf(".") !== -1)
      c = ".", f = r.split(".");
    else if (r.indexOf("/") !== -1)
      c = "/", f = r.split("/");
    else if (r.indexOf("-") !== -1)
      c = "-", f = r.split("-");
    else
      return null;
    if (f.length !== 3) return null;
    const a = [];
    for (let S = 0; S < 3; S++) {
      const L = parseInt(f[S], 10);
      if (isNaN(L)) return null;
      a.push(L);
    }
    let m, y, A;
    c === "." ? (m = a[0], y = a[1], A = a[2]) : c === "/" ? (y = a[0], m = a[1], A = a[2]) : f[0].length === 4 ? (A = a[0], y = a[1], m = a[2]) : (m = a[0], y = a[1], A = a[2]), A < 100 && (A += A < 50 ? 2e3 : 1900);
    const E = new Date(A, y - 1, m);
    return E.getFullYear() !== A || E.getMonth() !== y - 1 || E.getDate() !== m ? null : E;
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
    p.set.call(this._hidden, r);
  }, e.prototype._displayFormatted = function(r) {
    const c = this.dom.getAttribute(h) || "", f = J(this.dom);
    this._isFormatting = !0, this.dom.value = o(r, c, f), this._isFormatting = !1;
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return p.get.call(this._hidden);
    },
    set: function(r) {
      if (!r || r === "") {
        this._setHiddenRaw(""), p.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const c = n(r);
      c && (this._setHiddenRaw(r), p.set.call(this._picker, r), this._displayFormatted(c), this._lastISO = r, w(this.dom, "ln-date:change", {
        value: r,
        formatted: this.dom.value,
        date: c
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const r = this.value;
      return r ? n(r) : null;
    },
    set: function(r) {
      if (!r || !(r instanceof Date) || isNaN(r.getTime())) {
        this.value = "";
        return;
      }
      const c = r.getFullYear(), f = String(r.getMonth() + 1).padStart(2, "0"), a = String(r.getDate()).padStart(2, "0");
      this.value = c + "-" + f + "-" + a;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const r = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), r && (this.dom.value = r), w(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function s() {
    new MutationObserver(function() {
      const r = document.querySelectorAll("[" + h + "]");
      for (let c = 0; c < r.length; c++) {
        const f = r[c][d];
        if (f && f.value) {
          const a = n(f.value);
          a && f._displayFormatted(a);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, d, e, "ln-date"), s();
})();
(function() {
  const h = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0) return;
  const b = /* @__PURE__ */ new WeakMap(), p = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const n of p)
        n();
    }, history._lnNavPatched = !0;
  }
  function g(e) {
    if (!e.hasAttribute(h) || b.has(e)) return;
    const n = e.getAttribute(h);
    if (!n) return;
    const u = _(e, n);
    b.set(e, u), e[d] = u;
  }
  function _(e, n) {
    let u = Array.from(e.querySelectorAll("a"));
    l(u, n, window.location.pathname);
    const s = function() {
      u = Array.from(e.querySelectorAll("a")), l(u, n, window.location.pathname);
    };
    window.addEventListener("popstate", s), p.push(s);
    const r = new MutationObserver(function(c) {
      for (const f of c)
        if (f.type === "childList") {
          for (const a of f.addedNodes)
            if (a.nodeType === 1) {
              if (a.tagName === "A")
                u.push(a), l([a], n, window.location.pathname);
              else if (a.querySelectorAll) {
                const m = Array.from(a.querySelectorAll("a"));
                u = u.concat(m), l(m, n, window.location.pathname);
              }
            }
          for (const a of f.removedNodes)
            if (a.nodeType === 1) {
              if (a.tagName === "A")
                u = u.filter(function(m) {
                  return m !== a;
                });
              else if (a.querySelectorAll) {
                const m = Array.from(a.querySelectorAll("a"));
                u = u.filter(function(y) {
                  return !m.includes(y);
                });
              }
            }
        }
    });
    return r.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: n,
      observer: r,
      updateHandler: s,
      destroy: function() {
        r.disconnect(), window.removeEventListener("popstate", s);
        const c = p.indexOf(s);
        c !== -1 && p.splice(c, 1), b.delete(e), delete e[d];
      }
    };
  }
  function i(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function l(e, n, u) {
    const s = i(u);
    for (const r of e) {
      const c = r.getAttribute("href");
      if (!c) continue;
      const f = i(c);
      r.classList.remove(n);
      const a = f === s, m = f !== "/" && s.startsWith(f + "/");
      (a || m) && r.classList.add(n);
    }
  }
  function t() {
    W(function() {
      new MutationObserver(function(n) {
        for (const u of n)
          if (u.type === "childList") {
            for (const s of u.addedNodes)
              if (s.nodeType === 1 && (s.hasAttribute && s.hasAttribute(h) && g(s), s.querySelectorAll))
                for (const r of s.querySelectorAll("[" + h + "]"))
                  g(r);
          } else u.type === "attributes" && u.target.hasAttribute && u.target.hasAttribute(h) && g(u.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[d] = g;
  function o() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      g(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const h = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function b() {
    const i = (location.hash || "").replace("#", ""), l = {};
    if (!i) return l;
    for (const t of i.split("&")) {
      const o = t.indexOf(":");
      o > 0 && (l[t.slice(0, o)] = t.slice(o + 1));
    }
    return l;
  }
  function p(i, l) {
    const t = (i.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (t) return t;
    if (i.tagName !== "A") return "";
    const o = i.getAttribute("href") || "";
    if (!o.startsWith("#")) return "";
    const e = o.slice(1);
    if (!e) return "";
    const n = e.split("&");
    if (l)
      for (const r of n) {
        const c = r.indexOf(":");
        if (c > 0 && r.slice(0, c).toLowerCase().trim() === l)
          return r.slice(c + 1).toLowerCase().trim();
      }
    const u = n[n.length - 1] || "", s = u.indexOf(":");
    return (s > 0 ? u.slice(s + 1) : u).toLowerCase().trim();
  }
  function g(i) {
    return this.dom = i, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const l of this.tabs) {
      const t = p(l, this.nsKey);
      t ? this.mapTabs[t] = l : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', l);
    }
    for (const l of this.panels) {
      const t = (l.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      t && (this.mapPanels[t] = l);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const i = this;
    this._clickHandlers = [];
    for (const l of this.tabs) {
      if (l[d + "Trigger"]) continue;
      const t = function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        const e = p(l, i.nsKey);
        if (e)
          if (l.tagName === "A" && o.preventDefault(), i.hashEnabled) {
            const n = b();
            n[i.nsKey] = e;
            const u = Object.keys(n).map(function(s) {
              return s + ":" + n[s];
            }).join("&");
            location.hash === "#" + u ? i.dom.setAttribute("data-ln-tabs-active", e) : location.hash = u;
          } else
            i.dom.setAttribute("data-ln-tabs-active", e);
      };
      l.addEventListener("click", t), l[d + "Trigger"] = t, i._clickHandlers.push({ el: l, handler: t });
    }
    if (this._hashHandler = function() {
      if (!i.hashEnabled) return;
      const l = b();
      i.dom.setAttribute("data-ln-tabs-active", i.nsKey in l ? l[i.nsKey] : i.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let l = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const t = vt("tabs", this.dom);
        t !== null && t in this.mapPanels && (l = t);
      }
      this.dom.setAttribute("data-ln-tabs-active", l);
    }
  }
  g.prototype._applyActive = function(i) {
    var l;
    (!i || !(i in this.mapPanels)) && (i = this.defaultKey);
    for (const t in this.mapTabs) {
      const o = this.mapTabs[t];
      t === i ? (o.setAttribute("data-active", ""), o.setAttribute("aria-selected", "true")) : (o.removeAttribute("data-active"), o.setAttribute("aria-selected", "false"));
    }
    for (const t in this.mapPanels) {
      const o = this.mapPanels[t], e = t === i;
      o.classList.toggle("hidden", !e), o.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const t = (l = this.mapPanels[i]) == null ? void 0 : l.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    w(this.dom, "ln-tabs:change", { key: i, tab: this.mapTabs[i], panel: this.mapPanels[i] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && st("tabs", this.dom, i);
  }, g.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const { el: i, handler: l } of this._clickHandlers)
        i.removeEventListener("click", l), delete i[d + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), w(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[d];
    }
  }, B(h, d, g, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(i) {
      const l = i.getAttribute("data-ln-tabs-active");
      i[d]._applyActive(l);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
  function b(i) {
    const l = Array.from(i.querySelectorAll("[data-ln-toggle-for]"));
    i.hasAttribute && i.hasAttribute("data-ln-toggle-for") && l.push(i);
    for (const t of l) {
      if (t[d + "Trigger"]) continue;
      const o = function(u) {
        if (u.ctrlKey || u.metaKey || u.button === 1) return;
        u.preventDefault();
        const s = t.getAttribute("data-ln-toggle-for"), r = document.getElementById(s);
        if (!r || !r[d]) return;
        const c = t.getAttribute("data-ln-toggle-action") || "toggle";
        if (c === "open")
          r.setAttribute(h, "open");
        else if (c === "close")
          r.setAttribute(h, "close");
        else if (c === "toggle") {
          const f = r.getAttribute(h);
          r.setAttribute(h, f === "open" ? "close" : "open");
        }
      };
      t.addEventListener("click", o), t[d + "Trigger"] = o;
      const e = t.getAttribute("data-ln-toggle-for"), n = document.getElementById(e);
      n && n[d] && t.setAttribute("aria-expanded", n[d].isOpen ? "true" : "false");
    }
  }
  function p(i, l) {
    const t = document.querySelectorAll(
      '[data-ln-toggle-for="' + i.id + '"]'
    );
    for (const o of t)
      o.setAttribute("aria-expanded", l ? "true" : "false");
  }
  function g(i) {
    if (this.dom = i, i.hasAttribute("data-ln-persist")) {
      const l = vt("toggle", i);
      l !== null && i.setAttribute(h, l);
    }
    return this.isOpen = i.getAttribute(h) === "open", this.isOpen && i.classList.add("open"), p(i, this.isOpen), this;
  }
  g.prototype.destroy = function() {
    if (!this.dom[d]) return;
    w(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const i = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const l of i)
      l[d + "Trigger"] && (l.removeEventListener("click", l[d + "Trigger"]), delete l[d + "Trigger"]);
    delete this.dom[d];
  };
  function _(i) {
    const l = i[d];
    if (!l) return;
    const o = i.getAttribute(h) === "open";
    if (o !== l.isOpen)
      if (o) {
        if (z(i, "ln-toggle:before-open", { target: i }).defaultPrevented) {
          i.setAttribute(h, "close");
          return;
        }
        l.isOpen = !0, i.classList.add("open"), p(i, !0), w(i, "ln-toggle:open", { target: i }), i.hasAttribute("data-ln-persist") && st("toggle", i, "open");
      } else {
        if (z(i, "ln-toggle:before-close", { target: i }).defaultPrevented) {
          i.setAttribute(h, "open");
          return;
        }
        l.isOpen = !1, i.classList.remove("open"), p(i, !1), w(i, "ln-toggle:close", { target: i }), i.hasAttribute("data-ln-persist") && st("toggle", i, "close");
      }
  }
  B(h, d, g, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: _,
    onInit: b
  });
})();
(function() {
  const h = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
  function b(p) {
    return this.dom = p, this._onToggleOpen = function(g) {
      if (g.detail.target.closest("[data-ln-accordion]") !== p) return;
      const _ = p.querySelectorAll("[data-ln-toggle]");
      for (const i of _)
        i !== g.detail.target && i.closest("[data-ln-accordion]") === p && i.getAttribute("data-ln-toggle") === "open" && i.setAttribute("data-ln-toggle", "close");
      w(p, "ln-accordion:change", { target: g.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), w(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, b, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", d = "lnDropdown";
  if (window[d] !== void 0) return;
  function b(p) {
    if (this.dom = p, this.toggleEl = p.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = p.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const _ of this.toggleEl.children)
        _.setAttribute("role", "menuitem");
    const g = this;
    return this._onToggleOpen = function(_) {
      _.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "true"), g._teleportRestore = Wt(g.toggleEl), g.toggleEl.style.position = "fixed", g.toggleEl.style.right = "auto", g._reposition(), g._addOutsideClickListener(), g._addScrollRepositionListener(), g._addResizeCloseListener(), w(p, "ln-dropdown:open", { target: _.detail.target }));
    }, this._onToggleClose = function(_) {
      _.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "false"), g._removeOutsideClickListener(), g._removeScrollRepositionListener(), g._removeResizeCloseListener(), g.toggleEl.style.position = "", g.toggleEl.style.top = "", g.toggleEl.style.left = "", g.toggleEl.style.right = "", g.toggleEl.style.transform = "", g.toggleEl.style.margin = "", g._teleportRestore && (g._teleportRestore(), g._teleportRestore = null), w(p, "ln-dropdown:close", { target: _.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  b.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const p = this.triggerBtn.getBoundingClientRect(), g = Tt(this.toggleEl), _ = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, i = yt(p, g, "bottom-end", _);
    this.toggleEl.style.top = i.top + "px", this.toggleEl.style.left = i.left + "px";
  }, b.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const p = this;
    this._boundDocClick = function(g) {
      p.dom.contains(g.target) || p.toggleEl && p.toggleEl.contains(g.target) || p.toggleEl && p.toggleEl.getAttribute("data-ln-toggle") === "open" && p.toggleEl.setAttribute("data-ln-toggle", "close");
    }, p._docClickTimeout = setTimeout(function() {
      p._docClickTimeout = null, document.addEventListener("click", p._boundDocClick);
    }, 0);
  }, b.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, b.prototype._addScrollRepositionListener = function() {
    const p = this;
    this._boundScrollReposition = function() {
      p._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, b.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, b.prototype._addResizeCloseListener = function() {
    const p = this;
    this._boundResizeClose = function() {
      p.toggleEl && p.toggleEl.getAttribute("data-ln-toggle") === "open" && p.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, b.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, b.prototype.destroy = function() {
    this.dom[d] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), w(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, b, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", d = "lnPopover", b = "data-ln-popover-for", p = "data-ln-popover-position";
  if (window[d] !== void 0) return;
  const g = [];
  let _ = null;
  function i() {
    _ || (_ = function(e) {
      if (e.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", _));
  }
  function l() {
    g.length > 0 || _ && (document.removeEventListener("keydown", _), _ = null);
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
    this.isOpen = !0, e && (this.trigger = e), this._previousFocus = document.activeElement, this._teleportRestore = Wt(this.dom);
    const n = Tt(this.dom);
    if (this.trigger) {
      const c = this.trigger.getBoundingClientRect(), f = this.dom.getAttribute(p) || "bottom", a = yt(c, n, f, 8);
      this.dom.style.top = a.top + "px", this.dom.style.left = a.left + "px", this.dom.setAttribute("data-ln-popover-placement", a.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const u = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), s = Array.prototype.find.call(u, mt);
    s ? s.focus() : this.dom.focus();
    const r = this;
    this._boundDocClick = function(c) {
      r.dom.contains(c.target) || r.trigger && r.trigger.contains(c.target) || r.close();
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!r.trigger) return;
      const c = r.trigger.getBoundingClientRect(), f = Tt(r.dom), a = r.dom.getAttribute(p) || "bottom", m = yt(c, f, a, 8);
      r.dom.style.top = m.top + "px", r.dom.style.left = m.left + "px", r.dom.setAttribute("data-ln-popover-placement", m.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), i(), w(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const e = g.indexOf(this);
    e !== -1 && g.splice(e, 1), l(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, w(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[d] && (this.isOpen && this._applyClose(), delete this.dom[d], w(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(e) {
    this.dom = e;
    const n = e.getAttribute(b);
    return e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-controls", n), this._onClick = function(u) {
      if (u.ctrlKey || u.metaKey || u.button === 1) return;
      u.preventDefault();
      const s = document.getElementById(n);
      !s || !s[d] || s[d].toggle(e);
    }, e.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[d + "Trigger"];
  }, B(h, d, t, "ln-popover", {
    onAttributeChange: function(e) {
      const n = e[d];
      if (!n) return;
      const s = e.getAttribute(h) === "open";
      if (s !== n.isOpen)
        if (s) {
          if (z(e, "ln-popover:before-open", {
            popoverId: e.id,
            target: e,
            trigger: n.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "closed");
            return;
          }
          n._applyOpen(n.trigger);
        } else {
          if (z(e, "ln-popover:before-close", {
            popoverId: e.id,
            target: e,
            trigger: n.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "open");
            return;
          }
          n._applyClose();
        }
    }
  }), B(b, d + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", d = "data-ln-tooltip", b = "data-ln-tooltip-position", p = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[p] !== void 0) return;
  let _ = 0, i = null, l = null, t = null, o = null, e = null;
  function n() {
    return i && i.parentNode || (i = document.getElementById(g), i || (i = document.createElement("div"), i.id = g, document.body.appendChild(i))), i;
  }
  function u() {
    e || (e = function(a) {
      a.key === "Escape" && c();
    }, document.addEventListener("keydown", e));
  }
  function s() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function r(a) {
    if (t === a) return;
    c();
    const m = a.getAttribute(d) || a.getAttribute("title");
    if (!m) return;
    n(), a.hasAttribute("title") && (o = a.getAttribute("title"), a.removeAttribute("title"));
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = m, a[p + "Uid"] || (_ += 1, a[p + "Uid"] = "ln-tooltip-" + _), y.id = a[p + "Uid"], i.appendChild(y);
    const A = y.offsetWidth, E = y.offsetHeight, S = a.getBoundingClientRect(), L = a.getAttribute(b) || "top", D = yt(S, { width: A, height: E }, L, 6);
    y.style.top = D.top + "px", y.style.left = D.left + "px", y.setAttribute("data-ln-tooltip-placement", D.placement), a.setAttribute("aria-describedby", y.id), l = y, t = a, u();
  }
  function c() {
    if (!l) {
      s();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), o !== null && t.setAttribute("title", o)), o = null, l.parentNode && l.parentNode.removeChild(l), l = null, t = null, s();
  }
  function f(a) {
    return this.dom = a, a.hasAttribute("data-ln-tooltip-enhanced") || (a.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      r(a);
    }, this._onLeave = function() {
      t === a && c();
    }, this._onFocus = function() {
      r(a);
    }, this._onBlur = function() {
      t === a && c();
    }, a.addEventListener("mouseenter", this._onEnter), a.addEventListener("mouseleave", this._onLeave), a.addEventListener("focus", this._onFocus, !0), a.addEventListener("blur", this._onBlur, !0), this;
  }
  f.prototype.destroy = function() {
    const a = this.dom;
    a.removeEventListener("mouseenter", this._onEnter), a.removeEventListener("mouseleave", this._onLeave), a.removeEventListener("focus", this._onFocus, !0), a.removeEventListener("blur", this._onBlur, !0), t === a && c(), this._addedEnhancedAttr && a.removeAttribute("data-ln-tooltip-enhanced"), delete a[p], delete a[p + "Uid"], w(a, "ln-tooltip:destroyed", { trigger: a });
  }, B(
    "[" + h + "], [" + d + "][title]",
    p,
    f,
    "ln-tooltip"
  );
})();
const me = `<li class="ln-toast__item">\r
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
  const h = "data-ln-toast", d = "lnToast", b = "ln-toast-item", p = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, g = { success: "success", error: "error", warn: "warning", info: "info" }, _ = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function i() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const a = document.createElement("template");
    a.setAttribute("data-ln-template", "ln-toast-item"), a.innerHTML = me, document.body.appendChild(a);
  }
  function l(a) {
    if (!a || a.nodeType !== 1) return;
    const m = Array.from(a.querySelectorAll("[" + h + "]"));
    a.hasAttribute && a.hasAttribute(h) && m.push(a);
    for (const y of m)
      y[d] || new t(y);
  }
  function t(a) {
    this.dom = a, a[d] = this, this.timeoutDefault = parseInt(a.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(a.getAttribute("data-ln-toast-max") || "5", 10);
    for (const m of Array.from(a.querySelectorAll("[data-ln-toast-item]")))
      r(m, a);
    return this;
  }
  t.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const a of Array.from(this.dom.children))
        u(a);
      delete this.dom[d];
    }
  };
  function o(a, m) {
    const y = ((a.type || "info") + "").toLowerCase(), A = Q(m, b, "ln-toast");
    if (!A)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    const E = A.firstElementChild;
    if (!E) return null;
    const S = !!(a.message || a.data && a.data.errors);
    $(E, {
      title: a.title || _[y] || _.info,
      role: y === "error" ? "alert" : "status",
      ariaLive: y === "error" ? "assertive" : "polite",
      hasBody: S
    });
    const L = E.querySelector(".ln-toast__card");
    L && L.classList.add(g[y] || "info");
    const D = E.querySelector(".ln-toast__side");
    if (D) {
      const I = D.querySelector("use");
      I && I.setAttribute("href", "#ln-" + (p[y] || p.info));
    }
    const O = E.querySelector(".ln-toast__body");
    O && S && e(O, a);
    const x = E.querySelector(".ln-toast__close");
    return x && x.addEventListener("click", function() {
      u(E);
    }), E;
  }
  function e(a, m) {
    if (m.message)
      if (Array.isArray(m.message)) {
        const y = document.createElement("ul");
        for (const A of m.message) {
          const E = document.createElement("li");
          E.textContent = A, y.appendChild(E);
        }
        a.appendChild(y);
      } else {
        const y = document.createElement("p");
        y.textContent = m.message, a.appendChild(y);
      }
    if (m.data && m.data.errors) {
      const y = document.createElement("ul");
      for (const A of Object.values(m.data.errors).flat()) {
        const E = document.createElement("li");
        E.textContent = A, y.appendChild(E);
      }
      a.appendChild(y);
    }
  }
  function n(a, m) {
    for (; a.dom.children.length >= a.max; ) a.dom.removeChild(a.dom.firstElementChild);
    a.dom.appendChild(m), requestAnimationFrame(() => m.classList.add("ln-toast__item--in"));
  }
  function u(a) {
    !a || !a.parentNode || (clearTimeout(a._timer), a.classList.remove("ln-toast__item--in"), a.classList.add("ln-toast__item--out"), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 200));
  }
  function s(a) {
    let m = a && a.container;
    return typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), m || null;
  }
  function r(a, m) {
    const y = ((a.getAttribute("data-type") || "info") + "").toLowerCase(), A = a.getAttribute("data-title"), E = (a.innerText || a.textContent || "").trim(), S = o({
      type: y,
      title: A,
      message: E || void 0
    }, m);
    S && (a.parentNode && a.parentNode.replaceChild(S, a), requestAnimationFrame(() => S.classList.add("ln-toast__item--in")));
  }
  function c(a) {
    const m = a.detail || {}, y = s(m);
    if (!y) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const A = y[d] || new t(y), E = o(m, y);
    if (!E) return;
    const S = Number.isFinite(m.timeout) ? m.timeout : A.timeoutDefault;
    n(A, E), S > 0 && (E._timer = setTimeout(() => u(E), S));
  }
  function f(a) {
    const m = a && a.detail || {};
    if (m.container) {
      const y = s(m);
      if (y)
        for (const A of Array.from(y.children)) u(A);
    } else {
      const y = document.querySelectorAll("[" + h + "]");
      for (const A of Array.from(y))
        for (const E of Array.from(A.children)) u(E);
    }
  }
  W(function() {
    i(), window.addEventListener("ln-toast:enqueue", c), window.addEventListener("ln-toast:clear", f), new MutationObserver(function(m) {
      for (const y of m) {
        if (y.type === "attributes") {
          l(y.target);
          continue;
        }
        for (const A of y.addedNodes)
          l(A);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), l(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", d = "lnUpload", b = "data-ln-upload-dict", p = "data-ln-upload-accept", g = "data-ln-upload-context", _ = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function i() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const r = document.createElement("div");
    r.innerHTML = _;
    const c = r.firstElementChild;
    c && document.body.appendChild(c);
  }
  if (window[d] !== void 0) return;
  function l(r) {
    if (r === 0) return "0 B";
    const c = 1024, f = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(r) / Math.log(c));
    return parseFloat((r / Math.pow(c, a)).toFixed(1)) + " " + f[a];
  }
  function t(r) {
    return r.split(".").pop().toLowerCase();
  }
  function o(r) {
    return r === "docx" && (r = "doc"), ["pdf", "doc", "epub"].includes(r) ? "lnc-file-" + r : "ln-file";
  }
  function e(r, c) {
    if (!c) return !0;
    const f = "." + t(r.name);
    return c.split(",").map(function(m) {
      return m.trim().toLowerCase();
    }).includes(f.toLowerCase());
  }
  function n(r) {
    if (r.hasAttribute("data-ln-upload-initialized")) return;
    r.setAttribute("data-ln-upload-initialized", "true"), i();
    const c = te(r, b), f = r.querySelector(".ln-upload__zone"), a = r.querySelector(".ln-upload__list"), m = r.getAttribute(p) || "";
    if (!f || !a) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", r);
      return;
    }
    let y = r.querySelector('input[type="file"]');
    y || (y = document.createElement("input"), y.type = "file", y.multiple = !0, y.classList.add("hidden"), m && (y.accept = m.split(",").map(function(q) {
      return q = q.trim(), q.startsWith(".") ? q : "." + q;
    }).join(",")), r.appendChild(y));
    const A = r.getAttribute(h) || "/files/upload", E = r.getAttribute(g) || "", S = /* @__PURE__ */ new Map();
    let L = 0;
    function D() {
      const q = document.querySelector('meta[name="csrf-token"]');
      return q ? q.getAttribute("content") : "";
    }
    function O(q) {
      if (!e(q, m)) {
        const T = c["invalid-type"];
        w(r, "ln-upload:invalid", {
          file: q,
          message: T
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["invalid-title"] || "Invalid File",
          message: T || c["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++L, H = t(q.name), rt = o(H), dt = Q(r, "ln-upload-item", "ln-upload");
      if (!dt) return;
      const G = dt.firstElementChild;
      if (!G) return;
      G.setAttribute("data-file-id", P), $(G, {
        name: q.name,
        sizeText: "0%",
        iconHref: "#" + rt,
        removeLabel: c.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const ut = G.querySelector(".ln-upload__progress-bar"), et = G.querySelector('[data-ln-upload-action="remove"]');
      et && (et.disabled = !0), a.appendChild(G);
      const ht = new FormData();
      ht.append("file", q), ht.append("context", E);
      const v = new XMLHttpRequest();
      v.upload.addEventListener("progress", function(T) {
        if (T.lengthComputable) {
          const k = Math.round(T.loaded / T.total * 100);
          ut.style.width = k + "%", $(G, { sizeText: k + "%" });
        }
      }), v.addEventListener("load", function() {
        if (v.status >= 200 && v.status < 300) {
          let T;
          try {
            T = JSON.parse(v.responseText);
          } catch {
            C("Invalid response");
            return;
          }
          $(G, { sizeText: l(T.size || q.size), uploading: !1 }), et && (et.disabled = !1), S.set(P, {
            serverId: T.id,
            name: T.name,
            size: T.size
          }), x(), w(r, "ln-upload:uploaded", {
            localId: P,
            serverId: T.id,
            name: T.name
          });
        } else {
          let T = c["upload-failed"] || "Upload failed";
          try {
            T = JSON.parse(v.responseText).message || T;
          } catch {
          }
          C(T);
        }
      }), v.addEventListener("error", function() {
        C(c["network-error"] || "Network error");
      });
      function C(T) {
        ut && (ut.style.width = "100%"), $(G, { sizeText: c.error || "Error", uploading: !1, error: !0 }), et && (et.disabled = !1), w(r, "ln-upload:error", {
          file: q,
          message: T
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["error-title"] || "Upload Error",
          message: T || c["upload-failed"] || "Failed to upload file"
        });
      }
      v.open("POST", A), v.setRequestHeader("X-CSRF-TOKEN", D()), v.setRequestHeader("Accept", "application/json"), v.send(ht);
    }
    function x() {
      for (const q of r.querySelectorAll('input[name="file_ids[]"]'))
        q.remove();
      for (const [, q] of S) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = q.serverId, r.appendChild(P);
      }
    }
    function I(q) {
      const P = S.get(q), H = a.querySelector('[data-file-id="' + q + '"]');
      if (!P || !P.serverId) {
        H && H.remove(), S.delete(q), x();
        return;
      }
      H && $(H, { deleting: !0 }), fetch("/files/" + P.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": D(),
          Accept: "application/json"
        }
      }).then(function(rt) {
        rt.status === 200 ? (H && H.remove(), S.delete(q), x(), w(r, "ln-upload:removed", {
          localId: q,
          serverId: P.serverId
        })) : (H && $(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["delete-title"] || "Error",
          message: c["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(rt) {
        console.warn("[ln-upload] Delete error:", rt), H && $(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["network-error"] || "Network error",
          message: c["connection-error"] || "Could not connect to server"
        });
      });
    }
    function N(q) {
      for (const P of q)
        O(P);
      y.value = "";
    }
    const j = function() {
      y.click();
    }, Z = function() {
      N(this.files);
    }, tt = function(q) {
      q.preventDefault(), q.stopPropagation(), f.classList.add("ln-upload__zone--dragover");
    }, _t = function(q) {
      q.preventDefault(), q.stopPropagation(), f.classList.add("ln-upload__zone--dragover");
    }, at = function(q) {
      q.preventDefault(), q.stopPropagation(), f.classList.remove("ln-upload__zone--dragover");
    }, Y = function(q) {
      q.preventDefault(), q.stopPropagation(), f.classList.remove("ln-upload__zone--dragover"), N(q.dataTransfer.files);
    }, ct = function(q) {
      const P = q.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !a.contains(P) || P.disabled) return;
      const H = P.closest(".ln-upload__item");
      H && I(H.getAttribute("data-file-id"));
    };
    f.addEventListener("click", j), y.addEventListener("change", Z), f.addEventListener("dragenter", tt), f.addEventListener("dragover", _t), f.addEventListener("dragleave", at), f.addEventListener("drop", Y), a.addEventListener("click", ct), r.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(S.values()).map(function(q) {
          return q.serverId;
        });
      },
      getFiles: function() {
        return Array.from(S.values());
      },
      clear: function() {
        for (const [, q] of S)
          q.serverId && fetch("/files/" + q.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": D(),
              Accept: "application/json"
            }
          });
        S.clear(), a.innerHTML = "", x(), w(r, "ln-upload:cleared", {});
      },
      destroy: function() {
        f.removeEventListener("click", j), y.removeEventListener("change", Z), f.removeEventListener("dragenter", tt), f.removeEventListener("dragover", _t), f.removeEventListener("dragleave", at), f.removeEventListener("drop", Y), a.removeEventListener("click", ct), S.clear(), a.innerHTML = "", x(), r.removeAttribute("data-ln-upload-initialized"), delete r.lnUploadAPI;
      }
    };
  }
  function u() {
    for (const r of document.querySelectorAll("[" + h + "]"))
      n(r);
  }
  function s() {
    W(function() {
      new MutationObserver(function(c) {
        for (const f of c)
          if (f.type === "childList") {
            for (const a of f.addedNodes)
              if (a.nodeType === 1) {
                a.hasAttribute(h) && n(a);
                for (const m of a.querySelectorAll("[" + h + "]"))
                  n(m);
              }
          } else f.type === "attributes" && f.target.hasAttribute(h) && n(f.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[d] = {
    init: n,
    initAll: u
  }, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function d(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function b(l) {
    if (l.getAttribute("data-ln-external-link") === "processed" || !d(l)) return;
    l.target = "_blank";
    const t = (l.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), l.rel = t.join(" ");
    const o = document.createElement("span");
    o.className = "sr-only", o.textContent = "(opens in new tab)", l.appendChild(o), l.setAttribute("data-ln-external-link", "processed"), w(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    });
  }
  function p(l) {
    l = l || document.body;
    for (const t of l.querySelectorAll("a, area"))
      b(t);
  }
  function g() {
    W(function() {
      document.body.addEventListener("click", function(l) {
        const t = l.target.closest("a, area");
        t && t.getAttribute("data-ln-external-link") === "processed" && w(t, "ln-external-links:clicked", {
          link: t,
          href: t.href,
          text: t.textContent || t.title || ""
        });
      });
    }, "ln-external-links");
  }
  function _() {
    W(function() {
      new MutationObserver(function(t) {
        for (const o of t) {
          if (o.type === "childList") {
            for (const e of o.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && b(e), e.querySelectorAll))
                for (const n of e.querySelectorAll("a, area"))
                  b(n);
          }
          if (o.type === "attributes" && o.attributeName === "href") {
            const e = o.target;
            e.matches && (e.matches("a") || e.matches("area")) && b(e);
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
  function i() {
    g(), _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      p();
    }) : p();
  }
  window[h] = {
    process: p
  }, i();
})();
(function() {
  const h = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  let b = null;
  function p() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function g(a) {
    b && (b.textContent = a, b.classList.add("ln-link-status--visible"));
  }
  function _() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function i(a, m) {
    if (m.target.closest("a, button, input, select, textarea")) return;
    const y = a.querySelector("a");
    if (!y) return;
    const A = y.getAttribute("href");
    if (!A) return;
    if (m.ctrlKey || m.metaKey || m.button === 1) {
      window.open(A, "_blank");
      return;
    }
    z(a, "ln-link:navigate", { target: a, href: A, link: y }).defaultPrevented || y.click();
  }
  function l(a) {
    const m = a.querySelector("a");
    if (!m) return;
    const y = m.getAttribute("href");
    y && g(y);
  }
  function t() {
    _();
  }
  function o(a) {
    a[d + "Row"] || (a[d + "Row"] = !0, a.querySelector("a") && (a._lnLinkClick = function(m) {
      i(a, m);
    }, a._lnLinkEnter = function() {
      l(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", t)));
  }
  function e(a) {
    a[d + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", t), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[d + "Row"]);
  }
  function n(a) {
    if (!a[d + "Init"]) return;
    const m = a.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const y = m === "TABLE" && a.querySelector("tbody") || a;
      for (const A of y.querySelectorAll("tr"))
        e(A);
    } else
      e(a);
    delete a[d + "Init"];
  }
  function u(a) {
    if (a[d + "Init"]) return;
    a[d + "Init"] = !0;
    const m = a.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const y = m === "TABLE" && a.querySelector("tbody") || a;
      for (const A of y.querySelectorAll("tr"))
        o(A);
    } else
      o(a);
  }
  function s(a) {
    a.hasAttribute && a.hasAttribute(h) && u(a);
    const m = a.querySelectorAll ? a.querySelectorAll("[" + h + "]") : [];
    for (const y of m)
      u(y);
  }
  function r() {
    W(function() {
      new MutationObserver(function(m) {
        for (const y of m)
          if (y.type === "childList")
            for (const A of y.addedNodes)
              A.nodeType === 1 && (s(A), A.tagName === "TR" && A.closest("[" + h + "]") && o(A));
          else y.type === "attributes" && s(y.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function c(a) {
    s(a);
  }
  window[d] = { init: c, destroy: n };
  function f() {
    p(), r(), c(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", f) : f();
})();
(function() {
  const h = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0) return;
  function b(o) {
    p(o);
  }
  function p(o) {
    const e = Array.from(o.querySelectorAll(h));
    for (const n of e)
      n[d] || (n[d] = new g(n));
    o.hasAttribute && o.hasAttribute("data-ln-progress") && !o[d] && (o[d] = new g(o));
  }
  function g(o) {
    return this.dom = o, this._attrObserver = null, this._parentObserver = null, t.call(this), i.call(this), l.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[d]);
  };
  function _() {
    W(function() {
      new MutationObserver(function(e) {
        for (const n of e)
          if (n.type === "childList")
            for (const u of n.addedNodes)
              u.nodeType === 1 && p(u);
          else n.type === "attributes" && p(n.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  _();
  function i() {
    const o = this, e = new MutationObserver(function(n) {
      for (const u of n)
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && t.call(o);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function l() {
    const o = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const n = new MutationObserver(function(u) {
      for (const s of u)
        s.attributeName === "data-ln-progress-max" && t.call(o);
    });
    n.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function t() {
    const o = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, u = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let s = u > 0 ? o / u * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100), this.dom.style.width = s + "%";
    const r = Math.max(0, Math.min(o, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(r)), w(this.dom, "ln-progress:change", { target: this.dom, value: o, max: u, percentage: s });
  }
  window[d] = b, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-filter", d = "lnFilter", b = "data-ln-filter-initialized", p = "data-ln-filter-key", g = "data-ln-filter-value", _ = "data-ln-filter-hide", i = "data-ln-filter-reset", l = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[d] !== void 0) return;
  function o(r) {
    return r.hasAttribute(i) || r.getAttribute(g) === "";
  }
  function e(r) {
    let c = r._filterKey;
    const f = [];
    for (let a = 0; a < r.inputs.length; a++) {
      const m = r.inputs[a];
      if (m.checked && !o(m)) {
        const y = m.getAttribute(g);
        y && f.push(y);
      }
    }
    return { key: c, values: f };
  }
  function n(r, c) {
    if (r.length !== c.length) return !0;
    for (let f = 0; f < r.length; f++) if (r[f] !== c[f]) return !0;
    return !1;
  }
  function u(r) {
    const c = r.dom, f = r.colIndex, a = c.querySelector("template");
    if (!a || f === null) return;
    const m = document.getElementById(r.targetId);
    if (!m) return;
    const y = m.tagName === "TABLE" ? m : m.querySelector("table");
    if (!y || m.hasAttribute("data-ln-table")) return;
    const A = {}, E = [], S = y.tBodies;
    for (let O = 0; O < S.length; O++) {
      const x = S[O].rows;
      for (let I = 0; I < x.length; I++) {
        const N = x[I].cells[f], j = N ? N.textContent.trim() : "";
        j && !A[j] && (A[j] = !0, E.push(j));
      }
    }
    E.sort(function(O, x) {
      return O.localeCompare(x);
    });
    const L = c.querySelector("[" + p + "]"), D = L ? L.getAttribute(p) : c.getAttribute("data-ln-filter-key") || "col" + f;
    for (let O = 0; O < E.length; O++) {
      const x = a.content.cloneNode(!0), I = x.querySelector("input");
      I && (I.setAttribute(p, D), I.setAttribute(g, E[O]), gt(x, { text: E[O] }), c.appendChild(x));
    }
  }
  function s(r) {
    if (r.hasAttribute(b)) return this;
    this.dom = r, this.targetId = r.getAttribute(h);
    const c = r.getAttribute(l);
    this.colIndex = c !== null ? parseInt(c, 10) : null, u(this), this.inputs = Array.from(r.querySelectorAll("[" + p + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(p) : null, this._lastSnapshot = null;
    const f = this, a = ie(
      function() {
        f._render();
      },
      function() {
        f._afterRender();
      }
    );
    this._queueRender = a, this._attachHandlers();
    let m = !1;
    if (r.hasAttribute("data-ln-persist")) {
      const y = vt("filter", r);
      if (y && y.key && Array.isArray(y.values) && y.values.length > 0) {
        for (let A = 0; A < this.inputs.length; A++) {
          const E = this.inputs[A];
          o(E) ? E.checked = !1 : E.getAttribute(p) === y.key && y.values.indexOf(E.getAttribute(g)) !== -1 ? E.checked = !0 : E.checked = !1;
        }
        a(), m = !0;
      }
    }
    if (!m) {
      for (let y = 0; y < this.inputs.length; y++)
        if (this.inputs[y].checked && !o(this.inputs[y])) {
          a();
          break;
        }
    }
    return r.setAttribute(b, ""), this;
  }
  s.prototype._attachHandlers = function() {
    const r = this;
    this.inputs.forEach(function(c) {
      c[d + "Bound"] || (c[d + "Bound"] = !0, c._lnFilterChange = function() {
        if (o(c)) {
          for (let f = 0; f < r.inputs.length; f++)
            o(r.inputs[f]) || (r.inputs[f].checked = !1);
          c.checked = !0, r._queueRender();
          return;
        }
        if (c.checked)
          for (let f = 0; f < r.inputs.length; f++)
            o(r.inputs[f]) && (r.inputs[f].checked = !1);
        else {
          let f = !1;
          for (let a = 0; a < r.inputs.length; a++)
            if (!o(r.inputs[a]) && r.inputs[a].checked) {
              f = !0;
              break;
            }
          if (!f)
            for (let a = 0; a < r.inputs.length; a++)
              o(r.inputs[a]) && (r.inputs[a].checked = !0);
        }
        r._queueRender();
      }, c.addEventListener("change", c._lnFilterChange));
    });
  }, s.prototype._render = function() {
    const r = this, c = e(this), f = c.key === null || c.values.length === 0, a = [];
    for (let m = 0; m < c.values.length; m++)
      a.push(c.values[m].toLowerCase());
    if (r.colIndex !== null)
      r._filterTableRows(c);
    else {
      const m = document.getElementById(r.targetId);
      if (!m) return;
      const y = m.children;
      for (let A = 0; A < y.length; A++) {
        const E = y[A];
        if (f) {
          E.removeAttribute(_);
          continue;
        }
        const S = E.getAttribute("data-" + c.key);
        E.removeAttribute(_), S !== null && a.indexOf(S.toLowerCase()) === -1 && E.setAttribute(_, "true");
      }
    }
  }, s.prototype._afterRender = function() {
    const r = e(this), c = this._lastSnapshot;
    if (!c || c.key !== r.key || n(c.values, r.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: r.key,
        values: r.values.slice()
      });
      const a = c && c.values.length > 0, m = r.values.length === 0;
      a && m && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: r.key, values: r.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (r.key && r.values.length > 0 ? st("filter", this.dom, { key: r.key, values: r.values.slice() }) : st("filter", this.dom, null));
  }, s.prototype._dispatchOnBoth = function(r, c) {
    w(this.dom, r, c);
    const f = document.getElementById(this.targetId);
    f && f !== this.dom && w(f, r, c);
  }, s.prototype._filterTableRows = function(r) {
    const c = document.getElementById(this.targetId);
    if (!c) return;
    const f = c.tagName === "TABLE" ? c : c.querySelector("table");
    if (!f || c.hasAttribute("data-ln-table")) return;
    const a = r.key || this._filterKey, m = r.values;
    t.has(f) || t.set(f, {});
    const y = t.get(f);
    if (a && m.length > 0) {
      const L = [];
      for (let D = 0; D < m.length; D++)
        L.push(m[D].toLowerCase());
      y[a] = { col: this.colIndex, values: L };
    } else a && delete y[a];
    const A = Object.keys(y), E = A.length > 0, S = f.tBodies;
    for (let L = 0; L < S.length; L++) {
      const D = S[L].rows;
      for (let O = 0; O < D.length; O++) {
        const x = D[O];
        if (!E) {
          x.removeAttribute(_);
          continue;
        }
        let I = !0;
        for (let N = 0; N < A.length; N++) {
          const j = y[A[N]], Z = x.cells[j.col], tt = Z ? Z.textContent.trim().toLowerCase() : "";
          if (j.values.indexOf(tt) === -1) {
            I = !1;
            break;
          }
        }
        I ? x.removeAttribute(_) : x.setAttribute(_, "true");
      }
    }
  }, s.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const c = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (c && t.has(c)) {
            const f = t.get(c), a = this._filterKey;
            a && f[a] && delete f[a], Object.keys(f).length === 0 && t.delete(c);
          }
        }
      }
      this.inputs.forEach(function(r) {
        r._lnFilterChange && (r.removeEventListener("change", r._lnFilterChange), delete r._lnFilterChange), delete r[d + "Bound"];
      }), this.dom.removeAttribute(b), delete this.dom[d];
    }
  }, B(h, d, s, "ln-filter");
})();
(function() {
  const h = "data-ln-search", d = "lnSearch", b = "data-ln-search-initialized", p = "data-ln-search-hide";
  if (window[d] !== void 0) return;
  function _(i) {
    if (i.hasAttribute(b)) return this;
    this.dom = i, this.targetId = i.getAttribute(h);
    const l = i.tagName;
    if (this.input = l === "INPUT" || l === "TEXTAREA" ? i : i.querySelector('[name="search"]') || i.querySelector('input[type="search"]') || i.querySelector('input[type="text"]'), this.itemsSelector = i.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return i.setAttribute(b, ""), this;
  }
  _.prototype._attachHandler = function() {
    if (!this.input) return;
    const i = this, l = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = l ? l.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      i.input.value = "", i._search(""), i.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(i._debounceTimer), i._debounceTimer = setTimeout(function() {
        i._search(i.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, _.prototype._search = function(i) {
    const l = document.getElementById(this.targetId);
    if (!l || z(l, "ln-search:change", { term: i, targetId: this.targetId }).defaultPrevented) return;
    const o = this.itemsSelector ? l.querySelectorAll(this.itemsSelector) : l.children;
    for (let e = 0; e < o.length; e++) {
      const n = o[e];
      n.removeAttribute(p), i && !n.textContent.replace(/\s+/g, " ").toLowerCase().includes(i) && n.setAttribute(p, "true");
    }
  }, _.prototype.destroy = function() {
    this.dom[d] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(b), delete this.dom[d]);
  }, B(h, d, _, "ln-search");
})();
(function() {
  const h = "lnTableSort", d = "data-ln-table-sort", b = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function p(l) {
    g(l);
  }
  function g(l) {
    const t = Array.from(l.querySelectorAll("table"));
    l.tagName === "TABLE" && t.push(l), t.forEach(function(o) {
      if (o[h]) return;
      const e = Array.from(o.querySelectorAll("th[" + d + "]"));
      e.length && (o[h] = new _(o, e));
    });
  }
  function _(l, t) {
    this.table = l, this.ths = t, this._col = -1, this._dir = null;
    const o = this;
    t.forEach(function(n, u) {
      if (n[h + "Bound"]) return;
      n[h + "Bound"] = !0;
      const s = n.querySelector("[" + b + "]");
      s && (s._lnSortClick = function() {
        o._handleClick(u, n);
      }, s.addEventListener("click", s._lnSortClick));
    });
    const e = l.closest("[data-ln-table][data-ln-persist]");
    if (e) {
      const n = vt("table-sort", e);
      n && n.dir && n.col >= 0 && n.col < t.length && (this._handleClick(n.col, t[n.col]), n.dir === "desc" && this._handleClick(n.col, t[n.col]));
    }
    return this;
  }
  _.prototype._handleClick = function(l, t) {
    let o;
    this._col !== l ? o = "asc" : this._dir === "asc" ? o = "desc" : this._dir === "desc" ? o = null : o = "asc", this.ths.forEach(function(n) {
      n.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), o === null ? (this._col = -1, this._dir = null) : (this._col = l, this._dir = o, t.classList.add(o === "asc" ? "ln-sort-asc" : "ln-sort-desc")), w(this.table, "ln-table:sort", {
      column: l,
      sortType: t.getAttribute(d),
      direction: o
    });
    const e = this.table.closest("[data-ln-table][data-ln-persist]");
    e && (o === null ? st("table-sort", e, null) : st("table-sort", e, { col: l, dir: o }));
  }, _.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(l) {
      const t = l.querySelector("[" + b + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete l[h + "Bound"];
    }), delete this.table[h]);
  };
  function i() {
    W(function() {
      new MutationObserver(function(t) {
        t.forEach(function(o) {
          o.type === "childList" ? o.addedNodes.forEach(function(e) {
            e.nodeType === 1 && g(e);
          }) : o.type === "attributes" && g(o.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table-sort");
  }
  window[h] = p, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "data-ln-table", d = "lnTable", b = "data-ln-table-sort", p = "data-ln-table-empty";
  if (window[d] !== void 0) return;
  const i = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, l = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function t(n) {
    return l ? l.format(n) : String(n);
  }
  function o(n) {
    let u = n.parentElement;
    for (; u && u !== document.body && u !== document.documentElement; ) {
      const r = getComputedStyle(u).overflowY;
      if (r === "auto" || r === "scroll") return u;
      u = u.parentElement;
    }
    return null;
  }
  function e(n) {
    this.dom = n, this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead");
    const u = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = u ? Array.from(u.querySelectorAll("th")) : [], this.isDataDriven = n.hasAttribute("data-ln-table-source"), this.name = n.getAttribute(h) || "", this.source = n.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const s = this;
    if (this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(c) {
        return c.getAttribute("data-ln-table-col") && c.querySelector("[data-ln-table-col-filter]");
      }).map(function(c) {
        return c.getAttribute("data-ln-table-col");
      }), this._totalSpan = n.querySelector("[data-ln-table-total]"), this._filteredSpan = n.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = n.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(c) {
        const f = c.detail || {};
        s._data = f.data || [], s._lastTotal = f.total != null ? f.total : s._data.length, s._lastFiltered = f.filtered != null ? f.filtered : s._data.length, s.totalCount = s._lastTotal, s.visibleCount = s._lastFiltered, s.isLoaded = !0, n.classList.remove("ln-table--loading"), s._updateFilterOptions(f.filterOptions), s._vStart = -1, s._vEnd = -1, s._applyFilterAndSort(), s._render(), s._updateFooter(), w(n, "ln-table:rendered", {
          table: s.name,
          total: s.totalCount,
          visible: s.visibleCount
        });
      }, n.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(c) {
        const f = c.detail && c.detail.loading;
        n.classList.toggle("ln-table--loading", !!f), f && (s.isLoaded = !1);
      }, n.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(c) {
        const f = c.target.closest("[data-ln-table-col-sort]");
        if (!f) return;
        const a = f.closest("th");
        if (!a) return;
        const m = a.getAttribute("data-ln-table-col");
        m && s._handleSort(m, a);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(c) {
        const f = c.target.closest("[data-ln-table-col-filter]");
        if (!f) return;
        c.stopPropagation();
        const a = f.closest("th");
        if (!a) return;
        const m = a.getAttribute("data-ln-table-col");
        if (m) {
          if (s._activeDropdown && s._activeDropdown.field === m) {
            s._closeFilterDropdown();
            return;
          }
          s._openFilterDropdown(m, a, f);
        }
      }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
        s._activeDropdown && s._closeFilterDropdown();
      }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(c) {
        (c.target.closest("[data-ln-table-clear-all]") || c.target.closest("[data-ln-data-table-clear-all]")) && (s.currentFilters = {}, s._updateFilterIndicators(), w(n, "ln-table:clear-filters", { table: s.name }), s._requestData());
      }, n.addEventListener("click", this._onClearAll), this._selectable = n.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(c) {
        if (c.target.closest("[data-ln-table-row-select]") || c.target.closest("[data-ln-table-row-action]") || c.target.closest("a") || c.target.closest("button") || c.ctrlKey || c.metaKey || c.button === 1) return;
        const f = c.target.closest("[data-ln-table-row]");
        if (!f) return;
        const a = f.getAttribute("data-ln-table-row-id"), m = f._lnRecord || {};
        w(n, "ln-table:row-click", {
          table: s.name,
          id: a,
          record: m
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(c) {
        const f = c.target.closest("[data-ln-table-row-action]");
        if (!f) return;
        c.stopPropagation();
        const a = f.closest("[data-ln-table-row]");
        if (!a) return;
        const m = f.getAttribute("data-ln-table-row-action"), y = a.getAttribute("data-ln-table-row-id"), A = a._lnRecord || {};
        w(n, "ln-table:row-action", {
          table: s.name,
          id: y,
          action: m,
          record: A
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const r = document.querySelector('[data-ln-search="' + n.id + '"]');
      if (r) {
        const c = r.tagName;
        this._searchInput = c === "INPUT" || c === "TEXTAREA" ? r : r.querySelector('input[type="search"]') || r.querySelector('input[type="text"]') || r.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(c) {
        c.preventDefault(), s.currentSearch = c.detail.term, s._searchInput && (s._searchInput.value = c.detail.term), w(n, "ln-table:search", {
          table: s.name,
          query: s.currentSearch
        }), s._requestData();
      }, n.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(c) {
        if (!n.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (c.key === "/") {
          s._searchInput && (c.preventDefault(), s._searchInput.focus());
          return;
        }
        const f = s.tbody ? Array.from(s.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (f.length)
          switch (c.key) {
            case "ArrowDown":
              c.preventDefault(), s._focusedRowIndex = Math.min(s._focusedRowIndex + 1, f.length - 1), s._focusRow(f);
              break;
            case "ArrowUp":
              c.preventDefault(), s._focusedRowIndex = Math.max(s._focusedRowIndex - 1, 0), s._focusRow(f);
              break;
            case "Home":
              c.preventDefault(), s._focusedRowIndex = 0, s._focusRow(f);
              break;
            case "End":
              c.preventDefault(), s._focusedRowIndex = f.length - 1, s._focusRow(f);
              break;
            case "Enter":
              if (s._focusedRowIndex >= 0 && s._focusedRowIndex < f.length) {
                c.preventDefault();
                const a = f[s._focusedRowIndex];
                w(n, "ln-table:row-click", {
                  table: s.name,
                  id: a.getAttribute("data-ln-table-row-id"),
                  record: a._lnRecord || {}
                });
              }
              break;
            case " ":
              if (s._selectable && s._focusedRowIndex >= 0 && s._focusedRowIndex < f.length) {
                c.preventDefault();
                const a = f[s._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                a && (a.checked = !a.checked, a.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
            case "Escape":
              s._activeDropdown && s._closeFilterDropdown();
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), w(n, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        s.tbody.rows.length > 0 && (s._emptyTbodyObserver.disconnect(), s._emptyTbodyObserver = null, s._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(r) {
        r.preventDefault(), s._searchTerm = r.detail.term, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), w(n, "ln-table:filter", {
          term: s._searchTerm,
          matched: s._filteredData.length,
          total: s._data.length
        });
      }, n.addEventListener("ln-search:change", this._onSearch), this._onSort = function(r) {
        s._sortCol = r.detail.direction === null ? -1 : r.detail.column, s._sortDir = r.detail.direction, s._sortType = r.detail.sortType, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), w(n, "ln-table:sorted", {
          column: r.detail.column,
          direction: r.detail.direction,
          matched: s._filteredData.length,
          total: s._data.length
        });
      }, n.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(r) {
        const c = r.detail.key;
        let f = !1;
        for (let y = 0; y < s.ths.length; y++)
          if (s.ths[y].getAttribute("data-ln-table-filter-col") === c) {
            f = !0;
            break;
          }
        if (!f) return;
        const a = r.detail.values;
        if (!a || a.length === 0)
          delete s._columnFilters[c];
        else {
          const y = [];
          for (let A = 0; A < a.length; A++)
            y.push(a[A].toLowerCase());
          s._columnFilters[c] = y;
        }
        const m = s.dom.querySelector('th[data-ln-table-filter-col="' + c + '"]');
        m && (a && a.length > 0 ? m.setAttribute("data-ln-table-filter-active", "") : m.removeAttribute("data-ln-table-filter-active")), s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), w(n, "ln-table:filter", {
          term: s._searchTerm,
          matched: s._filteredData.length,
          total: s._data.length
        });
      }, n.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(r) {
        if (!r.target.closest("[data-ln-table-clear]")) return;
        s._searchTerm = "";
        const f = document.querySelector('[data-ln-search="' + n.id + '"]');
        if (f) {
          const m = f.tagName === "INPUT" ? f : f.querySelector("input");
          m && (m.value = "");
        }
        s._columnFilters = {};
        for (let m = 0; m < s.ths.length; m++)
          s.ths[m].removeAttribute("data-ln-table-filter-active");
        const a = document.querySelectorAll('[data-ln-filter="' + n.id + '"]');
        for (let m = 0; m < a.length; m++) {
          const y = a[m].querySelector("[data-ln-filter-reset]");
          y && (y.checked = !0, y.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), w(n, "ln-table:filter", {
          term: "",
          matched: s._filteredData.length,
          total: s._data.length
        });
      }, n.addEventListener("click", this._onClear);
    return this;
  }
  e.prototype._parseRows = function() {
    const n = this.tbody.rows, u = this.ths;
    this._data = [];
    const s = [];
    for (let r = 0; r < u.length; r++)
      s[r] = u[r].getAttribute(b);
    n.length > 0 && (this._rowHeight = n[0].offsetHeight || 40), this._lockColumnWidths();
    for (let r = 0; r < n.length; r++) {
      const c = n[r], f = [], a = [], m = [];
      for (let A = 0; A < c.cells.length; A++) {
        const E = c.cells[A], S = E.textContent.trim(), L = qt(E), D = s[A];
        a[A] = S.toLowerCase(), D === "number" || D === "date" ? f[A] = parseFloat(L) || 0 : D === "string" ? f[A] = String(L) : f[A] = null, A < c.cells.length - 1 && m.push(S.toLowerCase());
      }
      let y = null;
      if (this.isDataDriven) {
        y = {};
        const A = c.getAttribute("data-ln-table-row-id");
        A != null && (y.id = A);
        for (let E = 0; E < u.length; E++) {
          const S = u[E].getAttribute("data-ln-table-col");
          if (S) {
            const L = E;
            if (L < c.cells.length) {
              const D = c.cells[L];
              y[S] = qt(D);
            }
          }
        }
      }
      this._data.push({
        sortKeys: f,
        rawTexts: a,
        html: c.outerHTML,
        searchText: m.join(" "),
        id: this.isDataDriven && y ? y.id : void 0,
        ...y
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, e.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const n = (this.currentSearch || "").trim().toLowerCase(), u = this.currentFilters || {}, s = Object.keys(u).length > 0;
      if (this._filteredData = this._data.filter(function(y) {
        if (n) {
          let A = !1;
          for (const E in y)
            if (y.hasOwnProperty(E) && typeof y[E] == "string" && E !== "html" && E !== "searchText" && y[E].toLowerCase().indexOf(n) !== -1) {
              A = !0;
              break;
            }
          if (!A) return !1;
        }
        if (s)
          for (const A in u) {
            const E = u[A];
            if (E && E.length > 0) {
              const S = y[A], L = S != null ? String(S) : "";
              if (E.indexOf(L) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const r = this.currentSort.field, f = this.currentSort.direction === "desc" ? -1 : 1;
      let a = null;
      if (this.ths) {
        for (let y = 0; y < this.ths.length; y++)
          if (this.ths[y].getAttribute("data-ln-table-col") === r) {
            a = this.ths[y].getAttribute(b);
            break;
          }
      }
      const m = i ? i.compare : function(y, A) {
        return y < A ? -1 : y > A ? 1 : 0;
      };
      this._filteredData.sort(function(y, A) {
        const E = y[r], S = A[r];
        if (a === "number" || a === "date") {
          const O = parseFloat(E) || 0, x = parseFloat(S) || 0;
          return (O - x) * f;
        }
        if (typeof E == "number" && typeof S == "number")
          return (E - S) * f;
        const L = E != null ? String(E) : "", D = S != null ? String(S) : "";
        return m(L, D) * f;
      });
    } else {
      const n = this._searchTerm, u = this._columnFilters, s = Object.keys(u).length > 0, r = this.ths, c = {};
      if (s)
        for (let A = 0; A < r.length; A++) {
          const E = r[A].getAttribute("data-ln-table-filter-col");
          E && (c[E] = A);
        }
      if (!n && !s ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(A) {
        if (n && A.searchText.indexOf(n) === -1) return !1;
        if (s)
          for (const E in u) {
            const S = c[E];
            if (S !== void 0 && u[E].indexOf(A.rawTexts[S]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const f = this._sortCol, a = this._sortDir === "desc" ? -1 : 1, m = this._sortType === "number" || this._sortType === "date", y = i ? i.compare : function(A, E) {
        return A < E ? -1 : A > E ? 1 : 0;
      };
      this._filteredData.sort(function(A, E) {
        const S = A.sortKeys[f], L = E.sortKeys[f];
        return m ? (S - L) * a : y(S, L) * a;
      });
    }
  }, e.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const n = document.createElement("colgroup");
    this.ths.forEach(function(u) {
      const s = document.createElement("col");
      s.style.width = u.offsetWidth + "px", n.appendChild(s);
    }), this.table.insertBefore(n, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = n;
  }, e.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const n = this._lastTotal, u = this.visibleCount;
        if (n === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || u === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const n = this._filteredData.length;
        n === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : n > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, e.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const n = this._filteredData, u = document.createDocumentFragment();
      for (let s = 0; s < n.length; s++) {
        const r = this._buildRow(n[s]);
        if (!r) break;
        u.appendChild(r);
      }
      this.tbody.textContent = "", this.tbody.appendChild(u), this._selectable && this._updateSelectAll();
    } else {
      const n = [], u = this._filteredData;
      for (let s = 0; s < u.length; s++) n.push(u[s].html);
      this.tbody.innerHTML = n.join("");
    }
  }, e.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    if (!this._rowHeight)
      if (this.isDataDriven) {
        if (this._data.length > 0) {
          const s = this._buildRow(this._data[0]);
          s && (this.tbody.textContent = "", this.tbody.appendChild(s), this._rowHeight = s.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const s = this.tbody ? this.tbody.rows : [];
        s.length > 0 && (this._rowHeight = s[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = o(this.dom) : this._scrollContainer = null;
    const u = this._scrollContainer || window;
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._renderVirtual();
      }));
    }, u.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    const n = this._filteredData, u = n.length, s = this._rowHeight;
    if (!s || !u) return;
    const r = this.thead ? this.thead.offsetHeight : 0, c = this._scrollContainer;
    let f, a;
    if (c) {
      const L = this.table.getBoundingClientRect(), D = c.getBoundingClientRect(), O = L.top - D.top + c.scrollTop + r;
      f = c.scrollTop - O, a = c.clientHeight;
    } else {
      const O = this.table.getBoundingClientRect().top + window.scrollY + r;
      f = window.scrollY - O, a = window.innerHeight;
    }
    let m = Math.max(0, Math.floor(f / s) - 15);
    m = Math.min(m, u);
    const y = Math.min(m + Math.ceil(a / s) + 30, u);
    if (m === this._vStart && y === this._vEnd) return;
    this._vStart = m, this._vEnd = y;
    const A = this.ths.length || 1, E = m * s, S = (u - y) * s;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (E > 0) {
        const D = document.createElement("tr");
        D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
        const O = document.createElement("td");
        O.setAttribute("colspan", A), O.style.height = E + "px", D.appendChild(O), L.appendChild(D);
      }
      for (let D = m; D < y; D++) {
        const O = this._buildRow(n[D]);
        O && L.appendChild(O);
      }
      if (S > 0) {
        const D = document.createElement("tr");
        D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
        const O = document.createElement("td");
        O.setAttribute("colspan", A), O.style.height = S + "px", D.appendChild(O), L.appendChild(D);
      }
      this.tbody.textContent = "", this.tbody.appendChild(L), this._selectable && this._updateSelectAll();
    } else {
      let L = "";
      E > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>');
      for (let D = m; D < y; D++) L += n[D].html;
      S > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L;
    }
  }, e.prototype._showEmptyState = function() {
    const n = this.ths.length || 1;
    this.tbody.textContent = "";
    let u = null;
    if (this.isDataDriven) {
      const s = this._lastTotal != null ? this._lastTotal : this._data.length, r = this.visibleCount, c = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (r < s || r === 0), f = c ? this.name + "-empty-filtered" : this.name + "-empty";
      if (u = Q(this.dom, f, "ln-table"), !u) {
        const a = this.dom.querySelector("template[data-ln-table-empty]");
        if (a) {
          const m = c ? "search" : "initial", y = a.content.querySelector('[data-ln-table-empty-when="' + m + '"]') || a.content.firstElementChild;
          y && (u = document.importNode(y, !0));
        }
      }
      if (u)
        if (u.tagName === "TR")
          this.tbody.appendChild(u);
        else {
          const a = document.createElement("td");
          a.setAttribute("colspan", String(n)), a.appendChild(u);
          const m = document.createElement("tr");
          m.className = "ln-table__empty", m.appendChild(a), this.tbody.appendChild(m);
        }
    } else {
      const s = this.dom.querySelector("template[" + p + "]"), r = document.createElement("td");
      r.setAttribute("colspan", String(n)), s && r.appendChild(document.importNode(s.content, !0));
      const c = document.createElement("tr");
      c.className = "ln-table__empty", c.appendChild(r), this.tbody.appendChild(c);
    }
    w(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, e.prototype._fillRow = function(n, u) {
    gt(n, u);
    const s = n.querySelectorAll("[data-ln-table-cell-attr]");
    for (let r = 0; r < s.length; r++) {
      const c = s[r], f = c.getAttribute("data-ln-table-cell-attr").split(",");
      for (let a = 0; a < f.length; a++) {
        const m = f[a].trim().split(":");
        if (m.length !== 2) continue;
        const y = m[0].trim(), A = m[1].trim();
        u[y] != null && c.setAttribute(A, u[y]);
      }
    }
  }, e.prototype._buildRow = function(n) {
    const u = Q(this.dom, this.name + "-row", "ln-table");
    if (!u) return null;
    const s = u.querySelector("[data-ln-table-row]") || u.firstElementChild;
    if (!s) return null;
    if (this._fillRow(s, n), s._lnRecord = n, n.id != null && s.setAttribute("data-ln-table-row-id", n.id), this._selectable && n.id != null && this.selectedIds.has(String(n.id))) {
      s.classList.add("ln-row-selected");
      const r = s.querySelector("[data-ln-table-row-select]");
      r && (r.checked = !0);
    }
    return s;
  }, e.prototype._updateFilterOptions = function(n) {
    if (n !== null && typeof n == "object" && !Array.isArray(n)) {
      const u = Object.keys(n);
      for (let s = 0; s < u.length; s++) {
        const r = u[s], c = n[r];
        if (!Array.isArray(c)) continue;
        const f = {}, a = [];
        for (let m = 0; m < c.length; m++) {
          const y = String(c[m]);
          f[y] || (f[y] = !0, a.push(y));
        }
        this._filterOptions[r] = a.sort();
      }
    } else {
      const u = this._filterableFields, s = this._data;
      for (let r = 0; r < u.length; r++) {
        const c = u[r];
        this._filterOptions[c] || (this._filterOptions[c] = []);
        const f = this._filterOptions[c], a = {};
        for (let m = 0; m < f.length; m++)
          a[f[m]] = !0;
        for (let m = 0; m < s.length; m++) {
          const y = s[m][c];
          if (y != null) {
            const A = String(y);
            a[A] || (a[A] = !0, f.push(A));
          }
        }
        f.sort();
      }
    }
  }, e.prototype._getUniqueValues = function(n) {
    return (this._filterOptions[n] || []).slice().sort();
  }, e.prototype._updateFilterIndicators = function() {
    const n = this.ths;
    for (let u = 0; u < n.length; u++) {
      const s = n[u], r = s.getAttribute("data-ln-table-col");
      if (!r) continue;
      const c = s.querySelector("[data-ln-table-col-filter]");
      if (!c) continue;
      const f = this.currentFilters[r] && this.currentFilters[r].length > 0;
      c.classList.toggle("ln-filter-active", !!f);
    }
  }, e.prototype._applyFilterMutualExclusion = function(n, u) {
    const s = n.hasAttribute("data-ln-filter-reset"), r = u.querySelector("[data-ln-filter-reset]"), c = u.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');
    if (s) {
      n.checked = !0;
      for (let f = 0; f < c.length; f++) c[f].checked = !1;
    } else if (n.checked)
      r && (r.checked = !1);
    else {
      let f = !1;
      for (let a = 0; a < c.length; a++)
        if (c[a].checked) {
          f = !0;
          break;
        }
      !f && r && (r.checked = !0);
    }
  }, e.prototype._onFilterChange = function(n, u) {
    const s = u.querySelector("[data-ln-filter-reset]"), r = u.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])'), c = [];
    for (let a = 0; a < r.length; a++)
      r[a].checked && c.push(r[a].value);
    const f = s && s.checked || c.length === 0;
    f ? delete this.currentFilters[n] : this.currentFilters[n] = c, this._updateFilterIndicators(), w(this.dom, "ln-table:filter", {
      table: this.name,
      field: n,
      values: f ? [] : c
    }), this._requestData();
  }, e.prototype._openFilterDropdown = function(n, u, s) {
    this._closeFilterDropdown();
    const r = Q(this.dom, this.name + "-column-filter", "ln-table") || Q(this.dom, "column-filter", "ln-table");
    if (!r) return;
    const c = r.firstElementChild;
    if (!c) return;
    const f = this._getUniqueValues(n), a = c.querySelector("[data-ln-filter-options]"), m = c.querySelector("[data-ln-filter-search]"), y = this.currentFilters[n] || [], A = this;
    if (m && f.length <= 8 && m.classList.add("hidden"), a) {
      const E = a.querySelector("[data-ln-filter-reset]");
      E && (E.checked = y.length === 0);
      const S = Q(c, this.name + "-column-filter-item", "ln-table") || Q(c, "column-filter-item", "ln-table");
      if (S)
        for (let L = 0; L < f.length; L++) {
          const D = f[L], O = S.cloneNode(!0);
          $(O, { value: D });
          const x = O.querySelector('input[type="checkbox"]');
          x && (x.value = D, x.checked = y.length > 0 && y.indexOf(D) !== -1), a.appendChild(O);
        }
      a.addEventListener("change", function(L) {
        L.target.type === "checkbox" && (A._applyFilterMutualExclusion(L.target, a), A._onFilterChange(n, a));
      });
    }
    m && m.addEventListener("input", function() {
      const E = m.value.toLowerCase(), S = a.querySelectorAll("li");
      for (let L = 0; L < S.length; L++) {
        const D = S[L].textContent.toLowerCase();
        S[L].classList.toggle("hidden", E && D.indexOf(E) === -1);
      }
    }), u.appendChild(c), this._activeDropdown = { field: n, th: u, el: c }, c.addEventListener("click", function(E) {
      E.stopPropagation();
    });
  }, e.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, e.prototype._handleSort = function(n, u) {
    let s;
    !this.currentSort || this.currentSort.field !== n ? s = "asc" : this.currentSort.direction === "asc" ? s = "desc" : s = null;
    for (let r = 0; r < this.ths.length; r++)
      this.ths[r].classList.remove("ln-sort-asc", "ln-sort-desc");
    s ? (this.currentSort = { field: n, direction: s }, u.classList.add(s === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, w(this.dom, "ln-table:sort", {
      table: this.name,
      field: n,
      direction: s
    }), this._requestData();
  }, e.prototype._requestData = function() {
    Bt(this, "ln-table:request-data", "table");
  }, e.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-table-row]");
    let u = n.length > 0;
    for (let s = 0; s < n.length; s++) {
      const r = n[s].getAttribute("data-ln-table-row-id");
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
    const n = this;
    if (this._onSelectionChange = function(u) {
      const s = u.target.closest("[data-ln-table-row-select]");
      if (!s) return;
      const r = s.closest("[data-ln-table-row]");
      if (!r) return;
      const c = r.getAttribute("data-ln-table-row-id");
      c != null && (s.checked ? (n.selectedIds.add(c), r.classList.add("ln-row-selected")) : (n.selectedIds.delete(c), r.classList.remove("ln-row-selected")), n.selectedCount = n.selectedIds.size, n._updateSelectAll(), n._updateFooter(), w(n.dom, "ln-table:select", {
        table: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const u = document.createElement("input");
      u.type = "checkbox", u.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(u), this._selectAllCheckbox = u;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const u = n._selectAllCheckbox.checked, s = n.tbody ? n.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let r = 0; r < s.length; r++) {
        const c = s[r].getAttribute("data-ln-table-row-id"), f = s[r].querySelector("[data-ln-table-row-select]");
        c != null && (u ? (n.selectedIds.add(c), s[r].classList.add("ln-row-selected")) : (n.selectedIds.delete(c), s[r].classList.remove("ln-row-selected")), f && (f.checked = u));
      }
      n.selectedCount = n.selectedIds.size, w(n.dom, "ln-table:select-all", {
        table: n.name,
        selected: u
      }), w(n.dom, "ln-table:select", {
        table: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedCount
      }), n._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let s = 0; s < u.length; s++) {
        const r = u[s].querySelector("[data-ln-table-row-select]"), c = u[s].getAttribute("data-ln-table-row-id");
        r && r.checked && c != null && (this.selectedIds.add(c), u[s].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, e.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const n = this.dom.querySelector("[data-ln-table-col-select]");
    if (n) {
      const u = n.querySelector('input[type="checkbox"]');
      u && u.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let s = 0; s < u.length; s++) {
        u[s].classList.remove("ln-row-selected");
        const r = u[s].querySelector("[data-ln-table-row-select]");
        r && (r.checked = !1);
      }
    }
    this._updateFooter();
  }, e.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const n = this._lastTotal != null ? this._lastTotal : this._data.length, u = this.visibleCount, s = u < n;
    if (this._totalSpan && (this._totalSpan.textContent = t(n)), this._filteredSpan && (this._filteredSpan.textContent = s ? t(u) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !s), this._selectedSpan) {
      const r = this.selectedIds.size;
      this._selectedSpan.textContent = r > 0 ? t(r) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, e.prototype._focusRow = function(n) {
    for (let u = 0; u < n.length; u++)
      n[u].classList.remove("ln-row-focused"), n[u].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < n.length) {
      const u = n[this._focusedRowIndex];
      u.classList.add("ln-row-focused"), u.setAttribute("tabindex", "0"), u.focus(), u.scrollIntoView({ block: "nearest" });
    }
  }, e.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, B(h, d, e, "ln-table");
})();
(function() {
  const h = "data-ln-list", d = "lnList", b = "data-ln-list-empty";
  if (window[d] !== void 0) return;
  function _(t) {
    let o = t;
    for (; o && o !== document.body && o !== document.documentElement; ) {
      const n = getComputedStyle(o).overflowY;
      if (n === "auto" || n === "scroll") return o;
      o = o.parentElement;
    }
    return null;
  }
  function i(t) {
    if (!t) return 0;
    const o = getComputedStyle(t), e = parseFloat(o.marginTop) || 0, n = parseFloat(o.marginBottom) || 0;
    return t.offsetHeight + e + n;
  }
  function l(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const o = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== t ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== t ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(e) {
      const n = e.detail || {};
      o._data = n.data || [], o._lastTotal = n.total != null ? n.total : o._data.length, o._lastFiltered = n.filtered != null ? n.filtered : o._data.length, o.totalCount = o._lastTotal, o.visibleCount = o._lastFiltered, o.isLoaded = !0, t.classList.remove("ln-list--loading"), o._vStart = -1, o._vEnd = -1, o._applyFilterAndSort(), o._render(), o._updateFooter(), w(t, "ln-list:rendered", {
        list: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(e) {
      const n = e.detail && e.detail.loading;
      t.classList.toggle("ln-list--loading", !!n), n && (o.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(e) {
      (e.target.closest("[data-ln-list-clear-all]") || e.target.closest("[data-ln-data-list-clear-all]")) && (o.currentFilters = {}, w(t, "ln-list:clear-filters", { list: o.name }), o._requestData());
    }, t.addEventListener("click", this._onClearAll), this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(e) {
      if (e.target.closest("[data-ln-item-select]") || e.target.closest("[data-ln-item-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const n = e.target.closest("[data-ln-item]");
      if (!n) return;
      const u = n.getAttribute("data-ln-item-id"), s = n._lnRecord || {};
      w(t, "ln-list:item-click", {
        list: o.name,
        id: u,
        record: s
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(e) {
      const n = e.target.closest("[data-ln-item-action]");
      if (!n) return;
      e.stopPropagation();
      const u = n.closest("[data-ln-item]");
      if (!u) return;
      const s = n.getAttribute("data-ln-item-action"), r = u.getAttribute("data-ln-item-id"), c = u._lnRecord || {};
      w(t, "ln-list:item-action", {
        list: o.name,
        id: r,
        action: s,
        record: c
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(e) {
      e.preventDefault(), o.currentSearch = e.detail.term, w(t, "ln-list:search", {
        list: o.name,
        query: o.currentSearch
      }), o._requestData();
    }, t.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), w(t, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      o.tbody.children.length > 0 && (o._emptyObserver.disconnect(), o._emptyObserver = null, o._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(e) {
      e.preventDefault(), o._searchTerm = e.detail.term, o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), w(t, "ln-list:filter", {
        term: o._searchTerm,
        matched: o._filteredData.length,
        total: o._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onClear = function(e) {
      if (!e.target.closest("[data-ln-list-clear]")) return;
      o._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (u) {
        const s = u.tagName === "INPUT" ? u : u.querySelector("input");
        s && (s.value = "");
      }
      o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), w(t, "ln-list:filter", {
        term: "",
        matched: o._filteredData.length,
        total: o._data.length
      });
    }, t.addEventListener("click", this._onClear)), this;
  }
  l.prototype._parseChildren = function() {
    const t = Array.from(this.tbody.children).filter((o) => !o.classList.contains("ln-list__spacer"));
    this._data = [], t.length > 0 && (this._itemHeight = i(t[0]) || 50);
    for (let o = 0; o < t.length; o++) {
      const e = t[o], n = e.getAttribute("data-ln-item-id") || e.getAttribute("id"), u = e.textContent.trim().toLowerCase();
      let s = null;
      if (this.isDataDriven) {
        s = {}, n != null && (s.id = n);
        const r = e.querySelectorAll("[data-ln-list-field]");
        for (let c = 0; c < r.length; c++) {
          const f = r[c], a = f.getAttribute("data-ln-list-field");
          a && (s[a] = f.textContent.trim());
        }
      }
      this._data.push({
        html: e.outerHTML,
        searchText: u,
        id: n,
        ...s
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, l.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), o = this.currentFilters || {}, e = Object.keys(o).length > 0;
      if (this._filteredData = this._data.filter(function(r) {
        if (t) {
          let c = !1;
          for (const f in r)
            if (r.hasOwnProperty(f) && typeof r[f] == "string" && f !== "html" && f !== "searchText" && r[f].toLowerCase().indexOf(t) !== -1) {
              c = !0;
              break;
            }
          if (!c) return !1;
        }
        if (e)
          for (const c in o) {
            const f = o[c];
            if (f && f.length > 0) {
              const a = r[c], m = a != null ? String(a) : "";
              if (f.indexOf(m) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const n = this.currentSort.field, u = this.currentSort.direction === "desc" ? -1 : 1, s = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(r, c) {
        return r < c ? -1 : r > c ? 1 : 0;
      };
      this._filteredData.sort(function(r, c) {
        const f = r[n], a = c[n];
        if (typeof f == "number" && typeof a == "number")
          return (f - a) * u;
        const m = f != null ? String(f) : "", y = a != null ? String(a) : "";
        return s(m, y) * u;
      });
    } else {
      const t = this._searchTerm;
      t ? this._filteredData = this._data.filter(function(o) {
        return o.searchText.indexOf(t) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, l.prototype._render = function() {
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
  }, l.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, o = document.createDocumentFragment();
      for (let e = 0; e < t.length; e++) {
        const n = this._buildItem(t[e]);
        if (!n) break;
        o.appendChild(n);
      }
      this.tbody.textContent = "", this.tbody.appendChild(o), this._selectable && this._updateSelectAll();
    } else {
      const t = [], o = this._filteredData;
      for (let e = 0; e < o.length; e++) t.push(o[e].html);
      this.tbody.innerHTML = t.join("");
    }
  }, l.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), o = t.gridTemplateColumns;
    let e = 1;
    if (o && o !== "none") {
      const u = o.trim().split(/\s+/).filter(Boolean);
      u.length > 0 && (e = u.length);
    }
    const n = parseFloat(t.rowGap);
    return { columns: e, rowGap: isNaN(n) ? 0 : n };
  }, l.prototype._measureItemHeight = function() {
    if (this.isDataDriven) {
      if (this._data.length > 0) {
        const t = this._buildItem(this._data[0]);
        t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._itemHeight = i(t) || 50, this.tbody.textContent = "");
      }
    } else {
      const t = this.tbody.children;
      t.length > 0 && (this._itemHeight = i(t[0]) || 50);
    }
  }, l.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = _(this.dom);
    const o = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      t._itemHeight = 0, t._measureItemHeight(), t._vStart = -1, t._vEnd = -1, t._renderVirtual();
    }, o.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, l.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, l.prototype._renderVirtual = function() {
    const t = this._filteredData, o = t.length, e = this._itemHeight;
    if (!e || !o) return;
    const n = this._scrollContainer;
    let u, s;
    if (n) {
      const x = this.tbody.getBoundingClientRect(), I = n.getBoundingClientRect(), N = n === this.tbody ? 0 : x.top - I.top + n.scrollTop;
      u = n.scrollTop - N, s = n.clientHeight;
    } else {
      const I = this.tbody.getBoundingClientRect().top + window.scrollY;
      u = window.scrollY - I, s = window.innerHeight;
    }
    const r = this._readGridLayout(), c = r.columns, f = r.rowGap, a = e + f, m = Math.ceil(o / c);
    let y = Math.max(0, Math.floor(u / a) - 15);
    y = Math.min(y, m);
    const A = Math.ceil(s / a) + 30, E = Math.min(y + A, m), S = Math.min(y * c, o), L = Math.min(E * c, o);
    if (S === this._vStart && L === this._vEnd) return;
    this._vStart = S, this._vEnd = L;
    const D = y * a, O = (m - E) * a;
    if (this.isDataDriven) {
      const x = document.createDocumentFragment();
      if (D > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = D + "px", x.appendChild(I);
      }
      for (let I = S; I < L; I++) {
        const N = this._buildItem(t[I]);
        N && x.appendChild(N);
      }
      if (O > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = O + "px", x.appendChild(I);
      }
      this.tbody.textContent = "", this.tbody.appendChild(x), this._selectable && this._updateSelectAll();
    } else {
      let x = "";
      D > 0 && (x += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${D}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let I = S; I < L; I++)
        x += t[I].html;
      O > 0 && (x += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${O}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = x;
    }
  }, l.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const o = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount, n = this.currentSearch && (e < o || e === 0), u = n ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = Q(this.dom, u, "ln-list"), !t) {
        const s = this.dom.querySelector("template[data-ln-empty]");
        if (s) {
          const r = n ? "search" : "initial", c = s.content.querySelector(`[data-ln-empty-when="${r}"]`) || s.content.firstElementChild;
          c && (t = document.importNode(c, !0));
        }
      }
    } else {
      const o = this.dom.querySelector(`template[${b}]`);
      o && (t = document.importNode(o.content, !0));
    }
    if (t)
      if (t.tagName === "LI" || t.tagName === "TR")
        this.tbody.appendChild(t);
      else {
        const o = document.createElement(this.isUl ? "li" : "div");
        o.appendChild(t), this.tbody.appendChild(o);
      }
    w(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, l.prototype._buildItem = function(t) {
    const o = Q(this.dom, this.name + "-row", "ln-list");
    if (!o) return null;
    const e = o.querySelector("[data-ln-item]") || o.firstElementChild;
    if (!e) return null;
    if (gt(e, t), $(e, t), e._lnRecord = t, t.id != null && (e.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      e.classList.add("ln-item-selected");
      const n = e.querySelector("[data-ln-item-select]");
      n && (n.checked = !0);
    }
    return e;
  }, l.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(o) {
      const e = o.target.closest("[data-ln-item-select]");
      if (!e) return;
      const n = e.closest("[data-ln-item]");
      if (!n) return;
      const u = n.getAttribute("data-ln-item-id");
      u != null && (e.checked ? (t.selectedIds.add(String(u)), n.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(u)), n.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), w(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const o = t._selectAllCheckbox.checked, e = t.tbody.querySelectorAll("[data-ln-item]");
      for (let n = 0; n < e.length; n++) {
        const u = e[n], s = u.getAttribute("data-ln-item-id"), r = u.querySelector("[data-ln-item-select]");
        s != null && (o ? (t.selectedIds.add(String(s)), u.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(s)), u.classList.remove("ln-item-selected")), r && (r.checked = o));
      }
      w(t.dom, "ln-list:select-all", { list: t.name, selected: o }), w(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, l.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    let o = t.length > 0;
    for (let e = 0; e < t.length; e++) {
      const n = t[e].getAttribute("data-ln-item-id");
      if (n != null && !this.selectedIds.has(String(n))) {
        o = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = o;
  }, l.prototype._requestData = function() {
    Bt(this, "ln-list:request-data", "list");
  }, l.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const t = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount, e = o < t;
    if (this._totalSpan && (this._totalSpan.textContent = t), this._filteredSpan && (this._filteredSpan.textContent = e ? o : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const n = this.selectedIds.size;
      this._selectedSpan.textContent = n > 0 ? n : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", n === 0);
    }
  }, l.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, B(h, d, l, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", d = "lnCircularProgress";
  if (window[d] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", p = 36, g = 16, _ = 2 * Math.PI * g;
  function i(n) {
    return this.dom = n, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), o.call(this), n.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  i.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[d]);
  };
  function l(n, u) {
    const s = document.createElementNS(b, n);
    for (const r in u)
      s.setAttribute(r, u[r]);
    return s;
  }
  function t() {
    this.svg = l("svg", {
      viewBox: "0 0 " + p + " " + p,
      "aria-hidden": "true"
    }), this.trackCircle = l("circle", {
      cx: p / 2,
      cy: p / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = l("circle", {
      cx: p / 2,
      cy: p / 2,
      r: g,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": _,
      "stroke-dashoffset": _,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const n = this, u = new MutationObserver(function(s) {
      for (const r of s)
        (r.attributeName === "data-ln-circular-progress" || r.attributeName === "data-ln-circular-progress-max") && e.call(n);
    });
    u.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = u;
  }
  function e() {
    const n = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, u = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let s = u > 0 ? n / u * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100);
    const r = _ - s / 100 * _;
    this.progressCircle.setAttribute("stroke-dashoffset", r);
    const c = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = c !== null ? c : Math.round(s) + "%", w(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: n,
      max: u,
      percentage: s
    });
  }
  B(h, d, i, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", d = "lnSortable", b = "data-ln-sortable-handle";
  if (window[d] !== void 0) return;
  function p(_) {
    this.dom = _, this.isEnabled = _.getAttribute(h) !== "disabled", this._dragging = null, _.setAttribute("aria-roledescription", "sortable list");
    const i = this;
    return this._onPointerDown = function(l) {
      i.isEnabled && i._handlePointerDown(l);
    }, _.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, p.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, p.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), w(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[d]);
  }, p.prototype._handlePointerDown = function(_) {
    let i = _.target.closest("[" + b + "]"), l;
    if (i) {
      for (l = i; l && l.parentElement !== this.dom; )
        l = l.parentElement;
      if (!l || l.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (l = _.target; l && l.parentElement !== this.dom; )
        l = l.parentElement;
      if (!l || l.parentElement !== this.dom) return;
      i = l;
    }
    const o = Array.from(this.dom.children).indexOf(l);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: l,
      index: o
    }).defaultPrevented) return;
    _.preventDefault(), i.setPointerCapture(_.pointerId), this._dragging = l, l.classList.add("ln-sortable--dragging"), l.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), w(this.dom, "ln-sortable:drag-start", {
      item: l,
      index: o
    });
    const n = this, u = function(r) {
      n._handlePointerMove(r);
    }, s = function(r) {
      n._handlePointerEnd(r), i.removeEventListener("pointermove", u), i.removeEventListener("pointerup", s), i.removeEventListener("pointercancel", s);
    };
    i.addEventListener("pointermove", u), i.addEventListener("pointerup", s), i.addEventListener("pointercancel", s);
  }, p.prototype._handlePointerMove = function(_) {
    if (!this._dragging) return;
    const i = Array.from(this.dom.children), l = this._dragging;
    for (const t of i)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of i) {
      if (t === l) continue;
      const o = t.getBoundingClientRect(), e = o.top + o.height / 2;
      if (_.clientY >= o.top && _.clientY < e) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (_.clientY >= e && _.clientY <= o.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, p.prototype._handlePointerEnd = function(_) {
    if (!this._dragging) return;
    const i = this._dragging, l = Array.from(this.dom.children), t = l.indexOf(i);
    let o = null, e = null;
    for (const n of l) {
      if (n.classList.contains("ln-sortable--drop-before")) {
        o = n, e = "before";
        break;
      }
      if (n.classList.contains("ln-sortable--drop-after")) {
        o = n, e = "after";
        break;
      }
    }
    for (const n of l)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (i.classList.remove("ln-sortable--dragging"), i.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== i) {
      e === "before" ? this.dom.insertBefore(i, o) : this.dom.insertBefore(i, o.nextElementSibling);
      const u = Array.from(this.dom.children).indexOf(i);
      w(this.dom, "ln-sortable:reordered", {
        item: i,
        oldIndex: t,
        newIndex: u
      });
    }
    this._dragging = null;
  };
  function g(_) {
    const i = _[d];
    if (!i) return;
    const l = _.getAttribute(h) !== "disabled";
    l !== i.isEnabled && (i.isEnabled = l, w(_, l ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: _ }));
  }
  B(h, d, p, "ln-sortable", {
    onAttributeChange: g
  });
})();
(function() {
  const h = "data-ln-confirm", d = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[d] !== void 0) return;
  function g(_) {
    this.dom = _, this.confirming = !1, this.originalText = _.textContent.trim(), this.confirmText = _.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const i = this;
    return this._onClick = function(l) {
      if (!i.confirming)
        l.preventDefault(), l.stopImmediatePropagation(), i._enterConfirm();
      else {
        if (i._submitted) return;
        i._submitted = !0, i._reset();
      }
    }, _.addEventListener("click", this._onClick), this;
  }
  g.prototype._getTimeout = function() {
    const _ = parseFloat(this.dom.getAttribute(b));
    return isNaN(_) || _ <= 0 ? 3 : _;
  }, g.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var _ = this.dom.querySelector("svg.ln-icon use");
    _ && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = _.getAttribute("href"), _.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), w(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, g.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const _ = this, i = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      _._reset();
    }, i);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var _ = this.dom.querySelector("svg.ln-icon use");
      _ && this.originalIconHref && _.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[d] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[d]);
  }, B(h, d, g, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", d = "lnTranslations";
  if (window[d] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(g) {
    this.dom = g, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = g.getAttribute(h + "-default") || "", this.badgesEl = g.querySelector("[" + h + "-active]"), this.menuEl = g.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const _ = g.getAttribute(h + "-locales");
    if (this.locales = b, _)
      try {
        this.locales = JSON.parse(_);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const i = this;
    return this._onRequestAdd = function(l) {
      l.detail && l.detail.lang && i.addLanguage(l.detail.lang);
    }, this._onRequestRemove = function(l) {
      l.detail && l.detail.lang && i.removeLanguage(l.detail.lang);
    }, g.addEventListener("ln-translations:request-add", this._onRequestAdd), g.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const g = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const _ of g) {
      const i = _.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const l of i)
        l.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, p.prototype._detectExisting = function() {
    const g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const _ of g) {
      const i = _.getAttribute("data-ln-translatable-lang");
      i && i !== this.defaultLang && this.activeLanguages.add(i);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const g = this;
    let _ = 0;
    for (const l in this.locales) {
      if (!this.locales.hasOwnProperty(l) || this.activeLanguages.has(l)) continue;
      _++;
      const t = bt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const o = t.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", l), o.textContent = this.locales[l], o.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), g.menuEl.getAttribute("data-ln-toggle") === "open" && g.menuEl.setAttribute("data-ln-toggle", "close"), g.addLanguage(l));
      }), this.menuEl.appendChild(t);
    }
    const i = this.dom.querySelector("[" + h + "-add]");
    i && (i.style.display = _ === 0 ? "none" : "");
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const g = this;
    this.activeLanguages.forEach(function(_) {
      const i = bt("ln-translations-badge", "ln-translations");
      if (!i) return;
      const l = i.querySelector("[data-ln-translations-lang]");
      l.setAttribute("data-ln-translations-lang", _);
      const t = l.querySelector("span");
      t.textContent = g.locales[_] || _.toUpperCase();
      const o = l.querySelector("button");
      o.setAttribute("aria-label", "Remove " + (g.locales[_] || _.toUpperCase())), o.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), g.removeLanguage(_));
      }), g.badgesEl.appendChild(i);
    });
  }, p.prototype.addLanguage = function(g, _) {
    if (this.activeLanguages.has(g)) return;
    const i = this.locales[g] || g;
    if (z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: g,
      langName: i
    }).defaultPrevented) return;
    this.activeLanguages.add(g), _ = _ || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of t) {
      const e = o.getAttribute("data-ln-translatable"), n = o.getAttribute("data-ln-translations-prefix") || "", u = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!u) continue;
      const s = u.cloneNode(!1);
      n ? s.name = n + "[trans][" + g + "][" + e + "]" : s.name = "trans[" + g + "][" + e + "]", s.value = _[e] !== void 0 ? _[e] : "", s.removeAttribute("id"), s.placeholder = i + " translation", s.setAttribute("data-ln-translatable-lang", g);
      const r = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), c = r.length > 0 ? r[r.length - 1] : u;
      c.parentNode.insertBefore(s, c.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: g,
      langName: i
    });
  }, p.prototype.removeLanguage = function(g) {
    if (!this.activeLanguages.has(g) || z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: g
    }).defaultPrevented) return;
    const i = this.dom.querySelectorAll('[data-ln-translatable-lang="' + g + '"]');
    for (const l of i)
      l.parentNode.removeChild(l);
    this.activeLanguages.delete(g), this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: g
    });
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(g) {
    return this.activeLanguages.has(g);
  }, p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const g = this.defaultLang, _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const i of _)
      i.getAttribute("data-ln-translatable-lang") !== g && i.parentNode.removeChild(i);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[d];
  }, B(h, d, p, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", d = "lnAutosave", b = "data-ln-autosave-clear", p = "data-ln-autosave-debounce-input", g = "ln-autosave:";
  if (window[d] !== void 0) return;
  function i(e) {
    const n = l(e);
    if (!n) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = n;
    let u = null;
    function s() {
      const a = Pt(e);
      try {
        localStorage.setItem(n, JSON.stringify(a));
      } catch {
        return;
      }
      w(e, "ln-autosave:saved", { target: e, data: a });
    }
    function r() {
      let a;
      try {
        a = localStorage.getItem(n);
      } catch {
        return;
      }
      if (!a) return;
      let m;
      try {
        m = JSON.parse(a);
      } catch {
        return;
      }
      if (z(e, "ln-autosave:before-restore", { target: e, data: m }).defaultPrevented) return;
      const A = Ht(e, m);
      for (let E = 0; E < A.length; E++)
        A[E].dispatchEvent(new Event("input", { bubbles: !0 })), A[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      w(e, "ln-autosave:restored", { target: e, data: m });
    }
    function c() {
      try {
        localStorage.removeItem(n);
      } catch {
        return;
      }
      w(e, "ln-autosave:cleared", { target: e });
    }
    this._onFocusout = function(a) {
      const m = a.target;
      t(m) && m.name && s();
    }, this._onChange = function(a) {
      const m = a.target;
      t(m) && m.name && s();
    }, this._onSubmit = function() {
      c();
    }, this._onReset = function() {
      c();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + b + "]") && c();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick);
    const f = o(e);
    return f > 0 && (this._onInput = function(a) {
      const m = a.target;
      !t(m) || !m.name || (u !== null && clearTimeout(u), u = setTimeout(s, f));
    }, e.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, r(), this;
  }
  i.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const e = this._getInputTimer();
        e !== null && clearTimeout(e);
      }
      w(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function l(e) {
    const u = e.getAttribute(h) || e.id;
    return u ? g + window.location.pathname + ":" + u : null;
  }
  function t(e) {
    const n = e.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function o(e) {
    if (!e.hasAttribute(p)) return 0;
    const n = e.getAttribute(p);
    if (n === "" || n === null) return 1e3;
    const u = parseInt(n, 10);
    return isNaN(u) || u < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", e), 1e3) : u;
  }
  B(h, d, i, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", d = "lnAutoresize";
  if (window[d] !== void 0) return;
  function b(p) {
    if (p.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", p.tagName), this;
    this.dom = p;
    const g = this;
    return this._onInput = function() {
      g._resize();
    }, p.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[d]);
  }, B(h, d, b, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", d = "lnValidate", b = "data-ln-validate-errors", p = "data-ln-validate-error", g = "ln-validate-valid", _ = "ln-validate-invalid", i = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[d] !== void 0) return;
  function l(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, e = t.tagName, n = t.type, u = e === "SELECT" || n === "checkbox" || n === "radio";
    return this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(s) {
      const r = s.detail && s.detail.error;
      if (!r) return;
      o._customErrors.add(r), o._touched = !0;
      const c = t.closest(".form-element");
      if (c) {
        const f = c.querySelector("[" + p + '="' + r + '"]');
        f && f.classList.remove("hidden");
      }
      t.classList.remove(g), t.classList.add(_);
    }, this._onClearCustom = function(s) {
      const r = s.detail && s.detail.error, c = t.closest(".form-element");
      if (r) {
        if (o._customErrors.delete(r), c) {
          const f = c.querySelector("[" + p + '="' + r + '"]');
          f && f.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(f) {
          if (c) {
            const a = c.querySelector("[" + p + '="' + f + '"]');
            a && a.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, u || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  l.prototype.validate = function() {
    const t = this.dom, o = t.validity, n = t.checkValidity() && this._customErrors.size === 0, u = t.closest(".form-element");
    if (u) {
      const r = u.querySelector("[" + b + "]");
      if (r) {
        const c = r.querySelectorAll("[" + p + "]");
        for (let f = 0; f < c.length; f++) {
          const a = c[f].getAttribute(p), m = i[a];
          m && (o[m] ? c[f].classList.remove("hidden") : c[f].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(g, n), t.classList.toggle(_, !n), w(t, n ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), n;
  }, l.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(g, _);
    const t = this.dom.closest(".form-element");
    if (t) {
      const o = t.querySelectorAll("[" + p + "]");
      for (let e = 0; e < o.length; e++)
        o[e].classList.add("hidden");
    }
  }, Object.defineProperty(l.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), l.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(g, _), w(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, l, "ln-validate");
})();
(function() {
  const h = "data-ln-form", d = "lnForm", b = "data-ln-form-auto", p = "data-ln-form-debounce", g = "data-ln-validate", _ = "lnValidate";
  if (window[d] !== void 0) return;
  function i(l) {
    this.dom = l, this._debounceTimer = null;
    const t = this;
    if (this._onValid = function() {
      t._updateSubmitButton();
    }, this._onInvalid = function() {
      t._updateSubmitButton();
    }, this._onSubmit = function(o) {
      o.preventDefault(), t.submit();
    }, this._onFill = function(o) {
      o.detail && t.fill(o.detail);
    }, this._onFormReset = function() {
      t.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        t._resetValidation();
      }, 0);
    }, l.addEventListener("ln-validate:valid", this._onValid), l.addEventListener("ln-validate:invalid", this._onInvalid), l.addEventListener("submit", this._onSubmit), l.addEventListener("ln-form:fill", this._onFill), l.addEventListener("ln-form:reset", this._onFormReset), l.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, l.hasAttribute(b)) {
      const o = parseInt(l.getAttribute(p)) || 0;
      this._onAutoInput = function() {
        o > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, o)) : t.submit();
      }, l.addEventListener("input", this._onAutoInput), l.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  i.prototype._updateSubmitButton = function() {
    const l = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!l.length) return;
    const t = this.dom.querySelectorAll("[" + g + "]");
    let o = !1;
    if (t.length > 0) {
      let e = !1, n = !1;
      for (let u = 0; u < t.length; u++) {
        const s = t[u][_];
        s && s._touched && (e = !0), t[u].checkValidity() || (n = !0);
      }
      o = n || !e;
    }
    for (let e = 0; e < l.length; e++)
      l[e].disabled = o;
  }, i.prototype.fill = function(l) {
    const t = Ht(this.dom, l);
    for (let o = 0; o < t.length; o++) {
      const e = t[o], n = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, i.prototype.submit = function() {
    const l = this.dom.querySelectorAll("[" + g + "]");
    let t = !0;
    for (let e = 0; e < l.length; e++) {
      const n = l[e][_];
      n && (n.validate() || (t = !1));
    }
    if (!t) return;
    const o = Pt(this.dom);
    w(this.dom, "ln-form:submit", { data: o });
  }, i.prototype.reset = function() {
    this.dom.reset();
    const l = this.dom.querySelectorAll("input, textarea, select");
    for (let t = 0; t < l.length; t++) {
      const o = l[t], e = o.tagName === "SELECT" || o.type === "checkbox" || o.type === "radio";
      o.dispatchEvent(new Event(e ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), w(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, i.prototype._resetValidation = function() {
    const l = this.dom.querySelectorAll("[" + g + "]");
    for (let t = 0; t < l.length; t++) {
      const o = l[t][_];
      o && o.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(i.prototype, "isValid", {
    get: function() {
      const l = this.dom.querySelectorAll("[" + g + "]");
      for (let t = 0; t < l.length; t++)
        if (!l[t].checkValidity()) return !1;
      return !0;
    }
  }), i.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), w(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, i, "ln-form");
})();
(function() {
  const h = "data-ln-time", d = "lnTime";
  if (window[d] !== void 0) return;
  const b = {}, p = {};
  function g(E) {
    return E.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function _(E, S) {
    const L = (E || "") + "|" + JSON.stringify(S);
    return b[L] || (b[L] = new Intl.DateTimeFormat(E, S)), b[L];
  }
  function i(E) {
    const S = E || "";
    return p[S] || (p[S] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), p[S];
  }
  const l = /* @__PURE__ */ new Set();
  let t = null;
  function o() {
    t || (t = setInterval(n, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function n() {
    for (const E of l) {
      if (!document.body.contains(E.dom)) {
        l.delete(E);
        continue;
      }
      a(E);
    }
    l.size === 0 && e();
  }
  function u(E, S) {
    return _(S, { dateStyle: "long", timeStyle: "short" }).format(E);
  }
  function s(E, S) {
    const L = /* @__PURE__ */ new Date(), D = { month: "short", day: "numeric" };
    return E.getFullYear() !== L.getFullYear() && (D.year = "numeric"), _(S, D).format(E);
  }
  function r(E, S) {
    return _(S, { dateStyle: "medium" }).format(E);
  }
  function c(E, S) {
    return _(S, { timeStyle: "short" }).format(E);
  }
  function f(E, S) {
    const L = Math.floor(Date.now() / 1e3), O = Math.floor(E.getTime() / 1e3) - L, x = Math.abs(O);
    if (x < 10) return i(S).format(0, "second");
    let I, N;
    if (x < 60)
      I = "second", N = O;
    else if (x < 3600)
      I = "minute", N = Math.round(O / 60);
    else if (x < 86400)
      I = "hour", N = Math.round(O / 3600);
    else if (x < 604800)
      I = "day", N = Math.round(O / 86400);
    else if (x < 2592e3)
      I = "week", N = Math.round(O / 604800);
    else
      return s(E, S);
    return i(S).format(N, I);
  }
  function a(E) {
    const S = E.dom.getAttribute("datetime");
    if (!S) return;
    const L = Number(S);
    if (isNaN(L)) return;
    const D = new Date(L * 1e3), O = E.dom.getAttribute(h) || "short", x = g(E.dom);
    let I;
    switch (O) {
      case "relative":
        I = f(D, x);
        break;
      case "full":
        I = u(D, x);
        break;
      case "date":
        I = r(D, x);
        break;
      case "time":
        I = c(D, x);
        break;
      default:
        I = s(D, x);
        break;
    }
    E.dom.textContent = I, O !== "full" && (E.dom.title = u(D, x));
  }
  function m(E) {
    return this.dom = E, a(this), E.getAttribute(h) === "relative" && (l.add(this), o()), this;
  }
  m.prototype.render = function() {
    a(this);
  }, m.prototype.destroy = function() {
    l.delete(this), l.size === 0 && e(), delete this.dom[d];
  };
  function y(E) {
    const S = E[d];
    if (!S) return;
    E.getAttribute(h) === "relative" ? (l.add(S), o()) : (l.delete(S), l.size === 0 && e()), a(S);
  }
  function A(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(h) && E[d] && a(E[d]);
  }
  B(h, d, m, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: y,
    onInit: A
  });
})();
(function() {
  const h = "data-ln-data-store", d = "lnDataStore";
  if (window[d] !== void 0) return;
  const b = "ln_app_cache", p = "_meta", g = "1.0";
  let _ = null, i = null;
  const l = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (C) => {
        const T = Math.random() * 16 | 0;
        return (C === "x" ? T : T & 3 | 8).toString(16);
      });
    }
  }
  function o(v) {
    v && v.name === "QuotaExceededError" && w(document, "ln-store:quota-exceeded", { error: v });
  }
  function e() {
    const v = {};
    for (const C of document.querySelectorAll(`[${h}]`)) {
      const T = C.getAttribute(h);
      if (T) {
        const k = C.getAttribute("data-ln-data-store-indexes") || C.getAttribute("data-ln-store-indexes") || "";
        v[T] = {
          indexes: k.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return v;
  }
  function n() {
    return i || (i = new Promise((v) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), v(null);
      const C = e(), T = Object.keys(C), k = indexedDB.open(b);
      k.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), v(null);
      }, k.onsuccess = (R) => {
        const F = R.target.result, M = Array.from(F.objectStoreNames);
        if (!(!M.includes(p) || T.some((ft) => !M.includes(ft))))
          return u(F), _ = F, v(F);
        const X = F.version;
        F.close();
        const nt = indexedDB.open(b, X + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), v(null);
        }, nt.onupgradeneeded = (ft) => {
          const it = ft.target.result;
          it.objectStoreNames.contains(p) || it.createObjectStore(p, { keyPath: "key" });
          for (const wt of T)
            if (!it.objectStoreNames.contains(wt)) {
              const Qt = it.createObjectStore(wt, { keyPath: "id" });
              for (const Rt of C[wt].indexes)
                Qt.createIndex(Rt, Rt, { unique: !1 });
            }
        }, nt.onsuccess = (ft) => {
          const it = ft.target.result;
          u(it), _ = it, v(it);
        };
      };
    }), i);
  }
  function u(v) {
    v.onversionchange = () => {
      v.close(), _ = null, i = null;
    };
  }
  function s() {
    return _ ? Promise.resolve(_) : (i = null, n());
  }
  async function r(v) {
    if (!pt() || !v) return v;
    const C = { ...v }, T = C.id, k = C._pending, R = await se(C);
    return !R || !R.encrypted ? v : {
      id: T,
      _pending: k,
      encrypted: !0,
      iv: R.iv,
      data: R.data
    };
  }
  async function c(v) {
    return !v || !v.encrypted || !pt() ? v : le(v);
  }
  const f = (v, C) => s().then((T) => T ? T.transaction(v, C).objectStore(v) : null);
  function a(v) {
    return new Promise((C, T) => {
      v.onsuccess = () => C(v.result), v.onerror = () => {
        o(v.error), T(v.error);
      };
    });
  }
  const m = (v) => f(v, "readonly").then((C) => C ? a(C.getAll()) : []).then((C) => pt() ? Promise.all(C.map((T) => c(T))) : C), y = (v, C) => f(v, "readonly").then((T) => T ? a(T.get(C)) : null).then((T) => T ? c(T) : null), A = (v, C) => (pt() ? r(C) : Promise.resolve(C)).then((k) => f(v, "readwrite").then((R) => R ? a(R.put(k)) : null)), E = (v, C) => f(v, "readwrite").then((T) => T ? a(T.delete(C)) : null), S = (v) => f(v, "readwrite").then((C) => C ? a(C.clear()) : null), L = (v) => f(v, "readonly").then((C) => C ? a(C.count()) : 0), D = (v) => f(p, "readonly").then((C) => C ? a(C.get(v)) : null), O = (v, C) => f(p, "readwrite").then((T) => {
    if (T)
      return C.key = v, a(T.put(C));
  });
  function x(v) {
    this.dom = v, this._name = v.getAttribute(h);
    const C = v.getAttribute("data-ln-data-store-stale") || v.getAttribute("data-ln-store-stale"), T = parseInt(C, 10);
    this._staleThreshold = C === "never" || C === "-1" ? -1 : isNaN(T) ? 300 : T;
    const k = v.getAttribute("data-ln-data-store-search-fields") || v.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = k.split(",").map((R) => R.trim()).filter(Boolean), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, l[this._name] = this, I(this), _t(this), this;
  }
  function I(v) {
    v._handlers = {
      create: (C) => N(v, C.detail),
      update: (C) => j(v, C.detail),
      delete: (C) => Z(v, C.detail),
      "bulk-delete": (C) => tt(v, C.detail)
    };
    for (const [C, T] of Object.entries(v._handlers))
      v.dom.addEventListener(`ln-store:request-${C}`, T);
  }
  function N(v, { data: C = {} } = {}) {
    const T = `_temp_${t()}`, k = { ...C, id: T, _pending: !0 };
    A(v._name, k).then(() => {
      v.totalCount++, w(v.dom, "ln-store:created", { store: v._name, record: k, tempId: T }), w(v.dom, "ln-store:request-remote-create", { tempId: T, data: C });
    });
  }
  function j(v, { id: C, data: T = {}, expected_version: k } = {}) {
    y(v._name, C).then((R) => {
      if (!R) throw new Error(`Record not found: ${C}`);
      v._pendingSnapshots[C] = { ...R };
      const F = { ...R, ...T, _pending: !0 };
      return A(v._name, F).then(() => {
        w(v.dom, "ln-store:updated", { store: v._name, record: F, previous: v._pendingSnapshots[C] }), w(v.dom, "ln-store:request-remote-update", { id: C, data: T, expected_version: k });
      });
    }).catch((R) => console.error("[ln-data-store] Optimistic update failed:", R));
  }
  function Z(v, { id: C } = {}) {
    y(v._name, C).then((T) => {
      if (T)
        return v._pendingSnapshots[C] = { ...T }, E(v._name, C).then(() => {
          v.totalCount--, w(v.dom, "ln-store:deleted", { store: v._name, id: C }), w(v.dom, "ln-store:request-remote-delete", { id: C });
        });
    }).catch((T) => console.error("[ln-data-store] Optimistic delete failed:", T));
  }
  function tt(v, { ids: C = [] } = {}) {
    C.length && Promise.all(C.map((T) => y(v._name, T))).then((T) => {
      const k = T.filter(Boolean), R = k.map((F) => F.id);
      return v._pendingSnapshots[R.join(",")] = k, q(v._name, R).then(() => {
        v.totalCount -= R.length, w(v.dom, "ln-store:deleted", { store: v._name, ids: R }), w(v.dom, "ln-store:request-remote-bulk-delete", { ids: R });
      });
    }).catch((T) => console.error("[ln-data-store] Optimistic bulk delete failed:", T));
  }
  function _t(v) {
    n().then(() => D(v._name)).then((C) => {
      C && C.schema_version === g ? (v.lastSyncedAt = C.last_synced_at || null, v.totalCount = C.record_count || 0, v.totalCount > 0 ? (v.isLoaded = !0, w(v.dom, "ln-store:ready", { store: v._name, count: v.totalCount, source: "cache" }), at(v) && Y(v)) : Y(v)) : C && C.schema_version !== g ? S(v._name).then(() => O(v._name, { schema_version: g, last_synced_at: null, record_count: 0 })).then(() => Y(v)) : Y(v);
    });
  }
  function at(v) {
    return v._staleThreshold === -1 ? !1 : v.lastSyncedAt ? Math.floor(Date.now() / 1e3) - v.lastSyncedAt > v._staleThreshold : !0;
  }
  function Y(v) {
    v.isSyncing = !0, w(v.dom, "ln-store:request-remote-sync", { since: v.lastSyncedAt });
  }
  function ct(v, C) {
    return s().then((T) => T ? (pt() ? Promise.all(C.map((R) => r(R))) : Promise.resolve(C)).then((R) => new Promise((F, M) => {
      const U = T.transaction(v, "readwrite"), X = U.objectStore(v);
      R.forEach((nt) => X.put(nt)), U.oncomplete = () => F(), U.onerror = () => {
        o(U.error), M(U.error);
      };
    })) : void 0);
  }
  function q(v, C) {
    return s().then((T) => {
      if (T)
        return new Promise((k, R) => {
          const F = T.transaction(v, "readwrite"), M = F.objectStore(v);
          C.forEach((U) => M.delete(U)), F.oncomplete = () => k(), F.onerror = () => R(F.error);
        });
    });
  }
  let P = () => {
    document.visibilityState === "visible" && Object.values(l).forEach((v) => {
      v.isLoaded && !v.isSyncing && at(v) && Y(v);
    });
  };
  document.addEventListener("visibilitychange", P);
  const H = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function rt(v, C) {
    if (!C || !C.field) return v;
    const { field: T, direction: k } = C, R = k === "desc";
    return [...v].sort((F, M) => {
      const U = F[T], X = M[T];
      if (U == null && X == null) return 0;
      if (U == null) return R ? 1 : -1;
      if (X == null) return R ? -1 : 1;
      const nt = typeof U == "string" && typeof X == "string" ? H.compare(U, X) : U < X ? -1 : U > X ? 1 : 0;
      return R ? -nt : nt;
    });
  }
  function dt(v, C) {
    if (!C) return v;
    const T = Object.keys(C).filter((k) => Array.isArray(C[k]) && C[k].length > 0);
    return T.length ? v.filter(
      (k) => T.every((R) => C[R].map(String).includes(String(k[R])))
    ) : v;
  }
  function G(v, C, T) {
    if (!C || !T || !T.length) return v;
    const k = C.toLowerCase();
    return v.filter(
      (R) => T.some((F) => {
        const M = R[F];
        return M != null && String(M).toLowerCase().includes(k);
      })
    );
  }
  function ut(v, C, T) {
    if (!v.length) return 0;
    if (T === "count") return v.length;
    const k = v.map((F) => parseFloat(F[C])).filter((F) => !isNaN(F)), R = k.reduce((F, M) => F + M, 0);
    return T === "sum" ? R : T === "avg" && k.length ? R / k.length : 0;
  }
  function et(v, C) {
    if (!v.presenters || !v.presenters.computed) return C;
    const T = v.presenters.computed;
    return C.map((k) => {
      const R = { ...k };
      for (const [F, M] of Object.entries(T))
        try {
          R[F] = M(k);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${F}`, U);
        }
      return R;
    });
  }
  x.prototype.getAll = function(v = {}) {
    const C = this;
    return m(C._name).then((T) => {
      const k = T.length;
      v.filters && (T = dt(T, v.filters)), v.search && (T = G(T, v.search, C._searchFields));
      const R = T.length;
      if (v.sort && (T = rt(T, v.sort)), v.offset || v.limit) {
        const F = v.offset || 0, M = v.limit || T.length;
        T = T.slice(F, F + M);
      }
      return {
        data: et(C, T),
        total: k,
        filtered: R
      };
    });
  }, x.prototype.getById = function(v) {
    return y(this._name, v).then((C) => C ? et(this, [C])[0] : null);
  }, x.prototype.count = function(v) {
    return v ? m(this._name).then((C) => dt(C, v).length) : L(this._name);
  }, x.prototype.aggregate = function(v, C) {
    return m(this._name).then((T) => ut(T, v, C));
  }, x.prototype.setPresenters = function(v) {
    this.presenters = v;
  }, x.prototype.applySync = function(v, C, T) {
    const k = this, R = v.length > 0 || C.length > 0;
    let F = Promise.resolve();
    return v.length > 0 && (F = F.then(() => ct(k._name, v))), C.length > 0 && (F = F.then(() => q(k._name, C))), F.then(() => L(k._name)).then((M) => (k.totalCount = M, O(k._name, {
      schema_version: g,
      last_synced_at: T,
      record_count: M
    }))).then(() => {
      const M = !k.isLoaded;
      k.isLoaded = !0, k.isSyncing = !1, k.lastSyncedAt = T, M ? (w(k.dom, "ln-store:loaded", { store: k._name, count: k.totalCount }), w(k.dom, "ln-store:ready", { store: k._name, count: k.totalCount, source: "server" })) : w(k.dom, "ln-store:synced", {
        store: k._name,
        added: v.length,
        deleted: C.length,
        changed: R
      });
    }).catch((M) => {
      k.isSyncing = !1, console.error("[ln-data-store] applySync failed:", M);
    });
  }, x.prototype.confirmMutation = function(v, C, T) {
    const k = this, R = {
      create: () => E(k._name, v).then(() => A(k._name, C)).then(() => {
        delete k._pendingSnapshots[v], w(k.dom, "ln-store:confirmed", { store: k._name, record: C, tempId: v, action: "create" });
      }),
      update: () => A(k._name, C).then(() => {
        delete k._pendingSnapshots[v], w(k.dom, "ln-store:confirmed", { store: k._name, record: C, action: "update" });
      }),
      delete: () => (delete k._pendingSnapshots[v], w(k.dom, "ln-store:confirmed", { store: k._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete k._pendingSnapshots[v], w(k.dom, "ln-store:confirmed", { store: k._name, record: null, ids: v.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return R[T] ? R[T]() : Promise.resolve();
  }, x.prototype.revertMutation = function(v, C, T) {
    const k = this, R = T || `Server rejected ${C}`, F = {
      create: () => E(k._name, v).then(() => {
        k.totalCount--, delete k._pendingSnapshots[v], w(k.dom, "ln-store:reverted", { store: k._name, record: null, action: "create", error: R });
      }),
      update: () => {
        const M = k._pendingSnapshots[v];
        return M ? A(k._name, M).then(() => {
          delete k._pendingSnapshots[v], w(k.dom, "ln-store:reverted", { store: k._name, record: M, action: "update", error: R });
        }) : Promise.resolve();
      },
      delete: () => {
        const M = k._pendingSnapshots[v];
        return M ? A(k._name, M).then(() => {
          k.totalCount++, delete k._pendingSnapshots[v], w(k.dom, "ln-store:reverted", { store: k._name, record: M, action: "delete", error: R });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const M = k._pendingSnapshots[v];
        return !M || !M.length ? Promise.resolve() : ct(k._name, M).then(() => {
          k.totalCount += M.length, delete k._pendingSnapshots[v], w(k.dom, "ln-store:reverted", { store: k._name, record: null, ids: v.split(","), action: "bulk-delete", error: R });
        });
      }
    };
    return F[C] ? F[C]() : Promise.resolve();
  }, x.prototype.resolveConflict = function(v, C, T) {
    const k = this._pendingSnapshots[v];
    return k ? A(this._name, k).then(() => {
      delete this._pendingSnapshots[v], w(this.dom, "ln-store:conflict", {
        store: this._name,
        local: k,
        remote: C,
        field_diffs: T || null
      });
    }) : Promise.resolve();
  }, x.prototype.forceSync = function() {
    Y(this);
  }, x.prototype.fullReload = function() {
    const v = this;
    return S(v._name).then(() => {
      v.isLoaded = !1, v.lastSyncedAt = null, v.totalCount = 0, Y(v);
    });
  }, x.prototype.destroy = function() {
    if (this._handlers) {
      for (const [v, C] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${v}`, C);
      this._handlers = null;
    }
    delete l[this._name], Object.keys(l).length === 0 && P && (document.removeEventListener("visibilitychange", P), P = null), delete this.dom[d], w(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function ht() {
    return s().then((v) => {
      if (!v) return;
      const C = Array.from(v.objectStoreNames);
      return new Promise((T, k) => {
        const R = v.transaction(C, "readwrite");
        C.forEach((F) => R.objectStore(F).clear()), R.oncomplete = () => T(), R.onerror = () => k(R.error);
      });
    }).then(() => {
      Object.values(l).forEach((v) => {
        v.isLoaded = !1, v.isSyncing = !1, v.lastSyncedAt = null, v.totalCount = 0;
      });
    });
  }
  B(h, d, x, "ln-data-store"), window[d].clearAll = ht, window[d].init = window[d], window[d].setStorageKey = Ft, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Ft);
})();
(function() {
  const h = "data-ln-api-connector", d = "lnApiConnector", b = "lnConnector";
  if (window[d] !== void 0) return;
  function p(i) {
    return this.dom = i, i[d] = this, i[b] = this, this.refreshConfig(), this._handlers = null, g(this), this;
  }
  p.prototype.refreshConfig = function() {
    const i = this.dom;
    this.baseUrl = i.getAttribute("data-ln-api-base-url") || "", this.path = i.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const l = i.getAttribute("data-ln-api-headers") || "";
    this.headers = zt(l, "ln-api-connector"), (l.toLowerCase().includes("authorization") || l.toLowerCase().includes("bearer") || l.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), w(i, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, p.prototype.fetchDelta = function(i) {
    const l = this;
    let t = V(l.baseUrl, l.path);
    return i != null && i !== "" && (t += (t.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(i)), window.fetch(t, { method: "GET", headers: K(l.headers), credentials: l.credentials }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    });
  }, p.prototype.create = function(i) {
    const l = this;
    return window.fetch(V(l.baseUrl, l.path), {
      method: "POST",
      headers: K(l.headers),
      credentials: l.credentials,
      body: JSON.stringify(i)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, p.prototype.update = function(i, l) {
    const t = this;
    return window.fetch(V(t.baseUrl, t.path, i), {
      method: "PUT",
      headers: K(t.headers),
      credentials: t.credentials,
      body: JSON.stringify(l)
    }).then((o) => {
      if (o.ok) return o.json();
      if (o.status === 409) return o.json().then((e) => {
        const n = new Error("Conflict");
        throw n.status = 409, n.data = e, n;
      });
      throw new Error("HTTP " + o.status + ": " + o.statusText);
    });
  }, p.prototype.delete = function(i) {
    const l = this;
    return window.fetch(V(l.baseUrl, l.path, i), {
      method: "DELETE",
      headers: K(l.headers),
      credentials: l.credentials
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, p.prototype.bulkDelete = function(i) {
    const l = this;
    return window.fetch(V(l.baseUrl, l.path) + "/bulk-delete", {
      method: "DELETE",
      headers: K(l.headers),
      credentials: l.credentials,
      body: JSON.stringify({ ids: i })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  };
  function g(i) {
    i._handlers = {
      sync: function(t) {
        const o = t.detail || {};
        i.fetchDelta(o.since).then(function(e) {
          w(i.dom, "ln-api-connector:fetched", { data: e, since: o.since });
        }).catch(function(e) {
          w(i.dom, "ln-api-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: o.since
          });
        });
      },
      create: function(t) {
        const o = t.detail || {};
        i.create(o.data).then(function(e) {
          w(i.dom, "ln-api-connector:created", { record: e, tempId: o.tempId });
        }).catch(function(e) {
          w(i.dom, "ln-api-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: o.tempId
          });
        });
      },
      update: function(t) {
        const o = t.detail || {}, e = Object.assign({}, o.data);
        o.expected_version !== void 0 && (e.expected_version = o.expected_version), i.update(o.id, e).then(function(n) {
          w(i.dom, "ln-api-connector:updated", { record: n, id: o.id });
        }).catch(function(n) {
          w(i.dom, "ln-api-connector:error", {
            action: "update",
            error: n.message,
            status: n.status || 0,
            id: o.id,
            conflictData: n.status === 409 ? n.data : null
          });
        });
      },
      delete: function(t) {
        const o = t.detail || {};
        i.delete(o.id).then(function(e) {
          w(i.dom, "ln-api-connector:deleted", { response: e, id: o.id });
        }).catch(function(e) {
          w(i.dom, "ln-api-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: o.id
          });
        });
      },
      bulkDelete: function(t) {
        const o = t.detail || {};
        i.bulkDelete(o.ids).then(function(e) {
          w(i.dom, "ln-api-connector:bulk-deleted", { response: e, ids: o.ids });
        }).catch(function(e) {
          w(i.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: o.ids
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      i.dom.addEventListener(t + ":request-sync", i._handlers.sync), i.dom.addEventListener(t + ":request-fetch", i._handlers.sync), i.dom.addEventListener(t + ":request-create", i._handlers.create), i.dom.addEventListener(t + ":request-update", i._handlers.update), i.dom.addEventListener(t + ":request-delete", i._handlers.delete), i.dom.addEventListener(t + ":request-bulk-delete", i._handlers.bulkDelete);
    });
  }
  p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const i = this;
    i._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      i.dom.removeEventListener(t + ":request-sync", i._handlers.sync), i.dom.removeEventListener(t + ":request-fetch", i._handlers.sync), i.dom.removeEventListener(t + ":request-create", i._handlers.create), i.dom.removeEventListener(t + ":request-update", i._handlers.update), i.dom.removeEventListener(t + ":request-delete", i._handlers.delete), i.dom.removeEventListener(t + ":request-bulk-delete", i._handlers.bulkDelete);
    }), i._handlers = null), w(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[b];
  };
  function _(i) {
    const l = i[d];
    l && l.refreshConfig();
  }
  B(h, d, p, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", d = "lnCouchDbConnector", b = "lnConnector";
  if (window[d] !== void 0) return;
  function p(i) {
    return this.dom = i, i[d] = this, i[b] = this, this.refreshConfig(), this._handlers = null, g(this), this;
  }
  p.prototype.refreshConfig = function() {
    const i = this.dom;
    this.url = i.getAttribute("data-ln-couchdb-url") || "", this.db = i.getAttribute("data-ln-couchdb-db") || "", this.auth = i.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const l = i.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = zt(l, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), l.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), w(i, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, p.prototype.fetchDelta = function(i) {
    const l = this, t = ["include_docs=true", "feed=normal"];
    i && t.push("since=" + encodeURIComponent(i));
    const o = V(l.url, l.db, "_changes") + "?" + t.join("&");
    return window.fetch(o, { method: "GET", headers: K(l.headers, l.auth), credentials: l.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const n = e.results || [];
      return {
        data: n.filter((u) => !u.deleted && u.doc).map((u) => Object.assign({}, u.doc, { id: u.doc._id })),
        deleted: n.filter((u) => u.deleted).map((u) => u.id),
        synced_at: e.last_seq || i || ""
      };
    });
  }, p.prototype.create = function(i) {
    const l = this, t = Object.assign({ _id: i.id }, i);
    return t._id || delete t._id, window.fetch(V(l.url, l.db), {
      method: "POST",
      headers: K(l.headers, l.auth),
      credentials: l.credentials,
      body: JSON.stringify(t)
    }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => Object.assign({}, t, { id: o.id, _id: o.id, _rev: o.rev }));
  }, p.prototype.update = function(i, l) {
    const t = this, o = Object.assign({ id: String(i), _id: String(i) }, l), e = o._rev || o.rev;
    return (e ? Promise.resolve(e) : window.fetch(V(t.url, t.db, null, i), { method: "GET", headers: K(t.headers, t.auth), credentials: t.credentials }).then((u) => {
      if (!u.ok) throw new Error("Could not retrieve document for revision mapping");
      return u.json().then((s) => s._rev);
    })).then((u) => {
      const s = Object.assign({}, o, { _rev: u });
      delete s.rev;
      const r = Object.assign(K(t.headers, t.auth), { "If-Match": u });
      return window.fetch(V(t.url, t.db, null, i), {
        method: "PUT",
        headers: r,
        credentials: t.credentials,
        body: JSON.stringify(s)
      }).then((c) => {
        if (c.ok) return c.json().then((f) => Object.assign({}, s, { _rev: f.rev }));
        if (c.status === 409) return c.json().then((f) => {
          const a = new Error("Conflict");
          throw a.status = 409, a.data = f, a;
        });
        throw new Error("HTTP " + c.status + ": " + c.statusText);
      });
    });
  }, p.prototype.delete = function(i, l) {
    const t = this;
    return (l ? Promise.resolve(l) : window.fetch(V(t.url, t.db, null, i), { method: "GET", headers: K(t.headers, t.auth), credentials: t.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((n) => n._rev);
    })).then((e) => {
      const n = V(t.url, t.db, null, i) + "?rev=" + encodeURIComponent(e);
      return window.fetch(n, { method: "DELETE", headers: K(t.headers, t.auth), credentials: t.credentials }).then((u) => {
        if (!u.ok) throw new Error("HTTP " + u.status + ": " + u.statusText);
        return u.json();
      });
    });
  }, p.prototype.bulkDelete = function(i) {
    const l = this;
    return !i || i.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch(V(l.url, l.db, "_all_docs"), {
      method: "POST",
      headers: K(l.headers, l.auth),
      credentials: l.credentials,
      body: JSON.stringify({ keys: i })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = (t.rows || []).filter((n) => !n.error && n.value && n.value.rev).map((n) => ({ _id: n.id, _rev: n.value.rev, _deleted: !0 }));
      return e.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(V(l.url, l.db, "_bulk_docs"), {
        method: "POST",
        headers: K(l.headers, l.auth),
        credentials: l.credentials,
        body: JSON.stringify({ docs: e })
      }).then((n) => {
        if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
        return n.json();
      }).then((n) => ({ ok: !0, results: n, deletedCount: e.length }));
    });
  };
  function g(i) {
    i._handlers = {
      sync: function(t) {
        const o = t.detail || {};
        i.fetchDelta(o.since).then(function(e) {
          w(i.dom, "ln-couchdb-connector:fetched", { data: e, since: o.since });
        }).catch(function(e) {
          w(i.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: o.since
          });
        });
      },
      create: function(t) {
        const o = t.detail || {};
        i.create(o.data).then(function(e) {
          w(i.dom, "ln-couchdb-connector:created", { record: e, tempId: o.tempId });
        }).catch(function(e) {
          w(i.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: o.tempId
          });
        });
      },
      update: function(t) {
        const o = t.detail || {}, e = Object.assign({}, o.data);
        o.expected_version !== void 0 && (e._rev = o.expected_version), i.update(o.id, e).then(function(n) {
          w(i.dom, "ln-couchdb-connector:updated", { record: n, id: o.id });
        }).catch(function(n) {
          w(i.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: n.message,
            status: n.status || 0,
            id: o.id,
            conflictData: n.status === 409 ? n.data : null
          });
        });
      },
      delete: function(t) {
        const o = t.detail || {};
        i.delete(o.id, o.rev).then(function(e) {
          w(i.dom, "ln-couchdb-connector:deleted", { response: e, id: o.id });
        }).catch(function(e) {
          w(i.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: o.id
          });
        });
      },
      bulkDelete: function(t) {
        const o = t.detail || {};
        i.bulkDelete(o.ids).then(function(e) {
          w(i.dom, "ln-couchdb-connector:bulk-deleted", { response: e, ids: o.ids });
        }).catch(function(e) {
          w(i.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: o.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      i.dom.addEventListener(t + ":request-sync", i._handlers.sync), i.dom.addEventListener(t + ":request-fetch", i._handlers.sync), i.dom.addEventListener(t + ":request-create", i._handlers.create), i.dom.addEventListener(t + ":request-update", i._handlers.update), i.dom.addEventListener(t + ":request-delete", i._handlers.delete), i.dom.addEventListener(t + ":request-bulk-delete", i._handlers.bulkDelete);
    });
  }
  p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const i = this;
    i._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      i.dom.removeEventListener(t + ":request-sync", i._handlers.sync), i.dom.removeEventListener(t + ":request-fetch", i._handlers.sync), i.dom.removeEventListener(t + ":request-create", i._handlers.create), i.dom.removeEventListener(t + ":request-update", i._handlers.update), i.dom.removeEventListener(t + ":request-delete", i._handlers.delete), i.dom.removeEventListener(t + ":request-bulk-delete", i._handlers.bulkDelete);
    }), i._handlers = null), w(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[b];
  };
  function _(i) {
    const l = i[d];
    l && l.refreshConfig();
  }
  B(h, d, p, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-data-coordinator", d = "lnDataCoordinator", b = "lnCoordinator";
  if (window[d] !== void 0) return;
  function p(i) {
    return this.dom = i, this._name = i.getAttribute(h), i[d] = this, i[b] = this, this.mapper = null, this._handlers = null, this.refreshMapper(), g(this), this;
  }
  p.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const l = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    l && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(l)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(t) {
      return t;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(t) {
      return t;
    });
  }, p.prototype.findChildren = function() {
    const i = this.dom.querySelector("[data-ln-data-store]"), l = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]");
    return {
      storeEl: i,
      connectorEl: l,
      store: i ? i.lnDataStore || i.lnStore : null,
      connector: l ? l.lnConnector || l.lnApiConnector || l.lnCouchDbConnector : null
    };
  };
  function g(i) {
    i._handlers = {
      sync: function(l) {
        i.refreshMapper();
        const t = i.findChildren();
        if (!t.store || !t.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        const o = l.detail.since;
        t.connector.fetchDelta(o).then(function(e) {
          let n = [], u = [], s = null;
          e && Array.isArray(e) ? (n = e, s = Math.floor(Date.now() / 1e3)) : e && (n = Array.isArray(e.data) ? e.data : [], u = Array.isArray(e.deleted) ? e.deleted : [], s = e.synced_at !== void 0 ? e.synced_at : e.since !== void 0 ? e.since : null);
          const r = n.map((c) => i.mapper.ingress(c));
          t.store.applySync(r, u, s);
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Sync failed:", e);
        });
      },
      create: function(l) {
        i.refreshMapper();
        const t = i.findChildren();
        if (!t.store || !t.connector) return;
        const o = l.detail.tempId, e = l.detail.data || {}, n = i.mapper.egress(e);
        t.connector.create(n).then(function(u) {
          const s = i.mapper.ingress(u);
          t.store.confirmMutation(o, s, "create");
        }).catch(function(u) {
          console.error("[ln-data-coordinator] Create mutation failed:", u), t.store.revertMutation(o, "create", u.message || u);
        });
      },
      update: function(l) {
        i.refreshMapper();
        const t = i.findChildren();
        if (!t.store || !t.connector) return;
        const o = l.detail.id, e = l.detail.expected_version;
        t.store.getById(o).then(function(n) {
          if (!n) throw new Error("Record not found in cache store: " + o);
          const u = Object.assign({}, n);
          delete u._pending;
          const s = i.mapper.egress(u);
          return t.connector.update(o, s, e);
        }).then(function(n) {
          const u = i.mapper.ingress(n);
          t.store.confirmMutation(o, u, "update");
        }).catch(function(n) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", n), n.status === 409) {
            const u = n.data && n.data.remote ? i.mapper.ingress(n.data.remote) : null, s = n.data ? n.data.field_diffs : null;
            t.store.resolveConflict(o, u, s);
          } else
            t.store.revertMutation(o, "update", n.message || n);
        });
      },
      delete: function(l) {
        i.refreshMapper();
        const t = i.findChildren();
        if (!t.store || !t.connector) return;
        const o = l.detail.id;
        t.connector.delete(o).then(function() {
          t.store.confirmMutation(o, null, "delete");
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Delete mutation failed:", e), t.store.revertMutation(o, "delete", e.message || e);
        });
      },
      bulkDelete: function(l) {
        i.refreshMapper();
        const t = i.findChildren();
        if (!t.store || !t.connector) return;
        const o = l.detail.ids || [], e = o.join(",");
        t.connector.bulkDelete(o).then(function() {
          t.store.confirmMutation(e, null, "bulk-delete");
        }).catch(function(n) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", n), t.store.revertMutation(e, "bulk-delete", n.message || n);
        });
      }
    }, i.dom.addEventListener("ln-store:request-remote-sync", i._handlers.sync), i.dom.addEventListener("ln-store:request-remote-create", i._handlers.create), i.dom.addEventListener("ln-store:request-remote-update", i._handlers.update), i.dom.addEventListener("ln-store:request-remote-delete", i._handlers.delete), i.dom.addEventListener("ln-store:request-remote-bulk-delete", i._handlers.bulkDelete);
  }
  p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const i = this;
    i._handlers && (i.dom.removeEventListener("ln-store:request-remote-sync", i._handlers.sync), i.dom.removeEventListener("ln-store:request-remote-create", i._handlers.create), i.dom.removeEventListener("ln-store:request-remote-update", i._handlers.update), i.dom.removeEventListener("ln-store:request-remote-delete", i._handlers.delete), i.dom.removeEventListener("ln-store:request-remote-bulk-delete", i._handlers.bulkDelete), i._handlers = null), delete this.dom[d], delete this.dom[b];
  };
  function _(i, l) {
    const t = i[d];
    t && l === "data-ln-data-mapper" && t.refreshMapper();
  }
  B(h, d, p, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: _
  });
})();
(function() {
  const h = "ln-icons-sprite", d = "#ln-", b = "#lnc-", p = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let _ = null;
  const i = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), l = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", o = "lni:v", e = "1";
  function n() {
    try {
      if (localStorage.getItem(o) !== e) {
        for (let m = localStorage.length - 1; m >= 0; m--) {
          const y = localStorage.key(m);
          y && y.indexOf(t) === 0 && localStorage.removeItem(y);
        }
        localStorage.setItem(o, e);
      }
    } catch {
    }
  }
  n();
  function u() {
    return _ || (_ = document.getElementById(h), _ || (_ = document.createElementNS("http://www.w3.org/2000/svg", "svg"), _.id = h, _.setAttribute("hidden", ""), _.setAttribute("aria-hidden", "true"), _.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(_, document.body.firstChild))), _;
  }
  function s(m) {
    return m.indexOf(b) === 0 ? l + "/" + m.slice(b.length) + ".svg" : i + "/" + m.slice(d.length) + ".svg";
  }
  function r(m, y) {
    const A = y.match(/viewBox="([^"]+)"/), E = A ? A[1] : "0 0 24 24", S = y.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), L = S ? S[1].trim() : "", D = y.match(/<svg([^>]*)>/i), O = D ? D[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = m, x.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const N = O.match(new RegExp(I + '="([^"]*)"'));
      N && x.setAttribute(I, N[1]);
    }), x.innerHTML = L, u().querySelector("defs").appendChild(x);
  }
  function c(m) {
    if (p.has(m) || g.has(m) || m.indexOf(b) === 0 && !l) return;
    const y = m.slice(1);
    try {
      const A = localStorage.getItem(t + y);
      if (A) {
        r(y, A), p.add(m);
        return;
      }
    } catch {
    }
    g.add(m), fetch(s(m)).then(function(A) {
      if (!A.ok) throw new Error(A.status);
      return A.text();
    }).then(function(A) {
      r(y, A), p.add(m), g.delete(m);
      try {
        localStorage.setItem(t + y, A);
      } catch {
      }
    }).catch(function() {
      g.delete(m);
    });
  }
  function f(m) {
    const y = 'use[href^="' + d + '"], use[href^="' + b + '"]', A = m.querySelectorAll ? m.querySelectorAll(y) : [];
    if (m.matches && m.matches(y)) {
      const E = m.getAttribute("href");
      E && c(E);
    }
    Array.prototype.forEach.call(A, function(E) {
      const S = E.getAttribute("href");
      S && c(S);
    });
  }
  function a() {
    f(document), new MutationObserver(function(m) {
      m.forEach(function(y) {
        if (y.type === "childList")
          y.addedNodes.forEach(function(A) {
            A.nodeType === 1 && f(A);
          });
        else if (y.type === "attributes" && y.attributeName === "href") {
          const A = y.target.getAttribute("href");
          A && (A.indexOf(d) === 0 || A.indexOf(b) === 0) && c(A);
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
