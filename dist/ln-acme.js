(function() {
  const h = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0) return;
  function v(e, n, o) {
    e.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: o || {}
    }));
  }
  function p(e, n, o) {
    const t = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: o || {}
    });
    return e.dispatchEvent(t), t;
  }
  function _(e) {
    if (!e.hasAttribute(h) || e[c]) return;
    e[c] = !0;
    const n = d(e);
    m(n.links), g(n.forms);
  }
  function m(e) {
    for (const n of e) {
      if (n[c + "Trigger"] || n.hostname && n.hostname !== window.location.hostname) continue;
      const o = n.getAttribute("href");
      o && o.includes("#") || (n[c + "Trigger"] = !0, n.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const s = n.getAttribute("href");
        s && f("GET", s, null, n);
      }));
    }
  }
  function g(e) {
    for (const n of e)
      n[c + "Trigger"] || (n[c + "Trigger"] = !0, n.addEventListener("submit", function(o) {
        o.preventDefault();
        const t = n.method.toUpperCase(), s = n.action, a = new FormData(n);
        for (const l of n.querySelectorAll('button, input[type="submit"]'))
          l.disabled = !0;
        f(t, s, a, n, function() {
          for (const l of n.querySelectorAll('button, input[type="submit"]'))
            l.disabled = !1;
        });
      }));
  }
  function f(e, n, o, t, s) {
    if (p(t, "ln-ajax:before-start", { method: e, url: n }).defaultPrevented) return;
    v(t, "ln-ajax:start", { method: e, url: n }), t.classList.add("ln-ajax--loading");
    const l = document.createElement("span");
    l.className = "ln-ajax-spinner", t.appendChild(l);
    function u() {
      t.classList.remove("ln-ajax--loading");
      const L = t.querySelector(".ln-ajax-spinner");
      L && L.remove(), s && s();
    }
    let b = n;
    const E = document.querySelector('meta[name="csrf-token"]'), w = E ? E.getAttribute("content") : null;
    o instanceof FormData && w && o.append("_token", w);
    const A = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (A.headers["X-CSRF-TOKEN"] = w), e === "GET" && o) {
      const L = new URLSearchParams(o);
      b = n + (n.includes("?") ? "&" : "?") + L.toString();
    } else e !== "GET" && o && (A.body = o);
    fetch(b, A).then(function(L) {
      var C = L.ok;
      return L.json().then(function(T) {
        return { ok: C, status: L.status, data: T };
      });
    }).then(function(L) {
      var C = L.data;
      if (L.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const O in C.content) {
            const D = document.getElementById(O);
            D && (D.innerHTML = C.content[O]);
          }
        if (t.tagName === "A") {
          const O = t.getAttribute("href");
          O && window.history.pushState({ ajax: !0 }, "", O);
        } else t.tagName === "FORM" && t.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", b);
        v(t, "ln-ajax:success", { method: e, url: b, data: C });
      } else
        v(t, "ln-ajax:error", { method: e, url: b, status: L.status, data: C });
      if (C.message && window.lnToast) {
        var T = C.message;
        window.lnToast.enqueue({
          type: T.type || (L.ok ? "success" : "error"),
          title: T.title || "",
          message: T.body || ""
        });
      }
      v(t, "ln-ajax:complete", { method: e, url: b }), u();
    }).catch(function(L) {
      v(t, "ln-ajax:error", { method: e, url: b, error: L }), v(t, "ln-ajax:complete", { method: e, url: b }), u();
    });
  }
  function d(e) {
    const n = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? n.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? n.forms.push(e) : (n.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function r() {
    new MutationObserver(function(n) {
      for (const o of n)
        if (o.type === "childList") {
          for (const t of o.addedNodes)
            if (t.nodeType === 1 && (_(t), !t.hasAttribute(h))) {
              for (const a of t.querySelectorAll("[" + h + "]"))
                _(a);
              const s = t.closest && t.closest("[" + h + "]");
              if (s && s.getAttribute(h) !== "false") {
                const a = d(t);
                m(a.links), g(a.forms);
              }
            }
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function i() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      _(e);
  }
  window[c] = _, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0) return;
  function v(e, n, o) {
    e.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: Object.assign({ modalId: e.id, target: e }, {})
    }));
  }
  function p(e, n) {
    const o = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: { modalId: e.id, target: e }
    });
    return e.dispatchEvent(o), o;
  }
  function _(e) {
    const n = document.getElementById(e);
    if (!n) {
      console.warn('[ln-modal] Modal with ID "' + e + '" not found');
      return;
    }
    p(n, "ln-modal:before-open").defaultPrevented || (n.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"), v(n, "ln-modal:open"));
  }
  function m(e) {
    const n = document.getElementById(e);
    !n || p(n, "ln-modal:before-close").defaultPrevented || (n.classList.remove("ln-modal--open"), v(n, "ln-modal:close"), document.querySelector(".ln-modal.ln-modal--open") || document.body.classList.remove("ln-modal-open"));
  }
  function g(e) {
    const n = document.getElementById(e);
    if (!n) {
      console.warn('[ln-modal] Modal with ID "' + e + '" not found');
      return;
    }
    n.classList.contains("ln-modal--open") ? m(e) : _(e);
  }
  function f(e) {
    const n = e.querySelectorAll("[data-ln-modal-close]");
    for (const o of n)
      o[c + "Close"] || (o[c + "Close"] = !0, o.addEventListener("click", function(t) {
        t.preventDefault(), m(e.id);
      }));
  }
  function d(e) {
    for (const n of e)
      n[c + "Trigger"] || (n[c + "Trigger"] = !0, n.addEventListener("click", function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        o.preventDefault();
        const t = n.getAttribute(h);
        t && g(t);
      }));
  }
  function r() {
    const e = document.querySelectorAll("[" + h + "]");
    d(e);
    const n = document.querySelectorAll(".ln-modal");
    for (const o of n)
      f(o);
    document.addEventListener("keydown", function(o) {
      if (o.key === "Escape") {
        const t = document.querySelectorAll(".ln-modal.ln-modal--open");
        for (const s of t)
          m(s.id);
      }
    });
  }
  function i() {
    new MutationObserver(function(n) {
      for (const o of n)
        if (o.type === "childList") {
          for (const t of o.addedNodes)
            if (t.nodeType === 1) {
              t.hasAttribute(h) && d([t]);
              const s = t.querySelectorAll("[" + h + "]");
              s.length > 0 && d(s), t.id && t.classList.contains("ln-modal") && f(t);
              const a = t.querySelectorAll(".ln-modal");
              for (const l of a)
                f(l);
            }
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = {
    open: _,
    close: m,
    toggle: g
  }, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
(function() {
  const h = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0) return;
  const v = /* @__PURE__ */ new WeakMap(), p = [];
  if (!history._lnNavPatched) {
    const i = history.pushState;
    history.pushState = function() {
      i.apply(history, arguments);
      for (const e of p)
        e();
    }, history._lnNavPatched = !0;
  }
  function _(i) {
    if (!i.hasAttribute(h) || v.has(i)) return;
    const e = i.getAttribute(h);
    if (!e) return;
    const n = m(i, e);
    v.set(i, n), i[c] = n;
  }
  function m(i, e) {
    let n = Array.from(i.querySelectorAll("a"));
    f(n, e, window.location.pathname);
    const o = function() {
      n = Array.from(i.querySelectorAll("a")), f(n, e, window.location.pathname);
    };
    window.addEventListener("popstate", o), p.push(o);
    const t = new MutationObserver(function(s) {
      for (const a of s)
        if (a.type === "childList") {
          for (const l of a.addedNodes)
            if (l.nodeType === 1) {
              if (l.tagName === "A")
                n.push(l), f([l], e, window.location.pathname);
              else if (l.querySelectorAll) {
                const u = Array.from(l.querySelectorAll("a"));
                n = n.concat(u), f(u, e, window.location.pathname);
              }
            }
          for (const l of a.removedNodes)
            if (l.nodeType === 1) {
              if (l.tagName === "A")
                n = n.filter(function(u) {
                  return u !== l;
                });
              else if (l.querySelectorAll) {
                const u = Array.from(l.querySelectorAll("a"));
                n = n.filter(function(b) {
                  return !u.includes(b);
                });
              }
            }
        }
    });
    return t.observe(i, { childList: !0, subtree: !0 }), {
      navElement: i,
      activeClass: e,
      observer: t,
      updateHandler: o,
      destroy: function() {
        t.disconnect(), window.removeEventListener("popstate", o);
        const s = p.indexOf(o);
        s !== -1 && p.splice(s, 1), v.delete(i), delete i[c];
      }
    };
  }
  function g(i) {
    try {
      return new URL(i, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return i.replace(/\/$/, "") || "/";
    }
  }
  function f(i, e, n) {
    const o = g(n);
    for (const t of i) {
      const s = t.getAttribute("href");
      if (!s) continue;
      const a = g(s);
      t.classList.remove(e);
      const l = a === o, u = a !== "/" && o.startsWith(a + "/");
      (l || u) && t.classList.add(e);
    }
  }
  function d() {
    new MutationObserver(function(e) {
      for (const n of e)
        if (n.type === "childList") {
          for (const o of n.addedNodes)
            if (o.nodeType === 1 && (o.hasAttribute && o.hasAttribute(h) && _(o), o.querySelectorAll))
              for (const t of o.querySelectorAll("[" + h + "]"))
                _(t);
        }
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  window[c] = _;
  function r() {
    for (const i of document.querySelectorAll("[" + h + "]"))
      _(i);
  }
  d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
(function() {
  const h = window.TomSelect;
  if (!h) {
    window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const c = /* @__PURE__ */ new WeakMap();
  function v(g) {
    if (c.has(g)) return;
    const f = g.getAttribute("data-ln-select");
    let d = {};
    if (f && f.trim() !== "")
      try {
        d = JSON.parse(f);
      } catch (e) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", e);
      }
    const i = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: g.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...d };
    try {
      const e = new h(g, i);
      c.set(g, e);
      const n = g.closest("form");
      n && n.addEventListener("reset", () => {
        setTimeout(() => {
          e.clear(), e.clearOptions(), e.sync();
        }, 0);
      });
    } catch (e) {
      console.warn("[ln-select] Failed to initialize Tom Select:", e);
    }
  }
  function p(g) {
    const f = c.get(g);
    f && (f.destroy(), c.delete(g));
  }
  function _() {
    for (const g of document.querySelectorAll("select[data-ln-select]"))
      v(g);
  }
  function m() {
    new MutationObserver(function(f) {
      for (const d of f) {
        for (const r of d.addedNodes)
          if (r.nodeType === 1 && (r.matches && r.matches("select[data-ln-select]") && v(r), r.querySelectorAll))
            for (const i of r.querySelectorAll("select[data-ln-select]"))
              v(i);
        for (const r of d.removedNodes)
          if (r.nodeType === 1 && (r.matches && r.matches("select[data-ln-select]") && p(r), r.querySelectorAll))
            for (const i of r.querySelectorAll("select[data-ln-select]"))
              p(i);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(), m();
  }) : (_(), m()), window.lnSelect = {
    initialize: v,
    destroy: p,
    getInstance: function(g) {
      return c.get(g);
    }
  };
})();
(function() {
  const h = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function v(r = document.body) {
    p(r);
  }
  function p(r) {
    if (r.nodeType !== 1) return;
    const i = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && i.push(r);
    for (const e of i)
      e[c] || (e[c] = new m(e));
  }
  function _() {
    const r = (location.hash || "").replace("#", ""), i = {};
    if (!r) return i;
    for (const e of r.split("&")) {
      const n = e.indexOf(":");
      n > 0 && (i[e.slice(0, n)] = e.slice(n + 1));
    }
    return i;
  }
  function m(r) {
    return this.dom = r, g.call(this), this;
  }
  function g() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const i of this.tabs) {
      const e = (i.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      e && (this.mapTabs[e] = i);
    }
    for (const i of this.panels) {
      const e = (i.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      e && (this.mapPanels[e] = i);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const r = this;
    this._clickHandlers = [];
    for (const i of this.tabs) {
      if (i[c + "Trigger"]) continue;
      i[c + "Trigger"] = !0;
      const e = function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        const o = (i.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (o)
          if (r.hashEnabled) {
            const t = _();
            t[r.nsKey] = o;
            const s = Object.keys(t).map(function(a) {
              return a + ":" + t[a];
            }).join("&");
            location.hash === "#" + s ? r.activate(o) : location.hash = s;
          } else
            r.activate(o);
      };
      i.addEventListener("click", e), r._clickHandlers.push({ el: i, handler: e });
    }
    this._hashHandler = function() {
      if (!r.hashEnabled) return;
      const i = _();
      r.activate(r.nsKey in i ? i[r.nsKey] : r.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  m.prototype.activate = function(r) {
    var i;
    (!r || !(r in this.mapPanels)) && (r = this.defaultKey);
    for (const e in this.mapTabs) {
      const n = this.mapTabs[e];
      e === r ? (n.setAttribute("data-active", ""), n.setAttribute("aria-selected", "true")) : (n.removeAttribute("data-active"), n.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const n = this.mapPanels[e], o = e === r;
      n.classList.toggle("hidden", !o), n.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (i = this.mapPanels[r]) == null ? void 0 : i.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
    f(this.dom, "ln-tabs:change", { key: r, tab: this.mapTabs[r], panel: this.mapPanels[r] });
  }, m.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const { el: r, handler: i } of this._clickHandlers)
        r.removeEventListener("click", i);
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), f(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[c];
    }
  };
  function f(r, i, e) {
    r.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function d() {
    new MutationObserver(function(i) {
      for (const e of i)
        for (const n of e.addedNodes)
          p(n);
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  d(), window[c] = v, v(document.body);
})();
(function() {
  const h = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function v(r) {
    p(r), _(r);
  }
  function p(r) {
    const i = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && i.push(r);
    for (const e of i)
      e[c] || (e[c] = new m(e));
  }
  function _(r) {
    const i = Array.from(r.querySelectorAll("[data-ln-toggle-for]"));
    r.hasAttribute && r.hasAttribute("data-ln-toggle-for") && i.push(r);
    for (const e of i) {
      if (e[c + "Trigger"]) return;
      e[c + "Trigger"] = !0, e.addEventListener("click", function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        n.preventDefault();
        const o = e.getAttribute("data-ln-toggle-for"), t = document.getElementById(o);
        if (!t || !t[c]) return;
        const s = e.getAttribute("data-ln-toggle-action") || "toggle";
        t[c][s]();
      });
    }
  }
  function m(r) {
    this.dom = r, this.isOpen = r.getAttribute(h) === "open", this.isOpen && r.classList.add("open");
    const i = this;
    return this._onRequestClose = function() {
      i.isOpen && i.close();
    }, this._onRequestOpen = function() {
      i.isOpen || i.open();
    }, r.addEventListener("ln-toggle:request-close", this._onRequestClose), r.addEventListener("ln-toggle:request-open", this._onRequestOpen), this;
  }
  m.prototype.open = function() {
    this.isOpen || f(this.dom, "ln-toggle:before-open", { target: this.dom }).defaultPrevented || (this.isOpen = !0, this.dom.classList.add("open"), g(this.dom, "ln-toggle:open", { target: this.dom }));
  }, m.prototype.close = function() {
    !this.isOpen || f(this.dom, "ln-toggle:before-close", { target: this.dom }).defaultPrevented || (this.isOpen = !1, this.dom.classList.remove("open"), g(this.dom, "ln-toggle:close", { target: this.dom }));
  }, m.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, m.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), g(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function g(r, i, e) {
    r.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function f(r, i, e) {
    const n = new CustomEvent(i, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return r.dispatchEvent(n), n;
  }
  function d() {
    new MutationObserver(function(i) {
      for (const e of i)
        if (e.type === "childList")
          for (const n of e.addedNodes)
            n.nodeType === 1 && (p(n), _(n));
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = v, d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function v(f) {
    p(f);
  }
  function p(f) {
    const d = Array.from(f.querySelectorAll("[" + h + "]"));
    f.hasAttribute && f.hasAttribute(h) && d.push(f);
    for (const r of d)
      r[c] || (r[c] = new _(r));
  }
  function _(f) {
    return this.dom = f, this._onToggleOpen = function(d) {
      const r = f.querySelectorAll("[data-ln-toggle]");
      for (const i of r)
        i !== d.detail.target && i.dispatchEvent(new CustomEvent("ln-toggle:request-close"));
      m(f, "ln-accordion:change", { target: d.detail.target });
    }, f.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  _.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), m(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function m(f, d, r) {
    f.dispatchEvent(new CustomEvent(d, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function g() {
    new MutationObserver(function(d) {
      for (const r of d)
        if (r.type === "childList")
          for (const i of r.addedNodes)
            i.nodeType === 1 && p(i);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = v, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-dropdown", c = "lnDropdown";
  if (window[c] !== void 0) return;
  function v(f) {
    p(f);
  }
  function p(f) {
    const d = Array.from(f.querySelectorAll("[" + h + "]"));
    f.hasAttribute && f.hasAttribute(h) && d.push(f);
    for (const r of d)
      r[c] || (r[c] = new _(r));
  }
  function _(f) {
    this.dom = f, this.toggleEl = f.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._boundScrollClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && this.toggleEl.setAttribute("data-ln-dropdown-menu", "");
    const d = this;
    return this._onToggleOpen = function(r) {
      r.detail.target === d.toggleEl && (d._teleportToBody(), d._addOutsideClickListener(), d._addScrollCloseListener(), m(f, "ln-dropdown:open", { target: r.detail.target }));
    }, this._onToggleClose = function(r) {
      r.detail.target === d.toggleEl && (d._removeOutsideClickListener(), d._removeScrollCloseListener(), d._teleportBack(), m(f, "ln-dropdown:close", { target: r.detail.target }));
    }, this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose), this;
  }
  _.prototype._teleportToBody = function() {
    if (!this.toggleEl || this.toggleEl.parentNode === document.body) return;
    const f = this.dom.querySelector("[data-ln-toggle-for]");
    if (!f) return;
    const d = f.getBoundingClientRect();
    this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block";
    const r = this.toggleEl.offsetWidth, i = this.toggleEl.offsetHeight;
    this.toggleEl.style.visibility = "", this.toggleEl.style.display = "";
    const e = window.innerWidth, n = window.innerHeight, o = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-xs")) * 16 || 4;
    var t;
    d.bottom + o + i <= n ? t = d.bottom + o : d.top - o - i >= 0 ? t = d.top - o - i : t = Math.max(0, n - i);
    var s;
    d.right - r >= 0 ? s = d.right - r : d.left + r <= e ? s = d.left : s = Math.max(0, e - r), this.toggleEl.style.top = t + "px", this.toggleEl.style.left = s + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, _.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, _.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const f = this;
    this._boundDocClick = function(d) {
      f.dom.contains(d.target) || f.toggleEl && f.toggleEl.contains(d.target) || f.toggleEl && f.toggleEl.dispatchEvent(new CustomEvent("ln-toggle:request-close"));
    }, setTimeout(function() {
      document.addEventListener("click", f._boundDocClick);
    }, 0);
  }, _.prototype._removeOutsideClickListener = function() {
    this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, _.prototype._addScrollCloseListener = function() {
    const f = this;
    this._boundScrollClose = function() {
      f.toggleEl && f.toggleEl.dispatchEvent(new CustomEvent("ln-toggle:request-close"));
    }, window.addEventListener("scroll", this._boundScrollClose, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundScrollClose);
  }, _.prototype._removeScrollCloseListener = function() {
    this._boundScrollClose && (window.removeEventListener("scroll", this._boundScrollClose, { capture: !0 }), window.removeEventListener("resize", this._boundScrollClose), this._boundScrollClose = null);
  }, _.prototype.destroy = function() {
    this.dom[c] && (this._removeOutsideClickListener(), this._removeScrollCloseListener(), this._teleportBack(), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose), m(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function m(f, d, r) {
    f.dispatchEvent(new CustomEvent(d, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function g() {
    new MutationObserver(function(d) {
      for (const r of d)
        if (r.type === "childList")
          for (const i of r.addedNodes)
            i.nodeType === 1 && p(i);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = v, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-toast", c = "lnToast", v = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[c] !== void 0 && window[c] !== null) return;
  function p(o = document.body) {
    return _(o), e;
  }
  function _(o) {
    if (!o || o.nodeType !== 1) return;
    const t = Array.from(o.querySelectorAll("[" + h + "]"));
    o.hasAttribute && o.hasAttribute(h) && t.push(o);
    for (const s of t)
      s[c] || new m(s);
  }
  function m(o) {
    this.dom = o, o[c] = this, this.timeoutDefault = parseInt(o.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(o.getAttribute("data-ln-toast-max") || "5", 10);
    for (const t of Array.from(o.querySelectorAll("[data-ln-toast-item]")))
      g(t);
    return this;
  }
  m.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const o of Array.from(this.dom.children))
        d(o);
      delete this.dom[c];
    }
  };
  function g(o) {
    const t = ((o.getAttribute("data-type") || "info") + "").toLowerCase(), s = o.getAttribute("data-title"), a = (o.innerText || o.textContent || "").trim();
    o.className = "ln-toast__item", o.removeAttribute("data-ln-toast-item");
    const l = document.createElement("div");
    l.className = "ln-toast__card ln-toast__card--" + t, l.setAttribute("role", t === "error" ? "alert" : "status"), l.setAttribute("aria-live", t === "error" ? "assertive" : "polite");
    const u = document.createElement("div");
    u.className = "ln-toast__side", u.innerHTML = v[t] || v.info;
    const b = document.createElement("div");
    b.className = "ln-toast__content";
    const E = document.createElement("div");
    E.className = "ln-toast__head";
    const w = document.createElement("strong");
    w.className = "ln-toast__title", w.textContent = s || (t === "success" ? "Success" : t === "error" ? "Error" : t === "warn" ? "Warning" : "Information");
    const A = document.createElement("button");
    if (A.type = "button", A.className = "ln-toast__close ln-icon-close", A.setAttribute("aria-label", "Close"), A.addEventListener("click", () => d(o)), E.appendChild(w), b.appendChild(E), b.appendChild(A), a) {
      const L = document.createElement("div");
      L.className = "ln-toast__body";
      const C = document.createElement("p");
      C.textContent = a, L.appendChild(C), b.appendChild(L);
    }
    l.appendChild(u), l.appendChild(b), o.innerHTML = "", o.appendChild(l), requestAnimationFrame(() => o.classList.add("ln-toast__item--in"));
  }
  function f(o, t) {
    for (; o.dom.children.length >= o.max; ) o.dom.removeChild(o.dom.firstElementChild);
    o.dom.appendChild(t), requestAnimationFrame(() => t.classList.add("ln-toast__item--in"));
  }
  function d(o) {
    !o || !o.parentNode || (clearTimeout(o._timer), o.classList.remove("ln-toast__item--in"), o.classList.add("ln-toast__item--out"), setTimeout(() => {
      o.parentNode && o.parentNode.removeChild(o);
    }, 200));
  }
  function r(o = {}) {
    let t = o.container;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !t)
      return console.warn("[ln-toast] No toast container found"), null;
    const s = t[c] || new m(t), a = Number.isFinite(o.timeout) ? o.timeout : s.timeoutDefault, l = (o.type || "info").toLowerCase(), u = document.createElement("li");
    u.className = "ln-toast__item";
    const b = document.createElement("div");
    b.className = "ln-toast__card ln-toast__card--" + l, b.setAttribute("role", l === "error" ? "alert" : "status"), b.setAttribute("aria-live", l === "error" ? "assertive" : "polite");
    const E = document.createElement("div");
    E.className = "ln-toast__side", E.innerHTML = v[l] || v.info;
    const w = document.createElement("div");
    w.className = "ln-toast__content";
    const A = document.createElement("div");
    A.className = "ln-toast__head";
    const L = document.createElement("strong");
    L.className = "ln-toast__title", L.textContent = o.title || (l === "success" ? "Success" : l === "error" ? "Error" : l === "warn" ? "Warning" : "Information");
    const C = document.createElement("button");
    if (C.type = "button", C.className = "ln-toast__close ln-icon-close", C.setAttribute("aria-label", "Close"), C.addEventListener("click", () => d(u)), A.appendChild(L), w.appendChild(A), w.appendChild(C), o.message || o.data && o.data.errors) {
      const T = document.createElement("div");
      if (T.className = "ln-toast__body", o.message)
        if (Array.isArray(o.message)) {
          const O = document.createElement("ul");
          for (const D of o.message) {
            const y = document.createElement("li");
            y.textContent = D, O.appendChild(y);
          }
          T.appendChild(O);
        } else {
          const O = document.createElement("p");
          O.textContent = o.message, T.appendChild(O);
        }
      if (o.data && o.data.errors) {
        const O = document.createElement("ul");
        for (const D of Object.values(o.data.errors).flat()) {
          const y = document.createElement("li");
          y.textContent = D, O.appendChild(y);
        }
        T.appendChild(O);
      }
      w.appendChild(T);
    }
    return b.appendChild(E), b.appendChild(w), u.appendChild(b), f(s, u), a > 0 && (u._timer = setTimeout(() => d(u), a)), u;
  }
  function i(o) {
    let t = o;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !!t)
      for (const s of Array.from(t.children))
        d(s);
  }
  const e = function(o) {
    return p(o);
  };
  e.enqueue = r, e.clear = i, new MutationObserver(function(o) {
    for (const t of o)
      for (const s of t.addedNodes)
        _(s);
  }).observe(document.body, { childList: !0, subtree: !0 }), window[c] = e, window.addEventListener("ln-toast:enqueue", function(o) {
    o.detail && e.enqueue(o.detail);
  }), p(document.body);
})();
(function() {
  const h = "data-ln-upload", c = "lnUpload", v = "data-ln-upload-dict", p = "data-ln-upload-accept", _ = "data-ln-upload-context";
  if (window[c] !== void 0) return;
  function m(t, s) {
    const a = t.querySelector("[" + v + '="' + s + '"]');
    return a ? a.textContent : s;
  }
  function g(t) {
    if (t === 0) return "0 B";
    const s = 1024, a = ["B", "KB", "MB", "GB"], l = Math.floor(Math.log(t) / Math.log(s));
    return parseFloat((t / Math.pow(s, l)).toFixed(1)) + " " + a[l];
  }
  function f(t) {
    return t.split(".").pop().toLowerCase();
  }
  function d(t) {
    return t === "docx" && (t = "doc"), ["pdf", "doc", "epub"].includes(t) ? "ln-icon-file-" + t : "ln-icon-file";
  }
  function r(t, s) {
    if (!s) return !0;
    const a = "." + f(t.name);
    return s.split(",").map(function(u) {
      return u.trim().toLowerCase();
    }).includes(a.toLowerCase());
  }
  function i(t, s, a) {
    t.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: a
    }));
  }
  function e(t) {
    if (t.hasAttribute("data-ln-upload-initialized")) return;
    t.setAttribute("data-ln-upload-initialized", "true");
    const s = t.querySelector(".ln-upload__zone"), a = t.querySelector(".ln-upload__list"), l = t.getAttribute(p) || "";
    if (!s || !a) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", t);
      return;
    }
    let u = t.querySelector('input[type="file"]');
    u || (u = document.createElement("input"), u.type = "file", u.multiple = !0, u.style.display = "none", l && (u.accept = l.split(",").map(function(y) {
      return y = y.trim(), y.startsWith(".") ? y : "." + y;
    }).join(",")), t.appendChild(u));
    const b = t.getAttribute(h) || "/files/upload", E = t.getAttribute(_) || "", w = /* @__PURE__ */ new Map();
    let A = 0;
    function L() {
      const y = document.querySelector('meta[name="csrf-token"]');
      return y ? y.getAttribute("content") : "";
    }
    function C(y) {
      if (!r(y, l)) {
        const S = m(t, "invalid-type");
        i(t, "ln-upload:invalid", {
          file: y,
          message: S
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Invalid File",
            message: S || "This file type is not allowed"
          }
        }));
        return;
      }
      const q = "file-" + ++A, x = f(y.name), R = d(x), k = document.createElement("li");
      k.className = "ln-upload__item ln-upload__item--uploading " + R, k.setAttribute("data-file-id", q);
      const H = document.createElement("span");
      H.className = "ln-upload__name", H.textContent = y.name;
      const N = document.createElement("span");
      N.className = "ln-upload__size", N.textContent = "0%";
      const I = document.createElement("button");
      I.type = "button", I.className = "ln-upload__remove ln-icon-close", I.title = m(t, "remove"), I.textContent = "×", I.disabled = !0;
      const F = document.createElement("div");
      F.className = "ln-upload__progress";
      const P = document.createElement("div");
      P.className = "ln-upload__progress-bar", F.appendChild(P), k.appendChild(H), k.appendChild(N), k.appendChild(I), k.appendChild(F), a.appendChild(k);
      const U = new FormData();
      U.append("file", y), U.append("context", E);
      const M = new XMLHttpRequest();
      M.upload.addEventListener("progress", function(S) {
        if (S.lengthComputable) {
          const B = Math.round(S.loaded / S.total * 100);
          P.style.width = B + "%", N.textContent = B + "%";
        }
      }), M.addEventListener("load", function() {
        if (M.status >= 200 && M.status < 300) {
          let S;
          try {
            S = JSON.parse(M.responseText);
          } catch {
            z("Invalid response");
            return;
          }
          k.classList.remove("ln-upload__item--uploading"), N.textContent = g(S.size || y.size), I.disabled = !1, w.set(q, {
            serverId: S.id,
            name: S.name,
            size: S.size
          }), T(), i(t, "ln-upload:uploaded", {
            localId: q,
            serverId: S.id,
            name: S.name
          });
        } else {
          let S = "Upload failed";
          try {
            S = JSON.parse(M.responseText).message || S;
          } catch {
          }
          z(S);
        }
      }), M.addEventListener("error", function() {
        z("Network error");
      });
      function z(S) {
        k.classList.remove("ln-upload__item--uploading"), k.classList.add("ln-upload__item--error"), P.style.width = "100%", N.textContent = m(t, "error"), I.disabled = !1, i(t, "ln-upload:error", {
          file: y,
          message: S
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: S || m(t, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      M.open("POST", b), M.setRequestHeader("X-CSRF-TOKEN", L()), M.setRequestHeader("Accept", "application/json"), M.send(U);
    }
    function T() {
      for (const y of t.querySelectorAll('input[name="file_ids[]"]'))
        y.remove();
      for (const [, y] of w) {
        const q = document.createElement("input");
        q.type = "hidden", q.name = "file_ids[]", q.value = y.serverId, t.appendChild(q);
      }
    }
    function O(y) {
      const q = w.get(y), x = a.querySelector('[data-file-id="' + y + '"]');
      if (!q || !q.serverId) {
        x && x.remove(), w.delete(y), T();
        return;
      }
      x && x.classList.add("ln-upload__item--deleting"), fetch("/files/" + q.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": L(),
          Accept: "application/json"
        }
      }).then(function(R) {
        R.status === 200 ? (x && x.remove(), w.delete(y), T(), i(t, "ln-upload:removed", {
          localId: y,
          serverId: q.serverId
        })) : (x && x.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: m(t, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch(function(R) {
        console.warn("[ln-upload] Delete error:", R), x && x.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function D(y) {
      for (const q of y)
        C(q);
      u.value = "";
    }
    s.addEventListener("click", function() {
      u.click();
    }), u.addEventListener("change", function() {
      D(this.files);
    }), s.addEventListener("dragenter", function(y) {
      y.preventDefault(), y.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }), s.addEventListener("dragover", function(y) {
      y.preventDefault(), y.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }), s.addEventListener("dragleave", function(y) {
      y.preventDefault(), y.stopPropagation(), s.classList.remove("ln-upload__zone--dragover");
    }), s.addEventListener("drop", function(y) {
      y.preventDefault(), y.stopPropagation(), s.classList.remove("ln-upload__zone--dragover"), D(y.dataTransfer.files);
    }), a.addEventListener("click", function(y) {
      if (y.target.classList.contains("ln-upload__remove")) {
        const q = y.target.closest(".ln-upload__item");
        q && O(q.getAttribute("data-file-id"));
      }
    }), t.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(w.values()).map(function(y) {
          return y.serverId;
        });
      },
      getFiles: function() {
        return Array.from(w.values());
      },
      clear: function() {
        for (const [, y] of w)
          y.serverId && fetch("/files/" + y.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": L(),
              Accept: "application/json"
            }
          });
        w.clear(), a.innerHTML = "", T(), i(t, "ln-upload:cleared", {});
      }
    };
  }
  function n() {
    for (const t of document.querySelectorAll("[" + h + "]"))
      e(t);
  }
  function o() {
    new MutationObserver(function(s) {
      for (const a of s)
        if (a.type === "childList") {
          for (const l of a.addedNodes)
            if (l.nodeType === 1) {
              l.hasAttribute(h) && e(l);
              for (const u of l.querySelectorAll("[" + h + "]"))
                e(u);
            }
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = {
    init: e,
    initAll: n
  }, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function c(d, r, i) {
    d.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: i
    }));
  }
  function v(d) {
    return d.hostname && d.hostname !== window.location.hostname;
  }
  function p(d) {
    d.getAttribute("data-ln-external-link") !== "processed" && v(d) && (d.target = "_blank", d.rel = "noopener noreferrer", d.setAttribute("data-ln-external-link", "processed"), c(d, "ln-external-links:processed", {
      link: d,
      href: d.href
    }));
  }
  function _(d) {
    d = d || document.body;
    for (const r of d.querySelectorAll("a, area"))
      p(r);
  }
  function m() {
    document.body.addEventListener("click", function(d) {
      const r = d.target.closest("a, area");
      r && r.getAttribute("data-ln-external-link") === "processed" && c(r, "ln-external-links:clicked", {
        link: r,
        href: r.href,
        text: r.textContent || r.title || ""
      });
    });
  }
  function g() {
    new MutationObserver(function(r) {
      for (const i of r)
        if (i.type === "childList") {
          for (const e of i.addedNodes)
            if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && p(e), e.querySelectorAll))
              for (const n of e.querySelectorAll("a, area"))
                p(n);
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function f() {
    m(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      _();
    }) : _();
  }
  window[h] = {
    process: _
  }, f();
})();
(function() {
  const h = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  function v(a, l, u) {
    const b = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0,
      detail: u || {}
    });
    return a.dispatchEvent(b), b;
  }
  let p = null;
  function _() {
    p = document.createElement("div"), p.className = "ln-link-status", document.body.appendChild(p);
  }
  function m(a) {
    p && (p.textContent = a, p.classList.add("ln-link-status--visible"));
  }
  function g() {
    p && p.classList.remove("ln-link-status--visible");
  }
  function f(a, l) {
    if (l.target.closest("a, button, input, select, textarea")) return;
    const u = a.querySelector("a");
    if (!u) return;
    const b = u.getAttribute("href");
    if (!b) return;
    if (l.ctrlKey || l.metaKey || l.button === 1) {
      window.open(b, "_blank");
      return;
    }
    v(a, "ln-link:navigate", { target: a, href: b, link: u }).defaultPrevented || u.click();
  }
  function d(a) {
    const l = a.querySelector("a");
    if (!l) return;
    const u = l.getAttribute("href");
    u && m(u);
  }
  function r() {
    g();
  }
  function i(a) {
    a[c + "Row"] || (a[c + "Row"] = !0, a.querySelector("a") && (a.addEventListener("click", function(l) {
      f(a, l);
    }), a.addEventListener("mouseenter", function() {
      d(a);
    }), a.addEventListener("mouseleave", r)));
  }
  function e(a) {
    if (a[c + "Init"]) return;
    a[c + "Init"] = !0;
    const l = a.tagName;
    if (l === "TABLE" || l === "TBODY") {
      const u = l === "TABLE" && a.querySelector("tbody") || a;
      for (const b of u.querySelectorAll("tr"))
        i(b);
    } else i(a);
  }
  function n(a) {
    a.hasAttribute && a.hasAttribute(h) && e(a);
    const l = a.querySelectorAll ? a.querySelectorAll("[" + h + "]") : [];
    for (const u of l)
      e(u);
  }
  function o() {
    new MutationObserver(function(l) {
      for (const u of l)
        if (u.type === "childList")
          for (const b of u.addedNodes)
            b.nodeType === 1 && (n(b), b.tagName === "TR" && b.closest("[" + h + "]") && i(b));
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function t(a) {
    n(a);
  }
  window[c] = { init: t };
  function s() {
    _(), o(), t(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const h = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0) return;
  function v(e) {
    const n = e.getAttribute("data-ln-progress");
    return n !== null && n !== "";
  }
  function p(e) {
    m(e);
  }
  function _(e, n, o) {
    e.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: o || {}
    }));
  }
  function m(e) {
    const n = Array.from(e.querySelectorAll(h));
    for (const o of n)
      v(o) && !o[c] && (o[c] = new g(o));
    e.hasAttribute && e.hasAttribute("data-ln-progress") && v(e) && !e[c] && (e[c] = new g(e));
  }
  function g(e) {
    return this.dom = e, this._attrObserver = null, this._parentObserver = null, i.call(this), d.call(this), r.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[c]);
  };
  function f() {
    new MutationObserver(function(n) {
      for (const o of n)
        if (o.type === "childList")
          for (const t of o.addedNodes)
            t.nodeType === 1 && m(t);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  f();
  function d() {
    const e = this, n = new MutationObserver(function(o) {
      for (const t of o)
        (t.attributeName === "data-ln-progress" || t.attributeName === "data-ln-progress-max") && i.call(e);
    });
    n.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = n;
  }
  function r() {
    const e = this, n = this.dom.parentElement;
    if (!n || !n.hasAttribute("data-ln-progress-max")) return;
    const o = new MutationObserver(function(t) {
      for (const s of t)
        s.attributeName === "data-ln-progress-max" && i.call(e);
    });
    o.observe(n, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = o;
  }
  function i() {
    const e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, n = this.dom.parentElement, t = (n && n.hasAttribute("data-ln-progress-max") ? parseFloat(n.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let s = t > 0 ? e / t * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100), this.dom.style.width = s + "%", _(this.dom, "ln-progress:change", { target: this.dom, value: e, max: t, percentage: s });
  }
  window[c] = p, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "data-ln-filter", c = "lnFilter", v = "data-ln-filter-initialized", p = "data-ln-filter-key", _ = "data-ln-filter-value", m = "data-ln-filter-hide", g = "data-active";
  if (window[c] !== void 0) return;
  function f(n) {
    d(n);
  }
  function d(n) {
    var o = Array.from(n.querySelectorAll("[" + h + "]"));
    n.hasAttribute && n.hasAttribute(h) && o.push(n), o.forEach(function(t) {
      t[c] || (t[c] = new r(t));
    });
  }
  function r(n) {
    return n.hasAttribute(v) ? this : (this.dom = n, this.targetId = n.getAttribute(h), this.buttons = Array.from(n.querySelectorAll("button")), this._attachHandlers(), n.setAttribute(v, ""), this);
  }
  r.prototype._attachHandlers = function() {
    var n = this;
    this.buttons.forEach(function(o) {
      o[c + "Bound"] || (o[c + "Bound"] = !0, o.addEventListener("click", function() {
        var t = o.getAttribute(p), s = o.getAttribute(_);
        s === "" ? n.reset() : (n._setActive(o), n._applyFilter(t, s), i(n.dom, "ln-filter:changed", { key: t, value: s }));
      }));
    });
  }, r.prototype._applyFilter = function(n, o) {
    var t = document.getElementById(this.targetId);
    if (t)
      for (var s = Array.from(t.children), a = 0; a < s.length; a++) {
        var l = s[a], u = l.getAttribute("data-" + n);
        l.removeAttribute(m), u !== null && o && u.toLowerCase() !== o.toLowerCase() && l.setAttribute(m, "true");
      }
  }, r.prototype._setActive = function(n) {
    this.buttons.forEach(function(o) {
      o.removeAttribute(g);
    }), n && n.setAttribute(g, "");
  }, r.prototype.filter = function(n, o) {
    this._setActive(null);
    for (var t = 0; t < this.buttons.length; t++) {
      var s = this.buttons[t];
      if (s.getAttribute(p) === n && s.getAttribute(_) === o) {
        this._setActive(s);
        break;
      }
    }
    this._applyFilter(n, o), i(this.dom, "ln-filter:changed", { key: n, value: o });
  }, r.prototype.reset = function() {
    var n = document.getElementById(this.targetId);
    if (n)
      for (var o = Array.from(n.children), t = 0; t < o.length; t++)
        o[t].removeAttribute(m);
    for (var s = null, t = 0; t < this.buttons.length; t++)
      if (this.buttons[t].getAttribute(_) === "") {
        s = this.buttons[t];
        break;
      }
    this._setActive(s), i(this.dom, "ln-filter:reset", {});
  };
  function i(n, o, t) {
    n.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function e() {
    var n = new MutationObserver(function(o) {
      o.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(s) {
          s.nodeType === 1 && d(s);
        });
      });
    });
    n.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = f, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const h = "data-ln-search", c = "lnSearch", v = "data-ln-search-initialized", p = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function m(r) {
    g(r);
  }
  function g(r) {
    var i = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && i.push(r), i.forEach(function(e) {
      e[c] || (e[c] = new f(e));
    });
  }
  function f(r) {
    if (r.hasAttribute(v)) return this;
    this.dom = r, this.targetId = r.getAttribute(h);
    var i = r.tagName;
    return this.input = i === "INPUT" || i === "TEXTAREA" ? r : r.querySelector('[name="search"]') || r.querySelector('input[type="search"]') || r.querySelector('input[type="text"]'), this._debounceTimer = null, this._attachHandler(), r.setAttribute(v, ""), this;
  }
  f.prototype._attachHandler = function() {
    if (this.input) {
      var r = this;
      this.input.addEventListener("input", function() {
        clearTimeout(r._debounceTimer), r._debounceTimer = setTimeout(function() {
          r._search(r.input.value.trim().toLowerCase());
        }, 150);
      });
    }
  }, f.prototype._search = function(r) {
    var i = document.getElementById(this.targetId);
    if (i) {
      var e = new CustomEvent("ln-search:change", {
        bubbles: !0,
        cancelable: !0,
        detail: { term: r, targetId: this.targetId }
      });
      if (i.dispatchEvent(e)) {
        var n = i.children;
        n.length;
        for (var o = 0; o < n.length; o++) {
          var t = n[o];
          t.removeAttribute(p), r && !t.textContent.replace(/\s+/g, " ").toLowerCase().includes(r) && t.setAttribute(p, "true");
        }
      }
    }
  };
  function d() {
    var r = new MutationObserver(function(i) {
      i.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(n) {
          n.nodeType === 1 && g(n);
        });
      });
    });
    r.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = m, d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "lnTableSort", c = "data-ln-sort", v = "data-ln-sort-active";
  if (window[h] !== void 0) return;
  function p(d) {
    _(d);
  }
  function _(d) {
    var r = Array.from(d.querySelectorAll("table"));
    d.tagName === "TABLE" && r.push(d), r.forEach(function(i) {
      if (!i[h]) {
        var e = Array.from(i.querySelectorAll("th[" + c + "]"));
        e.length && (i[h] = new m(i, e));
      }
    });
  }
  function m(d, r) {
    this.table = d, this.ths = r, this._col = -1, this._dir = null;
    var i = this;
    return r.forEach(function(e, n) {
      e[h + "Bound"] || (e[h + "Bound"] = !0, e.addEventListener("click", function() {
        i._handleClick(n, e);
      }));
    }), this;
  }
  m.prototype._handleClick = function(d, r) {
    var i;
    this._col !== d ? i = "asc" : this._dir === "asc" ? i = "desc" : this._dir === "desc" ? i = null : i = "asc", this.ths.forEach(function(e) {
      e.removeAttribute(v);
    }), i === null ? (this._col = -1, this._dir = null) : (this._col = d, this._dir = i, r.setAttribute(v, i)), g(this.table, "ln-table:sort", {
      column: d,
      sortType: r.getAttribute(c),
      direction: i
    });
  };
  function g(d, r, i) {
    d.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: i || {}
    }));
  }
  function f() {
    var d = new MutationObserver(function(r) {
      r.forEach(function(i) {
        i.type === "childList" && i.addedNodes.forEach(function(e) {
          e.nodeType === 1 && _(e);
        });
      });
    });
    d.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[h] = p, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "data-ln-table", c = "lnTable", v = "data-ln-sort", p = "data-ln-table-empty";
  if (window[c] !== void 0) return;
  var g = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function f(n) {
    d(n);
  }
  function d(n) {
    var o = Array.from(n.querySelectorAll("[" + h + "]"));
    n.hasAttribute && n.hasAttribute(h) && o.push(n), o.forEach(function(t) {
      t[c] || (t[c] = new r(t));
    });
  }
  function r(n) {
    this.dom = n, this.table = n.querySelector("table"), this.tbody = n.querySelector("tbody"), this.thead = n.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    var o = n.querySelector(".ln-table__toolbar");
    o && n.style.setProperty("--ln-table-toolbar-h", o.offsetHeight + "px");
    var t = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      var s = new MutationObserver(function() {
        t.tbody.rows.length > 0 && (s.disconnect(), t._parseRows());
      });
      s.observe(this.tbody, { childList: !0 });
    }
    return n.addEventListener("ln-search:change", function(a) {
      a.preventDefault(), t._searchTerm = a.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), i(n, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }), n.addEventListener("ln-table:sort", function(a) {
      t._sortCol = a.detail.direction === null ? -1 : a.detail.column, t._sortDir = a.detail.direction, t._sortType = a.detail.sortType, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), i(n, "ln-table:sorted", {
        column: a.detail.column,
        direction: a.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }), this;
  }
  r.prototype._parseRows = function() {
    var n = this.tbody.rows, o = this.ths;
    this._data = [];
    for (var t = [], s = 0; s < o.length; s++)
      t[s] = o[s].getAttribute(v);
    n.length > 0 && (this._rowHeight = n[0].offsetHeight || 40), this._lockColumnWidths();
    for (var a = 0; a < n.length; a++) {
      for (var l = n[a], u = [], b = [], E = 0; E < l.cells.length; E++) {
        var w = l.cells[E], A = w.textContent.trim(), L = w.hasAttribute("data-ln-value") ? w.getAttribute("data-ln-value") : A, C = t[E];
        C === "number" || C === "date" ? u[E] = parseFloat(L) || 0 : C === "string" ? u[E] = String(L) : u[E] = null, E < l.cells.length - 1 && b.push(A.toLowerCase());
      }
      this._data.push({
        sortKeys: u,
        html: l.outerHTML,
        searchText: b.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), i(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, r.prototype._applyFilterAndSort = function() {
    if (!this._searchTerm)
      this._filteredData = this._data.slice();
    else {
      var n = this._searchTerm;
      this._filteredData = this._data.filter(function(l) {
        return l.searchText.indexOf(n) !== -1;
      });
    }
    if (!(this._sortCol < 0 || !this._sortDir)) {
      var o = this._sortCol, t = this._sortDir === "desc" ? -1 : 1, s = this._sortType === "number" || this._sortType === "date", a = g ? g.compare : function(l, u) {
        return l < u ? -1 : l > u ? 1 : 0;
      };
      this._filteredData.sort(function(l, u) {
        var b = l.sortKeys[o], E = u.sortKeys[o];
        return s ? (b - E) * t : a(b, E) * t;
      });
    }
  }, r.prototype._lockColumnWidths = function() {
    if (!(!this.table || !this.thead || this._colgroup)) {
      var n = document.createElement("colgroup");
      this.ths.forEach(function(o) {
        var t = document.createElement("col");
        t.style.width = o.offsetWidth + "px", n.appendChild(t);
      }), this.table.insertBefore(n, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = n;
    }
  }, r.prototype._render = function() {
    if (this.tbody) {
      var n = this._filteredData.length;
      n === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : n > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
    }
  }, r.prototype._renderAll = function() {
    for (var n = [], o = this._filteredData, t = 0; t < o.length; t++) n.push(o[t].html);
    this.tbody.innerHTML = n.join("");
  }, r.prototype._enableVirtualScroll = function() {
    if (!this._virtual) {
      this._virtual = !0;
      var n = this;
      this._scrollHandler = function() {
        n._rafId || (n._rafId = requestAnimationFrame(function() {
          n._rafId = null, n._renderVirtual();
        }));
      }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
    }
  }, r.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, r.prototype._renderVirtual = function() {
    var n = this._filteredData, o = n.length, t = this._rowHeight;
    if (!(!t || !o)) {
      var s = this.table.getBoundingClientRect(), a = s.top + window.scrollY, l = this.thead ? this.thead.offsetHeight : 0, u = a + l, b = window.scrollY - u, E = Math.max(0, Math.floor(b / t) - 15), w = Math.min(E + Math.ceil(window.innerHeight / t) + 30, o);
      if (!(E === this._vStart && w === this._vEnd)) {
        this._vStart = E, this._vEnd = w;
        var A = this.ths.length || 1, L = E * t, C = (o - w) * t, T = "";
        L > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>');
        for (var O = E; O < w; O++) T += n[O].html;
        C > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + A + '" style="height:' + C + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = T;
      }
    }
  }, r.prototype._showEmptyState = function() {
    var n = this.ths.length || 1, o = this.dom.querySelector("template[" + p + "]"), t = document.createElement("td");
    t.setAttribute("colspan", String(n)), o && t.appendChild(document.importNode(o.content, !0));
    var s = document.createElement("tr");
    s.className = "ln-table__empty", s.appendChild(t), this.tbody.innerHTML = "", this.tbody.appendChild(s), i(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  };
  function i(n, o, t) {
    n.dispatchEvent(new CustomEvent(o, { bubbles: !0, detail: t || {} }));
  }
  function e() {
    var n = new MutationObserver(function(o) {
      o.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(s) {
          s.nodeType === 1 && d(s);
        });
      });
    });
    n.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[c] = f, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const h = "[data-ln-circular-progress]", c = "lnCircularProgress";
  if (window[c] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", p = 36, _ = 16, m = 2 * Math.PI * _;
  function g(s) {
    d(s);
  }
  function f(s, a, l) {
    s.dispatchEvent(new CustomEvent(a, {
      bubbles: !0,
      detail: l || {}
    }));
  }
  function d(s) {
    const a = Array.from(s.querySelectorAll(h));
    for (const l of a)
      l[c] || (l[c] = new r(l));
    s.hasAttribute && s.hasAttribute("data-ln-circular-progress") && !s[c] && (s[c] = new r(s));
  }
  function r(s) {
    return this.dom = s, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, e.call(this), t.call(this), o.call(this), s.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  r.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[c]);
  };
  function i(s, a) {
    const l = document.createElementNS(v, s);
    for (const u in a)
      l.setAttribute(u, a[u]);
    return l;
  }
  function e() {
    this.svg = i("svg", {
      viewBox: "0 0 " + p + " " + p,
      "aria-hidden": "true"
    }), this.trackCircle = i("circle", {
      cx: p / 2,
      cy: p / 2,
      r: _,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = i("circle", {
      cx: p / 2,
      cy: p / 2,
      r: _,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function n() {
    new MutationObserver(function(a) {
      for (const l of a)
        if (l.type === "childList")
          for (const u of l.addedNodes)
            u.nodeType === 1 && d(u);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  n();
  function o() {
    const s = this, a = new MutationObserver(function(l) {
      for (const u of l)
        (u.attributeName === "data-ln-circular-progress" || u.attributeName === "data-ln-circular-progress-max") && t.call(s);
    });
    a.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = a;
  }
  function t() {
    const s = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, a = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let l = a > 0 ? s / a * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100);
    const u = m - l / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", u);
    const b = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = b !== null ? b : Math.round(l) + "%", f(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: s,
      max: a,
      percentage: l
    });
  }
  window[c] = g, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const h = "data-ln-sortable", c = "lnSortable", v = "data-ln-sortable-handle";
  if (window[c] !== void 0) return;
  function p(r) {
    _(r);
  }
  function _(r) {
    const i = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && i.push(r);
    for (const e of i)
      e[c] || (e[c] = new m(e));
  }
  function m(r) {
    this.dom = r, this.isEnabled = !0, this._dragging = null;
    const i = this;
    return this._onPointerDown = function(e) {
      i.isEnabled && i._handlePointerDown(e);
    }, r.addEventListener("pointerdown", this._onPointerDown), this._onRequestEnable = function() {
      i.enable();
    }, this._onRequestDisable = function() {
      i.disable();
    }, r.addEventListener("ln-sortable:request-enable", this._onRequestEnable), r.addEventListener("ln-sortable:request-disable", this._onRequestDisable), this;
  }
  m.prototype.enable = function() {
    this.isEnabled = !0;
  }, m.prototype.disable = function() {
    this.isEnabled = !1;
  }, m.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), this.dom.removeEventListener("ln-sortable:request-enable", this._onRequestEnable), this.dom.removeEventListener("ln-sortable:request-disable", this._onRequestDisable), g(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[c]);
  }, m.prototype._handlePointerDown = function(r) {
    let i = r.target.closest("[" + v + "]"), e;
    if (i) {
      for (e = i; e && e.parentElement !== this.dom; )
        e = e.parentElement;
      if (!e || e.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (e = r.target; e && e.parentElement !== this.dom; )
        e = e.parentElement;
      if (!e || e.parentElement !== this.dom) return;
      i = e;
    }
    const o = Array.from(this.dom.children).indexOf(e);
    if (f(this.dom, "ln-sortable:before-drag", {
      item: e,
      index: o
    }).defaultPrevented) return;
    r.preventDefault(), i.setPointerCapture(r.pointerId), this._dragging = e, e.classList.add("ln-sortable--dragging"), this.dom.classList.add("ln-sortable--active"), g(this.dom, "ln-sortable:drag-start", {
      item: e,
      index: o
    });
    const s = this, a = function(u) {
      s._handlePointerMove(u);
    }, l = function(u) {
      s._handlePointerEnd(u), i.removeEventListener("pointermove", a), i.removeEventListener("pointerup", l), i.removeEventListener("pointercancel", l);
    };
    i.addEventListener("pointermove", a), i.addEventListener("pointerup", l), i.addEventListener("pointercancel", l);
  }, m.prototype._handlePointerMove = function(r) {
    if (!this._dragging) return;
    const i = Array.from(this.dom.children), e = this._dragging;
    for (const n of i)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of i) {
      if (n === e) continue;
      const o = n.getBoundingClientRect(), t = o.top + o.height / 2;
      if (r.clientY >= o.top && r.clientY < t) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (r.clientY >= t && r.clientY <= o.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(r) {
    if (!this._dragging) return;
    const i = this._dragging, e = Array.from(this.dom.children), n = e.indexOf(i);
    let o = null, t = null;
    for (const s of e) {
      if (s.classList.contains("ln-sortable--drop-before")) {
        o = s, t = "before";
        break;
      }
      if (s.classList.contains("ln-sortable--drop-after")) {
        o = s, t = "after";
        break;
      }
    }
    for (const s of e)
      s.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (i.classList.remove("ln-sortable--dragging"), this.dom.classList.remove("ln-sortable--active"), o && o !== i) {
      t === "before" ? this.dom.insertBefore(i, o) : this.dom.insertBefore(i, o.nextElementSibling);
      const a = Array.from(this.dom.children).indexOf(i);
      g(this.dom, "ln-sortable:reordered", {
        item: i,
        oldIndex: n,
        newIndex: a
      });
    }
    this._dragging = null;
  };
  function g(r, i, e) {
    r.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function f(r, i, e) {
    const n = new CustomEvent(i, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return r.dispatchEvent(n), n;
  }
  function d() {
    new MutationObserver(function(i) {
      for (const e of i)
        if (e.type === "childList")
          for (const n of e.addedNodes)
            n.nodeType === 1 && _(n);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = p, d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "data-ln-confirm", c = "lnConfirm";
  if (window[c] !== void 0) return;
  function p(d) {
    _(d);
  }
  function _(d) {
    const r = Array.from(d.querySelectorAll("[" + h + "]"));
    d.hasAttribute && d.hasAttribute(h) && r.push(d);
    for (const i of r)
      i[c] || (i[c] = new m(i));
  }
  function m(d) {
    this.dom = d, this.confirming = !1, this.originalText = d.textContent.trim(), this.confirmText = d.getAttribute(h) || "Confirm?", this.revertTimer = null;
    const r = this;
    return this._onClick = function(i) {
      r.confirming ? r._reset() : (i.preventDefault(), i.stopImmediatePropagation(), r._enterConfirm());
    }, d.addEventListener("click", this._onClick), this;
  }
  m.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.dom.className.match(/ln-icon-/) && this.originalText === "" ? (this.isIconButton = !0, this.originalIconClass = Array.from(this.dom.classList).find((r) => r.startsWith("ln-icon-")), this.originalIconClass && this.dom.classList.remove(this.originalIconClass), this.dom.classList.add("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText;
    var d = this;
    this.revertTimer = setTimeout(function() {
      d._reset();
    }, 3e3), g(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._reset = function() {
    this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton ? (this.dom.classList.remove("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.originalIconClass && this.dom.classList.add(this.originalIconClass), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1) : this.dom.textContent = this.originalText, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    this.dom[c] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[c]);
  };
  function g(d, r, i) {
    d.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: i || {}
    }));
  }
  function f() {
    var d = new MutationObserver(function(r) {
      for (var i = 0; i < r.length; i++)
        if (r[i].type === "childList")
          for (var e = 0; e < r[i].addedNodes.length; e++) {
            var n = r[i].addedNodes[e];
            n.nodeType === 1 && _(n);
          }
    });
    d.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = p, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "data-ln-translations", c = "lnTranslations";
  if (window[c] !== void 0) return;
  var v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  }, p = {};
  function _(e) {
    return p[e] || (p[e] = document.querySelector('[data-ln-template="' + e + '"]')), p[e].content.cloneNode(!0);
  }
  function m(e) {
    g(e);
  }
  function g(e) {
    const n = Array.from(e.querySelectorAll("[" + h + "]"));
    e.hasAttribute && e.hasAttribute(h) && n.push(e);
    for (const o of n)
      o[c] || (o[c] = new f(o));
  }
  function f(e) {
    this.dom = e, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = e.getAttribute(h + "-default") || "", this.badgesEl = e.querySelector("[" + h + "-active]"), this.menuEl = e.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this._applyDefaultLang(), this._updateDropdown();
    const n = this;
    return this._onRequestAdd = function(o) {
      o.detail && o.detail.lang && n.addLanguage(o.detail.lang);
    }, this._onRequestRemove = function(o) {
      o.detail && o.detail.lang && n.removeLanguage(o.detail.lang);
    }, e.addEventListener("ln-translations:request-add", this._onRequestAdd), e.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  f.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const e = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const n of e) {
      const o = n.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const t of o)
        t.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, f.prototype._detectExisting = function() {
    const e = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of e) {
      const o = n.getAttribute("data-ln-translatable-lang");
      o && o !== this.defaultLang && this.activeLanguages.add(o);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, f.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const e = this;
    let n = 0;
    for (const t in v) {
      if (!v.hasOwnProperty(t) || this.activeLanguages.has(t)) continue;
      n++;
      const s = _("ln-translations-menu-item"), a = s.querySelector("[data-ln-translations-lang]");
      a.setAttribute("data-ln-translations-lang", t), a.textContent = v[t], a.addEventListener("click", function(l) {
        l.ctrlKey || l.metaKey || l.button === 1 || (l.preventDefault(), l.stopPropagation(), e.menuEl.dispatchEvent(new CustomEvent("ln-toggle:request-close")), e.addLanguage(t));
      }), this.menuEl.appendChild(s);
    }
    var o = this.dom.querySelector("[" + h + "-add]");
    o && (o.style.display = n === 0 ? "none" : "");
  }, f.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const e = this;
    this.activeLanguages.forEach(function(n) {
      const o = _("ln-translations-badge"), t = o.querySelector("[data-ln-translations-lang]");
      t.setAttribute("data-ln-translations-lang", n);
      const s = t.querySelector("span");
      s.textContent = v[n] || n.toUpperCase();
      const a = t.querySelector("button");
      a.setAttribute("aria-label", "Remove " + (v[n] || n.toUpperCase())), a.addEventListener("click", function(l) {
        l.ctrlKey || l.metaKey || l.button === 1 || (l.preventDefault(), l.stopPropagation(), e.removeLanguage(n));
      }), e.badgesEl.appendChild(o);
    });
  }, f.prototype.addLanguage = function(e, n) {
    if (this.activeLanguages.has(e)) return;
    const o = v[e] || e;
    if (r(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: e,
      langName: o
    }).defaultPrevented) return;
    this.activeLanguages.add(e), n = n || {};
    const s = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const a of s) {
      const l = a.getAttribute("data-ln-translatable"), u = a.getAttribute("data-ln-translations-prefix") || "", b = a.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!b) continue;
      const E = b.cloneNode(!1);
      u ? E.name = u + "[trans][" + e + "][" + l + "]" : E.name = "trans[" + e + "][" + l + "]", E.value = n[l] !== void 0 ? n[l] : "", E.removeAttribute("id"), E.placeholder = o + " translation", E.setAttribute("data-ln-translatable-lang", e);
      const w = a.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), A = w.length > 0 ? w[w.length - 1] : b;
      A.parentNode.insertBefore(E, A.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), d(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: e,
      langName: o
    });
  }, f.prototype.removeLanguage = function(e) {
    if (!this.activeLanguages.has(e) || r(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: e
    }).defaultPrevented) return;
    const o = this.dom.querySelectorAll('[data-ln-translatable-lang="' + e + '"]');
    for (const t of o)
      t.parentNode.removeChild(t);
    this.activeLanguages.delete(e), this._updateDropdown(), this._updateBadges(), d(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: e
    });
  }, f.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, f.prototype.hasLanguage = function(e) {
    return this.activeLanguages.has(e);
  }, f.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const e = this.defaultLang, n = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const o of n)
      o.getAttribute("data-ln-translatable-lang") !== e && o.parentNode.removeChild(o);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[c];
  };
  function d(e, n, o) {
    e.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: o || {}
    }));
  }
  function r(e, n, o) {
    const t = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: o || {}
    });
    return e.dispatchEvent(t), t;
  }
  function i() {
    new MutationObserver(function(n) {
      for (const o of n)
        if (o.type === "childList")
          for (const t of o.addedNodes)
            t.nodeType === 1 && g(t);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = m, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-autosave", c = "lnAutosave", v = "data-ln-autosave-clear", p = "ln-autosave:";
  if (window[c] !== void 0) return;
  function _(t) {
    m(t);
  }
  function m(t) {
    const s = Array.from(t.querySelectorAll("[" + h + "]"));
    t.hasAttribute && t.hasAttribute(h) && s.push(t);
    for (const a of s)
      a[c] || (a[c] = new g(a));
  }
  function g(t) {
    var s = f(t);
    if (!s) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = s;
    var a = this;
    return this._onFocusout = function(l) {
      var u = l.target;
      d(u) && u.name && a.save();
    }, this._onChange = function(l) {
      var u = l.target;
      d(u) && u.name && a.save();
    }, this._onSubmit = function() {
      a.clear();
    }, this._onReset = function() {
      a.clear();
    }, this._onClearClick = function(l) {
      var u = l.target.closest("[" + v + "]");
      u && a.clear();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  g.prototype.save = function() {
    var t = r(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(t));
    } catch {
      return;
    }
    e(this.dom, "ln-autosave:saved", { target: this.dom, data: t });
  }, g.prototype.restore = function() {
    var t;
    try {
      t = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (t) {
      var s;
      try {
        s = JSON.parse(t);
      } catch {
        return;
      }
      var a = n(this.dom, "ln-autosave:before-restore", { target: this.dom, data: s });
      a.defaultPrevented || (i(this.dom, s), e(this.dom, "ln-autosave:restored", { target: this.dom, data: s }));
    }
  }, g.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    e(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, g.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), e(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function f(t) {
    var s = t.getAttribute(h), a = s || t.id;
    return a ? p + window.location.pathname + ":" + a : null;
  }
  function d(t) {
    var s = t.tagName;
    return s === "INPUT" || s === "TEXTAREA" || s === "SELECT";
  }
  function r(t) {
    for (var s = {}, a = t.elements, l = 0; l < a.length; l++) {
      var u = a[l];
      if (!(!u.name || u.disabled || u.type === "file" || u.type === "submit" || u.type === "button"))
        if (u.type === "checkbox")
          s[u.name] || (s[u.name] = []), u.checked && s[u.name].push(u.value);
        else if (u.type === "radio")
          u.checked && (s[u.name] = u.value);
        else if (u.type === "select-multiple") {
          s[u.name] = [];
          for (var b = 0; b < u.options.length; b++)
            u.options[b].selected && s[u.name].push(u.options[b].value);
        } else
          s[u.name] = u.value;
    }
    return s;
  }
  function i(t, s) {
    for (var a = t.elements, l = [], u = 0; u < a.length; u++) {
      var b = a[u];
      if (!(!b.name || !(b.name in s) || b.type === "file" || b.type === "submit" || b.type === "button")) {
        var E = s[b.name];
        if (b.type === "checkbox")
          b.checked = Array.isArray(E) && E.indexOf(b.value) !== -1, l.push(b);
        else if (b.type === "radio")
          b.checked = b.value === E, l.push(b);
        else if (b.type === "select-multiple") {
          if (Array.isArray(E))
            for (var w = 0; w < b.options.length; w++)
              b.options[w].selected = E.indexOf(b.options[w].value) !== -1;
          l.push(b);
        } else
          b.value = E, l.push(b);
      }
    }
    for (var A = 0; A < l.length; A++)
      l[A].dispatchEvent(new Event("input", { bubbles: !0 })), l[A].dispatchEvent(new Event("change", { bubbles: !0 })), l[A].lnSelect && l[A].lnSelect.setValue && l[A].lnSelect.setValue(s[l[A].name]);
  }
  function e(t, s, a) {
    t.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: a || {}
    }));
  }
  function n(t, s, a) {
    var l = new CustomEvent(s, {
      bubbles: !0,
      cancelable: !0,
      detail: a || {}
    });
    return t.dispatchEvent(l), l;
  }
  function o() {
    var t = new MutationObserver(function(s) {
      for (var a = 0; a < s.length; a++)
        if (s[a].type === "childList")
          for (var l = s[a].addedNodes, u = 0; u < l.length; u++)
            l[u].nodeType === 1 && m(l[u]);
    });
    t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = _, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
