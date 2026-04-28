const vt = {};
function yt(u, l) {
  vt[u] || (vt[u] = document.querySelector('[data-ln-template="' + u + '"]'));
  const v = vt[u];
  return v ? v.content.cloneNode(!0) : (console.warn("[" + (l || "ln-core") + '] Template "' + u + '" not found'), null);
}
function T(u, l, v) {
  u.dispatchEvent(new CustomEvent(l, {
    bubbles: !0,
    detail: v || {}
  }));
}
function K(u, l, v) {
  const g = new CustomEvent(l, {
    bubbles: !0,
    cancelable: !0,
    detail: v || {}
  });
  return u.dispatchEvent(g), g;
}
function Z(u, l) {
  if (!u || !l) return u;
  const v = u.querySelectorAll("[data-ln-field]");
  for (let h = 0; h < v.length; h++) {
    const i = v[h], t = i.getAttribute("data-ln-field");
    l[t] != null && (i.textContent = l[t]);
  }
  const g = u.querySelectorAll("[data-ln-attr]");
  for (let h = 0; h < g.length; h++) {
    const i = g[h], t = i.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < t.length; n++) {
      const e = t[n].trim().split(":");
      if (e.length !== 2) continue;
      const o = e[0].trim(), r = e[1].trim();
      l[r] != null && i.setAttribute(o, l[r]);
    }
  }
  const p = u.querySelectorAll("[data-ln-show]");
  for (let h = 0; h < p.length; h++) {
    const i = p[h], t = i.getAttribute("data-ln-show");
    t in l && i.classList.toggle("hidden", !l[t]);
  }
  const b = u.querySelectorAll("[data-ln-class]");
  for (let h = 0; h < b.length; h++) {
    const i = b[h], t = i.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < t.length; n++) {
      const e = t[n].trim().split(":");
      if (e.length !== 2) continue;
      const o = e[0].trim(), r = e[1].trim();
      r in l && i.classList.toggle(o, !!l[r]);
    }
  }
  return u;
}
function kt(u, l) {
  if (!u || !l) return u;
  const v = document.createTreeWalker(u, NodeFilter.SHOW_TEXT);
  for (; v.nextNode(); ) {
    const g = v.currentNode;
    g.textContent.indexOf("{{") !== -1 && (g.textContent = g.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(p, b) {
        return l[b] !== void 0 ? l[b] : "";
      }
    ));
  }
  return u;
}
function H(u, l) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      H(u, l);
    }), console.warn("[" + l + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  u();
}
function at(u, l, v) {
  if (u) {
    const g = u.querySelector('[data-ln-template="' + l + '"]');
    if (g) return g.content.cloneNode(!0);
  }
  return yt(l, v);
}
function Ot(u, l) {
  const v = {}, g = u.querySelectorAll("[" + l + "]");
  for (let p = 0; p < g.length; p++)
    v[g[p].getAttribute(l)] = g[p].textContent, g[p].remove();
  return v;
}
function P(u, l, v, g) {
  if (u.nodeType !== 1) return;
  const p = Array.from(u.querySelectorAll("[" + l + "]"));
  u.hasAttribute && u.hasAttribute(l) && p.push(u);
  for (const b of p)
    b[v] || (b[v] = new g(b));
}
function ct(u) {
  return !!(u.offsetWidth || u.offsetHeight || u.getClientRects().length);
}
function St(u) {
  const l = {}, v = u.elements;
  for (let g = 0; g < v.length; g++) {
    const p = v[g];
    if (!(!p.name || p.disabled || p.type === "file" || p.type === "submit" || p.type === "button"))
      if (p.type === "checkbox")
        l[p.name] || (l[p.name] = []), p.checked && l[p.name].push(p.value);
      else if (p.type === "radio")
        p.checked && (l[p.name] = p.value);
      else if (p.type === "select-multiple") {
        l[p.name] = [];
        for (let b = 0; b < p.options.length; b++)
          p.options[b].selected && l[p.name].push(p.options[b].value);
      } else
        l[p.name] = p.value;
  }
  return l;
}
function Lt(u, l) {
  const v = u.elements, g = [];
  for (let p = 0; p < v.length; p++) {
    const b = v[p];
    if (!b.name || !(b.name in l) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
    const h = l[b.name];
    if (b.type === "checkbox")
      b.checked = Array.isArray(h) ? h.indexOf(b.value) !== -1 : !!h, g.push(b);
    else if (b.type === "radio")
      b.checked = b.value === String(h), g.push(b);
    else if (b.type === "select-multiple") {
      if (Array.isArray(h))
        for (let i = 0; i < b.options.length; i++)
          b.options[i].selected = h.indexOf(b.options[i].value) !== -1;
      g.push(b);
    } else
      b.value = h, g.push(b);
  }
  return g;
}
function $(u) {
  const l = u.closest("[lang]");
  return (l ? l.lang : null) || navigator.language;
}
function V(u, l, v, g) {
  function p(b) {
    P(b, u, l, v);
  }
  return H(function() {
    new MutationObserver(function(h) {
      for (let i = 0; i < h.length; i++) {
        const t = h[i];
        if (t.type === "childList")
          for (let n = 0; n < t.addedNodes.length; n++) {
            const e = t.addedNodes[n];
            e.nodeType === 1 && P(e, u, l, v);
          }
        else t.type === "attributes" && P(t.target, u, l, v);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [u]
    });
  }, g || u.replace("data-", "")), window[l] = p, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body), p;
}
const At = Symbol("deepReactive");
function xt(u, l) {
  function v(g) {
    if (g === null || typeof g != "object" || g[At]) return g;
    const p = Object.keys(g);
    for (let b = 0; b < p.length; b++) {
      const h = g[p[b]];
      h !== null && typeof h == "object" && (g[p[b]] = v(h));
    }
    return new Proxy(g, {
      get(b, h) {
        return h === At ? !0 : b[h];
      },
      set(b, h, i) {
        const t = b[h];
        return i !== null && typeof i == "object" && (i = v(i)), b[h] = i, t !== i && l(), !0;
      },
      deleteProperty(b, h) {
        return h in b && (delete b[h], l()), !0;
      }
    });
  }
  return v(u);
}
function It(u, l) {
  let v = !1;
  return function() {
    v || (v = !0, queueMicrotask(function() {
      v = !1, u(), l && l();
    }));
  };
}
const Rt = "ln:";
function Dt() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Tt(u, l) {
  const v = l.getAttribute("data-ln-persist"), g = v !== null && v !== "" ? v : l.id;
  return g ? Rt + u + ":" + Dt() + ":" + g : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', l), null);
}
function mt(u, l) {
  const v = Tt(u, l);
  if (!v) return null;
  try {
    const g = localStorage.getItem(v);
    return g !== null ? JSON.parse(g) : null;
  } catch {
    return null;
  }
}
function tt(u, l, v) {
  const g = Tt(u, l);
  if (g)
    try {
      localStorage.setItem(g, JSON.stringify(v));
    } catch {
    }
}
function Et(u, l, v, g) {
  const p = typeof g == "number" ? g : 4, b = window.innerWidth, h = window.innerHeight, i = l.width, t = l.height, n = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, e = n[v] || n.bottom;
  function o(a) {
    let m, d, _ = !0;
    return a === "top" ? (m = u.top - p - t, d = u.left + (u.width - i) / 2, m < 0 && (_ = !1)) : a === "bottom" ? (m = u.bottom + p, d = u.left + (u.width - i) / 2, m + t > h && (_ = !1)) : a === "left" ? (m = u.top + (u.height - t) / 2, d = u.left - p - i, d < 0 && (_ = !1)) : (m = u.top + (u.height - t) / 2, d = u.right + p, d + i > b && (_ = !1)), { top: m, left: d, side: a, fits: _ };
  }
  let r = null;
  for (let a = 0; a < e.length; a++) {
    const m = o(e[a]);
    if (m.fits) {
      r = m;
      break;
    }
  }
  r || (r = o(e[0]));
  let c = r.top, s = r.left;
  return i >= b ? s = 0 : (s < 0 && (s = 0), s + i > b && (s = b - i)), t >= h ? c = 0 : (c < 0 && (c = 0), c + t > h && (c = h - t)), { top: c, left: s, placement: r.side };
}
function Nt(u) {
  if (!u || u.parentNode === document.body)
    return function() {
    };
  const l = u.parentNode, v = document.createComment("ln-teleport");
  return l.insertBefore(v, u), document.body.appendChild(u), function() {
    v.parentNode && (v.parentNode.insertBefore(u, v), v.parentNode.removeChild(v));
  };
}
function wt(u) {
  if (!u) return { width: 0, height: 0 };
  const l = u.style, v = l.visibility, g = l.display, p = l.position;
  l.visibility = "hidden", l.display = "block", l.position = "fixed";
  const b = u.offsetWidth, h = u.offsetHeight;
  return l.visibility = v, l.display = g, l.position = p, { width: b, height: h };
}
(function() {
  const u = "lnHttp";
  if (window[u] !== void 0) return;
  const l = {};
  document.addEventListener("ln-http:request", function(v) {
    const g = v.detail || {};
    if (!g.url) return;
    const p = v.target, b = (g.method || (g.body ? "POST" : "GET")).toUpperCase(), h = g.abort, i = g.tag;
    let t = g.url;
    h && (l[h] && l[h].abort(), l[h] = new AbortController());
    const n = { Accept: "application/json" };
    g.ajax && (n["X-Requested-With"] = "XMLHttpRequest");
    const e = {
      method: b,
      credentials: "same-origin",
      headers: n
    };
    if (h && (e.signal = l[h].signal), g.body && b === "GET") {
      const o = new URLSearchParams();
      for (const c in g.body)
        g.body[c] != null && o.set(c, g.body[c]);
      const r = o.toString();
      r && (t += (t.includes("?") ? "&" : "?") + r);
    } else g.body && (n["Content-Type"] = "application/json", e.body = JSON.stringify(g.body));
    fetch(t, e).then(function(o) {
      h && delete l[h];
      const r = o.ok, c = o.status;
      return o.json().then(function(s) {
        return { ok: r, status: c, data: s };
      }).catch(function() {
        return { ok: !1, status: c, data: { error: !0, message: "Invalid response" } };
      });
    }).then(function(o) {
      o.tag = i;
      const r = o.ok ? "ln-http:success" : "ln-http:error";
      T(p, r, o);
    }).catch(function(o) {
      h && o.name !== "AbortError" && delete l[h], o.name !== "AbortError" && T(p, "ln-http:error", { tag: i, ok: !1, status: 0, data: { error: !0, message: "Network error" } });
    });
  }), window[u] = !0;
})();
(function() {
  const u = "data-ln-ajax", l = "lnAjax";
  if (window[l] !== void 0) return;
  function v(e) {
    if (!e.hasAttribute(u) || e[l]) return;
    e[l] = !0;
    const o = i(e);
    g(o.links), p(o.forms);
  }
  function g(e) {
    for (const o of e) {
      if (o[l + "Trigger"] || o.hostname && o.hostname !== window.location.hostname) continue;
      const r = o.getAttribute("href");
      if (r && r.includes("#")) continue;
      const c = function(s) {
        if (s.ctrlKey || s.metaKey || s.button === 1) return;
        s.preventDefault();
        const a = o.getAttribute("href");
        a && h("GET", a, null, o);
      };
      o.addEventListener("click", c), o[l + "Trigger"] = c;
    }
  }
  function p(e) {
    for (const o of e) {
      if (o[l + "Trigger"]) continue;
      const r = function(c) {
        c.preventDefault();
        const s = o.method.toUpperCase(), a = o.action, m = new FormData(o);
        for (const d of o.querySelectorAll('button, input[type="submit"]'))
          d.disabled = !0;
        h(s, a, m, o, function() {
          for (const d of o.querySelectorAll('button, input[type="submit"]'))
            d.disabled = !1;
        });
      };
      o.addEventListener("submit", r), o[l + "Trigger"] = r;
    }
  }
  function b(e) {
    if (!e[l]) return;
    const o = i(e);
    for (const r of o.links)
      r[l + "Trigger"] && (r.removeEventListener("click", r[l + "Trigger"]), delete r[l + "Trigger"]);
    for (const r of o.forms)
      r[l + "Trigger"] && (r.removeEventListener("submit", r[l + "Trigger"]), delete r[l + "Trigger"]);
    delete e[l];
  }
  function h(e, o, r, c, s) {
    if (K(c, "ln-ajax:before-start", { method: e, url: o }).defaultPrevented) return;
    T(c, "ln-ajax:start", { method: e, url: o }), c.classList.add("ln-ajax--loading");
    const m = document.createElement("span");
    m.className = "ln-ajax-spinner", c.appendChild(m);
    function d() {
      c.classList.remove("ln-ajax--loading");
      const A = c.querySelector(".ln-ajax-spinner");
      A && A.remove(), s && s();
    }
    let _ = o;
    const E = document.querySelector('meta[name="csrf-token"]'), y = E ? E.getAttribute("content") : null;
    r instanceof FormData && y && r.append("_token", y);
    const w = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (y && (w.headers["X-CSRF-TOKEN"] = y), e === "GET" && r) {
      const A = new URLSearchParams(r);
      _ = o + (o.includes("?") ? "&" : "?") + A.toString();
    } else e !== "GET" && r && (w.body = r);
    fetch(_, w).then(function(A) {
      const C = A.ok;
      return A.json().then(function(k) {
        return { ok: C, status: A.status, data: k };
      });
    }).then(function(A) {
      const C = A.data;
      if (A.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const k in C.content) {
            const D = document.getElementById(k);
            D && (D.innerHTML = C.content[k]);
          }
        if (c.tagName === "A") {
          const k = c.getAttribute("href");
          k && window.history.pushState({ ajax: !0 }, "", k);
        } else c.tagName === "FORM" && c.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
        T(c, "ln-ajax:success", { method: e, url: _, data: C });
      } else
        T(c, "ln-ajax:error", { method: e, url: _, status: A.status, data: C });
      if (C.message && window.lnToast) {
        const k = C.message;
        window.lnToast.enqueue({
          type: k.type || (A.ok ? "success" : "error"),
          title: k.title || "",
          message: k.body || ""
        });
      }
      T(c, "ln-ajax:complete", { method: e, url: _ }), d();
    }).catch(function(A) {
      T(c, "ln-ajax:error", { method: e, url: _, error: A }), T(c, "ln-ajax:complete", { method: e, url: _ }), d();
    });
  }
  function i(e) {
    const o = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(u) !== "false" ? o.links.push(e) : e.tagName === "FORM" && e.getAttribute(u) !== "false" ? o.forms.push(e) : (o.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), o.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), o;
  }
  function t() {
    H(function() {
      new MutationObserver(function(o) {
        for (const r of o)
          if (r.type === "childList") {
            for (const c of r.addedNodes)
              if (c.nodeType === 1 && (v(c), !c.hasAttribute(u))) {
                for (const a of c.querySelectorAll("[" + u + "]"))
                  v(a);
                const s = c.closest && c.closest("[" + u + "]");
                if (s && s.getAttribute(u) !== "false") {
                  const a = i(c);
                  g(a.links), p(a.forms);
                }
              }
          } else r.type === "attributes" && v(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-ajax");
  }
  function n() {
    for (const e of document.querySelectorAll("[" + u + "]"))
      v(e);
  }
  window[l] = v, window[l].destroy = b, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const u = "data-ln-modal", l = "lnModal";
  if (window[l] !== void 0) return;
  function v(n) {
    g(n), p(n);
  }
  function g(n) {
    const e = Array.from(n.querySelectorAll("[" + u + "]"));
    n.hasAttribute && n.hasAttribute(u) && e.push(n);
    for (const o of e)
      o[l] || (o[l] = new b(o));
  }
  function p(n) {
    const e = Array.from(n.querySelectorAll("[data-ln-modal-for]"));
    n.hasAttribute && n.hasAttribute("data-ln-modal-for") && e.push(n);
    for (const o of e) {
      if (o[l + "Trigger"]) continue;
      const r = function(c) {
        if (c.ctrlKey || c.metaKey || c.button === 1) return;
        c.preventDefault();
        const s = o.getAttribute("data-ln-modal-for"), a = document.getElementById(s);
        !a || !a[l] || a[l].toggle();
      };
      o.addEventListener("click", r), o[l + "Trigger"] = r;
    }
  }
  function b(n) {
    this.dom = n, this.isOpen = n.getAttribute(u) === "open";
    const e = this;
    return this._onEscape = function(o) {
      o.key === "Escape" && e.close();
    }, this._onFocusTrap = function(o) {
      if (o.key !== "Tab") return;
      const r = Array.prototype.filter.call(
        e.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        ct
      );
      if (r.length === 0) return;
      const c = r[0], s = r[r.length - 1];
      o.shiftKey ? document.activeElement === c && (o.preventDefault(), s.focus()) : document.activeElement === s && (o.preventDefault(), c.focus());
    }, this._onClose = function(o) {
      o.preventDefault(), e.close();
    }, i(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  b.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(u, "open");
  }, b.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "close");
  }, b.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, b.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const n = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const o of n)
      o[l + "Close"] && (o.removeEventListener("click", o[l + "Close"]), delete o[l + "Close"]);
    const e = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const o of e)
      o[l + "Trigger"] && (o.removeEventListener("click", o[l + "Trigger"]), delete o[l + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[l];
  };
  function h(n) {
    const e = n[l];
    if (!e) return;
    const r = n.getAttribute(u) === "open";
    if (r !== e.isOpen)
      if (r) {
        if (K(n, "ln-modal:before-open", { modalId: n.id, target: n }).defaultPrevented) {
          n.setAttribute(u, "close");
          return;
        }
        e.isOpen = !0, n.setAttribute("aria-modal", "true"), n.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", e._onEscape), document.addEventListener("keydown", e._onFocusTrap);
        const s = n.querySelector("[autofocus]");
        if (s && ct(s))
          s.focus();
        else {
          const a = n.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), m = Array.prototype.find.call(a, ct);
          if (m) m.focus();
          else {
            const d = n.querySelectorAll("a[href], button:not([disabled])"), _ = Array.prototype.find.call(d, ct);
            _ && _.focus();
          }
        }
        T(n, "ln-modal:open", { modalId: n.id, target: n });
      } else {
        if (K(n, "ln-modal:before-close", { modalId: n.id, target: n }).defaultPrevented) {
          n.setAttribute(u, "open");
          return;
        }
        e.isOpen = !1, n.removeAttribute("aria-modal"), document.removeEventListener("keydown", e._onEscape), document.removeEventListener("keydown", e._onFocusTrap), T(n, "ln-modal:close", { modalId: n.id, target: n }), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function i(n) {
    const e = n.dom.querySelectorAll("[data-ln-modal-close]");
    for (const o of e)
      o[l + "Close"] || (o.addEventListener("click", n._onClose), o[l + "Close"] = n._onClose);
  }
  function t() {
    H(function() {
      new MutationObserver(function(e) {
        for (let o = 0; o < e.length; o++) {
          const r = e[o];
          if (r.type === "childList")
            for (let c = 0; c < r.addedNodes.length; c++) {
              const s = r.addedNodes[c];
              s.nodeType === 1 && (g(s), p(s));
            }
          else r.type === "attributes" && (r.attributeName === u && r.target[l] ? h(r.target) : (g(r.target), p(r.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "data-ln-modal-for"]
      });
    }, "ln-modal");
  }
  window[l] = v, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-number", l = "lnNumber";
  if (window[l] !== void 0) return;
  const v = {}, g = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(t) {
    if (!v[t]) {
      const n = new Intl.NumberFormat(t, { useGrouping: !0 }), e = n.formatToParts(1234.5);
      let o = "", r = ".";
      for (let c = 0; c < e.length; c++)
        e[c].type === "group" && (o = e[c].value), e[c].type === "decimal" && (r = e[c].value);
      v[t] = { fmt: n, groupSep: o, decimalSep: r };
    }
    return v[t];
  }
  function b(t, n, e) {
    if (e !== null) {
      const o = parseInt(e, 10), r = t + "|d" + o;
      return v[r] || (v[r] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: o })), v[r].format(n);
    }
    return p(t).fmt.format(n);
  }
  function h(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    this.dom = t;
    const n = document.createElement("input");
    n.type = "hidden", n.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", n), this._hidden = n;
    const e = this;
    Object.defineProperty(n, "value", {
      get: function() {
        return g.get.call(n);
      },
      set: function(r) {
        g.set.call(n, r), r !== "" && !isNaN(parseFloat(r)) ? e._displayFormatted(parseFloat(r)) : r === "" && (e.dom.value = "");
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(r) {
      r.preventDefault();
      const c = (r.clipboardData || window.clipboardData).getData("text"), s = p($(t)), a = s.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let m = c.replace(new RegExp("[^0-9\\-" + a + ".]", "g"), "");
      s.groupSep && (m = m.split(s.groupSep).join("")), s.decimalSep !== "." && (m = m.replace(s.decimalSep, "."));
      const d = parseFloat(m);
      isNaN(d) ? (t.value = "", e._hidden.value = "") : e.value = d;
    }, t.addEventListener("paste", this._onPaste);
    const o = t.value;
    if (o !== "") {
      const r = parseFloat(o);
      isNaN(r) || (this._displayFormatted(r), g.set.call(n, String(r)));
    }
    return this;
  }
  h.prototype._handleInput = function() {
    const t = this.dom, n = p($(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", T(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const o = t.selectionStart;
    let r = 0;
    for (let A = 0; A < o; A++)
      /[0-9]/.test(e[A]) && r++;
    let c = e;
    if (n.groupSep && (c = c.split(n.groupSep).join("")), c = c.replace(n.decimalSep, "."), e.endsWith(n.decimalSep) || e.endsWith(".")) {
      const A = c.replace(/\.$/, ""), C = parseFloat(A);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const s = c.indexOf(".");
    if (s !== -1 && c.slice(s + 1).endsWith("0")) {
      const C = parseFloat(c);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const a = t.getAttribute("data-ln-number-decimals");
    if (a !== null && s !== -1) {
      const A = parseInt(a, 10);
      c.slice(s + 1).length > A && (c = c.slice(0, s + 1 + A));
    }
    const m = parseFloat(c);
    if (isNaN(m)) return;
    const d = t.getAttribute("data-ln-number-min"), _ = t.getAttribute("data-ln-number-max");
    if (d !== null && m < parseFloat(d) || _ !== null && m > parseFloat(_)) return;
    let E;
    if (a !== null)
      E = b($(t), m, a);
    else {
      const A = s !== -1 ? c.slice(s + 1).length : 0;
      if (A > 0) {
        const C = $(t) + "|u" + A;
        v[C] || (v[C] = new Intl.NumberFormat($(t), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), E = v[C].format(m);
      } else
        E = n.fmt.format(m);
    }
    t.value = E;
    let y = r, w = 0;
    for (let A = 0; A < E.length && y > 0; A++)
      w = A + 1, /[0-9]/.test(E[A]) && y--;
    y > 0 && (w = E.length), t.setSelectionRange(w, w), this._setHiddenRaw(m), T(t, "ln-number:input", { value: m, formatted: E });
  }, h.prototype._setHiddenRaw = function(t) {
    g.set.call(this._hidden, String(t));
  }, h.prototype._displayFormatted = function(t) {
    this.dom.value = b($(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(h.prototype, "value", {
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
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), h.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function i() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + u + "]");
      for (let n = 0; n < t.length; n++) {
        const e = t[n][l];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  V(u, l, h, "ln-number"), i();
})();
(function() {
  const u = "data-ln-date", l = "lnDate";
  if (window[l] !== void 0) return;
  const v = {}, g = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(s, a) {
    const m = s + "|" + JSON.stringify(a);
    return v[m] || (v[m] = new Intl.DateTimeFormat(s, a)), v[m];
  }
  const b = /^(short|medium|long)(\s+datetime)?$/, h = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function i(s) {
    return !s || s === "" ? { dateStyle: "medium" } : s.match(b) ? h[s] : null;
  }
  function t(s, a, m) {
    const d = s.getDate(), _ = s.getMonth(), E = s.getFullYear(), y = s.getHours(), w = s.getMinutes(), A = {
      yyyy: String(E),
      yy: String(E).slice(-2),
      MMMM: p(m, { month: "long" }).format(s),
      MMM: p(m, { month: "short" }).format(s),
      MM: String(_ + 1).padStart(2, "0"),
      M: String(_ + 1),
      dd: String(d).padStart(2, "0"),
      d: String(d),
      HH: String(y).padStart(2, "0"),
      mm: String(w).padStart(2, "0")
    };
    return a.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(C) {
      return A[C];
    });
  }
  function n(s, a, m) {
    const d = i(a);
    return d ? p(m, d).format(s) : t(s, a, m);
  }
  function e(s) {
    if (s.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", s.tagName), this;
    this.dom = s;
    const a = this, m = s.value, d = s.name, _ = document.createElement("input");
    _.type = "hidden", _.name = d, s.removeAttribute("name"), s.insertAdjacentElement("afterend", _), this._hidden = _;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", _.insertAdjacentElement("afterend", E), this._picker = E, s.type = "text";
    const y = document.createElement("button");
    if (y.type = "button", y.setAttribute("aria-label", "Open date picker"), y.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', E.insertAdjacentElement("afterend", y), this._btn = y, this._lastISO = "", Object.defineProperty(_, "value", {
      get: function() {
        return g.get.call(_);
      },
      set: function(w) {
        if (g.set.call(_, w), w && w !== "") {
          const A = o(w);
          A && (a._displayFormatted(A), g.set.call(E, w));
        } else w === "" && (a.dom.value = "", g.set.call(E, ""));
      }
    }), this._onPickerChange = function() {
      const w = E.value;
      if (w) {
        const A = o(w);
        A && (a._setHiddenRaw(w), a._displayFormatted(A), a._lastISO = w, T(a.dom, "ln-date:change", {
          value: w,
          formatted: a.dom.value,
          date: A
        }));
      } else
        a._setHiddenRaw(""), a.dom.value = "", a._lastISO = "", T(a.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const w = a.dom.value.trim();
      if (w === "") {
        a._lastISO !== "" && (a._setHiddenRaw(""), g.set.call(a._picker, ""), a.dom.value = "", a._lastISO = "", T(a.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (a._lastISO) {
        const C = o(a._lastISO);
        if (C) {
          const k = a.dom.getAttribute(u) || "", D = $(a.dom), M = n(C, k, D);
          if (w === M) return;
        }
      }
      const A = r(w);
      if (A) {
        const C = A.getFullYear(), k = String(A.getMonth() + 1).padStart(2, "0"), D = String(A.getDate()).padStart(2, "0"), M = C + "-" + k + "-" + D;
        a._setHiddenRaw(M), g.set.call(a._picker, M), a._displayFormatted(A), a._lastISO = M, T(a.dom, "ln-date:change", {
          value: M,
          formatted: a.dom.value,
          date: A
        });
      } else if (a._lastISO) {
        const C = o(a._lastISO);
        C && a._displayFormatted(C);
      } else
        a.dom.value = "";
    }, s.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      a._openPicker();
    }, y.addEventListener("click", this._onBtnClick), m && m !== "") {
      const w = o(m);
      w && (this._setHiddenRaw(m), g.set.call(E, m), this._displayFormatted(w), this._lastISO = m);
    }
    return this;
  }
  function o(s) {
    if (!s || typeof s != "string") return null;
    const a = s.split("T"), m = a[0].split("-");
    if (m.length < 3) return null;
    const d = parseInt(m[0], 10), _ = parseInt(m[1], 10) - 1, E = parseInt(m[2], 10);
    if (isNaN(d) || isNaN(_) || isNaN(E)) return null;
    let y = 0, w = 0;
    if (a[1]) {
      const C = a[1].split(":");
      y = parseInt(C[0], 10) || 0, w = parseInt(C[1], 10) || 0;
    }
    const A = new Date(d, _, E, y, w);
    return A.getFullYear() !== d || A.getMonth() !== _ || A.getDate() !== E ? null : A;
  }
  function r(s) {
    if (!s || typeof s != "string" || (s = s.trim(), s.length < 6)) return null;
    let a, m;
    if (s.indexOf(".") !== -1)
      a = ".", m = s.split(".");
    else if (s.indexOf("/") !== -1)
      a = "/", m = s.split("/");
    else if (s.indexOf("-") !== -1)
      a = "-", m = s.split("-");
    else
      return null;
    if (m.length !== 3) return null;
    const d = [];
    for (let A = 0; A < 3; A++) {
      const C = parseInt(m[A], 10);
      if (isNaN(C)) return null;
      d.push(C);
    }
    let _, E, y;
    a === "." ? (_ = d[0], E = d[1], y = d[2]) : a === "/" ? (E = d[0], _ = d[1], y = d[2]) : m[0].length === 4 ? (y = d[0], E = d[1], _ = d[2]) : (_ = d[0], E = d[1], y = d[2]), y < 100 && (y += y < 50 ? 2e3 : 1900);
    const w = new Date(y, E - 1, _);
    return w.getFullYear() !== y || w.getMonth() !== E - 1 || w.getDate() !== _ ? null : w;
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
    g.set.call(this._hidden, s);
  }, e.prototype._displayFormatted = function(s) {
    const a = this.dom.getAttribute(u) || "", m = $(this.dom);
    this.dom.value = n(s, a, m);
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return g.get.call(this._hidden);
    },
    set: function(s) {
      if (!s || s === "") {
        this._setHiddenRaw(""), g.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const a = o(s);
      a && (this._setHiddenRaw(s), g.set.call(this._picker, s), this._displayFormatted(a), this._lastISO = s, T(this.dom, "ln-date:change", {
        value: s,
        formatted: this.dom.value,
        date: a
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
      const a = s.getFullYear(), m = String(s.getMonth() + 1).padStart(2, "0"), d = String(s.getDate()).padStart(2, "0");
      this.value = a + "-" + m + "-" + d;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const s = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), s && (this.dom.value = s), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[l];
  };
  function c() {
    new MutationObserver(function() {
      const s = document.querySelectorAll("[" + u + "]");
      for (let a = 0; a < s.length; a++) {
        const m = s[a][l];
        if (m && m.value) {
          const d = o(m.value);
          d && m._displayFormatted(d);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  V(u, l, e, "ln-date"), c();
})();
(function() {
  const u = "data-ln-nav", l = "lnNav";
  if (window[l] !== void 0) return;
  const v = /* @__PURE__ */ new WeakMap(), g = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const o of g)
        o();
    }, history._lnNavPatched = !0;
  }
  function p(e) {
    if (!e.hasAttribute(u) || v.has(e)) return;
    const o = e.getAttribute(u);
    if (!o) return;
    const r = b(e, o);
    v.set(e, r), e[l] = r;
  }
  function b(e, o) {
    let r = Array.from(e.querySelectorAll("a"));
    i(r, o, window.location.pathname);
    const c = function() {
      r = Array.from(e.querySelectorAll("a")), i(r, o, window.location.pathname);
    };
    window.addEventListener("popstate", c), g.push(c);
    const s = new MutationObserver(function(a) {
      for (const m of a)
        if (m.type === "childList") {
          for (const d of m.addedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                r.push(d), i([d], o, window.location.pathname);
              else if (d.querySelectorAll) {
                const _ = Array.from(d.querySelectorAll("a"));
                r = r.concat(_), i(_, o, window.location.pathname);
              }
            }
          for (const d of m.removedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                r = r.filter(function(_) {
                  return _ !== d;
                });
              else if (d.querySelectorAll) {
                const _ = Array.from(d.querySelectorAll("a"));
                r = r.filter(function(E) {
                  return !_.includes(E);
                });
              }
            }
        }
    });
    return s.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: o,
      observer: s,
      updateHandler: c,
      destroy: function() {
        s.disconnect(), window.removeEventListener("popstate", c);
        const a = g.indexOf(c);
        a !== -1 && g.splice(a, 1), v.delete(e), delete e[l];
      }
    };
  }
  function h(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function i(e, o, r) {
    const c = h(r);
    for (const s of e) {
      const a = s.getAttribute("href");
      if (!a) continue;
      const m = h(a);
      s.classList.remove(o);
      const d = m === c, _ = m !== "/" && c.startsWith(m + "/");
      (d || _) && s.classList.add(o);
    }
  }
  function t() {
    H(function() {
      new MutationObserver(function(o) {
        for (const r of o)
          if (r.type === "childList") {
            for (const c of r.addedNodes)
              if (c.nodeType === 1 && (c.hasAttribute && c.hasAttribute(u) && p(c), c.querySelectorAll))
                for (const s of c.querySelectorAll("[" + u + "]"))
                  p(s);
          } else r.type === "attributes" && r.target.hasAttribute && r.target.hasAttribute(u) && p(r.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-nav");
  }
  window[l] = p;
  function n() {
    for (const e of document.querySelectorAll("[" + u + "]"))
      p(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const u = window.TomSelect;
  if (!u) {
    console.warn("[ln-select] TomSelect not found. Load TomSelect before ln-acme."), window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const l = /* @__PURE__ */ new WeakMap();
  function v(h) {
    if (l.has(h)) return;
    const i = h.getAttribute("data-ln-select");
    let t = {};
    if (i && i.trim() !== "")
      try {
        t = JSON.parse(i);
      } catch (o) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", o);
      }
    const e = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: h.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...t };
    try {
      const o = new u(h, e);
      l.set(h, o);
      const r = h.closest("form");
      if (r) {
        const c = () => {
          setTimeout(() => {
            o.clear(), o.clearOptions(), o.sync();
          }, 0);
        };
        r.addEventListener("reset", c), o._lnResetHandler = c, o._lnResetForm = r;
      }
    } catch (o) {
      console.warn("[ln-select] Failed to initialize Tom Select:", o);
    }
  }
  function g(h) {
    const i = l.get(h);
    i && (i._lnResetForm && i._lnResetHandler && i._lnResetForm.removeEventListener("reset", i._lnResetHandler), i.destroy(), l.delete(h));
  }
  function p() {
    for (const h of document.querySelectorAll("select[data-ln-select]"))
      v(h);
  }
  function b() {
    H(function() {
      new MutationObserver(function(i) {
        for (const t of i) {
          if (t.type === "attributes") {
            t.target.matches && t.target.matches("select[data-ln-select]") && v(t.target);
            continue;
          }
          for (const n of t.addedNodes)
            if (n.nodeType === 1 && (n.matches && n.matches("select[data-ln-select]") && v(n), n.querySelectorAll))
              for (const e of n.querySelectorAll("select[data-ln-select]"))
                v(e);
          for (const n of t.removedNodes)
            if (n.nodeType === 1 && (n.matches && n.matches("select[data-ln-select]") && g(n), n.querySelectorAll))
              for (const e of n.querySelectorAll("select[data-ln-select]"))
                g(e);
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
    p(), b();
  }) : (p(), b()), window.lnSelect = {
    initialize: v,
    destroy: g,
    getInstance: function(h) {
      return l.get(h);
    }
  };
})();
(function() {
  const u = "data-ln-tabs", l = "lnTabs";
  if (window[l] !== void 0 && window[l] !== null) return;
  function v(i = document.body) {
    P(i, u, l, p);
  }
  function g() {
    const i = (location.hash || "").replace("#", ""), t = {};
    if (!i) return t;
    for (const n of i.split("&")) {
      const e = n.indexOf(":");
      e > 0 && (t[n.slice(0, e)] = n.slice(e + 1));
    }
    return t;
  }
  function p(i) {
    return this.dom = i, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const t of this.tabs) {
      const n = (t.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      n && (this.mapTabs[n] = t);
    }
    for (const t of this.panels) {
      const n = (t.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      n && (this.mapPanels[n] = t);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const i = this;
    this._clickHandlers = [];
    for (const t of this.tabs) {
      if (t[l + "Trigger"]) continue;
      const n = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        const o = (t.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (o)
          if (i.hashEnabled) {
            const r = g();
            r[i.nsKey] = o;
            const c = Object.keys(r).map(function(s) {
              return s + ":" + r[s];
            }).join("&");
            location.hash === "#" + c ? i.dom.setAttribute("data-ln-tabs-active", o) : location.hash = c;
          } else
            i.dom.setAttribute("data-ln-tabs-active", o);
      };
      t.addEventListener("click", n), t[l + "Trigger"] = n, i._clickHandlers.push({ el: t, handler: n });
    }
    if (this._hashHandler = function() {
      if (!i.hashEnabled) return;
      const t = g();
      i.activate(i.nsKey in t ? t[i.nsKey] : i.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let t = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const n = mt("tabs", this.dom);
        n !== null && n in this.mapPanels && (t = n);
      }
      this.activate(t);
    }
  }
  p.prototype.activate = function(i) {
    (!i || !(i in this.mapPanels)) && (i = this.defaultKey), this.dom.setAttribute("data-ln-tabs-active", i);
  }, p.prototype._applyActive = function(i) {
    var t;
    (!i || !(i in this.mapPanels)) && (i = this.defaultKey);
    for (const n in this.mapTabs) {
      const e = this.mapTabs[n];
      n === i ? (e.setAttribute("data-active", ""), e.setAttribute("aria-selected", "true")) : (e.removeAttribute("data-active"), e.setAttribute("aria-selected", "false"));
    }
    for (const n in this.mapPanels) {
      const e = this.mapPanels[n], o = n === i;
      e.classList.toggle("hidden", !o), e.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const n = (t = this.mapPanels[i]) == null ? void 0 : t.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      n && setTimeout(() => n.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: i, tab: this.mapTabs[i], panel: this.mapPanels[i] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && tt("tabs", this.dom, i);
  }, p.prototype.destroy = function() {
    if (this.dom[l]) {
      for (const { el: i, handler: t } of this._clickHandlers)
        i.removeEventListener("click", t), delete i[l + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[l];
    }
  };
  function h() {
    H(function() {
      new MutationObserver(function(t) {
        for (const n of t) {
          if (n.type === "attributes") {
            if (n.attributeName === "data-ln-tabs-active" && n.target[l]) {
              const e = n.target.getAttribute("data-ln-tabs-active");
              n.target[l]._applyActive(e);
              continue;
            }
            P(n.target, u, l, p);
            continue;
          }
          for (const e of n.addedNodes)
            P(e, u, l, p);
        }
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u, "data-ln-tabs-active"] });
    }, "ln-tabs");
  }
  h(), window[l] = v, v(document.body);
})();
(function() {
  const u = "data-ln-toggle", l = "lnToggle";
  if (window[l] !== void 0) return;
  function v(t) {
    P(t, u, l, b), g(t);
  }
  function g(t) {
    const n = Array.from(t.querySelectorAll("[data-ln-toggle-for]"));
    t.hasAttribute && t.hasAttribute("data-ln-toggle-for") && n.push(t);
    for (const e of n) {
      if (e[l + "Trigger"]) continue;
      const o = function(s) {
        if (s.ctrlKey || s.metaKey || s.button === 1) return;
        s.preventDefault();
        const a = e.getAttribute("data-ln-toggle-for"), m = document.getElementById(a);
        if (!m || !m[l]) return;
        const d = e.getAttribute("data-ln-toggle-action") || "toggle";
        m[l][d]();
      };
      e.addEventListener("click", o), e[l + "Trigger"] = o;
      const r = e.getAttribute("data-ln-toggle-for"), c = document.getElementById(r);
      c && c[l] && e.setAttribute("aria-expanded", c[l].isOpen ? "true" : "false");
    }
  }
  function p(t, n) {
    const e = document.querySelectorAll(
      '[data-ln-toggle-for="' + t.id + '"]'
    );
    for (const o of e)
      o.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function b(t) {
    if (this.dom = t, t.hasAttribute("data-ln-persist")) {
      const n = mt("toggle", t);
      n !== null && t.setAttribute(u, n);
    }
    return this.isOpen = t.getAttribute(u) === "open", this.isOpen && t.classList.add("open"), p(t, this.isOpen), this;
  }
  b.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(u, "open");
  }, b.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "close");
  }, b.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, b.prototype.destroy = function() {
    if (!this.dom[l]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const t = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const n of t)
      n[l + "Trigger"] && (n.removeEventListener("click", n[l + "Trigger"]), delete n[l + "Trigger"]);
    delete this.dom[l];
  };
  function h(t) {
    const n = t[l];
    if (!n) return;
    const o = t.getAttribute(u) === "open";
    if (o !== n.isOpen)
      if (o) {
        if (K(t, "ln-toggle:before-open", { target: t }).defaultPrevented) {
          t.setAttribute(u, "close");
          return;
        }
        n.isOpen = !0, t.classList.add("open"), p(t, !0), T(t, "ln-toggle:open", { target: t }), t.hasAttribute("data-ln-persist") && tt("toggle", t, "open");
      } else {
        if (K(t, "ln-toggle:before-close", { target: t }).defaultPrevented) {
          t.setAttribute(u, "open");
          return;
        }
        n.isOpen = !1, t.classList.remove("open"), p(t, !1), T(t, "ln-toggle:close", { target: t }), t.hasAttribute("data-ln-persist") && tt("toggle", t, "close");
      }
  }
  function i() {
    H(function() {
      new MutationObserver(function(n) {
        for (let e = 0; e < n.length; e++) {
          const o = n[e];
          if (o.type === "childList")
            for (let r = 0; r < o.addedNodes.length; r++) {
              const c = o.addedNodes[r];
              c.nodeType === 1 && (P(c, u, l, b), g(c));
            }
          else o.type === "attributes" && (o.attributeName === u && o.target[l] ? h(o.target) : (P(o.target, u, l, b), g(o.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "data-ln-toggle-for"]
      });
    }, "ln-toggle");
  }
  window[l] = v, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-accordion", l = "lnAccordion";
  if (window[l] !== void 0) return;
  function v(g) {
    return this.dom = g, this._onToggleOpen = function(p) {
      const b = g.querySelectorAll("[data-ln-toggle]");
      for (const h of b)
        h !== p.detail.target && h.getAttribute("data-ln-toggle") === "open" && h.setAttribute("data-ln-toggle", "close");
      T(g, "ln-accordion:change", { target: p.detail.target });
    }, g.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[l]);
  }, V(u, l, v, "ln-accordion");
})();
(function() {
  const u = "data-ln-dropdown", l = "lnDropdown";
  if (window[l] !== void 0) return;
  function v(g) {
    if (this.dom = g, this.toggleEl = g.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = g.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const b of this.toggleEl.children)
        b.setAttribute("role", "menuitem");
    const p = this;
    return this._onToggleOpen = function(b) {
      b.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "true"), p._teleportToBody(), p._addOutsideClickListener(), p._addScrollRepositionListener(), p._addResizeCloseListener(), T(g, "ln-dropdown:open", { target: b.detail.target }));
    }, this._onToggleClose = function(b) {
      b.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "false"), p._removeOutsideClickListener(), p._removeScrollRepositionListener(), p._removeResizeCloseListener(), p._teleportBack(), T(g, "ln-dropdown:close", { target: b.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  v.prototype._positionMenu = function() {
    const g = this.dom.querySelector("[data-ln-toggle-for]");
    if (!g || !this.toggleEl) return;
    const p = g.getBoundingClientRect(), b = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    b && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const h = this.toggleEl.offsetWidth, i = this.toggleEl.offsetHeight;
    b && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const t = window.innerWidth, n = window.innerHeight, e = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4;
    let o;
    p.bottom + e + i <= n ? o = p.bottom + e : p.top - e - i >= 0 ? o = p.top - e - i : o = Math.max(0, n - i);
    let r;
    p.right - h >= 0 ? r = p.right - h : p.left + h <= t ? r = p.left : r = Math.max(0, t - h), this.toggleEl.style.top = o + "px", this.toggleEl.style.left = r + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, v.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, v.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, v.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const g = this;
    this._boundDocClick = function(p) {
      g.dom.contains(p.target) || g.toggleEl && g.toggleEl.contains(p.target) || g.toggleEl && g.toggleEl.getAttribute("data-ln-toggle") === "open" && g.toggleEl.setAttribute("data-ln-toggle", "close");
    }, g._docClickTimeout = setTimeout(function() {
      g._docClickTimeout = null, document.addEventListener("click", g._boundDocClick);
    }, 0);
  }, v.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, v.prototype._addScrollRepositionListener = function() {
    const g = this;
    this._boundScrollReposition = function() {
      g._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, v.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, v.prototype._addResizeCloseListener = function() {
    const g = this;
    this._boundResizeClose = function() {
      g.toggleEl && g.toggleEl.getAttribute("data-ln-toggle") === "open" && g.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, v.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, v.prototype.destroy = function() {
    this.dom[l] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[l]);
  }, V(u, l, v, "ln-dropdown");
})();
(function() {
  const u = "data-ln-popover", l = "lnPopover", v = "data-ln-popover-for", g = "data-ln-popover-position";
  if (window[l] !== void 0) return;
  const p = [];
  let b = null;
  function h() {
    b || (b = function(s) {
      if (s.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", b));
  }
  function i() {
    p.length > 0 || b && (document.removeEventListener("keydown", b), b = null);
  }
  function t(s) {
    n(s), e(s);
  }
  function n(s) {
    if (!s || s.nodeType !== 1) return;
    const a = Array.from(s.querySelectorAll("[" + u + "]"));
    s.hasAttribute && s.hasAttribute(u) && a.push(s);
    for (const m of a)
      m[l] || (m[l] = new o(m));
  }
  function e(s) {
    if (!s || s.nodeType !== 1) return;
    const a = Array.from(s.querySelectorAll("[" + v + "]"));
    s.hasAttribute && s.hasAttribute(v) && a.push(s);
    for (const m of a) {
      if (m[l + "Trigger"]) continue;
      const d = m.getAttribute(v);
      m.setAttribute("aria-haspopup", "dialog"), m.setAttribute("aria-expanded", "false"), m.setAttribute("aria-controls", d);
      const _ = function(E) {
        if (E.ctrlKey || E.metaKey || E.button === 1) return;
        E.preventDefault();
        const y = document.getElementById(d);
        !y || !y[l] || y[l].toggle(m);
      };
      m.addEventListener("click", _), m[l + "Trigger"] = _;
    }
  }
  function o(s) {
    return this.dom = s, this.isOpen = s.getAttribute(u) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, s.hasAttribute("tabindex") || s.setAttribute("tabindex", "-1"), s.hasAttribute("role") || s.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  o.prototype.open = function(s) {
    this.isOpen || (this.trigger = s || null, this.dom.setAttribute(u, "open"));
  }, o.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "closed");
  }, o.prototype.toggle = function(s) {
    this.isOpen ? this.close() : this.open(s);
  }, o.prototype._applyOpen = function(s) {
    this.isOpen = !0, s && (this.trigger = s), this._previousFocus = document.activeElement, this._teleportRestore = Nt(this.dom);
    const a = wt(this.dom);
    if (this.trigger) {
      const E = this.trigger.getBoundingClientRect(), y = this.dom.getAttribute(g) || "bottom", w = Et(E, a, y, 8);
      this.dom.style.top = w.top + "px", this.dom.style.left = w.left + "px", this.dom.setAttribute("data-ln-popover-placement", w.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const m = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), d = Array.prototype.find.call(m, ct);
    d ? d.focus() : this.dom.focus();
    const _ = this;
    this._boundDocClick = function(E) {
      _.dom.contains(E.target) || _.trigger && _.trigger.contains(E.target) || _.close();
    }, _._docClickTimeout = setTimeout(function() {
      _._docClickTimeout = null, document.addEventListener("click", _._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!_.trigger) return;
      const E = _.trigger.getBoundingClientRect(), y = wt(_.dom), w = _.dom.getAttribute(g) || "bottom", A = Et(E, y, w, 8);
      _.dom.style.top = A.top + "px", _.dom.style.left = A.left + "px", _.dom.setAttribute("data-ln-popover-placement", A.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), h(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, o.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const s = p.indexOf(this);
    s !== -1 && p.splice(s, 1), i(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, o.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.isOpen && this._applyClose();
    const s = document.querySelectorAll("[" + v + '="' + this.dom.id + '"]');
    for (const a of s)
      a[l + "Trigger"] && (a.removeEventListener("click", a[l + "Trigger"]), delete a[l + "Trigger"]);
    T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }), delete this.dom[l];
  };
  function r(s) {
    const a = s[l];
    if (!a) return;
    const d = s.getAttribute(u) === "open";
    if (d !== a.isOpen)
      if (d) {
        if (K(s, "ln-popover:before-open", {
          popoverId: s.id,
          target: s,
          trigger: a.trigger
        }).defaultPrevented) {
          s.setAttribute(u, "closed");
          return;
        }
        a._applyOpen(a.trigger);
      } else {
        if (K(s, "ln-popover:before-close", {
          popoverId: s.id,
          target: s,
          trigger: a.trigger
        }).defaultPrevented) {
          s.setAttribute(u, "open");
          return;
        }
        a._applyClose();
      }
  }
  function c() {
    H(function() {
      new MutationObserver(function(a) {
        for (let m = 0; m < a.length; m++) {
          const d = a[m];
          if (d.type === "childList")
            for (let _ = 0; _ < d.addedNodes.length; _++) {
              const E = d.addedNodes[_];
              E.nodeType === 1 && (n(E), e(E));
            }
          else d.type === "attributes" && (d.attributeName === u && d.target[l] ? r(d.target) : (n(d.target), e(d.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, v]
      });
    }, "ln-popover");
  }
  window[l] = t, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body);
})();
(function() {
  const u = "data-ln-tooltip-enhance", l = "data-ln-tooltip", v = "data-ln-tooltip-position", g = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[g] !== void 0) return;
  let b = 0, h = null, i = null, t = null, n = null, e = null;
  function o() {
    return h && h.parentNode || (h = document.getElementById(p), h || (h = document.createElement("div"), h.id = p, document.body.appendChild(h))), h;
  }
  function r() {
    e || (e = function(y) {
      y.key === "Escape" && a();
    }, document.addEventListener("keydown", e));
  }
  function c() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function s(y) {
    if (t === y) return;
    a();
    const w = y.getAttribute(l) || y.getAttribute("title");
    if (!w) return;
    o(), y.hasAttribute("title") && (n = y.getAttribute("title"), y.removeAttribute("title"));
    const A = document.createElement("div");
    A.className = "ln-tooltip", A.textContent = w, y[g + "Uid"] || (b += 1, y[g + "Uid"] = "ln-tooltip-" + b), A.id = y[g + "Uid"], h.appendChild(A);
    const C = A.offsetWidth, k = A.offsetHeight, D = y.getBoundingClientRect(), M = y.getAttribute(v) || "top", F = Et(D, { width: C, height: k }, M, 6);
    A.style.top = F.top + "px", A.style.left = F.left + "px", A.setAttribute("data-ln-tooltip-placement", F.placement), y.setAttribute("aria-describedby", A.id), i = A, t = y, r();
  }
  function a() {
    if (!i) {
      c();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), n !== null && t.setAttribute("title", n)), n = null, i.parentNode && i.parentNode.removeChild(i), i = null, t = null, c();
  }
  function m(y) {
    if (y[g]) return;
    y[g] = !0;
    const w = function() {
      s(y);
    }, A = function() {
      t === y && a();
    }, C = function() {
      s(y);
    }, k = function() {
      t === y && a();
    };
    y.addEventListener("mouseenter", w), y.addEventListener("mouseleave", A), y.addEventListener("focus", C, !0), y.addEventListener("blur", k, !0), y[g + "Cleanup"] = function() {
      y.removeEventListener("mouseenter", w), y.removeEventListener("mouseleave", A), y.removeEventListener("focus", C, !0), y.removeEventListener("blur", k, !0), t === y && a(), delete y[g], delete y[g + "Cleanup"], delete y[g + "Uid"], T(y, "ln-tooltip:destroyed", { trigger: y });
    };
  }
  function d(y) {
    if (!y || y.nodeType !== 1) return;
    const w = Array.from(y.querySelectorAll(
      "[" + u + "], [" + l + "][title]"
    ));
    y.hasAttribute && (y.hasAttribute(u) || y.hasAttribute(l) && y.hasAttribute("title")) && w.push(y);
    for (const A of w)
      m(A);
  }
  function _(y) {
    d(y);
  }
  function E() {
    H(function() {
      new MutationObserver(function(w) {
        for (let A = 0; A < w.length; A++) {
          const C = w[A];
          if (C.type === "childList")
            for (let k = 0; k < C.addedNodes.length; k++) {
              const D = C.addedNodes[k];
              D.nodeType === 1 && d(D);
            }
          else C.type === "attributes" && d(C.target);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, l]
      });
    }, "ln-tooltip");
  }
  window[g] = _, E(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const u = "data-ln-toast", l = "lnToast", v = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[l] !== void 0 && window[l] !== null) return;
  function g(a = document.body) {
    return p(a), s;
  }
  function p(a) {
    if (!a || a.nodeType !== 1) return;
    const m = Array.from(a.querySelectorAll("[" + u + "]"));
    a.hasAttribute && a.hasAttribute(u) && m.push(a);
    for (const d of m)
      d[l] || new b(d);
  }
  function b(a) {
    this.dom = a, a[l] = this, this.timeoutDefault = parseInt(a.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(a.getAttribute("data-ln-toast-max") || "5", 10);
    for (const m of Array.from(a.querySelectorAll("[data-ln-toast-item]")))
      n(m);
    return this;
  }
  b.prototype.destroy = function() {
    if (this.dom[l]) {
      for (const a of Array.from(this.dom.children))
        o(a);
      delete this.dom[l];
    }
  };
  function h(a) {
    return a === "success" ? "Success" : a === "error" ? "Error" : a === "warn" ? "Warning" : "Information";
  }
  function i(a) {
    return a === "warn" ? "warning" : a;
  }
  function t(a, m, d) {
    const _ = document.createElement("div");
    _.className = "ln-toast__card " + i(a), _.setAttribute("role", a === "error" ? "alert" : "status"), _.setAttribute("aria-live", a === "error" ? "assertive" : "polite");
    const E = document.createElement("div");
    E.className = "ln-toast__side", E.innerHTML = v[a] || v.info;
    const y = document.createElement("div");
    y.className = "ln-toast__content";
    const w = document.createElement("div");
    w.className = "ln-toast__head";
    const A = document.createElement("strong");
    A.className = "ln-toast__title", A.textContent = m || h(a);
    const C = document.createElement("button");
    return C.type = "button", C.className = "ln-toast__close", C.setAttribute("aria-label", "Close"), C.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>', C.addEventListener("click", function() {
      o(d);
    }), w.appendChild(A), y.appendChild(w), y.appendChild(C), _.appendChild(E), _.appendChild(y), { card: _, content: y };
  }
  function n(a) {
    const m = ((a.getAttribute("data-type") || "info") + "").toLowerCase(), d = a.getAttribute("data-title"), _ = (a.innerText || a.textContent || "").trim();
    a.className = "ln-toast__item", a.removeAttribute("data-ln-toast-item");
    const E = t(m, d, a);
    if (_) {
      const y = document.createElement("div");
      y.className = "ln-toast__body";
      const w = document.createElement("p");
      w.textContent = _, y.appendChild(w), E.content.appendChild(y);
    }
    a.innerHTML = "", a.appendChild(E.card), requestAnimationFrame(() => a.classList.add("ln-toast__item--in"));
  }
  function e(a, m) {
    for (; a.dom.children.length >= a.max; ) a.dom.removeChild(a.dom.firstElementChild);
    a.dom.appendChild(m), requestAnimationFrame(() => m.classList.add("ln-toast__item--in"));
  }
  function o(a) {
    !a || !a.parentNode || (clearTimeout(a._timer), a.classList.remove("ln-toast__item--in"), a.classList.add("ln-toast__item--out"), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 200));
  }
  function r(a = {}) {
    let m = a.container;
    if (typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !m)
      return console.warn("[ln-toast] No toast container found"), null;
    const d = m[l] || new b(m), _ = Number.isFinite(a.timeout) ? a.timeout : d.timeoutDefault, E = (a.type || "info").toLowerCase(), y = document.createElement("li");
    y.className = "ln-toast__item";
    const w = t(E, a.title, y);
    if (a.message || a.data && a.data.errors) {
      const A = document.createElement("div");
      if (A.className = "ln-toast__body", a.message)
        if (Array.isArray(a.message)) {
          const C = document.createElement("ul");
          for (const k of a.message) {
            const D = document.createElement("li");
            D.textContent = k, C.appendChild(D);
          }
          A.appendChild(C);
        } else {
          const C = document.createElement("p");
          C.textContent = a.message, A.appendChild(C);
        }
      if (a.data && a.data.errors) {
        const C = document.createElement("ul");
        for (const k of Object.values(a.data.errors).flat()) {
          const D = document.createElement("li");
          D.textContent = k, C.appendChild(D);
        }
        A.appendChild(C);
      }
      w.content.appendChild(A);
    }
    return y.appendChild(w.card), e(d, y), _ > 0 && (y._timer = setTimeout(() => o(y), _)), y;
  }
  function c(a) {
    let m = a;
    if (typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !!m)
      for (const d of Array.from(m.children))
        o(d);
  }
  const s = function(a) {
    return g(a);
  };
  s.enqueue = r, s.clear = c, H(function() {
    new MutationObserver(function(m) {
      for (const d of m) {
        if (d.type === "attributes") {
          p(d.target);
          continue;
        }
        for (const _ of d.addedNodes)
          p(_);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
  }, "ln-toast"), window[l] = s, window.addEventListener("ln-toast:enqueue", function(a) {
    a.detail && s.enqueue(a.detail);
  }), g(document.body);
})();
(function() {
  const u = "data-ln-upload", l = "lnUpload", v = "data-ln-upload-dict", g = "data-ln-upload-accept", p = "data-ln-upload-context", b = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function h() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const s = document.createElement("div");
    s.innerHTML = b;
    const a = s.firstElementChild;
    a && document.body.appendChild(a);
  }
  if (window[l] !== void 0) return;
  function i(s) {
    if (s === 0) return "0 B";
    const a = 1024, m = ["B", "KB", "MB", "GB"], d = Math.floor(Math.log(s) / Math.log(a));
    return parseFloat((s / Math.pow(a, d)).toFixed(1)) + " " + m[d];
  }
  function t(s) {
    return s.split(".").pop().toLowerCase();
  }
  function n(s) {
    return s === "docx" && (s = "doc"), ["pdf", "doc", "epub"].includes(s) ? "lnc-file-" + s : "ln-file";
  }
  function e(s, a) {
    if (!a) return !0;
    const m = "." + t(s.name);
    return a.split(",").map(function(_) {
      return _.trim().toLowerCase();
    }).includes(m.toLowerCase());
  }
  function o(s) {
    if (s.hasAttribute("data-ln-upload-initialized")) return;
    s.setAttribute("data-ln-upload-initialized", "true"), h();
    const a = Ot(s, v), m = s.querySelector(".ln-upload__zone"), d = s.querySelector(".ln-upload__list"), _ = s.getAttribute(g) || "";
    if (!m || !d) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", s);
      return;
    }
    let E = s.querySelector('input[type="file"]');
    E || (E = document.createElement("input"), E.type = "file", E.multiple = !0, E.classList.add("hidden"), _ && (E.accept = _.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), s.appendChild(E));
    const y = s.getAttribute(u) || "/files/upload", w = s.getAttribute(p) || "", A = /* @__PURE__ */ new Map();
    let C = 0;
    function k() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function D(R) {
      if (!e(R, _)) {
        const S = a["invalid-type"];
        T(s, "ln-upload:invalid", {
          file: R,
          message: S
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["invalid-title"] || "Invalid File",
          message: S || a["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const B = "file-" + ++C, j = t(R.name), G = n(j), ft = at(s, "ln-upload-item", "ln-upload");
      if (!ft) return;
      const W = ft.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", B), Z(W, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + G,
        removeLabel: a.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const rt = W.querySelector(".ln-upload__progress-bar"), Y = W.querySelector('[data-ln-upload-action="remove"]');
      Y && (Y.disabled = !0), d.appendChild(W);
      const st = new FormData();
      st.append("file", R), st.append("context", w);
      const f = new XMLHttpRequest();
      f.upload.addEventListener("progress", function(S) {
        if (S.lengthComputable) {
          const O = Math.round(S.loaded / S.total * 100);
          rt.style.width = O + "%", Z(W, { sizeText: O + "%" });
        }
      }), f.addEventListener("load", function() {
        if (f.status >= 200 && f.status < 300) {
          let S;
          try {
            S = JSON.parse(f.responseText);
          } catch {
            L("Invalid response");
            return;
          }
          Z(W, { sizeText: i(S.size || R.size), uploading: !1 }), Y && (Y.disabled = !1), A.set(B, {
            serverId: S.id,
            name: S.name,
            size: S.size
          }), M(), T(s, "ln-upload:uploaded", {
            localId: B,
            serverId: S.id,
            name: S.name
          });
        } else {
          let S = a["upload-failed"] || "Upload failed";
          try {
            S = JSON.parse(f.responseText).message || S;
          } catch {
          }
          L(S);
        }
      }), f.addEventListener("error", function() {
        L(a["network-error"] || "Network error");
      });
      function L(S) {
        rt && (rt.style.width = "100%"), Z(W, { sizeText: a.error || "Error", uploading: !1, error: !0 }), Y && (Y.disabled = !1), T(s, "ln-upload:error", {
          file: R,
          message: S
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["error-title"] || "Upload Error",
          message: S || a["upload-failed"] || "Failed to upload file"
        });
      }
      f.open("POST", y), f.setRequestHeader("X-CSRF-TOKEN", k()), f.setRequestHeader("Accept", "application/json"), f.send(st);
    }
    function M() {
      for (const R of s.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of A) {
        const B = document.createElement("input");
        B.type = "hidden", B.name = "file_ids[]", B.value = R.serverId, s.appendChild(B);
      }
    }
    function F(R) {
      const B = A.get(R), j = d.querySelector('[data-file-id="' + R + '"]');
      if (!B || !B.serverId) {
        j && j.remove(), A.delete(R), M();
        return;
      }
      j && Z(j, { deleting: !0 }), fetch("/files/" + B.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": k(),
          Accept: "application/json"
        }
      }).then(function(G) {
        G.status === 200 ? (j && j.remove(), A.delete(R), M(), T(s, "ln-upload:removed", {
          localId: R,
          serverId: B.serverId
        })) : (j && Z(j, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["delete-title"] || "Error",
          message: a["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(G) {
        console.warn("[ln-upload] Delete error:", G), j && Z(j, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["network-error"] || "Network error",
          message: a["connection-error"] || "Could not connect to server"
        });
      });
    }
    function U(R) {
      for (const B of R)
        D(B);
      E.value = "";
    }
    const dt = function() {
      E.click();
    }, ut = function() {
      U(this.files);
    }, ot = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.add("ln-upload__zone--dragover");
    }, X = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.add("ln-upload__zone--dragover");
    }, et = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.remove("ln-upload__zone--dragover");
    }, nt = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.remove("ln-upload__zone--dragover"), U(R.dataTransfer.files);
    }, it = function(R) {
      const B = R.target.closest('[data-ln-upload-action="remove"]');
      if (!B || !d.contains(B) || B.disabled) return;
      const j = B.closest(".ln-upload__item");
      j && F(j.getAttribute("data-file-id"));
    };
    m.addEventListener("click", dt), E.addEventListener("change", ut), m.addEventListener("dragenter", ot), m.addEventListener("dragover", X), m.addEventListener("dragleave", et), m.addEventListener("drop", nt), d.addEventListener("click", it), s.lnUploadAPI = {
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
              "X-CSRF-TOKEN": k(),
              Accept: "application/json"
            }
          });
        A.clear(), d.innerHTML = "", M(), T(s, "ln-upload:cleared", {});
      },
      destroy: function() {
        m.removeEventListener("click", dt), E.removeEventListener("change", ut), m.removeEventListener("dragenter", ot), m.removeEventListener("dragover", X), m.removeEventListener("dragleave", et), m.removeEventListener("drop", nt), d.removeEventListener("click", it), A.clear(), d.innerHTML = "", M(), s.removeAttribute("data-ln-upload-initialized"), delete s.lnUploadAPI;
      }
    };
  }
  function r() {
    for (const s of document.querySelectorAll("[" + u + "]"))
      o(s);
  }
  function c() {
    H(function() {
      new MutationObserver(function(a) {
        for (const m of a)
          if (m.type === "childList") {
            for (const d of m.addedNodes)
              if (d.nodeType === 1) {
                d.hasAttribute(u) && o(d);
                for (const _ of d.querySelectorAll("[" + u + "]"))
                  o(_);
              }
          } else m.type === "attributes" && m.target.hasAttribute(u) && o(m.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-upload");
  }
  window[l] = {
    init: o,
    initAll: r
  }, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
(function() {
  const u = "lnExternalLinks";
  if (window[u] !== void 0) return;
  function l(i) {
    return i.hostname && i.hostname !== window.location.hostname;
  }
  function v(i) {
    if (i.getAttribute("data-ln-external-link") === "processed" || !l(i)) return;
    i.target = "_blank", i.rel = "noopener noreferrer";
    const t = document.createElement("span");
    t.className = "sr-only", t.textContent = "(opens in new tab)", i.appendChild(t), i.setAttribute("data-ln-external-link", "processed"), T(i, "ln-external-links:processed", {
      link: i,
      href: i.href
    });
  }
  function g(i) {
    i = i || document.body;
    for (const t of i.querySelectorAll("a, area"))
      v(t);
  }
  function p() {
    document.body.addEventListener("click", function(i) {
      const t = i.target.closest("a, area");
      t && t.getAttribute("data-ln-external-link") === "processed" && T(t, "ln-external-links:clicked", {
        link: t,
        href: t.href,
        text: t.textContent || t.title || ""
      });
    });
  }
  function b() {
    H(function() {
      new MutationObserver(function(t) {
        for (const n of t)
          if (n.type === "childList") {
            for (const e of n.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && v(e), e.querySelectorAll))
                for (const o of e.querySelectorAll("a, area"))
                  v(o);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }, "ln-external-links");
  }
  function h() {
    p(), b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      g();
    }) : g();
  }
  window[u] = {
    process: g
  }, h();
})();
(function() {
  const u = "data-ln-link", l = "lnLink";
  if (window[l] !== void 0) return;
  let v = null;
  function g() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function p(d) {
    v && (v.textContent = d, v.classList.add("ln-link-status--visible"));
  }
  function b() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function h(d, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const E = d.querySelector("a");
    if (!E) return;
    const y = E.getAttribute("href");
    if (!y) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(y, "_blank");
      return;
    }
    K(d, "ln-link:navigate", { target: d, href: y, link: E }).defaultPrevented || E.click();
  }
  function i(d) {
    const _ = d.querySelector("a");
    if (!_) return;
    const E = _.getAttribute("href");
    E && p(E);
  }
  function t() {
    b();
  }
  function n(d) {
    d[l + "Row"] || (d[l + "Row"] = !0, d.querySelector("a") && (d._lnLinkClick = function(_) {
      h(d, _);
    }, d._lnLinkEnter = function() {
      i(d);
    }, d.addEventListener("click", d._lnLinkClick), d.addEventListener("mouseenter", d._lnLinkEnter), d.addEventListener("mouseleave", t)));
  }
  function e(d) {
    d[l + "Row"] && (d._lnLinkClick && d.removeEventListener("click", d._lnLinkClick), d._lnLinkEnter && d.removeEventListener("mouseenter", d._lnLinkEnter), d.removeEventListener("mouseleave", t), delete d._lnLinkClick, delete d._lnLinkEnter, delete d[l + "Row"]);
  }
  function o(d) {
    if (!d[l + "Init"]) return;
    const _ = d.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const E = _ === "TABLE" && d.querySelector("tbody") || d;
      for (const y of E.querySelectorAll("tr"))
        e(y);
    } else
      e(d);
    delete d[l + "Init"];
  }
  function r(d) {
    if (d[l + "Init"]) return;
    d[l + "Init"] = !0;
    const _ = d.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const E = _ === "TABLE" && d.querySelector("tbody") || d;
      for (const y of E.querySelectorAll("tr"))
        n(y);
    } else
      n(d);
  }
  function c(d) {
    d.hasAttribute && d.hasAttribute(u) && r(d);
    const _ = d.querySelectorAll ? d.querySelectorAll("[" + u + "]") : [];
    for (const E of _)
      r(E);
  }
  function s() {
    H(function() {
      new MutationObserver(function(_) {
        for (const E of _)
          if (E.type === "childList")
            for (const y of E.addedNodes)
              y.nodeType === 1 && (c(y), y.tagName === "TR" && y.closest("[" + u + "]") && n(y));
          else E.type === "attributes" && c(E.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-link");
  }
  function a(d) {
    c(d);
  }
  window[l] = { init: a, destroy: o };
  function m() {
    g(), s(), a(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", m) : m();
})();
(function() {
  const u = "[data-ln-progress]", l = "lnProgress";
  if (window[l] !== void 0) return;
  function v(e) {
    const o = e.getAttribute("data-ln-progress");
    return o !== null && o !== "";
  }
  function g(e) {
    p(e);
  }
  function p(e) {
    const o = Array.from(e.querySelectorAll(u));
    for (const r of o)
      v(r) && !r[l] && (r[l] = new b(r));
    e.hasAttribute && e.hasAttribute("data-ln-progress") && v(e) && !e[l] && (e[l] = new b(e));
  }
  function b(e) {
    return this.dom = e, this._attrObserver = null, this._parentObserver = null, n.call(this), i.call(this), t.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[l]);
  };
  function h() {
    H(function() {
      new MutationObserver(function(o) {
        for (const r of o)
          if (r.type === "childList")
            for (const c of r.addedNodes)
              c.nodeType === 1 && p(c);
          else r.type === "attributes" && p(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  h();
  function i() {
    const e = this, o = new MutationObserver(function(r) {
      for (const c of r)
        (c.attributeName === "data-ln-progress" || c.attributeName === "data-ln-progress-max") && n.call(e);
    });
    o.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = o;
  }
  function t() {
    const e = this, o = this.dom.parentElement;
    if (!o || !o.hasAttribute("data-ln-progress-max")) return;
    const r = new MutationObserver(function(c) {
      for (const s of c)
        s.attributeName === "data-ln-progress-max" && n.call(e);
    });
    r.observe(o, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = r;
  }
  function n() {
    const e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, o = this.dom.parentElement, c = (o && o.hasAttribute("data-ln-progress-max") ? parseFloat(o.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let s = c > 0 ? e / c * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100), this.dom.style.width = s + "%", T(this.dom, "ln-progress:change", { target: this.dom, value: e, max: c, percentage: s });
  }
  window[l] = g, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const u = "data-ln-filter", l = "lnFilter", v = "data-ln-filter-initialized", g = "data-ln-filter-key", p = "data-ln-filter-value", b = "data-ln-filter-hide", h = "data-ln-filter-reset", i = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[l] !== void 0) return;
  function n(r) {
    return r.hasAttribute(h) || r.getAttribute(p) === "";
  }
  function e(r) {
    const c = r.dom, s = r.colIndex, a = c.querySelector("template");
    if (!a || s === null) return;
    const m = document.getElementById(r.targetId);
    if (!m) return;
    const d = m.tagName === "TABLE" ? m : m.querySelector("table");
    if (!d || m.hasAttribute("data-ln-table")) return;
    const _ = {}, E = [], y = d.tBodies;
    for (let C = 0; C < y.length; C++) {
      const k = y[C].rows;
      for (let D = 0; D < k.length; D++) {
        const M = k[D].cells[s], F = M ? M.textContent.trim() : "";
        F && !_[F] && (_[F] = !0, E.push(F));
      }
    }
    E.sort(function(C, k) {
      return C.localeCompare(k);
    });
    const w = c.querySelector("[" + g + "]"), A = w ? w.getAttribute(g) : c.getAttribute("data-ln-filter-key") || "col" + s;
    for (let C = 0; C < E.length; C++) {
      const k = a.content.cloneNode(!0), D = k.querySelector("input");
      D && (D.setAttribute(g, A), D.setAttribute(p, E[C]), kt(k, { text: E[C] }), c.appendChild(k));
    }
  }
  function o(r) {
    if (r.hasAttribute(v)) return this;
    this.dom = r, this.targetId = r.getAttribute(u), this._pendingEvents = [];
    const c = r.getAttribute(i);
    this.colIndex = c !== null ? parseInt(c, 10) : null, e(this), this.inputs = Array.from(r.querySelectorAll("[" + g + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(g) : null;
    const s = this, a = It(
      function() {
        s._render();
      },
      function() {
        s._afterRender();
      }
    );
    this.state = xt({
      key: null,
      values: []
    }, a), this._attachHandlers();
    let m = !1;
    if (r.hasAttribute("data-ln-persist")) {
      const d = mt("filter", r);
      d && d.key && Array.isArray(d.values) && d.values.length > 0 && (this.state.key = d.key, this.state.values = d.values, m = !0);
    }
    if (!m) {
      let d = null;
      const _ = [];
      for (let E = 0; E < this.inputs.length; E++) {
        const y = this.inputs[E];
        if (y.checked && !n(y)) {
          d || (d = y.getAttribute(g));
          const w = y.getAttribute(p);
          w && _.push(w);
        }
      }
      _.length > 0 && (this.state.key = d, this.state.values = _, this._pendingEvents.push({
        name: "ln-filter:changed",
        detail: { key: d, values: _ }
      }));
    }
    return r.setAttribute(v, ""), this;
  }
  o.prototype._attachHandlers = function() {
    const r = this;
    this.inputs.forEach(function(c) {
      c[l + "Bound"] || (c[l + "Bound"] = !0, c._lnFilterChange = function() {
        const s = c.getAttribute(g), a = c.getAttribute(p) || "";
        if (n(c)) {
          r._pendingEvents.push({
            name: "ln-filter:changed",
            detail: { key: s, values: [] }
          }), r.reset();
          return;
        }
        if (c.checked)
          r.state.values.indexOf(a) === -1 && (r.state.key = s, r.state.values.push(a));
        else {
          const m = r.state.values.indexOf(a);
          if (m !== -1 && r.state.values.splice(m, 1), r.state.values.length === 0) {
            r._pendingEvents.push({
              name: "ln-filter:changed",
              detail: { key: s, values: [] }
            }), r.reset();
            return;
          }
        }
        r._pendingEvents.push({
          name: "ln-filter:changed",
          detail: { key: r.state.key, values: r.state.values.slice() }
        });
      }, c.addEventListener("change", c._lnFilterChange));
    });
  }, o.prototype._render = function() {
    const r = this, c = this.state.key, s = this.state.values, a = c === null || s.length === 0, m = [];
    for (let d = 0; d < s.length; d++)
      m.push(s[d].toLowerCase());
    if (this.inputs.forEach(function(d) {
      if (a)
        d.checked = n(d);
      else if (n(d))
        d.checked = !1;
      else {
        const _ = d.getAttribute(p) || "";
        d.checked = s.indexOf(_) !== -1;
      }
    }), r.colIndex !== null)
      r._filterTableRows();
    else {
      const d = document.getElementById(r.targetId);
      if (!d) return;
      const _ = d.children;
      for (let E = 0; E < _.length; E++) {
        const y = _[E];
        if (a) {
          y.removeAttribute(b);
          continue;
        }
        const w = y.getAttribute("data-" + c);
        y.removeAttribute(b), w !== null && m.indexOf(w.toLowerCase()) === -1 && y.setAttribute(b, "true");
      }
    }
  }, o.prototype._afterRender = function() {
    const r = this._pendingEvents;
    this._pendingEvents = [];
    for (let c = 0; c < r.length; c++)
      this._dispatchOnBoth(r[c].name, r[c].detail);
    this.dom.hasAttribute("data-ln-persist") && (this.state.key && this.state.values.length > 0 ? tt("filter", this.dom, { key: this.state.key, values: this.state.values.slice() }) : tt("filter", this.dom, null));
  }, o.prototype._dispatchOnBoth = function(r, c) {
    T(this.dom, r, c);
    const s = document.getElementById(this.targetId);
    s && s !== this.dom && T(s, r, c);
  }, o.prototype._filterTableRows = function() {
    const r = document.getElementById(this.targetId);
    if (!r) return;
    const c = r.tagName === "TABLE" ? r : r.querySelector("table");
    if (!c || r.hasAttribute("data-ln-table")) return;
    const s = this.state.key || this._filterKey, a = this.state.values;
    t.has(c) || t.set(c, {});
    const m = t.get(c);
    if (s && a.length > 0) {
      const y = [];
      for (let w = 0; w < a.length; w++)
        y.push(a[w].toLowerCase());
      m[s] = { col: this.colIndex, values: y };
    } else s && delete m[s];
    const d = Object.keys(m), _ = d.length > 0, E = c.tBodies;
    for (let y = 0; y < E.length; y++) {
      const w = E[y].rows;
      for (let A = 0; A < w.length; A++) {
        const C = w[A];
        if (!_) {
          C.removeAttribute(b);
          continue;
        }
        let k = !0;
        for (let D = 0; D < d.length; D++) {
          const M = m[d[D]], F = C.cells[M.col], U = F ? F.textContent.trim().toLowerCase() : "";
          if (M.values.indexOf(U) === -1) {
            k = !1;
            break;
          }
        }
        k ? C.removeAttribute(b) : C.setAttribute(b, "true");
      }
    }
  }, o.prototype.filter = function(r, c) {
    if (Array.isArray(c)) {
      if (c.length === 0) {
        this.reset();
        return;
      }
      this.state.key = r, this.state.values = c.slice();
    } else if (c)
      this.state.key = r, this.state.values = [c];
    else {
      this.reset();
      return;
    }
    this._pendingEvents.push({
      name: "ln-filter:changed",
      detail: { key: this.state.key, values: this.state.values.slice() }
    });
  }, o.prototype.reset = function() {
    this._pendingEvents.push({ name: "ln-filter:reset", detail: {} }), this.state.key = null, this.state.values = [];
  }, o.prototype.getActive = function() {
    return this.state.key === null || this.state.values.length === 0 ? null : { key: this.state.key, values: this.state.values.slice() };
  }, o.prototype.destroy = function() {
    if (this.dom[l]) {
      if (this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const c = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (c && t.has(c)) {
            const s = t.get(c), a = this.state.key || this._filterKey;
            a && s[a] && delete s[a], Object.keys(s).length === 0 && t.delete(c);
          }
        }
      }
      this.inputs.forEach(function(r) {
        r._lnFilterChange && (r.removeEventListener("change", r._lnFilterChange), delete r._lnFilterChange), delete r[l + "Bound"];
      }), this.dom.removeAttribute(v), delete this.dom[l];
    }
  }, V(u, l, o, "ln-filter");
})();
(function() {
  const u = "data-ln-search", l = "lnSearch", v = "data-ln-search-initialized", g = "data-ln-search-hide";
  if (window[l] !== void 0) return;
  function b(h) {
    if (h.hasAttribute(v)) return this;
    this.dom = h, this.targetId = h.getAttribute(u);
    const i = h.tagName;
    if (this.input = i === "INPUT" || i === "TEXTAREA" ? h : h.querySelector('[name="search"]') || h.querySelector('input[type="search"]') || h.querySelector('input[type="text"]'), this.itemsSelector = h.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return h.setAttribute(v, ""), this;
  }
  b.prototype._attachHandler = function() {
    if (!this.input) return;
    const h = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      h.input.value = "", h._search(""), h.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(h._debounceTimer), h._debounceTimer = setTimeout(function() {
        h._search(h.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, b.prototype._search = function(h) {
    const i = document.getElementById(this.targetId);
    if (!i || K(i, "ln-search:change", { term: h, targetId: this.targetId }).defaultPrevented) return;
    const n = this.itemsSelector ? i.querySelectorAll(this.itemsSelector) : i.children;
    for (let e = 0; e < n.length; e++) {
      const o = n[e];
      o.removeAttribute(g), h && !o.textContent.replace(/\s+/g, " ").toLowerCase().includes(h) && o.setAttribute(g, "true");
    }
  }, b.prototype.destroy = function() {
    this.dom[l] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(v), delete this.dom[l]);
  }, V(u, l, b, "ln-search");
})();
(function() {
  const u = "lnTableSort", l = "data-ln-sort", v = "data-ln-sort-active";
  if (window[u] !== void 0) return;
  function g(t) {
    p(t);
  }
  function p(t) {
    const n = Array.from(t.querySelectorAll("table"));
    t.tagName === "TABLE" && n.push(t), n.forEach(function(e) {
      if (e[u]) return;
      const o = Array.from(e.querySelectorAll("th[" + l + "]"));
      o.length && (e[u] = new h(e, o));
    });
  }
  function b(t, n) {
    t.querySelectorAll("[data-ln-sort-icon]").forEach(function(o) {
      const r = o.getAttribute("data-ln-sort-icon");
      n == null ? o.classList.toggle("hidden", r !== null && r !== "") : o.classList.toggle("hidden", r !== n);
    });
  }
  function h(t, n) {
    this.table = t, this.ths = n, this._col = -1, this._dir = null;
    const e = this;
    n.forEach(function(r, c) {
      r[u + "Bound"] || (r[u + "Bound"] = !0, r._lnSortClick = function(s) {
        const a = s.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        a && a !== r || e._handleClick(c, r);
      }, r.addEventListener("click", r._lnSortClick));
    });
    const o = t.closest("[data-ln-table][data-ln-persist]");
    if (o) {
      const r = mt("table-sort", o);
      r && r.dir && r.col >= 0 && r.col < n.length && (this._handleClick(r.col, n[r.col]), r.dir === "desc" && this._handleClick(r.col, n[r.col]));
    }
    return this;
  }
  h.prototype._handleClick = function(t, n) {
    let e;
    this._col !== t ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this.ths.forEach(function(r) {
      r.removeAttribute(v), b(r, null);
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = t, this._dir = e, n.setAttribute(v, e), b(n, e)), T(this.table, "ln-table:sort", {
      column: t,
      sortType: n.getAttribute(l),
      direction: e
    });
    const o = this.table.closest("[data-ln-table][data-ln-persist]");
    o && (e === null ? tt("table-sort", o, null) : tt("table-sort", o, { col: t, dir: e }));
  }, h.prototype.destroy = function() {
    this.table[u] && (this.ths.forEach(function(t) {
      t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete t[u + "Bound"];
    }), delete this.table[u]);
  };
  function i() {
    H(function() {
      new MutationObserver(function(n) {
        n.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(o) {
            o.nodeType === 1 && p(o);
          }) : e.type === "attributes" && p(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [l] });
    }, "ln-table-sort");
  }
  window[u] = g, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const u = "data-ln-table", l = "lnTable", v = "data-ln-sort", g = "data-ln-table-empty";
  if (window[l] !== void 0) return;
  const h = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function i(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("tbody"), this.thead = t.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const n = t.querySelector(".ln-table__toolbar");
    n && t.style.setProperty("--ln-table-toolbar-h", n.offsetHeight + "px");
    const e = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      const o = new MutationObserver(function() {
        e.tbody.rows.length > 0 && (o.disconnect(), e._parseRows());
      });
      o.observe(this.tbody, { childList: !0 });
    }
    return this._onSearch = function(o) {
      o.preventDefault(), e._searchTerm = o.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onSort = function(o) {
      e._sortCol = o.detail.direction === null ? -1 : o.detail.column, e._sortDir = o.detail.direction, e._sortType = o.detail.sortType, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:sorted", {
        column: o.detail.column,
        direction: o.detail.direction,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(o) {
      const r = o.detail.key;
      let c = !1;
      for (let m = 0; m < e.ths.length; m++)
        if (e.ths[m].getAttribute("data-ln-filter-col") === r) {
          c = !0;
          break;
        }
      if (!c) return;
      const s = o.detail.values;
      if (!s || s.length === 0)
        delete e._columnFilters[r];
      else {
        const m = [];
        for (let d = 0; d < s.length; d++)
          m.push(s[d].toLowerCase());
        e._columnFilters[r] = m;
      }
      const a = e.dom.querySelector('th[data-ln-filter-col="' + r + '"]');
      a && (s && s.length > 0 ? a.setAttribute("data-ln-filter-active", "") : a.removeAttribute("data-ln-filter-active")), e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(o) {
      if (!o.target.closest("[data-ln-table-clear]")) return;
      e._searchTerm = "";
      const c = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (c) {
        const a = c.tagName === "INPUT" ? c : c.querySelector("input");
        a && (a.value = "");
      }
      e._columnFilters = {};
      for (let a = 0; a < e.ths.length; a++)
        e.ths[a].removeAttribute("data-ln-filter-active");
      const s = document.querySelectorAll('[data-ln-filter="' + t.id + '"]');
      for (let a = 0; a < s.length; a++)
        s[a].lnFilter && s[a].lnFilter.reset();
      e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: "",
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("click", this._onClear), this;
  }
  i.prototype._parseRows = function() {
    const t = this.tbody.rows, n = this.ths;
    this._data = [];
    const e = [];
    for (let o = 0; o < n.length; o++)
      e[o] = n[o].getAttribute(v);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let o = 0; o < t.length; o++) {
      const r = t[o], c = [], s = [], a = [];
      for (let m = 0; m < r.cells.length; m++) {
        const d = r.cells[m], _ = d.textContent.trim(), E = d.hasAttribute("data-ln-value") ? d.getAttribute("data-ln-value") : _, y = e[m];
        s[m] = _.toLowerCase(), y === "number" || y === "date" ? c[m] = parseFloat(E) || 0 : y === "string" ? c[m] = String(E) : c[m] = null, m < r.cells.length - 1 && a.push(_.toLowerCase());
      }
      this._data.push({
        sortKeys: c,
        rawTexts: s,
        html: r.outerHTML,
        searchText: a.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, i.prototype._applyFilterAndSort = function() {
    const t = this._searchTerm, n = this._columnFilters, e = Object.keys(n).length > 0, o = this.ths, r = {};
    if (e)
      for (let d = 0; d < o.length; d++) {
        const _ = o[d].getAttribute("data-ln-filter-col");
        _ && (r[_] = d);
      }
    if (!t && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(d) {
      if (t && d.searchText.indexOf(t) === -1) return !1;
      if (e)
        for (const _ in n) {
          const E = r[_];
          if (E !== void 0 && n[_].indexOf(d.rawTexts[E]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const c = this._sortCol, s = this._sortDir === "desc" ? -1 : 1, a = this._sortType === "number" || this._sortType === "date", m = h ? h.compare : function(d, _) {
      return d < _ ? -1 : d > _ ? 1 : 0;
    };
    this._filteredData.sort(function(d, _) {
      const E = d.sortKeys[c], y = _.sortKeys[c];
      return a ? (E - y) * s : m(E, y) * s;
    });
  }, i.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(n) {
      const e = document.createElement("col");
      e.style.width = n.offsetWidth + "px", t.appendChild(e);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, i.prototype._render = function() {
    if (!this.tbody) return;
    const t = this._filteredData.length;
    t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, i.prototype._renderAll = function() {
    const t = [], n = this._filteredData;
    for (let e = 0; e < n.length; e++) t.push(n[e].html);
    this.tbody.innerHTML = t.join("");
  }, i.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const t = this;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, i.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, i.prototype._renderVirtual = function() {
    const t = this._filteredData, n = t.length, e = this._rowHeight;
    if (!e || !n) return;
    const r = this.table.getBoundingClientRect().top + window.scrollY, c = this.thead ? this.thead.offsetHeight : 0, s = r + c, a = window.scrollY - s, m = Math.max(0, Math.floor(a / e) - 15), d = Math.min(m + Math.ceil(window.innerHeight / e) + 30, n);
    if (m === this._vStart && d === this._vEnd) return;
    this._vStart = m, this._vEnd = d;
    const _ = this.ths.length || 1, E = m * e, y = (n - d) * e;
    let w = "";
    E > 0 && (w += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + _ + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>');
    for (let A = m; A < d; A++) w += t[A].html;
    y > 0 && (w += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + _ + '" style="height:' + y + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = w;
  }, i.prototype._showEmptyState = function() {
    const t = this.ths.length || 1, n = this.dom.querySelector("template[" + g + "]"), e = document.createElement("td");
    e.setAttribute("colspan", String(t)), n && e.appendChild(document.importNode(n.content, !0));
    const o = document.createElement("tr");
    o.className = "ln-table__empty", o.appendChild(e), this.tbody.innerHTML = "", this.tbody.appendChild(o), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, i.prototype.destroy = function() {
    this.dom[l] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[l]);
  }, V(u, l, i, "ln-table");
})();
(function() {
  const u = "data-ln-circular-progress", l = "lnCircularProgress";
  if (window[l] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", g = 36, p = 16, b = 2 * Math.PI * p;
  function h(o) {
    return this.dom = o, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), n.call(this), o.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  h.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[l]);
  };
  function i(o, r) {
    const c = document.createElementNS(v, o);
    for (const s in r)
      c.setAttribute(s, r[s]);
    return c;
  }
  function t() {
    this.svg = i("svg", {
      viewBox: "0 0 " + g + " " + g,
      "aria-hidden": "true"
    }), this.trackCircle = i("circle", {
      cx: g / 2,
      cy: g / 2,
      r: p,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = i("circle", {
      cx: g / 2,
      cy: g / 2,
      r: p,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": b,
      "stroke-dashoffset": b,
      transform: "rotate(-90 " + g / 2 + " " + g / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function n() {
    const o = this, r = new MutationObserver(function(c) {
      for (const s of c)
        (s.attributeName === "data-ln-circular-progress" || s.attributeName === "data-ln-circular-progress-max") && e.call(o);
    });
    r.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = r;
  }
  function e() {
    const o = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, r = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let c = r > 0 ? o / r * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100);
    const s = b - c / 100 * b;
    this.progressCircle.setAttribute("stroke-dashoffset", s);
    const a = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = a !== null ? a : Math.round(c) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: o,
      max: r,
      percentage: c
    });
  }
  V(u, l, h, "ln-circular-progress");
})();
(function() {
  const u = "data-ln-sortable", l = "lnSortable", v = "data-ln-sortable-handle";
  if (window[l] !== void 0) return;
  function g(h) {
    P(h, u, l, p);
  }
  function p(h) {
    this.dom = h, this.isEnabled = h.getAttribute(u) !== "disabled", this._dragging = null, h.setAttribute("aria-roledescription", "sortable list");
    const i = this;
    return this._onPointerDown = function(t) {
      i.isEnabled && i._handlePointerDown(t);
    }, h.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(u, "");
  }, p.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(u, "disabled");
  }, p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[l]);
  }, p.prototype._handlePointerDown = function(h) {
    let i = h.target.closest("[" + v + "]"), t;
    if (i) {
      for (t = i; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (t = h.target; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
      i = t;
    }
    const e = Array.from(this.dom.children).indexOf(t);
    if (K(this.dom, "ln-sortable:before-drag", {
      item: t,
      index: e
    }).defaultPrevented) return;
    h.preventDefault(), i.setPointerCapture(h.pointerId), this._dragging = t, t.classList.add("ln-sortable--dragging"), t.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: t,
      index: e
    });
    const r = this, c = function(a) {
      r._handlePointerMove(a);
    }, s = function(a) {
      r._handlePointerEnd(a), i.removeEventListener("pointermove", c), i.removeEventListener("pointerup", s), i.removeEventListener("pointercancel", s);
    };
    i.addEventListener("pointermove", c), i.addEventListener("pointerup", s), i.addEventListener("pointercancel", s);
  }, p.prototype._handlePointerMove = function(h) {
    if (!this._dragging) return;
    const i = Array.from(this.dom.children), t = this._dragging;
    for (const n of i)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of i) {
      if (n === t) continue;
      const e = n.getBoundingClientRect(), o = e.top + e.height / 2;
      if (h.clientY >= e.top && h.clientY < o) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (h.clientY >= o && h.clientY <= e.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, p.prototype._handlePointerEnd = function(h) {
    if (!this._dragging) return;
    const i = this._dragging, t = Array.from(this.dom.children), n = t.indexOf(i);
    let e = null, o = null;
    for (const r of t) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        e = r, o = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        e = r, o = "after";
        break;
      }
    }
    for (const r of t)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (i.classList.remove("ln-sortable--dragging"), i.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== i) {
      o === "before" ? this.dom.insertBefore(i, e) : this.dom.insertBefore(i, e.nextElementSibling);
      const c = Array.from(this.dom.children).indexOf(i);
      T(this.dom, "ln-sortable:reordered", {
        item: i,
        oldIndex: n,
        newIndex: c
      });
    }
    this._dragging = null;
  };
  function b() {
    H(function() {
      new MutationObserver(function(i) {
        for (let t = 0; t < i.length; t++) {
          const n = i[t];
          if (n.type === "childList")
            for (let e = 0; e < n.addedNodes.length; e++) {
              const o = n.addedNodes[e];
              o.nodeType === 1 && P(o, u, l, p);
            }
          else if (n.type === "attributes") {
            const e = n.target, o = e[l];
            if (o) {
              const r = e.getAttribute(u) !== "disabled";
              r !== o.isEnabled && (o.isEnabled = r, T(e, r ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: e }));
            } else
              P(e, u, l, p);
          }
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-sortable");
  }
  window[l] = g, b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const u = "data-ln-confirm", l = "lnConfirm", v = "data-ln-confirm-timeout";
  if (window[l] !== void 0) return;
  function p(t) {
    P(t, u, l, b);
  }
  function b(t) {
    this.dom = t, this.confirming = !1, this.originalText = t.textContent.trim(), this.confirmText = t.getAttribute(u) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const n = this;
    return this._onClick = function(e) {
      if (!n.confirming)
        e.preventDefault(), e.stopImmediatePropagation(), n._enterConfirm();
      else {
        if (n._submitted) return;
        n._submitted = !0, n._reset();
      }
    }, t.addEventListener("click", this._onClick), this;
  }
  b.prototype._getTimeout = function() {
    const t = parseFloat(this.dom.getAttribute(v));
    return isNaN(t) || t <= 0 ? 3 : t;
  }, b.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var t = this.dom.querySelector("svg.ln-icon use");
    t && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = t.getAttribute("href"), t.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), T(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, b.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const t = this, n = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      t._reset();
    }, n);
  }, b.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var t = this.dom.querySelector("svg.ln-icon use");
      t && this.originalIconHref && t.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, b.prototype.destroy = function() {
    this.dom[l] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[l]);
  };
  function h(t) {
    const n = t[l];
    !n || !n.confirming || n._startTimer();
  }
  function i() {
    H(function() {
      new MutationObserver(function(n) {
        for (let e = 0; e < n.length; e++) {
          const o = n[e];
          if (o.type === "childList")
            for (let r = 0; r < o.addedNodes.length; r++) {
              const c = o.addedNodes[r];
              c.nodeType === 1 && P(c, u, l, b);
            }
          else o.type === "attributes" && (o.attributeName === v && o.target[l] ? h(o.target) : P(o.target, u, l, b));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, v]
      });
    }, "ln-confirm");
  }
  window[l] = p, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const u = "data-ln-translations", l = "lnTranslations";
  if (window[l] !== void 0) return;
  const v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function g(p) {
    this.dom = p, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = p.getAttribute(u + "-default") || "", this.badgesEl = p.querySelector("[" + u + "-active]"), this.menuEl = p.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const b = p.getAttribute(u + "-locales");
    if (this.locales = v, b)
      try {
        this.locales = JSON.parse(b);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const h = this;
    return this._onRequestAdd = function(i) {
      i.detail && i.detail.lang && h.addLanguage(i.detail.lang);
    }, this._onRequestRemove = function(i) {
      i.detail && i.detail.lang && h.removeLanguage(i.detail.lang);
    }, p.addEventListener("ln-translations:request-add", this._onRequestAdd), p.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  g.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of p) {
      const h = b.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const i of h)
        i.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, g.prototype._detectExisting = function() {
    const p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const b of p) {
      const h = b.getAttribute("data-ln-translatable-lang");
      h && h !== this.defaultLang && this.activeLanguages.add(h);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, g.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const p = this;
    let b = 0;
    for (const i in this.locales) {
      if (!this.locales.hasOwnProperty(i) || this.activeLanguages.has(i)) continue;
      b++;
      const t = yt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const n = t.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", i), n.textContent = this.locales[i], n.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.menuEl.getAttribute("data-ln-toggle") === "open" && p.menuEl.setAttribute("data-ln-toggle", "close"), p.addLanguage(i));
      }), this.menuEl.appendChild(t);
    }
    const h = this.dom.querySelector("[" + u + "-add]");
    h && (h.style.display = b === 0 ? "none" : "");
  }, g.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const p = this;
    this.activeLanguages.forEach(function(b) {
      const h = yt("ln-translations-badge", "ln-translations");
      if (!h) return;
      const i = h.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", b);
      const t = i.querySelector("span");
      t.textContent = p.locales[b] || b.toUpperCase();
      const n = i.querySelector("button");
      n.setAttribute("aria-label", "Remove " + (p.locales[b] || b.toUpperCase())), n.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.removeLanguage(b));
      }), p.badgesEl.appendChild(h);
    });
  }, g.prototype.addLanguage = function(p, b) {
    if (this.activeLanguages.has(p)) return;
    const h = this.locales[p] || p;
    if (K(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: p,
      langName: h
    }).defaultPrevented) return;
    this.activeLanguages.add(p), b = b || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const n of t) {
      const e = n.getAttribute("data-ln-translatable"), o = n.getAttribute("data-ln-translations-prefix") || "", r = n.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!r) continue;
      const c = r.cloneNode(!1);
      o ? c.name = o + "[trans][" + p + "][" + e + "]" : c.name = "trans[" + p + "][" + e + "]", c.value = b[e] !== void 0 ? b[e] : "", c.removeAttribute("id"), c.placeholder = h + " translation", c.setAttribute("data-ln-translatable-lang", p);
      const s = n.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), a = s.length > 0 ? s[s.length - 1] : r;
      a.parentNode.insertBefore(c, a.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: p,
      langName: h
    });
  }, g.prototype.removeLanguage = function(p) {
    if (!this.activeLanguages.has(p) || K(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: p
    }).defaultPrevented) return;
    const h = this.dom.querySelectorAll('[data-ln-translatable-lang="' + p + '"]');
    for (const i of h)
      i.parentNode.removeChild(i);
    this.activeLanguages.delete(p), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: p
    });
  }, g.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, g.prototype.hasLanguage = function(p) {
    return this.activeLanguages.has(p);
  }, g.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const p = this.defaultLang, b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const h of b)
      h.getAttribute("data-ln-translatable-lang") !== p && h.parentNode.removeChild(h);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[l];
  }, V(u, l, g, "ln-translations");
})();
(function() {
  const u = "data-ln-autosave", l = "lnAutosave", v = "data-ln-autosave-clear", g = "ln-autosave:";
  if (window[l] !== void 0) return;
  function p(i) {
    const t = b(i);
    if (!t) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", i);
      return;
    }
    this.dom = i, this.key = t;
    const n = this;
    return this._onFocusout = function(e) {
      const o = e.target;
      h(o) && o.name && n.save();
    }, this._onChange = function(e) {
      const o = e.target;
      h(o) && o.name && n.save();
    }, this._onSubmit = function() {
      n.clear();
    }, this._onReset = function() {
      n.clear();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + v + "]") && n.clear();
    }, i.addEventListener("focusout", this._onFocusout), i.addEventListener("change", this._onChange), i.addEventListener("submit", this._onSubmit), i.addEventListener("reset", this._onReset), i.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  p.prototype.save = function() {
    const i = St(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(i));
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:saved", { target: this.dom, data: i });
  }, p.prototype.restore = function() {
    let i;
    try {
      i = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (!i) return;
    let t;
    try {
      t = JSON.parse(i);
    } catch {
      return;
    }
    if (K(this.dom, "ln-autosave:before-restore", { target: this.dom, data: t }).defaultPrevented) return;
    const e = Lt(this.dom, t);
    for (let o = 0; o < e.length; o++)
      e[o].dispatchEvent(new Event("input", { bubbles: !0 })), e[o].dispatchEvent(new Event("change", { bubbles: !0 })), e[o].lnSelect && e[o].lnSelect.setValue && e[o].lnSelect.setValue(t[e[o].name]);
    T(this.dom, "ln-autosave:restored", { target: this.dom, data: t });
  }, p.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function b(i) {
    const n = i.getAttribute(u) || i.id;
    return n ? g + window.location.pathname + ":" + n : null;
  }
  function h(i) {
    const t = i.tagName;
    return t === "INPUT" || t === "TEXTAREA" || t === "SELECT";
  }
  V(u, l, p, "ln-autosave");
})();
(function() {
  const u = "data-ln-autoresize", l = "lnAutoresize";
  if (window[l] !== void 0) return;
  function v(g) {
    if (g.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", g.tagName), this;
    this.dom = g;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, g.addEventListener("input", this._onInput), this._resize(), this;
  }
  v.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, v.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[l]);
  }, V(u, l, v, "ln-autoresize");
})();
(function() {
  const u = "data-ln-validate", l = "lnValidate", v = "data-ln-validate-errors", g = "data-ln-validate-error", p = "ln-validate-valid", b = "ln-validate-invalid", h = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[l] !== void 0) return;
  function i(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, e = t.tagName, o = t.type, r = e === "SELECT" || o === "checkbox" || o === "radio";
    return this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(c) {
      const s = c.detail && c.detail.error;
      if (!s) return;
      n._customErrors.add(s), n._touched = !0;
      const a = t.closest(".form-element");
      if (a) {
        const m = a.querySelector("[" + g + '="' + s + '"]');
        m && m.classList.remove("hidden");
      }
      t.classList.remove(p), t.classList.add(b);
    }, this._onClearCustom = function(c) {
      const s = c.detail && c.detail.error, a = t.closest(".form-element");
      if (s) {
        if (n._customErrors.delete(s), a) {
          const m = a.querySelector("[" + g + '="' + s + '"]');
          m && m.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(m) {
          if (a) {
            const d = a.querySelector("[" + g + '="' + m + '"]');
            d && d.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, r || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  i.prototype.validate = function() {
    const t = this.dom, n = t.validity, o = t.checkValidity() && this._customErrors.size === 0, r = t.closest(".form-element");
    if (r) {
      const s = r.querySelector("[" + v + "]");
      if (s) {
        const a = s.querySelectorAll("[" + g + "]");
        for (let m = 0; m < a.length; m++) {
          const d = a[m].getAttribute(g), _ = h[d];
          _ && (n[_] ? a[m].classList.remove("hidden") : a[m].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(p, o), t.classList.toggle(b, !o), T(t, o ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), o;
  }, i.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, b);
    const t = this.dom.closest(".form-element");
    if (t) {
      const n = t.querySelectorAll("[" + g + "]");
      for (let e = 0; e < n.length; e++)
        n[e].classList.add("hidden");
    }
  }, Object.defineProperty(i.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), i.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(p, b), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[l]);
  }, V(u, l, i, "ln-validate");
})();
(function() {
  const u = "data-ln-form", l = "lnForm", v = "data-ln-form-auto", g = "data-ln-form-debounce", p = "data-ln-validate", b = "lnValidate";
  if (window[l] !== void 0) return;
  function h(i) {
    this.dom = i, this._invalidFields = /* @__PURE__ */ new Set(), this._debounceTimer = null;
    const t = this;
    if (this._onValid = function(n) {
      t._invalidFields.delete(n.detail.field), t._updateSubmitButton();
    }, this._onInvalid = function(n) {
      t._invalidFields.add(n.detail.field), t._updateSubmitButton();
    }, this._onSubmit = function(n) {
      n.preventDefault(), t.submit();
    }, this._onFill = function(n) {
      n.detail && t.fill(n.detail);
    }, this._onFormReset = function() {
      t.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        t._resetValidation();
      }, 0);
    }, i.addEventListener("ln-validate:valid", this._onValid), i.addEventListener("ln-validate:invalid", this._onInvalid), i.addEventListener("submit", this._onSubmit), i.addEventListener("ln-form:fill", this._onFill), i.addEventListener("ln-form:reset", this._onFormReset), i.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, i.hasAttribute(v)) {
      const n = parseInt(i.getAttribute(g)) || 0;
      this._onAutoInput = function() {
        n > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, n)) : t.submit();
      }, i.addEventListener("input", this._onAutoInput), i.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  h.prototype._updateSubmitButton = function() {
    const i = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!i.length) return;
    const t = this.dom.querySelectorAll("[" + p + "]");
    let n = !1;
    if (t.length > 0) {
      let e = !1, o = !1;
      for (let r = 0; r < t.length; r++) {
        const c = t[r][b];
        c && c._touched && (e = !0), t[r].checkValidity() || (o = !0);
      }
      n = o || !e;
    }
    for (let e = 0; e < i.length; e++)
      i[e].disabled = n;
  }, h.prototype.fill = function(i) {
    const t = Lt(this.dom, i);
    for (let n = 0; n < t.length; n++) {
      const e = t[n], o = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(o ? "change" : "input", { bubbles: !0 }));
    }
  }, h.prototype.submit = function() {
    const i = this.dom.querySelectorAll("[" + p + "]");
    let t = !0;
    for (let e = 0; e < i.length; e++) {
      const o = i[e][b];
      o && (o.validate() || (t = !1));
    }
    if (!t) return;
    const n = St(this.dom);
    T(this.dom, "ln-form:submit", { data: n });
  }, h.prototype.reset = function() {
    this.dom.reset(), this._resetValidation();
  }, h.prototype._resetValidation = function() {
    this._invalidFields.clear();
    const i = this.dom.querySelectorAll("[" + p + "]");
    for (let t = 0; t < i.length; t++) {
      const n = i[t][b];
      n && n.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(h.prototype, "isValid", {
    get: function() {
      const i = this.dom.querySelectorAll("[" + p + "]");
      for (let t = 0; t < i.length; t++)
        if (!i[t].checkValidity()) return !1;
      return !0;
    }
  }), h.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[l]);
  }, V(u, l, h, "ln-form");
})();
(function() {
  const u = "data-ln-time", l = "lnTime";
  if (window[l] !== void 0) return;
  const v = {}, g = {};
  function p(w) {
    return w.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function b(w, A) {
    const C = (w || "") + "|" + JSON.stringify(A);
    return v[C] || (v[C] = new Intl.DateTimeFormat(w, A)), v[C];
  }
  function h(w) {
    const A = w || "";
    return g[A] || (g[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), g[A];
  }
  const i = /* @__PURE__ */ new Set();
  let t = null;
  function n() {
    t || (t = setInterval(o, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function o() {
    for (const w of i) {
      if (!document.body.contains(w.dom)) {
        i.delete(w);
        continue;
      }
      d(w);
    }
    i.size === 0 && e();
  }
  function r(w, A) {
    return b(A, { dateStyle: "long", timeStyle: "short" }).format(w);
  }
  function c(w, A) {
    const C = /* @__PURE__ */ new Date(), k = { month: "short", day: "numeric" };
    return w.getFullYear() !== C.getFullYear() && (k.year = "numeric"), b(A, k).format(w);
  }
  function s(w, A) {
    return b(A, { dateStyle: "medium" }).format(w);
  }
  function a(w, A) {
    return b(A, { timeStyle: "short" }).format(w);
  }
  function m(w, A) {
    const C = Math.floor(Date.now() / 1e3), D = Math.floor(w.getTime() / 1e3) - C, M = Math.abs(D);
    if (M < 10) return h(A).format(0, "second");
    let F, U;
    if (M < 60)
      F = "second", U = D;
    else if (M < 3600)
      F = "minute", U = Math.round(D / 60);
    else if (M < 86400)
      F = "hour", U = Math.round(D / 3600);
    else if (M < 604800)
      F = "day", U = Math.round(D / 86400);
    else if (M < 2592e3)
      F = "week", U = Math.round(D / 604800);
    else
      return c(w, A);
    return h(A).format(U, F);
  }
  function d(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const C = Number(A);
    if (isNaN(C)) return;
    const k = new Date(C * 1e3), D = w.dom.getAttribute(u) || "short", M = p(w.dom);
    let F;
    switch (D) {
      case "relative":
        F = m(k, M);
        break;
      case "full":
        F = r(k, M);
        break;
      case "date":
        F = s(k, M);
        break;
      case "time":
        F = a(k, M);
        break;
      default:
        F = c(k, M);
        break;
    }
    w.dom.textContent = F, D !== "full" && (w.dom.title = r(k, M));
  }
  function _(w) {
    return this.dom = w, d(this), w.getAttribute(u) === "relative" && (i.add(this), n()), this;
  }
  _.prototype.render = function() {
    d(this);
  }, _.prototype.destroy = function() {
    i.delete(this), i.size === 0 && e(), delete this.dom[l];
  };
  function E(w) {
    P(w, u, l, _);
  }
  function y() {
    H(function() {
      new MutationObserver(function(A) {
        for (const C of A)
          if (C.type === "childList")
            for (const k of C.addedNodes)
              k.nodeType === 1 && P(k, u, l, _);
          else if (C.type === "attributes") {
            const k = C.target;
            k[l] ? (k.getAttribute(u) === "relative" ? (i.add(k[l]), n()) : (i.delete(k[l]), i.size === 0 && e()), d(k[l])) : P(k, u, l, _);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "datetime"]
      });
    }, "ln-time");
  }
  y(), window[l] = E, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const u = "data-ln-store", l = "lnStore";
  if (window[l] !== void 0) return;
  const v = "ln_app_cache", g = "_meta", p = "1.0";
  let b = null, h = null;
  const i = {};
  function t() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(L) {
        const S = Math.random() * 16 | 0;
        return (L === "x" ? S : S & 3 | 8).toString(16);
      });
    }
  }
  function n(f) {
    f && f.name === "QuotaExceededError" && T(document, "ln-store:quota-exceeded", { error: f });
  }
  function e() {
    const f = document.querySelectorAll("[" + u + "]"), L = {};
    for (let S = 0; S < f.length; S++) {
      const O = f[S].getAttribute(u);
      O && (L[O] = {
        indexes: (f[S].getAttribute("data-ln-store-indexes") || "").split(",").map(function(I) {
          return I.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function o() {
    return h || (h = new Promise(function(f, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), f(null);
        return;
      }
      const S = e(), O = Object.keys(S), I = indexedDB.open(v);
      I.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), f(null);
      }, I.onsuccess = function(x) {
        const N = x.target.result, q = Array.from(N.objectStoreNames);
        let z = !1;
        q.indexOf(g) === -1 && (z = !0);
        for (let Q = 0; Q < O.length; Q++)
          if (q.indexOf(O[Q]) === -1) {
            z = !0;
            break;
          }
        if (!z) {
          r(N), b = N, f(N);
          return;
        }
        const lt = N.version;
        N.close();
        const ht = indexedDB.open(v, lt + 1);
        ht.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, ht.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), f(null);
        }, ht.onupgradeneeded = function(Q) {
          const J = Q.target.result;
          J.objectStoreNames.contains(g) || J.createObjectStore(g, { keyPath: "key" });
          for (let gt = 0; gt < O.length; gt++) {
            const bt = O[gt];
            if (!J.objectStoreNames.contains(bt)) {
              const Ct = J.createObjectStore(bt, { keyPath: "id" }), _t = S[bt].indexes;
              for (let pt = 0; pt < _t.length; pt++)
                Ct.createIndex(_t[pt], _t[pt], { unique: !1 });
            }
          }
        }, ht.onsuccess = function(Q) {
          const J = Q.target.result;
          r(J), b = J, f(J);
        };
      };
    }), h);
  }
  function r(f) {
    f.onversionchange = function() {
      f.close(), b = null, h = null;
    };
  }
  function c() {
    return b ? Promise.resolve(b) : (h = null, o());
  }
  function s(f, L) {
    return c().then(function(S) {
      return S ? S.transaction(f, L).objectStore(f) : null;
    });
  }
  function a(f) {
    return new Promise(function(L, S) {
      f.onsuccess = function() {
        L(f.result);
      }, f.onerror = function() {
        n(f.error), S(f.error);
      };
    });
  }
  function m(f) {
    return s(f, "readonly").then(function(L) {
      return L ? a(L.getAll()) : [];
    });
  }
  function d(f, L) {
    return s(f, "readonly").then(function(S) {
      return S ? a(S.get(L)) : null;
    });
  }
  function _(f, L) {
    return s(f, "readwrite").then(function(S) {
      if (S)
        return a(S.put(L));
    });
  }
  function E(f, L) {
    return s(f, "readwrite").then(function(S) {
      if (S)
        return a(S.delete(L));
    });
  }
  function y(f) {
    return s(f, "readwrite").then(function(L) {
      if (L)
        return a(L.clear());
    });
  }
  function w(f) {
    return s(f, "readonly").then(function(L) {
      return L ? a(L.count()) : 0;
    });
  }
  function A(f) {
    return s(g, "readonly").then(function(L) {
      return L ? a(L.get(f)) : null;
    });
  }
  function C(f, L) {
    return s(g, "readwrite").then(function(S) {
      if (S)
        return L.key = f, a(S.put(L));
    });
  }
  function k(f) {
    this.dom = f, this._name = f.getAttribute(u), this._endpoint = f.getAttribute("data-ln-store-endpoint") || "";
    const L = f.getAttribute("data-ln-store-stale"), S = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(S) ? 300 : S, this._searchFields = (f.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(I) {
      return I.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, i[this._name] = this;
    const O = this;
    return D(O), ut(O), this;
  }
  function D(f) {
    f._handlers = {
      create: function(L) {
        M(f, L.detail);
      },
      update: function(L) {
        F(f, L.detail);
      },
      delete: function(L) {
        U(f, L.detail);
      },
      bulkDelete: function(L) {
        dt(f, L.detail);
      }
    }, f.dom.addEventListener("ln-store:request-create", f._handlers.create), f.dom.addEventListener("ln-store:request-update", f._handlers.update), f.dom.addEventListener("ln-store:request-delete", f._handlers.delete), f.dom.addEventListener("ln-store:request-bulk-delete", f._handlers.bulkDelete);
  }
  function M(f, L) {
    const S = L.data || {}, O = "_temp_" + t(), I = Object.assign({}, S, { id: O });
    _(f._name, I).then(function() {
      return f.totalCount++, T(f.dom, "ln-store:created", {
        store: f._name,
        record: I,
        tempId: O
      }), fetch(f._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(S)
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      return x.json();
    }).then(function(x) {
      return E(f._name, O).then(function() {
        return _(f._name, x);
      }).then(function() {
        T(f.dom, "ln-store:confirmed", {
          store: f._name,
          record: x,
          tempId: O,
          action: "create"
        });
      });
    }).catch(function(x) {
      E(f._name, O).then(function() {
        f.totalCount--, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: I,
          action: "create",
          error: x.message
        });
      });
    });
  }
  function F(f, L) {
    const S = L.id, O = L.data || {}, I = L.expected_version;
    let x = null;
    d(f._name, S).then(function(N) {
      if (!N) throw new Error("Record not found: " + S);
      x = Object.assign({}, N);
      const q = Object.assign({}, N, O);
      return _(f._name, q).then(function() {
        return T(f.dom, "ln-store:updated", {
          store: f._name,
          record: q,
          previous: x
        }), q;
      });
    }).then(function(N) {
      const q = Object.assign({}, O);
      return I && (q.expected_version = I), fetch(f._endpoint + "/" + S, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(q)
      });
    }).then(function(N) {
      if (N.status === 409)
        return N.json().then(function(q) {
          return _(f._name, x).then(function() {
            T(f.dom, "ln-store:conflict", {
              store: f._name,
              local: x,
              remote: q.current || q,
              field_diffs: q.field_diffs || null
            });
          });
        });
      if (!N.ok) throw new Error("HTTP " + N.status);
      return N.json().then(function(q) {
        return _(f._name, q).then(function() {
          T(f.dom, "ln-store:confirmed", {
            store: f._name,
            record: q,
            action: "update"
          });
        });
      });
    }).catch(function(N) {
      x && _(f._name, x).then(function() {
        T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: x,
          action: "update",
          error: N.message
        });
      });
    });
  }
  function U(f, L) {
    const S = L.id;
    let O = null;
    d(f._name, S).then(function(I) {
      if (I)
        return O = Object.assign({}, I), E(f._name, S).then(function() {
          return f.totalCount--, T(f.dom, "ln-store:deleted", {
            store: f._name,
            id: S
          }), fetch(f._endpoint + "/" + S, {
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
      O && _(f._name, O).then(function() {
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
    const S = L.ids || [];
    if (S.length === 0) return;
    let O = [];
    const I = S.map(function(x) {
      return d(f._name, x);
    });
    Promise.all(I).then(function(x) {
      return O = x.filter(Boolean), it(f._name, S).then(function() {
        return f.totalCount -= S.length, T(f.dom, "ln-store:deleted", {
          store: f._name,
          ids: S
        }), fetch(f._endpoint + "/bulk-delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ids: S })
        });
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      T(f.dom, "ln-store:confirmed", {
        store: f._name,
        record: null,
        ids: S,
        action: "bulk-delete"
      });
    }).catch(function(x) {
      O.length > 0 && nt(f._name, O).then(function() {
        f.totalCount += O.length, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: null,
          ids: S,
          action: "bulk-delete",
          error: x.message
        });
      });
    });
  }
  function ut(f) {
    o().then(function() {
      return A(f._name);
    }).then(function(L) {
      L && L.schema_version === p ? (f.lastSyncedAt = L.last_synced_at || null, f.totalCount = L.record_count || 0, f.totalCount > 0 ? (f.isLoaded = !0, T(f.dom, "ln-store:ready", {
        store: f._name,
        count: f.totalCount,
        source: "cache"
      }), ot(f) && et(f)) : X(f)) : L && L.schema_version !== p ? y(f._name).then(function() {
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
  function ot(f) {
    return f._staleThreshold === -1 ? !1 : f.lastSyncedAt ? Math.floor(Date.now() / 1e3) - f.lastSyncedAt > f._staleThreshold : !0;
  }
  function X(f) {
    return f._endpoint ? (f.isSyncing = !0, f._abortController = new AbortController(), fetch(f._endpoint, { signal: f._abortController.signal }).then(function(L) {
      if (!L.ok) throw new Error("HTTP " + L.status);
      return L.json();
    }).then(function(L) {
      const S = L.data || [], O = L.synced_at || Math.floor(Date.now() / 1e3);
      return nt(f._name, S).then(function() {
        return C(f._name, {
          schema_version: p,
          last_synced_at: O,
          record_count: S.length
        });
      }).then(function() {
        f.isLoaded = !0, f.isSyncing = !1, f.lastSyncedAt = O, f.totalCount = S.length, f._abortController = null, T(f.dom, "ln-store:loaded", {
          store: f._name,
          count: S.length
        }), T(f.dom, "ln-store:ready", {
          store: f._name,
          count: S.length,
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
    return fetch(L, { signal: f._abortController.signal }).then(function(S) {
      if (!S.ok) throw new Error("HTTP " + S.status);
      return S.json();
    }).then(function(S) {
      const O = S.data || [], I = S.deleted || [], x = S.synced_at || Math.floor(Date.now() / 1e3), N = O.length > 0 || I.length > 0;
      let q = Promise.resolve();
      return O.length > 0 && (q = q.then(function() {
        return nt(f._name, O);
      })), I.length > 0 && (q = q.then(function() {
        return it(f._name, I);
      })), q.then(function() {
        return w(f._name);
      }).then(function(z) {
        return f.totalCount = z, C(f._name, {
          schema_version: p,
          last_synced_at: x,
          record_count: z
        });
      }).then(function() {
        f.isSyncing = !1, f.lastSyncedAt = x, f._abortController = null, T(f.dom, "ln-store:synced", {
          store: f._name,
          added: O.length,
          deleted: I.length,
          changed: N
        });
      });
    }).catch(function(S) {
      f.isSyncing = !1, f._abortController = null, S.name !== "AbortError" && T(f.dom, "ln-store:offline", { store: f._name });
    });
  }
  function nt(f, L) {
    return c().then(function(S) {
      if (S)
        return new Promise(function(O, I) {
          const x = S.transaction(f, "readwrite"), N = x.objectStore(f);
          for (let q = 0; q < L.length; q++)
            N.put(L[q]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            n(x.error), I(x.error);
          };
        });
    });
  }
  function it(f, L) {
    return c().then(function(S) {
      if (S)
        return new Promise(function(O, I) {
          const x = S.transaction(f, "readwrite"), N = x.objectStore(f);
          for (let q = 0; q < L.length; q++)
            N.delete(L[q]);
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
    const f = Object.keys(i);
    for (let L = 0; L < f.length; L++) {
      const S = i[f[L]];
      S.isLoaded && !S.isSyncing && ot(S) && et(S);
    }
  }, document.addEventListener("visibilitychange", R);
  const B = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function j(f, L) {
    if (!L || !L.field) return f;
    const S = L.field, O = L.direction === "desc";
    return f.slice().sort(function(I, x) {
      const N = I[S], q = x[S];
      if (N == null && q == null) return 0;
      if (N == null) return O ? 1 : -1;
      if (q == null) return O ? -1 : 1;
      let z;
      return typeof N == "string" && typeof q == "string" ? z = B.compare(N, q) : z = N < q ? -1 : N > q ? 1 : 0, O ? -z : z;
    });
  }
  function G(f, L) {
    if (!L) return f;
    const S = Object.keys(L);
    return S.length === 0 ? f : f.filter(function(O) {
      for (let I = 0; I < S.length; I++) {
        const x = S[I], N = L[x];
        if (!Array.isArray(N) || N.length === 0) continue;
        const q = O[x];
        let z = !1;
        for (let lt = 0; lt < N.length; lt++)
          if (String(q) === String(N[lt])) {
            z = !0;
            break;
          }
        if (!z) return !1;
      }
      return !0;
    });
  }
  function ft(f, L, S) {
    if (!L || !S || S.length === 0) return f;
    const O = L.toLowerCase();
    return f.filter(function(I) {
      for (let x = 0; x < S.length; x++) {
        const N = I[S[x]];
        if (N != null && String(N).toLowerCase().indexOf(O) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function W(f, L, S) {
    if (f.length === 0) return 0;
    if (S === "count") return f.length;
    let O = 0, I = 0;
    for (let x = 0; x < f.length; x++) {
      const N = parseFloat(f[x][L]);
      isNaN(N) || (O += N, I++);
    }
    return S === "sum" ? O : S === "avg" && I > 0 ? O / I : 0;
  }
  k.prototype.getAll = function(f) {
    const L = this;
    return f = f || {}, m(L._name).then(function(S) {
      const O = S.length;
      f.filters && (S = G(S, f.filters)), f.search && (S = ft(S, f.search, L._searchFields));
      const I = S.length;
      if (f.sort && (S = j(S, f.sort)), f.offset || f.limit) {
        const x = f.offset || 0, N = f.limit || S.length;
        S = S.slice(x, x + N);
      }
      return {
        data: S,
        total: O,
        filtered: I
      };
    });
  }, k.prototype.getById = function(f) {
    return d(this._name, f);
  }, k.prototype.count = function(f) {
    const L = this;
    return f ? m(L._name).then(function(S) {
      return G(S, f).length;
    }) : w(L._name);
  }, k.prototype.aggregate = function(f, L) {
    return m(this._name).then(function(O) {
      return W(O, f, L);
    });
  }, k.prototype.forceSync = function() {
    return et(this);
  }, k.prototype.fullReload = function() {
    const f = this;
    return y(f._name).then(function() {
      return f.isLoaded = !1, f.lastSyncedAt = null, f.totalCount = 0, X(f);
    });
  }, k.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete i[this._name], Object.keys(i).length === 0 && R && (document.removeEventListener("visibilitychange", R), R = null), delete this.dom[l], T(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function rt() {
    return c().then(function(f) {
      if (!f) return;
      const L = Array.from(f.objectStoreNames);
      return new Promise(function(S, O) {
        const I = f.transaction(L, "readwrite");
        for (let x = 0; x < L.length; x++)
          I.objectStore(L[x]).clear();
        I.oncomplete = function() {
          S();
        }, I.onerror = function() {
          O(I.error);
        };
      });
    }).then(function() {
      const f = Object.keys(i);
      for (let L = 0; L < f.length; L++) {
        const S = i[f[L]];
        S.isLoaded = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      }
    });
  }
  function Y(f) {
    P(f, u, l, k);
  }
  function st() {
    H(function() {
      new MutationObserver(function(L) {
        for (let S = 0; S < L.length; S++) {
          const O = L[S];
          if (O.type === "childList")
            for (let I = 0; I < O.addedNodes.length; I++) {
              const x = O.addedNodes[I];
              x.nodeType === 1 && P(x, u, l, k);
            }
          else O.type === "attributes" && P(O.target, u, l, k);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-store");
  }
  window[l] = { init: Y, clearAll: rt }, st(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    Y(document.body);
  }) : Y(document.body);
})();
(function() {
  const u = "data-ln-data-table", l = "lnDataTable";
  if (window[l] !== void 0) return;
  const p = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function b(i) {
    return p ? p.format(i) : String(i);
  }
  function h(i) {
    this.dom = i, this.name = i.getAttribute(u) || "", this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-data-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._totalSpan = i.querySelector("[data-ln-data-table-total]"), this._filteredSpan = i.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = i.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== i ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const t = this;
    if (this._onSetData = function(n) {
      const e = n.detail || {};
      t._data = e.data || [], t._lastTotal = e.total != null ? e.total : t._data.length, t._lastFiltered = e.filtered != null ? e.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._vStart = -1, t._vEnd = -1, t._renderRows(), t._updateFooter(), T(i, "ln-data-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, i.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(n) {
      const e = n.detail && n.detail.loading;
      i.classList.toggle("ln-data-table--loading", !!e), e && (t.isLoaded = !1);
    }, i.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(i.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(n) {
      const e = n.target.closest("[data-ln-col-sort]");
      if (!e) return;
      const o = e.closest("th");
      if (!o) return;
      const r = o.getAttribute("data-ln-col");
      r && t._handleSort(r, o);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(n) {
      const e = n.target.closest("[data-ln-col-filter]");
      if (!e) return;
      n.stopPropagation();
      const o = e.closest("th");
      if (!o) return;
      const r = o.getAttribute("data-ln-col");
      if (r) {
        if (t._activeDropdown && t._activeDropdown.field === r) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(r, o, e);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(n) {
      n.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), T(i, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, i.addEventListener("click", this._onClearAll), this._selectable = i.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(n) {
        const e = n.target.closest("[data-ln-row-select]");
        if (!e) return;
        const o = e.closest("[data-ln-row]");
        if (!o) return;
        const r = o.getAttribute("data-ln-row-id");
        r != null && (e.checked ? (t.selectedIds.add(r), o.classList.add("ln-row-selected")) : (t.selectedIds.delete(r), o.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), T(i, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = i.querySelector('[data-ln-col-select] input[type="checkbox"]') || i.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const n = document.createElement("input");
        n.type = "checkbox", n.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(n), this._selectAllCheckbox = n;
      }
      if (this._selectAllCheckbox && (this._onSelectAll = function() {
        const n = t._selectAllCheckbox.checked, e = t.tbody ? t.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let o = 0; o < e.length; o++) {
          const r = e[o].getAttribute("data-ln-row-id"), c = e[o].querySelector("[data-ln-row-select]");
          r != null && (n ? (t.selectedIds.add(r), e[o].classList.add("ln-row-selected")) : (t.selectedIds.delete(r), e[o].classList.remove("ln-row-selected")), c && (c.checked = n));
        }
        t.selectedCount = t.selectedIds.size, T(i, "ln-data-table:select-all", {
          table: t.name,
          selected: n
        }), T(i, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }), t._updateFooter();
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
        const n = this.tbody.querySelectorAll("[data-ln-row]");
        for (let e = 0; e < n.length; e++) {
          const o = n[e].querySelector("[data-ln-row-select]"), r = n[e].getAttribute("data-ln-row-id");
          o && o.checked && r != null && (this.selectedIds.add(r), n[e].classList.add("ln-row-selected"));
        }
        this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
      }
    }
    return this._onRowClick = function(n) {
      if (n.target.closest("[data-ln-row-select]") || n.target.closest("[data-ln-row-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const e = n.target.closest("[data-ln-row]");
      if (!e) return;
      const o = e.getAttribute("data-ln-row-id"), r = e._lnRecord || {};
      T(i, "ln-data-table:row-click", {
        table: t.name,
        id: o,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(n) {
      const e = n.target.closest("[data-ln-row-action]");
      if (!e) return;
      n.stopPropagation();
      const o = e.closest("[data-ln-row]");
      if (!o) return;
      const r = e.getAttribute("data-ln-row-action"), c = o.getAttribute("data-ln-row-id"), s = o._lnRecord || {};
      T(i, "ln-data-table:row-action", {
        table: t.name,
        id: c,
        action: r,
        record: s
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = i.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, T(i, "ln-data-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(n) {
      if (!i.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (n.key === "/") {
        t._searchInput && (n.preventDefault(), t._searchInput.focus());
        return;
      }
      const e = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (e.length)
        switch (n.key) {
          case "ArrowDown":
            n.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, e.length - 1), t._focusRow(e);
            break;
          case "ArrowUp":
            n.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(e);
            break;
          case "Home":
            n.preventDefault(), t._focusedRowIndex = 0, t._focusRow(e);
            break;
          case "End":
            n.preventDefault(), t._focusedRowIndex = e.length - 1, t._focusRow(e);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              n.preventDefault();
              const o = e[t._focusedRowIndex];
              T(i, "ln-data-table:row-click", {
                table: t.name,
                id: o.getAttribute("data-ln-row-id"),
                record: o._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              n.preventDefault();
              const o = e[t._focusedRowIndex].querySelector("[data-ln-row-select]");
              o && (o.checked = !o.checked, o.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            t._activeDropdown && t._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), T(i, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  h.prototype._handleSort = function(i, t) {
    let n;
    !this.currentSort || this.currentSort.field !== i ? n = "asc" : this.currentSort.direction === "asc" ? n = "desc" : n = null;
    for (let e = 0; e < this.ths.length; e++)
      this.ths[e].classList.remove("ln-sort-asc", "ln-sort-desc");
    n ? (this.currentSort = { field: i, direction: n }, t.classList.add(n === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: i,
      direction: n
    }), this._requestData();
  }, h.prototype._requestData = function() {
    T(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, h.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const i = this.tbody.querySelectorAll("[data-ln-row]");
    let t = i.length > 0;
    for (let n = 0; n < i.length; n++) {
      const e = i[n].getAttribute("data-ln-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, Object.defineProperty(h.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), h.prototype._focusRow = function(i) {
    for (let t = 0; t < i.length; t++)
      i[t].classList.remove("ln-row-focused"), i[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const t = i[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, h.prototype._openFilterDropdown = function(i, t, n) {
    this._closeFilterDropdown();
    const e = at(this.dom, this.name + "-column-filter", "ln-data-table") || at(this.dom, "column-filter", "ln-data-table");
    if (!e) return;
    const o = e.firstElementChild;
    if (!o) return;
    const r = this._getUniqueValues(i), c = o.querySelector("[data-ln-filter-options]"), s = o.querySelector("[data-ln-filter-search]"), a = this.currentFilters[i] || [], m = this;
    if (s && r.length <= 8 && s.classList.add("hidden"), c) {
      for (let _ = 0; _ < r.length; _++) {
        const E = r[_], y = document.createElement("li"), w = document.createElement("label"), A = document.createElement("input");
        A.type = "checkbox", A.value = E, A.checked = a.length === 0 || a.indexOf(E) !== -1, w.appendChild(A), w.appendChild(document.createTextNode(" " + E)), y.appendChild(w), c.appendChild(y);
      }
      c.addEventListener("change", function(_) {
        _.target.type === "checkbox" && m._onFilterChange(i, c);
      });
    }
    s && s.addEventListener("input", function() {
      const _ = s.value.toLowerCase(), E = c.querySelectorAll("li");
      for (let y = 0; y < E.length; y++) {
        const w = E[y].textContent.toLowerCase();
        E[y].classList.toggle("hidden", _ && w.indexOf(_) === -1);
      }
    });
    const d = o.querySelector("[data-ln-filter-clear]");
    d && d.addEventListener("click", function() {
      delete m.currentFilters[i], m._closeFilterDropdown(), m._updateFilterIndicators(), T(m.dom, "ln-data-table:filter", {
        table: m.name,
        field: i,
        values: []
      }), m._requestData();
    }), t.appendChild(o), this._activeDropdown = { field: i, th: t, el: o }, o.addEventListener("click", function(_) {
      _.stopPropagation();
    });
  }, h.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, h.prototype._onFilterChange = function(i, t) {
    const n = t.querySelectorAll('input[type="checkbox"]'), e = [];
    let o = !0;
    for (let r = 0; r < n.length; r++)
      n[r].checked ? e.push(n[r].value) : o = !1;
    o || e.length === 0 ? delete this.currentFilters[i] : this.currentFilters[i] = e, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: i,
      values: o ? [] : e
    }), this._requestData();
  }, h.prototype._getUniqueValues = function(i) {
    const t = {}, n = [], e = this._data;
    for (let o = 0; o < e.length; o++) {
      const r = e[o][i];
      r != null && !t[r] && (t[r] = !0, n.push(String(r)));
    }
    return n.sort(), n;
  }, h.prototype._updateFilterIndicators = function() {
    const i = this.ths;
    for (let t = 0; t < i.length; t++) {
      const n = i[t], e = n.getAttribute("data-ln-col");
      if (!e) continue;
      const o = n.querySelector("[data-ln-col-filter]");
      if (!o) continue;
      const r = this.currentFilters[e] && this.currentFilters[e].length > 0;
      o.classList.toggle("ln-filter-active", !!r);
    }
  }, h.prototype._renderRows = function() {
    if (!this.tbody) return;
    const i = this._data, t = this._lastTotal, n = this._lastFiltered;
    if (t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (i.length === 0 || n === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    i.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, h.prototype._renderAll = function() {
    const i = this._data, t = document.createDocumentFragment();
    for (let n = 0; n < i.length; n++) {
      const e = this._buildRow(i[n]);
      if (!e) break;
      t.appendChild(e);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, h.prototype._buildRow = function(i) {
    const t = at(this.dom, this.name + "-row", "ln-data-table");
    if (!t) return null;
    const n = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!n) return null;
    if (this._fillRow(n, i), n._lnRecord = i, i.id != null && n.setAttribute("data-ln-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      n.classList.add("ln-row-selected");
      const e = n.querySelector("[data-ln-row-select]");
      e && (e.checked = !0);
    }
    return n;
  }, h.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const i = this;
    if (!this._rowHeight) {
      const t = this._buildRow(this._data[0]);
      t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollHandler = function() {
      i._rafId || (i._rafId = requestAnimationFrame(function() {
        i._rafId = null, i._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, h.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, h.prototype._renderVirtual = function() {
    const i = this._data, t = i.length, n = this._rowHeight;
    if (!n || !t) return;
    const o = this.table.getBoundingClientRect().top + window.scrollY, r = this.thead ? this.thead.offsetHeight : 0, c = o + r, s = window.scrollY - c, a = Math.max(0, Math.floor(s / n) - 15), m = Math.min(a + Math.ceil(window.innerHeight / n) + 30, t);
    if (a === this._vStart && m === this._vEnd) return;
    this._vStart = a, this._vEnd = m;
    const d = this.ths.length || 1, _ = a * n, E = (t - m) * n, y = document.createDocumentFragment();
    if (_ > 0) {
      const w = document.createElement("tr");
      w.className = "ln-data-table__spacer", w.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", d), A.style.height = _ + "px", w.appendChild(A), y.appendChild(w);
    }
    for (let w = a; w < m; w++) {
      const A = this._buildRow(i[w]);
      A && y.appendChild(A);
    }
    if (E > 0) {
      const w = document.createElement("tr");
      w.className = "ln-data-table__spacer", w.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", d), A.style.height = E + "px", w.appendChild(A), y.appendChild(w);
    }
    this.tbody.textContent = "", this.tbody.appendChild(y), this._selectable && this._updateSelectAll();
  }, h.prototype._fillRow = function(i, t) {
    const n = i.querySelectorAll("[data-ln-cell]");
    for (let o = 0; o < n.length; o++) {
      const r = n[o], c = r.getAttribute("data-ln-cell");
      t[c] != null && (r.textContent = t[c]);
    }
    const e = i.querySelectorAll("[data-ln-cell-attr]");
    for (let o = 0; o < e.length; o++) {
      const r = e[o], c = r.getAttribute("data-ln-cell-attr").split(",");
      for (let s = 0; s < c.length; s++) {
        const a = c[s].trim().split(":");
        if (a.length !== 2) continue;
        const m = a[0].trim(), d = a[1].trim();
        t[m] != null && r.setAttribute(d, t[m]);
      }
    }
  }, h.prototype._showEmptyState = function(i) {
    const t = at(this.dom, i, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, h.prototype._updateFooter = function() {
    const i = this._lastTotal, t = this._lastFiltered, n = t < i;
    if (this._totalSpan && (this._totalSpan.textContent = b(i)), this._filteredSpan && (this._filteredSpan.textContent = n ? b(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n), this._selectedSpan) {
      const e = this.selectedIds.size;
      this._selectedSpan.textContent = e > 0 ? b(e) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, h.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[l]);
  }, V(u, l, h, "ln-data-table");
})();
(function() {
  const u = "ln-icons-sprite", l = "#ln-", v = "#lnc-", g = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let b = null;
  const h = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), i = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", n = "lni:v", e = "1";
  function o() {
    try {
      if (localStorage.getItem(n) !== e) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const E = localStorage.key(_);
          E && E.indexOf(t) === 0 && localStorage.removeItem(E);
        }
        localStorage.setItem(n, e);
      }
    } catch {
    }
  }
  o();
  function r() {
    return b || (b = document.getElementById(u), b || (b = document.createElementNS("http://www.w3.org/2000/svg", "svg"), b.id = u, b.setAttribute("hidden", ""), b.setAttribute("aria-hidden", "true"), b.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(b, document.body.firstChild))), b;
  }
  function c(_) {
    return _.indexOf(v) === 0 ? i + "/" + _.slice(v.length) + ".svg" : h + "/" + _.slice(l.length) + ".svg";
  }
  function s(_, E) {
    const y = E.match(/viewBox="([^"]+)"/), w = y ? y[1] : "0 0 24 24", A = E.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = A ? A[1].trim() : "", k = E.match(/<svg([^>]*)>/i), D = k ? k[1] : "", M = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    M.id = _, M.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(F) {
      const U = D.match(new RegExp(F + '="([^"]*)"'));
      U && M.setAttribute(F, U[1]);
    }), M.innerHTML = C, r().querySelector("defs").appendChild(M);
  }
  function a(_) {
    if (g.has(_) || p.has(_) || _.indexOf(v) === 0 && !i) return;
    const E = _.slice(1);
    try {
      const y = localStorage.getItem(t + E);
      if (y) {
        s(E, y), g.add(_);
        return;
      }
    } catch {
    }
    p.add(_), fetch(c(_)).then(function(y) {
      if (!y.ok) throw new Error(y.status);
      return y.text();
    }).then(function(y) {
      s(E, y), g.add(_), p.delete(_);
      try {
        localStorage.setItem(t + E, y);
      } catch {
      }
    }).catch(function() {
      p.delete(_);
    });
  }
  function m(_) {
    const E = 'use[href^="' + l + '"], use[href^="' + v + '"]', y = _.querySelectorAll ? _.querySelectorAll(E) : [];
    if (_.matches && _.matches(E)) {
      const w = _.getAttribute("href");
      w && a(w);
    }
    Array.prototype.forEach.call(y, function(w) {
      const A = w.getAttribute("href");
      A && a(A);
    });
  }
  function d() {
    m(document), new MutationObserver(function(_) {
      _.forEach(function(E) {
        if (E.type === "childList")
          E.addedNodes.forEach(function(y) {
            y.nodeType === 1 && m(y);
          });
        else if (E.type === "attributes" && E.attributeName === "href") {
          const y = E.target.getAttribute("href");
          y && (y.indexOf(l) === 0 || y.indexOf(v) === 0) && a(y);
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
