if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...d) {
    typeof d[0] == "string" && (d[0].startsWith("[ln-") || d[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, d);
  };
}
const Tt = {};
function vt(h, d) {
  Tt[h] || (Tt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const b = Tt[h];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (d || "ln-core") + '] Template "' + h + '" not found'), null);
}
function w(h, d, b) {
  h.dispatchEvent(new CustomEvent(d, {
    bubbles: !0,
    detail: b || {}
  }));
}
function z(h, d, b) {
  const m = new CustomEvent(d, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return h.dispatchEvent(m), m;
}
function Ut(h, d, b) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const m = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  m[b] = h.name, w(h.dom, d, m);
}
function Y(h, d) {
  if (!h || !d) return h;
  const b = h.querySelectorAll("[data-ln-field]");
  for (let n = 0; n < b.length; n++) {
    const r = b[n], t = r.getAttribute("data-ln-field");
    d[t] != null && (r.textContent = d[t]);
  }
  const m = h.querySelectorAll("[data-ln-attr]");
  for (let n = 0; n < m.length; n++) {
    const r = m[n], t = r.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const i = e[0].trim(), u = e[1].trim();
      d[u] != null && r.setAttribute(i, d[u]);
    }
  }
  const p = h.querySelectorAll("[data-ln-show]");
  for (let n = 0; n < p.length; n++) {
    const r = p[n], t = r.getAttribute("data-ln-show");
    t in d && r.classList.toggle("hidden", !d[t]);
  }
  const f = h.querySelectorAll("[data-ln-class]");
  for (let n = 0; n < f.length; n++) {
    const r = f[n], t = r.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const i = e[0].trim(), u = e[1].trim();
      u in d && r.classList.toggle(i, !!d[u]);
    }
  }
  return h;
}
function _t(h, d) {
  if (!h || !d) return h;
  const b = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const m = b.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(p, f) {
        return d[f] !== void 0 ? d[f] : "";
      }
    ));
  }
  return h;
}
function ie(h, d, b, m, p, f) {
  const n = {};
  for (let t = 0; t < h.children.length; t++) {
    const o = h.children[t], e = o.getAttribute("data-ln-key");
    e && (n[e] = o);
  }
  const r = document.createDocumentFragment();
  for (let t = 0; t < d.length; t++) {
    const o = d[t], e = String(m(o));
    let i = n[e];
    if (i)
      p(i, o, t);
    else {
      const u = vt(b, f);
      if (!u || (_t(u, o), i = u.firstElementChild, !i)) continue;
      i.setAttribute("data-ln-key", e), p(i, o, t);
    }
    r.appendChild(i);
  }
  h.textContent = "", h.appendChild(r);
}
function G(h, d) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      G(h, d);
    }), console.warn("[" + d + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function Q(h, d, b) {
  if (h) {
    const m = h.querySelector('[data-ln-template="' + d + '"]');
    if (m) return m.content.cloneNode(!0);
  }
  return vt(d, b);
}
function oe(h, d) {
  const b = {}, m = h.querySelectorAll("[" + d + "]");
  for (let p = 0; p < m.length; p++)
    b[m[p].getAttribute(d)] = m[p].textContent, m[p].remove();
  return b;
}
function kt(h, d, b, m) {
  if (h.nodeType !== 1) return;
  const f = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", n = Array.from(h.querySelectorAll(f));
  h.matches && h.matches(f) && n.push(h);
  for (const r of n)
    r[b] || (r[b] = new m(r));
}
function gt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function jt(h, d) {
  const b = !!(d && d.typed), m = {}, p = h.elements, f = {};
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
function zt(h, d) {
  const b = h.elements, m = [];
  for (let p = 0; p < b.length; p++) {
    const f = b[p];
    if (!f.name || !(f.name in d) || f.type === "file" || f.type === "submit" || f.type === "button") continue;
    const n = d[f.name];
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
function X(h) {
  const d = h ? h.closest("[lang]") : null;
  return (d ? d.lang : null) || (document.documentElement ? document.documentElement.lang : null) || navigator.language;
}
function Ft(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function Vt(h, d, { get: b, set: m }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return b ? b.call(this) : d.get.call(this);
    },
    set: function(p) {
      m ? m.call(this, p, (f) => d.set.call(this, f)) : d.set.call(this, p);
    },
    configurable: !0
  });
}
function B(h, d, b, m, p = {}) {
  const f = p.extraAttributes || [], n = p.onAttributeChange || null, r = p.onInit || null;
  function t(o) {
    const e = o || document.body;
    kt(e, h, d, b), r && r(e);
  }
  return G(function() {
    const o = new MutationObserver(function(i) {
      for (let u = 0; u < i.length; u++) {
        const l = i[u];
        if (l.type === "childList") {
          for (let s = 0; s < l.addedNodes.length; s++) {
            const c = l.addedNodes[s];
            c.nodeType === 1 && (kt(c, h, d, b), r && r(c));
          }
          for (let s = 0; s < l.removedNodes.length; s++) {
            const c = l.removedNodes[s];
            if (c.nodeType === 1) {
              const a = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", _ = Array.from(c.querySelectorAll(a));
              c.matches && c.matches(a) && _.push(c);
              for (let y = 0; y < _.length; y++) {
                const E = _[y];
                if (!document.contains(E)) {
                  const S = E[d];
                  S && typeof S.destroy == "function" && S.destroy();
                }
              }
            }
          }
        } else l.type === "attributes" && (n && l.target[d] ? n(l.target, l.attributeName) : (kt(l.target, h, d, b), r && r(l.target)));
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
  }, m || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[d] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function Kt(h, d) {
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
function Wt(h, d = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (b) {
    return console.error(`[${d}] Invalid headers JSON:`, b), {};
  }
}
const Gt = {};
function re(h, d) {
  Gt[h] = d;
}
function se(h) {
  return Gt[h] || { ingress: (d) => d, egress: (d) => d };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = re, window.lnCore.getDataMapper = se, window.lnCore.fillTemplate = _t, window.lnCore.fill = Y, window.lnCore.renderList = ie);
function le(h, d) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, h(), d && d();
    }));
  };
}
const ae = "ln:";
function ce() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function $t(h, d) {
  const b = d.getAttribute("data-ln-persist"), m = b !== null && b !== "" ? b : d.id;
  return m ? ae + h + ":" + ce() + ":" + m : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', d), null);
}
function St(h, d) {
  const b = $t(h, d);
  if (!b) return null;
  try {
    const m = localStorage.getItem(b);
    return m !== null ? JSON.parse(m) : null;
  } catch {
    return null;
  }
}
function lt(h, d, b) {
  const m = $t(h, d);
  if (m)
    try {
      localStorage.setItem(m, JSON.stringify(b));
    } catch {
    }
}
function Et(h, d, b, m) {
  const p = typeof m == "number" ? m : 4, f = window.innerWidth, n = window.innerHeight, r = d.width, t = d.height, o = (b || "bottom").split("-"), e = o[0], i = o[1] === "start" || o[1] === "end" ? o[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, l = u[e] || u.bottom;
  function s(y) {
    return y === "top" || y === "bottom" ? i === "start" ? h.left : i === "end" ? h.right - r : h.left + (h.width - r) / 2 : i === "start" ? h.top : i === "end" ? h.bottom - t : h.top + (h.height - t) / 2;
  }
  function c(y) {
    let E, S, A = !0;
    return y === "top" ? (E = h.top - p - t, S = s(y), E < 0 && (A = !1)) : y === "bottom" ? (E = h.bottom + p, S = s(y), E + t > n && (A = !1)) : y === "left" ? (E = s(y), S = h.left - p - r, S < 0 && (A = !1)) : (E = s(y), S = h.right + p, S + r > f && (A = !1)), { top: E, left: S, side: y, fits: A };
  }
  let g = null;
  for (let y = 0; y < l.length; y++) {
    const E = c(l[y]);
    if (E.fits) {
      g = E;
      break;
    }
  }
  g || (g = c(l[0]));
  let a = g.top, _ = g.left;
  return r >= f ? _ = 0 : (_ < 0 && (_ = 0), _ + r > f && (_ = f - r)), t >= n ? a = 0 : (a < 0 && (a = 0), a + t > n && (a = n - t)), { top: a, left: _, placement: g.side };
}
function Yt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const d = h.parentNode, b = document.createComment("ln-teleport");
  return d.insertBefore(b, h), document.body.appendChild(h), function() {
    b.parentNode && (b.parentNode.insertBefore(h, b), b.parentNode.removeChild(b));
  };
}
function Dt(h) {
  if (!h) return { width: 0, height: 0 };
  const d = h.style, b = d.visibility, m = d.display, p = d.position;
  d.visibility = "hidden", d.display = "block", d.position = "fixed";
  const f = h.offsetWidth, n = h.offsetHeight;
  return d.visibility = b, d.display = m, d.position = p, { width: f, height: n };
}
let rt = null;
async function Bt(h) {
  if (!h) {
    rt = null;
    return;
  }
  try {
    const d = new TextEncoder(), b = await crypto.subtle.digest("SHA-256", d.encode(h));
    rt = await crypto.subtle.importKey(
      "raw",
      b,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (d) {
    console.error("[ln-core/crypto] Key derivation failed:", d), rt = null;
  }
}
function mt() {
  return rt;
}
async function de(h, d = rt) {
  const b = d || rt;
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
async function ue(h, d = rt) {
  const b = d || rt;
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
  const h = window.fetch.bind(window), d = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
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
  function r(o, e) {
    e = e || {};
    const i = m(o), u = p(o, e), l = f(i, u);
    n(u) && d.has(l) && (d.get(l).abort(), d.delete(l));
    const s = new AbortController(), c = e.signal;
    c && (c.aborted ? s.abort(c.reason) : c.addEventListener("abort", function() {
      s.abort(c.reason);
    }, { once: !0 }));
    const g = Object.assign({}, e, { signal: s.signal });
    return d.set(l, s), h(o, g).finally(function() {
      d.get(l) === s && d.delete(l);
    });
  }
  r.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = r;
  function t(o) {
    const e = o.detail || {};
    if (!e.url) return;
    const i = o.target, u = (e.method || (e.body ? "POST" : "GET")).toUpperCase(), l = e.key;
    l && b.has(l) && (b.get(l).abort(), b.delete(l));
    const s = new AbortController(), c = e.signal;
    c && (c.aborted ? s.abort(c.reason) : c.addEventListener("abort", function() {
      s.abort(c.reason);
    }, { once: !0 })), l && b.set(l, s);
    const g = { method: u, signal: s.signal };
    e.body !== void 0 && (g.body = e.body), window.fetch(e.url, g).then(function(a) {
      l && b.get(l) === s && b.delete(l), w(i, "ln-http:response", {
        ok: a.ok,
        status: a.status,
        response: a
      });
    }).catch(function(a) {
      l && b.get(l) === s && b.delete(l), !(a && a.name === "AbortError") && w(i, "ln-http:error", {
        ok: !1,
        status: 0,
        error: a
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(o) {
      let e = !1;
      return d.forEach(function(i, u) {
        u.endsWith(" " + o) && (i.abort(), d.delete(u), e = !0);
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
      return d.forEach(function(e, i) {
        const u = i.indexOf(" ");
        o.push({ method: i.slice(0, u), url: i.slice(u + 1) });
      }), b.forEach(function(e, i) {
        o.push({ key: i });
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
    const i = r(e);
    m(i.links), p(i.forms);
  }
  function m(e) {
    for (const i of e) {
      if (i[d + "Trigger"] || i.hostname && i.hostname !== window.location.hostname) continue;
      const u = i.getAttribute("href");
      if (u && u.includes("#")) continue;
      const l = function(s) {
        if (!Kt(s, i)) return;
        s.preventDefault();
        const c = i.getAttribute("href");
        c && n("GET", c, null, i);
      };
      i.addEventListener("click", l), i[d + "Trigger"] = l;
    }
  }
  function p(e) {
    for (const i of e) {
      if (i[d + "Trigger"]) continue;
      const u = function(l) {
        l.preventDefault();
        const s = i.method.toUpperCase(), c = i.action, g = new FormData(i);
        for (const a of i.querySelectorAll('button, input[type="submit"]'))
          a.disabled = !0;
        n(s, c, g, i, function() {
          for (const a of i.querySelectorAll('button, input[type="submit"]'))
            a.disabled = !1;
        });
      };
      i.addEventListener("submit", u), i[d + "Trigger"] = u;
    }
  }
  function f(e) {
    if (!e[d]) return;
    const i = r(e);
    for (const u of i.links)
      u[d + "Trigger"] && (u.removeEventListener("click", u[d + "Trigger"]), delete u[d + "Trigger"]);
    for (const u of i.forms)
      u[d + "Trigger"] && (u.removeEventListener("submit", u[d + "Trigger"]), delete u[d + "Trigger"]);
    delete e[d];
  }
  function n(e, i, u, l, s) {
    if (z(l, "ln-ajax:before-start", { method: e, url: i }).defaultPrevented) return;
    w(l, "ln-ajax:start", { method: e, url: i }), l.classList.add("ln-ajax--loading");
    const g = document.createElement("span");
    g.className = "ln-ajax-spinner", l.appendChild(g);
    function a() {
      l.classList.remove("ln-ajax--loading");
      const A = l.querySelector(".ln-ajax-spinner");
      A && A.remove(), s && s();
    }
    let _ = i;
    const y = document.querySelector('meta[name="csrf-token"]'), E = y ? y.getAttribute("content") : null;
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
      _ = i + (i.includes("?") ? "&" : "?") + A.toString();
    } else e !== "GET" && u && (S.body = u);
    fetch(_, S).then(function(A) {
      const L = A.ok;
      return A.json().then(function(k) {
        return { ok: L, status: A.status, data: k };
      });
    }).then(function(A) {
      const L = A.data;
      if (A.ok) {
        if (L.title && (document.title = L.title), L.content)
          for (const k in L.content) {
            const x = document.getElementById(k);
            if (x) {
              let O = L.content[k];
              window.DOMPurify && typeof window.DOMPurify.sanitize == "function" ? O = window.DOMPurify.sanitize(O) : O = O.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""), x.innerHTML = O;
            }
          }
        if (l.tagName === "A") {
          const k = l.getAttribute("href");
          k && window.history.pushState({ ajax: !0 }, "", k);
        } else l.tagName === "FORM" && l.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
        w(l, "ln-ajax:success", { method: e, url: _, data: L });
      } else
        w(l, "ln-ajax:error", { method: e, url: _, status: A.status, data: L });
      if (L.message) {
        const k = L.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: k.type || (A.ok ? "success" : "error"),
            title: k.title || "",
            message: k.body || ""
          }
        }));
      }
      w(l, "ln-ajax:complete", { method: e, url: _ }), a();
    }).catch(function(A) {
      w(l, "ln-ajax:error", { method: e, url: _, error: A }), w(l, "ln-ajax:complete", { method: e, url: _ }), a();
    });
  }
  function r(e) {
    const i = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? i.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? i.forms.push(e) : (i.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), i.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), i;
  }
  function t() {
    G(function() {
      new MutationObserver(function(i) {
        for (const u of i)
          if (u.type === "childList") {
            for (const l of u.addedNodes)
              if (l.nodeType === 1 && (b(l), !l.hasAttribute(h))) {
                for (const c of l.querySelectorAll("[" + h + "]"))
                  b(c);
                const s = l.closest && l.closest("[" + h + "]");
                if (s && s.getAttribute(h) !== "false") {
                  const c = r(l);
                  m(c.links), p(c.forms);
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
  window[d] = b, window[d].destroy = f, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
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
const at = /* @__PURE__ */ new Map();
let qt = [], Pt = !1, Ot = null, Xt = {}, Qt = {}, xt = null, It = !1;
function Zt(h, d, b) {
  It ? queueMicrotask(function() {
    w(h, d, b);
  }) : w(h, d, b);
}
function At(h) {
  let [d] = h.split("#"), [b, m] = d.split("?");
  const p = {};
  if (m) {
    const f = new URLSearchParams(m);
    for (const [n, r] of f.entries())
      p[n] = r;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: p };
}
function te(h, d) {
  if (h.pattern === "*") return 1;
  if (d.pattern === "*") return -1;
  const b = h.segments, m = d.segments, p = Math.max(b.length, m.length);
  for (let f = 0; f < p; f++) {
    const n = b[f], r = m[f];
    if (n === void 0) return 1;
    if (r === void 0) return -1;
    if (n === "*") return 1;
    if (r === "*") return -1;
    const t = n.startsWith(":"), o = r.startsWith(":");
    if (t && !o) return 1;
    if (!t && o) return -1;
  }
  return 0;
}
function wt(h) {
  const d = h.split("/").filter(Boolean);
  for (const b of qt) {
    if (b.pattern === "*")
      return {
        route: b,
        params: { wildcard: h }
      };
    const m = b.segments, p = {};
    let f = !0;
    if (!(d.length > m.length && m[m.length - 1] !== "*")) {
      for (let n = 0; n < m.length; n++) {
        const r = m[n], t = d[n];
        if (r === "*") {
          p.wildcard = d.slice(n).join("/");
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
      if (f && (m.indexOf("*") !== -1 || d.length <= m.length))
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
  const d = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return d || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), d;
}
function fe(h) {
  if (!h) return;
  const d = Array.from(h.querySelectorAll("*")), b = [h].concat(d);
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
function Lt(h, d, b, m, p = {}) {
  const f = Mt(h);
  if (!f || z(f, "ln-router:before-navigate", {
    from: Ot,
    to: m,
    params: d,
    query: b
  }).defaultPrevented)
    return;
  p.historyAction === "push" ? window.history.pushState(null, "", m) : p.historyAction === "replace" && window.history.replaceState(null, "", m);
  const o = () => {
    if (p.isHydration || fe(f), !p.isHydration) {
      const e = h.templateNode.content.cloneNode(!0);
      f.replaceChildren(e);
    }
    if (h.title && (document.title = h.title), !p.isHydration) {
      f.hasAttribute("tabindex") || f.setAttribute("tabindex", "-1");
      const e = f.querySelector("h1, h2, h3, h4, h5, h6");
      e ? (e.setAttribute("tabindex", "-1"), e.focus()) : f.focus(), f.scrollIntoView({ block: "start", behavior: "instant" });
    }
    Ot = m, Xt = d, Qt = b, xt = h, Zt(f, "ln-router:navigated", {
      path: m,
      params: d,
      query: b,
      route: h,
      target: f
    });
  };
  document.startViewTransition && !p.isHydration ? document.startViewTransition(o) : o();
}
function Ht(h, d = {}) {
  const { path: b, query: m } = At(h), p = wt(b);
  p ? Lt(p.route, p.params, m, h, d) : w(document.body, "ln-router:not-found", { path: b });
}
function pe(h) {
  const d = h.target.closest("a");
  if (!d || !Kt(h, d)) return;
  const b = d.getAttribute("href"), { path: m, query: p } = At(b), f = wt(m);
  f && (h.preventDefault(), Lt(f.route, f.params, p, b, { historyAction: "push" }));
}
function me() {
  const h = window.location.pathname + window.location.search, { path: d, query: b } = At(h), m = wt(d);
  m ? Lt(m.route, m.params, b, h, { historyAction: "skip" }) : w(document.body, "ln-router:not-found", { path: d });
}
function ge() {
  Pt || (Pt = !0, G(function() {
    document.addEventListener("click", pe), window.addEventListener("popstate", me), It = !0;
    const h = window.location.pathname + window.location.search, { path: d, query: b } = At(h), m = wt(d);
    if (m) {
      const p = Mt(m.route), f = p && p.hasAttribute("data-ln-router-hydrate") && p.children.length > 0;
      Lt(m.route, m.params, b, h, {
        historyAction: "replace",
        isHydration: f
      });
    } else
      Zt(document.body, "ln-router:not-found", { path: d });
    It = !1;
  }, "ln-router"));
}
function _e(h) {
  const d = h.getAttribute(Rt);
  if (!d) return;
  if (at.has(d)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${d}"`);
    return;
  }
  const b = h.getAttribute("data-ln-route-target"), m = h.getAttribute("data-ln-route-title"), p = d.split("/").filter(Boolean), f = {
    pattern: d,
    segments: p,
    target: b,
    title: m,
    templateNode: h
  }, n = Mt(f);
  n && n.contains(h) && console.warn(`[ln-router] Route template with pattern "${d}" is declared inside its own outlet element:`, h), at.set(d, f), qt = Array.from(at.values()).sort(te), ge();
}
function be(h) {
  const d = h.getAttribute(Rt);
  d && at.has(d) && (at.delete(d), qt = Array.from(at.values()).sort(te));
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
  const h = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0) return;
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
      const t = r[0], o = r[r.length - 1];
      n.shiftKey ? document.activeElement === t && (n.preventDefault(), o.focus()) : document.activeElement === o && (n.preventDefault(), t.focus());
    }, this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  b.prototype.destroy = function() {
    if (this.dom[d]) {
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
      w(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[d];
    }
  };
  function m(p) {
    const f = p[d];
    if (!f) return;
    const r = p.getAttribute(h) === "open";
    if (r !== f.isOpen)
      if (r) {
        if (z(p, "ln-modal:before-open", { modalId: p.id, target: p }).defaultPrevented) {
          p.setAttribute(h, "close");
          return;
        }
        f.isOpen = !0, p.setAttribute("aria-modal", "true"), p.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", f._onEscape), document.addEventListener("keydown", f._onFocusTrap);
        const o = document.activeElement;
        f._returnFocusEl = o && o !== document.body ? o : null;
        const e = p.querySelector("[autofocus]");
        if (e && gt(e))
          e.focus();
        else {
          const i = p.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(i, gt);
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
      if (t && t[d]) {
        p.preventDefault();
        const o = t.getAttribute(h);
        t.setAttribute(h, o === "open" ? "close" : "open");
      }
      return;
    }
    const n = p.target.closest("[data-ln-modal-close]");
    if (n) {
      const r = n.closest("[" + h + "]");
      r && r[d] && (p.preventDefault(), r.setAttribute(h, "close"));
    }
  }), B(h, d, b, "ln-modal", {
    onAttributeChange: m
  });
})();
(function() {
  const h = "data-ln-number", d = "lnNumber";
  if (window[d] !== void 0) return;
  const b = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(t) {
    if (!b[t]) {
      const o = new Intl.NumberFormat(t, { useGrouping: !0 }), e = o.formatToParts(1234.5);
      let i = "", u = ".";
      for (let l = 0; l < e.length; l++)
        e[l].type === "group" && (i = e[l].value), e[l].type === "decimal" && (u = e[l].value);
      b[t] = { fmt: o, groupSep: i, decimalSep: u };
    }
    return b[t];
  }
  function f(t, o, e) {
    if (e !== null) {
      const i = parseInt(e, 10), u = t + "|d" + i;
      return b[u] || (b[u] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: i })), b[u].format(o);
    }
    return p(t).fmt.format(o);
  }
  function n(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[d]) return t[d];
    t[d] = this, this.dom = t;
    const o = document.createElement("input");
    o.type = "hidden", o.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", o), this._hidden = o;
    const e = this;
    Object.defineProperty(o, "value", {
      get: function() {
        return m.get.call(o);
      },
      set: function(u) {
        if (m.set.call(o, u), u !== "" && !isNaN(parseFloat(u))) {
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
          const c = f(X(t), s, t.getAttribute("data-ln-number-decimals"));
          l(c), w(t, "ln-number:input", { value: s, formatted: c }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(u) {
      u.preventDefault();
      const l = (u.clipboardData || window.clipboardData).getData("text"), s = p(X(t)), c = s.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let g = l.replace(new RegExp("[^0-9\\-" + c + ".]", "g"), "");
      s.groupSep && (g = g.split(s.groupSep).join("")), s.decimalSep !== "." && (g = g.replace(s.decimalSep, "."));
      const a = parseFloat(g);
      isNaN(a) ? (t.value = "", e._hidden.value = "") : e.value = a;
    }, t.addEventListener("paste", this._onPaste);
    const i = t.value;
    if (i !== "") {
      const u = parseFloat(i);
      isNaN(u) || (this._displayFormatted(u), m.set.call(o, String(u)), w(t, "ln-number:input", { value: u, formatted: t.value }), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  n.prototype._handleInput = function() {
    const t = this.dom, o = p(X(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", w(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const i = t.selectionStart;
    let u = 0;
    for (let A = 0; A < i; A++)
      /[0-9]/.test(e[A]) && u++;
    let l = e;
    if (o.groupSep && (l = l.split(o.groupSep).join("")), l = l.replace(o.decimalSep, "."), e.endsWith(o.decimalSep) || e.endsWith(".")) {
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
    const c = t.getAttribute("data-ln-number-decimals");
    if (c !== null && s !== -1) {
      const A = parseInt(c, 10);
      l.slice(s + 1).length > A && (l = l.slice(0, s + 1 + A));
    }
    const g = parseFloat(l);
    if (isNaN(g)) return;
    const a = t.getAttribute("data-ln-number-min"), _ = t.getAttribute("data-ln-number-max");
    if (a !== null && g < parseFloat(a) || _ !== null && g > parseFloat(_)) return;
    let y;
    if (c !== null)
      y = f(X(t), g, c);
    else {
      const A = s !== -1 ? l.slice(s + 1).length : 0;
      if (A > 0) {
        const L = X(t) + "|u" + A;
        b[L] || (b[L] = new Intl.NumberFormat(X(t), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), y = b[L].format(g);
      } else
        y = o.fmt.format(g);
    }
    t.value = y;
    let E = u, S = 0;
    for (let A = 0; A < y.length && E > 0; A++)
      S = A + 1, /[0-9]/.test(y[A]) && E--;
    E > 0 && (S = y.length), t.setSelectionRange(S, S), this._setHiddenRaw(g), w(t, "ln-number:input", { value: g, formatted: y });
  }, n.prototype._setHiddenRaw = function(t) {
    m.set.call(this._hidden, String(t));
  }, n.prototype._displayFormatted = function(t) {
    this._isFormatting = !0, this.dom.value = f(X(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")), this._isFormatting = !1;
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
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), w(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function r() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let o = 0; o < t.length; o++) {
        const e = t[o][d];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, d, n, "ln-number"), r();
})();
(function() {
  const h = "data-ln-date", d = "lnDate";
  if (window[d] !== void 0) return;
  const b = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(s, c) {
    const g = s + "|" + JSON.stringify(c);
    return b[g] || (b[g] = new Intl.DateTimeFormat(s, c)), b[g];
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
  function t(s, c, g) {
    const a = s.getDate(), _ = s.getMonth(), y = s.getFullYear(), E = s.getHours(), S = s.getMinutes();
    let A, L;
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
      A = I[_], L = F[_];
    }
    A === void 0 && (A = p(g, { month: "long" }).format(s)), L === void 0 && (L = p(g, { month: "short" }).format(s));
    const k = {
      yyyy: String(y),
      yy: String(y).slice(-2),
      MMMM: A,
      MMM: L,
      MM: String(_ + 1).padStart(2, "0"),
      M: String(_ + 1),
      dd: String(a).padStart(2, "0"),
      d: String(a),
      HH: String(E).padStart(2, "0"),
      mm: String(S).padStart(2, "0")
    };
    return c.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(x) {
      return k[x];
    });
  }
  function o(s, c, g) {
    const a = r(c);
    if (a) {
      const _ = p(g, a), y = _.resolvedOptions().locale;
      return g.startsWith("mk") && !y.startsWith("mk") ? t(s, "dd.MM.yyyy", g) : _.format(s);
    }
    return t(s, c, g);
  }
  function e(s) {
    if (s.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", s.tagName), this;
    if (s[d]) return s[d];
    s[d] = this, this.dom = s;
    const c = this, g = s.value, a = s.name, _ = document.createElement("span");
    _.setAttribute("data-ln-date-field", ""), s.parentNode.insertBefore(_, s), _.appendChild(s), this._wrapper = _;
    const y = document.createElement("input");
    y.type = "hidden", y.name = a, s.removeAttribute("name"), s.insertAdjacentElement("afterend", y), this._hidden = y;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", y.insertAdjacentElement("afterend", E), this._picker = E, s.type = "text";
    const S = document.createElement("button");
    if (S.type = "button", S.setAttribute("aria-label", "Open date picker"), S.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', E.insertAdjacentElement("afterend", S), this._btn = S, this._lastISO = "", Object.defineProperty(y, "value", {
      get: function() {
        return m.get.call(y);
      },
      set: function(A) {
        if (m.set.call(y, A), A && A !== "") {
          const L = i(A);
          L && (c._displayFormatted(L), m.set.call(E, A), c._lastISO = A, w(c.dom, "ln-date:change", {
            value: A,
            formatted: c.dom.value,
            date: L
          }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else A === "" && (c.dom.value = "", m.set.call(E, ""), c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), Vt(s, m, {
      get: function() {
        return m.get.call(s);
      },
      set: function(A, L) {
        if (c._isFormatting) {
          L(A);
          return;
        }
        if (!A || A === "") {
          L(""), c._setHiddenRaw(""), m.set.call(c._picker, ""), c._lastISO = "", w(s, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let k = i(A);
        if (k || (k = u(A)), k) {
          const x = k.getFullYear(), O = String(k.getMonth() + 1).padStart(2, "0"), I = String(k.getDate()).padStart(2, "0"), F = x + "-" + O + "-" + I;
          c._setHiddenRaw(F), m.set.call(c._picker, F), c._lastISO = F;
          const j = s.getAttribute(h) || "", Z = X(s), tt = o(k, j, Z);
          L(tt), w(s, "ln-date:change", {
            value: F,
            formatted: tt,
            date: k
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          L(String(A)), c._setHiddenRaw(""), m.set.call(c._picker, ""), c._lastISO = "", w(s, "ln-date:change", {
            value: "",
            formatted: String(A),
            date: null
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const A = E.value;
      if (A) {
        const L = i(A);
        L && (c._setHiddenRaw(A), c._displayFormatted(L), c._lastISO = A, w(c.dom, "ln-date:change", {
          value: A,
          formatted: c.dom.value,
          date: L
        }));
      } else
        c._setHiddenRaw(""), c.dom.value = "", c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const A = c.dom.value.trim();
      if (A === "") {
        c._lastISO !== "" && (c._setHiddenRaw(""), m.set.call(c._picker, ""), c.dom.value = "", c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (c._lastISO) {
        const k = i(c._lastISO);
        if (k) {
          const x = c.dom.getAttribute(h) || "", O = X(c.dom), I = o(k, x, O);
          if (A === I) return;
        }
      }
      const L = u(A);
      if (L) {
        const k = L.getFullYear(), x = String(L.getMonth() + 1).padStart(2, "0"), O = String(L.getDate()).padStart(2, "0"), I = k + "-" + x + "-" + O;
        c._setHiddenRaw(I), m.set.call(c._picker, I), c._displayFormatted(L), c._lastISO = I, w(c.dom, "ln-date:change", {
          value: I,
          formatted: c.dom.value,
          date: L
        });
      } else if (c._lastISO) {
        const k = i(c._lastISO);
        k && c._displayFormatted(k);
      } else
        c.dom.value = "";
    }, s.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      c._openPicker();
    }, S.addEventListener("click", this._onBtnClick), g && g !== "") {
      const A = i(g);
      A && (this._setHiddenRaw(g), m.set.call(E, g), this._displayFormatted(A), this._lastISO = g, w(s, "ln-date:change", {
        value: g,
        formatted: s.value,
        date: A
      }), s.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function i(s) {
    if (!s || typeof s != "string") return null;
    const c = s.split("T"), g = c[0].split("-");
    if (g.length < 3) return null;
    const a = parseInt(g[0], 10), _ = parseInt(g[1], 10) - 1, y = parseInt(g[2], 10);
    if (isNaN(a) || isNaN(_) || isNaN(y)) return null;
    let E = 0, S = 0;
    if (c[1]) {
      const L = c[1].split(":");
      E = parseInt(L[0], 10) || 0, S = parseInt(L[1], 10) || 0;
    }
    const A = new Date(a, _, y, E, S);
    return A.getFullYear() !== a || A.getMonth() !== _ || A.getDate() !== y ? null : A;
  }
  function u(s) {
    if (!s || typeof s != "string" || (s = s.trim(), s.length < 6)) return null;
    let c, g;
    if (s.indexOf(".") !== -1)
      c = ".", g = s.split(".");
    else if (s.indexOf("/") !== -1)
      c = "/", g = s.split("/");
    else if (s.indexOf("-") !== -1)
      c = "-", g = s.split("-");
    else
      return null;
    if (g.length !== 3) return null;
    const a = [];
    for (let A = 0; A < 3; A++) {
      const L = parseInt(g[A], 10);
      if (isNaN(L)) return null;
      a.push(L);
    }
    let _, y, E;
    c === "." ? (_ = a[0], y = a[1], E = a[2]) : c === "/" ? (y = a[0], _ = a[1], E = a[2]) : g[0].length === 4 ? (E = a[0], y = a[1], _ = a[2]) : (_ = a[0], y = a[1], E = a[2]), E < 100 && (E += E < 50 ? 2e3 : 1900);
    const S = new Date(E, y - 1, _);
    return S.getFullYear() !== E || S.getMonth() !== y - 1 || S.getDate() !== _ ? null : S;
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
    const c = this.dom.getAttribute(h) || "", g = X(this.dom);
    console.log("[ln-date] _displayFormatted:", {
      date: s,
      format: c,
      locale: g,
      dom: this.dom,
      closestLang: this.dom.closest("[lang]"),
      htmlLang: document.documentElement ? document.documentElement.lang : null,
      formatted: o(s, c, g)
    }), this._isFormatting = !0, this.dom.value = o(s, c, g), this._isFormatting = !1;
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return m.get.call(this._hidden);
    },
    set: function(s) {
      if (!s || s === "") {
        this._setHiddenRaw(""), m.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const c = i(s);
      c && (this._setHiddenRaw(s), m.set.call(this._picker, s), this._displayFormatted(c), this._lastISO = s, w(this.dom, "ln-date:change", {
        value: s,
        formatted: this.dom.value,
        date: c
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const s = this.value;
      return s ? i(s) : null;
    },
    set: function(s) {
      if (!s || !(s instanceof Date) || isNaN(s.getTime())) {
        this.value = "";
        return;
      }
      const c = s.getFullYear(), g = String(s.getMonth() + 1).padStart(2, "0"), a = String(s.getDate()).padStart(2, "0");
      this.value = c + "-" + g + "-" + a;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const s = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), s && (this.dom.value = s), w(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function l() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + h + "]");
      for (let c = 0; c < s.length; c++) {
        const g = s[c][d];
        if (g && g.value) {
          const a = i(g.value);
          a && g._displayFormatted(a);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, d, e, "ln-date"), l();
})();
(function() {
  const h = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0) return;
  const b = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const i of m)
        i();
    }, history._lnNavPatched = !0;
  }
  function p(e) {
    if (!e.hasAttribute(h) || b.has(e)) return;
    const i = e.getAttribute(h);
    if (!i) return;
    const u = f(e, i);
    b.set(e, u), e[d] = u;
  }
  function f(e, i) {
    const u = e.hasAttribute("data-ln-nav-exact");
    let l = Array.from(e.querySelectorAll("a"));
    r(l, i, window.location.pathname, u);
    const s = function() {
      l = Array.from(e.querySelectorAll("a")), r(l, i, window.location.pathname, u);
    };
    window.addEventListener("popstate", s), m.push(s);
    const c = new MutationObserver(function(g) {
      for (const a of g)
        if (a.type === "childList") {
          for (const _ of a.addedNodes)
            if (_.nodeType === 1) {
              if (_.tagName === "A")
                l.push(_), r([_], i, window.location.pathname, u);
              else if (_.querySelectorAll) {
                const y = Array.from(_.querySelectorAll("a"));
                l = l.concat(y), r(y, i, window.location.pathname, u);
              }
            }
          for (const _ of a.removedNodes)
            if (_.nodeType === 1) {
              if (_.tagName === "A")
                l = l.filter(function(y) {
                  return y !== _;
                });
              else if (_.querySelectorAll) {
                const y = Array.from(_.querySelectorAll("a"));
                l = l.filter(function(E) {
                  return !y.includes(E);
                });
              }
            }
        }
    });
    return c.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: i,
      observer: c,
      updateHandler: s,
      destroy: function() {
        c.disconnect(), window.removeEventListener("popstate", s);
        const g = m.indexOf(s);
        g !== -1 && m.splice(g, 1), b.delete(e), delete e[d];
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
  function r(e, i, u, l) {
    const s = n(u);
    for (const c of e) {
      const g = c.getAttribute("href");
      if (!g) continue;
      const a = n(g);
      c.classList.remove(i);
      const _ = a === s, y = !l && a !== "/" && s.startsWith(a + "/");
      _ || y ? (c.classList.add(i), c.setAttribute("aria-current", "page")) : c.removeAttribute("aria-current");
    }
  }
  function t() {
    G(function() {
      new MutationObserver(function(i) {
        for (const u of i)
          if (u.type === "childList") {
            for (const l of u.addedNodes)
              if (l.nodeType === 1 && (l.hasAttribute && l.hasAttribute(h) && p(l), l.querySelectorAll))
                for (const s of l.querySelectorAll("[" + h + "]"))
                  p(s);
          } else u.type === "attributes" && u.target.hasAttribute && u.target.hasAttribute(h) && p(u.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[d] = p;
  function o() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      p(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const h = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function b() {
    const n = (location.hash || "").replace("#", ""), r = {};
    if (!n) return r;
    for (const t of n.split("&")) {
      const o = t.indexOf(":");
      o > 0 && (r[t.slice(0, o)] = t.slice(o + 1));
    }
    return r;
  }
  function m(n, r) {
    const t = (n.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (t) return t;
    if (n.tagName !== "A") return "";
    const o = n.getAttribute("href") || "";
    if (!o.startsWith("#")) return "";
    const e = o.slice(1);
    if (!e) return "";
    const i = e.split("&");
    if (r)
      for (const s of i) {
        const c = s.indexOf(":");
        if (c > 0 && s.slice(0, c).toLowerCase().trim() === r)
          return s.slice(c + 1).toLowerCase().trim();
      }
    const u = i[i.length - 1] || "", l = u.indexOf(":");
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
      if (r[d + "Trigger"]) continue;
      const t = function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        const e = m(r, n.nsKey);
        if (e)
          if (r.tagName === "A" && o.preventDefault(), n.hashEnabled) {
            const i = b();
            i[n.nsKey] = e;
            const u = Object.keys(i).map(function(l) {
              return l + ":" + i[l];
            }).join("&");
            location.hash === "#" + u ? n.dom.setAttribute("data-ln-tabs-active", e) : location.hash = u;
          } else
            n.dom.setAttribute("data-ln-tabs-active", e);
      };
      r.addEventListener("click", t), r[d + "Trigger"] = t, n._clickHandlers.push({ el: r, handler: t });
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
      const o = this.mapTabs[t];
      t === n ? (o.setAttribute("data-active", ""), o.setAttribute("aria-selected", "true")) : (o.removeAttribute("data-active"), o.setAttribute("aria-selected", "false"));
    }
    for (const t in this.mapPanels) {
      const o = this.mapPanels[t], e = t === n;
      o.classList.toggle("hidden", !e), o.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const t = (r = this.mapPanels[n]) == null ? void 0 : r.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    w(this.dom, "ln-tabs:change", { key: n, tab: this.mapTabs[n], panel: this.mapPanels[n] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && lt("tabs", this.dom, n);
  }, p.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const { el: n, handler: r } of this._clickHandlers)
        n.removeEventListener("click", r), delete n[d + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), w(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[d];
    }
  }, B(h, d, p, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(n) {
      const r = n.getAttribute("data-ln-tabs-active");
      n[d]._applyActive(r);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
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
    this.dom[d] && (w(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function p(f) {
    const n = f[d];
    if (!n) return;
    const t = f.getAttribute(h) === "open";
    if (t !== n.isOpen)
      if (t) {
        if (z(f, "ln-toggle:before-open", { target: f }).defaultPrevented) {
          f.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, f.classList.add("open"), b(f, !0), w(f, "ln-toggle:open", { target: f }), f.hasAttribute("data-ln-persist") && lt("toggle", f, "open");
      } else {
        if (z(f, "ln-toggle:before-close", { target: f }).defaultPrevented) {
          f.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, f.classList.remove("open"), b(f, !1), w(f, "ln-toggle:close", { target: f }), f.hasAttribute("data-ln-persist") && lt("toggle", f, "close");
      }
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const n = f.target.closest("[data-ln-toggle-for]");
    if (n) {
      const r = n.getAttribute("data-ln-toggle-for"), t = document.getElementById(r);
      if (t && t[d]) {
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
  }), B(h, d, m, "ln-toggle", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
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
    this.dom[d] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), w(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, b, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", d = "lnDropdown";
  if (window[d] !== void 0) return;
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
    this.dom[d] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), w(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, b, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", d = "lnPopover", b = "data-ln-popover-for", m = "data-ln-popover-position";
  if (window[d] !== void 0) return;
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
    const i = Dt(this.dom);
    if (this.trigger) {
      const c = this.trigger.getBoundingClientRect(), g = this.dom.getAttribute(m) || "bottom", a = Et(c, i, g, 8);
      this.dom.style.top = a.top + "px", this.dom.style.left = a.left + "px", this.dom.setAttribute("data-ln-popover-placement", a.placement), this.trigger.setAttribute("aria-expanded", "true");
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
      const c = s.trigger.getBoundingClientRect(), g = Dt(s.dom), a = s.dom.getAttribute(m) || "bottom", _ = Et(c, g, a, 8);
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
    this.dom[d] && (this.isOpen && this._applyClose(), delete this.dom[d], w(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(e) {
    this.dom = e;
    const i = e.getAttribute(b);
    return e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-controls", i), this._onClick = function(u) {
      if (u.ctrlKey || u.metaKey || u.button === 1) return;
      u.preventDefault();
      const l = document.getElementById(i);
      !l || !l[d] || l[d].toggle(e);
    }, e.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[d + "Trigger"];
  }, B(h, d, t, "ln-popover", {
    onAttributeChange: function(e) {
      const i = e[d];
      if (!i) return;
      const l = e.getAttribute(h) === "open";
      if (l !== i.isOpen)
        if (l) {
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
  }), B(b, d + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", d = "data-ln-tooltip", b = "data-ln-tooltip-position", m = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[m] !== void 0) return;
  let f = 0, n = null, r = null, t = null, o = null, e = null;
  function i() {
    return n && n.parentNode || (n = document.getElementById(p), n || (n = document.createElement("div"), n.id = p, document.body.appendChild(n))), n;
  }
  function u() {
    e || (e = function(a) {
      a.key === "Escape" && c();
    }, document.addEventListener("keydown", e));
  }
  function l() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function s(a) {
    if (t === a) return;
    c();
    const _ = a.getAttribute(d) || a.getAttribute("title");
    if (!_) return;
    i(), a.hasAttribute("title") && (o = a.getAttribute("title"), a.removeAttribute("title"));
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = _, a[m + "Uid"] || (f += 1, a[m + "Uid"] = "ln-tooltip-" + f), y.id = a[m + "Uid"], n.appendChild(y);
    const E = y.offsetWidth, S = y.offsetHeight, A = a.getBoundingClientRect(), L = a.getAttribute(b) || "top", k = Et(A, { width: E, height: S }, L, 6);
    y.style.top = k.top + "px", y.style.left = k.left + "px", y.setAttribute("data-ln-tooltip-placement", k.placement), a.setAttribute("aria-describedby", y.id), r = y, t = a, u();
  }
  function c() {
    if (!r) {
      l();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), o !== null && t.setAttribute("title", o)), o = null, r.parentNode && r.parentNode.removeChild(r), r = null, t = null, l();
  }
  function g(a) {
    return this.dom = a, a.hasAttribute("data-ln-tooltip-enhanced") || (a.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      s(a);
    }, this._onLeave = function() {
      t === a && c();
    }, this._onFocus = function() {
      s(a);
    }, this._onBlur = function() {
      t === a && c();
    }, a.addEventListener("mouseenter", this._onEnter), a.addEventListener("mouseleave", this._onLeave), a.addEventListener("focus", this._onFocus, !0), a.addEventListener("blur", this._onBlur, !0), this;
  }
  g.prototype.destroy = function() {
    const a = this.dom;
    a.removeEventListener("mouseenter", this._onEnter), a.removeEventListener("mouseleave", this._onLeave), a.removeEventListener("focus", this._onFocus, !0), a.removeEventListener("blur", this._onBlur, !0), t === a && c(), this._addedEnhancedAttr && a.removeAttribute("data-ln-tooltip-enhanced"), delete a[m], delete a[m + "Uid"], w(a, "ln-tooltip:destroyed", { trigger: a });
  }, B(
    "[" + h + "], [" + d + "][title]",
    m,
    g,
    "ln-tooltip"
  );
})();
const ye = `<li class="ln-toast__item">
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
  const h = "data-ln-toast", d = "lnToast", b = "ln-toast-item", m = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, p = { success: "success", error: "error", warn: "warning", info: "info" }, f = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function n() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const a = document.createElement("template");
    a.setAttribute("data-ln-template", "ln-toast-item"), a.innerHTML = ye, document.body.appendChild(a);
  }
  function r(a) {
    if (!a || a.nodeType !== 1) return;
    const _ = Array.from(a.querySelectorAll("[" + h + "]"));
    a.hasAttribute && a.hasAttribute(h) && _.push(a);
    for (const y of _)
      y[d] || new t(y);
  }
  function t(a) {
    this.dom = a, a[d] = this, this.timeoutDefault = parseInt(a.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(a.getAttribute("data-ln-toast-max") || "5", 10);
    for (const _ of Array.from(a.querySelectorAll("[data-ln-toast-item]")))
      s(_, a);
    return this;
  }
  t.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const a of Array.from(this.dom.children))
        u(a);
      delete this.dom[d];
    }
  };
  function o(a, _) {
    const y = ((a.type || "info") + "").toLowerCase(), E = Q(_, b, "ln-toast");
    if (!E)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    const S = E.firstElementChild;
    if (!S) return null;
    const A = !!(a.message || a.data && a.data.errors);
    Y(S, {
      title: a.title || f[y] || f.info,
      role: y === "error" ? "alert" : "status",
      ariaLive: y === "error" ? "assertive" : "polite",
      hasBody: A
    });
    const L = S.querySelector(".ln-toast__card");
    L && L.classList.add(p[y] || "info");
    const k = S.querySelector(".ln-toast__side");
    if (k) {
      const I = k.querySelector("use");
      I && I.setAttribute("href", "#ln-" + (m[y] || m.info));
    }
    const x = S.querySelector(".ln-toast__body");
    x && A && e(x, a);
    const O = S.querySelector(".ln-toast__close");
    return O && O.addEventListener("click", function() {
      u(S);
    }), S;
  }
  function e(a, _) {
    if (_.message)
      if (Array.isArray(_.message)) {
        const y = document.createElement("ul");
        for (const E of _.message) {
          const S = document.createElement("li");
          S.textContent = E, y.appendChild(S);
        }
        a.appendChild(y);
      } else {
        const y = document.createElement("p");
        y.textContent = _.message, a.appendChild(y);
      }
    if (_.data && _.data.errors) {
      const y = document.createElement("ul");
      for (const E of Object.values(_.data.errors).flat()) {
        const S = document.createElement("li");
        S.textContent = E, y.appendChild(S);
      }
      a.appendChild(y);
    }
  }
  function i(a, _) {
    for (; a.dom.children.length >= a.max; ) a.dom.removeChild(a.dom.firstElementChild);
    a.dom.appendChild(_), requestAnimationFrame(() => _.classList.add("ln-toast__item--in"));
  }
  function u(a) {
    !a || !a.parentNode || (clearTimeout(a._timer), a.classList.remove("ln-toast__item--in"), a.classList.add("ln-toast__item--out"), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 200));
  }
  function l(a) {
    let _ = a && a.container;
    return typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), _ || null;
  }
  function s(a, _) {
    const y = ((a.getAttribute("data-type") || "info") + "").toLowerCase(), E = a.getAttribute("data-title"), S = (a.innerText || a.textContent || "").trim(), A = o({
      type: y,
      title: E,
      message: S || void 0
    }, _);
    A && (a.parentNode && a.parentNode.replaceChild(A, a), requestAnimationFrame(() => A.classList.add("ln-toast__item--in")));
  }
  function c(a) {
    const _ = a.detail || {}, y = l(_);
    if (!y) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const E = y[d] || new t(y), S = o(_, y);
    if (!S) return;
    const A = Number.isFinite(_.timeout) ? _.timeout : E.timeoutDefault;
    i(E, S), A > 0 && (S._timer = setTimeout(() => u(S), A));
  }
  function g(a) {
    const _ = a && a.detail || {};
    if (_.container) {
      const y = l(_);
      if (y)
        for (const E of Array.from(y.children)) u(E);
    } else {
      const y = document.querySelectorAll("[" + h + "]");
      for (const E of Array.from(y))
        for (const S of Array.from(E.children)) u(S);
    }
  }
  G(function() {
    n(), window.addEventListener("ln-toast:enqueue", c), window.addEventListener("ln-toast:clear", g), new MutationObserver(function(_) {
      for (const y of _) {
        if (y.type === "attributes") {
          r(y.target);
          continue;
        }
        for (const E of y.addedNodes)
          r(E);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), r(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", d = "lnUpload", b = "data-ln-upload-dict", m = "data-ln-upload-accept", p = "data-ln-upload-context", f = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function n() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const s = document.createElement("div");
    s.innerHTML = f;
    const c = s.firstElementChild;
    c && document.body.appendChild(c);
  }
  if (window[d] !== void 0) return;
  function r(s) {
    if (s === 0) return "0 B";
    const c = 1024, g = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(s) / Math.log(c));
    return parseFloat((s / Math.pow(c, a)).toFixed(1)) + " " + g[a];
  }
  function t(s) {
    return s.split(".").pop().toLowerCase();
  }
  function o(s) {
    return s === "docx" && (s = "doc"), ["pdf", "doc", "epub"].includes(s) ? "lnc-file-" + s : "ln-file";
  }
  function e(s, c) {
    if (!c) return !0;
    const g = "." + t(s.name);
    return c.split(",").map(function(_) {
      return _.trim().toLowerCase();
    }).includes(g.toLowerCase());
  }
  function i(s) {
    if (s.hasAttribute("data-ln-upload-initialized")) return;
    s.setAttribute("data-ln-upload-initialized", "true"), n();
    const c = oe(s, b), g = s.querySelector(".ln-upload__zone"), a = s.querySelector(".ln-upload__list"), _ = s.getAttribute(m) || "";
    if (!g || !a) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", s);
      return;
    }
    let y = s.querySelector('input[type="file"]');
    y || (y = document.createElement("input"), y.type = "file", y.multiple = !0, y.classList.add("hidden"), _ && (y.accept = _.split(",").map(function(q) {
      return q = q.trim(), q.startsWith(".") ? q : "." + q;
    }).join(",")), s.appendChild(y));
    const E = s.getAttribute(h) || "/files/upload", S = s.getAttribute(p) || "", A = s.getAttribute("data-ln-upload-delete") || (E.includes("/upload") ? E.replace(/\/upload\/?$/, "/{id}") : E + "/{id}"), L = /* @__PURE__ */ new Map();
    let k = 0;
    function x() {
      const q = document.querySelector('meta[name="csrf-token"]');
      return q ? q.getAttribute("content") : "";
    }
    function O(q) {
      if (!e(q, _)) {
        const T = c["invalid-type"];
        w(s, "ln-upload:invalid", {
          file: q,
          message: T
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["invalid-title"] || "Invalid File",
          message: T || c["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++k, H = t(q.name), ht = o(H), nt = Q(s, "ln-upload-item", "ln-upload");
      if (!nt) return;
      const W = nt.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", P), Y(W, {
        name: q.name,
        sizeText: "0%",
        iconHref: "#" + ht,
        removeLabel: c.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const ft = W.querySelector(".ln-upload__progress-bar"), it = W.querySelector('[data-ln-upload-action="remove"]');
      it && (it.disabled = !0), a.appendChild(W);
      const st = new FormData();
      st.append("file", q);
      const yt = /* @__PURE__ */ new Set();
      s.querySelectorAll("input, select, textarea").forEach(function(T) {
        if (T.name && T.name !== "file_ids[]" && T.type !== "file") {
          if ((T.type === "checkbox" || T.type === "radio") && !T.checked)
            return;
          st.append(T.name, T.value), yt.add(T.name);
        }
      }), !yt.has("context") && S && st.append("context", S);
      const v = new XMLHttpRequest();
      v.upload.addEventListener("progress", function(T) {
        if (T.lengthComputable) {
          const D = Math.round(T.loaded / T.total * 100);
          ft.style.width = D + "%", Y(W, { sizeText: D + "%" });
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
          Y(W, { sizeText: r(T.size || q.size), uploading: !1 }), it && (it.disabled = !1), L.set(P, {
            serverId: T.id,
            name: T.name,
            size: T.size
          }), I(), w(s, "ln-upload:uploaded", {
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
        ft && (ft.style.width = "100%"), Y(W, { sizeText: c.error || "Error", uploading: !1, error: !0 }), it && (it.disabled = !1), w(s, "ln-upload:error", {
          file: q,
          message: T
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["error-title"] || "Upload Error",
          message: T || c["upload-failed"] || "Failed to upload file"
        });
      }
      v.open("POST", E), v.setRequestHeader("X-CSRF-TOKEN", x()), v.setRequestHeader("Accept", "application/json"), v.send(st);
    }
    function I() {
      for (const q of s.querySelectorAll('input[name="file_ids[]"]'))
        q.remove();
      for (const [, q] of L) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = q.serverId, s.appendChild(P);
      }
    }
    function F(q) {
      const P = L.get(q), H = a.querySelector('[data-file-id="' + q + '"]');
      if (!P || !P.serverId) {
        H && H.remove(), L.delete(q), I();
        return;
      }
      H && Y(H, { deleting: !0 });
      const ht = A.replace("{id}", P.serverId);
      fetch(ht, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": x(),
          Accept: "application/json"
        }
      }).then(function(nt) {
        nt.status === 200 ? (H && H.remove(), L.delete(q), I(), w(s, "ln-upload:removed", {
          localId: q,
          serverId: P.serverId
        })) : (H && Y(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["delete-title"] || "Error",
          message: c["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(nt) {
        console.warn("[ln-upload] Delete error:", nt), H && Y(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["network-error"] || "Network error",
          message: c["connection-error"] || "Could not connect to server"
        });
      });
    }
    function j(q) {
      for (const P of q)
        O(P);
      y.value = "";
    }
    const Z = function() {
      y.click();
    }, tt = function() {
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
      if (!P || !a.contains(P) || P.disabled) return;
      const H = P.closest(".ln-upload__item");
      H && F(H.getAttribute("data-file-id"));
    };
    g.addEventListener("click", Z), y.addEventListener("change", tt), g.addEventListener("dragenter", bt), g.addEventListener("dragover", ct), g.addEventListener("dragleave", $), g.addEventListener("drop", dt), a.addEventListener("click", ut), s.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(L.values()).map(function(q) {
          return q.serverId;
        });
      },
      getFiles: function() {
        return Array.from(L.values());
      },
      clear: function() {
        for (const [, q] of L)
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
        L.clear(), a.innerHTML = "", I(), w(s, "ln-upload:cleared", {});
      },
      destroy: function() {
        g.removeEventListener("click", Z), y.removeEventListener("change", tt), g.removeEventListener("dragenter", bt), g.removeEventListener("dragover", ct), g.removeEventListener("dragleave", $), g.removeEventListener("drop", dt), a.removeEventListener("click", ut), L.clear(), a.innerHTML = "", I(), s.removeAttribute("data-ln-upload-initialized"), delete s.lnUploadAPI;
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
        for (const g of c)
          if (g.type === "childList") {
            for (const a of g.addedNodes)
              if (a.nodeType === 1) {
                a.hasAttribute(h) && i(a);
                for (const _ of a.querySelectorAll("[" + h + "]"))
                  i(_);
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
  window[d] = {
    init: i,
    initAll: u
  }, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function d(r) {
    return r.hostname && r.hostname !== window.location.hostname;
  }
  function b(r) {
    if (r.getAttribute("data-ln-external-link") === "processed" || !d(r)) return;
    r.target = "_blank";
    const t = (r.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), r.rel = t.join(" ");
    const o = document.createElement("span");
    o.className = "sr-only", o.textContent = "(opens in new tab)", r.appendChild(o), r.setAttribute("data-ln-external-link", "processed"), w(r, "ln-external-links:processed", {
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
        for (const o of t) {
          if (o.type === "childList") {
            for (const e of o.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && b(e), e.querySelectorAll))
                for (const i of e.querySelectorAll("a, area"))
                  b(i);
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
  const h = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  let b = null;
  function m() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function p(a) {
    b && (b.textContent = a, b.classList.add("ln-link-status--visible"));
  }
  function f() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function n(a, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const y = a.querySelector("a");
    if (!y) return;
    const E = y.getAttribute("href");
    if (!E) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(E, "_blank");
      return;
    }
    z(a, "ln-link:navigate", { target: a, href: E, link: y }).defaultPrevented || y.click();
  }
  function r(a) {
    const _ = a.querySelector("a");
    if (!_) return;
    const y = _.getAttribute("href");
    y && p(y);
  }
  function t() {
    f();
  }
  function o(a) {
    a[d + "Row"] || (a[d + "Row"] = !0, a.querySelector("a") && (a._lnLinkClick = function(_) {
      n(a, _);
    }, a._lnLinkEnter = function() {
      r(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", t)));
  }
  function e(a) {
    a[d + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", t), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[d + "Row"]);
  }
  function i(a) {
    if (!a[d + "Init"]) return;
    const _ = a.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const y = _ === "TABLE" && a.querySelector("tbody") || a;
      for (const E of y.querySelectorAll("tr"))
        e(E);
    } else
      e(a);
    delete a[d + "Init"];
  }
  function u(a) {
    if (a[d + "Init"]) return;
    a[d + "Init"] = !0;
    const _ = a.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const y = _ === "TABLE" && a.querySelector("tbody") || a;
      for (const E of y.querySelectorAll("tr"))
        o(E);
    } else
      o(a);
  }
  function l(a) {
    a.hasAttribute && a.hasAttribute(h) && u(a);
    const _ = a.querySelectorAll ? a.querySelectorAll("[" + h + "]") : [];
    for (const y of _)
      u(y);
  }
  function s() {
    G(function() {
      new MutationObserver(function(_) {
        for (const y of _)
          if (y.type === "childList")
            for (const E of y.addedNodes)
              E.nodeType === 1 && (l(E), E.tagName === "TR" && E.closest("[" + h + "]") && o(E));
          else y.type === "attributes" && l(y.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function c(a) {
    l(a);
  }
  window[d] = { init: c, destroy: i };
  function g() {
    m(), s(), c(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", g) : g();
})();
(function() {
  const h = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0) return;
  function b(o) {
    m(o);
  }
  function m(o) {
    const e = Array.from(o.querySelectorAll(h));
    for (const i of e)
      i[d] || (i[d] = new p(i));
    o.hasAttribute && o.hasAttribute("data-ln-progress") && !o[d] && (o[d] = new p(o));
  }
  function p(o) {
    return this.dom = o, this._attrObserver = null, this._parentObserver = null, t.call(this), n.call(this), r.call(this), this;
  }
  p.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[d]);
  };
  function f() {
    G(function() {
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
  function r() {
    const o = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const i = new MutationObserver(function(u) {
      for (const l of u)
        l.attributeName === "data-ln-progress-max" && t.call(o);
    });
    i.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = i;
  }
  function t() {
    const o = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, u = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let l = u > 0 ? o / u * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100), this.dom.style.width = l + "%";
    const s = Math.max(0, Math.min(o, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(s)), w(this.dom, "ln-progress:change", { target: this.dom, value: o, max: u, percentage: l });
  }
  window[d] = b, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-filter", d = "lnFilter", b = "data-ln-filter-initialized", m = "data-ln-filter-key", p = "data-ln-filter-value", f = "data-ln-filter-hide", n = "data-ln-filter-reset", r = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[d] !== void 0) return;
  function o(s) {
    return s.hasAttribute(n) || s.getAttribute(p) === "";
  }
  function e(s) {
    let c = s._filterKey;
    const g = [];
    for (let a = 0; a < s.inputs.length; a++) {
      const _ = s.inputs[a];
      if (_.checked && !o(_)) {
        const y = _.getAttribute(p);
        y && g.push(y);
      }
    }
    return { key: c, values: g };
  }
  function i(s, c) {
    if (s.length !== c.length) return !0;
    for (let g = 0; g < s.length; g++) if (s[g] !== c[g]) return !0;
    return !1;
  }
  function u(s) {
    const c = s.dom, g = s.colIndex, a = c.querySelector("template");
    if (!a || g === null) return;
    const _ = document.getElementById(s.targetId);
    if (!_) return;
    const y = _.tagName === "TABLE" ? _ : _.querySelector("table");
    if (!y || _.hasAttribute("data-ln-table")) return;
    const E = {}, S = [], A = y.tBodies;
    for (let x = 0; x < A.length; x++) {
      const O = A[x].rows;
      for (let I = 0; I < O.length; I++) {
        const F = O[I].cells[g], j = F ? F.textContent.trim() : "";
        j && !E[j] && (E[j] = !0, S.push(j));
      }
    }
    S.sort(function(x, O) {
      return x.localeCompare(O);
    });
    const L = c.querySelector("[" + m + "]"), k = L ? L.getAttribute(m) : c.getAttribute("data-ln-filter-key") || "col" + g;
    for (let x = 0; x < S.length; x++) {
      const O = a.content.cloneNode(!0), I = O.querySelector("input");
      I && (I.setAttribute(m, k), I.setAttribute(p, S[x]), _t(O, { text: S[x] }), c.appendChild(O));
    }
  }
  function l(s) {
    if (s.hasAttribute(b)) return this;
    this.dom = s, this.targetId = s.getAttribute(h);
    const c = s.getAttribute(r);
    this.colIndex = c !== null ? parseInt(c, 10) : null, u(this), this.inputs = Array.from(s.querySelectorAll("[" + m + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(m) : null, this._lastSnapshot = null;
    const g = this, a = le(
      function() {
        g._render();
      },
      function() {
        g._afterRender();
      }
    );
    this._queueRender = a, this._attachHandlers();
    let _ = !1;
    if (s.hasAttribute("data-ln-persist")) {
      const y = St("filter", s);
      if (y && y.key && Array.isArray(y.values) && y.values.length > 0) {
        for (let E = 0; E < this.inputs.length; E++) {
          const S = this.inputs[E];
          o(S) ? S.checked = !1 : S.getAttribute(m) === y.key && y.values.indexOf(S.getAttribute(p)) !== -1 ? S.checked = !0 : S.checked = !1;
        }
        a(), _ = !0;
      }
    }
    if (!_) {
      for (let y = 0; y < this.inputs.length; y++)
        if (this.inputs[y].checked && !o(this.inputs[y])) {
          a();
          break;
        }
    }
    return s.setAttribute(b, ""), this;
  }
  l.prototype._attachHandlers = function() {
    const s = this;
    this.inputs.forEach(function(c) {
      c[d + "Bound"] || (c[d + "Bound"] = !0, c._lnFilterChange = function() {
        if (o(c)) {
          for (let g = 0; g < s.inputs.length; g++)
            o(s.inputs[g]) || (s.inputs[g].checked = !1);
          c.checked = !0, s._queueRender();
          return;
        }
        if (c.checked)
          for (let g = 0; g < s.inputs.length; g++)
            o(s.inputs[g]) && (s.inputs[g].checked = !1);
        else {
          let g = !1;
          for (let a = 0; a < s.inputs.length; a++)
            if (!o(s.inputs[a]) && s.inputs[a].checked) {
              g = !0;
              break;
            }
          if (!g)
            for (let a = 0; a < s.inputs.length; a++)
              o(s.inputs[a]) && (s.inputs[a].checked = !0);
        }
        s._queueRender();
      }, c.addEventListener("change", c._lnFilterChange));
    });
  }, l.prototype._render = function() {
    const s = this, c = e(this), g = c.key === null || c.values.length === 0, a = [];
    for (let _ = 0; _ < c.values.length; _++)
      a.push(c.values[_].toLowerCase());
    if (s.colIndex !== null)
      s._filterTableRows(c);
    else {
      const _ = document.getElementById(s.targetId);
      if (!_) return;
      const y = _.children;
      for (let E = 0; E < y.length; E++) {
        const S = y[E];
        if (g) {
          S.removeAttribute(f);
          continue;
        }
        const A = S.getAttribute("data-" + c.key);
        S.removeAttribute(f), A !== null && a.indexOf(A.toLowerCase()) === -1 && S.setAttribute(f, "true");
      }
    }
  }, l.prototype._afterRender = function() {
    const s = e(this), c = this._lastSnapshot;
    if (!c || c.key !== s.key || i(c.values, s.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: s.key,
        values: s.values.slice()
      });
      const a = c && c.values.length > 0, _ = s.values.length === 0;
      a && _ && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: s.key, values: s.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (s.key && s.values.length > 0 ? lt("filter", this.dom, { key: s.key, values: s.values.slice() }) : lt("filter", this.dom, null));
  }, l.prototype._dispatchOnBoth = function(s, c) {
    w(this.dom, s, c);
    const g = document.getElementById(this.targetId);
    g && g !== this.dom && w(g, s, c);
  }, l.prototype._filterTableRows = function(s) {
    const c = document.getElementById(this.targetId);
    if (!c) return;
    const g = c.tagName === "TABLE" ? c : c.querySelector("table");
    if (!g || c.hasAttribute("data-ln-table")) return;
    const a = s.key || this._filterKey, _ = s.values;
    t.has(g) || t.set(g, {});
    const y = t.get(g);
    if (a && _.length > 0) {
      const L = [];
      for (let k = 0; k < _.length; k++)
        L.push(_[k].toLowerCase());
      y[a] = { col: this.colIndex, values: L };
    } else a && delete y[a];
    const E = Object.keys(y), S = E.length > 0, A = g.tBodies;
    for (let L = 0; L < A.length; L++) {
      const k = A[L].rows;
      for (let x = 0; x < k.length; x++) {
        const O = k[x];
        if (!S) {
          O.removeAttribute(f);
          continue;
        }
        let I = !0;
        for (let F = 0; F < E.length; F++) {
          const j = y[E[F]], Z = O.cells[j.col], tt = Z ? Z.textContent.trim().toLowerCase() : "";
          if (j.values.indexOf(tt) === -1) {
            I = !1;
            break;
          }
        }
        I ? O.removeAttribute(f) : O.setAttribute(f, "true");
      }
    }
  }, l.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.colIndex !== null) {
        const s = document.getElementById(this.targetId);
        if (s) {
          const c = s.tagName === "TABLE" ? s : s.querySelector("table");
          if (c && t.has(c)) {
            const g = t.get(c), a = this._filterKey;
            a && g[a] && delete g[a], Object.keys(g).length === 0 && t.delete(c);
          }
        }
      }
      this.inputs.forEach(function(s) {
        s._lnFilterChange && (s.removeEventListener("change", s._lnFilterChange), delete s._lnFilterChange), delete s[d + "Bound"];
      }), this.dom.removeAttribute(b), delete this.dom[d];
    }
  }, B(h, d, l, "ln-filter");
})();
(function() {
  const h = "data-ln-search", d = "lnSearch", b = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[d] !== void 0) return;
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
    const o = this.itemsSelector ? r.querySelectorAll(this.itemsSelector) : r.children;
    for (let e = 0; e < o.length; e++) {
      const i = o[e];
      i.removeAttribute(m), n && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(n) && i.setAttribute(m, "true");
    }
  }, f.prototype.destroy = function() {
    this.dom[d] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(b), delete this.dom[d]);
  }, B(h, d, f, "ln-search");
})();
(function() {
  const h = "lnTableSort", d = "data-ln-table-sort", b = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function m(r) {
    p(r);
  }
  function p(r) {
    const t = Array.from(r.querySelectorAll("table"));
    r.tagName === "TABLE" && t.push(r), t.forEach(function(o) {
      if (o[h]) return;
      const e = Array.from(o.querySelectorAll("th[" + d + "]"));
      e.length && (o[h] = new f(o, e));
    });
  }
  function f(r, t) {
    this.table = r, this.ths = t, this._col = -1, this._dir = null;
    const o = this;
    t.forEach(function(i, u) {
      if (i[h + "Bound"]) return;
      i[h + "Bound"] = !0;
      const l = i.querySelector("[" + b + "]");
      l && (l._lnSortClick = function() {
        o._handleClick(u, i);
      }, l.addEventListener("click", l._lnSortClick));
    });
    const e = r.closest("[data-ln-table][data-ln-persist]");
    if (e) {
      const i = St("table-sort", e);
      i && i.dir && i.col >= 0 && i.col < t.length && (this._handleClick(i.col, t[i.col]), i.dir === "desc" && this._handleClick(i.col, t[i.col]));
    }
    return this;
  }
  f.prototype._handleClick = function(r, t) {
    let o;
    this._col !== r ? o = "asc" : this._dir === "asc" ? o = "desc" : this._dir === "desc" ? o = null : o = "asc", this.ths.forEach(function(i) {
      i.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), o === null ? (this._col = -1, this._dir = null) : (this._col = r, this._dir = o, t.classList.add(o === "asc" ? "ln-sort-asc" : "ln-sort-desc")), w(this.table, "ln-table:sort", {
      column: r,
      sortType: t.getAttribute(d),
      direction: o
    });
    const e = this.table.closest("[data-ln-table][data-ln-persist]");
    e && (o === null ? lt("table-sort", e, null) : lt("table-sort", e, { col: r, dir: o }));
  }, f.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(r) {
      const t = r.querySelector("[" + b + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete r[h + "Bound"];
    }), delete this.table[h]);
  };
  function n() {
    G(function() {
      new MutationObserver(function(t) {
        t.forEach(function(o) {
          o.type === "childList" ? o.addedNodes.forEach(function(e) {
            e.nodeType === 1 && p(e);
          }) : o.type === "attributes" && p(o.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table-sort");
  }
  window[h] = m, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-table", d = "lnTable", b = "data-ln-table-sort", m = "data-ln-table-empty";
  if (window[d] !== void 0) return;
  const n = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, r = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
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
  function e(i) {
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
        const g = c.detail || {};
        l._data = g.data || [], l._lastTotal = g.total != null ? g.total : l._data.length, l._lastFiltered = g.filtered != null ? g.filtered : l._data.length, l.totalCount = l._lastTotal, l.visibleCount = l._lastFiltered, l.isLoaded = !0, i.classList.remove("ln-table--loading"), l._updateFilterOptions(g.filterOptions), l._vStart = -1, l._vEnd = -1, l._applyFilterAndSort(), l._render(), l._updateFooter(), w(i, "ln-table:rendered", {
          table: l.name,
          total: l.totalCount,
          visible: l.visibleCount
        });
      }, i.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(c) {
        const g = c.detail && c.detail.loading;
        i.classList.toggle("ln-table--loading", !!g), g && (l.isLoaded = !1);
      }, i.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(c) {
        const g = c.target.closest("[data-ln-table-col-sort]");
        if (!g) return;
        const a = g.closest("th");
        if (!a) return;
        const _ = a.getAttribute("data-ln-table-col");
        _ && l._handleSort(_, a);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(c) {
        const g = c.target.closest("[data-ln-table-col-filter]");
        if (!g) return;
        c.stopPropagation();
        const a = g.closest("th");
        if (!a) return;
        const _ = a.getAttribute("data-ln-table-col");
        if (_) {
          if (l._activeDropdown && l._activeDropdown.field === _) {
            l._closeFilterDropdown();
            return;
          }
          l._openFilterDropdown(_, a, g);
        }
      }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
        l._activeDropdown && l._closeFilterDropdown();
      }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(c) {
        (c.target.closest("[data-ln-table-clear-all]") || c.target.closest("[data-ln-data-table-clear-all]")) && (l.currentFilters = {}, l._updateFilterIndicators(), w(i, "ln-table:clear-filters", { table: l.name }), l._requestData());
      }, i.addEventListener("click", this._onClearAll), this._selectable = i.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(c) {
        if (c.target.closest("[data-ln-table-row-select]") || c.target.closest("[data-ln-table-row-action]") || c.target.closest("a") || c.target.closest("button") || c.ctrlKey || c.metaKey || c.button === 1) return;
        const g = c.target.closest("[data-ln-table-row]");
        if (!g) return;
        const a = g.getAttribute("data-ln-table-row-id"), _ = g._lnRecord || {};
        w(i, "ln-table:row-click", {
          table: l.name,
          id: a,
          record: _
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(c) {
        const g = c.target.closest("[data-ln-table-row-action]");
        if (!g) return;
        c.stopPropagation();
        const a = g.closest("[data-ln-table-row]");
        if (!a) return;
        const _ = g.getAttribute("data-ln-table-row-action"), y = a.getAttribute("data-ln-table-row-id"), E = a._lnRecord || {};
        w(i, "ln-table:row-action", {
          table: l.name,
          id: y,
          action: _,
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
        const g = l.tbody ? Array.from(l.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (g.length)
          switch (c.key) {
            case "ArrowDown":
              c.preventDefault(), l._focusedRowIndex = Math.min(l._focusedRowIndex + 1, g.length - 1), l._focusRow(g);
              break;
            case "ArrowUp":
              c.preventDefault(), l._focusedRowIndex = Math.max(l._focusedRowIndex - 1, 0), l._focusRow(g);
              break;
            case "Home":
              c.preventDefault(), l._focusedRowIndex = 0, l._focusRow(g);
              break;
            case "End":
              c.preventDefault(), l._focusedRowIndex = g.length - 1, l._focusRow(g);
              break;
            case "Enter":
              if (l._focusedRowIndex >= 0 && l._focusedRowIndex < g.length) {
                c.preventDefault();
                const a = g[l._focusedRowIndex];
                w(i, "ln-table:row-click", {
                  table: l.name,
                  id: a.getAttribute("data-ln-table-row-id"),
                  record: a._lnRecord || {}
                });
              }
              break;
            case " ":
              if (l._selectable && l._focusedRowIndex >= 0 && l._focusedRowIndex < g.length) {
                c.preventDefault();
                const a = g[l._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                a && (a.checked = !a.checked, a.dispatchEvent(new Event("change", { bubbles: !0 })));
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
        let g = !1;
        for (let y = 0; y < l.ths.length; y++)
          if (l.ths[y].getAttribute("data-ln-table-filter-col") === c) {
            g = !0;
            break;
          }
        if (!g) return;
        const a = s.detail.values;
        if (!a || a.length === 0)
          delete l._columnFilters[c];
        else {
          const y = [];
          for (let E = 0; E < a.length; E++)
            y.push(a[E].toLowerCase());
          l._columnFilters[c] = y;
        }
        const _ = l.dom.querySelector('th[data-ln-table-filter-col="' + c + '"]');
        _ && (a && a.length > 0 ? _.setAttribute("data-ln-table-filter-active", "") : _.removeAttribute("data-ln-table-filter-active")), l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(i, "ln-table:filter", {
          term: l._searchTerm,
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, i.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(s) {
        if (!s.target.closest("[data-ln-table-clear]")) return;
        l._searchTerm = "";
        const g = document.querySelector('[data-ln-search="' + i.id + '"]');
        if (g) {
          const _ = g.tagName === "INPUT" ? g : g.querySelector("input");
          _ && (_.value = "");
        }
        l._columnFilters = {};
        for (let _ = 0; _ < l.ths.length; _++)
          l.ths[_].removeAttribute("data-ln-table-filter-active");
        const a = document.querySelectorAll('[data-ln-filter="' + i.id + '"]');
        for (let _ = 0; _ < a.length; _++) {
          const y = a[_].querySelector("[data-ln-filter-reset]");
          y && (y.checked = !0, y.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        l._applyFilterAndSort(), l._vStart = -1, l._vEnd = -1, l._render(), w(i, "ln-table:filter", {
          term: "",
          matched: l._filteredData.length,
          total: l._data.length
        });
      }, i.addEventListener("click", this._onClear);
    return this;
  }
  e.prototype._parseRows = function() {
    const i = this.tbody.rows, u = this.ths;
    this._data = [];
    const l = [];
    for (let s = 0; s < u.length; s++)
      l[s] = u[s].getAttribute(b);
    i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40), this._lockColumnWidths();
    for (let s = 0; s < i.length; s++) {
      const c = i[s], g = [], a = [], _ = [];
      for (let E = 0; E < c.cells.length; E++) {
        const S = c.cells[E], A = S.textContent.trim(), L = Ft(S), k = l[E];
        a[E] = A.toLowerCase(), k === "number" || k === "date" ? g[E] = parseFloat(L) || 0 : k === "string" ? g[E] = String(L) : g[E] = null, E < c.cells.length - 1 && _.push(A.toLowerCase());
      }
      let y = null;
      if (this.isDataDriven) {
        y = {};
        const E = c.getAttribute("data-ln-table-row-id");
        E != null && (y.id = E);
        for (let S = 0; S < u.length; S++) {
          const A = u[S].getAttribute("data-ln-table-col");
          if (A) {
            const L = S;
            if (L < c.cells.length) {
              const k = c.cells[L];
              y[A] = Ft(k);
            }
          }
        }
      }
      this._data.push({
        sortKeys: g,
        rawTexts: a,
        html: c.outerHTML,
        searchText: _.join(" "),
        id: this.isDataDriven && y ? y.id : void 0,
        ...y
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, e.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const i = (this.currentSearch || "").trim().toLowerCase(), u = this.currentFilters || {}, l = Object.keys(u).length > 0;
      if (this._filteredData = this._data.filter(function(y) {
        if (i) {
          let E = !1;
          for (const S in y)
            if (y.hasOwnProperty(S) && typeof y[S] == "string" && S !== "html" && S !== "searchText" && y[S].toLowerCase().indexOf(i) !== -1) {
              E = !0;
              break;
            }
          if (!E) return !1;
        }
        if (l)
          for (const E in u) {
            const S = u[E];
            if (S && S.length > 0) {
              const A = y[E], L = A != null ? String(A) : "";
              if (S.indexOf(L) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const s = this.currentSort.field, g = this.currentSort.direction === "desc" ? -1 : 1;
      let a = null;
      if (this.ths) {
        for (let y = 0; y < this.ths.length; y++)
          if (this.ths[y].getAttribute("data-ln-table-col") === s) {
            a = this.ths[y].getAttribute(b);
            break;
          }
      }
      const _ = n ? n.compare : function(y, E) {
        return y < E ? -1 : y > E ? 1 : 0;
      };
      this._filteredData.sort(function(y, E) {
        const S = y[s], A = E[s];
        if (a === "number" || a === "date") {
          const x = parseFloat(S) || 0, O = parseFloat(A) || 0;
          return (x - O) * g;
        }
        if (typeof S == "number" && typeof A == "number")
          return (S - A) * g;
        const L = S != null ? String(S) : "", k = A != null ? String(A) : "";
        return _(L, k) * g;
      });
    } else {
      const i = this._searchTerm, u = this._columnFilters, l = Object.keys(u).length > 0, s = this.ths, c = {};
      if (l)
        for (let E = 0; E < s.length; E++) {
          const S = s[E].getAttribute("data-ln-table-filter-col");
          S && (c[S] = E);
        }
      if (!i && !l ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
        if (i && E.searchText.indexOf(i) === -1) return !1;
        if (l)
          for (const S in u) {
            const A = c[S];
            if (A !== void 0 && u[S].indexOf(E.rawTexts[A]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const g = this._sortCol, a = this._sortDir === "desc" ? -1 : 1, _ = this._sortType === "number" || this._sortType === "date", y = n ? n.compare : function(E, S) {
        return E < S ? -1 : E > S ? 1 : 0;
      };
      this._filteredData.sort(function(E, S) {
        const A = E.sortKeys[g], L = S.sortKeys[g];
        return _ ? (A - L) * a : y(A, L) * a;
      });
    }
  }, e.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const i = document.createElement("colgroup");
    this.ths.forEach(function(u) {
      const l = document.createElement("col");
      l.style.width = u.offsetWidth + "px", i.appendChild(l);
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
  }, e.prototype._enableVirtualScroll = function() {
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
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    const i = this._filteredData, u = i.length, l = this._rowHeight;
    if (!l || !u) return;
    const s = this.thead ? this.thead.offsetHeight : 0, c = this._scrollContainer;
    let g, a;
    if (c) {
      const L = this.table.getBoundingClientRect(), k = c.getBoundingClientRect(), x = L.top - k.top + c.scrollTop + s;
      g = c.scrollTop - x, a = c.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + s;
      g = window.scrollY - x, a = window.innerHeight;
    }
    let _ = Math.max(0, Math.floor(g / l) - 15);
    _ = Math.min(_, u);
    const y = Math.min(_ + Math.ceil(a / l) + 30, u);
    if (_ === this._vStart && y === this._vEnd) return;
    this._vStart = _, this._vEnd = y;
    const E = this.ths.length || 1, S = _ * l, A = (u - y) * l;
    if (this.isDataDriven) {
      const L = document.createDocumentFragment();
      if (S > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", E), x.style.height = S + "px", k.appendChild(x), L.appendChild(k);
      }
      for (let k = _; k < y; k++) {
        const x = this._buildRow(i[k]);
        x && L.appendChild(x);
      }
      if (A > 0) {
        const k = document.createElement("tr");
        k.className = "ln-table__spacer", k.setAttribute("aria-hidden", "true");
        const x = document.createElement("td");
        x.setAttribute("colspan", E), x.style.height = A + "px", k.appendChild(x), L.appendChild(k);
      }
      this.tbody.textContent = "", this.tbody.appendChild(L), this._selectable && this._updateSelectAll();
    } else {
      let L = "";
      S > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
      for (let k = _; k < y; k++) L += i[k].html;
      A > 0 && (L += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = L;
    }
  }, e.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let u = null;
    if (this.isDataDriven) {
      const l = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount, c = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (s < l || s === 0), g = c ? this.name + "-empty-filtered" : this.name + "-empty";
      if (u = Q(this.dom, g, "ln-table"), !u) {
        const a = this.dom.querySelector("template[data-ln-table-empty]");
        if (a) {
          const _ = c ? "search" : "initial", y = a.content.querySelector('[data-ln-table-empty-when="' + _ + '"]') || a.content.firstElementChild;
          y && (u = document.importNode(y, !0));
        }
      }
      if (u)
        if (u.tagName === "TR")
          this.tbody.appendChild(u);
        else {
          const a = document.createElement("td");
          a.setAttribute("colspan", String(i)), a.appendChild(u);
          const _ = document.createElement("tr");
          _.className = "ln-table__empty", _.appendChild(a), this.tbody.appendChild(_);
        }
    } else {
      const l = this.dom.querySelector("template[" + m + "]"), s = document.createElement("td");
      s.setAttribute("colspan", String(i)), l && s.appendChild(document.importNode(l.content, !0));
      const c = document.createElement("tr");
      c.className = "ln-table__empty", c.appendChild(s), this.tbody.appendChild(c);
    }
    w(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, e.prototype._fillRow = function(i, u) {
    _t(i, u);
    const l = i.querySelectorAll("[data-ln-table-cell-attr]");
    for (let s = 0; s < l.length; s++) {
      const c = l[s], g = c.getAttribute("data-ln-table-cell-attr").split(",");
      for (let a = 0; a < g.length; a++) {
        const _ = g[a].trim().split(":");
        if (_.length !== 2) continue;
        const y = _[0].trim(), E = _[1].trim();
        u[y] != null && c.setAttribute(E, u[y]);
      }
    }
  }, e.prototype._buildRow = function(i) {
    const u = Q(this.dom, this.name + "-row", "ln-table");
    if (!u) return null;
    const l = u.querySelector("[data-ln-table-row]") || u.firstElementChild;
    if (!l) return null;
    if (this._fillRow(l, i), l._lnRecord = i, i.id != null && l.setAttribute("data-ln-table-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      l.classList.add("ln-row-selected");
      const s = l.querySelector("[data-ln-table-row-select]");
      s && (s.checked = !0);
    }
    return l;
  }, e.prototype._updateFilterOptions = function(i) {
    if (i !== null && typeof i == "object" && !Array.isArray(i)) {
      const u = Object.keys(i);
      for (let l = 0; l < u.length; l++) {
        const s = u[l], c = i[s];
        if (!Array.isArray(c)) continue;
        const g = {}, a = [];
        for (let _ = 0; _ < c.length; _++) {
          const y = c[_];
          if (y !== null && typeof y == "object" && "value" in y) {
            const E = String(y.value);
            g[E] || (g[E] = !0, a.push(y));
          } else {
            const E = String(y);
            g[E] || (g[E] = !0, a.push(E));
          }
        }
        a.sort(function(_, y) {
          const E = _ !== null && typeof _ == "object" ? _.label != null ? _.label : String(_.value) : _, S = y !== null && typeof y == "object" ? y.label != null ? y.label : String(y.value) : y;
          return E < S ? -1 : E > S ? 1 : 0;
        }), this._filterOptions[s] = a;
      }
    } else {
      const u = this._filterableFields, l = this._data;
      for (let s = 0; s < u.length; s++) {
        const c = u[s];
        this._filterOptions[c] || (this._filterOptions[c] = []);
        const g = this._filterOptions[c], a = {};
        for (let _ = 0; _ < g.length; _++)
          a[g[_]] = !0;
        for (let _ = 0; _ < l.length; _++) {
          const y = l[_][c];
          if (y != null) {
            const E = String(y);
            a[E] || (a[E] = !0, g.push(E));
          }
        }
        g.sort();
      }
    }
  }, e.prototype._getUniqueValues = function(i) {
    return (this._filterOptions[i] || []).slice();
  }, e.prototype._updateFilterIndicators = function() {
    const i = this.ths;
    for (let u = 0; u < i.length; u++) {
      const l = i[u], s = l.getAttribute("data-ln-table-col");
      if (!s) continue;
      const c = l.querySelector("[data-ln-table-col-filter]");
      if (!c) continue;
      const g = this.currentFilters[s] && this.currentFilters[s].length > 0;
      c.classList.toggle("ln-filter-active", !!g);
    }
  }, e.prototype._applyFilterMutualExclusion = function(i, u) {
    const l = i.hasAttribute("data-ln-filter-reset"), s = u.querySelector("[data-ln-filter-reset]"), c = u.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');
    if (l) {
      i.checked = !0;
      for (let g = 0; g < c.length; g++) c[g].checked = !1;
    } else if (i.checked)
      s && (s.checked = !1);
    else {
      let g = !1;
      for (let a = 0; a < c.length; a++)
        if (c[a].checked) {
          g = !0;
          break;
        }
      !g && s && (s.checked = !0);
    }
  }, e.prototype._onFilterChange = function(i, u) {
    const l = u.querySelector("[data-ln-filter-reset]"), s = u.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])'), c = [];
    for (let a = 0; a < s.length; a++)
      s[a].checked && c.push(s[a].value);
    const g = l && l.checked || c.length === 0;
    g ? delete this.currentFilters[i] : this.currentFilters[i] = c, this._updateFilterIndicators(), w(this.dom, "ln-table:filter", {
      table: this.name,
      field: i,
      values: g ? [] : c
    }), this._requestData();
  }, e.prototype._openFilterDropdown = function(i, u, l) {
    this._closeFilterDropdown();
    const s = Q(this.dom, this.name + "-column-filter", "ln-table") || Q(this.dom, "column-filter", "ln-table");
    if (!s) return;
    const c = s.firstElementChild;
    if (!c) return;
    const g = this._getUniqueValues(i), a = c.querySelector("[data-ln-filter-options]"), _ = c.querySelector("[data-ln-filter-search]"), y = this.currentFilters[i] || [], E = this;
    if (_ && g.length <= 8 && _.classList.add("hidden"), a) {
      const S = a.querySelector("[data-ln-filter-reset]");
      S && (S.checked = y.length === 0);
      const A = Q(c, this.name + "-column-filter-item", "ln-table") || Q(c, "column-filter-item", "ln-table");
      if (A)
        for (let L = 0; L < g.length; L++) {
          const k = g[L], x = k !== null && typeof k == "object" ? k.value : k, O = k !== null && typeof k == "object" ? k.label != null ? k.label : String(k.value) : k, I = A.cloneNode(!0);
          Y(I, { value: O });
          const F = I.querySelector('input[type="checkbox"]');
          F && (F.value = String(x), F.checked = y.length > 0 && y.indexOf(String(x)) !== -1), a.appendChild(I);
        }
      a.addEventListener("change", function(L) {
        L.target.type === "checkbox" && (E._applyFilterMutualExclusion(L.target, a), E._onFilterChange(i, a));
      });
    }
    _ && _.addEventListener("input", function() {
      const S = _.value.toLowerCase(), A = a.querySelectorAll("li");
      for (let L = 0; L < A.length; L++) {
        const k = A[L].textContent.toLowerCase();
        A[L].classList.toggle("hidden", S && k.indexOf(S) === -1);
      }
    }), u.appendChild(c), this._activeDropdown = { field: i, th: u, el: c }, c.addEventListener("click", function(S) {
      S.stopPropagation();
    });
  }, e.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, e.prototype._handleSort = function(i, u) {
    let l;
    !this.currentSort || this.currentSort.field !== i ? l = "asc" : this.currentSort.direction === "asc" ? l = "desc" : l = null;
    for (let s = 0; s < this.ths.length; s++)
      this.ths[s].classList.remove("ln-sort-asc", "ln-sort-desc");
    l ? (this.currentSort = { field: i, direction: l }, u.classList.add(l === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, w(this.dom, "ln-table:sort", {
      table: this.name,
      field: i,
      direction: l
    }), this._requestData();
  }, e.prototype._requestData = function() {
    Ut(this, "ln-table:request-data", "table");
  }, e.prototype._updateSelectAll = function() {
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
        const c = l[s].getAttribute("data-ln-table-row-id"), g = l[s].querySelector("[data-ln-table-row-select]");
        c != null && (u ? (i.selectedIds.add(c), l[s].classList.add("ln-row-selected")) : (i.selectedIds.delete(c), l[s].classList.remove("ln-row-selected")), g && (g.checked = u));
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
      for (let l = 0; l < u.length; l++) {
        u[l].classList.remove("ln-row-selected");
        const s = u[l].querySelector("[data-ln-table-row-select]");
        s && (s.checked = !1);
      }
    }
    this._updateFooter();
  }, e.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const i = this._lastTotal != null ? this._lastTotal : this._data.length, u = this.visibleCount, l = u < i;
    if (this._totalSpan && (this._totalSpan.textContent = t(i)), this._filteredSpan && (this._filteredSpan.textContent = l ? t(u) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const s = this.selectedIds.size;
      this._selectedSpan.textContent = s > 0 ? t(s) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
    }
  }, e.prototype._focusRow = function(i) {
    for (let u = 0; u < i.length; u++)
      i[u].classList.remove("ln-row-focused"), i[u].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const u = i[this._focusedRowIndex];
      u.classList.add("ln-row-focused"), u.setAttribute("tabindex", "0"), u.focus(), u.scrollIntoView({ block: "nearest" });
    }
  }, e.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, B(h, d, e, "ln-table");
})();
(function() {
  const h = "data-ln-list", d = "lnList", b = "data-ln-list-empty";
  if (window[d] !== void 0) return;
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
  function r(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const o = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== t ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== t ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(e) {
      const i = e.detail || {};
      o._data = i.data || [], o._lastTotal = i.total != null ? i.total : o._data.length, o._lastFiltered = i.filtered != null ? i.filtered : o._data.length, o.totalCount = o._lastTotal, o.visibleCount = o._lastFiltered, o.isLoaded = !0, t.classList.remove("ln-list--loading"), o._vStart = -1, o._vEnd = -1, o._applyFilterAndSort(), o._render(), o._updateFooter(), w(t, "ln-list:rendered", {
        list: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(e) {
      const i = e.detail && e.detail.loading;
      t.classList.toggle("ln-list--loading", !!i), i && (o.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(e) {
      (e.target.closest("[data-ln-list-clear-all]") || e.target.closest("[data-ln-data-list-clear-all]")) && (o.currentFilters = {}, w(t, "ln-list:clear-filters", { list: o.name }), o._requestData());
    }, t.addEventListener("click", this._onClearAll), this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(e) {
      if (e.target.closest("[data-ln-item-select]") || e.target.closest("[data-ln-item-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const i = e.target.closest("[data-ln-item]");
      if (!i) return;
      const u = i.getAttribute("data-ln-item-id"), l = i._lnRecord || {};
      w(t, "ln-list:item-click", {
        list: o.name,
        id: u,
        record: l
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(e) {
      const i = e.target.closest("[data-ln-item-action]");
      if (!i) return;
      e.stopPropagation();
      const u = i.closest("[data-ln-item]");
      if (!u) return;
      const l = i.getAttribute("data-ln-item-action"), s = u.getAttribute("data-ln-item-id"), c = u._lnRecord || {};
      w(t, "ln-list:item-action", {
        list: o.name,
        id: s,
        action: l,
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
    this._data = [], t.length > 0 && (this._itemHeight = n(t[0]) || 50);
    for (let o = 0; o < t.length; o++) {
      const e = t[o], i = e.getAttribute("data-ln-item-id") || e.getAttribute("id"), u = e.textContent.trim().toLowerCase();
      let l = null;
      if (this.isDataDriven) {
        l = {}, i != null && (l.id = i);
        const s = e.querySelectorAll("[data-ln-list-field]");
        for (let c = 0; c < s.length; c++) {
          const g = s[c], a = g.getAttribute("data-ln-list-field");
          a && (l[a] = g.textContent.trim());
        }
      }
      this._data.push({
        html: e.outerHTML,
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
      const t = (this.currentSearch || "").trim().toLowerCase(), o = this.currentFilters || {}, e = Object.keys(o).length > 0;
      if (this._filteredData = this._data.filter(function(s) {
        if (t) {
          let c = !1;
          for (const g in s)
            if (s.hasOwnProperty(g) && typeof s[g] == "string" && g !== "html" && g !== "searchText" && s[g].toLowerCase().indexOf(t) !== -1) {
              c = !0;
              break;
            }
          if (!c) return !1;
        }
        if (e)
          for (const c in o) {
            const g = o[c];
            if (g && g.length > 0) {
              const a = s[c], _ = a != null ? String(a) : "";
              if (g.indexOf(_) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, u = this.currentSort.direction === "desc" ? -1 : 1, l = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(s, c) {
        return s < c ? -1 : s > c ? 1 : 0;
      };
      this._filteredData.sort(function(s, c) {
        const g = s[i], a = c[i];
        if (typeof g == "number" && typeof a == "number")
          return (g - a) * u;
        const _ = g != null ? String(g) : "", y = a != null ? String(a) : "";
        return l(_, y) * u;
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
  }, r.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), o = t.gridTemplateColumns;
    let e = 1;
    if (o && o !== "none") {
      const u = o.trim().split(/\s+/).filter(Boolean);
      u.length > 0 && (e = u.length);
    }
    const i = parseFloat(t.rowGap);
    return { columns: e, rowGap: isNaN(i) ? 0 : i };
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
    const t = this._filteredData, o = t.length, e = this._itemHeight;
    if (!e || !o) return;
    const i = this._scrollContainer;
    let u, l;
    if (i) {
      const O = this.tbody.getBoundingClientRect(), I = i.getBoundingClientRect(), F = i === this.tbody ? 0 : O.top - I.top + i.scrollTop;
      u = i.scrollTop - F, l = i.clientHeight;
    } else {
      const I = this.tbody.getBoundingClientRect().top + window.scrollY;
      u = window.scrollY - I, l = window.innerHeight;
    }
    const s = this._readGridLayout(), c = s.columns, g = s.rowGap, a = e + g, _ = Math.ceil(o / c);
    let y = Math.max(0, Math.floor(u / a) - 15);
    y = Math.min(y, _);
    const E = Math.ceil(l / a) + 30, S = Math.min(y + E, _), A = Math.min(y * c, o), L = Math.min(S * c, o);
    if (A === this._vStart && L === this._vEnd) return;
    this._vStart = A, this._vEnd = L;
    const k = y * a, x = (_ - S) * a;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (k > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = k + "px", O.appendChild(I);
      }
      for (let I = A; I < L; I++) {
        const F = this._buildItem(t[I]);
        F && O.appendChild(F);
      }
      if (x > 0) {
        const I = document.createElement(this.isUl ? "li" : "div");
        I.className = "ln-list__spacer", I.style.height = x + "px", O.appendChild(I);
      }
      this.tbody.textContent = "", this.tbody.appendChild(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      k > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${k}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let I = A; I < L; I++)
        O += t[I].html;
      x > 0 && (O += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${x}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = O;
    }
  }, r.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const o = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount, i = this.currentSearch && (e < o || e === 0), u = i ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = Q(this.dom, u, "ln-list"), !t) {
        const l = this.dom.querySelector("template[data-ln-empty]");
        if (l) {
          const s = i ? "search" : "initial", c = l.content.querySelector(`[data-ln-empty-when="${s}"]`) || l.content.firstElementChild;
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
  }, r.prototype._buildItem = function(t) {
    const o = Q(this.dom, this.name + "-row", "ln-list");
    if (!o) return null;
    const e = o.querySelector("[data-ln-item]") || o.firstElementChild;
    if (!e) return null;
    if (_t(e, t), Y(e, t), e._lnRecord = t, t.id != null && (e.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      e.classList.add("ln-item-selected");
      const i = e.querySelector("[data-ln-item-select]");
      i && (i.checked = !0);
    }
    return e;
  }, r.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(o) {
      const e = o.target.closest("[data-ln-item-select]");
      if (!e) return;
      const i = e.closest("[data-ln-item]");
      if (!i) return;
      const u = i.getAttribute("data-ln-item-id");
      u != null && (e.checked ? (t.selectedIds.add(String(u)), i.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(u)), i.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), w(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const o = t._selectAllCheckbox.checked, e = t.tbody.querySelectorAll("[data-ln-item]");
      for (let i = 0; i < e.length; i++) {
        const u = e[i], l = u.getAttribute("data-ln-item-id"), s = u.querySelector("[data-ln-item-select]");
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
    for (let e = 0; e < t.length; e++) {
      const i = t[e].getAttribute("data-ln-item-id");
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
    const t = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount, e = o < t;
    if (this._totalSpan && (this._totalSpan.textContent = t), this._filteredSpan && (this._filteredSpan.textContent = e ? o : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const i = this.selectedIds.size;
      this._selectedSpan.textContent = i > 0 ? i : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, r.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, B(h, d, r, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", d = "lnCircularProgress";
  if (window[d] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", m = 36, p = 16, f = 2 * Math.PI * p;
  function n(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), o.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  n.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[d]);
  };
  function r(i, u) {
    const l = document.createElementNS(b, i);
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
  function o() {
    const i = this, u = new MutationObserver(function(l) {
      for (const s of l)
        (s.attributeName === "data-ln-circular-progress" || s.attributeName === "data-ln-circular-progress-max") && e.call(i);
    });
    u.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = u;
  }
  function e() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, u = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let l = u > 0 ? i / u * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100);
    const s = f - l / 100 * f;
    this.progressCircle.setAttribute("stroke-dashoffset", s);
    const c = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = c !== null ? c : Math.round(l) + "%", w(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: u,
      percentage: l
    });
  }
  B(h, d, n, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", d = "lnSortable", b = "data-ln-sortable-handle";
  if (window[d] !== void 0) return;
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
    this.dom[d] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), w(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[d]);
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
    const o = Array.from(this.dom.children).indexOf(r);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: r,
      index: o
    }).defaultPrevented) return;
    f.preventDefault(), n.setPointerCapture(f.pointerId), this._dragging = r, r.classList.add("ln-sortable--dragging"), r.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), w(this.dom, "ln-sortable:drag-start", {
      item: r,
      index: o
    });
    const i = this, u = function(s) {
      i._handlePointerMove(s);
    }, l = function(s) {
      i._handlePointerEnd(s), n.removeEventListener("pointermove", u), n.removeEventListener("pointerup", l), n.removeEventListener("pointercancel", l);
    };
    n.addEventListener("pointermove", u), n.addEventListener("pointerup", l), n.addEventListener("pointercancel", l);
  }, m.prototype._handlePointerMove = function(f) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), r = this._dragging;
    for (const t of n)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of n) {
      if (t === r) continue;
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
    const n = this._dragging, r = Array.from(this.dom.children), t = r.indexOf(n);
    let o = null, e = null;
    for (const i of r) {
      if (i.classList.contains("ln-sortable--drop-before")) {
        o = i, e = "before";
        break;
      }
      if (i.classList.contains("ln-sortable--drop-after")) {
        o = i, e = "after";
        break;
      }
    }
    for (const i of r)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== n) {
      e === "before" ? this.dom.insertBefore(n, o) : this.dom.insertBefore(n, o.nextElementSibling);
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
    const n = f[d];
    if (!n) return;
    const r = f.getAttribute(h) !== "disabled";
    r !== n.isEnabled && (n.isEnabled = r, w(f, r ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: f }));
  }
  B(h, d, m, "ln-sortable", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-confirm", d = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[d] !== void 0) return;
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
    this.dom[d] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[d]);
  }, B(h, d, p, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", d = "lnTranslations";
  if (window[d] !== void 0) return;
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
      const t = vt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const o = t.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", r), o.textContent = this.locales[r], o.addEventListener("click", function(e) {
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
      const n = vt("ln-translations-badge", "ln-translations");
      if (!n) return;
      const r = n.querySelector("[data-ln-translations-lang]");
      r.setAttribute("data-ln-translations-lang", f);
      const t = r.querySelector("span");
      t.textContent = p.locales[f] || f.toUpperCase();
      const o = r.querySelector("button");
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
      const l = u.cloneNode(!1);
      i ? l.name = i + "[trans][" + p + "][" + e + "]" : l.name = "trans[" + p + "][" + e + "]", l.value = f[e] !== void 0 ? f[e] : "", l.removeAttribute("id"), l.placeholder = n + " translation", l.setAttribute("data-ln-translatable-lang", p);
      const s = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), c = s.length > 0 ? s[s.length - 1] : u;
      c.parentNode.insertBefore(l, c.nextSibling);
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
    if (!this.dom[d]) return;
    const p = this.defaultLang, f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of f)
      n.getAttribute("data-ln-translatable-lang") !== p && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[d];
  }, B(h, d, m, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", d = "lnAutosave", b = "data-ln-autosave-clear", m = "data-ln-autosave-debounce-input", p = "ln-autosave:";
  if (window[d] !== void 0) return;
  function n(e) {
    const i = r(e);
    if (!i) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = i;
    let u = null;
    function l() {
      const a = jt(e);
      try {
        localStorage.setItem(i, JSON.stringify(a));
      } catch {
        return;
      }
      w(e, "ln-autosave:saved", { target: e, data: a });
    }
    function s() {
      let a;
      try {
        a = localStorage.getItem(i);
      } catch {
        return;
      }
      if (!a) return;
      let _;
      try {
        _ = JSON.parse(a);
      } catch {
        return;
      }
      if (z(e, "ln-autosave:before-restore", { target: e, data: _ }).defaultPrevented) return;
      const E = zt(e, _);
      for (let S = 0; S < E.length; S++)
        E[S].dispatchEvent(new Event("input", { bubbles: !0 })), E[S].dispatchEvent(new Event("change", { bubbles: !0 }));
      w(e, "ln-autosave:restored", { target: e, data: _ });
    }
    function c() {
      try {
        localStorage.removeItem(i);
      } catch {
        return;
      }
      w(e, "ln-autosave:cleared", { target: e });
    }
    this._onFocusout = function(a) {
      const _ = a.target;
      t(_) && _.name && l();
    }, this._onChange = function(a) {
      const _ = a.target;
      t(_) && _.name && l();
    }, this._onSubmit = function() {
      c();
    }, this._onReset = function() {
      c();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + b + "]") && c();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick);
    const g = o(e);
    return g > 0 && (this._onInput = function(a) {
      const _ = a.target;
      !t(_) || !_.name || (u !== null && clearTimeout(u), u = setTimeout(l, g));
    }, e.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, s(), this;
  }
  n.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const e = this._getInputTimer();
        e !== null && clearTimeout(e);
      }
      w(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function r(e) {
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
  B(h, d, n, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", d = "lnAutoresize";
  if (window[d] !== void 0) return;
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
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[d]);
  }, B(h, d, b, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", d = "lnValidate", b = "data-ln-validate-errors", m = "data-ln-validate-error", p = "ln-validate-valid", f = "ln-validate-invalid", n = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[d] !== void 0) return;
  function r(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, e = t.tagName, i = t.type, u = e === "SELECT" || i === "checkbox" || i === "radio";
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
        const g = c.querySelector("[" + m + '="' + s + '"]');
        g && g.classList.remove("hidden");
      }
      t.classList.remove(p), t.classList.add(f);
    }, this._onClearCustom = function(l) {
      const s = l.detail && l.detail.error, c = t.closest(".form-element");
      if (s) {
        if (o._customErrors.delete(s), c) {
          const g = c.querySelector("[" + m + '="' + s + '"]');
          g && g.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(g) {
          if (c) {
            const a = c.querySelector("[" + m + '="' + g + '"]');
            a && a.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, u || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  r.prototype.validate = function() {
    const t = this.dom, o = t.validity, i = t.checkValidity() && this._customErrors.size === 0, u = t.closest(".form-element");
    if (u) {
      const s = u.querySelector("[" + b + "]");
      if (s) {
        const c = s.querySelectorAll("[" + m + "]");
        for (let g = 0; g < c.length; g++) {
          const a = c[g].getAttribute(m), _ = n[a];
          _ && (o[_] ? c[g].classList.remove("hidden") : c[g].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(p, i), t.classList.toggle(f, !i), w(t, i ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), i;
  }, r.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, f);
    const t = this.dom.closest(".form-element");
    if (t) {
      const o = t.querySelectorAll("[" + m + "]");
      for (let e = 0; e < o.length; e++)
        o[e].classList.add("hidden");
    }
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), r.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(p, f), w(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, r, "ln-validate");
})();
(function() {
  const h = "data-ln-form", d = "lnForm", b = "data-ln-form-auto", m = "data-ln-form-debounce", p = "data-ln-form-typed", f = "data-ln-validate", n = "lnValidate";
  if (window[d] !== void 0) return;
  function r(t) {
    this.dom = t, this._debounceTimer = null;
    const o = this;
    if (this._onValid = function() {
      o._updateSubmitButton();
    }, this._onInvalid = function() {
      o._updateSubmitButton();
    }, this._onSubmit = function(e) {
      e.preventDefault(), o.submit();
    }, this._onFill = function(e) {
      e.detail && o.fill(e.detail);
    }, this._onFormReset = function() {
      o.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        o._resetValidation();
      }, 0);
    }, t.addEventListener("ln-validate:valid", this._onValid), t.addEventListener("ln-validate:invalid", this._onInvalid), t.addEventListener("submit", this._onSubmit), t.addEventListener("ln-form:fill", this._onFill), t.addEventListener("ln-form:reset", this._onFormReset), t.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, t.hasAttribute(b)) {
      const e = parseInt(t.getAttribute(m)) || 0;
      this._onAutoInput = function() {
        e > 0 ? (clearTimeout(o._debounceTimer), o._debounceTimer = setTimeout(function() {
          o.submit();
        }, e)) : o.submit();
      }, t.addEventListener("input", this._onAutoInput), t.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  r.prototype._updateSubmitButton = function() {
    const t = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!t.length) return;
    const o = this.dom.querySelectorAll("[" + f + "]");
    let e = !1;
    if (o.length > 0) {
      let i = !1, u = !1;
      for (let l = 0; l < o.length; l++) {
        const s = o[l][n];
        s && s._touched && (i = !0), o[l].checkValidity() || (u = !0);
      }
      e = u || !i;
    }
    for (let i = 0; i < t.length; i++)
      t[i].disabled = e;
  }, r.prototype.fill = function(t) {
    const o = zt(this.dom, t);
    for (let e = 0; e < o.length; e++) {
      const i = o[e], u = i.tagName === "SELECT" || i.type === "checkbox" || i.type === "radio";
      i.dispatchEvent(new Event(u ? "change" : "input", { bubbles: !0 }));
    }
  }, r.prototype.submit = function() {
    const t = this.dom.querySelectorAll("[" + f + "]");
    let o = !0;
    for (let i = 0; i < t.length; i++) {
      const u = t[i][n];
      u && (u.validate() || (o = !1));
    }
    if (!o) return;
    const e = jt(this.dom, { typed: this.dom.hasAttribute(p) });
    w(this.dom, "ln-form:submit", { data: e });
  }, r.prototype.reset = function() {
    this.dom.reset();
    const t = this.dom.querySelectorAll("input, textarea, select");
    for (let o = 0; o < t.length; o++) {
      const e = t[o], i = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), w(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, r.prototype._resetValidation = function() {
    const t = this.dom.querySelectorAll("[" + f + "]");
    for (let o = 0; o < t.length; o++) {
      const e = t[o][n];
      e && e.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      const t = this.dom.querySelectorAll("[" + f + "]");
      for (let o = 0; o < t.length; o++)
        if (!t[o].checkValidity()) return !1;
      return !0;
    }
  }), r.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), w(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, r, "ln-form");
})();
(function() {
  const h = "data-ln-slug-from", d = "lnSlug";
  if (window[d] !== void 0) return;
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
    this.dom[d] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[d]);
  }, B(h, d, m, "ln-slug");
})();
(function() {
  const h = "data-ln-time", d = "lnTime";
  if (window[d] !== void 0) return;
  const b = {}, m = {};
  function p(S) {
    return S.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function f(S, A) {
    const L = (S || "") + "|" + JSON.stringify(A);
    return b[L] || (b[L] = new Intl.DateTimeFormat(S, A)), b[L];
  }
  function n(S) {
    const A = S || "";
    return m[A] || (m[A] = new Intl.RelativeTimeFormat(S, { numeric: "auto", style: "narrow" })), m[A];
  }
  const r = /* @__PURE__ */ new Set();
  let t = null;
  function o() {
    t || (t = setInterval(i, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function i() {
    for (const S of r) {
      if (!document.body.contains(S.dom)) {
        r.delete(S);
        continue;
      }
      a(S);
    }
    r.size === 0 && e();
  }
  function u(S, A) {
    return f(A, { dateStyle: "long", timeStyle: "short" }).format(S);
  }
  function l(S, A) {
    const L = /* @__PURE__ */ new Date(), k = { month: "short", day: "numeric" };
    return S.getFullYear() !== L.getFullYear() && (k.year = "numeric"), f(A, k).format(S);
  }
  function s(S, A) {
    return f(A, { dateStyle: "medium" }).format(S);
  }
  function c(S, A) {
    return f(A, { timeStyle: "short" }).format(S);
  }
  function g(S, A) {
    const L = Math.floor(Date.now() / 1e3), x = Math.floor(S.getTime() / 1e3) - L, O = Math.abs(x);
    if (O < 10) return n(A).format(0, "second");
    let I, F;
    if (O < 60)
      I = "second", F = x;
    else if (O < 3600)
      I = "minute", F = Math.round(x / 60);
    else if (O < 86400)
      I = "hour", F = Math.round(x / 3600);
    else if (O < 604800)
      I = "day", F = Math.round(x / 86400);
    else if (O < 2592e3)
      I = "week", F = Math.round(x / 604800);
    else
      return l(S, A);
    return n(A).format(F, I);
  }
  function a(S) {
    const A = S.dom.getAttribute("datetime");
    if (!A) return;
    const L = Number(A);
    if (isNaN(L)) return;
    const k = new Date(L * 1e3), x = S.dom.getAttribute(h) || "short", O = p(S.dom);
    let I;
    switch (x) {
      case "relative":
        I = g(k, O);
        break;
      case "full":
        I = u(k, O);
        break;
      case "date":
        I = s(k, O);
        break;
      case "time":
        I = c(k, O);
        break;
      default:
        I = l(k, O);
        break;
    }
    S.dom.textContent = I, x !== "full" && (S.dom.title = u(k, O));
  }
  function _(S) {
    return this.dom = S, a(this), S.getAttribute(h) === "relative" && (r.add(this), o()), this;
  }
  _.prototype.render = function() {
    a(this);
  }, _.prototype.destroy = function() {
    r.delete(this), r.size === 0 && e(), delete this.dom[d];
  };
  function y(S) {
    const A = S[d];
    if (!A) return;
    S.getAttribute(h) === "relative" ? (r.add(A), o()) : (r.delete(A), r.size === 0 && e()), a(A);
  }
  function E(S) {
    S.nodeType === 1 && S.hasAttribute && S.hasAttribute(h) && S[d] && a(S[d]);
  }
  B(h, d, _, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: y,
    onInit: E
  });
})();
(function() {
  const h = "data-ln-data-store", d = "lnDataStore";
  if (window[d] !== void 0) return;
  const b = "ln_app_cache", m = "_meta", p = "1.0";
  let f = null, n = null;
  const r = {};
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
        const D = C.getAttribute("data-ln-data-store-indexes") || C.getAttribute("data-ln-store-indexes") || "";
        v[T] = {
          indexes: D.split(",").map((R) => R.trim()).filter(Boolean)
        };
      }
    }
    return v;
  }
  function i() {
    return n || (n = new Promise((v) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), v(null);
      const C = e(), T = Object.keys(C), D = indexedDB.open(b);
      D.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), v(null);
      }, D.onsuccess = (R) => {
        const M = R.target.result, N = Array.from(M.objectStoreNames);
        if (!(!N.includes(m) || T.some((pt) => !N.includes(pt))))
          return u(M), f = M, v(M);
        const J = M.version;
        M.close();
        const et = indexedDB.open(b, J + 1);
        et.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, et.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), v(null);
        }, et.onupgradeneeded = (pt) => {
          const ot = pt.target.result;
          ot.objectStoreNames.contains(m) || ot.createObjectStore(m, { keyPath: "key" });
          for (const Ct of T)
            if (!ot.objectStoreNames.contains(Ct)) {
              const ne = ot.createObjectStore(Ct, { keyPath: "id" });
              for (const Nt of C[Ct].indexes)
                ne.createIndex(Nt, Nt, { unique: !1 });
            }
        }, et.onsuccess = (pt) => {
          const ot = pt.target.result;
          u(ot), f = ot, v(ot);
        };
      };
    }), n);
  }
  function u(v) {
    v.onversionchange = () => {
      v.close(), f = null, n = null;
    };
  }
  function l() {
    return f ? Promise.resolve(f) : (n = null, i());
  }
  async function s(v) {
    if (!mt() || !v) return v;
    const C = { ...v }, T = C.id, D = C._pending, R = await de(C);
    return !R || !R.encrypted ? v : {
      id: T,
      _pending: D,
      encrypted: !0,
      iv: R.iv,
      data: R.data
    };
  }
  async function c(v) {
    return !v || !v.encrypted || !mt() ? v : ue(v);
  }
  const g = (v, C) => l().then((T) => T ? T.transaction(v, C).objectStore(v) : null);
  function a(v) {
    return new Promise((C, T) => {
      v.onsuccess = () => C(v.result), v.onerror = () => {
        o(v.error), T(v.error);
      };
    });
  }
  const _ = (v) => g(v, "readonly").then((C) => C ? a(C.getAll()) : []).then((C) => mt() ? Promise.all(C.map((T) => c(T))) : C), y = (v, C) => g(v, "readonly").then((T) => T ? a(T.get(C)) : null).then((T) => T ? c(T) : null), E = (v, C) => (mt() ? s(C) : Promise.resolve(C)).then((D) => g(v, "readwrite").then((R) => R ? a(R.put(D)) : null)), S = (v, C) => g(v, "readwrite").then((T) => T ? a(T.delete(C)) : null), A = (v) => g(v, "readwrite").then((C) => C ? a(C.clear()) : null), L = (v) => g(v, "readonly").then((C) => C ? a(C.count()) : 0), k = (v) => g(m, "readonly").then((C) => C ? a(C.get(v)) : null), x = (v, C) => g(m, "readwrite").then((T) => {
    if (T)
      return C.key = v, a(T.put(C));
  });
  function O(v) {
    this.dom = v, this._name = v.getAttribute(h);
    const C = v.getAttribute("data-ln-data-store-stale") || v.getAttribute("data-ln-store-stale"), T = parseInt(C, 10);
    this._staleThreshold = C === "never" || C === "-1" ? -1 : isNaN(T) ? 300 : T;
    const D = v.getAttribute("data-ln-data-store-search-fields") || v.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = D.split(",").map((R) => R.trim()).filter(Boolean), this._noAutosync = v.hasAttribute("data-ln-data-store-no-autosync") || v.hasAttribute("data-ln-store-no-autosync"), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, r[this._name] = this, I(this), bt(this), this;
  }
  function I(v) {
    v._handlers = {
      create: (C) => F(v, C.detail),
      update: (C) => j(v, C.detail),
      delete: (C) => Z(v, C.detail),
      "bulk-delete": (C) => tt(v, C.detail)
    };
    for (const [C, T] of Object.entries(v._handlers))
      v.dom.addEventListener(`ln-store:request-${C}`, T);
  }
  function F(v, { data: C = {} } = {}) {
    const T = `_temp_${t()}`, D = { ...C, id: T, _pending: !0 };
    E(v._name, D).then(() => {
      v.totalCount++, w(v.dom, "ln-store:created", { store: v._name, record: D, tempId: T }), w(v.dom, "ln-store:request-remote-create", { tempId: T, data: C });
    });
  }
  function j(v, { id: C, data: T = {}, expected_version: D } = {}) {
    y(v._name, C).then((R) => {
      if (!R) throw new Error(`Record not found: ${C}`);
      v._pendingSnapshots[C] = { ...R };
      const M = { ...R, ...T, _pending: !0 };
      return E(v._name, M).then(() => {
        w(v.dom, "ln-store:updated", { store: v._name, record: M, previous: v._pendingSnapshots[C] }), w(v.dom, "ln-store:request-remote-update", { id: C, data: T, expected_version: D });
      });
    }).catch((R) => console.error("[ln-data-store] Optimistic update failed:", R));
  }
  function Z(v, { id: C } = {}) {
    y(v._name, C).then((T) => {
      if (T)
        return v._pendingSnapshots[C] = { ...T }, S(v._name, C).then(() => {
          v.totalCount--, w(v.dom, "ln-store:deleted", { store: v._name, id: C }), w(v.dom, "ln-store:request-remote-delete", { id: C });
        });
    }).catch((T) => console.error("[ln-data-store] Optimistic delete failed:", T));
  }
  function tt(v, { ids: C = [] } = {}) {
    C.length && Promise.all(C.map((T) => y(v._name, T))).then((T) => {
      const D = T.filter(Boolean), R = D.map((M) => M.id);
      return v._pendingSnapshots[R.join(",")] = D, ut(v._name, R).then(() => {
        v.totalCount -= R.length, w(v.dom, "ln-store:deleted", { store: v._name, ids: R }), w(v.dom, "ln-store:request-remote-bulk-delete", { ids: R });
      });
    }).catch((T) => console.error("[ln-data-store] Optimistic bulk delete failed:", T));
  }
  function bt(v) {
    i().then(() => k(v._name)).then((C) => {
      C && C.schema_version === p ? (v.lastSyncedAt = C.last_synced_at || null, v.totalCount = C.record_count || 0, v.totalCount > 0 ? (v.isLoaded = !0, w(v.dom, "ln-store:ready", { store: v._name, count: v.totalCount, source: "cache" }), ct(v) && $(v)) : $(v)) : C && C.schema_version !== p ? A(v._name).then(() => x(v._name, { schema_version: p, last_synced_at: null, record_count: 0 })).then(() => $(v)) : $(v);
    });
  }
  function ct(v) {
    return v._staleThreshold === -1 ? !1 : v.lastSyncedAt ? Math.floor(Date.now() / 1e3) - v.lastSyncedAt > v._staleThreshold : !0;
  }
  function $(v) {
    v.isSyncing = !0, w(v.dom, "ln-store:request-remote-sync", { since: v.lastSyncedAt });
  }
  function dt(v, C) {
    return l().then((T) => T ? (mt() ? Promise.all(C.map((R) => s(R))) : Promise.resolve(C)).then((R) => new Promise((M, N) => {
      const U = T.transaction(v, "readwrite"), J = U.objectStore(v);
      R.forEach((et) => J.put(et)), U.oncomplete = () => M(), U.onerror = () => {
        o(U.error), N(U.error);
      };
    })) : void 0);
  }
  function ut(v, C) {
    return l().then((T) => {
      if (T)
        return new Promise((D, R) => {
          const M = T.transaction(v, "readwrite"), N = M.objectStore(v);
          C.forEach((U) => N.delete(U)), M.oncomplete = () => D(), M.onerror = () => R(M.error);
        });
    });
  }
  let q = () => {
    document.visibilityState === "visible" && Object.values(r).forEach((v) => {
      v.isLoaded && !v.isSyncing && ct(v) && $(v);
    });
  };
  document.addEventListener("visibilitychange", q);
  let P = () => {
    w(document, "ln-store:online", {}), Object.values(r).forEach((v) => {
      v._noAutosync || v.isLoaded && !v.isSyncing && $(v);
    });
  };
  window.addEventListener("online", P);
  let H = () => {
    w(document, "ln-store:offline", {});
  };
  window.addEventListener("offline", H);
  const ht = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function nt(v, C) {
    if (!C || !C.field) return v;
    const { field: T, direction: D } = C, R = D === "desc";
    return [...v].sort((M, N) => {
      const U = M[T], J = N[T];
      if (U == null && J == null) return 0;
      if (U == null) return R ? 1 : -1;
      if (J == null) return R ? -1 : 1;
      const et = typeof U == "string" && typeof J == "string" ? ht.compare(U, J) : U < J ? -1 : U > J ? 1 : 0;
      return R ? -et : et;
    });
  }
  function W(v, C) {
    if (!C) return v;
    const T = Object.keys(C).filter((D) => Array.isArray(C[D]) && C[D].length > 0);
    return T.length ? v.filter(
      (D) => T.every((R) => C[R].map(String).includes(String(D[R])))
    ) : v;
  }
  function ft(v, C, T) {
    if (!C || !T || !T.length) return v;
    const D = C.toLowerCase();
    return v.filter(
      (R) => T.some((M) => {
        const N = R[M];
        return N != null && String(N).toLowerCase().includes(D);
      })
    );
  }
  function it(v, C, T) {
    if (!v.length) return 0;
    if (T === "count") return v.length;
    const D = v.map((M) => parseFloat(M[C])).filter((M) => !isNaN(M)), R = D.reduce((M, N) => M + N, 0);
    return T === "sum" ? R : T === "avg" && D.length ? R / D.length : 0;
  }
  function st(v, C) {
    if (!v.presenters || !v.presenters.computed) return C;
    const T = v.presenters.computed;
    return C.map((D) => {
      const R = { ...D };
      for (const [M, N] of Object.entries(T))
        try {
          R[M] = N(D);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${M}`, U);
        }
      return R;
    });
  }
  O.prototype.getAll = function(v = {}) {
    const C = this;
    return _(C._name).then((T) => {
      const D = T.length;
      v.filters && (T = W(T, v.filters)), v.search && (T = ft(T, v.search, C._searchFields));
      const R = T.length;
      if (v.sort && (T = nt(T, v.sort)), v.offset || v.limit) {
        const M = v.offset || 0, N = v.limit || T.length;
        T = T.slice(M, M + N);
      }
      return {
        data: st(C, T),
        total: D,
        filtered: R
      };
    });
  }, O.prototype.getById = function(v) {
    return y(this._name, v).then((C) => C ? st(this, [C])[0] : null);
  }, O.prototype.count = function(v) {
    return v ? _(this._name).then((C) => W(C, v).length) : L(this._name);
  }, O.prototype.aggregate = function(v, C) {
    return _(this._name).then((T) => it(T, v, C));
  }, O.prototype.setPresenters = function(v) {
    this.presenters = v;
  }, O.prototype.applySync = function(v, C, T) {
    const D = this, R = v.length > 0 || C.length > 0;
    let M = Promise.resolve();
    return v.length > 0 && (M = M.then(() => dt(D._name, v))), C.length > 0 && (M = M.then(() => ut(D._name, C))), M.then(() => L(D._name)).then((N) => (D.totalCount = N, x(D._name, {
      schema_version: p,
      last_synced_at: T,
      record_count: N
    }))).then(() => {
      const N = !D.isLoaded;
      D.isLoaded = !0, D.isSyncing = !1, D.lastSyncedAt = T, N ? (w(D.dom, "ln-store:loaded", { store: D._name, count: D.totalCount }), w(D.dom, "ln-store:ready", { store: D._name, count: D.totalCount, source: "server" })) : w(D.dom, "ln-store:synced", {
        store: D._name,
        added: v.length,
        deleted: C.length,
        changed: R
      });
    }).catch((N) => {
      D.isSyncing = !1, console.error("[ln-data-store] applySync failed:", N);
    });
  }, O.prototype.confirmMutation = function(v, C, T) {
    const D = this, R = {
      create: () => S(D._name, v).then(() => E(D._name, C)).then(() => {
        delete D._pendingSnapshots[v], w(D.dom, "ln-store:confirmed", { store: D._name, record: C, tempId: v, action: "create" });
      }),
      update: () => E(D._name, C).then(() => {
        delete D._pendingSnapshots[v], w(D.dom, "ln-store:confirmed", { store: D._name, record: C, action: "update" });
      }),
      delete: () => (delete D._pendingSnapshots[v], w(D.dom, "ln-store:confirmed", { store: D._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete D._pendingSnapshots[v], w(D.dom, "ln-store:confirmed", { store: D._name, record: null, ids: v.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return R[T] ? R[T]() : Promise.resolve();
  }, O.prototype.revertMutation = function(v, C, T) {
    const D = this, R = T || `Server rejected ${C}`, M = {
      create: () => S(D._name, v).then(() => {
        D.totalCount--, delete D._pendingSnapshots[v], w(D.dom, "ln-store:reverted", { store: D._name, record: null, action: "create", error: R });
      }),
      update: () => {
        const N = D._pendingSnapshots[v];
        return N ? E(D._name, N).then(() => {
          delete D._pendingSnapshots[v], w(D.dom, "ln-store:reverted", { store: D._name, record: N, action: "update", error: R });
        }) : Promise.resolve();
      },
      delete: () => {
        const N = D._pendingSnapshots[v];
        return N ? E(D._name, N).then(() => {
          D.totalCount++, delete D._pendingSnapshots[v], w(D.dom, "ln-store:reverted", { store: D._name, record: N, action: "delete", error: R });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const N = D._pendingSnapshots[v];
        return !N || !N.length ? Promise.resolve() : dt(D._name, N).then(() => {
          D.totalCount += N.length, delete D._pendingSnapshots[v], w(D.dom, "ln-store:reverted", { store: D._name, record: null, ids: v.split(","), action: "bulk-delete", error: R });
        });
      }
    };
    return M[C] ? M[C]() : Promise.resolve();
  }, O.prototype.resolveConflict = function(v, C, T) {
    const D = this._pendingSnapshots[v];
    return D ? E(this._name, D).then(() => {
      delete this._pendingSnapshots[v], w(this.dom, "ln-store:conflict", {
        store: this._name,
        local: D,
        remote: C,
        field_diffs: T || null
      });
    }) : Promise.resolve();
  }, O.prototype.forceSync = function() {
    $(this);
  }, O.prototype.fullReload = function() {
    const v = this;
    return A(v._name).then(() => {
      v.isLoaded = !1, v.lastSyncedAt = null, v.totalCount = 0, $(v);
    });
  }, O.prototype.destroy = function() {
    if (this._handlers) {
      for (const [v, C] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${v}`, C);
      this._handlers = null;
    }
    delete r[this._name], Object.keys(r).length === 0 && (q && (document.removeEventListener("visibilitychange", q), q = null), P && (window.removeEventListener("online", P), P = null), H && (window.removeEventListener("offline", H), H = null)), delete this.dom[d], w(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function yt() {
    return l().then((v) => {
      if (!v) return;
      const C = Array.from(v.objectStoreNames);
      return new Promise((T, D) => {
        const R = v.transaction(C, "readwrite");
        C.forEach((M) => R.objectStore(M).clear()), R.oncomplete = () => T(), R.onerror = () => D(R.error);
      });
    }).then(() => {
      Object.values(r).forEach((v) => {
        v.isLoaded = !1, v.isSyncing = !1, v.lastSyncedAt = null, v.totalCount = 0;
      });
    });
  }
  B(h, d, O, "ln-data-store"), window[d].clearAll = yt, window[d].init = window[d], window[d].setStorageKey = Bt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Bt);
})();
(function() {
  const h = "data-ln-api-connector", d = "lnApiConnector", b = "lnConnector";
  if (window[d] !== void 0) return;
  function m(n) {
    return this.dom = n, n[d] = this, n[b] = this, this.refreshConfig(), this._handlers = null, p(this), this;
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
    return n != null && n !== "" && (t += (t.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n)), window.fetch(t, { method: "GET", headers: K(r.headers), credentials: r.credentials }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
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
    }).then((o) => {
      if (o.ok) return o.json();
      if (o.status === 409) return o.json().then((e) => {
        const i = new Error("Conflict");
        throw i.status = 409, i.data = e, i;
      });
      throw new Error("HTTP " + o.status + ": " + o.statusText);
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
        const o = t.detail || {};
        n.fetchDelta(o.since).then(function(e) {
          w(n.dom, "ln-api-connector:fetched", { data: e, since: o.since });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
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
          w(n.dom, "ln-api-connector:created", { record: e, tempId: o.tempId });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
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
          w(n.dom, "ln-api-connector:updated", { record: i, id: o.id });
        }).catch(function(i) {
          w(n.dom, "ln-api-connector:error", {
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
          w(n.dom, "ln-api-connector:deleted", { response: e, id: o.id });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
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
          w(n.dom, "ln-api-connector:bulk-deleted", { response: e, ids: o.ids });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
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
    if (!this.dom[d]) return;
    const n = this;
    n._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), w(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[b];
  };
  function f(n) {
    const r = n[d];
    r && r.refreshConfig();
  }
  B(h, d, m, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", d = "lnCouchDbConnector", b = "lnConnector";
  if (window[d] !== void 0) return;
  function m(n) {
    return this.dom = n, n[d] = this, n[b] = this, this.refreshConfig(), this._handlers = null, p(this), this;
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
    const o = V(r.url, r.db, "_changes") + "?" + t.join("&");
    return window.fetch(o, { method: "GET", headers: K(r.headers, r.auth), credentials: r.credentials }).then((e) => {
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
    const r = this, t = Object.assign({ _id: n.id }, n);
    return t._id || delete t._id, window.fetch(V(r.url, r.db), {
      method: "POST",
      headers: K(r.headers, r.auth),
      credentials: r.credentials,
      body: JSON.stringify(t)
    }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => Object.assign({}, t, { id: o.id, _id: o.id, _rev: o.rev }));
  }, m.prototype.update = function(n, r) {
    const t = this, o = Object.assign({ id: String(n), _id: String(n) }, r), e = o._rev || o.rev;
    return (e ? Promise.resolve(e) : window.fetch(V(t.url, t.db, null, n), { method: "GET", headers: K(t.headers, t.auth), credentials: t.credentials }).then((u) => {
      if (!u.ok) throw new Error("Could not retrieve document for revision mapping");
      return u.json().then((l) => l._rev);
    })).then((u) => {
      const l = Object.assign({}, o, { _rev: u });
      delete l.rev;
      const s = Object.assign(K(t.headers, t.auth), { "If-Match": u });
      return window.fetch(V(t.url, t.db, null, n), {
        method: "PUT",
        headers: s,
        credentials: t.credentials,
        body: JSON.stringify(l)
      }).then((c) => {
        if (c.ok) return c.json().then((g) => Object.assign({}, l, { _rev: g.rev }));
        if (c.status === 409) return c.json().then((g) => {
          const a = new Error("Conflict");
          throw a.status = 409, a.data = g, a;
        });
        throw new Error("HTTP " + c.status + ": " + c.statusText);
      });
    });
  }, m.prototype.delete = function(n, r) {
    const t = this;
    return (r ? Promise.resolve(r) : window.fetch(V(t.url, t.db, null, n), { method: "GET", headers: K(t.headers, t.auth), credentials: t.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((i) => i._rev);
    })).then((e) => {
      const i = V(t.url, t.db, null, n) + "?rev=" + encodeURIComponent(e);
      return window.fetch(i, { method: "DELETE", headers: K(t.headers, t.auth), credentials: t.credentials }).then((u) => {
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
      const e = (t.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return e.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(V(r.url, r.db, "_bulk_docs"), {
        method: "POST",
        headers: K(r.headers, r.auth),
        credentials: r.credentials,
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
          w(n.dom, "ln-couchdb-connector:fetched", { data: e, since: o.since });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
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
          w(n.dom, "ln-couchdb-connector:created", { record: e, tempId: o.tempId });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
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
          w(n.dom, "ln-couchdb-connector:updated", { record: i, id: o.id });
        }).catch(function(i) {
          w(n.dom, "ln-couchdb-connector:error", {
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
          w(n.dom, "ln-couchdb-connector:deleted", { response: e, id: o.id });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
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
          w(n.dom, "ln-couchdb-connector:bulk-deleted", { response: e, ids: o.ids });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
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
    if (!this.dom[d]) return;
    const n = this;
    n._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), w(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[b];
  };
  function f(n) {
    const r = n[d];
    r && r.refreshConfig();
  }
  B(h, d, m, "ln-couchdb-connector", {
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
  const h = "data-ln-data-coordinator", d = "lnDataCoordinator", b = "lnCoordinator";
  if (window[d] !== void 0) return;
  function m(n) {
    return this.dom = n, this._name = n.getAttribute(h), n[d] = this, n[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this.refreshMapper(), p(this), this;
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
        const o = r.detail.since;
        t.connector.fetchDelta(o).then(function(e) {
          let i = [], u = [], l = null;
          e && Array.isArray(e) ? (i = e, l = Math.floor(Date.now() / 1e3)) : e && (i = Array.isArray(e.data) ? e.data : [], u = Array.isArray(e.deleted) ? e.deleted : [], l = e.synced_at !== void 0 ? e.synced_at : e.since !== void 0 ? e.since : null);
          const s = i.map((c) => n.mapper.ingress(c));
          t.store.applySync(s, u, l);
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Sync failed:", e);
        });
      },
      create: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const o = r.detail.tempId, e = r.detail.data || {}, i = n.mapper.egress(e);
        t.connector.create(i).then(function(u) {
          const l = n.mapper.ingress(u);
          t.store.confirmMutation(o, l, "create");
        }).catch(function(u) {
          console.error("[ln-data-coordinator] Create mutation failed:", u), t.store.revertMutation(o, "create", u.message || u);
        });
      },
      update: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const o = r.detail.id, e = r.detail.expected_version;
        t.store.getById(o).then(function(i) {
          if (!i) throw new Error("Record not found in cache store: " + o);
          const u = Object.assign({}, i);
          delete u._pending;
          const l = n.mapper.egress(u);
          return t.connector.update(o, l, e);
        }).then(function(i) {
          const u = n.mapper.ingress(i);
          t.store.confirmMutation(o, u, "update");
        }).catch(function(i) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", i), i.status === 409) {
            const u = i.data && i.data.remote ? n.mapper.ingress(i.data.remote) : null, l = i.data ? i.data.field_diffs : null;
            t.store.resolveConflict(o, u, l);
          } else
            t.store.revertMutation(o, "update", i.message || i);
        });
      },
      delete: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const o = r.detail.id;
        t.connector.delete(o).then(function() {
          t.store.confirmMutation(o, null, "delete");
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Delete mutation failed:", e), t.store.revertMutation(o, "delete", e.message || e);
        });
      },
      bulkDelete: function(r) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const o = r.detail.ids || [], e = o.join(",");
        t.connector.bulkDelete(o).then(function() {
          t.store.confirmMutation(e, null, "bulk-delete");
        }).catch(function(i) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", i), t.store.revertMutation(e, "bulk-delete", i.message || i);
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
  }, m.prototype._harvestFilterOptions = function(n) {
    const r = {}, t = n.querySelectorAll("th[data-ln-table-col]");
    for (let o = 0; o < t.length; o++) {
      const e = t[o];
      if (!e.querySelector("[data-ln-table-col-filter]")) continue;
      const i = e.getAttribute("data-ln-table-filter-options");
      if (!i) continue;
      const u = e.getAttribute("data-ln-table-col");
      try {
        r[u] = JSON.parse(i);
      } catch {
        console.warn('[ln-data-coordinator] bad filter-options JSON on column "' + u + '"');
      }
    }
    return r;
  }, m.prototype._serveData = function(n, r) {
    const t = n.target, o = r === "table" ? "data-ln-table-store" : "data-ln-list-store", e = t.getAttribute(o);
    if (!e || !this._ownsStore(e)) return;
    this._boundQueries.set(t, {
      sort: n.detail.sort,
      filters: n.detail.filters,
      search: n.detail.search
    });
    const i = this.findChildren().store;
    if (!i.isLoaded) {
      w(t, "ln-" + r + ":set-loading", { loading: !0 });
      return;
    }
    const u = this, l = { sort: n.detail.sort, filters: n.detail.filters, search: n.detail.search }, s = r === "table" ? u._harvestFilterOptions(t) : void 0;
    i.getAll(l).then(function(c) {
      const g = { data: c.data, total: c.total, filtered: c.filtered };
      s && (g.filterOptions = s), w(t, "ln-" + r + ":set-data", g), u._boundDelivered.set(t, !0);
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
    const o = n.detail.filters || null;
    this.findChildren().store.count(o).then(function(i) {
      w(r, "ln-stat:set-count", { count: i });
    });
  }, m.prototype._refreshAll = function() {
    const n = this, r = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let t = 0; t < r.length; t++) {
      const o = r[t];
      let e, i;
      if (o.hasAttribute("data-ln-table-store") ? (e = o.getAttribute("data-ln-table-store"), i = "table") : o.hasAttribute("data-ln-list-store") ? (e = o.getAttribute("data-ln-list-store"), i = "list") : o.hasAttribute("data-ln-options") ? (e = o.getAttribute("data-ln-options"), i = "options") : o.hasAttribute("data-ln-stat") && (e = o.getAttribute("data-ln-stat"), i = "stat"), !this._ownsStore(e)) continue;
      const u = this.findChildren().store;
      if (i === "table" || i === "list") {
        const l = n._boundQueries.get(o) || { sort: null, filters: {}, search: "" }, s = i === "table" ? n._harvestFilterOptions(o) : void 0;
        (function(c, g, a) {
          u.getAll(l).then(function(_) {
            const y = { data: _.data, total: _.total, filtered: _.filtered };
            a && (y.filterOptions = a), w(c, "ln-" + g + ":set-data", y), n._boundDelivered.set(c, !0);
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
            const g = l.slice(0, c), a = l.slice(c + 1);
            s = {}, s[g] = [a];
          }
        }
        (function(c, g) {
          u.count(g).then(function(a) {
            w(c, "ln-stat:set-count", { count: a });
          });
        })(o, s);
      }
    }
  }, m.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const n = this;
    n._handlers && (n.dom.removeEventListener("ln-store:request-remote-sync", n._handlers.sync), n.dom.removeEventListener("ln-store:request-remote-create", n._handlers.create), n.dom.removeEventListener("ln-store:request-remote-update", n._handlers.update), n.dom.removeEventListener("ln-store:request-remote-delete", n._handlers.delete), n.dom.removeEventListener("ln-store:request-remote-bulk-delete", n._handlers.bulkDelete), document.removeEventListener("ln-table:request-data", n._handlers.reqTableData), document.removeEventListener("ln-list:request-data", n._handlers.reqListData), document.removeEventListener("ln-options:request-data", n._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.removeEventListener("ln-store:ready", n._handlers.refresh), n.dom.removeEventListener("ln-store:loaded", n._handlers.refresh), n.dom.removeEventListener("ln-store:created", n._handlers.refresh), n.dom.removeEventListener("ln-store:updated", n._handlers.refresh), n.dom.removeEventListener("ln-store:deleted", n._handlers.refresh), n.dom.removeEventListener("ln-store:synced", n._handlers.refreshSynced), n._handlers = null), n._boundQueries = null, n._boundDelivered = null, delete this.dom[d], delete this.dom[b];
  };
  function f(n, r) {
    const t = n[d];
    t && r === "data-ln-data-mapper" && t.refreshMapper();
  }
  B(h, d, m, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-options", d = "lnOptions";
  if (window[d] !== void 0) return;
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
      const i = m[e], u = document.createElement("option");
      u.value = String(i[f]), u.textContent = i[n] != null ? i[n] : "", p.appendChild(u);
    }
    const o = p.options;
    for (let e = 0; e < o.length; e++)
      if (o[e].value === r) {
        p.value = r;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[d]);
  }, B(h, d, b, "ln-options");
})();
(function() {
  const h = "data-ln-stat", d = "lnStat";
  if (window[d] !== void 0) return;
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
    this.dom[d] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[d]);
  }, B(h, d, m, "ln-stat");
})();
(function() {
  const h = "data-ln-store-notify", d = "lnStoreNotify";
  if (window[d] !== void 0) return;
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
      let o, e;
      if (t === "create" || t === "update")
        o = f._savedTitle || t, e = r.record && r.record.name ? r.record.name : void 0;
      else if (t === "delete")
        o = f._deletedTitle || t, e = void 0;
      else if (t === "bulk-delete") {
        o = f._deletedTitle || t;
        const i = r.ids ? r.ids.length : 0;
        e = i ? String(i) : void 0;
      } else
        o = f._savedTitle || t, e = void 0;
      b("success", o, e);
    }, this._onReverted = function(n) {
      const r = n.detail || {}, t = r.action || "reverted", o = f._failedTitle || t, e = r.error ? String(r.error) : void 0;
      b("error", o, e);
    }, p.addEventListener("ln-store:confirmed", this._onConfirmed), p.addEventListener("ln-store:reverted", this._onReverted), this;
  }
  m.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-store:confirmed", this._onConfirmed), this.dom.removeEventListener("ln-store:reverted", this._onReverted), delete this.dom[d]);
  }, B(h, d, m, "ln-store-notify");
})();
(function() {
  const h = "ln-icons-sprite", d = "#ln-", b = "#lnc-", m = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let f = null;
  const n = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), r = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", o = "lni:v", e = "1";
  function i() {
    try {
      if (localStorage.getItem(o) !== e) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const y = localStorage.key(_);
          y && y.indexOf(t) === 0 && localStorage.removeItem(y);
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
  function l(_) {
    return _.indexOf(b) === 0 ? r + "/" + _.slice(b.length) + ".svg" : n + "/" + _.slice(d.length) + ".svg";
  }
  function s(_, y) {
    const E = y.match(/viewBox="([^"]+)"/), S = E ? E[1] : "0 0 24 24", A = y.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), L = A ? A[1].trim() : "", k = y.match(/<svg([^>]*)>/i), x = k ? k[1] : "", O = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    O.id = _, O.setAttribute("viewBox", S), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const F = x.match(new RegExp(I + '="([^"]*)"'));
      F && O.setAttribute(I, F[1]);
    }), O.innerHTML = L, u().querySelector("defs").appendChild(O);
  }
  function c(_) {
    if (m.has(_) || p.has(_) || _.indexOf(b) === 0 && !r) return;
    const y = _.slice(1);
    try {
      const E = localStorage.getItem(t + y);
      if (E) {
        s(y, E), m.add(_);
        return;
      }
    } catch {
    }
    p.add(_), fetch(l(_)).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      s(y, E), m.add(_), p.delete(_);
      try {
        localStorage.setItem(t + y, E);
      } catch {
      }
    }).catch(function() {
      p.delete(_);
    });
  }
  function g(_) {
    const y = 'use[href^="' + d + '"], use[href^="' + b + '"]', E = _.querySelectorAll ? _.querySelectorAll(y) : [];
    if (_.matches && _.matches(y)) {
      const S = _.getAttribute("href");
      S && c(S);
    }
    Array.prototype.forEach.call(E, function(S) {
      const A = S.getAttribute("href");
      A && c(A);
    });
  }
  function a() {
    g(document), new MutationObserver(function(_) {
      _.forEach(function(y) {
        if (y.type === "childList")
          y.addedNodes.forEach(function(E) {
            E.nodeType === 1 && g(E);
          });
        else if (y.type === "attributes" && y.attributeName === "href") {
          const E = y.target.getAttribute("href");
          E && (E.indexOf(d) === 0 || E.indexOf(b) === 0) && c(E);
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
  function b(m) {
    return this.dom = m, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[d];
  }, B(h, d, b, "ln-debug");
})();
