if (typeof window < "u") {
  const h = console.warn;
  console.warn = function(...d) {
    typeof d[0] == "string" && (d[0].startsWith("[ln-") || d[0].startsWith("[lnCore")) && !(document.documentElement.hasAttribute("data-ln-debug") || document.body && document.body.hasAttribute("data-ln-debug")) || h.apply(console, d);
  };
}
const Lt = {};
function Et(h, d) {
  Lt[h] || (Lt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const b = Lt[h];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (d || "ln-core") + '] Template "' + h + '" not found'), null);
}
function S(h, d, b) {
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
function Ht(h, d, b) {
  h._applyFilterAndSort(), h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter();
  const p = {
    sort: h.currentSort,
    filters: h.currentFilters,
    search: h.currentSearch
  };
  p[b] = h.name, S(h.dom, d, p);
}
function X(h, d) {
  if (!h || !d) return h;
  const b = h.querySelectorAll("[data-ln-field]");
  for (let n = 0; n < b.length; n++) {
    const s = b[n], t = s.getAttribute("data-ln-field");
    d[t] != null && (s.textContent = d[t]);
  }
  const p = h.querySelectorAll("[data-ln-attr]");
  for (let n = 0; n < p.length; n++) {
    const s = p[n], t = s.getAttribute("data-ln-attr").split(",");
    for (let i = 0; i < t.length; i++) {
      const e = t[i].trim().split(":");
      if (e.length !== 2) continue;
      const r = e[0].trim(), u = e[1].trim();
      d[u] != null && s.setAttribute(r, d[u]);
    }
  }
  const f = h.querySelectorAll("[data-ln-show]");
  for (let n = 0; n < f.length; n++) {
    const s = f[n], t = s.getAttribute("data-ln-show");
    t in d && s.classList.toggle("hidden", !d[t]);
  }
  const g = h.querySelectorAll("[data-ln-class]");
  for (let n = 0; n < g.length; n++) {
    const s = g[n], t = s.getAttribute("data-ln-class").split(",");
    for (let i = 0; i < t.length; i++) {
      const e = t[i].trim().split(":");
      if (e.length !== 2) continue;
      const r = e[0].trim(), u = e[1].trim();
      u in d && s.classList.toggle(r, !!d[u]);
    }
  }
  return h;
}
function ie(h, d) {
  h.matches && h.matches("[data-ln-form], [data-ln-fillable]") && h.dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  const b = h.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let p = 0; p < b.length; p++)
    b[p].dispatchEvent(new CustomEvent("ln-fill", { detail: d ?? null, bubbles: !0 }));
  return h;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(h) {
  if (!(!h.target.matches || !h.target.matches("[data-ln-fillable]")))
    if (h.detail)
      X(h.target, h.detail);
    else {
      const d = h.target.querySelectorAll("[data-ln-field]");
      for (let b = 0; b < d.length; b++)
        d[b].textContent = "";
    }
})));
function bt(h, d) {
  if (!h || !d) return h;
  const b = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const g = b.currentNode;
    g.textContent.indexOf("{{") !== -1 && (g.textContent = g.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(n, s) {
        return d[s] !== void 0 ? d[s] : "";
      }
    ));
  }
  const p = function(g, n) {
    return d[n] !== void 0 ? d[n] : "";
  }, f = Array.from(h.querySelectorAll("*"));
  h.nodeType === 1 && f.push(h);
  for (let g = 0; g < f.length; g++) {
    const n = f[g], s = n.attributes;
    for (let t = 0; t < s.length; t++) {
      const i = s[t];
      i.value.indexOf("{{") !== -1 && n.setAttribute(i.name, i.value.replace(/\{\{\s*(\w+)\s*\}\}/g, p));
    }
  }
  return h;
}
function re(h, d, b, p, f, g) {
  const n = {};
  for (let t = 0; t < h.children.length; t++) {
    const i = h.children[t], e = i.getAttribute("data-ln-key");
    e && (n[e] = i);
  }
  const s = document.createDocumentFragment();
  for (let t = 0; t < d.length; t++) {
    const i = d[t], e = String(p(i));
    let r = n[e];
    if (r)
      f(r, i, t);
    else {
      const u = Et(b, g);
      if (!u || (bt(u, i), r = u.firstElementChild, !r)) continue;
      r.setAttribute("data-ln-key", e), f(r, i, t);
    }
    s.appendChild(r);
  }
  h.textContent = "", h.appendChild(s);
}
function $(h, d) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      $(h, d);
    }), console.warn("[" + d + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function lt(h, d, b) {
  if (h) {
    const p = h.querySelector('[data-ln-template="' + d + '"]');
    if (p) return p.content.cloneNode(!0);
  }
  return Et(d, b);
}
function oe(h, d) {
  const b = {}, p = h.querySelectorAll("[" + d + "]");
  for (let f = 0; f < p.length; f++)
    b[p[f].getAttribute(d)] = p[f].textContent, p[f].remove();
  return b;
}
function Ct(h, d, b, p) {
  if (h.nodeType !== 1) return;
  const g = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", n = Array.from(h.querySelectorAll(g));
  h.matches && h.matches(g) && n.push(h);
  for (const s of n)
    s[b] || (s[b] = new p(s));
}
function gt(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function Pt(h, d) {
  const b = !!(d && d.typed), p = {}, f = h.elements, g = {};
  if (b)
    for (let n = 0; n < f.length; n++) {
      const s = f[n];
      s.name && s.type === "checkbox" && !s.disabled && (g[s.name] = (g[s.name] || 0) + 1);
    }
  for (let n = 0; n < f.length; n++) {
    const s = f[n];
    if (!(!s.name || s.disabled || s.type === "file" || s.type === "submit" || s.type === "button"))
      if (s.type === "checkbox")
        b && g[s.name] === 1 ? p[s.name] = s.checked : (p[s.name] || (p[s.name] = []), s.checked && p[s.name].push(s.value));
      else if (s.type === "radio")
        s.checked && (p[s.name] = s.value);
      else if (s.type === "select-multiple") {
        p[s.name] = [];
        for (let t = 0; t < s.options.length; t++)
          s.options[t].selected && p[s.name].push(s.options[t].value);
      } else if (b && s.type === "hidden")
        p[s.name] = s.value;
      else if (b && (s.type === "number" || s.type === "range")) {
        const t = Number(s.value);
        p[s.name] = s.value === "" || isNaN(t) ? null : t;
      } else
        p[s.name] = s.value;
  }
  return p;
}
function se(h) {
  if (typeof h != "string") return !!h;
  const d = h.trim().toLowerCase();
  return d !== "false" && d !== "0" && d !== "" && d !== "off" && d !== "no";
}
function Ut(h, d) {
  const b = h.elements, p = [], f = {};
  for (let g = 0; g < b.length; g++) {
    const n = b[g];
    n.name && n.type === "checkbox" && (f[n.name] = (f[n.name] || 0) + 1);
  }
  for (let g = 0; g < b.length; g++) {
    const n = b[g];
    if (n.type === "file" || n.type === "submit" || n.type === "button") continue;
    const s = n.getAttribute("data-ln-fill-as") || n.name;
    if (!s || !(s in d)) continue;
    const t = d[s];
    if (n.type === "checkbox") {
      if (Array.isArray(t))
        n.checked = t.indexOf(n.value) !== -1;
      else if (f[n.name] > 1) {
        const i = String(t).split(",").map(function(e) {
          return e.trim();
        });
        n.checked = i.indexOf(n.value) !== -1;
      } else
        n.checked = se(t);
      p.push(n);
    } else if (n.type === "radio")
      n.checked = n.value === String(t), p.push(n);
    else if (n.type === "select-multiple") {
      if (Array.isArray(t))
        for (let i = 0; i < n.options.length; i++)
          n.options[i].selected = t.indexOf(n.options[i].value) !== -1;
      p.push(n);
    } else
      n.value = t, p.push(n);
  }
  return p;
}
function K(h) {
  const d = h ? h.closest("[lang]") : null;
  return (d ? d.lang : null) || (document.documentElement ? document.documentElement.lang : null) || navigator.language;
}
function qt(h) {
  return h.hasAttribute("data-ln-value") ? h.getAttribute("data-ln-value") : h.textContent.trim();
}
function jt(h, d, { get: b, set: p }) {
  Object.defineProperty(h, "value", {
    get: function() {
      return b ? b.call(this) : d.get.call(this);
    },
    set: function(f) {
      p ? p.call(this, f, (g) => d.set.call(this, g)) : d.set.call(this, f);
    },
    configurable: !0
  });
}
function B(h, d, b, p, f = {}) {
  const g = f.extraAttributes || [], n = f.onAttributeChange || null, s = f.onInit || null;
  function t(i) {
    const e = i || document.body;
    Ct(e, h, d, b), s && s(e);
  }
  return $(function() {
    const i = new MutationObserver(function(r) {
      for (let u = 0; u < r.length; u++) {
        const a = r[u];
        if (a.type === "childList") {
          for (let o = 0; o < a.addedNodes.length; o++) {
            const c = a.addedNodes[o];
            c.nodeType === 1 && (Ct(c, h, d, b), s && s(c));
          }
          for (let o = 0; o < a.removedNodes.length; o++) {
            const c = a.removedNodes[o];
            if (c.nodeType === 1) {
              const l = h.indexOf("[") !== -1 || h.indexOf(".") !== -1 || h.indexOf("#") !== -1 ? h : "[" + h + "]", _ = Array.from(c.querySelectorAll(l));
              c.matches && c.matches(l) && _.push(c);
              for (let v = 0; v < _.length; v++) {
                const E = _[v];
                if (!document.contains(E)) {
                  const A = E[d];
                  A && typeof A.destroy == "function" && A.destroy();
                }
              }
            }
          }
        } else a.type === "attributes" && (n && a.target[d] ? n(a.target, a.attributeName) : (Ct(a.target, h, d, b), s && s(a.target)));
      }
    });
    let e = [];
    if (h.indexOf("[") !== -1) {
      const r = /\[([\w-]+)/g;
      let u;
      for (; (u = r.exec(h)) !== null; )
        e.push(u[1]);
    } else
      e.push(h);
    i.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: e.concat(g)
    });
  }, p || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[d] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
function zt(h, d) {
  if (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0 || !d) return !1;
  const b = d.getAttribute("href");
  return !(!b || d.getAttribute("target") === "_blank" || d.hasAttribute("download") || b.startsWith("mailto:") || b.startsWith("tel:") || b === "#" || b.startsWith("#") || d.hostname && d.hostname !== window.location.hostname);
}
function V(...h) {
  return h.filter((d) => d != null && d !== "").map((d, b) => b === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function W(h, d) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, h, d ? { Authorization: d } : null);
}
function Kt(h, d = "ln-core") {
  try {
    return h ? JSON.parse(h) : {};
  } catch (b) {
    return console.error(`[${d}] Invalid headers JSON:`, b), {};
  }
}
const Vt = {};
function ae(h, d) {
  Vt[h] = d;
}
function le(h) {
  return Vt[h] || { ingress: (d) => d, egress: (d) => d };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ae, window.lnCore.getDataMapper = le, window.lnCore.fillTemplate = bt, window.lnCore.fill = X, window.lnCore.lnFill = ie, window.lnCore.renderList = re);
function ce(h, d) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, h(), d && d();
    }));
  };
}
const de = "ln:";
function ue() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Wt(h, d) {
  const b = d.getAttribute("data-ln-persist"), p = b !== null && b !== "" ? b : d.id;
  return p ? de + h + ":" + ue() + ":" + p : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', d), null);
}
function wt(h, d) {
  const b = Wt(h, d);
  if (!b) return null;
  try {
    const p = localStorage.getItem(b);
    return p !== null ? JSON.parse(p) : null;
  } catch {
    return null;
  }
}
function at(h, d, b) {
  const p = Wt(h, d);
  if (p)
    try {
      localStorage.setItem(p, JSON.stringify(b));
    } catch {
    }
}
function At(h, d, b, p) {
  const f = typeof p == "number" ? p : 4, g = window.innerWidth, n = window.innerHeight, s = d.width, t = d.height, i = (b || "bottom").split("-"), e = i[0], r = i[1] === "start" || i[1] === "end" ? i[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, a = u[e] || u.bottom;
  function o(v) {
    return v === "top" || v === "bottom" ? r === "start" ? h.left : r === "end" ? h.right - s : h.left + (h.width - s) / 2 : r === "start" ? h.top : r === "end" ? h.bottom - t : h.top + (h.height - t) / 2;
  }
  function c(v) {
    let E, A, w = !0;
    return v === "top" ? (E = h.top - f - t, A = o(v), E < 0 && (w = !1)) : v === "bottom" ? (E = h.bottom + f, A = o(v), E + t > n && (w = !1)) : v === "left" ? (E = o(v), A = h.left - f - s, A < 0 && (w = !1)) : (E = o(v), A = h.right + f, A + s > g && (w = !1)), { top: E, left: A, side: v, fits: w };
  }
  let m = null;
  for (let v = 0; v < a.length; v++) {
    const E = c(a[v]);
    if (E.fits) {
      m = E;
      break;
    }
  }
  m || (m = c(a[0]));
  let l = m.top, _ = m.left;
  return s >= g ? _ = 0 : (_ < 0 && (_ = 0), _ + s > g && (_ = g - s)), t >= n ? l = 0 : (l < 0 && (l = 0), l + t > n && (l = n - t)), { top: l, left: _, placement: m.side };
}
function Gt(h) {
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
  const d = h.style, b = d.visibility, p = d.display, f = d.position;
  d.visibility = "hidden", d.display = "block", d.position = "fixed";
  const g = h.offsetWidth, n = h.offsetHeight;
  return d.visibility = b, d.display = p, d.position = f, { width: g, height: n };
}
let ot = null;
async function Mt(h) {
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
function mt() {
  return ot;
}
async function he(h, d = ot) {
  const b = d || ot;
  if (!b || h === void 0 || h === null) return h;
  try {
    const p = new TextEncoder(), f = crypto.getRandomValues(new Uint8Array(12)), g = typeof h == "string" ? h : JSON.stringify(h), n = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: f },
      b,
      p.encode(g)
    ), s = btoa(String.fromCharCode(...f)), t = btoa(String.fromCharCode(...new Uint8Array(n)));
    return {
      encrypted: !0,
      iv: s,
      data: t
    };
  } catch (p) {
    return console.error("[ln-core/crypto] Encryption failed:", p), h;
  }
}
async function fe(h, d = ot) {
  const b = d || ot;
  if (!h || !h.encrypted || !b) return h;
  try {
    const p = new TextDecoder(), f = Uint8Array.from(atob(h.iv), (t) => t.charCodeAt(0)), g = Uint8Array.from(atob(h.data), (t) => t.charCodeAt(0)), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: f },
      b,
      g
    ), s = p.decode(n);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (p) {
    return console.error("[ln-core/crypto] Decryption failed. Key may be incorrect:", p), { ...h, decryptionError: !0 };
  }
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), d = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function p(i) {
    return typeof i == "string" ? i : i instanceof URL ? i.href : i instanceof Request ? i.url : String(i);
  }
  function f(i, e) {
    return e && e.method ? String(e.method).toUpperCase() : i instanceof Request ? i.method.toUpperCase() : "GET";
  }
  function g(i, e) {
    return e + " " + i;
  }
  function n(i) {
    return i === "GET" || i === "HEAD";
  }
  function s(i, e) {
    e = e || {};
    const r = p(i), u = f(i, e), a = g(r, u);
    n(u) && d.has(a) && (d.get(a).abort(), d.delete(a));
    const o = new AbortController(), c = e.signal;
    c && (c.aborted ? o.abort(c.reason) : c.addEventListener("abort", function() {
      o.abort(c.reason);
    }, { once: !0 }));
    const m = Object.assign({}, e, { signal: o.signal });
    return d.set(a, o), h(i, m).finally(function() {
      d.get(a) === o && d.delete(a);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function t(i) {
    const e = i.detail || {};
    if (!e.url) return;
    const r = i.target, u = (e.method || (e.body ? "POST" : "GET")).toUpperCase(), a = e.key;
    a && b.has(a) && (b.get(a).abort(), b.delete(a));
    const o = new AbortController(), c = e.signal;
    c && (c.aborted ? o.abort(c.reason) : c.addEventListener("abort", function() {
      o.abort(c.reason);
    }, { once: !0 })), a && b.set(a, o);
    const m = { method: u, signal: o.signal };
    e.body !== void 0 && (m.body = e.body), window.fetch(e.url, m).then(function(l) {
      a && b.get(a) === o && b.delete(a), S(r, "ln-http:response", {
        ok: l.ok,
        status: l.status,
        response: l
      });
    }).catch(function(l) {
      a && b.get(a) === o && b.delete(a), !(l && l.name === "AbortError") && S(r, "ln-http:error", {
        ok: !1,
        status: 0,
        error: l
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(i) {
      let e = !1;
      return d.forEach(function(r, u) {
        u.endsWith(" " + i) && (r.abort(), d.delete(u), e = !0);
      }), e;
    },
    cancelByKey: function(i) {
      return b.has(i) ? (b.get(i).abort(), b.delete(i), !0) : !1;
    },
    cancelAll: function() {
      d.forEach(function(i) {
        i.abort();
      }), d.clear(), b.forEach(function(i) {
        i.abort();
      }), b.clear();
    },
    get inflight() {
      const i = [];
      return d.forEach(function(e, r) {
        const u = r.indexOf(" ");
        i.push({ method: r.slice(0, u), url: r.slice(u + 1) });
      }), b.forEach(function(e, r) {
        i.push({ key: r });
      }), i;
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
    const r = s(e);
    p(r.links), f(r.forms);
  }
  function p(e) {
    for (const r of e) {
      if (r[d + "Trigger"] || r.hostname && r.hostname !== window.location.hostname) continue;
      const u = r.getAttribute("href");
      if (u && u.includes("#")) continue;
      const a = function(o) {
        if (!zt(o, r)) return;
        o.preventDefault();
        const c = r.getAttribute("href");
        c && n("GET", c, null, r);
      };
      r.addEventListener("click", a), r[d + "Trigger"] = a;
    }
  }
  function f(e) {
    for (const r of e) {
      if (r[d + "Trigger"]) continue;
      const u = function(a) {
        a.preventDefault();
        const o = r.method.toUpperCase(), c = r.action, m = new FormData(r);
        for (const l of r.querySelectorAll('button, input[type="submit"]'))
          l.disabled = !0;
        n(o, c, m, r, function() {
          for (const l of r.querySelectorAll('button, input[type="submit"]'))
            l.disabled = !1;
        });
      };
      r.addEventListener("submit", u), r[d + "Trigger"] = u;
    }
  }
  function g(e) {
    if (!e[d]) return;
    const r = s(e);
    for (const u of r.links)
      u[d + "Trigger"] && (u.removeEventListener("click", u[d + "Trigger"]), delete u[d + "Trigger"]);
    for (const u of r.forms)
      u[d + "Trigger"] && (u.removeEventListener("submit", u[d + "Trigger"]), delete u[d + "Trigger"]);
    delete e[d];
  }
  function n(e, r, u, a, o) {
    if (z(a, "ln-ajax:before-start", { method: e, url: r }).defaultPrevented) return;
    S(a, "ln-ajax:start", { method: e, url: r }), a.classList.add("ln-ajax--loading");
    const m = document.createElement("span");
    m.className = "ln-ajax-spinner", a.appendChild(m);
    function l() {
      a.classList.remove("ln-ajax--loading");
      const w = a.querySelector(".ln-ajax-spinner");
      w && w.remove(), o && o();
    }
    let _ = r;
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
      _ = r + (r.includes("?") ? "&" : "?") + w.toString();
    } else e !== "GET" && u && (A.body = u);
    fetch(_, A).then(function(w) {
      const C = w.ok;
      return w.json().then(function(D) {
        return { ok: C, status: w.status, data: D };
      });
    }).then(function(w) {
      const C = w.data;
      if (w.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const D in C.content) {
            const R = document.getElementById(D);
            if (R) {
              let x = C.content[D];
              window.DOMPurify && typeof window.DOMPurify.sanitize == "function" ? x = window.DOMPurify.sanitize(x) : x = x.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""), R.innerHTML = x;
            }
          }
        if (a.tagName === "A") {
          const D = a.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else a.tagName === "FORM" && a.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
        S(a, "ln-ajax:success", { method: e, url: _, data: C });
      } else
        S(a, "ln-ajax:error", { method: e, url: _, status: w.status, data: C });
      if (C.message) {
        const D = C.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: D.type || (w.ok ? "success" : "error"),
            title: D.title || "",
            message: D.body || ""
          }
        }));
      }
      S(a, "ln-ajax:complete", { method: e, url: _ }), l();
    }).catch(function(w) {
      S(a, "ln-ajax:error", { method: e, url: _, error: w }), S(a, "ln-ajax:complete", { method: e, url: _ }), l();
    });
  }
  function s(e) {
    const r = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? r.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? r.forms.push(e) : (r.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), r.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), r;
  }
  function t() {
    $(function() {
      new MutationObserver(function(r) {
        for (const u of r)
          if (u.type === "childList") {
            for (const a of u.addedNodes)
              if (a.nodeType === 1 && (b(a), !a.hasAttribute(h))) {
                for (const c of a.querySelectorAll("[" + h + "]"))
                  b(c);
                const o = a.closest && a.closest("[" + h + "]");
                if (o && o.getAttribute(h) !== "false") {
                  const c = s(a);
                  p(c.links), f(c.forms);
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
  window[d] = b, window[d].destroy = g, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
const pe = {
  navigate: function(h) {
    _t(h, { historyAction: "push" });
  },
  replace: function(h) {
    _t(h, { historyAction: "replace" });
  },
  current: function() {
    return Dt ? {
      path: kt,
      params: Xt,
      query: Jt,
      route: Dt,
      regions: Yt
    } : null;
  }
}, Rt = "data-ln-route", $t = "lnRoute";
typeof window < "u" && (window.lnRouter = pe);
const et = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new WeakMap();
let Yt = /* @__PURE__ */ new Map(), Ft = !1, kt = null, Xt = {}, Jt = {}, Dt = null, xt = !1;
function Bt(h, d, b) {
  xt ? queueMicrotask(function() {
    S(h, d, b);
  }) : S(h, d, b);
}
function Qt(h) {
  let [d] = h.split("#"), [b, p] = d.split("?");
  const f = {};
  if (p) {
    const g = new URLSearchParams(p);
    for (const [n, s] of g.entries())
      f[n] = s;
  }
  return b = b.replace(/\/+$/, ""), b === "" && (b = "/"), { path: b, query: f };
}
function Zt(h, d) {
  if (h.pattern === "*") return 1;
  if (d.pattern === "*") return -1;
  const b = h.segments, p = d.segments, f = Math.max(b.length, p.length);
  for (let g = 0; g < f; g++) {
    const n = b[g], s = p[g];
    if (n === void 0) return 1;
    if (s === void 0) return -1;
    if (n === "*") return 1;
    if (s === "*") return -1;
    const t = n.startsWith(":"), i = s.startsWith(":");
    if (t && !i) return 1;
    if (!t && i) return -1;
  }
  return 0;
}
function te(h, d) {
  const b = h.split("/").filter(Boolean);
  for (const p of d) {
    if (p.pattern === "*")
      return {
        route: p,
        params: { wildcard: h }
      };
    const f = p.segments, g = {};
    let n = !0;
    if (!(b.length > f.length && f[f.length - 1] !== "*")) {
      for (let s = 0; s < f.length; s++) {
        const t = f[s], i = b[s];
        if (t === "*") {
          g.wildcard = b.slice(s).join("/");
          break;
        }
        if (i === void 0) {
          n = !1;
          break;
        }
        if (t.startsWith(":"))
          g[t.slice(1)] = decodeURIComponent(i);
        else if (t !== i) {
          n = !1;
          break;
        }
      }
      if (n && (f.indexOf("*") !== -1 || b.length <= f.length))
        return { route: p, params: g };
    }
  }
  return null;
}
function Ot(h, d) {
  if (h !== "__primary__") {
    const p = document.getElementById(d.target);
    return p || console.warn(`[ln-router] Explicit target element #${d.target} not found in DOM`), p;
  }
  const b = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return b || console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), b;
}
function me(h) {
  if (!h) return;
  const d = Array.from(h.querySelectorAll("*")), b = [h].concat(d);
  for (const f of b)
    for (const g of Object.keys(f))
      if (g.startsWith("ln") && f[g] && typeof f[g].destroy == "function")
        try {
          f[g].destroy();
        } catch (n) {
          console.error(`[ln-router] Error destroying component ${g} on element:`, f, n);
        }
  const p = document.querySelectorAll('[data-ln-popover="open"]');
  for (const f of p) {
    const g = f.lnPopover;
    if (g && g.trigger && h.contains(g.trigger))
      try {
        g.destroy();
      } catch (n) {
        console.error("[ln-router] Error destroying open teleported popover:", n);
      }
  }
}
function _t(h, d = {}) {
  const { path: b, query: p } = Qt(h), f = /* @__PURE__ */ new Map();
  for (const [e, r] of et)
    f.set(e, te(b, r.sorted));
  const g = et.has("__primary__"), n = f.get("__primary__");
  if (g && !n) {
    Bt(document.body, "ln-router:not-found", { path: b });
    return;
  }
  let s = null;
  if (n && (s = Ot("__primary__", n.route), !s || z(s, "ln-router:before-navigate", {
    from: kt,
    to: h,
    params: n.params,
    query: p
  }).defaultPrevented))
    return;
  const t = [];
  for (const [e, r] of f) {
    if (!r) continue;
    const u = Ot(e, r.route);
    u && (e !== "__primary__" && u.hasAttribute("data-ln-route-keep") && Nt.get(u) === r.route.templateNode || t.push({ regionKey: e, match: r, targetEl: u }));
  }
  d.historyAction === "push" ? window.history.pushState(null, "", h) : d.historyAction === "replace" && window.history.replaceState(null, "", h);
  const i = function() {
    for (const { regionKey: e, match: r, targetEl: u } of t) {
      const a = d.isHydration && u.hasAttribute("data-ln-router-hydrate") && u.children.length > 0;
      if (!a) {
        me(u);
        const o = r.route.templateNode.content.cloneNode(!0);
        u.replaceChildren(o);
      }
      if (Nt.set(u, r.route.templateNode), e === "__primary__" && (r.route.title && (document.title = r.route.title), !a)) {
        u.hasAttribute("tabindex") || u.setAttribute("tabindex", "-1");
        const o = u.querySelector("h1, h2, h3, h4, h5, h6");
        o ? (o.setAttribute("tabindex", "-1"), o.focus()) : u.focus(), u.scrollIntoView({ block: "start", behavior: "instant" });
      }
      Bt(u, "ln-router:navigated", {
        path: h,
        params: r.params,
        query: p,
        route: r.route,
        target: u,
        region: e
      });
    }
    n && (kt = h, Xt = n.params, Jt = p, Dt = n.route), Yt = new Map(
      Array.from(f.entries()).map(([e, r]) => [e, r ? { route: r.route, params: r.params } : null])
    );
  };
  document.startViewTransition && !d.isHydration ? document.startViewTransition(i) : i();
}
function ge(h) {
  const d = h.target.closest("a");
  if (!d || !zt(h, d)) return;
  const b = d.getAttribute("href"), { path: p } = Qt(b), f = et.get("__primary__");
  if (!f) return;
  te(p, f.sorted) && (h.preventDefault(), _t(b, { historyAction: "push" }));
}
function _e() {
  const h = window.location.pathname + window.location.search;
  _t(h, { historyAction: "skip" });
}
function be() {
  Ft || (Ft = !0, $(function() {
    document.addEventListener("click", ge), window.addEventListener("popstate", _e), xt = !0;
    const h = window.location.pathname + window.location.search;
    _t(h, { historyAction: "replace", isHydration: !0 }), xt = !1;
  }, "ln-router"));
}
function ve(h) {
  const d = h.getAttribute(Rt);
  if (!d) return;
  const b = h.getAttribute("data-ln-route-target") || null;
  if (b === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${d}" rejected.`);
    return;
  }
  const p = b || "__primary__";
  et.has(p) || et.set(p, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const f = et.get(p);
  if (f.routes.has(d)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${d}" in region "${p}"`);
    return;
  }
  const g = h.getAttribute("data-ln-route-title"), n = d.split("/").filter(Boolean), s = {
    pattern: d,
    segments: n,
    target: b,
    title: g,
    templateNode: h
  }, t = Ot(p, s);
  t && t.contains(h) && console.warn(`[ln-router] Route template with pattern "${d}" is declared inside its own outlet element:`, h), f.routes.set(d, s), f.sorted = Array.from(f.routes.values()).sort(Zt);
}
function ye(h) {
  const d = h.getAttribute(Rt);
  if (!d) return;
  const p = h.getAttribute("data-ln-route-target") || null || "__primary__", f = et.get(p);
  f && (f.routes.delete(d), f.sorted = Array.from(f.routes.values()).sort(Zt), f.routes.size === 0 && et.delete(p));
}
function ee(h) {
  return this.dom = h, ve(h), this;
}
ee.prototype.destroy = function() {
  ye(this.dom), delete this.dom[$t];
};
B(Rt, $t, ee, "ln-router", {
  extraAttributes: ["data-ln-route-target", "data-ln-route-title"],
  onInit: function() {
    et.size > 0 && be();
  }
});
(function() {
  const h = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0) return;
  function b(f) {
    this.dom = f, this.isOpen = f.getAttribute(h) === "open";
    const g = this;
    return this._onEscape = function(n) {
      n.key === "Escape" && g.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(n) {
      if (n.key !== "Tab") return;
      const s = Array.prototype.filter.call(
        g.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        gt
      );
      if (s.length === 0) return;
      const t = s[0], i = s[s.length - 1];
      n.shiftKey ? document.activeElement === t && (n.preventDefault(), i.focus()) : document.activeElement === i && (n.preventDefault(), t.focus());
    }, this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  b.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.isOpen) {
        this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null;
        const f = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + h + '="open"]'),
          function(n) {
            return n !== f;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[d];
    }
  };
  function p(f) {
    const g = f[d];
    if (!g) return;
    const s = f.getAttribute(h) === "open";
    if (s !== g.isOpen)
      if (s) {
        if (z(f, "ln-modal:before-open", { modalId: f.id, target: f }).defaultPrevented) {
          f.setAttribute(h, "close");
          return;
        }
        g.isOpen = !0, f.setAttribute("aria-modal", "true"), f.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", g._onEscape), document.addEventListener("keydown", g._onFocusTrap);
        const i = document.activeElement;
        g._returnFocusEl = i && i !== document.body ? i : null;
        const e = f.querySelector("[autofocus]");
        if (e && gt(e))
          e.focus();
        else {
          const r = f.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(r, gt);
          if (u) u.focus();
          else {
            const a = f.querySelectorAll("a[href], button:not([disabled])"), o = Array.prototype.find.call(a, gt);
            o && o.focus();
          }
        }
        S(f, "ln-modal:open", { modalId: f.id, target: f });
      } else {
        if (z(f, "ln-modal:before-close", { modalId: f.id, target: f }).defaultPrevented) {
          f.setAttribute(h, "open");
          return;
        }
        g.isOpen = !1, f.removeAttribute("aria-modal"), document.removeEventListener("keydown", g._onEscape), document.removeEventListener("keydown", g._onFocusTrap), S(f, "ln-modal:close", { modalId: f.id, target: f }), g._returnFocusEl && document.contains(g._returnFocusEl) && typeof g._returnFocusEl.focus == "function" && g._returnFocusEl.focus(), g._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const g = f.target.closest("[data-ln-modal-for]");
    if (g) {
      const s = g.getAttribute("data-ln-modal-for"), t = document.getElementById(s);
      if (t && t[d]) {
        f.preventDefault();
        const i = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, e = {}, r = g.dataset;
        for (const o in r) {
          if (!o.startsWith("lnModal") || i[o]) continue;
          const c = o.slice(7);
          c && (e[c.charAt(0).toLowerCase() + c.slice(1)] = r[o]);
        }
        const u = Object.keys(e).length > 0;
        if (u)
          window.lnCore.fill(t, e);
        else {
          const o = t.querySelectorAll("[data-ln-field]");
          for (let c = 0; c < o.length; c++)
            o[c].textContent = "";
        }
        g.hasAttribute("data-ln-modal-mode") ? t.dataset.lnModalMode = g.getAttribute("data-ln-modal-mode") : t.dataset.lnModalMode = u ? "edit" : "new";
        const a = t.getAttribute(h);
        t.setAttribute(h, a === "open" ? "close" : "open");
      }
      return;
    }
    const n = f.target.closest("[data-ln-modal-close]");
    if (n) {
      const s = n.closest("[" + h + "]");
      s && s[d] && (f.preventDefault(), s.setAttribute(h, "close"));
    }
  }), B(h, d, b, "ln-modal", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-number", d = "lnNumber";
  if (window[d] !== void 0) return;
  const b = {}, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function f(t) {
    if (!b[t]) {
      const i = new Intl.NumberFormat(t, { useGrouping: !0 }), e = i.formatToParts(1234.5);
      let r = "", u = ".";
      for (let a = 0; a < e.length; a++)
        e[a].type === "group" && (r = e[a].value), e[a].type === "decimal" && (u = e[a].value);
      b[t] = { fmt: i, groupSep: r, decimalSep: u };
    }
    return b[t];
  }
  function g(t, i, e) {
    if (e !== null) {
      const r = parseInt(e, 10), u = t + "|d" + r;
      return b[u] || (b[u] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: r })), b[u].format(i);
    }
    return f(t).fmt.format(i);
  }
  function n(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    if (t[d]) return t[d];
    t[d] = this, this.dom = t;
    const i = document.createElement("input");
    i.type = "hidden", i.name = t.name, t.removeAttribute("name"), t.hasAttribute("data-ln-fill-as") && i.setAttribute("data-ln-fill-as", t.getAttribute("data-ln-fill-as")), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", i), this._hidden = i;
    const e = this;
    Object.defineProperty(i, "value", {
      get: function() {
        return p.get.call(i);
      },
      set: function(u) {
        p.set.call(i, u), u !== "" && !isNaN(parseFloat(u)) ? e._setDisplayRaw(g(K(e.dom), parseFloat(u), e.dom.getAttribute("data-ln-number-decimals"))) : e._setDisplayRaw(""), e.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), jt(t, p, {
      get: function() {
        return p.get.call(t);
      },
      set: function(u) {
        if (u === "") {
          e._setDisplayRaw(""), e._setHiddenRaw(""), t.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const a = typeof u == "number" ? u : parseFloat(String(u).replace(/[^\d.-]/g, ""));
        isNaN(a) ? (e._setDisplayRaw(String(u)), e._setHiddenRaw("")) : (e._setHiddenRaw(a), e._setDisplayRaw(g(K(t), a, t.getAttribute("data-ln-number-decimals")))), t.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(u) {
      u.preventDefault();
      const a = (u.clipboardData || window.clipboardData).getData("text"), o = f(K(t)), c = o.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let m = a.replace(new RegExp("[^0-9\\-" + c + ".]", "g"), "");
      o.groupSep && (m = m.split(o.groupSep).join("")), o.decimalSep !== "." && (m = m.replace(o.decimalSep, "."));
      const l = parseFloat(m);
      e.value = isNaN(l) ? NaN : l;
    }, t.addEventListener("paste", this._onPaste);
    const r = t.value;
    if (r !== "") {
      const u = parseFloat(r);
      isNaN(u) || (this._setHiddenRaw(u), this._setDisplayRaw(g(K(t), u, t.getAttribute("data-ln-number-decimals"))), t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
    return this;
  }
  n.prototype._handleInput = function() {
    const t = this.dom, i = f(K(t)), e = p.get.call(t);
    if (e === "") {
      this._setHiddenRaw(""), S(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._setHiddenRaw("");
      return;
    }
    const r = t.selectionStart;
    let u = 0;
    for (let w = 0; w < r; w++)
      /[0-9]/.test(e[w]) && u++;
    let a = e;
    if (i.groupSep && (a = a.split(i.groupSep).join("")), a = a.replace(i.decimalSep, "."), e.endsWith(i.decimalSep) || e.endsWith(".")) {
      const w = a.replace(/\.$/, ""), C = parseFloat(w);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const o = a.indexOf(".");
    if (o !== -1 && a.slice(o + 1).endsWith("0")) {
      const C = parseFloat(a);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const c = t.getAttribute("data-ln-number-decimals");
    if (c !== null && o !== -1) {
      const w = parseInt(c, 10);
      a.slice(o + 1).length > w && (a = a.slice(0, o + 1 + w));
    }
    const m = parseFloat(a);
    if (isNaN(m)) return;
    const l = t.getAttribute("data-ln-number-min"), _ = t.getAttribute("data-ln-number-max");
    if (l !== null && m < parseFloat(l) || _ !== null && m > parseFloat(_)) return;
    let v;
    if (c !== null)
      v = g(K(t), m, c);
    else {
      const w = o !== -1 ? a.slice(o + 1).length : 0;
      if (w > 0) {
        const C = K(t) + "|u" + w;
        b[C] || (b[C] = new Intl.NumberFormat(K(t), { useGrouping: !0, minimumFractionDigits: w, maximumFractionDigits: w })), v = b[C].format(m);
      } else
        v = i.fmt.format(m);
    }
    this._setDisplayRaw(v);
    let E = u, A = 0;
    for (let w = 0; w < v.length && E > 0; w++)
      A = w + 1, /[0-9]/.test(v[w]) && E--;
    E > 0 && (A = v.length), t.setSelectionRange(A, A), this._setHiddenRaw(m), S(t, "ln-number:input", { value: m, formatted: v });
  }, n.prototype._setHiddenRaw = function(t) {
    p.set.call(this._hidden, String(t));
  }, n.prototype._setDisplayRaw = function(t) {
    p.set.call(this.dom, String(t));
  }, n.prototype._displayFormatted = function(t) {
    this._setDisplayRaw(g(K(this.dom), t, this.dom.getAttribute("data-ln-number-decimals")));
  }, Object.defineProperty(n.prototype, "value", {
    get: function() {
      const t = p.get.call(this._hidden);
      return t === "" ? NaN : parseFloat(t);
    },
    set: function(t) {
      if (typeof t != "number" || isNaN(t)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(t), this._setDisplayRaw(g(K(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"))), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(n.prototype, "formatted", {
    get: function() {
      return p.get.call(this.dom);
    }
  }), n.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), S(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function s() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let i = 0; i < t.length; i++) {
        const e = t[i][d];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, d, n, "ln-number"), s();
})();
(function() {
  const h = "data-ln-date", d = "lnDate";
  if (window[d] !== void 0) return;
  const b = {}, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function f(o, c) {
    const m = o + "|" + JSON.stringify(c);
    return b[m] || (b[m] = new Intl.DateTimeFormat(o, c)), b[m];
  }
  const g = /^(short|medium|long)(\s+datetime)?$/, n = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(o) {
    return !o || o === "" ? { dateStyle: "medium" } : o.match(g) ? n[o] : null;
  }
  function t(o, c, m) {
    const l = o.getDate(), _ = o.getMonth(), v = o.getFullYear(), E = o.getHours(), A = o.getMinutes();
    let w, C;
    if (m.startsWith("mk") && !f(m, { month: "long" }).resolvedOptions().locale.startsWith("mk")) {
      const O = [
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
      w = O[_], C = F[_];
    }
    w === void 0 && (w = f(m, { month: "long" }).format(o)), C === void 0 && (C = f(m, { month: "short" }).format(o));
    const D = {
      yyyy: String(v),
      yy: String(v).slice(-2),
      MMMM: w,
      MMM: C,
      MM: String(_ + 1).padStart(2, "0"),
      M: String(_ + 1),
      dd: String(l).padStart(2, "0"),
      d: String(l),
      HH: String(E).padStart(2, "0"),
      mm: String(A).padStart(2, "0")
    };
    return c.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(R) {
      return D[R];
    });
  }
  function i(o, c, m) {
    const l = s(c);
    if (l) {
      const _ = f(m, l), v = _.resolvedOptions().locale;
      return m.startsWith("mk") && !v.startsWith("mk") ? t(o, "dd.MM.yyyy", m) : _.format(o);
    }
    return t(o, c, m);
  }
  function e(o) {
    if (o.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", o.tagName), this;
    if (o[d]) return o[d];
    o[d] = this, this.dom = o;
    const c = this, m = o.value, l = o.name, _ = document.createElement("span");
    _.setAttribute("data-ln-date-field", ""), o.parentNode.insertBefore(_, o), _.appendChild(o), this._wrapper = _;
    const v = document.createElement("input");
    v.type = "hidden", v.name = l, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && v.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.insertAdjacentElement("afterend", v), this._hidden = v;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", v.insertAdjacentElement("afterend", E), this._picker = E, o.type = "text";
    const A = document.createElement("button");
    if (A.type = "button", A.setAttribute("aria-label", "Open date picker"), A.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', E.insertAdjacentElement("afterend", A), this._btn = A, this._lastISO = "", Object.defineProperty(v, "value", {
      get: function() {
        return p.get.call(v);
      },
      set: function(w) {
        if (p.set.call(v, w), w && w !== "") {
          const C = r(w);
          C && (c._displayFormatted(C), p.set.call(E, w), c._lastISO = w, S(c.dom, "ln-date:change", {
            value: w,
            formatted: c.dom.value,
            date: C
          }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
        } else w === "" && (c.dom.value = "", p.set.call(E, ""), c._lastISO = "", S(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }), c.dom.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }), jt(o, p, {
      get: function() {
        return p.get.call(o);
      },
      set: function(w, C) {
        if (c._isFormatting) {
          C(w);
          return;
        }
        if (!w || w === "") {
          C(""), c._setHiddenRaw(""), p.set.call(c._picker, ""), c._lastISO = "", S(o, "ln-date:change", {
            value: "",
            formatted: "",
            date: null
          }), o.dispatchEvent(new Event("change", { bubbles: !0 }));
          return;
        }
        let D = r(w);
        if (D || (D = u(w)), D) {
          const R = D.getFullYear(), x = String(D.getMonth() + 1).padStart(2, "0"), O = String(D.getDate()).padStart(2, "0"), F = R + "-" + x + "-" + O;
          c._setHiddenRaw(F), p.set.call(c._picker, F), c._lastISO = F;
          const U = o.getAttribute(h) || "", Q = K(o), Z = i(D, U, Q);
          C(Z), S(o, "ln-date:change", {
            value: F,
            formatted: Z,
            date: D
          }), o.dispatchEvent(new Event("change", { bubbles: !0 }));
        } else
          C(String(w)), c._setHiddenRaw(""), p.set.call(c._picker, ""), c._lastISO = "", S(o, "ln-date:change", {
            value: "",
            formatted: String(w),
            date: null
          }), o.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }), this._onPickerChange = function() {
      const w = E.value;
      if (w) {
        const C = r(w);
        C && (c._setHiddenRaw(w), c._displayFormatted(C), c._lastISO = w, S(c.dom, "ln-date:change", {
          value: w,
          formatted: c.dom.value,
          date: C
        }));
      } else
        c._setHiddenRaw(""), c.dom.value = "", c._lastISO = "", S(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const w = c.dom.value.trim();
      if (w === "") {
        c._lastISO !== "" && (c._setHiddenRaw(""), p.set.call(c._picker, ""), c.dom.value = "", c._lastISO = "", S(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (c._lastISO) {
        const D = r(c._lastISO);
        if (D) {
          const R = c.dom.getAttribute(h) || "", x = K(c.dom), O = i(D, R, x);
          if (w === O) return;
        }
      }
      const C = u(w);
      if (C) {
        const D = C.getFullYear(), R = String(C.getMonth() + 1).padStart(2, "0"), x = String(C.getDate()).padStart(2, "0"), O = D + "-" + R + "-" + x;
        c._setHiddenRaw(O), p.set.call(c._picker, O), c._displayFormatted(C), c._lastISO = O, S(c.dom, "ln-date:change", {
          value: O,
          formatted: c.dom.value,
          date: C
        });
      } else if (c._lastISO) {
        const D = r(c._lastISO);
        D && c._displayFormatted(D);
      } else
        c.dom.value = "";
    }, o.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      c._openPicker();
    }, A.addEventListener("click", this._onBtnClick), m && m !== "") {
      const w = r(m);
      w && (this._setHiddenRaw(m), p.set.call(E, m), this._displayFormatted(w), this._lastISO = m, S(o, "ln-date:change", {
        value: m,
        formatted: o.value,
        date: w
      }), o.dispatchEvent(new Event("change", { bubbles: !0 })));
    }
    return this;
  }
  function r(o) {
    if (!o || typeof o != "string") return null;
    const c = o.split("T"), m = c[0].split("-");
    if (m.length < 3) return null;
    const l = parseInt(m[0], 10), _ = parseInt(m[1], 10) - 1, v = parseInt(m[2], 10);
    if (isNaN(l) || isNaN(_) || isNaN(v)) return null;
    let E = 0, A = 0;
    if (c[1]) {
      const C = c[1].split(":");
      E = parseInt(C[0], 10) || 0, A = parseInt(C[1], 10) || 0;
    }
    const w = new Date(l, _, v, E, A);
    return w.getFullYear() !== l || w.getMonth() !== _ || w.getDate() !== v ? null : w;
  }
  function u(o) {
    if (!o || typeof o != "string" || (o = o.trim(), o.length < 6)) return null;
    let c, m;
    if (o.indexOf(".") !== -1)
      c = ".", m = o.split(".");
    else if (o.indexOf("/") !== -1)
      c = "/", m = o.split("/");
    else if (o.indexOf("-") !== -1)
      c = "-", m = o.split("-");
    else
      return null;
    if (m.length !== 3) return null;
    const l = [];
    for (let w = 0; w < 3; w++) {
      const C = parseInt(m[w], 10);
      if (isNaN(C)) return null;
      l.push(C);
    }
    let _, v, E;
    c === "." ? (_ = l[0], v = l[1], E = l[2]) : c === "/" ? (v = l[0], _ = l[1], E = l[2]) : m[0].length === 4 ? (E = l[0], v = l[1], _ = l[2]) : (_ = l[0], v = l[1], E = l[2]), E < 100 && (E += E < 50 ? 2e3 : 1900);
    const A = new Date(E, v - 1, _);
    return A.getFullYear() !== E || A.getMonth() !== v - 1 || A.getDate() !== _ ? null : A;
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
  }, e.prototype._setHiddenRaw = function(o) {
    p.set.call(this._hidden, o);
  }, e.prototype._displayFormatted = function(o) {
    const c = this.dom.getAttribute(h) || "", m = K(this.dom);
    console.log("[ln-date] _displayFormatted:", {
      date: o,
      format: c,
      locale: m,
      dom: this.dom,
      closestLang: this.dom.closest("[lang]"),
      htmlLang: document.documentElement ? document.documentElement.lang : null,
      formatted: i(o, c, m)
    }), this._isFormatting = !0, this.dom.value = i(o, c, m), this._isFormatting = !1;
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return p.get.call(this._hidden);
    },
    set: function(o) {
      if (!o || o === "") {
        this._setHiddenRaw(""), p.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const c = r(o);
      c && (this._setHiddenRaw(o), p.set.call(this._picker, o), this._displayFormatted(c), this._lastISO = o, S(this.dom, "ln-date:change", {
        value: o,
        formatted: this.dom.value,
        date: c
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const o = this.value;
      return o ? r(o) : null;
    },
    set: function(o) {
      if (!o || !(o instanceof Date) || isNaN(o.getTime())) {
        this.value = "";
        return;
      }
      const c = o.getFullYear(), m = String(o.getMonth() + 1).padStart(2, "0"), l = String(o.getDate()).padStart(2, "0");
      this.value = c + "-" + m + "-" + l;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const o = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), o && (this.dom.value = o), S(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function a() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + h + "]");
      for (let c = 0; c < o.length; c++) {
        const m = o[c][d];
        if (m && m.value) {
          const l = r(m.value);
          l && m._displayFormatted(l);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, d, e, "ln-date"), a();
})();
(function() {
  const h = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0) return;
  const b = /* @__PURE__ */ new WeakMap(), p = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const r of p)
        r();
    }, history._lnNavPatched = !0;
  }
  function f(e) {
    if (!e.hasAttribute(h) || b.has(e)) return;
    const r = e.getAttribute(h);
    if (!r) return;
    const u = g(e, r);
    b.set(e, u), e[d] = u;
  }
  function g(e, r) {
    const u = e.hasAttribute("data-ln-nav-exact");
    let a = Array.from(e.querySelectorAll("a"));
    s(a, r, window.location.pathname, u);
    const o = function() {
      a = Array.from(e.querySelectorAll("a")), s(a, r, window.location.pathname, u);
    };
    window.addEventListener("popstate", o), p.push(o);
    const c = new MutationObserver(function(m) {
      for (const l of m)
        if (l.type === "childList") {
          for (const _ of l.addedNodes)
            if (_.nodeType === 1) {
              if (_.tagName === "A")
                a.push(_), s([_], r, window.location.pathname, u);
              else if (_.querySelectorAll) {
                const v = Array.from(_.querySelectorAll("a"));
                a = a.concat(v), s(v, r, window.location.pathname, u);
              }
            }
          for (const _ of l.removedNodes)
            if (_.nodeType === 1) {
              if (_.tagName === "A")
                a = a.filter(function(v) {
                  return v !== _;
                });
              else if (_.querySelectorAll) {
                const v = Array.from(_.querySelectorAll("a"));
                a = a.filter(function(E) {
                  return !v.includes(E);
                });
              }
            }
        }
    });
    return c.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: r,
      observer: c,
      updateHandler: o,
      destroy: function() {
        c.disconnect(), window.removeEventListener("popstate", o);
        const m = p.indexOf(o);
        m !== -1 && p.splice(m, 1), b.delete(e), delete e[d];
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
  function s(e, r, u, a) {
    const o = n(u);
    for (const c of e) {
      const m = c.getAttribute("href");
      if (!m) continue;
      const l = n(m);
      c.classList.remove(r);
      const _ = l === o, v = !a && l !== "/" && o.startsWith(l + "/");
      _ || v ? (c.classList.add(r), c.setAttribute("aria-current", "page")) : c.removeAttribute("aria-current");
    }
  }
  function t() {
    $(function() {
      new MutationObserver(function(r) {
        for (const u of r)
          if (u.type === "childList") {
            for (const a of u.addedNodes)
              if (a.nodeType === 1 && (a.hasAttribute && a.hasAttribute(h) && f(a), a.querySelectorAll))
                for (const o of a.querySelectorAll("[" + h + "]"))
                  f(o);
          } else u.type === "attributes" && u.target.hasAttribute && u.target.hasAttribute(h) && f(u.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[d] = f;
  function i() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      f(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function b() {
    const n = (location.hash || "").replace("#", ""), s = {};
    if (!n) return s;
    for (const t of n.split("&")) {
      const i = t.indexOf(":");
      i > 0 && (s[t.slice(0, i)] = t.slice(i + 1));
    }
    return s;
  }
  function p(n, s) {
    const t = (n.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (t) return t;
    if (n.tagName !== "A") return "";
    const i = n.getAttribute("href") || "";
    if (!i.startsWith("#")) return "";
    const e = i.slice(1);
    if (!e) return "";
    const r = e.split("&");
    if (s)
      for (const o of r) {
        const c = o.indexOf(":");
        if (c > 0 && o.slice(0, c).toLowerCase().trim() === s)
          return o.slice(c + 1).toLowerCase().trim();
      }
    const u = r[r.length - 1] || "", a = u.indexOf(":");
    return (a > 0 ? u.slice(a + 1) : u).toLowerCase().trim();
  }
  function f(n) {
    return this.dom = n, g.call(this), this;
  }
  function g() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const n = this.tabs.filter((i) => i.tagName === "A" && (i.getAttribute("href") || "").startsWith("#")), s = n.length > 0 && n.length === this.tabs.length;
    this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = s && !!this.nsKey, n.length > 0 && n.length !== this.tabs.length ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : s && !this.nsKey && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const i of this.tabs) {
      const e = p(i, this.nsKey);
      e ? this.mapTabs[e] = i : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', i);
    }
    for (const i of this.panels) {
      const e = (i.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      e && (this.mapPanels[e] = i);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const t = this;
    this._clickHandlers = [];
    for (const i of this.tabs) {
      if (i[d + "Trigger"]) continue;
      const e = function(r) {
        if (r.ctrlKey || r.metaKey || r.button === 1) return;
        const u = p(i, t.nsKey);
        if (u)
          if (i.tagName === "A" && r.preventDefault(), t.hashEnabled) {
            const a = b();
            a[t.nsKey] = u;
            const o = Object.keys(a).map(function(c) {
              return c + ":" + a[c];
            }).join("&");
            location.hash === "#" + o ? t.dom.setAttribute("data-ln-tabs-active", u) : location.hash = o;
          } else
            t.dom.setAttribute("data-ln-tabs-active", u);
      };
      i.addEventListener("click", e), i[d + "Trigger"] = e, t._clickHandlers.push({ el: i, handler: e });
    }
    if (this._hashHandler = function() {
      if (!t.hashEnabled) return;
      const i = b();
      t.dom.setAttribute("data-ln-tabs-active", t.nsKey in i ? i[t.nsKey] : t.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let i = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const e = wt("tabs", this.dom);
        e !== null && e in this.mapPanels && (i = e);
      }
      this.dom.setAttribute("data-ln-tabs-active", i);
    }
  }
  f.prototype._applyActive = function(n) {
    var s;
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
      const t = (s = this.mapPanels[n]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: n, tab: this.mapTabs[n], panel: this.mapPanels[n] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && at("tabs", this.dom, n);
  }, f.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const { el: n, handler: s } of this._clickHandlers)
        n.removeEventListener("click", s), delete n[d + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[d];
    }
  }, B(h, d, f, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(n) {
      const s = n.getAttribute("data-ln-tabs-active");
      n[d]._applyActive(s);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
  function b(g, n) {
    const s = document.querySelectorAll(
      '[data-ln-toggle-for="' + g.id + '"]'
    );
    for (const t of s)
      t.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function p(g) {
    if (this.dom = g, g.hasAttribute("data-ln-persist")) {
      const n = wt("toggle", g);
      n !== null && g.setAttribute(h, n);
    }
    return this.isOpen = g.getAttribute(h) === "open", this.isOpen && g.classList.add("open"), b(g, this.isOpen), this;
  }
  p.prototype.destroy = function() {
    this.dom[d] && (S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function f(g) {
    const n = g[d];
    if (!n) return;
    const t = g.getAttribute(h) === "open";
    if (t !== n.isOpen)
      if (t) {
        if (z(g, "ln-toggle:before-open", { target: g }).defaultPrevented) {
          g.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, g.classList.add("open"), b(g, !0), S(g, "ln-toggle:open", { target: g }), g.hasAttribute("data-ln-persist") && at("toggle", g, "open");
      } else {
        if (z(g, "ln-toggle:before-close", { target: g }).defaultPrevented) {
          g.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, g.classList.remove("open"), b(g, !1), S(g, "ln-toggle:close", { target: g }), g.hasAttribute("data-ln-persist") && at("toggle", g, "close");
      }
  }
  document.addEventListener("click", function(g) {
    if (g.ctrlKey || g.metaKey || g.button === 1) return;
    const n = g.target.closest("[data-ln-toggle-for]");
    if (n) {
      const s = n.getAttribute("data-ln-toggle-for"), t = document.getElementById(s);
      if (t && t[d]) {
        g.preventDefault();
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
  }), B(h, d, p, "ln-toggle", {
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
  function b(p) {
    return this.dom = p, this._onToggleOpen = function(f) {
      if (f.detail.target.closest("[data-ln-accordion]") !== p) return;
      const g = p.querySelectorAll("[data-ln-toggle]");
      for (const n of g)
        n !== f.detail.target && n.closest("[data-ln-accordion]") === p && n.getAttribute("data-ln-toggle") === "open" && n.setAttribute("data-ln-toggle", "close");
      S(p, "ln-accordion:change", { target: f.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, b, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", d = "lnDropdown";
  if (window[d] !== void 0) return;
  function b(p) {
    if (this.dom = p, this.toggleEl = p.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = p.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const g of this.toggleEl.children)
        g.setAttribute("role", "menuitem");
    const f = this;
    return this._onToggleOpen = function(g) {
      g.detail.target === f.toggleEl && (f.triggerBtn && f.triggerBtn.setAttribute("aria-expanded", "true"), f._teleportRestore = Gt(f.toggleEl), f.toggleEl.style.position = "fixed", f.toggleEl.style.right = "auto", f._reposition(), f._addOutsideClickListener(), f._addScrollRepositionListener(), f._addResizeCloseListener(), S(p, "ln-dropdown:open", { target: g.detail.target }));
    }, this._onToggleClose = function(g) {
      g.detail.target === f.toggleEl && (f.triggerBtn && f.triggerBtn.setAttribute("aria-expanded", "false"), f._removeOutsideClickListener(), f._removeScrollRepositionListener(), f._removeResizeCloseListener(), f.toggleEl.style.position = "", f.toggleEl.style.top = "", f.toggleEl.style.left = "", f.toggleEl.style.right = "", f.toggleEl.style.transform = "", f.toggleEl.style.margin = "", f._teleportRestore && (f._teleportRestore(), f._teleportRestore = null), S(p, "ln-dropdown:close", { target: g.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  b.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const p = this.triggerBtn.getBoundingClientRect(), f = Tt(this.toggleEl), g = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = At(p, f, "bottom-end", g);
    this.toggleEl.style.top = n.top + "px", this.toggleEl.style.left = n.left + "px";
  }, b.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const p = this;
    this._boundDocClick = function(f) {
      p.dom.contains(f.target) || p.toggleEl && p.toggleEl.contains(f.target) || p.toggleEl && p.toggleEl.getAttribute("data-ln-toggle") === "open" && p.toggleEl.setAttribute("data-ln-toggle", "close");
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
    this.dom[d] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, b, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", d = "lnPopover", b = "data-ln-popover-for", p = "data-ln-popover-position";
  if (window[d] !== void 0) return;
  const f = [];
  let g = null;
  function n() {
    g || (g = function(e) {
      if (e.key !== "Escape" || f.length === 0) return;
      f[f.length - 1].close();
    }, document.addEventListener("keydown", g));
  }
  function s() {
    f.length > 0 || g && (document.removeEventListener("keydown", g), g = null);
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
    this.isOpen = !0, e && (this.trigger = e), this._previousFocus = document.activeElement, this._teleportRestore = Gt(this.dom);
    const r = Tt(this.dom);
    if (this.trigger) {
      const c = this.trigger.getBoundingClientRect(), m = this.dom.getAttribute(p) || "bottom", l = At(c, r, m, 8);
      this.dom.style.top = l.top + "px", this.dom.style.left = l.left + "px", this.dom.setAttribute("data-ln-popover-placement", l.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const u = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), a = Array.prototype.find.call(u, gt);
    a ? a.focus() : this.dom.focus();
    const o = this;
    this._boundDocClick = function(c) {
      o.dom.contains(c.target) || o.trigger && o.trigger.contains(c.target) || o.close();
    }, o._docClickTimeout = setTimeout(function() {
      o._docClickTimeout = null, document.addEventListener("click", o._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!o.trigger) return;
      const c = o.trigger.getBoundingClientRect(), m = Tt(o.dom), l = o.dom.getAttribute(p) || "bottom", _ = At(c, m, l, 8);
      o.dom.style.top = _.top + "px", o.dom.style.left = _.left + "px", o.dom.setAttribute("data-ln-popover-placement", _.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), f.push(this), n(), S(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const e = f.indexOf(this);
    e !== -1 && f.splice(e, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, S(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[d] && (this.isOpen && this._applyClose(), delete this.dom[d], S(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function i(e) {
    this.dom = e;
    const r = e.getAttribute(b);
    return e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-controls", r), this._onClick = function(u) {
      if (u.ctrlKey || u.metaKey || u.button === 1) return;
      u.preventDefault();
      const a = document.getElementById(r);
      !a || !a[d] || a[d].toggle(e);
    }, e.addEventListener("click", this._onClick), this;
  }
  i.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[d + "Trigger"];
  }, B(h, d, t, "ln-popover", {
    onAttributeChange: function(e) {
      const r = e[d];
      if (!r) return;
      const a = e.getAttribute(h) === "open";
      if (a !== r.isOpen)
        if (a) {
          if (z(e, "ln-popover:before-open", {
            popoverId: e.id,
            target: e,
            trigger: r.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "closed");
            return;
          }
          r._applyOpen(r.trigger);
        } else {
          if (z(e, "ln-popover:before-close", {
            popoverId: e.id,
            target: e,
            trigger: r.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "open");
            return;
          }
          r._applyClose();
        }
    }
  }), B(b, d + "Trigger", i, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", d = "data-ln-tooltip", b = "data-ln-tooltip-position", p = "lnTooltipEnhance", f = "ln-tooltip-portal";
  if (window[p] !== void 0) return;
  let g = 0, n = null, s = null, t = null, i = null, e = null;
  function r() {
    return n && n.parentNode || (n = document.getElementById(f), n || (n = document.createElement("div"), n.id = f, document.body.appendChild(n))), n;
  }
  function u() {
    e || (e = function(l) {
      l.key === "Escape" && c();
    }, document.addEventListener("keydown", e));
  }
  function a() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function o(l) {
    if (t === l) return;
    c();
    const _ = l.getAttribute(d) || l.getAttribute("title");
    if (!_) return;
    r(), l.hasAttribute("title") && (i = l.getAttribute("title"), l.removeAttribute("title"));
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = _, l[p + "Uid"] || (g += 1, l[p + "Uid"] = "ln-tooltip-" + g), v.id = l[p + "Uid"], n.appendChild(v);
    const E = v.offsetWidth, A = v.offsetHeight, w = l.getBoundingClientRect(), C = l.getAttribute(b) || "top", D = At(w, { width: E, height: A }, C, 6);
    v.style.top = D.top + "px", v.style.left = D.left + "px", v.setAttribute("data-ln-tooltip-placement", D.placement), l.setAttribute("aria-describedby", v.id), s = v, t = l, u();
  }
  function c() {
    if (!s) {
      a();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), i !== null && t.setAttribute("title", i)), i = null, s.parentNode && s.parentNode.removeChild(s), s = null, t = null, a();
  }
  function m(l) {
    return this.dom = l, l.hasAttribute("data-ln-tooltip-enhanced") || (l.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      o(l);
    }, this._onLeave = function() {
      t === l && c();
    }, this._onFocus = function() {
      o(l);
    }, this._onBlur = function() {
      t === l && c();
    }, l.addEventListener("mouseenter", this._onEnter), l.addEventListener("mouseleave", this._onLeave), l.addEventListener("focus", this._onFocus, !0), l.addEventListener("blur", this._onBlur, !0), this;
  }
  m.prototype.destroy = function() {
    const l = this.dom;
    l.removeEventListener("mouseenter", this._onEnter), l.removeEventListener("mouseleave", this._onLeave), l.removeEventListener("focus", this._onFocus, !0), l.removeEventListener("blur", this._onBlur, !0), t === l && c(), this._addedEnhancedAttr && l.removeAttribute("data-ln-tooltip-enhanced"), delete l[p], delete l[p + "Uid"], S(l, "ln-tooltip:destroyed", { trigger: l });
  }, B(
    "[" + h + "], [" + d + "][title]",
    p,
    m,
    "ln-tooltip"
  );
})();
const Ee = `<li class="ln-toast__item">\r
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
  const h = "data-ln-toast", d = "lnToast", b = "ln-toast-item", p = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, f = { success: "success", error: "error", warn: "warning", info: "info" }, g = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function n() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const l = document.createElement("template");
    l.setAttribute("data-ln-template", "ln-toast-item"), l.innerHTML = Ee, document.body.appendChild(l);
  }
  function s(l) {
    if (!l || l.nodeType !== 1) return;
    const _ = Array.from(l.querySelectorAll("[" + h + "]"));
    l.hasAttribute && l.hasAttribute(h) && _.push(l);
    for (const v of _)
      v[d] || new t(v);
  }
  function t(l) {
    this.dom = l, l[d] = this, this.timeoutDefault = parseInt(l.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(l.getAttribute("data-ln-toast-max") || "5", 10);
    for (const _ of Array.from(l.querySelectorAll("[data-ln-toast-item]")))
      o(_, l);
    return this;
  }
  t.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const l of Array.from(this.dom.children))
        u(l);
      delete this.dom[d];
    }
  };
  function i(l, _) {
    const v = ((l.type || "info") + "").toLowerCase(), E = lt(_, b, "ln-toast");
    if (!E)
      return console.warn('[ln-toast] Template "' + b + '" not found'), null;
    const A = E.firstElementChild;
    if (!A) return null;
    const w = !!(l.message || l.data && l.data.errors);
    X(A, {
      title: l.title || g[v] || g.info,
      role: v === "error" ? "alert" : "status",
      ariaLive: v === "error" ? "assertive" : "polite",
      hasBody: w
    });
    const C = A.querySelector(".ln-toast__card");
    C && C.classList.add(f[v] || "info");
    const D = A.querySelector(".ln-toast__side");
    if (D) {
      const O = D.querySelector("use");
      O && O.setAttribute("href", "#ln-" + (p[v] || p.info));
    }
    const R = A.querySelector(".ln-toast__body");
    R && w && e(R, l);
    const x = A.querySelector(".ln-toast__close");
    return x && x.addEventListener("click", function() {
      u(A);
    }), A;
  }
  function e(l, _) {
    if (_.message)
      if (Array.isArray(_.message)) {
        const v = document.createElement("ul");
        for (const E of _.message) {
          const A = document.createElement("li");
          A.textContent = E, v.appendChild(A);
        }
        l.appendChild(v);
      } else {
        const v = document.createElement("p");
        v.textContent = _.message, l.appendChild(v);
      }
    if (_.data && _.data.errors) {
      const v = document.createElement("ul");
      for (const E of Object.values(_.data.errors).flat()) {
        const A = document.createElement("li");
        A.textContent = E, v.appendChild(A);
      }
      l.appendChild(v);
    }
  }
  function r(l, _) {
    for (; l.dom.children.length >= l.max; ) l.dom.removeChild(l.dom.firstElementChild);
    l.dom.appendChild(_), requestAnimationFrame(() => _.classList.add("ln-toast__item--in"));
  }
  function u(l) {
    !l || !l.parentNode || (clearTimeout(l._timer), l.classList.remove("ln-toast__item--in"), l.classList.add("ln-toast__item--out"), setTimeout(() => {
      l.parentNode && l.parentNode.removeChild(l);
    }, 200));
  }
  function a(l) {
    let _ = l && l.container;
    return typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), _ || null;
  }
  function o(l, _) {
    const v = ((l.getAttribute("data-type") || "info") + "").toLowerCase(), E = l.getAttribute("data-title"), A = (l.innerText || l.textContent || "").trim(), w = i({
      type: v,
      title: E,
      message: A || void 0
    }, _);
    w && (l.parentNode && l.parentNode.replaceChild(w, l), requestAnimationFrame(() => w.classList.add("ln-toast__item--in")));
  }
  function c(l) {
    const _ = l.detail || {}, v = a(_);
    if (!v) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const E = v[d] || new t(v), A = i(_, v);
    if (!A) return;
    const w = Number.isFinite(_.timeout) ? _.timeout : E.timeoutDefault;
    r(E, A), w > 0 && (A._timer = setTimeout(() => u(A), w));
  }
  function m(l) {
    const _ = l && l.detail || {};
    if (_.container) {
      const v = a(_);
      if (v)
        for (const E of Array.from(v.children)) u(E);
    } else {
      const v = document.querySelectorAll("[" + h + "]");
      for (const E of Array.from(v))
        for (const A of Array.from(E.children)) u(A);
    }
  }
  $(function() {
    n(), window.addEventListener("ln-toast:enqueue", c), window.addEventListener("ln-toast:clear", m), new MutationObserver(function(_) {
      for (const v of _) {
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
  const h = "data-ln-upload", d = "lnUpload", b = "data-ln-upload-dict", p = "data-ln-upload-accept", f = "data-ln-upload-context", g = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function n() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const o = document.createElement("div");
    o.innerHTML = g;
    const c = o.firstElementChild;
    c && document.body.appendChild(c);
  }
  if (window[d] !== void 0) return;
  function s(o) {
    if (o === 0) return "0 B";
    const c = 1024, m = ["B", "KB", "MB", "GB"], l = Math.floor(Math.log(o) / Math.log(c));
    return parseFloat((o / Math.pow(c, l)).toFixed(1)) + " " + m[l];
  }
  function t(o) {
    return o.split(".").pop().toLowerCase();
  }
  function i(o) {
    return o === "docx" && (o = "doc"), ["pdf", "doc", "epub"].includes(o) ? "lnc-file-" + o : "ln-file";
  }
  function e(o, c) {
    if (!c) return !0;
    const m = "." + t(o.name);
    return c.split(",").map(function(_) {
      return _.trim().toLowerCase();
    }).includes(m.toLowerCase());
  }
  function r(o) {
    if (o.hasAttribute("data-ln-upload-initialized")) return;
    o.setAttribute("data-ln-upload-initialized", "true"), n();
    const c = oe(o, b), m = o.querySelector(".ln-upload__zone"), l = o.querySelector(".ln-upload__list"), _ = o.getAttribute(p) || "";
    if (!m || !l) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", o);
      return;
    }
    let v = o.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), _ && (v.accept = _.split(",").map(function(q) {
      return q = q.trim(), q.startsWith(".") ? q : "." + q;
    }).join(",")), o.appendChild(v));
    const E = o.getAttribute(h) || "/files/upload", A = o.getAttribute(f) || "", w = o.getAttribute("data-ln-upload-delete") || (E.includes("/upload") ? E.replace(/\/upload\/?$/, "/{id}") : E + "/{id}"), C = /* @__PURE__ */ new Map();
    let D = 0;
    function R() {
      const q = document.querySelector('meta[name="csrf-token"]');
      return q ? q.getAttribute("content") : "";
    }
    function x(q) {
      if (!e(q, _)) {
        const T = c["invalid-type"];
        S(o, "ln-upload:invalid", {
          file: q,
          message: T
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: c["invalid-title"] || "Invalid File",
          message: T || c["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const H = "file-" + ++D, P = t(q.name), ht = i(P), nt = lt(o, "ln-upload-item", "ln-upload");
      if (!nt) return;
      const G = nt.firstElementChild;
      if (!G) return;
      G.setAttribute("data-file-id", H), X(G, {
        name: q.name,
        sizeText: "0%",
        iconHref: "#" + ht,
        removeLabel: c.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const ft = G.querySelector(".ln-upload__progress-bar"), it = G.querySelector('[data-ln-upload-action="remove"]');
      it && (it.disabled = !0), l.appendChild(G);
      const st = new FormData();
      st.append("file", q);
      const yt = /* @__PURE__ */ new Set();
      o.querySelectorAll("input, select, textarea").forEach(function(T) {
        if (T.name && T.name !== "file_ids[]" && T.type !== "file") {
          if ((T.type === "checkbox" || T.type === "radio") && !T.checked)
            return;
          st.append(T.name, T.value), yt.add(T.name);
        }
      }), !yt.has("context") && A && st.append("context", A);
      const y = new XMLHttpRequest();
      y.upload.addEventListener("progress", function(T) {
        if (T.lengthComputable) {
          const k = Math.round(T.loaded / T.total * 100);
          ft.style.width = k + "%", X(G, { sizeText: k + "%" });
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
          }), O(), S(o, "ln-upload:uploaded", {
            localId: H,
            serverId: T.id,
            name: T.name
          });
        } else {
          let T = c["upload-failed"] || "Upload failed";
          try {
            T = JSON.parse(y.responseText).message || T;
          } catch {
          }
          L(T);
        }
      }), y.addEventListener("error", function() {
        L(c["network-error"] || "Network error");
      });
      function L(T) {
        ft && (ft.style.width = "100%"), X(G, { sizeText: c.error || "Error", uploading: !1, error: !0 }), it && (it.disabled = !1), S(o, "ln-upload:error", {
          file: q,
          message: T
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: c["error-title"] || "Upload Error",
          message: T || c["upload-failed"] || "Failed to upload file"
        });
      }
      y.open("POST", E), y.setRequestHeader("X-CSRF-TOKEN", R()), y.setRequestHeader("Accept", "application/json"), y.send(st);
    }
    function O() {
      for (const q of o.querySelectorAll('input[name="file_ids[]"]'))
        q.remove();
      for (const [, q] of C) {
        const H = document.createElement("input");
        H.type = "hidden", H.name = "file_ids[]", H.value = q.serverId, o.appendChild(H);
      }
    }
    function F(q) {
      const H = C.get(q), P = l.querySelector('[data-file-id="' + q + '"]');
      if (!H || !H.serverId) {
        P && P.remove(), C.delete(q), O();
        return;
      }
      P && X(P, { deleting: !0 });
      const ht = w.replace("{id}", H.serverId);
      fetch(ht, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": R(),
          Accept: "application/json"
        }
      }).then(function(nt) {
        nt.status === 200 ? (P && P.remove(), C.delete(q), O(), S(o, "ln-upload:removed", {
          localId: q,
          serverId: H.serverId
        })) : (P && X(P, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: c["delete-title"] || "Error",
          message: c["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(nt) {
        console.warn("[ln-upload] Delete error:", nt), P && X(P, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: c["network-error"] || "Network error",
          message: c["connection-error"] || "Could not connect to server"
        });
      });
    }
    function U(q) {
      for (const H of q)
        x(H);
      v.value = "";
    }
    const Q = function() {
      v.click();
    }, Z = function() {
      U(this.files);
    }, vt = function(q) {
      q.preventDefault(), q.stopPropagation(), m.classList.add("ln-upload__zone--dragover");
    }, ct = function(q) {
      q.preventDefault(), q.stopPropagation(), m.classList.add("ln-upload__zone--dragover");
    }, Y = function(q) {
      q.preventDefault(), q.stopPropagation(), m.classList.remove("ln-upload__zone--dragover");
    }, dt = function(q) {
      q.preventDefault(), q.stopPropagation(), m.classList.remove("ln-upload__zone--dragover"), U(q.dataTransfer.files);
    }, ut = function(q) {
      const H = q.target.closest('[data-ln-upload-action="remove"]');
      if (!H || !l.contains(H) || H.disabled) return;
      const P = H.closest(".ln-upload__item");
      P && F(P.getAttribute("data-file-id"));
    };
    m.addEventListener("click", Q), v.addEventListener("change", Z), m.addEventListener("dragenter", vt), m.addEventListener("dragover", ct), m.addEventListener("dragleave", Y), m.addEventListener("drop", dt), l.addEventListener("click", ut), o.lnUploadAPI = {
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
        C.clear(), l.innerHTML = "", O(), S(o, "ln-upload:cleared", {});
      },
      destroy: function() {
        m.removeEventListener("click", Q), v.removeEventListener("change", Z), m.removeEventListener("dragenter", vt), m.removeEventListener("dragover", ct), m.removeEventListener("dragleave", Y), m.removeEventListener("drop", dt), l.removeEventListener("click", ut), C.clear(), l.innerHTML = "", O(), o.removeAttribute("data-ln-upload-initialized"), delete o.lnUploadAPI;
      }
    };
  }
  function u() {
    for (const o of document.querySelectorAll("[" + h + "]"))
      r(o);
  }
  function a() {
    $(function() {
      new MutationObserver(function(c) {
        for (const m of c)
          if (m.type === "childList") {
            for (const l of m.addedNodes)
              if (l.nodeType === 1) {
                l.hasAttribute(h) && r(l);
                for (const _ of l.querySelectorAll("[" + h + "]"))
                  r(_);
              }
          } else m.type === "attributes" && m.target.hasAttribute(h) && r(m.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[d] = {
    init: r,
    initAll: u
  }, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function d(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function b(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !d(s)) return;
    s.target = "_blank";
    const t = (s.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), s.rel = t.join(" ");
    const i = document.createElement("span");
    i.className = "sr-only", i.textContent = "(opens in new tab)", s.appendChild(i), s.setAttribute("data-ln-external-link", "processed"), S(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function p(s) {
    s = s || document.body;
    for (const t of s.querySelectorAll("a, area"))
      b(t);
  }
  function f() {
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
  function g() {
    $(function() {
      new MutationObserver(function(t) {
        for (const i of t) {
          if (i.type === "childList") {
            for (const e of i.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && b(e), e.querySelectorAll))
                for (const r of e.querySelectorAll("a, area"))
                  b(r);
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
    f(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      p();
    }) : p();
  }
  window[h] = {
    process: p
  }, n();
})();
(function() {
  const h = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  let b = null;
  function p() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function f(l) {
    b && (b.textContent = l, b.classList.add("ln-link-status--visible"));
  }
  function g() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function n(l, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const v = l.querySelector("a");
    if (!v) return;
    const E = v.getAttribute("href");
    if (!E) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(E, "_blank");
      return;
    }
    z(l, "ln-link:navigate", { target: l, href: E, link: v }).defaultPrevented || v.click();
  }
  function s(l) {
    const _ = l.querySelector("a");
    if (!_) return;
    const v = _.getAttribute("href");
    v && f(v);
  }
  function t() {
    g();
  }
  function i(l) {
    l[d + "Row"] || (l[d + "Row"] = !0, l.querySelector("a") && (l._lnLinkClick = function(_) {
      n(l, _);
    }, l._lnLinkEnter = function() {
      s(l);
    }, l.addEventListener("click", l._lnLinkClick), l.addEventListener("mouseenter", l._lnLinkEnter), l.addEventListener("mouseleave", t)));
  }
  function e(l) {
    l[d + "Row"] && (l._lnLinkClick && l.removeEventListener("click", l._lnLinkClick), l._lnLinkEnter && l.removeEventListener("mouseenter", l._lnLinkEnter), l.removeEventListener("mouseleave", t), delete l._lnLinkClick, delete l._lnLinkEnter, delete l[d + "Row"]);
  }
  function r(l) {
    if (!l[d + "Init"]) return;
    const _ = l.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const v = _ === "TABLE" && l.querySelector("tbody") || l;
      for (const E of v.querySelectorAll("tr"))
        e(E);
    } else
      e(l);
    delete l[d + "Init"];
  }
  function u(l) {
    if (l[d + "Init"]) return;
    l[d + "Init"] = !0;
    const _ = l.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const v = _ === "TABLE" && l.querySelector("tbody") || l;
      for (const E of v.querySelectorAll("tr"))
        i(E);
    } else
      i(l);
  }
  function a(l) {
    l.hasAttribute && l.hasAttribute(h) && u(l);
    const _ = l.querySelectorAll ? l.querySelectorAll("[" + h + "]") : [];
    for (const v of _)
      u(v);
  }
  function o() {
    $(function() {
      new MutationObserver(function(_) {
        for (const v of _)
          if (v.type === "childList")
            for (const E of v.addedNodes)
              E.nodeType === 1 && (a(E), E.tagName === "TR" && E.closest("[" + h + "]") && i(E));
          else v.type === "attributes" && a(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function c(l) {
    a(l);
  }
  window[d] = { init: c, destroy: r };
  function m() {
    p(), o(), c(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", m) : m();
})();
(function() {
  const h = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0) return;
  function b(i) {
    p(i);
  }
  function p(i) {
    const e = Array.from(i.querySelectorAll(h));
    for (const r of e)
      r[d] || (r[d] = new f(r));
    i.hasAttribute && i.hasAttribute("data-ln-progress") && !i[d] && (i[d] = new f(i));
  }
  function f(i) {
    return this.dom = i, this._attrObserver = null, this._parentObserver = null, t.call(this), n.call(this), s.call(this), this;
  }
  f.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[d]);
  };
  function g() {
    $(function() {
      new MutationObserver(function(e) {
        for (const r of e)
          if (r.type === "childList")
            for (const u of r.addedNodes)
              u.nodeType === 1 && p(u);
          else r.type === "attributes" && p(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  g();
  function n() {
    const i = this, e = new MutationObserver(function(r) {
      for (const u of r)
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && t.call(i);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function s() {
    const i = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const r = new MutationObserver(function(u) {
      for (const a of u)
        a.attributeName === "data-ln-progress-max" && t.call(i);
    });
    r.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = r;
  }
  function t() {
    const i = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, u = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let a = u > 0 ? i / u * 100 : 0;
    a < 0 && (a = 0), a > 100 && (a = 100), this.dom.style.width = a + "%";
    const o = Math.max(0, Math.min(i, u));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(u)), this.dom.setAttribute("aria-valuenow", String(o)), S(this.dom, "ln-progress:change", { target: this.dom, value: i, max: u, percentage: a });
  }
  window[d] = b, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-filter", d = "lnFilter", b = "data-ln-filter-initialized", p = "data-ln-filter-key", f = "data-ln-filter-value", g = "data-ln-filter-hide", n = "data-ln-filter-reset", s = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[d] !== void 0) return;
  function i(o) {
    return o.hasAttribute(n) || o.getAttribute(f) === "";
  }
  function e(o) {
    let c = o._filterKey;
    const m = [];
    for (let l = 0; l < o.inputs.length; l++) {
      const _ = o.inputs[l];
      if (_.checked && !i(_)) {
        const v = _.getAttribute(f);
        v && m.push(v);
      }
    }
    return { key: c, values: m };
  }
  function r(o, c) {
    if (o.length !== c.length) return !0;
    for (let m = 0; m < o.length; m++) if (o[m] !== c[m]) return !0;
    return !1;
  }
  function u(o) {
    const c = o.dom, m = o.colIndex, l = c.querySelector("template");
    if (!l || m === null) return;
    const _ = document.getElementById(o.targetId);
    if (!_) return;
    const v = _.tagName === "TABLE" ? _ : _.querySelector("table");
    if (!v || _.hasAttribute("data-ln-table")) return;
    const E = {}, A = [], w = v.tBodies;
    for (let R = 0; R < w.length; R++) {
      const x = w[R].rows;
      for (let O = 0; O < x.length; O++) {
        const F = x[O].cells[m], U = F ? F.textContent.trim() : "";
        U && !E[U] && (E[U] = !0, A.push(U));
      }
    }
    A.sort(function(R, x) {
      return R.localeCompare(x);
    });
    const C = c.querySelector("[" + p + "]"), D = C ? C.getAttribute(p) : c.getAttribute("data-ln-filter-key") || "col" + m;
    for (let R = 0; R < A.length; R++) {
      const x = l.content.cloneNode(!0), O = x.querySelector("input");
      O && (O.setAttribute(p, D), O.setAttribute(f, A[R]), bt(x, { text: A[R] }), c.appendChild(x));
    }
  }
  function a(o) {
    if (o.hasAttribute(b)) return this;
    this.dom = o, this.targetId = o.getAttribute(h);
    const c = o.getAttribute(s);
    this.colIndex = c !== null ? parseInt(c, 10) : null, u(this), this.inputs = Array.from(o.querySelectorAll("[" + p + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(p) : null, this._lastSnapshot = null;
    const m = this, l = ce(
      function() {
        m._render();
      },
      function() {
        m._afterRender();
      }
    );
    this._queueRender = l, this._attachHandlers();
    let _ = !1;
    if (o.hasAttribute("data-ln-persist")) {
      const v = wt("filter", o);
      if (v && v.key && Array.isArray(v.values) && v.values.length > 0) {
        for (let E = 0; E < this.inputs.length; E++) {
          const A = this.inputs[E];
          i(A) ? A.checked = !1 : A.getAttribute(p) === v.key && v.values.indexOf(A.getAttribute(f)) !== -1 ? A.checked = !0 : A.checked = !1;
        }
        l(), _ = !0;
      }
    }
    if (!_) {
      for (let v = 0; v < this.inputs.length; v++)
        if (this.inputs[v].checked && !i(this.inputs[v])) {
          l();
          break;
        }
    }
    return o.setAttribute(b, ""), this;
  }
  a.prototype._attachHandlers = function() {
    const o = this;
    this.inputs.forEach(function(c) {
      c[d + "Bound"] || (c[d + "Bound"] = !0, c._lnFilterChange = function() {
        if (i(c)) {
          for (let m = 0; m < o.inputs.length; m++)
            i(o.inputs[m]) || (o.inputs[m].checked = !1);
          c.checked = !0, o._queueRender();
          return;
        }
        if (c.checked) {
          for (let l = 0; l < o.inputs.length; l++)
            i(o.inputs[l]) && (o.inputs[l].checked = !1);
          let m = !1;
          for (let l = 0; l < o.inputs.length; l++)
            if (i(o.inputs[l])) {
              m = !0;
              break;
            }
          if (m) {
            let l = !0;
            for (let _ = 0; _ < o.inputs.length; _++)
              if (!i(o.inputs[_]) && !o.inputs[_].checked) {
                l = !1;
                break;
              }
            if (l)
              for (let _ = 0; _ < o.inputs.length; _++)
                i(o.inputs[_]) ? o.inputs[_].checked = !0 : o.inputs[_].checked = !1;
          }
        } else {
          let m = !1;
          for (let l = 0; l < o.inputs.length; l++)
            if (!i(o.inputs[l]) && o.inputs[l].checked) {
              m = !0;
              break;
            }
          if (!m)
            for (let l = 0; l < o.inputs.length; l++)
              i(o.inputs[l]) && (o.inputs[l].checked = !0);
        }
        o._queueRender();
      }, c.addEventListener("change", c._lnFilterChange));
    });
  }, a.prototype._render = function() {
    const o = this, c = e(this), m = c.key === null || c.values.length === 0, l = [];
    for (let _ = 0; _ < c.values.length; _++)
      l.push(c.values[_].toLowerCase());
    if (o.colIndex !== null)
      o._filterTableRows(c);
    else {
      const _ = document.getElementById(o.targetId);
      if (!_) return;
      const v = _.children;
      for (let E = 0; E < v.length; E++) {
        const A = v[E];
        if (m) {
          A.removeAttribute(g);
          continue;
        }
        const w = A.getAttribute("data-" + c.key);
        A.removeAttribute(g), w !== null && l.indexOf(w.toLowerCase()) === -1 && A.setAttribute(g, "true");
      }
    }
  }, a.prototype._afterRender = function() {
    const o = e(this), c = this._lastSnapshot;
    if (!c || c.key !== o.key || r(c.values, o.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: o.key,
        values: o.values.slice()
      });
      const l = c && c.values.length > 0, _ = o.values.length === 0;
      l && _ && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: o.key, values: o.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (o.key && o.values.length > 0 ? at("filter", this.dom, { key: o.key, values: o.values.slice() }) : at("filter", this.dom, null));
  }, a.prototype._dispatchOnBoth = function(o, c) {
    S(this.dom, o, c);
    const m = document.getElementById(this.targetId);
    m && m !== this.dom && S(m, o, c);
  }, a.prototype._filterTableRows = function(o) {
    const c = document.getElementById(this.targetId);
    if (!c) return;
    const m = c.tagName === "TABLE" ? c : c.querySelector("table");
    if (!m || c.hasAttribute("data-ln-table")) return;
    const l = o.key || this._filterKey, _ = o.values;
    t.has(m) || t.set(m, {});
    const v = t.get(m);
    if (l && _.length > 0) {
      const C = [];
      for (let D = 0; D < _.length; D++)
        C.push(_[D].toLowerCase());
      v[l] = { col: this.colIndex, values: C };
    } else l && delete v[l];
    const E = Object.keys(v), A = E.length > 0, w = m.tBodies;
    for (let C = 0; C < w.length; C++) {
      const D = w[C].rows;
      for (let R = 0; R < D.length; R++) {
        const x = D[R];
        if (!A) {
          x.removeAttribute(g);
          continue;
        }
        let O = !0;
        for (let F = 0; F < E.length; F++) {
          const U = v[E[F]], Q = x.cells[U.col], Z = Q ? Q.textContent.trim().toLowerCase() : "";
          if (U.values.indexOf(Z) === -1) {
            O = !1;
            break;
          }
        }
        O ? x.removeAttribute(g) : x.setAttribute(g, "true");
      }
    }
  }, a.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.colIndex !== null) {
        const o = document.getElementById(this.targetId);
        if (o) {
          const c = o.tagName === "TABLE" ? o : o.querySelector("table");
          if (c && t.has(c)) {
            const m = t.get(c), l = this._filterKey;
            l && m[l] && delete m[l], Object.keys(m).length === 0 && t.delete(c);
          }
        }
      }
      this.inputs.forEach(function(o) {
        o._lnFilterChange && (o.removeEventListener("change", o._lnFilterChange), delete o._lnFilterChange), delete o[d + "Bound"];
      }), this.dom.removeAttribute(b), delete this.dom[d];
    }
  }, B(h, d, a, "ln-filter");
})();
(function() {
  const h = "data-ln-search", d = "lnSearch", b = "data-ln-search-initialized", p = "data-ln-search-hide";
  if (window[d] !== void 0) return;
  function g(n) {
    if (n.hasAttribute(b)) return this;
    this.dom = n, this.targetId = n.getAttribute(h);
    const s = n.tagName;
    if (this.input = s === "INPUT" || s === "TEXTAREA" ? n : n.querySelector('[name="search"]') || n.querySelector('input[type="search"]') || n.querySelector('input[type="text"]'), this.itemsSelector = n.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return n.setAttribute(b, ""), this;
  }
  g.prototype._attachHandler = function() {
    if (!this.input) return;
    const n = this, s = this.dom === this.input ? this.input.parentElement : this.dom;
    this._clearBtn = s ? s.querySelector("[data-ln-search-clear]") : null, this._clearBtn && (this._onClear = function() {
      n.input.value = "", n._search(""), n.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(n._debounceTimer), n._debounceTimer = setTimeout(function() {
        n._search(n.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, g.prototype._search = function(n) {
    const s = document.getElementById(this.targetId);
    if (!s || z(s, "ln-search:change", { term: n, targetId: this.targetId }).defaultPrevented) return;
    const i = this.itemsSelector ? s.querySelectorAll(this.itemsSelector) : s.children;
    for (let e = 0; e < i.length; e++) {
      const r = i[e];
      r.removeAttribute(p), n && !r.textContent.replace(/\s+/g, " ").toLowerCase().includes(n) && r.setAttribute(p, "true");
    }
  }, g.prototype.destroy = function() {
    this.dom[d] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(b), delete this.dom[d]);
  }, B(h, d, g, "ln-search");
})();
(function() {
  const h = "lnTableSort", d = "data-ln-table-sort", b = "data-ln-table-col-sort";
  if (window[h] !== void 0) return;
  function p(s) {
    f(s);
  }
  function f(s) {
    const t = Array.from(s.querySelectorAll("table"));
    s.tagName === "TABLE" && t.push(s), t.forEach(function(i) {
      if (i[h]) return;
      const e = Array.from(i.querySelectorAll("th[" + d + "]"));
      e.length && (i[h] = new g(i, e));
    });
  }
  function g(s, t) {
    this.table = s, this.ths = t, this._col = -1, this._dir = null;
    const i = this;
    t.forEach(function(r, u) {
      if (r[h + "Bound"]) return;
      r[h + "Bound"] = !0;
      const a = r.querySelector("[" + b + "]");
      a && (a._lnSortClick = function() {
        i._handleClick(u, r);
      }, a.addEventListener("click", a._lnSortClick));
    });
    const e = s.closest("[data-ln-table][data-ln-persist]");
    if (e) {
      const r = wt("table-sort", e);
      r && r.dir && r.col >= 0 && r.col < t.length && (this._handleClick(r.col, t[r.col]), r.dir === "desc" && this._handleClick(r.col, t[r.col]));
    }
    return this;
  }
  g.prototype._handleClick = function(s, t) {
    let i;
    this._col !== s ? i = "asc" : this._dir === "asc" ? i = "desc" : this._dir === "desc" ? i = null : i = "asc", this.ths.forEach(function(r) {
      r.classList.remove("ln-sort-asc", "ln-sort-desc");
    }), i === null ? (this._col = -1, this._dir = null) : (this._col = s, this._dir = i, t.classList.add(i === "asc" ? "ln-sort-asc" : "ln-sort-desc")), S(this.table, "ln-table:sort", {
      column: s,
      sortType: t.getAttribute(d),
      direction: i
    });
    const e = this.table.closest("[data-ln-table][data-ln-persist]");
    e && (i === null ? at("table-sort", e, null) : at("table-sort", e, { col: s, dir: i }));
  }, g.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(s) {
      const t = s.querySelector("[" + b + "]");
      t && t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete s[h + "Bound"];
    }), delete this.table[h]);
  };
  function n() {
    $(function() {
      new MutationObserver(function(t) {
        t.forEach(function(i) {
          i.type === "childList" ? i.addedNodes.forEach(function(e) {
            e.nodeType === 1 && f(e);
          }) : i.type === "attributes" && f(i.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table-sort");
  }
  window[h] = p, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "data-ln-table", d = "lnTable", b = "data-ln-table-sort", p = "data-ln-table-empty";
  if (window[d] !== void 0) return;
  const n = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null, s = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function t(r) {
    return s ? s.format(r) : String(r);
  }
  function i(r) {
    let u = r.parentElement;
    for (; u && u !== document.body && u !== document.documentElement; ) {
      const o = getComputedStyle(u).overflowY;
      if (o === "auto" || o === "scroll") return u;
      u = u.parentElement;
    }
    return null;
  }
  function e(r) {
    this.dom = r, this.table = r.querySelector("table"), this.tbody = r.querySelector("[data-ln-table-body]") || r.querySelector("tbody"), this.thead = r.querySelector("thead");
    const u = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = u ? Array.from(u.querySelectorAll("th")) : [], this.isDataDriven = r.hasAttribute("data-ln-table-source"), this.name = r.getAttribute(h) || "", this.source = r.getAttribute("data-ln-table-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const a = this;
    if (this._onColumnFilter = function(o) {
      const c = o.detail.key;
      let m = null;
      for (let v = 0; v < a.ths.length; v++)
        if (a.ths[v].getAttribute("data-ln-table-filter-col") === c) {
          m = a.ths[v];
          break;
        }
      if (!m) return;
      const l = o.detail.values, _ = m.querySelector("[data-ln-table-col-filter]");
      if (_ && _.classList.toggle("ln-filter-active", !!(l && l.length > 0)), a.isDataDriven)
        !l || l.length === 0 ? delete a.currentFilters[c] : a.currentFilters[c] = l, a._requestData();
      else {
        if (!l || l.length === 0)
          delete a._columnFilters[c];
        else {
          const v = [];
          for (let E = 0; E < l.length; E++)
            v.push(l[E].toLowerCase());
          a._columnFilters[c] = v;
        }
        a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), S(r, "ln-table:filter", {
          term: a._searchTerm,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }
    }, this.isDataDriven) {
      this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = r.querySelector("[data-ln-table-total]"), this._filteredSpan = r.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.closest("[data-ln-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = r.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.closest("[data-ln-table-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(c) {
        const m = c.detail || {};
        a._data = m.data || [], a._lastTotal = m.total != null ? m.total : a._data.length, a._lastFiltered = m.filtered != null ? m.filtered : a._data.length, a.totalCount = a._lastTotal, a.visibleCount = a._lastFiltered, a.isLoaded = !0, r.classList.remove("ln-table--loading"), a._vStart = -1, a._vEnd = -1, a._applyFilterAndSort(), a._render(), a._updateFooter(), S(r, "ln-table:rendered", {
          table: a.name,
          total: a.totalCount,
          visible: a.visibleCount
        });
      }, r.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(c) {
        const m = c.detail && c.detail.loading;
        r.classList.toggle("ln-table--loading", !!m), m && (a.isLoaded = !1);
      }, r.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSortClick = function(c) {
        const m = c.target.closest("[data-ln-table-col-sort]");
        if (!m) return;
        const l = m.closest("th");
        if (!l) return;
        const _ = l.getAttribute("data-ln-table-col");
        _ && a._handleSort(_, l);
      }, this.thead && this.thead.addEventListener("click", this._onSortClick), r.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClearAll = function(c) {
        if (c.target.closest("[data-ln-table-clear-all]") || c.target.closest("[data-ln-data-table-clear-all]")) {
          a.currentFilters = {};
          for (let l = 0; l < a.ths.length; l++) {
            const _ = a.ths[l].querySelector("[data-ln-table-col-filter]");
            _ && _.classList.remove("ln-filter-active");
          }
          S(r, "ln-table:clear-filters", { table: a.name }), a._requestData();
        }
      }, r.addEventListener("click", this._onClearAll), this._selectable = r.hasAttribute("data-ln-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(c) {
        if (c.target.closest("[data-ln-table-row-select]") || c.target.closest("[data-ln-table-row-action]") || c.target.closest("a") || c.target.closest("button") || c.ctrlKey || c.metaKey || c.button === 1) return;
        const m = c.target.closest("[data-ln-table-row]");
        if (!m) return;
        const l = m.getAttribute("data-ln-table-row-id"), _ = m._lnRecord || {};
        S(r, "ln-table:row-click", {
          table: a.name,
          id: l,
          record: _
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(c) {
        const m = c.target.closest("[data-ln-table-row-action]");
        if (!m) return;
        c.stopPropagation();
        const l = m.closest("[data-ln-table-row]");
        if (!l) return;
        const _ = m.getAttribute("data-ln-table-row-action"), v = l.getAttribute("data-ln-table-row-id"), E = l._lnRecord || {};
        S(r, "ln-table:row-action", {
          table: a.name,
          id: v,
          action: _,
          record: E
        });
      }, this.tbody && this.tbody.addEventListener("click", this._onRowAction);
      const o = document.querySelector('[data-ln-search="' + r.id + '"]');
      if (o) {
        const c = o.tagName;
        this._searchInput = c === "INPUT" || c === "TEXTAREA" ? o : o.querySelector('input[type="search"]') || o.querySelector('input[type="text"]') || o.querySelector("input");
      } else
        this._searchInput = null;
      this._onSearchChange = function(c) {
        c.preventDefault(), a.currentSearch = c.detail.term, a._searchInput && (a._searchInput.value = c.detail.term), S(r, "ln-table:search", {
          table: a.name,
          query: a.currentSearch
        }), a._requestData();
      }, r.addEventListener("ln-search:change", this._onSearchChange), this._focusedRowIndex = -1, this._onKeydown = function(c) {
        if (!r.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        if (c.key === "/") {
          a._searchInput && (c.preventDefault(), a._searchInput.focus());
          return;
        }
        const m = a.tbody ? Array.from(a.tbody.querySelectorAll("[data-ln-table-row]")) : [];
        if (m.length)
          switch (c.key) {
            case "ArrowDown":
              c.preventDefault(), a._focusedRowIndex = Math.min(a._focusedRowIndex + 1, m.length - 1), a._focusRow(m);
              break;
            case "ArrowUp":
              c.preventDefault(), a._focusedRowIndex = Math.max(a._focusedRowIndex - 1, 0), a._focusRow(m);
              break;
            case "Home":
              c.preventDefault(), a._focusedRowIndex = 0, a._focusRow(m);
              break;
            case "End":
              c.preventDefault(), a._focusedRowIndex = m.length - 1, a._focusRow(m);
              break;
            case "Enter":
              if (a._focusedRowIndex >= 0 && a._focusedRowIndex < m.length) {
                c.preventDefault();
                const l = m[a._focusedRowIndex];
                S(r, "ln-table:row-click", {
                  table: a.name,
                  id: l.getAttribute("data-ln-table-row-id"),
                  record: l._lnRecord || {}
                });
              }
              break;
            case " ":
              if (a._selectable && a._focusedRowIndex >= 0 && a._focusedRowIndex < m.length) {
                c.preventDefault();
                const l = m[a._focusedRowIndex].querySelector("[data-ln-table-row-select]");
                l && (l.checked = !l.checked, l.dispatchEvent(new Event("change", { bubbles: !0 })));
              }
              break;
          }
      }, document.addEventListener("keydown", this._onKeydown), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), S(r, "ln-table:request-data", {
        table: this.name,
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
    } else
      this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
        a.tbody.rows.length > 0 && (a._emptyTbodyObserver.disconnect(), a._emptyTbodyObserver = null, a._parseRows());
      }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(o) {
        o.preventDefault(), a._searchTerm = o.detail.term, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), S(r, "ln-table:filter", {
          term: a._searchTerm,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }, r.addEventListener("ln-search:change", this._onSearch), this._onSort = function(o) {
        a._sortCol = o.detail.direction === null ? -1 : o.detail.column, a._sortDir = o.detail.direction, a._sortType = o.detail.sortType, a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), S(r, "ln-table:sorted", {
          column: o.detail.column,
          direction: o.detail.direction,
          matched: a._filteredData.length,
          total: a._data.length
        });
      }, r.addEventListener("ln-table:sort", this._onSort), r.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(o) {
        if (!o.target.closest("[data-ln-table-clear]")) return;
        a._searchTerm = "";
        const m = document.querySelector('[data-ln-search="' + r.id + '"]');
        if (m) {
          const _ = m.tagName === "INPUT" ? m : m.querySelector("input");
          _ && (_.value = "");
        }
        a._columnFilters = {};
        for (let _ = 0; _ < a.ths.length; _++) {
          const v = a.ths[_].querySelector("[data-ln-table-col-filter]");
          v && v.classList.remove("ln-filter-active");
        }
        const l = document.querySelectorAll('[data-ln-filter="' + r.id + '"]');
        for (let _ = 0; _ < l.length; _++) {
          const v = l[_].querySelector("[data-ln-filter-reset]");
          v && (v.checked = !0, v.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        a._applyFilterAndSort(), a._vStart = -1, a._vEnd = -1, a._render(), S(r, "ln-table:filter", {
          term: "",
          matched: a._filteredData.length,
          total: a._data.length
        });
      }, r.addEventListener("click", this._onClear);
    return this;
  }
  e.prototype._parseRows = function() {
    const r = this.tbody.rows, u = this.ths;
    this._data = [];
    const a = [];
    for (let o = 0; o < u.length; o++)
      a[o] = u[o].getAttribute(b);
    r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40), this._lockColumnWidths();
    for (let o = 0; o < r.length; o++) {
      const c = r[o], m = [], l = [], _ = [];
      for (let E = 0; E < c.cells.length; E++) {
        const A = c.cells[E], w = A.textContent.trim(), C = qt(A), D = a[E];
        l[E] = w.toLowerCase(), D === "number" || D === "date" ? m[E] = parseFloat(C) || 0 : D === "string" ? m[E] = String(C) : m[E] = null, E < c.cells.length - 1 && _.push(w.toLowerCase());
      }
      let v = null;
      if (this.isDataDriven) {
        v = {};
        const E = c.getAttribute("data-ln-table-row-id");
        E != null && (v.id = E);
        for (let A = 0; A < u.length; A++) {
          const w = u[A].getAttribute("data-ln-table-col");
          if (w) {
            const C = A;
            if (C < c.cells.length) {
              const D = c.cells[C];
              v[w] = qt(D);
            }
          }
        }
      }
      this._data.push({
        sortKeys: m,
        rawTexts: l,
        html: c.outerHTML,
        searchText: _.join(" "),
        id: this.isDataDriven && v ? v.id : void 0,
        ...v
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, e.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const r = (this.currentSearch || "").trim().toLowerCase(), u = this.currentFilters || {}, a = Object.keys(u).length > 0;
      if (this._filteredData = this._data.filter(function(v) {
        if (r) {
          let E = !1;
          for (const A in v)
            if (v.hasOwnProperty(A) && typeof v[A] == "string" && A !== "html" && A !== "searchText" && v[A].toLowerCase().indexOf(r) !== -1) {
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
      const o = this.currentSort.field, m = this.currentSort.direction === "desc" ? -1 : 1;
      let l = null;
      if (this.ths) {
        for (let v = 0; v < this.ths.length; v++)
          if (this.ths[v].getAttribute("data-ln-table-col") === o) {
            l = this.ths[v].getAttribute(b);
            break;
          }
      }
      const _ = n ? n.compare : function(v, E) {
        return v < E ? -1 : v > E ? 1 : 0;
      };
      this._filteredData.sort(function(v, E) {
        const A = v[o], w = E[o];
        if (l === "number" || l === "date") {
          const R = parseFloat(A) || 0, x = parseFloat(w) || 0;
          return (R - x) * m;
        }
        if (typeof A == "number" && typeof w == "number")
          return (A - w) * m;
        const C = A != null ? String(A) : "", D = w != null ? String(w) : "";
        return _(C, D) * m;
      });
    } else {
      const r = this._searchTerm, u = this._columnFilters, a = Object.keys(u).length > 0, o = this.ths, c = {};
      if (a)
        for (let E = 0; E < o.length; E++) {
          const A = o[E].getAttribute("data-ln-table-filter-col");
          A && (c[A] = E);
        }
      if (!r && !a ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
        if (r && E.searchText.indexOf(r) === -1) return !1;
        if (a)
          for (const A in u) {
            const w = c[A];
            if (w !== void 0 && u[A].indexOf(E.rawTexts[w]) === -1)
              return !1;
          }
        return !0;
      }), this._sortCol < 0 || !this._sortDir) return;
      const m = this._sortCol, l = this._sortDir === "desc" ? -1 : 1, _ = this._sortType === "number" || this._sortType === "date", v = n ? n.compare : function(E, A) {
        return E < A ? -1 : E > A ? 1 : 0;
      };
      this._filteredData.sort(function(E, A) {
        const w = E.sortKeys[m], C = A.sortKeys[m];
        return _ ? (w - C) * l : v(w, C) * l;
      });
    }
  }, e.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const r = document.createElement("colgroup");
    this.ths.forEach(function(u) {
      const a = document.createElement("col");
      a.style.width = u.offsetWidth + "px", r.appendChild(a);
    }), this.table.insertBefore(r, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = r;
  }, e.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const r = this._lastTotal, u = this.visibleCount;
        if (r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || u === 0) {
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
      const r = this._filteredData, u = document.createDocumentFragment();
      for (let a = 0; a < r.length; a++) {
        const o = this._buildRow(r[a]);
        if (!o) break;
        u.appendChild(o);
      }
      this.tbody.textContent = "", this.tbody.appendChild(u), this._selectable && this._updateSelectAll();
    } else {
      const r = [], u = this._filteredData;
      for (let a = 0; a < u.length; a++) r.push(u[a].html);
      this.tbody.innerHTML = r.join("");
    }
  }, e.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
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
    this.isDataDriven ? this._scrollContainer = i(this.dom) : this._scrollContainer = null;
    const u = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._renderVirtual();
      }));
    }, u.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    const r = this._filteredData, u = r.length, a = this._rowHeight;
    if (!a || !u) return;
    const o = this.thead ? this.thead.offsetHeight : 0, c = this._scrollContainer;
    let m, l;
    if (c) {
      const C = this.table.getBoundingClientRect(), D = c.getBoundingClientRect(), R = C.top - D.top + c.scrollTop + o;
      m = c.scrollTop - R, l = c.clientHeight;
    } else {
      const R = this.table.getBoundingClientRect().top + window.scrollY + o;
      m = window.scrollY - R, l = window.innerHeight;
    }
    let _ = Math.max(0, Math.floor(m / a) - 15);
    _ = Math.min(_, u);
    const v = Math.min(_ + Math.ceil(l / a) + 30, u);
    if (_ === this._vStart && v === this._vEnd) return;
    this._vStart = _, this._vEnd = v;
    const E = this.ths.length || 1, A = _ * a, w = (u - v) * a;
    if (this.isDataDriven) {
      const C = document.createDocumentFragment();
      if (A > 0) {
        const D = document.createElement("tr");
        D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", E), R.style.height = A + "px", D.appendChild(R), C.appendChild(D);
      }
      for (let D = _; D < v; D++) {
        const R = this._buildRow(r[D]);
        R && C.appendChild(R);
      }
      if (w > 0) {
        const D = document.createElement("tr");
        D.className = "ln-table__spacer", D.setAttribute("aria-hidden", "true");
        const R = document.createElement("td");
        R.setAttribute("colspan", E), R.style.height = w + "px", D.appendChild(R), C.appendChild(D);
      }
      this.tbody.textContent = "", this.tbody.appendChild(C), this._selectable && this._updateSelectAll();
    } else {
      let C = "";
      A > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
      for (let D = _; D < v; D++) C += r[D].html;
      w > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + E + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
    }
  }, e.prototype._showEmptyState = function() {
    const r = this.ths.length || 1;
    this.tbody.textContent = "";
    let u = null;
    if (this.isDataDriven) {
      const a = this._lastTotal != null ? this._lastTotal : this._data.length, o = this.visibleCount, c = (this.currentSearch || Object.keys(this.currentFilters).length > 0) && (o < a || o === 0), m = c ? this.name + "-empty-filtered" : this.name + "-empty";
      if (u = lt(this.dom, m, "ln-table"), !u) {
        const l = this.dom.querySelector("template[data-ln-table-empty]");
        if (l) {
          const _ = c ? "search" : "initial", v = l.content.querySelector('[data-ln-table-empty-when="' + _ + '"]') || l.content.firstElementChild;
          v && (u = document.importNode(v, !0));
        }
      }
      if (u)
        if (u.tagName === "TR")
          this.tbody.appendChild(u);
        else {
          const l = document.createElement("td");
          l.setAttribute("colspan", String(r)), l.appendChild(u);
          const _ = document.createElement("tr");
          _.className = "ln-table__empty", _.appendChild(l), this.tbody.appendChild(_);
        }
    } else {
      const a = this.dom.querySelector("template[" + p + "]"), o = document.createElement("td");
      o.setAttribute("colspan", String(r)), a && o.appendChild(document.importNode(a.content, !0));
      const c = document.createElement("tr");
      c.className = "ln-table__empty", c.appendChild(o), this.tbody.appendChild(c);
    }
    S(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, e.prototype._fillRow = function(r, u) {
    bt(r, u);
    const a = r.querySelectorAll("[data-ln-table-cell-attr]");
    for (let o = 0; o < a.length; o++) {
      const c = a[o], m = c.getAttribute("data-ln-table-cell-attr").split(",");
      for (let l = 0; l < m.length; l++) {
        const _ = m[l].trim().split(":");
        if (_.length !== 2) continue;
        const v = _[0].trim(), E = _[1].trim();
        u[v] != null && c.setAttribute(E, u[v]);
      }
    }
  }, e.prototype._buildRow = function(r) {
    const u = lt(this.dom, this.name + "-row", "ln-table");
    if (!u) return null;
    const a = u.querySelector("[data-ln-table-row]") || u.firstElementChild;
    if (!a) return null;
    if (this._fillRow(a, r), a._lnRecord = r, r.id != null && a.setAttribute("data-ln-table-row-id", r.id), this._selectable && r.id != null && this.selectedIds.has(String(r.id))) {
      a.classList.add("ln-row-selected");
      const o = a.querySelector("[data-ln-table-row-select]");
      o && (o.checked = !0);
    }
    return a;
  }, e.prototype._handleSort = function(r, u) {
    let a;
    !this.currentSort || this.currentSort.field !== r ? a = "asc" : this.currentSort.direction === "asc" ? a = "desc" : a = null;
    for (let o = 0; o < this.ths.length; o++)
      this.ths[o].classList.remove("ln-sort-asc", "ln-sort-desc");
    a ? (this.currentSort = { field: r, direction: a }, u.classList.add(a === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-table:sort", {
      table: this.name,
      field: r,
      direction: a
    }), this._requestData();
  }, e.prototype._requestData = function() {
    Ht(this, "ln-table:request-data", "table");
  }, e.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-table-row]");
    let u = r.length > 0;
    for (let a = 0; a < r.length; a++) {
      const o = r[a].getAttribute("data-ln-table-row-id");
      if (o != null && !this.selectedIds.has(o)) {
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
    const r = this;
    if (this._onSelectionChange = function(u) {
      const a = u.target.closest("[data-ln-table-row-select]");
      if (!a) return;
      const o = a.closest("[data-ln-table-row]");
      if (!o) return;
      const c = o.getAttribute("data-ln-table-row-id");
      c != null && (a.checked ? (r.selectedIds.add(c), o.classList.add("ln-row-selected")) : (r.selectedIds.delete(c), o.classList.remove("ln-row-selected")), r.selectedCount = r.selectedIds.size, r._updateSelectAll(), r._updateFooter(), S(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const u = document.createElement("input");
      u.type = "checkbox", u.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(u), this._selectAllCheckbox = u;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const u = r._selectAllCheckbox.checked, a = r.tbody ? r.tbody.querySelectorAll("[data-ln-table-row]") : [];
      for (let o = 0; o < a.length; o++) {
        const c = a[o].getAttribute("data-ln-table-row-id"), m = a[o].querySelector("[data-ln-table-row-select]");
        c != null && (u ? (r.selectedIds.add(c), a[o].classList.add("ln-row-selected")) : (r.selectedIds.delete(c), a[o].classList.remove("ln-row-selected")), m && (m.checked = u));
      }
      r.selectedCount = r.selectedIds.size, S(r.dom, "ln-table:select-all", {
        table: r.name,
        selected: u
      }), S(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let a = 0; a < u.length; a++) {
        const o = u[a].querySelector("[data-ln-table-row-select]"), c = u[a].getAttribute("data-ln-table-row-id");
        o && o.checked && c != null && (this.selectedIds.add(c), u[a].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, e.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const r = this.dom.querySelector("[data-ln-table-col-select]");
    if (r) {
      const u = r.querySelector('input[type="checkbox"]');
      u && u.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const u = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let a = 0; a < u.length; a++) {
        u[a].classList.remove("ln-row-selected");
        const o = u[a].querySelector("[data-ln-table-row-select]");
        o && (o.checked = !1);
      }
    }
    this._updateFooter();
  }, e.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const r = this._lastTotal != null ? this._lastTotal : this._data.length, u = this.visibleCount, a = u < r;
    if (this._totalSpan && (this._totalSpan.textContent = t(r)), this._filteredSpan && (this._filteredSpan.textContent = a ? t(u) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !a), this._selectedSpan) {
      const o = this.selectedIds.size;
      this._selectedSpan.textContent = o > 0 ? t(o) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", o === 0);
    }
  }, e.prototype._focusRow = function(r) {
    for (let u = 0; u < r.length; u++)
      r[u].classList.remove("ln-row-focused"), r[u].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < r.length) {
      const u = r[this._focusedRowIndex];
      u.classList.add("ln-row-focused"), u.setAttribute("tabindex", "0"), u.focus(), u.scrollIntoView({ block: "nearest" });
    }
  }, e.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.thead && this.thead.removeEventListener("click", this._onSortClick), document.removeEventListener("keydown", this._onKeydown), this._onSearchChange && this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter)) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear)), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, B(h, d, e, "ln-table");
})();
(function() {
  const h = "data-ln-list", d = "lnList", b = "data-ln-list-empty";
  if (window[d] !== void 0) return;
  function g(t) {
    let i = t;
    for (; i && i !== document.body && i !== document.documentElement; ) {
      const r = getComputedStyle(i).overflowY;
      if (r === "auto" || r === "scroll") return i;
      i = i.parentElement;
    }
    return null;
  }
  function n(t) {
    if (!t) return 0;
    const i = getComputedStyle(t), e = parseFloat(i.marginTop) || 0, r = parseFloat(i.marginBottom) || 0;
    return t.offsetHeight + e + r;
  }
  function s(t) {
    this.dom = t, this.tbody = t.querySelector("[data-ln-list-body]") || t, this.isDataDriven = t.hasAttribute("data-ln-list-source"), this.name = t.getAttribute(h) || "", this.source = t.getAttribute("data-ln-list-source") || "", this._data = [], this._filteredData = [], this._searchTerm = "", this._columnFilters = {}, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const i = this;
    return this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._lastTotal = 0, this._lastFiltered = 0, this._totalSpan = t.querySelector("[data-ln-list-total]"), this._filteredSpan = t.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentNode && this._filteredSpan.parentNode !== t ? this._filteredSpan.closest("[data-ln-list-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = t.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentNode && this._selectedSpan.parentNode !== t ? this._selectedSpan.closest("[data-ln-list-selected-wrap]") || this._selectedSpan.parentNode : null), this._onSetData = function(e) {
      const r = e.detail || {};
      i._data = r.data || [], i._lastTotal = r.total != null ? r.total : i._data.length, i._lastFiltered = r.filtered != null ? r.filtered : i._data.length, i.totalCount = i._lastTotal, i.visibleCount = i._lastFiltered, i.isLoaded = !0, t.classList.remove("ln-list--loading"), i._vStart = -1, i._vEnd = -1, i._applyFilterAndSort(), i._render(), i._updateFooter(), S(t, "ln-list:rendered", {
        list: i.name,
        total: i.totalCount,
        visible: i.visibleCount
      });
    }, t.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(e) {
      const r = e.detail && e.detail.loading;
      t.classList.toggle("ln-list--loading", !!r), r && (i.isLoaded = !1);
    }, t.addEventListener("ln-list:set-loading", this._onSetLoading), this._onClearAll = function(e) {
      (e.target.closest("[data-ln-list-clear-all]") || e.target.closest("[data-ln-data-list-clear-all]")) && (i.currentFilters = {}, S(t, "ln-list:clear-filters", { list: i.name }), i._requestData());
    }, t.addEventListener("click", this._onClearAll), this._selectable = t.hasAttribute("data-ln-list-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onItemClick = function(e) {
      if (e.target.closest("[data-ln-item-select]") || e.target.closest("[data-ln-item-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const r = e.target.closest("[data-ln-item]");
      if (!r) return;
      const u = r.getAttribute("data-ln-item-id"), a = r._lnRecord || {};
      S(t, "ln-list:item-click", {
        list: i.name,
        id: u,
        record: a
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(e) {
      const r = e.target.closest("[data-ln-item-action]");
      if (!r) return;
      e.stopPropagation();
      const u = r.closest("[data-ln-item]");
      if (!u) return;
      const a = r.getAttribute("data-ln-item-action"), o = u.getAttribute("data-ln-item-id"), c = u._lnRecord || {};
      S(t, "ln-list:item-action", {
        list: i.name,
        id: o,
        action: a,
        record: c
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this._onSearchChange = function(e) {
      e.preventDefault(), i.currentSearch = e.detail.term, S(t, "ln-list:search", {
        list: i.name,
        query: i.currentSearch
      }), i._requestData();
    }, t.addEventListener("ln-search:change", this._onSearchChange), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), S(t, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      i.tbody.children.length > 0 && (i._emptyObserver.disconnect(), i._emptyObserver = null, i._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(e) {
      e.preventDefault(), i._searchTerm = e.detail.term, i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), S(t, "ln-list:filter", {
        term: i._searchTerm,
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onClear = function(e) {
      if (!e.target.closest("[data-ln-list-clear]")) return;
      i._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (u) {
        const a = u.tagName === "INPUT" ? u : u.querySelector("input");
        a && (a.value = "");
      }
      i._applyFilterAndSort(), i._vStart = -1, i._vEnd = -1, i._render(), S(t, "ln-list:filter", {
        term: "",
        matched: i._filteredData.length,
        total: i._data.length
      });
    }, t.addEventListener("click", this._onClear)), this;
  }
  s.prototype._parseChildren = function() {
    const t = Array.from(this.tbody.children).filter((i) => !i.classList.contains("ln-list__spacer"));
    this._data = [], t.length > 0 && (this._itemHeight = n(t[0]) || 50);
    for (let i = 0; i < t.length; i++) {
      const e = t[i], r = e.getAttribute("data-ln-item-id") || e.getAttribute("id"), u = e.textContent.trim().toLowerCase();
      let a = null;
      if (this.isDataDriven) {
        a = {}, r != null && (a.id = r);
        const o = e.querySelectorAll("[data-ln-list-field]");
        for (let c = 0; c < o.length; c++) {
          const m = o[c], l = m.getAttribute("data-ln-list-field");
          l && (a[l] = m.textContent.trim());
        }
      }
      this._data.push({
        html: e.outerHTML,
        searchText: u,
        id: r,
        ...a
      });
    }
    this._filteredData = this._data.slice(), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), S(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, s.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven) {
      const t = (this.currentSearch || "").trim().toLowerCase(), i = this.currentFilters || {}, e = Object.keys(i).length > 0;
      if (this._filteredData = this._data.filter(function(o) {
        if (t) {
          let c = !1;
          for (const m in o)
            if (o.hasOwnProperty(m) && typeof o[m] == "string" && m !== "html" && m !== "searchText" && o[m].toLowerCase().indexOf(t) !== -1) {
              c = !0;
              break;
            }
          if (!c) return !1;
        }
        if (e)
          for (const c in i) {
            const m = i[c];
            if (m && m.length > 0) {
              const l = o[c], _ = l != null ? String(l) : "";
              if (m.indexOf(_) === -1) return !1;
            }
          }
        return !0;
      }), this.visibleCount = this._filteredData.length, !this.currentSort || !this.currentSort.field || !this.currentSort.direction) return;
      const r = this.currentSort.field, u = this.currentSort.direction === "desc" ? -1 : 1, a = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }).compare : function(o, c) {
        return o < c ? -1 : o > c ? 1 : 0;
      };
      this._filteredData.sort(function(o, c) {
        const m = o[r], l = c[r];
        if (typeof m == "number" && typeof l == "number")
          return (m - l) * u;
        const _ = m != null ? String(m) : "", v = l != null ? String(l) : "";
        return a(_, v) * u;
      });
    } else {
      const t = this._searchTerm;
      t ? this._filteredData = this._data.filter(function(i) {
        return i.searchText.indexOf(t) !== -1;
      }) : this._filteredData = this._data.slice();
    }
  }, s.prototype._render = function() {
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
  }, s.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const t = this._filteredData, i = document.createDocumentFragment();
      for (let e = 0; e < t.length; e++) {
        const r = this._buildItem(t[e]);
        if (!r) break;
        i.appendChild(r);
      }
      this.tbody.textContent = "", this.tbody.appendChild(i), this._selectable && this._updateSelectAll();
    } else {
      const t = [], i = this._filteredData;
      for (let e = 0; e < i.length; e++) t.push(i[e].html);
      this.tbody.innerHTML = t.join("");
    }
  }, s.prototype._readGridLayout = function() {
    const t = getComputedStyle(this.tbody), i = t.gridTemplateColumns;
    let e = 1;
    if (i && i !== "none") {
      const u = i.trim().split(/\s+/).filter(Boolean);
      u.length > 0 && (e = u.length);
    }
    const r = parseFloat(t.rowGap);
    return { columns: e, rowGap: isNaN(r) ? 0 : r };
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
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = g(this.dom);
    const i = this._scrollContainer || window;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      t._itemHeight = 0, t._measureItemHeight(), t._vStart = -1, t._vEnd = -1, t._renderVirtual();
    }, i.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const t = this._filteredData, i = t.length, e = this._itemHeight;
    if (!e || !i) return;
    const r = this._scrollContainer;
    let u, a;
    if (r) {
      const x = this.tbody.getBoundingClientRect(), O = r.getBoundingClientRect(), F = r === this.tbody ? 0 : x.top - O.top + r.scrollTop;
      u = r.scrollTop - F, a = r.clientHeight;
    } else {
      const O = this.tbody.getBoundingClientRect().top + window.scrollY;
      u = window.scrollY - O, a = window.innerHeight;
    }
    const o = this._readGridLayout(), c = o.columns, m = o.rowGap, l = e + m, _ = Math.ceil(i / c);
    let v = Math.max(0, Math.floor(u / l) - 15);
    v = Math.min(v, _);
    const E = Math.ceil(a / l) + 30, A = Math.min(v + E, _), w = Math.min(v * c, i), C = Math.min(A * c, i);
    if (w === this._vStart && C === this._vEnd) return;
    this._vStart = w, this._vEnd = C;
    const D = v * l, R = (_ - A) * l;
    if (this.isDataDriven) {
      const x = document.createDocumentFragment();
      if (D > 0) {
        const O = document.createElement(this.isUl ? "li" : "div");
        O.className = "ln-list__spacer", O.style.height = D + "px", x.appendChild(O);
      }
      for (let O = w; O < C; O++) {
        const F = this._buildItem(t[O]);
        F && x.appendChild(F);
      }
      if (R > 0) {
        const O = document.createElement(this.isUl ? "li" : "div");
        O.className = "ln-list__spacer", O.style.height = R + "px", x.appendChild(O);
      }
      this.tbody.textContent = "", this.tbody.appendChild(x), this._selectable && this._updateSelectAll();
    } else {
      let x = "";
      D > 0 && (x += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${D}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`);
      for (let O = w; O < C; O++)
        x += t[O].html;
      R > 0 && (x += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" style="height:${R}px;padding:0;border:none"></${this.isUl ? "li" : "div"}>`), this.tbody.innerHTML = x;
    }
  }, s.prototype._showEmptyState = function() {
    this.tbody.textContent = "";
    let t = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, e = this.visibleCount, r = this.currentSearch && (e < i || e === 0), u = r ? this.name + "-empty-filtered" : this.name + "-empty";
      if (t = lt(this.dom, u, "ln-list"), !t) {
        const a = this.dom.querySelector("template[data-ln-empty]");
        if (a) {
          const o = r ? "search" : "initial", c = a.content.querySelector(`[data-ln-empty-when="${o}"]`) || a.content.firstElementChild;
          c && (t = document.importNode(c, !0));
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
    S(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, s.prototype._buildItem = function(t) {
    const i = lt(this.dom, this.name + "-row", "ln-list");
    if (!i) return null;
    const e = i.querySelector("[data-ln-item]") || i.firstElementChild;
    if (!e) return null;
    if (bt(e, t), X(e, t), e._lnRecord = t, t.id != null && (e.setAttribute("data-ln-item-id", t.id), this._selectable && this.selectedIds.has(String(t.id)))) {
      e.classList.add("ln-item-selected");
      const r = e.querySelector("[data-ln-item-select]");
      r && (r.checked = !0);
    }
    return e;
  }, s.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const t = this;
    this._onSelectionChange = function(i) {
      const e = i.target.closest("[data-ln-item-select]");
      if (!e) return;
      const r = e.closest("[data-ln-item]");
      if (!r) return;
      const u = r.getAttribute("data-ln-item-id");
      u != null && (e.checked ? (t.selectedIds.add(String(u)), r.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(u)), r.classList.remove("ln-item-selected")), t._updateSelectAll(), t._updateFooter(), S(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const i = t._selectAllCheckbox.checked, e = t.tbody.querySelectorAll("[data-ln-item]");
      for (let r = 0; r < e.length; r++) {
        const u = e[r], a = u.getAttribute("data-ln-item-id"), o = u.querySelector("[data-ln-item-select]");
        a != null && (i ? (t.selectedIds.add(String(a)), u.classList.add("ln-item-selected")) : (t.selectedIds.delete(String(a)), u.classList.remove("ln-item-selected")), o && (o.checked = i));
      }
      S(t.dom, "ln-list:select-all", { list: t.name, selected: i }), S(t.dom, "ln-list:select", {
        list: t.name,
        selectedIds: t.selectedIds,
        count: t.selectedIds.size
      }), t._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, s.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const t = this.tbody.querySelectorAll("[data-ln-item]");
    let i = t.length > 0;
    for (let e = 0; e < t.length; e++) {
      const r = t[e].getAttribute("data-ln-item-id");
      if (r != null && !this.selectedIds.has(String(r))) {
        i = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = i;
  }, s.prototype._requestData = function() {
    Ht(this, "ln-list:request-data", "list");
  }, s.prototype._updateFooter = function() {
    if (!this.isDataDriven) return;
    const t = this._lastTotal != null ? this._lastTotal : this._data.length, i = this.visibleCount, e = i < t;
    if (this._totalSpan && (this._totalSpan.textContent = t), this._filteredSpan && (this._filteredSpan.textContent = e ? i : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const r = this.selectedIds.size;
      this._selectedSpan.textContent = r > 0 ? r : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", r === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this.isDataDriven ? (this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("click", this._onClearAll), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("ln-search:change", this._onSearchChange)) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("click", this._onClear)), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, B(h, d, s, "ln-list");
})();
(function() {
  const h = "data-ln-circular-progress", d = "lnCircularProgress";
  if (window[d] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", p = 36, f = 16, g = 2 * Math.PI * f;
  function n(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), i.call(this), r.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  n.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[d]);
  };
  function s(r, u) {
    const a = document.createElementNS(b, r);
    for (const o in u)
      a.setAttribute(o, u[o]);
    return a;
  }
  function t() {
    this.svg = s("svg", {
      viewBox: "0 0 " + p + " " + p,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: p / 2,
      cy: p / 2,
      r: f,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
      cx: p / 2,
      cy: p / 2,
      r: f,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": g,
      "stroke-dashoffset": g,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function i() {
    const r = this, u = new MutationObserver(function(a) {
      for (const o of a)
        (o.attributeName === "data-ln-circular-progress" || o.attributeName === "data-ln-circular-progress-max") && e.call(r);
    });
    u.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = u;
  }
  function e() {
    const r = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, u = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let a = u > 0 ? r / u * 100 : 0;
    a < 0 && (a = 0), a > 100 && (a = 100);
    const o = g - a / 100 * g;
    this.progressCircle.setAttribute("stroke-dashoffset", o);
    const c = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = c !== null ? c : Math.round(a) + "%", S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: r,
      max: u,
      percentage: a
    });
  }
  B(h, d, n, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", d = "lnSortable", b = "data-ln-sortable-handle";
  if (window[d] !== void 0) return;
  function p(g) {
    this.dom = g, this.isEnabled = g.getAttribute(h) !== "disabled", this._dragging = null, g.setAttribute("aria-roledescription", "sortable list");
    const n = this;
    return this._onPointerDown = function(s) {
      n.isEnabled && n._handlePointerDown(s);
    }, g.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, p.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, p.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[d]);
  }, p.prototype._handlePointerDown = function(g) {
    let n = g.target.closest("[" + b + "]"), s;
    if (n) {
      for (s = n; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (s = g.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      n = s;
    }
    const i = Array.from(this.dom.children).indexOf(s);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: i
    }).defaultPrevented) return;
    g.preventDefault(), n.setPointerCapture(g.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: i
    });
    const r = this, u = function(o) {
      r._handlePointerMove(o);
    }, a = function(o) {
      r._handlePointerEnd(o), n.removeEventListener("pointermove", u), n.removeEventListener("pointerup", a), n.removeEventListener("pointercancel", a);
    };
    n.addEventListener("pointermove", u), n.addEventListener("pointerup", a), n.addEventListener("pointercancel", a);
  }, p.prototype._handlePointerMove = function(g) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), s = this._dragging;
    for (const t of n)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of n) {
      if (t === s) continue;
      const i = t.getBoundingClientRect(), e = i.top + i.height / 2;
      if (g.clientY >= i.top && g.clientY < e) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (g.clientY >= e && g.clientY <= i.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, p.prototype._handlePointerEnd = function(g) {
    if (!this._dragging) return;
    const n = this._dragging, s = Array.from(this.dom.children), t = s.indexOf(n);
    let i = null, e = null;
    for (const r of s) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        i = r, e = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        i = r, e = "after";
        break;
      }
    }
    for (const r of s)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), i && i !== n) {
      e === "before" ? this.dom.insertBefore(n, i) : this.dom.insertBefore(n, i.nextElementSibling);
      const u = Array.from(this.dom.children).indexOf(n);
      S(this.dom, "ln-sortable:reordered", {
        item: n,
        oldIndex: t,
        newIndex: u
      });
    }
    this._dragging = null;
  };
  function f(g) {
    const n = g[d];
    if (!n) return;
    const s = g.getAttribute(h) !== "disabled";
    s !== n.isEnabled && (n.isEnabled = s, S(g, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: g }));
  }
  B(h, d, p, "ln-sortable", {
    onAttributeChange: f
  });
})();
(function() {
  const h = "data-ln-confirm", d = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[d] !== void 0) return;
  function f(g) {
    this.dom = g, this.confirming = !1, this.originalText = g.textContent.trim(), this.confirmText = g.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const n = this;
    return this._onClick = function(s) {
      if (!n.confirming)
        s.preventDefault(), s.stopImmediatePropagation(), n._enterConfirm();
      else {
        if (n._submitted) return;
        n._submitted = !0, n._reset();
      }
    }, g.addEventListener("click", this._onClick), this;
  }
  f.prototype._getTimeout = function() {
    const g = parseFloat(this.dom.getAttribute(b));
    return isNaN(g) || g <= 0 ? 3 : g;
  }, f.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var g = this.dom.querySelector("svg.ln-icon use");
    g && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = g.getAttribute("href"), g.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, f.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const g = this, n = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      g._reset();
    }, n);
  }, f.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var g = this.dom.querySelector("svg.ln-icon use");
      g && this.originalIconHref && g.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, f.prototype.destroy = function() {
    this.dom[d] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[d]);
  }, B(h, d, f, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", d = "lnTranslations";
  if (window[d] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(f) {
    this.dom = f, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = f.getAttribute(h + "-default") || "", this.badgesEl = f.querySelector("[" + h + "-active]"), this.menuEl = f.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const g = f.getAttribute(h + "-locales");
    if (this.locales = b, g)
      try {
        this.locales = JSON.parse(g);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const n = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && n.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && n.removeLanguage(s.detail.lang);
    }, f.addEventListener("ln-translations:request-add", this._onRequestAdd), f.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const f = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const g of f) {
      const n = g.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of n)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, p.prototype._detectExisting = function() {
    const f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const g of f) {
      const n = g.getAttribute("data-ln-translatable-lang");
      n && n !== this.defaultLang && this.activeLanguages.add(n);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const f = this;
    let g = 0;
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      g++;
      const t = Et("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const i = t.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", s), i.textContent = this.locales[s], i.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), f.menuEl.getAttribute("data-ln-toggle") === "open" && f.menuEl.setAttribute("data-ln-toggle", "close"), f.addLanguage(s));
      }), this.menuEl.appendChild(t);
    }
    const n = this.dom.querySelector("[" + h + "-add]");
    n && (n.style.display = g === 0 ? "none" : "");
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const f = this;
    this.activeLanguages.forEach(function(g) {
      const n = Et("ln-translations-badge", "ln-translations");
      if (!n) return;
      const s = n.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", g);
      const t = s.querySelector("span");
      t.textContent = f.locales[g] || g.toUpperCase();
      const i = s.querySelector("button");
      i.setAttribute("aria-label", "Remove " + (f.locales[g] || g.toUpperCase())), i.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), f.removeLanguage(g));
      }), f.badgesEl.appendChild(n);
    });
  }, p.prototype.addLanguage = function(f, g) {
    if (this.activeLanguages.has(f)) return;
    const n = this.locales[f] || f;
    if (z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: f,
      langName: n
    }).defaultPrevented) return;
    this.activeLanguages.add(f), g = g || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const i of t) {
      const e = i.getAttribute("data-ln-translatable"), r = i.getAttribute("data-ln-translations-prefix") || "", u = i.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!u) continue;
      const a = u.cloneNode(!1);
      r ? a.name = r + "[trans][" + f + "][" + e + "]" : a.name = "trans[" + f + "][" + e + "]", a.value = g[e] !== void 0 ? g[e] : "", a.removeAttribute("id"), a.placeholder = n + " translation", a.setAttribute("data-ln-translatable-lang", f);
      const o = i.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), c = o.length > 0 ? o[o.length - 1] : u;
      c.parentNode.insertBefore(a, c.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: f,
      langName: n
    });
  }, p.prototype.removeLanguage = function(f) {
    if (!this.activeLanguages.has(f) || z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: f
    }).defaultPrevented) return;
    const n = this.dom.querySelectorAll('[data-ln-translatable-lang="' + f + '"]');
    for (const s of n)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(f), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: f
    });
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(f) {
    return this.activeLanguages.has(f);
  }, p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const f = this.defaultLang, g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of g)
      n.getAttribute("data-ln-translatable-lang") !== f && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[d];
  }, B(h, d, p, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", d = "lnAutosave", b = "data-ln-autosave-clear", p = "data-ln-autosave-debounce-input", f = "ln-autosave:";
  if (window[d] !== void 0) return;
  function n(e) {
    const r = s(e);
    if (!r) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = r;
    let u = null;
    function a() {
      const l = Pt(e);
      try {
        localStorage.setItem(r, JSON.stringify(l));
      } catch {
        return;
      }
      S(e, "ln-autosave:saved", { target: e, data: l });
    }
    function o() {
      let l;
      try {
        l = localStorage.getItem(r);
      } catch {
        return;
      }
      if (!l) return;
      let _;
      try {
        _ = JSON.parse(l);
      } catch {
        return;
      }
      if (z(e, "ln-autosave:before-restore", { target: e, data: _ }).defaultPrevented) return;
      const E = Ut(e, _);
      for (let A = 0; A < E.length; A++)
        E[A].dispatchEvent(new Event("input", { bubbles: !0 })), E[A].dispatchEvent(new Event("change", { bubbles: !0 }));
      S(e, "ln-autosave:restored", { target: e, data: _ });
    }
    function c() {
      try {
        localStorage.removeItem(r);
      } catch {
        return;
      }
      S(e, "ln-autosave:cleared", { target: e });
    }
    this._onFocusout = function(l) {
      const _ = l.target;
      t(_) && _.name && a();
    }, this._onChange = function(l) {
      const _ = l.target;
      t(_) && _.name && a();
    }, this._onSubmit = function() {
      c();
    }, this._onReset = function() {
      c();
    }, this._onClearClick = function(l) {
      l.target.closest("[" + b + "]") && c();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick);
    const m = i(e);
    return m > 0 && (this._onInput = function(l) {
      const _ = l.target;
      !t(_) || !_.name || (u !== null && clearTimeout(u), u = setTimeout(a, m));
    }, e.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, o(), this;
  }
  n.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const e = this._getInputTimer();
        e !== null && clearTimeout(e);
      }
      S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function s(e) {
    const u = e.getAttribute(h) || e.id;
    return u ? f + window.location.pathname + ":" + u : null;
  }
  function t(e) {
    const r = e.tagName;
    return r === "INPUT" || r === "TEXTAREA" || r === "SELECT";
  }
  function i(e) {
    if (!e.hasAttribute(p)) return 0;
    const r = e.getAttribute(p);
    if (r === "" || r === null) return 1e3;
    const u = parseInt(r, 10);
    return isNaN(u) || u < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", e), 1e3) : u;
  }
  B(h, d, n, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", d = "lnAutoresize";
  if (window[d] !== void 0) return;
  function b(p) {
    if (p.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", p.tagName), this;
    this.dom = p;
    const f = this;
    return this._onInput = function() {
      f._resize();
    }, p.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[d]);
  }, B(h, d, b, "ln-autoresize");
})();
(function() {
  const h = "data-ln-editor", d = "lnEditor";
  if (window[d] !== void 0) return;
  var b = {
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
  }, p = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, f = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, g = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  function n(o) {
    this.dom = o;
    var c = this;
    if (this._textarea = o.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", o), this;
    var m = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), m && this._surface.setAttribute("data-placeholder", m);
    var l = this._textarea.id;
    if (l) {
      var _ = o.querySelector('label[for="' + l + '"]');
      _ && (_.id || (_.id = l + "-label"), this._surface.setAttribute("aria-labelledby", _.id));
    }
    var v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    var E = o.querySelector("nav");
    return E && E.nextSibling ? o.insertBefore(this._surface, E.nextSibling) : o.appendChild(this._surface), this._onInput = function() {
      c._syncToTextarea(), S(c.dom, "ln-editor:changed", {
        html: c._textarea.value,
        target: c.dom
      });
    }, this._onMousedownToolbar = function(A) {
      var w = A.target.closest("[data-ln-editor-action]");
      w && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      var w = A.target.closest("[data-ln-editor-action]");
      if (w) {
        var C = w.getAttribute("data-ln-editor-action");
        c._execAction(C);
      }
    }, this._onPaste = function(A) {
      i(c, A);
    }, this._onKeydown = function(A) {
      u(c, A);
    }, this._onSelectionChange = function() {
      c._updateActiveStates();
    }, this._onFocus = function() {
      S(c.dom, "ln-editor:focus", { target: c.dom });
    }, this._onBlur = function() {
      c._syncToTextarea(), S(c.dom, "ln-editor:blur", { target: c.dom });
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(A) {
      var w = A.detail && A.detail.html;
      w !== void 0 && (c._surface.innerHTML = w, c._syncToTextarea());
    }, o.addEventListener("ln-editor:set-content", this._onSetContent), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(o) {
    if (o) {
      var c = z(this.dom, "ln-editor:before-change", {
        action: o,
        target: this.dom
      });
      if (!c.defaultPrevented) {
        if (this._surface.focus(), p[o])
          document.execCommand(p[o], !1, null);
        else if (f[o]) {
          var m = f[o], l = s(this._surface);
          l && l.toLowerCase() === m ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + m + ">");
        } else g[o] ? document.execCommand(g[o], !1, null) : o === "link" ? a(this) : o === "unlink" ? document.execCommand("unlink", !1, null) : o === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
        this._syncToTextarea(), this._updateActiveStates(), S(this.dom, "ln-editor:changed", {
          html: this._textarea.value,
          target: this.dom
        });
      }
    }
  }, n.prototype._updateActiveStates = function() {
    var o = this.dom.querySelector("nav");
    if (o) {
      var c = window.getSelection();
      if (!(!c || c.rangeCount === 0)) {
        var m = c.anchorNode;
        if (!(!m || !this._surface.contains(m)))
          for (var l = o.querySelectorAll("[data-ln-editor-action]"), _ = 0; _ < l.length; _++) {
            var v = l[_], E = v.getAttribute("data-ln-editor-action"), A = !1;
            if (p[E])
              try {
                A = document.queryCommandState(p[E]);
              } catch {
              }
            else if (f[E]) {
              var w = s(this._surface);
              A = w && w.toLowerCase() === f[E];
            } else if (g[E])
              try {
                A = document.queryCommandState(g[E]);
              } catch {
              }
            else E === "link" && (A = !!t(c.anchorNode, "A", this._surface));
            A ? v.classList.add("ln-editor-active") : v.classList.remove("ln-editor-active");
          }
      }
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(o) {
    this._surface && (this._surface.innerHTML = o, this._syncToTextarea());
  }, n.prototype.destroy = function() {
    if (this.dom[d]) {
      this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
      var o = this.dom.querySelector("nav");
      o && (o.removeEventListener("mousedown", this._onMousedownToolbar), o.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent), this._textarea && this._textarea.removeAttribute("data-ln-editor-source");
      var c = this.dom.querySelector(".ln-editor__link-popover");
      c && c.remove(), S(this.dom, "ln-editor:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function s(o) {
    var c = window.getSelection();
    if (!c || c.rangeCount === 0) return null;
    var m = c.anchorNode;
    if (!m) return null;
    for (; m && m !== o; ) {
      if (m.nodeType === 1) {
        var l = m.tagName;
        if (l === "H2" || l === "H3" || l === "H4" || l === "BLOCKQUOTE" || l === "PRE" || l === "P")
          return l;
      }
      m = m.parentNode;
    }
    return null;
  }
  function t(o, c, m) {
    for (; o && o !== m; ) {
      if (o.nodeType === 1 && o.tagName === c)
        return o;
      o = o.parentNode;
    }
    return null;
  }
  function i(o, c) {
    c.preventDefault();
    var m = "";
    if (c.clipboardData && (m = c.clipboardData.getData("text/html"), !m)) {
      var l = c.clipboardData.getData("text/plain");
      l && (m = l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), m = "<p>" + m + "</p>");
    }
    if (m) {
      var _ = e(m);
      _ && document.execCommand("insertHTML", !1, _);
    }
  }
  function e(o) {
    var c = document.createElement("div");
    return c.innerHTML = o, r(c), c.innerHTML;
  }
  function r(o) {
    for (var c = Array.from(o.childNodes), m = 0; m < c.length; m++) {
      var l = c[m];
      if (l.nodeType !== 3) {
        if (l.nodeType !== 1) {
          o.removeChild(l);
          continue;
        }
        if (b[l.tagName]) {
          for (var _ = Array.from(l.attributes), v = 0; v < _.length; v++) {
            var E = _[v].name;
            if (l.tagName === "A" && E === "href") {
              var A = l.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || l.removeAttribute("href");
            } else
              l.removeAttribute(E);
          }
          l.tagName === "A" && l.setAttribute("rel", "noopener noreferrer"), r(l);
        } else {
          for (; l.firstChild; )
            o.insertBefore(l.firstChild, l);
          o.removeChild(l);
        }
      }
    }
  }
  function u(o, c) {
    if (c.ctrlKey || c.metaKey) {
      var m = null;
      switch (c.key.toLowerCase()) {
        case "b":
          m = "bold";
          break;
        case "i":
          m = "italic";
          break;
        case "u":
          m = "underline";
          break;
        case "k":
          m = "link";
          break;
      }
      m && (c.preventDefault(), o._execAction(m));
    }
  }
  function a(o) {
    var c = window.getSelection();
    if (!c || c.rangeCount === 0) return;
    var m = t(c.anchorNode, "A", o._surface), l = c.getRangeAt(0).cloneRange(), _ = o.dom.querySelector(".ln-editor__link-popover");
    _ && _.remove();
    var v = document.createElement("div");
    v.className = "ln-editor__link-popover";
    var E = document.createElement("input");
    E.type = "url", E.placeholder = "https://…", m && (E.value = m.getAttribute("href") || "");
    var A = document.createElement("button");
    A.type = "button", A.innerHTML = '<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-check"></use></svg>', A.setAttribute("aria-label", "Confirm");
    var w = document.createElement("button");
    w.type = "button", w.innerHTML = '<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>', w.setAttribute("aria-label", "Cancel"), v.appendChild(E), v.appendChild(A), v.appendChild(w);
    var C = o.dom.querySelector("nav");
    C ? C.after(v) : o.dom.insertBefore(v, o._surface), E.focus();
    function D() {
      var O = window.getSelection();
      O.removeAllRanges(), O.addRange(l);
    }
    function R() {
      var O = E.value.trim();
      if (v.remove(), D(), o._surface.focus(), O)
        if (m)
          m.setAttribute("href", O);
        else {
          document.execCommand("createLink", !1, O);
          var F = window.getSelection();
          if (F && F.anchorNode) {
            var U = t(F.anchorNode, "A", o._surface);
            U && U.setAttribute("rel", "noopener noreferrer");
          }
        }
      else m && document.execCommand("unlink", !1, null);
      o._syncToTextarea(), S(o.dom, "ln-editor:changed", {
        html: o._textarea.value,
        target: o.dom
      });
    }
    function x() {
      v.remove(), D(), o._surface.focus();
    }
    A.addEventListener("click", R), w.addEventListener("click", x), E.addEventListener("keydown", function(O) {
      O.key === "Enter" ? (O.preventDefault(), R()) : O.key === "Escape" && (O.preventDefault(), x());
    });
  }
  B(h, d, n, "ln-editor");
})();
(function() {
  const h = "data-ln-validate", d = "lnValidate", b = "data-ln-validate-errors", p = "data-ln-validate-error", f = "ln-validate-valid", g = "ln-validate-invalid", n = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[d] !== void 0) return;
  function s(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const i = this, e = t.tagName, r = t.type, u = e === "SELECT" || r === "checkbox" || r === "radio";
    return this._onInput = function() {
      i._touched = !0, i.validate();
    }, this._onChange = function() {
      i._touched = !0, i.validate();
    }, this._onSetCustom = function(a) {
      const o = a.detail && a.detail.error;
      if (!o) return;
      i._customErrors.add(o), i._touched = !0;
      const c = t.closest(".form-element");
      if (c) {
        const m = c.querySelector("[" + p + '="' + o + '"]');
        m && m.classList.remove("hidden");
      }
      t.classList.remove(f), t.classList.add(g);
    }, this._onClearCustom = function(a) {
      const o = a.detail && a.detail.error, c = t.closest(".form-element");
      if (o) {
        if (i._customErrors.delete(o), c) {
          const m = c.querySelector("[" + p + '="' + o + '"]');
          m && m.classList.add("hidden");
        }
      } else
        i._customErrors.forEach(function(m) {
          if (c) {
            const l = c.querySelector("[" + p + '="' + m + '"]');
            l && l.classList.add("hidden");
          }
        }), i._customErrors.clear();
      i._touched && i.validate();
    }, u || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  s.prototype.validate = function() {
    const t = this.dom, i = t.validity, r = t.checkValidity() && this._customErrors.size === 0, u = t.closest(".form-element");
    if (u) {
      const o = u.querySelector("[" + b + "]");
      if (o) {
        const c = o.querySelectorAll("[" + p + "]");
        for (let m = 0; m < c.length; m++) {
          const l = c[m].getAttribute(p), _ = n[l];
          _ && (i[_] ? c[m].classList.remove("hidden") : c[m].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(f, r), t.classList.toggle(g, !r), S(t, r ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), r;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(f, g);
    const t = this.dom.closest(".form-element");
    if (t) {
      const i = t.querySelectorAll("[" + p + "]");
      for (let e = 0; e < i.length; e++)
        i[e].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(f, g), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, s, "ln-validate");
})();
(function() {
  const h = "data-ln-form", d = "lnForm", b = "data-ln-form-auto", p = "data-ln-form-debounce", f = "data-ln-form-typed", g = "data-ln-validate", n = "lnValidate";
  if (window[d] !== void 0) return;
  function s(t) {
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
    }, this._onLnFill = function(e) {
      e.target === i.dom && (e.detail ? i.fill(e.detail) : i.reset());
    }, this._onFormReset = function() {
      i.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        i._resetValidation();
      }, 0);
    }, t.addEventListener("ln-validate:valid", this._onValid), t.addEventListener("ln-validate:invalid", this._onInvalid), t.addEventListener("submit", this._onSubmit), t.addEventListener("ln-form:fill", this._onFill), t.addEventListener("ln-form:reset", this._onFormReset), t.addEventListener("ln-fill", this._onLnFill), t.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, t.hasAttribute(b)) {
      const e = parseInt(t.getAttribute(p)) || 0;
      this._onAutoInput = function() {
        e > 0 ? (clearTimeout(i._debounceTimer), i._debounceTimer = setTimeout(function() {
          i.submit();
        }, e)) : i.submit();
      }, t.addEventListener("input", this._onAutoInput), t.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  s.prototype._updateSubmitButton = function() {
    const t = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!t.length) return;
    const i = this.dom.querySelectorAll("[" + g + "]");
    let e = !1;
    if (i.length > 0) {
      let r = !1, u = !1;
      for (let a = 0; a < i.length; a++) {
        const o = i[a][n];
        o && o._touched && (r = !0), i[a].checkValidity() || (u = !0);
      }
      e = u || !r;
    }
    for (let r = 0; r < t.length; r++)
      t[r].disabled = e;
  }, s.prototype.fill = function(t) {
    const i = Ut(this.dom, t);
    for (let e = 0; e < i.length; e++) {
      const r = i[e], u = r.tagName === "SELECT" || r.type === "checkbox" || r.type === "radio";
      r.dispatchEvent(new Event(u ? "change" : "input", { bubbles: !0 }));
    }
  }, s.prototype.submit = function() {
    const t = this.dom.querySelectorAll("[" + g + "]");
    let i = !0;
    for (let r = 0; r < t.length; r++) {
      const u = t[r][n];
      u && (u.validate() || (i = !1));
    }
    if (!i) return;
    const e = Pt(this.dom, { typed: this.dom.hasAttribute(f) });
    S(this.dom, "ln-form:submit", { data: e });
  }, s.prototype.reset = function() {
    this.dom.reset();
    const t = this.dom.querySelectorAll("input, textarea, select");
    for (let i = 0; i < t.length; i++) {
      const e = t[i], r = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(r ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), S(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, s.prototype._resetValidation = function() {
    const t = this.dom.querySelectorAll("[" + g + "]");
    for (let i = 0; i < t.length; i++) {
      const e = t[i][n];
      e && e.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      const t = this.dom.querySelectorAll("[" + g + "]");
      for (let i = 0; i < t.length; i++)
        if (!t[i].checkValidity()) return !1;
      return !0;
    }
  }), s.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(h, d, s, "ln-form");
})();
(function() {
  const h = "lnFill";
  if (window[h] !== void 0) return;
  const d = { lnFillForm: !0, lnFillStore: !0 };
  document.addEventListener("click", function(b) {
    if (b.ctrlKey || b.metaKey || b.button === 1) return;
    const p = b.target.closest("[data-ln-fill-form]");
    if (!p) return;
    const f = p.getAttribute("data-ln-fill-form"), g = document.getElementById(f);
    if (!g) return;
    const n = {}, s = p.dataset;
    for (const i in s) {
      if (!i.startsWith("lnFill") || d[i]) continue;
      const e = i.slice(6);
      e && (n[e.charAt(0).toLowerCase() + e.slice(1)] = s[i]);
    }
    const t = Object.keys(n).length > 0;
    window.lnCore.lnFill(g, t ? n : null);
  }), window[h] = !0;
})();
(function() {
  const h = "data-ln-slug-from", d = "lnSlug";
  if (window[d] !== void 0) return;
  function b(f) {
    return String(f).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function p(f) {
    if (f.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", f.tagName), this;
    const g = f.form;
    if (!g)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", f), this;
    const n = f.getAttribute(h), s = g.elements[n];
    if (!s)
      return console.warn('[ln-slug] Source field "' + n + '" not found in form:', f), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + n + '" is a RadioNodeList (same-name group) — single source field required:', f), this;
    this.dom = f, this.source = s, this._pristine = f.value === "", this._mirroring = !1;
    const t = this;
    return this._onSource = function() {
      t._pristine && t._mirror();
    }, this._onSlug = function() {
      t._mirroring || (t._pristine = t.dom.value === "");
    }, s.addEventListener("input", this._onSource), f.addEventListener("input", this._onSlug), this;
  }
  p.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = b(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, p.prototype.destroy = function() {
    this.dom[d] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[d]);
  }, B(h, d, p, "ln-slug");
})();
(function() {
  const h = "data-ln-time", d = "lnTime";
  if (window[d] !== void 0) return;
  const b = {}, p = {};
  function f(A) {
    return A.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function g(A, w) {
    const C = (A || "") + "|" + JSON.stringify(w);
    return b[C] || (b[C] = new Intl.DateTimeFormat(A, w)), b[C];
  }
  function n(A) {
    const w = A || "";
    return p[w] || (p[w] = new Intl.RelativeTimeFormat(A, { numeric: "auto", style: "narrow" })), p[w];
  }
  const s = /* @__PURE__ */ new Set();
  let t = null;
  function i() {
    t || (t = setInterval(r, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function r() {
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
    return g(w, { dateStyle: "long", timeStyle: "short" }).format(A);
  }
  function a(A, w) {
    const C = /* @__PURE__ */ new Date(), D = { month: "short", day: "numeric" };
    return A.getFullYear() !== C.getFullYear() && (D.year = "numeric"), g(w, D).format(A);
  }
  function o(A, w) {
    return g(w, { dateStyle: "medium" }).format(A);
  }
  function c(A, w) {
    return g(w, { timeStyle: "short" }).format(A);
  }
  function m(A, w) {
    const C = Math.floor(Date.now() / 1e3), R = Math.floor(A.getTime() / 1e3) - C, x = Math.abs(R);
    if (x < 10) return n(w).format(0, "second");
    let O, F;
    if (x < 60)
      O = "second", F = R;
    else if (x < 3600)
      O = "minute", F = Math.round(R / 60);
    else if (x < 86400)
      O = "hour", F = Math.round(R / 3600);
    else if (x < 604800)
      O = "day", F = Math.round(R / 86400);
    else if (x < 2592e3)
      O = "week", F = Math.round(R / 604800);
    else
      return a(A, w);
    return n(w).format(F, O);
  }
  function l(A) {
    const w = A.dom.getAttribute("datetime");
    if (!w) return;
    const C = Number(w);
    if (isNaN(C)) return;
    const D = new Date(C * 1e3), R = A.dom.getAttribute(h) || "short", x = f(A.dom);
    let O;
    switch (R) {
      case "relative":
        O = m(D, x);
        break;
      case "full":
        O = u(D, x);
        break;
      case "date":
        O = o(D, x);
        break;
      case "time":
        O = c(D, x);
        break;
      default:
        O = a(D, x);
        break;
    }
    A.dom.textContent = O, R !== "full" && (A.dom.title = u(D, x));
  }
  function _(A) {
    return this.dom = A, l(this), A.getAttribute(h) === "relative" && (s.add(this), i()), this;
  }
  _.prototype.render = function() {
    l(this);
  }, _.prototype.destroy = function() {
    s.delete(this), s.size === 0 && e(), delete this.dom[d];
  };
  function v(A) {
    const w = A[d];
    if (!w) return;
    A.getAttribute(h) === "relative" ? (s.add(w), i()) : (s.delete(w), s.size === 0 && e()), l(w);
  }
  function E(A) {
    A.nodeType === 1 && A.hasAttribute && A.hasAttribute(h) && A[d] && l(A[d]);
  }
  B(h, d, _, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: E
  });
})();
(function() {
  const h = "data-ln-data-store", d = "lnDataStore";
  if (window[d] !== void 0) return;
  const b = "ln_app_cache", p = "_meta", f = "1.0";
  let g = null, n = null;
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
  function i(y) {
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
  function r() {
    return n || (n = new Promise((y) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), y(null);
      const L = e(), T = Object.keys(L), k = indexedDB.open(b);
      k.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), y(null);
      }, k.onsuccess = (I) => {
        const M = I.target.result, N = Array.from(M.objectStoreNames);
        if (!(!N.includes(p) || T.some((pt) => !N.includes(pt))))
          return u(M), g = M, y(M);
        const J = M.version;
        M.close();
        const tt = indexedDB.open(b, J + 1);
        tt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, tt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), y(null);
        }, tt.onupgradeneeded = (pt) => {
          const rt = pt.target.result;
          rt.objectStoreNames.contains(p) || rt.createObjectStore(p, { keyPath: "key" });
          for (const St of T)
            if (!rt.objectStoreNames.contains(St)) {
              const ne = rt.createObjectStore(St, { keyPath: "id" });
              for (const It of L[St].indexes)
                ne.createIndex(It, It, { unique: !1 });
            }
        }, tt.onsuccess = (pt) => {
          const rt = pt.target.result;
          u(rt), g = rt, y(rt);
        };
      };
    }), n);
  }
  function u(y) {
    y.onversionchange = () => {
      y.close(), g = null, n = null;
    };
  }
  function a() {
    return g ? Promise.resolve(g) : (n = null, r());
  }
  async function o(y) {
    if (!mt() || !y) return y;
    const L = { ...y }, T = L.id, k = L._pending, I = await he(L);
    return !I || !I.encrypted ? y : {
      id: T,
      _pending: k,
      encrypted: !0,
      iv: I.iv,
      data: I.data
    };
  }
  async function c(y) {
    return !y || !y.encrypted || !mt() ? y : fe(y);
  }
  const m = (y, L) => a().then((T) => T ? T.transaction(y, L).objectStore(y) : null);
  function l(y) {
    return new Promise((L, T) => {
      y.onsuccess = () => L(y.result), y.onerror = () => {
        i(y.error), T(y.error);
      };
    });
  }
  const _ = (y) => m(y, "readonly").then((L) => L ? l(L.getAll()) : []).then((L) => mt() ? Promise.all(L.map((T) => c(T))) : L), v = (y, L) => m(y, "readonly").then((T) => T ? l(T.get(L)) : null).then((T) => T ? c(T) : null), E = (y, L) => (mt() ? o(L) : Promise.resolve(L)).then((k) => m(y, "readwrite").then((I) => I ? l(I.put(k)) : null)), A = (y, L) => m(y, "readwrite").then((T) => T ? l(T.delete(L)) : null), w = (y) => m(y, "readwrite").then((L) => L ? l(L.clear()) : null), C = (y) => m(y, "readonly").then((L) => L ? l(L.count()) : 0), D = (y) => m(p, "readonly").then((L) => L ? l(L.get(y)) : null), R = (y, L) => m(p, "readwrite").then((T) => {
    if (T)
      return L.key = y, l(T.put(L));
  });
  function x(y) {
    this.dom = y, this._name = y.getAttribute(h);
    const L = y.getAttribute("data-ln-data-store-stale") || y.getAttribute("data-ln-store-stale"), T = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(T) ? 300 : T;
    const k = y.getAttribute("data-ln-data-store-search-fields") || y.getAttribute("data-ln-store-search-fields") || "";
    return this._searchFields = k.split(",").map((I) => I.trim()).filter(Boolean), this._noAutosync = y.hasAttribute("data-ln-data-store-no-autosync") || y.hasAttribute("data-ln-store-no-autosync"), this._handlers = null, this._pendingSnapshots = {}, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, this.presenters = null, s[this._name] = this, O(this), vt(this), this;
  }
  function O(y) {
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
      return y._pendingSnapshots[I.join(",")] = k, ut(y._name, I).then(() => {
        y.totalCount -= I.length, S(y.dom, "ln-store:deleted", { store: y._name, ids: I }), S(y.dom, "ln-store:request-remote-bulk-delete", { ids: I });
      });
    }).catch((T) => console.error("[ln-data-store] Optimistic bulk delete failed:", T));
  }
  function vt(y) {
    r().then(() => D(y._name)).then((L) => {
      L && L.schema_version === f ? (y.lastSyncedAt = L.last_synced_at || null, y.totalCount = L.record_count || 0, y.totalCount > 0 ? (y.isLoaded = !0, S(y.dom, "ln-store:ready", { store: y._name, count: y.totalCount, source: "cache" }), ct(y) && Y(y)) : Y(y)) : L && L.schema_version !== f ? w(y._name).then(() => R(y._name, { schema_version: f, last_synced_at: null, record_count: 0 })).then(() => Y(y)) : Y(y);
    });
  }
  function ct(y) {
    return y._staleThreshold === -1 ? !1 : y.lastSyncedAt ? Math.floor(Date.now() / 1e3) - y.lastSyncedAt > y._staleThreshold : !0;
  }
  function Y(y) {
    y.isSyncing = !0, S(y.dom, "ln-store:request-remote-sync", { since: y.lastSyncedAt });
  }
  function dt(y, L) {
    return a().then((T) => T ? (mt() ? Promise.all(L.map((I) => o(I))) : Promise.resolve(L)).then((I) => new Promise((M, N) => {
      const j = T.transaction(y, "readwrite"), J = j.objectStore(y);
      I.forEach((tt) => J.put(tt)), j.oncomplete = () => M(), j.onerror = () => {
        i(j.error), N(j.error);
      };
    })) : void 0);
  }
  function ut(y, L) {
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
      y.isLoaded && !y.isSyncing && ct(y) && Y(y);
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
  const ht = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function nt(y, L) {
    if (!L || !L.field) return y;
    const { field: T, direction: k } = L, I = k === "desc";
    return [...y].sort((M, N) => {
      const j = M[T], J = N[T];
      if (j == null && J == null) return 0;
      if (j == null) return I ? 1 : -1;
      if (J == null) return I ? -1 : 1;
      const tt = typeof j == "string" && typeof J == "string" ? ht.compare(j, J) : j < J ? -1 : j > J ? 1 : 0;
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
  function ft(y, L, T) {
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
  x.prototype.getAll = function(y = {}) {
    const L = this;
    return _(L._name).then((T) => {
      const k = T.length;
      y.filters && (T = G(T, y.filters)), y.search && (T = ft(T, y.search, L._searchFields));
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
  }, x.prototype.getById = function(y) {
    return v(this._name, y).then((L) => L ? st(this, [L])[0] : null);
  }, x.prototype.count = function(y) {
    return y ? _(this._name).then((L) => G(L, y).length) : C(this._name);
  }, x.prototype.aggregate = function(y, L) {
    return _(this._name).then((T) => it(T, y, L));
  }, x.prototype.setPresenters = function(y) {
    this.presenters = y;
  }, x.prototype.applySync = function(y, L, T) {
    const k = this, I = y.length > 0 || L.length > 0;
    let M = Promise.resolve();
    return y.length > 0 && (M = M.then(() => dt(k._name, y))), L.length > 0 && (M = M.then(() => ut(k._name, L))), M.then(() => C(k._name)).then((N) => (k.totalCount = N, R(k._name, {
      schema_version: f,
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
  }, x.prototype.confirmMutation = function(y, L, T) {
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
  }, x.prototype.revertMutation = function(y, L, T) {
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
        return !N || !N.length ? Promise.resolve() : dt(k._name, N).then(() => {
          k.totalCount += N.length, delete k._pendingSnapshots[y], S(k.dom, "ln-store:reverted", { store: k._name, record: null, ids: y.split(","), action: "bulk-delete", error: I });
        });
      }
    };
    return M[L] ? M[L]() : Promise.resolve();
  }, x.prototype.resolveConflict = function(y, L, T) {
    const k = this._pendingSnapshots[y];
    return k ? E(this._name, k).then(() => {
      delete this._pendingSnapshots[y], S(this.dom, "ln-store:conflict", {
        store: this._name,
        local: k,
        remote: L,
        field_diffs: T || null
      });
    }) : Promise.resolve();
  }, x.prototype.forceSync = function() {
    Y(this);
  }, x.prototype.fullReload = function() {
    const y = this;
    return w(y._name).then(() => {
      y.isLoaded = !1, y.lastSyncedAt = null, y.totalCount = 0, Y(y);
    });
  }, x.prototype.destroy = function() {
    if (this._handlers) {
      for (const [y, L] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-store:request-${y}`, L);
      this._handlers = null;
    }
    delete s[this._name], Object.keys(s).length === 0 && (q && (document.removeEventListener("visibilitychange", q), q = null), H && (window.removeEventListener("online", H), H = null), P && (window.removeEventListener("offline", P), P = null)), delete this.dom[d], S(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function yt() {
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
  B(h, d, x, "ln-data-store"), window[d].clearAll = yt, window[d].init = window[d], window[d].setStorageKey = Mt, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Mt);
})();
(function() {
  const h = "data-ln-api-connector", d = "lnApiConnector", b = "lnConnector";
  if (window[d] !== void 0) return;
  function p(n) {
    return this.dom = n, n[d] = this, n[b] = this, this.refreshConfig(), this._handlers = null, f(this), this;
  }
  p.prototype.refreshConfig = function() {
    const n = this.dom;
    this.baseUrl = n.getAttribute("data-ln-api-base-url") || "", this.path = n.getAttribute("data-ln-api-path") || "", this.credentials = "same-origin";
    const s = n.getAttribute("data-ln-api-headers") || "";
    this.headers = Kt(s, "ln-api-connector"), (s.toLowerCase().includes("authorization") || s.toLowerCase().includes("bearer") || s.toLowerCase().includes("basic")) && console.warn("[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(n, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers
    });
  }, p.prototype.fetchDelta = function(n) {
    const s = this;
    let t = V(s.baseUrl, s.path);
    return n != null && n !== "" && (t += (t.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n)), window.fetch(t, { method: "GET", headers: W(s.headers), credentials: s.credentials }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    });
  }, p.prototype.create = function(n) {
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
  }, p.prototype.update = function(n, s) {
    const t = this;
    return window.fetch(V(t.baseUrl, t.path, n), {
      method: "PUT",
      headers: W(t.headers),
      credentials: t.credentials,
      body: JSON.stringify(s)
    }).then((i) => {
      if (i.ok) return i.json();
      if (i.status === 409) return i.json().then((e) => {
        const r = new Error("Conflict");
        throw r.status = 409, r.data = e, r;
      });
      throw new Error("HTTP " + i.status + ": " + i.statusText);
    });
  }, p.prototype.delete = function(n) {
    const s = this;
    return window.fetch(V(s.baseUrl, s.path, n), {
      method: "DELETE",
      headers: W(s.headers),
      credentials: s.credentials
    }).then((t) => {
      if (!t.ok) throw new Error("HTTP " + t.status + ": " + t.statusText);
      return t.json();
    });
  }, p.prototype.bulkDelete = function(n) {
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
  function f(n) {
    n._handlers = {
      sync: function(t) {
        const i = t.detail || {};
        n.fetchDelta(i.since).then(function(e) {
          S(n.dom, "ln-api-connector:fetched", { data: e, since: i.since });
        }).catch(function(e) {
          S(n.dom, "ln-api-connector:error", {
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
          S(n.dom, "ln-api-connector:created", { record: e, tempId: i.tempId });
        }).catch(function(e) {
          S(n.dom, "ln-api-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: i.tempId
          });
        });
      },
      update: function(t) {
        const i = t.detail || {}, e = Object.assign({}, i.data);
        i.expected_version !== void 0 && (e.expected_version = i.expected_version), n.update(i.id, e).then(function(r) {
          S(n.dom, "ln-api-connector:updated", { record: r, id: i.id });
        }).catch(function(r) {
          S(n.dom, "ln-api-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            id: i.id,
            conflictData: r.status === 409 ? r.data : null
          });
        });
      },
      delete: function(t) {
        const i = t.detail || {};
        n.delete(i.id).then(function(e) {
          S(n.dom, "ln-api-connector:deleted", { response: e, id: i.id });
        }).catch(function(e) {
          S(n.dom, "ln-api-connector:error", {
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
          S(n.dom, "ln-api-connector:bulk-deleted", { response: e, ids: i.ids });
        }).catch(function(e) {
          S(n.dom, "ln-api-connector:error", {
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
  p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const n = this;
    n._handlers && (["ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), S(this.dom, "ln-api-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[b];
  };
  function g(n) {
    const s = n[d];
    s && s.refreshConfig();
  }
  B(h, d, p, "ln-api-connector", {
    extraAttributes: [
      "data-ln-api-base-url",
      "data-ln-api-path",
      "data-ln-api-headers"
    ],
    onAttributeChange: g
  });
})();
(function() {
  const h = "data-ln-couchdb-connector", d = "lnCouchDbConnector", b = "lnConnector";
  if (window[d] !== void 0) return;
  function p(n) {
    return this.dom = n, n[d] = this, n[b] = this, this.refreshConfig(), this._handlers = null, f(this), this;
  }
  p.prototype.refreshConfig = function() {
    const n = this.dom;
    this.url = n.getAttribute("data-ln-couchdb-url") || "", this.db = n.getAttribute("data-ln-couchdb-db") || "", this.auth = n.getAttribute("data-ln-couchdb-auth") || "", this.credentials = "same-origin";
    const s = n.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Kt(s, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), s.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), S(n, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  }, p.prototype.fetchDelta = function(n) {
    const s = this, t = ["include_docs=true", "feed=normal"];
    n && t.push("since=" + encodeURIComponent(n));
    const i = V(s.url, s.db, "_changes") + "?" + t.join("&");
    return window.fetch(i, { method: "GET", headers: W(s.headers, s.auth), credentials: s.credentials }).then((e) => {
      if (!e.ok) throw new Error("HTTP " + e.status + ": " + e.statusText);
      return e.json();
    }).then((e) => {
      const r = e.results || [];
      return {
        data: r.filter((u) => !u.deleted && u.doc).map((u) => Object.assign({}, u.doc, { id: u.doc._id })),
        deleted: r.filter((u) => u.deleted).map((u) => u.id),
        synced_at: e.last_seq || n || ""
      };
    });
  }, p.prototype.create = function(n) {
    const s = this, t = Object.assign({ _id: n.id }, n);
    return t._id || delete t._id, window.fetch(V(s.url, s.db), {
      method: "POST",
      headers: W(s.headers, s.auth),
      credentials: s.credentials,
      body: JSON.stringify(t)
    }).then((i) => {
      if (!i.ok) throw new Error("HTTP " + i.status + ": " + i.statusText);
      return i.json();
    }).then((i) => Object.assign({}, t, { id: i.id, _id: i.id, _rev: i.rev }));
  }, p.prototype.update = function(n, s) {
    const t = this, i = Object.assign({ id: String(n), _id: String(n) }, s), e = i._rev || i.rev;
    return (e ? Promise.resolve(e) : window.fetch(V(t.url, t.db, null, n), { method: "GET", headers: W(t.headers, t.auth), credentials: t.credentials }).then((u) => {
      if (!u.ok) throw new Error("Could not retrieve document for revision mapping");
      return u.json().then((a) => a._rev);
    })).then((u) => {
      const a = Object.assign({}, i, { _rev: u });
      delete a.rev;
      const o = Object.assign(W(t.headers, t.auth), { "If-Match": u });
      return window.fetch(V(t.url, t.db, null, n), {
        method: "PUT",
        headers: o,
        credentials: t.credentials,
        body: JSON.stringify(a)
      }).then((c) => {
        if (c.ok) return c.json().then((m) => Object.assign({}, a, { _rev: m.rev }));
        if (c.status === 409) return c.json().then((m) => {
          const l = new Error("Conflict");
          throw l.status = 409, l.data = m, l;
        });
        throw new Error("HTTP " + c.status + ": " + c.statusText);
      });
    });
  }, p.prototype.delete = function(n, s) {
    const t = this;
    return (s ? Promise.resolve(s) : window.fetch(V(t.url, t.db, null, n), { method: "GET", headers: W(t.headers, t.auth), credentials: t.credentials }).then((e) => {
      if (!e.ok) throw new Error("Could not retrieve document for revision delete");
      return e.json().then((r) => r._rev);
    })).then((e) => {
      const r = V(t.url, t.db, null, n) + "?rev=" + encodeURIComponent(e);
      return window.fetch(r, { method: "DELETE", headers: W(t.headers, t.auth), credentials: t.credentials }).then((u) => {
        if (!u.ok) throw new Error("HTTP " + u.status + ": " + u.statusText);
        return u.json();
      });
    });
  }, p.prototype.bulkDelete = function(n) {
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
      const e = (t.rows || []).filter((r) => !r.error && r.value && r.value.rev).map((r) => ({ _id: r.id, _rev: r.value.rev, _deleted: !0 }));
      return e.length === 0 ? { ok: !0, deletedCount: 0 } : window.fetch(V(s.url, s.db, "_bulk_docs"), {
        method: "POST",
        headers: W(s.headers, s.auth),
        credentials: s.credentials,
        body: JSON.stringify({ docs: e })
      }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
        return r.json();
      }).then((r) => ({ ok: !0, results: r, deletedCount: e.length }));
    });
  };
  function f(n) {
    n._handlers = {
      sync: function(t) {
        const i = t.detail || {};
        n.fetchDelta(i.since).then(function(e) {
          S(n.dom, "ln-couchdb-connector:fetched", { data: e, since: i.since });
        }).catch(function(e) {
          S(n.dom, "ln-couchdb-connector:error", {
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
          S(n.dom, "ln-couchdb-connector:created", { record: e, tempId: i.tempId });
        }).catch(function(e) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: e.message,
            status: e.status || 0,
            tempId: i.tempId
          });
        });
      },
      update: function(t) {
        const i = t.detail || {}, e = Object.assign({}, i.data);
        i.expected_version !== void 0 && (e._rev = i.expected_version), n.update(i.id, e).then(function(r) {
          S(n.dom, "ln-couchdb-connector:updated", { record: r, id: i.id });
        }).catch(function(r) {
          S(n.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            id: i.id,
            conflictData: r.status === 409 ? r.data : null
          });
        });
      },
      delete: function(t) {
        const i = t.detail || {};
        n.delete(i.id, i.rev).then(function(e) {
          S(n.dom, "ln-couchdb-connector:deleted", { response: e, id: i.id });
        }).catch(function(e) {
          S(n.dom, "ln-couchdb-connector:error", {
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
          S(n.dom, "ln-couchdb-connector:bulk-deleted", { response: e, ids: i.ids });
        }).catch(function(e) {
          S(n.dom, "ln-couchdb-connector:error", {
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
  p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const n = this;
    n._handlers && (["ln-couchdb-connector", "ln-api-connector", "ln-rest-connector"].forEach(function(t) {
      n.dom.removeEventListener(t + ":request-sync", n._handlers.sync), n.dom.removeEventListener(t + ":request-fetch", n._handlers.sync), n.dom.removeEventListener(t + ":request-create", n._handlers.create), n.dom.removeEventListener(t + ":request-update", n._handlers.update), n.dom.removeEventListener(t + ":request-delete", n._handlers.delete), n.dom.removeEventListener(t + ":request-bulk-delete", n._handlers.bulkDelete);
    }), n._handlers = null), S(this.dom, "ln-couchdb-connector:destroyed", { target: this.dom }), delete this.dom[d], delete this.dom[b];
  };
  function g(n) {
    const s = n[d];
    s && s.refreshConfig();
  }
  B(h, d, p, "ln-couchdb-connector", {
    extraAttributes: [
      "data-ln-couchdb-url",
      "data-ln-couchdb-db",
      "data-ln-couchdb-auth",
      "data-ln-couchdb-headers"
    ],
    onAttributeChange: g
  });
})();
(function() {
  const h = "data-ln-data-coordinator", d = "lnDataCoordinator", b = "lnCoordinator";
  if (window[d] !== void 0) return;
  function p(n) {
    return this.dom = n, this._name = n.getAttribute(h), n[d] = this, n[b] = this, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this.refreshMapper(), f(this), this;
  }
  p.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const s = this.dom.getAttribute("data-ln-data-mapper") || this.dom.getAttribute("data-ln-data-coordinator");
    s && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(s)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(t) {
      return t;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(t) {
      return t;
    });
  }, p.prototype.findChildren = function() {
    const n = this.dom.querySelector("[data-ln-data-store]"), s = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]");
    return {
      storeEl: n,
      connectorEl: s,
      store: n ? n.lnDataStore || n.lnStore : null,
      connector: s ? s.lnConnector || s.lnApiConnector || s.lnCouchDbConnector : null
    };
  };
  function f(n) {
    n._handlers = {
      sync: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        const i = s.detail.since;
        t.connector.fetchDelta(i).then(function(e) {
          let r = [], u = [], a = null;
          e && Array.isArray(e) ? (r = e, a = Math.floor(Date.now() / 1e3)) : e && (r = Array.isArray(e.data) ? e.data : [], u = Array.isArray(e.deleted) ? e.deleted : [], a = e.synced_at !== void 0 ? e.synced_at : e.since !== void 0 ? e.since : null);
          const o = r.map((c) => n.mapper.ingress(c));
          t.store.applySync(o, u, a);
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Sync failed:", e);
        });
      },
      create: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const i = s.detail.tempId, e = s.detail.data || {}, r = n.mapper.egress(e);
        t.connector.create(r).then(function(u) {
          const a = n.mapper.ingress(u);
          t.store.confirmMutation(i, a, "create");
        }).catch(function(u) {
          console.error("[ln-data-coordinator] Create mutation failed:", u), t.store.revertMutation(i, "create", u.message || u);
        });
      },
      update: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const i = s.detail.id, e = s.detail.expected_version;
        t.store.getById(i).then(function(r) {
          if (!r) throw new Error("Record not found in cache store: " + i);
          const u = Object.assign({}, r);
          delete u._pending;
          const a = n.mapper.egress(u);
          return t.connector.update(i, a, e);
        }).then(function(r) {
          const u = n.mapper.ingress(r);
          t.store.confirmMutation(i, u, "update");
        }).catch(function(r) {
          if (console.error("[ln-data-coordinator] Update mutation failed:", r), r.status === 409) {
            const u = r.data && r.data.remote ? n.mapper.ingress(r.data.remote) : null, a = r.data ? r.data.field_diffs : null;
            t.store.resolveConflict(i, u, a);
          } else
            t.store.revertMutation(i, "update", r.message || r);
        });
      },
      delete: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const i = s.detail.id;
        t.connector.delete(i).then(function() {
          t.store.confirmMutation(i, null, "delete");
        }).catch(function(e) {
          console.error("[ln-data-coordinator] Delete mutation failed:", e), t.store.revertMutation(i, "delete", e.message || e);
        });
      },
      bulkDelete: function(s) {
        n.refreshMapper();
        const t = n.findChildren();
        if (!t.store || !t.connector) return;
        const i = s.detail.ids || [], e = i.join(",");
        t.connector.bulkDelete(i).then(function() {
          t.store.confirmMutation(e, null, "bulk-delete");
        }).catch(function(r) {
          console.error("[ln-data-coordinator] Bulk delete mutation failed:", r), t.store.revertMutation(e, "bulk-delete", r.message || r);
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
  p.prototype._ownsStore = function(n) {
    const s = this.findChildren();
    return !!(s.store && s.store._name === n && n);
  }, p.prototype._serveData = function(n, s) {
    const t = n.target, i = s === "table" ? "data-ln-table-store" : "data-ln-list-store", e = t.getAttribute(i);
    if (!e || !this._ownsStore(e)) return;
    this._boundQueries.set(t, {
      sort: n.detail.sort,
      filters: n.detail.filters,
      search: n.detail.search
    });
    const r = this.findChildren().store;
    if (!r.isLoaded) {
      S(t, "ln-" + s + ":set-loading", { loading: !0 });
      return;
    }
    const u = this, a = { sort: n.detail.sort, filters: n.detail.filters, search: n.detail.search };
    r.getAll(a).then(function(o) {
      const c = { data: o.data, total: o.total, filtered: o.filtered };
      S(t, "ln-" + s + ":set-data", c), u._boundDelivered.set(t, !0);
    });
  }, p.prototype._serveOptions = function(n) {
    const s = n.target, t = s.getAttribute("data-ln-options");
    if (!this._ownsStore(t)) return;
    this.findChildren().store.getAll({}).then(function(e) {
      S(s, "ln-options:set-data", { data: e.data });
    });
  }, p.prototype._serveStat = function(n) {
    const s = n.target, t = s.getAttribute("data-ln-stat");
    if (!this._ownsStore(t)) return;
    const i = n.detail.filters || null;
    this.findChildren().store.count(i).then(function(r) {
      S(s, "ln-stat:set-count", { count: r });
    });
  }, p.prototype._refreshAll = function() {
    const n = this, s = document.querySelectorAll("[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]");
    for (let t = 0; t < s.length; t++) {
      const i = s[t];
      let e, r;
      if (i.hasAttribute("data-ln-table-store") ? (e = i.getAttribute("data-ln-table-store"), r = "table") : i.hasAttribute("data-ln-list-store") ? (e = i.getAttribute("data-ln-list-store"), r = "list") : i.hasAttribute("data-ln-options") ? (e = i.getAttribute("data-ln-options"), r = "options") : i.hasAttribute("data-ln-stat") && (e = i.getAttribute("data-ln-stat"), r = "stat"), !this._ownsStore(e)) continue;
      const u = this.findChildren().store;
      if (r === "table" || r === "list") {
        const a = n._boundQueries.get(i) || { sort: null, filters: {}, search: "" };
        (function(o, c) {
          u.getAll(a).then(function(m) {
            const l = { data: m.data, total: m.total, filtered: m.filtered };
            S(o, "ln-" + c + ":set-data", l), n._boundDelivered.set(o, !0);
          });
        })(i, r);
      } else if (r === "options")
        (function(a) {
          u.getAll({}).then(function(o) {
            S(a, "ln-options:set-data", { data: o.data });
          });
        })(i);
      else if (r === "stat") {
        const a = i.getAttribute("data-ln-stat-filter");
        let o = null;
        if (a) {
          const c = a.indexOf(":");
          if (c !== -1) {
            const m = a.slice(0, c), l = a.slice(c + 1);
            o = {}, o[m] = [l];
          }
        }
        (function(c, m) {
          u.count(m).then(function(l) {
            S(c, "ln-stat:set-count", { count: l });
          });
        })(i, o);
      }
    }
  }, p.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const n = this;
    n._handlers && (n.dom.removeEventListener("ln-store:request-remote-sync", n._handlers.sync), n.dom.removeEventListener("ln-store:request-remote-create", n._handlers.create), n.dom.removeEventListener("ln-store:request-remote-update", n._handlers.update), n.dom.removeEventListener("ln-store:request-remote-delete", n._handlers.delete), n.dom.removeEventListener("ln-store:request-remote-bulk-delete", n._handlers.bulkDelete), document.removeEventListener("ln-table:request-data", n._handlers.reqTableData), document.removeEventListener("ln-list:request-data", n._handlers.reqListData), document.removeEventListener("ln-options:request-data", n._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", n._handlers.reqStat), n.dom.removeEventListener("ln-store:ready", n._handlers.refresh), n.dom.removeEventListener("ln-store:loaded", n._handlers.refresh), n.dom.removeEventListener("ln-store:created", n._handlers.refresh), n.dom.removeEventListener("ln-store:updated", n._handlers.refresh), n.dom.removeEventListener("ln-store:deleted", n._handlers.refresh), n.dom.removeEventListener("ln-store:synced", n._handlers.refreshSynced), n._handlers = null), n._boundQueries = null, n._boundDelivered = null, delete this.dom[d], delete this.dom[b];
  };
  function g(n, s) {
    const t = n[d];
    t && s === "data-ln-data-mapper" && t.refreshMapper();
  }
  B(h, d, p, "ln-data-coordinator", {
    extraAttributes: [
      "data-ln-data-mapper"
    ],
    onAttributeChange: g
  });
})();
(function() {
  const h = "data-ln-options", d = "lnOptions";
  if (window[d] !== void 0) return;
  function b(p) {
    this.dom = p, this._storeName = p.getAttribute(h), this._valueField = p.getAttribute("data-ln-options-value") || "id", this._labelField = p.getAttribute("data-ln-options-label") || "name";
    const f = this;
    return this._onSetData = function(g) {
      f._rebuild(g.detail.data || []);
    }, p.addEventListener("ln-options:set-data", this._onSetData), S(p, "ln-options:request-data", { options: this._storeName }), this;
  }
  b.prototype._rebuild = function(p) {
    const f = this.dom, g = this._valueField, n = this._labelField, s = f.value, t = f.querySelectorAll("option");
    for (let e = t.length - 1; e >= 0; e--)
      t[e].value !== "" && f.removeChild(t[e]);
    for (let e = 0; e < p.length; e++) {
      const r = p[e], u = document.createElement("option");
      u.value = String(r[g]), u.textContent = r[n] != null ? r[n] : "", f.appendChild(u);
    }
    const i = f.options;
    for (let e = 0; e < i.length; e++)
      if (i[e].value === s) {
        f.value = s;
        break;
      }
  }, b.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[d]);
  }, B(h, d, b, "ln-options");
})();
(function() {
  const h = "data-ln-stat", d = "lnStat";
  if (window[d] !== void 0) return;
  function b(f) {
    if (!f) return null;
    const g = f.indexOf(":");
    if (g === -1) return null;
    const n = f.slice(0, g), s = f.slice(g + 1), t = {};
    return t[n] = [s], t;
  }
  function p(f) {
    return this.dom = f, this._storeName = f.getAttribute(h), this._filters = b(f.getAttribute("data-ln-stat-filter")), this._onSetCount = function(g) {
      f.textContent = String(g.detail.count), f.classList.remove("is-loading");
    }, f.addEventListener("ln-stat:set-count", this._onSetCount), S(f, "ln-stat:request-count", {
      stat: this._storeName,
      filters: this._filters
    }), this;
  }
  p.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[d]);
  }, B(h, d, p, "ln-stat");
})();
(function() {
  const h = "data-ln-store-notify", d = "lnStoreNotify";
  if (window[d] !== void 0) return;
  function b(f, g, n) {
    window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
      detail: { type: f, title: g, message: n }
    }));
  }
  function p(f) {
    this.dom = f, this._savedTitle = f.getAttribute("data-ln-store-notify-saved") || null, this._deletedTitle = f.getAttribute("data-ln-store-notify-deleted") || null, this._failedTitle = f.getAttribute("data-ln-store-notify-failed") || null;
    const g = this;
    return this._onConfirmed = function(n) {
      const s = n.detail || {}, t = s.action || "confirmed";
      let i, e;
      if (t === "create" || t === "update")
        i = g._savedTitle || t, e = s.record && s.record.name ? s.record.name : void 0;
      else if (t === "delete")
        i = g._deletedTitle || t, e = void 0;
      else if (t === "bulk-delete") {
        i = g._deletedTitle || t;
        const r = s.ids ? s.ids.length : 0;
        e = r ? String(r) : void 0;
      } else
        i = g._savedTitle || t, e = void 0;
      b("success", i, e);
    }, this._onReverted = function(n) {
      const s = n.detail || {}, t = s.action || "reverted", i = g._failedTitle || t, e = s.error ? String(s.error) : void 0;
      b("error", i, e);
    }, f.addEventListener("ln-store:confirmed", this._onConfirmed), f.addEventListener("ln-store:reverted", this._onReverted), this;
  }
  p.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-store:confirmed", this._onConfirmed), this.dom.removeEventListener("ln-store:reverted", this._onReverted), delete this.dom[d]);
  }, B(h, d, p, "ln-store-notify");
})();
(function() {
  const h = "ln-icons-sprite", d = "#ln-", b = "#lnc-", p = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
  let g = null;
  const n = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", i = "lni:v", e = "1";
  function r() {
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
  r();
  function u() {
    return g || (g = document.getElementById(h), g || (g = document.createElementNS("http://www.w3.org/2000/svg", "svg"), g.id = h, g.setAttribute("hidden", ""), g.setAttribute("aria-hidden", "true"), g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(g, document.body.firstChild))), g;
  }
  function a(_) {
    return _.indexOf(b) === 0 ? s + "/" + _.slice(b.length) + ".svg" : n + "/" + _.slice(d.length) + ".svg";
  }
  function o(_, v) {
    const E = v.match(/viewBox="([^"]+)"/), A = E ? E[1] : "0 0 24 24", w = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = w ? w[1].trim() : "", D = v.match(/<svg([^>]*)>/i), R = D ? D[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = _, x.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(O) {
      const F = R.match(new RegExp(O + '="([^"]*)"'));
      F && x.setAttribute(O, F[1]);
    }), x.innerHTML = C, u().querySelector("defs").appendChild(x);
  }
  function c(_) {
    if (p.has(_) || f.has(_) || _.indexOf(b) === 0 && !s) return;
    const v = _.slice(1);
    try {
      const E = localStorage.getItem(t + v);
      if (E) {
        o(v, E), p.add(_);
        return;
      }
    } catch {
    }
    f.add(_), fetch(a(_)).then(function(E) {
      if (!E.ok) throw new Error(E.status);
      return E.text();
    }).then(function(E) {
      o(v, E), p.add(_), f.delete(_);
      try {
        localStorage.setItem(t + v, E);
      } catch {
      }
    }).catch(function() {
      f.delete(_);
    });
  }
  function m(_) {
    const v = 'use[href^="' + d + '"], use[href^="' + b + '"]', E = _.querySelectorAll ? _.querySelectorAll(v) : [];
    if (_.matches && _.matches(v)) {
      const A = _.getAttribute("href");
      A && c(A);
    }
    Array.prototype.forEach.call(E, function(A) {
      const w = A.getAttribute("href");
      w && c(w);
    });
  }
  function l() {
    m(document), new MutationObserver(function(_) {
      _.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(E) {
            E.nodeType === 1 && m(E);
          });
        else if (v.type === "attributes" && v.attributeName === "href") {
          const E = v.target.getAttribute("href");
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
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const h = "data-ln-debug", d = "lnDebug";
  if (window[d] !== void 0) return;
  function b(p) {
    return this.dom = p, this;
  }
  b.prototype.destroy = function() {
    delete this.dom[d];
  }, B(h, d, b, "ln-debug");
})();
