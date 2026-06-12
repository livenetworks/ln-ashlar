if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...a) {
    typeof a[0] == "string" && (a[0].startsWith("[ln-") || a[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, a);
  };
}
const Tt = {};
function yt(h, a) {
  Tt[h] || (Tt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const v = Tt[h];
  return v ? v.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + h + '" not found'), null);
}
function w(h, a, v) {
  h.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: v || {}
  }));
}
function V(h, a, v) {
  const f = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: v || {}
  });
  return h.dispatchEvent(f), f;
}
function Ut(h, a, v) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const f = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  f[v] = h.name, w(h.dom, a, f);
}
function J(h, a) {
  if (!h || !a) return h;
  const v = h.querySelectorAll("[data-ln-field]");
  for (let e = 0; e < v.length; e++) {
    const r = v[e], t = r.getAttribute("data-ln-field");
    a[t] != null && (r.textContent = a[t]);
  }
  const f = h.querySelectorAll("[data-ln-attr]");
  for (let e = 0; e < f.length; e++) {
    const r = f[e], t = r.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < t.length; o++) {
      const n = t[o].trim().split(":");
      if (n.length !== 2) continue;
      const i = n[0].trim(), u = n[1].trim();
      a[u] != null && r.setAttribute(i, a[u]);
    }
  }
  const g = h.querySelectorAll("[data-ln-show]");
  for (let e = 0; e < g.length; e++) {
    const r = g[e], t = r.getAttribute("data-ln-show");
    t in a && r.classList.toggle("hidden", !a[t]);
  }
  const _ = h.querySelectorAll("[data-ln-class]");
  for (let e = 0; e < _.length; e++) {
    const r = _[e], t = r.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < t.length; o++) {
      const n = t[o].trim().split(":");
      if (n.length !== 2) continue;
      const i = n[0].trim(), u = n[1].trim();
      u in a && r.classList.toggle(i, !!a[u]);
    }
  }
  return h;
}
function _t(h, a) {
  if (!h || !a) return h;
  const v = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; v.nextNode(); ) {
    const f = v.currentNode;
    f.textContent.indexOf("{{") !== -1 && (f.textContent = f.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(g, _) {
        return a[_] !== void 0 ? a[_] : "";
      }
    ));
  }
  return h;
}
function ie(h, a, v, f, g, _) {
  const e = {};
  for (let t = 0; t < h.children.length; t++) {
    const o = h.children[t], n = o.getAttribute("data-ln-key");
    n && (e[n] = o);
  }
  const r = document.createDocumentFragment();
  for (let t = 0; t < a.length; t++) {
    const o = a[t], n = String(f(o));
    let i = e[n];
    if (i)
      g(i, o, t);
    else {
      const u = yt(v, _);
      if (!u || (_t(u, o), i = u.firstElementChild, !i)) continue;
      i.setAttribute("data-ln-key", n), g(i, o, t);
    }
    r.appendChild(i);
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
function tt(h, a, v) {
  if (h) {
    const f = h.querySelector('[data-ln-template="' + a + '"]');
    if (f) return f.content.cloneNode(!0);
  }
  return yt(a, v);
}
function oe(h, a) {
  const v = {}, f = h.querySelectorAll("[" + a + "]");
  for (let g = 0; g < f.length; g++)
    v[f[g].getAttribute(a)] = f[g].textContent, f[g].remove();
  return v;
}
function kt(h, a, v, f) {
  if (h.nodeType !== 1) return;
  const _ = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", e = Array.from(h.querySelectorAll(_));
  h.matches && h.matches(_) && e.push(h);
  for (const r of e)
    r[v] || (r[v] = new f(r));
}
function gt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function jt(h, a) {
  const v = !!(a && a.typed), f = {}, g = h.elements, _ = {};
  if (v)
    for (let e = 0; e < g.length; e++) {
      const r = g[e];
      r.name && r.type === "checkbox" && !r.disabled && (_[r.name] = (_[r.name] || 0) + 1);
    }
  for (let e = 0; e < g.length; e++) {
    const r = g[e];
    if (!(!r.name || r.disabled || r.type === "file" || r.type === "submit" || r.type === "button"))
      if (r.type === "checkbox")
        v && _[r.name] === 1 ? f[r.name] = r.checked : (f[r.name] || (f[r.name] = []), r.checked && f[r.name].push(r.value));
      else if (r.type === "radio")
        r.checked && (f[r.name] = r.value);
      else if (r.type === "select-multiple") {
        f[r.name] = [];
        for (let t = 0; t < r.options.length; t++)
          r.options[t].selected && f[r.name].push(r.options[t].value);
      } else if (v && r.type === "hidden")
        f[r.name] = r.value;
      else if (v && (r.type === "number" || r.type === "range")) {
        const t = Number(r.value);
        f[r.name] = r.value === "" || isNaN(t) ? null : t;
      } else
        f[r.name] = r.value;
  }
  return f;
}
function zt(h, a) {
  const v = h.elements, f = [];
  for (let g = 0; g < v.length; g++) {
    const _ = v[g];
    if (!_.name || !(_.name in a) || _.type === "file" || _.type === "submit" || _.type === "button") continue;
    const e = a[_.name];
    if (_.type === "checkbox")
      _.checked = Array.isArray(e) ? e.indexOf(_.value) !== -1 : !!e, f.push(_);
    else if (_.type === "radio")
      _.checked = _.value === String(e), f.push(_);
    else if (_.type === "select-multiple") {
      if (Array.isArray(e))
        for (let r = 0; r < _.options.length; r++)
          _.options[r].selected = e.indexOf(_.options[r].value) !== -1;
      f.push(_);
    } else
      _.value = e, f.push(_);
  }
  return f;
}
function Z(h) {
  const a = h ? h.closest("[lang]") : null;
  return (a ? a.lang : null) || (document.documentElement ? document.documentElement.lang : null) || navigator.language;
}
function Ft(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function Vt(h, a, { get: v, set: f }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return v ? v.call(this) : a.get.call(this);
    },
    set: function(g) {
      f ? f.call(this, g, (_) => a.set.call(this, _)) : a.set.call(this, g);
    },
    configurable: !0
  });
}
function B(h, a, v, f, g = {}) {
  const _ = g.extraAttributes || [], e = g.onAttributeChange || null, r = g.onInit || null;
  function t(o) {
    const n = o || document.body;
    kt(n, h, a, v), r && r(n);
  }
  return G(function() {
    const o = new MutationObserver(function(i) {
      for (let u = 0; u < i.length; u++) {
        const l = i[u];
        if (l.type === "childList") {
          for (let s = 0; s < l.addedNodes.length; s++) {
            const c = l.addedNodes[s];
            c.nodeType === 1 && (kt(c, h, a, v), r && r(c));
          }
          for (let s = 0; s < l.removedNodes.length; s++) {
            const c = l.removedNodes[s];
            if (c.nodeType === 1) {
              const d = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", m = Array.from(c.querySelectorAll(d));
              c.matches && c.matches(d) && m.push(c);
              for (let b = 0; b < m.length; b++) {
                const E = m[b];
                if (!document.contains(E)) {
                  const A = E[a];
                  A && typeof A.destroy == "function" && A.destroy();
                }
              }
            }
          }
        } else l.type === "attributes" && (e && l.target[a] ? e(l.target, l.attributeName) : (kt(l.target, h, a, v), r && r(l.target)));
      }
    });
    let n = [];
    if (h.indexOf("[") !== -1) {
      const i = /\[([\w-]+)/g;
      let u;
      for (; (u = i.exec(h)) !== null; )
        n.push(u[1]);
    } else
      n.push(h);
    o.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: n.concat(_)
    });
  }, f || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[a] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function Kt(h, a) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !a) return !1;
  const v = a.getAttribute("href");
  return !(!v || a.getAttribute("target") === "_blank" || a.hasAttribute("download") || v.startsWith("mailto:") || v.startsWith("tel:") || v === "#" || v.startsWith("#") || a.hostname && a.hostname !== window.location.hostname);
}
function K(...h) {
  return h.filter((a) => a != null && a !== "").map((a, v) => v === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function W(h, a) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, a ? { Authorization: a } : null);
}
function Wt(h, a = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (v) {
    return console.error(`[${a}] Invalid headers JSON:`, v), {};
  }
}
const Gt = {};
function re(h, a) {
  Gt[h] = a;
}
function se(h) {
  return Gt[h] || { ingress: (a) => a, egress: (a) => a };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = re, window.lnCore.getDataMapper = se, window.lnCore.fillTemplate = _t, window.lnCore.fill = J, window.lnCore.renderList = ie);
function le(h, a) {
  let v = !1;
  return function() {
    v || (v = !0, queueMicrotask(function() {
      v = !1, h(), a && a();
    }));
  };
}
const ae = "ln:";
function ce() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function $t(h, a) {
  const v = a.getAttribute("data-ln-persist"), f = v !== null && v !== "" ? v : a.id;
  return f ? ae + h + ":" + ce() + ":" + f : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function At(h, a) {
  const v = $t(h, a);
  if (!v) return null;
  try {
    const f = localStorage.getItem(v);
    return f !== null ? JSON.parse(f) : null;
  } catch {
    return null;
  }
}
function lt(h, a, v) {
  const f = $t(h, a);
  if (f)
    try {
      localStorage.setItem(f, JSON.stringify(v));
    } catch {
    }
}
function Et(h, a, v, f) {
  const g = typeof f == "number" ? f : 4, _ = window.innerWidth, e = window.innerHeight, r = a.width, t = a.height, o = (v || "bottom").split("-"), n = o[0], i = o[1] === "start" || o[1] === "end" ? o[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, l = u[n] || u.bottom;
  function s(b) {
    return b === "top" || b === "bottom" ? i === "start" ? h.left : i === "end" ? h.right - r : h.left + (h.width - r) / 2 : i === "start" ? h.top : i === "end" ? h.bottom - t : h.top + (h.height - t) / 2;
  }
  function c(b) {
    let E, A, S = !0;
    return b === "top" ? (E = h.top - g - t, A = s(b), E < 0 && (S = !1)) : b === "bottom" ? (E = h.bottom + g, A = s(b), E + t > e && (S = !1)) : b === "left" ? (E = s(b), A = h.left - g - r, A < 0 && (S = !1)) : (E = s(b), A = h.right + g, A + r > _ && (S = !1)), { top: E, left: A, side: b, fits: S };
  }
  let p = null;
  for (let b = 0; b < l.length; b++) {
    const E = c(l[b]);
    if (E.fits) {
      p = E;
      break;
    }
  }
  p || (p = c(l[0]));
  let d = p.top, m = p.left;
  return r >= _ ? m = 0 : (m < 0 && (m = 0), m + r > _ && (m = _ - r)), t >= e ? d = 0 : (d < 0 && (d = 0), d + t > e && (d = e - t)), { top: d, left: m, placement: p.side };
}
function Yt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const a = h.parentNode, v = document.createComment("ln-teleport");
  return a.insertBefore(v, h), document.body.appendChild(h), function() {
    v.parentNode && (v.parentNode.insertBefore(h, v), v.parentNode.removeChild(v));
  };
}
function Dt(h) {
  if (!h) return { width: 0, height: 0 };
  const a = h.style, v = a.visibility, f = a.display, g = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const _ = h.offsetWidth, e = h.offsetHeight;
  return a.visibility = v, a.display = f, a.position = g, { width: _, height: e };
}
let st = null;
async function Bt(h) {
  if (!h) {
    st = null;
    return;
  }
  try {
    const a = new TextEncoder(), v = await crypto.subtle.digest("SHA-256", a.encode(h));
    st = await crypto.subtle.importKey(
      "raw",
      v,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (a) {
    console.error("[ln-core/crypto] Key derivation failed:", a), st = null;
  }
}
function mt() {
  return st;
}
async function de(h, a = st) {
  const v = a || st;
  if (!v || h === void 0 || h === null) return h;
  try {
    const f = new TextEncoder(), g = crypto.getRandomValues(new Uint8Array(12)), _ = typeof h == "string" ? h : JSON.stringify(h), e = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: g },
      v,
      f.encode(_)
    ), r = btoa(String.fromCharCode(...g)), t = btoa(String.fromCharCode(...new Uint8Array(e)));
    return {
      encrypted: !0,
      iv: r,
      data: t
    };
  } catch (f) {
    return console.error("[ln-core/crypto] Encryption failed:", f), h;
  }
}
async function ue(h, a = st) {
  const v = a || st;
  if (!h || !h.encrypted || !v) return h;
  try {
    const f = new TextDecoder(), g = Uint8Array.from(atob(h.iv), (t) => t.charCodeAt(0)), _ = Uint8Array.from(atob(h.data), (t) => t.charCodeAt(0)), e = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: g },
      v,
      _
    ), r = f.decode(e);
    try {
      return JSON.parse(r);
    } catch {
      return r;
    }
  } catch (f) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", f), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  function f(o) {
    return typeof o == "string" ? o : o instanceof URL ? o.href : o instanceof Request ? o.url : String(o);
  }
  function g(o, n) {
    return n && n.method ? String(n.method).toUpperCase() : o instanceof Request ? o.method.toUpperCase() : "GET";
  }
  function _(o, n) {
    return n + " " + o;
  }
  function e(o) {
    return o === "GET" || o === "HEAD";
  }
  function r(o, n) {
    n = n || {};
    const i = f(o), u = g(o, n), l = _(i, u);
    e(u) && a.has(l) && (a.get(l).abort(), a.delete(l));
    const s = new AbortController(), c = n.signal;
    c && (c.aborted ? s.abort(c.reason) : c.addEventListener("abort", function() {
      s.abort(c.reason);
    }, { once: !0 }));
    const p = Object.assign({}, n, { signal: s.signal });
    return a.set(l, s), h(o, p).finally(function() {
      a.get(l) === s && a.delete(l);
    });
  }
  r.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = r;
  function t(o) {
    const n = o.detail || {};
    if (!n.url) return;
    const i = o.target, u = (n.method || (n.body ? "POST" : "GET")).toUpperCase(), l = n.key;
    l && v.has(l) && (v.get(l).abort(), v.delete(l));
    const s = new AbortController(), c = n.signal;
    c && (c.aborted ? s.abort(c.reason) : c.addEventListener("abort", function() {
      s.abort(c.reason);
    }, { once: !0 })), l && v.set(l, s);
    const p = { method: u, signal: s.signal };
    n.body !== void 0 && (p.body = n.body), window.fetch(n.url, p).then(function(d) {
      l && v.get(l) === s && v.delete(l), w(i, "ln-http:response", {
        ok: d.ok,
        status: d.status,
        response: d
      });
    }).catch(function(d) {
      l && v.get(l) === s && v.delete(l), !(d && d.name === "AbortError") && w(i, "ln-http:error", {
        ok: !1,
        status: 0,
        error: d
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(o) {
      let n = !1;
      return a.forEach(function(i, u) {
        u.endsWith(" " + o) && (i.abort(), a.delete(u), n = !0);
      }), n;
    },
    cancelByKey: function(o) {
      return v.has(o) ? (v.get(o).abort(), v.delete(o), !0) : !1;
    },
    cancelAll: function() {
      a.forEach(function(o) {
        o.abort();
      }), a.clear(), v.forEach(function(o) {
        o.abort();
      }), v.clear();
    },
    get inflight() {
      const o = [];
      return a.forEach(function(n, i) {
        const u = i.indexOf(" ");
        o.push({ method: i.slice(0, u), url: i.slice(u + 1) });
      }), v.forEach(function(n, i) {
        o.push({ key: i });
      }), o;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", t), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", a = "lnAjax";
  if (window[a] !== void 0) return;
  function v(n) {
    if (!n.hasAttribute(h) || n[a]) return;
    n[a] = !0;
    const i = r(n);
    f(i.links), g(i.forms);
  }
  function f(n) {
    for (const i of n) {
      if (i[a + "Trigger"] || i.hostname && i.hostname !== window.location.hostname) continue;
      const u = i.getAttribute("href");
      if (u && u.includes("#")) continue;
      const l = function(s) {
        if (!Kt(s, i)) return;
        s.preventDefault();
        const c = i.getAttribute("href");
        c && e("GET", c, null, i);
      };
      i.addEventListener("click", l), i[a + "Trigger"] = l;
    }
  }
  function g(n) {
    for (const i of n) {
      if (i[a + "Trigger"]) continue;
      const u = function(l) {
        l.preventDefault();
        const s = i.method.toUpperCase(), c = i.action, p = new FormData(i);
        for (const d of i.querySelectorAll('button, input[type="submit"]'))
          d.disabled = !0;
        e(s, c, p, i, function() {
          for (const d of i.querySelectorAll('button, input[type="submit"]'))
            d.disabled = !1;
        });
      };
      i.addEventListener("submit", u), i[a + "Trigger"] = u;
    }
  }
  function _(n) {
    if (!n[a]) return;
    const i = r(n);
    for (const u of i.links)
      u[a + "Trigger"] && (u.removeEventListener("click", u[a + "Trigger"]), delete u[a + "Trigger"]);
    for (const u of i.forms)
      u[a + "Trigger"] && (u.removeEventListener("submit", u[a + "Trigger"]), delete u[a + "Trigger"]);
    delete n[a];
  }
  function e(n, i, u, l, s) {
    if (V(l, "ln-ajax:before-start", { method: n, url: i }).defaultPrevented) return;
    w(l, "ln-ajax:start", { method: n, url: i }), l.classList.add("ln-ajax--loading");
    const p = document.createElement("span");
    p.className = "ln-ajax-spinner", l.appendChild(p);
    function d() {
      l.classList.remove("ln-ajax--loading");
      const S = l.querySelector(".ln-ajax-spinner");
      S && S.remove(), s && s();
    }
    let m = i;
    const b = document.querySelector('meta[name="csrf-token"]'), E = b ? b.getAttribute("content") : null;
    u instanceof FormData && E && u.append("_token", E);
    const A = {
      method: n,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (A.headers["X-CSRF-TOKEN"] = E), n === "GET" && u) {
      const S = new URLSearchParams(u);
      m = i + (i.includes("?") ? "&" : "?") + S.toString();
    } else n !== "GET" && u && (A.body = u);
    fetch(m, A).then(function(S) {
      const C = S.ok;
      return S.json().then(function(T) {
        return { ok: C, status: S.status, data: T };
      });
    }).then(function(S) {
      const C = S.data;
      if (S.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const T in C.content) {
            const x = document.getElementById(T);
            if (x) {
              let O = C.content[T];
              window.DOMPurify && typeof window.DOMPurify.sanitize == "function" ? O = window.DOMPurify.sanitize(O) : O = O.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""), x.innerHTML = O;
            }
          }
        if (l.tagName === "A") {
          const T = l.getAttribute("href");
          T && window.history.pushState({ ajax: !0 }, "", T);
        } else l.tagName === "FORM" && l.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", m);
        w(l, "ln-ajax:success", { method: n, url: m, data: C });
      } else
        w(l, "ln-ajax:error", { method: n, url: m, status: S.status, data: C });
      if (C.message) {
        const T = C.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: T.type || (S.ok ? "success" : "error"),
            title: T.title || "",
            message: T.body || ""
          }
        }));
      }
      w(l, "ln-ajax:complete", { method: n, url: m }), d();
    }).catch(function(S) {
      w(l, "ln-ajax:error", { method: n, url: m, error: S }), w(l, "ln-ajax:complete", { method: n, url: m }), d();
    });
  }
  function r(n) {
    const i = { links: [], forms: [] };
    return n.tagName === "A" && n.getAttribute(h) !== "false" ? i.links.push(n) : n.tagName === "FORM" && n.getAttribute(h) !== "false" ? i.forms.push(n) : (i.links = Array.from(n.querySelectorAll('a:not([data-ln-ajax="false"])')), i.forms = Array.from(n.querySelectorAll('form:not([data-ln-ajax="false"])'))), i;
  }
  function t() {
    G(function() {
      new MutationObserver(function(i) {
        for (const u of i)
          if (u.type === "childList") {
            for (const l of u.addedNodes)
              if (l.nodeType === 1 && (v(l), !l.hasAttribute(h))) {
                for (const c of l.querySelectorAll("[" + h + "]"))
                  v(c);
                const s = l.closest && l.closest("[" + h + "]");
                if (s && s.getAttribute(h) !== "false") {
                  const c = r(l);
                  f(c.links), g(c.forms);
                }
              }
          } else u.type === "attributes" && v(u.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function o() {
    for (const n of document.querySelectorAll("[" + h + "]"))
      v(n);
  }
  window[a] = v, window[a].destroy = _, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
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
      params: Xt,
      query: Qt,
      route: xt
    } : null;
  }
}, Rt = "data-ln-route", Jt = "lnRoute";
typeof window < "u" && (window.lnRouter = he);
const ct = /* @__PURE__ */ new Map();
let qt = [], Pt = !1, Ot = null, Xt = {}, Qt = {}, xt = null, It = !1;
function Zt(h, a, v) {
  It ? queueMicrotask(function() {
    w(h, a, v);
  }) : w(h, a, v);
}
function St(h) {
  let [a] = h.split("#"), [v, f] = a.split("?");
  const g = {};
  if (f) {
    const _ = new URLSearchParams(f);
    for (const [e, r] of _.entries())
      g[e] = r;
  }
  return v = v.replace(/\/+$/, ""), v === "" && (v = "/"), { path: v, query: g };
}
function te(h, a) {
  if (h.pattern === "*") return 1;
  if (a.pattern === "*") return -1;
  const v = h.segments, f = a.segments, g = Math.max(v.length, f.length);
  for (let _ = 0; _ < g; _++) {
    const e = v[_], r = f[_];
    if (e === void 0) return 1;
    if (r === void 0) return -1;
    if (e === "*") return 1;
    if (r === "*") return -1;
    const t = e.startsWith(":"), o = r.startsWith(":");
    if (t && !o) return 1;
    if (!t && o) return -1;
  }
  return 0;
}
function wt(h) {
  const a = h.split("/").filter(Boolean);
  for (const v of qt) {
    if (v.pattern === "*")
      return {
        route: v,
        params: { wildcard: h }
      };
    const f = v.segments, g = {};
    let _ = !0;
    if (!(a.length > f.length && f[f.length - 1] !== "*")) {
      for (let e = 0; e < f.length; e++) {
        const r = f[e], t = a[e];
        if (r === "*") {
          g.wildcard = a.slice(e).join("/");
          break;
        }
        if (t === void 0) {
          _ = !1;
          break;
        }
        if (r.startsWith(":"))
          g[r.slice(1)] = decodeURIComponent(t);
        else if (r !== t) {
          _ = !1;
          break;
        }
      }
      if (_ && (f.indexOf("*") !== -1 || a.length <= f.length))
        return { route: v, params: g };
    }
  }
  return null;
}
function Mt(h) {
  if (h.target) {
    const v = document.getElementById(h.target);
    return v || console.warn(`[ln-router] Explicit target element #${h.target} not found in DOM`), v;
  }
  const a = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return a || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), a;
}
function fe(h) {
  if (!h) return;
  const a = Array.from(h.querySelectorAll("*")), v = [h].concat(a);
  for (const g of v)
    for (const _ of Object.keys(g))
      if (_.startsWith("ln") && g[_] && typeof g[_].destroy == "function")
        try {
          g[_].destroy();
        } catch (e) {
          console.error(`[ln-router] Error destroying component ${_} on element:`, g, e);
        }
  const f = document.querySelectorAll('[data-ln-popover="open"]');
  for (const g of f) {
    const _ = g.lnPopover;
    if (_ && _.trigger && h.contains(_.trigger))
      try {
        _.destroy();
      } catch (e) {
        console.error("[ln-router] Error destroying open teleported popover:", e);
      }
  }
}
function Lt(h, a, v, f, g = {}) {
  const _ = Mt(h);
  if (!_ || V(_, "ln-router:before-navigate", {
    from: Ot,
    to: f,
    params: a,
    query: v
  }).defaultPrevented)
    return;
  g.historyAction === "push" ? window.history.pushState(null, "", f) : g.historyAction === "replace" && window.history.replaceState(null, "", f);
  const o = () => {
    if (g.isHydration || fe(_), !g.isHydration) {
      const n = h.templateNode.content.cloneNode(!0);
      _.replaceChildren(n);
    }
    if (h.title && (document.title = h.title), !g.isHydration) {
      _.hasAttribute("tabindex") || _.setAttribute("tabindex", "-1");
      const n = _.querySelector("h1, h2, h3, h4, h5, h6");
      n ? (n.setAttribute("tabindex", "-1"), n.focus()) : _.focus(), _.scrollIntoView({ block: "start", behavior: "instant" });
    }
    Ot = f, Xt = a, Qt = v, xt = h, Zt(_, "ln-router:navigated", {
      path: f,
      params: a,
      query: v,
      route: h,
      target: _
    });
  };
  document.startViewTransition && !g.isHydration ? document.startViewTransition(o) : o();
}
function Ht(h, a = {}) {
  const { path: v, query: f } = St(h), g = wt(v);
  g ? Lt(g.route, g.params, f, h, a) : w(document.body, "ln-router:not-found", { path: v });
}
function pe(h) {
  const a = h.target.closest("a");
  if (!a || !Kt(h, a)) return;
  const v = a.getAttribute("href"), { path: f, query: g } = St(v), _ = wt(f);
  _ && (h.preventDefault(), Lt(_.route, _.params, g, v, { historyAction: "push" }));
}
function me() {
  const h = window.location.pathname + window.location.search, { path: a, query: v } = St(h), f = wt(a);
  f ? Lt(f.route, f.params, v, h, { historyAction: "skip" }) : w(document.body, "ln-router:not-found", { path: a });
}
function ge() {
  Pt || (Pt = !0, G(function() {
    document.addEventListener("click", pe), window.addEventListener("popstate", me), It = !0;
    const h = window.location.pathname + window.location.search, { path: a, query: v } = St(h), f = wt(a);
    if (f) {
      const g = Mt(f.route), _ = g && g.hasAttribute("data-ln-router-hydrate") && g.children.length > 0;
      Lt(f.route, f.params, v, h, {
        historyAction: "replace",
        isHydration: _
      });
    } else
      Zt(document.body, "ln-router:not-found", { path: a });
    It = !1;
  }, "ln-router"));
}
function _e(h) {
  const a = h.getAttribute(Rt);
  if (!a) return;
  if (ct.has(a)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${a}"`);
    return;
  }
  const v = h.getAttribute("data-ln-route-target"), f = h.getAttribute("data-ln-route-title"), g = a.split("/").filter(Boolean), _ = {
    pattern: a,
    segments: g,
    target: v,
    title: f,
    templateNode: h
  }, e = Mt(_);
  e && e.contains(h) && console.warn(`[ln-router] Route template with pattern "${a}" is declared inside its own outlet element:`, h), ct.set(a, _), qt = Array.from(ct.values()).sort(te), ge();
}
function be(h) {
  const a = h.getAttribute(Rt);
  a && ct.has(a) && (ct.delete(a), qt = Array.from(ct.values()).sort(te));
}
function ee(h) {
  return this.dom = h, _e(h), this;
}
ee.prototype.destroy = function() {
  be(this.dom), delete this.dom[Jt];
};
B(Rt, Jt, ee, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"]
});
(function() {
  const h = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function v(e) {
    const r = Array.from(e.querySelectorAll("[data-ln-modal-for]"));
    e.hasAttribute && e.hasAttribute("data-ln-modal-for") && r.push(e);
    for (const t of r) {
      if (t[a + "Trigger"]) continue;
      const o = function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        n.preventDefault();
        const i = t.getAttribute("data-ln-modal-for"), u = document.getElementById(i);
        if (!u) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + i + '"');
          return;
        }
        if (!u[a]) return;
        const l = u.getAttribute(h);
        u.setAttribute(h, l === "open" ? "close" : "open");
      };
      t.addEventListener("click", o), t[a + "Trigger"] = o;
    }
  }
  function f(e) {
    this.dom = e, this.isOpen = e.getAttribute(h) === "open";
    const r = this;
    return this._onEscape = function(t) {
      t.key === "Escape" && r.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(t) {
      if (t.key !== "Tab") return;
      const o = Array.prototype.filter.call(
        r.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        gt
      );
      if (o.length === 0) return;
      const n = o[0], i = o[o.length - 1];
      t.shiftKey ? document.activeElement === n && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), n.focus());
    }, this._onClose = function(t) {
      t.preventDefault(), r.dom.setAttribute(h, "close");
    }, _(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  f.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const e = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of e)
      t[a + "Close"] && (t.removeEventListener("click", t[a + "Close"]), delete t[a + "Close"]);
    const r = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const t of r)
      t[a + "Trigger"] && (t.removeEventListener("click", t[a + "Trigger"]), delete t[a + "Trigger"]);
    w(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
  };
  function g(e) {
    const r = e[a];
    if (!r) return;
    const o = e.getAttribute(h) === "open";
    if (o !== r.isOpen)
      if (o) {
        if (V(e, "ln-modal:before-open", { modalId: e.id, target: e }).defaultPrevented) {
          e.setAttribute(h, "close");
          return;
        }
        r.isOpen = !0, e.setAttribute("aria-modal", "true"), e.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", r._onEscape), document.addEventListener("keydown", r._onFocusTrap);
        const i = document.activeElement;
        r._returnFocusEl = i && i !== document.body ? i : null;
        const u = e.querySelector("[autofocus]");
        if (u && gt(u))
          u.focus();
        else {
          const l = e.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), s = Array.prototype.find.call(l, gt);
          if (s) s.focus();
          else {
            const c = e.querySelectorAll("a[href], button:not([disabled])"), p = Array.prototype.find.call(c, gt);
            p && p.focus();
          }
        }
        w(e, "ln-modal:open", { modalId: e.id, target: e });
      } else {
        if (V(e, "ln-modal:before-close", { modalId: e.id, target: e }).defaultPrevented) {
          e.setAttribute(h, "open");
          return;
        }
        r.isOpen = !1, e.removeAttribute("aria-modal"), document.removeEventListener("keydown", r._onEscape), document.removeEventListener("keydown", r._onFocusTrap), w(e, "ln-modal:close", { modalId: e.id, target: e }), r._returnFocusEl && document.contains(r._returnFocusEl) && typeof r._returnFocusEl.focus == "function" && r._returnFocusEl.focus(), r._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function _(e) {
    const r = e.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of r)
      t[a + "Close"] || (t.addEventListener("click", e._onClose), t[a + "Close"] = e._onClose);
  }
  B(h, a, f, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: g,
    onInit: v
  });
})();
(function() {
  const h = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const v = {}, f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(t) {
    if (!v[t]) {
      const o = new Intl.NumberFormat(t, { useGrouping: !0 }), n = o.formatToParts(1234.5);
      let i = "", u = ".";
      for (let l = 0; l < n.length; l++)
        n[l].type === "group" && (i = n[l].value), n[l].type === "decimal" && (u = n[l].value);
      v[t] = { fmt: o, groupSep: i, decimalSep: u };
    }
    return v[t];
  }
  function _(t, o, n) {
    if (n !== null) {
      const i = parseInt(n, 10), u = t + "|d" + i;
      return v[u] || (v[u] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: i })), v[u].format(o);
    }
    return g(t).fmt.format(o);
  }
  function e(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[a]) return t[a];
    t[a] = this, this.dom = t;
    const o = document.createElement("input");
    o.type = "hidden", o.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", o), this._hidden = o;
    const n = this;
    Object.defineProperty(o, "value", {
      get: function() {
        return f.get.call(o);
      },
      set: function(u) {
        if (f.set.call(o, u), u !== "" && !isNaN(parseFloat(u))) {
          const l = parseFloat(u);
          n._displayFormatted(l), w(n.dom, "ln-number:input", { value: l, formatted: n.dom.value }), n.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        } else u === "" && (n.dom.value = "", w(n.dom, "ln-number:input", { value: NaN, formatted: "" }), n.dom.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
    }), Vt(t, f, {
      get: function() {
        return f.get.call(t);
      },
      set: function(u, l) {
        if (n._isFormatting) {
          l(u);
          return;
        }
        if (u === "") {
          l(""), n._setHiddenRaw(""), w(t, "ln-number:input", { value: NaN, formatted: "" }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        let s = typeof u == "number" ? u : parseFloat(String(u).replace(/[^\d.-]/g, ""));
        if (isNaN(s))
          l(String(u)), n._setHiddenRaw(""), w(t, "ln-number:input", { value: NaN, formatted: String(u) }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        else {
          n._setHiddenRaw(s);
          const c = _(Z(t), s, t.getAttribute("data-ln-number-decimals"));
          l(c), w(t, "ln-number:input", { value: s, formatted: c }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    }), this._onInput = function() {
      n._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(u) {
      u.preventDefault();
      const l = (u.clipboardData || window.clipboardData).getData("text"), s = g(Z(t)), c = s.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let p = l.replace(new RegExp("[^0-9\\-" + c + ".]", "g"), "");
      s.groupSep && (p = p.split(s.groupSep).join("")), s.decimalSep !== "." && (p = p.replace(s.decimalSep, "."));
      const d = parseFloat(p);
      isNaN(d) ? (t.value = "", n._hidden.value = "") : n.value = d;
    }, t.addEventListener("paste", this._onPaste);
    const i = t.value;
    if (i !== "") {
      const u = parseFloat(i);
      isNaN(u) || (this._displayFormatted(u), f.set.call(o, String(u)), w(t, "ln-number:input", { value: u, formatted: t.value }), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  e.prototype._handleInput = function() {
    const t = this.dom, o = g(Z(t)), n = t.value;
    if (n === "") {
      this._hidden.value = "", w(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (n === "-") {
      this._hidden.value = "";
      return;
    }
    const i = t.selectionStart;
    let u = 0;
    for (let S = 0; S < i; S++)
      /[0-9]/.test(n[S]) && u++;
    let l = n;
    if (o.groupSep && (l = l.split(o.groupSep).join("")), l = l.replace(o.decimalSep, "."), n.endsWith(o.decimalSep) || n.endsWith(".")) {
      const S = l.replace(/\.$/, ""), C = parseFloat(S);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const s = l.indexOf(".");
    if (s !== -1 && l.slice(s + 1).endsWith("0")) {
      const C = parseFloat(l);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const c = t.getAttribute("data-ln-number-decimals");
    if (c !== null && s !== -1) {
      const S = parseInt(c, 10);
      l.slice(s + 1).length > S && (l = l.slice(0, s + 1 + S));
    }
    const p = parseFloat(l);
    if (isNaN(p)) return;
    const d = t.getAttribute("data-ln-number-min"), m = t.getAttribute("data-ln-number-max");
    if (d !== null && p < parseFloat(d) || m !== null && p > parseFloat(m)) return;
    let b;
    if (c !== null)
      b = _(Z(t), p, c);
    else {
      const S = s !== -1 ? l.slice(s + 1).length : 0;
      if (S > 0) {
        const C = Z(t) + "|u" + S;
        v[C] || (v[C] = new Intl.NumberFormat(Z(t), { useGrouping: !0, minimumFractionDigits: S, maximumFractionDigits: S })), b = v[C].format(p);
      } else
        b = o.fmt.format(p);
    }
    t.value = b;
    let E = u, A = 0;
    for (let S = 0; S < b.length && E > 0; S++)
      A = S + 1, /[0-9]/.test(b[S]) && E--;
    E > 0 && (A = b.length), t.setSelectionRange(A, A), this._setHiddenRaw(p), w(t, "ln-number:input", { value: p, formatted: b });
  }, e.prototype._setHiddenRaw = function(t) {
    f.set.call(this._hidden, String(t));
  }, e.prototype._displayFormatted = function(t) {
    this._isFormatting = !0, this.dom.value = _(Z(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")), this._isFormatting = !1;
  }, Object.defineProperty(e.prototype, "value", {
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
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), w(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function r() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let o = 0; o < t.length; o++) {
        const n = t[o][a];
        n && !isNaN(n.value) && n._displayFormatted(n.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, a, e, "ln-number"), r();
})();
(function() {
  const h = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const v = {}, f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(s, c) {
    const p = s + "|" + JSON.stringify(c);
    return v[p] || (v[p] = new Intl.DateTimeFormat(s, c)), v[p];
  }
  const _ = /^(short|medium|long)(\s+datetime)?$/, e = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function r(s) {
    return !s || s === "" ? { dateStyle: "medium" } : s.match(_) ? e[s] : null;
  }
  function t(s, c, p) {
    const d = s.getDate(), m = s.getMonth(), b = s.getFullYear(), E = s.getHours(), A = s.getMinutes();
    let S, C;
    if (p.startsWith("mk") && !g(p, { month: "long" }).resolvedOptions().locale.startsWith("mk")) {
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
      ], N = [
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
      S = I[m], C = N[m];
    }
    S === void 0 && (S = g(p, { month: "long" }).format(s)), C === void 0 && (C = g(p, { month: "short" }).format(s));
    const T = {
      yyyy: String(b),
      yy: String(b).slice(-2),
      MMMM: S,
      MMM: C,
      MM: String(m + 1).padStart(2, "0"),
      M: String(m + 1),
      dd: String(d).padStart(2, "0"),
      d: String(d),
      HH: String(E).padStart(2, "0"),
      mm: String(A).padStart(2, "0")
    };
    return c.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(x) {
      return T[x];
    });
  }
  function o(s, c, p) {
    const d = r(c);
    if (d) {
      const m = g(p, d), b = m.resolvedOptions().locale;
      return p.startsWith("mk") && !b.startsWith("mk") ? t(s, "dd.MM.yyyy", p) : m.format(s);
    }
    return t(s, c, p);
  }
  function n(s) {
    if (s.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", s.tagName), this;
    if (s[a]) return s[a];
    s[a] = this, this.dom = s;
    const c = this, p = s.value, d = s.name, m = document.createElement("span");
    m.setAttribute("data-ln-date-field", ""), s.parentNode.insertBefore(m, s), m.appendChild(s), this._wrapper = m;
    const b = document.createElement("input");
    b.type = "hidden", b.name = d, s.removeAttribute("name"), s.insertAdjacentElement("afterend", b), this._hidden = b;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", b.insertAdjacentElement("afterend", E), this._picker = E, s.type = "text";
    const A = document.createElement("button");
    if (A.type = "button", A.setAttribute("aria-label", "Open date picker"), A.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', E.insertAdjacentElement("afterend", A), this._btn = A, this._lastISO = "", Object.defineProperty(b, "value", {
      get: function() {
        return f.get.call(b);
      },
      set: function(S) {
        if (f.set.call(b, S), S && S !== "") {
          const C = i(S);
          C && (c._displayFormatted(C), f.set.call(E, S), c._lastISO = S, w(c.dom, "ln-date:change", {
            value: S,
            formatted: c.dom.value,
            date: C
          }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else S === "" && (c.dom.value = "", f.set.call(E, ""), c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), Vt(s, f, {
      get: function() {
        return f.get.call(s);
      },
      set: function(S, C) {
        if (c._isFormatting) {
          C(S);
          return;
        }
        if (!S || S === "") {
          C(""), c._setHiddenRaw(""), f.set.call(c._picker, ""), c._lastISO = "", w(s, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let T = i(S);
        if (T || (T = u(S)), T) {
          const x = T.getFullYear(), O = String(T.getMonth() + 1).padStart(2, "0"), I = String(T.getDate()).padStart(2, "0"), N = x + "-" + O + "-" + I;
          c._setHiddenRaw(N), f.set.call(c._picker, N), c._lastISO = N;
          const j = s.getAttribute(h) || "", et = Z(s), nt = o(T, j, et);
          C(nt), w(s, "ln-date:change", {
            value: N,
            formatted: nt,
            date: T
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          C(String(S)), c._setHiddenRaw(""), f.set.call(c._picker, ""), c._lastISO = "", w(s, "ln-date:change", {
            value: "",
            formatted: String(S),
            date: null
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const S = E.value;
      if (S) {
        const C = i(S);
        C && (c._setHiddenRaw(S), c._displayFormatted(C), c._lastISO = S, w(c.dom, "ln-date:change", {
          value: S,
          formatted: c.dom.value,
          date: C
        }));
      } else
        c._setHiddenRaw(""), c.dom.value = "", c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const S = c.dom.value.trim();
      if (S === "") {
        c._lastISO !== "" && (c._setHiddenRaw(""), f.set.call(c._picker, ""), c.dom.value = "", c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (c._lastISO) {
        const T = i(c._lastISO);
        if (T) {
          const x = c.dom.getAttribute(h) || "", O = Z(c.dom), I = o(T, x, O);
          if (S === I) return;
        }
      }
      const C = u(S);
      if (C) {
        const T = C.getFullYear(), x = String(C.getMonth() + 1).padStart(2, "0"), O = String(C.getDate()).padStart(2, "0"), I = T + "-" + x + "-" + O;
        c._setHiddenRaw(I), f.set.call(c._picker, I), c._displayFormatted(C), c._lastISO = I, w(c.dom, "ln-date:change", {
          value: I,
          formatted: c.dom.value,
          date: C
        });
      } else if (c._lastISO) {
        const T = i(c._lastISO);
        T && c._displayFormatted(T);
      } else
        c.dom.value = "";
    }, s.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      c._openPicker();
    }, A.addEventListener("click", this._onBtnClick), p && p !== "") {
      const S = i(p);
      S && (this._setHiddenRaw(p), f.set.call(E, p), this._displayFormatted(S), this._lastISO = p, w(s, "ln-date:change", {
        value: p,
        formatted: s.value,
        date: S
      }), s.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function i(s) {
    if (!s || typeof s != "string") return null;
    const c = s.split("T"), p = c[0].split("-");
    if (p.length < 3) return null;
    const d = parseInt(p[0], 10), m = parseInt(p[1], 10) - 1, b = parseInt(p[2], 10);
    if (isNaN(d) || isNaN(m) || isNaN(b)) return null;
    let E = 0, A = 0;
    if (c[1]) {
      const C = c[1].split(":");
      E = parseInt(C[0], 10) || 0, A = parseInt(C[1], 10) || 0;
    }
    const S = new Date(d, m, b, E, A);
    return S.getFullYear() !== d || S.getMonth() !== m || S.getDate() !== b ? null : S;
  }
  function u(s) {
    if (!s || typeof s != "string" || (s = s.trim(), s.length < 6)) return null;
    let c, p;
    if (s.indexOf(".") !== -1)
      c = ".", p = s.split(".");
    else if (s.indexOf("/") !== -1)
      c = "/", p = s.split("/");
    else if (s.indexOf("-") !== -1)
      c = "-", p = s.split("-");
    else
      return null;
    if (p.length !== 3) return null;
    const d = [];
    for (let S = 0; S < 3; S++) {
      const C = parseInt(p[S], 10);
      if (isNaN(C)) return null;
      d.push(C);
    }
    let m, b, E;
    c === "." ? (m = d[0], b = d[1], E = d[2]) : c === "/" ? (b = d[0], m = d[1], E = d[2]) : p[0].length === 4 ? (E = d[0], b = d[1], m = d[2]) : (m = d[0], b = d[1], E = d[2]), E < 100 && (E += E < 50 ? 2e3 : 1900);
    const A = new Date(E, b - 1, m);
    return A.getFullYear() !== E || A.getMonth() !== b - 1 || A.getDate() !== m ? null : A;
  }
  n.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, n.prototype._setHiddenRaw = function(s) {
    f.set.call(this._hidden, s);
  }, n.prototype._displayFormatted = function(s) {
    const c = this.dom.getAttribute(h) || "", p = Z(this.dom);
    console.log("[ln-date] _displayFormatted:", {
      date: s,
      format: c,
      locale: p,
      dom: this.dom,
      closestLang: this.dom.closest("[lang]"),
      htmlLang: document.documentElement ? document.documentElement.lang : null,
      formatted: o(s, c, p)
    }), this._isFormatting = !0, this.dom.value = o(s, c, p), this._isFormatting = !1;
  }, Object.defineProperty(n.prototype, "value", {
    get: function() {
      return f.get.call(this._hidden);
    },
    set: function(s) {
      if (!s || s === "") {
        this._setHiddenRaw(""), f.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const c = i(s);
      c && (this._setHiddenRaw(s), f.set.call(this._picker, s), this._displayFormatted(c), this._lastISO = s, w(this.dom, "ln-date:change", {
        value: s,
        formatted: this.dom.value,
        date: c
      }));
    }
  }), Object.defineProperty(n.prototype, "date", {
    get: function() {
      const s = this.value;
      return s ? i(s) : null;
    },
    set: function(s) {
      if (!s || !(s instanceof Date) || isNaN(s.getTime())) {
        this.value = "";
        return;
      }
      const c = s.getFullYear(), p = String(s.getMonth() + 1).padStart(2, "0"), d = String(s.getDate()).padStart(2, "0");
      this.value = c + "-" + p + "-" + d;
    }
  }), Object.defineProperty(n.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), n.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const s = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), s && (this.dom.value = s), w(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function l() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + h + "]");
      for (let c = 0; c < s.length; c++) {
        const p = s[c][a];
        if (p && p.value) {
          const d = i(p.value);
          d && p._displayFormatted(d);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, a, n, "ln-date"), l();
})();
(function() {
  const h = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const v = /* @__PURE__ */ new WeakMap(), f = [];
  if (!history._lnNavPatched) {
    const n = history.pushState;
    history.pushState = function() {
      n.apply(history, arguments);
      for (const i of f)
        i();
    }, history._lnNavPatched = !0;
  }
  function g(n) {
    if (!n.hasAttribute(h) || v.has(n)) return;
    const i = n.getAttribute(h);
    if (!i) return;
    const u = _(n, i);
    v.set(n, u), n[a] = u;
  }
  function _(n, i) {
    const u = n.hasAttribute("data-ln-nav-exact");
    let l = Array.from(n.querySelectorAll("a"));
    r(l, i, window.location.pathname, u);
    const s = function() {
      l = Array.from(n.querySelectorAll("a")), r(l, i, window.location.pathname, u);
    };
    window.addEventListener("popstate", s), f.push(s);
    const c = new MutationObserver(function(p) {
      for (const d of p)
        if (d.type === "childList") {
          for (const m of d.addedNodes)
            if (m.nodeType === 1) {
              if (m.tagName === "A")
                l.push(m), r([m], i, window.location.pathname, u);
              else if (m.querySelectorAll) {
                const b = Array.from(m.querySelectorAll("a"));
                l = l.concat(b), r(b, i, window.location.pathname, u);
              }
            }
          for (const m of d.removedNodes)
            if (m.nodeType === 1) {
              if (m.tagName === "A")
                l = l.filter(function(b) {
                  return b !== m;
                });
              else if (m.querySelectorAll) {
                const b = Array.from(m.querySelectorAll("a"));
                l = l.filter(function(E) {
                  return !b.includes(E);
                });
              }
            }
        }
    });
    return c.observe(n, { childList: !0, subtree: !0 }), {
      navElement: n,
      activeClass: i,
      observer: c,
      updateHandler: s,
      destroy: function() {
        c.disconnect(), window.removeEventListener("popstate", s);
        const p = f.indexOf(s);
        p !== -1 && f.splice(p, 1), v.delete(n), delete n[a];
      }
    };
  }
  function e(n) {
    try {
      return new URL(n, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return n.replace(/\/$/, "") || "/";
    }
  }
  function r(n, i, u, l) {
    const s = e(u);
    for (const c of n) {
      const p = c.getAttribute("href");
      if (!p) continue;
      const d = e(p);
      c.classList.remove(i);
      const m = d === s, b = !l && d !== "/" && s.startsWith(d + "/");
      m || b ? (c.classList.add(i), c.setAttribute("aria-current", "page")) : c.removeAttribute("aria-current");
    }
  }
  function t() {
    G(function() {
      new MutationObserver(function(i) {
        for (const u of i)
          if (u.type === "childList") {
            for (const l of u.addedNodes)
              if (l.nodeType === 1 && (l.hasAttribute && l.hasAttribute(h) && g(l), l.querySelectorAll))
                for (const s of l.querySelectorAll("[" + h + "]"))
                  g(s);
          } else u.type === "attributes" && u.target.hasAttribute && u.target.hasAttribute(h) && g(u.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[a] = g;
  function o() {
    for (const n of document.querySelectorAll("[" + h + "]"))
      g(n);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const h = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function v() {
    const e = (location.hash || "").replace("#", ""), r = {};
    if (!e) return r;
    for (const t of e.split("&")) {
      const o = t.indexOf(":");
      o > 0 && (r[t.slice(0, o)] = t.slice(o + 1));
    }
    return r;
  }
  function f(e, r) {
    const t = (e.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (t) return t;
    if (e.tagName !== "A") return "";
    const o = e.getAttribute("href") || "";
    if (!o.startsWith("#")) return "";
    const n = o.slice(1);
    if (!n) return "";
    const i = n.split("&");
    if (r)
      for (const s of i) {
        const c = s.indexOf(":");
        if (c > 0 && s.slice(0, c).toLowerCase().trim() === r)
          return s.slice(c + 1).toLowerCase().trim();
      }
    const u = i[i.length - 1] || "", l = u.indexOf(":");
    return (l > 0 ? u.slice(l + 1) : u).toLowerCase().trim();
  }
  function g(e) {
    return this.dom = e, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const r of this.tabs) {
      const t = f(r, this.nsKey);
      t ? this.mapTabs[t] = r : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', r);
    }
    for (const r of this.panels) {
      const t = (r.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      t && (this.mapPanels[t] = r);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const e = this;
    this._clickHandlers = [];
    for (const r of this.tabs) {
      if (r[a + "Trigger"]) continue;
      const t = function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        const n = f(r, e.nsKey);
        if (n)
          if (r.tagName === "A" && o.preventDefault(), e.hashEnabled) {
            const i = v();
            i[e.nsKey] = n;
            const u = Object.keys(i).map(function(l) {
              return l + ":" + i[l];
            }).join("&");
            location.hash === "#" + u ? e.dom.setAttribute("data-ln-tabs-active", n) : location.hash = u;
          } else
            e.dom.setAttribute("data-ln-tabs-active", n);
      };
      r.addEventListener("click", t), r[a + "Trigger"] = t, e._clickHandlers.push({ el: r, handler: t });
    }
    if (this._hashHandler = function() {
      if (!e.hashEnabled) return;
      const r = v();
      e.dom.setAttribute("data-ln-tabs-active", e.nsKey in r ? r[e.nsKey] : e.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let r = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const t = At("tabs", this.dom);
        t !== null && t in this.mapPanels && (r = t);
      }
      this.dom.setAttribute("data-ln-tabs-active", r);
    }
  }
  g.prototype._applyActive = function(e) {
    var r;
    (!e || !(e in this.mapPanels)) && (e = this.defaultKey);
    for (const t in this.mapTabs) {
      const o = this.mapTabs[t];
      t === e ? (o.setAttribute("data-active", ""), o.setAttribute("aria-selected", "true")) : (o.removeAttribute("data-active"), o.setAttribute("aria-selected", "false"));
    }
    for (const t in this.mapPanels) {
      const o = this.mapPanels[t], n = t === e;
      o.classList.toggle("hidden", !n), o.setAttribute("aria-hidden", n ? "false" : "true");
    }
    if (this.autoFocus) {
      const t = (r = this.mapPanels[e]) == null ? void 0 : r.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    w(this.dom, "ln-tabs:change", { key: e, tab: this.mapTabs[e], panel: this.mapPanels[e] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && lt("tabs", this.dom, e);
  }, g.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const { el: e, handler: r } of this._clickHandlers)
        e.removeEventListener("click", r), delete e[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), w(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, B(h, a, g, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(e) {
      const r = e.getAttribute("data-ln-tabs-active");
      e[a]._applyActive(r);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function v(e) {
    const r = Array.from(e.querySelectorAll("[data-ln-toggle-for]"));
    e.hasAttribute && e.hasAttribute("data-ln-toggle-for") && r.push(e);
    for (const t of r) {
      if (t[a + "Trigger"]) continue;
      const o = function(u) {
        if (u.ctrlKey || u.metaKey || u.button === 1) return;
        u.preventDefault();
        const l = t.getAttribute("data-ln-toggle-for"), s = document.getElementById(l);
        if (!s || !s[a]) return;
        const c = t.getAttribute("data-ln-toggle-action") || "toggle";
        if (c === "open")
          s.setAttribute(h, "open");
        else if (c === "close")
          s.setAttribute(h, "close");
        else if (c === "toggle") {
          const p = s.getAttribute(h);
          s.setAttribute(h, p === "open" ? "close" : "open");
        }
      };
      t.addEventListener("click", o), t[a + "Trigger"] = o;
      const n = t.getAttribute("data-ln-toggle-for"), i = document.getElementById(n);
      i && i[a] && t.setAttribute("aria-expanded", i[a].isOpen ? "true" : "false");
    }
  }
  function f(e, r) {
    const t = document.querySelectorAll(
      '[data-ln-toggle-for="' + e.id + '"]'
    );
    for (const o of t)
      o.setAttribute("aria-expanded", r ? "true" : "false");
  }
  function g(e) {
    if (this.dom = e, e.hasAttribute("data-ln-persist")) {
      const r = At("toggle", e);
      r !== null && e.setAttribute(h, r);
    }
    return this.isOpen = e.getAttribute(h) === "open", this.isOpen && e.classList.add("open"), f(e, this.isOpen), this;
  }
  g.prototype.destroy = function() {
    if (!this.dom[a]) return;
    w(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const e = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const r of e)
      r[a + "Trigger"] && (r.removeEventListener("click", r[a + "Trigger"]), delete r[a + "Trigger"]);
    delete this.dom[a];
  };
  function _(e) {
    const r = e[a];
    if (!r) return;
    const o = e.getAttribute(h) === "open";
    if (o !== r.isOpen)
      if (o) {
        if (V(e, "ln-toggle:before-open", { target: e }).defaultPrevented) {
          e.setAttribute(h, "close");
          return;
        }
        r.isOpen = !0, e.classList.add("open"), f(e, !0), w(e, "ln-toggle:open", { target: e }), e.hasAttribute("data-ln-persist") && lt("toggle", e, "open");
      } else {
        if (V(e, "ln-toggle:before-close", { target: e }).defaultPrevented) {
          e.setAttribute(h, "open");
          return;
        }
        r.isOpen = !1, e.classList.remove("open"), f(e, !1), w(e, "ln-toggle:close", { target: e }), e.hasAttribute("data-ln-persist") && lt("toggle", e, "close");
      }
  }
  B(h, a, g, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: _,
    onInit: v
  });
})();
(function() {
  const h = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function v(f) {
    return this.dom = f, this._onToggleOpen = function(g) {
      if (g.detail.target.closest("[data-ln-accordion]") !== f) return;
      const _ = f.querySelectorAll("[data-ln-toggle]");
      for (const e of _)
        e !== g.detail.target && e.closest("[data-ln-accordion]") === f && e.getAttribute("data-ln-toggle") === "open" && e.setAttribute("data-ln-toggle", "close");
      w(f, "ln-accordion:change", { target: g.detail.target });
    }, f.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), w(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(h, a, v, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function v(f) {
    if (this.dom = f, this.toggleEl = f.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = f.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const _ of this.toggleEl.children)
        _.setAttribute("role", "menuitem");
    const g = this;
    return this._onToggleOpen = function(_) {
      _.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "true"), g._teleportRestore = Yt(g.toggleEl), g.toggleEl.style.position = "fixed", g.toggleEl.style.right = "auto", g._reposition(), g._addOutsideClickListener(), g._addScrollRepositionListener(), g._addResizeCloseListener(), w(f, "ln-dropdown:open", { target: _.detail.target }));
    }, this._onToggleClose = function(_) {
      _.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "false"), g._removeOutsideClickListener(), g._removeScrollRepositionListener(), g._removeResizeCloseListener(), g.toggleEl.style.position = "", g.toggleEl.style.top = "", g.toggleEl.style.left = "", g.toggleEl.style.right = "", g.toggleEl.style.transform = "", g.toggleEl.style.margin = "", g._teleportRestore && (g._teleportRestore(), g._teleportRestore = null), w(f, "ln-dropdown:close", { target: _.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  v.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const f = this.triggerBtn.getBoundingClientRect(), g = Dt(this.toggleEl), _ = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, e = Et(f, g, "bottom-end", _);
    this.toggleEl.style.top = e.top + "px", this.toggleEl.style.left = e.left + "px";
  }, v.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const f = this;
    this._boundDocClick = function(g) {
      f.dom.contains(g.target) || f.toggleEl && f.toggleEl.contains(g.target) || f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, f._docClickTimeout = setTimeout(function() {
      f._docClickTimeout = null, document.addEventListener("click", f._boundDocClick);
    }, 0);
  }, v.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, v.prototype._addScrollRepositionListener = function() {
    const f = this;
    this._boundScrollReposition = function() {
      f._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, v.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, v.prototype._addResizeCloseListener = function() {
    const f = this;
    this._boundResizeClose = function() {
      f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, v.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, v.prototype.destroy = function() {
    this.dom[a] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), w(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(h, a, v, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", a = "lnPopover", v = "data-ln-popover-for", f = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const g = [];
  let _ = null;
  function e() {
    _ || (_ = function(n) {
      if (n.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", _));
  }
  function r() {
    g.length > 0 || _ && (document.removeEventListener("keydown", _), _ = null);
  }
  function t(n) {
    return this.dom = n, this.isOpen = n.getAttribute(h) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, n.hasAttribute("tabindex") || n.setAttribute("tabindex", "-1"), n.hasAttribute("role") || n.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  t.prototype.open = function(n) {
    this.isOpen || (this.trigger = n || null, this.dom.setAttribute(h, "open"));
  }, t.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, t.prototype.toggle = function(n) {
    this.isOpen ? this.close() : this.open(n);
  }, t.prototype._applyOpen = function(n) {
    this.isOpen = !0, n && (this.trigger = n), this._previousFocus = document.activeElement, this._teleportRestore = Yt(this.dom);
    const i = Dt(this.dom);
    if (this.trigger) {
      const c = this.trigger.getBoundingClientRect(), p = this.dom.getAttribute(f) || "bottom", d = Et(c, i, p, 8);
      this.dom.style.top = d.top + "px", this.dom.style.left = d.left + "px", this.dom.setAttribute("data-ln-popover-placement", d.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const u = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), l = Array.prototype.find.call(u, gt);
    l ? l.focus() : this.dom.focus();
    const s = this;
    this._boundDocClick = function(c) {
      s.dom.contains(c.target) || s.trigger && s.trigger.contains(c.target) || s.close();
    }, s._docClickTimeout = setTimeout(function() {
      s._docClickTimeout = null, document.addEventListener("click", s._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!s.trigger) return;
      const c = s.trigger.getBoundingClientRect(), p = Dt(s.dom), d = s.dom.getAttribute(f) || "bottom", m = Et(c, p, d, 8);
      s.dom.style.top = m.top + "px", s.dom.style.left = m.left + "px", s.dom.setAttribute("data-ln-popover-placement", m.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), e(), w(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const n = g.indexOf(this);
    n !== -1 && g.splice(n, 1), r(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, w(this.dom, "ln-popover:close", {
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
  function o(n) {
    this.dom = n;
    const i = n.getAttribute(v);
    return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-expanded", "false"), n.setAttribute("aria-controls", i), this._onClick = function(u) {
      if (u.ctrlKey || u.metaKey || u.button === 1) return;
      u.preventDefault();
      const l = document.getElementById(i);
      !l || !l[a] || l[a].toggle(n);
    }, n.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, B(h, a, t, "ln-popover", {
    onAttributeChange: function(n) {
      const i = n[a];
      if (!i) return;
      const l = n.getAttribute(h) === "open";
      if (l !== i.isOpen)
        if (l) {
          if (V(n, "ln-popover:before-open", {
            popoverId: n.id,
            target: n,
            trigger: i.trigger
          }).defaultPrevented) {
            n.setAttribute(h, "closed");
            return;
          }
          i._applyOpen(i.trigger);
        } else {
          if (V(n, "ln-popover:before-close", {
            popoverId: n.id,
            target: n,
            trigger: i.trigger
          }).defaultPrevented) {
            n.setAttribute(h, "open");
            return;
          }
          i._applyClose();
        }
    }
  }), B(v, a + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", a = "data-ln-tooltip", v = "data-ln-tooltip-position", f = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[f] !== void 0) return;
  let _ = 0, e = null, r = null, t = null, o = null, n = null;
  function i() {
    return e && e.parentNode || (e = document.getElementById(g), e || (e = document.createElement("div"), e.id = g, document.body.appendChild(e))), e;
  }
  function u() {
    n || (n = function(d) {
      d.key === "Escape" && c();
    }, document.addEventListener("keydown", n));
  }
  function l() {
    n && (document.removeEventListener("keydown", n), n = null);
  }
  function s(d) {
    if (t === d) return;
    c();
    const m = d.getAttribute(a) || d.getAttribute("title");
    if (!m) return;
    i(), d.hasAttribute("title") && (o = d.getAttribute("title"), d.removeAttribute("title"));
    const b = document.createElement("div");
    b.className = "ln-tooltip", b.textContent = m, d[f + "Uid"] || (_ += 1, d[f + "Uid"] = "ln-tooltip-" + _), b.id = d[f + "Uid"], e.appendChild(b);
    const E = b.offsetWidth, A = b.offsetHeight, S = d.getBoundingClientRect(), C = d.getAttribute(v) || "top", T = Et(S, { width: E, height: A }, C, 6);
    b.style.top = T.top + "px", b.style.left = T.left + "px", b.setAttribute("data-ln-tooltip-placement", T.placement), d.setAttribute("aria-describedby", b.id), r = b, t = d, u();
  }
  function c() {
    if (!r) {
      l();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), o !== null && t.setAttribute("title", o)), o = null, r.parentNode && r.parentNode.removeChild(r), r = null, t = null, l();
  }
  function p(d) {
    return this.dom = d, d.hasAttribute("data-ln-tooltip-enhanced") || (d.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      s(d);
    }, this._onLeave = function() {
      t === d && c();
    }, this._onFocus = function() {
      s(d);
    }, this._onBlur = function() {
      t === d && c();
    }, d.addEventListener("mouseenter", this._onEnter), d.addEventListener("mouseleave", this._onLeave), d.addEventListener("focus", this._onFocus, !0), d.addEventListener("blur", this._onBlur, !0), this;
  }
  p.prototype.destroy = function() {
    const d = this.dom;
    d.removeEventListener("mouseenter", this._onEnter), d.removeEventListener("mouseleave", this._onLeave), d.removeEventListener("focus", this._onFocus, !0), d.removeEventListener("blur", this._onBlur, !0), t === d && c(), this._addedEnhancedAttr && d.removeAttribute("data-ln-tooltip-enhanced"), delete d[f], delete d[f + "Uid"], w(d, "ln-tooltip:destroyed", { trigger: d });
  }, B(
    "[" + h + "], [" + a + "][title]",
    f,
    p,
    "ln-tooltip"
  );
})();
const ve = `<li class="ln-toast__item">
	<div class="ln-toast__card" data-ln-attr="role:role, aria-live:ariaLive">
		<div class="ln-toast__side">
			<svg class="ln-icon" aria-hidden="true"><use href=""></use></svg>
		</div>
		<div class="ln-toast__content">
			<div class="ln-toast__head">
				<strong class="ln-toast__title" data-ln-field="title"></strong>
			</div>
			<button type="button" class="ln-toast__close" aria-label="Close"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button>
			<div class="ln-toast__body" data-ln-show="hasBody"></div>
		</div>
	</div>
</li>
`;
(function() {
  const h = "data-ln-toast", a = "lnToast", v = "ln-toast-item", f = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, g = { success: "success", error: "error", warn: "warning", info: "info" }, _ = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function e() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const d = document.createElement("template");
    d.setAttribute("data-ln-template", "ln-toast-item"), d.innerHTML = ve, document.body.appendChild(d);
  }
  function r(d) {
    if (!d || d.nodeType !== 1) return;
    const m = Array.from(d.querySelectorAll("[" + h + "]"));
    d.hasAttribute && d.hasAttribute(h) && m.push(d);
    for (const b of m)
      b[a] || new t(b);
  }
  function t(d) {
    this.dom = d, d[a] = this, this.timeoutDefault = parseInt(d.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(d.getAttribute("data-ln-toast-max") || "5", 10);
    for (const m of Array.from(d.querySelectorAll("[data-ln-toast-item]")))
      s(m, d);
    return this;
  }
  t.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const d of Array.from(this.dom.children))
        u(d);
      delete this.dom[a];
    }
  };
  function o(d, m) {
    const b = ((d.type || "info") + "").toLowerCase(), E = tt(m, v, "ln-toast");
    if (!E)
      return console.warn('[ln-toast] Template "' + v + '" not found'), null;
    const A = E.firstElementChild;
    if (!A) return null;
    const S = !!(d.message || d.data && d.data.errors);
    J(A, {
      title: d.title || _[b] || _.info,
      role: b === "error" ? "alert" : "status",
      ariaLive: b === "error" ? "assertive" : "polite",
      hasBody: S
    });
    const C = A.querySelector(".ln-toast__card");
    C && C.classList.add(g[b] || "info");
    const T = A.querySelector(".ln-toast__side");
    if (T) {
      const I = T.querySelector("use");
      I && I.setAttribute("href", "#ln-" + (f[b] || f.info));
    }
    const x = A.querySelector(".ln-toast__body");
    x && S && n(x, d);
    const O = A.querySelector(".ln-toast__close");
    return O && O.addEventListener("click", function() {
      u(A);
    }), A;
  }
  function n(d, m) {
    if (m.message)
      if (Array.isArray(m.message)) {
        const b = document.createElement("ul");
        for (const E of m.message) {
          const A = document.createElement("li");
          A.textContent = E, b.appendChild(A);
        }
        d.appendChild(b);
      } else {
        const b = document.createElement("p");
        b.textContent = m.message, d.appendChild(b);
      }
    if (m.data && m.data.errors) {
      const b = document.createElement("ul");
      for (const E of Object.values(m.data.errors).flat()) {
        const A = document.createElement("li");
        A.textContent = E, b.appendChild(A);
      }
      d.appendChild(b);
    }
  }
  function i(d, m) {
    for (; d.dom.children.length >= d.max; ) d.dom.removeChild(d.dom.firstElementChild);
    d.dom.appendChild(m), requestAnimationFrame(() => m.classList.add("ln-toast__item--in"));
  }
  function u(d) {
    !d || !d.parentNode || (clearTimeout(d._timer), d.classList.remove("ln-toast__item--in"), d.classList.add("ln-toast__item--out"), setTimeout(() => {
      d.parentNode && d.parentNode.removeChild(d);
    }, 200));
  }
  function l(d) {
    let m = d && d.container;
    return typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), m || null;
  }
  function s(d, m) {
    const b = ((d.getAttribute("data-type") || "info") + "").toLowerCase(), E = d.getAttribute("data-title"), A = (d.innerText || d.textContent || "").trim(), S = o({
      type: b,
      title: E,
      message: A || void 0
    }, m);
    S && (d.parentNode && d.parentNode.replaceChild(S, d), requestAnimationFrame(() => S.classList.add("ln-toast__item--in")));
  }
  function c(d) {
    const m = d.detail || {}, b = l(m);
    if (!b) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const E = b[a] || new t(b), A = o(m, b);
    if (!A) return;
    const S = Number.isFinite(m.timeout) ? m.timeout : E.timeoutDefault;
    i(E, A), S > 0 && (A._timer = setTimeout(() => u(A), S));
  }
  function p(d) {
    const m = d && d.detail || {};
    if (m.container) {
      const b = l(m);
      if (b)
        for (const E of Array.from(b.children)) u(E);
    } else {
      const b = document.querySelectorAll("[" + h + "]");
      for (const E of Array.from(b))
        for (const A of Array.from(E.children)) u(A);
    }
  }
  G(function() {
    e(), window.addEventListener("ln-toast:enqueue", c), window.addEventListener("ln-toast:clear", p), new MutationObserver(function(m) {
      for (const b of m) {
        if (b.type === "attributes") {
          r(b.target);
          continue;
        }
        for (const E of b.addedNodes)
          r(E);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), r(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", a = "lnUpload", v = "data-ln-upload-dict", f = "data-ln-upload-accept", g = "data-ln-upload-context", _ = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function e() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const s = document.createElement("div");
    s.innerHTML = _;
    const c = s.firstElementChild;
    c && document.body.appendChild(c);
  }
  if (window[a] !== void 0) return;
  function r(s) {
    if (s === 0) return "0 B";
    const c = 1024, p = ["B", "KB", "MB", "GB"], d = Math.floor(Math.log(s) / Math.log(c));
    return parseFloat((s / Math.pow(c, d)).toFixed(1)) + " " + p[d];
  }
  function t(s) {
    return s.split(".").pop().toLowerCase();
  }
  function o(s) {
    return s === "docx" && (s = "doc"), ["pdf", "doc", "epub"].includes(s) ? "lnc-file-" + s : "ln-file";
  }
  function n(s, c) {
    if (!c) return !0;
    const p = "." + t(s.name);
    return c.split(",").map(function(m) {
      return m.trim().toLowerCase();
    }).includes(p.toLowerCase());
  }
  function i(s) {
    if (s.hasAttribute("data-ln-upload-initialized")) return;
    s.setAttribute("data-ln-upload-initialized", "true"), e();
    const c = oe(s, v), p = s.querySelector(".ln-upload__zone"), d = s.querySelector(".ln-upload__list"), m = s.getAttribute(f) || "";
    if (!p || !d) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", s);
      return;
    }
    let b = s.querySelector('input[type="file"]');
    b || (b = document.createElement("input"), b.type = "file", b.multiple = !0, b.classList.add("hidden"), m && (b.accept = m.split(",").map(function(q) {
      return q = q.trim(), q.startsWith(".") ? q : "." + q;
    }).join(",")), s.appendChild(b));
    const E = s.getAttribute(h) || "/files/upload", A = s.getAttribute(g) || "", S = /* @__PURE__ */ new Map();
    let C = 0;
    function T() {
      const q = document.querySelector('meta[name="csrf-token"]');
      return q ? q.getAttribute("content") : "";
    }
    function x(q) {
      if (!n(q, m)) {
        const y = c["invalid-type"];
        w(s, "ln-upload:invalid", {
          file: q,
          message: y
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["invalid-title"] || "Invalid File",
          message: y || c["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++C, H = t(q.name), X = o(H), vt = tt(s, "ln-upload-item", "ln-upload");
      if (!vt) return;
      const Y = vt.firstElementChild;
      if (!Y) return;
      Y.setAttribute("data-file-id", P), J(Y, {
        name: q.name,
        sizeText: "0%",
        iconHref: "#" + X,
        removeLabel: c.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const at = Y.querySelector(".ln-upload__progress-bar"), ot = Y.querySelector('[data-ln-upload-action="remove"]');
      ot && (ot.disabled = !0), d.appendChild(Y);
      const ht = new FormData();
      ht.append("file", q), ht.append("context", A);
      const z = new XMLHttpRequest();
      z.upload.addEventListener("progress", function(y) {
        if (y.lengthComputable) {
          const L = Math.round(y.loaded / y.total * 100);
          at.style.width = L + "%", J(Y, { sizeText: L + "%" });
        }
      }), z.addEventListener("load", function() {
        if (z.status >= 200 && z.status < 300) {
          let y;
          try {
            y = JSON.parse(z.responseText);
          } catch {
            ft("Invalid response");
            return;
          }
          J(Y, { sizeText: r(y.size || q.size), uploading: !1 }), ot && (ot.disabled = !1), S.set(P, {
            serverId: y.id,
            name: y.name,
            size: y.size
          }), O(), w(s, "ln-upload:uploaded", {
            localId: P,
            serverId: y.id,
            name: y.name
          });
        } else {
          let y = c["upload-failed"] || "Upload failed";
          try {
            y = JSON.parse(z.responseText).message || y;
          } catch {
          }
          ft(y);
        }
      }), z.addEventListener("error", function() {
        ft(c["network-error"] || "Network error");
      });
      function ft(y) {
        at && (at.style.width = "100%"), J(Y, { sizeText: c.error || "Error", uploading: !1, error: !0 }), ot && (ot.disabled = !1), w(s, "ln-upload:error", {
          file: q,
          message: y
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["error-title"] || "Upload Error",
          message: y || c["upload-failed"] || "Failed to upload file"
        });
      }
      z.open("POST", E), z.setRequestHeader("X-CSRF-TOKEN", T()), z.setRequestHeader("Accept", "application/json"), z.send(ht);
    }
    function O() {
      for (const q of s.querySelectorAll('input[name="file_ids[]"]'))
        q.remove();
      for (const [, q] of S) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = q.serverId, s.appendChild(P);
      }
    }
    function I(q) {
      const P = S.get(q), H = d.querySelector('[data-file-id="' + q + '"]');
      if (!P || !P.serverId) {
        H && H.remove(), S.delete(q), O();
        return;
      }
      H && J(H, { deleting: !0 }), fetch("/files/" + P.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": T(),
          Accept: "application/json"
        }
      }).then(function(X) {
        X.status === 200 ? (H && H.remove(), S.delete(q), O(), w(s, "ln-upload:removed", {
          localId: q,
          serverId: P.serverId
        })) : (H && J(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["delete-title"] || "Error",
          message: c["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(X) {
        console.warn("[ln-upload] Delete error:", X), H && J(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["network-error"] || "Network error",
          message: c["connection-error"] || "Could not connect to server"
        });
      });
    }
    function N(q) {
      for (const P of q)
        x(P);
      b.value = "";
    }
    const j = function() {
      b.click();
    }, et = function() {
      N(this.files);
    }, nt = function(q) {
      q.preventDefault(), q.stopPropagation(), p.classList.add("ln-upload__zone--dragover");
    }, bt = function(q) {
      q.preventDefault(), q.stopPropagation(), p.classList.add("ln-upload__zone--dragover");
    }, dt = function(q) {
      q.preventDefault(), q.stopPropagation(), p.classList.remove("ln-upload__zone--dragover");
    }, $ = function(q) {
      q.preventDefault(), q.stopPropagation(), p.classList.remove("ln-upload__zone--dragover"), N(q.dataTransfer.files);
    }, ut = function(q) {
      const P = q.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !d.contains(P) || P.disabled) return;
      const H = P.closest(".ln-upload__item");
      H && I(H.getAttribute("data-file-id"));
    };
    p.addEventListener("click", j), b.addEventListener("change", et), p.addEventListener("dragenter", nt), p.addEventListener("dragover", bt), p.addEventListener("dragleave", dt), p.addEventListener("drop", $), d.addEventListener("click", ut), s.lnUploadAPI = {
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
              "X-CSRF-TOKEN": T(),
              Accept: "application/json"
            }
          });
        S.clear(), d.innerHTML = "", O(), w(s, "ln-upload:cleared", {});
      },
      destroy: function() {
        p.removeEventListener("click", j), b.removeEventListener("change", et), p.removeEventListener("dragenter", nt), p.removeEventListener("dragover", bt), p.removeEventListener("dragleave", dt), p.removeEventListener("drop", $), d.removeEventListener("click", ut), S.clear(), d.innerHTML = "", O(), s.removeAttribute("data-ln-upload-initialized"), delete s.lnUploadAPI;
      }
    };
  }
  function u() {
    for (const s of document.querySelectorAll("[" + h + "]"))
      i(s);
  }
  function l() {
    G(function() {
      new MutationObserver(function(c) {
        for (const p of c)
          if (p.type === "childList") {
            for (const d of p.addedNodes)
              if (d.nodeType === 1) {
                d.hasAttribute(h) && i(d);
                for (const m of d.querySelectorAll("[" + h + "]"))
                  i(m);
              }
          } else p.type === "attributes" && p.target.hasAttribute(h) && i(p.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[a] = {
    init: i,
    initAll: u
  }, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function a(r) {
    return r.hostname && r.hostname !== window.location.hostname;
  }
  function v(r) {
    if (r.getAttribute("data-ln-external-link") === "processed" || !a(r)) return;
    r.target = "_blank";
    const t = (r.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), r.rel = t.join(" ");
    const o = document.createElement("span");
    o.className = "sr-only", o.textContent = "(opens in new tab)", r.appendChild(o), r.setAttribute("data-ln-external-link", "processed"), w(r, "ln-external-links:processed", {
      link: r,
      href: r.href
    });
  }
  function f(r) {
    r = r || document.body;
    for (const t of r.querySelectorAll("a, area"))
      v(t);
  }
  function g() {
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
  function _() {
    G(function() {
      new MutationObserver(function(t) {
        for (const o of t) {
          if (o.type === "childList") {
            for (const n of o.addedNodes)
              if (n.nodeType === 1 && (n.matches && (n.matches("a") || n.matches("area")) && v(n), n.querySelectorAll))
                for (const i of n.querySelectorAll("a, area"))
                  v(i);
          }
          if (o.type === "attributes" && o.attributeName === "href") {
            const n = o.target;
            n.matches && (n.matches("a") || n.matches("area")) && v(n);
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
  function e() {
    g(), _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      f();
    }) : f();
  }
  window[h] = {
    process: f
  }, e();
})();
(function() {
  const h = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let v = null;
  function f() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function g(d) {
    v && (v.textContent = d, v.classList.add("ln-link-status--visible"));
  }
  function _() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function e(d, m) {
    if (m.target.closest("a, button, input, select, textarea")) return;
    const b = d.querySelector("a");
    if (!b) return;
    const E = b.getAttribute("href");
    if (!E) return;
    if (m.ctrlKey || m.metaKey || m.button === 1) {
      window.open(E, "_blank");
      return;
    }
    V(d, "ln-link:navigate", { target: d, href: E, link: b }).defaultPrevented || b.click();
  }
  function r(d) {
    const m = d.querySelector("a");
    if (!m) return;
    const b = m.getAttribute("href");
    b && g(b);
  }
  function t() {
    _();
  }
  function o(d) {
    d[a + "Row"] || (d[a + "Row"] = !0, d.querySelector("a") && (d._lnLinkClick = function(m) {
      e(d, m);
    }, d._lnLinkEnter = function() {
      r(d);
    }, d.addEventListener("click", d._lnLinkClick), d.addEventListener("mouseenter", d._lnLinkEnter), d.addEventListener("mouseleave", t)));
  }
  function n(d) {
    d[a + "Row"] && (d._lnLinkClick && d.removeEventListener("click", d._lnLinkClick), d._lnLinkEnter && d.removeEventListener("mouseenter", d._lnLinkEnter), d.removeEventListener("mouseleave", t), delete d._lnLinkClick, delete d._lnLinkEnter, delete d[a + "Row"]);
  }
  function i(d) {
    if (!d[a + "Init"]) return;
    const m = d.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const b = m === "TABLE" && d.querySelector("tbody") || d;
      for (const E of b.querySelectorAll("tr"))
        n(E);
    } else
      n(d);
    delete d[a + "Init"];
  }
  function u(d) {
    if (d[a + "Init"]) return;
    d[a + "Init"] = !0;
    const m = d.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const b = m === "TABLE" && d.querySelector("tbody") || d;
      for (const E of b.querySelectorAll("tr"))
        o(E);
    } else
      o(d);
  }
  function l(d) {
    d.hasAttribute && d.hasAttribute(h) && u(d);
    const m = d.querySelectorAll ? d.querySelectorAll("[" + h + "]") : [];
    for (const b of m)
      u(b);
  }
  function s() {
    G(function() {
      new MutationObserver(function(m) {
        for (const b of m)
          if (b.type === "childList")
            for (const E of b.addedNodes)
              E.nodeType === 1 && (l(E), E.tagName === "TR" && E.closest("[" + h + "]") && o(E));
          else b.type === "attributes" && l(b.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function c(d) {
    l(d);
  }
  window[a] = { init: c, destroy: i };
  function p() {
    f(), s(), c(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
(function() {
  const h = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function v(o) {
    f(o);
  }
  function f(o) {
    const n = Array.from(o.querySelectorAll(h));
    for (const i of n)
      i[a] || (i[a] = new g(i));
    o.hasAttribute && o.hasAttribute("data-ln-progress") && !o[a] && (o[a] = new g(o));
  }
  function g(o) {
    return this.dom = o, this._attrObserver = null, this._parentObserver = null, t.call(this), e.call(this), r.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function _() {
    G(function() {
      new MutationObserver(function(n) {
        for (const i of n)
          if (i.type === "childList")
            for (const u of i.addedNodes)
              u.nodeType === 1 && f(u);
          else i.type === "attributes" && f(i.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  _();
  function e() {
    const o = this, n = new MutationObserver(function(i) {
      for (const u of i)
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && t.call(o);
    });
    n.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = n;
  }
  function r() {
    const o = this, n = this.dom.parentElement;
    if (!n || !n.hasAttribute("data-ln-progress-max")) return;
    const i = new MutationObserver(function(u) {
      for (const l of u)
        l.attributeName === "data-ln-progress-max" && t.call(o);
    });
    i.observe(n, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = i;
  }
  function t() {
    const o = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, n = this.dom.parentElement, u = (n && n.hasAttribute("data-ln-progress-max") ? parseFloat(n.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let l = u > 0 ? o / u * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100), this.dom.style.width = l + "%";
    const s = Math.max(0, Math.min(o, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(s)), w(this.dom, "ln-progress:change", { target: this.dom, value: o, max: u, percentage: l });
  }
  window[a] = v, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-filter", a = "lnFilter", v = "data-ln-filter-initialized", f = "data-ln-filter-key", g = "data-ln-filter-value", _ = "data-ln-filter-hide", e = "data-ln-filter-reset", r = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function o(s) {
    return s.hasAttribute(e) || s.getAttribute(g) === "";
  }
  function n(s) {
    let c = s._filterKey;
    const p = [];
    for (let d = 0; d < s.inputs.length; d++) {
      const m = s.inputs[d];
      if (m.checked && !o(m)) {
        const b = m.getAttribute(g);
        b && p.push(b);
      }
    }
    return { key: c, values: p };
  }
  function i(s, c) {
    if (s.length !== c.length) return !0;
    for (let p = 0; p < s.length; p++) if (s[p] !== c[p]) return !0;
    return !1;
  }
  function u(s) {
    const c = s.dom, p = s.colIndex, d = c.querySelector("template");
    if (!d || p === null) return;
    const m = document.getElementById(s.targetId);
    if (!m) return;
    const b = m.tagName === "TABLE" ? m : m.querySelector("table");
    if (!b || m.hasAttribute("data-ln-table")) return;
    const E = {}, A = [], S = b.tBodies;
    for (let x = 0; x < S.length; x++) {
      const O = S[x].rows;
      for (let I = 0; I < O.length; I++) {
        const N = O[I].cells[p], j = N ? N.textContent.trim() : "";
        j && !E[j] && (E[j] = !0, A.push(j));
      }
    }
    A.sort(function(x, O) {
      return x.localeCompare(O);
    });
    const C = c.querySelector("[" + f + "]"), T = C ? C.getAttribute(f) : c.getAttribute("data-ln-filter-key") || "col" + p;
    for (let x = 0; x < A.length; x++) {
      const O = d.content.cloneNode(!0), I = O.querySelector("input");
      I && (I.setAttribute(f, T), I.setAttribute(g, A[x]), _t(O, { text: A[x] }), c.appendChild(O));
    }
  }
  function l(s) {
    if (s.hasAttribute(v)) return this;
    this.dom = s, this.targetId = s.getAttribute(h);
    const c = s.getAttribute(r);
    this.colIndex = c !== null ? parseInt(c, 10) : null, u(this), this.inputs = Array.from(s.querySelectorAll("[" + f + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(f) : null, this._lastSnapshot = null;
    const p = this, d = le(
      function() {
        p._render();
      },
      function() {
        p._afterRender();
      }
    );
    this._queueRender = d, this._attachHandlers();
    let m = !1;
    if (s.hasAttribute("data-ln-persist")) {
      const b = At("filter", s);
      if (b && b.key && Array.isArray(b.values) && b.values.length > 0) {
        for (let E = 0; E < this.inputs.length; E++) {
          const A = this.inputs[E];
          o(A) ? A.checked = !1 : A.getAttribute(f) === b.key && b.values.indexOf(A.getAttribute(g)) !== -1 ? A.checked = !0 : A.checked = !1;
        }
        d(), m = !0;
      }
    }
    if (!m) {
      for (let b = 0; b < this.inputs.length; b++)
        if (this.inputs[b].checked && !o(this.inputs[b])) {
          d();
          break;
        }
    }
    return s.setAttribute(v, ""), this;
  }
  l.prototype._attachHandlers = function() {
    const s = this;
    this.inputs.forEach(function(c) {
      c[a + "Bound"] || (c[a + "Bound"] = !0, c._lnFilterChange = function() {
        if (o(c)) {
          for (let p = 0; p < s.inputs.length; p++)
            o(s.inputs[p]) || (s.inputs[p].checked = !1);
          c.checked = !0, s._queueRender();
          return;
        }
        if (c.checked)
          for (let p = 0; p < s.inputs.length; p++)
            o(s.inputs[p]) && (s.inputs[p].checked = !1);
        else {
          let p = !1;
          for (let d = 0; d < s.inputs.length; d++)
            if (!o(s.inputs[d]) && s.inputs[d].checked) {
              p = !0;
              break;
            }
          if (!p)
            for (let d = 0; d < s.inputs.length; d++)
              o(s.inputs[d]) && (s.inputs[d].checked = !0);
        }
        s._queueRender();
      }, c.addEventListener("change", c._lnFilterChange));
    });
  }, l.prototype._render = function() {
    const s = this, c = n(this), p = c.key === null || c.values.length === 0, d = [];
    for (let m = 0; m < c.values.length; m++)
      d.push(c.values[m].toLowerCase());
    if (s.colIndex !== null)
      s._filterTableRows(c);
    else {
      const m = document.getElementById(s.targetId);
      if (!m) return;
      const b = m.children;
      for (let E = 0; E < b.length; E++) {
        const A = b[E];
        if (p) {
          A.removeAttribute(_);
          continue;
        }
        const S = A.getAttribute("data-" + c.key);
        A.removeAttribute(_), S !== null && d.indexOf(S.toLowerCase()) === -1 && A.setAttribute(_, "true");
      }
    }
  }, l.prototype._afterRender = function() {
    const s = n(this), c = this._lastSnapshot;
    if (!c || c.key !== s.key || i(c.values, s.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: s.key,
        values: s.values.slice()
      });
      const d = c && c.values.length > 0, m = s.values.length === 0;
      d && m && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: s.key, values: s.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (s.key && s.values.length > 0 ? lt("filter", this.dom, { key: s.key, values: s.values.slice() }) : lt("filter", this.dom, null));
  }, l.prototype._dispatchOnBoth = function(s, c) {
    w(this.dom, s, c);
    const p = document.getElementById(this.targetId);
    p && p !== this.dom && w(p, s, c);
  }, l.prototype._filterTableRows = function(s) {
    const c = document.getElementById(this.targetId);
    if (!c) return;
    const p = c.tagName === "TABLE" ? c : c.querySelector("table");
    if (!p || c.hasAttribute("data-ln-table")) return;
    const d = s.key || this._filterKey, m = s.values;
    t.has(p) || t.set(p, {});
    const b = t.get(p);
    if (d && m.length > 0) {
      const C = [];
      for (let T = 0; T < m.length; T++)
        C.push(m[T].toLowerCase());
      b[d] = { col: this.colIndex, values: C };
    } else d && delete b[d];
    const E = Object.keys(b), A = E.length > 0, S = p.tBodies;
    for (let C = 0; C < S.length; C++) {
      const T = S[C].rows;
      for (let x = 0; x < T.length; x++) {
        const O = T[x];
        if (!A) {
          O.removeAttribute(_);
          continue;
        }
        let I = !0;
        for (let N = 0; N < E.length; N++) {
          const j = b[E[N]], et = O.cells[j.col], nt = et ? et.textContent.trim().toLowerCase() : "";
          if (j.values.indexOf(nt) === -1) {
            I = !1;
            break;
          }
        }
        I ? O.removeAttribute(_) : O.setAttribute(_, "true");
      }
    }
  }, l.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.colIndex !== null) {
        const s = document.getElementById(this.targetId);
        if (s) {
          const c = s.tagName === "TABLE" ? s : s.querySelector("table");
          if (c && t.has(c)) {
            const p = t.get(c), d = this._filterKey;
            d && p[d] && delete p[d], Object.keys(p).length === 0 && t.delete(c);
          }
        }
      }
      this.inputs.forEach(function(s) {
        s._lnFilterChange && (s.removeEventListener("change", s._lnFilterChange), delete s._lnFilterChange), delete s[a + "Bound"];
      }), this.dom.removeAttribute(v), delete this.dom[a];
    }
  }, B(h, a, l, "ln-filter");
})();
(function() {
  const h = "data-ln-search", a = "lnSearch", v = "data-ln-search-initialized", f = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function _(e) {
    if (e.hasAttribute(v)) return this;
    this.dom = e, this.targetId = e.getAttribute(h);
    const r = e.tagName;
    if (this.input = r === "INPUT" || r === "TEXTAREA" ? e : e.querySelector('[name="search"]') || e.querySelector('input[type="search"]') || e.querySelector('input[type="text"]'), this.itemsSelector = e.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return e.setAttribute(v, ""), this;
  }
  _.prototype._attachHandler = function() {
    if (!this.input) return;
    const e = this, r = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = r ? r.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      e.input.value = "", e._search(""), e.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(e._debounceTimer), e._debounceTimer = setTimeout(function() {
        e._search(e.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, _.prototype._search = function(e) {
    const r = document.getElementById(this.targetId);
    if (!r || V(r, "ln-search:change", { term: e, targetId: this.targetId }).defaultPrevented) return;
    const o = this.itemsSelector ? r.querySelectorAll(this.itemsSelector) : r.children;
    for (let n = 0; n < o.length; n++) {
      const i = o[n];
      i.removeAttribute(f), e && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(e) && i.setAttribute(f, "true");
    }
  }, _.prototype.destroy = function() {
    this.dom[a] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(v), delete this.dom[a]);
  }, B(h, a, _, "ln-search");
})();
(function() {
  const h = "lnTableSort", a = "data-ln-table-sort", v = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function f(r) {
    g(r);
  }
  function g(r) {
    const t = Array.from(r.querySelectorAll("table"));
    r.tagName === "TABLE" && t.push(r), t.forEach(function(o) {
      if (o[h]) return;
      const n = Array.from(o.querySelectorAll("th[" + a + "]"));
      n.length && (o[h] = new _(o, n));
    });
  }
  function _(r, t) {
    this.table = r, this.ths = t, this._col = -1, this._dir = null;
    const o = this;
    t.forEach(function(i, u) {
      if (i[h + "Bound"]) return;
      i[h + "Bound"] = !0;
      const l = i.querySelector("[" + v + "]");
      l && (l._lnSortClick = function() {
        o._handleClick(u, i);
      }, l.addEventListener("click", l._lnSortClick));
    });
    const n = r.closest("[data-ln-table][data-ln-persist]");
    if (n) {
      const i = At("table-sort", n);
      i && i.dir && i.col >= 0 && i.col < t.length && (this._handleClick(i.col, t[i.col]), i.dir === "desc" && this._handleClick(i.col, t[i.col]));
    }
    return this;
  }
  _.prototype._handleClick = function(r, t) {
    let o;
    this._col !== r ? o = "asc" : this._dir === "asc" ? o = "desc" : this._dir === "desc" ? o = null : o = "asc", this.ths.forEach(function(i) {
      i.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), o === null ? (this._col = -1, this._dir = null) : (this._col = r, this._dir = o, t.classList.add(o === "asc" ? "ln-sort-asc" : "ln-sort-desc")), w(this.table, "ln-table:sort", {
      column: r,
      sortType: t.getAttribute(a),
      direction: o
    });
    const n = this.table.closest("[data-ln-table][data-ln-persist]");
    n && (o === null ? lt("table-sort", n, null) : lt("table-sort", n, { col: r, dir: o }));
  }, _.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(r) {
      const t = r.querySelector("[" + v + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete r[h + "Bound"];
    }), delete this.table[h]);
  };
  function e() {
    G(function() {
      new MutationObserver(function(t) {
        t.forEach(function(o) {
          o.type === "childList" ? o.addedNodes.forEach(function(n) {
            n.nodeType === 1 && g(n);
          }) : o.type === "attributes" && g(o.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [a] });
    }, "ln-table-sort");
  }
  window[h] = f, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const h = "data-ln-table", a = "lnTable", v = "data-ln-table-sort", f = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const e = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, r = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function t(i) {
    return r ? r.format(i) : String(i);
  }
  function o(i) {
    let u = i.parentElement;
    for (; u && u !== document.body && u !== document.documentElement; ) {
      const s = getComputedStyle(u).overflowY;
      if (s === "auto" || s === "scroll") return u;
      u = u.parentElement;
    }
    return null;
  }
  function n(i) {
    this.dom = i, this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead");
    const u = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = u ? Array.from(u.querySelectorAll("th")) : [], this.isDataDriven = i.hasAttribute("data-ln-table-source"), this.name = i.getAttribute(h) || "", this.source = i.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const l = this;
    if (this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(c) {
        return c.getAttribute("data-ln-table-col") && c.querySelector("[data-ln-table-col-filter]");
      }).map(function(c) {
        return c.getAttribute("data-ln-table-col");
      }), this._totalSpan = i.querySelector("[data-ln-table-total]"), this._filteredSpan = i.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = i.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(c) {
        const p = c.detail || {};
        l._data = p.data || [], l._lastTotal = p.total != null ? p.total : l._data.length, l._lastFiltered = p.filtered != null ? p.filtered : l._data.length, l.totalCount = l._lastTotal, l.visibleCount = l._lastFiltered, l.isLoaded = !0, i.classList.remove("ln-table--loading"), l._updateFilterOptions(p.filterOptions), l._vStart = -1, l._vEnd = -1, l._applyFilterAndSort(), l._render(), l._updateFooter(), w(i, "ln-table:rendered", {
          table: l.name,
          total: l.totalCount,
          visible: l.visibleCount
        });
      }, i.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(c) {
        const p = c.detail && c.detail.loading;
        i.classList.toggle("ln-table--loading", !!p), p && (l.isLoaded = !1);
      }, i.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(c) {
        const p = c.target.closest("[data-ln-table-col-sort]");
        if (!p) return;
        const d = p.closest("th");
        if (!d) return;
        const m = d.getAttribute("data-ln-table-col");
        m && l._handleSort(m, d);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(c) {
        const p = c.target.closest("[data-ln-table-col-filter]");
        if (!p) return;
        c.stopPropagation();
        const d = p.closest("th");
        if (!d) return;
        const m = d.getAttribute("data-ln-table-col");
        if (m) {
          if (l._activeDropdown && l._activeDropdown.field === m) {
            l._closeFilterDropdown();
            return;
          }
          l._openFilterDropdown(m, d, p);
        }
      }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
        l._activeDropdown && l._closeFilterDropdown();
      }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(c) {
        (c.target.closest("[data-ln-table-clear-all]") || c.target.closest("[data-ln-data-table-clear-all]")) && (l.currentFilters = {}, l._updateFilterIndicators(), w(i, "ln-table:clear-filters", { table: l.name }), l._requestData());
      }, i.addEventListener("click", this._onClearAll), this._selectable = i.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(c) {
        if (c.target.closest("[data-ln-table-row-select]") || c.target.closest("[data-ln-table-row-action]") || c.target.closest("a") || c.target.closest("button") || c.ctrlKey || c.metaKey || c.button === 1) return;
        const p = c.target.closest("[data-ln-table-row]");
        if (!p) return;
        const d = p.getAttribute("data-ln-table-row-id"), m = p._lnRecord || {};
        w(i, "ln-table:row-click", {
          table: l.name,
          id: d,
          record: m
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(c) {
        const p = c.target.closest("[data-ln-table-row-action]");
        if (!p) return;
        c.stopPropagation();
        const d = p.closest("[data-ln-table-row]");
        if (!d) return;
        const m = p.getAttribute("data-ln-table-row-action"), b = d.getAttribute("data-ln-table-row-id"), E = d._lnRecord || {};
        w(i, "ln-table:row-action", {
          table: l.name,
          id: b,
          action: m,
          record: E
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const s = document.querySelector('[data-ln-search="' + i.id + '"]');
      if (s) {
        const c = s.tagName;
        this._searchInput = c === "INPUT" || c === "TEXTAREA" ? s : s.querySelector('input[type="search"]') || s.querySelector('input[type="text"]') || s.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(c) {
        c.preventDefault(), l.currentSearch = c.detail.term, l._searchInput && (l._searchInput.value = c.detail.term), w(i, "ln-table:search", {
          table: l.name,
          query: l.currentSearch
        }), l._requestData();
      }, i.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(c) {
        if (!i.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (c.key === "/") {
          l._searchInput && (c.preventDefault(), l._searchInput.focus());
          return;
        }
        const p = l.tbody ? Array.from(l.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (p.length)
          switch (c.key) {
            case "ArrowDown":
              c.preventDefault(), l._focusedRowIndex = Math.min(l._focusedRowIndex + 1, p.length - 1), l._focusRow(p);
              break;
            case "ArrowUp":
              c.preventDefault(), l._focusedRowIndex = Math.max(l._focusedRowIndex - 1, 0), l._focusRow(p);
              break;
            case "Home":
              c.preventDefault(), l._focusedRowIndex = 0, l._focusRow(p);
              break;
            case "End":
              c.preventDefault(), l._focusedRowIndex = p.length - 1, l._focusRow(p);
              break;
            case "Enter":
              if (l._focusedRowIndex >= 0 && l._focusedRowIndex < p.length) {
                c.preventDefault();
                const d = p[l._focusedRowIndex];
                w(i, "ln-table:row-click", {
                  table: l.name,
                  id: d.getAttribute("data-ln-table-row-id"),
                  record: d._lnRecord || {}
                });
              }
              break;
            case " ":
              if (l._selectable && l._focusedRowIndex >= 0 && l._focusedRowIndex < p.length) {
                c.preventDefault();
                const d = p[l._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                d && (d.checked = !d.checked, d.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
            case "Escape":
              l._activeDropdown && l._closeFilterDropdown();
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), w(i, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        l.tbody.rows.length > 0 && (l._emptyTbodyObserver.disconnect(), l._emptyTbodyObserver = null, l._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(s) {
        s.preventDefault(), l._searchTerm = s.detail.term, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(i, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, i.addEventListener("ln-search:change", this._onSearch), this._onSort = function(s) {
        l._sortCol = s.detail.direction === null ? -1 : s.detail.column, l._sortDir = s.detail.direction, l._sortType = s.detail.sortType, l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(i, "ln-table:sorted", {
          column: s.detail.column,
          direction: s.detail.direction,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, i.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(s) {
        const c = s.detail.key;
        let p = !1;
        for (let b = 0; b < l.ths.length; b++)
          if (l.ths[b].getAttribute("data-ln-table-filter-col") === c) {
            p = !0;
            break;
          }
        if (!p) return;
        const d = s.detail.values;
        if (!d || d.length === 0)
          delete l._columnFilters[c];
        else {
          const b = [];
          for (let E = 0; E < d.length; E++)
            b.push(d[E].toLowerCase());
          l._columnFilters[c] = b;
        }
        const m = l.dom.querySelector('th[data-ln-table-filter-col="' + c + '"]');
        m && (d && d.length > 0 ? m.setAttribute("data-ln-table-filter-active", "") : m.removeAttribute("data-ln-table-filter-active")), l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(i, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, i.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(s) {
        if (!s.target.closest("[data-ln-table-clear]")) return;
        l._searchTerm = "";
        const p = document.querySelector('[data-ln-search="' + i.id + '"]');
        if (p) {
          const m = p.tagName === "INPUT" ? p : p.querySelector("input");
          m && (m.value = "");
        }
        l._columnFilters = {};
        for (let m = 0; m < l.ths.length; m++)
          l.ths[m].removeAttribute("data-ln-table-filter-active");
        const d = document.querySelectorAll('[data-ln-filter="' + i.id + '"]');
        for (let m = 0; m < d.length; m++) {
          const b = d[m].querySelector("[data-ln-filter-reset]");
          b && (b.checked = !0, b.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(i, "ln-table:filter", {
          term: "",
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, i.addEventListener("click", this._onClear);
    return this;
  }
  n.prototype._parseRows = function() {
    const i = this.tbody.rows, u = this.ths;
    this._data = [];
    const l = [];
    for (let s = 0; s < u.length; s++)
      l[s] = u[s].getAttribute(v);
    i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40), this._lockColumnWidths();
    for (let s = 0; s < i.length; s++) {
      const c = i[s], p = [], d = [], m = [];
      for (let E = 0; E < c.cells.length; E++) {
        const A = c.cells[E], S = A.textContent.trim(), C = Ft(A), T = l[E];
        d[E] = S.toLowerCase(), T === "number" || T === "date" ? p[E] = parseFloat(C) || 0 : T === "string" ? p[E] = String(C) : p[E] = null, E < c.cells.length - 1 && m.push(S.toLowerCase());
      }
      let b = null;
      if (this.isDataDriven) {
        b = {};
        const E = c.getAttribute("data-ln-table-row-id");
        E != null && (b.id = E);
        for (let A = 0; A < u.length; A++) {
          const S = u[A].getAttribute("data-ln-table-col");
          if (S) {
            const C = A;
            if (C < c.cells.length) {
              const T = c.cells[C];
              b[S] = Ft(T);
            }
          }
        }
      }
      this._data.push({
        sortKeys: p,
        rawTexts: d,
        html: c.outerHTML,
        searchText: m.join(" "),
        id: this.isDataDriven && b ? b.id : void 0,
        ...b
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, n.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const i = (this.currentSearch || "").trim().toLowerCase(), u = this.currentFilters || {}, l = Object.keys(u).length > 0;
      if (this._filteredData = this._data.filter(function(b) {
        if (i) {
          let E = !1;
          for (const A in b)
            if (b.hasOwnProperty(A) && typeof b[A] == "string" && A !== "html" && A !== "searchText" && b[A].toLowerCase().indexOf(i) !== -1) {
              E = !0;
              break;
            }
          if (!E) return !1;
        }
        if (l)
          for (const E in u) {
            const A = u[E];
            if (A && A.length > 0) {
              const S = b[E], C = S != null ? String(S) : "";
              if (A.indexOf(C) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const s = this.currentSort.field, p = this.currentSort.direction === "desc" ? -1 : 1;
      let d = null;
      if (this.ths) {
        for (let b = 0; b < this.ths.length; b++)
          if (this.ths[b].getAttribute("data-ln-table-col") === s) {
            d = this.ths[b].getAttribute(v);
            break;
          }
      }
      const m = e ? e.compare : function(b, E) {
        return b < E ? -1 : b > E ? 1 : 0;
      };
      this._filteredData.sort(function(b, E) {
        const A = b[s], S = E[s];
        if (d === "number" || d === "date") {
          const x = parseFloat(A) || 0, O = parseFloat(S) || 0;
          return (x - O) * p;
        }
        if (typeof A == "number" && typeof S == "number")
          return (A - S) * p;
        const C = A != null ? String(A) : "", T = S != null ? String(S) : "";
        return m(C, T) * p;
      });
    } else {
      const i = this._searchTerm, u = this._columnFilters, l = Object.keys(u).length > 0, s = this.ths, c = {};
      if (l)
        for (let E = 0; E < s.length; E++) {
          const A = s[E].getAttribute("data-ln-table-filter-col");
          A && (c[A] = E);
        }
      if (!i && !l ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
        if (i && E.searchText.indexOf(i) === -1) return !1;
        if (l)
          for (const A in u) {
            const S = c[A];
            if (S !== void 0 && u[A].indexOf(E.rawTexts[S]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const p = this._sortCol, d = this._sortDir === "desc" ? -1 : 1, m = this._sortType === "number" || this._sortType === "date", b = e ? e.compare : function(E, A) {
        return E < A ? -1 : E > A ? 1 : 0;
      };
      this._filteredData.sort(function(E, A) {
        const S = E.sortKeys[p], C = A.sortKeys[p];
        return m ? (S - C) * d : b(S, C) * d;
      });
    }
  }, n.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const i = document.createElement("colgroup");
    this.ths.forEach(function(u) {
      const l = document.createElement("col");
      l.style.width = u.offsetWidth + "px", i.appendChild(l);
    }), this.table.insertBefore(i, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = i;
  }, n.prototype._render = function() {
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
  }, n.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, u = document.createDocumentFragment();
      for (let l = 0; l < i.length; l++) {
        const s = this._buildRow(i[l]);
        if (!s) break;
        u.appendChild(s);
      }
      this.tbody.textContent = "", this.tbody.appendChild(u), this._selectable && this._updateSelectAll();
    } else {
      const i = [], u = this._filteredData;
      for (let l = 0; l < u.length; l++) i.push(u[l].html);
      this.tbody.innerHTML = i.join("");
    }
  }, n.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
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
    this.isDataDriven ? this._scrollContainer = o(this.dom) : this._scrollContainer = null;
    const u = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._renderVirtual();
      }));
    }, u.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, n.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, n.prototype._renderVirtual = function() {
    const i = this._filteredData, u = i.length, l = this._rowHeight;
    if (!l || !u) return;
    const s = this.thead ? this.thead.offsetHeight : 0, c = this._scrollContainer;
    let p, d;
    if (c) {
      const C = this.table.getBoundingClientRect(), T = c.getBoundingClientRect(), x = C.top - T.top + c.scrollTop + s;
      p = c.scrollTop - x, d = c.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + s;
      p = window.scrollY - x, d = window.innerHeight;
    }
    let m = Math.max(0, Math.floor(p / l) - 15);
    m = Math.min(m, u);
    const b = Math.min(m + Math.ceil(d / l) + 30, u);
    if (m === this._vStart && b === this._vEnd) return;
    this._vStart = m, this._vEnd = b;
    const E = this.ths.length || 1, A = m * l, S = (u - b) * l;
    if (this.isDataDriven) {
      const C = document.createDocumentFragment();
      if (A > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", E), x.style.height = A + "px", T.appendChild(x), C.appendChild(T);
      }
      for (let T = m; T < b; T++) {
        const x = this._buildRow(i[T]);
        x && C.appendChild(x);
      }
      if (S > 0) {
        const T = document.createElement("tr");
        T.className = "ln-table__spacer", T.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", E), x.style.height = S + "px", T.appendChild(x), C.appendChild(T);
      }
      this.tbody.textContent = "", this.tbody.appendChild(C), this._selectable && this._updateSelectAll();
    } else {
      let C = "";
      A > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let T = m; T < b; T++) C += i[T].html;
      S > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
    }
  }, n.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let u = null;
    if (this.isDataDriven) {
      const l = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount, c = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (s < l || s === 0), p = c ? this.name + "-empty-filtered" : this.name + "-empty";
      if (u = tt(this.dom, p, "ln-table"), !u) {
        const d = this.dom.querySelector("template[data-ln-table-empty]");
        if (d) {
          const m = c ? "search" : "initial", b = d.content.querySelector('[data-ln-table-empty-when="' + m + '"]') || d.content.firstElementChild;
          b && (u = document.importNode(b, !0));
        }
      }
      if (u)
        if (u.tagName === "TR")
          this.tbody.appendChild(u);
        else {
          const d = document.createElement("td");
          d.setAttribute("colspan", String(i)), d.appendChild(u);
          const m = document.createElement("tr");
          m.className = "ln-table__empty", m.appendChild(d), this.tbody.appendChild(m);
        }
    } else {
      const l = this.dom.querySelector("template[" + f + "]"), s = document.createElement("td");
      s.setAttribute("colspan", String(i)), l && s.appendChild(document.importNode(l.content, !0));
      const c = document.createElement("tr");
      c.className = "ln-table__empty", c.appendChild(s), this.tbody.appendChild(c);
    }
    w(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, n.prototype._fillRow = function(i, u) {
    _t(i, u);
    const l = i.querySelectorAll("[data-ln-table-cell-attr]");
    for (let s = 0; s < l.length; s++) {
      const c = l[s], p = c.getAttribute("data-ln-table-cell-attr").split(",");
      for (let d = 0; d < p.length; d++) {
        const m = p[d].trim().split(":");
        if (m.length !== 2) continue;
        const b = m[0].trim(), E = m[1].trim();
        u[b] != null && c.setAttribute(E, u[b]);
      }
    }
  }, n.prototype._buildRow = function(i) {
    const u = tt(this.dom, this.name + "-row", "ln-table");
    if (!u) return null;
    const l = u.querySelector("[data-ln-table-row]") || u.firstElementChild;
    if (!l) return null;
    if (this._fillRow(l, i), l._lnRecord = i, i.id != null && l.setAttribute("data-ln-table-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      l.classList.add("ln-row-selected");
      const s = l.querySelector("[data-ln-table-row-select]");
      s && (s.checked = !0);
    }
    return l;
  }, n.prototype._updateFilterOptions = function(i) {
    if (i !== null && typeof i == "object" && !Array.isArray(i)) {
      const u = Object.keys(i);
      for (let l = 0; l < u.length; l++) {
        const s = u[l], c = i[s];
        if (!Array.isArray(c)) continue;
        const p = {}, d = [];
        for (let m = 0; m < c.length; m++) {
          const b = c[m];
          if (b !== null && typeof b == "object" && "value" in b) {
            const E = String(b.value);
            p[E] || (p[E] = !0, d.push(b));
          } else {
            const E = String(b);
            p[E] || (p[E] = !0, d.push(E));
          }
        }
        d.sort(function(m, b) {
          const E = m !== null && typeof m == "object" ? m.label != null ? m.label : String(m.value) : m, A = b !== null && typeof b == "object" ? b.label != null ? b.label : String(b.value) : b;
          return E < A ? -1 : E > A ? 1 : 0;
        }), this._filterOptions[s] = d;
      }
    } else {
      const u = this._filterableFields, l = this._data;
      for (let s = 0; s < u.length; s++) {
        const c = u[s];
        this._filterOptions[c] || (this._filterOptions[c] = []);
        const p = this._filterOptions[c], d = {};
        for (let m = 0; m < p.length; m++)
          d[p[m]] = !0;
        for (let m = 0; m < l.length; m++) {
          const b = l[m][c];
          if (b != null) {
            const E = String(b);
            d[E] || (d[E] = !0, p.push(E));
          }
        }
        p.sort();
      }
    }
  }, n.prototype._getUniqueValues = function(i) {
    return (this._filterOptions[i] || []).slice();
  }, n.prototype._updateFilterIndicators = function() {
    const i = this.ths;
    for (let u = 0; u < i.length; u++) {
      const l = i[u], s = l.getAttribute("data-ln-table-col");
      if (!s) continue;
      const c = l.querySelector("[data-ln-table-col-filter]");
      if (!c) continue;
      const p = this.currentFilters[s] && this.currentFilters[s].length > 0;
      c.classList.toggle("ln-filter-active", !!p);
    }
  }, n.prototype._applyFilterMutualExclusion = function(i, u) {
    const l = i.hasAttribute("data-ln-filter-reset"), s = u.querySelector("[data-ln-filter-reset]"), c = u.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');
    if (l) {
      i.checked = !0;
      for (let p = 0; p < c.length; p++) c[p].checked = !1;
    } else if (i.checked)
      s && (s.checked = !1);
    else {
      let p = !1;
      for (let d = 0; d < c.length; d++)
        if (c[d].checked) {
          p = !0;
          break;
        }
      !p && s && (s.checked = !0);
    }
  }, n.prototype._onFilterChange = function(i, u) {
    const l = u.querySelector("[data-ln-filter-reset]"), s = u.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])'), c = [];
    for (let d = 0; d < s.length; d++)
      s[d].checked && c.push(s[d].value);
    const p = l && l.checked || c.length === 0;
    p ? delete this.currentFilters[i] : this.currentFilters[i] = c, this._updateFilterIndicators(), w(this.dom, "ln-table:filter", {
      table: this.name,
      field: i,
      values: p ? [] : c
    }), this._requestData();
  }, n.prototype._openFilterDropdown = function(i, u, l) {
    this._closeFilterDropdown();
    const s = tt(this.dom, this.name + "-column-filter", "ln-table") || tt(this.dom, "column-filter", "ln-table");
    if (!s) return;
    const c = s.firstElementChild;
    if (!c) return;
    const p = this._getUniqueValues(i), d = c.querySelector("[data-ln-filter-options]"), m = c.querySelector("[data-ln-filter-search]"), b = this.currentFilters[i] || [], E = this;
    if (m && p.length <= 8 && m.classList.add("hidden"), d) {
      const A = d.querySelector("[data-ln-filter-reset]");
      A && (A.checked = b.length === 0);
      const S = tt(c, this.name + "-column-filter-item", "ln-table") || tt(c, "column-filter-item", "ln-table");
      if (S)
        for (let C = 0; C < p.length; C++) {
          const T = p[C], x = T !== null && typeof T == "object" ? T.value : T, O = T !== null && typeof T == "object" ? T.label != null ? T.label : String(T.value) : T, I = S.cloneNode(!0);
          J(I, { value: O });
          const N = I.querySelector('input[type="checkbox"]');
          N && (N.value = String(x), N.checked = b.length > 0 && b.indexOf(String(x)) !== -1), d.appendChild(I);
        }
      d.addEventListener("change", function(C) {
        C.target.type === "checkbox" && (E._applyFilterMutualExclusion(C.target, d), E._onFilterChange(i, d));
      });
    }
    m && m.addEventListener("input", function() {
      const A = m.value.toLowerCase(), S = d.querySelectorAll("li");
      for (let C = 0; C < S.length; C++) {
        const T = S[C].textContent.toLowerCase();
        S[C].classList.toggle("hidden", A && T.indexOf(A) === -1);
      }
    }), u.appendChild(c), this._activeDropdown = { field: i, th: u, el: c }, c.addEventListener("click", function(A) {
      A.stopPropagation();
    });
  }, n.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, n.prototype._handleSort = function(i, u) {
    let l;
    !this.currentSort || this.currentSort.field !== i ? l = "asc" : this.currentSort.direction === "asc" ? l = "desc" : l = null;
    for (let s = 0; s < this.ths.length; s++)
      this.ths[s].classList.remove("ln-sort-asc", "ln-sort-desc");
    l ? (this.currentSort = { field: i, direction: l }, u.classList.add(l === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, w(this.dom, "ln-table:sort", {
      table: this.name,
      field: i,
      direction: l
    }), this._requestData();
  }, n.prototype._requestData = function() {
    Ut(this, "ln-table:request-data", "table");
  }, n.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-table-row]");
    let u = i.length > 0;
    for (let l = 0; l < i.length; l++) {
      const s = i[l].getAttribute("data-ln-table-row-id");
      if (s != null && !this.selectedIds.has(s)) {
        u = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = u;
  }, Object.defineProperty(n.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), n.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    if (this._onSelectionChange = function(u) {
      const l = u.target.closest("[data-ln-table-row-select]");
      if (!l) return;
      const s = l.closest("[data-ln-table-row]");
      if (!s) return;
      const c = s.getAttribute("data-ln-table-row-id");
      c != null && (l.checked ? (i.selectedIds.add(c), s.classList.add("ln-row-selected")) : (i.selectedIds.delete(c), s.classList.remove("ln-row-selected")), i.selectedCount = i.selectedIds.size, i._updateSelectAll(), i._updateFooter(), w(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const u = document.createElement("input");
      u.type = "checkbox", u.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(u), this._selectAllCheckbox = u;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const u = i._selectAllCheckbox.checked, l = i.tbody ? i.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let s = 0; s < l.length; s++) {
        const c = l[s].getAttribute("data-ln-table-row-id"), p = l[s].querySelector("[data-ln-table-row-select]");
        c != null && (u ? (i.selectedIds.add(c), l[s].classList.add("ln-row-selected")) : (i.selectedIds.delete(c), l[s].classList.remove("ln-row-selected")), p && (p.checked = u));
      }
      i.selectedCount = i.selectedIds.size, w(i.dom, "ln-table:select-all", {
        table: i.name,
        selected: u
      }), w(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let l = 0; l < u.length; l++) {
        const s = u[l].querySelector("[data-ln-table-row-select]"), c = u[l].getAttribute("data-ln-table-row-id");
        s && s.checked && c != null && (this.selectedIds.add(c), u[l].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, n.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const i = this.dom.querySelector("[data-ln-table-col-select]");
    if (i) {
      const u = i.querySelector('input[type="checkbox"]');
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
  }, n.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const i = this._lastTotal != null ? this._lastTotal : this._data.length, u = this.visibleCount, l = u < i;
    if (this._totalSpan && (this._totalSpan.textContent = t(i)), this._filteredSpan && (this._filteredSpan.textContent = l ? t(u) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const s = this.selectedIds.size;
      this._selectedSpan.textContent = s > 0 ? t(s) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
    }
  }, n.prototype._focusRow = function(i) {
    for (let u = 0; u < i.length; u++)
      i[u].classList.remove("ln-row-focused"), i[u].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const u = i[this._focusedRowIndex];
      u.classList.add("ln-row-focused"), u.setAttribute("tabindex", "0"), u.focus(), u.scrollIntoView({ block: "nearest" });
    }
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(h, a, n, "ln-table");
})();
(function() {
  const h = "data-ln-list", a = "lnList", v = "data-ln-list-empty";
  if (window[a] !== void 0) return;
  function _(t) {
    let o = t;
    for (; o && o !== document.body && o !== document.documentElement; ) {
      const i = getComputedStyle(o).overflowY;
      if (i === "auto" || i === "scroll") return o;
      o = o.parentElement;
    }
    return null;
  }
  function e(t) {
    if (!t) return 0;
    const o = getComputedStyle(t), n = parseFloat(o.marginTop) || 0, i = parseFloat(o.marginBottom) || 0;
    return t.offsetHeight + n + i;
  }
  function r(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const o = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== t ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== t ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(n) {
      const i = n.detail || {};
      o._data = i.data || [], o._lastTotal = i.total != null ? i.total : o._data.length, o._lastFiltered = i.filtered != null ? i.filtered : o._data.length, o.totalCount = o._lastTotal, o.visibleCount = o._lastFiltered, o.isLoaded = !0, t.classList.remove("ln-list--loading"), o._vStart = -1, o._vEnd = -1, o._applyFilterAndSort(), o._render(), o._updateFooter(), w(t, "ln-list:rendered", {
        list: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(n) {
      const i = n.detail && n.detail.loading;
      t.classList.toggle("ln-list--loading", !!i), i && (o.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(n) {
      (n.target.closest("[data-ln-list-clear-all]") || n.target.closest("[data-ln-data-list-clear-all]")) && (o.currentFilters = {}, w(t, "ln-list:clear-filters", { list: o.name }), o._requestData());
    }, t.addEventListener("click", this._onClearAll), this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(n) {
      if (n.target.closest("[data-ln-item-select]") || n.target.closest("[data-ln-item-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const i = n.target.closest("[data-ln-item]");
      if (!i) return;
      const u = i.getAttribute("data-ln-item-id"), l = i._lnRecord || {};
      w(t, "ln-list:item-click", {
        list: o.name,
        id: u,
        record: l
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(n) {
      const i = n.target.closest("[data-ln-item-action]");
      if (!i) return;
      n.stopPropagation();
      const u = i.closest("[data-ln-item]");
      if (!u) return;
      const l = i.getAttribute("data-ln-item-action"), s = u.getAttribute("data-ln-item-id"), c = u._lnRecord || {};
      w(t, "ln-list:item-action", {
        list: o.name,
        id: s,
        action: l,
        record: c
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(n) {
      n.preventDefault(), o.currentSearch = n.detail.term, w(t, "ln-list:search", {
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
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(n) {
      n.preventDefault(), o._searchTerm = n.detail.term, o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), w(t, "ln-list:filter", {
        term: o._searchTerm,
        matched: o._filteredData.length,
        total: o._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onClear = function(n) {
      if (!n.target.closest("[data-ln-list-clear]")) return;
      o._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (u) {
        const l = u.tagName === "INPUT" ? u : u.querySelector("input");
        l && (l.value = "");
      }
      o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), w(t, "ln-list:filter", {
        term: "",
        matched: o._filteredData.length,
        total: o._data.length
      });
    }, t.addEventListener("click", this._onClear)), this;
  }
  r.prototype._parseChildren = function() {
    const t = Array.from(this.tbody.children).filter((o) => !o.classList.contains("ln-list__spacer"));
    this._data = [], t.length > 0 && (this._itemHeight = e(t[0]) || 50);
    for (let o = 0; o < t.length; o++) {
      const n = t[o], i = n.getAttribute("data-ln-item-id") || n.getAttribute("id"), u = n.textContent.trim().toLowerCase();
      let l = null;
      if (this.isDataDriven) {
        l = {}, i != null && (l.id = i);
        const s = n.querySelectorAll("[data-ln-list-field]");
        for (let c = 0; c < s.length; c++) {
          const p = s[c], d = p.getAttribute("data-ln-list-field");
          d && (l[d] = p.textContent.trim());
        }
      }
      this._data.push({
        html: n.outerHTML,
        searchText: u,
        id: i,
        ...l
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, r.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), o = this.currentFilters || {}, n = Object.keys(o).length > 0;
      if (this._filteredData = this._data.filter(function(s) {
        if (t) {
          let c = !1;
          for (const p in s)
            if (s.hasOwnProperty(p) && typeof s[p] == "string" && p !== "html" && p !== "searchText" && s[p].toLowerCase().indexOf(t) !== -1) {
              c = !0;
              break;
            }
          if (!c) return !1;
        }
        if (n)
          for (const c in o) {
            const p = o[c];
            if (p && p.length > 0) {
              const d = s[c], m = d != null ? String(d) : "";
              if (p.indexOf(m) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, u = this.currentSort.direction === "desc" ? -1 : 1, l = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(s, c) {
        return s < c ? -1 : s > c ? 1 : 0;
      };
      this._filteredData.sort(function(s, c) {
        const p = s[i], d = c[i];
        if (typeof p == "number" && typeof d == "number")
          return (p - d) * u;
        const m = p != null ? String(p) : "", b = d != null ? String(d) : "";
        return l(m, b) * u;
      });
    } else {
      const t = this._searchTerm;
      t ? this._filteredData = this._data.filter(function(o) {
        return o.searchText.indexOf(t) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, r.prototype._render = function() {
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
  }, r.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, o = document.createDocumentFragment();
      for (let n = 0; n < t.length; n++) {
        const i = this._buildItem(t[n]);
        if (!i) break;
        o.appendChild(i);
      }
      this.tbody.textContent = "", this.tbody.appendChild(o), this._selectable && this._updateSelectAll();
    } else {
      const t = [], o = this._filteredData;
      for (let n = 0; n < o.length; n++) t.push(o[n].html);
      this.tbody.innerHTML = t.join("");
    }
  }, r.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), o = t.gridTemplateColumns;
    let n = 1;
    if (o && o !== "none") {
      const u = o.trim().split(/\s+/).filter(Boolean);
      u.length > 0 && (n = u.length);
    }
    const i = parseFloat(t.rowGap);
    return { columns: n, rowGap: isNaN(i) ? 0 : i };
  }, r.prototype._measureItemHeight = function() {
    if (this.isDataDriven) {
      if (this._data.length > 0) {
        const t = this._buildItem(this._data[0]);
        t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._itemHeight = e(t) || 50, this.tbody.textContent = "");
      }
    } else {
      const t = this.tbody.children;
      t.length > 0 && (this._itemHeight = e(t[0]) || 50);
    }
  }, r.prototype._enableVirtualScroll = function() {
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
  }, r.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, r.prototype._renderVirtual = function() {
    const t = this._filteredData, o = t.length, n = this._itemHeight;
    if (!n || !o) return;
    const i = this._scrollContainer;
    let u, l;
    if (i) {
      const O = this.tbody.getBoundingClientRect(), I = i.getBoundingClientRect(), N = i === this.tbody ? 0 : O.top - I.top + i.scrollTop;
      u = i.scrollTop - N, l = i.clientHeight;
    } else {
      const I = this.tbody.getBoundingClientRect().top + window.scrollY;
      u = window.scrollY - I, l = window.innerHeight;
    }
    const s = this._readGridLayout(), c = s.columns, p = s.rowGap, d = n + p, m = Math.ceil(o / c);
    let b = Math.max(0, Math.floor(u / d) - 15);
    b = Math.min(b, m);
    const E = Math.ceil(l / d) + 30, A = Math.min(b + E, m), S = Math.min(b * c, o), C = Math.min(A * c, o);
    if (S === this._vStart && C === this._vEnd) return;
    this._vStart = S, this._vEnd = C;
    const T = b * d, x = (m - A) * d;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (T > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = T + "px", O.appendChild(I);
      }
      for (let I = S; I < C; I++) {
        const N = this._buildItem(t[I]);
        N && O.appendChild(N);
      }
      if (x > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = x + "px", O.appendChild(I);
      }
      this.tbody.textContent = "", this.tbody.appendChild(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      T > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${T}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let I = S; I < C; I++)
        O += t[I].html;
      x > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${x}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = O;
    }
  }, r.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const o = this._lastTotal != null ? this._lastTotal : this._data.length, n = this.visibleCount, i = this.currentSearch && (n < o || n === 0), u = i ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = tt(this.dom, u, "ln-list"), !t) {
        const l = this.dom.querySelector("template[data-ln-empty]");
        if (l) {
          const s = i ? "search" : "initial", c = l.content.querySelector(`[data-ln-empty-when="${s}"]`) || l.content.firstElementChild;
          c && (t = document.importNode(c, !0));
        }
      }
    } else {
      const o = this.dom.querySelector(`template[${v}]`);
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
  }, r.prototype._buildItem = function(t) {
    const o = tt(this.dom, this.name + "-row", "ln-list");
    if (!o) return null;
    const n = o.querySelector("[data-ln-item]") || o.firstElementChild;
    if (!n) return null;
    if (_t(n, t), J(n, t), n._lnRecord = t, t.id != null && (n.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      n.classList.add("ln-item-selected");
      const i = n.querySelector("[data-ln-item-select]");
      i && (i.checked = !0);
    }
    return n;
  }, r.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(o) {
      const n = o.target.closest("[data-ln-item-select]");
      if (!n) return;
      const i = n.closest("[data-ln-item]");
      if (!i) return;
      const u = i.getAttribute("data-ln-item-id");
      u != null && (n.checked ? (t.selectedIds.add(String(u)), i.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(u)), i.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), w(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const o = t._selectAllCheckbox.checked, n = t.tbody.querySelectorAll("[data-ln-item]");
      for (let i = 0; i < n.length; i++) {
        const u = n[i], l = u.getAttribute("data-ln-item-id"), s = u.querySelector("[data-ln-item-select]");
        l != null && (o ? (t.selectedIds.add(String(l)), u.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(l)), u.classList.remove("ln-item-selected")), s && (s.checked = o));
      }
      w(t.dom, "ln-list:select-all", { list: t.name, selected: o }), w(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, r.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    let o = t.length > 0;
    for (let n = 0; n < t.length; n++) {
      const i = t[n].getAttribute("data-ln-item-id");
      if (i != null && !this.selectedIds.has(String(i))) {
        o = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = o;
  }, r.prototype._requestData = function() {
    Ut(this, "ln-list:request-data", "list");
  }, r.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const t = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount, n = o < t;
    if (this._totalSpan && (this._totalSpan.textContent = t), this._filteredSpan && (this._filteredSpan.textContent = n ? o : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n), this._selectedSpan) {
      const i = this.selectedIds.size;
      this._selectedSpan.textContent = i > 0 ? i : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, r.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(h, a, r, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", f = 36, g = 16, _ = 2 * Math.PI * g;
  function e(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), n.call(this), o.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  e.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[a]);
  };
  function r(i, u) {
    const l = document.createElementNS(v, i);
    for (const s in u)
      l.setAttribute(s, u[s]);
    return l;
  }
  function t() {
    this.svg = r("svg", {
      viewBox: "0 0 " + f + " " + f,
      "aria-hidden": "true"
    }), this.trackCircle = r("circle", {
      cx: f / 2,
      cy: f / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = r("circle", {
      cx: f / 2,
      cy: f / 2,
      r: g,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": _,
      "stroke-dashoffset": _,
      transform: "rotate(-90 " + f / 2 + " " + f / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const i = this, u = new MutationObserver(function(l) {
      for (const s of l)
        (s.attributeName === "data-ln-circular-progress" || s.attributeName === "data-ln-circular-progress-max") && n.call(i);
    });
    u.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = u;
  }
  function n() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, u = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let l = u > 0 ? i / u * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100);
    const s = _ - l / 100 * _;
    this.progressCircle.setAttribute("stroke-dashoffset", s);
    const c = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = c !== null ? c : Math.round(l) + "%", w(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: u,
      percentage: l
    });
  }
  B(h, a, e, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", a = "lnSortable", v = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function f(_) {
    this.dom = _, this.isEnabled = _.getAttribute(h) !== "disabled", this._dragging = null, _.setAttribute("aria-roledescription", "sortable list");
    const e = this;
    return this._onPointerDown = function(r) {
      e.isEnabled && e._handlePointerDown(r);
    }, _.addEventListener("pointerdown", this._onPointerDown), this;
  }
  f.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, f.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, f.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), w(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, f.prototype._handlePointerDown = function(_) {
    let e = _.target.closest("[" + v + "]"), r;
    if (e) {
      for (r = e; r && r.parentElement !== this.dom; )
        r = r.parentElement;
      if (!r || r.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (r = _.target; r && r.parentElement !== this.dom; )
        r = r.parentElement;
      if (!r || r.parentElement !== this.dom) return;
      e = r;
    }
    const o = Array.from(this.dom.children).indexOf(r);
    if (V(this.dom, "ln-sortable:before-drag", {
      item: r,
      index: o
    }).defaultPrevented) return;
    _.preventDefault(), e.setPointerCapture(_.pointerId), this._dragging = r, r.classList.add("ln-sortable--dragging"), r.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), w(this.dom, "ln-sortable:drag-start", {
      item: r,
      index: o
    });
    const i = this, u = function(s) {
      i._handlePointerMove(s);
    }, l = function(s) {
      i._handlePointerEnd(s), e.removeEventListener("pointermove", u), e.removeEventListener("pointerup", l), e.removeEventListener("pointercancel", l);
    };
    e.addEventListener("pointermove", u), e.addEventListener("pointerup", l), e.addEventListener("pointercancel", l);
  }, f.prototype._handlePointerMove = function(_) {
    if (!this._dragging) return;
    const e = Array.from(this.dom.children), r = this._dragging;
    for (const t of e)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of e) {
      if (t === r) continue;
      const o = t.getBoundingClientRect(), n = o.top + o.height / 2;
      if (_.clientY >= o.top && _.clientY < n) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (_.clientY >= n && _.clientY <= o.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, f.prototype._handlePointerEnd = function(_) {
    if (!this._dragging) return;
    const e = this._dragging, r = Array.from(this.dom.children), t = r.indexOf(e);
    let o = null, n = null;
    for (const i of r) {
      if (i.classList.contains("ln-sortable--drop-before")) {
        o = i, n = "before";
        break;
      }
      if (i.classList.contains("ln-sortable--drop-after")) {
        o = i, n = "after";
        break;
      }
    }
    for (const i of r)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (e.classList.remove("ln-sortable--dragging"), e.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== e) {
      n === "before" ? this.dom.insertBefore(e, o) : this.dom.insertBefore(e, o.nextElementSibling);
      const u = Array.from(this.dom.children).indexOf(e);
      w(this.dom, "ln-sortable:reordered", {
        item: e,
        oldIndex: t,
        newIndex: u
      });
    }
    this._dragging = null;
  };
  function g(_) {
    const e = _[a];
    if (!e) return;
    const r = _.getAttribute(h) !== "disabled";
    r !== e.isEnabled && (e.isEnabled = r, w(_, r ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: _ }));
  }
  B(h, a, f, "ln-sortable", {
    onAttributeChange: g
  });
})();
(function() {
  const h = "data-ln-confirm", a = "lnConfirm", v = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function g(_) {
    this.dom = _, this.confirming = !1, this.originalText = _.textContent.trim(), this.confirmText = _.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const e = this;
    return this._onClick = function(r) {
      if (!e.confirming)
        r.preventDefault(), r.stopImmediatePropagation(), e._enterConfirm();
      else {
        if (e._submitted) return;
        e._submitted = !0, e._reset();
      }
    }, _.addEventListener("click", this._onClick), this;
  }
  g.prototype._getTimeout = function() {
    const _ = parseFloat(this.dom.getAttribute(v));
    return isNaN(_) || _ <= 0 ? 3 : _;
  }, g.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var _ = this.dom.querySelector("svg.ln-icon use");
    _ && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = _.getAttribute("href"), _.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), w(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, g.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const _ = this, e = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      _._reset();
    }, e);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var _ = this.dom.querySelector("svg.ln-icon use");
      _ && this.originalIconHref && _.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[a] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, B(h, a, g, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function f(g) {
    this.dom = g, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = g.getAttribute(h + "-default") || "", this.badgesEl = g.querySelector("[" + h + "-active]"), this.menuEl = g.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const _ = g.getAttribute(h + "-locales");
    if (this.locales = v, _)
      try {
        this.locales = JSON.parse(_);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const e = this;
    return this._onRequestAdd = function(r) {
      r.detail && r.detail.lang && e.addLanguage(r.detail.lang);
    }, this._onRequestRemove = function(r) {
      r.detail && r.detail.lang && e.removeLanguage(r.detail.lang);
    }, g.addEventListener("ln-translations:request-add", this._onRequestAdd), g.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  f.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const g = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const _ of g) {
      const e = _.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const r of e)
        r.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, f.prototype._detectExisting = function() {
    const g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const _ of g) {
      const e = _.getAttribute("data-ln-translatable-lang");
      e && e !== this.defaultLang && this.activeLanguages.add(e);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, f.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const g = this;
    let _ = 0;
    for (const r in this.locales) {
      if (!this.locales.hasOwnProperty(r) || this.activeLanguages.has(r)) continue;
      _++;
      const t = yt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const o = t.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", r), o.textContent = this.locales[r], o.addEventListener("click", function(n) {
        n.ctrlKey || n.metaKey || n.button === 1 || (n.preventDefault(), n.stopPropagation(), g.menuEl.getAttribute("data-ln-toggle") === "open" && g.menuEl.setAttribute("data-ln-toggle", "close"), g.addLanguage(r));
      }), this.menuEl.appendChild(t);
    }
    const e = this.dom.querySelector("[" + h + "-add]");
    e && (e.style.display = _ === 0 ? "none" : "");
  }, f.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const g = this;
    this.activeLanguages.forEach(function(_) {
      const e = yt("ln-translations-badge", "ln-translations");
      if (!e) return;
      const r = e.querySelector("[data-ln-translations-lang]");
      r.setAttribute("data-ln-translations-lang", _);
      const t = r.querySelector("span");
      t.textContent = g.locales[_] || _.toUpperCase();
      const o = r.querySelector("button");
      o.setAttribute("aria-label", "Remove " + (g.locales[_] || _.toUpperCase())), o.addEventListener("click", function(n) {
        n.ctrlKey || n.metaKey || n.button === 1 || (n.preventDefault(), n.stopPropagation(), g.removeLanguage(_));
      }), g.badgesEl.appendChild(e);
    });
  }, f.prototype.addLanguage = function(g, _) {
    if (this.activeLanguages.has(g)) return;
    const e = this.locales[g] || g;
    if (V(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: g,
      langName: e
    }).defaultPrevented) return;
    this.activeLanguages.add(g), _ = _ || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of t) {
      const n = o.getAttribute("data-ln-translatable"), i = o.getAttribute("data-ln-translations-prefix") || "", u = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!u) continue;
      const l = u.cloneNode(!1);
      i ? l.name = i + "[trans][" + g + "][" + n + "]" : l.name = "trans[" + g + "][" + n + "]", l.value = _[n] !== void 0 ? _[n] : "", l.removeAttribute("id"), l.placeholder = e + " translation", l.setAttribute("data-ln-translatable-lang", g);
      const s = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), c = s.length > 0 ? s[s.length - 1] : u;
      c.parentNode.insertBefore(l, c.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: g,
      langName: e
    });
  }, f.prototype.removeLanguage = function(g) {
    if (!this.activeLanguages.has(g) || V(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: g
    }).defaultPrevented) return;
    const e = this.dom.querySelectorAll('[data-ln-translatable-lang="' + g + '"]');
    for (const r of e)
      r.parentNode.removeChild(r);
    this.activeLanguages.delete(g), this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: g
    });
  }, f.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, f.prototype.hasLanguage = function(g) {
    return this.activeLanguages.has(g);
  }, f.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const g = this.defaultLang, _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const e of _)
      e.getAttribute("data-ln-translatable-lang") !== g && e.parentNode.removeChild(e);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, B(h, a, f, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", a = "lnAutosave", v = "data-ln-autosave-clear", f = "data-ln-autosave-debounce-input", g = "ln-autosave:";
  if (window[a] !== void 0) return;
  function e(n) {
    const i = r(n);
    if (!i) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", n);
      return;
    }
    this.dom = n, this.key = i;
    let u = null;
    function l() {
      const d = jt(n);
      try {
        localStorage.setItem(i, JSON.stringify(d));
      } catch {
        return;
      }
      w(n, "ln-autosave:saved", { target: n, data: d });
    }
    function s() {
      let d;
      try {
        d = localStorage.getItem(i);
      } catch {
        return;
      }
      if (!d) return;
      let m;
      try {
        m = JSON.parse(d);
      } catch {
        return;
      }
      if (V(n, "ln-autosave:before-restore", { target: n, data: m }).defaultPrevented) return;
      const E = zt(n, m);
      for (let A = 0; A < E.length; A++)
        E[A].dispatchEvent(new Event("input", { bubbles: !0 })), E[A].dispatchEvent(new Event("change", { bubbles: !0 }));
      w(n, "ln-autosave:restored", { target: n, data: m });
    }
    function c() {
      try {
        localStorage.removeItem(i);
      } catch {
        return;
      }
      w(n, "ln-autosave:cleared", { target: n });
    }
    this._onFocusout = function(d) {
      const m = d.target;
      t(m) && m.name && l();
    }, this._onChange = function(d) {
      const m = d.target;
      t(m) && m.name && l();
    }, this._onSubmit = function() {
      c();
    }, this._onReset = function() {
      c();
    }, this._onClearClick = function(d) {
      d.target.closest("[" + v + "]") && c();
    }, n.addEventListener("focusout", this._onFocusout), n.addEventListener("change", this._onChange), n.addEventListener("submit", this._onSubmit), n.addEventListener("reset", this._onReset), n.addEventListener("click", this._onClearClick);
    const p = o(n);
    return p > 0 && (this._onInput = function(d) {
      const m = d.target;
      !t(m) || !m.name || (u !== null && clearTimeout(u), u = setTimeout(l, p));
    }, n.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, s(), this;
  }
  e.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const n = this._getInputTimer();
        n !== null && clearTimeout(n);
      }
      w(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function r(n) {
    const u = n.getAttribute(h) || n.id;
    return u ? g + window.location.pathname + ":" + u : null;
  }
  function t(n) {
    const i = n.tagName;
    return i === "INPUT" || i === "TEXTAREA" || i === "SELECT";
  }
  function o(n) {
    if (!n.hasAttribute(f)) return 0;
    const i = n.getAttribute(f);
    if (i === "" || i === null) return 1e3;
    const u = parseInt(i, 10);
    return isNaN(u) || u < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", n), 1e3) : u;
  }
  B(h, a, e, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
  function v(f) {
    if (f.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", f.tagName), this;
    this.dom = f;
    const g = this;
    return this._onInput = function() {
      g._resize();
    }, f.addEventListener("input", this._onInput), this._resize(), this;
  }
  v.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  }, B(h, a, v, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", a = "lnValidate", v = "data-ln-validate-errors", f = "data-ln-validate-error", g = "ln-validate-valid", _ = "ln-validate-invalid", e = {
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
    const o = this, n = t.tagName, i = t.type, u = n === "SELECT" || i === "checkbox" || i === "radio";
    return this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(l) {
      const s = l.detail && l.detail.error;
      if (!s) return;
      o._customErrors.add(s), o._touched = !0;
      const c = t.closest(".form-element");
      if (c) {
        const p = c.querySelector("[" + f + '="' + s + '"]');
        p && p.classList.remove("hidden");
      }
      t.classList.remove(g), t.classList.add(_);
    }, this._onClearCustom = function(l) {
      const s = l.detail && l.detail.error, c = t.closest(".form-element");
      if (s) {
        if (o._customErrors.delete(s), c) {
          const p = c.querySelector("[" + f + '="' + s + '"]');
          p && p.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(p) {
          if (c) {
            const d = c.querySelector("[" + f + '="' + p + '"]');
            d && d.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, u || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  r.prototype.validate = function() {
    const t = this.dom, o = t.validity, i = t.checkValidity() && this._customErrors.size === 0, u = t.closest(".form-element");
    if (u) {
      const s = u.querySelector("[" + v + "]");
      if (s) {
        const c = s.querySelectorAll("[" + f + "]");
        for (let p = 0; p < c.length; p++) {
          const d = c[p].getAttribute(f), m = e[d];
          m && (o[m] ? c[p].classList.remove("hidden") : c[p].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(g, i), t.classList.toggle(_, !i), w(t, i ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), i;
  }, r.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(g, _);
    const t = this.dom.closest(".form-element");
    if (t) {
      const o = t.querySelectorAll("[" + f + "]");
      for (let n = 0; n < o.length; n++)
        o[n].classList.add("hidden");
    }
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), r.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(g, _), w(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(h, a, r, "ln-validate");
})();
(function() {
  const h = "data-ln-form", a = "lnForm", v = "data-ln-form-auto", f = "data-ln-form-debounce", g = "data-ln-form-typed", _ = "data-ln-validate", e = "lnValidate";
  if (window[a] !== void 0) return;
  function r(t) {
    this.dom = t, this._debounceTimer = null;
    const o = this;
    if (this._onValid = function() {
      o._updateSubmitButton();
    }, this._onInvalid = function() {
      o._updateSubmitButton();
    }, this._onSubmit = function(n) {
      n.preventDefault(), o.submit();
    }, this._onFill = function(n) {
      n.detail && o.fill(n.detail);
    }, this._onFormReset = function() {
      o.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        o._resetValidation();
      }, 0);
    }, t.addEventListener("ln-validate:valid", this._onValid), t.addEventListener("ln-validate:invalid", this._onInvalid), t.addEventListener("submit", this._onSubmit), t.addEventListener("ln-form:fill", this._onFill), t.addEventListener("ln-form:reset", this._onFormReset), t.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, t.hasAttribute(v)) {
      const n = parseInt(t.getAttribute(f)) || 0;
      this._onAutoInput = function() {
        n > 0 ? (clearTimeout(o._debounceTimer), o._debounceTimer = setTimeout(function() {
          o.submit();
        }, n)) : o.submit();
      }, t.addEventListener("input", this._onAutoInput), t.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  r.prototype._updateSubmitButton = function() {
    const t = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!t.length) return;
    const o = this.dom.querySelectorAll("[" + _ + "]");
    let n = !1;
    if (o.length > 0) {
      let i = !1, u = !1;
      for (let l = 0; l < o.length; l++) {
        const s = o[l][e];
        s && s._touched && (i = !0), o[l].checkValidity() || (u = !0);
      }
      n = u || !i;
    }
    for (let i = 0; i < t.length; i++)
      t[i].disabled = n;
  }, r.prototype.fill = function(t) {
    const o = zt(this.dom, t);
    for (let n = 0; n < o.length; n++) {
      const i = o[n], u = i.tagName === "SELECT" || i.type === "checkbox" || i.type === "radio";
      i.dispatchEvent(new Event(u ? "change" : "input", { bubbles: !0 }));
    }
  }, r.prototype.submit = function() {
    const t = this.dom.querySelectorAll("[" + _ + "]");
    let o = !0;
    for (let i = 0; i < t.length; i++) {
      const u = t[i][e];
      u && (u.validate() || (o = !1));
    }
    if (!o) return;
    const n = jt(this.dom, { typed: this.dom.hasAttribute(g) });
    w(this.dom, "ln-form:submit", { data: n });
  }, r.prototype.reset = function() {
    this.dom.reset();
    const t = this.dom.querySelectorAll("input, textarea, select");
    for (let o = 0; o < t.length; o++) {
      const n = t[o], i = n.tagName === "SELECT" || n.type === "checkbox" || n.type === "radio";
      n.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), w(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, r.prototype._resetValidation = function() {
    const t = this.dom.querySelectorAll("[" + _ + "]");
    for (let o = 0; o < t.length; o++) {
      const n = t[o][e];
      n && n.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      const t = this.dom.querySelectorAll("[" + _ + "]");
      for (let o = 0; o < t.length; o++)
        if (!t[o].checkValidity()) return !1;
      return !0;
    }
  }), r.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), w(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(h, a, r, "ln-form");
})();
(function() {
  const h = "data-ln-slug-from", a = "lnSlug";
  if (window[a] !== void 0) return;
  function v(g) {
    return String(g).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function f(g) {
    if (g.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", g.tagName), this;
    const _ = g.form;
    if (!_)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", g), this;
    const e = g.getAttribute(h), r = _.elements[e];
    if (!r)
      return console.warn('[ln-slug] Source field "' + e + '" not found in form:', g), this;
    if (typeof r.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + e + '" is a RadioNodeList (same-name group) — single source field required:', g), this;
    this.dom = g, this.source = r, this._pristine = g.value === "", this._mirroring = !1;
    const t = this;
    return this._onSource = function() {
      t._pristine && t._mirror();
    }, this._onSlug = function() {
      t._mirroring || (t._pristine = t.dom.value === "");
    }, r.addEventListener("input", this._onSource), g.addEventListener("input", this._onSlug), this;
  }
  f.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = v(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, f.prototype.destroy = function() {
    this.dom[a] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[a]);
  }, B(h, a, f, "ln-slug");
})();
(function() {
  const h = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const v = {}, f = {};
  function g(A) {
    return A.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function _(A, S) {
    const C = (A || "") + "|" + JSON.stringify(S);
    return v[C] || (v[C] = new Intl.DateTimeFormat(A, S)), v[C];
  }
  function e(A) {
    const S = A || "";
    return f[S] || (f[S] = new Intl.RelativeTimeFormat(A, { numeric: "auto", style: "narrow" })), f[S];
  }
  const r = /* @__PURE__ */ new Set();
  let t = null;
  function o() {
    t || (t = setInterval(i, 6e4));
  }
  function n() {
    t && (clearInterval(t), t = null);
  }
  function i() {
    for (const A of r) {
      if (!document.body.contains(A.dom)) {
        r.delete(A);
        continue;
      }
      d(A);
    }
    r.size === 0 && n();
  }
  function u(A, S) {
    return _(S, { dateStyle: "long", timeStyle: "short" }).format(A);
  }
  function l(A, S) {
    const C = /* @__PURE__ */ new Date(), T = { month: "short", day: "numeric" };
    return A.getFullYear() !== C.getFullYear() && (T.year = "numeric"), _(S, T).format(A);
  }
  function s(A, S) {
    return _(S, { dateStyle: "medium" }).format(A);
  }
  function c(A, S) {
    return _(S, { timeStyle: "short" }).format(A);
  }
  function p(A, S) {
    const C = Math.floor(Date.now() / 1e3), x = Math.floor(A.getTime() / 1e3) - C, O = Math.abs(x);
    if (O < 10) return e(S).format(0, "second");
    let I, N;
    if (O < 60)
      I = "second", N = x;
    else if (O < 3600)
      I = "minute", N = Math.round(x / 60);
    else if (O < 86400)
      I = "hour", N = Math.round(x / 3600);
    else if (O < 604800)
      I = "day", N = Math.round(x / 86400);
    else if (O < 2592e3)
      I = "week", N = Math.round(x / 604800);
    else
      return l(A, S);
    return e(S).format(N, I);
  }
  function d(A) {
    const S = A.dom.getAttribute("datetime");
    if (!S) return;
    const C = Number(S);
    if (isNaN(C)) return;
    const T = new Date(C * 1e3), x = A.dom.getAttribute(h) || "short", O = g(A.dom);
    let I;
    switch (x) {
      case "relative":
        I = p(T, O);
        break;
      case "full":
        I = u(T, O);
        break;
      case "date":
        I = s(T, O);
        break;
      case "time":
        I = c(T, O);
        break;
      default:
        I = l(T, O);
        break;
    }
    A.dom.textContent = I, x !== "full" && (A.dom.title = u(T, O));
  }
  function m(A) {
    return this.dom = A, d(this), A.getAttribute(h) === "relative" && (r.add(this), o()), this;
  }
  m.prototype.render = function() {
    d(this);
  }, m.prototype.destroy = function() {
    r.delete(this), r.size === 0 && n(), delete this.dom[a];
  };
  function b(A) {
    const S = A[a];
    if (!S) return;
    A.getAttribute(h) === "relative" ? (r.add(S), o()) : (r.delete(S), r.size === 0 && n()), d(S);
  }
  function E(A) {
    A.nodeType === 1 && A.hasAttribute && A.hasAttribute(h) && A[a] && d(A[a]);
  }
  B(h, a, m, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: b,
    onInit: E
  });
})();
(function() {
  const h = "data-ln-data-store", a = "lnDataStore";
  if (window[a] !== void 0) return;
  const v = "ln_app_cache", f = "_meta", g = "1.0";
  let _ = null, e = null;
  const r = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (L) => {
        const D = Math.random() * 16 | 0;
        return (L === "x" ? D : D & 3 | 8).toString(16);
      });
    }
  }
  function o(y) {
    y && y.name === "QuotaExceededError" && w(document, "ln-store:quota-exceeded", { error: y });
  }
  function n() {
    const y = {};
    for (const L of document.querySelectorAll(`[${h}]`)) {
      const D = L.getAttribute(h);
      if (D) {
        const k = L.getAttribute("data-ln-data-store-indexes") || L.getAttribute("data-ln-store-indexes") || "";
        y[D] = {
          indexes: k.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return y;
  }
  function i() {
    return e || (e = new Promise((y) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), y(null);
      const L = n(), D = Object.keys(L), k = indexedDB.open(v);
      k.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), y(null);
      }, k.onsuccess = (R) => {
        const M = R.target.result, F = Array.from(M.objectStoreNames);
        if (!(!F.includes(f) || D.some((pt) => !F.includes(pt))))
          return u(M), _ = M, y(M);
        const Q = M.version;
        M.close();
        const it = indexedDB.open(v, Q + 1);
        it.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, it.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), y(null);
        }, it.onupgradeneeded = (pt) => {
          const rt = pt.target.result;
          rt.objectStoreNames.contains(f) || rt.createObjectStore(f, { keyPath: "key" });
          for (const Ct of D)
            if (!rt.objectStoreNames.contains(Ct)) {
              const ne = rt.createObjectStore(Ct, { keyPath: "id" });
              for (const Nt of L[Ct].indexes)
                ne.createIndex(Nt, Nt, { unique: !1 });
            }
        }, it.onsuccess = (pt) => {
          const rt = pt.target.result;
          u(rt), _ = rt, y(rt);
        };
      };
    }), e);
  }
  function u(y) {
    y.onversionchange = () => {
      y.close(), _ = null, e = null;
    };
  }
  function l() {
    return _ ? Promise.resolve(_) : (e = null, i());
  }
  async function s(y) {
    if (!mt() || !y) return y;
    const L = { ...y }, D = L.id, k = L._pending, R = await de(L);
    return !R || !R.encrypted ? y : {
      id: D,
      _pending: k,
      encrypted: !0,
      iv: R.iv,
      data: R.data
    };
  }
  async function c(y) {
    return !y || !y.encrypted || !mt() ? y : ue(y);
  }
  const p = (y, L) => l().then((D) => D ? D.transaction(y, L).objectStore(y) : null);
  function d(y) {
    return new Promise((L, D) => {
      y.onsuccess = () => L(y.result), y.onerror = () => {
        o(y.error), D(y.error);
      };
    });
  }
  const m = (y) => p(y, "readonly").then((L) => L ? d(L.getAll()) : []).then((L) => mt() ? Promise.all(L.map((D) => c(D))) : L), b = (y, L) => p(y, "readonly").then((D) => D ? d(D.get(L)) : null).then((D) => D ? c(D) : null), E = (y, L) => (mt() ? s(L) : Promise.resolve(L)).then((k) => p(y, "readwrite").then((R) => R ? d(R.put(k)) : null)), A = (y, L) => p(y, "readwrite").then((D) => D ? d(D.delete(L)) : null), S = (y) => p(y, "readwrite").then((L) => L ? d(L.clear()) : null), C = (y) => p(y, "readonly").then((L) => L ? d(L.count()) : 0), T = (y) => p(f, "readonly").then((L) => L ? d(L.get(y)) : null), x = (y, L) => p(f, "readwrite").then((D) => {
    if (D)
      return L.key = y, d(D.put(L));
  });
  function O(y) {
    this.dom = y, this._name = y.getAttribute(h);
    const L = y.getAttribute("data-ln-data-store-stale") || y.getAttribute("data-ln-store-stale"), D = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(D) ? 300 : D;
    const k = y.getAttribute("data-ln-data-store-search-fields") || y.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = k.split(",").map((R) => R.trim()).filter(Boolean), this._noAutosync = y.hasAttribute("data-ln-data-store-no-autosync") || y.hasAttribute("data-ln-store-no-autosync"), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, r[this._name] = this, I(this), bt(this), this;
  }
  function I(y) {
    y._handlers = {
      create: (L) => N(y, L.detail),
      update: (L) => j(y, L.detail),
      delete: (L) => et(y, L.detail),
      "bulk-delete": (L) => nt(y, L.detail)
    };
    for (const [L, D] of Object.entries(y._handlers))
      y.dom.addEventListener(`ln-store:request-${L}`, D);
  }
  function N(y, { data: L = {} } = {}) {
    const D = `_temp_${t()}`, k = { ...L, id: D, _pending: !0 };
    E(y._name, k).then(() => {
      y.totalCount++, w(y.dom, "ln-store:created", { store: y._name, record: k, tempId: D }), w(y.dom, "ln-store:request-remote-create", { tempId: D, data: L });
    });
  }
  function j(y, { id: L, data: D = {}, expected_version: k } = {}) {
    b(y._name, L).then((R) => {
      if (!R) throw new Error(`Record not found: ${L}`);
      y._pendingSnapshots[L] = { ...R };
      const M = { ...R, ...D, _pending: !0 };
      return E(y._name, M).then(() => {
        w(y.dom, "ln-store:updated", { store: y._name, record: M, previous: y._pendingSnapshots[L] }), w(y.dom, "ln-store:request-remote-update", { id: L, data: D, expected_version: k });
      });
    }).catch((R) => console.error("[ln-data-store] Optimistic update failed:", R));
  }
  function et(y, { id: L } = {}) {
    b(y._name, L).then((D) => {
      if (D)
        return y._pendingSnapshots[L] = { ...D }, A(y._name, L).then(() => {
          y.totalCount--, w(y.dom, "ln-store:deleted", { store: y._name, id: L }), w(y.dom, "ln-store:request-remote-delete", { id: L });
        });
    }).catch((D) => console.error("[ln-data-store] Optimistic delete failed:", D));
  }
  function nt(y, { ids: L = [] } = {}) {
    L.length && Promise.all(L.map((D) => b(y._name, D))).then((D) => {
      const k = D.filter(Boolean), R = k.map((M) => M.id);
      return y._pendingSnapshots[R.join(",")] = k, q(y._name, R).then(() => {
        y.totalCount -= R.length, w(y.dom, "ln-store:deleted", { store: y._name, ids: R }), w(y.dom, "ln-store:request-remote-bulk-delete", { ids: R });
      });
    }).catch((D) => console.error("[ln-data-store] Optimistic bulk delete failed:", D));
  }
  function bt(y) {
    i().then(() => T(y._name)).then((L) => {
      L && L.schema_version === g ? (y.lastSyncedAt = L.last_synced_at || null, y.totalCount = L.record_count || 0, y.totalCount > 0 ? (y.isLoaded = !0, w(y.dom, "ln-store:ready", { store: y._name, count: y.totalCount, source: "cache" }), dt(y) && $(y)) : $(y)) : L && L.schema_version !== g ? S(y._name).then(() => x(y._name, { schema_version: g, last_synced_at: null, record_count: 0 })).then(() => $(y)) : $(y);
    });
  }
  function dt(y) {
    return y._staleThreshold === -1 ? !1 : y.lastSyncedAt ? Math.floor(Date.now() / 1e3) - y.lastSyncedAt > y._staleThreshold : !0;
  }
  function $(y) {
    y.isSyncing = !0, w(y.dom, "ln-store:request-remote-sync", { since: y.lastSyncedAt });
  }
  function ut(y, L) {
    return l().then((D) => D ? (mt() ? Promise.all(L.map((R) => s(R))) : Promise.resolve(L)).then((R) => new Promise((M, F) => {
      const U = D.transaction(y, "readwrite"), Q = U.objectStore(y);
      R.forEach((it) => Q.put(it)), U.oncomplete = () => M(), U.onerror = () => {
        o(U.error), F(U.error);
      };
    })) : void 0);
  }
  function q(y, L) {
    return l().then((D) => {
      if (D)
        return new Promise((k, R) => {
          const M = D.transaction(y, "readwrite"), F = M.objectStore(y);
          L.forEach((U) => F.delete(U)), M.oncomplete = () => k(), M.onerror = () => R(M.error);
        });
    });
  }
  let P = () => {
    document.visibilityState === "visible" && Object.values(r).forEach((y) => {
      y.isLoaded && !y.isSyncing && dt(y) && $(y);
    });
  };
  document.addEventListener("visibilitychange", P);
  let H = () => {
    w(document, "ln-store:online", {}), Object.values(r).forEach((y) => {
      y._noAutosync || y.isLoaded && !y.isSyncing && $(y);
    });
  };
  window.addEventListener("online", H);
  let X = () => {
    w(document, "ln-store:offline", {});
  };
  window.addEventListener("offline", X);
  const vt = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Y(y, L) {
    if (!L || !L.field) return y;
    const { field: D, direction: k } = L, R = k === "desc";
    return [...y].sort((M, F) => {
      const U = M[D], Q = F[D];
      if (U == null && Q == null) return 0;
      if (U == null) return R ? 1 : -1;
      if (Q == null) return R ? -1 : 1;
      const it = typeof U == "string" && typeof Q == "string" ? vt.compare(U, Q) : U < Q ? -1 : U > Q ? 1 : 0;
      return R ? -it : it;
    });
  }
  function at(y, L) {
    if (!L) return y;
    const D = Object.keys(L).filter((k) => Array.isArray(L[k]) && L[k].length > 0);
    return D.length ? y.filter(
      (k) => D.every((R) => L[R].map(String).includes(String(k[R])))
    ) : y;
  }
  function ot(y, L, D) {
    if (!L || !D || !D.length) return y;
    const k = L.toLowerCase();
    return y.filter(
      (R) => D.some((M) => {
        const F = R[M];
        return F != null && String(F).toLowerCase().includes(k);
      })
    );
  }
  function ht(y, L, D) {
    if (!y.length) return 0;
    if (D === "count") return y.length;
    const k = y.map((M) => parseFloat(M[L])).filter((M) => !isNaN(M)), R = k.reduce((M, F) => M + F, 0);
    return D === "sum" ? R : D === "avg" && k.length ? R / k.length : 0;
  }
  function z(y, L) {
    if (!y.presenters || !y.presenters.computed) return L;
    const D = y.presenters.computed;
    return L.map((k) => {
      const R = { ...k };
      for (const [M, F] of Object.entries(D))
        try {
          R[M] = F(k);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${M}`, U);
        }
      return R;
    });
  }
  O.prototype.getAll = function(y = {}) {
    const L = this;
    return m(L._name).then((D) => {
      const k = D.length;
      y.filters && (D = at(D, y.filters)), y.search && (D = ot(D, y.search, L._searchFields));
      const R = D.length;
      if (y.sort && (D = Y(D, y.sort)), y.offset || y.limit) {
        const M = y.offset || 0, F = y.limit || D.length;
        D = D.slice(M, M + F);
      }
      return {
        data: z(L, D),
        total: k,
        filtered: R
      };
    });
  }, O.prototype.getById = function(y) {
    return b(this._name, y).then((L) => L ? z(this, [L])[0] : null);
  }, O.prototype.count = function(y) {
    return y ? m(this._name).then((L) => at(L, y).length) : C(this._name);
  }, O.prototype.aggregate = function(y, L) {
    return m(this._name).then((D) => ht(D, y, L));
  }, O.prototype.setPresenters = function(y) {
    this.presenters = y;
  }, O.prototype.applySync = function(y, L, D) {
    const k = this, R = y.length > 0 || L.length > 0;
    let M = Promise.resolve();
    return y.length > 0 && (M = M.then(() => ut(k._name, y))), L.length > 0 && (M = M.then(() => q(k._name, L))), M.then(() => C(k._name)).then((F) => (k.totalCount = F, x(k._name, {
      schema_version: g,
      last_synced_at: D,
      record_count: F
    }))).then(() => {
      const F = !k.isLoaded;
      k.isLoaded = !0, k.isSyncing = !1, k.lastSyncedAt = D, F ? (w(k.dom, "ln-store:loaded", { store: k._name, count: k.totalCount }), w(k.dom, "ln-store:ready", { store: k._name, count: k.totalCount, source: "server" })) : w(k.dom, "ln-store:synced", {
        store: k._name,
        added: y.length,
        deleted: L.length,
        changed: R
      });
    }).catch((F) => {
      k.isSyncing = !1, console.error("[ln-data-store] applySync failed:", F);
    });
  }, O.prototype.confirmMutation = function(y, L, D) {
    const k = this, R = {
      create: () => A(k._name, y).then(() => E(k._name, L)).then(() => {
        delete k._pendingSnapshots[y], w(k.dom, "ln-store:confirmed", { store: k._name, record: L, tempId: y, action: "create" });
      }),
      update: () => E(k._name, L).then(() => {
        delete k._pendingSnapshots[y], w(k.dom, "ln-store:confirmed", { store: k._name, record: L, action: "update" });
      }),
      delete: () => (delete k._pendingSnapshots[y], w(k.dom, "ln-store:confirmed", { store: k._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete k._pendingSnapshots[y], w(k.dom, "ln-store:confirmed", { store: k._name, record: null, ids: y.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return R[D] ? R[D]() : Promise.resolve();
  }, O.prototype.revertMutation = function(y, L, D) {
    const k = this, R = D || `Server rejected ${L}`, M = {
      create: () => A(k._name, y).then(() => {
        k.totalCount--, delete k._pendingSnapshots[y], w(k.dom, "ln-store:reverted", { store: k._name, record: null, action: "create", error: R });
      }),
      update: () => {
        const F = k._pendingSnapshots[y];
        return F ? E(k._name, F).then(() => {
          delete k._pendingSnapshots[y], w(k.dom, "ln-store:reverted", { store: k._name, record: F, action: "update", error: R });
        }) : Promise.resolve();
      },
      delete: () => {
        const F = k._pendingSnapshots[y];
        return F ? E(k._name, F).then(() => {
          k.totalCount++, delete k._pendingSnapshots[y], w(k.dom, "ln-store:reverted", { store: k._name, record: F, action: "delete", error: R });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const F = k._pendingSnapshots[y];
        return !F || !F.length ? Promise.resolve() : ut(k._name, F).then(() => {
          k.totalCount += F.length, delete k._pendingSnapshots[y], w(k.dom, "ln-store:reverted", { store: k._name, record: null, ids: y.split(","), action: "bulk-delete", error: R });
        });
      }
    };
    return M[L] ? M[L]() : Promise.resolve();
  }, O.prototype.resolveConflict = function(y, L, D) {
    const k = this._pendingSnapshots[y];
    return k ? E(this._name, k).then(() => {
      delete this._pendingSnapshots[y], w(this.dom, "ln-store:conflict", {
        store: this._name,
        local: k,
        remote: L,
        field_diffs: D || null
      });
    }) : Promise.resolve();
  }, O.prototype.forceSync = function() {
    $(this);
  }, O.prototype.fullReload = function() {
    const y = this;
    return S(y._name).then(() => {
      y.isLoaded = !1, y.lastSyncedAt = null, y.totalCount = 0, $(y);
    });
  }, O.prototype.destroy = function() {
    if (this._handlers) {
      for (const [y, L] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${y}`, L);
      this._handlers = null;
    }
    delete r[this._name], Object.keys(r).length === 0 && (P && (document.removeEventListener("visibilitychange", P), P = null), H && (window.removeEventListener("online", H), H = null), X && (window.removeEventListener("offline", X), X = null)), delete this.dom[a], w(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function ft() {
    return l().then((y) => {
      if (!y) return;
      const L = Array.from(y.objectStoreNames);
      return new Promise((D, k) => {
        const R = y.transaction(L, "readwrite");
        L.forEach((M) => R.objectStore(M).clear()), R.oncomplete = () => D(), R.onerror = () => k(R.error);
      });
    }).then(() => {
      Object.values(r).forEach((y) => {
        y.isLoaded = !1, y.isSyncing = !1, y.lastSyncedAt = null, y.totalCount = 0;
      });
    });
  }
  B(h, a, O, "ln-data-store"), window[a].clearAll = ft, window[a].init = window[a], window[a].setStorageKey = Bt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Bt);
})();
(function() {
  const h = "data-ln-api-connector", a = "lnApiConnector", v = "lnConnector";
  if (window[a] !== void 0) return;
  function f(e) {
    return this.dom = e, e[a] = this, e[v] = this, this.refreshConfig(), this._handlers = null, g(this), this;
  }
  f.prototype.refreshConfig = function() {
    const e = this.dom;
    this.baseUrl = e.getAttribute("data-ln-api-base-url") || "", this.path = e.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const r = e.getAttribute("data-ln-api-headers") || "";
    this.headers = Wt(r, "ln-api-connector"), (r.toLowerCase().includes("authorization") || r.toLowerCase().includes("bearer") || r.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), w(e, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, f.prototype.fetchDelta = function(e) {
    const r = this;
    let t = K(r.baseUrl, r.path);
    return e != null && e !== "" && (t += (t.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(e)), window.fetch(t, { method: "GET", headers: W(r.headers), credentials: r.credentials }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    });
  }, f.prototype.create = function(e) {
    const r = this;
    return window.fetch(K(r.baseUrl, r.path), {
      method: "POST",
      headers: W(r.headers),
      credentials: r.credentials,
      body: JSON.stringify(e)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, f.prototype.update = function(e, r) {
    const t = this;
    return window.fetch(K(t.baseUrl, t.path, e), {
      method: "PUT",
      headers: W(t.headers),
      credentials: t.credentials,
      body: JSON.stringify(r)
    }).then((o) => {
      if (o.ok) return o.json();
      if (o.status === 409) return o.json().then((n) => {
        const i = new Error("Conflict");
        throw i.status = 409, i.data = n, i;
      });
      throw new Error("HTTP " + o.status + ": " + o.statusText);
    });
  }, f.prototype.delete = function(e) {
    const r = this;
    return window.fetch(K(r.baseUrl, r.path, e), {
      method: "DELETE",
      headers: W(r.headers),
      credentials: r.credentials
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, f.prototype.bulkDelete = function(e) {
    const r = this;
    return window.fetch(K(r.baseUrl, r.path) + "/bulk-delete", {
      method: "DELETE",
      headers: W(r.headers),
      credentials: r.credentials,
      body: JSON.stringify({ ids: e })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  };
  function g(e) {
    e._handlers = {
      sync: function(t) {
        const o = t.detail || {};
        e.fetchDelta(o.since).then(function(n) {
          w(e.dom, "ln-api-connector:fetched", { data: n, since: o.since });
        }).catch(function(n) {
          w(e.dom, "ln-api-connector:error", {
            action: "sync",
            error: n.message,
            status: n.status || 0,
            since: o.since
          });
        });
      },
      create: function(t) {
        const o = t.detail || {};
        e.create(o.data).then(function(n) {
          w(e.dom, "ln-api-connector:created", { record: n, tempId: o.tempId });
        }).catch(function(n) {
          w(e.dom, "ln-api-connector:error", {
            action: "create",
            error: n.message,
            status: n.status || 0,
            tempId: o.tempId
          });
        });
      },
      update: function(t) {
        const o = t.detail || {}, n = Object.assign({}, o.data);
        o.expected_version !== void 0 && (n.expected_version = o.expected_version), e.update(o.id, n).then(function(i) {
          w(e.dom, "ln-api-connector:updated", { record: i, id: o.id });
        }).catch(function(i) {
          w(e.dom, "ln-api-connector:error", {
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
        e.delete(o.id).then(function(n) {
          w(e.dom, "ln-api-connector:deleted", { response: n, id: o.id });
        }).catch(function(n) {
          w(e.dom, "ln-api-connector:error", {
            action: "delete",
            error: n.message,
            status: n.status || 0,
            id: o.id
          });
        });
      },
      bulkDelete: function(t) {
        const o = t.detail || {};
        e.bulkDelete(o.ids).then(function(n) {
          w(e.dom, "ln-api-connector:bulk-deleted", { response: n, ids: o.ids });
        }).catch(function(n) {
          w(e.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: n.message,
            status: n.status || 0,
            ids: o.ids
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      e.dom.addEventListener(t + ":request-sync", e._handlers.sync), e.dom.addEventListener(t + ":request-fetch", e._handlers.sync), e.dom.addEventListener(t + ":request-create", e._handlers.create), e.dom.addEventListener(t + ":request-update", e._handlers.update), e.dom.addEventListener(t + ":request-delete", e._handlers.delete), e.dom.addEventListener(t + ":request-bulk-delete", e._handlers.bulkDelete);
    });
  }
  f.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const e = this;
    e._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      e.dom.removeEventListener(t + ":request-sync", e._handlers.sync), e.dom.removeEventListener(t + ":request-fetch", e._handlers.sync), e.dom.removeEventListener(t + ":request-create", e._handlers.create), e.dom.removeEventListener(t + ":request-update", e._handlers.update), e.dom.removeEventListener(t + ":request-delete", e._handlers.delete), e.dom.removeEventListener(t + ":request-bulk-delete", e._handlers.bulkDelete);
    }), e._handlers = null), w(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[v];
  };
  function _(e) {
    const r = e[a];
    r && r.refreshConfig();
  }
  B(h, a, f, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", a = "lnCouchDbConnector", v = "lnConnector";
  if (window[a] !== void 0) return;
  function f(e) {
    return this.dom = e, e[a] = this, e[v] = this, this.refreshConfig(), this._handlers = null, g(this), this;
  }
  f.prototype.refreshConfig = function() {
    const e = this.dom;
    this.url = e.getAttribute("data-ln-couchdb-url") || "", this.db = e.getAttribute("data-ln-couchdb-db") || "", this.auth = e.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const r = e.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Wt(r, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), r.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), w(e, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, f.prototype.fetchDelta = function(e) {
    const r = this, t = ["include_docs=true", "feed=normal"];
    e && t.push("since=" + encodeURIComponent(e));
    const o = K(r.url, r.db, "_changes") + "?" + t.join("&");
    return window.fetch(o, { method: "GET", headers: W(r.headers, r.auth), credentials: r.credentials }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    }).then((n) => {
      const i = n.results || [];
      return {
        data: i.filter((u) => !u.deleted && u.doc).map((u) => Object.assign({}, u.doc, { id: u.doc._id })),
        deleted: i.filter((u) => u.deleted).map((u) => u.id),
        synced_at: n.last_seq || e || ""
      };
    });
  }, f.prototype.create = function(e) {
    const r = this, t = Object.assign({ _id: e.id }, e);
    return t._id || delete t._id, window.fetch(K(r.url, r.db), {
      method: "POST",
      headers: W(r.headers, r.auth),
      credentials: r.credentials,
      body: JSON.stringify(t)
    }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => Object.assign({}, t, { id: o.id, _id: o.id, _rev: o.rev }));
  }, f.prototype.update = function(e, r) {
    const t = this, o = Object.assign({ id: String(e), _id: String(e) }, r), n = o._rev || o.rev;
    return (n ? Promise.resolve(n) : window.fetch(K(t.url, t.db, null, e), { method: "GET", headers: W(t.headers, t.auth), credentials: t.credentials }).then((u) => {
      if (!u.ok) throw new Error("Could not retrieve document for revision mapping");
      return u.json().then((l) => l._rev);
    })).then((u) => {
      const l = Object.assign({}, o, { _rev: u });
      delete l.rev;
      const s = Object.assign(W(t.headers, t.auth), { "If-Match": u });
      return window.fetch(K(t.url, t.db, null, e), {
        method: "PUT",
        headers: s,
        credentials: t.credentials,
        body: JSON.stringify(l)
      }).then((c) => {
        if (c.ok) return c.json().then((p) => Object.assign({}, l, { _rev: p.rev }));
        if (c.status === 409) return c.json().then((p) => {
          const d = new Error("Conflict");
          throw d.status = 409, d.data = p, d;
        });
        throw new Error("HTTP " + c.status + ": " + c.statusText);
      });
    });
  }, f.prototype.delete = function(e, r) {
    const t = this;
    return (r ? Promise.resolve(r) : window.fetch(K(t.url, t.db, null, e), { method: "GET", headers: W(t.headers, t.auth), credentials: t.credentials }).then((n) => {
      if (!n.ok) throw new Error("Could not retrieve document for revision delete");
      return n.json().then((i) => i._rev);
    })).then((n) => {
      const i = K(t.url, t.db, null, e) + "?rev=" + encodeURIComponent(n);
      return window.fetch(i, { method: "DELETE", headers: W(t.headers, t.auth), credentials: t.credentials }).then((u) => {
        if (!u.ok) throw new Error("HTTP " + u.status + ": " + u.statusText);
        return u.json();
      });
    });
  }, f.prototype.bulkDelete = function(e) {
    const r = this;
    return !e || e.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch(K(r.url, r.db, "_all_docs"), {
      method: "POST",
      headers: W(r.headers, r.auth),
      credentials: r.credentials,
      body: JSON.stringify({ keys: e })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const n = (t.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return n.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(K(r.url, r.db, "_bulk_docs"), {
        method: "POST",
        headers: W(r.headers, r.auth),
        credentials: r.credentials,
        body: JSON.stringify({ docs: n })
      }).then((i) => {
        if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
        return i.json();
      }).then((i) => ({ ok: !0, results: i, deletedCount: n.length }));
    });
  };
  function g(e) {
    e._handlers = {
      sync: function(t) {
        const o = t.detail || {};
        e.fetchDelta(o.since).then(function(n) {
          w(e.dom, "ln-couchdb-connector:fetched", { data: n, since: o.since });
        }).catch(function(n) {
          w(e.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: n.message,
            status: n.status || 0,
            since: o.since
          });
        });
      },
      create: function(t) {
        const o = t.detail || {};
        e.create(o.data).then(function(n) {
          w(e.dom, "ln-couchdb-connector:created", { record: n, tempId: o.tempId });
        }).catch(function(n) {
          w(e.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: n.message,
            status: n.status || 0,
            tempId: o.tempId
          });
        });
      },
      update: function(t) {
        const o = t.detail || {}, n = Object.assign({}, o.data);
        o.expected_version !== void 0 && (n._rev = o.expected_version), e.update(o.id, n).then(function(i) {
          w(e.dom, "ln-couchdb-connector:updated", { record: i, id: o.id });
        }).catch(function(i) {
          w(e.dom, "ln-couchdb-connector:error", {
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
        e.delete(o.id, o.rev).then(function(n) {
          w(e.dom, "ln-couchdb-connector:deleted", { response: n, id: o.id });
        }).catch(function(n) {
          w(e.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: n.message,
            status: n.status || 0,
            id: o.id
          });
        });
      },
      bulkDelete: function(t) {
        const o = t.detail || {};
        e.bulkDelete(o.ids).then(function(n) {
          w(e.dom, "ln-couchdb-connector:bulk-deleted", { response: n, ids: o.ids });
        }).catch(function(n) {
          w(e.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: n.message,
            status: n.status || 0,
            ids: o.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      e.dom.addEventListener(t + ":request-sync", e._handlers.sync), e.dom.addEventListener(t + ":request-fetch", e._handlers.sync), e.dom.addEventListener(t + ":request-create", e._handlers.create), e.dom.addEventListener(t + ":request-update", e._handlers.update), e.dom.addEventListener(t + ":request-delete", e._handlers.delete), e.dom.addEventListener(t + ":request-bulk-delete", e._handlers.bulkDelete);
    });
  }
  f.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const e = this;
    e._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      e.dom.removeEventListener(t + ":request-sync", e._handlers.sync), e.dom.removeEventListener(t + ":request-fetch", e._handlers.sync), e.dom.removeEventListener(t + ":request-create", e._handlers.create), e.dom.removeEventListener(t + ":request-update", e._handlers.update), e.dom.removeEventListener(t + ":request-delete", e._handlers.delete), e.dom.removeEventListener(t + ":request-bulk-delete", e._handlers.bulkDelete);
    }), e._handlers = null), w(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[a], delete this.dom[v];
  };
  function _(e) {
    const r = e[a];
    r && r.refreshConfig();
  }
  B(h, a, f, "ln-couchdb-connector", {
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
  const h = "data-ln-data-coordinator", a = "lnDataCoordinator", v = "lnCoordinator";
  if (window[a] !== void 0) return;
  function f(e) {
    return this.dom = e, this._name = e.getAttribute(h), e[a] = this, e[v] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this.refreshMapper(), g(this), this;
  }
  f.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const r = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    r && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(r)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(t) {
      return t;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(t) {
      return t;
    });
  }, f.prototype.findChildren = function() {
    const e = this.dom.querySelector("[data-ln-data-store]"), r = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]");
    return {
      storeEl: e,
      connectorEl: r,
      store: e ? e.lnDataStore || e.lnStore : null,
      connector: r ? r.lnConnector || r.lnApiConnector || r.lnCouchDbConnector : null
    };
  };
  function g(e) {
    e._handlers = {
      sync: function(r) {
        e.refreshMapper();
        const t = e.findChildren();
        if (!t.store || !t.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        const o = r.detail.since;
        t.connector.fetchDelta(o).then(function(n) {
          let i = [], u = [], l = null;
          n && Array.isArray(n) ? (i = n, l = Math.floor(Date.now() / 1e3)) : n && (i = Array.isArray(n.data) ? n.data : [], u = Array.isArray(n.deleted) ? n.deleted : [], l = n.synced_at !== void 0 ? n.synced_at : n.since !== void 0 ? n.since : null);
          const s = i.map((c) => e.mapper.ingress(c));
          t.store.applySync(s, u, l);
        }).catch(function(n) {
          console.error("[ln-data-coordinator] Sync failed:", n);
        });
      },
      create: function(r) {
        e.refreshMapper();
        const t = e.findChildren();
        if (!t.store || !t.connector) return;
        const o = r.detail.tempId, n = r.detail.data || {}, i = e.mapper.egress(n);
        t.connector.create(i).then(function(u) {
          const l = e.mapper.ingress(u);
          t.store.confirmMutation(o, l, "create");
        }).catch(function(u) {
          console.error("[ln-data-coordinator] Create mutation failed:", u), t.store.revertMutation(o, "create", u.message || u);
        });
      },
      update: function(r) {
        e.refreshMapper();
        const t = e.findChildren();
        if (!t.store || !t.connector) return;
        const o = r.detail.id, n = r.detail.expected_version;
        t.store.getById(o).then(function(i) {
          if (!i) throw new Error("Record not found in cache store: " + o);
          const u = Object.assign({}, i);
          delete u._pending;
          const l = e.mapper.egress(u);
          return t.connector.update(o, l, n);
        }).then(function(i) {
          const u = e.mapper.ingress(i);
          t.store.confirmMutation(o, u, "update");
        }).catch(function(i) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", i), i.status === 409) {
            const u = i.data && i.data.remote ? e.mapper.ingress(i.data.remote) : null, l = i.data ? i.data.field_diffs : null;
            t.store.resolveConflict(o, u, l);
          } else
            t.store.revertMutation(o, "update", i.message || i);
        });
      },
      delete: function(r) {
        e.refreshMapper();
        const t = e.findChildren();
        if (!t.store || !t.connector) return;
        const o = r.detail.id;
        t.connector.delete(o).then(function() {
          t.store.confirmMutation(o, null, "delete");
        }).catch(function(n) {
          console.error("[ln-data-coordinator] Delete mutation failed:", n), t.store.revertMutation(o, "delete", n.message || n);
        });
      },
      bulkDelete: function(r) {
        e.refreshMapper();
        const t = e.findChildren();
        if (!t.store || !t.connector) return;
        const o = r.detail.ids || [], n = o.join(",");
        t.connector.bulkDelete(o).then(function() {
          t.store.confirmMutation(n, null, "bulk-delete");
        }).catch(function(i) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", i), t.store.revertMutation(n, "bulk-delete", i.message || i);
        });
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(r) {
        e._serveData(r, "table");
      },
      reqListData: function(r) {
        e._serveData(r, "list");
      },
      reqOptions: function(r) {
        e._serveOptions(r);
      },
      reqStat: function(r) {
        e._serveStat(r);
      },
      refresh: function() {
        e._refreshAll();
      },
      refreshSynced: function(r) {
        r.detail && r.detail.changed && e._refreshAll();
      }
    }, e.dom.addEventListener("ln-store:request-remote-sync", e._handlers.sync), e.dom.addEventListener("ln-store:request-remote-create", e._handlers.create), e.dom.addEventListener("ln-store:request-remote-update", e._handlers.update), e.dom.addEventListener("ln-store:request-remote-delete", e._handlers.delete), e.dom.addEventListener("ln-store:request-remote-bulk-delete", e._handlers.bulkDelete), document.addEventListener("ln-table:request-data", e._handlers.reqTableData), document.addEventListener("ln-list:request-data", e._handlers.reqListData), document.addEventListener("ln-options:request-data", e._handlers.reqOptions), document.addEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.addEventListener("ln-store:ready", e._handlers.refresh), e.dom.addEventListener("ln-store:loaded", e._handlers.refresh), e.dom.addEventListener("ln-store:created", e._handlers.refresh), e.dom.addEventListener("ln-store:updated", e._handlers.refresh), e.dom.addEventListener("ln-store:deleted", e._handlers.refresh), e.dom.addEventListener("ln-store:synced", e._handlers.refreshSynced);
  }
  f.prototype._ownsStore = function(e) {
    const r = this.findChildren();
    return !!(r.store && r.store._name === e && e);
  }, f.prototype._harvestFilterOptions = function(e) {
    const r = {}, t = e.querySelectorAll("th[data-ln-table-col]");
    for (let o = 0; o < t.length; o++) {
      const n = t[o];
      if (!n.querySelector("[data-ln-table-col-filter]")) continue;
      const i = n.getAttribute("data-ln-table-filter-options");
      if (!i) continue;
      const u = n.getAttribute("data-ln-table-col");
      try {
        r[u] = JSON.parse(i);
      } catch {
        console.warn('[ln-data-coordinator] bad filter-options JSON on column "' + u + '"');
      }
    }
    return r;
  }, f.prototype._serveData = function(e, r) {
    const t = e.target, o = r === "table" ? "data-ln-table-store" : "data-ln-list-store", n = t.getAttribute(o);
    if (!n || !this._ownsStore(n)) return;
    this._boundQueries.set(t, {
      sort: e.detail.sort,
      filters: e.detail.filters,
      search: e.detail.search
    });
    const i = this.findChildren().store;
    if (!i.isLoaded) {
      w(t, "ln-" + r + ":set-loading", { loading: !0 });
      return;
    }
    const u = this, l = { sort: e.detail.sort, filters: e.detail.filters, search: e.detail.search }, s = r === "table" ? u._harvestFilterOptions(t) : void 0;
    i.getAll(l).then(function(c) {
      const p = { data: c.data, total: c.total, filtered: c.filtered };
      s && (p.filterOptions = s), w(t, "ln-" + r + ":set-data", p), u._boundDelivered.set(t, !0);
    });
  }, f.prototype._serveOptions = function(e) {
    const r = e.target, t = r.getAttribute("data-ln-options");
    if (!this._ownsStore(t)) return;
    this.findChildren().store.getAll({}).then(function(n) {
      w(r, "ln-options:set-data", { data: n.data });
    });
  }, f.prototype._serveStat = function(e) {
    const r = e.target, t = r.getAttribute("data-ln-stat");
    if (!this._ownsStore(t)) return;
    const o = e.detail.filters || null;
    this.findChildren().store.count(o).then(function(i) {
      w(r, "ln-stat:set-count", { count: i });
    });
  }, f.prototype._refreshAll = function() {
    const e = this, r = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let t = 0; t < r.length; t++) {
      const o = r[t];
      let n, i;
      if (o.hasAttribute("data-ln-table-store") ? (n = o.getAttribute("data-ln-table-store"), i = "table") : o.hasAttribute("data-ln-list-store") ? (n = o.getAttribute("data-ln-list-store"), i = "list") : o.hasAttribute("data-ln-options") ? (n = o.getAttribute("data-ln-options"), i = "options") : o.hasAttribute("data-ln-stat") && (n = o.getAttribute("data-ln-stat"), i = "stat"), !this._ownsStore(n)) continue;
      const u = this.findChildren().store;
      if (i === "table" || i === "list") {
        const l = e._boundQueries.get(o) || { sort: null, filters: {}, search: "" }, s = i === "table" ? e._harvestFilterOptions(o) : void 0;
        (function(c, p, d) {
          u.getAll(l).then(function(m) {
            const b = { data: m.data, total: m.total, filtered: m.filtered };
            d && (b.filterOptions = d), w(c, "ln-" + p + ":set-data", b), e._boundDelivered.set(c, !0);
          });
        })(o, i, s);
      } else if (i === "options")
        (function(l) {
          u.getAll({}).then(function(s) {
            w(l, "ln-options:set-data", { data: s.data });
          });
        })(o);
      else if (i === "stat") {
        const l = o.getAttribute("data-ln-stat-filter");
        let s = null;
        if (l) {
          const c = l.indexOf(":");
          if (c !== -1) {
            const p = l.slice(0, c), d = l.slice(c + 1);
            s = {}, s[p] = [d];
          }
        }
        (function(c, p) {
          u.count(p).then(function(d) {
            w(c, "ln-stat:set-count", { count: d });
          });
        })(o, s);
      }
    }
  }, f.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const e = this;
    e._handlers && (e.dom.removeEventListener("ln-store:request-remote-sync", e._handlers.sync), e.dom.removeEventListener("ln-store:request-remote-create", e._handlers.create), e.dom.removeEventListener("ln-store:request-remote-update", e._handlers.update), e.dom.removeEventListener("ln-store:request-remote-delete", e._handlers.delete), e.dom.removeEventListener("ln-store:request-remote-bulk-delete", e._handlers.bulkDelete), document.removeEventListener("ln-table:request-data", e._handlers.reqTableData), document.removeEventListener("ln-list:request-data", e._handlers.reqListData), document.removeEventListener("ln-options:request-data", e._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", e._handlers.reqStat), e.dom.removeEventListener("ln-store:ready", e._handlers.refresh), e.dom.removeEventListener("ln-store:loaded", e._handlers.refresh), e.dom.removeEventListener("ln-store:created", e._handlers.refresh), e.dom.removeEventListener("ln-store:updated", e._handlers.refresh), e.dom.removeEventListener("ln-store:deleted", e._handlers.refresh), e.dom.removeEventListener("ln-store:synced", e._handlers.refreshSynced), e._handlers = null), e._boundQueries = null, e._boundDelivered = null, delete this.dom[a], delete this.dom[v];
  };
  function _(e, r) {
    const t = e[a];
    t && r === "data-ln-data-mapper" && t.refreshMapper();
  }
  B(h, a, f, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-options", a = "lnOptions";
  if (window[a] !== void 0) return;
  function v(f) {
    this.dom = f, this._storeName = f.getAttribute(h), this._valueField = f.getAttribute("data-ln-options-value") || "id", this._labelField = f.getAttribute("data-ln-options-label") || "name";
    const g = this;
    return this._onSetData = function(_) {
      g._rebuild(_.detail.data || []);
    }, f.addEventListener("ln-options:set-data", this._onSetData), w(f, "ln-options:request-data", { options: this._storeName }), this;
  }
  v.prototype._rebuild = function(f) {
    const g = this.dom, _ = this._valueField, e = this._labelField, r = g.value, t = g.querySelectorAll("option");
    for (let n = t.length - 1; n >= 0; n--)
      t[n].value !== "" && g.removeChild(t[n]);
    for (let n = 0; n < f.length; n++) {
      const i = f[n], u = document.createElement("option");
      u.value = String(i[_]), u.textContent = i[e] != null ? i[e] : "", g.appendChild(u);
    }
    const o = g.options;
    for (let n = 0; n < o.length; n++)
      if (o[n].value === r) {
        g.value = r;
        break;
      }
  }, v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[a]);
  }, B(h, a, v, "ln-options");
})();
(function() {
  const h = "data-ln-stat", a = "lnStat";
  if (window[a] !== void 0) return;
  function v(g) {
    if (!g) return null;
    const _ = g.indexOf(":");
    if (_ === -1) return null;
    const e = g.slice(0, _), r = g.slice(_ + 1), t = {};
    return t[e] = [r], t;
  }
  function f(g) {
    return this.dom = g, this._storeName = g.getAttribute(h), this._filters = v(g.getAttribute("data-ln-stat-filter")), this._onSetCount = function(_) {
      g.textContent = String(_.detail.count), g.classList.remove("is-loading");
    }, g.addEventListener("ln-stat:set-count", this._onSetCount), w(g, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  f.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[a]);
  }, B(h, a, f, "ln-stat");
})();
(function() {
  const h = "data-ln-store-notify", a = "lnStoreNotify";
  if (window[a] !== void 0) return;
  function v(g, _, e) {
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: g, title: _, message: e }
    }));
  }
  function f(g) {
    this.dom = g, this._savedTitle = g.getAttribute("data-ln-store-notify-saved") || null, this._deletedTitle = g.getAttribute("data-ln-store-notify-deleted") || null, this._failedTitle = g.getAttribute("data-ln-store-notify-failed") || null;
    const _ = this;
    return this._onConfirmed = function(e) {
      const r = e.detail || {}, t = r.action || "confirmed";
      let o, n;
      if (t === "create" || t === "update")
        o = _._savedTitle || t, n = r.record && r.record.name ? r.record.name : void 0;
      else if (t === "delete")
        o = _._deletedTitle || t, n = void 0;
      else if (t === "bulk-delete") {
        o = _._deletedTitle || t;
        const i = r.ids ? r.ids.length : 0;
        n = i ? String(i) : void 0;
      } else
        o = _._savedTitle || t, n = void 0;
      v("success", o, n);
    }, this._onReverted = function(e) {
      const r = e.detail || {}, t = r.action || "reverted", o = _._failedTitle || t, n = r.error ? String(r.error) : void 0;
      v("error", o, n);
    }, g.addEventListener("ln-store:confirmed", this._onConfirmed), g.addEventListener("ln-store:reverted", this._onReverted), this;
  }
  f.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-store:confirmed", this._onConfirmed), this.dom.removeEventListener("ln-store:reverted", this._onReverted), delete this.dom[a]);
  }, B(h, a, f, "ln-store-notify");
})();
(function() {
  const h = "ln-icons-sprite", a = "#ln-", v = "#lnc-", f = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let _ = null;
  const e = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), r = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", o = "lni:v", n = "1";
  function i() {
    try {
      if (localStorage.getItem(o) !== n) {
        for (let m = localStorage.length - 1; m >= 0; m--) {
          const b = localStorage.key(m);
          b && b.indexOf(t) === 0 && localStorage.removeItem(b);
        }
        localStorage.setItem(o, n);
      }
    } catch {
    }
  }
  i();
  function u() {
    return _ || (_ = document.getElementById(h), _ || (_ = document.createElementNS("http://www.w3.org/2000/svg", "svg"), _.id = h, _.setAttribute("hidden", ""), _.setAttribute("aria-hidden", "true"), _.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(_, document.body.firstChild))), _;
  }
  function l(m) {
    return m.indexOf(v) === 0 ? r + "/" + m.slice(v.length) + ".svg" : e + "/" + m.slice(a.length) + ".svg";
  }
  function s(m, b) {
    const E = b.match(/viewBox="([^"]+)"/), A = E ? E[1] : "0 0 24 24", S = b.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = S ? S[1].trim() : "", T = b.match(/<svg([^>]*)>/i), x = T ? T[1] : "", O = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    O.id = m, O.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const N = x.match(new RegExp(I + '="([^"]*)"'));
      N && O.setAttribute(I, N[1]);
    }), O.innerHTML = C, u().querySelector("defs").appendChild(O);
  }
  function c(m) {
    if (f.has(m) || g.has(m) || m.indexOf(v) === 0 && !r) return;
    const b = m.slice(1);
    try {
      const E = localStorage.getItem(t + b);
      if (E) {
        s(b, E), f.add(m);
        return;
      }
    } catch {
    }
    g.add(m), fetch(l(m)).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      s(b, E), f.add(m), g.delete(m);
      try {
        localStorage.setItem(t + b, E);
      } catch {
      }
    }).catch(function() {
      g.delete(m);
    });
  }
  function p(m) {
    const b = 'use[href^="' + a + '"], use[href^="' + v + '"]', E = m.querySelectorAll ? m.querySelectorAll(b) : [];
    if (m.matches && m.matches(b)) {
      const A = m.getAttribute("href");
      A && c(A);
    }
    Array.prototype.forEach.call(E, function(A) {
      const S = A.getAttribute("href");
      S && c(S);
    });
  }
  function d() {
    p(document), new MutationObserver(function(m) {
      m.forEach(function(b) {
        if (b.type === "childList")
          b.addedNodes.forEach(function(E) {
            E.nodeType === 1 && p(E);
          });
        else if (b.type === "attributes" && b.attributeName === "href") {
          const E = b.target.getAttribute("href");
          E && (E.indexOf(a) === 0 || E.indexOf(v) === 0) && c(E);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
(function() {
  const h = "data-ln-debug", a = "lnDebug";
  if (window[a] !== void 0) return;
  function v(f) {
    return this.dom = f, this;
  }
  v.prototype.destroy = function() {
    delete this.dom[a];
  }, B(h, a, v, "ln-debug");
})();
