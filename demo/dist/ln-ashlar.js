const vt = {};
function Et(p, u) {
  vt[p] || (vt[p] = document.querySelector('[data-ln-template="' + p + '"]'));
  const y = vt[p];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (u || "ln-core") + '] Template "' + p + '" not found'), null);
}
function w(p, u, y) {
  p.dispatchEvent(new CustomEvent(u, {
    bubbles: !0,
    detail: y || {}
  }));
}
function K(p, u, y) {
  const m = new CustomEvent(u, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return p.dispatchEvent(m), m;
}
function X(p, u) {
  if (!p || !u) return p;
  const y = p.querySelectorAll("[data-ln-field]");
  for (let n = 0; n < y.length; n++) {
    const o = y[n], t = o.getAttribute("data-ln-field");
    u[t] != null && (o.textContent = u[t]);
  }
  const m = p.querySelectorAll("[data-ln-attr]");
  for (let n = 0; n < m.length; n++) {
    const o = m[n], t = o.getAttribute("data-ln-attr").split(",");
    for (let l = 0; l < t.length; l++) {
      const e = t[l].trim().split(":");
      if (e.length !== 2) continue;
      const r = e[0].trim(), d = e[1].trim();
      u[d] != null && o.setAttribute(r, u[d]);
    }
  }
  const _ = p.querySelectorAll("[data-ln-show]");
  for (let n = 0; n < _.length; n++) {
    const o = _[n], t = o.getAttribute("data-ln-show");
    t in u && o.classList.toggle("hidden", !u[t]);
  }
  const b = p.querySelectorAll("[data-ln-class]");
  for (let n = 0; n < b.length; n++) {
    const o = b[n], t = o.getAttribute("data-ln-class").split(",");
    for (let l = 0; l < t.length; l++) {
      const e = t[l].trim().split(":");
      if (e.length !== 2) continue;
      const r = e[0].trim(), d = e[1].trim();
      d in u && o.classList.toggle(r, !!u[d]);
    }
  }
  return p;
}
function At(p, u) {
  if (!p || !u) return p;
  const y = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const m = y.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(_, b) {
        return u[b] !== void 0 ? u[b] : "";
      }
    ));
  }
  return p;
}
function G(p, u) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      G(p, u);
    }), console.warn("[" + u + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  p();
}
function Q(p, u, y) {
  if (p) {
    const m = p.querySelector('[data-ln-template="' + u + '"]');
    if (m) return m.content.cloneNode(!0);
  }
  return Et(u, y);
}
function qt(p, u) {
  const y = {}, m = p.querySelectorAll("[" + u + "]");
  for (let _ = 0; _ < m.length; _++)
    y[m[_].getAttribute(u)] = m[_].textContent, m[_].remove();
  return y;
}
function yt(p, u, y, m) {
  if (p.nodeType !== 1) return;
  const b = u.indexOf("[") !== -1 || u.indexOf(".") !== -1 || u.indexOf("#") !== -1 ? u : "[" + u + "]", n = Array.from(p.querySelectorAll(b));
  p.matches && p.matches(b) && n.push(p);
  for (const o of n)
    o[y] || (o[y] = new m(o));
}
function pt(p) {
  return !!(p.offsetWidth || p.offsetHeight || p.getClientRects().length);
}
function Lt(p) {
  const u = {}, y = p.elements;
  for (let m = 0; m < y.length; m++) {
    const _ = y[m];
    if (!(!_.name || _.disabled || _.type === "file" || _.type === "submit" || _.type === "button"))
      if (_.type === "checkbox")
        u[_.name] || (u[_.name] = []), _.checked && u[_.name].push(_.value);
      else if (_.type === "radio")
        _.checked && (u[_.name] = _.value);
      else if (_.type === "select-multiple") {
        u[_.name] = [];
        for (let b = 0; b < _.options.length; b++)
          _.options[b].selected && u[_.name].push(_.options[b].value);
      } else
        u[_.name] = _.value;
  }
  return u;
}
function Tt(p, u) {
  const y = p.elements, m = [];
  for (let _ = 0; _ < y.length; _++) {
    const b = y[_];
    if (!b.name || !(b.name in u) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
    const n = u[b.name];
    if (b.type === "checkbox")
      b.checked = Array.isArray(n) ? n.indexOf(b.value) !== -1 : !!n, m.push(b);
    else if (b.type === "radio")
      b.checked = b.value === String(n), m.push(b);
    else if (b.type === "select-multiple") {
      if (Array.isArray(n))
        for (let o = 0; o < b.options.length; o++)
          b.options[o].selected = n.indexOf(b.options[o].value) !== -1;
      m.push(b);
    } else
      b.value = n, m.push(b);
  }
  return m;
}
function J(p) {
  const u = p.closest("[lang]");
  return (u ? u.lang : null) || navigator.language;
}
function kt(p, u, { get: y, set: m }) {
  Object.defineProperty(p, "value", {
    get: function() {
      return y ? y.call(this) : u.get.call(this);
    },
    set: function(_) {
      m ? m.call(this, _, (b) => u.set.call(this, b)) : u.set.call(this, _);
    },
    configurable: !0
  });
}
function N(p, u, y, m, _ = {}) {
  const b = _.extraAttributes || [], n = _.onAttributeChange || null, o = _.onInit || null;
  function t(l) {
    const e = l || document.body;
    yt(e, p, u, y), o && o(e);
  }
  return G(function() {
    const l = new MutationObserver(function(r) {
      for (let d = 0; d < r.length; d++) {
        const s = r[d];
        if (s.type === "childList") {
          for (let i = 0; i < s.addedNodes.length; i++) {
            const c = s.addedNodes[i];
            c.nodeType === 1 && (yt(c, p, u, y), o && o(c));
          }
          for (let i = 0; i < s.removedNodes.length; i++) {
            const c = s.removedNodes[i];
            if (c.nodeType === 1) {
              const a = p.indexOf("[") !== -1 || p.indexOf(".") !== -1 || p.indexOf("#") !== -1 ? p : "[" + p + "]", f = Array.from(c.querySelectorAll(a));
              c.matches && c.matches(a) && f.push(c);
              for (let g = 0; g < f.length; g++) {
                const S = f[g];
                if (!document.contains(S)) {
                  const E = S[u];
                  E && typeof E.destroy == "function" && E.destroy();
                }
              }
            }
          }
        } else s.type === "attributes" && (n && s.target[u] ? n(s.target, s.attributeName) : (yt(s.target, p, u, y), o && o(s.target)));
      }
    });
    let e = [];
    if (p.indexOf("[") !== -1) {
      const r = /\[([\w-]+)/g;
      let d;
      for (; (d = r.exec(p)) !== null; )
        e.push(d[1]);
    } else
      e.push(p);
    l.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: e.concat(b)
    });
  }, m || (p.indexOf("[") === -1 ? p.replace("data-", "") : "component")), window[u] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function z(...p) {
  return p.filter((u) => u != null && u !== "").map((u, y) => y === 0 ? u.replace(/\/+$/, "") : u.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function V(p, u) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, p, u ? { Authorization: u } : null);
}
function Dt(p, u = "ln-core") {
  try {
    return p ? JSON.parse(p) : {};
  } catch (y) {
    return console.error(`[${u}] Invalid headers JSON:`, y), {};
  }
}
const xt = {};
function Ft(p, u) {
  xt[p] = u;
}
function Mt(p) {
  return xt[p] || { ingress: (u) => u, egress: (u) => u };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Ft, window.lnCore.getDataMapper = Mt);
function Nt(p, u) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, p(), u && u();
    }));
  };
}
const Bt = "ln:";
function Pt() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Ot(p, u) {
  const y = u.getAttribute("data-ln-persist"), m = y !== null && y !== "" ? y : u.id;
  return m ? Bt + p + ":" + Pt() + ":" + m : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', u), null);
}
function _t(p, u) {
  const y = Ot(p, u);
  if (!y) return null;
  try {
    const m = localStorage.getItem(y);
    return m !== null ? JSON.parse(m) : null;
  } catch {
    return null;
  }
}
function st(p, u, y) {
  const m = Ot(p, u);
  if (m)
    try {
      localStorage.setItem(m, JSON.stringify(y));
    } catch {
    }
}
function gt(p, u, y, m) {
  const _ = typeof m == "number" ? m : 4, b = window.innerWidth, n = window.innerHeight, o = u.width, t = u.height, l = (y || "bottom").split("-"), e = l[0], r = l[1] === "start" || l[1] === "end" ? l[1] : "center", d = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, s = d[e] || d.bottom;
  function i(g) {
    return g === "top" || g === "bottom" ? r === "start" ? p.left : r === "end" ? p.right - o : p.left + (p.width - o) / 2 : r === "start" ? p.top : r === "end" ? p.bottom - t : p.top + (p.height - t) / 2;
  }
  function c(g) {
    let S, E, A = !0;
    return g === "top" ? (S = p.top - _ - t, E = i(g), S < 0 && (A = !1)) : g === "bottom" ? (S = p.bottom + _, E = i(g), S + t > n && (A = !1)) : g === "left" ? (S = i(g), E = p.left - _ - o, E < 0 && (A = !1)) : (S = i(g), E = p.right + _, E + o > b && (A = !1)), { top: S, left: E, side: g, fits: A };
  }
  let h = null;
  for (let g = 0; g < s.length; g++) {
    const S = c(s[g]);
    if (S.fits) {
      h = S;
      break;
    }
  }
  h || (h = c(s[0]));
  let a = h.top, f = h.left;
  return o >= b ? f = 0 : (f < 0 && (f = 0), f + o > b && (f = b - o)), t >= n ? a = 0 : (a < 0 && (a = 0), a + t > n && (a = n - t)), { top: a, left: f, placement: h.side };
}
function It(p) {
  if (!p || p.parentNode === document.body)
    return function() {
    };
  const u = p.parentNode, y = document.createComment("ln-teleport");
  return u.insertBefore(y, p), document.body.appendChild(p), function() {
    y.parentNode && (y.parentNode.insertBefore(p, y), y.parentNode.removeChild(y));
  };
}
function St(p) {
  if (!p) return { width: 0, height: 0 };
  const u = p.style, y = u.visibility, m = u.display, _ = u.position;
  u.visibility = "hidden", u.display = "block", u.position = "fixed";
  const b = p.offsetWidth, n = p.offsetHeight;
  return u.visibility = y, u.display = m, u.position = _, { width: b, height: n };
}
let ot = null;
async function Ct(p) {
  if (!p) {
    ot = null;
    return;
  }
  try {
    const u = new TextEncoder(), y = await crypto.subtle.digest("SHA-256", u.encode(p));
    ot = await crypto.subtle.importKey(
      "raw",
      y,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (u) {
    console.error("[ln-core/crypto] Key derivation failed:", u), ot = null;
  }
}
function ft() {
  return ot;
}
async function Ht(p, u = ot) {
  const y = u || ot;
  if (!y || p === void 0 || p === null) return p;
  try {
    const m = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), b = typeof p == "string" ? p : JSON.stringify(p), n = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      y,
      m.encode(b)
    ), o = btoa(String.fromCharCode(..._)), t = btoa(String.fromCharCode(...new Uint8Array(n)));
    return {
      encrypted: !0,
      iv: o,
      data: t
    };
  } catch (m) {
    return console.error("[ln-core/crypto] Encryption failed:", m), p;
  }
}
async function Ut(p, u = ot) {
  const y = u || ot;
  if (!p || !p.encrypted || !y) return p;
  try {
    const m = new TextDecoder(), _ = Uint8Array.from(atob(p.iv), (t) => t.charCodeAt(0)), b = Uint8Array.from(atob(p.data), (t) => t.charCodeAt(0)), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      y,
      b
    ), o = m.decode(n);
    try {
      return JSON.parse(o);
    } catch {
      return o;
    }
  } catch (m) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", m), { ...p, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const p = window.fetch.bind(window), u = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function m(l) {
    return typeof l == "string" ? l : l instanceof URL ? l.href : l instanceof Request ? l.url : String(l);
  }
  function _(l, e) {
    return e && e.method ? String(e.method).toUpperCase() : l instanceof Request ? l.method.toUpperCase() : "GET";
  }
  function b(l, e) {
    return e + " " + l;
  }
  function n(l) {
    return l === "GET" || l === "HEAD";
  }
  function o(l, e) {
    e = e || {};
    const r = m(l), d = _(l, e), s = b(r, d);
    n(d) && u.has(s) && (u.get(s).abort(), u.delete(s));
    const i = new AbortController(), c = e.signal;
    c && (c.aborted ? i.abort(c.reason) : c.addEventListener("abort", function() {
      i.abort(c.reason);
    }, { once: !0 }));
    const h = Object.assign({}, e, { signal: i.signal });
    return u.set(s, i), p(l, h).finally(function() {
      u.get(s) === i && u.delete(s);
    });
  }
  o.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = o;
  function t(l) {
    const e = l.detail || {};
    if (!e.url) return;
    const r = l.target, d = (e.method || (e.body ? "POST" : "GET")).toUpperCase(), s = e.key;
    s && y.has(s) && (y.get(s).abort(), y.delete(s));
    const i = new AbortController(), c = e.signal;
    c && (c.aborted ? i.abort(c.reason) : c.addEventListener("abort", function() {
      i.abort(c.reason);
    }, { once: !0 })), s && y.set(s, i);
    const h = { method: d, signal: i.signal };
    e.body !== void 0 && (h.body = e.body), window.fetch(e.url, h).then(function(a) {
      s && y.get(s) === i && y.delete(s), w(r, "ln-http:response", {
        ok: a.ok,
        status: a.status,
        response: a
      });
    }).catch(function(a) {
      s && y.get(s) === i && y.delete(s), !(a && a.name === "AbortError") && w(r, "ln-http:error", {
        ok: !1,
        status: 0,
        error: a
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(l) {
      let e = !1;
      return u.forEach(function(r, d) {
        d.endsWith(" " + l) && (r.abort(), u.delete(d), e = !0);
      }), e;
    },
    cancelByKey: function(l) {
      return y.has(l) ? (y.get(l).abort(), y.delete(l), !0) : !1;
    },
    cancelAll: function() {
      u.forEach(function(l) {
        l.abort();
      }), u.clear(), y.forEach(function(l) {
        l.abort();
      }), y.clear();
    },
    get inflight() {
      const l = [];
      return u.forEach(function(e, r) {
        const d = r.indexOf(" ");
        l.push({ method: r.slice(0, d), url: r.slice(d + 1) });
      }), y.forEach(function(e, r) {
        l.push({ key: r });
      }), l;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", t), window.fetch = p, delete window.lnHttp;
    }
  };
})();
(function() {
  const p = "data-ln-ajax", u = "lnAjax";
  if (window[u] !== void 0) return;
  function y(e) {
    if (!e.hasAttribute(p) || e[u]) return;
    e[u] = !0;
    const r = o(e);
    m(r.links), _(r.forms);
  }
  function m(e) {
    for (const r of e) {
      if (r[u + "Trigger"] || r.hostname && r.hostname !== window.location.hostname) continue;
      const d = r.getAttribute("href");
      if (d && d.includes("#")) continue;
      const s = function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1) return;
        i.preventDefault();
        const c = r.getAttribute("href");
        c && n("GET", c, null, r);
      };
      r.addEventListener("click", s), r[u + "Trigger"] = s;
    }
  }
  function _(e) {
    for (const r of e) {
      if (r[u + "Trigger"]) continue;
      const d = function(s) {
        s.preventDefault();
        const i = r.method.toUpperCase(), c = r.action, h = new FormData(r);
        for (const a of r.querySelectorAll('button, input[type="submit"]'))
          a.disabled = !0;
        n(i, c, h, r, function() {
          for (const a of r.querySelectorAll('button, input[type="submit"]'))
            a.disabled = !1;
        });
      };
      r.addEventListener("submit", d), r[u + "Trigger"] = d;
    }
  }
  function b(e) {
    if (!e[u]) return;
    const r = o(e);
    for (const d of r.links)
      d[u + "Trigger"] && (d.removeEventListener("click", d[u + "Trigger"]), delete d[u + "Trigger"]);
    for (const d of r.forms)
      d[u + "Trigger"] && (d.removeEventListener("submit", d[u + "Trigger"]), delete d[u + "Trigger"]);
    delete e[u];
  }
  function n(e, r, d, s, i) {
    if (K(s, "ln-ajax:before-start", { method: e, url: r }).defaultPrevented) return;
    w(s, "ln-ajax:start", { method: e, url: r }), s.classList.add("ln-ajax--loading");
    const h = document.createElement("span");
    h.className = "ln-ajax-spinner", s.appendChild(h);
    function a() {
      s.classList.remove("ln-ajax--loading");
      const A = s.querySelector(".ln-ajax-spinner");
      A && A.remove(), i && i();
    }
    let f = r;
    const g = document.querySelector('meta[name="csrf-token"]'), S = g ? g.getAttribute("content") : null;
    d instanceof FormData && S && d.append("_token", S);
    const E = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (S && (E.headers["X-CSRF-TOKEN"] = S), e === "GET" && d) {
      const A = new URLSearchParams(d);
      f = r + (r.includes("?") ? "&" : "?") + A.toString();
    } else e !== "GET" && d && (E.body = d);
    fetch(f, E).then(function(A) {
      const T = A.ok;
      return A.json().then(function(D) {
        return { ok: T, status: A.status, data: D };
      });
    }).then(function(A) {
      const T = A.data;
      if (A.ok) {
        if (T.title && (document.title = T.title), T.content)
          for (const D in T.content) {
            const O = document.getElementById(D);
            if (O) {
              let x = T.content[D];
              window.DOMPurify && typeof window.DOMPurify.sanitize == "function" ? x = window.DOMPurify.sanitize(x) : x = x.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""), O.innerHTML = x;
            }
          }
        if (s.tagName === "A") {
          const D = s.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else s.tagName === "FORM" && s.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", f);
        w(s, "ln-ajax:success", { method: e, url: f, data: T });
      } else
        w(s, "ln-ajax:error", { method: e, url: f, status: A.status, data: T });
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
      w(s, "ln-ajax:complete", { method: e, url: f }), a();
    }).catch(function(A) {
      w(s, "ln-ajax:error", { method: e, url: f, error: A }), w(s, "ln-ajax:complete", { method: e, url: f }), a();
    });
  }
  function o(e) {
    const r = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(p) !== "false" ? r.links.push(e) : e.tagName === "FORM" && e.getAttribute(p) !== "false" ? r.forms.push(e) : (r.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), r.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), r;
  }
  function t() {
    G(function() {
      new MutationObserver(function(r) {
        for (const d of r)
          if (d.type === "childList") {
            for (const s of d.addedNodes)
              if (s.nodeType === 1 && (y(s), !s.hasAttribute(p))) {
                for (const c of s.querySelectorAll("[" + p + "]"))
                  y(c);
                const i = s.closest && s.closest("[" + p + "]");
                if (i && i.getAttribute(p) !== "false") {
                  const c = o(s);
                  m(c.links), _(c.forms);
                }
              }
          } else d.type === "attributes" && y(d.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-ajax");
  }
  function l() {
    for (const e of document.querySelectorAll("[" + p + "]"))
      y(e);
  }
  window[u] = y, window[u].destroy = b, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const p = "data-ln-modal", u = "lnModal";
  if (window[u] !== void 0) return;
  function y(n) {
    const o = Array.from(n.querySelectorAll("[data-ln-modal-for]"));
    n.hasAttribute && n.hasAttribute("data-ln-modal-for") && o.push(n);
    for (const t of o) {
      if (t[u + "Trigger"]) continue;
      const l = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const r = t.getAttribute("data-ln-modal-for"), d = document.getElementById(r);
        if (!d) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + r + '"');
          return;
        }
        if (!d[u]) return;
        const s = d.getAttribute(p);
        d.setAttribute(p, s === "open" ? "close" : "open");
      };
      t.addEventListener("click", l), t[u + "Trigger"] = l;
    }
  }
  function m(n) {
    this.dom = n, this.isOpen = n.getAttribute(p) === "open";
    const o = this;
    return this._onEscape = function(t) {
      t.key === "Escape" && o.dom.setAttribute(p, "close");
    }, this._onFocusTrap = function(t) {
      if (t.key !== "Tab") return;
      const l = Array.prototype.filter.call(
        o.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        pt
      );
      if (l.length === 0) return;
      const e = l[0], r = l[l.length - 1];
      t.shiftKey ? document.activeElement === e && (t.preventDefault(), r.focus()) : document.activeElement === r && (t.preventDefault(), e.focus());
    }, this._onClose = function(t) {
      t.preventDefault(), o.dom.setAttribute(p, "close");
    }, b(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + p + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const n = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of n)
      t[u + "Close"] && (t.removeEventListener("click", t[u + "Close"]), delete t[u + "Close"]);
    const o = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const t of o)
      t[u + "Trigger"] && (t.removeEventListener("click", t[u + "Trigger"]), delete t[u + "Trigger"]);
    w(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[u];
  };
  function _(n) {
    const o = n[u];
    if (!o) return;
    const l = n.getAttribute(p) === "open";
    if (l !== o.isOpen)
      if (l) {
        if (K(n, "ln-modal:before-open", { modalId: n.id, target: n }).defaultPrevented) {
          n.setAttribute(p, "close");
          return;
        }
        o.isOpen = !0, n.setAttribute("aria-modal", "true"), n.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", o._onEscape), document.addEventListener("keydown", o._onFocusTrap);
        const r = document.activeElement;
        o._returnFocusEl = r && r !== document.body ? r : null;
        const d = n.querySelector("[autofocus]");
        if (d && pt(d))
          d.focus();
        else {
          const s = n.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), i = Array.prototype.find.call(s, pt);
          if (i) i.focus();
          else {
            const c = n.querySelectorAll("a[href], button:not([disabled])"), h = Array.prototype.find.call(c, pt);
            h && h.focus();
          }
        }
        w(n, "ln-modal:open", { modalId: n.id, target: n });
      } else {
        if (K(n, "ln-modal:before-close", { modalId: n.id, target: n }).defaultPrevented) {
          n.setAttribute(p, "open");
          return;
        }
        o.isOpen = !1, n.removeAttribute("aria-modal"), document.removeEventListener("keydown", o._onEscape), document.removeEventListener("keydown", o._onFocusTrap), w(n, "ln-modal:close", { modalId: n.id, target: n }), o._returnFocusEl && document.contains(o._returnFocusEl) && typeof o._returnFocusEl.focus == "function" && o._returnFocusEl.focus(), o._returnFocusEl = null, document.querySelector("[" + p + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function b(n) {
    const o = n.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of o)
      t[u + "Close"] || (t.addEventListener("click", n._onClose), t[u + "Close"] = n._onClose);
  }
  N(p, u, m, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: _,
    onInit: y
  });
})();
(function() {
  const p = "data-ln-number", u = "lnNumber";
  if (window[u] !== void 0) return;
  const y = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(t) {
    if (!y[t]) {
      const l = new Intl.NumberFormat(t, { useGrouping: !0 }), e = l.formatToParts(1234.5);
      let r = "", d = ".";
      for (let s = 0; s < e.length; s++)
        e[s].type === "group" && (r = e[s].value), e[s].type === "decimal" && (d = e[s].value);
      y[t] = { fmt: l, groupSep: r, decimalSep: d };
    }
    return y[t];
  }
  function b(t, l, e) {
    if (e !== null) {
      const r = parseInt(e, 10), d = t + "|d" + r;
      return y[d] || (y[d] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: r })), y[d].format(l);
    }
    return _(t).fmt.format(l);
  }
  function n(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[u]) return t[u];
    t[u] = this, this.dom = t;
    const l = document.createElement("input");
    l.type = "hidden", l.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", l), this._hidden = l;
    const e = this;
    Object.defineProperty(l, "value", {
      get: function() {
        return m.get.call(l);
      },
      set: function(d) {
        if (m.set.call(l, d), d !== "" && !isNaN(parseFloat(d))) {
          const s = parseFloat(d);
          e._displayFormatted(s), w(e.dom, "ln-number:input", { value: s, formatted: e.dom.value }), e.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        } else d === "" && (e.dom.value = "", w(e.dom, "ln-number:input", { value: NaN, formatted: "" }), e.dom.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
    }), kt(t, m, {
      get: function() {
        return m.get.call(t);
      },
      set: function(d, s) {
        if (e._isFormatting) {
          s(d);
          return;
        }
        if (d === "") {
          s(""), e._setHiddenRaw(""), w(t, "ln-number:input", { value: NaN, formatted: "" }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        let i = typeof d == "number" ? d : parseFloat(String(d).replace(/[^\d.-]/g, ""));
        if (isNaN(i))
          s(String(d)), e._setHiddenRaw(""), w(t, "ln-number:input", { value: NaN, formatted: String(d) }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        else {
          e._setHiddenRaw(i);
          const c = b(J(t), i, t.getAttribute("data-ln-number-decimals"));
          s(c), w(t, "ln-number:input", { value: i, formatted: c }), t.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(d) {
      d.preventDefault();
      const s = (d.clipboardData || window.clipboardData).getData("text"), i = _(J(t)), c = i.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let h = s.replace(new RegExp("[^0-9\\-" + c + ".]", "g"), "");
      i.groupSep && (h = h.split(i.groupSep).join("")), i.decimalSep !== "." && (h = h.replace(i.decimalSep, "."));
      const a = parseFloat(h);
      isNaN(a) ? (t.value = "", e._hidden.value = "") : e.value = a;
    }, t.addEventListener("paste", this._onPaste);
    const r = t.value;
    if (r !== "") {
      const d = parseFloat(r);
      isNaN(d) || (this._displayFormatted(d), m.set.call(l, String(d)), w(t, "ln-number:input", { value: d, formatted: t.value }), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  n.prototype._handleInput = function() {
    const t = this.dom, l = _(J(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", w(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const r = t.selectionStart;
    let d = 0;
    for (let A = 0; A < r; A++)
      /[0-9]/.test(e[A]) && d++;
    let s = e;
    if (l.groupSep && (s = s.split(l.groupSep).join("")), s = s.replace(l.decimalSep, "."), e.endsWith(l.decimalSep) || e.endsWith(".")) {
      const A = s.replace(/\.$/, ""), T = parseFloat(A);
      isNaN(T) || this._setHiddenRaw(T);
      return;
    }
    const i = s.indexOf(".");
    if (i !== -1 && s.slice(i + 1).endsWith("0")) {
      const T = parseFloat(s);
      isNaN(T) || this._setHiddenRaw(T);
      return;
    }
    const c = t.getAttribute("data-ln-number-decimals");
    if (c !== null && i !== -1) {
      const A = parseInt(c, 10);
      s.slice(i + 1).length > A && (s = s.slice(0, i + 1 + A));
    }
    const h = parseFloat(s);
    if (isNaN(h)) return;
    const a = t.getAttribute("data-ln-number-min"), f = t.getAttribute("data-ln-number-max");
    if (a !== null && h < parseFloat(a) || f !== null && h > parseFloat(f)) return;
    let g;
    if (c !== null)
      g = b(J(t), h, c);
    else {
      const A = i !== -1 ? s.slice(i + 1).length : 0;
      if (A > 0) {
        const T = J(t) + "|u" + A;
        y[T] || (y[T] = new Intl.NumberFormat(J(t), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), g = y[T].format(h);
      } else
        g = l.fmt.format(h);
    }
    t.value = g;
    let S = d, E = 0;
    for (let A = 0; A < g.length && S > 0; A++)
      E = A + 1, /[0-9]/.test(g[A]) && S--;
    S > 0 && (E = g.length), t.setSelectionRange(E, E), this._setHiddenRaw(h), w(t, "ln-number:input", { value: h, formatted: g });
  }, n.prototype._setHiddenRaw = function(t) {
    m.set.call(this._hidden, String(t));
  }, n.prototype._displayFormatted = function(t) {
    this._isFormatting = !0, this.dom.value = b(J(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")), this._isFormatting = !1;
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
    this.dom[u] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), w(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[u]);
  };
  function o() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + p + "]");
      for (let l = 0; l < t.length; l++) {
        const e = t[l][u];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  N(p, u, n, "ln-number"), o();
})();
(function() {
  const p = "data-ln-date", u = "lnDate";
  if (window[u] !== void 0) return;
  const y = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(i, c) {
    const h = i + "|" + JSON.stringify(c);
    return y[h] || (y[h] = new Intl.DateTimeFormat(i, c)), y[h];
  }
  const b = /^(short|medium|long)(\s+datetime)?$/, n = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function o(i) {
    return !i || i === "" ? { dateStyle: "medium" } : i.match(b) ? n[i] : null;
  }
  function t(i, c, h) {
    const a = i.getDate(), f = i.getMonth(), g = i.getFullYear(), S = i.getHours(), E = i.getMinutes(), A = {
      yyyy: String(g),
      yy: String(g).slice(-2),
      MMMM: _(h, { month: "long" }).format(i),
      MMM: _(h, { month: "short" }).format(i),
      MM: String(f + 1).padStart(2, "0"),
      M: String(f + 1),
      dd: String(a).padStart(2, "0"),
      d: String(a),
      HH: String(S).padStart(2, "0"),
      mm: String(E).padStart(2, "0")
    };
    return c.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(T) {
      return A[T];
    });
  }
  function l(i, c, h) {
    const a = o(c);
    return a ? _(h, a).format(i) : t(i, c, h);
  }
  function e(i) {
    if (i.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", i.tagName), this;
    if (i[u]) return i[u];
    i[u] = this, this.dom = i;
    const c = this, h = i.value, a = i.name, f = document.createElement("span");
    f.setAttribute("data-ln-date-field", ""), i.parentNode.insertBefore(f, i), f.appendChild(i), this._wrapper = f;
    const g = document.createElement("input");
    g.type = "hidden", g.name = a, i.removeAttribute("name"), i.insertAdjacentElement("afterend", g), this._hidden = g;
    const S = document.createElement("input");
    S.type = "date", S.tabIndex = -1, S.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", g.insertAdjacentElement("afterend", S), this._picker = S, i.type = "text";
    const E = document.createElement("button");
    if (E.type = "button", E.setAttribute("aria-label", "Open date picker"), E.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', S.insertAdjacentElement("afterend", E), this._btn = E, this._lastISO = "", Object.defineProperty(g, "value", {
      get: function() {
        return m.get.call(g);
      },
      set: function(A) {
        if (m.set.call(g, A), A && A !== "") {
          const T = r(A);
          T && (c._displayFormatted(T), m.set.call(S, A), c._lastISO = A, w(c.dom, "ln-date:change", {
            value: A,
            formatted: c.dom.value,
            date: T
          }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else A === "" && (c.dom.value = "", m.set.call(S, ""), c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), kt(i, m, {
      get: function() {
        return m.get.call(i);
      },
      set: function(A, T) {
        if (c._isFormatting) {
          T(A);
          return;
        }
        if (!A || A === "") {
          T(""), c._setHiddenRaw(""), m.set.call(c._picker, ""), c._lastISO = "", w(i, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), i.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let D = r(A);
        if (D || (D = d(A)), D) {
          const O = D.getFullYear(), x = String(D.getMonth() + 1).padStart(2, "0"), F = String(D.getDate()).padStart(2, "0"), B = O + "-" + x + "-" + F;
          c._setHiddenRaw(B), m.set.call(c._picker, B), c._lastISO = B;
          const j = i.getAttribute(p) || "", Z = J(i), tt = l(D, j, Z);
          T(tt), w(i, "ln-date:change", {
            value: B,
            formatted: tt,
            date: D
          }), i.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          T(String(A)), c._setHiddenRaw(""), m.set.call(c._picker, ""), c._lastISO = "", w(i, "ln-date:change", {
            value: "",
            formatted: String(A),
            date: null
          }), i.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const A = S.value;
      if (A) {
        const T = r(A);
        T && (c._setHiddenRaw(A), c._displayFormatted(T), c._lastISO = A, w(c.dom, "ln-date:change", {
          value: A,
          formatted: c.dom.value,
          date: T
        }));
      } else
        c._setHiddenRaw(""), c.dom.value = "", c._lastISO = "", w(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, S.addEventListener("change", this._onPickerChange), this._onBlur = function() {
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
        const D = r(c._lastISO);
        if (D) {
          const O = c.dom.getAttribute(p) || "", x = J(c.dom), F = l(D, O, x);
          if (A === F) return;
        }
      }
      const T = d(A);
      if (T) {
        const D = T.getFullYear(), O = String(T.getMonth() + 1).padStart(2, "0"), x = String(T.getDate()).padStart(2, "0"), F = D + "-" + O + "-" + x;
        c._setHiddenRaw(F), m.set.call(c._picker, F), c._displayFormatted(T), c._lastISO = F, w(c.dom, "ln-date:change", {
          value: F,
          formatted: c.dom.value,
          date: T
        });
      } else if (c._lastISO) {
        const D = r(c._lastISO);
        D && c._displayFormatted(D);
      } else
        c.dom.value = "";
    }, i.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      c._openPicker();
    }, E.addEventListener("click", this._onBtnClick), h && h !== "") {
      const A = r(h);
      A && (this._setHiddenRaw(h), m.set.call(S, h), this._displayFormatted(A), this._lastISO = h, w(i, "ln-date:change", {
        value: h,
        formatted: i.value,
        date: A
      }), i.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function r(i) {
    if (!i || typeof i != "string") return null;
    const c = i.split("T"), h = c[0].split("-");
    if (h.length < 3) return null;
    const a = parseInt(h[0], 10), f = parseInt(h[1], 10) - 1, g = parseInt(h[2], 10);
    if (isNaN(a) || isNaN(f) || isNaN(g)) return null;
    let S = 0, E = 0;
    if (c[1]) {
      const T = c[1].split(":");
      S = parseInt(T[0], 10) || 0, E = parseInt(T[1], 10) || 0;
    }
    const A = new Date(a, f, g, S, E);
    return A.getFullYear() !== a || A.getMonth() !== f || A.getDate() !== g ? null : A;
  }
  function d(i) {
    if (!i || typeof i != "string" || (i = i.trim(), i.length < 6)) return null;
    let c, h;
    if (i.indexOf(".") !== -1)
      c = ".", h = i.split(".");
    else if (i.indexOf("/") !== -1)
      c = "/", h = i.split("/");
    else if (i.indexOf("-") !== -1)
      c = "-", h = i.split("-");
    else
      return null;
    if (h.length !== 3) return null;
    const a = [];
    for (let A = 0; A < 3; A++) {
      const T = parseInt(h[A], 10);
      if (isNaN(T)) return null;
      a.push(T);
    }
    let f, g, S;
    c === "." ? (f = a[0], g = a[1], S = a[2]) : c === "/" ? (g = a[0], f = a[1], S = a[2]) : h[0].length === 4 ? (S = a[0], g = a[1], f = a[2]) : (f = a[0], g = a[1], S = a[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
    const E = new Date(S, g - 1, f);
    return E.getFullYear() !== S || E.getMonth() !== g - 1 || E.getDate() !== f ? null : E;
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
  }, e.prototype._setHiddenRaw = function(i) {
    m.set.call(this._hidden, i);
  }, e.prototype._displayFormatted = function(i) {
    const c = this.dom.getAttribute(p) || "", h = J(this.dom);
    this._isFormatting = !0, this.dom.value = l(i, c, h), this._isFormatting = !1;
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return m.get.call(this._hidden);
    },
    set: function(i) {
      if (!i || i === "") {
        this._setHiddenRaw(""), m.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const c = r(i);
      c && (this._setHiddenRaw(i), m.set.call(this._picker, i), this._displayFormatted(c), this._lastISO = i, w(this.dom, "ln-date:change", {
        value: i,
        formatted: this.dom.value,
        date: c
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const i = this.value;
      return i ? r(i) : null;
    },
    set: function(i) {
      if (!i || !(i instanceof Date) || isNaN(i.getTime())) {
        this.value = "";
        return;
      }
      const c = i.getFullYear(), h = String(i.getMonth() + 1).padStart(2, "0"), a = String(i.getDate()).padStart(2, "0");
      this.value = c + "-" + h + "-" + a;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[u]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const i = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), i && (this.dom.value = i), w(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[u];
  };
  function s() {
    new MutationObserver(function() {
      const i = document.querySelectorAll("[" + p + "]");
      for (let c = 0; c < i.length; c++) {
        const h = i[c][u];
        if (h && h.value) {
          const a = r(h.value);
          a && h._displayFormatted(a);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  N(p, u, e, "ln-date"), s();
})();
(function() {
  const p = "data-ln-nav", u = "lnNav";
  if (window[u] !== void 0) return;
  const y = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const r of m)
        r();
    }, history._lnNavPatched = !0;
  }
  function _(e) {
    if (!e.hasAttribute(p) || y.has(e)) return;
    const r = e.getAttribute(p);
    if (!r) return;
    const d = b(e, r);
    y.set(e, d), e[u] = d;
  }
  function b(e, r) {
    let d = Array.from(e.querySelectorAll("a"));
    o(d, r, window.location.pathname);
    const s = function() {
      d = Array.from(e.querySelectorAll("a")), o(d, r, window.location.pathname);
    };
    window.addEventListener("popstate", s), m.push(s);
    const i = new MutationObserver(function(c) {
      for (const h of c)
        if (h.type === "childList") {
          for (const a of h.addedNodes)
            if (a.nodeType === 1) {
              if (a.tagName === "A")
                d.push(a), o([a], r, window.location.pathname);
              else if (a.querySelectorAll) {
                const f = Array.from(a.querySelectorAll("a"));
                d = d.concat(f), o(f, r, window.location.pathname);
              }
            }
          for (const a of h.removedNodes)
            if (a.nodeType === 1) {
              if (a.tagName === "A")
                d = d.filter(function(f) {
                  return f !== a;
                });
              else if (a.querySelectorAll) {
                const f = Array.from(a.querySelectorAll("a"));
                d = d.filter(function(g) {
                  return !f.includes(g);
                });
              }
            }
        }
    });
    return i.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: r,
      observer: i,
      updateHandler: s,
      destroy: function() {
        i.disconnect(), window.removeEventListener("popstate", s);
        const c = m.indexOf(s);
        c !== -1 && m.splice(c, 1), y.delete(e), delete e[u];
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
  function o(e, r, d) {
    const s = n(d);
    for (const i of e) {
      const c = i.getAttribute("href");
      if (!c) continue;
      const h = n(c);
      i.classList.remove(r);
      const a = h === s, f = h !== "/" && s.startsWith(h + "/");
      (a || f) && i.classList.add(r);
    }
  }
  function t() {
    G(function() {
      new MutationObserver(function(r) {
        for (const d of r)
          if (d.type === "childList") {
            for (const s of d.addedNodes)
              if (s.nodeType === 1 && (s.hasAttribute && s.hasAttribute(p) && _(s), s.querySelectorAll))
                for (const i of s.querySelectorAll("[" + p + "]"))
                  _(i);
          } else d.type === "attributes" && d.target.hasAttribute && d.target.hasAttribute(p) && _(d.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [p] });
    }, "ln-nav");
  }
  window[u] = _;
  function l() {
    for (const e of document.querySelectorAll("[" + p + "]"))
      _(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const p = "data-ln-tabs", u = "lnTabs";
  if (window[u] !== void 0 && window[u] !== null) return;
  function y() {
    const n = (location.hash || "").replace("#", ""), o = {};
    if (!n) return o;
    for (const t of n.split("&")) {
      const l = t.indexOf(":");
      l > 0 && (o[t.slice(0, l)] = t.slice(l + 1));
    }
    return o;
  }
  function m(n, o) {
    const t = (n.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (t) return t;
    if (n.tagName !== "A") return "";
    const l = n.getAttribute("href") || "";
    if (!l.startsWith("#")) return "";
    const e = l.slice(1);
    if (!e) return "";
    const r = e.split("&");
    if (o)
      for (const i of r) {
        const c = i.indexOf(":");
        if (c > 0 && i.slice(0, c).toLowerCase().trim() === o)
          return i.slice(c + 1).toLowerCase().trim();
      }
    const d = r[r.length - 1] || "", s = d.indexOf(":");
    return (s > 0 ? d.slice(s + 1) : d).toLowerCase().trim();
  }
  function _(n) {
    return this.dom = n, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const o of this.tabs) {
      const t = m(o, this.nsKey);
      t ? this.mapTabs[t] = o : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', o);
    }
    for (const o of this.panels) {
      const t = (o.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      t && (this.mapPanels[t] = o);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const n = this;
    this._clickHandlers = [];
    for (const o of this.tabs) {
      if (o[u + "Trigger"]) continue;
      const t = function(l) {
        if (l.ctrlKey || l.metaKey || l.button === 1) return;
        const e = m(o, n.nsKey);
        if (e)
          if (o.tagName === "A" && l.preventDefault(), n.hashEnabled) {
            const r = y();
            r[n.nsKey] = e;
            const d = Object.keys(r).map(function(s) {
              return s + ":" + r[s];
            }).join("&");
            location.hash === "#" + d ? n.dom.setAttribute("data-ln-tabs-active", e) : location.hash = d;
          } else
            n.dom.setAttribute("data-ln-tabs-active", e);
      };
      o.addEventListener("click", t), o[u + "Trigger"] = t, n._clickHandlers.push({ el: o, handler: t });
    }
    if (this._hashHandler = function() {
      if (!n.hashEnabled) return;
      const o = y();
      n.dom.setAttribute("data-ln-tabs-active", n.nsKey in o ? o[n.nsKey] : n.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let o = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const t = _t("tabs", this.dom);
        t !== null && t in this.mapPanels && (o = t);
      }
      this.dom.setAttribute("data-ln-tabs-active", o);
    }
  }
  _.prototype._applyActive = function(n) {
    var o;
    (!n || !(n in this.mapPanels)) && (n = this.defaultKey);
    for (const t in this.mapTabs) {
      const l = this.mapTabs[t];
      t === n ? (l.setAttribute("data-active", ""), l.setAttribute("aria-selected", "true")) : (l.removeAttribute("data-active"), l.setAttribute("aria-selected", "false"));
    }
    for (const t in this.mapPanels) {
      const l = this.mapPanels[t], e = t === n;
      l.classList.toggle("hidden", !e), l.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const t = (o = this.mapPanels[n]) == null ? void 0 : o.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    w(this.dom, "ln-tabs:change", { key: n, tab: this.mapTabs[n], panel: this.mapPanels[n] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && st("tabs", this.dom, n);
  }, _.prototype.destroy = function() {
    if (this.dom[u]) {
      for (const { el: n, handler: o } of this._clickHandlers)
        n.removeEventListener("click", o), delete n[u + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), w(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[u];
    }
  }, N(p, u, _, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(n) {
      const o = n.getAttribute("data-ln-tabs-active");
      n[u]._applyActive(o);
    }
  });
})();
(function() {
  const p = "data-ln-toggle", u = "lnToggle";
  if (window[u] !== void 0) return;
  function y(n) {
    const o = Array.from(n.querySelectorAll("[data-ln-toggle-for]"));
    n.hasAttribute && n.hasAttribute("data-ln-toggle-for") && o.push(n);
    for (const t of o) {
      if (t[u + "Trigger"]) continue;
      const l = function(d) {
        if (d.ctrlKey || d.metaKey || d.button === 1) return;
        d.preventDefault();
        const s = t.getAttribute("data-ln-toggle-for"), i = document.getElementById(s);
        if (!i || !i[u]) return;
        const c = t.getAttribute("data-ln-toggle-action") || "toggle";
        if (c === "open")
          i.setAttribute(p, "open");
        else if (c === "close")
          i.setAttribute(p, "close");
        else if (c === "toggle") {
          const h = i.getAttribute(p);
          i.setAttribute(p, h === "open" ? "close" : "open");
        }
      };
      t.addEventListener("click", l), t[u + "Trigger"] = l;
      const e = t.getAttribute("data-ln-toggle-for"), r = document.getElementById(e);
      r && r[u] && t.setAttribute("aria-expanded", r[u].isOpen ? "true" : "false");
    }
  }
  function m(n, o) {
    const t = document.querySelectorAll(
      '[data-ln-toggle-for="' + n.id + '"]'
    );
    for (const l of t)
      l.setAttribute("aria-expanded", o ? "true" : "false");
  }
  function _(n) {
    if (this.dom = n, n.hasAttribute("data-ln-persist")) {
      const o = _t("toggle", n);
      o !== null && n.setAttribute(p, o);
    }
    return this.isOpen = n.getAttribute(p) === "open", this.isOpen && n.classList.add("open"), m(n, this.isOpen), this;
  }
  _.prototype.destroy = function() {
    if (!this.dom[u]) return;
    w(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const n = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const o of n)
      o[u + "Trigger"] && (o.removeEventListener("click", o[u + "Trigger"]), delete o[u + "Trigger"]);
    delete this.dom[u];
  };
  function b(n) {
    const o = n[u];
    if (!o) return;
    const l = n.getAttribute(p) === "open";
    if (l !== o.isOpen)
      if (l) {
        if (K(n, "ln-toggle:before-open", { target: n }).defaultPrevented) {
          n.setAttribute(p, "close");
          return;
        }
        o.isOpen = !0, n.classList.add("open"), m(n, !0), w(n, "ln-toggle:open", { target: n }), n.hasAttribute("data-ln-persist") && st("toggle", n, "open");
      } else {
        if (K(n, "ln-toggle:before-close", { target: n }).defaultPrevented) {
          n.setAttribute(p, "open");
          return;
        }
        o.isOpen = !1, n.classList.remove("open"), m(n, !1), w(n, "ln-toggle:close", { target: n }), n.hasAttribute("data-ln-persist") && st("toggle", n, "close");
      }
  }
  N(p, u, _, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: b,
    onInit: y
  });
})();
(function() {
  const p = "data-ln-accordion", u = "lnAccordion";
  if (window[u] !== void 0) return;
  function y(m) {
    return this.dom = m, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== m) return;
      const b = m.querySelectorAll("[data-ln-toggle]");
      for (const n of b)
        n !== _.detail.target && n.closest("[data-ln-accordion]") === m && n.getAttribute("data-ln-toggle") === "open" && n.setAttribute("data-ln-toggle", "close");
      w(m, "ln-accordion:change", { target: _.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), w(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[u]);
  }, N(p, u, y, "ln-accordion");
})();
(function() {
  const p = "data-ln-dropdown", u = "lnDropdown";
  if (window[u] !== void 0) return;
  function y(m) {
    if (this.dom = m, this.toggleEl = m.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = m.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const b of this.toggleEl.children)
        b.setAttribute("role", "menuitem");
    const _ = this;
    return this._onToggleOpen = function(b) {
      b.detail.target === _.toggleEl && (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "true"), _._teleportRestore = It(_.toggleEl), _.toggleEl.style.position = "fixed", _.toggleEl.style.right = "auto", _._reposition(), _._addOutsideClickListener(), _._addScrollRepositionListener(), _._addResizeCloseListener(), w(m, "ln-dropdown:open", { target: b.detail.target }));
    }, this._onToggleClose = function(b) {
      b.detail.target === _.toggleEl && (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "false"), _._removeOutsideClickListener(), _._removeScrollRepositionListener(), _._removeResizeCloseListener(), _.toggleEl.style.position = "", _.toggleEl.style.top = "", _.toggleEl.style.left = "", _.toggleEl.style.right = "", _.toggleEl.style.transform = "", _.toggleEl.style.margin = "", _._teleportRestore && (_._teleportRestore(), _._teleportRestore = null), w(m, "ln-dropdown:close", { target: b.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  y.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const m = this.triggerBtn.getBoundingClientRect(), _ = St(this.toggleEl), b = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = gt(m, _, "bottom-end", b);
    this.toggleEl.style.top = n.top + "px", this.toggleEl.style.left = n.left + "px";
  }, y.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const m = this;
    this._boundDocClick = function(_) {
      m.dom.contains(_.target) || m.toggleEl && m.toggleEl.contains(_.target) || m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, m._docClickTimeout = setTimeout(function() {
      m._docClickTimeout = null, document.addEventListener("click", m._boundDocClick);
    }, 0);
  }, y.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, y.prototype._addScrollRepositionListener = function() {
    const m = this;
    this._boundScrollReposition = function() {
      m._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, y.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, y.prototype._addResizeCloseListener = function() {
    const m = this;
    this._boundResizeClose = function() {
      m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, y.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, y.prototype.destroy = function() {
    this.dom[u] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), w(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[u]);
  }, N(p, u, y, "ln-dropdown");
})();
(function() {
  const p = "data-ln-popover", u = "lnPopover", y = "data-ln-popover-for", m = "data-ln-popover-position";
  if (window[u] !== void 0) return;
  const _ = [];
  let b = null;
  function n() {
    b || (b = function(e) {
      if (e.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", b));
  }
  function o() {
    _.length > 0 || b && (document.removeEventListener("keydown", b), b = null);
  }
  function t(e) {
    return this.dom = e, this.isOpen = e.getAttribute(p) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, e.hasAttribute("tabindex") || e.setAttribute("tabindex", "-1"), e.hasAttribute("role") || e.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  t.prototype.open = function(e) {
    this.isOpen || (this.trigger = e || null, this.dom.setAttribute(p, "open"));
  }, t.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(p, "closed");
  }, t.prototype.toggle = function(e) {
    this.isOpen ? this.close() : this.open(e);
  }, t.prototype._applyOpen = function(e) {
    this.isOpen = !0, e && (this.trigger = e), this._previousFocus = document.activeElement, this._teleportRestore = It(this.dom);
    const r = St(this.dom);
    if (this.trigger) {
      const c = this.trigger.getBoundingClientRect(), h = this.dom.getAttribute(m) || "bottom", a = gt(c, r, h, 8);
      this.dom.style.top = a.top + "px", this.dom.style.left = a.left + "px", this.dom.setAttribute("data-ln-popover-placement", a.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const d = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), s = Array.prototype.find.call(d, pt);
    s ? s.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(c) {
      i.dom.contains(c.target) || i.trigger && i.trigger.contains(c.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const c = i.trigger.getBoundingClientRect(), h = St(i.dom), a = i.dom.getAttribute(m) || "bottom", f = gt(c, h, a, 8);
      i.dom.style.top = f.top + "px", i.dom.style.left = f.left + "px", i.dom.setAttribute("data-ln-popover-placement", f.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), n(), w(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const e = _.indexOf(this);
    e !== -1 && _.splice(e, 1), o(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, w(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[u] && (this.isOpen && this._applyClose(), delete this.dom[u], w(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function l(e) {
    this.dom = e;
    const r = e.getAttribute(y);
    return e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-controls", r), this._onClick = function(d) {
      if (d.ctrlKey || d.metaKey || d.button === 1) return;
      d.preventDefault();
      const s = document.getElementById(r);
      !s || !s[u] || s[u].toggle(e);
    }, e.addEventListener("click", this._onClick), this;
  }
  l.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[u + "Trigger"];
  }, N(p, u, t, "ln-popover", {
    onAttributeChange: function(e) {
      const r = e[u];
      if (!r) return;
      const s = e.getAttribute(p) === "open";
      if (s !== r.isOpen)
        if (s) {
          if (K(e, "ln-popover:before-open", {
            popoverId: e.id,
            target: e,
            trigger: r.trigger
          }).defaultPrevented) {
            e.setAttribute(p, "closed");
            return;
          }
          r._applyOpen(r.trigger);
        } else {
          if (K(e, "ln-popover:before-close", {
            popoverId: e.id,
            target: e,
            trigger: r.trigger
          }).defaultPrevented) {
            e.setAttribute(p, "open");
            return;
          }
          r._applyClose();
        }
    }
  }), N(y, u + "Trigger", l, "ln-popover-trigger");
})();
(function() {
  const p = "data-ln-tooltip-enhance", u = "data-ln-tooltip", y = "data-ln-tooltip-position", m = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[m] !== void 0) return;
  let b = 0, n = null, o = null, t = null, l = null, e = null;
  function r() {
    return n && n.parentNode || (n = document.getElementById(_), n || (n = document.createElement("div"), n.id = _, document.body.appendChild(n))), n;
  }
  function d() {
    e || (e = function(a) {
      a.key === "Escape" && c();
    }, document.addEventListener("keydown", e));
  }
  function s() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function i(a) {
    if (t === a) return;
    c();
    const f = a.getAttribute(u) || a.getAttribute("title");
    if (!f) return;
    r(), a.hasAttribute("title") && (l = a.getAttribute("title"), a.removeAttribute("title"));
    const g = document.createElement("div");
    g.className = "ln-tooltip", g.textContent = f, a[m + "Uid"] || (b += 1, a[m + "Uid"] = "ln-tooltip-" + b), g.id = a[m + "Uid"], n.appendChild(g);
    const S = g.offsetWidth, E = g.offsetHeight, A = a.getBoundingClientRect(), T = a.getAttribute(y) || "top", D = gt(A, { width: S, height: E }, T, 6);
    g.style.top = D.top + "px", g.style.left = D.left + "px", g.setAttribute("data-ln-tooltip-placement", D.placement), a.setAttribute("aria-describedby", g.id), o = g, t = a, d();
  }
  function c() {
    if (!o) {
      s();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), l !== null && t.setAttribute("title", l)), l = null, o.parentNode && o.parentNode.removeChild(o), o = null, t = null, s();
  }
  function h(a) {
    return this.dom = a, a.hasAttribute("data-ln-tooltip-enhanced") || (a.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      i(a);
    }, this._onLeave = function() {
      t === a && c();
    }, this._onFocus = function() {
      i(a);
    }, this._onBlur = function() {
      t === a && c();
    }, a.addEventListener("mouseenter", this._onEnter), a.addEventListener("mouseleave", this._onLeave), a.addEventListener("focus", this._onFocus, !0), a.addEventListener("blur", this._onBlur, !0), this;
  }
  h.prototype.destroy = function() {
    const a = this.dom;
    a.removeEventListener("mouseenter", this._onEnter), a.removeEventListener("mouseleave", this._onLeave), a.removeEventListener("focus", this._onFocus, !0), a.removeEventListener("blur", this._onBlur, !0), t === a && c(), this._addedEnhancedAttr && a.removeAttribute("data-ln-tooltip-enhanced"), delete a[m], delete a[m + "Uid"], w(a, "ln-tooltip:destroyed", { trigger: a });
  }, N(
    "[" + p + "], [" + u + "][title]",
    m,
    h,
    "ln-tooltip"
  );
})();
const jt = `<li class="ln-toast__item">\r
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
  const p = "data-ln-toast", u = "lnToast", y = "ln-toast-item", m = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, _ = { success: "success", error: "error", warn: "warning", info: "info" }, b = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function n() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const a = document.createElement("template");
    a.setAttribute("data-ln-template", "ln-toast-item"), a.innerHTML = jt, document.body.appendChild(a);
  }
  function o(a) {
    if (!a || a.nodeType !== 1) return;
    const f = Array.from(a.querySelectorAll("[" + p + "]"));
    a.hasAttribute && a.hasAttribute(p) && f.push(a);
    for (const g of f)
      g[u] || new t(g);
  }
  function t(a) {
    this.dom = a, a[u] = this, this.timeoutDefault = parseInt(a.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(a.getAttribute("data-ln-toast-max") || "5", 10);
    for (const f of Array.from(a.querySelectorAll("[data-ln-toast-item]")))
      i(f, a);
    return this;
  }
  t.prototype.destroy = function() {
    if (this.dom[u]) {
      for (const a of Array.from(this.dom.children))
        d(a);
      delete this.dom[u];
    }
  };
  function l(a, f) {
    const g = ((a.type || "info") + "").toLowerCase(), S = Q(f, y, "ln-toast");
    if (!S)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    const E = S.firstElementChild;
    if (!E) return null;
    const A = !!(a.message || a.data && a.data.errors);
    X(E, {
      title: a.title || b[g] || b.info,
      role: g === "error" ? "alert" : "status",
      ariaLive: g === "error" ? "assertive" : "polite",
      hasBody: A
    });
    const T = E.querySelector(".ln-toast__card");
    T && T.classList.add(_[g] || "info");
    const D = E.querySelector(".ln-toast__side");
    if (D) {
      const F = D.querySelector("use");
      F && F.setAttribute("href", "#ln-" + (m[g] || m.info));
    }
    const O = E.querySelector(".ln-toast__body");
    O && A && e(O, a);
    const x = E.querySelector(".ln-toast__close");
    return x && x.addEventListener("click", function() {
      d(E);
    }), E;
  }
  function e(a, f) {
    if (f.message)
      if (Array.isArray(f.message)) {
        const g = document.createElement("ul");
        for (const S of f.message) {
          const E = document.createElement("li");
          E.textContent = S, g.appendChild(E);
        }
        a.appendChild(g);
      } else {
        const g = document.createElement("p");
        g.textContent = f.message, a.appendChild(g);
      }
    if (f.data && f.data.errors) {
      const g = document.createElement("ul");
      for (const S of Object.values(f.data.errors).flat()) {
        const E = document.createElement("li");
        E.textContent = S, g.appendChild(E);
      }
      a.appendChild(g);
    }
  }
  function r(a, f) {
    for (; a.dom.children.length >= a.max; ) a.dom.removeChild(a.dom.firstElementChild);
    a.dom.appendChild(f), requestAnimationFrame(() => f.classList.add("ln-toast__item--in"));
  }
  function d(a) {
    !a || !a.parentNode || (clearTimeout(a._timer), a.classList.remove("ln-toast__item--in"), a.classList.add("ln-toast__item--out"), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 200));
  }
  function s(a) {
    let f = a && a.container;
    return typeof f == "string" && (f = document.querySelector(f)), f instanceof HTMLElement || (f = document.querySelector("[" + p + "]") || document.getElementById("ln-toast-container")), f || null;
  }
  function i(a, f) {
    const g = ((a.getAttribute("data-type") || "info") + "").toLowerCase(), S = a.getAttribute("data-title"), E = (a.innerText || a.textContent || "").trim(), A = l({
      type: g,
      title: S,
      message: E || void 0
    }, f);
    A && (a.parentNode && a.parentNode.replaceChild(A, a), requestAnimationFrame(() => A.classList.add("ln-toast__item--in")));
  }
  function c(a) {
    const f = a.detail || {}, g = s(f);
    if (!g) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const S = g[u] || new t(g), E = l(f, g);
    if (!E) return;
    const A = Number.isFinite(f.timeout) ? f.timeout : S.timeoutDefault;
    r(S, E), A > 0 && (E._timer = setTimeout(() => d(E), A));
  }
  function h(a) {
    const f = a && a.detail || {};
    if (f.container) {
      const g = s(f);
      if (g)
        for (const S of Array.from(g.children)) d(S);
    } else {
      const g = document.querySelectorAll("[" + p + "]");
      for (const S of Array.from(g))
        for (const E of Array.from(S.children)) d(E);
    }
  }
  G(function() {
    n(), window.addEventListener("ln-toast:enqueue", c), window.addEventListener("ln-toast:clear", h), new MutationObserver(function(f) {
      for (const g of f) {
        if (g.type === "attributes") {
          o(g.target);
          continue;
        }
        for (const S of g.addedNodes)
          o(S);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [p] }), o(document.body);
  }, "ln-toast");
})();
(function() {
  const p = "data-ln-upload", u = "lnUpload", y = "data-ln-upload-dict", m = "data-ln-upload-accept", _ = "data-ln-upload-context", b = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function n() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const i = document.createElement("div");
    i.innerHTML = b;
    const c = i.firstElementChild;
    c && document.body.appendChild(c);
  }
  if (window[u] !== void 0) return;
  function o(i) {
    if (i === 0) return "0 B";
    const c = 1024, h = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(i) / Math.log(c));
    return parseFloat((i / Math.pow(c, a)).toFixed(1)) + " " + h[a];
  }
  function t(i) {
    return i.split(".").pop().toLowerCase();
  }
  function l(i) {
    return i === "docx" && (i = "doc"), ["pdf", "doc", "epub"].includes(i) ? "lnc-file-" + i : "ln-file";
  }
  function e(i, c) {
    if (!c) return !0;
    const h = "." + t(i.name);
    return c.split(",").map(function(f) {
      return f.trim().toLowerCase();
    }).includes(h.toLowerCase());
  }
  function r(i) {
    if (i.hasAttribute("data-ln-upload-initialized")) return;
    i.setAttribute("data-ln-upload-initialized", "true"), n();
    const c = qt(i, y), h = i.querySelector(".ln-upload__zone"), a = i.querySelector(".ln-upload__list"), f = i.getAttribute(m) || "";
    if (!h || !a) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", i);
      return;
    }
    let g = i.querySelector('input[type="file"]');
    g || (g = document.createElement("input"), g.type = "file", g.multiple = !0, g.classList.add("hidden"), f && (g.accept = f.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), i.appendChild(g));
    const S = i.getAttribute(p) || "/files/upload", E = i.getAttribute(_) || "", A = /* @__PURE__ */ new Map();
    let T = 0;
    function D() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function O(R) {
      if (!e(R, f)) {
        const L = c["invalid-type"];
        w(i, "ln-upload:invalid", {
          file: R,
          message: L
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["invalid-title"] || "Invalid File",
          message: L || c["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++T, H = t(R.name), rt = l(H), ct = Q(i, "ln-upload-item", "ln-upload");
      if (!ct) return;
      const W = ct.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", P), X(W, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + rt,
        removeLabel: c.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const dt = W.querySelector(".ln-upload__progress-bar"), et = W.querySelector('[data-ln-upload-action="remove"]');
      et && (et.disabled = !0), a.appendChild(W);
      const ut = new FormData();
      ut.append("file", R), ut.append("context", E);
      const v = new XMLHttpRequest();
      v.upload.addEventListener("progress", function(L) {
        if (L.lengthComputable) {
          const k = Math.round(L.loaded / L.total * 100);
          dt.style.width = k + "%", X(W, { sizeText: k + "%" });
        }
      }), v.addEventListener("load", function() {
        if (v.status >= 200 && v.status < 300) {
          let L;
          try {
            L = JSON.parse(v.responseText);
          } catch {
            C("Invalid response");
            return;
          }
          X(W, { sizeText: o(L.size || R.size), uploading: !1 }), et && (et.disabled = !1), A.set(P, {
            serverId: L.id,
            name: L.name,
            size: L.size
          }), x(), w(i, "ln-upload:uploaded", {
            localId: P,
            serverId: L.id,
            name: L.name
          });
        } else {
          let L = c["upload-failed"] || "Upload failed";
          try {
            L = JSON.parse(v.responseText).message || L;
          } catch {
          }
          C(L);
        }
      }), v.addEventListener("error", function() {
        C(c["network-error"] || "Network error");
      });
      function C(L) {
        dt && (dt.style.width = "100%"), X(W, { sizeText: c.error || "Error", uploading: !1, error: !0 }), et && (et.disabled = !1), w(i, "ln-upload:error", {
          file: R,
          message: L
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["error-title"] || "Upload Error",
          message: L || c["upload-failed"] || "Failed to upload file"
        });
      }
      v.open("POST", S), v.setRequestHeader("X-CSRF-TOKEN", D()), v.setRequestHeader("Accept", "application/json"), v.send(ut);
    }
    function x() {
      for (const R of i.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of A) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = R.serverId, i.appendChild(P);
      }
    }
    function F(R) {
      const P = A.get(R), H = a.querySelector('[data-file-id="' + R + '"]');
      if (!P || !P.serverId) {
        H && H.remove(), A.delete(R), x();
        return;
      }
      H && X(H, { deleting: !0 }), fetch("/files/" + P.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": D(),
          Accept: "application/json"
        }
      }).then(function(rt) {
        rt.status === 200 ? (H && H.remove(), A.delete(R), x(), w(i, "ln-upload:removed", {
          localId: R,
          serverId: P.serverId
        })) : (H && X(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["delete-title"] || "Error",
          message: c["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(rt) {
        console.warn("[ln-upload] Delete error:", rt), H && X(H, { deleting: !1 }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: c["network-error"] || "Network error",
          message: c["connection-error"] || "Could not connect to server"
        });
      });
    }
    function B(R) {
      for (const P of R)
        O(P);
      g.value = "";
    }
    const j = function() {
      g.click();
    }, Z = function() {
      B(this.files);
    }, tt = function(R) {
      R.preventDefault(), R.stopPropagation(), h.classList.add("ln-upload__zone--dragover");
    }, mt = function(R) {
      R.preventDefault(), R.stopPropagation(), h.classList.add("ln-upload__zone--dragover");
    }, lt = function(R) {
      R.preventDefault(), R.stopPropagation(), h.classList.remove("ln-upload__zone--dragover");
    }, $ = function(R) {
      R.preventDefault(), R.stopPropagation(), h.classList.remove("ln-upload__zone--dragover"), B(R.dataTransfer.files);
    }, at = function(R) {
      const P = R.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !a.contains(P) || P.disabled) return;
      const H = P.closest(".ln-upload__item");
      H && F(H.getAttribute("data-file-id"));
    };
    h.addEventListener("click", j), g.addEventListener("change", Z), h.addEventListener("dragenter", tt), h.addEventListener("dragover", mt), h.addEventListener("dragleave", lt), h.addEventListener("drop", $), a.addEventListener("click", at), i.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(A.values()).map(function(R) {
          return R.serverId;
        });
      },
      getFiles: function() {
        return Array.from(A.values());
      },
      clear: function() {
        for (const [, R] of A)
          R.serverId && fetch("/files/" + R.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": D(),
              Accept: "application/json"
            }
          });
        A.clear(), a.innerHTML = "", x(), w(i, "ln-upload:cleared", {});
      },
      destroy: function() {
        h.removeEventListener("click", j), g.removeEventListener("change", Z), h.removeEventListener("dragenter", tt), h.removeEventListener("dragover", mt), h.removeEventListener("dragleave", lt), h.removeEventListener("drop", $), a.removeEventListener("click", at), A.clear(), a.innerHTML = "", x(), i.removeAttribute("data-ln-upload-initialized"), delete i.lnUploadAPI;
      }
    };
  }
  function d() {
    for (const i of document.querySelectorAll("[" + p + "]"))
      r(i);
  }
  function s() {
    G(function() {
      new MutationObserver(function(c) {
        for (const h of c)
          if (h.type === "childList") {
            for (const a of h.addedNodes)
              if (a.nodeType === 1) {
                a.hasAttribute(p) && r(a);
                for (const f of a.querySelectorAll("[" + p + "]"))
                  r(f);
              }
          } else h.type === "attributes" && h.target.hasAttribute(p) && r(h.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-upload");
  }
  window[u] = {
    init: r,
    initAll: d
  }, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
(function() {
  const p = "lnExternalLinks";
  if (window[p] !== void 0) return;
  function u(o) {
    return o.hostname && o.hostname !== window.location.hostname;
  }
  function y(o) {
    if (o.getAttribute("data-ln-external-link") === "processed" || !u(o)) return;
    o.target = "_blank";
    const t = (o.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), o.rel = t.join(" ");
    const l = document.createElement("span");
    l.className = "sr-only", l.textContent = "(opens in new tab)", o.appendChild(l), o.setAttribute("data-ln-external-link", "processed"), w(o, "ln-external-links:processed", {
      link: o,
      href: o.href
    });
  }
  function m(o) {
    o = o || document.body;
    for (const t of o.querySelectorAll("a, area"))
      y(t);
  }
  function _() {
    G(function() {
      document.body.addEventListener("click", function(o) {
        const t = o.target.closest("a, area");
        t && t.getAttribute("data-ln-external-link") === "processed" && w(t, "ln-external-links:clicked", {
          link: t,
          href: t.href,
          text: t.textContent || t.title || ""
        });
      });
    }, "ln-external-links");
  }
  function b() {
    G(function() {
      new MutationObserver(function(t) {
        for (const l of t) {
          if (l.type === "childList") {
            for (const e of l.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && y(e), e.querySelectorAll))
                for (const r of e.querySelectorAll("a, area"))
                  y(r);
          }
          if (l.type === "attributes" && l.attributeName === "href") {
            const e = l.target;
            e.matches && (e.matches("a") || e.matches("area")) && y(e);
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
    _(), b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[p] = {
    process: m
  }, n();
})();
(function() {
  const p = "data-ln-link", u = "lnLink";
  if (window[u] !== void 0) return;
  let y = null;
  function m() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function _(a) {
    y && (y.textContent = a, y.classList.add("ln-link-status--visible"));
  }
  function b() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function n(a, f) {
    if (f.target.closest("a, button, input, select, textarea")) return;
    const g = a.querySelector("a");
    if (!g) return;
    const S = g.getAttribute("href");
    if (!S) return;
    if (f.ctrlKey || f.metaKey || f.button === 1) {
      window.open(S, "_blank");
      return;
    }
    K(a, "ln-link:navigate", { target: a, href: S, link: g }).defaultPrevented || g.click();
  }
  function o(a) {
    const f = a.querySelector("a");
    if (!f) return;
    const g = f.getAttribute("href");
    g && _(g);
  }
  function t() {
    b();
  }
  function l(a) {
    a[u + "Row"] || (a[u + "Row"] = !0, a.querySelector("a") && (a._lnLinkClick = function(f) {
      n(a, f);
    }, a._lnLinkEnter = function() {
      o(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", t)));
  }
  function e(a) {
    a[u + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", t), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[u + "Row"]);
  }
  function r(a) {
    if (!a[u + "Init"]) return;
    const f = a.tagName;
    if (f === "TABLE" || f === "TBODY") {
      const g = f === "TABLE" && a.querySelector("tbody") || a;
      for (const S of g.querySelectorAll("tr"))
        e(S);
    } else
      e(a);
    delete a[u + "Init"];
  }
  function d(a) {
    if (a[u + "Init"]) return;
    a[u + "Init"] = !0;
    const f = a.tagName;
    if (f === "TABLE" || f === "TBODY") {
      const g = f === "TABLE" && a.querySelector("tbody") || a;
      for (const S of g.querySelectorAll("tr"))
        l(S);
    } else
      l(a);
  }
  function s(a) {
    a.hasAttribute && a.hasAttribute(p) && d(a);
    const f = a.querySelectorAll ? a.querySelectorAll("[" + p + "]") : [];
    for (const g of f)
      d(g);
  }
  function i() {
    G(function() {
      new MutationObserver(function(f) {
        for (const g of f)
          if (g.type === "childList")
            for (const S of g.addedNodes)
              S.nodeType === 1 && (s(S), S.tagName === "TR" && S.closest("[" + p + "]") && l(S));
          else g.type === "attributes" && s(g.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-link");
  }
  function c(a) {
    s(a);
  }
  window[u] = { init: c, destroy: r };
  function h() {
    m(), i(), c(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h();
})();
(function() {
  const p = "[data-ln-progress]", u = "lnProgress";
  if (window[u] !== void 0) return;
  function y(l) {
    m(l);
  }
  function m(l) {
    const e = Array.from(l.querySelectorAll(p));
    for (const r of e)
      r[u] || (r[u] = new _(r));
    l.hasAttribute && l.hasAttribute("data-ln-progress") && !l[u] && (l[u] = new _(l));
  }
  function _(l) {
    return this.dom = l, this._attrObserver = null, this._parentObserver = null, t.call(this), n.call(this), o.call(this), this;
  }
  _.prototype.destroy = function() {
    this.dom[u] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[u]);
  };
  function b() {
    G(function() {
      new MutationObserver(function(e) {
        for (const r of e)
          if (r.type === "childList")
            for (const d of r.addedNodes)
              d.nodeType === 1 && m(d);
          else r.type === "attributes" && m(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  b();
  function n() {
    const l = this, e = new MutationObserver(function(r) {
      for (const d of r)
        (d.attributeName === "data-ln-progress" || d.attributeName === "data-ln-progress-max") && t.call(l);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function o() {
    const l = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const r = new MutationObserver(function(d) {
      for (const s of d)
        s.attributeName === "data-ln-progress-max" && t.call(l);
    });
    r.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = r;
  }
  function t() {
    const l = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, d = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let s = d > 0 ? l / d * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100), this.dom.style.width = s + "%";
    const i = Math.max(0, Math.min(l, d));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(d)), this.dom.setAttribute("aria-valuenow", String(i)), w(this.dom, "ln-progress:change", { target: this.dom, value: l, max: d, percentage: s });
  }
  window[u] = y, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const p = "data-ln-filter", u = "lnFilter", y = "data-ln-filter-initialized", m = "data-ln-filter-key", _ = "data-ln-filter-value", b = "data-ln-filter-hide", n = "data-ln-filter-reset", o = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[u] !== void 0) return;
  function l(i) {
    return i.hasAttribute(n) || i.getAttribute(_) === "";
  }
  function e(i) {
    let c = i._filterKey;
    const h = [];
    for (let a = 0; a < i.inputs.length; a++) {
      const f = i.inputs[a];
      if (f.checked && !l(f)) {
        const g = f.getAttribute(_);
        g && h.push(g);
      }
    }
    return { key: c, values: h };
  }
  function r(i, c) {
    if (i.length !== c.length) return !0;
    for (let h = 0; h < i.length; h++) if (i[h] !== c[h]) return !0;
    return !1;
  }
  function d(i) {
    const c = i.dom, h = i.colIndex, a = c.querySelector("template");
    if (!a || h === null) return;
    const f = document.getElementById(i.targetId);
    if (!f) return;
    const g = f.tagName === "TABLE" ? f : f.querySelector("table");
    if (!g || f.hasAttribute("data-ln-table")) return;
    const S = {}, E = [], A = g.tBodies;
    for (let O = 0; O < A.length; O++) {
      const x = A[O].rows;
      for (let F = 0; F < x.length; F++) {
        const B = x[F].cells[h], j = B ? B.textContent.trim() : "";
        j && !S[j] && (S[j] = !0, E.push(j));
      }
    }
    E.sort(function(O, x) {
      return O.localeCompare(x);
    });
    const T = c.querySelector("[" + m + "]"), D = T ? T.getAttribute(m) : c.getAttribute("data-ln-filter-key") || "col" + h;
    for (let O = 0; O < E.length; O++) {
      const x = a.content.cloneNode(!0), F = x.querySelector("input");
      F && (F.setAttribute(m, D), F.setAttribute(_, E[O]), At(x, { text: E[O] }), c.appendChild(x));
    }
  }
  function s(i) {
    if (i.hasAttribute(y)) return this;
    this.dom = i, this.targetId = i.getAttribute(p);
    const c = i.getAttribute(o);
    this.colIndex = c !== null ? parseInt(c, 10) : null, d(this), this.inputs = Array.from(i.querySelectorAll("[" + m + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(m) : null, this._lastSnapshot = null;
    const h = this, a = Nt(
      function() {
        h._render();
      },
      function() {
        h._afterRender();
      }
    );
    this._queueRender = a, this._attachHandlers();
    let f = !1;
    if (i.hasAttribute("data-ln-persist")) {
      const g = _t("filter", i);
      if (g && g.key && Array.isArray(g.values) && g.values.length > 0) {
        for (let S = 0; S < this.inputs.length; S++) {
          const E = this.inputs[S];
          l(E) ? E.checked = !1 : E.getAttribute(m) === g.key && g.values.indexOf(E.getAttribute(_)) !== -1 ? E.checked = !0 : E.checked = !1;
        }
        a(), f = !0;
      }
    }
    if (!f) {
      for (let g = 0; g < this.inputs.length; g++)
        if (this.inputs[g].checked && !l(this.inputs[g])) {
          a();
          break;
        }
    }
    return i.setAttribute(y, ""), this;
  }
  s.prototype._attachHandlers = function() {
    const i = this;
    this.inputs.forEach(function(c) {
      c[u + "Bound"] || (c[u + "Bound"] = !0, c._lnFilterChange = function() {
        if (l(c)) {
          for (let h = 0; h < i.inputs.length; h++)
            l(i.inputs[h]) || (i.inputs[h].checked = !1);
          c.checked = !0, i._queueRender();
          return;
        }
        if (c.checked)
          for (let h = 0; h < i.inputs.length; h++)
            l(i.inputs[h]) && (i.inputs[h].checked = !1);
        else {
          let h = !1;
          for (let a = 0; a < i.inputs.length; a++)
            if (!l(i.inputs[a]) && i.inputs[a].checked) {
              h = !0;
              break;
            }
          if (!h)
            for (let a = 0; a < i.inputs.length; a++)
              l(i.inputs[a]) && (i.inputs[a].checked = !0);
        }
        i._queueRender();
      }, c.addEventListener("change", c._lnFilterChange));
    });
  }, s.prototype._render = function() {
    const i = this, c = e(this), h = c.key === null || c.values.length === 0, a = [];
    for (let f = 0; f < c.values.length; f++)
      a.push(c.values[f].toLowerCase());
    if (i.colIndex !== null)
      i._filterTableRows(c);
    else {
      const f = document.getElementById(i.targetId);
      if (!f) return;
      const g = f.children;
      for (let S = 0; S < g.length; S++) {
        const E = g[S];
        if (h) {
          E.removeAttribute(b);
          continue;
        }
        const A = E.getAttribute("data-" + c.key);
        E.removeAttribute(b), A !== null && a.indexOf(A.toLowerCase()) === -1 && E.setAttribute(b, "true");
      }
    }
  }, s.prototype._afterRender = function() {
    const i = e(this), c = this._lastSnapshot;
    if (!c || c.key !== i.key || r(c.values, i.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: i.key,
        values: i.values.slice()
      });
      const a = c && c.values.length > 0, f = i.values.length === 0;
      a && f && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: i.key, values: i.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (i.key && i.values.length > 0 ? st("filter", this.dom, { key: i.key, values: i.values.slice() }) : st("filter", this.dom, null));
  }, s.prototype._dispatchOnBoth = function(i, c) {
    w(this.dom, i, c);
    const h = document.getElementById(this.targetId);
    h && h !== this.dom && w(h, i, c);
  }, s.prototype._filterTableRows = function(i) {
    const c = document.getElementById(this.targetId);
    if (!c) return;
    const h = c.tagName === "TABLE" ? c : c.querySelector("table");
    if (!h || c.hasAttribute("data-ln-table")) return;
    const a = i.key || this._filterKey, f = i.values;
    t.has(h) || t.set(h, {});
    const g = t.get(h);
    if (a && f.length > 0) {
      const T = [];
      for (let D = 0; D < f.length; D++)
        T.push(f[D].toLowerCase());
      g[a] = { col: this.colIndex, values: T };
    } else a && delete g[a];
    const S = Object.keys(g), E = S.length > 0, A = h.tBodies;
    for (let T = 0; T < A.length; T++) {
      const D = A[T].rows;
      for (let O = 0; O < D.length; O++) {
        const x = D[O];
        if (!E) {
          x.removeAttribute(b);
          continue;
        }
        let F = !0;
        for (let B = 0; B < S.length; B++) {
          const j = g[S[B]], Z = x.cells[j.col], tt = Z ? Z.textContent.trim().toLowerCase() : "";
          if (j.values.indexOf(tt) === -1) {
            F = !1;
            break;
          }
        }
        F ? x.removeAttribute(b) : x.setAttribute(b, "true");
      }
    }
  }, s.prototype.destroy = function() {
    if (this.dom[u]) {
      if (this.colIndex !== null) {
        const i = document.getElementById(this.targetId);
        if (i) {
          const c = i.tagName === "TABLE" ? i : i.querySelector("table");
          if (c && t.has(c)) {
            const h = t.get(c), a = this._filterKey;
            a && h[a] && delete h[a], Object.keys(h).length === 0 && t.delete(c);
          }
        }
      }
      this.inputs.forEach(function(i) {
        i._lnFilterChange && (i.removeEventListener("change", i._lnFilterChange), delete i._lnFilterChange), delete i[u + "Bound"];
      }), this.dom.removeAttribute(y), delete this.dom[u];
    }
  }, N(p, u, s, "ln-filter");
})();
(function() {
  const p = "data-ln-search", u = "lnSearch", y = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[u] !== void 0) return;
  function b(n) {
    if (n.hasAttribute(y)) return this;
    this.dom = n, this.targetId = n.getAttribute(p);
    const o = n.tagName;
    if (this.input = o === "INPUT" || o === "TEXTAREA" ? n : n.querySelector('[name="search"]') || n.querySelector('input[type="search"]') || n.querySelector('input[type="text"]'), this.itemsSelector = n.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return n.setAttribute(y, ""), this;
  }
  b.prototype._attachHandler = function() {
    if (!this.input) return;
    const n = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      n.input.value = "", n._search(""), n.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(n._debounceTimer), n._debounceTimer = setTimeout(function() {
        n._search(n.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, b.prototype._search = function(n) {
    const o = document.getElementById(this.targetId);
    if (!o || K(o, "ln-search:change", { term: n, targetId: this.targetId }).defaultPrevented) return;
    const l = this.itemsSelector ? o.querySelectorAll(this.itemsSelector) : o.children;
    for (let e = 0; e < l.length; e++) {
      const r = l[e];
      r.removeAttribute(m), n && !r.textContent.replace(/\s+/g, " ").toLowerCase().includes(n) && r.setAttribute(m, "true");
    }
  }, b.prototype.destroy = function() {
    this.dom[u] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(y), delete this.dom[u]);
  }, N(p, u, b, "ln-search");
})();
(function() {
  const p = "lnTableSort", u = "data-ln-sort", y = "data-ln-table-sort";
  if (window[p] !== void 0) return;
  function m(o) {
    _(o);
  }
  function _(o) {
    const t = Array.from(o.querySelectorAll("table"));
    o.tagName === "TABLE" && t.push(o), t.forEach(function(l) {
      if (l[p]) return;
      const e = Array.from(l.querySelectorAll("th[" + u + "]"));
      e.length && (l[p] = new b(l, e));
    });
  }
  function b(o, t) {
    this.table = o, this.ths = t, this._col = -1, this._dir = null;
    const l = this;
    t.forEach(function(r, d) {
      if (r[p + "Bound"]) return;
      r[p + "Bound"] = !0;
      const s = r.querySelector("[" + y + "]");
      s && (s._lnSortClick = function() {
        l._handleClick(d, r);
      }, s.addEventListener("click", s._lnSortClick));
    });
    const e = o.closest("[data-ln-table][data-ln-persist]");
    if (e) {
      const r = _t("table-sort", e);
      r && r.dir && r.col >= 0 && r.col < t.length && (this._handleClick(r.col, t[r.col]), r.dir === "desc" && this._handleClick(r.col, t[r.col]));
    }
    return this;
  }
  b.prototype._handleClick = function(o, t) {
    let l;
    this._col !== o ? l = "asc" : this._dir === "asc" ? l = "desc" : this._dir === "desc" ? l = null : l = "asc", this.ths.forEach(function(r) {
      r.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), l === null ? (this._col = -1, this._dir = null) : (this._col = o, this._dir = l, t.classList.add(l === "asc" ? "ln-sort-asc" : "ln-sort-desc")), w(this.table, "ln-table:sort", {
      column: o,
      sortType: t.getAttribute(u),
      direction: l
    });
    const e = this.table.closest("[data-ln-table][data-ln-persist]");
    e && (l === null ? st("table-sort", e, null) : st("table-sort", e, { col: o, dir: l }));
  }, b.prototype.destroy = function() {
    this.table[p] && (this.ths.forEach(function(o) {
      const t = o.querySelector("[" + y + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete o[p + "Bound"];
    }), delete this.table[p]);
  };
  function n() {
    G(function() {
      new MutationObserver(function(t) {
        t.forEach(function(l) {
          l.type === "childList" ? l.addedNodes.forEach(function(e) {
            e.nodeType === 1 && _(e);
          }) : l.type === "attributes" && _(l.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-table-sort");
  }
  window[p] = m, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const p = "data-ln-table", u = "lnTable", y = "data-ln-sort", m = "data-ln-table-empty";
  if (window[u] !== void 0) return;
  const n = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, o = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function t(r) {
    return o ? o.format(r) : String(r);
  }
  function l(r) {
    let d = r.parentElement;
    for (; d && d !== document.body && d !== document.documentElement; ) {
      const i = getComputedStyle(d).overflowY;
      if (i === "auto" || i === "scroll") return d;
      d = d.parentElement;
    }
    return null;
  }
  function e(r) {
    this.dom = r, this.table = r.querySelector("table"), this.tbody = r.querySelector("[data-ln-table-body]") || r.querySelector("tbody"), this.thead = r.querySelector("thead");
    const d = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = d ? Array.from(d.querySelectorAll("th")) : [], this.isDataDriven = r.hasAttribute("data-ln-table-source"), this.name = r.getAttribute(p) || "", this.source = r.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const s = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(i) {
      return i.getAttribute("data-ln-col") && i.querySelector("[data-ln-col-filter]");
    }).map(function(i) {
      return i.getAttribute("data-ln-col");
    }), this._totalSpan = r.querySelector("[data-ln-table-total]"), this._filteredSpan = r.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = r.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(i) {
      const c = i.detail || {};
      s._data = c.data || [], s._lastTotal = c.total != null ? c.total : s._data.length, s._lastFiltered = c.filtered != null ? c.filtered : s._data.length, s.totalCount = s._lastTotal, s.visibleCount = s._lastFiltered, s.isLoaded = !0, r.classList.remove("ln-table--loading"), s._updateFilterOptions(c.filterOptions), s._vStart = -1, s._vEnd = -1, s._applyFilterAndSort(), s._render(), s._updateFooter(), w(r, "ln-table:rendered", {
        table: s.name,
        total: s.totalCount,
        visible: s.visibleCount
      });
    }, r.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const c = i.detail && i.detail.loading;
      r.classList.toggle("ln-table--loading", !!c), c && (s.isLoaded = !1);
    }, r.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(i) {
      const c = i.target.closest("[data-ln-col-sort]");
      if (!c) return;
      const h = c.closest("th");
      if (!h) return;
      const a = h.getAttribute("data-ln-col");
      a && s._handleSort(a, h);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(i) {
      const c = i.target.closest("[data-ln-col-filter]");
      if (!c) return;
      i.stopPropagation();
      const h = c.closest("th");
      if (!h) return;
      const a = h.getAttribute("data-ln-col");
      if (a) {
        if (s._activeDropdown && s._activeDropdown.field === a) {
          s._closeFilterDropdown();
          return;
        }
        s._openFilterDropdown(a, h, c);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      s._activeDropdown && s._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(i) {
      (i.target.closest("[data-ln-table-clear-all]") || i.target.closest("[data-ln-data-table-clear-all]")) && (s.currentFilters = {}, s._updateFilterIndicators(), w(r, "ln-table:clear-filters", { table: s.name }), s._requestData());
    }, r.addEventListener("click", this._onClearAll), this._selectable = r.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-row-select]") || i.target.closest("[data-ln-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const c = i.target.closest("[data-ln-row]");
      if (!c) return;
      const h = c.getAttribute("data-ln-row-id"), a = c._lnRecord || {};
      w(r, "ln-table:row-click", {
        table: s.name,
        id: h,
        record: a
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const c = i.target.closest("[data-ln-row-action]");
      if (!c) return;
      i.stopPropagation();
      const h = c.closest("[data-ln-row]");
      if (!h) return;
      const a = c.getAttribute("data-ln-row-action"), f = h.getAttribute("data-ln-row-id"), g = h._lnRecord || {};
      w(r, "ln-table:row-action", {
        table: s.name,
        id: f,
        action: a,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = r.querySelector("[data-ln-table-search]"), this._searchInput && (this._searchInput.closest("[data-ln-search]") || document.querySelector(`[data-ln-search="${r.id}"]`) || (this._onSearchInput = function() {
      s.currentSearch = s._searchInput.value, w(r, "ln-table:search", {
        table: s.name,
        query: s.currentSearch
      }), s._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput))), this._onSearchChange = function(i) {
      i.preventDefault(), s.currentSearch = i.detail.term, s._searchInput && (s._searchInput.value = i.detail.term), w(r, "ln-table:search", {
        table: s.name,
        query: s.currentSearch
      }), s._requestData();
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(i) {
      if (!r.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (i.key === "/") {
        s._searchInput && (i.preventDefault(), s._searchInput.focus());
        return;
      }
      const c = s.tbody ? Array.from(s.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (c.length)
        switch (i.key) {
          case "ArrowDown":
            i.preventDefault(), s._focusedRowIndex = Math.min(s._focusedRowIndex + 1, c.length - 1), s._focusRow(c);
            break;
          case "ArrowUp":
            i.preventDefault(), s._focusedRowIndex = Math.max(s._focusedRowIndex - 1, 0), s._focusRow(c);
            break;
          case "Home":
            i.preventDefault(), s._focusedRowIndex = 0, s._focusRow(c);
            break;
          case "End":
            i.preventDefault(), s._focusedRowIndex = c.length - 1, s._focusRow(c);
            break;
          case "Enter":
            if (s._focusedRowIndex >= 0 && s._focusedRowIndex < c.length) {
              i.preventDefault();
              const h = c[s._focusedRowIndex];
              w(r, "ln-table:row-click", {
                table: s.name,
                id: h.getAttribute("data-ln-row-id"),
                record: h._lnRecord || {}
              });
            }
            break;
          case " ":
            if (s._selectable && s._focusedRowIndex >= 0 && s._focusedRowIndex < c.length) {
              i.preventDefault();
              const h = c[s._focusedRowIndex].querySelector("[data-ln-row-select]");
              h && (h.checked = !h.checked, h.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            s._activeDropdown && s._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), w(r, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      s.tbody.rows.length > 0 && (s._emptyTbodyObserver.disconnect(), s._emptyTbodyObserver = null, s._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(i) {
      i.preventDefault(), s._searchTerm = i.detail.term, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), w(r, "ln-table:filter", {
        term: s._searchTerm,
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, r.addEventListener("ln-search:change", this._onSearch), this._onSort = function(i) {
      s._sortCol = i.detail.direction === null ? -1 : i.detail.column, s._sortDir = i.detail.direction, s._sortType = i.detail.sortType, s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), w(r, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, r.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(i) {
      const c = i.detail.key;
      let h = !1;
      for (let g = 0; g < s.ths.length; g++)
        if (s.ths[g].getAttribute("data-ln-filter-col") === c) {
          h = !0;
          break;
        }
      if (!h) return;
      const a = i.detail.values;
      if (!a || a.length === 0)
        delete s._columnFilters[c];
      else {
        const g = [];
        for (let S = 0; S < a.length; S++)
          g.push(a[S].toLowerCase());
        s._columnFilters[c] = g;
      }
      const f = s.dom.querySelector('th[data-ln-filter-col="' + c + '"]');
      f && (a && a.length > 0 ? f.setAttribute("data-ln-filter-active", "") : f.removeAttribute("data-ln-filter-active")), s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), w(r, "ln-table:filter", {
        term: s._searchTerm,
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, r.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-table-clear]")) return;
      s._searchTerm = "";
      const h = document.querySelector('[data-ln-search="' + r.id + '"]');
      if (h) {
        const f = h.tagName === "INPUT" ? h : h.querySelector("input");
        f && (f.value = "");
      }
      s._columnFilters = {};
      for (let f = 0; f < s.ths.length; f++)
        s.ths[f].removeAttribute("data-ln-filter-active");
      const a = document.querySelectorAll('[data-ln-filter="' + r.id + '"]');
      for (let f = 0; f < a.length; f++) {
        const g = a[f].querySelector("[data-ln-filter-reset]");
        g && (g.checked = !0, g.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
      s._applyFilterAndSort(), s._vStart = -1, s._vEnd = -1, s._render(), w(r, "ln-table:filter", {
        term: "",
        matched: s._filteredData.length,
        total: s._data.length
      });
    }, r.addEventListener("click", this._onClear)), this;
  }
  e.prototype._parseRows = function() {
    const r = this.tbody.rows, d = this.ths;
    this._data = [];
    const s = [];
    for (let i = 0; i < d.length; i++)
      s[i] = d[i].getAttribute(y);
    r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40), this._lockColumnWidths();
    for (let i = 0; i < r.length; i++) {
      const c = r[i], h = [], a = [], f = [];
      for (let S = 0; S < c.cells.length; S++) {
        const E = c.cells[S], A = E.textContent.trim(), T = E.hasAttribute("data-ln-value") ? E.getAttribute("data-ln-value") : A, D = s[S];
        a[S] = A.toLowerCase(), D === "number" || D === "date" ? h[S] = parseFloat(T) || 0 : D === "string" ? h[S] = String(T) : h[S] = null, S < c.cells.length - 1 && f.push(A.toLowerCase());
      }
      let g = null;
      if (this.isDataDriven) {
        g = {};
        const S = c.getAttribute("data-ln-row-id");
        S != null && (g.id = S);
        for (let E = 0; E < d.length; E++) {
          const A = d[E].getAttribute("data-ln-col");
          if (A) {
            const T = E;
            if (T < c.cells.length) {
              const D = c.cells[T], O = D.textContent.trim();
              g[A] = D.hasAttribute("data-ln-value") ? D.getAttribute("data-ln-value") : O;
            }
          }
        }
      }
      this._data.push({
        sortKeys: h,
        rawTexts: a,
        html: c.outerHTML,
        searchText: f.join(" "),
        id: this.isDataDriven && g ? g.id : void 0,
        ...g
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, e.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const r = (this.currentSearch || "").trim().toLowerCase(), d = this.currentFilters || {}, s = Object.keys(d).length > 0;
      if (this._filteredData = this._data.filter(function(g) {
        if (r) {
          let S = !1;
          for (const E in g)
            if (g.hasOwnProperty(E) && typeof g[E] == "string" && E !== "html" && E !== "searchText" && g[E].toLowerCase().indexOf(r) !== -1) {
              S = !0;
              break;
            }
          if (!S) return !1;
        }
        if (s)
          for (const S in d) {
            const E = d[S];
            if (E && E.length > 0) {
              const A = g[S], T = A != null ? String(A) : "";
              if (E.indexOf(T) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const i = this.currentSort.field, h = this.currentSort.direction === "desc" ? -1 : 1;
      let a = null;
      if (this.ths) {
        for (let g = 0; g < this.ths.length; g++)
          if (this.ths[g].getAttribute("data-ln-col") === i) {
            a = this.ths[g].getAttribute(y);
            break;
          }
      }
      const f = n ? n.compare : function(g, S) {
        return g < S ? -1 : g > S ? 1 : 0;
      };
      this._filteredData.sort(function(g, S) {
        const E = g[i], A = S[i];
        if (a === "number" || a === "date") {
          const O = parseFloat(E) || 0, x = parseFloat(A) || 0;
          return (O - x) * h;
        }
        if (typeof E == "number" && typeof A == "number")
          return (E - A) * h;
        const T = E != null ? String(E) : "", D = A != null ? String(A) : "";
        return f(T, D) * h;
      });
    } else {
      const r = this._searchTerm, d = this._columnFilters, s = Object.keys(d).length > 0, i = this.ths, c = {};
      if (s)
        for (let S = 0; S < i.length; S++) {
          const E = i[S].getAttribute("data-ln-filter-col");
          E && (c[E] = S);
        }
      if (!r && !s ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (r && S.searchText.indexOf(r) === -1) return !1;
        if (s)
          for (const E in d) {
            const A = c[E];
            if (A !== void 0 && d[E].indexOf(S.rawTexts[A]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const h = this._sortCol, a = this._sortDir === "desc" ? -1 : 1, f = this._sortType === "number" || this._sortType === "date", g = n ? n.compare : function(S, E) {
        return S < E ? -1 : S > E ? 1 : 0;
      };
      this._filteredData.sort(function(S, E) {
        const A = S.sortKeys[h], T = E.sortKeys[h];
        return f ? (A - T) * a : g(A, T) * a;
      });
    }
  }, e.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const r = document.createElement("colgroup");
    this.ths.forEach(function(d) {
      const s = document.createElement("col");
      s.style.width = d.offsetWidth + "px", r.appendChild(s);
    }), this.table.insertBefore(r, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = r;
  }, e.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const r = this._lastTotal, d = this.visibleCount;
        if (r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || d === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, e.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, d = document.createDocumentFragment();
      for (let s = 0; s < r.length; s++) {
        const i = this._buildRow(r[s]);
        if (!i) break;
        d.appendChild(i);
      }
      this.tbody.textContent = "", this.tbody.appendChild(d), this._selectable && this._updateSelectAll();
    } else {
      const r = [], d = this._filteredData;
      for (let s = 0; s < d.length; s++) r.push(d[s].html);
      this.tbody.innerHTML = r.join("");
    }
  }, e.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
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
    this.isDataDriven ? this._scrollContainer = l(this.dom) : this._scrollContainer = null;
    const d = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._renderVirtual();
      }));
    }, d.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    const r = this._filteredData, d = r.length, s = this._rowHeight;
    if (!s || !d) return;
    const i = this.thead ? this.thead.offsetHeight : 0, c = this._scrollContainer;
    let h, a;
    if (c) {
      const T = this.table.getBoundingClientRect(), D = c.getBoundingClientRect(), O = T.top - D.top + c.scrollTop + i;
      h = c.scrollTop - O, a = c.clientHeight;
    } else {
      const O = this.table.getBoundingClientRect().top + window.scrollY + i;
      h = window.scrollY - O, a = window.innerHeight;
    }
    let f = Math.max(0, Math.floor(h / s) - 15);
    f = Math.min(f, d);
    const g = Math.min(f + Math.ceil(a / s) + 30, d);
    if (f === this._vStart && g === this._vEnd) return;
    this._vStart = f, this._vEnd = g;
    const S = this.ths.length || 1, E = f * s, A = (d - g) * s;
    if (this.isDataDriven) {
      const T = document.createDocumentFragment();
      if (E > 0) {
        const D = document.createElement("tr");
        D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
        const O = document.createElement("td");
        O.setAttribute("colspan", S), O.style.height = E + "px", D.appendChild(O), T.appendChild(D);
      }
      for (let D = f; D < g; D++) {
        const O = this._buildRow(r[D]);
        O && T.appendChild(O);
      }
      if (A > 0) {
        const D = document.createElement("tr");
        D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
        const O = document.createElement("td");
        O.setAttribute("colspan", S), O.style.height = A + "px", D.appendChild(O), T.appendChild(D);
      }
      this.tbody.textContent = "", this.tbody.appendChild(T), this._selectable && this._updateSelectAll();
    } else {
      let T = "";
      E > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + S + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>');
      for (let D = f; D < g; D++) T += r[D].html;
      A > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + S + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = T;
    }
  }, e.prototype._showEmptyState = function() {
    const r = this.ths.length || 1;
    this.tbody.textContent = "";
    let d = null;
    if (this.isDataDriven) {
      const s = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount, c = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (i < s || i === 0), h = c ? this.name + "-empty-filtered" : this.name + "-empty";
      if (d = Q(this.dom, h, "ln-table"), !d) {
        const a = this.dom.querySelector("template[data-ln-empty]");
        if (a) {
          const f = c ? "search" : "initial", g = a.content.querySelector('[data-ln-empty-when="' + f + '"]') || a.content.firstElementChild;
          g && (d = document.importNode(g, !0));
        }
      }
      if (d)
        if (d.tagName === "TR")
          this.tbody.appendChild(d);
        else {
          const a = document.createElement("td");
          a.setAttribute("colspan", String(r)), a.appendChild(d);
          const f = document.createElement("tr");
          f.className = "ln-table__empty", f.appendChild(a), this.tbody.appendChild(f);
        }
    } else {
      const s = this.dom.querySelector("template[" + m + "]"), i = document.createElement("td");
      i.setAttribute("colspan", String(r)), s && i.appendChild(document.importNode(s.content, !0));
      const c = document.createElement("tr");
      c.className = "ln-table__empty", c.appendChild(i), this.tbody.appendChild(c);
    }
    w(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, e.prototype._fillRow = function(r, d) {
    At(r, d);
    const s = r.querySelectorAll("[data-ln-cell-attr]");
    for (let i = 0; i < s.length; i++) {
      const c = s[i], h = c.getAttribute("data-ln-cell-attr").split(",");
      for (let a = 0; a < h.length; a++) {
        const f = h[a].trim().split(":");
        if (f.length !== 2) continue;
        const g = f[0].trim(), S = f[1].trim();
        d[g] != null && c.setAttribute(S, d[g]);
      }
    }
  }, e.prototype._buildRow = function(r) {
    const d = Q(this.dom, this.name + "-row", "ln-table");
    if (!d) return null;
    const s = d.querySelector("[data-ln-row]") || d.firstElementChild;
    if (!s) return null;
    if (this._fillRow(s, r), s._lnRecord = r, r.id != null && s.setAttribute("data-ln-row-id", r.id), this._selectable && r.id != null && this.selectedIds.has(String(r.id))) {
      s.classList.add("ln-row-selected");
      const i = s.querySelector("[data-ln-row-select]");
      i && (i.checked = !0);
    }
    return s;
  }, e.prototype._updateFilterOptions = function(r) {
    if (r !== null && typeof r == "object" && !Array.isArray(r)) {
      const d = Object.keys(r);
      for (let s = 0; s < d.length; s++) {
        const i = d[s], c = r[i];
        if (!Array.isArray(c)) continue;
        const h = {}, a = [];
        for (let f = 0; f < c.length; f++) {
          const g = String(c[f]);
          h[g] || (h[g] = !0, a.push(g));
        }
        this._filterOptions[i] = a.sort();
      }
    } else {
      const d = this._filterableFields, s = this._data;
      for (let i = 0; i < d.length; i++) {
        const c = d[i];
        this._filterOptions[c] || (this._filterOptions[c] = []);
        const h = this._filterOptions[c], a = {};
        for (let f = 0; f < h.length; f++)
          a[h[f]] = !0;
        for (let f = 0; f < s.length; f++) {
          const g = s[f][c];
          if (g != null) {
            const S = String(g);
            a[S] || (a[S] = !0, h.push(S));
          }
        }
        h.sort();
      }
    }
  }, e.prototype._getUniqueValues = function(r) {
    return (this._filterOptions[r] || []).slice().sort();
  }, e.prototype._updateFilterIndicators = function() {
    const r = this.ths;
    for (let d = 0; d < r.length; d++) {
      const s = r[d], i = s.getAttribute("data-ln-col");
      if (!i) continue;
      const c = s.querySelector("[data-ln-col-filter]");
      if (!c) continue;
      const h = this.currentFilters[i] && this.currentFilters[i].length > 0;
      c.classList.toggle("ln-filter-active", !!h);
    }
  }, e.prototype._applyFilterMutualExclusion = function(r, d) {
    const s = r.hasAttribute("data-ln-filter-reset"), i = d.querySelector("[data-ln-filter-reset]"), c = d.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');
    if (s) {
      r.checked = !0;
      for (let h = 0; h < c.length; h++) c[h].checked = !1;
    } else if (r.checked)
      i && (i.checked = !1);
    else {
      let h = !1;
      for (let a = 0; a < c.length; a++)
        if (c[a].checked) {
          h = !0;
          break;
        }
      !h && i && (i.checked = !0);
    }
  }, e.prototype._onFilterChange = function(r, d) {
    const s = d.querySelector("[data-ln-filter-reset]"), i = d.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])'), c = [];
    for (let a = 0; a < i.length; a++)
      i[a].checked && c.push(i[a].value);
    const h = s && s.checked || c.length === 0;
    h ? delete this.currentFilters[r] : this.currentFilters[r] = c, this._updateFilterIndicators(), w(this.dom, "ln-table:filter", {
      table: this.name,
      field: r,
      values: h ? [] : c
    }), this._requestData();
  }, e.prototype._openFilterDropdown = function(r, d, s) {
    this._closeFilterDropdown();
    const i = Q(this.dom, this.name + "-column-filter", "ln-table") || Q(this.dom, "column-filter", "ln-table");
    if (!i) return;
    const c = i.firstElementChild;
    if (!c) return;
    const h = this._getUniqueValues(r), a = c.querySelector("[data-ln-filter-options]"), f = c.querySelector("[data-ln-filter-search]"), g = this.currentFilters[r] || [], S = this;
    if (f && h.length <= 8 && f.classList.add("hidden"), a) {
      const E = a.querySelector("[data-ln-filter-reset]");
      E && (E.checked = g.length === 0);
      const A = Q(c, this.name + "-column-filter-item", "ln-table") || Q(c, "column-filter-item", "ln-table");
      if (A)
        for (let T = 0; T < h.length; T++) {
          const D = h[T], O = A.cloneNode(!0);
          X(O, { value: D });
          const x = O.querySelector('input[type="checkbox"]');
          x && (x.value = D, x.checked = g.length > 0 && g.indexOf(D) !== -1), a.appendChild(O);
        }
      a.addEventListener("change", function(T) {
        T.target.type === "checkbox" && (S._applyFilterMutualExclusion(T.target, a), S._onFilterChange(r, a));
      });
    }
    f && f.addEventListener("input", function() {
      const E = f.value.toLowerCase(), A = a.querySelectorAll("li");
      for (let T = 0; T < A.length; T++) {
        const D = A[T].textContent.toLowerCase();
        A[T].classList.toggle("hidden", E && D.indexOf(E) === -1);
      }
    }), d.appendChild(c), this._activeDropdown = { field: r, th: d, el: c }, c.addEventListener("click", function(E) {
      E.stopPropagation();
    });
  }, e.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, e.prototype._handleSort = function(r, d) {
    let s;
    !this.currentSort || this.currentSort.field !== r ? s = "asc" : this.currentSort.direction === "asc" ? s = "desc" : s = null;
    for (let i = 0; i < this.ths.length; i++)
      this.ths[i].classList.remove("ln-sort-asc", "ln-sort-desc");
    s ? (this.currentSort = { field: r, direction: s }, d.classList.add(s === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, w(this.dom, "ln-table:sort", {
      table: this.name,
      field: r,
      direction: s
    }), this._requestData();
  }, e.prototype._requestData = function() {
    this._applyFilterAndSort(), this._vStart = -1, this._vEnd = -1, this._render(), this._updateFooter(), w(this.dom, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, e.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-row]");
    let d = r.length > 0;
    for (let s = 0; s < r.length; s++) {
      const i = r[s].getAttribute("data-ln-row-id");
      if (i != null && !this.selectedIds.has(i)) {
        d = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = d;
  }, Object.defineProperty(e.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), e.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const r = this;
    if (this._onSelectionChange = function(d) {
      const s = d.target.closest("[data-ln-row-select]");
      if (!s) return;
      const i = s.closest("[data-ln-row]");
      if (!i) return;
      const c = i.getAttribute("data-ln-row-id");
      c != null && (s.checked ? (r.selectedIds.add(c), i.classList.add("ln-row-selected")) : (r.selectedIds.delete(c), i.classList.remove("ln-row-selected")), r.selectedCount = r.selectedIds.size, r._updateSelectAll(), r._updateFooter(), w(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const d = document.createElement("input");
      d.type = "checkbox", d.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(d), this._selectAllCheckbox = d;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const d = r._selectAllCheckbox.checked, s = r.tbody ? r.tbody.querySelectorAll("[data-ln-row]") : [];
      for (let i = 0; i < s.length; i++) {
        const c = s[i].getAttribute("data-ln-row-id"), h = s[i].querySelector("[data-ln-row-select]");
        c != null && (d ? (r.selectedIds.add(c), s[i].classList.add("ln-row-selected")) : (r.selectedIds.delete(c), s[i].classList.remove("ln-row-selected")), h && (h.checked = d));
      }
      r.selectedCount = r.selectedIds.size, w(r.dom, "ln-table:select-all", {
        table: r.name,
        selected: d
      }), w(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const d = this.tbody.querySelectorAll("[data-ln-row]");
      for (let s = 0; s < d.length; s++) {
        const i = d[s].querySelector("[data-ln-row-select]"), c = d[s].getAttribute("data-ln-row-id");
        i && i.checked && c != null && (this.selectedIds.add(c), d[s].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, e.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const r = this.dom.querySelector("[data-ln-col-select]");
    if (r) {
      const d = r.querySelector('input[type="checkbox"]');
      d && d.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const d = this.tbody.querySelectorAll("[data-ln-row]");
      for (let s = 0; s < d.length; s++) {
        d[s].classList.remove("ln-row-selected");
        const i = d[s].querySelector("[data-ln-row-select]");
        i && (i.checked = !1);
      }
    }
    this._updateFooter();
  }, e.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const r = this._lastTotal != null ? this._lastTotal : this._data.length, d = this.visibleCount, s = d < r;
    if (this._totalSpan && (this._totalSpan.textContent = t(r)), this._filteredSpan && (this._filteredSpan.textContent = s ? t(d) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !s), this._selectedSpan) {
      const i = this.selectedIds.size;
      this._selectedSpan.textContent = i > 0 ? t(i) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, e.prototype._focusRow = function(r) {
    for (let d = 0; d < r.length; d++)
      r[d].classList.remove("ln-row-focused"), r[d].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < r.length) {
      const d = r[this._focusedRowIndex];
      d.classList.add("ln-row-focused"), d.setAttribute("tabindex", "0"), d.focus(), d.scrollIntoView({ block: "nearest" });
    }
  }, e.prototype.destroy = function() {
    this.dom[u] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[u]);
  }, N(p, u, e, "ln-table");
})();
(function() {
  const p = "data-ln-list", u = "lnList", y = "data-ln-list-empty";
  if (window[u] !== void 0) return;
  function b(o) {
    let t = o.parentElement;
    for (; t && t !== document.body && t !== document.documentElement; ) {
      const e = getComputedStyle(t).overflowY;
      if (e === "auto" || e === "scroll") return t;
      t = t.parentElement;
    }
    return null;
  }
  function n(o) {
    this.dom = o, this.tbody = o.querySelector("[data-ln-list-body]") || o, this.isDataDriven = o.hasAttribute("data-ln-list-source"), this.name = o.getAttribute(p) || "", this.source = o.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const t = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = o.querySelector("[data-ln-list-total]"), this._filteredSpan = o.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== o ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = o.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== o ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(l) {
      const e = l.detail || {};
      t._data = e.data || [], t._lastTotal = e.total != null ? e.total : t._data.length, t._lastFiltered = e.filtered != null ? e.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, o.classList.remove("ln-list--loading"), t._vStart = -1, t._vEnd = -1, t._applyFilterAndSort(), t._render(), t._updateFooter(), w(o, "ln-list:rendered", {
        list: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, o.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(l) {
      const e = l.detail && l.detail.loading;
      o.classList.toggle("ln-list--loading", !!e), e && (t.isLoaded = !1);
    }, o.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(l) {
      (l.target.closest("[data-ln-list-clear-all]") || l.target.closest("[data-ln-data-list-clear-all]")) && (t.currentFilters = {}, w(o, "ln-list:clear-filters", { list: t.name }), t._requestData());
    }, o.addEventListener("click", this._onClearAll), this._selectable = o.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(l) {
      if (l.target.closest("[data-ln-item-select]") || l.target.closest("[data-ln-item-action]") || l.target.closest("a") || l.target.closest("button") || l.ctrlKey || l.metaKey || l.button === 1) return;
      const e = l.target.closest("[data-ln-item]");
      if (!e) return;
      const r = e.getAttribute("data-ln-item-id"), d = e._lnRecord || {};
      w(o, "ln-list:item-click", {
        list: t.name,
        id: r,
        record: d
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(l) {
      const e = l.target.closest("[data-ln-item-action]");
      if (!e) return;
      l.stopPropagation();
      const r = e.closest("[data-ln-item]");
      if (!r) return;
      const d = e.getAttribute("data-ln-item-action"), s = r.getAttribute("data-ln-item-id"), i = r._lnRecord || {};
      w(o, "ln-list:item-action", {
        list: t.name,
        id: s,
        action: d,
        record: i
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(l) {
      l.preventDefault(), t.currentSearch = l.detail.term, w(o, "ln-list:search", {
        list: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, o.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), w(o, "ln-list:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      t.tbody.children.length > 0 && (t._emptyObserver.disconnect(), t._emptyObserver = null, t._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(l) {
      l.preventDefault(), t._searchTerm = l.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), w(o, "ln-list:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("ln-search:change", this._onSearch), this._onClear = function(l) {
      if (!l.target.closest("[data-ln-list-clear]")) return;
      t._searchTerm = "";
      const r = document.querySelector('[data-ln-search="' + o.id + '"]');
      if (r) {
        const d = r.tagName === "INPUT" ? r : r.querySelector("input");
        d && (d.value = "");
      }
      t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), w(o, "ln-list:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("click", this._onClear)), this;
  }
  n.prototype._parseChildren = function() {
    const o = Array.from(this.tbody.children).filter((t) => !t.classList.contains("ln-list__spacer"));
    this._data = [], o.length > 0 && (this._itemHeight = o[0].offsetHeight || 50);
    for (let t = 0; t < o.length; t++) {
      const l = o[t], e = l.getAttribute("data-ln-item-id") || l.getAttribute("id"), r = l.textContent.trim().toLowerCase();
      let d = null;
      if (this.isDataDriven) {
        d = {}, e != null && (d.id = e);
        const s = l.querySelectorAll("[data-ln-field]");
        for (let i = 0; i < s.length; i++) {
          const c = s[i], h = c.getAttribute("data-ln-field");
          h && (d[h] = c.textContent.trim());
        }
      }
      this._data.push({
        html: l.outerHTML,
        searchText: r,
        id: e,
        ...d
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), w(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, n.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const o = (this.currentSearch || "").trim().toLowerCase(), t = this.currentFilters || {}, l = Object.keys(t).length > 0;
      if (this._filteredData = this._data.filter(function(s) {
        if (o) {
          let i = !1;
          for (const c in s)
            if (s.hasOwnProperty(c) && typeof s[c] == "string" && c !== "html" && c !== "searchText" && s[c].toLowerCase().indexOf(o) !== -1) {
              i = !0;
              break;
            }
          if (!i) return !1;
        }
        if (l)
          for (const i in t) {
            const c = t[i];
            if (c && c.length > 0) {
              const h = s[i], a = h != null ? String(h) : "";
              if (c.indexOf(a) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const e = this.currentSort.field, r = this.currentSort.direction === "desc" ? -1 : 1, d = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(s, i) {
        return s < i ? -1 : s > i ? 1 : 0;
      };
      this._filteredData.sort(function(s, i) {
        const c = s[e], h = i[e];
        if (typeof c == "number" && typeof h == "number")
          return (c - h) * r;
        const a = c != null ? String(c) : "", f = h != null ? String(h) : "";
        return d(a, f) * r;
      });
    } else {
      const o = this._searchTerm;
      o ? this._filteredData = this._data.filter(function(t) {
        return t.searchText.indexOf(o) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, n.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const o = this._lastTotal, t = this.visibleCount;
        if (o === 0 || this._filteredData.length === 0 || t === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const o = this._filteredData.length;
        o === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, n.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const o = this._filteredData, t = document.createDocumentFragment();
      for (let l = 0; l < o.length; l++) {
        const e = this._buildItem(o[l]);
        if (!e) break;
        t.appendChild(e);
      }
      this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
    } else {
      const o = [], t = this._filteredData;
      for (let l = 0; l < t.length; l++) o.push(t[l].html);
      this.tbody.innerHTML = o.join("");
    }
  }, n.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
    if (!this._itemHeight)
      if (this.isDataDriven) {
        if (this._data.length > 0) {
          const l = this._buildItem(this._data[0]);
          l && (this.tbody.textContent = "", this.tbody.appendChild(l), this._itemHeight = l.offsetHeight || 50, this.tbody.textContent = "");
        }
      } else {
        const l = this.tbody.children;
        l.length > 0 && (this._itemHeight = l[0].offsetHeight || 50);
      }
    this._scrollContainer = b(this.dom);
    const t = this._scrollContainer || window;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._renderVirtual();
      }));
    }, t.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, n.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, n.prototype._renderVirtual = function() {
    const o = this._filteredData, t = o.length, l = this._itemHeight;
    if (!l || !t) return;
    const e = this._scrollContainer;
    let r, d;
    if (e) {
      const a = this.tbody.getBoundingClientRect(), f = e.getBoundingClientRect(), g = a.top - f.top + e.scrollTop;
      r = e.scrollTop - g, d = e.clientHeight;
    } else {
      const f = this.tbody.getBoundingClientRect().top + window.scrollY;
      r = window.scrollY - f, d = window.innerHeight;
    }
    let s = Math.max(0, Math.floor(r / l) - 15);
    s = Math.min(s, t);
    const i = Math.min(s + Math.ceil(d / l) + 30, t);
    if (s === this._vStart && i === this._vEnd) return;
    this._vStart = s, this._vEnd = i;
    const c = s * l, h = (t - i) * l;
    if (this.isDataDriven) {
      const a = document.createDocumentFragment();
      if (c > 0) {
        const f = document.createElement(this.isUl ? "li" : "div");
        f.className = "ln-list__spacer", f.style.height = c + "px", a.appendChild(f);
      }
      for (let f = s; f < i; f++) {
        const g = this._buildItem(o[f]);
        g && a.appendChild(g);
      }
      if (h > 0) {
        const f = document.createElement(this.isUl ? "li" : "div");
        f.className = "ln-list__spacer", f.style.height = h + "px", a.appendChild(f);
      }
      this.tbody.textContent = "", this.tbody.appendChild(a), this._selectable && this._updateSelectAll();
    } else {
      let a = "";
      c > 0 && (a += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${c}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let f = s; f < i; f++)
        a += o[f].html;
      h > 0 && (a += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${h}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = a;
    }
  }, n.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let o = null;
    if (this.isDataDriven) {
      const t = this._lastTotal != null ? this._lastTotal : this._data.length, l = this.visibleCount, e = this.currentSearch && (l < t || l === 0), r = e ? this.name + "-empty-filtered" : this.name + "-empty";
      if (o = Q(this.dom, r, "ln-list"), !o) {
        const d = this.dom.querySelector("template[data-ln-empty]");
        if (d) {
          const s = e ? "search" : "initial", i = d.content.querySelector(`[data-ln-empty-when="${s}"]`) || d.content.firstElementChild;
          i && (o = document.importNode(i, !0));
        }
      }
    } else {
      const t = this.dom.querySelector(`template[${y}]`);
      t && (o = document.importNode(t.content, !0));
    }
    if (o)
      if (o.tagName === "LI" || o.tagName === "TR")
        this.tbody.appendChild(o);
      else {
        const t = document.createElement(this.isUl ? "li" : "div");
        t.appendChild(o), this.tbody.appendChild(t);
      }
    w(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, n.prototype._buildItem = function(o) {
    const t = Q(this.dom, this.name + "-row", "ln-list");
    if (!t) return null;
    const l = t.querySelector("[data-ln-item]") || t.firstElementChild;
    if (!l) return null;
    if (At(l, o), X(l, o), l._lnRecord = o, o.id != null && (l.setAttribute("data-ln-item-id", o.id), this._selectable && this.selectedIds.has(String(o.id)))) {
      l.classList.add("ln-item-selected");
      const e = l.querySelector("[data-ln-item-select]");
      e && (e.checked = !0);
    }
    return l;
  }, n.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const o = this;
    this._onSelectionChange = function(t) {
      const l = t.target.closest("[data-ln-item-select]");
      if (!l) return;
      const e = l.closest("[data-ln-item]");
      if (!e) return;
      const r = e.getAttribute("data-ln-item-id");
      r != null && (l.checked ? (o.selectedIds.add(String(r)), e.classList.add("ln-item-selected")) : (o.selectedIds.delete(String(r)), e.classList.remove("ln-item-selected")), o._updateSelectAll(), o._updateFooter(), w(o.dom, "ln-list:select", {
        list: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const t = o._selectAllCheckbox.checked, l = o.tbody.querySelectorAll("[data-ln-item]");
      for (let e = 0; e < l.length; e++) {
        const r = l[e], d = r.getAttribute("data-ln-item-id"), s = r.querySelector("[data-ln-item-select]");
        d != null && (t ? (o.selectedIds.add(String(d)), r.classList.add("ln-item-selected")) : (o.selectedIds.delete(String(d)), r.classList.remove("ln-item-selected")), s && (s.checked = t));
      }
      w(o.dom, "ln-list:select-all", { list: o.name, selected: t }), w(o.dom, "ln-list:select", {
        list: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedIds.size
      }), o._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, n.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const o = this.tbody.querySelectorAll("[data-ln-item]");
    let t = o.length > 0;
    for (let l = 0; l < o.length; l++) {
      const e = o[l].getAttribute("data-ln-item-id");
      if (e != null && !this.selectedIds.has(String(e))) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, n.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const o = this._lastTotal != null ? this._lastTotal : this._data.length, t = this.visibleCount, l = t < o;
    if (this._totalSpan && (this._totalSpan.textContent = o), this._filteredSpan && (this._filteredSpan.textContent = l ? t : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !l), this._selectedSpan) {
      const e = this.selectedIds.size;
      this._selectedSpan.textContent = e > 0 ? e : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, n.prototype.destroy = function() {
    this.dom[u] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[u]);
  }, N(p, u, n, "ln-list");
})();
(function() {
  const p = "data-ln-circular-progress", u = "lnCircularProgress";
  if (window[u] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", m = 36, _ = 16, b = 2 * Math.PI * _;
  function n(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), l.call(this), r.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  n.prototype.destroy = function() {
    this.dom[u] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[u]);
  };
  function o(r, d) {
    const s = document.createElementNS(y, r);
    for (const i in d)
      s.setAttribute(i, d[i]);
    return s;
  }
  function t() {
    this.svg = o("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = o("circle", {
      cx: m / 2,
      cy: m / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = o("circle", {
      cx: m / 2,
      cy: m / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": b,
      "stroke-dashoffset": b,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function l() {
    const r = this, d = new MutationObserver(function(s) {
      for (const i of s)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max") && e.call(r);
    });
    d.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = d;
  }
  function e() {
    const r = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, d = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let s = d > 0 ? r / d * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100);
    const i = b - s / 100 * b;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const c = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = c !== null ? c : Math.round(s) + "%", w(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: r,
      max: d,
      percentage: s
    });
  }
  N(p, u, n, "ln-circular-progress");
})();
(function() {
  const p = "data-ln-sortable", u = "lnSortable", y = "data-ln-sortable-handle";
  if (window[u] !== void 0) return;
  function m(b) {
    this.dom = b, this.isEnabled = b.getAttribute(p) !== "disabled", this._dragging = null, b.setAttribute("aria-roledescription", "sortable list");
    const n = this;
    return this._onPointerDown = function(o) {
      n.isEnabled && n._handlePointerDown(o);
    }, b.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(p, "");
  }, m.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(p, "disabled");
  }, m.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), w(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[u]);
  }, m.prototype._handlePointerDown = function(b) {
    let n = b.target.closest("[" + y + "]"), o;
    if (n) {
      for (o = n; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (o = b.target; o && o.parentElement !== this.dom; )
        o = o.parentElement;
      if (!o || o.parentElement !== this.dom) return;
      n = o;
    }
    const l = Array.from(this.dom.children).indexOf(o);
    if (K(this.dom, "ln-sortable:before-drag", {
      item: o,
      index: l
    }).defaultPrevented) return;
    b.preventDefault(), n.setPointerCapture(b.pointerId), this._dragging = o, o.classList.add("ln-sortable--dragging"), o.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), w(this.dom, "ln-sortable:drag-start", {
      item: o,
      index: l
    });
    const r = this, d = function(i) {
      r._handlePointerMove(i);
    }, s = function(i) {
      r._handlePointerEnd(i), n.removeEventListener("pointermove", d), n.removeEventListener("pointerup", s), n.removeEventListener("pointercancel", s);
    };
    n.addEventListener("pointermove", d), n.addEventListener("pointerup", s), n.addEventListener("pointercancel", s);
  }, m.prototype._handlePointerMove = function(b) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), o = this._dragging;
    for (const t of n)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of n) {
      if (t === o) continue;
      const l = t.getBoundingClientRect(), e = l.top + l.height / 2;
      if (b.clientY >= l.top && b.clientY < e) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (b.clientY >= e && b.clientY <= l.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(b) {
    if (!this._dragging) return;
    const n = this._dragging, o = Array.from(this.dom.children), t = o.indexOf(n);
    let l = null, e = null;
    for (const r of o) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        l = r, e = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        l = r, e = "after";
        break;
      }
    }
    for (const r of o)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), l && l !== n) {
      e === "before" ? this.dom.insertBefore(n, l) : this.dom.insertBefore(n, l.nextElementSibling);
      const d = Array.from(this.dom.children).indexOf(n);
      w(this.dom, "ln-sortable:reordered", {
        item: n,
        oldIndex: t,
        newIndex: d
      });
    }
    this._dragging = null;
  };
  function _(b) {
    const n = b[u];
    if (!n) return;
    const o = b.getAttribute(p) !== "disabled";
    o !== n.isEnabled && (n.isEnabled = o, w(b, o ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: b }));
  }
  N(p, u, m, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const p = "data-ln-confirm", u = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[u] !== void 0) return;
  function _(b) {
    this.dom = b, this.confirming = !1, this.originalText = b.textContent.trim(), this.confirmText = b.getAttribute(p) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const n = this;
    return this._onClick = function(o) {
      if (!n.confirming)
        o.preventDefault(), o.stopImmediatePropagation(), n._enterConfirm();
      else {
        if (n._submitted) return;
        n._submitted = !0, n._reset();
      }
    }, b.addEventListener("click", this._onClick), this;
  }
  _.prototype._getTimeout = function() {
    const b = parseFloat(this.dom.getAttribute(y));
    return isNaN(b) || b <= 0 ? 3 : b;
  }, _.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var b = this.dom.querySelector("svg.ln-icon use");
    b && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = b.getAttribute("href"), b.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), w(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, _.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const b = this, n = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      b._reset();
    }, n);
  }, _.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var b = this.dom.querySelector("svg.ln-icon use");
      b && this.originalIconHref && b.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, _.prototype.destroy = function() {
    this.dom[u] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[u]);
  }, N(p, u, _, "ln-confirm");
})();
(function() {
  const p = "data-ln-translations", u = "lnTranslations";
  if (window[u] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(p + "-default") || "", this.badgesEl = _.querySelector("[" + p + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const b = _.getAttribute(p + "-locales");
    if (this.locales = y, b)
      try {
        this.locales = JSON.parse(b);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const n = this;
    return this._onRequestAdd = function(o) {
      o.detail && o.detail.lang && n.addLanguage(o.detail.lang);
    }, this._onRequestRemove = function(o) {
      o.detail && o.detail.lang && n.removeLanguage(o.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of _) {
      const n = b.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const o of n)
        o.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, m.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const b of _) {
      const n = b.getAttribute("data-ln-translatable-lang");
      n && n !== this.defaultLang && this.activeLanguages.add(n);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, m.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let b = 0;
    for (const o in this.locales) {
      if (!this.locales.hasOwnProperty(o) || this.activeLanguages.has(o)) continue;
      b++;
      const t = Et("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const l = t.querySelector("[data-ln-translations-lang]");
      l.setAttribute("data-ln-translations-lang", o), l.textContent = this.locales[o], l.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(o));
      }), this.menuEl.appendChild(t);
    }
    const n = this.dom.querySelector("[" + p + "-add]");
    n && (n.style.display = b === 0 ? "none" : "");
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(b) {
      const n = Et("ln-translations-badge", "ln-translations");
      if (!n) return;
      const o = n.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", b);
      const t = o.querySelector("span");
      t.textContent = _.locales[b] || b.toUpperCase();
      const l = o.querySelector("button");
      l.setAttribute("aria-label", "Remove " + (_.locales[b] || b.toUpperCase())), l.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), _.removeLanguage(b));
      }), _.badgesEl.appendChild(n);
    });
  }, m.prototype.addLanguage = function(_, b) {
    if (this.activeLanguages.has(_)) return;
    const n = this.locales[_] || _;
    if (K(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: n
    }).defaultPrevented) return;
    this.activeLanguages.add(_), b = b || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const l of t) {
      const e = l.getAttribute("data-ln-translatable"), r = l.getAttribute("data-ln-translations-prefix") || "", d = l.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!d) continue;
      const s = d.cloneNode(!1);
      r ? s.name = r + "[trans][" + _ + "][" + e + "]" : s.name = "trans[" + _ + "][" + e + "]", s.value = b[e] !== void 0 ? b[e] : "", s.removeAttribute("id"), s.placeholder = n + " translation", s.setAttribute("data-ln-translatable-lang", _);
      const i = l.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), c = i.length > 0 ? i[i.length - 1] : d;
      c.parentNode.insertBefore(s, c.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: n
    });
  }, m.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || K(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const n = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const o of n)
      o.parentNode.removeChild(o);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: _
    });
  }, m.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, m.prototype.hasLanguage = function(_) {
    return this.activeLanguages.has(_);
  }, m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    const _ = this.defaultLang, b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of b)
      n.getAttribute("data-ln-translatable-lang") !== _ && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[u];
  }, N(p, u, m, "ln-translations");
})();
(function() {
  const p = "data-ln-autosave", u = "lnAutosave", y = "data-ln-autosave-clear", m = "data-ln-autosave-debounce-input", _ = "ln-autosave:";
  if (window[u] !== void 0) return;
  function n(e) {
    const r = o(e);
    if (!r) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = r;
    let d = null;
    function s() {
      const a = Lt(e);
      try {
        localStorage.setItem(r, JSON.stringify(a));
      } catch {
        return;
      }
      w(e, "ln-autosave:saved", { target: e, data: a });
    }
    function i() {
      let a;
      try {
        a = localStorage.getItem(r);
      } catch {
        return;
      }
      if (!a) return;
      let f;
      try {
        f = JSON.parse(a);
      } catch {
        return;
      }
      if (K(e, "ln-autosave:before-restore", { target: e, data: f }).defaultPrevented) return;
      const S = Tt(e, f);
      for (let E = 0; E < S.length; E++)
        S[E].dispatchEvent(new Event("input", { bubbles: !0 })), S[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      w(e, "ln-autosave:restored", { target: e, data: f });
    }
    function c() {
      try {
        localStorage.removeItem(r);
      } catch {
        return;
      }
      w(e, "ln-autosave:cleared", { target: e });
    }
    this._onFocusout = function(a) {
      const f = a.target;
      t(f) && f.name && s();
    }, this._onChange = function(a) {
      const f = a.target;
      t(f) && f.name && s();
    }, this._onSubmit = function() {
      c();
    }, this._onReset = function() {
      c();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + y + "]") && c();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick);
    const h = l(e);
    return h > 0 && (this._onInput = function(a) {
      const f = a.target;
      !t(f) || !f.name || (d !== null && clearTimeout(d), d = setTimeout(s, h));
    }, e.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return d;
    }, i(), this;
  }
  n.prototype.destroy = function() {
    if (this.dom[u]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const e = this._getInputTimer();
        e !== null && clearTimeout(e);
      }
      w(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[u];
    }
  };
  function o(e) {
    const d = e.getAttribute(p) || e.id;
    return d ? _ + window.location.pathname + ":" + d : null;
  }
  function t(e) {
    const r = e.tagName;
    return r === "INPUT" || r === "TEXTAREA" || r === "SELECT";
  }
  function l(e) {
    if (!e.hasAttribute(m)) return 0;
    const r = e.getAttribute(m);
    if (r === "" || r === null) return 1e3;
    const d = parseInt(r, 10);
    return isNaN(d) || d < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", e), 1e3) : d;
  }
  N(p, u, n, "ln-autosave");
})();
(function() {
  const p = "data-ln-autoresize", u = "lnAutoresize";
  if (window[u] !== void 0) return;
  function y(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const _ = this;
    return this._onInput = function() {
      _._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  y.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, y.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[u]);
  }, N(p, u, y, "ln-autoresize");
})();
(function() {
  const p = "data-ln-validate", u = "lnValidate", y = "data-ln-validate-errors", m = "data-ln-validate-error", _ = "ln-validate-valid", b = "ln-validate-invalid", n = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[u] !== void 0) return;
  function o(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const l = this, e = t.tagName, r = t.type, d = e === "SELECT" || r === "checkbox" || r === "radio";
    return this._onInput = function() {
      l._touched = !0, l.validate();
    }, this._onChange = function() {
      l._touched = !0, l.validate();
    }, this._onSetCustom = function(s) {
      const i = s.detail && s.detail.error;
      if (!i) return;
      l._customErrors.add(i), l._touched = !0;
      const c = t.closest(".form-element");
      if (c) {
        const h = c.querySelector("[" + m + '="' + i + '"]');
        h && h.classList.remove("hidden");
      }
      t.classList.remove(_), t.classList.add(b);
    }, this._onClearCustom = function(s) {
      const i = s.detail && s.detail.error, c = t.closest(".form-element");
      if (i) {
        if (l._customErrors.delete(i), c) {
          const h = c.querySelector("[" + m + '="' + i + '"]');
          h && h.classList.add("hidden");
        }
      } else
        l._customErrors.forEach(function(h) {
          if (c) {
            const a = c.querySelector("[" + m + '="' + h + '"]');
            a && a.classList.add("hidden");
          }
        }), l._customErrors.clear();
      l._touched && l.validate();
    }, d || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  o.prototype.validate = function() {
    const t = this.dom, l = t.validity, r = t.checkValidity() && this._customErrors.size === 0, d = t.closest(".form-element");
    if (d) {
      const i = d.querySelector("[" + y + "]");
      if (i) {
        const c = i.querySelectorAll("[" + m + "]");
        for (let h = 0; h < c.length; h++) {
          const a = c[h].getAttribute(m), f = n[a];
          f && (l[f] ? c[h].classList.remove("hidden") : c[h].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(_, r), t.classList.toggle(b, !r), w(t, r ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), r;
  }, o.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, b);
    const t = this.dom.closest(".form-element");
    if (t) {
      const l = t.querySelectorAll("[" + m + "]");
      for (let e = 0; e < l.length; e++)
        l[e].classList.add("hidden");
    }
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), o.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(_, b), w(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[u]);
  }, N(p, u, o, "ln-validate");
})();
(function() {
  const p = "data-ln-form", u = "lnForm", y = "data-ln-form-auto", m = "data-ln-form-debounce", _ = "data-ln-validate", b = "lnValidate";
  if (window[u] !== void 0) return;
  function n(o) {
    this.dom = o, this._debounceTimer = null;
    const t = this;
    if (this._onValid = function() {
      t._updateSubmitButton();
    }, this._onInvalid = function() {
      t._updateSubmitButton();
    }, this._onSubmit = function(l) {
      l.preventDefault(), t.submit();
    }, this._onFill = function(l) {
      l.detail && t.fill(l.detail);
    }, this._onFormReset = function() {
      t.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        t._resetValidation();
      }, 0);
    }, o.addEventListener("ln-validate:valid", this._onValid), o.addEventListener("ln-validate:invalid", this._onInvalid), o.addEventListener("submit", this._onSubmit), o.addEventListener("ln-form:fill", this._onFill), o.addEventListener("ln-form:reset", this._onFormReset), o.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, o.hasAttribute(y)) {
      const l = parseInt(o.getAttribute(m)) || 0;
      this._onAutoInput = function() {
        l > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, l)) : t.submit();
      }, o.addEventListener("input", this._onAutoInput), o.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  n.prototype._updateSubmitButton = function() {
    const o = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!o.length) return;
    const t = this.dom.querySelectorAll("[" + _ + "]");
    let l = !1;
    if (t.length > 0) {
      let e = !1, r = !1;
      for (let d = 0; d < t.length; d++) {
        const s = t[d][b];
        s && s._touched && (e = !0), t[d].checkValidity() || (r = !0);
      }
      l = r || !e;
    }
    for (let e = 0; e < o.length; e++)
      o[e].disabled = l;
  }, n.prototype.fill = function(o) {
    const t = Tt(this.dom, o);
    for (let l = 0; l < t.length; l++) {
      const e = t[l], r = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(r ? "change" : "input", { bubbles: !0 }));
    }
  }, n.prototype.submit = function() {
    const o = this.dom.querySelectorAll("[" + _ + "]");
    let t = !0;
    for (let e = 0; e < o.length; e++) {
      const r = o[e][b];
      r && (r.validate() || (t = !1));
    }
    if (!t) return;
    const l = Lt(this.dom);
    w(this.dom, "ln-form:submit", { data: l });
  }, n.prototype.reset = function() {
    this.dom.reset();
    const o = this.dom.querySelectorAll("input, textarea, select");
    for (let t = 0; t < o.length; t++) {
      const l = o[t], e = l.tagName === "SELECT" || l.type === "checkbox" || l.type === "radio";
      l.dispatchEvent(new Event(e ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), w(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, n.prototype._resetValidation = function() {
    const o = this.dom.querySelectorAll("[" + _ + "]");
    for (let t = 0; t < o.length; t++) {
      const l = o[t][b];
      l && l.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(n.prototype, "isValid", {
    get: function() {
      const o = this.dom.querySelectorAll("[" + _ + "]");
      for (let t = 0; t < o.length; t++)
        if (!o[t].checkValidity()) return !1;
      return !0;
    }
  }), n.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), w(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[u]);
  }, N(p, u, n, "ln-form");
})();
(function() {
  const p = "data-ln-time", u = "lnTime";
  if (window[u] !== void 0) return;
  const y = {}, m = {};
  function _(E) {
    return E.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function b(E, A) {
    const T = (E || "") + "|" + JSON.stringify(A);
    return y[T] || (y[T] = new Intl.DateTimeFormat(E, A)), y[T];
  }
  function n(E) {
    const A = E || "";
    return m[A] || (m[A] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), m[A];
  }
  const o = /* @__PURE__ */ new Set();
  let t = null;
  function l() {
    t || (t = setInterval(r, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function r() {
    for (const E of o) {
      if (!document.body.contains(E.dom)) {
        o.delete(E);
        continue;
      }
      a(E);
    }
    o.size === 0 && e();
  }
  function d(E, A) {
    return b(A, { dateStyle: "long", timeStyle: "short" }).format(E);
  }
  function s(E, A) {
    const T = /* @__PURE__ */ new Date(), D = { month: "short", day: "numeric" };
    return E.getFullYear() !== T.getFullYear() && (D.year = "numeric"), b(A, D).format(E);
  }
  function i(E, A) {
    return b(A, { dateStyle: "medium" }).format(E);
  }
  function c(E, A) {
    return b(A, { timeStyle: "short" }).format(E);
  }
  function h(E, A) {
    const T = Math.floor(Date.now() / 1e3), O = Math.floor(E.getTime() / 1e3) - T, x = Math.abs(O);
    if (x < 10) return n(A).format(0, "second");
    let F, B;
    if (x < 60)
      F = "second", B = O;
    else if (x < 3600)
      F = "minute", B = Math.round(O / 60);
    else if (x < 86400)
      F = "hour", B = Math.round(O / 3600);
    else if (x < 604800)
      F = "day", B = Math.round(O / 86400);
    else if (x < 2592e3)
      F = "week", B = Math.round(O / 604800);
    else
      return s(E, A);
    return n(A).format(B, F);
  }
  function a(E) {
    const A = E.dom.getAttribute("datetime");
    if (!A) return;
    const T = Number(A);
    if (isNaN(T)) return;
    const D = new Date(T * 1e3), O = E.dom.getAttribute(p) || "short", x = _(E.dom);
    let F;
    switch (O) {
      case "relative":
        F = h(D, x);
        break;
      case "full":
        F = d(D, x);
        break;
      case "date":
        F = i(D, x);
        break;
      case "time":
        F = c(D, x);
        break;
      default:
        F = s(D, x);
        break;
    }
    E.dom.textContent = F, O !== "full" && (E.dom.title = d(D, x));
  }
  function f(E) {
    return this.dom = E, a(this), E.getAttribute(p) === "relative" && (o.add(this), l()), this;
  }
  f.prototype.render = function() {
    a(this);
  }, f.prototype.destroy = function() {
    o.delete(this), o.size === 0 && e(), delete this.dom[u];
  };
  function g(E) {
    const A = E[u];
    if (!A) return;
    E.getAttribute(p) === "relative" ? (o.add(A), l()) : (o.delete(A), o.size === 0 && e()), a(A);
  }
  function S(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(p) && E[u] && a(E[u]);
  }
  N(p, u, f, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: g,
    onInit: S
  });
})();
(function() {
  const p = "data-ln-data-store", u = "lnDataStore";
  if (window[u] !== void 0) return;
  const y = "ln_app_cache", m = "_meta", _ = "1.0";
  let b = null, n = null;
  const o = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (C) => {
        const L = Math.random() * 16 | 0;
        return (C === "x" ? L : L & 3 | 8).toString(16);
      });
    }
  }
  function l(v) {
    v && v.name === "QuotaExceededError" && w(document, "ln-store:quota-exceeded", { error: v });
  }
  function e() {
    const v = {};
    for (const C of document.querySelectorAll(`[${p}]`)) {
      const L = C.getAttribute(p);
      if (L) {
        const k = C.getAttribute("data-ln-data-store-indexes") || C.getAttribute("data-ln-store-indexes") || "";
        v[L] = {
          indexes: k.split(",").map((I) => I.trim()).filter(Boolean)
        };
      }
    }
    return v;
  }
  function r() {
    return n || (n = new Promise((v) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), v(null);
      const C = e(), L = Object.keys(C), k = indexedDB.open(y);
      k.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), v(null);
      }, k.onsuccess = (I) => {
        const q = I.target.result, M = Array.from(q.objectStoreNames);
        if (!(!M.includes(m) || L.some((ht) => !M.includes(ht))))
          return d(q), b = q, v(q);
        const Y = q.version;
        q.close();
        const nt = indexedDB.open(y, Y + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), v(null);
        }, nt.onupgradeneeded = (ht) => {
          const it = ht.target.result;
          it.objectStoreNames.contains(m) || it.createObjectStore(m, { keyPath: "key" });
          for (const bt of L)
            if (!it.objectStoreNames.contains(bt)) {
              const Rt = it.createObjectStore(bt, { keyPath: "id" });
              for (const wt of C[bt].indexes)
                Rt.createIndex(wt, wt, { unique: !1 });
            }
        }, nt.onsuccess = (ht) => {
          const it = ht.target.result;
          d(it), b = it, v(it);
        };
      };
    }), n);
  }
  function d(v) {
    v.onversionchange = () => {
      v.close(), b = null, n = null;
    };
  }
  function s() {
    return b ? Promise.resolve(b) : (n = null, r());
  }
  async function i(v) {
    if (!ft() || !v) return v;
    const C = { ...v }, L = C.id, k = C._pending, I = await Ht(C);
    return !I || !I.encrypted ? v : {
      id: L,
      _pending: k,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function c(v) {
    return !v || !v.encrypted || !ft() ? v : Ut(v);
  }
  const h = (v, C) => s().then((L) => L ? L.transaction(v, C).objectStore(v) : null);
  function a(v) {
    return new Promise((C, L) => {
      v.onsuccess = () => C(v.result), v.onerror = () => {
        l(v.error), L(v.error);
      };
    });
  }
  const f = (v) => h(v, "readonly").then((C) => C ? a(C.getAll()) : []).then((C) => ft() ? Promise.all(C.map((L) => c(L))) : C), g = (v, C) => h(v, "readonly").then((L) => L ? a(L.get(C)) : null).then((L) => L ? c(L) : null), S = (v, C) => (ft() ? i(C) : Promise.resolve(C)).then((k) => h(v, "readwrite").then((I) => I ? a(I.put(k)) : null)), E = (v, C) => h(v, "readwrite").then((L) => L ? a(L.delete(C)) : null), A = (v) => h(v, "readwrite").then((C) => C ? a(C.clear()) : null), T = (v) => h(v, "readonly").then((C) => C ? a(C.count()) : 0), D = (v) => h(m, "readonly").then((C) => C ? a(C.get(v)) : null), O = (v, C) => h(m, "readwrite").then((L) => {
    if (L)
      return C.key = v, a(L.put(C));
  });
  function x(v) {
    this.dom = v, this._name = v.getAttribute(p);
    const C = v.getAttribute("data-ln-data-store-stale") || v.getAttribute("data-ln-store-stale"), L = parseInt(C, 10);
    this._staleThreshold = C === "never" || C === "-1" ? -1 : isNaN(L) ? 300 : L;
    const k = v.getAttribute("data-ln-data-store-search-fields") || v.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = k.split(",").map((I) => I.trim()).filter(Boolean), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, o[this._name] = this, F(this), mt(this), this;
  }
  function F(v) {
    v._handlers = {
      create: (C) => B(v, C.detail),
      update: (C) => j(v, C.detail),
      delete: (C) => Z(v, C.detail),
      "bulk-delete": (C) => tt(v, C.detail)
    };
    for (const [C, L] of Object.entries(v._handlers))
      v.dom.addEventListener(`ln-store:request-${C}`, L);
  }
  function B(v, { data: C = {} } = {}) {
    const L = `_temp_${t()}`, k = { ...C, id: L, _pending: !0 };
    S(v._name, k).then(() => {
      v.totalCount++, w(v.dom, "ln-store:created", { store: v._name, record: k, tempId: L }), w(v.dom, "ln-store:request-remote-create", { tempId: L, data: C });
    });
  }
  function j(v, { id: C, data: L = {}, expected_version: k } = {}) {
    g(v._name, C).then((I) => {
      if (!I) throw new Error(`Record not found: ${C}`);
      v._pendingSnapshots[C] = { ...I };
      const q = { ...I, ...L, _pending: !0 };
      return S(v._name, q).then(() => {
        w(v.dom, "ln-store:updated", { store: v._name, record: q, previous: v._pendingSnapshots[C] }), w(v.dom, "ln-store:request-remote-update", { id: C, data: L, expected_version: k });
      });
    }).catch((I) => console.error("[ln-data-store] Optimistic update failed:", I));
  }
  function Z(v, { id: C } = {}) {
    g(v._name, C).then((L) => {
      if (L)
        return v._pendingSnapshots[C] = { ...L }, E(v._name, C).then(() => {
          v.totalCount--, w(v.dom, "ln-store:deleted", { store: v._name, id: C }), w(v.dom, "ln-store:request-remote-delete", { id: C });
        });
    }).catch((L) => console.error("[ln-data-store] Optimistic delete failed:", L));
  }
  function tt(v, { ids: C = [] } = {}) {
    C.length && Promise.all(C.map((L) => g(v._name, L))).then((L) => {
      const k = L.filter(Boolean), I = k.map((q) => q.id);
      return v._pendingSnapshots[I.join(",")] = k, R(v._name, I).then(() => {
        v.totalCount -= I.length, w(v.dom, "ln-store:deleted", { store: v._name, ids: I }), w(v.dom, "ln-store:request-remote-bulk-delete", { ids: I });
      });
    }).catch((L) => console.error("[ln-data-store] Optimistic bulk delete failed:", L));
  }
  function mt(v) {
    r().then(() => D(v._name)).then((C) => {
      C && C.schema_version === _ ? (v.lastSyncedAt = C.last_synced_at || null, v.totalCount = C.record_count || 0, v.totalCount > 0 ? (v.isLoaded = !0, w(v.dom, "ln-store:ready", { store: v._name, count: v.totalCount, source: "cache" }), lt(v) && $(v)) : $(v)) : C && C.schema_version !== _ ? A(v._name).then(() => O(v._name, { schema_version: _, last_synced_at: null, record_count: 0 })).then(() => $(v)) : $(v);
    });
  }
  function lt(v) {
    return v._staleThreshold === -1 ? !1 : v.lastSyncedAt ? Math.floor(Date.now() / 1e3) - v.lastSyncedAt > v._staleThreshold : !0;
  }
  function $(v) {
    v.isSyncing = !0, w(v.dom, "ln-store:request-remote-sync", { since: v.lastSyncedAt });
  }
  function at(v, C) {
    return s().then((L) => L ? (ft() ? Promise.all(C.map((I) => i(I))) : Promise.resolve(C)).then((I) => new Promise((q, M) => {
      const U = L.transaction(v, "readwrite"), Y = U.objectStore(v);
      I.forEach((nt) => Y.put(nt)), U.oncomplete = () => q(), U.onerror = () => {
        l(U.error), M(U.error);
      };
    })) : void 0);
  }
  function R(v, C) {
    return s().then((L) => {
      if (L)
        return new Promise((k, I) => {
          const q = L.transaction(v, "readwrite"), M = q.objectStore(v);
          C.forEach((U) => M.delete(U)), q.oncomplete = () => k(), q.onerror = () => I(q.error);
        });
    });
  }
  let P = () => {
    document.visibilityState === "visible" && Object.values(o).forEach((v) => {
      v.isLoaded && !v.isSyncing && lt(v) && $(v);
    });
  };
  document.addEventListener("visibilitychange", P);
  const H = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function rt(v, C) {
    if (!C || !C.field) return v;
    const { field: L, direction: k } = C, I = k === "desc";
    return [...v].sort((q, M) => {
      const U = q[L], Y = M[L];
      if (U == null && Y == null) return 0;
      if (U == null) return I ? 1 : -1;
      if (Y == null) return I ? -1 : 1;
      const nt = typeof U == "string" && typeof Y == "string" ? H.compare(U, Y) : U < Y ? -1 : U > Y ? 1 : 0;
      return I ? -nt : nt;
    });
  }
  function ct(v, C) {
    if (!C) return v;
    const L = Object.keys(C).filter((k) => Array.isArray(C[k]) && C[k].length > 0);
    return L.length ? v.filter(
      (k) => L.every((I) => C[I].map(String).includes(String(k[I])))
    ) : v;
  }
  function W(v, C, L) {
    if (!C || !L || !L.length) return v;
    const k = C.toLowerCase();
    return v.filter(
      (I) => L.some((q) => {
        const M = I[q];
        return M != null && String(M).toLowerCase().includes(k);
      })
    );
  }
  function dt(v, C, L) {
    if (!v.length) return 0;
    if (L === "count") return v.length;
    const k = v.map((q) => parseFloat(q[C])).filter((q) => !isNaN(q)), I = k.reduce((q, M) => q + M, 0);
    return L === "sum" ? I : L === "avg" && k.length ? I / k.length : 0;
  }
  function et(v, C) {
    if (!v.presenters || !v.presenters.computed) return C;
    const L = v.presenters.computed;
    return C.map((k) => {
      const I = { ...k };
      for (const [q, M] of Object.entries(L))
        try {
          I[q] = M(k);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${q}`, U);
        }
      return I;
    });
  }
  x.prototype.getAll = function(v = {}) {
    const C = this;
    return f(C._name).then((L) => {
      const k = L.length;
      v.filters && (L = ct(L, v.filters)), v.search && (L = W(L, v.search, C._searchFields));
      const I = L.length;
      if (v.sort && (L = rt(L, v.sort)), v.offset || v.limit) {
        const q = v.offset || 0, M = v.limit || L.length;
        L = L.slice(q, q + M);
      }
      return {
        data: et(C, L),
        total: k,
        filtered: I
      };
    });
  }, x.prototype.getById = function(v) {
    return g(this._name, v).then((C) => C ? et(this, [C])[0] : null);
  }, x.prototype.count = function(v) {
    return v ? f(this._name).then((C) => ct(C, v).length) : T(this._name);
  }, x.prototype.aggregate = function(v, C) {
    return f(this._name).then((L) => dt(L, v, C));
  }, x.prototype.setPresenters = function(v) {
    this.presenters = v;
  }, x.prototype.applySync = function(v, C, L) {
    const k = this, I = v.length > 0 || C.length > 0;
    let q = Promise.resolve();
    return v.length > 0 && (q = q.then(() => at(k._name, v))), C.length > 0 && (q = q.then(() => R(k._name, C))), q.then(() => T(k._name)).then((M) => (k.totalCount = M, O(k._name, {
      schema_version: _,
      last_synced_at: L,
      record_count: M
    }))).then(() => {
      const M = !k.isLoaded;
      k.isLoaded = !0, k.isSyncing = !1, k.lastSyncedAt = L, M ? (w(k.dom, "ln-store:loaded", { store: k._name, count: k.totalCount }), w(k.dom, "ln-store:ready", { store: k._name, count: k.totalCount, source: "server" })) : w(k.dom, "ln-store:synced", {
        store: k._name,
        added: v.length,
        deleted: C.length,
        changed: I
      });
    }).catch((M) => {
      k.isSyncing = !1, console.error("[ln-data-store] applySync failed:", M);
    });
  }, x.prototype.confirmMutation = function(v, C, L) {
    const k = this, I = {
      create: () => E(k._name, v).then(() => S(k._name, C)).then(() => {
        delete k._pendingSnapshots[v], w(k.dom, "ln-store:confirmed", { store: k._name, record: C, tempId: v, action: "create" });
      }),
      update: () => S(k._name, C).then(() => {
        delete k._pendingSnapshots[v], w(k.dom, "ln-store:confirmed", { store: k._name, record: C, action: "update" });
      }),
      delete: () => (delete k._pendingSnapshots[v], w(k.dom, "ln-store:confirmed", { store: k._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete k._pendingSnapshots[v], w(k.dom, "ln-store:confirmed", { store: k._name, record: null, ids: v.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return I[L] ? I[L]() : Promise.resolve();
  }, x.prototype.revertMutation = function(v, C, L) {
    const k = this, I = L || `Server rejected ${C}`, q = {
      create: () => E(k._name, v).then(() => {
        k.totalCount--, delete k._pendingSnapshots[v], w(k.dom, "ln-store:reverted", { store: k._name, record: null, action: "create", error: I });
      }),
      update: () => {
        const M = k._pendingSnapshots[v];
        return M ? S(k._name, M).then(() => {
          delete k._pendingSnapshots[v], w(k.dom, "ln-store:reverted", { store: k._name, record: M, action: "update", error: I });
        }) : Promise.resolve();
      },
      delete: () => {
        const M = k._pendingSnapshots[v];
        return M ? S(k._name, M).then(() => {
          k.totalCount++, delete k._pendingSnapshots[v], w(k.dom, "ln-store:reverted", { store: k._name, record: M, action: "delete", error: I });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const M = k._pendingSnapshots[v];
        return !M || !M.length ? Promise.resolve() : at(k._name, M).then(() => {
          k.totalCount += M.length, delete k._pendingSnapshots[v], w(k.dom, "ln-store:reverted", { store: k._name, record: null, ids: v.split(","), action: "bulk-delete", error: I });
        });
      }
    };
    return q[C] ? q[C]() : Promise.resolve();
  }, x.prototype.resolveConflict = function(v, C, L) {
    const k = this._pendingSnapshots[v];
    return k ? S(this._name, k).then(() => {
      delete this._pendingSnapshots[v], w(this.dom, "ln-store:conflict", {
        store: this._name,
        local: k,
        remote: C,
        field_diffs: L || null
      });
    }) : Promise.resolve();
  }, x.prototype.forceSync = function() {
    $(this);
  }, x.prototype.fullReload = function() {
    const v = this;
    return A(v._name).then(() => {
      v.isLoaded = !1, v.lastSyncedAt = null, v.totalCount = 0, $(v);
    });
  }, x.prototype.destroy = function() {
    if (this._handlers) {
      for (const [v, C] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${v}`, C);
      this._handlers = null;
    }
    delete o[this._name], Object.keys(o).length === 0 && P && (document.removeEventListener("visibilitychange", P), P = null), delete this.dom[u], w(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function ut() {
    return s().then((v) => {
      if (!v) return;
      const C = Array.from(v.objectStoreNames);
      return new Promise((L, k) => {
        const I = v.transaction(C, "readwrite");
        C.forEach((q) => I.objectStore(q).clear()), I.oncomplete = () => L(), I.onerror = () => k(I.error);
      });
    }).then(() => {
      Object.values(o).forEach((v) => {
        v.isLoaded = !1, v.isSyncing = !1, v.lastSyncedAt = null, v.totalCount = 0;
      });
    });
  }
  N(p, u, x, "ln-data-store"), window[u].clearAll = ut, window[u].init = window[u], window[u].setStorageKey = Ct, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Ct);
})();
(function() {
  const p = "data-ln-api-connector", u = "lnApiConnector", y = "lnConnector";
  if (window[u] !== void 0) return;
  function m(n) {
    return this.dom = n, n[u] = this, n[y] = this, this.refreshConfig(), this._handlers = null, _(this), this;
  }
  m.prototype.refreshConfig = function() {
    const n = this.dom;
    this.baseUrl = n.getAttribute("data-ln-api-base-url") || "", this.path = n.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const o = n.getAttribute("data-ln-api-headers") || "";
    this.headers = Dt(o, "ln-api-connector"), (o.toLowerCase().includes("authorization") || o.toLowerCase().includes("bearer") || o.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), w(n, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, m.prototype.fetchDelta = function(n) {
    const o = this;
    let t = z(o.baseUrl, o.path);
    return n != null && n !== "" && (t += (t.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n)), window.fetch(t, { method: "GET", headers: V(o.headers), credentials: o.credentials }).then((l) => {
      if (!l.ok) throw new Error("HTTP " + l.status + ": " + l.statusText);
      return l.json();
    });
  }, m.prototype.create = function(n) {
    const o = this;
    return window.fetch(z(o.baseUrl, o.path), {
      method: "POST",
      headers: V(o.headers),
      credentials: o.credentials,
      body: JSON.stringify(n)
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, m.prototype.update = function(n, o) {
    const t = this;
    return window.fetch(z(t.baseUrl, t.path, n), {
      method: "PUT",
      headers: V(t.headers),
      credentials: t.credentials,
      body: JSON.stringify(o)
    }).then((l) => {
      if (l.ok) return l.json();
      if (l.status === 409) return l.json().then((e) => {
        const r = new Error("Conflict");
        throw r.status = 409, r.data = e, r;
      });
      throw new Error("HTTP " + l.status + ": " + l.statusText);
    });
  }, m.prototype.delete = function(n) {
    const o = this;
    return window.fetch(z(o.baseUrl, o.path, n), {
      method: "DELETE",
      headers: V(o.headers),
      credentials: o.credentials
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, m.prototype.bulkDelete = function(n) {
    const o = this;
    return window.fetch(z(o.baseUrl, o.path) + "/bulk-delete", {
      method: "DELETE",
      headers: V(o.headers),
      credentials: o.credentials,
      body: JSON.stringify({ ids: n })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  };
  function _(n) {
    n._handlers = {
      sync: function(t) {
        const l = t.detail || {};
        n.fetchDelta(l.since).then(function(e) {
          w(n.dom, "ln-api-connector:fetched", { data: e, since: l.since });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: l.since
          });
        });
      },
      create: function(t) {
        const l = t.detail || {};
        n.create(l.data).then(function(e) {
          w(n.dom, "ln-api-connector:created", { record: e, tempId: l.tempId });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: l.tempId
          });
        });
      },
      update: function(t) {
        const l = t.detail || {}, e = Object.assign({}, l.data);
        l.expected_version !== void 0 && (e.expected_version = l.expected_version), n.update(l.id, e).then(function(r) {
          w(n.dom, "ln-api-connector:updated", { record: r, id: l.id });
        }).catch(function(r) {
          w(n.dom, "ln-api-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            id: l.id,
            conflictData: r.status === 409 ? r.data : null
          });
        });
      },
      delete: function(t) {
        const l = t.detail || {};
        n.delete(l.id).then(function(e) {
          w(n.dom, "ln-api-connector:deleted", { response: e, id: l.id });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: l.id
          });
        });
      },
      bulkDelete: function(t) {
        const l = t.detail || {};
        n.bulkDelete(l.ids).then(function(e) {
          w(n.dom, "ln-api-connector:bulk-deleted", { response: e, ids: l.ids });
        }).catch(function(e) {
          w(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: l.ids
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.addEventListener(t + ":request-sync", n._handlers.sync), n.dom.addEventListener(t + ":request-fetch", n._handlers.sync), n.dom.addEventListener(t + ":request-create", n._handlers.create), n.dom.addEventListener(t + ":request-update", n._handlers.update), n.dom.addEventListener(t + ":request-delete", n._handlers.delete), n.dom.addEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    const n = this;
    n._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), w(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[u], delete this.dom[y];
  };
  function b(n) {
    const o = n[u];
    o && o.refreshConfig();
  }
  N(p, u, m, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: b
  });
})();
(function() {
  const p = "data-ln-couchdb-connector", u = "lnCouchDbConnector", y = "lnConnector";
  if (window[u] !== void 0) return;
  function m(n) {
    return this.dom = n, n[u] = this, n[y] = this, this.refreshConfig(), this._handlers = null, _(this), this;
  }
  m.prototype.refreshConfig = function() {
    const n = this.dom;
    this.url = n.getAttribute("data-ln-couchdb-url") || "", this.db = n.getAttribute("data-ln-couchdb-db") || "", this.auth = n.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const o = n.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Dt(o, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), o.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), w(n, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, m.prototype.fetchDelta = function(n) {
    const o = this, t = ["include_docs=true", "feed=normal"];
    n && t.push("since=" + encodeURIComponent(n));
    const l = z(o.url, o.db, "_changes") + "?" + t.join("&");
    return window.fetch(l, { method: "GET", headers: V(o.headers, o.auth), credentials: o.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const r = e.results || [];
      return {
        data: r.filter((d) => !d.deleted && d.doc).map((d) => Object.assign({}, d.doc, { id: d.doc._id })),
        deleted: r.filter((d) => d.deleted).map((d) => d.id),
        synced_at: e.last_seq || n || ""
      };
    });
  }, m.prototype.create = function(n) {
    const o = this, t = Object.assign({ _id: n.id }, n);
    return t._id || delete t._id, window.fetch(z(o.url, o.db), {
      method: "POST",
      headers: V(o.headers, o.auth),
      credentials: o.credentials,
      body: JSON.stringify(t)
    }).then((l) => {
      if (!l.ok) throw new Error("HTTP " + l.status + ": " + l.statusText);
      return l.json();
    }).then((l) => Object.assign({}, t, { id: l.id, _id: l.id, _rev: l.rev }));
  }, m.prototype.update = function(n, o) {
    const t = this, l = Object.assign({ id: String(n), _id: String(n) }, o), e = l._rev || l.rev;
    return (e ? Promise.resolve(e) : window.fetch(z(t.url, t.db, null, n), { method: "GET", headers: V(t.headers, t.auth), credentials: t.credentials }).then((d) => {
      if (!d.ok) throw new Error("Could not retrieve document for revision mapping");
      return d.json().then((s) => s._rev);
    })).then((d) => {
      const s = Object.assign({}, l, { _rev: d });
      delete s.rev;
      const i = Object.assign(V(t.headers, t.auth), { "If-Match": d });
      return window.fetch(z(t.url, t.db, null, n), {
        method: "PUT",
        headers: i,
        credentials: t.credentials,
        body: JSON.stringify(s)
      }).then((c) => {
        if (c.ok) return c.json().then((h) => Object.assign({}, s, { _rev: h.rev }));
        if (c.status === 409) return c.json().then((h) => {
          const a = new Error("Conflict");
          throw a.status = 409, a.data = h, a;
        });
        throw new Error("HTTP " + c.status + ": " + c.statusText);
      });
    });
  }, m.prototype.delete = function(n, o) {
    const t = this;
    return (o ? Promise.resolve(o) : window.fetch(z(t.url, t.db, null, n), { method: "GET", headers: V(t.headers, t.auth), credentials: t.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((r) => r._rev);
    })).then((e) => {
      const r = z(t.url, t.db, null, n) + "?rev=" + encodeURIComponent(e);
      return window.fetch(r, { method: "DELETE", headers: V(t.headers, t.auth), credentials: t.credentials }).then((d) => {
        if (!d.ok) throw new Error("HTTP " + d.status + ": " + d.statusText);
        return d.json();
      });
    });
  }, m.prototype.bulkDelete = function(n) {
    const o = this;
    return !n || n.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch(z(o.url, o.db, "_all_docs"), {
      method: "POST",
      headers: V(o.headers, o.auth),
      credentials: o.credentials,
      body: JSON.stringify({ keys: n })
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const e = (t.rows || []).filter((r) => !r.error && r.value && r.value.rev).map((r) => ({ _id: r.id, _rev: r.value.rev, _deleted: !0 }));
      return e.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(z(o.url, o.db, "_bulk_docs"), {
        method: "POST",
        headers: V(o.headers, o.auth),
        credentials: o.credentials,
        body: JSON.stringify({ docs: e })
      }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
        return r.json();
      }).then((r) => ({ ok: !0, results: r, deletedCount: e.length }));
    });
  };
  function _(n) {
    n._handlers = {
      sync: function(t) {
        const l = t.detail || {};
        n.fetchDelta(l.since).then(function(e) {
          w(n.dom, "ln-couchdb-connector:fetched", { data: e, since: l.since });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: e.message,
            status: e.status || 0,
            since: l.since
          });
        });
      },
      create: function(t) {
        const l = t.detail || {};
        n.create(l.data).then(function(e) {
          w(n.dom, "ln-couchdb-connector:created", { record: e, tempId: l.tempId });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: l.tempId
          });
        });
      },
      update: function(t) {
        const l = t.detail || {}, e = Object.assign({}, l.data);
        l.expected_version !== void 0 && (e._rev = l.expected_version), n.update(l.id, e).then(function(r) {
          w(n.dom, "ln-couchdb-connector:updated", { record: r, id: l.id });
        }).catch(function(r) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            id: l.id,
            conflictData: r.status === 409 ? r.data : null
          });
        });
      },
      delete: function(t) {
        const l = t.detail || {};
        n.delete(l.id, l.rev).then(function(e) {
          w(n.dom, "ln-couchdb-connector:deleted", { response: e, id: l.id });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: e.message,
            status: e.status || 0,
            id: l.id
          });
        });
      },
      bulkDelete: function(t) {
        const l = t.detail || {};
        n.bulkDelete(l.ids).then(function(e) {
          w(n.dom, "ln-couchdb-connector:bulk-deleted", { response: e, ids: l.ids });
        }).catch(function(e) {
          w(n.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: e.message,
            status: e.status || 0,
            ids: l.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.addEventListener(t + ":request-sync", n._handlers.sync), n.dom.addEventListener(t + ":request-fetch", n._handlers.sync), n.dom.addEventListener(t + ":request-create", n._handlers.create), n.dom.addEventListener(t + ":request-update", n._handlers.update), n.dom.addEventListener(t + ":request-delete", n._handlers.delete), n.dom.addEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    const n = this;
    n._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), w(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[u], delete this.dom[y];
  };
  function b(n) {
    const o = n[u];
    o && o.refreshConfig();
  }
  N(p, u, m, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: b
  });
})();
(function() {
  const p = "data-ln-data-coordinator", u = "lnDataCoordinator", y = "lnCoordinator";
  if (window[u] !== void 0) return;
  function m(n) {
    return this.dom = n, this._name = n.getAttribute(p), n[u] = this, n[y] = this, this.mapper = null, this._handlers = null, this.refreshMapper(), _(this), this;
  }
  m.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const o = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    o && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(o)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(t) {
      return t;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(t) {
      return t;
    });
  }, m.prototype.findChildren = function() {
    const n = this.dom.querySelector("[data-ln-data-store]"), o = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]");
    return {
      storeEl: n,
      connectorEl: o,
      store: n ? n.lnDataStore || n.lnStore : null,
      connector: o ? o.lnConnector || o.lnApiConnector || o.lnCouchDbConnector : null
    };
  };
  function _(n) {
    n._handlers = {
      sync: function(o) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        const l = o.detail.since;
        t.connector.fetchDelta(l).then(function(e) {
          let r = [], d = [], s = null;
          e && Array.isArray(e) ? (r = e, s = Math.floor(Date.now() / 1e3)) : e && (r = Array.isArray(e.data) ? e.data : [], d = Array.isArray(e.deleted) ? e.deleted : [], s = e.synced_at !== void 0 ? e.synced_at : e.since !== void 0 ? e.since : null);
          const i = r.map((c) => n.mapper.ingress(c));
          t.store.applySync(i, d, s);
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Sync failed:", e);
        });
      },
      create: function(o) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const l = o.detail.tempId, e = o.detail.data || {}, r = n.mapper.egress(e);
        t.connector.create(r).then(function(d) {
          const s = n.mapper.ingress(d);
          t.store.confirmMutation(l, s, "create");
        }).catch(function(d) {
          console.error("[ln-data-coordinator] Create mutation failed:", d), t.store.revertMutation(l, "create", d.message || d);
        });
      },
      update: function(o) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const l = o.detail.id, e = o.detail.expected_version;
        t.store.getById(l).then(function(r) {
          if (!r) throw new Error("Record not found in cache store: " + l);
          const d = Object.assign({}, r);
          delete d._pending;
          const s = n.mapper.egress(d);
          return t.connector.update(l, s, e);
        }).then(function(r) {
          const d = n.mapper.ingress(r);
          t.store.confirmMutation(l, d, "update");
        }).catch(function(r) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", r), r.status === 409) {
            const d = r.data && r.data.remote ? n.mapper.ingress(r.data.remote) : null, s = r.data ? r.data.field_diffs : null;
            t.store.resolveConflict(l, d, s);
          } else
            t.store.revertMutation(l, "update", r.message || r);
        });
      },
      delete: function(o) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const l = o.detail.id;
        t.connector.delete(l).then(function() {
          t.store.confirmMutation(l, null, "delete");
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Delete mutation failed:", e), t.store.revertMutation(l, "delete", e.message || e);
        });
      },
      bulkDelete: function(o) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const l = o.detail.ids || [], e = l.join(",");
        t.connector.bulkDelete(l).then(function() {
          t.store.confirmMutation(e, null, "bulk-delete");
        }).catch(function(r) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", r), t.store.revertMutation(e, "bulk-delete", r.message || r);
        });
      }
    }, n.dom.addEventListener("ln-store:request-remote-sync", n._handlers.sync), n.dom.addEventListener("ln-store:request-remote-create", n._handlers.create), n.dom.addEventListener("ln-store:request-remote-update", n._handlers.update), n.dom.addEventListener("ln-store:request-remote-delete", n._handlers.delete), n.dom.addEventListener("ln-store:request-remote-bulk-delete", n._handlers.bulkDelete);
  }
  m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    const n = this;
    n._handlers && (n.dom.removeEventListener("ln-store:request-remote-sync", n._handlers.sync), n.dom.removeEventListener("ln-store:request-remote-create", n._handlers.create), n.dom.removeEventListener("ln-store:request-remote-update", n._handlers.update), n.dom.removeEventListener("ln-store:request-remote-delete", n._handlers.delete), n.dom.removeEventListener("ln-store:request-remote-bulk-delete", n._handlers.bulkDelete), n._handlers = null), delete this.dom[u], delete this.dom[y];
  };
  function b(n, o) {
    const t = n[u];
    t && o === "data-ln-data-mapper" && t.refreshMapper();
  }
  N(p, u, m, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: b
  });
})();
(function() {
  const p = "ln-icons-sprite", u = "#ln-", y = "#lnc-", m = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let b = null;
  const n = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), o = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", l = "lni:v", e = "1";
  function r() {
    try {
      if (localStorage.getItem(l) !== e) {
        for (let f = localStorage.length - 1; f >= 0; f--) {
          const g = localStorage.key(f);
          g && g.indexOf(t) === 0 && localStorage.removeItem(g);
        }
        localStorage.setItem(l, e);
      }
    } catch {
    }
  }
  r();
  function d() {
    return b || (b = document.getElementById(p), b || (b = document.createElementNS("http://www.w3.org/2000/svg", "svg"), b.id = p, b.setAttribute("hidden", ""), b.setAttribute("aria-hidden", "true"), b.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(b, document.body.firstChild))), b;
  }
  function s(f) {
    return f.indexOf(y) === 0 ? o + "/" + f.slice(y.length) + ".svg" : n + "/" + f.slice(u.length) + ".svg";
  }
  function i(f, g) {
    const S = g.match(/viewBox="([^"]+)"/), E = S ? S[1] : "0 0 24 24", A = g.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = A ? A[1].trim() : "", D = g.match(/<svg([^>]*)>/i), O = D ? D[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = f, x.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(F) {
      const B = O.match(new RegExp(F + '="([^"]*)"'));
      B && x.setAttribute(F, B[1]);
    }), x.innerHTML = T, d().querySelector("defs").appendChild(x);
  }
  function c(f) {
    if (m.has(f) || _.has(f) || f.indexOf(y) === 0 && !o) return;
    const g = f.slice(1);
    try {
      const S = localStorage.getItem(t + g);
      if (S) {
        i(g, S), m.add(f);
        return;
      }
    } catch {
    }
    _.add(f), fetch(s(f)).then(function(S) {
      if (!S.ok) throw new Error(S.status);
      return S.text();
    }).then(function(S) {
      i(g, S), m.add(f), _.delete(f);
      try {
        localStorage.setItem(t + g, S);
      } catch {
      }
    }).catch(function() {
      _.delete(f);
    });
  }
  function h(f) {
    const g = 'use[href^="' + u + '"], use[href^="' + y + '"]', S = f.querySelectorAll ? f.querySelectorAll(g) : [];
    if (f.matches && f.matches(g)) {
      const E = f.getAttribute("href");
      E && c(E);
    }
    Array.prototype.forEach.call(S, function(E) {
      const A = E.getAttribute("href");
      A && c(A);
    });
  }
  function a() {
    h(document), new MutationObserver(function(f) {
      f.forEach(function(g) {
        if (g.type === "childList")
          g.addedNodes.forEach(function(S) {
            S.nodeType === 1 && h(S);
          });
        else if (g.type === "attributes" && g.attributeName === "href") {
          const S = g.target.getAttribute("href");
          S && (S.indexOf(u) === 0 || S.indexOf(y) === 0) && c(S);
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
