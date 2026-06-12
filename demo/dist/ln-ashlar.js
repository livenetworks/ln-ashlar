if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...a) {
    typeof a[0] == "string" && (a[0].startsWith("[ln-") || a[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, a);
  };
}
const Tt = {};
function yt(h, a) {
  Tt[h] || (Tt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const b = Tt[h];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + h + '" not found'), null);
}
function w(h, a, b) {
  h.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: b || {}
  }));
}
function z(h, a, b) {
  const m = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return h.dispatchEvent(m), m;
}
function Ut(h, a, b) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const m = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  m[b] = h.name, w(h.dom, a, m);
}
function X(h, a) {
  if (!h || !a) return h;
  const b = h.querySelectorAll("[data-ln-field]");
  for (let n = 0; n < b.length; n++) {
    const r = b[n], t = r.getAttribute("data-ln-field");
    a[t] != null && (r.textContent = a[t]);
  }
  const m = h.querySelectorAll("[data-ln-attr]");
  for (let n = 0; n < m.length; n++) {
    const r = m[n], t = r.getAttribute("data-ln-attr").split(",");
    for (let i = 0; i < t.length; i++) {
      const e = t[i].trim().split(":");
      if (e.length !== 2) continue;
      const o = e[0].trim(), u = e[1].trim();
      a[u] != null && r.setAttribute(o, a[u]);
    }
  }
  const p = h.querySelectorAll("[data-ln-show]");
  for (let n = 0; n < p.length; n++) {
    const r = p[n], t = r.getAttribute("data-ln-show");
    t in a && r.classList.toggle("hidden", !a[t]);
  }
  const f = h.querySelectorAll("[data-ln-class]");
  for (let n = 0; n < f.length; n++) {
    const r = f[n], t = r.getAttribute("data-ln-class").split(",");
    for (let i = 0; i < t.length; i++) {
      const e = t[i].trim().split(":");
      if (e.length !== 2) continue;
      const o = e[0].trim(), u = e[1].trim();
      u in a && r.classList.toggle(o, !!a[u]);
    }
  }
  return h;
}
function _t(h, a) {
  if (!h || !a) return h;
  const b = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const m = b.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(p, f) {
        return a[f] !== void 0 ? a[f] : "";
      }
    ));
  }
  return h;
}
function ie(h, a, b, m, p, f) {
  const n = {};
  for (let t = 0; t < h.children.length; t++) {
    const i = h.children[t], e = i.getAttribute("data-ln-key");
    e && (n[e] = i);
  }
  const r = document.createDocumentFragment();
  for (let t = 0; t < a.length; t++) {
    const i = a[t], e = String(m(i));
    let o = n[e];
    if (o)
      p(o, i, t);
    else {
      const u = yt(b, f);
      if (!u || (_t(u, i), o = u.firstElementChild, !o)) continue;
      o.setAttribute("data-ln-key", e), p(o, i, t);
    }
    r.appendChild(o);
  }
  h.textContent = "", h.appendChild(r);
}
function G(h, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      G(h, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function at(h, a, b) {
  if (h) {
    const m = h.querySelector('[data-ln-template="' + a + '"]');
    if (m) return m.content.cloneNode(!0);
  }
  return yt(a, b);
}
function oe(h, a) {
  const b = {}, m = h.querySelectorAll("[" + a + "]");
  for (let p = 0; p < m.length; p++)
    b[m[p].getAttribute(a)] = m[p].textContent, m[p].remove();
  return b;
}
function kt(h, a, b, m) {
  if (h.nodeType !== 1) return;
  const f = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", n = Array.from(h.querySelectorAll(f));
  h.matches && h.matches(f) && n.push(h);
  for (const r of n)
    r[b] || (r[b] = new m(r));
}
function gt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function jt(h, a) {
  const b = !!(a && a.typed), m = {}, p = h.elements, f = {};
  if (b)
    for (let n = 0; n < p.length; n++) {
      const r = p[n];
      r.name && r.type === "checkbox" && !r.disabled && (f[r.name] = (f[r.name] || 0) + 1);
    }
  for (let n = 0; n < p.length; n++) {
    const r = p[n];
    if (!(!r.name || r.disabled || r.type === "file" || r.type === "submit" || r.type === "button"))
      if (r.type === "checkbox")
        b && f[r.name] === 1 ? m[r.name] = r.checked : (m[r.name] || (m[r.name] = []), r.checked && m[r.name].push(r.value));
      else if (r.type === "radio")
        r.checked && (m[r.name] = r.value);
      else if (r.type === "select-multiple") {
        m[r.name] = [];
        for (let t = 0; t < r.options.length; t++)
          r.options[t].selected && m[r.name].push(r.options[t].value);
      } else if (b && r.type === "hidden")
        m[r.name] = r.value;
      else if (b && (r.type === "number" || r.type === "range")) {
        const t = Number(r.value);
        m[r.name] = r.value === "" || isNaN(t) ? null : t;
      } else
        m[r.name] = r.value;
  }
  return m;
}
function zt(h, a) {
  const b = h.elements, m = [];
  for (let p = 0; p < b.length; p++) {
    const f = b[p];
    if (!f.name || !(f.name in a) || f.type === "file" || f.type === "submit" || f.type === "button") continue;
    const n = a[f.name];
    if (f.type === "checkbox")
      f.checked = Array.isArray(n) ? n.indexOf(f.value) !== -1 : !!n, m.push(f);
    else if (f.type === "radio")
      f.checked = f.value === String(n), m.push(f);
    else if (f.type === "select-multiple") {
      if (Array.isArray(n))
        for (let r = 0; r < f.options.length; r++)
          f.options[r].selected = n.indexOf(f.options[r].value) !== -1;
      m.push(f);
    } else
      f.value = n, m.push(f);
  }
  return m;
}
function J(h) {
  const a = h ? h.closest("[lang]") : null;
  return (a ? a.lang : null) || (document.documentElement ? document.documentElement.lang : null) || navigator.language;
}
function Ft(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function Vt(h, a, { get: b, set: m }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return b ? b.call(this) : a.get.call(this);
    },
    set: function(p) {
      m ? m.call(this, p, (f) => a.set.call(this, f)) : a.set.call(this, p);
    },
    configurable: !0
  });
}
function F(h, a, b, m, p = {}) {
  const f = p.extraAttributes || [], n = p.onAttributeChange || null, r = p.onInit || null;
  function t(i) {
    const e = i || document.body;
    kt(e, h, a, b), r && r(e);
  }
  return G(function() {
    const i = new MutationObserver(function(o) {
      for (let u = 0; u < o.length; u++) {
        const l = o[u];
        if (l.type === "childList") {
          for (let s = 0; s < l.addedNodes.length; s++) {
            const d = l.addedNodes[s];
            d.nodeType === 1 && (kt(d, h, a, b), r && r(d));
          }
          for (let s = 0; s < l.removedNodes.length; s++) {
            const d = l.removedNodes[s];
            if (d.nodeType === 1) {
              const c = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", _ = Array.from(d.querySelectorAll(c));
              d.matches && d.matches(c) && _.push(d);
              for (let v = 0; v < _.length; v++) {
                const E = _[v];
                if (!document.contains(E)) {
                  const S = E[a];
                  S && typeof S.destroy == "function" && S.destroy();
                }
              }
            }
          }
        } else l.type === "attributes" && (n && l.target[a] ? n(l.target, l.attributeName) : (kt(l.target, h, a, b), r && r(l.target)));
      }
    });
    let e = [];
    if (h.indexOf("[") !== -1) {
      const o = /\[([\w-]+)/g;
      let u;
      for (; (u = o.exec(h)) !== null; )
        e.push(u[1]);
    } else
      e.push(h);
    i.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: e.concat(f)
    });
  }, m || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[a] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function Kt(h, a) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !a) return !1;
  const b = a.getAttribute("href");
  return !(!b || a.getAttribute("target") === "_blank" || a.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || a.hostname && a.hostname !== window.location.hostname);
}
function V(...h) {
  return h.filter((a) => a != null && a !== "").map((a, b) => b === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function K(h, a) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, a ? { Authorization: a } : null);
}
function Wt(h, a = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (b) {
    return console.error(`[${a}] Invalid headers JSON:`, b), {};
  }
}
const Gt = {};
function re(h, a) {
  Gt[h] = a;
}
function se(h) {
  return Gt[h] || { ingress: (a) => a, egress: (a) => a };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = re, window.lnCore.getDataMapper = se, window.lnCore.fillTemplate = _t, window.lnCore.fill = X, window.lnCore.renderList = ie);
function le(h, a) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, h(), a && a();
    }));
  };
}
const ae = "ln:";
function ce() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function $t(h, a) {
  const b = a.getAttribute("data-ln-persist"), m = b !== null && b !== "" ? b : a.id;
  return m ? ae + h + ":" + ce() + ":" + m : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function St(h, a) {
  const b = $t(h, a);
  if (!b) return null;
  try {
    const m = localStorage.getItem(b);
    return m !== null ? JSON.parse(m) : null;
  } catch {
    return null;
  }
}
function st(h, a, b) {
  const m = $t(h, a);
  if (m)
    try {
      localStorage.setItem(m, JSON.stringify(b));
    } catch {
    }
}
function Et(h, a, b, m) {
  const p = typeof m == "number" ? m : 4, f = window.innerWidth, n = window.innerHeight, r = a.width, t = a.height, i = (b || "bottom").split("-"), e = i[0], o = i[1] === "start" || i[1] === "end" ? i[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, l = u[e] || u.bottom;
  function s(v) {
    return v === "top" || v === "bottom" ? o === "start" ? h.left : o === "end" ? h.right - r : h.left + (h.width - r) / 2 : o === "start" ? h.top : o === "end" ? h.bottom - t : h.top + (h.height - t) / 2;
  }
  function d(v) {
    let E, S, A = !0;
    return v === "top" ? (E = h.top - p - t, S = s(v), E < 0 && (A = !1)) : v === "bottom" ? (E = h.bottom + p, S = s(v), E + t > n && (A = !1)) : v === "left" ? (E = s(v), S = h.left - p - r, S < 0 && (A = !1)) : (E = s(v), S = h.right + p, S + r > f && (A = !1)), { top: E, left: S, side: v, fits: A };
  }
  let g = null;
  for (let v = 0; v < l.length; v++) {
    const E = d(l[v]);
    if (E.fits) {
      g = E;
      break;
    }
  }
  g || (g = d(l[0]));
  let c = g.top, _ = g.left;
  return r >= f ? _ = 0 : (_ < 0 && (_ = 0), _ + r > f && (_ = f - r)), t >= n ? c = 0 : (c < 0 && (c = 0), c + t > n && (c = n - t)), { top: c, left: _, placement: g.side };
}
function Yt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const a = h.parentNode, b = document.createComment("ln-teleport");
  return a.insertBefore(b, h), document.body.appendChild(h), function() {
    b.parentNode && (b.parentNode.insertBefore(h, b), b.parentNode.removeChild(b));
  };
}
function Dt(h) {
  if (!h) return { width: 0, height: 0 };
  const a = h.style, b = a.visibility, m = a.display, p = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const f = h.offsetWidth, n = h.offsetHeight;
  return a.visibility = b, a.display = m, a.position = p, { width: f, height: n };
}
let ot = null;
async function Bt(h) {
  if (!h) {
    ot = null;
    return;
  }
  try {
    const a = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", a.encode(h));
    ot = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (a) {
    console.error("[ln-core/crypto] Key derivation failed:", a), ot = null;
  }
}
function mt() {
  return ot;
}
async function de(h, a = ot) {
  const b = a || ot;
  if (!b || h === void 0 || h === null) return h;
  try {
    const m = new TextEncoder(), p = crypto.getRandomValues(new Uint8Array(12)), f = typeof h == "string" ? h : JSON.stringify(h), n = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      b,
      m.encode(f)
    ), r = btoa(String.fromCharCode(...p)), t = btoa(String.fromCharCode(...new Uint8Array(n)));
    return {
      encrypted: !0,
      iv: r,
      data: t
    };
  } catch (m) {
    return console.error("[ln-core/crypto] Encryption failed:", m), h;
  }
}
async function ue(h, a = ot) {
  const b = a || ot;
  if (!h || !h.encrypted || !b) return h;
  try {
    const m = new TextDecoder(), p = Uint8Array.from(atob(h.iv), (t) => t.charCodeAt(0)), f = Uint8Array.from(atob(h.data), (t) => t.charCodeAt(0)), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: p },
      b,
      f
    ), r = m.decode(n);
    try {
      return JSON.parse(r);
    } catch {
      return r;
    }
  } catch (m) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", m), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function m(i) {
    return typeof i == "string" ? i : i instanceof URL ? i.href : i instanceof Request ? i.url : String(i);
  }
  function p(i, e) {
    return e && e.method ? String(e.method).toUpperCase() : i instanceof Request ? i.method.toUpperCase() : "GET";
  }
  function f(i, e) {
    return e + " " + i;
  }
  function n(i) {
    return i === "GET" || i === "HEAD";
  }
  function r(i, e) {
    e = e || {};
    const o = m(i), u = p(i, e), l = f(o, u);
    n(u) && a.has(l) && (a.get(l).abort(), a.delete(l));
    const s = new AbortController(), d = e.signal;
    d && (d.aborted ? s.abort(d.reason) : d.addEventListener("abort", function() {
      s.abort(d.reason);
    }, { once: !0 }));
    const g = Object.assign({}, e, { signal: s.signal });
    return a.set(l, s), h(i, g).finally(function() {
      a.get(l) === s && a.delete(l);
    });
  }
  r.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = r;
  function t(i) {
    const e = i.detail || {};
    if (!e.url) return;
    const o = i.target, u = (e.method || (e.body ? "POST" : "GET")).toUpperCase(), l = e.key;
    l && b.has(l) && (b.get(l).abort(), b.delete(l));
    const s = new AbortController(), d = e.signal;
    d && (d.aborted ? s.abort(d.reason) : d.addEventListener("abort", function() {
      s.abort(d.reason);
    }, { once: !0 })), l && b.set(l, s);
    const g = { method: u, signal: s.signal };
    e.body !== void 0 && (g.body = e.body), window.fetch(e.url, g).then(function(c) {
      l && b.get(l) === s && b.delete(l), w(o, "ln-http:response", {
        ok: c.ok,
        status: c.status,
        response: c
      });
    }).catch(function(c) {
      l && b.get(l) === s && b.delete(l), !(c && c.name === "AbortError") && w(o, "ln-http:error", {
        ok: !1,
        status: 0,
        error: c
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(i) {
      let e = !1;
      return a.forEach(function(o, u) {
        u.endsWith(" " + i) && (o.abort(), a.delete(u), e = !0);
      }), e;
    },
    cancelByKey: function(i) {
      return b.has(i) ? (b.get(i).abort(), b.delete(i), !0) : !1;
    },
    cancelAll: function() {
      a.forEach(function(i) {
        i.abort();
      }), a.clear(), b.forEach(function(i) {
        i.abort();
      }), b.clear();
    },
    get inflight() {
      const i = [];
      return a.forEach(function(e, o) {
        const u = o.indexOf(" ");
        i.push({ method: o.slice(0, u), url: o.slice(u + 1) });
      }), b.forEach(function(e, o) {
        i.push({ key: o });
      }), i;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", t), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", a = "lnAjax";
  if (window[a] !== void 0) return;
  function b(e) {
    if (!e.hasAttribute(h) || e[a]) return;
    e[a] = !0;
    const o = r(e);
    m(o.links), p(o.forms);
  }
  function m(e) {
    for (const o of e) {
      if (o[a + "Trigger"] || o.hostname && o.hostname !== window.location.hostname) continue;
      const u = o.getAttribute("href");
      if (u && u.includes("#")) continue;
      const l = function(s) {
        if (!Kt(s, o)) return;
        s.preventDefault();
        const d = o.getAttribute("href");
        d && n("GET", d, null, o);
      };
      o.addEventListener("click", l), o[a + "Trigger"] = l;
    }
  }
  function p(e) {
    for (const o of e) {
      if (o[a + "Trigger"]) continue;
      const u = function(l) {
        l.preventDefault();
        const s = o.method.toUpperCase(), d = o.action, g = new FormData(o);
        for (const c of o.querySelectorAll('button, input[type="submit"]'))
          c.disabled = !0;
        n(s, d, g, o, function() {
          for (const c of o.querySelectorAll('button, input[type="submit"]'))
            c.disabled = !1;
        });
      };
      o.addEventListener("submit", u), o[a + "Trigger"] = u;
    }
  }
  function f(e) {
    if (!e[a]) return;
    const o = r(e);
    for (const u of o.links)
      u[a + "Trigger"] && (u.removeEventListener("click", u[a + "Trigger"]), delete u[a + "Trigger"]);
    for (const u of o.forms)
      u[a + "Trigger"] && (u.removeEventListener("submit", u[a + "Trigger"]), delete u[a + "Trigger"]);
    delete e[a];
  }
  function n(e, o, u, l, s) {
    if (z(l, "ln-ajax:before-start", { method: e, url: o }).defaultPrevented) return;
    w(l, "ln-ajax:start", { method: e, url: o }), l.classList.add("ln-ajax--loading");
    const g = document.createElement("span");
    g.className = "ln-ajax-spinner", l.appendChild(g);
    function c() {
      l.classList.remove("ln-ajax--loading");
      const A = l.querySelector(".ln-ajax-spinner");
      A && A.remove(), s && s();
    }
    let _ = o;
    const v = document.querySelector('meta[name="csrf-token"]'), E = v ? v.getAttribute("content") : null;
    u instanceof FormData && E && u.append("_token", E);
    const S = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (S.headers["X-CSRF-TOKEN"] = E), e === "GET" && u) {
      const A = new URLSearchParams(u);
      _ = o + (o.includes("?") ? "&" : "?") + A.toString();
    } else e !== "GET" && u && (S.body = u);
    fetch(_, S).then(function(A) {
      const T = A.ok;
      return A.json().then(function(D) {
        return { ok: T, status: A.status, data: D };
      });
    }).then(function(A) {
      const T = A.data;
      if (A.ok) {
        if (T.title && (document.title = T.title), T.content)
          for (const D in T.content) {
            const x = document.getElementById(D);
            if (x) {
              let O = T.content[D];
              window.DOMPurify && typeof window.DOMPurify.sanitize == "function" ? O = window.DOMPurify.sanitize(O) : O = O.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""), x.innerHTML = O;
            }
          }
        if (l.tagName === "A") {
          const D = l.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else l.tagName === "FORM" && l.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
        w(l, "ln-ajax:success", { method: e, url: _, data: T });
      } else
        w(l, "ln-ajax:error", { method: e, url: _, status: A.status, data: T });
      if (T.message) {
        const D = T.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: D.type || (A.ok ? "success" : "error"),
            title: D.title || "",
            message: D.body || ""
          }
        }));
      }
      w(l, "ln-ajax:complete", { method: e, url: _ }), c();
    }).catch(function(A) {
      w(l, "ln-ajax:error", { method: e, url: _, error: A }), w(l, "ln-ajax:complete", { method: e, url: _ }), c();
    });
  }
  function r(e) {
    const o = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? o.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? o.forms.push(e) : (o.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), o.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), o;
  }
  function t() {
    G(function() {
      new MutationObserver(function(o) {
        for (const u of o)
          if (u.type === "childList") {
            for (const l of u.addedNodes)
              if (l.nodeType === 1 && (b(l), !l.hasAttribute(h))) {
                for (const d of l.querySelectorAll("[" + h + "]"))
                  b(d);
                const s = l.closest && l.closest("[" + h + "]");
                if (s && s.getAttribute(h) !== "false") {
                  const d = r(l);
                  m(d.links), p(d.forms);
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
  function i() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      b(e);
  }
  window[a] = b, window[a].destroy = f, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
const he = {
  navigate: function(h) {
    Ht(h, { historyAction: "push" });
  },
  replace: function(h) {
    Ht(h, { historyAction: "replace" });
  },
  current: function() {
    return xt ? {
      path: Ot,
      params: Jt,
      query: Qt,
      route: xt
    } : null;
  }
}, Rt = "data-ln-route", Xt = "lnRoute";
typeof window < "u" && (window.lnRouter = he);
const lt = /* @__PURE__ */ new Map();
let qt = [], Pt = !1, Ot = null, Jt = {}, Qt = {}, xt = null, It = !1;
function Zt(h, a, b) {
  It ? queueMicrotask(function() {
    w(h, a, b);
  }) : w(h, a, b);
}
function At(h) {
  let [a] = h.split("#"), [b, m] = a.split("?");
  const p = {};
  if (m) {
    const f = new URLSearchParams(m);
    for (const [n, r] of f.entries())
      p[n] = r;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: p };
}
function te(h, a) {
  if (h.pattern === "*") return 1;
  if (a.pattern === "*") return -1;
  const b = h.segments, m = a.segments, p = Math.max(b.length, m.length);
  for (let f = 0; f < p; f++) {
    const n = b[f], r = m[f];
    if (n === void 0) return 1;
    if (r === void 0) return -1;
    if (n === "*") return 1;
    if (r === "*") return -1;
    const t = n.startsWith(":"), i = r.startsWith(":");
    if (t && !i) return 1;
    if (!t && i) return -1;
  }
  return 0;
}
function wt(h) {
  const a = h.split("/").filter(Boolean);
  for (const b of qt) {
    if (b.pattern === "*")
      return {
        route: b,
        params: { wildcard: h }
      };
    const m = b.segments, p = {};
    let f = !0;
    if (!(a.length > m.length && m[m.length - 1] !== "*")) {
      for (let n = 0; n < m.length; n++) {
        const r = m[n], t = a[n];
        if (r === "*") {
          p.wildcard = a.slice(n).join("/");
          break;
        }
        if (t === void 0) {
          f = !1;
          break;
        }
        if (r.startsWith(":"))
          p[r.slice(1)] = decodeURIComponent(t);
        else if (r !== t) {
          f = !1;
          break;
        }
      }
      if (f && (m.indexOf("*") !== -1 || a.length <= m.length))
        return { route: b, params: p };
    }
  }
  return null;
}
function Mt(h) {
  if (h.target) {
    const b = document.getElementById(h.target);
    return b || console.warn(`[ln-router] Explicit target element #${h.target} not found in DOM`), b;
  }
  const a = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return a || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), a;
}
function fe(h) {
  if (!h) return;
  const a = Array.from(h.querySelectorAll("*")), b = [h].concat(a);
  for (const p of b)
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
function Lt(h, a, b, m, p = {}) {
  const f = Mt(h);
  if (!f || z(f, "ln-router:before-navigate", {
    from: Ot,
    to: m,
    params: a,
    query: b
  }).defaultPrevented)
    return;
  p.historyAction === "push" ? window.history.pushState(null, "", m) : p.historyAction === "replace" && window.history.replaceState(null, "", m);
  const i = () => {
    if (p.isHydration || fe(f), !p.isHydration) {
      const e = h.templateNode.content.cloneNode(!0);
      f.replaceChildren(e);
    }
    if (h.title && (document.title = h.title), !p.isHydration) {
      f.hasAttribute("tabindex") || f.setAttribute("tabindex", "-1");
      const e = f.querySelector("h1, h2, h3, h4, h5, h6");
      e ? (e.setAttribute("tabindex", "-1"), e.focus()) : f.focus(), f.scrollIntoView({ block: "start", behavior: "instant" });
    }
    Ot = m, Jt = a, Qt = b, xt = h, Zt(f, "ln-router:navigated", {
      path: m,
      params: a,
      query: b,
      route: h,
      target: f
    });
  };
  document.startViewTransition && !p.isHydration ? document.startViewTransition(i) : i();
}
function Ht(h, a = {}) {
  const { path: b, query: m } = At(h), p = wt(b);
  p ? Lt(p.route, p.params, m, h, a) : w(document.body, "ln-router:not-found", { path: b });
}
function pe(h) {
  const a = h.target.closest("a");
  if (!a || !Kt(h, a)) return;
  const b = a.getAttribute("href"), { path: m, query: p } = At(b), f = wt(m);
  f && (h.preventDefault(), Lt(f.route, f.params, p, b, { historyAction: "push" }));
}
function me() {
  const h = window.location.pathname + window.location.search, { path: a, query: b } = At(h), m = wt(a);
  m ? Lt(m.route, m.params, b, h, { historyAction: "skip" }) : w(document.body, "ln-router:not-found", { path: a });
}
function ge() {
  Pt || (Pt = !0, G(function() {
    document.addEventListener("click", pe), window.addEventListener("popstate", me), It = !0;
    const h = window.location.pathname + window.location.search, { path: a, query: b } = At(h), m = wt(a);
    if (m) {
      const p = Mt(m.route), f = p && p.hasAttribute("data-ln-router-hydrate") && p.children.length > 0;
      Lt(m.route, m.params, b, h, {
        historyAction: "replace",
        isHydration: f
      });
    } else
      Zt(document.body, "ln-router:not-found", { path: a });
    It = !1;
  }, "ln-router"));
}
function _e(h) {
  const a = h.getAttribute(Rt);
  if (!a) return;
  if (lt.has(a)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${a}"`);
    return;
  }
  const b = h.getAttribute("data-ln-route-target"), m = h.getAttribute("data-ln-route-title"), p = a.split("/").filter(Boolean), f = {
    pattern: a,
    segments: p,
    target: b,
    title: m,
    templateNode: h
  }, n = Mt(f);
  n && n.contains(h) && console.warn(`[ln-router] Route template with pattern "${a}" is declared inside its own outlet element:`, h), lt.set(a, f), qt = Array.from(lt.values()).sort(te), ge();
}
function be(h) {
  const a = h.getAttribute(Rt);
  a && lt.has(a) && (lt.delete(a), qt = Array.from(lt.values()).sort(te));
}
function ee(h) {
  return this.dom = h, _e(h), this;
}
ee.prototype.destroy = function() {
  be(this.dom), delete this.dom[Xt];
};
F(Rt, Xt, ee, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"]
});
(function() {
  const h = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function b(p) {
    this.dom = p, this.isOpen = p.getAttribute(h) === "open";
    const f = this;
    return this._onEscape = function(n) {
      n.key === "Escape" && f.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(n) {
      if (n.key !== "Tab") return;
      const r = Array.prototype.filter.call(
        f.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        gt
      );
      if (r.length === 0) return;
      const t = r[0], i = r[r.length - 1];
      n.shiftKey ? document.activeElement === t && (n.preventDefault(), i.focus()) : document.activeElement === i && (n.preventDefault(), t.focus());
    }, this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  b.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.isOpen) {
        this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null;
        const p = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + h + '="open"]'),
          function(n) {
            return n !== p;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      w(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
    }
  };
  function m(p) {
    const f = p[a];
    if (!f) return;
    const r = p.getAttribute(h) === "open";
    if (r !== f.isOpen)
      if (r) {
        if (z(p, "ln-modal:before-open", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(h, "close");
          return;
        }
        f.isOpen = !0, p.setAttribute("aria-modal", "true"), p.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", f._onEscape), document.addEventListener("keydown", f._onFocusTrap);
        const i = document.activeElement;
        f._returnFocusEl = i && i !== document.body ? i : null;
        const e = p.querySelector("[autofocus]");
        if (e && gt(e))
          e.focus();
        else {
          const o = p.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(o, gt);
          if (u) u.focus();
          else {
            const l = p.querySelectorAll("a[href], button:not([disabled])"), s = Array.prototype.find.call(l, gt);
            s && s.focus();
          }
        }
        w(p, "ln-modal:open", { modalId: p.id, target: p });
      } else {
        if (z(p, "ln-modal:before-close", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(h, "open");
          return;
        }
        f.isOpen = !1, p.removeAttribute("aria-modal"), document.removeEventListener("keydown", f._onEscape), document.removeEventListener("keydown", f._onFocusTrap), w(p, "ln-modal:close", { modalId: p.id, target: p }), f._returnFocusEl && document.contains(f._returnFocusEl) && typeof f._returnFocusEl.focus == "function" && f._returnFocusEl.focus(), f._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const f = p.target.closest("[data-ln-modal-for]");
    if (f) {
      const r = f.getAttribute("data-ln-modal-for"), t = document.getElementById(r);
      if (t && t[a]) {
        p.preventDefault();
        const i = t.getAttribute(h);
        t.setAttribute(h, i === "open" ? "close" : "open");
      }
      return;
    }
    const n = p.target.closest("[data-ln-modal-close]");
    if (n) {
      const r = n.closest("[" + h + "]");
      r && r[a] && (p.preventDefault(), r.setAttribute(h, "close"));
    }
  }), F(h, a, b, "ln-modal", {
    onAttributeChange: m
  });
})();
(function() {
  const h = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const b = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(t) {
    if (!b[t]) {
      const i = new Intl.NumberFormat(t, { useGrouping: !0 }), e = i.formatToParts(1234.5);
      let o = "", u = ".";
      for (let l = 0; l < e.length; l++)
        e[l].type === "group" && (o = e[l].value), e[l].type === "decimal" && (u = e[l].value);
      b[t] = { fmt: i, groupSep: o, decimalSep: u };
    }
    return b[t];
  }
  function f(t, i, e) {
    if (e !== null) {
      const o = parseInt(e, 10), u = t + "|d" + o;
      return b[u] || (b[u] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: o })), b[u].format(i);
    }
    return p(t).fmt.format(i);
  }
  function n(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[a]) return t[a];
    t[a] = this, this.dom = t;
    const i = document.createElement("input");
    i.type = "hidden", i.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", i), this._hidden = i;
    const e = this;
    Object.defineProperty(i, "value", {
      get: function() {
        return m.get.call(i);
      },
      set: function(u) {
        if (m.set.call(i, u), u !== "" && !isNaN(parseFloat(u))) {
          const l = parseFloat(u);
          e._displayFormatted(l), w(e.dom, "ln-number:input", { value: l, formatted: e.dom.value }), e.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        } else u === "" && (e.dom.value = "", w(e.dom, "ln-number:input", { value: NaN, formatted: "" }), e.dom.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
    }), Vt(t, m, {
      get: function() {
        return m.get.call(t);
      },
      set: function(u, l) {
        if (e._isFormatting) {
          l(u);
          return;
        }
        if (u === "") {
          l(""), e._setHiddenRaw(""), w(t, "ln-number:input", { value: NaN, formatted: "" }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        let s = typeof u == "number" ? u : parseFloat(String(u).replace(/[^\d.-]/g, ""));
        if (isNaN(s))
          l(String(u)), e._setHiddenRaw(""), w(t, "ln-number:input", { value: NaN, formatted: String(u) }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        else {
          e._setHiddenRaw(s);
          const d = f(J(t), s, t.getAttribute("data-ln-number-decimals"));
          l(d), w(t, "ln-number:input", { value: s, formatted: d }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(u) {
      u.preventDefault();
      const l = (u.clipboardData || window.clipboardData).getData("text"), s = p(J(t)), d = s.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let g = l.replace(new RegExp("[^0-9\\-" + d + ".]", "g"), "");
      s.groupSep && (g = g.split(s.groupSep).join("")), s.decimalSep !== "." && (g = g.replace(s.decimalSep, "."));
      const c = parseFloat(g);
      isNaN(c) ? (t.value = "", e._hidden.value = "") : e.value = c;
    }, t.addEventListener("paste", this._onPaste);
    const o = t.value;
    if (o !== "") {
      const u = parseFloat(o);
      isNaN(u) || (this._displayFormatted(u), m.set.call(i, String(u)), w(t, "ln-number:input", { value: u, formatted: t.value }), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  n.prototype._handleInput = function() {
    const t = this.dom, i = p(J(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", w(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const o = t.selectionStart;
    let u = 0;
    for (let A = 0; A < o; A++)
      /[0-9]/.test(e[A]) && u++;
    let l = e;
    if (i.groupSep && (l = l.split(i.groupSep).join("")), l = l.replace(i.decimalSep, "."), e.endsWith(i.decimalSep) || e.endsWith(".")) {
      const A = l.replace(/\.$/, ""), T = parseFloat(A);
      isNaN(T) || this._setHiddenRaw(T);
      return;
    }
    const s = l.indexOf(".");
    if (s !== -1 && l.slice(s + 1).endsWith("0")) {
      const T = parseFloat(l);
      isNaN(T) || this._setHiddenRaw(T);
      return;
    }
    const d = t.getAttribute("data-ln-number-decimals");
    if (d !== null && s !== -1) {
      const A = parseInt(d, 10);
      l.slice(s + 1).length > A && (l = l.slice(0, s + 1 + A));
    }
    const g = parseFloat(l);
    if (isNaN(g)) return;
    const c = t.getAttribute("data-ln-number-min"), _ = t.getAttribute("data-ln-number-max");
    if (c !== null && g < parseFloat(c) || _ !== null && g > parseFloat(_)) return;
    let v;
    if (d !== null)
      v = f(J(t), g, d);
    else {
      const A = s !== -1 ? l.slice(s + 1).length : 0;
      if (A > 0) {
        const T = J(t) + "|u" + A;
        b[T] || (b[T] = new Intl.NumberFormat(J(t), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = b[T].format(g);
      } else
        v = i.fmt.format(g);
    }
    t.value = v;
    let E = u, S = 0;
    for (let A = 0; A < v.length && E > 0; A++)
      S = A + 1, /[0-9]/.test(v[A]) && E--;
    E > 0 && (S = v.length), t.setSelectionRange(S, S), this._setHiddenRaw(g), w(t, "ln-number:input", { value: g, formatted: v });
  }, n.prototype._setHiddenRaw = function(t) {
    m.set.call(this._hidden, String(t));
  }, n.prototype._displayFormatted = function(t) {
    this._isFormatting = !0, this.dom.value = f(J(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")), this._isFormatting = !1;
  }, Object.defineProperty(n.prototype, "value", {
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
  }), Object.defineProperty(n.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), n.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), w(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function r() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let i = 0; i < t.length; i++) {
        const e = t[i][a];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  F(h, a, n, "ln-number"), r();
})();
(function() {
  const h = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const b = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(s, d) {
    const g = s + "|" + JSON.stringify(d);
    return b[g] || (b[g] = new Intl.DateTimeFormat(s, d)), b[g];
  }
  const f = /^(short|medium|long)(\s+datetime)?$/, n = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function r(s) {
    return !s || s === "" ? { dateStyle: "medium" } : s.match(f) ? n[s] : null;
  }
  function t(s, d, g) {
    const c = s.getDate(), _ = s.getMonth(), v = s.getFullYear(), E = s.getHours(), S = s.getMinutes();
    let A, T;
    if (g.startsWith("mk") && !p(g, { month: "long" }).resolvedOptions().locale.startsWith("mk")) {
      const I = [
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
      ], B = [
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
      A = I[_], T = B[_];
    }
    A === void 0 && (A = p(g, { month: "long" }).format(s)), T === void 0 && (T = p(g, { month: "short" }).format(s));
    const D = {
      yyyy: String(v),
      yy: String(v).slice(-2),
      MMMM: A,
      MMM: T,
      MM: String(_ + 1).padStart(2, "0"),
      M: String(_ + 1),
      dd: String(c).padStart(2, "0"),
      d: String(c),
      HH: String(E).padStart(2, "0"),
      mm: String(S).padStart(2, "0")
    };
    return d.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(x) {
      return D[x];
    });
  }
  function i(s, d, g) {
    const c = r(d);
    if (c) {
      const _ = p(g, c), v = _.resolvedOptions().locale;
      return g.startsWith("mk") && !v.startsWith("mk") ? t(s, "dd.MM.yyyy", g) : _.format(s);
    }
    return t(s, d, g);
  }
  function e(s) {
    if (s.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", s.tagName), this;
    if (s[a]) return s[a];
    s[a] = this, this.dom = s;
    const d = this, g = s.value, c = s.name, _ = document.createElement("span");
    _.setAttribute("data-ln-date-field", ""), s.parentNode.insertBefore(_, s), _.appendChild(s), this._wrapper = _;
    const v = document.createElement("input");
    v.type = "hidden", v.name = c, s.removeAttribute("name"), s.insertAdjacentElement("afterend", v), this._hidden = v;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", v.insertAdjacentElement("afterend", E), this._picker = E, s.type = "text";
    const S = document.createElement("button");
    if (S.type = "button", S.setAttribute("aria-label", "Open date picker"), S.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', E.insertAdjacentElement("afterend", S), this._btn = S, this._lastISO = "", Object.defineProperty(v, "value", {
      get: function() {
        return m.get.call(v);
      },
      set: function(A) {
        if (m.set.call(v, A), A && A !== "") {
          const T = o(A);
          T && (d._displayFormatted(T), m.set.call(E, A), d._lastISO = A, w(d.dom, "ln-date:change", {
            value: A,
            formatted: d.dom.value,
            date: T
          }), d.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else A === "" && (d.dom.value = "", m.set.call(E, ""), d._lastISO = "", w(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), d.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), Vt(s, m, {
      get: function() {
        return m.get.call(s);
      },
      set: function(A, T) {
        if (d._isFormatting) {
          T(A);
          return;
        }
        if (!A || A === "") {
          T(""), d._setHiddenRaw(""), m.set.call(d._picker, ""), d._lastISO = "", w(s, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let D = o(A);
        if (D || (D = u(A)), D) {
          const x = D.getFullYear(), O = String(D.getMonth() + 1).padStart(2, "0"), I = String(D.getDate()).padStart(2, "0"), B = x + "-" + O + "-" + I;
          d._setHiddenRaw(B), m.set.call(d._picker, B), d._lastISO = B;
          const j = s.getAttribute(h) || "", Q = J(s), Z = i(D, j, Q);
          T(Z), w(s, "ln-date:change", {
            value: B,
            formatted: Z,
            date: D
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          T(String(A)), d._setHiddenRaw(""), m.set.call(d._picker, ""), d._lastISO = "", w(s, "ln-date:change", {
            value: "",
            formatted: String(A),
            date: null
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const A = E.value;
      if (A) {
        const T = o(A);
        T && (d._setHiddenRaw(A), d._displayFormatted(T), d._lastISO = A, w(d.dom, "ln-date:change", {
          value: A,
          formatted: d.dom.value,
          date: T
        }));
      } else
        d._setHiddenRaw(""), d.dom.value = "", d._lastISO = "", w(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const A = d.dom.value.trim();
      if (A === "") {
        d._lastISO !== "" && (d._setHiddenRaw(""), m.set.call(d._picker, ""), d.dom.value = "", d._lastISO = "", w(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (d._lastISO) {
        const D = o(d._lastISO);
        if (D) {
          const x = d.dom.getAttribute(h) || "", O = J(d.dom), I = i(D, x, O);
          if (A === I) return;
        }
      }
      const T = u(A);
      if (T) {
        const D = T.getFullYear(), x = String(T.getMonth() + 1).padStart(2, "0"), O = String(T.getDate()).padStart(2, "0"), I = D + "-" + x + "-" + O;
        d._setHiddenRaw(I), m.set.call(d._picker, I), d._displayFormatted(T), d._lastISO = I, w(d.dom, "ln-date:change", {
          value: I,
          formatted: d.dom.value,
          date: T
        });
      } else if (d._lastISO) {
        const D = o(d._lastISO);
        D && d._displayFormatted(D);
      } else
        d.dom.value = "";
    }, s.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, S.addEventListener("click", this._onBtnClick), g && g !== "") {
      const A = o(g);
      A && (this._setHiddenRaw(g), m.set.call(E, g), this._displayFormatted(A), this._lastISO = g, w(s, "ln-date:change", {
        value: g,
        formatted: s.value,
        date: A
      }), s.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function o(s) {
    if (!s || typeof s != "string") return null;
    const d = s.split("T"), g = d[0].split("-");
    if (g.length < 3) return null;
    const c = parseInt(g[0], 10), _ = parseInt(g[1], 10) - 1, v = parseInt(g[2], 10);
    if (isNaN(c) || isNaN(_) || isNaN(v)) return null;
    let E = 0, S = 0;
    if (d[1]) {
      const T = d[1].split(":");
      E = parseInt(T[0], 10) || 0, S = parseInt(T[1], 10) || 0;
    }
    const A = new Date(c, _, v, E, S);
    return A.getFullYear() !== c || A.getMonth() !== _ || A.getDate() !== v ? null : A;
  }
  function u(s) {
    if (!s || typeof s != "string" || (s = s.trim(), s.length < 6)) return null;
    let d, g;
    if (s.indexOf(".") !== -1)
      d = ".", g = s.split(".");
    else if (s.indexOf("/") !== -1)
      d = "/", g = s.split("/");
    else if (s.indexOf("-") !== -1)
      d = "-", g = s.split("-");
    else
      return null;
    if (g.length !== 3) return null;
    const c = [];
    for (let A = 0; A < 3; A++) {
      const T = parseInt(g[A], 10);
      if (isNaN(T)) return null;
      c.push(T);
    }
    let _, v, E;
    d === "." ? (_ = c[0], v = c[1], E = c[2]) : d === "/" ? (v = c[0], _ = c[1], E = c[2]) : g[0].length === 4 ? (E = c[0], v = c[1], _ = c[2]) : (_ = c[0], v = c[1], E = c[2]), E < 100 && (E += E < 50 ? 2e3 : 1900);
    const S = new Date(E, v - 1, _);
    return S.getFullYear() !== E || S.getMonth() !== v - 1 || S.getDate() !== _ ? null : S;
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
  }, e.prototype._setHiddenRaw = function(s) {
    m.set.call(this._hidden, s);
  }, e.prototype._displayFormatted = function(s) {
    const d = this.dom.getAttribute(h) || "", g = J(this.dom);
    console.log("[ln-date] _displayFormatted:", {
      date: s,
      format: d,
      locale: g,
      dom: this.dom,
      closestLang: this.dom.closest("[lang]"),
      htmlLang: document.documentElement ? document.documentElement.lang : null,
      formatted: i(s, d, g)
    }), this._isFormatting = !0, this.dom.value = i(s, d, g), this._isFormatting = !1;
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return m.get.call(this._hidden);
    },
    set: function(s) {
      if (!s || s === "") {
        this._setHiddenRaw(""), m.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const d = o(s);
      d && (this._setHiddenRaw(s), m.set.call(this._picker, s), this._displayFormatted(d), this._lastISO = s, w(this.dom, "ln-date:change", {
        value: s,
        formatted: this.dom.value,
        date: d
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const s = this.value;
      return s ? o(s) : null;
    },
    set: function(s) {
      if (!s || !(s instanceof Date) || isNaN(s.getTime())) {
        this.value = "";
        return;
      }
      const d = s.getFullYear(), g = String(s.getMonth() + 1).padStart(2, "0"), c = String(s.getDate()).padStart(2, "0");
      this.value = d + "-" + g + "-" + c;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const s = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), s && (this.dom.value = s), w(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function l() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + h + "]");
      for (let d = 0; d < s.length; d++) {
        const g = s[d][a];
        if (g && g.value) {
          const c = o(g.value);
          c && g._displayFormatted(c);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  F(h, a, e, "ln-date"), l();
})();
(function() {
  const h = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const b = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const o of m)
        o();
    }, history._lnNavPatched = !0;
  }
  function p(e) {
    if (!e.hasAttribute(h) || b.has(e)) return;
    const o = e.getAttribute(h);
    if (!o) return;
    const u = f(e, o);
    b.set(e, u), e[a] = u;
  }
  function f(e, o) {
    const u = e.hasAttribute("data-ln-nav-exact");
    let l = Array.from(e.querySelectorAll("a"));
    r(l, o, window.location.pathname, u);
    const s = function() {
      l = Array.from(e.querySelectorAll("a")), r(l, o, window.location.pathname, u);
    };
    window.addEventListener("popstate", s), m.push(s);
    const d = new MutationObserver(function(g) {
      for (const c of g)
        if (c.type === "childList") {
          for (const _ of c.addedNodes)
            if (_.nodeType === 1) {
              if (_.tagName === "A")
                l.push(_), r([_], o, window.location.pathname, u);
              else if (_.querySelectorAll) {
                const v = Array.from(_.querySelectorAll("a"));
                l = l.concat(v), r(v, o, window.location.pathname, u);
              }
            }
          for (const _ of c.removedNodes)
            if (_.nodeType === 1) {
              if (_.tagName === "A")
                l = l.filter(function(v) {
                  return v !== _;
                });
              else if (_.querySelectorAll) {
                const v = Array.from(_.querySelectorAll("a"));
                l = l.filter(function(E) {
                  return !v.includes(E);
                });
              }
            }
        }
    });
    return d.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: o,
      observer: d,
      updateHandler: s,
      destroy: function() {
        d.disconnect(), window.removeEventListener("popstate", s);
        const g = m.indexOf(s);
        g !== -1 && m.splice(g, 1), b.delete(e), delete e[a];
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
  function r(e, o, u, l) {
    const s = n(u);
    for (const d of e) {
      const g = d.getAttribute("href");
      if (!g) continue;
      const c = n(g);
      d.classList.remove(o);
      const _ = c === s, v = !l && c !== "/" && s.startsWith(c + "/");
      _ || v ? (d.classList.add(o), d.setAttribute("aria-current", "page")) : d.removeAttribute("aria-current");
    }
  }
  function t() {
    G(function() {
      new MutationObserver(function(o) {
        for (const u of o)
          if (u.type === "childList") {
            for (const l of u.addedNodes)
              if (l.nodeType === 1 && (l.hasAttribute && l.hasAttribute(h) && p(l), l.querySelectorAll))
                for (const s of l.querySelectorAll("[" + h + "]"))
                  p(s);
          } else u.type === "attributes" && u.target.hasAttribute && u.target.hasAttribute(h) && p(u.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[a] = p;
  function i() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      p(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function b() {
    const n = (location.hash || "").replace("#", ""), r = {};
    if (!n) return r;
    for (const t of n.split("&")) {
      const i = t.indexOf(":");
      i > 0 && (r[t.slice(0, i)] = t.slice(i + 1));
    }
    return r;
  }
  function m(n, r) {
    const t = (n.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (t) return t;
    if (n.tagName !== "A") return "";
    const i = n.getAttribute("href") || "";
    if (!i.startsWith("#")) return "";
    const e = i.slice(1);
    if (!e) return "";
    const o = e.split("&");
    if (r)
      for (const s of o) {
        const d = s.indexOf(":");
        if (d > 0 && s.slice(0, d).toLowerCase().trim() === r)
          return s.slice(d + 1).toLowerCase().trim();
      }
    const u = o[o.length - 1] || "", l = u.indexOf(":");
    return (l > 0 ? u.slice(l + 1) : u).toLowerCase().trim();
  }
  function p(n) {
    return this.dom = n, f.call(this), this;
  }
  function f() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const r of this.tabs) {
      const t = m(r, this.nsKey);
      t ? this.mapTabs[t] = r : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', r);
    }
    for (const r of this.panels) {
      const t = (r.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      t && (this.mapPanels[t] = r);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const n = this;
    this._clickHandlers = [];
    for (const r of this.tabs) {
      if (r[a + "Trigger"]) continue;
      const t = function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1) return;
        const e = m(r, n.nsKey);
        if (e)
          if (r.tagName === "A" && i.preventDefault(), n.hashEnabled) {
            const o = b();
            o[n.nsKey] = e;
            const u = Object.keys(o).map(function(l) {
              return l + ":" + o[l];
            }).join("&");
            location.hash === "#" + u ? n.dom.setAttribute("data-ln-tabs-active", e) : location.hash = u;
          } else
            n.dom.setAttribute("data-ln-tabs-active", e);
      };
      r.addEventListener("click", t), r[a + "Trigger"] = t, n._clickHandlers.push({ el: r, handler: t });
    }
    if (this._hashHandler = function() {
      if (!n.hashEnabled) return;
      const r = b();
      n.dom.setAttribute("data-ln-tabs-active", n.nsKey in r ? r[n.nsKey] : n.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let r = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const t = St("tabs", this.dom);
        t !== null && t in this.mapPanels && (r = t);
      }
      this.dom.setAttribute("data-ln-tabs-active", r);
    }
  }
  p.prototype._applyActive = function(n) {
    var r;
    (!n || !(n in this.mapPanels)) && (n = this.defaultKey);
    for (const t in this.mapTabs) {
      const i = this.mapTabs[t];
      t === n ? (i.setAttribute("data-active", ""), i.setAttribute("aria-selected", "true")) : (i.removeAttribute("data-active"), i.setAttribute("aria-selected", "false"));
    }
    for (const t in this.mapPanels) {
      const i = this.mapPanels[t], e = t === n;
      i.classList.toggle("hidden", !e), i.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const t = (r = this.mapPanels[n]) == null ? void 0 : r.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    w(this.dom, "ln-tabs:change", { key: n, tab: this.mapTabs[n], panel: this.mapPanels[n] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && st("tabs", this.dom, n);
  }, p.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const { el: n, handler: r } of this._clickHandlers)
        n.removeEventListener("click", r), delete n[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), w(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, F(h, a, p, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(n) {
      const r = n.getAttribute("data-ln-tabs-active");
      n[a]._applyActive(r);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function b(f, n) {
    const r = document.querySelectorAll(
      '[data-ln-toggle-for="' + f.id + '"]'
    );
    for (const t of r)
      t.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function m(f) {
    if (this.dom = f, f.hasAttribute("data-ln-persist")) {
      const n = St("toggle", f);
      n !== null && f.setAttribute(h, n);
    }
    return this.isOpen = f.getAttribute(h) === "open", this.isOpen && f.classList.add("open"), b(f, this.isOpen), this;
  }
  m.prototype.destroy = function() {
    this.dom[a] && (w(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function p(f) {
    const n = f[a];
    if (!n) return;
    const t = f.getAttribute(h) === "open";
    if (t !== n.isOpen)
      if (t) {
        if (z(f, "ln-toggle:before-open", { target: f }).defaultPrevented) {
          f.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, f.classList.add("open"), b(f, !0), w(f, "ln-toggle:open", { target: f }), f.hasAttribute("data-ln-persist") && st("toggle", f, "open");
      } else {
        if (z(f, "ln-toggle:before-close", { target: f }).defaultPrevented) {
          f.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, f.classList.remove("open"), b(f, !1), w(f, "ln-toggle:close", { target: f }), f.hasAttribute("data-ln-persist") && st("toggle", f, "close");
      }
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const n = f.target.closest("[data-ln-toggle-for]");
    if (n) {
      const r = n.getAttribute("data-ln-toggle-for"), t = document.getElementById(r);
      if (t && t[a]) {
        f.preventDefault();
        const i = n.getAttribute("data-ln-toggle-action") || "toggle";
        if (i === "open")
          t.setAttribute(h, "open");
        else if (i === "close")
          t.setAttribute(h, "close");
        else if (i === "toggle") {
          const e = t.getAttribute(h);
          t.setAttribute(h, e === "open" ? "close" : "open");
        }
      }
    }
  }), F(h, a, m, "ln-toggle", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function b(m) {
    return this.dom = m, this._onToggleOpen = function(p) {
      if (p.detail.target.closest("[data-ln-accordion]") !== m) return;
      const f = m.querySelectorAll("[data-ln-toggle]");
      for (const n of f)
        n !== p.detail.target && n.closest("[data-ln-accordion]") === m && n.getAttribute("data-ln-toggle") === "open" && n.setAttribute("data-ln-toggle", "close");
      w(m, "ln-accordion:change", { target: p.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), w(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, F(h, a, b, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function b(m) {
    if (this.dom = m, this.toggleEl = m.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = m.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const f of this.toggleEl.children)
        f.setAttribute("role", "menuitem");
    const p = this;
    return this._onToggleOpen = function(f) {
      f.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "true"), p._teleportRestore = Yt(p.toggleEl), p.toggleEl.style.position = "fixed", p.toggleEl.style.right = "auto", p._reposition(), p._addOutsideClickListener(), p._addScrollRepositionListener(), p._addResizeCloseListener(), w(m, "ln-dropdown:open", { target: f.detail.target }));
    }, this._onToggleClose = function(f) {
      f.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "false"), p._removeOutsideClickListener(), p._removeScrollRepositionListener(), p._removeResizeCloseListener(), p.toggleEl.style.position = "", p.toggleEl.style.top = "", p.toggleEl.style.left = "", p.toggleEl.style.right = "", p.toggleEl.style.transform = "", p.toggleEl.style.margin = "", p._teleportRestore && (p._teleportRestore(), p._teleportRestore = null), w(m, "ln-dropdown:close", { target: f.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  b.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const m = this.triggerBtn.getBoundingClientRect(), p = Dt(this.toggleEl), f = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = Et(m, p, "bottom-end", f);
    this.toggleEl.style.top = n.top + "px", this.toggleEl.style.left = n.left + "px";
  }, b.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const m = this;
    this._boundDocClick = function(p) {
      m.dom.contains(p.target) || m.toggleEl && m.toggleEl.contains(p.target) || m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, m._docClickTimeout = setTimeout(function() {
      m._docClickTimeout = null, document.addEventListener("click", m._boundDocClick);
    }, 0);
  }, b.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, b.prototype._addScrollRepositionListener = function() {
    const m = this;
    this._boundScrollReposition = function() {
      m._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, b.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, b.prototype._addResizeCloseListener = function() {
    const m = this;
    this._boundResizeClose = function() {
      m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, b.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, b.prototype.destroy = function() {
    this.dom[a] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), w(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, F(h, a, b, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", a = "lnPopover", b = "data-ln-popover-for", m = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const p = [];
  let f = null;
  function n() {
    f || (f = function(e) {
      if (e.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", f));
  }
  function r() {
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
    this.isOpen = !0, e && (this.trigger = e), this._previousFocus = document.activeElement, this._teleportRestore = Yt(this.dom);
    const o = Dt(this.dom);
    if (this.trigger) {
      const d = this.trigger.getBoundingClientRect(), g = this.dom.getAttribute(m) || "bottom", c = Et(d, o, g, 8);
      this.dom.style.top = c.top + "px", this.dom.style.left = c.left + "px", this.dom.setAttribute("data-ln-popover-placement", c.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const u = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), l = Array.prototype.find.call(u, gt);
    l ? l.focus() : this.dom.focus();
    const s = this;
    this._boundDocClick = function(d) {
      s.dom.contains(d.target) || s.trigger && s.trigger.contains(d.target) || s.close();
    }, s._docClickTimeout = setTimeout(function() {
      s._docClickTimeout = null, document.addEventListener("click", s._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!s.trigger) return;
      const d = s.trigger.getBoundingClientRect(), g = Dt(s.dom), c = s.dom.getAttribute(m) || "bottom", _ = Et(d, g, c, 8);
      s.dom.style.top = _.top + "px", s.dom.style.left = _.left + "px", s.dom.setAttribute("data-ln-popover-placement", _.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), n(), w(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const e = p.indexOf(this);
    e !== -1 && p.splice(e, 1), r(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, w(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[a] && (this.isOpen && this._applyClose(), delete this.dom[a], w(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function i(e) {
    this.dom = e;
    const o = e.getAttribute(b);
    return e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-controls", o), this._onClick = function(u) {
      if (u.ctrlKey || u.metaKey || u.button === 1) return;
      u.preventDefault();
      const l = document.getElementById(o);
      !l || !l[a] || l[a].toggle(e);
    }, e.addEventListener("click", this._onClick), this;
  }
  i.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, F(h, a, t, "ln-popover", {
    onAttributeChange: function(e) {
      const o = e[a];
      if (!o) return;
      const l = e.getAttribute(h) === "open";
      if (l !== o.isOpen)
        if (l) {
          if (z(e, "ln-popover:before-open", {
            popoverId: e.id,
            target: e,
            trigger: o.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "closed");
            return;
          }
          o._applyOpen(o.trigger);
        } else {
          if (z(e, "ln-popover:before-close", {
            popoverId: e.id,
            target: e,
            trigger: o.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "open");
            return;
          }
          o._applyClose();
        }
    }
  }), F(b, a + "Trigger", i, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", a = "data-ln-tooltip", b = "data-ln-tooltip-position", m = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[m] !== void 0) return;
  let f = 0, n = null, r = null, t = null, i = null, e = null;
  function o() {
    return n && n.parentNode || (n = document.getElementById(p), n || (n = document.createElement("div"), n.id = p, document.body.appendChild(n))), n;
  }
  function u() {
    e || (e = function(c) {
      c.key === "Escape" && d();
    }, document.addEventListener("keydown", e));
  }
  function l() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function s(c) {
    if (t === c) return;
    d();
    const _ = c.getAttribute(a) || c.getAttribute("title");
    if (!_) return;
    o(), c.hasAttribute("title") && (i = c.getAttribute("title"), c.removeAttribute("title"));
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = _, c[m + "Uid"] || (f += 1, c[m + "Uid"] = "ln-tooltip-" + f), v.id = c[m + "Uid"], n.appendChild(v);
    const E = v.offsetWidth, S = v.offsetHeight, A = c.getBoundingClientRect(), T = c.getAttribute(b) || "top", D = Et(A, { width: E, height: S }, T, 6);
    v.style.top = D.top + "px", v.style.left = D.left + "px", v.setAttribute("data-ln-tooltip-placement", D.placement), c.setAttribute("aria-describedby", v.id), r = v, t = c, u();
  }
  function d() {
    if (!r) {
      l();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), i !== null && t.setAttribute("title", i)), i = null, r.parentNode && r.parentNode.removeChild(r), r = null, t = null, l();
  }
  function g(c) {
    return this.dom = c, c.hasAttribute("data-ln-tooltip-enhanced") || (c.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      s(c);
    }, this._onLeave = function() {
      t === c && d();
    }, this._onFocus = function() {
      s(c);
    }, this._onBlur = function() {
      t === c && d();
    }, c.addEventListener("mouseenter", this._onEnter), c.addEventListener("mouseleave", this._onLeave), c.addEventListener("focus", this._onFocus, !0), c.addEventListener("blur", this._onBlur, !0), this;
  }
  g.prototype.destroy = function() {
    const c = this.dom;
    c.removeEventListener("mouseenter", this._onEnter), c.removeEventListener("mouseleave", this._onLeave), c.removeEventListener("focus", this._onFocus, !0), c.removeEventListener("blur", this._onBlur, !0), t === c && d(), this._addedEnhancedAttr && c.removeAttribute("data-ln-tooltip-enhanced"), delete c[m], delete c[m + "Uid"], w(c, "ln-tooltip:destroyed", { trigger: c });
  }, F(
    "[" + h + "], [" + a + "][title]",
    m,
    g,
    "ln-tooltip"
  );
})();
const ve = `<li class="ln-toast__item">\r
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
  const h = "data-ln-toast", a = "lnToast", b = "ln-toast-item", m = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, p = { success: "success", error: "error", warn: "warning", info: "info" }, f = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function n() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const c = document.createElement("template");
    c.setAttribute("data-ln-template", "ln-toast-item"), c.innerHTML = ve, document.body.appendChild(c);
  }
  function r(c) {
    if (!c || c.nodeType !== 1) return;
    const _ = Array.from(c.querySelectorAll("[" + h + "]"));
    c.hasAttribute && c.hasAttribute(h) && _.push(c);
    for (const v of _)
      v[a] || new t(v);
  }
  function t(c) {
    this.dom = c, c[a] = this, this.timeoutDefault = parseInt(c.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(c.getAttribute("data-ln-toast-max") || "5", 10);
    for (const _ of Array.from(c.querySelectorAll("[data-ln-toast-item]")))
      s(_, c);
    return this;
  }
  t.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const c of Array.from(this.dom.children))
        u(c);
      delete this.dom[a];
    }
  };
  function i(c, _) {
    const v = ((c.type || "info") + "").toLowerCase(), E = at(_, b, "ln-toast");
    if (!E)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    const S = E.firstElementChild;
    if (!S) return null;
    const A = !!(c.message || c.data && c.data.errors);
    X(S, {
      title: c.title || f[v] || f.info,
      role: v === "error" ? "alert" : "status",
      ariaLive: v === "error" ? "assertive" : "polite",
      hasBody: A
    });
    const T = S.querySelector(".ln-toast__card");
    T && T.classList.add(p[v] || "info");
    const D = S.querySelector(".ln-toast__side");
    if (D) {
      const I = D.querySelector("use");
      I && I.setAttribute("href", "#ln-" + (m[v] || m.info));
    }
    const x = S.querySelector(".ln-toast__body");
    x && A && e(x, c);
    const O = S.querySelector(".ln-toast__close");
    return O && O.addEventListener("click", function() {
      u(S);
    }), S;
  }
  function e(c, _) {
    if (_.message)
      if (Array.isArray(_.message)) {
        const v = document.createElement("ul");
        for (const E of _.message) {
          const S = document.createElement("li");
          S.textContent = E, v.appendChild(S);
        }
        c.appendChild(v);
      } else {
        const v = document.createElement("p");
        v.textContent = _.message, c.appendChild(v);
      }
    if (_.data && _.data.errors) {
      const v = document.createElement("ul");
      for (const E of Object.values(_.data.errors).flat()) {
        const S = document.createElement("li");
        S.textContent = E, v.appendChild(S);
      }
      c.appendChild(v);
    }
  }
  function o(c, _) {
    for (; c.dom.children.length >= c.max; ) c.dom.removeChild(c.dom.firstElementChild);
    c.dom.appendChild(_), requestAnimationFrame(() => _.classList.add("ln-toast__item--in"));
  }
  function u(c) {
    !c || !c.parentNode || (clearTimeout(c._timer), c.classList.remove("ln-toast__item--in"), c.classList.add("ln-toast__item--out"), setTimeout(() => {
      c.parentNode && c.parentNode.removeChild(c);
    }, 200));
  }
  function l(c) {
    let _ = c && c.container;
    return typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), _ || null;
  }
  function s(c, _) {
    const v = ((c.getAttribute("data-type") || "info") + "").toLowerCase(), E = c.getAttribute("data-title"), S = (c.innerText || c.textContent || "").trim(), A = i({
      type: v,
      title: E,
      message: S || void 0
    }, _);
    A && (c.parentNode && c.parentNode.replaceChild(A, c), requestAnimationFrame(() => A.classList.add("ln-toast__item--in")));
  }
  function d(c) {
    const _ = c.detail || {}, v = l(_);
    if (!v) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const E = v[a] || new t(v), S = i(_, v);
    if (!S) return;
    const A = Number.isFinite(_.timeout) ? _.timeout : E.timeoutDefault;
    o(E, S), A > 0 && (S._timer = setTimeout(() => u(S), A));
  }
  function g(c) {
    const _ = c && c.detail || {};
    if (_.container) {
      const v = l(_);
      if (v)
        for (const E of Array.from(v.children)) u(E);
    } else {
      const v = document.querySelectorAll("[" + h + "]");
      for (const E of Array.from(v))
        for (const S of Array.from(E.children)) u(S);
    }
  }
  G(function() {
    n(), window.addEventListener("ln-toast:enqueue", d), window.addEventListener("ln-toast:clear", g), new MutationObserver(function(_) {
      for (const v of _) {
        if (v.type === "attributes") {
          r(v.target);
          continue;
        }
        for (const E of v.addedNodes)
          r(E);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), r(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", a = "lnUpload", b = "data-ln-upload-dict", m = "data-ln-upload-accept", p = "data-ln-upload-context", f = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function n() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const s = document.createElement("div");
    s.innerHTML = f;
    const d = s.firstElementChild;
    d && document.body.appendChild(d);
  }
  if (window[a] !== void 0) return;
  function r(s) {
    if (s === 0) return "0 B";
    const d = 1024, g = ["B", "KB", "MB", "GB"], c = Math.floor(Math.log(s) / Math.log(d));
    return parseFloat((s / Math.pow(d, c)).toFixed(1)) + " " + g[c];
  }
  function t(s) {
    return s.split(".").pop().toLowerCase();
  }
  function i(s) {
    return s === "docx" && (s = "doc"), ["pdf", "doc", "epub"].includes(s) ? "lnc-file-" + s : "ln-file";
  }
  function e(s, d) {
    if (!d) return !0;
    const g = "." + t(s.name);
    return d.split(",").map(function(_) {
      return _.trim().toLowerCase();
    }).includes(g.toLowerCase());
  }
  function o(s) {
    if (s.hasAttribute("data-ln-upload-initialized")) return;
    s.setAttribute("data-ln-upload-initialized", "true"), n();
    const d = oe(s, b), g = s.querySelector(".ln-upload__zone"), c = s.querySelector(".ln-upload__list"), _ = s.getAttribute(m) || "";
    if (!g || !c) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", s);
      return;
    }
    let v = s.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), _ && (v.accept = _.split(",").map(function(q) {
      return q = q.trim(), q.startsWith(".") ? q : "." + q;
    }).join(",")), s.appendChild(v));
    const E = s.getAttribute(h) || "/files/upload", S = s.getAttribute(p) || "", A = s.getAttribute("data-ln-upload-delete") || (E.includes("/upload") ? E.replace(/\/upload\/?$/, "/{id}") : E + "/{id}"), T = /* @__PURE__ */ new Map();
    let D = 0;
    function x() {
      const q = document.querySelector('meta[name="csrf-token"]');
      return q ? q.getAttribute("content") : "";
    }
    function O(q) {
      if (!e(q, _)) {
        const C = d["invalid-type"];
        w(s, "ln-upload:invalid", {
          file: q,
          message: C
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: d["invalid-title"] || "Invalid File",
          message: C || d["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++D, H = t(q.name), ht = i(H), et = at(s, "ln-upload-item", "ln-upload");
      if (!et) return;
      const W = et.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", P), X(W, {
        name: q.name,
        sizeText: "0%",
        iconHref: "#" + ht,
        removeLabel: d.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const ft = W.querySelector(".ln-upload__progress-bar"), nt = W.querySelector('[data-ln-upload-action="remove"]');
      nt && (nt.disabled = !0), c.appendChild(W);
      const rt = new FormData();
      rt.append("file", q);
      const vt = /* @__PURE__ */ new Set();
      s.querySelectorAll("input, select, textarea").forEach(function(C) {
        if (C.name && C.name !== "file_ids[]" && C.type !== "file") {
          if ((C.type === "checkbox" || C.type === "radio") && !C.checked)
            return;
          rt.append(C.name, C.value), vt.add(C.name);
        }
      }), !vt.has("context") && S && rt.append("context", S);
      const y = new XMLHttpRequest();
      y.upload.addEventListener("progress", function(C) {
        if (C.lengthComputable) {
          const k = Math.round(C.loaded / C.total * 100);
          ft.style.width = k + "%", X(W, { sizeText: k + "%" });
        }
      }), y.addEventListener("load", function() {
        if (y.status >= 200 && y.status < 300) {
          let C;
          try {
            C = JSON.parse(y.responseText);
          } catch {
            L("Invalid response");
            return;
          }
          X(W, { sizeText: r(C.size || q.size), uploading: !1 }), nt && (nt.disabled = !1), T.set(P, {
            serverId: C.id,
            name: C.name,
            size: C.size
          }), I(), w(s, "ln-upload:uploaded", {
            localId: P,
            serverId: C.id,
            name: C.name
          });
        } else {
          let C = d["upload-failed"] || "Upload failed";
          try {
            C = JSON.parse(y.responseText).message || C;
          } catch {
          }
          L(C);
        }
      }), y.addEventListener("error", function() {
        L(d["network-error"] || "Network error");
      });
      function L(C) {
        ft && (ft.style.width = "100%"), X(W, { sizeText: d.error || "Error", uploading: !1, error: !0 }), nt && (nt.disabled = !1), w(s, "ln-upload:error", {
          file: q,
          message: C
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: d["error-title"] || "Upload Error",
          message: C || d["upload-failed"] || "Failed to upload file"
        });
      }
      y.open("POST", E), y.setRequestHeader("X-CSRF-TOKEN", x()), y.setRequestHeader("Accept", "application/json"), y.send(rt);
    }
    function I() {
      for (const q of s.querySelectorAll('input[name="file_ids[]"]'))
        q.remove();
      for (const [, q] of T) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = q.serverId, s.appendChild(P);
      }
    }
    function B(q) {
      const P = T.get(q), H = c.querySelector('[data-file-id="' + q + '"]');
      if (!P || !P.serverId) {
        H && H.remove(), T.delete(q), I();
        return;
      }
      H && X(H, { deleting: !0 });
      const ht = A.replace("{id}", P.serverId);
      fetch(ht, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": x(),
          Accept: "application/json"
        }
      }).then(function(et) {
        et.status === 200 ? (H && H.remove(), T.delete(q), I(), w(s, "ln-upload:removed", {
          localId: q,
          serverId: P.serverId
        })) : (H && X(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: d["delete-title"] || "Error",
          message: d["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(et) {
        console.warn("[ln-upload] Delete error:", et), H && X(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: d["network-error"] || "Network error",
          message: d["connection-error"] || "Could not connect to server"
        });
      });
    }
    function j(q) {
      for (const P of q)
        O(P);
      v.value = "";
    }
    const Q = function() {
      v.click();
    }, Z = function() {
      j(this.files);
    }, bt = function(q) {
      q.preventDefault(), q.stopPropagation(), g.classList.add("ln-upload__zone--dragover");
    }, ct = function(q) {
      q.preventDefault(), q.stopPropagation(), g.classList.add("ln-upload__zone--dragover");
    }, $ = function(q) {
      q.preventDefault(), q.stopPropagation(), g.classList.remove("ln-upload__zone--dragover");
    }, dt = function(q) {
      q.preventDefault(), q.stopPropagation(), g.classList.remove("ln-upload__zone--dragover"), j(q.dataTransfer.files);
    }, ut = function(q) {
      const P = q.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !c.contains(P) || P.disabled) return;
      const H = P.closest(".ln-upload__item");
      H && B(H.getAttribute("data-file-id"));
    };
    g.addEventListener("click", Q), v.addEventListener("change", Z), g.addEventListener("dragenter", bt), g.addEventListener("dragover", ct), g.addEventListener("dragleave", $), g.addEventListener("drop", dt), c.addEventListener("click", ut), s.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(T.values()).map(function(q) {
          return q.serverId;
        });
      },
      getFiles: function() {
        return Array.from(T.values());
      },
      clear: function() {
        for (const [, q] of T)
          if (q.serverId) {
            const P = A.replace("{id}", q.serverId);
            fetch(P, {
              method: "DELETE",
              headers: {
                "X-CSRF-TOKEN": x(),
                Accept: "application/json"
              }
            });
          }
        T.clear(), c.innerHTML = "", I(), w(s, "ln-upload:cleared", {});
      },
      destroy: function() {
        g.removeEventListener("click", Q), v.removeEventListener("change", Z), g.removeEventListener("dragenter", bt), g.removeEventListener("dragover", ct), g.removeEventListener("dragleave", $), g.removeEventListener("drop", dt), c.removeEventListener("click", ut), T.clear(), c.innerHTML = "", I(), s.removeAttribute("data-ln-upload-initialized"), delete s.lnUploadAPI;
      }
    };
  }
  function u() {
    for (const s of document.querySelectorAll("[" + h + "]"))
      o(s);
  }
  function l() {
    G(function() {
      new MutationObserver(function(d) {
        for (const g of d)
          if (g.type === "childList") {
            for (const c of g.addedNodes)
              if (c.nodeType === 1) {
                c.hasAttribute(h) && o(c);
                for (const _ of c.querySelectorAll("[" + h + "]"))
                  o(_);
              }
          } else g.type === "attributes" && g.target.hasAttribute(h) && o(g.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[a] = {
    init: o,
    initAll: u
  }, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function a(r) {
    return r.hostname && r.hostname !== window.location.hostname;
  }
  function b(r) {
    if (r.getAttribute("data-ln-external-link") === "processed" || !a(r)) return;
    r.target = "_blank";
    const t = (r.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), r.rel = t.join(" ");
    const i = document.createElement("span");
    i.className = "sr-only", i.textContent = "(opens in new tab)", r.appendChild(i), r.setAttribute("data-ln-external-link", "processed"), w(r, "ln-external-links:processed", {
      link: r,
      href: r.href
    });
  }
  function m(r) {
    r = r || document.body;
    for (const t of r.querySelectorAll("a, area"))
      b(t);
  }
  function p() {
    G(function() {
      document.body.addEventListener("click", function(r) {
        const t = r.target.closest("a, area");
        t && t.getAttribute("data-ln-external-link") === "processed" && w(t, "ln-external-links:clicked", {
          link: t,
          href: t.href,
          text: t.textContent || t.title || ""
        });
      });
    }, "ln-external-links");
  }
  function f() {
    G(function() {
      new MutationObserver(function(t) {
        for (const i of t) {
          if (i.type === "childList") {
            for (const e of i.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && b(e), e.querySelectorAll))
                for (const o of e.querySelectorAll("a, area"))
                  b(o);
          }
          if (i.type === "attributes" && i.attributeName === "href") {
            const e = i.target;
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
  const h = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let b = null;
  function m() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function p(c) {
    b && (b.textContent = c, b.classList.add("ln-link-status--visible"));
  }
  function f() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function n(c, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const v = c.querySelector("a");
    if (!v) return;
    const E = v.getAttribute("href");
    if (!E) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(E, "_blank");
      return;
    }
    z(c, "ln-link:navigate", { target: c, href: E, link: v }).defaultPrevented || v.click();
  }
  function r(c) {
    const _ = c.querySelector("a");
    if (!_) return;
    const v = _.getAttribute("href");
    v && p(v);
  }
  function t() {
    f();
  }
  function i(c) {
    c[a + "Row"] || (c[a + "Row"] = !0, c.querySelector("a") && (c._lnLinkClick = function(_) {
      n(c, _);
    }, c._lnLinkEnter = function() {
      r(c);
    }, c.addEventListener("click", c._lnLinkClick), c.addEventListener("mouseenter", c._lnLinkEnter), c.addEventListener("mouseleave", t)));
  }
  function e(c) {
    c[a + "Row"] && (c._lnLinkClick && c.removeEventListener("click", c._lnLinkClick), c._lnLinkEnter && c.removeEventListener("mouseenter", c._lnLinkEnter), c.removeEventListener("mouseleave", t), delete c._lnLinkClick, delete c._lnLinkEnter, delete c[a + "Row"]);
  }
  function o(c) {
    if (!c[a + "Init"]) return;
    const _ = c.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const v = _ === "TABLE" && c.querySelector("tbody") || c;
      for (const E of v.querySelectorAll("tr"))
        e(E);
    } else
      e(c);
    delete c[a + "Init"];
  }
  function u(c) {
    if (c[a + "Init"]) return;
    c[a + "Init"] = !0;
    const _ = c.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const v = _ === "TABLE" && c.querySelector("tbody") || c;
      for (const E of v.querySelectorAll("tr"))
        i(E);
    } else
      i(c);
  }
  function l(c) {
    c.hasAttribute && c.hasAttribute(h) && u(c);
    const _ = c.querySelectorAll ? c.querySelectorAll("[" + h + "]") : [];
    for (const v of _)
      u(v);
  }
  function s() {
    G(function() {
      new MutationObserver(function(_) {
        for (const v of _)
          if (v.type === "childList")
            for (const E of v.addedNodes)
              E.nodeType === 1 && (l(E), E.tagName === "TR" && E.closest("[" + h + "]") && i(E));
          else v.type === "attributes" && l(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function d(c) {
    l(c);
  }
  window[a] = { init: d, destroy: o };
  function g() {
    m(), s(), d(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", g) : g();
})();
(function() {
  const h = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function b(i) {
    m(i);
  }
  function m(i) {
    const e = Array.from(i.querySelectorAll(h));
    for (const o of e)
      o[a] || (o[a] = new p(o));
    i.hasAttribute && i.hasAttribute("data-ln-progress") && !i[a] && (i[a] = new p(i));
  }
  function p(i) {
    return this.dom = i, this._attrObserver = null, this._parentObserver = null, t.call(this), n.call(this), r.call(this), this;
  }
  p.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function f() {
    G(function() {
      new MutationObserver(function(e) {
        for (const o of e)
          if (o.type === "childList")
            for (const u of o.addedNodes)
              u.nodeType === 1 && m(u);
          else o.type === "attributes" && m(o.target);
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
    const i = this, e = new MutationObserver(function(o) {
      for (const u of o)
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && t.call(i);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function r() {
    const i = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const o = new MutationObserver(function(u) {
      for (const l of u)
        l.attributeName === "data-ln-progress-max" && t.call(i);
    });
    o.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = o;
  }
  function t() {
    const i = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, u = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let l = u > 0 ? i / u * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100), this.dom.style.width = l + "%";
    const s = Math.max(0, Math.min(i, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(s)), w(this.dom, "ln-progress:change", { target: this.dom, value: i, max: u, percentage: l });
  }
  window[a] = b, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-filter", a = "lnFilter", b = "data-ln-filter-initialized", m = "data-ln-filter-key", p = "data-ln-filter-value", f = "data-ln-filter-hide", n = "data-ln-filter-reset", r = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function i(s) {
    return s.hasAttribute(n) || s.getAttribute(p) === "";
  }
  function e(s) {
    let d = s._filterKey;
    const g = [];
    for (let c = 0; c < s.inputs.length; c++) {
      const _ = s.inputs[c];
      if (_.checked && !i(_)) {
        const v = _.getAttribute(p);
        v && g.push(v);
      }
    }
    return { key: d, values: g };
  }
  function o(s, d) {
    if (s.length !== d.length) return !0;
    for (let g = 0; g < s.length; g++) if (s[g] !== d[g]) return !0;
    return !1;
  }
  function u(s) {
    const d = s.dom, g = s.colIndex, c = d.querySelector("template");
    if (!c || g === null) return;
    const _ = document.getElementById(s.targetId);
    if (!_) return;
    const v = _.tagName === "TABLE" ? _ : _.querySelector("table");
    if (!v || _.hasAttribute("data-ln-table")) return;
    const E = {}, S = [], A = v.tBodies;
    for (let x = 0; x < A.length; x++) {
      const O = A[x].rows;
      for (let I = 0; I < O.length; I++) {
        const B = O[I].cells[g], j = B ? B.textContent.trim() : "";
        j && !E[j] && (E[j] = !0, S.push(j));
      }
    }
    S.sort(function(x, O) {
      return x.localeCompare(O);
    });
    const T = d.querySelector("[" + m + "]"), D = T ? T.getAttribute(m) : d.getAttribute("data-ln-filter-key") || "col" + g;
    for (let x = 0; x < S.length; x++) {
      const O = c.content.cloneNode(!0), I = O.querySelector("input");
      I && (I.setAttribute(m, D), I.setAttribute(p, S[x]), _t(O, { text: S[x] }), d.appendChild(O));
    }
  }
  function l(s) {
    if (s.hasAttribute(b)) return this;
    this.dom = s, this.targetId = s.getAttribute(h);
    const d = s.getAttribute(r);
    this.colIndex = d !== null ? parseInt(d, 10) : null, u(this), this.inputs = Array.from(s.querySelectorAll("[" + m + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(m) : null, this._lastSnapshot = null;
    const g = this, c = le(
      function() {
        g._render();
      },
      function() {
        g._afterRender();
      }
    );
    this._queueRender = c, this._attachHandlers();
    let _ = !1;
    if (s.hasAttribute("data-ln-persist")) {
      const v = St("filter", s);
      if (v && v.key && Array.isArray(v.values) && v.values.length > 0) {
        for (let E = 0; E < this.inputs.length; E++) {
          const S = this.inputs[E];
          i(S) ? S.checked = !1 : S.getAttribute(m) === v.key && v.values.indexOf(S.getAttribute(p)) !== -1 ? S.checked = !0 : S.checked = !1;
        }
        c(), _ = !0;
      }
    }
    if (!_) {
      for (let v = 0; v < this.inputs.length; v++)
        if (this.inputs[v].checked && !i(this.inputs[v])) {
          c();
          break;
        }
    }
    return s.setAttribute(b, ""), this;
  }
  l.prototype._attachHandlers = function() {
    const s = this;
    this.inputs.forEach(function(d) {
      d[a + "Bound"] || (d[a + "Bound"] = !0, d._lnFilterChange = function() {
        if (i(d)) {
          for (let g = 0; g < s.inputs.length; g++)
            i(s.inputs[g]) || (s.inputs[g].checked = !1);
          d.checked = !0, s._queueRender();
          return;
        }
        if (d.checked) {
          for (let c = 0; c < s.inputs.length; c++)
            i(s.inputs[c]) && (s.inputs[c].checked = !1);
          let g = !1;
          for (let c = 0; c < s.inputs.length; c++)
            if (i(s.inputs[c])) {
              g = !0;
              break;
            }
          if (g) {
            let c = !0;
            for (let _ = 0; _ < s.inputs.length; _++)
              if (!i(s.inputs[_]) && !s.inputs[_].checked) {
                c = !1;
                break;
              }
            if (c)
              for (let _ = 0; _ < s.inputs.length; _++)
                i(s.inputs[_]) ? s.inputs[_].checked = !0 : s.inputs[_].checked = !1;
          }
        } else {
          let g = !1;
          for (let c = 0; c < s.inputs.length; c++)
            if (!i(s.inputs[c]) && s.inputs[c].checked) {
              g = !0;
              break;
            }
          if (!g)
            for (let c = 0; c < s.inputs.length; c++)
              i(s.inputs[c]) && (s.inputs[c].checked = !0);
        }
        s._queueRender();
      }, d.addEventListener("change", d._lnFilterChange));
    });
  }, l.prototype._render = function() {
    const s = this, d = e(this), g = d.key === null || d.values.length === 0, c = [];
    for (let _ = 0; _ < d.values.length; _++)
      c.push(d.values[_].toLowerCase());
    if (s.colIndex !== null)
      s._filterTableRows(d);
    else {
      const _ = document.getElementById(s.targetId);
      if (!_) return;
      const v = _.children;
      for (let E = 0; E < v.length; E++) {
        const S = v[E];
        if (g) {
          S.removeAttribute(f);
          continue;
        }
        const A = S.getAttribute("data-" + d.key);
        S.removeAttribute(f), A !== null && c.indexOf(A.toLowerCase()) === -1 && S.setAttribute(f, "true");
      }
    }
  }, l.prototype._afterRender = function() {
    const s = e(this), d = this._lastSnapshot;
    if (!d || d.key !== s.key || o(d.values, s.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: s.key,
        values: s.values.slice()
      });
      const c = d && d.values.length > 0, _ = s.values.length === 0;
      c && _ && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: s.key, values: s.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (s.key && s.values.length > 0 ? st("filter", this.dom, { key: s.key, values: s.values.slice() }) : st("filter", this.dom, null));
  }, l.prototype._dispatchOnBoth = function(s, d) {
    w(this.dom, s, d);
    const g = document.getElementById(this.targetId);
    g && g !== this.dom && w(g, s, d);
  }, l.prototype._filterTableRows = function(s) {
    const d = document.getElementById(this.targetId);
    if (!d) return;
    const g = d.tagName === "TABLE" ? d : d.querySelector("table");
    if (!g || d.hasAttribute("data-ln-table")) return;
    const c = s.key || this._filterKey, _ = s.values;
    t.has(g) || t.set(g, {});
    const v = t.get(g);
    if (c && _.length > 0) {
      const T = [];
      for (let D = 0; D < _.length; D++)
        T.push(_[D].toLowerCase());
      v[c] = { col: this.colIndex, values: T };
    } else c && delete v[c];
    const E = Object.keys(v), S = E.length > 0, A = g.tBodies;
    for (let T = 0; T < A.length; T++) {
      const D = A[T].rows;
      for (let x = 0; x < D.length; x++) {
        const O = D[x];
        if (!S) {
          O.removeAttribute(f);
          continue;
        }
        let I = !0;
        for (let B = 0; B < E.length; B++) {
          const j = v[E[B]], Q = O.cells[j.col], Z = Q ? Q.textContent.trim().toLowerCase() : "";
          if (j.values.indexOf(Z) === -1) {
            I = !1;
            break;
          }
        }
        I ? O.removeAttribute(f) : O.setAttribute(f, "true");
      }
    }
  }, l.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.colIndex !== null) {
        const s = document.getElementById(this.targetId);
        if (s) {
          const d = s.tagName === "TABLE" ? s : s.querySelector("table");
          if (d && t.has(d)) {
            const g = t.get(d), c = this._filterKey;
            c && g[c] && delete g[c], Object.keys(g).length === 0 && t.delete(d);
          }
        }
      }
      this.inputs.forEach(function(s) {
        s._lnFilterChange && (s.removeEventListener("change", s._lnFilterChange), delete s._lnFilterChange), delete s[a + "Bound"];
      }), this.dom.removeAttribute(b), delete this.dom[a];
    }
  }, F(h, a, l, "ln-filter");
})();
(function() {
  const h = "data-ln-search", a = "lnSearch", b = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function f(n) {
    if (n.hasAttribute(b)) return this;
    this.dom = n, this.targetId = n.getAttribute(h);
    const r = n.tagName;
    if (this.input = r === "INPUT" || r === "TEXTAREA" ? n : n.querySelector('[name="search"]') || n.querySelector('input[type="search"]') || n.querySelector('input[type="text"]'), this.itemsSelector = n.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return n.setAttribute(b, ""), this;
  }
  f.prototype._attachHandler = function() {
    if (!this.input) return;
    const n = this, r = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = r ? r.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      n.input.value = "", n._search(""), n.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(n._debounceTimer), n._debounceTimer = setTimeout(function() {
        n._search(n.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, f.prototype._search = function(n) {
    const r = document.getElementById(this.targetId);
    if (!r || z(r, "ln-search:change", { term: n, targetId: this.targetId }).defaultPrevented) return;
    const i = this.itemsSelector ? r.querySelectorAll(this.itemsSelector) : r.children;
    for (let e = 0; e < i.length; e++) {
      const o = i[e];
      o.removeAttribute(m), n && !o.textContent.replace(/\s+/g, " ").toLowerCase().includes(n) && o.setAttribute(m, "true");
    }
  }, f.prototype.destroy = function() {
    this.dom[a] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(b), delete this.dom[a]);
  }, F(h, a, f, "ln-search");
})();
(function() {
  const h = "lnTableSort", a = "data-ln-table-sort", b = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function m(r) {
    p(r);
  }
  function p(r) {
    const t = Array.from(r.querySelectorAll("table"));
    r.tagName === "TABLE" && t.push(r), t.forEach(function(i) {
      if (i[h]) return;
      const e = Array.from(i.querySelectorAll("th[" + a + "]"));
      e.length && (i[h] = new f(i, e));
    });
  }
  function f(r, t) {
    this.table = r, this.ths = t, this._col = -1, this._dir = null;
    const i = this;
    t.forEach(function(o, u) {
      if (o[h + "Bound"]) return;
      o[h + "Bound"] = !0;
      const l = o.querySelector("[" + b + "]");
      l && (l._lnSortClick = function() {
        i._handleClick(u, o);
      }, l.addEventListener("click", l._lnSortClick));
    });
    const e = r.closest("[data-ln-table][data-ln-persist]");
    if (e) {
      const o = St("table-sort", e);
      o && o.dir && o.col >= 0 && o.col < t.length && (this._handleClick(o.col, t[o.col]), o.dir === "desc" && this._handleClick(o.col, t[o.col]));
    }
    return this;
  }
  f.prototype._handleClick = function(r, t) {
    let i;
    this._col !== r ? i = "asc" : this._dir === "asc" ? i = "desc" : this._dir === "desc" ? i = null : i = "asc", this.ths.forEach(function(o) {
      o.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), i === null ? (this._col = -1, this._dir = null) : (this._col = r, this._dir = i, t.classList.add(i === "asc" ? "ln-sort-asc" : "ln-sort-desc")), w(this.table, "ln-table:sort", {
      column: r,
      sortType: t.getAttribute(a),
      direction: i
    });
    const e = this.table.closest("[data-ln-table][data-ln-persist]");
    e && (i === null ? st("table-sort", e, null) : st("table-sort", e, { col: r, dir: i }));
  }, f.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(r) {
      const t = r.querySelector("[" + b + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete r[h + "Bound"];
    }), delete this.table[h]);
  };
  function n() {
    G(function() {
      new MutationObserver(function(t) {
        t.forEach(function(i) {
          i.type === "childList" ? i.addedNodes.forEach(function(e) {
            e.nodeType === 1 && p(e);
          }) : i.type === "attributes" && p(i.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [a] });
    }, "ln-table-sort");
  }
  window[h] = m, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-table", a = "lnTable", b = "data-ln-table-sort", m = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const n = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, r = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function t(o) {
    return r ? r.format(o) : String(o);
  }
  function i(o) {
    let u = o.parentElement;
    for (; u && u !== document.body && u !== document.documentElement; ) {
      const s = getComputedStyle(u).overflowY;
      if (s === "auto" || s === "scroll") return u;
      u = u.parentElement;
    }
    return null;
  }
  function e(o) {
    this.dom = o, this.table = o.querySelector("table"), this.tbody = o.querySelector("[data-ln-table-body]") || o.querySelector("tbody"), this.thead = o.querySelector("thead");
    const u = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = u ? Array.from(u.querySelectorAll("th")) : [], this.isDataDriven = o.hasAttribute("data-ln-table-source"), this.name = o.getAttribute(h) || "", this.source = o.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const l = this;
    if (this._onColumnFilter = function(s) {
      const d = s.detail.key;
      let g = null;
      for (let v = 0; v < l.ths.length; v++)
        if (l.ths[v].getAttribute("data-ln-table-filter-col") === d) {
          g = l.ths[v];
          break;
        }
      if (!g) return;
      const c = s.detail.values, _ = g.querySelector("[data-ln-table-col-filter]");
      if (_ && _.classList.toggle("ln-filter-active", !!(c && c.length > 0)), l.isDataDriven)
        !c || c.length === 0 ? delete l.currentFilters[d] : l.currentFilters[d] = c, l._requestData();
      else {
        if (!c || c.length === 0)
          delete l._columnFilters[d];
        else {
          const v = [];
          for (let E = 0; E < c.length; E++)
            v.push(c[E].toLowerCase());
          l._columnFilters[d] = v;
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(o, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }
    }, this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = o.querySelector("[data-ln-table-total]"), this._filteredSpan = o.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = o.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(d) {
        const g = d.detail || {};
        l._data = g.data || [], l._lastTotal = g.total != null ? g.total : l._data.length, l._lastFiltered = g.filtered != null ? g.filtered : l._data.length, l.totalCount = l._lastTotal, l.visibleCount = l._lastFiltered, l.isLoaded = !0, o.classList.remove("ln-table--loading"), l._vStart = -1, l._vEnd = -1, l._applyFilterAndSort(), l._render(), l._updateFooter(), w(o, "ln-table:rendered", {
          table: l.name,
          total: l.totalCount,
          visible: l.visibleCount
        });
      }, o.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(d) {
        const g = d.detail && d.detail.loading;
        o.classList.toggle("ln-table--loading", !!g), g && (l.isLoaded = !1);
      }, o.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(d) {
        const g = d.target.closest("[data-ln-table-col-sort]");
        if (!g) return;
        const c = g.closest("th");
        if (!c) return;
        const _ = c.getAttribute("data-ln-table-col");
        _ && l._handleSort(_, c);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), o.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClearAll = function(d) {
        if (d.target.closest("[data-ln-table-clear-all]") || d.target.closest("[data-ln-data-table-clear-all]")) {
          l.currentFilters = {};
          for (let c = 0; c < l.ths.length; c++) {
            const _ = l.ths[c].querySelector("[data-ln-table-col-filter]");
            _ && _.classList.remove("ln-filter-active");
          }
          w(o, "ln-table:clear-filters", { table: l.name }), l._requestData();
        }
      }, o.addEventListener("click", this._onClearAll), this._selectable = o.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(d) {
        if (d.target.closest("[data-ln-table-row-select]") || d.target.closest("[data-ln-table-row-action]") || d.target.closest("a") || d.target.closest("button") || d.ctrlKey || d.metaKey || d.button === 1) return;
        const g = d.target.closest("[data-ln-table-row]");
        if (!g) return;
        const c = g.getAttribute("data-ln-table-row-id"), _ = g._lnRecord || {};
        w(o, "ln-table:row-click", {
          table: l.name,
          id: c,
          record: _
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(d) {
        const g = d.target.closest("[data-ln-table-row-action]");
        if (!g) return;
        d.stopPropagation();
        const c = g.closest("[data-ln-table-row]");
        if (!c) return;
        const _ = g.getAttribute("data-ln-table-row-action"), v = c.getAttribute("data-ln-table-row-id"), E = c._lnRecord || {};
        w(o, "ln-table:row-action", {
          table: l.name,
          id: v,
          action: _,
          record: E
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const s = document.querySelector('[data-ln-search="' + o.id + '"]');
      if (s) {
        const d = s.tagName;
        this._searchInput = d === "INPUT" || d === "TEXTAREA" ? s : s.querySelector('input[type="search"]') || s.querySelector('input[type="text"]') || s.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(d) {
        d.preventDefault(), l.currentSearch = d.detail.term, l._searchInput && (l._searchInput.value = d.detail.term), w(o, "ln-table:search", {
          table: l.name,
          query: l.currentSearch
        }), l._requestData();
      }, o.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(d) {
        if (!o.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (d.key === "/") {
          l._searchInput && (d.preventDefault(), l._searchInput.focus());
          return;
        }
        const g = l.tbody ? Array.from(l.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (g.length)
          switch (d.key) {
            case "ArrowDown":
              d.preventDefault(), l._focusedRowIndex = Math.min(l._focusedRowIndex + 1, g.length - 1), l._focusRow(g);
              break;
            case "ArrowUp":
              d.preventDefault(), l._focusedRowIndex = Math.max(l._focusedRowIndex - 1, 0), l._focusRow(g);
              break;
            case "Home":
              d.preventDefault(), l._focusedRowIndex = 0, l._focusRow(g);
              break;
            case "End":
              d.preventDefault(), l._focusedRowIndex = g.length - 1, l._focusRow(g);
              break;
            case "Enter":
              if (l._focusedRowIndex >= 0 && l._focusedRowIndex < g.length) {
                d.preventDefault();
                const c = g[l._focusedRowIndex];
                w(o, "ln-table:row-click", {
                  table: l.name,
                  id: c.getAttribute("data-ln-table-row-id"),
                  record: c._lnRecord || {}
                });
              }
              break;
            case " ":
              if (l._selectable && l._focusedRowIndex >= 0 && l._focusedRowIndex < g.length) {
                d.preventDefault();
                const c = g[l._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                c && (c.checked = !c.checked, c.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), w(o, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        l.tbody.rows.length > 0 && (l._emptyTbodyObserver.disconnect(), l._emptyTbodyObserver = null, l._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(s) {
        s.preventDefault(), l._searchTerm = s.detail.term, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(o, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, o.addEventListener("ln-search:change", this._onSearch), this._onSort = function(s) {
        l._sortCol = s.detail.direction === null ? -1 : s.detail.column, l._sortDir = s.detail.direction, l._sortType = s.detail.sortType, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(o, "ln-table:sorted", {
          column: s.detail.column,
          direction: s.detail.direction,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, o.addEventListener("ln-table:sort", this._onSort), o.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(s) {
        if (!s.target.closest("[data-ln-table-clear]")) return;
        l._searchTerm = "";
        const g = document.querySelector('[data-ln-search="' + o.id + '"]');
        if (g) {
          const _ = g.tagName === "INPUT" ? g : g.querySelector("input");
          _ && (_.value = "");
        }
        l._columnFilters = {};
        for (let _ = 0; _ < l.ths.length; _++) {
          const v = l.ths[_].querySelector("[data-ln-table-col-filter]");
          v && v.classList.remove("ln-filter-active");
        }
        const c = document.querySelectorAll('[data-ln-filter="' + o.id + '"]');
        for (let _ = 0; _ < c.length; _++) {
          const v = c[_].querySelector("[data-ln-filter-reset]");
          v && (v.checked = !0, v.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(o, "ln-table:filter", {
          term: "",
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, o.addEventListener("click", this._onClear);
    return this;
  }
  e.prototype._parseRows = function() {
    const o = this.tbody.rows, u = this.ths;
    this._data = [];
    const l = [];
    for (let s = 0; s < u.length; s++)
      l[s] = u[s].getAttribute(b);
    o.length > 0 && (this._rowHeight = o[0].offsetHeight || 40), this._lockColumnWidths();
    for (let s = 0; s < o.length; s++) {
      const d = o[s], g = [], c = [], _ = [];
      for (let E = 0; E < d.cells.length; E++) {
        const S = d.cells[E], A = S.textContent.trim(), T = Ft(S), D = l[E];
        c[E] = A.toLowerCase(), D === "number" || D === "date" ? g[E] = parseFloat(T) || 0 : D === "string" ? g[E] = String(T) : g[E] = null, E < d.cells.length - 1 && _.push(A.toLowerCase());
      }
      let v = null;
      if (this.isDataDriven) {
        v = {};
        const E = d.getAttribute("data-ln-table-row-id");
        E != null && (v.id = E);
        for (let S = 0; S < u.length; S++) {
          const A = u[S].getAttribute("data-ln-table-col");
          if (A) {
            const T = S;
            if (T < d.cells.length) {
              const D = d.cells[T];
              v[A] = Ft(D);
            }
          }
        }
      }
      this._data.push({
        sortKeys: g,
        rawTexts: c,
        html: d.outerHTML,
        searchText: _.join(" "),
        id: this.isDataDriven && v ? v.id : void 0,
        ...v
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, e.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const o = (this.currentSearch || "").trim().toLowerCase(), u = this.currentFilters || {}, l = Object.keys(u).length > 0;
      if (this._filteredData = this._data.filter(function(v) {
        if (o) {
          let E = !1;
          for (const S in v)
            if (v.hasOwnProperty(S) && typeof v[S] == "string" && S !== "html" && S !== "searchText" && v[S].toLowerCase().indexOf(o) !== -1) {
              E = !0;
              break;
            }
          if (!E) return !1;
        }
        if (l)
          for (const E in u) {
            const S = u[E];
            if (S && S.length > 0) {
              const A = v[E], T = A != null ? String(A) : "";
              if (S.indexOf(T) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const s = this.currentSort.field, g = this.currentSort.direction === "desc" ? -1 : 1;
      let c = null;
      if (this.ths) {
        for (let v = 0; v < this.ths.length; v++)
          if (this.ths[v].getAttribute("data-ln-table-col") === s) {
            c = this.ths[v].getAttribute(b);
            break;
          }
      }
      const _ = n ? n.compare : function(v, E) {
        return v < E ? -1 : v > E ? 1 : 0;
      };
      this._filteredData.sort(function(v, E) {
        const S = v[s], A = E[s];
        if (c === "number" || c === "date") {
          const x = parseFloat(S) || 0, O = parseFloat(A) || 0;
          return (x - O) * g;
        }
        if (typeof S == "number" && typeof A == "number")
          return (S - A) * g;
        const T = S != null ? String(S) : "", D = A != null ? String(A) : "";
        return _(T, D) * g;
      });
    } else {
      const o = this._searchTerm, u = this._columnFilters, l = Object.keys(u).length > 0, s = this.ths, d = {};
      if (l)
        for (let E = 0; E < s.length; E++) {
          const S = s[E].getAttribute("data-ln-table-filter-col");
          S && (d[S] = E);
        }
      if (!o && !l ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
        if (o && E.searchText.indexOf(o) === -1) return !1;
        if (l)
          for (const S in u) {
            const A = d[S];
            if (A !== void 0 && u[S].indexOf(E.rawTexts[A]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, c = this._sortDir === "desc" ? -1 : 1, _ = this._sortType === "number" || this._sortType === "date", v = n ? n.compare : function(E, S) {
        return E < S ? -1 : E > S ? 1 : 0;
      };
      this._filteredData.sort(function(E, S) {
        const A = E.sortKeys[g], T = S.sortKeys[g];
        return _ ? (A - T) * c : v(A, T) * c;
      });
    }
  }, e.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const o = document.createElement("colgroup");
    this.ths.forEach(function(u) {
      const l = document.createElement("col");
      l.style.width = u.offsetWidth + "px", o.appendChild(l);
    }), this.table.insertBefore(o, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = o;
  }, e.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const o = this._lastTotal, u = this.visibleCount;
        if (o === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || u === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const o = this._filteredData.length;
        o === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, e.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const o = this._filteredData, u = document.createDocumentFragment();
      for (let l = 0; l < o.length; l++) {
        const s = this._buildRow(o[l]);
        if (!s) break;
        u.appendChild(s);
      }
      this.tbody.textContent = "", this.tbody.appendChild(u), this._selectable && this._updateSelectAll();
    } else {
      const o = [], u = this._filteredData;
      for (let l = 0; l < u.length; l++) o.push(u[l].html);
      this.tbody.innerHTML = o.join("");
    }
  }, e.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
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
    this.isDataDriven ? this._scrollContainer = i(this.dom) : this._scrollContainer = null;
    const u = this._scrollContainer || window;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._renderVirtual();
      }));
    }, u.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    const o = this._filteredData, u = o.length, l = this._rowHeight;
    if (!l || !u) return;
    const s = this.thead ? this.thead.offsetHeight : 0, d = this._scrollContainer;
    let g, c;
    if (d) {
      const T = this.table.getBoundingClientRect(), D = d.getBoundingClientRect(), x = T.top - D.top + d.scrollTop + s;
      g = d.scrollTop - x, c = d.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + s;
      g = window.scrollY - x, c = window.innerHeight;
    }
    let _ = Math.max(0, Math.floor(g / l) - 15);
    _ = Math.min(_, u);
    const v = Math.min(_ + Math.ceil(c / l) + 30, u);
    if (_ === this._vStart && v === this._vEnd) return;
    this._vStart = _, this._vEnd = v;
    const E = this.ths.length || 1, S = _ * l, A = (u - v) * l;
    if (this.isDataDriven) {
      const T = document.createDocumentFragment();
      if (S > 0) {
        const D = document.createElement("tr");
        D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", E), x.style.height = S + "px", D.appendChild(x), T.appendChild(D);
      }
      for (let D = _; D < v; D++) {
        const x = this._buildRow(o[D]);
        x && T.appendChild(x);
      }
      if (A > 0) {
        const D = document.createElement("tr");
        D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", E), x.style.height = A + "px", D.appendChild(x), T.appendChild(D);
      }
      this.tbody.textContent = "", this.tbody.appendChild(T), this._selectable && this._updateSelectAll();
    } else {
      let T = "";
      S > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
      for (let D = _; D < v; D++) T += o[D].html;
      A > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = T;
    }
  }, e.prototype._showEmptyState = function() {
    const o = this.ths.length || 1;
    this.tbody.textContent = "";
    let u = null;
    if (this.isDataDriven) {
      const l = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount, d = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (s < l || s === 0), g = d ? this.name + "-empty-filtered" : this.name + "-empty";
      if (u = at(this.dom, g, "ln-table"), !u) {
        const c = this.dom.querySelector("template[data-ln-table-empty]");
        if (c) {
          const _ = d ? "search" : "initial", v = c.content.querySelector('[data-ln-table-empty-when="' + _ + '"]') || c.content.firstElementChild;
          v && (u = document.importNode(v, !0));
        }
      }
      if (u)
        if (u.tagName === "TR")
          this.tbody.appendChild(u);
        else {
          const c = document.createElement("td");
          c.setAttribute("colspan", String(o)), c.appendChild(u);
          const _ = document.createElement("tr");
          _.className = "ln-table__empty", _.appendChild(c), this.tbody.appendChild(_);
        }
    } else {
      const l = this.dom.querySelector("template[" + m + "]"), s = document.createElement("td");
      s.setAttribute("colspan", String(o)), l && s.appendChild(document.importNode(l.content, !0));
      const d = document.createElement("tr");
      d.className = "ln-table__empty", d.appendChild(s), this.tbody.appendChild(d);
    }
    w(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, e.prototype._fillRow = function(o, u) {
    _t(o, u);
    const l = o.querySelectorAll("[data-ln-table-cell-attr]");
    for (let s = 0; s < l.length; s++) {
      const d = l[s], g = d.getAttribute("data-ln-table-cell-attr").split(",");
      for (let c = 0; c < g.length; c++) {
        const _ = g[c].trim().split(":");
        if (_.length !== 2) continue;
        const v = _[0].trim(), E = _[1].trim();
        u[v] != null && d.setAttribute(E, u[v]);
      }
    }
  }, e.prototype._buildRow = function(o) {
    const u = at(this.dom, this.name + "-row", "ln-table");
    if (!u) return null;
    const l = u.querySelector("[data-ln-table-row]") || u.firstElementChild;
    if (!l) return null;
    if (this._fillRow(l, o), l._lnRecord = o, o.id != null && l.setAttribute("data-ln-table-row-id", o.id), this._selectable && o.id != null && this.selectedIds.has(String(o.id))) {
      l.classList.add("ln-row-selected");
      const s = l.querySelector("[data-ln-table-row-select]");
      s && (s.checked = !0);
    }
    return l;
  }, e.prototype._handleSort = function(o, u) {
    let l;
    !this.currentSort || this.currentSort.field !== o ? l = "asc" : this.currentSort.direction === "asc" ? l = "desc" : l = null;
    for (let s = 0; s < this.ths.length; s++)
      this.ths[s].classList.remove("ln-sort-asc", "ln-sort-desc");
    l ? (this.currentSort = { field: o, direction: l }, u.classList.add(l === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, w(this.dom, "ln-table:sort", {
      table: this.name,
      field: o,
      direction: l
    }), this._requestData();
  }, e.prototype._requestData = function() {
    Ut(this, "ln-table:request-data", "table");
  }, e.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-table-row]");
    let u = o.length > 0;
    for (let l = 0; l < o.length; l++) {
      const s = o[l].getAttribute("data-ln-table-row-id");
      if (s != null && !this.selectedIds.has(s)) {
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
    const o = this;
    if (this._onSelectionChange = function(u) {
      const l = u.target.closest("[data-ln-table-row-select]");
      if (!l) return;
      const s = l.closest("[data-ln-table-row]");
      if (!s) return;
      const d = s.getAttribute("data-ln-table-row-id");
      d != null && (l.checked ? (o.selectedIds.add(d), s.classList.add("ln-row-selected")) : (o.selectedIds.delete(d), s.classList.remove("ln-row-selected")), o.selectedCount = o.selectedIds.size, o._updateSelectAll(), o._updateFooter(), w(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const u = document.createElement("input");
      u.type = "checkbox", u.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(u), this._selectAllCheckbox = u;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const u = o._selectAllCheckbox.checked, l = o.tbody ? o.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let s = 0; s < l.length; s++) {
        const d = l[s].getAttribute("data-ln-table-row-id"), g = l[s].querySelector("[data-ln-table-row-select]");
        d != null && (u ? (o.selectedIds.add(d), l[s].classList.add("ln-row-selected")) : (o.selectedIds.delete(d), l[s].classList.remove("ln-row-selected")), g && (g.checked = u));
      }
      o.selectedCount = o.selectedIds.size, w(o.dom, "ln-table:select-all", {
        table: o.name,
        selected: u
      }), w(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }), o._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < u.length; l++) {
        const s = u[l].querySelector("[data-ln-table-row-select]"), d = u[l].getAttribute("data-ln-table-row-id");
        s && s.checked && d != null && (this.selectedIds.add(d), u[l].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, e.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const o = this.dom.querySelector("[data-ln-table-col-select]");
    if (o) {
      const u = o.querySelector('input[type="checkbox"]');
      u && u.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < u.length; l++) {
        u[l].classList.remove("ln-row-selected");
        const s = u[l].querySelector("[data-ln-table-row-select]");
        s && (s.checked = !1);
      }
    }
    this._updateFooter();
  }, e.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const o = this._lastTotal != null ? this._lastTotal : this._data.length, u = this.visibleCount, l = u < o;
    if (this._totalSpan && (this._totalSpan.textContent = t(o)), this._filteredSpan && (this._filteredSpan.textContent = l ? t(u) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const s = this.selectedIds.size;
      this._selectedSpan.textContent = s > 0 ? t(s) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
    }
  }, e.prototype._focusRow = function(o) {
    for (let u = 0; u < o.length; u++)
      o[u].classList.remove("ln-row-focused"), o[u].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < o.length) {
      const u = o[this._focusedRowIndex];
      u.classList.add("ln-row-focused"), u.setAttribute("tabindex", "0"), u.focus(), u.scrollIntoView({ block: "nearest" });
    }
  }, e.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter)) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, F(h, a, e, "ln-table");
})();
(function() {
  const h = "data-ln-list", a = "lnList", b = "data-ln-list-empty";
  if (window[a] !== void 0) return;
  function f(t) {
    let i = t;
    for (; i && i !== document.body && i !== document.documentElement; ) {
      const o = getComputedStyle(i).overflowY;
      if (o === "auto" || o === "scroll") return i;
      i = i.parentElement;
    }
    return null;
  }
  function n(t) {
    if (!t) return 0;
    const i = getComputedStyle(t), e = parseFloat(i.marginTop) || 0, o = parseFloat(i.marginBottom) || 0;
    return t.offsetHeight + e + o;
  }
  function r(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const i = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== t ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== t ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(e) {
      const o = e.detail || {};
      i._data = o.data || [], i._lastTotal = o.total != null ? o.total : i._data.length, i._lastFiltered = o.filtered != null ? o.filtered : i._data.length, i.totalCount = i._lastTotal, i.visibleCount = i._lastFiltered, i.isLoaded = !0, t.classList.remove("ln-list--loading"), i._vStart = -1, i._vEnd = -1, i._applyFilterAndSort(), i._render(), i._updateFooter(), w(t, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(e) {
      const o = e.detail && e.detail.loading;
      t.classList.toggle("ln-list--loading", !!o), o && (i.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(e) {
      (e.target.closest("[data-ln-list-clear-all]") || e.target.closest("[data-ln-data-list-clear-all]")) && (i.currentFilters = {}, w(t, "ln-list:clear-filters", { list: i.name }), i._requestData());
    }, t.addEventListener("click", this._onClearAll), this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(e) {
      if (e.target.closest("[data-ln-item-select]") || e.target.closest("[data-ln-item-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const o = e.target.closest("[data-ln-item]");
      if (!o) return;
      const u = o.getAttribute("data-ln-item-id"), l = o._lnRecord || {};
      w(t, "ln-list:item-click", {
        list: i.name,
        id: u,
        record: l
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(e) {
      const o = e.target.closest("[data-ln-item-action]");
      if (!o) return;
      e.stopPropagation();
      const u = o.closest("[data-ln-item]");
      if (!u) return;
      const l = o.getAttribute("data-ln-item-action"), s = u.getAttribute("data-ln-item-id"), d = u._lnRecord || {};
      w(t, "ln-list:item-action", {
        list: i.name,
        id: s,
        action: l,
        record: d
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(e) {
      e.preventDefault(), i.currentSearch = e.detail.term, w(t, "ln-list:search", {
        list: i.name,
        query: i.currentSearch
      }), i._requestData();
    }, t.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), w(t, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      i.tbody.children.length > 0 && (i._emptyObserver.disconnect(), i._emptyObserver = null, i._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(e) {
      e.preventDefault(), i._searchTerm = e.detail.term, i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), w(t, "ln-list:filter", {
        term: i._searchTerm,
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onClear = function(e) {
      if (!e.target.closest("[data-ln-list-clear]")) return;
      i._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (u) {
        const l = u.tagName === "INPUT" ? u : u.querySelector("input");
        l && (l.value = "");
      }
      i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), w(t, "ln-list:filter", {
        term: "",
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, t.addEventListener("click", this._onClear)), this;
  }
  r.prototype._parseChildren = function() {
    const t = Array.from(this.tbody.children).filter((i) => !i.classList.contains("ln-list__spacer"));
    this._data = [], t.length > 0 && (this._itemHeight = n(t[0]) || 50);
    for (let i = 0; i < t.length; i++) {
      const e = t[i], o = e.getAttribute("data-ln-item-id") || e.getAttribute("id"), u = e.textContent.trim().toLowerCase();
      let l = null;
      if (this.isDataDriven) {
        l = {}, o != null && (l.id = o);
        const s = e.querySelectorAll("[data-ln-list-field]");
        for (let d = 0; d < s.length; d++) {
          const g = s[d], c = g.getAttribute("data-ln-list-field");
          c && (l[c] = g.textContent.trim());
        }
      }
      this._data.push({
        html: e.outerHTML,
        searchText: u,
        id: o,
        ...l
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, r.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), i = this.currentFilters || {}, e = Object.keys(i).length > 0;
      if (this._filteredData = this._data.filter(function(s) {
        if (t) {
          let d = !1;
          for (const g in s)
            if (s.hasOwnProperty(g) && typeof s[g] == "string" && g !== "html" && g !== "searchText" && s[g].toLowerCase().indexOf(t) !== -1) {
              d = !0;
              break;
            }
          if (!d) return !1;
        }
        if (e)
          for (const d in i) {
            const g = i[d];
            if (g && g.length > 0) {
              const c = s[d], _ = c != null ? String(c) : "";
              if (g.indexOf(_) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const o = this.currentSort.field, u = this.currentSort.direction === "desc" ? -1 : 1, l = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(s, d) {
        return s < d ? -1 : s > d ? 1 : 0;
      };
      this._filteredData.sort(function(s, d) {
        const g = s[o], c = d[o];
        if (typeof g == "number" && typeof c == "number")
          return (g - c) * u;
        const _ = g != null ? String(g) : "", v = c != null ? String(c) : "";
        return l(_, v) * u;
      });
    } else {
      const t = this._searchTerm;
      t ? this._filteredData = this._data.filter(function(i) {
        return i.searchText.indexOf(t) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, r.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const t = this._lastTotal, i = this.visibleCount;
        if (t === 0 || this._filteredData.length === 0 || i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const t = this._filteredData.length;
        t === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, r.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, i = document.createDocumentFragment();
      for (let e = 0; e < t.length; e++) {
        const o = this._buildItem(t[e]);
        if (!o) break;
        i.appendChild(o);
      }
      this.tbody.textContent = "", this.tbody.appendChild(i), this._selectable && this._updateSelectAll();
    } else {
      const t = [], i = this._filteredData;
      for (let e = 0; e < i.length; e++) t.push(i[e].html);
      this.tbody.innerHTML = t.join("");
    }
  }, r.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), i = t.gridTemplateColumns;
    let e = 1;
    if (i && i !== "none") {
      const u = i.trim().split(/\s+/).filter(Boolean);
      u.length > 0 && (e = u.length);
    }
    const o = parseFloat(t.rowGap);
    return { columns: e, rowGap: isNaN(o) ? 0 : o };
  }, r.prototype._measureItemHeight = function() {
    if (this.isDataDriven) {
      if (this._data.length > 0) {
        const t = this._buildItem(this._data[0]);
        t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._itemHeight = n(t) || 50, this.tbody.textContent = "");
      }
    } else {
      const t = this.tbody.children;
      t.length > 0 && (this._itemHeight = n(t[0]) || 50);
    }
  }, r.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const t = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = f(this.dom);
    const i = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      t._itemHeight = 0, t._measureItemHeight(), t._vStart = -1, t._vEnd = -1, t._renderVirtual();
    }, i.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, r.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, r.prototype._renderVirtual = function() {
    const t = this._filteredData, i = t.length, e = this._itemHeight;
    if (!e || !i) return;
    const o = this._scrollContainer;
    let u, l;
    if (o) {
      const O = this.tbody.getBoundingClientRect(), I = o.getBoundingClientRect(), B = o === this.tbody ? 0 : O.top - I.top + o.scrollTop;
      u = o.scrollTop - B, l = o.clientHeight;
    } else {
      const I = this.tbody.getBoundingClientRect().top + window.scrollY;
      u = window.scrollY - I, l = window.innerHeight;
    }
    const s = this._readGridLayout(), d = s.columns, g = s.rowGap, c = e + g, _ = Math.ceil(i / d);
    let v = Math.max(0, Math.floor(u / c) - 15);
    v = Math.min(v, _);
    const E = Math.ceil(l / c) + 30, S = Math.min(v + E, _), A = Math.min(v * d, i), T = Math.min(S * d, i);
    if (A === this._vStart && T === this._vEnd) return;
    this._vStart = A, this._vEnd = T;
    const D = v * c, x = (_ - S) * c;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (D > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = D + "px", O.appendChild(I);
      }
      for (let I = A; I < T; I++) {
        const B = this._buildItem(t[I]);
        B && O.appendChild(B);
      }
      if (x > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = x + "px", O.appendChild(I);
      }
      this.tbody.textContent = "", this.tbody.appendChild(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      D > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${D}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let I = A; I < T; I++)
        O += t[I].html;
      x > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${x}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = O;
    }
  }, r.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount, o = this.currentSearch && (e < i || e === 0), u = o ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = at(this.dom, u, "ln-list"), !t) {
        const l = this.dom.querySelector("template[data-ln-empty]");
        if (l) {
          const s = o ? "search" : "initial", d = l.content.querySelector(`[data-ln-empty-when="${s}"]`) || l.content.firstElementChild;
          d && (t = document.importNode(d, !0));
        }
      }
    } else {
      const i = this.dom.querySelector(`template[${b}]`);
      i && (t = document.importNode(i.content, !0));
    }
    if (t)
      if (t.tagName === "LI" || t.tagName === "TR")
        this.tbody.appendChild(t);
      else {
        const i = document.createElement(this.isUl ? "li" : "div");
        i.appendChild(t), this.tbody.appendChild(i);
      }
    w(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, r.prototype._buildItem = function(t) {
    const i = at(this.dom, this.name + "-row", "ln-list");
    if (!i) return null;
    const e = i.querySelector("[data-ln-item]") || i.firstElementChild;
    if (!e) return null;
    if (_t(e, t), X(e, t), e._lnRecord = t, t.id != null && (e.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      e.classList.add("ln-item-selected");
      const o = e.querySelector("[data-ln-item-select]");
      o && (o.checked = !0);
    }
    return e;
  }, r.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(i) {
      const e = i.target.closest("[data-ln-item-select]");
      if (!e) return;
      const o = e.closest("[data-ln-item]");
      if (!o) return;
      const u = o.getAttribute("data-ln-item-id");
      u != null && (e.checked ? (t.selectedIds.add(String(u)), o.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(u)), o.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), w(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const i = t._selectAllCheckbox.checked, e = t.tbody.querySelectorAll("[data-ln-item]");
      for (let o = 0; o < e.length; o++) {
        const u = e[o], l = u.getAttribute("data-ln-item-id"), s = u.querySelector("[data-ln-item-select]");
        l != null && (i ? (t.selectedIds.add(String(l)), u.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(l)), u.classList.remove("ln-item-selected")), s && (s.checked = i));
      }
      w(t.dom, "ln-list:select-all", { list: t.name, selected: i }), w(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, r.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    let i = t.length > 0;
    for (let e = 0; e < t.length; e++) {
      const o = t[e].getAttribute("data-ln-item-id");
      if (o != null && !this.selectedIds.has(String(o))) {
        i = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = i;
  }, r.prototype._requestData = function() {
    Ut(this, "ln-list:request-data", "list");
  }, r.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const t = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount, e = i < t;
    if (this._totalSpan && (this._totalSpan.textContent = t), this._filteredSpan && (this._filteredSpan.textContent = e ? i : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const o = this.selectedIds.size;
      this._selectedSpan.textContent = o > 0 ? o : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", o === 0);
    }
  }, r.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, F(h, a, r, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", m = 36, p = 16, f = 2 * Math.PI * p;
  function n(o) {
    return this.dom = o, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), i.call(this), o.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  n.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[a]);
  };
  function r(o, u) {
    const l = document.createElementNS(b, o);
    for (const s in u)
      l.setAttribute(s, u[s]);
    return l;
  }
  function t() {
    this.svg = r("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = r("circle", {
      cx: m / 2,
      cy: m / 2,
      r: p,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = r("circle", {
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
  function i() {
    const o = this, u = new MutationObserver(function(l) {
      for (const s of l)
        (s.attributeName === "data-ln-circular-progress" || s.attributeName === "data-ln-circular-progress-max") && e.call(o);
    });
    u.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = u;
  }
  function e() {
    const o = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, u = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let l = u > 0 ? o / u * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100);
    const s = f - l / 100 * f;
    this.progressCircle.setAttribute("stroke-dashoffset", s);
    const d = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = d !== null ? d : Math.round(l) + "%", w(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: o,
      max: u,
      percentage: l
    });
  }
  F(h, a, n, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", a = "lnSortable", b = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function m(f) {
    this.dom = f, this.isEnabled = f.getAttribute(h) !== "disabled", this._dragging = null, f.setAttribute("aria-roledescription", "sortable list");
    const n = this;
    return this._onPointerDown = function(r) {
      n.isEnabled && n._handlePointerDown(r);
    }, f.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, m.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, m.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), w(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, m.prototype._handlePointerDown = function(f) {
    let n = f.target.closest("[" + b + "]"), r;
    if (n) {
      for (r = n; r && r.parentElement !== this.dom; )
        r = r.parentElement;
      if (!r || r.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (r = f.target; r && r.parentElement !== this.dom; )
        r = r.parentElement;
      if (!r || r.parentElement !== this.dom) return;
      n = r;
    }
    const i = Array.from(this.dom.children).indexOf(r);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: r,
      index: i
    }).defaultPrevented) return;
    f.preventDefault(), n.setPointerCapture(f.pointerId), this._dragging = r, r.classList.add("ln-sortable--dragging"), r.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), w(this.dom, "ln-sortable:drag-start", {
      item: r,
      index: i
    });
    const o = this, u = function(s) {
      o._handlePointerMove(s);
    }, l = function(s) {
      o._handlePointerEnd(s), n.removeEventListener("pointermove", u), n.removeEventListener("pointerup", l), n.removeEventListener("pointercancel", l);
    };
    n.addEventListener("pointermove", u), n.addEventListener("pointerup", l), n.addEventListener("pointercancel", l);
  }, m.prototype._handlePointerMove = function(f) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), r = this._dragging;
    for (const t of n)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of n) {
      if (t === r) continue;
      const i = t.getBoundingClientRect(), e = i.top + i.height / 2;
      if (f.clientY >= i.top && f.clientY < e) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (f.clientY >= e && f.clientY <= i.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(f) {
    if (!this._dragging) return;
    const n = this._dragging, r = Array.from(this.dom.children), t = r.indexOf(n);
    let i = null, e = null;
    for (const o of r) {
      if (o.classList.contains("ln-sortable--drop-before")) {
        i = o, e = "before";
        break;
      }
      if (o.classList.contains("ln-sortable--drop-after")) {
        i = o, e = "after";
        break;
      }
    }
    for (const o of r)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), i && i !== n) {
      e === "before" ? this.dom.insertBefore(n, i) : this.dom.insertBefore(n, i.nextElementSibling);
      const u = Array.from(this.dom.children).indexOf(n);
      w(this.dom, "ln-sortable:reordered", {
        item: n,
        oldIndex: t,
        newIndex: u
      });
    }
    this._dragging = null;
  };
  function p(f) {
    const n = f[a];
    if (!n) return;
    const r = f.getAttribute(h) !== "disabled";
    r !== n.isEnabled && (n.isEnabled = r, w(f, r ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: f }));
  }
  F(h, a, m, "ln-sortable", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-confirm", a = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function p(f) {
    this.dom = f, this.confirming = !1, this.originalText = f.textContent.trim(), this.confirmText = f.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const n = this;
    return this._onClick = function(r) {
      if (!n.confirming)
        r.preventDefault(), r.stopImmediatePropagation(), n._enterConfirm();
      else {
        if (n._submitted) return;
        n._submitted = !0, n._reset();
      }
    }, f.addEventListener("click", this._onClick), this;
  }
  p.prototype._getTimeout = function() {
    const f = parseFloat(this.dom.getAttribute(b));
    return isNaN(f) || f <= 0 ? 3 : f;
  }, p.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var f = this.dom.querySelector("svg.ln-icon use");
    f && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = f.getAttribute("href"), f.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), w(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, p.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const f = this, n = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      f._reset();
    }, n);
  }, p.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var f = this.dom.querySelector("svg.ln-icon use");
      f && this.originalIconHref && f.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, p.prototype.destroy = function() {
    this.dom[a] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, F(h, a, p, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(p) {
    this.dom = p, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = p.getAttribute(h + "-default") || "", this.badgesEl = p.querySelector("[" + h + "-active]"), this.menuEl = p.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const f = p.getAttribute(h + "-locales");
    if (this.locales = b, f)
      try {
        this.locales = JSON.parse(f);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const n = this;
    return this._onRequestAdd = function(r) {
      r.detail && r.detail.lang && n.addLanguage(r.detail.lang);
    }, this._onRequestRemove = function(r) {
      r.detail && r.detail.lang && n.removeLanguage(r.detail.lang);
    }, p.addEventListener("ln-translations:request-add", this._onRequestAdd), p.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const f of p) {
      const n = f.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const r of n)
        r.setAttribute("data-ln-translatable-lang", this.defaultLang);
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
    for (const r in this.locales) {
      if (!this.locales.hasOwnProperty(r) || this.activeLanguages.has(r)) continue;
      f++;
      const t = yt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const i = t.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", r), i.textContent = this.locales[r], i.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.menuEl.getAttribute("data-ln-toggle") === "open" && p.menuEl.setAttribute("data-ln-toggle", "close"), p.addLanguage(r));
      }), this.menuEl.appendChild(t);
    }
    const n = this.dom.querySelector("[" + h + "-add]");
    n && (n.style.display = f === 0 ? "none" : "");
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const p = this;
    this.activeLanguages.forEach(function(f) {
      const n = yt("ln-translations-badge", "ln-translations");
      if (!n) return;
      const r = n.querySelector("[data-ln-translations-lang]");
      r.setAttribute("data-ln-translations-lang", f);
      const t = r.querySelector("span");
      t.textContent = p.locales[f] || f.toUpperCase();
      const i = r.querySelector("button");
      i.setAttribute("aria-label", "Remove " + (p.locales[f] || f.toUpperCase())), i.addEventListener("click", function(e) {
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
    for (const i of t) {
      const e = i.getAttribute("data-ln-translatable"), o = i.getAttribute("data-ln-translations-prefix") || "", u = i.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!u) continue;
      const l = u.cloneNode(!1);
      o ? l.name = o + "[trans][" + p + "][" + e + "]" : l.name = "trans[" + p + "][" + e + "]", l.value = f[e] !== void 0 ? f[e] : "", l.removeAttribute("id"), l.placeholder = n + " translation", l.setAttribute("data-ln-translatable-lang", p);
      const s = i.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), d = s.length > 0 ? s[s.length - 1] : u;
      d.parentNode.insertBefore(l, d.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:added", {
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
    for (const r of n)
      r.parentNode.removeChild(r);
    this.activeLanguages.delete(p), this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: p
    });
  }, m.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, m.prototype.hasLanguage = function(p) {
    return this.activeLanguages.has(p);
  }, m.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const p = this.defaultLang, f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of f)
      n.getAttribute("data-ln-translatable-lang") !== p && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, F(h, a, m, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", a = "lnAutosave", b = "data-ln-autosave-clear", m = "data-ln-autosave-debounce-input", p = "ln-autosave:";
  if (window[a] !== void 0) return;
  function n(e) {
    const o = r(e);
    if (!o) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = o;
    let u = null;
    function l() {
      const c = jt(e);
      try {
        localStorage.setItem(o, JSON.stringify(c));
      } catch {
        return;
      }
      w(e, "ln-autosave:saved", { target: e, data: c });
    }
    function s() {
      let c;
      try {
        c = localStorage.getItem(o);
      } catch {
        return;
      }
      if (!c) return;
      let _;
      try {
        _ = JSON.parse(c);
      } catch {
        return;
      }
      if (z(e, "ln-autosave:before-restore", { target: e, data: _ }).defaultPrevented) return;
      const E = zt(e, _);
      for (let S = 0; S < E.length; S++)
        E[S].dispatchEvent(new Event("input", { bubbles: !0 })), E[S].dispatchEvent(new Event("change", { bubbles: !0 }));
      w(e, "ln-autosave:restored", { target: e, data: _ });
    }
    function d() {
      try {
        localStorage.removeItem(o);
      } catch {
        return;
      }
      w(e, "ln-autosave:cleared", { target: e });
    }
    this._onFocusout = function(c) {
      const _ = c.target;
      t(_) && _.name && l();
    }, this._onChange = function(c) {
      const _ = c.target;
      t(_) && _.name && l();
    }, this._onSubmit = function() {
      d();
    }, this._onReset = function() {
      d();
    }, this._onClearClick = function(c) {
      c.target.closest("[" + b + "]") && d();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick);
    const g = i(e);
    return g > 0 && (this._onInput = function(c) {
      const _ = c.target;
      !t(_) || !_.name || (u !== null && clearTimeout(u), u = setTimeout(l, g));
    }, e.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, s(), this;
  }
  n.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const e = this._getInputTimer();
        e !== null && clearTimeout(e);
      }
      w(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function r(e) {
    const u = e.getAttribute(h) || e.id;
    return u ? p + window.location.pathname + ":" + u : null;
  }
  function t(e) {
    const o = e.tagName;
    return o === "INPUT" || o === "TEXTAREA" || o === "SELECT";
  }
  function i(e) {
    if (!e.hasAttribute(m)) return 0;
    const o = e.getAttribute(m);
    if (o === "" || o === null) return 1e3;
    const u = parseInt(o, 10);
    return isNaN(u) || u < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", e), 1e3) : u;
  }
  F(h, a, n, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
  function b(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  }, F(h, a, b, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", a = "lnValidate", b = "data-ln-validate-errors", m = "data-ln-validate-error", p = "ln-validate-valid", f = "ln-validate-invalid", n = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[a] !== void 0) return;
  function r(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const i = this, e = t.tagName, o = t.type, u = e === "SELECT" || o === "checkbox" || o === "radio";
    return this._onInput = function() {
      i._touched = !0, i.validate();
    }, this._onChange = function() {
      i._touched = !0, i.validate();
    }, this._onSetCustom = function(l) {
      const s = l.detail && l.detail.error;
      if (!s) return;
      i._customErrors.add(s), i._touched = !0;
      const d = t.closest(".form-element");
      if (d) {
        const g = d.querySelector("[" + m + '="' + s + '"]');
        g && g.classList.remove("hidden");
      }
      t.classList.remove(p), t.classList.add(f);
    }, this._onClearCustom = function(l) {
      const s = l.detail && l.detail.error, d = t.closest(".form-element");
      if (s) {
        if (i._customErrors.delete(s), d) {
          const g = d.querySelector("[" + m + '="' + s + '"]');
          g && g.classList.add("hidden");
        }
      } else
        i._customErrors.forEach(function(g) {
          if (d) {
            const c = d.querySelector("[" + m + '="' + g + '"]');
            c && c.classList.add("hidden");
          }
        }), i._customErrors.clear();
      i._touched && i.validate();
    }, u || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  r.prototype.validate = function() {
    const t = this.dom, i = t.validity, o = t.checkValidity() && this._customErrors.size === 0, u = t.closest(".form-element");
    if (u) {
      const s = u.querySelector("[" + b + "]");
      if (s) {
        const d = s.querySelectorAll("[" + m + "]");
        for (let g = 0; g < d.length; g++) {
          const c = d[g].getAttribute(m), _ = n[c];
          _ && (i[_] ? d[g].classList.remove("hidden") : d[g].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(p, o), t.classList.toggle(f, !o), w(t, o ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), o;
  }, r.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, f);
    const t = this.dom.closest(".form-element");
    if (t) {
      const i = t.querySelectorAll("[" + m + "]");
      for (let e = 0; e < i.length; e++)
        i[e].classList.add("hidden");
    }
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), r.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(p, f), w(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a]);
  }, F(h, a, r, "ln-validate");
})();
(function() {
  const h = "data-ln-form", a = "lnForm", b = "data-ln-form-auto", m = "data-ln-form-debounce", p = "data-ln-form-typed", f = "data-ln-validate", n = "lnValidate";
  if (window[a] !== void 0) return;
  function r(t) {
    this.dom = t, this._debounceTimer = null;
    const i = this;
    if (this._onValid = function() {
      i._updateSubmitButton();
    }, this._onInvalid = function() {
      i._updateSubmitButton();
    }, this._onSubmit = function(e) {
      e.preventDefault(), i.submit();
    }, this._onFill = function(e) {
      e.detail && i.fill(e.detail);
    }, this._onFormReset = function() {
      i.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        i._resetValidation();
      }, 0);
    }, t.addEventListener("ln-validate:valid", this._onValid), t.addEventListener("ln-validate:invalid", this._onInvalid), t.addEventListener("submit", this._onSubmit), t.addEventListener("ln-form:fill", this._onFill), t.addEventListener("ln-form:reset", this._onFormReset), t.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, t.hasAttribute(b)) {
      const e = parseInt(t.getAttribute(m)) || 0;
      this._onAutoInput = function() {
        e > 0 ? (clearTimeout(i._debounceTimer), i._debounceTimer = setTimeout(function() {
          i.submit();
        }, e)) : i.submit();
      }, t.addEventListener("input", this._onAutoInput), t.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  r.prototype._updateSubmitButton = function() {
    const t = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!t.length) return;
    const i = this.dom.querySelectorAll("[" + f + "]");
    let e = !1;
    if (i.length > 0) {
      let o = !1, u = !1;
      for (let l = 0; l < i.length; l++) {
        const s = i[l][n];
        s && s._touched && (o = !0), i[l].checkValidity() || (u = !0);
      }
      e = u || !o;
    }
    for (let o = 0; o < t.length; o++)
      t[o].disabled = e;
  }, r.prototype.fill = function(t) {
    const i = zt(this.dom, t);
    for (let e = 0; e < i.length; e++) {
      const o = i[e], u = o.tagName === "SELECT" || o.type === "checkbox" || o.type === "radio";
      o.dispatchEvent(new Event(u ? "change" : "input", { bubbles: !0 }));
    }
  }, r.prototype.submit = function() {
    const t = this.dom.querySelectorAll("[" + f + "]");
    let i = !0;
    for (let o = 0; o < t.length; o++) {
      const u = t[o][n];
      u && (u.validate() || (i = !1));
    }
    if (!i) return;
    const e = jt(this.dom, { typed: this.dom.hasAttribute(p) });
    w(this.dom, "ln-form:submit", { data: e });
  }, r.prototype.reset = function() {
    this.dom.reset();
    const t = this.dom.querySelectorAll("input, textarea, select");
    for (let i = 0; i < t.length; i++) {
      const e = t[i], o = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(o ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), w(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, r.prototype._resetValidation = function() {
    const t = this.dom.querySelectorAll("[" + f + "]");
    for (let i = 0; i < t.length; i++) {
      const e = t[i][n];
      e && e.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      const t = this.dom.querySelectorAll("[" + f + "]");
      for (let i = 0; i < t.length; i++)
        if (!t[i].checkValidity()) return !1;
      return !0;
    }
  }), r.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), w(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, F(h, a, r, "ln-form");
})();
(function() {
  const h = "data-ln-slug-from", a = "lnSlug";
  if (window[a] !== void 0) return;
  function b(p) {
    return String(p).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function m(p) {
    if (p.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", p.tagName), this;
    const f = p.form;
    if (!f)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", p), this;
    const n = p.getAttribute(h), r = f.elements[n];
    if (!r)
      return console.warn('[ln-slug] Source field "' + n + '" not found in form:', p), this;
    if (typeof r.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + n + '" is a RadioNodeList (same-name group) — single source field required:', p), this;
    this.dom = p, this.source = r, this._pristine = p.value === "", this._mirroring = !1;
    const t = this;
    return this._onSource = function() {
      t._pristine && t._mirror();
    }, this._onSlug = function() {
      t._mirroring || (t._pristine = t.dom.value === "");
    }, r.addEventListener("input", this._onSource), p.addEventListener("input", this._onSlug), this;
  }
  m.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = b(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, m.prototype.destroy = function() {
    this.dom[a] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[a]);
  }, F(h, a, m, "ln-slug");
})();
(function() {
  const h = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const b = {}, m = {};
  function p(S) {
    return S.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function f(S, A) {
    const T = (S || "") + "|" + JSON.stringify(A);
    return b[T] || (b[T] = new Intl.DateTimeFormat(S, A)), b[T];
  }
  function n(S) {
    const A = S || "";
    return m[A] || (m[A] = new Intl.RelativeTimeFormat(S, { numeric: "auto", style: "narrow" })), m[A];
  }
  const r = /* @__PURE__ */ new Set();
  let t = null;
  function i() {
    t || (t = setInterval(o, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function o() {
    for (const S of r) {
      if (!document.body.contains(S.dom)) {
        r.delete(S);
        continue;
      }
      c(S);
    }
    r.size === 0 && e();
  }
  function u(S, A) {
    return f(A, { dateStyle: "long", timeStyle: "short" }).format(S);
  }
  function l(S, A) {
    const T = /* @__PURE__ */ new Date(), D = { month: "short", day: "numeric" };
    return S.getFullYear() !== T.getFullYear() && (D.year = "numeric"), f(A, D).format(S);
  }
  function s(S, A) {
    return f(A, { dateStyle: "medium" }).format(S);
  }
  function d(S, A) {
    return f(A, { timeStyle: "short" }).format(S);
  }
  function g(S, A) {
    const T = Math.floor(Date.now() / 1e3), x = Math.floor(S.getTime() / 1e3) - T, O = Math.abs(x);
    if (O < 10) return n(A).format(0, "second");
    let I, B;
    if (O < 60)
      I = "second", B = x;
    else if (O < 3600)
      I = "minute", B = Math.round(x / 60);
    else if (O < 86400)
      I = "hour", B = Math.round(x / 3600);
    else if (O < 604800)
      I = "day", B = Math.round(x / 86400);
    else if (O < 2592e3)
      I = "week", B = Math.round(x / 604800);
    else
      return l(S, A);
    return n(A).format(B, I);
  }
  function c(S) {
    const A = S.dom.getAttribute("datetime");
    if (!A) return;
    const T = Number(A);
    if (isNaN(T)) return;
    const D = new Date(T * 1e3), x = S.dom.getAttribute(h) || "short", O = p(S.dom);
    let I;
    switch (x) {
      case "relative":
        I = g(D, O);
        break;
      case "full":
        I = u(D, O);
        break;
      case "date":
        I = s(D, O);
        break;
      case "time":
        I = d(D, O);
        break;
      default:
        I = l(D, O);
        break;
    }
    S.dom.textContent = I, x !== "full" && (S.dom.title = u(D, O));
  }
  function _(S) {
    return this.dom = S, c(this), S.getAttribute(h) === "relative" && (r.add(this), i()), this;
  }
  _.prototype.render = function() {
    c(this);
  }, _.prototype.destroy = function() {
    r.delete(this), r.size === 0 && e(), delete this.dom[a];
  };
  function v(S) {
    const A = S[a];
    if (!A) return;
    S.getAttribute(h) === "relative" ? (r.add(A), i()) : (r.delete(A), r.size === 0 && e()), c(A);
  }
  function E(S) {
    S.nodeType === 1 && S.hasAttribute && S.hasAttribute(h) && S[a] && c(S[a]);
  }
  F(h, a, _, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: E
  });
})();
(function() {
  const h = "data-ln-data-store", a = "lnDataStore";
  if (window[a] !== void 0) return;
  const b = "ln_app_cache", m = "_meta", p = "1.0";
  let f = null, n = null;
  const r = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (L) => {
        const C = Math.random() * 16 | 0;
        return (L === "x" ? C : C & 3 | 8).toString(16);
      });
    }
  }
  function i(y) {
    y && y.name === "QuotaExceededError" && w(document, "ln-store:quota-exceeded", { error: y });
  }
  function e() {
    const y = {};
    for (const L of document.querySelectorAll(`[${h}]`)) {
      const C = L.getAttribute(h);
      if (C) {
        const k = L.getAttribute("data-ln-data-store-indexes") || L.getAttribute("data-ln-store-indexes") || "";
        y[C] = {
          indexes: k.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return y;
  }
  function o() {
    return n || (n = new Promise((y) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), y(null);
      const L = e(), C = Object.keys(L), k = indexedDB.open(b);
      k.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), y(null);
      }, k.onsuccess = (R) => {
        const M = R.target.result, N = Array.from(M.objectStoreNames);
        if (!(!N.includes(m) || C.some((pt) => !N.includes(pt))))
          return u(M), f = M, y(M);
        const Y = M.version;
        M.close();
        const tt = indexedDB.open(b, Y + 1);
        tt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, tt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), y(null);
        }, tt.onupgradeneeded = (pt) => {
          const it = pt.target.result;
          it.objectStoreNames.contains(m) || it.createObjectStore(m, { keyPath: "key" });
          for (const Ct of C)
            if (!it.objectStoreNames.contains(Ct)) {
              const ne = it.createObjectStore(Ct, { keyPath: "id" });
              for (const Nt of L[Ct].indexes)
                ne.createIndex(Nt, Nt, { unique: !1 });
            }
        }, tt.onsuccess = (pt) => {
          const it = pt.target.result;
          u(it), f = it, y(it);
        };
      };
    }), n);
  }
  function u(y) {
    y.onversionchange = () => {
      y.close(), f = null, n = null;
    };
  }
  function l() {
    return f ? Promise.resolve(f) : (n = null, o());
  }
  async function s(y) {
    if (!mt() || !y) return y;
    const L = { ...y }, C = L.id, k = L._pending, R = await de(L);
    return !R || !R.encrypted ? y : {
      id: C,
      _pending: k,
      encrypted: !0,
      iv: R.iv,
      data: R.data
    };
  }
  async function d(y) {
    return !y || !y.encrypted || !mt() ? y : ue(y);
  }
  const g = (y, L) => l().then((C) => C ? C.transaction(y, L).objectStore(y) : null);
  function c(y) {
    return new Promise((L, C) => {
      y.onsuccess = () => L(y.result), y.onerror = () => {
        i(y.error), C(y.error);
      };
    });
  }
  const _ = (y) => g(y, "readonly").then((L) => L ? c(L.getAll()) : []).then((L) => mt() ? Promise.all(L.map((C) => d(C))) : L), v = (y, L) => g(y, "readonly").then((C) => C ? c(C.get(L)) : null).then((C) => C ? d(C) : null), E = (y, L) => (mt() ? s(L) : Promise.resolve(L)).then((k) => g(y, "readwrite").then((R) => R ? c(R.put(k)) : null)), S = (y, L) => g(y, "readwrite").then((C) => C ? c(C.delete(L)) : null), A = (y) => g(y, "readwrite").then((L) => L ? c(L.clear()) : null), T = (y) => g(y, "readonly").then((L) => L ? c(L.count()) : 0), D = (y) => g(m, "readonly").then((L) => L ? c(L.get(y)) : null), x = (y, L) => g(m, "readwrite").then((C) => {
    if (C)
      return L.key = y, c(C.put(L));
  });
  function O(y) {
    this.dom = y, this._name = y.getAttribute(h);
    const L = y.getAttribute("data-ln-data-store-stale") || y.getAttribute("data-ln-store-stale"), C = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(C) ? 300 : C;
    const k = y.getAttribute("data-ln-data-store-search-fields") || y.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = k.split(",").map((R) => R.trim()).filter(Boolean), this._noAutosync = y.hasAttribute("data-ln-data-store-no-autosync") || y.hasAttribute("data-ln-store-no-autosync"), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, r[this._name] = this, I(this), bt(this), this;
  }
  function I(y) {
    y._handlers = {
      create: (L) => B(y, L.detail),
      update: (L) => j(y, L.detail),
      delete: (L) => Q(y, L.detail),
      "bulk-delete": (L) => Z(y, L.detail)
    };
    for (const [L, C] of Object.entries(y._handlers))
      y.dom.addEventListener(`ln-store:request-${L}`, C);
  }
  function B(y, { data: L = {} } = {}) {
    const C = `_temp_${t()}`, k = { ...L, id: C, _pending: !0 };
    E(y._name, k).then(() => {
      y.totalCount++, w(y.dom, "ln-store:created", { store: y._name, record: k, tempId: C }), w(y.dom, "ln-store:request-remote-create", { tempId: C, data: L });
    });
  }
  function j(y, { id: L, data: C = {}, expected_version: k } = {}) {
    v(y._name, L).then((R) => {
      if (!R) throw new Error(`Record not found: ${L}`);
      y._pendingSnapshots[L] = { ...R };
      const M = { ...R, ...C, _pending: !0 };
      return E(y._name, M).then(() => {
        w(y.dom, "ln-store:updated", { store: y._name, record: M, previous: y._pendingSnapshots[L] }), w(y.dom, "ln-store:request-remote-update", { id: L, data: C, expected_version: k });
      });
    }).catch((R) => console.error("[ln-data-store] Optimistic update failed:", R));
  }
  function Q(y, { id: L } = {}) {
    v(y._name, L).then((C) => {
      if (C)
        return y._pendingSnapshots[L] = { ...C }, S(y._name, L).then(() => {
          y.totalCount--, w(y.dom, "ln-store:deleted", { store: y._name, id: L }), w(y.dom, "ln-store:request-remote-delete", { id: L });
        });
    }).catch((C) => console.error("[ln-data-store] Optimistic delete failed:", C));
  }
  function Z(y, { ids: L = [] } = {}) {
    L.length && Promise.all(L.map((C) => v(y._name, C))).then((C) => {
      const k = C.filter(Boolean), R = k.map((M) => M.id);
      return y._pendingSnapshots[R.join(",")] = k, ut(y._name, R).then(() => {
        y.totalCount -= R.length, w(y.dom, "ln-store:deleted", { store: y._name, ids: R }), w(y.dom, "ln-store:request-remote-bulk-delete", { ids: R });
      });
    }).catch((C) => console.error("[ln-data-store] Optimistic bulk delete failed:", C));
  }
  function bt(y) {
    o().then(() => D(y._name)).then((L) => {
      L && L.schema_version === p ? (y.lastSyncedAt = L.last_synced_at || null, y.totalCount = L.record_count || 0, y.totalCount > 0 ? (y.isLoaded = !0, w(y.dom, "ln-store:ready", { store: y._name, count: y.totalCount, source: "cache" }), ct(y) && $(y)) : $(y)) : L && L.schema_version !== p ? A(y._name).then(() => x(y._name, { schema_version: p, last_synced_at: null, record_count: 0 })).then(() => $(y)) : $(y);
    });
  }
  function ct(y) {
    return y._staleThreshold === -1 ? !1 : y.lastSyncedAt ? Math.floor(Date.now() / 1e3) - y.lastSyncedAt > y._staleThreshold : !0;
  }
  function $(y) {
    y.isSyncing = !0, w(y.dom, "ln-store:request-remote-sync", { since: y.lastSyncedAt });
  }
  function dt(y, L) {
    return l().then((C) => C ? (mt() ? Promise.all(L.map((R) => s(R))) : Promise.resolve(L)).then((R) => new Promise((M, N) => {
      const U = C.transaction(y, "readwrite"), Y = U.objectStore(y);
      R.forEach((tt) => Y.put(tt)), U.oncomplete = () => M(), U.onerror = () => {
        i(U.error), N(U.error);
      };
    })) : void 0);
  }
  function ut(y, L) {
    return l().then((C) => {
      if (C)
        return new Promise((k, R) => {
          const M = C.transaction(y, "readwrite"), N = M.objectStore(y);
          L.forEach((U) => N.delete(U)), M.oncomplete = () => k(), M.onerror = () => R(M.error);
        });
    });
  }
  let q = () => {
    document.visibilityState === "visible" && Object.values(r).forEach((y) => {
      y.isLoaded && !y.isSyncing && ct(y) && $(y);
    });
  };
  document.addEventListener("visibilitychange", q);
  let P = () => {
    w(document, "ln-store:online", {}), Object.values(r).forEach((y) => {
      y._noAutosync || y.isLoaded && !y.isSyncing && $(y);
    });
  };
  window.addEventListener("online", P);
  let H = () => {
    w(document, "ln-store:offline", {});
  };
  window.addEventListener("offline", H);
  const ht = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function et(y, L) {
    if (!L || !L.field) return y;
    const { field: C, direction: k } = L, R = k === "desc";
    return [...y].sort((M, N) => {
      const U = M[C], Y = N[C];
      if (U == null && Y == null) return 0;
      if (U == null) return R ? 1 : -1;
      if (Y == null) return R ? -1 : 1;
      const tt = typeof U == "string" && typeof Y == "string" ? ht.compare(U, Y) : U < Y ? -1 : U > Y ? 1 : 0;
      return R ? -tt : tt;
    });
  }
  function W(y, L) {
    if (!L) return y;
    const C = Object.keys(L).filter((k) => Array.isArray(L[k]) && L[k].length > 0);
    return C.length ? y.filter(
      (k) => C.every((R) => L[R].map(String).includes(String(k[R])))
    ) : y;
  }
  function ft(y, L, C) {
    if (!L || !C || !C.length) return y;
    const k = L.toLowerCase();
    return y.filter(
      (R) => C.some((M) => {
        const N = R[M];
        return N != null && String(N).toLowerCase().includes(k);
      })
    );
  }
  function nt(y, L, C) {
    if (!y.length) return 0;
    if (C === "count") return y.length;
    const k = y.map((M) => parseFloat(M[L])).filter((M) => !isNaN(M)), R = k.reduce((M, N) => M + N, 0);
    return C === "sum" ? R : C === "avg" && k.length ? R / k.length : 0;
  }
  function rt(y, L) {
    if (!y.presenters || !y.presenters.computed) return L;
    const C = y.presenters.computed;
    return L.map((k) => {
      const R = { ...k };
      for (const [M, N] of Object.entries(C))
        try {
          R[M] = N(k);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${M}`, U);
        }
      return R;
    });
  }
  O.prototype.getAll = function(y = {}) {
    const L = this;
    return _(L._name).then((C) => {
      const k = C.length;
      y.filters && (C = W(C, y.filters)), y.search && (C = ft(C, y.search, L._searchFields));
      const R = C.length;
      if (y.sort && (C = et(C, y.sort)), y.offset || y.limit) {
        const M = y.offset || 0, N = y.limit || C.length;
        C = C.slice(M, M + N);
      }
      return {
        data: rt(L, C),
        total: k,
        filtered: R
      };
    });
  }, O.prototype.getById = function(y) {
    return v(this._name, y).then((L) => L ? rt(this, [L])[0] : null);
  }, O.prototype.count = function(y) {
    return y ? _(this._name).then((L) => W(L, y).length) : T(this._name);
  }, O.prototype.aggregate = function(y, L) {
    return _(this._name).then((C) => nt(C, y, L));
  }, O.prototype.setPresenters = function(y) {
    this.presenters = y;
  }, O.prototype.applySync = function(y, L, C) {
    const k = this, R = y.length > 0 || L.length > 0;
    let M = Promise.resolve();
    return y.length > 0 && (M = M.then(() => dt(k._name, y))), L.length > 0 && (M = M.then(() => ut(k._name, L))), M.then(() => T(k._name)).then((N) => (k.totalCount = N, x(k._name, {
      schema_version: p,
      last_synced_at: C,
      record_count: N
    }))).then(() => {
      const N = !k.isLoaded;
      k.isLoaded = !0, k.isSyncing = !1, k.lastSyncedAt = C, N ? (w(k.dom, "ln-store:loaded", { store: k._name, count: k.totalCount }), w(k.dom, "ln-store:ready", { store: k._name, count: k.totalCount, source: "server" })) : w(k.dom, "ln-store:synced", {
        store: k._name,
        added: y.length,
        deleted: L.length,
        changed: R
      });
    }).catch((N) => {
      k.isSyncing = !1, console.error("[ln-data-store] applySync failed:", N);
    });
  }, O.prototype.confirmMutation = function(y, L, C) {
    const k = this, R = {
      create: () => S(k._name, y).then(() => E(k._name, L)).then(() => {
        delete k._pendingSnapshots[y], w(k.dom, "ln-store:confirmed", { store: k._name, record: L, tempId: y, action: "create" });
      }),
      update: () => E(k._name, L).then(() => {
        delete k._pendingSnapshots[y], w(k.dom, "ln-store:confirmed", { store: k._name, record: L, action: "update" });
      }),
      delete: () => (delete k._pendingSnapshots[y], w(k.dom, "ln-store:confirmed", { store: k._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete k._pendingSnapshots[y], w(k.dom, "ln-store:confirmed", { store: k._name, record: null, ids: y.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return R[C] ? R[C]() : Promise.resolve();
  }, O.prototype.revertMutation = function(y, L, C) {
    const k = this, R = C || `Server rejected ${L}`, M = {
      create: () => S(k._name, y).then(() => {
        k.totalCount--, delete k._pendingSnapshots[y], w(k.dom, "ln-store:reverted", { store: k._name, record: null, action: "create", error: R });
      }),
      update: () => {
        const N = k._pendingSnapshots[y];
        return N ? E(k._name, N).then(() => {
          delete k._pendingSnapshots[y], w(k.dom, "ln-store:reverted", { store: k._name, record: N, action: "update", error: R });
        }) : Promise.resolve();
      },
      delete: () => {
        const N = k._pendingSnapshots[y];
        return N ? E(k._name, N).then(() => {
          k.totalCount++, delete k._pendingSnapshots[y], w(k.dom, "ln-store:reverted", { store: k._name, record: N, action: "delete", error: R });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const N = k._pendingSnapshots[y];
        return !N || !N.length ? Promise.resolve() : dt(k._name, N).then(() => {
          k.totalCount += N.length, delete k._pendingSnapshots[y], w(k.dom, "ln-store:reverted", { store: k._name, record: null, ids: y.split(","), action: "bulk-delete", error: R });
        });
      }
    };
    return M[L] ? M[L]() : Promise.resolve();
  }, O.prototype.resolveConflict = function(y, L, C) {
    const k = this._pendingSnapshots[y];
    return k ? E(this._name, k).then(() => {
      delete this._pendingSnapshots[y], w(this.dom, "ln-store:conflict", {
        store: this._name,
        local: k,
        remote: L,
        field_diffs: C || null
      });
    }) : Promise.resolve();
  }, O.prototype.forceSync = function() {
    $(this);
  }, O.prototype.fullReload = function() {
    const y = this;
    return A(y._name).then(() => {
      y.isLoaded = !1, y.lastSyncedAt = null, y.totalCount = 0, $(y);
    });
  }, O.prototype.destroy = function() {
    if (this._handlers) {
      for (const [y, L] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${y}`, L);
      this._handlers = null;
    }
    delete r[this._name], Object.keys(r).length === 0 && (q && (document.removeEventListener("visibilitychange", q), q = null), P && (window.removeEventListener("online", P), P = null), H && (window.removeEventListener("offline", H), H = null)), delete this.dom[a], w(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function vt() {
    return l().then((y) => {
      if (!y) return;
      const L = Array.from(y.objectStoreNames);
      return new Promise((C, k) => {
        const R = y.transaction(L, "readwrite");
        L.forEach((M) => R.objectStore(M).clear()), R.oncomplete = () => C(), R.onerror = () => k(R.error);
      });
    }).then(() => {
      Object.values(r).forEach((y) => {
        y.isLoaded = !1, y.isSyncing = !1, y.lastSyncedAt = null, y.totalCount = 0;
      });
    });
  }
  F(h, a, O, "ln-data-store"), window[a].clearAll = vt, window[a].init = window[a], window[a].setStorageKey = Bt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Bt);
})();
(function() {
  const h = "data-ln-api-connector", a = "lnApiConnector", b = "lnConnector";
  if (window[a] !== void 0) return;
  function m(n) {
    return this.dom = n, n[a] = this, n[b] = this, this.refreshConfig(), this._handlers = null, p(this), this;
  }
  m.prototype.refreshConfig = function() {
    const n = this.dom;
    this.baseUrl = n.getAttribute("data-ln-api-base-url") || "", this.path = n.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const r = n.getAttribute("data-ln-api-headers") || "";
    this.headers = Wt(r, "ln-api-connector"), (r.toLowerCase().includes("authorization") || r.toLowerCase().includes("bearer") || r.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), w(n, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, m.prototype.fetchDelta = function(n) {
    const r = this;
    let t = V(r.baseUrl, r.path);
    return n != null && n !== "" && (t += (t.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n)), window.fetch(t, { method: "GET", headers: K(r.headers), credentials: r.credentials }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    });
  }, m.prototype.create = function(n) {
    const r = this;
    return window.fetch(V(r.baseUrl, r.path), {
      method: "POST",
      headers: K(r.headers),
      credentials: r.credentials,
      body: JSON.stringify(n)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, m.prototype.update = function(n, r) {
    const t = this;
    return window.fetch(V(t.baseUrl, t.path, n), {
      method: "PUT",
      headers: K(t.headers),
      credentials: t.credentials,
      body: JSON.stringify(r)
    }).then((i) => {
      if (i.ok) return i.json();
      if (i.status === 409) return i.json().then((e) => {
        const o = new Error("Conflict");
        throw o.status = 409, o.data = e, o;
      });
      throw new Error("HTTP " + i.status + ": " + i.statusText);
    });
  }, m.prototype.delete = function(n) {
    const r = this;
    return window.fetch(V(r.baseUrl, r.path, n), {
      method: "DELETE",
      headers: K(r.headers),
      credentials: r.credentials
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, m.prototype.bulkDelete = function(n) {
    const r = this;
    return window.fetch(V(r.baseUrl, r.path) + "/bulk-delete", {
      method: "DELETE",
      headers: K(r.headers),
      credentials: r.credentials,
      body: JSON.stringify({ ids: n })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  };
  function p(n) {
    n._handlers = {
      sync: function(t) {
        const i = t.detail || {};
        n.fetchDelta(i.since).then(function(e) {
          w(n.dom, "ln-api-connector:fetched", { data: e, since: i.since });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: i.since
          });
        });
      },
      create: function(t) {
        const i = t.detail || {};
        n.create(i.data).then(function(e) {
          w(n.dom, "ln-api-connector:created", { record: e, tempId: i.tempId });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: i.tempId
          });
        });
      },
      update: function(t) {
        const i = t.detail || {}, e = Object.assign({}, i.data);
        i.expected_version !== void 0 && (e.expected_version = i.expected_version), n.update(i.id, e).then(function(o) {
          w(n.dom, "ln-api-connector:updated", { record: o, id: i.id });
        }).catch(function(o) {
          w(n.dom, "ln-api-connector:error", {
            action: "update",
            error: o.message,
            status: o.status || 0,
            id: i.id,
            conflictData: o.status === 409 ? o.data : null
          });
        });
      },
      delete: function(t) {
        const i = t.detail || {};
        n.delete(i.id).then(function(e) {
          w(n.dom, "ln-api-connector:deleted", { response: e, id: i.id });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: i.id
          });
        });
      },
      bulkDelete: function(t) {
        const i = t.detail || {};
        n.bulkDelete(i.ids).then(function(e) {
          w(n.dom, "ln-api-connector:bulk-deleted", { response: e, ids: i.ids });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: i.ids
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.addEventListener(t + ":request-sync", n._handlers.sync), n.dom.addEventListener(t + ":request-fetch", n._handlers.sync), n.dom.addEventListener(t + ":request-create", n._handlers.create), n.dom.addEventListener(t + ":request-update", n._handlers.update), n.dom.addEventListener(t + ":request-delete", n._handlers.delete), n.dom.addEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const n = this;
    n._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), w(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[b];
  };
  function f(n) {
    const r = n[a];
    r && r.refreshConfig();
  }
  F(h, a, m, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", a = "lnCouchDbConnector", b = "lnConnector";
  if (window[a] !== void 0) return;
  function m(n) {
    return this.dom = n, n[a] = this, n[b] = this, this.refreshConfig(), this._handlers = null, p(this), this;
  }
  m.prototype.refreshConfig = function() {
    const n = this.dom;
    this.url = n.getAttribute("data-ln-couchdb-url") || "", this.db = n.getAttribute("data-ln-couchdb-db") || "", this.auth = n.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const r = n.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Wt(r, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), r.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), w(n, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, m.prototype.fetchDelta = function(n) {
    const r = this, t = ["include_docs=true", "feed=normal"];
    n && t.push("since=" + encodeURIComponent(n));
    const i = V(r.url, r.db, "_changes") + "?" + t.join("&");
    return window.fetch(i, { method: "GET", headers: K(r.headers, r.auth), credentials: r.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const o = e.results || [];
      return {
        data: o.filter((u) => !u.deleted && u.doc).map((u) => Object.assign({}, u.doc, { id: u.doc._id })),
        deleted: o.filter((u) => u.deleted).map((u) => u.id),
        synced_at: e.last_seq || n || ""
      };
    });
  }, m.prototype.create = function(n) {
    const r = this, t = Object.assign({ _id: n.id }, n);
    return t._id || delete t._id, window.fetch(V(r.url, r.db), {
      method: "POST",
      headers: K(r.headers, r.auth),
      credentials: r.credentials,
      body: JSON.stringify(t)
    }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => Object.assign({}, t, { id: i.id, _id: i.id, _rev: i.rev }));
  }, m.prototype.update = function(n, r) {
    const t = this, i = Object.assign({ id: String(n), _id: String(n) }, r), e = i._rev || i.rev;
    return (e ? Promise.resolve(e) : window.fetch(V(t.url, t.db, null, n), { method: "GET", headers: K(t.headers, t.auth), credentials: t.credentials }).then((u) => {
      if (!u.ok) throw new Error("Could not retrieve document for revision mapping");
      return u.json().then((l) => l._rev);
    })).then((u) => {
      const l = Object.assign({}, i, { _rev: u });
      delete l.rev;
      const s = Object.assign(K(t.headers, t.auth), { "If-Match": u });
      return window.fetch(V(t.url, t.db, null, n), {
        method: "PUT",
        headers: s,
        credentials: t.credentials,
        body: JSON.stringify(l)
      }).then((d) => {
        if (d.ok) return d.json().then((g) => Object.assign({}, l, { _rev: g.rev }));
        if (d.status === 409) return d.json().then((g) => {
          const c = new Error("Conflict");
          throw c.status = 409, c.data = g, c;
        });
        throw new Error("HTTP " + d.status + ": " + d.statusText);
      });
    });
  }, m.prototype.delete = function(n, r) {
    const t = this;
    return (r ? Promise.resolve(r) : window.fetch(V(t.url, t.db, null, n), { method: "GET", headers: K(t.headers, t.auth), credentials: t.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((o) => o._rev);
    })).then((e) => {
      const o = V(t.url, t.db, null, n) + "?rev=" + encodeURIComponent(e);
      return window.fetch(o, { method: "DELETE", headers: K(t.headers, t.auth), credentials: t.credentials }).then((u) => {
        if (!u.ok) throw new Error("HTTP " + u.status + ": " + u.statusText);
        return u.json();
      });
    });
  }, m.prototype.bulkDelete = function(n) {
    const r = this;
    return !n || n.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch(V(r.url, r.db, "_all_docs"), {
      method: "POST",
      headers: K(r.headers, r.auth),
      credentials: r.credentials,
      body: JSON.stringify({ keys: n })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = (t.rows || []).filter((o) => !o.error && o.value && o.value.rev).map((o) => ({ _id: o.id, _rev: o.value.rev, _deleted: !0 }));
      return e.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(V(r.url, r.db, "_bulk_docs"), {
        method: "POST",
        headers: K(r.headers, r.auth),
        credentials: r.credentials,
        body: JSON.stringify({ docs: e })
      }).then((o) => {
        if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
        return o.json();
      }).then((o) => ({ ok: !0, results: o, deletedCount: e.length }));
    });
  };
  function p(n) {
    n._handlers = {
      sync: function(t) {
        const i = t.detail || {};
        n.fetchDelta(i.since).then(function(e) {
          w(n.dom, "ln-couchdb-connector:fetched", { data: e, since: i.since });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: i.since
          });
        });
      },
      create: function(t) {
        const i = t.detail || {};
        n.create(i.data).then(function(e) {
          w(n.dom, "ln-couchdb-connector:created", { record: e, tempId: i.tempId });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: i.tempId
          });
        });
      },
      update: function(t) {
        const i = t.detail || {}, e = Object.assign({}, i.data);
        i.expected_version !== void 0 && (e._rev = i.expected_version), n.update(i.id, e).then(function(o) {
          w(n.dom, "ln-couchdb-connector:updated", { record: o, id: i.id });
        }).catch(function(o) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: o.message,
            status: o.status || 0,
            id: i.id,
            conflictData: o.status === 409 ? o.data : null
          });
        });
      },
      delete: function(t) {
        const i = t.detail || {};
        n.delete(i.id, i.rev).then(function(e) {
          w(n.dom, "ln-couchdb-connector:deleted", { response: e, id: i.id });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: i.id
          });
        });
      },
      bulkDelete: function(t) {
        const i = t.detail || {};
        n.bulkDelete(i.ids).then(function(e) {
          w(n.dom, "ln-couchdb-connector:bulk-deleted", { response: e, ids: i.ids });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: i.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.addEventListener(t + ":request-sync", n._handlers.sync), n.dom.addEventListener(t + ":request-fetch", n._handlers.sync), n.dom.addEventListener(t + ":request-create", n._handlers.create), n.dom.addEventListener(t + ":request-update", n._handlers.update), n.dom.addEventListener(t + ":request-delete", n._handlers.delete), n.dom.addEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const n = this;
    n._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), w(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[b];
  };
  function f(n) {
    const r = n[a];
    r && r.refreshConfig();
  }
  F(h, a, m, "ln-couchdb-connector", {
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
  const h = "data-ln-data-coordinator", a = "lnDataCoordinator", b = "lnCoordinator";
  if (window[a] !== void 0) return;
  function m(n) {
    return this.dom = n, this._name = n.getAttribute(h), n[a] = this, n[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this.refreshMapper(), p(this), this;
  }
  m.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const r = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    r && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(r)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(t) {
      return t;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(t) {
      return t;
    });
  }, m.prototype.findChildren = function() {
    const n = this.dom.querySelector("[data-ln-data-store]"), r = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]");
    return {
      storeEl: n,
      connectorEl: r,
      store: n ? n.lnDataStore || n.lnStore : null,
      connector: r ? r.lnConnector || r.lnApiConnector || r.lnCouchDbConnector : null
    };
  };
  function p(n) {
    n._handlers = {
      sync: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        const i = r.detail.since;
        t.connector.fetchDelta(i).then(function(e) {
          let o = [], u = [], l = null;
          e && Array.isArray(e) ? (o = e, l = Math.floor(Date.now() / 1e3)) : e && (o = Array.isArray(e.data) ? e.data : [], u = Array.isArray(e.deleted) ? e.deleted : [], l = e.synced_at !== void 0 ? e.synced_at : e.since !== void 0 ? e.since : null);
          const s = o.map((d) => n.mapper.ingress(d));
          t.store.applySync(s, u, l);
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Sync failed:", e);
        });
      },
      create: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const i = r.detail.tempId, e = r.detail.data || {}, o = n.mapper.egress(e);
        t.connector.create(o).then(function(u) {
          const l = n.mapper.ingress(u);
          t.store.confirmMutation(i, l, "create");
        }).catch(function(u) {
          console.error("[ln-data-coordinator] Create mutation failed:", u), t.store.revertMutation(i, "create", u.message || u);
        });
      },
      update: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const i = r.detail.id, e = r.detail.expected_version;
        t.store.getById(i).then(function(o) {
          if (!o) throw new Error("Record not found in cache store: " + i);
          const u = Object.assign({}, o);
          delete u._pending;
          const l = n.mapper.egress(u);
          return t.connector.update(i, l, e);
        }).then(function(o) {
          const u = n.mapper.ingress(o);
          t.store.confirmMutation(i, u, "update");
        }).catch(function(o) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", o), o.status === 409) {
            const u = o.data && o.data.remote ? n.mapper.ingress(o.data.remote) : null, l = o.data ? o.data.field_diffs : null;
            t.store.resolveConflict(i, u, l);
          } else
            t.store.revertMutation(i, "update", o.message || o);
        });
      },
      delete: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const i = r.detail.id;
        t.connector.delete(i).then(function() {
          t.store.confirmMutation(i, null, "delete");
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Delete mutation failed:", e), t.store.revertMutation(i, "delete", e.message || e);
        });
      },
      bulkDelete: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const i = r.detail.ids || [], e = i.join(",");
        t.connector.bulkDelete(i).then(function() {
          t.store.confirmMutation(e, null, "bulk-delete");
        }).catch(function(o) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", o), t.store.revertMutation(e, "bulk-delete", o.message || o);
        });
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(r) {
        n._serveData(r, "table");
      },
      reqListData: function(r) {
        n._serveData(r, "list");
      },
      reqOptions: function(r) {
        n._serveOptions(r);
      },
      reqStat: function(r) {
        n._serveStat(r);
      },
      refresh: function() {
        n._refreshAll();
      },
      refreshSynced: function(r) {
        r.detail && r.detail.changed && n._refreshAll();
      }
    }, n.dom.addEventListener("ln-store:request-remote-sync", n._handlers.sync), n.dom.addEventListener("ln-store:request-remote-create", n._handlers.create), n.dom.addEventListener("ln-store:request-remote-update", n._handlers.update), n.dom.addEventListener("ln-store:request-remote-delete", n._handlers.delete), n.dom.addEventListener("ln-store:request-remote-bulk-delete", n._handlers.bulkDelete), document.addEventListener("ln-table:request-data", n._handlers.reqTableData), document.addEventListener("ln-list:request-data", n._handlers.reqListData), document.addEventListener("ln-options:request-data", n._handlers.reqOptions), document.addEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.addEventListener("ln-store:ready", n._handlers.refresh), n.dom.addEventListener("ln-store:loaded", n._handlers.refresh), n.dom.addEventListener("ln-store:created", n._handlers.refresh), n.dom.addEventListener("ln-store:updated", n._handlers.refresh), n.dom.addEventListener("ln-store:deleted", n._handlers.refresh), n.dom.addEventListener("ln-store:synced", n._handlers.refreshSynced);
  }
  m.prototype._ownsStore = function(n) {
    const r = this.findChildren();
    return !!(r.store && r.store._name === n && n);
  }, m.prototype._serveData = function(n, r) {
    const t = n.target, i = r === "table" ? "data-ln-table-store" : "data-ln-list-store", e = t.getAttribute(i);
    if (!e || !this._ownsStore(e)) return;
    this._boundQueries.set(t, {
      sort: n.detail.sort,
      filters: n.detail.filters,
      search: n.detail.search
    });
    const o = this.findChildren().store;
    if (!o.isLoaded) {
      w(t, "ln-" + r + ":set-loading", { loading: !0 });
      return;
    }
    const u = this, l = { sort: n.detail.sort, filters: n.detail.filters, search: n.detail.search };
    o.getAll(l).then(function(s) {
      const d = { data: s.data, total: s.total, filtered: s.filtered };
      w(t, "ln-" + r + ":set-data", d), u._boundDelivered.set(t, !0);
    });
  }, m.prototype._serveOptions = function(n) {
    const r = n.target, t = r.getAttribute("data-ln-options");
    if (!this._ownsStore(t)) return;
    this.findChildren().store.getAll({}).then(function(e) {
      w(r, "ln-options:set-data", { data: e.data });
    });
  }, m.prototype._serveStat = function(n) {
    const r = n.target, t = r.getAttribute("data-ln-stat");
    if (!this._ownsStore(t)) return;
    const i = n.detail.filters || null;
    this.findChildren().store.count(i).then(function(o) {
      w(r, "ln-stat:set-count", { count: o });
    });
  }, m.prototype._refreshAll = function() {
    const n = this, r = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let t = 0; t < r.length; t++) {
      const i = r[t];
      let e, o;
      if (i.hasAttribute("data-ln-table-store") ? (e = i.getAttribute("data-ln-table-store"), o = "table") : i.hasAttribute("data-ln-list-store") ? (e = i.getAttribute("data-ln-list-store"), o = "list") : i.hasAttribute("data-ln-options") ? (e = i.getAttribute("data-ln-options"), o = "options") : i.hasAttribute("data-ln-stat") && (e = i.getAttribute("data-ln-stat"), o = "stat"), !this._ownsStore(e)) continue;
      const u = this.findChildren().store;
      if (o === "table" || o === "list") {
        const l = n._boundQueries.get(i) || { sort: null, filters: {}, search: "" };
        (function(s, d) {
          u.getAll(l).then(function(g) {
            const c = { data: g.data, total: g.total, filtered: g.filtered };
            w(s, "ln-" + d + ":set-data", c), n._boundDelivered.set(s, !0);
          });
        })(i, o);
      } else if (o === "options")
        (function(l) {
          u.getAll({}).then(function(s) {
            w(l, "ln-options:set-data", { data: s.data });
          });
        })(i);
      else if (o === "stat") {
        const l = i.getAttribute("data-ln-stat-filter");
        let s = null;
        if (l) {
          const d = l.indexOf(":");
          if (d !== -1) {
            const g = l.slice(0, d), c = l.slice(d + 1);
            s = {}, s[g] = [c];
          }
        }
        (function(d, g) {
          u.count(g).then(function(c) {
            w(d, "ln-stat:set-count", { count: c });
          });
        })(i, s);
      }
    }
  }, m.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const n = this;
    n._handlers && (n.dom.removeEventListener("ln-store:request-remote-sync", n._handlers.sync), n.dom.removeEventListener("ln-store:request-remote-create", n._handlers.create), n.dom.removeEventListener("ln-store:request-remote-update", n._handlers.update), n.dom.removeEventListener("ln-store:request-remote-delete", n._handlers.delete), n.dom.removeEventListener("ln-store:request-remote-bulk-delete", n._handlers.bulkDelete), document.removeEventListener("ln-table:request-data", n._handlers.reqTableData), document.removeEventListener("ln-list:request-data", n._handlers.reqListData), document.removeEventListener("ln-options:request-data", n._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.removeEventListener("ln-store:ready", n._handlers.refresh), n.dom.removeEventListener("ln-store:loaded", n._handlers.refresh), n.dom.removeEventListener("ln-store:created", n._handlers.refresh), n.dom.removeEventListener("ln-store:updated", n._handlers.refresh), n.dom.removeEventListener("ln-store:deleted", n._handlers.refresh), n.dom.removeEventListener("ln-store:synced", n._handlers.refreshSynced), n._handlers = null), n._boundQueries = null, n._boundDelivered = null, delete this.dom[a], delete this.dom[b];
  };
  function f(n, r) {
    const t = n[a];
    t && r === "data-ln-data-mapper" && t.refreshMapper();
  }
  F(h, a, m, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-options", a = "lnOptions";
  if (window[a] !== void 0) return;
  function b(m) {
    this.dom = m, this._storeName = m.getAttribute(h), this._valueField = m.getAttribute("data-ln-options-value") || "id", this._labelField = m.getAttribute("data-ln-options-label") || "name";
    const p = this;
    return this._onSetData = function(f) {
      p._rebuild(f.detail.data || []);
    }, m.addEventListener("ln-options:set-data", this._onSetData), w(m, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(m) {
    const p = this.dom, f = this._valueField, n = this._labelField, r = p.value, t = p.querySelectorAll("option");
    for (let e = t.length - 1; e >= 0; e--)
      t[e].value !== "" && p.removeChild(t[e]);
    for (let e = 0; e < m.length; e++) {
      const o = m[e], u = document.createElement("option");
      u.value = String(o[f]), u.textContent = o[n] != null ? o[n] : "", p.appendChild(u);
    }
    const i = p.options;
    for (let e = 0; e < i.length; e++)
      if (i[e].value === r) {
        p.value = r;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[a]);
  }, F(h, a, b, "ln-options");
})();
(function() {
  const h = "data-ln-stat", a = "lnStat";
  if (window[a] !== void 0) return;
  function b(p) {
    if (!p) return null;
    const f = p.indexOf(":");
    if (f === -1) return null;
    const n = p.slice(0, f), r = p.slice(f + 1), t = {};
    return t[n] = [r], t;
  }
  function m(p) {
    return this.dom = p, this._storeName = p.getAttribute(h), this._filters = b(p.getAttribute("data-ln-stat-filter")), this._onSetCount = function(f) {
      p.textContent = String(f.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), w(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  m.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[a]);
  }, F(h, a, m, "ln-stat");
})();
(function() {
  const h = "data-ln-store-notify", a = "lnStoreNotify";
  if (window[a] !== void 0) return;
  function b(p, f, n) {
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: p, title: f, message: n }
    }));
  }
  function m(p) {
    this.dom = p, this._savedTitle = p.getAttribute("data-ln-store-notify-saved") || null, this._deletedTitle = p.getAttribute("data-ln-store-notify-deleted") || null, this._failedTitle = p.getAttribute("data-ln-store-notify-failed") || null;
    const f = this;
    return this._onConfirmed = function(n) {
      const r = n.detail || {}, t = r.action || "confirmed";
      let i, e;
      if (t === "create" || t === "update")
        i = f._savedTitle || t, e = r.record && r.record.name ? r.record.name : void 0;
      else if (t === "delete")
        i = f._deletedTitle || t, e = void 0;
      else if (t === "bulk-delete") {
        i = f._deletedTitle || t;
        const o = r.ids ? r.ids.length : 0;
        e = o ? String(o) : void 0;
      } else
        i = f._savedTitle || t, e = void 0;
      b("success", i, e);
    }, this._onReverted = function(n) {
      const r = n.detail || {}, t = r.action || "reverted", i = f._failedTitle || t, e = r.error ? String(r.error) : void 0;
      b("error", i, e);
    }, p.addEventListener("ln-store:confirmed", this._onConfirmed), p.addEventListener("ln-store:reverted", this._onReverted), this;
  }
  m.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-store:confirmed", this._onConfirmed), this.dom.removeEventListener("ln-store:reverted", this._onReverted), delete this.dom[a]);
  }, F(h, a, m, "ln-store-notify");
})();
(function() {
  const h = "ln-icons-sprite", a = "#ln-", b = "#lnc-", m = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let f = null;
  const n = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), r = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", i = "lni:v", e = "1";
  function o() {
    try {
      if (localStorage.getItem(i) !== e) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const v = localStorage.key(_);
          v && v.indexOf(t) === 0 && localStorage.removeItem(v);
        }
        localStorage.setItem(i, e);
      }
    } catch {
    }
  }
  o();
  function u() {
    return f || (f = document.getElementById(h), f || (f = document.createElementNS("http://www.w3.org/2000/svg", "svg"), f.id = h, f.setAttribute("hidden", ""), f.setAttribute("aria-hidden", "true"), f.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(f, document.body.firstChild))), f;
  }
  function l(_) {
    return _.indexOf(b) === 0 ? r + "/" + _.slice(b.length) + ".svg" : n + "/" + _.slice(a.length) + ".svg";
  }
  function s(_, v) {
    const E = v.match(/viewBox="([^"]+)"/), S = E ? E[1] : "0 0 24 24", A = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = A ? A[1].trim() : "", D = v.match(/<svg([^>]*)>/i), x = D ? D[1] : "", O = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    O.id = _, O.setAttribute("viewBox", S), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const B = x.match(new RegExp(I + '="([^"]*)"'));
      B && O.setAttribute(I, B[1]);
    }), O.innerHTML = T, u().querySelector("defs").appendChild(O);
  }
  function d(_) {
    if (m.has(_) || p.has(_) || _.indexOf(b) === 0 && !r) return;
    const v = _.slice(1);
    try {
      const E = localStorage.getItem(t + v);
      if (E) {
        s(v, E), m.add(_);
        return;
      }
    } catch {
    }
    p.add(_), fetch(l(_)).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      s(v, E), m.add(_), p.delete(_);
      try {
        localStorage.setItem(t + v, E);
      } catch {
      }
    }).catch(function() {
      p.delete(_);
    });
  }
  function g(_) {
    const v = 'use[href^="' + a + '"], use[href^="' + b + '"]', E = _.querySelectorAll ? _.querySelectorAll(v) : [];
    if (_.matches && _.matches(v)) {
      const S = _.getAttribute("href");
      S && d(S);
    }
    Array.prototype.forEach.call(E, function(S) {
      const A = S.getAttribute("href");
      A && d(A);
    });
  }
  function c() {
    g(document), new MutationObserver(function(_) {
      _.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(E) {
            E.nodeType === 1 && g(E);
          });
        else if (v.type === "attributes" && v.attributeName === "href") {
          const E = v.target.getAttribute("href");
          E && (E.indexOf(a) === 0 || E.indexOf(b) === 0) && d(E);
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
  const h = "data-ln-debug", a = "lnDebug";
  if (window[a] !== void 0) return;
  function b(m) {
    return this.dom = m, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[a];
  }, F(h, a, b, "ln-debug");
})();
