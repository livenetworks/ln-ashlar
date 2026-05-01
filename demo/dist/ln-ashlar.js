const vt = {};
function yt(h, a) {
  vt[h] || (vt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const v = vt[h];
  return v ? v.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + h + '" not found'), null);
}
function T(h, a, v) {
  h.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: v || {}
  }));
}
function K(h, a, v) {
  const m = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: v || {}
  });
  return h.dispatchEvent(m), m;
}
function Z(h, a) {
  if (!h || !a) return h;
  const v = h.querySelectorAll("[data-ln-field]");
  for (let s = 0; s < v.length; s++) {
    const n = v[s], t = n.getAttribute("data-ln-field");
    a[t] != null && (n.textContent = a[t]);
  }
  const m = h.querySelectorAll("[data-ln-attr]");
  for (let s = 0; s < m.length; s++) {
    const n = m[s], t = n.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const i = e[0].trim(), r = e[1].trim();
      a[r] != null && n.setAttribute(i, a[r]);
    }
  }
  const p = h.querySelectorAll("[data-ln-show]");
  for (let s = 0; s < p.length; s++) {
    const n = p[s], t = n.getAttribute("data-ln-show");
    t in a && n.classList.toggle("hidden", !a[t]);
  }
  const g = h.querySelectorAll("[data-ln-class]");
  for (let s = 0; s < g.length; s++) {
    const n = g[s], t = n.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const i = e[0].trim(), r = e[1].trim();
      r in a && n.classList.toggle(i, !!a[r]);
    }
  }
  return h;
}
function kt(h, a) {
  if (!h || !a) return h;
  const v = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; v.nextNode(); ) {
    const m = v.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(p, g) {
        return a[g] !== void 0 ? a[g] : "";
      }
    ));
  }
  return h;
}
function z(h, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      z(h, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function at(h, a, v) {
  if (h) {
    const m = h.querySelector('[data-ln-template="' + a + '"]');
    if (m) return m.content.cloneNode(!0);
  }
  return yt(a, v);
}
function Ot(h, a) {
  const v = {}, m = h.querySelectorAll("[" + a + "]");
  for (let p = 0; p < m.length; p++)
    v[m[p].getAttribute(a)] = m[p].textContent, m[p].remove();
  return v;
}
function U(h, a, v, m) {
  if (h.nodeType !== 1) return;
  const g = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", s = Array.from(h.querySelectorAll(g));
  h.matches && h.matches(g) && s.push(h);
  for (const n of s)
    n[v] || (n[v] = new m(n));
}
function ct(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function St(h) {
  const a = {}, v = h.elements;
  for (let m = 0; m < v.length; m++) {
    const p = v[m];
    if (!(!p.name || p.disabled || p.type === "file" || p.type === "submit" || p.type === "button"))
      if (p.type === "checkbox")
        a[p.name] || (a[p.name] = []), p.checked && a[p.name].push(p.value);
      else if (p.type === "radio")
        p.checked && (a[p.name] = p.value);
      else if (p.type === "select-multiple") {
        a[p.name] = [];
        for (let g = 0; g < p.options.length; g++)
          p.options[g].selected && a[p.name].push(p.options[g].value);
      } else
        a[p.name] = p.value;
  }
  return a;
}
function Lt(h, a) {
  const v = h.elements, m = [];
  for (let p = 0; p < v.length; p++) {
    const g = v[p];
    if (!g.name || !(g.name in a) || g.type === "file" || g.type === "submit" || g.type === "button") continue;
    const s = a[g.name];
    if (g.type === "checkbox")
      g.checked = Array.isArray(s) ? s.indexOf(g.value) !== -1 : !!s, m.push(g);
    else if (g.type === "radio")
      g.checked = g.value === String(s), m.push(g);
    else if (g.type === "select-multiple") {
      if (Array.isArray(s))
        for (let n = 0; n < g.options.length; n++)
          g.options[n].selected = s.indexOf(g.options[n].value) !== -1;
      m.push(g);
    } else
      g.value = s, m.push(g);
  }
  return m;
}
function $(h) {
  const a = h.closest("[lang]");
  return (a ? a.lang : null) || navigator.language;
}
function P(h, a, v, m, p = {}) {
  const g = p.extraAttributes || [], s = p.onAttributeChange || null, n = p.onInit || null;
  function t(o) {
    const e = o || document.body;
    U(e, h, a, v), n && n(e);
  }
  return z(function() {
    const o = new MutationObserver(function(i) {
      for (let r = 0; r < i.length; r++) {
        const u = i[r];
        if (u.type === "childList")
          for (let c = 0; c < u.addedNodes.length; c++) {
            const l = u.addedNodes[c];
            l.nodeType === 1 && (U(l, h, a, v), n && n(l));
          }
        else if (u.type === "attributes") {
          const c = u.attributeName === h || h.indexOf("[" + u.attributeName) !== -1;
          s && u.target[a] && c ? s(u.target, u.attributeName) : (U(u.target, h, a, v), n && n(u.target));
        }
      }
    });
    let e = [];
    if (h.indexOf("[") !== -1) {
      const i = /\[([\w-]+)/g;
      let r;
      for (; (r = i.exec(h)) !== null; )
        e.push(r[1]);
    } else
      e.push(h);
    o.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: e.concat(g)
    });
  }, m || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[a] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
const At = Symbol("deepReactive");
function xt(h, a) {
  function v(m) {
    if (m === null || typeof m != "object" || m[At]) return m;
    const p = Object.keys(m);
    for (let g = 0; g < p.length; g++) {
      const s = m[p[g]];
      s !== null && typeof s == "object" && (m[p[g]] = v(s));
    }
    return new Proxy(m, {
      get(g, s) {
        return s === At ? !0 : g[s];
      },
      set(g, s, n) {
        const t = g[s];
        return n !== null && typeof n == "object" && (n = v(n)), g[s] = n, t !== n && a(), !0;
      },
      deleteProperty(g, s) {
        return s in g && (delete g[s], a()), !0;
      }
    });
  }
  return v(h);
}
function It(h, a) {
  let v = !1;
  return function() {
    v || (v = !0, queueMicrotask(function() {
      v = !1, h(), a && a();
    }));
  };
}
const Rt = "ln:";
function Dt() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Tt(h, a) {
  const v = a.getAttribute("data-ln-persist"), m = v !== null && v !== "" ? v : a.id;
  return m ? Rt + h + ":" + Dt() + ":" + m : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function mt(h, a) {
  const v = Tt(h, a);
  if (!v) return null;
  try {
    const m = localStorage.getItem(v);
    return m !== null ? JSON.parse(m) : null;
  } catch {
    return null;
  }
}
function tt(h, a, v) {
  const m = Tt(h, a);
  if (m)
    try {
      localStorage.setItem(m, JSON.stringify(v));
    } catch {
    }
}
function Et(h, a, v, m) {
  const p = typeof m == "number" ? m : 4, g = window.innerWidth, s = window.innerHeight, n = a.width, t = a.height, o = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, e = o[v] || o.bottom;
  function i(l) {
    let _, d, b = !0;
    return l === "top" ? (_ = h.top - p - t, d = h.left + (h.width - n) / 2, _ < 0 && (b = !1)) : l === "bottom" ? (_ = h.bottom + p, d = h.left + (h.width - n) / 2, _ + t > s && (b = !1)) : l === "left" ? (_ = h.top + (h.height - t) / 2, d = h.left - p - n, d < 0 && (b = !1)) : (_ = h.top + (h.height - t) / 2, d = h.right + p, d + n > g && (b = !1)), { top: _, left: d, side: l, fits: b };
  }
  let r = null;
  for (let l = 0; l < e.length; l++) {
    const _ = i(e[l]);
    if (_.fits) {
      r = _;
      break;
    }
  }
  r || (r = i(e[0]));
  let u = r.top, c = r.left;
  return n >= g ? c = 0 : (c < 0 && (c = 0), c + n > g && (c = g - n)), t >= s ? u = 0 : (u < 0 && (u = 0), u + t > s && (u = s - t)), { top: u, left: c, placement: r.side };
}
function Ft(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const a = h.parentNode, v = document.createComment("ln-teleport");
  return a.insertBefore(v, h), document.body.appendChild(h), function() {
    v.parentNode && (v.parentNode.insertBefore(h, v), v.parentNode.removeChild(v));
  };
}
function wt(h) {
  if (!h) return { width: 0, height: 0 };
  const a = h.style, v = a.visibility, m = a.display, p = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const g = h.offsetWidth, s = h.offsetHeight;
  return a.visibility = v, a.display = m, a.position = p, { width: g, height: s };
}
(function() {
  const h = "lnHttp";
  if (window[h] !== void 0) return;
  const a = {};
  document.addEventListener("ln-http:request", function(v) {
    const m = v.detail || {};
    if (!m.url) return;
    const p = v.target, g = (m.method || (m.body ? "POST" : "GET")).toUpperCase(), s = m.abort, n = m.tag;
    let t = m.url;
    s && (a[s] && a[s].abort(), a[s] = new AbortController());
    const o = { Accept: "application/json" };
    m.ajax && (o["X-Requested-With"] = "XMLHttpRequest");
    const e = {
      method: g,
      credentials: "same-origin",
      headers: o
    };
    if (s && (e.signal = a[s].signal), m.body && g === "GET") {
      const i = new URLSearchParams();
      for (const u in m.body)
        m.body[u] != null && i.set(u, m.body[u]);
      const r = i.toString();
      r && (t += (t.includes("?") ? "&" : "?") + r);
    } else m.body && (o["Content-Type"] = "application/json", e.body = JSON.stringify(m.body));
    fetch(t, e).then(function(i) {
      s && delete a[s];
      const r = i.ok, u = i.status;
      return i.json().then(function(c) {
        return { ok: r, status: u, data: c };
      }).catch(function() {
        return { ok: !1, status: u, data: { error: !0, message: "Invalid response" } };
      });
    }).then(function(i) {
      i.tag = n;
      const r = i.ok ? "ln-http:success" : "ln-http:error";
      T(p, r, i);
    }).catch(function(i) {
      s && i.name !== "AbortError" && delete a[s], i.name !== "AbortError" && T(p, "ln-http:error", { tag: n, ok: !1, status: 0, data: { error: !0, message: "Network error" } });
    });
  }), window[h] = !0;
})();
(function() {
  const h = "data-ln-ajax", a = "lnAjax";
  if (window[a] !== void 0) return;
  function v(e) {
    if (!e.hasAttribute(h) || e[a]) return;
    e[a] = !0;
    const i = n(e);
    m(i.links), p(i.forms);
  }
  function m(e) {
    for (const i of e) {
      if (i[a + "Trigger"] || i.hostname && i.hostname !== window.location.hostname) continue;
      const r = i.getAttribute("href");
      if (r && r.includes("#")) continue;
      const u = function(c) {
        if (c.ctrlKey || c.metaKey || c.button === 1) return;
        c.preventDefault();
        const l = i.getAttribute("href");
        l && s("GET", l, null, i);
      };
      i.addEventListener("click", u), i[a + "Trigger"] = u;
    }
  }
  function p(e) {
    for (const i of e) {
      if (i[a + "Trigger"]) continue;
      const r = function(u) {
        u.preventDefault();
        const c = i.method.toUpperCase(), l = i.action, _ = new FormData(i);
        for (const d of i.querySelectorAll('button, input[type="submit"]'))
          d.disabled = !0;
        s(c, l, _, i, function() {
          for (const d of i.querySelectorAll('button, input[type="submit"]'))
            d.disabled = !1;
        });
      };
      i.addEventListener("submit", r), i[a + "Trigger"] = r;
    }
  }
  function g(e) {
    if (!e[a]) return;
    const i = n(e);
    for (const r of i.links)
      r[a + "Trigger"] && (r.removeEventListener("click", r[a + "Trigger"]), delete r[a + "Trigger"]);
    for (const r of i.forms)
      r[a + "Trigger"] && (r.removeEventListener("submit", r[a + "Trigger"]), delete r[a + "Trigger"]);
    delete e[a];
  }
  function s(e, i, r, u, c) {
    if (K(u, "ln-ajax:before-start", { method: e, url: i }).defaultPrevented) return;
    T(u, "ln-ajax:start", { method: e, url: i }), u.classList.add("ln-ajax--loading");
    const _ = document.createElement("span");
    _.className = "ln-ajax-spinner", u.appendChild(_);
    function d() {
      u.classList.remove("ln-ajax--loading");
      const w = u.querySelector(".ln-ajax-spinner");
      w && w.remove(), c && c();
    }
    let b = i;
    const y = document.querySelector('meta[name="csrf-token"]'), S = y ? y.getAttribute("content") : null;
    r instanceof FormData && S && r.append("_token", S);
    const A = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (S && (A.headers["X-CSRF-TOKEN"] = S), e === "GET" && r) {
      const w = new URLSearchParams(r);
      b = i + (i.includes("?") ? "&" : "?") + w.toString();
    } else e !== "GET" && r && (A.body = r);
    fetch(b, A).then(function(w) {
      const C = w.ok;
      return w.json().then(function(k) {
        return { ok: C, status: w.status, data: k };
      });
    }).then(function(w) {
      const C = w.data;
      if (w.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const k in C.content) {
            const F = document.getElementById(k);
            F && (F.innerHTML = C.content[k]);
          }
        if (u.tagName === "A") {
          const k = u.getAttribute("href");
          k && window.history.pushState({ ajax: !0 }, "", k);
        } else u.tagName === "FORM" && u.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", b);
        T(u, "ln-ajax:success", { method: e, url: b, data: C });
      } else
        T(u, "ln-ajax:error", { method: e, url: b, status: w.status, data: C });
      if (C.message && window.lnToast) {
        const k = C.message;
        window.lnToast.enqueue({
          type: k.type || (w.ok ? "success" : "error"),
          title: k.title || "",
          message: k.body || ""
        });
      }
      T(u, "ln-ajax:complete", { method: e, url: b }), d();
    }).catch(function(w) {
      T(u, "ln-ajax:error", { method: e, url: b, error: w }), T(u, "ln-ajax:complete", { method: e, url: b }), d();
    });
  }
  function n(e) {
    const i = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? i.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? i.forms.push(e) : (i.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), i.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), i;
  }
  function t() {
    z(function() {
      new MutationObserver(function(i) {
        for (const r of i)
          if (r.type === "childList") {
            for (const u of r.addedNodes)
              if (u.nodeType === 1 && (v(u), !u.hasAttribute(h))) {
                for (const l of u.querySelectorAll("[" + h + "]"))
                  v(l);
                const c = u.closest && u.closest("[" + h + "]");
                if (c && c.getAttribute(h) !== "false") {
                  const l = n(u);
                  m(l.links), p(l.forms);
                }
              }
          } else r.type === "attributes" && v(r.target);
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
      v(e);
  }
  window[a] = v, window[a].destroy = g, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const h = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function v(s) {
    const n = Array.from(s.querySelectorAll("[data-ln-modal-for]"));
    s.hasAttribute && s.hasAttribute("data-ln-modal-for") && n.push(s);
    for (const t of n) {
      if (t[a + "Trigger"]) continue;
      const o = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const i = t.getAttribute("data-ln-modal-for"), r = document.getElementById(i);
        !r || !r[a] || r[a].toggle();
      };
      t.addEventListener("click", o), t[a + "Trigger"] = o;
    }
  }
  function m(s) {
    this.dom = s, this.isOpen = s.getAttribute(h) === "open";
    const n = this;
    return this._onEscape = function(t) {
      t.key === "Escape" && n.close();
    }, this._onFocusTrap = function(t) {
      if (t.key !== "Tab") return;
      const o = Array.prototype.filter.call(
        n.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        ct
      );
      if (o.length === 0) return;
      const e = o[0], i = o[o.length - 1];
      t.shiftKey ? document.activeElement === e && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), e.focus());
    }, this._onClose = function(t) {
      t.preventDefault(), n.close();
    }, g(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  m.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(h, "open");
  }, m.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "close");
  }, m.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, m.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const s = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of s)
      t[a + "Close"] && (t.removeEventListener("click", t[a + "Close"]), delete t[a + "Close"]);
    const n = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const t of n)
      t[a + "Trigger"] && (t.removeEventListener("click", t[a + "Trigger"]), delete t[a + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
  };
  function p(s) {
    const n = s[a];
    if (!n) return;
    const o = s.getAttribute(h) === "open";
    if (o !== n.isOpen)
      if (o) {
        if (K(s, "ln-modal:before-open", { modalId: s.id, target: s }).defaultPrevented) {
          s.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, s.setAttribute("aria-modal", "true"), s.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", n._onEscape), document.addEventListener("keydown", n._onFocusTrap);
        const i = s.querySelector("[autofocus]");
        if (i && ct(i))
          i.focus();
        else {
          const r = s.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(r, ct);
          if (u) u.focus();
          else {
            const c = s.querySelectorAll("a[href], button:not([disabled])"), l = Array.prototype.find.call(c, ct);
            l && l.focus();
          }
        }
        T(s, "ln-modal:open", { modalId: s.id, target: s });
      } else {
        if (K(s, "ln-modal:before-close", { modalId: s.id, target: s }).defaultPrevented) {
          s.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, s.removeAttribute("aria-modal"), document.removeEventListener("keydown", n._onEscape), document.removeEventListener("keydown", n._onFocusTrap), T(s, "ln-modal:close", { modalId: s.id, target: s }), document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function g(s) {
    const n = s.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of n)
      t[a + "Close"] || (t.addEventListener("click", s._onClose), t[a + "Close"] = s._onClose);
  }
  P(h, a, m, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: p,
    onInit: v
  });
})();
(function() {
  const h = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const v = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(t) {
    if (!v[t]) {
      const o = new Intl.NumberFormat(t, { useGrouping: !0 }), e = o.formatToParts(1234.5);
      let i = "", r = ".";
      for (let u = 0; u < e.length; u++)
        e[u].type === "group" && (i = e[u].value), e[u].type === "decimal" && (r = e[u].value);
      v[t] = { fmt: o, groupSep: i, decimalSep: r };
    }
    return v[t];
  }
  function g(t, o, e) {
    if (e !== null) {
      const i = parseInt(e, 10), r = t + "|d" + i;
      return v[r] || (v[r] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: i })), v[r].format(o);
    }
    return p(t).fmt.format(o);
  }
  function s(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    this.dom = t;
    const o = document.createElement("input");
    o.type = "hidden", o.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", o), this._hidden = o;
    const e = this;
    Object.defineProperty(o, "value", {
      get: function() {
        return m.get.call(o);
      },
      set: function(r) {
        m.set.call(o, r), r !== "" && !isNaN(parseFloat(r)) ? e._displayFormatted(parseFloat(r)) : r === "" && (e.dom.value = "");
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(r) {
      r.preventDefault();
      const u = (r.clipboardData || window.clipboardData).getData("text"), c = p($(t)), l = c.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let _ = u.replace(new RegExp("[^0-9\\-" + l + ".]", "g"), "");
      c.groupSep && (_ = _.split(c.groupSep).join("")), c.decimalSep !== "." && (_ = _.replace(c.decimalSep, "."));
      const d = parseFloat(_);
      isNaN(d) ? (t.value = "", e._hidden.value = "") : e.value = d;
    }, t.addEventListener("paste", this._onPaste);
    const i = t.value;
    if (i !== "") {
      const r = parseFloat(i);
      isNaN(r) || (this._displayFormatted(r), m.set.call(o, String(r)));
    }
    return this;
  }
  s.prototype._handleInput = function() {
    const t = this.dom, o = p($(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", T(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const i = t.selectionStart;
    let r = 0;
    for (let w = 0; w < i; w++)
      /[0-9]/.test(e[w]) && r++;
    let u = e;
    if (o.groupSep && (u = u.split(o.groupSep).join("")), u = u.replace(o.decimalSep, "."), e.endsWith(o.decimalSep) || e.endsWith(".")) {
      const w = u.replace(/\.$/, ""), C = parseFloat(w);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const c = u.indexOf(".");
    if (c !== -1 && u.slice(c + 1).endsWith("0")) {
      const C = parseFloat(u);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const l = t.getAttribute("data-ln-number-decimals");
    if (l !== null && c !== -1) {
      const w = parseInt(l, 10);
      u.slice(c + 1).length > w && (u = u.slice(0, c + 1 + w));
    }
    const _ = parseFloat(u);
    if (isNaN(_)) return;
    const d = t.getAttribute("data-ln-number-min"), b = t.getAttribute("data-ln-number-max");
    if (d !== null && _ < parseFloat(d) || b !== null && _ > parseFloat(b)) return;
    let y;
    if (l !== null)
      y = g($(t), _, l);
    else {
      const w = c !== -1 ? u.slice(c + 1).length : 0;
      if (w > 0) {
        const C = $(t) + "|u" + w;
        v[C] || (v[C] = new Intl.NumberFormat($(t), { useGrouping: !0, minimumFractionDigits: w, maximumFractionDigits: w })), y = v[C].format(_);
      } else
        y = o.fmt.format(_);
    }
    t.value = y;
    let S = r, A = 0;
    for (let w = 0; w < y.length && S > 0; w++)
      A = w + 1, /[0-9]/.test(y[w]) && S--;
    S > 0 && (A = y.length), t.setSelectionRange(A, A), this._setHiddenRaw(_), T(t, "ln-number:input", { value: _, formatted: y });
  }, s.prototype._setHiddenRaw = function(t) {
    m.set.call(this._hidden, String(t));
  }, s.prototype._displayFormatted = function(t) {
    this.dom.value = g($(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(s.prototype, "value", {
    get: function() {
      const t = this._hidden.value;
      return t === "" ? NaN : parseFloat(t);
    },
    set: function(t) {
      if (typeof t != "number" || isNaN(t)) {
        this.dom.value = "", this._setHiddenRaw("");
        return;
      }
      this._displayFormatted(t), this._setHiddenRaw(t), T(this.dom, "ln-number:input", {
        value: t,
        formatted: this.dom.value
      });
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), s.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function n() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let o = 0; o < t.length; o++) {
        const e = t[o][a];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  P(h, a, s, "ln-number"), n();
})();
(function() {
  const h = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const v = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(c, l) {
    const _ = c + "|" + JSON.stringify(l);
    return v[_] || (v[_] = new Intl.DateTimeFormat(c, l)), v[_];
  }
  const g = /^(short|medium|long)(\s+datetime)?$/, s = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function n(c) {
    return !c || c === "" ? { dateStyle: "medium" } : c.match(g) ? s[c] : null;
  }
  function t(c, l, _) {
    const d = c.getDate(), b = c.getMonth(), y = c.getFullYear(), S = c.getHours(), A = c.getMinutes(), w = {
      yyyy: String(y),
      yy: String(y).slice(-2),
      MMMM: p(_, { month: "long" }).format(c),
      MMM: p(_, { month: "short" }).format(c),
      MM: String(b + 1).padStart(2, "0"),
      M: String(b + 1),
      dd: String(d).padStart(2, "0"),
      d: String(d),
      HH: String(S).padStart(2, "0"),
      mm: String(A).padStart(2, "0")
    };
    return l.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(C) {
      return w[C];
    });
  }
  function o(c, l, _) {
    const d = n(l);
    return d ? p(_, d).format(c) : t(c, l, _);
  }
  function e(c) {
    if (c.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", c.tagName), this;
    this.dom = c;
    const l = this, _ = c.value, d = c.name, b = document.createElement("input");
    b.type = "hidden", b.name = d, c.removeAttribute("name"), c.insertAdjacentElement("afterend", b), this._hidden = b;
    const y = document.createElement("input");
    y.type = "date", y.tabIndex = -1, y.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", b.insertAdjacentElement("afterend", y), this._picker = y, c.type = "text";
    const S = document.createElement("button");
    if (S.type = "button", S.setAttribute("aria-label", "Open date picker"), S.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', y.insertAdjacentElement("afterend", S), this._btn = S, this._lastISO = "", Object.defineProperty(b, "value", {
      get: function() {
        return m.get.call(b);
      },
      set: function(A) {
        if (m.set.call(b, A), A && A !== "") {
          const w = i(A);
          w && (l._displayFormatted(w), m.set.call(y, A));
        } else A === "" && (l.dom.value = "", m.set.call(y, ""));
      }
    }), this._onPickerChange = function() {
      const A = y.value;
      if (A) {
        const w = i(A);
        w && (l._setHiddenRaw(A), l._displayFormatted(w), l._lastISO = A, T(l.dom, "ln-date:change", {
          value: A,
          formatted: l.dom.value,
          date: w
        }));
      } else
        l._setHiddenRaw(""), l.dom.value = "", l._lastISO = "", T(l.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, y.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const A = l.dom.value.trim();
      if (A === "") {
        l._lastISO !== "" && (l._setHiddenRaw(""), m.set.call(l._picker, ""), l.dom.value = "", l._lastISO = "", T(l.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (l._lastISO) {
        const C = i(l._lastISO);
        if (C) {
          const k = l.dom.getAttribute(h) || "", F = $(l.dom), q = o(C, k, F);
          if (A === q) return;
        }
      }
      const w = r(A);
      if (w) {
        const C = w.getFullYear(), k = String(w.getMonth() + 1).padStart(2, "0"), F = String(w.getDate()).padStart(2, "0"), q = C + "-" + k + "-" + F;
        l._setHiddenRaw(q), m.set.call(l._picker, q), l._displayFormatted(w), l._lastISO = q, T(l.dom, "ln-date:change", {
          value: q,
          formatted: l.dom.value,
          date: w
        });
      } else if (l._lastISO) {
        const C = i(l._lastISO);
        C && l._displayFormatted(C);
      } else
        l.dom.value = "";
    }, c.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      l._openPicker();
    }, S.addEventListener("click", this._onBtnClick), _ && _ !== "") {
      const A = i(_);
      A && (this._setHiddenRaw(_), m.set.call(y, _), this._displayFormatted(A), this._lastISO = _);
    }
    return this;
  }
  function i(c) {
    if (!c || typeof c != "string") return null;
    const l = c.split("T"), _ = l[0].split("-");
    if (_.length < 3) return null;
    const d = parseInt(_[0], 10), b = parseInt(_[1], 10) - 1, y = parseInt(_[2], 10);
    if (isNaN(d) || isNaN(b) || isNaN(y)) return null;
    let S = 0, A = 0;
    if (l[1]) {
      const C = l[1].split(":");
      S = parseInt(C[0], 10) || 0, A = parseInt(C[1], 10) || 0;
    }
    const w = new Date(d, b, y, S, A);
    return w.getFullYear() !== d || w.getMonth() !== b || w.getDate() !== y ? null : w;
  }
  function r(c) {
    if (!c || typeof c != "string" || (c = c.trim(), c.length < 6)) return null;
    let l, _;
    if (c.indexOf(".") !== -1)
      l = ".", _ = c.split(".");
    else if (c.indexOf("/") !== -1)
      l = "/", _ = c.split("/");
    else if (c.indexOf("-") !== -1)
      l = "-", _ = c.split("-");
    else
      return null;
    if (_.length !== 3) return null;
    const d = [];
    for (let w = 0; w < 3; w++) {
      const C = parseInt(_[w], 10);
      if (isNaN(C)) return null;
      d.push(C);
    }
    let b, y, S;
    l === "." ? (b = d[0], y = d[1], S = d[2]) : l === "/" ? (y = d[0], b = d[1], S = d[2]) : _[0].length === 4 ? (S = d[0], y = d[1], b = d[2]) : (b = d[0], y = d[1], S = d[2]), S < 100 && (S += S < 50 ? 2e3 : 1900);
    const A = new Date(S, y - 1, b);
    return A.getFullYear() !== S || A.getMonth() !== y - 1 || A.getDate() !== b ? null : A;
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
  }, e.prototype._setHiddenRaw = function(c) {
    m.set.call(this._hidden, c);
  }, e.prototype._displayFormatted = function(c) {
    const l = this.dom.getAttribute(h) || "", _ = $(this.dom);
    this.dom.value = o(c, l, _);
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return m.get.call(this._hidden);
    },
    set: function(c) {
      if (!c || c === "") {
        this._setHiddenRaw(""), m.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const l = i(c);
      l && (this._setHiddenRaw(c), m.set.call(this._picker, c), this._displayFormatted(l), this._lastISO = c, T(this.dom, "ln-date:change", {
        value: c,
        formatted: this.dom.value,
        date: l
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const c = this.value;
      return c ? i(c) : null;
    },
    set: function(c) {
      if (!c || !(c instanceof Date) || isNaN(c.getTime())) {
        this.value = "";
        return;
      }
      const l = c.getFullYear(), _ = String(c.getMonth() + 1).padStart(2, "0"), d = String(c.getDate()).padStart(2, "0");
      this.value = l + "-" + _ + "-" + d;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const c = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), c && (this.dom.value = c), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function u() {
    new MutationObserver(function() {
      const c = document.querySelectorAll("[" + h + "]");
      for (let l = 0; l < c.length; l++) {
        const _ = c[l][a];
        if (_ && _.value) {
          const d = i(_.value);
          d && _._displayFormatted(d);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  P(h, a, e, "ln-date"), u();
})();
(function() {
  const h = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const v = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const i of m)
        i();
    }, history._lnNavPatched = !0;
  }
  function p(e) {
    if (!e.hasAttribute(h) || v.has(e)) return;
    const i = e.getAttribute(h);
    if (!i) return;
    const r = g(e, i);
    v.set(e, r), e[a] = r;
  }
  function g(e, i) {
    let r = Array.from(e.querySelectorAll("a"));
    n(r, i, window.location.pathname);
    const u = function() {
      r = Array.from(e.querySelectorAll("a")), n(r, i, window.location.pathname);
    };
    window.addEventListener("popstate", u), m.push(u);
    const c = new MutationObserver(function(l) {
      for (const _ of l)
        if (_.type === "childList") {
          for (const d of _.addedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                r.push(d), n([d], i, window.location.pathname);
              else if (d.querySelectorAll) {
                const b = Array.from(d.querySelectorAll("a"));
                r = r.concat(b), n(b, i, window.location.pathname);
              }
            }
          for (const d of _.removedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                r = r.filter(function(b) {
                  return b !== d;
                });
              else if (d.querySelectorAll) {
                const b = Array.from(d.querySelectorAll("a"));
                r = r.filter(function(y) {
                  return !b.includes(y);
                });
              }
            }
        }
    });
    return c.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: i,
      observer: c,
      updateHandler: u,
      destroy: function() {
        c.disconnect(), window.removeEventListener("popstate", u);
        const l = m.indexOf(u);
        l !== -1 && m.splice(l, 1), v.delete(e), delete e[a];
      }
    };
  }
  function s(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function n(e, i, r) {
    const u = s(r);
    for (const c of e) {
      const l = c.getAttribute("href");
      if (!l) continue;
      const _ = s(l);
      c.classList.remove(i);
      const d = _ === u, b = _ !== "/" && u.startsWith(_ + "/");
      (d || b) && c.classList.add(i);
    }
  }
  function t() {
    z(function() {
      new MutationObserver(function(i) {
        for (const r of i)
          if (r.type === "childList") {
            for (const u of r.addedNodes)
              if (u.nodeType === 1 && (u.hasAttribute && u.hasAttribute(h) && p(u), u.querySelectorAll))
                for (const c of u.querySelectorAll("[" + h + "]"))
                  p(c);
          } else r.type === "attributes" && r.target.hasAttribute && r.target.hasAttribute(h) && p(r.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[a] = p;
  function o() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      p(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const h = window.TomSelect;
  if (!h) {
    console.warn("[ln-select] TomSelect not found. Load TomSelect before ln-ashlar."), window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const a = /* @__PURE__ */ new WeakMap();
  function v(s) {
    if (a.has(s)) return;
    const n = s.getAttribute("data-ln-select");
    let t = {};
    if (n && n.trim() !== "")
      try {
        t = JSON.parse(n);
      } catch (i) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", i);
      }
    const e = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: s.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...t };
    try {
      const i = new h(s, e);
      a.set(s, i);
      const r = s.closest("form");
      if (r) {
        const u = () => {
          setTimeout(() => {
            i.clear(), i.clearOptions(), i.sync();
          }, 0);
        };
        r.addEventListener("reset", u), i._lnResetHandler = u, i._lnResetForm = r;
      }
    } catch (i) {
      console.warn("[ln-select] Failed to initialize Tom Select:", i);
    }
  }
  function m(s) {
    const n = a.get(s);
    n && (n._lnResetForm && n._lnResetHandler && n._lnResetForm.removeEventListener("reset", n._lnResetHandler), n.destroy(), a.delete(s));
  }
  function p() {
    for (const s of document.querySelectorAll("select[data-ln-select]"))
      v(s);
  }
  function g() {
    z(function() {
      new MutationObserver(function(n) {
        for (const t of n) {
          if (t.type === "attributes") {
            t.target.matches && t.target.matches("select[data-ln-select]") && v(t.target);
            continue;
          }
          for (const o of t.addedNodes)
            if (o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && v(o), o.querySelectorAll))
              for (const e of o.querySelectorAll("select[data-ln-select]"))
                v(e);
          for (const o of t.removedNodes)
            if (o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && m(o), o.querySelectorAll))
              for (const e of o.querySelectorAll("select[data-ln-select]"))
                m(e);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-select"]
      });
    }, "ln-select");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(), g();
  }) : (p(), g()), window.lnSelect = {
    initialize: v,
    destroy: m,
    getInstance: function(s) {
      return a.get(s);
    }
  };
})();
(function() {
  const h = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function v() {
    const g = (location.hash || "").replace("#", ""), s = {};
    if (!g) return s;
    for (const n of g.split("&")) {
      const t = n.indexOf(":");
      t > 0 && (s[n.slice(0, t)] = n.slice(t + 1));
    }
    return s;
  }
  function m(g) {
    return this.dom = g, p.call(this), this;
  }
  function p() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const s of this.tabs) {
      const n = (s.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      n && (this.mapTabs[n] = s);
    }
    for (const s of this.panels) {
      const n = (s.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      n && (this.mapPanels[n] = s);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const g = this;
    this._clickHandlers = [];
    for (const s of this.tabs) {
      if (s[a + "Trigger"]) continue;
      const n = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        const o = (s.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (o)
          if (g.hashEnabled) {
            const e = v();
            e[g.nsKey] = o;
            const i = Object.keys(e).map(function(r) {
              return r + ":" + e[r];
            }).join("&");
            location.hash === "#" + i ? g.dom.setAttribute("data-ln-tabs-active", o) : location.hash = i;
          } else
            g.dom.setAttribute("data-ln-tabs-active", o);
      };
      s.addEventListener("click", n), s[a + "Trigger"] = n, g._clickHandlers.push({ el: s, handler: n });
    }
    if (this._hashHandler = function() {
      if (!g.hashEnabled) return;
      const s = v();
      g.activate(g.nsKey in s ? s[g.nsKey] : g.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let s = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const n = mt("tabs", this.dom);
        n !== null && n in this.mapPanels && (s = n);
      }
      this.activate(s);
    }
  }
  m.prototype.activate = function(g) {
    (!g || !(g in this.mapPanels)) && (g = this.defaultKey), this.dom.setAttribute("data-ln-tabs-active", g);
  }, m.prototype._applyActive = function(g) {
    var s;
    (!g || !(g in this.mapPanels)) && (g = this.defaultKey);
    for (const n in this.mapTabs) {
      const t = this.mapTabs[n];
      n === g ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const n in this.mapPanels) {
      const t = this.mapPanels[n], o = n === g;
      t.classList.toggle("hidden", !o), t.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const n = (s = this.mapPanels[g]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      n && setTimeout(() => n.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: g, tab: this.mapTabs[g], panel: this.mapPanels[g] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && tt("tabs", this.dom, g);
  }, m.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const { el: g, handler: s } of this._clickHandlers)
        g.removeEventListener("click", s), delete g[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, P(h, a, m, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(g) {
      const s = g.getAttribute("data-ln-tabs-active");
      g[a]._applyActive(s);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function v(s) {
    const n = Array.from(s.querySelectorAll("[data-ln-toggle-for]"));
    s.hasAttribute && s.hasAttribute("data-ln-toggle-for") && n.push(s);
    for (const t of n) {
      if (t[a + "Trigger"]) continue;
      const o = function(r) {
        if (r.ctrlKey || r.metaKey || r.button === 1) return;
        r.preventDefault();
        const u = t.getAttribute("data-ln-toggle-for"), c = document.getElementById(u);
        if (!c || !c[a]) return;
        const l = t.getAttribute("data-ln-toggle-action") || "toggle";
        c[a][l]();
      };
      t.addEventListener("click", o), t[a + "Trigger"] = o;
      const e = t.getAttribute("data-ln-toggle-for"), i = document.getElementById(e);
      i && i[a] && t.setAttribute("aria-expanded", i[a].isOpen ? "true" : "false");
    }
  }
  function m(s, n) {
    const t = document.querySelectorAll(
      '[data-ln-toggle-for="' + s.id + '"]'
    );
    for (const o of t)
      o.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function p(s) {
    if (this.dom = s, s.hasAttribute("data-ln-persist")) {
      const n = mt("toggle", s);
      n !== null && s.setAttribute(h, n);
    }
    return this.isOpen = s.getAttribute(h) === "open", this.isOpen && s.classList.add("open"), m(s, this.isOpen), this;
  }
  p.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(h, "open");
  }, p.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "close");
  }, p.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, p.prototype.destroy = function() {
    if (!this.dom[a]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const s = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const n of s)
      n[a + "Trigger"] && (n.removeEventListener("click", n[a + "Trigger"]), delete n[a + "Trigger"]);
    delete this.dom[a];
  };
  function g(s) {
    const n = s[a];
    if (!n) return;
    const o = s.getAttribute(h) === "open";
    if (o !== n.isOpen)
      if (o) {
        if (K(s, "ln-toggle:before-open", { target: s }).defaultPrevented) {
          s.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, s.classList.add("open"), m(s, !0), T(s, "ln-toggle:open", { target: s }), s.hasAttribute("data-ln-persist") && tt("toggle", s, "open");
      } else {
        if (K(s, "ln-toggle:before-close", { target: s }).defaultPrevented) {
          s.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, s.classList.remove("open"), m(s, !1), T(s, "ln-toggle:close", { target: s }), s.hasAttribute("data-ln-persist") && tt("toggle", s, "close");
      }
  }
  P(h, a, p, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: g,
    onInit: v
  });
})();
(function() {
  const h = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function v(m) {
    return this.dom = m, this._onToggleOpen = function(p) {
      const g = m.querySelectorAll("[data-ln-toggle]");
      for (const s of g)
        s !== p.detail.target && s.getAttribute("data-ln-toggle") === "open" && s.setAttribute("data-ln-toggle", "close");
      T(m, "ln-accordion:change", { target: p.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, P(h, a, v, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function v(m) {
    if (this.dom = m, this.toggleEl = m.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = m.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const g of this.toggleEl.children)
        g.setAttribute("role", "menuitem");
    const p = this;
    return this._onToggleOpen = function(g) {
      g.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "true"), p._teleportToBody(), p._addOutsideClickListener(), p._addScrollRepositionListener(), p._addResizeCloseListener(), T(m, "ln-dropdown:open", { target: g.detail.target }));
    }, this._onToggleClose = function(g) {
      g.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "false"), p._removeOutsideClickListener(), p._removeScrollRepositionListener(), p._removeResizeCloseListener(), p._teleportBack(), T(m, "ln-dropdown:close", { target: g.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  v.prototype._positionMenu = function() {
    const m = this.dom.querySelector("[data-ln-toggle-for]");
    if (!m || !this.toggleEl) return;
    const p = m.getBoundingClientRect(), g = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    g && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const s = this.toggleEl.offsetWidth, n = this.toggleEl.offsetHeight;
    g && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const t = window.innerWidth, o = window.innerHeight, e = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4;
    let i;
    p.bottom + e + n <= o ? i = p.bottom + e : p.top - e - n >= 0 ? i = p.top - e - n : i = Math.max(0, o - n);
    let r;
    p.right - s >= 0 ? r = p.right - s : p.left + s <= t ? r = p.left : r = Math.max(0, t - s), this.toggleEl.style.top = i + "px", this.toggleEl.style.left = r + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, v.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, v.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, v.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const m = this;
    this._boundDocClick = function(p) {
      m.dom.contains(p.target) || m.toggleEl && m.toggleEl.contains(p.target) || m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, m._docClickTimeout = setTimeout(function() {
      m._docClickTimeout = null, document.addEventListener("click", m._boundDocClick);
    }, 0);
  }, v.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, v.prototype._addScrollRepositionListener = function() {
    const m = this;
    this._boundScrollReposition = function() {
      m._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, v.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, v.prototype._addResizeCloseListener = function() {
    const m = this;
    this._boundResizeClose = function() {
      m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, v.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, v.prototype.destroy = function() {
    this.dom[a] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, P(h, a, v, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", a = "lnPopover", v = "data-ln-popover-for", m = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const p = [];
  let g = null;
  function s() {
    g || (g = function(e) {
      if (e.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", g));
  }
  function n() {
    p.length > 0 || g && (document.removeEventListener("keydown", g), g = null);
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
    this.isOpen = !0, e && (this.trigger = e), this._previousFocus = document.activeElement, this._teleportRestore = Ft(this.dom);
    const i = wt(this.dom);
    if (this.trigger) {
      const l = this.trigger.getBoundingClientRect(), _ = this.dom.getAttribute(m) || "bottom", d = Et(l, i, _, 8);
      this.dom.style.top = d.top + "px", this.dom.style.left = d.left + "px", this.dom.setAttribute("data-ln-popover-placement", d.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const r = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), u = Array.prototype.find.call(r, ct);
    u ? u.focus() : this.dom.focus();
    const c = this;
    this._boundDocClick = function(l) {
      c.dom.contains(l.target) || c.trigger && c.trigger.contains(l.target) || c.close();
    }, c._docClickTimeout = setTimeout(function() {
      c._docClickTimeout = null, document.addEventListener("click", c._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!c.trigger) return;
      const l = c.trigger.getBoundingClientRect(), _ = wt(c.dom), d = c.dom.getAttribute(m) || "bottom", b = Et(l, _, d, 8);
      c.dom.style.top = b.top + "px", c.dom.style.left = b.left + "px", c.dom.setAttribute("data-ln-popover-placement", b.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), s(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const e = p.indexOf(this);
    e !== -1 && p.splice(e, 1), n(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[a] && (this.isOpen && this._applyClose(), delete this.dom[a], T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function o(e) {
    this.dom = e;
    const i = e.getAttribute(v);
    return e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-controls", i), this._onClick = function(r) {
      if (r.ctrlKey || r.metaKey || r.button === 1) return;
      r.preventDefault();
      const u = document.getElementById(i);
      !u || !u[a] || u[a].toggle(e);
    }, e.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, P(h, a, t, "ln-popover", {
    onAttributeChange: function(e) {
      const i = e[a];
      if (!i) return;
      const u = e.getAttribute(h) === "open";
      if (u !== i.isOpen)
        if (u) {
          if (K(e, "ln-popover:before-open", {
            popoverId: e.id,
            target: e,
            trigger: i.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "closed");
            return;
          }
          i._applyOpen(i.trigger);
        } else {
          if (K(e, "ln-popover:before-close", {
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
  }), P(v, a + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", a = "data-ln-tooltip", v = "data-ln-tooltip-position", m = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[m] !== void 0) return;
  let g = 0, s = null, n = null, t = null, o = null, e = null;
  function i() {
    return s && s.parentNode || (s = document.getElementById(p), s || (s = document.createElement("div"), s.id = p, document.body.appendChild(s))), s;
  }
  function r() {
    e || (e = function(d) {
      d.key === "Escape" && l();
    }, document.addEventListener("keydown", e));
  }
  function u() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function c(d) {
    if (t === d) return;
    l();
    const b = d.getAttribute(a) || d.getAttribute("title");
    if (!b) return;
    i(), d.hasAttribute("title") && (o = d.getAttribute("title"), d.removeAttribute("title"));
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = b, d[m + "Uid"] || (g += 1, d[m + "Uid"] = "ln-tooltip-" + g), y.id = d[m + "Uid"], s.appendChild(y);
    const S = y.offsetWidth, A = y.offsetHeight, w = d.getBoundingClientRect(), C = d.getAttribute(v) || "top", k = Et(w, { width: S, height: A }, C, 6);
    y.style.top = k.top + "px", y.style.left = k.left + "px", y.setAttribute("data-ln-tooltip-placement", k.placement), d.setAttribute("aria-describedby", y.id), n = y, t = d, r();
  }
  function l() {
    if (!n) {
      u();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), o !== null && t.setAttribute("title", o)), o = null, n.parentNode && n.parentNode.removeChild(n), n = null, t = null, u();
  }
  function _(d) {
    return this.dom = d, this._onEnter = function() {
      c(d);
    }, this._onLeave = function() {
      t === d && l();
    }, this._onFocus = function() {
      c(d);
    }, this._onBlur = function() {
      t === d && l();
    }, d.addEventListener("mouseenter", this._onEnter), d.addEventListener("mouseleave", this._onLeave), d.addEventListener("focus", this._onFocus, !0), d.addEventListener("blur", this._onBlur, !0), this;
  }
  _.prototype.destroy = function() {
    const d = this.dom;
    d.removeEventListener("mouseenter", this._onEnter), d.removeEventListener("mouseleave", this._onLeave), d.removeEventListener("focus", this._onFocus, !0), d.removeEventListener("blur", this._onBlur, !0), t === d && l(), delete d[m], delete d[m + "Uid"], T(d, "ln-tooltip:destroyed", { trigger: d });
  }, P(
    "[" + h + "], [" + a + "][title]",
    m,
    _,
    "ln-tooltip"
  );
})();
(function() {
  const h = "data-ln-toast", a = "lnToast", v = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[a] !== void 0 && window[a] !== null) return;
  function m(l = document.body) {
    return p(l), c;
  }
  function p(l) {
    if (!l || l.nodeType !== 1) return;
    const _ = Array.from(l.querySelectorAll("[" + h + "]"));
    l.hasAttribute && l.hasAttribute(h) && _.push(l);
    for (const d of _)
      d[a] || new g(d);
  }
  function g(l) {
    this.dom = l, l[a] = this, this.timeoutDefault = parseInt(l.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(l.getAttribute("data-ln-toast-max") || "5", 10);
    for (const _ of Array.from(l.querySelectorAll("[data-ln-toast-item]")))
      o(_);
    return this;
  }
  g.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const l of Array.from(this.dom.children))
        i(l);
      delete this.dom[a];
    }
  };
  function s(l) {
    return l === "success" ? "Success" : l === "error" ? "Error" : l === "warn" ? "Warning" : "Information";
  }
  function n(l) {
    return l === "warn" ? "warning" : l;
  }
  function t(l, _, d) {
    const b = document.createElement("div");
    b.className = "ln-toast__card " + n(l), b.setAttribute("role", l === "error" ? "alert" : "status"), b.setAttribute("aria-live", l === "error" ? "assertive" : "polite");
    const y = document.createElement("div");
    y.className = "ln-toast__side", y.innerHTML = v[l] || v.info;
    const S = document.createElement("div");
    S.className = "ln-toast__content";
    const A = document.createElement("div");
    A.className = "ln-toast__head";
    const w = document.createElement("strong");
    w.className = "ln-toast__title", w.textContent = _ || s(l);
    const C = document.createElement("button");
    return C.type = "button", C.className = "ln-toast__close", C.setAttribute("aria-label", "Close"), C.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>', C.addEventListener("click", function() {
      i(d);
    }), A.appendChild(w), S.appendChild(A), S.appendChild(C), b.appendChild(y), b.appendChild(S), { card: b, content: S };
  }
  function o(l) {
    const _ = ((l.getAttribute("data-type") || "info") + "").toLowerCase(), d = l.getAttribute("data-title"), b = (l.innerText || l.textContent || "").trim();
    l.className = "ln-toast__item", l.removeAttribute("data-ln-toast-item");
    const y = t(_, d, l);
    if (b) {
      const S = document.createElement("div");
      S.className = "ln-toast__body";
      const A = document.createElement("p");
      A.textContent = b, S.appendChild(A), y.content.appendChild(S);
    }
    l.innerHTML = "", l.appendChild(y.card), requestAnimationFrame(() => l.classList.add("ln-toast__item--in"));
  }
  function e(l, _) {
    for (; l.dom.children.length >= l.max; ) l.dom.removeChild(l.dom.firstElementChild);
    l.dom.appendChild(_), requestAnimationFrame(() => _.classList.add("ln-toast__item--in"));
  }
  function i(l) {
    !l || !l.parentNode || (clearTimeout(l._timer), l.classList.remove("ln-toast__item--in"), l.classList.add("ln-toast__item--out"), setTimeout(() => {
      l.parentNode && l.parentNode.removeChild(l);
    }, 200));
  }
  function r(l = {}) {
    let _ = l.container;
    if (typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !_)
      return console.warn("[ln-toast] No toast container found"), null;
    const d = _[a] || new g(_), b = Number.isFinite(l.timeout) ? l.timeout : d.timeoutDefault, y = (l.type || "info").toLowerCase(), S = document.createElement("li");
    S.className = "ln-toast__item";
    const A = t(y, l.title, S);
    if (l.message || l.data && l.data.errors) {
      const w = document.createElement("div");
      if (w.className = "ln-toast__body", l.message)
        if (Array.isArray(l.message)) {
          const C = document.createElement("ul");
          for (const k of l.message) {
            const F = document.createElement("li");
            F.textContent = k, C.appendChild(F);
          }
          w.appendChild(C);
        } else {
          const C = document.createElement("p");
          C.textContent = l.message, w.appendChild(C);
        }
      if (l.data && l.data.errors) {
        const C = document.createElement("ul");
        for (const k of Object.values(l.data.errors).flat()) {
          const F = document.createElement("li");
          F.textContent = k, C.appendChild(F);
        }
        w.appendChild(C);
      }
      A.content.appendChild(w);
    }
    return S.appendChild(A.card), e(d, S), b > 0 && (S._timer = setTimeout(() => i(S), b)), S;
  }
  function u(l) {
    let _ = l;
    if (typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !!_)
      for (const d of Array.from(_.children))
        i(d);
  }
  const c = function(l) {
    return m(l);
  };
  c.enqueue = r, c.clear = u, z(function() {
    new MutationObserver(function(_) {
      for (const d of _) {
        if (d.type === "attributes") {
          p(d.target);
          continue;
        }
        for (const b of d.addedNodes)
          p(b);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
  }, "ln-toast"), window[a] = c, window.addEventListener("ln-toast:enqueue", function(l) {
    l.detail && c.enqueue(l.detail);
  }), m(document.body);
})();
(function() {
  const h = "data-ln-upload", a = "lnUpload", v = "data-ln-upload-dict", m = "data-ln-upload-accept", p = "data-ln-upload-context", g = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function s() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const c = document.createElement("div");
    c.innerHTML = g;
    const l = c.firstElementChild;
    l && document.body.appendChild(l);
  }
  if (window[a] !== void 0) return;
  function n(c) {
    if (c === 0) return "0 B";
    const l = 1024, _ = ["B", "KB", "MB", "GB"], d = Math.floor(Math.log(c) / Math.log(l));
    return parseFloat((c / Math.pow(l, d)).toFixed(1)) + " " + _[d];
  }
  function t(c) {
    return c.split(".").pop().toLowerCase();
  }
  function o(c) {
    return c === "docx" && (c = "doc"), ["pdf", "doc", "epub"].includes(c) ? "lnc-file-" + c : "ln-file";
  }
  function e(c, l) {
    if (!l) return !0;
    const _ = "." + t(c.name);
    return l.split(",").map(function(b) {
      return b.trim().toLowerCase();
    }).includes(_.toLowerCase());
  }
  function i(c) {
    if (c.hasAttribute("data-ln-upload-initialized")) return;
    c.setAttribute("data-ln-upload-initialized", "true"), s();
    const l = Ot(c, v), _ = c.querySelector(".ln-upload__zone"), d = c.querySelector(".ln-upload__list"), b = c.getAttribute(m) || "";
    if (!_ || !d) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", c);
      return;
    }
    let y = c.querySelector('input[type="file"]');
    y || (y = document.createElement("input"), y.type = "file", y.multiple = !0, y.classList.add("hidden"), b && (y.accept = b.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), c.appendChild(y));
    const S = c.getAttribute(h) || "/files/upload", A = c.getAttribute(p) || "", w = /* @__PURE__ */ new Map();
    let C = 0;
    function k() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function F(R) {
      if (!e(R, b)) {
        const E = l["invalid-type"];
        T(c, "ln-upload:invalid", {
          file: R,
          message: E
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: l["invalid-title"] || "Invalid File",
          message: E || l["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const B = "file-" + ++C, H = t(R.name), G = o(H), ft = at(c, "ln-upload-item", "ln-upload");
      if (!ft) return;
      const W = ft.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", B), Z(W, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + G,
        removeLabel: l.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const rt = W.querySelector(".ln-upload__progress-bar"), Y = W.querySelector('[data-ln-upload-action="remove"]');
      Y && (Y.disabled = !0), d.appendChild(W);
      const st = new FormData();
      st.append("file", R), st.append("context", A);
      const f = new XMLHttpRequest();
      f.upload.addEventListener("progress", function(E) {
        if (E.lengthComputable) {
          const O = Math.round(E.loaded / E.total * 100);
          rt.style.width = O + "%", Z(W, { sizeText: O + "%" });
        }
      }), f.addEventListener("load", function() {
        if (f.status >= 200 && f.status < 300) {
          let E;
          try {
            E = JSON.parse(f.responseText);
          } catch {
            L("Invalid response");
            return;
          }
          Z(W, { sizeText: n(E.size || R.size), uploading: !1 }), Y && (Y.disabled = !1), w.set(B, {
            serverId: E.id,
            name: E.name,
            size: E.size
          }), q(), T(c, "ln-upload:uploaded", {
            localId: B,
            serverId: E.id,
            name: E.name
          });
        } else {
          let E = l["upload-failed"] || "Upload failed";
          try {
            E = JSON.parse(f.responseText).message || E;
          } catch {
          }
          L(E);
        }
      }), f.addEventListener("error", function() {
        L(l["network-error"] || "Network error");
      });
      function L(E) {
        rt && (rt.style.width = "100%"), Z(W, { sizeText: l.error || "Error", uploading: !1, error: !0 }), Y && (Y.disabled = !1), T(c, "ln-upload:error", {
          file: R,
          message: E
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: l["error-title"] || "Upload Error",
          message: E || l["upload-failed"] || "Failed to upload file"
        });
      }
      f.open("POST", S), f.setRequestHeader("X-CSRF-TOKEN", k()), f.setRequestHeader("Accept", "application/json"), f.send(st);
    }
    function q() {
      for (const R of c.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of w) {
        const B = document.createElement("input");
        B.type = "hidden", B.name = "file_ids[]", B.value = R.serverId, c.appendChild(B);
      }
    }
    function M(R) {
      const B = w.get(R), H = d.querySelector('[data-file-id="' + R + '"]');
      if (!B || !B.serverId) {
        H && H.remove(), w.delete(R), q();
        return;
      }
      H && Z(H, { deleting: !0 }), fetch("/files/" + B.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": k(),
          Accept: "application/json"
        }
      }).then(function(G) {
        G.status === 200 ? (H && H.remove(), w.delete(R), q(), T(c, "ln-upload:removed", {
          localId: R,
          serverId: B.serverId
        })) : (H && Z(H, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: l["delete-title"] || "Error",
          message: l["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(G) {
        console.warn("[ln-upload] Delete error:", G), H && Z(H, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: l["network-error"] || "Network error",
          message: l["connection-error"] || "Could not connect to server"
        });
      });
    }
    function j(R) {
      for (const B of R)
        F(B);
      y.value = "";
    }
    const dt = function() {
      y.click();
    }, ut = function() {
      j(this.files);
    }, it = function(R) {
      R.preventDefault(), R.stopPropagation(), _.classList.add("ln-upload__zone--dragover");
    }, X = function(R) {
      R.preventDefault(), R.stopPropagation(), _.classList.add("ln-upload__zone--dragover");
    }, et = function(R) {
      R.preventDefault(), R.stopPropagation(), _.classList.remove("ln-upload__zone--dragover");
    }, nt = function(R) {
      R.preventDefault(), R.stopPropagation(), _.classList.remove("ln-upload__zone--dragover"), j(R.dataTransfer.files);
    }, ot = function(R) {
      const B = R.target.closest('[data-ln-upload-action="remove"]');
      if (!B || !d.contains(B) || B.disabled) return;
      const H = B.closest(".ln-upload__item");
      H && M(H.getAttribute("data-file-id"));
    };
    _.addEventListener("click", dt), y.addEventListener("change", ut), _.addEventListener("dragenter", it), _.addEventListener("dragover", X), _.addEventListener("dragleave", et), _.addEventListener("drop", nt), d.addEventListener("click", ot), c.lnUploadAPI = {
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
              "X-CSRF-TOKEN": k(),
              Accept: "application/json"
            }
          });
        w.clear(), d.innerHTML = "", q(), T(c, "ln-upload:cleared", {});
      },
      destroy: function() {
        _.removeEventListener("click", dt), y.removeEventListener("change", ut), _.removeEventListener("dragenter", it), _.removeEventListener("dragover", X), _.removeEventListener("dragleave", et), _.removeEventListener("drop", nt), d.removeEventListener("click", ot), w.clear(), d.innerHTML = "", q(), c.removeAttribute("data-ln-upload-initialized"), delete c.lnUploadAPI;
      }
    };
  }
  function r() {
    for (const c of document.querySelectorAll("[" + h + "]"))
      i(c);
  }
  function u() {
    z(function() {
      new MutationObserver(function(l) {
        for (const _ of l)
          if (_.type === "childList") {
            for (const d of _.addedNodes)
              if (d.nodeType === 1) {
                d.hasAttribute(h) && i(d);
                for (const b of d.querySelectorAll("[" + h + "]"))
                  i(b);
              }
          } else _.type === "attributes" && _.target.hasAttribute(h) && i(_.target);
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
    initAll: r
  }, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function a(n) {
    return n.hostname && n.hostname !== window.location.hostname;
  }
  function v(n) {
    if (n.getAttribute("data-ln-external-link") === "processed" || !a(n)) return;
    n.target = "_blank", n.rel = "noopener noreferrer";
    const t = document.createElement("span");
    t.className = "sr-only", t.textContent = "(opens in new tab)", n.appendChild(t), n.setAttribute("data-ln-external-link", "processed"), T(n, "ln-external-links:processed", {
      link: n,
      href: n.href
    });
  }
  function m(n) {
    n = n || document.body;
    for (const t of n.querySelectorAll("a, area"))
      v(t);
  }
  function p() {
    document.body.addEventListener("click", function(n) {
      const t = n.target.closest("a, area");
      t && t.getAttribute("data-ln-external-link") === "processed" && T(t, "ln-external-links:clicked", {
        link: t,
        href: t.href,
        text: t.textContent || t.title || ""
      });
    });
  }
  function g() {
    z(function() {
      new MutationObserver(function(t) {
        for (const o of t)
          if (o.type === "childList") {
            for (const e of o.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && v(e), e.querySelectorAll))
                for (const i of e.querySelectorAll("a, area"))
                  v(i);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }, "ln-external-links");
  }
  function s() {
    p(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[h] = {
    process: m
  }, s();
})();
(function() {
  const h = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let v = null;
  function m() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function p(d) {
    v && (v.textContent = d, v.classList.add("ln-link-status--visible"));
  }
  function g() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function s(d, b) {
    if (b.target.closest("a, button, input, select, textarea")) return;
    const y = d.querySelector("a");
    if (!y) return;
    const S = y.getAttribute("href");
    if (!S) return;
    if (b.ctrlKey || b.metaKey || b.button === 1) {
      window.open(S, "_blank");
      return;
    }
    K(d, "ln-link:navigate", { target: d, href: S, link: y }).defaultPrevented || y.click();
  }
  function n(d) {
    const b = d.querySelector("a");
    if (!b) return;
    const y = b.getAttribute("href");
    y && p(y);
  }
  function t() {
    g();
  }
  function o(d) {
    d[a + "Row"] || (d[a + "Row"] = !0, d.querySelector("a") && (d._lnLinkClick = function(b) {
      s(d, b);
    }, d._lnLinkEnter = function() {
      n(d);
    }, d.addEventListener("click", d._lnLinkClick), d.addEventListener("mouseenter", d._lnLinkEnter), d.addEventListener("mouseleave", t)));
  }
  function e(d) {
    d[a + "Row"] && (d._lnLinkClick && d.removeEventListener("click", d._lnLinkClick), d._lnLinkEnter && d.removeEventListener("mouseenter", d._lnLinkEnter), d.removeEventListener("mouseleave", t), delete d._lnLinkClick, delete d._lnLinkEnter, delete d[a + "Row"]);
  }
  function i(d) {
    if (!d[a + "Init"]) return;
    const b = d.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const y = b === "TABLE" && d.querySelector("tbody") || d;
      for (const S of y.querySelectorAll("tr"))
        e(S);
    } else
      e(d);
    delete d[a + "Init"];
  }
  function r(d) {
    if (d[a + "Init"]) return;
    d[a + "Init"] = !0;
    const b = d.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const y = b === "TABLE" && d.querySelector("tbody") || d;
      for (const S of y.querySelectorAll("tr"))
        o(S);
    } else
      o(d);
  }
  function u(d) {
    d.hasAttribute && d.hasAttribute(h) && r(d);
    const b = d.querySelectorAll ? d.querySelectorAll("[" + h + "]") : [];
    for (const y of b)
      r(y);
  }
  function c() {
    z(function() {
      new MutationObserver(function(b) {
        for (const y of b)
          if (y.type === "childList")
            for (const S of y.addedNodes)
              S.nodeType === 1 && (u(S), S.tagName === "TR" && S.closest("[" + h + "]") && o(S));
          else y.type === "attributes" && u(y.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function l(d) {
    u(d);
  }
  window[a] = { init: l, destroy: i };
  function _() {
    m(), c(), l(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", _) : _();
})();
(function() {
  const h = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function v(e) {
    const i = e.getAttribute("data-ln-progress");
    return i !== null && i !== "";
  }
  function m(e) {
    p(e);
  }
  function p(e) {
    const i = Array.from(e.querySelectorAll(h));
    for (const r of i)
      v(r) && !r[a] && (r[a] = new g(r));
    e.hasAttribute && e.hasAttribute("data-ln-progress") && v(e) && !e[a] && (e[a] = new g(e));
  }
  function g(e) {
    return this.dom = e, this._attrObserver = null, this._parentObserver = null, o.call(this), n.call(this), t.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function s() {
    z(function() {
      new MutationObserver(function(i) {
        for (const r of i)
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
  s();
  function n() {
    const e = this, i = new MutationObserver(function(r) {
      for (const u of r)
        (u.attributeName === "data-ln-progress" || u.attributeName === "data-ln-progress-max") && o.call(e);
    });
    i.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = i;
  }
  function t() {
    const e = this, i = this.dom.parentElement;
    if (!i || !i.hasAttribute("data-ln-progress-max")) return;
    const r = new MutationObserver(function(u) {
      for (const c of u)
        c.attributeName === "data-ln-progress-max" && o.call(e);
    });
    r.observe(i, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = r;
  }
  function o() {
    const e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, i = this.dom.parentElement, u = (i && i.hasAttribute("data-ln-progress-max") ? parseFloat(i.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let c = u > 0 ? e / u * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100), this.dom.style.width = c + "%", T(this.dom, "ln-progress:change", { target: this.dom, value: e, max: u, percentage: c });
  }
  window[a] = m, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-filter", a = "lnFilter", v = "data-ln-filter-initialized", m = "data-ln-filter-key", p = "data-ln-filter-value", g = "data-ln-filter-hide", s = "data-ln-filter-reset", n = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function o(r) {
    return r.hasAttribute(s) || r.getAttribute(p) === "";
  }
  function e(r) {
    const u = r.dom, c = r.colIndex, l = u.querySelector("template");
    if (!l || c === null) return;
    const _ = document.getElementById(r.targetId);
    if (!_) return;
    const d = _.tagName === "TABLE" ? _ : _.querySelector("table");
    if (!d || _.hasAttribute("data-ln-table")) return;
    const b = {}, y = [], S = d.tBodies;
    for (let C = 0; C < S.length; C++) {
      const k = S[C].rows;
      for (let F = 0; F < k.length; F++) {
        const q = k[F].cells[c], M = q ? q.textContent.trim() : "";
        M && !b[M] && (b[M] = !0, y.push(M));
      }
    }
    y.sort(function(C, k) {
      return C.localeCompare(k);
    });
    const A = u.querySelector("[" + m + "]"), w = A ? A.getAttribute(m) : u.getAttribute("data-ln-filter-key") || "col" + c;
    for (let C = 0; C < y.length; C++) {
      const k = l.content.cloneNode(!0), F = k.querySelector("input");
      F && (F.setAttribute(m, w), F.setAttribute(p, y[C]), kt(k, { text: y[C] }), u.appendChild(k));
    }
  }
  function i(r) {
    if (r.hasAttribute(v)) return this;
    this.dom = r, this.targetId = r.getAttribute(h), this._pendingEvents = [];
    const u = r.getAttribute(n);
    this.colIndex = u !== null ? parseInt(u, 10) : null, e(this), this.inputs = Array.from(r.querySelectorAll("[" + m + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(m) : null;
    const c = this, l = It(
      function() {
        c._render();
      },
      function() {
        c._afterRender();
      }
    );
    this.state = xt({
      key: null,
      values: []
    }, l), this._attachHandlers();
    let _ = !1;
    if (r.hasAttribute("data-ln-persist")) {
      const d = mt("filter", r);
      d && d.key && Array.isArray(d.values) && d.values.length > 0 && (this.state.key = d.key, this.state.values = d.values, _ = !0);
    }
    if (!_) {
      let d = null;
      const b = [];
      for (let y = 0; y < this.inputs.length; y++) {
        const S = this.inputs[y];
        if (S.checked && !o(S)) {
          d || (d = S.getAttribute(m));
          const A = S.getAttribute(p);
          A && b.push(A);
        }
      }
      b.length > 0 && (this.state.key = d, this.state.values = b, this._pendingEvents.push({
        name: "ln-filter:changed",
        detail: { key: d, values: b }
      }));
    }
    return r.setAttribute(v, ""), this;
  }
  i.prototype._attachHandlers = function() {
    const r = this;
    this.inputs.forEach(function(u) {
      u[a + "Bound"] || (u[a + "Bound"] = !0, u._lnFilterChange = function() {
        const c = u.getAttribute(m), l = u.getAttribute(p) || "";
        if (o(u)) {
          r._pendingEvents.push({
            name: "ln-filter:changed",
            detail: { key: c, values: [] }
          }), r.reset();
          return;
        }
        if (u.checked)
          r.state.values.indexOf(l) === -1 && (r.state.key = c, r.state.values.push(l));
        else {
          const _ = r.state.values.indexOf(l);
          if (_ !== -1 && r.state.values.splice(_, 1), r.state.values.length === 0) {
            r._pendingEvents.push({
              name: "ln-filter:changed",
              detail: { key: c, values: [] }
            }), r.reset();
            return;
          }
        }
        r._pendingEvents.push({
          name: "ln-filter:changed",
          detail: { key: r.state.key, values: r.state.values.slice() }
        });
      }, u.addEventListener("change", u._lnFilterChange));
    });
  }, i.prototype._render = function() {
    const r = this, u = this.state.key, c = this.state.values, l = u === null || c.length === 0, _ = [];
    for (let d = 0; d < c.length; d++)
      _.push(c[d].toLowerCase());
    if (this.inputs.forEach(function(d) {
      if (l)
        d.checked = o(d);
      else if (o(d))
        d.checked = !1;
      else {
        const b = d.getAttribute(p) || "";
        d.checked = c.indexOf(b) !== -1;
      }
    }), r.colIndex !== null)
      r._filterTableRows();
    else {
      const d = document.getElementById(r.targetId);
      if (!d) return;
      const b = d.children;
      for (let y = 0; y < b.length; y++) {
        const S = b[y];
        if (l) {
          S.removeAttribute(g);
          continue;
        }
        const A = S.getAttribute("data-" + u);
        S.removeAttribute(g), A !== null && _.indexOf(A.toLowerCase()) === -1 && S.setAttribute(g, "true");
      }
    }
  }, i.prototype._afterRender = function() {
    const r = this._pendingEvents;
    this._pendingEvents = [];
    for (let u = 0; u < r.length; u++)
      this._dispatchOnBoth(r[u].name, r[u].detail);
    this.dom.hasAttribute("data-ln-persist") && (this.state.key && this.state.values.length > 0 ? tt("filter", this.dom, { key: this.state.key, values: this.state.values.slice() }) : tt("filter", this.dom, null));
  }, i.prototype._dispatchOnBoth = function(r, u) {
    T(this.dom, r, u);
    const c = document.getElementById(this.targetId);
    c && c !== this.dom && T(c, r, u);
  }, i.prototype._filterTableRows = function() {
    const r = document.getElementById(this.targetId);
    if (!r) return;
    const u = r.tagName === "TABLE" ? r : r.querySelector("table");
    if (!u || r.hasAttribute("data-ln-table")) return;
    const c = this.state.key || this._filterKey, l = this.state.values;
    t.has(u) || t.set(u, {});
    const _ = t.get(u);
    if (c && l.length > 0) {
      const S = [];
      for (let A = 0; A < l.length; A++)
        S.push(l[A].toLowerCase());
      _[c] = { col: this.colIndex, values: S };
    } else c && delete _[c];
    const d = Object.keys(_), b = d.length > 0, y = u.tBodies;
    for (let S = 0; S < y.length; S++) {
      const A = y[S].rows;
      for (let w = 0; w < A.length; w++) {
        const C = A[w];
        if (!b) {
          C.removeAttribute(g);
          continue;
        }
        let k = !0;
        for (let F = 0; F < d.length; F++) {
          const q = _[d[F]], M = C.cells[q.col], j = M ? M.textContent.trim().toLowerCase() : "";
          if (q.values.indexOf(j) === -1) {
            k = !1;
            break;
          }
        }
        k ? C.removeAttribute(g) : C.setAttribute(g, "true");
      }
    }
  }, i.prototype.filter = function(r, u) {
    if (Array.isArray(u)) {
      if (u.length === 0) {
        this.reset();
        return;
      }
      this.state.key = r, this.state.values = u.slice();
    } else if (u)
      this.state.key = r, this.state.values = [u];
    else {
      this.reset();
      return;
    }
    this._pendingEvents.push({
      name: "ln-filter:changed",
      detail: { key: this.state.key, values: this.state.values.slice() }
    });
  }, i.prototype.reset = function() {
    this._pendingEvents.push({ name: "ln-filter:reset", detail: {} }), this.state.key = null, this.state.values = [];
  }, i.prototype.getActive = function() {
    return this.state.key === null || this.state.values.length === 0 ? null : { key: this.state.key, values: this.state.values.slice() };
  }, i.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const u = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (u && t.has(u)) {
            const c = t.get(u), l = this.state.key || this._filterKey;
            l && c[l] && delete c[l], Object.keys(c).length === 0 && t.delete(u);
          }
        }
      }
      this.inputs.forEach(function(r) {
        r._lnFilterChange && (r.removeEventListener("change", r._lnFilterChange), delete r._lnFilterChange), delete r[a + "Bound"];
      }), this.dom.removeAttribute(v), delete this.dom[a];
    }
  }, P(h, a, i, "ln-filter");
})();
(function() {
  const h = "data-ln-search", a = "lnSearch", v = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function g(s) {
    if (s.hasAttribute(v)) return this;
    this.dom = s, this.targetId = s.getAttribute(h);
    const n = s.tagName;
    if (this.input = n === "INPUT" || n === "TEXTAREA" ? s : s.querySelector('[name="search"]') || s.querySelector('input[type="search"]') || s.querySelector('input[type="text"]'), this.itemsSelector = s.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return s.setAttribute(v, ""), this;
  }
  g.prototype._attachHandler = function() {
    if (!this.input) return;
    const s = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      s.input.value = "", s._search(""), s.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(s._debounceTimer), s._debounceTimer = setTimeout(function() {
        s._search(s.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, g.prototype._search = function(s) {
    const n = document.getElementById(this.targetId);
    if (!n || K(n, "ln-search:change", { term: s, targetId: this.targetId }).defaultPrevented) return;
    const o = this.itemsSelector ? n.querySelectorAll(this.itemsSelector) : n.children;
    for (let e = 0; e < o.length; e++) {
      const i = o[e];
      i.removeAttribute(m), s && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(s) && i.setAttribute(m, "true");
    }
  }, g.prototype.destroy = function() {
    this.dom[a] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(v), delete this.dom[a]);
  }, P(h, a, g, "ln-search");
})();
(function() {
  const h = "lnTableSort", a = "data-ln-sort", v = "data-ln-sort-active";
  if (window[h] !== void 0) return;
  function m(t) {
    p(t);
  }
  function p(t) {
    const o = Array.from(t.querySelectorAll("table"));
    t.tagName === "TABLE" && o.push(t), o.forEach(function(e) {
      if (e[h]) return;
      const i = Array.from(e.querySelectorAll("th[" + a + "]"));
      i.length && (e[h] = new s(e, i));
    });
  }
  function g(t, o) {
    t.querySelectorAll("[data-ln-sort-icon]").forEach(function(i) {
      const r = i.getAttribute("data-ln-sort-icon");
      o == null ? i.classList.toggle("hidden", r !== null && r !== "") : i.classList.toggle("hidden", r !== o);
    });
  }
  function s(t, o) {
    this.table = t, this.ths = o, this._col = -1, this._dir = null;
    const e = this;
    o.forEach(function(r, u) {
      r[h + "Bound"] || (r[h + "Bound"] = !0, r._lnSortClick = function(c) {
        const l = c.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        l && l !== r || e._handleClick(u, r);
      }, r.addEventListener("click", r._lnSortClick));
    });
    const i = t.closest("[data-ln-table][data-ln-persist]");
    if (i) {
      const r = mt("table-sort", i);
      r && r.dir && r.col >= 0 && r.col < o.length && (this._handleClick(r.col, o[r.col]), r.dir === "desc" && this._handleClick(r.col, o[r.col]));
    }
    return this;
  }
  s.prototype._handleClick = function(t, o) {
    let e;
    this._col !== t ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this.ths.forEach(function(r) {
      r.removeAttribute(v), g(r, null);
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = t, this._dir = e, o.setAttribute(v, e), g(o, e)), T(this.table, "ln-table:sort", {
      column: t,
      sortType: o.getAttribute(a),
      direction: e
    });
    const i = this.table.closest("[data-ln-table][data-ln-persist]");
    i && (e === null ? tt("table-sort", i, null) : tt("table-sort", i, { col: t, dir: e }));
  }, s.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(t) {
      t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete t[h + "Bound"];
    }), delete this.table[h]);
  };
  function n() {
    z(function() {
      new MutationObserver(function(o) {
        o.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(i) {
            i.nodeType === 1 && p(i);
          }) : e.type === "attributes" && p(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [a] });
    }, "ln-table-sort");
  }
  window[h] = m, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-table", a = "lnTable", v = "data-ln-sort", m = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const s = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function n(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("tbody"), this.thead = t.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const o = t.querySelector(".ln-table__toolbar");
    o && t.style.setProperty("--ln-table-toolbar-h", o.offsetHeight + "px");
    const e = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      const i = new MutationObserver(function() {
        e.tbody.rows.length > 0 && (i.disconnect(), e._parseRows());
      });
      i.observe(this.tbody, { childList: !0 });
    }
    return this._onSearch = function(i) {
      i.preventDefault(), e._searchTerm = i.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onSort = function(i) {
      e._sortCol = i.detail.direction === null ? -1 : i.detail.column, e._sortDir = i.detail.direction, e._sortType = i.detail.sortType, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(i) {
      const r = i.detail.key;
      let u = !1;
      for (let _ = 0; _ < e.ths.length; _++)
        if (e.ths[_].getAttribute("data-ln-filter-col") === r) {
          u = !0;
          break;
        }
      if (!u) return;
      const c = i.detail.values;
      if (!c || c.length === 0)
        delete e._columnFilters[r];
      else {
        const _ = [];
        for (let d = 0; d < c.length; d++)
          _.push(c[d].toLowerCase());
        e._columnFilters[r] = _;
      }
      const l = e.dom.querySelector('th[data-ln-filter-col="' + r + '"]');
      l && (c && c.length > 0 ? l.setAttribute("data-ln-filter-active", "") : l.removeAttribute("data-ln-filter-active")), e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-table-clear]")) return;
      e._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (u) {
        const l = u.tagName === "INPUT" ? u : u.querySelector("input");
        l && (l.value = "");
      }
      e._columnFilters = {};
      for (let l = 0; l < e.ths.length; l++)
        e.ths[l].removeAttribute("data-ln-filter-active");
      const c = document.querySelectorAll('[data-ln-filter="' + t.id + '"]');
      for (let l = 0; l < c.length; l++)
        c[l].lnFilter && c[l].lnFilter.reset();
      e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: "",
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("click", this._onClear), this;
  }
  n.prototype._parseRows = function() {
    const t = this.tbody.rows, o = this.ths;
    this._data = [];
    const e = [];
    for (let i = 0; i < o.length; i++)
      e[i] = o[i].getAttribute(v);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let i = 0; i < t.length; i++) {
      const r = t[i], u = [], c = [], l = [];
      for (let _ = 0; _ < r.cells.length; _++) {
        const d = r.cells[_], b = d.textContent.trim(), y = d.hasAttribute("data-ln-value") ? d.getAttribute("data-ln-value") : b, S = e[_];
        c[_] = b.toLowerCase(), S === "number" || S === "date" ? u[_] = parseFloat(y) || 0 : S === "string" ? u[_] = String(y) : u[_] = null, _ < r.cells.length - 1 && l.push(b.toLowerCase());
      }
      this._data.push({
        sortKeys: u,
        rawTexts: c,
        html: r.outerHTML,
        searchText: l.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, n.prototype._applyFilterAndSort = function() {
    const t = this._searchTerm, o = this._columnFilters, e = Object.keys(o).length > 0, i = this.ths, r = {};
    if (e)
      for (let d = 0; d < i.length; d++) {
        const b = i[d].getAttribute("data-ln-filter-col");
        b && (r[b] = d);
      }
    if (!t && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(d) {
      if (t && d.searchText.indexOf(t) === -1) return !1;
      if (e)
        for (const b in o) {
          const y = r[b];
          if (y !== void 0 && o[b].indexOf(d.rawTexts[y]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const u = this._sortCol, c = this._sortDir === "desc" ? -1 : 1, l = this._sortType === "number" || this._sortType === "date", _ = s ? s.compare : function(d, b) {
      return d < b ? -1 : d > b ? 1 : 0;
    };
    this._filteredData.sort(function(d, b) {
      const y = d.sortKeys[u], S = b.sortKeys[u];
      return l ? (y - S) * c : _(y, S) * c;
    });
  }, n.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(o) {
      const e = document.createElement("col");
      e.style.width = o.offsetWidth + "px", t.appendChild(e);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, n.prototype._render = function() {
    if (!this.tbody) return;
    const t = this._filteredData.length;
    t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, n.prototype._renderAll = function() {
    const t = [], o = this._filteredData;
    for (let e = 0; e < o.length; e++) t.push(o[e].html);
    this.tbody.innerHTML = t.join("");
  }, n.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const t = this;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, n.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, n.prototype._renderVirtual = function() {
    const t = this._filteredData, o = t.length, e = this._rowHeight;
    if (!e || !o) return;
    const r = this.table.getBoundingClientRect().top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, c = r + u, l = window.scrollY - c, _ = Math.max(0, Math.floor(l / e) - 15), d = Math.min(_ + Math.ceil(window.innerHeight / e) + 30, o);
    if (_ === this._vStart && d === this._vEnd) return;
    this._vStart = _, this._vEnd = d;
    const b = this.ths.length || 1, y = _ * e, S = (o - d) * e;
    let A = "";
    y > 0 && (A += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + b + '" style="height:' + y + 'px;padding:0;border:none"></td></tr>');
    for (let w = _; w < d; w++) A += t[w].html;
    S > 0 && (A += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + b + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = A;
  }, n.prototype._showEmptyState = function() {
    const t = this.ths.length || 1, o = this.dom.querySelector("template[" + m + "]"), e = document.createElement("td");
    e.setAttribute("colspan", String(t)), o && e.appendChild(document.importNode(o.content, !0));
    const i = document.createElement("tr");
    i.className = "ln-table__empty", i.appendChild(e), this.tbody.innerHTML = "", this.tbody.appendChild(i), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, P(h, a, n, "ln-table");
})();
(function() {
  const h = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", m = 36, p = 16, g = 2 * Math.PI * p;
  function s(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), o.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  s.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[a]);
  };
  function n(i, r) {
    const u = document.createElementNS(v, i);
    for (const c in r)
      u.setAttribute(c, r[c]);
    return u;
  }
  function t() {
    this.svg = n("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = n("circle", {
      cx: m / 2,
      cy: m / 2,
      r: p,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: m / 2,
      cy: m / 2,
      r: p,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": g,
      "stroke-dashoffset": g,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const i = this, r = new MutationObserver(function(u) {
      for (const c of u)
        (c.attributeName === "data-ln-circular-progress" || c.attributeName === "data-ln-circular-progress-max") && e.call(i);
    });
    r.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = r;
  }
  function e() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, r = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let u = r > 0 ? i / r * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100);
    const c = g - u / 100 * g;
    this.progressCircle.setAttribute("stroke-dashoffset", c);
    const l = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = l !== null ? l : Math.round(u) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: r,
      percentage: u
    });
  }
  P(h, a, s, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", a = "lnSortable", v = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function m(s) {
    U(s, h, a, p);
  }
  function p(s) {
    this.dom = s, this.isEnabled = s.getAttribute(h) !== "disabled", this._dragging = null, s.setAttribute("aria-roledescription", "sortable list");
    const n = this;
    return this._onPointerDown = function(t) {
      n.isEnabled && n._handlePointerDown(t);
    }, s.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, p.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, p.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, p.prototype._handlePointerDown = function(s) {
    let n = s.target.closest("[" + v + "]"), t;
    if (n) {
      for (t = n; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (t = s.target; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
      n = t;
    }
    const e = Array.from(this.dom.children).indexOf(t);
    if (K(this.dom, "ln-sortable:before-drag", {
      item: t,
      index: e
    }).defaultPrevented) return;
    s.preventDefault(), n.setPointerCapture(s.pointerId), this._dragging = t, t.classList.add("ln-sortable--dragging"), t.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: t,
      index: e
    });
    const r = this, u = function(l) {
      r._handlePointerMove(l);
    }, c = function(l) {
      r._handlePointerEnd(l), n.removeEventListener("pointermove", u), n.removeEventListener("pointerup", c), n.removeEventListener("pointercancel", c);
    };
    n.addEventListener("pointermove", u), n.addEventListener("pointerup", c), n.addEventListener("pointercancel", c);
  }, p.prototype._handlePointerMove = function(s) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), t = this._dragging;
    for (const o of n)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const o of n) {
      if (o === t) continue;
      const e = o.getBoundingClientRect(), i = e.top + e.height / 2;
      if (s.clientY >= e.top && s.clientY < i) {
        o.classList.add("ln-sortable--drop-before");
        break;
      } else if (s.clientY >= i && s.clientY <= e.bottom) {
        o.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, p.prototype._handlePointerEnd = function(s) {
    if (!this._dragging) return;
    const n = this._dragging, t = Array.from(this.dom.children), o = t.indexOf(n);
    let e = null, i = null;
    for (const r of t) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        e = r, i = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        e = r, i = "after";
        break;
      }
    }
    for (const r of t)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== n) {
      i === "before" ? this.dom.insertBefore(n, e) : this.dom.insertBefore(n, e.nextElementSibling);
      const u = Array.from(this.dom.children).indexOf(n);
      T(this.dom, "ln-sortable:reordered", {
        item: n,
        oldIndex: o,
        newIndex: u
      });
    }
    this._dragging = null;
  };
  function g() {
    z(function() {
      new MutationObserver(function(n) {
        for (let t = 0; t < n.length; t++) {
          const o = n[t];
          if (o.type === "childList")
            for (let e = 0; e < o.addedNodes.length; e++) {
              const i = o.addedNodes[e];
              i.nodeType === 1 && U(i, h, a, p);
            }
          else if (o.type === "attributes") {
            const e = o.target, i = e[a];
            if (i) {
              const r = e.getAttribute(h) !== "disabled";
              r !== i.isEnabled && (i.isEnabled = r, T(e, r ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: e }));
            } else
              U(e, h, a, p);
          }
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-sortable");
  }
  window[a] = m, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-confirm", a = "lnConfirm", v = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function p(t) {
    U(t, h, a, g);
  }
  function g(t) {
    this.dom = t, this.confirming = !1, this.originalText = t.textContent.trim(), this.confirmText = t.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const o = this;
    return this._onClick = function(e) {
      if (!o.confirming)
        e.preventDefault(), e.stopImmediatePropagation(), o._enterConfirm();
      else {
        if (o._submitted) return;
        o._submitted = !0, o._reset();
      }
    }, t.addEventListener("click", this._onClick), this;
  }
  g.prototype._getTimeout = function() {
    const t = parseFloat(this.dom.getAttribute(v));
    return isNaN(t) || t <= 0 ? 3 : t;
  }, g.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var t = this.dom.querySelector("svg.ln-icon use");
    t && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = t.getAttribute("href"), t.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), T(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, g.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const t = this, o = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      t._reset();
    }, o);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var t = this.dom.querySelector("svg.ln-icon use");
      t && this.originalIconHref && t.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[a] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  };
  function s(t) {
    const o = t[a];
    !o || !o.confirming || o._startTimer();
  }
  function n() {
    z(function() {
      new MutationObserver(function(o) {
        for (let e = 0; e < o.length; e++) {
          const i = o[e];
          if (i.type === "childList")
            for (let r = 0; r < i.addedNodes.length; r++) {
              const u = i.addedNodes[r];
              u.nodeType === 1 && U(u, h, a, g);
            }
          else i.type === "attributes" && (i.attributeName === v && i.target[a] ? s(i.target) : U(i.target, h, a, g));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h, v]
      });
    }, "ln-confirm");
  }
  window[a] = p, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(p) {
    this.dom = p, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = p.getAttribute(h + "-default") || "", this.badgesEl = p.querySelector("[" + h + "-active]"), this.menuEl = p.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const g = p.getAttribute(h + "-locales");
    if (this.locales = v, g)
      try {
        this.locales = JSON.parse(g);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const s = this;
    return this._onRequestAdd = function(n) {
      n.detail && n.detail.lang && s.addLanguage(n.detail.lang);
    }, this._onRequestRemove = function(n) {
      n.detail && n.detail.lang && s.removeLanguage(n.detail.lang);
    }, p.addEventListener("ln-translations:request-add", this._onRequestAdd), p.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const g of p) {
      const s = g.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, m.prototype._detectExisting = function() {
    const p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const g of p) {
      const s = g.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, m.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const p = this;
    let g = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      g++;
      const t = yt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const o = t.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", n), o.textContent = this.locales[n], o.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.menuEl.getAttribute("data-ln-toggle") === "open" && p.menuEl.setAttribute("data-ln-toggle", "close"), p.addLanguage(n));
      }), this.menuEl.appendChild(t);
    }
    const s = this.dom.querySelector("[" + h + "-add]");
    s && (s.style.display = g === 0 ? "none" : "");
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const p = this;
    this.activeLanguages.forEach(function(g) {
      const s = yt("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", g);
      const t = n.querySelector("span");
      t.textContent = p.locales[g] || g.toUpperCase();
      const o = n.querySelector("button");
      o.setAttribute("aria-label", "Remove " + (p.locales[g] || g.toUpperCase())), o.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.removeLanguage(g));
      }), p.badgesEl.appendChild(s);
    });
  }, m.prototype.addLanguage = function(p, g) {
    if (this.activeLanguages.has(p)) return;
    const s = this.locales[p] || p;
    if (K(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: p,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(p), g = g || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of t) {
      const e = o.getAttribute("data-ln-translatable"), i = o.getAttribute("data-ln-translations-prefix") || "", r = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!r) continue;
      const u = r.cloneNode(!1);
      i ? u.name = i + "[trans][" + p + "][" + e + "]" : u.name = "trans[" + p + "][" + e + "]", u.value = g[e] !== void 0 ? g[e] : "", u.removeAttribute("id"), u.placeholder = s + " translation", u.setAttribute("data-ln-translatable-lang", p);
      const c = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), l = c.length > 0 ? c[c.length - 1] : r;
      l.parentNode.insertBefore(u, l.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: p,
      langName: s
    });
  }, m.prototype.removeLanguage = function(p) {
    if (!this.activeLanguages.has(p) || K(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: p
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + p + '"]');
    for (const n of s)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(p), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: p
    });
  }, m.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, m.prototype.hasLanguage = function(p) {
    return this.activeLanguages.has(p);
  }, m.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const p = this.defaultLang, g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of g)
      s.getAttribute("data-ln-translatable-lang") !== p && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, P(h, a, m, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", a = "lnAutosave", v = "data-ln-autosave-clear", m = "ln-autosave:";
  if (window[a] !== void 0) return;
  function p(n) {
    const t = g(n);
    if (!t) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", n);
      return;
    }
    this.dom = n, this.key = t;
    const o = this;
    return this._onFocusout = function(e) {
      const i = e.target;
      s(i) && i.name && o.save();
    }, this._onChange = function(e) {
      const i = e.target;
      s(i) && i.name && o.save();
    }, this._onSubmit = function() {
      o.clear();
    }, this._onReset = function() {
      o.clear();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + v + "]") && o.clear();
    }, n.addEventListener("focusout", this._onFocusout), n.addEventListener("change", this._onChange), n.addEventListener("submit", this._onSubmit), n.addEventListener("reset", this._onReset), n.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  p.prototype.save = function() {
    const n = St(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(n));
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:saved", { target: this.dom, data: n });
  }, p.prototype.restore = function() {
    let n;
    try {
      n = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (!n) return;
    let t;
    try {
      t = JSON.parse(n);
    } catch {
      return;
    }
    if (K(this.dom, "ln-autosave:before-restore", { target: this.dom, data: t }).defaultPrevented) return;
    const e = Lt(this.dom, t);
    for (let i = 0; i < e.length; i++)
      e[i].dispatchEvent(new Event("input", { bubbles: !0 })), e[i].dispatchEvent(new Event("change", { bubbles: !0 })), e[i].lnSelect && e[i].lnSelect.setValue && e[i].lnSelect.setValue(t[e[i].name]);
    T(this.dom, "ln-autosave:restored", { target: this.dom, data: t });
  }, p.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, p.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function g(n) {
    const o = n.getAttribute(h) || n.id;
    return o ? m + window.location.pathname + ":" + o : null;
  }
  function s(n) {
    const t = n.tagName;
    return t === "INPUT" || t === "TEXTAREA" || t === "SELECT";
  }
  P(h, a, p, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
  function v(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  v.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  }, P(h, a, v, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", a = "lnValidate", v = "data-ln-validate-errors", m = "data-ln-validate-error", p = "ln-validate-valid", g = "ln-validate-invalid", s = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[a] !== void 0) return;
  function n(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const o = this, e = t.tagName, i = t.type, r = e === "SELECT" || i === "checkbox" || i === "radio";
    return this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(u) {
      const c = u.detail && u.detail.error;
      if (!c) return;
      o._customErrors.add(c), o._touched = !0;
      const l = t.closest(".form-element");
      if (l) {
        const _ = l.querySelector("[" + m + '="' + c + '"]');
        _ && _.classList.remove("hidden");
      }
      t.classList.remove(p), t.classList.add(g);
    }, this._onClearCustom = function(u) {
      const c = u.detail && u.detail.error, l = t.closest(".form-element");
      if (c) {
        if (o._customErrors.delete(c), l) {
          const _ = l.querySelector("[" + m + '="' + c + '"]');
          _ && _.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(_) {
          if (l) {
            const d = l.querySelector("[" + m + '="' + _ + '"]');
            d && d.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, r || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  n.prototype.validate = function() {
    const t = this.dom, o = t.validity, i = t.checkValidity() && this._customErrors.size === 0, r = t.closest(".form-element");
    if (r) {
      const c = r.querySelector("[" + v + "]");
      if (c) {
        const l = c.querySelectorAll("[" + m + "]");
        for (let _ = 0; _ < l.length; _++) {
          const d = l[_].getAttribute(m), b = s[d];
          b && (o[b] ? l[_].classList.remove("hidden") : l[_].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(p, i), t.classList.toggle(g, !i), T(t, i ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), i;
  }, n.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, g);
    const t = this.dom.closest(".form-element");
    if (t) {
      const o = t.querySelectorAll("[" + m + "]");
      for (let e = 0; e < o.length; e++)
        o[e].classList.add("hidden");
    }
  }, Object.defineProperty(n.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), n.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(p, g), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a]);
  }, P(h, a, n, "ln-validate");
})();
(function() {
  const h = "data-ln-form", a = "lnForm", v = "data-ln-form-auto", m = "data-ln-form-debounce", p = "data-ln-validate", g = "lnValidate";
  if (window[a] !== void 0) return;
  function s(n) {
    this.dom = n, this._invalidFields = /* @__PURE__ */ new Set(), this._debounceTimer = null;
    const t = this;
    if (this._onValid = function(o) {
      t._invalidFields.delete(o.detail.field), t._updateSubmitButton();
    }, this._onInvalid = function(o) {
      t._invalidFields.add(o.detail.field), t._updateSubmitButton();
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
    }, n.addEventListener("ln-validate:valid", this._onValid), n.addEventListener("ln-validate:invalid", this._onInvalid), n.addEventListener("submit", this._onSubmit), n.addEventListener("ln-form:fill", this._onFill), n.addEventListener("ln-form:reset", this._onFormReset), n.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, n.hasAttribute(v)) {
      const o = parseInt(n.getAttribute(m)) || 0;
      this._onAutoInput = function() {
        o > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, o)) : t.submit();
      }, n.addEventListener("input", this._onAutoInput), n.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  s.prototype._updateSubmitButton = function() {
    const n = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!n.length) return;
    const t = this.dom.querySelectorAll("[" + p + "]");
    let o = !1;
    if (t.length > 0) {
      let e = !1, i = !1;
      for (let r = 0; r < t.length; r++) {
        const u = t[r][g];
        u && u._touched && (e = !0), t[r].checkValidity() || (i = !0);
      }
      o = i || !e;
    }
    for (let e = 0; e < n.length; e++)
      n[e].disabled = o;
  }, s.prototype.fill = function(n) {
    const t = Lt(this.dom, n);
    for (let o = 0; o < t.length; o++) {
      const e = t[o], i = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
  }, s.prototype.submit = function() {
    const n = this.dom.querySelectorAll("[" + p + "]");
    let t = !0;
    for (let e = 0; e < n.length; e++) {
      const i = n[e][g];
      i && (i.validate() || (t = !1));
    }
    if (!t) return;
    const o = St(this.dom);
    T(this.dom, "ln-form:submit", { data: o });
  }, s.prototype.reset = function() {
    this.dom.reset(), this._resetValidation();
  }, s.prototype._resetValidation = function() {
    this._invalidFields.clear();
    const n = this.dom.querySelectorAll("[" + p + "]");
    for (let t = 0; t < n.length; t++) {
      const o = n[t][g];
      o && o.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      const n = this.dom.querySelectorAll("[" + p + "]");
      for (let t = 0; t < n.length; t++)
        if (!n[t].checkValidity()) return !1;
      return !0;
    }
  }), s.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, P(h, a, s, "ln-form");
})();
(function() {
  const h = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const v = {}, m = {};
  function p(A) {
    return A.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function g(A, w) {
    const C = (A || "") + "|" + JSON.stringify(w);
    return v[C] || (v[C] = new Intl.DateTimeFormat(A, w)), v[C];
  }
  function s(A) {
    const w = A || "";
    return m[w] || (m[w] = new Intl.RelativeTimeFormat(A, { numeric: "auto", style: "narrow" })), m[w];
  }
  const n = /* @__PURE__ */ new Set();
  let t = null;
  function o() {
    t || (t = setInterval(i, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function i() {
    for (const A of n) {
      if (!document.body.contains(A.dom)) {
        n.delete(A);
        continue;
      }
      d(A);
    }
    n.size === 0 && e();
  }
  function r(A, w) {
    return g(w, { dateStyle: "long", timeStyle: "short" }).format(A);
  }
  function u(A, w) {
    const C = /* @__PURE__ */ new Date(), k = { month: "short", day: "numeric" };
    return A.getFullYear() !== C.getFullYear() && (k.year = "numeric"), g(w, k).format(A);
  }
  function c(A, w) {
    return g(w, { dateStyle: "medium" }).format(A);
  }
  function l(A, w) {
    return g(w, { timeStyle: "short" }).format(A);
  }
  function _(A, w) {
    const C = Math.floor(Date.now() / 1e3), F = Math.floor(A.getTime() / 1e3) - C, q = Math.abs(F);
    if (q < 10) return s(w).format(0, "second");
    let M, j;
    if (q < 60)
      M = "second", j = F;
    else if (q < 3600)
      M = "minute", j = Math.round(F / 60);
    else if (q < 86400)
      M = "hour", j = Math.round(F / 3600);
    else if (q < 604800)
      M = "day", j = Math.round(F / 86400);
    else if (q < 2592e3)
      M = "week", j = Math.round(F / 604800);
    else
      return u(A, w);
    return s(w).format(j, M);
  }
  function d(A) {
    const w = A.dom.getAttribute("datetime");
    if (!w) return;
    const C = Number(w);
    if (isNaN(C)) return;
    const k = new Date(C * 1e3), F = A.dom.getAttribute(h) || "short", q = p(A.dom);
    let M;
    switch (F) {
      case "relative":
        M = _(k, q);
        break;
      case "full":
        M = r(k, q);
        break;
      case "date":
        M = c(k, q);
        break;
      case "time":
        M = l(k, q);
        break;
      default:
        M = u(k, q);
        break;
    }
    A.dom.textContent = M, F !== "full" && (A.dom.title = r(k, q));
  }
  function b(A) {
    return this.dom = A, d(this), A.getAttribute(h) === "relative" && (n.add(this), o()), this;
  }
  b.prototype.render = function() {
    d(this);
  }, b.prototype.destroy = function() {
    n.delete(this), n.size === 0 && e(), delete this.dom[a];
  };
  function y(A) {
    U(A, h, a, b);
  }
  function S() {
    z(function() {
      new MutationObserver(function(w) {
        for (const C of w)
          if (C.type === "childList")
            for (const k of C.addedNodes)
              k.nodeType === 1 && U(k, h, a, b);
          else if (C.type === "attributes") {
            const k = C.target;
            k[a] ? (k.getAttribute(h) === "relative" ? (n.add(k[a]), o()) : (n.delete(k[a]), n.size === 0 && e()), d(k[a])) : U(k, h, a, b);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h, "datetime"]
      });
    }, "ln-time");
  }
  S(), window[a] = y, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const h = "data-ln-store", a = "lnStore";
  if (window[a] !== void 0) return;
  const v = "ln_app_cache", m = "_meta", p = "1.0";
  let g = null, s = null;
  const n = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(L) {
        const E = Math.random() * 16 | 0;
        return (L === "x" ? E : E & 3 | 8).toString(16);
      });
    }
  }
  function o(f) {
    f && f.name === "QuotaExceededError" && T(document, "ln-store:quota-exceeded", { error: f });
  }
  function e() {
    const f = document.querySelectorAll("[" + h + "]"), L = {};
    for (let E = 0; E < f.length; E++) {
      const O = f[E].getAttribute(h);
      O && (L[O] = {
        indexes: (f[E].getAttribute("data-ln-store-indexes") || "").split(",").map(function(I) {
          return I.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function i() {
    return s || (s = new Promise(function(f, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), f(null);
        return;
      }
      const E = e(), O = Object.keys(E), I = indexedDB.open(v);
      I.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), f(null);
      }, I.onsuccess = function(x) {
        const D = x.target.result, N = Array.from(D.objectStoreNames);
        let V = !1;
        N.indexOf(m) === -1 && (V = !0);
        for (let Q = 0; Q < O.length; Q++)
          if (N.indexOf(O[Q]) === -1) {
            V = !0;
            break;
          }
        if (!V) {
          r(D), g = D, f(D);
          return;
        }
        const lt = D.version;
        D.close();
        const ht = indexedDB.open(v, lt + 1);
        ht.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, ht.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), f(null);
        }, ht.onupgradeneeded = function(Q) {
          const J = Q.target.result;
          J.objectStoreNames.contains(m) || J.createObjectStore(m, { keyPath: "key" });
          for (let gt = 0; gt < O.length; gt++) {
            const _t = O[gt];
            if (!J.objectStoreNames.contains(_t)) {
              const Ct = J.createObjectStore(_t, { keyPath: "id" }), bt = E[_t].indexes;
              for (let pt = 0; pt < bt.length; pt++)
                Ct.createIndex(bt[pt], bt[pt], { unique: !1 });
            }
          }
        }, ht.onsuccess = function(Q) {
          const J = Q.target.result;
          r(J), g = J, f(J);
        };
      };
    }), s);
  }
  function r(f) {
    f.onversionchange = function() {
      f.close(), g = null, s = null;
    };
  }
  function u() {
    return g ? Promise.resolve(g) : (s = null, i());
  }
  function c(f, L) {
    return u().then(function(E) {
      return E ? E.transaction(f, L).objectStore(f) : null;
    });
  }
  function l(f) {
    return new Promise(function(L, E) {
      f.onsuccess = function() {
        L(f.result);
      }, f.onerror = function() {
        o(f.error), E(f.error);
      };
    });
  }
  function _(f) {
    return c(f, "readonly").then(function(L) {
      return L ? l(L.getAll()) : [];
    });
  }
  function d(f, L) {
    return c(f, "readonly").then(function(E) {
      return E ? l(E.get(L)) : null;
    });
  }
  function b(f, L) {
    return c(f, "readwrite").then(function(E) {
      if (E)
        return l(E.put(L));
    });
  }
  function y(f, L) {
    return c(f, "readwrite").then(function(E) {
      if (E)
        return l(E.delete(L));
    });
  }
  function S(f) {
    return c(f, "readwrite").then(function(L) {
      if (L)
        return l(L.clear());
    });
  }
  function A(f) {
    return c(f, "readonly").then(function(L) {
      return L ? l(L.count()) : 0;
    });
  }
  function w(f) {
    return c(m, "readonly").then(function(L) {
      return L ? l(L.get(f)) : null;
    });
  }
  function C(f, L) {
    return c(m, "readwrite").then(function(E) {
      if (E)
        return L.key = f, l(E.put(L));
    });
  }
  function k(f) {
    this.dom = f, this._name = f.getAttribute(h), this._endpoint = f.getAttribute("data-ln-store-endpoint") || "";
    const L = f.getAttribute("data-ln-store-stale"), E = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(E) ? 300 : E, this._searchFields = (f.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(I) {
      return I.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, n[this._name] = this;
    const O = this;
    return F(O), ut(O), this;
  }
  function F(f) {
    f._handlers = {
      create: function(L) {
        q(f, L.detail);
      },
      update: function(L) {
        M(f, L.detail);
      },
      delete: function(L) {
        j(f, L.detail);
      },
      bulkDelete: function(L) {
        dt(f, L.detail);
      }
    }, f.dom.addEventListener("ln-store:request-create", f._handlers.create), f.dom.addEventListener("ln-store:request-update", f._handlers.update), f.dom.addEventListener("ln-store:request-delete", f._handlers.delete), f.dom.addEventListener("ln-store:request-bulk-delete", f._handlers.bulkDelete);
  }
  function q(f, L) {
    const E = L.data || {}, O = "_temp_" + t(), I = Object.assign({}, E, { id: O });
    b(f._name, I).then(function() {
      return f.totalCount++, T(f.dom, "ln-store:created", {
        store: f._name,
        record: I,
        tempId: O
      }), fetch(f._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(E)
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      return x.json();
    }).then(function(x) {
      return y(f._name, O).then(function() {
        return b(f._name, x);
      }).then(function() {
        T(f.dom, "ln-store:confirmed", {
          store: f._name,
          record: x,
          tempId: O,
          action: "create"
        });
      });
    }).catch(function(x) {
      y(f._name, O).then(function() {
        f.totalCount--, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: I,
          action: "create",
          error: x.message
        });
      });
    });
  }
  function M(f, L) {
    const E = L.id, O = L.data || {}, I = L.expected_version;
    let x = null;
    d(f._name, E).then(function(D) {
      if (!D) throw new Error("Record not found: " + E);
      x = Object.assign({}, D);
      const N = Object.assign({}, D, O);
      return b(f._name, N).then(function() {
        return T(f.dom, "ln-store:updated", {
          store: f._name,
          record: N,
          previous: x
        }), N;
      });
    }).then(function(D) {
      const N = Object.assign({}, O);
      return I && (N.expected_version = I), fetch(f._endpoint + "/" + E, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(N)
      });
    }).then(function(D) {
      if (D.status === 409)
        return D.json().then(function(N) {
          return b(f._name, x).then(function() {
            T(f.dom, "ln-store:conflict", {
              store: f._name,
              local: x,
              remote: N.current || N,
              field_diffs: N.field_diffs || null
            });
          });
        });
      if (!D.ok) throw new Error("HTTP " + D.status);
      return D.json().then(function(N) {
        return b(f._name, N).then(function() {
          T(f.dom, "ln-store:confirmed", {
            store: f._name,
            record: N,
            action: "update"
          });
        });
      });
    }).catch(function(D) {
      x && b(f._name, x).then(function() {
        T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: x,
          action: "update",
          error: D.message
        });
      });
    });
  }
  function j(f, L) {
    const E = L.id;
    let O = null;
    d(f._name, E).then(function(I) {
      if (I)
        return O = Object.assign({}, I), y(f._name, E).then(function() {
          return f.totalCount--, T(f.dom, "ln-store:deleted", {
            store: f._name,
            id: E
          }), fetch(f._endpoint + "/" + E, {
            method: "DELETE",
            headers: { Accept: "application/json" }
          });
        });
    }).then(function(I) {
      if (!I || !I.ok) throw new Error("HTTP " + (I ? I.status : "unknown"));
      T(f.dom, "ln-store:confirmed", {
        store: f._name,
        record: O,
        action: "delete"
      });
    }).catch(function(I) {
      O && b(f._name, O).then(function() {
        f.totalCount++, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: O,
          action: "delete",
          error: I.message
        });
      });
    });
  }
  function dt(f, L) {
    const E = L.ids || [];
    if (E.length === 0) return;
    let O = [];
    const I = E.map(function(x) {
      return d(f._name, x);
    });
    Promise.all(I).then(function(x) {
      return O = x.filter(Boolean), ot(f._name, E).then(function() {
        return f.totalCount -= E.length, T(f.dom, "ln-store:deleted", {
          store: f._name,
          ids: E
        }), fetch(f._endpoint + "/bulk-delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ids: E })
        });
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      T(f.dom, "ln-store:confirmed", {
        store: f._name,
        record: null,
        ids: E,
        action: "bulk-delete"
      });
    }).catch(function(x) {
      O.length > 0 && nt(f._name, O).then(function() {
        f.totalCount += O.length, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: null,
          ids: E,
          action: "bulk-delete",
          error: x.message
        });
      });
    });
  }
  function ut(f) {
    i().then(function() {
      return w(f._name);
    }).then(function(L) {
      L && L.schema_version === p ? (f.lastSyncedAt = L.last_synced_at || null, f.totalCount = L.record_count || 0, f.totalCount > 0 ? (f.isLoaded = !0, T(f.dom, "ln-store:ready", {
        store: f._name,
        count: f.totalCount,
        source: "cache"
      }), it(f) && et(f)) : X(f)) : L && L.schema_version !== p ? S(f._name).then(function() {
        return C(f._name, {
          schema_version: p,
          last_synced_at: null,
          record_count: 0
        });
      }).then(function() {
        X(f);
      }) : X(f);
    });
  }
  function it(f) {
    return f._staleThreshold === -1 ? !1 : f.lastSyncedAt ? Math.floor(Date.now() / 1e3) - f.lastSyncedAt > f._staleThreshold : !0;
  }
  function X(f) {
    return f._endpoint ? (f.isSyncing = !0, f._abortController = new AbortController(), fetch(f._endpoint, { signal: f._abortController.signal }).then(function(L) {
      if (!L.ok) throw new Error("HTTP " + L.status);
      return L.json();
    }).then(function(L) {
      const E = L.data || [], O = L.synced_at || Math.floor(Date.now() / 1e3);
      return nt(f._name, E).then(function() {
        return C(f._name, {
          schema_version: p,
          last_synced_at: O,
          record_count: E.length
        });
      }).then(function() {
        f.isLoaded = !0, f.isSyncing = !1, f.lastSyncedAt = O, f.totalCount = E.length, f._abortController = null, T(f.dom, "ln-store:loaded", {
          store: f._name,
          count: E.length
        }), T(f.dom, "ln-store:ready", {
          store: f._name,
          count: E.length,
          source: "server"
        });
      });
    }).catch(function(L) {
      f.isSyncing = !1, f._abortController = null, L.name !== "AbortError" && (f.isLoaded ? T(f.dom, "ln-store:offline", { store: f._name }) : T(f.dom, "ln-store:error", {
        store: f._name,
        action: "full-load",
        error: L.message,
        status: null
      }));
    })) : Promise.resolve();
  }
  function et(f) {
    if (!f._endpoint || !f.lastSyncedAt) return X(f);
    f.isSyncing = !0, f._abortController = new AbortController();
    const L = f._endpoint + (f._endpoint.indexOf("?") === -1 ? "?" : "&") + "since=" + f.lastSyncedAt;
    return fetch(L, { signal: f._abortController.signal }).then(function(E) {
      if (!E.ok) throw new Error("HTTP " + E.status);
      return E.json();
    }).then(function(E) {
      const O = E.data || [], I = E.deleted || [], x = E.synced_at || Math.floor(Date.now() / 1e3), D = O.length > 0 || I.length > 0;
      let N = Promise.resolve();
      return O.length > 0 && (N = N.then(function() {
        return nt(f._name, O);
      })), I.length > 0 && (N = N.then(function() {
        return ot(f._name, I);
      })), N.then(function() {
        return A(f._name);
      }).then(function(V) {
        return f.totalCount = V, C(f._name, {
          schema_version: p,
          last_synced_at: x,
          record_count: V
        });
      }).then(function() {
        f.isSyncing = !1, f.lastSyncedAt = x, f._abortController = null, T(f.dom, "ln-store:synced", {
          store: f._name,
          added: O.length,
          deleted: I.length,
          changed: D
        });
      });
    }).catch(function(E) {
      f.isSyncing = !1, f._abortController = null, E.name !== "AbortError" && T(f.dom, "ln-store:offline", { store: f._name });
    });
  }
  function nt(f, L) {
    return u().then(function(E) {
      if (E)
        return new Promise(function(O, I) {
          const x = E.transaction(f, "readwrite"), D = x.objectStore(f);
          for (let N = 0; N < L.length; N++)
            D.put(L[N]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            o(x.error), I(x.error);
          };
        });
    });
  }
  function ot(f, L) {
    return u().then(function(E) {
      if (E)
        return new Promise(function(O, I) {
          const x = E.transaction(f, "readwrite"), D = x.objectStore(f);
          for (let N = 0; N < L.length; N++)
            D.delete(L[N]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            I(x.error);
          };
        });
    });
  }
  let R = null;
  R = function() {
    if (document.visibilityState !== "visible") return;
    const f = Object.keys(n);
    for (let L = 0; L < f.length; L++) {
      const E = n[f[L]];
      E.isLoaded && !E.isSyncing && it(E) && et(E);
    }
  }, document.addEventListener("visibilitychange", R);
  const B = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function H(f, L) {
    if (!L || !L.field) return f;
    const E = L.field, O = L.direction === "desc";
    return f.slice().sort(function(I, x) {
      const D = I[E], N = x[E];
      if (D == null && N == null) return 0;
      if (D == null) return O ? 1 : -1;
      if (N == null) return O ? -1 : 1;
      let V;
      return typeof D == "string" && typeof N == "string" ? V = B.compare(D, N) : V = D < N ? -1 : D > N ? 1 : 0, O ? -V : V;
    });
  }
  function G(f, L) {
    if (!L) return f;
    const E = Object.keys(L);
    return E.length === 0 ? f : f.filter(function(O) {
      for (let I = 0; I < E.length; I++) {
        const x = E[I], D = L[x];
        if (!Array.isArray(D) || D.length === 0) continue;
        const N = O[x];
        let V = !1;
        for (let lt = 0; lt < D.length; lt++)
          if (String(N) === String(D[lt])) {
            V = !0;
            break;
          }
        if (!V) return !1;
      }
      return !0;
    });
  }
  function ft(f, L, E) {
    if (!L || !E || E.length === 0) return f;
    const O = L.toLowerCase();
    return f.filter(function(I) {
      for (let x = 0; x < E.length; x++) {
        const D = I[E[x]];
        if (D != null && String(D).toLowerCase().indexOf(O) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function W(f, L, E) {
    if (f.length === 0) return 0;
    if (E === "count") return f.length;
    let O = 0, I = 0;
    for (let x = 0; x < f.length; x++) {
      const D = parseFloat(f[x][L]);
      isNaN(D) || (O += D, I++);
    }
    return E === "sum" ? O : E === "avg" && I > 0 ? O / I : 0;
  }
  k.prototype.getAll = function(f) {
    const L = this;
    return f = f || {}, _(L._name).then(function(E) {
      const O = E.length;
      f.filters && (E = G(E, f.filters)), f.search && (E = ft(E, f.search, L._searchFields));
      const I = E.length;
      if (f.sort && (E = H(E, f.sort)), f.offset || f.limit) {
        const x = f.offset || 0, D = f.limit || E.length;
        E = E.slice(x, x + D);
      }
      return {
        data: E,
        total: O,
        filtered: I
      };
    });
  }, k.prototype.getById = function(f) {
    return d(this._name, f);
  }, k.prototype.count = function(f) {
    const L = this;
    return f ? _(L._name).then(function(E) {
      return G(E, f).length;
    }) : A(L._name);
  }, k.prototype.aggregate = function(f, L) {
    return _(this._name).then(function(O) {
      return W(O, f, L);
    });
  }, k.prototype.forceSync = function() {
    return et(this);
  }, k.prototype.fullReload = function() {
    const f = this;
    return S(f._name).then(function() {
      return f.isLoaded = !1, f.lastSyncedAt = null, f.totalCount = 0, X(f);
    });
  }, k.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete n[this._name], Object.keys(n).length === 0 && R && (document.removeEventListener("visibilitychange", R), R = null), delete this.dom[a], T(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function rt() {
    return u().then(function(f) {
      if (!f) return;
      const L = Array.from(f.objectStoreNames);
      return new Promise(function(E, O) {
        const I = f.transaction(L, "readwrite");
        for (let x = 0; x < L.length; x++)
          I.objectStore(L[x]).clear();
        I.oncomplete = function() {
          E();
        }, I.onerror = function() {
          O(I.error);
        };
      });
    }).then(function() {
      const f = Object.keys(n);
      for (let L = 0; L < f.length; L++) {
        const E = n[f[L]];
        E.isLoaded = !1, E.isSyncing = !1, E.lastSyncedAt = null, E.totalCount = 0;
      }
    });
  }
  function Y(f) {
    U(f, h, a, k);
  }
  function st() {
    z(function() {
      new MutationObserver(function(L) {
        for (let E = 0; E < L.length; E++) {
          const O = L[E];
          if (O.type === "childList")
            for (let I = 0; I < O.addedNodes.length; I++) {
              const x = O.addedNodes[I];
              x.nodeType === 1 && U(x, h, a, k);
            }
          else O.type === "attributes" && U(O.target, h, a, k);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-store");
  }
  window[a] = { init: Y, clearAll: rt }, st(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    Y(document.body);
  }) : Y(document.body);
})();
(function() {
  const h = "data-ln-data-table", a = "lnDataTable";
  if (window[a] !== void 0) return;
  const p = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function g(n) {
    return p ? p.format(n) : String(n);
  }
  function s(n) {
    this.dom = n, this.name = n.getAttribute(h) || "", this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-data-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(o) {
      return o.getAttribute("data-ln-col") && o.querySelector("[data-ln-col-filter]");
    }).map(function(o) {
      return o.getAttribute("data-ln-col");
    }), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._totalSpan = n.querySelector("[data-ln-data-table-total]"), this._filteredSpan = n.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = n.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const t = this;
    if (this._onSetData = function(o) {
      const e = o.detail || {};
      t._data = e.data || [], t._lastTotal = e.total != null ? e.total : t._data.length, t._lastFiltered = e.filtered != null ? e.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._updateFilterOptions(e.filterOptions), t._vStart = -1, t._vEnd = -1, t._renderRows(), t._updateFooter(), T(n, "ln-data-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, n.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(o) {
      const e = o.detail && o.detail.loading;
      n.classList.toggle("ln-data-table--loading", !!e), e && (t.isLoaded = !1);
    }, n.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(n.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(o) {
      const e = o.target.closest("[data-ln-col-sort]");
      if (!e) return;
      const i = e.closest("th");
      if (!i) return;
      const r = i.getAttribute("data-ln-col");
      r && t._handleSort(r, i);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(o) {
      const e = o.target.closest("[data-ln-col-filter]");
      if (!e) return;
      o.stopPropagation();
      const i = e.closest("th");
      if (!i) return;
      const r = i.getAttribute("data-ln-col");
      if (r) {
        if (t._activeDropdown && t._activeDropdown.field === r) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(r, i, e);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(o) {
      o.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), T(n, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, n.addEventListener("click", this._onClearAll), this._selectable = n.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(o) {
        const e = o.target.closest("[data-ln-row-select]");
        if (!e) return;
        const i = e.closest("[data-ln-row]");
        if (!i) return;
        const r = i.getAttribute("data-ln-row-id");
        r != null && (e.checked ? (t.selectedIds.add(r), i.classList.add("ln-row-selected")) : (t.selectedIds.delete(r), i.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), T(n, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = n.querySelector('[data-ln-col-select] input[type="checkbox"]') || n.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const o = document.createElement("input");
        o.type = "checkbox", o.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(o), this._selectAllCheckbox = o;
      }
      if (this._selectAllCheckbox && (this._onSelectAll = function() {
        const o = t._selectAllCheckbox.checked, e = t.tbody ? t.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let i = 0; i < e.length; i++) {
          const r = e[i].getAttribute("data-ln-row-id"), u = e[i].querySelector("[data-ln-row-select]");
          r != null && (o ? (t.selectedIds.add(r), e[i].classList.add("ln-row-selected")) : (t.selectedIds.delete(r), e[i].classList.remove("ln-row-selected")), u && (u.checked = o));
        }
        t.selectedCount = t.selectedIds.size, T(n, "ln-data-table:select-all", {
          table: t.name,
          selected: o
        }), T(n, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }), t._updateFooter();
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
        const o = this.tbody.querySelectorAll("[data-ln-row]");
        for (let e = 0; e < o.length; e++) {
          const i = o[e].querySelector("[data-ln-row-select]"), r = o[e].getAttribute("data-ln-row-id");
          i && i.checked && r != null && (this.selectedIds.add(r), o[e].classList.add("ln-row-selected"));
        }
        this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
      }
    }
    return this._onRowClick = function(o) {
      if (o.target.closest("[data-ln-row-select]") || o.target.closest("[data-ln-row-action]") || o.target.closest("a") || o.target.closest("button") || o.ctrlKey || o.metaKey || o.button === 1) return;
      const e = o.target.closest("[data-ln-row]");
      if (!e) return;
      const i = e.getAttribute("data-ln-row-id"), r = e._lnRecord || {};
      T(n, "ln-data-table:row-click", {
        table: t.name,
        id: i,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(o) {
      const e = o.target.closest("[data-ln-row-action]");
      if (!e) return;
      o.stopPropagation();
      const i = e.closest("[data-ln-row]");
      if (!i) return;
      const r = e.getAttribute("data-ln-row-action"), u = i.getAttribute("data-ln-row-id"), c = i._lnRecord || {};
      T(n, "ln-data-table:row-action", {
        table: t.name,
        id: u,
        action: r,
        record: c
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = n.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, T(n, "ln-data-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(o) {
      if (!n.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (o.key === "/") {
        t._searchInput && (o.preventDefault(), t._searchInput.focus());
        return;
      }
      const e = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (e.length)
        switch (o.key) {
          case "ArrowDown":
            o.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, e.length - 1), t._focusRow(e);
            break;
          case "ArrowUp":
            o.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(e);
            break;
          case "Home":
            o.preventDefault(), t._focusedRowIndex = 0, t._focusRow(e);
            break;
          case "End":
            o.preventDefault(), t._focusedRowIndex = e.length - 1, t._focusRow(e);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              o.preventDefault();
              const i = e[t._focusedRowIndex];
              T(n, "ln-data-table:row-click", {
                table: t.name,
                id: i.getAttribute("data-ln-row-id"),
                record: i._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              o.preventDefault();
              const i = e[t._focusedRowIndex].querySelector("[data-ln-row-select]");
              i && (i.checked = !i.checked, i.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            t._activeDropdown && t._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), T(n, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  s.prototype._handleSort = function(n, t) {
    let o;
    !this.currentSort || this.currentSort.field !== n ? o = "asc" : this.currentSort.direction === "asc" ? o = "desc" : o = null;
    for (let e = 0; e < this.ths.length; e++)
      this.ths[e].classList.remove("ln-sort-asc", "ln-sort-desc");
    o ? (this.currentSort = { field: n, direction: o }, t.classList.add(o === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: n,
      direction: o
    }), this._requestData();
  }, s.prototype._requestData = function() {
    T(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, s.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-row]");
    let t = n.length > 0;
    for (let o = 0; o < n.length; o++) {
      const e = n[o].getAttribute("data-ln-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, Object.defineProperty(s.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), s.prototype._focusRow = function(n) {
    for (let t = 0; t < n.length; t++)
      n[t].classList.remove("ln-row-focused"), n[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < n.length) {
      const t = n[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, s.prototype._openFilterDropdown = function(n, t, o) {
    this._closeFilterDropdown();
    const e = at(this.dom, this.name + "-column-filter", "ln-data-table") || at(this.dom, "column-filter", "ln-data-table");
    if (!e) return;
    const i = e.firstElementChild;
    if (!i) return;
    const r = this._getUniqueValues(n), u = i.querySelector("[data-ln-filter-options]"), c = i.querySelector("[data-ln-filter-search]"), l = this.currentFilters[n] || [], _ = this;
    if (c && r.length <= 8 && c.classList.add("hidden"), u) {
      for (let b = 0; b < r.length; b++) {
        const y = r[b], S = document.createElement("li"), A = document.createElement("label"), w = document.createElement("input");
        w.type = "checkbox", w.value = y, w.checked = l.length === 0 || l.indexOf(y) !== -1, A.appendChild(w), A.appendChild(document.createTextNode(" " + y)), S.appendChild(A), u.appendChild(S);
      }
      u.addEventListener("change", function(b) {
        b.target.type === "checkbox" && _._onFilterChange(n, u);
      });
    }
    c && c.addEventListener("input", function() {
      const b = c.value.toLowerCase(), y = u.querySelectorAll("li");
      for (let S = 0; S < y.length; S++) {
        const A = y[S].textContent.toLowerCase();
        y[S].classList.toggle("hidden", b && A.indexOf(b) === -1);
      }
    });
    const d = i.querySelector("[data-ln-filter-clear]");
    d && d.addEventListener("click", function() {
      delete _.currentFilters[n], _._closeFilterDropdown(), _._updateFilterIndicators(), T(_.dom, "ln-data-table:filter", {
        table: _.name,
        field: n,
        values: []
      }), _._requestData();
    }), t.appendChild(i), this._activeDropdown = { field: n, th: t, el: i }, i.addEventListener("click", function(b) {
      b.stopPropagation();
    });
  }, s.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, s.prototype._onFilterChange = function(n, t) {
    const o = t.querySelectorAll('input[type="checkbox"]'), e = [];
    let i = !0;
    for (let r = 0; r < o.length; r++)
      o[r].checked ? e.push(o[r].value) : i = !1;
    i || e.length === 0 ? delete this.currentFilters[n] : this.currentFilters[n] = e, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: n,
      values: i ? [] : e
    }), this._requestData();
  }, s.prototype._updateFilterOptions = function(n) {
    if (n !== null && typeof n == "object" && !Array.isArray(n)) {
      const t = Object.keys(n);
      for (let o = 0; o < t.length; o++) {
        const e = t[o], i = n[e];
        if (!Array.isArray(i)) continue;
        const r = {}, u = [];
        for (let c = 0; c < i.length; c++) {
          const l = String(i[c]);
          r[l] || (r[l] = !0, u.push(l));
        }
        this._filterOptions[e] = u.sort();
      }
    } else {
      const t = this._filterableFields, o = this._data;
      for (let e = 0; e < t.length; e++) {
        const i = t[e];
        this._filterOptions[i] || (this._filterOptions[i] = []);
        const r = this._filterOptions[i], u = {};
        for (let c = 0; c < r.length; c++)
          u[r[c]] = !0;
        for (let c = 0; c < o.length; c++) {
          const l = o[c][i];
          if (l != null) {
            const _ = String(l);
            u[_] || (u[_] = !0, r.push(_));
          }
        }
        r.sort();
      }
    }
  }, s.prototype._getUniqueValues = function(n) {
    return (this._filterOptions[n] || []).slice().sort();
  }, s.prototype._updateFilterIndicators = function() {
    const n = this.ths;
    for (let t = 0; t < n.length; t++) {
      const o = n[t], e = o.getAttribute("data-ln-col");
      if (!e) continue;
      const i = o.querySelector("[data-ln-col-filter]");
      if (!i) continue;
      const r = this.currentFilters[e] && this.currentFilters[e].length > 0;
      i.classList.toggle("ln-filter-active", !!r);
    }
  }, s.prototype._renderRows = function() {
    if (!this.tbody) return;
    const n = this._data, t = this._lastTotal, o = this._lastFiltered;
    if (t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (n.length === 0 || o === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    n.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, s.prototype._renderAll = function() {
    const n = this._data, t = document.createDocumentFragment();
    for (let o = 0; o < n.length; o++) {
      const e = this._buildRow(n[o]);
      if (!e) break;
      t.appendChild(e);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, s.prototype._buildRow = function(n) {
    const t = at(this.dom, this.name + "-row", "ln-data-table");
    if (!t) return null;
    const o = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!o) return null;
    if (this._fillRow(o, n), o._lnRecord = n, n.id != null && o.setAttribute("data-ln-row-id", n.id), this._selectable && n.id != null && this.selectedIds.has(String(n.id))) {
      o.classList.add("ln-row-selected");
      const e = o.querySelector("[data-ln-row-select]");
      e && (e.checked = !0);
    }
    return o;
  }, s.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    if (!this._rowHeight) {
      const t = this._buildRow(this._data[0]);
      t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const n = this._data, t = n.length, o = this._rowHeight;
    if (!o || !t) return;
    const i = this.table.getBoundingClientRect().top + window.scrollY, r = this.thead ? this.thead.offsetHeight : 0, u = i + r, c = window.scrollY - u, l = Math.max(0, Math.floor(c / o) - 15), _ = Math.min(l + Math.ceil(window.innerHeight / o) + 30, t);
    if (l === this._vStart && _ === this._vEnd) return;
    this._vStart = l, this._vEnd = _;
    const d = this.ths.length || 1, b = l * o, y = (t - _) * o, S = document.createDocumentFragment();
    if (b > 0) {
      const A = document.createElement("tr");
      A.className = "ln-data-table__spacer", A.setAttribute("aria-hidden", "true");
      const w = document.createElement("td");
      w.setAttribute("colspan", d), w.style.height = b + "px", A.appendChild(w), S.appendChild(A);
    }
    for (let A = l; A < _; A++) {
      const w = this._buildRow(n[A]);
      w && S.appendChild(w);
    }
    if (y > 0) {
      const A = document.createElement("tr");
      A.className = "ln-data-table__spacer", A.setAttribute("aria-hidden", "true");
      const w = document.createElement("td");
      w.setAttribute("colspan", d), w.style.height = y + "px", A.appendChild(w), S.appendChild(A);
    }
    this.tbody.textContent = "", this.tbody.appendChild(S), this._selectable && this._updateSelectAll();
  }, s.prototype._fillRow = function(n, t) {
    const o = n.querySelectorAll("[data-ln-cell]");
    for (let i = 0; i < o.length; i++) {
      const r = o[i], u = r.getAttribute("data-ln-cell");
      t[u] != null && (r.textContent = t[u]);
    }
    const e = n.querySelectorAll("[data-ln-cell-attr]");
    for (let i = 0; i < e.length; i++) {
      const r = e[i], u = r.getAttribute("data-ln-cell-attr").split(",");
      for (let c = 0; c < u.length; c++) {
        const l = u[c].trim().split(":");
        if (l.length !== 2) continue;
        const _ = l[0].trim(), d = l[1].trim();
        t[_] != null && r.setAttribute(d, t[_]);
      }
    }
  }, s.prototype._showEmptyState = function(n) {
    const t = at(this.dom, n, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, s.prototype._updateFooter = function() {
    const n = this._lastTotal, t = this._lastFiltered, o = t < n;
    if (this._totalSpan && (this._totalSpan.textContent = g(n)), this._filteredSpan && (this._filteredSpan.textContent = o ? g(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !o), this._selectedSpan) {
      const e = this.selectedIds.size;
      this._selectedSpan.textContent = e > 0 ? g(e) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[a]);
  }, P(h, a, s, "ln-data-table");
})();
(function() {
  const h = "ln-icons-sprite", a = "#ln-", v = "#lnc-", m = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let g = null;
  const s = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), n = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", o = "lni:v", e = "1";
  function i() {
    try {
      if (localStorage.getItem(o) !== e) {
        for (let b = localStorage.length - 1; b >= 0; b--) {
          const y = localStorage.key(b);
          y && y.indexOf(t) === 0 && localStorage.removeItem(y);
        }
        localStorage.setItem(o, e);
      }
    } catch {
    }
  }
  i();
  function r() {
    return g || (g = document.getElementById(h), g || (g = document.createElementNS("http://www.w3.org/2000/svg", "svg"), g.id = h, g.setAttribute("hidden", ""), g.setAttribute("aria-hidden", "true"), g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(g, document.body.firstChild))), g;
  }
  function u(b) {
    return b.indexOf(v) === 0 ? n + "/" + b.slice(v.length) + ".svg" : s + "/" + b.slice(a.length) + ".svg";
  }
  function c(b, y) {
    const S = y.match(/viewBox="([^"]+)"/), A = S ? S[1] : "0 0 24 24", w = y.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = w ? w[1].trim() : "", k = y.match(/<svg([^>]*)>/i), F = k ? k[1] : "", q = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    q.id = b, q.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const j = F.match(new RegExp(M + '="([^"]*)"'));
      j && q.setAttribute(M, j[1]);
    }), q.innerHTML = C, r().querySelector("defs").appendChild(q);
  }
  function l(b) {
    if (m.has(b) || p.has(b) || b.indexOf(v) === 0 && !n) return;
    const y = b.slice(1);
    try {
      const S = localStorage.getItem(t + y);
      if (S) {
        c(y, S), m.add(b);
        return;
      }
    } catch {
    }
    p.add(b), fetch(u(b)).then(function(S) {
      if (!S.ok) throw new Error(S.status);
      return S.text();
    }).then(function(S) {
      c(y, S), m.add(b), p.delete(b);
      try {
        localStorage.setItem(t + y, S);
      } catch {
      }
    }).catch(function() {
      p.delete(b);
    });
  }
  function _(b) {
    const y = 'use[href^="' + a + '"], use[href^="' + v + '"]', S = b.querySelectorAll ? b.querySelectorAll(y) : [];
    if (b.matches && b.matches(y)) {
      const A = b.getAttribute("href");
      A && l(A);
    }
    Array.prototype.forEach.call(S, function(A) {
      const w = A.getAttribute("href");
      w && l(w);
    });
  }
  function d() {
    _(document), new MutationObserver(function(b) {
      b.forEach(function(y) {
        if (y.type === "childList")
          y.addedNodes.forEach(function(S) {
            S.nodeType === 1 && _(S);
          });
        else if (y.type === "attributes" && y.attributeName === "href") {
          const S = y.target.getAttribute("href");
          S && (S.indexOf(a) === 0 || S.indexOf(v) === 0) && l(S);
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
