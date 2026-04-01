function M(u, r, b) {
  u.dispatchEvent(new CustomEvent(r, {
    bubbles: !0,
    detail: b || {}
  }));
}
function $(u, r, b) {
  const m = new CustomEvent(r, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return u.dispatchEvent(m), m;
}
function S(u, r) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      S(u, r);
    }), console.warn("[" + r + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  u();
}
function Q(u, r) {
  return new Proxy(Object.assign({}, u), {
    set(b, m, g) {
      const v = b[m];
      return v === g || (b[m] = g, r(m, g, v)), !0;
    }
  });
}
function tt(u, r) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, u(), r && r();
    }));
  };
}
(function() {
  const u = "lnHttp";
  if (window[u] !== void 0) return;
  const r = {};
  document.addEventListener("ln-http:request", function(b) {
    const m = b.detail || {};
    if (!m.url) return;
    const g = b.target, v = (m.method || (m.body ? "POST" : "GET")).toUpperCase(), p = m.abort, f = m.tag;
    let d = m.url;
    p && (r[p] && r[p].abort(), r[p] = new AbortController());
    const c = { Accept: "application/json" };
    m.ajax && (c["X-Requested-With"] = "XMLHttpRequest");
    const i = {
      method: v,
      credentials: "same-origin",
      headers: c
    };
    if (p && (i.signal = r[p].signal), m.body && v === "GET") {
      const n = new URLSearchParams();
      for (const o in m.body)
        m.body[o] != null && n.set(o, m.body[o]);
      const t = n.toString();
      t && (d += (d.includes("?") ? "&" : "?") + t);
    } else m.body && (c["Content-Type"] = "application/json", i.body = JSON.stringify(m.body));
    fetch(d, i).then(function(n) {
      p && delete r[p];
      const t = n.ok, o = n.status;
      return n.json().then(function(e) {
        return { ok: t, status: o, data: e };
      }).catch(function() {
        return { ok: !1, status: o, data: { error: !0, message: "Invalid response" } };
      });
    }).then(function(n) {
      n.tag = f;
      const t = n.ok ? "ln-http:success" : "ln-http:error";
      M(g, t, n);
    }).catch(function(n) {
      p && n.name !== "AbortError" && delete r[p], n.name !== "AbortError" && M(g, "ln-http:error", { tag: f, ok: !1, status: 0, data: { error: !0, message: "Network error" } });
    });
  }), window[u] = !0;
})();
(function() {
  const u = "data-ln-ajax", r = "lnAjax";
  if (window[r] !== void 0) return;
  function b(t, o, e) {
    t.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function m(t, o, e) {
    const s = new CustomEvent(o, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return t.dispatchEvent(s), s;
  }
  function g(t) {
    if (!t.hasAttribute(u) || t[r]) return;
    t[r] = !0;
    const o = c(t);
    v(o.links), p(o.forms);
  }
  function v(t) {
    for (const o of t) {
      if (o[r + "Trigger"] || o.hostname && o.hostname !== window.location.hostname) continue;
      const e = o.getAttribute("href");
      if (e && e.includes("#")) continue;
      const s = function(l) {
        if (l.ctrlKey || l.metaKey || l.button === 1) return;
        l.preventDefault();
        const a = o.getAttribute("href");
        a && d("GET", a, null, o);
      };
      o.addEventListener("click", s), o[r + "Trigger"] = s;
    }
  }
  function p(t) {
    for (const o of t) {
      if (o[r + "Trigger"]) continue;
      const e = function(s) {
        s.preventDefault();
        const l = o.method.toUpperCase(), a = o.action, h = new FormData(o);
        for (const _ of o.querySelectorAll('button, input[type="submit"]'))
          _.disabled = !0;
        d(l, a, h, o, function() {
          for (const _ of o.querySelectorAll('button, input[type="submit"]'))
            _.disabled = !1;
        });
      };
      o.addEventListener("submit", e), o[r + "Trigger"] = e;
    }
  }
  function f(t) {
    if (!t[r]) return;
    const o = c(t);
    for (const e of o.links)
      e[r + "Trigger"] && (e.removeEventListener("click", e[r + "Trigger"]), delete e[r + "Trigger"]);
    for (const e of o.forms)
      e[r + "Trigger"] && (e.removeEventListener("submit", e[r + "Trigger"]), delete e[r + "Trigger"]);
    delete t[r];
  }
  function d(t, o, e, s, l) {
    if (m(s, "ln-ajax:before-start", { method: t, url: o }).defaultPrevented) return;
    b(s, "ln-ajax:start", { method: t, url: o }), s.classList.add("ln-ajax--loading");
    const h = document.createElement("span");
    h.className = "ln-ajax-spinner", s.appendChild(h);
    function _() {
      s.classList.remove("ln-ajax--loading");
      const w = s.querySelector(".ln-ajax-spinner");
      w && w.remove(), l && l();
    }
    let y = o;
    const E = document.querySelector('meta[name="csrf-token"]'), L = E ? E.getAttribute("content") : null;
    e instanceof FormData && L && e.append("_token", L);
    const C = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (L && (C.headers["X-CSRF-TOKEN"] = L), t === "GET" && e) {
      const w = new URLSearchParams(e);
      y = o + (o.includes("?") ? "&" : "?") + w.toString();
    } else t !== "GET" && e && (C.body = e);
    fetch(y, C).then(function(w) {
      const T = w.ok;
      return w.json().then(function(O) {
        return { ok: T, status: w.status, data: O };
      });
    }).then(function(w) {
      const T = w.data;
      if (w.ok) {
        if (T.title && (document.title = T.title), T.content)
          for (const O in T.content) {
            const q = document.getElementById(O);
            q && (q.innerHTML = T.content[O]);
          }
        if (s.tagName === "A") {
          const O = s.getAttribute("href");
          O && window.history.pushState({ ajax: !0 }, "", O);
        } else s.tagName === "FORM" && s.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", y);
        b(s, "ln-ajax:success", { method: t, url: y, data: T });
      } else
        b(s, "ln-ajax:error", { method: t, url: y, status: w.status, data: T });
      if (T.message && window.lnToast) {
        const O = T.message;
        window.lnToast.enqueue({
          type: O.type || (w.ok ? "success" : "error"),
          title: O.title || "",
          message: O.body || ""
        });
      }
      b(s, "ln-ajax:complete", { method: t, url: y }), _();
    }).catch(function(w) {
      b(s, "ln-ajax:error", { method: t, url: y, error: w }), b(s, "ln-ajax:complete", { method: t, url: y }), _();
    });
  }
  function c(t) {
    const o = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(u) !== "false" ? o.links.push(t) : t.tagName === "FORM" && t.getAttribute(u) !== "false" ? o.forms.push(t) : (o.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), o.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), o;
  }
  function i() {
    S(function() {
      new MutationObserver(function(o) {
        for (const e of o)
          if (e.type === "childList") {
            for (const s of e.addedNodes)
              if (s.nodeType === 1 && (g(s), !s.hasAttribute(u))) {
                for (const a of s.querySelectorAll("[" + u + "]"))
                  g(a);
                const l = s.closest && s.closest("[" + u + "]");
                if (l && l.getAttribute(u) !== "false") {
                  const a = c(s);
                  v(a.links), p(a.forms);
                }
              }
          } else e.type === "attributes" && g(e.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-ajax");
  }
  function n() {
    for (const t of document.querySelectorAll("[" + u + "]"))
      g(t);
  }
  window[r] = g, window[r].destroy = f, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const u = "data-ln-modal", r = "lnModal";
  if (window[r] !== void 0) return;
  function b(n) {
    m(n), g(n);
  }
  function m(n) {
    const t = Array.from(n.querySelectorAll("[" + u + "]"));
    n.hasAttribute && n.hasAttribute(u) && t.push(n);
    for (const o of t)
      o[r] || (o[r] = new v(o));
  }
  function g(n) {
    const t = Array.from(n.querySelectorAll("[data-ln-modal-for]"));
    n.hasAttribute && n.hasAttribute("data-ln-modal-for") && t.push(n);
    for (const o of t)
      o[r + "Trigger"] || (o[r + "Trigger"] = !0, o.addEventListener("click", function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const s = o.getAttribute("data-ln-modal-for"), l = document.getElementById(s);
        !l || !l[r] || l[r].toggle();
      }));
  }
  function v(n) {
    this.dom = n, this.isOpen = n.getAttribute(u) === "open";
    const t = this;
    return this._onEscape = function(o) {
      o.key === "Escape" && t.close();
    }, this._onFocusTrap = function(o) {
      if (o.key !== "Tab") return;
      const e = t.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (e.length === 0) return;
      const s = e[0], l = e[e.length - 1];
      o.shiftKey ? document.activeElement === s && (o.preventDefault(), l.focus()) : document.activeElement === l && (o.preventDefault(), s.focus());
    }, this._onClose = function(o) {
      o.preventDefault(), t.close();
    }, c(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  v.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(u, "open");
  }, v.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "close");
  }, v.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, v.prototype.destroy = function() {
    if (!this.dom[r]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const n = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of n)
      t[r + "Close"] && (t.removeEventListener("click", t[r + "Close"]), delete t[r + "Close"]);
    f(this.dom, "ln-modal:destroyed"), delete this.dom[r];
  };
  function p(n) {
    const t = n[r];
    if (!t) return;
    const e = n.getAttribute(u) === "open";
    if (e !== t.isOpen)
      if (e) {
        if (d(n, "ln-modal:before-open").defaultPrevented) {
          n.setAttribute(u, "close");
          return;
        }
        t.isOpen = !0, n.setAttribute("aria-modal", "true"), n.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", t._onEscape), document.addEventListener("keydown", t._onFocusTrap);
        const l = n.querySelector('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])');
        if (l) l.focus();
        else {
          const a = n.querySelector("a[href], button:not([disabled])");
          a && a.focus();
        }
        f(n, "ln-modal:open");
      } else {
        if (d(n, "ln-modal:before-close").defaultPrevented) {
          n.setAttribute(u, "open");
          return;
        }
        t.isOpen = !1, n.removeAttribute("aria-modal"), document.removeEventListener("keydown", t._onEscape), document.removeEventListener("keydown", t._onFocusTrap), f(n, "ln-modal:close"), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function f(n, t, o) {
    n.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: Object.assign({ modalId: n.id, target: n }, {})
    }));
  }
  function d(n, t, o) {
    const e = new CustomEvent(t, {
      bubbles: !0,
      cancelable: !0,
      detail: Object.assign({ modalId: n.id, target: n }, {})
    });
    return n.dispatchEvent(e), e;
  }
  function c(n) {
    const t = n.dom.querySelectorAll("[data-ln-modal-close]");
    for (const o of t)
      o[r + "Close"] || (o.addEventListener("click", n._onClose), o[r + "Close"] = n._onClose);
  }
  function i() {
    S(function() {
      new MutationObserver(function(t) {
        for (let o = 0; o < t.length; o++) {
          const e = t[o];
          if (e.type === "childList")
            for (let s = 0; s < e.addedNodes.length; s++) {
              const l = e.addedNodes[s];
              l.nodeType === 1 && (m(l), g(l));
            }
          else e.type === "attributes" && (e.attributeName === u && e.target[r] ? p(e.target) : (m(e.target), g(e.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "data-ln-modal-for"]
      });
    }, "ln-modal");
  }
  window[r] = b, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const u = "data-ln-nav", r = "lnNav";
  if (window[r] !== void 0) return;
  const b = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const i = history.pushState;
    history.pushState = function() {
      i.apply(history, arguments);
      for (const n of m)
        n();
    }, history._lnNavPatched = !0;
  }
  function g(i) {
    if (!i.hasAttribute(u) || b.has(i)) return;
    const n = i.getAttribute(u);
    if (!n) return;
    const t = v(i, n);
    b.set(i, t), i[r] = t;
  }
  function v(i, n) {
    let t = Array.from(i.querySelectorAll("a"));
    f(t, n, window.location.pathname);
    const o = function() {
      t = Array.from(i.querySelectorAll("a")), f(t, n, window.location.pathname);
    };
    window.addEventListener("popstate", o), m.push(o);
    const e = new MutationObserver(function(s) {
      for (const l of s)
        if (l.type === "childList") {
          for (const a of l.addedNodes)
            if (a.nodeType === 1) {
              if (a.tagName === "A")
                t.push(a), f([a], n, window.location.pathname);
              else if (a.querySelectorAll) {
                const h = Array.from(a.querySelectorAll("a"));
                t = t.concat(h), f(h, n, window.location.pathname);
              }
            }
          for (const a of l.removedNodes)
            if (a.nodeType === 1) {
              if (a.tagName === "A")
                t = t.filter(function(h) {
                  return h !== a;
                });
              else if (a.querySelectorAll) {
                const h = Array.from(a.querySelectorAll("a"));
                t = t.filter(function(_) {
                  return !h.includes(_);
                });
              }
            }
        }
    });
    return e.observe(i, { childList: !0, subtree: !0 }), {
      navElement: i,
      activeClass: n,
      observer: e,
      updateHandler: o,
      destroy: function() {
        e.disconnect(), window.removeEventListener("popstate", o);
        const s = m.indexOf(o);
        s !== -1 && m.splice(s, 1), b.delete(i), delete i[r];
      }
    };
  }
  function p(i) {
    try {
      return new URL(i, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return i.replace(/\/$/, "") || "/";
    }
  }
  function f(i, n, t) {
    const o = p(t);
    for (const e of i) {
      const s = e.getAttribute("href");
      if (!s) continue;
      const l = p(s);
      e.classList.remove(n);
      const a = l === o, h = l !== "/" && o.startsWith(l + "/");
      (a || h) && e.classList.add(n);
    }
  }
  function d() {
    S(function() {
      new MutationObserver(function(n) {
        for (const t of n)
          if (t.type === "childList") {
            for (const o of t.addedNodes)
              if (o.nodeType === 1 && (o.hasAttribute && o.hasAttribute(u) && g(o), o.querySelectorAll))
                for (const e of o.querySelectorAll("[" + u + "]"))
                  g(e);
          } else t.type === "attributes" && t.target.hasAttribute && t.target.hasAttribute(u) && g(t.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-nav");
  }
  window[r] = g;
  function c() {
    for (const i of document.querySelectorAll("[" + u + "]"))
      g(i);
  }
  d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
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
  const r = /* @__PURE__ */ new WeakMap();
  function b(p) {
    if (r.has(p)) return;
    const f = p.getAttribute("data-ln-select");
    let d = {};
    if (f && f.trim() !== "")
      try {
        d = JSON.parse(f);
      } catch (n) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", n);
      }
    const i = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: p.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...d };
    try {
      const n = new u(p, i);
      r.set(p, n);
      const t = p.closest("form");
      t && t.addEventListener("reset", () => {
        setTimeout(() => {
          n.clear(), n.clearOptions(), n.sync();
        }, 0);
      });
    } catch (n) {
      console.warn("[ln-select] Failed to initialize Tom Select:", n);
    }
  }
  function m(p) {
    const f = r.get(p);
    f && (f.destroy(), r.delete(p));
  }
  function g() {
    for (const p of document.querySelectorAll("select[data-ln-select]"))
      b(p);
  }
  function v() {
    S(function() {
      new MutationObserver(function(f) {
        for (const d of f) {
          if (d.type === "attributes") {
            d.target.matches && d.target.matches("select[data-ln-select]") && b(d.target);
            continue;
          }
          for (const c of d.addedNodes)
            if (c.nodeType === 1 && (c.matches && c.matches("select[data-ln-select]") && b(c), c.querySelectorAll))
              for (const i of c.querySelectorAll("select[data-ln-select]"))
                b(i);
          for (const c of d.removedNodes)
            if (c.nodeType === 1 && (c.matches && c.matches("select[data-ln-select]") && m(c), c.querySelectorAll))
              for (const i of c.querySelectorAll("select[data-ln-select]"))
                m(i);
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
    g(), v();
  }) : (g(), v()), window.lnSelect = {
    initialize: b,
    destroy: m,
    getInstance: function(p) {
      return r.get(p);
    }
  };
})();
(function() {
  const u = "data-ln-tabs", r = "lnTabs";
  if (window[r] !== void 0 && window[r] !== null) return;
  function b(d = document.body) {
    m(d);
  }
  function m(d) {
    if (d.nodeType !== 1) return;
    const c = Array.from(d.querySelectorAll("[" + u + "]"));
    d.hasAttribute && d.hasAttribute(u) && c.push(d);
    for (const i of c)
      i[r] || (i[r] = new v(i));
  }
  function g() {
    const d = (location.hash || "").replace("#", ""), c = {};
    if (!d) return c;
    for (const i of d.split("&")) {
      const n = i.indexOf(":");
      n > 0 && (c[i.slice(0, n)] = i.slice(n + 1));
    }
    return c;
  }
  function v(d) {
    return this.dom = d, p.call(this), this;
  }
  function p() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const c of this.tabs) {
      const i = (c.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      i && (this.mapTabs[i] = c);
    }
    for (const c of this.panels) {
      const i = (c.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      i && (this.mapPanels[i] = c);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const d = this;
    this._clickHandlers = [];
    for (const c of this.tabs) {
      if (c[r + "Trigger"]) continue;
      c[r + "Trigger"] = !0;
      const i = function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        const t = (c.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (t)
          if (d.hashEnabled) {
            const o = g();
            o[d.nsKey] = t;
            const e = Object.keys(o).map(function(s) {
              return s + ":" + o[s];
            }).join("&");
            location.hash === "#" + e ? d.activate(t) : location.hash = e;
          } else
            d.activate(t);
      };
      c.addEventListener("click", i), d._clickHandlers.push({ el: c, handler: i });
    }
    this._hashHandler = function() {
      if (!d.hashEnabled) return;
      const c = g();
      d.activate(d.nsKey in c ? c[d.nsKey] : d.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  v.prototype.activate = function(d) {
    var c;
    (!d || !(d in this.mapPanels)) && (d = this.defaultKey);
    for (const i in this.mapTabs) {
      const n = this.mapTabs[i];
      i === d ? (n.setAttribute("data-active", ""), n.setAttribute("aria-selected", "true")) : (n.removeAttribute("data-active"), n.setAttribute("aria-selected", "false"));
    }
    for (const i in this.mapPanels) {
      const n = this.mapPanels[i], t = i === d;
      n.classList.toggle("hidden", !t), n.setAttribute("aria-hidden", t ? "false" : "true");
    }
    if (this.autoFocus) {
      const i = (c = this.mapPanels[d]) == null ? void 0 : c.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      i && setTimeout(() => i.focus({ preventScroll: !0 }), 0);
    }
    M(this.dom, "ln-tabs:change", { key: d, tab: this.mapTabs[d], panel: this.mapPanels[d] });
  }, v.prototype.destroy = function() {
    if (this.dom[r]) {
      for (const { el: d, handler: c } of this._clickHandlers)
        d.removeEventListener("click", c);
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), M(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[r];
    }
  };
  function f() {
    S(function() {
      new MutationObserver(function(c) {
        for (const i of c) {
          if (i.type === "attributes") {
            m(i.target);
            continue;
          }
          for (const n of i.addedNodes)
            m(n);
        }
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-tabs");
  }
  f(), window[r] = b, b(document.body);
})();
(function() {
  const u = "data-ln-toggle", r = "lnToggle";
  if (window[r] !== void 0) return;
  function b(i) {
    m(i), g(i);
  }
  function m(i) {
    const n = Array.from(i.querySelectorAll("[" + u + "]"));
    i.hasAttribute && i.hasAttribute(u) && n.push(i);
    for (const t of n)
      t[r] || (t[r] = new v(t));
  }
  function g(i) {
    const n = Array.from(i.querySelectorAll("[data-ln-toggle-for]"));
    i.hasAttribute && i.hasAttribute("data-ln-toggle-for") && n.push(i);
    for (const t of n) {
      if (t[r + "Trigger"]) return;
      t[r + "Trigger"] = !0, t.addEventListener("click", function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        o.preventDefault();
        const e = t.getAttribute("data-ln-toggle-for"), s = document.getElementById(e);
        if (!s || !s[r]) return;
        const l = t.getAttribute("data-ln-toggle-action") || "toggle";
        s[r][l]();
      });
    }
  }
  function v(i) {
    return this.dom = i, this.isOpen = i.getAttribute(u) === "open", this.isOpen && i.classList.add("open"), this;
  }
  v.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(u, "open");
  }, v.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "close");
  }, v.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, v.prototype.destroy = function() {
    this.dom[r] && (f(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[r]);
  };
  function p(i) {
    const n = i[r];
    if (!n) return;
    const o = i.getAttribute(u) === "open";
    if (o !== n.isOpen)
      if (o) {
        if (d(i, "ln-toggle:before-open", { target: i }).defaultPrevented) {
          i.setAttribute(u, "close");
          return;
        }
        n.isOpen = !0, i.classList.add("open"), f(i, "ln-toggle:open", { target: i });
      } else {
        if (d(i, "ln-toggle:before-close", { target: i }).defaultPrevented) {
          i.setAttribute(u, "open");
          return;
        }
        n.isOpen = !1, i.classList.remove("open"), f(i, "ln-toggle:close", { target: i });
      }
  }
  function f(i, n, t) {
    i.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function d(i, n, t) {
    const o = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: t || {}
    });
    return i.dispatchEvent(o), o;
  }
  function c() {
    S(function() {
      new MutationObserver(function(n) {
        for (let t = 0; t < n.length; t++) {
          const o = n[t];
          if (o.type === "childList")
            for (let e = 0; e < o.addedNodes.length; e++) {
              const s = o.addedNodes[e];
              s.nodeType === 1 && (m(s), g(s));
            }
          else o.type === "attributes" && (o.attributeName === u && o.target[r] ? p(o.target) : (m(o.target), g(o.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "data-ln-toggle-for"]
      });
    }, "ln-toggle");
  }
  window[r] = b, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const u = "data-ln-accordion", r = "lnAccordion";
  if (window[r] !== void 0) return;
  function b(p) {
    m(p);
  }
  function m(p) {
    const f = Array.from(p.querySelectorAll("[" + u + "]"));
    p.hasAttribute && p.hasAttribute(u) && f.push(p);
    for (const d of f)
      d[r] || (d[r] = new g(d));
  }
  function g(p) {
    return this.dom = p, this._onToggleOpen = function(f) {
      const d = p.querySelectorAll("[data-ln-toggle]");
      for (const c of d)
        c !== f.detail.target && c.getAttribute("data-ln-toggle") === "open" && c.setAttribute("data-ln-toggle", "close");
      M(p, "ln-accordion:change", { target: f.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  g.prototype.destroy = function() {
    this.dom[r] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), M(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[r]);
  };
  function v() {
    S(function() {
      new MutationObserver(function(f) {
        for (const d of f)
          if (d.type === "childList")
            for (const c of d.addedNodes)
              c.nodeType === 1 && m(c);
          else d.type === "attributes" && m(d.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-accordion");
  }
  window[r] = b, v(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const u = "data-ln-dropdown", r = "lnDropdown";
  if (window[r] !== void 0) return;
  function b(f) {
    m(f);
  }
  function m(f) {
    const d = Array.from(f.querySelectorAll("[" + u + "]"));
    f.hasAttribute && f.hasAttribute(u) && d.push(f);
    for (const c of d)
      c[r] || (c[r] = new g(c));
  }
  function g(f) {
    if (this.dom = f, this.toggleEl = f.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = f.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const c of this.toggleEl.children)
        c.setAttribute("role", "menuitem");
    const d = this;
    return this._onToggleOpen = function(c) {
      c.detail.target === d.toggleEl && (d.triggerBtn && d.triggerBtn.setAttribute("aria-expanded", "true"), d._teleportToBody(), d._addOutsideClickListener(), d._addScrollRepositionListener(), d._addResizeCloseListener(), v(f, "ln-dropdown:open", { target: c.detail.target }));
    }, this._onToggleClose = function(c) {
      c.detail.target === d.toggleEl && (d.triggerBtn && d.triggerBtn.setAttribute("aria-expanded", "false"), d._removeOutsideClickListener(), d._removeScrollRepositionListener(), d._removeResizeCloseListener(), d._teleportBack(), v(f, "ln-dropdown:close", { target: c.detail.target }));
    }, this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose), this;
  }
  g.prototype._positionMenu = function() {
    const f = this.dom.querySelector("[data-ln-toggle-for]");
    if (!f || !this.toggleEl) return;
    const d = f.getBoundingClientRect(), c = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    c && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const i = this.toggleEl.offsetWidth, n = this.toggleEl.offsetHeight;
    c && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const t = window.innerWidth, o = window.innerHeight, e = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-xs")) * 16 || 4;
    let s;
    d.bottom + e + n <= o ? s = d.bottom + e : d.top - e - n >= 0 ? s = d.top - e - n : s = Math.max(0, o - n);
    let l;
    d.right - i >= 0 ? l = d.right - i : d.left + i <= t ? l = d.left : l = Math.max(0, t - i), this.toggleEl.style.top = s + "px", this.toggleEl.style.left = l + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, g.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, g.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, g.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const f = this;
    this._boundDocClick = function(d) {
      f.dom.contains(d.target) || f.toggleEl && f.toggleEl.contains(d.target) || f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, setTimeout(function() {
      document.addEventListener("click", f._boundDocClick);
    }, 0);
  }, g.prototype._removeOutsideClickListener = function() {
    this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, g.prototype._addScrollRepositionListener = function() {
    const f = this;
    this._boundScrollReposition = function() {
      f._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, g.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, g.prototype._addResizeCloseListener = function() {
    const f = this;
    this._boundResizeClose = function() {
      f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, g.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, g.prototype.destroy = function() {
    this.dom[r] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose), v(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[r]);
  };
  function v(f, d, c) {
    f.dispatchEvent(new CustomEvent(d, {
      bubbles: !0,
      detail: c || {}
    }));
  }
  function p() {
    S(function() {
      new MutationObserver(function(d) {
        for (const c of d)
          if (c.type === "childList")
            for (const i of c.addedNodes)
              i.nodeType === 1 && m(i);
          else c.type === "attributes" && m(c.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-dropdown");
  }
  window[r] = b, p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const u = "data-ln-toast", r = "lnToast", b = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[r] !== void 0 && window[r] !== null) return;
  function m(t = document.body) {
    return g(t), n;
  }
  function g(t) {
    if (!t || t.nodeType !== 1) return;
    const o = Array.from(t.querySelectorAll("[" + u + "]"));
    t.hasAttribute && t.hasAttribute(u) && o.push(t);
    for (const e of o)
      e[r] || new v(e);
  }
  function v(t) {
    this.dom = t, t[r] = this, this.timeoutDefault = parseInt(t.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(t.getAttribute("data-ln-toast-max") || "5", 10);
    for (const o of Array.from(t.querySelectorAll("[data-ln-toast-item]")))
      p(o);
    return this;
  }
  v.prototype.destroy = function() {
    if (this.dom[r]) {
      for (const t of Array.from(this.dom.children))
        d(t);
      delete this.dom[r];
    }
  };
  function p(t) {
    const o = ((t.getAttribute("data-type") || "info") + "").toLowerCase(), e = t.getAttribute("data-title"), s = (t.innerText || t.textContent || "").trim();
    t.className = "ln-toast__item", t.removeAttribute("data-ln-toast-item");
    const l = document.createElement("div");
    l.className = "ln-toast__card ln-toast__card--" + o, l.setAttribute("role", o === "error" ? "alert" : "status"), l.setAttribute("aria-live", o === "error" ? "assertive" : "polite");
    const a = document.createElement("div");
    a.className = "ln-toast__side", a.innerHTML = b[o] || b.info;
    const h = document.createElement("div");
    h.className = "ln-toast__content";
    const _ = document.createElement("div");
    _.className = "ln-toast__head";
    const y = document.createElement("strong");
    y.className = "ln-toast__title", y.textContent = e || (o === "success" ? "Success" : o === "error" ? "Error" : o === "warn" ? "Warning" : "Information");
    const E = document.createElement("button");
    if (E.type = "button", E.className = "ln-toast__close ln-icon-close", E.setAttribute("aria-label", "Close"), E.addEventListener("click", () => d(t)), _.appendChild(y), h.appendChild(_), h.appendChild(E), s) {
      const L = document.createElement("div");
      L.className = "ln-toast__body";
      const C = document.createElement("p");
      C.textContent = s, L.appendChild(C), h.appendChild(L);
    }
    l.appendChild(a), l.appendChild(h), t.innerHTML = "", t.appendChild(l), requestAnimationFrame(() => t.classList.add("ln-toast__item--in"));
  }
  function f(t, o) {
    for (; t.dom.children.length >= t.max; ) t.dom.removeChild(t.dom.firstElementChild);
    t.dom.appendChild(o), requestAnimationFrame(() => o.classList.add("ln-toast__item--in"));
  }
  function d(t) {
    !t || !t.parentNode || (clearTimeout(t._timer), t.classList.remove("ln-toast__item--in"), t.classList.add("ln-toast__item--out"), setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t);
    }, 200));
  }
  function c(t = {}) {
    let o = t.container;
    if (typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !o)
      return console.warn("[ln-toast] No toast container found"), null;
    const e = o[r] || new v(o), s = Number.isFinite(t.timeout) ? t.timeout : e.timeoutDefault, l = (t.type || "info").toLowerCase(), a = document.createElement("li");
    a.className = "ln-toast__item";
    const h = document.createElement("div");
    h.className = "ln-toast__card ln-toast__card--" + l, h.setAttribute("role", l === "error" ? "alert" : "status"), h.setAttribute("aria-live", l === "error" ? "assertive" : "polite");
    const _ = document.createElement("div");
    _.className = "ln-toast__side", _.innerHTML = b[l] || b.info;
    const y = document.createElement("div");
    y.className = "ln-toast__content";
    const E = document.createElement("div");
    E.className = "ln-toast__head";
    const L = document.createElement("strong");
    L.className = "ln-toast__title", L.textContent = t.title || (l === "success" ? "Success" : l === "error" ? "Error" : l === "warn" ? "Warning" : "Information");
    const C = document.createElement("button");
    if (C.type = "button", C.className = "ln-toast__close ln-icon-close", C.setAttribute("aria-label", "Close"), C.addEventListener("click", () => d(a)), E.appendChild(L), y.appendChild(E), y.appendChild(C), t.message || t.data && t.data.errors) {
      const w = document.createElement("div");
      if (w.className = "ln-toast__body", t.message)
        if (Array.isArray(t.message)) {
          const T = document.createElement("ul");
          for (const O of t.message) {
            const q = document.createElement("li");
            q.textContent = O, T.appendChild(q);
          }
          w.appendChild(T);
        } else {
          const T = document.createElement("p");
          T.textContent = t.message, w.appendChild(T);
        }
      if (t.data && t.data.errors) {
        const T = document.createElement("ul");
        for (const O of Object.values(t.data.errors).flat()) {
          const q = document.createElement("li");
          q.textContent = O, T.appendChild(q);
        }
        w.appendChild(T);
      }
      y.appendChild(w);
    }
    return h.appendChild(_), h.appendChild(y), a.appendChild(h), f(e, a), s > 0 && (a._timer = setTimeout(() => d(a), s)), a;
  }
  function i(t) {
    let o = t;
    if (typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !!o)
      for (const e of Array.from(o.children))
        d(e);
  }
  const n = function(t) {
    return m(t);
  };
  n.enqueue = c, n.clear = i, S(function() {
    new MutationObserver(function(o) {
      for (const e of o) {
        if (e.type === "attributes") {
          g(e.target);
          continue;
        }
        for (const s of e.addedNodes)
          g(s);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
  }, "ln-toast"), window[r] = n, window.addEventListener("ln-toast:enqueue", function(t) {
    t.detail && n.enqueue(t.detail);
  }), m(document.body);
})();
(function() {
  const u = "data-ln-upload", r = "lnUpload", b = "data-ln-upload-dict", m = "data-ln-upload-accept", g = "data-ln-upload-context";
  if (window[r] !== void 0) return;
  function v(e, s) {
    const l = e.querySelector("[" + b + '="' + s + '"]');
    return l ? l.textContent : s;
  }
  function p(e) {
    if (e === 0) return "0 B";
    const s = 1024, l = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(e) / Math.log(s));
    return parseFloat((e / Math.pow(s, a)).toFixed(1)) + " " + l[a];
  }
  function f(e) {
    return e.split(".").pop().toLowerCase();
  }
  function d(e) {
    return e === "docx" && (e = "doc"), ["pdf", "doc", "epub"].includes(e) ? "ln-icon-file-" + e : "ln-icon-file";
  }
  function c(e, s) {
    if (!s) return !0;
    const l = "." + f(e.name);
    return s.split(",").map(function(h) {
      return h.trim().toLowerCase();
    }).includes(l.toLowerCase());
  }
  function i(e, s, l) {
    e.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: l
    }));
  }
  function n(e) {
    if (e.hasAttribute("data-ln-upload-initialized")) return;
    e.setAttribute("data-ln-upload-initialized", "true");
    const s = e.querySelector(".ln-upload__zone"), l = e.querySelector(".ln-upload__list"), a = e.getAttribute(m) || "";
    if (!s || !l) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", e);
      return;
    }
    let h = e.querySelector('input[type="file"]');
    h || (h = document.createElement("input"), h.type = "file", h.multiple = !0, h.classList.add("hidden"), a && (h.accept = a.split(",").map(function(A) {
      return A = A.trim(), A.startsWith(".") ? A : "." + A;
    }).join(",")), e.appendChild(h));
    const _ = e.getAttribute(u) || "/files/upload", y = e.getAttribute(g) || "", E = /* @__PURE__ */ new Map();
    let L = 0;
    function C() {
      const A = document.querySelector('meta[name="csrf-token"]');
      return A ? A.getAttribute("content") : "";
    }
    function w(A) {
      if (!c(A, a)) {
        const k = v(e, "invalid-type");
        i(e, "ln-upload:invalid", {
          file: A,
          message: k
        }), i(window, "ln-toast:enqueue", {
          type: "error",
          title: "Invalid File",
          message: k || "This file type is not allowed"
        });
        return;
      }
      const x = "file-" + ++L, D = f(A.name), F = d(D), N = document.createElement("li");
      N.className = "ln-upload__item ln-upload__item--uploading " + F, N.setAttribute("data-file-id", x);
      const z = document.createElement("span");
      z.className = "ln-upload__name", z.textContent = A.name;
      const B = document.createElement("span");
      B.className = "ln-upload__size", B.textContent = "0%";
      const R = document.createElement("button");
      R.type = "button", R.className = "ln-upload__remove ln-icon-close", R.title = v(e, "remove"), R.textContent = "×", R.disabled = !0;
      const U = document.createElement("div");
      U.className = "ln-upload__progress";
      const H = document.createElement("div");
      H.className = "ln-upload__progress-bar", U.appendChild(H), N.appendChild(z), N.appendChild(B), N.appendChild(R), N.appendChild(U), l.appendChild(N);
      const j = new FormData();
      j.append("file", A), j.append("context", y);
      const I = new XMLHttpRequest();
      I.upload.addEventListener("progress", function(k) {
        if (k.lengthComputable) {
          const P = Math.round(k.loaded / k.total * 100);
          H.style.width = P + "%", B.textContent = P + "%";
        }
      }), I.addEventListener("load", function() {
        if (I.status >= 200 && I.status < 300) {
          let k;
          try {
            k = JSON.parse(I.responseText);
          } catch {
            K("Invalid response");
            return;
          }
          N.classList.remove("ln-upload__item--uploading"), B.textContent = p(k.size || A.size), R.disabled = !1, E.set(x, {
            serverId: k.id,
            name: k.name,
            size: k.size
          }), T(), i(e, "ln-upload:uploaded", {
            localId: x,
            serverId: k.id,
            name: k.name
          });
        } else {
          let k = "Upload failed";
          try {
            k = JSON.parse(I.responseText).message || k;
          } catch {
          }
          K(k);
        }
      }), I.addEventListener("error", function() {
        K("Network error");
      });
      function K(k) {
        N.classList.remove("ln-upload__item--uploading"), N.classList.add("ln-upload__item--error"), H.style.width = "100%", B.textContent = v(e, "error"), R.disabled = !1, i(e, "ln-upload:error", {
          file: A,
          message: k
        }), i(window, "ln-toast:enqueue", {
          type: "error",
          title: "Upload Error",
          message: k || v(e, "upload-failed") || "Failed to upload file"
        });
      }
      I.open("POST", _), I.setRequestHeader("X-CSRF-TOKEN", C()), I.setRequestHeader("Accept", "application/json"), I.send(j);
    }
    function T() {
      for (const A of e.querySelectorAll('input[name="file_ids[]"]'))
        A.remove();
      for (const [, A] of E) {
        const x = document.createElement("input");
        x.type = "hidden", x.name = "file_ids[]", x.value = A.serverId, e.appendChild(x);
      }
    }
    function O(A) {
      const x = E.get(A), D = l.querySelector('[data-file-id="' + A + '"]');
      if (!x || !x.serverId) {
        D && D.remove(), E.delete(A), T();
        return;
      }
      D && D.classList.add("ln-upload__item--deleting"), fetch("/files/" + x.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": C(),
          Accept: "application/json"
        }
      }).then(function(F) {
        F.status === 200 ? (D && D.remove(), E.delete(A), T(), i(e, "ln-upload:removed", {
          localId: A,
          serverId: x.serverId
        })) : (D && D.classList.remove("ln-upload__item--deleting"), i(window, "ln-toast:enqueue", {
          type: "error",
          title: "Error",
          message: v(e, "delete-error") || "Failed to delete file"
        }));
      }).catch(function(F) {
        console.warn("[ln-upload] Delete error:", F), D && D.classList.remove("ln-upload__item--deleting"), i(window, "ln-toast:enqueue", {
          type: "error",
          title: "Network Error",
          message: "Could not connect to server"
        });
      });
    }
    function q(A) {
      for (const x of A)
        w(x);
      h.value = "";
    }
    const V = function() {
      h.click();
    }, W = function() {
      q(this.files);
    }, X = function(A) {
      A.preventDefault(), A.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }, Y = function(A) {
      A.preventDefault(), A.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }, G = function(A) {
      A.preventDefault(), A.stopPropagation(), s.classList.remove("ln-upload__zone--dragover");
    }, J = function(A) {
      A.preventDefault(), A.stopPropagation(), s.classList.remove("ln-upload__zone--dragover"), q(A.dataTransfer.files);
    }, Z = function(A) {
      if (A.target.classList.contains("ln-upload__remove")) {
        const x = A.target.closest(".ln-upload__item");
        x && O(x.getAttribute("data-file-id"));
      }
    };
    s.addEventListener("click", V), h.addEventListener("change", W), s.addEventListener("dragenter", X), s.addEventListener("dragover", Y), s.addEventListener("dragleave", G), s.addEventListener("drop", J), l.addEventListener("click", Z), e.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(E.values()).map(function(A) {
          return A.serverId;
        });
      },
      getFiles: function() {
        return Array.from(E.values());
      },
      clear: function() {
        for (const [, A] of E)
          A.serverId && fetch("/files/" + A.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": C(),
              Accept: "application/json"
            }
          });
        E.clear(), l.innerHTML = "", T(), i(e, "ln-upload:cleared", {});
      },
      destroy: function() {
        s.removeEventListener("click", V), h.removeEventListener("change", W), s.removeEventListener("dragenter", X), s.removeEventListener("dragover", Y), s.removeEventListener("dragleave", G), s.removeEventListener("drop", J), l.removeEventListener("click", Z), E.clear(), l.innerHTML = "", T(), e.removeAttribute("data-ln-upload-initialized"), delete e.lnUploadAPI;
      }
    };
  }
  function t() {
    for (const e of document.querySelectorAll("[" + u + "]"))
      n(e);
  }
  function o() {
    S(function() {
      new MutationObserver(function(s) {
        for (const l of s)
          if (l.type === "childList") {
            for (const a of l.addedNodes)
              if (a.nodeType === 1) {
                a.hasAttribute(u) && n(a);
                for (const h of a.querySelectorAll("[" + u + "]"))
                  n(h);
              }
          } else l.type === "attributes" && l.target.hasAttribute(u) && n(l.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-upload");
  }
  window[r] = {
    init: n,
    initAll: t
  }, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const u = "lnExternalLinks";
  if (window[u] !== void 0) return;
  function r(f) {
    return f.hostname && f.hostname !== window.location.hostname;
  }
  function b(f) {
    f.getAttribute("data-ln-external-link") !== "processed" && r(f) && (f.target = "_blank", f.rel = "noopener noreferrer", f.setAttribute("data-ln-external-link", "processed"), M(f, "ln-external-links:processed", {
      link: f,
      href: f.href
    }));
  }
  function m(f) {
    f = f || document.body;
    for (const d of f.querySelectorAll("a, area"))
      b(d);
  }
  function g() {
    document.body.addEventListener("click", function(f) {
      const d = f.target.closest("a, area");
      d && d.getAttribute("data-ln-external-link") === "processed" && M(d, "ln-external-links:clicked", {
        link: d,
        href: d.href,
        text: d.textContent || d.title || ""
      });
    });
  }
  function v() {
    S(function() {
      new MutationObserver(function(d) {
        for (const c of d)
          if (c.type === "childList") {
            for (const i of c.addedNodes)
              if (i.nodeType === 1 && (i.matches && (i.matches("a") || i.matches("area")) && b(i), i.querySelectorAll))
                for (const n of i.querySelectorAll("a, area"))
                  b(n);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }, "ln-external-links");
  }
  function p() {
    g(), v(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[u] = {
    process: m
  }, p();
})();
(function() {
  const u = "data-ln-link", r = "lnLink";
  if (window[r] !== void 0) return;
  let b = null;
  function m() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function g(a) {
    b && (b.textContent = a, b.classList.add("ln-link-status--visible"));
  }
  function v() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function p(a, h) {
    if (h.target.closest("a, button, input, select, textarea")) return;
    const _ = a.querySelector("a");
    if (!_) return;
    const y = _.getAttribute("href");
    if (!y) return;
    if (h.ctrlKey || h.metaKey || h.button === 1) {
      window.open(y, "_blank");
      return;
    }
    $(a, "ln-link:navigate", { target: a, href: y, link: _ }).defaultPrevented || _.click();
  }
  function f(a) {
    const h = a.querySelector("a");
    if (!h) return;
    const _ = h.getAttribute("href");
    _ && g(_);
  }
  function d() {
    v();
  }
  function c(a) {
    a[r + "Row"] || (a[r + "Row"] = !0, a.querySelector("a") && (a._lnLinkClick = function(h) {
      p(a, h);
    }, a._lnLinkEnter = function() {
      f(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", d)));
  }
  function i(a) {
    a[r + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", d), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[r + "Row"]);
  }
  function n(a) {
    if (!a[r + "Init"]) return;
    const h = a.tagName;
    if (h === "TABLE" || h === "TBODY") {
      const _ = h === "TABLE" && a.querySelector("tbody") || a;
      for (const y of _.querySelectorAll("tr"))
        i(y);
    } else
      i(a);
    delete a[r + "Init"];
  }
  function t(a) {
    if (a[r + "Init"]) return;
    a[r + "Init"] = !0;
    const h = a.tagName;
    if (h === "TABLE" || h === "TBODY") {
      const _ = h === "TABLE" && a.querySelector("tbody") || a;
      for (const y of _.querySelectorAll("tr"))
        c(y);
    } else c(a);
  }
  function o(a) {
    a.hasAttribute && a.hasAttribute(u) && t(a);
    const h = a.querySelectorAll ? a.querySelectorAll("[" + u + "]") : [];
    for (const _ of h)
      t(_);
  }
  function e() {
    S(function() {
      new MutationObserver(function(h) {
        for (const _ of h)
          if (_.type === "childList")
            for (const y of _.addedNodes)
              y.nodeType === 1 && (o(y), y.tagName === "TR" && y.closest("[" + u + "]") && c(y));
          else _.type === "attributes" && o(_.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-link");
  }
  function s(a) {
    o(a);
  }
  window[r] = { init: s, destroy: n };
  function l() {
    m(), e(), s(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const u = "[data-ln-progress]", r = "lnProgress";
  if (window[r] !== void 0) return;
  function b(i) {
    const n = i.getAttribute("data-ln-progress");
    return n !== null && n !== "";
  }
  function m(i) {
    g(i);
  }
  function g(i) {
    const n = Array.from(i.querySelectorAll(u));
    for (const t of n)
      b(t) && !t[r] && (t[r] = new v(t));
    i.hasAttribute && i.hasAttribute("data-ln-progress") && b(i) && !i[r] && (i[r] = new v(i));
  }
  function v(i) {
    return this.dom = i, this._attrObserver = null, this._parentObserver = null, c.call(this), f.call(this), d.call(this), this;
  }
  v.prototype.destroy = function() {
    this.dom[r] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[r]);
  };
  function p() {
    new MutationObserver(function(n) {
      for (const t of n)
        if (t.type === "childList")
          for (const o of t.addedNodes)
            o.nodeType === 1 && g(o);
        else t.type === "attributes" && g(t.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-progress"]
    });
  }
  p();
  function f() {
    const i = this, n = new MutationObserver(function(t) {
      for (const o of t)
        (o.attributeName === "data-ln-progress" || o.attributeName === "data-ln-progress-max") && c.call(i);
    });
    n.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = n;
  }
  function d() {
    const i = this, n = this.dom.parentElement;
    if (!n || !n.hasAttribute("data-ln-progress-max")) return;
    const t = new MutationObserver(function(o) {
      for (const e of o)
        e.attributeName === "data-ln-progress-max" && c.call(i);
    });
    t.observe(n, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = t;
  }
  function c() {
    const i = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, n = this.dom.parentElement, o = (n && n.hasAttribute("data-ln-progress-max") ? parseFloat(n.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let e = o > 0 ? i / o * 100 : 0;
    e < 0 && (e = 0), e > 100 && (e = 100), this.dom.style.width = e + "%", M(this.dom, "ln-progress:change", { target: this.dom, value: i, max: o, percentage: e });
  }
  window[r] = m, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const u = "data-ln-filter", r = "lnFilter", b = "data-ln-filter-initialized", m = "data-ln-filter-key", g = "data-ln-filter-value", v = "data-ln-filter-hide", p = "data-active";
  if (window[r] !== void 0) return;
  function f(n) {
    d(n);
  }
  function d(n) {
    const t = n.querySelectorAll("[" + u + "]");
    for (const o of t)
      o[r] || (o[r] = new c(o));
    n.hasAttribute && n.hasAttribute(u) && !n[r] && (n[r] = new c(n));
  }
  function c(n) {
    if (n.hasAttribute(b)) return this;
    this.dom = n, this.targetId = n.getAttribute(u), this.buttons = Array.from(n.querySelectorAll("button")), this._pendingEvents = [];
    const t = this, o = tt(
      function() {
        t._render();
      },
      function() {
        t._afterRender();
      }
    );
    this.state = Q({
      key: null,
      value: null
    }, o), this._attachHandlers();
    for (let e = 0; e < this.buttons.length; e++) {
      const s = this.buttons[e];
      if (s.hasAttribute(p) && s.getAttribute(g) !== "") {
        this.state.key = s.getAttribute(m), this.state.value = s.getAttribute(g);
        break;
      }
    }
    return this.buttons.forEach(function(e) {
      e.setAttribute("aria-pressed", e.hasAttribute(p) ? "true" : "false");
    }), n.setAttribute(b, ""), this;
  }
  c.prototype._attachHandlers = function() {
    const n = this;
    this.buttons.forEach(function(t) {
      t[r + "Bound"] || (t[r + "Bound"] = !0, t.addEventListener("click", function() {
        const o = t.getAttribute(m), e = t.getAttribute(g);
        e === "" ? (n._pendingEvents.push({ name: "ln-filter:changed", detail: { key: o, value: "" } }), n.reset()) : (n._pendingEvents.push({ name: "ln-filter:changed", detail: { key: o, value: e } }), n.state.key = o, n.state.value = e);
      }));
    });
  }, c.prototype._render = function() {
    const n = this, t = this.state.key, o = this.state.value;
    this.buttons.forEach(function(l) {
      const a = l.getAttribute(m), h = l.getAttribute(g);
      let _ = !1;
      t === null && o === null ? _ = h === "" : _ = a === t && h === o, _ ? (l.setAttribute(p, ""), l.setAttribute("aria-pressed", "true")) : (l.removeAttribute(p), l.setAttribute("aria-pressed", "false"));
    });
    const e = document.getElementById(n.targetId);
    if (!e) return;
    const s = e.children;
    for (let l = 0; l < s.length; l++) {
      const a = s[l];
      if (t === null && o === null) {
        a.removeAttribute(v);
        continue;
      }
      const h = a.getAttribute("data-" + t);
      a.removeAttribute(v), h !== null && o && h.toLowerCase() !== o.toLowerCase() && a.setAttribute(v, "true");
    }
  }, c.prototype._afterRender = function() {
    const n = this._pendingEvents;
    this._pendingEvents = [];
    for (let t = 0; t < n.length; t++)
      this._dispatchOnBoth(n[t].name, n[t].detail);
  }, c.prototype._dispatchOnBoth = function(n, t) {
    M(this.dom, n, t);
    const o = document.getElementById(this.targetId);
    o && o !== this.dom && M(o, n, t);
  }, c.prototype.filter = function(n, t) {
    this._pendingEvents.push({ name: "ln-filter:changed", detail: { key: n, value: t } }), this.state.key = n, this.state.value = t;
  }, c.prototype.reset = function() {
    this._pendingEvents.push({ name: "ln-filter:reset", detail: {} }), this.state.key = null, this.state.value = null;
  }, c.prototype.getActive = function() {
    return this.state.key === null && this.state.value === null ? null : { key: this.state.key, value: this.state.value };
  };
  function i() {
    S(function() {
      new MutationObserver(function(t) {
        for (const o of t)
          if (o.type === "childList")
            for (const e of o.addedNodes)
              e.nodeType === 1 && d(e);
          else o.type === "attributes" && d(o.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-filter");
  }
  window[r] = f, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const u = "data-ln-search", r = "lnSearch", b = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[r] !== void 0) return;
  function v(c) {
    p(c);
  }
  function p(c) {
    const i = Array.from(c.querySelectorAll("[" + u + "]"));
    c.hasAttribute && c.hasAttribute(u) && i.push(c), i.forEach(function(n) {
      n[r] || (n[r] = new f(n));
    });
  }
  function f(c) {
    if (c.hasAttribute(b)) return this;
    this.dom = c, this.targetId = c.getAttribute(u);
    const i = c.tagName;
    return this.input = i === "INPUT" || i === "TEXTAREA" ? c : c.querySelector('[name="search"]') || c.querySelector('input[type="search"]') || c.querySelector('input[type="text"]'), this._debounceTimer = null, this._attachHandler(), c.setAttribute(b, ""), this;
  }
  f.prototype._attachHandler = function() {
    if (!this.input) return;
    const c = this;
    this._onInput = function() {
      clearTimeout(c._debounceTimer), c._debounceTimer = setTimeout(function() {
        c._search(c.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, f.prototype._search = function(c) {
    const i = document.getElementById(this.targetId);
    if (!i) return;
    const n = new CustomEvent("ln-search:change", {
      bubbles: !0,
      cancelable: !0,
      detail: { term: c, targetId: this.targetId }
    });
    if (!i.dispatchEvent(n)) return;
    const t = i.children;
    t.length;
    for (let o = 0; o < t.length; o++) {
      const e = t[o];
      e.removeAttribute(m), c && !e.textContent.replace(/\s+/g, " ").toLowerCase().includes(c) && e.setAttribute(m, "true");
    }
  }, f.prototype.destroy = function() {
    this.dom[r] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this.dom.removeAttribute(b), delete this.dom[r]);
  };
  function d() {
    S(function() {
      new MutationObserver(function(i) {
        i.forEach(function(n) {
          n.type === "childList" ? n.addedNodes.forEach(function(t) {
            t.nodeType === 1 && p(t);
          }) : n.type === "attributes" && p(n.target);
        });
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-search");
  }
  window[r] = v, d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "lnTableSort", r = "data-ln-sort", b = "data-ln-sort-active";
  if (window[u] !== void 0) return;
  function m(d) {
    g(d);
  }
  function g(d) {
    const c = Array.from(d.querySelectorAll("table"));
    d.tagName === "TABLE" && c.push(d), c.forEach(function(i) {
      if (i[u]) return;
      const n = Array.from(i.querySelectorAll("th[" + r + "]"));
      n.length && (i[u] = new v(i, n));
    });
  }
  function v(d, c) {
    this.table = d, this.ths = c, this._col = -1, this._dir = null;
    const i = this;
    return c.forEach(function(n, t) {
      n[u + "Bound"] || (n[u + "Bound"] = !0, n.addEventListener("click", function() {
        i._handleClick(t, n);
      }));
    }), this;
  }
  v.prototype._handleClick = function(d, c) {
    let i;
    this._col !== d ? i = "asc" : this._dir === "asc" ? i = "desc" : this._dir === "desc" ? i = null : i = "asc", this.ths.forEach(function(n) {
      n.removeAttribute(b);
    }), i === null ? (this._col = -1, this._dir = null) : (this._col = d, this._dir = i, c.setAttribute(b, i)), p(this.table, "ln-table:sort", {
      column: d,
      sortType: c.getAttribute(r),
      direction: i
    });
  };
  function p(d, c, i) {
    d.dispatchEvent(new CustomEvent(c, {
      bubbles: !0,
      detail: i || {}
    }));
  }
  function f() {
    S(function() {
      new MutationObserver(function(c) {
        c.forEach(function(i) {
          i.type === "childList" ? i.addedNodes.forEach(function(n) {
            n.nodeType === 1 && g(n);
          }) : i.type === "attributes" && g(i.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [r] });
    }, "ln-table-sort");
  }
  window[u] = m, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const u = "data-ln-table", r = "lnTable", b = "data-ln-sort", m = "data-ln-table-empty";
  if (window[r] !== void 0) return;
  const p = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function f(t) {
    d(t);
  }
  function d(t) {
    const o = Array.from(t.querySelectorAll("[" + u + "]"));
    t.hasAttribute && t.hasAttribute(u) && o.push(t), o.forEach(function(e) {
      e[r] || (e[r] = new c(e));
    });
  }
  function c(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("tbody"), this.thead = t.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const o = t.querySelector(".ln-table__toolbar");
    o && t.style.setProperty("--ln-table-toolbar-h", o.offsetHeight + "px");
    const e = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      const s = new MutationObserver(function() {
        e.tbody.rows.length > 0 && (s.disconnect(), e._parseRows());
      });
      s.observe(this.tbody, { childList: !0 });
    }
    return this._onSearch = function(s) {
      s.preventDefault(), e._searchTerm = s.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), i(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onSort = function(s) {
      e._sortCol = s.detail.direction === null ? -1 : s.detail.column, e._sortDir = s.detail.direction, e._sortType = s.detail.sortType, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), i(t, "ln-table:sorted", {
        column: s.detail.column,
        direction: s.detail.direction,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(s) {
      const l = s.detail.key, a = s.detail.value;
      a ? e._columnFilters[l] = a.toLowerCase() : delete e._columnFilters[l], e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), i(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-filter:changed", this._onColumnFilter), this;
  }
  c.prototype._parseRows = function() {
    const t = this.tbody.rows, o = this.ths;
    this._data = [];
    const e = [];
    for (let s = 0; s < o.length; s++)
      e[s] = o[s].getAttribute(b);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let s = 0; s < t.length; s++) {
      const l = t[s], a = [], h = [], _ = [];
      for (let y = 0; y < l.cells.length; y++) {
        const E = l.cells[y], L = E.textContent.trim(), C = E.hasAttribute("data-ln-value") ? E.getAttribute("data-ln-value") : L, w = e[y];
        h[y] = L.toLowerCase(), w === "number" || w === "date" ? a[y] = parseFloat(C) || 0 : w === "string" ? a[y] = String(C) : a[y] = null, y < l.cells.length - 1 && _.push(L.toLowerCase());
      }
      this._data.push({
        sortKeys: a,
        rawTexts: h,
        html: l.outerHTML,
        searchText: _.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), i(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, c.prototype._applyFilterAndSort = function() {
    const t = this._searchTerm, o = this._columnFilters, e = Object.keys(o).length > 0, s = this.ths, l = {};
    if (e)
      for (let E = 0; E < s.length; E++) {
        const L = s[E].getAttribute("data-ln-filter-col");
        L && (l[L] = E);
      }
    if (!t && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(E) {
      if (t && E.searchText.indexOf(t) === -1) return !1;
      if (e)
        for (const L in o) {
          const C = l[L];
          if (C !== void 0 && E.rawTexts[C] !== o[L]) return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const a = this._sortCol, h = this._sortDir === "desc" ? -1 : 1, _ = this._sortType === "number" || this._sortType === "date", y = p ? p.compare : function(E, L) {
      return E < L ? -1 : E > L ? 1 : 0;
    };
    this._filteredData.sort(function(E, L) {
      const C = E.sortKeys[a], w = L.sortKeys[a];
      return _ ? (C - w) * h : y(C, w) * h;
    });
  }, c.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(o) {
      const e = document.createElement("col");
      e.style.width = o.offsetWidth + "px", t.appendChild(e);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, c.prototype._render = function() {
    if (!this.tbody) return;
    const t = this._filteredData.length;
    t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, c.prototype._renderAll = function() {
    const t = [], o = this._filteredData;
    for (let e = 0; e < o.length; e++) t.push(o[e].html);
    this.tbody.innerHTML = t.join("");
  }, c.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const t = this;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, c.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, c.prototype._renderVirtual = function() {
    const t = this._filteredData, o = t.length, e = this._rowHeight;
    if (!e || !o) return;
    const l = this.table.getBoundingClientRect().top + window.scrollY, a = this.thead ? this.thead.offsetHeight : 0, h = l + a, _ = window.scrollY - h, y = Math.max(0, Math.floor(_ / e) - 15), E = Math.min(y + Math.ceil(window.innerHeight / e) + 30, o);
    if (y === this._vStart && E === this._vEnd) return;
    this._vStart = y, this._vEnd = E;
    const L = this.ths.length || 1, C = y * e, w = (o - E) * e, T = "";
    C > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + L + '" style="height:' + C + 'px;padding:0;border:none"></td></tr>');
    for (let O = y; O < E; O++) T += t[O].html;
    w > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + L + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = T;
  }, c.prototype._showEmptyState = function() {
    const t = this.ths.length || 1, o = this.dom.querySelector("template[" + m + "]"), e = document.createElement("td");
    e.setAttribute("colspan", String(t)), o && e.appendChild(document.importNode(o.content, !0));
    const s = document.createElement("tr");
    s.className = "ln-table__empty", s.appendChild(e), this.tbody.innerHTML = "", this.tbody.appendChild(s), i(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, c.prototype.destroy = function() {
    this.dom[r] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[r]);
  };
  function i(t, o, e) {
    t.dispatchEvent(new CustomEvent(o, { bubbles: !0, detail: e || {} }));
  }
  function n() {
    S(function() {
      new MutationObserver(function(o) {
        o.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(s) {
            s.nodeType === 1 && d(s);
          }) : e.type === "attributes" && d(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-table");
  }
  window[r] = f, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const u = "[data-ln-circular-progress]", r = "lnCircularProgress";
  if (window[r] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", m = 36, g = 16, v = 2 * Math.PI * g;
  function p(e) {
    f(e);
  }
  function f(e) {
    const s = Array.from(e.querySelectorAll(u));
    for (const l of s)
      l[r] || (l[r] = new d(l));
    e.hasAttribute && e.hasAttribute("data-ln-circular-progress") && !e[r] && (e[r] = new d(e));
  }
  function d(e) {
    return this.dom = e, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, i.call(this), o.call(this), t.call(this), e.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  d.prototype.destroy = function() {
    this.dom[r] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[r]);
  };
  function c(e, s) {
    const l = document.createElementNS(b, e);
    for (const a in s)
      l.setAttribute(a, s[a]);
    return l;
  }
  function i() {
    this.svg = c("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = c("circle", {
      cx: m / 2,
      cy: m / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = c("circle", {
      cx: m / 2,
      cy: m / 2,
      r: g,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": v,
      "stroke-dashoffset": v,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function n() {
    new MutationObserver(function(s) {
      for (const l of s)
        if (l.type === "childList")
          for (const a of l.addedNodes)
            a.nodeType === 1 && f(a);
        else l.type === "attributes" && f(l.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress"]
    });
  }
  n();
  function t() {
    const e = this, s = new MutationObserver(function(l) {
      for (const a of l)
        (a.attributeName === "data-ln-circular-progress" || a.attributeName === "data-ln-circular-progress-max") && o.call(e);
    });
    s.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = s;
  }
  function o() {
    const e = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, s = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let l = s > 0 ? e / s * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100);
    const a = v - l / 100 * v;
    this.progressCircle.setAttribute("stroke-dashoffset", a);
    const h = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = h !== null ? h : Math.round(l) + "%", M(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: e,
      max: s,
      percentage: l
    });
  }
  window[r] = p, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const u = "data-ln-sortable", r = "lnSortable", b = "data-ln-sortable-handle";
  if (window[r] !== void 0) return;
  function m(i) {
    g(i);
  }
  function g(i) {
    const n = Array.from(i.querySelectorAll("[" + u + "]"));
    i.hasAttribute && i.hasAttribute(u) && n.push(i);
    for (const t of n)
      t[r] || (t[r] = new v(t));
  }
  function v(i) {
    this.dom = i, this.isEnabled = i.getAttribute(u) !== "disabled", this._dragging = null, i.setAttribute("aria-roledescription", "sortable list");
    const n = this;
    return this._onPointerDown = function(t) {
      n.isEnabled && n._handlePointerDown(t);
    }, i.addEventListener("pointerdown", this._onPointerDown), this;
  }
  v.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(u, "");
  }, v.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(u, "disabled");
  }, v.prototype.destroy = function() {
    this.dom[r] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), f(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[r]);
  };
  function p(i) {
    const n = i[r];
    if (!n) return;
    const t = i.getAttribute(u) !== "disabled";
    t !== n.isEnabled && (n.isEnabled = t);
  }
  v.prototype._handlePointerDown = function(i) {
    let n = i.target.closest("[" + b + "]"), t;
    if (n) {
      for (t = n; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (t = i.target; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
      n = t;
    }
    const e = Array.from(this.dom.children).indexOf(t);
    if (d(this.dom, "ln-sortable:before-drag", {
      item: t,
      index: e
    }).defaultPrevented) return;
    i.preventDefault(), n.setPointerCapture(i.pointerId), this._dragging = t, t.classList.add("ln-sortable--dragging"), t.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), f(this.dom, "ln-sortable:drag-start", {
      item: t,
      index: e
    });
    const l = this, a = function(_) {
      l._handlePointerMove(_);
    }, h = function(_) {
      l._handlePointerEnd(_), n.removeEventListener("pointermove", a), n.removeEventListener("pointerup", h), n.removeEventListener("pointercancel", h);
    };
    n.addEventListener("pointermove", a), n.addEventListener("pointerup", h), n.addEventListener("pointercancel", h);
  }, v.prototype._handlePointerMove = function(i) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), t = this._dragging;
    for (const o of n)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const o of n) {
      if (o === t) continue;
      const e = o.getBoundingClientRect(), s = e.top + e.height / 2;
      if (i.clientY >= e.top && i.clientY < s) {
        o.classList.add("ln-sortable--drop-before");
        break;
      } else if (i.clientY >= s && i.clientY <= e.bottom) {
        o.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, v.prototype._handlePointerEnd = function(i) {
    if (!this._dragging) return;
    const n = this._dragging, t = Array.from(this.dom.children), o = t.indexOf(n);
    let e = null, s = null;
    for (const l of t) {
      if (l.classList.contains("ln-sortable--drop-before")) {
        e = l, s = "before";
        break;
      }
      if (l.classList.contains("ln-sortable--drop-after")) {
        e = l, s = "after";
        break;
      }
    }
    for (const l of t)
      l.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== n) {
      s === "before" ? this.dom.insertBefore(n, e) : this.dom.insertBefore(n, e.nextElementSibling);
      const a = Array.from(this.dom.children).indexOf(n);
      f(this.dom, "ln-sortable:reordered", {
        item: n,
        oldIndex: o,
        newIndex: a
      });
    }
    this._dragging = null;
  };
  function f(i, n, t) {
    i.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function d(i, n, t) {
    const o = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: t || {}
    });
    return i.dispatchEvent(o), o;
  }
  function c() {
    S(function() {
      new MutationObserver(function(n) {
        for (let t = 0; t < n.length; t++) {
          const o = n[t];
          if (o.type === "childList")
            for (let e = 0; e < o.addedNodes.length; e++) {
              const s = o.addedNodes[e];
              s.nodeType === 1 && g(s);
            }
          else o.type === "attributes" && (o.attributeName === u && o.target[r] ? p(o.target) : g(o.target));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-sortable");
  }
  window[r] = m, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const u = "data-ln-confirm", r = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[r] !== void 0) return;
  function g(i) {
    v(i);
  }
  function v(i) {
    const n = Array.from(i.querySelectorAll("[" + u + "]"));
    i.hasAttribute && i.hasAttribute(u) && n.push(i);
    for (const t of n)
      t[r] || (t[r] = new p(t));
  }
  function p(i) {
    this.dom = i, this.confirming = !1, this.originalText = i.textContent.trim(), this.confirmText = i.getAttribute(u) || "Confirm?", this.revertTimer = null;
    const n = this;
    return this._onClick = function(t) {
      n.confirming ? n._reset() : (t.preventDefault(), t.stopImmediatePropagation(), n._enterConfirm());
    }, i.addEventListener("click", this._onClick), this;
  }
  p.prototype._getTimeout = function() {
    const i = parseFloat(this.dom.getAttribute(b));
    return isNaN(i) || i <= 0 ? 3 : i;
  }, p.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.dom.className.match(/ln-icon-/) && this.originalText === "" ? (this.isIconButton = !0, this.originalIconClass = Array.from(this.dom.classList).find(function(i) {
      return i.startsWith("ln-icon-");
    }), this.originalIconClass && this.dom.classList.remove(this.originalIconClass), this.dom.classList.add("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), d(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, p.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const i = this, n = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      i._reset();
    }, n);
  }, p.prototype._reset = function() {
    this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton ? (this.dom.classList.remove("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.originalIconClass && this.dom.classList.add(this.originalIconClass), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1) : this.dom.textContent = this.originalText, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, p.prototype.destroy = function() {
    this.dom[r] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[r]);
  };
  function f(i) {
    const n = i[r];
    !n || !n.confirming || n._startTimer();
  }
  function d(i, n, t) {
    i.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function c() {
    S(function() {
      new MutationObserver(function(n) {
        for (let t = 0; t < n.length; t++) {
          const o = n[t];
          if (o.type === "childList")
            for (let e = 0; e < o.addedNodes.length; e++) {
              const s = o.addedNodes[e];
              s.nodeType === 1 && v(s);
            }
          else o.type === "attributes" && (o.attributeName === b && o.target[r] ? f(o.target) : v(o.target));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, b]
      });
    }, "ln-confirm");
  }
  window[r] = g, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const u = "data-ln-translations", r = "lnTranslations";
  if (window[r] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  }, m = {};
  function g(n) {
    return m[n] || (m[n] = document.querySelector('[data-ln-template="' + n + '"]')), m[n].content.cloneNode(!0);
  }
  function v(n) {
    p(n);
  }
  function p(n) {
    const t = Array.from(n.querySelectorAll("[" + u + "]"));
    n.hasAttribute && n.hasAttribute(u) && t.push(n);
    for (const o of t)
      o[r] || (o[r] = new f(o));
  }
  function f(n) {
    this.dom = n, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = n.getAttribute(u + "-default") || "", this.badgesEl = n.querySelector("[" + u + "-active]"), this.menuEl = n.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const t = n.getAttribute(u + "-locales");
    if (this.locales = b, t)
      try {
        this.locales = JSON.parse(t);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const o = this;
    return this._onRequestAdd = function(e) {
      e.detail && e.detail.lang && o.addLanguage(e.detail.lang);
    }, this._onRequestRemove = function(e) {
      e.detail && e.detail.lang && o.removeLanguage(e.detail.lang);
    }, n.addEventListener("ln-translations:request-add", this._onRequestAdd), n.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  f.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const n = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const t of n) {
      const o = t.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const e of o)
        e.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, f.prototype._detectExisting = function() {
    const n = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const t of n) {
      const o = t.getAttribute("data-ln-translatable-lang");
      o && o !== this.defaultLang && this.activeLanguages.add(o);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, f.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const n = this;
    let t = 0;
    for (const e in this.locales) {
      if (!this.locales.hasOwnProperty(e) || this.activeLanguages.has(e)) continue;
      t++;
      const s = g("ln-translations-menu-item"), l = s.querySelector("[data-ln-translations-lang]");
      l.setAttribute("data-ln-translations-lang", e), l.textContent = this.locales[e], l.addEventListener("click", function(a) {
        a.ctrlKey || a.metaKey || a.button === 1 || (a.preventDefault(), a.stopPropagation(), n.menuEl.getAttribute("data-ln-toggle") === "open" && n.menuEl.setAttribute("data-ln-toggle", "close"), n.addLanguage(e));
      }), this.menuEl.appendChild(s);
    }
    const o = this.dom.querySelector("[" + u + "-add]");
    o && (o.style.display = t === 0 ? "none" : "");
  }, f.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const n = this;
    this.activeLanguages.forEach(function(t) {
      const o = g("ln-translations-badge"), e = o.querySelector("[data-ln-translations-lang]");
      e.setAttribute("data-ln-translations-lang", t);
      const s = e.querySelector("span");
      s.textContent = n.locales[t] || t.toUpperCase();
      const l = e.querySelector("button");
      l.setAttribute("aria-label", "Remove " + (n.locales[t] || t.toUpperCase())), l.addEventListener("click", function(a) {
        a.ctrlKey || a.metaKey || a.button === 1 || (a.preventDefault(), a.stopPropagation(), n.removeLanguage(t));
      }), n.badgesEl.appendChild(o);
    });
  }, f.prototype.addLanguage = function(n, t) {
    if (this.activeLanguages.has(n)) return;
    const o = this.locales[n] || n;
    if (c(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: n,
      langName: o
    }).defaultPrevented) return;
    this.activeLanguages.add(n), t = t || {};
    const s = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const l of s) {
      const a = l.getAttribute("data-ln-translatable"), h = l.getAttribute("data-ln-translations-prefix") || "", _ = l.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!_) continue;
      const y = _.cloneNode(!1);
      h ? y.name = h + "[trans][" + n + "][" + a + "]" : y.name = "trans[" + n + "][" + a + "]", y.value = t[a] !== void 0 ? t[a] : "", y.removeAttribute("id"), y.placeholder = o + " translation", y.setAttribute("data-ln-translatable-lang", n);
      const E = l.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), L = E.length > 0 ? E[E.length - 1] : _;
      L.parentNode.insertBefore(y, L.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), d(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: n,
      langName: o
    });
  }, f.prototype.removeLanguage = function(n) {
    if (!this.activeLanguages.has(n) || c(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: n
    }).defaultPrevented) return;
    const o = this.dom.querySelectorAll('[data-ln-translatable-lang="' + n + '"]');
    for (const e of o)
      e.parentNode.removeChild(e);
    this.activeLanguages.delete(n), this._updateDropdown(), this._updateBadges(), d(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: n
    });
  }, f.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, f.prototype.hasLanguage = function(n) {
    return this.activeLanguages.has(n);
  }, f.prototype.destroy = function() {
    if (!this.dom[r]) return;
    const n = this.defaultLang, t = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const o of t)
      o.getAttribute("data-ln-translatable-lang") !== n && o.parentNode.removeChild(o);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[r];
  };
  function d(n, t, o) {
    n.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: o || {}
    }));
  }
  function c(n, t, o) {
    const e = new CustomEvent(t, {
      bubbles: !0,
      cancelable: !0,
      detail: o || {}
    });
    return n.dispatchEvent(e), e;
  }
  function i() {
    S(function() {
      new MutationObserver(function(t) {
        for (const o of t)
          if (o.type === "childList")
            for (const e of o.addedNodes)
              e.nodeType === 1 && p(e);
          else o.type === "attributes" && p(o.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-translations");
  }
  window[r] = v, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-autosave", r = "lnAutosave", b = "data-ln-autosave-clear", m = "ln-autosave:";
  if (window[r] !== void 0) return;
  function g(e) {
    v(e);
  }
  function v(e) {
    const s = Array.from(e.querySelectorAll("[" + u + "]"));
    e.hasAttribute && e.hasAttribute(u) && s.push(e);
    for (const l of s)
      l[r] || (l[r] = new p(l));
  }
  function p(e) {
    const s = f(e);
    if (!s) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = s;
    const l = this;
    return this._onFocusout = function(a) {
      const h = a.target;
      d(h) && h.name && l.save();
    }, this._onChange = function(a) {
      const h = a.target;
      d(h) && h.name && l.save();
    }, this._onSubmit = function() {
      l.clear();
    }, this._onReset = function() {
      l.clear();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + b + "]") && l.clear();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  p.prototype.save = function() {
    const e = c(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(e));
    } catch {
      return;
    }
    n(this.dom, "ln-autosave:saved", { target: this.dom, data: e });
  }, p.prototype.restore = function() {
    let e;
    try {
      e = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (!e) return;
    let s;
    try {
      s = JSON.parse(e);
    } catch {
      return;
    }
    t(this.dom, "ln-autosave:before-restore", { target: this.dom, data: s }).defaultPrevented || (i(this.dom, s), n(this.dom, "ln-autosave:restored", { target: this.dom, data: s }));
  }, p.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    n(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, p.prototype.destroy = function() {
    this.dom[r] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), n(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[r]);
  };
  function f(e) {
    const l = e.getAttribute(u) || e.id;
    return l ? m + window.location.pathname + ":" + l : null;
  }
  function d(e) {
    const s = e.tagName;
    return s === "INPUT" || s === "TEXTAREA" || s === "SELECT";
  }
  function c(e) {
    const s = {}, l = e.elements;
    for (let a = 0; a < l.length; a++) {
      const h = l[a];
      if (!(!h.name || h.disabled || h.type === "file" || h.type === "submit" || h.type === "button"))
        if (h.type === "checkbox")
          s[h.name] || (s[h.name] = []), h.checked && s[h.name].push(h.value);
        else if (h.type === "radio")
          h.checked && (s[h.name] = h.value);
        else if (h.type === "select-multiple") {
          s[h.name] = [];
          for (let _ = 0; _ < h.options.length; _++)
            h.options[_].selected && s[h.name].push(h.options[_].value);
        } else
          s[h.name] = h.value;
    }
    return s;
  }
  function i(e, s) {
    const l = e.elements, a = [];
    for (let h = 0; h < l.length; h++) {
      const _ = l[h];
      if (!_.name || !(_.name in s) || _.type === "file" || _.type === "submit" || _.type === "button") continue;
      const y = s[_.name];
      if (_.type === "checkbox")
        _.checked = Array.isArray(y) && y.indexOf(_.value) !== -1, a.push(_);
      else if (_.type === "radio")
        _.checked = _.value === y, a.push(_);
      else if (_.type === "select-multiple") {
        if (Array.isArray(y))
          for (let E = 0; E < _.options.length; E++)
            _.options[E].selected = y.indexOf(_.options[E].value) !== -1;
        a.push(_);
      } else
        _.value = y, a.push(_);
    }
    for (let h = 0; h < a.length; h++)
      a[h].dispatchEvent(new Event("input", { bubbles: !0 })), a[h].dispatchEvent(new Event("change", { bubbles: !0 })), a[h].lnSelect && a[h].lnSelect.setValue && a[h].lnSelect.setValue(s[a[h].name]);
  }
  function n(e, s, l) {
    e.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: l || {}
    }));
  }
  function t(e, s, l) {
    const a = new CustomEvent(s, {
      bubbles: !0,
      cancelable: !0,
      detail: l || {}
    });
    return e.dispatchEvent(a), a;
  }
  function o() {
    S(function() {
      new MutationObserver(function(s) {
        for (let l = 0; l < s.length; l++)
          if (s[l].type === "childList") {
            const a = s[l].addedNodes;
            for (let h = 0; h < a.length; h++)
              a[h].nodeType === 1 && v(a[h]);
          } else s[l].type === "attributes" && v(s[l].target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-autosave");
  }
  window[r] = g, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const u = "data-ln-autoresize", r = "lnAutoresize";
  if (window[r] !== void 0) return;
  function b(p) {
    m(p);
  }
  function m(p) {
    const f = Array.from(p.querySelectorAll("[" + u + "]"));
    p.hasAttribute && p.hasAttribute(u) && f.push(p);
    for (const d of f)
      d[r] || (d[r] = new g(d));
  }
  function g(p) {
    if (p.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", p.tagName), this;
    this.dom = p;
    const f = this;
    return this._onInput = function() {
      f._resize();
    }, p.addEventListener("input", this._onInput), this._resize(), this;
  }
  g.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, g.prototype.destroy = function() {
    this.dom[r] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[r]);
  };
  function v() {
    S(function() {
      new MutationObserver(function(f) {
        for (const d of f)
          if (d.type === "childList")
            for (const c of d.addedNodes)
              c.nodeType === 1 && m(c);
          else d.type === "attributes" && m(d.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-autoresize");
  }
  window[r] = b, v(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
