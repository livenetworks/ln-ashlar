const mt = {};
function pt(u, l) {
  mt[u] || (mt[u] = document.querySelector('[data-ln-template="' + u + '"]'));
  const v = mt[u];
  return v ? v.content.cloneNode(!0) : (console.warn("[" + (l || "ln-core") + '] Template "' + u + '" not found'), null);
}
function S(u, l, v) {
  u.dispatchEvent(new CustomEvent(l, {
    bubbles: !0,
    detail: v || {}
  }));
}
function K(u, l, v) {
  const p = new CustomEvent(l, {
    bubbles: !0,
    cancelable: !0,
    detail: v || {}
  });
  return u.dispatchEvent(p), p;
}
function $(u, l) {
  if (!u || !l) return u;
  const v = u.querySelectorAll("[data-ln-field]");
  for (let f = 0; f < v.length; f++) {
    const s = v[f], a = s.getAttribute("data-ln-field");
    l[a] != null && (s.textContent = l[a]);
  }
  const p = u.querySelectorAll("[data-ln-attr]");
  for (let f = 0; f < p.length; f++) {
    const s = p[f], a = s.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < a.length; o++) {
      const t = a[o].trim().split(":");
      if (t.length !== 2) continue;
      const e = t[0].trim(), n = t[1].trim();
      l[n] != null && s.setAttribute(e, l[n]);
    }
  }
  const _ = u.querySelectorAll("[data-ln-show]");
  for (let f = 0; f < _.length; f++) {
    const s = _[f], a = s.getAttribute("data-ln-show");
    a in l && s.classList.toggle("hidden", !l[a]);
  }
  const g = u.querySelectorAll("[data-ln-class]");
  for (let f = 0; f < g.length; f++) {
    const s = g[f], a = s.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < a.length; o++) {
      const t = a[o].trim().split(":");
      if (t.length !== 2) continue;
      const e = t[0].trim(), n = t[1].trim();
      n in l && s.classList.toggle(e, !!l[n]);
    }
  }
  return u;
}
function F(u, l) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      F(u, l);
    }), console.warn("[" + l + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  u();
}
function rt(u, l, v) {
  if (u) {
    const p = u.querySelector('[data-ln-template="' + l + '"]');
    if (p) return p.content.cloneNode(!0);
  }
  return pt(l, v);
}
function vt(u, l) {
  const v = {}, p = u.querySelectorAll("[" + l + "]");
  for (let _ = 0; _ < p.length; _++)
    v[p[_].getAttribute(l)] = p[_].textContent, p[_].remove();
  return v;
}
function D(u, l, v, p) {
  if (u.nodeType !== 1) return;
  const _ = Array.from(u.querySelectorAll("[" + l + "]"));
  u.hasAttribute && u.hasAttribute(l) && _.push(u);
  for (const g of _)
    g[v] || (g[v] = new p(g));
}
const gt = Symbol("deepReactive");
function yt(u, l) {
  function v(p) {
    if (p === null || typeof p != "object" || p[gt]) return p;
    const _ = Object.keys(p);
    for (let g = 0; g < _.length; g++) {
      const f = p[_[g]];
      f !== null && typeof f == "object" && (p[_[g]] = v(f));
    }
    return new Proxy(p, {
      get(g, f) {
        return f === gt ? !0 : g[f];
      },
      set(g, f, s) {
        const a = g[f];
        return s !== null && typeof s == "object" && (s = v(s)), g[f] = s, a !== s && l(), !0;
      },
      deleteProperty(g, f) {
        return f in g && (delete g[f], l()), !0;
      }
    });
  }
  return v(u);
}
function Et(u, l) {
  let v = !1;
  return function() {
    v || (v = !0, queueMicrotask(function() {
      v = !1, u(), l && l();
    }));
  };
}
const wt = "ln:";
function At() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function bt(u, l) {
  const v = l.getAttribute("data-ln-persist"), p = v !== null && v !== "" ? v : l.id;
  return p ? wt + u + ":" + At() + ":" + p : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', l), null);
}
function dt(u, l) {
  const v = bt(u, l);
  if (!v) return null;
  try {
    const p = localStorage.getItem(v);
    return p !== null ? JSON.parse(p) : null;
  } catch {
    return null;
  }
}
function Z(u, l, v) {
  const p = bt(u, l);
  if (p)
    try {
      localStorage.setItem(p, JSON.stringify(v));
    } catch {
    }
}
(function() {
  const u = "lnHttp";
  if (window[u] !== void 0) return;
  const l = {};
  document.addEventListener("ln-http:request", function(v) {
    const p = v.detail || {};
    if (!p.url) return;
    const _ = v.target, g = (p.method || (p.body ? "POST" : "GET")).toUpperCase(), f = p.abort, s = p.tag;
    let a = p.url;
    f && (l[f] && l[f].abort(), l[f] = new AbortController());
    const o = { Accept: "application/json" };
    p.ajax && (o["X-Requested-With"] = "XMLHttpRequest");
    const t = {
      method: g,
      credentials: "same-origin",
      headers: o
    };
    if (f && (t.signal = l[f].signal), p.body && g === "GET") {
      const e = new URLSearchParams();
      for (const i in p.body)
        p.body[i] != null && e.set(i, p.body[i]);
      const n = e.toString();
      n && (a += (a.includes("?") ? "&" : "?") + n);
    } else p.body && (o["Content-Type"] = "application/json", t.body = JSON.stringify(p.body));
    fetch(a, t).then(function(e) {
      f && delete l[f];
      const n = e.ok, i = e.status;
      return e.json().then(function(r) {
        return { ok: n, status: i, data: r };
      }).catch(function() {
        return { ok: !1, status: i, data: { error: !0, message: "Invalid response" } };
      });
    }).then(function(e) {
      e.tag = s;
      const n = e.ok ? "ln-http:success" : "ln-http:error";
      S(_, n, e);
    }).catch(function(e) {
      f && e.name !== "AbortError" && delete l[f], e.name !== "AbortError" && S(_, "ln-http:error", { tag: s, ok: !1, status: 0, data: { error: !0, message: "Network error" } });
    });
  }), window[u] = !0;
})();
(function() {
  const u = "data-ln-ajax", l = "lnAjax";
  if (window[l] !== void 0) return;
  function v(t) {
    if (!t.hasAttribute(u) || t[l]) return;
    t[l] = !0;
    const e = s(t);
    p(e.links), _(e.forms);
  }
  function p(t) {
    for (const e of t) {
      if (e[l + "Trigger"] || e.hostname && e.hostname !== window.location.hostname) continue;
      const n = e.getAttribute("href");
      if (n && n.includes("#")) continue;
      const i = function(r) {
        if (r.ctrlKey || r.metaKey || r.button === 1) return;
        r.preventDefault();
        const d = e.getAttribute("href");
        d && f("GET", d, null, e);
      };
      e.addEventListener("click", i), e[l + "Trigger"] = i;
    }
  }
  function _(t) {
    for (const e of t) {
      if (e[l + "Trigger"]) continue;
      const n = function(i) {
        i.preventDefault();
        const r = e.method.toUpperCase(), d = e.action, b = new FormData(e);
        for (const h of e.querySelectorAll('button, input[type="submit"]'))
          h.disabled = !0;
        f(r, d, b, e, function() {
          for (const h of e.querySelectorAll('button, input[type="submit"]'))
            h.disabled = !1;
        });
      };
      e.addEventListener("submit", n), e[l + "Trigger"] = n;
    }
  }
  function g(t) {
    if (!t[l]) return;
    const e = s(t);
    for (const n of e.links)
      n[l + "Trigger"] && (n.removeEventListener("click", n[l + "Trigger"]), delete n[l + "Trigger"]);
    for (const n of e.forms)
      n[l + "Trigger"] && (n.removeEventListener("submit", n[l + "Trigger"]), delete n[l + "Trigger"]);
    delete t[l];
  }
  function f(t, e, n, i, r) {
    if (K(i, "ln-ajax:before-start", { method: t, url: e }).defaultPrevented) return;
    S(i, "ln-ajax:start", { method: t, url: e }), i.classList.add("ln-ajax--loading");
    const b = document.createElement("span");
    b.className = "ln-ajax-spinner", i.appendChild(b);
    function h() {
      i.classList.remove("ln-ajax--loading");
      const A = i.querySelector(".ln-ajax-spinner");
      A && A.remove(), r && r();
    }
    let m = e;
    const E = document.querySelector('meta[name="csrf-token"]'), T = E ? E.getAttribute("content") : null;
    n instanceof FormData && T && n.append("_token", T);
    const L = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (T && (L.headers["X-CSRF-TOKEN"] = T), t === "GET" && n) {
      const A = new URLSearchParams(n);
      m = e + (e.includes("?") ? "&" : "?") + A.toString();
    } else t !== "GET" && n && (L.body = n);
    fetch(m, L).then(function(A) {
      const I = A.ok;
      return A.json().then(function(x) {
        return { ok: I, status: A.status, data: x };
      });
    }).then(function(A) {
      const I = A.data;
      if (A.ok) {
        if (I.title && (document.title = I.title), I.content)
          for (const x in I.content) {
            const P = document.getElementById(x);
            P && (P.innerHTML = I.content[x]);
          }
        if (i.tagName === "A") {
          const x = i.getAttribute("href");
          x && window.history.pushState({ ajax: !0 }, "", x);
        } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", m);
        S(i, "ln-ajax:success", { method: t, url: m, data: I });
      } else
        S(i, "ln-ajax:error", { method: t, url: m, status: A.status, data: I });
      if (I.message && window.lnToast) {
        const x = I.message;
        window.lnToast.enqueue({
          type: x.type || (A.ok ? "success" : "error"),
          title: x.title || "",
          message: x.body || ""
        });
      }
      S(i, "ln-ajax:complete", { method: t, url: m }), h();
    }).catch(function(A) {
      S(i, "ln-ajax:error", { method: t, url: m, error: A }), S(i, "ln-ajax:complete", { method: t, url: m }), h();
    });
  }
  function s(t) {
    const e = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(u) !== "false" ? e.links.push(t) : t.tagName === "FORM" && t.getAttribute(u) !== "false" ? e.forms.push(t) : (e.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), e.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), e;
  }
  function a() {
    F(function() {
      new MutationObserver(function(e) {
        for (const n of e)
          if (n.type === "childList") {
            for (const i of n.addedNodes)
              if (i.nodeType === 1 && (v(i), !i.hasAttribute(u))) {
                for (const d of i.querySelectorAll("[" + u + "]"))
                  v(d);
                const r = i.closest && i.closest("[" + u + "]");
                if (r && r.getAttribute(u) !== "false") {
                  const d = s(i);
                  p(d.links), _(d.forms);
                }
              }
          } else n.type === "attributes" && v(n.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-ajax");
  }
  function o() {
    for (const t of document.querySelectorAll("[" + u + "]"))
      v(t);
  }
  window[l] = v, window[l].destroy = g, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const u = "data-ln-modal", l = "lnModal";
  if (window[l] !== void 0) return;
  function v(o) {
    p(o), _(o);
  }
  function p(o) {
    const t = Array.from(o.querySelectorAll("[" + u + "]"));
    o.hasAttribute && o.hasAttribute(u) && t.push(o);
    for (const e of t)
      e[l] || (e[l] = new g(e));
  }
  function _(o) {
    const t = Array.from(o.querySelectorAll("[data-ln-modal-for]"));
    o.hasAttribute && o.hasAttribute("data-ln-modal-for") && t.push(o);
    for (const e of t)
      e[l + "Trigger"] || (e[l + "Trigger"] = !0, e.addEventListener("click", function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        n.preventDefault();
        const i = e.getAttribute("data-ln-modal-for"), r = document.getElementById(i);
        !r || !r[l] || r[l].toggle();
      }));
  }
  function g(o) {
    this.dom = o, this.isOpen = o.getAttribute(u) === "open";
    const t = this;
    return this._onEscape = function(e) {
      e.key === "Escape" && t.close();
    }, this._onFocusTrap = function(e) {
      if (e.key !== "Tab") return;
      const n = t.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (n.length === 0) return;
      const i = n[0], r = n[n.length - 1];
      e.shiftKey ? document.activeElement === i && (e.preventDefault(), r.focus()) : document.activeElement === r && (e.preventDefault(), i.focus());
    }, this._onClose = function(e) {
      e.preventDefault(), t.close();
    }, s(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  g.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(u, "open");
  }, g.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "close");
  }, g.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, g.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const o = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of o)
      t[l + "Close"] && (t.removeEventListener("click", t[l + "Close"]), delete t[l + "Close"]);
    S(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[l];
  };
  function f(o) {
    const t = o[l];
    if (!t) return;
    const n = o.getAttribute(u) === "open";
    if (n !== t.isOpen)
      if (n) {
        if (K(o, "ln-modal:before-open", { modalId: o.id, target: o }).defaultPrevented) {
          o.setAttribute(u, "close");
          return;
        }
        t.isOpen = !0, o.setAttribute("aria-modal", "true"), o.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", t._onEscape), document.addEventListener("keydown", t._onFocusTrap);
        const r = o.querySelector("[autofocus]");
        if (r)
          r.focus();
        else {
          const d = o.querySelector('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])');
          if (d) d.focus();
          else {
            const b = o.querySelector("a[href], button:not([disabled])");
            b && b.focus();
          }
        }
        S(o, "ln-modal:open", { modalId: o.id, target: o });
      } else {
        if (K(o, "ln-modal:before-close", { modalId: o.id, target: o }).defaultPrevented) {
          o.setAttribute(u, "open");
          return;
        }
        t.isOpen = !1, o.removeAttribute("aria-modal"), document.removeEventListener("keydown", t._onEscape), document.removeEventListener("keydown", t._onFocusTrap), S(o, "ln-modal:close", { modalId: o.id, target: o }), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function s(o) {
    const t = o.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of t)
      e[l + "Close"] || (e.addEventListener("click", o._onClose), e[l + "Close"] = o._onClose);
  }
  function a() {
    F(function() {
      new MutationObserver(function(t) {
        for (let e = 0; e < t.length; e++) {
          const n = t[e];
          if (n.type === "childList")
            for (let i = 0; i < n.addedNodes.length; i++) {
              const r = n.addedNodes[i];
              r.nodeType === 1 && (p(r), _(r));
            }
          else n.type === "attributes" && (n.attributeName === u && n.target[l] ? f(n.target) : (p(n.target), _(n.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "data-ln-modal-for"]
      });
    }, "ln-modal");
  }
  window[l] = v, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-nav", l = "lnNav";
  if (window[l] !== void 0) return;
  const v = /* @__PURE__ */ new WeakMap(), p = [];
  if (!history._lnNavPatched) {
    const t = history.pushState;
    history.pushState = function() {
      t.apply(history, arguments);
      for (const e of p)
        e();
    }, history._lnNavPatched = !0;
  }
  function _(t) {
    if (!t.hasAttribute(u) || v.has(t)) return;
    const e = t.getAttribute(u);
    if (!e) return;
    const n = g(t, e);
    v.set(t, n), t[l] = n;
  }
  function g(t, e) {
    let n = Array.from(t.querySelectorAll("a"));
    s(n, e, window.location.pathname);
    const i = function() {
      n = Array.from(t.querySelectorAll("a")), s(n, e, window.location.pathname);
    };
    window.addEventListener("popstate", i), p.push(i);
    const r = new MutationObserver(function(d) {
      for (const b of d)
        if (b.type === "childList") {
          for (const h of b.addedNodes)
            if (h.nodeType === 1) {
              if (h.tagName === "A")
                n.push(h), s([h], e, window.location.pathname);
              else if (h.querySelectorAll) {
                const m = Array.from(h.querySelectorAll("a"));
                n = n.concat(m), s(m, e, window.location.pathname);
              }
            }
          for (const h of b.removedNodes)
            if (h.nodeType === 1) {
              if (h.tagName === "A")
                n = n.filter(function(m) {
                  return m !== h;
                });
              else if (h.querySelectorAll) {
                const m = Array.from(h.querySelectorAll("a"));
                n = n.filter(function(E) {
                  return !m.includes(E);
                });
              }
            }
        }
    });
    return r.observe(t, { childList: !0, subtree: !0 }), {
      navElement: t,
      activeClass: e,
      observer: r,
      updateHandler: i,
      destroy: function() {
        r.disconnect(), window.removeEventListener("popstate", i);
        const d = p.indexOf(i);
        d !== -1 && p.splice(d, 1), v.delete(t), delete t[l];
      }
    };
  }
  function f(t) {
    try {
      return new URL(t, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return t.replace(/\/$/, "") || "/";
    }
  }
  function s(t, e, n) {
    const i = f(n);
    for (const r of t) {
      const d = r.getAttribute("href");
      if (!d) continue;
      const b = f(d);
      r.classList.remove(e);
      const h = b === i, m = b !== "/" && i.startsWith(b + "/");
      (h || m) && r.classList.add(e);
    }
  }
  function a() {
    F(function() {
      new MutationObserver(function(e) {
        for (const n of e)
          if (n.type === "childList") {
            for (const i of n.addedNodes)
              if (i.nodeType === 1 && (i.hasAttribute && i.hasAttribute(u) && _(i), i.querySelectorAll))
                for (const r of i.querySelectorAll("[" + u + "]"))
                  _(r);
          } else n.type === "attributes" && n.target.hasAttribute && n.target.hasAttribute(u) && _(n.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-nav");
  }
  window[l] = _;
  function o() {
    for (const t of document.querySelectorAll("[" + u + "]"))
      _(t);
  }
  a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const u = window.TomSelect;
  if (!u) {
    window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const l = /* @__PURE__ */ new WeakMap();
  function v(f) {
    if (l.has(f)) return;
    const s = f.getAttribute("data-ln-select");
    let a = {};
    if (s && s.trim() !== "")
      try {
        a = JSON.parse(s);
      } catch (e) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", e);
      }
    const t = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: f.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...a };
    try {
      const e = new u(f, t);
      l.set(f, e);
      const n = f.closest("form");
      n && n.addEventListener("reset", () => {
        setTimeout(() => {
          e.clear(), e.clearOptions(), e.sync();
        }, 0);
      });
    } catch (e) {
      console.warn("[ln-select] Failed to initialize Tom Select:", e);
    }
  }
  function p(f) {
    const s = l.get(f);
    s && (s.destroy(), l.delete(f));
  }
  function _() {
    for (const f of document.querySelectorAll("select[data-ln-select]"))
      v(f);
  }
  function g() {
    F(function() {
      new MutationObserver(function(s) {
        for (const a of s) {
          if (a.type === "attributes") {
            a.target.matches && a.target.matches("select[data-ln-select]") && v(a.target);
            continue;
          }
          for (const o of a.addedNodes)
            if (o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && v(o), o.querySelectorAll))
              for (const t of o.querySelectorAll("select[data-ln-select]"))
                v(t);
          for (const o of a.removedNodes)
            if (o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && p(o), o.querySelectorAll))
              for (const t of o.querySelectorAll("select[data-ln-select]"))
                p(t);
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
    _(), g();
  }) : (_(), g()), window.lnSelect = {
    initialize: v,
    destroy: p,
    getInstance: function(f) {
      return l.get(f);
    }
  };
})();
(function() {
  const u = "data-ln-tabs", l = "lnTabs";
  if (window[l] !== void 0 && window[l] !== null) return;
  function v(s = document.body) {
    D(s, u, l, _);
  }
  function p() {
    const s = (location.hash || "").replace("#", ""), a = {};
    if (!s) return a;
    for (const o of s.split("&")) {
      const t = o.indexOf(":");
      t > 0 && (a[o.slice(0, t)] = o.slice(t + 1));
    }
    return a;
  }
  function _(s) {
    return this.dom = s, g.call(this), this;
  }
  function g() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const a of this.tabs) {
      const o = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      o && (this.mapTabs[o] = a);
    }
    for (const a of this.panels) {
      const o = (a.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = a);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const s = this;
    this._clickHandlers = [];
    for (const a of this.tabs) {
      if (a[l + "Trigger"]) continue;
      a[l + "Trigger"] = !0;
      const o = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        const e = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (e)
          if (s.hashEnabled) {
            const n = p();
            n[s.nsKey] = e;
            const i = Object.keys(n).map(function(r) {
              return r + ":" + n[r];
            }).join("&");
            location.hash === "#" + i ? s.dom.setAttribute("data-ln-tabs-active", e) : location.hash = i;
          } else
            s.dom.setAttribute("data-ln-tabs-active", e);
      };
      a.addEventListener("click", o), s._clickHandlers.push({ el: a, handler: o });
    }
    if (this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const a = p();
      s.activate(s.nsKey in a ? a[s.nsKey] : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let a = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const o = dt("tabs", this.dom);
        o !== null && o in this.mapPanels && (a = o);
      }
      this.activate(a);
    }
  }
  _.prototype.activate = function(s) {
    (!s || !(s in this.mapPanels)) && (s = this.defaultKey), this.dom.setAttribute("data-ln-tabs-active", s);
  }, _.prototype._applyActive = function(s) {
    var a;
    (!s || !(s in this.mapPanels)) && (s = this.defaultKey);
    for (const o in this.mapTabs) {
      const t = this.mapTabs[o];
      o === s ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const o in this.mapPanels) {
      const t = this.mapPanels[o], e = o === s;
      t.classList.toggle("hidden", !e), t.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const o = (a = this.mapPanels[s]) == null ? void 0 : a.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      o && setTimeout(() => o.focus({ preventScroll: !0 }), 0);
    }
    S(this.dom, "ln-tabs:change", { key: s, tab: this.mapTabs[s], panel: this.mapPanels[s] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && Z("tabs", this.dom, s);
  }, _.prototype.destroy = function() {
    if (this.dom[l]) {
      for (const { el: s, handler: a } of this._clickHandlers)
        s.removeEventListener("click", a);
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), S(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[l];
    }
  };
  function f() {
    F(function() {
      new MutationObserver(function(a) {
        for (const o of a) {
          if (o.type === "attributes") {
            if (o.attributeName === "data-ln-tabs-active" && o.target[l]) {
              const t = o.target.getAttribute("data-ln-tabs-active");
              o.target[l]._applyActive(t);
              continue;
            }
            D(o.target, u, l, _);
            continue;
          }
          for (const t of o.addedNodes)
            D(t, u, l, _);
        }
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u, "data-ln-tabs-active"] });
    }, "ln-tabs");
  }
  f(), window[l] = v, v(document.body);
})();
(function() {
  const u = "data-ln-toggle", l = "lnToggle";
  if (window[l] !== void 0) return;
  function v(s) {
    D(s, u, l, _), p(s);
  }
  function p(s) {
    const a = Array.from(s.querySelectorAll("[data-ln-toggle-for]"));
    s.hasAttribute && s.hasAttribute("data-ln-toggle-for") && a.push(s);
    for (const o of a)
      o[l + "Trigger"] || (o[l + "Trigger"] = !0, o.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const e = o.getAttribute("data-ln-toggle-for"), n = document.getElementById(e);
        if (!n || !n[l]) return;
        const i = o.getAttribute("data-ln-toggle-action") || "toggle";
        n[l][i]();
      }));
  }
  function _(s) {
    if (this.dom = s, s.hasAttribute("data-ln-persist")) {
      const a = dt("toggle", s);
      a !== null && s.setAttribute(u, a);
    }
    return this.isOpen = s.getAttribute(u) === "open", this.isOpen && s.classList.add("open"), this;
  }
  _.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(u, "open");
  }, _.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "close");
  }, _.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, _.prototype.destroy = function() {
    this.dom[l] && (S(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function g(s) {
    const a = s[l];
    if (!a) return;
    const t = s.getAttribute(u) === "open";
    if (t !== a.isOpen)
      if (t) {
        if (K(s, "ln-toggle:before-open", { target: s }).defaultPrevented) {
          s.setAttribute(u, "close");
          return;
        }
        a.isOpen = !0, s.classList.add("open"), S(s, "ln-toggle:open", { target: s }), s.hasAttribute("data-ln-persist") && Z("toggle", s, "open");
      } else {
        if (K(s, "ln-toggle:before-close", { target: s }).defaultPrevented) {
          s.setAttribute(u, "open");
          return;
        }
        a.isOpen = !1, s.classList.remove("open"), S(s, "ln-toggle:close", { target: s }), s.hasAttribute("data-ln-persist") && Z("toggle", s, "close");
      }
  }
  function f() {
    F(function() {
      new MutationObserver(function(a) {
        for (let o = 0; o < a.length; o++) {
          const t = a[o];
          if (t.type === "childList")
            for (let e = 0; e < t.addedNodes.length; e++) {
              const n = t.addedNodes[e];
              n.nodeType === 1 && (D(n, u, l, _), p(n));
            }
          else t.type === "attributes" && (t.attributeName === u && t.target[l] ? g(t.target) : (D(t.target, u, l, _), p(t.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "data-ln-toggle-for"]
      });
    }, "ln-toggle");
  }
  window[l] = v, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-accordion", l = "lnAccordion";
  if (window[l] !== void 0) return;
  function v(g) {
    D(g, u, l, p);
  }
  function p(g) {
    return this.dom = g, this._onToggleOpen = function(f) {
      const s = g.querySelectorAll("[data-ln-toggle]");
      for (const a of s)
        a !== f.detail.target && a.getAttribute("data-ln-toggle") === "open" && a.setAttribute("data-ln-toggle", "close");
      S(g, "ln-accordion:change", { target: f.detail.target });
    }, g.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), S(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function _() {
    F(function() {
      new MutationObserver(function(f) {
        for (const s of f)
          if (s.type === "childList")
            for (const a of s.addedNodes)
              a.nodeType === 1 && D(a, u, l, p);
          else s.type === "attributes" && D(s.target, u, l, p);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-accordion");
  }
  window[l] = v, _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-dropdown", l = "lnDropdown";
  if (window[l] !== void 0) return;
  function v(g) {
    D(g, u, l, p);
  }
  function p(g) {
    if (this.dom = g, this.toggleEl = g.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = g.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const s of this.toggleEl.children)
        s.setAttribute("role", "menuitem");
    const f = this;
    return this._onToggleOpen = function(s) {
      s.detail.target === f.toggleEl && (f.triggerBtn && f.triggerBtn.setAttribute("aria-expanded", "true"), f._teleportToBody(), f._addOutsideClickListener(), f._addScrollRepositionListener(), f._addResizeCloseListener(), S(g, "ln-dropdown:open", { target: s.detail.target }));
    }, this._onToggleClose = function(s) {
      s.detail.target === f.toggleEl && (f.triggerBtn && f.triggerBtn.setAttribute("aria-expanded", "false"), f._removeOutsideClickListener(), f._removeScrollRepositionListener(), f._removeResizeCloseListener(), f._teleportBack(), S(g, "ln-dropdown:close", { target: s.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  p.prototype._positionMenu = function() {
    const g = this.dom.querySelector("[data-ln-toggle-for]");
    if (!g || !this.toggleEl) return;
    const f = g.getBoundingClientRect(), s = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    s && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const a = this.toggleEl.offsetWidth, o = this.toggleEl.offsetHeight;
    s && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const t = window.innerWidth, e = window.innerHeight, n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-xs")) * 16 || 4;
    let i;
    f.bottom + n + o <= e ? i = f.bottom + n : f.top - n - o >= 0 ? i = f.top - n - o : i = Math.max(0, e - o);
    let r;
    f.right - a >= 0 ? r = f.right - a : f.left + a <= t ? r = f.left : r = Math.max(0, t - a), this.toggleEl.style.top = i + "px", this.toggleEl.style.left = r + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, p.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, p.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, p.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const g = this;
    this._boundDocClick = function(f) {
      g.dom.contains(f.target) || g.toggleEl && g.toggleEl.contains(f.target) || g.toggleEl && g.toggleEl.getAttribute("data-ln-toggle") === "open" && g.toggleEl.setAttribute("data-ln-toggle", "close");
    }, setTimeout(function() {
      document.addEventListener("click", g._boundDocClick);
    }, 0);
  }, p.prototype._removeOutsideClickListener = function() {
    this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, p.prototype._addScrollRepositionListener = function() {
    const g = this;
    this._boundScrollReposition = function() {
      g._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, p.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, p.prototype._addResizeCloseListener = function() {
    const g = this;
    this._boundResizeClose = function() {
      g.toggleEl && g.toggleEl.getAttribute("data-ln-toggle") === "open" && g.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, p.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, p.prototype.destroy = function() {
    this.dom[l] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), S(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function _() {
    F(function() {
      new MutationObserver(function(f) {
        for (const s of f)
          if (s.type === "childList")
            for (const a of s.addedNodes)
              a.nodeType === 1 && D(a, u, l, p);
          else s.type === "attributes" && D(s.target, u, l, p);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-dropdown");
  }
  window[l] = v, _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-toast", l = "lnToast", v = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[l] !== void 0 && window[l] !== null) return;
  function p(r = document.body) {
    return _(r), i;
  }
  function _(r) {
    if (!r || r.nodeType !== 1) return;
    const d = Array.from(r.querySelectorAll("[" + u + "]"));
    r.hasAttribute && r.hasAttribute(u) && d.push(r);
    for (const b of d)
      b[l] || new g(b);
  }
  function g(r) {
    this.dom = r, r[l] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10);
    for (const d of Array.from(r.querySelectorAll("[data-ln-toast-item]")))
      a(d);
    return this;
  }
  g.prototype.destroy = function() {
    if (this.dom[l]) {
      for (const r of Array.from(this.dom.children))
        t(r);
      delete this.dom[l];
    }
  };
  function f(r) {
    return r === "success" ? "Success" : r === "error" ? "Error" : r === "warn" ? "Warning" : "Information";
  }
  function s(r, d, b) {
    const h = document.createElement("div");
    h.className = "ln-toast__card ln-toast__card--" + r, h.setAttribute("role", r === "error" ? "alert" : "status"), h.setAttribute("aria-live", r === "error" ? "assertive" : "polite");
    const m = document.createElement("div");
    m.className = "ln-toast__side", m.innerHTML = v[r] || v.info;
    const E = document.createElement("div");
    E.className = "ln-toast__content";
    const T = document.createElement("div");
    T.className = "ln-toast__head";
    const L = document.createElement("strong");
    L.className = "ln-toast__title", L.textContent = d || f(r);
    const A = document.createElement("button");
    return A.type = "button", A.className = "ln-toast__close", A.setAttribute("aria-label", "Close"), A.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>', A.addEventListener("click", function() {
      t(b);
    }), T.appendChild(L), E.appendChild(T), E.appendChild(A), h.appendChild(m), h.appendChild(E), { card: h, content: E };
  }
  function a(r) {
    const d = ((r.getAttribute("data-type") || "info") + "").toLowerCase(), b = r.getAttribute("data-title"), h = (r.innerText || r.textContent || "").trim();
    r.className = "ln-toast__item", r.removeAttribute("data-ln-toast-item");
    const m = s(d, b, r);
    if (h) {
      const E = document.createElement("div");
      E.className = "ln-toast__body";
      const T = document.createElement("p");
      T.textContent = h, E.appendChild(T), m.content.appendChild(E);
    }
    r.innerHTML = "", r.appendChild(m.card), requestAnimationFrame(() => r.classList.add("ln-toast__item--in"));
  }
  function o(r, d) {
    for (; r.dom.children.length >= r.max; ) r.dom.removeChild(r.dom.firstElementChild);
    r.dom.appendChild(d), requestAnimationFrame(() => d.classList.add("ln-toast__item--in"));
  }
  function t(r) {
    !r || !r.parentNode || (clearTimeout(r._timer), r.classList.remove("ln-toast__item--in"), r.classList.add("ln-toast__item--out"), setTimeout(() => {
      r.parentNode && r.parentNode.removeChild(r);
    }, 200));
  }
  function e(r = {}) {
    let d = r.container;
    if (typeof d == "string" && (d = document.querySelector(d)), d instanceof HTMLElement || (d = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !d)
      return console.warn("[ln-toast] No toast container found"), null;
    const b = d[l] || new g(d), h = Number.isFinite(r.timeout) ? r.timeout : b.timeoutDefault, m = (r.type || "info").toLowerCase(), E = document.createElement("li");
    E.className = "ln-toast__item";
    const T = s(m, r.title, E);
    if (r.message || r.data && r.data.errors) {
      const L = document.createElement("div");
      if (L.className = "ln-toast__body", r.message)
        if (Array.isArray(r.message)) {
          const A = document.createElement("ul");
          for (const I of r.message) {
            const x = document.createElement("li");
            x.textContent = I, A.appendChild(x);
          }
          L.appendChild(A);
        } else {
          const A = document.createElement("p");
          A.textContent = r.message, L.appendChild(A);
        }
      if (r.data && r.data.errors) {
        const A = document.createElement("ul");
        for (const I of Object.values(r.data.errors).flat()) {
          const x = document.createElement("li");
          x.textContent = I, A.appendChild(x);
        }
        L.appendChild(A);
      }
      T.content.appendChild(L);
    }
    return E.appendChild(T.card), o(b, E), h > 0 && (E._timer = setTimeout(() => t(E), h)), E;
  }
  function n(r) {
    let d = r;
    if (typeof d == "string" && (d = document.querySelector(d)), d instanceof HTMLElement || (d = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !!d)
      for (const b of Array.from(d.children))
        t(b);
  }
  const i = function(r) {
    return p(r);
  };
  i.enqueue = e, i.clear = n, F(function() {
    new MutationObserver(function(d) {
      for (const b of d) {
        if (b.type === "attributes") {
          _(b.target);
          continue;
        }
        for (const h of b.addedNodes)
          _(h);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
  }, "ln-toast"), window[l] = i, window.addEventListener("ln-toast:enqueue", function(r) {
    r.detail && i.enqueue(r.detail);
  }), p(document.body);
})();
(function() {
  const u = "data-ln-upload", l = "lnUpload", v = "data-ln-upload-dict", p = "data-ln-upload-accept", _ = "data-ln-upload-context", g = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function f() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const r = document.createElement("div");
    r.innerHTML = g;
    const d = r.firstElementChild;
    d && document.body.appendChild(d);
  }
  if (window[l] !== void 0) return;
  function s(r) {
    if (r === 0) return "0 B";
    const d = 1024, b = ["B", "KB", "MB", "GB"], h = Math.floor(Math.log(r) / Math.log(d));
    return parseFloat((r / Math.pow(d, h)).toFixed(1)) + " " + b[h];
  }
  function a(r) {
    return r.split(".").pop().toLowerCase();
  }
  function o(r) {
    return r === "docx" && (r = "doc"), ["pdf", "doc", "epub"].includes(r) ? "lnc-file-" + r : "ln-file";
  }
  function t(r, d) {
    if (!d) return !0;
    const b = "." + a(r.name);
    return d.split(",").map(function(m) {
      return m.trim().toLowerCase();
    }).includes(b.toLowerCase());
  }
  function e(r) {
    if (r.hasAttribute("data-ln-upload-initialized")) return;
    r.setAttribute("data-ln-upload-initialized", "true"), f();
    const d = vt(r, v), b = r.querySelector(".ln-upload__zone"), h = r.querySelector(".ln-upload__list"), m = r.getAttribute(p) || "";
    if (!b || !h) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", r);
      return;
    }
    let E = r.querySelector('input[type="file"]');
    E || (E = document.createElement("input"), E.type = "file", E.multiple = !0, E.classList.add("hidden"), m && (E.accept = m.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), r.appendChild(E));
    const T = r.getAttribute(u) || "/files/upload", L = r.getAttribute(_) || "", A = /* @__PURE__ */ new Map();
    let I = 0;
    function x() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function P(R) {
      if (!t(R, m)) {
        const C = d["invalid-type"];
        S(r, "ln-upload:invalid", {
          file: R,
          message: C
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["invalid-title"] || "Invalid File",
          message: C || d["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const B = "file-" + ++I, j = a(R.name), J = o(j), lt = rt(r, "ln-upload-item", "ln-upload");
      if (!lt) return;
      const V = lt.firstElementChild;
      if (!V) return;
      V.setAttribute("data-file-id", B), $(V, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + J,
        removeLabel: d.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const ot = V.querySelector(".ln-upload__progress-bar"), c = V.querySelector('[data-ln-upload-action="remove"]');
      c && (c.disabled = !0), h.appendChild(V);
      const w = new FormData();
      w.append("file", R), w.append("context", L);
      const y = new XMLHttpRequest();
      y.upload.addEventListener("progress", function(C) {
        if (C.lengthComputable) {
          const O = Math.round(C.loaded / C.total * 100);
          ot.style.width = O + "%", $(V, { sizeText: O + "%" });
        }
      }), y.addEventListener("load", function() {
        if (y.status >= 200 && y.status < 300) {
          let C;
          try {
            C = JSON.parse(y.responseText);
          } catch {
            k("Invalid response");
            return;
          }
          $(V, { sizeText: s(C.size || R.size), uploading: !1 }), c && (c.disabled = !1), A.set(B, {
            serverId: C.id,
            name: C.name,
            size: C.size
          }), N(), S(r, "ln-upload:uploaded", {
            localId: B,
            serverId: C.id,
            name: C.name
          });
        } else {
          let C = d["upload-failed"] || "Upload failed";
          try {
            C = JSON.parse(y.responseText).message || C;
          } catch {
          }
          k(C);
        }
      }), y.addEventListener("error", function() {
        k(d["network-error"] || "Network error");
      });
      function k(C) {
        ot && (ot.style.width = "100%"), $(V, { sizeText: d.error || "Error", uploading: !1, error: !0 }), c && (c.disabled = !1), S(r, "ln-upload:error", {
          file: R,
          message: C
        }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["error-title"] || "Upload Error",
          message: C || d["upload-failed"] || "Failed to upload file"
        });
      }
      y.open("POST", T), y.setRequestHeader("X-CSRF-TOKEN", x()), y.setRequestHeader("Accept", "application/json"), y.send(w);
    }
    function N() {
      for (const R of r.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of A) {
        const B = document.createElement("input");
        B.type = "hidden", B.name = "file_ids[]", B.value = R.serverId, r.appendChild(B);
      }
    }
    function H(R) {
      const B = A.get(R), j = h.querySelector('[data-file-id="' + R + '"]');
      if (!B || !B.serverId) {
        j && j.remove(), A.delete(R), N();
        return;
      }
      j && $(j, { deleting: !0 }), fetch("/files/" + B.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": x(),
          Accept: "application/json"
        }
      }).then(function(J) {
        J.status === 200 ? (j && j.remove(), A.delete(R), N(), S(r, "ln-upload:removed", {
          localId: R,
          serverId: B.serverId
        })) : (j && $(j, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["delete-title"] || "Error",
          message: d["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(J) {
        console.warn("[ln-upload] Delete error:", J), j && $(j, { deleting: !1 }), S(window, "ln-toast:enqueue", {
          type: "error",
          title: d["network-error"] || "Network error",
          message: d["connection-error"] || "Could not connect to server"
        });
      });
    }
    function U(R) {
      for (const B of R)
        P(B);
      E.value = "";
    }
    const et = function() {
      E.click();
    }, W = function() {
      U(this.files);
    }, Q = function(R) {
      R.preventDefault(), R.stopPropagation(), b.classList.add("ln-upload__zone--dragover");
    }, tt = function(R) {
      R.preventDefault(), R.stopPropagation(), b.classList.add("ln-upload__zone--dragover");
    }, nt = function(R) {
      R.preventDefault(), R.stopPropagation(), b.classList.remove("ln-upload__zone--dragover");
    }, X = function(R) {
      R.preventDefault(), R.stopPropagation(), b.classList.remove("ln-upload__zone--dragover"), U(R.dataTransfer.files);
    }, st = function(R) {
      const B = R.target.closest('[data-ln-upload-action="remove"]');
      if (!B || !h.contains(B) || B.disabled) return;
      const j = B.closest(".ln-upload__item");
      j && H(j.getAttribute("data-file-id"));
    };
    b.addEventListener("click", et), E.addEventListener("change", W), b.addEventListener("dragenter", Q), b.addEventListener("dragover", tt), b.addEventListener("dragleave", nt), b.addEventListener("drop", X), h.addEventListener("click", st), r.lnUploadAPI = {
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
              "X-CSRF-TOKEN": x(),
              Accept: "application/json"
            }
          });
        A.clear(), h.innerHTML = "", N(), S(r, "ln-upload:cleared", {});
      },
      destroy: function() {
        b.removeEventListener("click", et), E.removeEventListener("change", W), b.removeEventListener("dragenter", Q), b.removeEventListener("dragover", tt), b.removeEventListener("dragleave", nt), b.removeEventListener("drop", X), h.removeEventListener("click", st), A.clear(), h.innerHTML = "", N(), r.removeAttribute("data-ln-upload-initialized"), delete r.lnUploadAPI;
      }
    };
  }
  function n() {
    for (const r of document.querySelectorAll("[" + u + "]"))
      e(r);
  }
  function i() {
    F(function() {
      new MutationObserver(function(d) {
        for (const b of d)
          if (b.type === "childList") {
            for (const h of b.addedNodes)
              if (h.nodeType === 1) {
                h.hasAttribute(u) && e(h);
                for (const m of h.querySelectorAll("[" + u + "]"))
                  e(m);
              }
          } else b.type === "attributes" && b.target.hasAttribute(u) && e(b.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-upload");
  }
  window[l] = {
    init: e,
    initAll: n
  }, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const u = "lnExternalLinks";
  if (window[u] !== void 0) return;
  function l(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function v(s) {
    s.getAttribute("data-ln-external-link") !== "processed" && l(s) && (s.target = "_blank", s.rel = "noopener noreferrer", s.setAttribute("data-ln-external-link", "processed"), S(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    }));
  }
  function p(s) {
    s = s || document.body;
    for (const a of s.querySelectorAll("a, area"))
      v(a);
  }
  function _() {
    document.body.addEventListener("click", function(s) {
      const a = s.target.closest("a, area");
      a && a.getAttribute("data-ln-external-link") === "processed" && S(a, "ln-external-links:clicked", {
        link: a,
        href: a.href,
        text: a.textContent || a.title || ""
      });
    });
  }
  function g() {
    F(function() {
      new MutationObserver(function(a) {
        for (const o of a)
          if (o.type === "childList") {
            for (const t of o.addedNodes)
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && v(t), t.querySelectorAll))
                for (const e of t.querySelectorAll("a, area"))
                  v(e);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }, "ln-external-links");
  }
  function f() {
    _(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      p();
    }) : p();
  }
  window[u] = {
    process: p
  }, f();
})();
(function() {
  const u = "data-ln-link", l = "lnLink";
  if (window[l] !== void 0) return;
  let v = null;
  function p() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function _(h) {
    v && (v.textContent = h, v.classList.add("ln-link-status--visible"));
  }
  function g() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function f(h, m) {
    if (m.target.closest("a, button, input, select, textarea")) return;
    const E = h.querySelector("a");
    if (!E) return;
    const T = E.getAttribute("href");
    if (!T) return;
    if (m.ctrlKey || m.metaKey || m.button === 1) {
      window.open(T, "_blank");
      return;
    }
    K(h, "ln-link:navigate", { target: h, href: T, link: E }).defaultPrevented || E.click();
  }
  function s(h) {
    const m = h.querySelector("a");
    if (!m) return;
    const E = m.getAttribute("href");
    E && _(E);
  }
  function a() {
    g();
  }
  function o(h) {
    h[l + "Row"] || (h[l + "Row"] = !0, h.querySelector("a") && (h._lnLinkClick = function(m) {
      f(h, m);
    }, h._lnLinkEnter = function() {
      s(h);
    }, h.addEventListener("click", h._lnLinkClick), h.addEventListener("mouseenter", h._lnLinkEnter), h.addEventListener("mouseleave", a)));
  }
  function t(h) {
    h[l + "Row"] && (h._lnLinkClick && h.removeEventListener("click", h._lnLinkClick), h._lnLinkEnter && h.removeEventListener("mouseenter", h._lnLinkEnter), h.removeEventListener("mouseleave", a), delete h._lnLinkClick, delete h._lnLinkEnter, delete h[l + "Row"]);
  }
  function e(h) {
    if (!h[l + "Init"]) return;
    const m = h.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const E = m === "TABLE" && h.querySelector("tbody") || h;
      for (const T of E.querySelectorAll("tr"))
        t(T);
    } else
      t(h);
    delete h[l + "Init"];
  }
  function n(h) {
    if (h[l + "Init"]) return;
    h[l + "Init"] = !0;
    const m = h.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const E = m === "TABLE" && h.querySelector("tbody") || h;
      for (const T of E.querySelectorAll("tr"))
        o(T);
    } else
      o(h);
  }
  function i(h) {
    h.hasAttribute && h.hasAttribute(u) && n(h);
    const m = h.querySelectorAll ? h.querySelectorAll("[" + u + "]") : [];
    for (const E of m)
      n(E);
  }
  function r() {
    F(function() {
      new MutationObserver(function(m) {
        for (const E of m)
          if (E.type === "childList")
            for (const T of E.addedNodes)
              T.nodeType === 1 && (i(T), T.tagName === "TR" && T.closest("[" + u + "]") && o(T));
          else E.type === "attributes" && i(E.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-link");
  }
  function d(h) {
    i(h);
  }
  window[l] = { init: d, destroy: e };
  function b() {
    p(), r(), d(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b) : b();
})();
(function() {
  const u = "[data-ln-progress]", l = "lnProgress";
  if (window[l] !== void 0) return;
  function v(t) {
    const e = t.getAttribute("data-ln-progress");
    return e !== null && e !== "";
  }
  function p(t) {
    _(t);
  }
  function _(t) {
    const e = Array.from(t.querySelectorAll(u));
    for (const n of e)
      v(n) && !n[l] && (n[l] = new g(n));
    t.hasAttribute && t.hasAttribute("data-ln-progress") && v(t) && !t[l] && (t[l] = new g(t));
  }
  function g(t) {
    return this.dom = t, this._attrObserver = null, this._parentObserver = null, o.call(this), s.call(this), a.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[l]);
  };
  function f() {
    F(function() {
      new MutationObserver(function(e) {
        for (const n of e)
          if (n.type === "childList")
            for (const i of n.addedNodes)
              i.nodeType === 1 && _(i);
          else n.type === "attributes" && _(n.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  f();
  function s() {
    const t = this, e = new MutationObserver(function(n) {
      for (const i of n)
        (i.attributeName === "data-ln-progress" || i.attributeName === "data-ln-progress-max") && o.call(t);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function a() {
    const t = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const n = new MutationObserver(function(i) {
      for (const r of i)
        r.attributeName === "data-ln-progress-max" && o.call(t);
    });
    n.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function o() {
    const t = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, i = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let r = i > 0 ? t / i * 100 : 0;
    r < 0 && (r = 0), r > 100 && (r = 100), this.dom.style.width = r + "%", S(this.dom, "ln-progress:change", { target: this.dom, value: t, max: i, percentage: r });
  }
  window[l] = p, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const u = "data-ln-filter", l = "lnFilter", v = "data-ln-filter-initialized", p = "data-ln-filter-key", _ = "data-ln-filter-value", g = "data-ln-filter-hide", f = "data-ln-filter-reset";
  if (window[l] !== void 0) return;
  function s(e) {
    return e.hasAttribute(f) || e.getAttribute(_) === "";
  }
  function a(e) {
    D(e, u, l, o);
  }
  function o(e) {
    if (e.hasAttribute(v)) return this;
    this.dom = e, this.targetId = e.getAttribute(u), this.inputs = Array.from(e.querySelectorAll("[" + p + "]")), this._pendingEvents = [];
    const n = this, i = Et(
      function() {
        n._render();
      },
      function() {
        n._afterRender();
      }
    );
    this.state = yt({
      key: null,
      values: []
    }, i), this._attachHandlers();
    let r = !1;
    if (e.hasAttribute("data-ln-persist")) {
      const d = dt("filter", e);
      d && d.key && Array.isArray(d.values) && d.values.length > 0 && (this.state.key = d.key, this.state.values = d.values, r = !0);
    }
    if (!r) {
      let d = null;
      const b = [];
      for (let h = 0; h < this.inputs.length; h++) {
        const m = this.inputs[h];
        if (m.checked && !s(m)) {
          d || (d = m.getAttribute(p));
          const E = m.getAttribute(_);
          E && b.push(E);
        }
      }
      b.length > 0 && (this.state.key = d, this.state.values = b);
    }
    return e.setAttribute(v, ""), this;
  }
  o.prototype._attachHandlers = function() {
    const e = this;
    this.inputs.forEach(function(n) {
      n[l + "Bound"] || (n[l + "Bound"] = !0, n._lnFilterChange = function() {
        const i = n.getAttribute(p), r = n.getAttribute(_) || "";
        if (s(n)) {
          e._pendingEvents.push({
            name: "ln-filter:changed",
            detail: { key: i, values: [] }
          }), e.reset();
          return;
        }
        if (n.checked)
          e.state.values.indexOf(r) === -1 && (e.state.key = i, e.state.values.push(r));
        else {
          const d = e.state.values.indexOf(r);
          if (d !== -1 && e.state.values.splice(d, 1), e.state.values.length === 0) {
            e._pendingEvents.push({
              name: "ln-filter:changed",
              detail: { key: i, values: [] }
            }), e.reset();
            return;
          }
        }
        e._pendingEvents.push({
          name: "ln-filter:changed",
          detail: { key: e.state.key, values: e.state.values.slice() }
        });
      }, n.addEventListener("change", n._lnFilterChange));
    });
  }, o.prototype._render = function() {
    const e = this, n = this.state.key, i = this.state.values, r = n === null || i.length === 0, d = [];
    for (let m = 0; m < i.length; m++)
      d.push(i[m].toLowerCase());
    this.inputs.forEach(function(m) {
      if (r)
        m.checked = s(m);
      else if (s(m))
        m.checked = !1;
      else {
        const E = m.getAttribute(_) || "";
        m.checked = i.indexOf(E) !== -1;
      }
    });
    const b = document.getElementById(e.targetId);
    if (!b) return;
    const h = b.children;
    for (let m = 0; m < h.length; m++) {
      const E = h[m];
      if (r) {
        E.removeAttribute(g);
        continue;
      }
      const T = E.getAttribute("data-" + n);
      E.removeAttribute(g), T !== null && d.indexOf(T.toLowerCase()) === -1 && E.setAttribute(g, "true");
    }
  }, o.prototype._afterRender = function() {
    const e = this._pendingEvents;
    this._pendingEvents = [];
    for (let n = 0; n < e.length; n++)
      this._dispatchOnBoth(e[n].name, e[n].detail);
    this.dom.hasAttribute("data-ln-persist") && (this.state.key && this.state.values.length > 0 ? Z("filter", this.dom, { key: this.state.key, values: this.state.values.slice() }) : Z("filter", this.dom, null));
  }, o.prototype._dispatchOnBoth = function(e, n) {
    S(this.dom, e, n);
    const i = document.getElementById(this.targetId);
    i && i !== this.dom && S(i, e, n);
  }, o.prototype.filter = function(e, n) {
    if (Array.isArray(n)) {
      if (n.length === 0) {
        this.reset();
        return;
      }
      this.state.key = e, this.state.values = n.slice();
    } else if (n)
      this.state.key = e, this.state.values = [n];
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
    this.dom[l] && (this.inputs.forEach(function(e) {
      e._lnFilterChange && (e.removeEventListener("change", e._lnFilterChange), delete e._lnFilterChange), delete e[l + "Bound"];
    }), this.dom.removeAttribute(v), delete this.dom[l]);
  };
  function t() {
    F(function() {
      new MutationObserver(function(n) {
        for (const i of n)
          if (i.type === "childList")
            for (const r of i.addedNodes)
              r.nodeType === 1 && D(r, u, l, o);
          else i.type === "attributes" && D(i.target, u, l, o);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-filter");
  }
  window[l] = a, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    a(document.body);
  }) : a(document.body);
})();
(function() {
  const u = "data-ln-search", l = "lnSearch", v = "data-ln-search-initialized", p = "data-ln-search-hide";
  if (window[l] !== void 0) return;
  function g(a) {
    D(a, u, l, f);
  }
  function f(a) {
    if (a.hasAttribute(v)) return this;
    this.dom = a, this.targetId = a.getAttribute(u);
    const o = a.tagName;
    return this.input = o === "INPUT" || o === "TEXTAREA" ? a : a.querySelector('[name="search"]') || a.querySelector('input[type="search"]') || a.querySelector('input[type="text"]'), this.itemsSelector = a.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), a.setAttribute(v, ""), this;
  }
  f.prototype._attachHandler = function() {
    if (!this.input) return;
    const a = this;
    this._onInput = function() {
      clearTimeout(a._debounceTimer), a._debounceTimer = setTimeout(function() {
        a._search(a.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, f.prototype._search = function(a) {
    const o = document.getElementById(this.targetId);
    if (!o || K(o, "ln-search:change", { term: a, targetId: this.targetId }).defaultPrevented) return;
    const e = this.itemsSelector ? o.querySelectorAll(this.itemsSelector) : o.children;
    for (let n = 0; n < e.length; n++) {
      const i = e[n];
      i.removeAttribute(p), a && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(a) && i.setAttribute(p, "true");
    }
  }, f.prototype.destroy = function() {
    this.dom[l] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this.dom.removeAttribute(v), delete this.dom[l]);
  };
  function s() {
    F(function() {
      new MutationObserver(function(o) {
        o.forEach(function(t) {
          t.type === "childList" ? t.addedNodes.forEach(function(e) {
            e.nodeType === 1 && D(e, u, l, f);
          }) : t.type === "attributes" && D(t.target, u, l, f);
        });
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-search");
  }
  window[l] = g, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const u = "lnTableSort", l = "data-ln-sort", v = "data-ln-sort-active";
  if (window[u] !== void 0) return;
  function p(o) {
    _(o);
  }
  function _(o) {
    const t = Array.from(o.querySelectorAll("table"));
    o.tagName === "TABLE" && t.push(o), t.forEach(function(e) {
      if (e[u]) return;
      const n = Array.from(e.querySelectorAll("th[" + l + "]"));
      n.length && (e[u] = new s(e, n));
    });
  }
  function g() {
    var o = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    o.setAttribute("class", "ln-icon ln-sort-icon"), o.setAttribute("aria-hidden", "true");
    var t = document.createElementNS("http://www.w3.org/2000/svg", "use");
    return t.setAttribute("href", "#ln-sort-both"), o.appendChild(t), o;
  }
  function f(o, t) {
    var e = o.querySelector("svg.ln-sort-icon use");
    if (e) {
      var n = t === "asc" ? "#ln-arrow-up" : t === "desc" ? "#ln-arrow-down" : "#ln-sort-both";
      e.setAttribute("href", n);
    }
  }
  function s(o, t) {
    this.table = o, this.ths = t, this._col = -1, this._dir = null;
    const e = this;
    t.forEach(function(i, r) {
      i[u + "Bound"] || (i[u + "Bound"] = !0, i.querySelector("svg.ln-sort-icon") || i.appendChild(g()), i._lnSortClick = function() {
        e._handleClick(r, i);
      }, i.addEventListener("click", i._lnSortClick));
    });
    const n = o.closest("[data-ln-table][data-ln-persist]");
    if (n) {
      const i = dt("table-sort", n);
      i && i.dir && i.col >= 0 && i.col < t.length && (this._handleClick(i.col, t[i.col]), i.dir === "desc" && this._handleClick(i.col, t[i.col]));
    }
    return this;
  }
  s.prototype._handleClick = function(o, t) {
    let e;
    this._col !== o ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this.ths.forEach(function(i) {
      i.removeAttribute(v), f(i, null);
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = o, this._dir = e, t.setAttribute(v, e), f(t, e)), S(this.table, "ln-table:sort", {
      column: o,
      sortType: t.getAttribute(l),
      direction: e
    });
    const n = this.table.closest("[data-ln-table][data-ln-persist]");
    n && (e === null ? Z("table-sort", n, null) : Z("table-sort", n, { col: o, dir: e }));
  }, s.prototype.destroy = function() {
    this.table[u] && (this.ths.forEach(function(o) {
      o._lnSortClick && (o.removeEventListener("click", o._lnSortClick), delete o._lnSortClick), delete o[u + "Bound"];
    }), delete this.table[u]);
  };
  function a() {
    F(function() {
      new MutationObserver(function(t) {
        t.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(n) {
            n.nodeType === 1 && _(n);
          }) : e.type === "attributes" && _(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [l] });
    }, "ln-table-sort");
  }
  window[u] = p, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const u = "data-ln-table", l = "lnTable", v = "data-ln-sort", p = "data-ln-table-empty";
  if (window[l] !== void 0) return;
  const f = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function s(t) {
    D(t, u, l, a);
  }
  function a(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("tbody"), this.thead = t.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const e = t.querySelector(".ln-table__toolbar");
    e && t.style.setProperty("--ln-table-toolbar-h", e.offsetHeight + "px");
    const n = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      const i = new MutationObserver(function() {
        n.tbody.rows.length > 0 && (i.disconnect(), n._parseRows());
      });
      i.observe(this.tbody, { childList: !0 });
    }
    return this._onSearch = function(i) {
      i.preventDefault(), n._searchTerm = i.detail.term, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), S(t, "ln-table:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onSort = function(i) {
      n._sortCol = i.detail.direction === null ? -1 : i.detail.column, n._sortDir = i.detail.direction, n._sortType = i.detail.sortType, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), S(t, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(i) {
      const r = i.detail.key;
      let d = !1;
      for (let h = 0; h < n.ths.length; h++)
        if (n.ths[h].getAttribute("data-ln-filter-col") === r) {
          d = !0;
          break;
        }
      if (!d) return;
      const b = i.detail.values;
      if (!b || b.length === 0)
        delete n._columnFilters[r];
      else {
        const h = [];
        for (let m = 0; m < b.length; m++)
          h.push(b[m].toLowerCase());
        n._columnFilters[r] = h;
      }
      n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), S(t, "ln-table:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._data.length
      });
    }, t.addEventListener("ln-filter:changed", this._onColumnFilter), this;
  }
  a.prototype._parseRows = function() {
    const t = this.tbody.rows, e = this.ths;
    this._data = [];
    const n = [];
    for (let i = 0; i < e.length; i++)
      n[i] = e[i].getAttribute(v);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let i = 0; i < t.length; i++) {
      const r = t[i], d = [], b = [], h = [];
      for (let m = 0; m < r.cells.length; m++) {
        const E = r.cells[m], T = E.textContent.trim(), L = E.hasAttribute("data-ln-value") ? E.getAttribute("data-ln-value") : T, A = n[m];
        b[m] = T.toLowerCase(), A === "number" || A === "date" ? d[m] = parseFloat(L) || 0 : A === "string" ? d[m] = String(L) : d[m] = null, m < r.cells.length - 1 && h.push(T.toLowerCase());
      }
      this._data.push({
        sortKeys: d,
        rawTexts: b,
        html: r.outerHTML,
        searchText: h.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), S(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, a.prototype._applyFilterAndSort = function() {
    const t = this._searchTerm, e = this._columnFilters, n = Object.keys(e).length > 0, i = this.ths, r = {};
    if (n)
      for (let E = 0; E < i.length; E++) {
        const T = i[E].getAttribute("data-ln-filter-col");
        T && (r[T] = E);
      }
    if (!t && !n ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
      if (t && E.searchText.indexOf(t) === -1) return !1;
      if (n)
        for (const T in e) {
          const L = r[T];
          if (L !== void 0 && e[T].indexOf(E.rawTexts[L]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const d = this._sortCol, b = this._sortDir === "desc" ? -1 : 1, h = this._sortType === "number" || this._sortType === "date", m = f ? f.compare : function(E, T) {
      return E < T ? -1 : E > T ? 1 : 0;
    };
    this._filteredData.sort(function(E, T) {
      const L = E.sortKeys[d], A = T.sortKeys[d];
      return h ? (L - A) * b : m(L, A) * b;
    });
  }, a.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(e) {
      const n = document.createElement("col");
      n.style.width = e.offsetWidth + "px", t.appendChild(n);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, a.prototype._render = function() {
    if (!this.tbody) return;
    const t = this._filteredData.length;
    t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, a.prototype._renderAll = function() {
    const t = [], e = this._filteredData;
    for (let n = 0; n < e.length; n++) t.push(e[n].html);
    this.tbody.innerHTML = t.join("");
  }, a.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const t = this;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, a.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, a.prototype._renderVirtual = function() {
    const t = this._filteredData, e = t.length, n = this._rowHeight;
    if (!n || !e) return;
    const r = this.table.getBoundingClientRect().top + window.scrollY, d = this.thead ? this.thead.offsetHeight : 0, b = r + d, h = window.scrollY - b, m = Math.max(0, Math.floor(h / n) - 15), E = Math.min(m + Math.ceil(window.innerHeight / n) + 30, e);
    if (m === this._vStart && E === this._vEnd) return;
    this._vStart = m, this._vEnd = E;
    const T = this.ths.length || 1, L = m * n, A = (e - E) * n;
    let I = "";
    L > 0 && (I += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + T + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>');
    for (let x = m; x < E; x++) I += t[x].html;
    A > 0 && (I += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + T + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = I;
  }, a.prototype._showEmptyState = function() {
    const t = this.ths.length || 1, e = this.dom.querySelector("template[" + p + "]"), n = document.createElement("td");
    n.setAttribute("colspan", String(t)), e && n.appendChild(document.importNode(e.content, !0));
    const i = document.createElement("tr");
    i.className = "ln-table__empty", i.appendChild(n), this.tbody.innerHTML = "", this.tbody.appendChild(i), S(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, a.prototype.destroy = function() {
    this.dom[l] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[l]);
  };
  function o() {
    F(function() {
      new MutationObserver(function(e) {
        e.forEach(function(n) {
          n.type === "childList" ? n.addedNodes.forEach(function(i) {
            i.nodeType === 1 && D(i, u, l, a);
          }) : n.type === "attributes" && D(n.target, u, l, a);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-table");
  }
  window[l] = s, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    s(document.body);
  }) : s(document.body);
})();
(function() {
  const u = "data-ln-circular-progress", l = "lnCircularProgress";
  if (window[l] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", p = 36, _ = 16, g = 2 * Math.PI * _;
  function f(i) {
    D(i, u, l, s);
  }
  function s(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, o.call(this), n.call(this), e.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  s.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[l]);
  };
  function a(i, r) {
    const d = document.createElementNS(v, i);
    for (const b in r)
      d.setAttribute(b, r[b]);
    return d;
  }
  function o() {
    this.svg = a("svg", {
      viewBox: "0 0 " + p + " " + p,
      "aria-hidden": "true"
    }), this.trackCircle = a("circle", {
      cx: p / 2,
      cy: p / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = a("circle", {
      cx: p / 2,
      cy: p / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": g,
      "stroke-dashoffset": g,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function t() {
    F(function() {
      new MutationObserver(function(r) {
        for (const d of r)
          if (d.type === "childList")
            for (const b of d.addedNodes)
              b.nodeType === 1 && D(b, u, l, s);
          else d.type === "attributes" && D(d.target, u, l, s);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-circular-progress"]
      });
    }, "ln-circular-progress");
  }
  t();
  function e() {
    const i = this, r = new MutationObserver(function(d) {
      for (const b of d)
        (b.attributeName === "data-ln-circular-progress" || b.attributeName === "data-ln-circular-progress-max") && n.call(i);
    });
    r.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = r;
  }
  function n() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, r = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let d = r > 0 ? i / r * 100 : 0;
    d < 0 && (d = 0), d > 100 && (d = 100);
    const b = g - d / 100 * g;
    this.progressCircle.setAttribute("stroke-dashoffset", b);
    const h = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = h !== null ? h : Math.round(d) + "%", S(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: r,
      percentage: d
    });
  }
  window[l] = f, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const u = "data-ln-sortable", l = "lnSortable", v = "data-ln-sortable-handle";
  if (window[l] !== void 0) return;
  function p(f) {
    D(f, u, l, _);
  }
  function _(f) {
    this.dom = f, this.isEnabled = f.getAttribute(u) !== "disabled", this._dragging = null, f.setAttribute("aria-roledescription", "sortable list");
    const s = this;
    return this._onPointerDown = function(a) {
      s.isEnabled && s._handlePointerDown(a);
    }, f.addEventListener("pointerdown", this._onPointerDown), this;
  }
  _.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(u, "");
  }, _.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(u, "disabled");
  }, _.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), S(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[l]);
  }, _.prototype._handlePointerDown = function(f) {
    let s = f.target.closest("[" + v + "]"), a;
    if (s) {
      for (a = s; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (a = f.target; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
      s = a;
    }
    const t = Array.from(this.dom.children).indexOf(a);
    if (K(this.dom, "ln-sortable:before-drag", {
      item: a,
      index: t
    }).defaultPrevented) return;
    f.preventDefault(), s.setPointerCapture(f.pointerId), this._dragging = a, a.classList.add("ln-sortable--dragging"), a.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), S(this.dom, "ln-sortable:drag-start", {
      item: a,
      index: t
    });
    const n = this, i = function(d) {
      n._handlePointerMove(d);
    }, r = function(d) {
      n._handlePointerEnd(d), s.removeEventListener("pointermove", i), s.removeEventListener("pointerup", r), s.removeEventListener("pointercancel", r);
    };
    s.addEventListener("pointermove", i), s.addEventListener("pointerup", r), s.addEventListener("pointercancel", r);
  }, _.prototype._handlePointerMove = function(f) {
    if (!this._dragging) return;
    const s = Array.from(this.dom.children), a = this._dragging;
    for (const o of s)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const o of s) {
      if (o === a) continue;
      const t = o.getBoundingClientRect(), e = t.top + t.height / 2;
      if (f.clientY >= t.top && f.clientY < e) {
        o.classList.add("ln-sortable--drop-before");
        break;
      } else if (f.clientY >= e && f.clientY <= t.bottom) {
        o.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, _.prototype._handlePointerEnd = function(f) {
    if (!this._dragging) return;
    const s = this._dragging, a = Array.from(this.dom.children), o = a.indexOf(s);
    let t = null, e = null;
    for (const n of a) {
      if (n.classList.contains("ln-sortable--drop-before")) {
        t = n, e = "before";
        break;
      }
      if (n.classList.contains("ln-sortable--drop-after")) {
        t = n, e = "after";
        break;
      }
    }
    for (const n of a)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (s.classList.remove("ln-sortable--dragging"), s.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), t && t !== s) {
      e === "before" ? this.dom.insertBefore(s, t) : this.dom.insertBefore(s, t.nextElementSibling);
      const i = Array.from(this.dom.children).indexOf(s);
      S(this.dom, "ln-sortable:reordered", {
        item: s,
        oldIndex: o,
        newIndex: i
      });
    }
    this._dragging = null;
  };
  function g() {
    F(function() {
      new MutationObserver(function(s) {
        for (let a = 0; a < s.length; a++) {
          const o = s[a];
          if (o.type === "childList")
            for (let t = 0; t < o.addedNodes.length; t++) {
              const e = o.addedNodes[t];
              e.nodeType === 1 && D(e, u, l, _);
            }
          else if (o.type === "attributes") {
            const t = o.target, e = t[l];
            if (e) {
              const n = t.getAttribute(u) !== "disabled";
              n !== e.isEnabled && (e.isEnabled = n, S(t, n ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: t }));
            } else
              D(t, u, l, _);
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
  window[l] = p, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const u = "data-ln-confirm", l = "lnConfirm", v = "data-ln-confirm-timeout";
  if (window[l] !== void 0) return;
  function _(a) {
    D(a, u, l, g);
  }
  function g(a) {
    this.dom = a, this.confirming = !1, this.originalText = a.textContent.trim(), this.confirmText = a.getAttribute(u) || "Confirm?", this.revertTimer = null;
    const o = this;
    return this._onClick = function(t) {
      o.confirming ? o._reset() : (t.preventDefault(), t.stopImmediatePropagation(), o._enterConfirm());
    }, a.addEventListener("click", this._onClick), this;
  }
  g.prototype._getTimeout = function() {
    const a = parseFloat(this.dom.getAttribute(v));
    return isNaN(a) || a <= 0 ? 3 : a;
  }, g.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var a = this.dom.querySelector("svg.ln-icon use");
    a && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = a.getAttribute("href"), a.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), S(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, g.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const a = this, o = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      a._reset();
    }, o);
  }, g.prototype._reset = function() {
    if (this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var a = this.dom.querySelector("svg.ln-icon use");
      a && this.originalIconHref && a.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[l] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[l]);
  };
  function f(a) {
    const o = a[l];
    !o || !o.confirming || o._startTimer();
  }
  function s() {
    F(function() {
      new MutationObserver(function(o) {
        for (let t = 0; t < o.length; t++) {
          const e = o[t];
          if (e.type === "childList")
            for (let n = 0; n < e.addedNodes.length; n++) {
              const i = e.addedNodes[n];
              i.nodeType === 1 && D(i, u, l, g);
            }
          else e.type === "attributes" && (e.attributeName === v && e.target[l] ? f(e.target) : D(e.target, u, l, g));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, v]
      });
    }, "ln-confirm");
  }
  window[l] = _, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const u = "data-ln-translations", l = "lnTranslations";
  if (window[l] !== void 0) return;
  const v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(f) {
    D(f, u, l, _);
  }
  function _(f) {
    this.dom = f, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = f.getAttribute(u + "-default") || "", this.badgesEl = f.querySelector("[" + u + "-active]"), this.menuEl = f.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const s = f.getAttribute(u + "-locales");
    if (this.locales = v, s)
      try {
        this.locales = JSON.parse(s);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const a = this;
    return this._onRequestAdd = function(o) {
      o.detail && o.detail.lang && a.addLanguage(o.detail.lang);
    }, this._onRequestRemove = function(o) {
      o.detail && o.detail.lang && a.removeLanguage(o.detail.lang);
    }, f.addEventListener("ln-translations:request-add", this._onRequestAdd), f.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  _.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const f = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const s of f) {
      const a = s.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const o of a)
        o.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, _.prototype._detectExisting = function() {
    const f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of f) {
      const a = s.getAttribute("data-ln-translatable-lang");
      a && a !== this.defaultLang && this.activeLanguages.add(a);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, _.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const f = this;
    let s = 0;
    for (const o in this.locales) {
      if (!this.locales.hasOwnProperty(o) || this.activeLanguages.has(o)) continue;
      s++;
      const t = pt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const e = t.querySelector("[data-ln-translations-lang]");
      e.setAttribute("data-ln-translations-lang", o), e.textContent = this.locales[o], e.addEventListener("click", function(n) {
        n.ctrlKey || n.metaKey || n.button === 1 || (n.preventDefault(), n.stopPropagation(), f.menuEl.getAttribute("data-ln-toggle") === "open" && f.menuEl.setAttribute("data-ln-toggle", "close"), f.addLanguage(o));
      }), this.menuEl.appendChild(t);
    }
    const a = this.dom.querySelector("[" + u + "-add]");
    a && (a.style.display = s === 0 ? "none" : "");
  }, _.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const f = this;
    this.activeLanguages.forEach(function(s) {
      const a = pt("ln-translations-badge", "ln-translations");
      if (!a) return;
      const o = a.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", s);
      const t = o.querySelector("span");
      t.textContent = f.locales[s] || s.toUpperCase();
      const e = o.querySelector("button");
      e.setAttribute("aria-label", "Remove " + (f.locales[s] || s.toUpperCase())), e.addEventListener("click", function(n) {
        n.ctrlKey || n.metaKey || n.button === 1 || (n.preventDefault(), n.stopPropagation(), f.removeLanguage(s));
      }), f.badgesEl.appendChild(a);
    });
  }, _.prototype.addLanguage = function(f, s) {
    if (this.activeLanguages.has(f)) return;
    const a = this.locales[f] || f;
    if (K(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: f,
      langName: a
    }).defaultPrevented) return;
    this.activeLanguages.add(f), s = s || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const e of t) {
      const n = e.getAttribute("data-ln-translatable"), i = e.getAttribute("data-ln-translations-prefix") || "", r = e.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!r) continue;
      const d = r.cloneNode(!1);
      i ? d.name = i + "[trans][" + f + "][" + n + "]" : d.name = "trans[" + f + "][" + n + "]", d.value = s[n] !== void 0 ? s[n] : "", d.removeAttribute("id"), d.placeholder = a + " translation", d.setAttribute("data-ln-translatable-lang", f);
      const b = e.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), h = b.length > 0 ? b[b.length - 1] : r;
      h.parentNode.insertBefore(d, h.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: f,
      langName: a
    });
  }, _.prototype.removeLanguage = function(f) {
    if (!this.activeLanguages.has(f) || K(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: f
    }).defaultPrevented) return;
    const a = this.dom.querySelectorAll('[data-ln-translatable-lang="' + f + '"]');
    for (const o of a)
      o.parentNode.removeChild(o);
    this.activeLanguages.delete(f), this._updateDropdown(), this._updateBadges(), S(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: f
    });
  }, _.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, _.prototype.hasLanguage = function(f) {
    return this.activeLanguages.has(f);
  }, _.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const f = this.defaultLang, s = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const a of s)
      a.getAttribute("data-ln-translatable-lang") !== f && a.parentNode.removeChild(a);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[l];
  };
  function g() {
    F(function() {
      new MutationObserver(function(s) {
        for (const a of s)
          if (a.type === "childList")
            for (const o of a.addedNodes)
              o.nodeType === 1 && D(o, u, l, _);
          else a.type === "attributes" && D(a.target, u, l, _);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-translations");
  }
  window[l] = p, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const u = "data-ln-autosave", l = "lnAutosave", v = "data-ln-autosave-clear", p = "ln-autosave:";
  if (window[l] !== void 0) return;
  function _(e) {
    D(e, u, l, g);
  }
  function g(e) {
    const n = f(e);
    if (!n) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = n;
    const i = this;
    return this._onFocusout = function(r) {
      const d = r.target;
      s(d) && d.name && i.save();
    }, this._onChange = function(r) {
      const d = r.target;
      s(d) && d.name && i.save();
    }, this._onSubmit = function() {
      i.clear();
    }, this._onReset = function() {
      i.clear();
    }, this._onClearClick = function(r) {
      r.target.closest("[" + v + "]") && i.clear();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  g.prototype.save = function() {
    const e = a(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(e));
    } catch {
      return;
    }
    S(this.dom, "ln-autosave:saved", { target: this.dom, data: e });
  }, g.prototype.restore = function() {
    let e;
    try {
      e = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (!e) return;
    let n;
    try {
      n = JSON.parse(e);
    } catch {
      return;
    }
    K(this.dom, "ln-autosave:before-restore", { target: this.dom, data: n }).defaultPrevented || (o(this.dom, n), S(this.dom, "ln-autosave:restored", { target: this.dom, data: n }));
  }, g.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    S(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, g.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), S(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function f(e) {
    const i = e.getAttribute(u) || e.id;
    return i ? p + window.location.pathname + ":" + i : null;
  }
  function s(e) {
    const n = e.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function a(e) {
    const n = {}, i = e.elements;
    for (let r = 0; r < i.length; r++) {
      const d = i[r];
      if (!(!d.name || d.disabled || d.type === "file" || d.type === "submit" || d.type === "button"))
        if (d.type === "checkbox")
          n[d.name] || (n[d.name] = []), d.checked && n[d.name].push(d.value);
        else if (d.type === "radio")
          d.checked && (n[d.name] = d.value);
        else if (d.type === "select-multiple") {
          n[d.name] = [];
          for (let b = 0; b < d.options.length; b++)
            d.options[b].selected && n[d.name].push(d.options[b].value);
        } else
          n[d.name] = d.value;
    }
    return n;
  }
  function o(e, n) {
    const i = e.elements, r = [];
    for (let d = 0; d < i.length; d++) {
      const b = i[d];
      if (!b.name || !(b.name in n) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
      const h = n[b.name];
      if (b.type === "checkbox")
        b.checked = Array.isArray(h) && h.indexOf(b.value) !== -1, r.push(b);
      else if (b.type === "radio")
        b.checked = b.value === h, r.push(b);
      else if (b.type === "select-multiple") {
        if (Array.isArray(h))
          for (let m = 0; m < b.options.length; m++)
            b.options[m].selected = h.indexOf(b.options[m].value) !== -1;
        r.push(b);
      } else
        b.value = h, r.push(b);
    }
    for (let d = 0; d < r.length; d++)
      r[d].dispatchEvent(new Event("input", { bubbles: !0 })), r[d].dispatchEvent(new Event("change", { bubbles: !0 })), r[d].lnSelect && r[d].lnSelect.setValue && r[d].lnSelect.setValue(n[r[d].name]);
  }
  function t() {
    F(function() {
      new MutationObserver(function(n) {
        for (let i = 0; i < n.length; i++)
          if (n[i].type === "childList") {
            const r = n[i].addedNodes;
            for (let d = 0; d < r.length; d++)
              r[d].nodeType === 1 && D(r[d], u, l, g);
          } else n[i].type === "attributes" && D(n[i].target, u, l, g);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-autosave");
  }
  window[l] = _, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const u = "data-ln-autoresize", l = "lnAutoresize";
  if (window[l] !== void 0) return;
  function v(g) {
    D(g, u, l, p);
  }
  function p(g) {
    if (g.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", g.tagName), this;
    this.dom = g;
    const f = this;
    return this._onInput = function() {
      f._resize();
    }, g.addEventListener("input", this._onInput), this._resize(), this;
  }
  p.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[l]);
  };
  function _() {
    F(function() {
      new MutationObserver(function(f) {
        for (const s of f)
          if (s.type === "childList")
            for (const a of s.addedNodes)
              a.nodeType === 1 && D(a, u, l, p);
          else s.type === "attributes" && D(s.target, u, l, p);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-autoresize");
  }
  window[l] = v, _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-validate", l = "lnValidate", v = "data-ln-validate-errors", p = "data-ln-validate-error", _ = "ln-validate-valid", g = "ln-validate-invalid", f = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[l] !== void 0) return;
  function s(t) {
    D(t, u, l, a);
  }
  function a(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const e = this, n = t.tagName, i = t.type, r = n === "SELECT" || i === "checkbox" || i === "radio";
    return this._onInput = function() {
      e._touched = !0, e.validate();
    }, this._onChange = function() {
      e._touched = !0, e.validate();
    }, this._onSetCustom = function(d) {
      const b = d.detail && d.detail.error;
      if (!b) return;
      e._customErrors.add(b), e._touched = !0;
      const h = t.closest(".form-element");
      if (h) {
        const m = h.querySelector("[" + p + '="' + b + '"]');
        m && m.classList.remove("hidden");
      }
      t.classList.remove(_), t.classList.add(g);
    }, this._onClearCustom = function(d) {
      const b = d.detail && d.detail.error, h = t.closest(".form-element");
      if (b) {
        if (e._customErrors.delete(b), h) {
          const m = h.querySelector("[" + p + '="' + b + '"]');
          m && m.classList.add("hidden");
        }
      } else
        e._customErrors.forEach(function(m) {
          if (h) {
            const E = h.querySelector("[" + p + '="' + m + '"]');
            E && E.classList.add("hidden");
          }
        }), e._customErrors.clear();
      e._touched && e.validate();
    }, r || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  a.prototype.validate = function() {
    const t = this.dom, e = t.validity, i = t.checkValidity() && this._customErrors.size === 0, r = t.closest(".form-element");
    if (r) {
      const b = r.querySelector("[" + v + "]");
      if (b) {
        const h = b.querySelectorAll("[" + p + "]");
        for (let m = 0; m < h.length; m++) {
          const E = h[m].getAttribute(p), T = f[E];
          T && (e[T] ? h[m].classList.remove("hidden") : h[m].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(_, i), t.classList.toggle(g, !i), S(t, i ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), i;
  }, a.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(_, g);
    const t = this.dom.closest(".form-element");
    if (t) {
      const e = t.querySelectorAll("[" + p + "]");
      for (let n = 0; n < e.length; n++)
        e[n].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), a.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(_, g), S(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function o() {
    F(function() {
      new MutationObserver(function(e) {
        for (let n = 0; n < e.length; n++)
          if (e[n].type === "childList") {
            const i = e[n].addedNodes;
            for (let r = 0; r < i.length; r++)
              i[r].nodeType === 1 && D(i[r], u, l, a);
          } else e[n].type === "attributes" && D(e[n].target, u, l, a);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-validate");
  }
  window[l] = s, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    s(document.body);
  }) : s(document.body);
})();
(function() {
  const u = "data-ln-form", l = "lnForm", v = "data-ln-form-auto", p = "data-ln-form-debounce", _ = "data-ln-validate", g = "lnValidate";
  if (window[l] !== void 0) return;
  function f(o) {
    D(o, u, l, s);
  }
  function s(o) {
    this.dom = o, this._invalidFields = /* @__PURE__ */ new Set(), this._debounceTimer = null;
    const t = this;
    if (this._onValid = function(e) {
      t._invalidFields.delete(e.detail.field), t._updateSubmitButton();
    }, this._onInvalid = function(e) {
      t._invalidFields.add(e.detail.field), t._updateSubmitButton();
    }, this._onSubmit = function(e) {
      e.preventDefault(), t.submit();
    }, this._onFill = function(e) {
      e.detail && t.fill(e.detail);
    }, this._onFormReset = function() {
      t.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        t._resetValidation();
      }, 0);
    }, o.addEventListener("ln-validate:valid", this._onValid), o.addEventListener("ln-validate:invalid", this._onInvalid), o.addEventListener("submit", this._onSubmit), o.addEventListener("ln-form:fill", this._onFill), o.addEventListener("ln-form:reset", this._onFormReset), o.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, o.hasAttribute(v)) {
      const e = parseInt(o.getAttribute(p)) || 0;
      this._onAutoInput = function() {
        e > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, e)) : t.submit();
      }, o.addEventListener("input", this._onAutoInput), o.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  s.prototype._updateSubmitButton = function() {
    const o = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!o.length) return;
    const t = this.dom.querySelectorAll("[" + _ + "]");
    let e = !1;
    if (t.length > 0) {
      let n = !1, i = !1;
      for (let r = 0; r < t.length; r++) {
        const d = t[r][g];
        d && d._touched && (n = !0), t[r].checkValidity() || (i = !0);
      }
      e = i || !n;
    }
    for (let n = 0; n < o.length; n++)
      o[n].disabled = e;
  }, s.prototype._serialize = function() {
    const o = {}, t = this.dom.elements;
    for (let e = 0; e < t.length; e++) {
      const n = t[e];
      if (!(!n.name || n.disabled || n.type === "file" || n.type === "submit" || n.type === "button"))
        if (n.type === "checkbox")
          o[n.name] || (o[n.name] = []), n.checked && o[n.name].push(n.value);
        else if (n.type === "radio")
          n.checked && (o[n.name] = n.value);
        else if (n.type === "select-multiple") {
          o[n.name] = [];
          for (let i = 0; i < n.options.length; i++)
            n.options[i].selected && o[n.name].push(n.options[i].value);
        } else
          o[n.name] = n.value;
    }
    return o;
  }, s.prototype.fill = function(o) {
    const t = this.dom.elements, e = [];
    for (let n = 0; n < t.length; n++) {
      const i = t[n];
      if (!i.name || !(i.name in o) || i.type === "file" || i.type === "submit" || i.type === "button") continue;
      const r = o[i.name];
      if (i.type === "checkbox")
        i.checked = Array.isArray(r) ? r.indexOf(i.value) !== -1 : !!r, e.push(i);
      else if (i.type === "radio")
        i.checked = i.value === String(r), e.push(i);
      else if (i.type === "select-multiple") {
        if (Array.isArray(r))
          for (let d = 0; d < i.options.length; d++)
            i.options[d].selected = r.indexOf(i.options[d].value) !== -1;
        e.push(i);
      } else
        i.value = r, e.push(i);
    }
    for (let n = 0; n < e.length; n++) {
      const i = e[n], r = i.tagName === "SELECT" || i.type === "checkbox" || i.type === "radio";
      i.dispatchEvent(new Event(r ? "change" : "input", { bubbles: !0 }));
    }
  }, s.prototype.submit = function() {
    const o = this.dom.querySelectorAll("[" + _ + "]");
    let t = !0;
    for (let n = 0; n < o.length; n++) {
      const i = o[n][g];
      i && (i.validate() || (t = !1));
    }
    if (!t) return;
    const e = this._serialize();
    S(this.dom, "ln-form:submit", { data: e });
  }, s.prototype.reset = function() {
    this.dom.reset(), this._resetValidation();
  }, s.prototype._resetValidation = function() {
    this._invalidFields.clear();
    const o = this.dom.querySelectorAll("[" + _ + "]");
    for (let t = 0; t < o.length; t++) {
      const e = o[t][g];
      e && e.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      const o = this.dom.querySelectorAll("[" + _ + "]");
      for (let t = 0; t < o.length; t++)
        if (!o[t].checkValidity()) return !1;
      return !0;
    }
  }), s.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), S(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function a() {
    F(function() {
      new MutationObserver(function(t) {
        for (let e = 0; e < t.length; e++)
          if (t[e].type === "childList") {
            const n = t[e].addedNodes;
            for (let i = 0; i < n.length; i++)
              n[i].nodeType === 1 && D(n[i], u, l, s);
          } else t[e].type === "attributes" && D(t[e].target, u, l, s);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-form");
  }
  window[l] = f, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const u = "data-ln-time", l = "lnTime";
  if (window[l] !== void 0) return;
  const v = {}, p = {};
  function _(L) {
    return L.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function g(L, A) {
    const I = (L || "") + "|" + JSON.stringify(A);
    return v[I] || (v[I] = new Intl.DateTimeFormat(L, A)), v[I];
  }
  function f(L) {
    const A = L || "";
    return p[A] || (p[A] = new Intl.RelativeTimeFormat(L, { numeric: "auto", style: "narrow" })), p[A];
  }
  const s = /* @__PURE__ */ new Set();
  let a = null;
  function o() {
    a || (a = setInterval(e, 6e4));
  }
  function t() {
    a && (clearInterval(a), a = null);
  }
  function e() {
    for (const L of s) {
      if (!document.body.contains(L.dom)) {
        s.delete(L);
        continue;
      }
      h(L);
    }
    s.size === 0 && t();
  }
  function n(L, A) {
    return g(A, { dateStyle: "long", timeStyle: "short" }).format(L);
  }
  function i(L, A) {
    const I = /* @__PURE__ */ new Date(), x = { month: "short", day: "numeric" };
    return L.getFullYear() !== I.getFullYear() && (x.year = "numeric"), g(A, x).format(L);
  }
  function r(L, A) {
    return g(A, { dateStyle: "medium" }).format(L);
  }
  function d(L, A) {
    return g(A, { timeStyle: "short" }).format(L);
  }
  function b(L, A) {
    const I = Math.floor(Date.now() / 1e3), P = Math.floor(L.getTime() / 1e3) - I, N = Math.abs(P);
    if (N < 10) return f(A).format(0, "second");
    let H, U;
    if (N < 60)
      H = "second", U = P;
    else if (N < 3600)
      H = "minute", U = Math.round(P / 60);
    else if (N < 86400)
      H = "hour", U = Math.round(P / 3600);
    else if (N < 604800)
      H = "day", U = Math.round(P / 86400);
    else if (N < 2592e3)
      H = "week", U = Math.round(P / 604800);
    else
      return i(L, A);
    return f(A).format(U, H);
  }
  function h(L) {
    const A = L.dom.getAttribute("datetime");
    if (!A) return;
    const I = Number(A);
    if (isNaN(I)) return;
    const x = new Date(I * 1e3), P = L.dom.getAttribute(u) || "short", N = _(L.dom);
    let H;
    switch (P) {
      case "relative":
        H = b(x, N);
        break;
      case "full":
        H = n(x, N);
        break;
      case "date":
        H = r(x, N);
        break;
      case "time":
        H = d(x, N);
        break;
      default:
        H = i(x, N);
        break;
    }
    L.dom.textContent = H, P !== "full" && (L.dom.title = n(x, N));
  }
  function m(L) {
    return this.dom = L, h(this), L.getAttribute(u) === "relative" && (s.add(this), o()), this;
  }
  m.prototype.render = function() {
    h(this);
  }, m.prototype.destroy = function() {
    s.delete(this), s.size === 0 && t(), delete this.dom[l];
  };
  function E(L) {
    D(L, u, l, m);
  }
  function T() {
    F(function() {
      new MutationObserver(function(A) {
        for (const I of A)
          if (I.type === "childList")
            for (const x of I.addedNodes)
              x.nodeType === 1 && D(x, u, l, m);
          else if (I.type === "attributes") {
            const x = I.target;
            x[l] ? (x.getAttribute(u) === "relative" ? (s.add(x[l]), o()) : (s.delete(x[l]), s.size === 0 && t()), h(x[l])) : D(x, u, l, m);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "datetime"]
      });
    }, "ln-time");
  }
  T(), window[l] = E, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const u = "data-ln-store", l = "lnStore";
  if (window[l] !== void 0) return;
  const v = "ln_app_cache", p = "_meta", _ = "1.0";
  let g = null, f = null;
  const s = {};
  function a() {
    const c = document.querySelectorAll("[" + u + "]"), w = {};
    for (let y = 0; y < c.length; y++) {
      const k = c[y].getAttribute(u);
      k && (w[k] = {
        indexes: (c[y].getAttribute("data-ln-store-indexes") || "").split(",").map(function(C) {
          return C.trim();
        }).filter(Boolean)
      });
    }
    return w;
  }
  function o() {
    return f || (f = new Promise(function(c, w) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), c(null);
        return;
      }
      const y = a(), k = Object.keys(y), C = indexedDB.open(v);
      C.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), c(null);
      }, C.onsuccess = function(O) {
        const M = O.target.result, q = Array.from(M.objectStoreNames);
        let z = !1;
        q.indexOf(p) === -1 && (z = !0);
        for (let G = 0; G < k.length; G++)
          if (q.indexOf(k[G]) === -1) {
            z = !0;
            break;
          }
        if (!z) {
          t(M), g = M, c(M);
          return;
        }
        const it = M.version;
        M.close();
        const at = indexedDB.open(v, it + 1);
        at.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, at.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), c(null);
        }, at.onupgradeneeded = function(G) {
          const Y = G.target.result;
          Y.objectStoreNames.contains(p) || Y.createObjectStore(p, { keyPath: "key" });
          for (let ut = 0; ut < k.length; ut++) {
            const ft = k[ut];
            if (!Y.objectStoreNames.contains(ft)) {
              const _t = Y.createObjectStore(ft, { keyPath: "id" }), ht = y[ft].indexes;
              for (let ct = 0; ct < ht.length; ct++)
                _t.createIndex(ht[ct], ht[ct], { unique: !1 });
            }
          }
        }, at.onsuccess = function(G) {
          const Y = G.target.result;
          t(Y), g = Y, c(Y);
        };
      };
    }), f);
  }
  function t(c) {
    c.onversionchange = function() {
      c.close(), g = null, f = null;
    };
  }
  function e() {
    return g ? Promise.resolve(g) : (f = null, o());
  }
  function n(c, w) {
    return e().then(function(y) {
      return y ? y.transaction(c, w).objectStore(c) : null;
    });
  }
  function i(c) {
    return new Promise(function(w, y) {
      c.onsuccess = function() {
        w(c.result);
      }, c.onerror = function() {
        y(c.error);
      };
    });
  }
  function r(c) {
    return n(c, "readonly").then(function(w) {
      return w ? i(w.getAll()) : [];
    });
  }
  function d(c, w) {
    return n(c, "readonly").then(function(y) {
      return y ? i(y.get(w)) : null;
    });
  }
  function b(c, w) {
    return n(c, "readwrite").then(function(y) {
      if (y)
        return i(y.put(w));
    });
  }
  function h(c, w) {
    return n(c, "readwrite").then(function(y) {
      if (y)
        return i(y.delete(w));
    });
  }
  function m(c) {
    return n(c, "readwrite").then(function(w) {
      if (w)
        return i(w.clear());
    });
  }
  function E(c) {
    return n(c, "readonly").then(function(w) {
      return w ? i(w.count()) : 0;
    });
  }
  function T(c) {
    return n(p, "readonly").then(function(w) {
      return w ? i(w.get(c)) : null;
    });
  }
  function L(c, w) {
    return n(p, "readwrite").then(function(y) {
      if (y)
        return w.key = c, i(y.put(w));
    });
  }
  function A(c) {
    this.dom = c, this._name = c.getAttribute(u), this._endpoint = c.getAttribute("data-ln-store-endpoint") || "";
    const w = c.getAttribute("data-ln-store-stale"), y = parseInt(w, 10);
    this._staleThreshold = w === "never" || w === "-1" ? -1 : isNaN(y) ? 300 : y, this._searchFields = (c.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(C) {
      return C.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, s[this._name] = this;
    const k = this;
    return I(k), U(k), this;
  }
  function I(c) {
    c._handlers = {
      create: function(w) {
        x(c, w.detail);
      },
      update: function(w) {
        P(c, w.detail);
      },
      delete: function(w) {
        N(c, w.detail);
      },
      bulkDelete: function(w) {
        H(c, w.detail);
      }
    }, c.dom.addEventListener("ln-store:request-create", c._handlers.create), c.dom.addEventListener("ln-store:request-update", c._handlers.update), c.dom.addEventListener("ln-store:request-delete", c._handlers.delete), c.dom.addEventListener("ln-store:request-bulk-delete", c._handlers.bulkDelete);
  }
  function x(c, w) {
    const y = w.data || {}, k = "_temp_" + crypto.randomUUID(), C = Object.assign({}, y, { id: k });
    b(c._name, C).then(function() {
      return c.totalCount++, S(c.dom, "ln-store:created", {
        store: c._name,
        record: C,
        tempId: k
      }), fetch(c._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(y)
      });
    }).then(function(O) {
      if (!O.ok) throw new Error("HTTP " + O.status);
      return O.json();
    }).then(function(O) {
      return h(c._name, k).then(function() {
        return b(c._name, O);
      }).then(function() {
        S(c.dom, "ln-store:confirmed", {
          store: c._name,
          record: O,
          tempId: k,
          action: "create"
        });
      });
    }).catch(function(O) {
      h(c._name, k).then(function() {
        c.totalCount--, S(c.dom, "ln-store:reverted", {
          store: c._name,
          record: C,
          action: "create",
          error: O.message
        });
      });
    });
  }
  function P(c, w) {
    const y = w.id, k = w.data || {}, C = w.expected_version;
    let O = null;
    d(c._name, y).then(function(M) {
      if (!M) throw new Error("Record not found: " + y);
      O = Object.assign({}, M);
      const q = Object.assign({}, M, k);
      return b(c._name, q).then(function() {
        return S(c.dom, "ln-store:updated", {
          store: c._name,
          record: q,
          previous: O
        }), q;
      });
    }).then(function(M) {
      const q = Object.assign({}, k);
      return C && (q.expected_version = C), fetch(c._endpoint + "/" + y, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(q)
      });
    }).then(function(M) {
      if (M.status === 409)
        return M.json().then(function(q) {
          return b(c._name, O).then(function() {
            S(c.dom, "ln-store:conflict", {
              store: c._name,
              local: O,
              remote: q.current || q,
              field_diffs: q.field_diffs || null
            });
          });
        });
      if (!M.ok) throw new Error("HTTP " + M.status);
      return M.json().then(function(q) {
        return b(c._name, q).then(function() {
          S(c.dom, "ln-store:confirmed", {
            store: c._name,
            record: q,
            action: "update"
          });
        });
      });
    }).catch(function(M) {
      O && b(c._name, O).then(function() {
        S(c.dom, "ln-store:reverted", {
          store: c._name,
          record: O,
          action: "update",
          error: M.message
        });
      });
    });
  }
  function N(c, w) {
    const y = w.id;
    let k = null;
    d(c._name, y).then(function(C) {
      if (C)
        return k = Object.assign({}, C), h(c._name, y).then(function() {
          return c.totalCount--, S(c.dom, "ln-store:deleted", {
            store: c._name,
            id: y
          }), fetch(c._endpoint + "/" + y, {
            method: "DELETE",
            headers: { Accept: "application/json" }
          });
        });
    }).then(function(C) {
      if (!C || !C.ok) throw new Error("HTTP " + (C ? C.status : "unknown"));
      S(c.dom, "ln-store:confirmed", {
        store: c._name,
        record: k,
        action: "delete"
      });
    }).catch(function(C) {
      k && b(c._name, k).then(function() {
        c.totalCount++, S(c.dom, "ln-store:reverted", {
          store: c._name,
          record: k,
          action: "delete",
          error: C.message
        });
      });
    });
  }
  function H(c, w) {
    const y = w.ids || [];
    if (y.length === 0) return;
    let k = [];
    const C = y.map(function(O) {
      return d(c._name, O);
    });
    Promise.all(C).then(function(O) {
      return k = O.filter(Boolean), nt(c._name, y).then(function() {
        return c.totalCount -= y.length, S(c.dom, "ln-store:deleted", {
          store: c._name,
          ids: y
        }), fetch(c._endpoint + "/bulk-delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ids: y })
        });
      });
    }).then(function(O) {
      if (!O.ok) throw new Error("HTTP " + O.status);
      S(c.dom, "ln-store:confirmed", {
        store: c._name,
        record: null,
        ids: y,
        action: "bulk-delete"
      });
    }).catch(function(O) {
      k.length > 0 && tt(c._name, k).then(function() {
        c.totalCount += k.length, S(c.dom, "ln-store:reverted", {
          store: c._name,
          record: null,
          ids: y,
          action: "bulk-delete",
          error: O.message
        });
      });
    });
  }
  function U(c) {
    o().then(function() {
      return T(c._name);
    }).then(function(w) {
      w && w.schema_version === _ ? (c.lastSyncedAt = w.last_synced_at || null, c.totalCount = w.record_count || 0, c.totalCount > 0 ? (c.isLoaded = !0, S(c.dom, "ln-store:ready", {
        store: c._name,
        count: c.totalCount,
        source: "cache"
      }), et(c) && Q(c)) : W(c)) : w && w.schema_version !== _ ? m(c._name).then(function() {
        return L(c._name, {
          schema_version: _,
          last_synced_at: null,
          record_count: 0
        });
      }).then(function() {
        W(c);
      }) : W(c);
    });
  }
  function et(c) {
    return c._staleThreshold === -1 ? !1 : c.lastSyncedAt ? Math.floor(Date.now() / 1e3) - c.lastSyncedAt > c._staleThreshold : !0;
  }
  function W(c) {
    return c._endpoint ? (c.isSyncing = !0, c._abortController = new AbortController(), fetch(c._endpoint, { signal: c._abortController.signal }).then(function(w) {
      if (!w.ok) throw new Error("HTTP " + w.status);
      return w.json();
    }).then(function(w) {
      const y = w.data || [], k = w.synced_at || Math.floor(Date.now() / 1e3);
      return tt(c._name, y).then(function() {
        return L(c._name, {
          schema_version: _,
          last_synced_at: k,
          record_count: y.length
        });
      }).then(function() {
        c.isLoaded = !0, c.isSyncing = !1, c.lastSyncedAt = k, c.totalCount = y.length, c._abortController = null, S(c.dom, "ln-store:loaded", {
          store: c._name,
          count: y.length
        }), S(c.dom, "ln-store:ready", {
          store: c._name,
          count: y.length,
          source: "server"
        });
      });
    }).catch(function(w) {
      c.isSyncing = !1, c._abortController = null, w.name !== "AbortError" && (c.isLoaded ? S(c.dom, "ln-store:offline", { store: c._name }) : S(c.dom, "ln-store:error", {
        store: c._name,
        action: "full-load",
        error: w.message,
        status: null
      }));
    })) : Promise.resolve();
  }
  function Q(c) {
    if (!c._endpoint || !c.lastSyncedAt) return W(c);
    c.isSyncing = !0, c._abortController = new AbortController();
    const w = c._endpoint + (c._endpoint.indexOf("?") === -1 ? "?" : "&") + "since=" + c.lastSyncedAt;
    return fetch(w, { signal: c._abortController.signal }).then(function(y) {
      if (!y.ok) throw new Error("HTTP " + y.status);
      return y.json();
    }).then(function(y) {
      const k = y.data || [], C = y.deleted || [], O = y.synced_at || Math.floor(Date.now() / 1e3), M = k.length > 0 || C.length > 0;
      let q = Promise.resolve();
      return k.length > 0 && (q = q.then(function() {
        return tt(c._name, k);
      })), C.length > 0 && (q = q.then(function() {
        return nt(c._name, C);
      })), q.then(function() {
        return E(c._name);
      }).then(function(z) {
        return c.totalCount = z, L(c._name, {
          schema_version: _,
          last_synced_at: O,
          record_count: z
        });
      }).then(function() {
        c.isSyncing = !1, c.lastSyncedAt = O, c._abortController = null, S(c.dom, "ln-store:synced", {
          store: c._name,
          added: k.length,
          deleted: C.length,
          changed: M
        });
      });
    }).catch(function(y) {
      c.isSyncing = !1, c._abortController = null, y.name !== "AbortError" && S(c.dom, "ln-store:offline", { store: c._name });
    });
  }
  function tt(c, w) {
    return e().then(function(y) {
      if (y)
        return new Promise(function(k, C) {
          const O = y.transaction(c, "readwrite"), M = O.objectStore(c);
          for (let q = 0; q < w.length; q++)
            M.put(w[q]);
          O.oncomplete = function() {
            k();
          }, O.onerror = function() {
            C(O.error);
          };
        });
    });
  }
  function nt(c, w) {
    return e().then(function(y) {
      if (y)
        return new Promise(function(k, C) {
          const O = y.transaction(c, "readwrite"), M = O.objectStore(c);
          for (let q = 0; q < w.length; q++)
            M.delete(w[q]);
          O.oncomplete = function() {
            k();
          }, O.onerror = function() {
            C(O.error);
          };
        });
    });
  }
  let X = null;
  X = function() {
    if (document.visibilityState !== "visible") return;
    const c = Object.keys(s);
    for (let w = 0; w < c.length; w++) {
      const y = s[c[w]];
      y.isLoaded && !y.isSyncing && et(y) && Q(y);
    }
  }, document.addEventListener("visibilitychange", X);
  const st = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function R(c, w) {
    if (!w || !w.field) return c;
    const y = w.field, k = w.direction === "desc";
    return c.slice().sort(function(C, O) {
      const M = C[y], q = O[y];
      if (M == null && q == null) return 0;
      if (M == null) return k ? 1 : -1;
      if (q == null) return k ? -1 : 1;
      let z;
      return typeof M == "string" && typeof q == "string" ? z = st.compare(M, q) : z = M < q ? -1 : M > q ? 1 : 0, k ? -z : z;
    });
  }
  function B(c, w) {
    if (!w) return c;
    const y = Object.keys(w);
    return y.length === 0 ? c : c.filter(function(k) {
      for (let C = 0; C < y.length; C++) {
        const O = y[C], M = w[O];
        if (!Array.isArray(M) || M.length === 0) continue;
        const q = k[O];
        let z = !1;
        for (let it = 0; it < M.length; it++)
          if (String(q) === String(M[it])) {
            z = !0;
            break;
          }
        if (!z) return !1;
      }
      return !0;
    });
  }
  function j(c, w, y) {
    if (!w || !y || y.length === 0) return c;
    const k = w.toLowerCase();
    return c.filter(function(C) {
      for (let O = 0; O < y.length; O++) {
        const M = C[y[O]];
        if (M != null && String(M).toLowerCase().indexOf(k) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function J(c, w, y) {
    if (c.length === 0) return 0;
    if (y === "count") return c.length;
    let k = 0, C = 0;
    for (let O = 0; O < c.length; O++) {
      const M = parseFloat(c[O][w]);
      isNaN(M) || (k += M, C++);
    }
    return y === "sum" ? k : y === "avg" && C > 0 ? k / C : 0;
  }
  A.prototype.getAll = function(c) {
    const w = this;
    return c = c || {}, r(w._name).then(function(y) {
      const k = y.length;
      c.filters && (y = B(y, c.filters)), c.search && (y = j(y, c.search, w._searchFields));
      const C = y.length;
      if (c.sort && (y = R(y, c.sort)), c.offset || c.limit) {
        const O = c.offset || 0, M = c.limit || y.length;
        y = y.slice(O, O + M);
      }
      return {
        data: y,
        total: k,
        filtered: C
      };
    });
  }, A.prototype.getById = function(c) {
    return d(this._name, c);
  }, A.prototype.count = function(c) {
    const w = this;
    return c ? r(w._name).then(function(y) {
      return B(y, c).length;
    }) : E(w._name);
  }, A.prototype.aggregate = function(c, w) {
    return r(this._name).then(function(k) {
      return J(k, c, w);
    });
  }, A.prototype.forceSync = function() {
    return Q(this);
  }, A.prototype.fullReload = function() {
    const c = this;
    return m(c._name).then(function() {
      return c.isLoaded = !1, c.lastSyncedAt = null, c.totalCount = 0, W(c);
    });
  }, A.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete s[this._name], Object.keys(s).length === 0 && X && (document.removeEventListener("visibilitychange", X), X = null), delete this.dom[l], S(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function lt() {
    return e().then(function(c) {
      if (!c) return;
      const w = Array.from(c.objectStoreNames);
      return new Promise(function(y, k) {
        const C = c.transaction(w, "readwrite");
        for (let O = 0; O < w.length; O++)
          C.objectStore(w[O]).clear();
        C.oncomplete = function() {
          y();
        }, C.onerror = function() {
          k(C.error);
        };
      });
    }).then(function() {
      const c = Object.keys(s);
      for (let w = 0; w < c.length; w++) {
        const y = s[c[w]];
        y.isLoaded = !1, y.isSyncing = !1, y.lastSyncedAt = null, y.totalCount = 0;
      }
    });
  }
  function V(c) {
    D(c, u, l, A);
  }
  function ot() {
    F(function() {
      new MutationObserver(function(w) {
        for (let y = 0; y < w.length; y++) {
          const k = w[y];
          if (k.type === "childList")
            for (let C = 0; C < k.addedNodes.length; C++) {
              const O = k.addedNodes[C];
              O.nodeType === 1 && D(O, u, l, A);
            }
          else k.type === "attributes" && D(k.target, u, l, A);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-store");
  }
  window[l] = { init: V, clearAll: lt }, ot(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    V(document.body);
  }) : V(document.body);
})();
(function() {
  const u = "data-ln-data-table", l = "lnDataTable";
  if (window[l] !== void 0) return;
  const _ = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function g(o) {
    return _ ? _.format(o) : String(o);
  }
  function f(o) {
    D(o, u, l, s);
  }
  function s(o) {
    this.dom = o, this.name = o.getAttribute(u) || "", this.table = o.querySelector("table"), this.tbody = o.querySelector("[data-ln-data-table-body]") || o.querySelector("tbody"), this.thead = o.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._totalSpan = o.querySelector("[data-ln-data-table-total]"), this._filteredSpan = o.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = o.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const t = this;
    if (this._onSetData = function(e) {
      const n = e.detail || {};
      t._data = n.data || [], t._lastTotal = n.total != null ? n.total : t._data.length, t._lastFiltered = n.filtered != null ? n.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._renderRows(), t._updateFooter(), S(o, "ln-data-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, o.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(e) {
      const n = e.detail && e.detail.loading;
      o.classList.toggle("ln-data-table--loading", !!n), n && (t.isLoaded = !1);
    }, o.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(o.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(e) {
      const n = e.target.closest("[data-ln-col-sort]");
      if (!n) return;
      const i = n.closest("th");
      if (!i) return;
      const r = i.getAttribute("data-ln-col");
      r && t._handleSort(r, i);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(e) {
      const n = e.target.closest("[data-ln-col-filter]");
      if (!n) return;
      e.stopPropagation();
      const i = n.closest("th");
      if (!i) return;
      const r = i.getAttribute("data-ln-col");
      if (r) {
        if (t._activeDropdown && t._activeDropdown.field === r) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(r, i, n);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(e) {
      e.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), S(o, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, o.addEventListener("click", this._onClearAll), this._selectable = o.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(e) {
        const n = e.target.closest("[data-ln-row-select]");
        if (!n) return;
        const i = n.closest("[data-ln-row]");
        if (!i) return;
        const r = i.getAttribute("data-ln-row-id");
        r != null && (n.checked ? (t.selectedIds.add(r), i.classList.add("ln-row-selected")) : (t.selectedIds.delete(r), i.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), S(o, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = o.querySelector('[data-ln-col-select] input[type="checkbox"]') || o.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const e = document.createElement("input");
        e.type = "checkbox", e.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(e), this._selectAllCheckbox = e;
      }
      this._selectAllCheckbox && (this._onSelectAll = function() {
        const e = t._selectAllCheckbox.checked, n = t.tbody ? t.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let i = 0; i < n.length; i++) {
          const r = n[i].getAttribute("data-ln-row-id"), d = n[i].querySelector("[data-ln-row-select]");
          r != null && (e ? (t.selectedIds.add(r), n[i].classList.add("ln-row-selected")) : (t.selectedIds.delete(r), n[i].classList.remove("ln-row-selected")), d && (d.checked = e));
        }
        t.selectedCount = t.selectedIds.size, S(o, "ln-data-table:select-all", {
          table: t.name,
          selected: e
        }), S(o, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }), t._updateFooter();
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
    }
    return this._onRowClick = function(e) {
      if (e.target.closest("[data-ln-row-select]") || e.target.closest("[data-ln-row-action]") || e.target.closest("a") || e.target.closest("button") || e.ctrlKey || e.metaKey || e.button === 1) return;
      const n = e.target.closest("[data-ln-row]");
      if (!n) return;
      const i = n.getAttribute("data-ln-row-id"), r = n._lnRecord || {};
      S(o, "ln-data-table:row-click", {
        table: t.name,
        id: i,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(e) {
      const n = e.target.closest("[data-ln-row-action]");
      if (!n) return;
      e.stopPropagation();
      const i = n.closest("[data-ln-row]");
      if (!i) return;
      const r = n.getAttribute("data-ln-row-action"), d = i.getAttribute("data-ln-row-id"), b = i._lnRecord || {};
      S(o, "ln-data-table:row-action", {
        table: t.name,
        id: d,
        action: r,
        record: b
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = o.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, S(o, "ln-data-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(e) {
      if (!o.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (e.key === "/") {
        t._searchInput && (e.preventDefault(), t._searchInput.focus());
        return;
      }
      const n = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (n.length)
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, n.length - 1), t._focusRow(n);
            break;
          case "ArrowUp":
            e.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(n);
            break;
          case "Home":
            e.preventDefault(), t._focusedRowIndex = 0, t._focusRow(n);
            break;
          case "End":
            e.preventDefault(), t._focusedRowIndex = n.length - 1, t._focusRow(n);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const i = n[t._focusedRowIndex];
              S(o, "ln-data-table:row-click", {
                table: t.name,
                id: i.getAttribute("data-ln-row-id"),
                record: i._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < n.length) {
              e.preventDefault();
              const i = n[t._focusedRowIndex].querySelector("[data-ln-row-select]");
              i && (i.checked = !i.checked, i.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            t._activeDropdown && t._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), S(o, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  s.prototype._handleSort = function(o, t) {
    let e;
    !this.currentSort || this.currentSort.field !== o ? e = "asc" : this.currentSort.direction === "asc" ? e = "desc" : e = null;
    for (let n = 0; n < this.ths.length; n++)
      this.ths[n].classList.remove("ln-sort-asc", "ln-sort-desc");
    e ? (this.currentSort = { field: o, direction: e }, t.classList.add(e === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, S(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: o,
      direction: e
    }), this._requestData();
  }, s.prototype._requestData = function() {
    S(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, s.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-row]");
    let t = o.length > 0;
    for (let e = 0; e < o.length; e++) {
      const n = o[e].getAttribute("data-ln-row-id");
      if (n != null && !this.selectedIds.has(n)) {
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
  }), s.prototype._focusRow = function(o) {
    for (let t = 0; t < o.length; t++)
      o[t].classList.remove("ln-row-focused"), o[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < o.length) {
      const t = o[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, s.prototype._openFilterDropdown = function(o, t, e) {
    this._closeFilterDropdown();
    const n = rt(this.dom, this.name + "-column-filter", "ln-data-table") || rt(this.dom, "column-filter", "ln-data-table");
    if (!n) return;
    const i = n.firstElementChild;
    if (!i) return;
    const r = this._getUniqueValues(o), d = i.querySelector("[data-ln-filter-options]"), b = i.querySelector("[data-ln-filter-search]"), h = this.currentFilters[o] || [], m = this;
    if (b && r.length <= 8 && b.classList.add("hidden"), d) {
      for (let T = 0; T < r.length; T++) {
        const L = r[T], A = document.createElement("li"), I = document.createElement("label"), x = document.createElement("input");
        x.type = "checkbox", x.value = L, x.checked = h.length === 0 || h.indexOf(L) !== -1, I.appendChild(x), I.appendChild(document.createTextNode(" " + L)), A.appendChild(I), d.appendChild(A);
      }
      d.addEventListener("change", function(T) {
        T.target.type === "checkbox" && m._onFilterChange(o, d);
      });
    }
    b && b.addEventListener("input", function() {
      const T = b.value.toLowerCase(), L = d.querySelectorAll("li");
      for (let A = 0; A < L.length; A++) {
        const I = L[A].textContent.toLowerCase();
        L[A].classList.toggle("hidden", T && I.indexOf(T) === -1);
      }
    });
    const E = i.querySelector("[data-ln-filter-clear]");
    E && E.addEventListener("click", function() {
      delete m.currentFilters[o], m._closeFilterDropdown(), m._updateFilterIndicators(), S(m.dom, "ln-data-table:filter", {
        table: m.name,
        field: o,
        values: []
      }), m._requestData();
    }), t.appendChild(i), this._activeDropdown = { field: o, th: t, el: i }, i.addEventListener("click", function(T) {
      T.stopPropagation();
    });
  }, s.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, s.prototype._onFilterChange = function(o, t) {
    const e = t.querySelectorAll('input[type="checkbox"]'), n = [];
    let i = !0;
    for (let r = 0; r < e.length; r++)
      e[r].checked ? n.push(e[r].value) : i = !1;
    i || n.length === 0 ? delete this.currentFilters[o] : this.currentFilters[o] = n, this._updateFilterIndicators(), S(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: o,
      values: i ? [] : n
    }), this._requestData();
  }, s.prototype._getUniqueValues = function(o) {
    const t = {}, e = [], n = this._data;
    for (let i = 0; i < n.length; i++) {
      const r = n[i][o];
      r != null && !t[r] && (t[r] = !0, e.push(String(r)));
    }
    return e.sort(), e;
  }, s.prototype._updateFilterIndicators = function() {
    const o = this.ths;
    for (let t = 0; t < o.length; t++) {
      const e = o[t], n = e.getAttribute("data-ln-col");
      if (!n) continue;
      const i = e.querySelector("[data-ln-col-filter]");
      if (!i) continue;
      const r = this.currentFilters[n] && this.currentFilters[n].length > 0;
      i.classList.toggle("ln-filter-active", !!r);
    }
  }, s.prototype._renderRows = function() {
    if (!this.tbody) return;
    const o = this._data, t = this._lastTotal, e = this._lastFiltered;
    if (t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (o.length === 0 || e === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    o.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, s.prototype._renderAll = function() {
    const o = this._data, t = document.createDocumentFragment();
    for (let e = 0; e < o.length; e++) {
      const n = this._buildRow(o[e]);
      if (!n) break;
      t.appendChild(n);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, s.prototype._buildRow = function(o) {
    const t = rt(this.dom, this.name + "-row", "ln-data-table");
    if (!t) return null;
    const e = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!e) return null;
    if (this._fillRow(e, o), e._lnRecord = o, o.id != null && e.setAttribute("data-ln-row-id", o.id), this._selectable && o.id != null && this.selectedIds.has(String(o.id))) {
      e.classList.add("ln-row-selected");
      const n = e.querySelector("[data-ln-row-select]");
      n && (n.checked = !0);
    }
    return e;
  }, s.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
    if (!this._rowHeight) {
      const t = this._buildRow(this._data[0]);
      t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const o = this._data, t = o.length, e = this._rowHeight;
    if (!e || !t) return;
    const i = this.table.getBoundingClientRect().top + window.scrollY, r = this.thead ? this.thead.offsetHeight : 0, d = i + r, b = window.scrollY - d, h = Math.max(0, Math.floor(b / e) - 15), m = Math.min(h + Math.ceil(window.innerHeight / e) + 30, t);
    if (h === this._vStart && m === this._vEnd) return;
    this._vStart = h, this._vEnd = m;
    const E = this.ths.length || 1, T = h * e, L = (t - m) * e, A = document.createDocumentFragment();
    if (T > 0) {
      const I = document.createElement("tr");
      I.className = "ln-data-table__spacer", I.setAttribute("aria-hidden", "true");
      const x = document.createElement("td");
      x.setAttribute("colspan", E), x.style.height = T + "px", I.appendChild(x), A.appendChild(I);
    }
    for (let I = h; I < m; I++) {
      const x = this._buildRow(o[I]);
      x && A.appendChild(x);
    }
    if (L > 0) {
      const I = document.createElement("tr");
      I.className = "ln-data-table__spacer", I.setAttribute("aria-hidden", "true");
      const x = document.createElement("td");
      x.setAttribute("colspan", E), x.style.height = L + "px", I.appendChild(x), A.appendChild(I);
    }
    this.tbody.textContent = "", this.tbody.appendChild(A), this._selectable && this._updateSelectAll();
  }, s.prototype._fillRow = function(o, t) {
    const e = o.querySelectorAll("[data-ln-cell]");
    for (let i = 0; i < e.length; i++) {
      const r = e[i], d = r.getAttribute("data-ln-cell");
      t[d] != null && (r.textContent = t[d]);
    }
    const n = o.querySelectorAll("[data-ln-cell-attr]");
    for (let i = 0; i < n.length; i++) {
      const r = n[i], d = r.getAttribute("data-ln-cell-attr").split(",");
      for (let b = 0; b < d.length; b++) {
        const h = d[b].trim().split(":");
        if (h.length !== 2) continue;
        const m = h[0].trim(), E = h[1].trim();
        t[m] != null && r.setAttribute(E, t[m]);
      }
    }
  }, s.prototype._showEmptyState = function(o) {
    const t = rt(this.dom, o, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, s.prototype._updateFooter = function() {
    const o = this._lastTotal, t = this._lastFiltered, e = t < o;
    if (this._totalSpan && (this._totalSpan.textContent = g(o)), this._filteredSpan && (this._filteredSpan.textContent = e ? g(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !e), this._selectedSpan) {
      const n = this.selectedIds.size;
      this._selectedSpan.textContent = n > 0 ? g(n) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", n === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[l]);
  };
  function a() {
    F(function() {
      new MutationObserver(function(t) {
        t.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(n) {
            n.nodeType === 1 && D(n, u, l, s);
          }) : e.type === "attributes" && D(e.target, u, l, s);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-data-table");
  }
  window[l] = f, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  var u = "ln-icons-sprite", l = "#ln-", v = "#lnc-", p = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), g = null, f = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), a = "lni:", o = "lni:v", t = "1";
  function e() {
    try {
      if (localStorage.getItem(o) !== t) {
        for (var m = localStorage.length - 1; m >= 0; m--) {
          var E = localStorage.key(m);
          E && E.indexOf(a) === 0 && localStorage.removeItem(E);
        }
        localStorage.setItem(o, t);
      }
    } catch {
    }
  }
  e();
  function n() {
    return g || (g = document.getElementById(u), g || (g = document.createElementNS("http://www.w3.org/2000/svg", "svg"), g.id = u, g.setAttribute("hidden", ""), g.setAttribute("aria-hidden", "true"), g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(g, document.body.firstChild))), g;
  }
  function i(m) {
    return m.indexOf(v) === 0 ? s + "/" + m.slice(v.length) + ".svg" : f + "/" + m.slice(l.length) + ".svg";
  }
  function r(m, E) {
    var T = E.match(/viewBox="([^"]+)"/), L = T ? T[1] : "0 0 24 24", A = E.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), I = A ? A[1].trim() : "", x = E.match(/<svg([^>]*)>/i), P = x ? x[1] : "", N = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    N.id = m, N.setAttribute("viewBox", L), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(H) {
      var U = P.match(new RegExp(H + '="([^"]*)"'));
      U && N.setAttribute(H, U[1]);
    }), N.innerHTML = I, n().querySelector("defs").appendChild(N);
  }
  function d(m) {
    if (!(p.has(m) || _.has(m)) && !(m.indexOf(v) === 0 && !s)) {
      var E = m.slice(1);
      try {
        var T = localStorage.getItem(a + E);
        if (T) {
          r(E, T), p.add(m);
          return;
        }
      } catch {
      }
      _.add(m), fetch(i(m)).then(function(L) {
        if (!L.ok) throw new Error(L.status);
        return L.text();
      }).then(function(L) {
        r(E, L), p.add(m), _.delete(m);
        try {
          localStorage.setItem(a + E, L);
        } catch {
        }
      }).catch(function() {
        _.delete(m);
      });
    }
  }
  function b(m) {
    var E = 'use[href^="' + l + '"], use[href^="' + v + '"]', T = m.querySelectorAll ? m.querySelectorAll(E) : [];
    if (m.matches && m.matches(E)) {
      var L = m.getAttribute("href");
      L && d(L);
    }
    Array.prototype.forEach.call(T, function(A) {
      var I = A.getAttribute("href");
      I && d(I);
    });
  }
  function h() {
    b(document), new MutationObserver(function(m) {
      m.forEach(function(E) {
        if (E.type === "childList")
          E.addedNodes.forEach(function(L) {
            L.nodeType === 1 && b(L);
          });
        else if (E.type === "attributes" && E.attributeName === "href") {
          var T = E.target.getAttribute("href");
          T && (T.indexOf(l) === 0 || T.indexOf(v) === 0) && d(T);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h();
})();
