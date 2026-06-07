const vt = {};
function Et(h, u) {
  vt[h] || (vt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const y = vt[h];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (u || "ln-core") + '] Template "' + h + '" not found'), null);
}
function S(h, u, y) {
  h.dispatchEvent(new CustomEvent(u, {
    bubbles: !0,
    detail: y || {}
  }));
}
function V(h, u, y) {
  const m = new CustomEvent(u, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return h.dispatchEvent(m), m;
}
function et(h, u) {
  if (!h || !u) return h;
  const y = h.querySelectorAll("[data-ln-field]");
  for (let t = 0; t < y.length; t++) {
    const s = y[t], n = s.getAttribute("data-ln-field");
    u[n] != null && (s.textContent = u[n]);
  }
  const m = h.querySelectorAll("[data-ln-attr]");
  for (let t = 0; t < m.length; t++) {
    const s = m[t], n = s.getAttribute("data-ln-attr").split(",");
    for (let c = 0; c < n.length; c++) {
      const o = n[c].trim().split(":");
      if (o.length !== 2) continue;
      const i = o[0].trim(), d = o[1].trim();
      u[d] != null && s.setAttribute(i, u[d]);
    }
  }
  const _ = h.querySelectorAll("[data-ln-show]");
  for (let t = 0; t < _.length; t++) {
    const s = _[t], n = s.getAttribute("data-ln-show");
    n in u && s.classList.toggle("hidden", !u[n]);
  }
  const b = h.querySelectorAll("[data-ln-class]");
  for (let t = 0; t < b.length; t++) {
    const s = b[t], n = s.getAttribute("data-ln-class").split(",");
    for (let c = 0; c < n.length; c++) {
      const o = n[c].trim().split(":");
      if (o.length !== 2) continue;
      const i = o[0].trim(), d = o[1].trim();
      d in u && s.classList.toggle(i, !!u[d]);
    }
  }
  return h;
}
function Lt(h, u) {
  if (!h || !u) return h;
  const y = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const m = y.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(_, b) {
        return u[b] !== void 0 ? u[b] : "";
      }
    ));
  }
  return h;
}
function G(h, u) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      G(h, u);
    }), console.warn("[" + u + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function ot(h, u, y) {
  if (h) {
    const m = h.querySelector('[data-ln-template="' + u + '"]');
    if (m) return m.content.cloneNode(!0);
  }
  return Et(u, y);
}
function qt(h, u) {
  const y = {}, m = h.querySelectorAll("[" + u + "]");
  for (let _ = 0; _ < m.length; _++)
    y[m[_].getAttribute(u)] = m[_].textContent, m[_].remove();
  return y;
}
function yt(h, u, y, m) {
  if (h.nodeType !== 1) return;
  const b = u.indexOf("[") !== -1 || u.indexOf(".") !== -1 || u.indexOf("#") !== -1 ? u : "[" + u + "]", t = Array.from(h.querySelectorAll(b));
  h.matches && h.matches(b) && t.push(h);
  for (const s of t)
    s[y] || (s[y] = new m(s));
}
function pt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function Ct(h) {
  const u = {}, y = h.elements;
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
function Tt(h, u) {
  const y = h.elements, m = [];
  for (let _ = 0; _ < y.length; _++) {
    const b = y[_];
    if (!b.name || !(b.name in u) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
    const t = u[b.name];
    if (b.type === "checkbox")
      b.checked = Array.isArray(t) ? t.indexOf(b.value) !== -1 : !!t, m.push(b);
    else if (b.type === "radio")
      b.checked = b.value === String(t), m.push(b);
    else if (b.type === "select-multiple") {
      if (Array.isArray(t))
        for (let s = 0; s < b.options.length; s++)
          b.options[s].selected = t.indexOf(b.options[s].value) !== -1;
      m.push(b);
    } else
      b.value = t, m.push(b);
  }
  return m;
}
function J(h) {
  const u = h.closest("[lang]");
  return (u ? u.lang : null) || navigator.language;
}
function kt(h, u, { get: y, set: m }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return y ? y.call(this) : u.get.call(this);
    },
    set: function(_) {
      m ? m.call(this, _, (b) => u.set.call(this, b)) : u.set.call(this, _);
    },
    configurable: !0
  });
}
function B(h, u, y, m, _ = {}) {
  const b = _.extraAttributes || [], t = _.onAttributeChange || null, s = _.onInit || null;
  function n(c) {
    const o = c || document.body;
    yt(o, h, u, y), s && s(o);
  }
  return G(function() {
    const c = new MutationObserver(function(i) {
      for (let d = 0; d < i.length; d++) {
        const r = i[d];
        if (r.type === "childList") {
          for (let e = 0; e < r.addedNodes.length; e++) {
            const l = r.addedNodes[e];
            l.nodeType === 1 && (yt(l, h, u, y), s && s(l));
          }
          for (let e = 0; e < r.removedNodes.length; e++) {
            const l = r.removedNodes[e];
            if (l.nodeType === 1) {
              const a = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", p = Array.from(l.querySelectorAll(a));
              l.matches && l.matches(a) && p.push(l);
              for (let g = 0; g < p.length; g++) {
                const A = p[g];
                if (!document.contains(A)) {
                  const E = A[u];
                  E && typeof E.destroy == "function" && E.destroy();
                }
              }
            }
          }
        } else r.type === "attributes" && (t && r.target[u] ? t(r.target, r.attributeName) : (yt(r.target, h, u, y), s && s(r.target)));
      }
    });
    let o = [];
    if (h.indexOf("[") !== -1) {
      const i = /\[([\w-]+)/g;
      let d;
      for (; (d = i.exec(h)) !== null; )
        o.push(d[1]);
    } else
      o.push(h);
    c.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: o.concat(b)
    });
  }, m || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[u] = n, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    n(document.body);
  }) : n(document.body), n;
}
function z(...h) {
  return h.filter((u) => u != null && u !== "").map((u, y) => y === 0 ? u.replace(/\/+$/, "") : u.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function K(h, u) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, u ? { Authorization: u } : null);
}
function xt(h, u = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (y) {
    return console.error(`[${u}] Invalid headers JSON:`, y), {};
  }
}
const Ot = {};
function Mt(h, u) {
  Ot[h] = u;
}
function Nt(h) {
  return Ot[h] || { ingress: (u) => u, egress: (u) => u };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Mt, window.lnCore.getDataMapper = Nt);
function Ft(h, u) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, h(), u && u();
    }));
  };
}
const Bt = "ln:";
function Pt() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Dt(h, u) {
  const y = u.getAttribute("data-ln-persist"), m = y !== null && y !== "" ? y : u.id;
  return m ? Bt + h + ":" + Pt() + ":" + m : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', u), null);
}
function _t(h, u) {
  const y = Dt(h, u);
  if (!y) return null;
  try {
    const m = localStorage.getItem(y);
    return m !== null ? JSON.parse(m) : null;
  } catch {
    return null;
  }
}
function st(h, u, y) {
  const m = Dt(h, u);
  if (m)
    try {
      localStorage.setItem(m, JSON.stringify(y));
    } catch {
    }
}
function gt(h, u, y, m) {
  const _ = typeof m == "number" ? m : 4, b = window.innerWidth, t = window.innerHeight, s = u.width, n = u.height, c = (y || "bottom").split("-"), o = c[0], i = c[1] === "start" || c[1] === "end" ? c[1] : "center", d = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, r = d[o] || d.bottom;
  function e(g) {
    return g === "top" || g === "bottom" ? i === "start" ? h.left : i === "end" ? h.right - s : h.left + (h.width - s) / 2 : i === "start" ? h.top : i === "end" ? h.bottom - n : h.top + (h.height - n) / 2;
  }
  function l(g) {
    let A, E, w = !0;
    return g === "top" ? (A = h.top - _ - n, E = e(g), A < 0 && (w = !1)) : g === "bottom" ? (A = h.bottom + _, E = e(g), A + n > t && (w = !1)) : g === "left" ? (A = e(g), E = h.left - _ - s, E < 0 && (w = !1)) : (A = e(g), E = h.right + _, E + s > b && (w = !1)), { top: A, left: E, side: g, fits: w };
  }
  let f = null;
  for (let g = 0; g < r.length; g++) {
    const A = l(r[g]);
    if (A.fits) {
      f = A;
      break;
    }
  }
  f || (f = l(r[0]));
  let a = f.top, p = f.left;
  return s >= b ? p = 0 : (p < 0 && (p = 0), p + s > b && (p = b - s)), n >= t ? a = 0 : (a < 0 && (a = 0), a + n > t && (a = t - n)), { top: a, left: p, placement: f.side };
}
function It(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const u = h.parentNode, y = document.createComment("ln-teleport");
  return u.insertBefore(y, h), document.body.appendChild(h), function() {
    y.parentNode && (y.parentNode.insertBefore(h, y), y.parentNode.removeChild(y));
  };
}
function At(h) {
  if (!h) return { width: 0, height: 0 };
  const u = h.style, y = u.visibility, m = u.display, _ = u.position;
  u.visibility = "hidden", u.display = "block", u.position = "fixed";
  const b = h.offsetWidth, t = h.offsetHeight;
  return u.visibility = y, u.display = m, u.position = _, { width: b, height: t };
}
let it = null;
async function St(h) {
  if (!h) {
    it = null;
    return;
  }
  try {
    const u = new TextEncoder(), y = await crypto.subtle.digest("SHA-256", u.encode(h));
    it = await crypto.subtle.importKey(
      "raw",
      y,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (u) {
    console.error("[ln-core/crypto] Key derivation failed:", u), it = null;
  }
}
function ft() {
  return it;
}
async function Ht(h, u = it) {
  const y = u || it;
  if (!y || h === void 0 || h === null) return h;
  try {
    const m = new TextEncoder(), _ = crypto.getRandomValues(new Uint8Array(12)), b = typeof h == "string" ? h : JSON.stringify(h), t = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: _ },
      y,
      m.encode(b)
    ), s = btoa(String.fromCharCode(..._)), n = btoa(String.fromCharCode(...new Uint8Array(t)));
    return {
      encrypted: !0,
      iv: s,
      data: n
    };
  } catch (m) {
    return console.error("[ln-core/crypto] Encryption failed:", m), h;
  }
}
async function Ut(h, u = it) {
  const y = u || it;
  if (!h || !h.encrypted || !y) return h;
  try {
    const m = new TextDecoder(), _ = Uint8Array.from(atob(h.iv), (n) => n.charCodeAt(0)), b = Uint8Array.from(atob(h.data), (n) => n.charCodeAt(0)), t = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _ },
      y,
      b
    ), s = m.decode(t);
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
  const h = window.fetch.bind(window), u = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function m(c) {
    return typeof c == "string" ? c : c instanceof URL ? c.href : c instanceof Request ? c.url : String(c);
  }
  function _(c, o) {
    return o && o.method ? String(o.method).toUpperCase() : c instanceof Request ? c.method.toUpperCase() : "GET";
  }
  function b(c, o) {
    return o + " " + c;
  }
  function t(c) {
    return c === "GET" || c === "HEAD";
  }
  function s(c, o) {
    o = o || {};
    const i = m(c), d = _(c, o), r = b(i, d);
    t(d) && u.has(r) && (u.get(r).abort(), u.delete(r));
    const e = new AbortController(), l = o.signal;
    l && (l.aborted ? e.abort(l.reason) : l.addEventListener("abort", function() {
      e.abort(l.reason);
    }, { once: !0 }));
    const f = Object.assign({}, o, { signal: e.signal });
    return u.set(r, e), h(c, f).finally(function() {
      u.get(r) === e && u.delete(r);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function n(c) {
    const o = c.detail || {};
    if (!o.url) return;
    const i = c.target, d = (o.method || (o.body ? "POST" : "GET")).toUpperCase(), r = o.key;
    r && y.has(r) && (y.get(r).abort(), y.delete(r));
    const e = new AbortController(), l = o.signal;
    l && (l.aborted ? e.abort(l.reason) : l.addEventListener("abort", function() {
      e.abort(l.reason);
    }, { once: !0 })), r && y.set(r, e);
    const f = { method: d, signal: e.signal };
    o.body !== void 0 && (f.body = o.body), window.fetch(o.url, f).then(function(a) {
      r && y.get(r) === e && y.delete(r), S(i, "ln-http:response", {
        ok: a.ok,
        status: a.status,
        response: a
      });
    }).catch(function(a) {
      r && y.get(r) === e && y.delete(r), !(a && a.name === "AbortError") && S(i, "ln-http:error", {
        ok: !1,
        status: 0,
        error: a
      });
    });
  }
  document.addEventListener("ln-http:request", n), window.lnHttp = {
    cancel: function(c) {
      let o = !1;
      return u.forEach(function(i, d) {
        d.endsWith(" " + c) && (i.abort(), u.delete(d), o = !0);
      }), o;
    },
    cancelByKey: function(c) {
      return y.has(c) ? (y.get(c).abort(), y.delete(c), !0) : !1;
    },
    cancelAll: function() {
      u.forEach(function(c) {
        c.abort();
      }), u.clear(), y.forEach(function(c) {
        c.abort();
      }), y.clear();
    },
    get inflight() {
      const c = [];
      return u.forEach(function(o, i) {
        const d = i.indexOf(" ");
        c.push({ method: i.slice(0, d), url: i.slice(d + 1) });
      }), y.forEach(function(o, i) {
        c.push({ key: i });
      }), c;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", n), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", u = "lnAjax";
  if (window[u] !== void 0) return;
  function y(o) {
    if (!o.hasAttribute(h) || o[u]) return;
    o[u] = !0;
    const i = s(o);
    m(i.links), _(i.forms);
  }
  function m(o) {
    for (const i of o) {
      if (i[u + "Trigger"] || i.hostname && i.hostname !== window.location.hostname) continue;
      const d = i.getAttribute("href");
      if (d && d.includes("#")) continue;
      const r = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const l = i.getAttribute("href");
        l && t("GET", l, null, i);
      };
      i.addEventListener("click", r), i[u + "Trigger"] = r;
    }
  }
  function _(o) {
    for (const i of o) {
      if (i[u + "Trigger"]) continue;
      const d = function(r) {
        r.preventDefault();
        const e = i.method.toUpperCase(), l = i.action, f = new FormData(i);
        for (const a of i.querySelectorAll('button, input[type="submit"]'))
          a.disabled = !0;
        t(e, l, f, i, function() {
          for (const a of i.querySelectorAll('button, input[type="submit"]'))
            a.disabled = !1;
        });
      };
      i.addEventListener("submit", d), i[u + "Trigger"] = d;
    }
  }
  function b(o) {
    if (!o[u]) return;
    const i = s(o);
    for (const d of i.links)
      d[u + "Trigger"] && (d.removeEventListener("click", d[u + "Trigger"]), delete d[u + "Trigger"]);
    for (const d of i.forms)
      d[u + "Trigger"] && (d.removeEventListener("submit", d[u + "Trigger"]), delete d[u + "Trigger"]);
    delete o[u];
  }
  function t(o, i, d, r, e) {
    if (V(r, "ln-ajax:before-start", { method: o, url: i }).defaultPrevented) return;
    S(r, "ln-ajax:start", { method: o, url: i }), r.classList.add("ln-ajax--loading");
    const f = document.createElement("span");
    f.className = "ln-ajax-spinner", r.appendChild(f);
    function a() {
      r.classList.remove("ln-ajax--loading");
      const w = r.querySelector(".ln-ajax-spinner");
      w && w.remove(), e && e();
    }
    let p = i;
    const g = document.querySelector('meta[name="csrf-token"]'), A = g ? g.getAttribute("content") : null;
    d instanceof FormData && A && d.append("_token", A);
    const E = {
      method: o,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (A && (E.headers["X-CSRF-TOKEN"] = A), o === "GET" && d) {
      const w = new URLSearchParams(d);
      p = i + (i.includes("?") ? "&" : "?") + w.toString();
    } else o !== "GET" && d && (E.body = d);
    fetch(p, E).then(function(w) {
      const T = w.ok;
      return w.json().then(function(x) {
        return { ok: T, status: w.status, data: x };
      });
    }).then(function(w) {
      const T = w.data;
      if (w.ok) {
        if (T.title && (document.title = T.title), T.content)
          for (const x in T.content) {
            const D = document.getElementById(x);
            if (D) {
              let O = T.content[x];
              window.DOMPurify && typeof window.DOMPurify.sanitize == "function" ? O = window.DOMPurify.sanitize(O) : O = O.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""), D.innerHTML = O;
            }
          }
        if (r.tagName === "A") {
          const x = r.getAttribute("href");
          x && window.history.pushState({ ajax: !0 }, "", x);
        } else r.tagName === "FORM" && r.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", p);
        S(r, "ln-ajax:success", { method: o, url: p, data: T });
      } else
        S(r, "ln-ajax:error", { method: o, url: p, status: w.status, data: T });
      if (T.message) {
        const x = T.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: x.type || (w.ok ? "success" : "error"),
            title: x.title || "",
            message: x.body || ""
          }
        }));
      }
      S(r, "ln-ajax:complete", { method: o, url: p }), a();
    }).catch(function(w) {
      S(r, "ln-ajax:error", { method: o, url: p, error: w }), S(r, "ln-ajax:complete", { method: o, url: p }), a();
    });
  }
  function s(o) {
    const i = { links: [], forms: [] };
    return o.tagName === "A" && o.getAttribute(h) !== "false" ? i.links.push(o) : o.tagName === "FORM" && o.getAttribute(h) !== "false" ? i.forms.push(o) : (i.links = Array.from(o.querySelectorAll('a:not([data-ln-ajax="false"])')), i.forms = Array.from(o.querySelectorAll('form:not([data-ln-ajax="false"])'))), i;
  }
  function n() {
    G(function() {
      new MutationObserver(function(i) {
        for (const d of i)
          if (d.type === "childList") {
            for (const r of d.addedNodes)
              if (r.nodeType === 1 && (y(r), !r.hasAttribute(h))) {
                for (const l of r.querySelectorAll("[" + h + "]"))
                  y(l);
                const e = r.closest && r.closest("[" + h + "]");
                if (e && e.getAttribute(h) !== "false") {
                  const l = s(r);
                  m(l.links), _(l.forms);
                }
              }
          } else d.type === "attributes" && y(d.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function c() {
    for (const o of document.querySelectorAll("[" + h + "]"))
      y(o);
  }
  window[u] = y, window[u].destroy = b, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const h = "data-ln-modal", u = "lnModal";
  if (window[u] !== void 0) return;
  function y(t) {
    const s = Array.from(t.querySelectorAll("[data-ln-modal-for]"));
    t.hasAttribute && t.hasAttribute("data-ln-modal-for") && s.push(t);
    for (const n of s) {
      if (n[u + "Trigger"]) continue;
      const c = function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        o.preventDefault();
        const i = n.getAttribute("data-ln-modal-for"), d = document.getElementById(i);
        if (!d) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + i + '"');
          return;
        }
        if (!d[u]) return;
        const r = d.getAttribute(h);
        d.setAttribute(h, r === "open" ? "close" : "open");
      };
      n.addEventListener("click", c), n[u + "Trigger"] = c;
    }
  }
  function m(t) {
    this.dom = t, this.isOpen = t.getAttribute(h) === "open";
    const s = this;
    return this._onEscape = function(n) {
      n.key === "Escape" && s.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(n) {
      if (n.key !== "Tab") return;
      const c = Array.prototype.filter.call(
        s.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        pt
      );
      if (c.length === 0) return;
      const o = c[0], i = c[c.length - 1];
      n.shiftKey ? document.activeElement === o && (n.preventDefault(), i.focus()) : document.activeElement === i && (n.preventDefault(), o.focus());
    }, this._onClose = function(n) {
      n.preventDefault(), s.dom.setAttribute(h, "close");
    }, b(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const t = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const n of t)
      n[u + "Close"] && (n.removeEventListener("click", n[u + "Close"]), delete n[u + "Close"]);
    const s = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const n of s)
      n[u + "Trigger"] && (n.removeEventListener("click", n[u + "Trigger"]), delete n[u + "Trigger"]);
    S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[u];
  };
  function _(t) {
    const s = t[u];
    if (!s) return;
    const c = t.getAttribute(h) === "open";
    if (c !== s.isOpen)
      if (c) {
        if (V(t, "ln-modal:before-open", { modalId: t.id, target: t }).defaultPrevented) {
          t.setAttribute(h, "close");
          return;
        }
        s.isOpen = !0, t.setAttribute("aria-modal", "true"), t.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", s._onEscape), document.addEventListener("keydown", s._onFocusTrap);
        const i = document.activeElement;
        s._returnFocusEl = i && i !== document.body ? i : null;
        const d = t.querySelector("[autofocus]");
        if (d && pt(d))
          d.focus();
        else {
          const r = t.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), e = Array.prototype.find.call(r, pt);
          if (e) e.focus();
          else {
            const l = t.querySelectorAll("a[href], button:not([disabled])"), f = Array.prototype.find.call(l, pt);
            f && f.focus();
          }
        }
        S(t, "ln-modal:open", { modalId: t.id, target: t });
      } else {
        if (V(t, "ln-modal:before-close", { modalId: t.id, target: t }).defaultPrevented) {
          t.setAttribute(h, "open");
          return;
        }
        s.isOpen = !1, t.removeAttribute("aria-modal"), document.removeEventListener("keydown", s._onEscape), document.removeEventListener("keydown", s._onFocusTrap), S(t, "ln-modal:close", { modalId: t.id, target: t }), s._returnFocusEl && document.contains(s._returnFocusEl) && typeof s._returnFocusEl.focus == "function" && s._returnFocusEl.focus(), s._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function b(t) {
    const s = t.dom.querySelectorAll("[data-ln-modal-close]");
    for (const n of s)
      n[u + "Close"] || (n.addEventListener("click", t._onClose), n[u + "Close"] = t._onClose);
  }
  B(h, u, m, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: _,
    onInit: y
  });
})();
(function() {
  const h = "data-ln-number", u = "lnNumber";
  if (window[u] !== void 0) return;
  const y = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(n) {
    if (!y[n]) {
      const c = new Intl.NumberFormat(n, { useGrouping: !0 }), o = c.formatToParts(1234.5);
      let i = "", d = ".";
      for (let r = 0; r < o.length; r++)
        o[r].type === "group" && (i = o[r].value), o[r].type === "decimal" && (d = o[r].value);
      y[n] = { fmt: c, groupSep: i, decimalSep: d };
    }
    return y[n];
  }
  function b(n, c, o) {
    if (o !== null) {
      const i = parseInt(o, 10), d = n + "|d" + i;
      return y[d] || (y[d] = new Intl.NumberFormat(n, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: i })), y[d].format(c);
    }
    return _(n).fmt.format(c);
  }
  function t(n) {
    if (n.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", n.tagName), this;
    if (n[u]) return n[u];
    n[u] = this, this.dom = n;
    const c = document.createElement("input");
    c.type = "hidden", c.name = n.name, n.removeAttribute("name"), n.type = "text", n.setAttribute("inputmode", "decimal"), n.insertAdjacentElement("afterend", c), this._hidden = c;
    const o = this;
    Object.defineProperty(c, "value", {
      get: function() {
        return m.get.call(c);
      },
      set: function(d) {
        if (m.set.call(c, d), d !== "" && !isNaN(parseFloat(d))) {
          const r = parseFloat(d);
          o._displayFormatted(r), S(o.dom, "ln-number:input", { value: r, formatted: o.dom.value }), o.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        } else d === "" && (o.dom.value = "", S(o.dom, "ln-number:input", { value: NaN, formatted: "" }), o.dom.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
    }), kt(n, m, {
      get: function() {
        return m.get.call(n);
      },
      set: function(d, r) {
        if (o._isFormatting) {
          r(d);
          return;
        }
        if (d === "") {
          r(""), o._setHiddenRaw(""), S(n, "ln-number:input", { value: NaN, formatted: "" }), n.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        let e = typeof d == "number" ? d : parseFloat(String(d).replace(/[^\d.-]/g, ""));
        if (isNaN(e))
          r(String(d)), o._setHiddenRaw(""), S(n, "ln-number:input", { value: NaN, formatted: String(d) }), n.dispatchEvent(new Event("input", { bubbles: !0 }));
        else {
          o._setHiddenRaw(e);
          const l = b(J(n), e, n.getAttribute("data-ln-number-decimals"));
          r(l), S(n, "ln-number:input", { value: e, formatted: l }), n.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    }), this._onInput = function() {
      o._handleInput();
    }, n.addEventListener("input", this._onInput), this._onPaste = function(d) {
      d.preventDefault();
      const r = (d.clipboardData || window.clipboardData).getData("text"), e = _(J(n)), l = e.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let f = r.replace(new RegExp("[^0-9\\-" + l + ".]", "g"), "");
      e.groupSep && (f = f.split(e.groupSep).join("")), e.decimalSep !== "." && (f = f.replace(e.decimalSep, "."));
      const a = parseFloat(f);
      isNaN(a) ? (n.value = "", o._hidden.value = "") : o.value = a;
    }, n.addEventListener("paste", this._onPaste);
    const i = n.value;
    if (i !== "") {
      const d = parseFloat(i);
      isNaN(d) || (this._displayFormatted(d), m.set.call(c, String(d)), S(n, "ln-number:input", { value: d, formatted: n.value }), n.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  t.prototype._handleInput = function() {
    const n = this.dom, c = _(J(n)), o = n.value;
    if (o === "") {
      this._hidden.value = "", S(n, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (o === "-") {
      this._hidden.value = "";
      return;
    }
    const i = n.selectionStart;
    let d = 0;
    for (let w = 0; w < i; w++)
      /[0-9]/.test(o[w]) && d++;
    let r = o;
    if (c.groupSep && (r = r.split(c.groupSep).join("")), r = r.replace(c.decimalSep, "."), o.endsWith(c.decimalSep) || o.endsWith(".")) {
      const w = r.replace(/\.$/, ""), T = parseFloat(w);
      isNaN(T) || this._setHiddenRaw(T);
      return;
    }
    const e = r.indexOf(".");
    if (e !== -1 && r.slice(e + 1).endsWith("0")) {
      const T = parseFloat(r);
      isNaN(T) || this._setHiddenRaw(T);
      return;
    }
    const l = n.getAttribute("data-ln-number-decimals");
    if (l !== null && e !== -1) {
      const w = parseInt(l, 10);
      r.slice(e + 1).length > w && (r = r.slice(0, e + 1 + w));
    }
    const f = parseFloat(r);
    if (isNaN(f)) return;
    const a = n.getAttribute("data-ln-number-min"), p = n.getAttribute("data-ln-number-max");
    if (a !== null && f < parseFloat(a) || p !== null && f > parseFloat(p)) return;
    let g;
    if (l !== null)
      g = b(J(n), f, l);
    else {
      const w = e !== -1 ? r.slice(e + 1).length : 0;
      if (w > 0) {
        const T = J(n) + "|u" + w;
        y[T] || (y[T] = new Intl.NumberFormat(J(n), { useGrouping: !0, minimumFractionDigits: w, maximumFractionDigits: w })), g = y[T].format(f);
      } else
        g = c.fmt.format(f);
    }
    n.value = g;
    let A = d, E = 0;
    for (let w = 0; w < g.length && A > 0; w++)
      E = w + 1, /[0-9]/.test(g[w]) && A--;
    A > 0 && (E = g.length), n.setSelectionRange(E, E), this._setHiddenRaw(f), S(n, "ln-number:input", { value: f, formatted: g });
  }, t.prototype._setHiddenRaw = function(n) {
    m.set.call(this._hidden, String(n));
  }, t.prototype._displayFormatted = function(n) {
    this._isFormatting = !0, this.dom.value = b(J(this.dom), n, this.dom.getAttribute("data-ln-number-decimals")), this._isFormatting = !1;
  }, Object.defineProperty(t.prototype, "value", {
    get: function() {
      const n = this._hidden.value;
      return n === "" ? NaN : parseFloat(n);
    },
    set: function(n) {
      if (typeof n != "number" || isNaN(n)) {
        this.dom.value = "", this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._displayFormatted(n), this._setHiddenRaw(n), S(this.dom, "ln-number:input", {
        value: n,
        formatted: this.dom.value
      }), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(t.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), t.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[u]);
  };
  function s() {
    new MutationObserver(function() {
      const n = document.querySelectorAll("[" + h + "]");
      for (let c = 0; c < n.length; c++) {
        const o = n[c][u];
        o && !isNaN(o.value) && o._displayFormatted(o.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, u, t, "ln-number"), s();
})();
(function() {
  const h = "data-ln-date", u = "lnDate";
  if (window[u] !== void 0) return;
  const y = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function _(e, l) {
    const f = e + "|" + JSON.stringify(l);
    return y[f] || (y[f] = new Intl.DateTimeFormat(e, l)), y[f];
  }
  const b = /^(short|medium|long)(\s+datetime)?$/, t = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(e) {
    return !e || e === "" ? { dateStyle: "medium" } : e.match(b) ? t[e] : null;
  }
  function n(e, l, f) {
    const a = e.getDate(), p = e.getMonth(), g = e.getFullYear(), A = e.getHours(), E = e.getMinutes(), w = {
      yyyy: String(g),
      yy: String(g).slice(-2),
      MMMM: _(f, { month: "long" }).format(e),
      MMM: _(f, { month: "short" }).format(e),
      MM: String(p + 1).padStart(2, "0"),
      M: String(p + 1),
      dd: String(a).padStart(2, "0"),
      d: String(a),
      HH: String(A).padStart(2, "0"),
      mm: String(E).padStart(2, "0")
    };
    return l.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(T) {
      return w[T];
    });
  }
  function c(e, l, f) {
    const a = s(l);
    return a ? _(f, a).format(e) : n(e, l, f);
  }
  function o(e) {
    if (e.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", e.tagName), this;
    if (e[u]) return e[u];
    e[u] = this, this.dom = e;
    const l = this, f = e.value, a = e.name, p = document.createElement("span");
    p.setAttribute("data-ln-date-field", ""), e.parentNode.insertBefore(p, e), p.appendChild(e), this._wrapper = p;
    const g = document.createElement("input");
    g.type = "hidden", g.name = a, e.removeAttribute("name"), e.insertAdjacentElement("afterend", g), this._hidden = g;
    const A = document.createElement("input");
    A.type = "date", A.tabIndex = -1, A.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", g.insertAdjacentElement("afterend", A), this._picker = A, e.type = "text";
    const E = document.createElement("button");
    if (E.type = "button", E.setAttribute("aria-label", "Open date picker"), E.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', A.insertAdjacentElement("afterend", E), this._btn = E, this._lastISO = "", Object.defineProperty(g, "value", {
      get: function() {
        return m.get.call(g);
      },
      set: function(w) {
        if (m.set.call(g, w), w && w !== "") {
          const T = i(w);
          T && (l._displayFormatted(T), m.set.call(A, w), l._lastISO = w, S(l.dom, "ln-date:change", {
            value: w,
            formatted: l.dom.value,
            date: T
          }), l.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else w === "" && (l.dom.value = "", m.set.call(A, ""), l._lastISO = "", S(l.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), l.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), kt(e, m, {
      get: function() {
        return m.get.call(e);
      },
      set: function(w, T) {
        if (l._isFormatting) {
          T(w);
          return;
        }
        if (!w || w === "") {
          T(""), l._setHiddenRaw(""), m.set.call(l._picker, ""), l._lastISO = "", S(e, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), e.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let x = i(w);
        if (x || (x = d(w)), x) {
          const D = x.getFullYear(), O = String(x.getMonth() + 1).padStart(2, "0"), M = String(x.getDate()).padStart(2, "0"), F = D + "-" + O + "-" + M;
          l._setHiddenRaw(F), m.set.call(l._picker, F), l._lastISO = F;
          const j = e.getAttribute(h) || "", $ = J(e), Q = c(x, j, $);
          T(Q), S(e, "ln-date:change", {
            value: F,
            formatted: Q,
            date: x
          }), e.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          T(String(w)), l._setHiddenRaw(""), m.set.call(l._picker, ""), l._lastISO = "", S(e, "ln-date:change", {
            value: "",
            formatted: String(w),
            date: null
          }), e.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const w = A.value;
      if (w) {
        const T = i(w);
        T && (l._setHiddenRaw(w), l._displayFormatted(T), l._lastISO = w, S(l.dom, "ln-date:change", {
          value: w,
          formatted: l.dom.value,
          date: T
        }));
      } else
        l._setHiddenRaw(""), l.dom.value = "", l._lastISO = "", S(l.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const w = l.dom.value.trim();
      if (w === "") {
        l._lastISO !== "" && (l._setHiddenRaw(""), m.set.call(l._picker, ""), l.dom.value = "", l._lastISO = "", S(l.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (l._lastISO) {
        const x = i(l._lastISO);
        if (x) {
          const D = l.dom.getAttribute(h) || "", O = J(l.dom), M = c(x, D, O);
          if (w === M) return;
        }
      }
      const T = d(w);
      if (T) {
        const x = T.getFullYear(), D = String(T.getMonth() + 1).padStart(2, "0"), O = String(T.getDate()).padStart(2, "0"), M = x + "-" + D + "-" + O;
        l._setHiddenRaw(M), m.set.call(l._picker, M), l._displayFormatted(T), l._lastISO = M, S(l.dom, "ln-date:change", {
          value: M,
          formatted: l.dom.value,
          date: T
        });
      } else if (l._lastISO) {
        const x = i(l._lastISO);
        x && l._displayFormatted(x);
      } else
        l.dom.value = "";
    }, e.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      l._openPicker();
    }, E.addEventListener("click", this._onBtnClick), f && f !== "") {
      const w = i(f);
      w && (this._setHiddenRaw(f), m.set.call(A, f), this._displayFormatted(w), this._lastISO = f, S(e, "ln-date:change", {
        value: f,
        formatted: e.value,
        date: w
      }), e.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function i(e) {
    if (!e || typeof e != "string") return null;
    const l = e.split("T"), f = l[0].split("-");
    if (f.length < 3) return null;
    const a = parseInt(f[0], 10), p = parseInt(f[1], 10) - 1, g = parseInt(f[2], 10);
    if (isNaN(a) || isNaN(p) || isNaN(g)) return null;
    let A = 0, E = 0;
    if (l[1]) {
      const T = l[1].split(":");
      A = parseInt(T[0], 10) || 0, E = parseInt(T[1], 10) || 0;
    }
    const w = new Date(a, p, g, A, E);
    return w.getFullYear() !== a || w.getMonth() !== p || w.getDate() !== g ? null : w;
  }
  function d(e) {
    if (!e || typeof e != "string" || (e = e.trim(), e.length < 6)) return null;
    let l, f;
    if (e.indexOf(".") !== -1)
      l = ".", f = e.split(".");
    else if (e.indexOf("/") !== -1)
      l = "/", f = e.split("/");
    else if (e.indexOf("-") !== -1)
      l = "-", f = e.split("-");
    else
      return null;
    if (f.length !== 3) return null;
    const a = [];
    for (let w = 0; w < 3; w++) {
      const T = parseInt(f[w], 10);
      if (isNaN(T)) return null;
      a.push(T);
    }
    let p, g, A;
    l === "." ? (p = a[0], g = a[1], A = a[2]) : l === "/" ? (g = a[0], p = a[1], A = a[2]) : f[0].length === 4 ? (A = a[0], g = a[1], p = a[2]) : (p = a[0], g = a[1], A = a[2]), A < 100 && (A += A < 50 ? 2e3 : 1900);
    const E = new Date(A, g - 1, p);
    return E.getFullYear() !== A || E.getMonth() !== g - 1 || E.getDate() !== p ? null : E;
  }
  o.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, o.prototype._setHiddenRaw = function(e) {
    m.set.call(this._hidden, e);
  }, o.prototype._displayFormatted = function(e) {
    const l = this.dom.getAttribute(h) || "", f = J(this.dom);
    this._isFormatting = !0, this.dom.value = c(e, l, f), this._isFormatting = !1;
  }, Object.defineProperty(o.prototype, "value", {
    get: function() {
      return m.get.call(this._hidden);
    },
    set: function(e) {
      if (!e || e === "") {
        this._setHiddenRaw(""), m.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const l = i(e);
      l && (this._setHiddenRaw(e), m.set.call(this._picker, e), this._displayFormatted(l), this._lastISO = e, S(this.dom, "ln-date:change", {
        value: e,
        formatted: this.dom.value,
        date: l
      }));
    }
  }), Object.defineProperty(o.prototype, "date", {
    get: function() {
      const e = this.value;
      return e ? i(e) : null;
    },
    set: function(e) {
      if (!e || !(e instanceof Date) || isNaN(e.getTime())) {
        this.value = "";
        return;
      }
      const l = e.getFullYear(), f = String(e.getMonth() + 1).padStart(2, "0"), a = String(e.getDate()).padStart(2, "0");
      this.value = l + "-" + f + "-" + a;
    }
  }), Object.defineProperty(o.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), o.prototype.destroy = function() {
    if (!this.dom[u]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const e = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), e && (this.dom.value = e), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[u];
  };
  function r() {
    new MutationObserver(function() {
      const e = document.querySelectorAll("[" + h + "]");
      for (let l = 0; l < e.length; l++) {
        const f = e[l][u];
        if (f && f.value) {
          const a = i(f.value);
          a && f._displayFormatted(a);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, u, o, "ln-date"), r();
})();
(function() {
  const h = "data-ln-nav", u = "lnNav";
  if (window[u] !== void 0) return;
  const y = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const o = history.pushState;
    history.pushState = function() {
      o.apply(history, arguments);
      for (const i of m)
        i();
    }, history._lnNavPatched = !0;
  }
  function _(o) {
    if (!o.hasAttribute(h) || y.has(o)) return;
    const i = o.getAttribute(h);
    if (!i) return;
    const d = b(o, i);
    y.set(o, d), o[u] = d;
  }
  function b(o, i) {
    let d = Array.from(o.querySelectorAll("a"));
    s(d, i, window.location.pathname);
    const r = function() {
      d = Array.from(o.querySelectorAll("a")), s(d, i, window.location.pathname);
    };
    window.addEventListener("popstate", r), m.push(r);
    const e = new MutationObserver(function(l) {
      for (const f of l)
        if (f.type === "childList") {
          for (const a of f.addedNodes)
            if (a.nodeType === 1) {
              if (a.tagName === "A")
                d.push(a), s([a], i, window.location.pathname);
              else if (a.querySelectorAll) {
                const p = Array.from(a.querySelectorAll("a"));
                d = d.concat(p), s(p, i, window.location.pathname);
              }
            }
          for (const a of f.removedNodes)
            if (a.nodeType === 1) {
              if (a.tagName === "A")
                d = d.filter(function(p) {
                  return p !== a;
                });
              else if (a.querySelectorAll) {
                const p = Array.from(a.querySelectorAll("a"));
                d = d.filter(function(g) {
                  return !p.includes(g);
                });
              }
            }
        }
    });
    return e.observe(o, { childList: !0, subtree: !0 }), {
      navElement: o,
      activeClass: i,
      observer: e,
      updateHandler: r,
      destroy: function() {
        e.disconnect(), window.removeEventListener("popstate", r);
        const l = m.indexOf(r);
        l !== -1 && m.splice(l, 1), y.delete(o), delete o[u];
      }
    };
  }
  function t(o) {
    try {
      return new URL(o, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return o.replace(/\/$/, "") || "/";
    }
  }
  function s(o, i, d) {
    const r = t(d);
    for (const e of o) {
      const l = e.getAttribute("href");
      if (!l) continue;
      const f = t(l);
      e.classList.remove(i);
      const a = f === r, p = f !== "/" && r.startsWith(f + "/");
      (a || p) && e.classList.add(i);
    }
  }
  function n() {
    G(function() {
      new MutationObserver(function(i) {
        for (const d of i)
          if (d.type === "childList") {
            for (const r of d.addedNodes)
              if (r.nodeType === 1 && (r.hasAttribute && r.hasAttribute(h) && _(r), r.querySelectorAll))
                for (const e of r.querySelectorAll("[" + h + "]"))
                  _(e);
          } else d.type === "attributes" && d.target.hasAttribute && d.target.hasAttribute(h) && _(d.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[u] = _;
  function c() {
    for (const o of document.querySelectorAll("[" + h + "]"))
      _(o);
  }
  n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const h = "data-ln-tabs", u = "lnTabs";
  if (window[u] !== void 0 && window[u] !== null) return;
  function y() {
    const t = (location.hash || "").replace("#", ""), s = {};
    if (!t) return s;
    for (const n of t.split("&")) {
      const c = n.indexOf(":");
      c > 0 && (s[n.slice(0, c)] = n.slice(c + 1));
    }
    return s;
  }
  function m(t, s) {
    const n = (t.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (n) return n;
    if (t.tagName !== "A") return "";
    const c = t.getAttribute("href") || "";
    if (!c.startsWith("#")) return "";
    const o = c.slice(1);
    if (!o) return "";
    const i = o.split("&");
    if (s)
      for (const e of i) {
        const l = e.indexOf(":");
        if (l > 0 && e.slice(0, l).toLowerCase().trim() === s)
          return e.slice(l + 1).toLowerCase().trim();
      }
    const d = i[i.length - 1] || "", r = d.indexOf(":");
    return (r > 0 ? d.slice(r + 1) : d).toLowerCase().trim();
  }
  function _(t) {
    return this.dom = t, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const s of this.tabs) {
      const n = m(s, this.nsKey);
      n ? this.mapTabs[n] = s : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', s);
    }
    for (const s of this.panels) {
      const n = (s.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      n && (this.mapPanels[n] = s);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const t = this;
    this._clickHandlers = [];
    for (const s of this.tabs) {
      if (s[u + "Trigger"]) continue;
      const n = function(c) {
        if (c.ctrlKey || c.metaKey || c.button === 1) return;
        const o = m(s, t.nsKey);
        if (o)
          if (s.tagName === "A" && c.preventDefault(), t.hashEnabled) {
            const i = y();
            i[t.nsKey] = o;
            const d = Object.keys(i).map(function(r) {
              return r + ":" + i[r];
            }).join("&");
            location.hash === "#" + d ? t.dom.setAttribute("data-ln-tabs-active", o) : location.hash = d;
          } else
            t.dom.setAttribute("data-ln-tabs-active", o);
      };
      s.addEventListener("click", n), s[u + "Trigger"] = n, t._clickHandlers.push({ el: s, handler: n });
    }
    if (this._hashHandler = function() {
      if (!t.hashEnabled) return;
      const s = y();
      t.dom.setAttribute("data-ln-tabs-active", t.nsKey in s ? s[t.nsKey] : t.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let s = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const n = _t("tabs", this.dom);
        n !== null && n in this.mapPanels && (s = n);
      }
      this.dom.setAttribute("data-ln-tabs-active", s);
    }
  }
  _.prototype._applyActive = function(t) {
    var s;
    (!t || !(t in this.mapPanels)) && (t = this.defaultKey);
    for (const n in this.mapTabs) {
      const c = this.mapTabs[n];
      n === t ? (c.setAttribute("data-active", ""), c.setAttribute("aria-selected", "true")) : (c.removeAttribute("data-active"), c.setAttribute("aria-selected", "false"));
    }
    for (const n in this.mapPanels) {
      const c = this.mapPanels[n], o = n === t;
      c.classList.toggle("hidden", !o), c.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const n = (s = this.mapPanels[t]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      n && setTimeout(() => n.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: t, tab: this.mapTabs[t], panel: this.mapPanels[t] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && st("tabs", this.dom, t);
  }, _.prototype.destroy = function() {
    if (this.dom[u]) {
      for (const { el: t, handler: s } of this._clickHandlers)
        t.removeEventListener("click", s), delete t[u + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[u];
    }
  }, B(h, u, _, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(t) {
      const s = t.getAttribute("data-ln-tabs-active");
      t[u]._applyActive(s);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", u = "lnToggle";
  if (window[u] !== void 0) return;
  function y(t) {
    const s = Array.from(t.querySelectorAll("[data-ln-toggle-for]"));
    t.hasAttribute && t.hasAttribute("data-ln-toggle-for") && s.push(t);
    for (const n of s) {
      if (n[u + "Trigger"]) continue;
      const c = function(d) {
        if (d.ctrlKey || d.metaKey || d.button === 1) return;
        d.preventDefault();
        const r = n.getAttribute("data-ln-toggle-for"), e = document.getElementById(r);
        if (!e || !e[u]) return;
        const l = n.getAttribute("data-ln-toggle-action") || "toggle";
        if (l === "open")
          e.setAttribute(h, "open");
        else if (l === "close")
          e.setAttribute(h, "close");
        else if (l === "toggle") {
          const f = e.getAttribute(h);
          e.setAttribute(h, f === "open" ? "close" : "open");
        }
      };
      n.addEventListener("click", c), n[u + "Trigger"] = c;
      const o = n.getAttribute("data-ln-toggle-for"), i = document.getElementById(o);
      i && i[u] && n.setAttribute("aria-expanded", i[u].isOpen ? "true" : "false");
    }
  }
  function m(t, s) {
    const n = document.querySelectorAll(
      '[data-ln-toggle-for="' + t.id + '"]'
    );
    for (const c of n)
      c.setAttribute("aria-expanded", s ? "true" : "false");
  }
  function _(t) {
    if (this.dom = t, t.hasAttribute("data-ln-persist")) {
      const s = _t("toggle", t);
      s !== null && t.setAttribute(h, s);
    }
    return this.isOpen = t.getAttribute(h) === "open", this.isOpen && t.classList.add("open"), m(t, this.isOpen), this;
  }
  _.prototype.destroy = function() {
    if (!this.dom[u]) return;
    S(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const t = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const s of t)
      s[u + "Trigger"] && (s.removeEventListener("click", s[u + "Trigger"]), delete s[u + "Trigger"]);
    delete this.dom[u];
  };
  function b(t) {
    const s = t[u];
    if (!s) return;
    const c = t.getAttribute(h) === "open";
    if (c !== s.isOpen)
      if (c) {
        if (V(t, "ln-toggle:before-open", { target: t }).defaultPrevented) {
          t.setAttribute(h, "close");
          return;
        }
        s.isOpen = !0, t.classList.add("open"), m(t, !0), S(t, "ln-toggle:open", { target: t }), t.hasAttribute("data-ln-persist") && st("toggle", t, "open");
      } else {
        if (V(t, "ln-toggle:before-close", { target: t }).defaultPrevented) {
          t.setAttribute(h, "open");
          return;
        }
        s.isOpen = !1, t.classList.remove("open"), m(t, !1), S(t, "ln-toggle:close", { target: t }), t.hasAttribute("data-ln-persist") && st("toggle", t, "close");
      }
  }
  B(h, u, _, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: b,
    onInit: y
  });
})();
(function() {
  const h = "data-ln-accordion", u = "lnAccordion";
  if (window[u] !== void 0) return;
  function y(m) {
    return this.dom = m, this._onToggleOpen = function(_) {
      if (_.detail.target.closest("[data-ln-accordion]") !== m) return;
      const b = m.querySelectorAll("[data-ln-toggle]");
      for (const t of b)
        t !== _.detail.target && t.closest("[data-ln-accordion]") === m && t.getAttribute("data-ln-toggle") === "open" && t.setAttribute("data-ln-toggle", "close");
      S(m, "ln-accordion:change", { target: _.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[u]);
  }, B(h, u, y, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", u = "lnDropdown";
  if (window[u] !== void 0) return;
  function y(m) {
    if (this.dom = m, this.toggleEl = m.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = m.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const b of this.toggleEl.children)
        b.setAttribute("role", "menuitem");
    const _ = this;
    return this._onToggleOpen = function(b) {
      b.detail.target === _.toggleEl && (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "true"), _._teleportRestore = It(_.toggleEl), _.toggleEl.style.position = "fixed", _.toggleEl.style.right = "auto", _._reposition(), _._addOutsideClickListener(), _._addScrollRepositionListener(), _._addResizeCloseListener(), S(m, "ln-dropdown:open", { target: b.detail.target }));
    }, this._onToggleClose = function(b) {
      b.detail.target === _.toggleEl && (_.triggerBtn && _.triggerBtn.setAttribute("aria-expanded", "false"), _._removeOutsideClickListener(), _._removeScrollRepositionListener(), _._removeResizeCloseListener(), _.toggleEl.style.position = "", _.toggleEl.style.top = "", _.toggleEl.style.left = "", _.toggleEl.style.right = "", _.toggleEl.style.transform = "", _.toggleEl.style.margin = "", _._teleportRestore && (_._teleportRestore(), _._teleportRestore = null), S(m, "ln-dropdown:close", { target: b.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  y.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const m = this.triggerBtn.getBoundingClientRect(), _ = At(this.toggleEl), b = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, t = gt(m, _, "bottom-end", b);
    this.toggleEl.style.top = t.top + "px", this.toggleEl.style.left = t.left + "px";
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
    this.dom[u] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[u]);
  }, B(h, u, y, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", u = "lnPopover", y = "data-ln-popover-for", m = "data-ln-popover-position";
  if (window[u] !== void 0) return;
  const _ = [];
  let b = null;
  function t() {
    b || (b = function(o) {
      if (o.key !== "Escape" || _.length === 0) return;
      _[_.length - 1].close();
    }, document.addEventListener("keydown", b));
  }
  function s() {
    _.length > 0 || b && (document.removeEventListener("keydown", b), b = null);
  }
  function n(o) {
    return this.dom = o, this.isOpen = o.getAttribute(h) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, o.hasAttribute("tabindex") || o.setAttribute("tabindex", "-1"), o.hasAttribute("role") || o.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(o) {
    this.isOpen || (this.trigger = o || null, this.dom.setAttribute(h, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, n.prototype.toggle = function(o) {
    this.isOpen ? this.close() : this.open(o);
  }, n.prototype._applyOpen = function(o) {
    this.isOpen = !0, o && (this.trigger = o), this._previousFocus = document.activeElement, this._teleportRestore = It(this.dom);
    const i = At(this.dom);
    if (this.trigger) {
      const l = this.trigger.getBoundingClientRect(), f = this.dom.getAttribute(m) || "bottom", a = gt(l, i, f, 8);
      this.dom.style.top = a.top + "px", this.dom.style.left = a.left + "px", this.dom.setAttribute("data-ln-popover-placement", a.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const d = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), r = Array.prototype.find.call(d, pt);
    r ? r.focus() : this.dom.focus();
    const e = this;
    this._boundDocClick = function(l) {
      e.dom.contains(l.target) || e.trigger && e.trigger.contains(l.target) || e.close();
    }, e._docClickTimeout = setTimeout(function() {
      e._docClickTimeout = null, document.addEventListener("click", e._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!e.trigger) return;
      const l = e.trigger.getBoundingClientRect(), f = At(e.dom), a = e.dom.getAttribute(m) || "bottom", p = gt(l, f, a, 8);
      e.dom.style.top = p.top + "px", e.dom.style.left = p.left + "px", e.dom.setAttribute("data-ln-popover-placement", p.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), _.push(this), t(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const o = _.indexOf(this);
    o !== -1 && _.splice(o, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[u] && (this.isOpen && this._applyClose(), delete this.dom[u], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function c(o) {
    this.dom = o;
    const i = o.getAttribute(y);
    return o.setAttribute("aria-haspopup", "dialog"), o.setAttribute("aria-expanded", "false"), o.setAttribute("aria-controls", i), this._onClick = function(d) {
      if (d.ctrlKey || d.metaKey || d.button === 1) return;
      d.preventDefault();
      const r = document.getElementById(i);
      !r || !r[u] || r[u].toggle(o);
    }, o.addEventListener("click", this._onClick), this;
  }
  c.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[u + "Trigger"];
  }, B(h, u, n, "ln-popover", {
    onAttributeChange: function(o) {
      const i = o[u];
      if (!i) return;
      const r = o.getAttribute(h) === "open";
      if (r !== i.isOpen)
        if (r) {
          if (V(o, "ln-popover:before-open", {
            popoverId: o.id,
            target: o,
            trigger: i.trigger
          }).defaultPrevented) {
            o.setAttribute(h, "closed");
            return;
          }
          i._applyOpen(i.trigger);
        } else {
          if (V(o, "ln-popover:before-close", {
            popoverId: o.id,
            target: o,
            trigger: i.trigger
          }).defaultPrevented) {
            o.setAttribute(h, "open");
            return;
          }
          i._applyClose();
        }
    }
  }), B(y, u + "Trigger", c, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", u = "data-ln-tooltip", y = "data-ln-tooltip-position", m = "lnTooltipEnhance", _ = "ln-tooltip-portal";
  if (window[m] !== void 0) return;
  let b = 0, t = null, s = null, n = null, c = null, o = null;
  function i() {
    return t && t.parentNode || (t = document.getElementById(_), t || (t = document.createElement("div"), t.id = _, document.body.appendChild(t))), t;
  }
  function d() {
    o || (o = function(a) {
      a.key === "Escape" && l();
    }, document.addEventListener("keydown", o));
  }
  function r() {
    o && (document.removeEventListener("keydown", o), o = null);
  }
  function e(a) {
    if (n === a) return;
    l();
    const p = a.getAttribute(u) || a.getAttribute("title");
    if (!p) return;
    i(), a.hasAttribute("title") && (c = a.getAttribute("title"), a.removeAttribute("title"));
    const g = document.createElement("div");
    g.className = "ln-tooltip", g.textContent = p, a[m + "Uid"] || (b += 1, a[m + "Uid"] = "ln-tooltip-" + b), g.id = a[m + "Uid"], t.appendChild(g);
    const A = g.offsetWidth, E = g.offsetHeight, w = a.getBoundingClientRect(), T = a.getAttribute(y) || "top", x = gt(w, { width: A, height: E }, T, 6);
    g.style.top = x.top + "px", g.style.left = x.left + "px", g.setAttribute("data-ln-tooltip-placement", x.placement), a.setAttribute("aria-describedby", g.id), s = g, n = a, d();
  }
  function l() {
    if (!s) {
      r();
      return;
    }
    n && (n.removeAttribute("aria-describedby"), c !== null && n.setAttribute("title", c)), c = null, s.parentNode && s.parentNode.removeChild(s), s = null, n = null, r();
  }
  function f(a) {
    return this.dom = a, a.hasAttribute("data-ln-tooltip-enhanced") || (a.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      e(a);
    }, this._onLeave = function() {
      n === a && l();
    }, this._onFocus = function() {
      e(a);
    }, this._onBlur = function() {
      n === a && l();
    }, a.addEventListener("mouseenter", this._onEnter), a.addEventListener("mouseleave", this._onLeave), a.addEventListener("focus", this._onFocus, !0), a.addEventListener("blur", this._onBlur, !0), this;
  }
  f.prototype.destroy = function() {
    const a = this.dom;
    a.removeEventListener("mouseenter", this._onEnter), a.removeEventListener("mouseleave", this._onLeave), a.removeEventListener("focus", this._onFocus, !0), a.removeEventListener("blur", this._onBlur, !0), n === a && l(), this._addedEnhancedAttr && a.removeAttribute("data-ln-tooltip-enhanced"), delete a[m], delete a[m + "Uid"], S(a, "ln-tooltip:destroyed", { trigger: a });
  }, B(
    "[" + h + "], [" + u + "][title]",
    m,
    f,
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
  const h = "data-ln-toast", u = "lnToast", y = "ln-toast-item", m = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, _ = { success: "success", error: "error", warn: "warning", info: "info" }, b = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function t() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const a = document.createElement("template");
    a.setAttribute("data-ln-template", "ln-toast-item"), a.innerHTML = jt, document.body.appendChild(a);
  }
  function s(a) {
    if (!a || a.nodeType !== 1) return;
    const p = Array.from(a.querySelectorAll("[" + h + "]"));
    a.hasAttribute && a.hasAttribute(h) && p.push(a);
    for (const g of p)
      g[u] || new n(g);
  }
  function n(a) {
    this.dom = a, a[u] = this, this.timeoutDefault = parseInt(a.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(a.getAttribute("data-ln-toast-max") || "5", 10);
    for (const p of Array.from(a.querySelectorAll("[data-ln-toast-item]")))
      e(p, a);
    return this;
  }
  n.prototype.destroy = function() {
    if (this.dom[u]) {
      for (const a of Array.from(this.dom.children))
        d(a);
      delete this.dom[u];
    }
  };
  function c(a, p) {
    const g = ((a.type || "info") + "").toLowerCase(), A = ot(p, y, "ln-toast");
    if (!A)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    const E = A.firstElementChild;
    if (!E) return null;
    const w = !!(a.message || a.data && a.data.errors);
    et(E, {
      title: a.title || b[g] || b.info,
      role: g === "error" ? "alert" : "status",
      ariaLive: g === "error" ? "assertive" : "polite",
      hasBody: w
    });
    const T = E.querySelector(".ln-toast__card");
    T && T.classList.add(_[g] || "info");
    const x = E.querySelector(".ln-toast__side");
    if (x) {
      const M = x.querySelector("use");
      M && M.setAttribute("href", "#ln-" + (m[g] || m.info));
    }
    const D = E.querySelector(".ln-toast__body");
    D && w && o(D, a);
    const O = E.querySelector(".ln-toast__close");
    return O && O.addEventListener("click", function() {
      d(E);
    }), E;
  }
  function o(a, p) {
    if (p.message)
      if (Array.isArray(p.message)) {
        const g = document.createElement("ul");
        for (const A of p.message) {
          const E = document.createElement("li");
          E.textContent = A, g.appendChild(E);
        }
        a.appendChild(g);
      } else {
        const g = document.createElement("p");
        g.textContent = p.message, a.appendChild(g);
      }
    if (p.data && p.data.errors) {
      const g = document.createElement("ul");
      for (const A of Object.values(p.data.errors).flat()) {
        const E = document.createElement("li");
        E.textContent = A, g.appendChild(E);
      }
      a.appendChild(g);
    }
  }
  function i(a, p) {
    for (; a.dom.children.length >= a.max; ) a.dom.removeChild(a.dom.firstElementChild);
    a.dom.appendChild(p), requestAnimationFrame(() => p.classList.add("ln-toast__item--in"));
  }
  function d(a) {
    !a || !a.parentNode || (clearTimeout(a._timer), a.classList.remove("ln-toast__item--in"), a.classList.add("ln-toast__item--out"), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 200));
  }
  function r(a) {
    let p = a && a.container;
    return typeof p == "string" && (p = document.querySelector(p)), p instanceof HTMLElement || (p = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), p || null;
  }
  function e(a, p) {
    const g = ((a.getAttribute("data-type") || "info") + "").toLowerCase(), A = a.getAttribute("data-title"), E = (a.innerText || a.textContent || "").trim(), w = c({
      type: g,
      title: A,
      message: E || void 0
    }, p);
    w && (a.parentNode && a.parentNode.replaceChild(w, a), requestAnimationFrame(() => w.classList.add("ln-toast__item--in")));
  }
  function l(a) {
    const p = a.detail || {}, g = r(p);
    if (!g) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const A = g[u] || new n(g), E = c(p, g);
    if (!E) return;
    const w = Number.isFinite(p.timeout) ? p.timeout : A.timeoutDefault;
    i(A, E), w > 0 && (E._timer = setTimeout(() => d(E), w));
  }
  function f(a) {
    const p = a && a.detail || {};
    if (p.container) {
      const g = r(p);
      if (g)
        for (const A of Array.from(g.children)) d(A);
    } else {
      const g = document.querySelectorAll("[" + h + "]");
      for (const A of Array.from(g))
        for (const E of Array.from(A.children)) d(E);
    }
  }
  G(function() {
    t(), window.addEventListener("ln-toast:enqueue", l), window.addEventListener("ln-toast:clear", f), new MutationObserver(function(p) {
      for (const g of p) {
        if (g.type === "attributes") {
          s(g.target);
          continue;
        }
        for (const A of g.addedNodes)
          s(A);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), s(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", u = "lnUpload", y = "data-ln-upload-dict", m = "data-ln-upload-accept", _ = "data-ln-upload-context", b = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function t() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const e = document.createElement("div");
    e.innerHTML = b;
    const l = e.firstElementChild;
    l && document.body.appendChild(l);
  }
  if (window[u] !== void 0) return;
  function s(e) {
    if (e === 0) return "0 B";
    const l = 1024, f = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(e) / Math.log(l));
    return parseFloat((e / Math.pow(l, a)).toFixed(1)) + " " + f[a];
  }
  function n(e) {
    return e.split(".").pop().toLowerCase();
  }
  function c(e) {
    return e === "docx" && (e = "doc"), ["pdf", "doc", "epub"].includes(e) ? "lnc-file-" + e : "ln-file";
  }
  function o(e, l) {
    if (!l) return !0;
    const f = "." + n(e.name);
    return l.split(",").map(function(p) {
      return p.trim().toLowerCase();
    }).includes(f.toLowerCase());
  }
  function i(e) {
    if (e.hasAttribute("data-ln-upload-initialized")) return;
    e.setAttribute("data-ln-upload-initialized", "true"), t();
    const l = qt(e, y), f = e.querySelector(".ln-upload__zone"), a = e.querySelector(".ln-upload__list"), p = e.getAttribute(m) || "";
    if (!f || !a) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", e);
      return;
    }
    let g = e.querySelector('input[type="file"]');
    g || (g = document.createElement("input"), g.type = "file", g.multiple = !0, g.classList.add("hidden"), p && (g.accept = p.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), e.appendChild(g));
    const A = e.getAttribute(h) || "/files/upload", E = e.getAttribute(_) || "", w = /* @__PURE__ */ new Map();
    let T = 0;
    function x() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function D(R) {
      if (!o(R, p)) {
        const C = l["invalid-type"];
        S(e, "ln-upload:invalid", {
          file: R,
          message: C
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: l["invalid-title"] || "Invalid File",
          message: C || l["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++T, H = n(R.name), rt = c(H), ct = ot(e, "ln-upload-item", "ln-upload");
      if (!ct) return;
      const W = ct.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", P), et(W, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + rt,
        removeLabel: l.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const dt = W.querySelector(".ln-upload__progress-bar"), Z = W.querySelector('[data-ln-upload-action="remove"]');
      Z && (Z.disabled = !0), a.appendChild(W);
      const ut = new FormData();
      ut.append("file", R), ut.append("context", E);
      const v = new XMLHttpRequest();
      v.upload.addEventListener("progress", function(C) {
        if (C.lengthComputable) {
          const k = Math.round(C.loaded / C.total * 100);
          dt.style.width = k + "%", et(W, { sizeText: k + "%" });
        }
      }), v.addEventListener("load", function() {
        if (v.status >= 200 && v.status < 300) {
          let C;
          try {
            C = JSON.parse(v.responseText);
          } catch {
            L("Invalid response");
            return;
          }
          et(W, { sizeText: s(C.size || R.size), uploading: !1 }), Z && (Z.disabled = !1), w.set(P, {
            serverId: C.id,
            name: C.name,
            size: C.size
          }), O(), S(e, "ln-upload:uploaded", {
            localId: P,
            serverId: C.id,
            name: C.name
          });
        } else {
          let C = l["upload-failed"] || "Upload failed";
          try {
            C = JSON.parse(v.responseText).message || C;
          } catch {
          }
          L(C);
        }
      }), v.addEventListener("error", function() {
        L(l["network-error"] || "Network error");
      });
      function L(C) {
        dt && (dt.style.width = "100%"), et(W, { sizeText: l.error || "Error", uploading: !1, error: !0 }), Z && (Z.disabled = !1), S(e, "ln-upload:error", {
          file: R,
          message: C
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: l["error-title"] || "Upload Error",
          message: C || l["upload-failed"] || "Failed to upload file"
        });
      }
      v.open("POST", A), v.setRequestHeader("X-CSRF-TOKEN", x()), v.setRequestHeader("Accept", "application/json"), v.send(ut);
    }
    function O() {
      for (const R of e.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of w) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = R.serverId, e.appendChild(P);
      }
    }
    function M(R) {
      const P = w.get(R), H = a.querySelector('[data-file-id="' + R + '"]');
      if (!P || !P.serverId) {
        H && H.remove(), w.delete(R), O();
        return;
      }
      H && et(H, { deleting: !0 }), fetch("/files/" + P.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": x(),
          Accept: "application/json"
        }
      }).then(function(rt) {
        rt.status === 200 ? (H && H.remove(), w.delete(R), O(), S(e, "ln-upload:removed", {
          localId: R,
          serverId: P.serverId
        })) : (H && et(H, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: l["delete-title"] || "Error",
          message: l["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(rt) {
        console.warn("[ln-upload] Delete error:", rt), H && et(H, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: l["network-error"] || "Network error",
          message: l["connection-error"] || "Could not connect to server"
        });
      });
    }
    function F(R) {
      for (const P of R)
        D(P);
      g.value = "";
    }
    const j = function() {
      g.click();
    }, $ = function() {
      F(this.files);
    }, Q = function(R) {
      R.preventDefault(), R.stopPropagation(), f.classList.add("ln-upload__zone--dragover");
    }, mt = function(R) {
      R.preventDefault(), R.stopPropagation(), f.classList.add("ln-upload__zone--dragover");
    }, at = function(R) {
      R.preventDefault(), R.stopPropagation(), f.classList.remove("ln-upload__zone--dragover");
    }, Y = function(R) {
      R.preventDefault(), R.stopPropagation(), f.classList.remove("ln-upload__zone--dragover"), F(R.dataTransfer.files);
    }, lt = function(R) {
      const P = R.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !a.contains(P) || P.disabled) return;
      const H = P.closest(".ln-upload__item");
      H && M(H.getAttribute("data-file-id"));
    };
    f.addEventListener("click", j), g.addEventListener("change", $), f.addEventListener("dragenter", Q), f.addEventListener("dragover", mt), f.addEventListener("dragleave", at), f.addEventListener("drop", Y), a.addEventListener("click", lt), e.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(w.values()).map(function(R) {
          return R.serverId;
        });
      },
      getFiles: function() {
        return Array.from(w.values());
      },
      clear: function() {
        for (const [, R] of w)
          R.serverId && fetch("/files/" + R.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": x(),
              Accept: "application/json"
            }
          });
        w.clear(), a.innerHTML = "", O(), S(e, "ln-upload:cleared", {});
      },
      destroy: function() {
        f.removeEventListener("click", j), g.removeEventListener("change", $), f.removeEventListener("dragenter", Q), f.removeEventListener("dragover", mt), f.removeEventListener("dragleave", at), f.removeEventListener("drop", Y), a.removeEventListener("click", lt), w.clear(), a.innerHTML = "", O(), e.removeAttribute("data-ln-upload-initialized"), delete e.lnUploadAPI;
      }
    };
  }
  function d() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      i(e);
  }
  function r() {
    G(function() {
      new MutationObserver(function(l) {
        for (const f of l)
          if (f.type === "childList") {
            for (const a of f.addedNodes)
              if (a.nodeType === 1) {
                a.hasAttribute(h) && i(a);
                for (const p of a.querySelectorAll("[" + h + "]"))
                  i(p);
              }
          } else f.type === "attributes" && f.target.hasAttribute(h) && i(f.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[u] = {
    init: i,
    initAll: d
  }, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function u(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function y(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !u(s)) return;
    s.target = "_blank";
    const n = (s.rel || "").split(/\s+/).filter(Boolean);
    n.includes("noopener") || n.push("noopener"), n.includes("noreferrer") || n.push("noreferrer"), s.rel = n.join(" ");
    const c = document.createElement("span");
    c.className = "sr-only", c.textContent = "(opens in new tab)", s.appendChild(c), s.setAttribute("data-ln-external-link", "processed"), S(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function m(s) {
    s = s || document.body;
    for (const n of s.querySelectorAll("a, area"))
      y(n);
  }
  function _() {
    G(function() {
      document.body.addEventListener("click", function(s) {
        const n = s.target.closest("a, area");
        n && n.getAttribute("data-ln-external-link") === "processed" && S(n, "ln-external-links:clicked", {
          link: n,
          href: n.href,
          text: n.textContent || n.title || ""
        });
      });
    }, "ln-external-links");
  }
  function b() {
    G(function() {
      new MutationObserver(function(n) {
        for (const c of n) {
          if (c.type === "childList") {
            for (const o of c.addedNodes)
              if (o.nodeType === 1 && (o.matches && (o.matches("a") || o.matches("area")) && y(o), o.querySelectorAll))
                for (const i of o.querySelectorAll("a, area"))
                  y(i);
          }
          if (c.type === "attributes" && c.attributeName === "href") {
            const o = c.target;
            o.matches && (o.matches("a") || o.matches("area")) && y(o);
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
  function t() {
    _(), b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[h] = {
    process: m
  }, t();
})();
(function() {
  const h = "data-ln-link", u = "lnLink";
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
  function t(a, p) {
    if (p.target.closest("a, button, input, select, textarea")) return;
    const g = a.querySelector("a");
    if (!g) return;
    const A = g.getAttribute("href");
    if (!A) return;
    if (p.ctrlKey || p.metaKey || p.button === 1) {
      window.open(A, "_blank");
      return;
    }
    V(a, "ln-link:navigate", { target: a, href: A, link: g }).defaultPrevented || g.click();
  }
  function s(a) {
    const p = a.querySelector("a");
    if (!p) return;
    const g = p.getAttribute("href");
    g && _(g);
  }
  function n() {
    b();
  }
  function c(a) {
    a[u + "Row"] || (a[u + "Row"] = !0, a.querySelector("a") && (a._lnLinkClick = function(p) {
      t(a, p);
    }, a._lnLinkEnter = function() {
      s(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", n)));
  }
  function o(a) {
    a[u + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", n), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[u + "Row"]);
  }
  function i(a) {
    if (!a[u + "Init"]) return;
    const p = a.tagName;
    if (p === "TABLE" || p === "TBODY") {
      const g = p === "TABLE" && a.querySelector("tbody") || a;
      for (const A of g.querySelectorAll("tr"))
        o(A);
    } else
      o(a);
    delete a[u + "Init"];
  }
  function d(a) {
    if (a[u + "Init"]) return;
    a[u + "Init"] = !0;
    const p = a.tagName;
    if (p === "TABLE" || p === "TBODY") {
      const g = p === "TABLE" && a.querySelector("tbody") || a;
      for (const A of g.querySelectorAll("tr"))
        c(A);
    } else
      c(a);
  }
  function r(a) {
    a.hasAttribute && a.hasAttribute(h) && d(a);
    const p = a.querySelectorAll ? a.querySelectorAll("[" + h + "]") : [];
    for (const g of p)
      d(g);
  }
  function e() {
    G(function() {
      new MutationObserver(function(p) {
        for (const g of p)
          if (g.type === "childList")
            for (const A of g.addedNodes)
              A.nodeType === 1 && (r(A), A.tagName === "TR" && A.closest("[" + h + "]") && c(A));
          else g.type === "attributes" && r(g.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function l(a) {
    r(a);
  }
  window[u] = { init: l, destroy: i };
  function f() {
    m(), e(), l(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", f) : f();
})();
(function() {
  const h = "[data-ln-progress]", u = "lnProgress";
  if (window[u] !== void 0) return;
  function y(c) {
    m(c);
  }
  function m(c) {
    const o = Array.from(c.querySelectorAll(h));
    for (const i of o)
      i[u] || (i[u] = new _(i));
    c.hasAttribute && c.hasAttribute("data-ln-progress") && !c[u] && (c[u] = new _(c));
  }
  function _(c) {
    return this.dom = c, this._attrObserver = null, this._parentObserver = null, n.call(this), t.call(this), s.call(this), this;
  }
  _.prototype.destroy = function() {
    this.dom[u] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[u]);
  };
  function b() {
    G(function() {
      new MutationObserver(function(o) {
        for (const i of o)
          if (i.type === "childList")
            for (const d of i.addedNodes)
              d.nodeType === 1 && m(d);
          else i.type === "attributes" && m(i.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  b();
  function t() {
    const c = this, o = new MutationObserver(function(i) {
      for (const d of i)
        (d.attributeName === "data-ln-progress" || d.attributeName === "data-ln-progress-max") && n.call(c);
    });
    o.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = o;
  }
  function s() {
    const c = this, o = this.dom.parentElement;
    if (!o || !o.hasAttribute("data-ln-progress-max")) return;
    const i = new MutationObserver(function(d) {
      for (const r of d)
        r.attributeName === "data-ln-progress-max" && n.call(c);
    });
    i.observe(o, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = i;
  }
  function n() {
    const c = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, o = this.dom.parentElement, d = (o && o.hasAttribute("data-ln-progress-max") ? parseFloat(o.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let r = d > 0 ? c / d * 100 : 0;
    r < 0 && (r = 0), r > 100 && (r = 100), this.dom.style.width = r + "%";
    const e = Math.max(0, Math.min(c, d));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(d)), this.dom.setAttribute("aria-valuenow", String(e)), S(this.dom, "ln-progress:change", { target: this.dom, value: c, max: d, percentage: r });
  }
  window[u] = y, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const h = "data-ln-filter", u = "lnFilter", y = "data-ln-filter-initialized", m = "data-ln-filter-key", _ = "data-ln-filter-value", b = "data-ln-filter-hide", t = "data-ln-filter-reset", s = "data-ln-filter-col", n = /* @__PURE__ */ new WeakMap();
  if (window[u] !== void 0) return;
  function c(e) {
    return e.hasAttribute(t) || e.getAttribute(_) === "";
  }
  function o(e) {
    let l = e._filterKey;
    const f = [];
    for (let a = 0; a < e.inputs.length; a++) {
      const p = e.inputs[a];
      if (p.checked && !c(p)) {
        const g = p.getAttribute(_);
        g && f.push(g);
      }
    }
    return { key: l, values: f };
  }
  function i(e, l) {
    if (e.length !== l.length) return !0;
    for (let f = 0; f < e.length; f++) if (e[f] !== l[f]) return !0;
    return !1;
  }
  function d(e) {
    const l = e.dom, f = e.colIndex, a = l.querySelector("template");
    if (!a || f === null) return;
    const p = document.getElementById(e.targetId);
    if (!p) return;
    const g = p.tagName === "TABLE" ? p : p.querySelector("table");
    if (!g || p.hasAttribute("data-ln-table")) return;
    const A = {}, E = [], w = g.tBodies;
    for (let D = 0; D < w.length; D++) {
      const O = w[D].rows;
      for (let M = 0; M < O.length; M++) {
        const F = O[M].cells[f], j = F ? F.textContent.trim() : "";
        j && !A[j] && (A[j] = !0, E.push(j));
      }
    }
    E.sort(function(D, O) {
      return D.localeCompare(O);
    });
    const T = l.querySelector("[" + m + "]"), x = T ? T.getAttribute(m) : l.getAttribute("data-ln-filter-key") || "col" + f;
    for (let D = 0; D < E.length; D++) {
      const O = a.content.cloneNode(!0), M = O.querySelector("input");
      M && (M.setAttribute(m, x), M.setAttribute(_, E[D]), Lt(O, { text: E[D] }), l.appendChild(O));
    }
  }
  function r(e) {
    if (e.hasAttribute(y)) return this;
    this.dom = e, this.targetId = e.getAttribute(h);
    const l = e.getAttribute(s);
    this.colIndex = l !== null ? parseInt(l, 10) : null, d(this), this.inputs = Array.from(e.querySelectorAll("[" + m + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(m) : null, this._lastSnapshot = null;
    const f = this, a = Ft(
      function() {
        f._render();
      },
      function() {
        f._afterRender();
      }
    );
    this._queueRender = a, this._attachHandlers();
    let p = !1;
    if (e.hasAttribute("data-ln-persist")) {
      const g = _t("filter", e);
      if (g && g.key && Array.isArray(g.values) && g.values.length > 0) {
        for (let A = 0; A < this.inputs.length; A++) {
          const E = this.inputs[A];
          c(E) ? E.checked = !1 : E.getAttribute(m) === g.key && g.values.indexOf(E.getAttribute(_)) !== -1 ? E.checked = !0 : E.checked = !1;
        }
        a(), p = !0;
      }
    }
    if (!p) {
      for (let g = 0; g < this.inputs.length; g++)
        if (this.inputs[g].checked && !c(this.inputs[g])) {
          a();
          break;
        }
    }
    return e.setAttribute(y, ""), this;
  }
  r.prototype._attachHandlers = function() {
    const e = this;
    this.inputs.forEach(function(l) {
      l[u + "Bound"] || (l[u + "Bound"] = !0, l._lnFilterChange = function() {
        if (c(l)) {
          for (let f = 0; f < e.inputs.length; f++)
            c(e.inputs[f]) || (e.inputs[f].checked = !1);
          l.checked = !0, e._queueRender();
          return;
        }
        if (l.checked)
          for (let f = 0; f < e.inputs.length; f++)
            c(e.inputs[f]) && (e.inputs[f].checked = !1);
        else {
          let f = !1;
          for (let a = 0; a < e.inputs.length; a++)
            if (!c(e.inputs[a]) && e.inputs[a].checked) {
              f = !0;
              break;
            }
          if (!f)
            for (let a = 0; a < e.inputs.length; a++)
              c(e.inputs[a]) && (e.inputs[a].checked = !0);
        }
        e._queueRender();
      }, l.addEventListener("change", l._lnFilterChange));
    });
  }, r.prototype._render = function() {
    const e = this, l = o(this), f = l.key === null || l.values.length === 0, a = [];
    for (let p = 0; p < l.values.length; p++)
      a.push(l.values[p].toLowerCase());
    if (e.colIndex !== null)
      e._filterTableRows(l);
    else {
      const p = document.getElementById(e.targetId);
      if (!p) return;
      const g = p.children;
      for (let A = 0; A < g.length; A++) {
        const E = g[A];
        if (f) {
          E.removeAttribute(b);
          continue;
        }
        const w = E.getAttribute("data-" + l.key);
        E.removeAttribute(b), w !== null && a.indexOf(w.toLowerCase()) === -1 && E.setAttribute(b, "true");
      }
    }
  }, r.prototype._afterRender = function() {
    const e = o(this), l = this._lastSnapshot;
    if (!l || l.key !== e.key || i(l.values, e.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: e.key,
        values: e.values.slice()
      });
      const a = l && l.values.length > 0, p = e.values.length === 0;
      a && p && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: e.key, values: e.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (e.key && e.values.length > 0 ? st("filter", this.dom, { key: e.key, values: e.values.slice() }) : st("filter", this.dom, null));
  }, r.prototype._dispatchOnBoth = function(e, l) {
    S(this.dom, e, l);
    const f = document.getElementById(this.targetId);
    f && f !== this.dom && S(f, e, l);
  }, r.prototype._filterTableRows = function(e) {
    const l = document.getElementById(this.targetId);
    if (!l) return;
    const f = l.tagName === "TABLE" ? l : l.querySelector("table");
    if (!f || l.hasAttribute("data-ln-table")) return;
    const a = e.key || this._filterKey, p = e.values;
    n.has(f) || n.set(f, {});
    const g = n.get(f);
    if (a && p.length > 0) {
      const T = [];
      for (let x = 0; x < p.length; x++)
        T.push(p[x].toLowerCase());
      g[a] = { col: this.colIndex, values: T };
    } else a && delete g[a];
    const A = Object.keys(g), E = A.length > 0, w = f.tBodies;
    for (let T = 0; T < w.length; T++) {
      const x = w[T].rows;
      for (let D = 0; D < x.length; D++) {
        const O = x[D];
        if (!E) {
          O.removeAttribute(b);
          continue;
        }
        let M = !0;
        for (let F = 0; F < A.length; F++) {
          const j = g[A[F]], $ = O.cells[j.col], Q = $ ? $.textContent.trim().toLowerCase() : "";
          if (j.values.indexOf(Q) === -1) {
            M = !1;
            break;
          }
        }
        M ? O.removeAttribute(b) : O.setAttribute(b, "true");
      }
    }
  }, r.prototype.destroy = function() {
    if (this.dom[u]) {
      if (this.colIndex !== null) {
        const e = document.getElementById(this.targetId);
        if (e) {
          const l = e.tagName === "TABLE" ? e : e.querySelector("table");
          if (l && n.has(l)) {
            const f = n.get(l), a = this._filterKey;
            a && f[a] && delete f[a], Object.keys(f).length === 0 && n.delete(l);
          }
        }
      }
      this.inputs.forEach(function(e) {
        e._lnFilterChange && (e.removeEventListener("change", e._lnFilterChange), delete e._lnFilterChange), delete e[u + "Bound"];
      }), this.dom.removeAttribute(y), delete this.dom[u];
    }
  }, B(h, u, r, "ln-filter");
})();
(function() {
  const h = "data-ln-search", u = "lnSearch", y = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[u] !== void 0) return;
  function b(t) {
    if (t.hasAttribute(y)) return this;
    this.dom = t, this.targetId = t.getAttribute(h);
    const s = t.tagName;
    if (this.input = s === "INPUT" || s === "TEXTAREA" ? t : t.querySelector('[name="search"]') || t.querySelector('input[type="search"]') || t.querySelector('input[type="text"]'), this.itemsSelector = t.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const n = this;
      queueMicrotask(function() {
        n._search(n.input.value.trim().toLowerCase());
      });
    }
    return t.setAttribute(y, ""), this;
  }
  b.prototype._attachHandler = function() {
    if (!this.input) return;
    const t = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      t.input.value = "", t._search(""), t.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
        t._search(t.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, b.prototype._search = function(t) {
    const s = document.getElementById(this.targetId);
    if (!s || V(s, "ln-search:change", { term: t, targetId: this.targetId }).defaultPrevented) return;
    const c = this.itemsSelector ? s.querySelectorAll(this.itemsSelector) : s.children;
    for (let o = 0; o < c.length; o++) {
      const i = c[o];
      i.removeAttribute(m), t && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(t) && i.setAttribute(m, "true");
    }
  }, b.prototype.destroy = function() {
    this.dom[u] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(y), delete this.dom[u]);
  }, B(h, u, b, "ln-search");
})();
(function() {
  const h = "lnTableSort", u = "data-ln-sort", y = "data-ln-table-sort";
  if (window[h] !== void 0) return;
  function m(s) {
    _(s);
  }
  function _(s) {
    const n = Array.from(s.querySelectorAll("table"));
    s.tagName === "TABLE" && n.push(s), n.forEach(function(c) {
      if (c[h]) return;
      const o = Array.from(c.querySelectorAll("th[" + u + "]"));
      o.length && (c[h] = new b(c, o));
    });
  }
  function b(s, n) {
    this.table = s, this.ths = n, this._col = -1, this._dir = null;
    const c = this;
    n.forEach(function(i, d) {
      if (i[h + "Bound"]) return;
      i[h + "Bound"] = !0;
      const r = i.querySelector("[" + y + "]");
      r && (r._lnSortClick = function() {
        c._handleClick(d, i);
      }, r.addEventListener("click", r._lnSortClick));
    });
    const o = s.closest("[data-ln-table][data-ln-persist]");
    if (o) {
      const i = _t("table-sort", o);
      i && i.dir && i.col >= 0 && i.col < n.length && (this._handleClick(i.col, n[i.col]), i.dir === "desc" && this._handleClick(i.col, n[i.col]));
    }
    return this;
  }
  b.prototype._handleClick = function(s, n) {
    let c;
    this._col !== s ? c = "asc" : this._dir === "asc" ? c = "desc" : this._dir === "desc" ? c = null : c = "asc", this.ths.forEach(function(i) {
      i.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), c === null ? (this._col = -1, this._dir = null) : (this._col = s, this._dir = c, n.classList.add(c === "asc" ? "ln-sort-asc" : "ln-sort-desc")), S(this.table, "ln-table:sort", {
      column: s,
      sortType: n.getAttribute(u),
      direction: c
    });
    const o = this.table.closest("[data-ln-table][data-ln-persist]");
    o && (c === null ? st("table-sort", o, null) : st("table-sort", o, { col: s, dir: c }));
  }, b.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(s) {
      const n = s.querySelector("[" + y + "]");
      n && n._lnSortClick && (n.removeEventListener("click", n._lnSortClick), delete n._lnSortClick), delete s[h + "Bound"];
    }), delete this.table[h]);
  };
  function t() {
    G(function() {
      new MutationObserver(function(n) {
        n.forEach(function(c) {
          c.type === "childList" ? c.addedNodes.forEach(function(o) {
            o.nodeType === 1 && _(o);
          }) : c.type === "attributes" && _(c.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-table-sort");
  }
  window[h] = m, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-table", u = "lnTable", y = "data-ln-sort", m = "data-ln-table-empty";
  if (window[u] !== void 0) return;
  const t = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, s = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function n(i) {
    return s ? s.format(i) : String(i);
  }
  function c(i) {
    let d = i.parentElement;
    for (; d && d !== document.body && d !== document.documentElement; ) {
      const e = getComputedStyle(d).overflowY;
      if (e === "auto" || e === "scroll") return d;
      d = d.parentElement;
    }
    return null;
  }
  function o(i) {
    this.dom = i, this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead");
    const d = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = d ? Array.from(d.querySelectorAll("th")) : [], this.isDataDriven = i.hasAttribute("data-ln-table-source"), this.name = i.getAttribute(h) || "", this.source = i.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const r = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(e) {
      return e.getAttribute("data-ln-col") && e.querySelector("[data-ln-col-filter]");
    }).map(function(e) {
      return e.getAttribute("data-ln-col");
    }), this._totalSpan = i.querySelector("[data-ln-table-total]"), this._filteredSpan = i.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = i.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(e) {
      const l = e.detail || {};
      r._data = l.data || [], r._lastTotal = l.total != null ? l.total : r._data.length, r._lastFiltered = l.filtered != null ? l.filtered : r._data.length, r.totalCount = r._lastTotal, r.visibleCount = r._lastFiltered, r.isLoaded = !0, i.classList.remove("ln-table--loading"), r._updateFilterOptions(l.filterOptions), r._vStart = -1, r._vEnd = -1, r._applyFilterAndSort(), r._render(), r._updateFooter(), S(i, "ln-table:rendered", {
        table: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      });
    }, i.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(e) {
      const l = e.detail && e.detail.loading;
      i.classList.toggle("ln-table--loading", !!l), l && (r.isLoaded = !1);
    }, i.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(e) {
      const l = e.target.closest("[data-ln-col-sort]");
      if (!l) return;
      const f = l.closest("th");
      if (!f) return;
      const a = f.getAttribute("data-ln-col");
      a && r._handleSort(a, f);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(e) {
      const l = e.target.closest("[data-ln-col-filter]");
      if (!l) return;
      e.stopPropagation();
      const f = l.closest("th");
      if (!f) return;
      const a = f.getAttribute("data-ln-col");
      if (a) {
        if (r._activeDropdown && r._activeDropdown.field === a) {
          r._closeFilterDropdown();
          return;
        }
        r._openFilterDropdown(a, f, l);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      r._activeDropdown && r._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(e) {
      (e.target.closest("[data-ln-table-clear-all]") || e.target.closest("[data-ln-data-table-clear-all]")) && (r.currentFilters = {}, r._updateFilterIndicators(), S(i, "ln-table:clear-filters", { table: r.name }), r._requestData());
    }, i.addEventListener("click", this._onClearAll), this._selectable = i.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(e) {
      if (e.target.closest("[data-ln-row-select]") || e.target.closest("[data-ln-row-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const l = e.target.closest("[data-ln-row]");
      if (!l) return;
      const f = l.getAttribute("data-ln-row-id"), a = l._lnRecord || {};
      S(i, "ln-table:row-click", {
        table: r.name,
        id: f,
        record: a
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
      const l = e.target.closest("[data-ln-row-action]");
      if (!l) return;
      e.stopPropagation();
      const f = l.closest("[data-ln-row]");
      if (!f) return;
      const a = l.getAttribute("data-ln-row-action"), p = f.getAttribute("data-ln-row-id"), g = f._lnRecord || {};
      S(i, "ln-table:row-action", {
        table: r.name,
        id: p,
        action: a,
        record: g
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = i.querySelector("[data-ln-table-search]"), this._searchInput && (this._searchInput.closest("[data-ln-search]") || document.querySelector(`[data-ln-search="${i.id}"]`) || (this._onSearchInput = function() {
      r.currentSearch = r._searchInput.value, S(i, "ln-table:search", {
        table: r.name,
        query: r.currentSearch
      }), r._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput))), this._onSearchChange = function(e) {
      e.preventDefault(), r.currentSearch = e.detail.term, r._searchInput && (r._searchInput.value = e.detail.term), S(i, "ln-table:search", {
        table: r.name,
        query: r.currentSearch
      }), r._requestData();
    }, i.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(e) {
      if (!i.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (e.key === "/") {
        r._searchInput && (e.preventDefault(), r._searchInput.focus());
        return;
      }
      const l = r.tbody ? Array.from(r.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (l.length)
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault(), r._focusedRowIndex = Math.min(r._focusedRowIndex + 1, l.length - 1), r._focusRow(l);
            break;
          case "ArrowUp":
            e.preventDefault(), r._focusedRowIndex = Math.max(r._focusedRowIndex - 1, 0), r._focusRow(l);
            break;
          case "Home":
            e.preventDefault(), r._focusedRowIndex = 0, r._focusRow(l);
            break;
          case "End":
            e.preventDefault(), r._focusedRowIndex = l.length - 1, r._focusRow(l);
            break;
          case "Enter":
            if (r._focusedRowIndex >= 0 && r._focusedRowIndex < l.length) {
              e.preventDefault();
              const f = l[r._focusedRowIndex];
              S(i, "ln-table:row-click", {
                table: r.name,
                id: f.getAttribute("data-ln-row-id"),
                record: f._lnRecord || {}
              });
            }
            break;
          case " ":
            if (r._selectable && r._focusedRowIndex >= 0 && r._focusedRowIndex < l.length) {
              e.preventDefault();
              const f = l[r._focusedRowIndex].querySelector("[data-ln-row-select]");
              f && (f.checked = !f.checked, f.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            r._activeDropdown && r._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), S(i, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      r.tbody.rows.length > 0 && (r._emptyTbodyObserver.disconnect(), r._emptyTbodyObserver = null, r._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(e) {
      e.preventDefault(), r._searchTerm = e.detail.term, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), S(i, "ln-table:filter", {
        term: r._searchTerm,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-search:change", this._onSearch), this._onSort = function(e) {
      r._sortCol = e.detail.direction === null ? -1 : e.detail.column, r._sortDir = e.detail.direction, r._sortType = e.detail.sortType, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), S(i, "ln-table:sorted", {
        column: e.detail.column,
        direction: e.detail.direction,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(e) {
      const l = e.detail.key;
      let f = !1;
      for (let g = 0; g < r.ths.length; g++)
        if (r.ths[g].getAttribute("data-ln-filter-col") === l) {
          f = !0;
          break;
        }
      if (!f) return;
      const a = e.detail.values;
      if (!a || a.length === 0)
        delete r._columnFilters[l];
      else {
        const g = [];
        for (let A = 0; A < a.length; A++)
          g.push(a[A].toLowerCase());
        r._columnFilters[l] = g;
      }
      const p = r.dom.querySelector('th[data-ln-filter-col="' + l + '"]');
      p && (a && a.length > 0 ? p.setAttribute("data-ln-filter-active", "") : p.removeAttribute("data-ln-filter-active")), r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), S(i, "ln-table:filter", {
        term: r._searchTerm,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(e) {
      if (!e.target.closest("[data-ln-table-clear]")) return;
      r._searchTerm = "";
      const f = document.querySelector('[data-ln-search="' + i.id + '"]');
      if (f) {
        const p = f.tagName === "INPUT" ? f : f.querySelector("input");
        p && (p.value = "");
      }
      r._columnFilters = {};
      for (let p = 0; p < r.ths.length; p++)
        r.ths[p].removeAttribute("data-ln-filter-active");
      const a = document.querySelectorAll('[data-ln-filter="' + i.id + '"]');
      for (let p = 0; p < a.length; p++) {
        const g = a[p].querySelector("[data-ln-filter-reset]");
        g && (g.checked = !0, g.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
      r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), S(i, "ln-table:filter", {
        term: "",
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, i.addEventListener("click", this._onClear)), this;
  }
  o.prototype._parseRows = function() {
    const i = this.tbody.rows, d = this.ths;
    this._data = [];
    const r = [];
    for (let e = 0; e < d.length; e++)
      r[e] = d[e].getAttribute(y);
    i.length > 0 && (this._rowHeight = i[0].offsetHeight || 40), this._lockColumnWidths();
    for (let e = 0; e < i.length; e++) {
      const l = i[e], f = [], a = [], p = [];
      for (let A = 0; A < l.cells.length; A++) {
        const E = l.cells[A], w = E.textContent.trim(), T = E.hasAttribute("data-ln-value") ? E.getAttribute("data-ln-value") : w, x = r[A];
        a[A] = w.toLowerCase(), x === "number" || x === "date" ? f[A] = parseFloat(T) || 0 : x === "string" ? f[A] = String(T) : f[A] = null, A < l.cells.length - 1 && p.push(w.toLowerCase());
      }
      let g = null;
      if (this.isDataDriven) {
        g = {};
        const A = l.getAttribute("data-ln-row-id");
        A != null && (g.id = A);
        for (let E = 0; E < d.length; E++) {
          const w = d[E].getAttribute("data-ln-col");
          if (w) {
            const T = E;
            if (T < l.cells.length) {
              const x = l.cells[T], D = x.textContent.trim();
              g[w] = x.hasAttribute("data-ln-value") ? x.getAttribute("data-ln-value") : D;
            }
          }
        }
      }
      this._data.push({
        sortKeys: f,
        rawTexts: a,
        html: l.outerHTML,
        searchText: p.join(" "),
        id: this.isDataDriven && g ? g.id : void 0,
        ...g
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, o.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const i = (this.currentSearch || "").trim().toLowerCase(), d = this.currentFilters || {}, r = Object.keys(d).length > 0;
      if (this._filteredData = this._data.filter(function(g) {
        if (i) {
          let A = !1;
          for (const E in g)
            if (g.hasOwnProperty(E) && typeof g[E] == "string" && E !== "html" && E !== "searchText" && g[E].toLowerCase().indexOf(i) !== -1) {
              A = !0;
              break;
            }
          if (!A) return !1;
        }
        if (r)
          for (const A in d) {
            const E = d[A];
            if (E && E.length > 0) {
              const w = g[A], T = w != null ? String(w) : "";
              if (E.indexOf(T) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const e = this.currentSort.field, f = this.currentSort.direction === "desc" ? -1 : 1;
      let a = null;
      if (this.ths) {
        for (let g = 0; g < this.ths.length; g++)
          if (this.ths[g].getAttribute("data-ln-col") === e) {
            a = this.ths[g].getAttribute(y);
            break;
          }
      }
      const p = t ? t.compare : function(g, A) {
        return g < A ? -1 : g > A ? 1 : 0;
      };
      this._filteredData.sort(function(g, A) {
        const E = g[e], w = A[e];
        if (a === "number" || a === "date") {
          const D = parseFloat(E) || 0, O = parseFloat(w) || 0;
          return (D - O) * f;
        }
        if (typeof E == "number" && typeof w == "number")
          return (E - w) * f;
        const T = E != null ? String(E) : "", x = w != null ? String(w) : "";
        return p(T, x) * f;
      });
    } else {
      const i = this._searchTerm, d = this._columnFilters, r = Object.keys(d).length > 0, e = this.ths, l = {};
      if (r)
        for (let A = 0; A < e.length; A++) {
          const E = e[A].getAttribute("data-ln-filter-col");
          E && (l[E] = A);
        }
      if (!i && !r ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(A) {
        if (i && A.searchText.indexOf(i) === -1) return !1;
        if (r)
          for (const E in d) {
            const w = l[E];
            if (w !== void 0 && d[E].indexOf(A.rawTexts[w]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const f = this._sortCol, a = this._sortDir === "desc" ? -1 : 1, p = this._sortType === "number" || this._sortType === "date", g = t ? t.compare : function(A, E) {
        return A < E ? -1 : A > E ? 1 : 0;
      };
      this._filteredData.sort(function(A, E) {
        const w = A.sortKeys[f], T = E.sortKeys[f];
        return p ? (w - T) * a : g(w, T) * a;
      });
    }
  }, o.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const i = document.createElement("colgroup");
    this.ths.forEach(function(d) {
      const r = document.createElement("col");
      r.style.width = d.offsetWidth + "px", i.appendChild(r);
    }), this.table.insertBefore(i, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = i;
  }, o.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const i = this._lastTotal, d = this.visibleCount;
        if (i === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || d === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const i = this._filteredData.length;
        i === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : i > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, o.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const i = this._filteredData, d = document.createDocumentFragment();
      for (let r = 0; r < i.length; r++) {
        const e = this._buildRow(i[r]);
        if (!e) break;
        d.appendChild(e);
      }
      this.tbody.textContent = "", this.tbody.appendChild(d), this._selectable && this._updateSelectAll();
    } else {
      const i = [], d = this._filteredData;
      for (let r = 0; r < d.length; r++) i.push(d[r].html);
      this.tbody.innerHTML = i.join("");
    }
  }, o.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    if (!this._rowHeight)
      if (this.isDataDriven) {
        if (this._data.length > 0) {
          const r = this._buildRow(this._data[0]);
          r && (this.tbody.textContent = "", this.tbody.appendChild(r), this._rowHeight = r.offsetHeight || 40, this.tbody.textContent = "");
        }
      } else {
        const r = this.tbody ? this.tbody.rows : [];
        r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40);
      }
    this.isDataDriven ? this._scrollContainer = c(this.dom) : this._scrollContainer = null;
    const d = this._scrollContainer || window;
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._renderVirtual();
      }));
    }, d.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, o.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, o.prototype._renderVirtual = function() {
    const i = this._filteredData, d = i.length, r = this._rowHeight;
    if (!r || !d) return;
    const e = this.thead ? this.thead.offsetHeight : 0, l = this._scrollContainer;
    let f, a;
    if (l) {
      const T = this.table.getBoundingClientRect(), x = l.getBoundingClientRect(), D = T.top - x.top + l.scrollTop + e;
      f = l.scrollTop - D, a = l.clientHeight;
    } else {
      const D = this.table.getBoundingClientRect().top + window.scrollY + e;
      f = window.scrollY - D, a = window.innerHeight;
    }
    let p = Math.max(0, Math.floor(f / r) - 15);
    p = Math.min(p, d);
    const g = Math.min(p + Math.ceil(a / r) + 30, d);
    if (p === this._vStart && g === this._vEnd) return;
    this._vStart = p, this._vEnd = g;
    const A = this.ths.length || 1, E = p * r, w = (d - g) * r;
    if (this.isDataDriven) {
      const T = document.createDocumentFragment();
      if (E > 0) {
        const x = document.createElement("tr");
        x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
        const D = document.createElement("td");
        D.setAttribute("colspan", A), D.style.height = E + "px", x.appendChild(D), T.appendChild(x);
      }
      for (let x = p; x < g; x++) {
        const D = this._buildRow(i[x]);
        D && T.appendChild(D);
      }
      if (w > 0) {
        const x = document.createElement("tr");
        x.className = "ln-table__spacer", x.setAttribute("aria-hidden", "true");
        const D = document.createElement("td");
        D.setAttribute("colspan", A), D.style.height = w + "px", x.appendChild(D), T.appendChild(x);
      }
      this.tbody.textContent = "", this.tbody.appendChild(T), this._selectable && this._updateSelectAll();
    } else {
      let T = "";
      E > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>');
      for (let x = p; x < g; x++) T += i[x].html;
      w > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = T;
    }
  }, o.prototype._showEmptyState = function() {
    const i = this.ths.length || 1;
    this.tbody.textContent = "";
    let d = null;
    if (this.isDataDriven) {
      const r = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount, l = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (e < r || e === 0), f = l ? this.name + "-empty-filtered" : this.name + "-empty";
      if (d = ot(this.dom, f, "ln-table"), !d) {
        const a = this.dom.querySelector("template[data-ln-empty]");
        if (a) {
          const p = l ? "search" : "initial", g = a.content.querySelector('[data-ln-empty-when="' + p + '"]') || a.content.firstElementChild;
          g && (d = document.importNode(g, !0));
        }
      }
      if (d)
        if (d.tagName === "TR")
          this.tbody.appendChild(d);
        else {
          const a = document.createElement("td");
          a.setAttribute("colspan", String(i)), a.appendChild(d);
          const p = document.createElement("tr");
          p.className = "ln-table__empty", p.appendChild(a), this.tbody.appendChild(p);
        }
    } else {
      const r = this.dom.querySelector("template[" + m + "]"), e = document.createElement("td");
      e.setAttribute("colspan", String(i)), r && e.appendChild(document.importNode(r.content, !0));
      const l = document.createElement("tr");
      l.className = "ln-table__empty", l.appendChild(e), this.tbody.appendChild(l);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, o.prototype._fillRow = function(i, d) {
    Lt(i, d);
    const r = i.querySelectorAll("[data-ln-cell-attr]");
    for (let e = 0; e < r.length; e++) {
      const l = r[e], f = l.getAttribute("data-ln-cell-attr").split(",");
      for (let a = 0; a < f.length; a++) {
        const p = f[a].trim().split(":");
        if (p.length !== 2) continue;
        const g = p[0].trim(), A = p[1].trim();
        d[g] != null && l.setAttribute(A, d[g]);
      }
    }
  }, o.prototype._buildRow = function(i) {
    const d = ot(this.dom, this.name + "-row", "ln-table");
    if (!d) return null;
    const r = d.querySelector("[data-ln-row]") || d.firstElementChild;
    if (!r) return null;
    if (this._fillRow(r, i), r._lnRecord = i, i.id != null && r.setAttribute("data-ln-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      r.classList.add("ln-row-selected");
      const e = r.querySelector("[data-ln-row-select]");
      e && (e.checked = !0);
    }
    return r;
  }, o.prototype._updateFilterOptions = function(i) {
    if (i !== null && typeof i == "object" && !Array.isArray(i)) {
      const d = Object.keys(i);
      for (let r = 0; r < d.length; r++) {
        const e = d[r], l = i[e];
        if (!Array.isArray(l)) continue;
        const f = {}, a = [];
        for (let p = 0; p < l.length; p++) {
          const g = String(l[p]);
          f[g] || (f[g] = !0, a.push(g));
        }
        this._filterOptions[e] = a.sort();
      }
    } else {
      const d = this._filterableFields, r = this._data;
      for (let e = 0; e < d.length; e++) {
        const l = d[e];
        this._filterOptions[l] || (this._filterOptions[l] = []);
        const f = this._filterOptions[l], a = {};
        for (let p = 0; p < f.length; p++)
          a[f[p]] = !0;
        for (let p = 0; p < r.length; p++) {
          const g = r[p][l];
          if (g != null) {
            const A = String(g);
            a[A] || (a[A] = !0, f.push(A));
          }
        }
        f.sort();
      }
    }
  }, o.prototype._getUniqueValues = function(i) {
    return (this._filterOptions[i] || []).slice().sort();
  }, o.prototype._updateFilterIndicators = function() {
    const i = this.ths;
    for (let d = 0; d < i.length; d++) {
      const r = i[d], e = r.getAttribute("data-ln-col");
      if (!e) continue;
      const l = r.querySelector("[data-ln-col-filter]");
      if (!l) continue;
      const f = this.currentFilters[e] && this.currentFilters[e].length > 0;
      l.classList.toggle("ln-filter-active", !!f);
    }
  }, o.prototype._applyFilterMutualExclusion = function(i, d) {
    const r = i.hasAttribute("data-ln-filter-reset"), e = d.querySelector("[data-ln-filter-reset]"), l = d.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');
    if (r) {
      i.checked = !0;
      for (let f = 0; f < l.length; f++) l[f].checked = !1;
    } else if (i.checked)
      e && (e.checked = !1);
    else {
      let f = !1;
      for (let a = 0; a < l.length; a++)
        if (l[a].checked) {
          f = !0;
          break;
        }
      !f && e && (e.checked = !0);
    }
  }, o.prototype._onFilterChange = function(i, d) {
    const r = d.querySelector("[data-ln-filter-reset]"), e = d.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])'), l = [];
    for (let a = 0; a < e.length; a++)
      e[a].checked && l.push(e[a].value);
    const f = r && r.checked || l.length === 0;
    f ? delete this.currentFilters[i] : this.currentFilters[i] = l, this._updateFilterIndicators(), S(this.dom, "ln-table:filter", {
      table: this.name,
      field: i,
      values: f ? [] : l
    }), this._requestData();
  }, o.prototype._openFilterDropdown = function(i, d, r) {
    this._closeFilterDropdown();
    const e = ot(this.dom, this.name + "-column-filter", "ln-table") || ot(this.dom, "column-filter", "ln-table");
    if (!e) return;
    const l = e.firstElementChild;
    if (!l) return;
    const f = this._getUniqueValues(i), a = l.querySelector("[data-ln-filter-options]"), p = l.querySelector("[data-ln-filter-search]"), g = this.currentFilters[i] || [], A = this;
    if (p && f.length <= 8 && p.classList.add("hidden"), a) {
      const E = a.querySelector("[data-ln-filter-reset]");
      E && (E.checked = g.length === 0);
      const w = ot(l, this.name + "-column-filter-item", "ln-table") || ot(l, "column-filter-item", "ln-table");
      if (w)
        for (let T = 0; T < f.length; T++) {
          const x = f[T], D = w.cloneNode(!0);
          et(D, { value: x });
          const O = D.querySelector('input[type="checkbox"]');
          O && (O.value = x, O.checked = g.length > 0 && g.indexOf(x) !== -1), a.appendChild(D);
        }
      a.addEventListener("change", function(T) {
        T.target.type === "checkbox" && (A._applyFilterMutualExclusion(T.target, a), A._onFilterChange(i, a));
      });
    }
    p && p.addEventListener("input", function() {
      const E = p.value.toLowerCase(), w = a.querySelectorAll("li");
      for (let T = 0; T < w.length; T++) {
        const x = w[T].textContent.toLowerCase();
        w[T].classList.toggle("hidden", E && x.indexOf(E) === -1);
      }
    }), d.appendChild(l), this._activeDropdown = { field: i, th: d, el: l }, l.addEventListener("click", function(E) {
      E.stopPropagation();
    });
  }, o.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, o.prototype._handleSort = function(i, d) {
    let r;
    !this.currentSort || this.currentSort.field !== i ? r = "asc" : this.currentSort.direction === "asc" ? r = "desc" : r = null;
    for (let e = 0; e < this.ths.length; e++)
      this.ths[e].classList.remove("ln-sort-asc", "ln-sort-desc");
    r ? (this.currentSort = { field: i, direction: r }, d.classList.add(r === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-table:sort", {
      table: this.name,
      field: i,
      direction: r
    }), this._requestData();
  }, o.prototype._requestData = function() {
    this._applyFilterAndSort(), this._vStart = -1, this._vEnd = -1, this._render(), this._updateFooter(), S(this.dom, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, o.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-row]");
    let d = i.length > 0;
    for (let r = 0; r < i.length; r++) {
      const e = i[r].getAttribute("data-ln-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        d = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = d;
  }, Object.defineProperty(o.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), o.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const i = this;
    if (this._onSelectionChange = function(d) {
      const r = d.target.closest("[data-ln-row-select]");
      if (!r) return;
      const e = r.closest("[data-ln-row]");
      if (!e) return;
      const l = e.getAttribute("data-ln-row-id");
      l != null && (r.checked ? (i.selectedIds.add(l), e.classList.add("ln-row-selected")) : (i.selectedIds.delete(l), e.classList.remove("ln-row-selected")), i.selectedCount = i.selectedIds.size, i._updateSelectAll(), i._updateFooter(), S(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const d = document.createElement("input");
      d.type = "checkbox", d.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(d), this._selectAllCheckbox = d;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const d = i._selectAllCheckbox.checked, r = i.tbody ? i.tbody.querySelectorAll("[data-ln-row]") : [];
      for (let e = 0; e < r.length; e++) {
        const l = r[e].getAttribute("data-ln-row-id"), f = r[e].querySelector("[data-ln-row-select]");
        l != null && (d ? (i.selectedIds.add(l), r[e].classList.add("ln-row-selected")) : (i.selectedIds.delete(l), r[e].classList.remove("ln-row-selected")), f && (f.checked = d));
      }
      i.selectedCount = i.selectedIds.size, S(i.dom, "ln-table:select-all", {
        table: i.name,
        selected: d
      }), S(i.dom, "ln-table:select", {
        table: i.name,
        selectedIds: i.selectedIds,
        count: i.selectedCount
      }), i._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const d = this.tbody.querySelectorAll("[data-ln-row]");
      for (let r = 0; r < d.length; r++) {
        const e = d[r].querySelector("[data-ln-row-select]"), l = d[r].getAttribute("data-ln-row-id");
        e && e.checked && l != null && (this.selectedIds.add(l), d[r].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, o.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const i = this.dom.querySelector("[data-ln-col-select]");
    if (i) {
      const d = i.querySelector('input[type="checkbox"]');
      d && d.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const d = this.tbody.querySelectorAll("[data-ln-row]");
      for (let r = 0; r < d.length; r++) {
        d[r].classList.remove("ln-row-selected");
        const e = d[r].querySelector("[data-ln-row-select]");
        e && (e.checked = !1);
      }
    }
    this._updateFooter();
  }, o.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const i = this._lastTotal != null ? this._lastTotal : this._data.length, d = this.visibleCount, r = d < i;
    if (this._totalSpan && (this._totalSpan.textContent = n(i)), this._filteredSpan && (this._filteredSpan.textContent = r ? n(d) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !r), this._selectedSpan) {
      const e = this.selectedIds.size;
      this._selectedSpan.textContent = e > 0 ? n(e) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, o.prototype._focusRow = function(i) {
    for (let d = 0; d < i.length; d++)
      i[d].classList.remove("ln-row-focused"), i[d].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const d = i[this._focusedRowIndex];
      d.classList.add("ln-row-focused"), d.setAttribute("tabindex", "0"), d.focus(), d.scrollIntoView({ block: "nearest" });
    }
  }, o.prototype.destroy = function() {
    this.dom[u] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[u]);
  }, B(h, u, o, "ln-table");
})();
(function() {
  const h = "data-ln-circular-progress", u = "lnCircularProgress";
  if (window[u] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", m = 36, _ = 16, b = 2 * Math.PI * _;
  function t(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, n.call(this), o.call(this), c.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  t.prototype.destroy = function() {
    this.dom[u] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[u]);
  };
  function s(i, d) {
    const r = document.createElementNS(y, i);
    for (const e in d)
      r.setAttribute(e, d[e]);
    return r;
  }
  function n() {
    this.svg = s("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: m / 2,
      cy: m / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
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
  function c() {
    const i = this, d = new MutationObserver(function(r) {
      for (const e of r)
        (e.attributeName === "data-ln-circular-progress" || e.attributeName === "data-ln-circular-progress-max") && o.call(i);
    });
    d.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = d;
  }
  function o() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, d = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let r = d > 0 ? i / d * 100 : 0;
    r < 0 && (r = 0), r > 100 && (r = 100);
    const e = b - r / 100 * b;
    this.progressCircle.setAttribute("stroke-dashoffset", e);
    const l = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = l !== null ? l : Math.round(r) + "%", S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: d,
      percentage: r
    });
  }
  B(h, u, t, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", u = "lnSortable", y = "data-ln-sortable-handle";
  if (window[u] !== void 0) return;
  function m(b) {
    this.dom = b, this.isEnabled = b.getAttribute(h) !== "disabled", this._dragging = null, b.setAttribute("aria-roledescription", "sortable list");
    const t = this;
    return this._onPointerDown = function(s) {
      t.isEnabled && t._handlePointerDown(s);
    }, b.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, m.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, m.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[u]);
  }, m.prototype._handlePointerDown = function(b) {
    let t = b.target.closest("[" + y + "]"), s;
    if (t) {
      for (s = t; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (s = b.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      t = s;
    }
    const c = Array.from(this.dom.children).indexOf(s);
    if (V(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: c
    }).defaultPrevented) return;
    b.preventDefault(), t.setPointerCapture(b.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: c
    });
    const i = this, d = function(e) {
      i._handlePointerMove(e);
    }, r = function(e) {
      i._handlePointerEnd(e), t.removeEventListener("pointermove", d), t.removeEventListener("pointerup", r), t.removeEventListener("pointercancel", r);
    };
    t.addEventListener("pointermove", d), t.addEventListener("pointerup", r), t.addEventListener("pointercancel", r);
  }, m.prototype._handlePointerMove = function(b) {
    if (!this._dragging) return;
    const t = Array.from(this.dom.children), s = this._dragging;
    for (const n of t)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of t) {
      if (n === s) continue;
      const c = n.getBoundingClientRect(), o = c.top + c.height / 2;
      if (b.clientY >= c.top && b.clientY < o) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (b.clientY >= o && b.clientY <= c.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(b) {
    if (!this._dragging) return;
    const t = this._dragging, s = Array.from(this.dom.children), n = s.indexOf(t);
    let c = null, o = null;
    for (const i of s) {
      if (i.classList.contains("ln-sortable--drop-before")) {
        c = i, o = "before";
        break;
      }
      if (i.classList.contains("ln-sortable--drop-after")) {
        c = i, o = "after";
        break;
      }
    }
    for (const i of s)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (t.classList.remove("ln-sortable--dragging"), t.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), c && c !== t) {
      o === "before" ? this.dom.insertBefore(t, c) : this.dom.insertBefore(t, c.nextElementSibling);
      const d = Array.from(this.dom.children).indexOf(t);
      S(this.dom, "ln-sortable:reordered", {
        item: t,
        oldIndex: n,
        newIndex: d
      });
    }
    this._dragging = null;
  };
  function _(b) {
    const t = b[u];
    if (!t) return;
    const s = b.getAttribute(h) !== "disabled";
    s !== t.isEnabled && (t.isEnabled = s, S(b, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: b }));
  }
  B(h, u, m, "ln-sortable", {
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-confirm", u = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[u] !== void 0) return;
  function _(b) {
    this.dom = b, this.confirming = !1, this.originalText = b.textContent.trim(), this.confirmText = b.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const t = this;
    return this._onClick = function(s) {
      if (!t.confirming)
        s.preventDefault(), s.stopImmediatePropagation(), t._enterConfirm();
      else {
        if (t._submitted) return;
        t._submitted = !0, t._reset();
      }
    }, b.addEventListener("click", this._onClick), this;
  }
  _.prototype._getTimeout = function() {
    const b = parseFloat(this.dom.getAttribute(y));
    return isNaN(b) || b <= 0 ? 3 : b;
  }, _.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var b = this.dom.querySelector("svg.ln-icon use");
    b && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = b.getAttribute("href"), b.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, _.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const b = this, t = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      b._reset();
    }, t);
  }, _.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var b = this.dom.querySelector("svg.ln-icon use");
      b && this.originalIconHref && b.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, _.prototype.destroy = function() {
    this.dom[u] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[u]);
  }, B(h, u, _, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", u = "lnTranslations";
  if (window[u] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(_) {
    this.dom = _, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = _.getAttribute(h + "-default") || "", this.badgesEl = _.querySelector("[" + h + "-active]"), this.menuEl = _.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const b = _.getAttribute(h + "-locales");
    if (this.locales = y, b)
      try {
        this.locales = JSON.parse(b);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const t = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && t.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && t.removeLanguage(s.detail.lang);
    }, _.addEventListener("ln-translations:request-add", this._onRequestAdd), _.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const _ = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of _) {
      const t = b.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of t)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, m.prototype._detectExisting = function() {
    const _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const b of _) {
      const t = b.getAttribute("data-ln-translatable-lang");
      t && t !== this.defaultLang && this.activeLanguages.add(t);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, m.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const _ = this;
    let b = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      b++;
      const n = Et("ln-translations-menu-item", "ln-translations");
      if (!n) return;
      const c = n.querySelector("[data-ln-translations-lang]");
      c.setAttribute("data-ln-translations-lang", s), c.textContent = this.locales[s], c.addEventListener("click", function(o) {
        o.ctrlKey || o.metaKey || o.button === 1 || (o.preventDefault(), o.stopPropagation(), _.menuEl.getAttribute("data-ln-toggle") === "open" && _.menuEl.setAttribute("data-ln-toggle", "close"), _.addLanguage(s));
      }), this.menuEl.appendChild(n);
    }
    const t = this.dom.querySelector("[" + h + "-add]");
    t && (t.style.display = b === 0 ? "none" : "");
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const _ = this;
    this.activeLanguages.forEach(function(b) {
      const t = Et("ln-translations-badge", "ln-translations");
      if (!t) return;
      const s = t.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", b);
      const n = s.querySelector("span");
      n.textContent = _.locales[b] || b.toUpperCase();
      const c = s.querySelector("button");
      c.setAttribute("aria-label", "Remove " + (_.locales[b] || b.toUpperCase())), c.addEventListener("click", function(o) {
        o.ctrlKey || o.metaKey || o.button === 1 || (o.preventDefault(), o.stopPropagation(), _.removeLanguage(b));
      }), _.badgesEl.appendChild(t);
    });
  }, m.prototype.addLanguage = function(_, b) {
    if (this.activeLanguages.has(_)) return;
    const t = this.locales[_] || _;
    if (V(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: _,
      langName: t
    }).defaultPrevented) return;
    this.activeLanguages.add(_), b = b || {};
    const n = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const c of n) {
      const o = c.getAttribute("data-ln-translatable"), i = c.getAttribute("data-ln-translations-prefix") || "", d = c.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!d) continue;
      const r = d.cloneNode(!1);
      i ? r.name = i + "[trans][" + _ + "][" + o + "]" : r.name = "trans[" + _ + "][" + o + "]", r.value = b[o] !== void 0 ? b[o] : "", r.removeAttribute("id"), r.placeholder = t + " translation", r.setAttribute("data-ln-translatable-lang", _);
      const e = c.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), l = e.length > 0 ? e[e.length - 1] : d;
      l.parentNode.insertBefore(r, l.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: _,
      langName: t
    });
  }, m.prototype.removeLanguage = function(_) {
    if (!this.activeLanguages.has(_) || V(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: _
    }).defaultPrevented) return;
    const t = this.dom.querySelectorAll('[data-ln-translatable-lang="' + _ + '"]');
    for (const s of t)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(_), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
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
    for (const t of b)
      t.getAttribute("data-ln-translatable-lang") !== _ && t.parentNode.removeChild(t);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[u];
  }, B(h, u, m, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", u = "lnAutosave", y = "data-ln-autosave-clear", m = "data-ln-autosave-debounce-input", _ = "ln-autosave:";
  if (window[u] !== void 0) return;
  function t(o) {
    const i = s(o);
    if (!i) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", o);
      return;
    }
    this.dom = o, this.key = i;
    let d = null;
    function r() {
      const a = Ct(o);
      try {
        localStorage.setItem(i, JSON.stringify(a));
      } catch {
        return;
      }
      S(o, "ln-autosave:saved", { target: o, data: a });
    }
    function e() {
      let a;
      try {
        a = localStorage.getItem(i);
      } catch {
        return;
      }
      if (!a) return;
      let p;
      try {
        p = JSON.parse(a);
      } catch {
        return;
      }
      if (V(o, "ln-autosave:before-restore", { target: o, data: p }).defaultPrevented) return;
      const A = Tt(o, p);
      for (let E = 0; E < A.length; E++)
        A[E].dispatchEvent(new Event("input", { bubbles: !0 })), A[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(o, "ln-autosave:restored", { target: o, data: p });
    }
    function l() {
      try {
        localStorage.removeItem(i);
      } catch {
        return;
      }
      S(o, "ln-autosave:cleared", { target: o });
    }
    this._onFocusout = function(a) {
      const p = a.target;
      n(p) && p.name && r();
    }, this._onChange = function(a) {
      const p = a.target;
      n(p) && p.name && r();
    }, this._onSubmit = function() {
      l();
    }, this._onReset = function() {
      l();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + y + "]") && l();
    }, o.addEventListener("focusout", this._onFocusout), o.addEventListener("change", this._onChange), o.addEventListener("submit", this._onSubmit), o.addEventListener("reset", this._onReset), o.addEventListener("click", this._onClearClick);
    const f = c(o);
    return f > 0 && (this._onInput = function(a) {
      const p = a.target;
      !n(p) || !p.name || (d !== null && clearTimeout(d), d = setTimeout(r, f));
    }, o.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return d;
    }, e(), this;
  }
  t.prototype.destroy = function() {
    if (this.dom[u]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const o = this._getInputTimer();
        o !== null && clearTimeout(o);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[u];
    }
  };
  function s(o) {
    const d = o.getAttribute(h) || o.id;
    return d ? _ + window.location.pathname + ":" + d : null;
  }
  function n(o) {
    const i = o.tagName;
    return i === "INPUT" || i === "TEXTAREA" || i === "SELECT";
  }
  function c(o) {
    if (!o.hasAttribute(m)) return 0;
    const i = o.getAttribute(m);
    if (i === "" || i === null) return 1e3;
    const d = parseInt(i, 10);
    return isNaN(d) || d < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", o), 1e3) : d;
  }
  B(h, u, t, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", u = "lnAutoresize";
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
  }, B(h, u, y, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", u = "lnValidate", y = "data-ln-validate-errors", m = "data-ln-validate-error", _ = "ln-validate-valid", b = "ln-validate-invalid", t = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[u] !== void 0) return;
  function s(n) {
    this.dom = n, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const c = this, o = n.tagName, i = n.type, d = o === "SELECT" || i === "checkbox" || i === "radio";
    return this._onInput = function() {
      c._touched = !0, c.validate();
    }, this._onChange = function() {
      c._touched = !0, c.validate();
    }, this._onSetCustom = function(r) {
      const e = r.detail && r.detail.error;
      if (!e) return;
      c._customErrors.add(e), c._touched = !0;
      const l = n.closest(".form-element");
      if (l) {
        const f = l.querySelector("[" + m + '="' + e + '"]');
        f && f.classList.remove("hidden");
      }
      n.classList.remove(_), n.classList.add(b);
    }, this._onClearCustom = function(r) {
      const e = r.detail && r.detail.error, l = n.closest(".form-element");
      if (e) {
        if (c._customErrors.delete(e), l) {
          const f = l.querySelector("[" + m + '="' + e + '"]');
          f && f.classList.add("hidden");
        }
      } else
        c._customErrors.forEach(function(f) {
          if (l) {
            const a = l.querySelector("[" + m + '="' + f + '"]');
            a && a.classList.add("hidden");
          }
        }), c._customErrors.clear();
      c._touched && c.validate();
    }, d || n.addEventListener("input", this._onInput), n.addEventListener("change", this._onChange), n.addEventListener("ln-validate:set-custom", this._onSetCustom), n.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  s.prototype.validate = function() {
    const n = this.dom, c = n.validity, i = n.checkValidity() && this._customErrors.size === 0, d = n.closest(".form-element");
    if (d) {
      const e = d.querySelector("[" + y + "]");
      if (e) {
        const l = e.querySelectorAll("[" + m + "]");
        for (let f = 0; f < l.length; f++) {
          const a = l[f].getAttribute(m), p = t[a];
          p && (c[p] ? l[f].classList.remove("hidden") : l[f].classList.add("hidden"));
        }
      }
    }
    return n.classList.toggle(_, i), n.classList.toggle(b, !i), S(n, i ? "ln-validate:valid" : "ln-validate:invalid", { target: n, field: n.name }), i;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, b);
    const n = this.dom.closest(".form-element");
    if (n) {
      const c = n.querySelectorAll("[" + m + "]");
      for (let o = 0; o < c.length; o++)
        c[o].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(_, b), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[u]);
  }, B(h, u, s, "ln-validate");
})();
(function() {
  const h = "data-ln-form", u = "lnForm", y = "data-ln-form-auto", m = "data-ln-form-debounce", _ = "data-ln-validate", b = "lnValidate";
  if (window[u] !== void 0) return;
  function t(s) {
    this.dom = s, this._debounceTimer = null;
    const n = this;
    if (this._onValid = function() {
      n._updateSubmitButton();
    }, this._onInvalid = function() {
      n._updateSubmitButton();
    }, this._onSubmit = function(c) {
      c.preventDefault(), n.submit();
    }, this._onFill = function(c) {
      c.detail && n.fill(c.detail);
    }, this._onFormReset = function() {
      n.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        n._resetValidation();
      }, 0);
    }, s.addEventListener("ln-validate:valid", this._onValid), s.addEventListener("ln-validate:invalid", this._onInvalid), s.addEventListener("submit", this._onSubmit), s.addEventListener("ln-form:fill", this._onFill), s.addEventListener("ln-form:reset", this._onFormReset), s.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, s.hasAttribute(y)) {
      const c = parseInt(s.getAttribute(m)) || 0;
      this._onAutoInput = function() {
        c > 0 ? (clearTimeout(n._debounceTimer), n._debounceTimer = setTimeout(function() {
          n.submit();
        }, c)) : n.submit();
      }, s.addEventListener("input", this._onAutoInput), s.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  t.prototype._updateSubmitButton = function() {
    const s = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!s.length) return;
    const n = this.dom.querySelectorAll("[" + _ + "]");
    let c = !1;
    if (n.length > 0) {
      let o = !1, i = !1;
      for (let d = 0; d < n.length; d++) {
        const r = n[d][b];
        r && r._touched && (o = !0), n[d].checkValidity() || (i = !0);
      }
      c = i || !o;
    }
    for (let o = 0; o < s.length; o++)
      s[o].disabled = c;
  }, t.prototype.fill = function(s) {
    const n = Tt(this.dom, s);
    for (let c = 0; c < n.length; c++) {
      const o = n[c], i = o.tagName === "SELECT" || o.type === "checkbox" || o.type === "radio";
      o.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
  }, t.prototype.submit = function() {
    const s = this.dom.querySelectorAll("[" + _ + "]");
    let n = !0;
    for (let o = 0; o < s.length; o++) {
      const i = s[o][b];
      i && (i.validate() || (n = !1));
    }
    if (!n) return;
    const c = Ct(this.dom);
    S(this.dom, "ln-form:submit", { data: c });
  }, t.prototype.reset = function() {
    this.dom.reset();
    const s = this.dom.querySelectorAll("input, textarea, select");
    for (let n = 0; n < s.length; n++) {
      const c = s[n], o = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(o ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), S(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, t.prototype._resetValidation = function() {
    const s = this.dom.querySelectorAll("[" + _ + "]");
    for (let n = 0; n < s.length; n++) {
      const c = s[n][b];
      c && c.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(t.prototype, "isValid", {
    get: function() {
      const s = this.dom.querySelectorAll("[" + _ + "]");
      for (let n = 0; n < s.length; n++)
        if (!s[n].checkValidity()) return !1;
      return !0;
    }
  }), t.prototype.destroy = function() {
    this.dom[u] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[u]);
  }, B(h, u, t, "ln-form");
})();
(function() {
  const h = "data-ln-time", u = "lnTime";
  if (window[u] !== void 0) return;
  const y = {}, m = {};
  function _(E) {
    return E.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function b(E, w) {
    const T = (E || "") + "|" + JSON.stringify(w);
    return y[T] || (y[T] = new Intl.DateTimeFormat(E, w)), y[T];
  }
  function t(E) {
    const w = E || "";
    return m[w] || (m[w] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), m[w];
  }
  const s = /* @__PURE__ */ new Set();
  let n = null;
  function c() {
    n || (n = setInterval(i, 6e4));
  }
  function o() {
    n && (clearInterval(n), n = null);
  }
  function i() {
    for (const E of s) {
      if (!document.body.contains(E.dom)) {
        s.delete(E);
        continue;
      }
      a(E);
    }
    s.size === 0 && o();
  }
  function d(E, w) {
    return b(w, { dateStyle: "long", timeStyle: "short" }).format(E);
  }
  function r(E, w) {
    const T = /* @__PURE__ */ new Date(), x = { month: "short", day: "numeric" };
    return E.getFullYear() !== T.getFullYear() && (x.year = "numeric"), b(w, x).format(E);
  }
  function e(E, w) {
    return b(w, { dateStyle: "medium" }).format(E);
  }
  function l(E, w) {
    return b(w, { timeStyle: "short" }).format(E);
  }
  function f(E, w) {
    const T = Math.floor(Date.now() / 1e3), D = Math.floor(E.getTime() / 1e3) - T, O = Math.abs(D);
    if (O < 10) return t(w).format(0, "second");
    let M, F;
    if (O < 60)
      M = "second", F = D;
    else if (O < 3600)
      M = "minute", F = Math.round(D / 60);
    else if (O < 86400)
      M = "hour", F = Math.round(D / 3600);
    else if (O < 604800)
      M = "day", F = Math.round(D / 86400);
    else if (O < 2592e3)
      M = "week", F = Math.round(D / 604800);
    else
      return r(E, w);
    return t(w).format(F, M);
  }
  function a(E) {
    const w = E.dom.getAttribute("datetime");
    if (!w) return;
    const T = Number(w);
    if (isNaN(T)) return;
    const x = new Date(T * 1e3), D = E.dom.getAttribute(h) || "short", O = _(E.dom);
    let M;
    switch (D) {
      case "relative":
        M = f(x, O);
        break;
      case "full":
        M = d(x, O);
        break;
      case "date":
        M = e(x, O);
        break;
      case "time":
        M = l(x, O);
        break;
      default:
        M = r(x, O);
        break;
    }
    E.dom.textContent = M, D !== "full" && (E.dom.title = d(x, O));
  }
  function p(E) {
    return this.dom = E, a(this), E.getAttribute(h) === "relative" && (s.add(this), c()), this;
  }
  p.prototype.render = function() {
    a(this);
  }, p.prototype.destroy = function() {
    s.delete(this), s.size === 0 && o(), delete this.dom[u];
  };
  function g(E) {
    const w = E[u];
    if (!w) return;
    E.getAttribute(h) === "relative" ? (s.add(w), c()) : (s.delete(w), s.size === 0 && o()), a(w);
  }
  function A(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(h) && E[u] && a(E[u]);
  }
  B(h, u, p, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: g,
    onInit: A
  });
})();
(function() {
  const h = "data-ln-data-store", u = "lnDataStore";
  if (window[u] !== void 0) return;
  const y = "ln_app_cache", m = "_meta", _ = "1.0";
  let b = null, t = null;
  const s = {};
  function n() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (L) => {
        const C = Math.random() * 16 | 0;
        return (L === "x" ? C : C & 3 | 8).toString(16);
      });
    }
  }
  function c(v) {
    v && v.name === "QuotaExceededError" && S(document, "ln-store:quota-exceeded", { error: v });
  }
  function o() {
    const v = {};
    for (const L of document.querySelectorAll(`[${h}]`)) {
      const C = L.getAttribute(h);
      if (C) {
        const k = L.getAttribute("data-ln-data-store-indexes") || L.getAttribute("data-ln-store-indexes") || "";
        v[C] = {
          indexes: k.split(",").map((I) => I.trim()).filter(Boolean)
        };
      }
    }
    return v;
  }
  function i() {
    return t || (t = new Promise((v) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), v(null);
      const L = o(), C = Object.keys(L), k = indexedDB.open(y);
      k.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), v(null);
      }, k.onsuccess = (I) => {
        const q = I.target.result, N = Array.from(q.objectStoreNames);
        if (!(!N.includes(m) || C.some((ht) => !N.includes(ht))))
          return d(q), b = q, v(q);
        const X = q.version;
        q.close();
        const tt = indexedDB.open(y, X + 1);
        tt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, tt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), v(null);
        }, tt.onupgradeneeded = (ht) => {
          const nt = ht.target.result;
          nt.objectStoreNames.contains(m) || nt.createObjectStore(m, { keyPath: "key" });
          for (const bt of C)
            if (!nt.objectStoreNames.contains(bt)) {
              const Rt = nt.createObjectStore(bt, { keyPath: "id" });
              for (const wt of L[bt].indexes)
                Rt.createIndex(wt, wt, { unique: !1 });
            }
        }, tt.onsuccess = (ht) => {
          const nt = ht.target.result;
          d(nt), b = nt, v(nt);
        };
      };
    }), t);
  }
  function d(v) {
    v.onversionchange = () => {
      v.close(), b = null, t = null;
    };
  }
  function r() {
    return b ? Promise.resolve(b) : (t = null, i());
  }
  async function e(v) {
    if (!ft() || !v) return v;
    const L = { ...v }, C = L.id, k = L._pending, I = await Ht(L);
    return !I || !I.encrypted ? v : {
      id: C,
      _pending: k,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function l(v) {
    return !v || !v.encrypted || !ft() ? v : Ut(v);
  }
  const f = (v, L) => r().then((C) => C ? C.transaction(v, L).objectStore(v) : null);
  function a(v) {
    return new Promise((L, C) => {
      v.onsuccess = () => L(v.result), v.onerror = () => {
        c(v.error), C(v.error);
      };
    });
  }
  const p = (v) => f(v, "readonly").then((L) => L ? a(L.getAll()) : []).then((L) => ft() ? Promise.all(L.map((C) => l(C))) : L), g = (v, L) => f(v, "readonly").then((C) => C ? a(C.get(L)) : null).then((C) => C ? l(C) : null), A = (v, L) => (ft() ? e(L) : Promise.resolve(L)).then((k) => f(v, "readwrite").then((I) => I ? a(I.put(k)) : null)), E = (v, L) => f(v, "readwrite").then((C) => C ? a(C.delete(L)) : null), w = (v) => f(v, "readwrite").then((L) => L ? a(L.clear()) : null), T = (v) => f(v, "readonly").then((L) => L ? a(L.count()) : 0), x = (v) => f(m, "readonly").then((L) => L ? a(L.get(v)) : null), D = (v, L) => f(m, "readwrite").then((C) => {
    if (C)
      return L.key = v, a(C.put(L));
  });
  function O(v) {
    this.dom = v, this._name = v.getAttribute(h);
    const L = v.getAttribute("data-ln-data-store-stale") || v.getAttribute("data-ln-store-stale"), C = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(C) ? 300 : C;
    const k = v.getAttribute("data-ln-data-store-search-fields") || v.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = k.split(",").map((I) => I.trim()).filter(Boolean), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, s[this._name] = this, M(this), mt(this), this;
  }
  function M(v) {
    v._handlers = {
      create: (L) => F(v, L.detail),
      update: (L) => j(v, L.detail),
      delete: (L) => $(v, L.detail),
      "bulk-delete": (L) => Q(v, L.detail)
    };
    for (const [L, C] of Object.entries(v._handlers))
      v.dom.addEventListener(`ln-store:request-${L}`, C);
  }
  function F(v, { data: L = {} } = {}) {
    const C = `_temp_${n()}`, k = { ...L, id: C, _pending: !0 };
    A(v._name, k).then(() => {
      v.totalCount++, S(v.dom, "ln-store:created", { store: v._name, record: k, tempId: C }), S(v.dom, "ln-store:request-remote-create", { tempId: C, data: L });
    });
  }
  function j(v, { id: L, data: C = {}, expected_version: k } = {}) {
    g(v._name, L).then((I) => {
      if (!I) throw new Error(`Record not found: ${L}`);
      v._pendingSnapshots[L] = { ...I };
      const q = { ...I, ...C, _pending: !0 };
      return A(v._name, q).then(() => {
        S(v.dom, "ln-store:updated", { store: v._name, record: q, previous: v._pendingSnapshots[L] }), S(v.dom, "ln-store:request-remote-update", { id: L, data: C, expected_version: k });
      });
    }).catch((I) => console.error("[ln-data-store] Optimistic update failed:", I));
  }
  function $(v, { id: L } = {}) {
    g(v._name, L).then((C) => {
      if (C)
        return v._pendingSnapshots[L] = { ...C }, E(v._name, L).then(() => {
          v.totalCount--, S(v.dom, "ln-store:deleted", { store: v._name, id: L }), S(v.dom, "ln-store:request-remote-delete", { id: L });
        });
    }).catch((C) => console.error("[ln-data-store] Optimistic delete failed:", C));
  }
  function Q(v, { ids: L = [] } = {}) {
    L.length && Promise.all(L.map((C) => g(v._name, C))).then((C) => {
      const k = C.filter(Boolean), I = k.map((q) => q.id);
      return v._pendingSnapshots[I.join(",")] = k, R(v._name, I).then(() => {
        v.totalCount -= I.length, S(v.dom, "ln-store:deleted", { store: v._name, ids: I }), S(v.dom, "ln-store:request-remote-bulk-delete", { ids: I });
      });
    }).catch((C) => console.error("[ln-data-store] Optimistic bulk delete failed:", C));
  }
  function mt(v) {
    i().then(() => x(v._name)).then((L) => {
      L && L.schema_version === _ ? (v.lastSyncedAt = L.last_synced_at || null, v.totalCount = L.record_count || 0, v.totalCount > 0 ? (v.isLoaded = !0, S(v.dom, "ln-store:ready", { store: v._name, count: v.totalCount, source: "cache" }), at(v) && Y(v)) : Y(v)) : L && L.schema_version !== _ ? w(v._name).then(() => D(v._name, { schema_version: _, last_synced_at: null, record_count: 0 })).then(() => Y(v)) : Y(v);
    });
  }
  function at(v) {
    return v._staleThreshold === -1 ? !1 : v.lastSyncedAt ? Math.floor(Date.now() / 1e3) - v.lastSyncedAt > v._staleThreshold : !0;
  }
  function Y(v) {
    v.isSyncing = !0, S(v.dom, "ln-store:request-remote-sync", { since: v.lastSyncedAt });
  }
  function lt(v, L) {
    return r().then((C) => C ? (ft() ? Promise.all(L.map((I) => e(I))) : Promise.resolve(L)).then((I) => new Promise((q, N) => {
      const U = C.transaction(v, "readwrite"), X = U.objectStore(v);
      I.forEach((tt) => X.put(tt)), U.oncomplete = () => q(), U.onerror = () => {
        c(U.error), N(U.error);
      };
    })) : void 0);
  }
  function R(v, L) {
    return r().then((C) => {
      if (C)
        return new Promise((k, I) => {
          const q = C.transaction(v, "readwrite"), N = q.objectStore(v);
          L.forEach((U) => N.delete(U)), q.oncomplete = () => k(), q.onerror = () => I(q.error);
        });
    });
  }
  let P = () => {
    document.visibilityState === "visible" && Object.values(s).forEach((v) => {
      v.isLoaded && !v.isSyncing && at(v) && Y(v);
    });
  };
  document.addEventListener("visibilitychange", P);
  const H = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function rt(v, L) {
    if (!L || !L.field) return v;
    const { field: C, direction: k } = L, I = k === "desc";
    return [...v].sort((q, N) => {
      const U = q[C], X = N[C];
      if (U == null && X == null) return 0;
      if (U == null) return I ? 1 : -1;
      if (X == null) return I ? -1 : 1;
      const tt = typeof U == "string" && typeof X == "string" ? H.compare(U, X) : U < X ? -1 : U > X ? 1 : 0;
      return I ? -tt : tt;
    });
  }
  function ct(v, L) {
    if (!L) return v;
    const C = Object.keys(L).filter((k) => Array.isArray(L[k]) && L[k].length > 0);
    return C.length ? v.filter(
      (k) => C.every((I) => L[I].map(String).includes(String(k[I])))
    ) : v;
  }
  function W(v, L, C) {
    if (!L || !C || !C.length) return v;
    const k = L.toLowerCase();
    return v.filter(
      (I) => C.some((q) => {
        const N = I[q];
        return N != null && String(N).toLowerCase().includes(k);
      })
    );
  }
  function dt(v, L, C) {
    if (!v.length) return 0;
    if (C === "count") return v.length;
    const k = v.map((q) => parseFloat(q[L])).filter((q) => !isNaN(q)), I = k.reduce((q, N) => q + N, 0);
    return C === "sum" ? I : C === "avg" && k.length ? I / k.length : 0;
  }
  function Z(v, L) {
    if (!v.presenters || !v.presenters.computed) return L;
    const C = v.presenters.computed;
    return L.map((k) => {
      const I = { ...k };
      for (const [q, N] of Object.entries(C))
        try {
          I[q] = N(k);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${q}`, U);
        }
      return I;
    });
  }
  O.prototype.getAll = function(v = {}) {
    const L = this;
    return p(L._name).then((C) => {
      const k = C.length;
      v.filters && (C = ct(C, v.filters)), v.search && (C = W(C, v.search, L._searchFields));
      const I = C.length;
      if (v.sort && (C = rt(C, v.sort)), v.offset || v.limit) {
        const q = v.offset || 0, N = v.limit || C.length;
        C = C.slice(q, q + N);
      }
      return {
        data: Z(L, C),
        total: k,
        filtered: I
      };
    });
  }, O.prototype.getById = function(v) {
    return g(this._name, v).then((L) => L ? Z(this, [L])[0] : null);
  }, O.prototype.count = function(v) {
    return v ? p(this._name).then((L) => ct(L, v).length) : T(this._name);
  }, O.prototype.aggregate = function(v, L) {
    return p(this._name).then((C) => dt(C, v, L));
  }, O.prototype.setPresenters = function(v) {
    this.presenters = v;
  }, O.prototype.applySync = function(v, L, C) {
    const k = this, I = v.length > 0 || L.length > 0;
    let q = Promise.resolve();
    return v.length > 0 && (q = q.then(() => lt(k._name, v))), L.length > 0 && (q = q.then(() => R(k._name, L))), q.then(() => T(k._name)).then((N) => (k.totalCount = N, D(k._name, {
      schema_version: _,
      last_synced_at: C,
      record_count: N
    }))).then(() => {
      const N = !k.isLoaded;
      k.isLoaded = !0, k.isSyncing = !1, k.lastSyncedAt = C, N ? (S(k.dom, "ln-store:loaded", { store: k._name, count: k.totalCount }), S(k.dom, "ln-store:ready", { store: k._name, count: k.totalCount, source: "server" })) : S(k.dom, "ln-store:synced", {
        store: k._name,
        added: v.length,
        deleted: L.length,
        changed: I
      });
    }).catch((N) => {
      k.isSyncing = !1, console.error("[ln-data-store] applySync failed:", N);
    });
  }, O.prototype.confirmMutation = function(v, L, C) {
    const k = this, I = {
      create: () => E(k._name, v).then(() => A(k._name, L)).then(() => {
        delete k._pendingSnapshots[v], S(k.dom, "ln-store:confirmed", { store: k._name, record: L, tempId: v, action: "create" });
      }),
      update: () => A(k._name, L).then(() => {
        delete k._pendingSnapshots[v], S(k.dom, "ln-store:confirmed", { store: k._name, record: L, action: "update" });
      }),
      delete: () => (delete k._pendingSnapshots[v], S(k.dom, "ln-store:confirmed", { store: k._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete k._pendingSnapshots[v], S(k.dom, "ln-store:confirmed", { store: k._name, record: null, ids: v.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return I[C] ? I[C]() : Promise.resolve();
  }, O.prototype.revertMutation = function(v, L, C) {
    const k = this, I = C || `Server rejected ${L}`, q = {
      create: () => E(k._name, v).then(() => {
        k.totalCount--, delete k._pendingSnapshots[v], S(k.dom, "ln-store:reverted", { store: k._name, record: null, action: "create", error: I });
      }),
      update: () => {
        const N = k._pendingSnapshots[v];
        return N ? A(k._name, N).then(() => {
          delete k._pendingSnapshots[v], S(k.dom, "ln-store:reverted", { store: k._name, record: N, action: "update", error: I });
        }) : Promise.resolve();
      },
      delete: () => {
        const N = k._pendingSnapshots[v];
        return N ? A(k._name, N).then(() => {
          k.totalCount++, delete k._pendingSnapshots[v], S(k.dom, "ln-store:reverted", { store: k._name, record: N, action: "delete", error: I });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const N = k._pendingSnapshots[v];
        return !N || !N.length ? Promise.resolve() : lt(k._name, N).then(() => {
          k.totalCount += N.length, delete k._pendingSnapshots[v], S(k.dom, "ln-store:reverted", { store: k._name, record: null, ids: v.split(","), action: "bulk-delete", error: I });
        });
      }
    };
    return q[L] ? q[L]() : Promise.resolve();
  }, O.prototype.resolveConflict = function(v, L, C) {
    const k = this._pendingSnapshots[v];
    return k ? A(this._name, k).then(() => {
      delete this._pendingSnapshots[v], S(this.dom, "ln-store:conflict", {
        store: this._name,
        local: k,
        remote: L,
        field_diffs: C || null
      });
    }) : Promise.resolve();
  }, O.prototype.forceSync = function() {
    Y(this);
  }, O.prototype.fullReload = function() {
    const v = this;
    return w(v._name).then(() => {
      v.isLoaded = !1, v.lastSyncedAt = null, v.totalCount = 0, Y(v);
    });
  }, O.prototype.destroy = function() {
    if (this._handlers) {
      for (const [v, L] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${v}`, L);
      this._handlers = null;
    }
    delete s[this._name], Object.keys(s).length === 0 && P && (document.removeEventListener("visibilitychange", P), P = null), delete this.dom[u], S(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function ut() {
    return r().then((v) => {
      if (!v) return;
      const L = Array.from(v.objectStoreNames);
      return new Promise((C, k) => {
        const I = v.transaction(L, "readwrite");
        L.forEach((q) => I.objectStore(q).clear()), I.oncomplete = () => C(), I.onerror = () => k(I.error);
      });
    }).then(() => {
      Object.values(s).forEach((v) => {
        v.isLoaded = !1, v.isSyncing = !1, v.lastSyncedAt = null, v.totalCount = 0;
      });
    });
  }
  B(h, u, O, "ln-data-store"), window[u].clearAll = ut, window[u].init = window[u], window[u].setStorageKey = St, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = St);
})();
(function() {
  const h = "data-ln-api-connector", u = "lnApiConnector", y = "lnConnector";
  if (window[u] !== void 0) return;
  function m(t) {
    return this.dom = t, t[u] = this, t[y] = this, this.refreshConfig(), this._handlers = null, _(this), this;
  }
  m.prototype.refreshConfig = function() {
    const t = this.dom;
    this.baseUrl = t.getAttribute("data-ln-api-base-url") || "", this.path = t.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const s = t.getAttribute("data-ln-api-headers") || "";
    this.headers = xt(s, "ln-api-connector"), (s.toLowerCase().includes("authorization") || s.toLowerCase().includes("bearer") || s.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(t, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, m.prototype.fetchDelta = function(t) {
    const s = this;
    let n = z(s.baseUrl, s.path);
    return t != null && t !== "" && (n += (n.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(t)), window.fetch(n, { method: "GET", headers: K(s.headers), credentials: s.credentials }).then((c) => {
      if (!c.ok) throw new Error("HTTP " + c.status + ": " + c.statusText);
      return c.json();
    });
  }, m.prototype.create = function(t) {
    const s = this;
    return window.fetch(z(s.baseUrl, s.path), {
      method: "POST",
      headers: K(s.headers),
      credentials: s.credentials,
      body: JSON.stringify(t)
    }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    });
  }, m.prototype.update = function(t, s) {
    const n = this;
    return window.fetch(z(n.baseUrl, n.path, t), {
      method: "PUT",
      headers: K(n.headers),
      credentials: n.credentials,
      body: JSON.stringify(s)
    }).then((c) => {
      if (c.ok) return c.json();
      if (c.status === 409) return c.json().then((o) => {
        const i = new Error("Conflict");
        throw i.status = 409, i.data = o, i;
      });
      throw new Error("HTTP " + c.status + ": " + c.statusText);
    });
  }, m.prototype.delete = function(t) {
    const s = this;
    return window.fetch(z(s.baseUrl, s.path, t), {
      method: "DELETE",
      headers: K(s.headers),
      credentials: s.credentials
    }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    });
  }, m.prototype.bulkDelete = function(t) {
    const s = this;
    return window.fetch(z(s.baseUrl, s.path) + "/bulk-delete", {
      method: "DELETE",
      headers: K(s.headers),
      credentials: s.credentials,
      body: JSON.stringify({ ids: t })
    }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    });
  };
  function _(t) {
    t._handlers = {
      sync: function(n) {
        const c = n.detail || {};
        t.fetchDelta(c.since).then(function(o) {
          S(t.dom, "ln-api-connector:fetched", { data: o, since: c.since });
        }).catch(function(o) {
          S(t.dom, "ln-api-connector:error", {
            action: "sync",
            error: o.message,
            status: o.status || 0,
            since: c.since
          });
        });
      },
      create: function(n) {
        const c = n.detail || {};
        t.create(c.data).then(function(o) {
          S(t.dom, "ln-api-connector:created", { record: o, tempId: c.tempId });
        }).catch(function(o) {
          S(t.dom, "ln-api-connector:error", {
            action: "create",
            error: o.message,
            status: o.status || 0,
            tempId: c.tempId
          });
        });
      },
      update: function(n) {
        const c = n.detail || {}, o = Object.assign({}, c.data);
        c.expected_version !== void 0 && (o.expected_version = c.expected_version), t.update(c.id, o).then(function(i) {
          S(t.dom, "ln-api-connector:updated", { record: i, id: c.id });
        }).catch(function(i) {
          S(t.dom, "ln-api-connector:error", {
            action: "update",
            error: i.message,
            status: i.status || 0,
            id: c.id,
            conflictData: i.status === 409 ? i.data : null
          });
        });
      },
      delete: function(n) {
        const c = n.detail || {};
        t.delete(c.id).then(function(o) {
          S(t.dom, "ln-api-connector:deleted", { response: o, id: c.id });
        }).catch(function(o) {
          S(t.dom, "ln-api-connector:error", {
            action: "delete",
            error: o.message,
            status: o.status || 0,
            id: c.id
          });
        });
      },
      bulkDelete: function(n) {
        const c = n.detail || {};
        t.bulkDelete(c.ids).then(function(o) {
          S(t.dom, "ln-api-connector:bulk-deleted", { response: o, ids: c.ids });
        }).catch(function(o) {
          S(t.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: o.message,
            status: o.status || 0,
            ids: c.ids
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(n) {
      t.dom.addEventListener(n + ":request-sync", t._handlers.sync), t.dom.addEventListener(n + ":request-fetch", t._handlers.sync), t.dom.addEventListener(n + ":request-create", t._handlers.create), t.dom.addEventListener(n + ":request-update", t._handlers.update), t.dom.addEventListener(n + ":request-delete", t._handlers.delete), t.dom.addEventListener(n + ":request-bulk-delete", t._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    const t = this;
    t._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(n) {
      t.dom.removeEventListener(n + ":request-sync", t._handlers.sync), t.dom.removeEventListener(n + ":request-fetch", t._handlers.sync), t.dom.removeEventListener(n + ":request-create", t._handlers.create), t.dom.removeEventListener(n + ":request-update", t._handlers.update), t.dom.removeEventListener(n + ":request-delete", t._handlers.delete), t.dom.removeEventListener(n + ":request-bulk-delete", t._handlers.bulkDelete);
    }), t._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[u], delete this.dom[y];
  };
  function b(t) {
    const s = t[u];
    s && s.refreshConfig();
  }
  B(h, u, m, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: b
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", u = "lnCouchDbConnector", y = "lnConnector";
  if (window[u] !== void 0) return;
  function m(t) {
    return this.dom = t, t[u] = this, t[y] = this, this.refreshConfig(), this._handlers = null, _(this), this;
  }
  m.prototype.refreshConfig = function() {
    const t = this.dom;
    this.url = t.getAttribute("data-ln-couchdb-url") || "", this.db = t.getAttribute("data-ln-couchdb-db") || "", this.auth = t.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const s = t.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = xt(s, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), s.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(t, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, m.prototype.fetchDelta = function(t) {
    const s = this, n = ["include_docs=true", "feed=normal"];
    t && n.push("since=" + encodeURIComponent(t));
    const c = z(s.url, s.db, "_changes") + "?" + n.join("&");
    return window.fetch(c, { method: "GET", headers: K(s.headers, s.auth), credentials: s.credentials }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => {
      const i = o.results || [];
      return {
        data: i.filter((d) => !d.deleted && d.doc).map((d) => Object.assign({}, d.doc, { id: d.doc._id })),
        deleted: i.filter((d) => d.deleted).map((d) => d.id),
        synced_at: o.last_seq || t || ""
      };
    });
  }, m.prototype.create = function(t) {
    const s = this, n = Object.assign({ _id: t.id }, t);
    return n._id || delete n._id, window.fetch(z(s.url, s.db), {
      method: "POST",
      headers: K(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify(n)
    }).then((c) => {
      if (!c.ok) throw new Error("HTTP " + c.status + ": " + c.statusText);
      return c.json();
    }).then((c) => Object.assign({}, n, { id: c.id, _id: c.id, _rev: c.rev }));
  }, m.prototype.update = function(t, s) {
    const n = this, c = Object.assign({ id: String(t), _id: String(t) }, s), o = c._rev || c.rev;
    return (o ? Promise.resolve(o) : window.fetch(z(n.url, n.db, null, t), { method: "GET", headers: K(n.headers, n.auth), credentials: n.credentials }).then((d) => {
      if (!d.ok) throw new Error("Could not retrieve document for revision mapping");
      return d.json().then((r) => r._rev);
    })).then((d) => {
      const r = Object.assign({}, c, { _rev: d });
      delete r.rev;
      const e = Object.assign(K(n.headers, n.auth), { "If-Match": d });
      return window.fetch(z(n.url, n.db, null, t), {
        method: "PUT",
        headers: e,
        credentials: n.credentials,
        body: JSON.stringify(r)
      }).then((l) => {
        if (l.ok) return l.json().then((f) => Object.assign({}, r, { _rev: f.rev }));
        if (l.status === 409) return l.json().then((f) => {
          const a = new Error("Conflict");
          throw a.status = 409, a.data = f, a;
        });
        throw new Error("HTTP " + l.status + ": " + l.statusText);
      });
    });
  }, m.prototype.delete = function(t, s) {
    const n = this;
    return (s ? Promise.resolve(s) : window.fetch(z(n.url, n.db, null, t), { method: "GET", headers: K(n.headers, n.auth), credentials: n.credentials }).then((o) => {
      if (!o.ok) throw new Error("Could not retrieve document for revision delete");
      return o.json().then((i) => i._rev);
    })).then((o) => {
      const i = z(n.url, n.db, null, t) + "?rev=" + encodeURIComponent(o);
      return window.fetch(i, { method: "DELETE", headers: K(n.headers, n.auth), credentials: n.credentials }).then((d) => {
        if (!d.ok) throw new Error("HTTP " + d.status + ": " + d.statusText);
        return d.json();
      });
    });
  }, m.prototype.bulkDelete = function(t) {
    const s = this;
    return !t || t.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch(z(s.url, s.db, "_all_docs"), {
      method: "POST",
      headers: K(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify({ keys: t })
    }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    }).then((n) => {
      const o = (n.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return o.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(z(s.url, s.db, "_bulk_docs"), {
        method: "POST",
        headers: K(s.headers, s.auth),
        credentials: s.credentials,
        body: JSON.stringify({ docs: o })
      }).then((i) => {
        if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
        return i.json();
      }).then((i) => ({ ok: !0, results: i, deletedCount: o.length }));
    });
  };
  function _(t) {
    t._handlers = {
      sync: function(n) {
        const c = n.detail || {};
        t.fetchDelta(c.since).then(function(o) {
          S(t.dom, "ln-couchdb-connector:fetched", { data: o, since: c.since });
        }).catch(function(o) {
          S(t.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: o.message,
            status: o.status || 0,
            since: c.since
          });
        });
      },
      create: function(n) {
        const c = n.detail || {};
        t.create(c.data).then(function(o) {
          S(t.dom, "ln-couchdb-connector:created", { record: o, tempId: c.tempId });
        }).catch(function(o) {
          S(t.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: o.message,
            status: o.status || 0,
            tempId: c.tempId
          });
        });
      },
      update: function(n) {
        const c = n.detail || {}, o = Object.assign({}, c.data);
        c.expected_version !== void 0 && (o._rev = c.expected_version), t.update(c.id, o).then(function(i) {
          S(t.dom, "ln-couchdb-connector:updated", { record: i, id: c.id });
        }).catch(function(i) {
          S(t.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: i.message,
            status: i.status || 0,
            id: c.id,
            conflictData: i.status === 409 ? i.data : null
          });
        });
      },
      delete: function(n) {
        const c = n.detail || {};
        t.delete(c.id, c.rev).then(function(o) {
          S(t.dom, "ln-couchdb-connector:deleted", { response: o, id: c.id });
        }).catch(function(o) {
          S(t.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: o.message,
            status: o.status || 0,
            id: c.id
          });
        });
      },
      bulkDelete: function(n) {
        const c = n.detail || {};
        t.bulkDelete(c.ids).then(function(o) {
          S(t.dom, "ln-couchdb-connector:bulk-deleted", { response: o, ids: c.ids });
        }).catch(function(o) {
          S(t.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: o.message,
            status: o.status || 0,
            ids: c.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(n) {
      t.dom.addEventListener(n + ":request-sync", t._handlers.sync), t.dom.addEventListener(n + ":request-fetch", t._handlers.sync), t.dom.addEventListener(n + ":request-create", t._handlers.create), t.dom.addEventListener(n + ":request-update", t._handlers.update), t.dom.addEventListener(n + ":request-delete", t._handlers.delete), t.dom.addEventListener(n + ":request-bulk-delete", t._handlers.bulkDelete);
    });
  }
  m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    const t = this;
    t._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(n) {
      t.dom.removeEventListener(n + ":request-sync", t._handlers.sync), t.dom.removeEventListener(n + ":request-fetch", t._handlers.sync), t.dom.removeEventListener(n + ":request-create", t._handlers.create), t.dom.removeEventListener(n + ":request-update", t._handlers.update), t.dom.removeEventListener(n + ":request-delete", t._handlers.delete), t.dom.removeEventListener(n + ":request-bulk-delete", t._handlers.bulkDelete);
    }), t._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[u], delete this.dom[y];
  };
  function b(t) {
    const s = t[u];
    s && s.refreshConfig();
  }
  B(h, u, m, "ln-couchdb-connector", {
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
  const h = "data-ln-data-coordinator", u = "lnDataCoordinator", y = "lnCoordinator";
  if (window[u] !== void 0) return;
  function m(t) {
    return this.dom = t, this._name = t.getAttribute(h), t[u] = this, t[y] = this, this.mapper = null, this._handlers = null, this.refreshMapper(), _(this), this;
  }
  m.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const s = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    s && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(s)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(n) {
      return n;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(n) {
      return n;
    });
  }, m.prototype.findChildren = function() {
    const t = this.dom.querySelector("[data-ln-data-store]"), s = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]");
    return {
      storeEl: t,
      connectorEl: s,
      store: t ? t.lnDataStore || t.lnStore : null,
      connector: s ? s.lnConnector || s.lnApiConnector || s.lnCouchDbConnector : null
    };
  };
  function _(t) {
    t._handlers = {
      sync: function(s) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        const c = s.detail.since;
        n.connector.fetchDelta(c).then(function(o) {
          let i = [], d = [], r = null;
          o && Array.isArray(o) ? (i = o, r = Math.floor(Date.now() / 1e3)) : o && (i = Array.isArray(o.data) ? o.data : [], d = Array.isArray(o.deleted) ? o.deleted : [], r = o.synced_at !== void 0 ? o.synced_at : o.since !== void 0 ? o.since : null);
          const e = i.map((l) => t.mapper.ingress(l));
          n.store.applySync(e, d, r);
        }).catch(function(o) {
          console.error("[ln-data-coordinator] Sync failed:", o);
        });
      },
      create: function(s) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector) return;
        const c = s.detail.tempId, o = s.detail.data || {}, i = t.mapper.egress(o);
        n.connector.create(i).then(function(d) {
          const r = t.mapper.ingress(d);
          n.store.confirmMutation(c, r, "create");
        }).catch(function(d) {
          console.error("[ln-data-coordinator] Create mutation failed:", d), n.store.revertMutation(c, "create", d.message || d);
        });
      },
      update: function(s) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector) return;
        const c = s.detail.id, o = s.detail.expected_version;
        n.store.getById(c).then(function(i) {
          if (!i) throw new Error("Record not found in cache store: " + c);
          const d = Object.assign({}, i);
          delete d._pending;
          const r = t.mapper.egress(d);
          return n.connector.update(c, r, o);
        }).then(function(i) {
          const d = t.mapper.ingress(i);
          n.store.confirmMutation(c, d, "update");
        }).catch(function(i) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", i), i.status === 409) {
            const d = i.data && i.data.remote ? t.mapper.ingress(i.data.remote) : null, r = i.data ? i.data.field_diffs : null;
            n.store.resolveConflict(c, d, r);
          } else
            n.store.revertMutation(c, "update", i.message || i);
        });
      },
      delete: function(s) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector) return;
        const c = s.detail.id;
        n.connector.delete(c).then(function() {
          n.store.confirmMutation(c, null, "delete");
        }).catch(function(o) {
          console.error("[ln-data-coordinator] Delete mutation failed:", o), n.store.revertMutation(c, "delete", o.message || o);
        });
      },
      bulkDelete: function(s) {
        t.refreshMapper();
        const n = t.findChildren();
        if (!n.store || !n.connector) return;
        const c = s.detail.ids || [], o = c.join(",");
        n.connector.bulkDelete(c).then(function() {
          n.store.confirmMutation(o, null, "bulk-delete");
        }).catch(function(i) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", i), n.store.revertMutation(o, "bulk-delete", i.message || i);
        });
      }
    }, t.dom.addEventListener("ln-store:request-remote-sync", t._handlers.sync), t.dom.addEventListener("ln-store:request-remote-create", t._handlers.create), t.dom.addEventListener("ln-store:request-remote-update", t._handlers.update), t.dom.addEventListener("ln-store:request-remote-delete", t._handlers.delete), t.dom.addEventListener("ln-store:request-remote-bulk-delete", t._handlers.bulkDelete);
  }
  m.prototype.destroy = function() {
    if (!this.dom[u]) return;
    const t = this;
    t._handlers && (t.dom.removeEventListener("ln-store:request-remote-sync", t._handlers.sync), t.dom.removeEventListener("ln-store:request-remote-create", t._handlers.create), t.dom.removeEventListener("ln-store:request-remote-update", t._handlers.update), t.dom.removeEventListener("ln-store:request-remote-delete", t._handlers.delete), t.dom.removeEventListener("ln-store:request-remote-bulk-delete", t._handlers.bulkDelete), t._handlers = null), delete this.dom[u], delete this.dom[y];
  };
  function b(t, s) {
    const n = t[u];
    n && s === "data-ln-data-mapper" && n.refreshMapper();
  }
  B(h, u, m, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: b
  });
})();
(function() {
  const h = "ln-icons-sprite", u = "#ln-", y = "#lnc-", m = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
  let b = null;
  const t = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), n = "lni:", c = "lni:v", o = "1";
  function i() {
    try {
      if (localStorage.getItem(c) !== o) {
        for (let p = localStorage.length - 1; p >= 0; p--) {
          const g = localStorage.key(p);
          g && g.indexOf(n) === 0 && localStorage.removeItem(g);
        }
        localStorage.setItem(c, o);
      }
    } catch {
    }
  }
  i();
  function d() {
    return b || (b = document.getElementById(h), b || (b = document.createElementNS("http://www.w3.org/2000/svg", "svg"), b.id = h, b.setAttribute("hidden", ""), b.setAttribute("aria-hidden", "true"), b.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(b, document.body.firstChild))), b;
  }
  function r(p) {
    return p.indexOf(y) === 0 ? s + "/" + p.slice(y.length) + ".svg" : t + "/" + p.slice(u.length) + ".svg";
  }
  function e(p, g) {
    const A = g.match(/viewBox="([^"]+)"/), E = A ? A[1] : "0 0 24 24", w = g.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = w ? w[1].trim() : "", x = g.match(/<svg([^>]*)>/i), D = x ? x[1] : "", O = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    O.id = p, O.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const F = D.match(new RegExp(M + '="([^"]*)"'));
      F && O.setAttribute(M, F[1]);
    }), O.innerHTML = T, d().querySelector("defs").appendChild(O);
  }
  function l(p) {
    if (m.has(p) || _.has(p) || p.indexOf(y) === 0 && !s) return;
    const g = p.slice(1);
    try {
      const A = localStorage.getItem(n + g);
      if (A) {
        e(g, A), m.add(p);
        return;
      }
    } catch {
    }
    _.add(p), fetch(r(p)).then(function(A) {
      if (!A.ok) throw new Error(A.status);
      return A.text();
    }).then(function(A) {
      e(g, A), m.add(p), _.delete(p);
      try {
        localStorage.setItem(n + g, A);
      } catch {
      }
    }).catch(function() {
      _.delete(p);
    });
  }
  function f(p) {
    const g = 'use[href^="' + u + '"], use[href^="' + y + '"]', A = p.querySelectorAll ? p.querySelectorAll(g) : [];
    if (p.matches && p.matches(g)) {
      const E = p.getAttribute("href");
      E && l(E);
    }
    Array.prototype.forEach.call(A, function(E) {
      const w = E.getAttribute("href");
      w && l(w);
    });
  }
  function a() {
    f(document), new MutationObserver(function(p) {
      p.forEach(function(g) {
        if (g.type === "childList")
          g.addedNodes.forEach(function(A) {
            A.nodeType === 1 && f(A);
          });
        else if (g.type === "attributes" && g.attributeName === "href") {
          const A = g.target.getAttribute("href");
          A && (A.indexOf(u) === 0 || A.indexOf(y) === 0) && l(A);
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
