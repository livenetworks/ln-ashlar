const vt = {};
function Et(h, c) {
  vt[h] || (vt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const v = vt[h];
  return v ? v.content.cloneNode(!0) : (console.warn("[" + (c || "ln-core") + '] Template "' + h + '" not found'), null);
}
function S(h, c, v) {
  h.dispatchEvent(new CustomEvent(c, {
    bubbles: !0,
    detail: v || {}
  }));
}
function K(h, c, v) {
  const p = new CustomEvent(c, {
    bubbles: !0,
    cancelable: !0,
    detail: v || {}
  });
  return h.dispatchEvent(p), p;
}
function et(h, c) {
  if (!h || !c) return h;
  const v = h.querySelectorAll("[data-ln-field]");
  for (let o = 0; o < v.length; o++) {
    const r = v[o], e = r.getAttribute("data-ln-field");
    c[e] != null && (r.textContent = c[e]);
  }
  const p = h.querySelectorAll("[data-ln-attr]");
  for (let o = 0; o < p.length; o++) {
    const r = p[o], e = r.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < e.length; n++) {
      const t = e[n].trim().split(":");
      if (t.length !== 2) continue;
      const i = t[0].trim(), a = t[1].trim();
      c[a] != null && r.setAttribute(i, c[a]);
    }
  }
  const m = h.querySelectorAll("[data-ln-show]");
  for (let o = 0; o < m.length; o++) {
    const r = m[o], e = r.getAttribute("data-ln-show");
    e in c && r.classList.toggle("hidden", !c[e]);
  }
  const _ = h.querySelectorAll("[data-ln-class]");
  for (let o = 0; o < _.length; o++) {
    const r = _[o], e = r.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < e.length; n++) {
      const t = e[n].trim().split(":");
      if (t.length !== 2) continue;
      const i = t[0].trim(), a = t[1].trim();
      a in c && r.classList.toggle(i, !!c[a]);
    }
  }
  return h;
}
function Lt(h, c) {
  if (!h || !c) return h;
  const v = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; v.nextNode(); ) {
    const p = v.currentNode;
    p.textContent.indexOf("{{") !== -1 && (p.textContent = p.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(m, _) {
        return c[_] !== void 0 ? c[_] : "";
      }
    ));
  }
  return h;
}
function G(h, c) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      G(h, c);
    }), console.warn("[" + c + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function ot(h, c, v) {
  if (h) {
    const p = h.querySelector('[data-ln-template="' + c + '"]');
    if (p) return p.content.cloneNode(!0);
  }
  return Et(c, v);
}
function qt(h, c) {
  const v = {}, p = h.querySelectorAll("[" + c + "]");
  for (let m = 0; m < p.length; m++)
    v[p[m].getAttribute(c)] = p[m].textContent, p[m].remove();
  return v;
}
function yt(h, c, v, p) {
  if (h.nodeType !== 1) return;
  const _ = c.indexOf("[") !== -1 || c.indexOf(".") !== -1 || c.indexOf("#") !== -1 ? c : "[" + c + "]", o = Array.from(h.querySelectorAll(_));
  h.matches && h.matches(_) && o.push(h);
  for (const r of o)
    r[v] || (r[v] = new p(r));
}
function pt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function Ct(h) {
  const c = {}, v = h.elements;
  for (let p = 0; p < v.length; p++) {
    const m = v[p];
    if (!(!m.name || m.disabled || m.type === "file" || m.type === "submit" || m.type === "button"))
      if (m.type === "checkbox")
        c[m.name] || (c[m.name] = []), m.checked && c[m.name].push(m.value);
      else if (m.type === "radio")
        m.checked && (c[m.name] = m.value);
      else if (m.type === "select-multiple") {
        c[m.name] = [];
        for (let _ = 0; _ < m.options.length; _++)
          m.options[_].selected && c[m.name].push(m.options[_].value);
      } else
        c[m.name] = m.value;
  }
  return c;
}
function Tt(h, c) {
  const v = h.elements, p = [];
  for (let m = 0; m < v.length; m++) {
    const _ = v[m];
    if (!_.name || !(_.name in c) || _.type === "file" || _.type === "submit" || _.type === "button") continue;
    const o = c[_.name];
    if (_.type === "checkbox")
      _.checked = Array.isArray(o) ? o.indexOf(_.value) !== -1 : !!o, p.push(_);
    else if (_.type === "radio")
      _.checked = _.value === String(o), p.push(_);
    else if (_.type === "select-multiple") {
      if (Array.isArray(o))
        for (let r = 0; r < _.options.length; r++)
          _.options[r].selected = o.indexOf(_.options[r].value) !== -1;
      p.push(_);
    } else
      _.value = o, p.push(_);
  }
  return p;
}
function J(h) {
  const c = h.closest("[lang]");
  return (c ? c.lang : null) || navigator.language;
}
function kt(h, c, { get: v, set: p }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return v ? v.call(this) : c.get.call(this);
    },
    set: function(m) {
      p ? p.call(this, m, (_) => c.set.call(this, _)) : c.set.call(this, m);
    },
    configurable: !0
  });
}
function N(h, c, v, p, m = {}) {
  const _ = m.extraAttributes || [], o = m.onAttributeChange || null, r = m.onInit || null;
  function e(n) {
    const t = n || document.body;
    yt(t, h, c, v), r && r(t);
  }
  return G(function() {
    const n = new MutationObserver(function(i) {
      for (let a = 0; a < i.length; a++) {
        const u = i[a];
        if (u.type === "childList") {
          for (let s = 0; s < u.addedNodes.length; s++) {
            const d = u.addedNodes[s];
            d.nodeType === 1 && (yt(d, h, c, v), r && r(d));
          }
          for (let s = 0; s < u.removedNodes.length; s++) {
            const d = u.removedNodes[s];
            if (d.nodeType === 1) {
              const l = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", g = Array.from(d.querySelectorAll(l));
              d.matches && d.matches(l) && g.push(d);
              for (let y = 0; y < g.length; y++) {
                const w = g[y];
                if (!document.contains(w)) {
                  const A = w[c];
                  A && typeof A.destroy == "function" && A.destroy();
                }
              }
            }
          }
        } else u.type === "attributes" && (o && u.target[c] ? o(u.target, u.attributeName) : (yt(u.target, h, c, v), r && r(u.target)));
      }
    });
    let t = [];
    if (h.indexOf("[") !== -1) {
      const i = /\[([\w-]+)/g;
      let a;
      for (; (a = i.exec(h)) !== null; )
        t.push(a[1]);
    } else
      t.push(h);
    n.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: t.concat(_)
    });
  }, p || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[c] = e, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    e(document.body);
  }) : e(document.body), e;
}
function z(...h) {
  return h.filter((c) => c != null && c !== "").map((c, v) => v === 0 ? c.replace(/\/+$/, "") : c.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function V(h, c) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, c ? { Authorization: c } : null);
}
function xt(h, c = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (v) {
    return console.error(`[${c}] Invalid headers JSON:`, v), {};
  }
}
const Ot = {};
function Mt(h, c) {
  Ot[h] = c;
}
function Ft(h) {
  return Ot[h] || { ingress: (c) => c, egress: (c) => c };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Mt, window.lnCore.getDataMapper = Ft);
function Nt(h, c) {
  let v = !1;
  return function() {
    v || (v = !0, queueMicrotask(function() {
      v = !1, h(), c && c();
    }));
  };
}
const Bt = "ln:";
function Pt() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function It(h, c) {
  const v = c.getAttribute("data-ln-persist"), p = v !== null && v !== "" ? v : c.id;
  return p ? Bt + h + ":" + Pt() + ":" + p : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', c), null);
}
function _t(h, c) {
  const v = It(h, c);
  if (!v) return null;
  try {
    const p = localStorage.getItem(v);
    return p !== null ? JSON.parse(p) : null;
  } catch {
    return null;
  }
}
function st(h, c, v) {
  const p = It(h, c);
  if (p)
    try {
      localStorage.setItem(p, JSON.stringify(v));
    } catch {
    }
}
function gt(h, c, v, p) {
  const m = typeof p == "number" ? p : 4, _ = window.innerWidth, o = window.innerHeight, r = c.width, e = c.height, n = (v || "bottom").split("-"), t = n[0], i = n[1] === "start" || n[1] === "end" ? n[1] : "center", a = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, u = a[t] || a.bottom;
  function s(y) {
    return y === "top" || y === "bottom" ? i === "start" ? h.left : i === "end" ? h.right - r : h.left + (h.width - r) / 2 : i === "start" ? h.top : i === "end" ? h.bottom - e : h.top + (h.height - e) / 2;
  }
  function d(y) {
    let w, A, E = !0;
    return y === "top" ? (w = h.top - m - e, A = s(y), w < 0 && (E = !1)) : y === "bottom" ? (w = h.bottom + m, A = s(y), w + e > o && (E = !1)) : y === "left" ? (w = s(y), A = h.left - m - r, A < 0 && (E = !1)) : (w = s(y), A = h.right + m, A + r > _ && (E = !1)), { top: w, left: A, side: y, fits: E };
  }
  let f = null;
  for (let y = 0; y < u.length; y++) {
    const w = d(u[y]);
    if (w.fits) {
      f = w;
      break;
    }
  }
  f || (f = d(u[0]));
  let l = f.top, g = f.left;
  return r >= _ ? g = 0 : (g < 0 && (g = 0), g + r > _ && (g = _ - r)), e >= o ? l = 0 : (l < 0 && (l = 0), l + e > o && (l = o - e)), { top: l, left: g, placement: f.side };
}
function Dt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const c = h.parentNode, v = document.createComment("ln-teleport");
  return c.insertBefore(v, h), document.body.appendChild(h), function() {
    v.parentNode && (v.parentNode.insertBefore(h, v), v.parentNode.removeChild(v));
  };
}
function At(h) {
  if (!h) return { width: 0, height: 0 };
  const c = h.style, v = c.visibility, p = c.display, m = c.position;
  c.visibility = "hidden", c.display = "block", c.position = "fixed";
  const _ = h.offsetWidth, o = h.offsetHeight;
  return c.visibility = v, c.display = p, c.position = m, { width: _, height: o };
}
let it = null;
async function St(h) {
  if (!h) {
    it = null;
    return;
  }
  try {
    const c = new TextEncoder(), v = await crypto.subtle.digest("SHA-256", c.encode(h));
    it = await crypto.subtle.importKey(
      "raw",
      v,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  } catch (c) {
    console.error("[ln-core/crypto] Key derivation failed:", c), it = null;
  }
}
function ft() {
  return it;
}
async function Ht(h, c = it) {
  const v = c || it;
  if (!v || h === void 0 || h === null) return h;
  try {
    const p = new TextEncoder(), m = crypto.getRandomValues(new Uint8Array(12)), _ = typeof h == "string" ? h : JSON.stringify(h), o = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: m },
      v,
      p.encode(_)
    ), r = btoa(String.fromCharCode(...m)), e = btoa(String.fromCharCode(...new Uint8Array(o)));
    return {
      encrypted: !0,
      iv: r,
      data: e
    };
  } catch (p) {
    return console.error("[ln-core/crypto] Encryption failed:", p), h;
  }
}
async function Ut(h, c = it) {
  const v = c || it;
  if (!h || !h.encrypted || !v) return h;
  try {
    const p = new TextDecoder(), m = Uint8Array.from(atob(h.iv), (e) => e.charCodeAt(0)), _ = Uint8Array.from(atob(h.data), (e) => e.charCodeAt(0)), o = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: m },
      v,
      _
    ), r = p.decode(o);
    try {
      return JSON.parse(r);
    } catch {
      return r;
    }
  } catch (p) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", p), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), c = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  function p(n) {
    return typeof n == "string" ? n : n instanceof URL ? n.href : n instanceof Request ? n.url : String(n);
  }
  function m(n, t) {
    return t && t.method ? String(t.method).toUpperCase() : n instanceof Request ? n.method.toUpperCase() : "GET";
  }
  function _(n, t) {
    return t + " " + n;
  }
  function o(n) {
    return n === "GET" || n === "HEAD";
  }
  function r(n, t) {
    t = t || {};
    const i = p(n), a = m(n, t), u = _(i, a);
    o(a) && c.has(u) && (c.get(u).abort(), c.delete(u));
    const s = new AbortController(), d = t.signal;
    d && (d.aborted ? s.abort(d.reason) : d.addEventListener("abort", function() {
      s.abort(d.reason);
    }, { once: !0 }));
    const f = Object.assign({}, t, { signal: s.signal });
    return c.set(u, s), h(n, f).finally(function() {
      c.get(u) === s && c.delete(u);
    });
  }
  r.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = r;
  function e(n) {
    const t = n.detail || {};
    if (!t.url) return;
    const i = n.target, a = (t.method || (t.body ? "POST" : "GET")).toUpperCase(), u = t.key;
    u && v.has(u) && (v.get(u).abort(), v.delete(u));
    const s = new AbortController(), d = t.signal;
    d && (d.aborted ? s.abort(d.reason) : d.addEventListener("abort", function() {
      s.abort(d.reason);
    }, { once: !0 })), u && v.set(u, s);
    const f = { method: a, signal: s.signal };
    t.body !== void 0 && (f.body = t.body), window.fetch(t.url, f).then(function(l) {
      u && v.get(u) === s && v.delete(u), S(i, "ln-http:response", {
        ok: l.ok,
        status: l.status,
        response: l
      });
    }).catch(function(l) {
      u && v.get(u) === s && v.delete(u), !(l && l.name === "AbortError") && S(i, "ln-http:error", {
        ok: !1,
        status: 0,
        error: l
      });
    });
  }
  document.addEventListener("ln-http:request", e), window.lnHttp = {
    cancel: function(n) {
      let t = !1;
      return c.forEach(function(i, a) {
        a.endsWith(" " + n) && (i.abort(), c.delete(a), t = !0);
      }), t;
    },
    cancelByKey: function(n) {
      return v.has(n) ? (v.get(n).abort(), v.delete(n), !0) : !1;
    },
    cancelAll: function() {
      c.forEach(function(n) {
        n.abort();
      }), c.clear(), v.forEach(function(n) {
        n.abort();
      }), v.clear();
    },
    get inflight() {
      const n = [];
      return c.forEach(function(t, i) {
        const a = i.indexOf(" ");
        n.push({ method: i.slice(0, a), url: i.slice(a + 1) });
      }), v.forEach(function(t, i) {
        n.push({ key: i });
      }), n;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", e), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0) return;
  function v(t) {
    if (!t.hasAttribute(h) || t[c]) return;
    t[c] = !0;
    const i = r(t);
    p(i.links), m(i.forms);
  }
  function p(t) {
    for (const i of t) {
      if (i[c + "Trigger"] || i.hostname && i.hostname !== window.location.hostname) continue;
      const a = i.getAttribute("href");
      if (a && a.includes("#")) continue;
      const u = function(s) {
        if (s.ctrlKey || s.metaKey || s.button === 1) return;
        s.preventDefault();
        const d = i.getAttribute("href");
        d && o("GET", d, null, i);
      };
      i.addEventListener("click", u), i[c + "Trigger"] = u;
    }
  }
  function m(t) {
    for (const i of t) {
      if (i[c + "Trigger"]) continue;
      const a = function(u) {
        u.preventDefault();
        const s = i.method.toUpperCase(), d = i.action, f = new FormData(i);
        for (const l of i.querySelectorAll('button, input[type="submit"]'))
          l.disabled = !0;
        o(s, d, f, i, function() {
          for (const l of i.querySelectorAll('button, input[type="submit"]'))
            l.disabled = !1;
        });
      };
      i.addEventListener("submit", a), i[c + "Trigger"] = a;
    }
  }
  function _(t) {
    if (!t[c]) return;
    const i = r(t);
    for (const a of i.links)
      a[c + "Trigger"] && (a.removeEventListener("click", a[c + "Trigger"]), delete a[c + "Trigger"]);
    for (const a of i.forms)
      a[c + "Trigger"] && (a.removeEventListener("submit", a[c + "Trigger"]), delete a[c + "Trigger"]);
    delete t[c];
  }
  function o(t, i, a, u, s) {
    if (K(u, "ln-ajax:before-start", { method: t, url: i }).defaultPrevented) return;
    S(u, "ln-ajax:start", { method: t, url: i }), u.classList.add("ln-ajax--loading");
    const f = document.createElement("span");
    f.className = "ln-ajax-spinner", u.appendChild(f);
    function l() {
      u.classList.remove("ln-ajax--loading");
      const E = u.querySelector(".ln-ajax-spinner");
      E && E.remove(), s && s();
    }
    let g = i;
    const y = document.querySelector('meta[name="csrf-token"]'), w = y ? y.getAttribute("content") : null;
    a instanceof FormData && w && a.append("_token", w);
    const A = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (A.headers["X-CSRF-TOKEN"] = w), t === "GET" && a) {
      const E = new URLSearchParams(a);
      g = i + (i.includes("?") ? "&" : "?") + E.toString();
    } else t !== "GET" && a && (A.body = a);
    fetch(g, A).then(function(E) {
      const k = E.ok;
      return E.json().then(function(x) {
        return { ok: k, status: E.status, data: x };
      });
    }).then(function(E) {
      const k = E.data;
      if (E.ok) {
        if (k.title && (document.title = k.title), k.content)
          for (const x in k.content) {
            const R = document.getElementById(x);
            if (R) {
              let O = k.content[x];
              window.DOMPurify && typeof window.DOMPurify.sanitize == "function" ? O = window.DOMPurify.sanitize(O) : O = O.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""), R.innerHTML = O;
            }
          }
        if (u.tagName === "A") {
          const x = u.getAttribute("href");
          x && window.history.pushState({ ajax: !0 }, "", x);
        } else u.tagName === "FORM" && u.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", g);
        S(u, "ln-ajax:success", { method: t, url: g, data: k });
      } else
        S(u, "ln-ajax:error", { method: t, url: g, status: E.status, data: k });
      if (k.message) {
        const x = k.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: x.type || (E.ok ? "success" : "error"),
            title: x.title || "",
            message: x.body || ""
          }
        }));
      }
      S(u, "ln-ajax:complete", { method: t, url: g }), l();
    }).catch(function(E) {
      S(u, "ln-ajax:error", { method: t, url: g, error: E }), S(u, "ln-ajax:complete", { method: t, url: g }), l();
    });
  }
  function r(t) {
    const i = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(h) !== "false" ? i.links.push(t) : t.tagName === "FORM" && t.getAttribute(h) !== "false" ? i.forms.push(t) : (i.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), i.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), i;
  }
  function e() {
    G(function() {
      new MutationObserver(function(i) {
        for (const a of i)
          if (a.type === "childList") {
            for (const u of a.addedNodes)
              if (u.nodeType === 1 && (v(u), !u.hasAttribute(h))) {
                for (const d of u.querySelectorAll("[" + h + "]"))
                  v(d);
                const s = u.closest && u.closest("[" + h + "]");
                if (s && s.getAttribute(h) !== "false") {
                  const d = r(u);
                  p(d.links), m(d.forms);
                }
              }
          } else a.type === "attributes" && v(a.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function n() {
    for (const t of document.querySelectorAll("[" + h + "]"))
      v(t);
  }
  window[c] = v, window[c].destroy = _, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0) return;
  function v(o) {
    const r = Array.from(o.querySelectorAll("[data-ln-modal-for]"));
    o.hasAttribute && o.hasAttribute("data-ln-modal-for") && r.push(o);
    for (const e of r) {
      if (e[c + "Trigger"]) continue;
      const n = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const i = e.getAttribute("data-ln-modal-for"), a = document.getElementById(i);
        if (!a) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + i + '"');
          return;
        }
        if (!a[c]) return;
        const u = a.getAttribute(h);
        a.setAttribute(h, u === "open" ? "close" : "open");
      };
      e.addEventListener("click", n), e[c + "Trigger"] = n;
    }
  }
  function p(o) {
    this.dom = o, this.isOpen = o.getAttribute(h) === "open";
    const r = this;
    return this._onEscape = function(e) {
      e.key === "Escape" && r.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(e) {
      if (e.key !== "Tab") return;
      const n = Array.prototype.filter.call(
        r.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        pt
      );
      if (n.length === 0) return;
      const t = n[0], i = n[n.length - 1];
      e.shiftKey ? document.activeElement === t && (e.preventDefault(), i.focus()) : document.activeElement === i && (e.preventDefault(), t.focus());
    }, this._onClose = function(e) {
      e.preventDefault(), r.dom.setAttribute(h, "close");
    }, _(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const o = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of o)
      e[c + "Close"] && (e.removeEventListener("click", e[c + "Close"]), delete e[c + "Close"]);
    const r = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const e of r)
      e[c + "Trigger"] && (e.removeEventListener("click", e[c + "Trigger"]), delete e[c + "Trigger"]);
    S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[c];
  };
  function m(o) {
    const r = o[c];
    if (!r) return;
    const n = o.getAttribute(h) === "open";
    if (n !== r.isOpen)
      if (n) {
        if (K(o, "ln-modal:before-open", { modalId: o.id, target: o }).defaultPrevented) {
          o.setAttribute(h, "close");
          return;
        }
        r.isOpen = !0, o.setAttribute("aria-modal", "true"), o.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", r._onEscape), document.addEventListener("keydown", r._onFocusTrap);
        const i = document.activeElement;
        r._returnFocusEl = i && i !== document.body ? i : null;
        const a = o.querySelector("[autofocus]");
        if (a && pt(a))
          a.focus();
        else {
          const u = o.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), s = Array.prototype.find.call(u, pt);
          if (s) s.focus();
          else {
            const d = o.querySelectorAll("a[href], button:not([disabled])"), f = Array.prototype.find.call(d, pt);
            f && f.focus();
          }
        }
        S(o, "ln-modal:open", { modalId: o.id, target: o });
      } else {
        if (K(o, "ln-modal:before-close", { modalId: o.id, target: o }).defaultPrevented) {
          o.setAttribute(h, "open");
          return;
        }
        r.isOpen = !1, o.removeAttribute("aria-modal"), document.removeEventListener("keydown", r._onEscape), document.removeEventListener("keydown", r._onFocusTrap), S(o, "ln-modal:close", { modalId: o.id, target: o }), r._returnFocusEl && document.contains(r._returnFocusEl) && typeof r._returnFocusEl.focus == "function" && r._returnFocusEl.focus(), r._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function _(o) {
    const r = o.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of r)
      e[c + "Close"] || (e.addEventListener("click", o._onClose), e[c + "Close"] = o._onClose);
  }
  N(h, c, p, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: m,
    onInit: v
  });
})();
(function() {
  const h = "data-ln-number", c = "lnNumber";
  if (window[c] !== void 0) return;
  const v = {}, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(e) {
    if (!v[e]) {
      const n = new Intl.NumberFormat(e, { useGrouping: !0 }), t = n.formatToParts(1234.5);
      let i = "", a = ".";
      for (let u = 0; u < t.length; u++)
        t[u].type === "group" && (i = t[u].value), t[u].type === "decimal" && (a = t[u].value);
      v[e] = { fmt: n, groupSep: i, decimalSep: a };
    }
    return v[e];
  }
  function _(e, n, t) {
    if (t !== null) {
      const i = parseInt(t, 10), a = e + "|d" + i;
      return v[a] || (v[a] = new Intl.NumberFormat(e, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: i })), v[a].format(n);
    }
    return m(e).fmt.format(n);
  }
  function o(e) {
    if (e.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", e.tagName), this;
    if (e[c]) return e[c];
    e[c] = this, this.dom = e;
    const n = document.createElement("input");
    n.type = "hidden", n.name = e.name, e.removeAttribute("name"), e.type = "text", e.setAttribute("inputmode", "decimal"), e.insertAdjacentElement("afterend", n), this._hidden = n;
    const t = this;
    Object.defineProperty(n, "value", {
      get: function() {
        return p.get.call(n);
      },
      set: function(a) {
        if (p.set.call(n, a), a !== "" && !isNaN(parseFloat(a))) {
          const u = parseFloat(a);
          t._displayFormatted(u), S(t.dom, "ln-number:input", { value: u, formatted: t.dom.value }), t.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        } else a === "" && (t.dom.value = "", S(t.dom, "ln-number:input", { value: NaN, formatted: "" }), t.dom.dispatchEvent(new Event("input", { bubbles: !0 })));
      }
    }), kt(e, p, {
      get: function() {
        return p.get.call(e);
      },
      set: function(a, u) {
        if (t._isFormatting) {
          u(a);
          return;
        }
        if (a === "") {
          u(""), t._setHiddenRaw(""), S(e, "ln-number:input", { value: NaN, formatted: "" }), e.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        let s = typeof a == "number" ? a : parseFloat(String(a).replace(/[^\d.-]/g, ""));
        if (isNaN(s))
          u(String(a)), t._setHiddenRaw(""), S(e, "ln-number:input", { value: NaN, formatted: String(a) }), e.dispatchEvent(new Event("input", { bubbles: !0 }));
        else {
          t._setHiddenRaw(s);
          const d = _(J(e), s, e.getAttribute("data-ln-number-decimals"));
          u(d), S(e, "ln-number:input", { value: s, formatted: d }), e.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    }), this._onInput = function() {
      t._handleInput();
    }, e.addEventListener("input", this._onInput), this._onPaste = function(a) {
      a.preventDefault();
      const u = (a.clipboardData || window.clipboardData).getData("text"), s = m(J(e)), d = s.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let f = u.replace(new RegExp("[^0-9\\-" + d + ".]", "g"), "");
      s.groupSep && (f = f.split(s.groupSep).join("")), s.decimalSep !== "." && (f = f.replace(s.decimalSep, "."));
      const l = parseFloat(f);
      isNaN(l) ? (e.value = "", t._hidden.value = "") : t.value = l;
    }, e.addEventListener("paste", this._onPaste);
    const i = e.value;
    if (i !== "") {
      const a = parseFloat(i);
      isNaN(a) || (this._displayFormatted(a), p.set.call(n, String(a)), S(e, "ln-number:input", { value: a, formatted: e.value }), e.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  o.prototype._handleInput = function() {
    const e = this.dom, n = m(J(e)), t = e.value;
    if (t === "") {
      this._hidden.value = "", S(e, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (t === "-") {
      this._hidden.value = "";
      return;
    }
    const i = e.selectionStart;
    let a = 0;
    for (let E = 0; E < i; E++)
      /[0-9]/.test(t[E]) && a++;
    let u = t;
    if (n.groupSep && (u = u.split(n.groupSep).join("")), u = u.replace(n.decimalSep, "."), t.endsWith(n.decimalSep) || t.endsWith(".")) {
      const E = u.replace(/\.$/, ""), k = parseFloat(E);
      isNaN(k) || this._setHiddenRaw(k);
      return;
    }
    const s = u.indexOf(".");
    if (s !== -1 && u.slice(s + 1).endsWith("0")) {
      const k = parseFloat(u);
      isNaN(k) || this._setHiddenRaw(k);
      return;
    }
    const d = e.getAttribute("data-ln-number-decimals");
    if (d !== null && s !== -1) {
      const E = parseInt(d, 10);
      u.slice(s + 1).length > E && (u = u.slice(0, s + 1 + E));
    }
    const f = parseFloat(u);
    if (isNaN(f)) return;
    const l = e.getAttribute("data-ln-number-min"), g = e.getAttribute("data-ln-number-max");
    if (l !== null && f < parseFloat(l) || g !== null && f > parseFloat(g)) return;
    let y;
    if (d !== null)
      y = _(J(e), f, d);
    else {
      const E = s !== -1 ? u.slice(s + 1).length : 0;
      if (E > 0) {
        const k = J(e) + "|u" + E;
        v[k] || (v[k] = new Intl.NumberFormat(J(e), { useGrouping: !0, minimumFractionDigits: E, maximumFractionDigits: E })), y = v[k].format(f);
      } else
        y = n.fmt.format(f);
    }
    e.value = y;
    let w = a, A = 0;
    for (let E = 0; E < y.length && w > 0; E++)
      A = E + 1, /[0-9]/.test(y[E]) && w--;
    w > 0 && (A = y.length), e.setSelectionRange(A, A), this._setHiddenRaw(f), S(e, "ln-number:input", { value: f, formatted: y });
  }, o.prototype._setHiddenRaw = function(e) {
    p.set.call(this._hidden, String(e));
  }, o.prototype._displayFormatted = function(e) {
    this._isFormatting = !0, this.dom.value = _(J(this.dom), e, this.dom.getAttribute("data-ln-number-decimals")), this._isFormatting = !1;
  }, Object.defineProperty(o.prototype, "value", {
    get: function() {
      const e = this._hidden.value;
      return e === "" ? NaN : parseFloat(e);
    },
    set: function(e) {
      if (typeof e != "number" || isNaN(e)) {
        this.dom.value = "", this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._displayFormatted(e), this._setHiddenRaw(e), S(this.dom, "ln-number:input", {
        value: e,
        formatted: this.dom.value
      }), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(o.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), o.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function r() {
    new MutationObserver(function() {
      const e = document.querySelectorAll("[" + h + "]");
      for (let n = 0; n < e.length; n++) {
        const t = e[n][c];
        t && !isNaN(t.value) && t._displayFormatted(t.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  N(h, c, o, "ln-number"), r();
})();
(function() {
  const h = "data-ln-date", c = "lnDate";
  if (window[c] !== void 0) return;
  const v = {}, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(s, d) {
    const f = s + "|" + JSON.stringify(d);
    return v[f] || (v[f] = new Intl.DateTimeFormat(s, d)), v[f];
  }
  const _ = /^(short|medium|long)(\s+datetime)?$/, o = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function r(s) {
    return !s || s === "" ? { dateStyle: "medium" } : s.match(_) ? o[s] : null;
  }
  function e(s, d, f) {
    const l = s.getDate(), g = s.getMonth(), y = s.getFullYear(), w = s.getHours(), A = s.getMinutes(), E = {
      yyyy: String(y),
      yy: String(y).slice(-2),
      MMMM: m(f, { month: "long" }).format(s),
      MMM: m(f, { month: "short" }).format(s),
      MM: String(g + 1).padStart(2, "0"),
      M: String(g + 1),
      dd: String(l).padStart(2, "0"),
      d: String(l),
      HH: String(w).padStart(2, "0"),
      mm: String(A).padStart(2, "0")
    };
    return d.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(k) {
      return E[k];
    });
  }
  function n(s, d, f) {
    const l = r(d);
    return l ? m(f, l).format(s) : e(s, d, f);
  }
  function t(s) {
    if (s.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", s.tagName), this;
    if (s[c]) return s[c];
    s[c] = this, this.dom = s;
    const d = this, f = s.value, l = s.name, g = document.createElement("span");
    g.setAttribute("data-ln-date-field", ""), s.parentNode.insertBefore(g, s), g.appendChild(s), this._wrapper = g;
    const y = document.createElement("input");
    y.type = "hidden", y.name = l, s.removeAttribute("name"), s.insertAdjacentElement("afterend", y), this._hidden = y;
    const w = document.createElement("input");
    w.type = "date", w.tabIndex = -1, w.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", y.insertAdjacentElement("afterend", w), this._picker = w, s.type = "text";
    const A = document.createElement("button");
    if (A.type = "button", A.setAttribute("aria-label", "Open date picker"), A.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', w.insertAdjacentElement("afterend", A), this._btn = A, this._lastISO = "", Object.defineProperty(y, "value", {
      get: function() {
        return p.get.call(y);
      },
      set: function(E) {
        if (p.set.call(y, E), E && E !== "") {
          const k = i(E);
          k && (d._displayFormatted(k), p.set.call(w, E), d._lastISO = E, S(d.dom, "ln-date:change", {
            value: E,
            formatted: d.dom.value,
            date: k
          }), d.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else E === "" && (d.dom.value = "", p.set.call(w, ""), d._lastISO = "", S(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), d.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), kt(s, p, {
      get: function() {
        return p.get.call(s);
      },
      set: function(E, k) {
        if (d._isFormatting) {
          k(E);
          return;
        }
        if (!E || E === "") {
          k(""), d._setHiddenRaw(""), p.set.call(d._picker, ""), d._lastISO = "", S(s, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let x = i(E);
        if (x || (x = a(E)), x) {
          const R = x.getFullYear(), O = String(x.getMonth() + 1).padStart(2, "0"), M = String(x.getDate()).padStart(2, "0"), B = R + "-" + O + "-" + M;
          d._setHiddenRaw(B), p.set.call(d._picker, B), d._lastISO = B;
          const j = s.getAttribute(h) || "", $ = J(s), Q = n(x, j, $);
          k(Q), S(s, "ln-date:change", {
            value: B,
            formatted: Q,
            date: x
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          k(String(E)), d._setHiddenRaw(""), p.set.call(d._picker, ""), d._lastISO = "", S(s, "ln-date:change", {
            value: "",
            formatted: String(E),
            date: null
          }), s.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const E = w.value;
      if (E) {
        const k = i(E);
        k && (d._setHiddenRaw(E), d._displayFormatted(k), d._lastISO = E, S(d.dom, "ln-date:change", {
          value: E,
          formatted: d.dom.value,
          date: k
        }));
      } else
        d._setHiddenRaw(""), d.dom.value = "", d._lastISO = "", S(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, w.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const E = d.dom.value.trim();
      if (E === "") {
        d._lastISO !== "" && (d._setHiddenRaw(""), p.set.call(d._picker, ""), d.dom.value = "", d._lastISO = "", S(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (d._lastISO) {
        const x = i(d._lastISO);
        if (x) {
          const R = d.dom.getAttribute(h) || "", O = J(d.dom), M = n(x, R, O);
          if (E === M) return;
        }
      }
      const k = a(E);
      if (k) {
        const x = k.getFullYear(), R = String(k.getMonth() + 1).padStart(2, "0"), O = String(k.getDate()).padStart(2, "0"), M = x + "-" + R + "-" + O;
        d._setHiddenRaw(M), p.set.call(d._picker, M), d._displayFormatted(k), d._lastISO = M, S(d.dom, "ln-date:change", {
          value: M,
          formatted: d.dom.value,
          date: k
        });
      } else if (d._lastISO) {
        const x = i(d._lastISO);
        x && d._displayFormatted(x);
      } else
        d.dom.value = "";
    }, s.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, A.addEventListener("click", this._onBtnClick), f && f !== "") {
      const E = i(f);
      E && (this._setHiddenRaw(f), p.set.call(w, f), this._displayFormatted(E), this._lastISO = f, S(s, "ln-date:change", {
        value: f,
        formatted: s.value,
        date: E
      }), s.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function i(s) {
    if (!s || typeof s != "string") return null;
    const d = s.split("T"), f = d[0].split("-");
    if (f.length < 3) return null;
    const l = parseInt(f[0], 10), g = parseInt(f[1], 10) - 1, y = parseInt(f[2], 10);
    if (isNaN(l) || isNaN(g) || isNaN(y)) return null;
    let w = 0, A = 0;
    if (d[1]) {
      const k = d[1].split(":");
      w = parseInt(k[0], 10) || 0, A = parseInt(k[1], 10) || 0;
    }
    const E = new Date(l, g, y, w, A);
    return E.getFullYear() !== l || E.getMonth() !== g || E.getDate() !== y ? null : E;
  }
  function a(s) {
    if (!s || typeof s != "string" || (s = s.trim(), s.length < 6)) return null;
    let d, f;
    if (s.indexOf(".") !== -1)
      d = ".", f = s.split(".");
    else if (s.indexOf("/") !== -1)
      d = "/", f = s.split("/");
    else if (s.indexOf("-") !== -1)
      d = "-", f = s.split("-");
    else
      return null;
    if (f.length !== 3) return null;
    const l = [];
    for (let E = 0; E < 3; E++) {
      const k = parseInt(f[E], 10);
      if (isNaN(k)) return null;
      l.push(k);
    }
    let g, y, w;
    d === "." ? (g = l[0], y = l[1], w = l[2]) : d === "/" ? (y = l[0], g = l[1], w = l[2]) : f[0].length === 4 ? (w = l[0], y = l[1], g = l[2]) : (g = l[0], y = l[1], w = l[2]), w < 100 && (w += w < 50 ? 2e3 : 1900);
    const A = new Date(w, y - 1, g);
    return A.getFullYear() !== w || A.getMonth() !== y - 1 || A.getDate() !== g ? null : A;
  }
  t.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, t.prototype._setHiddenRaw = function(s) {
    p.set.call(this._hidden, s);
  }, t.prototype._displayFormatted = function(s) {
    const d = this.dom.getAttribute(h) || "", f = J(this.dom);
    this._isFormatting = !0, this.dom.value = n(s, d, f), this._isFormatting = !1;
  }, Object.defineProperty(t.prototype, "value", {
    get: function() {
      return p.get.call(this._hidden);
    },
    set: function(s) {
      if (!s || s === "") {
        this._setHiddenRaw(""), p.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const d = i(s);
      d && (this._setHiddenRaw(s), p.set.call(this._picker, s), this._displayFormatted(d), this._lastISO = s, S(this.dom, "ln-date:change", {
        value: s,
        formatted: this.dom.value,
        date: d
      }));
    }
  }), Object.defineProperty(t.prototype, "date", {
    get: function() {
      const s = this.value;
      return s ? i(s) : null;
    },
    set: function(s) {
      if (!s || !(s instanceof Date) || isNaN(s.getTime())) {
        this.value = "";
        return;
      }
      const d = s.getFullYear(), f = String(s.getMonth() + 1).padStart(2, "0"), l = String(s.getDate()).padStart(2, "0");
      this.value = d + "-" + f + "-" + l;
    }
  }), Object.defineProperty(t.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), t.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const s = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), s && (this.dom.value = s), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function u() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + h + "]");
      for (let d = 0; d < s.length; d++) {
        const f = s[d][c];
        if (f && f.value) {
          const l = i(f.value);
          l && f._displayFormatted(l);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  N(h, c, t, "ln-date"), u();
})();
(function() {
  const h = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0) return;
  const v = /* @__PURE__ */ new WeakMap(), p = [];
  if (!history._lnNavPatched) {
    const t = history.pushState;
    history.pushState = function() {
      t.apply(history, arguments);
      for (const i of p)
        i();
    }, history._lnNavPatched = !0;
  }
  function m(t) {
    if (!t.hasAttribute(h) || v.has(t)) return;
    const i = t.getAttribute(h);
    if (!i) return;
    const a = _(t, i);
    v.set(t, a), t[c] = a;
  }
  function _(t, i) {
    let a = Array.from(t.querySelectorAll("a"));
    r(a, i, window.location.pathname);
    const u = function() {
      a = Array.from(t.querySelectorAll("a")), r(a, i, window.location.pathname);
    };
    window.addEventListener("popstate", u), p.push(u);
    const s = new MutationObserver(function(d) {
      for (const f of d)
        if (f.type === "childList") {
          for (const l of f.addedNodes)
            if (l.nodeType === 1) {
              if (l.tagName === "A")
                a.push(l), r([l], i, window.location.pathname);
              else if (l.querySelectorAll) {
                const g = Array.from(l.querySelectorAll("a"));
                a = a.concat(g), r(g, i, window.location.pathname);
              }
            }
          for (const l of f.removedNodes)
            if (l.nodeType === 1) {
              if (l.tagName === "A")
                a = a.filter(function(g) {
                  return g !== l;
                });
              else if (l.querySelectorAll) {
                const g = Array.from(l.querySelectorAll("a"));
                a = a.filter(function(y) {
                  return !g.includes(y);
                });
              }
            }
        }
    });
    return s.observe(t, { childList: !0, subtree: !0 }), {
      navElement: t,
      activeClass: i,
      observer: s,
      updateHandler: u,
      destroy: function() {
        s.disconnect(), window.removeEventListener("popstate", u);
        const d = p.indexOf(u);
        d !== -1 && p.splice(d, 1), v.delete(t), delete t[c];
      }
    };
  }
  function o(t) {
    try {
      return new URL(t, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return t.replace(/\/$/, "") || "/";
    }
  }
  function r(t, i, a) {
    const u = o(a);
    for (const s of t) {
      const d = s.getAttribute("href");
      if (!d) continue;
      const f = o(d);
      s.classList.remove(i);
      const l = f === u, g = f !== "/" && u.startsWith(f + "/");
      (l || g) && s.classList.add(i);
    }
  }
  function e() {
    G(function() {
      new MutationObserver(function(i) {
        for (const a of i)
          if (a.type === "childList") {
            for (const u of a.addedNodes)
              if (u.nodeType === 1 && (u.hasAttribute && u.hasAttribute(h) && m(u), u.querySelectorAll))
                for (const s of u.querySelectorAll("[" + h + "]"))
                  m(s);
          } else a.type === "attributes" && a.target.hasAttribute && a.target.hasAttribute(h) && m(a.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[c] = m;
  function n() {
    for (const t of document.querySelectorAll("[" + h + "]"))
      m(t);
  }
  e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function v() {
    const o = (location.hash || "").replace("#", ""), r = {};
    if (!o) return r;
    for (const e of o.split("&")) {
      const n = e.indexOf(":");
      n > 0 && (r[e.slice(0, n)] = e.slice(n + 1));
    }
    return r;
  }
  function p(o, r) {
    const e = (o.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (e) return e;
    if (o.tagName !== "A") return "";
    const n = o.getAttribute("href") || "";
    if (!n.startsWith("#")) return "";
    const t = n.slice(1);
    if (!t) return "";
    const i = t.split("&");
    if (r)
      for (const s of i) {
        const d = s.indexOf(":");
        if (d > 0 && s.slice(0, d).toLowerCase().trim() === r)
          return s.slice(d + 1).toLowerCase().trim();
      }
    const a = i[i.length - 1] || "", u = a.indexOf(":");
    return (u > 0 ? a.slice(u + 1) : a).toLowerCase().trim();
  }
  function m(o) {
    return this.dom = o, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const r of this.tabs) {
      const e = p(r, this.nsKey);
      e ? this.mapTabs[e] = r : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', r);
    }
    for (const r of this.panels) {
      const e = (r.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      e && (this.mapPanels[e] = r);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const o = this;
    this._clickHandlers = [];
    for (const r of this.tabs) {
      if (r[c + "Trigger"]) continue;
      const e = function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        const t = p(r, o.nsKey);
        if (t)
          if (r.tagName === "A" && n.preventDefault(), o.hashEnabled) {
            const i = v();
            i[o.nsKey] = t;
            const a = Object.keys(i).map(function(u) {
              return u + ":" + i[u];
            }).join("&");
            location.hash === "#" + a ? o.dom.setAttribute("data-ln-tabs-active", t) : location.hash = a;
          } else
            o.dom.setAttribute("data-ln-tabs-active", t);
      };
      r.addEventListener("click", e), r[c + "Trigger"] = e, o._clickHandlers.push({ el: r, handler: e });
    }
    if (this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const r = v();
      o.dom.setAttribute("data-ln-tabs-active", o.nsKey in r ? r[o.nsKey] : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let r = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const e = _t("tabs", this.dom);
        e !== null && e in this.mapPanels && (r = e);
      }
      this.dom.setAttribute("data-ln-tabs-active", r);
    }
  }
  m.prototype._applyActive = function(o) {
    var r;
    (!o || !(o in this.mapPanels)) && (o = this.defaultKey);
    for (const e in this.mapTabs) {
      const n = this.mapTabs[e];
      e === o ? (n.setAttribute("data-active", ""), n.setAttribute("aria-selected", "true")) : (n.removeAttribute("data-active"), n.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const n = this.mapPanels[e], t = e === o;
      n.classList.toggle("hidden", !t), n.setAttribute("aria-hidden", t ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (r = this.mapPanels[o]) == null ? void 0 : r.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: o, tab: this.mapTabs[o], panel: this.mapPanels[o] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && st("tabs", this.dom, o);
  }, m.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const { el: o, handler: r } of this._clickHandlers)
        o.removeEventListener("click", r), delete o[c + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[c];
    }
  }, N(h, c, m, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(o) {
      const r = o.getAttribute("data-ln-tabs-active");
      o[c]._applyActive(r);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function v(o) {
    const r = Array.from(o.querySelectorAll("[data-ln-toggle-for]"));
    o.hasAttribute && o.hasAttribute("data-ln-toggle-for") && r.push(o);
    for (const e of r) {
      if (e[c + "Trigger"]) continue;
      const n = function(a) {
        if (a.ctrlKey || a.metaKey || a.button === 1) return;
        a.preventDefault();
        const u = e.getAttribute("data-ln-toggle-for"), s = document.getElementById(u);
        if (!s || !s[c]) return;
        const d = e.getAttribute("data-ln-toggle-action") || "toggle";
        if (d === "open")
          s.setAttribute(h, "open");
        else if (d === "close")
          s.setAttribute(h, "close");
        else if (d === "toggle") {
          const f = s.getAttribute(h);
          s.setAttribute(h, f === "open" ? "close" : "open");
        }
      };
      e.addEventListener("click", n), e[c + "Trigger"] = n;
      const t = e.getAttribute("data-ln-toggle-for"), i = document.getElementById(t);
      i && i[c] && e.setAttribute("aria-expanded", i[c].isOpen ? "true" : "false");
    }
  }
  function p(o, r) {
    const e = document.querySelectorAll(
      '[data-ln-toggle-for="' + o.id + '"]'
    );
    for (const n of e)
      n.setAttribute("aria-expanded", r ? "true" : "false");
  }
  function m(o) {
    if (this.dom = o, o.hasAttribute("data-ln-persist")) {
      const r = _t("toggle", o);
      r !== null && o.setAttribute(h, r);
    }
    return this.isOpen = o.getAttribute(h) === "open", this.isOpen && o.classList.add("open"), p(o, this.isOpen), this;
  }
  m.prototype.destroy = function() {
    if (!this.dom[c]) return;
    S(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const o = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const r of o)
      r[c + "Trigger"] && (r.removeEventListener("click", r[c + "Trigger"]), delete r[c + "Trigger"]);
    delete this.dom[c];
  };
  function _(o) {
    const r = o[c];
    if (!r) return;
    const n = o.getAttribute(h) === "open";
    if (n !== r.isOpen)
      if (n) {
        if (K(o, "ln-toggle:before-open", { target: o }).defaultPrevented) {
          o.setAttribute(h, "close");
          return;
        }
        r.isOpen = !0, o.classList.add("open"), p(o, !0), S(o, "ln-toggle:open", { target: o }), o.hasAttribute("data-ln-persist") && st("toggle", o, "open");
      } else {
        if (K(o, "ln-toggle:before-close", { target: o }).defaultPrevented) {
          o.setAttribute(h, "open");
          return;
        }
        r.isOpen = !1, o.classList.remove("open"), p(o, !1), S(o, "ln-toggle:close", { target: o }), o.hasAttribute("data-ln-persist") && st("toggle", o, "close");
      }
  }
  N(h, c, m, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: _,
    onInit: v
  });
})();
(function() {
  const h = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function v(p) {
    return this.dom = p, this._onToggleOpen = function(m) {
      if (m.detail.target.closest("[data-ln-accordion]") !== p) return;
      const _ = p.querySelectorAll("[data-ln-toggle]");
      for (const o of _)
        o !== m.detail.target && o.closest("[data-ln-accordion]") === p && o.getAttribute("data-ln-toggle") === "open" && o.setAttribute("data-ln-toggle", "close");
      S(p, "ln-accordion:change", { target: m.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[c]);
  }, N(h, c, v, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", c = "lnDropdown";
  if (window[c] !== void 0) return;
  function v(p) {
    if (this.dom = p, this.toggleEl = p.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = p.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const _ of this.toggleEl.children)
        _.setAttribute("role", "menuitem");
    const m = this;
    return this._onToggleOpen = function(_) {
      _.detail.target === m.toggleEl && (m.triggerBtn && m.triggerBtn.setAttribute("aria-expanded", "true"), m._teleportRestore = Dt(m.toggleEl), m.toggleEl.style.position = "fixed", m.toggleEl.style.right = "auto", m._reposition(), m._addOutsideClickListener(), m._addScrollRepositionListener(), m._addResizeCloseListener(), S(p, "ln-dropdown:open", { target: _.detail.target }));
    }, this._onToggleClose = function(_) {
      _.detail.target === m.toggleEl && (m.triggerBtn && m.triggerBtn.setAttribute("aria-expanded", "false"), m._removeOutsideClickListener(), m._removeScrollRepositionListener(), m._removeResizeCloseListener(), m.toggleEl.style.position = "", m.toggleEl.style.top = "", m.toggleEl.style.left = "", m.toggleEl.style.right = "", m.toggleEl.style.transform = "", m.toggleEl.style.margin = "", m._teleportRestore && (m._teleportRestore(), m._teleportRestore = null), S(p, "ln-dropdown:close", { target: _.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  v.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const p = this.triggerBtn.getBoundingClientRect(), m = At(this.toggleEl), _ = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, o = gt(p, m, "bottom-end", _);
    this.toggleEl.style.top = o.top + "px", this.toggleEl.style.left = o.left + "px";
  }, v.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const p = this;
    this._boundDocClick = function(m) {
      p.dom.contains(m.target) || p.toggleEl && p.toggleEl.contains(m.target) || p.toggleEl && p.toggleEl.getAttribute("data-ln-toggle") === "open" && p.toggleEl.setAttribute("data-ln-toggle", "close");
    }, p._docClickTimeout = setTimeout(function() {
      p._docClickTimeout = null, document.addEventListener("click", p._boundDocClick);
    }, 0);
  }, v.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, v.prototype._addScrollRepositionListener = function() {
    const p = this;
    this._boundScrollReposition = function() {
      p._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, v.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, v.prototype._addResizeCloseListener = function() {
    const p = this;
    this._boundResizeClose = function() {
      p.toggleEl && p.toggleEl.getAttribute("data-ln-toggle") === "open" && p.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, v.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, v.prototype.destroy = function() {
    this.dom[c] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[c]);
  }, N(h, c, v, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", c = "lnPopover", v = "data-ln-popover-for", p = "data-ln-popover-position";
  if (window[c] !== void 0) return;
  const m = [];
  let _ = null;
  function o() {
    _ || (_ = function(t) {
      if (t.key !== "Escape" || m.length === 0) return;
      m[m.length - 1].close();
    }, document.addEventListener("keydown", _));
  }
  function r() {
    m.length > 0 || _ && (document.removeEventListener("keydown", _), _ = null);
  }
  function e(t) {
    return this.dom = t, this.isOpen = t.getAttribute(h) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), t.hasAttribute("role") || t.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  e.prototype.open = function(t) {
    this.isOpen || (this.trigger = t || null, this.dom.setAttribute(h, "open"));
  }, e.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, e.prototype.toggle = function(t) {
    this.isOpen ? this.close() : this.open(t);
  }, e.prototype._applyOpen = function(t) {
    this.isOpen = !0, t && (this.trigger = t), this._previousFocus = document.activeElement, this._teleportRestore = Dt(this.dom);
    const i = At(this.dom);
    if (this.trigger) {
      const d = this.trigger.getBoundingClientRect(), f = this.dom.getAttribute(p) || "bottom", l = gt(d, i, f, 8);
      this.dom.style.top = l.top + "px", this.dom.style.left = l.left + "px", this.dom.setAttribute("data-ln-popover-placement", l.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const a = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), u = Array.prototype.find.call(a, pt);
    u ? u.focus() : this.dom.focus();
    const s = this;
    this._boundDocClick = function(d) {
      s.dom.contains(d.target) || s.trigger && s.trigger.contains(d.target) || s.close();
    }, s._docClickTimeout = setTimeout(function() {
      s._docClickTimeout = null, document.addEventListener("click", s._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!s.trigger) return;
      const d = s.trigger.getBoundingClientRect(), f = At(s.dom), l = s.dom.getAttribute(p) || "bottom", g = gt(d, f, l, 8);
      s.dom.style.top = g.top + "px", s.dom.style.left = g.left + "px", s.dom.setAttribute("data-ln-popover-placement", g.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), m.push(this), o(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, e.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const t = m.indexOf(this);
    t !== -1 && m.splice(t, 1), r(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, e.prototype.destroy = function() {
    this.dom[c] && (this.isOpen && this._applyClose(), delete this.dom[c], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function n(t) {
    this.dom = t;
    const i = t.getAttribute(v);
    return t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", i), this._onClick = function(a) {
      if (a.ctrlKey || a.metaKey || a.button === 1) return;
      a.preventDefault();
      const u = document.getElementById(i);
      !u || !u[c] || u[c].toggle(t);
    }, t.addEventListener("click", this._onClick), this;
  }
  n.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[c + "Trigger"];
  }, N(h, c, e, "ln-popover", {
    onAttributeChange: function(t) {
      const i = t[c];
      if (!i) return;
      const u = t.getAttribute(h) === "open";
      if (u !== i.isOpen)
        if (u) {
          if (K(t, "ln-popover:before-open", {
            popoverId: t.id,
            target: t,
            trigger: i.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "closed");
            return;
          }
          i._applyOpen(i.trigger);
        } else {
          if (K(t, "ln-popover:before-close", {
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
  }), N(v, c + "Trigger", n, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", c = "data-ln-tooltip", v = "data-ln-tooltip-position", p = "lnTooltipEnhance", m = "ln-tooltip-portal";
  if (window[p] !== void 0) return;
  let _ = 0, o = null, r = null, e = null, n = null, t = null;
  function i() {
    return o && o.parentNode || (o = document.getElementById(m), o || (o = document.createElement("div"), o.id = m, document.body.appendChild(o))), o;
  }
  function a() {
    t || (t = function(l) {
      l.key === "Escape" && d();
    }, document.addEventListener("keydown", t));
  }
  function u() {
    t && (document.removeEventListener("keydown", t), t = null);
  }
  function s(l) {
    if (e === l) return;
    d();
    const g = l.getAttribute(c) || l.getAttribute("title");
    if (!g) return;
    i(), l.hasAttribute("title") && (n = l.getAttribute("title"), l.removeAttribute("title"));
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = g, l[p + "Uid"] || (_ += 1, l[p + "Uid"] = "ln-tooltip-" + _), y.id = l[p + "Uid"], o.appendChild(y);
    const w = y.offsetWidth, A = y.offsetHeight, E = l.getBoundingClientRect(), k = l.getAttribute(v) || "top", x = gt(E, { width: w, height: A }, k, 6);
    y.style.top = x.top + "px", y.style.left = x.left + "px", y.setAttribute("data-ln-tooltip-placement", x.placement), l.setAttribute("aria-describedby", y.id), r = y, e = l, a();
  }
  function d() {
    if (!r) {
      u();
      return;
    }
    e && (e.removeAttribute("aria-describedby"), n !== null && e.setAttribute("title", n)), n = null, r.parentNode && r.parentNode.removeChild(r), r = null, e = null, u();
  }
  function f(l) {
    return this.dom = l, l.hasAttribute("data-ln-tooltip-enhanced") || (l.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      s(l);
    }, this._onLeave = function() {
      e === l && d();
    }, this._onFocus = function() {
      s(l);
    }, this._onBlur = function() {
      e === l && d();
    }, l.addEventListener("mouseenter", this._onEnter), l.addEventListener("mouseleave", this._onLeave), l.addEventListener("focus", this._onFocus, !0), l.addEventListener("blur", this._onBlur, !0), this;
  }
  f.prototype.destroy = function() {
    const l = this.dom;
    l.removeEventListener("mouseenter", this._onEnter), l.removeEventListener("mouseleave", this._onLeave), l.removeEventListener("focus", this._onFocus, !0), l.removeEventListener("blur", this._onBlur, !0), e === l && d(), this._addedEnhancedAttr && l.removeAttribute("data-ln-tooltip-enhanced"), delete l[p], delete l[p + "Uid"], S(l, "ln-tooltip:destroyed", { trigger: l });
  }, N(
    "[" + h + "], [" + c + "][title]",
    p,
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
  const h = "data-ln-toast", c = "lnToast", v = "ln-toast-item", p = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, m = { success: "success", error: "error", warn: "warning", info: "info" }, _ = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function o() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const l = document.createElement("template");
    l.setAttribute("data-ln-template", "ln-toast-item"), l.innerHTML = jt, document.body.appendChild(l);
  }
  function r(l) {
    if (!l || l.nodeType !== 1) return;
    const g = Array.from(l.querySelectorAll("[" + h + "]"));
    l.hasAttribute && l.hasAttribute(h) && g.push(l);
    for (const y of g)
      y[c] || new e(y);
  }
  function e(l) {
    this.dom = l, l[c] = this, this.timeoutDefault = parseInt(l.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(l.getAttribute("data-ln-toast-max") || "5", 10);
    for (const g of Array.from(l.querySelectorAll("[data-ln-toast-item]")))
      s(g, l);
    return this;
  }
  e.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const l of Array.from(this.dom.children))
        a(l);
      delete this.dom[c];
    }
  };
  function n(l, g) {
    const y = ((l.type || "info") + "").toLowerCase(), w = ot(g, v, "ln-toast");
    if (!w)
      return console.warn('[ln-toast] Template "' + v + '" not found'), null;
    const A = w.firstElementChild;
    if (!A) return null;
    const E = !!(l.message || l.data && l.data.errors);
    et(A, {
      title: l.title || _[y] || _.info,
      role: y === "error" ? "alert" : "status",
      ariaLive: y === "error" ? "assertive" : "polite",
      hasBody: E
    });
    const k = A.querySelector(".ln-toast__card");
    k && k.classList.add(m[y] || "info");
    const x = A.querySelector(".ln-toast__side");
    if (x) {
      const M = x.querySelector("use");
      M && M.setAttribute("href", "#ln-" + (p[y] || p.info));
    }
    const R = A.querySelector(".ln-toast__body");
    R && E && t(R, l);
    const O = A.querySelector(".ln-toast__close");
    return O && O.addEventListener("click", function() {
      a(A);
    }), A;
  }
  function t(l, g) {
    if (g.message)
      if (Array.isArray(g.message)) {
        const y = document.createElement("ul");
        for (const w of g.message) {
          const A = document.createElement("li");
          A.textContent = w, y.appendChild(A);
        }
        l.appendChild(y);
      } else {
        const y = document.createElement("p");
        y.textContent = g.message, l.appendChild(y);
      }
    if (g.data && g.data.errors) {
      const y = document.createElement("ul");
      for (const w of Object.values(g.data.errors).flat()) {
        const A = document.createElement("li");
        A.textContent = w, y.appendChild(A);
      }
      l.appendChild(y);
    }
  }
  function i(l, g) {
    for (; l.dom.children.length >= l.max; ) l.dom.removeChild(l.dom.firstElementChild);
    l.dom.appendChild(g), requestAnimationFrame(() => g.classList.add("ln-toast__item--in"));
  }
  function a(l) {
    !l || !l.parentNode || (clearTimeout(l._timer), l.classList.remove("ln-toast__item--in"), l.classList.add("ln-toast__item--out"), setTimeout(() => {
      l.parentNode && l.parentNode.removeChild(l);
    }, 200));
  }
  function u(l) {
    let g = l && l.container;
    return typeof g == "string" && (g = document.querySelector(g)), g instanceof HTMLElement || (g = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), g || null;
  }
  function s(l, g) {
    const y = ((l.getAttribute("data-type") || "info") + "").toLowerCase(), w = l.getAttribute("data-title"), A = (l.innerText || l.textContent || "").trim(), E = n({
      type: y,
      title: w,
      message: A || void 0
    }, g);
    E && (l.parentNode && l.parentNode.replaceChild(E, l), requestAnimationFrame(() => E.classList.add("ln-toast__item--in")));
  }
  function d(l) {
    const g = l.detail || {}, y = u(g);
    if (!y) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const w = y[c] || new e(y), A = n(g, y);
    if (!A) return;
    const E = Number.isFinite(g.timeout) ? g.timeout : w.timeoutDefault;
    i(w, A), E > 0 && (A._timer = setTimeout(() => a(A), E));
  }
  function f(l) {
    const g = l && l.detail || {};
    if (g.container) {
      const y = u(g);
      if (y)
        for (const w of Array.from(y.children)) a(w);
    } else {
      const y = document.querySelectorAll("[" + h + "]");
      for (const w of Array.from(y))
        for (const A of Array.from(w.children)) a(A);
    }
  }
  G(function() {
    o(), window.addEventListener("ln-toast:enqueue", d), window.addEventListener("ln-toast:clear", f), new MutationObserver(function(g) {
      for (const y of g) {
        if (y.type === "attributes") {
          r(y.target);
          continue;
        }
        for (const w of y.addedNodes)
          r(w);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), r(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", c = "lnUpload", v = "data-ln-upload-dict", p = "data-ln-upload-accept", m = "data-ln-upload-context", _ = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function o() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const s = document.createElement("div");
    s.innerHTML = _;
    const d = s.firstElementChild;
    d && document.body.appendChild(d);
  }
  if (window[c] !== void 0) return;
  function r(s) {
    if (s === 0) return "0 B";
    const d = 1024, f = ["B", "KB", "MB", "GB"], l = Math.floor(Math.log(s) / Math.log(d));
    return parseFloat((s / Math.pow(d, l)).toFixed(1)) + " " + f[l];
  }
  function e(s) {
    return s.split(".").pop().toLowerCase();
  }
  function n(s) {
    return s === "docx" && (s = "doc"), ["pdf", "doc", "epub"].includes(s) ? "lnc-file-" + s : "ln-file";
  }
  function t(s, d) {
    if (!d) return !0;
    const f = "." + e(s.name);
    return d.split(",").map(function(g) {
      return g.trim().toLowerCase();
    }).includes(f.toLowerCase());
  }
  function i(s) {
    if (s.hasAttribute("data-ln-upload-initialized")) return;
    s.setAttribute("data-ln-upload-initialized", "true"), o();
    const d = qt(s, v), f = s.querySelector(".ln-upload__zone"), l = s.querySelector(".ln-upload__list"), g = s.getAttribute(p) || "";
    if (!f || !l) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", s);
      return;
    }
    let y = s.querySelector('input[type="file"]');
    y || (y = document.createElement("input"), y.type = "file", y.multiple = !0, y.classList.add("hidden"), g && (y.accept = g.split(",").map(function(D) {
      return D = D.trim(), D.startsWith(".") ? D : "." + D;
    }).join(",")), s.appendChild(y));
    const w = s.getAttribute(h) || "/files/upload", A = s.getAttribute(m) || "", E = /* @__PURE__ */ new Map();
    let k = 0;
    function x() {
      const D = document.querySelector('meta[name="csrf-token"]');
      return D ? D.getAttribute("content") : "";
    }
    function R(D) {
      if (!t(D, g)) {
        const C = d["invalid-type"];
        S(s, "ln-upload:invalid", {
          file: D,
          message: C
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["invalid-title"] || "Invalid File",
          message: C || d["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++k, H = e(D.name), rt = n(H), ct = ot(s, "ln-upload-item", "ln-upload");
      if (!ct) return;
      const W = ct.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", P), et(W, {
        name: D.name,
        sizeText: "0%",
        iconHref: "#" + rt,
        removeLabel: d.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const dt = W.querySelector(".ln-upload__progress-bar"), Z = W.querySelector('[data-ln-upload-action="remove"]');
      Z && (Z.disabled = !0), l.appendChild(W);
      const ut = new FormData();
      ut.append("file", D), ut.append("context", A);
      const b = new XMLHttpRequest();
      b.upload.addEventListener("progress", function(C) {
        if (C.lengthComputable) {
          const T = Math.round(C.loaded / C.total * 100);
          dt.style.width = T + "%", et(W, { sizeText: T + "%" });
        }
      }), b.addEventListener("load", function() {
        if (b.status >= 200 && b.status < 300) {
          let C;
          try {
            C = JSON.parse(b.responseText);
          } catch {
            L("Invalid response");
            return;
          }
          et(W, { sizeText: r(C.size || D.size), uploading: !1 }), Z && (Z.disabled = !1), E.set(P, {
            serverId: C.id,
            name: C.name,
            size: C.size
          }), O(), S(s, "ln-upload:uploaded", {
            localId: P,
            serverId: C.id,
            name: C.name
          });
        } else {
          let C = d["upload-failed"] || "Upload failed";
          try {
            C = JSON.parse(b.responseText).message || C;
          } catch {
          }
          L(C);
        }
      }), b.addEventListener("error", function() {
        L(d["network-error"] || "Network error");
      });
      function L(C) {
        dt && (dt.style.width = "100%"), et(W, { sizeText: d.error || "Error", uploading: !1, error: !0 }), Z && (Z.disabled = !1), S(s, "ln-upload:error", {
          file: D,
          message: C
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["error-title"] || "Upload Error",
          message: C || d["upload-failed"] || "Failed to upload file"
        });
      }
      b.open("POST", w), b.setRequestHeader("X-CSRF-TOKEN", x()), b.setRequestHeader("Accept", "application/json"), b.send(ut);
    }
    function O() {
      for (const D of s.querySelectorAll('input[name="file_ids[]"]'))
        D.remove();
      for (const [, D] of E) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = D.serverId, s.appendChild(P);
      }
    }
    function M(D) {
      const P = E.get(D), H = l.querySelector('[data-file-id="' + D + '"]');
      if (!P || !P.serverId) {
        H && H.remove(), E.delete(D), O();
        return;
      }
      H && et(H, { deleting: !0 }), fetch("/files/" + P.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": x(),
          Accept: "application/json"
        }
      }).then(function(rt) {
        rt.status === 200 ? (H && H.remove(), E.delete(D), O(), S(s, "ln-upload:removed", {
          localId: D,
          serverId: P.serverId
        })) : (H && et(H, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["delete-title"] || "Error",
          message: d["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(rt) {
        console.warn("[ln-upload] Delete error:", rt), H && et(H, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["network-error"] || "Network error",
          message: d["connection-error"] || "Could not connect to server"
        });
      });
    }
    function B(D) {
      for (const P of D)
        R(P);
      y.value = "";
    }
    const j = function() {
      y.click();
    }, $ = function() {
      B(this.files);
    }, Q = function(D) {
      D.preventDefault(), D.stopPropagation(), f.classList.add("ln-upload__zone--dragover");
    }, mt = function(D) {
      D.preventDefault(), D.stopPropagation(), f.classList.add("ln-upload__zone--dragover");
    }, at = function(D) {
      D.preventDefault(), D.stopPropagation(), f.classList.remove("ln-upload__zone--dragover");
    }, Y = function(D) {
      D.preventDefault(), D.stopPropagation(), f.classList.remove("ln-upload__zone--dragover"), B(D.dataTransfer.files);
    }, lt = function(D) {
      const P = D.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !l.contains(P) || P.disabled) return;
      const H = P.closest(".ln-upload__item");
      H && M(H.getAttribute("data-file-id"));
    };
    f.addEventListener("click", j), y.addEventListener("change", $), f.addEventListener("dragenter", Q), f.addEventListener("dragover", mt), f.addEventListener("dragleave", at), f.addEventListener("drop", Y), l.addEventListener("click", lt), s.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(E.values()).map(function(D) {
          return D.serverId;
        });
      },
      getFiles: function() {
        return Array.from(E.values());
      },
      clear: function() {
        for (const [, D] of E)
          D.serverId && fetch("/files/" + D.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": x(),
              Accept: "application/json"
            }
          });
        E.clear(), l.innerHTML = "", O(), S(s, "ln-upload:cleared", {});
      },
      destroy: function() {
        f.removeEventListener("click", j), y.removeEventListener("change", $), f.removeEventListener("dragenter", Q), f.removeEventListener("dragover", mt), f.removeEventListener("dragleave", at), f.removeEventListener("drop", Y), l.removeEventListener("click", lt), E.clear(), l.innerHTML = "", O(), s.removeAttribute("data-ln-upload-initialized"), delete s.lnUploadAPI;
      }
    };
  }
  function a() {
    for (const s of document.querySelectorAll("[" + h + "]"))
      i(s);
  }
  function u() {
    G(function() {
      new MutationObserver(function(d) {
        for (const f of d)
          if (f.type === "childList") {
            for (const l of f.addedNodes)
              if (l.nodeType === 1) {
                l.hasAttribute(h) && i(l);
                for (const g of l.querySelectorAll("[" + h + "]"))
                  i(g);
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
  window[c] = {
    init: i,
    initAll: a
  }, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function c(r) {
    return r.hostname && r.hostname !== window.location.hostname;
  }
  function v(r) {
    if (r.getAttribute("data-ln-external-link") === "processed" || !c(r)) return;
    r.target = "_blank";
    const e = (r.rel || "").split(/\s+/).filter(Boolean);
    e.includes("noopener") || e.push("noopener"), e.includes("noreferrer") || e.push("noreferrer"), r.rel = e.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", r.appendChild(n), r.setAttribute("data-ln-external-link", "processed"), S(r, "ln-external-links:processed", {
      link: r,
      href: r.href
    });
  }
  function p(r) {
    r = r || document.body;
    for (const e of r.querySelectorAll("a, area"))
      v(e);
  }
  function m() {
    G(function() {
      document.body.addEventListener("click", function(r) {
        const e = r.target.closest("a, area");
        e && e.getAttribute("data-ln-external-link") === "processed" && S(e, "ln-external-links:clicked", {
          link: e,
          href: e.href,
          text: e.textContent || e.title || ""
        });
      });
    }, "ln-external-links");
  }
  function _() {
    G(function() {
      new MutationObserver(function(e) {
        for (const n of e) {
          if (n.type === "childList") {
            for (const t of n.addedNodes)
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && v(t), t.querySelectorAll))
                for (const i of t.querySelectorAll("a, area"))
                  v(i);
          }
          if (n.type === "attributes" && n.attributeName === "href") {
            const t = n.target;
            t.matches && (t.matches("a") || t.matches("area")) && v(t);
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
  function o() {
    m(), _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      p();
    }) : p();
  }
  window[h] = {
    process: p
  }, o();
})();
(function() {
  const h = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  let v = null;
  function p() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function m(l) {
    v && (v.textContent = l, v.classList.add("ln-link-status--visible"));
  }
  function _() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function o(l, g) {
    if (g.target.closest("a, button, input, select, textarea")) return;
    const y = l.querySelector("a");
    if (!y) return;
    const w = y.getAttribute("href");
    if (!w) return;
    if (g.ctrlKey || g.metaKey || g.button === 1) {
      window.open(w, "_blank");
      return;
    }
    K(l, "ln-link:navigate", { target: l, href: w, link: y }).defaultPrevented || y.click();
  }
  function r(l) {
    const g = l.querySelector("a");
    if (!g) return;
    const y = g.getAttribute("href");
    y && m(y);
  }
  function e() {
    _();
  }
  function n(l) {
    l[c + "Row"] || (l[c + "Row"] = !0, l.querySelector("a") && (l._lnLinkClick = function(g) {
      o(l, g);
    }, l._lnLinkEnter = function() {
      r(l);
    }, l.addEventListener("click", l._lnLinkClick), l.addEventListener("mouseenter", l._lnLinkEnter), l.addEventListener("mouseleave", e)));
  }
  function t(l) {
    l[c + "Row"] && (l._lnLinkClick && l.removeEventListener("click", l._lnLinkClick), l._lnLinkEnter && l.removeEventListener("mouseenter", l._lnLinkEnter), l.removeEventListener("mouseleave", e), delete l._lnLinkClick, delete l._lnLinkEnter, delete l[c + "Row"]);
  }
  function i(l) {
    if (!l[c + "Init"]) return;
    const g = l.tagName;
    if (g === "TABLE" || g === "TBODY") {
      const y = g === "TABLE" && l.querySelector("tbody") || l;
      for (const w of y.querySelectorAll("tr"))
        t(w);
    } else
      t(l);
    delete l[c + "Init"];
  }
  function a(l) {
    if (l[c + "Init"]) return;
    l[c + "Init"] = !0;
    const g = l.tagName;
    if (g === "TABLE" || g === "TBODY") {
      const y = g === "TABLE" && l.querySelector("tbody") || l;
      for (const w of y.querySelectorAll("tr"))
        n(w);
    } else
      n(l);
  }
  function u(l) {
    l.hasAttribute && l.hasAttribute(h) && a(l);
    const g = l.querySelectorAll ? l.querySelectorAll("[" + h + "]") : [];
    for (const y of g)
      a(y);
  }
  function s() {
    G(function() {
      new MutationObserver(function(g) {
        for (const y of g)
          if (y.type === "childList")
            for (const w of y.addedNodes)
              w.nodeType === 1 && (u(w), w.tagName === "TR" && w.closest("[" + h + "]") && n(w));
          else y.type === "attributes" && u(y.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function d(l) {
    u(l);
  }
  window[c] = { init: d, destroy: i };
  function f() {
    p(), s(), d(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", f) : f();
})();
(function() {
  const h = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0) return;
  function v(n) {
    p(n);
  }
  function p(n) {
    const t = Array.from(n.querySelectorAll(h));
    for (const i of t)
      i[c] || (i[c] = new m(i));
    n.hasAttribute && n.hasAttribute("data-ln-progress") && !n[c] && (n[c] = new m(n));
  }
  function m(n) {
    return this.dom = n, this._attrObserver = null, this._parentObserver = null, e.call(this), o.call(this), r.call(this), this;
  }
  m.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[c]);
  };
  function _() {
    G(function() {
      new MutationObserver(function(t) {
        for (const i of t)
          if (i.type === "childList")
            for (const a of i.addedNodes)
              a.nodeType === 1 && p(a);
          else i.type === "attributes" && p(i.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  _();
  function o() {
    const n = this, t = new MutationObserver(function(i) {
      for (const a of i)
        (a.attributeName === "data-ln-progress" || a.attributeName === "data-ln-progress-max") && e.call(n);
    });
    t.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = t;
  }
  function r() {
    const n = this, t = this.dom.parentElement;
    if (!t || !t.hasAttribute("data-ln-progress-max")) return;
    const i = new MutationObserver(function(a) {
      for (const u of a)
        u.attributeName === "data-ln-progress-max" && e.call(n);
    });
    i.observe(t, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = i;
  }
  function e() {
    const n = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, t = this.dom.parentElement, a = (t && t.hasAttribute("data-ln-progress-max") ? parseFloat(t.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let u = a > 0 ? n / a * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100), this.dom.style.width = u + "%";
    const s = Math.max(0, Math.min(n, a));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(a)), this.dom.setAttribute("aria-valuenow", String(s)), S(this.dom, "ln-progress:change", { target: this.dom, value: n, max: a, percentage: u });
  }
  window[c] = v, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-filter", c = "lnFilter", v = "data-ln-filter-initialized", p = "data-ln-filter-key", m = "data-ln-filter-value", _ = "data-ln-filter-hide", o = "data-ln-filter-reset", r = "data-ln-filter-col", e = /* @__PURE__ */ new WeakMap();
  if (window[c] !== void 0) return;
  function n(s) {
    return s.hasAttribute(o) || s.getAttribute(m) === "";
  }
  function t(s) {
    let d = null;
    const f = [];
    for (let l = 0; l < s.inputs.length; l++) {
      const g = s.inputs[l];
      if (g.checked && !n(g)) {
        d === null && (d = g.getAttribute(p));
        const y = g.getAttribute(m);
        y && f.push(y);
      }
    }
    return { key: d, values: f };
  }
  function i(s, d) {
    if (s.length !== d.length) return !0;
    for (let f = 0; f < s.length; f++) if (s[f] !== d[f]) return !0;
    return !1;
  }
  function a(s) {
    const d = s.dom, f = s.colIndex, l = d.querySelector("template");
    if (!l || f === null) return;
    const g = document.getElementById(s.targetId);
    if (!g) return;
    const y = g.tagName === "TABLE" ? g : g.querySelector("table");
    if (!y || g.hasAttribute("data-ln-table")) return;
    const w = {}, A = [], E = y.tBodies;
    for (let R = 0; R < E.length; R++) {
      const O = E[R].rows;
      for (let M = 0; M < O.length; M++) {
        const B = O[M].cells[f], j = B ? B.textContent.trim() : "";
        j && !w[j] && (w[j] = !0, A.push(j));
      }
    }
    A.sort(function(R, O) {
      return R.localeCompare(O);
    });
    const k = d.querySelector("[" + p + "]"), x = k ? k.getAttribute(p) : d.getAttribute("data-ln-filter-key") || "col" + f;
    for (let R = 0; R < A.length; R++) {
      const O = l.content.cloneNode(!0), M = O.querySelector("input");
      M && (M.setAttribute(p, x), M.setAttribute(m, A[R]), Lt(O, { text: A[R] }), d.appendChild(O));
    }
  }
  function u(s) {
    if (s.hasAttribute(v)) return this;
    this.dom = s, this.targetId = s.getAttribute(h);
    const d = s.getAttribute(r);
    this.colIndex = d !== null ? parseInt(d, 10) : null, a(this), this.inputs = Array.from(s.querySelectorAll("[" + p + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(p) : null, this._lastSnapshot = null;
    const f = this, l = Nt(
      function() {
        f._render();
      },
      function() {
        f._afterRender();
      }
    );
    this._queueRender = l, this._attachHandlers();
    let g = !1;
    if (s.hasAttribute("data-ln-persist")) {
      const y = _t("filter", s);
      if (y && y.key && Array.isArray(y.values) && y.values.length > 0) {
        for (let w = 0; w < this.inputs.length; w++) {
          const A = this.inputs[w];
          n(A) ? A.checked = !1 : A.getAttribute(p) === y.key && y.values.indexOf(A.getAttribute(m)) !== -1 ? A.checked = !0 : A.checked = !1;
        }
        l(), g = !0;
      }
    }
    if (!g) {
      for (let y = 0; y < this.inputs.length; y++)
        if (this.inputs[y].checked && !n(this.inputs[y])) {
          l();
          break;
        }
    }
    return s.setAttribute(v, ""), this;
  }
  u.prototype._attachHandlers = function() {
    const s = this;
    this.inputs.forEach(function(d) {
      d[c + "Bound"] || (d[c + "Bound"] = !0, d._lnFilterChange = function() {
        if (n(d)) {
          for (let f = 0; f < s.inputs.length; f++)
            n(s.inputs[f]) || (s.inputs[f].checked = !1);
          d.checked = !0, s._queueRender();
          return;
        }
        if (d.checked)
          for (let f = 0; f < s.inputs.length; f++)
            n(s.inputs[f]) && (s.inputs[f].checked = !1);
        else {
          let f = !1;
          for (let l = 0; l < s.inputs.length; l++)
            if (!n(s.inputs[l]) && s.inputs[l].checked) {
              f = !0;
              break;
            }
          if (!f)
            for (let l = 0; l < s.inputs.length; l++)
              n(s.inputs[l]) && (s.inputs[l].checked = !0);
        }
        s._queueRender();
      }, d.addEventListener("change", d._lnFilterChange));
    });
  }, u.prototype._render = function() {
    const s = this, d = t(this), f = d.key === null || d.values.length === 0, l = [];
    for (let g = 0; g < d.values.length; g++)
      l.push(d.values[g].toLowerCase());
    if (s.colIndex !== null)
      s._filterTableRows(d);
    else {
      const g = document.getElementById(s.targetId);
      if (!g) return;
      const y = g.children;
      for (let w = 0; w < y.length; w++) {
        const A = y[w];
        if (f) {
          A.removeAttribute(_);
          continue;
        }
        const E = A.getAttribute("data-" + d.key);
        A.removeAttribute(_), E !== null && l.indexOf(E.toLowerCase()) === -1 && A.setAttribute(_, "true");
      }
    }
  }, u.prototype._afterRender = function() {
    const s = t(this), d = this._lastSnapshot;
    if (!d || d.key !== s.key || i(d.values, s.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: s.key,
        values: s.values.slice()
      });
      const l = d && d.values.length > 0, g = s.values.length === 0;
      l && g && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: s.key, values: s.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (s.key && s.values.length > 0 ? st("filter", this.dom, { key: s.key, values: s.values.slice() }) : st("filter", this.dom, null));
  }, u.prototype._dispatchOnBoth = function(s, d) {
    S(this.dom, s, d);
    const f = document.getElementById(this.targetId);
    f && f !== this.dom && S(f, s, d);
  }, u.prototype._filterTableRows = function(s) {
    const d = document.getElementById(this.targetId);
    if (!d) return;
    const f = d.tagName === "TABLE" ? d : d.querySelector("table");
    if (!f || d.hasAttribute("data-ln-table")) return;
    const l = s.key || this._filterKey, g = s.values;
    e.has(f) || e.set(f, {});
    const y = e.get(f);
    if (l && g.length > 0) {
      const k = [];
      for (let x = 0; x < g.length; x++)
        k.push(g[x].toLowerCase());
      y[l] = { col: this.colIndex, values: k };
    } else l && delete y[l];
    const w = Object.keys(y), A = w.length > 0, E = f.tBodies;
    for (let k = 0; k < E.length; k++) {
      const x = E[k].rows;
      for (let R = 0; R < x.length; R++) {
        const O = x[R];
        if (!A) {
          O.removeAttribute(_);
          continue;
        }
        let M = !0;
        for (let B = 0; B < w.length; B++) {
          const j = y[w[B]], $ = O.cells[j.col], Q = $ ? $.textContent.trim().toLowerCase() : "";
          if (j.values.indexOf(Q) === -1) {
            M = !1;
            break;
          }
        }
        M ? O.removeAttribute(_) : O.setAttribute(_, "true");
      }
    }
  }, u.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.colIndex !== null) {
        const s = document.getElementById(this.targetId);
        if (s) {
          const d = s.tagName === "TABLE" ? s : s.querySelector("table");
          if (d && e.has(d)) {
            const f = e.get(d), l = this._filterKey;
            l && f[l] && delete f[l], Object.keys(f).length === 0 && e.delete(d);
          }
        }
      }
      this.inputs.forEach(function(s) {
        s._lnFilterChange && (s.removeEventListener("change", s._lnFilterChange), delete s._lnFilterChange), delete s[c + "Bound"];
      }), this.dom.removeAttribute(v), delete this.dom[c];
    }
  }, N(h, c, u, "ln-filter");
})();
(function() {
  const h = "data-ln-search", c = "lnSearch", v = "data-ln-search-initialized", p = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function _(o) {
    if (o.hasAttribute(v)) return this;
    this.dom = o, this.targetId = o.getAttribute(h);
    const r = o.tagName;
    if (this.input = r === "INPUT" || r === "TEXTAREA" ? o : o.querySelector('[name="search"]') || o.querySelector('input[type="search"]') || o.querySelector('input[type="text"]'), this.itemsSelector = o.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const e = this;
      queueMicrotask(function() {
        e._search(e.input.value.trim().toLowerCase());
      });
    }
    return o.setAttribute(v, ""), this;
  }
  _.prototype._attachHandler = function() {
    if (!this.input) return;
    const o = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      o.input.value = "", o._search(""), o.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(o._debounceTimer), o._debounceTimer = setTimeout(function() {
        o._search(o.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, _.prototype._search = function(o) {
    const r = document.getElementById(this.targetId);
    if (!r || K(r, "ln-search:change", { term: o, targetId: this.targetId }).defaultPrevented) return;
    const n = this.itemsSelector ? r.querySelectorAll(this.itemsSelector) : r.children;
    for (let t = 0; t < n.length; t++) {
      const i = n[t];
      i.removeAttribute(p), o && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(o) && i.setAttribute(p, "true");
    }
  }, _.prototype.destroy = function() {
    this.dom[c] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(v), delete this.dom[c]);
  }, N(h, c, _, "ln-search");
})();
(function() {
  const h = "lnTableSort", c = "data-ln-sort", v = "data-ln-sort-active";
  if (window[h] !== void 0) return;
  function p(e) {
    m(e);
  }
  function m(e) {
    const n = Array.from(e.querySelectorAll("table"));
    e.tagName === "TABLE" && n.push(e), n.forEach(function(t) {
      if (t[h]) return;
      const i = Array.from(t.querySelectorAll("th[" + c + "]"));
      i.length && (t[h] = new o(t, i));
    });
  }
  function _(e, n) {
    e.querySelectorAll("[data-ln-sort-icon]").forEach(function(i) {
      const a = i.getAttribute("data-ln-sort-icon");
      n == null ? i.classList.toggle("hidden", a !== null && a !== "") : i.classList.toggle("hidden", a !== n);
    });
  }
  function o(e, n) {
    this.table = e, this.ths = n, this._col = -1, this._dir = null;
    const t = this;
    n.forEach(function(a, u) {
      a[h + "Bound"] || (a[h + "Bound"] = !0, a._lnSortClick = function(s) {
        const d = s.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        d && d !== a || t._handleClick(u, a);
      }, a.addEventListener("click", a._lnSortClick));
    });
    const i = e.closest("[data-ln-table][data-ln-persist]");
    if (i) {
      const a = _t("table-sort", i);
      a && a.dir && a.col >= 0 && a.col < n.length && (this._handleClick(a.col, n[a.col]), a.dir === "desc" && this._handleClick(a.col, n[a.col]));
    }
    return this;
  }
  o.prototype._handleClick = function(e, n) {
    let t;
    this._col !== e ? t = "asc" : this._dir === "asc" ? t = "desc" : this._dir === "desc" ? t = null : t = "asc", this.ths.forEach(function(a) {
      a.removeAttribute(v), _(a, null);
    }), t === null ? (this._col = -1, this._dir = null) : (this._col = e, this._dir = t, n.setAttribute(v, t), _(n, t)), S(this.table, "ln-table:sort", {
      column: e,
      sortType: n.getAttribute(c),
      direction: t
    });
    const i = this.table.closest("[data-ln-table][data-ln-persist]");
    i && (t === null ? st("table-sort", i, null) : st("table-sort", i, { col: e, dir: t }));
  }, o.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(e) {
      e._lnSortClick && (e.removeEventListener("click", e._lnSortClick), delete e._lnSortClick), delete e[h + "Bound"];
    }), delete this.table[h]);
  };
  function r() {
    G(function() {
      new MutationObserver(function(n) {
        n.forEach(function(t) {
          t.type === "childList" ? t.addedNodes.forEach(function(i) {
            i.nodeType === 1 && m(i);
          }) : t.type === "attributes" && m(t.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [c] });
    }, "ln-table-sort");
  }
  window[h] = p, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "data-ln-table", c = "lnTable", v = "data-ln-sort", p = "data-ln-table-empty";
  if (window[c] !== void 0) return;
  const o = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function r(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("tbody"), this.thead = e.querySelector("thead");
    const n = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = n ? Array.from(n.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const t = this;
    return this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(i) {
      i.preventDefault(), t._searchTerm = i.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), S(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-search:change", this._onSearch), this._onSort = function(i) {
      t._sortCol = i.detail.direction === null ? -1 : i.detail.column, t._sortDir = i.detail.direction, t._sortType = i.detail.sortType, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), S(e, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(i) {
      const a = i.detail.key;
      let u = !1;
      for (let f = 0; f < t.ths.length; f++)
        if (t.ths[f].getAttribute("data-ln-filter-col") === a) {
          u = !0;
          break;
        }
      if (!u) return;
      const s = i.detail.values;
      if (!s || s.length === 0)
        delete t._columnFilters[a];
      else {
        const f = [];
        for (let l = 0; l < s.length; l++)
          f.push(s[l].toLowerCase());
        t._columnFilters[a] = f;
      }
      const d = t.dom.querySelector('th[data-ln-filter-col="' + a + '"]');
      d && (s && s.length > 0 ? d.setAttribute("data-ln-filter-active", "") : d.removeAttribute("data-ln-filter-active")), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), S(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-table-clear]")) return;
      t._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + e.id + '"]');
      if (u) {
        const d = u.tagName === "INPUT" ? u : u.querySelector("input");
        d && (d.value = "");
      }
      t._columnFilters = {};
      for (let d = 0; d < t.ths.length; d++)
        t.ths[d].removeAttribute("data-ln-filter-active");
      const s = document.querySelectorAll('[data-ln-filter="' + e.id + '"]');
      for (let d = 0; d < s.length; d++) {
        const f = s[d].querySelector("[data-ln-filter-reset]");
        f && (f.checked = !0, f.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
      t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), S(e, "ln-table:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("click", this._onClear), this;
  }
  r.prototype._parseRows = function() {
    const e = this.tbody.rows, n = this.ths;
    this._data = [];
    const t = [];
    for (let i = 0; i < n.length; i++)
      t[i] = n[i].getAttribute(v);
    e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (let i = 0; i < e.length; i++) {
      const a = e[i], u = [], s = [], d = [];
      for (let f = 0; f < a.cells.length; f++) {
        const l = a.cells[f], g = l.textContent.trim(), y = l.hasAttribute("data-ln-value") ? l.getAttribute("data-ln-value") : g, w = t[f];
        s[f] = g.toLowerCase(), w === "number" || w === "date" ? u[f] = parseFloat(y) || 0 : w === "string" ? u[f] = String(y) : u[f] = null, f < a.cells.length - 1 && d.push(g.toLowerCase());
      }
      this._data.push({
        sortKeys: u,
        rawTexts: s,
        html: a.outerHTML,
        searchText: d.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, r.prototype._applyFilterAndSort = function() {
    const e = this._searchTerm, n = this._columnFilters, t = Object.keys(n).length > 0, i = this.ths, a = {};
    if (t)
      for (let l = 0; l < i.length; l++) {
        const g = i[l].getAttribute("data-ln-filter-col");
        g && (a[g] = l);
      }
    if (!e && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(l) {
      if (e && l.searchText.indexOf(e) === -1) return !1;
      if (t)
        for (const g in n) {
          const y = a[g];
          if (y !== void 0 && n[g].indexOf(l.rawTexts[y]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const u = this._sortCol, s = this._sortDir === "desc" ? -1 : 1, d = this._sortType === "number" || this._sortType === "date", f = o ? o.compare : function(l, g) {
      return l < g ? -1 : l > g ? 1 : 0;
    };
    this._filteredData.sort(function(l, g) {
      const y = l.sortKeys[u], w = g.sortKeys[u];
      return d ? (y - w) * s : f(y, w) * s;
    });
  }, r.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const e = document.createElement("colgroup");
    this.ths.forEach(function(n) {
      const t = document.createElement("col");
      t.style.width = n.offsetWidth + "px", e.appendChild(t);
    }), this.table.insertBefore(e, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = e;
  }, r.prototype._render = function() {
    if (!this.tbody) return;
    const e = this._filteredData.length;
    e === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, r.prototype._renderAll = function() {
    const e = [], n = this._filteredData;
    for (let t = 0; t < n.length; t++) e.push(n[t].html);
    this.tbody.innerHTML = e.join("");
  }, r.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const e = this;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, r.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, r.prototype._renderVirtual = function() {
    const e = this._filteredData, n = e.length, t = this._rowHeight;
    if (!t || !n) return;
    const a = this.table.getBoundingClientRect().top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, s = a + u, d = window.scrollY - s, f = Math.max(0, Math.floor(d / t) - 15), l = Math.min(f + Math.ceil(window.innerHeight / t) + 30, n);
    if (f === this._vStart && l === this._vEnd) return;
    this._vStart = f, this._vEnd = l;
    const g = this.ths.length || 1, y = f * t, w = (n - l) * t;
    let A = "";
    y > 0 && (A += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + g + '" style="height:' + y + 'px;padding:0;border:none"></td></tr>');
    for (let E = f; E < l; E++) A += e[E].html;
    w > 0 && (A += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + g + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = A;
  }, r.prototype._showEmptyState = function() {
    const e = this.ths.length || 1, n = this.dom.querySelector("template[" + p + "]"), t = document.createElement("td");
    t.setAttribute("colspan", String(e)), n && t.appendChild(document.importNode(n.content, !0));
    const i = document.createElement("tr");
    i.className = "ln-table__empty", i.appendChild(t), this.tbody.innerHTML = "", this.tbody.appendChild(i), S(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, r.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, N(h, c, r, "ln-table");
})();
(function() {
  const h = "data-ln-circular-progress", c = "lnCircularProgress";
  if (window[c] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", p = 36, m = 16, _ = 2 * Math.PI * m;
  function o(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, e.call(this), t.call(this), n.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  o.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[c]);
  };
  function r(i, a) {
    const u = document.createElementNS(v, i);
    for (const s in a)
      u.setAttribute(s, a[s]);
    return u;
  }
  function e() {
    this.svg = r("svg", {
      viewBox: "0 0 " + p + " " + p,
      "aria-hidden": "true"
    }), this.trackCircle = r("circle", {
      cx: p / 2,
      cy: p / 2,
      r: m,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = r("circle", {
      cx: p / 2,
      cy: p / 2,
      r: m,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": _,
      "stroke-dashoffset": _,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function n() {
    const i = this, a = new MutationObserver(function(u) {
      for (const s of u)
        (s.attributeName === "data-ln-circular-progress" || s.attributeName === "data-ln-circular-progress-max") && t.call(i);
    });
    a.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = a;
  }
  function t() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, a = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let u = a > 0 ? i / a * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100);
    const s = _ - u / 100 * _;
    this.progressCircle.setAttribute("stroke-dashoffset", s);
    const d = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = d !== null ? d : Math.round(u) + "%", S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: a,
      percentage: u
    });
  }
  N(h, c, o, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", c = "lnSortable", v = "data-ln-sortable-handle";
  if (window[c] !== void 0) return;
  function p(_) {
    this.dom = _, this.isEnabled = _.getAttribute(h) !== "disabled", this._dragging = null, _.setAttribute("aria-roledescription", "sortable list");
    const o = this;
    return this._onPointerDown = function(r) {
      o.isEnabled && o._handlePointerDown(r);
    }, _.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, p.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, p.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[c]);
  }, p.prototype._handlePointerDown = function(_) {
    let o = _.target.closest("[" + v + "]"), r;
    if (o) {
      for (r = o; r && r.parentElement !== this.dom; )
        r = r.parentElement;
      if (!r || r.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (r = _.target; r && r.parentElement !== this.dom; )
        r = r.parentElement;
      if (!r || r.parentElement !== this.dom) return;
      o = r;
    }
    const n = Array.from(this.dom.children).indexOf(r);
    if (K(this.dom, "ln-sortable:before-drag", {
      item: r,
      index: n
    }).defaultPrevented) return;
    _.preventDefault(), o.setPointerCapture(_.pointerId), this._dragging = r, r.classList.add("ln-sortable--dragging"), r.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: r,
      index: n
    });
    const i = this, a = function(s) {
      i._handlePointerMove(s);
    }, u = function(s) {
      i._handlePointerEnd(s), o.removeEventListener("pointermove", a), o.removeEventListener("pointerup", u), o.removeEventListener("pointercancel", u);
    };
    o.addEventListener("pointermove", a), o.addEventListener("pointerup", u), o.addEventListener("pointercancel", u);
  }, p.prototype._handlePointerMove = function(_) {
    if (!this._dragging) return;
    const o = Array.from(this.dom.children), r = this._dragging;
    for (const e of o)
      e.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const e of o) {
      if (e === r) continue;
      const n = e.getBoundingClientRect(), t = n.top + n.height / 2;
      if (_.clientY >= n.top && _.clientY < t) {
        e.classList.add("ln-sortable--drop-before");
        break;
      } else if (_.clientY >= t && _.clientY <= n.bottom) {
        e.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, p.prototype._handlePointerEnd = function(_) {
    if (!this._dragging) return;
    const o = this._dragging, r = Array.from(this.dom.children), e = r.indexOf(o);
    let n = null, t = null;
    for (const i of r) {
      if (i.classList.contains("ln-sortable--drop-before")) {
        n = i, t = "before";
        break;
      }
      if (i.classList.contains("ln-sortable--drop-after")) {
        n = i, t = "after";
        break;
      }
    }
    for (const i of r)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (o.classList.remove("ln-sortable--dragging"), o.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), n && n !== o) {
      t === "before" ? this.dom.insertBefore(o, n) : this.dom.insertBefore(o, n.nextElementSibling);
      const a = Array.from(this.dom.children).indexOf(o);
      S(this.dom, "ln-sortable:reordered", {
        item: o,
        oldIndex: e,
        newIndex: a
      });
    }
    this._dragging = null;
  };
  function m(_) {
    const o = _[c];
    if (!o) return;
    const r = _.getAttribute(h) !== "disabled";
    r !== o.isEnabled && (o.isEnabled = r, S(_, r ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: _ }));
  }
  N(h, c, p, "ln-sortable", {
    onAttributeChange: m
  });
})();
(function() {
  const h = "data-ln-confirm", c = "lnConfirm", v = "data-ln-confirm-timeout";
  if (window[c] !== void 0) return;
  function m(_) {
    this.dom = _, this.confirming = !1, this.originalText = _.textContent.trim(), this.confirmText = _.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const o = this;
    return this._onClick = function(r) {
      if (!o.confirming)
        r.preventDefault(), r.stopImmediatePropagation(), o._enterConfirm();
      else {
        if (o._submitted) return;
        o._submitted = !0, o._reset();
      }
    }, _.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const _ = parseFloat(this.dom.getAttribute(v));
    return isNaN(_) || _ <= 0 ? 3 : _;
  }, m.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var _ = this.dom.querySelector("svg.ln-icon use");
    _ && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = _.getAttribute("href"), _.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const _ = this, o = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      _._reset();
    }, o);
  }, m.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var _ = this.dom.querySelector("svg.ln-icon use");
      _ && this.originalIconHref && _.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    this.dom[c] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[c]);
  }, N(h, c, m, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", c = "lnTranslations";
  if (window[c] !== void 0) return;
  const v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(m) {
    this.dom = m, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = m.getAttribute(h + "-default") || "", this.badgesEl = m.querySelector("[" + h + "-active]"), this.menuEl = m.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const _ = m.getAttribute(h + "-locales");
    if (this.locales = v, _)
      try {
        this.locales = JSON.parse(_);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const o = this;
    return this._onRequestAdd = function(r) {
      r.detail && r.detail.lang && o.addLanguage(r.detail.lang);
    }, this._onRequestRemove = function(r) {
      r.detail && r.detail.lang && o.removeLanguage(r.detail.lang);
    }, m.addEventListener("ln-translations:request-add", this._onRequestAdd), m.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const m = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const _ of m) {
      const o = _.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const r of o)
        r.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, p.prototype._detectExisting = function() {
    const m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const _ of m) {
      const o = _.getAttribute("data-ln-translatable-lang");
      o && o !== this.defaultLang && this.activeLanguages.add(o);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const m = this;
    let _ = 0;
    for (const r in this.locales) {
      if (!this.locales.hasOwnProperty(r) || this.activeLanguages.has(r)) continue;
      _++;
      const e = Et("ln-translations-menu-item", "ln-translations");
      if (!e) return;
      const n = e.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", r), n.textContent = this.locales[r], n.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), m.menuEl.getAttribute("data-ln-toggle") === "open" && m.menuEl.setAttribute("data-ln-toggle", "close"), m.addLanguage(r));
      }), this.menuEl.appendChild(e);
    }
    const o = this.dom.querySelector("[" + h + "-add]");
    o && (o.style.display = _ === 0 ? "none" : "");
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const m = this;
    this.activeLanguages.forEach(function(_) {
      const o = Et("ln-translations-badge", "ln-translations");
      if (!o) return;
      const r = o.querySelector("[data-ln-translations-lang]");
      r.setAttribute("data-ln-translations-lang", _);
      const e = r.querySelector("span");
      e.textContent = m.locales[_] || _.toUpperCase();
      const n = r.querySelector("button");
      n.setAttribute("aria-label", "Remove " + (m.locales[_] || _.toUpperCase())), n.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), m.removeLanguage(_));
      }), m.badgesEl.appendChild(o);
    });
  }, p.prototype.addLanguage = function(m, _) {
    if (this.activeLanguages.has(m)) return;
    const o = this.locales[m] || m;
    if (K(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: m,
      langName: o
    }).defaultPrevented) return;
    this.activeLanguages.add(m), _ = _ || {};
    const e = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const n of e) {
      const t = n.getAttribute("data-ln-translatable"), i = n.getAttribute("data-ln-translations-prefix") || "", a = n.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!a) continue;
      const u = a.cloneNode(!1);
      i ? u.name = i + "[trans][" + m + "][" + t + "]" : u.name = "trans[" + m + "][" + t + "]", u.value = _[t] !== void 0 ? _[t] : "", u.removeAttribute("id"), u.placeholder = o + " translation", u.setAttribute("data-ln-translatable-lang", m);
      const s = n.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), d = s.length > 0 ? s[s.length - 1] : a;
      d.parentNode.insertBefore(u, d.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: m,
      langName: o
    });
  }, p.prototype.removeLanguage = function(m) {
    if (!this.activeLanguages.has(m) || K(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: m
    }).defaultPrevented) return;
    const o = this.dom.querySelectorAll('[data-ln-translatable-lang="' + m + '"]');
    for (const r of o)
      r.parentNode.removeChild(r);
    this.activeLanguages.delete(m), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: m
    });
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(m) {
    return this.activeLanguages.has(m);
  }, p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const m = this.defaultLang, _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const o of _)
      o.getAttribute("data-ln-translatable-lang") !== m && o.parentNode.removeChild(o);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[c];
  }, N(h, c, p, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", c = "lnAutosave", v = "data-ln-autosave-clear", p = "data-ln-autosave-debounce-input", m = "ln-autosave:";
  if (window[c] !== void 0) return;
  function o(t) {
    const i = r(t);
    if (!i) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = i;
    let a = null;
    function u() {
      const l = Ct(t);
      try {
        localStorage.setItem(i, JSON.stringify(l));
      } catch {
        return;
      }
      S(t, "ln-autosave:saved", { target: t, data: l });
    }
    function s() {
      let l;
      try {
        l = localStorage.getItem(i);
      } catch {
        return;
      }
      if (!l) return;
      let g;
      try {
        g = JSON.parse(l);
      } catch {
        return;
      }
      if (K(t, "ln-autosave:before-restore", { target: t, data: g }).defaultPrevented) return;
      const w = Tt(t, g);
      for (let A = 0; A < w.length; A++)
        w[A].dispatchEvent(new Event("input", { bubbles: !0 })), w[A].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(t, "ln-autosave:restored", { target: t, data: g });
    }
    function d() {
      try {
        localStorage.removeItem(i);
      } catch {
        return;
      }
      S(t, "ln-autosave:cleared", { target: t });
    }
    this._onFocusout = function(l) {
      const g = l.target;
      e(g) && g.name && u();
    }, this._onChange = function(l) {
      const g = l.target;
      e(g) && g.name && u();
    }, this._onSubmit = function() {
      d();
    }, this._onReset = function() {
      d();
    }, this._onClearClick = function(l) {
      l.target.closest("[" + v + "]") && d();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick);
    const f = n(t);
    return f > 0 && (this._onInput = function(l) {
      const g = l.target;
      !e(g) || !g.name || (a !== null && clearTimeout(a), a = setTimeout(u, f));
    }, t.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return a;
    }, s(), this;
  }
  o.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const t = this._getInputTimer();
        t !== null && clearTimeout(t);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[c];
    }
  };
  function r(t) {
    const a = t.getAttribute(h) || t.id;
    return a ? m + window.location.pathname + ":" + a : null;
  }
  function e(t) {
    const i = t.tagName;
    return i === "INPUT" || i === "TEXTAREA" || i === "SELECT";
  }
  function n(t) {
    if (!t.hasAttribute(p)) return 0;
    const i = t.getAttribute(p);
    if (i === "" || i === null) return 1e3;
    const a = parseInt(i, 10);
    return isNaN(a) || a < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", t), 1e3) : a;
  }
  N(h, c, o, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", c = "lnAutoresize";
  if (window[c] !== void 0) return;
  function v(p) {
    if (p.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", p.tagName), this;
    this.dom = p;
    const m = this;
    return this._onInput = function() {
      m._resize();
    }, p.addEventListener("input", this._onInput), this._resize(), this;
  }
  v.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, v.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[c]);
  }, N(h, c, v, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", c = "lnValidate", v = "data-ln-validate-errors", p = "data-ln-validate-error", m = "ln-validate-valid", _ = "ln-validate-invalid", o = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[c] !== void 0) return;
  function r(e) {
    this.dom = e, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, t = e.tagName, i = e.type, a = t === "SELECT" || i === "checkbox" || i === "radio";
    return this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(u) {
      const s = u.detail && u.detail.error;
      if (!s) return;
      n._customErrors.add(s), n._touched = !0;
      const d = e.closest(".form-element");
      if (d) {
        const f = d.querySelector("[" + p + '="' + s + '"]');
        f && f.classList.remove("hidden");
      }
      e.classList.remove(m), e.classList.add(_);
    }, this._onClearCustom = function(u) {
      const s = u.detail && u.detail.error, d = e.closest(".form-element");
      if (s) {
        if (n._customErrors.delete(s), d) {
          const f = d.querySelector("[" + p + '="' + s + '"]');
          f && f.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(f) {
          if (d) {
            const l = d.querySelector("[" + p + '="' + f + '"]');
            l && l.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, a || e.addEventListener("input", this._onInput), e.addEventListener("change", this._onChange), e.addEventListener("ln-validate:set-custom", this._onSetCustom), e.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  r.prototype.validate = function() {
    const e = this.dom, n = e.validity, i = e.checkValidity() && this._customErrors.size === 0, a = e.closest(".form-element");
    if (a) {
      const s = a.querySelector("[" + v + "]");
      if (s) {
        const d = s.querySelectorAll("[" + p + "]");
        for (let f = 0; f < d.length; f++) {
          const l = d[f].getAttribute(p), g = o[l];
          g && (n[g] ? d[f].classList.remove("hidden") : d[f].classList.add("hidden"));
        }
      }
    }
    return e.classList.toggle(m, i), e.classList.toggle(_, !i), S(e, i ? "ln-validate:valid" : "ln-validate:invalid", { target: e, field: e.name }), i;
  }, r.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(m, _);
    const e = this.dom.closest(".form-element");
    if (e) {
      const n = e.querySelectorAll("[" + p + "]");
      for (let t = 0; t < n.length; t++)
        n[t].classList.add("hidden");
    }
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), r.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(m, _), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[c]);
  }, N(h, c, r, "ln-validate");
})();
(function() {
  const h = "data-ln-form", c = "lnForm", v = "data-ln-form-auto", p = "data-ln-form-debounce", m = "data-ln-validate", _ = "lnValidate";
  if (window[c] !== void 0) return;
  function o(r) {
    this.dom = r, this._debounceTimer = null;
    const e = this;
    if (this._onValid = function() {
      e._updateSubmitButton();
    }, this._onInvalid = function() {
      e._updateSubmitButton();
    }, this._onSubmit = function(n) {
      n.preventDefault(), e.submit();
    }, this._onFill = function(n) {
      n.detail && e.fill(n.detail);
    }, this._onFormReset = function() {
      e.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        e._resetValidation();
      }, 0);
    }, r.addEventListener("ln-validate:valid", this._onValid), r.addEventListener("ln-validate:invalid", this._onInvalid), r.addEventListener("submit", this._onSubmit), r.addEventListener("ln-form:fill", this._onFill), r.addEventListener("ln-form:reset", this._onFormReset), r.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, r.hasAttribute(v)) {
      const n = parseInt(r.getAttribute(p)) || 0;
      this._onAutoInput = function() {
        n > 0 ? (clearTimeout(e._debounceTimer), e._debounceTimer = setTimeout(function() {
          e.submit();
        }, n)) : e.submit();
      }, r.addEventListener("input", this._onAutoInput), r.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  o.prototype._updateSubmitButton = function() {
    const r = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!r.length) return;
    const e = this.dom.querySelectorAll("[" + m + "]");
    let n = !1;
    if (e.length > 0) {
      let t = !1, i = !1;
      for (let a = 0; a < e.length; a++) {
        const u = e[a][_];
        u && u._touched && (t = !0), e[a].checkValidity() || (i = !0);
      }
      n = i || !t;
    }
    for (let t = 0; t < r.length; t++)
      r[t].disabled = n;
  }, o.prototype.fill = function(r) {
    const e = Tt(this.dom, r);
    for (let n = 0; n < e.length; n++) {
      const t = e[n], i = t.tagName === "SELECT" || t.type === "checkbox" || t.type === "radio";
      t.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
  }, o.prototype.submit = function() {
    const r = this.dom.querySelectorAll("[" + m + "]");
    let e = !0;
    for (let t = 0; t < r.length; t++) {
      const i = r[t][_];
      i && (i.validate() || (e = !1));
    }
    if (!e) return;
    const n = Ct(this.dom);
    S(this.dom, "ln-form:submit", { data: n });
  }, o.prototype.reset = function() {
    this.dom.reset();
    const r = this.dom.querySelectorAll("input, textarea, select");
    for (let e = 0; e < r.length; e++) {
      const n = r[e], t = n.tagName === "SELECT" || n.type === "checkbox" || n.type === "radio";
      n.dispatchEvent(new Event(t ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), S(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, o.prototype._resetValidation = function() {
    const r = this.dom.querySelectorAll("[" + m + "]");
    for (let e = 0; e < r.length; e++) {
      const n = r[e][_];
      n && n.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      const r = this.dom.querySelectorAll("[" + m + "]");
      for (let e = 0; e < r.length; e++)
        if (!r[e].checkValidity()) return !1;
      return !0;
    }
  }), o.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[c]);
  }, N(h, c, o, "ln-form");
})();
(function() {
  const h = "data-ln-time", c = "lnTime";
  if (window[c] !== void 0) return;
  const v = {}, p = {};
  function m(A) {
    return A.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function _(A, E) {
    const k = (A || "") + "|" + JSON.stringify(E);
    return v[k] || (v[k] = new Intl.DateTimeFormat(A, E)), v[k];
  }
  function o(A) {
    const E = A || "";
    return p[E] || (p[E] = new Intl.RelativeTimeFormat(A, { numeric: "auto", style: "narrow" })), p[E];
  }
  const r = /* @__PURE__ */ new Set();
  let e = null;
  function n() {
    e || (e = setInterval(i, 6e4));
  }
  function t() {
    e && (clearInterval(e), e = null);
  }
  function i() {
    for (const A of r) {
      if (!document.body.contains(A.dom)) {
        r.delete(A);
        continue;
      }
      l(A);
    }
    r.size === 0 && t();
  }
  function a(A, E) {
    return _(E, { dateStyle: "long", timeStyle: "short" }).format(A);
  }
  function u(A, E) {
    const k = /* @__PURE__ */ new Date(), x = { month: "short", day: "numeric" };
    return A.getFullYear() !== k.getFullYear() && (x.year = "numeric"), _(E, x).format(A);
  }
  function s(A, E) {
    return _(E, { dateStyle: "medium" }).format(A);
  }
  function d(A, E) {
    return _(E, { timeStyle: "short" }).format(A);
  }
  function f(A, E) {
    const k = Math.floor(Date.now() / 1e3), R = Math.floor(A.getTime() / 1e3) - k, O = Math.abs(R);
    if (O < 10) return o(E).format(0, "second");
    let M, B;
    if (O < 60)
      M = "second", B = R;
    else if (O < 3600)
      M = "minute", B = Math.round(R / 60);
    else if (O < 86400)
      M = "hour", B = Math.round(R / 3600);
    else if (O < 604800)
      M = "day", B = Math.round(R / 86400);
    else if (O < 2592e3)
      M = "week", B = Math.round(R / 604800);
    else
      return u(A, E);
    return o(E).format(B, M);
  }
  function l(A) {
    const E = A.dom.getAttribute("datetime");
    if (!E) return;
    const k = Number(E);
    if (isNaN(k)) return;
    const x = new Date(k * 1e3), R = A.dom.getAttribute(h) || "short", O = m(A.dom);
    let M;
    switch (R) {
      case "relative":
        M = f(x, O);
        break;
      case "full":
        M = a(x, O);
        break;
      case "date":
        M = s(x, O);
        break;
      case "time":
        M = d(x, O);
        break;
      default:
        M = u(x, O);
        break;
    }
    A.dom.textContent = M, R !== "full" && (A.dom.title = a(x, O));
  }
  function g(A) {
    return this.dom = A, l(this), A.getAttribute(h) === "relative" && (r.add(this), n()), this;
  }
  g.prototype.render = function() {
    l(this);
  }, g.prototype.destroy = function() {
    r.delete(this), r.size === 0 && t(), delete this.dom[c];
  };
  function y(A) {
    const E = A[c];
    if (!E) return;
    A.getAttribute(h) === "relative" ? (r.add(E), n()) : (r.delete(E), r.size === 0 && t()), l(E);
  }
  function w(A) {
    A.nodeType === 1 && A.hasAttribute && A.hasAttribute(h) && A[c] && l(A[c]);
  }
  N(h, c, g, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: y,
    onInit: w
  });
})();
(function() {
  const h = "data-ln-data-store", c = "lnDataStore";
  if (window[c] !== void 0) return;
  const v = "ln_app_cache", p = "_meta", m = "1.0";
  let _ = null, o = null;
  const r = {};
  function e() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (L) => {
        const C = Math.random() * 16 | 0;
        return (L === "x" ? C : C & 3 | 8).toString(16);
      });
    }
  }
  function n(b) {
    b && b.name === "QuotaExceededError" && S(document, "ln-store:quota-exceeded", { error: b });
  }
  function t() {
    const b = {};
    for (const L of document.querySelectorAll(`[${h}]`)) {
      const C = L.getAttribute(h);
      if (C) {
        const T = L.getAttribute("data-ln-data-store-indexes") || L.getAttribute("data-ln-store-indexes") || "";
        b[C] = {
          indexes: T.split(",").map((I) => I.trim()).filter(Boolean)
        };
      }
    }
    return b;
  }
  function i() {
    return o || (o = new Promise((b) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), b(null);
      const L = t(), C = Object.keys(L), T = indexedDB.open(v);
      T.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), b(null);
      }, T.onsuccess = (I) => {
        const q = I.target.result, F = Array.from(q.objectStoreNames);
        if (!(!F.includes(p) || C.some((ht) => !F.includes(ht))))
          return a(q), _ = q, b(q);
        const X = q.version;
        q.close();
        const tt = indexedDB.open(v, X + 1);
        tt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, tt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), b(null);
        }, tt.onupgradeneeded = (ht) => {
          const nt = ht.target.result;
          nt.objectStoreNames.contains(p) || nt.createObjectStore(p, { keyPath: "key" });
          for (const bt of C)
            if (!nt.objectStoreNames.contains(bt)) {
              const Rt = nt.createObjectStore(bt, { keyPath: "id" });
              for (const wt of L[bt].indexes)
                Rt.createIndex(wt, wt, { unique: !1 });
            }
        }, tt.onsuccess = (ht) => {
          const nt = ht.target.result;
          a(nt), _ = nt, b(nt);
        };
      };
    }), o);
  }
  function a(b) {
    b.onversionchange = () => {
      b.close(), _ = null, o = null;
    };
  }
  function u() {
    return _ ? Promise.resolve(_) : (o = null, i());
  }
  async function s(b) {
    if (!ft() || !b) return b;
    const L = { ...b }, C = L.id, T = L._pending, I = await Ht(L);
    return !I || !I.encrypted ? b : {
      id: C,
      _pending: T,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function d(b) {
    return !b || !b.encrypted || !ft() ? b : Ut(b);
  }
  const f = (b, L) => u().then((C) => C ? C.transaction(b, L).objectStore(b) : null);
  function l(b) {
    return new Promise((L, C) => {
      b.onsuccess = () => L(b.result), b.onerror = () => {
        n(b.error), C(b.error);
      };
    });
  }
  const g = (b) => f(b, "readonly").then((L) => L ? l(L.getAll()) : []).then((L) => ft() ? Promise.all(L.map((C) => d(C))) : L), y = (b, L) => f(b, "readonly").then((C) => C ? l(C.get(L)) : null).then((C) => C ? d(C) : null), w = (b, L) => (ft() ? s(L) : Promise.resolve(L)).then((T) => f(b, "readwrite").then((I) => I ? l(I.put(T)) : null)), A = (b, L) => f(b, "readwrite").then((C) => C ? l(C.delete(L)) : null), E = (b) => f(b, "readwrite").then((L) => L ? l(L.clear()) : null), k = (b) => f(b, "readonly").then((L) => L ? l(L.count()) : 0), x = (b) => f(p, "readonly").then((L) => L ? l(L.get(b)) : null), R = (b, L) => f(p, "readwrite").then((C) => {
    if (C)
      return L.key = b, l(C.put(L));
  });
  function O(b) {
    this.dom = b, this._name = b.getAttribute(h);
    const L = b.getAttribute("data-ln-data-store-stale") || b.getAttribute("data-ln-store-stale"), C = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(C) ? 300 : C;
    const T = b.getAttribute("data-ln-data-store-search-fields") || b.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = T.split(",").map((I) => I.trim()).filter(Boolean), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, r[this._name] = this, M(this), mt(this), this;
  }
  function M(b) {
    b._handlers = {
      create: (L) => B(b, L.detail),
      update: (L) => j(b, L.detail),
      delete: (L) => $(b, L.detail),
      "bulk-delete": (L) => Q(b, L.detail)
    };
    for (const [L, C] of Object.entries(b._handlers))
      b.dom.addEventListener(`ln-store:request-${L}`, C);
  }
  function B(b, { data: L = {} } = {}) {
    const C = `_temp_${e()}`, T = { ...L, id: C, _pending: !0 };
    w(b._name, T).then(() => {
      b.totalCount++, S(b.dom, "ln-store:created", { store: b._name, record: T, tempId: C }), S(b.dom, "ln-store:request-remote-create", { tempId: C, data: L });
    });
  }
  function j(b, { id: L, data: C = {}, expected_version: T } = {}) {
    y(b._name, L).then((I) => {
      if (!I) throw new Error(`Record not found: ${L}`);
      b._pendingSnapshots[L] = { ...I };
      const q = { ...I, ...C, _pending: !0 };
      return w(b._name, q).then(() => {
        S(b.dom, "ln-store:updated", { store: b._name, record: q, previous: b._pendingSnapshots[L] }), S(b.dom, "ln-store:request-remote-update", { id: L, data: C, expected_version: T });
      });
    }).catch((I) => console.error("[ln-data-store] Optimistic update failed:", I));
  }
  function $(b, { id: L } = {}) {
    y(b._name, L).then((C) => {
      if (C)
        return b._pendingSnapshots[L] = { ...C }, A(b._name, L).then(() => {
          b.totalCount--, S(b.dom, "ln-store:deleted", { store: b._name, id: L }), S(b.dom, "ln-store:request-remote-delete", { id: L });
        });
    }).catch((C) => console.error("[ln-data-store] Optimistic delete failed:", C));
  }
  function Q(b, { ids: L = [] } = {}) {
    L.length && Promise.all(L.map((C) => y(b._name, C))).then((C) => {
      const T = C.filter(Boolean), I = T.map((q) => q.id);
      return b._pendingSnapshots[I.join(",")] = T, D(b._name, I).then(() => {
        b.totalCount -= I.length, S(b.dom, "ln-store:deleted", { store: b._name, ids: I }), S(b.dom, "ln-store:request-remote-bulk-delete", { ids: I });
      });
    }).catch((C) => console.error("[ln-data-store] Optimistic bulk delete failed:", C));
  }
  function mt(b) {
    i().then(() => x(b._name)).then((L) => {
      L && L.schema_version === m ? (b.lastSyncedAt = L.last_synced_at || null, b.totalCount = L.record_count || 0, b.totalCount > 0 ? (b.isLoaded = !0, S(b.dom, "ln-store:ready", { store: b._name, count: b.totalCount, source: "cache" }), at(b) && Y(b)) : Y(b)) : L && L.schema_version !== m ? E(b._name).then(() => R(b._name, { schema_version: m, last_synced_at: null, record_count: 0 })).then(() => Y(b)) : Y(b);
    });
  }
  function at(b) {
    return b._staleThreshold === -1 ? !1 : b.lastSyncedAt ? Math.floor(Date.now() / 1e3) - b.lastSyncedAt > b._staleThreshold : !0;
  }
  function Y(b) {
    b.isSyncing = !0, S(b.dom, "ln-store:request-remote-sync", { since: b.lastSyncedAt });
  }
  function lt(b, L) {
    return u().then((C) => C ? (ft() ? Promise.all(L.map((I) => s(I))) : Promise.resolve(L)).then((I) => new Promise((q, F) => {
      const U = C.transaction(b, "readwrite"), X = U.objectStore(b);
      I.forEach((tt) => X.put(tt)), U.oncomplete = () => q(), U.onerror = () => {
        n(U.error), F(U.error);
      };
    })) : void 0);
  }
  function D(b, L) {
    return u().then((C) => {
      if (C)
        return new Promise((T, I) => {
          const q = C.transaction(b, "readwrite"), F = q.objectStore(b);
          L.forEach((U) => F.delete(U)), q.oncomplete = () => T(), q.onerror = () => I(q.error);
        });
    });
  }
  let P = () => {
    document.visibilityState === "visible" && Object.values(r).forEach((b) => {
      b.isLoaded && !b.isSyncing && at(b) && Y(b);
    });
  };
  document.addEventListener("visibilitychange", P);
  const H = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function rt(b, L) {
    if (!L || !L.field) return b;
    const { field: C, direction: T } = L, I = T === "desc";
    return [...b].sort((q, F) => {
      const U = q[C], X = F[C];
      if (U == null && X == null) return 0;
      if (U == null) return I ? 1 : -1;
      if (X == null) return I ? -1 : 1;
      const tt = typeof U == "string" && typeof X == "string" ? H.compare(U, X) : U < X ? -1 : U > X ? 1 : 0;
      return I ? -tt : tt;
    });
  }
  function ct(b, L) {
    if (!L) return b;
    const C = Object.keys(L).filter((T) => Array.isArray(L[T]) && L[T].length > 0);
    return C.length ? b.filter(
      (T) => C.every((I) => L[I].map(String).includes(String(T[I])))
    ) : b;
  }
  function W(b, L, C) {
    if (!L || !C || !C.length) return b;
    const T = L.toLowerCase();
    return b.filter(
      (I) => C.some((q) => {
        const F = I[q];
        return F != null && String(F).toLowerCase().includes(T);
      })
    );
  }
  function dt(b, L, C) {
    if (!b.length) return 0;
    if (C === "count") return b.length;
    const T = b.map((q) => parseFloat(q[L])).filter((q) => !isNaN(q)), I = T.reduce((q, F) => q + F, 0);
    return C === "sum" ? I : C === "avg" && T.length ? I / T.length : 0;
  }
  function Z(b, L) {
    if (!b.presenters || !b.presenters.computed) return L;
    const C = b.presenters.computed;
    return L.map((T) => {
      const I = { ...T };
      for (const [q, F] of Object.entries(C))
        try {
          I[q] = F(T);
        } catch (U) {
          console.error(`[ln-data-store] Decorator computed field failed for ${q}`, U);
        }
      return I;
    });
  }
  O.prototype.getAll = function(b = {}) {
    const L = this;
    return g(L._name).then((C) => {
      const T = C.length;
      b.filters && (C = ct(C, b.filters)), b.search && (C = W(C, b.search, L._searchFields));
      const I = C.length;
      if (b.sort && (C = rt(C, b.sort)), b.offset || b.limit) {
        const q = b.offset || 0, F = b.limit || C.length;
        C = C.slice(q, q + F);
      }
      return {
        data: Z(L, C),
        total: T,
        filtered: I
      };
    });
  }, O.prototype.getById = function(b) {
    return y(this._name, b).then((L) => L ? Z(this, [L])[0] : null);
  }, O.prototype.count = function(b) {
    return b ? g(this._name).then((L) => ct(L, b).length) : k(this._name);
  }, O.prototype.aggregate = function(b, L) {
    return g(this._name).then((C) => dt(C, b, L));
  }, O.prototype.setPresenters = function(b) {
    this.presenters = b;
  }, O.prototype.applySync = function(b, L, C) {
    const T = this, I = b.length > 0 || L.length > 0;
    let q = Promise.resolve();
    return b.length > 0 && (q = q.then(() => lt(T._name, b))), L.length > 0 && (q = q.then(() => D(T._name, L))), q.then(() => k(T._name)).then((F) => (T.totalCount = F, R(T._name, {
      schema_version: m,
      last_synced_at: C,
      record_count: F
    }))).then(() => {
      const F = !T.isLoaded;
      T.isLoaded = !0, T.isSyncing = !1, T.lastSyncedAt = C, F ? (S(T.dom, "ln-store:loaded", { store: T._name, count: T.totalCount }), S(T.dom, "ln-store:ready", { store: T._name, count: T.totalCount, source: "server" })) : S(T.dom, "ln-store:synced", {
        store: T._name,
        added: b.length,
        deleted: L.length,
        changed: I
      });
    }).catch((F) => {
      T.isSyncing = !1, console.error("[ln-data-store] applySync failed:", F);
    });
  }, O.prototype.confirmMutation = function(b, L, C) {
    const T = this, I = {
      create: () => A(T._name, b).then(() => w(T._name, L)).then(() => {
        delete T._pendingSnapshots[b], S(T.dom, "ln-store:confirmed", { store: T._name, record: L, tempId: b, action: "create" });
      }),
      update: () => w(T._name, L).then(() => {
        delete T._pendingSnapshots[b], S(T.dom, "ln-store:confirmed", { store: T._name, record: L, action: "update" });
      }),
      delete: () => (delete T._pendingSnapshots[b], S(T.dom, "ln-store:confirmed", { store: T._name, record: null, action: "delete" }), Promise.resolve()),
      "bulk-delete": () => (delete T._pendingSnapshots[b], S(T.dom, "ln-store:confirmed", { store: T._name, record: null, ids: b.split(","), action: "bulk-delete" }), Promise.resolve())
    };
    return I[C] ? I[C]() : Promise.resolve();
  }, O.prototype.revertMutation = function(b, L, C) {
    const T = this, I = C || `Server rejected ${L}`, q = {
      create: () => A(T._name, b).then(() => {
        T.totalCount--, delete T._pendingSnapshots[b], S(T.dom, "ln-store:reverted", { store: T._name, record: null, action: "create", error: I });
      }),
      update: () => {
        const F = T._pendingSnapshots[b];
        return F ? w(T._name, F).then(() => {
          delete T._pendingSnapshots[b], S(T.dom, "ln-store:reverted", { store: T._name, record: F, action: "update", error: I });
        }) : Promise.resolve();
      },
      delete: () => {
        const F = T._pendingSnapshots[b];
        return F ? w(T._name, F).then(() => {
          T.totalCount++, delete T._pendingSnapshots[b], S(T.dom, "ln-store:reverted", { store: T._name, record: F, action: "delete", error: I });
        }) : Promise.resolve();
      },
      "bulk-delete": () => {
        const F = T._pendingSnapshots[b];
        return !F || !F.length ? Promise.resolve() : lt(T._name, F).then(() => {
          T.totalCount += F.length, delete T._pendingSnapshots[b], S(T.dom, "ln-store:reverted", { store: T._name, record: null, ids: b.split(","), action: "bulk-delete", error: I });
        });
      }
    };
    return q[L] ? q[L]() : Promise.resolve();
  }, O.prototype.resolveConflict = function(b, L, C) {
    const T = this._pendingSnapshots[b];
    return T ? w(this._name, T).then(() => {
      delete this._pendingSnapshots[b], S(this.dom, "ln-store:conflict", {
        store: this._name,
        local: T,
        remote: L,
        field_diffs: C || null
      });
    }) : Promise.resolve();
  }, O.prototype.forceSync = function() {
    Y(this);
  }, O.prototype.fullReload = function() {
    const b = this;
    return E(b._name).then(() => {
      b.isLoaded = !1, b.lastSyncedAt = null, b.totalCount = 0, Y(b);
    });
  }, O.prototype.destroy = function() {
    if (this._handlers) {
      for (const [b, L] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${b}`, L);
      this._handlers = null;
    }
    delete r[this._name], Object.keys(r).length === 0 && P && (document.removeEventListener("visibilitychange", P), P = null), delete this.dom[c], S(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function ut() {
    return u().then((b) => {
      if (!b) return;
      const L = Array.from(b.objectStoreNames);
      return new Promise((C, T) => {
        const I = b.transaction(L, "readwrite");
        L.forEach((q) => I.objectStore(q).clear()), I.oncomplete = () => C(), I.onerror = () => T(I.error);
      });
    }).then(() => {
      Object.values(r).forEach((b) => {
        b.isLoaded = !1, b.isSyncing = !1, b.lastSyncedAt = null, b.totalCount = 0;
      });
    });
  }
  N(h, c, O, "ln-data-store"), window[c].clearAll = ut, window[c].init = window[c], window[c].setStorageKey = St, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = St);
})();
(function() {
  const h = "data-ln-api-connector", c = "lnApiConnector", v = "lnConnector";
  if (window[c] !== void 0) return;
  function p(o) {
    return this.dom = o, o[c] = this, o[v] = this, this.refreshConfig(), this._handlers = null, m(this), this;
  }
  p.prototype.refreshConfig = function() {
    const o = this.dom;
    this.baseUrl = o.getAttribute("data-ln-api-base-url") || "", this.path = o.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const r = o.getAttribute("data-ln-api-headers") || "";
    this.headers = xt(r, "ln-api-connector"), (r.toLowerCase().includes("authorization") || r.toLowerCase().includes("bearer") || r.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(o, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, p.prototype.fetchDelta = function(o) {
    const r = this;
    let e = z(r.baseUrl, r.path);
    return o != null && o !== "" && (e += (e.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(o)), window.fetch(e, { method: "GET", headers: V(r.headers), credentials: r.credentials }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    });
  }, p.prototype.create = function(o) {
    const r = this;
    return window.fetch(z(r.baseUrl, r.path), {
      method: "POST",
      headers: V(r.headers),
      credentials: r.credentials,
      body: JSON.stringify(o)
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    });
  }, p.prototype.update = function(o, r) {
    const e = this;
    return window.fetch(z(e.baseUrl, e.path, o), {
      method: "PUT",
      headers: V(e.headers),
      credentials: e.credentials,
      body: JSON.stringify(r)
    }).then((n) => {
      if (n.ok) return n.json();
      if (n.status === 409) return n.json().then((t) => {
        const i = new Error("Conflict");
        throw i.status = 409, i.data = t, i;
      });
      throw new Error("HTTP " + n.status + ": " + n.statusText);
    });
  }, p.prototype.delete = function(o) {
    const r = this;
    return window.fetch(z(r.baseUrl, r.path, o), {
      method: "DELETE",
      headers: V(r.headers),
      credentials: r.credentials
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    });
  }, p.prototype.bulkDelete = function(o) {
    const r = this;
    return window.fetch(z(r.baseUrl, r.path) + "/bulk-delete", {
      method: "DELETE",
      headers: V(r.headers),
      credentials: r.credentials,
      body: JSON.stringify({ ids: o })
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    });
  };
  function m(o) {
    o._handlers = {
      sync: function(e) {
        const n = e.detail || {};
        o.fetchDelta(n.since).then(function(t) {
          S(o.dom, "ln-api-connector:fetched", { data: t, since: n.since });
        }).catch(function(t) {
          S(o.dom, "ln-api-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: n.since
          });
        });
      },
      create: function(e) {
        const n = e.detail || {};
        o.create(n.data).then(function(t) {
          S(o.dom, "ln-api-connector:created", { record: t, tempId: n.tempId });
        }).catch(function(t) {
          S(o.dom, "ln-api-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: n.tempId
          });
        });
      },
      update: function(e) {
        const n = e.detail || {}, t = Object.assign({}, n.data);
        n.expected_version !== void 0 && (t.expected_version = n.expected_version), o.update(n.id, t).then(function(i) {
          S(o.dom, "ln-api-connector:updated", { record: i, id: n.id });
        }).catch(function(i) {
          S(o.dom, "ln-api-connector:error", {
            action: "update",
            error: i.message,
            status: i.status || 0,
            id: n.id,
            conflictData: i.status === 409 ? i.data : null
          });
        });
      },
      delete: function(e) {
        const n = e.detail || {};
        o.delete(n.id).then(function(t) {
          S(o.dom, "ln-api-connector:deleted", { response: t, id: n.id });
        }).catch(function(t) {
          S(o.dom, "ln-api-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: n.id
          });
        });
      },
      bulkDelete: function(e) {
        const n = e.detail || {};
        o.bulkDelete(n.ids).then(function(t) {
          S(o.dom, "ln-api-connector:bulk-deleted", { response: t, ids: n.ids });
        }).catch(function(t) {
          S(o.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: n.ids
          });
        });
      }
    }, ["ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      o.dom.addEventListener(e + ":request-sync", o._handlers.sync), o.dom.addEventListener(e + ":request-fetch", o._handlers.sync), o.dom.addEventListener(e + ":request-create", o._handlers.create), o.dom.addEventListener(e + ":request-update", o._handlers.update), o.dom.addEventListener(e + ":request-delete", o._handlers.delete), o.dom.addEventListener(e + ":request-bulk-delete", o._handlers.bulkDelete);
    });
  }
  p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const o = this;
    o._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      o.dom.removeEventListener(e + ":request-sync", o._handlers.sync), o.dom.removeEventListener(e + ":request-fetch", o._handlers.sync), o.dom.removeEventListener(e + ":request-create", o._handlers.create), o.dom.removeEventListener(e + ":request-update", o._handlers.update), o.dom.removeEventListener(e + ":request-delete", o._handlers.delete), o.dom.removeEventListener(e + ":request-bulk-delete", o._handlers.bulkDelete);
    }), o._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[c], delete this.dom[v];
  };
  function _(o) {
    const r = o[c];
    r && r.refreshConfig();
  }
  N(h, c, p, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", c = "lnCouchDbConnector", v = "lnConnector";
  if (window[c] !== void 0) return;
  function p(o) {
    return this.dom = o, o[c] = this, o[v] = this, this.refreshConfig(), this._handlers = null, m(this), this;
  }
  p.prototype.refreshConfig = function() {
    const o = this.dom;
    this.url = o.getAttribute("data-ln-couchdb-url") || "", this.db = o.getAttribute("data-ln-couchdb-db") || "", this.auth = o.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const r = o.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = xt(r, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), r.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(o, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, p.prototype.fetchDelta = function(o) {
    const r = this, e = ["include_docs=true", "feed=normal"];
    o && e.push("since=" + encodeURIComponent(o));
    const n = z(r.url, r.db, "_changes") + "?" + e.join("&");
    return window.fetch(n, { method: "GET", headers: V(r.headers, r.auth), credentials: r.credentials }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    }).then((t) => {
      const i = t.results || [];
      return {
        data: i.filter((a) => !a.deleted && a.doc).map((a) => Object.assign({}, a.doc, { id: a.doc._id })),
        deleted: i.filter((a) => a.deleted).map((a) => a.id),
        synced_at: t.last_seq || o || ""
      };
    });
  }, p.prototype.create = function(o) {
    const r = this, e = Object.assign({ _id: o.id }, o);
    return e._id || delete e._id, window.fetch(z(r.url, r.db), {
      method: "POST",
      headers: V(r.headers, r.auth),
      credentials: r.credentials,
      body: JSON.stringify(e)
    }).then((n) => {
      if (!n.ok) throw new Error("HTTP " + n.status + ": " + n.statusText);
      return n.json();
    }).then((n) => Object.assign({}, e, { id: n.id, _id: n.id, _rev: n.rev }));
  }, p.prototype.update = function(o, r) {
    const e = this, n = Object.assign({ id: String(o), _id: String(o) }, r), t = n._rev || n.rev;
    return (t ? Promise.resolve(t) : window.fetch(z(e.url, e.db, null, o), { method: "GET", headers: V(e.headers, e.auth), credentials: e.credentials }).then((a) => {
      if (!a.ok) throw new Error("Could not retrieve document for revision mapping");
      return a.json().then((u) => u._rev);
    })).then((a) => {
      const u = Object.assign({}, n, { _rev: a });
      delete u.rev;
      const s = Object.assign(V(e.headers, e.auth), { "If-Match": a });
      return window.fetch(z(e.url, e.db, null, o), {
        method: "PUT",
        headers: s,
        credentials: e.credentials,
        body: JSON.stringify(u)
      }).then((d) => {
        if (d.ok) return d.json().then((f) => Object.assign({}, u, { _rev: f.rev }));
        if (d.status === 409) return d.json().then((f) => {
          const l = new Error("Conflict");
          throw l.status = 409, l.data = f, l;
        });
        throw new Error("HTTP " + d.status + ": " + d.statusText);
      });
    });
  }, p.prototype.delete = function(o, r) {
    const e = this;
    return (r ? Promise.resolve(r) : window.fetch(z(e.url, e.db, null, o), { method: "GET", headers: V(e.headers, e.auth), credentials: e.credentials }).then((t) => {
      if (!t.ok) throw new Error("Could not retrieve document for revision delete");
      return t.json().then((i) => i._rev);
    })).then((t) => {
      const i = z(e.url, e.db, null, o) + "?rev=" + encodeURIComponent(t);
      return window.fetch(i, { method: "DELETE", headers: V(e.headers, e.auth), credentials: e.credentials }).then((a) => {
        if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
        return a.json();
      });
    });
  }, p.prototype.bulkDelete = function(o) {
    const r = this;
    return !o || o.length === 0 ? Promise.resolve({ ok: !0, deletedCount: 0 }) : window.fetch(z(r.url, r.db, "_all_docs"), {
      method: "POST",
      headers: V(r.headers, r.auth),
      credentials: r.credentials,
      body: JSON.stringify({ keys: o })
    }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const t = (e.rows || []).filter((i) => !i.error && i.value && i.value.rev).map((i) => ({ _id: i.id, _rev: i.value.rev, _deleted: !0 }));
      return t.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(z(r.url, r.db, "_bulk_docs"), {
        method: "POST",
        headers: V(r.headers, r.auth),
        credentials: r.credentials,
        body: JSON.stringify({ docs: t })
      }).then((i) => {
        if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
        return i.json();
      }).then((i) => ({ ok: !0, results: i, deletedCount: t.length }));
    });
  };
  function m(o) {
    o._handlers = {
      sync: function(e) {
        const n = e.detail || {};
        o.fetchDelta(n.since).then(function(t) {
          S(o.dom, "ln-couchdb-connector:fetched", { data: t, since: n.since });
        }).catch(function(t) {
          S(o.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: t.message,
            status: t.status || 0,
            since: n.since
          });
        });
      },
      create: function(e) {
        const n = e.detail || {};
        o.create(n.data).then(function(t) {
          S(o.dom, "ln-couchdb-connector:created", { record: t, tempId: n.tempId });
        }).catch(function(t) {
          S(o.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: t.message,
            status: t.status || 0,
            tempId: n.tempId
          });
        });
      },
      update: function(e) {
        const n = e.detail || {}, t = Object.assign({}, n.data);
        n.expected_version !== void 0 && (t._rev = n.expected_version), o.update(n.id, t).then(function(i) {
          S(o.dom, "ln-couchdb-connector:updated", { record: i, id: n.id });
        }).catch(function(i) {
          S(o.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: i.message,
            status: i.status || 0,
            id: n.id,
            conflictData: i.status === 409 ? i.data : null
          });
        });
      },
      delete: function(e) {
        const n = e.detail || {};
        o.delete(n.id, n.rev).then(function(t) {
          S(o.dom, "ln-couchdb-connector:deleted", { response: t, id: n.id });
        }).catch(function(t) {
          S(o.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: t.message,
            status: t.status || 0,
            id: n.id
          });
        });
      },
      bulkDelete: function(e) {
        const n = e.detail || {};
        o.bulkDelete(n.ids).then(function(t) {
          S(o.dom, "ln-couchdb-connector:bulk-deleted", { response: t, ids: n.ids });
        }).catch(function(t) {
          S(o.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: t.message,
            status: t.status || 0,
            ids: n.ids
          });
        });
      }
    }, ["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      o.dom.addEventListener(e + ":request-sync", o._handlers.sync), o.dom.addEventListener(e + ":request-fetch", o._handlers.sync), o.dom.addEventListener(e + ":request-create", o._handlers.create), o.dom.addEventListener(e + ":request-update", o._handlers.update), o.dom.addEventListener(e + ":request-delete", o._handlers.delete), o.dom.addEventListener(e + ":request-bulk-delete", o._handlers.bulkDelete);
    });
  }
  p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const o = this;
    o._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(e) {
      o.dom.removeEventListener(e + ":request-sync", o._handlers.sync), o.dom.removeEventListener(e + ":request-fetch", o._handlers.sync), o.dom.removeEventListener(e + ":request-create", o._handlers.create), o.dom.removeEventListener(e + ":request-update", o._handlers.update), o.dom.removeEventListener(e + ":request-delete", o._handlers.delete), o.dom.removeEventListener(e + ":request-bulk-delete", o._handlers.bulkDelete);
    }), o._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[c], delete this.dom[v];
  };
  function _(o) {
    const r = o[c];
    r && r.refreshConfig();
  }
  N(h, c, p, "ln-couchdb-connector", {
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
  const h = "data-ln-data-coordinator", c = "lnDataCoordinator", v = "lnCoordinator";
  if (window[c] !== void 0) return;
  function p(o) {
    return this.dom = o, this._name = o.getAttribute(h), o[c] = this, o[v] = this, this.mapper = null, this._handlers = null, this.refreshMapper(), m(this), this;
  }
  p.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const r = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    r && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(r)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(e) {
      return e;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(e) {
      return e;
    });
  }, p.prototype.findChildren = function() {
    const o = this.dom.querySelector("[data-ln-data-store]"), r = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]");
    return {
      storeEl: o,
      connectorEl: r,
      store: o ? o.lnDataStore || o.lnStore : null,
      connector: r ? r.lnConnector || r.lnApiConnector || r.lnCouchDbConnector : null
    };
  };
  function m(o) {
    o._handlers = {
      sync: function(r) {
        o.refreshMapper();
        const e = o.findChildren();
        if (!e.store || !e.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        const n = r.detail.since;
        e.connector.fetchDelta(n).then(function(t) {
          let i = [], a = [], u = null;
          t && Array.isArray(t) ? (i = t, u = Math.floor(Date.now() / 1e3)) : t && (i = Array.isArray(t.data) ? t.data : [], a = Array.isArray(t.deleted) ? t.deleted : [], u = t.synced_at !== void 0 ? t.synced_at : t.since !== void 0 ? t.since : null);
          const s = i.map((d) => o.mapper.ingress(d));
          e.store.applySync(s, a, u);
        }).catch(function(t) {
          console.error("[ln-data-coordinator] Sync failed:", t);
        });
      },
      create: function(r) {
        o.refreshMapper();
        const e = o.findChildren();
        if (!e.store || !e.connector) return;
        const n = r.detail.tempId, t = r.detail.data || {}, i = o.mapper.egress(t);
        e.connector.create(i).then(function(a) {
          const u = o.mapper.ingress(a);
          e.store.confirmMutation(n, u, "create");
        }).catch(function(a) {
          console.error("[ln-data-coordinator] Create mutation failed:", a), e.store.revertMutation(n, "create", a.message || a);
        });
      },
      update: function(r) {
        o.refreshMapper();
        const e = o.findChildren();
        if (!e.store || !e.connector) return;
        const n = r.detail.id, t = r.detail.expected_version;
        e.store.getById(n).then(function(i) {
          if (!i) throw new Error("Record not found in cache store: " + n);
          const a = Object.assign({}, i);
          delete a._pending;
          const u = o.mapper.egress(a);
          return e.connector.update(n, u, t);
        }).then(function(i) {
          const a = o.mapper.ingress(i);
          e.store.confirmMutation(n, a, "update");
        }).catch(function(i) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", i), i.status === 409) {
            const a = i.data && i.data.remote ? o.mapper.ingress(i.data.remote) : null, u = i.data ? i.data.field_diffs : null;
            e.store.resolveConflict(n, a, u);
          } else
            e.store.revertMutation(n, "update", i.message || i);
        });
      },
      delete: function(r) {
        o.refreshMapper();
        const e = o.findChildren();
        if (!e.store || !e.connector) return;
        const n = r.detail.id;
        e.connector.delete(n).then(function() {
          e.store.confirmMutation(n, null, "delete");
        }).catch(function(t) {
          console.error("[ln-data-coordinator] Delete mutation failed:", t), e.store.revertMutation(n, "delete", t.message || t);
        });
      },
      bulkDelete: function(r) {
        o.refreshMapper();
        const e = o.findChildren();
        if (!e.store || !e.connector) return;
        const n = r.detail.ids || [], t = n.join(",");
        e.connector.bulkDelete(n).then(function() {
          e.store.confirmMutation(t, null, "bulk-delete");
        }).catch(function(i) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", i), e.store.revertMutation(t, "bulk-delete", i.message || i);
        });
      }
    }, o.dom.addEventListener("ln-store:request-remote-sync", o._handlers.sync), o.dom.addEventListener("ln-store:request-remote-create", o._handlers.create), o.dom.addEventListener("ln-store:request-remote-update", o._handlers.update), o.dom.addEventListener("ln-store:request-remote-delete", o._handlers.delete), o.dom.addEventListener("ln-store:request-remote-bulk-delete", o._handlers.bulkDelete);
  }
  p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const o = this;
    o._handlers && (o.dom.removeEventListener("ln-store:request-remote-sync", o._handlers.sync), o.dom.removeEventListener("ln-store:request-remote-create", o._handlers.create), o.dom.removeEventListener("ln-store:request-remote-update", o._handlers.update), o.dom.removeEventListener("ln-store:request-remote-delete", o._handlers.delete), o.dom.removeEventListener("ln-store:request-remote-bulk-delete", o._handlers.bulkDelete), o._handlers = null), delete this.dom[c], delete this.dom[v];
  };
  function _(o, r) {
    const e = o[c];
    e && r === "data-ln-data-mapper" && e.refreshMapper();
  }
  N(h, c, p, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: _
  });
})();
(function() {
  const h = "data-ln-data-table", c = "lnDataTable";
  if (window[c] !== void 0) return;
  const m = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function _(n) {
    return m ? m.format(n) : String(n);
  }
  function o(n) {
    let t = n.parentElement;
    for (; t && t !== document.body && t !== document.documentElement; ) {
      const a = getComputedStyle(t).overflowY;
      if (a === "auto" || a === "scroll") return t;
      t = t.parentElement;
    }
    return null;
  }
  function r(n) {
    this.dom = n, this.name = n.getAttribute(h) || "", this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-data-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(i) {
      return i.getAttribute("data-ln-col") && i.querySelector("[data-ln-col-filter]");
    }).map(function(i) {
      return i.getAttribute("data-ln-col");
    }), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._totalSpan = n.querySelector("[data-ln-data-table-total]"), this._filteredSpan = n.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = n.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const t = this;
    return this._onSetData = function(i) {
      const a = i.detail || {};
      t._data = a.data || [], t._lastTotal = a.total != null ? a.total : t._data.length, t._lastFiltered = a.filtered != null ? a.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._updateFilterOptions(a.filterOptions), t._vStart = -1, t._vEnd = -1, t._renderRows(), t._updateFooter(), S(n, "ln-data-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, n.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const a = i.detail && i.detail.loading;
      n.classList.toggle("ln-data-table--loading", !!a), a && (t.isLoaded = !1);
    }, n.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(n.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(i) {
      const a = i.target.closest("[data-ln-col-sort]");
      if (!a) return;
      const u = a.closest("th");
      if (!u) return;
      const s = u.getAttribute("data-ln-col");
      s && t._handleSort(s, u);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(i) {
      const a = i.target.closest("[data-ln-col-filter]");
      if (!a) return;
      i.stopPropagation();
      const u = a.closest("th");
      if (!u) return;
      const s = u.getAttribute("data-ln-col");
      if (s) {
        if (t._activeDropdown && t._activeDropdown.field === s) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(s, u, a);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(i) {
      i.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), S(n, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, n.addEventListener("click", this._onClearAll), this._selectable = n.hasAttribute("data-ln-data-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-row-select]") || i.target.closest("[data-ln-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const a = i.target.closest("[data-ln-row]");
      if (!a) return;
      const u = a.getAttribute("data-ln-row-id"), s = a._lnRecord || {};
      S(n, "ln-data-table:row-click", {
        table: t.name,
        id: u,
        record: s
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const a = i.target.closest("[data-ln-row-action]");
      if (!a) return;
      i.stopPropagation();
      const u = a.closest("[data-ln-row]");
      if (!u) return;
      const s = a.getAttribute("data-ln-row-action"), d = u.getAttribute("data-ln-row-id"), f = u._lnRecord || {};
      S(n, "ln-data-table:row-action", {
        table: t.name,
        id: d,
        action: s,
        record: f
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = n.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, S(n, "ln-data-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(i) {
      if (!n.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (i.key === "/") {
        t._searchInput && (i.preventDefault(), t._searchInput.focus());
        return;
      }
      const a = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (a.length)
        switch (i.key) {
          case "ArrowDown":
            i.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, a.length - 1), t._focusRow(a);
            break;
          case "ArrowUp":
            i.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(a);
            break;
          case "Home":
            i.preventDefault(), t._focusedRowIndex = 0, t._focusRow(a);
            break;
          case "End":
            i.preventDefault(), t._focusedRowIndex = a.length - 1, t._focusRow(a);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < a.length) {
              i.preventDefault();
              const u = a[t._focusedRowIndex];
              S(n, "ln-data-table:row-click", {
                table: t.name,
                id: u.getAttribute("data-ln-row-id"),
                record: u._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < a.length) {
              i.preventDefault();
              const u = a[t._focusedRowIndex].querySelector("[data-ln-row-select]");
              u && (u.checked = !u.checked, u.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            t._activeDropdown && t._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), S(n, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  r.prototype._handleSort = function(n, t) {
    let i;
    !this.currentSort || this.currentSort.field !== n ? i = "asc" : this.currentSort.direction === "asc" ? i = "desc" : i = null;
    for (let a = 0; a < this.ths.length; a++)
      this.ths[a].classList.remove("ln-sort-asc", "ln-sort-desc");
    i ? (this.currentSort = { field: n, direction: i }, t.classList.add(i === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: n,
      direction: i
    }), this._requestData();
  }, r.prototype._requestData = function() {
    S(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, r.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-row]");
    let t = n.length > 0;
    for (let i = 0; i < n.length; i++) {
      const a = n[i].getAttribute("data-ln-row-id");
      if (a != null && !this.selectedIds.has(a)) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, Object.defineProperty(r.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), r.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const n = this;
    if (this._onSelectionChange = function(t) {
      const i = t.target.closest("[data-ln-row-select]");
      if (!i) return;
      const a = i.closest("[data-ln-row]");
      if (!a) return;
      const u = a.getAttribute("data-ln-row-id");
      u != null && (i.checked ? (n.selectedIds.add(u), a.classList.add("ln-row-selected")) : (n.selectedIds.delete(u), a.classList.remove("ln-row-selected")), n.selectedCount = n.selectedIds.size, n._updateSelectAll(), n._updateFooter(), S(n.dom, "ln-data-table:select", {
        table: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const t = document.createElement("input");
      t.type = "checkbox", t.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(t), this._selectAllCheckbox = t;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const t = n._selectAllCheckbox.checked, i = n.tbody ? n.tbody.querySelectorAll("[data-ln-row]") : [];
      for (let a = 0; a < i.length; a++) {
        const u = i[a].getAttribute("data-ln-row-id"), s = i[a].querySelector("[data-ln-row-select]");
        u != null && (t ? (n.selectedIds.add(u), i[a].classList.add("ln-row-selected")) : (n.selectedIds.delete(u), i[a].classList.remove("ln-row-selected")), s && (s.checked = t));
      }
      n.selectedCount = n.selectedIds.size, S(n.dom, "ln-data-table:select-all", {
        table: n.name,
        selected: t
      }), S(n.dom, "ln-data-table:select", {
        table: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedCount
      }), n._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const t = this.tbody.querySelectorAll("[data-ln-row]");
      for (let i = 0; i < t.length; i++) {
        const a = t[i].querySelector("[data-ln-row-select]"), u = t[i].getAttribute("data-ln-row-id");
        a && a.checked && u != null && (this.selectedIds.add(u), t[i].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, r.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const n = this.dom.querySelector("[data-ln-col-select]");
    if (n) {
      const t = n.querySelector('input[type="checkbox"]');
      t && t.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const t = this.tbody.querySelectorAll("[data-ln-row]");
      for (let i = 0; i < t.length; i++) {
        t[i].classList.remove("ln-row-selected");
        const a = t[i].querySelector("[data-ln-row-select]");
        a && (a.checked = !1);
      }
    }
    this._updateFooter();
  }, r.prototype._focusRow = function(n) {
    for (let t = 0; t < n.length; t++)
      n[t].classList.remove("ln-row-focused"), n[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < n.length) {
      const t = n[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, r.prototype._openFilterDropdown = function(n, t, i) {
    this._closeFilterDropdown();
    const a = ot(this.dom, this.name + "-column-filter", "ln-data-table") || ot(this.dom, "column-filter", "ln-data-table");
    if (!a) return;
    const u = a.firstElementChild;
    if (!u) return;
    const s = this._getUniqueValues(n), d = u.querySelector("[data-ln-filter-options]"), f = u.querySelector("[data-ln-filter-search]"), l = this.currentFilters[n] || [], g = this;
    if (f && s.length <= 8 && f.classList.add("hidden"), d) {
      const w = d.querySelector("[data-ln-filter-reset]");
      w && (w.checked = l.length === 0);
      const A = ot(u, this.name + "-column-filter-item", "ln-data-table") || ot(u, "column-filter-item", "ln-data-table");
      if (A)
        for (let E = 0; E < s.length; E++) {
          const k = s[E], x = A.cloneNode(!0);
          et(x, { value: k });
          const R = x.querySelector('input[type="checkbox"]');
          R && (R.value = k, R.checked = l.length > 0 && l.indexOf(k) !== -1), d.appendChild(x);
        }
      d.addEventListener("change", function(E) {
        E.target.type === "checkbox" && (g._applyFilterMutualExclusion(E.target, d), g._onFilterChange(n, d));
      });
    }
    f && f.addEventListener("input", function() {
      const w = f.value.toLowerCase(), A = d.querySelectorAll("li");
      for (let E = 0; E < A.length; E++) {
        const k = A[E].textContent.toLowerCase();
        A[E].classList.toggle("hidden", w && k.indexOf(w) === -1);
      }
    });
    const y = u.querySelector("[data-ln-filter-clear]");
    y && y.addEventListener("click", function() {
      delete g.currentFilters[n], g._closeFilterDropdown(), g._updateFilterIndicators(), S(g.dom, "ln-data-table:filter", {
        table: g.name,
        field: n,
        values: []
      }), g._requestData();
    }), t.appendChild(u), this._activeDropdown = { field: n, th: t, el: u }, u.addEventListener("click", function(w) {
      w.stopPropagation();
    });
  }, r.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, r.prototype._applyFilterMutualExclusion = function(n, t) {
    const i = n.hasAttribute("data-ln-filter-reset"), a = t.querySelector("[data-ln-filter-reset]"), u = t.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');
    if (i) {
      n.checked = !0;
      for (let s = 0; s < u.length; s++) u[s].checked = !1;
    } else if (n.checked)
      a && (a.checked = !1);
    else {
      let s = !1;
      for (let d = 0; d < u.length; d++)
        if (u[d].checked) {
          s = !0;
          break;
        }
      !s && a && (a.checked = !0);
    }
  }, r.prototype._onFilterChange = function(n, t) {
    const i = t.querySelector("[data-ln-filter-reset]"), a = t.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])'), u = [];
    for (let d = 0; d < a.length; d++)
      a[d].checked && u.push(a[d].value);
    const s = i && i.checked || u.length === 0;
    s ? delete this.currentFilters[n] : this.currentFilters[n] = u, this._updateFilterIndicators(), S(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: n,
      values: s ? [] : u
    }), this._requestData();
  }, r.prototype._updateFilterOptions = function(n) {
    if (n !== null && typeof n == "object" && !Array.isArray(n)) {
      const t = Object.keys(n);
      for (let i = 0; i < t.length; i++) {
        const a = t[i], u = n[a];
        if (!Array.isArray(u)) continue;
        const s = {}, d = [];
        for (let f = 0; f < u.length; f++) {
          const l = String(u[f]);
          s[l] || (s[l] = !0, d.push(l));
        }
        this._filterOptions[a] = d.sort();
      }
    } else {
      const t = this._filterableFields, i = this._data;
      for (let a = 0; a < t.length; a++) {
        const u = t[a];
        this._filterOptions[u] || (this._filterOptions[u] = []);
        const s = this._filterOptions[u], d = {};
        for (let f = 0; f < s.length; f++)
          d[s[f]] = !0;
        for (let f = 0; f < i.length; f++) {
          const l = i[f][u];
          if (l != null) {
            const g = String(l);
            d[g] || (d[g] = !0, s.push(g));
          }
        }
        s.sort();
      }
    }
  }, r.prototype._getUniqueValues = function(n) {
    return (this._filterOptions[n] || []).slice().sort();
  }, r.prototype._updateFilterIndicators = function() {
    const n = this.ths;
    for (let t = 0; t < n.length; t++) {
      const i = n[t], a = i.getAttribute("data-ln-col");
      if (!a) continue;
      const u = i.querySelector("[data-ln-col-filter]");
      if (!u) continue;
      const s = this.currentFilters[a] && this.currentFilters[a].length > 0;
      u.classList.toggle("ln-filter-active", !!s);
    }
  }, r.prototype._renderRows = function() {
    if (!this.tbody) return;
    const n = this._data, t = this._lastTotal, i = this._lastFiltered;
    if (t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (n.length === 0 || i === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    n.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, r.prototype._renderAll = function() {
    const n = this._data, t = document.createDocumentFragment();
    for (let i = 0; i < n.length; i++) {
      const a = this._buildRow(n[i]);
      if (!a) break;
      t.appendChild(a);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, r.prototype._buildRow = function(n) {
    const t = ot(this.dom, this.name + "-row", "ln-data-table");
    if (!t) return null;
    const i = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!i) return null;
    if (this._fillRow(i, n), i._lnRecord = n, n.id != null && i.setAttribute("data-ln-row-id", n.id), this._selectable && n.id != null && this.selectedIds.has(String(n.id))) {
      i.classList.add("ln-row-selected");
      const a = i.querySelector("[data-ln-row-select]");
      a && (a.checked = !0);
    }
    return i;
  }, r.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    if (!this._rowHeight) {
      const i = this._buildRow(this._data[0]);
      i && (this.tbody.textContent = "", this.tbody.appendChild(i), this._rowHeight = i.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollContainer = o(this.dom);
    const t = this._scrollContainer || window;
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._renderVirtual();
      }));
    }, t.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, r.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, r.prototype._renderVirtual = function() {
    const n = this._data, t = n.length, i = this._rowHeight;
    if (!i || !t) return;
    const a = this.thead ? this.thead.offsetHeight : 0, u = this._scrollContainer;
    let s, d;
    if (u) {
      const E = this.table.getBoundingClientRect(), k = u.getBoundingClientRect(), x = E.top - k.top + u.scrollTop + a;
      s = u.scrollTop - x, d = u.clientHeight;
    } else {
      const x = this.table.getBoundingClientRect().top + window.scrollY + a;
      s = window.scrollY - x, d = window.innerHeight;
    }
    let f = Math.max(0, Math.floor(s / i) - 15);
    f = Math.min(f, t);
    const l = Math.min(f + Math.ceil(d / i) + 30, t);
    if (f === this._vStart && l === this._vEnd) return;
    this._vStart = f, this._vEnd = l;
    const g = this.ths.length || 1, y = f * i, w = (t - l) * i, A = document.createDocumentFragment();
    if (y > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", g), k.style.height = y + "px", E.appendChild(k), A.appendChild(E);
    }
    for (let E = f; E < l; E++) {
      const k = this._buildRow(n[E]);
      k && A.appendChild(k);
    }
    if (w > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const k = document.createElement("td");
      k.setAttribute("colspan", g), k.style.height = w + "px", E.appendChild(k), A.appendChild(E);
    }
    this.tbody.textContent = "", this.tbody.appendChild(A), this._selectable && this._updateSelectAll();
  }, r.prototype._fillRow = function(n, t) {
    Lt(n, t);
    const i = n.querySelectorAll("[data-ln-cell-attr]");
    for (let a = 0; a < i.length; a++) {
      const u = i[a], s = u.getAttribute("data-ln-cell-attr").split(",");
      for (let d = 0; d < s.length; d++) {
        const f = s[d].trim().split(":");
        if (f.length !== 2) continue;
        const l = f[0].trim(), g = f[1].trim();
        t[l] != null && u.setAttribute(g, t[l]);
      }
    }
  }, r.prototype._showEmptyState = function(n) {
    const t = ot(this.dom, n, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, r.prototype._updateFooter = function() {
    const n = this._lastTotal, t = this._lastFiltered, i = t < n;
    if (this._totalSpan && (this._totalSpan.textContent = _(n)), this._filteredSpan && (this._filteredSpan.textContent = i ? _(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const a = this.selectedIds.size;
      this._selectedSpan.textContent = a > 0 ? _(a) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", a === 0);
    }
  }, r.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[c]);
  };
  function e(n, t) {
    const i = n[c];
    if (i && t === "data-ln-data-table-selectable") {
      const a = n.hasAttribute("data-ln-data-table-selectable");
      a !== i._selectable && (i._selectable = a, a ? i._enableSelection() : i._disableSelection());
    }
  }
  N(h, c, r, "ln-data-table", {
    extraAttributes: ["data-ln-data-table-selectable"],
    onAttributeChange: e
  });
})();
(function() {
  const h = "ln-icons-sprite", c = "#ln-", v = "#lnc-", p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  let _ = null;
  const o = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), r = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), e = "lni:", n = "lni:v", t = "1";
  function i() {
    try {
      if (localStorage.getItem(n) !== t) {
        for (let g = localStorage.length - 1; g >= 0; g--) {
          const y = localStorage.key(g);
          y && y.indexOf(e) === 0 && localStorage.removeItem(y);
        }
        localStorage.setItem(n, t);
      }
    } catch {
    }
  }
  i();
  function a() {
    return _ || (_ = document.getElementById(h), _ || (_ = document.createElementNS("http://www.w3.org/2000/svg", "svg"), _.id = h, _.setAttribute("hidden", ""), _.setAttribute("aria-hidden", "true"), _.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(_, document.body.firstChild))), _;
  }
  function u(g) {
    return g.indexOf(v) === 0 ? r + "/" + g.slice(v.length) + ".svg" : o + "/" + g.slice(c.length) + ".svg";
  }
  function s(g, y) {
    const w = y.match(/viewBox="([^"]+)"/), A = w ? w[1] : "0 0 24 24", E = y.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), k = E ? E[1].trim() : "", x = y.match(/<svg([^>]*)>/i), R = x ? x[1] : "", O = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    O.id = g, O.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const B = R.match(new RegExp(M + '="([^"]*)"'));
      B && O.setAttribute(M, B[1]);
    }), O.innerHTML = k, a().querySelector("defs").appendChild(O);
  }
  function d(g) {
    if (p.has(g) || m.has(g) || g.indexOf(v) === 0 && !r) return;
    const y = g.slice(1);
    try {
      const w = localStorage.getItem(e + y);
      if (w) {
        s(y, w), p.add(g);
        return;
      }
    } catch {
    }
    m.add(g), fetch(u(g)).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      s(y, w), p.add(g), m.delete(g);
      try {
        localStorage.setItem(e + y, w);
      } catch {
      }
    }).catch(function() {
      m.delete(g);
    });
  }
  function f(g) {
    const y = 'use[href^="' + c + '"], use[href^="' + v + '"]', w = g.querySelectorAll ? g.querySelectorAll(y) : [];
    if (g.matches && g.matches(y)) {
      const A = g.getAttribute("href");
      A && d(A);
    }
    Array.prototype.forEach.call(w, function(A) {
      const E = A.getAttribute("href");
      E && d(E);
    });
  }
  function l() {
    f(document), new MutationObserver(function(g) {
      g.forEach(function(y) {
        if (y.type === "childList")
          y.addedNodes.forEach(function(w) {
            w.nodeType === 1 && f(w);
          });
        else if (y.type === "attributes" && y.attributeName === "href") {
          const w = y.target.getAttribute("href");
          w && (w.indexOf(c) === 0 || w.indexOf(v) === 0) && d(w);
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
